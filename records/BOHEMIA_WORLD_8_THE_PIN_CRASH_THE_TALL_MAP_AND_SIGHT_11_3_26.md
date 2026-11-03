# WORLD 8 (11/3): THE PIN CRASH, THE TALL MAP DOWN TO THE STREET, AND WHAT HE SEES NOW

Rows: ask lines 117 and 185 (the map's buildings taller; the zoom down to the street) and 39 (sight only down the streets
near you), plus BOSSES FIX's crash (records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md, the HIS MAP paragraph). Rules 297
(tokens), 300 (one zoom, never a second map mode), 337 (real assets), 339 and 341 (WORLD 7's valley; no green where no water).

## 1. THE PIN CRASH (BUILD 11/3zzt, 41843539, live: pages SUCCESS)
What BOSSES FIX saw two rounds running: gates/his_map_gate.js:216 threw on the phone and the computer, a held finger's pin box
undefined, before the gate's boss steps.
MEASURED: a probe replaying the gate logged what stood under the finger: IFRAME#settleFrame. The walk to the boss's sign had
ended INSIDE A TOWN (MOB on the phone, CARTEL on the computer, by that game's seed); the town's screen stood over the map and the
held finger got THE CLINIC's line ('Your wounded heal faster here, for a price'). THE GAME WAS RIGHT: no pin from inside a town.
THE GATE WAS WRONG, three ways: it held a finger without leaving the town; the driver looks for the title once, right after
load, and on a slow box the title came up later (a whole run sat on the title); the reopen on the computer tapped a
touchscreen the computer profile has not got. Fixed in the gate: it leaves the town the way a player does (a real tap on LEAVE,
then the button's own click, then the game's close, and says which), waits for the title itself, reopens with its own profile,
and never throws on a missing box.
UNDER IT, TWO REAL REDS (F3, F6: the unseen ground showed colour, saturation 0.15 to 0.17 under the static): WORLD 7's
start-of-game sky washed the whole glass AFTER the fog and tinted his map's grey tape. Now the sky washes the ground he sees,
under the fog (BohemiaWorldStateMap.under, hook H6b in tools/bohemia_world_state_patch.py): 0.02 to 0.03.
HIS MAP 42/0 (phone 21, computer 21). A DIFFERENT VALLEY EVERY GAME 60/0.

## 2. THE MAP'S BUILDINGS TALLER, AND THE ZOOM DOWN TO THE STREET (117 + 185; BUILD 11/3zzzq)
MEASURED BEFORE (the demo, his phone 390 x 844): the pinch stopped at a block 85 CSS px wide. A house there was a painted box
about 25 px wide; his men stand 56 px; so the crew stood taller than the houses and nothing hid them (EYES q28, 10/25w). The
old street close-up (RUN 10/26) turned the camera and swapped the map for the fight's boards; he hated it (rule 300: 'why does
it have to enter a whole second map mode'), and it stays off.
[bb] Battle Brothers' map reads by its towns standing tall over the ground, the party small beside them. [Pocket City 2] one
continuous pinch from a few people on a block to the whole city, the same HUD at every level (records/BOHEMIA_PAOLO_POCKET_
CITY_2_THE_ZOOM_RANGE_9_30_26.md). How others do the close end: the same world, more detail, never a new camera.
WHAT SHIPPED (__THE_HOUSES_STAND_UP_CLOSE__, slices/bohemia_map_houses.js, hooks tools/bohemia_world_8_map_houses_patch.py):
- REAL ASSETS (rule 337): COOK's five ranch houses (built by COOK's own modeller, tools/bohemia_cook_model_buildings.py, so
  they keep their stucco and grime) and COOK PROPS' single-wide on its piers for the trailer parks, each shot four ways from
  THE MAP'S OWN CAMERA (orthographic, corner-on, 30 degrees down: the map's 2:1 ground; the master rig's one sun bolted to the
  land's north-west, the painter's own sun) by tools/bohemia_world_8_map_houses.py into slices/map_houses/ (24 pictures,
  about 400 KB, loaded once after the painting is up, never in the first load).
