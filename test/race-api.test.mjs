import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startServer,api} from './helpers.mjs';
test('API vòng đua mới, cấu hình, gán sáu quà, nguồn và dữ liệu riêng',async()=>{
 const {base,child,data}=await startServer(3203);try{
 let s=await fetch(base+'/api/state').then(r=>r.json());assert.equal(s.phase,'WAITING');assert.equal(s.settings.raceConfig.duration,300);assert.equal(s.settings.rules.length,6);assert.equal(s.settings.rules.find(r=>r.action==='dragon').giftId,'5660');
 const config={...s.settings.raceConfig,countdown:0,duration:30,commentCooldown:0};assert.equal((await api(base,'settings',{settings:{raceConfig:config}})).status,200);await api(base,'start');await api(base,'comment',{uid:'a',name:'Khách QA',text:'Thanh Hóa'});s=(await api(base,'gift',{uid:'a',giftId:'5655',quantity:1})).state;assert.equal(s.top[0].points,4);assert.equal(s.active.action,'roses');
 assert.equal((await api(base,'mode',{mode:'LIVE'})).status,400);await api(base,'pause');s=(await api(base,'mode',{mode:'LIVE'})).state;assert.equal(s.total,0);assert.equal((await api(base,'test-clock',{seconds:30})).status,400);assert.equal((await api(base,'comment',{uid:'x',text:'Thanh Hóa'})).status,400);
 await api(base,'mode',{mode:'SIMULATOR'});await api(base,'pause');s=(await api(base,'test-clock',{seconds:30})).state;assert.equal(s.result.winners[0].origin,'Thanh Hóa');assert.equal(s.active.action,'winnerIntro');assert.equal(JSON.parse(await readFile(data+'/race-simulator.json','utf8')).schema,2);
 assert.equal((await fetch(base+'/api/command',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'})).status,403);assert.equal((await fetch(base+'/package.json')).status,404);
 const invalid={...config,tiers:[{min:1,max:100,points:3},{min:100,max:null,points:1}]};assert.equal((await api(base,'settings',{settings:{raceConfig:invalid}})).status,400);
 s=(await api(base,'settings',{settings:{presentation:{theme:'neon',customCss:'h1 { color: red; }'}}})).state;assert.equal(s.settings.presentation.theme,'neon');assert.equal(s.result.points,4);
 }finally{child.kill();}
});
