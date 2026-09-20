# WORLD, HOLD ROUND — WHY HIS CARD SAID ZERO, AND WHAT MY LANE COSTS A PHONE (9/20/26)

**Nothing shipped to the alpha.** Rule 18(b): every building lane but RUN and COMBAT
holds; the round is spent measuring its part of loading, walking or the fight.

This is that measurement, and it starts with the one line of mine he read out.

---

## 1. HIS COMPLAINT IS MINE, AND IT IS WORSE THAN REPORTED

He opened the demo and a card of bullets popped up. One of them was **`BATTERIES IN
THE VALLEY: 0`** — my line, from `[battery worth]`. The routing note recorded it as
*"the fixed supply landed with an empty valley"* and held it for WORLD.

Reproduced cold, on the walked surface:

```
holders before the first card ....... 0
FIRST card  ......................... "BATTERIES IN THE VALLEY: 0"
holders after the first card ........ 15
total after the first card .......... 3352
SECOND card ......................... "BATTERIES IN THE VALLEY: 3352 across 15 hands,
                                        and 3352 more exist than last night"
THIRD card .......................... "BATTERIES IN THE VALLEY: 3352 across 15 hands"
```

**So my line is wrong on the first two nights he ever sees, in the two worst ways
available.** First it tells him the valley is empty. Then it tells him the valley
conjured 3,352 batteries overnight — on a row whose entire subject is that the valley
*cannot make a single cell*.

## 2. THE CAUSE, EXACTLY

**The valley's money is seeded inside `purseGet()`, and nothing on his path calls it
before the card is composed.**

```
before any tap ....... purse made: false,  holders: 0,  card: "0"
after the first tap .. purse made: false,  holders: 0,  card: "0"
call purseGet() once . 8.6 ms, holders 15, total 3352,  card correct
```

Something later inside the card's own first draw *does* reach the purse — which is why
the count is right by the time the draw finishes, and why every card after the first is
correct. The first card reads the valley before the thing that fills it.

**The second bug rides on the first:** `CELLS_LAST` starts at `0`, so the night after
the stock appears, the drift line subtracts 0 from 3,352 and announces the whole
opening stock as new money.

## 3. AND MY GATE PASSED, BECAUSE MY PROBE SUPPLIED THE TRIGGER THE GAME DOES NOT

`battery_worth_gate.js` opens its surface check with `const p = purseGet();`. Every
number it then measures is true — of a page where somebody has already asked for the
purse. **The test created the condition it was testing for.** That is the same family
as "a gate that re-implements the thing it is testing", wearing a new hat: a gate that
*primes* the thing it is testing cannot see it fail to start.

The fix to the gate is one line — read the card cold, before anything touches the purse
— and it belongs with the fix to the bug.

## 4. THE FIX, WRITTEN DOWN AND NOT SHIPPED (rule 18)

Two lines, both in my own files:

- **the valley must not need a trigger.** `BohemiaCells.count()` either stocks on first
  ask, or the boot stocks once — the money supply of Las Vegas cannot depend on whether
  somebody happened to open a purse.
- **`CELLS_LAST` must start at the first real reading**, not `0`, so the first report
  says nothing rather than inventing a drift.

Rule 19(a) kills the pop-up card anyway, so this lands wherever the phone carries the
bookkeeping. The fix is the same either way.

## 5. WHAT WORLD COSTS A PHONE — MY PART OF LOADING

Measured at **4x CPU throttle, with the throttle proven inside the run** (50 ms of spin
did 74,894 loops throttled against 374,736 unthrottled, a real 5.0x — the control EYES
found missing twice).

```
door opens ....................... 49.3 s     (matches PLUMBER's 52.9 s)

ONE-TIME
  purseGet, incl. my seeding ....... 35.1 ms
  the night card's FIRST draw ..... 333.8 ms   the card's own render, not my line

EVERY NIGHT
  blockRent ........................ 33.3 ms
  cellsNightlyCharge ............... 14.1 ms
  pumpNight ......................... 0.1 ms
  valleyRunsOut ..................... 0.0 ms
  card redraw ................. 0.5 - 0.9 ms
  A WHOLE NIGHT, END TO END ........ 50.4 ms
```

**WORLD costs about 50 ms a night on a phone-shaped CPU, and 35 ms once at boot.**
Against 174 s frozen out of the first 300 that EYES measured, my lane is not where the
freezes are. I am saying that with numbers rather than leaving it to be assumed.

## 6. A NUMBER I NEARLY WROTE DOWN WRONG

My first pass measured the card at **382.8 ms** and I was one sentence from reporting
that as a nightly cost. Re-measured cold: **333.8 ms on the first draw ever, 0.8 ms on
every draw after.** It is a one-time hitch, not a per-night tax. Redraws cost nothing,
and the WORLD share of a redraw is under a millisecond.

The habit that caught it was asking for the same number twice.

## 7. WHAT I AM NOT DOING

Not shipping. Not touching a game file. `[block strikes]`, `[visible change]`,
`[suburb walls]`, `[full shelves]` and `[beltway placed]` stay OPEN and untouched; the
`[battery worth]` fix above waits for the coordinator to say the playable cut holds.
