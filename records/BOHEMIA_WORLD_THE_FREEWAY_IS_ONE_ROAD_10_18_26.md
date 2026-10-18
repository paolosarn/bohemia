# WORLD: THE FREEWAY IS ONE ROAD (10/18/26, world lane, the new age, rules 112 to 117)

Row: [the freeway as one road in the data] (the coordinator, 10/18, from Paolo's YES on the streets joining: "the two
that make up the freeway, as it runs through the city it should be unified, it doesn't look unified, it looks really
bad"). For RUN's [one freeway, and nobody is an icon]. END STATE asked for: each real freeway through the region
(I-15, US-95, the 215 where it falls inside) as one named polyline with its lanes, ramps and interchanges, every
district square it crosses listed, a check that it never breaks; handed to RUN. Real geography, data only.

## 1. WHAT WAS WRONG IN THE DATA (measured on the game's seed, 'bohemia' -> 2691674296)

- **The valley's freeway is 968 cells laid two abreast** (the I-15 spine, the cross-town through the Spaghetti Bowl,
  the beltway ring, three exit stubs, two mountain passes). Nothing said which two cells are ONE road, which half a
  cell is, or which real highway a piece is. So every cell is drawn as its own whole freeway, and two cells side by
  side read as two roads. That is "the two that make up the freeway".
- **At the valley's edge the joins were wrong.** The loader's stitch() joins each valley exit to the nearest real
  highway on the same side of the box. On the game's seed:

| the valley's exit | stitch() joined it to | the real road it is |
|---|---|---|
| the spine, south edge | I-15 S | I-15 S |
| the cross-town, real east end | NV-147 Lake Mead Blvd (a state route) | **I-15 N** (to Apex, Moapa, Mesquite) |
| the cross-town, real west end | NV-159 Charleston (a state route) | **US-95 NW** (to Indian Springs, Beatty) |
| the stub out the top (real north-west) | US-95 NW | a spur of US-95 NW |
| two passes, real east | NV-147, NV-564 | NV-147, NV-564 |

  The real I-15 north and I-515 to Henderson were joined to nothing. Over twenty seeds, I-515 / US-93 was never
  joined; I-15 N missed on 8.

## 2. WHAT THE DATA SAYS NOW

**engine/BOHEMIA_REGION_LAND.json `freewayPaths`**: the six real class-1 roads past the valley, block by block, with
the district of every run (tools/bohemia_world_region.py, same bytes every run): I-15 S 290 blocks, I-15 N 384,
US-95 NW 325, I-515 / US-93 25, I-11 / US-93 393, US-95 S 224.

**engine/bohemia_freeways.js**, `BohemiaFreeways.of(om, land, compass)`:

- **Every valley freeway cell has a real name** (968 of 968, 0 unnamed, 0 lone halves, on 20 of 20 seeds), and
  **knows which side its sibling half is on** (`median`: N, E, S or W). RUN draws a pair as ONE roadway: the median
  on the shared edge, the lanes outward, one width, one surface.
- **The names, in the real compass**: the spine is I-15; the cross-town is US-95 both ways out of the bowl (the
  overmap's own words, 7/5: "the cross-town freeway (US-95) runs BOTH directions through the bowl"); the ring is
  CC-215; each real highway's portal on the box takes the valley exit nearest it AROUND the box (not only on its own
  side), one road to one exit, two abreast only; a one-cell pass takes the nearest state route.
- **Each real freeway is ONE ordered road**, every step touching the next:

| road | from | to | blocks (about km of real ground) | in the valley | ramps | interchanges | lanes each way |
|---|---|---|---|---|---|---|---|
| **I-15** | California | the Virgin River | 834 (320 km) | 126 | 19 | 3, the Spaghetti Bowl among them | 5 in the valley, 2 on the open road |
| **US-95** | the proving ground | Searchlight | 740 (284 km) | 144 | 20 | 5 | 4 / 2 |
| **I-11 / US-93** | the Spaghetti Bowl | Arizona | 515 (198 km) | 98 | 16 | 3 | 3 / 2 |
| **CC-215** | a closed loop | | 280 (108 km) | 280 | 53 | 11 | 3 |

  A ramp is a street crossing the freeway with a street on both sides, a diamond at every mile arterial, as Las
  Vegas has. Lanes are approximate, NDOT's roads as they stand.
