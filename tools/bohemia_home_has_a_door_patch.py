#!/usr/bin/env python3
"""
THE HOUSE THE DEMO CALLS HOME REPORTED THAT IT HAS NO FRONT DOOR
(8/25/26, RUN lane. Same bug as 8/2, in the one place the 8/2 fix was not applied.)

FOUND BY MEASURING THE DEMO RATHER THAN READING IT. Playing day one and asking the
world what is around the spawn:

    district        suburb                at 6205,6271
    enterable cells 3744 within 90 cells
    real door cells 35
    nearest door    15 cells (a garage)
    nearest house   30 cells
    HIS HOME        15 cells away ... and  door: null
    standing on     dark ground (so entering anything finishes day one)

The world is full of doors. The house the game labels HOME says it has none.

=== WHY, AND IT IS TWO PREDICATES DISAGREEING ABOUT THE SAME WORD =============

The city has ONE door test, and everything that decides how you get into a
building uses it:

    function isDoorCell(c){
      return !!(c && (c.artPool_face==='hdoor' || (c.portal&&c.enter)
                      || c.doorW || c.doorE));
    }

homeFind uses a different one -- the FIRST of those four:

    if(c&&c.artPool_face==='hdoor')door=[x,y];

So a house whose front door is a doorW or a doorE has a door by every rule in the
game except the one that decides where he lives.

*** AND THIS EXACT BUG WAS ALREADY FOUND AND FIXED ON 8/2, IN A DIFFERENT PLACE.
*** The note is still sitting in stepOnce, in the file, in these words:

    __A_DOOR_IS_A_DOOR__ -- the SAME predicate massHasDoor counted with. This read
    `c.artPool_face==='hdoor'||c.portal` while the guard also counted doorW/doorE,
    so every house whose door is a doorW/doorE was sealed by its own door.

That fix went into the movement path. homeFind was never visited, so the narrow
test survived in the one function that answers "where do you live". A predicate
copied by hand into a second place is a predicate that will drift, and the repair
is not to fix the copy -- it is to delete the copy and call the function.

=== WHAT IT ACTUALLY COSTS HIM ===============================================

  - homeDoorstep() cannot use the door, so it falls back to "any walkable
    neighbour of the footprint". WAKING UP AT YOUR OWN FRONT DOOR is the whole
    point of that function and the answer to his 8/11 complaint ("how was this a
    run when my house isn't labeled"); with door null he wakes at whichever side
    of the house the scan happens to reach first.
  - Anything later that wants to point at his door -- and the HOME arrow shipped
    yesterday is exactly that shape -- is pointing at a null.

NOT CHANGED, deliberately: which house is his (that rule is settled and is not
mine to move), the footprint, or the art. This swaps a hand-copied predicate for
the shared one. If a house genuinely has no door cell, door stays null and the
existing fallback still runs -- that is a real state, and the 8/2 note is explicit
that a doorless building is enterable from any wall.

REUSE CHECK: no graphic pixels cooked -- this calls an existing predicate, so no
banks/ lookup applies.

Idempotent (marker __HOME_DOOR_IS_A_DOOR__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__HOME_DOOR_IS_A_DOOR__'

OLD = """    if(c&&c.artPool_face==='hdoor')door=[x,y];"""

NEW = """    /* """ + MARK + """ (8/25). This read `c.artPool_face==='hdoor'` -- the
       FIRST of the four things isDoorCell counts -- so a house whose front door
       is a doorW or doorE reported having no door at all. MEASURED on the demo
       spawn: 35 real door cells within 90 cells of him, and HIS OWN HOUSE came
       back door:null.
       THE SAME BUG WAS FIXED ON 8/2 IN stepOnce AND ITS NOTE IS STILL IN THIS
       FILE -- "__A_DOOR_IS_A_DOOR__ ... every house whose door is a doorW/doorE
       was sealed by its own door." That repair never reached here, because a
       predicate copied by hand into a second place drifts from the first. So
       this does not fix the copy, it deletes the copy and asks the one function
       everything else asks. */
    if(isDoorCell(c))door=[x,y];"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: home already asks the shared door predicate')
        return
    if 'function isDoorCell(' not in s:
        sys.exit('FAIL: isDoorCell is missing -- this is supposed to CALL the '
                 'shared predicate, not grow a third one')
    n = s.count(OLD)
    if n != 1:
        sys.exit('FAIL: homeFind door anchor matched %d times, expected 1' % n)
    open(CITY, 'w', encoding='utf8').write(s.replace(OLD, NEW, 1))
    print('PATCHED %s -- his front door is found by the same rule every other '
          'door in the game is found by' % CITY)


if __name__ == '__main__':
    main()
