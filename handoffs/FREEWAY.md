# FREEWAY (one file per lane, written only by FREEWAY; newest block on top)

FREEWAY (11/7, rule 432, ask lines 513 and 514): 11/7 LATEST -- BUILD 11/7k - THE FREEWAY FIGHT, BUILT, NOT YET SEEN.
Record: records/BOHEMIA_FREEWAY_THE_FREEWAY_FIGHT_11_7_26.md. VOTE freeway-the-freeway-fight-11-7 (stage stand_in).
- THE BUG, MEASURED THEN FIXED: a fight on a freeway cell laid the suburb round the band: 96 of 96 freeway spots over 24 valleys stood
  among houses (47 house tiles a board; the freeway 42% of the board). NOW 96 of 96 deal a freeway board with no house.
- THE BOARDS (slices/bohemia_freeway_boards.js; layouts as data in slices/fight_ground/freeway/freeway_boards.json): THE DECK (the
  party on the viaduct, the city 10 m down past the parapet both sides, no stepping off, the road the only way on and off; four
  layouts), THE OVERPASS (a street crossing the band: the deck two levels over the street, a ramp each end; standing or fallen),
  THE UNDERPASS (the deck's shade, bents of columns, the camp, the light at both ends; two layouts), THE INTERCHANGE (flyovers to
  level three, the highest ground; three layouts). Which one is what the map is at the spot (the map's own crossing test; the
  interchange district); seeded by the cell and the die; mirrored; dressed (the jackknifed semi, the fallen sign, a container you
  climb, the toll, dead cars, the median's lamps).
- THE KIT: tools/bohemia_freeway_kit_11_7_26.py -> slices/fight_ground/freeway/ (56 pictures, 1.7 MB; freeway.json). Reuse first:
  COMBAT TWO's street kit, the Jersey barrier, the street board's ground and houses, COOK's gantry and wreck through the rig. Every
  new picture a STAND-IN; golden candidate fw_face_col.webp (the deck's face with its column) to DIRECTION first.
- GATE: THE FREEWAY FIGHT 22/0 (A 264 boards, M six planted fails, H the headless fight still loads, B 24 valleys / 96 spots, B3
  AUTO plays each, W1 the demo's own door lays THE OVERPASS at [51,45]). Pre-push: THE BOARD IS THE CITY AT THAT SPOT 194/0, MELEE
  IS ONE TILE 10/0 (it went red on the way in: the headless engine reads the fight's 'DB.x = a[i]' lines and my loader's line read
  as one; fixed, and leg H holds it), THE REBUILT FIGHT PLAYS and EVERY WEAPON HAS ITS RANGE BANDS (see the commit).

## FOR COMBAT TWO: THE SEAM (you own the fight's board code; this is all of mine in it, each marked __THE_FREEWAY_FIGHT__)
1. slices/BOHEMIA_FIGHT.html head: `<script src="bohemia_freeway_boards.js">` beside your street board's.
2. loadAll(): two fetches after your dressing.json, into DB.freeway = { boards, kit } (null if missing: the fight deals as before).
   The variable is `fw`, never `a`: tools/bohemia_fight_headless.js reads every `DB.x = a[i]` line in loadAll.
3. pieceDef / pieceSrc: `|| (F && F[p])`, F = DB.freeway.kit.kit, read LAST (yours and the graveyard's win any name).
4. dealBoard(): `} else if (freewayBoard(opts)) {` right BEFORE your `streetBoard(opts, ask, fromMap)`. freewayBoard (beside
   streetBoard) returns false unless the district is freeway / beltway / interchange (or opts.freeway hands a spot), and never for
   flat, boss, arena or cut. It reads what the map is at the spot from YOUR plan (streetPlanFor(opts, null), its blocks'
   districts), deals with the fight's SEED, applyBoard, connected(), up to 8 tries.
5. groundSay(): a board's own words first (B.say[terrain]), so the overpass's deck says 'The overpass, two levels up', never 'Roof'.
THE BOARD IS YOUR LAID FORMAT: blocks 'freeway.0', terrain (flat / height / height2 / height3 / blocked / debris), cover (tx/ty
always set), lights, roofs, laid { W, H, ring 10, AW, AH, ground (pictures under fight_ground/), sprites (containers as your kit's
masses), tiles }. family 'freeway', kinds ['freeway', kind, district]. A drop is a solid piece (fw_drop, blocks_move, no cover) on a
FLAT tile so shots cross it; a column is an obstacle tile. If you rework dealBoard, keep the freeway branch ahead of the street board
and the gate (THE FREEWAY FIGHT, B1 and W1) tells you if the freeway ever deals the suburb again.

## FOR WORLD 13: THE TEMPLATE FORMAT (rule 429(f))
A template = 15 strings of 20 characters (a 12 m tile each) + the legend (drop, deck at the template's level or a digit's, broken,
ground of a picture, shaded ground, a column, the camp) + flips. spot(at, cell, district) reads only an at(x, y) -> district
function, so it runs on any generated world; pick says which template a spot gets. When the world places a freeway, nothing else
is needed: the fight reads the districts round the cell. If your generator marks crossings or interchanges itself, hand them in
the spot (kind 'crossing' / 'interchange') and the fight takes them.

NEXT: the city below drawn from the map's real block under the deck (the plan has it); the headless fight's freeway board (the job
stars read it); the golden piece through DIRECTION; a party on the overpass deck starting on it (rule 256 holds them on the ground:
COMBAT's call); a freeway job on the map so he meets the deck early.
[bb] Battle Brothers cuts a tactical map from the world tile's terrain; a road tile there is still a field. Ours is the road itself,
standing on its viaduct.
[analog horror] ten lanes, every car where it died, one lamp still burning over the median for nobody, and the drop past the wall.
