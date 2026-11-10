import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Hometown} from '../core/game.mjs';
import {parsePlate,plateIndex,provinces,hometowns} from '../public/provinces.mjs';
const person=(uid,plate)=>({userId:uid,nickname:'Đồng hương '+uid,comment:plate});
test('63 tỉnh cũ, 34 tỉnh mới, bảng mã cũ đầy đủ và không lẫn mã hành chính',()=>{
 assert.equal(hometowns.length,63);assert.equal(provinces.length,34);
 const expected=[['11','Cao Bằng'],['12','Lạng Sơn'],['14','Quảng Ninh'],['15,16','Hải Phòng'],['17','Thái Bình'],['18','Nam Định'],['19','Phú Thọ'],['20','Thái Nguyên'],['21','Yên Bái'],['22','Tuyên Quang'],['23','Hà Giang'],['24','Lào Cai'],['25','Lai Châu'],['26','Sơn La'],['27','Điện Biên'],['28','Hòa Bình'],['29,30,31,32,33,40','Hà Nội'],['34','Hải Dương'],['35','Ninh Bình'],['36','Thanh Hóa'],['37','Nghệ An'],['38','Hà Tĩnh'],['39,60','Đồng Nai'],['41,50,51,52,53,54,55,56,57,58,59','TP. Hồ Chí Minh'],['43','Đà Nẵng'],['47','Đắk Lắk'],['48','Đắk Nông'],['49','Lâm Đồng'],['61','Bình Dương'],['62','Long An'],['63','Tiền Giang'],['64','Vĩnh Long'],['65','Cần Thơ'],['66','Đồng Tháp'],['67','An Giang'],['68','Kiên Giang'],['69','Cà Mau'],['70','Tây Ninh'],['71','Bến Tre'],['72','Bà Rịa – Vũng Tàu'],['73','Quảng Bình'],['74','Quảng Trị'],['75','Thừa Thiên Huế'],['76','Quảng Ngãi'],['77','Bình Định'],['78','Phú Yên'],['79','Khánh Hòa'],['81','Gia Lai'],['82','Kon Tum'],['83','Sóc Trăng'],['84','Trà Vinh'],['85','Ninh Thuận'],['86','Bình Thuận'],['88','Vĩnh Phúc'],['89','Hưng Yên'],['90','Hà Nam'],['92','Quảng Nam'],['93','Bình Phước'],['94','Bạc Liêu'],['95','Hậu Giang'],['97','Bắc Kạn'],['98','Bắc Giang'],['99','Bắc Ninh']];
 let count=0;for(const [codes,name]of expected)for(const code of codes.split(',')){assert.equal(parsePlate(code)?.origin,name,code);count++;}assert.equal(count,plateIndex.size);
 for(const invalid of ['00','10','13','42','44','45','46','80','87','91','96','0961234567','quê 36','36 37','tôi ở 36','036','36abc'])assert.equal(parsePlate(invalid),null,invalid);
 assert.equal(parsePlate(' 92 ').origin,'Quảng Nam');assert.equal(parsePlate('92').provinceName,'Đà Nẵng');assert.notEqual(parsePlate('92').homeId,parsePlate('43').homeId);
});
test('mỗi mã được gắn polygon cũ riêng; các tỉnh sáp nhập không zoom nhầm',async()=>{
 const maps=JSON.parse(await readFile(new URL('../public/map.json',import.meta.url),'utf8'));assert.equal(maps.length,63);assert.equal(new Set(maps.map(p=>p.id)).size,63);
 for(const p of plateIndex.values()){const m=maps.find(m=>m.id===p.homeId);assert.ok(m,p.plate);assert.equal(m.name,p.origin);assert.ok(m.path.length>50);assert.ok(m.bounds.every(Number.isFinite));assert.ok(m.center.every(Number.isFinite));}
 for(const [a,b]of [['92','43'],['17','89'],['61','50'],['34','15'],['28','19'],['21','24']]){const x=maps.find(m=>m.id===parsePlate(a).homeId),y=maps.find(m=>m.id===parsePlate(b).homeId);assert.notDeepEqual(x.bounds,y.bounds);assert.notEqual(x.path,y.path);}
});
test('UID đổi mã sau cooldown, không đếm trùng và giữ tỉnh cũ/tỉnh hiện nay',()=>{
 const g=new Hometown();assert.equal(g.comment(person('u','92')),true);assert.equal(g.comment(person('u','43')),false);g.advance(3);assert.equal(g.comment(person('u','43')),true);assert.equal(g.players.size,1);assert.equal(g.players.get('u').origin,'Đà Nẵng');g.advance(3);g.comment(person('u','92'));assert.equal(g.players.get('u').provinceName,'Đà Nẵng');assert.equal(g.players.get('u').origin,'Quảng Nam');assert.ok(g.snapshot().litHomes.includes(parsePlate('92').homeId));assert.ok(g.snapshot().litHomes.includes(parsePlate('43').homeId));
 g.comment(person('other','43'));assert.equal(g.snapshot().groups.length,2);assert.equal(g.snapshot().modernGroups.length,1);
 const reloaded=new Hometown(g.export());assert.equal(reloaded.players.get('u').origin,'Quảng Nam');assert.equal(reloaded.players.size,2);
});
test('combo chốt đúng một lần, ngưỡng quà, không tự chọn quê cho người chưa điểm danh',()=>{
 const g=new Hometown();g.comment(person('u','92'));const rules=[{action:'honor',giftId:'5655',threshold:2}],gift={userId:'u',giftId:'5655',giftName:'Hoa hồng',groupId:'combo',giftType:1,repeatEnd:false,repeatCount:3,diamondCount:1};g.gift(gift,rules);assert.equal(g.active,null);g.gift({...gift,repeatEnd:true},rules);assert.equal(g.active.homeId,parsePlate('92').homeId);assert.equal(g.players.get('u').coins,3);g.gift({...gift,repeatEnd:true},rules);assert.equal(g.players.get('u').coins,3);assert.equal(g.queue.length,0);
 g.gift({...gift,groupId:'next',repeatCount:1,repeatEnd:true},rules);assert.equal(g.queue.length,1);assert.equal(g.ledger.remainders.values().next().value,0);
 g.gift({...gift,userId:'stranger',groupId:'stranger',repeatEnd:true},rules);assert.equal(g.players.has('stranger'),false);assert.equal(g.queue.length,1);
 const missing=g.gift({...gift,groupId:'',msgId:'',repeatEnd:true},rules);assert.equal(missing.unverified,true);
 const reload=new Hometown(g.export());reload.gift({...gift,repeatEnd:true},rules);assert.equal(reload.players.get('u').coins,4);assert.equal(reload.active,null);
});
test('5 timeline nối tiếp, bỏ qua và bảo toàn quê tại thời điểm nhận quà',()=>{
 const g=new Hometown();g.comment(person('u','92'));for(const e of ['honor','light','film','connect','vietnam'])assert.equal(g.enqueue(e,'u'),true);assert.equal(g.active.action,'honor');assert.equal(g.queue.length,4);g.advance(3);g.comment(person('u','43'));assert.equal(g.active.origin,'Quảng Nam');assert.equal(g.queue[0].origin,'Quảng Nam');g.advance(3);assert.equal(g.active.action,'light');g.skip();assert.equal(g.active.action,'film');g.advance(18);assert.equal(g.active.action,'connect');g.advance(10);assert.equal(g.active.action,'vietnam');g.advance(20);assert.equal(g.active,null);
});
test('10000 người, 63 cụm và hàng đợi hữu hạn khi quà dồn',()=>{
 const g=new Hometown();for(let i=0;i<10000;i++)g.comment(person('u'+i,hometowns[i%63].plates[0]));assert.equal(g.snapshot().total,10000);assert.equal(g.snapshot().groups.length,63);assert.equal(g.comment(person('overflow','36')),false);for(let i=0;i<200;i++)g.enqueue(i%2?'light':'honor','u0');assert.equal(g.queue.length,100);assert.equal(g.snapshot().groups.reduce((n,v)=>n+v.count,0),10000);assert.ok(g.snapshot().groups.every(g=>g.avatars.length<=5));
});
test('đổi quê không chuyển xu đã tặng sang tỉnh khác',()=>{const g=new Hometown();g.comment(person('u','92'));g.gift({userId:'u',giftId:'5655',msgId:'score1',diamondCount:1,repeatCount:9},[]);g.advance(3);g.comment(person('u','43'));const s=g.snapshot();assert.equal(s.top[0].origin,'Quảng Nam');assert.equal(s.top[0].coins,9);assert.equal(s.groups.find(g=>g.origin==='Đà Nẵng').coins,0);const reloaded=new Hometown(g.export());assert.equal(reloaded.snapshot().top[0].origin,'Quảng Nam');});

