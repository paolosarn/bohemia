#!/usr/bin/env python3
"""
THE FLOOR CAN KILL YOU AND IT CANNOT TELL YOU. (8/20, WORLD lane.)

This lane has spent three days making the ground mean something. 31 hazard tiles in 22
districts; a third occupancy state for the four real holes; ceiling rubble and lift shafts
indoors. EVERY ONE OF THEM DRAWS AS FLAT COLOUR. Loose ballast you cannot brace on is the
same picture as the concrete beside it. Standing water is a slightly different tan. A body
walks onto ground that changes how it takes a hit and NOTHING ON SCREEN SAYS SO.

THE LAW ALREADY SAYS THIS IS WRONG, TWICE OVER:
  §2.6 of the lift -- "never explain something the floor could have shown". Today the ONLY
  thing that says the floor is dangerous is a text readout in the corner. That is the
  system explaining itself because the picture cannot.
  And records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md files the ask in his own terms:
  loose ground that reads as LOOSE (broken, unmatched, no two pieces alike), standing
  liquid that reads as WET WITHOUT READING AS CLEAN, and a drop that reads as a DROP from
  above (a rim, a shadow line, a floor at a different value). THREE FORMS, NOT NINETEEN.

*** DERIVED, NOT PAINTED, WHICH IS WHY IT IS THIS LANE'S JOB AND NOT A TILE BANK. ***
The mark is chosen by the tile's HAZARD CLASS, which is itself derived from the district's
own legend. So a drained pool authored into a new district next month is lethal that
afternoon AND LOOKS LETHAL that afternoon, with no edit here and no pixels cooked. A
hand-painted per-tile bank would be nineteen pictures that go stale the first time a
generator adds a twentieth tile. This is the same shape as the ROCK TEXTURE fix (8/20):
reach an existing procedural generator from a property the world already computes.

THE THREE FORMS, and each one is drawn to a rule rather than to taste:
  LOOSE (AMPLIFIES)   angular chips at four sizes, no two values alike, no two spacings
                      alike. NO STRAIGHT LINES and no regular grid -- Paolo 8/1: "hair is
                      little off shapes", and a regular scatter reads as a PATTERN, which
                      is the barcode mistake that made the parking lot dogshit on 7/29.
  WET (DISABLES)      a dark, blue-shifted skin with a LIGHTER RIM where it meets dry
                      ground, and no highlight in the middle. Wet without clean: a shine
                      in the centre would read as a swimming pool, and nothing in this
                      valley is clean.
  DROP (KILLS/void)   the void already draws darker than the rock it is cut from (8/20).
                      What it was missing is THE RIM: a bright lip on the near edge and a
                      hard shadow just inside the far one, drawn ONLY where the neighbour
                      is not itself a hole. That is the 45 DEGREE ART LAW read -- you are
                      looking down into it from the south -- and it is the difference
                      between a dark tile and a hole.

WHERE IT HOOKS, and there are two edits because the class has to travel:
  1. realizeCell stamps `c.haz` from BohemiaHazard.classOf, using the legend entry it
     ALREADY has in hand. The page's hazardUnder() cannot be used here: it re-resolves
     tileMeta and the legend from scratch for one cell, which is right for a readout that
     runs once a step and ruinous in a bake that runs for every cell on screen.
  2. chunkCanvas overlays the mark after the ground texture and before everything else, so
     lamps, props and structures still draw on top of it.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks NO pixel bank and opens none -- checked
banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt via records/BOHEMIA_WHERE_THE_GOOD_
STREET_PIXELS_ARE_7_31_26.md (roadway, sidewalk, markings, parking: no hazard ground in
it, and its tiles are 30-year street wash rather than broken rock) and
banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt (its `cover` family is jersey barriers and
sandbags -- objects on the ground, not ground). NOTHING IN EITHER BANK IS A GROUND HAZARD,
so nothing fit, and rather than hand-paint nineteen tiles this draws three procedural
forms in the same idiom as the page's existing TEXKIND generators.
A HAND-PAINTED BANK IS STILL ART'S TO MAKE if he wants one; this is the honest interim and
it is derived, so it covers every tile including the ones authored next month.

  python3 tools/bohemia_city_hazard_look_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__DANGEROUS_GROUND_LOOKS_DANGEROUS__'

# ── 1. THE CLASS TRAVELS ON THE CELL ────────────────────────────────────────────────────
STAMP_OLD = ("    const spec=m.kitSpec, entry=spec&&spec.legend&&spec.legend[code];\n"
             "    const tl=BohemiaDistrictKit.tileLayer(entry);\n"
             "    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';")
STAMP_NEW = ("""    const spec=m.kitSpec, entry=spec&&spec.legend&&spec.legend[code];
    const tl=BohemiaDistrictKit.tileLayer(entry);
    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';
    /* __DANGEROUS_GROUND_LOOKS_DANGEROUS__ -- THE CLASS RIDES ON THE CELL.
       The page already has hazardUnder(gx,gy), and it is the wrong tool here: it
       re-resolves tileMeta and the legend from scratch for a single cell, which is right
       for a readout that runs once a STEP and ruinous in a bake that runs for every cell
       on screen. This branch is holding the legend entry already, so the class is one call
       and it travels with the cell to whoever draws it. */
    if(typeof BohemiaHazard!=='undefined' && entry){
      try{ const _hc=BohemiaHazard.classOf(entry,BohemiaDistrictKit); if(_hc) c.haz=_hc; }
      catch(_e){}
    }""")

# ── 2. THE MARK IS DRAWN ────────────────────────────────────────────────────────────────
DRAW_OLD = "    x.drawImage(_gt||texFor(c.g,false,v),i2*TPX,y*TPX);"
DRAW_NEW = ("""    x.drawImage(_gt||texFor(c.g,false,v),i2*TPX,y*TPX);
    /* __DANGEROUS_GROUND_LOOKS_DANGEROUS__ -- and if this ground does something to a body,
       it says so in the picture instead of in a text readout in the corner (§2.6: never
       explain something the floor could have shown). Drawn AFTER the ground texture and
       BEFORE everything else, so lamps, props and structures still sit on top. */
    if(c.haz||c['void']) hazMark(x,i2*TPX,y*TPX,c,gx,gy,v);""")

# ── 3. THE THREE FORMS ──────────────────────────────────────────────────────────────────
FORMS_ANCHOR = 'function chunkCanvas(cx,cy){'
FORMS = """/* __DANGEROUS_GROUND_LOOKS_DANGEROUS__ -- THREE FORMS, NOT NINETEEN.
   The ask, in his own terms, from records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md:
   loose ground that reads as LOOSE, standing liquid that reads as WET WITHOUT READING AS
   CLEAN, and a drop that reads as a DROP FROM ABOVE. Chosen by the tile's hazard CLASS,
   which is derived from the district's own legend -- so a drained pool authored next month
   looks lethal the same afternoon, with no edit here. */
