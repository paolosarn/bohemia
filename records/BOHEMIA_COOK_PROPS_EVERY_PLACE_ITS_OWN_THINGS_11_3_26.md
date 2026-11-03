# COOK PROPS: EVERY PLACE ITS OWN THINGS (11/3; rule 341, rule 337; ask line 350)

His words (11/3): "everything just looked exactly the same as the main suburb shit we have... nothing made them uniquely unique,
nothing made them fun to do, no variety, like true variety, recycled hogwash."

## WHAT THIS LANE MAKES
The THINGS that stand on each place's fight board, so every place is known in one look. COMBAT MAPS 3 lays the boards (plan,
twist, starts, the plan gate) and places these; this lane never lays a board.
- Each thing is a real model at its real size in metres, built the props modeller's way (puppet shapes, every colour a step of
  one role of DIRECTION's palette, roughness 1, specular 0, rust and grime as the modeller's ragged blotches), one mesh, origin
  at its ground centre, its front to -Y (the camera). File: reference/models/bohemia/fight_props/<place>_<name>.glb.
- Each is shot ALONE from the fight camera through the master rig (source pass at the rig's prop wear 0.6, dents, the 1/cos45
  height stretch, one sun, the film; orthographic, tilted 45, facing north, 42.92 px a metre, the block's own ruler) onto a
  shadow catcher: a cover sprite at the fight's scale with its own shadow. File: records/target/fight_props/<place>/<id>.webp,
  its ground pixel in the manifest as anchor_px.
- Each place has ONE VOTE card: its things together on a 32 m patch of the place's own ground (the floor tool's build() with
  COMBAT MAPS 2's ground materials), one render from the game's camera: records/target/fight_props/CARD_<PLACE>.webp.

## THE CONTRACT WITH COMBAT MAPS 3: records/target/fight_props/manifest.json
One entry a model: place, name, landmark, model, picture, picture_px, anchor_px, size_m, footprint_cells (a cell is the 12 m
house tile), fills_cell, height_m, height_storeys (3 m), role (cover / blocking / none), sees_through, and fight = the fight's
own words from fight_ground.json's cover table (kind COVER / LOW_COVER / HEIGHT / NONE, tile '#' / 'H' / 'r' / '.',
blocks_move, blocks_sight, see_through, burns), what it is, and the one wrong thing where it carries one.
Two ways to use one: import the .glb into the block scene the way the new blocks tool builds its things (the board's own
source pass and stretch apply), or draw the picture as a cover piece at x_m, y_m with anchor_px on the spot.

## THE PLACES (worst first, the record's order): 69 MODELS, 15 CARDS
| place | things (the landmark first) | the wrong thing |
|---|---|---|
| the lab yard | THE CAGE BLOCK (cage three burst from inside, its door thrown out, its bars bent out), two gurneys, the decon shower, the cold-store truck, the lab fence run, its gate with one leaf down | the reefer still running: its panel lit, frost and icicles on the open doors in the desert |
| the airport | THE PLANE ON ITS BELLY (a Beechcraft 1900 at 17.6 m, props curled), the fuel truck (burns), the baggage carts, the jet bridge stub (HEIGHT by its stair), the hangar's open front | every suitcase on every cart is the same suitcase |
| the golf course | THE CLUBHOUSE FRONT (its roof HEIGHT by a ladder), a golf cart, a cart on its side, the flag on a dead green, the tee, a dead palm, a palm down | the flag is new, bright, standing straight out with no wind |
| the trailer park | A TRAILER ON BLOCKS, a trailer burnt out, the propane tanks (burn; the kit's tank whole), a carport (the kit's tyres), the clothesline | the washing is spotless white, the only clean thing in the park |
| the desert | A POWER PYLON DOWN (24 m, see-through), Joshua trees (two sizes), boulders, a dead car half buried (the kit's wreck) | the buried car's headlights are on |
| Red Rock | A SANDSTONE FIN, ledges at one, two and three storeys (HEIGHT), the slot canyon's walls (a slot 1.1 m wide) | a cairn on top of the three-storey ledge, where nobody could climb |
| the pass | A JACKKNIFED TRUCK, a rockfall (MOUND), guard rail runs, the road closed | the trailer is empty and spotless white inside |
| the shore | THE INTAKE TOWER (14 m, the bathtub ring on it), a dock on dry land (HEIGHT), a boat on its side, the buoys | the boat's anchor line runs taut down into the dry mud |
| the wash | THE CULVERT (two tunnels through, HEIGHT on its road), a shopping cart in the silt (the kit's cart), a sofa in the silt, the debris jam | a floor lamp beside the sofa, lit, plugged into nothing |
| the suburbs | AN EMPTY POOL (a pit; hole_m: the board cuts its ground), a backyard corner of block wall and its gate, a dead swing set, a trampoline frame | one swing stopped high at the top of its arc; two fingers of clear water in the deep end |
| the landfill | A TRASH MOUND (MOUND), the methane flare (burns), the dead dozer (the kit's dozer), the gas header | the flare is still burning |
| the Strip | THE DRY FOUNTAIN (its rim LOW_COVER), a fallen casino sign, the bridge span (HEIGHT by its escalator), a stretch limo | one bulb of the sign's hundred still lit |
| downtown | A BAY OF THE CANOPY (repeat it down the street), alley dumpsters (the kit's, whole), an alley wall and its fire escape (HEIGHT), the Deuce burnt | one panel of the dead canopy screen still showing colour |
| the works | A BOXCAR, a tank car (burns), the gantry crane, the machines, a stack of pipe | a car (the kit's wreck) hangs from the gantry's hook, nobody at the controls |
| the marina | A HOUSEBOAT ON THE DRY BED (HEIGHT, its water slide), a cruiser on its keel, a bass boat on its trailer (and the shore's dock) | a fresh towel at the foot of the slide; every boat points the same way |

No green anywhere: dead lawns and fairways brown and straw, the palms and Joshua trees dry, the sandstone's cream band warm.
Reused whole, never remodelled (REUSE-FIRST): propane.glb, tyres.glb, wreck.glb (twice), cart.glb, dozer.glb, dumpster.glb.
The old gantry.glb is an 8 m low frame, not a crane: the works' crane is modelled here.

## WHAT THIS DOES NOT DO
It does not lay or change a board, the fight's code, fight_ground.json or the plan gate (COMBAT MAPS 3's). The things are not in
a fight until COMBAT MAPS 3 places them; until then they are seen in the VOTE tab only.

## TOOL
tools/bohemia_cook_props_every_place_its_own_11_3_26.py: `models <place|id>`, `card <place>`, `manifest`. Renders: bpy 4.2 in a
python3.11 venv, four cores; a place's models about 1 to 3 minutes, a card about 1.5 minutes.

[bb Battle Brothers' tactical map is cut from the world tile it is fought on, its special places have their own built plans, and a
blocker there reads at a glance as what it is (a wagon, a tent, a wall); every place's things here are the same idea at our scale.]
[analog horror: one wrong thing a place, nothing remarks on it.]
