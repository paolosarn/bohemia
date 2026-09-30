# THE PAD IS TRAVEL SPEED (UI lane 11, ui-kmqmrf, 9/30/26). VAMILY [speed pad], rule 44(a).
# His words: records/BOHEMIA_PAOLO_THE_PAD_IS_TRAVEL_SPEED_THE_PORTRAIT_IS_THE_MENU_NO_TEXT_OVERLAPS_9_29_26.md
# Library vol 01: Battle Brothers has pause / play / fast-forward on the map.

## WHAT IS BUILT
On the map, bottom right where the pad sat: five lit plates, II 1x 2x 3x 5x, each 44 x 44, the one you
are on lit in the gold that already means "this one" on the phone. The eight-direction pad stays dead
for movement (37b); the fight keeps its own pad in its own frame.
HOW A SPEED WORKS: travel steps on the one 120 BPM metronome. At Nx the journey takes N blocks on each
beat, and EVERY block is a real stepOnce that pays its own clock, fires the road director and moves
the valley's parties. So a crossing costs the same game hours at 5x as at 1x, only fewer real seconds.
Not fast travel, no second mover, no second clock. PAUSE holds the journey: the route is not even
consulted, so nothing moves and the hour does not move (nothing moves until you do, 7/5).
A ROAD EVENT DROPS IT TO PAUSE: travelInterrupt() is the one door. Every fight already comes through
cityHandOver, which now calls it; RUN [road events] calls it the same way when events exist. BB pauses
there too, and it stops the valley running on at 5x the moment the fight hands him back.
A press on a plate is not a tap on the map: pointer and click stop at the plate.

## MEASURED ON THE REAL DEMO, EACH SPEED ON A FRESH GAME (a road fight can start within seconds)
    II   0 blocks, +0 game minutes in 2 s, journey still set
    1x   4 blocks, +21 min
    2x   8 blocks, +79 min
    3x   12 blocks, +100 min
    5x   15 blocks, +117 min  (ideal 20)
THE 5x SHORTFALL IS A NUMBER FOR PLUMBER, NOT A PAD BUG: one map step (stepOnce) costs 55 ms median
(65 max) on this box and a render 42 ms, so a 5x beat is about 318 ms of a 500 ms beat here, and one
beat in four was dropped. A phone is slower. The pad cannot fix it; making a map step cheaper can.
Routed to PLUMBER [grid budget] / RUN [bb map] with the numbers.
THE FIRST TEST WAS WRONG AND SAID SO: on one page, the 5x and pause runs could not set a journey at all
(a road fight had started), so they measured nothing; every speed is now measured on a fresh game and a
run that cannot set a journey is REFUSED, never reported.

## TWO MORE THINGS FOUND ON THE MAP, AND ONE FIXED
FIXED: the bar said 06:32 while the phone's own status clock said 06:26 -- two clocks on one screen
disagreeing, because the phone rewrites its clock on its own slower tick. Both read clockStr(); the
phone's is now refreshed on the bar's half-second, so the numbers on the glass cannot disagree.
NOT FIXED, NAMED (rule 44c, text overlap): with the full phone open, the shell's gear button (top left,
44 x 44) sits over the phone's page title and covers its first letters ("HO" of HOME). PLUMBER [no
overlap] should catch it; UI's to fix with [portrait menu] (the gear and the face are the two doors in
that corner).
A FALSE ALARM THROWN OUT: an overlap census put feed posts "under the pad"; they are clipped inside the
phone. The gate's overlap leg intersects every text box with its clipping ancestors before it counts.

## THE GATE
gates/the_pad_is_travel_speed_gate.js on the demo: the object (five plates, thumbs, bottom right, 1x
lit, nothing painted under it), a plate press sets and lights the speed without setting a journey, the
interrupt lights II, PAUSE holds (0 blocks, 0 minutes, still set), 3x >= 2.5 x 1x and every block paid
its clock, 5x reported not asserted, no page error.
