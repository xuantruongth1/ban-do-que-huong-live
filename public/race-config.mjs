import {conversationScenes} from './mc-conversation.mjs';
import {engagingScenes} from './mc-engaging.mjs';
import {anonymousNarration} from './mc-narration.mjs';
import {lightPalette} from './map-colors.mjs';
import {mcScenes,extraExisting} from './mc-library.mjs';
export const defaultTemplates={manual:['{text}'],
 waiting:['Đồng hương khắp mọi miền ơi! Bình luận tên tỉnh để chọn quê, cuộc đua sắp bắt đầu rồi!'],
 countdown:['Cả nhà sẵn sàng nhé! Cuộc đua quê hương bắt đầu sau {seconds} giây.'],
 start:['Cuộc đua số {round} chính thức bắt đầu! Chúng ta có {minutes} phút. Bình luận tên tỉnh để thắp sáng quê mình nào!','Cổng quê hương đã mở! {minutes} phút để cùng nhau đưa quê mình lên ngôi. Đồng hương ơi, điểm danh thôi!'],
 firstLight:['{name} vừa thắp sáng {province}! Một điểm sáng mới trên bản đồ, đồng hương {province} vào tiếp sức nào!','Ánh đèn đầu tiên của {province} đã lên! Cảm ơn {name}, quê mình chính thức vào cuộc!'],
 comment:['{name} tiếp thêm {points} điểm cho {province}! Quê mình đang có {score} điểm rồi cả nhà ơi!','Lại thêm một lời gọi quê từ {name}! {province} nhận {points} điểm, đồng hương cùng giữ nhịp nhé!'],
 milestone:['Đã có {lit} trên {total} tỉnh bừng sáng! Những quê còn tối ơi, chỉ cần bình luận tên tỉnh là vào cuộc ngay!','Bản đồ đã sáng {lit} tỉnh rồi! Mỗi lời điểm danh là một ánh đèn quê hương.'],
 leader:['{province} vừa vươn lên dẫn đầu với {score} điểm! Các quê phía sau còn rất nhiều cơ hội bứt phá!','Đổi ngôi rồi cả nhà ơi! {province} đang dẫn đầu với {score} điểm. Đồng hương đâu, giữ nhịp nào!'],
 tieLead:['{provinces} đang đồng điểm dẫn đầu! Cuộc đua quê hương đang rất sít sao, thêm một lời điểm danh cũng có thể tạo khác biệt!'],
 gift:['Cảm ơn {name} tặng {gift} nhân {quantity}! {province} nhận thêm {points} điểm, hiện có {score} điểm!'],
 roses:['Mưa hoa hồng từ {name} đang gửi về {province}! Cả nhà cùng đón một cơn mưa yêu thương nhé!'],
 hearts:['{name} gửi những trái tim bay khắp bản đồ! Tình cảm này dành cho {province} và tất cả đồng hương trong phòng!'],
 orbit:['Mời cả nhà cùng camera ghé quanh {province}! Cảm ơn {name} đã mở chuyến bay ngắm quê hương.'],
 fireworks:['Pháo hoa đang bừng lên trên cả bản đồ! Cảm ơn {name}, cùng chúc quê hương một mùa sum vầy!'],
 dragon:['Rồng vàng đã xuất hiện! Cảm ơn {name} đã mang lời chúc may mắn từ {province} bay khắp quê hương Việt Nam!'],
 allMap:['Cả bản đồ đã bừng sáng nhờ món quà của {name}! Tất cả {total} tỉnh cùng chung một ánh đèn quê hương!'],
 missingHome:['Cảm ơn {name} tặng quà! Bạn bình luận tên tỉnh để chọn quê trước, quà sau sẽ được cộng đúng cho quê mình nhé!'],
 battleStart:['Đại chiến bắt đầu! {left} gặp {right}, thời gian {seconds} giây! Điểm kiếm thêm trong đại chiến sẽ quyết định, đồng hương hai bên vào tiếp sức nào!'],
 battleWait:['Cảm ơn {name} mở đại chiến! Cần ít nhất hai quê có điểm để giao đấu, cả nhà bình luận tên tỉnh vào cuộc nhé!'],
 battleEnd:['Đại chiến khép lại! {provinces} chiến thắng với {score} điểm tăng thêm. Chúc mừng đồng hương!'],
 battleTie:['Hai quê {provinces} hòa nhau trong đại chiến! Một màn tiếp sức rất đẹp, cuộc đua chính vẫn tiếp tục!'],
 half:['Nửa chặng đường đã qua! {province} đang có {score} điểm. Các quê còn lại vẫn kịp tạo bất ngờ!'],
 lastMinute:['Chỉ còn một phút! {province} đang dẫn với {score} điểm. Đồng hương bình luận tên tỉnh để tiếp sức, những điểm cuối rất quan trọng!'],
 last30:['Còn ba mươi giây! Cuộc đua đang vào đoạn quyết định, quê mình cố lên nào!'],
 last10:['Mười giây cuối! Cùng đếm ngược và tiếp sức cho quê hương!'],
 final:['{seconds}!'],
 paused:['Cuộc đua tạm dừng, điểm và thời gian được giữ nguyên. Cả nhà chờ hiệu lệnh tiếp theo nhé!'],
 resumed:['Cuộc đua tiếp tục! Đồng hương giữ lửa cho quê mình nào!'],
 idle:['Đồng hương nào chưa chọn quê, bình luận tên tỉnh của mình nhé! Mỗi bình luận hợp lệ đều có điểm.','Cả nhà ơi, quê mình đang ở đâu trên bản đồ? Gõ tên tỉnh để ánh đèn quê hương sáng lên nào!'],
 intro:['{intro} Đồng hương {province} cùng tiếp sức cho quê mình nhé!'],
 winner:['Hết giờ! Chúc mừng {province} chiến thắng với {score} điểm! Cả phòng cùng theo chân đồng hương trở về quê hương nào!'],
 coWinners:['Hết giờ! {provinces} đồng hạng nhất với {score} điểm! Chúng ta sẽ lần lượt ghé thăm từng quê chiến thắng.'],
 noWinner:['Cuộc đua đã khép lại nhưng chưa có quê nào nhận điểm. Vòng sau, bình luận tên tỉnh để thắp sáng quê mình nhé!'],
 winnerVisit:['Mời cả nhà về thăm {province}, quê hương thắng cuộc! {intro}'],
 noClip:['{province} đã thắng cuộc! Chủ LIVE sẽ thêm clip quê sau; lúc này cả nhà cùng ngắm quê mình trên bản đồ và gửi lời chúc mừng nhé!'],
 next:['Một cuộc đua mới đang được chuẩn bị. Các tỉnh sẽ tắt đèn để cùng thắp sáng lại từ đầu, đồng hương sẵn sàng nhé!'],
 unknown:['Bạn nhập đầy đủ tên một tỉnh hoặc thành phố để chọn quê nhé! Có thể gõ không dấu.']
};
defaultTemplates.giftQuick=['Cảm ơn {name}, quê {province} đã gửi quà!'];
defaultTemplates.autoLight=['Đèn tự động vừa thắp sáng {province}. Đồng hương bình luận tên tỉnh để tham gia và góp điểm cho quê mình nhé!'];
defaultTemplates.hometownVisit=['Cảm ơn {name} đã gửi hoa hồng, mời cả nhà về thăm {province}. {intro}', 'Bông hồng của {name} đưa chúng ta về {province}. {intro}', 'Mình cùng khám phá quê hương {province} qua bông hồng của {name} nhé. {intro}'];
const legacyTemplates=structuredClone(defaultTemplates);for(const [key,lines]of Object.entries(extraExisting))defaultTemplates[key]=[...(defaultTemplates[key]||[]),...lines];for(const [key,scene]of Object.entries(mcScenes))defaultTemplates[key]=scene.lines;
for(const [key,lines]of Object.entries(defaultTemplates))defaultTemplates[key]=lines.map(anonymousNarration);
const previousTemplates=structuredClone(defaultTemplates);Object.assign(defaultTemplates,engagingScenes);
const v3Templates=structuredClone(defaultTemplates);Object.assign(defaultTemplates,conversationScenes);
export const defaultRaceConfig={mapMode:'63',autoLightEnabled:true,autoLightGap:30,giftTierEffects:true,giftSparkEnabled:true,showCrowns:true,showScorePopups:true,commentZoomEnabled:true,commentZoomDuration:3,colorCount:6,multiColor:true,palette:[...lightPalette],litColor:'#ffd000',unlitColor:'#153a4e',mapBackground:'#041b32',colorCycleSeconds:0,glowStrength:1.4,sfxEnabled:true,sfxVolume:.2,giftToastEnabled:true,fireworksThreshold:0,backgroundPreset:'ocean',backgroundOpacity:1,backgroundBlur:0,liveSafeBottom:380,mcLibraryVersion:4,mcAuto:true,mcFastGift:true,mcContinuous:true,mcPrecache:true,mcWelcome:true,mcSocial:true,mcAutoGap:22,mcChaseMax:100,duration:300,countdown:5,autoNext:true,rest:8,winnerDuration:24,winnerIntroDuration:12,commentPoints:1,commentCooldown:0,battleDuration:20,battleBonus:0,allMapThreshold:1500,tiers:[{min:1,max:4,points:3},{min:5,max:29,points:30},{min:30,max:99,points:100},{min:100,max:499,points:500},{min:500,max:1499,points:1500},{min:1500,max:null,points:3000}],effectIntensity:1,cameraZoom:1,labelScale:1,showLabels:true,mcGap:3,mcCommentGap:10,mcIdleGap:25,mcQueueLimit:16,templates:defaultTemplates,regionSettings:{}};
export function validateRaceConfig(input={}){
 const c={...structuredClone(defaultRaceConfig),...input};if(!['63','34'].includes(c.mapMode))throw Error('Bản đồ chỉ hỗ trợ 63 hoặc 34 tỉnh/thành');
 for(const [k,min,max]of [['duration',30,3600],['autoLightGap',10,600],['countdown',0,20],['commentZoomDuration',1,8],['rest',0,120],['winnerDuration',8,180],['winnerIntroDuration',6,45],['commentPoints',0,1000],['commentCooldown',0,30],['battleDuration',5,120],['battleBonus',0,100000],['allMapThreshold',1,1000000],['effectIntensity',.1,3],['cameraZoom',.5,3],['labelScale',.6,2],['colorCycleSeconds',0,3600],['glowStrength',1,3],['sfxVolume',0,1],['fireworksThreshold',0,1000000],['backgroundOpacity',.1,1],['backgroundBlur',0,20],['liveSafeBottom',300,700],['mcAutoGap',10,180],['mcChaseMax',1,100000],['mcGap',0,30],['mcCommentGap',0,120],['mcIdleGap',5,300],['mcQueueLimit',1,50]]){if(typeof c[k]!=='number'||!Number.isFinite(c[k])||c[k]<min||c[k]>max)throw Error('Cấu hình '+k+' ngoài khoảng '+min+'–'+max);}
 if(!Number.isInteger(c.colorCount)||c.colorCount<4||c.colorCount>12)throw Error('Số màu phải từ 4 đến 12');for(const k of ['litColor','unlitColor','mapBackground'])if(!/^#[0-9a-f]{6}$/i.test(c[k]))throw Error('Mã màu không hợp lệ');if(!Array.isArray(c.palette)||c.palette.length!==12||c.palette.some(x=>!/^#[0-9a-f]{6}$/i.test(x))||new Set(c.palette.slice(0,c.colorCount).map(x=>x.toLowerCase())).size!==c.colorCount)throw Error('Bảng màu phải có 12 mã màu; các màu đang dùng không được trùng nhau');if(!['tet','ocean','aurora','lotus','galaxy','dawn','royal','redgold','lantern','sunset','plain','custom'].includes(c.backgroundPreset))throw Error('Mẫu nền không hợp lệ');for(const k of ['autoLightEnabled','giftTierEffects','giftSparkEnabled','multiColor','sfxEnabled','giftToastEnabled','showCrowns','showScorePopups','commentZoomEnabled'])c[k]=Boolean(c[k]);c.mcPrecache=Boolean(c.mcPrecache);c.mcAuto=Boolean(c.mcAuto);c.mcFastGift=Boolean(c.mcFastGift);c.mcContinuous=Boolean(c.mcContinuous);c.mcWelcome=Boolean(c.mcWelcome);c.mcSocial=Boolean(c.mcSocial);c.autoNext=Boolean(c.autoNext);c.showLabels=Boolean(c.showLabels);
 if(!Array.isArray(c.tiers)||!c.tiers.length||c.tiers.length>12)throw Error('Bảng điểm quà không hợp lệ');let last=0;
 c.tiers=c.tiers.map((t,i)=>{if(!Number.isInteger(t.min)||t.min!==last+1||!Number.isInteger(t.points)||t.points<0||t.points>1000000)throw Error('Các khoảng xu phải liên tục, không trùng; điểm là số nguyên không âm');if(t.max==null){if(i!==c.tiers.length-1)throw Error('Khoảng không giới hạn phải ở cuối');last=Infinity;}else{if(!Number.isInteger(t.max)||t.max<t.min)throw Error('Khoảng xu sai');last=t.max;}return {min:t.min,max:t.max??null,points:t.points};});if(last!==Infinity)throw Error('Khoảng xu cuối phải không giới hạn');
 const templates={...defaultTemplates};for(const [key,lines]of Object.entries(c.templates||{})){if(!Object.hasOwn(defaultTemplates,key))continue;if(!Array.isArray(lines)||!lines.length||lines.length>12||lines.some(s=>typeof s!=='string'||!s.trim()||s.length>500))throw Error('Mẫu thoại '+key+' không hợp lệ');templates[key]=input.mcLibraryVersion!==2&&JSON.stringify(lines)===JSON.stringify(legacyTemplates[key])?defaultTemplates[key]:lines;}for(const [key,lines]of Object.entries(templates)){if(input.mcLibraryVersion!==3&&JSON.stringify(lines.map(anonymousNarration))===JSON.stringify(previousTemplates[key]))templates[key]=defaultTemplates[key];}
 for(const [key,lines]of Object.entries(templates)){if(input.mcLibraryVersion!==4&&JSON.stringify(lines)===JSON.stringify(v3Templates[key]))templates[key]=defaultTemplates[key];}
 c.templates=Object.fromEntries(Object.entries(templates).map(([key,lines])=>[key,lines.map(anonymousNarration)]));c.mcLibraryVersion=4;
 if(!c.regionSettings||typeof c.regionSettings!=='object'||Array.isArray(c.regionSettings))throw Error('Giới thiệu tỉnh không hợp lệ');for(const r of Object.values(c.regionSettings)){if(r.intro!=null&&(typeof r.intro!=='string'||r.intro.length>500))throw Error('Giới thiệu tỉnh tối đa 500 ký tự');if(r.aliases!=null&&(!Array.isArray(r.aliases)||r.aliases.length>15||r.aliases.some(a=>typeof a!=='string'||a.length>80)))throw Error('Tên gọi thêm không hợp lệ');}
 return c;
}
export function giftPoints(unit,quantity,c){return (c.tiers.find(t=>unit>=t.min&&(t.max==null||unit<=t.max))?.points||0)*quantity;}
