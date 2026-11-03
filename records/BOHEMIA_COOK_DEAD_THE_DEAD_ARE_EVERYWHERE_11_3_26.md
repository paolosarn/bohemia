# COOK DEAD: THE DEAD ARE EVERYWHERE (11/3; rule 360 and its amendment the same round; rule 337; ask lines 384, 394)

His words (11/3): "we don't see enough corpses even throughout the world or in the combat map... I understand... the maps not very
big of a corpse won't realistically show up, but I feel like we should take the opportunity to make things as realistic as possible,
bro, like in this economic apocalypse... at least billions of people have died." Canon: two to three billion in the first decade.
Amended the same round: "keep the bodies lore friendly... if it's a busy civilized settlement or part of the town, obviously they
don't have [corpses], but the gameplay should be very simplified."

## WHAT THIS LANE MADE
Thirteen pieces of the dead, each a real model at its real size in metres, built the way COOK PROPS built every place's things (its
modeller's hands imported whole: the props modeller's palette materials, roughness 1, specular 0), one mesh, origin at its ground
centre, front to -Y (the camera), and each shot ALONE from the fight camera through DIRECTION's master rig (source pass at the rig's
prop wear 0.6, dents, the 1/cos45 height stretch, one sun, the film; orthographic, tilted 45, facing north, 42.92 px a metre, the
block's own ruler) onto a shadow catcher cut to its pits.
- Models: reference/models/bohemia/dead/<name>.glb
- Pictures: records/target/dead/<name>.webp (anchor_px in the manifest is the ground centre)
- THE CONTRACT: records/target/dead/manifest.json (COOK PROPS' shape, one entry a model: footprint in 12 m cells, storeys,
  cover / blocking / none, sees-through, the fight's own kind and tile; plus who touched them last, what tells it, the flies,
  the pits a board cuts (holes_m: [cx, cy, half_x, half_y] in the model's own metres, depth_m), what a facade stands against,
  and THE COUNT per place with its floor)
- THE ONE VOTE CARD: records/target/dead/CARD_THE_DEAD.webp, id cook-dead-the-dead-are-everywhere-11-3: the set on two real fight
  boards (a dead street, block_ruin_0; the city's edge, block_scrub_0) beside the fight's own man at the fight's size, each board
  again at his phone's own device pixels at the fight's open zoom, then the thirteen alone, then four at the map's near stop.

THE PEOPLE ARE ONE BODY: PERSON() puts one person on named joints (head, neck, pelvis, shoulders, elbows, hands, hips, knees, ankles,
toes, and which way the chest, the face and the crown look), posed per piece (face down, on his back, slumped out of a door, seated
on a bench, folded into a cart), dressed in the runway law's clothes gone to rag in the valley's tans: the drab coat (Rick Owens'
olive), the long black gone grey in the sun, the oxblood, the ochre workwear, the bone shirt. SKELETON() is the same joints as bones.
Nothing is drawn by hand.

## THE SET (the brief's order, worst gap first), AND WHO TOUCHED THEM LAST
| # | piece | size m | the fight | who | what tells it |
|---|---|---|---|---|---|
| 1 | A BODY UNDER A TARP | 2.2 x 2.2 | none | moved | boots out one end toes up, a hand out palm up; cinder blocks and a tyre on the corners |
| 2 | A BODY IN A SLEEPING BAG IN A DOORWAY | 4.4 x 2.2 x 3.5 | blocking (the facade) | robbed | grey socks out of the bag, no shoes; his pack emptied onto the sidewalk |
| 3 | A ROW OF BODY BAGS AT A CLINIC | 9.2 x 3.2 | none, see-through | moved | a canopy with a faded cross, six bags feet-first with toe tags, the seventh only a sheet |
| 4 | A BODY SLUMPED OUT OF A CAR'S DRIVER SEAT | 4.8 x 2.8 | cover | robbed | the kit's wreck, the door hanging open, head and arm out toward the road; bonnet up, battery gone |
| 5 | A SKELETON BY A DEAD CAR IN THE DESERT | 6.3 x 4.5 | low cover | nobody | sitting in the car's shade, skull tipped, boots still on, the water jug empty |
| 6 | BONES IN THE SAND, HALF BURIED | 4.1 x 2.7 | none | moved | dragged apart over four metres (the beasts), a boot with the shin in it, a coat rag on a dead creosote |
| 7 | A GRAVE WITH A REBAR CROSS | 1.4 x 2.6 | none | buried | a ring of carried stones, a cap hung on the cross, a plastic flower, the bottle left full |
| 8 | A ROW OF FRESH GRAVES | 11.9 x 2.6 | none | buried | the soil darker the newer; two are the graveyard's own fresh graves; THE WRONG THING: one more dug than the dead, open, the shovel in its spoil |
| 9 | A BODY FACE DOWN ON THE SIDEWALK, ONE SHOE OFF | 3.1 x 1.9 | none | robbed | the pockets pulled inside out, the sock to the sky, the hat in the gutter |
| 10 | REMAINS IN A SHOPPING CART | 1.6 x 0.8 | none | moved | a body folded into the kit's cart in an army blanket tied with rope, boots over the front: wheeled toward the pit and left |
| 11 | THE PIT: A MASS GRAVE'S EDGE | 28.3 x 10.3, 1.5 deep | blocking (#), see-through | moved | the landmark: an 18 m trench, bags and sheets crosswise, the west end under a tarp, the middle under a white crust of lime with the shapes showing through, the newest not yet limed; the spoil berm, the lime sacks, three waiting in sheets, the kit's dozer, a light tower for the night shift |
| 12 | A COAT ON A FENCE | 5.5 x 0.9 x 2.3 | blocking, see-through | nobody | THE WRONG THING, never explained: a long black coat hung at a man's height on the kit's chain-link, sleeves pinned out, a hat on a stick where the head would be, boots under the hem; the boots are laced, and nobody is in them |
| 13 | A MAN ON A BUS BENCH | 3.9 x 1.9 x 2.6 | none | nobody | a stop on a street nobody is left on: chin on his chest, hat over his face, hands in his lap, as if the bus still ran |

The flies: a few specks hang low over the still ones (the tarp, the doorway, the bags, the car, the sidewalk, the cart, the bench),
never over the bones. No blood anywhere (the gate reads every model's materials). Covered, half seen, the shoes, a hand.

REUSED WHOLE (REUSE-FIRST): COOK PROPS' modeller and its shot; the kit's wreck.glb (pieces 4 and 5, turned so the driver's side faces
the camera), cart.glb, fence.glb, dozer.glb; the graveyard's graveyard_grave_fresh_0/1.glb (COMBAT 10/24); the props modeller's sack.

## THE SCALE, MEASURED (this is the thing to know)
The fight board is drawn at the world's size: a 12 m house a tile, 42.92 px a metre in the board's art. The fight draws its men at
MAN_ROWS = 1.8 rows of their ground (slices/BOHEMIA_FIGHT.html, rigScale), about 6.7 times the world's size, the way it already
draws a man three car lengths tall. The dead are the world's size, like its cars and COOK PROPS' things. So, on his phone:
- at the fight's open zoom (about 9 tiles across 390 points): a body lying down is about 6 points long (19 device pixels), the bag
  row about 33 points, the pit about 100 points across; the man is about 55 points tall.
- pinched in to the near stop (121 points a tile): a body is about 18 points (54 device pixels).
- at the map's near stop (14.25 px a metre): a body is about 26 px, the bag row 130, the pit 400.
He said it himself ("a corpse won't realistically show up"); the realistic answer is MORE of them and in clusters: the bag row, the
graves and the pit read at the open zoom, the single bodies read pinched in. If he wants single bodies to read at the open zoom, the
lever is the fight's man scale, not the dead (that is COMBAT's, and his).

## THE COUNT: HOW MANY PER PLACE (for COMBAT MAPS 3, after its roads; the manifest's places[] carries each count and its floor)
More in the poor blocks and the old camps, fewer where people live and bury, and THERE NONE (rule 360 amended (a)): where people live
and keep order (a home base, a settlement's own block, a faction town, any board on its reclaimed future) the dead are graves only.
| place | suggested pieces | floor | why |
|---|---|---|---|
| downtown | 3 doorway, 2 sidewalk, 2 cart, 2 tarp, 1 bench, 1 coat | 8 | Fremont, the oldest camps |
| wash | 2 cart, 2 tarp, 1 bones, 1 sidewalk | 4 | the tunnel camps |
| trailer | 2 tarp, 1 sidewalk, 1 cart, 2 grave_cross, 1 car_driver, 1 coat | 6 | the poorest park in the valley |
| strip | 1 sidewalk, 1 doorway, 1 bench, 1 bag_row | 3 | the casinos were the morgues; a held casino's door is swept |
| works | 1 tarp, 1 car_driver, 1 bones, 1 sidewalk, 1 coat | 4 | the rail yard's camps |
| pass | 2 car_driver, 1 desert_skeleton, 1 bones, 1 tarp | 4 | the road out: the exodus died in its cars |
| landfill | 1 mass_grave, 2 tarp, 1 cart | 3 | where the trucks took them |
| lab | 1 bag_row, 2 tarp, 1 sidewalk | 3 | the staff who stayed with the animals |
| airport | 1 bag_row, 1 car_driver, 2 tarp | 3 | the terminal was a clinic |
| desert | 1 desert_skeleton, 2 bones, 1 grave_cross | 3 | the ones who walked out |
| shore | 2 bones, 1 tarp, 1 grave_cross | 3 | the falling lake gives up its dead (it did, in 2022) |
| marina | 1 bones, 1 car_driver, 1 tarp | 2 | the boats people lived on |
| redrock | 1 bones, 1 desert_skeleton, 1 grave_cross | 2 | the scenic loop's parked cars |
| golf | 1 grave_row, 2 grave_cross | 2 | where they bury: graves only |
| suburbs | 2 grave_cross, 1 coat | 2 | where people still live: graves only |
| the city's boards: ruin 8 (floor 6), main 5 (4), corner 4 (3), freeway 5 (4), casino 3 (2), scrub 5 (4), subs 3 (2, graves only), lots 3 (2, the pit at a stadium's lots) | | | |
Futures: raided, half again (round up) and the tarps come off; reclaimed, every body becomes a grave (the game starts in the ruin and
the future gets better, his second votes). The map (WORLD): the pit at each stadium's lots and the landfill, the grave rows on the
parks, golf courses and school fields, a bag row at the hospitals; single bodies on the blocks the counts name.

## WHERE EACH LIES (the coordinator's note on rule 360 amended: the dead lie where nobody is left to move them)
Every piece in the manifest carries `where`, one or more of seven kinds of ground: empty_block, road, desert, camp_ruin, fallen_town,
clinic_overrun, never_lived_in. ZERO bodies where people live and keep order (a home base, a settlement screen's own block, a faction
town, a busy civilized part of town, any board on its reclaimed future: `lived_in_places.bodies = 0`); only the graves (grave_cross,
grave_row) may stand there, because that is the living burying their dead.
| piece | where |
|---|---|
| tarp | empty_block, camp_ruin, fallen_town, road |
| doorway | empty_block, camp_ruin, fallen_town |
| bag_row | clinic_overrun |
| car_driver | road, empty_block |
| desert_skeleton | desert, road |
| bones | desert, never_lived_in |
| grave_cross | desert, fallen_town, never_lived_in (and where people live) |
| grave_row | fallen_town, never_lived_in, clinic_overrun (and where people live) |
| sidewalk | empty_block, fallen_town |
| cart | camp_ruin, empty_block, road |
| mass_grave | never_lived_in, fallen_town |
| coat_fence | empty_block, fallen_town, road |
| bench | empty_block, fallen_town |

## SIMPLE (rule 360 amended (b))
Every piece is scenery that tells the story, at most what a board already does with a thing on a tile: cover (the car), low cover
(the skeleton's sunk car), a blocker (the doorway's facade, the fence, the pit). No rough ground, no new rule, no loot, no event;
`interaction` is null on every piece.

## WHAT THIS DOES NOT DO
It places nothing: no board, no fight code, no fight_ground.json, no map (COMBAT MAPS 3's and WORLD's). It changes nothing in the
alpha or the demo, so the build stamp stands (the VOTE tab reads the registry live). Until COMBAT MAPS 3 places them they are seen in
the VOTE tab only.

## THE GATE
gates/the_dead_are_made_gate.py (suite row THE DEAD ARE MADE): the set (twelve or more, real glTF, picture at the board's ruler,
ground pixel inside), the fight's own words only, who touched them last told for each and all four used, no blood in any model,
every pit inside its piece, COMBAT MAPS 3's fifteen places each with a count and a floor, graves only where people live, the VOTE card
with a real sha. OWED and printed, not red: the boards carrying them past each floor (COMBAT MAPS 3's leg, with its placing) and the
map (WORLD). The same round the suite's table had one row with three fields (NOTHING TAPPABLE UNDER THE PHONE, RUN TWO's, a browser
walk of every town) and refused to run any gate; its missing slow flag was added (True).

## TOOLS
tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py (`models [id ...]` under bpy 4.2 in a python3.11 venv: the whole set in about
two minutes on four cores, the pit 54 s) and tools/bohemia_cook_dead_card_11_3_26.py (`manifest`, `card`, plain python).

[bb Battle Brothers leaves the battlefield's dead where they fell and its world map's ruins and graveyards tell a story without a
rule; ours are scenery the same way, cut from the place the fight is on.]
[analog horror: the frame is ordinary and one thing in it is wrong: a coat on a fence that is almost a man, and one more grave dug
than there are dead.]
