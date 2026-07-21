# BOHEMIA DISTRICT DOSSIER — BONEYARD

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_boneyard.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead auto-salvage yard / boneyard — rows of stripped wrecked cars on an oil-dark dirt yard, a wall of crushed cars, a claw crane + crusher, a small office + truck scale at the gate, tire + scrap piles, all fenced. The salvage economy's larder.**

### Real-world reference
- Auto-salvage / wrecking-yard guides (Wikipedia wrecking yard, TRUiC junkyard, salvage-yard requirements): vehicles towed in + arranged in ROWS and STACKED (organized by make) on a dirt yard; a mobile CRUSHER / baler + a CRANE / loader process + move bodies; a small OFFICE + parts counter + a truck SCALE at the entrance; the whole site FENCED + lit; tire + scrap piles.

### Layout — what is where
- The yard is oil-dark packed dirt inside a security fence (desert at the margins).
- ROWS of stripped WRECKED CARS (rust / faded blue / faded white, organized by make) fill the yard with dirt lanes between them.
- A WALL of crushed, flattened cars stacks along the east edge; the CLAW CRANE + CRUSHER (the hero machine) works mid-yard, its boom reaching over the pile.
- A small OFFICE + parts counter + the truck SCALE sit at the south gate; tire + scrap piles, oil stains, and pole lights dot the yard.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street, past the scale; DIRT LANES (code 1) run down every row-gap + a cross lane, so a loader/car reaches every row from the entrance (K.driveReachFromStreet). WALKABLE-LAND: the cars + piles + machines + buildings dominate; the lanes are just the row-gaps. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive/walk, flat): the dirt yard (4) + oil stains (10), the dirt lanes (1, drive), the scale/aisle markings (11), desert (0). STRUCTURES (¾ front face, solid): the office/parts building (2, ENTERABLE), the crushed-car STACK (7), the CRANE / crusher (8, the hero machine), the perimeter FENCE (12), tire/scrap piles (3). VEHICLES (solid, weave between): the rows of WRECKED CARS (6 / 13 / 14). PROPS: pole lights (9). PORTALS: the gate (5). The wrecks + stacks + crane are the mass; you drive the dirt row-lanes between them.

### Decisions & rulings
- Act-1 world-native: the boneyard is ALREADY dead + rusted — rows of stripped wrecks, a seized crane, crushed stacks, oil-black dirt. This is the salvage economy's larder (LIFE / ECONOMY pull parts + scrap here — Paolo + the economy rule the loot).
- Industrial category (boneyard). Zero purple. Cars carry no plates/make canon (generic wrecks).
- WALKABLE-LAND LAW honored: cars/piles/machines/buildings dominate; dirt lanes are just row-gaps.
- Research-first (per the playbook): built from real wrecking-yard site layouts, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2617 |
| 1 | `#4a4438` | dirt drive lane | drive | the rutted dirt lane between the car rows — a loader/car reaches every row (drivable) | ground | no | — | 1328 |
| 2 | `#6a5f50` | building (office / parts) | building | the salvage office + parts counter, window smashed, ledger gone | structure | yes | office interior: the parts counter + a wall of pull tickets up front, a parts shelving room behind | 465 |
| 3 | `#3f382c` | scrap / tire pile | tree-dead | a heap of bald tires / twisted scrap metal | prop | yes | — | 52 |
| 4 | `#565040` | dirt yard ground | ground | the oil-dark packed-dirt yard the wrecks sit on | ground | no | — | 6242 |
| 5 | `#c79a3f` | gate | gate | the salvage gate off the street, amber curb, chain hanging | portal | no | — | 7 |
| 6 | `#8a5040` | wrecked car (rust) | vehicle | a wrecked car in the row, rusted to oxide-red, stripped for parts | prop | yes | — | 1355 |
| 7 | `#453d34` | crushed-car stack | structure | a wall of flattened, crushed cars stacked for the baler | structure | yes | — | 513 |
| 8 | `#c8a03a` | crane / crusher | structure | the claw crane + mobile crusher, boom seized, yellow paint faded | structure | yes | — | 295 |
| 9 | `#8f8676` | pole light | prop | a yard pole light, head dark | prop | yes | — | — |
| 10 | `#2a2620` | oil / fluid stain | ground | oil + fluid stained into the dirt under the wrecks | ground | no | — | 157 |
| 11 | `#c9c1aa` | marking (scale/aisle) | marking | the truck-scale pad + faded aisle/row markers | ground | no | — | 396 |
| 12 | `#6a6a72` | perimeter fence | structure | the salvage-yard security fence, wire + barbed top sagging | structure | yes | — | 501 |
| 13 | `#4a5560` | wrecked car (faded blue) | vehicle | a wrecked car in the row, paint faded to chalky blue, stripped | prop | yes | — | 1181 |
| 14 | `#8a857a` | wrecked car (faded white) | vehicle | a wrecked car in the row, paint sun-bleached to grey-white, stripped | prop | yes | — | 1275 |

**Gate:** `gates/boneyard_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
