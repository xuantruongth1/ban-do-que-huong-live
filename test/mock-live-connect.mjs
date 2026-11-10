// Used only by the isolated child process in connect-auto-browser.mjs.
import{loadLiveConnector}from'../core/direct-live.mjs';
const{TikTokLiveConnection}=await loadLiveConnector();
TikTokLiveConnection.prototype.connect=async function(){await new Promise(r=>setTimeout(r,150));if(process.env.QA_CONNECT_OFFLINE==='1')throw Object.assign(Error('User is offline'),{name:'UserOfflineError'});return{roomId:'qa-room'};};
TikTokLiveConnection.prototype.disconnect=async function(){};
