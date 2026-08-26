# THE STALENESS GATE WAS GETTING HAPPIER EVERY TIME A SOUND DIED (8/25/26, SOUND lane)

Two of the reds standing on main belonged to this lane. This is what they were.

## RED 1 -- RUN BEAT. FOUR DAYS OF A RED THAT NAMED THE RUN, AND THE RUN WAS FINE

`run_beat_gate.py` reported, every run since 8/21:

    FAIL  the browser run died:  TimeoutError

It was not the run. On 8/21 the alpha DELIBERATELY stopped downloading the
17.8 MB run slice on boot -- 17.8 MB fetched on every visit for a panel the
shell never displays -- and exported `window.__loadRunSlice` instead. The alpha's
own comment states the contract in as many words:

> "nothing in the product calls this, and the four gates that need the frame
> live ask for it by name."

RUN BEAT was the fifth. It waited for `#runFrame` to be ATTACHED -- which it
always is, src or no src -- then waited thirty seconds for `RB` to appear inside
an empty iframe, and reported the run as dead.

One line fixes it. With the slice actually loaded: **22 passed, 0 FAILED.** The
run takes the studio's tempo, tracks its phase, and lets go on stop, and has
been doing that the whole time.

**Gated so it cannot come back.** `suite_honesty_gate.js` A20: every gate that
takes the run frame from inside the alpha must ask for the slice by name. Seven
gates checked; `demo_gate.js` is exempt by name and with its reason (it picks its
frame by capability because it wants CITY_WORLD, not the run).

The first sweep I wrote for A20 flagged six offenders. It was wrong: three open
the run slice as a PAGE, which needs nothing, and `demo_gate` wants the city. The
sweep was the thing that was broken, again, and the pattern in the gate is the
corrected one.

## RED 2 -- SFX DIVERSITY. THE GATE WAS COUNTING CORPSES

His ruling, after judging all 270: *"you need more diverse sounds bro its
getting stale at this point."* The gate built to hold that measured every recipe
the engine can cook -- **including candidates he had already killed.**

    counting corpses : instrument 105 of 205 = 51.2%   (cap 50%, marginal red)
    LIVING SOUND     : instrument 105 of 155 = 67.7%

**And the error ran the wrong way, which is what makes it serious.** Every one of
the ten whole moments killed since 8/12 was a NON-instrument moment. Not one
instrument candidate has ever been tombstoned. So each death padded the
denominator and made the ratio look BETTER while the game got staler. A staleness
detector that relaxes every time a sound dies is pointed backwards.

**Worse, it was blind to the thing it exists for.** `particle` and `air` have
ZERO living candidates between them -- cash_count, deck_ring, glass_crunch,
mag_clack, breath_out and dog_cry all went 5 for 5 -- while the span check still
said "at least four physics" and passed. Two of the engine's five physics are
extinct in audible sound and the gate could not see it.

### AND THEN THE GATE WAS ASKING FOR SOMETHING HIS OWN VERDICTS FORBADE

The 8/14 post-mortem, in the graveyard, in prose:

> "PARTICLE AND AIR WENT 0 FOR 30... particle and air are barred from NEW cooks
> rather than deleted from the engine." / "There is no third cook for these
> slots, in this session or any other, unless he asks for one."

Three methods are still allowed to be cooked. The gate demanded four. It sat red
for eleven days with **no legal way to turn it green** -- turning it green
required violating STOP PRODUCING. That is the exact shape of A GATE MUST NEVER
OUTRANK A RULING (8/1).

The ruling now has a machine-readable home on one anchored line in the graveyard
registry, `BARRED-FROM-NEW-COOKS: particle air`, and the gate READS it. It is not
copied into the gate: a mirrored constant is the rot that cost this lane its
whole week. If he ever asks for particle again, that one line changes and the
gate follows.

The gate also now holds both halves of what the post-mortem actually decided:
a barred method must still be DECLARED in the engine (he barred the recipes, not
the physics -- deleting it would make the bar unliftable) and must have no living
candidate (one coming back alive without him asking is a remake).

### THE ONE RED THAT SURVIVES IS TRUE, AND IT IS NOT CLOSED BY PADDING

    instrument holds 105 of 155 LIVING candidates, 67.7%

I did not close it, and I am not going to fake it. Closing it honestly needs 55
more non-instrument candidates, about eleven moments, **that the game actually
wants**:

