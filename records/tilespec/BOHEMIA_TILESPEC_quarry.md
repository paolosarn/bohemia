# BOHEMIA DISTRICT DOSSIER — QUARRY

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_quarry.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A limestone quarry cut in stepped benches with a haul ramp spiralling down them, a crusher house and screen tower on the flat, a conveyor out to graded stockpiles.**

### Real-world reference
- Sloan limestone quarry, Clark County (Aggregate Industries): the quarry sits on top of Sloan Mountain with the processing plant below it.
- Modern quarries work a BENCH system, taking rock off in layers that can be returned to year after year, stepped up to the original surface.
- Aggregate flow: feed hopper to primary crusher, across a vibrating screen, to secondary crushers, oversize recirculated.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the PIT plan: a limestone quarry cut in stepped benches with a haul ramp spiralling down them, a crusher house and screen tower on the flat, a conveyor out to graded stockpiles.

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
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | the untouched desert outside the quarry line | ground | no | — | 2842 |
| 1 | `#5c5140` | haul road | drive | the haul ramp spiralling down the benches, graded wide enough for a rock truck (drivable) | ground | no | — | 2156 |
| 2 | `#6e6558` | building (crusher house / plant) | building | the primary crusher house, its feed hopper empty, the belts hanging | structure | yes | the quarry building interior: the working room at the front, stores and plant behind it | 407 |
| 3 | `#3f382c` | dead brush | tree-dead | creosote holding on at the quarry rim, in the last soil the blasting has not reached yet | prop | yes | — | 124 |
| 4 | `#8a8070` | quarry floor | ground | the blasted floor of a bench, white rock dust over everything | ground | no | — | 3720 |
| 5 | `#c79a3f` | gate | gate | the quarry gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#a49a86` | rock bench | structure | a cut bench of limestone, the drill lines still visible up its face | structure | yes | — | 1138 |
| 7 | `#b8ae98` | bench lip / crest | structure | the crest of the bench, loose rock along the edge where nobody has scaled it | structure | no | — | 207 |
| 8 | `#5e6a68` | pit water | water-dead | water standing in the bottom of the pit, gone the colour of the rock | ground | no | — | 1835 |
| 9 | `#8f8676` | pole light | prop | a yard light over the crusher, head dark, on a plant that used to run three shifts | prop | yes | — | 3 |
| 10 | `#8c8272` | shot rock / stockpile | prop | a cone of graded stone, or shot rock left where the last round dropped it | prop | yes | — | 3153 |
| 11 | `#c9c1aa` | marking | marking | faded hazard paint on the plant floor | ground | no | — | — |
| 12 | `#6a6a72` | perimeter fence | structure | the quarry fence, most of it still standing | structure | yes | — | 442 |
| 13 | `#6b6154` | conveyor run | structure | the conveyor from the pit to the stockpiles, belt slack and gone brittle | structure | yes | — | 253 |
| 14 | `#8a8478` | screen tower | structure | the screen tower over the crusher, the tallest thing on the site | structure | yes | — | 99 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
