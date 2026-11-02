# NO TOWN HAD ANY JOBS (PLUMBER 3, 11/2/26, rule 335, ask line 335)

PAOLO 11/2, playing the live build: "now I have an issue where no one has any jobs anymore. I don't know why, it's annoying,
so fix that and make sure it doesn't happen again."

## HOW IT WAS REPRODUCED

Probes on the live code (Playwright, the demo and the alpha on an upright phone 390 x 844), every one of the fourteen home bases
opened through the map's own door (loopOpenTown), the board opened by a tap, the people on it counted, and the deal asked
directly (BohemiaBoardShelf.pick with the place, the day, the traits, the held and the done):

| case | boards with no work |
|---|---|
| a new game, day 1, 10 and 40 (demo and alpha) | 0 of 14 |
| an OLD SAVE (made on BUILD 11/3zd, before the campaign seed: the old files served over the new tree, a job taken, day 5) | 0 of 14 |
| the Lone Wolf, after every danger read is in | 0 of 14 |
| the old save's crew cut to one man, after the reads | 0 of 14 (one job each) |
| **the old save, every town RAIDED, after the board's own danger reads for its crew of three are in** | **13 of 14** |

The first rows were measured before the danger reads finished: until a job is read, the floor lets it through, so a probe that
looks in the first minute sees full boards. A game that has been running a while has every read in. Waiting for the reads:
the same save on the same crew on day 5 posts **450 of 700** job-and-town pairs on BUILD 11/3zd and **297 of 700** on the build he
played; the median job read went from 0.54 to 0.33.

## THE COMMITS THAT MOVED IT

The same hand-over (the save's crew of three against three brigand thugs, `BohemiaJobDanger.probe`, 40 runs, one seed), on each
build (the build's own files served over the tree):

| build | 3 thugs, clean runs | 5 thugs |
|---|---|---|
| 11/3zd b923848e (before) | 0.80 | 0.39 |
| a0beb846 (just before 49666e21) | 0.80 | 0.39 |
| **11/3zg 49666e21 COMBAT: HEIGHT IS ACCURACY, NEVER A WALL; AUTO PLAYS SMART** | **0.64** | 0.35 |
| **11/3zm 02a94193 COMBAT: CLIMB OR ATTACK** | **0.54** | 0.24 |
| 11/3zs a2bea2cf (the build he played) | 0.55 | 0.33 |

Per fight kind, every band of the same size and faction reads harder (a wave of three 0.75 to 0.54, a camp of six 0.37 to 0.19,
a road band of five 1.0 to 0.21). The road's own chance (WORLD 4's whole trip) did not move (0.036 both). Those two COMBAT rounds
are rulings of his (rules 321, 322, 328); the fight getting harder is not the bug.

## THE ROOT CAUSE

`slices/bohemia_board_shelf.js` deals each place its jobs and asks the day's floor of every one (WORLD rule 255,
`slices/bohemia_job_danger.js` fits(): through day ten no job the crew wins under half its runs, then the floor falls to nothing at
day fifty). A job under the floor was skipped, and **nothing stood under the floor**: the deal's own "a board is never empty" pass
asked the same floor, so a place whose every job read under it posted nothing. A RAIDED place only ever deals the four raid jobs
(fights of three to six men: on his crew of three every one reads 0.01 to 0.27), so every raided town went empty the moment its
reads were in, and with the fights harder, any town on a thin crew could follow. The board and the phone both read that one deal,
so both went quiet together.

A second hole of the same kind: a job he finished, lost or dropped leaves every board for good (LOOP.doneIds) and the shelf has
fifty, so a long game empties a tier's whole pool the same way.

## THE FIX (at the root, in the deal)

