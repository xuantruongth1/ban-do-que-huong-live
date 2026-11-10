// Short, serialized requests leave HTTP/1 connections available for page reloads,
// videos and speech. A controller preview reuses its parent's snapshot.
export function subscribeState(onState,{interval=500,onError=()=>{}}={}){
 let timer=null,request=null,stopped=false;
 async function poll(){if(stopped||request)return;request=new AbortController();let delay=document.hidden?Math.max(1500,interval):interval;
  try{const r=await fetch('/api/state',{cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(8000)])});if(!r.ok)throw Error('Máy chủ phản hồi '+r.status);const snapshot=await r.json();if(!stopped)onState(snapshot);}catch(e){if(!stopped){onError(e);delay=2000;}}finally{request=null;if(!stopped)timer=setTimeout(poll,delay);}
 }
 const refresh=()=>{if(!document.hidden&&!stopped){clearTimeout(timer);void poll();}};
 const stop=()=>{stopped=true;clearTimeout(timer);request?.abort();};
 const resume=()=>{if(stopped){stopped=false;void poll();}};
 addEventListener('pagehide',stop);addEventListener('pageshow',resume);document.addEventListener('visibilitychange',refresh);void poll();
 return()=>{stop();removeEventListener('pagehide',stop);removeEventListener('pageshow',resume);document.removeEventListener('visibilitychange',refresh);};
}
export function subscribePreview(onState,onError){
 try{if(parent!==window&&parent.location.origin===location.origin){const receive=e=>onState(e.detail);parent.addEventListener('hometown-state',receive);if(parent.hometownDashboardState)onState(parent.hometownDashboardState);addEventListener('pagehide',()=>parent.removeEventListener('hometown-state',receive),{once:true});return;}}catch{}
 return subscribeState(onState,{interval:300,onError});
}
