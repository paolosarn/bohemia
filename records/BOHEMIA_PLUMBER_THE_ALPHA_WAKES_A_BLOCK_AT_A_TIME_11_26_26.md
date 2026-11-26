# THE DOOR: THE ALPHA WAKES A BLOCK AT A TIME (PLUMBER 8, 11/26/26; ask row 724, rule 480, rule 441)

FOUND BY EYES (row 724): the door into the game freezes on a slowed phone. The alpha at 4x, BEGIN to the barber: frames frozen 5.1 s,
3.2 s and 2.3 s; on the last walk one frame 7.6 s (one task 7.5 s) upright; GO to the first town 5.7 s sideways.

## HOW IT WAS MEASURED

The alpha (the game's own link), upright 390 x 844, the CPU slowed 4x, the canvas on a GPU process. Its loading screen to ready, a
finger on BEGIN, then 30 s: every long task the page reported (the Long Tasks API in the top page, the frames share its thread) and a
CPU profile over the same 30 s, each long task given the functions that ran inside it.

## WHAT FROZE IT

Two of RUN's own slow-phone cuts were switched on for the demo only, and the alpha never got them:

1. THE OLD 2-D CROWD, BAKED A WHOLE PERSON A TASK. The split bake (the boot six's stills first, their breath after the door a facing
   at a time, the later crowd and the walks a facing a task, none while the map moves; RUN 10/10, 10/13, same pictures by hash) ran
   only when `__BOHEMIA_DEMO_BUILD`. Since rule 174 the demo bakes no 2-D cast at all, so the split ran nowhere, and the alpha baked
   eight facings and four breaths of a person in one task: 0.9 to 1.9 s each, again and again (bakeCast, buildFrame, skin, the gen*
   garments, rebuildFromRig).
2. THE MORNING'S STREET, BUILT IN ONE TASK. The morning's offer (showWake -> offerRing -> ringFarLive -> castAddresses) finds the job's
   people and builds the street's people block by block (pplPeople, cellAt, realizeCell, tileMeta, pplStandable): six blocks in one
   task, 2.9 to 4.1 s under his first tap. RUN's block-a-task warm (wakeWarm, __THE_RING_WAITS_FOR_ITS_STREET__) was "the demo only".

## THE CUT (what shipped, BUILD 11/26zr)

- `__THE_ALPHA_WAKES_A_BLOCK_AT_A_TIME__` (BOHEMIA_CITY_WORLD.html bootWake): inside the alpha the wake warms its blocks on idle time
  first, as the demo's does; the same ring, a block a task, never while he travels. The demo is untouched (its own path as before);
  a page opened on its own (a checker's) wakes as it always did. Switch `window.__WAKE_ALL_AT_ONCE`.

## BEFORE AND AFTER (the gate's own run, the switch on and off; the first 30 s after BEGIN, CPU 4x)

| | the old way | now |
|---|---:|---:|
| time in long tasks | 23.7 s | 15.3 s |
| the longest freeze | 4.6 s | 1.2 s |
| freezes past 1 s | 7 | 5 |
| freezes past 500 ms | 15 | 13 |

THE COST, NAMED: the morning's offer on his phone now comes when its street is built, about 53 s after BEGIN at 4x (about 13 s on
the phone itself), while he is at the barber; before, it came at once under a 3 to 5 s freeze. The demo has had this since RUN's cut.

## TRIED AND PULLED: THE CROWD A FACING AT A TIME

Switching RUN's split bake on in the alpha too (CAST_SPLIT, the demo's alone, and since rule 174 the demo bakes nothing, so it runs
nowhere) took the time in long tasks to 11.4 to 15.2 s and the longest to 1.7 to 2.6 s with the wake cut. BUT THE MAP ANSWERS AFTER
BEGIN went 12/0 -> 9/3 with it, twice (M1 his first tap on the map never taken, M3, M11), and back to 12/0 with it out (main's
alpha, this map). Not shipped; the next cut on row 724 is to find what in the split holds his first tap (CROWD_HOLD and the breath
queue now run in the alpha) before it goes in.

## LEFT

The old 2-D crowd's whole-person bake (0.9 to 1.9 s a person at 4x, many) is now the most of what is left at the door. GO to the
first town (5.7 s sideways, EYES) was not walked this round.

Gate: THE ALPHA WAKES A BLOCK AT A TIME (gates/the_alpha_wakes_a_block_at_a_time_gate.js, solo, in the suite): S1 the map warmed its
morning a block at a time; P1 the old way turns it red; the freezes printed. 1/0 and its plant 1/0. THE MAP ANSWERS AFTER BEGIN 12/0.
