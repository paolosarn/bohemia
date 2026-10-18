# WORLD: ONE NUMBER FOR A BLOCK (10/18/26, world lane, the new age, rules 112 to 117)

Row: [the block size settled] (the coordinator, 10/18, from COMBAT TWO's flag: "the map's block is 384 m, a real
Las Vegas block is about 230 m... the map, the fight boards and the travel times all read the block's size; two
numbers means two of them are wrong"). END STATE asked for: the true block size from the real region data with its
source, every file that carries the other number listed, a check that fails when two files disagree, RUN and COMBAT
TWO told on the board. Data only, real geography first.

The row was filed three minutes after [the one ruler] landed (records/BOHEMIA_WORLD_THE_ONE_RULER_10_18_26.md), so
the size itself was already settled. What this round adds is the list and the check.

## 1. THE TRUE SIZE, AND WHERE IT COMES FROM

**A map block is 384 m of real Las Vegas ground, and its drawing is 96 m at life size.** Two true numbers for two
jobs; 230 m is nobody's.

| quantity | value | the one file that says it | why it is true |
|---|---|---|---|
| ground a block | **384 m** | engine/BOHEMIA_REGION_LAND.json `metresPerCell` | the 7/6 valley scale law (Paolo, LOCKED): the real valley is 22.9 miles over 96 blocks. On the game's seed the long arterials sit 4.4 blocks apart = 1,692 m, Las Vegas's real section-line mile (1,609), and Henderson lands inside the valley. At 230 m the arterials would be 1 km apart and Henderson 87 blocks off the map. |
| drawing a block | **96 m** | engine/bohemia_overmap.js `CELL_M` 0.75 x `TILE_FINE` 128 | read off the map's own cells: a lane 3.4 m, an arterial 26.3 m kerb to kerb, a sidewalk 1.5 m, a house 12.8 x 9 m, 22.8 houses a hectare, all real Las Vegas sizes. At 1.8 m a cell all five fail. |
| a fine cell | **0.75 m** | the overmap | as above |
| the clock | **0.084 min a fine cell**, 10.752 an open block, half that on a road, 1.8 times in the hills | the CITY frame's `MIN_PER_CELL`, copied into the region file's `scale.clock` | what the party is actually charged (9/5, "the baseline does not move"; the 9/4 laws master measured the walk at it) |
| a day's travel | **268 road blocks, 134 open** | derived: 1,440 minutes over 5.376 and 10.752 | |

The land is squeezed four to one; the things on it, and the minutes, are not.

## 2. EVERY FILE THAT CARRIES IT (swept 10/18: 3,324 files, 46 declarations)

A carrier is a file that DECLARES the number (a const, a property, a JSON key, a Python assignment). Prose does not
count: the canon registry proved on 8/5 that a regex over sentences cannot tell our 37 km2 from Skyrim's.

### Agree (16 files; some also carry an owed line below)

| file | declares | owner |
|---|---|---|
| engine/BOHEMIA_REGION_LAND.json | 384 real, 96 drawn, 0.084, 128, 10.752 | WORLD (the source) |
| engine/bohemia_overmap.js | TILE_FINE 128, CELL_M 0.75 | the source |
| engine/bohemia_lattice.js | CELL_M 0.75 | LIFE+CITY |
| engine/bohemia_reach.js | METRES_PER_BLOCK 384, METRES_PER_MINUTE 9 (12 cells a minute; the clock's 11.9, 0.8 percent) | QUESTS (9/7) |
| slices/BOHEMIA_CITY_WORLD.html (the CITY frame the demo opens) | TILE_FINE, CELL_M x2, MIN_PER_CELL 0.084, METRES_PER_BLOCK 384, METRES_PER_MINUTE 9 | RUN |
| slices/bohemia_region.js | metresPerBlock 384 (then the region file's) | RUN |
| slices/BOHEMIA_CITY_CURRENT.html, BOHEMIA_CURRENT_SLICE.html, BOHEMIA_MAP_CURRENT.html, BOHEMIA_ENTER_SLICE_7_18_26.html, BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html | TILE_FINE 128, CELL_M 0.75 | RUN / old July pages |
| slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html | TILE_M 0.75 (a fine tile there; the overmap's TILE_M is a block) | the retired LAB |
| banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json | blocks_per_day_open 135 (134; 0.8 percent) | FACTIONS |
| tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py, reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json | world_block_m 384 | COMBAT TWO |
| records/BOHEMIA_CANON_CONSTANTS.md | METRES_PER_TILE 0.75, TILES_PER_CELL_SIDE 128, VALLEY_KM2 84.93 (drawn), and from this round METRES_PER_BLOCK_REAL 384, METRES_PER_BLOCK_DRAWN 96, MINUTES_PER_FINE_CELL 0.084 | the registry (retired LAB's; WORLD this round) |

### Carry another number: OWED, each pinned so it can only be fixed

| file | says | should say | owner | what it does |
|---|---|---|---|---|
| tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py | `M_FINE = 1.8` | 0.75 | COMBAT TWO | the pre-ruler cook; read the 7/16 engine's 2-cell lane as a real lane |
| reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json | `fine_cell_m` 1.8, `block_m` 230 | 0.75, 96 drawn / 384 ground | COMBAT TWO | the board manifest's ruler: the large board (20 x 15 house tiles of 11.5 m = 230 x 172 m) is **2.4 x 1.8 blocks of drawing**, not one block |
| records/target/BOHEMIA_VOTE_REGISTRY.json, item combat2-the-board-cut-from-the-map-10-18 | "a cell reads as 1.8 m and the largest board, 230 m, is one map block" | "the largest board is about two and a half map blocks of drawing" | COMBAT TWO (RUN TWO holds the file) | words in his VOTE tab |
| banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json | `blocks_per_day_road` 260 | 268 | FACTIONS | 496 blocks over RUN's rounded 1.9 days (10/16); the clock is 1,440 over 5.376. 3 percent; the sight radius' "about nine hours' walk" reads the open number, which agrees |
| slices/bohemia_region.js, the twelve fallback TOWNS | Henderson at 201 m a block, Boulder City 197, the dam 195, Jean 278, Primm 283, Searchlight 326, Indian Springs 311, Mt Charleston 301 (8 of 10 off by over 15 percent) | the region file's places at 384 m | RUN | used only when the region file fails to load; the real places replace them otherwise |
| slices/BOHEMIA_CITY_WORLD.html `realizeCell` | `LANE_W = 2` (a lane 1.5 m at 0.75 m a cell) | 4 or 5 | RUN | the parametric road kept as a fallback: every road kind on the game's seed (arterial 2,434, freeway 952, rail 90, strip 81, interchange 16; beltway 0) draws from its own kit, so it paints nothing |
| slices/BOHEMIA_CURRENT_SLICE.html, BOHEMIA_MAP_CURRENT.html | `LANE_W = 2` | 4 or 5 | RUN | the July street painter inside the alpha's SLICE and MAP tabs: a lane drawn half its real width |
| slices/BOHEMIA_ENTER_SLICE_7_18_26.html, BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html | `LANE_W = 2` | | old July pages | not in a tab |
| engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js, engine/bohemia_blockgen.js, engine/bohemia_engine_graphics_7_14_26.js | `LANE_W = 2` | | the 7/14 and 7/16 engines | **the root of 230 m**; no live page (the alpha, the demo, the CITY frame) loads them |

### Fixed this round (the registry is WORLD's to correct: it says of itself "on any conflict the law wins and this file is the thing that is wrong")

- **records/BOHEMIA_CANON_CONSTANTS.md `SECONDS_PER_STEP` 3.52** (the 7/27 camp law: a day across and back) said a
  block of travel costs 7.5 minutes; the clock charges 10.75. Its exemption said it "becomes measurable the day a
  per-step cost lands in code, and must be measured then." That day came on 9/5; measured it is 5.04 s. Newest date
  wins (the 9/4 laws master records 0.084 minutes a fine cell), so the row is now `MINUTES_PER_FINE_CELL` 0.084,
  measured off the CITY frame. CANON CONSTANTS 33/0, sixteen constants, fifteen measured.
- **`VALLEY_KM2` 84.93 "total valley area"** read as if the valley were 85 km2. It is the DRAWN valley, 9.2 km a side;
  the real ground behind it is 36.9 km a side, 1,359 km2, sixteen times it. The meaning now says so, and so do
  BUILT and ON-FOOT.
- The registry now declares **METRES_PER_BLOCK_REAL 384** and **METRES_PER_BLOCK_DRAWN 96**, both measured live.

## 3. THE CHECK THAT FAILS WHEN TWO FILES DISAGREE

gates/the_one_ruler_gate.js section F, in THE ONE RULER (registered). 32/0, 2.9 s. It derives the one number from
the two source files (never typed in the gate), sweeps engine/, slices/, banks/, mods/ and the fight board manifests
for every declaration of a block's size, a fine cell or the clock (and tools/ for the names only the map uses), and
refuses:

- F1 a listed carrier that drifts off the one number (1 percent: a rounded copy is a copy);
- F1 an OWED carrier moving to a third wrong number (its own wrong value is pinned; the fix always passes);
- F2 a declaration nobody listed that says another number (one that agrees prints "list it");
- F3 a road kind on the game's seed drawn by the CITY frame's 2-cell lane;
- F4 a live page loading the 7/16 block generator;
- F5 the canon registry without the block's two sizes and the clock, or a row off them;
- F6 a new VOTE item saying a block is 230 m or a cell 1.8 m;
- F7 RUN's fallback towns drifting further off 384 m.

Eight mutations run inside it, in memory: the reach module at 230 (red), FACTIONS moved to 250 (red), FACTIONS fixed
to 268 (passes, prints take it off), an unlisted file at 230 (red), an unlisted file that agrees (note only), the
freeway off the kit list (red, 952 blocks), the dead step back in the registry (red), a cook tool at 1.8 m (red).
And the registry's own three: its clock row moved, its ground row at 230, the frame's clock moved: each red.

## 4. FOR EACH LANE (rule 12: findings, acted on by the owner)

- **COMBAT TWO**: the fine cell is 0.75 m. Your cut tool, its manifest and the VOTE item still say 1.8 m and that the
  largest board is one block; it is about 2.4 blocks of drawing across. The next board you cut from the map reads
  `M_FINE` 0.75 (or `OM.CELL_M`), lays each map roof as one house tile, and the gate tells you to take the entry
  off the owed list. Your newer tools (the five houses, a board you read in one look) use 11.5 m a house tile and
  1.44 m a board cell, which agree.
- **RUN**: nothing on the demo's map or clock disagrees. Two owed: the twelve fallback TOWNS (only when the region
  file fails to load), and the July street painter in the alpha's SLICE and MAP tabs (a lane half its width).
- **FACTIONS**: `blocks_per_day_road` 268, not 260 (the clock, not a rounded day count).
- **RUN TWO**: the VOTE item's words are COMBAT TWO's to rewrite; the file is yours.

## 5. WEAK, SAID

- The sweep sees DECLARED numbers only. A number written in a sentence on a page, or computed inline
  (`384 / 128`), is not read; that is on purpose (the 8/5 finding) and it means a carrier can hide in arithmetic.
- tools/ is swept for the map-only names, not for CELL_M, TILE_M or LANE_W, because the cook tools use those for a
  house tile or a sprite cell. A cook that types the map's cell as `CELL_M = 1.8` is not caught; one that types
  `M_FINE` or `block_m` is.
- The 1 percent tolerance lets FACTIONS' 135 open blocks a day (133.9) and the reach module's 9 m a minute (8.93)
  stand as copies.
- Nothing drawn and nothing in the demo (rule 88 hold; RUN paints). NOT IN A TAB (data and a check).

[bb school line] Battle Brothers never states a map scale anywhere a player sees it, and no number in its files
disagrees with another because there is only the one: the world map's tile, and every distance is days. Ours has
three true sizes for three jobs (ground, drawing, minutes), and now one check that holds every file to them.

[analog horror line] The surveyor's tape in the dead county office still reads in feet, the plat maps in chains,
the bus schedule in minutes that no bus keeps; three rulers for one street, and only the walk is honest.
