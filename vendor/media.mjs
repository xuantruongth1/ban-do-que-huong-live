import fs from 'node:fs';
export function parseByteRange(header,size){
 if(!header)return null;
 const match=/^bytes=(\d*)-(\d*)$/.exec(header);if(!match||(!match[1]&&!match[2]))return false;
 let start,end;
 if(!match[1]){const suffix=Number(match[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return false;start=Math.max(0,size-suffix);end=size-1;}
 else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):size-1;}
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;
 return {start,end};
}
export function serveMp3(req,res,file,type='audio/mpeg'){
 const size=fs.statSync(file).size,range=parseByteRange(req.headers.range,size);
 res.setHeader('Content-Type',type);res.setHeader('Accept-Ranges','bytes');res.setHeader('Cache-Control','public, max-age=3600');
 if(range===false){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
 const start=range?.start??0,end=range?.end??size-1;
 res.setHeader('Content-Length',end-start+1);if(range)res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
 res.writeHead(range?206:200);if(req.method==='HEAD'){res.end();return;}
 const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
}