test('một bình luận thắp sáng tỉnh suốt phiên, đổi mã và mở lại vẫn sáng',()=>{
 const g=new Hometown();assert.equal(g.snapshot().litHomes.length,0);g.comment(person('u','92'));assert.deepEqual(g.snapshot().litHomes,['old-92']);g.advance(3);g.comment(person('u','43'));assert.equal(g.snapshot().litHomes.length,2);assert.equal(g.snapshot().groups.find(g=>g.homeId==='old-92').count,0);g.advance(3);g.comment(person('u','92'));assert.equal(g.snapshot().groups.find(g=>g.homeId==='old-92').checkins,1);assert.equal(new Hometown(g.export()).snapshot().litHomes.length,2);
});
test('đủ 10 phút không có quà tự vi hành tỉnh điểm cao nhất; lặp lại sau 10 phút',()=>{
 const g=new Hometown();g.comment(person('a','92'));g.comment(person('b','36'));g.comment(person('c','36'));g.advance(599);assert.equal(g.active,null);assert.equal(g.snapshot().tour.dueIn,1);g.advance(1);assert.equal(g.active.action,'tour');assert.equal(g.active.homeId,'old-36');assert.equal(g.active.points,2);assert.equal(g.active.automatic,true);g.advance(24);assert.equal(g.active,null);g.advance(576);assert.equal(g.active.action,'tour');assert.equal(g.tourCount,2);
});
test('quà ưu tiên trước vi hành và đặt lại 10 phút kể cả chưa gán hiệu ứng',()=>{
 const g=new Hometown();g.comment(person('a','92'));g.advance(600);assert.equal(g.active.action,'tour');g.gift({userId:'a',giftId:'5655',msgId:'interrupt',repeatCount:5,diamondCount:1},[]);assert.equal(g.active,null);assert.equal(g.snapshot().tour.dueIn,600);assert.equal(g.snapshot().top[0].points,6);g.advance(599);assert.equal(g.active,null);g.gift({userId:'a',giftId:'5655',msgId:'interrupt',repeatCount:5,diamondCount:1},[]);assert.equal(g.snapshot().tour.dueIn,1);g.advance(1);assert.equal(g.active.action,'tour');g.gift({userId:'a',giftId:'5655',groupId:'pending',giftType:1,repeatEnd:false,repeatCount:1},[]);assert.equal(g.active,null);assert.equal(g.snapshot().tour.dueIn,600);
});
test('điểm danh một UID/một quê chỉ tính một điểm, không farm bằng lặp mã',()=>{
 const g=new Hometown();g.comment(person('a','92'));g.advance(3);g.comment(person('a','92'));assert.equal(g.snapshot().top[0].points,1);g.comment(person('b','92'));assert.equal(g.snapshot().top[0].points,2);const p=new Hometown(g.export());assert.equal(p.snapshot().top[0].points,2);
});
test('room trống không vi hành; cảnh quà đang chạy xong rồi mới vi hành',()=>{
 const empty=new Hometown();empty.advance(600);assert.equal(empty.active,null);const g=new Hometown();g.comment(person('a','36'));g.advance(599);g.enqueue('honor','a');g.advance(1);assert.equal(g.active.action,'honor');g.advance(5);assert.equal(g.active.action,'tour');
});
