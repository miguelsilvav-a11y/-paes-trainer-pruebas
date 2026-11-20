(()=>{'use strict';
const CURRENT='2.6.1', KEY='paes-last-version-check', INTERVAL=12*60*60*1000;
const button=document.getElementById('paes-check-update'), status=document.getElementById('paes-update-status');
let busy=false, available=null;
function say(message){if(status)status.textContent=message;}
async function refresh(){if(!('serviceWorker' in navigator))return;try{const reg=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});}catch(e){}}
async function check(manual=false){if(busy)return; if(!manual){let last=0;try{last=Number(localStorage.getItem(KEY)||0)}catch(e){}if(Date.now()-last<INTERVAL)return;}
 busy=true;try{if(manual)say('Buscando actualización…');const res=await fetch('./version.json',{cache:'no-store'});if(!res.ok)throw Error('version');const data=await res.json();if(!data.version)throw Error('version');try{localStorage.setItem(KEY,String(Date.now()))}catch(e){}
 if(String(data.version).localeCompare(CURRENT,undefined,{numeric:true})>0){available=data.version;say('Nueva versión '+available+' disponible. Guarda tu progreso antes de actualizar.');if(button)button.textContent='Actualizar a V'+available;}
 else{available=null;if(manual)say('Ya tienes la versión '+CURRENT+'.');if(button)button.textContent='↻ Buscar actualización';}
 }catch(e){if(manual)say('No se pudo comprobar. Revisa tu conexión.')}finally{busy=false;}}
button?.addEventListener('click',async()=>{if(available){button.disabled=true;await refresh();await new Promise(resolve=>setTimeout(resolve,600));location.reload();}else await check(true)});
window.addEventListener('pageshow',()=>check(false));
// Registration is not a network-heavy forced update; browser checks its lifecycle.
check(false);
})();
