# THE VALLEY RUNS OUT (9/6/26, WORLD lane) — board row THE-VALLEY-RUNS-OUT

Ship: `slices/BOHEMIA_CITY_WORLD.html` + `gates/valley_runs_out_gate.js` (25 checks,
registered in `gates/bohemia_gates.py`). Tab: **CITY** — it is on the nightfall card
he already reads at the end of every day. Also in the **demo**, on its one night.

---

## THE RULING

Coordinator, 9/5, correct-after: the valley eating its last shelves in ten days is
**the premise, not a bug**. This is an economic crash simulator; a place that is
running out is the whole point. So make it visible — the shelves emptying is
something the player can SEE happen day by day, and the day-10 moment is a beat,
not a silent zero.

## THE BUG UNDERNEATH IT, AND IT IS THE WHOLE PREMISE

`mktAdvanceDay()` opened with:

```js
if(!MKT_LEDGER) return null;   // never censused = never traded = nothing to age
```

That note is true of a **shop** and false of a **valley**.

MEASURED: the ledger does not exist at boot. So a player who had not walked into a
market had a world that **never ate anything** — and the first time he did walk into
one, on day 30, the ledger was born FULL and the countdown started *then*. A place
that only starts running out when somebody checks is not running out.

Fixed: the ledger is made if it is missing, so a valley nobody shopped in still eats.

## EVERY NUMBER IS READ, NONE IS TYPED

`engine/bohemia_economy.js` has computed `daysLeft` since it was written, and nothing
outside a market card had ever asked it. Nothing in `valleyRunsOut()` schedules
anything: no day number, no stock, no rate, no threshold. The only numerals in its
logic are `0` (a count being empty) and `1` (a count being under one day).

Measured on the real ledger: **food goes 8.4 days → 0 across exactly TEN DAYS** —
the coordinator's day-10 moment, derived from his own stocks and needs, scheduled by
nobody. If his stocks or needs move, the number moves with them and the gate reports
the new one rather than demanding the old.

## WHAT HE SEES

On the nightfall card, above the turf lines:

- the scarcest good and how long it has left — `food: 7 days left in the valley`,
  counting down to `1 day`, then `less than a day`
- on the night a good hits zero, in the warning colour: **THE FOOD IS GONE.** There
  is none left in the valley. Fired **once**, on that night, never again.
- then the countdown moves to whatever is scarcest next, so the valley keeps
  running out.

Driven twelve nights on the real surface, never once entering a market:
`7 → 6 → 5 → 5 → 4 → 3 → 2 → 1 day → less than a day`, **night 10: THE FOOD IS
GONE**, then meds `20 → 19 → 18`.

---

## THREE THINGS THIS ROUND MEASURED THAT WERE NOT THE JOB

**1. THE DEMO IS ONE DAY LONG ON PURPOSE, AND I NEARLY FILED THAT AS A FREEZE.**
Driving twelve nights in the demo gave one count and eleven silences, with `DAY.phase`
stuck on `ended`. That is not the countdown breaking: `CT_DEMO_DAYS` is 1, and
`ctDemoOver()` hands day 2 to `showEnding()` — the last-thirty-seconds phone card
that says THAT IS AS FAR AS THIS GOES FOR NOW. Verified against a clean `origin/main`
build, which stops in exactly the same place and carries no countdown on its one
night at all. The demo ENDS. Its one night is the whole test, and the count is on it.

**2. MY PROBE WAS READING ONE STALE CARD ELEVEN TIMES.** The drive dismissed with
`.dcgo` or nothing. Other lanes share `#daycardIn` and their cards do not all carry
`.dcgo`, so the night the phone card came up the loop stopped advancing and re-read
night one eleven times — eleven "silent nights" that were really eleven reads of the
same card. Every card has carried a real ✕ (`.dcx`) since that was fixed in the
system. The gate now drains the night and dismisses whatever is up.
*A negative result is a claim about your instrument until you have shown the
instrument could have seen a positive one.*

**3. THE CITY FEED WAS STARTING THE VALLEY'S CLOCK BY ACCIDENT.** Deleting the fix
and watching this gate stay green: with the ledger creation gone the valley was
*still* aged by night 12. `feedWorld()` renders a post through `mktShelf()`, which
calls `mktLedger()`, which builds the ledger as a **side effect** — night 4, from a
panel that was only trying to write a sentence. That is this row's own bug wearing a
different coat, and it is why "aged by night 12" is a coincidence, not a check. The
gate now asserts the count is on the card **on night one**, before anything else has
looked at the valley. That check goes red the moment the fix is removed.

## AND A GATE THAT ANOTHER LANE HAD SILENTLY UNREGISTERED

`gates/bohemia_gates.py` had lost the `COALITION` row between that row shipping
(`aace2d9`) and this round — a resolver dropped it. **An unregistered gate never
runs**, and nothing goes red to tell you. Restored verbatim from
`git show aace2d9:gates/bohemia_gates.py`, and all six of this lane's other
registrations checked and present. Suite total back to 528 + this row's.

---

## PROOF

- `node gates/valley_runs_out_gate.js` → **25 passed, 0 failed**
- red both ways: remove the ledger creation → **4 failed** (including the night-one
  check and both demo checks); make the beat fire every night → the once-only check
  goes red
- `COALITION GATE: 28 passed, 0 failed` (restored registration)
- the demo section serves the real file over HTTP, enters through the splash, and
  reads the count off the card inside the city iframe

Build stamp: **BUILD 9/6j - THE VALLEY IS RUNNING OUT**
