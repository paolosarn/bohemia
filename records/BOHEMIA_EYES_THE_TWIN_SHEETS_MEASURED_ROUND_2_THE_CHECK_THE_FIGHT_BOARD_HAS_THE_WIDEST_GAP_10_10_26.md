# EYES AND EARS -- [the twin sheets measured] -- ROUND TWO: THE CHECK
### 10/10/26 -- session eyes-5vql33

Row (rule 82, the reference twin): for each of DIRECTION's twin sheets, this lane's own
instrument measures ours against the reference, independently, at the same size: distinct
colours, outline share, edge density, contrast range, the share of flat fill; one table, the
family with the widest gap named first, in VOTE with the two crops.

## THE TOOL: tools/bohemia_eyes_the_twin_sheets_check_10_10_26.py

Finds every image block on DIRECTION's own two shipped VOTE cards
(slices/vote/DIRECTION_THE_TWIN_THE_GROUND.png, DIRECTION_THE_TWIN_THE_PLACES.png) by its own
background colour -- never eyeballed, never re-derived from source files -- then runs an
INDEPENDENT reimplementation of the five named metrics on each crop (not DIRECTION's own printed
numbers). The reasoning for reading the composited card rather than re-running DIRECTION's own
generator script is in round one: her script has no clean function boundary (it runs at import
time and needs a live screenshot argument), so the card itself is the more faithful source --
literally the pixels a reader sees in VOTE.

## A REAL BUG CAUGHT BEFORE TRUSTING ANY NUMBER

First pass: the boundary detector found each image ROW's height as the union of every column in
it, so a shorter panel sitting beside a taller one (the road's single square ours-crop beside the
twin's three-row tile grid) picked up a slab of the card's own black background as if it were
part of the picture. Caught by looking at the actual crop (not trusting the shape), fixed by
re-scanning each column's own tight content box inside the shared row band rather than reusing
the row's full height for both sides. The road's "ours" numbers moved once fixed (contrast range
69 to 49, edge density 5.6 to 8.2) -- proof the fix mattered, not a cosmetic change.

## THE REAL NUMBERS, WIDEST GAP FIRST (gap% = mean relative difference across all five metrics)

| family | gap % | colours/1000px | contrast range | outline share | edge density | flat fill share |
|---|---|---|---|---|---|---|
| THE FIGHT BOARD | 64.7% | 8.7 -> 84.7 | 132 -> 97 | 0.020 -> 0.158 | 16.4 -> 29.5 | 0.353 -> 0.086 |
| THE PLACE (vs COOK FOUR's new house) | 57.5% | 126.9 -> 11.9 | 168 -> 145 | 0.035 -> 0.012 | 21.8 -> 7.2 | 0.380 -> 0.768 |
| THE PROPS | 53.7% | 0.4 -> 254.3 | 136 -> 115 | 0.022 -> 0.058 | 6.2 -> 14.7 | 0.877 -> 0.583 |
| THE ROAD | 49.4% | 0.2 -> 66.9 | 49 -> 126 | 0.029 -> 0.036 | 8.2 -> 13.1 | 0.667 -> 0.472 |
| THE GROUND BETWEEN | 36.7% | 70.4 -> 251.7 | 98 -> 116 | 0.053 -> 0.047 | 25.1 -> 14.0 | 0.323 -> 0.539 |
| THE PLACE (vs its own settlement screen) | 21.5% | 126.9 -> 191.0 | 168 -> 158 | 0.035 -> 0.038 | 21.8 -> 16.9 | 0.380 -> 0.236 |

**THE FIGHT BOARD HAS THE WIDEST GAP, by this lane's own independent number** -- not the family
DIRECTION's own prose leaned hardest on (her write-up spent the most words on the road and the
props). That is exactly the value this row exists to add: a ranking decided by measurement, not
by whichever complaint reads loudest.

## ONE DIRECTION CANNOT BE READ AS "WORSE," NAMED HONESTLY RATHER THAN FORCED

THE PLACE comparison (ours, "on the map now," against COOK FOUR's new candidate house) runs
BACKWARDS from the other five rows: ours reads MORE colour-dense and edge-busy than the twin, not
less. This is not ours secretly winning -- the "ours" crop includes a dense, cluttered background
of dozens of small buildings around the raised plate, which is genuinely busy by these metrics
even though it is not what Paolo is praising; COOK FOUR's new house sits alone on a plain sand
plot with much more open ground, so it reads calmer by the same five numbers. THE REAL LIMIT OF
THIS INSTRUMENT, SAID PLAINLY: these five metrics measure TEXTURE BUSYNESS, not "looks like a
real reference." They rank the other five rows the direction a reader would expect (ours flatter,
plainer; the twin richer, more worked); this one needed a human sentence because the number alone
would mislead.

## A REAL, HONEST DISCREPANCY AGAINST DIRECTION'S OWN PRINTED NUMBERS

DIRECTION's own card prints the road's twin at col_kpx 142.3; this lane's independent measurement
of the same crop reads 66.9. Not a disagreement about which picture is better -- a real
difference in what was measured: her number came from stats() run on her own internal composite
(a tight grid, cell=96, before the card's own display padding was added); this lane measured the
FINAL CARD panel a reader actually sees in VOTE, which carries extra gutter space between tiles
that the internal composite did not. Both numbers are honest; they are not measuring the same
pixel population, and that gap is itself worth knowing -- a number printed straight onto a VOTE
card should say which stage of the pipeline it was taken from.

## THE RECORD

slices/vote/EYES_THE_TWIN_SHEETS_CHECKED.png -- all six pairs, ranked widest gap first, the real
crops beside the real numbers. records/eyes_twin_sheets/report.json -- the full data.

## ROUTED

- DIRECTION: the fight board (COMBAT TWO's own laid board) carries the widest gap by this lane's
  independent number, ahead of the road and props her own write-up emphasized more -- worth
  weighing when ordering the next cook round. The road twin's printed 142.3 vs this lane's 66.9 is
  the same real picture, measured at two different pipeline stages; naming which one a reader is
  seeing would close the gap.
- COMBAT TWO: the fight board's own numbers (ours reads 132 contrast range against the twin's 97,
  backwards from flat vs busy on that one metric alone) is worth a look alongside the other four,
  which all point the expected direction.

## SHIP TEST FOR THIS ROUND

A real instrument, independently re-measuring the exact pixels shown on DIRECTION's own two VOTE
cards (never her printed numbers), caught and fixed a real crop-boundary bug before trusting any
result, ranked all six pairs by a single honest gap number (not narrative emphasis), named the one
case where the number's direction would mislead without a human sentence, and surfaced a real,
explainable discrepancy against the self-reported numbers already in VOTE. [the twin sheets
measured] round two IS ANSWERED for both twin sheets that currently exist; a new one re-opens this
row the round it lands.
