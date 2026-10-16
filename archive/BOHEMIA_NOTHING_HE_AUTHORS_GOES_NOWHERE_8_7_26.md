# BOHEMIA — NOTHING HE AUTHORS GOES NOWHERE
### 8.7.26 — FACTIONS lane. I found the same bug by hand three days running, so I stopped finding them one at a time and built the machine that asks the general question. Its first honest run found a fourth one nobody had seen: **the territory system has never moved a single district.**

---

## ONE DISEASE, FOUR COSTUMES

| when | what | how it was found |
|---|---|---|
| 7/30 | an approved bank that never draws a pixel | a human noticed |
| 8/4 | 17 finished things shipping where no player looks | a human noticed |
| 8/6 | 69 clout tags read only by a vanity follower count | a human noticed |
| 8/7 | 17 `@DO faction_posture` rulings parsed into a real field and dropped | a human noticed |

**Paolo authors something, the machine parses it correctly, and nothing ever reads
it.** Every gate in the repo was green through all four, because no gate could ask
the general question. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED — and this one did
not even have a law.

## TWO WRONG VERSIONS BEFORE THE RIGHT ONE, WRITTEN DOWN RATHER THAN HIDDEN

**v1 grepped the verb name.** It reported `advance_territory` dead, because the verb
is snake_case and the state field it writes is camelCase `advanceTerritory`. The repo
already had this exact scar — the 8/4 census *"gave four false alarms out of five"*
the same way.

**v2 grepped the state field each verb writes**, extracted from the runtime's own
switch so the vocabulary was never typed by hand. That fixed v1 and broke the
opposite way: **it reported everything alive.** `@DO play` writes a string into
`s.log` and nothing on earth parses that log for it — but `s.log` is read all over,
two JUDGE PAGES re-implement the runtime for preview, and a local variable called `s`
in an unrelated file looks identical to a consumer.

A third heuristic would have had its own blind spot. Paolo 7/26: *"writing a fourth
version of anything means you already failed."* So the **approach** changed:

> **DO NOT ASK WHO READS IT. ASK WHETHER IT CHANGES ANYTHING.**

Boot a real world. Snapshot it. Resolve a quest carrying exactly one `@DO` verb
through the real runtime and the real world bridge. Boot again without it. Diff.

It never reads a character of source, so a comment, a coincidence, a judge page or a
26 MB generated slice cannot fool it. Same standard the good gates here already hold:
**measure the world, never the code.**

## WHAT THE FIRST HONEST RUN FOUND

```
515 @DO lines authored across the canon corpus

WORLD       faction, faction_posture
QUEST-ONLY  advance_territory, bond, cast, complete_objective, give, have,
            learn, play, set_flag, show_objective
INERT       none
UNPARSED    none
```

Nothing is a total dead letter — good. But one row does not belong where it landed:

## *** `@DO advance_territory` HAS NEVER MOVED A DISTRICT ***

It reads QUEST-ONLY, and it should not. It is supposed to fire the territory AI and
shake the map — and `bohemia_loop.js` genuinely does call `advanceRound()` on it; the
existing bridge test proves the call happens.

**The call happens and the AI declines.** Measured directly:

```
default quotas, 1 round  ->  changed: false
default quotas, 13 rounds ->  changed: false
quotas: Reds=1/1 Blues=1/1 Anarchists=1/1 Colorful=1/1 Church=1/1 Network=1/1
        Trades=1/1 Caravans=1/1 Volunteers=1/1 Remnants=1/1 Cartel=1/1 Mob=1/1
        Homeless=1/1 Custom=1/1
```

Every faction boots holding exactly its quota — 1 district, wants 1 — and
`scoreClaim` has an explicit gate for precisely that case:

```js
if (deficit <= 0 && !owner) return -1;   // sated: ignore empty land
```

Deficit is zero for everybody, so every faction declines every target, every round,
forever. **The territory AI has been a correctly-implemented no-op since the day it
shipped.** Thirteen rounds, zero movement. Four authored `@DO advance_territory`
rulings firing an engine that always says no.

And the fix was already in this turn's other commit:

```
quota+1, 1 round  ->  changed: true
```

**`faction_posture` is the missing half of `advance_territory`.** One says *shake the
map now*; the other says *and here is who is hungry enough to move*. Both were
authored. Neither was connected to the other. Wiring posture this morning is what
makes the territory system do anything at all — which I did not know when I wrote it,
and would not have known without this sweep.

## WHY THE FIX IS NOT "RAISE THE DEFAULT QUOTA"

Tempting and wrong. Quota is content — how much ground a faction *wants* is a canon
question about who they are, and MECHANISM-MINE / CONTENTS-PAOLO'S means I do not get
to answer it. **His posture rulings already answer it**, per quest, in his own
numbers, on the narrative beat where it belongs. The system was designed correctly;
only the wire between its two halves was missing.

## THE GATE

`gates/authored_unread_gate.py`, registered as **AUTHORED UNREAD**. It fails if any
`@DO` verb is INERT (changes nothing anywhere) or UNPARSED (he writes it and the
runtime has no case for it). The vocabulary is read out of the runtime's own switch,
so a verb added or renamed tomorrow is followed automatically and the gate cannot
drift from the thing it checks.

**The fifth instance of this bug cannot happen silently.** That is the actual
deliverable; the `advance_territory` find is what it caught on the way out the door.

## WHAT IT DOES NOT COVER YET, SAID PLAINLY

This sweeps the `@DO` vocabulary only. The same disease lives in at least three other
authored vocabularies nobody has swept: `@STUDY` citations, `@ROLE ... REQ` keys, and
the `[gate: ...]` conditions. `QUEST-ONLY` is also a coarse verdict — `@DO play`
"changes state" only because it appends a line to a log, which means **the sound still
never plays.** That is a real finding this gate is currently too generous to fail on,
and it is named here rather than left to be discovered as instance number five.

---
*BOHEMIA — Nothing He Authors Goes Nowhere — 8.7.26*
*Three days, three of the same bug found by hand. The fourth one found itself.*
