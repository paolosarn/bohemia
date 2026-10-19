# TUNING [slightly harder, measured], set across the grid (10/18)

RESEARCH ONLY (rule 38g). DRAFT: THE GEAR IS NOT IN (rule 117(e)). Nothing in the game reads this page or its bank.

## His words and the rule

His YES on EASIER, MEASURED (tuning-easier-measured-10-18) with: "Make it just slightly harder than that." The coordinator: a small step, not halfway, about 70 in 100, the player still mostly winning (rule 117). Then his "what are you even testing?" and rule 117(e): set it across the grid, never on one average. So "slightly harder" is not one number: it is, for each company size and gear stage, the fight a player wins about 70 times in 100.

## How

- Battle Brothers moves how hard a fight is through HOW MANY come (records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md; GROK_60: the count and the tier), so the dial here is the party's size. Every per-fight lever stays at THE START he said YES to (your roll +5, theirs -5, a bad streak ends, their nerve 0.9, your breath 18).
- THE 70 LINE: for each company (1, 3, 6, 12, 14) and stage (early, middle, late), the most of them you beat 70 or more times in 100, found by halving between two of the grid's columns, 100 seeded fights a step (tools/bohemia_tuning_slightly_harder_grid.js on the grid's own bench). The noise at 100 fights is about 5 in 100 either way, so a line is "about".
- Beside it: what OUR MAP sends today at the start (party_math's job count at Beginner's 0.85, capped at 13) and what BATTLE BROTHERS' MAP sends (the same job count from one skull to three at Veteran, no cap).
- THE PROPOSAL keeps rule 117(a): the map sends the 70 line, never more than Battle Brothers' three-skull count for that company at that stage.
- **THE LINES ASSUME OUR START'S LEVERS, AND THE FIGHT DOES NOT READ THEM YET** (found 10/19, records/BOHEMIA_TUNING_THE_FIRST_HOUR_10_19_26.md: no hit-roll shift, streak help, enemy nerve, breath or Beginner count in slices/BOHEMIA_FIGHT.html). At the game as it plays (the grid's TODAY column) the same counts are won far less often; the lines hold once COMBAT builds the levers. And the street's hand-overs send nine whatever the line says until RUN's one line in nfOpts() lands.

## The 70 line

| who | your men | stage | your level | THE 70 LINE (won at it / one more) | OUR MAP SENDS today (won) | BATTLE BROTHERS SENDS | PROPOSED |
|---|---|---|---|---|---|---|---|
| PEOPLE | 1 | EARLY | 4 | 1 (91 / 66) | 2 (66) | 2 to 2 | 1 |
| PEOPLE | 1 | MIDDLE | 5 | 2 (75 / 45) | 2 (75) | 2 to 2 | 2 |
| PEOPLE | 1 | LATE | 9 | 2 (86 / 59) | 3 (59) | 2 to 3 | 2 |
| PEOPLE | 3 | EARLY | 1 | 3 (82 / 58) | 2 (98) | 2 to 4 | 3 |
| PEOPLE | 3 | MIDDLE | 5 | 5 (81 / 67) | 5 (81) | 4 to 7 | 5 |
| PEOPLE | 3 | LATE | 9 | 5 (88 / 65) | 9 (24) | 6 to 10 | 5 |
| PEOPLE | 6 | EARLY | 1.7 | 7 (81 / 61) | 5 (97) | 5 to 9 | 7 |
| PEOPLE | 6 | MIDDLE | 5 | 11 (74 / 65) | 9 (88) | 9 to 14 | 11 |
| PEOPLE | 6 | LATE | 9 | 11 (79 / 66) | 13 (60) | 12 to 20 | 11 |
| PEOPLE | 12 | EARLY | 1.4 | 13 (71 / 61) | 9 (96) | 10 to 17 | 13 |
| PEOPLE | 12 | MIDDLE | 5 | 26 (70 / 52) | 13 (99) | 17 to 28 | 26 |
| PEOPLE | 12 | LATE | 9 | 24 (76 / 58) | 13 (100) | 25 to 41 | 24 |
| PEOPLE | 14 | EARLY | 1.5 | 17 (74 / 62) | 10 (100) | 12 to 20 | 17 |
| PEOPLE | 14 | MIDDLE | 5 | 26 (84 / 68) | 13 (99) | 20 to 33 | 26 |
| PEOPLE | 14 | LATE | 9 | 27 (76 / 68) | 13 (100) | 29 to 47 | 27 |
| DIRE WOLVES | 1 | EARLY | 4 | 0: one of them already beats you more than 3 times in 10 | 2 (1) | 2 to 2 | no map yet |
| DIRE WOLVES | 1 | MIDDLE | 5 | 1 (100 / 10) | 2 (10) | 2 to 2 | no map yet |
| DIRE WOLVES | 1 | LATE | 9 | 2 (100 / 58) | 3 (58) | 2 to 3 | no map yet |
| DIRE WOLVES | 3 | EARLY | 1 | 1 (98 / 51) | 2 (51) | 2 to 4 | no map yet |
| DIRE WOLVES | 3 | MIDDLE | 5 | 4 (78 / 40) | 5 (40) | 4 to 7 | no map yet |
| DIRE WOLVES | 3 | LATE | 9 | 9 (77 / 63) | 9 (77) | 6 to 10 | no map yet |
| DIRE WOLVES | 6 | EARLY | 1.7 | 3 (89 / 40) | 5 (16) | 5 to 9 | no map yet |
| DIRE WOLVES | 6 | MIDDLE | 5 | 9 (71 / 49) | 9 (71) | 9 to 14 | no map yet |
| DIRE WOLVES | 6 | LATE | 9 | 60 or more (the search stops at 60) (86 / 92) | 13 (99) | 12 to 20 | no map yet |
| DIRE WOLVES | 12 | EARLY | 1.4 | 6 (78 / 48) | 9 (8) | 10 to 17 | no map yet |
| DIRE WOLVES | 12 | MIDDLE | 5 | 33 (76 / 68) | 13 (99) | 17 to 28 | no map yet |
| DIRE WOLVES | 12 | LATE | 9 | 60 or more (the search stops at 60) (98 / 98) | 13 (100) | 25 to 41 | no map yet |
| DIRE WOLVES | 14 | EARLY | 1.5 | 7 (82 / 58) | 10 (20) | 12 to 20 | no map yet |
| DIRE WOLVES | 14 | MIDDLE | 5 | 60 or more (the search stops at 60) (82 / 80) | 13 (99) | 20 to 33 | no map yet |
| DIRE WOLVES | 14 | LATE | 9 | 60 or more (the search stops at 60) (98 / 100) | 13 (100) | 29 to 47 | no map yet |

## What moved, in the one table

- party_math job.max (13, ours draft) becomes the 70 line at the largest company and stage; the rows below are the people's proposal.
- EARLY: enemies per point of roster score at the 70 line, median 0.102 (from 4 companies, spread 0.1 to 0.11); party_math's job today is 0.1 a point at two skulls.
- MIDDLE: enemies per point of roster score at the 70 line, median 0.103 (from 5 companies, spread 0.093 to 0.12); party_math's job today is 0.1 a point at two skulls.
- LATE: enemies per point of roster score at the 70 line, median 0.074 (from 5 companies, spread 0.064 to 0.077); party_math's job today is 0.1 a point at two skulls.

[bb Battle Brothers makes a fight harder by sending more of them, and grows the party with your company; the 70 line is that dial set so the player still mostly wins.]
[analog horror: the fight a player wins 70 times in 100 still loses a man in some of them; the loss is the scene, named for SOUNDS.]
