// Locations/components from VNSDI public administrative data, 01/10/2026.
export async function drawArchipelagos(root){
 const data=await fetch('/archipelagos-map.json').then(r=>r.json()),ns='http://www.w3.org/2000/svg',make=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;return e;};
 for(const a of data){const group=make('g',{class:'archipelago',id:a.id,role:'img','aria-label':a.name+' · Việt Nam','data-owners':a.ownerIds.join(',')});for(const [x,y]of a.markers){const mark=make('g',{class:'geographic-island',transform:`translate(${x},${y})`});mark.append(make('circle',{r:1.2}));group.append(mark);}const[x,y]=a.label;group.append(make('text',{x,y,class:'archipelago-name','text-anchor':'middle'},a.name),make('text',{x,y:y+17,class:'archipelago-country','text-anchor':'middle'},(a.id==='hoang-sa'?'Đà Nẵng':'Khánh Hòa')+' · VIỆT NAM'));root.append(group);}
}
