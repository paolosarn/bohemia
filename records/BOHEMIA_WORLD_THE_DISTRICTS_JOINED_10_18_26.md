# WORLD: THE DISTRICTS, JOINED (10/18/26, world lane, the new age, rules 112 to 117)

Row: [the districts as data, joined] (WHERE-ONE-DISTRICT-MEETS-THE-NEXT). His words on the map, 10/18: 'the districts
are looking like shit, the streets looking like shit, doesn't look like shit's connected that smart like it should.'
PURPOSE: RUN can only join the streets if the region data says where every district ends and which road crosses
each edge. Data only; nothing drawn; NOT IN A TAB (RUN draws it).

## 1. WHAT LANDED

The region file RUN already loads, engine/BOHEMIA_REGION_LAND.json, now says, for every one of its 246,016 blocks,
**which real district of the Las Vegas region it is in**, and, for every real road, **every place it crosses a
district line, with the road's real local name on each side**, and **what each road end really stops at**. RUN reads
it through the loader it already uses (engine/bohemia_region_land.js): `districtAt`, `districtSides` (which sides of a
block a line runs along, for drawing the border), `lineCrossings`, `roadEnds`, `districts`, all in the valley's own
compass (x mirrors when the 15 runs east of the Strip; y never does). No new fetch, no new file.

**26 districts. 36 crossings. 58 road ends, 0 that stop at nothing.**

## 2. THE DISTRICTS (real places; one piece each; every block in one)

