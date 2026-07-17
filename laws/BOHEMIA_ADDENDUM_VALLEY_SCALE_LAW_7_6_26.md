# BOHEMIA ADDENDUM: VALLEY SCALE LAW + ABSTRACTION LAW (LOCKED 7/6/26)

Paolo's call, verbatim intent: "my map is the whole las vegas valley yes
essentially. i want to be able to make this game large but fun. a house on the
city map represents a housing neighborhood. a collection of houses either a
large house neighborhood or an apartment complex. a single commercial grid is
a parking lot with stores. a collection of them is bigger parking lot with a
walmart or even a mini mall... you could walk from one end of the map to
another without ever needing to go into city view."

## 1. VALLEY SCALE LAW (LOCKED, revokes the 24m SLOT SCALE LAW of 7/5)
- The 96x96 overmap IS the whole Las Vegas valley.
- 1 overmap cell = ONE NEIGHBORHOOD = 128x128 fine cells = 8x8 chunks
  (CHUNK=16) = 96m x 96m = ~one Pelican Town of tiles (16,384 vs 13,200).
  [RESIZED + LOCKED later same day 7/6: comparative research + Paolo's
  content-density law (dense over vast, never filler) moved 512 -> 128.
  Full reasoning in BOHEMIA_ADDENDUM_VEHICLES_AND_CELL_SIZE_7_6_26.md and
  BOHEMIA_ADDENDUM_NEIGHBORHOOD_SCALE_RESEARCH_7_6_26.md.]
- Valley span = 96 x 96m = ~5.7 miles across = Los Santos scale, a 1:4 linear
  compression of the real 22.9 mi valley (GTA's exact proven ratio).
- Mega-resort 5x5 blocks still hold; the 96x96 authoring never moved.
- CELL_M = 0.75 unchanged: one fine cell = one footstep, the 120 BPM gait law
  is untouched.
- Constants relocked in bohemia_overmap.js: TILE_FINE=128, SLOT_FINE=128,
  TILE_M=96. tileToFine() and API surface unchanged in shape.

## 2. ABSTRACTION LAW (LOCKED)
The city map draws the CLASS of a neighborhood; the fine layer holds the
REALITY of it.
- One house sprite on the overmap = a whole HOUSING NEIGHBORHOOD underneath.
- A collection of house cells = a large-house neighborhood OR an apartment
  complex.
- One commercial cell = a parking lot with stores.
- A collection of commercial cells = a big-anchor lot (Walmart-class) or a
  mini mall.
- Same principle extends to every district class: the overmap glyph is the
  legend entry, the fine layer is the place. [Per-class fine-layer templates:
  PENDING, Paolo's calls as each district gets its drop-in pass.]

## 3. CONTINUOUS WALK LAW (LOCKED)
- The fine layer is ONE UNBROKEN WORLD. The player can walk from one end of
  the valley to the other without ever surfacing to city view.
- City view is the zoomed-out READ of the world, never a wall, never a loading
  gate.
- DROP IN is a camera/mode change, not a level load.
- Fine cells realize DETERMINISTICALLY per (seed, overmap cell) as the player
  approaches, CDDA-style streaming. Only chunks near the player are live;
  chunks behind are evicted. The 16x16 chunk cache law (grid-unit addendum)
  is the render unit.
- WORLD MOVERS LAW unchanged: nothing advances until the player moves, in
  either mode.

## 4. THE HONEST TRAVEL NUMBERS (why "large but fun" holds)
At the locked gait (walk 1 fine cell per half-beat step = 1.5 m/s, run 2 cells
per move = 3 m/s):
- Cross one neighborhood cell (384m): ~4.3 min walking, ~2.1 min running.
- Cross the whole valley (22.9 mi): ~6.8 hours walking, ~3.4 hours running,
  real time, holding the button.
- City-mode traversal stays the fast layer: cell-to-cell marker moves, 10 min
  in-game per cell step.
The scale is the point: the valley SHOULD feel like a day's journey on foot.
Fast options (vehicles, transit lines, mounts, whatever) are a separate design
fork, see PENDING below.

## 5. WHAT THIS CHANGES IN CODE (build order)
1. bohemia_overmap.js scale constants: DONE this session (relocked, builds,
   functional check passes, census healthy at seed 12345).
2. City drop-in (bohemia_city_unified.html): today it generates a small
   isolated patch per drop. Must become a STREAMING WINDOW over the continuous
   fine world: patch generation keyed by (seed, cell, chunk), stitched at cell
   borders so walking off one neighborhood's edge realizes the next. This is
   the next major build.
3. Border stitching rule: roads/washes/arterials that cross cell borders must
   agree on both sides. Deterministic per-edge hashing (hash of the two cell
   coords) decides crossing positions so both neighbors generate the same
   openings independently.
4. Neighborhood fine-layer templates per district class (housing tract,
   apartment complex, strip-lot, Walmart-anchor lot, mini mall, resort floor,
   etc). [PENDING, Paolo's call per class.]

## 6. STATUS
- VALLEY SCALE LAW: LOCKED.
- ABSTRACTION LAW: LOCKED.
- CONTINUOUS WALK LAW: LOCKED.
- Fine-layer district templates: PENDING per class.
- Player fast-travel / vehicles: PENDING, Paolo's call.