function _hzRand(gx,gy,salt){
  let s=(OM.hash2(gx*7+salt,gy*13+salt,20260820))>>>0;
  return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
}
function _hzShift(col,k,blue){
  const m=/^#([0-9a-f]{6})$/i.exec(String(col||'')); if(!m) return '#000';
  const n=parseInt(m[1],16);
  let r=((n>>16)&255)*k, g=((n>>8)&255)*k, b=(n&255)*k*(blue||1);
  const h=v=>{ v=Math.max(0,Math.min(255,Math.round(v))); return (v<16?'0':'')+v.toString(16); };
  return '#'+h(r)+h(g)+h(b);
}
function _hzLum(col){
  const m=/^#([0-9a-f]{6})$/i.exec(String(col||'')); if(!m) return 128;
  const n=parseInt(m[1],16);
  return ((n>>16&255)*0.299 + (n>>8&255)*0.587 + (n&255)*0.114);
}
/* A CONTRAST THAT SURVIVES THE GROUND IT IS ON. The first cut multiplied the base colour
   by 0.62..1.42, which is fine on tan desert and INVISIBLE on railyard ballast: multiply a
   dark grey by anything near 1 and you get another dark grey, on a tile that is already
   dark and already textured. Measured by taking the picture and looking at it -- the chips
   were there in the data and could not be seen, which is the mountain-brickwork lesson
   pointing the other way.
   So the step is ABSOLUTE and it is chosen by the base's own luminance: dark ground gets
   chips lighter than itself, light ground gets chips darker, and either way the gap is at
   least MIN so it cannot vanish into the material. */
