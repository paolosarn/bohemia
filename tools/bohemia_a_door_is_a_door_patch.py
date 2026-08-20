#!/usr/bin/env python3
"""
HIS OWN FRONT DOOR WAS NOT A DOOR (8/19/26, RUN lane).

FOUND BY DRIVING THE LAST UNPROVEN STRETCH of the first-night audit: taking the
job by TAPPING it in the phone (it works -- objective "Find why the block browns
out" arrives, badge clears, quest reaches stage 10) and then WALKING INTO THE
BUILDING. The demo gate has always called dayEnteredBuilding() directly, so
nobody had ever walked a body through a door.

MEASURED IN A 129x129 SWEEP AROUND WHERE THE PLAYER SPAWNS:

    2,334 cells belong to enterable buildings
        2 of them can actually be walked into
       63 cells to the nearest one

He wakes up in a neighbourhood of sealed houses.

WHY, AND IT IS A DISAGREEMENT BETWEEN TWO TESTS THAT ARE MEANT TO BE THE SAME.
Paolo's 8/2 rule ("WHY IS IT WHEN I'M IN THE OUTSIDE OF A BUILDING I CAN ENTER IT
FROM JUST WALKING TO ANY WALL") is implemented in two halves:

    massHasDoor()  counts FOUR markers:  hdoor, portal+enter, doorW, doorE
    the walk       admits through TWO:   hdoor, portal

So a house whose door is expressed as doorW/doorE makes massHasDoor say "this
building HAS a door", which flips the walk into its strict branch -- "it has a
door and this is not it: a wall, and a wall stops you" -- and then NOTHING ever
satisfies the strict test, because the walk cannot see the marker the guard just
counted. THE GUARD LOCKS THE DOOR AND THROWS AWAY THE KEY.

Counted around spawn: 2 hdoor, 0 portals, 9 doorW, 9 doorE. So eighteen real
doors are refused and two are honoured.

AND THE NEAREST REFUSED DOOR IS HIS OWN. It is at (6219,6256), which is exactly
HOME -- the house this lane spent yesterday putting back in the cell he wakes up
in. He can stand in his own front yard, twenty-nine cells from a door the world
model knows is a door, and the game will not let him in.

THE 8/2 COMMENT PREDICTED THIS EXACT OUTCOME and its safety net was supposed to
prevent it: "A BUILDING THAT HAS NO DOOR IS UNCHANGED ... Deleting this branch
outright seals almost every building in the valley -- worse than the bug." The
net is `else if(inEnter(...))`, reached only when massHasDoor is FALSE. Measured:
massHasDoor was TRUE for all 2,334 cells, so the net has never once fired. It is
dead code, and the thing it was written to prevent happened anyway.

THE FIX IS ONE SOURCE OF TRUTH, NOT A THIRD LIST. What counts as a door is now a
single predicate that both halves call, so the guard and the test can never
disagree again -- and a lane that adds a fifth door marker changes one line
instead of discovering this a month later. Same disease and same cure as the
postMessage guard (8/15), the save snapshot (8/15) and the publish resolver: A
VALUE COPIED BY HAND WHERE A VALUE COULD BE DERIVED.

WHAT THIS DOES NOT DO: it does not open walls. The 8/2 rule is untouched and
still absolute -- a building with a door can only be entered through its door.
This only makes the walk recognise the doors the world model already has.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It adds no marker and paints no door; it makes one
existing test read the same four flags the other one already read.

Gate: gates/first_night_gate.js walks him to his own front door and inside.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_DOOR_IS_A_DOOR__'

# ---- 1. one predicate, defined next to the guard that already knew the rule --
OLD_GUARD = """function massHasDoor(gx,gy){
  const f=inFootprint(gx,gy); if(!f)return false;
  const k=f.x+','+f.y+','+f.w+','+f.h;
  const hit=MASSDOOR.get(k); if(hit!==undefined)return hit;
  let has=false;
  for(let y=f.y;y<f.y+f.h&&!has;y++)for(let x=f.x;x<f.x+f.w;x++){
    const c=cellAt(x,y); if(!c)continue;
    if(c.artPool_face==='hdoor'||(c.portal&&c.enter)||c.doorW||c.doorE){ has=true; break; }
  }
  MASSDOOR.set(k,has); return has;
}"""

NEW_GUARD = """/* """ + MARK + """ -- WHAT COUNTS AS A DOOR, IN ONE PLACE.
   THE BUG THIS KILLS: massHasDoor counted FOUR markers (hdoor, portal+enter,
   doorW, doorE) and the walk's admission test honoured TWO (hdoor, portal). So a
   house whose door is a doorW/doorE made the guard say "this building HAS a
   door", which flips the walk into its strict branch -- and then nothing could
   satisfy the strict test, because the walk could not see the marker the guard
   had just counted. THE GUARD LOCKED THE DOOR AND THREW AWAY THE KEY.
   MEASURED 8/19 in a 129x129 sweep around the spawn: 2,334 cells belong to
   enterable buildings and TWO could be walked into. Counted by marker: 2 hdoor,
   0 portals, 9 doorW, 9 doorE -- eighteen real doors refused. The nearest
   refused one is at (6219,6256), which is HIS OWN HOUSE.
   The 8/2 comment's safety net ("A BUILDING THAT HAS NO DOOR IS UNCHANGED") is
   reached only when this returns false, and it never returned false, so the net
   was dead code and the sealing it was written to prevent happened anyway.
   THE 8/2 RULE IS UNTOUCHED: a building with a door is still enterable ONLY
   through its door. This just lets the walk recognise the doors the world model
   already has, and a fifth marker is now one line instead of a month. */
function isDoorCell(c){
  return !!(c && (c.artPool_face==='hdoor' || (c.portal&&c.enter) || c.doorW || c.doorE));
}
function massHasDoor(gx,gy){
  const f=inFootprint(gx,gy); if(!f)return false;
  const k=f.x+','+f.y+','+f.w+','+f.h;
  const hit=MASSDOOR.get(k); if(hit!==undefined)return hit;
  let has=false;
  for(let y=f.y;y<f.y+f.h&&!has;y++)for(let x=f.x;x<f.x+f.w;x++){
    const c=cellAt(x,y); if(!c)continue;
    if(isDoorCell(c)){ has=true; break; }
  }
  MASSDOOR.set(k,has); return has;
}"""

# ---- 2. the walk admits through exactly what the guard counted --------------
OLD_WALK = """          if(c.artPool_face==='hdoor'||c.portal){
            if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
          }"""

NEW_WALK = """          /* """ + MARK + """ -- the SAME predicate massHasDoor counted with.
             This read `c.artPool_face==='hdoor'||c.portal` while the guard also
             counted doorW/doorE, so every house whose door is a doorW/doorE was
             sealed by its own door. */
          if(isDoorCell(c)){
            if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; }
          }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('massHasDoor', OLD_GUARD, NEW_GUARD),
                           ('the walk admission', OLD_WALK, NEW_WALK)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
