# BOHEMIA — THE FIRST COMPLETE GATE PICTURE IN DAYS (8/19/26)

**For every lane. 386 of 386 gates run. 29 red. Nothing skipped, nothing guessed.**

## 1. HOW IT WAS TAKEN

Three sharded runs, back to back, on one tree (`ecdcc8b`):

| run | owned | ran | wall clock | unrun |
|---|---|---|---|---|
| `--shard 1/3` | 129 | **129** | 1490s | **0** |
| `--shard 2/3` | 129 | **129** | 1468s | **0** |
| `--shard 3/3` | 128 | **128** | 2127s | **0** |
| **total** | **386** | **386** | ~85 min | **0** |

`129 + 129 + 128 = 386`, which is the table exactly — **every gate ran, and
every gate ran once.** That is the sharding claim proved on real runs rather than
in dry-run arithmetic.

Before today this was not obtainable: the suite needed ~75 minutes in one sitting
and a container survives ~50, so it was killed mid-table and the last thing on
screen was a pass. See
`laws/BOHEMIA_ADDENDUM_A_SUITE_THAT_CANNOT_FINISH_8_19_26.md`.

**To reproduce:**
```
python3 gates/bohemia_gates.py --shard 1/3
python3 gates/bohemia_gates.py --shard 2/3
python3 gates/bohemia_gates.py --shard 3/3
```

## 2. THE 29 RED GATES, IN TABLE ORDER

| # | gate | what it guards (truncated) |
|---|---|---|
| 17 | DISTRICT FILL | the floor one level down |
| 28 | TRAFFIC SIGNAL | his 348-sprite signal set |
| 69 | DRIVE NETWORK | 7/31 RULE NUMBER ONE |
| 70 | ANSWERED FOR | 7/31: if I cannot write… |
| 93 | VOTE TAB | 8/7: "are u gonna have m…" |
| 99 | ROUND + DOORS | 8/2: "every time you mak…" |
| 144 | FRESH DOORS | he killed all ten doors 7/3 |
| 153 | SFX RENDER | the 60 candidates measured |
| 204 | DRESS | agents wear only the canon wardrobe |
| 212 | ROAD CELLS | the 3,386 road cells are real |
| 218 | ICON | an icon ships with every build |
| 219 | TOOLS RUN | every tool and gate parses — **times out at 600s** |
| 225 | BANNER | a module the sync sweep cannot see |
| 235 | SQUINT | every district is its own land |
| 236 | HUE | the colour measurement is locked |
| 242 | QUEST PLACEMENT | quest placement candidates |
| 244 | CURRENT SLICE | the live phone (SLICE tab) |
| 262 | MAP BOUND | nothing that scans the valley |
| 268 | THE RUN | the first connected run plays |
| 312 | ONE WORLD TAB | 8/2: one tab shows the world |
| 315 | INVISIBLE SCHEDULE | 7/31: a routine is FELT |
| 326 | NAV CLUSTER | 7/27: ONE movement UI |
| 337 | INTERIORS | walk into a building |
| 339 | MAP TAB | the MAP tab: the valley aerial |
| 343 | REUSE FIRST | every art-cooking tool documents a REUSE CHECK |
| 354 | TASTE | the Paolo taste canon |
| 356 | ART 45 | original art is three-quarter |
| 364 | HERO WIRE | approved district heroes drawn |
| 377 | RF4 TEARDOWN | 8/17 |

**357 green, 29 red — 92.5%.**

## 3. WHAT THIS DOCUMENT IS NOT

**It is not an assignment of blame, and not a triage.** The FACTIONS lane took the
picture because it fixed the runner; it has not diagnosed any of these 29 and does
not own most of them. Several were already known and recorded by other lanes
(BANNER's doubled modules, TASTE and REUSE FIRST's missing check blocks, SFX
RENDER, DRESS, ROAD CELLS).

**It is a baseline.** Until today no lane could tell whether a red was theirs or
already there, because no run reached the end. Now there is a list to check
against.

## 4. ONE OBSERVATION WORTH ACTING ON

`TOOLS RUN` (#219) **times out at its full 600s cap on every single run** and has
for a while — it spawns `bohemia_district_hero_factory.py`, measured at 31
minutes. So it is simultaneously the most expensive gate in the repo (**600s of
every shard that holds it**) and permanently red, which means it is holding
nothing while costing the most.

Its purpose is good and worth keeping — "a syntax error shipped green on 7/28
because nothing ever ran the factory." The cheap half (does every tool and gate
parse) is fast. Whoever owns it may want to bound or separate the factory
reproduction so the parse check can go green and stay useful.

**Not touched here.** ONE SYSTEM, ONE SESSION.

## 5. NONE OF THE 29 IS THE FACTIONS LANE'S

COMMITMENT (72/72), CLAIM (45/45), FAVOUR (31/31), CARD FOLD (11/11), BELONGING
(58/58), TIES (40/40), INTRODUCTIONS (46/46), WALKED SURFACE (8/8) and SUITE
HONESTY (19/19) are all green in this run.

Taken on `ecdcc8b`.
