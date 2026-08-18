#!/usr/bin/env python3
"""
NINE THOUSAND STRING KEYS A FRAME FOR AN EMPTY TABLE (8/17, WORLD lane).

PROFILED on the CITY BUILDER -- the view he BUILDS in, and the worst remaining frame cost
in the game at 34-57 ms per redraw (2-3.5 frames at 60 Hz) while walking is now 0.6 ms.

The city profile has NO single hot spot the way walking did: the time is genuinely spread
across drawImage, canvas save/restore, lineTo and browser rasterisation. IT IS DRAW-BOUND,
and there is no free 20x hiding in it -- that is worth saying plainly, because the last win
was so large it would be easy to promise another.

BUT ONE ENTRY IS NOT DRAWING AT ALL: `CBinstall.o.at` at 6.3%.

WHAT IT IS. The city builder lets him repaint a district, and CBinstall wraps the overmap's
`at()` so an edit is true at every zoom with no second copy of the world -- a good design.
The wrapper does this, for every cell:

    const d = EDITS.cells && EDITS.cells[x+','+y];

`x+','+y` ALLOCATES A STRING. The city overview reads every one of the 9,216 cells of the
96x96 map every frame, so that is NINE THOUSAND STRING ALLOCATIONS PER FRAME, fed to a
lookup, plus the garbage they make (the profile shows the collector at 2.1%).

AND IN THE DEMO IT IS ALL FOR NOTHING. `EDITS.cells` is EMPTY until he paints something.
Every one of those nine thousand keys is built to look up a table that has no rows in it.
A NEW PLAYER PAYS THE FULL COST OF A FEATURE THEY HAVE NOT USED YET.

THE FIX IS A FAST PATH, and it is exact rather than approximate: if the table has no keys,
there is nothing an edit could change, so return the raw tile immediately. The moment he
paints one cell the wrapper behaves exactly as before -- same lookup, same Object.assign,
same result. Nothing is cached, nothing goes stale, and correctness does not depend on my
judgement about when it is "safe" to skip.

WHY NOT MEMOISE THE KEY: because the answer must stay live. The vista memo works because
mountains do not move; an EDIT is the one thing in this system that DOES change under him,
and caching it is how you ship a builder where the change does not appear.

REUSE CHECK: cooks no pixels, opens no bank, adds no table. One guard on an existing seam.

  python3 tools/bohemia_city_editseam_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

OLD = ("  o.at=function(x,y){ const t=raw(x,y); if(!t)return t;\n"
       "    const d=EDITS.cells&&EDITS.cells[x+','+y];\n"
       "    return (d&&d!==t.district)?Object.assign({},t,{district:d}):t; };")

NEW = ("""  /* __EDIT_SEAM_FAST__ -- 9,216 string keys a frame for a table with no rows in it.
     PROFILED at 6.3% of city-builder frame time. The city overview reads EVERY cell of the
     96x96 map every frame, and this line allocated `x+','+y` for each one before looking it
     up -- nine thousand strings per frame, plus the garbage (collector at 2.1%).
     IN THE DEMO IT IS ALL FOR NOTHING: EDITS.cells is EMPTY until he paints something, so a
     NEW PLAYER PAYS THE FULL COST OF A FEATURE THEY HAVE NOT USED YET.
     The guard is EXACT, not approximate: no keys means no edit can apply, so the raw tile
     IS the answer. The instant he paints one cell this behaves exactly as it did before --
     same lookup, same Object.assign, same result.
     AND IT IS NOT A CACHE ON PURPOSE. The vista memo is safe because mountains do not move;
     an EDIT is the one thing here that DOES change under him, and caching it is how you
     ship a builder where his change does not show up. */
  o.at=function(x,y){ const t=raw(x,y); if(!t)return t;
    const cells=EDITS.cells;
    if(!cells) return t;
    for(var _k in cells){ /* any row at all? then do the real lookup */
      const d=cells[x+','+y];
      return (d&&d!==t.district)?Object.assign({},t,{district:d}):t;
    }
    return t; };""")

if not os.path.exists(WORLD):
    sys.exit('EDIT SEAM: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

if '__EDIT_SEAM_FAST__' in src:
    print('EDIT SEAM: already applied.')
    sys.exit(0)
if OLD not in src:
    sys.exit('EDIT SEAM: could not find the edit seam to guard. Refusing to guess -- this '
             'is the ONE seam every zoom level reads, and a wrong edit here makes his '
             'builder lie at some zooms and not others.')

src = src.replace(OLD, NEW, 1)
open(WORLD, 'w', encoding='utf-8').write(src)
print('EDIT SEAM: fast path added in %s' % WORLD)
print('    profiled at 6.3% of city-builder frame time, all of it for an empty table')
