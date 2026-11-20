# JOBS: A NAME FADES, AND A NEW COMPANY IS A STRANGER, 11/20/26 (VAMILY rules 461, 441, 454(a); the handoff's next job)

THE ASK: rule 461, the handoff's next job after row 574: Battle Brothers' daily Renown decay (the handoff's NEXT since 11/18). No line
a person speaks is new or rewritten (rule 454(a)); no new words in this build (the board's line is 11/18's).

## 1. A NAME FADES
HOW BATTLE BROTHERS DOES IT: 'Daily Renown Decay -3' (bb_all/1679, the Renown page's own table), beside +25 a contract done: a company
that stops working is forgotten, and the work its name opened closes again.
MEASURED FIRST: ours never faded: CLOUT only rose (a job +100, a won fight +5 a man) or fell by a dropped or failed job.
OURS: records/target/bb/job_clout.json fade = 3 (the wiki's number; TUNING's one table job_clout.fade); slices/bohemia_job_kinds.js
__A_NAME_FADES__: every day the map's own clock has passed since he last moved takes 3 CLOUT on his next step (BohemiaRenown.add, RUN
TWO's door; never under 0), kept by campaign in bohemia.clout.fade.v1 (a new campaign or a clock behind it starts the count again). The
shelf hands the number with its CLOUT needs (bohemia_board_shelf.js clout_fade). A job done here is +100, so a day's fade is a
thirty-third of a job (the wiki's an eighth): the same direction, gentler, TUNING's to move.
WHAT IT DOES TO THE BOARDS (11/18's THE BIG WORK WAITS FOR A NAME): a fortress's two-skull work opened at 250 CLOUT closes again when the
name fades under it: 260 CLOUT and five quiet days is 245, and the board says MORE WORK HERE AT 250 CLOUT again.
A GAP IN 11/18'S LINE, FOUND AND FIXED: the board's line was set only when the shelf dealt that place a new board (pickOwn); a board held
whole from what it posted for its window never ran it and showed no line. waits(name, tier, day) now works the line out each time the
board asks (the place's own work that waits, its least need against his CLOUT); gate THE TOWN'S BOOK E1 and E2 read it so.

## 2. A NEW COMPANY IS A STRANGER (found on the way: a bug he can feel)
MEASURED: the start screen's NEW GAME (forget(), slices/BOHEMIA_ALPHA_0_9.html) wipes the old company's hires, its CLOUT and twenty other
records, but not: the towns' opinion of it (bohemia.relations.v1; since 11/17 it sets a town's prices and its board, so a new company
walked into a town that still held the last one's grudge), the clients it pushed away (bohemia.haggle.v1: a person the old company
pushed too far stayed off a new game's board for that window), its finished jobs still on their way to their towns
(bohemia.job.settled.v1: the old company's -20 could land on a new company's first visit), and now the fade's day.
OURS: the four are on the forget list (marked JOBS 11/20, __A_NEW_COMPANY_IS_A_STRANGER__). The title and its NEW GAME are the demo's
alone: the workshop (the alpha) opens on VOTE after its loading screen (rule 18, the vote tab law) and has no NEW GAME (BOH_TITLE.skipped
'workshop'); the alpha's legs say so.

## 3. PROOF
GATE: gates/a_name_fades_gate.js, in the suite as A NAME FADES.
- N1 the files (the wiki's -3 read out of the tarball; TUNING's row; the step; the shelf; the board's own line; the forget list).
- N2 the fade lifted out and run: nothing on the first step or twice a day, 15 after five days, 85 to 0 after 34 more (never under 0), a
  new campaign or a clock behind it starts again.
- N3 ON HIS PHONE (tools/bohemia_jobs_a_name_fades_on_the_phone.js; the demo and the alpha, upright and sideways; a new crew, K7QM9X):
  260 CLOUT (the one shortcut, said), five days on the map's own clock (advance, a day at a time: the clock alone moves nothing until he
  moves), a step: 245; Caravans' board with a finger: 'MORE WORK HERE AT 250 CLOUT · YOU HAVE 245'. Then the old company's town bar
  (Caravans 10), a pushed-away client, a settled job and the fade's day over a save; the page opened again; NEW GAME tapped twice on the
  title (the second confirms over the save): all four records gone, CLOUT with them (the demo; the alpha has no title, said).
RESULT: N1, N2, N4 ok; N3 the four phones: demo up and side, alpha up and side: day 1 to 6, CLOUT 260 (260 still until he moves), a
step: 245 (faded 15), a second step 245; Caravans [MORE WORK HERE AT 250 CLOUT · YOU HAVE 245]; the demo's NEW GAME over a save: 4 of 4
gone both ways; the alpha: no title (the workshop). The gate's first run caught its own test asking the alpha for a title it never had;
the test now reads the workshop's mark, and the gate's N3 rule was run again on the four saved walks (0 bad) and on two planted faults
(a demo record left behind, an alpha with no mark: 2 bad). THE TOWN'S BOOK with JOBS_BUILD=E (11/18's label, now from waits()): 13/0,
the four phones.

[bb Battle Brothers: Daily Renown Decay -3; a quiet company is forgotten]
[analog horror: nobody says your name out loud any more; the fortress gate stays shut and they do not tell you why]
