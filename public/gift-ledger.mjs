export class GiftLedger {
 constructor(saved={}){this.rows=new Map(Array.isArray(saved.rows)?saved.rows.slice(-10000):[]);this.remainders=new Map(Array.isArray(saved.remainders)?saved.remainders:[]);this.feed=Array.isArray(saved.feed)?saved.feed.slice(0,50):[];}
 receive(data,now=Date.now()){
  const uid=String(data.userId||data.user?.userId||''),giftId=String(data.giftId||''),id=String(data.groupId||data.streakId||data.msgId||'');
  if(!uid||!giftId)return {accepted:false,reason:'Thiếu UID hoặc ID quà'};
  const qty=Math.max(1,Math.min(100000,Math.floor(Number(data.repeatCount)||1))),unit=Math.max(0,Math.min(1000000,Math.floor(Number(data.diamondCount)||0)));
  if(!id||id==='0'){this.feed.unshift({uid,giftId,name:String(data.giftName||giftId).slice(0,80),quantity:qty,status:'unverified',at:now});this.feed.length=Math.min(50,this.feed.length);return {accepted:false,reason:'Quà thiếu mã sự kiện: chưa áp dụng, cần đối soát',unverified:true};}
  const key=JSON.stringify([uid,giftId,id]),previous=this.rows.get(key)||{quantity:0,applied:0};
  const combo=Number(data.giftType)===1||data.repeatEnd===false,terminal=!combo||[true,1,'1','true'].includes(data.repeatEnd);
  const quantity=Math.max(previous.quantity,qty),delta=terminal?Math.max(0,quantity-previous.applied):0;
  const row={uid,giftId,name:String(data.giftName||giftId).slice(0,80),quantity,applied:previous.applied+delta,unit,status:terminal?'settled':'pending',at:now,key,roundKey:previous.roundKey||data.roundKey||'',manual:Boolean(previous.manual||data.manual)};
  if(previous.status==='settled'&&!terminal)row.status='settled';this.rows.set(key,row);
  if(this.rows.size>10000){const evict=[...this.rows].find(([,r])=>r.status==='settled');if(evict)this.rows.delete(evict[0]);}
  this.feed=[row,...this.feed.filter(r=>r.key!==key)].slice(0,50);return {accepted:delta>0,delta,coins:delta*unit,uid,giftId,key,roundKey:row.roundKey,pending:row.status==='pending'};
 }
 units(uid,giftId,quantity,threshold){const key=JSON.stringify([uid,giftId]),total=(this.remainders.get(key)||0)+quantity;this.remainders.set(key,total%threshold);return Math.floor(total/threshold);}
 export(){return {rows:[...this.rows],remainders:[...this.remainders],feed:this.feed};}
}
