import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {startServer,api} from './helpers.mjs';
test('API local: nguồn riêng, gán quà, persistence, chặn nguồn ngoài và tệp sai',async()=>{
 const {base,child,data}=await startServer(3197);try{
 let r=await api(base,'comment',{uid:'u',name:'Quảng Nam test',text:'92'});assert.equal(r.state.players[0].origin,'Quảng Nam');assert.equal(r.state.players[0].provinceName,'Đà Nẵng');
 const saved=JSON.parse(await readFile(data+'/simulator.json'));assert.equal(saved.players[0].homeId,'old-92');
 r=await api(base,'settings',{settings:{rules:[{action:'honor',giftId:'5655',threshold:1}]}});assert.equal(r.status,200);
 r=await api(base,'gift',{uid:'u',giftId:'5655',quantity:1});assert.equal(r.state.active.homeId,'old-92');assert.equal(r.state.players[0].coins,1);
 assert.equal((await api(base,'settings',{settings:{rules:[{action:'honor',giftId:'5655',threshold:1},{action:'light',giftId:'5655',threshold:1}]}})).status,400);
 r=await api(base,'mode',{mode:'LIVE'});assert.equal(r.state.total,0);assert.equal((await api(base,'demo',{count:10})).status,400);assert.equal((await api(base,'effect',{uid:'u',effect:'vietnam'})).status,400);
 r=await api(base,'mode',{mode:'SIMULATOR'});assert.equal(r.state.total,1);
 assert.equal((await fetch(base+'/api/command',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'})).status,403);
 assert.equal((await fetch(base+'/package.json')).status,404);assert.equal((await fetch(base+'/api/video?province=old-92',{method:'POST',body:'not a video'})).status,400);
 assert.equal((await api(base,'audio-claim',{id:'first-player',takeover:true})).owner,true);assert.equal((await api(base,'audio-claim',{id:'other-player'})).owner,false);assert.equal((await api(base,'audio-claim',{id:'other-player',takeover:true})).owner,true);
 assert.equal((await fetch(base+'/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'first-player',text:'test'})})).status,409);
 const catalog=await fetch(base+'/api/catalog').then(r=>r.json());assert.equal(catalog.hometowns.length,63);assert.equal(catalog.gifts.length,96);
 const previousSession=r.state.sessionId;r=await api(base,'new-session');assert.equal(r.state.total,0);assert.deepEqual(r.state.litHomes,[]);assert.notEqual(r.state.sessionId,previousSession);assert.equal(r.state.tour.dueIn,600);assert.equal(r.state.top.length,0);
 }finally{child.kill();}
});
