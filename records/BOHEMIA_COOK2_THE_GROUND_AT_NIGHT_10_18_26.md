# COOK TWO -- [the ground at night from the packs] round one -- 10/18 (cook2-b27d, Opus 5.5)

The row: the street kit's night variant from the same pack tiles under COMBAT's night pass, the lamp pools from the
pack's lamps, nothing redrawn (rule 73: night is a colour; rule 82a: his packs are the source). DIRECTION first,
then VOTE.

## WHY THIS ROUND (the board)
The gate that held [the same crossing before and after] is not fixed on main: NOT VIBE CODED's thresholds and N3
have not changed since my hold (last touch 4c8eb73, before it). So the crossing stays out of VOTE and this round
runs the next OPEN row.

## HOW THE PACK DOES NIGHT (the study line, rule 100c)
His packs hold NO night tiles: 0 tiles in the corpus carry a night variant (CORPUS.json, every family). What they
do hold is his LAMP family (47 tiles judged UP 7/13, pack 18: seven street lamps, lanterns, barrels): every lamp
draws its own glass as its brightest cluster, warm (median bulb RGB in the json), and casts nothing on the ground.
So the night has to be made from his colours, not found. His road tiles' own shadows lean WARM (hue 28.9 deg,
measured over the darkest quarter of 280 road tiles), so the moon's blue is COMBAT's (their tint 185,198,240 is
222 deg), held to a capped shift so a warm roof never swings round the wheel to magenta (my first pass did; fixed).

## HOW IT WAS MADE (nothing drawn)
- The same window as the crossing sheet: block_corner_0 (the board COMBAT TWO laid from my kit), 1240 x 1000 at 1:1.
- ONE colour map: luminance kept to 0.60 of the day (the fight's floor is 'never under half'), colour down to half,
  the hue moved toward the moon by at most 22 deg in the darks and 9 deg in the lights (a ramp that shifts hue,
  tell 6, not one that only darkens).
- EVERY colour the night lands on is then SNAPPED to the nearest colour that already exists in his bought road,
  ground and lamp tiles (Lab distance). 1,017 colours used, 0 not his; each listed with the tile it came from in
  records/target/COOK2_THE_GROUND_AT_NIGHT_PALETTE.json.
- The lamps: HIS street lamp (pack 18 no. 000) at its own pixels (56 x 96, one pixel size), foot at each of the
  crossing's four walk corners. The pool is COMBAT TWO's 7 m, an ellipse on the 45 degree ground; inside it the
  day's ground comes back lifted (1-(1-c)^2.4, so the darks rise most and the lights compress, never clip), his
  bulb's colour screened in at a tenth, snapped to his colours again. The pool's edge is an ordered 4 x 4 dither
  over its outer quarter: zero half-transparent pixels. The lamp's body takes the night; its glass stays lit.
- Beside it on the sheet, for the judge: the night the fight draws NOW (BOHEMIA_FIGHT.html nightPass: a third to
  grey, the moon multiplied) on the same window. Under it: his lamp, his first road tile by day, the same tile by
  this night, all at their own pixels.

## MEASURED (records/target/COOK2_THE_GROUND_AT_NIGHT.json)
| | night luminance / day | pool / dark | colours not his |
|---|---|---|---|
| the night the fight draws now | 0.778 | (pools drawn live) | n/a (a multiply) |
| this night, from his packs | 0.572 | 3.00 (the floor is 3) | 0 of 1,017 |

## THE CULL, BY THE SAME HELD RULER (rule 114b)
The night cut to his tile size (56 cells of 88 px across the crossing), held as class tile against the ground band:
D1 0 fail, D2 0 fail, D5 0 fail, **D3 49 of 56 (88%), D4 21 of 56 (38%)**; 4 pass all five. His own bought tiles
fail the same two: D3 92% of his road, D4 44% (records/target/COOK2_THE_GROUND_AGAINST_THE_CULL.json). So this
sheet would be held exactly like the crossing, by a ruler his tiles fail; it is NOT registered. It goes to
DIRECTION for the rule-87 pass now and registers the round PLUMBER's [the ground ruler] lands.

## FIVE TELLS (by hand)
One pixel size (the board and his lamp at their own pixels); one palette (his, file named); one light (the moon
from above, the four lamps warm at their feet, no second direction); no straight darkening (hue shifts per ramp,
then his colours); rest areas are the dark asphalt between the pools.

## WEAK, BY EYE AT 1:1
- The pool on the pale walk slab near each lamp goes cream: the slab is his lightest colour and compresses to near
  white. A lower curve on the lightest band, next round.
- His lamp at its own pixels is 2.2 m at the board's 42.9 px a metre: small beside a house. The pack drew every
  prop in one 96 px box (COMBAT TWO's finding); a taller lamp is the rig's (rule 115a: props go through the rig).
- The 1 px tan line at row 770 (COMBAT TWO's layout, routed 10/18) shows on both halves.

Files: tools/bohemia_cook2_the_ground_at_night_10_18_26.py (about 20 s), records/target/COOK2_THE_GROUND_AT_NIGHT.png
(the sheet), _CROSSING.png (the night window), _CELL_00 to _55.png (the cells the cull reads), _PALETTE.json, .json.
Nothing to slices/ (rule 100).
