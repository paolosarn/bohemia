# E22 [never ran] ROUND ONE, SCHOOL: HALF OF THIS ROW IS ALREADY BUILT, AND THE OTHER HALF HAS NO DATA AT ALL

EYES AND EARS, lane 17, E22 round one of two. 9/24/26. MODE: SCHOOL THEN CHECK, so nothing is
built this round.

THE ROW: *"the suite cannot finish (589 gates, 198 never ran last round, 53 red, 32 never
re-checked). School first: how big suites report coverage honestly... then the check: a standing
list, every ship, of gates that did not run and gates whose red was never re-checked, handed to
PLUMBER."*

---

## THE PREMISE FIRST (rule 12), AND IT HAS MOVED TWICE

**"198 never ran" is ten rounds old.** The last posted SUITE LINE (9/14, ad23d875) reads 632 gates
ran, 525 green, 107 red, **0 never ran**, 12,925 s of gate work, floor 71.3 minutes at a box speed
of 0.89x. PLUMBER's rows since then say how that happened: the runner was taught to shard, to name
what it skipped, and to refuse to call an unfinished run a pass.

**And the runner already does most of what this row's first half asks.** Read rather than assumed,
in `gates/bohemia_gates.py`:

- the budget stops DISPATCH, not execution: a gate already running is allowed to finish, because
  cutting it mid-sentence turns a real verdict into silence
- every gate never started is collected and **named** in an unrun list
- an unrun gate "has held nothing, so a run with unrun gates is NEVER a pass": it prints
  `N GATE(S) NEVER RAN`, then `NOT GREEN AND NOT RED: UNFINISHED`, then the names
- it computes the shard count it would have needed from its own measured rate

So the honest shape of this row is not "build a never-ran report". It is: **check that report is
true, and build the half nobody has.**

---

## THE HALF NOBODY HAS: A RED'S AGE

The row's second clause is *"gates whose red was never re-checked."* Nothing in this repo can
answer that, and the reason is simple: **no per-run history is stored.** The only artefact of a
full run is `records/BOHEMIA_SUITE_CENSUS_9_6_26.json`, and it holds aggregates from one log
(observed wall seconds, box speed, gates in the table, gates with a time, the floor), not a row
per gate per run. So nobody can say when a red first appeared, whether it has been red every run
since, or whether anyone has looked at it once.

That matters here more than it would anywhere else, because this fleet has already been bitten by
exactly this: FACTION ARC sat inside the red count for weeks while being killed at the cap, so it
was RED OVER 102 REAL GREENS and nobody could see the difference from the outside.

---

## WHAT THE WORLD DOES, AND THE THREE RULES WORTH STEALING

**1. A TEST THAT CANNOT RUN HAS NOT PASSED.** The published failure mode is exact: a suite that
skipped a case, recorded neither pass nor fail and exited 0 is indistinguishable from one that ran
everything, so a test written to catch a regression contributes nothing in the only environment
that gates a merge. The standard answer is to report `collected / passed / skipped / failed` with
the skip reasons grouped, and to make the skip count **load-bearing**: a floor like
`--max-skipped N` that fails when coverage silently vanishes. Our runner already refuses to say
ALL GREEN with unrun gates; what it does not have is a RATCHET on that number.

**2. A FAILING TEST STAYS A FAILURE UNTIL IT IS EXPLAINED.** Quarantine is the published way to
keep a red from training a team to ignore red builds, and the load-bearing part is not the
quarantine, it is the **expiry date**: an entry that expires turns neglect into a pipeline
failure. A cap on how many may be quarantined at once, with a new entry requiring an old one to be
resolved, is the other half. We have a QUARANTINE concept on the front page (rule 13) with nothing
on the list and no expiry.

**3. DO NOT CALL A FAILURE FLAKY BECAUSE ONE RERUN PASSED.** The published rule is a pass-rate
history across runs keyed by commit, not a single retry. This lane has already made that mistake
in the other direction and written it down: SOUNDS' fight-music gate gave a fail, a different
fail, and a pass on one unchanged tree, and the honest answer was to pin the seed, not to rerun
until green.

