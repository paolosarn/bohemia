# BOHEMIA DISTRICT DOSSIER — DATAFORT

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_datafort.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A data fortress: one enormous windowless hall under a double roof, cooling units lining the face, a generator row down the flank, double-fenced.**

### Real-world reference
- Switch SUPERNAP, Las Vegas: over 1.4 million square feet on campus, 280 MW at full build-out; the initial facility is just over 400,000 square feet.
- The cross-section runs generators, power rooms, power spine, data halls, cooling units — the halls in the interior with the cooling units lining the exterior face.
- SwitchSHIELD is a double-roof system rated to 200 mph winds: two roof decks nine feet apart attached to the concrete and steel shell with NO roof penetrations.
- Cooling is 1000-ton units with on-board flywheels for ride-through, hot-aisle containment, cold air from overhead.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the HALL plan: a data fortress: one enormous windowless hall under a double roof, cooling units lining the face, a generator row down the flank, double-fenced.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the strip between the two fences, graded flat so anything crossing it is visible | ground | no | — | 2894 |
| 1 | `#4c483f` | access road | drive | the road from the gate to the guard house (drivable) | ground | no | — | 1461 |
| 2 | `#6a6358` | building (guard house) | building | the guard house at the gate, its glass still intact, which on this site is the tell | structure | yes | the datafort building interior: the working room at the front, stores and plant behind it | 495 |
| 3 | `#3f382c` | dead brush | tree-dead | brush caught between the two fences, the only thing that has crossed them in ten years | prop | yes | — | 26 |
| 4 | `#55514a` | service yard | ground | the service yard along the building face | ground | no | — | 3654 |
| 5 | `#c79a3f` | gate | gate | the campus gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#5e6166` | data hall | structure | THE HALL — four hundred thousand square feet with no window anywhere in it, which is the most recognisable thing about the building | structure | yes | — | 2966 |
| 7 | `#787c82` | second roof / generator | structure | the outer roof deck standing nine feet clear of the inner one, and the generator enclosures down the flank | structure | yes | — | 2167 |
| 8 | `#3f8a4a` | coolant leak | water-dead | dyed glycol standing under a cooling unit -- it is dyed so a leak is visible, and it is the only colour on the whole campus | ground | no | — | 181 |
| 9 | `#8f8676` | pole light | prop | a campus light, head dark, on a site that used to be lit around the clock | prop | yes | — | 4 |
| 10 | `#8d939a` | cooling unit | prop | a thousand-ton cooling unit on the building face, its flywheel stopped | prop | yes | — | 1233 |
| 11 | `#c9c1aa` | marking | marking | the loading apron markings, still crisp, because nothing has driven over them since | ground | no | — | 203 |
| 12 | `#6a6a72` | perimeter fence | structure | the double perimeter fence, and the gap between the two of them is the point of them | structure | yes | — | 667 |
| 13 | `#7a7266` | header / fuel line | structure | the chilled-water headers and the generator fuel header | structure | yes | — | 386 |
| 14 | `#9a948a` | microwave mast | structure | a microwave mast on the roofline, dishes still pointed at something | structure | yes | — | 42 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
