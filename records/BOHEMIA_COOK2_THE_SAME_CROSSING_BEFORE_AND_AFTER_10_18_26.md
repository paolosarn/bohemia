# COOK TWO -- [the same crossing before and after] -- 10/18 (cook2-b27d, Opus 5.5)

The row (top OPEN since 10/10): DIRECTION passed the road and sent the sheet back (0b8b782c): the same crossing,
before and after, is the only thing between the street kit and VOTE (rule 89). Constraint: nothing redrawn; the
picture shows what is laid.

## HOW THE PICTURE WAS MADE (nothing drawn)
- The 10/10 sheet (slices/fight_ground/kit_street/before_after.webp) put the old MAIN street beside a bare kit
  crossing: two different places. That is why DIRECTION sent it back.
- This sheet cuts ONE file, slices/fight_ground/block_corner_0.webp (the fight's four-way crossing block), at two
  commits: 61337a8a (COMBAT TWO [the rest join], 10/10, the last board before the kit) and HEAD (laid by COMBAT TWO
  8c1ff703 from COOK TWO's kit_street; da85d04 since). The same 1240 x 1000 px window of the 2575 x 1820 board,
  at 1:1, on both sides.
- Tool: tools/bohemia_cook2_the_same_crossing_before_and_after_10_18_26.py (needs the history in the clone:
  `git fetch --filter=blob:none --deepen=3000 origin main`; this container is shallow at 50).
- Sheet: records/target/COOK2_THE_SAME_CROSSING_BEFORE_AND_AFTER.png; numbers:
  records/target/COOK2_THE_SAME_CROSSING_BEFORE_AND_AFTER.json.

## MEASURED (the proof that the picture shows only what was laid)
- 715,617 px changed between the two commits on block_corner_0, ALL of them inside the two roads and their walks
  (the east-west band rows 728 to 1091, the north-south band columns 1032 to 1544, a 40 px margin for curb
  shadow): **0 px changed outside**. The houses, yards and dirt are the same pixels.
- block_main_0: 392,752 px changed, all in rows 728 to 1091 (the street band).

## FINDINGS (routed, not touched: the board layouts are COMBAT TWO's files, the hard split)
1. **A LINE FROM THE OLD STREET SURVIVES ON EVERY RE-LAID BOARD.** The BEFORE board carried tan kerb-paint lines
   at rows 768 to 770 and 1049 to 1051. After the re-lay, row 770 is still a full-width 1 px tan line
   (RGB about 188,164,130) across the whole board, through the middle of the crossing, and row 766 carries 519 px
   of it over the crossing (x 997 to 2028). Measured on block_corner_0, block_main_0, block_subs_0, block_lots_0,
   block_strip_0: all five carry row 770. None of the 21 kit pieces holds such a line (checked, 0 rows over 60%),
   so it is drawn by the layout after the kit. It reads on the sheet as a seam across the street. -> COMBAT TWO.
2. **THE LAID STREET RUNS OVER A ROOF on block_main_0.** The BEFORE board stopped the road at the long strip
   building; after the re-lay the street band is painted across that building's roof and up to the church
   tower's edge (visible at 1/3 scale; the change band covers rows 728 to 1091 full width). A draw-order fault
   in the board layout, not in the kit. -> COMBAT TWO.
3. What the AFTER still lacks, by eye at 1:1, for the next round of the kit: the walks stop square at the
   crossing (no curb return, the 47's corners are not laid on the fight boards yet), and the asphalt cracks
   repeat in clusters a tile apart.

## FIVE TELLS (rule 114, by hand until the gates read this sheet)
One pixel size (both halves 1:1 of the same board); the palette is the board's own; one light (from above, as laid);
no ramp made by darkening (nothing was shaded); the AFTER's rest areas are the plain asphalt between the cracks.

## THE CULL HELD IT (rule 114b), AND THE RULER IS MEASURED AGAINST HIS OWN TILES
Registered with its sprites (the kit pieces the AFTER is laid from), NOT VIBE CODED's N3 culled it: every kit piece
fails D2, D3 or D4. A sheet that fails the first five never reaches the tab, so it is NOT in VOTE. Before touching the
art, the same held verdict (class tile, family ground, the pack bands, the guide) was run on his own tiles
(tools/bohemia_cook2_the_ground_against_the_cull_10_18_26.py -> records/target/COOK2_THE_GROUND_AGAINST_THE_CULL.json):

| group | n | D2 fails | D3 fails | D4 fails | all five pass |
|---|---|---|---|---|---|
| his road tiles | 278 | 35 (13%) | 256 (92%) | 122 (44%) | 9 (3%) |
| his ground tiles | 391 | 39 (10%) | 355 (91%) | 119 (30%) | 24 (6%) |
| kit_street pieces whole | 21 | 18 (86%) | 18 (86%) | 12 (57%) | 0 |
| kit_street cut to his tile size (88 px) | 63 | 0 (0%) | 51 (81%) | 19 (30%) | 7 (11%) |

Read: D3 (one light direction) fails nine in ten of the tiles he bought: a top-down slab has no light to read. D4
fails a third to a half of his tiles. D2 fails the kit only because a whole piece (515 x 364, about sixteen of his
tiles) is counted against the colour band of ONE of his tiles; cut to his tile size it passes 63 of 63. At his tile
size the kit fails D3 and D4 LESS often than his own tiles do. The ruler, not the art, is what culls the ground.

## ROUTED
- PLUMBER [the ground ruler]: for class tile, judge D2 and D5 per pack-tile cell, hold D3 and D4 to the ground
  packs' band. Until then every ground sheet is culled by a test his own tiles fail. (NOTE in PLUMBER's section.)
- COMBAT TWO [two layout seams]: findings 1 and 2 (their layout). (NOTE in COMBAT TWO's section.)
- DIRECTION: the rule-87 pass this row asked for, on the sheet as it stands.
- The row stays CLAIMED: it registers the round the ruler is fixed or the kit passes it.
