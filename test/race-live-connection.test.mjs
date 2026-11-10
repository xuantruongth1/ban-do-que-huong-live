import test from'node:test';import assert from'node:assert/strict';import{EventEmitter}from'node:events';import{DirectLive,loadLiveConnector}from'../core/direct-live.mjs';
test('LIVE kết thúc chuyển chờ thử lại, kết nối mới nhận sự kiện, Ngắt hủy thử lại',async()=>{
 const clients=[],statuses=[];const live=new DirectLive('tester',{retryMs:10,factory:()=>{const c=new EventEmitter();c.connect=async()=>({roomId:'123'});c.disconnect=async()=>{};clients.push(c);return c;}});live.on('status',s=>statuses.push(s));
 try{await live.connect();assert.equal(statuses.at(-1).state,'waiting');clients[0].emit('streamEnd');assert.equal(statuses.at(-1).state,'retry');assert.equal(live.closed,false);await new Promise(r=>setTimeout(r,35));assert.equal(clients.length,2);assert.equal(statuses.at(-1).state,'waiting');clients[1].emit('chat',{userId:'a',nickname:'An',comment:'Nghệ An',msgId:'1'});assert.equal(statuses.at(-1).state,'connected');clients[1].emit('streamEnd');await live.disconnect();await new Promise(r=>setTimeout(r,35));assert.equal(clients.length,2);assert.equal(live.timer,null);}finally{await live.disconnect();}
});

test('nạp đúng dependency kết nối thật từ thư viện chung khi dự án chưa có node_modules riêng',async()=>{const m=await loadLiveConnector();assert.equal(typeof m.TikTokLiveConnection,'function');});
