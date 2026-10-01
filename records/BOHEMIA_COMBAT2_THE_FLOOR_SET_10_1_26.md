# COMBAT 2 [floor set] -- THE FIGHT'S FLOOR, ROUND 1 (10/1/26, session combat2-8ca291aa)

Paolo 10/1: "the tiles below the people dont look good." Rule 46f and 55.

SHIPPED: tools/bohemia_combat2_the_floor_set_cook_10_1_26.py ->
  banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt (JSON: ground[] and cover[], each b64 PNG)
  slices/vote/COMBAT2_THE_FLOOR_SET_10_1.png (VOTE id combat2-the-floor-set-10-1, BEFORE beside AFTER)

GROUND (9 tiles, each 515 x 515 = 12 m at 42.9 px/m, his 7/28 bank's own density, never resampled):
  street_small (1 tile: walk, kerb, gutter, two lanes, faded dashed centre line 3 m on 9 m off,
  gutter, kerb, walk), street_crossing, street_big_a + street_big_b (two tiles, the double line
  at the join), freeway_lane (four in a row is a freeway, 46g), lot, lot_b, slab (joints every
  3 m), roof (flat gravel deck in a stucco parapet, hatch, dead swamp cooler: the one high ground).
  Street tiles run EAST-WEST and tile along x (guarded: west edge == east edge); rotate 90 for N-S.
COVER (2): dead_car = his own 7/28 'wreck_road' sprite reused whole (4.36 x 2.09 m, 1.45 m tall);
  block_wall = 6 m of desert block, 1.8 m tall, cap lit NW, courses on the south face.

GUARDS (refuse the run): every tile exactly 515 px; every pixel on his ramps, his tiles or his
sprites; street tiles seamless east-west; no two tiles the same picture; every cover piece at or
over chest height (1.3 m), so it hides a man.

FOR COMBAT 1 (dropping them in): read the bank, decode ground[id].b64, draw each house tile 1:1
at the device pixel ratio (the [device canvas] rule). Map: road cells -> street_small (or big a/b
by road class), yard -> lot/lot_b alternating by seed, driveway -> slab, the climbable house ->
roof. Cover: replace the tan blocks with dead_car / block_wall. Nothing else painted on the floor.

KNOWN WEAK, NEXT ROUND ([cover pieces] row): the slab and sidewalk bands carry his tiles' heavy
cracks and read busy at half zoom; the shed is not drawn yet; north-south street variants are
a rotation, not their own sun pass.

## ROUND TWO (10/1, his fifth votes, rule 56): REAL SIDEWALKS, SEEN AT 45

His vote on round one: up, with "it's not a eagle Birdseye view 90... everything we do is 45 when
it comes to the land underneath" and four NOs on the sidewalk width.
  * SIDEWALK 1.4 m (4.6 ft) on a 9.2 m roadway: 0.15, about an eighth (Vegas 4-5 ft on 37 ft).
    Round one was 1.8 on 8.4 (0.21). A ruler guard refuses anything over a sixth.
  * 45 CAMERA: every tile is 515 x 364 (12 m wide, 12 m deep x cos45). The plan is baked square
    and NEAREST-squashed (every pixel his), then the south-looking faces are drawn at cos45: the
    north kerb's face, the roof's parapet (north inner face, south outer face, swamp cooler box),
    the walls' and shed's faces, and the cars' south flanks (his paint in its own shadow, flat
    tyres). Bank declares perspective; art_45_gate 16/0.
  * NEW TILE street_small_ns: the north-south street, its plan turned BEFORE the tilt (a rotated
    tilted tile would be wrong), so roads can cross.
  * VOTE combat2-the-floor-set-r2-10-1 (redoOf the voted one), sheet COMBAT2_THE_FLOOR_SET_R2_10_1.png;
    round one's sheet left as he voted it. The cover sheet (combat2-the-cover-pieces-10-1) re-cut
    at 45 in place (not yet voted).
FOR COMBAT 1: tiles are now 515 x 364 per house; the board's row pitch is 364 px at authored size.
NEXT (rule 57): a sheet per board kind, CUL-DE-SAC and DESERT WASH first.

## ROUND THREE (10/1, rule 57): THE BOARD KINDS, CUL-DE-SAC AND DESERT WASH

