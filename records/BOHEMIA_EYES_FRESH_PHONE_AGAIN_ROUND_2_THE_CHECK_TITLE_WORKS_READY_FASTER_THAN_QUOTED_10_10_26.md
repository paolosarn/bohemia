# EYES AND EARS -- [a fresh phone judged again] -- ROUND TWO: THE CHECK
### 10/10/26 -- session eyes-5vql33

Row: after RUN's [a fresh phone sees the door] shipped, re-walk a wiped phone and time the real
title paint, NEW GAME lit, and the first tap through it, beside PLUMBER's own numbers (the title
2.8 s, NEW GAME 67 s at 4x). Round one (records/BOHEMIA_EYES_FRESH_PHONE_AGAIN_ROUND_1_SCHOOL_THE_INSTRUMENT_ALREADY_EXISTS_10_10_26.md)
found PLUMBER's own instrument already covers fcp/title/buttons/ready correctly; this round reuses
it and adds the one real gap, the first tap.

## THE HEADLINE: A WIPED PHONE SEES THE REAL TITLE NOW, CONFIRMED ON THE GLASS

The whole reason this row exists: this lane's own earlier walk this same day
([a stranger's five minutes judged]) found a wiped phone skipping straight into a mid-game city in
about two seconds, no title, no picks -- a named violation of two locked rules. This round's first
screenshot is the direct answer: a real title screen, "BOHEMIA / POST-ECONOMIC APOCALYPSE - LAS
VEGAS," a night skyline with power lines, NEW GAME / CONTINUE ("NO RUN SAVED," correctly greyed for
a true wiped phone) / SETTINGS. Tapping NEW GAME led to a real picks screen -- fight difficulty,
starting shelves, two crew backgrounds to swipe between, a crew name field, a 5-of-5 loading bar,
BEGIN lit. The fix holds on a genuinely fresh, untouched boot, not just on RUN's own walk.

## THE REAL NUMBERS

Using PLUMBER's own ARM (tools/bohemia_first_load.js, imported unmodified -- the real
PerformanceObserver on the browser's own `first-contentful-paint` entry, not an estimate), at the
same 4x CPU throttle PLUMBER's own numbers used:

| stage | this round | PLUMBER's quoted number |
|---|---|---|
| first contentful paint (fcp) | 4,448 ms | not separately quoted |
| title visible | 3,375 ms | 2.8 s |
| menu buttons visible | 5,225 ms | not separately quoted |
| NEW GAME ready (`__LOAD_READY`) | 48,406 ms | 67 s (after four load-hunk fixes; 85 s before them) |
| first tap latency (NEW GAME press to the title visibly answering) | 2 ms | not previously measured |

TWO THINGS WORTH NAMING PLAINLY, NOT GLOSSED OVER:

1. **`ready` came in faster than PLUMBER's own last quoted number (48.4 s against 67 s), and the
   board's own text still lists "the six load hunks" as NOT YET SHIPPED** ("NEXT FOR RUN: the six
   load hunks (NEW GAME from 67 s)"). This is a real, measured gap between what this round found and
   what the board currently says, not explained away: it could be ordinary run-to-run variance
   (network/cache conditions, machine load), or genuine incremental improvement already present in
   main that the board text has not caught up to. Reported honestly as measured, not asserted as
   proof the load-hunks work is already done.
2. **`fcp` (4,448 ms) fired AFTER `title` was already visible (3,375 ms)**, which is backwards from
   the usual expectation that first contentful paint happens at or before other visible content.
   A real observation, not explained away by a guess -- worth whoever owns the title's own paint
   sequence (RUN) taking a look, since it suggests the browser's own FCP trigger is landing on
   something painted after the title itself, not the title's own first pixels.

THE GOOD RESULT, CLEAN: once `ready` is true, the first real tap on NEW GAME gets an answer in 2 ms
-- input-to-next-paint, the FID-shaped number round one's school scoped this to. Interactivity, once
reached, is immediate; the whole wait is in getting to `ready`, not in the game being sluggish once
there.

## THE RECORD

Two real screenshots: records/eyes_fresh_phone_again/1_title.png (the title, build stamp "DEMO -
BUILD 10/10i - THE DEMO BOOTS LIGHT" visible in frame) and 2_after_tap.png (the real picks screen,
BEGIN lit). Full numbers: records/eyes_fresh_phone_again/report.json.

## ROUTED

- RUN: the fcp-after-title ordering, a real anomaly in the paint sequence, worth a look.
- RUN / PLUMBER: the `ready` gap (48.4 s measured here against 67 s last quoted on the board,
  with the load-hunks work still marked not-shipped) -- named for whoever re-measures next, not
  resolved here.

## SHIP TEST FOR THIS ROUND

A real instrument, reusing PLUMBER's own proven ARM unmodified and extending it with exactly the
one piece round one found missing (the first tap, on the exact button selector
tools/bohemia_through_the_title.js already proves works), walked a genuinely fresh phone end to end
and confirmed on the real screenshot that the headline bug this lane found earlier today is fixed:
a wiped phone sees the title, not a mid-game city. Real numbers posted for every stage the row
asked for, including the one PLUMBER's own tool never measured (first-tap latency, 2 ms). Two real
discrepancies from the board's own prior numbers are named plainly rather than smoothed over.
[a fresh phone judged again] IS ANSWERED.
