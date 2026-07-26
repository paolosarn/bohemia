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

REUSE CHECK: (rewritten 7/26 after Paolo's correction, twice. v1 painted flat hex
rectangles and claimed "no banks/ lookup applies" - wrong: flat fills ARE cooked
pixels. v2 reached for TP_TILES, the raw 9,127-tile cut corpus embedded in the
app - also wrong: that corpus is the UNSWEPT judging surface, and it put purple,
neon and live grass in a dead-world interior, breaking PURPLE RESERVATION and
DEAD WORLD in one shot. v3, this one, uses only art Paolo has actually blessed):
  LOOKED AT: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (the overnight
  house-skin cook - Paolo's verdict was ALL 30 UP,
  records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt: tan stucco walls, dead dark
  windows, boarded windows, weathered doors, decomposed-granite ground);
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (the judged, 30-year-
  weathered street pools the walked city already stands on - the 'side'
  sidewalk/concrete pool is the interior slab); banks/BOHEMIA_TILE_REPO.txt and
  banks/BOHEMIA_HD_TILE_REPO_part1-4.txt (the raw cut corpus - opened, and
  REJECTED for this pass, see below); banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26
  .txt (the Great Sweep: 2,604 assets judged, 1,927 UP - the real act-1 prop
  authority, and the right source for interior props).
  used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt and used
  BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt: every interior surface is a tile
  out of those two APPROVED pools, blitted
  through the app's own draw path at the app's own patch coherence (a floor
  patch or a wall run shares one tile, never pixel static). WALLS = hwall, the
  same tan stucco the building wears outside, so the interior is made of the
  exterior. PERIMETER = hwindow / hboarded where a wall faces daylight. DOORS =
  hdoor. FLOOR = the 'side' concrete pool for finished rooms, hyard
  decomposed-granite for dirt-floor back-of-house. Nothing new was cooked.
  NOT USED, DELIBERATELY: the raw TP_TILES cut corpus. It is the pre-verdict
  judging surface (that is what the TILES button is for), it is full of
  fantasy/sci-fi packs, and sampling it put purple and neon inside a house. The
  Great Sweep's 1,927 UP verdicts are keyed by (pack, idx) into the HD masters
  and do NOT map onto the app's category/index cut - building that mapping is
  its own job, and it is filed as the next CITY backlog item. Until it exists,
  interiors ship with the blessed shell and NO props rather than unswept ones.

Idempotent (marker STEP-INSIDE). interiors_gate.js locks it.

  python3 tools/bohemia_city_interiors_patch.py
