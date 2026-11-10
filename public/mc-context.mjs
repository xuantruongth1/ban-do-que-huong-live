export function currentMcLine(event,state){
 if(event.roundId&&event.roundId!==state.roundId||event.expiresAt<=state.clock)return null;
 if(event.auto&&state.phase!=='RACING'&&!['WAITING','FINISHED'].includes(state.phase))return null;
 const values={...event.values};
 if(event.type==='chase'&&!event.sample){
  if(state.phase!=='RACING')return null;const ranking=[...state.groups].filter(g=>g.points>0).sort((a,b)=>b.points-a.points||a.origin.localeCompare(b.origin,'vi')),home=ranking.find(g=>g.homeId===values.homeId),target=ranking.find(g=>g.homeId===values.targetId);if(!home||!target||home.points>target.points||ranking.indexOf(home)!==ranking.indexOf(target)+1)return null;values.needed=target.points-home.points+1;
 }
 if(['progress','milestone','allLit'].includes(event.type)){values.lit=state.litHomes.length;values.total=state.config.mapMode==='34'?34:63;values.dark=values.total-values.lit;values.people=state.total;}
 return {text:event.template?event.template.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??'')):event.text,values};
}
