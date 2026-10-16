# FOUR REDS, AND THE DOORS WERE THE PROBLEM
FACTIONS lane · THE FIVE MINUTES (rule 14), round seven · 9/15/26

## THE ONE LINE
Rule 13 now says every lane must name which of the suite's 107 reds are its own.
Nobody had done that for this lane, so all twenty of its checkers were run: **16
green, 4 red**. Of the twelve individual failures, **six were checkers knocking on
doors that no longer exist** — not one of them was a broken feature. One green was
worse than the reds: it was passing on a stale reading.

## THE AUDIT

| | |
|---|---|
| gates that read this lane's own code | **20** |
| green | **16** |
| red | **4** |

    RED  faction_between   172 pass / 10 fail
    RED  faction_outfit     16 pass /  2 fail
    RED  feed_stream        17 pass /  2 fail
    RED  parties_move       38 pass /  1 fail

## THE BIG ONE, AND IT WAS THIS LANE'S OWN GATE
My last handoff had `faction_between` filed as **another lane's problem** with 2
failures. It is this lane's gate, written by this lane on 8/26, and it was at 10.
Correcting that mis-filing is half the value of the round: a lane that hands its
own red away stops looking at it.

Six of the ten came from one cause. The section opens the map with

    document.getElementById('modechip').click()   then   '#fitbtn'

Asked outright on the page the gate itself loads: **both are "NOT IN THE DOM".** So
the clicks hit nothing, `MODE` stayed `'human'`, and M0 reported **TW 18** — which is
the *on foot* tile width. The section believed it was looking at the whole valley
from above and was standing on a sidewalk, so M1 read pixels at each seat's
position on a street and reported eleven of fourteen outfits "unpainted".

## AND THE ZOOM LADDER HAD MOVED UNDER IT
Opening the real door was not enough, because the premise had also gone stale. The
section's own comment says *"the whole-map zoom makes a tile 3.74 pixels wide"* — and
3.74 is still exactly what the widest stop measures. But that stop no longer draws
the valley. Counted by wrapping both renderers and pressing the real control:

| | tile px | mode | city renderer | sky renderer |
|---|---|---|---|---|
| on foot | 18 | human | 0 | 0 |
| one squeeze | 13.5 | city | **1** | 0 |
| two squeezes | 3.7 | city | 0 | **1** |

**Two squeezes is the planet.** `ctBases()` returns all fourteen seats there and
nothing withholds them; there is simply nothing to paint on. No fix to the game
would ever have made those claims pass at that stop.

## THE FALSE GREEN SITTING NEXT TO THE TRUE REDS
M4 and M5 **passed** the whole time, reading `window.__GROUNDLABELS`. The render
publishes that and never clears it, so they were reading the last draw that ran,
one stop back. This lane has written that lesson down twice and still got caught by
it a third time. Cleared before reading now.

## AND ONE MORE DISTINCTION THE CLAIM COULD NOT MAKE
With the door open and the right stop, M1 still failed: four of fourteen seats at
zero pixels. But `getImageData` clamps at the canvas edge, so **a seat that is
simply off screen reads as zero** and was being counted as a renderer failure. At
that stop a phone shows about a third of the valley, so seats off screen is the
expected state. Separated:

    10 of 10 visible seats painted, 4 of 14 off screen

    172 / 10   as found
    175 /  7   through the real door
    176 /  6   at the stop where the city actually draws
    178 /  4   with off-screen told apart from unpainted

Every one of those six was the measurement, not the game. **The game was right all
six times.** Mutation-proved: make the map paint no faction ground at all and M1,
M2, M3 and M5 all go red, so the widened claims still bite.

## THE FEED IS ALIVE AND ITS CHECKER CANNOT REACH IT
`feed_stream` B2 reports **0 posts** in city mode and gets there with
`tapText('CITY|DROP IN')`. Measured: **zero** elements matching either name are in
the DOM. Crossed the seam the way a player does instead:

    at the door    feed off, 0 posts,  0 CITY/DROP IN chips in the DOM
    in city mode   feed ON, stream live, 4 posts

reading *"5 outfits holding a fortress between them"* and *"most of the valley is
still dark. 358 blocks with anything in them at all."* Paolo locked that feed on
9/4. It works. Its checker never arrives. Not this lane's gate, so it is handed
over with the reproduction rather than reached into.

## THE GATE THE SUITE LINE CALLED UNSAFE
The front page posts **FACTION ARC 557.7 s against a 600 s cap, not safe**, and that
gate's subject is this lane's. Measured here: **564 s**, so 36 seconds of headroom on
97 checks. When it crosses, all 97 die and file as a red — the failure PLUMBER
already paid for once.

Twelve blind sleeps worth **71 seconds of guaranteed idle**, every one sitting after
a goto or a reload with the next line reading exactly what it waited for. Swapped
for the settle helper this same file already used at two sites. Its contract is
what makes that safe rather than a gamble: **the upper bound is the original
number**, so the worst case is today's behaviour.

    564 s  ->  497 s        97 passed, 0 failed, both runs
    headroom 36 s -> 103 s against the 600 s cap

Proved the way the earlier split was proved: both runs stripped of timings, sorted,
compared line by line. **111 lines each, identical word for word.**

## THE TWO REDS THIS LANE IS NOT FIXING, WITH THEIR NUMBERS
- **faction_outfit 16/2.** Blues and Trades sit **0.0085 apart on a bar of 0.035** —
  four times too close to tell apart by silhouette, and the whole board is
  clustered (mean 0.072 against 0.090). That matters next to *"I didn't see a
  single human being"*: if he does meet people he cannot tell whose they are. NOT
  TAKEN: the gate's own note says **what factions wear is reserved to him by name**.
- **parties_move 38/1.** Two of his three agendas are out on the map (caravan 14,
  patrol 14) and the third is not.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp, and **the game file is not changed by
this round at all** — the whole diff is two checkers.

## [PENDING Paolo] — NOTHING NEW

## THE THING TO CARRY FORWARD
Three of this lane's checkers, plus the shared driver last round, were all failing
for the same reason: **the way into the city view moved, and the checks were left
knocking on a door that had been taken off its hinges.** Every one of them reported
it as a dead feature. Before believing a red, ask whether the check can still get
to the thing it is judging.