`slices/bohemia_board_shelf.js` pickOwn: **the floor THINS a board, it never EMPTIES one.**
1. A raided place whose raid jobs are all past what the day lets his company take posts its own ordinary work instead.
2. Only in the deal's LAST pass (after a place with nothing has taken a job another place also shows, the floor still asked), or
   for a place dealt alone: a place whose every job the floor kept back posts the least dangerous of them (the highest read; its
   red stars and its blood still say how bad it is). A first cut fired this mid-deal and the day-fifty gate caught it at once (the
   Lone Wolf on day 20 handed a job worth 0.08 while a safe one stood on another board); in the last pass it fires only when no
   job the floor lets through exists for that place anywhere, so rule 255 stands.
3. A place whose every job is done posts the one he finished longest ago. Held jobs never come back: the town's board and the phone
   now hand the done list apart from the held list (`opt.done`), and the deal's memory key carries it.

The settlement's board (`slices/BOHEMIA_SETTLEMENT_SCREEN.html` boardHere) and the phone (`slices/bohemia_phone_board.js` asks) pass
`held` and `done` apart. Nothing else moved: a board with work deals exactly as before.

## THE GATE

`gates/the_boards_always_have_work_gate.js`, THE BOARDS ALWAYS HAVE WORK, in the suite (24 passed, 0 failed, about 7 minutes):
- the shelf's own file in node over 168 valleys of 14 places (no trait, raided, sick, market day, both, mixed; days 1 to 80; no
  floor, a floor that keeps back every job read and unread, half): every place offers work; a held job never on a board; every job
  done still leaves one; the floor keeping back everything posts the least dangerous; the floor still stands (while a place has
  a job the floor lets through, nothing under it is posted there); MUTATION: the last-job rule cut out of the file, the same
  valleys go empty (14 of 14), so the gate bites
- the demo on his phone, three phones side by side: a NEW GAME (a rolled campaign code), a typed code (K7QM9X), and AN OLD SAVE
  (gates/fixtures/old_save_11_3zd.json: a phone's whole storage after a game played on 11/3zd, before the seed; a job held, a job
  finished): every home base through the map's door, its board opened by a tap, at least one person, every person says his job
  with Take it; the old save's held job on top and never offered; every place raided after the danger reads (the measured case):
  every board offers work; the phone lists jobs; nothing threw

Verified after the fix: the old save, every town raided, reads in: 14 of 14 boards offer a job (was 13 of 14 empty).

## THE SUITE ITSELF WAS DOWN (mended on the way)

`gates/bohemia_gates.py` refused to run ANY gate ("THE GATE TABLE IS MALFORMED"): three rows on main carried three fields, not
four (THE FIGHT SAVES AT ITS START and THE NEW ENEMIES since 9dc46b6d, NOTHING POPS, VOICES CLEAR, TOOLTIPS since UI's 1b3e5f98).
Each given its missing `slow` flag (False, the runner's own instruction). SUITE HONESTY went from 12 passed 14 failed to 26 / 0;
`--only HANDOFF` runs again.

## OTHER GATES RUN

- THE BOARD'S QUESTS ARE PEOPLE 16/0, DROP A JOB RIGHT IN THE TOWN 9/0 (on the rebased tree).
- THE DANGER RAMPS TO DAY FIFTY: each of its 16 cases reads every job (3 to 8 minutes a case; the whole gate is far past the suite's
  600 s cap on main as well). Eight cases measured on the final code, every one with NO empty board and its worst job at or over the
  day's floor: the Lone Wolf day 1 (worst 0.53, floor 0.5), 10 (0.59), 20 (0.44, floor 0.375), 25 (0.33, floor 0.31), 50 and 80
  (no floor); a new crew day 1 (0.52) and day 10 (0.54). The first cut of the fix (the last job mid-deal) handed the Lone Wolf a job
  worth 0.08 on day 20 in this gate; that is why the rescue lives in the deal's last pass.
- THE PHONE'S BOARD (gates/the_phones_board_gate.js, NOT in the suite) is red on its face and tap legs (172 words on the glass,
  cards 0 x 0, the take never lands) and its two lists match apart from WORLD 4's COME BACK / PAID THERE words on the board's rows:
  drift from UI's and WORLD 4's rounds, not this change (its deal legs read the same pick, which deals as before wherever a board
  has work).
