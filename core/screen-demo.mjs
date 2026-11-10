import {demoPeople} from '../public/demo-people.mjs';
import{ProvinceRace}from'../public/race-engine.mjs';import{regionsFor,raceEffects}from'../public/regions.mjs';import{demoTimeline}from'../public/demo-show.mjs';
export class ScreenDemo{
 constructor(settings,catalog){this.settings=structuredClone(settings);this.catalog=catalog;this.elapsed=0;this.cursor=0;this.history=[];this.label='Bắt đầu demo';this.done=false;this.settings.raceConfig={...this.settings.raceConfig,duration:150,countdown:0,autoLightEnabled:false,winnerIntroDuration:12,winnerDuration:18,rest:0,autoNext:false};this.settings.rules=raceEffects.map(e=>({action:e.id,giftId:e.defaultGiftId,threshold:1,duration:e.duration,enabled:true}));this.game=new ProvinceRace({},this.settings.raceConfig);this.regions=regionsFor(this.game.config.mapMode);this.game.start();const th=this.home('Thanh Hóa');if(!this.settings.videos[th.id])this.settings.videos[th.id]={id:'demo-home',demo:true,demoUrl:'/assets/demo-home.mp4'};this.advance(0);}
 home(name){return this.regions.find(r=>r.name===name)||this.regions[0];}
 comment(uid,name,home){this.game.comment({userId:uid,nickname:name,comment:this.home(home).name,msgId:crypto.randomUUID()});}
 gift(type){const rule=this.settings.rules.find(r=>r.action===type),g=this.catalog.find(g=>g.tiktokGiftId===rule.giftId);this.game.skip();this.game.gift({userId:'screen-mai',nickname:'Nguyễn Minh Anh',giftId:g.tiktokGiftId,giftName:g.name,diamondCount:g.coins??0,repeatCount:1,msgId:crypto.randomUUID()},this.settings.rules);}
 run(type){const g=this.game;
  if(type==='welcome')g.announce('roomWelcome',{},8);
  if(type==='comment')this.comment('screen-mai','Nguyễn Minh Anh','Thanh Hóa');
  if(type==='crowd'){this.comment('screen-lan','Trần Ngọc Lan','Thanh Hóa');this.comment('screen-an','Lê Đức An','Nghệ An');this.comment('screen-hai','Phạm Quang Hải','Hà Nội');for(let i=4;i<demoPeople.length;i++)this.comment('screen-person-'+i,demoPeople[i],['Thanh Hóa','Nghệ An','Hà Nội','Đà Nẵng','Cần Thơ','Hà Tĩnh','Quảng Ninh','Đồng Nai'][i%8]);}
  if(raceEffects.some(e=>e.id===type))this.gift(type);
  if(type==='allMap'){const icon=this.catalog.find(x=>x.coins>=g.config.allMapThreshold);g.skip();g.gift({userId:'screen-mai',nickname:'Nguyễn Minh Anh',giftId:icon.tiktokGiftId,giftName:icon.name,diamondCount:icon.coins,repeatCount:1,msgId:crypto.randomUUID()},this.settings.rules);}
  if(type==='king'){g.skip();g.gift({userId:'screen-lan',nickname:'Trần Ngọc Lan',giftId:'5655',giftName:'Hoa hồng',diamondCount:1,repeatCount:300,msgId:crypto.randomUUID()},[]);}
  if(type==='chase'){for(let i=0;i<4;i++)this.comment('screen-an','Lê Đức An','Nghệ An');g.announce('progress',{},6);}
  if(type==='finish'&&g.phase==='RACING'){g.remaining=0;g.finish('demo');}
  if(type==='video')while(g.active&&g.active.action!=='winner')g.skip();
  if(type==='done')this.done=true;this.history.push(type);
 }
 advance(dt){const target=Math.min(180,this.elapsed+dt);while(this.cursor<demoTimeline.length&&demoTimeline[this.cursor][0]<=target){const[at,label,type]=demoTimeline[this.cursor++];this.game.advance(Math.max(0,at-this.elapsed));this.elapsed=at;this.label=label;this.run(type);}this.game.advance(Math.max(0,target-this.elapsed));this.elapsed=target;}
 snapshot(){return{running:!this.done,elapsed:this.elapsed,duration:180,label:this.label,history:[...this.history]};}
}
