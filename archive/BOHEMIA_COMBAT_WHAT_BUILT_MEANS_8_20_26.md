# WHAT "BUILT" MEANS (8/20/26, COMBAT lane)

> **Paolo:** *"combat. continue building rogue fable 4"*

Item 1 on this lane's own list, and it was bookkeeping in the only sense that
matters: **the ledger I put in front of him yesterday could not be trusted, and I
said so at the time.** This is the turn that makes it true.

---

## 1. RF4-49 WAS BUILT AND TWO LIVE FILES DISAGREED ABOUT IT

RF4-49 is a **★★★** row — the free-movement budget, which the lift law calls
*"the single highest-value item in the whole corpus"*. This lane's handoff has
called it BUILT since V163. **The spec's status cell still said SPECED.**

A contradiction between two live files is a bug, not an interpretation, and the
tie-break is the running fight rather than either file. All four clauses, driven
through the shipped `doMove`:

| the row says | measured |
|---|---|
| moving ends your turn | a plain step moves the world **and ends the turn** ✔ |
| sprinting moves you **without** ending it | world moves, **turn does not advance**, costs a pip (3 → 2) ✔ |
| SP refills on a **global** clock, not a per-use cooldown | spend to nothing and it comes back full on every 5th world turn: `2,1,0,0,3,2,1,0,0,3` ✔ |
| hoarding earns nothing | a hoarder never exceeds max ✔ |

**SPECED → BUILT**, and four claims now hold it in `fight_moves_you_gate`, so it
cannot drift back.

---

## 2. THE SPLIT: BUILT NOW MEANS SOMETHING A MACHINE CAN SEE

The coordinator routed this here on 8/20:

> *"The spec's STATUS column and its own prose disagree, because BUILT is used
> for both 'substrate exists' and 'machine exists'. Routed to COMBAT (which owns
> that column) to split the values."*

A split is worth nothing if it is one more word somebody types, so the rule is
checkable, and it is the rule this whole repo already runs on:

> **A row is BUILT when some gate NAMES it. Material nobody checks is UNHELD.**

That is *a law without a machine gate is not enforced*, turned on the spec
itself, and it is the QUEST STUDY LAW's discipline for quests applied to rows:
**a citation is a claim the machine can check, never a name-drop.**

**Measured:** 24 rows said BUILT; **20 were named by a gate.** Of the four that
were not:

| row | what it turned out to be | what happened |
|---|---|---|
| **RF4-65** the explicit-mechanical register | genuinely held — it *is* the OPEN BOOK page | citation added |
| **RF4-35** the expression line | a real rule **nobody was checking** | **got a gate, same day** |
| **RF4-33** juice | fx exist; no gate holds the row | **UNHELD** |
| **RF4-34** what RF4 omits | an observation whose content lives in other rows | **UNHELD** |

**And the first version of the scan was wrong in a way worth keeping.** It read
citations with `/RF4-\d\d/` and therefore missed `RF4-17/32`, reporting a held
row as unheld. A sweep that silently under-counts reads exactly like a clean one.

`top_of_the_document_gate` T9 now fails the build if any row says BUILT and no
gate names it. T10 fails if UNHELD ever empties — because the tempting way to
clear that column is to quietly promote the awkward rows back.

---

## 3. THE EXPRESSION LINE GOT A GATE, AND THE HARD HALF IS TELLING A CITATION FROM A NAME

RF4-35 carries §5 of the recreate-RF4 law:

> *"Systems are free to recreate. **Expression is not.** Never copy a name, a
> string, an icon, a screen, or the title."*

It was marked BUILT on the strength of a sentence in its own diff column.

**`Rogue Fable` appears twice inside the shipped combat blob right now, and both
are legal** — they sit in code comments naming the source a mechanic was built
from, which is exactly what the row permits and exactly what this repo asks of
every other borrowed idea.

So a gate that simply grepped the file would **fail the build for honest
sourcing**, and the obvious fix would be to delete the citations — turning
sourcing into laundering. Paolo, 8/1: *a checker that cannot tell a mention from
a use is the broken one.*

