# THE GATE WALKS THE PEOPLE (RUN, 9/5/26)

VAMILY job `[save checked]` / BB-THE-GATE-WALKS-THE-PEOPLE. The row directly
after `[people saved]`, and the reason it exists: yesterday's row put the
population inside the hardened save, and the harness that proves the hardened
save survives an iPhone had never been shown the population.

## THE MEASUREMENT THE ROW WAS WRITTEN FROM, RE-CONFIRMED

`met`, `minds`, `known`, `belong` and `deedweight` appeared **zero times** in
`gates/save_iphone_gate.js`. That gate is good work -- it drives the save
against a hostile fake browser through the seven ways iOS Safari really loses
one (a store that refuses big writes, a store that fills mid-run, a store that
accepts a write and keeps nothing, a truncated blob, ITP's 7-day eviction, no
localStorage at all, and a 7/7-era single-slot save on disk) and then drives it
again on the real page. Every one of those seven ran on a save that was the
world and nothing else.

**A gate that proves half a save survives an iPhone is proving the wrong half
survives.** Days 4, 7, 16 and 20 of the Battle Brothers study each concluded
independently that the people are the point, and the people were the half
nobody walked.

## WHAT THE PEOPLE ACTUALLY COST, MEASURED ON THE RUNNING CITY

Taken off `citySnapshot()` in the walked city on 9/5, not estimated:

| part | bytes |
|---|---|
| whole snapshot | 3,683 |
| the people | 3,170 (86%) |
| of which the deed table | 2,928 |
| minds | 135 |
| belong | 44 |
| known | 17 |
| met | 2 |

**The save is now 86% people, and 79% of the whole save is the deed table.**
That is not a bug and the deed table riding was a deliberate call recorded
yesterday (a save that cannot reproduce the numbers it was played under cannot
reproduce the bug it was sent to show). It matters because **the probe writes a
probe the size of the real save** -- that design is what killed the 1-byte-probe
bug -- so the save getting several times bigger moves the line between a device
called disk and a device called memory, and nobody had measured it. 3.7KB
against a ~5MB origin quota is not close to anything, and now the gate holds a
64KB ceiling so a future row cannot quietly put a roster in there.

## WHAT WAS ADDED

`save_iphone_gate.js` goes 44 checks to 78.

- **L. the five walk every hostile mode.** Tiny-write store, silent store, ITP
  eviction, no localStorage at all, and the save that predates them. The
  eviction claim is the careful one: nothing survives an eviction, so the claim
  is that the people are lost **cleanly** -- never half a population on a fresh
  world, which is the belonging code's own rule.
- **M. THE DESYNC CASE**, the row's own sentence: force a torn write, roll the
  world back one generation, assert the people came with it. Plus M2, the time
  machine asked about the population instead of the world.
- **N. what the people cost**, and the new edge they created: a store that fits
  the world and not its people must say MEMORY out loud. A silent half-save --
  world on disk, people dropped -- is the exact shape of the bug that was fixed
  yesterday, and it is the one wrong answer here.
- **O. all of it again on the surface he plays**, through the real city's own
  snapshot, the real CITYSAVE the alpha built, and the real localStorage,
  modelling a relaunch rather than a next call.
- **J2. the demo**, because the demo is the build a player taps and the save is
  the thing that has to survive on their phone, not on his bench. The cut kept
  the hardened save.

Every people field in the harness is keyed to the generation number. That is not
decoration, it is the whole test: after a rollback the world's day and the
population's generation must be **the same number**, read off the same loaded
blob so nothing the test still holds in memory can satisfy it.

## THE MUTATION THAT MATTERS

Three mutations were run, because a check that cannot fail is not a check.

1. The engine save dropping `people` -> **9 red** (L, M, M2, N).
2. The city snapshot blanking `people` -> **7 red** (all of O).
3. **The pre-9/4 architecture itself** -- the world versioned per slot and the
   people in one shared place beside it -> **exactly ONE red**, section O's
   desync claim. The world came back at generation 1 and the belonging came back
   at generation 9. Every other check in the file stayed green.

That third one is the finding. **This bug lived for a month because it is
invisible from inside either system.** The save is fine. The people ledgers are
fine. Only a check that reads the world and the population off the *same loaded
blob* and asks whether they agree can see it. Nothing crashes, nothing looks
wrong, and the save cannot reproduce the run it recorded.

## AND A LESSON ABOUT THIS GATE, FOUND BY THE MUTATION

Mutation 2 first made section O **throw out of the page** and killed the run
before a single claim printed. That reads as a broken gate rather than a broken
game, and it would have sent the next reader after the harness instead of after
the bug.

**A GATE MUST GO RED, NEVER EXPLODE.** A missing population is a finding, so it
is reported as one. This is the same family as the broken rulers this lane keeps
finding, with the sign flipped: a ruler that cannot read is as useless as one
that reads wrong, and it is more expensive because it hides the reading.

## RESULT

    SAVE IPHONE 78/0  (was 44/0; 34 new, 31 of them the people)
    PEOPLE SAVED 14/0 · SAVE COMPAT 16/0 · WHOLE DEMO 23/0

No game code changed. `slices/` is byte-identical, so no demo re-cut was needed
and no approved pixel moved.
