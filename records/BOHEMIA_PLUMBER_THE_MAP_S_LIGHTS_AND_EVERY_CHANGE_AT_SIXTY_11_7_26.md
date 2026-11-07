# THE MAP'S LIGHTS READ AS LIGHTS, AND EVERY CHANGE AT SIXTY (PLUMBER 7, chat 18, 11/7/26; rule 427(d), rules 393 and 418, ask lines 428 and 441)

The coordinator, after BUILD 11/7j: '(1) ask line 428: the map's red specks (the burned blocks' embers) look like red sand up close
and the yellow dot lights do not read as lights: make embers read as embers and lights as lights, at every zoom, at no frame cost
on a cheap phone; (2) ask line 441: every UI change (map, town, fight, camp, shop, jobs) at 60 frames a second, never a slideshow:
measure each on the phone profile, fix the slow ones (MOTION 2 owns the way into a fight: measure it, tell it in handoffs/, do not
edit its files). COMBAT TWO is changing the map's generation (streets): stay out of the generation.'
Paolo 11/4 (his screenshot, records/target/coordinator_11_4/the_map_red_and_yellow_specks.webp): 'wtf are the yellow lights and red
lights looking stuff, I zoomed in and when it didn't disappear it was looking like hella red sand, ugly'.

## THE ANSWER (for him, eighth grade)
- The burned blocks used to sprinkle a red dot on 3 or 4 of every 100 roof pixels, so the closer he zoomed the more dots: red sand.
  Now a burned block has one or two real embers (a hot core and a soft glow) and the same few at every zoom.
- A street lamp used to light its whole strip of sidewalk flat yellow: a dash. Now the lamp's head burns on its post and a soft warm
  pool lies on the ground under it. A lit window now glows a little into the wall around it.
- The painter that does this runs off the screen's own thread, so it costs the phone no frames.
- Opening the crew screen the first time froze for half a second (the phone's job board re-planned every job in the valley at once).
  Now the plans are made a few at a time in the gaps between frames: the crew screen opens at 41 to 50 frames a second, worst frame
  83 to 100 ms (it was 13.6 and 550).
- Leaving a town the first time froze the map for about half a second (fourteen pictures of the crowd unpacked in one frame). Now each
  is unpacked in the idle time before it is drawn: the leave runs at 54 frames a second, worst 67 ms (it was 37 to 44 and 416 to 450).
- Still short of sixty, with the cause named: the town's grow (13 to 19 frames a second on this box's software canvas), the bar flying
  off as a fight comes (MOTION's), and the way into a fight (MOTION 2's).

## PART 1: THE MAP'S LIGHTS (slices/BOHEMIA_CITY_WORLD.html, the painter vbCityCore, __THE_MAP_S_LIGHTS_READ_AS_LIGHTS__)
MEASURED BEFORE in the painter: a burned block's ember was a roll on every roof texel (vbHash < 0.035), so its count grew with the
texels a block has: at 36 texels a block about 45 specks a burned block, at 128 about 570 (the carpet he zoomed into). A lamp
(PART.lampspot) lit every texel of its strip of the walk in C.lamp at full strength: a flat yellow dash at every zoom.
NOW:
- EMBERS: a burned block's roof is cut into a 5 x 5 grid of the block's own size (S / 5 texels a cell, so the same cells at every
  zoom); one cell in sixteen holds one ember, jittered inside its cell; an ember is a hot core (radius S / 30, at least 0.55 texel:
  [255,168,72] at the heart, [222,92,32] round it) and a glow ([150,50,24], fading to nothing at 2.2 radii). Counted by the painter
  itself (stand.lights: embers, core texels, light).
- LAMPS: a lamp every four blocks of the arterial's run (its old cadence), at the kerb; its POOL is the ground round it lit warm
  (C.lamp at a partial strength falling with the distance, the walk's own texels under it), 1.6 texels out; the lamp's head stays the
  one flat full-strength light (on its post). The old flat strip is gone. EVERY OTHER LAMP gets the same pool from its spot, one pool
  a lamp: WORLD THIRTEEN's house streets (__A_STREET_IN_FRONT_OF_EVERY_HOUSE__, landed on main the same hour: a lamp every other lot,
  its spot the old flat yellow patch) and a town's pad and ramp lights. The painter counts every lamp texel on a powered block and any
  left without its pool (none, at every detail).
- WINDOWS: a texel of a lit house beside a lit window carries a faint warm light (C.lit at 40 to 128 of 255, more beside more lit
  windows): the window glows into the wall. Only where the block has power (rule 393(b): clusters where people live).
- NO FRAME COST: the painter runs in the map's worker (vbWorker), off the page's thread; the gate's E4 holds its own time within 15%
  of the old way's for the same tiles.
- The old way stays one switch away for the checker (inp.lightsOld), the planted fail.
GATE: gates/the_map_s_lights_read_as_lights_gate.js (THE MAP'S LIGHTS READ AS LIGHTS), on the tree rebased onto main: 9 passed.
At 36 / 60 / 96 / 128 texels a block: embers a burned block 0.65 / 0.65 / 0.63 / 0.65 (before 18.6 / 51.9 / 128 / 217), their light
0.7% of the char (before 3.3 to 3.5%), each ember's core 3.4 / 9.5 / 21.6 / 37.9 texels; a lit arterial block's pool 98 / 255 / 630 /
1,092 texels, flat yellow texels 0 everywhere (before 272 / 818 / 1,901 / 4,054); lamp texels 1,215 / 3,530 / 8,608 / 18,568, none
dark; the painter 9% over the old way's time, in its worker. MEASURED BY EYE: records/target/PLUMBER_7_THE_MAP_S_LIGHTS_11_7.webp
(before and now: a burned block at 36 and 128, a lit arterial at 128 and 36); the house street at 128 checked the same way.

## PART 2: EVERY CHANGE AT SIXTY
### MEASURED (the demo at 390 x 844 at 3, full speed, this box's software canvas; every change pressed the way he presses it by
### MOTION's own gate, gates/the_ui_morphs_gate.js, every frame logged by the driver: BOHEMIA_FRAME_LOG, tools/bohemia_every_change_at_sixty.js)
BEFORE -> AFTER (frames a second, worst frame):
- the map to a town (grow): 15 (250 ms) -> 13 to 19 (117 to 267 ms): NOT FIXED, see below
- a town back to the map (shrink): 52 / 29 -> 54 / 35; the first way out of a town, measured alone: 37 to 44, 416 to 450 ms -> 54, 67 ms
- the shop's buy (the item flies, the man held): 56.5 / 53.7 -> 54.6 / 54.8
- a job taken (flies into the phone): 55.2 -> 48.5 (one 50 ms frame; the phone's own tick, below)
- the crew screen's grow, the first time (a new crew): 13.6 (550 ms) -> 41 to 50 (83 to 100 ms); measured alone by the gate, the old
  way 35.5 (317 ms) -> 45.6 (100 ms), the longest frame until the last plan 317 -> 100 ms
- the crew screen's DONE: 60 -> 60
- making camp: not logged by the morph gate on main either (its M6 is red on main; MOTION's)
- the bar lifting off as a fight comes: 18 / 11.4 -> 20 / 7.8, back 60: MOTION's (the bar's own fly), routed
- reduced motion, a town's fade: 15 -> 18
- MOTION 2's way into a fight: 22.1 fps (617 ms) -> 25.6 (400 ms); the way out 35.5 -> 33.1 (250 ms): MOTION 2's, routed (below)

### FIXED 1: A NEW CREW IS PLANNED OVER FRAMES (slices/bohemia_job_danger.js, __A_NEW_CREW_IS_PLANNED_OVER_FRAMES__)
CAUSE (a CPU profile of the crew screen's first grow): 466 ms in one piece in the phone's board (bohemia_phone_board.js paint ->
asks -> the shelf's deal -> pickOwn -> take -> BohemiaJobDanger.fits -> read -> fightsFor: BohemiaJobKinds.plan, fightsOf, the trip's
routes, the band's roll), 28 plans. WHY THEN: opening the crew screen the first time hands the fight's door (the shell's nfOpts) the
crew screen's own company (its names, 'YOU', the looks, the line) where before it handed the start's (xp, stars, plan, rolled), so
the crew key turns and every read in the valley is new. (The same freeze followed a hire, a death, a new coat.)
NOW: a board's own ask (read(o, place, later)) for a crew nothing has been played for yet (no play under that crew key has come back)
cannot be read before its plays come back whatever is done now, so the deal gets 'reading' at once, exactly what it got before (a
deal posts a job that is reading; only false keeps a job back); the plans are made a few at a time (one slice of 6 ms, at least one
plan) every 100 ms in the page's idle time (requestIdleCallback, 400 ms at most), and not while the top window's BohemiaMotion has a change playing (a change is 250 to 1,000 ms; past 1.5 s of
one, a piece held while a town is open, the plans go on at their own pace). A plan still to make counts in the reader's queue
(BohemiaJobDanger.state().queue), so a checker that waits for an empty line waits for it. What is on the glass
(a read asked without 'later') is planned at once, as before. A plan made once its fights have been played comes back at once and the
deal asks again (FITV), as a read that comes back does. A crew or a day he no longer has drops the plan. The old way:
window.__JOB_DANGER_SYNC = true.
LEFT: one job's plan is one piece: a find on the region's land (qd-ar06 'find-place' at a far place) is 40 to 140 ms of region route
(bohemia_region.js regionRoute, an A* over the whole region per call; the valley's 466 plans are 4.8 s at full speed). FOR WORLD:
keep the route by its two ends while the land has not changed, or route on the region's coarse grid first.

### FIXED 2: A SHEET IS UNPACKED BEFORE IT IS DRAWN (engine/bohemia_idles.js, __A_SHEET_IS_UNPACKED_BEFORE_IT_IS_DRAWN__)
CAUSE (a trace of the first way out of a town): loopClose 367 to 431 ms, inside it fourteen webp decodes of 26 to 57 ms each on the
page's thread: the map's crowd draws from the idle sheets (rig_idles/map_*.webp, 2048 wide) that streamed in behind the town since
FIRST PLAY, and a picture is unpacked the first time a canvas draws it. MEASURED: img.decode() does not reach a canvas (8 sheets drawn
after it: 247 ms, against 239 without); drawn once into a one-pixel canvas, a sheet then draws in 1 ms; createImageBitmap also works
but changes what the loaders hand out (img.src, naturalWidth are read by the town's dusk cache).
NOW: a sheet counts as in once it is unpacked: drawn once into a one-pixel canvas in the page's idle time (requestIdleCallback, 600 ms
at most), one sheet a turn, 100 ms apart; until then the screen draws what it draws for a sheet not in yet (the man's still). The same loader feeds
the town's and the crew screen's people. The old way: window.__IDLES_NO_WARM = true.
CAVEAT FOR A GPU PHONE: a phone that draws its canvas on the GPU unpacks a picture for the GPU at its first draw; the one-pixel canvas
warms the software cache this box (and a phone whose GPU canvas Chrome turns off) draws from. The cure there is the sheet as an
ImageBitmap (ANIMATION's loader, the dusk cache keyed by the file, not img.src).

### NOT FIXED, NAMED
- THE TOWN'S GROW (13 to 19 frames a second): the settlement screen repaints its whole picture every frame (BOHEMIA_SETTLEMENT_SCREEN.html
  draw(): the town picture scaled to the glass, then everybody), 1170 x 2532 pixels at 3; on this box's software canvas that is 25 to
  80 ms a frame of rasterising, most of it billed to the first fill() after the picture (the shadows under the people). With the canvas
  on this box's emulated GPU (SwiftShader) the grow ran 6 to 33 frames a second across runs: that GPU is the box's CPU pretending, so it
  cannot say what a phone's GPU does with it. The cure if a real phone shows it: the still picture on its own layer (drawn once a pose,
  moved by the compositor) and only the people repainted. FOR UI / the settlement screen's owner.
- THE PHONE'S OWN TICK (slices/bohemia_phone.js tick -> paintHere, 50 to 60 ms once a second on the map, the 50 ms frame in a job
  taken; with the canvas on the emulated GPU its microtasks wait 300 to 500 ms on GetImageData read-backs once a second). FOR UI: what
  it reads back, kept on the CPU (willReadFrequently) or kept by its key.
- THE WAY INTO A FIGHT (MOTION 2's, measured at full speed on the page's thread, which the frame meter counts; MOTION's tape plays on
  the compositor, which kept its own frames at a 40 to 48 ms worst at 4x by MOTION's count): the come-down 44 frames a second (p95 67,
  worst 100 ms; the map still draws under it: fzPaint and renderCity, 200 ms in 1.25 s); THE HOLD 20 (worst 850 ms: the fight built
  under the tape, a tap in it waits that long); the turn 16 (p50 50 ms); the way out 33 (worst 250). FOR MOTION 2 and COMBAT: the
  fight's page built in pieces under the hold, and the map's draw stopped once the tape covers it.
- THE BAR FLY INTO A FIGHT (20 and 7.8 frames a second) and THE WAY INTO A FIGHT: FOR MOTION 2, in handoffs/PLUMBER.md's block.

GATE: gates/every_change_at_sixty_gate.js (EVERY CHANGE AT SIXTY).

## GATES (one at a time, this round)
On the tree rebased onto main (f956e890, BUILD 11/7v), one at a time:
- THE MAP'S LIGHTS READ AS LIGHTS (new): 9 passed (E1, E2, L1, L2, L3, W1, E4 the painter +9% in turns, P1 planted, E3)
- EVERY CHANGE AT SIXTY (new): 7 passed (C1 the crew's first open: the longest frame until the last plan 83 ms, the old way 333; C5
  the first way out of a town 50 ms, the old way 467; C2 the same 28 asks; C3 the jobs on the glass read in 21 s; P1 planted)
- THE FAR END IS PAINTED 11 passed; FIRST PLAY IS LIGHT 7 passed (14.81 MB before first play, the sheets in within 30 s after it);
  THE TOWN'S ACTIVITIES 22 passed; THE ZOOM DOWN INTO THE BOARD 28 passed; THE BOARDS ALWAYS HAVE WORK 24 passed; THE ROSTER COUNTS
  WHO CAN FIGHT 6 passed; SMOOTH IS A BUDGET 25/1 three runs, a different leg each time: (1) E1 a page error, 'drawImage ... not of type' (also in EVERYONE IN THE FIGHT
  HOLDS; not in the next two runs; its stack chased below); (2) F2 the far stop's median 33.3 ms: this round's background work (the
  board's plans, the sheets unpacked) landing in its window; fixed: both now wait 100 ms between pieces and for the page's idle
  time, and the next run held F2 at 16.7 everywhere; (3) P1 the opening stop travelling at 4x 5.1 fps against the ratchet 5.5
  (round 1: 8.4): MAIN ALONE MEASURES THE SAME (the probe, 4x, the opening stop travelling: main 4.4 fps, this branch 4.5): the
  travel at 4x lost a third since round 1 with main's own commits (11/7, WORLD THIRTEEN's street in front of every house among them);
  the ratchet is left where it is and the cut is routed (FOR WORLD THIRTEEN and PLUMBER NEXT); EVERYONE IN THE FIGHT HOLDS 53/2 then 54/1 (the
  page error above, once; E2 'ten blocks walking away', red on main in round 1 too); DEMO BUILD 25 passed; PAGES PUBLISH 28
  passed
- A PAGE ERROR SEEN ONCE: 'drawImage: the provided value is not of type' in SMOOTH and EVERYONE IN THE FIGHT HOLDS in the same pass,
  never again in two more runs of each (and not by a fight's start alone). tools/bohemia_drive_the_demo.js now keeps every page error
  with its stack when BOHEMIA_PAGEERROR_LOG names a file; SMOOTH's own collector keeps where it threw.
- REDS NOT THIS ROUND'S: DEMO IS CURRENT 15/1 (the walk pad's wedges: the walk died 9/28); EVERYBODY IDLES (not in the suite) 38/3
  (beasts and bosses with no idle sheets, three beasts' colours, rolled men's map stills: art data); THE UI MORPHS 19/6 before and
  after this round's fixes (the camp's grow and the phone's folds not logged: MOTION's)
- NOT RUN TO ITS END: THE DANGER RAMPS TO DAY FIFTY plays every fight for 16 crews and days; its first (the Lone Wolf, day 1) took 20
  minutes on this box and came out right (27 posted, 0 unread, worst 0.60, no empty board); its waits read the reader's queue, which
  now counts the plans still to make (the first run before that fix crept: the plans waited behind a piece held while a town is open).
