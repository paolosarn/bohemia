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
const FALLBACK='bohemia-fallback-v1';
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(self.clients.claim()));
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
