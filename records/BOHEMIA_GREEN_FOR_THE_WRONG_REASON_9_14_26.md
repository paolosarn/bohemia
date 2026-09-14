# GREEN FOR THE WRONG REASON (9/14/26, LIFE + CITY lane)
## VAMILY row `[tap crash]` — ship test: green tap_picks on main

**The crash was already fixed. The gate was green anyway, and it was green for the wrong
reason — twice, on the row whose ship test is this gate being green.**

    TW=18   0/0    ->  15/16
    TW=30   flaky  ->  15/16
    TW=47   11/12  ->  11/12
    three consecutive runs, byte-identical

---

## THE CRASH WAS DONE. THE GATE WAS NOT.

`[base shadows]` (81208f49) fixed the exception: the picker now dispatches on what was
actually drawn, so a plate is asked for its pixel and a prism for its geometry, and
nothing reaches through an undefined image. I said then that the gate was still red at an
honest 0 of 0 and named the cause.

Coming back to it, the gate was **green** — and that was worse.

## SAME TREE, TWO RUNS, DIFFERENT ANSWERS

Nothing changed between these. Same commit, back to back:

    run 1    TW=18  0/0     TW=30  15/16    TW=48  11/12
    run 2    TW=18  0/0     TW=30   0/0     TW=48  11/12

**Both reported 6 pass / 0 fail.**

## THE RACE

    await fr.evaluate(t => { MODE='city'; TW=t; TH=t/2; panX=0; panY=0; render(); }, TW);

The game recomputes `TW` from `CZOOM` every frame and repaints. So the forced frame's
`CB_DREW` record was overwritten by the loop's before the census could read it — sometimes.
When the census lost the race it saw no plates, found nothing to tap, and scored 0/0.

This is the **third** time this lane has been bitten by driving the game with assignment,
and the first time it was my own checker doing it rather than my probe.

## AND THE ALIBI THAT LET ZERO PASS

Two legs quietly excused the zeros:

- **B1** required `BN >= 12` — a *total* across three zooms, so one healthy zoom could
  carry two empty ones.
- **B3**, the leg that says *"it holds at every zoom"*, filtered with
  `z.buildingsOf >= 5 &&` — **it answered "all of them" by dropping the ones it could not
  see.**

A leg that reports "every zoom" after excluding the zooms with no sample is not a weak
check, it is an **alibi**.

## WHAT SHIPPED

**The zoom is driven, not assigned.** `setZoomAt()` is the game's own control — it sets
`CZOOM`, derives `TW`, and calls `renderSoon()` — so the zoom survives the next frame and
the census reads a record the game actually drew. The zooms are asked for as `CZOOM`
fractions clamped by the game's own `zoomBounds()`, rather than as `TW` numbers the gate
invented.

**And it waits for art to be on the glass.** The hero plates load lazily, so an early
census legitimately sees none — a slow start, not a broken picker, and it must not be
reported as either.

**An empty or thin zoom now fails.** If this gate claims a zoom, that zoom carries a real
sample, and B1 additionally requires every zoom to pull its weight.

## THE MUTATIONS

| mutation | expected | result |
|---|---|---|
| break the picker (ground plane only — his original bug) | RED | **B1 + B3, 0 of 44** |
| make one zoom measure nothing — *the exact shape that used to pass* | RED | **B1 + B3, and B3 names the empty zoom** |
| revert to assignment-driving | — | **did not reproduce**, and that is the point: the old bug was a *race*, so it sometimes wins. A flake cannot be mutation-tested by re-introducing it; it is caught by making the empty result illegal. |

Mutation 2 is the one that matters. The state it creates — one zoom at 0/0 while the
others score 26 of 28 — is **exactly what the old gate reported 6 pass / 0 fail on**.

## THE STANDING NOTE

**A FLAKY GATE IS NOT A GATE THAT SOMETIMES FAILS. IT IS A GATE THAT SOMETIMES MEASURES
NOTHING AND CALLS THAT PASSING.** Nobody would have caught this from the output: it said
six green every single time, and the three numbers beside it looked like a result rather
than a coin toss. It only showed up because I ran it twice in a row on an unchanged tree
for an unrelated reason.

The cheap habit that finds this class: **run a gate twice before you trust it green**, and
make an empty measurement a failure rather than a skip. A checker that can return "I saw
nothing" has to say so out loud, because silence and success look identical in a pass
count.

---

    tap_picks_gate   green and FLAKY  ->  green and deterministic, 3 runs identical
    TW=18            permanently 0/0  ->  15/16
    legs             an empty or thin zoom now FAILS instead of being skipped
    slices/          untouched this round; the crash fix was 81208f49
    demo             NOT re-cut (rule 14a)
