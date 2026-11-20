const CACHE='paes-trainer-v2-6-1';
const SHELL=['./','./index.html','./matematica.html','./materias.html','./app.js','./questions.js','./materias.js','./materias.json','./dashboard.js','./backup.js','./updates.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('paes-trainer-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
if(url.pathname.endsWith('/version.json')){event.respondWith(fetch(request,{cache:'no-store'}));return;}
const isPage=request.mode==='navigate';
if(isPage){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{})}return response}).catch(()=>caches.match(request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));return;}
// Cache-first static assets; no unnecessary network fetch on each practice interaction.
event.respondWith(caches.match(request,{ignoreSearch:true}).then(hit=>hit||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{})}return response})));
});