`gates/expression_line_gate.js` therefore strips comments first and reads only
what a player can see: readouts, button labels, visible text. It **proves it can
tell the difference on the spot** rather than asserting it (a name planted in a
readout is caught; the same name in a comment beside it is not), and the
forbidden vocabulary is **read out of the spec's own citations** rather than
typed, so the day LAB documents another RF4 name the sweep covers it without
anybody remembering.

**Mutation-tested against the real surface:** an RF4 name planted in a live
`setRead` fails the build. Restored, green.

---

## 4. THE LEDGER, NOW THAT IT MEANS SOMETHING

| priority | BUILT | SPECED | UNHELD | differs |
|---|---|---|---|---|
| ★★★ | **3** | 1 | 0 | 0 |
| ★★ | **2** | 4 | 0 | 0 |
| ★ | 2 | 4 | 0 | 2 |
| unstarred | 16 | 27 | 2 | 5 |

**Top ten rows: 5 built, against 2 yesterday morning.** The only ★★★ row left is
**RF4-36, the thesis** — which the document itself calls *"the most important
line in any of this"* — and `top_of_the_document_gate` T8 fails the build if it
is ever quietly declared finished.

The unstarred BUILT count went **18 → 16**, which is the split doing its job: two
of them were claims, not machines.

---

## 5. AND THE V171 GATE WAS REBUILT AS A PAIRED MEASUREMENT

Yesterday's V171 claims were flaky, and the fix took three tries that are worth
recording because each wrong turn is a tempting one:

1. **one arena per arm** — flaky, because the line settles at 4 or 6 tiles
   depending on parity in the peek cycle and the beat clock
2. **averaging twelve arenas** — better, still flaky on the claims that assert
   **no** effect
3. **running the same arm twice to estimate the noise** — better again, still not
   stable, because a noise estimate from a single pair is itself noisy

The temptation at every step was to widen the tolerance until it passed, which is
**tuning the ruler to the result**. The actual fix is a **paired design**: every
arm is measured arena by arena against *the same arena with nobody else in the
room*, so drift that moves both sides cancels.

**And then the statistic had to match the claim.** "It always does this" is a
count, and 12 of 12 is a strong statement. **"It does not do this" cannot be a
count**, because arenas jitter either side of zero and a count punishes a
perfectly flat effect for landing at −0.04 instead of +0.04. Null claims read the
mean; positive claims read the count.

Paired, twelve arenas, tiles further out than the same arena with nobody there:

| the company | effect | held back in |
|---|---|---|
| a shiv **closing** | **+3.58** | **12 of 12** |
| a working **marksman** | **+4.75** | **12 of 12** |
| the same shiv **far off** | −0.08 | — |
| the marksman, **dead** | +0.26 | — |
| the shiv, **dead**, at 5 tiles | +0.03 | — |
| the marksman, **smoked** (V170) | +0.01 | — |
| a fourth plain goon | +0.85 | — |

**All six mutations die against this version**, including the two that survived
the first one.

## GATES

- `gates/expression_line_gate.js` — **NEW, 4 pass / 0 fail**, mutation-confirmed
- `gates/top_of_the_document_gate.js` — **10 pass / 0 fail** (T9, T10 new)
- `gates/fight_moves_you_gate.js` — **51 pass / 0 fail** (4 new RF4-49 claims)
- `gates/combat_lab_gate.js` — 876 pass / 2 fail (both already red on clean main)
- `gates/rf4_teardown_gate.js` — 92 pass / 2 fail (C2/C3 are LAB's cells, red by
  design). Its status vocabulary learned `UNHELD`; COMBAT owns that column.

## WHAT THIS LEAVES

**RF4-36, the thesis**, is the last ★★★ row: *"highly tactical and rewarding
clever decision making... of equal importance and opposing this, fast, action
packed, full of crunchy satisfying explosions."* Our own diff says the shooter
half is already real and **the decision layer is what is missing** — and after
V171 a good part of that decision layer now exists, so this row is closer than it
reads. It is also the row most likely to be answered by measurement rather than
by a feature, the way RF4-14 was.