- TALLER: each model stands 2.0 times its metres (the fight stands its own 1.41); at the street stop a house is about 120 CSS
  px tall to his 56 px men.
- WHERE THEY STAND: the painter reports every house lot and trailer box it rolls (the same rolls at every zoom, so each house
  stands where its painted box stood) and, once the models are up, lays those lots as their yards. A burned house (the
  painter's own ruin, or WORLD 7's burned block) keeps its painted ruin and gets no model.
- ONE PINCH: from a block 96 px a tile's houses are its models, standing alone on its yards (one hand-over, no fade, section 4); the pinch
  goes on to THE STREET STOP, a block 340 CSS px (four times the old closest stop), on the same corner-on camera (the old
  second mode stays off). The old closest stop keeps its number (zoomBounds), so every check that names it still means it;
  only the pinch's own clamp reaches further.
- BEHIND THE HOUSES: his crew, the roaming parties and the hunters are covered by a model nearer the camera, by the painting's
  own depth test (the same faint outline of him when most of him is hidden). The crew walks the roads (house blocks are not
  walkable), so a house south of his road stands in front of his legs.
- THE WALK READS: past a block 90 px a block takes more beats (the mountain's own way, mapGoingBeats), so the crew crosses
  the glass at about a walk; the clock pays the same minutes a block, so a job's time stays true.
- THE FOG HOLDS: a model stands only on ground he has seen.
Gate: gates/the_houses_stand_up_close_gate.js (the table below). VOTE: world-one-pinch-to-the-street-11-3 (moving).

## 3. WHAT HE SEES NOW (39; BUILD 11/3zzzq)
MEASURED BEFORE: the rule was built (RUN 10/25, __SIGHT_DOWN_THE_STREET__: his own ring, straight down the street he stands
on 4 blocks by day or lit and 1 in the dark, nothing past a corner, a circle on the open ground past the valley) and a roaming
party outside it is not drawn. But on the glass nothing said what he sees: all the ground he had ever cleared was one light,
so a party appearing two blocks off and vanishing at a corner had no reason he could see, and EYES (10/25) never met a party
shown straight down a street (HALF).
[bb] Battle Brothers draws a party only inside your sight radius ('see the position of some caravans at all times and even if
outside your sight radius', the wiki's follower page). The strategy map's two levels of fog: the black of never seen and the
grey of seen before.
WHAT SHIPPED (__WHAT_HE_SEES_NOW__, slices/bohemia_map_sight.js): the blocks in his sight are the painting at its own light;
the ground he has seen but cannot see from here is the same painting a little dimmer (about 0.65 of its light, its shape kept), his
map remembering it; never seen stays the tape. It moves with him block by block and shrinks at night in the dark with the
street sight (15 blocks in sight by day on a straight street, 9 at night in the dark; the soft edge a quarter of a block, on the remembered side). Drawn under the fog's tape. Rule 155(b)
stands: the fog still clears a radius and stays cleared; this only shows which part of it he sees now.
Gate: gates/what_he_sees_now_gate.js. VOTE: world-what-he-sees-now-11-3 (moving).

## 4. THE LOOK AND ROADS FIRST ON THE MAP (rules 346 and 356, the coordinator's notes; BUILD 11/3zzzu)
HOW I CHECKED (rule 346): the pinch card's 41 frames from the game's camera on his phone, read at every zoom from the opening
stop to the street stop, side by side. FOUND: between a block 70 and 96 px the models faded in over the painted boxes, so every
house showed twice (the ghost rule 142 measured and killed: 'two cities ghosted through each other'); and the models, lit by the
studio's sun, were paler and brighter than the dusty painting. FIXED: one hand-over, no fade: a tile's houses are its painted
boxes until a block 96 px, then its models, and only once that tile's yards are laid (never a box and a model at once; gate M4:
at a block 100, 167 models, 0 over a painted box); and every model is toned once at load to the map's own light (a third of the
way to grey, then the map's warm dim; at bake time, never a filter or a blend on the world canvas). Streets and crossings join at
every zoom on the frames; no seam where two tiles meet (the painter's own one-texel overlap).
ROADS FIRST (rule 356(b), (f)), measured on the demo's valley: ONE network, 3,628 road blocks (arterials 2,489, freeway 952,
rail 90, Strip 81, interchanges 16), nothing stranded. 95 street ends away from the map's edge: 49 run into the city's own edge
(the mountains, the washes, the basin, the lake), 45 into a place's own gate (the solar farm, the airport and the air base, the
resorts and casinos, the stadium, the ballpark, the data fort), 1 into a suburb (41,23: a walled suburb street's end, drawn with
the painter's kerb across). Nothing needed fixing on the map's network. Gate legs R1 (one network) and R2 (where every end runs).
No picture is cut at a cell's edge: a model is drawn whole across its cells; a tile keeps one texel under its neighbour's edge.
STILL WEAK, SAID PLAINLY: at the street stop the shops, works, apartment slabs and towers are the painter's boxes four and a half
times bigger than before, flat walls and stair-stepped edges. The next job on this map is their models (COOK's warehouse, motel,
pawn shop, gas station, casino and tower casino are built), on the lots the painter already rolls.

## 5. THE MAP CAN TURN (rule 344, ask line 353, the coordinator's step 4; BUILD 11/3zzzzad)
His words (11/2, the VOTE tab, on FOUR CODES, FOUR VALLEYS): 'Dont forget u can flip the map 90 degrees fuck it! While changing the
locations and shit.'
MEASURED FIRST: the valley's generator (engine/bohemia_overmap.js, inlined in the map page by tools/bohemia_city_overmap_resync.py)
already has two switches, a north-south flip (axisFlip: the dam, the solar fields, the landfill at the other end) and an east-west
mirror (stripMirror: the Strip and the 15 change sides), both rolled from the LAND seed, which is fixed in the demo: so every game
was the same one of the four. The campaign code is known before the valley is built (WORLD 6's boot), so the flip can be dealt at
the source and everything built from the valley agrees by construction.
WHAT SHIPPED (__THE_MAP_CAN_TURN__): a NEW game's code flips the valley north to south, east to west, both (a half turn) or neither,
two bits of the code's own hash, on top of the land's own two rolls (the rolls still drawn, so the rest of the land is the same). It
is kept with the code (bohemia.world.turn.v1): the same game opens the same way; a game begun before this keeps its own valley; the
checkers' bench keeps it unless it asks (bohemia.world.bench.turn). The painter's compass now reads the valley's own north, so the
real land round the valley, its passes and its roads, turn with it (before, north was nailed to the top edge). The places keep
their real names and their own looks; the fourteen bases stand on real blocks of their kind on every valley.
NOT BUILT, SAID PLAINLY: a QUARTER turn (the I-15 running east to west). The generator and the map's drawing assume the spine runs
north to south; a quarter turn is a rebuild of the generator's layout, not a switch. The four flips are what a switch can deal.
WORLD 7's four codes land on all four ways: DUST42 as the land lies, NEVADA flipped north to south, VEGAS7 mirrored east to west,
K7QM9X turned half way. VOTE: world-the-map-can-turn-11-3 (records/target/world_8/THE_MAP_CAN_TURN.jpg).
Gate gates/the_map_can_turn_gate.js (the table below). Engine touched: the RUN slice rebuilt (rule 8), the demo re-cut.

## THE GATES (this round, this box: software drawing in a headless browser, never a phone's numbers)
- THE HOUSES STAND UP CLOSE (new): 12/0 upright phone, 12/0 sideways, 12/0 computer; with the one hand-over and the roads legs
  (BUILD 11/3zzzu) 14/0 on the upright phone. Z1 one real pinch to a block 380 on the
  same camera; Z2 the old stop keeps its number; M1 the models on the lots (29 to 53 drawn); M2 the yards flat under them, and
  without the yards the boxes stand (the mutation); M3 houses about 100 CSS px (the biggest 115 to 142) to his 56 px men; M4 in
  from the old stop, none far out; W1 behind a model covered, in front not; W2 his crew behind the models (stood on a road
  beside the houses at a block 105: the street stop's road is a block wide, so there a house stands beside his road, not in
  front of him); W3 the walk reads (5 beats a block at the street stop, 41 to 66 CSS px a second); F1 none on unseen ground;
  C1 the models paint 0.4 to 1.2 glasses of pixels a frame (on this software box the layer is up to 113 ms of a 192 ms frame;
  a phone's GPU is PLUMBER's to measure); C2 nothing threw.
- WHAT HE SEES NOW (new): 8/0 upright phone, 8/0 sideways, 8/0 computer: S1 the blocks in sight at their own light (0 to 4 off); S2 the remembered ground at 0.65 to 0.66 of its light, its shape following; S3 a party 3 blocks down his street drawn, round the corner not, 6 down not; S4 15 blocks in sight by day, 9 at night in the dark; S5 it moves with him; S6 the mutation (the layer off: 1.00); C1; C2.
- THE MAP CAN TURN (new): 24/0 on his phone, the four codes: T1 each its own flip on the land's own valley; T2 four ways, three
  turned from the land's own, four paintings; T3 one road network on each (3,628 to 3,685 road blocks) and every street end drawn
  as an end (the painter's cul-de-sac with a kerb all round, or a street the painter carries on); T4 every one of the 14 bases
  reached; T5 the land round the valley turns with it (its north the valley's own north, its east the town side of the 15; the
  pass roads cut); T6 the same 14 names on all four; T7 WORLD 7's state on the turned valley's own blocks, a fight carries its
  block's own district; T8 a game begun before this keeps its own valley; C1 nothing threw.
- ONE ZOOM, NO SECOND MAP MODE (this lane's 11/2 gate, updated: the pinch's top is the street stop; the old stop's one-to-one
  art still read where it was): 12/0.
- HIS MAP: 42/0 at the crash's ship (11/3zzt). With this round's layers, on main's newest map: 41/1, the one red F6 on the
  computer at 88% against its 90% bar, the same 88% the very first run of this round read on the phone before any change of
  mine. The cause: the fog-lifted frame draws every roaming party, his frame only those in his sight, so a passing party flips a
  patch. Fixed in the gate: the walkers set aside for the seen-ground legs (the game's own MAP_DEPTH.hide), the unseen legs read as
  before. Then 42/0 on main's newest map (phone 21, computer 21). With the map turning (any new game may now be flipped): 41/1,
  the one red F2's mutation at the whole-valley stop (3.2 against a bar of 3.05, half of 6.1) on one game; the same leg reads 2.9 to
  3.7 against 3.4 to 3.95 on other games (seed by seed, close to its bar); the phone run again: 21/0.
- A FRESH START AND A FOG OF WAR 8/0; SIGHT DOWN THE STREET 6/0; A DIFFERENT VALLEY EVERY GAME 60/0 (at 11/3zzt).
- THE MAP STANDS TALLER: 11/2 with two reds that are MAIN'S, NOT THIS ROUND'S: run again with this round's two layers switched
  off at runtime they fail the same way (W1: 5,879 of 34,361 pixels are neither him nor the building at the old near stop; W3b:
  one frame of 62 sunk on the freeway berm). Named for RUN / PLUMBER; not touched here.

## OWED (stated, not built)
- The ground under the models up close is the painter's top step (128 texels a block): at the street stop a texel is about
  2.6 CSS px, so painted towers and shops show their stair-stepped edges. A finer painter step costs about 9 million texels a
  tile (a phone cannot hold it); the honest next step is models for the shops, works and towers too (COOK's warehouse, motel,
  pawn shop, gas station, casinos are built), on the same lots the painter already rolls.
- 60 frames a second on a real phone at the street stop is NOT measured here (this box draws in software: a whole frame
  is about 200 ms here with or without the models). The models' own layer costs under half a millisecond a frame; PLUMBER,
  run the street stop on a phone.
- Lit windows at night on the models (the painted boxes had them; the models are dark at night).
