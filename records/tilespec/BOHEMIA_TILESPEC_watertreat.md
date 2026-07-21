# BOHEMIA DISTRICT DOSSIER — WATERTREAT

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_watertreat.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead wastewater treatment plant — a row of circular clarifier tanks with their sweep arms, rectangular aeration basins + a grid of filter beds, a control/blower/chemical building, pipe galleries, all drained + cracked behind the perimeter fence.**

### Real-world reference
- Wastewater-plant design guides (GBRA design standards, turn2engineering components, NapaSan primary/secondary/tertiary process, AUC concentric-circle layout): the recognizable kit is CIRCULAR CLARIFIERS (round tanks, central core + radial sweep arm), rectangular AERATION BASINS (activated sludge, baffled), FILTER BEDS, a CONTROL / blower / chemical BUILDING, pipe galleries + catwalks, all fenced and ordered by gravity flow.

### Layout — what is where
- The plant deck is dry basin-floor concrete inside a perimeter fence (desert at the margins).
- The CONTROL / blower / chemical BUILDING cluster sits at the back; a thin service road spine runs the plant.
- A row of CIRCULAR CLARIFIERS (the hero — round walls, centre cores, radial sweep arms) crosses the middle.
- Rectangular AERATION BASINS (baffled) + a grid of FILTER BEDS fill the front; pipe galleries + catwalks tie the stages in gravity-flow order; scum is crusted in the basins.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the service gate is on the primary street; a thin service road (code 1) reaches the structures from the curb (K.driveReachFromStreet). WALKABLE-LAND: the plant is nearly ALL structure (tanks, basins, buildings, pipes) — content dominates, the road is minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk, flat): the dry basin floors (4, 7), crusted sludge (10), the service road (1, drive), desert (0). STRUCTURES (¾ front face, solid): the buildings (2, ENTERABLE -> control/pump/chem interior), the CLARIFIER walls + cores (6, the round tanks), the pipe galleries + catwalks + sweep arms (8), the perimeter FENCE (12). PROPS: pole lights (9). PORTALS: the gate (5). The tanks + buildings + pipes are the vertical mass; you walk the deck and the drained basin floors between them.

### Decisions & rulings
- Act-1 DEAD: basins drained + cracked, scum crusted, steel rusted, the control house dark, no flow. The valley's water is a scarcity-economy resource (Paolo's to rule) — this plant is where it was cleaned.
- Infrastructure category (watertreat). Zero purple.
- WALKABLE-LAND LAW honored: nearly all structure/basin, minimal road — content dominates.
- Research-first (per the playbook): built from real wastewater-plant site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2583 |
| 1 | `#45433c` | service road | drive | the plant service road — a car reaches the structures from the gate (drivable) | ground | no | — | 341 |
| 2 | `#6f665a` | building (control / blower / chem) | building | the control house / blower room / chemical building, dark, gauges dead | structure | yes | plant interior: the control room + pump/blower gallery up front, the chemical + lab rooms behind | 1741 |
| 3 | `#3a4020` | dead brush | tree-dead | dead brush caught in the perimeter fence | prop | no | — | — |
| 4 | `#5a584f` | dry basin floor | ground | the cracked dry concrete of a drained basin / the plant deck | ground | no | — | 6934 |
| 5 | `#c79a3f` | gate | gate | the plant service gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#7a7268` | clarifier wall / core | structure | the concrete wall + centre core of a circular clarifier tank (the round-tank rim) | structure | yes | — | 499 |
| 7 | `#46585a` | aeration / filter basin | ground | a drained aeration basin / filter cell — cracked floor, walls water-stained dark | ground | no | — | 2125 |
| 8 | `#8a8478` | pipe gallery / catwalk | structure | a steel pipe gallery / catwalk / clarifier sweep arm, rusted | structure | yes | — | 1628 |
| 9 | `#8f8676` | pole light | prop | a plant pole light, head dark | prop | yes | — | 5 |
| 10 | `#5a5240` | crusted sludge / scum | ground | crusted dried sludge / scum drifted in the basins + on the deck | ground | no | — | 20 |
| 11 | `#c9c1aa` | marking | marking | faded hazard / valve paint on the deck | ground | no | — | — |
| 12 | `#6a6a72` | perimeter fence | structure | the chain-link plant perimeter fence, wire sagging | structure | yes | — | 503 |

**Gate:** `gates/watertreat_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
