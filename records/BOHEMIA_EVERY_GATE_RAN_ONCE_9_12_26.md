# EVERY GATE RAN, ONCE, AND THE FLOOR IS SEVENTY-ONE MINUTES
## PLUMBER lane, 9/12/26, VAMILY row [suite runs] THE-SUITE-CANNOT-FINISH-AND-198-GATES-NEVER-RAN

## THE SHORT VERSION

**All 593 gates ran in one pass for the first time.** Nobody had that before, because
the budget always cut the run off part-way and the missing gates were the slow ones.

With every gate finally timed, the honest arithmetic is:

```
  593 gates          500 GREEN     93 RED
  13,001 s of gate work on the timed gates alone   (216.7 min)
  FLOOR on this 4-core box, perfectly packed:      71.0 min
  BUDGET:                                          45.0 min
  TARGET the row wants:                            10.0 min
```

**The suite cannot fit its own budget on this box, and sharding cannot change that.**
Sharding splits one 71-minute run into several runs; the total box time stays 71
minutes. The only two levers are less browser work or more machines.

## THE NUMBER WAS HIDDEN BEHIND A STALE CENSUS

The floor is computed by `gates/suite_finishes_gate.py` from a census of a real run.
That census was built on 9/6 from a **truncated log** — a run that stopped early and
therefore never saw the slowest gates.

```
  what the stale census said      floor 1,322 s   =  22 min    looked comfortable
  what the complete run says      floor 4,261 s   =  71 min    58% over budget
```

**It was wrong by 3.2x, in the flattering direction.** A census taken from a run that
could not finish describes only the gates that are fast enough to be seen, which is
the most biased sample available. That is `NOTHING IS BAKED ONCE` again, in the one
file whose whole job is to say whether the suite is healthy.

The census is refreshed from the complete run. `suite_finishes_gate` is now red for
the true reason instead of red for a stale input, which is the improvement.

## TWO CLAUSES OF THE ROW WERE ALREADY BUILT

The row asks for three things in order. Checking the runner instead of trusting the
row, as of this round:

1. **"Shard the suite so every gate runs every time"** — `--shard i/n` already exists,
   interleaved so no shard inherits every browser gate, with a gate that counts the
   union and the multiplicity against a full run rather than trusting the arithmetic.
   A malformed `--shard` refuses rather than quietly running the wrong set.
2. **"Print the never-ran count and fail on it"** — already there. The runner prints
   `N GATE(S) NEVER RAN`, names them, and **returns 1**. A run with unrun gates is
   never a pass.
3. **"Then retire the dead with a record"** — not done, and the census's own output
   says it belongs to the next row, `[dead gates]` GATE-CENSUS.

So the buildable part of this row was largely finished before it was claimed. What it
was missing was the measurement, which is what this round delivered.

## FACTION ARC IS NOT RED. IT IS BEING KILLED.

```
  600.0 s   FAIL   FACTION ARC
```

600.0 seconds is exactly `GATE_CAP`. The gate did not fail a check — it hit the
per-gate ceiling and was killed, then reported as a failure like any other.

**It is counted among the 93 reds while having verified nothing.** That is the
"green over nothing" disease wearing red clothes, and it is worse, because a red gets
attention and this one will send somebody hunting for a bug that is not there.

It measured 429 s in the 9/6 census, so it has grown past the cap since.

### CORRECTION, AND IT MAKES THE FINDING MUCH WORSE

I first wrote here that "almost the entire 600 s is repeated boots", inferred from the
gate's source: 14 fresh loads of a 4.4 MB city file against only 12 seconds of declared
waiting. **That was wrong, and I measured it rather than leaving it standing.**

One city boot costs **8.0 s** (four timed back to back: 11.1, 8.2, 8.1, 8.0), so fourteen
is about 112 s. Then the gate was run alone with the cap lifted:

```
  FACTION ARC GATE: 102 passed, 0 failed       1,228 s   (20.5 min)
    of which 14 city boots                      ~112 s   (9%)
    of which section K alone                      594 s   (48%)
```

**The gate is GREEN. 102 checks pass.** It needs 20.5 minutes, the cap is 10, so the suite
kills it every single run and files it among the 93 reds.

