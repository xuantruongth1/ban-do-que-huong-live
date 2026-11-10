export const backgroundDesigns=[
 {id:'ocean',name:'Biển đêm',colors:['#020b22','#073b62','#31bad0']},
 {id:'aurora',name:'Cực quang',colors:['#031b26','#075847','#63e7c4']},
 {id:'lotus',name:'Sen ngọc',colors:['#081d29','#20455a','#d68ba7']},
 {id:'galaxy',name:'Ngân hà',colors:['#100d2c','#34265b','#b5a5ff']},
 {id:'dawn',name:'Bình minh',colors:['#171b30','#69463c','#efba72']},
 {id:'royal',name:'Xanh hoàng gia',colors:['#050d29','#1a326e','#e8cc82']},
 {id:'redgold',name:'Đỏ ánh kim',colors:['#24091c','#671c30','#edc778']},
 {id:'lantern',name:'Đèn lồng Tết',colors:['#08172b','#17384c','#edb56a']}
];
export function buildBackgroundPicker(root,select){
 for(const d of backgroundDesigns){const b=document.createElement('button');b.type='button';b.className='background-card';b.dataset.background=d.id;b.style.backgroundImage=`url('/assets/backgrounds/${d.id}.svg')`;const name=document.createElement('span');name.textContent=d.name;b.append(name);b.onclick=()=>{select.value=d.id;select.dispatchEvent(new Event('change',{bubbles:true}));sync();};root.append(b);}
 function sync(){for(const b of root.children)b.setAttribute('aria-pressed',String(b.dataset.background===select.value));}select.addEventListener('change',sync);return sync;
}