- **Every district it crosses, in order**: I-15 runs CALIFORNIA 129 > THE IVANPAH VALLEY 109 > LAS VEGAS VALLEY 234 >
  GARNET VALLEY 132 > THE MOAPA VALLEY 124 > THE VIRGIN RIVER 106; US-95 runs THE PROVING GROUND > INDIAN SPRINGS
  VALLEY > LAS VEGAS VALLEY > THE ELDORADO VALLEY > ELDORADO CANYON > SEARCHLIGHT. `squares` lists every block with
  its district (or, in the valley, the neighbourhoods either side of it).
- **The rim joins by name**: `BohemiaFreeways.stitch(F, land, compass)` writes the loader's own connector table (the
  clock and the pass grid see it) and returns stitch()'s own shape. On the game's seed: I-15 S from the spine (3
  made blocks), I-15 N from the cross-town's east end (31 made, round the north-east corner), US-95 NW from its west
  end (23 made), NV-564 and NV-147 from the passes.

## 3. THE ONE BREAK, SAID (the roll's)

**The roll lays no freeway out of the valley toward Henderson.** I-515 / US-93 (the real road from the Spaghetti
Bowl to Henderson and Railroad Pass, where US-95 S and I-11 go on) meets the box's real east edge at y 80; the
nearest valley freeway is the ring's south-east corner, **14 blocks away** on the game's seed. Over twenty seeds:
16 have this gap, 11 to 20 blocks; 4 have none. So US-95 and I-11 / US-93 are each one road with ONE hole, there,
and the check says so every run. The fix is the valley's layout, not the data: row [the roll] (this lane's) puts a
two-abreast exit where the real I-515 leaves. **The made blocks at the rim** (31 for I-15 N, 23 for US-95 NW) are the
other seam [the roll] closes: the valley's exits are rolled and the real roads are fixed.

## 4. THE CHECK

gates/the_freeway_is_one_road_gate.js, THE FREEWAY IS ONE ROAD (registered), 31/0, 2.1 s. It refuses a region path
with a hole or inside the box; an unnamed valley freeway cell; a pair with one half or no median side; I-15 with a
hole, short of the rim or not through the Spaghetti Bowl; CC-215 not closed; US-95's north-west leg broken; a
class-1 highway joined to a one-cell pass; a step past the valley with no district; the valley's I-15 without its
lanes or ten ramps; the breaks growing (only toward I-515 / US-93: 14 blocks on the game's seed, no more than 16 of
20 seeds, no longer than 20); the joins by name not landing in the loader's connector table. Six mutations inside:
the spine cut below the ring (red, "no freeway from I-15 S's exit to the bowl"), cut inside the ring (I-15 goes
round by the 215, green, as real traffic would), one half of a pair gone (red), the bowl gone (red), a hole in a
region path (red), the I-15 S portal gone (red, said, never silent), and the same valley twice (the same answer).

## 5. FOR RUN ([one freeway, and nobody is an icon]; your files, not touched)

- Load engine/bohemia_freeways.js beside the region loader. `F = BohemiaFreeways.of(om, R.land, C)` once per valley.
- **The pair as one road**: `BohemiaFreeways.cellAt(F, x, y)` gives `{ names, axis, median, lanes, junction, ramp }`.
  Draw the two cells of a pair as one carriageway: the median barrier on the `median` edge, the lanes from it
  outward, the sound wall on the far edge only. A `junction` cell is an interchange knot (the bowl's 16, the ring's
  corners and crossings).
- **The rim**: swap `L.stitch(r.roads, C)` for `BohemiaFreeways.stitch(F, R.land, C)`; same return shape, and the
  valley's I-15 stops turning into Charleston Blvd.
- The I-515 hole is [the roll]'s; draw the road up to it.

## 6. WEAK, SAID

- The names follow the overmap's layout (its spine, cross-town, ring, stubs). A future layout piece the module does
  not know is left unnamed, and the check reds (B1), so it cannot hide.
