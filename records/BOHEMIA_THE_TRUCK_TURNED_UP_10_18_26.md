# DIRECTION [the truck turned up]: THE TOY TAKEN OUT OF THE RECIPE (10/18/26)

Lane: DIRECTION (art lead). Opened by the coordinator under rules 112 to 117; no check-in. His fourteenth votes: YES on
rig round five, with 'the truck looks a little too much like a play toy for real, so turn it up, it's not gonna look
like that anymore'.

READBACK: I read [the truck turned up] as: name the toy's tells, take them out of the RECIPE (the guide's rig block and the
rig), not out of one truck, re-render the truck, show before and after in VOTE. Done means the guide's numbers moved with a
decision line and every render after this one carries them.

## THE TOY'S FOUR TELLS, AND WHERE EACH WAS FIXED

| Tell | What a toy does | Fixed in | Guide keys (rig block) |
|---|---|---|---|
| The shape | chunky: as tall as it is wide, big wheels (Kenney's truck: 1.87 long to wide, 1.8 long to tall, wheels a sixth of its length) | the MODEL: tools/bohemia_direction_model_truck.py pulls the body to a real worn pickup (5.3 x 1.95 x 1.85 m, 0.75 m tyres); the RIG measures it from --real-dims and the gate refuses a toy's proportions | proportion_tolerance 0.12 |
| The shine | a plastic highlight | the source pass: roughness 1, specular 0 (round three left 0.15) | roughness_min 1.0, specular 0.0 |
| The new paint | fresh and loud | the source pass: saturation x 0.85, and faces at the sun lose 0.15 of it more (the desert fades a roof first) | paint_sat_mul 0.85, bleach_up 0.15 |
| The perfect edge | a moulded line of one colour | the source pass: within 5 cm of every turn (a bevel normal off the true normal) the paint chips to a dark undercoat in broken patches; the shape is cut finer and pushed by 2.5 cm dents (a 3D cloud, so hard edges never crack; before the armature on a skinned body) | edge_m 0.05, edge_wear 0.85, chip_per_m 9, chip_mul [0.4, 0.33, 0.27], dent_m 0.025, dent_per_m 2, dent_subdiv 2 |

## MEASURED (report.json; S still)

| | saturation | length:width | length:height | card under the guide | ten checks red |
|---|---|---|---|---|---|
| truck round five | 0.415 | 1.87 | 1.81 | 0 of 8 | D6, D8 |
| truck round six | 0.316 | 2.72 | 2.86 | 0 of 8 | D6, D8 |
| robot round five | 0.385 | | | 0 of 8 | D6, D8 |
| robot round six | 0.307 | | | 0 of 8 | D6, D8 |

A real pickup is 2.72 and 2.86. D6 and D8 are red on everything the rig makes and on his own pack tiles (routed to PLUMBER
in round five, unchanged).

What did NOT move, honestly: the 'shine' number (the brightest 1 percent over the mean) is 51.6 to 53.4 on the truck,
because it measures the lit faces of a pale paint, not a specular spot; the specular was already small. The edge spread
held (48.0 to 47.6): the chips are a pixel or two wide at 57 px a metre and read at 2x, not as a number on the ring.
The first try (paint_sat_mul 0.72, bleach_up 0.3) took the yellow he loved to cream, saturation 0.29: the frost again by
another road. Thrown out; that is why the numbers are 0.85 and 0.15.

The biggest single tell was the shape, not the surface. That is the lesson: a toy is first its proportions.

## FILES

- tools/bohemia_direction_master_rig.py: RIG_ROUND 6; source pass (shine, old paint, worn edges), dent_pass, --real-dims
- tools/bohemia_direction_model_truck.py: REAL proportions -> reference/models/bohemia/truck.glb
- records/target/BOHEMIA_STYLE_GUIDE.json: 13 rig keys; fields 7, 10, 11 and 17 (A TOY); one decision line
- gates/style_guide_gate.py: the new keys are required; a render with a toy's proportions is refused (planted test)
- tools/bohemia_direction_the_truck_turned_up.py -> records/target/direction_the_truck_turned_up/ (truck, robot, report.json,
  DIRECTION_THE_TRUCK_TURNED_UP.png)
- VOTE: direction-the-truck-turned-up-10-18 (redo of direction-the-rig-round-five-10-18)

## FOR THE OTHER LANES

Every rig render from now carries the four rules with no flag. A lane rendering a vehicle or a prop passes --real-dims L,W,H
of the real thing; a person keeps its puppet proportions (field 10's exception: a creepy kids' show makes its people
puppets, never its trucks). RUN: the demo's truck on the map (BUILD 10/18b) is round five's; round six's rig_*.png in
records/target/direction_the_truck_turned_up/truck/ is the drop-in once he thumbs it (rule 115g).

[bb Battle Brothers draws its carts and wagons at their real proportions under a painted wear, never a new toy; the rule
here is the same, at true size.] [analog horror: a toy is clean and new, and nothing in a dead city is; the truck now
looks left out in the sun for ten years, which is the calm wrong thing.]
