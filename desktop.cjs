const{app,BrowserWindow,Menu,shell,dialog}=require('electron'),fs=require('node:fs'),path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process');
const product='Bản Đồ Quê Hương · Mai Trường LIVE';let main,live,service,origin='',quitting=false;
if(process.env.HOMETOWN_DESKTOP_PROFILE)app.setPath('userData',path.resolve(process.env.HOMETOWN_DESKTOP_PROFILE));
function external(url){try{const u=new URL(url);if(['https:','http:'].includes(u.protocol))void shell.openExternal(url);}catch{}}
function createWindow(isLive=false){const window=new BrowserWindow({width:isLive?570:1550,height:isLive?1020:1000,minWidth:isLive?360:900,minHeight:640,show:false,title:product,icon:path.join(__dirname,'public/assets/app-icon.png'),webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,backgroundThrottling:!isLive}});
 window.webContents.setWindowOpenHandler(({url})=>{try{const u=new URL(url);if(u.origin===origin&&u.pathname==='/overlay.html')openLive();else external(url);}catch{}return{action:'deny'};});window.webContents.on('will-navigate',(e,url)=>{try{if(new URL(url).origin!==origin){e.preventDefault();external(url);}}catch{e.preventDefault();}});window.once('ready-to-show',()=>{if(!process.env.HOMETOWN_DESKTOP_HIDDEN)window.show();});return window;}
function openLive(){if(live&&!live.isDestroyed()){live.show();live.focus();return;}live=createWindow(true);live.on('closed',()=>live=null);void live.loadURL(origin+'/overlay.html');}
async function freePort(){for(let n=3195;n<3250;n++){const free=await new Promise(resolve=>{const s=net.createServer();s.once('error',()=>resolve(false));s.listen(n,'127.0.0.1',()=>s.close(()=>resolve(true)));});if(free)return n;}throw Error('Không có cổng trống cho tool.');}
if(!app.requestSingleInstanceLock())app.quit();else{
 app.on('second-instance',()=>{main?.show();main?.focus();});
 app.whenReady().then(async()=>{
  const root=app.getAppPath(),resources=app.isPackaged?process.resourcesPath:path.resolve(__dirname,'..','desktop-resources'),data=path.join(app.getPath('userData'),'data');fs.mkdirSync(data,{recursive:true});
  const port=await freePort();origin='http://127.0.0.1:'+port;const log=fs.openSync(path.join(app.getPath('userData'),'server.log'),'a');
  service=spawn(path.join(resources,'runtime/node.exe'),[path.join(root,'run.mjs')],{cwd:root,windowsHide:true,env:{...process.env,HOMETOWN_PORT:String(port),HOMETOWN_DATA:data,HOMETOWN_CONTENT_DIR:path.join(resources,'content'),HOMETOWN_RESOURCES_DIR:path.join(resources,'voice')},stdio:['ignore',log,log,'ipc']});fs.closeSync(log);
  service.on('error',e=>{if(!quitting)dialog.showErrorBox(product,e.message);});service.on('exit',code=>{if(!quitting&&code)dialog.showErrorBox(product,'Máy chủ đã dừng. Xem server.log trong thư mục dữ liệu.');});
  let ready=false;for(let i=0;i<160;i++){try{if((await fetch(origin+'/api/state',{signal:AbortSignal.timeout(2000)})).ok){ready=true;break}}catch{}if(service.exitCode!==null)break;await new Promise(r=>setTimeout(r,150));}if(!ready)throw Error('Chưa khởi động được tool. Xem server.log trong '+app.getPath('userData'));
  main=createWindow();main.on('closed',()=>{main=null;app.quit();});await main.loadURL(origin+'/');
  Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'Quê Hương LIVE',submenu:[{label:'Mở màn LIVE',click:openLive},{label:'Hướng dẫn sử dụng',click:()=>external(origin+'/huong-dan.html')},{label:'Thư mục dữ liệu',click:()=>shell.openPath(app.getPath('userData'))},{type:'separator'},{label:'Thoát',role:'quit'}]},{label:'Hiển thị',submenu:[{role:'reload',label:'Tải lại trang'},{role:'resetZoom',label:'Cỡ hiển thị mặc định'},{role:'zoomIn',label:'Phóng to'},{role:'zoomOut',label:'Thu nhỏ'},{role:'togglefullscreen',label:'Toàn màn hình'},{role:'toggleDevTools',label:'Công cụ phát triển'}]}]));
  fs.writeFileSync(path.join(app.getPath('userData'),'runtime.json'),JSON.stringify({url:origin,version:app.getVersion(),pid:process.pid,serverPid:service.pid,packaged:app.isPackaged,data}));
  if(process.env.HOMETOWN_DESKTOP_SMOKE_REPORT)fs.writeFileSync(process.env.HOMETOWN_DESKTOP_SMOKE_REPORT,JSON.stringify({url:origin,version:app.getVersion(),packaged:app.isPackaged,data}));
 }).catch(e=>{dialog.showErrorBox(product,e.message);app.quit();});
 app.on('window-all-closed',()=>app.quit());
 app.on('before-quit',e=>{if(quitting||!service||service.exitCode!==null)return;e.preventDefault();quitting=true;const fallback=setTimeout(()=>{try{service.kill();}catch{}app.exit(0);},8000);service.once('exit',()=>{clearTimeout(fallback);app.exit(0);});try{service.send({type:'hometown-shutdown'});}catch{service.kill();}});
}
