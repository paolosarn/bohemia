# COOK [the accessories through the rig] 10/19/26: EVERY PROP FAMILY THE MAP AND THE FIGHT DRAW, MADE LIKE THE TRUCK

His words (rule 121(j), 10/19): "even the floor tiles and building tiles and all accessories have to get remade with this
analog horror Crashbox style. Everything. Everything." The row: cars, lamps, barriers, signs, fences, sandbags,
containers, carts, drums, finishing what [props through the rig] began, a sheet per family, handed to RUN and COMBAT.

## MEASURED FIRST: WHAT STILL DREW FLAT
The fight's cover pictures (slices/fight_ground/cover_*.webp) beside the models the lane already had through the rig
(records/target/master_rig/cook_*): the lamp, the wreck, the jersey barrier, the dumpster, the cart, the tyres, the
sandbags, the chain-link run, the container, the propane, the rubble, the corral, the rolled wreck, the pier, the drums,
the gantry, the heap, the bales and the dozer were made (10/18). Still flat with no model: the DEAD PATROL CAR (cover
car_drive), the BLOCK WALL in its three cuts (wall, wall_corner, wall_broken), the SHED, the TRAILER; and the families the
row names with nothing in them: no street light for the arterials, no sign.

## WHAT WAS MADE (tools/bohemia_cook_model_props_two.py, the props modeller's helpers imported; each through the master
## rig unchanged, by tools/bohemia_cook_rig_one_ray.py: the rig file run whole, its occlusion and bevel nodes at one ray a
## camera sample, the same picture in expectation)

| prop | real size (m) | the one wrong thing | card under the guide | colours |
|---|---|---|---|---|
| the dead patrol car | 5.0 x 3.1 x 1.5 (the car 4.7, its chain out) | a tow chain hooked to the push bar, its free end in the road, nobody on the other end | 0 of 8 out | 7,883 |
| the arterial's street light | 3.5 x 1.0 x 9.5 | the handhole at its foot open, the copper pulled out in a coil on the ground | 1 of 8 (colours 4,333 against the thin pole's floor) | 4,333 |
| the block wall | 6.0 x 0.24 x 1.9 | a tally scratched into it, groups of five, a long run | 2 of 8 (value span, grain 2.23) | 6,833 |
| the block wall, corner | 4.0 x 4.0 x 1.9 | a child's handprint in house paint at waist height | 2 of 8 | 7,587 |
| the block wall, knocked through | 6.0 x 1.5 x 1.9 | a doormat laid in the gap | 1 of 8 | 7,868 |
| the stop sign and the street name | 0.8 x 1.1 x 3.1 | the post bent over by a car, five bullet holes, still facing the road | 2 of 8 (value span, light) | 3,994 |
| the 40-foot trailer | 12.25 x 2.66 x 4.06 (real 12.2 x 2.6 x 4.1) | the rear door up a metre and a mattress inside | 0 of 8 | 12,812 |
| the tin shed | 3.2 x 3.5 x 2.2 (the door open) | the door open on the dark, the padlock still locked on the open hasp | 0 of 8 | 6,933 |

Every run: no break of the guide, the calibration cube 58 px (57 +- 1), the light 155.4 deg on the screen.

THE LOOP: the block walls' first two runs came back BACK (3 to 5 of 8 out) and white. A glb carries no procedural
texture, so the brick pattern laid in the material never reached the rig and the wall rendered as bare white with the
dust in blotches. The walls are now laid block by block, 0.39 x 0.19 m faces, a centimetre joint, running bond, two shades
of block, every block a hair off true; all three pass.

## THE SHEETS (tools/bohemia_cook_accessories_through_the_rig_sheet_10_19_26.py), ONE PER FAMILY, in VOTE
CARS (the dead sedan, the sedan on its roof, the patrol car), LAMPS AND SIGNS (the lamp, the street light, the stop sign,
the fallen gantry), BARRIERS (the jersey barrier, the sandbags, the lane closure), FENCES AND WALLS (the chain-link run,
the three block walls), CONTAINERS AND SHEDS (the container, the dumpster, the propane, the shed, the trailer), CARTS AND
DRUMS (the cart, the corral, the tyres, the bales). Each prop: what the game draws today (the fight's cover picture, or his
pack tile where the fight draws none) beside the rig's, then the eight facings.

## FOR RUN AND COMBAT
Every prop is its glb in reference/models/bohemia/ and its eight facings with their shadow layers in
records/target/master_rig/cook_<name>/ (rig.json names the files, the crop box and the ground pixel). COMBAT: the cover
pieces car_drive, wall, wall_corner, wall_broken, shed and trailer now have a rig picture each (S is the fight's facing).

[bb Battle Brothers keeps its props few and readable, each a silhouette the eye knows at a glance; here every one stands
at its real size beside the man.]
[analog horror: every prop carries one calm wrong thing, the kind a person did and walked away from.]
