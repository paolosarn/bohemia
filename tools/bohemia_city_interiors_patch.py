#!/usr/bin/env python3
"""
BOHEMIA STEP-INSIDE PATCH (7/26/26, CITY lane) - INTERIORS EVERYWHERE.

The world model has had a real enterable rung since 7/18 (world().plot()
.building().interior(): rooms, garage decks, crypt vaults) and the district
dossiers have declared, per tile, exactly what you see when you go in ("station
interior: the apparatus floor up front, the day room + dorm + kitchen + offices
behind"). None of it was reachable from the surface Paolo actually taps. In the
alpha's CITY app you could walk up to every one of those buildings and the wall
just stopped you. An interior nobody can walk into is a spec, not a place.

This wires the rung into the ONE iso app (CITY_B64, the alpha's CITY tab):

  WALK INTO THE WALL AND YOU GO IN. No new button, no new mode toggle, no menu.
  In human (walk) mode, stepping into a solid tile whose DOSSIER declares an
  `enter` puts you inside that building instead of blocking you. Walk back out
  through the door you came in and you are on the plot again, facing the street.

HOW IT WORKS (mechanism only, no invented content):
  - THE PLATE IS THE FOOTPRINT (INTERIOR-MATCHES-EXTERIOR LAW, Paolo 7/19,
    LOCKED): the building you walked into is flood-filled in the CONTINUOUS fine
    world (cellAt, the same cells you were just walking on), and the bounding box
    of that solid mass IS the interior floor plate, w x h, exactly. Never
    clamped, never padded, never "fit to a nice size".
  - THE ROOMS are engine/bohemia_floorplan.js, INLINED VERBATIM (ENGINE SYNC
    LAW: one canonical body, never a second drifting copy). Same generator the
    world model, the gates and the enter-slice already read.
  - THE ROOM GRAMMAR per district is the zone table read out of
    bohemia_world.js's DISTGEN at patch time, so the district -> zone mapping
    cannot drift from the engine's. The gate re-derives it and compares.
  - THE DOOR is cut on the side you walked in from, so the interior entrance is
    the exterior entrance. Deterministic per footprint origin: the same building
    is the same rooms every time you come back.
  - WHAT DECLARES A BUILDING ENTERABLE is the district's own recorded dossier
    (legend[code].enter) - never a guess, never a new list. A tile Paolo's canon
    did not declare enterable stays solid.
  - LIGHT = TERRITORY: an interior is dark at night unless its plot is on the
    live power network (POWER.at), the same clustered-power read as the street.

REUSE CHECK: cooks NO graphic pixels. It wires the EXISTING interior generator
(engine/bohemia_floorplan.js, opened and inlined below) into the EXISTING
top-down human renderer, and reads the EXISTING per-district dossiers/legends
already embedded in the app. No banks/ lookup applies - nothing is drawn that
did not already exist. Room floors are flat dead-world tints in the tan/grey/
brown family already used by the surface (zero purple: PURPLE RESERVATION).

Idempotent (marker STEP-INSIDE). interiors_gate.js locks it.

  python3 tools/bohemia_city_interiors_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
FLOORPLAN = 'engine/bohemia_floorplan.js'
WORLD = 'engine/bohemia_world.js'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'STEP-INSIDE' in decoded:
    print('step-inside already wired. no-op.')
    sys.exit(0)

fp_body = open(FLOORPLAN, encoding='utf8').read()      # REUSE: the canon generator, verbatim

# ---- the district -> interior zone table, read from the REAL DISTGEN --------
# ENGINE SYNC LAW: the app never carries its own opinion of what zone a district
# is. It carries a transcription of bohemia_world.js's table, and the gate fails
# if the two ever disagree.
world_src = open(WORLD, encoding='utf8').read()
distgen = world_src[world_src.index('var DISTGEN = {'):]
distgen = distgen[:distgen.index('\n  };')]
ZONES = dict(re.findall(r"^\s*([a-z]+):\s*\{[^\n]*zone:'([a-z]+)'", distgen, re.M))
assert len(ZONES) >= 38, 'DISTGEN parse found only %d districts' % len(ZONES)
ZONE_JS = '{' + ','.join("%s:'%s'" % (k, v) for k, v in sorted(ZONES.items())) + '}'

# ---- 1) cells must carry what their dossier says is inside -------------------
# realizeCell already resolves each fine cell through the district's legend; it
# just threw the `enter` away. Keep it, plus the code, so a step can ask.
K_STRUCT = """    if(tl.layer==='structure'){
      c.s=pal; c.walk=false; c.artPool='hroof'; c.tint=pal;"""
assert decoded.count(K_STRUCT) == 1
decoded = decoded.replace(K_STRUCT, """    if(tl.layer==='structure'){
      c.s=pal; c.walk=false; c.artPool='hroof'; c.tint=pal;
      if(entry&&entry.enter){ c.enter=entry.enter; c.ecode=code; }   /* STEP-INSIDE: the dossier says what is in here */""")

K_PORTAL = "    if(tl.layer==='portal'){ c.g='#8a8a86'; c.walk=true; return c; }"
assert decoded.count(K_PORTAL) == 1
decoded = decoded.replace(K_PORTAL, """    if(tl.layer==='portal'){ c.g='#8a8a86'; c.walk=true;
      if(entry&&entry.enter){ c.enter=entry.enter; c.ecode=code; c.portal=true; }   /* STEP-INSIDE: a door/ramp/open bay you step through */
      return c; }""")

# the canon suburb path decodes raw codes, not a legend - read the enter strings
# straight off BohemiaSuburb.LEGEND (already embedded), never a hand-copy.
S_HOUSE = """    else if(v===2||v===6||v===9){"""
assert decoded.count(S_HOUSE) == 1
decoded = decoded.replace(S_HOUSE, """    else if(v===2||v===6||v===9){
      /* STEP-INSIDE: the suburb dossier's own enter text (house / garage / upper) */
      { const _sl=(typeof BohemiaSuburb!=='undefined'&&BohemiaSuburb.legend)?BohemiaSuburb.legend[v]:null;
        if(_sl&&_sl.enter){ c.enter=_sl.enter; c.ecode=v; } }""")

# ---- 2) the STEP-INSIDE block, appended in the app's own scope ---------------
INJECT = """
/* ==== STEP-INSIDE (7/26, CITY lane): INTERIORS EVERYWHERE. Walk into a
   building whose dossier declares an interior and you GO IN - the floor plate
   is EXACTLY the footprint you saw from outside (INTERIOR-MATCHES-EXTERIOR
   LAW, Paolo 7/19, LOCKED), the rooms are the canon generator inlined below,
   and the door is cut on the side you walked in from. Walk back out through it
   and you are on the plot again. No new button: the wall just lets you in. ==== */
/* ==== %s (inlined verbatim) ==== */
%s

// district -> interior room grammar, transcribed from bohemia_world.js's DISTGEN
// at patch time (ENGINE SYNC LAW: one table, one truth). interiors_gate re-derives.
const IN_ZONE=%s;
const IN_D4=[[1,0],[-1,0],[0,1],[0,-1]];
let INSIDE=null;      // {fp,foot,zone,label,ix,iy,door,exit:{gx,gy}}

// THE FOOTPRINT IS THE PLATE: flood the solid structure mass you walked into,
// in the SAME continuous fine world you were walking on. Its bounding box is the
// interior, w x h, exactly - the law, enforced by construction rather than by
// hoping a generator agreed.
function inFootprint(gx,gy){
  const seen={}, st=[[gx,gy]]; seen[gx+','+gy]=1;
  let x0=gx,y0=gy,x1=gx,y1=gy,n=0;
  while(st.length){
    const p=st.pop(), x=p[0], y=p[1];
    if(++n>60000)return null;                       // a megastructure: not an interior
    if(x<x0)x0=x; if(y<y0)y0=y; if(x>x1)x1=x; if(y>y1)y1=y;
    for(let k=0;k<4;k++){
      const nx=x+IN_D4[k][0], ny=y+IN_D4[k][1], kk=nx+','+ny;
      if(seen[kk])continue;
      // the ENTERABLE mass only: a house floods into its own garage and upper
      // story (all three declare an interior) but never into the block's
      // perimeter wall or a roof-ridge decal, which declare none.
      const c=cellAt(nx,ny); if(!c||c.walk||!c.s||!c.enter)continue;
      seen[kk]=1; st.push([nx,ny]);
    }
  }
  return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};
}
// a portal tile (an open storage bay, a door pad) is walkable, so the mass to
// enter is whatever solid enterable structure it opens onto - else the portal
// run itself IS the space (the looted unit you step into).
function inPortalFootprint(gx,gy){
  for(let k=0;k<4;k++){
    const c=cellAt(gx+IN_D4[k][0],gy+IN_D4[k][1]);
    if(c&&!c.walk&&c.s&&c.enter) return inFootprint(gx+IN_D4[k][0],gy+IN_D4[k][1]);
  }
  const seen={}, st=[[gx,gy]]; seen[gx+','+gy]=1;
  let x0=gx,y0=gy,x1=gx,y1=gy,n=0;
  while(st.length){
    const p=st.pop(), x=p[0], y=p[1];
    if(++n>4096)return null;
    if(x<x0)x0=x; if(y<y0)y0=y; if(x>x1)x1=x; if(y>y1)y1=y;
    for(let k=0;k<4;k++){
      const nx=x+IN_D4[k][0], ny=y+IN_D4[k][1], kk=nx+','+ny;
      if(seen[kk])continue;
      const c=cellAt(nx,ny); if(!c||!c.portal)continue;
      seen[kk]=1; st.push([nx,ny]);
    }
  }
  return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};
}
function inEnter(tgtX,tgtY,fromX,fromY,portal){
  const f=portal?inPortalFootprint(tgtX,tgtY):inFootprint(tgtX,tgtY);
  if(!f)return false;
  // the door goes on the side you walked in from: the interior entrance IS the
  // exterior entrance, which is the whole point of the law.
  const side=(fromY>f.y+f.h-1)?'S':(fromY<f.y)?'N':(fromX<f.x)?'W':(fromX>f.x+f.w-1)?'E':'S';
  const tx=(tgtX/FN)|0, ty=(tgtY/FN)|0, t=om.at(tx,ty);
  const zone=IN_ZONE[t?t.district:'']||'default';
  const seed=(Math.imul(f.x,73856093)^Math.imul(f.y,19349663)^Math.imul(f.w*131+f.h,2654435761))>>>0;
  let fp; try{ fp=BOH_FLOORPLAN.generate(seed,f.w,f.h,{zone:zone,entrance:side}); }catch(e){ return false; }
  const door=fp.doors.filter(function(d){return d[0]===0||d[1]===0||d[0]===fp.W-1||d[1]===fp.H-1;})[0];
  if(!door)return false;
  const c=cellAt(tgtX,tgtY);
  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};
  advance(0.5); return true;
}
function inPassable(x,y){
  const fp=INSIDE.fp; if(x<0||y<0||x>=fp.W||y>=fp.H)return false;
  const c=fp.grid[y][x]; return c.g==='floor'||c.g==='door';
}

// ---- movement: the same 120 BPM step, indoors ----
const _inStepOnce=stepOnce;
stepOnce=function(di){
  if(!INSIDE) return _inStepOnce(di);
  const d=DIRS[di], nx=INSIDE.ix+d[0], ny=INSIDE.iy+d[1];
  const fp=INSIDE.fp;
  if(nx<0||ny<0||nx>=fp.W||ny>=fp.H){
    // stepping off the plate: only the door lets you out, and it puts you back
    // on the exact cell you came in from.
    if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
    }
    return false;
  }
  if(!inPassable(nx,ny))return false;
  INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]); advance(0.084); return true;
};

