export const lightPalette=['#00e676','#ffd000','#ff6b00','#009cff','#ed28ce','#8155ff','#00e0cf','#ff304f','#b2ef00','#ff70b5','#00c4ff','#ec9c00'];
export function provinceNeighbors(maps){
 if(maps.every(m=>Array.isArray(m.neighbors)))return new Map(maps.map(m=>[m.id,new Set(m.neighbors)]));const graph=new Map(maps.map(m=>[m.id,new Set()])),cells=new Map(),hits=new Map();
 for(const m of maps){const nums=m.path.match(/-?\d+(?:\.\d+)?/g).map(Number),seen=new Set();for(let i=0;i<nums.length;i+=2){const x=nums[i],y=nums[i+1],cx=Math.floor(x/2),cy=Math.floor(y/2),pointKey=x+','+y;if(seen.has(pointKey))continue;seen.add(pointKey);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const p of cells.get((cx+dx)+','+(cy+dy))||[]){if(p.id===m.id||Math.hypot(p.x-x,p.y-y)>1.8)continue;const key=[m.id,p.id].sort().join('|');hits.set(key,(hits.get(key)||0)+1);}const key=cx+','+cy;if(!cells.has(key))cells.set(key,[]);cells.get(key).push({id:m.id,x,y});}}
 for(const [pair,count]of hits)if(count>=2){const[a,b]=pair.split('|');graph.get(a).add(b);graph.get(b).add(a);}return graph;
}
export function assignProvinceColors(maps,count=6,palette=lightPalette){
 const graph=provinceNeighbors(maps),ids=[...graph.keys()].sort(),assigned=new Map(),used=Array(count).fill(0);let attempts=0;
 function solve(){if(assigned.size===ids.length)return true;if(++attempts>500000)return false;let chosen,saturation=-1,degree=-1;for(const id of ids){if(assigned.has(id))continue;const neighbors=graph.get(id),sat=new Set([...neighbors].filter(n=>assigned.has(n)).map(n=>assigned.get(n))).size;if(sat>saturation||sat===saturation&&neighbors.size>degree){chosen=id;saturation=sat;degree=neighbors.size;}}const forbidden=new Set([...graph.get(chosen)].map(n=>assigned.get(n)));for(const color of [...used.keys()].sort((a,b)=>used[a]-used[b]||a-b)){if(forbidden.has(color))continue;assigned.set(chosen,color);used[color]++;if(solve())return true;used[color]--;assigned.delete(chosen);}return false;}
 if(!solve())throw Error('Không thể phân màu bản đồ với số màu đã chọn');return new Map(ids.map(id=>[id,palette[assigned.get(id)]]));
}
export function colorSwatches(root,count,palette=lightPalette){root.replaceChildren();for(const color of palette.slice(0,count)){const swatch=document.createElement('span');swatch.style.background=color;swatch.title=color;root.append(swatch);}}
