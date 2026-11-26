# JOBS 2 -- THE BOARD FITS, AND THE MOMENT IS SEEN AND HEARD (BUILD 11/26r - THE MOMENT HEARD), 11/26/26

VAMILY rule 482 (no lane stops at done): the coordinator's three for this round, 'the arrival at a job looks and sounds better, the
leftover jobs code cleaned out, and row 737 (the job board runs past its sheet upright with five long jobs) if FIXES 3 has not taken
it'. Rules 402, 441, 480, the 120 BPM law, the analog horror law.

## 1. ROW 737: THE JOB BOARD FITS ITS SHEET
FOUND BY FIXES 3 (THE FOURTEEN EYES F533: a town's board crowded to five jobs, the longest client names, a PAID THERE badge on each):
upright the sheet held 567 px in 547, on its side 305 in 299, so the board scrolled (rule 402).
MEASURED: on the dense board (UI 9's #sheet.ns-d1, FIXES 11/9's card) every card gave its pay (48 to 58 px wide, with the trip's time
about 120) a row of its own under the client's name, 20 px a card upright; on its side the pay stood in a column right of both the
job and the client, taking 66 px off the client's line, so a name like DONA CHELO's ran to two lines.
BUILT (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_BOARD_FITS_FIVE__, only on the dense board, every word whole):
- upright the pay stands at the right end of the client's last line when there is room, on a row of its own only when there is not;
- on a sideways phone the pay stands beside the job, and the client's name has the card's whole width.
MEASURED NOW:
- THE FOURTEEN EYES F533 (the town's page alone): upright 539 in 539, sideways 294 in 294, on the first density step (it needed the
  third before); every job, client and pay whole; its plant still seen. 6 of 6.
- In the game, a new crew in Caravans, a finger on BOARD (tools/bohemia_jobs_the_board_fits_five_on_the_phone.js):

                     four jobs, the most a board deals    five jobs, F533's crowd
    demo upright     494 -> 471 px, fits both             567 in 546 SCROLLS -> 546 in 546 fits
    demo sideways    274 -> 244 px, fits both             315 in 300 SCROLLS -> 286 in 300 fits (one deal: 365 -> 321 in 300, still over)
    alpha upright    511 -> 488 px, fits both             567 in 516 SCROLLS -> 546 in 516 still over
    alpha sideways   242 -> 227 px, fits both             315 in 258 SCROLLS -> 286 in 258 still over

  A BOARD NEVER DEALS FIVE: records/target/BOHEMIA_BOARD_SHELF.json counts.max is 4 (QUESTS QR-O, 'never over 4'), and the most it
  deals fits on every phone, now with 15 to 30 px to spare. Five fits on the town's page and on the demo upright; in the alpha the tab
  row and the resource bar sit over the town and five long jobs still run 28 to 30 px past the sheet. SAID, not hidden: making five
  fit there needs the sheet taller than UI 9's 'under half the glass' or the words smaller than its 11 px floor, both UI's to decide.

## 2. THE MOMENT IS SEEN AND HEARD (the arrival at a job)
MEASURED: the moment he reaches a job's thing ('FOUND IT', 'FOUND THEM', 'GOT SIX CELLS', 'POST 1 WALKED', 'TO PRIMM DONE') was its
plate alone, drawn in one frame and gone 3.5 s later, without a sound; the map draws only when something moves, so nothing about the
moment moved either. The client's line goes to the phone as before.
BUILT (slices/bohemia_job_kinds.js __THE_MOMENT_IS_SEEN_AND_HEARD__):
- the plate comes in like a tape that catches: on, a 70 ms dropout, on; it drops out once more before it goes;
- two green rings go out from his feet a beat apart (0 and 500 ms, the 120 BPM law), each out and gone in three steps;
- the board's own tack is heard once (SOUNDS' recording 'THE BOARD: A TACK GOES IN', slices/vote/settlement_heard/board_nail.mp3:
  the job's paper getting its mark), on the game's effects bus, so the EFFECTS slider and MUTE hold for it; two moments on one step
  make one tack;
- in ten steps on a timer, never a frame loop (rule 480): ten timed draws in 3.5 s so the steps show on a map standing still (a map
  already drawing every frame just draws them); the steps go in order, and a slow phone shows every one, one a frame, late but never
  skipped (MEASURED first with a window per step: on a loaded box the alpha upright's timers came late and skipped the dropout and
  the second ring);
- the tack's 14 KB are fetched in the page's idle time 6 s after the map is up (MEASURED: fetched at the first moment, the alpha
  upright's first tack came 1.5 s late and was dropped).
Measured on his phone (the gate's M2, the demo and the alpha, upright and sideways): the plate drawn, the dropout seen, both rings
drawn, the tack heard on all four; the map itself was drawing 95 to 657 times in those 3.9 s, so the moment's ten timed draws cost
nothing measurable there. The picture's four frames are taken with the map's clock held at 10, 100, 540 and 1,200 ms
(tools/bohemia_jobs_the_moment_picture.js).
GATE: gates/the_moment_is_seen_and_heard_gate.js (M1 the file, M1p the old moment planted, M2 the demo and the alpha upright and
sideways: the plate drawn, the dropout seen, both rings, the tack heard, ten draws at most; M3 nothing threw).
Picture: records/target/JOBS_TWO_THE_MOMENT_HEARD.jpg (the board before and now, and the moment in four frames).

## 3. THE LEFTOVERS
- MAP_DREW.jobOff, a count of the edge names nothing reads since NO WAYPOINTS (11/22zo): gone. No function in the jobs file is left
  that nothing calls (swept: every function the file declares is called at least once).
- THE SETTLEMENT'S FOUR DRAFTED OFFERS (Dona Carmen, Beto, Marisol Ortiz, Old Tavo, with their typed pay) STAY: they are what the board
  deals when the shelf has not loaded, the phone's board reads the array as text (slices/bohemia_phone_board.js) and the keeper's
  lines quote it (engine/bohemia_keeper_lines.js); and their words are people's lines (rule 465). Not dead code; said.

## 4. THE JOBS' OWN CHECKERS, ANSWERED
- EVERY JOB KIND (gates/every_job_kind_gate.js) was red on main before this build, alone on the box: E5, C4, V4, V5, R2, R3 (a job
  fight won and never settled: the cargo, the camp, the hold's waves, the thing he took back) and P2. MEASURED: run on this build's
  base without its changes, E5 red the same. THE CAUSE IN THE CHECKER: the fight's end screen slides in and its LEAVE exists before it
  has landed, so the checker's tap landed on what was under it (the phone's home face) and the fight never came home; the same as THE
  JOBS' PART D7 (11/22). NOW the hand waits until the end screen is under the finger. P2 (the patrol's posts on the map) counted the
  touches the jobs' layer takes, which since NO WAYPOINTS (rule 473, 11/22zo) is 0 for a post off the glass: re-aimed to the jobs' own
  marks (marked where it stands, on or off the glass).
- THE CARD READS CLEAN: its C2 now names a red card's reason (no trip, no time, Take it off the glass...). Loaded with two batches at
  once C3 read 317 ms (its line 300) and C2 one card; alone 4 of 4 (the card 110 ms, Take it 155 at 4x).
- Reds seen in the same sweep that are not the jobs' and were red on main before (PLUMBER 8's row 681 list): THE UI MORPHS (the phone's
  fold, BREAK CAMP, the smith's buy), THE SETTLEMENT SCREEN GATE's THE BAR MOVES THE PRICE.

[bb Battle Brothers' contract list is one line a contract: the employer's face, the job, the pay on the right; nothing scrolls]
[analog horror: the tape lets go of the picture for a moment and catches it again, and somewhere a tack goes into a board]
