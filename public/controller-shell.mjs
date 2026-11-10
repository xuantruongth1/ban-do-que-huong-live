import {buildUserSupport} from './user-support.mjs';
const $=id=>document.getElementById(id),controls=document.querySelector('.controls');
const overview=document.querySelector('#home .controls>.panel'),tests=$('demo').closest('.panel'),logs=$('gift-feed').closest('.panel');
const groups={home:[overview,tests],'race-settings':[$('race-settings')],gifts:[$('gifts')],sound:[$('sound')],appearance:[$('appearance')],music:[$('music')],videos:[$('videos')],logs:[logs]};
const titles={home:'Điều khiển cuộc đua','race-settings':'Thời gian & cách chấm điểm',gifts:'Quà tặng & hiệu ứng',sound:'Giọng MC & kịch bản',appearance:'Giao diện bản đồ',music:'Kho nhạc nền',videos:'Clip & giới thiệu quê',logs:'Nhật ký tương tác'};
const supportViews=buildUserSupport(controls);groups.guide=[supportViews.guide];groups.support=[supportViews.support];titles.guide='Hướng dẫn sử dụng';titles.support='Hỗ trợ & ủng hộ';
logs.id='logs';const nav=document.querySelector('nav'),labLink=nav.querySelector('a[href="/lab.html"]');for(const [id,text]of [['music','♫ Kho nhạc nền'],['appearance','◐ Giao diện bản đồ'],['logs','≡ Nhật ký tương tác'],['guide','? Hướng dẫn sử dụng'],['support','♡ Hỗ trợ & ủng hộ']]){if(nav.querySelector(`a[href="#${id}"]`))continue;const link=document.createElement('a');link.href='#'+id;link.textContent=text;nav.insertBefore(link,labLink);}
const crumb=document.createElement('div');crumb.className='controller-path';crumb.innerHTML='<span>Mai Trường LIVE</span><i>›</i><b id="controller-view-title"></b>';document.querySelector('main>header').before(crumb);
function activate(id){if(!groups[id])id='home';for(const panel of controls.querySelectorAll(':scope>.panel'))panel.hidden=!groups[id].includes(panel);for(const link of nav.querySelectorAll('a[href^="#"]')){const active=link.hash==='#'+id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}$('controller-view-title').textContent=titles[id];document.title=titles[id]+' · Quê Hương LIVE';window.controllerTab=id;}
for(const link of nav.querySelectorAll('a[href^="#"]'))link.onclick=e=>{e.preventDefault();const id=link.hash.slice(1);activate(id);history.replaceState(null,'','#'+id);document.body.classList.remove('menu-open');scrim.hidden=true;scrollTo({top:0,behavior:'smooth'});};addEventListener('hashchange',()=>activate(location.hash.slice(1)));
// Use the actual Tiệc Cưới template layout; IDs and controls keep their behavior.
const shell=document.querySelector('.shell'),main=document.querySelector('main'),header=main.querySelector('header'),preview=document.querySelector('.preview-column'),workspace=document.querySelector('.workspace');
shell.classList.add('app-layout');nav.classList.add('sidebar');main.classList.add('main-content');preview.classList.add('preview-sidebar');shell.append(preview);
nav.querySelector('.brand').innerHTML='<span class="brand-icon">✦</span><span class="brand-info"><h2>MAI TRƯỜNG</h2><small>QUÊ HƯƠNG LIVE</small></span>';
for(const a of nav.querySelectorAll('a:not(.brand)'))a.classList.add('nav-item');
const body=document.createElement('div');body.className='content-body';for(const el of [...main.children])body.append(el);main.append(body);crumb.remove();
const dock=document.createElement('div');dock.className='live-control-dock';const top=document.createElement('div');top.className='topbar';const left=document.createElement('div');left.className='topbar-left';const toggle=document.createElement('button');toggle.id='menu-toggle';toggle.className='icon-button';toggle.textContent='☰';toggle.setAttribute('aria-label','Mở menu điều khiển');left.append(toggle,crumb);top.append(left,header.querySelector('.header-actions'));main.prepend(dock);dock.append(top);
const scrim=document.createElement('button');scrim.className='nav-scrim';scrim.hidden=true;scrim.setAttribute('aria-label','Đóng menu');document.body.append(scrim);toggle.onclick=()=>{document.body.classList.toggle('menu-open');scrim.hidden=!document.body.classList.contains('menu-open');};scrim.onclick=()=>{document.body.classList.remove('menu-open');scrim.hidden=true;};
preview.querySelector('.preview-frame').classList.add('phone-frame');preview.querySelector('.preview-label').classList.add('preview-header');for(const panel of document.querySelectorAll('.panel'))panel.classList.add('card-panel');
activate(location.hash.slice(1));history.scrollRestoration='manual';requestAnimationFrame(()=>requestAnimationFrame(()=>scrollTo(0,0)));

