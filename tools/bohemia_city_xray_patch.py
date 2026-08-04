#!/usr/bin/env python3
"""
THE BUILDING GOES SEE-THROUGH (8/3/26).

Paolo, ruling: "Ofcourse the building should become see through to reflect characters
items or the player or doors."

WHY IT NEVER HAPPENED, MEASURED FIRST (law clause 1b, in the district he spawns in):

    spawn district              suburb
    facade cells                312
    walkable cells 1-2 north
    of ANY of those facades     0

The fade code was already correct:
    if(front && pbox && <wall box overlaps player box>) a=WALL_SEE;
and it has been seen fading. It simply could never trigger. A wall draws UPWARD, so the
only cells it can cover are the ones NORTH of it, and `c.face` is set only when the cell
BELOW is not solid -- which makes every facade a building's SOUTH wall, whose north side
is always the building's own body. Two correct facts composing into a feature with
nowhere to stand.

WHAT THIS DOES: keeps that exact rule (a wall covering him still fades, and that is the
one that matters the moment interiors are one world) and adds the case his ruling
actually describes -- A BUILDING NEAR HIM GOES SEE-THROUGH. Walk up to a house and its
wall turns to glass so you can see the door, the frame, and what is behind it, which is
his sentence verbatim: "to reflect characters items or the player or doors".

WHY A HALO AND NOT "ALWAYS": a wall that is always transparent is not a wall, and the
7/17 comment on this very line is right that the world must not shimmer while he walks.
The halo is 2 cells wide, so exactly the building he is standing at goes clear and
nothing else in the street moves.

WHY NOT MASS OCCLUSION INSTEAD: a mass's top is a flat roof baked into the chunk canvas
and drawn BEFORE the body, so a building cannot hide him today. Making masses occlude is
a real feature with its own look, and it is a design call, not plumbing. Named in
records/BOHEMIA_THE_SEE_THROUGH_CANNOT_FIRE_IN_THE_SUBURB_8_3_26.md rather than guessed.

REUSE CHECK: cooks no graphic pixels and embeds no new bytes. It reuses WALL_SEE, the
alpha constant already in the renderer.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__XRAY_NEAR__'

ANCHOR = """      let a=1;
      if(front&&pbox&&dx<pbox.x1&&dx+C>pbox.x0&&top<pbox.y1&&dy+C>pbox.y0)a=WALL_SEE;
      g.globalAlpha=a;"""

NEW = """      let a=1;
      if(front&&pbox&&dx<pbox.x1&&dx+C>pbox.x0&&top<pbox.y1&&dy+C>pbox.y0)a=WALL_SEE;
      /* """ + MARKER + """ (Paolo 8/3, ruling: "Ofcourse the building should become
         see through to reflect characters items or the player or doors").
         The rule above is correct and COULD NOT FIRE. Measured in the district he
         spawns in: 312 facade cells and ZERO walkable cells 1-2 north of any of them.
         A wall draws UPWARD so it can only cover cells NORTH of it, and c.face is set
         only when the cell BELOW is not solid -- so every facade is a building's SOUTH
         wall and its north side is always the building's own body. Nowhere to stand.
         So the covering rule STAYS (it is the one that matters the second interiors are
         one world) and this adds the case he described: a building NEAR him goes
         see-through, so walking up to a house turns its wall to glass and the door, the
         frame and what is behind it read through it.
         A HALO, not "always": a wall that is always transparent is not a wall, and the
         7/17 note above is right that the world must not shimmer while he walks. Two
         cells, so the building he is standing at goes clear and the street does not. */
      if(a===1&&Math.abs(gx-hx)<=XRAY_R&&Math.abs(gy-hy)<=XRAY_R){
        a=WALL_SEE;
        if(typeof window!=='undefined') window.__XRAY_WALLS=(window.__XRAY_WALLS||0)+1;
      }
      g.globalAlpha=a;"""

CONST_ANCHOR = """const WALL_SEE=0.35;            /* how much of a wall is left when it is hiding you */"""
CONST_NEW = """const WALL_SEE=0.35;            /* how much of a wall is left when it is hiding you */
const XRAY_R=2;                 /* __XRAY_NEAR__ radius in cells: how close you stand before a building turns to glass */"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: buildings already go see-through near him'); return 0
    if city.count(ANCHOR) != 1:
        print('FAIL: the see-through test is not where this tool expects it (%d)'
              % city.count(ANCHOR)); return 1
    if city.count(CONST_ANCHOR) != 1:
        print('FAIL: WALL_SEE is not where this tool expects it'); return 1

    city = city.replace(CONST_ANCHOR, CONST_NEW, 1)
    city = city.replace(ANCHOR, NEW, 1)
    for nm in ('const XRAY_R=2;', 'window.__XRAY_WALLS=(window.__XRAY_WALLS||0)+1;'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  walk up to a building and its wall turns to glass (radius %s cells)' % 2)
    return 0


if __name__ == '__main__':
    sys.exit(main())
