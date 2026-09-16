# FOLD CARRIES — THE HANDOFF COST NOTHING, AND NOW IT COSTS THE DARK (9/16/26, WORLD lane)

Board row `[fold carries]` / THE-FOLD-CARRIES-THE-WRONG-THINGS.
Ships: `engine/bohemia_heir.js`, `gates/fold_carries_gate.js` (26/0), the real
generation fold on the walked surface.

---

## 1. THE FOLD IS A JOINER AND NEVER READS ITS OWN TABLE

`bohemia_fold.js` carries a **CARRY table of thirteen rows** saying what crosses a
generation: standings decay, deeds decay, debt **dies**, and eight more marked
`ruled:false` all reading `carries: whole`.

**Read, not guessed.** `fold(ledger, memory)` takes both halves, reports which one it
is missing, and hands them through untouched. Driven with a full ledger, every field
comes out identical — **debt included**, and debt is a row the table itself marks
RULED and DIES.

That is not a bug in `fold()`. The ruled rows *are* executed, each by the system that
owns its field: `standing.inherit()` decays the standings, `owedFold()` takes the rent
book, and `[debt carried]` (9/12) made `bohemia_owing` clear the bill by asking the
fold's own table. Two ledgers, two owners, numbers between them.

**What was missing is an owner for the material rows.**

## 2. SO THE HEIR KEPT EVERYTHING, AND THE HANDOFF WAS A RENAME

Every acre, every building, every scrap of capacity crossed whole. The row names two
failure modes — *"an heir must arrive with a real leg up or the handoff reads as
deleting your character, and a clean heir nobody remembers is the other failure"* —
and the game was in **neither**. It was in a third nobody wrote down: **the handoff
cost nothing.**

The table says it itself, on the `builds` row:

> a hard ratchet today. Buildings turn over in decades and the century rule asks for
> visibly poorer, **which is arithmetically impossible while this only climbs.**

## 3. DYNASTY'S LIST RULES THE SHAPE, AND IT NEEDS NO NUMBER

`banks/BOHEMIA_THE_CARRY_LIST_DRAFT_9_5_26.txt`:

> **THE HOUSE** — but held, not owned forever, and it can be lost.
> **THE WALLS** — and they come down if nobody keeps them up.

A **rate** that survives would be a number nobody ruled. A **condition** is not, and
the game already publishes the most visible one there is: a circuit goes dark when the
rent on that ground went unpaid (`[held ground]`, 9/5), it stays dark, and it rides its
own save key.

**The heir keeps what is still lit and loses what went dark.** No rate, no roll, no
threshold — and it wires the generation fold to the rent you did or did not pay, which
is the whole argument of this lane's economy.

## 4. THE STREET IT FRONTS, NEVER ITS OWN CELL

Measured on the real map:

```
buildable desert cells ......... 620
with a circuit of their own ...... 0
fronting a circuit at distance 1  477
no wire near .................... 143   (unknown, and unknown is KEPT)
```

You build on sand and circuits are contiguous street runs, so **a plot never has a
wire of its own**. Asking the plot's own cell would have answered `null` 620 times out
of 620 and shipped correct and inert — the exact trap `[water lifted]` paid for, and
the gate now re-measures it every run.

## 5. ON THE WALKED SURFACE, THROUGH THE GAME'S OWN FOLD

Builds placed one per distinct live circuit, half the circuits doused, then `ctFold()`:

```
built ......................... 22
circuits doused ............... 11
after the fold: kept 11, lost 11, buildings 22 -> 11
  "11 of the things you put up are still standing, and they are yours now."
  "11 went dark and nobody kept them up. They are gone."
page errors .................... 0
```

**Both directions in one fold, on purpose.** A test that only shows buildings
disappearing is equally consistent with *demolish everything at the fold*, which would
be far worse than the bug it replaced.

## 6. TWO WIRING BUGS THE PROBE CAUGHT BEFORE ANY OF THAT

**A. The first cut walked `CE.spans()` and saw nothing.** `build()` writes into
`edits.cells`; `spans()` is only the big builds. Six buildings placed, `spans()`
returned 0. The probe reported a clean pass over an empty list — a negative result
that was a claim about my instrument.

**B. `demolish()` writes `'desert'` into the cell rather than deleting the key.** So
counting keys counts rubble as buildings, and the first honest-looking run said *lost
6* while the count stayed 6. Both now use CityEdit's own classifier: a build is a cell
whose district category is `sand`.

## 7. WHAT IT REFUSES TO TAKE

- Anything it **cannot judge** (no wire near) — losing a house because a lookup
  returned nothing is the worst possible direction to fail in.
- Anything at all if the ruling is asked and comes back `whole` and `ruled` — the gate
  flips that row and watches it stop, with nothing in the module to edit.
- `karma`, `virtues`, `family`, `wounds`, `economyCapacity`, `invest` — other lanes'
  fields, named in the module so the next reader sees the edge of the decision.

## 8. NOT MINE, NAMED

`tools/bohemia_faction_dossiers.py` crashes (exit 1) and DERIVED FRESHNESS is red for
it: *BLUES: "COPPER WORK SHIRT" is not in the canon wardrobe bank*. Verified it
crashes identically on this commit's parent, so it is a wardrobe-data problem and not
this round's.

The gate is red four ways: take everything → 5; take nothing → 5; say it and never
demolish → 3 (`31 -> 31`, rule 14(d) exactly); ask the plot's own cell again → 3.