---

## AND THE KEY ROUND TWO NEEDS IS PROVED STABLE, WHICH I DID NOT EXPECT

A history keyed on a gate's NAME is only worth building if names hold still. Measured against the
9/14 census:

```
  gate names in the 9/14 census      598
  gate names in the table today      712
  survived, character for character  598   (all of them)
  disappeared                          0
  new since                          114
```

**Not one name changed in ten rounds.** So a name is a sound key, and the 114 births are the
fleet adding checks, which is the system working.

**AND MY FIRST COUNT SAID TWO NAMES HAD DISAPPEARED, WHICH WAS MY PATTERN AND NOT THE REPO.** It
read gate names with a regex that allowed only capitals, so `NO BULLSHIT Qs` (a lowercase s) and
`PLACEHOLDER #` (a hash) came back as deaths. Both are still in the table. I found it by doing the
thing this lane always does before publishing: look at the outliers by hand. Two rows of a table
are cheap to check and they were the whole finding.

## WHAT ROUND TWO BUILDS, WRITTEN DOWN NOW SO IT CANNOT DRIFT

1. **A HISTORY FILE, WRITTEN BY ME, PARSED FROM THE RUNNER'S OWN OUTPUT.** One row per gate per
   run: name, status, seconds, box speed, sha, when. It parses the log the runner already prints,
   so **PLUMBER's runner is not touched** -- the suite is that lane's, and a checker that needs
   another lane's tool changed is a checker that does not ship.
2. **THE STANDING LIST**, posted every round beside the stranger's list: gates that did not run,
   and for every red, HOW LONG IT HAS BEEN RED and WHEN IT WAS LAST RE-CHECKED.
3. **RULE ZERO**: a planted history where a gate is red in three runs and green in the fourth must
   read "last re-checked at run four"; a gate absent from the last run must read "never ran", not
   "green"; and a history with one run must refuse to answer the age question at all rather than
   answer it with a guess.
4. **THE NUMBER THAT MATTERS TO HIM IS NOT THE COUNT**, it is whether the reds are being looked
   at. A red that is a week old and never re-run is a different animal from a red that failed an
   hour ago.

## AND I STARTED A FULL RUN, WHICH IS STILL GOING, AND I AM NOT POSTING A NUMBER OFF IT

The front page has been asking for a fresh SUITE LINE since 9/14, so this round started a complete
run with the budget raised to two hours (a run killed at the default budget cannot tell you what
would never run; a complete one can tell you both, because every line carries its own seconds).

**It is still running as this record is written, and a partial run is not a suite line.** What can
be said honestly:

```
  gates in the table now                     712   (598 of them by the same names as 9/14, plus 114 new)
  gates finished when this was written       118
  of those                                    66 green, 52 red
  gate work spent so far                    69.1 minutes
  slowest so far   FIGHT MUSIC 156.2 s, GRAVEYARD 122.6 s, VISTA EXIT 114.7 s, PAD RING 114.1 s
```

A 44% red rate in the first 118 is NOT the fleet's red rate: these are the solo and early gates,
not a random sample, and the run is in a throwaway worktree. **I checked that confound rather than
waving at it**: REPO BUDGET, one of the reds, gives 6 passed / 1 failed in the throwaway tree and
6 passed / 1 failed in the real checkout, so for that gate the worktree is not the cause. One
sample is not a proof for 52, which is exactly why the count above is written as a partial and not
posted as THE SUITE LINE. Round two finishes the run and posts it with a box speed beside it
(0.99x when this started).

## BLIND SPOTS, STATED

I have not measured how much of the 107 red at 9/14 is still red, because that needs the run this
round is making. Whether a gate's name is stable enough to key a history on is unproven: a renamed
gate would read as one gate dying and another being born. And a run made with a raised budget
answers "what is the floor" but not "what does a lane see at the default", so both numbers have to
come out of the same run.
