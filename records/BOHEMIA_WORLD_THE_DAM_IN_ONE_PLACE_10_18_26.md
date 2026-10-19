# WORLD: THE DAM IN ONE PLACE, ROUND ONE: THE LIST AND THE CHECK (10/18/26, world lane, the new age)

Row: [the dam in one place] ONE-HOOVER-DAM-ONE-BOULDER-CITY (routed to WORLD by WHO LIVES WHERE, 10/17: 'the dam is in
two places'). END STATE: each real place exists once, at its real distance; the valley's corner holds a real place that
is really there, named; every lane that reads the dam or Boulder City listed; a check that a named place appears once.
CONSTRAINT: the roll's corner rule is Paolo's 7/5 layout, so a change to where things sit is a candidate in VOTE; the
data and the list are not. This round: the list and the check. The move waits (section 4).

## 1. IT IS NOT THREE PLACES TWICE, IT IS EIGHT

The roll names its pieces after real places in its own comments, inside the 96-block box; the region file carries the
same places where they are, outside it. On the game's seed:

| the valley's piece | real place | where the valley has it | where the region has it |
|---|---|---|---|
| damR | HOOVER DAM | x 9-10, y 89-90, 4 blocks | 148,81 (41 km) |
| boulder | BOULDER CITY | x 12-14, y 88-90, 9 blocks (the valley's only 'town' cells) | 125,91 (35 km) |
| mead | LAKE MEAD | x 1-7, y 87-94, 56 blocks | the LAKE MEAD district, 25 km on |
| lakeLV | LAKE LAS VEGAS | x 16-19, y 87-90 | 103,57 (22 km) |
| intake | THE INTAKE | x 8, y 89 | 125,62 (30 km) |
| landfill | APEX LANDFILL | x 56-57, y 7-8 | 96,-27 (34 km) |
| quarry ('real: Sloan') | SLOAN | x 47, y 89 | 38,103 (22 km) |
| mtChar | MT CHARLESTON (the lodge) | x 82-93, y 2-10, 108 blocks | -63,11 (44 km) |

Henderson is the one real place the region puts INSIDE the box (91,74): the corner's true neighbour.

## 2. ONE DAM, TWO HOLDERS (found by the list)

The valley's dam turf is the CARAVANS' (BohemiaTowns holderOf, the power site 'which is Hoover'); the region's HOOVER DAM
is the NETWORK's (records/target/bb/region_bases.json). A trip to the dam, a quest at the dam and the faction card's
power line each pick one. And engine/bohemia_engine.js:2087-2279 carries a third Boulder City and Hoover from the old
map generator (copies in the RUN slice and the current slice); current_slice_gate holds that the slice no longer calls it.

## 3. EVERY READER (the list the row asked for; found by a read-only sweep of engine/, slices/, gates/, tools/, banks/)

### 1. Readers of the layout rects (the overmap's own pieces)
| file:line | what it reads | owner |
|---|---|---|
| engine/bohemia_overmap.js:162-168, 174, 190, 194 | defines the four rects; Lake Las Vegas's centre, the dam point, the wash's route to the lake | the roll (7/5 pass 4) |
| engine/bohemia_overmap.js:245, 364 | the intake placed off the lake; water treatment off the intake | the roll |
| engine/bohemia_overmap.js:366, 428, 454 | the cluster as keep-out for other pieces (the Henderson leg included) | the roll |
| engine/bohemia_overmap.js:513-522 | intake->INTAKE, lakes->WATER, Boulder City->TOWN, dam->DAM | the roll |
| engine/bohemia_overmap.js:720, 1071 | desert ring within 6 of the cluster; the aqueduct from the intake | the roll |
| slices/BOHEMIA_CITY_WORLD.html:45270-45273, 45439, 45699 | the far-land painting puts LAKE MEAD past `L.mead`'s corner, labelled | RUN |
| slices/BOHEMIA_CITY_WORLD.html:45441-45446 -> slices/bohemia_region.js:35, 79-94 | the region walk grid's uncrossable lake, from `L.mead` until the real land loads | RUN |
| the seven inlined copies of the overmap | resynced with every change (ENGINE SYNC) | city_tab_gate |

### 2. Readers of the cells (dam, town, intake, water) and the names
| file:line | what it reads | owner |
|---|---|---|
| engine/bohemia_loop.js:252, 282, 306; slices/BOHEMIA_CURRENT_SLICE.html:24246 | the first `dam` cell as a landmark, drawn as DAM | world-model |
| engine/bohemia_towns.js:839-870 | the dam is one power site, paid to whoever holds its turf ('which is Hoover') | WORLD / FACTIONS |
| slices/BOHEMIA_CITY_WORLD.html:35742-35781 | the faction card's power line: 'the dam' | FACTIONS |
| engine/bohemia_towns.js:278 | the Homeless seat prefers `intake` | FACTIONS |
| engine/bohemia_ladderwalk.js:113, engine/bohemia_ladder_data.js:380 | boss THE DAM placed on the `dam` district | QUESTS |
| engine/bohemia_place.js:68 | the pump service from intake or dam | WORLD |
| engine/bohemia_world.js:171, 183, 203; engine/bohemia_town.js; engine/bohemia_landmarks.js:280-339; engine/bohemia_utility.js:646-667 | the block builders: a generic old townsite, Hoover's wall and towers, the straw | WORLD |
| engine/bohemia_water.js:3, 161; engine/bohemia_pumps.js:100 | 'Lake Mead and the reservoirs'; the 1,040.5 ft lift | WORLD |
| engine/bohemia_cityedit.js:26 | dam, intake, lakes count as water | LIFE + CITY |
| engine/bohemia_people.js:2443 | 'the dam', 'the old town' | PEOPLE |
| engine/bohemia_dead.js:215, 272; engine/bohemia_population.js:65; engine/bohemia_hazard.js:331 | bodies, power role, the lakebed hazard | WORLD |
| engine/bohemia_boardkinds.js, engine/bohemia_boardterrain.js, BOARD_KINDS.json, BOARD_TERRAINS.json | the dam and intake fight on the shore board, the town on the suburb board | WORLD |
| engine/bohemia_map_joins.js:66-68; engine/bohemia_valleymap.js:50-60; engine/bohemia_district_kit.js; BOHEMIA_DISTRICT_ROOMS.json; engine/bohemia_overmap_bridge.js | per-kind tables (stops, colours, rooms, archetypes) | WORLD |
| slices/BOHEMIA_CITY_WORLD.html:62442-62459 | the map legend: BOULDER CITY, HOOVER DAM, LAKE MEAD INTAKE | RUN |
| slices/BOHEMIA_CITY_WORLD.html:44784 | the region's towns drawn with the valley's town art | RUN |
| tools/bohemia_city_map.py, bohemia_district_registry.py, bohemia_district_hero_factory.py, bohemia_the_far_end_painted_by_hand_cook_10_9_26.py | the water list, Hoover hero art, the far end's lake | COOK |
| REGION COPY: slices/bohemia_region.js:109-111 (fallback TOWNS); BOHEMIA_REGION_LAND.json places and the LAKE MEAD district; records/target/bb/region_bases.json:200-245; engine/bohemia_homebases.js:122 | the real BOULDER CITY, HOOVER DAM, LAKE MEAD MARINA | RUN / WORLD / FACTIONS |
| banks/ (5 files, region-scoped) | WHO LIVES WHERE 10, WHO THE FACE IS 3, THE PLAGUE 2, HERO CANDIDATES 1, MUSIC REPO 1 | PEOPLE |

### 3. Gates that read them
| gate | asserts | owner |
|---|---|---|
| faction_towns_gate.js:435-455 | W4 one dam site, its cells, seed 7 | WORLD |
| bb_places_gate.js:95-99 | a dam site under 10 cells | WORLD |
| the_valley_has_an_edge_gate.js:82-84, 149-154 | LAKE MEAD labelled; a lake on every seed (needs `L.mead`) | RUN |
| the_far_end_at_the_phones_pixels_gate.js:104 | the far-land painter with the lake | RUN |
| materials_gate.js:67-80, 158-167 | a valley `dam` cell, concrete | WORLD |
| ladder_walk_gate.js:143-145 | THE DAM on `dam` | QUESTS |
| current_slice_gate.js:49 | the dam landmark scan | world-model |
| city_tab_gate.js:43; cityedit_gate.js | dam and lake unbuildable water | LIFE + CITY |
| the block-builder gates (every_cell_has_a_class, every_floor_region_connects, drive_network, street_connectivity, walked_surface, tilespec) | the builders as kinds, not where they sit | WORLD |
| homebases, take_a_town, region_land, region_districts, the_news_down_the_road, settlement_screen | the region's BOULDER CITY and HOOVER DAM only | FACTIONS / WORLD / RUN |

Found with it: the valley's dam turf is the CARAVANS' (BohemiaTowns holderOf), the region's HOOVER DAM is held by the NETWORK
(records/target/bb/region_bases.json): one dam, two holders. engine/bohemia_engine.js:2087-2279 carries a third Boulder City and
Hoover from the old map generator (copies in RUN_CURRENT and CURRENT_SLICE); current_slice_gate checks the slice no longer calls it.

## 4. WHY THE MOVE WAITS: EVERY CHANGE TO THE ROLL MOVES THREE CAPITALS

The same round measured it on the freeway's gap (records/BOHEMIA_WORLD_THE_FREEWAY_IS_ONE_ROAD_10_18_26.md section 7):
the faction seat placer's fallback picks a cell by its POSITION in the list of buildable lots, so taking any lots out
of the valley (a freeway leg, a dam cluster turned into Henderson's edge) moves the Anarchists, the Colorful and
Custom, the player's own faction, on the game's seed, and the baked seats go stale. Moving the dam, Boulder City and
the lake out of the corner would do the same, and more. So the candidate for his VOTE (the corner as Henderson's
edge and the River Mountains, the dam, the town and the lake where the region already has them, 35 to 41 km out) is
drawn after FACTIONS' seats hold still, so the card shows the corner change and nothing else.

## 5. THE CHECK

gates/a_place_is_named_once_gate.js, A PLACE IS NAMED ONCE (registered), 7/0. It refuses: a name twice in the region;
a real place the table names that the region does not carry; a valley piece carrying a real place's name beyond the
OWED list (today's eight, pinned with their owner so they can only be fixed; a fixed one is a NOTE to take it off the
list, never a red), on the game's seed and twenty; a piece renamed or removed in the roll without the table knowing.
Two mutations bite inside.

## 6. ROUTED

- FACTIONS: the seats hold still (section 4); and the dam's two holders (section 2).
- RUN: the far-land painter labels LAKE MEAD past `L.mead`'s corner and the region walk grid's lake comes from it until
  the real land loads; when the cluster leaves the box, those two read the region instead.
- QUESTS (research): THE DAM boss stands on the valley's 'dam' district; the real dam is the region's fortress.
- WORLD (this lane, next round): the VOTE candidate, then the move with every reader in section 3 told.

[bb school line] Battle Brothers never puts one settlement on the map twice: a name is a place, and every contract,
rumour and road points at the same one. Ours points at two dams.

[analog horror line] The sign at the edge of town still says HOOVER DAM 8 MI, and somebody has painted a second arrow
under it pointing the other way.

---

# ROUND TWO (10/19/26, world, Opus 5.5 Extra, opened by the coordinator after the five-hour cap): THE CANDIDATE, BUILT SO NO CAPITAL MOVES

Code on main 6ed37eca (work in progress 3a49e63b). VOTE card **world-the-real-corner-10-19** (registered, unvoted, waiting
on the coordinator's tag for his first screen, rule 118). Section 4's premise was measured again (rule 12) and it was a
premise, not a gate: the move does not have to wait on FACTIONS' seats if it never changes the list the seats are
picked from.

## 7. THE CANDIDATE: A RELABEL IN PLACE, NOT A RE-ROLL

engine/bohemia_the_real_corner.js, called by nothing. `apply(m)` takes a built overmap and turns the five pieces' cells,
the same footprint, into the ground that is really in that corner:

| piece (the roll's name) | cells, game's seed | becomes | named (game's seed, real SE) |
|---|---|---|---|
| mead (LAKE MEAD) | 56 water | mountain | THE MCCULLOUGH FOOTHILLS |
| damR (HOOVER DAM) | 4 dam | mountain | THE MCCULLOUGH FOOTHILLS |
| intake (THE INTAKE) | 1 intake | mountain | THE MCCULLOUGH FOOTHILLS |
| boulder (BOULDER CITY) | 9 town | gated | MACDONALD HIGHLANDS |
| lakeLV (LAKE LAS VEGAS) | 16 water | basin | THE PITTMAN BASINS |

86 cells on every one of 210 seeds. All words draft:true.

**Where the names come from (real geography, measured into the box at 384 m a block, real orientation):**
- The game's seed puts the cluster in the real SOUTH-EAST corner (compass east = x0; the cluster's centre at real 88-94,
  87-94, about lat 35.97 to 36.00, lon -115.04 to -114.96). Our own region file has open desert, hills and the I-11 to
  Railroad Pass just outside that corner, the McCullough Range (district H) to the south, and no lake within 12 blocks.
- MacDonald Highlands: a guard-gated master-planned community at the south end of Henderson (ZIP 89012), 1,200 acres,
  2,300 to over 3,200 ft, inside the 3,200-acre MacDonald Ranch; a lot in Dragon's Reserve sits at 36.0007 N,
  115.053 W, which is block 74,86 of the box in real order, about seven blocks from the piece it replaces. The
  DragonRidge ridge the residents call the Sleeping Dragon.
- Black Mountain, the McCullough Range's north peak: 35.931 N, 115.043 W, 5,093 ft (Wikipedia and SummitPost agree
  to the foot): real block 77,106, eleven blocks south of the box. The corner's hills are its foothills.
- The Pittman basins: the Clark County Regional Flood Control District's Pittman North Detention Basin (2019, the
  district's 100th, 1,533 acre-feet, collects the McCullough Range's runoff) and the Pittman Horizon Ridge basin at the
  foot of Black Mountain; the Pittman Wash drains Henderson to the Las Vegas Wash and Lake Mead. The valley's wash
  already ends where Lake Las Vegas was, so a basin there is the real shape.
- On the 127 seeds where the roll put the cluster in another corner (SW 86, NE 24, NW 17), the same kinds with plain
  words (THE RIM HILLS, THE EDGE OF TOWN, A FLOOD BASIN) and named:false: no real name is guessed for a corner whose
  ground was not looked up.

## 8. WHY NO CAPITAL MOVES (the measurement section 4 was missing)

The seats come from districtsOf(): the buildable ('sand') cells that front a road, in scan order; the spread fallback
picks by POSITION in that list, so only a change to WHICH cells are in it, or in what order, moves a capital.
- water, dam and intake were never in it (cat water); mountain and basin are not in it (mount, water). The town was in
  it (2 of its 9 cells front a road on the game's seed) and gated stays in it (sand, not in NOT_A_TOWN). No road is
  touched. Same cells, same order; 'town' to 'gated' is a kind no faction's HOMES names.
- Measured with the loop's own call (placeHomes over every one of the 18 factions): **game's seed, 0 of 18 move,
  the seat list identical (2,734 lots); every south-border seed of 210 (169), 0 move.**
- THE TRAP, FOUND AND MEASURED BEFORE IT SHIPPED: a town is BIG (a street may end at it, Paolo 7/18), a gated block is
  not. The first cut turned the town gated and three of street_connectivity's four seeds went red (a collector street
  now stopping in fabric at 87,14 / 91,14 / 91,13). Punching the roll's whole grid through the houses, as the GRID
  RE-ASSERT does to any soft piece, made it green and MOVED 7 CAPITALS on the game's seed (new street cells change
  which lots front a road). The kept fix carries a street through the houses ONLY where it would otherwise stop dead
  (carryStreets): on the south border that never happens (0 carried, 0 stubs, 169 seeds); on the 41 side-edge seeds
  (the roll's axisFlip) it carries streets on 35, moving capitals there, and 12 short stubs remain where the carried
  street exits onto desert. That is [the roll]'s own finding (the cluster on the side edge is already wrong geography:
  drop axisFlip and every seed is a south-border seed); the check states it as a NOTE, never hides it.

## 9. WHAT A YES WOULD ASK OF EVERY READER (measured: the round-one gates run with the candidate applied)

A preload wrapping buildOvermap with apply(), each gate run on main and under the candidate:

| gate | main | candidate | what it is |
|---|---|---|---|
| bb_places | 26/0 | 25/1 | 'a SITE is a building': the valley's dam power site (4 cells, held by the Mob in that gate's measure) is gone; the Mob's fortress loses its hinterland. FACTIONS/ECONOMY: re-point the dam's power to the region's HOOVER DAM (the Network's) |
| board_terrains | 59/0 | 58/1 | the table claims town, intake and dam, which the valley no longer makes (COMBAT TWO / WORLD: the region's places still fight on them) |
| street_connectivity | 12/0 | 12/0 | green once carryStreets landed (9/3 without it) |
| a_place_is_named_once, materials, ladder_walk, city_tab, cityedit, build_a_lot, homebases, every_cell_has_a_class, every_floor_region_connects, drive_network, the_valley_has_an_edge | same | same | unchanged (pre-existing reds on main stay theirs: city_tab 2, drive_network 2, the_valley_has_an_edge 2) |

Not reached by node gates, named from round one's list: RUN's far-land painter (lays LAKE MEAD past `L.mead`'s corner;
on a yes it must read the region's lake instead, which is 25 km on, not beside the city), the CITY tab's legend
(BOULDER CITY, HOOVER DAM, LAKE MEAD INTAKE keyed to kinds), QUESTS' THE DAM boss on the 'dam' district, the Homeless
seat's 'intake' preference (it does not pick the intake on the game's seed today), the pump service from intake or dam.

## 10. THE PICTURE (rule 32: from the game's camera)

tools/bohemia_world_the_real_corner_shot.js drives the committed demo twice at the far stop (zoom 1.6, camera on the
dam): NOW as main serves it; THE REAL with the same city file served from the scratch folder with the module inlined and
applied after the map is built, and the far land's painted lake left out where the page hands it to the painter's
worker (the painter runs in a worker: the first attempt patched the painter itself, the worker could not see the map,
and the whole far land came back flat; caught on the picture, fixed at the input). Nothing in slices/ changes for the
photograph. tools/bohemia_world_the_real_corner_sheet.py lays the two crops side by side at 1:1:
slices/vote/WORLD_THE_REAL_CORNER_10_19.jpg (1408 x 1180, 352 KB). What it shows: the in-town Lake Mead drawn as rows of
blue pools, the dam as a grey wall and Boulder City's red roofs, with a painted LAKE MEAD beside the city; then the
foothills' cones, the hill houses and the grey flood basin, the far land plain desert and hills.

## 11. THE CHECK

gates/the_real_corner_gate.js, THE REAL CORNER (registered), 16/0, 18 s. Refuses: the game's corner not SE or not
named; a cell of the five pieces left as dam, town, intake or lake water; a name that is a real place the region
carries outside the box; a word without draft:true; any seat-list change or moved capital on the game's seed; a moved
capital, a dead street or a carried street on any south-border seed of 210 (side edge: a NOTE with its counts); a call
from the roll, the world, the loop, the city or the demo before his yes; an impure plan. Two mutations bite (the town
turned to rock: 7 seats would move; a name set to BOULDER CITY: caught).

Run this round: THE REAL CORNER 16/0, A PLACE IS NAMED ONCE 7/0, THE PIXEL FLOOR 13/0, GATE REGISTRY 7/0, SUITE
HONESTY 26/0, THE VOTE TAB 51/1 (the red is two DYNASTY cards' missing 'where', not this card). The full suite is
not claimed (round one measured it does not finish on this box).

## 12. ROUTED

- THE COORDINATOR: card world-the-real-corner-10-19 is in the registry, unvoted, untagged; it is on his first screen only
  once tagged (rule 118a).
- On his YES (WORLD, next round): the overmap calls apply() at the end of buildOvermap, the seven inlined pages resynced
  (ENGINE SYNC), A PLACE IS NAMED ONCE's OWED list drops to three, and NOTEs to every reader in section 9 the same push.
- [the roll] (WORLD): the 41 side-edge seeds are this candidate's only rough edge and the roll's own defect.

[bb school line] Battle Brothers' world map never draws a settlement near the player's start that is really a day's
march away: distance is the game. Our dam sat five km from the Strip and forty on the map at once; the candidate keeps
only the forty.

[analog horror line] The basin at the foot of Black Mountain holds the monsoon for three days, then the water goes,
and what it carried down off the hills stays on the concrete floor for anybody to find.
