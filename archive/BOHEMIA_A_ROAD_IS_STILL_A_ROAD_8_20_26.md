# A ROAD IS STILL A ROAD AFTER IT DRAWS ITSELF (8/20/26, WORLD lane)

> Two of the four red gates the coordinator assigned to this lane on 8/19, closed. The third
> was already fixed by the other WORLD session. The fourth is theirs and is named below.

## HIS 348 SIGNAL SPRITES DREW ZERO TIMES, AT 274 REAL INTERSECTIONS

`gates/traffic_signal_gate.js` had been red for weeks with two failures nobody had
diagnosed. Measured on the running page across a 40×40 cell window:

| | |
|---|---|
| road-district cells (arterial 375, freeway 193) | **568** |
| cells where `m.road` is true | **0** |
| intersections found using `m.road` | **0** |
| intersections found using the district type | **274** |
| signal sprites drawn | **0** |

The sprites were never missing. `gates/traffic_signal_gate.js`'s own *"his sprites are
LOADED in the browser"* check had been **green the whole time**. They were loaded, correct,
and asked to draw at a set of intersections that had become empty.

## ONE FLAG WAS CARRYING TWO MEANINGS

`m.road` meant both of these at once:

- **IDENTITY** — this cell is a road. Born as `road:!!RD[d]`, straight off the road-district
  registry.
- **INSTRUCTION** — draw it with the parametric XSEC drawer.

Then **A ROAD WITH ITS OWN MODULE DRAWS ITSELF** (8/18–8/19). When a road is routed through
`__kitGrid` so it takes its tiles from its own generator, that branch correctly turns the
parametric drawer off with `m.road=false` — **and every road in the valley stopped being a
road as far as anything downstream could tell.**

`sigPass` is the victim, and its own comment says exactly why it trusted the flag:

> *"AN INTERSECTION IS A ROAD TILE THAT TURNS ... tileMeta already computes exactly those
> four booleans for the edge-matching law, so this reuses the city's own notion of the road
> network instead of inventing one."*

**That was right.** Reusing the world's own notion instead of re-deriving it is what this
repo asks for everywhere, and it is the opposite of the mistake. The notion was then quietly
repurposed underneath it.

This is `gypsum:7` again in a different system: one code meaning *"the crest of a bench"* AND
*"the shell of the dome"*, so the tile could be neither. **A flag that answers two questions
answers neither the day they diverge.**

## THE FIX IS ADDITIVE AND CHANGES NO ROAD PIXEL

1. `m.isRoad` is set once at construction, from the same registry `m.road` is born from, and
   **nothing ever clears it.** Identity gets its own flag.
2. `sigPass` asks `isRoad`, because it wants to know whether this is a road, not who drew it.

`m.road` keeps its instruction meaning exactly as the road lanes use it, so the parametric
drawer and the kit routing are untouched. **No road generator, cross-section or registry was
edited** — a consumer was asking the wrong question and now asks the right one.

Revert `sigPass` to the old flag and the gate goes straight back to **0 draws**. Confirmed.

## AND THE GATE WAS ASKING THE SAME WRONG QUESTION

Both of its failures came from **one** wrong question. Its probe scanned for an intersection
using `mm.road`, found none, therefore never moved the camera to one, and then correctly
reported that no signal was drawn. *"The world model finds intersections"* and *"a signal is
actually on screen"* looked like two independent problems and were one.

## I CHECKED HOW FAR THE COLLISION WENT, AND IT STOPPED HERE

Two other places ask `m.road` as an identity question — the dead-content legend resolution
in `deadForCell` and the pit sweep beside it. Their comment reads *"roads and bare ground
both come out of tileMeta with no plot grid"*, which **was** true before roads drew
themselves and is not any more. Measured rather than assumed: **40 of 40 sampled road cells
place dead content, 559 items, every one reporting `ok`.** They now fall through to the road's
own legend, which is if anything better than the synthetic flat one — bodies sit against the
road's real tiles. Nothing to fix, and saying so is the point: an unchecked consumer is
indistinguishable from a broken one.

## THE OTHER TWO REDS

- **DISTRICT FILL** — now **green**. The other WORLD session fixed the arterial and freeway
  emptiness it was failing on. Not mine, and closed.
- **ROAD CELLS** — still red on *"the arterial block wall blocks"*. That is the other WORLD
  session's active work (their 8/19 commit is literally about the wall down the west side of
  every street), and editing it while they are in it is a boundary crossing. **Named, not
  touched.**
- **VOTE TAB** — closed the same turn. 9 district heroes had art sitting in the bank and no
  way for him to reach it: resort, casino, convention, prison, dam, minigp, fort, strip,
  strip_x. The page had not been regenerated since those districts shipped. `21 passed, 0
  failed`, and they are in the VOTE tab whenever he feels like opening it.

---
**On the surface:** `tools/bohemia_city_signal_road_patch.py` · **Gate:**
`gates/traffic_signal_gate.js` (11 checks, mutation confirmed) + `gates/vote_tab_gate.js`
(21) · **In a tab:** RUN, and the picture is **HIS SIGNALS, BACK ON THE INTERSECTIONS** in
the LOOK tab.
