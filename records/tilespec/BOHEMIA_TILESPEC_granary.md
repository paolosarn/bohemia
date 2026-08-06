# BOHEMIA DISTRICT DOSSIER — GRANARY

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_granary.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A grain elevator: a battery of concrete silos with the headhouse straddling them, a rail shed over the spur on one side and a truck dump on the other.**

### Real-world reference
- Grain elevator practice: a bucket elevator lifts the grain to the top of the headhouse and it is drawn off under gravity into rail or road trucks below.
- A complex is elevator, storage silos, dust bins, headhouse and sheds for rail and truck; a railroad shed over the drive floor protects the rail scale and loading.
- Steel I-beams carry the headhouse and the upper conveyor gallery.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the SILOS plan: a grain elevator: a battery of concrete silos with the headhouse straddling them, a rail shed over the spur on one side and a truck dump on the other.

### Circulation (street-aware / drivable)
Street-aware via K.rotateToStreet (canonical-south, order S>E>W>N): the car gate lands on the primary street and a corner adds a PEDESTRIAN gate on the side street, never a second car entrance. The access road plus the perimeter lane are the explicit car surface (code 1) and a vehicle reaches the site building from the curb (K.driveReachFromStreet). WALKABLE-LAND: the working site dominates; the road is minimal.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (walk/drive, flat): the site dead-ground (0), the working surface (4), the access road (1, drive), markings (11), and any standing water (8). STRUCTURE (three-quarter front face, SOLID): the hero mass (6), the secondary structure (7), the site building (2, ENTERABLE), the fence (12), the pipe/conveyor runs (13) and the VERTICAL (14). PROPS (solid): pole lights (9) and the prop cluster (10). PORTAL: the gate (5). What blocks is the mass; what you walk on is the working surface; what you go inside is code 2.

### Decisions & rulings
- ACT ONE ONLY: everything on this site is dead. No act-2/3 material is named anywhere in this module.
- Category industrial. Zero purple (PURPLE RESERVATION).
- RESEARCH-FIRST: every reference above is a real Las Vegas valley facility, cited, not remembered.
- Built by the UTILITY LANDMARK FACTORY (engine/bohemia_utility.js) from a typed spec, per the FACTORY LAW: the thirteenth landmark is a spec, not a file.
- MECHANISM-MINE / CONTENTS-PAOLO'S: no operator name, no signage text, no brand anywhere on the site.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the setback outside the elevator yard, and the grain dust settled over all of it | ground | no | — | 2568 |
| 1 | `#4c483f` | yard road | drive | the road from the gate round to the truck dump (drivable) | ground | no | — | 1485 |
| 2 | `#6a6358` | building (scale house / office) | building | the scale house, the last load ticket still on the desk | structure | yes | the granary building interior: the working room at the front, stores and plant behind it | 462 |
| 3 | `#3f382c` | dead brush | tree-dead | brush against the silo skirt, rooted in spillage nobody ever swept up | prop | yes | — | 80 |
| 4 | `#5f5a4e` | dump apron | ground | the apron over the truck dump pit, its grate half buried | ground | no | — | 3779 |
| 5 | `#c79a3f` | gate | gate | the elevator gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#a89f8a` | concrete silo | structure | a concrete silo, joint lines showing where each slipform lift stopped | structure | yes | — | 1514 |
| 7 | `#8d8574` | gallery / rail shed | structure | the gallery running along the silo tops, and the shed roof over the rail track | structure | yes | — | 2121 |
| 8 | `#57503f` | rail spur | ground | the spur under the shed, rail still bright where the wheels ran | ground | no | — | 1988 |
| 9 | `#8f8676` | pole light | prop | a yard light, head dark, on the pole the dump lane was worked under | prop | yes | — | 3 |
| 10 | `#9a9080` | spout / dust bin | prop | a drawoff spout under a silo, and the dust bins along the dump | prop | yes | — | 1639 |
| 11 | `#c9c1aa` | marking | marking | the truck lane markings on the dump apron, ground to ghosts by the tyres that used them | ground | no | — | 99 |
| 12 | `#6a6a72` | perimeter fence | structure | the elevator fence, which ends at the rail spur because the railway fenced its own | structure | yes | — | 316 |
| 13 | `#7a7266` | conveyor run | structure | the conveyor between the silo battery and the annex bin | structure | yes | — | 15 |
| 14 | `#b0a894` | headhouse | structure | THE HEADHOUSE — the bucket elevator straddling the silos, and everything below it is gravity | structure | yes | — | 310 |

**Gate:** `gates/granary_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
