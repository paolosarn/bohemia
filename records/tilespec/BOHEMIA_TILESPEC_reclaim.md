# BOHEMIA DISTRICT DOSSIER — RECLAIM

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_reclaim.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A reclamation pond field: nine bermed ponds in a grid, an inlet header down one side, an outfall channel leaving toward the wash.**

### Real-world reference
- Clark County water reclamation: treated effluent returns to the Las Vegas Wash and from there to Lake Mead, which is why the outfall channel points that way.
- Las Vegas is a basin with a single outlet, the Las Vegas Wash; all runoff and return flow drains east.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the PONDS plan: a reclamation pond field: nine bermed ponds in a grid, an inlet header down one side, an outfall channel leaving toward the wash.

### Circulation (street-aware / drivable)
Street-aware via K.rotateToStreet (canonical-south, order S>E>W>N): the car gate lands on the primary street and a corner adds a PEDESTRIAN gate on the side street, never a second car entrance. The access road plus the perimeter lane are the explicit car surface (code 1) and a vehicle reaches the site building from the curb (K.driveReachFromStreet). WALKABLE-LAND: the working site dominates; the road is minimal.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (walk/drive, flat): the site dead-ground (0), the working surface (4), the access road (1, drive), markings (11), and any standing water (8). STRUCTURE (three-quarter front face, SOLID): the hero mass (6), the secondary structure (7), the site building (2, ENTERABLE), the fence (12), the pipe/conveyor runs (13) and the VERTICAL (14). PROPS (solid): pole lights (9) and the prop cluster (10). PORTAL: the gate (5). What blocks is the mass; what you walk on is the working surface; what you go inside is code 2.

### Decisions & rulings
- ACT ONE ONLY: everything on this site is dead. No act-2/3 material is named anywhere in this module.
- Category infrastructure. Zero purple (PURPLE RESERVATION).
- RESEARCH-FIRST: every reference above is a real Las Vegas valley facility, cited, not remembered.
- Built by the UTILITY LANDMARK FACTORY (engine/bohemia_utility.js) from a typed spec, per the FACTORY LAW: the thirteenth landmark is a spec, not a file.
- MECHANISM-MINE / CONTENTS-PAOLO'S: no operator name, no signage text, no brand anywhere on the site.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the setback outside the pond field, and downwind of it, which is why nobody built here | ground | no | — | 2894 |
| 1 | `#4c483f` | service road | drive | the service road along the berm tops, one truck wide with nowhere to turn (drivable) | ground | no | — | 1441 |
| 2 | `#6a6358` | building (blower / control) | building | the blower house, control room dark and the blowers inside it seized where they stopped | structure | yes | the reclaim building interior: the working room at the front, stores and plant behind it | 465 |
| 3 | `#3f382c` | dead brush | tree-dead | reed and brush gone dry on a berm, rooted in what the pond beside it used to carry | prop | yes | — | 28 |
| 4 | `#5a5546` | berm road surface | ground | the graded top of a berm between two ponds | ground | no | — | 3795 |
| 5 | `#c79a3f` | gate | gate | the plant gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#6b6f56` | crusted pond centre | structure | the crust in the middle of a pond, dried hard enough to walk on and not hard enough to trust | structure | yes | — | 1683 |
| 7 | `#7d7461` | pond berm | structure | the earth berm holding one pond off the next | structure | yes | — | 2467 |
| 8 | `#4a5f4e` | pond water | water-dead | what is in the pond now — still, green, and not moving anywhere | ground | no | — | 2739 |
| 9 | `#8f8676` | pole light | prop | a plant light, head dark, standing over water that no longer moves anywhere | prop | yes | — | 3 |
| 10 | `#9a9080` | weir box / blower | prop | an outlet weir box on a pond corner, a blower on its pad | prop | yes | — | 238 |
| 11 | `#c9c1aa` | marking | marking | pond number stencilled on a weir box | ground | no | — | — |
| 12 | `#6a6a72` | perimeter fence | structure | the plant fence, more about keeping people out of the ponds than anything in | structure | yes | — | 455 |
| 13 | `#7a7266` | inlet header | structure | the header feeding every pond off one line | structure | yes | — | 171 |
| 14 | `#8a8478` | vent stack | structure | the vent stack on the blower house | structure | yes | — | — |

**Gate:** `gates/reclaim_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
