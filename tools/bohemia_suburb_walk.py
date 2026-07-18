#!/usr/bin/env python3
"""
BOHEMIA SUBURB WALK (7/18/26) — the APPROVED block, IMPLEMENTED and walkable.

Paolo APPROVED "THE BLOCK — packed grid" (7/18 verdict). This graduates that exact
generator (engine/bohemia_suburb.js) into the playable alpha: you spawn at the gate,
walk the streets of the dead neighborhood, and step into ANY house to stand inside
its generated rooms (engine/bohemia_floorplan.js). No mockup — the same module the
judge showed, now the world you walk.

  python3 tools/bohemia_suburb_walk.py -> slices/BOHEMIA_SUBURB_WALK_7_18_26.html

Self-contained (suburb + floorplan modules + walk loop, one script scope). Dead
world: no vegetation, dead-dirt ground. ONE-ALPHA safe (a slice file).
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_SUBURB_WALK_7_18_26.html'
MODULES = ['engine/bohemia_suburb.js', 'engine/bohemia_floorplan.js']
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, open(m, encoding='utf8').read()) for m in MODULES)

GAME = r"""
// ===== SUBURB WALK — the approved block, walkable + enterable =====
var SEED=7;
var res = BohemiaSuburb.generate(SEED,'ring',1,1);
var W=res.W, H=res.H, G=res.g;
var feet = BohemiaSuburb.homeFootprints(res);
// each house gets a front DOOR: a house-body cell touching its driveway (fallback road/ground)
var doorOf={}, spawn=null;
function pref(x,y,want){var nb=[[0,1],[0,-1],[1,0],[-1,0]];
  for(var k=0;k<4;k++){var ax=x+nb[k][0],ay=y+nb[k][1];
    if(ax>=0&&ay>=0&&ax<W&&ay<H&&G[ay][ax]===want)return true;}return false;}
feet.forEach(function(f,i){
  var pick=null;
  for(var pass=0;pass<3&&!pick;pass++){var want=[3,1,0][pass];
    for(var y=f.y;y<f.y+f.h&&!pick;y++)for(var x=f.x;x<f.x+f.w;x++){
      if(G[y][x]===2&&pref(x,y,want)){pick=[x,y];break;}}}
  if(pick)doorOf[pick[0]+','+pick[1]]=i;
});
// spawn on the gate's inner road
for(var y=0;y<H&&!spawn;y++)for(var x=0;x<W;x++){ if(G[y][x]===5){
  var cands=[[x,y-1],[x,y+1],[x-1,y],[x+1,y]];
  for(var c=0;c<4;c++){var sx=cands[c][0],sy=cands[c][1];
    if(sx>=0&&sy>=0&&sx<W&&sy<H&&(G[sy][sx]===1||G[sy][sx]===3)){spawn=[sx,sy];break;}}
  if(spawn)break;}}
if(!spawn){ for(var yy=H-2;yy>0&&!spawn;yy--)for(var xx=0;xx<W;xx++)if(G[yy][xx]===1){spawn=[xx,yy];break;} }

// ---- dead-world palette (matches the approved judge look) ----
function gcol(x,y){var h=((x*73856093)^(y*19349663))>>>0,v=h%3;return ['#463f30','#3d382a','#4e4838'][v];}
var EXTCOL={1:'#3a3a44',2:'#9c8e76',3:'#5a5a62',4:'#6a5c44',5:'#c79a3f',6:'#6d5f4b'};
var INT_ROLE={bed:'#9a94ac',bath:'#6ea0af',kitchen:'#beaa78',living:'#b4af96',dining:'#aaa078',
  hall:'#b9af91',closet:'#8c877d',garage:'#6d5f4b',entry:'#b4a582','null':'#96917d'};

var mode='ext', px=spawn?spawn[0]:(W>>1), py=spawn?spawn[1]:(H-4);
var fp=null, fpDoor=null, backAt=null, curHouse=-1;
var cv=document.getElementById('cv'), ctx=cv.getContext('2d');
var HUD=document.getElementById('hud');

function passExt(x,y){ if(x<0||y<0||x>=W||y>=H)return false;
  if(doorOf[x+','+y]!=null)return true; var c=G[y][x]; return c===0||c===1||c===3||c===5; }
function passInt(x,y){ if(!fp||x<0||y<0||x>=fp.W||y>=fp.H)return false;
  var c=fp.grid[y][x]; return c.g==='floor'||c.g==='door'; }

