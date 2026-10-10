# THE CARD OF NUMBERS (DIRECTION 10/10/26, row [the floor on the card])

THE ONE CARD EVERY COOK READS BEFORE DRAWING. Every number is measured from his 1,927 purchased tiles that he judged UP
in the 7/13 sweep (reference/art_bank/CORPUS.json), family by family, never from our placeholders. Rule 105 (Paolo
10/10: 'look at the graphics we downloaded and see how many pixels they are; that is the floor, the minimum'), rule
100c (study first), rule 101 (one asset at a time, FINAL is his word), rule 104b (no borders), rule 104e (no roof tops),
rule 90 round 8 (the look is a number before it is a drawing).
Tool: tools/bohemia_direction_the_card_of_numbers.py (12 s over the whole bank). Numbers: records/target/DIRECTION_THE_CARD_OF_NUMBERS.json.
Picture (in VOTE): records/target/DIRECTION_THE_CARD_OF_NUMBERS.png, each family's tiles at one art pixel to one.
The formulas are COOK's (records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md), made alpha-aware: a sprite is read on its
own pixels and its outline at its own silhouette. COOK FOUR's places page (records/BOHEMIA_COOK4_HOW_THE_PACK_DID_IT_THE_PLACES_10_10_26.md)
agrees on every line it measured (3,597 colours, top +8.8, a dark outline on buildings, front gables).

## THE NUMBERS (medians over his tiles)
| | road | ground | marking | settlement | door | lamp | prop |
|---|---|---|---|---|---|---|---|
| tiles | 290 | 391 | 67 | 318 | 30 | 47 | 784 |
| size (median) | 95x96 | 95x88 | 96x82 | 92x92 | 96x89 | 58x96 | 93x91 |
| long side, floor (tenth) | 96 | 90 | 96 | 96 | 96 | 96 | 96 |
| smallest | 66x69 | 40x38 | 80x44 | 27x40 | 54x75 | 40x74 | 29x36 |
| colours a tile | 4520 | 3719 | 2971 | 3597 | 4415 | 3298 | 3730 |
| colours, fewest tenth | 2324 | 2573 | 2179 | 2126 | 3084 | 1913 | 2330 |
| top 8 colours carry | 5% | 4% | 9% | 6% | 7% | 4% | 7% |
| value span (5th to 95th) | 118 | 128 | 151 | 146 | 120 | 185 | 159 |
| mean value | 70 | 72 | 54 | 59 | 51 | 62 | 58 |
| saturation | 0.24 | 0.53 | 0.91 | 0.31 | 0.15 | 0.48 | 0.47 |
| warm (red over blue) | 93% | 91% | 91% | 90% | 83% | 88% | 88% |
| light: top minus bottom | +4.1 | +6.5 | +3.6 | +8.8 | +12.0 | +25.2 | +12.6 |
| light: left minus right | +0.3 | +4.3 | +1.4 | +1.9 | +0.1 | +11.0 | +6.5 |
| top half brighter in | 89% | 72% | 70% | 87% | 100% | 74% | 87% |
| edge minus inside | -5.6 | +0.1 | -1.1 | -26.3 | -45.0 | -5.8 | -5.2 |
| darker edge in | 53% | 38% | 34% | 84% | 97% | 55% | 53% |
| grain (px a 16-step run) | 1.85 | 1.59 | 1.96 | 1.56 | 1.68 | 1.58 | 1.74 |
| lone-pixel runs | 66% | 70% | 67% | 74% | 70% | 69% | 68% |

## THE NINE RULES THE NUMBERS SAY
1. **SIZE: THE PACK IS A 96-PIXEL WORLD.** Every family's long side is 96. A floor tile, a door, a wall piece, a lamp:
   96 on the long side. Nothing we make is smaller than its family (rule 105). A person stays the 112 box.
2. **COLOURS: A SURFACE, NOT A RAMP.** 3,000 to 4,500 distinct colours in one tile, and the top eight carry only 4 to 9%.
   A tile of ours with tens of colours, or one that puts most of itself on eight, is a different kind of object, and no
   better shape fixes that. The fewest tenth of his tiles still hold 1,900 to 3,100.
