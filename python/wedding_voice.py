import os,sys,json,time,subprocess
from pathlib import Path
ROOT=Path(os.environ['WVIP_RESOURCES_DIR'])
DATA=Path(os.environ['WVIP_DATA_DIR'])
os.environ['HF_HOME']=str(ROOT/'voice-models')
os.environ['TEMP']=str(DATA/'voice-temp')
os.environ['TMP']=os.environ['TEMP']
os.environ['HF_HUB_DISABLE_XET']='1'
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
os.environ['XDG_CACHE_HOME']=str(DATA/'cache')
os.environ['TORCH_HOME']=str(DATA/'cache'/'torch')
os.environ['NUMBA_CACHE_DIR']=str(DATA/'cache'/'numba')
os.environ['MPLCONFIGDIR']=str(DATA/'cache'/'matplotlib')
for directory in ['voice-temp','cache','cache/torch','cache/numba','cache/matplotlib']:
 (DATA/directory).mkdir(parents=True,exist_ok=True)

# Keep machine-readable replies separate from model initialization logs.
reply=sys.stdout
sys.stdout=sys.stderr
from vieneu import Vieneu
tts=Vieneu(backend='onnx')
clean_reference=tts._preclean_reference_audio
tts._preclean_reference_audio=lambda ref_audio,**kw: clean_reference(ref_audio,out_path=str(DATA/'voice-temp'/('reference-clean-'+str(os.getpid())+'.wav')),**kw)
# Cooperative cancellation keeps the same model/reference/settings in memory.
import queue,threading
class VoiceCancelled(BaseException):pass
cancel_event=threading.Event()
input_lock=threading.Lock()
current_id=[None]
cancelled_ids=set()
jobs=queue.Queue()
def check_cancel():
 if cancel_event.is_set():raise VoiceCancelled()
class InterruptibleSession:
 def __init__(self,session):self.session=session
 def __getattr__(self,name):return getattr(self.session,name)
 def run(self,*args,**kwargs):
  check_cancel()
  result=self.session.run(*args,**kwargs)
  check_cancel()
  return result
boundaries=0
engine=getattr(tts,'engine',None)
if engine is not None:
 for name,session in list(vars(engine).items()):
  if name.startswith('sess_') and callable(getattr(session,'run',None)):
   setattr(engine,name,InterruptibleSession(session));boundaries+=1
def read_input():
 for raw in sys.stdin:
  try:
   message=json.loads(raw)
   if 'cancel' in message:
    with input_lock:
     identity=str(message['cancel'])
     if len(cancelled_ids)>1024:cancelled_ids.clear()
     cancelled_ids.add(identity)
     if identity==current_id[0]:cancel_event.set()
   else:jobs.put(message)
  except Exception as error:
   print(json.dumps({'ok':False,'error':str(error)}),file=reply,flush=True)
 jobs.put(None)
threading.Thread(target=read_input,daemon=True).start()
print(json.dumps({'ready':True,'supportsCancel':boundaries>0}),file=reply,flush=True)
while True:
 job=jobs.get()
 if job is None:break
 with input_lock:
  current_id[0]=str(job.get('id',''))
  cancel_event.clear()
  if current_id[0] in cancelled_ids:cancel_event.set()
 try:
  check_cancel()
  started=time.time()
  audio=tts.infer(job['text'],ref_audio=str(ROOT/'mc-reference.wav'),denoise=job.get('denoise',False),temperature=0.65,use_ref_codes=True)
  check_cancel()
  raw_file=str(Path(job['file']).with_suffix('.raw.wav'))
  tts.save(audio,raw_file)
  subprocess.run(['ffmpeg','-y','-i',raw_file,'-af','loudnorm=I=-14:TP=-1:LRA=7','-ar','48000',job['file'],'-loglevel','error'],check=True,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
  Path(raw_file).unlink(missing_ok=True)
  check_cancel()
  print(json.dumps({'id':job['id'],'ok':True,'seconds':round(time.time()-started,2)}),file=reply,flush=True)
 except VoiceCancelled:
  for output in [Path(job['file']),Path(job['file']).with_suffix('.raw.wav')]:
   output.unlink(missing_ok=True)
  print(json.dumps({'id':job['id'],'ok':False,'cancelled':True,'error':'Lượt đọc đã được ưu tiên lại'}),file=reply,flush=True)
 except Exception as e:
  print(json.dumps({'id':job.get('id'),'ok':False,'error':str(e)}),file=reply,flush=True)

 finally:
  with input_lock:
   cancelled_ids.discard(str(job.get('id','')))
   current_id[0]=None

