# COOK TWO, THE BIG SWING (rule 110): A WHOLE VEGAS BLOCK OF GROUND FROM HIS TILES (10/17)
Paolo 10/16: '24 hours, take big swings, I can't check in every three minutes.' The MODE line's swing: a whole
Vegas block of ground from his tiles (four streets, sidewalks, curbs, markings, the 47 corners) on one sheet
beside the tiles as bought. Run to the end, no check-in, no question to him. Cook only (rule 100): records/ only.

## WHAT IS ON THE SHEET (records/target/COOK2_THE_VEGAS_BLOCK.png, 2,644 x 1,502)
- LEFT: his pack as bought, laid on the same 16 x 16 plan with the frames on: a grid of framed cards; his zebra
  tile only fits across the north-south streets, his orange line only fits one row of the east-west streets.
- RIGHT: the same tiles, cut and laid as ONE block of Las Vegas, 1,312 x 1,296 px at one art pixel to one pixel:
  four streets round a block, a parking lot inside the sidewalk ring with a driveway, every corner curbed.
- BELOW: the fifteen tiles it is made of, as bought, with their pack ids.

## HOW (tools/bohemia_cook2_the_vegas_block_10_17_26.py, the recipes of tools/bohemia_cook2_stretch_the_pack.py; nothing drawn, rule 108)
1. THE GROUND: his road tiles and his slabs, frame cut by the study page's numbers, padded, left-right flips only,
   never rotated, never flipped top-down (the light stays on top). Three of his painted slabs placed where a real
   sidewalk has them: the hazard stripes (slab 8 and 17) either side of the driveway, the manhole slab (40).
2. THE SIDEWALK AND THE CURB: a cell mask rounded the 47 way (blur and threshold, 6 px), so every corner, convex
   and concave, is a curb return; the curb is his slab's own 7-row south face where the walk edge faces the eye,
   the lit lip round every edge, 3 px of his darkest road as the shadow. The driveway is a gap in the ring, so
   the curb returns on both sides of it by the same rule. 16 corner returns on the sheet; every one connects.
3. THE PAINT IS A LAYER: the zebra bars (street 15, 16, 17), the orange double line (18 to 22, 26) and one solid
   white line (the left line of 14) are LIFTED off his tiles by colour (white: brighter than any asphalt pixel,
   p99 372 of 765; orange: red over blue by 60) and laid along each street at the angle the street runs. Only
   the flat paint turns a quarter; the asphalt under it never does. The white line is cut into 3 m dashes with
   9 m gaps (the US lane dash) at the quarter lines of the two wide streets, and into 4.5 m stall lines on the
   lot. The orange centre line breaks at every intersection box. Sixteen zebras, one per approach.
4. HIS CARS AND HIS PROPS, placed (rule 82a): five of his top-down cars (pack 10) nosed north or south so none is
   rotated (two in stalls, three abandoned in the lanes); fourteen of his street props (pack 15): two lamps, a
   hydrant, a bin, two cones at the driveway, a barricade, a meter, a tyre, a sack, a bench, two manholes, a drain.
5. DECALS, darken-only: his broken road's cracks (29 to 33, 27, 28) seeded on the road; his burnt ground (pack 8)
   as a scorch on the lot and one on the south street. A catch this round: a transparent pixel is RGB 0 in his
   file, which darken-only read as black and printed a dark square; the recipe now whitens the transparent
   pixels first (fixed in this tool, the shared recipe untouched).

## MEASURED (records/BOHEMIA_COOK2_THE_VEGAS_BLOCK_10_17_26.json)
- 62 of 62 whole untouched cells inside the family's own saturation and grain range; 0 outside; 194 cells
  skipped as mixed (a curb or an edge runs through them) or painted or under a prop.
- The seams (rule 104b): dark pixels along the cell seams 13.2%, inside the cells 24.4%: the seam is LESS dark
  than the tile's own cracks, so no eye finds a grid.
- Scale: 30 px a metre (the sidewalk study page); a wide street 4 cells = 10.9 m, a side street 3 cells = 8.2 m,
  the sidewalk 1 cell = 2.7 m, a lane dash 3 m with a 9 m gap.

## THE THREE BIGGEST DIFFERENCES FROM THE TWIN
1. NO GRID: the frames cut, the seam darker than nothing; as bought it is 256 framed cards.
2. THE PAINT RUNS WITH THE STREET: lifted as a layer, laid along every street and across every approach; as
   bought the paint only goes where a whole tile fits, in one direction.
3. THE CURB STANDS UP AT EVERY CORNER AND THE DRIVEWAY: his slab's own south face; the pack holds no curb, no
   corner, no return.

## HONEST
- The lane dashes are his thin worn white line and read faint at 1:1; the stall lines read. If DIRECTION wants
  them louder, the next version lays the dash twice.
- The lot is bare asphalt; the houses on the block are COOK FOUR's, the board layout is COMBAT TWO's.
- The orange line's colour is his, not recoloured; the faction recolour (round three) applies on top if a street
  is claimed.
- Nothing is final before his moodboard (rule 108 ROUND THIRTEEN). In VOTE as cook2-the-vegas-block-10-17.

## ROUTED
- COMBAT TWO: the method lays any plan (plan[] is the only input); when he says FINAL on the family the tool's
  cell(), the mask rule and the paint layers become the kit, keyed to (pack, index).
- DIRECTION: the rule-87 pass before VOTE; the twin is on the sheet.
- The coordinator: [the cars and the props from the packs] has its first placed set on this sheet; the one-at-a-time
  patrol car sheet is still owed by its row.