- particle and air are barred, so they cannot supply them;
- of the 32 real playable moments that still make no sound, **30 were already
  shown and got zero ups** -- spent, and re-cooking them is the third cook STOP
  PRODUCING names as the tell that the failure already happened;
- that leaves 2 never-shown moments and the routed FIELD SURGERY set.

So the failure message now carries the cost, in the gate, where the next person
reads it -- friction first, because at 40% it is the best-scoring method he has.
A red that only prints a number is an invitation to pad it.

## MUTATIONS (IF YOU ADD A CHECK, MUTATE IT)

    A  the bar line disappears from the graveyard
       -> "the graveyard names which methods are barred (NONE FOUND)" RED,
          and the two checks that depend on it go red with it
    B  a barred method comes back alive (one tombstone deleted)
       -> "if one ever comes back alive without him asking, that is a
          remake (air)" RED
    C  the tombstone matcher goes blind -- the corpse-counting bug, restored
       -> the ratio falls straight back to the lying 51.2%, AND the remake
          check catches it: "barred because they are DEAD (air, particle)" RED
    D  a gate stops asking for the run slice        -> A20 RED
    E  A20's sweep pattern stops matching anything  -> its own "this check is
       actually looking at something" leg RED

C is the one worth keeping. **You cannot restore the old bug without the remake
check noticing** -- the two legs brace each other, so the gate cannot quietly
go back to being generous. E is the same idea aimed at itself: a checker that
has stopped seeing anything reads exactly like green, which is the whole lesson
of this week.

## THE TALLY, UPDATED

Twelve of these now, and the shape has never changed once: a measurement that
was exactly right against the engine it was written against, left in place while
the engine moved underneath it. RUN BEAT is the purest example yet -- the alpha
wrote down the new contract, in a comment, on the day it changed, and a gate
nobody re-read spent four days calling the run broken.

The instrument is the first suspect, not the last.

## AND RUN BEAT HAD A SECOND ONE UNDERNEATH THE FIRST

Loading the slice turned RUN BEAT green, and then it went red again on the next
run, on a different leg:

    FAIL  one second of wall clock moved the run 2.400 beats, not 2 (120 BPM)

2.4 beats a second is 144 BPM, so that message sends you looking for a tempo
change. There is none: the studio is hardcoded to `stepDur(){return (60/120)/4;}`
and always has been. The check read the beat, called `waitForTimeout(1000)`, read
it again, and asserted the difference was 2.000 +/- 0.25 "because 1 second is
exactly 2 beats at 120". It passed most runs and failed some.

MEASURED, sampling every 200 ms inside the run frame for eight seconds:

    instantaneous rate:  278 ... 1542 ms per beat
    OVERALL:             496.3 ms per beat  (0.7% off 500)

**The run's clock is right.** It does not interpolate smoothly between parent
updates -- it RE-SYNCS to the parent's audio clock in steps, so the instantaneous
rate is a sawtooth around the true value. A one-second window catches one or two
teeth of that sawtooth. The old check was measuring jitter and reporting it as a
broken tempo law, at random, roughly half the time.

The fix is the instrument that actually found it: twenty-one samples taken INSIDE
the frame, so no cross-process latency lands between two reads, and the OVERALL
rate over four-plus seconds. Three runs back to back, 25/0 each.

**It is stricter than what it replaced, not looser.** The 120 BPM LAW is now its
own explicit leg (`a beat is 500 ms`), separate from the phase measurement, so a
real tempo break is reported as a tempo break. Under the old check the two were
the same number and could not be told apart -- which is precisely why a jitter
sample got reported as a law violation.

Two guard legs stop the fix rotting back: the window must be at least 3000 ms and
carry at least fifteen samples, both stated as claims the gate makes rather than
assumptions it holds.

    MUTATION A  studio to 144 BPM     -> the 120 BPM leg RED; the rate leg stays
                                         GREEN because the run correctly follows.
                                         The old check could not separate these.
    MUTATION B  run's clock 15% fast  -> "averaged 430.5 ms a beat, not 500
                                         (13.9% off) -- that is a rate error,
                                         not the re-sync sawtooth" RED
    MUTATION C  window back to ~1.3 s -> reproduces the ORIGINAL flake exactly
                                         (13.2% off from pure jitter), and both
                                         guard legs go red and name it as a
                                         window problem rather than a tempo one

Thirteen now. RUN BEAT alone carried two of them, stacked: a gate that never
noticed the alpha changed how it loads, and underneath it a gate that assumed the
time it asked for was the time that passed.