3. **VALUE: A WIDE SPAN, A DARK MIDDLE.** The 5th to 95th percentile spans 118 (road) to 185 (lamps); the mean sits
   at 51 to 72 of 255. His world is darker than ours and carries its own light inside each tile.
4. **SATURATION: LOW ON THE BUILT WORLD.** Doors 0.15, road 0.24, buildings 0.31; props 0.47; paint and blood (marking)
   0.91. 83 to 93% of every family's pixels lean warm (red over blue). Our analog horror vibrance-down (9/23) sits
   inside this: the colour lives on the things, never on the floor.
5. **LIGHT: FROM ABOVE, A LITTLE FROM THE LEFT.** The top half is brighter in 72 to 100% of tiles, by +4 on flat ground
   up to +13 on objects; left over right is near zero on the ground (+0.3) and small on things (+2 to +6.5). A floor tile
   carries no corner shadow of its own; the scene lights it.
6. **OUTLINE, BY FAMILY.** Ground, road and markings: NONE (edge -5.6 to +0.1; a surface just ends). Props and lamps:
   SOFT, a last ring about 5 darker, never a black line. Buildings: a dark brown 1 px line (-26, in 84%). Doors: a hard
   frame (-45, in 97%). A black outline round anything is not his.
7. **GRAIN: FINE AND CLUSTERED.** A 16-step value holds 1.6 to 2.0 px along a row; two-thirds of runs are one pixel.
   Never a flat fill, never a checkerboard dither on top: the grain is in the surface.
8. **SEAMS: NONE YOU CAN SEE.** His road slabs do not tile as bought (COOK: the joint is 2.0 times the inside, 22% meet);
   his history (rule 104b) is that the borders were cut to make it seamless, and seamless is the law: cut the border, make
   the edge meet. His wall tiles already meet (the joint 0.44 of the inside, all of them).
9. **ROOFS: FRONT GABLES, NEVER A ROOF PLAN** (rule 104e, COOK FOUR's page): the slopes seen edge-on from the front.

## THE JUDGE (any cook, before a FINAL? sheet reaches DIRECTION)
`python3 tools/bohemia_direction_the_card_of_numbers.py --judge <candidate.png> <family>` prints eight rows: long side
against the floor, colours against the pack's fewest tenth, the top eight against the pack's ninetieth, value span
against its tenth, saturation against its ninetieth, light against its tenth, the edge inside the family's band,
the grain against its ninetieth. THREE OR MORE OUT: BACK before VOTE.
CALIBRATED ON HIS OWN TILES (every fifth tile, 190): 18 come back (9%): road 5 of 40, ground 8 of 40 (the family mixes
water, grass, trees and barrels, so it is the loosest), settlement 4 of 40, prop 1 of 40, marking, door and lamp none.
ON OUR PLACEHOLDERS: the fight's barrier (cover_jersey) is 4 of 8 out (10 colours against 2,330; the top eight carry 99%);
the trailer is 3 of 8 out. The judge is a floor, not a verdict: passing it gets a sheet to DIRECTION's eye, never to FINAL.

## WHERE THE CARD AND THE COOKS' PAGES DIFFER, AND WHY
- COOK's road page reads the value span as 255 (over the palette's extremes); this card reads the 5th to 95th
  percentile (118), which ignores the few brightest and darkest pixels. Both are true; the card's is the judge's.
- COOK's road edge is +15 on the tile's frame; this card's is -5.6 at the silhouette (most road tiles have cut corners
  that are transparent). Both say NO DARK OUTLINE on a floor.

## OWNERS
Every cook reads this before drawing, and every study page (rule 100c) cites the family's line. PLUMBER [the pixel
floor] may take the judge's first row as its gate; the other seven are DIRECTION's to rule on. DIRECTION re-runs the
card when the bank grows (a new purchased family gets a column).