// ---- render: the same top-down human view, one floor plate ----
const IN_FLOOR={living:'#8d7f68',kitchen:'#8a8378',bed:'#867a66',bath:'#7f8180',
  shopfloor:'#928a78',checkout:'#8d8574',stockroom:'#7d7466',office:'#85806f',
  lobby:'#918a76',meeting:'#847e6d',breakroom:'#8a8272',hall:'#8f8674',
  reception:'#8a8170',records:'#7c7565',ward:'#8a8a80',service:'#767065',
  floor_open:'#847c6c',dock:'#7a7264',atrium:'#948b76',gallery:'#8c8471',
  concourse:'#8a8272',counter:'#8d8574',locker:'#7e7768',restroom:'#7f8180',
  room:'#87806f'};
function renderInside(){
  const fp=INSIDE.fp;
  // A ROOM IS NOT A STREET: the walk zoom frames a whole neighborhood, which
  // leaves a 5x12 apartment as a stamp in a sea of black. Indoors the camera
  // FITS THE PLATE to the phone, so a building reads as a place you are standing
  // in. A plate too big to fit (a mall concourse, a storage row) falls back to
  // following the body at the walk zoom, same as outside.
  let C=Math.min(cv.width*0.88/fp.W, cv.height*0.64/fp.H);
  let ox,oy;
  if(C<HC*0.75){ C=HC; ox=cv.width/2-INSIDE.ix*C; oy=cv.height/2-INSIDE.iy*C; }
  else { C=Math.min(C,140); ox=(cv.width-fp.W*C)/2; oy=(cv.height-fp.H*C)/2; }
  g.fillStyle='#0d0b09'; g.fillRect(0,0,cv.width,cv.height);
  g.imageSmoothingEnabled=false;
  const isWall=(x,y)=>(x<0||y<0||x>=fp.W||y>=fp.H)||fp.grid[y][x].g==='wall';
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C||sx>cv.width||sy>cv.height)continue;
    if(c.g==='wall'){
      g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C);
      // the ¾ read indoors, same convention the surface uses: a lit face on any
      // wall with floor below it, so you read which side you are standing on
      if(!isWall(x,y+1)){ g.fillStyle='#5e5346'; g.fillRect(sx,sy+C-Math.max(1,C*0.26),C,Math.max(1,C*0.26)); }
      if(!isWall(x,y-1)){ g.fillStyle='#39312a'; g.fillRect(sx,sy,C,Math.max(1,C*0.14)); }
    } else if(c.g==='door'){
      g.fillStyle=IN_FLOOR[c.role]||'#87806f'; g.fillRect(sx,sy,C,C);
      g.fillStyle='#a08a5c'; g.fillRect(sx+C*0.06,sy+C*0.06,C*0.88,C*0.88);   // threshold plate
      g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(sx+C*0.06,sy+C*0.06,C*0.88,Math.max(1,C*0.12));
    } else {
      const base=IN_FLOOR[c.role]||'#87806f';
      g.fillStyle=base; g.fillRect(sx,sy,C,C);
      // wear: a dry dead-world grain, no two rooms identical, nothing animated
      const h=((x*73856093)^(y*19349663)^(c.room*2654435761))>>>0;
      if((h&7)===0){ g.fillStyle='rgba(0,0,0,0.09)'; g.fillRect(sx,sy,C,C); }
      else if((h&15)===3){ g.fillStyle='rgba(255,255,255,0.05)'; g.fillRect(sx,sy,C,C); }
      // AMBIENT OCCLUSION against every wall — the one cheap trick that makes a
      // flat plan read as a room with height instead of a coloured rectangle
      g.fillStyle='rgba(0,0,0,0.20)';
      if(isWall(x,y-1))g.fillRect(sx,sy,C,Math.max(1,C*0.16));
      if(isWall(x,y+1))g.fillRect(sx,sy+C-Math.max(1,C*0.12),C,Math.max(1,C*0.12));
      if(isWall(x-1,y))g.fillRect(sx,sy,Math.max(1,C*0.14),C);
      if(isWall(x+1,y))g.fillRect(sx+C-Math.max(1,C*0.14),sy,Math.max(1,C*0.14),C);
    }
  }
  // LIGHT = TERRITORY: dark inside at night unless this plot is on the live network
  if(isNight()&&!(POWER.at(INSIDE.tx,INSIDE.ty)||{}).live){
    g.fillStyle='rgba(8,10,18,0.62)'; g.fillRect(0,0,cv.width,cv.height);
  }
  const px=ox+INSIDE.ix*C, py=oy+INSIDE.iy*C;
  const set=PLAYER_CV&&(PLAYER_CV[HFACE]||PLAYER_CV.S);
  let spr=set&&set.idle;
  if(set&&ANIM){ const frames=set[ANIM.kind];
    if(frames&&frames.length){ const f=Math.min(frames.length-1,((performance.now()-ANIM.t0)/BEAT*frames.length)|0); spr=frames[f]; } }
  if(spr){
    // the same zoom ladder the surface uses, tiered off the INDOOR cell size
    const _lad=C>=64?224:(C>=32?112:(C<17?28:56));
    let img=spr;
    if(C>=64){ if(!spr._hd4){ if(!spr._hd)spr._hd=epx2(spr); spr._hd4=epx2(spr._hd); } img=spr._hd4; }
    else if(C>=32){ if(!spr._hd)spr._hd=epx2(spr); img=spr._hd; }
    else if(C<17){ if(!spr._half)spr._half=half2(spr); img=spr._half; }
    const dw=Math.max(C*1.7,_lad*0.5), dh=dw;
    g.fillStyle='rgba(0,0,0,0.28)';                       // contact shadow: he stands ON the floor
    g.beginPath(); g.ellipse(px+C/2,py+C*0.86,C*0.42,C*0.20,0,0,7); g.fill();
    g.drawImage(img, Math.round(px+C/2-dw/2), Math.round(py+C-dh), dw, dh);
  } else { g.fillStyle='#e8e0d4'; g.fillRect(px+3,py-C+4,C-6,C*2-8); }
}
const _inRender=render;
render=function(){ if(INSIDE)renderInside(); else _inRender(); };
const _inHud=updHud;
updHud=function(){ _inHud();
  if(!INSIDE)return;
  const fp=INSIDE.fp;
  document.getElementById('hslot').textContent='INSIDE · '+String(INSIDE.zone).toUpperCase();
  document.getElementById('hmode').textContent=fp.W+'x'+fp.H+' · '+fp.rooms.length+' ROOMS';
  document.getElementById('note').textContent=INSIDE.label;
};
// leaving the walk zoom leaves the building first - you never zoom out to the
// city from inside a room.
const _inSwap=swapMode;
swapMode=function(){ if(INSIDE){ hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null; } return _inSwap.apply(this,arguments); };
window.__CITY_INSIDE=function(){ return INSIDE?{W:INSIDE.fp.W,H:INSIDE.fp.H,foot:INSIDE.foot,
  rooms:INSIDE.fp.rooms.length,zone:INSIDE.zone,label:INSIDE.label}:null; };
""" % (FLOORPLAN, fp_body, ZONE_JS)

# ---- 3) the step that walks you in ------------------------------------------
# the human branch of stepOnce blocks on any non-walkable cell. A cell whose
# dossier declares an interior is not a wall, it is a door.
STEP = """      const c=cellAt(nx,ny);
      if(!(c&&c.walk))break;"""
assert decoded.count(STEP) == 1
decoded = decoded.replace(STEP, """      const c=cellAt(nx,ny);
      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
      if(c&&c.walk&&c.portal&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,true)){ HFACE=dirOf(dx,dy); return true; } }
      if(!(c&&c.walk))break;""")

decoded = decoded.replace('\n</script>\n</body></html>', '\n' + INJECT + '\n</script>\n</body></html>')
assert 'STEP-INSIDE' in decoded

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('STEP-INSIDE wired into CITY_B64 (%d districts zoned, floorplan inlined %d bytes)'
      % (len(ZONES), len(fp_body)))
