# COMBAT MAPS 3 [every place its own board] 11/3/26 (VAMILY rule 341, ask line 350; supersedes the narrow brief of ask line 349)

Paolo 11/3: "everything just looked exactly the same as the main suburb shit we have and then you gave a bunch of greenery to
the suburb, bro this is an economic apocalypse, nothing made them uniquely unique, nothing made them fun to do, no variety, like
true variety, it was just recycled hogwash... you're not done." (His VOTE before it, the twelve fight grounds of COMBAT MAPS 2:
all kept, all work in progress, nine called dogshit: records/BOHEMIA_THE_VOTES_11_2_26.txt, second export.)

## THE GATE FIRST: gates/every_place_its_own_board_gate.js (in the suite as EVERY PLACE ITS OWN BOARD)
COMBAT MAPS 2 measured a colour (old sand %) and never the plan. This deals 10 fights a place in the live fight (the headless
bench, the alpha's own hand-over) and measures each board on its PLAN in the fight window (your back column to two past their
front): open, cover, blocked, see-through fence, height, slow, one-wide lanes, the same seven in the middle between the lines,
and where their men start (the start's mode, their spread, their gap). The plan distance between two places is the sum of
those shares' differences plus the start's shape. Every BUILT place must: differ from all fifteen and from the suburb by 0.6
or more; deal 10 different boards in 10 fights; stand its landmark between the lines in every fight; start as the two plain
lines in at most 60% of fights; name its landmark, things and twist in ours.place_boards. The suburbs and the golf course must
be under 1% green-or-olive pixels (green at or over red and 18 over blue: hue alone missed the olive he saw). A place not yet
built must be on the gate's OWED list, which only shrinks.

THE BEFORE (main as it stood, records/target/combat_maps_11_3/gate_before.json):
- ALL FIFTEEN PLACES STARTED THE SAME: 10 of 10 fights at every place were the two plain lines, columns 3 and 9, their spread
  0, the gap 0.60 every time. That is "the same two columns of men at the left and right edges".
- THE LAB YARD was 0.29 from the works (its picture was the works'), THE SHORE 0.21 from the marina, THE TRAILER PARK 0.54 from
  the works: three pairs under the floor.
- GREEN-OR-OLIVE: the suburb's twelve blocks 28 to 38% of their pixels, the golf course's 57%.
- No place named a landmark, its things or a twist anywhere: there was nothing to name.

## KILL THE GREEN (rule 341(4))
COMBAT MAPS 2's dead lawn and dead fairway were painted from metal_painted (olive drab) with a mustard alt, and read green on his
phone. They are now clay_bone's dark step with grey (dead bermuda thatch, grey-brown; a Vegas lawn with the pumps off goes this
colour in weeks, and AB 356 bans decorative turf water from 2027), the weed tufts dark brown. The plates were re-rendered through
the rig and the twelve suburb blocks and golf.0 re-laid on their pre-COMBAT-MAPS-2 pictures (c7f7ce05^); the lay now also takes
the old green itself (golf.0's green, one tidy lawn on corner.1). The small caliche blotches on the lawns read as camouflage
(his 10/19 NO) and are gone. AFTER: every suburb block 0.03 to 0.16% green-or-olive, golf.0 0.38%.

## EVERY PLACE ITS OWN BOARD (the fight: slices/BOHEMIA_FIGHT.html placeOwn, dealOwn, placeOwnStart)
A place with built: true in ours.place_boards deals ONLY its own blocks: its LANDMARK block in the column your line faces (the
middle between the lines) in a row the deal picks, its field blocks round it (mirrored or not, never beside their twin; a place
may pin blocks to a column or a row), and WHERE THE TWO SIDES START by the place's own weights: the line; WIDE (their line two
tiles farther off, open ground); CAMP (they stand round the landmark, shooters behind it: Battle Brothers' camp you walk into);
PINCER (split onto both flanks ahead of you: its ambush). Always on the ground (rule 256) and with the wiki's five clear tiles
in front of your front column. The cell seeds it (rule 46a). A built board is never thinned or filled by the ground's cover
envelope (it is designed). A piece modelled into its block's picture has no sprite of its own (baked).

## THE MODELS (rule 337)
COOK PROPS' manifest (records/target/fight_props/manifest.json) did not exist when these three were ready (checked 01:20; this
lane modelled them from 01:35); its first three places landed on main at 01:55 (cc33b0fd) while these were rendering, so push 1
ships this lane's own models for the lab yard, the airport and the golf course, and the places after it are built on COOK
PROPS' models (their .glb imported into the same render, on the tile their manifest names). This lane modelled each of the
first three places' own things itself, through the master rig, in the same render as the ground (the floor tool's ground and stones with
COMBAT MAPS 2's grounds, the not-final tool's junk and grime, the rig's source pass, dents, one sun and film, the block camera):
tools/bohemia_combat_maps_every_place_its_own_board_11_3_26.py. Each block's tile map is written first and every 'X', 'C', 'c',
'#' and 'H' has its thing drawn on it (the honest grid). Only the present is rendered: the fight reads no futures picture.

## PUSH 1: THE LAB YARD, THE AIRPORT, THE GOLF COURSE
| place | landmark | its own things | the twist | starts |
|---|---|---|---|---|
| THE LAB YARD (medical) | THE PENS: eleven chain-link beast pens with razor wire, dens and troughs, one burst open from inside | gurneys, IV poles, the decon shower line on its hazard pad, the vivarium's back wall and loading dock, the cold-store truck with its doors open, generator and red-bin cages, a dead ambulance, an intake van, kennel runs | LANES AND GATES: a pen or a run is a fenced tile (no step, the shot goes through), so the fight runs down one-wide lanes; shooters own it, melee finds the gate | camp 2, line 1 |
| THE AIRPORT (airport, airbase, terminal) | THE WRECK: a twin-prop commuter on its belly, nose to your line, its tail torn off nine metres behind | LD3 cargo cans and bags thrown round it, an engine cowling, the hangar (a roof three storeys up), the fuel truck, two baggage cart trains, the terminal's glass wall and a jet bridge stub, a belt loader, a dead tug, cones | A SHOOTER'S GROUND: open slab, their line usually starts two tiles farther off, the wreck's four cover tiles are the only real cover in the middle, the hangar roof the one height | wide 2, camp 1, line 1 |
| THE GOLF COURSE (golf, park) | THE CLUBHOUSE AND THE 18TH: the stucco clubhouse (its roof climbable), its torn awning over a patio of knocked-over tables, the carts in their row, the dead 18th green and its flag | golf carts (one on its side), a ball washer, a rake in the bunker, a stone rain shelter, a stand of dead pines, the dry water hazard with its torn liner and the balls it hid, dead palms (golf.0) | SAND AND ROOFS: bunkers and the dry pond are slow ground in the open, the clubhouse roof the one height, and they may come at you from both flanks | line 1, pincer 1, wide 1 |
THE GATE AFTER PUSH 1 (10 fights a place): THE LAB YARD 1.71 from its nearest place (floor 0.6), started camp 6, line 4; THE
AIRPORT 1.48, wide 5, camp 4, line 1; THE GOLF COURSE 1.48, line 4, wide 3, pincer 3; each 10 different boards in 10 fights,
its landmark between the lines every time. Suite: EVERY PLACE ITS OWN BOARD PASS (3 of 15 built, 12 owed).
THE CARDS (VOTE tab): records/target/combat_maps_11_3/card_<place>.webp, before (COMBAT MAPS 2's own after shot) | after (the
opening view) | in play (round 3 on AUTO), his phone 390 x 844, by day (tools/bohemia_combat_maps_every_place_its_own_board_shots_11_3_26.js).

Analog horror, one wrong thing a place, nothing remarks on it: one pen's trough is full of clean water; one suitcase stands
packed and upright on the bare slab far from the wreck; the flag on the dead green stands straight out in a wind that moves
nothing else.

## PUSH 2: THE TRAILER PARK, THE DESERT, RED ROCK, THE PASS, THE SHORE, THE WASH (on COOK PROPS' models)
COOK PROPS' .glb models (records/target/fight_props/manifest.json) are imported into the same render as the ground, each on the
tiles its manifest names, turned in quarters, centred on its footprint (the pylon's origin is at its footings), and every tile
map follows its model's own fight rule (their Joshua trees are decoration the fight walks past; their carport is no height; their
fin and slot are walls; their rockfall is a heap you climb; their dock a deck). This lane adds only what their list lacks (the
grounds, the trailer park's office, laundry, mailboxes, dumpsters and a car under a tarp, the desert's creosote and bank rocks,
the pass's cut face and drop, the wash's levees and road fill, the shore's crusted ring and store).
| place | landmark | the twist | starts |
|---|---|---|---|
| THE TRAILER PARK (trailer) | THE ROWS: single-wides end to end on their blocks, one burnt to its shell | a maze of one-wide lanes between trailers you cannot see through: close, melee ground and chokepoints | camp 2, pincer 1, line 1 |
| THE DESERT (desert) | THE PYLON: a lattice tower fallen across a dry wash (six tiles: no step, the shot goes through) | open dark pavement cut by the wash between the lines: soft and slow, its banks a step up | wide 2, line 1, camp 1 |
| RED ROCK (springs) | THE FIN AND THE SLOT: a sandstone fin split by a slot one man wide | ledges one, two and three storeys up (rule 321), the climb costs the attack (rule 328), the slot a one-wide lane | line 1, camp 1, pincer 1 |
| THE PASS (mountain) | THE JACKKNIFE: a semi across the road, a rockfall heaped over the other lane | the road the only fast ground; slow scree and ledges above, the drop below no man walks (no step, the shot goes over) | pincer 2, line 1 |
| THE SHORE (reservoir, dam) | THE INTAKE TOWER standing on the dry bed, a dock come to rest beside it | the mud is swamp (slow, you fight worse); one gravel bar through it and the bathtub ring's step onto the old shore | line 1, camp 1, wide 1 |
| THE WASH (wash, basin) | THE CULVERT: a twin box culvert under a road embankment | a low concrete channel between two high banks runs between the lines; its silt is slow, the banks are height, the culvert the one covered way through | line 1, pincer 1, camp 1 |
The wrong thing in each is COOK PROPS' own (the spotless washing; the buried car's headlights on; the cairn where nobody could
climb; the empty spotless trailer; the anchor line taut into dry mud; the floor lamp lit, plugged into nothing).

## PUSH 3: THE LANDFILL, THE SUBURBS, THE STRIP, DOWNTOWN, THE WORKS, THE MARINA (on COOK PROPS' models)
| place | landmark | the twist | starts |
|---|---|---|---|
| THE LANDFILL (landfill) | THE FLARE: the gas flare still burning among the trash mounds, a dozer stopped mid-push | the mounds are height you climb for the shot; the gas round the flare burns the ground from round one (a piece with burning: true is On Fire for the whole fight: the cell vest's own rule 305, 15 to 30 to a man who ends his turn in it; walking through is free) | line 1, camp 1, wide 1 |
| THE SUBURBS (suburb, estate, gated, town, school, chapel, library) | THE BACKYARDS: block walls along the lot lines, the empty kidney pools | the walls are cover you fight along (runs of them with gates between), an empty pool is a pit (slow, nothing to hide behind in it), the ranch houses are roofs; dead brown lawns | line 1, pincer 1, camp 1 |
| THE STRIP (strip, sign, sphere, strat, convention; the casinos keep their floors) | THE FOUNTAIN: a dry plaza fountain, a giant arrow sign fallen beside it, a limo at the valet | open marble with the fountain's rim the cover in the middle, the sign a wall, the pedestrian bridge two storeys over the Boulevard | line 1, wide 1, camp 1 |
| DOWNTOWN (downtown) | UNDER THE CANOPY: a bay of the Fremont canopy over the street, the burnt Deuce under it | alleys one man wide between three-storey brick backs whose fire escapes climb to the roofs; the bus closes half the street | line 1, pincer 1, camp 1 |
| THE WORKS (industrial, rail, railyard, warehouse, storage) | THE CARS AND THE GANTRY: a boxcar and a tank car on the spur, the gantry with a car on its hook | the cars are a wall across the yard with one crossing; the pipe stacks and the gantry's legs the cover either side | line 1, camp 1, pincer 1 |
| THE MARINA (water, intake) | THE HOUSEBOAT sat on its pontoons on the dry bed | open dry mud where the boats are the only cover; the houseboat's deck the one height | wide 1, line 1, camp 1 |

## THE GATE AFTER ALL THREE PUSHES (records/target/combat_maps_11_3/gate_after.json; before: gate_before.json)
All fifteen built, OWED empty, PASS. 0 pairs of places within the floor (0.6) of each other (before: 3, the lab yard 0.29 from the
works, the shore 0.21 from the marina, the trailer park 0.54 from the works). Every place deals 10 different boards in 10 fights
and its landmark stands between the lines every time. The two plain lines at the edges (before: 10 of 10 at all fifteen): now
1 to 5 fights in 10, the rest wide, camp or pincer. Each place's nearest other place: the lab yard 1.21 (the trailer park), the
airport 0.69 (the Strip), the golf course 1.02 (the marina), the trailer park 0.99 (the suburbs), the desert 1.36 (the landfill),
Red Rock 0.79 (downtown), the pass 1.85 (the shore), the shore 1.36 (the desert), the wash 1.08 (Red Rock), the landfill 1.10
(the wash), the suburbs 0.78 (the works), the Strip 0.69 (the airport), downtown 0.79 (Red Rock), the works 0.78 (the suburbs),
the marina 0.98 (the Strip). Green-or-olive: the suburbs 0.1-0.2%, the golf course 0.0-0.4%.
Downtown first measured 0.597 from Red Rock (every brick back a climbable roof, so its alleys were not lanes): only a back with
a fire escape is climbed now and the rest are walls (its two blocks re-rendered, their fire escapes only where the tile is H).

## WHAT IS LEFT
- The fight's futures pictures (raided, reclaimed) are not read by the fight: none were made for the new blocks.
- The lab yard, the airport and the golf course stand on this lane's own models (made before COOK PROPS' first batch landed);
  COOK PROPS' cage block, plane, hangar front, clubhouse front and the rest are not on those boards yet.
- COOK PROPS marks the propane tanks and the tank car 'burns if hit': that is a new rule (a hit on a piece sets the ground on
  fire) and was not built; the landfill's ground burns from round one by the fight's existing rule. Downtown's 'under the canopy
  no shot from a roof' is likewise a new rule, not built: downtown's twist is its alleys and fire escapes.
- gates/tiles_are_legos_gate.py LEG 3 lists every block COMBAT MAPS 1 shipped as not in records/target/bb/BOHEMIA_GROUND_EDGES.json;
  this round's blocks join that same list (red on main before this round, the same red after).

[bb] Battle Brothers builds a tactical map from the world tile it is fought on (its terrain kinds, height levels and obstacles),
its camps and ruins have their own built plans, and its battles open in a line, in an ambush, or with the enemy in its camp.
[analog horror] at the source, in the models and the grounds, never a filter: the lines above.

---------------------------------------------------------------------------------------------------------------------------------
# RULE 346 (ask line 355): THE STRIP IS THE BEST FIGHT MAP, AND NO BOARD BREAKS ITS OWN PICTURE

Paolo 11/2 in the VOTE tab: on the Strip "The worststtt this needs to be THE BESTTTT Work in progress keep going"; on downtown
"Looks like shit Work in progress keep going"; on every ground "Needs way more work watch out for atraight lines at grid borders
and colors that end abruptly and roads that dont connect and things that dont visually and logically make sense"; the other nine
"Work in progress keep going".

## THE LEGS FIRST: gates/every_place_no_seams_gate.js (suite row NO BOARD BREAKS ITS OWN PICTURE), reads in
## tools/bohemia_combat_maps_seams_read_11_3_26.py
Bakes every built place's board three times in the LIVE fight (its own bakeBoard, UI.board: the picture every tile is drawn
from) and reads every border between two cells of OPEN ground (a wall on its house tile is the honest grid, not a seam):
- SEAM: the colour step across the border (5 px either side, the fight's own 1 px grid line stepped over) against the step
  across the middle of the two cells (the ground's own texture); seen when its median is 2.2x that and 9 or more. Block seams
  (where two pictures meet) and cell borders inside a picture are counted apart.
- CUT-OFF: the two sides are different colour families and three quarters of the change happens within 4 px of the border.
- ROADS: every road (asphalt, road paint) that reaches a block seam is met within half a metre across it, read from each
  block's own ground plan as dealt (mirrored or not).
- LOGIC: a by-eye list per place (records/target/combat_maps_11_3/logic_list.json: a car in a wall, a dock on a road, a tree
  through a roof), tied to the sha1 of the place's own pictures, so a changed picture is a list nobody has checked yet.
Floors for a fixed place: block seams seen 12% or less, cell borders seen 4% or less, cut-offs 4% or less, roads not met 0,
logic checked. OWED_SEAMS names the places not fixed yet; it only shrinks.

## THE BEFORE (main, records/target/combat_maps_11_3/seams_before.json) -> AFTER PUSH 1 (seams_after_push1.json)
place     block seams seen   cell borders seen   cut-offs        roads not met (of 51)
strip     70%  -> 0%         25%  -> 1.9%        19%  -> 0%      49 -> 0     REBUILT
downtown  74%  -> 0%         40%  -> 0%          23%  -> 0%      47 -> 0     REBUILT
lab       88%  -> 0%         35%  -> 1.6%        23%  -> 0.7%    51 -> 0     re-rendered
(owed, not judged yet, measured after the feathering below: airport 0%/0%/0%/22 roads; golf 0/1.7/0/0; trailer 0/2.3/0/0;
desert 0/0/0/0; redrock 0/5.0/0/0; pass 0/1.5/0/0; shore 8.9/3.9/1.7/0; wash 0/6.9/0.5/0; landfill 0/6.1/0/0; suburb 78/36/26/49;
works 48/5/2.6/36; marina 57/3.3/9.4/36: the last three still carry the old town blocks whose streets meet nothing.)

## WHAT MADE THE LINES (measured, then fixed at the source)
1. Two pictures of one place met with different ground at their shared edge (per-block noise patches cut at the seam).
   ONE GROUND AT EVERY EDGE: each kind's base ground in a 3 m wandered margin round every block, except under a mass and where
   a road, a track or a path runs on (MARGIN, THROUGH in the tool); and every place's own kinds now feather where two of their
   pictures meet in the fight (FEATHER_KINDS, slices/BOHEMIA_FIGHT.html), as the valley's edge always did.
2. Roads, drives, tracks and paths ended at a block's side. EVERY ROAD AT THE SAME ROWS: the Strip's drives at two fixed rows on
   the Boulevard and on every frontage (DRIVES), Fremont's mall and alley edge to edge, the trailer park's lane, the yard's spur,
   the landfill's haul road and the golf cart path through every block of their place; the old town blocks (with their own
   streets) leave the places they were mixed into.
3. Kerbs, verges and patches on the grid's own lines: every kerb and material edge set off the cell borders (the Boulevard's
   kerbs at 10 and 50 m, the drop-off lanes at 13.5 and 22.5, the pass's shoulders, the forecourt's marble at 25.6).
