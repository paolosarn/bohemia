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
      g.fillRect(Math.round(ox+fx*C), Math.round(oy+fy*C), Math.ceil(C), Math.ceil(C));
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
