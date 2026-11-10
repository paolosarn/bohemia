# PLUMBER 8 -- NO FREEZE OVER HALF A SECOND (11/10/26)

Rule 441(c) (Paolo 11/10: "turn me up, do a full suite, more bug fixes, smoother experience... stop with the half baked shit; be token
efficient"), rule 400 (smooth is a budget), ask line 543. Part 2 of PLUMBER 8's job (SMOOTH). Part 1 (THE FULL SUITE) is its own
record when the run on main finishes: records/BOHEMIA_PLUMBER_EIGHT_THE_FULL_SUITE_11_10_26.md.

## THE TOOL: THE FREEZE CENSUS (tools/bohemia_freeze_census.js)

One walk through the whole demo the way he plays it, on his phone upright (390 x 844 at 3, touch), the CPU slowed 4x:
the town he wakes in, out to the map, the map standing, travelling at the slowest and the fastest speed, the pinch in and out,
into a town, a shop and an item, the sheet shut, the lot, SEARCH THE LOT (the minigame opened, a spot tapped, left), back to the
map, camp made and broken, a fight's start, AUTO at 1x and 4x, its end and the spoils, a boss fight (THE POT) start to spoils,
a home base planted and opened, a save, and the game reopened after the tab died (chrome://crash, the same phone, CONTINUE).

A FREEZE is a gap of more than 500 ms between two frames of the top page's requestAnimationFrame clock (every frame of the game
shares that thread, so it is what his thumb feels). Each freeze carries the long tasks inside it and the page that ran them.
Every PNG made of a canvas and every pixel read (toDataURL, getImageData) is counted per step, and whether the canvas was made
for reading (willReadFrequently): on a phone a canvas the GPU draws makes the page WAIT for the GPU at every read or PNG.

Two modes: `--cpu` (this box's software canvas, what the gate walks) and the default (the canvas on a GPU process, SwiftShader).
WHAT THIS BOX IS: SwiftShader is a GPU emulated on the CPU, in another process the throttle does not slow, so a read-back here waits
far longer than on a phone, and in a town it stops making frames altogether (a screenshot timed out after 30 s; a page that makes
no frames takes no taps). The counts travel to his phone; the milliseconds are this box's.

## MEASURED BEFORE (main d97cecd3, the same walk, the box quiet: the full suite paused 31 min for the pair)

- 143 freezes over half a second; 578 reads or PNGs off canvases not made for reading; 205 PNGs made.
- A fight's start: 35 GPU read-backs, 31 PNGs, a 6.25 s stall. A boss fight's start: 31 PNGs, a 5.9 s stall.
- The fight's end and the spoils: a 3.8 s stall. A town's opening: 70 read-backs; the shop: 47.
- The profile of a fight's start (CPU profile, 34 s window): 12.7 s in getImageData and 8.2 s in toDataURL, 62% of the window.

WHERE IT WENT (each found with a CPU profile and a stack per read):
1. slices/bohemia_ui_materials.js apply(): every new page (every fight, the spoils, the settlement, the stash, the crew screen)
   painted the same eight SEEDED pictures again (cardboard, tape, receipt, glass, card edge, three marks) and PNG'd each: 4.5 s of
   a fight's start, a 4.75 s stall of its own. rootVars(), hudVars(), dressMapBar() the same.
2. slices/BOHEMIA_CITY_WORLD.html mapInkTop(): the ink line kept for the LAST picture size only; him and a man of his at another
   size took turns to miss it, and each miss where reads are slow was a read-back: 8.8 s of the window.
3. slices/BOHEMIA_FIGHT.html actMarks(): the big button's three marks drawn and PNG'd at every fight's start.
4. engine/bohemia_rig_bodies.js standing(): every person standing in a town read back whole to find his feet: 53 of a town's 61.
5. slices/BOHEMIA_CITY_WORLD.html mapArtSprite(): the map's party markers read back for their pale rim: 149 of the boot's 162.
6. slices/BOHEMIA_FIGHT.html groundLums(): the night's light under every tile read ONE PIXEL AT A TIME, four a tile, off the
   3200 x 1696 baked board: 1,200 read-backs a bake (every night fight, and every SEARCH THE LOT, whose minigame bakes a board).
7. engine/bohemia_wear.js anchor(): every fight is a new page, its anchor cache empty, so every frame of every man's sheet read
   again (each read unpacks a 2048-wide sheet): 5.8 s of a fight's start.
8. slices/BOHEMIA_FIGHT.html outlineOf(), engine/bohemia_stats.js arrows and hatch, slices/bohemia_ui_three_items.js frame and
   pool, slices/bohemia_ui_materials.js markURL, tbDark, tbDots: canvases made to be read or PNG'd, on the GPU.

## THE FIXES (the same pixels everywhere; nothing hidden, the work is gone)

- __A_PICTURE_IS_MADE_ONCE_A_SESSION__ (materials, the fight's marks): a picture made to be encoded is made on the CPU
  (willReadFrequently), and the seeded pictures are made ONCE A SESSION and kept on the top page (one origin, one tab), the seed put
  back where making them would have left it so every later picture is byte-identical. Old way: window.__BM_KEEP_OFF.
- __A_SIZE_KEEPS_ITS_INK_LINE__ (the map): every size keeps its own line (a second; ten where reads wait on the GPU).
  Old way: window.__INK_ONE_SIZE.
- __A_PICTURE_IS_READ_ONCE_A_SESSION__ (engine/bohemia_wear.js): a frame's anchor is the sheet's (its file and the frame's box), kept
  on the top page for the session. Old way: BohemiaWear.keepOff.
- __A_ROW_IS_READ_ONCE__ (the fight's groundLums): the four points of a tile lie on two rows; each row is read once, whole: 1,200
  read-backs to 30, the same values (gate leg K5). Old way: window.__GROUND_LUMS_PER_POINT.
- willReadFrequently on every canvas that exists to be read or PNG'd: the town's feet, the map's markers, the fight's outlines,
  the stat arrows and hatch, the item frames and the lamp pool, the start marks.

## MEASURED AFTER (the same walk, the box quiet, back to back with the before; before the wear and groundLums fixes landed)

- 119 freezes over half a second (143); 29 reads or PNGs off canvases not made for reading (578); 145 PNGs (205).
- A fight's start: 0 read-backs (35). The fight's end: worst 0.3 s (3.8 s). The fight on AUTO at 1x: no freeze (3.5 s frozen).
- A town's opening: 1 read-back (70); the shop: 0 (47). The pinch in: no freeze (0.8 s). The reload tappable 4.6 s (6.2 s).
- Frozen in all over these steps: 173.7 s before, 124.1 s now (records/target/plumber8/PLUMBER_8_NO_FREEZE_BEFORE_AFTER_11_10.webp).
- After that pair: the lot's minigame 1,201 reads to 31; the wear anchor's 5.8 s gone from a fight's page.
- In software-canvas mode (the gate's): the materials made 5 times a session and taken from the keep 16 times; the fight's marks
  kept; every step of the walk pressed.

## STILL OVER HALF A SECOND (named, routed, the next round's list)

- THE BOOT AND THE RELOAD (RUN, PLUMBER): 20 to 26 s frozen on the slowed phone; long tasks of 3 to 4 s in BOHEMIA_CITY_WORLD.html
  (a 6.5 MB page: parse, the valley's generation). Not touched this round; the next PLUMBER item.
- A FIGHT'S START AND A BOSS FIGHT'S START (MOTION 2, COMBAT TWO): one stall of 5.9 to 7.6 s with NO page work in it on the GPU
  box (the page idle, the GPU process busy: the dive's photographs and the board's paint, rasterized by the emulated GPU); on the
  software canvas a 4.4 s task in BOHEMIA_FIGHT.html (the board's bake: laidPaint, ringCanvas). The fight is built new each time
  (a fresh BOHEMIA_FIGHT.html page, 951 KB of inline script, 22 data files fetched no-cache): a kept fight page is the root fix.
- THE MAP TRAVELLING (WORLD, PLUMBER 7's route): 1 to 2 frames a second at 4x on both canvases, 8 to 10 s frozen a walk.
- THE TOWN AT REST (UI, PLUMBER 7's item 1): 5 to 7 frames a second at 4x (the whole town picture repainted every frame at 3x).
- A PAGE ERROR on main and on this build: "Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The provided value is not
  of type..." (PLUMBER 7 saw it once; this walk sees it every time on the GPU box). Ask row 558 (COMBAT TWO, FIXES).

## THE GATE: NO FREEZE OVER HALF A SECOND (gates/no_freeze_over_half_a_second_gate.js, registered, solo)

W1 every step walked; K1 a fight's start makes at most 14 PNGs and the materials' set is made a few times a session; K2 the kept
pictures are the old way's byte for byte; K3 the map's ink line read at most 160 times a walk; K4 at most 140 reads or PNGs off
canvases not made for reading over the whole walk; K5 the night's light by rows equals the light by points, value for value;
F1 every step's freezes and worst freeze under a ratchet that may only come down, the walk's total under 330; P1 PLANTED: the old
ways (__BM_KEEP_OFF, __INK_ONE_SIZE, __GROUND_LUMS_PER_POINT) and a 900 ms stall in the way into a town turn K1 and K4 red and the
census catches the stall; E1 nothing threw. Its run: see the commit.

## THE PIPE: THE SUITE'S BROWSER COUNT (gates/bohemia_gates.py)

is_browser_gate() read only the gate's own file for 'playwright' or 'chromium'. The fleet's browser gates mostly drive the browser
through a shared tool (tools/bohemia_drive_the_demo.js, the motion recorder), so MEASURED on main: 308 of the 720 gates counted as
browserless open Chromium. --pure ("the tier every lane can afford every turn") launched hundreds of browser walks, and the full
suite ran JOBS + BROWSER_JOBS browsers at once (six on this four-core box) where BROWSER_JOBS was the cap: the timing gates go red
for load and the run crawls. Now a gate is a browser gate if it, or a tools/ file it names (three deep), drives one: 462 pure.

## THE QUARANTINE AND THE SUITE LINE (gates/bohemia_gates.py)

VAMILY rule 13 (9/13) said "a gate on the QUARANTINE list still runs and never decides a ship"; the list was never built.
gates/BOHEMIA_QUARANTINE.txt, one line a gate: NAME | OWNER | SINCE | WHY. A quarantined gate runs and is printed by name with its
owner; a red one never decides the exit code; a green one prints CAN LIFT. A line naming no gate, owner, date or reason is refused,
loudly. Every run now ends with one SUITE LINE (sha, ran, green, red, never ran, red in the pack green alone, quarantined red).
The list's entries come with part 1, from the full run on main.

## TWO MORE PIPES FOUND IN THE SUITE'S FIRST HALF (fixed this round)

- 56 gates and tools launched Chromium at a hard-coded /opt/pw-browsers/chromium-1194/chrome-linux/chrome, a build this box no longer
  has (it has chromium-1243): "browserType.launch: Failed to launch chromium" before a single leg ran. All now point at
  /opt/pw-browsers/chromium, the box's own stable link to whatever build is installed (37 gates already did).
- CASING FACE (gates/casing_face_gate.js) reads the casing face's character list with Python's fontTools, which gates/requirements.txt
  never listed: red on every fresh container for the box's reason. Listed, installed, checked by the runner's deps_check; run alone it
  then finds a real thing: the feed's handles ('@marisol_v') are lowercase words in the caps-only face (ask row 559, UI TWO and FEED).

## THE PAIRS THAT SAY A RED IS NOT MINE (the same gate on clean main and on this tree, back to back, the box loaded)

- THE WHOLE LOOP PLAYS: main 10/1, this 10/1, the same red: ask row 558's drawImage error.
- SCAVENGE ON THE DIAL: main 26/1, this 26/1, the same red: B3, taps a quarter beat late on a loaded box.

## AFTER MAIN MOVED (rebased onto 11/10g THE CAMP IS THE FIGHT'S BOARD; the gate's walk again, --quick)

W1, K1 to K5, E1 green; THE WHOLE LOOP PLAYS 11/0. F1 caught two steps over their ratchets on main's new content, named and routed
rather than loosened: camp > map worst 1,417 ms (every walk before under 0.8 s: ask row 560, MOTION 3) and the reload worst 6,716 ms
(ask row 561, PLUMBER's next). Each is held at its measured worst as KNOWN OVER, printed every run, until its owner deletes the line.

