# BOHEMIA — ADDENDUM: THE UI STUDY LAW (LOCKED)
### 8.26.26 — Paolo: "I need you to do big brain research on how to do big brain
### research on studying other games UI for one round. And then the first basis of
### all of this is gonna be Final Fantasy ten, my favorite UI of all time."

---

## WHAT HE ASKED FOR, AND WHY IT IS TWO THINGS

He asked for the METHOD first and the SUBJECT second, in that order, on purpose.
"How to do big brain research on studying other games UI" is a request for an
instrument. "Final Fantasy X" is round one through that instrument.

This addendum is the instrument. `uibook/BOHEMIA_UIBOOK_R01_FINAL_FANTASY_X_8_26_26.md`
is round one.

## THE PRECEDENT, AND THE FAILURE IT WAS WRITTEN AFTER

**THE QUEST STUDY LAW (7/26/26)** exists because 3,672 findings from 152 studied
quests sat unopened for a month. Quests shipped *in the style of* the corpus
instead of *out of* it. The root cause was named at the time and it is mechanical,
not moral: **skipping the corpus cost nothing and left no trace.**

A UI study written as an essay would fail exactly the same way, on the same
timetable. So the UI study is built as the questbook is built, from the first day:
a corpus of findings with stable ids, an index that resolves them, and a gate that
proves a claim is real.

## THE METHOD

### 1. A ROUND IS ONE GAME
One game, studied to the bone, in one file: `uibook/BOHEMIA_UIBOOK_R##_<GAME>_<date>.md`.
Rounds are numbered and they never merge. Round 01 is Final Fantasy X because he
named it.

### 2. FOUR LENSES, AND YOU NAME THE ONE YOU LOOKED THROUGH
A finding with no lens is an opinion. Every finding declares the lens it was found
through, from this list. These are the field's real instruments, not ours:

- **FAGERHOLT & LORENTZON (2009), *Beyond the HUD*.** The canonical taxonomy.
  Two axes — **FICTION** (do the characters know this exists?) and **GEOMETRY**
  (is it in the 3D world or painted on the screen?) — giving four kinds:
  **DIEGETIC** (in the fiction and in the world), **NON-DIEGETIC** (the classic
  HUD, in neither), **SPATIAL** (in the world, not in the fiction), and **META**
  (in the fiction, not in the world — screen blood, desaturation). Their measured
  result: diegetic and spatial read as the most immersive, meta and non-diegetic
  the least.
- **CELIA HODENT, *The Gamer's Brain*.** Seven usability pillars, written in
  studio language rather than academic language: **Signs and Feedback · Clarity ·
  Form Follows Function · Consistency · Minimum Workload · Error Prevention and
  Error Recovery · User Control and Flexibility.** This is the working vocabulary
  of the lane. When a screen is bad, one of these seven names the reason.
- **PINELLE, WONG & STACH (2008), CHI, *Heuristic evaluation for games*.**
  Heuristics derived by reading reviews of **108 games across 6 genres** and
  extracting the twelve classes of usability problem players actually complain
  about. The value of this one is its direction of travel: it is built from
  COMPLAINTS, not from theory. It is the lens for asking "what will he hate".
- **THE TEARDOWN.** The practitioner's method, not the academy's: rebuild the
  screen as a wireframe, label every element, and mark what you could cut. The
  Game UI Database (Edd Coates, 55,000+ screens tagged by hand) is the same idea
  at scale — the unit of study is A SCREEN WITH TAGS, not a game with a review.

### 3. FOUR MASTERS, AND A FINDING BELONGS TO ONE
Mirrors the questbook's four masters. Plain words on purpose:

| master | letter | what lives here |
|---|---|---|
| **LOOK** | `L##` | material, colour, type, shape, texture, motion |
| **READ** | `R##` | what it tells you, in what order, how fast |
| **DO** | `D##` | committing, cancelling, targeting, the cost of a mistake |
| **WORLD** | `W##` | where the interface touches the fiction |

### 4. EVERY FINDING CARRIES A PORT VERDICT, AND ONE OF THEM MUST BE "NO"
This is the clause that separates a study from a fan page. Every finding ends with:

- **TAKE** — copy the mechanism.
- **ADAPT** — the shape ports, the form does not, and the corpus says why.
- **REFUSE** — it is genuinely good AND IT CANNOT COME HERE, and **the reason is
  the finding.** A REFUSE is worth more than a TAKE, because it is the one nobody
  can derive by admiring the screenshot.

**A ROUND WITH ZERO REFUSALS IS NOT A STUDY, IT IS ADMIRATION,** and the gate
fails it. Final Fantasy X is a 4:3 console game, played with a controller, with a
party of seven, in a corridor, with voice acting. Bohemia is a portrait phone
played with one thumb, one character, an open valley, and no voice budget. A great
deal of what makes FFX great is *paid for* by conditions we do not have. Naming
that is the work.

### 5. THE CITATION IS CHECKABLE, NOT DECORATIVE
`tools/bohemia_uibook_index.py` mines every round into
`records/BOHEMIA_UIBOOK_LAW_INDEX.json`. Ids resolve or they are not ids.
`gates/ui_study_gate.js` proves it. The rules the machine holds:

1. Every id resolves, is unique, and its letter agrees with the master it sits under.
2. Every finding has a lens, a screen, a WHAT, a WHY and a BECAUSE.
3. Every finding has a verdict from TAKE / ADAPT / REFUSE.
4. **No monoculture:** a round spans all four masters, cites at least three
   distinct lenses, and holds **at least three REFUSE or ADAPT verdicts** — an
   all-TAKE round is a fan page and goes red.
5. **The round counts itself honestly:** the corpus header declares its own totals
   and the index checks them against what it actually mined. *(This caught the
   first draft of round 01 mis-declaring its own TAKE and ADAPT counts. The author
   was the one who miscounted.)*
6. It is **IN A TAB** — the UI tab, second view — because a study he cannot reach
   is a study that does not exist (NAME THE TAB, 7/28).

### 6. WHAT A ROUND IS *NOT*
- Not a screenshot gallery. A picture with no finding attached is not evidence.
- Not a ranking. "Better than" is not a lens.
- Not a list of things to build. The corpus PROPOSES; the backlog DISPOSES; and
  a finding that belongs to another lane is ROUTED, not built here.

## STANDING CONSEQUENCE
Any future UI work — this lane's or anyone's — starts by querying the index, not
by remembering the vibe. When a lane says "we should do it like game X", the
answer is "which finding", and if there is no finding then the honest move is to
run a round.

**Gate: `gates/ui_study_gate.js`, registered as UI STUDY.**
**Round 01: Final Fantasy X — 18 findings, 9 TAKE, 5 ADAPT, 4 REFUSE.**

---

## THE SOURCES ROUND 01 WAS READ THROUGH
- Fagerholt, E. & Lorentzon, M. (2009). *Beyond the HUD — User Interfaces for
  Increased Player Immersion in FPS Games.* Chalmers, MSc thesis.
- Hodent, C. *The Gamer's Brain: How Neuroscience and UX Can Impact Video Game
  Design.* CRC Press. (The seven usability pillars.)
- Pinelle, D., Wong, N. & Stach, T. (2008). *Heuristic evaluation for games:
  usability principles for video game design.* CHI '08.
- Coates, E. *Game UI Database* — 55,000+ screens, hand-tagged by screen type,
  HUD element, pattern and colour.
