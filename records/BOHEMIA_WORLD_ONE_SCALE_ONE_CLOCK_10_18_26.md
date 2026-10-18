# WORLD: ONE SCALE, ONE CLOCK (10/18/26, world lane, the new age, rules 112 to 116)

Row: [the region] (SHIPPED 10/17, c6df0bd2), the coordinator's wave of sweep AM: "ECONOMY reads the
far towns as about four times too close (caa5e878): settle one scale number with RUN in the record
before FACTIONS and QUESTS build further on it." This page is that number. It supersedes the scale
paragraph of records/BOHEMIA_WORLD_THE_REGION_IS_REAL_GEOGRAPHY_10_17_26.md (333 m a block, an
eight-hour day); everything else on that page stands.

## 1. THE NUMBER

**ONE MAP BLOCK IS 96 METRES ON THE GLASS AND 384 METRES OF THE REAL LAS VEGAS. 1 TO 4.**

It was already law. laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md (Paolo 7/6, LOCKED): "Valley span
= 96 x 96m = ~5.7 miles across = Los Santos scale, a 1:4 linear compression of the real 22.9 mi valley
(GTA's exact proven ratio)." 22.9 miles is 36.85 km; over 96 blocks that is 384 m of real ground a
block. Nobody had to pick it. Three lanes had each picked a different one because nobody read it:

| who | what they used | where it came from | what it made |
|---|---|---|---|
| the 7/6 law | 96 m drawn, 384 m real (1:4) | Paolo, GTA's ratio | the valley, 96 x 96 |
| RUN 10/16 (slices/bohemia_region.js TOWNS) | no one number: 195 to 383 m a block | each town placed by eye on its bearing | Henderson 201 m, Boulder City 197, the dam 195, Jean 278, Primm 283, Pahrump 329, Moapa 383 |
| WORLD 10/17 (this lane) | 333 m | the 5.73 miles read against a 32 km valley | a 165 km region, Henderson just outside the valley |
| ECONOMY 10/17 (day 68, 3c) | 96 m | the drawn metre read as the real metre | "the region is 48 km, the towns four times too close" |

ECONOMY's "four times" IS the 1:4. It read the drawn metre as the real one. RUN's near towns really
were too close (about half the one scale) and its far ones about right, which is why the error
looked like it was everywhere and nowhere.

## 2. THE CLOCK (ONE, THE VALLEY'S)

The 10/17 file ran its own clock: real walking speeds (5 km/h on a road) over an eight-hour marching
day. RUN's region and the valley run another: the street's own minutes (MIN_PER_CELL 0.084 a fine
cell x FN 128 = 10.75 an open block, PAVED_SPEED.factor 0.5 on a road, RUN's 1.8 on rough ground)
over the game's 1,440-minute day. Two clocks for one walk is two answers for one trip. The valley's
clock wins: it is what the party is actually charged, it is older, and its own comment says THE
BASELINE DOES NOT MOVE. The data file now carries those minutes exactly, and the gate reads them
out of the alpha and RUN's file so they cannot drift apart.

| ground | factor | minutes a block | real-ground pace it implies | a day |
|---|---|---|---|---|
| a road (freeway, state route, dirt track), the valley's streets | 0.5 | 5.38 | 4.3 km/h | 268 blocks, 103 km |
| open desert, a town's blocks past the rim | 1.0 | 10.75 | 2.1 km/h | 134 blocks, 51 km |
| hills, a wash | 1.8 | 19.35 | 1.2 km/h | 74 blocks, 29 km |

Read at the real scale the clock is a man walking a normal pace who never stops to sleep. That is the
compression, said plainly: the kilometres are Las Vegas's, the days are Battle Brothers'. Battle
Brothers does the same (time runs while the company moves, nobody marches eight hours and camps).

The dirt track is charged as a road and the wash as a slope because RUN charges a region block by
its pass code only (0 open, 1 road, 2 rough). The finer ladder (a dirt track slower than tarmac, a
wash kinder than a hillside; FM 21-18 and Naismith, the 10/17 numbers) is TUNING's row, one table,
rule 38g; it is not a second clock in this file.

## 3. WHAT THE ONE NUMBER GIVES

- The region: 496 blocks, **190 km** across (was 165).
- **A crossing: 3.05 days** rim to rim on the 15, **3.38** from the 95 north-west to the 93 at Arizona.
  Battle Brothers: **2 to 4 days** (EYES 10/17, players' reports, no official figure). Inside the band.
  The 10/17 cut's 6.8 days was the eight-hour day, not the map.
- **Henderson is inside the valley** (20 km from Sahara and the 15, x 91 y 74 of the 96). That is the
  7/6 law: the overmap is the whole valley. It is now listed in the data's `inValley`, for the roll to
  seat as a district; the region no longer drags it out to the rim.
- 34 places past the rim, every one on standable ground within two blocks of its real coordinates.
  On foot from the valley's middle: Sloan 5.8 h, Red Rock 6.3, Lake Las Vegas 6.4, Boulder City
  11.4, the dam 14.3, Primm 18.2, Indian Springs 22.0, Searchlight 23.5, Pahrump 24.9 (1.04 days),
  Moapa 26.1, Mercury 30.9 (1.29 days). Past the rim by the road on: Mesquite 1.7 days, Baker 1.5,
  Kingman 2.0, Barstow 2.4, Tonopah 3.2.
- Six road ends that stopped short of the rim at the larger scale (the 15 south, the 95 both ways,
  the 93 to Kingman, NV-160, the Mercury highway) now run on along their real line to the edge.

## 4. FOR RUN (rule 12: findings, acted on, not waited on; RUN's file is RUN's)

- The hand-placed TOWNS list in slices/bohemia_region.js is the one thing on main still off the
  number. `BohemiaRegionLand.load(json).places(compass)` hands back the 34 places at 384 m in RUN's
  own coordinates and mirrors the compass; `passGrid(compass)` is RUN's R.pass in RUN's codes. The
  gate prints the twelve towns' metres a block every run as a finding (never a red in RUN's file) and
  turns into a check the round RUN reads the land.
- Nothing about RUN's clock changes: the data now charges what RUN charges.
- R.numbers().bbDaysAcross can read 2 to 4 from the data's `numbers.battleBrothers.daysAcross`.

## 5. FOR ECONOMY, FACTIONS, QUESTS

- ECONOMY day 68: the per-day prices hold (the page said so); the days are now these. "The real
  Mesquite is 7.6 days at 17.1 km a day" read the drawn kilometre: at the one scale and the one clock
  Mesquite is 1.7 days, Pahrump 1.04, Primm 0.76.
- FACTIONS and QUESTS: build distances on `metresPerCell` 384 and the hours in the data file. A
  "far town" is a day out, a "far trip" is two to three, and Henderson is the valley's.

## 6. THE GATE

THE REGION IS REAL GEOGRAPHY, now 60 checks, 0 red. New: A3 (one scale, 384 real, 96 drawn, 1:4,
citing the 7/6 law), A5 (one clock, MIN_PER_CELL), F9 (a place listed inside the valley is in its
box), G3 (the nearest region place a few hours out, Henderson in the valley), H4 (a crossing inside
Battle Brothers' 2 to 4 days), N1 to N3 (an open, road and rough block cost what the alpha and RUN
charge, read out of their files), N4 (RUN's towns against the scale: a printed finding until RUN
reads the land).

## 7. NOT DONE, SAID PLAINLY

Nothing drawn, nothing in the demo, no VOTE item (rule 88's hold stands on this lane; RUN paints the
map). RUN's TOWNS list still sits at its own distances until RUN swaps it. The finer speed ladder is
TUNING's. The real coordinates are good to about a kilometre.

[bb school line] Battle Brothers never says how many kilometres its map is, and no player ever asked:
what a player measures is days, and its world is crossed in two to four of them. Ours now says both,
and the days are what we copied.

[analog horror line] The road sign still says PAHRUMP 60 in miles nobody uses any more; the only
measure left that means anything is how many nights you sleep out before you see it.