function enter(i){ curHouse=i; var f=feet[i];
  fp=BOH_FLOORPLAN.generate((SEED^((i+1)*0x9E3779B1))>>>0, f.w, f.h, {zone:'residential',entrance:'S'});
  fpDoor=fp.doors.filter(function(d){return d[0]===0||d[1]===0||d[0]===fp.W-1||d[1]===fp.H-1;})[0]||[fp.W>>1,fp.H-1];
  mode='int'; px=fpDoor[0]; py=Math.max(0,Math.min(fp.H-1,fpDoor[1]-1)); if(!passInt(px,py)){px=fpDoor[0];py=fpDoor[1];}
  refreshHUD(); }

function draw(){
  var gw=mode==='ext'?W:fp.W, gh=mode==='ext'?H:fp.H;
  var CELL=Math.max(6,Math.floor(Math.min(cv.width/28, cv.height/28)));
  var halfW=Math.floor(cv.width/CELL/2), halfH=Math.floor(cv.height/CELL/2);
  ctx.fillStyle='#12140f'; ctx.fillRect(0,0,cv.width,cv.height);
  for(var sy=-halfH;sy<=halfH;sy++)for(var sx=-halfW;sx<=halfW;sx++){
    var gx=px+sx, gy=py+sy; if(gx<0||gy<0||gx>=gw||gy>=gh)continue;
    var col;
    if(mode==='ext'){ var c=G[gy][gx]; col=(c===0)?gcol(gx,gy):(EXTCOL[c]||'#463f30');
      if(doorOf[gx+','+gy]!=null)col='#f0cd78'; }
    else { var ic=fp.grid[gy][gx]; col= ic.g==='wall'?'#2c2824' : ic.g==='door'?'#f0cd78' : (INT_ROLE[ic.role]||'#96917d'); }
    var X=(sx+halfW)*CELL, Y=(sy+halfH)*CELL;
    ctx.fillStyle=col; ctx.fillRect(X,Y,CELL-1,CELL-1);
  }
  var pxs=halfW*CELL, pys=halfH*CELL;
  ctx.fillStyle='#ff5a3c'; ctx.beginPath(); ctx.arc(pxs+CELL/2,pys+CELL/2,CELL*0.38,0,7); ctx.fill();
  ctx.strokeStyle='#12140f'; ctx.lineWidth=2; ctx.stroke();
}
function refreshHUD(){
  if(mode==='ext') HUD.innerHTML='OUTSIDE — Campana Dr, the dead block. '+feet.length+' homes. Walk the streets (yellow = a front door; step on it to go inside).';
  else HUD.innerHTML='INSIDE house #'+(curHouse+1)+' — '+fp.rooms.length+' rooms, generated live. Walk out the ▲ door to the street.';
}
function move(dx,dy){ var nx=px+dx, ny=py+dy;
  if(mode==='ext'){
    if(doorOf[nx+','+ny]!=null){ backAt=[px,py]; enter(doorOf[nx+','+ny]); draw(); return; }
    if(!passExt(nx,ny))return; px=nx; py=ny;
  } else {
    if(nx===fpDoor[0]&&ny===fpDoor[1]){ mode='ext'; if(backAt){px=backAt[0];py=backAt[1];} refreshHUD(); draw(); return; }
    if(!passInt(nx,ny))return; px=nx; py=ny;
  }
  draw();
}
document.addEventListener('keydown',function(e){var k=e.key;
  if(k==='ArrowUp'||k==='w')move(0,-1); else if(k==='ArrowDown'||k==='s')move(0,1);
  else if(k==='ArrowLeft'||k==='a')move(-1,0); else if(k==='ArrowRight'||k==='d')move(1,0);
  else return; e.preventDefault();});
['u','d','l','r'].forEach(function(id){var b=document.getElementById('b'+id);
  if(b)b.addEventListener('click',function(){move(id==='l'?-1:id==='r'?1:0, id==='u'?-1:id==='d'?1:0);});});
function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight; draw(); }
window.addEventListener('resize',fit); refreshHUD(); fit();
window.__SUBWALK_READY=true;
"""

HTML = """<h1 style="font:600 15px/1.3 -apple-system,sans-serif;color:#c9b98a;margin:8px 10px">BOHEMIA — WALK CAMPANA: the block you approved, now the world. You spawn at the gate. Walk the dead streets between the houses. Every yellow tile is a front door — step on it and you are standing inside that house's rooms. Walk out the door and you are back on the street. Same generator the judge showed, now walkable.</h1>
<div id="hud" style="font:13px -apple-system,sans-serif;color:#a99;padding:2px 10px 6px"></div>
<div style="padding:0 10px"><canvas id="cv" style="width:100%;height:60vh;background:#12140f;border-radius:8px;display:block"></canvas></div>
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
__GAME__
</script>
"""
HTML = HTML.replace('__ENGINE__', engine).replace('__GAME__', GAME)
open(OUT, 'w', encoding='utf8').write(HTML)
print('suburb walk -> %s (%d KB)' % (OUT, len(HTML) // 1024))
