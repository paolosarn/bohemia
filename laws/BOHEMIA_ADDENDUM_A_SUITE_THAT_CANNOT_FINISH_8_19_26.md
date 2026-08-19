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