- The rim joins run one block outside the box, round its corners: that is the seam, counted, not hidden.
- Lanes are real-world approximations, not a measured table; no felt number is in this file.
- Nothing drawn, no VOTE sheet (rule 88; RUN paints). NOT IN A TAB (data and a check).

[bb school line] Battle Brothers' roads are one painted line from town to town and never change width at a region
border; ours now know they are one road, which half of it a cell is, and where the real road goes when it leaves
the valley.

[analog horror line] The overhead sign over the dead interchange still says I-15 NORTH, SALT LAKE CITY, and the
arrow points at a wall of stopped cars that has not moved since the dollar died.

## 7. THE GAP: THE FIX IS BUILT, AND HELD OFF MAIN (10/18/26, round world-vamily-opus5, the coordinator's FIRST)

The coordinator: "US-95 still has a 14-block gap toward Henderson. FIRST: close that gap (his word: the freeway must
read as one road)."

**BUILT** (branch `world-henderson-leg`, 69f58f7c; nothing of it is on main): THE HENDERSON LEG in the roll
(engine/bohemia_overmap.js layoutFromSeed). The real I-515 / US-93 crosses the valley's real east edge at row 80 (the
region's portal); the roll lays a straight two-wide freeway from the ring's real-east side to the border on the
mid-block row nearest 80, or carries the ring's bottom pair straight on; never through the water cluster, the air
base, a mine or the solar field (the valley's power: a first cut split it and PLACES ARE BLOCKS and BB PLACES went
red), never beside a pass; a placed rect costs it a mile; no dice called. engine/bohemia_freeways.js takes it as
I-515's exit. Measured: the game's seed 0 breaks (was 14 blocks), I-515 joined with 3 made rim blocks; 210 seeds, 0
breaks (50 seeds lay no leg because the solar field holds that border, and the stub already there carries I-515; the
rim join's worst is 31 blocks). THE FREEWAY IS ONE ROAD 35/0 on the branch (no break allowed; the leg's row is the
portal's; the leg removed brings the break back). On the game's seed the leg changes exactly 26 valley cells, all its
own; across 30 seeds 20 to 42, nothing else in the layout moves.

**WHY IT IS HELD: IT MOVES THREE FACTION CAPITALS, ONE OF THEM THE PLAYER'S.** The seats are derived from the list of
buildable lots that front a road (engine/bohemia_towns.js districtsOf), and placeHomes' fallback for a faction whose
home kinds are taken ('spread') picks `list[(n * 7919) % list.length]`: by the cell's INDEX in that list. Five house
lots fewer anywhere in the valley shift every index, so the pick lands somewhere else. On the game's seed: Anarchists
24,82 -> 37,82; Colorful 35,56 -> 67,65; **Custom (the player's own faction) 61,73 -> 87,73**. The page carries the
seats baked (CT_BASES_BAKED) and FACTIONS' check (tools/bohemia_city_factions_patch.py --check, gate U6b) says
SEATS STALE; re-baking would move the player's home 26 blocks for a freeway. That is not a side effect a road may
have. And it is not the leg's alone: ANY change to the roll (this lane's [the dam in one place], [the roll], [the
three sizes of place]) moves the same capitals. FACTIONS' own rule says why it matters: "a capital that moves when
you reload is not a capital".

**THE UNBLOCK (FACTIONS, on the board):** the seats hold still. Either the spread pick stops depending on list
position (pick by a hash of the faction and the cell, so only losing the chosen cell itself moves it), or the baked
seats become the game's canon for its seed. Then the leg ships as it is on the branch (the six pages synced there).

**ALSO FOUND, FROM THE MAP'S CAMERA** (tools/bohemia_world_the_freeway_reaches_henderson_shot.js on the branch; the
committed demo with the map frame served from main and from the branch, records/target/world_henderson_leg/ there):
with the leg, the region's real I-515 bends in at the box's edge and meets it; but RUN's far-land painter ('THE
ROADS OUT: every freeway that reaches the map's edge keeps going') also carries every exit STRAIGHT ON across the
desert, so wherever the real road leaves at an angle the map shows two roads for one. It does this today at the
other exits. Handed to RUN.
