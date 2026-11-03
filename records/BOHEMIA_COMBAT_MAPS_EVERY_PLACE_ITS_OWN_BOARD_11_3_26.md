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

## WHAT IS LEFT
- PUSH 3: the landfill, the suburbs, the Strip, downtown, the works, the marina.
- The fight's futures pictures (raided, reclaimed) are not read by the fight: none were made for the new blocks.

[bb] Battle Brothers builds a tactical map from the world tile it is fought on (its terrain kinds, height levels and obstacles),
its camps and ruins have their own built plans, and its battles open in a line, in an ambush, or with the enemy in its camp.
[analog horror] at the source, in the models and the grounds, never a filter: the lines above.
