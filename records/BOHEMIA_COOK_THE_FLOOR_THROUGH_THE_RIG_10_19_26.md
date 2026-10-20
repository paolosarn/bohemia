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

## MEASURED: DIRECTION'S FLOOR BAR ON EVERY BLOCK (tools/bohemia_direction_floor_bar.py, at the block's own pixels)
The bar: B1 saturation <= 0.28, B2 hue 36 to 50, B3 two-tone split <= 9, B4 grit 11 to 15.5, B5 road repeat <= 0.35, B6
orange <= 0.5 percent. The shipped floor failed all six on every block DIRECTION measured.

| block | 3D houses | B1 sat | B2 hue | B3 split | B4 grit | B5 repeat | B6 orange % | result |
|---|---|---|---|---|---|---|---|---|
| corner.0 | 6 | 0.201 | 38.5 | 12.1 | 12.26 | 0.28 | 0.0 | B3 out |
| corner.1 | 4 | 0.198 | 38.6 | 8.9 | 12.31 | 0.286 | 0.0 | ALL SIX |
| corner.2 | 5 | 0.199 | 38.5 | 10.0 | 12.29 | 0.285 | 0.0 | B3 out |
| culdesac.0 | 6 | 0.201 | 38.6 | 10.4 | 12.32 | - | 0.0 | B3 out |
| culdesac.1 | 6 | 0.202 | 38.5 | 10.4 | 12.3 | - | 0.0 | B3 out |
| lots.0 | 0 | 0.195 | 38.8 | 3.3 | 12.38 | 0.099 | 0.0 | ALL SIX |
| main.0 | 0 | 0.258 | 37.0 | 21.9 | 12.3 | 0.1 | 6.73 | B3, B6 out |
| main.1 | 0 | 0.259 | 36.9 | 22.6 | 12.31 | 0.099 | 6.74 | B3, B6 out |
| ruin.0 | 0 | 0.236 | 37.5 | 23.7 | 12.52 | 0.098 | 4.39 | B3, B6 out |
| ruin.1 | 0 | 0.233 | 37.6 | 24.2 | 12.5 | 0.099 | 4.5 | B3, B6 out |
| scrub.0 | 0 | 0.205 | 38.5 | 4.7 | 13.55 | - | 0.02 | ALL SIX |
| scrub.1 | 0 | 0.205 | 38.5 | 4.8 | 13.57 | - | 0.02 | ALL SIX |
| scrub.2 | 0 | 0.205 | 38.5 | 4.8 | 13.56 | - | 0.02 | ALL SIX |
| strip.0 | 0 | 0.239 | 37.9 | 33.8 | 11.9 | 0.298 | 0.0 | B3 out |
| strip.1 | 0 | 0.24 | 37.9 | 30.4 | 11.98 | 0.299 | 0.0 | B3 out |
| subs.0 | 8 | 0.201 | 38.5 | 11.8 | 12.24 | 0.099 | 0.0 | B3 out |
| subs.1 | 7 | 0.202 | 38.5 | 10.5 | 12.26 | 0.098 | 0.0 | B3 out |
| subs.2 | 7 | 0.201 | 38.5 | 11.2 | 12.28 | 0.101 | 0.0 | B3 out |
| subs.3 | 9 | 0.203 | 38.3 | 12.6 | 12.27 | 0.094 | 0.0 | B3 out |
| suburb_stem.0 | 8 | 0.203 | 38.4 | 12.8 | 12.25 | 0.282 | 0.0 | B3 out |
| suburb_stem.1 | 8 | 0.202 | 38.4 | 13.6 | 12.25 | 0.283 | 0.0 | B3 out |
| wash.0 | 0 | 0.202 | 39.5 | 9.3 | 13.44 | - | 0.0 | B3 out |
| wash.1 | 0 | 0.202 | 39.5 | 9.3 | 13.43 | - | 0.0 | B3 out |
| works.0 | 0 | 0.261 | 37.4 | 27.5 | 11.84 | 0.093 | 0.09 | B3 out |

Said plainly: B1, B2 and B4 pass on all 24 (the dirt is his YES street's colour and grit); B5 passes on every block with a
road (the old floor failed 4 of 6); B6 passes on 20 (main.0/1 and ruin.0/1 keep their old buildings, the orange is theirs);
5 pass all six. B3 is the honest miss: on the town blocks the tan 3D roofs and the pale walks are counted as dirt cells
beside the caliche (10 to 14), on the strip, works and ruin blocks the old buildings are (22 to 34), and on the wash the
maker's own rock shadows and the bed make 9.3 against 9. The open desert passes everything.

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

## THE SHOTS (tools/bohemia_cook_the_floor_through_the_rig_shot_10_19_26.js, COOK TWO's shot script, the folder changed)
The real fight (slices/BOHEMIA_FIGHT.html) on the one driver's phone (390 x 844 at 3x), boards suburb, culdesac, strip,
desert and ruin at seed 1 by day, as it ships and with the blocks answered from records/target/cook_floor_rig/ by the
driver's serve map (nothing in slices/ touched): the opening frame and the close stop, 0 page errors on all ten. The sheet
records/target/COOK_THE_FLOOR_THROUGH_THE_RIG.webp lays them now | new, and corner.1 at 1:1.

## THE LOOP
1. The first block (corner.1, 128 samples) ran half an hour: the source pass's occlusion and bevel nodes cast 8 rays each
   per camera sample; one each, 32 adaptive samples and one diffuse bounce took it to five minutes.
2. The asphalt was mush and the dirt smooth (grit 4.6): cracks 2.6 cm wide and 35 percent of the road, the aggregate
   stronger, the gutter pan added, potholes every 70 m2; the dirt's grit to 30 a metre (12.3).
3. The sidewalks counted as dirt cells and split the tones: the walk went to a grey concrete (sat 0.07).
4. The zebras correlated at two tiles (B5 0.6): the paint went dull and worn (120 of 255, as his kit's).
5. The orange houses stayed on the 3D ground: the ranches went in, in the same scene; then they were all one house
   (DIRECTION's 'one house copied nine times'): two kinds a width and a tract's shades, never two side by side the same;
   then the porches stood on the walk and the L ranch on its neighbour: the porch houses set back by their porch, no L.
6. The wash bed read paler than the desert (B3 9.2): matched to it; the rock shadows keep it at 9.3.
7. A batch switch cut wash.1's file mid-write (a black block in the first desert shot); the switch now waits for the
   file, and the worker restart killed the last renders once (they ran again).

## WHAT IT DOES NOT CLAIM
Not in the game: COMBAT wires it (swap fight_ground.json blocks[id].src, or copy exports/cook_floor_rig/ over
slices/fight_ground/). The strip, main street, works and ruin blocks keep their old buildings on the new ground (their
commercial buildings are row two's models but not placed this round). The fight's cover pieces are row three's.

[bb Battle Brothers paints one ground per terrain, quiet under the men; height is a lit edge and a shadow on the side
away from its one light. The curb here is that, made of geometry.]
