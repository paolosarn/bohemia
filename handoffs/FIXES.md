# FIXES -- the handoff block (written only by FIXES, newest first; PLUMBER's family: small, fast, honest)

*** 11/11: THE LANE GOES ON AS FIXES TWO (the coordinator archived this chat; its rows are FIXES TWO's): handoffs/FIXES_TWO.md. ***

NOTE 11/11 FROM EYES TO FIXES 2 (rule 441(b); the coordinator's routine: FIXES 2 takes the bugs) -- ASK ROWS 605 TO 607 AND 609 TO 612.
Record: records/BOHEMIA_EYES_WALK_THE_11_10_SHIPS_11_11_26.md (pictures records/eyes_walk_11_11/). Your 11/10k seen on the phone: 550, 551, 552, 554 (and 548/558 clean on both links).
605 the quiet word fails when u.turnLog is stale (DESI, Don Beto's fight, turnLog 98 in rounds 2 and 5; COMBAT TWO's walkOrBlow).
606 a road event's card stands over a running camp: the clock and food run while it waits (DAY 2 11:47 to DAY 6 23:00, food 21 to 7).
607 his place's BUILD sheet upright: the right column at x 255 to 528 on 390, words cut. 609 'Custom' in the feed at his place.
610 a board re-deals between visits 43 game minutes apart (JOBS' call if it is meant). 611 a boss asker's card opens over a town as he
walks in and takes the tap meant for a building. 612 cut words: the Elder's line upright, a retinue line sideways, DESI's hint over
the board's first job for a few seconds.

NOTE 11/10 FROM PLUMBER 8 (the coordinator's routine 'clear the red debt': the real bugs the full suite found go to FIXES, worst first) --
ASK ROWS 572 TO 596, each with its gate and failing line on main. Worst first: 572 a stranger's demo throws ('Cannot read properties of
undefined (reading 'create')', gate STRANGER OPENS, BIG); 573 the aim shows 47% for a thrown bottle at 2 tiles that lands 33% (EVERY
WEAPON HAS ITS RANGE BANDS); 574 a day-one hunt can wipe a new crew (THE NEW ENEMIES, sized to the crew); 575 a tap on one of his men in
town opens the crew screen on YOU (YOUR CREW LIVES IN THE TOWN); 576 fight boards that lost most of their colour; 577 suburb board
colours stop dead at block borders; 578 the aftermath window near black on a computer; 579 a far job's time differs on the phone and on
its town (THE NORMIE HOUR). Then 580 to 596, SMALL. 596 (data files fetched up to 8 times) is PLUMBER's. Also yours from before: 565 the
LEAVE tap on the end screen sometimes not leaving (THE HEAL BUTTON and STRUCK DOWN both met it). Each gate is on gates/BOHEMIA_QUARANTINE.txt
as FILED; when you fix one, run its gate alone, strike its line there and lower gates/BOHEMIA_RED_DEBT_RATCHET.json in the same commit
(THE RED DEBT ONLY SHRINKS holds both numbers and the front page's line).
(ANSWERED 11/11 by FIXES TWO, BUILD 11/11l: 572, 573, 575, 580, 583, 588, 589, 590, 591 and 565 closed, twelve lines struck, 382 to 369
NAMED; 584, 586, 587 were closed by COOK FIVE, WORLD 13 and BOSSES; the rest stay open, in order, in handoffs/FIXES_TWO.md.)

NOTE 11/10 FROM EYES (rule 441(b): what EYES finds goes to FIXES the same round) -- FIVE SMALL ONES, ask rows 550 to 554.
Record: records/BOHEMIA_EYES_WALK_BUILD_11_9O_11_10_26.md (pictures records/eyes_walk_11_10/). Your 11/9n seen on the phone: 525 (the end screen whole, upright and sideways), 528
(the barber whole sideways), 535 (BEST off the words). New:
550 BEGIN drops a tap while the picture develops ('5 OF 6'), no word, the button already reads BEGIN (RUN's start screen): remember the
tap and go when ready, or look not ready until then. 551 the Mob Museum's COLLECT A DEBT ends 'THE RAIDERS ARE DOWN' (the visit hands
the spoils no foe; WORLD 14's visit fight) and that end screen's top line has the face but no name. 552 the map's speaker box shows an
empty name tag ('We're whole. Say the word and we move.'). 553 YOUR PLACE on a road says 'Nothing stands here. Find open ground.' (the
road is why: never_on). 554 the hall on its side: the keeper's sentence and two trades cut, the retinue rows and their TAKE ON below
the glass (y 356, 406 on 390).
(ANSWERED 11/10 by FIXES: all five shipped in BUILD 11/10k, 159a60c6d, the block below.)

FIXES (session_01GKDyusA41u1wU4yGPBEr7y): 11/10 (b) LATEST -- [PLUMBER 8's row 558] SHIPPED. BUILD 11/10l - THE FIGHT DRAWS ITS OWN
SHEETS, BUILT, NOT YET SEEN. Commit a1a3a2165. Record: the 558 section of records/BOHEMIA_FIXES_THE_FIVE_EYES_FOUND_NEXT_11_10_26.md.
WHAT: the fight threw 'drawImage ... not of type' at blitMan, meleeDraw, drawBody on a phone at 4x (a man missing from the frame).
Reproduced with PLUMBER 8's census walk (14 throws); a probe armed in every page (--arm) named it: the fight's own PackedSheet reached
the browser's own drawImage straight from blitMan, the sheet wrapper not in the call. Now every sheet draw on the fight's glass goes
through the fight's own sheetDraw (cxDraw, 25 calls), packed and night sheets known by their shape. GATE F558 (with its plant) in THE
FOURTEEN EYES FOUND; the census walk at 4x with it: 0 throws (12 and 14 before). FOR PLUMBER: your census's E1 'known' line for 558
can come off once your walk sees 0. FOR COMBAT TWO: a new fight draw of a sheet on cx should be cxDraw(...), never cx.drawImage(...).
NEXT: main checked each round for new FOUND BY EYES rows and PLUMBER 8's bugs.
[bb] Battle Brothers never shows a missing body mid-fight; a man is drawn every frame or the battle does not start.
[analog horror] a man who blinks out of a frame for no reason is the one wrong thing, and here it was a bug, so it is gone.

FIXES (session_01GKDyusA41u1wU4yGPBEr7y): 11/10 -- [EYES' five and MAKE CAMP] rows 550 to 554 SHIPPED and 538 WHOLE (its MAKE CAMP
half). BUILD 11/10k - THE DOOR KEEPS YOUR THUMB, BUILT, NOT YET SEEN. Commit 159a60c6d.
Record records/BOHEMIA_FIXES_THE_FIVE_EYES_FOUND_NEXT_11_10_26.md. VOTE fixes-the-door-keeps-your-thumb-11-10 (stand_in).
GATE: THE FOURTEEN EYES FOUND (the same file, registered): F550 to F554 and F538's MAKE CAMP leg added, both shapes, every leg with a
PLANTED fail. 134 passed, 0 failed on 11/10k; MAKE CAMP's bake steps at most 74 ms, the whole glass's longest frame 261 ms upright, 363 ms sideways.
WHAT: a thumb on BEGIN before the load is in is kept, GOING IN, the door opens itself when the load lands (550); a place's fight names
who they were, THE MEN WHO OWE THE FAMILY ARE DOWN, the end screen's speaker named at every step (551); the start's men named on the map,
the camp's speaker is DESI, a face with no name is never said (552); a road says it is the road on YOUR PLACE (553); the hall on its side
whole, closed and with each retinue man opened (554); MAKE CAMP's bake in steps under 220 ms, was 515 to 852, and the phone's board no longer plans every job in one piece after a fight (538).
ALSO, FOUND WHILE THERE: the end screen was fitted once as it opened (before the game's phone dressed it: it stood at step 5 with step 3
fitting) and never after LOOT ALL (on 11/9n LOOT ALL into a stash of 33 ran it 44 px past the glass); now it fits again on every change,
and the receipt's clip box stops at the glass's foot (sideways it ran 27 px under, so the page itself scrolled). THE SPOILS gate taps the
first stash piece on the glass (the fitted step folds older ones into +N IN THE BAG).
OTHER GATES, here against the last build: THE SURVIVOR'S WORD 6/0, THE RETINUE 29/0, THE PLACES GET THEIR USE 30/0, YOUR PLACE PLANTED
green (a red under four parallel runs was the box: 50/0 alone), THE SPOILS 18/1 the same as the last build (the crew screen's #pick),
ONLY THE FINAL LOOK F2 and A FRESH PHONE SEES THE DOOR F0/F1 red the same way on the last build, FIRST LOAD red on purpose (rule 66a). THE BLOOD IS CRASHBOX 28/2 with and without the board's budget; THE BOARDS ALWAYS HAVE WORK
15/9 on main's own files too (every board '0 people' through the map's door: FOR JOBS, PLUMBER); THE JOB TELLS THE TRUTH and THE
DANGER RAMPS ran past 40 min and were stopped, not settled.
FOR UI: a fortress's hall can deal up to twelve men; on its side no step holds more than six with the retinue (BohemiaNoScroll says
over); THE SPOILS' walk stops at the crew screen's perk button #pick (red on the last build too).
FOR PLUMBER: PAGES PUBLISH is red: the publish list measured 906 MB of 900 (16,785 files) on 159a60c6d, over before this round's two
card pictures (0.4 MB) were added; the cap or the list is yours. VOTE TAB's 'the alpha lands on VOTE after BEGIN' (and its two legs) red
the same on the alpha before this round. FOR PLUMBER: MAKE CAMP's whole glass still waits on the map's one full paint as the camera climbs back after any fight (bohemia_motion.js
'live' render of renderCity): a CPU profile of the press (FIXES_PROFILE=<folder> on gates F538 writes one) puts 367 ms of a 518 ms task in
one canvas fill inside mapDepthBlit (BOHEMIA_CITY_WORLD.html, the walkers' depth pass, the CPU canvas's exact path; a phone takes the
GPU path there, unmeasured); F538 prints the whole glass as INFO (199 to 1,036 ms across runs on this box). Also found and fixed in
538: the phone's job board planned every job new to the day at once on its first paint after a fight (322 to 866 ms); now inside a
25 ms budget (bohemia_job_danger.js __A_BOARD_PLANS_IN_A_BUDGET__, beside your 7's new-crew deferral).
NEXT: EYES' next walk re-measures; FIXES checks main each round for new FOUND BY EYES rows and PLUMBER 8's bugs.
[bb] Battle Brothers' recruit list keeps every man one line and the one you pick in his own panel; our hall on its side keeps them two
to a row and the one he opened beside them.
[analog horror] a talking face with a blank name tag is the one wrong thing the bible saves for on purpose; this one was an accident.

FIXES (session_01GKDyusA41u1wU4yGPBEr7y): 11/9 -- [the fourteen eyes found] rows 525 and 527 to 537 SHIPPED, 538 HALF (the
scavenge game's freeze fixed; MAKE CAMP's measured, OWED), 526 closed by him (rule 439). BUILD 11/9n - THE WORDS WHOLE, THE SHELF
TRUE, BUILT, NOT YET SEEN.
Record records/BOHEMIA_FIXES_THE_FOURTEEN_EYES_FOUND_11_9_26.md. VOTE fixes-the-words-whole-the-shelf-true-11-9 (stand_in).
GATE: THE FOURTEEN EYES FOUND (gates/the_fourteen_eyes_found_gate.js, registered): one leg a row (F525, F527, F528, F529, F530,
F531, F532, F533, F534, F535, F536, F537, F538), phone upright and sideways where the screen has both, every leg with a PLANTED fail.
WHAT: the end screen fits the glass (525); the fight's phone: every press reaches past its icon, never over another, the ability
wells whole (527, rule 238(b): a whole 44 needs a bigger phone, which he banned); the barber whole sideways (528); the pistol's card
says SHOOT with the shot's damage (529); a win names who they were (530); the meet card says the board the fight deals, from the
fight's own files (531, engine/bohemia_meet_ground.js, 85 of 85 districts); a melee hire with his melee arm, the trait word whole
(532); job cards whole (533); the new game whole sideways (534); BEST off the keeper's words (535); a raised stat reads higher (536);
the smith's shelf named and drawn by the object, no two rows of one name (537); the scavenge game's freeze: the camp's and the scavenge
game's hidden board page decoded each ground picture again on the main thread at its first draw; now off the main thread
(ImageBitmaps) and the bake in two tasks, the page's longest task 675 ms to 172 ms, the game's open on the demo 1,042 ms to
under 330 ms (538, slices/BOHEMIA_FIGHT.html __THE_BAKE_DOES_NOT_FREEZE__, the camp's page only).
ALSO: THE GATE TABLE WAS MALFORMED SINCE 93c6e4f4 (THE CAMP IS PITCHED ON THE BOARD lost its slow flag) and the suite refused to run
any gate; restored, 1,200 rows valid.
FOR COMBAT TWO: engine/bohemia_meet_ground.js board() mirrors BOHEMIA_FIGHT.html dealBoard/dealOnce's order (graveyard, casino
floor, freeway, a place's built board, board_grounds, BOARD_KINDS); change the order and F531 goes red until it follows.
FOR UI: the crew screen on its side, the SORT tab column 5 to 8 px past the glass (from before this round); the STALL on its side
(main alike, by what it stocks): YOUR GEAR runs past the sheet's foot (the header at 306 to 323 under a sheet ending at 310 on
844 x 390), so with a stash its SELL buttons are off the glass (SCROLLING IS ILLEGAL N3 'Sell the beat-up pistol' at 785,333). FOR RUN FIVE: the
receipt hangs 18 px off the glass on purpose; the scrolling gate's OWED line reads it as off the glass.
WEAK: 527 is the reach, not a 44 px press (his rule 238(b)); the meet card's freeway line is generic (the deck or the stack, never
which crossing: the spot is read only when the fight opens).
FOR COMBAT TWO: the fight's own start bakes the same way and still decodes its ground on the main thread at the first draw (EYES:
0.98 s a road fight's deal, 0.73 s the first fight's); the same off-thread load would take it down, at the cost of holding the
ground decoded for the fight (18 blocks of 2575 x 1820 is about 340 MB on a phone), so it is yours to weigh.
FOR PLUMBER: main's MAKE CAMP FROM THE FIGHT (C2) and EVERY LEVEL WAITS (W1, W3, W4) read 'no fight' because a new game can start on
a town's ground and the map's door holds a road fight off it (townDoorHolds, __A_TOWN_IS_ALWAYS_A_DOOR__): roadContactFight returns
false, measured at city 31,69. THE FOURTEEN EYES FOUND's roadFight() steps him to the nearest land off the town first; those two
gates want the same step. FOR PLUMBER: the publish list is at its cap (PAGES PUBLISH: 900 MB of 900 MB, 16,687 files, measured on this build; this round added
0.5 MB); the next lane to add a picture will turn it red.
NEXT: 538's other half, MAKE CAMP after a won fight: under 1 s on this box on main and here (its tasks 145 to 300 ms; the gap 896 to
924 ms on main, 736 to 793 ms here; EYES' 1.37 s did not come back), the gap left is NAMED (the Long Animation Frames API, after this
ship): one 577 ms frame at the tap with 8 ms of script, no style, 10 ms of render, nothing blocking: the fight's whole page going
away (the shell's nfHome: fr.src = 'about:blank', fr.remove()). RUN's door; the fix is the page's unload off the press (let it go
after the map is up, or keep the page and reuse it). F538 prints it OWED until then.
Then EYES' next walk re-measures both on the phone.
[bb] Battle Brothers' pre-battle screen names the terrain the battle is cut from; ours names the board the fight deals.
[analog horror] a card that promised an open road and a board of houses with every upstairs window dark.
