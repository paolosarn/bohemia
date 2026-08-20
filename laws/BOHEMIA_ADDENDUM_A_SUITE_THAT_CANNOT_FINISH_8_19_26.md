# BOHEMIA ADDENDUM — A SUITE THAT CANNOT FINISH MAKES A LAW UNENFORCEABLE (8/19/26, LOCKED)

## 1. THE FOUNDATIONAL LAW HAD QUIETLY STOPPED WORKING

**A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED** makes `gates/bohemia_gates.py`
the net, and *"green or it does not ship"* the rule. Every law in this repo rests
on that one sentence.

On 8/19 the WORLD lane measured the suite running **217 of 382 gates** before the
container clock killed it. This lane hit the same wall twice in one session — a
run reached 368 gates, another died at 8.

> **So every lane was shipping on a PARTIAL run and could not tell which part it
> missed.**

A killed run does not announce itself. It trails off mid-table, and the last thing
on the screen is a pass.

**SILENCE ABOUT AN UNRUN GATE READS EXACTLY LIKE GREEN.**

That is a bug in the **runner**, not in any gate, and it belongs to nobody — which
is why it sat.

## 2. THE ROOT CAUSE, MEASURED RATHER THAN GUESSED

The per-gate timeout was **1800 seconds**. `TOOLS RUN` spends all of it:
it runs `bohemia_district_hero_factory.py`, timed at **31 minutes**.

> **One gate ate thirty of the roughly fifty minutes a container survives.**

And the verdict is identical either way — a timeout is a failure. The extra 23
minutes bought **nothing except the last third of the table never running.**

## 3. WHAT CHANGED, ALL IN THE RUNNER, NO GATE'S ASSERTIONS TOUCHED

**ONE — A 600-SECOND PER-GATE CAP** (`BOHEMIA_GATE_CAP`). The longest *healthy*
gate measured is 61s, so this is two orders of margin, not a squeeze.

> **A GATE THAT CANNOT ANSWER IN TEN MINUTES IS BROKEN AS A SHIP GATE WHETHER IT
> WOULD PASS OR NOT** — every ship in this repo waits behind it.

**TWO — A WHOLE-SUITE BUDGET** (`BOHEMIA_SUITE_BUDGET`, default 2700s). The run
**stops itself while it can still speak**, instead of being killed mid-sentence.

**THREE — THE UNRUN LIST, BY NAME.** Not a count, not a hint — every gate that
never got a turn, printed, with the words **NOT GREEN AND NOT RED: UNFINISHED**.

**FOUR — EXIT 1 ON AN UNFINISHED RUN.** An unrun gate has held nothing, so a run
with unrun gates is never a pass, and anything reading the exit code sees that.

**FIVE — A `[n/total]` COUNTER ON EVERY LINE**, so even a hard kill leaves a last
line that says exactly how far it got.

**SIX — `--only <name>`**, because every lane is already running its own gates by
hand; doing it through the runner keeps the lock, the deps check and the table
check. **And a filtered run never says ALL GATES GREEN either** — it says how many
of how many, and that the rest held nothing. *Same lie as silence, smaller.*

## 3b. AND A SECOND BUG UNDER IT: A TIMED-OUT GATE WAS NOT ACTUALLY STOPPING

`subprocess.run(timeout=...)` kills **the child it started and nothing else.**

`TOOLS RUN` spawns `bohemia_district_hero_factory.py`. So when the gate hit its
cap and was declared timed out, **the factory kept running** — caught at
**forty-five minutes**, long after the gate that started it had been reported
dead, burning a core alongside every gate that ran after it.

> **Every timing downstream of a timeout was inflated by a process nobody could
> see** — which is why the suite was slower than the sum of its parts, and why the
> measurement above understates how much the cap was costing.

Each gate now runs in its **own process group** (`start_new_session`) and a
timeout kills the **group**. A gate that is over is over, including whatever it
spawned. Proven both ways before the claim was written: the old code leaves the
grandchild alive, the group kill reaps it.

## 3c. AND THE ARITHMETIC SAYS TRIMMING CANNOT CLOSE THE GAP

With the cap fixed and the orphan reaped, the suite ran **236 gates in 2748s**,
reported **15 failures**, and named **150 gates that never ran** — honest, and
still unfinished.

That is **~11.6 seconds a gate**, so the full 386 need about **75 minutes**, and a
container survives about **50**. `TOOLS RUN`'s entire 600s is only a third of a
25-minute gap. **No amount of trimming one slow gate closes it.**

