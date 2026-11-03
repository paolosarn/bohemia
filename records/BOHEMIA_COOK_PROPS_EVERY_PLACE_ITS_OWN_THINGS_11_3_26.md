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

## THE PLACES (worst first, the record's order) AND WHAT EACH WRONG THING IS
| place | things (the landmark first) | the wrong thing |
|---|---|---|
| the lab yard | the cage block (cage three burst from inside, its door thrown out, its bars bent out), two gurneys, the decon shower, the cold-store truck, the lab fence run, its gate with one leaf down | the reefer still running: its panel lit, frost and icicles on the open doors in the desert |
| the airport | the plane on its belly (a Beechcraft 1900 at 17.6 m, props curled), the fuel truck (burns), the baggage carts, the jet bridge stub (HEIGHT by its stair), the hangar's open front | every suitcase on every cart is the same suitcase |
| the golf course | the clubhouse front (its roof HEIGHT by a ladder), a golf cart, a cart on its side, the flag on a dead green, the tee (ball washer, bench), a dead palm, a palm down | the flag is new, bright, and stands straight out with no wind |

No green anywhere: the dead green is straw (tape_masking), the fairway its dead stripes, the palms brown.

## WHAT THIS DOES NOT DO
It does not lay or change a board, the fight's code, fight_ground.json or the plan gate (COMBAT MAPS 3's). The things are not in
a fight until COMBAT MAPS 3 places them; until then they are seen in the VOTE tab only.

## TOOL
tools/bohemia_cook_props_every_place_its_own_11_3_26.py: `models <place|id>`, `card <place>`, `manifest`. Renders: bpy 4.2 in a
python3.11 venv, four cores; a place's models about 1 to 3 minutes, a card about 1.5 minutes.

[bb Battle Brothers' tactical map is cut from the world tile it is fought on, its special places have their own built plans, and a
blocker there reads at a glance as what it is (a wagon, a tent, a wall); every place's things here are the same idea at our scale.]
[analog horror: one wrong thing a place, nothing remarks on it.]
