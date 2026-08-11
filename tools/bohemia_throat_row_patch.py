#!/usr/bin/env python3
"""BOHEMIA THE THROAT WAS EATING HIS CHIN (8/11/26, CHARACTER lane)

PAOLO, zoomed all the way in on the mouth with the whole area under it circled:
"THIS IS NOT FIXED ARE YOU RETARDED BRO ARE YOU FUCKING FR"

He was right and I had fixed a different thing. The jaw EDGE was missing (that was
real, and it is fixed). This is the other half, and it is the one he circled.

NECK_TONE does not only tint the neck. Its own comment says why -- part 3 is 100%
cloth on every facing he looks at, so a tone there can never appear -- so it also
takes "the lowest rows of visible FACE skin":

    const NECK_TONE = { on:true, part:3, mul:0.93, throatRows: 2, ... }
                                                   ^^^^^^^^^^^^^

MEASURED, S facing, and this is the whole bug:

    RIG      y13 face w8  (the mouth row)
             y14 face w6  <- the JAW
             y15 face w4  <- the CHIN
    RENDER   y13  191,175,166   his face tone
             y14  177,162,154   THROAT
             y15  177,162,154   THROAT

BOTH ROWS OF HIS CHIN WERE BEING PAINTED AS THROAT. The two rows under his mouth
came out the same tone as the neck, so they read as one continuous slab and the
mouth appeared to sit directly on the top edge of his neck. That slab is the thing
he circled -- twice now.

*** AND HE ALREADY RULED ON THIS ONCE. *** 7/28: "Make the neck one tile less
facing east and west... towards the chin", and the note in the code says two rows
"reached up into the chin". That correction was applied to E and W ONLY and left
at two everywhere else. It was the same defect on the front the whole time; he was
looking at profile when he caught it, and at the front when he caught it again.
So this is not a new decision, it is his 7/28 ruling finishing its job:

    ONE ROW, EVERY DIRECTION.

The throat keeps a row -- his 7/27 ruling ("the neck is not a different color")
still holds and the tone still appears. What it stops doing is claiming his jaw.

    python3 tools/bohemia_throat_row_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """const NECK_TONE = { on: true, part: 3, mul: 0.93, throatRows: 2,
  /* ONE TILE ON E AND W (Paolo 7/28: "Make the neck one tile less facing east
     and west... towards the chin"). In profile there is far less throat between
     the jaw and the collar than there is head-on, so two rows reached up into the
     chin. One row there, two everywhere else. */
  throatRowsByDir: { E: 1, W: 1 } };"""

NEW = """const NECK_TONE = { on: true, part: 3, mul: 0.93, throatRows: 1,
  /* ONE TILE, EVERY DIRECTION (Paolo 7/28 -> 8/11).
     7/28: "Make the neck one tile less facing east and west... towards the chin"
     -- two rows reached up into the chin, so E and W went to one and everywhere
     else stayed at two.
     8/11, zoomed all the way in on the mouth with everything under it circled:
     "THIS IS NOT FIXED." Measured on S, the rig has face at y13 w8 (the mouth
     row), y14 w6 (the JAW) and y15 w4 (the CHIN) -- and the render painted BOTH
     y14 and y15 as throat, 177,162,154, the same tone as the neck. His chin and
     his neck came out one continuous slab with the mouth sitting on top of it.
     IT WAS THE SAME DEFECT ON THE FRONT ALL ALONG. He caught it in profile in
     July and head-on in August; the July ruling just never got applied past the
     two facings he happened to be looking at. So this is that ruling finishing,
     not a new call.
     The throat KEEPS a row -- his 7/27 "the neck is not a different color" still
     holds and the tone still shows. It just stops claiming his jaw. */
  throatRowsByDir: null };"""

alpha = open(ALPHA, encoding='utf8').read()
if 'ONE TILE, EVERY DIRECTION' in alpha:
    print('  ok   (already) the throat is one row everywhere')
    sys.exit(0)
n = alpha.count(OLD)
if n != 1:
    print('THROAT ROW: refused to write -- expected exactly 1 match, found %d' % n)
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   the throat takes ONE row, every direction -- his jaw is his again')
print('THROAT ROW: applied to %s' % ALPHA)
