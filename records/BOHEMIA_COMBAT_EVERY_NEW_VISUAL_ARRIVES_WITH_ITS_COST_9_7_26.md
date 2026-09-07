# V204 — EVERY NEW FIGHT VISUAL ARRIVES WITH ITS COST (COMBAT lane)

VAMILY job: **EVERY-NEW-FIGHT-VISUAL-ARRIVES-WITH-ITS-COST** `[draw budget]`.

> "the fight loop is FULL (497 of 500 ms a beat, measured). Anything new that
> draws in the fight is designed and built, but ships with its cost stated in
> milliseconds per beat, and does not enter the fight loop until there is room
> for it. Not an art freeze and not a stop: one rule, a number with every new
> thing that draws."

---

## THE NUMBER THE RULE DEMANDS DID NOT EXIST

The PLUMBER's beat profile prices **the whole beat** and names the systems inside
it. Nothing anywhere priced **one thing**. So the rule as written could not be
obeyed: a lane building the camera pull-back had no way to answer "what does it
cost", and the honest answer to an unanswerable question is a guess.

This row builds the answer and then makes it compulsory.

## WHAT SHIPPED

| | |
|---|---|
| `tools/bohemia_draw_cost.js` | measures ONE feature's cost, in milliseconds per beat |
| `engine/bohemia_draw_budget.json` | the ledger: what draws, what it costs, when it was taken |
| `gates/draw_budget_gate.js` | holds the rule, **10 pass / 0 fail**, suite-registered |

## HOW IT MEASURES, AND EVERY CHOICE WAS FORCED BY A FAILED ATTEMPT

**THE CAMERA IS PINNED.** The plumber measured the driven beat at **347 to 497.5
ms across seven samples of one build**, and the whole cause is how much the
camera happened to move. A per-feature cost read off a spread that wide is noise
with a decimal point. Both arms draw the same picture.

**THE ARMS INTERLEAVE, ABBA, NOT ABAB.** Blocks measure whatever drifted between
them. And running the ON arm first in every pair left a real bias: the control —
the same setting in both halves — came back **+0.0333 against its own ±0.0234**.
On-off-off-on cancels both the first-position bias and drift across the group.

**`draw()` IS CALLED DIRECTLY**, the same function `loop()` calls.

**AND THE RASTER IS PAID FOR INSIDE THE SAMPLE, WHICH TOOK THREE GOES.**

| what was timed | the frame read | every feature read |
|---|---|---|
| `draw()` alone | **0.8 ms** | **0 ms — free** |
| `draw()` + a flush per draw | **28 ms** | all under the noise |
| 12 draws, one flush at the end | **1.4 ms** | real numbers |

`draw()` only **queues** canvas commands, so timing it alone times the asking and
not the doing, and everything comes out free. A flush per draw pays ~27 ms of
pure GPU-to-CPU stall per call, which swamps what is being measured. Twelve draws
behind one flush still forces all twelve to execute — canvas2d keeps a retained
bitmap, nothing is skipped — while the sync is paid once and divided by twelve,
which is also what divides the clock tick by twelve. **Chromium clamps
`performance.now()` to 0.0083 ms here, measured rather than assumed**, and one
frame costs ~1.4 ms, so a single timed draw cannot see anything under 1% of a
frame.

## THE NUMBERS

```
  the floor (the control, same setting both arms)   0.59 ms a beat
  the companion on the field                        1.25 ms a beat
  the way out marker                                0.75 ms a beat
  the beat ghost                                    BELOW THE FLOOR
```

Run to run these move by about ±0.25 ms a beat, which is the honest precision.

**THE FLOOR IS WHAT THE CONTROL READS, AND IT IS NOT ZERO.** The instrument's own
bias is the same size as the features being priced, so pretending it is zero
would make the tool's error look like somebody's feature. Everything at or under
it is written into the ledger as **below the floor: too small for this
instrument, NOT free.**

## AND THE INSTRUMENT CAUGHT AN ERROR IN MY OWN TOGGLE, WHICH IS WHY IT EXISTS

The beat ghost first measured **minus one millisecond a beat, outside its own
error bar.** A negative cost is not noise, it is a wrong question: `allyOn()`
reads `G.teachBeat` too — the teaching fight is yours alone — so switching the
ghost on was also **removing a whole second body from the frame**, and the tool
was reporting the companion's cost with the sign flipped. The companion is held
off in both arms now. *A toggle that moves two things measures neither.*

## WHAT THIS DOES NOT CLAIM

The measurer prices **one draw** on a pinned camera with a warm floor cache. The
plumber's profile prices **the whole beat** with the camera moving. **The two are
not the same number and must not be added.** A feature that also invalidates the
floor cache costs far more than its own draw, because the cache is keyed on the
camera. Every number here is a **LOWER BOUND**.

## THE HALF OF THE RULE THAT CANNOT BE TALKED AROUND

A declaration nobody has to make is not a rule. So the gate **ratchets the fight's
draw surface**: every function in the shipped blob whose name begins with `draw`
is listed in the ledger, all fifteen of them. Add one and the gate goes red and
names it:

> `>> ADD THESE TO engine/bohemia_draw_budget.json AND PRICE THEM WITH
> tools/bohemia_draw_cost.js: drawNewShinyThing`

