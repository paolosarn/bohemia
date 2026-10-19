# THE REGION'S WILD CAMPS STAND WHERE THEIR PLACES REALLY ARE

FACTIONS [real camps], round 67, claimed 10/18 factions-camps (capped by the five-hour limit minutes in, nothing
committed), resumed and shipped 10/19 by the session the coordinator reopened (rules 112 and 116; Opus 5.5 Extra, no
extra usage). Rule 109 (Paolo 10/16: 'our map has to be as big as fucking Battle Brothers... I'm choosing Battle
Brothers'), WORLD [the region] (engine/BOHEMIA_REGION_LAND.json, the real Las Vegas region at 384 m a block).
Data and a gate under the hold; nothing drawn, nothing in VOTE, NOT IN A TAB.

## WHAT WAS WRONG (measured by FACTIONS [four seated] 10/18, re-measured here)

The eight older wild rows of records/target/bb/region_bases.json were bearings in RUN's round-one frame, laid before
WORLD's land existed. Each sat 16 to 68 blocks from the real place it named, and seven of the eight stood on ground
their own faction does not hold (the Gypsum Cave lair in the lake's district, the Jean Dry Lake nomads on the
McCullough Range).

## WHAT IS TRUE NOW

Every wild and settled row carries the real thing's own latitude and longitude, and stands within one block of that
point projected the way WORLD projects its own places (tools/bohemia_world_region.py cell_of).

| row | moved | now on | own ground? | real thing | nearest WORLD place |
|---|---|---|---|---|---|
| the road crew at Railroad Pass | 56 blocks | freeway (106,95) | yes | the pass, WORLD's own point | RAILROAD PASS, 1 |
| the road crew at Sloan | 39 | freeway (37,104) | yes | the quarry town on the 15 | SLOAN, 1 |
| the dead at Apex landfill | 31 | landfill (97,-26) | yes | the landfill | APEX LANDFILL, 1 |
| the dead at Nelson | 68 | trailer park (127,170) | no, says why | the ghost camp | NELSON, 1 |
| the Lost City | 44 | open desert (227,-58) | no faction file, says why | Pueblo Grande de Nevada, 36.50028 N 114.40222 W, five miles SE of Overton | OVERTON, 12 |
| the den at Tule Springs | 16 | park (24,-6), holds the open desert beside it | no, says why | the fossil beds | TULE SPRINGS, 0 |
| the lair at Gypsum Cave | 39 | open desert (106,29) | no, says why | the cave | GYPSUM CAVE, 1 |
| the nomads on Jean Dry Lake | 40 | open desert (26,148) | no, says why | the playa, 35.7886 N 115.2611 W, three miles east of Jean and the 15 | JEAN, 16 |

The four seated last round (keepers, runners, the eye, the house) already stood within one block of their real
points; they now carry their coordinates too. Six of the twelve stand on their own ground; the other six say why
(the land carries none of theirs within a block of the real thing: WORLD's fifteen kinds have no ruin and no casino
floor; the beasts' wash is two blocks from the fossil beds and fourteen from the cave; the nomads' pumps are nowhere
near the playa).

THE RULE (rules.a_camp_stands_where_its_real_thing_is, ours, the wiki line school.camps_in_the_wild):
1. lat, lon and where they came from (a WORLD place's own point, or a cited page for a real thing WORLD does not list).
2. Within one block of the projected point (RUN's R.placeAt: a party within one block of a place is at it).
3. A WILD camp never stands on a town's own block (WORLD role base): Battle Brothers' enemy locations spawn in the
   wild, never inside a settlement. It may stand on a fight place's block: that place IS the location.
4. A SETTLED location stands on its place's own block: it is the settlement.
5. Own ground first when the land carries it within the allowed blocks; else ground_why.
6. A row's ground is its block's kind first, then any kind within its one-block reach that its faction holds or its
   want reads, never a kind that is not there (the wants module reads this list to decide whether a den is on its
   ground).
7. world_place is the nearest WORLD place, measured.

THE PROJECTION IS PROVED BEFORE IT JUDGES: the origin and metres a block are read off WORLD's land file, the
kilometres a degree off WORLD's own tool; all 34 of WORLD's places project within two blocks of where WORLD drew them
(6 on the block, 25 one off, 3 two off: WORLD snaps a place to its road).

## THE TWELVE: DO THEY FOLLOW WORLD'S PLACES? YES, BY NAME

When WORLD's land loads, RUN draws WORLD's places and RUN's twelve TOWNS are only the fallback. Measured: RUN's
fallback bearings sit 14 to 85 blocks from WORLD's place of the same name (Boulder City 85, Hoover Dam 79, Lake Mead
Marina 66, Primm 64, Jean 48, Searchlight 37, Mt Charleston 33, Indian Springs 32, Pahrump 32, Moapa 14). So a holder
follows its place by NAME, never by bearing. Each of the twelve now names its WORLD place (world_place): nine by the
same name, LAKE MEAD MARINA as BOULDER BEACH (WORLD has no place by that name; the marina floated at Boulder Beach and
moved to Hemenway Harbor beside it; WORLD's line for Boulder Beach is 'the marina'), HENDERSON none (WORLD seats it
inside the valley box: the roll's own district), MESQUITE none (past the rim). The east/north stay RUN's bearings,
because they ARE the fallback and the drift check binds them.

ONE TIER DISAGREES: Indian Springs is a fortress in RUN's TOWNS and a town on WORLD's land (Creech, the drone base
beside it, is WORLD's fortress). Routed to WORLD; the file keeps RUN's tier.

## PROVED US WRONG

1. WORLD DRAWS 33 PLACES OUTSIDE THE VALLEY AND TEN OF ITS 21 TOWNS ARE NOBODY'S: Railroad Pass, Nelson, Sloan,
   Goodsprings, Sandy Valley, Blue Diamond, Corn Creek, Echo Bay, Glendale, Overton. Battle Brothers since 1.1 has no
   settlement without a house (school.every_settlement_has_a_house, 'Independent, unaligned settlements which were
   present in Early Access builds, no longer exist'). We built camps beside four of them. New row: [every town held].
2. THE DUMP AT APEX WAS 'FAR' ONLY BECAUSE ITS BEARING WAS WRONG: on the real landfill it sits 6 blocks from the
   house's depot and fields the early mix. On the real land the late band is the dead at Nelson (69 from the nearest
   held town, Searchlight, because Nelson itself is nobody's), the keepers (65) and the runners (73). On RUN's fallback
   frame the late ones are the Lost City (64), the keepers and the runners. The gate prints both every run.
3. THE MIRROR IS ONE BLOCK OFF: on a seed whose compass mirrors east, RUN's placer computes Math.round(47.5 - east);
   the land mirrors to 47 - east (realX, N - 1 - x). For two of the twelve rows (the Sloan crew, the keepers) that
   lands on different ground. The frame now names 47 - east; routed to RUN.
4. THE WANTS MODULE CANNOT SEE THE REGION'S GROUND: its nearestOf reads the valley's cells only, so a region den off
   its ground would walk into the city for open desert lying one block from it on WORLD's land. The ground list is now
   the row's honest reach (rule 6 above), which keeps the den on its ground; the module's blindness is routed.
5. THE EDGE CREWS PATROL: on their real ground the Railroad Pass and Sloan crews camp at the valley's edge, so the
   parties module's catchment hands them a valley border and, without the wants module, they PATROL it (before: they
   carried caravans). With wants they send crews only, as before. The WANTS gate now says what is measured.

## THE NUMBERS (seed 12345 + the region, through BohemiaWants.all)

Parties at once unchanged: 62 before the four seated, 70 now (4 watch, at Jean's prison camp with 5 crews going at
it, an Anarchists suburb, a Church chapel, a Reds downtown); parties by REACH unchanged (no tier changed). Wild rows
handed to today's parties module alone: 4 patrol, 7 caravan (was 11 caravan). Factions on the region 8, a seat or a
reason 12 of 12, ledger seeds 24.

## REAL SURFACE

slices/BOHEMIA_CITY_WORLD.html in headless Chromium at 390 x 844: 0 page errors; the page fetches the new file and
BohemiaHomeBases.setRegion seeds 24; every one of the twelve rows reads as held by its own faction (railroad_pass_crew
brigands ... apex_depot_house noble_houses); the twelve places unchanged (henderson Trades, boulder_city Church ...).
Nothing on the map moved: RUN does not hand these rows in yet (routed since 10/17).

## GATES

REGION BASES 365/0 (was 332): section 5 THE REAL CAMPS, one function holding every rule, red by name on seventeen
planted mistakes (NO_REAL_COORDINATES twice, WORLD_LATLON_DRIFT, OFF_ITS_REAL_THING twice, A_CAMP_ON_A_TOWN,
A_SETTLEMENT_OFF_ITS_PLACE, NOT_ITS_OWN_GROUND_WHEN_IT_COULD_BE, OFF_ITS_GROUND_SAYS_WHY, A_WHY_WITH_NOTHING_TO_EXPLAIN,
GROUND_IS_NOT_THE_ROWS, GROUND_NOT_THERE, WORLD_PLACE_IS_NOT_THE_NEAREST, THE_NAME_IS_WORLDS, NOT_WHERE_WORLD_SAYS,
A_RENAMED_PLACE_SAYS_WHY, CANNOT_STAND on the lake's open water); run against main's file it goes 27 red.
WANTS SEND PARTIES 181/0 (three checks restated to the measured truth: no crew before, crews only after, a road crew's
target moves when the want's ground is swapped). HOME BASES 168/0, TAKE A TOWN 185/0, ARRIVAL TRAITS 45/0, WAR 39/0,
BUILD A LOT 62/0, RELATIONS 66/0, HUNTED 35/0, VALLEY GROUNDS 43/0, THE ONE RULER 33/0, THE ARRIVAL 37/0, A RAID ON
YOUR BASE 18/0, FACTION DOSSIERS green, ENGINE SYNC 19 zero drift, GATE REGISTRY 7/0, THREE ACTS 28/0. Red on main
before my diff and not mine (clean worktree of origin/main, identical): INLINED FRESH 0/1 (engine/bohemia_followers.js
banner, PEOPLE's).

## ROUTED

- RUN: x = 48 + east on a real-east seed, 47 - east when mirrored (never Math.round(47.5 - east)); when the land
  loads, a WORLD place's holder is the region place whose world_place names it; still owed since 10/17: hand the rows
  to BohemiaWants.all and the ledger.
- WORLD [the region]: Indian Springs' tier; the wants module's nearestOf sees only the valley's cells (a region row
  needs the region's ground in its index).
- TUNING: the three late bands on the real land (Nelson 69, Corn Creek 65, Valley of Fire 73) against rule 117.
- COOK FOUR: unchanged (a picture per wild kind; the Lost City's mounds and the playa camp are new ground for it).

## NEXT (rule 74)

[every town held]: the ten of WORLD's towns nobody holds get a holder the Battle Brothers way (every settlement has a
house), so the camps beside Railroad Pass, Sloan, Nelson and Corn Creek sit beside somebody's town and the far bands
measure against the towns that are really there.
