// Each view uses the same projection and uniform scale; the overview retains
// the complete offshore geography while the main view makes provinces readable.
export function createMapFraming(){
 const stage=document.getElementById('stage'),ns='http://www.w3.org/2000/svg';let full=false,lastMode='';
 const toggle=document.createElement('button');toggle.id='map-view-toggle';toggle.type='button';toggle.textContent='Xem toàn cảnh lãnh thổ';toggle.setAttribute('aria-pressed','false');stage.append(toggle);
 const overview=document.createElement('div');overview.id='map-overview';const title=document.createElement('strong');title.textContent='TOÀN CẢNH LÃNH THỔ';overview.append(title);
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','25 30 950 1020');svg.setAttribute('role','img');svg.setAttribute('aria-label','Toàn cảnh Việt Nam gồm Hoàng Sa và Trường Sa, cùng hệ chiếu với bản đồ chính');
 for(const id of ['lands','archipelagos']){const use=document.createElementNS(ns,'use');use.setAttribute('href','#'+id);svg.append(use);}overview.append(svg);const note=document.createElement('small');note.textContent='HOÀNG SA · TRƯỜNG SA · VIỆT NAM';overview.append(note);stage.append(overview);
 toggle.onclick=()=>{full=!full;toggle.textContent=full?'Phóng lớn đất liền':'Xem toàn cảnh lãnh thổ';toggle.setAttribute('aria-pressed',String(full));};
 return {bounds:()=>full?[25,30,950,1020]:[20,35,500,930],update:active=>{const mode=full+'|'+active;if(mode===lastMode)return;lastMode=mode;overview.hidden=full||active;toggle.hidden=active;stage.classList.toggle('mainland-view',!full);}};
}
