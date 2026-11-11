# FIXES 2: THE RED DEBT ROWS, ROUND ONE (11/11/26)

Rule 441 (FULLY BAKED), rule 443(j) (FIXES: every find, the same round). Ask rows 572 to 595 (FOUND BY PLUMBER 8, the red debt),
565 (the LEAVE tap), 555 (the boss fight's quiet turns). Taken real-bug-first: what a player can hit on the page before what is
only a stale checker. BUILD 11/11l - HIS LETTERS STAY HIS.

Every row was first RUN ALONE on main and then MEASURED on the page the way he meets it (the demo served as the link serves it:
slices/, engine/ and records/target/ side by side; a phone upright 390 x 844 and on its side 844 x 390, touch, no saved game).
A row is closed one of three ways and says which: FIXED IN THE GAME, THE CHECKER WAS WRONG (re-aimed, with what was measured),
or ALREADY GREEN ON MAIN.

## FIXED IN THE GAME (a player could hit it)

### 580 TYPING HIS COMPANY'S NAME GETS EATEN (LOS HERMANOS typed, NOS kept)
- WHAT IT WAS, measured by tracing every focus and input event on the box: three things in a row. (1) The start screen rebuilds when
  the origins' file lands (RUN's build()); its put-back focused the new box, and the tap's own 'pick the whole name' ran a tick
  later, so his next letters replaced what he had typed. (2) UI's dressPicks then MOVES the rows (the name first), and moving a row
  takes the keyboard from the box in it: focus was dropped 3 ms after RUN put it back. (3) On a busy page the tap's pick can land
  AFTER his first letter (the valley is loading behind the door): LOS HERMANOS kept as OS HERMANOS, met once under load on its side.
- THE FIX (slices/BOHEMIA_ALPHA_0_9.html __THE_REBUILD_KEEPS_HIS_LETTERS__, slices/bohemia_ui_crashbox.js dressPicks): a put-back
  is flagged on the box (__back) and never picks the name; dressPicks gives the box its focus and caret back after its move, the
  same flag; the tap's pick only happens if the name still stands as it stood when he tapped (the valley's code box the same).
- PROOF ON THE PAGE: the origins' file HELD (service worker off so the hold is real), ANOTHER, a thumb in the box, LOS HERMA,
  the file let go (the screen rebuilds and the rows move under him), NOS. The fixed demo upright and on its side and the alpha:
  LOS HERMANOS, the keyboard still his. The demo as it was on main: NOS.
- GATE: THE COMPANY TAKES HIS NAME, new leg N6 A REBUILD KEEPS HIS LETTERS (both shapes) with a PLANTED fail (the flag ignored:
  'NOS', the leg sees it).

### 590 A SAVE IS WRITTEN BEFORE HE EVER PRESSES NEW GAME
- The row said 'something shows before the title'. MEASURED: nothing shows (the door's own splash or picks without the title in
  0 of 54 looks). What failed F0 and F1 was 'a save in 46 looks': 3 s after a wiped phone opens the page, the title still up, the
  map behind it posts its first snapshot and the shell wrote bohemia_city_save.a (caught by wrapping setItem: combatMsgIn, the
  bohemiaCityState line). A save of a game nobody began; the next visit could offer CONTINUE on it.
