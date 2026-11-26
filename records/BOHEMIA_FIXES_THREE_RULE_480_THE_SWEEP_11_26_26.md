# FIXES 3, RULE 480'S ROUND: IMPROVE WHAT IS IN THE GAME (11/26/26)

VAMILY rule 480 (Paolo 11/26): a full sweep, improve what we already have before adding anything, never choppy. The coordinator's
routine for this lane: take the open ask rows no lane this round owns, the bugs he can feel first; take the unowned rows EYES and
PLUMBER 8 file; stay out of the round's held systems (fight rules COMBAT FOUR, fight screen FIGHT SCREEN 3, UI FIVE, camp, staff, his
place, jobs, map draw WORLD 13, places WORLD 15). Rule 454(a): no person's line rewritten. Rule 461(c) amended: no tool that waits for a tap.

WHAT I CHECKED BEFORE TOUCHING ANYTHING (rule 480(b)): the ask list from row 650 on for rows with no done mark. Open and unowned this round:
697 and 722 (the end screen's LEAVE: RUN's page, RUN has no lane, so FIXES'), 693 (FIXES' own checker past the suite's cap). Open but held:
661 (the map's freeze, WORLD 13), 671 and 672 (the crew screen, UI FIVE), 698 (the board's jobs, JOBS), 696 (the staff's gate, STAFF).
No row past 723 had been filed when this round began.

## 1. THE END SCREEN'S LEAVE (ask rows 697 and 722, FOUND BY PLUMBER 8 11/22): THE CHECKER'S TAP, NOT THE GAME

MEASURED on main ec97371ae, the demo upright (390 x 844), real taps: THE WHOLE LOOP PLAYS passed 11/0, then failed 7/1 at step 8 on the
same tree with nothing changed between ({spoils:true, fight:true, nf:true, phone:'fight'}: the end screen still up after LEAVE, and the
note REACHED ONLY AFTER A SCROLL). Two probe runs of the same moment: LEAVE stands at 267..380 x 786..836 on the 844 glass, no scroll;
the end screen grows in out of the phone (0.5 s: [139,50,251,453], whole by 1 s). The loop read LEAVE's box once, during the grow-in,
and its tap landed beside it; the 'scroll' was its fallback walking a box that was still moving. PLUMBER 8's bisect (the rounds key
cleared by a new game) read a step that fails about one run in two.

FIXED IN THE CHECKER (gates/the_whole_loop_plays_gate.js, winAndLeave): LEAVE is pressed with FIXES' end-screen tool first
(tools/bohemia_leave_the_end_screen.js: waits for the screen's own 'opened', LEAVE on the glass and holding still, the top thing at its
middle), the old scroll-and-tap only if LEAVE is truly below the glass; and its tapIn reads a box only once it holds still.
PROOF: THE WHOLE LOOP PLAYS 11/0 and 11/0 on two runs in a row, step 8 'LEAVE tapped; the map, nothing over it', no scroll note.

## 2. LEAVE WAITS FOR THE SCREEN (a real one, found on the way; rule 480(b))

MEASURED (the page framed the shell's way, a fresh frame and the fight posted on its load; a phone upright): the end screen draws LEAVE
and MAKE CAMP before its tables are in (about 1 MB: the roster's nine files, loot, tape, the crew's voices), and a tap on LEAVE in that
moment went home AT ONCE: the summary he asked to stand (rule 164 item 28, 'it goes away way too quickly, I can't read it') never showed,
and the batteries, rounds and tape off the bodies were never paid, because they are only found when the screen opens on the fight.
(The guard 'one leave a screen' compared the last leave with the screen's number, and before the screen opens that number is 0, so it let
the tap through.) A thumb still tapping as the fight ends lands right there.

THE FIX (slices/BOHEMIA_SPOILS_SCREEN.html, __LEAVE_WAITS_FOR_THE_SCREEN__): until the screen has opened LEAVE and MAKE CAMP read as not
ready (faint) and a tap on them does nothing; the moment it opens they light, and LEAVE goes home with the pockets paid first. If its tables
cannot load at all, LEAVE still lights and still goes home (nothing found, nothing lost). Keeping the early tap and leaving once the screen
opened was the other way; it was not taken, because that tap is the one that skips the summary.

THE WINDOW, MEASURED (a probe: the page framed the shell's way, CPU 4x, a phone network of 1.6 Mbps and 150 ms; main's page served
beside the fixed one; the tap lands once the page's script runs and before it opens):
- a cold first fight: main's page, the tap at 1.9 s WENT HOME, nothing paid (its screen would have opened at about 5.0 s: the window
  about 3 s). The fixed page: the tap at 1.8 s does nothing, LEAVE at 0.4 opacity; the screen opens at 5.0 s, LEAVE at 1; the next
  tap goes home.
- warm (the tables cached, a later fight): main's page, the tap at 0.7 s went home; the fixed page waits 0.4 s.
- the tables refused: the fixed page lights LEAVE and goes home (L3).
ALSO: THE PHONE's checker (gates/the_phone_gate.js) pressed the end screen's LEAVE once, 2.5 s after the frame was made; it now also
waits for the screen to open (one line in the checker; nothing of the phone touched). Every other checker that presses LEAVE waits for
the screen or keeps pressing until home.

GATE: LEAVE WAITS FOR THE SCREEN (new, in the suite): L1 the tables held back, LEAVE on the glass reads not ready and a real tap sends
nothing home; L2 the tables in, LEAVE lights, a tap goes home once with the counts paid first; L3 the loot table refused, LEAVE still goes
home; P1 PLANTED the wait taken out (the early tap goes home, seen).

## 3. FIXES' OWN CHECKER UNDER THE SUITE'S CAP (ask row 693) AND WHAT IT FOUND

THE FOURTEEN EYES FOUND ran every leg in one process and timed out at 600 s with the box to itself. Timed leg by leg (FIXES_TIMES=1,
a switch that puts the seconds since the start on every line): the whole run took 1,507 s (169 passed, 12 failed). SPLIT IN EIGHT in
the suite, every leg in exactly one part (33 legs), each under half the cap alone, measured one after another on this box:

| part | legs | alone | result |
|---|---|---|---|
| THE FOURTEEN EYES FOUND (keeps the name and its debt line) | F530 F529 F537 F525 F532 F533 F536 F535 F531 F527 | 126 s | 66/3: the two FILED reds, F533 both ways and F531 |
| TWO | F538 F534 F528 | 201 s | 23/0 |
| THREE | F558 F554 F550 F551 F552 F553 | 184 s | 44/0 |
| FOUR | F609 F608 F606 F611 | 153 s | 14/0 (after F606's second re-aim; 12/2 before) |
| FIVE | F619 F618 F605 F612 F612h | 137 s | 15/0 |
| SIX | F653 F670 | 228 s | 7/0 |
| SEVEN | F654 F649 | 238 s | 6/0 |
| EIGHT | F581 | 188 s | 3/0 |

The run with no --only still runs every leg. Its debt line (gates/BOHEMIA_QUARANTINE.txt) stays on the first part, re-worded: no longer a
timeout, now FILED on the two new rows (736 for F531, 737 for F533), so NAMED and LEFT do not move.

Its reds on main, measured on the way, sorted:
- F538 MAKE CAMP: STALE, RE-AIMED. Since CAMP FOUR's __THE_CAMP_COMES_UP_AT_ONCE__ (11/22zzd) the camp lands on the fight's own board and
  bakes nothing, so there were no bake steps to time (1 step, 'none'). When the camp comes up that way the leg now counts the whole glass:
  its longest frame and longest task under half a second (measured 191 / 134 ms upright, 171 / 111 ms on its side).
- F606 NOTHING RUNS UNDER A QUESTION: STALE TWICE, RE-AIMED. (1) CAMP FOUR's rule 472(a)(d): every camp is set up before an hour runs and
  its clock stops when his men are whole; the demo's company starts whole, so the hours read 0 to 0 with no card at all. The leg holds
  the stop off on its page and counts from the end of the set-up, the way CAMP FOUR's own gates do. (2) With the camp running, the card
  the leg asked for never came up (card false, the hours 2 to 8 to 14): row 606's newer fix, WORLD 14's __THE_CARD_WAITS_FOR_THE_CAMP__
  (11/14, slices/bohemia_road_events.js), holds a road card off the glass while he camps and brings it up when he breaks camp. The leg
  counted the older fix (the hours frozen under a card on the glass). It now counts the law row 606 asked for, nothing of his runs out
  under a question: the card held, off the glass, while his rest runs; he breaks camp and it comes up; he answers and it goes. Its plant
  takes the road's camp wait out (the card stands over the running camp).
- F531 THE MEET CARD NAMES THE GROUND: REAL, FILED as ask row 736 (COMBAT FOUR's seam, FIXES the card). 53 of 85 districts. Since COMBAT THREE's insides (40 data files from 11/17,
  each dealt by the cell's own dice at its share, 0.3 to 1.0), the parking garage (0.4) and the flood tunnels (0.5), the fight deals an
  inside first at those places, and the card still names the outside board ('TALL BUILDINGS' over the aquarium's inside). The card cannot
  know a cell's dice without a second copy of the fight's deal (rule 59), and fetching the 40 inside files on the map (636 KB) to word one
  line would cost frames (rule 480(c)). The honest fix is the fight answering what it deals at a spot without dealing it, which is the
  fight's file, held this round.
- F533 A TOWN'S JOB BOARD, CROWDED: REAL, FILED as ask row 737 (JOBS 2). Five jobs with the longest names and a PAID THERE badge each: the sheet holds 567 px in 547
  upright and 305 in 299 on its side, so it scrolls (rule 402). The jobs screen is held this round.
- F553 HIS PLACE'S SITE CARD ON A ROAD: STALE, RE-AIMED. Since HOME BASE's row 549 ('he plants the block beside the street he stands
  on', homeChoose) the card on a road grades the block beside it and names it (THE BLOCK NORTH-WEST): measured on an arterial, the prison
  beside it, 'Somebody else's walls. Not yours.', which is that block's own true reason. The leg graded the road cell itself. It now reads
  the block the card grades (the map's HOME.here) and holds the law it kept: the card's reason is the reason of the ground it grades, never
  'Nothing stands here' for ground that is not open ground; its plant (every closed block's reason turned to 'ground') is judged against
  the true reason from before the plant.

## 4. WHAT I READ AND LEFT (held this round, each in its row)

EYES' nine finds of this round (rows 724 to 732, the alpha on a phone slowed 4x) are each named to a lane holding its system (PLUMBER 8,
UI FIVE, WORLD 15, CAMP FOUR, HOME BASE 3, JOBS 2, WORLD 13, COMBAT FOUR); row 725 (LEAVE from a fight freezes about a second) is the
frame after the tap, PLUMBER 8's with FIGHT SCREEN 3, and this round's LEAVE change does not touch it. Rows 671 and 672 (the crew screen,
UI FIVE), 661 (the map, WORLD 13), 698 (the board's jobs, JOBS) the same. THE SPOILS 18/1 is the red on main's debt list since 11/14 (the
crew screen's #pick inside the end screen's crew door), unchanged by this build.

## PROOF (rule 441), this build, BUILD 11/26f

- LEAVE WAITS FOR THE SCREEN 5/0 (new; its plant the wait taken out: the early tap goes home, seen).
- THE WHOLE LOOP PLAYS 11/0 three runs (two before the end screen change, one after).
- THE FOURTEEN EYES FOUND, the eight parts: 66/3 (the two FILED reds only), 23/0, 44/0, 14/0, 15/0, 7/0, 6/0, 3/0.
- THE RECEIPT IS GONE 7/0; SCRAP IS TAPE 11/0; THE PHONE 268/0; MAKE CAMP FROM THE FIGHT 11/0; OPTIMIZE LOOT 22/0; THE SURVIVOR'S
  WORD 6/0; THE SPOILS 18/1 (main's red, above).
- THE RED DEBT ONLY SHRINKS 4/0 (398 named, 310 left: unchanged; the line re-worded from a timeout to two FILED rows).
