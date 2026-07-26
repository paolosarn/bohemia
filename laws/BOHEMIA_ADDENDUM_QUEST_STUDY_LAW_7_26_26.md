# BOHEMIA — ADDENDUM: THE QUEST STUDY LAW (LOCKED)
### 7.26.26 — Paolo: "so let me ask you we dug data and we collected a total of 150 quest and shit like did you give a fuck about any of that?"

---

## THE HONEST ANSWER: NO, AND HE CAUGHT IT
The S10-S21 batch (twelve playable quests, shipped earlier the same day) was
written from the craft bullets in CLAUDE.md and two addenda. The actual corpus was
never opened:

| what was sitting there unread | size |
|---|---|
| `questbook/BOHEMIA_CRAFT_MASTER` | 1,527 craft findings across 152 studied quests |
| `questbook/BOHEMIA_FLAWS_MASTER` | 693 findings on what went wrong, each with its own `>> LAW` |
| `questbook/BOHEMIA_PORTS_MASTER` | 1,276 ports — an explicit build queue of what to steal for Bohemia |
| `questbook/BOHEMIA_CONVERSATIONS_MASTER` | 176 dialogue nodes dissected down to their gates and removed verbs |
| `questbook/BOHEMIA_QUESTBOOK_*.md` | 240 files of source study |
| `quests/BOHEMIA_QUEST_###_*.md` | 53 fully-produced design docs |

The quests that shipped were not bad, but they were written *in the style of* the
corpus instead of *out of* it, and several ports that are literally queued in the
PORTS master by name were left on the shelf.

## THE ROOT CAUSE (mechanism, not attitude)
The art side already had **REUSE-FIRST** (Paolo 7/22): a factory must document
which bank it opened, and *a claimed reuse must actually open that bank in code,
not just say so*, swept by `reusefirst_gate.py`. The quest side had **no
equivalent**. Skipping 3,672 findings cost nothing and left no trace. A law
without a machine gate is not enforced, and here there was not even a law.

## THE LAW (LOCKED)
1. **The corpus is machine-readable.** `tools/bohemia_questbook_index.py` mines the
   four masters into `records/BOHEMIA_QUESTBOOK_LAW_INDEX.json` (+ `.md` for Paolo):
   **3,672 citable findings**, every one with a stable id.
   - `Q001.W4` craft law · `Q017.X2` flaw finding · `Q001.P5` port · `Q001.N2` dialogue node
2. **Every canon `.bq` CITES what it was built from**, in its header:
   ```
   # @STUDY Q021.W5  TRIAGE AS THE CORE LOOP
   #   applied: one course, two people; every save is a death elsewhere.
   ```
3. **The citation is checkable, not decorative.** The id must resolve in the index,
   the quoted title must match the corpus **verbatim**, and the `applied:` line must
   actually say what was used.
4. **No monoculture.** A quest must span **≥2 distinct studies** and **≥2 distinct
   masters** (craft / flaws / ports / conversations), and the corpus as a whole must
   draw on **≥20 distinct studies**. Citing only craft laws — which is exactly what
   all 21 quests did on the first gate run — is a FAIL.
5. **The index must be CURRENT.** The gate compares its per-master law counts against
   the counts the masters declare in their own headers, so a corpus batch appended
   without reindexing is caught.

**Gate: `gates/quest_study_gate.js`, registered as QUEST STUDY. 303 passed / 0 failed
(21 quests, 26 studies cited, 3,672 laws indexed).** The first run failed 11 quests
for citing one master only; the fix was to go and read the ports and flaws, not to
soften the check.

## WHAT ACTUALLY CHANGED IN THE QUESTS (not just labels)
Two ports the corpus had queued by name, now built as real mechanics:
- **Q002.N4 (Beyond The Beef) — THE LIE HAS A WITNESS REQUIREMENT.** The corpus:
  *"you cannot just say it; you have to have ARRANGED it,"* and it even writes the
  `.bq` form as a flag gate. **S16 THE VOICE AT THREE**: the false bearing you feed
  the finder crew is now `[gate: flag:she_is_moving]`. They walk what they write, so
  the lie is only *sayable* after you have spent a night getting her off that roof.
  Deceit costs a visit and four hours of her work instead of being a free line.
- **Q136.W7 / Q136.P6 (The Landsmeet) — PERSUASION AS MIDWIFERY.** The corpus: the
  door is talked past *with her own surfaced doubt*, gated
  `[gate: knows:their_misgiving]`. **S19 THE MIDWIFE'S HOUR**: the pastor does not
  hand over the hour because you argued well. The option to let the girl decide only
  exists after you ask him whether the singing has ever not been enough, and he tells
  you about the one room where it wasn't. Until that question is asked, the option is
  not on the menu.
- All 21 quests (S01-S21, the nine originals included) now carry real citations —
  including the ones that sting, e.g. **S05** cites `Q144.X2 GRIND CAN OUTWEIGH GRIEF`,
  the flaws master's warning about exactly the failure mode a repeatable bounty quest
  invites, and **S18** cites `Q129.P6 THE QUIET ONES GET ONE SCENE`, the Tenpenny Tower
  fix that says the wronged must speak for themselves.

## STANDING CONSEQUENCE
Any future quest work — including the Act-1 main-quest beats — starts by querying the
index, not by remembering the vibe. The corpus is now a queryable thing a cook must
answer to, and the gate is the thing that asks.

---
*BOHEMIA — The Quest Study Law — 7.26.26*
*One hundred and fifty quests were dissected. Now a quest cannot ship without saying which ones it used.*
