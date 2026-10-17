# THE REGION IS REAL GEOGRAPHY: THE LAS VEGAS REGION AS DATA ON RUN'S 496-BLOCK GRID

WORLD lane (chat 02), 10/17/26. Row `[the region]`, rules 109, 110, 111 (the hold on WORLD lifts
for this one row: a rule he gave is never held), 46 (the fifteen terrains), 33 (roads faster than
dirt), 77 (tiles are Legos), 40g (the bones never move). The big swing of the day (rule 110).

> **PAOLO 10/16:** *"our map has to be as big as fucking Battle Brothers and that's still not the
> case... I don't know if we need to break the grid and have more grids... you gotta pick one and
> I'm choosing Battle Brothers... a larger grid or something."*

**THE THING:** `engine/BOHEMIA_REGION_LAND.json` (65 KB), the whole Las Vegas region as data on
the grid RUN chose: 496 x 496 blocks, the valley's own 96 x 96 in the middle (rolled per game,
the generator's, never this file's), every block past the rim one of rule 46's thirteen map
kinds, the real highways in three classes with their speeds, 35 real places as destinations
hours apart, 10 more named beyond the rim with their distance. Written by
`tools/bohemia_world_region.py` (deterministic: the same bytes every run), read by
`engine/bohemia_region_land.js` in the valley's own coordinates, held by
`gates/region_land_gate.js` (THE REGION IS REAL GEOGRAPHY, 56/0). **Nothing drawn.** The land is
data; RUN paints it. Tab: NOT IN A TAB YET (RUN's map is the taker; see ROUTED).

---

## 0. MEASURED FIRST: THE SCALE NOBODY HAD WRITTEN DOWN

RUN's round one (records/BOHEMIA_THE_REGION_RUN_10_16_26.md) broke the grid in two: the valley
keeps its 96 x 96 blocks and a region of the same blocks runs 200 past every rim. It read what
each region block is off the land **painter** (vbCore: basin-and-range noise, a lake out past
whichever corner the valley's own lake rectangle sits in, roads that keep going straight), and it
set twelve real towns at a bearing and a **made-up distance** in blocks. That was the right first
cut and the wrong land. Before replacing it I measured what a block is:

- `engine/bohemia_overmap.js` line 19, its own words: **"The valley is 96 cells across = 5.73
  miles."** So the valley's own code says a block is **96 m** and the valley is **9.2 km** across.
- The **real** Las Vegas valley, Summerlin's edge to Henderson's (lon -115.35 to -114.99 at
  36.1 N), is **32.4 km** across. Centennial Hills to Anthem is about the same north to south.
- So the valley generator already draws a **compressed Las Vegas** (the 15, the Strip, downtown,
  the airport, Nellis, the beltway, the Spaghetti Bowl are all in its 96 blocks, as they are in
  the real 32 km), and the one honest scale for the whole map is the one its bones set:
  **96 blocks stand for 32 km, a block is 333 m of real ground.** The overmap's own comment
  agrees in spirit: *"A cell is a NEIGHBOURHOOD, not a lot."*
- At RUN's implied 96 m a block, the 496-block region would be **47.6 km** across and **six of
  RUN's twelve places would be beyond its rim** (Boulder City 35 km, the dam 41, Primm 62,
  Indian Springs 66, Pahrump 73, Mesquite 124). RUN put them inside anyway, at a third to a
  sixth of their real distance (Pahrump at 21 km, Mesquite at about 30). REALISM FIRST: the
  places go where they are, and the scale that puts them there is the valley's own.
- At 333 m a block the region is **165 km** across and holds everything rule 109 names: the
  valley, Henderson, Boulder City, the whole Boulder Basin of Lake Mead and the Overton Arm,
  the dam, I-15 south to Primm and the state line, I-15 north to Moapa and Glendale, US-95
  north-west past Indian Springs and Creech to **Mercury, the test site's gate**, US-95 south to
  Searchlight, US-93 over the dam into Arizona, Pahrump over the Spring Mountains. Only Mesquite,
  Laughlin and Kingman fall beyond, and they are named at the rim with their distance.

(The FIGHT's block is still a 96-metre house block. The fight is a piece of the city, not a map
cell: TWO SCALES, ONE GAME, 9/27.)

---

## 1. WHAT IS IN THE FILE

| key | what |
|---|---|
| `N, K, D` | 96, 200, 496: RUN's grid, unchanged |
| `metresPerCell` | 333, with `metresPerCellWhy` quoting the overmap and the real valley |
| `orientation` | REAL: north is y = 0 (the painter's own rule), east is +x; the loader mirrors x when the valley's compass says east is x0; y never mirrors |
| `rows` | 496 run-length strings, one code a block: `.` open_desert, `h` hills, `^` a peak (hills nobody crosses), `~` open water (its fight kind is the shore), `s` wash_and_shore, `f` freeway, `b` suburb_block, `i` industrial, `a` airport, `p` solar_and_pumps, `l` landfill, `g` golf_and_park, `t` trailer_park, `x` lot_and_bigbox, `V` the valley |
| `roadRows` | the same shape: `-` none, `F` freeway or US highway, `S` state route, `D` dirt track |
| `pass` | RUN's own codes (0 open, 1 road, 2 rough, 3 cannot be crossed); a road block is 1 whatever its ground (a bridge, a pass) |
| `speeds` | paved 5.0 km/h (4.0 min a block), dirt 4.3, streets 4.5, open desert 3.5, wash 2.8, hills 2.2; eight marching hours a day; **TUNING's, `speedsTuned:false`**, source US Army FM 21-18 and Naismith |
| `portals` | where each real highway meets the valley box and on which side (9 of them); the loader stitches the valley's rolled exits to them |
| `places` | 35, each with real lat/lon, its block, tier (camp/town/fortress), role (base or fight place), its ground, whether it sits on a road, km and bearing from the valley's middle, hours and days on foot, one line of what it is (`draft:true`) |
| `beyond` | 10 real places the roads go on to, with km, bearing, the road, the rim block, days |
| `numbers` | the four numbers beside Battle Brothers' (section 3) |

**Counts.** 170,173 blocks of open desert (72% of the region), 56,258 hills of which 20,594 are
peaks, 5,711 wash and shore, 3,249 open water (Lake Mead's Boulder Basin, the Overton Arm, Lake
Las Vegas, the Colorado below the dam), 1,945 suburb (the real city where it keeps going past
the box: Summerlin West, Centennial, Aliante, East Henderson, Anthem, Inspirada, Boulder City,
Pahrump), 1,643 freeway, 282 solar and pumps (the dam's switchyards, the Eldorado Valley fields,
Ivanpah's towers, the lake intakes), 178 industrial (Apex, Henderson's Black Mountain, Sloan,
the gypsum mine, Mercury), 183 golf and park, 143 trailer park, 122 airport (Henderson Executive,
Boulder City, Jean, Creech), 89 lot and big box, 73 landfill (Apex, the biggest in the country).
Roads: 1,643 freeway/US blocks, 1,408 state route, 315 dirt. **Nature is 98% of the land past
the rim and the city is the edge: rule 46's proportion, read the other way round from the valley.**

**The Lego edges (rule 77).** The loader's `edgesAt` hands every block four typed edges (what
runs out of each side: `road` when both blocks carry a road, `water`, `shore`, `hills`, `desert`,
`city`, `valley`, or the sorted pair when the families differ), symmetric by construction, so A's
east is always B's west; the gate proves it over all 491,040 seams on both compasses. A road
block has a road neighbour on at least two sides or ends at the valley box, the rim or a place
(the lodge, the dam's crest, a camp are real dead ends); no road network is an island. A
waypoint used to leave one-block nubs where the walk touched it and turned back; the generator
prunes them, because a nub is a road that ends in sand.

---

## 2. THE PLACES, WITH THE REAL KILOMETRES AND THE DAYS ON FOOT

From the valley's middle block, by the cheapest real route at the speeds above (the valley
itself costed as streets). A day is eight marching hours.

| place | tier | role | km | on | hours | days |
|---|---|---|---|---|---|---|
| HENDERSON | town | base | 20.0 | I-515 | 5.9 | 0.74 |
| SLOAN | camp | base | 21.9 | I-15 | 5.5 | 0.68 |
| LAKE LAS VEGAS | camp | base | 21.7 | NV-564 | 5.8 | 0.72 |
| RED ROCK | camp | fight | 23.3 | NV-159 | 5.8 | 0.72 |
| BLUE DIAMOND | camp | base | 22.7 | NV-160 | 6.9 | 0.86 |
| TULE SPRINGS | camp | fight | 22.4 | off | 6.8 | 0.84 |
| GYPSUM CAVE | camp | fight | 23.5 | off | 6.9 | 0.86 |
| LAS VEGAS BAY | camp | fight | 27.8 | Lakeshore | 8.0 | 0.99 |
| RAILROAD PASS | camp | base | 28.9 | US-93 | 8.5 | 1.07 |
| THE INTAKE | fortress | fight | 30.2 | Lakeshore | 8.4 | 1.05 |
| GASS PEAK | camp | fight | 29.4 | dirt | 9.7 | 1.21 |
| BOULDER BEACH | camp | base | 34.5 | Lakeshore | 9.3 | 1.16 |
| APEX | camp | base | 33.8 | I-15 | 10.2 | 1.27 |
| APEX LANDFILL | camp | fight | 34.0 | off | 10.4 | 1.30 |
| BOULDER CITY | town | base | 34.9 | US-93 | 10.3 | 1.29 |
| CORN CREEK | camp | base | 37.9 | dirt | 12.4 | 1.55 |
| HOOVER DAM | fortress | fight | 41.0 | US-93 | 12.6 | 1.58 |
| JEAN | camp | base | 41.9 | I-15 | 11.1 | 1.39 |
| ELDORADO SOLAR | fortress | fight | 40.9 | dirt | 13.3 | 1.66 |
| GOODSPRINGS | camp | base | 41.1 | NV-161 | 13.9 | 1.73 |
| MT CHARLESTON LODGE | camp | base | 44.4 | NV-157 | 13.8 | 1.72 |
| SANDY VALLEY | camp | base | 53.4 | NV-161 | 17.5 | 2.18 |
| NELSON | camp | base | 56.2 | NV-165 | 16.9 | 2.12 |
| PRIMM | town | base | 61.5 | I-15 | 16.0 | 2.00 |
| IVANPAH SOLAR | fortress | fight | 63.9 | I-15 | 16.5 | 2.06 |
| INDIAN SPRINGS | town | base | 65.9 | US-95 | 19.5 | 2.43 |
| CREECH | fortress | fight | 68.1 | US-95 | 20.1 | 2.51 |
| VALLEY OF FIRE | camp | fight | 66.8 | NV-169 | 20.8 | 2.61 |
| ECHO BAY | camp | base | 69.1 | Echo Bay Rd | 18.3 | 2.28 |
| PAHRUMP | town | base | 73.1 | NV-160 | 22.0 | 2.75 |
| SEARCHLIGHT | camp | base | 77.1 | US-95 | 20.5 | 2.57 |
| MOAPA | camp | base | 79.2 | NV-168 | 22.9 | 2.87 |
| OVERTON | camp | base | 79.4 | Northshore | 23.9 | 2.99 |
| GLENDALE | camp | base | 85.5 | I-15 | 24.7 | 3.09 |
| MERCURY | fortress | fight | 93.8 | US-95 | 27.2 | 3.40 |

Beyond the rim, named at the edge: Death Valley Junction 113 km (NV-160, 3.8 days), Laughlin
120 (US-95 S, 3.7), Mesquite 124 (I-15 N, 4.3), Baker 125 (I-15 S, 3.8), Kingman 145 (US-93,
5.0), Beatty 166 (US-95 NW, 5.3), St George 179 (5.7), Barstow 216 (6.0), Tonopah 283 (8.2),
Ely 346 (9.9).

**Hours apart, as the row asked:** 25 of the 35 are more than six marching hours out; the near
one (Henderson) is most of a day's walk; the dam is a day and a half; the far rim is three days.

---

## 3. THE FOUR NUMBERS (rule 109c), OURS BESIDE BATTLE BROTHERS'

| | ours | Battle Brothers | source |
|---|---|---|---|
| tiles across / in all | **496 / 246,016** (the valley alone 96 / 9,216) | about 140 / 19,600 | the library's map page; community-measured |
| a crossing on foot | **6.8 days** I-15 rim to I-15 rim; **7.8 days** US-95 rim to the Arizona rim; 165 km straight across is 4.1 days on a road, 5.9 across the open | **not measured yet** (EYES [the map's four numbers], Grok ask 26) | this file's own routes |
| settlements | **49** (35 in the region + the valley's 14 seats) | about 17 | the library |
| kilometres across | **165** | a painting; no scale | this file |

Ours meets or beats the three that are measured. The fourth is owed by EYES and, until it lands,
the honest sentence is that a crossing takes days, plural, which was the ruling's shape.

---

## 4. WHAT THE LOADER DOES THAT THE DATA CANNOT

**The compass.** The valley rolls its east-west mirror per seed (vbCore: east is `x1` when the
15 runs west of the Strip, else `x0`). The data is real; `bohemia_region_land.js` mirrors x when
the compass says so and never touches y, because north is y = 0 on every seed, the painter's own
rule. The gate reads the dam through both compasses: east of the middle on one, west in x on the
other, the same y, the same kind.

**The stitch.** The valley's own freeway exits are rolled too (vbCore's `roads` list: which edge,
which column). The loader joins each rolled exit to the nearest real highway portal on the same
side (two blocks out, along the rim band, in to the portal) so a road out of the valley never
ends in sand; an exit with no portal within forty blocks runs straight to the rim the painter's
old way and is counted as unstitched. Tested with an exit on every side on both compasses: all
stitched, every connector block a road, RUN's pass grid says 1 on it, the road grammar still holds.

**The pass grid.** `passGrid(compass)` hands back exactly what `slices/bohemia_region.js` reads
(`R.pass`, D x D, RUN's codes), so RUN's swap is one line. The costs are richer than the painter's
three (open, road 0.5, hills 1.8): six speed classes, in minutes a block, from the metres.

---

## 5. FINDINGS, EACH MEASURED, ROUTED BY RULE 12

1. **RUN [the map at Battle Brothers' size]**: three things to take. (a) The land: `passGrid`
   in place of vbCore's `PASS`, stitched to the valley's exits; the painter keeps painting what
   it paints until COOK's tiles come, but the party walks on the real land. (b) The places:
   `places(compass)` in place of the twelve `TOWNS` at made-up distances; 35 places with tiers,
   roles, real km and the days. (c) The cost: a region block is 333 m of real ground, so a step
   out there should cost the data's minutes a block (4.0 on a road, 5.7 on the open, 9.1 in the
   hills), not the street's rough-going time for a 96-metre block. RUN's measured 1.9 days rim to
   rim becomes about 6.8 on the real roads. That is the ruling's shape: a crossing takes days.
2. **WORLD [the roll]** (my own OPEN row, held): the valley's dam cluster rolls `axisFlip` with
   `r()<0.5`, so **half of all seeds put the valley's Lake Mead rectangle on the SOUTH border**
   while the real lake is east, and vbCore paints its lake out past whichever corner that
   rectangle sits in. The region's lake is east on every seed. On a south-dam seed the valley's
   in-box lake piece and the region's lake disagree. The 9/29 row already says the bones never
   move; the fix is the roll's, not this file's: drop `axisFlip` (the mirror alone keeps two
   valleys two valleys), and pull Lake Mead, Boulder City and the dam OUT of the valley box onto
   the region where they are, 25 to 41 km from the Strip.
3. **FACTIONS [home bases]**: rule 109d says the bases and parties scale to the region. The 35
   places carry tiers and roles; 22 are bases, 13 are fight places (the legendary locations of
   [where the god gear is] in their real spots: the dam's powerhouse, the Apex landfill, the
   solar fields, the lake intake, Creech's hangars, Mercury's gate, the fossil beds at Tule
   Springs and Gypsum Cave that the lab-made beasts come from).
4. **TUNING**: the six speeds and the eight-hour day are felt numbers, in the file with their
   source, `speedsTuned:false`.
5. **EYES [the map's four numbers]**: Battle Brothers' crossing days are the one number still
   owed; the file prints ours beside a null.
6. **MODS**: one data file, every key documented inside it, re-made by one script; a modder
   edits `PLACES` or `ROADS` in the script and runs it.
7. **COOK TWO / COMBAT**: the region's blocks are the same thirteen kinds the fight boards are
   cut from, so a fight on the road to the dam is a `freeway` board, in the Eldorado Valley a
   `solar_and_pumps` board, at Boulder Beach a `wash_and_shore` board; nothing new to cook for the
   region's ground. Ruin and casino_floor stay at zero blocks (a condition and an interior).

---

## 6. WHAT THIS DOES NOT DO, SAID OUT LOUD

- It draws nothing and ships nothing to the demo; RUN paints and walks it (rule 110d: the
  mechanics lanes swing on the alpha; the demo cut takes a called G-O).
- The coordinates are real to about a kilometre (three blocks): they are from the map, not from
  a survey, and the ranges are spines with widths, not contour lines. Good enough for a map that
  is for looks (rule 86); wrong by a block where a road meets a range.
- It does not place the valley's 14 seats, the parties, the crews or the prices: those are the
  roll's, FACTIONS' and ECONOMY's, and the file leaves the 9,216 valley blocks as `V` on purpose.

---

**Analog horror, from the world's own state (rule 20 s9):** out there the one calm wrong thing
is the dam. Its floodlights come on at dusk every night and nobody has been at the switch since
the money died; from Boulder Beach you see them on the water, and from the crest road you can
hear the turbines still turning for a grid with nobody on it.

`[bb region]` **Battle Brothers' world is a painting the size of the screen; ours is a place the
size of a county.** Its map is about 140 tiles across, hand-authored once, every campaign the
same shape, no scale and no real place on it: you cross it in days and that is all the game
asks of it. **OUR TWIST** (rule 39b): the whole Las Vegas region as it is, 165 km across, 496
blocks at the scale the valley's own bones set, every block a real kind of ground, every road a
real road with its real speed, 35 real places at their real distance, measured in kilometres and
days a man can walk; and the valley in the middle is still rolled new every game, so two games
are two Las Vegases on one real desert. Battle Brothers never had to get a lake in the right
place. We do, and it is.

**One breath, on the claim:** the land past the valley is now the real Las Vegas region as data
on RUN's grid, every block a terrain, every road its speed, 35 places hours apart; RUN paints it.
