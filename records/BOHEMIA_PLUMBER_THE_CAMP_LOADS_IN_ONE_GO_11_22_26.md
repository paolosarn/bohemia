# THE CAMP LOADS IN ONE GO (PLUMBER 8, 11/22/26; VAMILY rule 472(e), rule 441)

PAOLO 11/22: 'we made camp, it loads, it takes 30 seconds, I don't know why it freezes when it loads, I don't get to see any sort of
transition, it's just like the combat map, it freezes for like 10 seconds and then everything's populated in.'

Rule 472 gives (a) to (d), the camp waiting for him and the camp built in front of him, to a fresh CAMP lane (CAMP FOUR), and (e), the
load, to PLUMBER. This is (e): what the 30 seconds and the 10-second freeze were, and what was cut. Nothing of the camp's look, its
set-up or its build transition was changed.

## HOW IT WAS MEASURED

tools: a probe that drives the demo the way he does (a new game, the phone's LEAVE out of the town he starts in, a step off the town's
ground, then the phone's HEAL pressed by a finger), the phone upright 390 x 844, the CPU slowed 4x, the GPU canvas a phone has; a cold
camp (the first since the page opened) and a warm one (broken, then made again). For each: when the camp's screen is up, when its board
is baked, when its picture is ready, the frames, every task over 50 ms (the browser's own long-task count), and a CPU profile cut into
half-second windows. The gate THE CAMP LOADS IN ONE GO (gates/the_camp_loads_in_one_go_gate.js) is the same walk.

## WHERE THE TIME WENT (before, the demo upright, CPU 4x)

| | cold | warm |
|---|---:|---:|
| the camp's screen up | 1.7 s | 1.7 s |
| its board baked (in) | 18.5 s | 17.3 s |
| tasks over 50 ms, all of them | 10.0 s | 10.9 s |
| the longest task | 2,378 ms | 2,445 ms |

The page was busy from the tap to 23 s, all of it on the one thread every frame of the game shares:

1. **The camp's two pictures written as WebP files, in one task: 2.3 s.** The camp's board (the fight's own board, baked by a hidden
   copy of the fight page) was laid under the camp by day and by night onto two canvases, each then written as a WebP data URL
   (toDataURL) so the town screen's picture loader could read it back as a file. The longest freeze of the load.
2. **The camp's hours ran from the tap**, while the board was still baking: nightfall came during the load, with its reckoning (2.2 s in
   one go) and every job's danger planned again for the new day (1.8 s cold, 4.8 s warm, in 200 to 460 ms pieces). MOTION 3's set-up
   hold (__THE_CAMP_IS_SET_UP_WHILE_HE_WATCHES__) held the clock only for a camp made off a fight.
3. **Every man's sheet read back off the GPU for his dusk** (the town screen's duskOf and the camp look's dusk): 770 ms in one second.
4. **The board dealt twice**, once a light, 300 to 450 ms a deal.
5. **The fight page's data asked one file after another**: 22 files together, then 13 more each only after the one before it, then the
   insides' files, every one asked with no-cache (a round trip to the site each). On this box the server answers at once; on a phone
   each round trip is tens to hundreds of ms, and a fight's start pays the same.
6. **The camp's compass read every crew's danger twice a second** (50 to 170 ms of every second) on a screen that shows no compass until
   its picture is in.
7. Always there, not the camp's: UI FOUR's pop-up watcher (10 to 25% of the load's time; row 700) and the phone's own tick.

## WHAT WAS CUT (each with its switch, the gate's plant sets them all)

| mark | file | switch (the way it was) |
|---|---|---|
| __THE_CAMP_PICTURE_IS_HANDED_NOT_WRITTEN__: the drawn canvases handed to the screen, which draws them as it draws a picture | slices/bohemia_camp_board.js, slices/BOHEMIA_SETTLEMENT_SCREEN.html, slices/bohemia_camp_look.js | __CAMP_PLATE_ENCODE |
| __THE_CLOCK_WAITS_FOR_THE_CAMP_TO_LOAD__: a camp made on the map takes no hour until its picture is in (at most 30 s) | slices/BOHEMIA_CITY_WORLD.html (campHour) | __CAMP_CLOCK_DURING_LOAD |
| the compass waits for the camp's screen (the last compass stands while it loads) | slices/bohemia_camp_map.js | __CAMP_CLOCK_DURING_LOAD |
| __THE_DUSK_IS_WORKED_OUT_ON_THE_CPU__: the same sums on a canvas kept on the CPU, copied once to draw from; the same pixels | slices/BOHEMIA_SETTLEMENT_SCREEN.html, slices/bohemia_camp_look.js | __DUSK_ON_THE_GPU |
| __THE_OTHER_LIGHT_IS_THE_SAME_BOARD__: the second light handed the first light's board (FIGHT.boardNow), no second deal | slices/BOHEMIA_FIGHT.html (campBoardBake) | __CAMP_DEAL_TWICE |
| __THE_DATA_COMES_IN_ONE_ROUND_TRIP__: every file loadAll names asked at once, its chain handed the answers | slices/BOHEMIA_FIGHT.html (loadAll) | __FIGHT_LOAD_SERIAL |

## AFTER

(the A/B below: the same build, the old ways switched on by their switches, alternating runs)

The demo upright, CPU 4x, the GPU canvas, a 100 ms round trip and 12.8 Mbit/s (a phone on mobile data), the same build both ways: the
old ways switched on by their switches, two alternating runs each (each run a cold camp and a warm one).

| | the old ways | now |
|---|---:|---:|
| cold: the camp's picture in | 24.3 s, 16.6 s | 7.3 s, 9.6 s |
| cold: tasks over 50 ms, all of them | 13.0 s, 7.7 s | 3.3 s, 3.3 s |
| cold: the longest task | 2,016 ms, 2,109 ms | 1,085 ms, 1,060 ms |
| warm: the camp's picture in | 21.6 s, 13.1 s | 6.3 s, 6.8 s |
| warm: tasks over 50 ms, all of them | 15.0 s, 9.9 s | 2.6 s, 2.4 s |
| warm: the longest task | 2,816 ms, 2,416 ms | 671 ms, 805 ms |
| the camp's hours gone before he saw it | 35, 25, 22, 18 | 0 |
| the same board by day and by night | yes | yes |

With no network delay (the box's own server), now: cold 7.1 s, 3.4 s of tasks, the longest 650 ms; warm 6.4 s, 3.3 s, 667 ms.
The 30 seconds he felt is the old ways on a phone's network; the 10-second freeze is their 8 to 15 s of tasks. The hours gone are
why the camp 'instantly' sent him back: the crew healed while it loaded.


## WHAT IS LEFT, NAMED

- The fight page itself (1.15 MB) loading in the hidden frame: about 3 s of the cold camp at 4x; on a phone's network its first
  load is one task of about a second (the page's script read and run), the longest task left.
- The ground's bake of the board (2.2 s at 4x in pieces, the longest about 650 ms): the fight's own bake (COMBAT's, CAMP THREE's
  __THE_BAKE_DOES_NOT_FREEZE__ already splits it into steps).
- UI FOUR's pop-up watcher (row 700) and the phone's tick, through the whole load.
