import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {startServer,api} from './helpers.mjs';
import {googleSpeech} from '../core/speech-fallback.mjs';
const {base,child}=await startServer(3226),browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const s=await fetch(base+'/api/state').then(r=>r.json());
 await api(base,'settings',{settings:{speech:false,raceConfig:{...s.settings.raceConfig,countdown:0,autoLightEnabled:false}}});
 await api(base,'start');
 for(const [i,home] of ['Thanh Hóa','Nghệ An','Hà Nội','Đà Nẵng','Hà Tĩnh'].entries()) {
  await api(base,'comment',{uid:'layout-'+i,name:'Nguyễn Hoàng Minh Phương '+i,text:home});
  await api(base,'gift',{uid:'layout-'+i,giftId:'5655',quantity:5-i});
 }
 for(let i=0;i<20;i++)await api(base,'skip');
 const p=await browser.newPage({viewport:{width:540,height:960}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/overlay.html?preview=1');
 await p.waitForFunction(()=>document.querySelectorAll('#top .top-row').length===5);
 assert.equal(await p.locator('.rail-leader').count(),3);
 await p.waitForTimeout(3000); // Let the initial camera transition settle before the layout capture.
 const layout=await p.evaluate(()=>{
  const rail=document.querySelector('.info-rail').getBoundingClientRect();
  const cards=[...document.querySelector('.rail-stack').children].filter(e=>!e.hidden).map(e=>e.getBoundingClientRect());
  return {allInside:cards.every(r=>r.left>=rail.left-1&&r.right<=rail.right+1&&r.bottom<=rail.bottom+1),railWidth:rail.width};
 });
 assert.ok(layout.allInside);
 await p.screenshot({path:'test-output/full-leaderboard-layout.png'});
 const mp3=await googleSpeech('Xin chào đồng hương. Bình luận tên tỉnh để thắp sáng quê hương nhé!');
 assert.ok(mp3.length>2000);
 await p.route('**/qa-fallback-audio',route=>route.fulfill({status:200,contentType:'audio/mpeg',body:mp3}));
 await p.evaluate(()=>{const a=new Audio('/qa-fallback-audio');a.muted=true;window.qaFallbackAudio=a;a.play();});
 await p.waitForFunction(()=>window.qaFallbackAudio?.currentTime>.1,null,{timeout:15000});
 assert.deepEqual(errors,[]);
 const report={fiveRankedHomes:true,threeGiftLeaders:true,longNamesFit:true,layout,realFallbackDecodesAndPlays:true,fallbackBytes:mp3.length,errors};
 await writeFile('test-output/final-upgrade-browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
} finally {await browser.close();child.kill();}
