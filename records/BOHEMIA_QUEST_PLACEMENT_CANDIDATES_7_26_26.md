# BOHEMIA — QUEST PLACEMENT CANDIDATES (7/26/26, WORLD lane)

**Status: [PENDING Paolo verdict].** These are PROPOSALS, not placements. Nothing in
the engine moved. MAP LAW: Claude never designs map layouts; this is the shortlist
Paolo picks from, and applying his pick is a separate turn on his verdict.

**Judge surface:** the alpha, LIFE tab -> WHERE THE QUESTS HAPPEN
(`slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html`) — the real valley from above
with a pin per option, three real cell renders per quest, tap one, export .txt.

## THE PROBLEM THIS ANSWERS
The casting bridge already puts every quest somewhere real: it reads the quest's own
`@ROLE ... faction=X` and drops the quest on that faction's base district. Correct
plumbing. But faction bases are an even stride across the district list and the valley
is 70% suburb, so **all nine canon quests currently happen in a generic suburb tract** —
the flood-tunnel quest, the power-skim quest and the smuggling quest all read as the
same street.

## HOW THE CANDIDATES ARE DERIVED (nothing invented)
`engine/bohemia_quest_placement.js` crosses three things that already exist:
1. the quest's **own prose** (its `@LOG` / `@SAY` / `@OBJ` / `@OPT` lines),
2. each district's **own dossier** (`records/tilespec/BOHEMIA_TILESPEC_*.md`, generated
   from that district module's own NOTES + LEGEND),
3. the **already-generated valley** (`bohemia_world.js` cells + who really holds them).

The fit score is tf-idf with the idf squared and a 40%-of-corpus common-word floor, so
the word that names the place ("tunnel", "church", "cable") is the evidence and the word
every dossier shares ("people", "door", "block") is a rounding error. Scarce settings go
to the quest with the strongest claim (the valley holds exactly one truck stop), and no
two quests are ever proposed the same cell.

Three options per quest:
- **WHERE IT IS NOW** — exactly what the shipped engine casts today. The anchor Paolo
  compares against; the gate proves it can never drift from the live cast.
- **BEST SETTING** — the district whose own dossier owns the quest's own words, nearest
  cell of that kind.
- **SHORT WALK** — the best-fitting different setting within 10 cells, so the errand
  stays in the neighbourhood.

## ONE VALLEY (fixed the same turn)
The MAP tab was rendering seed `1337` while the game boots the text seed `bohemia`
(= `2691674296`). Two different valleys: the map Paolo explored was never the map his
quests were cast into. The MAP tab is now pinned to the engine's own hash of the loop's
seed, machine-locked in `gates/map_tab_gate.js`.

## THE CANDIDATES

### 1. The Meter Reader  (`S01_THE_METER_READER.bq`)

Needs: Trades  ·  pickup: over the phone  ·  speaker role: lineman

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X29 Y77 | Trades | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Trades base tile, and the quest's own required role asks for Trades, so the faction really holds this ground. The setting is a suburb cell at 29,77. Its words match suburb at a fit of 2.11 (the best-fitting district in the valley scores 3.12). |
| BEST SETTING | wash | X19 Y67 | nobody | BEST SETTING MATCH. The quest's own lines use "tunnel", "people", "toward", "against", "whole" and "both", and those are wash words, straight out of that district's own dossier. It is the nearest wash cell to where the quest sits now: 10 cells away, at 19,67. Nobody holds that ground yet, so putting Trades business there is a claim, not a home game. |
| SHORT WALK | watertreat | X20 Y80 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A watertreat cell 9 cells out at 20,80, matching on "plant", "water", "order", "turn", "grid" and "runs". Nobody holds that ground yet, so putting Trades business there is a claim, not a home game. |

### 2. The Same Crate Twice  (`S02_THE_SAME_CRATE_TWICE.bq`)

Needs: Reds  ·  pickup: over the phone  ·  speaker role: red_boss

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X4 Y65 | Reds | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Reds base tile, and the quest's own required role asks for Reds, so the faction really holds this ground. The setting is a suburb cell at 4,65. Its words match suburb at a fit of 2.03 (the best-fitting district in the valley scores 2.68). |
| BEST SETTING | storage | X11 Y53 | nobody | BEST SETTING MATCH. The quest's own lines use "closed", "open", "both", "double", "systems" and "faces", and those are storage words, straight out of that district's own dossier. It is the nearest storage cell to where the quest sits now: 12 cells away, at 11,53. Nobody holds that ground yet, so putting Reds business there is a claim, not a home game. |
| SHORT WALK | commercial | X8 Y62 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A commercial cell 4 cells out at 8,62, matching on "delivery", "nothing", "toward", "cells", "door" and "open". Nobody holds that ground yet, so putting Reds business there is a claim, not a home game. |

