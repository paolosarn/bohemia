#!/usr/bin/env python3
"""
BOHEMIA CITY TAB (7/19/26, LIFE+CITY-SURFACE session) - the blessed aerial
map LIVE in the alpha's CITY tab, now with the city-builder VERBS.

v1 (7/19): the whole generated Vegas rendered live - skeleton as itself,
buildables as desert (the blessed proof's rules), pan/zoom/tap.
v2 (7/19, Paolo's 7/18 plan implemented): DEMOLISH a buildable plot down to
the desert underneath; BUILD a canon district onto empty desert. The verbs
live in engine/bohemia_cityedit.js (one canonical body, own gate); the
skeleton - streets/freeway/rail/water/mountains - is SACRED and untouchable.
Edits are a delta over the generator, persisted device-local (localStorage,
like the clothing thumbs) until the save system exists; RESET restores the
generated valley.

Read-only consumption of the overworld session's generator. city_tab_gate.js
byte-locks BOTH embedded modules to their canon bodies.

  python3 tools/bohemia_city_tab.py
    -> slices/BOHEMIA_CITY_CURRENT.html   (the stable URL the CITY tab loads)
"""
import hashlib
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_CITY_CURRENT.html'
MODULES = ['engine/bohemia_overmap.js', 'engine/bohemia_cityedit.js']
bodies = {m: open(m, encoding='utf8').read() for m in MODULES}
md5s = {m: hashlib.md5(bodies[m].encode('utf8')).hexdigest() for m in MODULES}
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, bodies[m]) for m in MODULES)

