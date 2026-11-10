import test from 'node:test';
import assert from 'node:assert/strict';
import {ProvinceRace} from '../core/game.mjs';
import {regionsFor,parseProvince} from '../public/regions.mjs';
import {defaultRaceConfig,validateRaceConfig} from '../public/race-config.mjs';
const config=mode=>validateRaceConfig({mapMode:mode,countdown:0});
test('bản đồ mặc định 63, tùy chọn 34 có tên và bí danh đúng vùng',()=>{
 assert.equal(defaultRaceConfig.mapMode,'63');assert.equal(regionsFor('63').length,63);assert.equal(regionsFor('34').length,34);
 for(const r of regionsFor('34'))assert.equal(parseProvince(r.name,{},'34')?.id,r.id);
 assert.equal(parseProvince('Quảng Nam',{},'34').name,'Đà Nẵng');assert.equal(parseProvince('Quảng Nam',{},'63').name,'Quảng Nam');assert.equal(parseProvince('Huế',{},'34').name,'Huế');assert.throws(()=>validateRaceConfig({mapMode:'64'}));
});
test('đổi bộ bản đồ chỉ áp dụng vòng mới, giữ kết quả và không trộn điểm',()=>{
 const r=new ProvinceRace({},config('63'));r.start();r.comment({userId:'a',comment:'Quảng Nam'});r.configure(config('34'));assert.equal(r.config.mapMode,'63');assert.equal(r.scores.get('old-92'),1);r.finish('host');const result=structuredClone(r.result);r.configure(config('34'));assert.equal(r.config.mapMode,'63');assert.deepEqual(r.result,result);r.advance(180);r.start();assert.equal(r.config.mapMode,'34');assert.equal(r.players.size,0);assert.equal(r.scores.size,0);r.comment({userId:'a',comment:'Quảng Nam'});assert.equal(r.ranking()[0].origin,'Đà Nẵng');assert.equal(r.ranking()[0].points,1);
 r.gift({userId:'a',giftId:'big',diamondCount:1500,repeatCount:1,msgId:'big'});assert.equal(r.litHomes.size,34);assert.ok([...r.litHomes].every(id=>!id.startsWith('old-')));assert.ok(r.announcements.some(a=>a.type==='allMap'&&a.text.includes('34')));
 const saved=r.export(),restored=new ProvinceRace(saved,config('34'));assert.equal(restored.config.mapMode,'34');assert.equal(restored.litHomes.size,34);assert.equal(restored.phase,'PAUSED');
});
