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
