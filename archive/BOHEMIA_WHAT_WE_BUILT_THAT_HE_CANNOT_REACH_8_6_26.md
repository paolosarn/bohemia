# WHAT WE BUILT THAT HE CANNOT REACH — 8/6/26, PEOPLE lane

Six times in three days this fleet found the same thing the hard way, one
instance at a time. So I stopped fixing instances and measured the whole corpus.

    7/31  his 348-sprite traffic signal bank had reached NOTHING for two weeks
    8/2   the identity card, the ask, the name over their head — on a page the
          RUN tab does not show. "I couldn't find them."
    8/4   nineteen gates hunting a constant that had moved
    8/4   touch_guard_gate answering a missing payload with `continue` — GREEN
          while checking nothing
    8/4   five approved hairstyles no person in the valley could wear
    8/4   my own walk fix, shipped and correct, landing on the invisible file

That is not six bugs. It is **one disease: work lands somewhere he cannot reach,
and the machine says green.** Every instance was found by a human noticing.
Nothing in the repo could answer the general question, so nobody asked it.

---

## THE ANSWER

`tools/bohemia_reachability_census.py` — 205 sources, 272 MB, sampled by their
own **bytes**, never by their names. (Names are a lane's dialect: on 8/4 a
name-based search of exactly this kind gave me four false alarms out of five.)

| | reaches him | loaded only | no trace | not for players |
|---|---|---|---|---|
| **banks** (95) | 15 | 8 | 72 | — |
| **engine** (110) | 72 | 9 | 14 | 15 |

### The bucket that matters: SEVENTEEN FINISHED THINGS NO PLAYER CAN SEE

They ship, they work, they are gated — into `slices/BOHEMIA_RUN_CURRENT.html`,
which the alpha loads and **never displays**.

| | |
|---|---|
| `banks/BOHEMIA_PERIMETER_8_2_26.txt` | **the eleven perimeter walls Paolo judged and approved on 8/2** |
| `banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt` | 3.63 MB of interior dressing |
| `engine/bohemia_resolve.js` | **THE SENTENCE** — one button, act, spend time, resolve |
| `engine/bohemia_quest_runtime.js`, `bohemia_bq.js` | the quest runtime + parser |
| `engine/bohemia_loop.js` | the driven engine |
| `engine/bohemia_garage.js`, `bohemia_crypt.js` | interiors |
| `banks/BOHEMIA_GRIME_8_3_26.txt`, `OPENINGS_8_2_26`, `CIVIC_OPENINGS_8_3_26` | approved art from the last four days |


> **THIS NUMBER MOVES, AND THAT IS THE POINT.** It was **17** when written; after merging the same day's other lanes it was **28**. Nobody did anything wrong — new finished work keeps landing in the invisible file because nothing was watching. `python3 tools/bohemia_reachability_census.py` for the live count; `records/BOHEMIA_REACHABILITY_CENSUS.md` always holds it.

**This is not a failure list. It is a work-already-paid-for list** — and at the
start of an eleven-month run, that is the most valuable list there is.

---

## WHAT THE NUMBERS DO NOT SAY

A census that overclaims is worse than none, so:

- **`NO TRACE` is strong evidence, not proof.** A bank whose art is *transformed*
  before shipping — re-encoded, recoloured, re-tiled — reads as NO TRACE while
  genuinely reaching him. The four `HD_TILE_REPO` parts (180 MB, two thirds of
  the whole corpus) are almost certainly this.
- **20 of the 72 NO TRACE banks are CANDIDATE / VERDICT / JUDGE pools**, where
  only an approved subset was ever meant to ship. NO TRACE there is correct.
- **A derived bank reads NO TRACE correctly too.** `BOHEMIA_WARDROBE_CANON` is
  *extracted from* the alpha, so its rows never ship back into it.
- The **MB figure is close to a tautology** — the corpus is 258 MB and the shown
  surface is 29 MB, so most of it cannot fit by arithmetic. The **counts** are
  the finding; the megabytes are not.

Every source is named in `records/BOHEMIA_REACHABILITY_CENSUS.md` rather than
only counted, so the list can be argued with instead of taken on faith.

---

## THE INSTRUMENT WAS CALIBRATED BEFORE IT WAS BELIEVED

The first version sampled 8 payloads and printed a **binary** verdict — and the
door-anim bank came out `SHOWN` on one run and `NO TRACE` on another **off the
same bytes**, because a bank holds thousands of tiles and only some ship. A coin
flip wearing a claim's name: the exact bug that had four of this lane's gates
dead for a fortnight. Fixed to 32 samples **and to reporting the fraction**,
because "2 of 32 ship", "0 of 32" and "32 of 32" are three different facts and a
binary threw two of them away.

Then it was checked against four things verified **by hand** on 8/4, before the
tool existed. All four agree, and `gates/reachability_gate.js` keeps them as
permanent calibration claims — if the census ever disagrees with a hand check,
the census is broken, not the hand check.

| hand-verified 8/4 | census says |
|---|---|
| `bohemia_memory.js` unreached | `NO TRACE` |
| `bohemia_dress.js` unreached | `NO TRACE` |
| `bohemia_people.js` in the city | `SHOWN (all)` |
| `bohemia_agents.js` in the city | `SHOWN (part)` |

---

## THE GATE DOES NOT DEMAND THE NUMBER FALL

Wiring a bank into the walked world is real work with real ordering, and which
of the seventeen goes first is Paolo's and the owning lane's call. A gate that
failed until somebody wired them would be **a gate outranking a ruling**.

It demands the number stay **true**: the census must be fresh (re-run since the
surfaces last moved), must keep its own false-negative caveat so the counts never
read as certainty they have not earned, must not list ghosts, and must agree with
the hand checks. 16 claims, four mutations killed.
