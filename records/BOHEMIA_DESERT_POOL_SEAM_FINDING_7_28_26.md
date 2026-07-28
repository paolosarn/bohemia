# FINDING — THE DESERT POOL IS NOT SEAMLESS, AND ITS OWN BANK SAYS IT IS (7/28/26)

I went shopping the way the NEVER DRIFT law now requires, found the right
approved asset for the job, wired it, looked at it on the real surface, and it
put a **black grid across the whole district**. Then I measured instead of
guessing again. Writing it down so the next session does not spend the same
hour.

## THE JOB

Backlog RUN 0b, DISTRICT ART: every non-suburb district wears a generic material
pass laid from the frozen CBB tileset — the set Paolo's own verdict called
*could be better*. The shopping index
(`records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`) lists exactly the right
approved asset for this and flags the gap itself:

> DESERT/TERRAIN | 13 terrain picks + desert/rock/rubble pools |
> BOHEMIA_TERRAIN_PICKS_7_14_26 + BOHEMIA_DESERT_POOLS_7_18_26 | **bake + target
> factories (not run)**

`banks/BOHEMIA_DESERT_POOLS_7_18_26.txt` states its own provenance:

> "ground": "GROUND_SEAMLESS_SET certified **\"2. Soil and dirt tiles\"** (only
>  the tiles that **pass the no-grid seam test**)"

That certification is the entire reason these tiles are the right ones for a
district floor.

## THE MEASUREMENT

It is not true of the pixels the bank ships. All 8 ground tiles, measured:

| tile | size | interior mean | edge mean | wrap L-R | wrap T-B | neighbour ref |
|---|---|---|---|---|---|---|
| g0 | 92x96 | 115.0 | **26.8** | 27.7 | 34.4 | 9.2 |
| g1 | 94x96 | 125.2 | **31.3** | 34.4 | 33.7 | 8.8 |
| g2 | 94x96 | 149.5 | **54.1** | 45.5 | 49.7 | 8.7 |
| g3 | 94x96 | 174.4 | **66.7** | 47.2 | 69.5 | 9.9 |

Two independent failures:

1. **EVERY TILE CARRIES A NEAR-BLACK BORDER.** Edge brightness is a third to a
   quarter of interior brightness. That alone violates the visual constitution's
   own rule — `outline: "NO black keyline. Edges are value steps."`
2. **THEY DO NOT WRAP.** Left-column-to-right-column difference is 27-47 where a
   normal step between neighbouring interior pixels is ~9. Three to five times
   the discontinuity of any seam inside the tile. Laid edge to edge that IS a
   grid, at any scale.

Cropping does not rescue them — inset 2px → 3.46x, 3px → 2.81x, 4px → 2.62x,
6px → 1.73x. Still visible after cutting 12% off every tile.

## WHAT I RULED OUT FIRST

The grid was reproduced three ways before blaming the art, because the same
symptom has been my own bug before:
- one image per cell scaled to CELL → grid
- pattern pre-scaled to a 3-cell repeat → grid at 3-cell intervals
- pattern at **native size**, world-anchored, no resample at all → still a grid

A symptom that survives every change to how it is drawn is in the source, which
is this repo's own VERIFY ON THE REAL SURFACE rule (7/18) applied to a bank
instead of a renderer.

## WHY NOTHING SHIPPED

A black grid over twenty districts is worse than the generic pass it replaces.
Shipping it because the law says to use approved art would be the STOP PRODUCING
failure by the letter: *finding a legal way to ship anyway IS the violation.*

The run is unchanged. Nothing was cooked, nothing was re-rendered, and the
desert pool was **not** left loaded-and-unused in the build — that is the exact
defect `gates/banks_used_gate.js` now exists to catch, and importing art you
cannot draw would have created it.

## WHAT THIS COSTS, AND THE THREE WAYS OUT — Paolo's pick

DISTRICT ART is the RUN lane's top gap and this was the no-cook route to it.
That route is closed until one of these:

1. **DE-BORDER THE POOL.** A tool that strips the keyline and makes the tiles
   genuinely wrap (mirror-blend the edges), producing a *derived* bank from his
   approved pixels. No new art invented; it is his soil, made to tile. Needs his
   nod because a derived bank is still a new bank.
2. **SHOP A DIFFERENT BANK.** `BOHEMIA_GROUND_SEAMLESS_SET_7_10_26` and
   `BOHEMIA_TERRAIN_PICKS_7_14_26` are separate approved banks; one of them may
   contain tiles that really do wrap. Cheapest to check — same measurement,
   twenty minutes.
3. **LEAVE THE GROUND, DRESS THE DISTRICTS.** Districts get their identity from
   structures and props rather than floor texture. The floor stays CBB.

## THE STANDING LESSON

**A bank's own provenance line is a claim, not a fact.** "Certified seamless"
was written by whoever built the pool, and nothing ever measured it. The banks
he approved are approved on LOOK — he thumbed images, he did not thumb their
tiling behaviour. Before a bank becomes a whole district's floor, measure the
property you are relying on.
