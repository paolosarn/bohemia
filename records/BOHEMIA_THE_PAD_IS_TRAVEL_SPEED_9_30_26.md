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

## AMENDED THE SAME ROUND: THE EXTRA BLOCKS ARE SPREAD, NOT BURST (and why the first cut was wrong)
The first cut took all N blocks inside one metronome tick. It passed its own gate, and it was wrong
against another lane's work that landed the same hour: ANIMATION [glide] round two (dd55efa) tuned the
map glide for "a step every BEAT/k" and SNAPS when the marker is more than 2.5 blocks ahead of the
picture. Five blocks in one tick is exactly that. So the extra blocks now land one every BEAT/N inside
the beat (setTimeout at k*BEAT/N), each a real stepOnce that pays its clock; a pending block does
nothing if the journey ended, the speed changed, or he left the map.
AND THE FIRST SPREAD CUT WAS ALSO WRONG, CAUGHT BY THE GATE: it redrew the whole map after every spread
block (a render is ~42 ms here), tripling the draw work, and 3x crossed 7 blocks to 1x's 5 -> RED on
"3x crosses at least 2.5 times 1x". The map glide redraws itself every frame while it moves; it only
has to notice the new block, which cityGlidePos(now) does without drawing. After: 1x 4, 3x 11.
FRAME-RATE, SAID PLAINLY: on this container (no GPU) the map draws about 5 frames a second at 1x and 3
at 3x/5x, because a map step is ~55 ms and a render ~42 ms on the main thread; per drawn frame the
picture moves 0.8 blocks at 1x and 3.5-4.5 at 3x/5x. That is the machine, and it is the number PLUMBER
[grid budget] owns: this box cannot show whether 5x glides on a phone, and I do not claim it does.
ANIMATION's own glide gate (THE MAP GLIDES, which drives the clock synthetically) passes 14/0 on the
spread build.

## WHERE IT STANDS AT THE END OF THE ROUND, AND WHY I STOPPED
Over 4 s on fresh demos with the spread build: II 0 blocks, 1x 8, 3x 17 (2.1x), 5x 20 (2.5x). The gate's
"3x crosses at least 2.5 times 1x" leg is RED, and it is left red on purpose.
MY OWN WRONG THEORY, CORRECTED: after one 2 s run gave 3x 12 against 1x 5, I blamed the window (a 2 s
window catches 4 or 5 beats) and widened it to 4 s without touching the bar. The widened window is a
better instrument, and it showed the theory was only part of it: 3x really delivers about 2x here.
The spread blocks are delayed behind the map glide's per-frame render (~42 ms a frame, running the whole
time the party moves) and each map step (~55 ms), on one main thread.
THE TRADE, NAMED: burst delivers the speed (3x = 3.0x) but snaps the glide, which is the jump he killed;
spread keeps the glide and loses speed on this box. I kept spread, because the jump is the thing he has
complained about by name. Neither is the answer; a cheaper map step is.
STOP PRODUCING: burst, spread, spread without the redraw, a wider window. Four versions of one thing is
the tell. The row stays CLAIMED, the buttons, pause, the interrupt and the clock fix are live, and the
number that finishes it belongs to PLUMBER [grid budget].

## RE-MEASURED AFTER RUN'S d77d4c1 (the 83 ms beat redraw removed), on merged main, 4 s, fresh demos
II 0 blocks / 0 min; 1x 9 / 73; 3x 20 / 143 (2.2x); 5x 20 / 144 (2.2x). Better than 2.1x, still under the
2.5x bar. The leg stays RED and the row stays CLAIMED. 5x equal to 3x means the main thread is full at
about 5 blocks a second on the gate box; a cheaper map step (PLUMBER [grid budget]) is the fix, not a
fifth timing scheme. Deployed: pages run 2615 SUCCESS on 8480ae4.
