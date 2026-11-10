import fs from'node:fs';import path from'node:path';
export function initialize(root,{data=process.env.HOMETOWN_DATA||path.join(root,'data'),content=process.env.HOMETOWN_CONTENT_DIR||path.join(root,'content')}={}){
 fs.mkdirSync(path.join(data,'videos'),{recursive:true});const seed=JSON.parse(fs.readFileSync(path.join(root,'seed/race-settings.json'),'utf8'));
 if(!fs.existsSync(path.join(data,'race-settings.json')))fs.copyFileSync(path.join(root,'seed/race-settings.json'),path.join(data,'race-settings.json'));
 for(const clip of seed.videoLibrary){const source=path.join(content,'videos',clip.id),dest=path.join(data,'videos',clip.id);if(fs.existsSync(dest))continue;if(!fs.existsSync(source)||fs.statSync(source).size!==clip.size)throw Error('Chưa có đủ clip. Mở START.bat hoặc chạy npm run setup trước.');try{fs.linkSync(source,dest);}catch{fs.copyFileSync(source,dest);}}
 process.env.HOMETOWN_APP_ROOT=root;process.env.HOMETOWN_DATA=data;process.env.HOMETOWN_RESOURCES_DIR||=path.join(root,'resources');return data;
}
