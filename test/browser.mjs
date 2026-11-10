import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {startServer,api} from './helpers.mjs';
const {base,child}=await startServer(3196),out=fileURLToPath(new URL('../test-output/',import.meta.url));
const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[],failures=[],report={};
function monitor(page){page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});}
try{
 const page=await browser.newPage({viewport:{width:1550,height:1100}});monitor(page);await page.goto(base);await page.locator('.gift-rule').last().waitFor();await page.getByRole('button',{name:'Tạo 100 đồng hương'}).click();await page.waitForFunction(()=>document.getElementById('total').textContent==='100');
 const overlay=await browser.newPage({viewport:{width:540,height:960}});monitor(overlay);await overlay.goto(base+'/overlay.html');await overlay.waitForFunction(()=>window.hometownView?.total===100);assert.equal(await overlay.locator('.province').count(),63);report.polygons=63;
 await page.screenshot({path:out+'dashboard-desktop.png',fullPage:true});await overlay.screenshot({path:out+'live-overview.png'});
 await api(base,'comment',{uid:'quangnam',name:'Đồng Hương Quảng Nam',text:'92'});
 for(const [action,file]of [['honor','zoom-quang-nam'],['light','light-quang-nam'],['connect','hoi-dong-huong'],['film','film-missing'],['vietnam','rong-viet']]){
  await api(base,'effect',{uid:'quangnam',effect:action});await overlay.waitForFunction(a=>window.hometownView?.active===a,action);await overlay.waitForTimeout(2300);
  assert.equal(await overlay.locator('#province-name').textContent(),'QUẢNG NAM');assert.equal(await overlay.locator('#province-origin').textContent(),'Hiện nay: Đà Nẵng');
  if(action==='honor'){assert.equal(await overlay.locator('.province.selected').getAttribute('data-id'),'old-92');const box=(await overlay.locator('#map').getAttribute('viewBox')).split(' ').map(Number);assert.ok(box[2]<620);report.oldProvinceCamera=true;}
  if(action==='film'){await overlay.locator('#cinema').waitFor({state:'visible'});assert.equal(await overlay.locator('#no-film').isVisible(),true);report.missingFilmVisible=true;}
  if(action==='connect'){assert.ok(await overlay.locator('.route').count()>0);report.connectionPaths=true;}
  await overlay.screenshot({path:out+file+'.png'});await api(base,'skip');await overlay.waitForFunction(()=>!window.hometownView?.active);
 }
 await page.locator('#video-province').selectOption('old-92');await page.locator('#video-file').setInputFiles(out+'QA-synthetic-video.mp4');await page.getByRole('button',{name:'Tải phim vào máy',exact:true}).click();await page.waitForFunction(()=>document.getElementById('video-name').textContent==='QA-synthetic-video.mp4');
 const videoState=await fetch(base+'/api/state').then(r=>r.json()),vid=videoState.settings.videos['old-92'].id;const range=await fetch(base+'/videos/'+vid,{headers:{Range:'bytes=0-127'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,128);
 await api(base,'effect',{uid:'quangnam',effect:'film'});await overlay.waitForFunction(()=>document.getElementById('film').currentTime>.4);assert.equal(await overlay.locator('#no-film').isVisible(),false);await overlay.screenshot({path:out+'film-playback-qa.png'});report.mp4Playback=true;report.videoRange=true;await api(base,'skip');await api(base,'video-remove',{provinceId:'old-92'});
 await page.locator('.gift-rule[data-action="honor"] select').selectOption('5655',{force:true});await page.getByRole('button',{name:'Lưu bảng quà',exact:true}).click();await page.waitForFunction(()=>document.getElementById('toast').textContent==='Đã lưu gán quà');assert.equal((await fetch(base+'/api/state').then(r=>r.json())).settings.rules[0].giftId,'5655');
 await page.locator('#gift-search').fill('hoa hong');assert.ok(await page.locator('.gift-rule').first().locator('option').count()>1);await page.locator('#gift-search').fill('');
 await page.locator('#province-search').fill('92');assert.equal(await page.locator('#province-rows tr').count(),1);assert.ok((await page.locator('#province-rows').textContent()).includes('Quảng Nam'));await page.locator('#province-search').fill('');
 const frame=page.frames().find(f=>f.url().includes('preview=1'));assert.equal(await frame.evaluate(()=>window.hometownAudio.preview),true);assert.equal(await frame.evaluate(()=>window.hometownAudio.owned),false);report.previewMuted=true;
 await api(base,'settings',{settings:{speech:false}});await overlay.getByRole('button',{name:'Bật âm thanh & MC',exact:true}).click();await overlay.waitForFunction(()=>window.hometownAudio.owned);
 const second=await browser.newPage({viewport:{width:360,height:640}});monitor(second);await second.goto(base+'/overlay.html');await second.waitForFunction(()=>window.hometownView?.total===101);await second.getByRole('button',{name:'Bật âm thanh & MC',exact:true}).click();await second.waitForFunction(()=>window.hometownAudio.owned);await overlay.waitForFunction(()=>!window.hometownAudio.owned);report.singleAudioOwner=true;await second.close();
 await api(base,'demo',{count:1000});await overlay.waitForFunction(()=>window.hometownView?.total===1000);report.thousandAvatars=true;await overlay.screenshot({path:out+'live-1000-users.png'});
 await api(base,'mode',{mode:'LIVE'});await overlay.waitForFunction(()=>window.hometownView?.mode==='LIVE');assert.equal((await fetch(base+'/api/state').then(r=>r.json())).total,0);assert.equal(await page.getByRole('button',{name:'Tạo 100 đồng hương'}).isDisabled(),true);report.separateLive=true;
 await api(base,'mode',{mode:'SIMULATOR'});await api(base,'demo',{count:100});await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'dashboard-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.mobileFits=true;
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await writeFile(out+'browser-report.json',JSON.stringify({errors,failures,report},null,2));console.log(JSON.stringify({errors,failures,report},null,2));
}finally{await browser.close();child.kill();}
