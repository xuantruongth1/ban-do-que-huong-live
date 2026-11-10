import {demoPeople} from './demo-people.mjs';
import {raceEffects} from './regions.mjs';import {backgroundDesigns}from'./backgrounds.mjs';
export const demoTimeline=[
 [0,'Chào phòng và bắt đầu', 'welcome'],[4,'Bình luận: thắp đèn, +1 và zoom','comment'],[8,'Đồng hương hội tụ','crowd'],[14,'Hoa hồng: ảnh và giới thiệu quê','roses'],[30,'Bắn tim bay khắp quê','hearts'],[42,'TikTok: camera bay quanh quê','orbit'],[54,'Bánh vòng: pháo hoa','fireworks'],[68,'Nước hoa: đại chiến hai quê','battle'],[92,'Rồng vàng cuộn dọc chữ S','dragon'],[112,'Quà lớn thắp sáng toàn bản đồ','allMap'],[130,'Tranh ngôi vua tỉnh, điểm cộng','king'],[140,'Nước rút và bám đuổi','chase'],[150,'Chốt vòng, giới thiệu quê thắng','finish'],[163,'Chiếu video đã gán hoặc phim demo','video'],[180,'Hoàn tất demo','done']
];
export function createDemoShow({getGame,setGame,makeGame,settings,catalog,regions,send,frame}){
 let running=false,elapsed=0,cursor=0,lastBackground=-1;const status=document.getElementById('demo-show-status'),start=document.getElementById('demo-show-start'),stop=document.getElementById('demo-show-stop'),meter=document.getElementById('demo-show-progress'),history=[];
 const home=name=>regions().find(r=>r.name===name)||regions()[0];
 function comment(uid,name,province){getGame().comment({userId:uid,nickname:name,comment:province,msgId:crypto.randomUUID()});}
 function gift(effect,qty=1){const g=getGame(),rule=settings.rules.find(r=>r.action===effect),icon=catalog.gifts.find(x=>x.tiktokGiftId===rule.giftId);g.skip();g.gift({userId:'demo-mai',nickname:'Nguyễn Minh Anh',giftId:icon.tiktokGiftId,giftName:icon.name,diamondCount:icon.coins??0,repeatCount:qty,msgId:crypto.randomUUID()},settings.rules);}
 function run(type){const g=getGame(),th=home('Thanh Hóa').name,na=home('Nghệ An').name;
 if(type==='welcome')g.announce('roomWelcome',{},8);
 if(type==='comment')comment('demo-mai','Nguyễn Minh Anh',th);
 if(type==='crowd'){comment('demo-lan','Trần Ngọc Lan',th);comment('demo-an','Lê Đức An',na);comment('demo-hai','Phạm Quang Hải',home('Hà Nội').name);for(let i=4;i<demoPeople.length;i++)comment('demo-person-'+i,demoPeople[i],home(['Thanh Hóa','Nghệ An','Hà Nội','Đà Nẵng','Cần Thơ','Hà Tĩnh','Quảng Ninh','Đồng Nai'][i%8]).name);}
 if(raceEffects.some(e=>e.id===type))gift(type);
 if(type==='allMap'){const icon=catalog.gifts.find(x=>x.coins>=g.config.allMapThreshold);g.skip();g.gift({userId:'demo-mai',nickname:'Nguyễn Minh Anh',giftId:icon.tiktokGiftId,giftName:icon.name,diamondCount:icon.coins,repeatCount:1,msgId:crypto.randomUUID()},settings.rules);}
 if(type==='king'){comment('demo-lan','Trần Ngọc Lan',th);g.skip();const rose=catalog.gifts.find(x=>x.tiktokGiftId==='5655');g.gift({userId:'demo-lan',nickname:'Trần Ngọc Lan',giftId:'5655',giftName:rose.name,diamondCount:rose.coins,repeatCount:300,msgId:crypto.randomUUID()},[]);}
 if(type==='chase'){for(let i=0;i<4;i++)comment('demo-an','Lê Đức An',na);g.announce('progress',{},6);}
 if(type==='finish'&&['RACING','COUNTDOWN','PAUSED'].includes(g.phase)){g.remaining=0;g.finish('demo');}
 if(type==='video'){while(g.active&&g.active.action!=='winner')g.skip();}
 history.push(type);send();
 }
 function lock(value){for(const el of document.querySelectorAll('#lab-gifts button,[data-fast],#lab-start,#lab-pause,#lab-finish,#lab-reset,#lab-one,#lab-all,#lab-people,#lab-comment,#lab-last10,#lab-map-mode'))el.disabled=value;}
 function halt(done=false){lock(false);running=false;start.disabled=false;stop.disabled=true;status.textContent=done?'Đã chạy đủ demo 3 phút. Có thể chạy lại.':'Đã dừng demo. Dữ liệu LIVE giữ nguyên.';if(frame.contentWindow?.hometownAudio?.owned)frame.contentWindow.document.getElementById('audio-toggle')?.click();}
 start.onclick=()=>{settings.rules=raceEffects.map(e=>({action:e.id,giftId:e.defaultGiftId,threshold:1,duration:e.duration,enabled:true}));const g=makeGame({duration:150,countdown:0,autoLightEnabled:false,winnerIntroDuration:12,winnerDuration:18,rest:0,autoNext:false});setGame(g);g.start();const th=home('Thanh Hóa');if(!settings.videos[th.id])settings.videos[th.id]={id:'demo-home',demoUrl:'/assets/demo-home.mp4',demo:true};lock(true);running=true;elapsed=0;cursor=0;lastBackground=-1;history.length=0;start.disabled=true;stop.disabled=false;meter.value=0;send();if(!frame.contentWindow?.hometownAudio?.owned)frame.contentWindow?.document.getElementById('audio-toggle')?.click();};
 stop.onclick=()=>{if(running){halt();getGame().pause();send();}};
 return {get running(){return running;},tick(dt){if(!running)return;elapsed=Math.min(180,elapsed+dt);const index=Math.min(7,Math.floor(elapsed/18));if(index!==lastBackground){lastBackground=index;settings.raceConfig.backgroundPreset=backgroundDesigns[index].id;const select=document.getElementById('lab-background');select.value=backgroundDesigns[index].id;select.dispatchEvent(new Event('change'));}while(cursor<demoTimeline.length&&elapsed>=demoTimeline[cursor][0]){const[,label,type]=demoTimeline[cursor++];status.textContent=`${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')} / 3:00 · ${label}`;if(type==='done'){halt(true);break;}run(type);}meter.value=elapsed;window.demoShowStatus={running,elapsed,history:[...history]};},stop:()=>{if(running)halt();},start:()=>start.click()};
}
