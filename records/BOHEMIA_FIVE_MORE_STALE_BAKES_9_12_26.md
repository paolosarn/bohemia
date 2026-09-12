# FIVE MORE STALE BAKES, AND THREE OF THEM SHIP
## PLUMBER lane, 9/12/26, VAMILY row [nothing baked] DERIVED-FRESHNESS-GATE

## THE SHORT VERSION

The law NOTHING IS BAKED ONCE (9/6) ends with the sentence **"This one gets a gate:
derived_freshness_gate."** Nobody had built it. The law was advertised and unenforced
for six days, which is the exact shape the law index gate was built to make impossible.

It is built now. **On its first run it found five more instances of the same defect the
law was written about, and three of them are in files that ship.**

```
  slices/BOHEMIA_RUN_CURRENT.html          +938 / -55    a 22 MB shipped slice
  slices/BOHEMIA_CURRENT_SLICE.html        +107 / -11    carries the OLD quest canon
  slices/BOHEMIA_MAP_CURRENT.html           +92 / -7     engine md5 stamps that lie
  records/BOHEMIA_SURFACE_AUDIT_8_15_26.md  +19 / -19    says 6, the truth is 22
  records/BOHEMIA_REACHABILITY_CENSUS.*     +20 / -11
```

And the good half, which matters just as much: **37 of 42 derived files re-derive BYTE
FOR BYTE**, including `slices/BOHEMIA_ALPHA_0_9.html`, the one link Paolo taps. The
build is mostly reproducible. It is the five that nobody could see.

## WHAT EACH ONE IS

