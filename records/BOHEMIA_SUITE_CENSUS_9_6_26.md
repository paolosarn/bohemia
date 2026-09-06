# BOHEMIA -- WHERE THE SUITE'S TIME GOES (9/6/26)

PLUMBER lane, VAMILY row [suite runs] SUITE-FINISHES. The row's first clause is
"measure every gate's time" and nobody had. The runner has printed a per-gate time
on every line for weeks; nothing ever added them up.

Taken from a real run (suite2.log), joined to the gate table, and classified BY THE
RUNNER'S OWN predicates rather than a second opinion that could drift from the
scheduler it is describing.

## THE SHAPE OF IT

  gates in the table            532
  gates with a time in this run 336          (196 had none in this log)
  total gate time               80.2 min
  observed wall clock           33.8 min

  browser gates      99 gates   65.0 min of work
  pure gates        236 gates   14.8 min of work
  solo gates          1 gates   0.4 min of work

## AND THE WALL IS ONE LANE

A suite's wall clock is not the sum of its gates. It is the widest lane divided by
that lane's slots, or the single longest gate, whichever is worse.

  the browser lane   65.0 min of work over 3 slots  =  21.7 min
  the pure lane      14.8 min of work over 4 slots  =  3.7 min
  the solo phase     0.4 min, which cannot overlap anything by design
  the longest single gate: OPENING (7.4 min)

  THE FLOOR THESE SETTINGS CAN REACH: 22.0 min
  THE ROW'S TARGET:                    10.0 min

65.0 min of the work is in 99 browser gates and they run a few at a time. Nothing that
happens to the other 237 gates can move that.

## WHAT MOVING THE BROWSER SLOTS WOULD DO

    2 browser slots -> 32.9 min
    3 browser slots -> 22.0 min
    4 browser slots -> 16.6 min

EVEN AT FOUR SLOTS THE FLOOR IS ABOVE THE TARGET. This is the finding that matters:
the ten-minute target CANNOT be reached by scheduling on a 4-core box. 65.0 min of
browser work over four cores is 16.3 min and no arithmetic gets under it. The remaining
path is the row's other two clauses -- SPLIT the slow ones and RETIRE the dead ones
-- which means less browser work, not better packing.

## AND ONE COST THAT IS NOT SCHEDULING AT ALL

38 gates failed in this run, and every one of them was RE-RUN ALONE afterwards,
because the suite may not invent a red. That is correct and it is not free: charged
at each red gate's own in-pack time it is 8.3 min of pure overhead.

It is the only line in this record that gets cheaper by FIXING THE GAME instead of
by moving a scheduler setting, and it is why the observed wall clock (33.8 min) sits well
above the floor (22.0 min).

## THE FIFTEEN SLOWEST

    441.8s  browser  OPENING
    429.3s  browser  FACTION ARC
    155.4s  browser  COMMITMENT
    122.3s  pure     GRAVEYARD
    121.3s  pure     SCALE TRUTH
    116.3s  browser  CARD FOLD
    109.6s  browser  THE RUN
    103.0s  browser  ALIVE
     97.9s  browser  FIGHT MUSIC
     95.0s  pure     WORLD MODEL
     90.0s  browser  WHAT YOU HEARD
     89.9s  browser  ONE ENGINE
     86.4s  browser  COLD OPEN
     75.5s  browser  FEEDBACK
     71.0s  browser  WALKED SURFACE

168 gates finish in under a second.

## WHAT CHANGED THIS ROUND

  A SOLO TIER. Gates whose subject is time (frames a second, milliseconds per beat,
  time to first play) now carry __BOHEMIA_SOLO__ and run one at a time with the box
  to themselves, first, before the pool starts. A stopwatch held beside three other
  gates measures the box, not the game -- this runner already had to re-run FIGHT
  MUSIC and FIRST NIGHT alone to find out they were green.
  AND THAT IS WHAT LET THE POOL GO WIDER. Browser slots moved from half the cores
  to three quarters. That was safe only once the timing gates were fenced off.

## WHAT IS STILL OWED

  - SPLITTING THE GIANTS. The longest single gate is OPENING at 442s; while any one gate
    takes that long it is the floor on its own.
  - RETIRING DEAD ONES. That is the next row, [dead gates] GATE-CENSUS, and it is
    the other half of getting under ten minutes.
  - 196 gates had no time in this log at all, so every total here is a LOWER BOUND.

Refresh with: `python3 gates/bohemia_suite_census.py <a real suite log> --record`
