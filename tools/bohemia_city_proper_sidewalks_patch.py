#!/usr/bin/env python3
"""
PROPER SIDEWALKS. (Paolo 8/20: "Dont forget the proper sidewalks too".)

MEASURED FIRST, on 12 real arterial cells (196,608 tiles) on the running page:

    code  1  asphalt roadway    122,664   art: street   <- his approved asphalt, correct
    code  7  landscape strip     36,192   art: hyard    <- a dirt verge; yard dirt is fair
    code  6  sidewalk            16,868   art: side     <- CORRECT, and it is the good one
    code  4  raised median        7,680   art: hyard    <- a landscaped island; fair
    code  2  white lane line      6,240   art: street   <- *** PLAIN ASPHALT. NO LINE. ***
    code  5  curb + gutter        6,000   art: hyard    <- *** HOUSE-YARD DIRT ON A KERB ***
    code  3  crosswalk                0                 <- *** NEVER EMITTED, ANYWHERE ***

THE SIDEWALK SURFACE ITSELF WAS ALREADY RIGHT. What was wrong is everything that makes a
sidewalk PROPER: the kerb beside it was wearing the house-yard pool, the lane line beside
that was wearing blank asphalt, and there is not one marked crossing in the valley.

banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt has had the right tile for every one of
these since 7/14, judged and approved (REAL_VEGAS R2). Opened and LOOKED AT, not read about
-- rendered to PNG and viewed, per REUSE-FIRST:
    pools.side      36  pale concrete, scored panel joints, weeds in the cracks
    pools.lane_div   2  the white lane line, already 30-year washed
    pools.median     3  the DOUBLE-YELLOW centre line (paint, NOT a raised island)
    pools.cross      3  the crossing bars -- a real zebra
records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md names each one, and reading it
first is required by the STREETS ARE THE HARMONIZED POOL law (7/31, LOCKED).

*** WHY IT WAS UNREACHABLE, AND IT IS THE SIGNAL BUG AGAIN. ***
The renderer picks the marking pools by HARD-CODED COLOUR:
    if(c.g==='#b8a040' || c.g==='#d8d4c4')     // median, lane
Those are the OLD PARAMETRIC street colours. Since A ROAD WITH ITS OWN MODULE DRAWS ITSELF
the arterial emits its own palette -- lane line #b3ab97, kerb #6b6b74, median #6f6a5e --
and not one of them matches, so four approved pools (median_h, median_v, lane_h, lane_v)
could never be requested by anything. Same shape as `m.road` going false and taking his 348
traffic signals off 274 intersections with it: A LOOKUP KEYED ON A VALUE THAT MOVED.

SO THIS MAPS BY WHAT THE TILE IS, NOT BY WHAT COLOUR IT HAPPENS TO BE. The district's own
LEGEND already says "white lane line" and "curb + gutter" in plain words; that is the
world's own notion of what the tile means, it is what the hazard classifier already derives
from, and it does not move when somebody repaints a palette. A new road module that calls a
tile a lane line gets the lane-line art with no edit here.

WHAT IT DOES NOT DO: it does not place a single crosswalk. Code 3 is declared in the
arterial legend and the generator emits ZERO in every leg configuration tested
({S}, {S,cross:E}, {S,E}). Placing crossings is ROAD LAYOUT and belongs to the session that
owns the road generators -- handed over with the numbers rather than guessed at. The art is
sitting in the bank ready for the day they land.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO pixels. Every tile it reaches is already
in banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt with his verdict on it. Opened that
bank and rendered its median/cross/lane_div/side pools to PNG and looked at them before
assigning any of them, which is how the raised median stayed on hyard: `pools.median` is
the double-yellow CENTRE LINE, and a raised median is a landscaped island, so wiring the
one to the other would have painted road paint onto a kerbed island.

  python3 tools/bohemia_city_proper_sidewalks_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__PROPER_SIDEWALKS__'

# 1) THE TILE SAYS WHAT IT IS. Derived from the legend name, in realizeCell, where the
#    legend entry is already in hand.
POOL_OLD = ("""      const _k=entry&&entry.kind;
      const _pool=(_k==='drive'||_k==='marking')?'street'
                 :(_k==='walk'||_k==='gate')?'side'
                 :(_k==='water')?null:'hyard';""")
POOL_NEW = ("""      const _k=entry&&entry.kind;
      /* __PROPER_SIDEWALKS__ -- Paolo 8/20: "Dont forget the proper sidewalks too."
         THIS TABLE IS WHERE A TILE PICKS ITS APPROVED ART, and it was too coarse in two
         places that are exactly what makes a sidewalk read as proper.
         MEASURED on 12 real arterial cells (196,608 tiles) before touching it:
             curb + gutter    6,000 tiles  ->  hyard   THE HOUSE-YARD POOL, ON A KERB
             white lane line  6,240 tiles  ->  street  PLAIN ASPHALT, SO NO LINE AT ALL
         Both fall out of `kind` alone: a kerb is kind 'ground', so it landed in the
         catch-all with dirt yards; a lane line is kind 'marking', so it got the roadway
         pool with no paint on it. The SURFACE was never the problem -- the sidewalk itself
         has been wearing his `side` pool (16,868 tiles) all along.
         His bank has had the right tile for both since 7/14, judged, sitting unused:
         pools.lane_div (the 30-year washed white line) and pools.side (pale concrete with
         scored panel joints and weeds in the cracks).
         KIND IS THE COARSE ANSWER AND THE NAME IS THE EXACT ONE. The legend already says
         "curb + gutter" and "white lane line" in plain words, which is the world's own
         notion of what the tile is; it does not move when somebody repaints a palette,
         which is precisely how the marking pools got orphaned in the first place. */
      let _pool=(_k==='drive'||_k==='marking')?'street'
                 :(_k==='walk'||_k==='gate')?'side'
                 :(_k==='water')?null:'hyard';
      const _nm=String((entry&&entry.name)||'').toLowerCase();
      /* A KERB IS CONCRETE. It is poured with the walk and it weathers with it, so it
         wears the walk's pool -- not the dirt pool a house yard uses. */
      if(/\\bcurbs?\\b|\\bkerbs?\\b|gutter/.test(_nm)) _pool='side';
      /* A MARKING IS PAINT, AND THE PAINT IS THE POINT. `street` is bare asphalt: giving
         it to a lane line draws a road with no line on it. These pools are ORIENTED, so
         the pool name is left for the pass that can see this cell's neighbours. */
      else if(_k==='marking'){
        if(/lane line|lane marking/.test(_nm)) { c.markPool='lane'; _pool=null; }
        else if(/crosswalk|crossing/.test(_nm)) { c.markPool='cross'; _pool=null; }
        else if(/centre line|center line|double.?yellow/.test(_nm)) { c.markPool='median'; _pool=null; }
      }""")

# 2) ORIENTATION STAYS WHERE IT ALWAYS WAS. chunkCanvas is the only place that can see a
#    cell's neighbours, so it still decides h vs v -- it just stops asking about colour.
ORI_OLD = ("    let _gt=null; if(c.g==='#b8a040'||c.g==='#d8d4c4'){ const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1); "
           "const _vert=(_u&&_u.g===c.g)||(_d&&_d.g===c.g); const _pool=(c.g==='#b8a040')?(_vert?'median_v':'median_h'):"
           "(_vert?'lane_v':'lane_h'); _gt=saTex(_pool,v); }")
ORI_NEW = ("""    let _gt=null;
    /* __PROPER_SIDEWALKS__ -- a marking runs ALONG its road, so which rotation it wears is
       a question about its neighbours, and this is the only pass that can see them. What
       changed is what it asks: `c.markPool`, set from the tile's own legend name, instead
       of a hard-coded colour that stopped existing when the roads started drawing
       themselves.
       AND THE ROTATION HAS TO HAPPEN HERE, because the _h/_v pairs in SA_TILES ARE
       BYTE-IDENTICAL. Rendered both and looked: lane_h and lane_v are the same tile with a
       HORIZONTAL line, and cross_ns/cross_ew are the same tile with VERTICAL bars. The
       bank ships an `orientation_table` saying which tiles are authored NS and must be
       rot90 for an EW road, and whoever built SA_TILES duplicated them instead of rotating
       one copy -- so the pair existed in NAME ONLY and asking for the other member changed
       nothing. Measured by swapping the suffix and getting a pixel-identical screenshot.
       So the line ran ACROSS a north-south road: ladder rungs, not a lane line. */
    if(c.markPool){
      const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1);
      const _vert=(_u&&_u.markPool===c.markPool)||(_d&&_d.markPool===c.markPool);
      /* ALWAYS ASK FOR THE AUTHORED MEMBER AND ROTATE. The _h/_v pair is byte-identical,
         so requesting "the other one" fetches the same pixels and means nothing; the only
         real difference is the quarter turn. Asking for one and turning it also keeps the
         cache honest -- two names for one tile would warm two entries for one picture. */
      const _sfx=(c.markPool==='cross')?'_ns':'_h';
      /* lane/median are authored with the line running EAST-WEST, so a NORTH-SOUTH road
         needs them turned a quarter turn. cross is authored with its bars already running
         north-south, which is what a crossing over a north-south road wants, so it turns
         in the opposite case. */
      const _rot=(c.markPool==='cross')?!_vert:_vert;   /* authored EW; a NS road turns it */
      _gt=_rot?__rotTex(c.markPool+_sfx,v):saTex(c.markPool+_sfx,v);
    }
    if(!_gt&&(c.g==='#b8a040'||c.g==='#d8d4c4')){ const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1); """
           """const _vert=(_u&&_u.g===c.g)||(_d&&_d.g===c.g); const _pool=(c.g==='#b8a040')?(_vert?'median_v':'median_h'):"""
           """(_vert?'lane_v':'lane_h'); _gt=saTex(_pool,v); }""")

# 3) THE ROTATOR. One quarter turn, cached, so it costs one canvas per (pool,variant).
ROT_ANCHOR = 'function saTex(pool,variant){'
ROT = """/* __PROPER_SIDEWALKS__ -- A QUARTER TURN, CACHED. The oriented pairs in SA_TILES are
   byte-identical (rendered both and looked), so the rotation the bank's orientation_table
   calls for has to happen at use. One canvas per (pool,variant) forever after -- the same
   derive-once-blit-forever rule tallTex already follows, because a per-frame rotate is a
   transform in the hot path and the render contract does not allow that. */
