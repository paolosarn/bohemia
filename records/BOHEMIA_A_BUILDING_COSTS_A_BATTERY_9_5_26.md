# A BUILDING COSTS A BATTERY — BUILD-COSTS-ITS-PRICE, and the faucet I shipped a round early
(9/5/26, LIFE + CITY lane. VAMILY job `[building costs] BUILD-COSTS-ITS-PRICE`.)

## THE HONEST VERSION OF WHY THIS WAS URGENT

The round before this one shipped `[buildings produce]`: every placed building pays
out on the wake beat. Measured against a build path that touched the purse **zero**
times, that made the BUILD button a **pure faucet** — place a plot, get paid every
morning, forever, for nothing.

A faucet with no drain is the inflation failure `engine/bohemia_purse.js` was written
to measure. Its own header names it, quoting the live-ops literature: faucets are
effectively infinite, so an economy inflates until currency is meaningless, and you
cannot fix what you cannot measure. **I built half of that in this lane's name and the
board had the other half sitting right underneath it as the next OPEN line.** The
queue was already right; the danger was only ever that a round ended between the two.

## WHAT SHIPPED

`engine/bohemia_production.js` grows a second half — the same module now holds what a
building **makes** and what it **costs**, deliberately in one file, because the faucet
and the drain are one economy and putting them in two places is exactly how one of
them gets forgotten.

- **`installCost(DISTRICT)`** builds a COST row for every type the BUILD button can
  place — 59, read off `buildableTypes` so neither list can drift from the other, the
  same rule the yield table lives under.
- **`canAfford(purse, type)`** answers *before* the tap, so the panel can put the price
  on the plot rather than only the refusal after it.
- **`charge(purse, type, day, ref)`** debits through the purse's own `debit()`, so it
  lands as a **HARD SINK** — value destroyed, not moved. A transfer would look
  identical in the balance and be wrong in the measurement, which is the entire reason
  the purse is a ledger and not three counters.

## THE PRICE IS HIS, TWICE OVER

> **8/15, LOCKED:** "just make everything cost one."
> **9/4, LOCKED:** "i dont want there to be money money maybe electronics like
> batteries are the currency."

**A building costs one battery**, out of the same pocket the shop already charges
(payday's `SALVAGE_CURRENCY`, moved to electricity on 9/5). Gate leg A5 fails if the
build till and the shop till ever name different money — the 9/5 market bug, one layer
up: *a shop whose tag and till name different money is worse than one with no prices
at all.*

**One building, one battery — not one per lot.** A 2x2 spans four lots and is still one
building, the same unit `demolish` and `produce()` already count.
**[PENDING Paolo: whether a 2x2 building should cost more than a 1x1.]** Per-lot
pricing would make a stadium cost four while producing one, which is a balance decision
with a real design consequence, and balance is his.

**No refund on demolish.** Nobody ruled what knocking a building down gives back, and
the honest answer to a question nobody asked is silence, not 50%.

**A separate table from `PURSE.PRICES`, deliberately.** The job's brief says "debits
PRICES", and the debit does go through the purse's own verb into the same ledger — but
the rows live in this lane's module, because `PRICES` is keyed on GOODS (water, food,
meds) and mixing two vocabularies in one table is how a list that reads it starts
getting 59 districts it never asked for. One table, one vocabulary.

## THE ORDER, WHICH IS THE WHOLE CORRECTNESS ARGUMENT

**CHECK → BUILD → CHARGE.**

Charging first and unwinding on a refused build would leave a debit *and* a refund in
the ledger for a building that never existed, and the ledger is what a save is read
back from. Checking first means the debit's only failure mode (not enough money) has
already been ruled out, so a plot that went down can never end up free. Both ends are
legs: A6 (a refused build charges nothing) and A7 (a build that lands charges exactly
one, once).

## WHAT HE SEES

    empty desert, broke   : "that costs one battery and you have none. Finish a job and come back."
    empty desert, funded  : "costs one battery · you have one"

The price is on the plot **before** he taps. A refusal you only meet by tapping is a
bug report; a price you can read first is a decision.

**AND THE FIRST CUT SAID IT TWICE.** The refusal was appended as a second note under
the standing price line, so the panel carried the price in two different sentences —
the shelf's own 9/5 lesson (*the tag and the till must not be two voices*) repeated
inside a single panel. The refusal now overwrites the line that was already there. It
was caught in a phone screenshot before it shipped, which is the only reason it did not.

## THE GATE

`gates/build_costs_its_price_gate.js`, **14 pass / 0 fail**.

    MEASURED ON THE WALKED SURFACE (390x844, real touch):
      the tag on the plot : "costs one battery · you have none, so not yet"
      broke               : 0 -> 0 edits, refused in words
      one battery in hand : edits 0 -> 1, batteries 1 -> 0

Mutation-tested three ways:

| mutation | legs that went red |
|---|---|
| remove the charge from the build path | B4, B5 |
| remove the affordability check | B3, B4, B5 |
| make the charge a transfer instead of a drain | A8 |

The leg worth pointing at is **A9**: a building can never pay its own price back,
because it costs **batteries** and makes **resources**. That is the arithmetic that
keeps last round's yield safe to exist, and it is a gate rather than a comment.

## AND IT TURNED TWO OF MY OWN GATES RED, WHICH WAS CORRECT

`builder_on_a_phone` 5/1 and `production_tick` 10/4 the moment this landed — both
build a plot, and building had just stopped being free. **The game changed under gates
that were still true about the old game.** Both were fixed with a **FIXTURE** (a
battery in the pocket, which is what a finished job pays), never a softer assertion,
and each carries a comment saying why the line is there so the next reader does not
"tidy it away". Whether the charge is right belongs to this job's gate: one job, one
gate.

## IN THE DEMO, PROVEN AND NOT ASSUMED

Booted the real cut demo, clicked through the splash, and asked the city frame:

    has production module : true
    cost row              : {currency:'electricity', amount:1, ruling:'8/15 ... + 9/4 ...', tuned:false}
    price line            : "costs one battery · you have none, so not yet"

Rule 7 met: the walked surface **and** the demo.

## THE STANDING NOTE

Last round's note said a dead verb and an empty table are one job. This one is its
sibling and it is sharper, because the danger was mine and not inherited:
**WHEN YOU SHIP A FAUCET, THE DRAIN IS NOT THE NEXT JOB, IT IS THE SECOND HALF OF THIS
ONE.** The board happened to have them adjacent. It will not always.