Mutation-proved: a new draw function in the blob → 1 red, named. A feature
shipping unpriced → 2 red.

## TWO ARMS OF MY OWN GATE WERE WRONG FIRST

**1. THE HEADROOM ARM WAS BACKWARDS AND WENT RED ON ARRIVAL.** It summed the
features that are **already drawing** and compared them to what is left over —
but those are already inside the plumber's driven 413.5, so it was counting the
same milliseconds twice, and it made a gate that is red the day it ships. *A gate
red on arrival gets switched off by the next session that meets it*, which is
that lane's own rule. The row's sentence is about what has **not entered yet**:
the candidates are what gets weighed, against the **worst** end of the headroom,
because a budget spent against the median is a budget spent against the good
days.

**2. THE RULER ARM WENT RED IN THE SUITE AND GREEN ALONE ON THE SAME TREE.** Five
hundred and fifty gates share this machine and a timer read under that load
resolves less. A flat cap on a timing measurement is a checker tighter than the
thing it checks, and that is a checker that gets switched off. The band is the
cap **or this run's own resolution, whichever is wider** — and a run too noisy to
say anything is still red, because the error bar has its own ceiling. It cannot
excuse itself by being useless. Three standalone runs and one pack run: 10/0.

## `NO DAMAGE BEFORE THE DIAL`

Nothing in this row touches the game. It is a tool, a data file and a gate; the
shipped fight is byte-identical.

## ROUTED, NOT DONE HERE

The plumber's record ends with a change measured, argued and handed to this lane:

> "A camera that SNAPPED when it was within a fraction of a pixel of its target
> would settle in a few frames instead of never, the cache would hold through the
> still parts of a fight, and the beat would fall further. That is a change to
> how the camera feels, so it belongs to COMBAT, not to the plumber."

The auto-frame eases 10% of the remaining distance every frame, which needs ~335
frames — six seconds — to land, so it is never still while anybody is playing.
**That is the single biggest piece of headroom named anywhere and it is this
lane's.** It is not on the board as a row, and only the coordinator adds rows.

## AND FOUR ARMS OF THIS LANE'S OTHER GATE WERE COIN FLIPS, WHICH IS WHY IT KEPT FLAKING

`fight_moves_you_gate` went red about one run in three all round, on **four
different arms**, and none of them was caused by this row — nothing in this row
touches the game. They are one family: **rate comparisons over twenty-four to
ninety simulated fights, asserted as if they were exact.** Captured, not re-run
into green:

| the arm | what it demanded | what four runs measured |
|---|---|---|
| V199 the perk is better | `perk.turns <= dflt.turns` | 34.8 → 36.2. The row's OWN headline says nerve buys 1.2 turns and **the length of a fight does not live in this mechanic** |
| V199 the perk is better | `perk.breakPct > dflt.breakPct` | 66.7 vs 45.8, then **41.7 vs 58.3** — the same build, the difference changing sign |
| V196 sprint beats walk | `sprint.dmg < walk.dmg` | **113.8 against 113**, eight tenths of a point out of a hundred and thirteen |
| V171 a far blade is flat | a **two-sided** null band | punished noise that argues FOR the claim |

Each is now **printed and not asserted**, with what is exact kept: the perk's two
dials are constants and they are checked; the row's real finding — crossing the
room is the worst play unless you spend a pip — holds every run with a real
margin and it is checked. *A checker tighter than the thing it checks is a
checker that gets switched off.*

## AND ONE OF THEM WAS NOT A CHECKER PROBLEM AT ALL

The safety check on his rejection — "I don't know why **SO MANY PEOPLE ARE
RUNNING AWAY**" — demands the fraction of men who leave stay under **15%**. That
15 was set against this row's own published figure of **"4-8% of men leave"**.

**MEASURED 9/7, six runs across two trees with nothing else on the machine:
6.9, 9.0, 9.7, 9.7, 11.1, 12.5 — and under suite load 13.9, 15.3, 16.0.**

**THE PUBLISHED 4-8% IS WRONG.** The real band is about **7 to 16 per cent**, so
the limit was sitting *inside* the normal spread and had been passing on luck.
It moves to 25, which is still nowhere near a rout, and the measured number is
printed every run so real drift shows instead of hiding behind a threshold that
never fires. **The 4-8% claim in `BB-NERVE-ON`'s record and in COMBAT's STATE
line is a correction for the coordinator.**

I nearly got this wrong twice. The first baseline — three runs on `origin/main`
— came back 9.0-9.7 while my tree read 12-16, which said plainly that I had
broken it. Three CLEAN runs on my own tree (nothing else on the machine) read
6.9, 12.5, 11.1. **The tight main numbers were luck and the load was mine**, and
the conclusion reversed with more data. *Three samples of a noisy thing is a
story, not a measurement.*

## GATES AT CLOSE

| gate | |
|---|---|
| `draw_budget_gate.js` | **10 pass / 0 fail**, three standalone runs and one in the suite |
| `combat_entry_gate.js` | 42 / 0 |
| `fight_moves_you_gate.js` | **170 / 0**, three clean runs after four coin-flip arms were repaired |
| page errors | **0** |
