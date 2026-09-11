# BATTERIES MINED (9/11/26, WORLD lane) — board row BUILDINGS-MAKE-BATTERIES

Ship: `engine/bohemia_powerbuild.js` (new), the walked surface, and
`gates/batteries_mined_gate.js` (36 checks, registered as **BATTERIES MINED**).
Tab: **CITY**, on the nightfall card. Also in the demo.

---

## HIS RULING, 9/5, LOCKED

> "there could be ways where you auto-mine batteries, set up certain buildings
> wherever you're doing and that's just more batteries."

and, on what money is for:

> "do you need batteries to turn a laptop on? no"

**Nobody sells currency. Batteries are MADE, by buildings you put down.**

## THIS CLOSES A PENDING THE PIPE ITSELF NAMED

`engine/bohemia_production.js` (9/5, LIFE+CITY) wired every placed building to pay
on the wake beat, and wrote two things in its own header:

> "WHICH buildings make electricity or clout INSTEAD is canon nobody has ruled and
> this file does not guess it: install() never overwrites a row that is already
> there, so the moment he names one it wins and nothing else changes.
> **[PENDING Paolo: which building types produce electricity or clout.]**"

> "**DELIBERATELY NOT ELECTRICITY** … making every placed building mint electricity
> would turn the build button into a printing press."

**Both were right, and the second one still is.** He did not rule that every
building mints batteries. He ruled that **certain** buildings do. So three do and
fifty-six do not — which is exactly the door that module wrote, used the way it was
written to be used. A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1): the caution was
correct on the morning it was written and is answered by the ruling made the same day.

## WHICH BUILDINGS, AND WHY IT IS NOT A LIST I MADE UP

His words name the kind of thing: *"a generator, a solar rack, a wind rig; real
things that make electricity in a desert."* MAP LAW says Claude never designs map
layouts, so no district is invented here. These are the three electrical districts
**his own overmap enum already has** and the BUILD button can already place, and the
map's own comments say what each is for — quoted verbatim, and the gate checks the
quotes still resolve:

| district | role | the map's own line |
|---|---|---|
| `solar` | generates | *the solar field* — his "solar rack" |
| `battery` | stores | *"solar without storage dies every night"* |
| `substation` | distributes | *"solar -> city distribution nodes"* |

**Make it, hold it, move it.** That is the whole chain a desert grid needs, and the
map already draws all three.

**Measured and written down rather than glossed: two of his three examples have no
district.** There is no `generator` and no `wind` among the enum's 79 kinds. Adding
either is map content, which is his and DIRECTION's, not this lane's. So this ships
the three that exist and names the gap in data (`NO_DISTRICT_YET`) rather than
quietly inventing two districts to match a sentence.

## WHAT EACH YIELDS

One battery a day. 8/15 LOCKED: *"just make everything cost one."* 9/4 LOCKED: the
one is denominated in a battery. The amount is not passed in and cannot be — a
caller that could pass 2 would be a place for a number nobody ruled to enter the
game. Every row is tagged `tuned:false, draft:true` and carries the ruling.

Result on the real table: **3 types on electricity, 56 still on resources.**

## THE INSTALL ORDER IS LOAD-BEARING

`BohemiaProduction.install()` fills every buildable type with the default resources
row and never overwrites a row that is already there. So this must install **first**.
Run the other way round, every row already exists and this call does nothing at all
— **a silent no-op that looks exactly like a working feature**.

Proved both ways, in node and on the walked surface. Swapping the two lines on the
real surface turns the gate red six ways, and the card falls back to its old
sentence — which is precisely what a silent no-op looks like from the player's seat.

## THE 9/6 CAP AMENDMENT IS ALREADY THE ARCHITECTURE

The coordinator asked that what a building earns while the player is away be capped,
so coming back is worth something instead of collecting a timer.

**Measured: there is nothing to cap.** The production tick is keyed on the day and
refuses a day it has already paid, and this game owns no wall clock at all (NO
BACKGROUND TICKING, his pacing ruling). Ten in-game days pass and exactly one day is
paid — electricity 2 → 4, not 2 → 20, measured in node and again on the walked
surface. Nothing was added; the gate now holds it so it cannot regress.

## BATTERIES ARE MONEY ONLY

His clause: *"do you need batteries to turn a laptop on? no."* Being broke must stop
you **buying**, never **doing**. Checked on the real surface with an emptied purse:
the work offer is still there, a day's work still runs and still pays, and the day
still ends normally. The one thing that refuses when you are broke is the BUILD
button — and that is buying a building, which is what money is for.

## WHAT HE READS

On the nightfall card, in the **CITY** tab:

```
Your 2 buildings put 2 things by the door overnight. One of them made you a battery.
```

Batteries get said out loud, because "things by the door" is the one phrasing that
can hide income inside scenery, and he should be able to see where his money came
from. Only when there are any; a day with none says exactly what it said before.

## TWO THINGS MEASURING CAUGHT

**1. A SILENT CATCH AROUND A REAL ERROR.** Mutation-testing this file, `install()`
threw when `kinds()` and `POWER` disagreed — and the walked surface calls it inside
a `try/catch`, so the whole table would have gone uninstalled and every building
would quietly have fallen back to resources. A silent catch around a real error is a
bug that looks exactly like a feature not being there. It skips an unknown kind now.

**2. THE REGISTRY CHECKER COULD NOT SEE MY OWN GATE, AND A DUPLICATE GOT WIRED.**
`A DAY'S WORK` (shipped 9/7) had to be **double**-quoted in the registry because its
name contains an apostrophe. `gates/gate_registry_gate.js` scans rows with
`/^ {4}\('([^']+)',/` — **single quote only** — so it never saw that row, reported
the gate it runs as an orphan, and a second row was wired for the same file. That
37-check browser gate was running **twice every suite**.

Measured: **581 rows visible to the checker, 1 invisible, and it was mine.** Renamed
to `A DAYS WORK` so no apostrophe is needed, and the duplicate row removed. One row,
visible to everyone, runs once. 581 rows, 0 invisible, GATE REGISTRY 6/0.

**Hardening the regex so a future apostrophe cannot do this again is PLUMBER's**,
whose file it is — routed in the handoff, not edited here. *A checker that cannot
see a row is the broken one* (8/1), and the duplicate was a symptom, not the fix.

## PROOF

- `node gates/batteries_mined_gate.js` → **36 passed, 0 failed**, registered
- red both ways: swap the install order on the real surface → **6 red**; let every
  building mint → **10 red**
- neighbours green: PARTIES MOVE 39/0, A DAYS WORK 37/0, VALLEY RUNS OUT 25/0,
  PURSE 28/0, PAYDAY 38/0, PRODUCTION TICK 14/0, BUILD COSTS ITS PRICE 14/0,
  PLACEHOLDER NUMBER 14/0, ATTEMPT 15/0, DEMO BUILD 25/0, PAGES PUBLISH 18/0,
  GATE REGISTRY 6/0

Build stamp: **BUILD 9/11c - BUILDINGS MAKE BATTERIES**
