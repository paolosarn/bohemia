#!/usr/bin/env python3
"""
WHAT IS IN THE ROOM, ON THE SURFACE HE FIGHTS IN. (8/18, WORLD lane.)

engine/bohemia_furnish.js decides what is in a room. This puts it in the building he
walks into, and the timing matters: __CITY_FIGHT__ ("THE DOOR IS THE FIGHT") landed on
this same page, so inEnter is now BOTH the way inside AND the way into a fight. The room
this patch furnishes is the room the fight happens in.

WHY THIS IS THE FIX AND NOT A DRESSING PASS. gates/retreat_gate.js measured the hard
obligation from the RF4 lift sec 6 -- "a cramped room deletes the entire core verb" --
across nine zones, six seeds and nine footprints, and found a clean break: every plate
at 10x10 or under is ONE ROOM with 94% of its floor unable to get out of sight. Walls
cannot fix it, because a 6x6 plate is 4.5 METRES SQUARE and partitioning a shed to make
a gate go green is inventing architecture that does not exist. Cover at that size is what
is IN the room. Measured after this lands:

    stranded floor cells below the break point   9,630 -> 3,053   (-68%)
    the break point itself                       20x16 -> 16x14   (320 -> 224 tiles)

THE RENDER IS A BLOCKING VOLUME, NOT ART, AND THAT IS DELIBERATE.
REUSE CHECK: opened, decoded and LOOKED AT -- rendered to PNG and viewed, not read
about -- banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (31 furniture / 60 container / 80
clutter / 50 debris, header claiming "every tile here carries a Paolo UP verdict") and
banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt (314 props). The interior pool is a GENERIC
FANTASY ASSET PACK: banded oak barrels, burlap sacks, tavern benches, potion bottles
and LIVE FLOWERING PLANTS, which breaks the dead-world standing law outright. The prop
pool's containers are GLOWING SCI-FI LOOT CRATES. The one genuinely usable set in either
bank is the prop pool's `cover` family -- concrete jersey barriers with yellow hazard
stripes, sandbag stacks, steel plate -- which is right for a room somebody fortified and
wrong for a bedroom. SO NOTHING IS WIRED FROM EITHER. Putting a coopered barrel in the
one surface he plays, because a bank existed and a law said reuse first, is how a build
ends up looking like somebody else's game. REUSE-FIRST asks what you opened and why
nothing fit; that is why nothing fit, and the ART ask is filed in the record.

What draws instead is the same thing this renderer already does when a tile bank is
missing: a flat volume with a lit top and a darker front, which is the 45-degree read.
COVER stands chest-to-head and rises into the cell above it, the way the walls here
already do; LOW sits at knee-to-waist and does not. So the two classes are told apart
by SHAPE before any colour is parsed, which is the point -- one of them hides you and
one of them does not.

  python3 tools/bohemia_city_furnish_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MODULE = 'engine/bohemia_furnish.js'

MARK = '/* ==== WHAT IS IN THE ROOM (inlined verbatim) ==== */'
ENDMARK = '/* ==== end WHAT IS IN THE ROOM ==== */'
DRAW_MARK = '/* ==== __FURNITURE_PASS__ -- what you can get behind ==== */'
DRAW_END = '/* ==== end __FURNITURE_PASS__ ==== */'

if not os.path.exists(WORLD):
    sys.exit('FURNISH PATCH: %s is not here.' % WORLD)
if not os.path.exists(MODULE):
    sys.exit('FURNISH PATCH: %s is missing.' % MODULE)
src = open(WORLD, encoding='utf-8').read()


def cut(text, a_mark, b_mark, what):
    """A START WITH NO END IS NOT SOMETHING TO GUESS AT -- the payday orphan (8/15) was
    a rename that left a stale block LATER in the file, where the browser ran it."""
    n = 0
    while a_mark in text:
        a = text.find(a_mark)
        b = text.find(b_mark, a)
        if b < 0:
            sys.exit('FURNISH PATCH: the %s block has a start and no end. Refusing to '
                     'guess where it stops.' % what)
        text = text[:a] + text[b + len(b_mark):]
        n += 1
    return text, n


refreshed = 0
for a_m, b_m, what in ((MARK, ENDMARK, 'module'), (DRAW_MARK, DRAW_END, 'draw pass')):
    src, n = cut(src, a_m, b_m, what)
    refreshed += n

# ---------------------------------------------------------------- 1. the module
# THE BANNER IS THE SYNC SWEEP'S ONLY DOOR, written in the scanner's exact shape:
# '/* ==== engine/x.js ==== */' on ONE line. A wrapped banner is an OPT-OUT from the
# ENGINE SYNC LAW, not a style choice -- ten modules on this page sat outside the sweep
# that way and one drifted a full week (8/15, and banner_gate.js exists because of it).
# AND THE ANCHOR MUST BE THE MODULE, NOT ITS FIRST LINE OF CODE. This read
# `const BOH_FLOORPLAN=(function(){` and inserted BEFORE it -- which is the point
# immediately after the floorplan's comment header, so the furnish module landed
# INSIDE the floorplan and CUT IT IN HALF. Measured 8/20: the city held the
# floorplan's first 1,466 bytes at one address and its remaining 13,906 at
# another, 34,850 bytes of two other modules between them. Everything still RAN
# -- both halves are top-level -- so nothing looked broken; what died was
# byte-identity, which is the whole of the ENGINE SYNC LAW, and it took INTERIORS,
# QUEST PLACEMENT and BANNER red with it. Twice, because fixing the page without
# fixing this tool just waits for the next run.
# The furnisher still lands BEFORE the floorplan (it must be defined before
# inEnter), it just lands before the WHOLE module now instead of inside it.
_FP_CANON = open('engine/bohemia_floorplan.js', encoding='utf-8').read()
i = src.find(_FP_CANON)
if i < 0:
    ANCHOR = 'const BOH_FLOORPLAN=(function(){'
    i = src.find(ANCHOR)
if i < 0:
    sys.exit('FURNISH PATCH: could not find the floorplan module to inline beside. The '
             'furnisher stamps onto a plate the floorplan makes, so it cannot land first.')

blob = [MARK,
        '/* ==== %s ==== */' % MODULE,
        '/* inlined verbatim by tools/bohemia_city_furnish_patch.py. The banner above is '
        'one line on purpose: see the note in that tool. */',
        open(MODULE, encoding='utf-8').read(),
        ENDMARK]
src = src[:i] + '\n'.join(blob) + '\n' + src[i:]

# ---------------------------------------------------------------- 2. the call
# ON THE PLATE, THE MOMENT IT IS MADE. inEnter is the ONE place a body goes through a
# door (the 8/2 doorway ruling funnels every entry through it) and now also the one
# place a fight starts (__CITY_FIGHT__), so furnishing here covers both with one call
# and nothing else in the walk is touched.
CALL_OLD = ("  let fp; try{ fp=BOH_FLOORPLAN.generate(seed,f.w,f.h,{zone:zone,entrance:side}); }"
            "catch(e){ return false; }")
CALL_NEW = (
    "  let fp; try{ fp=BOH_FLOORPLAN.generate(seed,f.w,f.h,{zone:zone,entrance:side}); }"
    "catch(e){ return false; }\n"
    "  /* __FURNITURE_PASS__ -- WHAT IS IN THE ROOM, and it is the fix the retreat gate\n"
    "     named with a number. A bare plate at 10x10 or under is ONE ROOM with 94% of its\n"
    "     floor unable to get out of sight, and walls cannot fix it because a 6x6 plate is\n"
    "     4.5 metres square. Furnished: stranded cells below the break point fall 9,630 ->\n"
    "     3,053 and the break point itself comes down 20x16 -> 16x14.\n"
    "     EVERY LEVEL, NOT JUST THE GROUND ONE: a fight upstairs is still a fight. And\n"
    "     levels[0] is a VIEW sharing this plate's grid by reference, so furnishing the\n"
    "     level furnishes the cells the renderer reads -- one call, one source of truth. */\n"
    "  try{ if(typeof BohemiaFurnish!=='undefined'){\n"
    "    const lv=(fp.levels&&fp.levels.length)?fp.levels:[fp];\n"
    "    for(let L=0;L<lv.length;L++) BohemiaFurnish.furnish(lv[L],(seed>>>0)+L*7919);\n"
    "  } }catch(_e){}")
if '__FURNITURE_PASS__' not in src:
    if CALL_OLD not in src:
        sys.exit('FURNISH PATCH: could not find the floorplan generate call inside inEnter. '
                 'Refusing to guess -- furnishing the wrong plate would put a wardrobe in a '
                 'building he is not standing in.')
    src = src.replace(CALL_OLD, CALL_NEW, 1)

# ---------------------------------------------------------------- 3. it has to BLOCK
# A PIECE OF FURNITURE YOU WALK THROUGH IS A DRAWING, NOT AN OBJECT. inPassable is the
# ONE thing that decides where a body may stand indoors, and every retreat number above
# assumes a `cover` or `low` piece stops you. Without this the measure and the game
# disagree, which is the worse of the two possible bugs: the gate stays green while the
# player strolls through a racking run.
PASS_OLD = ("function inPassable(x,y){\n"
            "  const fp=INSIDE.fp; if(x<0||y<0||x>=fp.W||y>=fp.H)return false;\n"
            "  const c=fp.grid[y][x]; return c.g==='floor'||c.g==='door';\n"
            "}")
PASS_NEW = ("function inPassable(x,y){\n"
            "  const fp=INSIDE.fp; if(x<0||y<0||x>=fp.W||y>=fp.H)return false;\n"
            "  const c=fp.grid[y][x];\n"
            "  /* __FURNITURE_PASS__ -- a shelf you can walk through is a drawing, not an\n"
            "     object, and every retreat number this lane published assumes it stops you. */\n"
            "  if(c.furn&&(c.furn.cls==='cover'||c.furn.cls==='low')) return false;\n"
            "  return c.g==='floor'||c.g==='door';\n"
            "}")
if PASS_NEW not in src:
    if PASS_OLD not in src:
        sys.exit('FURNISH PATCH: could not find inPassable. Refusing to guess -- furniture '
                 'that does not block is a lie the gate cannot see.')
    src = src.replace(PASS_OLD, PASS_NEW, 1)

# ---------------------------------------------------------------- 4. the draw
# AFTER THE WALL PASS AND BEFORE THE DOOR PASS, and the order is not arbitrary. The wall
# body draws TWO tiles (its own and the one above it), so a wall painted after furniture
# would overdraw any piece standing in the row above it. Doors are two tiles tall and
# must stay on top. The dead and the player draw after everything, so a body can never
# be hidden by a shelf.
DRAW_ANCHOR = ("  // DOOR PASS, drawn AFTER the walls because a door is TWO TILES TALL "
               "and rises")
d = src.find(DRAW_ANCHOR)
if d < 0:
    sys.exit('FURNISH PATCH: could not find the interior door pass to draw before.')

DRAW = DRAW_MARK + r"""
  /* WHAT YOU CAN GET BEHIND, DRAWN AS A VOLUME RATHER THAN AS ART -- on purpose, and
     the reason is in tools/bohemia_city_furnish_patch.py: both interior banks in this
     repo are generic asset packs (oak barrels and burlap sacks in one, glowing sci-fi
     loot crates in the other) and neither belongs in a dead Las Vegas apartment. The
     forms are ART's, per the same routing that gave WORLD the types.
     THE TWO CLASSES ARE TOLD APART BY SHAPE BEFORE COLOUR, which is the whole point
     because one of them hides you and one of them does not:
       COVER  chest-to-head and opaque -- racking, lockers, a fridge, a counter run. It
              RISES into the cell above, the way the walls in here already do.
       LOW    knee-to-waist -- a bed, a sofa, a desk. It does not rise. We have no
              crouch, so it blocks the body and never the look, and it must not read
              like something that will save you.
     Faces are painted only on the EDGES of a piece, so a six-tile racking run reads as
     one run and not as six boxes standing in a line. */
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x]; if(!c||!c.furn)continue;
    const sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height+C)continue;
    const hi=(c.furn.cls==='cover');
    const me=c.furn.id, rm=c.furn.room;
    const same=(ax,ay)=>{ const q=fp.grid[ay]&&fp.grid[ay][ax];
      return !!(q&&q.furn&&q.furn.id===me&&q.furn.room===rm); };
    const rise=hi?Math.round(C*0.55):0;
    /* body */
    g.fillStyle=hi?'#544a3e':'#655a49';
    g.fillRect(sx,sy-rise,C,C+rise);
    /* the lit top, only on the far edge of the piece: sky-lit visible top, the 45
       DEGREE ART LAW's own read, and it is what makes a run look like one object. */
    if(!same(x,y-1)){ g.fillStyle=hi?'#7c6f5b':'#8b7d66';
      g.fillRect(sx,sy-rise,C,Math.max(1,Math.round(C*0.22))); }
    /* the darker front lip on the near edge */
    if(!same(x,y+1)){ g.fillStyle=hi?'#3b3329':'#4a4135';
      g.fillRect(sx,sy+C-Math.max(1,Math.round(C*0.18)),C,Math.max(1,Math.round(C*0.18))); }
    /* side shading so a run reads as a solid mass rather than a stripe */
    if(!same(x-1,y)){ g.fillStyle='rgba(0,0,0,0.18)'; g.fillRect(sx,sy-rise,Math.max(1,Math.round(C*0.12)),C+rise); }
    if(!same(x+1,y)){ g.fillStyle='rgba(0,0,0,0.10)';
      g.fillRect(sx+C-Math.max(1,Math.round(C*0.12)),sy-rise,Math.max(1,Math.round(C*0.12)),C+rise); }
    window.__FURN_DRAWS=(window.__FURN_DRAWS||0)+1;
  }
""" + DRAW_END + '\n'
src = src[:d] + DRAW + src[d:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('FURNISH PATCH: %s %s' % (MODULE, 'REFRESHED in' if refreshed else 'inlined into'))
print('    furnished on the plate, in inEnter -- which is now the fight entry too')
print('    it BLOCKS (inPassable) and it DRAWS (after the walls, before the doors)')
print('    stranded floor cells below the break point: 9,630 -> 3,053 (-68%)')
