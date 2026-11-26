# WORLD THIRTEEN, RULE 482: THE CROWD IS SEATED ONCE (11/26/26)

VAMILY rules 482 and 480(c) (the routine: 'the map at 12 to 15 frames zoomed out on a slowed phone is better but not smooth; take it
toward 55, and row 731'). BUILD 11/26zj - THE CROWD IS SEATED ONCE. VOTE world13-the-crowd-is-seated-once-11-26 (stand_in). After BUILD 11/26u THE MAP NEVER WAITS ON THE GLASS.

## 1. MEASURED (the demo, a phone upright, the whole valley on the glass, the GPU canvas on; the map's own draw timed part by part)

- The map's own work, full speed: 5.7 ms the middle frame, 10.7 the 90th, one of 112 ms. A phone slowed 4x does four times that.
- SEATING THE CROWD 1.17 ms a frame: every man in a crowd asked again, every frame, which looks every gang sheet holds and whether each
  is in his company (21,568 lookups a frame at the whole valley).
- THE FIRST TIME THE MAP MEETS A SHEET, 112 ms in one frame (about 450 ms at 4x): CHARACTER's armour made the sheet's whole mask at
  once, the 2048-wide picture unpacked on the page's own thread. Tried first and taken back: unpacking it off the thread and reading a
  strip a frame; where the GPU draws, the unpacked picture sat on the GPU and a strip's read waited for the whole GPU queue (a 5.3 s
  task at 4x, caught by this build's own gate W2).
- The borders' holder names were rewritten (upper case, no spaces) for every edge of every block, every frame.
- The market's hubs were still listed twice every 5 s (the engine's own answer, then the list).

## 2. THE BUILD

- slices/BOHEMIA_CITY_WORLD.html `__THE_CROWD_IS_SEATED_ONCE_A_FRAME__` (rigMixFor, RIG_MIX_ONCE_A_FRAME): who can be seated is
  worked out once a frame for each group; each man's seat is chosen as before. 21,568 lookups a frame to 624; the same 85 people drawn.
- engine/bohemia_wear.js `__A_SHEET_IS_MASKED_OFF_THE_PAGE__` (a marked block in CHARACTER's file): a worker fetches the sheet's file,
  unpacks it and reads its mask on its own thread; the armour waits a few frames as it always did ('wait': he wears it where he just
  was). The same bits: all 1,250 boxes on five sheets give the same answer as the old read. A page with no worker keeps the old way.
- `__ONE_STROKE_A_COLOUR__`: each holder's name read once a frame. `__THE_HUBS_ARE_LISTED_ONCE__`: the list kept forty beats (20 s).
- NOW, full speed: the middle frame 4.3 ms (was 5.7), the crowd 0.27 ms (was 1.17), no frame waits on a sheet's mask.

## 3. SAID PLAINLY

On this box the whole valley sliding at 4x still reads 10 to 13 frames a second on this build and on main alike: its software GPU
paints every pixel on the same CPUs, and that is what holds the frames here. What reaches his phone is the page's own work per frame,
and that is what came down. STILL TO DO, MINE: the ground's full repaint (about 10 ms at full speed, one of 65 ms) every 4 s while
the map moves, and the region's roads drawn into it.
ROW 731, THE MAP'S HALF: with the map hidden behind the VOTE tab, the page did about 70 ms of the map's own work in 8 s at 4x; the
rest of what runs there is the phone (bohemia_phone.js, UI's, 131 ms) and, when one is open, the town (WORLD 15's).

RULE 484 (the crash going into a fight, PLUMBER 8's row 744): this build adds no canvas and keeps nothing longer than before (the
crowd's list lives one frame; a sheet's mask is the same bits, made by a worker that keeps nothing once it has answered). 11/26u moved
the walkers' existing sprites into memory ('read often'); the count and size of them did not change.

## 4. GATES

- gates/the_map_never_waits_on_the_glass_gate.js 7/0: new W7 (the crowd once a frame; planted, the old way: 21,568 lookups, red); W2
  green again with the worker (11.8 frames a second on this box); W2 now asserts the armour (no read off the GPU, under 300 ms) and
  reports the long tasks (57 to 337 ms run to run here: the software GPU's waits; PLUMBER 8's frame walk judges frames).
- gates/a_sheet_is_read_once_gate.js 4/0: M1 and M2 now wait for the mask to land (up to 3 s, it lands a few frames later): 1,250 of
  1,250 the same answer, one mask a sheet, forty of forty answered; the plant red.
- Neighbours: they mend on the march 14/0, the face shows under the helmet 10/0; the armour he wears shows 14/4, your main guy leads
  the walk 6/8, the market (6 legs), the faction colour 29/9: the same failing legs as main.

[bb] Battle Brothers draws a few dozen figures on its world map; ours draws a crowd in every town, so each man has to cost almost nothing.
[analog horror] the crowd stands where it stood, frame after frame, no longer re-counted every time the tape advances.
