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
- FOUND 738: AFTER A RELOAD THE ALPHA SHOWS A NEW CREW'S PAGE, BUT BEGIN CONTINUES HIS GAME (UI FIVE). The alpha's front after a
  reload: 'Three of you and nothing owed. Start clean. 290 BATTERIES', every new game's choice (the crew's name, who you were, the
  fights, the shelves, the valley's code) and no CONTINUE (e04); BEGIN then skipped the barber and brought back the game he was
  playing (e05). The page says a new start while the button continues; he cannot tell whether his game is kept, and the choices
  on it do nothing. The demo's title says NEW GAME and CONTINUE.

## THE ROUTINE 'EYES: walk 11/26f to j' (main c373aa657, the same slowed phone, upright and sideways; sideways re-taken alone)

| row | now | word |
|---|---|---|
| 724 the door into the game | upright BEGIN to the barber one frame 5,683 ms (one task 5,646); sideways GO to the first town 4,850 ms (task 4,837) | STILL RED |
| 725 LEAVE from a fight | 11/26f: LEAVE now reads faint (opacity 0.4) when it first shows, 2.0 s after the fight ends, and a tap on it then does nothing; lit, a tap went home in 1.1 s, but froze one frame 1,183 ms (task 954) upright; sideways 1,000 (task 725) | STILL RED (the freeze) |
| 726 the stall's double tap | three quick double taps at 4x: none bought (21, 21, 21) | STILL RED |
| 727 road cards with no no | the same five in the data | STILL RED |
| 728 camp | standing 10.8 fps, worst 283, tasks 64 ms: holds; its big clock still lies over SCAVENGE · 8H (e09) | STILL RED IN PART (the clock) |
| 729 his place | the door in 700 ms (task 551) (was 1,267); CAM 2 167, CAM 3 217 | BETTER, STILL RED (the door) |
| 730 a tap on a job | 11/26j: the card on the glass 336 ms after the tap at 4x | FIXED |
| 731 the map and the town | the map standing upright 59.2 fps (holds); sideways 29.5 with one 1,149 ms task; the town standing 4.5 fps upright (tasks 551), 7.8 sideways (710); LEAVE from the town 1,500 ms upright (task 1,444), 950 sideways | STILL RED (the town and its LEAVE) |
| 732 the fight sideways | AUTO sideways 11.9 fps, upright 12.7: holds | FIXED, HOLDS |
| 738 after a reload | the front still says 'Start clean' with no CONTINUE | STILL RED |

- 11/26f LEAVE WAITS FOR THE SCREEN (FIXES 3): SEEN: faint, then lit; the summary seen before home (e07). A tap on the faint LEAVE is
  dropped, not kept for when it lights; he taps once more.
- 11/26g HOMEWORK SHEET NINE (WORDS THREE): its cards sit behind MORE as before; not read card by card this round.
- 11/26h THE TERMINAL, THE FORT AND THE MALL AGAIN (COOK SIX): THE AIRPORT TERMINAL dealt sideways on AUTO: rows of seats with
  luggage piles on a darker floor, its roof drawn (span), to the end in 61 s, staleTurns 0 (e08). The fort's cell dealt its street
  board and the mall's cell THE PARKING GARAGE (their share); not seen.
- 11/26i THE HALL SAYS THE CART (STAFF 2): SEEN IN PART: the hall's three camp people (Earl Pruitt, lookout; Danny Nguyen, scout; Dot
  Kowalski, scavenger) each carry 'Pushes a shopping cart. One hand only.' on their row; a tap in the full hall shows his own words
  only (the line rides on a held finger there, by design); the hold not walked.
- 11/26j THE CARD AT ONCE (JOBS 2): SEEN: 336 ms tap to card at 4x (row 730 FIXED).

## THE ROUTINE 'EYES: walk the new builds' (builds 11/26m to 11/26z, main 0ebbe568c; the same slowed phone, upright and sideways alone)