So: **`--shard i/n`**. Two shards each finish comfortably and together cover the
table **exactly once** — a complete, honest answer in two runs instead of a
partial one in one. Interleaved (`i % n`) rather than blocked, so each shard gets
a fair mix of fast and slow gates instead of one inheriting all the browser gates.

> **THE CLAIM THAT MATTERS IS COVERAGE, NOT SPEED.** A sharding scheme that drops
> or double-runs a gate is *worse* than no sharding, because it looks like a
> complete answer. So the gate counts the union and the multiplicity against a
> full run rather than trusting the arithmetic — and both failure modes are
> mutation-proven: an off-by-one that drops gates reds A12, an overlap reds A13.

A sharded run also never says ALL GATES GREEN. It says which shard it was, and
that the others held nothing — **same rule as an unrun gate.** And a malformed
`--shard` refuses rather than silently running everything, because a typo that
quietly runs the wrong set is the whole disease.

## 3d. TWO SHARDS WAS MY GUESS AND IT WAS WRONG. THREE FINISHES.

Guessing was the mistake, and running it for real is what corrected it:

| run | owned | ran | wall clock | finished? |
|---|---|---|---|---|
| full | 386 | 236 | 2748s | **no** — 150 unrun |
| `--shard 1/2` | 193 | 162 | 2707s | **no** — 31 of its own unrun |
| `--shard 1/3` | 129 | **129** | **1490s** | **YES** — reached gate 385/386, no unrun list at all |

**Three shards, twenty-five minutes each, against a fifty-minute container.**

And a real shard run is what exposed the accounting bug in §3e — the arithmetic
looked right on paper and was wrong in the only place that counts.

> **THE RUNNER WORKS OUT THE SHARD COUNT ITSELF NOW**, from what it just
> measured, rather than leaving the next person to guess as I did. It prints the
> measured seconds-per-gate, what this run's gates need against the budget, and
> **at least** how many shards cover the table.
>
> The rate is a **sample, and not a random one** — it is whichever gates ran
> before the clock, and the slow ones cluster (one gate alone is 600s). Measured
> both ways: a full run averaged 11.6s a gate, `--shard 1/2` averaged 16.7s
> because it held `TOOLS RUN`. So the advice leaves real headroom and says *at
> least*, because being optimistic here costs somebody a whole container to find
> out. Against both real measurements it advises 3 and 4.

## 3e. AND THE UNRUN COUNT WAS OVERSTATED TWO TO ONE, INSIDE THE FIX FOR IT

`--shard 1/2` owns 193 gates. It stopped having run 162 and reported **62 never
ran**. It owned **31** more. The unrun list took `GATES[i:]` wholesale and counted
**the other shard's gates** as things this run had failed to reach — and the names
it printed included gates that were never that run's job.

**A number that reads like a fact and is not one is precisely the disease this
work exists to kill, and it shipped inside the cure.**

The unrun list now obeys the same filters the run loop does, and it is checked as
**arithmetic rather than as a shape**, which is what makes it provable:

> **What a run RAN, plus what it reports UNRUN, must equal exactly what that run
> OWNED.**

Asserted for a full run (386), both halves of a two-way split (193 each) and a
filtered run (1). The mutation is the instructive part: restore the wholesale
count and **three of the four go red while the full run stays green** — which is
exactly why the original bug was invisible.

## 4. HOW IT IS GATED WITHOUT BREAKING THE LOCK

`gates/suite_honesty_gate.js` **runs the runner in a child process** and reads what
it actually prints and actually exits with — because *"the code has an unrun list"*
and *"the run says so"* are different facts, which is the same distinction that
cost this lane three days on the wall.

It drives **`--dry-run`**, which walks the table and executes nothing. So it needs
no lock and rebuilds no slice, and **ONE SUITE AT A TIME (7/30) is untouched for
every run that actually runs something.**

Both mutations bite: swallow the unrun exit code and A6 goes red; restore the
1800s cap and A1 does.

## 5. THE LAW

**AN UNRUN CHECK HAS HELD NOTHING, AND A RUN THAT DID NOT FINISH IS NEVER A PASS.**

Any process in this repo that verifies a set of things must, when it cannot get
through them, **say which ones it did not reach, by name, and fail.** Trailing off
is not a result.

**AND THE COROLLARY, WHICH IS WHERE THIS ONE HID:** a filtered or partial run is
subject to the same rule. *"All green"* is only true of a run that ran everything.

Gate: `gates/suite_honesty_gate.js` · Runner: `gates/bohemia_gates.py`
Not in a tab — this is the machine that guards every tab.
