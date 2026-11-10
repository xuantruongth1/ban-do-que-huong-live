// Called once for a successfully connected client, never for each incoming chat.
export function runConnectedRace(game){
 game.config.autoNext=true;game.nextConfig.autoNext=true;
 if(['WAITING','FINISHED'].includes(game.phase)){game.start();return true;}
 if(game.phase==='PAUSED'){game.pause();return true;}
 return false;
}
