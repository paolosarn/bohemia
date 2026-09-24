# E22 [never ran] ROUND TWO: A RED NOW HAS AN AGE, AND A FILTERED RUN IS NOT COVERAGE

EYES AND EARS, lane 17, E22 round two of two. 9/24/26.
School: records/BOHEMIA_EYES_E22_ROUND_1_SCHOOL_A_RED_WITH_NO_AGE_9_24_26.md

THE ROW: *"a standing list, every ship, of gates that did not run and gates whose red was never
re-checked, handed to PLUMBER."*

---

## WHAT SHIPPED

`tools/bohemia_eyes_gate_history.py`, six planted controls, and the first history file this repo
has ever had: `records/BOHEMIA_EYES_GATE_HISTORY.jsonl`, one row per run.

**It parses the runner's own printed output and touches nothing of PLUMBER's.** The suite is that
lane's; a checker that needs another lane's tool changed is a checker that does not ship.

The first standing list, off three real runs:

```
  runs ingested                                    3
  gates in the table                             713
  coverage measured on                  full-killed-9-24a  (a run that DID NOT FINISH)
  gates with no verdict there                    573   never reached: unknown, never green
  gates whose NEWEST KNOWN VERDICT is red         69   1 red three runs running, 3 red twice, 65 red once
  gates in the table and in no run at all        570
```

---

## THE THREE THINGS IT REFUSES TO SAY

**1. A FILTERED RUN IS NOT COVERAGE, AND MY FIRST CUT SAID IT WAS.** Fed a `--only BUDGET` run,
the tool announced *"NO VERDICT IN THE NEWEST RUN: 709, the run FINISHED and these were never
started"*. That reads as 709 checks skipped for lack of time and it is simply false: 709 were
never SELECTED. The three cases are told apart exactly now, off the runner's own output:

```
  complete + a NEVER RAN line                       the runner's own unrun list, real
  complete + no NEVER RAN line + fewer than the table   FILTERED (--only / --shard)
  not complete                                      KILLED, and the rest were never reached
```

and the "what has no verdict" question is asked of **the newest run that tried everything**, named
in the output, never of a filtered one.

**2. A RED COUNT FROM ONE RUN IS NOT THE FLEET'S RED COUNT.** The reds are every gate whose
NEWEST KNOWN verdict is red, each carrying the run that verdict came from, so a four-gate run
cannot announce "4 red" and have it read as the state of 713.

**3. ONE RUN IS NOT A HISTORY.** With a single run every streak would read 1, which looks like
"every red is fresh". The tool refuses the age question outright until there are two.

---

## RULE ZERO: SIX PLANTED HISTORIES

```
  red, red, red, then green            the gate leaves the red list entirely      ok
  red three times, then not reached    NO VERDICT, never green, age NOT reset     ok
  one run only                         the age question is REFUSED                ok
  green then red then red              streak 2, and it names the last green run  ok
  a full run then a filtered one       coverage comes from the FULL one           ok
  in the table, in no run ever         named separately, not counted as green     ok
```

The fifth is the control for the false 709, added the moment real data produced it.

---

## AND A KILLED RUN IS WORTH SOMETHING NOW

The full run I started last round died at gate 153 of 712 when the container restarted, so the
runner never reached its summary and the run left **no record at all**. That is the commonest kind
of run here. Ingested, it is 140 verdicts with times, and every gate it never reached is recorded
as unknown. **66 of its 140 are red**, and those 66 now have a first date rather than being
invisible until somebody finishes a full pass.

**I did NOT publish that as a red rate**, and the reason is measured rather than assumed: those
140 are the solo and early gates, not a sample.

**AND I NEARLY REPORTED A HANG THAT NEVER HAPPENED.** The run's log stopped at 05:16 and a process
check said the suite was still alive sixteen hours later, which reads as one gate hung forever.
Both halves were wrong: the container had restarted, and my process check was matching MY OWN
command line, which contains the runner's name -- the third time this lane has been caught by that
exact trick. The runner does have a per-gate timeout (`communicate(timeout=GATE_CAP)`, 600 s, and
it kills the whole process group, which PLUMBER wrote up when it found the same thing). A hang
would have been a real finding and it would have been false.

## WHAT THIS IS NOT

It is not a gate. The row asked for a standing list handed to PLUMBER, and a gate that fails on a
red count would just be the suite again, one layer out. It runs when this lane runs, the list goes
on the front page beside the stranger's list, and it costs nothing to keep.

## BLIND SPOTS, STATED

The history starts now, so 570 gates have no verdict in it at all and the ages only become real
from the second full run. A renamed gate reads as one gate dying and another being born; names
were measured stable (598 of 598 over ten rounds) but a rename would still need a hand. And the
red ages here are counted in RUNS, not in hours, because runs are what a gate actually lives
through.

## PROOF

- `tools/bohemia_eyes_gate_history.py --controls`, six planted histories
- `records/BOHEMIA_EYES_GATE_HISTORY.jsonl`, three runs: one killed full pass and two real
  `--only` runs made this round
- the standing list is reproduced with `--list`