**`slices/BOHEMIA_CURRENT_SLICE.html` is the worst of them, because it is content.**
Re-running its own builder replaces
`"# BOHEMIA SIDE QUEST — PLAYABLE .bq ... S01 — THE METER READER"`
with
`"# BOHEMIA ACT ONE ASK -- PLAYABLE .bq ... A01 -- THE KILLING SUMMER"`.
The source moved to Act One and the bake never followed. It is also missing the 9/5
faction-towns seat rule ("THE SEAT RULE LIVES IN ONE MODULE NOW, because it was living
in two and they disagreed") which is itself a fix for the same class of bug.

**`slices/BOHEMIA_RUN_CURRENT.html` is 938 lines behind** its builder. It is 22 MB and
it is the file `demo_is_current_gate.js` warned about on 9/5 in those words: "a demo
re-pointed at one of those would hand a friend a stale valley while the workshop looked
fine."

**`slices/BOHEMIA_MAP_CURRENT.html` carries engine md5 stamps that no longer match the
engine files they name.** A checksum whose job is to prove freshness, itself stale. It
also **declares no maker header at all**, so a gate that discovered its work by reading
headers would never have looked at it.

**`records/BOHEMIA_SURFACE_AUDIT_8_15_26.md` reports the wrong shape of the whole
project.** It says 6 things are on the walked surface and 22 exist only on the surface
he never sees. Regenerated, it says **22 and 7**. It had it almost exactly backwards,
and it is a record other lanes read to decide what to work on.

Nobody did anything wrong on purpose in any of these. That is the point of the law: a
bake is correct the day it is made and rots quietly after, and no lane can see the rot
from inside its own work.

## HOW THE GATE WORKS, AND WHY IT CANNOT EAT YOUR WORK

The law names the standard answer in one line: **regenerate, then fail if the tree is
dirty.** That is one line of diff in a repo where the tree is disposable. Here it is
not. Eighteen lanes work in one checkout, and a gate that regenerated in place and
restored with `git checkout -- .` would destroy somebody's uncommitted work the first
time two things happened at once.

So it regenerates in a **detached git worktree in the scratch directory**. The worktree
starts at HEAD and is then overlaid with every working-tree file that differs from HEAD,
so it checks what is about to be **pushed**, not what was last committed. The real
checkout is opened read-only and is never written to.

That is not a claim, it is a test: `git status` is hashed before and after a full run
and the two hashes are identical.

## DISCOVERY IS BY RUNNING, NOT BY READING

The law asks every derived file to carry a header saying what makes it. The **makers**
are found that way: 14 of them, declared across 49 files. But the **outputs** are found
by running the maker and asking which files the run touched.

That is deliberate, and it is the same argument as the gate registry: a hand-kept list
drifts, and the file most likely to be stale is exactly the one whose header nobody
wrote. **It paid for itself in the first run** — the 92-line-stale map slice declares no
maker, so a header-driven check would have skipped it silently.

Counted, and reported every run: **35 of 42 rewritten files carry a maker header. Seven
do not**, and two of the seven are the biggest shipped surfaces in the repo.

## THE GATE'S OWN FLOOR CAUGHT ITS FIRST MECHANISM

Version one asked git **what changed** after each maker ran. That sounds right and it is
wrong, because **a maker whose output is already correct leaves the worktree clean.** So
the 37 files that re-derive perfectly were invisible, and the gate announced

```
    1 of 6 derived files re-derive BYTE FOR BYTE
```

when the truth was **37 of 42**. It was only caught because a floor check required at
least 21 comparisons and got 6.

A check that can only see failures cannot tell a passing run from a run that did
nothing. Writes are now found by **mtime**: the reset before each maker stamps every
restored file, the clock is read, the maker runs, and anything stamped after that clock
was written by it — identical bytes or not.

This is the third round running in which a floor caught the mechanism rather than the
subject. They keep earning their place.

## THE FROZEN LIST, AND WHY THIS SHIPS GREEN WITH FIVE THINGS BROKEN

This lane may not edit `slices/` content, `laws/`, art or features, so it cannot fix any
of the five. And a gate that is red the day it arrives gets switched off — measured, not
feared: two gates in this repo sat failing from 8/31 while "gate green" was cited as
proof, because nobody could tell a new red from the old one.

So the five are a **named, frozen baseline** with the lane that owns each. The list can
only **shrink**:

- a file that starts drifting and is not on the list is **red the same run**
- a file on the list that stops drifting is **also red**, so the list cannot go stale and
  nobody can quietly park a new problem in it

## WHAT IS NOT RUN, AND WHY, BY NAME

- **`tools/bohemia_reachability_census.py`** — measured at **66.4 seconds**, ten times
  every other maker put together, against a suite already over its ten-minute budget.
  Its two outputs are on the frozen list and were measured by hand. A deliberate trade.
- **`tools/bohemia_bake_factory.py`** — exits 1 with no arguments. It is a factory you
  point at a thing, not a command that rebuilds its own output.
- **`tools/bohemia_city_onezoom_patch.py`** — a **patch** tool. Re-running it does not
  re-derive, it re-applies, and a double-apply is a different failure with its own gate
  (`tool_idempotent_gate.js`, FACTIONS, 8/21).

A silent exclusion is how a gate stops checking, so each one is named in the file with
its reason and the gate goes red if any of the three disappears.

## THE TEETH, PROVEN BEFORE SHIPPING

```
  a drifting file not on the frozen list          -> FAIL  NEW DRIFT
  a frozen entry that re-derives clean            -> FAIL  FIXED, DELETE THE ENTRY
  a pinned maker that does not exist              -> FAIL  x2 (missing, and crashed)
  an exemption for a maker nobody has             -> FAIL  stale exemption
  a derived file made stale only in the working
    tree, never committed                         -> FAIL  NEW DRIFT
```

Sixteen seconds, 9 passed / 0 failed. `records/BOHEMIA_DERIVED_FRESHNESS.json` lists
every file, what it re-derives to, and what is frozen.

## ONE THING FOR THE COORDINATOR

CLAUDE.md's law index does not list NOTHING IS BAKED ONCE at all, so `law_index_gate.py`
never noticed the missing gate. The index catches a law that **names** a gate that does
not exist; it cannot catch a law that is **absent from the index**. Adding the line is
the coordinator's, not this lane's.
