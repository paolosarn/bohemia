# COMBAT FOUR: THE LOADING SCREEN BREATHES (BUILD 11/26w - THE LOADING SCREEN BREATHES)

11/26/26. COMBAT FOUR, the coordinator's routine 'COMBAT FOUR: rule 480', item (3): 'Rule 480(c) on your screens: every board from its
first frame to LEAVE, auto combat, no hitch at the start or the end, on a slowed phone (390x844, CPU slowed 4x).' Rules 480(b)(c)(d),
482(c), 441; ask row 732 (this lane's, with FIGHT SCREEN 3). No line rewritten (465).

## MEASURED FIRST: EVERY BOARD (tools/bohemia_combat_four_every_board_frames_11_26_26.js)
COOK SIX's frame walk (tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js) widened to every board this lane lays: all forty big
insides (the district and the first layout read from each inside's own data) and four plain grounds, the fight's own page, 390 x 844, the
CPU slowed 4x, every painted frame timed: LOAD (the loading screen to the board), OPEN (the lineup's first three seconds), PAN (close in
across the board and out), AUTO (the bell rung with AUTO on, played to the fight's end or 12 s, with the brain's own think times). Its
'AUTO' had never fought before (the lineup waited for FIGHT): now it rings the bell. 44 boards, 0 page errors:
- LOAD: ONE FROZEN FRAME on every board, 2.1 to 4.8 s (median 3.9 s); the loading screen 4.4 to 11.3 frames a second.
- OPEN: the board's first frame 267 to 883 ms (median 567).
- PAN at night: 3.6 to 4.4 frames a second (the drawing; median 4.1).
- AUTO: 9.5 to 37 frames a second (median 13.3), its worst frame 183 to 550 ms (median 267; the fuel depot 550, the campus 400, City
  Hall 383); the brain's longest think 81 to 264 ms (median 137).

## THE LOAD'S FROZEN FRAME, PROFILED (a CPU profile of the school's load at 4x)
3.1 s of the main thread making the men's rig sheets and the packed atlases into bitmaps from <img> pictures already decoded on it
(createImageBitmap(img) copies them there), and 2.4 s drawing (sheetDraw): the bake's first draw of every ground picture (laidPaint,
the edge strips, the ring), each decoded again on the main thread the first time a canvas draws it (FIXES' finding on the camp's page
11/9, __THE_BAKE_DOES_NOT_FREEZE__, which fixed the camp's page only).

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html)
- __A_SHEET_DECODES_OFF_THE_GLASS__: a rig sheet and a packed atlas are made bitmaps straight from their file (fetch, blob,
  createImageBitmap: decoded off the main thread); a browser without it, or a failed fetch, falls back to the old way.
- __THE_GROUND_DECODES_OFF_THE_GLASS__: the fight's own ground and inside pictures (fight_ground/) come the camp's way (FIXES' offThread):
  an ImageBitmap decoded off the main thread, the first draw a plain copy. __fightLetGo already closes every bitmap when the fight goes.
- Switches for the before (a gate's mutation, never set by the game): window.__SHEET_ON_GLASS, window.__GROUND_ON_GLASS (the walk's
  C4_BEFORE=1 sets both).

## AFTER (the same walk, eight boards: the hall, the school, the boneyard, the swap meet, the fuel depot, the campus, a suburb street, a desert street)
| | before | after |
|---|---|---|
| LOAD, its worst frame | 2.7 to 4.2 s | 1.0 to 2.0 s |
| LOAD, frames a second | 4.4 to 11.5 | 24 to 37.5 |
| OPEN, the board's first frame | 367 to 667 ms | 450 to 1,000 ms |
| AUTO | 11.7 to 33.7 fps, worst 200 to 300 ms | 12.4 to 32.6 fps, worst 217 to 283 ms |
The loading screen moves again and its freeze is halved; the board's first frame got about 250 ms longer (the ring's first draw of the new
bitmaps; on this box the GPU is software, so every draw is the CPU's). The two together: about 4.3 s of freeze -> about 2.5 s. The CPU
profile of the school's load: the longest frame 3,967 ms -> 1,417 to 2,183 ms; createImageBitmap's 3.1 s off the main thread.

## WHAT IS STILL RED (rule 480(d)'s bar: no frame past 50 ms, 55 frames a second, on this box at 4x), NAMED, NOT HIDDEN
- The board's first frame (the ring around the board drawn once, laidPaint, 0.45 to 1 s) and the night's PAN (4 fps): the drawing.
- AUTO 12 to 33 frames a second: the drawing (the frames are 67 to 150 ms while the brain thinks 20 ms at the middle) and the brain's long
  thinks (a gunman's first turn planned whole, 81 to 264 ms at 4x). NEXT for this lane: the brain's plan split across frames with not one
  decision changed (the page already snapshots fights for its odds; the same brain on a snapshot, off the glass), and the ring drawn behind
  the loading screen in pieces.

## THE GATES AND THE PAGE (rule 441)
THE WHOLE LOOP PLAYS 11/0; NO AMMO, NO SHOT 12/0; THE SHEETS ARE PACKED 4/0; THE FIGHT READS ONLY SOURCED NUMBERS 8/2, the same two legs red
on main (typed numbers in another lane's line; leg k). Through the map's own door to the end screen's LEAVE: the alpha sideways (downtown)
2 fights, the demo upright (the boneyard) 1 (6 of 6 tile taps), the alpha upright (suburb) 1, the demo sideways (industrial) 1; 0 page errors.

## SAID PLAINLY
No VOTE card: the change is time, not a picture (the loading screen keeps moving on a slow phone). [bb Battle Brothers' battle loads behind
a still screen; ours keeps its loading screen alive] [analog horror: the tape that used to freeze on the title card now rolls through it]
