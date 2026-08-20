# THE ONLY LIVING THING ON THE MOUNTAIN

**8/20/26 — WORLD lane. The mountain module's legend describes a desert shrub as "the
only living thing on the mountain". Across 60 real cells of the seed valley there were
zero of them. 927 cells, a tenth of Bohemia, and the one green thing in it had never
existed.**

---

## THE BRANCH THAT COULD NOT BE REACHED

```js
if (low < 0.24 && wet > 0.45) g[y][x] = 5;                              // dry watercourse
else if (wet > 0.72 && hash2(...) < 0.35) g[y][x] = 6;                  // shrub
```

A tile could only become shrub if it was wet enough to be a watercourse **and then
wasn't one**. Almost everything passing `wet > 0.72` also passes `wet > 0.45`, so the
line above took it. Measured across 60 real mountain cells:

```
ravine floor    4,009 tiles   in 17/60 cells
dry drainage    4,406 tiles   in 15/60 cells
desert shrub        0 tiles   in  0/60 cells
```

Not rare. Structurally starved.

## AND THE PLACEMENT WAS BACKWARDS ANYWAY

This is why it was not a threshold nudge. The module's own header says *"vegetation
exists only in the drainages, where the runoff goes"* — and then the code planted shrubs
on ravine floor that specifically **was not** drainage.

A Mojave desert dry wash is where the vegetation is. It is the one place on a bare
limestone range that gets water. The standard description of the community is that it
*"typically occurs along the **banks**, but may occur within the channel"*, and is
*"sparse and patchy"* — catclaw acacia, cheesebush, desert willow. Drought-hardy natives
that outlive anyone watering them, which is exactly why they are **alive** in act 1 when
every planted palm in the valley is dead.

So the pass now walks the channel and plants its banks, patchy, thinner in the bed than
beside it because a flood scours the channel. Collected first and applied after —
growing a shrub onto a tile and then reading that tile as a bank for the next one grows
a thicket up the hillside.

```
60 real mountain cells:  363 shrub tiles, in 14/60 cells      (was 0 in 0)
```

Fifteen of those sixty cells have a wash. Shrubs now appear in fourteen of them: only
where the water is, which is the whole point.

## AND THE STRIP HAD NO DRAINS

Same shape, found by the same gate. The only storm-inlet code on Las Vegas Boulevard
fired at junction corners only, on one exact tile per corner that had to already be
curb — so across all 81 cells the flood system had **zero** inlets in it. This valley
floods hard enough that Clark County built the regional flood-control district half the
basins in this game belong to. A boulevard with no inlet on it has never seen a monsoon.

Inlets now run the corridor at the ~90–120 m a real curb inlet is spaced at: **412
tiles, 1.7 inlets per cell, in 76 of 81 cells.**

## THE FOURTH CORRECTION TO THE GATE, AND THE LAST STRUCTURAL ONE

`legend_kept_gate.js` has now been wrong about its own answer **four times in two
days**, every single time because of its inputs rather than its logic. Yesterday's three
are recorded in `BOHEMIA_THE_BOULEVARD_WITH_NO_INTERSECTIONS_8_20_26.md`. Today's:

**It grouped by the registry, and the valley is not the registry.** `gated` and `estate`
are real districts on 49 cells of the seed valley, and neither is a registered kit type
— the world routes both through the suburb module with `opts.district`. Building the
families by walking `K.types()` therefore computed those 49 cells' tiles and **dropped
them on the floor**, and the gate reported that the suburb family declares a `gate` and
never builds one.

All 49 build one. What it had actually found was **GATED IS RICH working exactly as
Paolo ruled it on 8/1**: a plain `suburb` is walled and never gated, and the gate lives
on the communities rich enough to have bought one. The gate was reporting a law being
obeyed as a defect.

The unit is now the legend object **the plot itself carries**. Every legend the world
really uses is judged against what the world really built with it, and a district that
exists without being registered cannot fall through the gap. That is the same correction
as the other three, one level further down, and it is the one that makes the shape right
rather than patched: **stop asking a model of the world, ask the world.**

Registry figure: 33 → **31 across 20 families**.

## THE LESSON

Four wrong answers, one cause, and it was never the checking logic. **The hard part of a
gate is not what it asserts, it is what it asserts it against.** Every version of this
one was reasonable-looking code that produced confident, specific, wrong findings —
wrong enough to ship a false claim about the mountain to main and then a false claim
about the suburb on top of it.

What kept it honest was not care. It was the check that runs the ratchet **backwards**:
*every code still named in DEBT must still really be unplaced*. A one-directional
ratchet would have let all four ship silently, because all four were failures of
over-reporting, and over-reporting never trips a floor.
