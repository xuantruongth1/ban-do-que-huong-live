// One warm voice model, with cooperative interruption between ONNX calls.
function createVoiceJobs({generate,cancel=()=>false}={}){
 const queue=[];let active=null,sequence=0;
 function insert(job){const at=queue.findIndex(other=>Number(other.priority)<Number(job.priority));if(at<0)queue.push(job);else queue.splice(at,0,job);}
 function request(text,file,id,background=false,valid=()=>true,priority=0){
  return new Promise((resolve,reject)=>{
   const job={text,file,id,background,valid,priority:background?-1:Number(priority)||0,resolve,reject,order:++sequence};insert(job);
   preempt();
   pump();
  });
 }
 function preempt(){if(active&&!active.cancelling&&(!active.valid()||queue.some(job=>job.priority>active.priority||job.priority>0&&job.priority===active.priority)))active.cancelling=cancel(active.id)===true;}
 function pump(){
  if(active)return;let job;
  while((job=queue.shift())){if(!job.valid()){job.reject(Object.assign(Error('Lượt đọc đã đổi'),{code:'VOICE_STALE'}));continue;}break;}
  if(!job)return;active=job;
  Promise.resolve().then(()=>generate(job.text,job.file,job.id)).then(job.resolve,error=>{
   const restart=error?.code==='VOICE_WORKER_EXIT'&&!job.retriedWorker;
   if(job.valid()&&(error?.code==='VOICE_CANCELLED'||restart)){
    if(restart)job.retriedWorker=true;
    job.cancelling=false;
    insert(job);
   }else job.reject(error);
  }).finally(()=>{active=null;pump();});
 }
 return {request,preempt,state:()=>({active:active?{id:active.id,priority:active.priority,cancelling:!!active.cancelling}:null,queued:queue.length})};
}
module.exports={createVoiceJobs};
