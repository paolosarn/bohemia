/* BOHEMIA ALWAYS-FRESH SERVICE WORKER (Paolo 7/18/26, ONE-LINK LAW).
   The problem it kills: GitHub Pages' CDN + the phone browser cache the alpha's
   HTML, so tapping the ONE canonical link could serve a STALE build -- which is
   why cache-buster query strings (?v=arms) got bolted on, breaking the "one URL
   forever" law. This worker ends that for good.

   Strategy: NETWORK-FIRST for every page navigation in /slices/. The worker
   re-fetches the document straight from the network, bypassing the HTTP cache
   (cache:'no-store'), so the link ALWAYS renders the latest deploy. It falls
   back to the last-served copy only if the network is unreachable (offline).
   No query strings, no version files, no per-ship step -- the URL stays pristine.

   Scope: registered from /slices/, so it covers the alpha AND every slice under
   it. One worker, the whole live surface always fresh. */
const FALLBACK='bohemia-fallback-v2';   /* v2 bump (7/18): forces phones holding an old worker to re-install the network-first one, so the newest deploy is served without a manual hard refresh */
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(self.clients.claim()));
/* __ONE_DEPLOY__ (COMBAT [the fight is broken live], 10/26, a marked block in the pipe; NOTE on PLUMBER's and RUN's boards).
   Paolo 10/26: 'the auto combat started tweaking out on me and not working during combat... then I was trying to fight manually
   and it was tweaking on that too.' MEASURED: the page came fresh from here, but its code and data (the fight's rules in
   records/target/bb/ours.json, the engine's .js) came out of the phone's own cache, which GitHub Pages lets keep a copy ten minutes
   (max-age=600). Five deploys landed in the twenty minutes before he played, so a NEW page ran on an OLD rules file and the fight
   froze on a row the old file did not have (records/BOHEMIA_COMBAT_THE_FIGHT_IS_BROKEN_LIVE_10_26_26.md). So every same-origin
   script, data file, stylesheet and page fetched BY a page asks the server whether it changed (a 304 when it did not: one round
   trip, the copy kept); offline, the copy the phone holds. Pictures and sound pass straight through, as before. */
const ONE_DEPLOY=/\.(js|mjs|json|css|html?|txt|webmanifest)$/i;
self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.mode==='navigate'||req.method!=='GET'||req.headers.has('range')) return;
  let u; try{ u=new URL(req.url); }catch(_){ return; }
  if(u.origin!==self.location.origin||!ONE_DEPLOY.test(u.pathname)) return;
  e.respondWith(fetch(req,{cache:'no-cache'}).catch(()=>fetch(req,{cache:'force-cache'})));
});
self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.mode!=='navigate') return;                 /* only the top-level docs; assets pass straight through */
  e.respondWith((async()=>{
    try{
      const fresh=await fetch(req,{cache:'no-store'});   /* bypass the HTTP cache -> newest deploy, every time */
      try{const c=await caches.open(FALLBACK); c.put(req, fresh.clone());}catch(_){}
      return fresh;
    }catch(_){                                          /* offline: hand back the last copy we saw */
      const cached=await caches.match(req);
      return cached || Response.error();
    }
  })());
});