- THE FIX (__NO_SAVE_BEFORE_NEW_GAME__): while the title stands on a phone that held no save when the page opened, the newest
  snapshot is HELD, and written the moment he presses NEW GAME (the title's own hide) or begins. A phone that came with a save, the
  door after NEW GAME (its valley kept across a reload, as the valley's code relies on) and the workshop are written as before.
- PROOF ON THE PAGE, upright and on its side: at 1.5, 4 and 9 s the title up, 0 saves, the snapshot held; CONTINUE off; a reload
  without playing: still 0 saves, CONTINUE off; NEW GAME: 1 save; BEGIN and the barber: playing, 2 slots; he comes back: CONTINUE
  gets him in. GATE: A FRESH PHONE SEES THE DOOR 9/0 (F0 and F1 were red).

### 588 THE VETERAN'S ORANGE-STRIPES LINE WAS 17 WORDS
- 'See the orange stripes, compa? Step through and they swing free.' (11 words, one flavour word; draft:true). The gate's second
  red was its own: after the aim's line the WALK's lesson, still owed, takes its turn (the fight's own queue: never two at once);
  the leg read any face as 'the aim again'. Re-aimed: the aim's own line never comes twice. THE FIRST FIGHT TEACHES 10/0.

### 583 THE MAP'S STRANGERS SPOKE SPANGLISH ON EVERY LINE
- The map carried a people engine from before rule 143a. Re-inlined (tools/bohemia_people_resync.py, 136,301 to 137,796 bytes).
  THE NAMES WIRED IN 66/0. The map boots and plays with it (A STRANGER OPENS IT 20/0 on the re-cut demo).

### 589 THE CITY BOARDS NAMED A BLOCK THAT IS GONE
- 'cornerw' taken out of ours.board_mix's city family and its suburb alias. The fight already skipped a kind its library does
  not hold (dealBoard's 'have' filter), so no deal changes. THREE BLOCKS 22/0.

## THE CHECKER WAS WRONG (measured on the page first; no player ever met it)

### 572 'A STRANGER'S DEMO THROWS' (the row called BIG)
- The gate's own server served slices/ as the whole site, so every ../engine/ file (13 script tags and the engine's data) answered
  404 'no', and the game threw on parsing 'no'. Served the way the link serves it: 0 errors, 0 failed requests, upright.
- Re-aimed further, because the game moved under it: the barber comes first now (rule 263(b)): he presses its GO; the game opens
  in a town (the origin's own): he leaves by the phone's LEAVE; 'nothing on top of the map' now asks the page he is looking at
  (it looked inside the map's own frame and saw nothing while the barber covered the glass). A STRANGER OPENS IT 20/0, three runs.

### 573 'THE AIM SHOWS 47%, THE BOTTLE LANDS 33%'
- THE THROW IS HONEST. On a flat open row, 4,000 throws of each thrown row: 75.7 on 75, 65.2 on 65 (and the rifle 59.6 on 60).
  In rolled fights on seeds 11 to 60 the same bucket is 629 throws, 41.0% on 42.8% shown, 26 buckets, none off.
- The red was the sample: seeds 1 to 10 are one fixed deal, so a bucket of 120 that falls three spreads out falls there on every
  run. A bucket that reads off is now dealt again on seeds 11 to 20 and is OFF only if off both times the same way; and a new leg
  asks the row's own question straight: B5b THE AIM IS THE THROW, every shooting row at every tile it reaches, 1,500 shots, what
  lands within 3 points of what the aim showed, the roll on the number shown. EVERY WEAPON HAS ITS RANGE BANDS 15/0.

### 565 'THE LEAVE TAP ON THE END SCREEN SOMETIMES DOES NOT LEAVE'
- MEASURED, the demo, upright, five fights (two traced every 40 ms): the end screen's page says 'opened' 1.0 to 1.7 s BEFORE its
  frame is on the glass. In that time LEAVE measures at 550,893 and 394,837 on a 390 x 844 glass: off the glass. The gates pressed
  there. A thumb cannot. Once on the glass it sits still at 323,811 and one press leaves in 200 to 300 ms (5 of 5).
- tools/bohemia_leave_the_end_screen.js: LEAVE on the glass, the top thing at its own middle on the page he looks at, still twice
  120 ms apart, then one press. THE HEAL BUTTON, STRUCK DOWN HE STILL FIGHTS and EVERY FIGHT HANDS HIM BACK use it.
- Two legs the missed press had been hiding were the gates' own sums: STRUCK DOWN D4 says 'the woken man added' and did not add him
  (three living read 'want 2'); THE HEAL BUTTON H5 retried a camp on men the first try had already healed ('+0.0 hp'): the retry
  starts from hurt men again.

### 591 'THE DOOR IS A DOCUMENT'
- The door's OWN words are 107 to 112 characters. The other 610 to 650 are the NEW GAME's picks, put on that screen by later
  rulings (the fifteen origins, the crew's name he types, the valley's code). Rule 348's four words are the TITLE's, the screen in
  front. A9b now reads the door's own words with the picks taken out, and counts the picks. FRONT DOOR 10/0 (THE ONE LINK and
  OPENS ON THE GAME are both this gate).

## ALREADY GREEN ON MAIN
- 575 (a tap on OSO opens the crew screen on OSO): YOUR CREW LIVES IN THE TOWN 10/0 twice, on 5ff2016b and on this build.
- 586 (WORLD 13 fixed it, 11/11a): THE NEWS DOWN THE ROAD 28/0 here; its line struck with these.

## NOT CLOSED THIS ROUND, AND WHY (each stays OPEN on the list)
- 555 / 605 the boss fight's quiet turns: NOT REPRODUCED YET. The fight's rules alone: 3,979 turns of his on AUTO, 124 quiet, 124
  said their word, beginTurn never skipped. The fight's page at 2x on six boards: 289 turns, 7 quiet, 7 said. It is in the boss
  fight's own setup (opts.boss: its own board path) or the shell's hand-over; the probe is in this record's tools list below.
- 574 (a day-one hunt can wipe a new crew), 576, 577, 585 (the boards' colour and seams), 578 (the aftermath near black on a
  computer), 579 (a far job's two times), 581 (deaths off the beat), 582 (the maul man and the roof), 592 (the meet card's roster
  line: the gate reads a card that is not up, its walk to the job's crew ends before the meet), 593, 594 (the lineup leg has no
  pair to measure since the line is dealt zigzag: stale; its ground seam leg is real and COMBAT TWO's), 595: read, run alone, each
  with its failing line in gates/BOHEMIA_QUARANTINE.txt; next round, the same order.
- 606, 607, 609, 611, 612 (FOUND BY EYES 11/11): next round, before the stale checkers.

## THE PROBES (scratch tools, kept as the method; none ship)
serve the repo's three published roots at /, a phone context (touch, mobile, the service worker blocked when a request is held),
every pageerror with its stack, every 4xx. The stranger's walk; setItem wrapped to name who writes a save; focus/input traced on
the name box; LEAVE's box sampled every 40 ms from 'opened'; the fight's log read turn by turn on the page at 2x.