const __ROTCV=new Map();
function __rotTex(pool,variant){
  const k=pool+'|'+variant;
  if(__ROTCV.has(k)) return __ROTCV.get(k);
  const src=saTex(pool,variant);
  if(!src){ __ROTCV.set(k,null); return null; }
  const w=src.width||TPX, h=src.height||TPX;
  const c2=document.createElement('canvas'); c2.width=h; c2.height=w;
  const x=c2.getContext('2d'); x.imageSmoothingEnabled=false;
  x.translate(h/2,w/2); x.rotate(Math.PI/2); x.drawImage(src,-w/2,-h/2);
  __ROTCV.set(k,c2); return c2;
}
"""

if not os.path.exists(WORLD):
    sys.exit('PROPER SIDEWALKS: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE: both edits are pure replacements of anchors that still exist.
while '__ROTCV' in src:
    _i=src.find('/* __PROPER_SIDEWALKS__ -- A QUARTER TURN'); _j=src.find(ROT_ANCHOR,_i)
    if _i<0 or _j<0: break
    src=src[:_i]+src[_j:]
for _new, _old in ((POOL_NEW, POOL_OLD), (ORI_NEW, ORI_OLD)):
    if _new in src:
        src = src.replace(_new, _old, 1)

for name, old in (('the art-pool table in realizeCell', POOL_OLD),
                  ('the marking-orientation branch in chunkCanvas', ORI_OLD),
                  ('saTex, to place the rotator beside', ROT_ANCHOR)):
    if old not in src:
        sys.exit('PROPER SIDEWALKS: could not find %s. Refusing to guess -- a wrong edit '
                 'here paints road markings across the whole valley or none of it.' % name)

src = src.replace(POOL_OLD, POOL_NEW, 1)
src = src.replace(ORI_OLD, ORI_NEW, 1)
src = src.replace(ROT_ANCHOR, ROT + ROT_ANCHOR, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('PROPER SIDEWALKS: %s' % ('REFRESHED' if refreshed else 'applied'))
print('    curb + gutter  hyard (house-yard dirt) -> side (his pale concrete)')
print('    white lane line  blank asphalt -> lane_div (his 30-year washed line)')
print('    mapped by the legend NAME, so a repainted palette can never unhook it again')
print('    NOT done here: the arterial emits ZERO crosswalks. That is road layout.')
