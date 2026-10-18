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
