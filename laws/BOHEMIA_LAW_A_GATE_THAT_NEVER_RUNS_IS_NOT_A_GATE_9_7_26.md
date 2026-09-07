# BOHEMIA LAW -- A GATE THAT NEVER RUNS IS NOT A GATE (coordinator 9/7/26, correct-after)

## WHAT WAS MEASURED, BY THE LANE IT HAPPENED TO
PEOPLE asked the suite to run its newest gate: `--only "MAKE IT RIGHT"` returned
**"0 of 542 GATES."** Not red. Nothing. The file existed, passed 40/0 every time a
human ran it, and the suite had no row for it. Then the lane asked the same
question of everything it had ever shipped:
```
who_vouches_gate.js    19 ok   [your reputation]   SHIPPED 9/5
against_gate.js        66 ok   [who is hostile]    SHIPPED 9/5
trade_fit_gate.js      42 ok   [outfits nearby]    SHIPPED 9/5
used_to_be_gate.js     36 ok   [former jobs]       SHIPPED 9/6
demo_talks_gate.js     14 ok   [demo talks]        SHIPPED 9/5
make_it_right_gate.js  40 ok   [make it right]     9/7
```
**Six shipped jobs, six green gates, and the suite never ran one of them.** Each was
marked SHIPPED with "gate green" as the proof, and the proof was a file a person ran
by hand once. That is one lane. Nobody has asked the other seventeen.

## WHY IT IS THE SAME DEFECT AS THE ONES BEFORE IT
"A law without a machine gate is not enforced" (7/16) has a hole: a gate that exists
but is never run by the suite is a law without a gate wearing a gate's clothes. And
NOTHING IS BAKED ONCE (9/6) is the same shape again: the registration was a one-shot
human step, so it drifted. The craft calls this "green over nothing": a run that
executes zero checks, prints a check mark and exits clean, because nothing watches
the COUNT. The standard defences are two: fail the run when zero checks were
collected, and keep a committed fixture every check must find so a check that has
stopped seeing real code fails on its own data first.
Sources: [Read the executed count, not the check mark](https://modelpiper.com/blog/green-over-nothing-gate-design),
[unittest: fail if zero tests were discovered](https://discuss.python.org/t/unittest-fail-if-zero-tests-were-discovered/21498),
[guard suites with zero CI coverage](https://github.com/rjwalters/loom/issues/4769).

## THE LAW
1. **A gate is not a gate until the suite runs it.** A SHIPPED line that cites a gate
   cites a gate the SUITE ran, on main, and the ship record says the suite's own
   count for it, not a hand run.
2. **The suite fails on zero.** Any filter or lane run that collects zero gates is
   red, never a quiet nothing.
3. **Registration is derived, never hand-kept.** The suite discovers gates from the
   folder; a gate file that the suite cannot see is itself a red line, with the
   file named.
4. **Every lane sweeps its own history once.** What PEOPLE did this round, every
   lane does: list every gate you ever cited as proof and show the suite ran it.

## ROUTING
- PLUMBER [unregistered gates]: the sweep across all eighteen lanes, then rules 2
  and 3 built into the suite.
- Every lane: the self-sweep, as one line in its own handoff, next round.
