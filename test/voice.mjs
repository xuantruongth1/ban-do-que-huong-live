import {startServer,api} from './helpers.mjs';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {base,child}=await startServer(3198),out=fileURLToPath(new URL('../test-output/',import.meta.url));const report=[];
try{await api(base,'audio-claim',{id:'voice-test-player',takeover:true});for(const voice of ['male','female']){await api(base,'settings',{settings:{voice,rate:1}});const response=await fetch(base+'/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'voice-test-player',text:'Đồng hương Quảng Nam ơi, cùng về nhà đón Tết đoàn viên!'})});if(!response.ok)throw Error(await response.text());const buffer=Buffer.from(await response.arrayBuffer());assert.ok(buffer.length>2000);await writeFile(out+'mc-'+voice+'.mp3',buffer);report.push({voice,bytes:buffer.length});await api(base,'audio-claim',{id:'voice-test-player'});}await writeFile(out+'voice-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}finally{child.kill();}
