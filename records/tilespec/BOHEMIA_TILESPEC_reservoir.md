# BOHEMIA DISTRICT DOSSIER — RESERVOIR

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_reservoir.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A water reservoir site: two big welded steel tanks on a graded pad cut high into the foothills, a valve house, and transmission mains leaving downhill.**

### Real-world reference
- Las Vegas Valley Water District: 84 reservoir basins and tanks holding nearly a billion gallons, serving more than 400,000 homes and businesses.
- LVVWD engineers site reservoirs by elevation and customer count, deliberately UPGRADIENT of customers so gravity pushes water through the lines and builds pressure.
- A regional example: a 1.9 million-gallon welded steel tank and pump station on 134 auger-cast piles.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the TANKS plan: a water reservoir site: two big welded steel tanks on a graded pad cut high into the foothills, a valve house, and transmission mains leaving downhill.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the hillside outside the reservoir fence | ground | no | — | 2417 |
| 1 | `#4c483f` | access road | drive | the road up to the tank pad, switchbacked because the pad had to be this high (drivable) | ground | no | — | 1441 |
| 2 | `#6a6358` | building (valve house) | building | the valve house — the altitude valve that used to hold the level is still in there | structure | yes | the reservoir building interior: the working room at the front, stores and plant behind it | 315 |
| 3 | `#3f382c` | dead brush | tree-dead | brush on the cut slope of the pad, holding the cut together better than the drains do | prop | yes | — | 54 |
| 4 | `#6b6558` | tank pad | ground | the graded pad the tanks stand on, cut into the hillside | ground | no | — | 3846 |
| 5 | `#c79a3f` | gate | gate | the reservoir gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#9aa0a2` | water tank | structure | a welded steel reservoir, seams showing through the failed coating, sitting high enough that the whole valley below was fed by gravity | structure | yes | — | 1433 |
| 7 | `#7d8386` | tank roof | structure | the tank roof, its centre vent and the hatch beside it | structure | yes | — | 3295 |
| 8 | `#3a5560` | overflow | water-dead | the overflow weir and the stain running away from it down the pad | ground | no | — | 1046 |
| 9 | `#8f8676` | pole light | prop | a pad light, head dark | prop | yes | — | 4 |
| 10 | `#a39a86` | valve / hatch | prop | a buried valve cover, the shell manway, the level float box | prop | yes | — | 1354 |
| 11 | `#c9c1aa` | marking | marking | the fading identification band round the tank base | ground | no | — | 5 |
| 12 | `#6a6a72` | perimeter fence | structure | the reservoir fence, ringing two tanks and a valve house and nothing else at all | structure | yes | — | 335 |
| 13 | `#7a7266` | transmission main | structure | the transmission main in and out — big enough that its trench reads from the air | structure | yes | — | 740 |
| 14 | `#8a8478` | standpipe | structure | the standpipe beside the tanks | structure | yes | — | 94 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
