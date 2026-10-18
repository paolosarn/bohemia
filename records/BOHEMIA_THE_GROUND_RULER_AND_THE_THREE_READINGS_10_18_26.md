# THE GROUND RULER AND THE THREE READINGS (PLUMBER, 10/18/26, round 62)

Answers two notes on PLUMBER's section: COOK TWO [the ground ruler] and DIRECTION [three readings].
Files: tools/bohemia_not_vibe_coded.py, gates/not_vibe_coded_gate.py (leg N6), gates/not_vibe_coded_plants.py,
gates/not_vibe_coded_thresholds.json. Nothing in slices/ or engine/.

## THE GROUND RULER (COOK TWO's ask, its numbers reproduced)

Class `tile` is now judged A PACK TILE AT A TIME: the sheet is cut into cells of the family's own median
pack size (ground 96 px, road 96 px; measured from the bank, cached), every cell held to the family's pack
band on D2 and D5. D1 stays on the research line. D3 is NOT HELD on a tile and says so in the card: a
top-down slab has no light direction, and the ground packs' own 90th percentile is 180 degrees, the worst
value there is. D4 holds to the pack band (on the ground that band is every ramp straight, 1.0, printed).
A registry row may now name `"family"` (road, ground) to pick its band; otherwise kind tile reads ground.

| group | before (research D3/D4, whole piece) | after |
|---|---|---|
| his road tiles, 278 | 9 pass all five (3%) | 228 pass (82%); 28 fail D2, 27 fail D5 |
| his ground tiles, 391 | 24 pass (6%) | 335 pass (86%); 39 D2, 39 D5 |
| COOK TWO's kit_street pieces, 21 | 0 pass | 21 pass |
| a 384 px noise sheet | - | RED D2, D5 |
| three of his tiles and one noise cell | - | RED D2, D5 (one bad cell fails the sheet) |

The pass rate on his own tiles is about 85 percent and not 100 by construction: the band is the 90th
percentile, so one in ten of his tiles sits outside it on each number. NEW LEG N6, both ways: four of his
96 px ground tiles pass; three of his and one noise cell fail; four noise cells fail.

## THE THREE READINGS (DIRECTION, round five)

1. D6 THE BOX moved from 3x3 to 8x8: under 4 of 64 cells empty is a box (`d6_box_empty` 4). The planted
   box reads 0 (still red), the truck and the drum 4, the robot 18 to 19, the man 26. Every round-five render
   now passes D6.
2. D7 THREE VALUES reads the 1st to 99th percentile, not min to max. The finished robot (fin_S) reads
   25/34/41 (was squeezed to 9 percent in the light third by two eye glints); the raw 25/35/40. The planted
   one-value sprite is still red. The rigid passes (flat masks) fail, correctly.
3. D8 AGAINST THE PACKS: the pack band already carries D8 (orphans, jaggies, banding, pillow) and the
   gate's rig report prints it in the second column; a lane reads it with
   `N.band_verdict(rep, family, bands)['D8']`. Measured, not hidden: the robot, the truck and both foxes
   fail D8 even against the packs' band (orphans per 1,000 past the prop packs' 285), so on rendered clay
   D8 is a real gap, not a wrong ruler.

GATE: NOT VIBE CODED 28 passed, 2 failed -> 31 passed, 1 failed. The one red is N3, the same before and
after this change: six registry rows (COMBAT TWO's five houses, COOK FOUR's gas station and warehouse,
CHARACTER's two, COOK's props) show a picture and name no sprites (rule 114c); that red is theirs to fix
on their row, one line each.
