> **RESOLVED 8/22.** The diagnosis this record asks for was done and the wiring shipped:
> **82.6% -> 93.1% reachable on foot, "drawn by its own module" unmoved at 99.9%.** The
> three measurements below were all one scope error, not three trade-offs — see
> `records/BOHEMIA_ONE_SCOPE_ERROR_WEARING_THREE_FACES_8_22_26.md`. Kept as written
> because the reasoning that stopped the fourth attempt is the part worth keeping.

# THE RELAY IS ON THE PAGE NOW. IT IS NOT WIRED, AND I STOPPED.

**8/21/26 — WORLD lane. The algorithm that walks a sealed district out to a street now
lives where the walked surface can reach it, and world.js and the page share one copy of
it. The last mile — making the page actually ask — I attempted three times, measured
three times, and did not ship, because every version traded one invariant for another.**

---

## WHAT SHIPPED

Yesterday's finding: 357 stranded pockets, 541 cells that never touch a street, 257 of
them suburb. The relay that fixes exactly this has existed in `bohemia_world.js` since
7/21 — and **the page does not carry world.js.** The proof was that fixing the relay
moved walked-surface reachability by *zero cells*.

So the relay moved to `engine/bohemia_overmap.js`, which the page *does* inline:

- `landlockConnect(m, opts)` is there, taking `isBuilt` and `familyOf` as arguments
  rather than defaulting them — the caller's vocabulary is the caller's, and a default
  here would be a second definition waiting to drift from the first.
- `bohemia_world.js` **deletes its copy** and calls it. One canonical body, ENGINE SYNC
  LAW. Verified behaviour-identical: 2,437 relay entries before and after, and
  `landlocked_gate` 16/0.
- The page is resynced, so `landlockConnect` and `WALKABLE_ROAD` are now *in* the walked
  surface, unused, waiting for a call site.

`tools/bohemia_city_landlock_relay_patch.py` is the wiring tool, written and parked. It
is idempotent, refuses rather than guesses if the page has changed shape, and re-emits
no region (the 8/21 rule).

## WHAT I DID NOT SHIP, AND THE THREE MEASUREMENTS

The page computes a cell's streets as "which of my neighbours is a road", and when the
answer is none it falls back to `['S']` — a gate punched south whether or not south
leads anywhere. That fallback *is* the pocket. `world.js` handles this by merging the
relay's edges into the same `streets` list, so I did the same:

| attempt | reachable | drawn by own module | verdict |
|---|---|---|---|
| baseline | 82.6% | **99.9%** | — |
| 1. merge into both call sites | **0%** (1 cell) | 86.8% | catastrophic |
| 2. kit call site only | 86.0% | 86.8% | +3.4 reach, −1,200 cells |
| 3. only when the cell has no street of its own | 84.5% | 94.1% | +1.9 reach, −547 cells |

Every version buys reachability with cells that stop being drawn by their own module.
Attempt 3 is the most principled — it cannot touch a cell that already fronts a street —
and it still loses 547.

**I do not understand why yet, and that is the whole reason this is not shipped.** The
merge is byte-for-byte the mechanism `world.js` uses and has used since 7/21. Something
about the page's call differs — the suburb path works in *group* coordinates while the
relay is keyed by *cell*, which is one candidate and not a proven one.

Attempt 1 collapsing to a single reachable cell with **no page error** is the thread to
pull: nothing threw, so 9,215 cells became unreachable by generating *differently*, not
by failing. That is a layout-seam problem, not a crash, and it says the relay edge is
changing something about how a plot meets its neighbour.

## WHY I STOPPED INSTEAD OF TRYING A FOURTH

STOP PRODUCING, 7/26: *"writing a fourth version of anything means you already failed —
stop and say so instead of fixing the attempt."*

Three attempts, three measurements, no convergence. A fourth guess shipped against a red
gate, trading a 99.9% invariant for a few points of reachability, would be the exact
thing this session has spent a week documenting: a change that looks like progress on one
number while quietly costing another.

The valley is reverted to baseline and green: **82.6% reachable, 99.9% drawn by its own
module, walked surface 10/0.**

## WHAT THE NEXT SESSION SHOULD DO, CONCRETELY

The enabling work is done — the relay is on the page and one line from being called.
What is left is a *diagnosis*, not a design:

1. Take one landlocked suburb cell. Generate it on the page with `['S']` and with its
   relay edge. **Diff the two grids.** The answer is in there.
2. Check the group-vs-cell coordinate question in `__subBlock(gx,gy)`: `GRP` is the
   residential group size, so `relayEdges(gx*GRP, gy*GRP)` asks about the group's
   top-left cell, which is not the same question as "which edge does this group open".
3. Confirm whether "drawn by its own module" is measuring *failure* or merely *change*.
   If a relayed cell renders correctly but no longer matches its type signature, the
   gate is the thing to fix — and that would be the sixth ruler this week, so it is
   worth checking before assuming the generator is at fault.

The measurements above are the starting point; none of them need to be re-taken.
