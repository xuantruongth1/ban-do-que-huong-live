export function sortGifts(gifts){
 return gifts.map((g,index)=>({...g,catalogIndex:index})).sort((a,b)=>(a.coins??Infinity)-(b.coins??Infinity)||a.catalogIndex-b.catalogIndex).map((g,index)=>({...g,stt:index+1}));
}
const node=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!=null)e.textContent=text;return e;};
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase();
function price(g){
 const wrap=node('span','gift-price');
 if(g.coins==null){wrap.textContent='Giá bị che';return wrap;}
 const ns='http://www.w3.org/2000/svg',icon=document.createElementNS(ns,'svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('class','coin-icon');icon.setAttribute('aria-hidden','true');
 const circle=document.createElementNS(ns,'circle');for(const [k,v]of Object.entries({cx:12,cy:12,r:10,fill:'#f6c851',stroke:'#ffedac','stroke-width':1.3}))circle.setAttribute(k,v);
 const inner=document.createElementNS(ns,'circle');for(const [k,v]of Object.entries({cx:12,cy:12,r:7,fill:'none',stroke:'#ba7c19','stroke-width':1}))inner.setAttribute(k,v);
 const mark=document.createElementNS(ns,'path');mark.setAttribute('d','M14.8 8.5C10 6 7 9 9 11.4c1 1.2 5 .4 5.6 2.3 1 3-4 4-6.4 1.8M12 6.5v11');mark.setAttribute('fill','none');mark.setAttribute('stroke','#8b5710');mark.setAttribute('stroke-width','1.6');mark.setAttribute('stroke-linecap','round');
 icon.append(circle,inner,mark);wrap.append(icon,node('span','',g.coins.toLocaleString('vi-VN')+' xu'));return wrap;
}
function giftImage(g){const img=node('img','gift-picker-image');img.src=g.image;img.alt=g.name;img.loading='lazy';img.width=40;img.height=40;return img;}
let dialog,heading,search,list,count,help,active=null,opener=null;
function ensureDialog(){
 if(dialog)return;
 dialog=node('dialog','gift-dialog');dialog.id='gift-dialog';dialog.setAttribute('aria-labelledby','gift-dialog-title');
 const header=node('div','gift-dialog-header');heading=node('h2','','Chọn quà TikTok');heading.id='gift-dialog-title';const close=node('button','gift-dialog-close','×');close.type='button';close.setAttribute('aria-label','Đóng chọn quà');close.onclick=()=>dialog.close();header.append(heading,close);
 const tools=node('div','gift-dialog-tools');search=node('input','gift-dialog-search');search.type='search';search.placeholder='Tìm tên quà, STT, số xu hoặc ID…';search.setAttribute('aria-label','Tìm quà trong thư viện');count=node('div','gift-dialog-count');tools.append(search,count);
 const columns=node('div','gift-list-columns');for(const label of ['STT','Icon','Tên quà','Xu','ID TikTok'])columns.append(node('span','',label));
 list=node('div','gift-picker-list');list.setAttribute('role','listbox');list.setAttribute('aria-label','Quà TikTok theo số xu tăng dần');
 help=node('p','gift-dialog-help');dialog.append(header,tools,columns,list,help);document.body.append(dialog);
 search.oninput=renderOptions;search.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();list.querySelector('[role="option"]')?.focus();}};
 list.onkeydown=e=>{const options=[...list.querySelectorAll('[role="option"]')],index=options.indexOf(document.activeElement);let next;if(e.key==='ArrowDown')next=Math.min(options.length-1,index+1);if(e.key==='ArrowUp')next=Math.max(0,index-1);if(e.key==='Home')next=0;if(e.key==='End')next=options.length-1;if(next!=null){e.preventDefault();options[next]?.focus();}};
 dialog.addEventListener('close',()=>{opener?.setAttribute('aria-expanded','false');opener?.focus();active=null;});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
}
function choose(value){const select=active.select;if(value&&![...select.options].some(o=>o.value===value)){const g=active.gifts.find(g=>g.tiktokGiftId===value),option=node('option','',g.name);option.value=value;select.append(option);}select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));active.refresh();dialog.close();}
function renderOptions(){
 if(!active)return;const q=normalize(search.value),filtered=active.gifts.filter(g=>normalize([String(g.stt).padStart(2,'0'),g.name,g.coins??'Giá bị che',g.tiktokGiftId].join(' ')).includes(q));list.replaceChildren();count.textContent=`${filtered.length} / ${active.gifts.length} quà · STT theo xu tăng dần`;
 const empty=node('button','gift-picker-option gift-picker-unset');empty.type='button';empty.setAttribute('role','option');empty.setAttribute('aria-selected',String(!active.select.value));empty.dataset.giftId='';empty.append(node('span','gift-stt','—'),node('span','gift-unset-icon','◇'),node('span','gift-picker-name','Chưa gán quà'),node('span','','—'),node('span','','—'));empty.onclick=()=>choose('');list.append(empty);
 for(const g of filtered){const row=node('button','gift-picker-option');row.type='button';row.dataset.giftId=g.tiktokGiftId;row.dataset.coins=g.coins??'';row.dataset.stt=g.stt;row.setAttribute('role','option');row.setAttribute('aria-selected',String(active.select.value===g.tiktokGiftId));row.setAttribute('aria-label',`${g.stt}. ${g.name}, ${g.coins==null?'Giá bị che':g.coins+' xu'}, ID ${g.tiktokGiftId}`);row.append(node('span','gift-stt',String(g.stt).padStart(2,'0')),giftImage(g),node('span','gift-picker-name',g.name),price(g),node('span','gift-picker-id',g.tiktokGiftId));row.onclick=()=>choose(g.tiktokGiftId);list.append(row);}
 if(!filtered.length)list.append(node('p','gift-picker-empty','Không có quà phù hợp. Thử tên, số xu hoặc ID khác.'));
}
export function attachGiftPicker(select,gifts,{label,getQuery=()=>'',hint='Chọn quà xong, bấm Lưu bảng quà để áp dụng.'}={}){
 ensureDialog();select.hidden=true;select.classList.add('gift-native-hidden');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
 const button=node('button','gift-picker-choice');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',label||'Chọn quà');select.after(button);
 function refresh(){const gift=gifts.find(g=>g.tiktokGiftId===select.value);button.replaceChildren();if(gift)button.append(node('span','gift-stt',String(gift.stt).padStart(2,'0')),giftImage(gift),node('span','gift-choice-name',gift.name),price(gift));else button.append(node('span','gift-choice-name','Chưa gán quà'));button.append(node('span','gift-choice-arrow','⌄'));}
 const api={select,gifts,refresh};button.onclick=()=>{active=api;opener=button;heading.textContent=label||'Chọn quà TikTok';help.textContent=hint;search.value=getQuery();renderOptions();button.setAttribute('aria-expanded','true');dialog.showModal();search.focus();};select.addEventListener('change',refresh);refresh();return api;
}
