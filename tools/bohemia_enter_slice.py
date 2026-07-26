#!/usr/bin/env python3
"""
BOHEMIA ENTER SLICE (7/18/26) — the SEAMLESS ZOOM, playable.

The world model can address valley -> plot -> building -> room. This proves it
does something for the PLAYER: spawn outside a building, walk to the door, step
INSIDE, and the interior is the exact floorplan world().plot().building()
.floorplan() returns. Walk back out the door and you are on the plot again.
Everything is read live from engine/bohemia_world.js — no baked data.

  python3 tools/bohemia_enter_slice.py   -> slices/BOHEMIA_ENTER_SLICE_7_18_26.html

Self-contained: concatenates the five engine modules + a compact walk loop. Pure
mechanism (semantic colors); art bakes later. ONE-ALPHA safe (a slice file).
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_ENTER_SLICE_7_18_26.html'
MODULES = ['engine/bohemia_overmap.js', 'engine/bohemia_overmap_bridge.js',
           'engine/bohemia_blockgen.js', 'engine/bohemia_floorplan.js',
           'engine/bohemia_world.js']

engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, open(m, encoding='utf8').read()) for m in MODULES)

GAME = r"""
// ===== ENTER SLICE walk loop (world-model driven) =====
var SEED=12345, CX=55, CY=30;                 // the convention plot (bigbox)
var W = BohemiaWorld.world(SEED);
var plot = W.plot(CX,CY);
var bldg = plot.building(0);
var fp   = bldg.floorplan();
var ext  = plot.block;                        // exterior grid {W,H,grid}
// entrance cell on the plot = front-center of the building footprint (south edge)
var ENT = { x: Math.min(ext.W-1, bldg.x + (bldg.w>>1)), y: Math.min(ext.H-1, bldg.y + bldg.h - 1) };
// the floorplan's perimeter entrance door
var IDOOR = fp.doors.filter(function(d){return d[0]===0||d[1]===0||d[0]===fp.W-1||d[1]===fp.H-1;})[0] || [fp.W>>1, fp.H-1];

var EXT_BLOCK = {lot_ground:'#c4b28c',parking_concrete:'#96969c',building_pad:'#56504a',turf:'#789456',
  plaza:'#a8a096',drive_concrete:'#8c8c92',gravel_yard:'#968e78',equipment_pad:'#6e6e74',path:'#b0966e',
  water:'#4a748c',rock:'#786c56'};
var INT_ROLE = {atrium:'#b9b4a0',gallery:'#aaa596',service:'#8c877d',bath:'#6ea0af',shopfloor:'#beaa78',
  checkout:'#be9678',stockroom:'#968c78',office:'#8ca0af',lobby:'#b4af96',meeting:'#a096af',
  breakroom:'#aaa078',hall:'#b9af91',reception:'#b4a582',records:'#96917d',ward:'#96aaaf','null':'#96917d'};

function passExt(x,y){ if(x<0||y<0||x>=ext.W||y>=ext.H)return false;
  var c=ext.grid[y][x]; if(x===ENT.x&&y===ENT.y)return true;   // the door
  if(c.g==='building_pad')return false;
  if(c.props&&c.props.some(function(p){return p.impassable;}))return false;
  return true; }
function passInt(x,y){ if(x<0||y<0||x>=fp.W||y>=fp.H)return false;
  var c=fp.grid[y][x]; return c.g==='floor'||c.g==='door'; }

var mode='ext', px=ENT.x, py=Math.min(ext.H-1, ENT.y+3);   // spawn in the parking
var cv=document.getElementById('cv'), cx2=cv.getContext('2d');
var HUD=document.getElementById('hud');
function grid(){ return mode==='ext'?ext:fp; }
function cell(x,y){ return grid().grid[y][x]; }

