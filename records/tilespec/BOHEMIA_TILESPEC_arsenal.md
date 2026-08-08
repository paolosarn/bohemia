# BOHEMIA DISTRICT DOSSIER — ARSENAL

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_arsenal.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**An ammunition storage area: twelve earth-covered magazines set well apart in echelon with earth traverses between them, doors on one end only, off a single service lane.**

### Real-world reference
- Ammunition storage practice: earth-covered magazines are separated by quantity-distance and screened from each other by earth traverses, so a detonation in one does not propagate.
- The headwall and door are on ONE end only; the rest of the structure is arch under fill.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the BUNKERS plan: an ammunition storage area: twelve earth-covered magazines set well apart in echelon with earth traverses between them, doors on one end only, off a single service lane.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the quantity-distance setback — legally empty ground, and that is why it is empty | ground | no | — | 2893 |
| 1 | `#4c483f` | service lane | drive | the lane along the magazine ranks (drivable) | ground | no | — | 1976 |
| 2 | `#6a6358` | building (issue point / guard) | building | the issue point, its window shutter down | structure | yes | the arsenal building interior: the working room at the front, stores and plant behind it | 527 |
| 3 | `#3f382c` | dead brush | tree-dead | brush growing straight out of the earth cover, which is how you tell nobody has mown here | prop | yes | — | 78 |
| 4 | `#54503f` | storage ground | ground | the bare ground between the ranks, kept bare on purpose -- the empty distance IS the safety system | ground | no | — | 3824 |
| 5 | `#c79a3f` | gate | gate | the arsenal gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#5d5a44` | earth-covered magazine | structure | a magazine under its earth cover, grass-grey, the arch showing at the ends | structure | yes | — | 1372 |
| 7 | `#7c7566` | concrete arch / traverse | structure | the concrete arch under the fill, and the earth traverse standing between one magazine and the next | structure | yes | — | 2801 |
| 8 | `#3d4a46` | seepage | water-dead | water seeping out at the foot of a traverse | ground | no | — | 974 |
| 9 | `#8f8676` | pole light | prop | a perimeter light, head dark, aimed inward at the ranks the way a guard force aims lights | prop | yes | — | 4 |
| 10 | `#9a9080` | barricade post | prop | a barricade post at the head of a rank, set there to stop a vehicle rather than a person | prop | yes | — | 1475 |
| 11 | `#c9c1aa` | marking | marking | the magazine number stencilled on the headwall | ground | no | — | — |
| 12 | `#6a6a72` | perimeter fence | structure | the arsenal fence, and it is the outer of two -- the inner one is the fence that mattered | structure | yes | — | 455 |
| 13 | `#7a7266` | cable trench | structure | the cable trench along the service lane | structure | yes | — | — |
| 14 | `#8a8478` | lightning mast | structure | a lightning mast over the ranks | structure | yes | — | — |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
