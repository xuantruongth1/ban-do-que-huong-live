import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {startServer,api} from './helpers.mjs';
const {base,child}=await startServer(3212),browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:540,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/overlay.html?preview=1');await page.waitForFunction(()=>window.hometownView);await page.waitForTimeout(3000);
 const bounds=()=>page.evaluate(()=>{const svg=document.getElementById('map'),v=svg.viewBox.baseVal,m=svg.getScreenCTM(),land=document.getElementById('lands').getBBox();return{width:v.width,scale:m.a,uniform:Math.abs(m.a-m.d)<.00001,screenHeight:land.height*m.a};});
 const close=await bounds();assert.ok(close.width<510);assert.ok(close.uniform);assert.ok(close.scale>0.7,'Mainland must occupy most of the portrait height');assert.ok(await page.locator('#map-overview').isVisible());await page.screenshot({path:'test-output/map-large-mainland.png'});
 await page.locator('#map-view-toggle').click();await page.waitForTimeout(3000);const full=await bounds();assert.ok(full.width>940);assert.ok(full.uniform);assert.ok(close.scale/full.scale>1.3);assert.equal(await page.locator('#map-overview').isVisible(),false);await page.screenshot({path:'test-output/map-full-territory.png'});
 const s=await fetch(base+'/api/state').then(r=>r.json());await api(base,'settings',{settings:{raceConfig:{...s.settings.raceConfig,mapMode:'34'}}});await api(base,'start');await page.locator('#map-view-toggle').click();await page.waitForTimeout(3000);assert.equal(await page.locator('#lands>.province').count(),34);assert.ok((await bounds()).width<600);assert.deepEqual(errors,[]);console.log(JSON.stringify({largerBy:close.scale/full.scale,projectionUniform:true,bothModes:true,errors}));
}finally{await browser.close();child.kill();}
