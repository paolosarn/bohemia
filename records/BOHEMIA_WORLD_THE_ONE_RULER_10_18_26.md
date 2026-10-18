# WORLD: THE ONE RULER (10/18/26, world lane, the new age, rules 112 to 117)

The coordinator's ask: COMBAT TWO flagged a block-size mismatch (records/BOHEMIA_COMBAT2_THE_BOARD_CUT_FROM_THE_MAP_10_18_26.md,
THE RULER): the map's block is 384 m (WORLD), but the map paints a lane 2 fine cells wide, so a fine cell reads 1.8 m
and a block 230 m. Settle which is true from the region data; tell RUN and COMBAT TWO on the board.

## 1. THE ANSWER

**BOTH 384 m AND 96 m ARE TRUE, FOR TWO DIFFERENT JOBS. 230 m IS NOBODY'S NUMBER.**

- **A map block is 384 m of real Las Vegas ground.** Where things are, how far apart, how long a trip takes. The 7/6
  valley scale law (Paolo, LOCKED), the region file, the travel clock. Unchanged.
- **The drawing inside a block is 96 m at life size, 0.75 m a fine cell.** A lane, a sidewalk, a house and an arterial
  kerb to kerb are each their real Las Vegas size at 0.75 m. That is the fight board's ruler.
- **The land is squeezed four to one; the things on it are not.** GTA's trick, the law's own words ('a 1:4 linear
  compression... GTA's exact proven ratio') and its abstraction clause ('a house on the city map represents a housing
  neighborhood'). Of the 384 m a block stands for, the map draws 96 m of it, life size.
- **230 m came from the wrong file.** `LANE_W = 2` is in engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js and
  engine/bohemia_blockgen.js. The map the demo draws does not use it for its arterials: it paints **a lane 4 cells
  of asphalt and a 1-cell line** (3.4 m with its line; a real lane is 3.05 to 3.66 m). Read off the cells the map
  actually paints, every size agrees with 0.75 m and none agrees with 1.8 m.

## 2. HOW IT WAS SETTLED (measured, not argued)

### a. The region data and the valley's bones, on the game's seed ('bohemia', 2691674296)

| test | at 384 m a block | at 230 m a block | real Las Vegas |
|---|---|---|---|
| the valley, 96 blocks | 36.9 km | 22.1 km | 22.9 mi = 36.85 km (the 7/6 law); Red Rock to Frenchman Mountain about 30 km, Apex to Anthem about 45 |
| the long arterials, mean spacing 4.4 blocks (27 gaps) | 1,692 m | 1,014 m | the section-line grid: Sahara, Desert Inn, Flamingo, Tropicana a mile apart, 1,609 m |
| Henderson, 20 km from the Strip at bearing 122 | inside the valley (44 blocks east, 28 south of the middle) | 87 blocks out, past the map's edge | the 7/6 law: the map IS the whole valley |

At 230 m the map would be a 22 km city with arterials every kilometre and no Henderson. The region data is 384 m.

### b. The map's own cells (the drawing), 72 road cuts, 30 suburb blocks, 629 roofs

Read by tools/bohemia_world_the_one_ruler_10_18_26.js from the demo's own `cellAt` (the realizer every block is
painted from), saved as records/BOHEMIA_WORLD_THE_ONE_RULER_MEASURED_10_18_26.json.

| what | fine cells (median) | at 0.75 m | at 1.8 m (230 m a block) | real Las Vegas |
|---|---|---|---|---|
| a lane, its line in | 4.5 | **3.4 m** | 8.1 m | 10 to 12 ft, 3.05 to 3.66 m |
| a six-lane arterial kerb to kerb (3 lanes, 7-cell median, 3 lanes) | 35 | **26.3 m** | 63 m | 24 to 30 m; Clark County's 100-ft right of way is 30.5 m with the walks |
| a sidewalk | 2 | **1.5 m** | 3.6 m | Clark County standard 5 ft, 1.5 m |
| a house roof | 17 x 12 | **12.8 x 9 m** | 30.6 x 21.6 m (a 7,100 sq ft footprint) | a tract ranch, 1,200 to 2,000 sq ft, about 15 x 10 m |
| houses on a suburb block | 21 | **22.8 a hectare** | 4.0 a hectare (rural acreage) | a Las Vegas tract, roughly 12 to 25 a hectare gross |

Five of five agree with 0.75 m. Five of five fail at 1.8 m. Five of five fail at 3.0 m (384 m drawn).

## 3. WHAT IT MEANS FOR EACH LANE (rule 12: findings acted on by the owner)

**COMBAT TWO** (the board cut from the map block): the map's fine cell is 0.75 m. A house tile (11.5 m) is **15.3 fine
cells**; one map block of drawing (96 m) is **8.3 house tiles**; the map's houses come out about **one house tile
each** (12.8 m), which is A COMBAT TILE IS A HOUSE agreeing with the map (at 1.8 m each house would be 2.7 tiles and the
law would break). The small board (9 x 7 = 104 x 80 m) is about one block; the large board (20 x 15 = 230 x 172 m) is
the block and its ring, **2.4 x 1.8 blocks of drawing**, cut from the 3 x 3 neighbourhood your tool already saves
(COMBAT2_MAP_CELLS_10_18.json holds it). Lay each map roof as one house at its own place, never a roof stretched 2.4
times. Your record's ruler section is the only place 230 m lives; nothing live carries it (the gate's E1 keeps it so).

**RUN** (the map, the clock, the region): nothing to change. The clock charges 384 m a block, the region is 384 m, the
drawing is already life size at 0.75 m and agrees with itself. The old `LANE_W = 2` in the 7/16 graphics engine and the
block generator is not what the map paints; if anything draws from those files at the map scale, its lane is half a
real lane.

**WORLD** ([the roll]): one honest gap the gate prints and never reds. The Strip is drawn **2.2 times its real length**
(the Strat to the Luxor is 33 blocks; real 5.8 km is 15 blocks at 384 m) so its 5 x 5 mega-resorts fit. That is the
abstraction law at work on the landmarks; the roll decides whether it stays.

## 4. THE GATE

gates/the_one_ruler_gate.js, registered as THE ONE RULER (GATE REGISTRY 7/0). 17/0. It refuses: the region file off
the law; the arterial mile and Henderson off at 384 m; the drawing not life size at CELL_M (and it proves the test
bites: read at 1.8 m, at least four of five fail); a measurement of another seed or too few samples; any live file in
engine/ or slices/ saying 230 m a block. It prints, never reds, when the painter's four functions (__subGrid,
__kitGrid, tileMeta, realizeCell in the CITY frame) changed since the measurement. Mutation-proved four ways: the
region at 230 (3 reds), the cells doubled (4 reds), another seed (1 red), a live file with the dead number (1 red).

## 5. WEAK, SAID

- The cells are read from one painter on one seed. A second seed would only change which blocks are sampled; the
  painter is the same. The measurement is a committed file, so a painter change prints a re-measure line rather than
  re-measuring live (a live read drives the demo, 15 s, and the suite's ten-minute budget is PLUMBER's).
- The real ranges are from public standards and common tract sizes, cited in the table, not from a survey of the
  valley's parcels.
- The squeeze leaves 15 of every 16 real houses undrawn. That is the 7/6 law's abstraction, not a defect, but it means
  'a map block' and 'the place a fight happens' are different sizes: 384 m for the journey, about 100 m for the board.
