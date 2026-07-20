#!/usr/bin/env python3
"""
BOHEMIA CITY TAB (7/19/26, LIFE+CITY-SURFACE session) - the blessed aerial
map, LIVE in the alpha's CITY tab.

Paolo (7/19): "we made the whole streets, we haven't implemented that yet."
This implements them: the CITY tab (empty since birth) now renders the whole
generated Vegas from above - the mile grid of arterials, the 215 beltway +
I-15/95, rail, Lake Mead, the mountain ring - with Paolo's rule applied
verbatim from the blessed proof (tools/bohemia_city_map.py): only the
SKELETON draws as itself; every buildable district is DESERT until grown on.

Read-only consumption of the overworld session's generator (ONE SYSTEM ONE
SESSION: they own engine/bohemia_overmap.js; this page only renders it).
city_tab_gate.js freshness-locks the embedded module to the canon body, so
when the overworld session reshapes streets this page goes red until rebuilt.

Interactions: drag to pan, pinch or wheel to zoom (clamped), tap a cell for
its district + category readout. Deterministic grain (hash, no random).

  python3 tools/bohemia_city_tab.py
    -> slices/BOHEMIA_CITY_CURRENT.html   (the stable URL the CITY tab loads)
"""
import hashlib
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_CITY_CURRENT.html'
ENGINE = 'engine/bohemia_overmap.js'

body = open(ENGINE, encoding='utf8').read()
md5 = hashlib.md5(body.encode('utf8')).hexdigest()

# the blessed categories (tools/bohemia_city_map.py, Paolo-approved proof)
GAME = r"""
// ===== CITY TAB - the valley from above, skeleton as itself, plots as desert =====
var SEED=12345;
var WATER={water:1,reservoir:1,reservoirs:1,basin:1,dam:1,intake:1,watertreat:1,springs:1,lakeLV:1,mead:1,reclaim:1};
var ROAD={arterial:1}, FREEWAY={freeway:1,interchange:1,exits:1};
var RAILT={rail:1,railyard:1,monorail:1}, MOUNT={mountain:1,quarry:1,gypsum:1,boulder:1};
var OPEN={desert:1,wash:1,boneyard:1,landfill:1};
var COL={sand:[196,166,120],road:[78,76,78],freeway:[46,45,50],rail:[66,56,46],
  water:[64,92,96],mount:[150,120,84],open:[186,158,116]};
function cat(d){ if(WATER[d])return 'water'; if(ROAD[d])return 'road';
  if(FREEWAY[d])return 'freeway'; if(RAILT[d])return 'rail';
  if(MOUNT[d])return 'mount'; if(OPEN[d])return 'open'; return 'sand'; }
function hsh(x,y){ var h=((x*73856093)^(y*19349663))>>>0; h=(h^(h>>>13))>>>0; return (h*2654435761)>>>0; }

var m=BohemiaOvermap.buildOvermap(SEED);
var N=m.n, GRID=[];
for(var y=0;y<N;y++){ var r=[]; for(var x=0;x<N;x++) r.push(m.at(x,y).district); GRID.push(r); }

var cv=document.getElementById('cv'), ctx=cv.getContext('2d');
var HUD=document.getElementById('hud');
var px=N/2, py=N/2, Z=6;                 // camera center (cells) + px per cell
var ZMIN=3, ZMAX=40;
var sel=null;

function draw(){
  var w=cv.width, h=cv.height;
  ctx.fillStyle='#171512'; ctx.fillRect(0,0,w,h);
  var x0=Math.max(0,Math.floor(px-w/Z/2)), x1=Math.min(N-1,Math.ceil(px+w/Z/2));
  var y0=Math.max(0,Math.floor(py-h/Z/2)), y1=Math.min(N-1,Math.ceil(py+h/Z/2));
  for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++){
    var c=COL[cat(GRID[y][x])];
    var g=(hsh(x,y)%17)-8;               // the proof's gentle within-category grain
    ctx.fillStyle='rgb('+Math.max(0,Math.min(255,c[0]+g))+','+Math.max(0,Math.min(255,c[1]+g))+','+Math.max(0,Math.min(255,c[2]+g))+')';
    ctx.fillRect(Math.round((x-px)*Z+w/2), Math.round((y-py)*Z+h/2), Math.ceil(Z), Math.ceil(Z));
  }
  if(sel){
    ctx.strokeStyle='#f0cd78'; ctx.lineWidth=2;
    ctx.strokeRect(Math.round((sel[0]-px)*Z+w/2), Math.round((sel[1]-py)*Z+h/2), Math.ceil(Z), Math.ceil(Z));
  }
}
function refreshHUD(){
  if(sel){ var d=GRID[sel[1]][sel[0]], k=cat(d);
    HUD.textContent='('+sel[0]+','+sel[1]+') '+d.toUpperCase()+' - '+(k==='sand'?'buildable plot (desert until grown on)':'skeleton: '+k); }
  else HUD.textContent='The valley. Streets, freeway, rail, water, mountains draw as themselves; every buildable plot is desert until the city grows on it. Drag to pan, pinch or wheel to zoom, tap a plot.';
}
// ---- input: drag pan, wheel + pinch zoom (clamped), tap select ----
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
function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight;
  if(!fit.done){ Z=Math.max(ZMIN,Math.min(cv.width,cv.height)/N); fit.done=true; }
  draw(); }
window.addEventListener('resize',fit);
refreshHUD(); fit();
window.__CITY_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.35 -apple-system,sans-serif;color:#c9b98a;margin:8px 10px">BOHEMIA - THE CITY: your generated Vegas from above, live. The mile grid, the 215 beltway, I-15 and US-95, rail, Lake Mead, the mountain ring. Only the skeleton draws as itself; everything buildable is desert until the city grows on it.</h1>
<div id="hud" style="font:12px -apple-system,sans-serif;color:#a99;padding:2px 10px 8px"></div>
<div style="display:flex;gap:8px;padding:0 10px 8px">
  <button id="fit" style="padding:8px 12px;border-radius:8px">⌂ WHOLE VALLEY</button>
</div>
<div style="padding:0 10px 12px"><canvas id="cv" style="width:100%;height:74vh;background:#171512;border-radius:8px;display:block;touch-action:none"></canvas></div>
<!-- engine-md5:__MD5__ (city_tab_gate freshness-locks this to engine/bohemia_overmap.js) -->
<script>
__ENGINE__
__GAME__
</script>
"""
HTML = HTML.replace('__ENGINE__', '/* ==== %s ==== */\n%s' % (ENGINE, body))
HTML = HTML.replace('__GAME__', GAME).replace('__MD5__', md5)
open(OUT, 'w', encoding='utf8').write(HTML)
print('city tab -> %s (%d KB, engine md5 %s)' % (OUT, len(HTML) // 1024, md5[:8]))