4. A thing drawn along a grid line: downtown's canopy beam sat on a row border, the south side's shops had their party walls on
   the cell lines (both measured at 20% of downtown's cell borders; the arches moved 4 m, the walls set at uneven widths: 0%).

## THE CAMERA RULE (why the old Strip and downtown failed; graveyard/the_strip_and_downtown_11_3_26/POSTMORTEM.txt)
The fight's camera looks north at 45 degrees: a building's east and west faces are never seen, only its south face, and a
mass's height is drawn as far north as it is tall. So: a casino faces the camera, never the street beside it; no open tile has a
tall mass south of it (its roof would be drawn over the tile behind it and the men standing there would stand on a roof).

## THE STRIP, REBUILT (the showcase): 7 blocks, dealt with the Boulevard always in column 1 between the lines
blvd.1 THE BRIDGE AND THE WELCOME SIGN (landmark: COOK PROPS' bridge from the kerb to the median on its pier, its stair tower on
the sidewalk, the limo dead under it, the Welcome sign's diamond in the median with its dead bulbs), blvd.2 THE BOULEVARD (six
lanes, cabs and wrecks nose to tail, the tour bus on its side, the median's dead palms and lights), stripw.1 THE PORTE-COCHERE
(the gold tower, its rooftop pool, the porte-cochere over the drop-off as height, the fountain), stripw.2 THE MARQUEES (LED
pylons, slots spilled out of the door), stripw.3 THE VALET (the tallest gold tower, its dead name on the roof, the valet's last
three cars), stripe.1 THE FALLEN SIGN (the pink tower, COOK PROPS' arrow sign fallen across its drive), stripe.2 THE PINK TOWER.
Every frontage reads from the Boulevard out: sidewalk pavers, the teal border band, the drop-off lane, the forecourt's inlaid
marble diamonds, the tower. The plan gate needed a third west frontage: 24 layouts dealt 9 different boards in 10 fights.

## DOWNTOWN, REBUILT: Fremont Street across the middle
fremont.3 UNDER THE COWBOY (landmark: the cowboy on his lattice tower, the burnt Deuce, kiosks), fremont.4 THE MALL (the zipline's
landing tower), both with COOK PROPS' canopy bays in a row down the street, screens to the camera, one panel still lit (the
horror); fremont.5 THE FRONTS and fremont.6 THE ARCADE (the north side's casino fronts facing the camera: sign bands, dead
letters, bulb rows, marquees over the doors, terrazzo at the doors), fremont.7 THE ALLEY (the south side: one-storey shops,
three-storey backs, the only fire escape climbed, the alley edge to edge with its dumpsters). Mirrored: yes.

## THE GREY PLACES (pushes to come): three new grounds rendered through the rig, the real ground's colour, never a recolour:
dustslab (Harry Reid's apron, the valley's caliche dust on it), lakemud (Lake Mead's tan cracked bed), passtan (buff limestone
scree, iron-red in it). The airport gains a third field block (apron.4 THE STANDS, on COOK PROPS' fuel truck and baggage train)
and loses apron.0; the shore's gravel bars cross every block side at its middle row and column.

[bb] Battle Brothers paints its tactical maps from tiles whose edges blend (a ground's border is a soft brush, never the grid);
its roads cross the map whole. [analog horror] the one lit canopy panel, the valet's key box open, the rooftop pool's water
standing green: at the source, in the models.

## PUSH 2 (rule 346 + rule 356, ask lines 355, 374, 375): THE GREY PLACES, DOWNTOWN'S ROOFS, NOTHING CUT AT AN EDGE
- THE AIRPORT: dustslab (the apron's real colour), apron.4 THE STANDS (COOK PROPS' fuel truck and baggage train) in its field,
  apron.0 out; the taxi line and the stands' lead-in lines run whole. Seams 16% -> 0%, cell lines 6% -> 0%, cut-offs 2% -> 0%,
  roads not met 28 -> 0.
- THE SHORE: lakemud (Lake Mead's tan), its gravel bars crossing every block side at the middle row and column, each bar a SOFT
  SHAPE (soft_tiles: the tile map blurred, the edge a metre inside its own tiles; measured first: a plain rule of the tiles puts
  every edge ON the grid line, 7.8% of its cell borders). 21% -> 0%, 11% -> 0%, 9% -> 0%, 41 -> 0.
- THE PASS: passtan (buff scree, iron-red), verges off the grid lines, pass.0 out. 23% -> 0%, 2.3% -> 2.0%, 3.5% -> 0%, 46 -> 0.
- DOWNTOWN'S ROOF-TO-ROOF (rule 356(e), his 'fantastic idea', which the rebuild had dropped): fremont.7's backs are walked roof
  to roof now, each roof at its own storey (3, 2, 3, 3, 2), planks where one steps down, the fire escape the way up from the alley.
  The zipline's cable ends at its own pole inside the block.
- EDGE (rule 356(c),(f)): a fifth leg in the seams gate: no box, model or rock reaches past its block's side (where the picture
  stops and cuts it), read without a render (--clips). Measured: 16 blocks had something cut (rocks, mounds, pools, ledges, the
  lab's sheds and pallets by 0.2 to 2.5 m); now 0 of 46 (Kit.put/model/rock move a thing in when it reaches past by a little;
  the pallets and the terminal fixed by hand). The Strip's and downtown's blocks had none.

## PUSH 3: THE SUBURB, THE TRAILER PARK, THE WORKS (every street, lane and spur runs whole; the old town blocks out)
- THE SUBURB: its own blocks only now (subs.0, corner.0, culdesac.0 left: their streets met nothing across the seams); each yard
  block is a row of houses on top (their roofs walked: 'the houses are roofs', the landmark group the plan gate wants between the
  lines), their walled backyards and empty pools behind them, and the street at the bottom that the next block's houses face,
  running whole through every block of its row. Seams 65% -> 5%, cell lines 26% -> 0%, cut-offs 14% -> 0%, roads not met 50 -> 0.
- THE TRAILER PARK: the lane edge to edge through both its blocks (the laundry off it, mailboxes and bins on its verges, the
  office lot inside its block with a drive to the lane); trailer.0 out. 72% -> 0%, 10% -> 0%, 6.5% -> 0%, 49 -> 0. (Measured
  first: against the old suburb its plan came within 0.548 of it, under the plan gate's 0.6; with the rebuilt suburb, 1.6.)
- THE WORKS: rail.2's spur moved to the yard's one row, so the tracks run on block to block; works.0 out. 39% -> 0%, 13% -> 0%,
  4.6% -> 0%, 38 -> 0.

## PUSH 4: THE LANDFILL, THE GOLF COURSE, THE MARINA
- THE LANDFILL: the haul road in both cells' blocks at one row; the scorch and the wells' gravel soft shapes inside their tiles;
  the mounds whole inside their blocks (four were cut at a picture's edge); landfill.0 out. Seams 59% -> 0%, cell lines 4.5% -> 0%,
  cut-offs 5.1% -> 0%, roads not met 51 -> 0.
- THE GOLF COURSE: the cart path edge to edge through every block, the clubhouse patio set off it; the dead pines inside their
  blocks; golf.0 out. 73% -> 0%, 8.6% -> 1.1%, 12% -> 0%, 29 -> 0.
- THE MARINA: Lake Mead's tan bed (lakemud), the same at every edge; the houseboat moored to its dock on the dry bed (the
  landmark group of four between the lines the plan gate asks for, which marina.0's leaving had taken); marina.0 out. 45% -> 0%,
  8.3% -> 0%, 10% -> 0%, 51 -> 0.

## PUSH 5: RED ROCK, THE WASH, THE DESERT (OWED_SEAMS is empty: all fifteen fixed and holding)
- RED ROCK: the slickrock sheets soft shapes inside the open tiles (they had ended along the grid's lines), the ledges whole inside
  their blocks; canyon.0 out. Seams 89% -> 0%, cell lines 12% -> 0%, cut-offs 9.9% -> 0%, roads not met 26 -> 0.
- THE WASH: the channel's silt floor a metre in from the slopes' feet (it had lain exactly on the cell lines), its stains and the
  bank's gravel off the block edges, the fence lines' gravel a soft strip. 11% -> 0%, 14% -> 1.1%, 1.8% -> 0%, 27 -> 0.
- THE DESERT: it held already (4.7%, 1.5%, 0.4%, 0); its one boulder cut at a picture's edge moved inside.
- THE WHOLE ROUND (rule 346), before -> after, all fifteen: seams seen at the block seams 0% on every place but the suburb (5%,
  under the 12% floor); cell lines at most 1.6%; cut-offs at most 0.7%; roads not met 0 of 51 on every place; nothing cut at a
  picture's edge (0 of 46 blocks); a logic list checked by eye for every place, tied to its pictures.

## PUSH 6 (rule 346 AMENDED, rule 356): DOWNTOWN RETHOUGHT, ROADS FIRST
His vote on push 1's downtown: "Hell nah that shit does not look right" (the Strip and the lab: "More work more love"). Rethought
from the real downtown, not polished. THE ROADS FIRST: three streets east to west, each whole through every block of its row:
FREMONT EAST on the top row (a real street, its lights, the burnt Deuce in it), the FREMONT STREET mall in the middle, and on the
bottom row the south side's SERVICE ALLEY and OGDEN AVENUE. THEN THE LOTS AND THE BUILDINGS, every front to the camera or the alley:
- fremont.10 THE MOTEL AND THE PAWN SHOP: a two-storey motel (salmon stucco, turquoise doors, its walkway the high ground) round a
  court with its empty pool, its tall dead sign by the street; a pawn shop with its grilles down and PAWN on its yellow band.
- fremont.11 THE GARAGE AND THE CHAPEL: a parking garage whose decks step up one, two, three storeys from its ramp; a white wedding
  chapel with its steeple and its arch on the lawn.
- fremont.12 UNDER THE COWBOY (landmark) and fremont.13 THE MALL: the old casino fronts at street level, four storeys, their
  marquees over the sidewalk, the cowboy flat on his front, the horseshoe on another; THE CANOPY CAME DOWN: its columns along both
  sides (some snapped), one bay still standing (COOK PROPS'), its ribs and screen panels fallen into the street as cover, one panel
  still lit; kiosks, slots, the stage, the zipline's tower; the south side's one-storey shops with their awnings.
- fremont.14 THE ROOFS AND THE ALLEY and fremont.15 THE GARAGE ON OGDEN: the south side's backs at two and three storeys (skylights,
  tanks, junk), their fire escapes and the garage's ramp the ways up from the alley.
ROOF TO ROOF (his 'fantastic idea', rule 356(e)): the south side's shops (one storey), its backs (two, three) and the garages are
walked roof to roof, each at its own storey, so height is accuracy (rule 321).
Measured on the way: a bare canopy frame drew as a grid of lines over the mall (the camera sees an arch across the street
edge-on), so the canopy fell instead; a first render set the south side's backs over the alley (fixed: 10% cell lines -> 0).
Downtown: seams 0%, cell lines 0%, cut-offs 0%, roads not met 0 of 51, nothing cut at an edge. The rule 346 v1 blocks (fremont.3-7)
are in graveyard/the_strip_and_downtown_11_3_26/.
