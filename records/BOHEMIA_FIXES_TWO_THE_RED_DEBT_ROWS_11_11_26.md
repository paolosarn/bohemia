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

## ROUND ONE, SECOND SHIP: BUILD 11/11q - THEIR PLACE, NEVER CUSTOM (ask row 609, FOUND BY EYES 11/11)
- 'came into Custom off Rainbow'. His own place's key in the files is canon's word for his outfit. The map's plate already shows
  his name for it (homeLabel); the feed's fire() and ctx() passed LOOP.open.name and nearTown() raw, so every post kind with {town}
  could print the key when he stood at or nearest his own place.
- THE FIX (slices/BOHEMIA_CITY_WORLD.html __THE_CANON_WORD_IS_NEVER_SHOWN__): every town a post names goes through shownTown: his
  place by the name he gave it (title case), else 'their place' (the valley talking about his crew; draft:true); 'town.entered'
  ('new faces in town') is never fired for his own place.
- PROOF ON THE PAGE, the demo upright and on its side: the key 'Custom' is said as 'their place'; another town stays 'Network';
  a man hired there is taken (1 post queued); a walk into his own place posts nothing (0), into another town does (1).
  GATE THE FOURTEEN EYES FOUND, leg F609, 3/0, PLANTED (the mapping taken out of the map's page: 'Custom' printed, the walk-in posted).
- ALSO: the VOTE card's why cut to two sentences (the VOTE TAB's own rule; its other reds there are older cards' and the alpha's
  landing leg, as FIXES one's handoff said).
- MEANWHILE ON MAIN (other lanes took rows of this list, the coordinator's round): 579, 593, 595 FIXED by WORLD 14 (11/11o); 584 by
  COOK FIVE; 586 by WORLD 13; 587 by BOSSES; 574 PARTLY by BESTIARY.

## ROUND TWO, ONE TIGHT BATCH (rule 447, 'what he can feel first'): BUILD 11/14j - THE SPOT SAYS IT BY ITSELF
Rows 608, 606, 611 and a hole found in my own 580 (607 measured; HOME BASE fixed it the same hour). Each measured on the page first, fixed, then proven on the demo or the
page's own file, a phone upright (390 x 844) and on its side (844 x 390), touch; every gate leg with a planted fail.

### 608 THE SCAVENGE SPOTS FLOAT WORD LABELS (he refused floating labels twice: rules 438, 442(b))
- slices/BOHEMIA_SCAVENGE.html painted a cream plank with SEARCH, SIPHON or DETECTOR over every lit house, car and patch of dirt
  (lit(): mark(s); tag(s)). The plank and its table are gone (__THE_SPOT_SAYS_IT_BY_ITSELF__). A spot is the thing itself, lit on
  its own ground; the strip under the board still says TAP A LIT SPOT and the phone's list counts HOUSE, GROUND, CAR (the page's
  own chrome, not over the world); what he does at a spot is said by the dial his tap opens (rule 433).
- Both shapes: 0 plank pixels on the spots' layer, 6 of 6 spots lit (13,772 and 18,735 lit pixels), a thumb on one starts it.
  F608, PLANTED (a plank put back over every spot): 30,512 pixels, seen.

### 607 THE BUILD SHEET'S WORDS: MEASURED HERE, FIXED BY HOME BASE (BUILD 11/14g - EVERY WORD ON THE DESK)
- MEASURED upright: four of eight build buttons cut their line with dots ('1 BATTERY 2 TAPE KEEPS TH...': 202, 252, 214, 181 px
  in a 162 px box). I wrapped the line and added a leg; HOME BASE shipped its own fix of its own sheet the same hour (the cost on
  one line, what it gives on the next; its gate's D8 with a planted squeeze, upright 83/0, sideways 81/0). ONE SYSTEM, ONE
  SESSION: theirs stands, mine is dropped whole (the page and the gate are HOME BASE's as they are on main).

### 606 A ROAD EVENT'S CARD OVER A RUNNING CAMP
- How it comes about: the phone's HEAL is in his corner, over the card, so a camp can be made while a card waits; campHour
  (500 ms an hour) then ran under the question. __A_QUESTION_STOPS_THE_CLOCK__: while BohemiaRoadEvents.up() the camp's hour
  holds (no time, no food, no walking world); and the road's busy() counts a standing camp, shown or not.
- Demo, both shapes: a real thumb on HEAL, hours 2; a card up 3 s: hours 2 to 2, clock 1920 to 1920, food 21 to 21, 7 ticks
  held; he answers, hours 8 (7 sideways). F606, PLANTED (the hold out): 3 to 9 under the card.

### 611 A CARD EATS THE TAP MEANT FOR A BUILDING (BOSSES fixed when a boss's card may open, 11/14a; this is every card)
- slices/bohemia_road_events.js card(): a choice answers no press in the card's first beat (500 ms), nor one whose finger came
  down in it; the choices come up at half light and light when they will answer; the number keys the same. A scripted pointerup
  with no finger down is judged by the clock alone (three gates press that way; one pressed at 300 ms and now waits 620).
- Demo, both shapes: the instant thumb answers nothing, the card stays, refused 1; a beat later it answers. F611, PLANTED (the
  beat at nothing): the instant thumb answers. (A script's look-then-tap takes a third of a second, so the leg learns the choice's
  place from one card and taps the next the instant it opens.) CONTACT STOPS HIM DEAD 18/0 with it.

### 580 AGAIN: A FAST THUMB ON A BUSY PHONE (found doing the re-proof he asked for)
- With the CPU slowed six times (his phone on the road, the valley loading behind the door), a thumb in the box and the letters
  at once: 11/14e kept 'THE NIGHT SHIFTLOS HER', his letters inside the dealt name, 6 of 6. 'Pick the whole name' ran on a
  timer a tick after focus; a busy page ran it after his first letter, and 11/11's guard then skipped it.
- __THE_PICK_RIDES_THE_TAP__: no timer. The name is picked at the focus and again at the tap's own click, both before any letter
  (a page hands over its events in order). The valley's code box the same. Fixed build 6 of 6 LOS HERMANOS, both shapes.
  THE COMPANY TAKES HIS NAME 12/0: new leg N7 (CPU 6x, both shapes), PLANTED (the timer back: 'THE NIGHT SHIFLOS HERT').

### THE LAST ROUND'S FIVE, PROVEN AGAIN ON THE PAGE, UPRIGHT AND ON ITS SIDE (his ask)
- 580: N6 and N7 above, both shapes. 590: 0 saves at 1.5, 4, 9 s and after a reload, CONTINUE off; NEW GAME 1 save; he plays,
  comes back, CONTINUE gets in; both shapes. 609: F609 3/0, both shapes ('their place', never the key).
- 588: on the fight's page both shapes the veteran says 'See the orange stripes, compa? Step through and they swing free.':
  11 words, whole, inside the glass (8,4 to 382,67 upright; to 428,67 sideways), over no button.
- 583: on the demo's map both shapes the page carries the per-line roll and asks the one dial: a Spanglish speaker slips into
  Spanish 2.5 lines in 10 (2.6 sideways), an English one 1 in 10; it was every line.
- STILL A PHONE-SIZED BROWSER WITH TOUCH, NOT A HAND-HELD PHONE: EYES' walk is the hand-held one.

### NOT IN THIS BATCH
- 612: UI THREE took it (11/14d, two of three). 610: JOBS fixed it (11/11s). 618 (a boss fight ends on the raiders' line), 619
  (the end screen calls DESI 'his'): FOUND BY EYES 11/14, mine, next. 605: the root still not found (COMBAT THREE closed the
  word against it). The debt's 577, 578, 581, 582, 592, 594: untouched this round.
- NO VOTE CARD THIS ROUND: rule 447(b), the site at 894 of 900 MB, nothing more ships until it is trimmed; a card needs two pictures.

## ROUND THREE, THREE FROM EYES (rows 619, 618, 605): BUILD 11/14m - THE SCREEN READS THE PERSON

The coordinator's order: 'Row 619: the end screen calls DESI HIS... no screen hard-codes a pronoun, it reads the person. Row 618: a boss
fight closes on THE RAIDERS BROKE AND RAN when THE POT is down: the fight's last line names who really fell. Row 605: the quiet word still
fails on a fresh read when a man's turn log is stale. One tight batch, proven on a phone both ways (rule 441), shipped, rows marked, then
stop.' No VOTE card (rule 447(b), the site's weight; nothing here is a picture).

### 619 THE SCREEN READS THE PERSON (FIXED; TAB: RUN, the end screen after any fight)
- BEFORE: slices/BOHEMIA_SPOILS_SCREEN.html printed 'CHOOSE HIS LEVEL-UP', 'SPEND HIS n LEVELS' and 'FELL. HE IS DEAD.' for everybody
  but YOU. The fight handed home a name and a look, no he or she.
- NOW (__THE_SCREEN_READS_THE_PERSON__): sexOfMan(m) reads, in order: a mark the fight hands over (spoils.looks[i].sex, or sex on the
  crew row), her look as the names engine reads faces (BohemiaNames.faceReads), the people's roll (BOHEMIA_PEOPLE_MIX), her given name
  (BohemiaNames.sexOf). YOU reads YOUR. NOTHING SAYS = NO PRONOUN: 'CHOOSE A LEVEL-UP', 'SPEND 2 LEVELS', 'FELL. DEAD.'. Never HIS by
  default. The page loads engine/bohemia_names.js for it.
- THE FIGHT HANDS HER OVER: slices/BOHEMIA_FIGHT.html carries sex ('f' or 'm') from the game's hand-over (opts.company[i].sex) or the
  crew's own row (ours.crew[i].sex) onto the man and home in spoils.looks; a row's mark never rides onto another name.
- MEASURED: DESI's look is person_town_0, unmarked in the people's roll (sex null); 'Desi' is not in the names list; the crew's row in
  records/target/bb/ours.json has no mark; RUN TWO's shop line (10/26) says 'His ... vest' of her. NOTHING IN THE DATA SAYS WHO DESI IS.
  So on the demo she reads with no he or she: 'CHOOSE A LEVEL-UP'. DID NOT DECIDE (identity, Paolo's): one field makes it HER
  ("sex": "f" on DESI's crew row, or on the company the game hands the fight).
- PROOF: gate THE FOURTEEN EYES FOUND F619, the end screen's page, 390 x 844 and 844 x 390: SPEND YOUR 3 LEVELS (YOU), SPEND HER 3
  LEVELS (a woman by her look cast_skirt; a woman the fight marks), SPEND HIS 3 LEVELS (person_town_1), SPEND 3 LEVELS (DESI, unmarked);
  FELL. SHE IS DEAD. (MARISOL, by her name), FELL. HE IS DEAD. (BETO, by his look), FELL. DEAD. (ZED); every button whole on the glass.
  PLANT: the reading taken out (everybody a man): the leg sees 'SPEND HIS 3 LEVELS' under a woman. ON THE DEMO ITSELF, both shapes, a
  road fight through the map's own door, won, RAUL dead and DESI given a level: DESI 'CHOOSE A LEVEL-UP' (122 x 44 upright, 88 x 44
  on its side, 11 px), RAUL 'FELL. HE IS DEAD.', 0 page errors (probe p619demo.js).
- FOR WORDS and COMBAT (found, not mine this round): the fight's quiet-turn lines say his for everybody ('{name} holds his ground',
  'is winded and catches his breath', 'nowhere safer in his walk'); the shop's 'His ... is in the stash'. The fight's men carry sex now.

### 618 THE LAST LINE NAMES WHO REALLY FELL (FIXED; TAB: RUN, the end screen after a boss's fight)
- MEASURED in the rules, 24 of THE POT's fights (tools/bohemia_fight_headless.js, BOSSES' own hand-over): 22 end with him dead (the
  head already read THE POT IS DOWN), 2 with his line dead and HIM RUNNING. That end fell through wonHead() to the road crew's table:
  a boss's band is dressed as faction 'brigands', so it read 'THE RAIDERS BROKE AND RAN', EYES' exact words.
- NOW (__THE_LAST_LINE_NAMES_WHO_REALLY_FELL__): a boss who is not dead is named for what he did: 'THE POT BROKE AND RAN' (men of his
  down), 'THE POT RAN' (nobody down); a boss still standing when his line gave way, 'THE POT IS BEATEN' / 'GAVE WAY'. draft:true.
- PROOF: gate F618, both shapes: the FIGHT'S OWN PAGE with THE POT's hand-over, the two ends set on its own men, the fight's own message
  home (homeMessage) opened on the end screen: 'THE POT BROKE AND RAN' and 'THE POT IS DOWN', never RAIDERS anywhere on the screen,
  the head whole on the glass. PLANT: the boss's line out of the head: 'THE RAIDERS BROKE AND RAN'.
- FOR BOSSES: Tia Carmen's card after it says 'THE POT IS DOWN' when he ran. Yours.

### 605 THE QUIET WORD (NOT REPRODUCED A THIRD TIME; a tell shipped; stays OPEN)
- Bounded tries this round: the fight's page, THE POT's hand-over, five of his, the page's own defaults (the formation first, the fight
  kept every round), AUTO at 4x by its own button: 76 turns, 3 quiet, 3 said, 3 shown (UI.idles), no marker the same in two rounds, every
  turn began (p605e.js). The DEMO'S OWN SHELL, three road fights through the map's door, AUTO at 4x, 2x, 1x: 25 turns, 0 quiet, nothing
  stale, nothing broke (p605demo.js). With last round's: the rules 834 turns (47 quiet, 47 said), the page 191 turns (9 quiet, 9 said).
- READ: the marker has one writer (beginTurn) and it writes the log's length; the log is only cut by a take-back by hand and reset by a
  kept fight read back; the odds and the chase play a second copy in a worker. Nothing on a live AUTO fight can hold a marker still.
- ONE HOLE FOUND BY READING, NOT THE CAUSE HERE: turnBroke()'s last resort (the turn's own end threw) does FIGHT.S.idx++ with the
  man's begun left on and no settle(); the next man's turn opens un-begun. It needs a page error; EYES' walk had 0. FOR COMBAT.
