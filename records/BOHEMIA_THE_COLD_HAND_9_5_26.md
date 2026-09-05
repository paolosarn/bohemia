# THE COLD HAND (RUN, 9/5/26)

VAMILY `[cold hand]` / BB-COLD-HAND.

> **A COLD HAND PRESSES THE LOUDEST THING ON SCREEN AND NEVER READS.** If doing
> that repeatedly does not advance the game, the screen is broken however good
> the systems behind it are.

That test was run **once, by hand, on 8/25**, and it found a total dead end in
the first minute of the game:

> "from a cold boot it went WATCH, GET UP, then DROP IN / CITY / DROP IN / CITY
> ten times and stopped. PHONE OPENED 0. JOB TAKEN 0. CLOCK 06:00 AT THE FIRST
> TAP AND 06:00 AT THE TWELFTH."

The cause was found and fixed properly. **The fix is not the finding, the test
is** — and it was never a gate, never repeatable, and nothing had run it since.
Nobody had asked what a second run would find. This is the second run, and every
run after it.

## WHAT SHIPPED

`gates/cold_hand_gate.js`, 6 checks, registered as COLD HAND. Served, not opened.

**Loudness is computed, not pointed at.** A test that needs a human to indicate
the loud thing is the one-off we already had. So: ink area first, then how far
the control's fill sits from the page behind it, with a cluster of controls
scored as one control because that is what an eye sees. **No text is matched
anywhere in it** — the moment a harness picks a button because it says GO, it
has stopped simulating somebody who does not know the game.

It asserts the hand can find something to press on the very first screen, that
pressing the loudest thing gets it into the walked world at all, **that the game
advances** — the exact assertion that was false on 8/25 — and **that it is still
advancing at the end, not only at the start.** It prints the full press trail
every run, so a future failure can be read rather than guessed at.

## *** THREE TIMES MY OWN HAND WAS THE BROKEN THING ***

The first three runs of this gate all reported the 8/25 dead end. **All three
were wrong.**

**1. Every button scored on its own.** The eight walk arrows came out at 44×44
each — quieter than one 104×31 information chip. Nobody looking at a phone sees
eight buttons where a d-pad is; they see a d-pad.

**2. Grouped by the parent's bounding box.** A column of four buttons spread
down the left edge measured 186×394 = **73,284px²** and beat the d-pad's
180×180 = **32,400** — on the *empty space between the buttons*. Empty space is
not loud. Summing the actual ink tells a tight cluster from a tall stack without
a special case for either.

**3. Pressed with a synthetic `el.click()`.** **The walk pad does not listen for
click** — it listens for pointer/touch, `startHold`/`endHold`. So the hand
mashed the d-pad thirty-eight times, the clock never moved, and it read exactly
like the historical dead end.

The third one is the dangerous one. **It produced a false positive that agreed
with a known historical bug**, which is the single easiest thing in this repo to
believe without checking — the finding was pre-written, the trail matched, and
every instinct said ship it. A harness that presses in a way no thumb presses is
not a thumb.

Tenth broken ruler on this lane in two weeks. The pattern has never varied: the
instrument agreed with the fear, and checking the instrument was the whole job.

## AND ONE ASSERTION THAT WAS WRONG ON ITS MERITS

The first loop check counted how many *different* controls the last twelve
presses touched, on the theory that the 8/25 bug was a two-button cycle. That is
the wrong proxy in both directions: **a stranger who has found the walk pad
presses one control for the rest of the session, and that is the game working
perfectly**, while a screen that cycles two buttons whose world advances on a
timer would sail through it.

Replaced with the thing the proxy stood for: **over the last twelve presses, on
their own, is the game still moving.** "It advanced once and then died" is the
failure, and that is what sees it. The distinct-control count is still printed,
as a number rather than a verdict.

## MUTATION PROOF

- Freeze the clock (`advance()` returns early) → **both advance claims red**.
- Make the walk pad unpressable (`pointer-events:none`) → **both red, and the
  trail reproduces the 8/25 shape exactly**: `blstack > dcgo > blstack > dcgo`,
  thirty-eight times, clock frozen at 06:00. The historical bug, caught by name,
  with the press trail printed underneath it.

## RESULT

    COLD HAND 6/0 (new) · ENEMIES EXIST 27/0 · STRANGER OPENS 18/0
    DEMO CURRENT 16/0

A cold hand today: `front > pad > dcgo > pad ×37`. It finds the front door, gets
into the world, clears the morning card, finds the walk pad, and walks. The clock
moves and keeps moving. **The screen is not broken.**

No game code changed. No approved pixel moved.
