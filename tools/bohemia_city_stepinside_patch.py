#!/usr/bin/env python3
"""
YOU WALK IN, YOU DO NOT STAND IN THE DOORWAY (8/3/26).

Paolo: "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT."

The 8/2 record answered this by flood-filling `inPassable` from the landing cell and
concluding movement was not restricted. That was the wrong instrument. A flood fill
says which cells are reachable IN PRINCIPLE; it never presses a direction. Driving the
real mover says something else entirely.

MEASURED ON THE SHIPPED BUILD, entering real houses through real doors:

    you land on:            the DOOR cell itself, every time
    what works there:       N, NE, NW
    what is BLOCKED:        E, SE, S, SW, W
    houses where you can
    turn left or right
    the moment you enter:   0 of 6
    ... one cell further in: 6 of 6

He is standing IN THE OPENING with the wall on both sides of him. Left and right are
walls, because a doorway has jambs. Press left, nothing happens. Press right, nothing
happens. That is not a movement bug and it is not a camera bug, and both of those were
looked at first -- it is WHERE THE BODY LANDS.

WHAT THIS DOES: crossing a threshold puts you THROUGH it. On entry the body steps one
cell inward off the door, along the edge's own inward normal, if that cell is walkable.
Nothing else changes: the door cell is one step back the way you came, so leaving works
exactly as it did, and the exit rule (you may only step off the plate FROM the door
cell) is untouched.

DELIBERATELY ONE CELL. Not "walk in until you can turn" -- if a house puts you in a
one-wide hall, that hall is real architecture and walking down it is the correct thing
to do. One cell is the threshold, and the threshold is the whole defect.

NOT FIXED HERE, and named so it is not mistaken for fixed: the working district has
only 6 door cells at all (records/BOHEMIA_BUILDINGS_HAVE_NO_DOORS_8_2_26.md). That is
a separate, bigger item on his list.

REUSE CHECK: cooks no graphic pixels of any kind. This is movement plumbing; it opens
no bank because there is nothing to draw.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__STEP_INSIDE__'

ANCHOR = """  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};"""

FUNC = """/* """ + MARKER + """ -- YOU WALK IN, YOU DO NOT STAND IN THE DOORWAY (Paolo:
   "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT").
   Measured by driving the real mover, not by flood-filling the passability test: the
   body landed ON the door cell every time, where N/NE/NW work and E/SE/S/SW/W are all
   wall, because a doorway has jambs either side. Houses where you could turn left or
   right the moment you entered: 0 of 6. One cell further in: 6 of 6.
   So crossing a threshold now puts you THROUGH it. One cell, along the edge's own
   inward normal, only if that cell is walkable. The door is one step back the way you
   came, so leaving is unchanged and the exit rule (you may only step off the plate FROM
   the door cell) is untouched. ONE cell and not "until you can turn": a one-wide hall
   is real architecture, and walking down it is the right thing to do. */
function inStepInside(){
  if(!INSIDE||!INSIDE.fp||!INSIDE.door) return false;
  const fp=INSIDE.fp, d=INSIDE.door;
  let dx=0,dy=0;
  if(d[1]===0)dy=1; else if(d[1]===fp.H-1)dy=-1;
  else if(d[0]===0)dx=1; else if(d[0]===fp.W-1)dx=-1;
  else return false;                                  /* not on an edge: nothing to cross */
  const nx=d[0]+dx, ny=d[1]+dy;
  if(!inPassable(nx,ny)) return false;                /* a blocked threshold stays put */
  INSIDE.ix=nx; INSIDE.iy=ny;
  window.__STEPPED_INSIDE=(window.__STEPPED_INSIDE||0)+1;
  return true;
}
"""

CALL = """
  /* """ + MARKER + """ -- through the threshold, not stood in it. */
  inStepInside();"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: you already walk through the doorway'); return 0
    if city.count(ANCHOR) != 1:
        print('FAIL: the interior entry is not where this tool expects it'); return 1
    if 'function inEnter(' not in city or 'function inPassable(' not in city:
        print('FAIL: inEnter/inPassable missing'); return 1

    city = city.replace('function inEnter(', FUNC + 'function inEnter(', 1)
    city = city.replace(ANCHOR, ANCHOR + CALL, 1)
    for nm in ('function inStepInside(', '\n  inStepInside();'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm.strip(), city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  walking into a house now puts you THROUGH the doorway, not in it')
    print('  left and right work the moment you are inside')
    return 0


if __name__ == '__main__':
    sys.exit(main())
