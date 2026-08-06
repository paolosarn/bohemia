# A CHECK POINTED AT THE WRONG DOOR — 8/4/26, PEOPLE lane

The most expensive recurring bug in this repo, found three times in one day, the
third time in my own work an hour after I shipped it.

---

## THE THREE

| when | what | how it presented |
|---|---|---|
| 8/2 | the identity card, the ask, the name over their head | all built, all gated **green**, all on a page the RUN tab does not show. Paolo: *"I couldn't find them."* |
| 8/4 | nineteen gates hunting a constant that had moved; `touch_guard_gate` answering a missing payload with `continue` | eighteen went **red**. The nineteenth went **green while checking nothing**. |
| 8/4 | **me**, telling Paolo a walk fix would stop neighbours freezing in the RUN tab | measured after: `makeSim(` is **defined in the city frame and called zero times** |

They are one bug. **A check pointed at the wrong door never announces itself,**
because pointing at the wrong door produces confident green, not red. Finding
them one at a time has not worked — this is the third instance in three days.

---

## THE CORRECTION I OWE ON MY OWN WORK

An hour ago I shipped the head-on deadlock fix and told Paolo that neighbours in
the RUN tab would "walk around each other instead of getting stuck standing in
place."

**Measured on the real alpha afterwards, that overstated it.** The walked surface
draws people through the *offline plane* — it asks the schedule where somebody is
at this minute and draws them there, which is the documented two-plane design and
is correct. It does not step the agent simulation:

    slices/BOHEMIA_CITY_WORLD.html   function makeSim( : 1 definition, 0 call sites

The fix is real, it is correct, and it is live in `BOHEMIA_RUN_CURRENT.html`,
which **does** step the sim. That file is loaded by the alpha and never displayed.
So the fix changes nothing Paolo can see today, and I should have measured before
telling him it would.

---

## THE FLEET-SCALE VERSION OF THE SAME THING

`records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md` is the fleet's scoreboard —
**"THE RUN IS THE GAME: 25 / 31 systems integrated."** Every probe in
`integration_gate.js` reads `slices/BOHEMIA_RUN_CURRENT.html`.

The RUN tab does not display that file. One line in the alpha, since 7/28:

    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;

Measured on the real alpha 8/4 — tap the splash, tap RUN, ask the DOM:

    visible panel : p-city   (390 x 790)
    cityFrame src : BOHEMIA_CITY_WORLD.html
    runFrame src  : BOHEMIA_RUN_CURRENT.html   — exists, never shown

### This does not mean the rows are wrong

They are true about the file they name. It means **the greens are not evidence
about the surface he plays, and no reader can tell which ones are.**

I spot-checked 18 systems against the visible surface before writing any of this
down, because my first pass got it wrong: I searched the city frame for the *run
slice's function names* and "found" five missing systems. Four were false alarms —
doors, save/load, the resolver and combat are all there under their own spellings.
The CITY lane ported the great majority of it.

What survived checking:

- **clout / feed / followers** — marked `INTEGRATED`, no trace in the city frame
  under any spelling tried
- **the agent sim** — `makeSim` defined, never called on the shown surface

---

## WHAT I BUILT, AND WHAT I DELIBERATELY DID NOT

`gates/surface_truth_gate.js`, 16 claims, five mutations killed.

**It does NOT demand the measured surface equal the shown surface.** Which file
the run lives in is a real design decision with real consequences and it belongs
to the RUN lane. A gate that forced that answer would be *a gate outranking a
ruling* (Paolo 8/1), and I have no standing to make that call from here.

**It demands honesty.** The ledger must declare which file its probes read and
which file the RUN tab shows; both must be true; and where they differ the
document must say so above the table, where a reader cannot reach the greens
first. The mismatch is legal. Silence about it is not.

**The shown surface is derived, never typed** — read out of the alpha's own
routing line and frame src, so the gate follows whoever re-points the tab and the
declaration goes stale loudly on the day it stops being true.

### The gate caught me writing a bad checker, again

My first version of one claim grepped for the phrase *"rows are lies"* to police
tone — and matched it inside my own sentence saying the rows are **not** lies.
*A checker that cannot tell a mention from a use is the broken one* (Paolo 8/1).
Fix the ruler, never the target. It now requires the warning to **quote the
alpha's routing line verbatim**, so the claim is checkable by a reader instead of
trusted, and rots loudly instead of quietly.

---

## FOR THE RUN LANE, WHOSE CALL THIS IS

Two honest options, both real:

1. **Re-point the ledger** at `BOHEMIA_CITY_WORLD.html` and re-probe every row
   against it. The scoreboard then measures what he plays. Cost: most probes need
   rewriting against the city's spellings.
2. **Make the run slice the shown surface again.** Cost: the city frame is where
   the walked world, the districts and the talk system now live.

Not mechanical, not mine, and not urgent — but it should be **decided rather than
drifted into**, which is the whole reason the mismatch is now written down where
the scoreboard is read.
