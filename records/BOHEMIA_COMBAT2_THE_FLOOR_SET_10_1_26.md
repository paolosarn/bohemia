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
