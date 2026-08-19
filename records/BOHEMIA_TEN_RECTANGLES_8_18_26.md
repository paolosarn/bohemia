# TEN RECTANGLES CANNOT SAY "GHOST PLAT"
### The terrain generators never reached the surface he walks on (8/18/26, WORLD lane)

**Measured on the running page, asking `tileMeta` what a real terrain cell actually is:**

| district | result |
|---|---|
| desert | `hasKit:false` `open:true` **rects:10** |
| wash | `hasKit:false` `open:true` **rects:10** |
| mountain | `hasKit:false` `open:true` **rects:10** |
| water | `hasKit:false` `open:true` **rects:0** |

Every terrain cell in the valley — a 128×128 tile plate — was realized as **ten 2×2
rectangles of flat colour**. That was the whole thing.

Meanwhile `engine/bohemia_desert.js` had been authoring self-spaced creosote (not confetti
scatter), OHV tracks, illegal dumping, caliche hardpan and the **ghost plat** — a graded
subdivision nobody built — and `engine/bohemia_wash.js` the braid, the riprap, the concrete
flood structure and the sewer tunnel mouth.

`gates/terrain_gate.js` has been green on all of it since 7/26.

## THE SHAPE OF THE MISS, WHICH IS THE SAME AS EVERY OTHER ONE THIS LANE FOUND TODAY

**`terrain_gate` tests the GENERATOR. Nothing asked whether the game called it.**

That is the third time in one day: `hazard` classified ground nothing could reach until it
was wired; `occupancy_gate` found the model and the surface disagreeing about 4,327 of
4,327 cells; and here a generator with a full gate suite behind it was never invoked. A
gate that checks its own side of a seam nobody is standing on will stay green through
anything.

## THE FIX TOOK A DOOR A ROAD BUILT LAST WEEK

The page already had the mechanism, and its own comment says why:

> *"A ROAD WITH ITS OWN MODULE DRAWS ITSELF (8/18). The parametric XSEC table below is four
> numbers, and four numbers cannot say 'palm median', 'promenade at the back of curb' or
> 'enclosed pedestrian bridge over eight lanes'."*

Ten rectangles cannot say **ghost plat**. Terrain takes the same door.

**After, on the same cells:**

| district | tile types | top of the histogram |
|---|---|---|
| desert | **13** | desert pavement 6189, graded pad 5304, rock lag 2043, dry rill 1213, caliche hardpan 619, OHV track 334 |
| wash | **13** | channel bank 4554, channel invert 3276, maintenance road 1564, riprap 942 |

And the occupancy came with it: the wash went from 16,344/16,384 walkable to 14,799 —
its concrete flood structure and riprap now block, which is what they are.

## THE ONE THING THAT COULD BREAK SILENTLY, AND HOW IT IS HELD

Terrain is sampled from **one valley-wide field in global coordinates**. That is the entire
reason a ridge crosses a cell boundary instead of stopping dead at it. `__kitBlock`
generates one 128×128 block per GRP × GRP cells (FN=32, GRP=4), so **the block coordinate
is the 128-tile coordinate** and `gx4/gy4` is what `opts.cellX/cellY` must receive.

Hand the generator the **cell** instead and every seam in the valley breaks **while each
cell still looks perfectly fine on its own.** There is no way to see that in a screenshot.

So it is measured against a control, and the control is **averaged over six distant cells**
because a single sample swings and a gate whose threshold sits near the noise is a gate
that flakes and then gets switched off:

| | match along the shared edge |
|---|---|
| real neighbour | **117 / 128** |
| six distant controls, averaged | 54.7 / 128 |
| **mutation: pin the field coordinate** | **71 / 71 — identical, no seam at all** |

## IT TOOK THREE MEASUREMENTS TO GET THE DESERT IN

1. First run: **wash took the new door and came back with 13 real tile types. Desert did not
   move.** Its generator is not inlined in the city page at all, so `BohemiaDistrictKit.get('desert')`
   returns null there. 620 cells of the most common ground in the valley, generated for
   weeks by a module the walked surface had never loaded.
2. Inlined it. **Still nothing.** It samples `engine/bohemia_terrain_noise.js` — the one
   continuous field — and that was not on the page either, so the generator threw on load
   and fell back to the rectangles.
3. Inlined the field first. Desert came in with its 13 types and the seam held.

**A dependency that is not there fails exactly like a feature that was never wired**, and
the only thing that told them apart was measuring the page again instead of re-reading the
patch.

## DELIBERATELY EXCLUDED, WITH DIFFERENT REASONS

- **MOUNTAIN** — routing it would be an *improvement*: it is 0/256 walkable today, a solid
  wall, while its own generator and `terrain_gate` both insist *"the mountain is a wall with
  PASSES"* and the ravine floors are walkable. But it changes valley traversal for **927
  cells** and deserves its own pass with its own before/after, not a ride along.
- **WATER** — its legend declares `open water` non-solid, because its kind is `water-dead`
  which the kit layers as ground. Routing it would let him **walk out onto the lake**. That
  is a misdeclaration in the water legend and the fix belongs there — deep water blocks —
  not inside a terrain patch that would ship the bug first.

The gate asserts both still take the rectangle fallback, so the exclusion stays a live
decision and the fallback stays live code.

## A NUMBER I PUBLISHED THIS MORNING AND GOT WRONG

The 8/18 handoff and backlog said *"the walked surface's kit registers 35 of the engine's 66
district types, so 10 of the 21 hazard districts cannot be reached at all."* **The page
registers 57 of 66.** The nine absent are `suburb` (its own realizer, deliberate, recorded
8/3), the roads (`arterial`, `arterial_x`, `freeway`, `rail`, `interchange`) and the terrain
(`desert`, `mountain`, `water`) — every one handled by a dedicated path rather than missing.
The real gap was narrower and sharper than the number I gave, and it is the one this record
is about.

---
**Fix:** `tools/bohemia_city_terrain_patch.py` · **Gate:** `gates/terrain_surface_gate.js`
(13 checks, mutation-confirmed) · **Generator gate it complements:** `gates/terrain_gate.js`