function _hzStep(col,mag){
  const m=/^#([0-9a-f]{6})$/i.exec(String(col||'')); if(!m) return '#000';
  const n=parseInt(m[1],16); const L=_hzLum(col);
  const dir = L < 118 ? 1 : -1;                 /* away from the ground, never toward it */
  const d = dir * mag;
  const h=v=>{ v=Math.max(0,Math.min(255,Math.round(v))); return (v<16?'0':'')+v.toString(16); };
  return '#'+h(((n>>16)&255)+d)+h(((n>>8)&255)+d)+h((n&255)+d);
}
function hazMark(x,px,py,c,gx,gy,variant){
  const T=TPX, base=c.g||c.s||'#8a8478';
  /* A DROP: THE RIM IS THE WHOLE THING. The void already draws darker than the rock it is
     cut from; a dark tile is not yet a hole. What makes it read as one from above is a
     bright lip on the near edge and a hard shadow just inside the far edge -- you are
     looking down into it from the south, which is the 45 DEGREE ART LAW. The rim is drawn
     ONLY on edges where the neighbour is not itself a hole, so a big pit reads as one pit
     with a rim around it rather than a grid of tiles each with its own frame. */
  if(c['void']){
    const isHole=(ax,ay)=>{ const n=cellAt(ax,ay); return !!(n&&n['void']); };
    x.fillStyle=_hzShift(base,0.45);
    if(!isHole(gx,gy-1)) x.fillRect(px,py,T,Math.max(1,(T*0.16)|0));          /* far shadow */
    x.fillStyle=_hzShift(base,2.2);
    if(!isHole(gx,gy+1)) x.fillRect(px,py+T-Math.max(1,(T*0.12)|0),T,Math.max(1,(T*0.12)|0));
    x.fillStyle=_hzShift(base,1.5);
    if(!isHole(gx-1,gy)) x.fillRect(px,py,Math.max(1,(T*0.10)|0),T);
    if(!isHole(gx+1,gy)) x.fillRect(px+T-Math.max(1,(T*0.10)|0),py,Math.max(1,(T*0.10)|0),T);
    return;
  }
  const r=_hzRand(gx,gy,c.haz==='AMPLIFIES'?11:29);
  if(c.haz==='AMPLIFIES'){
    /* LOOSE: BROKEN, UNMATCHED, NO TWO PIECES ALIKE. Angular chips at four sizes with
       four different values and no regular spacing. A regular scatter reads as a PATTERN,
       which is the barcode mistake that made the parking lot dogshit (7/29), and straight
       edges read as tiling -- Paolo 8/1, "little off shapes". Every chip is a triangle
       with a jittered third point, so no two are the same shape either. */
    /* MORE OF THEM, AND BIGGER, AND THE GATE IS WHY AGAIN. The first cut drew 6-10 small
       chips and measured 2.2% broken-up against 2.7% for ORDINARY GROUND -- less textured
       than the plain dirt beside it, because the district art pools already carry grain and
       a few small chips disappear into it. A mark has to beat the material it is lying on. */
    const n=14+((r()*9)|0);
    for(let i=0;i<n;i++){
      const cx0=px+r()*T, cy0=py+r()*T;
      const w=Math.max(2,(T*(0.11+r()*0.22))|0);
      /* FOUR VALUES, ABSOLUTE, so no two pieces are alike AND none of them can sink into
         the ground they are lying on. 30..74 of 255 is a real step at any base. */
      x.fillStyle=_hzStep(base,[30,46,60,74][(r()*4)|0]);
      x.beginPath();
      x.moveTo(cx0,cy0);
      x.lineTo(cx0+w*(0.6+r()*0.8), cy0+w*(r()*0.5));
      x.lineTo(cx0+w*(r()*0.7), cy0+w*(0.7+r()*0.6));
      x.closePath(); x.fill();
    }
    return;
  }
  if(c.haz==='DISABLES'){
    /* WET WITHOUT CLEAN. A dark blue-shifted skin over most of the tile with a LIGHTER RIM
       where it meets dry ground, and deliberately NO highlight in the middle: a shine in
       the centre reads as a swimming pool, and nothing in this valley is clean. The edge
       is walked with a jitter so the pool has a shape rather than a border. */
    /* A WASH, NOT A SLAB, AND THE GATE IS WHY. The first cut FILLED the tile with flat
       colour and measured 0.0% broken-up against 2.7% for ordinary ground: it was WIPING
       the material underneath and leaving a clean sheet of colour. That is the one thing
       the ask forbids by name -- wet WITHOUT reading as clean -- and looking at the picture
       I read the flat teal as "water" and moved on. The pixels said otherwise.
       So it is translucent: the ground keeps its own grain and goes darker and bluer
       through it, which is what wet ground actually does. */
    x.save();
    x.globalAlpha=0.62;
    x.fillStyle=_hzShift(base,0.52,1.34);
    x.fillRect(px,py,T,T);
    x.restore();
    /* AND IT IS NOT AN EVEN SHEET: scum and silt sit in it, unevenly, and there is
       deliberately NO highlight in the middle -- a shine in the centre reads as a
       swimming pool and nothing in this valley is clean. */
    x.save();
    x.globalAlpha=0.5;
    for(let i=0;i<4+((r()*4)|0);i++){
      const w=Math.max(1,(T*(0.18+r()*0.3))|0), h=Math.max(1,(T*(0.06+r()*0.14))|0);
      x.fillStyle=_hzStep(base, r()<0.5?26:-22);
      x.fillRect(px+((r()*(T-w))|0), py+((r()*(T-h))|0), w, h);
    }
    x.restore();
    /* the rim where it meets dry ground: lighter, and walked with a jitter so the pool
       has a shape rather than a border */
    x.fillStyle=_hzStep(base,34);
    const step=Math.max(1,(T/6)|0);
    for(let i=0;i<T;i+=step){
      const t=Math.max(1,(T*0.09)|0);
      x.fillRect(px+i,py+((r()*t)|0),step,1);
      x.fillRect(px+i,py+T-1-((r()*t)|0),step,1);
    }
    return;
  }
  if(c.haz==='KILLS'){
    /* A KILLS TILE THAT IS NOT A VOID -- a drained pool shell, a filter basin. It IS ground
       you can walk onto, so it does not get the hole treatment; it gets the shell: darker
       than the deck around it, with the same near-edge lip so the drop still reads. */
    x.fillStyle=_hzShift(base,0.58);
    x.fillRect(px,py,T,T);
    x.fillStyle=_hzShift(base,1.9);
    x.fillRect(px,py+T-Math.max(1,(T*0.10)|0),T,Math.max(1,(T*0.10)|0));
  }
}
"""

if not os.path.exists(WORLD):
    sys.exit('HAZARD LOOK PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = MARK in src

# RE-RUNNABLE FROM DAY ONE. Two of this lane's tools shipped frozen-on-first-run
# (records/BOHEMIA_A_HOLE_IS_NOT_A_WALL_8_20_26.md). Replacements are reversed exactly; the
# INSERTED block is cut BY MARKER, never by content.
FS, FE = '/* __HZ_FORMS_S__ */', '/* __HZ_FORMS_E__ */'
for _new, _old in ((STAMP_NEW, STAMP_OLD), (DRAW_NEW, DRAW_OLD)):
    if _new in src:
        src = src.replace(_new, _old, 1)
while FS in src:
    i = src.find(FS); j = src.find(FE, i)
    if j < 0:
        sys.exit('HAZARD LOOK PATCH: the forms block has a start and no end. Refusing to '
                 'guess where it stops -- an orphaned half leaves a STALE hazMark later in '
                 'the file, where the browser runs it and the fresh one is dead code.')
    src = src[:i] + src[j + len(FE):]

for name, old in (('the legend lookup in realizeCell', STAMP_OLD),
                  ('the ground draw in chunkCanvas', DRAW_OLD),
                  ('chunkCanvas itself', FORMS_ANCHOR)):
    if old not in src:
        sys.exit('HAZARD LOOK PATCH: could not find %s. Refusing to guess -- a wrong edit '
                 'here either paints the whole valley or paints nothing and looks '
                 'identical to not having run.' % name)

src = src.replace(STAMP_OLD, STAMP_NEW, 1)
src = src.replace(DRAW_OLD, DRAW_NEW, 1)
i = src.find(FORMS_ANCHOR)
src = src[:i] + FS + '\n' + FORMS + FE + '\n' + src[i:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('HAZARD LOOK: %s -- dangerous ground looks dangerous'
      % ('REFRESHED' if refreshed else 'applied'))
print('    LOOSE  angular chips, four values, no two alike, no regular spacing')
print('    WET    a dark blue-shifted skin with a lighter rim and NO centre highlight')
print('    DROP   a bright near lip and a hard far shadow, only where the neighbour is dry')
print('    chosen by the derived hazard CLASS, so a tile authored next month is covered')
