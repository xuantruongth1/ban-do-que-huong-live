// All online synthesis, including warm-up, shares the provider's bounded lanes.
export class VoiceJobs{
 constructor(limit=1){this.limit=Math.max(1,Math.min(2,limit));this.active=0;this.queue=[];}
 run(task,{priority=0,signal}={}){return new Promise((resolve,reject)=>{
  if(signal?.aborted){reject(signal.reason);return;}if(this.queue.length>=16){reject(Error('Hàng tạo giọng đang đầy, vui lòng chờ.'));return;}
  const job={task,priority,resolve,reject,signal};job.abort=()=>{const i=this.queue.indexOf(job);if(i>=0)this.queue.splice(i,1);reject(signal.reason||new DOMException('Đã hủy','AbortError'));};signal?.addEventListener('abort',job.abort,{once:true});this.queue.push(job);this.pump();
 });}
 pump(){while(this.active<this.limit&&this.queue.length){this.queue.sort((a,b)=>b.priority-a.priority);const job=this.queue.shift();this.active++;void this.perform(job);}}
 async perform(job){try{job.signal?.throwIfAborted();job.resolve(await job.task());}catch(e){job.reject(e);}finally{job.signal?.removeEventListener('abort',job.abort);this.active--;this.pump();}}
}
