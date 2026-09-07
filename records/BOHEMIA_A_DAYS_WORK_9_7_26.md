# A DAY'S WORK (9/7/26, WORLD lane) — board row EVERYBODY-IN-THE-VALLEY-HAS-A-JOB-EXCEPT-THE-PLAYER

Ship: `engine/bohemia_work.js` (new), `engine/bohemia_purse.js` (`payForWork`),
`engine/bohemia_agents.js` (exports `JOB_DISTRICTS`), the walked surface, and
`gates/a_days_work_gate.js` (37 checks, registered as **A DAY'S WORK**).
Tab: **CITY**, and on the street — the button is where his feet are. Also in the demo.

---

## THE FINDING, MEASURED IN OUR OWN CODE

```
NPC acts     (bohemia_agents.js, since his 7/19 correction):
    errand, free, home, scav, sleep, watch, work
PLAYER acts  (the walked surface):
    walk, talk, fight, build, buy, sleep
```

**THERE IS NO PLAYER ACT CALLED WORK.** Every person in the valley puts in a
seven-hour day and the player was the only one locked out of it.

The money vocabulary said the same thing. Finish a quest (+1), place a building
(−1), buy a good (−1), ask somebody (−1 clout): **three of four are spending, one
is earning, and none of them is work.** The four verbs are the BILL. This is the JOB.

Re-measured here across 400 seeds of the valley's own schedule builder:

```
worker  work    08:00-16:45   479 min   (435 .. 525)
scav    scav    08:30-18:45   367 min   (214 .. 526)
watch   watch   16:15-23:25   361 min
keeper  errand  08:43-12:43    75 min
```

## NOTHING IN THIS ROW IS A NEW NUMBER, AND THAT IS THE WHOLE DESIGN

Every part of a day's work was already built and none of it was joined up:

| what | who already owned it |
|---|---|
| WHERE work happens | `bohemia_agents.js` `JOB_DISTRICTS` — commercial, industrial, medical, solar |
| WHAT KINDS exist | `bohemia_economy.js` `YIELD` — exactly two, `site` and `scav` |
| HOW LONG it takes | `bohemia_agents.js` `scheduleFor()` — the valley's own clock |
| WHAT it produces | `bohemia_economy.js` `advanceDay()` — hand it one more agent |
| WHAT it pays | the purse's `PAYOUT.COMPLETE`, his ruled ONE in his 9/4 battery |

`engine/bohemia_work.js` joins them and owns no table of its own. There is not one
duration, rate, price or yield typed in it. The gate proves that by stripping the
comments and grepping the logic: the only numerals left are `0`, `1`, `8` and `60`.

**And the one numeral that looks like a shift length is proved not to be one.**
`minutesFor` hands `scheduleFor` an 8am clock-on because the function demands a
start time. If that argument could change how LONG the work is, it would be a typed
shift length in disguise. It cannot — `bohemia_agents` builds the block as
`until(shift + j(480,45))` right after `until(shift)`, so the start slides and the
length does not — and the gate measures that across 30 seeds and two clock-on times
rather than arguing it.

## THE ROW THAT WAS ALWAYS THIS ROW

`PAYOUT.COMPLETE` carries his ruled ONE, and the comment sitting on it says, in
these words, **"a day's work pays a battery"**. Measured before this shipped: its
only caller in the whole repo was quest completion. So the sentence describing a
day's work was reachable exclusively by finishing a quest, and a player who worked
all day was paid nothing. `payForWork()` is the same row, finally reachable by the
thing it was written about — no second table, no new number.

The ledger entry says `work:site`, not `quest:COMPLETE`. `audit()` refuses an
anonymous movement, and a quest label on a shift at a solar yard is a lie the ledger
then tells forever. The ledger is the record of what you DID, which is the whole
four-verbs design.

## WHAT HE DOES

Standing anywhere in the valley, a button in the left column says what work is on
offer and what it costs him in hours:

- on one of his job districts: **🔧 WORK · 8H**
- anywhere else: **⚒ SCAVENGE · 8H**

Tap it and the clock moves by exactly that many minutes — the shift is the working
day — and at nightfall the card he already reads says:

```
you put in a 8 hour shift at the solar
a day's work paid: 1 battery
```

**One shift a day, and that is not a cap I invented:** the shift IS the working day,
so a second one would be a second day inside the first.

**A shift that will not fit before nightfall is REFUSED, not truncated.** Half a
day's work for a full day's pay is a number nobody ruled, and half a day's work for
half the pay is another one. EVERYTHING COSTS ONE (8/15) means the unit is the whole
shift, so the honest answer to "there are two hours of light left" is that you
cannot start.

## AND IT IS THE OTHER HALF OF THE-VALLEY-RUNS-OUT

A day he worked is the valley's own agent list **with one more agent of the kind he
worked**, handed to the same `advanceDay()` that has turned agents into goods since
it was written. No yield is computed in the new module or on the surface. Measured
on the real ledger:

```
produced, valley alone     salvage 168.0   food 21.0
  + the player scavenging  salvage 169.2   food 21.15
  + the player on a site   salvage 171.0   food 21.3
```

Conservation still holds and the scav decay curve applies to him exactly as it
applies to everybody else. An organised site is worth more than a lone sweep because
the economy ruled that, not because this row did. THE-VALLEY-RUNS-OUT (9/6) made the
valley eat its shelves down whether or not you look; **this is the first thing a
player can do about it with their hands.**

## MEASURED ON THE REAL MAP

- 179 of 2,304 sampled cells (7.8%) offer SITE work; the rest offer a sweep. The
  player spawns in a suburb, so his first offer is a scav sweep, and a solar yard is
  a place he has to walk to.
- Both shifts always fit in the 840-minute waking day: across 2,000 seeds, site runs
  435..525 minutes and scav 199..526. **2000/2000 fit** — so the button is never
  dead on arrival, which is the failure this was measured to rule out.

## ONE THING THE FIRST CUT GOT WRONG

The card said **"you scavenged for 8 hours at the suburb"**, which reads like the
suburb employs you and is exactly backwards: scavving is what you do when nobody
does. The place is named only when the place is the job. A shift belongs to a site;
a sweep does not belong to anything.

## WHAT THIS ROW DELIBERATELY DID NOT BUILD

- **RUN [a shift]** — the five-minute session shape around it
- **PEOPLE [somebody hires you]** — who offers you the job and whether they will
- **WORLD [batteries mined]** — buildings earning while you are away (work first)
- **ECONOMY [shift pay] (Q27)** — what a shift is worth against everything else.
  That is his, it is being researched now, and when it lands it moves `PAYOUT` and
  `payForWork` does not change. That is the test of whether this pipe was built right.

## PROOF

- `node gates/a_days_work_gate.js` → **37 passed, 0 failed**, registered as A DAY'S WORK
- red both ways: type a shift length → **2 red** (including the no-typed-numbers
  check, which named the 480); truncate instead of refusing → **2 red**
- the demo section serves the real file over HTTP, enters through the splash, and
  works a full shift for a battery inside the city iframe

Build stamp: **BUILD 9/7l - A DAY'S WORK**
