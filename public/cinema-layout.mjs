export function createCinemaLayout(film,stage){
 const cinema=document.getElementById('cinema');
 const reset=()=>{stage.classList.remove('portrait-film');cinema.style.removeProperty('--film-ratio');};
 function update(){if(!film.videoWidth||!film.videoHeight)return;const ratio=film.videoWidth/film.videoHeight;stage.classList.toggle('portrait-film',ratio<.9);cinema.style.setProperty('--film-ratio',String(ratio));}
 film.addEventListener('loadedmetadata',update);film.addEventListener('resize',update);film.addEventListener('emptied',reset);
 return reset;
}
