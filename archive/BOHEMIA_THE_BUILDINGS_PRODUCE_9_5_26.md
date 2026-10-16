# THE BUILDINGS PRODUCE — PRODUCTION-TICK, and the verb that existed for its own test
(9/5/26, LIFE + CITY lane. VAMILY job `[buildings produce] PRODUCTION-TICK`.)

## THE JOB NAMED THE DEFECT AND THE DEFECT WAS A GATE

The VAMILY line reads: *"on the wake beat, walk every placed building and call
produce(); today produce() has one caller and it is a gate."*

Measured before writing a line of code: `produce(purse, buildingId, day)` has sat
in `engine/bohemia_purse.js` since 7/31, and the only caller in the whole
repository was `gates/purse_gate.js`. **A verb that exists for its own test is not
a feature, it is a fixture.** Same shape as the seventeen invisible hats, the four
bright garments nobody wore, and the face maker with no door: the material existed
and never reached the player.

And the purse's own comment pointed straight at this line:

> PRODUCTION STAYS EMPTY AND IT IS NOT AN OVERSIGHT. Measured 9/5: `produce()` has
> ZERO callers anywhere in the engine or the walked surface, so there is no
> buildingId vocabulary to key on ... It fills the day something calls it and the
> ids are real.

## WHAT SHIPPED

`engine/bohemia_production.js` (new, LIFE + CITY):

- **`install(DISTRICT)`** fills `PURSE.PRODUCTION` from
  `BohemiaCityEdit.buildableTypes(DISTRICT)` — 59 types, which is *exactly* what
  the BUILD button can place. No list is typed beside it, so a district added to
  the canon enum is producible the same day. (The rule PRICES already lives under:
  read the things that exist, never type a second list next to them.)
- **`placed(edits)`** walks the delta — the plots the PLAYER put down, never the
  9,216 cells the generator drew. A 4-lot span is **one** building and is counted
  once, the same rule `demolish` already holds. A demolished lot is `desert`, and
  desert is not a building, which matters because demolish *writes* a cell rather
  than deleting one.
- **`tick(purse, edits, day)`** calls `PURSE.produce()` once per building and
  returns what was made **and** what was refused, so "made nothing because nothing
  is built" stays distinguishable from "made nothing because nobody ruled what
  this type produces".
- **Idempotent off the ledger, not off a flag.** A wake beat can fire twice for
  one day (a reload lands on the same day with the purse restored), so this asks
  the purse whether day N already carries a `produce:` entry. The ledger is the
  truth — that is the whole design of `bohemia_purse.js` — and a second record of
  the same fact is how two things that agree start disagreeing.

Wired on the walked surface (`slices/BOHEMIA_CITY_WORLD.html`) at
`__THE_BUILDINGS_PRODUCE__`: `DAY.on('wake', produceOvernight)` — the day loop's
**own** hook, so it fires wherever the day turns over and nowhere else, never a
second timer beside it. Registered after the boot's own `DAY.wake()` on purpose:
a restored save must not be paid again for a day it already lived.

And **he can see it.** The morning card carries one sentence, `draft:true`:

> *Your one building put one thing by the door overnight.*

It sits above the phone offer, because it is what his city did while he slept, and
it is **absent entirely** on a morning with nothing built — the honest empty state,
not a zero. A number that moves in a ledger nobody renders is the same defect one
layer up.

## WHAT A BUILDING MAKES, AND WHICH HALF OF THAT IS HIS

`laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md`, LOCKED, clause 3:
**"BUILDINGS: house people or produce one of the three. That's the economy."** His
words in the same ruling lead with the default and offer the other two as
exceptions: *"buildings produce resources which the logo is displayed as like an
apple, duct tape ... then there's electricity ... or a building can produce
clout."*

So the default row is **resources**, the amount is his 8/15 **EVERYTHING COSTS
ONE**, and every row carries the ruling behind it with `tuned:false`.
**[PENDING Paolo: which building types produce electricity or clout instead.]**
`install()` never overwrites a row that already exists, so the day he names one it
wins and nothing else changes.

**DELIBERATELY NOT ELECTRICITY, and it is worth saying out loud because it is the
tempting answer.** Batteries are the money (9/4) and the market prices in them, so
making every placed building mint electricity would turn the BUILD button into a
printing press — the faucet-with-no-drain failure the purse's own header exists to
measure. **Making money is a design act, not a wiring job**, and it is not on this
line. Gate leg A8 is the guard so it cannot arrive by accident later.

## THE GATE, AND WHY ITS SHAPE IS THE POINT

`gates/production_tick_gate.js`, **14 pass / 0 fail**.

The job's own defect was that the only caller was a gate. A gate that calls
`tick()` from node and finds the balance moved would recreate that exactly, so the
whole B section **refuses to call tick()**: it boots the real walked surface on a
phone profile, taps GET UP, taps CITY, hunts a desert plot, presses the real BUILD
button, SLEEPs, takes the reckoning, and only then reads the purse. The claim is
that **the game** called produce — which a node-side `tick()` can never make.

    MEASURED: 59 buildable types -> 59 rows
              one plot placed by thumb, resources 0 -> 1 across the night
              __PRODUCED = 1, and the morning card says it

Mutation-tested three ways, all red where they should be:

| mutation | legs that went red |
|---|---|
| delete the `DAY.on('wake', ...)` hook | B3, B4, B5 |
| delete the already-produced guard | A6 (day 1 paid twice) |
| stop emitting spans from `placed()` | A4 (2 buildings -> 1) |

## WHERE THIS STOPS, MEASURED AND NOT ABSORBED

**The demo carries the code and cannot run it, for two reasons that are both other
lines' work.** `CT_DEMO_DAYS = 1`, so `ctDemoOver(1)` ends the demo at the
reckoning and **day two never comes** — there is no second wake beat in the demo at
all. And the demo cut hides the builder drawer, so nothing is placed there to
produce. Both are the shape of the demo, not a hole in this job:
`[builder reachable] BUILDER-WHERE-HE-WALKS` is the line that owns the second one.
Failing this job's gate on either would mean one job's red is another job's work,
which is how a red stops meaning anything.

## TWO REDS ON MAIN THAT ARE NOT MINE (verified by stashing and re-running)

1. `dayloop_gate` **57/2** — "and its brief is the quest's own @LOG line", "and
   quotes the quest, not me". Red before this change. QUESTS is PARKED.
2. `demo_day_gate` **23/1** — "and the money really left the purse (500 -> 500)".
   Red before this change, and the diagnosis is a **broken ruler, not broken
   code**: the leg's own fixture credits `resources` and reads `resources`
   (`gates/demo_day_gate.js` ~line 222), while WORLD's 9/5 `[battery money]` ship
   correctly moved buying to `electricity`. The sale itself passes on the leg
   above it (`bought >= 1`). It belongs to WORLD's gate, not to this lane.

## THE STANDING NOTE

`produce()` waited five weeks for a caller while its own table waited on the
caller for its ids — each half correctly believing the other was missing. That is
the same collision the 8/11 / 8/15 payout ruling had, one layer down.
**WHEN A TABLE IS EMPTY "BECAUSE NOTHING READS IT" AND A VERB IS DEAD "BECAUSE
NOTHING FILLS IT", THEY ARE ONE JOB AND NEITHER LANE CAN SEE IT ALONE.**
