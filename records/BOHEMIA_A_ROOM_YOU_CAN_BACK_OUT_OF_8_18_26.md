# A ROOM YOU CANNOT BACK OUT OF HAS NO FIGHT IN IT (8/18/26, WORLD lane)

> **His synthesis, quoted in `laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md` §6:**
> *"if your combat loop requires retreat, your level generator has a **hard obligation**
> to guarantee retreat is possible... combat design and map generation are the same
> system wearing two hats. **A cramped room deletes the entire core verb.**"*

§6 routes that obligation to **WORLD**. Nothing in the repo was checking it, and this is
the kind of obligation that never announces itself breaking: every room generates, every
existing gate stays green, and the fight is quietly worse in every building in the game
for a reason nobody can point at.

## WHAT RETREAT MEANS IN A GUN GAME

§3 **C4** of the same law does the translation and it is the whole basis of the measure.
RF4's retreat works because most enemies must **close** to hurt you, so distance is
safety. **With guns on both sides, distance is not safety — line of sight is.** Running
twelve tiles down an open hall is a longer shot, not an escape.

So the question asked from every single floor cell is the gun-native one:

> **From where I am standing, can I reach somewhere they cannot see me?**

Binary. No radius, no invented threshold. Either a place to hide exists or it does not.

## THE LADDER — nine zones × six seeds at each footprint

| footprint | plans | plans with a stranded cell | stranded cells | avg rooms | worst retreat |
|---|---|---|---|---|---|
| 6×6 | 54 | **54** | 864 / 918 | 1.0 | 3 |
| 8×8 | 54 | **54** | 1890 / 1998 | 1.0 | 4 |
| 10×10 | 54 | **54** | 3294 / 3510 | 1.0 | 5 |
| 12×10 | 54 | 36 | 2664 / 4251 | 1.3 | 10 |
| 16×14 | 54 | 6 | 918 / 8133 | 3.6 | 14 |
| **20×16** | 54 | **0** | **0** / 11862 | 5.2 | 17 |
| 24×18 | 54 | 0 | 0 / 16523 | 6.3 | 22 |
| 10×30 | 54 | 0 | 0 / 11082 | 3.9 | 21 |
| 40×28 | 54 | 0 | 0 / 44738 | 16.9 | 24 |

**It is a clean break, not a smear.** At 20×16 (320 tiles) and above, every cell of every
plan in every zone can get out of sight. Below it, 32.2% of all floor has nowhere to hide,
and it is a **grammar** result rather than a seed accident — every plate at 10×10 or under
comes out as exactly one room, so no amount of re-rolling changes anything.

## THE FIX FOR A BOX IS NOT MORE WALLS

A 6×6 plate is **4.5 m square**. A shed. Partitioning a shed so a gate goes green would be
inventing architecture that does not exist in order to win a number, and **REALISM FIRST**
forbids that. Cover in a room that size comes from what is **in** it — a counter, shelving,
a pallet stack, a vehicle, a stack of crates.

That is `meta.pending: "furniture per role"`, which has been sitting in
`engine/bohemia_floorplan.js` as a TODO string since July. **It is now a combat requirement
with a number attached: it is worth 9,630 stranded floor cells.** One pillar dropped into a
9×9 test box takes it from *zero* cells with a retreat to *all eighty*, so the amount of
geometry needed is genuinely small — it just has to be the right kind of geometry.

## THE ONE PLACE HIS PRESCRIPTION AND REALITY PULL APART

His words are "loops, corners and pillars, **never boxes**." Measured on the door graph at
24×18: of 48 plans with four or more rooms, **23 are strictly tree-shaped** — you can leave
a room only the way you came in, so a leaf room can always be cornered.

That is real. It is also what **real commercial floorplans look like**: rooms hang off a
corridor, and a circulation ring only appears in large buildings. So this is reported and
not asserted. The **hard** obligation in his law is the other one — *retreat is possible* —
and that one holds absolutely above the break point. Forcing every plan to loop would be
sacrificing realism to a prescription rather than to fun, **and that trade is his.** The
number is here so he can make it by looking rather than by being asked.

## AN ASSERTION I WROTE AND THEN CAUGHT

The first version of the loop check counted cycles on the **cell** grid and passed 54 of
54. It could not have done anything else: any floor wider than one tile is a mesh, so the
cell-graph cycle count is huge and positive **even in a strictly tree-shaped building**. A
measurement that cannot fail is not a measurement, and its green was worth nothing. The
room graph is derived from **doors** now, and it detects a tree — the warehouse zone at
24×18 comes back with two rooms, one door and zero loops, exactly as it should.

The same session made the same class of mistake once already, in the other direction: the
first version of the measure invented a cell field the generator does not have and reported
**nine zones at zero cells** — a clean sweep of total failure, stated with complete
confidence, entirely the reader's fault. *A reader that does not match the writer measures
nothing and says so in the language of a result.*

---
**Measure:** `engine/bohemia_retreat.js` · **Gate:** `gates/retreat_gate.js` (18 checks,
mutation-confirmed) · **Law:** `laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md` §3 C4, §6