So this is not a slow failing gate. It is **102 working checks on the faction system that
the suite has never once been allowed to see**, reported as a failure the entire time.
That is worse than the green-over-nothing this lane has been chasing: it is a RED over 102
real greens, and it sends somebody hunting a bug that does not exist.

The boots are not the problem at 9%. **One section is half the gate**: K, "WHAT ASKING
COSTS, BEFORE HE ASKS", 594 s for 3 checks. So splitting the gate means splitting K, and K
alone is already close to the cap.

The lesson, again, and it is the same one: reading the source told me where the time went
and the source was wrong by five times. Time is measured, never read.

For contrast, the other giant is honest work: `OPENING` at 438.5 s spends its time
waiting for the opening cinematic to actually play through, which is what it is for.

## THE SUITE MUTATES THE TREE IT IS CHECKING

Partway through the run, `slices/BOHEMIA_SUBURB_WALK_7_18_26.html` changed under it —
a build tool got run against the **live repo**, not a copy, and rebuilt the slice in
place.

Two consequences, both bad:

- **The confirm pass judged a different tree than the main pass.** The runner re-runs
  every red alone to separate real failures from load, and its own message admits the
  ambiguity: green alone is "usually load, but a changed tree does this too". Once the
  tree moves mid-run, that second pass stops being a clean control.
- **It exposed a sixth stale bake.** The rebuilt slice came out **+124/-1** against the
  committed copy, missing FACTIONS' own 9/6 "THE OTHER FOUR" block.

The slice was restored, not committed: this lane may not edit `slices/` content. It is
named on FACTIONS' row and frozen in the freshness gate.

This is the strongest possible argument for the design choice made last round: the
freshness gate regenerates in a throwaway worktree and never writes to the repo. A
gate that rebuilds in place is not just risky in theory — the suite did it this round.

## AND IT FOUND A REAL HOLE IN LAST ROUND'S GATE

`derived_freshness_gate` finds its **makers** by reading "Generated by X" headers. The
suburb walk slice **has no header**, so its maker was invisible and the gate had never
looked at it. Discovery-by-running was applied to outputs but not to makers, which is
the same hand-kept-list weakness one level up.

Measured, and now printed on every run:

```
  715 files under tools/ write into slices/, records/, engine/, banks/ or laws/
   15 of them are named by the freshness gate          (2.1%)
```

It cannot simply run the other 700: most are **one-shot patch tools** whose second run
re-applies rather than re-derives, which is a different failure with its own gate. So
the honest move is not to claim completeness but to **publish the number and ratchet
it** — coverage may rise and may never fall. A claim nobody can back is worth less than
a number everybody can watch going up.

Two other fixes to the same gate, both found by the run rather than by reasoning:

- it rewrote its own record on **every** suite pass, because the record stored how many
  seconds the run took and that number moves. Eighteen lanes saw a modified file they
  never touched. Volatile telemetry is now stripped before the comparison.
- the missed maker is added, and its drift frozen and named.

## THE RATCHET FIRED ON ANOTHER LANE WITHIN HOURS

Worth recording because it is the point of the whole design. Between shipping the
freshness gate and this round, **COOK hit it while working on hair colours** and took
two files off the frozen list, leaving their reasoning in the file:

> "the gate is what told me to delete them ... I changed `engine/bohemia_engine.js`,
> `current_slice_gate` went red, and its own message named the command. BOTH SLICES
> INLINE THE ENGINE — the run slice carries 67 modules — so both had been serving the
> old seven-colour hair palette while the alpha carried twenty-one, and the +938/-55
> was two weeks of every lane's engine work, not one bad bake."

So the biggest drift on the list was not one careless bake. It was **every lane's
engine work for two weeks**, sitting in two shipped slices that nobody rebuilt. The
frozen list went from seven entries to six without this lane touching it.

## WHAT IS LEFT ON THIS ROW

- **Split FACTION ARC.** 600 s, killed at the cap, 15 city boots. The single biggest
  item, and it is a gate, so it is this lane's to do.
- **Decide what "every gate runs every time" can mean on one 4-core box.** The floor is
  71 minutes. Sharding does not reduce it. This needs either less browser work or a
  second machine, and that is a real fork, not a coding task.
- **Retire the dead** — the row's third clause, which the census itself routes to
  `[dead gates]`.

The row stays CLAIMED. Its ship test is not met, and a half-done row marked SHIPPED is
worse than an open one.