### 3. One More Set  (`S03_ONE_MORE_SET.bq`)

Needs: Colorful  ·  pickup: over the phone  ·  speaker role: busker

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X26 Y33 | Colorful | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Colorful base tile, and the quest's own required role asks for Colorful, so the faction really holds this ground. The setting is a suburb cell at 26,33. Its words match suburb at a fit of 0.76 (the best-fitting district in the valley scores 2.77). |
| BEST SETTING | wash | X21 Y43 | nobody | BEST SETTING MATCH. The quest's own lines use "people", "live", "whole", "strip", "land" and "life", and those are wash words, straight out of that district's own dossier. It is the nearest wash cell to where the quest sits now: 10 cells away, at 21,43. Nobody holds that ground yet, so putting Colorful business there is a claim, not a home game. A closer fit (truckstop) exists but every cell of it is already proposed for another quest, so this one stepped down rather than stack two errands on one tile. |
| SHORT WALK | school | X34 Y37 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A school cell 8 cells out at 34,37, matching on "play", "part", "ever", "empty", "gone" and "life". Nobody holds that ground yet, so putting Colorful business there is a claim, not a home game. |

### 4. What Cries in the Deep  (`S04_WHAT_CRIES_IN_THE_DEEP.bq`)

Needs: Homeless  ·  pickup: IN PERSON ONLY  ·  speaker role: elder

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X6 Y46 | Homeless | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Homeless base tile, and the quest's own required role asks for Homeless, so the faction really holds this ground. The setting is a suburb cell at 6,46. Its words match suburb at a fit of 2.72 (the best-fitting district in the valley scores 6.34). |
| BEST SETTING | wash | X19 Y43 | nobody | BEST SETTING MATCH. The quest's own lines use "tunnel", "homeless", "people", "lead", "moved" and "below", and those are wash words, straight out of that district's own dossier. It is the nearest wash cell to where the quest sits now: 13 cells away, at 19,43. Nobody holds that ground yet, so putting Homeless business there is a claim, not a home game. |
| SHORT WALK | commercial | X6 Y44 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A commercial cell 2 cells out at 6,44, matching on "deep", "toward", "gone" and "onto". Nobody holds that ground yet, so putting Homeless business there is a claim, not a home game. |

### 5. The Standing Bounty  (`S05_THE_STANDING_BOUNTY.bq`)

Needs: Remnants  ·  pickup: over the phone  ·  speaker role: quartermaster

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X78 Y70 | Remnants | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Remnants base tile, and the quest's own required role asks for Remnants, so the faction really holds this ground. The setting is a suburb cell at 78,70. Its words match suburb at a fit of 0.48 (the best-fitting district in the valley scores 2.25). |
| BEST SETTING | golf | X58 Y73 | nobody | BEST SETTING MATCH. The quest's own lines use "away", "full", "water", "path" and "whole", and those are golf words, straight out of that district's own dossier. It is the nearest golf cell to where the quest sits now: 20 cells away, at 58,73. Nobody holds that ground yet, so putting Remnants business there is a claim, not a home game. |
| SHORT WALK | storage | X73 Y79 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A storage cell 9 cells out at 73,79, matching on "double", "closed", "systems", "people", "wire" and "runs". Nobody holds that ground yet, so putting Remnants business there is a claim, not a home game. |

### 6. Behind the Fence  (`S06_BEHIND_THE_FENCE.bq`)

Needs: nobody in particular  ·  pickup: over the phone  ·  speaker role: neighbor

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X61 Y41 | nobody | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. The quest names no faction, so the engine picks a real district by the quest's own id. The setting is a suburb cell at 61,41. Its words match suburb at a fit of 3.2 (the best-fitting district in the valley scores 3.2). |
| BEST SETTING | jail | X39 Y26 | nobody | BEST SETTING MATCH. The quest's own lines use "yards", "wall", "held", "double", "public" and "yard", and those are jail words, straight out of that district's own dossier. It is the nearest jail cell to where the quest sits now: 22 cells away, at 39,26. Nobody holds that ground yet. |
| SHORT WALK | wash | X55 Y43 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A wash cell 6 cells out at 55,43, matching on "people", "against", "whole", "live", "step" and "door". Nobody holds that ground yet. |