- SHIPPED: __THE_STALE_TURN_TELL__ in endTurn: a turn of his whose marker does not point at its own 'turn' event is counted and named
  (FIGHT.S.staleTurns, FIGHT.S.staleLast {id, name, round, marker, log}); 0 in 228 turns of 12 fights in the rules. It changes nothing
  a player meets. EYES: read those two the next time, and say how your tool counts a quiet turn and a shown word (it is not in the repo).

### ALSO
- gates/the_fourteen_eyes_found_gate.js F530's wiring leg was red on main (a text match): JOBS (11/10o) put every other fight's name
  behind a leg's own ('foe: (extra && extra.foe) || foeSays(...) || null'); the leg's own still leads. RE-AIMED with a note; 5/0.
- THE SPOILS gate (RUN's, on the red list as UNSURE): MEASURED, the tap that times out is the crew screen's #pick inside the end
  screen's crew door (after the end screen's own level button opened it): not LOOT ALL, not LEAVE, not row 565. Its line says so now.

## THE PROBES (scratch tools, kept as the method; none ship)
serve the repo's three published roots at /, a phone context (touch, mobile, the service worker blocked when a request is held),
every pageerror with its stack, every 4xx. The stranger's walk; setItem wrapped to name who writes a save; focus/input traced on
the name box; LEAVE's box sampled every 40 ms from 'opened'; the fight's log read turn by turn on the page at 2x.
