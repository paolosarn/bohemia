# THE BROTHER'S THREE GLITCHES, AND SMOOTH IS A BUDGET (PLUMBER 4, 11/5/26 into 11/6)

Rule 400(a)(e), rule 384(f), rule 405(b), rule 408(d). Ask lines 436, 440, 448, 454, 455.
His brother's play report, 11/4 (Paolo: "that's what has to happen"): "the transitions between screens, zooming in and out, seem
to glitch out a little, and when you start a battle it glitches out a little too; some of the fight scenes seem to glitch out in
the middle of it."

## HOW IT WAS MEASURED

The demo he plays, through the one driver (tools/bohemia_drive_the_demo.js), the phone held up (390 x 844, three device pixels a
point), the title gone through with NEW GAME (tools/bohemia_through_the_title.js), the real pinch (two CDP touches), a fight started
by the map's own hand-over (cityHandOver) and played on AUTO. Every frame was timed by the top page's own frame callback (all the
game's screens are same-origin frames of that page, one main thread), long tasks by the browser's own observer, the work by a CPU
profile and, where a profile could not name it, a trace of the renderer's main thread. Scripts in the session's scratchpad
(probe.js, probe2.js, fstart.js, ftrace.js, tan.js).

WHAT THIS BOX IS, SAID OUT LOUD: Chromium here draws the canvas with a software GPU (ANGLE on SwiftShader). A draw costs this box
what a phone's GPU does off the main thread, so the box's frame times are worse than his phone's for drawing and the same for
script. The structural causes below (work done twice, work done for nothing, a decode on the wrong thread) travel to every phone;
the box's frame rates are ratchets on the box. A CPU slowed four times on this box runs 2 or 3 frames a second on the map, far under
any phone, so the 4x numbers are reported, never used to pass or fail a frame budget.

## GLITCH (a): THE ZOOM IN AND OUT

Reproduced: four pinches in to the street and five back out past the far stop. Before: 39.5 frames a second pinching in, 86 frames
over 33 ms; 39.1 pinching out, 67 over 33 ms; long tasks up to 170 ms. One whole-map draw during the pinch: median 56 ms, worst 117.

THREE CAUSES, three fixes (all in slices/BOHEMIA_CITY_WORLD.html, small marked blocks, none in the travel glide, the meet card or the
events):

1. **THE GROUND WAS PAINTED 3.3 TIMES THE GLASS, EVERY FRAME.** The map paints its ground into a picture with a margin (up to 220
   CSS px a side) so it can slide that picture under him while he travels. While the map stands still, or while the zoom changes
   (the zoom is in the picture's key, so every frame of a pinch paints a new one), the picture is never slid, but it was still
   painted at 2,490 x 3,663 device px (9.1 million) and then copied whole onto a glass of 1,170 x 2,343 (2.7 million).
   FIX `__A_PICTURE_NOBODY_SLIDES_HAS_NO_MARGIN__`: such a picture is the glass's own size. The pixels on the glass are the same pixels.
   Measured: a draw during the pinch in, median 56 -> 30 ms, worst 117 -> 52; all the drawing of four pinches in 5,205 -> 2,587 ms.
2. **EVERY TILE THAT LANDED DREW THE WHOLE MAP AT ONCE.** The painter's sharp tiles come back from the worker one at a time; each
   landing called the map's full draw on the spot, outside the frame. One pinch out landed 52 tiles: 52 extra full draws, 45 ms each
   here, beside the frame's own draw.
   FIX `__ONE_DRAW_FOR_WHAT_LANDS__`: a landing marks the map stale and asks for one draw on the next frame (vbDrawSoon); the map's own
   one-draw-a-frame rule (`__ONE_RENDER_A_FRAME__`) folds it into the pinch's draw when both ask in one frame.
   Measured: frames with two whole-map draws in a pinch out and back: 1 of 1,167.
3. **THE SKY'S EARTH WAS 45,000 RECTANGLES A FRAME.** Past the far stop the zoom goes up into the sky (and the fight's dive passes the
   same picture): the earth is a pixel disc laid one fillRect a cell, its colour set for each, every frame it shows: 118 ms of a 184 ms
   frame in the trace of a fight's start.
   FIX `__ONE_PICTURE_FOR_A_PIXEL_DISC__`: the same cells in the same colours written into one small picture, one pixel a cell, drawn
   once, scaled up cell for cell with no smoothing. PIXEL-IDENTICAL, checked every run (0 of 11 million channels differ, day, night
   and the moon); 34.8 -> 10.2 ms and 50.3 -> 14.2 ms a disc.

After (the gate's own run, numbers below in THE GATE): the pinch in 51.6 frames a second with 16 frames over 33 ms where it was 86.

## GLITCH (b): THE START OF A FIGHT

Reproduced three fights in a row, A/B with the old files served by the driver against the new: the worst frame of a fight's start
317 to 700 ms, the long tasks 836 to 1,208 ms in all. A trace named the pieces:

1. **THE DOOR COPIED THE PHONE TWICE.** At the fight's door the motion layer (slices/bohemia_motion.js, its nfOpen wrapper) copies the
   map's bar and the phone onto the top glass for their exit, every element with all 548 of its computed styles written inline. It
   copied the phone (111 elements) twice in the same instant: 104 ms a copy here, while the clouds were starting.
   FIX `__A_COPY_COSTS_WHAT_SHOWS__`: the second copy is a clone of the first (its inline styles ride along, its canvases' pixels drawn
   across), and a branch that is display none is copied as display none without reading its styles or its children.
   Measured: the door's own time 219/68/60 -> 120/23/30 ms; computed-style reads through the door 270 -> 27.
2. **A PICTURE DECODED ON THE MAIN THREAD.** The board's pictures arrive, the bake draws them in the same task, and the browser decodes
   them there: 238 ms in one piece (trace: EventDispatch load -> ImageDecoder::DecodeFrameBufferAtIndex). Rule 400(a): no big picture
   decoded mid-play.
   FIX `__NO_PICTURE_DECODED_MID_PLAY__` (slices/BOHEMIA_FIGHT.html, the shared load() helper only, nothing of COMBAT 8's AI or weapon
   drawing): img.decode() off the main thread before the fight is handed the picture. Measured: the longest main-thread decode in a
   fight's start 238 -> 71 ms.
3. THE SKY'S DISC, as (a) 3: the dive's map frame carried it.

After, three fights: long tasks 909/567/404 ms in all (before the decode fix); the gate's run below.

## GLITCH (c): THE MIDDLE OF A FIGHT

Reproduced: a fight on AUTO for 40 s with a timer of my own around the phone board's paint. Five seconds into the fight the board,
in the map's hidden frame, read every job's danger again (the fight's hand-over had changed the crew it is keyed on): 276 ms in one
piece here, about 1.1 s on a CPU slowed four times, the fight frozen.
FIX `__NOTHING_WORKS_UNDER_THE_FIGHT__` (slices/bohemia_phone_board.js): while the map's frame is off the glass the board waits; the
next tick after the map is back paints it (a second at most); a caller who asks for it by hand still gets it.
Measured: board reads during 20 s of a fight on AUTO: 0.

The fight's own drawing is NOT the stutter: one frame's draw is about 12 ms here, of which about 11 is this box's software GPU
finishing the frame inside the first `cx.save()` of drawLadders (the first save after the board is drawn), and about 1 ms is the
fight's script. On a phone that part is the GPU's.

## RULE 384(f): 60 AT EVERY ZOOM, THE CLOCK ON REAL TIME

The pacing half was the coordinator's (BUILD 11/5a). The plumbing half:
- The map's frames at the far stop, the middle and the street stop (a crew walking, the houses up close, night lit at the street) are
  legs of the gate below; what is over budget is listed under OVER BUDGET.
- THE CLOCK: the day is paid a block at a time, a block is taken on the beat's timer (setInterval), and a frame that held the thread
  past a whole beat swallowed that beat. Measured on a CPU slowed four times: 5.9 game minutes a real second at the far stop where
  the same journey runs 21.4 at full speed. FIX `__THE_DAY_KEEPS_REAL_TIME__` (the metronome, three lines in their own marked block):
  a swallowed beat is OWED (BEAT_DEBT) and paid as one more real block (its own stepOnce, its own clock) on each of the next beats, on
  the beat's own slots like any fast block, never a dash; the debt is capped at four beats so a box that can never keep up never piles
  up a sprint. At full speed the pace agrees at every zoom: 21.44 / 21.34 / 22.3 game minutes a second, a 4.3% spread.

## THE METER AND THE GATE

slices/bohemia_frame_meter.js, loaded by the alpha (so the demo): ONE meter for every screen, off and invisible by default, nothing
running until it is switched on (Shift+F on a keyboard, BohemiaFrameMeter.show(), or localStorage bohemia.frame.meter = on). A box
bottom left says frames a second, the worst frame, how many were late, the longest task. A checker records with start(), reads a
stretch with read(from, to). Its first cut counted every frame twice after an on-off (two loops); it now carries a generation.

gates/smooth_is_a_budget_gate.js (SMOOTH IS A BUDGET, in the suite, solo): M1 the meter; A1 A2 A3 the zoom's three causes; B1 B2 the
fight's start; C1 the middle of a fight; F1 ratchets at this build's truth on the pinch, the fight's start and the fight on AUTO; F2
the median frame inside 16.7 ms on the town, the map at three stops (and at night) and the fight; K1 the day's pace the same at every
zoom; K2 the beats a slow frame held up owed and paid. RESULTS: THE GATE, below.

## THE GATE (SMOOTH IS A BUDGET, the demo at 390 x 844, 1x on this box unless it says 4x)

ON THE MERGED TREE (rebased on main after WORLD 9, WORLD TEN, COMBAT 8 and RUN FIVE landed): 19 passed, 0 failed, the march 4.04 / 3.97 / 3.99 blocks a second at 2x (1.7% apart; K1 now reads 10 s, about 40 blocks, within 10%: a 6 s window held about 24 blocks, so one block was 4% and the leg read 2.4%, 7.0% and 10.6% on three runs of the same build). Run 3 of the finished gate, before the rebase, 19 passed, 0 failed (runs 1 and 2 were red and each red was a real thing: the meter's own double count,
then a clock leg that compared minutes over three different grounds, then the far and the opening stops over budget):

| screen | frames a second | median | worst | over 16.7 ms | over 33 ms |
|---|---|---|---|---|---|
| a town | 58.7 | 16.7 | 33 | 2.1% | 0.0% |
| the pinch in (opening stop to the street) | 52.6 | 16.7 | 83 | 11.9% | 1.6% |
| the pinch out (the street to the sky) | 46.8 | 16.7 | 117 | 14.9% | 6.4% |
| the map travelling, far stop (a block 1.9 px) | 10.5 | 83 | 183 | 100% | 100% | (OVER BUDGET, WORLD)
| the map travelling, opening stop (a block 18 px) | 40.1 | 16.7 | 100 | 33.6% | 10.0% | (66.7 median on another run: OVER BUDGET, WORLD)
| the map travelling, street stop (a block 380 px) | 43.5 | 16.7 | 100 | 12.0% | 10.2% |
| the map travelling, street stop at night (21:30 played by the game's own clock, lit; run 4) | 27.4 | 16.7 | 750 | 22.1% | 16.9% | (one 708 ms task, below)
| the fight's start (hand-over to 3 s after the board) | 31.5 | 16.7 | 333 | 36.3% | 17.8% |
| the fight on AUTO (20 s) | 48.0 | 16.7 | 83 | 22.6% | 1.8% |

Before this round, the same pinch in: 39.5 frames a second, 86 frames over 33 ms of about 500 (17%); now 1.6%. The fight's start: the
worst frame 317 to 700 ms over three fights before, 333 now; its long tasks 836 to 1,208 ms in all before, 561 now.
THE CLOCK: the march 4.27 / 3.97 / 4.14 blocks a real second at 2x at the far, opening and street stops (7.0% apart; the minutes,
22.98 / 24.64 / 23.18, differ by the ground under each journey, a road being quicker than the desert). On a CPU slowed four times this
box draws 1.5 to 2.7 frames a second, so the day there runs at about a third (7 to 16 game minutes a second): 128 beats were owed and
46 paid in that stretch; REPORTED, the box is far under any phone there.
The last run's numbers are kept in records/target/smooth/BOHEMIA_SMOOTH_IS_A_BUDGET_LAST_RUN.json (`--write`).

## THE STALE GATE AND THE SMOKE TEST

- gates/the_pad_is_travel_speed_gate.js RE-AIMED (it failed ten legs on a correct build, looking for the old plates and the old 3x
  and 5x): the clock's steps 1 2 4 with PAUSE, PAUSE holds, every block pays its clock, 2x and 4x against 1x, and HOLD PLAY FOR 4X
  with a real finger (bohemia_phone.js `__HOLD_FOR_FOUR_TIMES__`). 14 passed, 0 failed. Now in the suite.
- gates/the_whole_loop_plays_gate.js (THE WHOLE LOOP PLAYS, rule 408(d)): title, new game, a town, the map, travel, an event, a
  fight, the victory, a save, a reload; real touches where there is something to press; it stops at the first step that breaks and
  says which. RESULT: 11 passed, 0 failed on its last run; its earlier runs were red on the test's own aim each time (the town's LEAVE is on the phone's band now, a road choice brings a second card with GO ON, the fight's sides are 'you' and 'them') and twice on a real bug, the reload after a fight (below, for RUN).

## OVER BUDGET, NAMED, NOT FIXED HERE (rule 404: what changes the look waits; what is another lane's is routed)

- THE FAR STOP WHILE TRAVELLING (WORLD): about 19 frames a second on this box. The biggest piece is `__YOU_WALK_BEHIND_IT__`'s depth
  test: at a block 1.9 px wide, 105 walkers a draw take the readback path (each drawn to a scratch canvas and read back with
  getImageData, a GPU-to-CPU copy that is slow on any phone), 12 ms of a 46 ms draw standing, about 45% of a travelling frame. A
  house under two pixels tall cannot hide a man 20 px tall in a way the eye reads; skipping the test below a block size is the cheap
  fix, and it is a look call, so it is WORLD's.
- THE FIGHT'S FIRST FRAMES (COMBAT, UI): the fight page's DOMContentLoaded spends 95 ms in bohemia_ui_materials.js dressAll, and the
  first board frame 150 ms (first use of its pictures). Under the clouds by design; still a hitch in the clouds' motion.
- NIGHT AT THE STREET STOP (WORLD): the first night frame up close carried one 708 ms task (run 4 of the gate). The painter's tiles keep
  their lights as bytes until night first asks, then every tile on the glass makes its lights picture in that one frame
  (`__THE_MAP_SHARPENS_TO_ITS_OWN_PIXELS__`, vbTilesDraw). Making a few a frame (or in the worker) is the fix; it is WORLD's code.
- THE WATCHER (UI): bohemia_ui_nothing_pops.js's check runs about 24 ms of every second of a fight (checkVisibility on every element).
- THE CLOCK AT 4x ON THIS BOX: even with the debt paid, a box drawing 2 or 3 frames a second cannot keep a 500 ms beat; that is the box.

## RULE 405(b): MOMENTS THAT STILL PLAY AN OLD SCREEN BEFORE THE NEW ONE (for UI, next wave)

HOW: the demo at 390 x 844, what stands on top at the middle of the glass read every 100 ms (through every frame), while the moments
were played: a road event, a crew met and ENGAGE, the fight's start, the fight won, LEVEL UP and DONE, LEAVE and the way home, a
town's door, the phone's CREW. (Script: the session's scratchpad sweep405.js.) What it found, each with its time on the glass:

1. **THE FIGHT'S END (the one he named; CLOSED DURING THIS ROUND by RUN FIVE c7824265, BUILD 11/6e, 'the fight's card never shows first'; this was measured before it landed and is not re-swept).** The fight's own end card (`#oh` in BOHEMIA_FIGHT.html, the receipt) stands about 160 ms,
   then the end screen (`#spoilsdoor`, BOHEMIA_SPOILS_SCREEN.html) covers it. One moment, two screens. Rule 405(c): merge the receipt
   into the end screen as the till roll hanging off its edge, and cut the fight's own card from that moment (the look at final).
   UI with COMBAT.
2. **THE FIGHT'S START.** Inside the fight's frame its own loading veil (`#load`) stands about 2 s before the board (`#cv`), under the
   clouds. When the dive (rules 401(a), 407(b)) is built, the veil is the old transition and goes in the same push. UI, COMBAT.
3. **A ROAD CARD THAT OUTLIVES A FIGHT.** A road event's outcome card (GO ON not yet pressed) stayed through the meet card and the whole
   fight and was the first thing on the glass when he came home; it also stood over a town's screen opened under it. A card from one
   moment should not carry into the next (a fight's door closes it, or it waits behind the fight and is not on the way home). WORLD
   (the events are WORLD 9's this round).
4. **THE CREW SCREEN ARRIVES IN THREE STEPS.** Its frame blank, then the bags (`#bags`), then the card (`#card`), over about one second:
   one screen arriving in pieces, not a second screen, but it reads as two. UI (the crew screen, rule 369).
Nothing doubled at a town's door, the meet card, the event's own card, or LEVEL UP and DONE on the end screen.

## WHAT THE SMOKE TEST CAUGHT (THE WHOLE LOOP PLAYS), FOR RUN

After a fight, a save and the link opened again came back HOURS LATER than the game showed, twice in four full loops: saved at 6:53
(413 min), back at 12:30 (750 min); saved at 6:48 (408), back at 10:16 (616). The first read after CONTINUE already carries the later
time (nothing runs after the load), no fight is pending, travel is stopped. A plain save and reload with no fight came back at the
exact minute (360 -> 360), and the two latest full loops came back exact (408 -> 408). Not found this round; the smoke test now fails
loud the moment it happens again, with both clocks (the glass's T and the day loop's own, which the reload restores) printed. RUN (the
save, `__THE_SAVE_REMEMBERS__` and the shell's two slots).