"""
import base64
import json
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

# UPGRADE PATH, not just a no-op guard. The injected block is a single
# contiguous region between its banner and the end of the app script, so a
# re-run REPLACES it with the current version instead of refusing. That is what
# lets the renderer be corrected in place (7/26: flat colours -> approved art)
# without hand-editing 33MB of base64. The three small realizeCell/stepOnce
# edits below are identical across versions and are applied only if absent.
BANNER = '/* ==== STEP-INSIDE (7/26, CITY lane)'
TAIL = '\n</script>\n</body></html>'
if BANNER in decoded:
    _b = decoded.index(BANNER)
    _t = decoded.rindex(TAIL)
    assert _t > _b, 'STEP-INSIDE block boundaries look wrong - refusing to cut'
    decoded = decoded[:_b] + decoded[_t + 1:]
    UPGRADE = True
else:
    UPGRADE = False

fp_body = open(FLOORPLAN, encoding='utf8').read()      # REUSE: the canon generator, verbatim

# ---- REUSE PROVENANCE, ASSERTED, NOT CLAIMED --------------------------------
# REUSE-FIRST LAW (Paolo 7/22, LOCKED): "a claimed reuse must actually open that
# bank in code, not just say so." Every interior surface this patch draws comes
# out of two pools that live in the app because two earlier patches put them
# there. That indirection is exactly where a claim can rot into a lie, so the
# provenance is CHECKED here: open both banks, confirm the tile classes the
# interior depends on are really in them, and refuse to patch if they are not.
HOUSE_BANK = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
STREET_BANK = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
_house = json.load(open(HOUSE_BANK, encoding='utf8'))
assert 'all 30 UP' in _house.get('status', ''), '%s is not the all-UP canon set' % HOUSE_BANK
_ids = {t['id'] for t in _house['tiles']}
# the exact tiles the interior shell is built from (same ids the house-art patch
# pooled into SA_TILES.hwall / hwindow / hboarded / hdoor / hyard)
for need in ('wall_plain_8', 'wall_window_12', 'wall_boarded_15', 'wall_door_18', 'yard_deserttan_27'):
    assert need in _ids, '%s is missing %s - interiors cannot be built from approved art' % (HOUSE_BANK, need)
# THE DOOR LAW (Paolo 7/26, LOCKED): a door is ONE TILE WIDE AND TWO TILES TALL,
# always, and doors OPEN. The approved bank has existed since 7/13 (30 clips, 9
# frames, queue CLOSED 30/30) and the interior was drawing a flat 1x1 stamp -
# the exact failure the law was written about. Same bank, same residential pack,
# same 88x176 assertion the RUN lane's build already makes: one consumption
# contract, not a second one.
DOOR_BANK = 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt'
_doors = json.load(open(DOOR_BANK, encoding='utf8'))
DOOR_CLIPS = sorted(k for k in _doors['clips'] if re.match(r'^4\._Doors_a_\d+_swing$', k))
assert len(DOOR_CLIPS) >= 6, '%s is missing the approved residential doors' % DOOR_BANK
_door_out = []
for k in DOOR_CLIPS:
    c = _doors['clips'][k]
    assert len(c['frames']) == _doors['frames_per_clip'], k + ' is not a full clip'
    for i, f in enumerate(c['frames']):
        raw = base64.b64decode(f)
        w = int.from_bytes(raw[16:20], 'big'); h = int.from_bytes(raw[20:24], 'big')
        assert (w, h) == (88, 176), '%s frame %d is %dx%d, not the 1-wide-2-tall door law' % (k, i, w, h)
    _door_out.append(c['frames'][0])          # the interior draws the CLOSED frame
DOOR_JS = json.dumps(_door_out, separators=(',', ':'))
_street = json.load(open(STREET_BANK, encoding='utf8'))
assert _street['pools'].get('side'), '%s has no side (concrete) pool' % STREET_BANK
# and the app must actually be carrying them, or the blits would silently no-op
for _pool in ('hwall', 'hwindow', 'hboarded', 'hdoor', 'hyard'):
    assert ('SA_TILES.' + _pool) in decoded, 'CITY_B64 is missing the approved %s pool (run the house-art patch first)' % _pool
assert "'side'" in decoded and 'SA_MAP' in decoded, 'CITY_B64 is missing the harmonized street pools'
print('REUSE verified: %d house-skin tiles (%s), %d side tiles, %d approved animated door clips'
      % (len(_house['tiles']), _house.get('status', 'judged'), len(_street['pools']['side']), len(DOOR_CLIPS)))

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
if decoded.count(K_STRUCT) == 1:
    decoded = decoded.replace(K_STRUCT, """    if(tl.layer==='structure'){
      c.s=pal; c.walk=false; c.artPool='hroof'; c.tint=pal;
      if(entry&&entry.enter){ c.enter=entry.enter; c.ecode=code; }   /* STEP-INSIDE: the dossier says what is in here */""")

K_PORTAL = "    if(tl.layer==='portal'){ c.g='#8a8a86'; c.walk=true; return c; }"
if decoded.count(K_PORTAL) == 1:
    decoded = decoded.replace(K_PORTAL, """    if(tl.layer==='portal'){ c.g='#8a8a86'; c.walk=true;
      if(entry&&entry.enter){ c.enter=entry.enter; c.ecode=code; c.portal=true; }   /* STEP-INSIDE: a door/ramp/open bay you step through */
      return c; }""")

# the canon suburb path decodes raw codes, not a legend - read the enter strings
# straight off BohemiaSuburb.LEGEND (already embedded), never a hand-copy.
S_HOUSE = """    else if(v===2||v===6||v===9){"""
if decoded.count(S_HOUSE) == 1:
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
/* ==== @@FPPATH@@ (inlined verbatim) ==== */
@@FPBODY@@

// district -> interior room grammar, transcribed from bohemia_world.js's DISTGEN
// at patch time (ENGINE SYNC LAW: one table, one truth). interiors_gate re-derives.
const IN_ZONE=@@ZONEJS@@;
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

// ---- render: REAL APPROVED ART, not painted rectangles (Paolo 7/26: "half of
// the file size of bohemia is the graphic assets and you're not using a single
// one of them"). Every surface below comes from a pool Paolo has JUDGED: the
// house-skin cook he passed all 30 of (hwall / hwindow / hboarded / hdoor /
// hyard) and the harmonized street pools the walked city already stands on
// ('side'). The interior is made of the same materials as the exterior, drawn
// through the app's own saTex path at the app's own patch coherence. The raw
// 9,127-tile cut corpus (TP_TILES) is deliberately NOT sampled: it is the
// pre-verdict judging surface and it puts purple and neon in a dead house. ----

// THE DOOR LAW (Paolo 7/26, LOCKED): "doors are always two tiles tall, two by
// one". The approved animated door bank has existed since 7/13 and nothing was
// consuming it; the interior drew a flat 1x1 stamp. These are the residential
// swing clips verbatim, 88x176 = ONE WIDE, TWO TALL, closed frame.
const IN_DOOR_B64=@@DOORJS@@;
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });

// ROOM ROLE -> which APPROVED pool the floor comes from. Public/finished rooms
// stand on the judged concrete ('side', the harmonized street pools);
// back-of-house stands on the judged decomposed-granite ground (hyard).
const IN_FLOORPOOL={
  stockroom:'hyard', records:'hyard', service:'hyard', floor_open:'hyard',
  dock:'hyard', locker:'hyard'
};
function inFloorPool(role){ return IN_FLOORPOOL[role]||'side'; }
// PATCH COHERENCE, the app's own anti-confetti rule: quantise into ~4-cell
// patches so a floor area or a wall run shares one tile and reads as a surface.
function inPatch(x,y,salt){
  const px=Math.floor(x/4), py=Math.floor(y/4);
  return ((Math.imul(px,73856093)^Math.imul(py,19349663)^Math.imul(salt,2654435761))>>>0);
}
function inBlit(pool,variant,sx,sy,C){
  const t=saTex(pool,variant); if(!t)return false;
  g.drawImage(t,sx,sy,C,C); return true;
}
// a door stands ON its cell and rises INTO the cell above it. Never squished.
function inDoor(seed,sx,sy,C){
  const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}
function renderInside(){
  const fp=INSIDE.fp;
  // A ROOM IS NOT A STREET: the walk zoom frames a whole neighborhood, which
  // leaves a 5x12 apartment as a stamp in a sea of black. Indoors the camera
  // FITS THE PLATE to the phone, so a building reads as a place you are standing
  // in. A plate too big to fit (a mall concourse, a storage row) falls back to
  // following the body at the walk zoom, same as outside.
  // THE MOBILE RENDER CONTRACT (7/26, ART lane, laws/BOHEMIA_MOBILE_RENDER_
  // CONTRACT_7_26_26.md): NON-INTEGER SCALE IS BANNED - "a 3x phone blitting a
  // 1.07x buffer destroys pixel art". The first cut of this camera fitted the
  // plate with a fractional cell size, which is exactly that. The cell is now
  // always a WHOLE number of pixels: fit the plate, then floor to an integer,
  // and never below the walk zoom's own step.
  let C=Math.floor(Math.min(cv.width*0.88/fp.W, cv.height*0.64/fp.H));
  let ox,oy;
  if(C<Math.floor(HC*0.75)){ C=Math.max(1,Math.floor(HC)); ox=Math.round(cv.width/2-INSIDE.ix*C); oy=Math.round(cv.height/2-INSIDE.iy*C); }
  else { C=Math.max(1,Math.min(C,140)); ox=Math.round((cv.width-fp.W*C)/2); oy=Math.round((cv.height-fp.H*C)/2); }
  g.fillStyle='#0d0b09'; g.fillRect(0,0,cv.width,cv.height);
  g.imageSmoothingEnabled=false;
  const isWall=(x,y)=>(x<0||y<0||x>=fp.W||y>=fp.H)||fp.grid[y][x].g==='wall';
  const onEdge=(x,y)=>(x===0||y===0||x===fp.W-1||y===fp.H-1);
  // GROUND PASS: the judged concrete slab / decomposed-granite ground
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height)continue;
    if(c.g==='wall')continue;
    const pool=inFloorPool(c.role);
    if(!inBlit(pool,inPatch(x,y,pool.length),sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); }
  }
  // WALL PASS: hwall, the SAME tan stucco the building wears on the outside, so
  // the interior is literally made of the exterior. A wall that faces daylight
  // carries a dead window or a boarded one.
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height)continue;
    if(c.g==='wall'){
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy,C);
      if(!isWall(x,y+1)){ g.fillStyle='rgba(255,240,210,0.10)'; g.fillRect(sx,sy+C-Math.max(1,C*0.26),C,Math.max(1,C*0.26)); }
    }
  }
  // DOOR PASS, drawn AFTER the walls because a door is TWO TILES TALL and rises
  // into the cell above its own (DOOR LAW, Paolo 7/26). Painting it inside the
  // wall loop would let the next wall row overdraw its top half.
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x]; if(c.g!=='door')continue;
    const sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height+C)continue;
    if(!inDoor((x*7+y*13)>>>0,sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);
  }
  // AMBIENT OCCLUSION against every wall, over the art
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x]; if(c.g==='wall'||c.g==='door')continue;
    const sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C||sx>cv.width||sy>cv.height)continue;
    g.fillStyle='rgba(0,0,0,0.20)';
    if(isWall(x,y-1))g.fillRect(sx,sy,C,Math.max(1,C*0.16));
    if(isWall(x,y+1))g.fillRect(sx,sy+C-Math.max(1,C*0.12),C,Math.max(1,C*0.12));
    if(isWall(x-1,y))g.fillRect(sx,sy,Math.max(1,C*0.14),C);
    if(isWall(x+1,y))g.fillRect(sx+C-Math.max(1,C*0.14),sy,Math.max(1,C*0.14),C);
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
"""
INJECT = (INJECT.replace('@@FPPATH@@', FLOORPLAN)
                .replace('@@FPBODY@@', fp_body)
                .replace('@@ZONEJS@@', ZONE_JS)
                .replace('@@DOORJS@@', DOOR_JS))

# ---- 3) the step that walks you in ------------------------------------------
# the human branch of stepOnce blocks on any non-walkable cell. A cell whose
# dossier declares an interior is not a wall, it is a door.
STEP = """      const c=cellAt(nx,ny);
      if(!(c&&c.walk))break;"""
if decoded.count(STEP) == 1:
    decoded = decoded.replace(STEP, """      const c=cellAt(nx,ny);
      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
      if(c&&c.walk&&c.portal&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,true)){ HFACE=dirOf(dx,dy); return true; } }
      if(!(c&&c.walk))break;""")

decoded = decoded.replace(TAIL, '\n' + INJECT + TAIL, 1)

# POST-CONDITIONS. The three small hooks are applied conditionally (an upgrade
# re-run finds them already in place), so verify the OUTCOME rather than the
# edit: a half-patched app would look fine and quietly refuse to let you in.
assert 'STEP-INSIDE' in decoded
for _need, _what in (
        ('c.enter=entry.enter; c.ecode=code;', 'kit structures keep their dossier enter'),
        ('c.portal=true;', 'kit portals keep their dossier enter'),
        ('BohemiaSuburb.legend[v]', 'the suburb house/garage read their enter'),
        ("if(c&&!c.walk&&c.enter&&typeof inEnter==='function')", 'the step walks you in')):
    assert _need in decoded, 'hook missing after patch: ' + _what

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print(('STEP-INSIDE UPGRADED in' if UPGRADE else 'STEP-INSIDE wired into') + ' CITY_B64 (%d districts zoned, floorplan inlined %d bytes)'
      % (len(ZONES), len(fp_body)))