### 7. Say It Back  (`S07_SAY_IT_BACK.bq`)

Needs: Church  ·  pickup: over the phone  ·  speaker role: dying

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X33 Y26 | Church | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Church base tile, and the quest's own required role asks for Church, so the faction really holds this ground. The setting is a suburb cell at 33,26. Its words match suburb at a fit of 0.96 (the best-fitting district in the valley scores 3.92). |
| BEST SETTING | truckstop | X56 Y88 | nobody | BEST SETTING MATCH. The quest's own lines use "instead", "right", "stay", "long", "feed" and "proper", and those are truckstop words, straight out of that district's own dossier. It is the nearest truckstop cell to where the quest sits now: 62 cells away, at 56,88. Nobody holds that ground yet, so putting Church business there is a claim, not a home game. |
| SHORT WALK | chapel | X42 Y26 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A chapel cell 9 cells out at 42,26, matching on "church", "long", "faith" and "feeds". Nobody holds that ground yet, so putting Church business there is a claim, not a home game. |

### 8. The Toll Road  (`S08_THE_TOLL_ROAD.bq`)

Needs: Caravans  ·  pickup: over the phone  ·  speaker role: hauler

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X26 Y12 | Caravans | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. This is the Caravans base tile, and the quest's own required role asks for Caravans, so the faction really holds this ground. The setting is a suburb cell at 26,12. Its words match suburb at a fit of 1.08 (the best-fitting district in the valley scores 3.86). |
| BEST SETTING | wash | X20 Y43 | nobody | BEST SETTING MATCH. The quest's own lines use "standing", "against", "people", "moved", "road" and "carries", and those are wash words, straight out of that district's own dossier. It is the nearest wash cell to where the quest sits now: 31 cells away, at 20,43. Nobody holds that ground yet, so putting Caravans business there is a claim, not a home game. A closer fit (truckstop) exists but every cell of it is already proposed for another quest, so this one stepped down rather than stack two errands on one tile. |
| SHORT WALK | storage | X24 Y10 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A storage cell 2 cells out at 24,10, matching on "open", "systems", "people", "past", "both" and "faces". Nobody holds that ground yet, so putting Caravans business there is a claim, not a home game. |

### 9. The Back Door  (`S09_THE_BACK_DOOR.bq`)

Needs: nobody in particular  ·  pickup: over the phone  ·  speaker role: neighbor

| option | district | cell | held by | why |
|---|---|---|---|---|
| WHERE IT IS NOW (the live cast) | suburb | X69 Y62 | nobody | WHERE IT IS NOW. The engine already casts this quest here, so this is the live build you are comparing against. The quest names no faction, so the engine picks a real district by the quest's own id. The setting is a suburb cell at 69,62. Its words match suburb at a fit of 2.29 (the best-fitting district in the valley scores 2.5). |
| BEST SETTING | industrial | X77 Y62 | nobody | BEST SETTING MATCH. The quest's own lines use "backing", "door", "whole", "first", "around" and "wall", and those are industrial words, straight out of that district's own dossier. It is the nearest industrial cell to where the quest sits now: 8 cells away, at 77,62. Nobody holds that ground yet. A closer fit (truckstop) exists but every cell of it is already proposed for another quest, so this one stepped down rather than stack two errands on one tile. |
| SHORT WALK | park | X65 Y64 | nobody | SHORT WALK. The best-fitting setting within 10 cells of where the quest sits now, so the errand stays in the neighbourhood. A park cell 4 cells out at 65,64, matching on "place", "around" and "first". Nobody holds that ground yet. |

## WHAT HAPPENS ON A VERDICT
- **PICK** on a quest: that cell becomes its placement (a `placements` override the
  casting bridge reads, applied next WORLD turn, gate extended to prove it).
- **NONE OF THESE**: the quest keeps the live cast and goes back in the pot with his note.
- Bulk silence is a verdict (UNJUDGED-IS-DEAD, 7/26): unpicked stays where it is.

**Gate:** `gates/quest_placement_gate.js` (registered as QUEST PLACEMENT) proves the
candidates are real cells, the anchor equals the live cast, two runs are byte-identical,
nothing stacks, and the judge page is fresh + reachable from inside the alpha.
