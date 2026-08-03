#!/usr/bin/env python3
"""
EVERY BUILDING GETS A DOOR (8/3/26).

Paolo: "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST WALKING
TO ANY WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING."

The 8/2 pass shipped the SAFE HALF of this: a mass WITH a door can only be entered
through its door, and a mass with NO door was left alone so nothing got sealed shut.
That was the right call at the time and it is why the valley still works. But measured
on the real surface today, across three district types:

    suburb       42 masses    8 with a door    34 WITH NO DOOR
    commercial   22 masses    0 with a door    22 WITH NO DOOR
    farm         10 masses    0 with a door    10 WITH NO DOOR
    ------------------------------------------------------------
    TOTAL        74 masses    8 with a door    66 WITH NO DOOR   = 89%

So the rule covered 11% of buildings and he can still walk through the wall of the
other 89%. The blocker was never the rule. It is that BUILDINGS HAVE NO DOORS.

WHY THEY HAVE NONE. The generic district path never places one. Its own comment says
so on purpose (7/27): "never hash a door onto a wall here. Every kit dossier already
DECLARES its doors as `portal` tiles you step through; a painted door on a random wall
is a door that lies." That reasoning is sound and the conclusion held only if every
mass actually has a portal. Most do not.

THE RULE, and it is the suburb's own rule generalised. The suburb already solved this
correctly: "A house has ONE front door and the plot already knew where -- door where
the house meets its driveway or its street, ONE per approach (only the leftmost tile of
a run takes it)." Nothing about that is suburb-specific. Generalised:

    A DOOR GOES WHERE THE BUILDING MEETS GROUND A PERSON CAN STAND ON,
    one per contiguous run of that frontage, and nowhere else.

That is not a dice roll and it is not a layout decision. The generator already placed
the mass and already placed the ground; this reads what is there. Every door it makes
is reachable by construction, because the cell it faces is walkable.

A MASS WITH NO WALKABLE FRONTAGE AT ALL still gets no door, and the 8/2 rule still
leaves those alone rather than sealing them. That residual is honest and it is
reported by the gate rather than hidden.

REUSE CHECK: cooks no graphic pixels. It selects the EXISTING 'hdoor' art pool for
cells that already draw from the wall/window/boarded pools. No bank is opened because
nothing is drawn.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARKER = '__EVERY_BUILDING_HAS_A_DOOR__'

ANCHOR = """        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=pick<14?'hwall':(pick<19?'hwindow':'hboarded');
      }"""

NEW = """        /* """ + MARKER + """ (Paolo 8/3, on "WY IS IT WHEN IM IN THE OUTSIDE
           OF A BUILDING I CAN ENTER IT FROM JUST WALKING TO ANY WALL").
           The 7/27 clause above is right that a door must never be a DICE ROLL. It was
           wrong that the portals are enough: measured on the real surface, 66 of 74
           masses across suburb/commercial/farm have NO door of any kind, so the 8/2
           "a door is the way in" rule could only cover 11% of buildings and he walks
           through the wall of the other 89%.
           So the door is not hashed, it is READ OFF THE PLOT -- the suburb's own rule
           ("door where the house meets its driveway or its street, ONE per approach,
           only the leftmost tile of a run") with the suburb-specific codes taken out:
             A DOOR GOES WHERE AN ENTERABLE BUILDING MEETS GROUND A PERSON CAN STAND
             ON, one per contiguous run of that frontage, and nowhere else.
           ONLY WHAT THE DOSSIER SAYS YOU CAN ENTER. `entry.enter` is the gate: a fence
           is a solid structure on this same branch (it is why wallH=2 above exists) and
           a fence with a front door would be absurd. No enter, no door.
           Every door this makes is reachable BY CONSTRUCTION, because the cell it faces
           is walkable. A mass with no walkable frontage still gets none, and the 8/2
           rule still refuses to seal those rather than locking him out. */
        let doorHere=false;
        if(entry&&entry.enter){
          const bl=belowCode===0?null:(belowEntry?BohemiaDistrictKit.tileLayer(belowEntry):null);
          const belowStand=(belowCode===0)||(bl&&(bl.layer==='ground'||bl.layer==='portal')&&!bl.solid);
          if(belowStand){
            /* leftmost tile of this frontage run, exactly as the suburb does it */
            const lc=lx>0?m.kit[ly*FN+(lx-1)]:0;
            const le=lc!==0&&spec.legend&&spec.legend[lc];
            const leftIsMass=!!(le&&le.enter&&BohemiaDistrictKit.tileLayer(le).layer==='structure');
            let leftStands=false;
            if(leftIsMass&&ly+1<FN){
              const lb=m.kit[(ly+1)*FN+(lx-1)];
              const lbe=lb!==0&&spec.legend&&spec.legend[lb];
              const lbl=lb===0?null:(lbe?BohemiaDistrictKit.tileLayer(lbe):null);
              leftStands=(lb===0)||(lbl&&(lbl.layer==='ground'||lbl.layer==='portal')&&!lbl.solid);
            }
            doorHere=!(leftIsMass&&leftStands);
          }
        }
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=doorHere?'hdoor':(pick<14?'hwall':(pick<19?'hwindow':'hboarded'));
        if(doorHere&&typeof window!=='undefined') window.__KIT_DOORS=(window.__KIT_DOORS||0)+1;
      }"""


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: every building already gets a door'); return 0
    if city.count(ANCHOR) != 1:
        print('FAIL: the generic facade pass is not where this tool expects it'); return 1
    if 'function massHasDoor(' not in city:
        print('FAIL: the 8/2 door rule is missing -- this builds on it'); return 1

    city = city.replace(ANCHOR, NEW, 1)
    if city.count(MARKER) != 1:
        print('FAIL: post-edit marker count %d' % city.count(MARKER)); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  a building now takes a door where it meets ground you can stand on,')
    print('  one per frontage run, so the 8/2 rule finally has doors to enforce')
    return 0


if __name__ == '__main__':
    sys.exit(main())
