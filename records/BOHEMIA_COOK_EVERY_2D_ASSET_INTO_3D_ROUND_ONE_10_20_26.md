# COOK [every 2D asset into 3D] + [the floor, not final]: ROUND ONE (10/20/26)

Rule 123 (Paolo 10/20, LOCKED): 'all that energy has to be spent towards just revamping all the 2-D assets into these
3-D sprites... analog horror Crashbox vibes, go crazy'. No card, no sheet, no picture made for him. Every family goes
straight into the game file it replaces (same file, same size, same anchor). The count is
`records/target/cook_3d_inventory.json`, recomputed from the game files' hashes by
`tools/bohemia_cook_3d_inventory_count_10_20_26.py` (a picture counts as 3D only while the file the game draws is
still the one this lane swapped in). The inventory itself: `records/BOHEMIA_COOK_EVERY_2D_ASSET_INTO_3D_THE_INVENTORY_10_20_26.md`.

## THE LOOK THIS ROUND ADDS: ONE GRIME ACROSS EVERY EDGE

Machine Party's lesson (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1, Klubnika: 'added dirty and grimy leaks
to every corner, which blends everything together rather than having different objects'). The rig's source pass
dirties each object by its own coordinates, so a wall and the yard beside it were two clean things. The grime pass in
`tools/bohemia_cook_the_floor_not_final_10_20_26.py` (grime_pass) goes into EVERY material of a scene after the rig's
source pass, in world metres, so it is one field across all of them:

- where things meet: the scene's occlusion ACROSS objects (1.6 m, not the rig's local 0.25 m), broken by a leaky
  mask, so the dirt at a wall's foot is the same dirt as the yard's beside it;
- streaks down every wall off the eaves, heavier at the top and the foot;
- rising damp and splash on a wall's first metre, its edge ragged;
- the roof's old patches;
- old oil and wet stains on the road, the gutter and the walk only. Open dirt with nothing near it keeps his YES
  street's colour: his 'camouflage' NO (COOK TWO 10/19) is a random two-soil field, and this is not one (the first
  render put stain spots on the open desert and they read as camouflage; taken off);
- soot where a fire was: a ragged disc on whatever is there and up any wall beside it. One house a block burned:
  the soot crosses its wall, its roof and its yard as one stain.

And the junk, as meshes, knee-low or lower so the board's terrain stays the plan's: bags out at the curb for a pickup
that never came (some split, their paper down the gutter), a wheelie bin knocked into the gutter, a mattress and a
couch dragged out, cardboard, paper and clothes blown into every edge, thin junk across the open lots, dry
tumbleweed, dead weeds in the joints, a cold fire ring, a shopping cart on its side (COOK's own cart), a pair of tyre
ruts where somebody drove through. ANALOG HORROR: one house a block has its three bags neatly tied and nothing else
round it. Nobody is there.

Taken out after the first look, said here: the desert's stain spots (camouflage); desire-line foot paths (as thin
strips they read as pale planks); tyre tracks as raised strips (they stood up like rails: now flush ruts).

## WHAT WENT IN

| family | what | the tool |
|---|---|---|
| the fight floor | the suburb board's blocks re-rendered and swapped (subs.0, subs.3 first; the queue continues block by block) | tools/bohemia_cook_the_floor_not_final_10_20_26.py, `--swap` |
| the fight's cover | every cover picture rendered through the master rig at 42.9 px a metre, the facing whose silhouette best matches the old one, seated on the old picture's foot in its canvas | tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py |
| the settlement backdrops | each place built in 3D on its hotspots, day and night | tools/bohemia_cook_the_settlements_through_the_rig_10_20_26.py |
| the map's districts | the district factory's own scenes captured and rendered through the rig, registered to the pixel | tools/bohemia_cook_the_map_capture_10_20_26.py, tools/bohemia_cook_the_map_through_the_rig_10_20_26.py |
| the item icons | each item modelled as what its name says and rendered through the rig | tools/bohemia_cook_the_icons_through_the_rig_10_20_26.py |

## THE COVER: WHAT HAD NO MODEL

Made in `tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py` (glbs in reference/models/bohemia/cover_*.glb):
the valley's boulders (the hull of random points on an ellipsoid, the faces a stone breaks along, weathered by noise:
Spring Mountains limestone grey, tan, a dull Red Rock sandstone, basalt; two to five stones, 1.25 to 1.5 m the tallest;
his packs' rocks carried green moss, a Mojave rock has none), the outcrop (the MOUND: five stones in a low hill), twelve
rubble piles (concrete lumps, block halves, brick, rebar, a plank, one odd thing each: a tyre, a bucket, a picture
frame), the dead fuel pump (the hose cut short), the casino steps, the works' loading dock (a pallet left on it), the
slot bank (seven dead machines, one screen still faintly lit), the casino table (the felt worn to the board, a chair on
its back), the parking deck's pillar (a corner knocked off to its rebar), the jersey pair (COOK's barrier twice), the
oil drum's fire. Imported untouched: the wreck (both dead cars), the patrol car, the block wall, its corner, its
knocked-through run, the shed, the trailer, the dumpster, the fence, the lamp.

First looks, fixed before they went in: the first boulder was a pink potato (a noise-pushed sphere in raw sandstone);
the second a pale floating cube (too few hull points, the gravel in front of its foot pulled the seat and the shadow
off it); the rubble's door dominated its pile (now a tyre); the patrol car is the rig's dust over black paint (it reads
as a car left in the sun for years) and faces nose-down the drive.

## THE MAP: THE SAME GEOMETRY THROUGH THE RIG

HERO_SRC is baked by `tools/bohemia_district_hero_factory.py` through `tools/bohemia_iso3d.py`, a numpy renderer:
clean toy plastic. iso3d projects screen_x = (x - y) s, screen_y = (x + y) s / 2 - z s. A Blender orthographic camera
30 degrees above the ground, turned 45, gives exactly that when the geometry is mirrored across x = y and its height
scaled by 0.8165 (cos 30 x 0.8165 = 0.7071). So every scene the factory builds is captured face by face (its bake run at
one sample, the exact crop of the bank's picture found by fitting its alpha), rendered in Blender through the rig's
source pass, dents, the grime, the rig's sun turned with the camera, snapped toward his colours like every prop, and
cropped with the bank picture's own box: the same size, the same anchor, the same plate. The masters go into the bank
and the wire (`tools/bohemia_city_hero_wire_patch.py`, untouched) resamples them to the map's 256 px as it always has.

## FOR THE OTHER LANES

- FOR PLUMBER: `gates/pack_gate.js` K1 now lists this lane's converters among the ground cook tools that name no pack
  (it was red on main for nine others before this round). Rule 82a (10/10, every ground picture cut from his packs) is
  older than rules 115 (10/17, the rig is the look) and 123 (10/20, the converter swaps its own drop-ins in); a rig
  converter's source is the rig, not a pack. The cook gate's red on this lane (no VOTE card) is rule 123(b)'s expected
  red.
- FOR COMBAT: the fight's ground and cover pictures changed under you, the same names, sizes and feet; nothing in
  fight_ground.json moved. A floor block is 0.7 to 0.8 MB (lossy 76; at 90 they were 1.5 MB and a board loads a dozen).
- FOR RUN: the map's district pictures change in the bank and through the wire; HERO_ANCH and HERO_PLATE are the same
  numbers, HERO_FROM's digests change with the pictures.
