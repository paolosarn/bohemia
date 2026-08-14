#!/usr/bin/env python3
"""
DRAW THE PITS IN THE DIRT (8/11/26, WORLD lane).

Paolo 8/11, LOCKED:
  "maybe we should have more open pits where a bunch of the shit lives as well.
   i know we have grids and shit but part of the procedureal generation
   especially if its dirt/sand is that we can proceduraly generate elements on
   the dirt/sand and this may be part of it."

engine/bohemia_dead.js pits() decides WHERE the ground was dug and what shape
the dig left. This puts it on the screen, in the tab he walks: RUN.

REUSE CHECK: COOKS ZERO PIXELS, AND DELIBERATELY DRAWS
NO ART AT ALL. A pit is not an object you place on the ground -- it IS the
ground, moved. So this is a TONAL pass over the ground tiles the district
already drew: the fill is pushed down and cooled, the rim catches light on its
cut edge, the spoil heap is lifted and warmed, the ramp reads as a graded slope,
and the nitrogen growth is a dark green wash.
  opened banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt -> street surfaces
    only; a pit is never dug in a roadway, so nothing there applies.
  opened records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md -> no approved
    excavation, spoil-heap or open-grave tile exists in any bank. NOTHING FIT.
  opened slices/BOHEMIA_CITY_TILES.js -> the page carries exactly one judged
    bank (TP_TILES.gore) and it is bones, not earth.
So rather than hand-paint a substitute -- which is the shopping-law violation --
this draws the pit out of the ground that is already there. Every pixel under a
pit is still Paolo's approved ground tile, shaded.

WHY TONE IS THE HONEST ANSWER AND NOT A SHORTCUT: the real surface indicators
are all tonal from above. Subsidence is a shadow. Spoil is a lit mound. The
nitrogen bloom is a colour. A forensic search from the air looks for exactly
these, which is why this reads as a grave and not as a decal.

Idempotent: re-running when the pass is already there reports NOOP.

  python3 tools/bohemia_city_pits_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = 'function pitsForCell('

if not os.path.exists(WORLD):
    sys.exit('PITS PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
if MARK in src:
    print('the pits are already dug into the walked world. no-op.')
    sys.exit(0)
if 'deadDraw(ox,oy)' not in src:
    sys.exit('PITS PATCH: the dead are not wired into this page yet. Run the dead patch first.')

DRAW = r'''
/* ==== OPEN PITS IN THE DIRT (8/11, WORLD lane) ==============================
   Paolo 8/11: "more open pits ... especially if its dirt/sand ... we can
   proceduraly generate elements on the dirt/sand".
   BohemiaDead.pits() says where the ground was dug and what the dig left. This
   shades it. NO ART IS DRAWN -- a pit is the ground moved, so it is painted with
   the ground's own pixels, darkened, lifted or greened. See
   tools/bohemia_city_pits_patch.py for the reuse check and the forensics. ==== */
/* THE BARE-GROUND LEGEND FOR PITS. DEAD_ROAD_LEGEND calls code 0 'roadway',
   and you do not dig a grave in a road -- isDiggable would correctly refuse it.
   Bare desert, wash and basin cells come through the same no-plot path, and
   they ARE dirt. One honest name for the surface they actually are. */
const DEAD_BARE_LEGEND={0:{name:'desert dirt',kind:'ground'}};
const PIT_CACHE=new Map();
function pitsForCell(tx,ty){
  const key=tx+','+ty;
  const hit=PIT_CACHE.get(key); if(hit) return hit;
  /* NEVER MAKE THE RENDERER GENERATE A DISTRICT IT HAS NOT ASKED FOR. Same
     guard the dead pass carries: if this cell has not been realized yet, say so
     and draw nothing, rather than forcing a 128x128 build mid-frame. */
  if(typeof metaCache!=='undefined' && !metaCache.has(key)){ return {list:[],by:new Map(),why:'not realized yet'}; }
  let out={list:[],by:new Map(),why:'ok'};
  try{
    /* ASK THE SAME QUESTION THE DEAD PASS ASKS, THE SAME WAY. Measured 8/11:
       tileMeta(...).legend comes back EMPTY in the running app for every
       district -- which is exactly why deadForCell resolves through
       deadLegendFor(m) and a synthetic legend for bare ground. Re-deriving that
       here would be a second ruler for one question, and it would be the wrong
       one: the first cut of this returned zero pits valley-wide and reported
       'ok' while doing it. */
    const m=tileMeta(tx,ty);
    let grid=null, legend=null;
    if(m.road||DEAD_BARE[m.d]){ grid=DEAD_ROAD_FLAT; legend=DEAD_BARE_LEGEND; }
    else { grid=m.kit||m.sub; legend=deadLegendFor(m); }
    if(!grid) out.why='no grid';
    else if(!legend) out.why='no legend for '+m.d;
    else {
      const list=BohemiaDead.pits({type:m.d, kit:grid, W:FN, H:FN,
        legend:legend, seed:om.seed, cellX:tx, cellY:ty, act:(typeof ACT!=='undefined'?ACT:1)});
      const by=new Map();
      for(const p of list) by.set(p.y*FN+p.x, p);
      out={list:list, by:by, why:'ok'};
    }
  }catch(e){ out={list:[],by:new Map(),why:String(e).slice(0,80)}; }
  if(PIT_CACHE.size>96) PIT_CACHE.clear();
  PIT_CACHE.set(key,out);
  return out;
}
/* THE FIVE PARTS, AS TONE. Numbers are deliberately restrained: this has to read
   as ground that was disturbed, never as a painted-on hole. */
const PIT_TONE={
  fill:  {fill:'rgba(24,18,10,0.42)'},   // subsidence: a depression is a shadow
  green: {fill:'rgba(38,58,26,0.46)'},   // nitrogen-fed growth, the desert tell
  rim:   {fill:'rgba(12,9,5,0.30)'},     // the cracked cut edge, in shade
  ramp:  {fill:'rgba(30,23,13,0.22)'},   // graded slope: shallower, so lighter
  spoil: {fill:'rgba(196,166,112,0.34)'} // the heap that never went back: lit
};
/* ==== DEPTH: THE RIM CASTS INTO THE HOLE (8/11) =============================
   Tone alone said "something happened to this ground". It did not say HOLE,
   because nothing in the picture was lit. A pit is a negative volume, and the
   one cue that reads instantly from above is the SUN-SIDE WALL casting down
   across the floor -- the same thing that makes a crater read in a photograph.
   ONE SUN, and it is the world's, not mine: sunVec() already drives every cast
   shadow in this app off T.min, so a pit dims and swings with the day like
   everything else, and goes flat at night when there is nothing to cast. ==== */
function pitShade(p){
  const s=(typeof sunVec==='function')?sunVec():null;
  if(!s) return 0;                       /* night: no sun, no cast, no fake depth */
  if(p.part==='spoil') return -0.10;     /* a heap is the one part that catches light */
  if(p.part!=='fill'&&p.part!=='green'&&p.part!=='ramp') return 0;
  /* HOW DEEP UNDER THE WALL THIS TILE SITS. u/v are the tile's position along the
     pit's own axes, so dotting them against the sun direction says whether it is
     on the shaded side of the bowl. Deepest right under the sun-side wall,
     nothing on the far side, which is exactly how a real hole reads. */
  const d=(-p.u*s.dx-p.v*s.dy);
  /* AMBIENT OCCLUSION FIRST, CAST SECOND. Measured 8/11: driving depth off the
     sun alone made the pit read at dawn and vanish at noon, because noon is the
     shortest shadow of the day. A real hole is dark even at noon -- the floor
     simply sees less sky than flat ground does, and that is ambient occlusion,
     not a cast shadow. So the floor carries a FLOOR of darkness that does not
     move with the clock, and the sun adds the directional cast on top. That is
     also why it survives the hour he actually plays at. */
  const ao=(p.part==='fill'||p.part==='green') ? 0.20 : 0.07;
  if(d<=0) return ao;
  /* the ramp is a graded slope, so it takes about half the depth of a cut wall */
  return Math.min(0.46, ao + d*0.42*(p.part==='ramp'?0.5:1));
}
function pitDraw(ox,oy){
  if(typeof BohemiaDead==='undefined'||typeof BohemiaDead.pits!=='function')return;
  const C=HC;
  const fx0=Math.floor(-ox/C)-1, fy0=Math.floor(-oy/C)-1;
  const fx1=fx0+Math.ceil(cv.width/C)+2, fy1=fy0+Math.ceil(cv.height/C)+2;
  const tx0=Math.max(0,(fx0/FN)|0), tx1=Math.min(OM.OVER_N-1,(fx1/FN)|0);
  const ty0=Math.max(0,(fy0/FN)|0), ty1=Math.min(OM.OVER_N-1,(fy1/FN)|0);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){
    const e=pitsForCell(tx,ty); if(!e.list.length)continue;
    const bx=tx*FN, by=ty*FN;
    for(const p of e.list){
      const fx=bx+p.x, fy=by+p.y;
      if(fx<fx0||fx>fx1||fy<fy0||fy>fy1)continue;
      const t=PIT_TONE[p.part]; if(!t)continue;
      g.fillStyle=t.fill;
      /* the cast, painted on TOP of the part's own tone in the same pass, so a
         pit costs one extra fill on the shaded half and nothing anywhere else */
      const sh=pitShade(p);
      const sx=Math.round(ox+fx*C), sy=Math.round(oy+fy*C);
      /* A CUT, NOT A STAIRCASE OF BLOCKS (8/11). Flooding every whole cell is
         what made the first pit read as pixel soup: the boundary was a
         tile-sized staircase, and at walking zoom a tile is 44 px of hard edge.
         A tile DEEP inside the hole is genuinely all hole, so it still floods --
         cheap, and correct. A tile ON the boundary (ecc high) gets masked at
         QUARTER-TILE resolution against the same ellipse maths that judged it,
         so the edge breaks up at 11 px instead of 44 and reads as ragged earth.
         The module ships u/v/d; nothing is re-derived here (one ruler). */
      if(p.ecc<0.35 || C<10){
        g.fillRect(sx, sy, Math.ceil(C), Math.ceil(C));
        if(sh>0.01){ g.fillStyle='rgba(10,7,3,'+sh.toFixed(3)+')';
          g.fillRect(sx, sy, Math.ceil(C), Math.ceil(C)); g.fillStyle=t.fill; }
        else if(sh<-0.01){ g.fillStyle='rgba(255,240,205,'+(-sh).toFixed(3)+')';
          g.fillRect(sx, sy, Math.ceil(C), Math.ceil(C)); g.fillStyle=t.fill; }
        continue;
      }
      const Q=4, q=C/Q, inside=(p.part==='fill'||p.part==='green');
      for(let j=0;j<Q;j++)for(let i2=0;i2<Q;i2++){
        /* where this quarter sits, in the pit's own axes */
        const su=p.u+((i2+0.5)/Q-0.5)*(2/Q)*0.5, sv=p.v+((j+0.5)/Q-0.5)*(2/Q)*0.5;
        const sd=su*su+sv*sv;
        /* the same wobble rule as the module, at quarter resolution: a
           deterministic per-sub-tile jitter so the break-up is stable, never
           shimmering as the camera moves */
        const jit=(((Math.imul((fx*Q+i2)|0,374761393)^Math.imul((fy*Q+j)|0,668265263))>>>9)/8388608-0.5)*0.20;
        const keep = inside ? (sd+jit < 0.86) : (sd+jit > 0.72);
        /* SHARE THE EDGE, DO NOT ROUND BOTH ENDS INDEPENDENTLY. Rounding the
           origin and then ceil-ing the width leaves sub-pixel seams between
           neighbouring quarters, and the ground shows through them as a faint
           GRID over the hole -- which is the blocky look coming back wearing a
           finer grid. Deriving each quarter from its two rounded BOUNDARIES
           makes adjacent quarters share an exact pixel edge, so a filled run is
           solid. */
        if(keep){
          const x0=Math.round(sx+i2*q), x1=Math.round(sx+(i2+1)*q);
          const y0=Math.round(sy+j*q),  y1=Math.round(sy+(j+1)*q);
          g.fillRect(x0, y0, Math.max(1,x1-x0), Math.max(1,y1-y0));
        }
      }
    }
  }
}
'''

# ---------------------------------------------------------------- 1. THE BODIES
# put the functions where deadDraw already lives, so both see the same globals.
ANCHOR = '/* ==== THE DEAD, OUTDOORS (8/8, WORLD lane)'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('PITS PATCH: could not find the outdoor dead pass to sit beside.')
src = src[:i] + DRAW + '\n' + src[i:]

# ------------------------------------------------------------------ 2. THE ORDER
# UNDER the bodies and OVER the ground: the pit is the ground, and the dead lie
# IN it, never under it. Anchoring on the dead call keeps that true by
# construction rather than by a line number.
NEED = '  deadDraw(ox,oy);   /* __THE_DEAD__ */'
if NEED not in src:
    sys.exit('PITS PATCH: could not find the dead draw call to sit in front of.')
src = src.replace(NEED, '  pitDraw(ox,oy);    /* __THE_PITS__ */\n' + NEED, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('the pits are dug into the walked world:')
print('  pitsForCell() + pitDraw(), drawn UNDER the dead and OVER the ground')
print('  five parts: fill / green / rim / ramp / spoil, tone only, zero new art')
