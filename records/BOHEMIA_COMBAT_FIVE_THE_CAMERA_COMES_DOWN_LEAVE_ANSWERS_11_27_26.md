# COMBAT FIVE: THE CAMERA COMES DOWN, LEAVE ANSWERS (BUILD 11/27g) — 11/26-27/26

VAMILY rule 484 (Paolo 11/26: 'Also keep crashing when entering combat the combat transition still sucks'; amended 11/27: 'combat
keeps crashing, like when I get into combat and then when I finish it, it's insane'), rules 407, 420, 480(c), 482; ask row 725.

## HOW IT WAS MEASURED

Every number is the demo, a phone upright (390 x 844 at 3), the CPU slowed 4x, the way a stranger plays: a road crew meets him on the
open map (off the town's ground, its screen shut), the meet card is read 3 s, ENGAGE, the fight, the win, the end screen, LEAVE pressed
with a finger once it is on the glass, the climb to the map.

- tools/bohemia_combat_five_the_way_in_record.js <outdir> [--profile] [--read ms] — films the glass (the compositor's own frames, CDP
  screencast) both ways, every frame with its time and what the dive said; writes a clip at the real speed.
- tools/bohemia_combat_five_side_by_side.py <before> <now> <out.mp4> — two films side by side, the way in lined up on ENGAGE, the way
  home on LEAVE.
- tools/bohemia_combat_five_canvas_census.js [--profile] [--fights n] — every canvas and ImageBitmap any page made, alive with pixels,
  sampled every 100 ms with no forced collection (a phone gets none), the most at each step, and who made them.
- CPU profiles of ENGAGE to the fight and LEAVE to the map (Profiler, 0.5 ms).

## WHAT HE SAW BEFORE (recorded, judged by eye against rules 407 and 420)

THE WAY IN, ENGAGE to the fight his: 14 to 15.5 s.
1. ENGAGE, then 1.0 to 2.9 s of nothing moving: V205's old pull-back (11/? era) still ran in the map's page before the dive (two beats:
   the whole map drawn every frame with the cloud shade crossing it, a 14 px blur of the whole glass, the street shrunk to a third).
2. Then near BLACK: the dive's first picture was taken of that shaded frame. A grey blob on black, then brown mush.
3. Giant legs and giant name tags ('MOB', 'COLORFUL', 'BURN BARREL CAMP') for over a second: the map draws its people and names at one
   size past its near zoom, and the dive's in-between pictures were scaled up two to four times before the next landed.
4. A hold of 5 to 9.5 s on one picture pushed 3.5% over nine seconds: a frozen frame with lines on it.
5. A half-second snap from the dark street to a bright board.

THE WAY HOME, LEAVE to the map: LEAVE came 14 to 77 s after the win (once never in 60 s); tapped, the end screen stood still 1.1 to
4.5 s, the board turning back into the map played unseen under it.

## WHY (the profiles)

- ENGAGE to the fight: 3.2 s of the main thread was the MAP drawing itself under the dive's covers (the crew's glide asking 2.5 s, the
  places' re-cut 0.7 s); the dive's own three pictures landed a second late; the fight's build waited 0.6 s on the painter's tiles.
- The end screen to the map: 98 s of 142 s of the main thread was the MAP drawing its street stop behind the end screen (it woke the
  moment the fight was won, NF.over; vbTilesDraw's restore alone 70 s); the fight's board drew under the end screen too (4.4 s).
- LEAVE: the end screen's fold waited for the page to calm (up to 1.5 s) because the way home's work began in the same task.

## WHAT CHANGED (BUILD 11/27g)

THE WAY IN (slices/bohemia_motion.js, slices/BOHEMIA_CITY_WORLD.html, slices/bohemia_region.js)
- __THE_CAMERA_MOVES_ON_THE_TAP__: the map hands the fight to the shell at once when the dive is there; no pull-back, no shade.
- __THE_MAP_HOLDS_UNDER_THE_DIVE__: while the dive comes down the map draws only what the dive asks (holdsMap / drawing).
- __THE_MEN_COME_INTO_FOCUS__: the in-between pictures are the streets and the buildings (window.__MAP_BARE: people, his figure and
  ring, the crews, the plates, the land's and the region's names left out); the men and their names come in with the stop's picture.
- __THE_CAMERA_NEVER_OUTRUNS_ITS_PICTURES__: the come-down's clock is set, before its first picture, so that picture lands before the
  camera needs it (a fresh zoom costs about nine of the map's ordinary cached draws; the map now keeps its draw cost, ONE_RENDER.ms);
  the come may take up to seven beats, since the fight is built after the stop's picture whatever the camera's pace.
- __THE_FIGHT_BUILDS_SOONER__: built the moment the stop's picture is in (no beat waited on tiles).
- __THE_CAMERA_NEVER_STOPS__: the hold pushes in 8% over four seconds (the turn takes it back on its own curve, the street's size held),
  and two surveillance brackets lock on (three blinks) where the map had his crew and the crew that met him, breathing on the beat; the
  turn's own brackets start from those two points and carry each man to his tile.
- __THE_SCAN_MAKES_THE_BOARD__: the turn is three beats; the scan line runs down the turning street from the far edge and the board is
  behind it row by row (the grid's own window, the same turn), the map still in front; the exposure starts at the map's light and opens
  to the board's (a black veil over the board, its strength the two pictures' measured brightness, 0.64 to 0.69 here, gone by the end).

THE WAY HOME
- __THE_MAP_RESTS_UNDER_THE_END_SCREEN__ (the map's render): rests while the end screen stands over the fight, as under the fight.
- __THE_FIGHT_RESTS_UNDER_THE_END_SCREEN__ (slices/BOHEMIA_FIGHT.html frame()): the board stops drawing under the end screen.
- __LEAVE_ANSWERS_ON_THE_NEXT_FRAME__: the fold starts on the next frame; the way home (nfHome) starts two frames later.

THE IPHONE (rule 484 as amended)
- __THE_DIVE_FITS_AN_IPHONE__: every dive picture at two pixels a point at most (5.3 MB, was 11.8 at three), the come-down's own
  pictures kept for the way home (no copies), and every picture the dive laid emptied (sized to zero) when it comes off; the kept ones
  emptied when the way home is over; the hold's brackets let go of the camera layer.
- __THE_RING_IS_ONE_CANVAS__ (the fight): a ring with a hole (its blocks still loading, the first frames of every fight) made a new
  24 MB canvas EVERY FRAME, and at night a second one for its copy, none emptied. Now one canvas serves every unfinished ring, the
  night's copy is emptied once used, a replaced ring is emptied.

## AFTER (the same walk)

THE WAY IN: ENGAGE to the fight his 8.9 to 10.3 s at 4x (was 14 to 15.5); the camera moves 0.4 s after the tap (was 1.0 to 2.9); no
black; the come-down 2.7 to 3.5 s through the clouds and bare streets; the hold 2.9 to 3.7 s with the camera still coming down and the
brackets on; the turn 1.5 s with the scan making the board. Compositor frames (the zoom gate's traced leg): median 16.7 ms, p90 19.9,
worst 39.9, none over 100.
THE WAY HOME: LEAVE on the glass 3.6 to 4.6 s after the win (was 14 to 77); the fold starts about half a second after the tap (was 1.1
to 4.5 s still); the board with its grid seen, turned back, the climb; LEAVE to the map 4.1 to 6.3 s.

THE CANVASES (the census, no forced collection, one fight): going in 249 MB -> 212 MB; left alive after a fight (forced collection)
151 MB -> 121 MB; the dive's canvases between fights 6 -> 0 (PLUMBER 8's gate, M6). TWENTY FIGHTS HOLD MEMORY FLAT, 8 fights upright at
4x: 10/0, the most 141 MB of canvases.

## NUMBERS FOR PLUMBER 8 (the page side, rule 484(a); not this lane's to cut, named)

At the peak (the end screen over a won fight), about 700 to 750 MB of decoded pictures alive at once, of which BITMAPS (ImageBitmap,
which a phone cannot throw away as it can an <img>'s decoded copy) 480 to 536 MB:
- the map's people sheets, BOHEMIA_CITY_WORLD.html rigSheetLoad (CHARACTER 2's __A_SHEET_DECODES_OFF_THE_FRAME__, 11/26): 195 MB,
  alive on the map and all through every fight (the map is hidden);
- the map's idles, engine/bohemia_idles.js:149: 107 to 124 MB, the same;
- the fight's ground blocks (COMBAT FOUR's __THE_GROUND_DECODES_OFF_THE_GLASS__, 11/26): 80 to 125 MB (each block 2575 x 1820, 17.9 MB,
  seven on a canyon board; the board shows about 390 points wide; DIRECTION's verdict 22 shows the art one to one at the near stop, so
  shrinking needs the near blocks loaded on the pinch: this lane's next);
- the fight's held sheets (rig_hold, rig_melee) 53 to 63 MB, packed body sheets 25 MB, the fight's idles 26 to 28 MB.
CANVASES: the map 111 MB (vbCityLand 44, vbViewLand 17 to 35, vbLand 12, the ground cache 10.5); the fight 60 to 100 MB (the ring 24,
the baked board 21, the glass sheet 11).
The map's 300 MB of bitmaps under every fight is the single biggest thing alive when his phone dies going in and coming out.

## GATES (pre-push pass, on this tree)
THE ZOOM DOWN INTO THE BOARD 15/0 upright, 7/0 traced at 4x, 12/0 computer; THE WHOLE LOOP PLAYS 11/0; LEAVE WAITS FOR THE SCREEN 5/0;
TWENTY FIGHTS HOLD MEMORY FLAT 10/0 (8 fights upright); AUTO AT 4X NEVER CRASHES 7/0; DEMO BUILD 25/0; PAGES PUBLISH 30/0; MAKE CAMP FROM
THE FIGHT 11/0; THE CAMP IS THE FIGHT'S BOARD 33/3 (the three are ask row 681's, quarantined, red on main on the same legs). Full suite
unmeasured since PLUMBER 8's line.

## WHAT THIS DID NOT DO
- The board still does not look like the map's street stop (the map's dark towers, the board's bright houses): two painters, one place.
  The scan and the exposure make the change read as the overlay making the board, not as a cut; the art is WORLD's and COMBAT MAPS'.
- The sideways recording was stopped by the coordinator's interrupt; the gates' sideways legs ran (the zoom gate computer, AUTO).
- The ground blocks' size (above) and the map's bitmaps under the fight.

[bb Battle Brothers cuts to a still battle screen; here the camera never stops]
[analog horror: the surveillance camera finds them before the tape lets you in]
