const NS='http://www.w3.org/2000/svg';
export function mapLabelKey(maps,scale=1){let hash=2166136261;for(const p of maps){const text=p.id+'|'+p.name+'|'+p.path+'|'+p.center.join(',');for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}}return (hash>>>0).toString(16)+'|'+Number(scale).toFixed(2);}
export function createProvinceLabels(root,maps,scale=1,prepared){
 const cached=prepared?.[mapLabelKey(maps,scale)];if(cached){root.innerHTML=cached;return{font:14.5*scale,count:maps.length,prepared:true};}
 root.replaceChildren();const font=14.5*scale,placed=[],ctx=document.createElement('canvas').getContext('2d'),paths=new Map(maps.map(p=>[p.id,new Path2D(p.path)])),regions=new Map(maps.map(p=>[p.id,p])),deferred=[];
 const inside=(id,x,y)=>{const b=regions.get(id).bounds;return x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&ctx.isPointInPath(paths.get(id),x,y,'evenodd');};
 const overlaps=b=>placed.some(a=>b.x<a.x+a.w+2&&b.x+b.w+2>a.x&&b.y<a.y+a.h+2&&b.y+b.h+2>a.y);
 const contained=(id,b)=>[.25,.5,.75].every(a=>[.25,.5,.75].every(c=>inside(id,b.x+a*b.w,b.y+c*b.h)));
 function emit(p,s){placed.push(s.box);const g=document.createElementNS(NS,'g');g.setAttribute('class','province-label');g.dataset.homeId=p.id;g.dataset.placement=s.callout?'callout':'inside';
  if(s.callout){const l=document.createElementNS(NS,'path');l.setAttribute('d',`M${p.center[0]},${p.center[1]}L${s.x},${s.y}`);l.setAttribute('class','province-label-line');g.append(l);}
  const text=document.createElementNS(NS,'text');text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','central');text.style.fontSize=s.ratio+'em';
  for(const [i,line]of s.lines.entries()){const span=document.createElementNS(NS,'tspan');span.setAttribute('x',s.x);span.setAttribute('y',s.y+(i-(s.lines.length-1)/2)*font*1.1*s.ratio*1.15);span.textContent=line;text.append(span);}
  const title=document.createElementNS(NS,'title');title.textContent=p.name;g.append(text,title);root.append(g);
 }
 for(const p of [...maps].sort((a,b)=>(b.bounds[2]-b.bounds[0])*(b.bounds[3]-b.bounds[1])-(a.bounds[2]-a.bounds[0])*(a.bounds[3]-a.bounds[1]))){
  let selected=null;const words=p.name.split(' '),layouts=[[p.name]];if(words.length>1){const n=Math.ceil(words.length/2);layouts.push([words.slice(0,n).join(' '),words.slice(n).join(' ')]);}
  for(const ratio of [1,.9,.8,.7]){if(selected)break;const fs=font*1.1*ratio;ctx.font=`700 ${fs}px Segoe UI`;
   for(const lines of layouts){const w=Math.max(...lines.map(t=>ctx.measureText(t).width))+5,h=fs*1.15*lines.length+3;let best=Infinity;
    for(let y=p.bounds[1]+h/2;y<=p.bounds[3]-h/2;y+=3)for(let x=p.bounds[0]+w/2;x<=p.bounds[2]-w/2;x+=3){const box={x:x-w/2,y:y-h/2,w,h},distance=(x-p.center[0])**2+(y-p.center[1])**2;if(distance>=best||overlaps(box)||(box.x<p.center[0]+14&&box.x+box.w>p.center[0]-14&&box.y<p.center[1]-5&&box.y+box.h>p.center[1]-42)||!contained(p.id,box))continue;best=distance;selected={x,y,box,ratio,lines};}
    if(selected)break;
   }
  }
  if(selected)emit(p,selected);else deferred.push(p);
 }
 // Narrow provinces use a visible leader line rather than a name on another province.
 for(const p of deferred){const ratio=.8,fs=font*1.1*ratio;ctx.font=`700 ${fs}px Segoe UI`;const w=ctx.measureText(p.name).width+5,h=fs+4;let selected=null,best=Infinity;
  for(let dy=-105;dy<=105;dy+=7)for(let dx=-140;dx<=140;dx+=7){const x=p.center[0]+dx,y=p.center[1]+dy,box={x:x-w/2,y:y-h/2,w,h},d=dx*dx+dy*dy;if(d>=best||x<w/2+3||x>615-w/2||y<h||overlaps(box)||maps.some(m=>inside(m.id,x,y)))continue;best=d;selected={x,y,box,ratio,lines:[p.name],callout:true};}
  if(!selected)selected={x:p.center[0],y:p.center[1],box:{x:p.center[0]-w/2,y:p.center[1]-h/2,w,h},ratio:.65,lines:[p.name]};emit(p,selected);
 }
 return{font,count:placed.length};
}
