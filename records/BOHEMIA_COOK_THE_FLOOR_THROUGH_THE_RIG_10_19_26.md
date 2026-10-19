# COOK [the floor through the rig] 10/19/26: THE FIGHT FLOOR BUILT IN 3D AND LIT LIKE THE ROBOT AND THE TRUCK

His words (rule 121(j), 10/19): "even the floor tiles and building tiles and all accessories have to get remade with this
analog horror Crashbox style. Everything. Everything." (121(k)): "Remodel everything 3D grimey Crashbox analog horror
machine party vibes." His NO on the fight floor, twice: "I hate the ground. I hate the floor... it's so fucking bad"
(10/18) and "looks like shit" (cook2-the-fight-floor-10-19).

## WHAT HE HATED, AND WHAT THE BAR SAYS
DIRECTION's floor bar (records/target/BOHEMIA_STYLE_GUIDE.json classes.ground.floor_bar, tools/bohemia_direction_floor_bar.py)
turns his YES street (records/target/COOK2_ONE_REAL_STREET.webp) into six numbers. The shipped fight blocks fail all six:
orange dirt (B1 0.40 to 0.61 against 0.28), camouflage blobs (B3 11.7 to 38.4 against 9), smooth fill (B4), the same
asphalt tile every house (B5), bright medieval orange roofs (B6 up to 78.7 percent).

## WHAT WAS MADE
1. THE PLAN, READ, NEVER DRAWN (tools/bohemia_cook_the_floor_through_the_rig_plan_10_19_26.py): COOK TWO's coded run of
   COMBAT TWO's block maker, imported as it is, gives per pixel which ground and how dark; the town streets are COOK TWO's
   street kit, whose walks are 1.5 m bands (kit_street.json); paint is the kit's own paint-bright pixels. 28 blocks read.
2. THE GROUND IS GEOMETRY (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py): one mesh a block, a vertex every
   4.7 cm (two pixels), 1.8 million of them, carrying real heights: the sidewalk 15 cm over the road (a 6-inch curb face,
   Clark County's standard), the concrete GUTTER PAN 0.45 m wide under every curb (the L of a Las Vegas curb and gutter),
   the yard 4 cm under the walk, the wash bed 22 cm down, the desert rolling 4.5 cm over 1.6 m, every five-foot sidewalk
   panel heaved a centimetre on its neighbour, a pothole every 70 m2 of road up to 7 cm deep; then the stones as their own
   meshes, sitting in the ground with their own shadows: pebbles, rocks, rubble and broken brick by ground, gravel in the
   gutter (up to 700,000 vertices of stone a desert block).
3. THE SURFACE: asphalt with its aggregate, alligator cracking in patches, long cracks, darker repairs, oil, the pothole's
   pale gravel floor; the walk in 1.5 m panels with dark joints and its own cracks; the gutter in 3 m pours; caliche,
   desert, rough, track and the wash bed's mud cracks; worn paint over the road; sand blown against every curb. Every mask
   in metres; every base a step of a role of records/target/BOHEMIA_STYLE_PALETTE.json, its value calibrated through the
   same rig light to his YES street (records/target/cook_floor_rig/ground_calibration.json: asphalt 67,65,62 against his
   64,61,61; dirt 169,157,135 against his 172,157,134).
4. THROUGH THE RIG, ITS OWN PIECES IMPORTED: source_pass (matte, old paint, crevice grime from the ground's own occlusion,
   dust, drift, grain, a chipped edge on every curb), dent_pass (the hand-made push), light_and_film (the one sun from the
   upper left, the cool fill, Standard view), calibrate (the 1 m cube 42 px at this ruler, the light 154.9 deg on the
   screen against the guide's 155.4), and the rig's camera: orthographic, tilted 45, facing north, never turned, heights x
   1.414, at the block's own 42.9 px a metre so a block is the 2,575 x 1,820 picture COMBAT already draws.
5. THE HOUSES COME WITH IT: on the suburb blocks (subs, corner, culdesac, suburb_stem) every old house (a whole rectangle 8
   to 13 m wide, found in the plan) is replaced by a ranch of COOK FOUR's family built by row two's modeller in the same
   scene, on the old facade's ground line, the kind its width allows (plain, porch or the L), so the house and its
   shadow and the ground under it come from one lamp. No orange roof is left on those blocks (B6 0.00).
6. THE MAP'S KIT FOR RUN: twelve seamless 12 m tiles straight down (records/target/cook_floor_rig/kit/, COOK_GROUND_KIT.json):
   asphalt, sidewalk, the curb strip, dirt, sand, the wash, rough, track, an old parking lot, the watered lawn, a shingle
   roof and a gravel roof, each a 14 m field rendered and its 2 m overrun crossfaded back over its start.

## THE SETTINGS THAT ARE NOT THE GUIDE'S, SAID PLAINLY
- WEAR 0.25 on the ground, and asphalt and paint at a share of the dust (the rig's own wear_by_material: asphalt 0.2, paint
  0.35). Measured: the guide's 0.6 dusts every face that points up, and on a ground every face points up; at 0.6 the
  asphalt could not get under 85 of 255 whatever its base.
- 32 adaptive samples and one diffuse bounce on the ground (128 put a block at half an hour, 11 s a sample on corner.1);
  the houses keep the guide's wear. The occlusion and bevel nodes at one ray a camera sample (a pixel averages them over
  its samples anyway). All of it in records/target/cook_floor_rig/blocks.json per block.
- FOR DIRECTION: the guide's classes.ground and classes.building say rig:false ('his packs at 1:1'); rule 121(j), his,
  10/19, newer, moves both to the rig. The guide is yours to update.

## THE ANALOG HORROR LINE (rule 20)
COOK TWO's one watered lawn on corner.1 stays green, its edge now a lawn's ragged edge into the caliche: the dollar died,
the water district is a ruin, every other yard is dirt, and somebody still waters this one. The houses carry COOK FOUR's
wrong things (the boarded window, the door nailed shut, the chimney with no smoke).

## WHAT IT DOES NOT CLAIM
Not in the game: COMBAT wires it (swap fight_ground.json blocks[id].src, or copy exports/cook_floor_rig/ over
slices/fight_ground/). The strip, main street, works and ruin blocks keep their old buildings on the new ground (their
commercial buildings are row two's models but not placed this round). The fight's cover pieces are row three's.

[bb Battle Brothers paints one ground per terrain, quiet under the men; height is a lit edge and a shadow on the side
away from its one light. The curb here is that, made of geometry.]
