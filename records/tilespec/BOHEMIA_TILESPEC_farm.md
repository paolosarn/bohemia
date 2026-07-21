# BOHEMIA DISTRICT DOSSIER — FARM

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_farm.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead farm — furrowed crop fields gone fallow dominating the land, split by dry irrigation ditches, with the farmhouse + yard, a faded-red barn, grain silos, an equipment shed and a rusted tractor at the farmstead. A food prize gone to dust.**

### Real-world reference
- Farm site-plan guides (thehomesteady, agrothoughts, hobbyfarms): the FARMHOUSE sits at the FRONT near the road with a yard; the BARN + SILOS + equipment SHEDS sit BEHIND; CROP FIELDS dominate the land, fed by IRRIGATION planned early; a windbreak + logical traffic circulation tie it together.

### Layout — what is where
- CROP FIELDS (furrowed dead stubble on cracked soil) are the hero — they dominate the land, split into blocks by dry IRRIGATION ditches (desert at the margins, fenced).
- The FARMSTEAD clusters at the SE: the FARMHOUSE + its packed-dirt yard, a faded-red BARN with roof vents, round grain SILOS, an equipment SHED, a rusted tractor + combine, weathered hay bales.
- A windbreak of dead trees lines the road + field edges.
- A dirt FARM ROAD runs from the south gate to the farmstead + a farmyard access lane.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the farm gate is on the primary street; a dirt farm road (code 1) reaches the farmstead from the curb (K.driveReachFromStreet). WALKABLE-LAND: the fields + barn + silos + farmhouse dominate; the road is minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the field soil (4) + crop rows (7), irrigation (8), the farmyard (12), the farm road (1, drive), desert (0). STRUCTURES (¾ front face, solid): the FARMHOUSE/shed (2, ENTERABLE), the BARN (14, ENTERABLE -> threshing floor + loft), the SILOS (6), the fence (11). VEHICLES/PROPS (solid): the tractor (10), hay bales (13). PROPS: windbreak trees (3), pole lights (9). PORTALS: the gate (5). The fields are the low dominant plane; the red barn + silos + house are the vertical mass at the farmstead.

### Decisions & rulings
- Act-1 DEAD: fields fallow + cracked, crops dead stubble, the barn derelict, silos empty + rusting, a dead tractor. Food is the scarcity-economy prize — who farms here now is faction/economy canon (Paolo's).
- Infrastructure category (farm — agriculture). Zero purple.
- WALKABLE-LAND honored: fields + farmstead dominate; road minimal (a farm IS its fields, like a park is its lawn).
- Research-first (per the playbook): built from real farm site plans (house front / barn behind / fields dominate), not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2627 |
| 1 | `#4a4438` | farm road | drive | the dirt farm road — a truck/tractor reaches the farmstead from the gate (drivable) | ground | no | — | 327 |
| 2 | `#6a5f50` | building (farmhouse/shed) | building | the farmhouse / equipment shed, weathered clapboard, windows dark | structure | yes | farmhouse interior: kitchen + rooms up front, the mud room + the shed's equipment bay off the yard | 310 |
| 3 | `#3a4520` | windbreak tree | tree-dead | a dead windbreak tree lining the road / field edge | prop | no | — | 15 |
| 4 | `#57503a` | field soil | ground | cracked dry field soil / a bare fallow patch | ground | no | — | 9019 |
| 5 | `#c79a3f` | gate | gate | the farm gate off the street, amber curb, a cattle grid | portal | no | — | 5 |
| 6 | `#8a8478` | silo | structure | a grain silo, corrugated steel, empty + rusting | structure | yes | — | 125 |
| 7 | `#6a6238` | crop rows | ground | furrowed rows of dead crop stubble on the fields | ground | no | — | 2141 |
| 8 | `#46564f` | irrigation | ground | a dry irrigation ditch / a pivot sprinkler head, cracked | ground | no | — | 635 |
| 9 | `#8f8676` | pole light | prop | a yard pole light, head dark | prop | yes | — | 4 |
| 10 | `#a86a3a` | tractor | vehicle | a rusted tractor / combine dead in the yard, tyres flat | prop | yes | — | 18 |
| 11 | `#6a6a72` | fence | structure | the farm perimeter fence, posts leaning | structure | yes | — | 503 |
| 12 | `#5a5540` | farmyard | ground | the packed-dirt farmyard around the house + barn | ground | no | — | 286 |
| 13 | `#8a7a44` | hay bales | prop | weathered hay/straw bales, gone grey + collapsing | prop | yes | — | 50 |
| 14 | `#8a4535` | barn | building | the barn, faded red paint peeling, doors sagging | structure | yes | barn interior: the central threshing floor, stalls + a hay loft above, tack room off the side | 319 |

**Gate:** `gates/farm_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
