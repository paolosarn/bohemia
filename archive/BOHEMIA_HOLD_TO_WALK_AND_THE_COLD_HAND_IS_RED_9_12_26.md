# HOLD TO WALK, AND THE COLD HAND IS RED ON MAIN (RUN, 9/12/26)

VAMILY `[drop in]` / THE-FIRST-MINUTE-IS-THE-PROMISE.

> Paolo 9/11: **"Your job is to make sure the rest of the game is playable and
> fun bro come on."**

## WHAT SHIPPED: THE PAD NOW TEACHES THE ONE VERB THAT MOVES YOU

Measured with a real held press and a wall clock: **a tap moves one tile, a hold
moves about two tiles a second**, and the walk **latch** (shipped 9/6) keeps you
going after you let go. **The word "hold" appeared nowhere near the pad.** The
first-run lesson said WALK WITH THIS, which teaches that the pad exists and
nothing about the verb that gets you anywhere.

    WALK WITH THIS   ->   HOLD TO WALK, LET GO TO KEEP GOING

Verified on the served demo: the lesson reads back exactly that, and a real 12
second press on a pad wedge walks and then **latches** (`LATCH_DIR = 1` the moment
the finger lifts).

It does not touch the step's clearing rule, so a player who taps is never nagged;
it adds no step, no screen, and no second teaching system; and `LATCH_AFTER` stays
at three beats so a tap is still one step.

**Whose surface:** the teaching is UI's `[first teaching]`, and that row is
**SHIPPED and closed** — nobody is mid-flight in it. ONE SYSTEM ONE SESSION is
about concurrent edits, and there were none.

## *** AND THE COLD HAND IS RED ON MAIN. THE 8/25 DEAD END IS BACK. ***

Ran this lane's own cold-hand instrument — it presses the loudest thing on screen
forty times and never reads a word. **It is red, and it is red on clean main
without any change of mine** (checked by stashing).

    *** THE GAME ADVANCES UNDER A COLD HAND ***
    clock 1d 360m -> 1d 360m over 40 presses

**Six hours of game time should have passed. Zero did.** That is the exact
assertion that was false on 8/25, when the demo had a dead end: 06:00 at the first
tap and 06:00 at the twelfth.

The trail on clean main:

    front > padring > daycardIn > daycardIn > daycardIn > dcgo > openWatch
          > padring x6 > row x26

Two things in that trail matter:

1. **It presses `padring` six times and the clock does not move.** The pad was
   rebuilt on 9/7 from an opaque circle into an SVG ring cut into eight wedges.
   The wedges carry the handlers; the ring itself does not. So **the loudest part
   of the walk pad is not the part that walks** — and the walk pad is how you move.
2. **It then presses `row` twenty-six times in the shell and never escapes.**

## WHAT I DID NOT TOUCH, AND WHY

**The pad is `[no slop]`'s live work and that row is CLAIMED right now.** ONE
SYSTEM, ONE SESSION: two sessions in the same control is the exact thing that law
exists to stop. This is written down loudly instead, with the trail, because the
finding is worth more to them than a conflicting edit is worth to me.

The `row` half is the alpha shell, which **is** this lane's surface, and it is the
first thing to chase next round.

## WHAT THIS ROUND ALSO CORRECTED

Three times this round an instrument nearly produced a false finding, and each was
caught before it was written down as fact:

- **"the latch never engages"** — read three seconds after release, when the latch
  is *supposed* to stop for a wall or a card. Read immediately, it engages
  (`LATCH_DIR = 1`). A reading taken late cannot tell "never latched" from
  "latched and correctly stopped".
- **"endHold never fires"** — I wrapped `window.endHold` *after* the listener was
  bound by reference, so the wrapper could never see it. The absence was mine.
- **"13 tiles a minute"**, from the round before, already corrected in the earlier
  record: that was a probe timing itself.

## RESULT

    the lesson reads back on the served demo, and a real held press latches
    COLD HAND 4/2 -- RED ON MAIN BEFORE THIS CHANGE, not caused by it
