#!/usr/bin/env python3
"""
THE WALKED SURFACE IGNORED THE OCCUPANCY MODEL FOR EVERY PROP IN THE VALLEY.
(8/18, WORLD lane.)

FOUND WHILE VERIFYING SOMETHING ELSE. Building the hazard classifier this morning, the
first standability rule was "not solid and not a portal" -- the kit's own answer. Six
tiles passed it and came back walk:false when the RUNNING PAGE was asked. I concluded a
prop is not floor, tightened the rule to layer==='ground', and wrote that down as the
lesson. THAT WAS THE WRONG LESSON, and finding out why is this patch.

THE KIT ALREADY MODELS THIS, PER TILE, AND SAYS SO IN ITS OWN CONTRACT:
    prop  - an object sitting on the ground (cart, pump, tree, furniture); SOLID PER ITS SIZE
    solid = does the tile block a body's cell (occupancy) at grade
Its default for `prop` and `tree-dead` is solid:TRUE. So every tile that reads solid:false
is a district author DELIBERATELY declaring "a body may stand here" -- you push through
creosote, you walk over rubble drift, you step past a survey stake.

THERE ARE 48 OF THEM ACROSS 41 DISTRICTS, AND THE WALKED SURFACE THREW AWAY ALL 48:

    if(tl.layer==='prop'){ c.s=pal; c.walk=false; return c; }

One line, no mention of `tl.solid`, blocking every prop in the world. Forty-eight
deliberate authoring decisions, in dossiers, gated by tilespec_gate and district_kit_gate,
and none of them reached the surface Paolo walks on. THE MODEL AND THE GAME DISAGREED
ABOUT THE SAME TILE, which is a bug and never an interpretation choice.

WHY IT WAS INVISIBLE. Nothing compared the two. district_kit_gate holds the MODEL,
walkable_gate holds land STATISTICS, and the walked surface was never asked whether it
agreed with either. A contradiction between two live systems is exactly the class of
thing that survives a hundred green gates.

THE FIX IS ONE CONDITION -- and the other half of it is not here, on purpose.
Honouring `solid` immediately exposed that TWELVE DEAD TREES and three hard objects were
declared solid:false, which would have shipped a player walking through tree trunks. A
trunk blocks. Those 15 declarations were corrected in their own district legends (the
right place: the tile is what is wrong, not the reader), so they behave exactly as they
do today and are now honestly declared. What actually opens up is the 33 that were always
meant to be walk-through: brush, weeds, dead landscaping, rubble drift, a shopping cart,
a survey stake, a lounge chair.

AND IT CLOSES A GAP I FILED THIS MORNING. records/BOHEMIA_THE_FLOOR_CAN_KILL_YOU_8_18_26.md
gap 1: "THE VALLEY HAS NO WALKABLE RUBBLE FIELD -- every rubble/debris tile in six
districts is a prop the walked surface blocks, so the most classic piece of unstable
ground in any game cannot be stood on here." It was never missing. It was declared,
authored, and discarded one line before it reached him.

REUSE CHECK: cooks no pixels, opens no bank, adds no tile and no table. It deletes an
assumption and reads a flag the kit has computed since July.

  python3 tools/bohemia_city_occupancy_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__PROP_SOLIDITY_IS_PER_TILE__'

OLD = "    if(tl.layer==='prop'){ c.s=pal; c.walk=false; return c; }"
NEW = ("""    /* __PROP_SOLIDITY_IS_PER_TILE__ -- this line read `c.walk=false` for EVERY prop and
       never once looked at `tl.solid`, which the kit has computed per tile since July and
       documents in its own contract ("prop - an object sitting on the ground; SOLID PER ITS
       SIZE" / "solid = does the tile block a body's cell at grade"). The kit's DEFAULT for
       prop and tree-dead is solid:TRUE, so every solid:false in a legend is a district
       author deliberately saying A BODY MAY STAND HERE -- you push through creosote, you
       walk over rubble drift, you step past a survey stake. There were 48 such declarations
       across 41 districts and this line discarded all of them.
       THE MODEL AND THE GAME DISAGREED ABOUT THE SAME TILE. Nothing compared them:
       district_kit_gate holds the model, walkable_gate holds land statistics, and the
       walked surface was never asked whether it agreed with either.
       Found by accident -- the hazard classifier's first standability rule was the kit's
       own answer, six tiles came back walk:false on the running page, and I wrote down the
       wrong lesson (\"a prop is not floor\") instead of asking which of the two was lying.
       gates/occupancy_gate.js now compares them, tile by tile, in every district. */
    if(tl.layer==='prop'){ c.s=pal; c.walk=!tl.solid; return c; }""")

if not os.path.exists(WORLD):
    sys.exit('OCCUPANCY PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

if MARK in src:
    print('OCCUPANCY PATCH: already applied.')
    sys.exit(0)
if OLD not in src:
    sys.exit('OCCUPANCY PATCH: could not find the prop branch of realizeCell. Refusing to '
             'guess -- this is the ONE line that decides whether a body may stand on a prop '
             'cell, and a wrong edit here makes the valley either impassable or made of fog.')

src = src.replace(OLD, NEW, 1)
open(WORLD, 'w', encoding='utf-8').write(src)
print('OCCUPANCY PATCH: the walked surface now honours the kit\'s per-tile `solid` flag')
print('    48 declarations were being discarded; 15 were misdeclared and were corrected')
print('    in their own legends, so 33 brush/litter/stake tiles genuinely open up')
