# THE TERRITORY LEDGER
FACTIONS lane · [territory ledger] round one · 9/24/26

## THE ONE LINE
**Until this round no block in this valley could ever change owner.** Now one can, and it is
remembered, per act, which is the thing rule 31's derive has nothing to read without.

Nothing went to the demo or the alpha's play tabs. Rule 18(b) holds.

## THE ROW, AND THE HARDER SENTENCE UNDER IT
The row (coordinator 9/24, from WORLD caaaa26) says turfGrid() is keyed on seed and map size
and nothing else, the save never mentions turf, and what the player took is written nowhere.

All three verified:

| claim | measured |
|---|---|
| `turfGrid()` keyed on seed + size only | **true** — two builds of the same valley agree on all 9,216 cells |
| the save never mentions turf | **true** — zero hits in `engine/bohemia_save.js` |
| `HOLDS`, the towns module's only override | **empty**, and its own comment says "empty, and it stays empty" |

> **So it is not only that what the player took is written nowhere. NOTHING IN THIS GAME CAN
> CHANGE WHO HOLDS A BLOCK.** There is no taking mechanic at all, so a ledger built today
> records zero rows.

That is why this ships as the **place for it to be said and nothing else**. It decides
nothing about who may take ground, what it costs, or how. Those are rulings and they are his
(MECHANISM-MINE / CONTENTS-PAOLO'S).

## WHAT SHIPPED
`engine/bohemia_turfledger.js` and `gates/turf_ledger_gate.js`, registered in the suite as
**TURF LEDGER**.

**The shape is TAKEN, not invented.** `bohemia_century.js` already keeps a ledger —
`{V, act, entries[]}`, `clampAct`, a `setAct` that refuses to run backwards, an entry
stamped with its act, day and sequence — and this is that same shape one module over, for
the reason the century itself gives: four systems, one idea of a record.

- `took(rec, {x,y,from,to,day,why})` — one entry per change. **A change that changes nothing
  is refused**, or the ledger fills with rows saying the Mob still hold Mob ground.
- `heldBy(rec,x,y,act)` — null means *ask the derived grid*, not *nobody holds it*.
- `holderThrough(rec, grid, x, y, act)` — the read-through.
- `changedIn` / `netFor` — what rule 31's derive reads.
- `toJSON` / `load` — the save half, which is what WORLD found missing in the treasuries.

**`from` is handed in and never looked up**, for the century's own stated reason: the
derived ground underneath can move, and a ledger that recomputes its own history is not a
memory.

**An older save is a playable save.** A blob written before this file loads as act 1 with
zero entries. That is rule 32(b) rather than a convenience: act 1 is the floor, so ground
that predates the count was always the seed's.

## THE CHECK THIS EXISTS FOR
**THE EMPTY LEDGER IS A NO-OP**, held against the real derived valley, all 9,216 cells, not
against a stub. Wiring the read-through in changes nothing whatsoever until somebody takes
ground. And one entry moves **exactly one cell** and not the valley.

## A REAL BUG, CAUGHT BY MY OWN GATE
`netFor` used each cell's **newest** `from`. A cell that goes Mob → Reds → Blues has a newest
`from` of Reds, and **Reds is a middleman**: they held it a while and ended with nothing.
Netting off that credits Reds a cell they do not have and leaves the Mob short one they
really lost. Measured: `{Blues:1, Reds:0, Mob:-1}` where the truth against the ground is
`{Mob:-2, Reds:1, Blues:1}`.

`changedIn` now keeps the **oldest** `from` and the **newest** `to`. A cell handed back to
whoever started with it is not reported as changed, though the record still holds every
entry, because the history happened.

## AND A GATE THAT PASSED ITS OWN MUTATION
Six mutations, five went red. The sixth — **give the taker's tier to the ground** — stayed
green, because the tier check tested cell 48,48, which is **fortress** ground, against a
mutation that hardcoded `'fortress'`. **It agreed with its own bug by coincidence of the cell
I picked.** The check now asserts on every tier the valley actually carries, and the mutation
goes red.

## WHAT IT LOOKS LIKE ON THE REAL SURFACE
Rule 32(f): a vote item is a frame off a play surface. So the cook photographs the running
alpha before and after one entry, with the wiring injected in the driver and **not shipped**.

**The block one step west of his door went Mob → Volunteers.** The tier stayed fortress —
the ground's, not the taker's, because what a place charges is a fact about the place. His
own block untouched. Net: Volunteers +1, Mob −1.

**And you cannot see it.** The street said nothing.

## WHY NOT, MEASURED
Instrumented `turfAt` and counted the calls during a real redraw:

| surface | calls to turfAt |
|---|---|
| street, standing still | 2–3 per ~1.4 s |
| **city view** | **0** |

The street's two or three are asking about the one cell he stands on, not the ground around
him. And **the screen where you would look at a map of who owns what never asks who owns
anything** — which is the mechanism under last round's observation that the valley is blank
sand from above.

> **THE MEMORY CAN EXIST AND STILL BE INVISIBLE. A ledger under a surface that never asks is
> a diary nobody opens.**

That is the second half this row owes and it is handed over with numbers rather than guessed
at: it belongs to whoever draws the city view.

## WHAT IS NOT WIRED, AND WHY, SAID PLAINLY
The read-through is **not** in the walked city. Wiring it means touching
`slices/BOHEMIA_CITY_WORLD.html`, which is the play surface, and **rule 18(b) holds**. It is
two lines in two carriers (the engine copy and the slice, together, ENGINE SYNC LAW), and the
gate already proves it is a no-op on an empty ledger, so it can land the round the hold lifts
or the round DYNASTY's derive asks for it. Finding a legal way to ship it into the play file
this round would be the violation, not the work.

## RULE 18 AND RULE 22, OBSERVED
No demo cut, no build stamp, no game file touched.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
**A gate can pass its own mutation by coincidence of the case you chose.** The tier check was
correct code, correctly reasoned, and completely blind, because I tested fortress ground for
"keeps its tier" against a bug that hardcoded fortress. **Pick the case that can tell the two
apart, or the check is decoration.**
