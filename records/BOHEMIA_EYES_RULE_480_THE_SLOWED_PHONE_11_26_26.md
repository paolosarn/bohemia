# EYES 11/26 -- RULE 480 ON A SLOWED PHONE: THE ALPHA PLAYED UPRIGHT AND SIDEWAYS, EVERY SCREEN'S FRAMES (the routine 'EYES: rule 480')

WHAT WAS PLAYED: the alpha at the real address, main ec97371ae (rule 480), from disk, a fresh phone, the road's events, the boss
askers and the places' cards ON (EYES_AS_PHONE=1), THE CPU SLOWED FOUR TIMES (Chrome's own throttle, EYES_CPU=4, as rule 480(d)).
UPRIGHT 390 x 844: the loading page, BEGIN, the barber, GO, Trades, the board, a job taken ('Bring medicine down from the lodge'),
the stall and a buy, LEAVE, the map standing, a finger dragging it, a pinch out and in, travelling, the road's cards, a fight to its
end on AUTO and its LEAVE, camp, his place planted (the game's own call, a shortcut) and walked into, CAM 2 and CAM 3. SIDEWAYS
844 x 390: the loading page to a fight's LEAVE. The fights were started by the bestiary check's own hand-over (a shortcut, said: the
job's lodge was at (-63, 11) and four minutes of travel met nothing).

HOW IT IS COUNTED: EYES' live tool now keeps every frame's time in the top page (the iframes share its thread) and every long task
(a block of the game's own code over 50 ms) in every frame (counted once). A HITCH is a frame past 50 ms (rule 480(d)).
WHAT THIS BOX IS, SAID OUT LOUD (PLUMBER's own words in SMOOTH IS A BUDGET): it draws with a software GPU (SwiftShader), so EVERY
screen reads far under 55 frames a second here, whatever the game does; the frames a second below compare screens, they are not his
phone's. What travels to his phone are the FROZEN FRAMES WITH LONG TASKS: a frame of half a second or more while the game's own code
runs that long is work his phone's CPU does too. Those lead every row.

## THE SCREENS (upright, then sideways; frames a second on this box, the worst frame, the longest task)

| screen | upright | sideways |
|---|---|---|
| the loading page to BEGIN | 7.8 fps, 883 ms | 8.0 fps, 917 ms (task 701) |
| BEGIN to the barber (the world builds) | 2.5 fps over 36 s, frames of 5,083 / 3,183 / 2,300 ms | 2.9 fps over 24 s, 2,567 ms (task 2,248) |
| GO to the first town | 4.3 fps, 850 ms | 4.0 fps, 4,283 ms (task 3,819), 1,167 |
| the first town, standing | 8.5 fps, 450 ms, a task of about 345 ms every second | 7.5 fps, 583 ms (task 520) |
| a tap on the board | 7.2 fps, 483 ms (task 386) | not walked |
| a job's card | 8.8 fps, 683 ms (task 608) | not walked |
| Take it | 9.3 fps, 800 ms (task 701) | not walked |
| the stall's shelf | 10.9 fps, 567 ms (task 460) | not walked |
| a price tapped twice | 18.3 fps, 83 ms | not walked |
| LEAVE, the town to the map | 21.9 fps, 617 / 600 ms (task 468) | 9.3 fps, 1,017 ms (task 907) |
| the map, standing | 3.4 fps, 433 ms | 24.2 fps, 583 ms (task 604) |
| the map, a finger drags it | 6.1 fps, 517 ms | not walked |
| the map, a pinch out and in | 5.4 fps, 483 ms | not walked |
| the map, travelling | 5.4 to 9.6 fps, 417 ms | not walked |
| a fight's first frames | 9.7 fps, 533 / 533 ms (task 426) | 8.9 fps, 567 ms (task 1,533) |
| FIGHT, the bell | 5.8 fps, 483 ms | -- |
| the fight on AUTO to its end | 11.1 fps over 35 s, 567 ms | 1.9 fps over 94 s, 1,333 / 1,033 ms |
| the end screen | 5.3 fps, 300 ms | 4.1 fps, 500 ms |
| LEAVE, the fight to the map | 3.4 fps, 1,050 / 683 / 633 ms (task 599) | 3.6 fps, 1,367 / 783 ms (task 972) |
| camp (the red cross) | 4.5 fps, 600 ms (task 586) | not walked |
| camp, standing | 2.7 fps, 733 ms, a task of about 425 ms every second | not walked |
| the trip into his place | 5.7 fps, 1,317 / 1,100 ms (task 783) | not walked |
| his place, CAM 1 standing | 13.2 fps, 117 ms | not walked |
| CAM 2 tapped | 9.7 fps, 1,033 ms (task 955) | not walked |
| CAM 3 tapped | 15.9 fps, 167 ms | not walked |

## FOUND BY EYES (each an ask row, owner named; things he feels first)

724. THE DOOR INTO THE GAME FREEZES (PLUMBER 8). BEGIN to the barber took 36 s upright with frames frozen 5.1 s, 3.2 s and 2.3 s;
   sideways a 2.6 s frame (one task 2.2 s). GO to the first town froze one frame 4.3 s sideways (one task 3.8 s). Rule 480(c): 'no
   frame that stalls while something loads'.
725. LEAVE FROM A FIGHT FREEZES ABOUT A SECOND (PLUMBER 8, with FIGHT SCREEN 3). The end screen's LEAVE back to the map: frames of
   1,050 ms upright and 1,367 ms sideways (tasks 599 and 972 ms).
726. THE STALL BUYS ONE TIME IN THREE ON A SLOW PHONE (UI FIVE). 'Tap it twice to buy' counts the two taps by when the page handles
   them (performance.now() in stallTap, 450 ms), not when the finger lands; with the town's tasks running, three quick double taps
   (150 ms apart by the finger) were handled 510, 440 and 473 ms apart: one bought (food 21 to 22), two did nothing; a second tap a
   second after reading the line never buys (e02). He reads 'Tap it twice', taps twice, and nothing happens.
727. FIVE ROAD CARDS HAVE NO WAY TO SAY NO (WORLD 15, WORLD 14's file). On the road a man with a shopping cart ('FOR YOUR PLACE')
   offered only 'Pay him ten batteries' or 'Trade him four nights of food'; a tap off the card left it up (e01). In the road events'
   data every answer costs on ev_the_solar_cart, ev_the_family_at_the_door, ev_the_leaderless, ev_the_freed_cooks and
   ev_the_good_price. Rule 32a and the second votes: nothing is forced.
728. CAMP IS THE SLOWEST SCREEN, AND ITS CLOCK LIES ON A BUTTON (CAMP FOUR, with UI FIVE). Camp standing: 2.7 frames a second here
   with a task of about 425 ms every second and frames of 733 ms, worse than the map standing; the red cross itself 600 ms. On the
   alpha its big 'DAY 1 16:00' is drawn over the left column's STANDING button (e03).
729. HIS PLACE: THE DOOR IN AND A CAMERA SWITCH FREEZE (HOME BASE 3). Walking in: frames of 1,317 and 1,100 ms (a task 783 ms);
   CAM 2: one frame of 1,033 ms (a task 955 ms). CAM 1 and CAM 3 stand at the best frames of the walk.
730. A TAP ON A JOB STALLS (JOBS 2): a job's row to its card 683 ms (a task 608), Take it 800 ms (a task 701).
731. THE MAP AND THE TOWN NEVER SIT STILL ON A SLOW PHONE (WORLD 13 the map, WORLD 15 the town, with PLUMBER 8). Standing still the
   town runs a task of about 300 to 520 ms every second, the map one of about 270 ms (upright) to 600 ms (sideways); the map reads
   3.4 frames a second standing upright, 6 under a dragging finger, 5.4 in a pinch, 5 to 10 travelling (PLUMBER's P1 ratchet says
   the same); LEAVE from a town 600 to 1,017 ms.
732. THE FIGHT SIDEWAYS DRAWS AT A SIXTH OF UPRIGHT (COMBAT FOUR, with FIGHT SCREEN 3). The same AUTO fight: 11.1 frames a second
   upright, 1.9 sideways (frames of 1,333 and 1,033 ms, its tasks only 304 ms: the drawing, not the code); a fight's first frames
   533 to 567 ms both ways (a task 1,533 ms sideways).

## SEEN WORKING ON THE WAY

The barber's GO took, the first town opened on RUN both ways, the job's card says only Take it / Not now, a buy that landed wrote
'You have 22 nights of food', the cart man paid moved his panel to your place, a fight ended on AUTO both ways, the end screen's
LEAVE brought the map back both ways, camp says RESTING with its fire on the map, his place opened on CAM 1 bare. FOLLOWERS (once
CLOUT) on the bar: 0, then 15 after the fight. 0 page errors.

## NOT WALKED (said)

Sideways: the board, a job, the stall, a pinch, camp and his place. A fight met by the road (the job was far off). The VOTE tab's
frames. The shortcuts: the fights by hand-over, his place by the plant call.

## BUILDS THAT LANDED DURING THE ROUND

- 11/26b THE VOTE TAB NEVER CHOPPY (WORDS THREE, 372b04009): SEEN on the alpha upright at 4x, a thumb's flicks on the glass. MORE
  tapped: 59.5 frames a second, 0 frames past 50 ms, the worst 33 ms. His homework sheets scrolled (10 flicks): 53 a second, 4 frames
  past 50 ms, the worst 83 ms, no long task. The tab's open (a tap on VOTE from RUN): 15.9 a second with a 700 ms frame, and the first
  8 flicks 49 a second with frames of 300 and 283 ms: those come from THE GAME RUNNING HIDDEN BEHIND THE TAB (the first town's tasks
  of about 300 to 420 ms, in the map's and the town's frames, row 731), not from the tab; they stopped by the time MORE was tapped.
- 11/26a A MEND NEVER COSTS MORE THAN NEW (ECONOMY THREE, cb2204674): 3 of 204 pieces by 1 to 2 batteries; not reached on a fresh
  game (no piece broken that far); not walked.

## RULE 482'S ROUND: ROWS 724 TO 732 AGAIN, AND THE NEW BUILDS (main aab904f7f, the same slowed phone, the same walk)

| row | upright now (was) | sideways now (was) | word |
|---|---|---|---|
| 724 the door into the game | BEGIN to the barber 2,850 ms (task 2,277) (5,083); GO to the town 767 (850) | BEGIN 1,817 (2,567); GO to the town 4,517 ms (task 3,951) (4,283) | STILL RED |
| 725 LEAVE from a fight | 917 / 900 / 867 ms (task 678) (1,050) | 1,167 (task 910) (1,367) | STILL RED |
| 726 the stall's double tap | three double taps: one bought, one did nothing (the 450 ms window by handling time, unchanged in stallTap) | -- | STILL RED |
| 727 road cards with no no | the same five in the data, unchanged | -- | STILL RED |
| 728 camp | the red cross 483 ms (600); camp standing 12.2 fps, worst 133, no long task (2.7 fps, 733) | -- | FRAMES BETTER; its big clock now lies over SCAVENGE · 8H (e06): STILL RED IN PART |
| 729 his place | the door in 1,267 / 850 ms (task 674) (1,317); CAM 2 worst 150 ms, no long task (1,033) | -- | CAM 2 FIXED; THE DOOR STILL RED |
| 730 a tap on a job | the card 333 ms, Take it 367 (683, 800): no spike above the town's own | -- | THE SPIKE GONE (what is left is 731) |
| 731 the map and the town | the map standing 59.4 fps, 0 hitches (3.4); the town standing 4.6 fps with tasks of 560 ms (8.5, 345); LEAVE from the town 767 (617) | the map standing 14.6 fps with one 1,300 ms frame (task 1,238); the town 6.8 fps, 600; LEAVE 1,150 | THE MAP STANDING UPRIGHT FIXED; THE TOWN AND SIDEWAYS STILL RED |
| 732 the fight sideways | AUTO 12.7 fps, worst 733 (11.1) | AUTO 14.2 fps, worst 500 (1.9, 1,333) | THE SIDEWAYS GAP FIXED (both ways alike now); the first frames still 650 to 783 ms |

- 11/26d RELOAD OR OUT, NEVER CHOPPY (FIGHT SCREEN 3): the AUTO fight sideways went from 1.9 to 14.2 frames a second on this box and
  upright 11.1 to 12.7 (its own measure: the card's refresh 14 ms to 5, the phone card's repaint 9 ms to 2). The card's three rounds
  states and the ninth AP pip are too small to judge by eye at the fight's size; not judged.
- 11/26e THE MONEY BOOK STAYS SMALL (ECONOMY THREE): sideways, a reload and BEGIN brought the game back with its money whole (291
  batteries, 15 followers, 60 rounds, as before the reload) (e05).
- FOUND 733: AFTER A RELOAD THE ALPHA SHOWS A NEW CREW'S PAGE, BUT BEGIN CONTINUES HIS GAME (UI FIVE). The alpha's front after a
  reload: 'Three of you and nothing owed. Start clean. 290 BATTERIES', every new game's choice (the crew's name, who you were, the
  fights, the shelves, the valley's code) and no CONTINUE (e04); BEGIN then skipped the barber and brought back the game he was
  playing (e05). The page says a new start while the button continues; he cannot tell whether his game is kept, and the choices
  on it do nothing. The demo's title says NEW GAME and CONTINUE.
