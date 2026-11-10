export class SpeechBuffer{
 constructor(request){this.request=request;this.jobs=new Map();}
 get(key,event,line){let job=this.jobs.get(key);if(job)return job.promise;const controller=new AbortController();job={controller,promise:this.request(event,line,controller.signal)};this.jobs.set(key,job);job.promise.catch(()=>{if(this.jobs.get(key)===job)this.jobs.delete(key);});while(this.jobs.size>6){const[first,old]=this.jobs.entries().next().value;this.jobs.delete(first);old.controller.abort();}return job.promise;}
 clear(){for(const job of this.jobs.values())job.controller.abort();this.jobs.clear();}
}
