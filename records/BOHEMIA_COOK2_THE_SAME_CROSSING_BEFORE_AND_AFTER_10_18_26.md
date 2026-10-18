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

## ROUTED
- COMBAT TWO: findings 1 and 2 (their layout).
- DIRECTION: the rule-87 pass this row asked for; the sheet is in VOTE as a candidate, as every cook round is
  since rule 112.
