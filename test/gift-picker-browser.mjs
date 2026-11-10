import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {startServer} from './helpers.mjs';
const {base,child}=await startServer(3201),out=fileURLToPath(new URL('../test-output/',import.meta.url));
const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[],failures=[];
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});await p.goto(base);await p.waitForFunction(()=>window.dashboardReady===true);await p.locator('nav a[href="#gifts"]').click();const trigger=p.getByRole('button',{name:'Chọn quà · Tim bay khắp bản đồ',exact:true});await trigger.click();await p.locator('#gift-dialog').waitFor({state:'visible'});
 const rows=p.locator('.gift-picker-option[data-stt]');assert.equal(await rows.count(),96);
 const order=await rows.evaluateAll(es=>es.map(e=>({stt:Number(e.dataset.stt),coins:e.dataset.coins===''?null:Number(e.dataset.coins)})));for(let i=0;i<order.length;i++){assert.equal(order[i].stt,i+1);if(i)assert.ok((order[i-1].coins??Infinity)<=(order[i].coins??Infinity));}
 assert.equal(await rows.locator('img').count(),96);assert.ok(await p.locator('#gift-dialog .coin-icon').count()>0);await p.waitForFunction(()=>document.querySelector('.gift-picker-option[data-stt] img')?.naturalWidth>0);await p.locator('#gift-dialog').screenshot({path:out+'gift-picker-stt-coins.png'});
 await p.getByRole('searchbox',{name:'Tìm quà trong thư viện'}).fill('5487');assert.equal(await rows.count(),1);const stt=await rows.first().getAttribute('data-stt');await rows.first().click();assert.equal(await trigger.locator('img').getAttribute('alt'),'Bắn tim');assert.ok((await trigger.textContent()).includes('5 xu'));assert.equal(await trigger.locator('.gift-stt').textContent(),stt.padStart(2,'0'));
 await p.getByRole('button',{name:'Lưu bảng quà',exact:true}).click();await p.waitForFunction(()=>document.getElementById('toast').textContent==='Đã lưu bảng quà & hiệu ứng');await p.reload();await trigger.waitFor();assert.equal(await trigger.locator('img').getAttribute('alt'),'Bắn tim');
 // A query outside the dialog must not discard the selected gift, nor stop a new choice.
 await p.locator('#gift-search').fill('hoa hong');await trigger.click();await p.getByRole('searchbox',{name:'Tìm quà trong thư viện'}).fill('6064');await p.locator('.gift-picker-option[data-gift-id="6064"]').click();assert.equal(await p.locator('.gift-rule[data-action="hearts"] select').inputValue(),'6064');await p.locator('#gift-search').fill('');
 await trigger.click();await p.getByRole('searchbox',{name:'Tìm quà trong thư viện'}).fill('');assert.equal(await rows.count(),96);await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.getElementById('gift-dialog').open);assert.equal(await trigger.evaluate(e=>document.activeElement===e),true);
 await p.locator('nav a[href="#home"]').click();await p.locator('#advanced-toggle').click();await p.getByRole('button',{name:'Chọn quà tặng thử',exact:true}).click();await p.getByRole('searchbox',{name:'Tìm quà trong thư viện'}).press('ArrowDown');await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');assert.equal(await p.locator('#gift-dialog').isVisible(),false);await p.locator('nav a[href="#gifts"]').click();
 await p.setViewportSize({width:390,height:844});await trigger.click();await p.waitForTimeout(200);assert.ok(await p.locator('#gift-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));await p.locator('#gift-dialog').screenshot({path:out+'gift-picker-mobile.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);const report={gifts:96,numbered:true,sortedByCoins:true,giftImages:true,coinIcons:true,searchKeepsNumbers:true,savedSelectionRestored:true,filteredSelectionWorks:true,keyboardAndEscape:true,mobileFits:true,errors,failures};await writeFile(out+'gift-picker-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();child.kill();}
