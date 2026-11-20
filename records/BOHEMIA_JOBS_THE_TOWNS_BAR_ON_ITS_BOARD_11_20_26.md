# JOBS: THE TOWN'S BAR ON ITS BOARD, 11/20/26 (VAMILY rules 461, 441, 454(a); the handoff's next job since 11/17)

THE ASK: rule 461, the handoff's next job: the town's bar on its own board. No line a person speaks is new or rewritten (rule 454(a));
the line is the arrival card's own words, and three marks, draft.

## 1. MEASURED FIRST
- A town's bar (bohemia.relations.v1, Battle Brothers' Relations, bb_all/1670) sizes its board since 11/17 (relations.json board,
  BohemiaJobPay.board: below Neutral two skulls at most, at Hostile one one-skull job, from Friendly up one more, never over four) and
  bends every offer's pay (job_pay.json standing, said on each offer). The board itself never said the bar: it flashed on the arrival
  card ('WHAT THEY THINK OF YOU: COLD') for a moment and sat in the phone's RELATIONS app.
- A BUG ON THE WAY (a board that does not follow the bar): the shelf's deal is cached by a key (the window, the day, held and done
  jobs, the crew, the CLOUT level, the places) that did not carry the bars, so a board dealt at one bar kept that size after the town's
  bar moved until something else changed the key. Measured in the page, one window, the same ask twice with only the bar moved:
  Anarchists 2 people at Neutral and 2 at Friendly with the cache, 2 and 3 without it.
- THE FRIEND'S EXTRA JOB IS NOT ALWAYS THERE: a new crew's floor (WORLD's fits) passes few jobs, so a friendly board can have no extra
  job to post: Caravans (a fortress, 3 a board) posted 2 people at Neutral and 2 at Friendly in late windows. Probed over 21 windows and
  13 places (the cache busted): 173 boards where Friendly posts more, the fortresses only in the first window.

## 2. THE BUILD
HOW BATTLE BROTHERS DOES IT: a town's relation stands on its own screen, beside its contracts; a town that likes you has more work.
OURS:
- slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_TOWNS_BAR_ON_ITS_BOARD__: the board's own line under the person who keeps it: 'WHAT THEY
  THINK OF YOU: ' (the arrival card's words) + the band and the number (as the phone's RELATIONS says it) + the arrival card's rail,
  read by the reader the shelf sizes a board with (BohemiaJobPay.board), and what the bar does to this board in the offers' own marks:
  '· 1 JOB' and one red star at Hostile, '· UP TO' and two red stars from Threatening to Cold, '· +1 JOB' from Friendly up. EACH MARK IS
  SAID ONLY WHEN THE BOARD IN FRONT OF HIM KEEPS IT: a board he read stays what he read until its window turns, a job posted stays posted
  for its window, and the floor can leave a friend's extra job unposted; then the line says the band and the number only.
- slices/bohemia_board_shelf.js barsSig(): the deal's key carries the towns' record and the jobs on their way to it (read raw, no
  parse), so a board deals again the moment a bar moves; a posted job stays posted and a read board stays read, as before.
No number moved (the trust is 11/17's); no new talk.

## 3. PROOF
GATE: THE TOWN'S BOOK (gates/the_towns_book_gate.js), new legs H1 to H3.
- H1 the files. H2 the deal follows the bar on the shelf's own file (14 places, ten windows, each ask on a clean board, only the bar
  moved): Friendly posts more 140 of 140 and never less, Cold then no three-skull work, Hostile then one job; PLANTED (the old key) Friendly
  the same as Neutral 140 of 140, Cold with three-skull work 63, Hostile over one job 90.
- H3 ON HIS PHONE (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build H; the demo and the alpha, upright and sideways; a new crew,
  K7QM9X): Caravans' board opened with a finger at Hostile 5, Cold 34, Neutral 50 and Friendly 75 (each its own window): the line on the
  glass, its number the arrival card's, its rail at the number; '1 JOB' and one person, 'UP TO' two stars and no work over two skulls,
  nothing at Neutral, and at Friendly no '+1 JOB' because the board has no extra person to show. Anarchists at Neutral then Friendly: 2
  people, then 3 and '+1 JOB'; one window with only the bar moved: 2 then 3.
- PLANTED ON THE PHONE (the old key, one run, put back): Anarchists in one window 2 then 2, NOT OK.
RESULT: THE TOWN'S BOOK with JOBS_BUILD=A,H: H1 ok, H2 ok (above), H3 ok on the four phones (demo up and side, alpha up and side, the same
on each: Caravans 5 [HOSTILE 5 · 1 JOB] 1 person, 34 [COLD 34 · UP TO ★★] 2, 50 [NEUTRAL 50] 2, 75 [FRIENDLY 75] 2; Anarchists 50
[NEUTRAL 50] 2, 75 [FRIENDLY 75 · +1 JOB] 3; one window, only the bar moved, 2 then 3). Then JOBS_BUILD=A: 15/0.
FOUND ON THE WAY (my own gate, red since the valley's jobs changed under it): A4's friendly town was Network, a fortress; a new crew's
floor no longer leaves it a fourth job on days 4 and 7 (friendly +0 on all four phones; the windows differ, so the key change is not
it). A4 now asks Blues, a town the probe shows with its extra job: friendly +1 on all four phones.

[bb Battle Brothers keeps a town's relation on the town's own screen, and a town that likes you has more work for you]
[analog horror: the elder does not say it; the board does, in the same handwriting as the jobs]
