# THE MAP RUNS ON A CHEAP PHONE (PLUMBER 7, chat 18, 11/7/26; rule 418(c), rules 400 and 407, ask line 478)

Paolo 11/6: 'my idea of this game was that it was always not taxing on any system... any kid on a little laptop.'
MOTION, 11/7b: the zoom down into a fight at about 5 frames a second on the phone-shaped CPU (4x), the map's own draw 199 ms a
frame. PLUMBER 4 had routed the map's far and opening stops while travelling as over budget (WORLD's depth test).

## THE ANSWER IN SIX LINES (for him, eighth grade)
- On a phone-speed CPU the map's far view while travelling ran 1.8 frames a second; now 8. The opening view 6.4 -> 24. On a
  computer every view now runs 57 to 60 while travelling (it was 20 to 55); a phone at full speed 49 to 56 (it was 11 to 44).
- The zoom down into a fight: on the old one, its come-down 5 -> 7 to 12 frames a second on the phone-speed CPU and the wait at the
  bottom 6 -> 34 to 56 (44 and 60 on a computer). MOTION 2 rebuilt it the same hour to play on the screen's own layer; that new one
  runs 6 to 7 on the phone-speed CPU and is MOTION's and COMBAT's to push.
- The cause: every man on the map with anything in front of him was copied out and read back pixel by pixel, 70 of them every
  frame, and on a phone's GPU each read makes the phone wait. Now a mask cuts them and nothing is read back.
- The map also drew itself up to four times a frame, and only one is ever seen. Now once.
- Still slow: the close-up street view while travelling (2.6), where the ground is painted again every block, and a 2.4 s freeze
  once a game day when the phone's job board re-plans every job. Both are routed with their numbers.
- Nothing he sees changed: the ground is the same pixels exactly; the men differ on under 200 of 2.7 million pixels, by at most 6
  shades of 255, at the soft edge of their shadows.

## WHAT THIS BOX IS (said out loud)
Chromium here reports `2d_canvas: unavailable_software`: every canvas is painted in software ON THE PAGE'S OWN THREAD, so the 4x
CPU throttle slows every pixel the map paints four times. No phone does that, and no laptop with integrated graphics: theirs is
painted by the GPU, off the page's thread. So two shapes were measured:
- THE SOFTWARE CANVAS (the box as it is; every checker runs this way): the worst case, a laptop whose GPU Chrome will not use.
- THE GPU CANVAS (`gpu: true`, new in tools/bohemia_drive_the_demo.js: `--enable-accelerated-2d-canvas --use-angle=swiftshader
  --ignore-gpu-blocklist --enable-unsafe-swiftshader --enable-gpu-rasterization`): the canvas drawn by a GPU process, the shape of a
  phone and of integrated graphics. ITS GPU IS SWIFTSHADER, a GPU emulated on this box's CPU: frames there are bounded by the
  emulator's speed and every read-back waits for its whole queue (hundreds of ms), so its frame rates are NOT a phone's. What it
  shows truly is what the page's own thread waits on: every read-back, every flush, every software decode.

