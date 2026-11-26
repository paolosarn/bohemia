# WORLD THIRTEEN, RULE 480: THE MAP NEVER WAITS ON THE GLASS (11/26/26)

VAMILY rule 480 (Paolo 11/26: 'a full sweep, improve what is already in the game before adding anything, frames never choppy');
the coordinator's round: 'the map's draw loop is yours this round... pan, pinch from closest to the whole valley, travel, fog of war,
the dead shrinking with zoom (476), all at full frames on a slowed phone (390x844, CPU slowed 4x); the zoom-out freeze you filed is
yours to fix at its source'. Rows 661 (mine, filed 11/21), 731 (EYES 11/26, the map half), 723. BUILD 11/26u - THE MAP NEVER WAITS
ON THE GLASS. VOTE world13-the-map-never-waits-on-the-glass-11-26 (stand_in).

## 1. WHAT WAS CHECKED (rule 480(b): what is already in the game, before anything new)

The map's draw loop at its stops (the whole valley, the opening zoom, near, the street), a drag, a pinch from the street to the whole
valley and back, travel with the fog of war on, standing still after a town and with a job taken; the demo upright and the alpha both
ways; the phone 390 x 844, the GPU canvas on (the drawing off the page's thread, as a phone draws), the CPU slowed four times.
NEW TOOL: tools/bohemia_world_thirteen_map_frames.js (stand, drag, pinch, far, travel; frames a second, hitches over 50 ms, the page's
own long tasks over 50 ms).

## 2. MEASURED, AND WHAT EACH ONE WAS

Every number: the demo on a phone upright (390 x 844, three device pixels a point), the GPU canvas on, the page's CPU slowed four
times by Chrome's own throttle, unless said. THIS BOX draws with a software GPU (SwiftShader) on CPUs it shares with the page, so its
frames a second compare builds; the page's own long tasks and read-back waits are what reach his phone.

1. THE WHOLE VALLEY SLIDING (the far stop, the crew walking under the camera, 5 s): 1.6 to 2.2 frames a second, frames up to 1.6 s;
   74 in 100 of the page thread in getImageData. Three reads of pictures the GPU held, each a wait for the whole GPU queue:
   (a) the outline drew each walker into a new canvas the GPU held and read it straight back (46 in 100 of getImageData);
   (b) CHARACTER's armour finds the head on the picture drawn: the lead's outlined sprite was a GPU canvas, so each of its frames was
       read off the thread and drawn into memory (createImageBitmap then getImageData): 1.3 s of the 5 s slide in the armour, 5 reads;
   (c) the ink line (where his head bar sits) was read again every ten seconds for a size it already knew (row 661).
   NOW: 12.1 to 12.9 frames a second, the worst frame 350 ms, the armour 0.16 to 0.36 s of a 4 to 5 s slide, no read off the GPU.
2. THE PAGE'S WATCHERS WOKEN 91 TIMES IN 3 S while the map slid (507 changes): the action button's two classes set again 22 times a
   second with nothing different (132 changes in 3 s); the button column's seven buttons taken out and put back (appendChild of a node
   already in place is not a no-op: 70 changes); the HUD halving re-stamping the same classes on 20 buttons every beat; the phone's
   clock rewritten with the same time. Each woke UI's pop-up watcher, which measures every pop-up on the page (checkVisibility, a forced
   layout). NOW 3 to 14 times in 3 s, only real changes (the feed's posts).
3. THE MARKET'S HUBS: the phone's feed asks for the shelf every beat; while the marker moves its key changes every beat, so the valley's
   hubs were listed again from nothing every beat (the towns' seats derived, the whole valley read): 7 in 100 of the page thread at every
   zoom, about 35 ms twice a second at 4x. NOW listed once per ten beats on the same valley.
4. THE TERRITORY'S BORDERS (the zoom-out freeze, row 661): right after a new valley the far stop froze single frames 7 to 16 s. A Chrome
   trace: the page waited on the GPU (CanvasRenderingContext2D::FinalizeFrame, GPU backpressure; RasterImplementation::Finish 12.4 s),
   and the GPU's batch held 128,893 single-line draws. Counted on the page: 108,000 strokes in 8 s from the borders' two lines, 19,134
   canvas calls in one frame: every border edge of every block on the glass was its own path and its own stroke (5,092 strokes a frame
   at the whole valley). NOW one stroke a holder: 92 strokes a frame in all for 14 holders' borders, and the GPU's batch holds no line
   draws. THE SIX-VALLEY PROBE (tools/bohemia_world_thirteen_far_freeze_probe.js, full speed): the page thread 97 in 100 idle through
   the new-valley frames (it was 26 idle, 74 in getImageData).
   WHAT IS LEFT, SAID PLAINLY: frames of 6 to 15 s right after a REROLL on this box, with the page idle; the trace puts them in the
   software GPU finishing one batch (CommandBuffer::Flush 9 to 14 s, 2 s of traced drawing inside it). Tried and taken back: the whole
   painting kept in memory instead of on the GPU (window.__VBC_MEM, off): freezes of 12.6 and 7.7 s on the first two valleys, then
   under a second, against 9.0 to 10.6 s on the GPU: not the cause. A phone's GPU does this work itself; PLUMBER 8's frame walk on a
   real-GPU runner is the judge.
5. STANDING STILL (EYES row 731, the map half): on this build the alpha's map standing reads 60 frames a second upright and 57.5 on its
   side, after a town, with a job taken ('Bring medicine down from the lodge'), the road's events on, the CPU slowed from the first
   second; the longest task 53 ms (the phone's job board, JOBS 2's); right after LEAVE 58 frames a second, LEAVE itself a 55 ms task.
   (EYES' own re-walk agrees: the map standing upright 59.4, was 3.4.)

THE FIVE LEGS (tools/bohemia_world_thirteen_map_frames.js, the demo upright at 4x):

THE STEADY MEASURE (tools: the far stop settled 12 s, then 4 s sliding at 4x; two runs on each build, the same box, one after the
other): main (11/26p) 2.2 and 1.8 frames a second (9 and 13 frames, the worst 1.15 s and 5.4 s); THIS BUILD 9.7 and 13.9 (61 and 56
frames, the worst 2.4 s and 0.9 s). The VOTE picture draws the second run of each as a tape: one box a frame.
THE ALPHA ON ITS SIDE (844 x 390, rule 441, the same slide): THIS BUILD 15.1 and 12.4 frames a second (the worst 0.6 s and 0.9 s);
main 2.7 on the first pass (the worst 1.1 s) and 14.4 on the second, once every sprite on the glass had been made and read: the old
cost was paid once a sprite, so it bites hardest when the view changes (a zoom, a new crowd, his walk's frames at a new size).

THE FIVE LEGS (tools/bohemia_world_thirteen_map_frames.js, the demo upright at 4x, one run each, said plainly: this box's software GPU
freezes single frames for 6 to 17 s at random after a new picture lands, on both builds, so these legs are noisy here):
| leg | main 11/26p | this build |
|---|---|---|
| stand (the opening zoom) | 13.3 fps, worst 967 ms, a 919 ms task | 15.0 fps, worst 417 ms, no task over 50 ms |
| drag | 13.2 fps, worst 617 ms, 2 tasks (162) | 13.1 fps, worst 817 ms, 1 task (247) |
| pinch, the street to the whole valley and back | 7.8 fps, worst 1.2 s | 8.2 fps, worst 2.7 s, 2 tasks (290) |
| far (the whole valley) | 0.1 fps: one 17.5 s frame | 12.4 fps, worst 1.1 s, no task |
| travel, the fog on | 1.6 fps, 3 tasks (232) | 2.1 fps: one 17.5 s frame (the GPU), 2 tasks (76) |
STILL NOT FULL FRAMES ON THIS BOX (rule 480(d): 55 frames a second, no frame over 50 ms): no leg reaches it here; the page's own code
is now a small part of each frame (render 10 ms at 4x on the far stop sliding), and the rest is this box drawing the pixels in software.

## 3. THE BUILD (slices/BOHEMIA_CITY_WORLD.html)

- `__A_SPRITE_IS_MADE_IN_MEMORY__`: the map's walker sprites (the rig's frame cut from its sheet, the doubling and halving, the outline,
  the finished sprite) keep their pixels in memory ('read often', one switch: MAP_SPRITE_MEM, the gate's plant). Everything that reads
  them (the outline, the ink line, CHARACTER's armour finding the head) now copies memory instead of waiting for the whole GPU queue.
  The finished sprite is uploaded to the glass once and drawn from there.
- `__THE_INK_LINE_IS_READ_ONCE__` (row 661 at its source): a size's ink line in one look is kept (where reads wait on the GPU: for good;
  a new look is a new key), never read again every ten seconds.
- `__THE_HUD_WRITES_ONLY_WHAT_CHANGED__`: the action button (22 rewrites a second with nothing different), the button column and the
  top column (taken out and put back 23 times a second: appendChild of a node in its place is not a no-op), the halving's classes, the
  phone's clock: written only when they differ. Every write woke the page's watchers, UI's pop-up watcher measuring every pop-up.
- `__THE_HUBS_ARE_LISTED_ONCE__`: the phone's feed asks for the market shelf every beat; while the marker moved, every beat listed the
  valley's hubs again from nothing (the towns' seats derived, the whole valley read). The list is kept ten beats on the same valley; the
  nearest is found on it with the payday engine's own arithmetic; every fresh answer is the payday engine's own nearestHub, read out
  of the overmap (MAP LAW, the market gate's check); a cleared key (the market gates' way) answers fresh at once.
- `__ONE_STROKE_A_COLOUR__`: the territory's borders, every holder's edges in one path, stroked once with its ink, alpha and width
  (MAP_TURF_ONE_STROKE, the gate's plant). The same edges; where two of one holder's edges meet, the corner is painted once.
- TRIED AND LEFT OFF: window.__VBC_MEM (the whole painting's canvases in memory): not the cause of the reroll freeze (section 2.4).

## 4. GATES

- NEW gates/the_map_never_waits_on_the_glass_gate.js 6/0 (about 3 min, in the suite): W1 the sprites in memory (planted, the old way:
  on the GPU, red); W2 the whole valley sliding at 4x: the armour 57 to 75 draws in 102 to 159 ms, no canvas read off the thread, no
  long task over 150 ms; W3 the watchers woken 3 times in 3 s, none with the same value; W6 the borders 92 strokes a frame for 14
  holders (planted, an edge a stroke: 5,092, red); W4 the hubs listed once for 20 moves, the payday engine's answer at 20 of 20 points,
  a cleared key fresh at once; W5 nothing threw.
- NEIGHBOURS on this tree: the bar fits his glass 22/0, every panel closes 14/0, nothing pops up 23/0, nothing pops voices clear 38/0,
  the city border 11/0, they mend on the march 14/0, a sheet is read once 4/0, the face shows under the helmet 10/0, the one that is you
  green, the city rail 15/0; THE MAP PAINTS ON EVERY CORE 7/0 run alone (it times; under two other browsers it ran past 15 min).
- RED ON MAIN THE SAME (run on main 11/26 beside this tree, the same failing legs, nothing of this build): the faction colour gate 29/9,
  the faction towns gate (its day card's GO never shows), the market gate (6 legs of prices and the purse; its 'read out of the overmap'
  leg green here), the HUD overlap 14/1 (phonebtn missing), the days once 55/4, the phone's look 8/9, the feed gate 7/8, the body scale
  11/4, the face on the map is his (A3 reads 4,200 characters, the line is 5,606 on), the armour he wears shows 14/4 (M1, M2), your main
  guy leads the walk 6/8, the driver reaches the city 5/3. The phone is the door: main 15/2, here 15/2 alone (a frame-time leg flips
  between L1 and L2 run to run; L6 red on both).

## 5. NOT MINE, HANDED ON (measured on the way, said plainly)

- UI (FIVE): the pop-up watcher measures every pop-up (checkVisibility, a forced layout) on every change to the page: 4 to 7 in 100 of
  the page thread while the map moves, and still the biggest share when the map stands (123 to 193 ms in 8 s at 4x). The map now writes
  only what changed; a watcher that skipped changes outside its pop-ups would save the rest.
- JOBS 2: the phone's job board (bohemia_phone_board.js asks, the board shelf's pick, the job danger's crewKey) runs a task of up to
  53 ms at 4x every few seconds on the map.
- ANIMATION: the idle sheets' warm-up unpacks a whole sheet in idle time (by design, PLUMBER 7's); at 4x one is a 100 to 300 ms task
  right after a zoom change brings new crowds.
- CHARACTER: the armour's sheet masks read a whole 490 x 12,288 sheet once a session (6 million pixels); at 4x a new sheet is a hitch.
- PLUMBER 8 (row 661's second half): the reroll freeze left on this box is the software GPU finishing one batch with the page idle; a
  frame walk on a runner with a real GPU says whether a phone feels any of it.

[bb] Battle Brothers' world map is one picture under a few dozen figures; ours paints the valley live, so every figure has to be
cheap to draw, and now none of them waits for the picture to finish.
[analog horror] the tape no longer catches on the frame: the valley slides under the crew like a dolly shot, no stutter where the
camera was waiting on itself.