function draw(){
  var g=grid(), CELL=Math.floor(Math.min(cv.width/22, cv.height/22));
  var camx=px, camy=py, halfW=Math.floor(cv.width/CELL/2), halfH=Math.floor(cv.height/CELL/2);
  cx2.fillStyle='#14140f'; cx2.fillRect(0,0,cv.width,cv.height);
  for(var sy=-halfH;sy<=halfH;sy++)for(var sx=-halfW;sx<=halfW;sx++){
    var gx=camx+sx, gy=camy+sy; if(gx<0||gy<0||gx>=g.W||gy>=g.H)continue;
    var c=g.grid[gy][gx], col;
    if(mode==='ext'){ col=EXT_BLOCK[c.g]||'#c4b28c';
      if(c.props&&c.props.some(function(p){return p.p==='tree';}))col='#286428';
      if(c.props&&c.props.some(function(p){return p.p==='tank';}))col='#5a7890';
      if(c.props&&c.props.some(function(p){return p.p==='fence';}))col='#463c32'; }
    else { col = c.g==='wall'?'#302c2a' : c.g==='door'?'#f0cd78' : (INT_ROLE[c.role]||'#96917d'); }
    var X=(sx+halfW)*CELL, Y=(sy+halfH)*CELL;
    cx2.fillStyle=col; cx2.fillRect(X,Y,CELL-1,CELL-1);
    if(mode==='ext'&&gx===ENT.x&&gy===ENT.y){ cx2.fillStyle='#f0cd78'; cx2.fillRect(X,Y,CELL-1,CELL-1);
      cx2.fillStyle='#14140f'; cx2.font=Math.floor(CELL*0.7)+'px monospace'; cx2.fillText('▲',X+CELL*0.2,Y+CELL*0.75); }
  }
  // player
  var pxs=(0+halfW)*CELL, pys=(0+halfH)*CELL;
  cx2.fillStyle='#ff5a3c'; cx2.beginPath(); cx2.arc(pxs+CELL/2,pys+CELL/2,CELL*0.38,0,7); cx2.fill();
  cx2.strokeStyle='#14140f'; cx2.lineWidth=2; cx2.stroke();
}
function refreshHUD(){
  if(mode==='ext') HUD.innerHTML='OUTSIDE the '+plot.district+' plot ('+plot.archetype+'). Walk to the ▲ door and step on it.';
  else HUD.innerHTML='INSIDE — '+bldg.zone+' interior, '+fp.rooms.length+' rooms. This IS world().plot().building().floorplan(). Walk out the ▲ door.';
}
function move(dx,dy){
  var nx=px+dx, ny=py+dy;
  if(mode==='ext'){
    if(!passExt(nx,ny))return;
    px=nx; py=ny;
    if(px===ENT.x&&py===ENT.y){ mode='int'; px=IDOOR[0]; py=Math.max(0,Math.min(fp.H-1,IDOOR[1]-1)); if(!passInt(px,py)){px=IDOOR[0];py=IDOOR[1];} refreshHUD(); }
  } else {
    // exiting: stepping onto/through the perimeter door leaves the building
    if(nx===IDOOR[0]&&ny===IDOOR[1]){ mode='ext'; px=ENT.x; py=Math.min(ext.H-1,ENT.y+1); refreshHUD(); draw(); return; }
    if(!passInt(nx,ny))return;
    px=nx; py=ny;
  }
  draw();
}
document.addEventListener('keydown',function(e){
  var k=e.key;
  if(k==='ArrowUp'||k==='w')move(0,-1);
  else if(k==='ArrowDown'||k==='s')move(0,1);
  else if(k==='ArrowLeft'||k==='a')move(-1,0);
  else if(k==='ArrowRight'||k==='d')move(1,0);
  else return; e.preventDefault();
});
['u','d','l','r'].forEach(function(id){var b=document.getElementById('b'+id);
  if(b)b.addEventListener('click',function(){move(id==='l'?-1:id==='r'?1:0, id==='u'?-1:id==='d'?1:0);});});
function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight; draw(); }
window.addEventListener('resize',fit); refreshHUD(); fit();
window.__ENTER_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.3 -apple-system,sans-serif;color:#c9b98a;margin:8px 10px">BOHEMIA — ENTER SLICE: the world model, walkable. Walk to a building, step through the door, you are inside the exact rooms world().plot().building().floorplan() generated. Walk out and you are back on the plot.</h1>
<div id="hud" style="font:13px -apple-system,sans-serif;color:#a99;padding:2px 10px 6px"></div>
<div style="padding:0 10px"><canvas id="cv" style="width:100%;height:62vh;background:#14140f;border-radius:8px;display:block"></canvas></div>
<div style="display:flex;justify-content:center;gap:8px;margin-top:10px;user-select:none">
  <button id="bl" style="width:64px;height:56px;font-size:22px">◀</button>
  <div style="display:flex;flex-direction:column;gap:8px">
    <button id="bu" style="width:64px;height:56px;font-size:22px">▲</button>
    <button id="bd" style="width:64px;height:56px;font-size:22px">▼</button>
  </div>
  <button id="br" style="width:64px;height:56px;font-size:22px">▶</button>
</div>
<script>
__ENGINE__
</script>
<script>
__GAME__
</script>
"""
HTML = HTML.replace('__ENGINE__', engine).replace('__GAME__', GAME)

open(OUT, 'w', encoding='utf8').write(HTML)
print('enter slice -> %s (%d KB)' % (OUT, len(HTML) // 1024))