## WHERE THE 199 MS WENT (CPU profiles, the demo at 390 x 844 at 3, travelling at 2x, 4x CPU)
BEFORE, travelling at the far stop: 2 frames a second, 8.3 whole-map draws a second, so FOUR DRAWS A FRAME, one seen.
- 32% of the map's draw time was drawn INSIDE THE BEAT'S OWN TIMERS: every block he took, the movers' tween drew the whole map on its
  first call and the beat's last line drew it again, outside any frame (the glide redraws on the next frame anyway); another 32%
  was the moved draw of a frame that had already drawn (the order of a frame's callbacks decided).
- Inside one draw (11.6 s of the profile): THE DEPTH TEST, __YOU_WALK_BEHIND_IT__ (mapDepthBlit), 7.6 s, 66%. Each of 70 men with
  anything in front of him went through ONE shared scratch canvas: drawn, getImageData (3.35 s), a pixel loop (0.7 s), the
  per-point tests (1.0 s), putImageData, copied onto the glass. Writing the next man into the scratch the glass still held made the
  glass finish its whole picture so far: that is the 2.1 s the shadow's fill carried. Per draw at full speed: 30 ms, 15 of it this.
- THE GROUND'S SLIDE: the picture slid under him by a part of a pixel was resampled whole every frame: 7.6 ms a frame at full speed
  at the far stop (0.07 ms when the slide happened to be whole).
- THE STREET STOP: the close tiles painted again into a ground picture 3.3 times the glass every time the slide ran out (about once
  a block): 6.7 s of 10 s; and the phone board's deal (below, FOUND) 2.4 s in one piece.
- THE ZOOM DOWN: every frame of the come-down painted the whole ground again at its new size; the old V205 pull-back (two beats
  before the zoom) drew the map every frame standing still, so painted the whole ground every frame, and its photograph was painted
  over the zoom's first frames (two whole-glass copies a frame); the settle drew a whole ground paint every frame for a beat and a half.
WITH THE GPU DRAWING THE CANVAS (the phone's shape), worse and for a different reason: the far stop travelling at 0.3 frames a
second, 58.9 of 60.7 s in getImageData and the flush. A scratch the page reads is a CPU picture, and a CPU picture drawing a
2048-wide gang sheet decodes the whole sheet in software (40 ms the first time, measured; more sheets than the decode cache keeps):
15.6 ms a man. Behind it: his own two read-backs (300 ms a frame there), the armour's anchor read (2.7 s of 8), the bar's sun
dial made and PNG-encoded every half second (1.7 s), mapInkTop's read every frame (1.7 s), his outline remade.

## THE FIXES (each at its root; marked blocks in the files)
1. __THE_MAN_BEHIND_IS_CUT_ON_THE_GPU__ (slices/BOHEMIA_CITY_WORLD.html, mapDepthBlit): a scratch of his own for each man for the
   frame (a pool of 96, let go under the fight); the covered cells (one CSS pixel each, tested at the same points as ever) are a
   small mask that cuts him ('destination-out'); nothing is read back. A row the painting cannot reach (above its tallest lift past
   his depth, an exact bound; never with a house up close) is not asked. HE, and a man the cells say may be mostly covered (his
   outline at stake: on his frame's own box, 0.25; measured over 7,360 men at four stops, no true outline under 0.31), are cut the
   exact way, read back, where a read is cheap. WHERE A READ IS SLOW (two reads over 8 ms: MAP_DEPTH.readSlow, a GPU-drawn phone),
   nothing is read back or copied: a man is drawn straight onto the glass under a clip of his box less his covered cells (whole
   device pixels), and an outline decided on his box (0.4) is made with blends (mapDepthGhost). MAP_DEPTH.exact = true reads
   everybody back (a checker's switch).
2. __ONE_DRAW_A_FRAME_EVEN_FROM_THE_BEAT__ (the same file, ONE_RENDER): a draw asked for inside the beat's timers (the beat, the
   march's spread blocks) moves to the next frame; a moved draw that finds its frame already drawn is dropped.
3. __THE_GROUND_SLIDES_BY_WHOLE_PIXELS__ (mapGroundBlit): unsmoothed, a part-pixel slide is a whole-pixel one (each pixel takes
   the picture's pixel under its middle: ceil(t - 1/2)), so it is laid on whole device pixels and copied straight.
4. __THE_ZOOM_SLIDES_THE_LAST_PICTURE__ (mapGroundBegin): while the zoom MOVES, the ground painted under 400 ms ago at a size near
   this one (x2.2 in, /1.45 out) is laid on the glass at the new size about the same ground point, two frames in a row at most,
   only while it covers the glass; everything that moves is drawn fresh on it. The moment the zoom stops the ground is painted
   exact. MAP_GROUND.zoomSlide = false paints every frame.
5. (Dropped at the rebase: the zoom down's settle drew a whole ground paint a frame; MOTION 2's 11/7h dive has no such loop.)
6. The old V205 pull-back (fightZoomOut): its two beats slide the ground (mapGroundMoving), and its photograph is not painted
   once the zoom down has the camera.
7. Where reads are slow, no read on the thread: the armour's anchor (engine/bohemia_wear.js anchor(): createImageBitmap of the
   frame's rectangle, the same pixels, landing a moment later; he wears it where he just was until then, as over the read budget
   always), mapInkTop (and a picture of the same size read under a second ago carries its line). The bar's sun dial
   (slices/bohemia_ui_materials.js tbDial): the dots worked out first, the same dots the same PNG, kept; its picture off the GPU.
   spriteAt: his outline kept by his rig frame (64), not on the small cache's turning canvases.
8. tools/bohemia_drive_the_demo.js gpu: true (above). tools/bohemia_first_load.js: biggestBeforeReady, the twenty biggest files
   NEW GAME waits behind.

## THE SAME PIXELS
Each stop, the clock held, the glass drawn the old way (every man read back, the slide resampled, every row asked: MAP_DEPTH.exact,
MAP_GROUND.exactSlide, MAP_DEPTH.rowCut off) and the new way, compared pixel for pixel, also after a part-pixel slide (0.37, -0.29):
far 137 and 144 differing pixels of 2,741,310 (117 and 118 of them by 2 or less, at most 6), the opening 189 and 63 (at most 5),
nearer 49 and 23 (at most 4 and 2), the street 0 and 0. The slid frames differ exactly as the unslid ones: THE SLIDE IS THE SAME
PIXELS. The men's few: a pixel of a soft shadow edge the old way rounded through getImageData and putImageData (un- and re-
premultiplied), and a covered pixel fainter than 8 in 255 (kept the old way, gone now). THE MAP STANDS TALLER's own reading of him
behind a house: 25,341 of his pixels the building, 3,969 him, 5,056 neither; on main's map 25,340, 3,969, 5,057.
Where the GPU draws (readSlow): a man is drawn as an uncovered man is, under a clip; his outline is decided on his box, not his
pixels, and made with blends (a semi-clear pixel of it lighter than the exact way); his share (MAP_DEPTH.you) is the box's.

## THE NUMBERS, BEFORE AND AFTER
THIS BOX'S SOFTWARE CANVAS, the demo at 390 x 844 at 3 (fog lifted, the bench valley), travelling at 2x; frames a second:
| | before | after |
|---|---|---|
| phone 4x, far stop, travelling | 1.8 | 8.1 (7.0 another run) |
| phone 4x, opening stop, travelling | 6.4 | 24.4 (25.4) |
| phone 4x, street stop, travelling | 2.1 | 2.6 (2.0) |
| phone 4x, far stop, still | 30.9 | 45 |
| phone 4x, opening and street, still | 60 | 59 to 60 |
| phone 4x, the zoom down's come-down (far stop to the board, 1.07 s) | 5.4 | 6.9 to 12 |
| phone 4x, the zoom down's settle | 5.7 | 34 to 56 |
| phone 1x, far / opening / street travelling | 11.1 / 20.7 / 43.9 | 50.7 / 55.6 / 48.6 |
| computer 1x (1440 x 900), far / opening / street travelling | 20.3 / 23.4 / 54.8 | 58.0 / 57.4 / 59.0 |
| computer 1x, the zoom down: come-down / settle / turn | (not read) | 44.4 / 60 / 37.5 |
Whole-map draws a frame travelling at 4x: about 4 -> 1.0. The map's own draw at the far stop travelling, full speed: 30 -> 17 ms.
THE GPU CANVAS (SwiftShader as the GPU), phone 4x: far travelling 0.3 -> 1.0, opening 1.5 -> 2.6 to 3.8, street 1.5 -> 2.4 to 2.6;
men read back a frame 70 -> 0 (5,394 drawn under a clip, 3 exact reads, both read switches on by their own clocks). Its frames are
now bounded by the emulated GPU (frames of 1 to 11 s with NO long task on the page's thread): not a phone's number.
THE BUDGETS (rule 418(c)): 30 a second on the throttled phone at every stop and through the zoom down: NOT MET on this box's
software canvas at the far and street stops travelling and in the come-down; met at the opening stop by day (24 to 25 is close),
still at every stop, and the settle. 60 on the computer: met at every stop travelling (57 to 60) and the settle.

## GATES (one at a time)
Run one at a time on this box, on the tree rebased onto main 806bc69d (MOTION 2's 11/7h compositor dive, UI 9's 11/7i) where marked.
- SMOOTH IS A BUDGET (extended: P1-P4, Z1; the map's OVER BUDGET lines deleted) on the rebased tree: 25/1. P1 far 4.9, opening 8.4,
  street 4.4 a second at 4x (its journeys run at night after a fight, so its own floors: 3, 5.5, 1.8); P2 4.7 draws / 4.9 frames,
  8.4 / 8.4, 4.2 / 4.4; P3 2,776 men cut, 0 read back (the 4x reads crossed 8 ms, so the no-read way ran); P4 111 whole-pixel
  slides; Z1 the new dive's come-down 4.2 a second (floor 1.8), no settle in it, the hold 10. The one red, F1 THE FIGHT'S START
  683 ms worst against its 650 ratchet, is MAIN'S: the same gate on main's files read 700 ms (MOTION 2's new way in; routed).
  The run before the rebase: 23/3, the reds the first floors (set from a by-day fresh game) before they were set to its own reading.
- THE ZOOM DOWN INTO THE BOARD on the rebased tree: 28/0 (one run before it 27/1: E1 caught a drawImage TypeError in the 4x traced
  part, once; not in the rerun, not on main; its E1 now says where an error threw). Before the rebase, on MOTION's 11/7b dive: 22/0
  (the phone's come-down median 19.8 ms, worst 76).
- THE MAP STANDS TALLER 23/3, THE SAME THREE REDS ON MAIN'S MAP (W1 'neither' 5,056 here, 5,057 there; W3b one frame of 62 on the berm).
- THE HOUSES STAND UP CLOSE 28/0. THE TOWN SHOWS 10/0. AUTO AT 4X NEVER CRASHES 7/0. THE MAP GLIDES 14/0. THE PAD IS TRAVEL SPEED
  14/0. THE ARMOUR HE WEARS SHOWS 18/0. DEMO BUILD 25/0 (the demo re-cut, BUILD 11/7j). FIRST PLAY IS LIGHT 7/0 (the phone 14.78 MB
  in 394 files before first play).
- EVERYONE IN THE FIGHT HOLDS 54/1, THE PARTIES WALK 6/4, HIS MAP 40/2: THE SAME ON MAIN'S FILES (E2 'drawn on him 2' both; the
  parties' four identical, the alpha's walk sheets not in under its stubbed clock; his map's F2 both, one fog leg flipping F3/F4).
AFTER THE REBASE: MOTION 2's 11/7h way into a fight plays its come-down on the compositor from a few photographs of the map, so the
map no longer draws a frame of it; __THE_ZOOM_SLIDES_THE_LAST_PICTURE__ was confined to the map's own animation frames the same
round (a photograph is always the exact paint), and this round's settle change in slices/bohemia_motion.js was dropped (MOTION 2's
dive has no settle loop). The new dive at 4x on this box: come-down 6.1 to 6.9 a second (the map painted 5 times), the hold 9.6 to
9.9, the turn 7.5: the compositor's and the fight's, routed.

## FOUND, NOT FIXED (routed)
1. FOR WORLD AND RUN TWO: THE PHONE BOARD'S DEAL. Once a game day (and when the crew or the held jobs change) the phone's board
   (slices/bohemia_phone_board.js paint -> asks -> slices/bohemia_board_shelf.js pick -> dealt -> pickOwn -> take) asks
   slices/bohemia_job_danger.js fits() of every offer of every place, and each read() plans the job's fights again
   (fightsFor: BohemiaJobKinds.plan + fightsOf, with their routes): 2.4 s in one piece on the phone-shaped CPU (0.6 s at full speed),
   the map frozen, about every 72 s of travelling at 2x. Spread the deal over frames, or keep each offer's plan across days.
2. FOR PLUMBER NEXT: THE STREET STOP TRAVELLING (2.0 to 2.6 at 4x). The ground's picture there is 3.3 times the glass (a margin of
   220 CSS px) and is painted whole again each time the slide runs out, about every block: about 185 ms a paint at 4x. Paint only
   the strip the slide uncovers (the old picture moved by whole pixels, the new strip painted under a clip).
3. FOR COMBAT AND MOTION: the zoom down's hold and turn are the fight's own work (its page built under the held frame, its draw
   under the turned pictures): 5 to 10 frames a second at 4x.
4. SMOOTH IS A BUDGET's 4x journeys run at night after a fight (the street-at-night leg sets the clock first): far 4, opening 7.6 a
   second there against 8 and 24 by day in a fresh game. The night's lights on every paint are the difference to look at next.
5. THE FIRST DOWNLOAD (rule 418(a)): FIRST LOAD's 10 MB ceiling, 1.1 MB over on PLUMBER 6's reading: not reached this round.
   tools/bohemia_first_load.js now lists the twenty biggest files NEW GAME waits behind (biggestBeforeReady) for whoever takes it;
   PLUMBER 6's note stands: what is left is the first screen's own (the map's page, its tiles, the cast sheet), a code split.
6. WHERE A GPU DRAWS: his outlined walking body is made from a new march frame the first time each is seen (two reads); kept now
   (spriteAt by frame, 64), so it is a warm-up, not a frame cost.

## [bb] and [analog horror]
[bb] Battle Brothers' world map runs on any 2015 laptop because it draws a few hundred sprites on a GPU and never reads one back;
ours read 70 men back off the glass every frame. Now none.
[analog horror] nothing a player sees changed: the same men behind the same towers, the same ground, the zoom down the same camera
(its in-between frames are the last picture grown, like a phone map under a pinch).