tools/bohemia_combat2_the_board_kinds_cook_10_1_26.py -> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_10_1_26.txt,
VOTE combat2-the-board-kinds-10-1 (slices/vote/COMBAT2_THE_BOARD_KINDS_10_1.png).
A kind = one 60 x 60 m plan (5 x 5 house tiles) dressed from the banks, seen at 45 (faces drawn
where a high surface sits north of a low one), then CUT into 25 tiles of 515 x 364. Cover is NOT
baked: kinds[].cover is a placement list (piece id + metres) so the cutter can reshuffle per seed.
  culdesac: 9.2 m stem from the south, 22 m bulb, 1.4 m walks, kerb faces seen, six houses on whole
    tiles (round-two roof tile, six seeds) with 4.4 m slab drives to the kerb, dead planter island,
    cars, walls, shed placed.
  wash: a meandering dry bed 6-10 m wide, one soil per surface with ragged patches (the first cut
    checkerboarded the pool's four soils), cut banks shaded and their south faces seen, 120 creosote
    clumps from the rock's own olive, 9 grey rocks as cover, one three-dome outcrop as the mound.
  Pieces: cover bank ids plus extra_pieces rock_N and outcrop (in this bank).
GUARDS: tile size, colours (7/28 bank + desert pools bank), sidewalk ruler, placements on the
board and on legal surfaces (no wall in the road, no car in a house), no stamped tile.
NOT USED (measured): the desert pools 'boulder' list is lava spikes and blue coral; never Mojave.
FOR COMBAT 1 (the cutter): map cell kind -> kinds[id]; draw tiles[r][c]; drop cover by placement.
NEXT (rule 57): suburb block, strip lot, scrub, freeway.

## ROUND FOUR (10/1, rules 57 and 59): SUBURB BLOCK, STRIP LOT, SCRUB, FREEWAY, AND EVERY TILE TRANSLATED

tools/bohemia_combat2_four_more_board_kinds_cook_10_1_26.py (imports round three's helpers and guard)
-> banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_4_10_1_26.txt, VOTE combat2-four-more-board-kinds-10-1.
  suburb: street on the middle row (9.2 m + 1.4 m walks), 8 houses on whole tiles, drives, walls, sheds, 3 cars.
  strip: five store roofs on the north row (one climbable, four 'blocked'), 2.4 m store walk, a parking
    lot with two nose-to-nose stall rows (2.7 m stalls) and pole bases, cars in stalls, frontage road south.
  scrub: hardpan, creosote dense in noise-field patches (rough), a two-rut track, a sagging fence, 7 rocks + outcrop.
  freeway: the cut wall north (blocked row), eight lanes with dashes, shoulder lines, the yellow median
    edges and a lit median top with its face seen, the south embankment face, a jam of ten dead cars.
TERRAIN (rule 59): every kind carries terrain[5][5] from {flat, rough, debris, height, blocked}, read
from the drawn masks (houses -> height only where a roof is drawn); round three's two kinds are
translated in round_three_terrain. Key and source in the bank. No cover sits on a blocked tile (guard).
NEXT: strip-mall store fronts deserve their own facade tile (they reuse the house roof); landfill,
shore, the ruin variants (debris).

## ROUND FIVE (10/1, rules 57, 59): THE SHORE, THE LANDFILL, THE RUIN

tools/bohemia_combat2_shore_landfill_ruin_cook_10_1_26.py (imports round four) ->
banks/BOHEMIA_THE_FIGHT_BOARD_KINDS_ROUND_5_10_1_26.txt, VOTE combat2-shore-landfill-ruin-10-1.
  shore: deep water (water bank tiles 15-18, each colour snapped to the bank's own colour nearest its
    60% self: a hole, not a pool) is 'blocked'; the pale wading band (tiles 26-27) is 'water'; mud flat
    from the desert soils; the bathtub ring a bleached band with its 1.6 m face seen; rocks, a car, rubble.
  landfill: haul road, trash heaps from a noise field ('height', faces seen), 260 tyres, rubble cover.
  ruin: the suburb block soot-shaded, four of eight roofs burnt through (joists over black, 'blocked'),
    yards a debris field ('debris'), rubble and broken walls.
New tag 'water' (3 steps, defence malus). Extra pieces rubble_N in this bank.
NEXT: store-front facades, the casino floor (an interior), night light as a tile property.

## ROUND SIX (10/1, rule 59's night-lit row): THE BOARDS AT NIGHT

tools/bohemia_combat2_night_boards_cook_10_1_26.py -> banks/BOHEMIA_THE_FIGHT_BOARDS_AT_NIGHT_10_1_26.txt,
VOTE combat2-night-boards-10-1. Round four's suburb block and strip lot (cover composited in) taken
to night: x(0.30, 0.31, 0.38), then the pools of his live lamps (7/28 lamp sprites every 12 m on the
walks, 36% lit) and his burning oil drums restored warm in three hard rings (ellipses at cos45);
every pixel snapped to the allowed palette (numpy nearest). light[5][5] = 'lit' where 40% of a tile
is inside a pool. Guard: colours, size, not stamped, at least one lit tile.
NEXT: store-front facades, the casino floor interior.