// Keep the daily workspace focused; retain every advanced control behind one switch.
document.body.classList.add('user-mode');
const advanced=document.createElement('button');advanced.id='advanced-toggle';advanced.type='button';nav.insertBefore(advanced,nav.querySelector('.nav-bottom'));
function setAdvanced(on){document.body.classList.toggle('advanced-mode',on);advanced.textContent=on?'Ẩn công cụ nâng cao':'⚙ Công cụ nâng cao';advanced.setAttribute('aria-expanded',String(on));localStorage.setItem('hometown-advanced-v1',on?'1':'0');}
advanced.onclick=()=>setAdvanced(!document.body.classList.contains('advanced-mode'));setAdvanced(localStorage.getItem('hometown-advanced-v1')==='1');
for(const selector of ['nav a[href="#race-settings"]','nav a[href="#logs"]','nav a[href="/lab.html"]','#demo','.session-controls','#end','#voice-provider-info','.mc-auto-options','#mc-test','#voice-ready'])document.querySelector(selector)?.classList.add('advanced-control');
for(const id of ['voice-provider','mcGap','template-type']){const el=document.getElementById(id);(id==='mcGap'?el.closest('.form-grid'):el.closest('label'))?.classList.add('advanced-control');}
const template=document.getElementById('template-lines');template.classList.add('advanced-control');template.nextElementSibling.classList.add('advanced-control');
for(const el of tests.children)if(!el.classList.contains('section-heading'))el.classList.add('advanced-control');
tests.querySelector('h2').innerHTML='<span>Xem thử trước khi phát</span>';
const quick=document.createElement('div');quick.className='quick-duration';quick.innerHTML='<label>Thời lượng mỗi vòng (phút)<input id="quick-duration" type="number" min="0.5" max="60" step="0.5" value="5"></label><button id="save-quick-duration">Lưu thời lượng</button><p>Bấm Kết nối LIVE là tự bật MC và chạy đua. Hết vòng tự chiếu quê thắng rồi chạy vòng mới.</p>';
overview.querySelector('.race-controls').before(quick);
document.getElementById('start').textContent='▶ Chạy tự động';
const quickInput=document.getElementById('quick-duration');
addEventListener('hometown-state',e=>{if(document.activeElement!==quickInput)quickInput.value=e.detail.settings.raceConfig.duration/60;});
if(window.hometownDashboardState)quickInput.value=window.hometownDashboardState.settings.raceConfig.duration/60;
document.getElementById('save-quick-duration').onclick=async()=>{const minutes=Number(quickInput.value);if(!quickInput.reportValidity()||!Number.isFinite(minutes)||minutes<.5||minutes>60)return;const button=document.getElementById('save-quick-duration');button.disabled=true;try{const s=await fetch('/api/state').then(r=>r.json());const r=await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'settings',settings:{raceConfig:{...s.settings.raceConfig,duration:minutes*60,autoNext:true}}})});const result=await r.json();if(!r.ok)throw Error(result.error);document.getElementById('duration').value=minutes;quick.querySelector('p').textContent='Đã lưu '+minutes+' phút/vòng. Vòng đang chạy giữ thời gian cũ, từ vòng kế tiếp dùng thời gian mới.';}catch(e){quick.querySelector('p').textContent=e.message;}finally{button.disabled=false;}};
const frame=preview.querySelector('iframe');frame.src='/overlay.html?control=1';const audioButton=document.createElement('button');audioButton.id='controller-audio';audioButton.className='preview-audio-button primary';audioButton.textContent='Bật MC & nhạc';preview.querySelector('.preview-frame').after(audioButton);
audioButton.onclick=()=>frame.contentDocument?.getElementById('audio-toggle')?.click();setInterval(()=>{audioButton.textContent=frame.contentWindow?.hometownAudio?.owned?'Tắt âm thanh xem trước':'Bật MC & nhạc';},800);
for(const id of ['guide','support']){const link=nav.querySelector('a[href="#'+id+'"]');nav.insertBefore(link,advanced);}
window.userStudioReady=true;

for(const id of ['colorCycleSeconds','glowStrength','sfxEnabled','sfxVolume','giftToastEnabled','giftTierEffects','giftSparkEnabled','fireworksThreshold','backgroundOpacity','backgroundBlur','litColor','unlitColor','mapBackground','effectIntensity','labelScale','commentZoomDuration'])document.getElementById(id)?.closest('label')?.classList.add('advanced-control');
document.getElementById('palette-editor')?.classList.add('advanced-control');

const demoInline=document.createElement('div');demoInline.className='demo-inline';demoInline.append(document.getElementById('screen-demo-start'),document.getElementById('screen-demo-stop'),document.getElementById('screen-demo-status'));overview.querySelector('.race-controls').after(demoInline);tests.classList.add('advanced-control');overview.querySelector('h2').innerHTML='<span>Kết nối & vận hành</span>';

window.enableHometownAudio=()=>{const player=frame.contentWindow;if(player?.hometownEnableAudio)return player.hometownEnableAudio();return Promise.reject(Error('Màn LIVE đang tải'));};
window.stopHometownAudio=()=>{if(frame.contentWindow?.hometownAudio?.owned)frame.contentDocument.getElementById('audio-toggle')?.click();};
document.getElementById('start').classList.add('advanced-control');
