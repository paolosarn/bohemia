# BOHEMIA DISTRICT DOSSIER — FUELDEPOT

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_fueldepot.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A products terminal: six bulk tanks each in its own concrete containment dike, a manifold tying them together, and a five-bay truck loading rack at the front.**

### Real-world reference
- The Calnev Pipeline terminus, Las Vegas (Kinder Morgan): a 550-mile buried refined-products line from Los Angeles refineries, two parallel lines at 14 and 8 inches, carrying gasoline, jet fuel and diesel as far as Nellis.
- The Las Vegas terminal receives, stores, handles and loads petroleum into tank trucks; one local terminal holds 4 million gallons.
- Reinforced concrete dikes are the default for a permanent bulk plant — they take heavy equipment traffic, last 40+ years, and accept engineered drain valves and oil/water separators.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the TANKS plan: a products terminal: six bulk tanks each in its own concrete containment dike, a manifold tying them together, and a five-bay truck loading rack at the front.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the setback outside the terminal fence, kept clear because of what is stored inside it | ground | no | — | 2149 |
| 1 | `#4c483f` | terminal road | drive | the road in from the gate to the loading rack (drivable) | ground | no | — | 1459 |
| 2 | `#6a6358` | building (terminal office) | building | the terminal office, the loading authorisations still pinned up inside | structure | yes | the fueldepot building interior: the working room at the front, stores and plant behind it | 299 |
| 3 | `#3f382c` | dead brush | tree-dead | brush caught along the outside of a containment dike, downhill of everything | prop | yes | — | 85 |
| 4 | `#5b564b` | containment floor | ground | the floor of a containment cell, graded to its sump, stained where something stood in it | ground | no | — | 3823 |
| 5 | `#c79a3f` | gate | gate | the terminal gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#8e968f` | storage tank | structure | an above-ground bulk tank, shell paint chalked to nothing, a rust line where the product level stopped | structure | yes | — | 992 |
| 7 | `#6f6a5e` | containment dike / rack | structure | the reinforced concrete dike round the tank — or the frame of the truck loading rack | structure | yes | — | 3378 |
| 8 | `#3d4a46` | spill / standing product | water-dead | something dark standing in the low corner of a containment cell | ground | no | — | 1340 |
| 9 | `#8f8676` | pole light | prop | a terminal yard light, head dark | prop | yes | — | 4 |
| 10 | `#a39a86` | valve / manway | prop | a block valve on the manifold, a shell manway, a gauge hatch left open | prop | yes | — | 2078 |
| 11 | `#c9c1aa` | marking | marking | the loading lane markings on the rack apron | ground | no | — | 143 |
| 12 | `#6a6a72` | perimeter fence | structure | the terminal fence, and the signage that used to say why is long gone off it | structure | yes | — | 227 |
| 13 | `#7a7266` | pipe manifold | structure | the manifold — the pipe that ties every tank to the rack and the pipeline | structure | yes | — | 402 |
| 14 | `#8a8478` | vent stack | structure | a vapour recovery stack at the end of the rack | structure | yes | — | — |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
