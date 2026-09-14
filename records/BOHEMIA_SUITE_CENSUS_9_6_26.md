# BOHEMIA -- WHERE THE SUITE'S TIME GOES (9/6/26)

PLUMBER lane, VAMILY row [suite runs] SUITE-FINISHES. The row's first clause is
"measure every gate's time" and nobody had. The runner has printed a per-gate time
on every line for weeks; nothing ever added them up.

Taken from a real run (full3.log), joined to the gate table, and classified BY THE
RUNNER'S OWN predicates rather than a second opinion that could drift from the
scheduler it is describing.

## THE SHAPE OF IT

  gates in the table            632
  gates with a time in this run 558          (74 had none in this log)
  total gate time               215.4 min
  observed wall clock           123.3 min

  browser gates     291 gates   193.4 min of work
  pure gates        263 gates   18.3 min of work
  solo gates          4 gates   3.8 min of work

## AND THE WALL IS ONE LANE

A suite's wall clock is not the sum of its gates. It is the widest lane divided by
that lane's slots, or the single longest gate, whichever is worse.

  the browser lane   193.4 min of work over 3 slots  =  64.5 min
  the pure lane      18.3 min of work over 4 slots  =  4.6 min
  the solo phase     3.8 min, which cannot overlap anything by design
  the longest single gate: TIME TO PLAY (10.0 min)

  THE FLOOR THESE SETTINGS CAN REACH: 68.2 min
  THE ROW'S TARGET:                    10.0 min

193.4 min of the work is in 291 browser gates and they run a few at a time. Nothing that
happens to the other 267 gates can move that.

## WHAT MOVING THE BROWSER SLOTS WOULD DO

    2 browser slots -> 100.5 min
    3 browser slots -> 68.2 min
    4 browser slots -> 52.1 min

EVEN AT FOUR SLOTS THE FLOOR IS ABOVE THE TARGET. This is the finding that matters:
the ten-minute target CANNOT be reached by scheduling on a 4-core box. 193.4 min of
browser work over four cores is 48.3 min and no arithmetic gets under it. The remaining
path is the row's other two clauses -- SPLIT the slow ones and RETIRE the dead ones
-- which means less browser work, not better packing.

## AND ONE COST THAT IS NOT SCHEDULING AT ALL

93 gates failed in this run, and every one of them was RE-RUN ALONE afterwards,
because the suite may not invent a red. That is correct and it is not free: charged
at each red gate's own in-pack time it is 50.4 min of pure overhead.

It is the only line in this record that gets cheaper by FIXING THE GAME instead of
by moving a scheduler setting, and it is why the observed wall clock (123.3 min) sits well
above the floor (68.2 min).

## THE FIFTEEN SLOWEST

    600.1s  browser  TIME TO PLAY
    557.7s  browser  FACTION ARC
    405.5s  browser  OPENING
    184.4s  browser  WHAT YOU HEARD
    162.9s  browser  PEOPLE
    160.9s  browser  COMMITMENT
    136.0s  browser  CARD FOLD
    129.0s  browser  SFX WIRED
    127.8s  browser  FACTION TOWNS
    107.4s  browser  ART ARRIVES
    104.1s  pure     CANVAS SCALE
    103.2s  browser  CLIP HEALTH
    102.2s  pure     GRAVEYARD
    101.7s  browser  PEOPLE GATHER
     99.9s  browser  VOICE SURFACES

202 gates finish in under a second.

## WHAT CHANGED THIS ROUND

  A SOLO TIER. Gates whose subject is time (frames a second, milliseconds per beat,
  time to first play) now carry __BOHEMIA_SOLO__ and run one at a time with the box
  to themselves, first, before the pool starts. A stopwatch held beside three other
  gates measures the box, not the game -- this runner already had to re-run FIGHT
  MUSIC and FIRST NIGHT alone to find out they were green.
  AND THAT IS WHAT LET THE POOL GO WIDER. Browser slots moved from half the cores
  to three quarters. That was safe only once the timing gates were fenced off.

## WHAT IS STILL OWED

  - SPLITTING THE GIANTS. The longest single gate is TIME TO PLAY at 600s; while any one gate
    takes that long it is the floor on its own.
  - RETIRING DEAD ONES. That is the next row, [dead gates] GATE-CENSUS, and it is
    the other half of getting under ten minutes.
  - 74 gates had no time in this log at all, so every total here is a LOWER BOUND.

Refresh with: `python3 gates/bohemia_suite_census.py <a real suite log> --record`
