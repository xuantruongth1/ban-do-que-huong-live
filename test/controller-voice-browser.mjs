import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {startServer,api} from './helpers.mjs';
import {themes} from '../public/themes.mjs';
const {base,child,data}=await startServer(3205),out=fileURLToPath(new URL('../test-output/',import.meta.url));
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],report={};
try{
 // The separate voice check generated this sample using the real offline clone.
 await mkdir(data+'/wedding-voice/cache',{recursive:true});await cp(out+'wedding-voice/wedding-voice/cache',data+'/wedding-voice/cache',{recursive:true});
 const p=await browser.newPage({viewport:{width:1550,height:1100}});p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>window.dashboardReady&&window.controllerTab==='home');await p.locator('#advanced-toggle').click();await p.screenshot({path:out+'controller-refresh.png',fullPage:true});
 await p.locator('nav a[href="#sound"]').click();assert.equal(await p.locator('#voice-provider').inputValue(),'wedding');assert.equal(await p.locator('#voice').isDisabled(),true);assert.equal(await p.locator('#gifts').isVisible(),false);
 const response=p.waitForResponse(r=>r.url().endsWith('/api/lab-tts'));await p.locator('#voice-sample').click();const r=await response;assert.equal(r.status(),200);assert.equal(r.headers()['content-type'],'audio/wav');const wav=await fetch(base+'/api/lab-tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({voiceProvider:'wedding',voice:'male',rate:1,text:'MC Mai Trường xin chào đồng hương. Thanh Hóa đã bừng sáng!'})});const audioBytes=Buffer.from(await wav.arrayBuffer());assert.equal(audioBytes.toString('ascii',0,4),'RIFF');await p.waitForFunction(()=>window.controllerVoiceSample?.currentTime>.2);report.cloneWavPlayedInController=true;await p.screenshot({path:out+'controller-wedding-voice.png',fullPage:true});
 const state=await fetch(base+'/api/state').then(r=>r.json());await api(base,'settings',{settings:{speech:false,raceConfig:{...state.settings.raceConfig,countdown:0}}});await api(base,'start');await api(base,'comment',{uid:'gold',name:'Đồng hương',text:'Thanh Hóa'});
 const overlay=await browser.newPage({viewport:{width:540,height:960}});await overlay.goto(base+'/overlay.html');await overlay.waitForFunction(()=>window.hometownView?.litHomes.length===1);assert.equal(await overlay.locator('.province-label').count(),63);
 for(const [theme]of themes){await api(base,'settings',{settings:{presentation:{theme,customCss:''}}});await overlay.waitForFunction(theme=>document.getElementById('stage').classList.contains('theme-'+theme),theme);const colors=await overlay.evaluate(()=>({lit:getComputedStyle(document.querySelector('.province.occupied')).fill,unlit:getComputedStyle(document.querySelector('.province:not(.occupied)')).fill,opacity:getComputedStyle(document.querySelector('.province:not(.occupied)')).fillOpacity}));assert.ok(colors.lit.startsWith('rgb('));assert.ok(colors.unlit.startsWith('rgb('));assert.equal(colors.opacity,'1');}
 report.vividColorsAcrossSixThemes=true;await api(base,'settings',{settings:{presentation:{theme:'tet',customCss:''}}});await overlay.waitForTimeout(800);await overlay.screenshot({path:out+'map-gray-and-gold.png'});
 await p.setViewportSize({width:390,height:844});for(const id of ['home','race-settings','gifts','sound','appearance','videos','logs']){await p.locator('#menu-toggle').click();await p.locator(`nav a[href="#${id}"]`).click();assert.equal(await p.evaluate(()=>window.controllerTab),id);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}report.mobileTabsFit=true;
 const status=await fetch(base+'/api/voice-status').then(r=>r.json());assert.ok(status.wedding.cacheHits>=1);report.voiceSettings=status.wedding.settings;assert.deepEqual(errors,[]);await writeFile(out+'controller-voice-report.json',JSON.stringify({errors,report},null,2));console.log(JSON.stringify({errors,report},null,2));
}finally{await browser.close();child.kill();}
