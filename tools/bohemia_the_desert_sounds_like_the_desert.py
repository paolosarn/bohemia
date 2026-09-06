#!/usr/bin/env python3
"""
THE DESERT SOUNDS LIKE THE DESERT (9/5/26, SOUNDS lane) - THE-OTHER-51, round 2.

ROUND 1 REPLACED THE ROW'S GREP WITH A MEASUREMENT: the walked surface produces
nine of his sixty-five approved sounds. Round 2 takes the measurement's sharpest
finding and fixes it.

MEASURED, by walking onto real cells with the game's own stepOnce, four of the
six approved footstep surfaces fire end to end:

    step_dirt      OK, one cell away
    step_asphalt   OK, seven cells away
    step_concrete  OK, seven cells away
    step_gravel    OK, forty-two cells away
    step_sand      NOT FOUND within sixty cells
    step_wood      NOT FOUND within sixty cells

Then across 18 DISTRICTS and about 9,000 sampled cells, the whole valley
produces exactly FOUR surfaces: dirt, concrete, asphalt, gravel. **There is no
sand and no wood anywhere in it.**

*** AND THE DESERT REPORTS DIRT. *** Sampled inside the `desert` district
itself: 76 dirt, 3 asphalt, 1 concrete, and no sand at all. In a game whose
valley is the Mojave, walking out into the desert plays the same footstep as a
suburban lawn -- and `step_sand`, approved on 8/12, is labelled in the engine's
own table FOOTSTEP -- DEEP SAND.

WHY IT HAPPENS, and it is my own fix from this morning: the ground classifier
now reads `gArtPool`, and the pool table's else-branch sends everything that is
not a road, a walk or water to `hyard` -- the yard pool. That is correct for a
suburban yard and it is also what the desert floor gets, because the desert has
no pool of its own. One pool, two completely different grounds.

THE FIX IS THE ONE FACT THE POOL CANNOT CARRY: WHICH DISTRICT YOU ARE IN. The
step site already knows the cell; the district is one overmap lookup away, and
every other system in that file reads it the same way. So __surfaceOf takes the
district as well, and the default ground of a DESERT or a WASH is sand.

DELIBERATELY ONLY THOSE TWO. Not `basin`, which is a dry lake bed and really is
silt; not `boneyard`, which is a junkyard sitting on graded ground; not
`mountain`, which is rock. Two districts whose ground is unambiguously sand in
this valley, and REALISM FIRST decides it rather than taste. A road through the
desert is still asphalt and a sidewalk is still concrete, because the pool
answers first and only the fall-through changes.

*** AND step_wood GETS A WRITTEN REASON, NOT AN INVENTED CALLER. *** There is no
wooden ground in this valley: no boardwalk, no porch deck, no floorboard pool,
measured across eighteen districts. Wiring it would mean inventing a surface so
a sound has somewhere to play, which is the opposite of this row's job. It stays
approved, judgeable, and named as unreachable with the measurement behind it.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new event. It
routes to `step_sand`, approved 1 of 5 in his 270-thumb sweep on 8/12 and never
once played, through the classifier and the message that already exist.

  python3 tools/bohemia_the_desert_sounds_like_the_desert.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_DESERT_SOUNDS_LIKE_THE_DESERT__'

STEP_ANCHOR = ("        window.parent.postMessage({type:'BOHEMIA_STEP',"
               "surface:__surfaceOf(c)},'*'); }catch(_e){}")
STEP_REPLACE = (
    "        window.parent.postMessage({type:'BOHEMIA_STEP',"
    "surface:__surfaceOf(c,__districtAt(nx,ny))},'*'); }catch(_e){}")

DISTRICT_FN = """
/* __THE_DESERT_SOUNDS_LIKE_THE_DESERT__ -- WHICH DISTRICT A CELL IS IN. One
   overmap lookup, read exactly the way every other system in this file reads
   it. It exists because a POOL cannot tell a suburban yard from the desert
   floor: the pool table's else-branch sends both to `hyard`, so the Mojave
   played the lawn's footstep. */
function __districtAt(gx,gy){
  try{ var t=om.at(Math.floor(gx/FN),Math.floor(gy/FN)); return t?t.district:null; }
  catch(_e){ return null; }
}
"""

SURF_ANCHOR = "function __surfaceOf(c){"
SURF_REPLACE = """function __surfaceOf(c,district){
  /* __THE_DESERT_SOUNDS_LIKE_THE_DESERT__ -- THE GROUND OF A DESERT IS SAND.
     MEASURED across 18 districts and ~9,000 cells: the whole valley produced
     exactly four surfaces -- dirt, concrete, asphalt, gravel -- and inside the
     `desert` district itself, 76 dirt and NO SAND. step_sand is approved (8/12)
     and labelled "FOOTSTEP -- DEEP SAND" in the engine's own table, and it had
     never once played, because the pool table's else-branch sends every ground
     that is not a road, a walk or water to `hyard`, the YARD pool. That is
     right for a suburban lawn and wrong for the Mojave, and a pool cannot tell
     them apart. The district can.
     ONLY DESERT AND WASH, on purpose. Not `basin`, which is a dry lake bed and
     really is silt; not `boneyard`, a junkyard on graded ground; not
     `mountain`, which is rock. Two districts whose floor is unambiguously sand
     in this valley -- REALISM FIRST, not taste.
     AND IT IS A FALL-THROUGH, NOT AN OVERRIDE: the pool still answers first, so
     a road through the desert is asphalt and its sidewalk is concrete, exactly
     as before. Only the ground nobody named changes. */
  var __d = (district || '') + '';
  var __sandy = (__d === 'desert' || __d === 'wash');
  var __pool0 = (c && (c.markPool ? 'street' : c.gArtPool)) || '';
  if (__sandy && (!__pool0 || __pool0 === 'hyard')) return 'sand';
"""


def main():
    print('=== THE DESERT SOUNDS LIKE THE DESERT ===')
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor in (('the step site', STEP_ANCHOR),
                         ('the classifier', SURF_ANCHOR)):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)' % (what, src.count(anchor)))
            return 1

    src = src.replace(STEP_ANCHOR, STEP_REPLACE, 1)
    print('  WIRED  the step tells the classifier which district it is in')
    src = src.replace(SURF_ANCHOR, DISTRICT_FN + SURF_REPLACE, 1)
    print('  WIRED  the default ground of a desert or a wash is sand')

    open(CITY, 'w', encoding='utf8').write(src)
    print('  step_sand was approved on 8/12 and had never once played.')
    print('  NOT WIRED, with a reason: step_wood. There is no wooden ground in '
          'this valley -- no boardwalk, no porch deck, no floorboard pool, '
          'measured across eighteen districts. Wiring it would mean inventing a '
          'surface so a sound has somewhere to play.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
