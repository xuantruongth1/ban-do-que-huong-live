import {chromium}from'playwright';import assert from'node:assert/strict';import{readFile,writeFile}from'node:fs/promises';import{startServer,api}from'./helpers.mjs';
const{base,child}=await startServer(3228),b=await chromium.launch({headless:true,channel:'msedge'}),report={};
try{
 const p=await b.newPage({viewport:{width:540,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 let s=await fetch(base+'/api/state').then(r=>r.json());await api(base,'settings',{settings:{speech:false,raceConfig:{...s.settings.raceConfig,countdown:0,autoNext:false,winnerIntroDuration:6,winnerDuration:12,autoLightEnabled:false}}});
 await p.goto(base+'/overlay.html?preview=1');await p.waitForFunction(()=>window.hometownView);await p.waitForTimeout(2500);
 for(const mode of ['63','34']){
  if(mode==='34'){s=await fetch(base+'/api/state').then(r=>r.json());await api(base,'settings',{settings:{raceConfig:{...s.settings.raceConfig,mapMode:mode}}});}
  await api(base,'start');await p.waitForFunction(mode=>window.hometownView?.mapMode===mode,mode);await p.waitForTimeout(1500);
  const labels=await p.evaluate(()=>['Thanh Hóa','Nghệ An','Hà Tĩnh'].map(name=>{const label=[...document.querySelectorAll('.province-label')].find(g=>g.querySelector('title').textContent===name),text=label.querySelector('text'),path=document.querySelector(`#lands [data-id="${label.dataset.homeId}"]`),box=text.getBBox();return{name,id:label.dataset.homeId,placement:label.dataset.placement,x:box.x+box.width/2,y:box.y+box.height/2,inside:path.isPointInFill(new DOMPoint(box.x+box.width/2,box.y+box.height/2))};}));
  assert.ok(labels.every(l=>l.inside&&l.placement==='inside'),JSON.stringify(labels));assert.ok(labels[0].y<labels[1].y&&labels[1].y<labels[2].y);report['labels'+mode]=labels;
  await api(base,'comment',{uid:'na',name:'Ngọc Anh',text:'Nghệ An'});await p.waitForFunction(()=>window.hometownView?.active==='commentZoom');await p.waitForTimeout(1200);await p.screenshot({path:`test-output/correct-labels-${mode}.png`});
  await api(base,'end');await api(base,'test-clock',{seconds:30});
 }
 // A portrait video and a landscape video must choose distinct layouts from actual metadata.
 for(const [file,portrait]of [['qa-portrait.mp4',true],['QA-synthetic-video.mp4',false]]){
  const bytes=await readFile('test-output/'+file);await fetch(base+'/api/video?province=40',{method:'POST',headers:{'X-File-Name':file},body:bytes});await api(base,'start');await api(base,'comment',{uid:'winner',name:'Minh Anh',text:'Nghệ An'});await api(base,'end');await api(base,'test-clock',{seconds:9.5});
  await p.waitForFunction(()=>window.hometownView?.active==='winner');await p.waitForFunction(portrait=>document.getElementById('film').videoWidth>0&&document.getElementById('stage').classList.contains('portrait-film')===portrait,portrait);await p.locator('#cinema').waitFor({state:'visible'});
  const bounds=await p.evaluate(()=>{const f=document.getElementById('film'),r=f.getBoundingClientRect(),scale=Math.min(r.width/f.videoWidth,r.height/f.videoHeight);return{w:r.width,h:r.height,contentW:f.videoWidth*scale,contentH:f.videoHeight*scale,videoW:f.videoWidth,videoH:f.videoHeight};});
  if(portrait){assert.ok(bounds.contentH>650);assert.ok(bounds.contentW>350);await p.screenshot({path:'test-output/large-portrait-film.png'});}else assert.ok(bounds.w>bounds.h);
  report[portrait?'portrait':'landscape']=bounds;await api(base,'test-clock',{seconds:30});
 }
 assert.deepEqual(errors,[]);report.errors=errors;await writeFile('test-output/labels-cinema-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await b.close();child.kill();}
