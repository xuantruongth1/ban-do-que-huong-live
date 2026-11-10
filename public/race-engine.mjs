import {demoPeople} from './demo-people.mjs';
const randomUUID=()=>globalThis.crypto.randomUUID();
import {regionsFor,regionById,parseProvince} from './regions.mjs';
import {defaultRaceConfig,validateRaceConfig,giftPoints} from './race-config.mjs';
import {GiftLedger} from './gift-ledger.mjs';
const clean=(v,max=70)=>String(v||'').replace(/[\x00-\x1f]/g,'').slice(0,max);
const safeAvatar=v=>{try{return new URL(v).protocol==='https:'?String(v).slice(0,2048):'';}catch{return '';}};
export class ProvinceRace{
 constructor(saved={},config=defaultRaceConfig){
  this.schema=2;this.config=validateRaceConfig(saved.schema===2?saved.config||config:config);this.nextConfig=validateRaceConfig(config);this.sessionId=saved.schema===2?saved.sessionId||randomUUID():randomUUID();this.roundId=saved.schema===2?saved.roundId||randomUUID():randomUUID();this.roundNumber=saved.schema===2?saved.roundNumber||0:0;
  this.players=new Map((saved.schema===2?saved.players||[]:[]).filter(p=>regionById.has(p.homeId)).map(p=>[p.uid,p]));this.scores=new Map(saved.schema===2?saved.scores||[]:[]);this.comments=new Map(saved.schema===2?saved.comments||[]:[]);this.coins=new Map(saved.schema===2?saved.coins||[]:[]);this.litHomes=new Set(saved.schema===2?saved.litHomes||[]:[]);
  this.ledger=new GiftLedger(saved.ledger);this.giftHomes=new Map(saved.schema===2?saved.giftHomes||[]:[]);this.champions=new Map(saved.schema===2?saved.champions||[]:[]);this.contributions=new Map(saved.schema===2?saved.contributions||[]:[]);this.scoreEvents=[];this.thresholds=new Map();this.seen=new Set(saved.schema===2?saved.seen||[]:[]);this.lastComment=new Map();
  this.clock=Number(saved.clock)||0;this.remaining=saved.schema===2?(Number.isFinite(saved.remaining)?Math.max(0,saved.remaining):this.config.duration):this.config.duration;this.countdownRemaining=Number(saved.countdownRemaining)||0;this.phase=saved.schema===2?saved.phase||'WAITING':'WAITING';this.resumePhase=saved.resumePhase||'RACING';if(['RACING','COUNTDOWN'].includes(this.phase)){this.resumePhase=this.phase;this.phase='PAUSED';}if(this.phase==='RESULTS')this.phase='FINISHED';if(this.phase==='FINISHED')this.remaining=0;
  this.sequence=0;this.revision=0;this.active=null;this.queue=[];this.battle=null;this.lastBattle=null;this.result=saved.schema===2?saved.result||null:null;this.restRemaining=null;this.notices=[];this.announcements=[];this.spoken=new Map();this.markers=new Set();this.lastLightingAt=Number.isFinite(saved.lastLightingAt)?saved.lastLightingAt:this.clock;this.autoLightIndex=saved.autoLightIndex||0;this.lastActivity=this.clock;this.lastLeader='';this.lastIntro='';this.pendingMilestone=false;this.lineCounts=new Map(saved.lineCounts||[]);this.lastAutoMC=this.clock-8;this.autoCycle=0;this.socialSeen=new Set();this.homeActivity=new Map();
 }
 get regions(){return regionsFor(this.config.mapMode);}
 configure(config){this.nextConfig=validateRaceConfig(config);if(['WAITING','FINISHED'].includes(this.phase)&&(this.config.mapMode===this.nextConfig.mapMode||this.roundNumber===0)){if(this.config.mapMode!==this.nextConfig.mapMode)this.players.clear();this.config=this.nextConfig;}}
 announce(type,vars={},priority=2,cooldown=0,key=type){
  if(cooldown&&this.spoken.has(key)&&this.clock-this.spoken.get(key)<cooldown)return;
  this.spoken.set(key,this.clock);const lines=this.config.templates[type==='gift'&&this.config.mcFastGift?'giftQuick':type]||[];if(!lines.length)return;const values={people:[...this.players.values()].filter(p=>p.roundComments>0).length,dark:this.regions.length-this.litHomes.size,total:this.regions.length,round:this.roundNumber,minutes:Math.round(this.config.duration/60*10)/10,lit:this.litHomes.size,...vars};
  const index=this.lineCounts.get(type)||0;this.lineCounts.set(type,index+1);const template=lines[index%lines.length];const text=template.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??''));
  const item={id:++this.sequence,roundId:this.roundId,type,template,values,text:clean(text,700),priority,at:this.clock,expiresAt:this.clock+(['winnerVisit','hometownVisit'].includes(type)?95:type==='manual'?120:type==='final'?2:priority>=7?40:25)};this.announcements.push(item);this.announcements=this.announcements.slice(-60);this.notices.unshift({id:item.id,text:item.text});this.notices=this.notices.slice(0,30);return item;
 }
 notice(text){this.notices.unshift({id:++this.sequence,text:clean(text,500)});this.notices=this.notices.slice(0,30);}
 recordScore(homeId,uid,points,kind,extra={}){
  const key=homeId+'|'+uid;this.contributions.set(key,(this.contributions.get(key)||0)+points);const incumbent=this.champions.get(homeId);if(points>0&&(!incumbent||(this.contributions.get(key)||0)>(this.contributions.get(homeId+'|'+incumbent)||0)))this.champions.set(homeId,uid);
  this.scoreEvents.push({id:++this.sequence,roundId:this.roundId,homeId,uid,points,kind,at:this.clock,...extra});this.scoreEvents=this.scoreEvents.slice(-80);
 }
 intro(id){const r=regionById.get(id);return this.config.regionSettings[id]?.intro||r?.intro||`Mỗi lời điểm danh của đồng hương ${r?.name||''} đều góp một ánh đèn và một câu chuyện quê nhà.`;}
 start(){
  if(['RACING','COUNTDOWN','PAUSED'].includes(this.phase))throw Error('Kết thúc cuộc đua hiện tại trước khi mở vòng mới.');
  if(this.config.mapMode!==this.nextConfig.mapMode)this.players.clear();this.config=validateRaceConfig(this.nextConfig);this.roundId=randomUUID();this.roundNumber++;this.remaining=this.config.duration;this.countdownRemaining=this.config.countdown;this.lastLightingAt=this.clock;this.autoLightIndex=0;for(const [uid,p]of this.players)if(p.synthetic)this.players.delete(uid);this.scores.clear();this.contributions.clear();this.champions.clear();this.scoreEvents=[];this.comments.clear();this.coins.clear();this.litHomes.clear();this.thresholds.clear();this.lastComment.clear();this.result=null;this.active=null;this.queue=[];this.battle=null;this.lastBattle=null;this.restRemaining=null;this.markers.clear();this.announcements=[];this.spoken.clear();this.lastLeader='';this.lastActivity=this.clock;this.lastIntro='';for(const p of this.players.values())p.roundComments=0;
  this.phase=this.countdownRemaining>0?'COUNTDOWN':'RACING';this.announce(this.phase==='COUNTDOWN'?'countdown':'start',{seconds:this.config.countdown},7);this.revision++;
 }
 pause(){if(['RACING','COUNTDOWN','RESULTS'].includes(this.phase)){this.resumePhase=this.phase;this.phase='PAUSED';this.announce('paused',{},8);}else if(this.phase==='PAUSED'){this.phase=this.resumePhase;this.announce('resumed',{},8);const a=this.active;if(a&&['winnerIntro','roses'].includes(a.action)){a.audioDone=false;this.announce(a.action==='winnerIntro'?'winnerVisit':'hometownVisit',{uid:a.uid,homeId:a.homeId,name:a.name,province:a.origin,intro:this.intro(a.homeId)},8);}}else throw Error('Chưa có cuộc đua đang chạy.');this.revision++;}
 comment(data){
  const uid=clean(data.userId);if(!uid)return false;const eventId=String(data.msgId||'');if(eventId&&eventId!=='0'){if(this.seen.has(eventId))return false;this.seen.add(eventId);if(this.seen.size>20000)this.seen.delete(this.seen.values().next().value);}
  const r=parseProvince(data.comment,this.config.regionSettings,this.config.mapMode);if(!r){if(/^(?:\d{2}|qu[eê]\b|t[iỉ]nh\b)/i.test(String(data.comment||'').trim()))this.announce('unknown',{},1,30);return false;}
  const prior=this.players.get(uid);if(!prior&&this.players.size>=10000){this.notice('Đã đủ 10.000 người trong phòng.');return false;}
  if(this.lastComment.has(uid)&&this.clock-this.lastComment.get(uid)<this.config.commentCooldown)return false;this.lastComment.set(uid,this.clock);
  const previousActivity=this.homeActivity.get(r.id)??this.clock;const p={uid,name:clean(data.nickname)||prior?.name||'Đồng hương',avatar:safeAvatar(data.profilePictureUrl)||prior?.avatar||'',homeId:r.id,provinceId:r.id,origin:r.name,coins:prior?.coins||0,roundComments:prior?.roundComments||0};this.players.set(uid,p);this.revision++;
  if(this.phase!=='RACING'||this.remaining<=0){this.announce('waiting',{name:p.name,province:r.name},1,20);return true;}
  this.homeActivity.set(r.id,this.clock);const first=!this.litHomes.has(r.id);this.litHomes.add(r.id);this.comments.set(r.id,(this.comments.get(r.id)||0)+1);this.scores.set(r.id,(this.scores.get(r.id)||0)+this.config.commentPoints);p.roundComments++;this.lastLightingAt=this.clock;this.recordScore(r.id,uid,this.config.commentPoints,'comment',{name:p.name,avatar:p.avatar});this.lastActivity=this.clock;
  if(first){this.announce('firstLight',{name:p.name,province:r.name},4);if(this.litHomes.size===1||this.litHomes.size%5===0||this.litHomes.size===this.regions.length){const said=this.announce('milestone',{},5,2);if(!said)this.pendingMilestone=true;}}
  else this.announce('comment',{name:p.name,province:r.name,points:this.config.commentPoints,score:this.scores.get(r.id)},2,this.config.mcCommentGap,'comments');
  if(first&&this.clock-(this.spoken.get('intro')??-100)>18){this.announce('intro',{province:r.name,intro:this.intro(r.id)},1,18);this.lastIntro=r.id;}
  if(prior&&prior.homeId!==r.id)this.announce('switchedHome',{name:p.name,province:r.name},2,15,'home-switch');else if(!first&&(!prior||prior.roundComments===0))this.announce(this.remaining<45?'lateJoin':'homeJoin',{name:p.name,province:r.name,seconds:Math.ceil(this.remaining)},2,12,'home-join');else if(!first&&this.clock-previousActivity>45)this.announce('comeback',{name:p.name,province:r.name},2,25);if(this.config.commentZoomEnabled)this.scene('commentZoom',{homeId:r.id,origin:r.name,name:p.name,uid,points:this.scores.get(r.id)},this.config.commentZoomDuration);this.checkLeader();return true;
 }
 ranking(){
  const groups=new Map();for(const id of new Set([...this.litHomes,...this.scores.keys()])){const r=regionById.get(id);if(r)groups.set(id,{homeId:id,provinceId:id,origin:r.name,name:r.name,points:this.scores.get(id)||0,coins:this.coins.get(id)||0,checkins:this.comments.get(id)||0,count:0,avatars:[]});}
  for(const p of this.players.values()){if(p.synthetic){const g=groups.get(p.homeId);if(g){g.autoCount=(g.autoCount||0)+1;if(g.avatars.length<5)g.avatars.push({...p});}continue;}if(!p.roundComments)continue;const g=groups.get(p.homeId);if(g){g.count++;if(g.avatars.length<5)g.avatars.push({...p});}}
  for(const g of groups.values())g.king=null;for(const [key,points]of this.contributions){const split=key.indexOf('|'),g=groups.get(key.slice(0,split)),p=this.players.get(key.slice(split+1));if(g&&p&&points>0&&(!g.king||points>g.king.points||points===g.king.points&&p.uid===this.champions.get(g.homeId)))g.king={uid:p.uid,name:p.name,avatar:p.avatar,points};}
  return [...groups.values()].sort((a,b)=>b.points-a.points||b.checkins-a.checkins||a.name.localeCompare(b.name,'vi'));
 }
 checkLeader(){const rank=this.ranking();if(!rank[0]?.points)return;const leads=rank.filter(g=>g.points===rank[0].points),key=leads.map(g=>g.homeId).sort().join('|');if(this.lastLeader&&this.lastLeader!==key){if(leads.length>1)this.announce('tieLead',{provinces:leads.slice(0,3).map(g=>g.origin).join(', ')},4,8,'lead');else this.announce('leader',{province:leads[0].origin,score:leads[0].points},5,5,'lead-change');}this.lastLeader=key;}
 scene(action,fields={},duration=8){
  if(this.phase!=='RACING'&&!['winner','winnerIntro'].includes(action))return false;
  if(this.queue.length>=60){this.notice('Hàng đợi hiệu ứng đầy, điểm quà vẫn được ghi nhận.');return false;}
  if(action==='commentZoom'){this.queue=this.queue.filter(s=>s.action!=='commentZoom');if(this.active?.action==='commentZoom'&&this.active.homeId===fields.homeId)return true;}else{this.queue=this.queue.filter(s=>s.action!=='commentZoom');if(this.active?.action==='commentZoom')this.active=null;}
  if(action==='dragon'){for(const r of this.regions)this.litHomes.add(r.id);this.revision++;}
  if(action==='roses')duration=Math.max(12,duration);
  const last=this.queue.at(-1);if(last&&last.action===action&&last.uid===fields.uid){last.count=(last.count||1)+(fields.count||1);return true;}
  this.queue.push({id:++this.sequence,action,...fields,duration,count:fields.count||1});this.runScenes();return true;
 }
 runScenes(){let start=this.clock;if(this.active&&this.clock>=this.active.end){start=this.active.end;this.active=null;}while(!this.active&&this.queue.length){this.active={...this.queue.shift(),start};this.active.end=start+this.active.duration;if(this.clock>=this.active.end){start=this.active.end;this.active=null;continue;}if(this.active.action==='roses'){const a=this.active;this.announce('hometownVisit',{uid:a.uid,homeId:a.homeId,name:a.name,province:a.origin,intro:this.intro(a.homeId)},8);}if(this.active.action==='winnerIntro'){const a=this.active;this.announce('winnerVisit',{homeId:a.homeId,province:a.origin,intro:this.intro(a.homeId)},8);}break;}}

 gift(data,rules=[]){
  const result=this.ledger.receive({...data,roundKey:this.roundId});const row=result.key?this.ledger.rows.get(result.key):null;
  if(this.giftHomes.size>12000){for(const key of this.giftHomes.keys())if(!this.ledger.rows.has(key))this.giftHomes.delete(key);}if(row&&!this.giftHomes.has(row.key))this.giftHomes.set(row.key,this.players.get(String(data.userId))?.homeId||null);
  if(result.unverified){this.notice(result.reason);return result;}if(!result.accepted)return result;this.revision++;
  if(result.roundKey!==this.roundId||this.phase!=='RACING'||this.remaining<=0){this.notice('Đã ghi nhận quà; quà ngoài thời gian đua hoặc của vòng cũ không cộng vào vòng hiện tại.');return result;}
  const p=this.players.get(String(data.userId)),homeId=this.giftHomes.get(result.key),r=regionById.get(homeId),unit=row.unit,points=giftPoints(unit,result.delta,this.config),name=clean(data.nickname)||p?.name||'Đồng hương',fields={uid:String(data.userId),name,avatar:p?.avatar||'',homeId:r?.id||null,origin:r?.name||'Việt Nam',points,giftName:row.name,count:result.delta};this.lastActivity=this.clock;this.lastLightingAt=this.clock;
  if(unit>=this.config.allMapThreshold){for(const region of this.regions)this.litHomes.add(region.id);this.scene('allMap',fields,12);this.announce('allMap',{name},7);}
  if(!r){this.announce('missingHome',{name},4,8);return result;}
  this.litHomes.add(r.id);this.scores.set(r.id,(this.scores.get(r.id)||0)+points);this.coins.set(r.id,(this.coins.get(r.id)||0)+result.coins);if(p)p.coins+=result.coins;
  this.recordScore(r.id,String(data.userId),points,'gift',{giftId:result.giftId,giftName:row.name,name,avatar:p?.avatar||'',quantity:result.delta,coins:result.coins});
  this.announce('gift',{uid:String(data.userId),homeId:r.id,name,province:r.name,gift:row.name,quantity:result.delta,points,score:this.scores.get(r.id)},8,0,'gift');
  const rule=rules.find(rule=>rule.giftId===result.giftId);
  if(rule?.enabled!==false&&rule){const key=JSON.stringify([fields.uid,result.giftId]),n=(this.thresholds.get(key)||0)+result.delta,units=Math.floor(n/rule.threshold);this.thresholds.set(key,n%rule.threshold);if(units){if(rule.action==='battle')this.startBattle(fields);else{this.scene(rule.action,fields,rule.duration);if(rule.action!=='roses')this.announce(rule.action,{name,province:r.name},5,this.config.mcGap,'giftEffect');}}}
  if(this.config.fireworksThreshold>0&&unit>=this.config.fireworksThreshold&&rule?.action!=='fireworks'&&unit<this.config.allMapThreshold)this.scene('fireworks',fields,8);this.checkLeader();return result;
 }
 startBattle(fields){
  const two=this.ranking().filter(g=>g.points>0).slice(0,2);if(two.length<2){this.announce('battleWait',{name:fields.name},4,5);return false;}
  if(this.battle){this.battle.end=Math.min(this.clock+this.remaining,this.clock+this.config.battleDuration);this.notice('Đại chiến đang diễn ra được gia hạn trong thời gian cuộc đua còn lại.');return true;}
  this.battle={id:++this.sequence,ids:two.map(g=>g.homeId),base:two.map(g=>g.points),start:this.clock,end:this.clock+Math.min(this.remaining,this.config.battleDuration),donor:fields.name};this.scene('battle',{...fields,opponents:two.map(g=>({id:g.homeId,name:g.origin}))},6);this.announce('battleStart',{left:two[0].origin,right:two[1].origin,seconds:Math.ceil(this.battle.end-this.clock)},7);this.revision++;return true;
 }
 battleState(){if(!this.battle)return null;const b=this.battle;return {...b,remaining:Math.max(0,b.end-this.clock),sides:b.ids.map((id,i)=>({id,name:regionById.get(id).name,total:this.scores.get(id)||0,gain:Math.max(0,(this.scores.get(id)||0)-b.base[i])}))};}
 endBattle(){const b=this.battleState();if(!b)return;const best=Math.max(...b.sides.map(s=>s.gain)),winners=b.sides.filter(s=>s.gain===best);if(winners.length===1&&this.config.battleBonus>0)this.scores.set(winners[0].id,(this.scores.get(winners[0].id)||0)+this.config.battleBonus);this.lastBattle={...b,winners:winners.map(s=>s.id)};this.announce(winners.length>1?'battleTie':'battleEnd',{provinces:winners.map(s=>s.name).join(' và '),score:best},7);this.battle=null;this.revision++;}
 finish(reason='time'){
  if(!['RACING','COUNTDOWN','PAUSED'].includes(this.phase))throw Error('Chưa có cuộc đua để kết thúc.');if(this.battle)this.endBattle();const rank=this.ranking(),best=rank[0]?.points||0,winners=best>0?rank.filter(g=>g.points===best):[];
  this.result={roundId:this.roundId,roundNumber:this.roundNumber,reason,winners:structuredClone(winners),ranking:structuredClone(rank),points:best,lit:this.litHomes.size,comments:[...this.comments.values()].reduce((a,b)=>a+b,0)};
  this.litHomes.clear();this.phase='RESULTS';this.remaining=0;this.active=null;this.queue=[];this.restRemaining=null;
  if(!winners.length)this.announce('noWinner',{},9);else{this.announce(winners.length>1?'coWinners':'winner',{province:winners[0].origin,provinces:winners.map(g=>g.origin).join(', '),score:best},9);for(const w of winners){const fields={homeId:w.homeId,origin:w.origin,name:w.origin,points:w.points,automatic:true};this.scene('winnerIntro',fields,this.config.winnerIntroDuration);this.scene('winner',fields,this.config.winnerDuration);}}
  this.runScenes();this.revision++;
 }
 advance(dt){
  if(!Number.isFinite(dt)||dt<0)throw Error('Thời gian không hợp lệ');if(this.phase==='PAUSED')return;this.clock+=dt;
  if(this.phase==='COUNTDOWN'){const before=this.countdownRemaining;this.countdownRemaining=Math.max(0,before-dt);if(this.countdownRemaining<=0){this.phase='RACING';this.lastActivity=this.clock;this.announce('start',{},8);this.revision++;dt=Math.max(0,dt-before);}else{const n=Math.ceil(this.countdownRemaining);if(n<Math.ceil(before)&&n<=3)this.announce('final',{seconds:n},7);dt=0;}}
  if(this.phase==='RACING'){
   if(this.pendingMilestone&&this.clock-(this.spoken.get('milestone')??-99)>=2){this.announce('milestone',{},5);this.pendingMilestone=false;}const before=this.remaining;this.remaining=Math.max(0,before-dt);
   for(const [sec,type]of [[this.config.duration/2,'half'],[60,'lastMinute'],[30,'last30'],[10,'last10'],[5,'final'],[4,'final'],[3,'final'],[2,'final'],[1,'final']]){if(sec>=this.config.duration||this.markers.has(type+sec))continue;if(before>sec&&this.remaining<=sec){this.markers.add(type+sec);const lead=this.ranking()[0];if(lead)this.announce(type,{seconds:sec,province:lead.origin,score:lead.points},type==='final'?8:6);}}
   if(this.battle&&this.clock>=this.battle.end)this.endBattle();if(this.remaining<=0){if(this.active?.action!=='dragon'||this.clock>=this.active.end)this.finish();}else if(this.clock-this.lastActivity>=this.config.mcIdleGap){this.lastActivity=this.clock;const idle=this.announce('idle',{},1);if(idle)idle.auto=true;}
  }
  this.tickAutoLight();this.runScenes();this.tickMC();
  if(this.phase==='RESULTS'&&!this.active&&!this.queue.length){if(this.restRemaining==null)this.restRemaining=this.config.rest;else this.restRemaining=Math.max(0,this.restRemaining-dt);if(this.restRemaining<=0){if(this.config.autoNext){this.phase='FINISHED';this.announce('next',{},6);this.start();}else{this.phase='FINISHED';this.revision++;}}}
 }
 tickAutoLight(){
  if(!this.config.autoLightEnabled||this.phase!=='RACING'||this.remaining<=0||this.clock-this.lastLightingAt<this.config.autoLightGap)return;const dark=this.regions.filter(r=>!this.litHomes.has(r.id));if(!dark.length)return;const index=this.autoLightIndex++,r=dark[index%dark.length],name=demoPeople[index%demoPeople.length],uid='auto-light-'+this.roundId+'-'+index;this.lastLightingAt=this.clock;this.litHomes.add(r.id);this.players.set(uid,{uid,name,avatar:'',homeId:r.id,provinceId:r.id,origin:r.name,coins:0,roundComments:0,synthetic:true});this.announce('autoLight',{name,province:r.name,uid},2);if(this.config.commentZoomEnabled)this.scene('commentZoom',{uid,name,homeId:r.id,origin:r.name,automatic:true},this.config.commentZoomDuration);this.revision++;
 }
 social(event,data){
  if(!this.config.mcSocial||!this.config.mcWelcome&&event==='member')return;const type=({member:'viewerWelcome',follow:'followThanks',share:'shareThanks',like:'likeThanks'})[event],uid=clean(data.userId),name=clean(data.nickname);if(!type||!uid||!name)return;
  const receipt=event+'|'+uid;if(event==='follow'&&this.socialSeen.has(receipt))return;if(this.socialSeen.size>10000)this.socialSeen.clear();const gap=event==='like'?35:20;if(this.spoken.has('social-all')&&this.clock-this.spoken.get('social-all')<gap)return;
  const said=this.announce(type,{name},1,event==='member'?300:120,receipt);if(said){this.socialSeen.add(receipt);this.spoken.set('social-all',this.clock);}return said;
 }
 tickMC(){
  if(!this.config.mcAuto||this.clock-this.lastAutoMC<this.config.mcAutoGap)return;if(['PAUSED','COUNTDOWN','RESULTS'].includes(this.phase))return;this.lastAutoMC=this.clock;const n=this.autoCycle++;
  if(['WAITING','FINISHED'].includes(this.phase)){if(this.config.mcWelcome){const line=this.announce(n%3===2?'hometownFeeling':'roomWelcome',{},1);if(line)line.auto=true;}return;}
  if(this.remaining<15)return;const ranking=this.ranking().filter(g=>g.points>0),dark=this.regions.filter(r=>!this.litHomes.has(r.id));let type,vars={};
  if(!this.litHomes.size)type=n%2?'roomWelcome':'idle';else if(n%5===0)type='progress';else if(this.litHomes.size===this.regions.length&&n%4===1)type='allLit';
  else if(ranking.length>=2&&n%3===1){const pairs=ranking.slice(1).map((g,i)=>({g,target:ranking[i],needed:ranking[i].points-g.points+1})).filter(p=>p.needed<=this.config.mcChaseMax);const p=pairs[n%Math.max(1,pairs.length)];if(p){type='chase';vars={province:p.g.origin,target:p.target.origin,needed:p.needed,homeId:p.g.homeId,targetId:p.target.homeId};}}
  if(!type&&dark.length&&n%4===2){type='unlitInvite';vars={province:dark[n%dark.length].name};}
  if(!type&&ranking.length===1&&n%3===0){type='soloHome';vars={province:ranking[0].origin};}
  if(!type&&ranking.length&&n%5===3){const g=ranking.at(-1);type='underdog';vars={province:g.origin,score:g.points};}
  if(!type&&ranking.length&&n%5===4){const g=ranking[n%ranking.length];type=g.count>1?'homeCrowd':'rankingUpdate';vars={province:g.origin,count:g.count,score:g.points};}
  if(!type)type=n%3===0?'giftKindness':'hometownFeeling';const said=this.announce(type,vars,type==='chase'?3:2);if(said){said.auto=true;said.expiresAt=this.clock+Math.min(24,this.config.mcAutoGap+4);}
 }
 skip(){this.active=null;this.runScenes();}
 snapshot(){const groups=this.ranking();return {schema:2,sessionId:this.sessionId,roundId:this.roundId,roundNumber:this.roundNumber,phase:this.phase,clock:this.clock,remaining:this.remaining,countdownRemaining:this.countdownRemaining,config:this.config,nextConfig:this.nextConfig,players:[...this.players.values()].slice(-1000),total:[...this.players.values()].filter(p=>p.roundComments>0).length,roster:this.players.size,groups,homes:groups,litHomes:[...this.litHomes],top:groups.filter(g=>g.points>0).slice(0,5),active:this.active,queue:this.queue,battle:this.battleState(),lastBattle:this.lastBattle,result:this.result,restRemaining:this.restRemaining,notices:this.notices,announcements:this.announcements,scoreEvents:this.scoreEvents,giftFeed:this.ledger.feed.map(r=>({...r,homeId:this.giftHomes.get(r.key)||null}))};}
 export(){return {schema:2,config:this.config,sessionId:this.sessionId,roundId:this.roundId,roundNumber:this.roundNumber,phase:this.phase,resumePhase:this.resumePhase,clock:this.clock,remaining:this.remaining,countdownRemaining:this.countdownRemaining,players:[...this.players.values()],scores:[...this.scores],comments:[...this.comments],coins:[...this.coins],litHomes:[...this.litHomes],lineCounts:[...this.lineCounts],lastLightingAt:this.lastLightingAt,autoLightIndex:this.autoLightIndex,champions:[...this.champions],contributions:[...this.contributions],ledger:this.ledger.export(),giftHomes:[...this.giftHomes].slice(-10000),seen:[...this.seen].slice(-20000),result:this.result};}
}
export {ProvinceRace as Hometown};