GAME = r"""
// ===== CITY TAB v2 - the valley from above + the city-builder verbs =====
var SEED=12345;
var CE=BohemiaCityEdit;
var COL={sand:[196,166,120],road:[78,76,78],freeway:[46,45,50],rail:[66,56,46],
  water:[64,92,96],mount:[150,120,84],open:[186,158,116]};
function hsh(x,y){ var h=((x*73856093)^(y*19349663))>>>0; h=(h^(h>>>13))>>>0; return (h*2654435761)>>>0; }

var m=BohemiaOvermap.buildOvermap(SEED);
var N=m.n, GRID=[];
for(var y=0;y<N;y++){ var r=[]; for(var x=0;x<N;x++) r.push(m.at(x,y).district); GRID.push(r); }
var BUILDABLE=CE.buildableTypes(BohemiaOvermap.DISTRICT);

// device-local delta until the save system (RESET restores the generator)
var LSKEY='BOHEMIA_CITY_EDITS';
var edits=CE.parse((function(){try{return localStorage.getItem(LSKEY)||'';}catch(e){return '';}})());
function persist(){ try{ localStorage.setItem(LSKEY, CE.serialize(edits)); }catch(e){} }
function distAt(x,y){ return CE.resolve(edits,x,y,GRID[y][x]); }

var cv=document.getElementById('cv'), ctx=cv.getContext('2d');
var HUD=document.getElementById('hud'), ACT=document.getElementById('actions');
var px=N/2, py=N/2, Z=6, ZMIN=3, ZMAX=40;
var sel=null;

function draw(){
  var w=cv.width, h=cv.height;
  ctx.fillStyle='#171512'; ctx.fillRect(0,0,w,h);
  var x0=Math.max(0,Math.floor(px-w/Z/2)), x1=Math.min(N-1,Math.ceil(px+w/Z/2));
  var y0=Math.max(0,Math.floor(py-h/Z/2)), y1=Math.min(N-1,Math.ceil(py+h/Z/2));
  for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++){
    var c=COL[CE.cat(distAt(x,y))];
    var g=(hsh(x,y)%17)-8;
    ctx.fillStyle='rgb('+Math.max(0,Math.min(255,c[0]+g))+','+Math.max(0,Math.min(255,c[1]+g))+','+Math.max(0,Math.min(255,c[2]+g))+')';
    ctx.fillRect(Math.round((x-px)*Z+w/2), Math.round((y-py)*Z+h/2), Math.ceil(Z), Math.ceil(Z));
  }
  if(sel){
    ctx.strokeStyle='#f0cd78'; ctx.lineWidth=2;
    ctx.strokeRect(Math.round((sel[0]-px)*Z+w/2), Math.round((sel[1]-py)*Z+h/2), Math.ceil(Z), Math.ceil(Z));
  }
}
function refreshHUD(){
  var n=CE.count(edits);
  var tail=n?(' · '+n+' edit'+(n>1?'s':'')+' on this device'):'';
  if(sel){ var d=distAt(sel[0],sel[1]), k=CE.cat(d);
    HUD.textContent='('+sel[0]+','+sel[1]+') '+d.toUpperCase()+' - '+(k==='sand'?'buildable plot':(d==='desert'?'empty desert (buildable land)':'skeleton: '+k))+tail;
    ACT.innerHTML='';
    if(CE.isSkeleton(d)){ ACT.innerHTML='<span style="font:11px sans-serif;color:#8f8770">the skeleton is sacred - streets, water, rail and mountains cannot be touched</span>'; }
    else if(d!=='desert'){
      var b=document.createElement('button'); b.textContent='✕ DEMOLISH TO DESERT';
      b.style.cssText='padding:8px 12px;border-radius:8px;background:#8c3f3f;color:#fff;border:0';
      b.onclick=function(){ var r=CE.demolish(edits,sel[0],sel[1],d);
        if(r.ok){ persist(); refreshHUD(); draw(); } };
      ACT.appendChild(b);
    } else {
      var s=document.createElement('select');
      s.style.cssText='padding:8px;border-radius:8px;background:#111;color:#ddd;border:1px solid #555;max-width:46%';
      BUILDABLE.forEach(function(t){ var o=document.createElement('option'); o.value=t; o.textContent=t.toUpperCase(); s.appendChild(o); });
      var b2=document.createElement('button'); b2.textContent='⚒ BUILD';
      b2.style.cssText='padding:8px 12px;border-radius:8px;background:#3f8c3f;color:#fff;border:0;margin-left:6px';
      b2.onclick=function(){ var r=CE.build(edits,sel[0],sel[1],distAt(sel[0],sel[1]),s.value,BohemiaOvermap.DISTRICT);
        if(r.ok){ persist(); refreshHUD(); draw(); } };
      ACT.appendChild(s); ACT.appendChild(b2);
    }
  } else {
    HUD.textContent='The valley. Skeleton draws as itself; every buildable plot is desert until grown on. Tap a plot to demolish it to desert or build on empty desert. Drag to pan, pinch or wheel to zoom.'+tail;
    ACT.innerHTML='';
  }
}
// ---- input ----
var ptrs={}, lastPan=null, lastPinch=null, moved=0;
cv.addEventListener('pointerdown',function(e){ ptrs[e.pointerId]=[e.clientX,e.clientY]; moved=0;
  var ks=Object.keys(ptrs); if(ks.length===1) lastPan=[e.clientX,e.clientY]; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove',function(e){
  if(!(e.pointerId in ptrs)) return;
  ptrs[e.pointerId]=[e.clientX,e.clientY];
  var ks=Object.keys(ptrs);
  if(ks.length===1&&lastPan){ var dx=e.clientX-lastPan[0], dy=e.clientY-lastPan[1];
    moved+=Math.abs(dx)+Math.abs(dy);
    px-=dx/Z; py-=dy/Z; clampCam(); lastPan=[e.clientX,e.clientY]; draw(); }
  else if(ks.length===2){ var a=ptrs[ks[0]], b=ptrs[ks[1]];
    var d=Math.hypot(a[0]-b[0],a[1]-b[1]);
    if(lastPinch){ setZoom(Z*d/lastPinch); draw(); }
    lastPinch=d; moved+=9; }
});
function endPtr(e){ delete ptrs[e.pointerId];
  if(Object.keys(ptrs).length<2) lastPinch=null;
  if(Object.keys(ptrs).length<1) lastPan=null; }
cv.addEventListener('pointerup',function(e){
  if(moved<=8){ var r=cv.getBoundingClientRect();
    var gx=Math.floor(px+(e.clientX-r.left)*(cv.width/r.width)/Z-cv.width/Z/2);
    var gy=Math.floor(py+(e.clientY-r.top)*(cv.height/r.height)/Z-cv.height/Z/2);
    if(gx>=0&&gy>=0&&gx<N&&gy<N){ sel=(sel&&sel[0]===gx&&sel[1]===gy)?null:[gx,gy]; refreshHUD(); draw(); } }
  endPtr(e); });
cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('wheel',function(e){ setZoom(Z*(e.deltaY<0?1.15:0.87)); draw(); e.preventDefault(); },{passive:false});
function setZoom(z){ Z=Math.max(ZMIN,Math.min(ZMAX,z)); clampCam(); }
function clampCam(){ px=Math.max(0,Math.min(N,px)); py=Math.max(0,Math.min(N,py)); }
document.getElementById('fit').onclick=function(){ px=N/2; py=N/2; Z=Math.max(ZMIN,Math.min(cv.width,cv.height)/N); sel=null; refreshHUD(); draw(); };
document.getElementById('reset').onclick=function(){
  if(!CE.count(edits)) return;
  edits=CE.makeEdits(); persist(); refreshHUD(); draw(); };
function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight;
  if(!fit.done){ Z=Math.max(ZMIN,Math.min(cv.width,cv.height)/N); fit.done=true; }
  draw(); }
window.addEventListener('resize',fit);
refreshHUD(); fit();
window.__CITY_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#c9b98a;margin:8px 10px">BOHEMIA - THE CITY: your generated Vegas from above, live. Tap a plot: demolish it down to the desert underneath, or build onto empty desert. The skeleton - streets, freeway, rail, water, mountains - is sacred and cannot be touched. Edits stay on this device until the save system.</h1>
<div id="hud" style="font:12px -apple-system,sans-serif;color:#a99;padding:2px 10px 6px"></div>
<div id="actions" style="padding:0 10px 6px;min-height:40px"></div>
<div style="display:flex;gap:8px;padding:0 10px 8px">
  <button id="fit" style="padding:8px 12px;border-radius:8px">⌂ WHOLE VALLEY</button>
  <button id="reset" style="padding:8px 12px;border-radius:8px">⟲ RESET EDITS</button>
</div>
<div style="padding:0 10px 12px"><canvas id="cv" style="width:100%;height:66vh;background:#171512;border-radius:8px;display:block;touch-action:none"></canvas></div>
__MD5_STAMPS__
<script>
__ENGINE__
__GAME__
</script>
"""
stamps = '\n'.join('<!-- engine-md5:%s:%s -->' % (m, md5s[m]) for m in MODULES)
HTML = HTML.replace('__MD5_STAMPS__', stamps).replace('__ENGINE__', engine).replace('__GAME__', GAME)
open(OUT, 'w', encoding='utf8').write(HTML)
print('city tab v2 -> %s (%d KB)' % (OUT, len(HTML) // 1024))
for m in MODULES:
    print('  %s md5 %s' % (m, md5s[m][:8]))
