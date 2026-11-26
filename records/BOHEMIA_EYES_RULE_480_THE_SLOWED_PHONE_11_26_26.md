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
