#!/usr/bin/env python3
"""BOHEMIA THE HEAD GETS ITS OWN EDGE BACK (8/11/26, CHARACTER lane)

PAOLO, chin circled: "this is not how the rig has my head and my neck line. Why
does it look so fucked up... there needs to be more head underneath the mouth
following how the rig has it. fix it"

FOUND IT, AND IT IS ONE CONDITION.

The base body does not use painted colour -- it SHADES ITSELF from the part grid.
Every body part gets one base tone, and a pixel on an edge gets `shade=1`, the one
darker anatomy tone, which is what draws every limb and every silhouette line on
the body. The whole pass is wrapped in:

    const g = GROUP[pid];
    if (g !== 0) { ...border detection... if (border) shade = 1; }
                ^^^^^^^^
    GROUP = {1:0, 2:0, ...}   <-- group 0 IS THE HEAD AND THE FACE

So the head was the ONE part of the body excluded from having an edge. Every head
pixel came out the same flat tone, and it has been that way for every character in
the game.

*** AND HE PAINTED THE JAW. IT HAD NOWHERE TO GO. ***
His body art, head rows, ramp index per pixel (0 = the dark anatomy tone):

        y 5 .....000000...
        y 7 ...0555555550.        a 0 on BOTH sides of every row
        y13 ...0555555550.
        y14 ....05555550..        the jaw comes in
        y15 .....044440...        and closes to the chin

That taper -- x7..x16, then x8..x15, then x9..x14 -- IS the egg. Measured on the
render, the columns he painted 0 came out 191,175,166: THE EXACT SAME COLOUR AS
THE FACE BESIDE THEM. His jawline was being painted as cheek, so the head read as
a flat barrel and the chin dissolved into a shelf under the mouth. That shelf is
the thing he circled.

THE FIX: the head gets the same silhouette edge every other body part already has.
A head/face pixel with an empty neighbour takes `shade=1`, exactly like an arm or
a leg does. His painted taper then draws itself, because the darker rim follows
the silhouette he authored -- 10 wide at the cheekbones, 8, 6, closing to the 4px
chin.

DELIBERATELY NARROW, and here is what is NOT changed:
  - NO line between head (1) and face (2). Same group, and the existing
    `if (ng === g) continue` already says so. They are one form, not two.
  - NO line where a LIMB meets the head. The 7/2 ruling "limb vs head: head stays
    clean" is untouched and still keyed on `ng === 0`.
  - NO line at the head/neck junction. Only the SILHOUETTE edge (`!np`, an empty
    neighbour) counts here. A neck join line is a separate question and it is his.
  - NOT ONE PAINTED PIXEL MOVES. This is a tone on cells his rig already owns.
    RIG LAW is about geometry and the geometry is untouched.

SKY TOP-LIGHT still runs after and is still guarded by `shade === 2`, so it lights
the crown and never eats the new edge.

    python3 tools/bohemia_head_edge_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """      if(border)shade=1;                                      // the ONE darker tone, never black
    }"""

NEW = """      if(border)shade=1;                                      // the ONE darker tone, never black
    }
    /* THE HEAD HAS AN EDGE TOO (Paolo 8/11: "this is not how the rig has my head
       and my neck line... there needs to be more head underneath the mouth").
       Group 0 is the head and the face, and it was the ONE part of the body that
       never reached the border test above -- so every head pixel came out the same
       flat tone, on every character in the game, forever.
       HE PAINTED THE JAW AND IT HAD NOWHERE TO GO. His body art puts the dark
       anatomy index on both sides of every head row and walks it inward -- x7..x16,
       then x8..x15, then x9..x14 -- which is the egg. Measured before this, those
       columns rendered 191,175,166: the same colour as the cheek beside them. The
       jawline was being painted as face, the head read as a barrel, and the chin
       dissolved into the shelf under the mouth that he circled.
       ONLY THE SILHOUETTE EDGE. Not head-vs-face (one form, same group), not
       limb-vs-head (his 7/2 ruling, still keyed on ng===0 above), not the neck
       join -- that one is a separate question and it is his to make. */
    else { const hx=i%CW, hy=(i/CW)|0;
      if((hx+1>=CW||!grid[i+1])||(hx<=0||!grid[i-1])||
         (hy+1>=CH||!grid[i+CW])||(hy<=0||!grid[i-CW])) shade=1; }"""

alpha = open(ALPHA, encoding='utf8').read()
if 'THE HEAD HAS AN EDGE TOO' in alpha:
    print('  ok   (already) the head has its silhouette edge')
    sys.exit(0)
n = alpha.count(OLD)
if n != 1:
    print('HEAD EDGE: refused to write -- expected exactly 1 match, found %d' % n)
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   the head and face take the same silhouette edge every other body part has')
print('HEAD EDGE: applied to %s' % ALPHA)
