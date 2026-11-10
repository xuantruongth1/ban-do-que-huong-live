import {EdgeTTS} from 'node-edge-tts';
const cached=new Map(),inflight=new Map();let active=0;
export async function synthesize(text,voice='vi-VN-HoaiMyNeural'){
  if(!['vi-VN-HoaiMyNeural','vi-VN-NamMinhNeural'].includes(voice))throw Error('Giọng đọc không hợp lệ');
  const key=voice+'|'+text;
  if(cached.has(key))return cached.get(key);
  if(inflight.has(key))return inflight.get(key);
  if(active>=2)throw Error('Giọng đọc đang bận, vui lòng thử lại');
  const task=(async()=>{
    active++;
    try{
      const tts=new EdgeTTS({voice,lang:'vi-VN',rate:'-3%',timeout:12000,outputFormat:'audio-24khz-48kbitrate-mono-mp3'});
      const chunks=[];
      for await(const chunk of tts.streamAudio(text))if(Buffer.isBuffer(chunk))chunks.push(chunk);
      const buffer=Buffer.concat(chunks);if(buffer.length<200)throw Error('Dịch vụ chưa trả về âm thanh');
      cached.set(key,buffer);while(cached.size>60)cached.delete(cached.keys().next().value);return buffer;
    }finally{active--;inflight.delete(key);}
  })();
  inflight.set(key,task);return task;
}
