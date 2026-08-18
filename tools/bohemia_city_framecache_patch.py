#!/usr/bin/env python3
"""
FIVE LOOKUPS PER CELL, EVERY FRAME (8/17, WORLD lane).

MEASURED on the city builder, by counting calls rather than reading code:

    centred, whole valley on screen : 46,859 om.at() calls in ONE frame
    the map has                     :  9,216 cells

FIVE POINT ONE LOOKUPS PER CELL, PER FRAME. And the tell is what happens when you pan far
away: the count falls to 9,217, exactly one per cell. So the extra four are paid ONLY for
cells that are actually VISIBLE -- it is the per-visible-cell work (the overpass/grade
logic and its neighbour probes) asking the world the same question over and over.

WHY IT IS SAFE TO COLLAPSE, and this is the whole argument: WITHIN A SINGLE FRAME THE MAP
CANNOT CHANGE. render() is read-only over the world; nothing mutates a district while it is
being painted. So the second, third, fourth and fifth answer for a cell are guaranteed
identical to the first, and a cache that lives exactly one frame cannot go stale.

THIS IS NOT THE VISTA MEMO AND NOT THE EDIT-SEAM GUARD, and the difference matters:
  - the vista memo lasts FOREVER, safe because mountains do not move;
  - the edit-seam guard caches NOTHING, because an edit is the one thing that changes
    under him and caching it ships a builder where his change never appears;
  - this lasts ONE FRAME, which is the only window in which the world is provably frozen.
Three different lifetimes, each argued from what can actually change. A cache whose lifetime
is chosen by vibes is how a builder starts lying.

THE KEY IS NUMERIC, NOT A STRING. The seam it sits on top of already taught this lesson
(9,216 string allocations a frame for an empty table, fixed 8/17): `x*1024+y` is an integer
for any 96x96 map, so the fast path allocates nothing at all.

WHAT THIS DOES NOT DO: it does not reduce DRAWING. The city view is draw-bound and profiling
said so plainly -- drawImage, canvas save/restore and rasterisation are the bulk. This
removes redundant WORLD QUERIES, which is the part that was never necessary. The remaining
job (bake the static layer once, blit it during a pan) is still a real refactor and is still
not started.

REUSE CHECK: cooks no pixels, opens no bank, adds no table.

  python3 tools/bohemia_city_framecache_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

# The seam installed by CBinstall, as it stands after the 8/17 empty-table guard.
OLD = """  o.at=function(x,y){ const t=raw(x,y); if(!t)return t;
    const cells=EDITS.cells;
    if(!cells) return t;
    for(var _k in cells){ /* any row at all? then do the real lookup */
      const d=cells[x+','+y];
      return (d&&d!==t.district)?Object.assign({},t,{district:d}):t;
    }
    return t; };"""

NEW = """  /* __FRAME_CACHE__ -- FIVE LOOKUPS PER CELL PER FRAME, measured: 46,859 om.at() calls
     for a 9,216-cell map with the whole valley on screen. Pan far away and it falls to
     9,217 -- exactly one per cell -- so the extra four are paid only for cells that are
     VISIBLE: the overpass/grade logic and its neighbour probes asking the world the same
     question over and over while painting one frame.
     SAFE FOR EXACTLY ONE REASON: WITHIN A SINGLE FRAME THE MAP CANNOT CHANGE. render() is
     read-only over the world, so answers two through five are identical to the first by
     construction, and a cache that dies at the end of the frame cannot go stale.
     THREE CACHES NOW LIVE ON THIS PATH AND THEY HAVE THREE DIFFERENT LIFETIMES, each
     argued from what can actually change: the vista memo lasts FOREVER (mountains do not
     move), the edit-seam guard caches NOTHING (an edit is the one thing that changes under
     him), and this lasts ONE FRAME. A cache whose lifetime is chosen by vibes is how a
     builder starts lying to the person building.
     NUMERIC KEY, because this very seam taught that lesson: x*1024+y is an integer for any
     96x96 map, so the hot path allocates nothing. */
  o.__fcFrame=-1; o.__fc=new Map();
  o.at=function(x,y){
    const fk=(x<<10)+y;
    if(o.__fcFrame===CITY_FRAME){ const hit=o.__fc.get(fk); if(hit!==undefined) return hit; }
    else { o.__fcFrame=CITY_FRAME; o.__fc.clear(); }
    const t=raw(x,y);
    let out=t;
    if(t){
      const cells=EDITS.cells;
      if(cells){
        for(var _k in cells){ /* any row at all? then do the real lookup */
          const d=cells[x+','+y];
          out=(d&&d!==t.district)?Object.assign({},t,{district:d}):t;
          break;
        }
      }
    }
    o.__fc.set(fk,out);
    return out; };"""

# The frame counter has to be bumped once per render, before anything reads the world.
TICK_OLD = "function renderCity(){\n  const N=om.n;"
TICK_NEW = ("function renderCity(){\n"
            "  CITY_FRAME++;            /* __FRAME_CACHE__ -- one frame, one world snapshot */\n"
            "  const N=om.n;")

DECL_OLD = "CBinstall(om);"
DECL_NEW = ("let CITY_FRAME=0;          /* __FRAME_CACHE__ -- bumped once per city render */\n"
            "CBinstall(om);")

if not os.path.exists(WORLD):
    sys.exit('FRAME CACHE: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

if '__FRAME_CACHE__' in src:
    print('FRAME CACHE: already applied.')
    sys.exit(0)

for name, old, new in (('the frame counter', DECL_OLD, DECL_NEW),
                       ('the per-frame tick', TICK_OLD, TICK_NEW),
                       ('the edit seam', OLD, NEW)):
    if old not in src:
        sys.exit('FRAME CACHE: could not find %s. Refusing to guess -- this sits on the ONE '
                 'seam every zoom level reads, and a wrong edit makes his builder lie at '
                 'some zooms and not others.' % name)
    src = src.replace(old, new, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('FRAME CACHE: applied to %s' % WORLD)
print('    measured before: 46,859 world lookups in one frame for a 9,216-cell map')
