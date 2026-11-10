import test from 'node:test';import assert from 'node:assert/strict';
import {ProvinceRace}from'../core/game.mjs';import{validateRaceConfig}from'../public/race-config.mjs';
import{speechSegments,prepareSpokenText}from'../public/mc-delivery.mjs';
import{VoiceJobs}from'../core/voice-jobs.mjs';
test('một lần chạy tự lặp qua ba vòng, hết vòng tắt đèn, giữ kết quả để vinh danh, pause không tự chạy',()=>{
 const r=new ProvinceRace({},validateRaceConfig({duration:30,countdown:0,rest:0,winnerIntroDuration:6,winnerDuration:8,autoLightEnabled:false}));r.start();
 for(let i=0;i<3;i++){const id=r.roundId;r.comment({userId:'a',nickname:'An',comment:'Thanh Hóa'});r.advance(30);assert.equal(r.phase,'RESULTS');assert.equal(r.litHomes.size,0);assert.equal(r.result.lit,1);assert.equal(r.result.winners[0].origin,'Thanh Hóa');r.advance(14.1);assert.equal(r.phase,'RACING');assert.notEqual(r.roundId,id);assert.equal(r.remaining,30);assert.equal(r.scores.size,0);assert.equal(r.litHomes.size,0);}
 r.pause();r.advance(1000);assert.equal(r.phase,'PAUSED');assert.equal(r.remaining,30);
});
test('giữ đoạn nói có nhịp, làm sạch tên cho giọng nhưng giữ nguyên tên hiển thị, giữ mẫu thoại riêng',()=>{
 const text='Cả nhà ơi! Thanh Hóa lên đèn rồi nhé. Đồng hương mình cùng vào tiếp sức nào.';assert.deepEqual(speechSegments(text),[text]);
 assert.equal(prepareSpokenText('Cảm ơn 🌹_Minh_Anh_1990! Quê mình thêm 1.500 điểm.',{name:'🌹_Minh_Anh_1990'}),'Cảm ơn Minh Anh! Quê mình thêm 1500 điểm.');
 const custom=['Một lời riêng của chủ phòng.'];assert.deepEqual(validateRaceConfig({mcLibraryVersion:3,templates:{roomWelcome:custom}}).templates.roomWelcome,custom);
 assert.ok(validateRaceConfig().templates.giftQuick.length>=4);
});
test('tạm dừng cả đoạn vinh danh, không tăng giờ rồi tiếp tục đúng cảnh',()=>{
 const r=new ProvinceRace({},validateRaceConfig({countdown:0,duration:30}));r.start();r.comment({userId:'a',comment:'Nghệ An'});r.advance(30);const scene=r.active.id,clock=r.clock;r.pause();r.advance(200);assert.equal(r.phase,'PAUSED');assert.equal(r.clock,clock);assert.equal(r.active.id,scene);r.pause();assert.equal(r.phase,'RESULTS');assert.equal(r.active.id,scene);assert.equal(r.announcements.at(-1).type,'winnerVisit');
});
test('tạo giọng có một lane, ưu tiên quà và hủy lượt chờ mà không chồng yêu cầu',async()=>{
 const q=new VoiceJobs(),order=[];let release,active=0,max=0;const first=q.run(async()=>{active++;max=Math.max(max,active);await new Promise(r=>release=r);active--;order.push('first');});const low=q.run(async()=>order.push('low'),{priority:1});const high=q.run(async()=>order.push('gift'),{priority:8});const c=new AbortController();const cancelled=q.run(async()=>order.push('cancelled'),{signal:c.signal});const check=assert.rejects(cancelled);c.abort();release();await Promise.all([first,low,high,check]);assert.equal(max,1);assert.deepEqual(order,['first','gift','low']);const parallel=new VoiceJobs(2);let busy=0,peak=0;await Promise.all(Array.from({length:6},()=>parallel.run(async()=>{busy++;peak=Math.max(peak,busy);await new Promise(r=>setTimeout(r,10));busy--;})));assert.equal(peak,2);
});