| | district | kind | km2 | seat | places in it | roads |
|---|---|---|---|---|---|---|
| A | LAS VEGAS VALLEY | city | 2,720 | (the roll's) | Lake Las Vegas, Sloan, Tule Springs, Gypsum Cave | 13 |
| B | RED ROCK | basin | 55 | Red Rock | Blue Diamond, Red Rock | 2 |
| C | THE SPRING MOUNTAINS | range | 1,934 | Mt Charleston Lodge | the lodge | 5 |
| D | PAHRUMP VALLEY | basin | 1,732 | Pahrump | Pahrump | 1 |
| E | GOODSPRINGS VALLEY | basin | 211 | Goodsprings | Goodsprings | 2 |
| F | SANDY VALLEY | basin | 225 | Sandy Valley | Sandy Valley | 1 |
| G | THE IVANPAH VALLEY | basin | 666 | Primm | Jean, Primm, Ivanpah Solar | 2 |
| H | THE MCCULLOUGH RANGE | range | 792 | | | 0 |
| I | THE ELDORADO VALLEY | basin | 541 | Boulder City | Boulder City, Railroad Pass, Eldorado Solar | 6 |
| J | ELDORADO CANYON | basin | 293 | Nelson | Nelson | 2 |
| K | SEARCHLIGHT | basin | 1,612 | Searchlight | Searchlight | 1 |
| L | LAKE MEAD | lake | 1,426 | Hoover Dam | the dam, Boulder Beach, Las Vegas Bay, the Intake | 6 |
| M | THE OVERTON ARM | lake | 498 | Echo Bay | Echo Bay | 1 |
| N | ARIZONA | beyond | 4,568 | | | 1 |
| O | THE MUDDY MOUNTAINS | range | 696 | | | 2 |
| P | VALLEY OF FIRE | basin | 579 | Valley of Fire | Valley of Fire | 3 |
| Q | THE MOAPA VALLEY | basin | 1,647 | Moapa | Moapa, Glendale, Overton | 3 |
| R | THE VIRGIN RIVER | beyond | 1,366 | | | 1 |
| S | GARNET VALLEY | basin | 1,022 | Apex | Apex, the landfill | 3 |
| T | THE SHEEP RANGE | range | 1,220 | Corn Creek | Corn Creek, Gass Peak | 2 |
| U | COYOTE SPRING VALLEY | basin | 1,852 | | | 0 |
| V | INDIAN SPRINGS VALLEY | basin | 701 | Indian Springs | Indian Springs, Creech | 4 |
| W | THE DESERT RANGE | range | 1,083 | | | 0 |
| X | THE PROVING GROUND | beyond | 2,482 | Mercury | Mercury | 2 |
| Y | THE AMARGOSA | beyond | 749 | | | 1 |
| Z | CALIFORNIA | beyond | 5,606 | | | 1 |

The valley's box (96 x 96) is the Las Vegas Valley, whole; inside it the roll seats its own districts (rule 40g), so
Henderson and the Strip are the roll's, never this file's.

## 3. HOW THE LINES WERE CUT (the how was mine; the reason it is real)

The Las Vegas region is basin and range: flat valleys walled by mountains, the towns in the valleys. So each district
grows outward from real points (its towns, its dry lake, its range's spine) by the cost of walking the ground, and the
cost depends on what the district is: **a basin spreads over the flats and slows at the hills; a range spreads over the
hills and slows at the flats; a lake over its water and shore.** Roads are ignored on purpose: a road would drag a
district down its length. Where two districts meet is where the ground changes, so the lines fall on the ridges and
at the foot of the mountains, the way Nevada's real hydrographic basins are cut on their divides. Measured: the lines
between districts of the ground sit on rough ground (a ridge, a wash, the water) **35 percent** of their length against
**21 percent** for the region as a whole.

Two rules that are law, not ground: **the California line is the real survey line** (Lake Tahoe to the Colorado at
35.0019 N), block for block, through Primm; and **a road running along a ridge crosses it once** (a dip of under ten
blocks into the next district is given back), so no road zigzags along a line. Every district is one piece.

## 4. THE CROSSINGS: EVERY ROAD THAT LEAVES ONE DISTRICT NAMES THE ROAD IT ENTERS

36 crossings, every one two-sided (the near block in the district it leaves, the far one in the one it enters, both
road) and named on both sides. The ones where the name really changes:

| road | from | to | the name it leaves on | the name it enters on |
|---|---|---|---|---|
| NV-160 | the Spring Mountains | Pahrump Valley | Blue Diamond Rd | Pahrump Valley Hwy |
| NV-159 | Las Vegas Valley | Red Rock | W Charleston Blvd | Red Rock Canyon Rd |
| NV-147 | Las Vegas Valley | Lake Mead | Lake Mead Blvd | Northshore Rd (NV-167) |
| NV-147 | Valley of Fire | the Moapa Valley | Northshore Rd (NV-167) | Moapa Valley Blvd (NV-169) |
| NV-564 | Las Vegas Valley | Lake Mead | Lake Mead Pkwy | Lakeshore Rd (NV-166) |
| old US-93 | the Eldorado Valley | Lake Mead | Nevada Way (US-93 Business) | Hoover Dam Access Rd (NV-172) |
| I-11 | Lake Mead | Arizona | I-11 | US-93 |
| NV-161 | Goodsprings Valley | Sandy Valley | Goodsprings Rd | Sandy Valley Rd |
| NV-165 | the Eldorado Valley | Eldorado Canyon | Nelson Rd | Eldorado Canyon Rd |

The rest keep their name across the line (I-15 south from the valley into the Ivanpah Valley and on into California;
I-15 north through Garnet Valley and the Moapa Valley to the Virgin River; US-95 north-west into Indian Springs and on
to the Proving Ground; US-95 south through Eldorado Canyon to Searchlight; Kyle and Lee Canyon roads up into the
Spring Mountains; the dirt tracks). The names are draft:true (WORDS may restyle them); the routes are real.

## 5. THE ENDS: NO ROAD STOPS AT NOTHING

58 ends: 6 at the region's rim (the road goes on; the beyond list says to where), 12 at the valley's box (the roll's own
streets take them; the loader stitches the rolled exits to these portals), 25 at a junction, 7 at a place, 8 at a
named gate (the test site's fence at Mercury, the dam's crest where old US-93 ends since the 2010 bypass, the top of
Kyle Canyon and of Lee Canyon, Deer Creek Road under the lodge, the drone base's gate, the Echo Bay marina at the water,
Moapa at the river). **0 breaks.** The gate checks each end against the land itself, not against the data's own label.

## 6. FOR RUN ([the districts connect on the map]; your file, not touched)

- `L.districtAt(x, y, compass)` per block: colour or label the region by district at the far stop.
- `L.districtSides(x, y, compass)`: the sides of a block where a line runs (null where the neighbour is the same
  district), so a border is drawn once per edge and reads the same from both blocks.
- `L.lineCrossings(compass)`: where a road crosses a line, the two blocks and both names: the place for a county
  sign, a fee booth, a name change on the road label.
- `L.roadEnds(compass)`: what each road stops at. The 12 valley ends are where your stitch joins the roll's exits.
- Inside the valley's box, the street joins are [the map's roads as one kit] (engine/bohemia_map_joins.js): 556
  junctions the map still draws with the straight picture.

## 7. [bb ...] HOW BATTLE BROTHERS DID IT (reference/library/battle_brothers/01_WORLDMAP.md)

Battle Brothers' map is rolled per campaign, with roads between its settlements, mountains impassable, travel fastest on
roads, and three noble houses each holding a third of the settlements. Ours does not roll the land (rule 40g: Las Vegas's
bones never move); the districts are the real basins, the roads are the real roads, and a crossing is where a real road
finds the gap between two ranges, the way Battle Brothers' roads find the gaps between its mountains. Who holds which
district is FACTIONS', never this file's.

## 8. THE ANALOG HORROR LINE (rule 20)

Every crossing is where the old government's signs still stand after the money died: ENTERING NYE COUNTY on NV-160 at
the Pahrump line, the Lake Mead National Recreation Area fee booth on Lake Mead Boulevard and on Lake Mead Parkway with
nobody in it and the gate arm still down, the WELCOME TO CALIFORNIA sign at Primm. The machine keeps announcing
borders nobody enforces. (A candidate for WORDS and RUN; draft, nothing drawn here.)

## 9. THE GATE

gates/region_districts_gate.js, registered as THE DISTRICTS JOIN: 29/0. It refuses a block with no district, a
district in two pieces, a seat outside its district, the lines off the ground or California off the survey line, a
one-sided or unnamed crossing, a road zigzagging along a line, a road end at nothing (read off the land), a seat no
road reaches, the real names lost, and the mirrored compass reading another map; three mutations inside the gate go
red. THE REGION IS REAL GEOGRAPHY (gates/region_land_gate.js) stays 61/0, and its K1 proves the generator still writes
the same bytes every run with the districts in.

## 10. WEAK, SAID

- The terrain has only the named ranges as hills, so where two basins meet across a low divide the data does not
  carry (Indian Springs and the Las Vegas Valley at the Corn Creek flats, Pahrump and the Amargosa), the line runs over
  open desert: 16 percent rough for basin-to-basin lines. The fix is more real hills in RANGES, never a rule bent to
  pass.
- Three districts have no road (the McCullough Range, Coyote Spring Valley, the Desert Range): real wilderness, crossed
  on foot. Coyote Spring Valley really has US-93 north, which the region's road list does not carry yet.
- The 'beyond' districts (California, Arizona, the Virgin River, the Amargosa, the Proving Ground) are cut by law or by
  the region's reach, not by the ground; their lines are printed, not counted.
- The local names are from public road names, tagged draft; WORDS owns how they read on screen.
- Nothing is drawn. Until RUN draws the lines and the names, he sees none of this.
