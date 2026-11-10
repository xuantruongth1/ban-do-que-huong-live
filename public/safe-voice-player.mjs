// A failed media element must release its slot before the next sentence starts.
export function playVoiceSafely(sound,{signal,onStarted,startMs=6500,marginMs=5000,maxMs=120000}={}){
 return new Promise((resolve,reject)=>{let finished=false,startedOnce=false,timer;
  const cleanup=()=>{clearTimeout(timer);sound.removeEventListener('playing',started);sound.removeEventListener('ended',ended);sound.removeEventListener('error',error);signal?.removeEventListener('abort',abort);};
  const finish=err=>{if(finished)return;finished=true;cleanup();if(err){sound.pause();sound.removeAttribute('src');sound.load();reject(err);}else resolve();};
  const timeout=()=>finish(Error('Câu đọc quá thời gian, đang chuyển sang lượt tiếp theo.'));
  function started(){if(finished||startedOnce)return;startedOnce=true;clearTimeout(timer);const duration=Number.isFinite(sound.duration)&&sound.duration>0?sound.duration*1000/Math.max(.5,sound.playbackRate||1)+marginMs:maxMs;timer=setTimeout(timeout,Math.min(maxMs,Math.max(marginMs,duration)));onStarted?.();}
  function ended(){finish();}function error(){finish(Error('Không phát được câu MC.'));}function abort(){finish(new DOMException('Đã dừng giọng đọc','AbortError'));}
  if(signal?.aborted){abort();return;}sound.addEventListener('playing',started);sound.addEventListener('ended',ended);sound.addEventListener('error',error);signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(timeout,startMs);
  Promise.resolve(sound.play()).catch(e=>finish(e.name==='NotAllowedError'?Error('Bấm Bật âm thanh trên màn LIVE để nghe MC.'):e));
 });
}