A CORRECTION FIRST: my stall readings after 11/26v (the walk 11/26f to j's '726 STILL RED') sent taps with no time of their own, so a
busy page stamped them late; that was my tool. With each touch carrying its finger's time (CDP timestamp, 150 ms apart), the game is
right (below).

| row | now | word |
|---|---|---|
| 724 the door into the game | upright BEGIN to the barber one frame 7,583 ms (one task 7,502); sideways GO to the first town 5,716 ms (task 5,722) | STILL RED (no better) |
| 725 LEAVE from a fight | upright 1,000 ms (task 745), sideways 733 (task 461); a tap on the faint LEAVE now waits and goes home when the screen opens (9.3 s later at 4x) | STILL RED (the freeze) |
| 726 the stall's double tap | 11/26v: three double taps, each touch with its finger's time: 3 of 3 bought (22 to 25); one tap alone buys nothing | FIXED |
| 727 road cards with no no | 11/26v: all five now end 'Walk on.' (data) | FIXED (not met on the road this round) |
| 728 camp | not re-walked cleanly (my second fight's end screen was still up under the red cross) | NOT WALKED |
| 729 his place | not cleanly measured (the same) | NOT WALKED |
| 730 a tap on a job | the card 550 ms frame (task 233) | HOLDS |
| 731 the map and the town | the map standing upright 57.8 fps (holds), sideways 41.5 with one 817 ms frame (better, was 29.5); the town standing 3.7 fps upright (tasks 637), 3.1 sideways (758); LEAVE from a town 717 / 1,100 | STILL RED (the town) |
| 732 the fight sideways | AUTO upright 9.2 fps, sideways 8.5: alike | HOLDS |
| 738 after a reload | still 'Start clean', no CONTINUE | STILL RED |
| 740 the board's danger plans | ON THE GLASS: a tap on the board froze one frame 1,917 ms (one task 1,775) upright | SEEN, RED |

- 11/26p NOTHING TO PRESS (FIGHT SCREEN 3): SEEN IN PART: on their first turn by hand the card showed their THUG with nothing to press
  (no STRIKE, no note) (e11). FOUND 747 below.
- 11/26v, 11/26u (the map standing upright holds; sideways better), 11/26j: as the table. 11/26m (the cones off), 11/26n (the price at
  a glance), 11/26o (the bosses' frames), 11/26q (the grinder), 11/26r (the moment heard), 11/26s (the turn count home), 11/26t (a job's
  one door), 11/26w (the loading screen breathes), 11/26y (PLUMBER's frame walk), 11/26z (the beast that beat you): not walked by eye
  this round; rows 733, 736, 737, 741 to 746 not walked.

FOUND 747 (FIGHT SCREEN 3). ON AUTO, ON THEIR TURN, THE PHONE STILL HOLDS HIS MAN'S BUTTONS, AND ONE OF THEIR FACES WAS EMPTY. With
AUTO on, while 'Their move.' stood on the board (the fight's own current man theirs), the phone's card was RAUL's with RELOAD and STRIKE
lit and 'No skills on this man yet. A level brings a perk.' (e10). On their first turn by hand the card named their THUG with his
portrait box empty, a dark square (e11; one sample).

## THE ROUTINE 'EYES: walk the new builds' (11/26za to 11/26zr, main c5b9ea411; 11/27)

THE LONG SESSION FIRST (rows 744, 748, PLUMBER 8's 11/26zp and 11/26zq): EYES' AUTO tool played TWENTY road fights in one alpha page
(upright, at full speed, the suburb, the strip, an arterial, Fremont and the casino floor): every fight to its end, NO CRASH, 0 page
errors, 0 tool errors. The renderer's memory, sampled every 20 s (the peak while each fight count stood), in MB: before the first
fight 1,798; then 2,752, 3,167, 3,508, 2,606, 3,563, 2,882, 2,772, 3,011, 3,438, 2,899, 2,879, 3,098, 2,973, 2,712, 2,625, 2,813,
2,266, 2,634, 2,903, 2,501 after the twentieth: FLAT, it gives back after each fight (BESTIARY 2 measured about 340 MB a fight kept, to
5.5 GB at ten). This box draws in software, so its 2.3 to 3.6 GB is not his phone's; the flat line is (the log:
records/eyes_rule480_11_26/twenty_fights_memory_11_27.txt).

| row | now (the slowed phone) | word |
|---|---|---|
| 724 the door into the game | 11/26zr did not reach it here: upright BEGIN to the barber one frame 7,733 ms (one task 7,650); sideways GO to the first town 6,500 ms (task 5,794) | STILL RED |
| 725 LEAVE from a fight | upright 1,750 ms (task 1,182), sideways 917 (task 842); a tap on the faint LEAVE went home 9.9 s later at 4x | STILL RED |
| 726 the stall | 3 of 3 double taps bought with each touch's own time; one tap nothing | HOLDS |
| 728 camp | 11/26zo: camp standing 11.3 fps, worst 150 ms, no long task; the red cross 300 ms; its big clock gone off the column (e13) | FIXED |
| 729 his place | CAM 2 54 fps, CAM 3 52 fps; the door in one frame 1,383 ms (task 436) | THE CAMERAS FIXED; THE DOOR STILL RED |
| 730 a job | its card 750 ms frame (task 469, the town's own) | HOLDS (the rest is 731) |
| 731 the town | the town standing 3.2 fps upright (tasks 862), 3.2 sideways (962); the map standing upright 53 fps (holds), sideways 13.6 with no long task | STILL RED (the town) |
| 732 the fight | AUTO upright 6.5 fps, sideways 7.5: alike; upright reads lower than the last two rounds (9.2, 12.7) on this box | HOLDS (watch) |
| 738 after a reload | 11/26zg: the alpha's front over a save shows BOHEMIA, NEW GAME and CONTINUE (e12) | FIXED |
| 744 the page grows every fight | twenty fights flat (above) | FIXED ON THIS BOX |
| 748 his crash entering combat | the crash half: twenty fights in one page, no crash, memory flat; the way in (COMBAT FOUR) not judged | THE CRASH HALF SEEN HOLDING |

Not walked this round (said): 11/26za to zn and zh to zm by eye (the beasts' words, every weapon drops, a supply on the bar, the
places in the ground, the cameras on patrol, the pay as a moment, the man who comes home, the crowd seated once, the robes off, the camp
runs scared, the boss arrives, the hog squeals); rows 733, 736, 737, 740 to 743, 745, 746, 747 (their turn on AUTO), 749 to 754.

## THE ROUTINE 'EYES: walk the new builds' (11/27a to 11/27s, main a7a8d6fb2; 11/27 morning)

PLUMBER 8's IN AND OUT THE IPHONE'S WAY, run in the foreground alone (two fights in and out on the demo at 4x): 6 passed, 1 failed;
the six real legs green (the dive's canvases 1 MB back on the map, the fight and spoils pages emptied, 141 and 149 MB of canvas back on
the map, the ratchets 1,010 of 1,250 MB and 219 of 300 MB); THE FAIL IS ITS OWN PLANT: 'the old way' came back at 169 MB, under I3's
170, so the plant meant to prove I3 bites did not bite (row 778 below). Its printed budget: every live picture 1,010 of the iPhone's
768 MB, over by 242 (rows 768, 769 own it).
TEN FIGHTS IN AND OUT on the alpha (EYES' AUTO tool, full speed, upright): no crash, 0 page errors; the renderer's peak per fight count,
MB: 1,683 before; 2,199, 2,540, 2,544, 2,326, 2,527, 2,364, 2,107, 2,016, 2,075, 1,942 after the tenth: flat and easing, lower than the
last round's 2.3 to 3.6 GB (records/eyes_rule480_11_26/ten_fights_memory_11_27.txt).

| row | now (the slowed phone) | owner named by the routine | word |
|---|---|---|---|
| 724 the door into the game | upright BEGIN to the barber one frame 6,767 ms (task 6,689); sideways 6,633 (task 6,578) and GO to the town 4,917 (task 4,704) | FIXES 4 | STILL RED |
| 725 LEAVE from a fight | the lit LEAVE home in 2.7 s with a 1,083 ms frame (task 775) upright; sideways 1,833 (task 1,424) | COMBAT FIVE | STILL RED |
| 726 the stall | (the strip, row 777 below) | -- | HOLDS (bought) |
| 728 camp | standing 11.4 fps, worst 150, no long task | -- | HOLDS |
| 729 his place | CAM 2 51, CAM 3 53 fps; the door in one frame 1,500 ms (task 291) | HOME BASE | THE DOOR STILL RED |
| 731 the town | standing 3.6 fps upright (tasks 504), 3.4 sideways (629); the map standing 58.8 upright, 46 sideways | WORLD 15 | STILL RED (the town) |
| 732 the fight | sideways AUTO 8.1 fps; UPRIGHT A NIGHT FIGHT ON AUTO DREW AT 1.4 fps (frames of 1,167 and 1,150 ms while its tasks stayed at 314 ms: the drawing, about five times the last rounds' day fights) (e16) | COMBAT FIVE | WATCH (one night fight) |
| 738 CONTINUE after a reload | the title with NEW GAME and CONTINUE | -- | HOLDS |
| 744 / 748 the crash | ten fights in and out, no crash, memory flat | PLUMBER 8 | HOLDS |

SEEN: 11/27f THE CLOCK UP TOP (the bar ends 'DAY 1 06:00' with the sun) (e14); 11/27o THE STALL READS THE TOWN'S CARD ('People are
hungry. Bring me food and I pay good, 6 more.', THEY NEED IT, '37 left today'); 11/27l EVERYBODY IS STRAPPED IN PART (their THUGs walked
in with a bludgeon, a shortsword and a pitchfork in hand: the pistol rides in the waistband by design; none drawn in this fight);
11/27s and 11/27n the camp: standing smooth (its work by eye not judged). NOT SEEN: 11/27h and 11/27q the new guns and the drone (a
first-day road crew carried none; his men dagger, dagger, light crossbow), 11/27i the songs (the box has no ears), 11/27r the city at
work, 11/27p the dead Strip by day.

FOUND 776 (COMBAT FIVE, with FIXES 4). A TAP ON THE FAINT LEAVE IS LOST: on the end screen upright at 4x LEAVE showed faint 0.33 s after
the fight ended; a tap on it then did nothing and the screen stood over 40 s, until a second tap (e15). The round before, the same
faint tap was kept and went home 9.9 s later: the same tap, two outcomes, and no sign either way that it was heard.
FOUND 777 (ECONOMY THREE, with UI FIVE). THE STALL'S STRIP LAYS ITS NEXT LINE OVER THE LAST: after a buy, 'Bought. You have 22 nights
of food.' shows its top half only, the price line's box over its foot (e14).
FOUND 778 (PLUMBER 8). IN AND OUT THE IPHONE'S WAY IS RED ON MAIN BY ITS OWN PLANT: P1 ('the old way', nothing emptied) came back at
169 MB, one under I3's 170, so the leg meant to prove I3 bites passed; 6/1.
