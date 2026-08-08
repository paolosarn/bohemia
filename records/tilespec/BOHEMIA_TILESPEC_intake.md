# BOHEMIA DISTRICT DOSSIER — INTAKE

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_intake.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A lake intake: the intake structure standing in shrunken water below a white bathtub ring, a shaft down to the tunnel, and a pump house pushing it uphill toward the valley.**

### Real-world reference
- Lake Mead intake works: the valley draws its water from a lake whose surface has dropped far enough to leave a white mineral bathtub ring on the rock above it.
- Since Las Vegas sits in a basin with a single outlet, the Las Vegas Wash, everything that leaves the valley ends up back in this lake.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the PUMPS plan: a lake intake: the intake structure standing in shrunken water below a white bathtub ring, a shaft down to the tunnel, and a pump house pushing it uphill toward the valley.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the bare shore above the old waterline, and it was underwater when this was built | ground | no | — | 2893 |
| 1 | `#4c483f` | access road | drive | the road down to the intake works (drivable) | ground | no | — | 1459 |
| 2 | `#6d6659` | building (intake pump house) | building | the intake pump house at the head of the shaft | structure | yes | the intake building interior: the working room at the front, stores and plant behind it | 1595 |
| 3 | `#3f382c` | dead brush | tree-dead | brush on the exposed lakebed terrace, growing where a boat used to pass over | prop | yes | — | 43 |
| 4 | `#7a7466` | exposed lakebed | ground | lakebed the water used to cover, cracked and pale | ground | no | — | 4065 |
| 5 | `#c79a3f` | gate | gate | the works gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#8e9498` | intake structure | structure | the intake tower standing in the water — and the surge tank behind it | structure | yes | — | 418 |
| 7 | `#b3ad9b` | bathtub ring / roof | structure | the white mineral band the lake left on the rock as it dropped, and the roof over the works | structure | yes | — | 1274 |
| 8 | `#2c505c` | lake water | water-dead | what is left of the lake, a long way below where the ring says it used to be | ground | no | — | 2775 |
| 9 | `#8f8676` | pole light | prop | a works light, head dark, on a gantry that now stands well back from the water | prop | yes | — | 4 |
| 10 | `#a39a86` | valve vault cover | prop | a valve vault cover, a bollard, a level gauge | prop | yes | — | 936 |
| 11 | `#c9c1aa` | marking | marking | elevation marks painted on the intake face — the record of the drop | ground | no | — | 32 |
| 12 | `#6a6a72` | perimeter fence | structure | the works fence, running down the shore and stopping short of where the water is now | structure | yes | — | 455 |
| 13 | `#7f776a` | intake shaft / main | structure | the shaft down to the tunnel, and the main leaving the pump house | structure | yes | — | 355 |
| 14 | `#8a8478` | standpipe | structure | the standpipe beside the surge tank, the last vertical before the water | structure | yes | — | 75 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
