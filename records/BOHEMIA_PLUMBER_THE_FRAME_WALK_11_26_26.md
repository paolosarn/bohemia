# THE FRAME WALK (PLUMBER 8, 11/26/26; VAMILY rule 480(c)(d), Paolo 11/26: 'make sure fps is never choppy for nothing')

Rule 480(d) gives PLUMBER 8 the check: one frame walk in the suite that plays every screen and every move between them on a slowed
phone (390 x 844, the CPU slowed four times), red on any frame past 50 ms and on any screen that averages under 55 frames a second, and
the fixes it finds, biggest first.

## THE WALK (tools/bohemia_frame_walk.js)

The freeze census's own walk of the demo (tools/bohemia_freeze_census.js: the town he wakes in, out to the map, the map standing,
travelling at the slowest and the fastest speed, the pinch in and out, a town, a shop and an item, the lot and its minigame, camp made
and broken, a fight from its start to its spoils, AUTO at 1x and 4x, a boss's fight, a home base planted and opened, a save, the game
reopened after the tab died), with rule 480's own steps added (opts.more): THE MAP PANNED by a finger, THE JOBS (a town's board, a job's
row read, the sheet shut), HIS PLACE'S CAMERA pinched in and out; and THE ALPHA'S VOTE TAB (the demo has none): its loading screen to
BEGIN pressed by a finger, the tab standing, its list dragged down and back. 42 steps. Every frame of the top page's clock (every frame
of the game shares its thread) is judged: a HITCH is a frame past 50 ms, a CHOPPY step averages under 55 a second, and every hitch says
whether the page's own code ran in it (its tasks over 50 ms covering half the frame or more, the frame each ran in) or only the
drawing did (the compositor, the GPU, the browser's raster). --profile adds each step's CPU profile (its costliest functions).

## THE FIRST READING (this box: SwiftShader as the GPU, the CPU slowed 4x)

0 of 44 steps inside rule 480 on the profiled walk, 2 of 42 on the clean one (a save; the VOTE tab dragged). 1,178 to 1,228 frames past
50 ms over the walk, 387 to 430 with the page's own code in them. The map travelling 1.2 frames a second, a fight on AUTO at 4x 1.8, a
town 5 to 14, the VOTE tab standing 20 with 173 hitches. THE BOX'S CAVEAT: this box draws through a software GPU, which stalls for
seconds with no page code running (single frames of 6 to 22 s on the pan, the pinch and a town's shop on one walk, 1 to 8 s on the same
steps the walk before); a phone's GPU does not. So the gate holds each step on the hitches WITH THE PAGE'S OWN CODE IN THEM, which travel
to his phone as they are, and on a loose frames-a-second floor; the drawing's hitches are printed.

## WHERE THE PAGE'S OWN TIME WENT (the profiled walk, each step's costliest functions)

| the source | where it hitched | the page's time |
|---|---|---:|
| A PICTURE MADE ONCE READ OFF A GPU CANVAS: the counts' marks (bohemia_ui_three_items.js ucMask), each a toDataURL that waited for everything the GPU had queued (the town's whole picture) | his place's pinch, the jobs' board | 4.6 s, 2.7 s |
| the jobs' danger, one job's plan in one piece (bohemia_job_danger.js planOne > fightsFor: the trip's route, a board laid from the template per fight, the roll) | the VOTE tab standing, his place's pinch, a boss fight's start | 9.3, 4.4, 4.8 s |
| the alpha's 2-D cast baked behind its loading screen and the VOTE tab (buildFrame, skin, skinColorLayer, bakeCast) | the alpha's loading screen, the VOTE tab standing | 10.5, 13.0 s |
| the map's ink line read back off its canvas (BOHEMIA_CITY_WORLD.html mapInkTop.busy, getImageData) | the spoils > map, town > map | 6.0, 2.2 s |
| the minigame's ground lightness read off a GPU canvas (BOHEMIA_SCAVENGE.html lumaOf) | the minigame played | 4.4 s |
| a kindOf with no file (an evaluated script's; not placed this round) | the VOTE tab, a boss's start, his place | 3.4, 1.8, 1.7 s |

## THE CUT: __THE_PICTURES_MADE_ONCE_ON_THE_CPU__

Every picture a page makes once and turns into a file (a data URL) is now drawn on a canvas kept on the CPU (willReadFrequently), so
making its file never waits on the GPU: the counts' marks and the arrow (slices/bohemia_ui_three_items.js ucMask, arrowURL), the crash
box's tin, gold, rivet and tape (slices/bohemia_ui_crashbox.js), the grain (slices/bohemia_motion.js grainURL), the supply icons
(slices/bohemia_ui_materials.js supplyIcon). The same squares drawn, none drawn per frame. Switch: window.__PICTURES_ON_THE_GPU.

AFTER (two clean walks, the same tree, the switch off and on): the once-made pictures read off the GPU over the walk 14 -> 0; the page's
own hitches over the walk 430 -> 387, the time in each step's six worst of them 161 s -> 123 s (step by step it moves inside this box's
swing). EVERY COUNT A PICTURE 15/0; THE MAP'S BAR 5/2, the same two legs with main's own versions of the four files (ask row 678).

## ROUTED (each step that misses rule 480 has its owner and row in the gate's ratchet)

- PLUMBER 8 (mine): the loads (boot, the reload, the alpha's loading screen and its cast baked behind the VOTE tab; rows 561, 724) and the
  way home from a fight (the spoils > map; row 725, with FIGHT SCREEN 3). On the fifth walk (after main's 11/26p and 11/26f on the spoils) the boss spoils > map
  held one task of 7.9 s in the top page, where four walks before read 1.2 to 3.5 s: row 725, mine, first.
- WORLD 13 (the map's draw loop this round): the map standing, travelling, panned and pinched; its ink line read back on the way home
  (mapInkTop, 6.0 s); the map's outline read back per sprite (spriteAt, 12 reads off the GPU over the walk); the late tiles' poll reading
  2.8 million pixels at boot (BOHEMIA_CITY_TILES_LATE.js poll); and a finger drag on the map, one task of 10.7 s in the map's page on
  this gate's first run (single frames of 12 to 22 s on the pan on every walk). Rows 731, 741.
- JOBS 2: one job's plan in one piece (planOne, hundreds of ms each at 4x: the trip's route, a board from the template per fight); the
  jobs' board. Rows 730, 740.
- COMBAT FOUR: the fight's steps (rows 613, 699, 732). CAMP FOUR: camp (row 728). HOME BASE 3: his place and its cameras (row 729).
  SCAVENGE: the minigame's lightness read off the GPU (row 632). RUN: the town screen (rows 566, 731; opening a town held one task of
  7.2 s in the town's page on one walk of four).

The gate: NEVER CHOPPY (THE FRAME WALK) (gates/never_choppy_the_frame_walk_gate.js, in the suite, solo). Its lines per step are loose on
purpose (3x the largest page count + 10, judged; 3x the worst page frame + 3 s and the frames a second, printed, not judged: one task ran
7.9 s on one walk and 1.2 to 3.5 s on four others; on this box a step with no page hitch read 0.4 frames a second, a 5.8 s frame of drawing alone): this
box swings a step 2x to 10x between walks; they catch a step gone many times worse, and R2 (the walk's page hitches in all, at most 538)
is the tight one. A walk stopped early now waits a beat before counting, so a stall still open at the stop is counted (the first plant
run missed its own 4 s stall that way).
