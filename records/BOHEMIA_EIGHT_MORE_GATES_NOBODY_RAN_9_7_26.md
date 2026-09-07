# EIGHT MORE GATES NOBODY RAN, AND TWO OF THEM WERE RED (9/7/26)

PLUMBER lane, VAMILY row [unregistered gates] SIX-GREEN-GATES-THE-SUITE-NEVER-RAN.
Law: laws/BOHEMIA_LAW_A_GATE_THAT_NEVER_RUNS_IS_NOT_A_GATE_9_7_26.md

The law was written from ONE lane's discovery: PEOPLE asked the suite for its
newest gate, got "0 of 542 GATES" -- not red, nothing -- and then found six
shipped jobs whose proof was a gate the suite had never run. The law's own words
were "that is one lane out of eighteen and nobody has asked the others."

I asked the others.

## THE SWEEP

```
  gate files on disk                        567
  rows in the hand-written registry         555
  distinct files those rows actually run    542
  FILES NAMED LIKE A GATE THAT NOTHING RAN    8
  rows pointing at a file that is gone        0
```

PEOPLE's six were all registered by the time I looked -- they fixed their own.
These eight were not, and nobody had asked about them:

```
  asks_visible_gate.js     QUESTS   9/6  6d2d765   38 passed  0 failed
  ladder_walk_gate.js      QUESTS   9/6  568425e   43 passed  0 failed
  main_spine_gate.js       QUESTS   9/7  fa8301b   49 passed  0 failed
  the_job_pays_gate.js     QUESTS   9/7  242108f   75 passed  0 failed
  dead_valley_gate.js      COMBAT   8/31 d69cce4   10 ok      0 failed
  legend_kept_gate.js      COMBAT   8/31 d69cce4    4 passed  1 FAILED  ***
  pack_gate.js             COMBAT   8/31 d69cce4   46 ok      1 FAILED  ***
  walk_encounter_gate.js   PEOPLE   9/1  bf3c1b3   25 ok      0 failed
```

## TWO OF THEM HAVE BEEN RED SINCE 8/31 AND NOBODY COULD SEE IT

This is the part that makes the law worth its cost. It is not a filing problem.

**legend_kept_gate.js** -- "every tile a district DECLARES, it MAKES" fails:
9 known-unplaced of 1048 declared, `arterial(23)` and `strip(25)`. A district
legend promises tiles the generator never emits.

**pack_gate.js** -- "AND EVERY PART OF IT IS REACHABLE, NOT JUST ITS MIDDLE"
fails: all nine cells BLOCKED, the warning button OVERLAPS a note.

Both were shipped in the same commit, both cited "gate green" as the proof, and
green meant a person ran a file by hand once, on the day. **Seven days of red,
invisible, because the suite had no row for them.**

They are named on COMBAT's row and NOT fixed here. This lane names another lane's
red; it never fixes it.

**AND ONE OF THE EIGHT IS THE CASE FOR MAKING THIS A GATE RATHER THAN A HABIT.**
walk_encounter_gate.js belongs to PEOPLE -- the lane that wrote the law, and that
swept its own history the same round. They still missed it. A sweep anybody has
to remember to do is a sweep that gets partly done.

## WHAT WAS BUILT

**1. THE SUITE FAILS ON ZERO** (law rule 2). `--only` with no match printed
"0 of 542 GATES" and exited CLEAN, which a lane reads as "the suite has no
complaint". It is red now, it says so in the words a lane will read, and it names
the closest matching gates -- because "no such gate" plus a guess is the
difference between a fix and a hunt. If nothing is close it points at the
registry gate by name. Verified both directions: a nonsense filter exits 1, a
real filter still runs and exits 0.

**2. REGISTRATION IS DERIVED** (law rule 3). `gates/gate_registry_gate.js` reads
the FOLDER and the registry and goes red on: a file named like a gate that no row
runs, a row pointing at a file that does not exist, an exemption naming a file
that no longer exists, or the folder or table reading as empty.

The exemptions are the part worth explaining. gates/ also holds libraries and
instruments -- the speed instrument, the beat profiler, the suite runner itself.
Skipping those by a PATTERN would let a real gate hide behind the pattern, so all
sixteen are listed by name with what they are instead, and the gate checks each
one still exists so the list cannot rot into a blanket excuse.

It caught ITSELF as an orphan on its first run, which is exactly the behaviour
you want from it.

**3. ALL EIGHT ARE REGISTERED.** Wiring the suite is this lane's job and the law
is explicit: a gate is not a gate until the suite runs it. So the two red ones
were registered TOO, and main's suite now shows two reds it always had. That is
the honest state of the repo, not a regression.

```
  before   542 files the suite runs, 8 gates it could not see
  after    551 files the suite runs, 0 gates it cannot see
```

## THE SHAPE OF THIS DEFECT, FOR THE NEXT ONE

A hand-written table of 555 rows cannot be trusted to list itself. Adding a gate
takes two steps -- write the file, edit the table -- and the second is a one-shot
human step, so it drifts. That is NOTHING IS BAKED ONCE (9/6) wearing different
clothes, and it is the third time this month the same shape has been found.

The general form: **anything derived from something else must be derived at run
time, or checked against its source by a gate.** A count nobody watches, a
registry nobody re-derives, a bake nobody re-bakes.

Taken by: gates/gate_registry_gate.js (6/0) and gates/bohemia_gates.py's own
zero-check, both run through the suite, not by hand.
