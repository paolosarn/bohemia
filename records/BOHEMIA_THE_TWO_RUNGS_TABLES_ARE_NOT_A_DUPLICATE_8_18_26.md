# BOHEMIA — THE TWO RUNGS TABLES ARE NOT A DUPLICATE, AND THE FLAG WAS MINE (8/18/26, FACTIONS lane)

**Status: the "consolidate the two RUNGS tables" backlog item is CLOSED as WRONG.
Do not do it. This file is why.**

## 1. WHAT I FLAGGED, AND WHY IT LOOKED RIGHT

`laws/BOHEMIA_ADDENDUM_THE_WALL_AND_WHO_FINDS_OUT_8_15_26.md` §7 noticed that
`bohemia_standing.js` (8/2, PEOPLE lane) and `bohemia_belonging.js` (8/12, this
lane) **both carry a `RUNGS` table**, and wrote:

> FLAGGED FOR CONSOLIDATION — not merged blind on the turn I found it.

It then sat in the handoff as *"NEXT FOR THIS LANE"* for four days, and I restated
it as the next job three times.

**Three lines above that flag, in the same document, is a table saying the two
modules answer different questions.** I wrote both. I read the identifier and
stopped reading.

## 2. THEY ARE NOT THE SAME TABLE. MEASURED.

| | `bohemia_standing.RUNGS` | `bohemia_belonging.RUNGS` |
|---|---|---|
| answers | **what people THINK of you** | **how far IN you are with an outfit** |
| keyed on | an averaged **signed opinion** across minds that personally saw you | a **count of deeds** you did for one outfit |
| row shape | `[word, upperBound]` | `{key, at, word, note}` |
| numbers | `-3, -1, 1, 3, 1e9` | `0, 1, 3, 6, 10` |
| goes negative | **yes** | **no** |
| the number is | the **ceiling** of an opinion band | a **floor** you climb to |
| words | HOSTILE · COLD · NEUTRAL · WARM · FWU | A STRANGER · SOMEBODY WHO SHOWED UP · USEFUL · COUNTED · INSIDE |

**Shared vocabulary: none. Zero words appear in both.**

## 3. THE DAMAGE A MERGE WOULD DO, WHICH IS THE PART THAT SETTLES IT

Feed the same number to both and **they disagree on every single input**:

| n | `belonging.rungOf` | `standing.rungFor` |
|---|---|---|
| 0 | A STRANGER | NEUTRAL |
| 1 | SOMEBODY WHO SHOWED UP | WARM |
| **3** | **USEFUL** | **FWU** |
| 6 | COUNTED | FWU |
| 10 | INSIDE | FWU |

`3` means *"you have done three things for that outfit"* in one and *"they would
take a bullet for you"* in the other. A consolidation does not tidy these; it
**silently rewrites both systems' answers**.

## 4. AND THE ORTHOGONAL STATE IS THE WHOLE ARGUMENT

**You can be INSIDE the Cartel and still be somebody a particular member thinks
badly of.** Belonging 10, standing negative, both true at the same time, and both
load-bearing — the first decides what the outfit lets you near, the second decides
what the person in front of you does about it.

**One table cannot hold that state.** That is not a preference, it is an
expressiveness argument, and it is why there must be two.

## 5. THE FENCE

`gates/commitment_gate.js` **part F** now asserts all of the above, read-only,
against the other lane's live module. Six claims. Any future session that reads
"consolidate the two RUNGS tables" and tries it gets a red gate and this file.

**Nothing in another lane's module was touched.** `bohemia_standing.js` is the
PEOPLE lane's organ — this lane already overwrote it once by accident on 8/15 and
restored it from git the same turn. Reading it is fine; renaming its public
`RUNGS` field to something less collidable is **theirs to decide**, and the gate
does not depend on them doing it.

## 6. THE LESSON, WHICH GENERALISES

**A SHARED IDENTIFIER IS NOT A SHARED MECHANISM.** The repo's standing rule is
that a duplicate mechanism is a bug — and this looked exactly like one from the
outside, right down to me writing the flag myself. What made it wrong was
available the whole time and took four minutes to check: *print both tables and
feed them the same number.*

**A FLAG IS A HYPOTHESIS, NOT A WORK ORDER.** Anything sitting in the handoff as
"next" gets re-derived before it gets done, not after.
