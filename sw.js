const BUILD_ID='__BUILD__';
const CACHE='informatik-'+BUILD_ID;
const APP_SHELL=['./','./index.html','./css/style.css','./css/pro.css','./js/app.js','./js/pro.js','./manifest.json','./icon.svg'];
const STATIC_PATHS=new Set(APP_SHELL.map(path=>new URL(path,self.location).pathname));
const SKILL_ASSETS=new Set([
  './assets/skills/numpy.svg','./assets/skills/pandas.svg','./assets/skills/matplotlib.svg',
  './assets/skills/docker.svg','./assets/skills/github.svg','./assets/skills/scikitlearn.svg',
  './assets/skills/powerbi.svg'
].map(path=>new URL(path,self.location).pathname));

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  const isNavigation=event.request.mode==='navigate';
  const isStatic=STATIC_PATHS.has(url.pathname)||SKILL_ASSETS.has(url.pathname);
  if(!isNavigation&&!isStatic)return;

  event.respondWith(
    fetch(event.request).then(response=>{
      if(isStatic&&response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html')))
  );
});