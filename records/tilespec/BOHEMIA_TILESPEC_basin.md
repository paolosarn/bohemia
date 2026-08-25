# BOHEMIA DISTRICT DOSSIER — BASIN

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_basin.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A flood detention basin: an earth bowl with stepped side slopes down to a flat silt floor, a concrete outlet works with a small orifice at the low corner, and an emergency spillway notched in the crest.**

### Real-world reference
- Clark County Regional Flood Control District: basins range from 10 to 50 acres and up to 50 feet deep, holding water to about 51.5 feet before it goes over the emergency spillway.
- Since 1991 the district has built 650 miles of channel and 100 basins for $1.9 billion, with another 25 years of projects planned.
- A real outlet: a concrete box storm drain with a 24-inch orifice leaving the basin. Las Vegas sits in a basin with ONE outlet, the Las Vegas Wash, and everything drains east to Lake Mead.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the BOWL plan: a flood detention basin: an earth bowl with stepped side slopes down to a flat silt floor, a concrete outlet works with a small orifice at the low corner, and an emergency spillway notched in the crest.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the ground outside the embankment, which is the ground this basin exists to keep dry | ground | no | — | 2895 |
| 1 | `#4c483f` | maintenance ramp | drive | the ramp down into the bowl, the only way a machine gets to the floor (drivable) | ground | no | — | 1865 |
| 2 | `#6a6358` | building (O&M shed) | building | the district maintenance shed on the crest | structure | yes | the basin building interior: the working room at the front, stores and plant behind it | 184 |
| 3 | `#3f382c` | flood debris | tree-dead | tumbleweed and branch wrack piled where the water last stopped | prop | yes | — | 90 |
| 4 | `#6e654e` | basin floor | ground | the flat floor of the basin, silt cracked into plates | ground | no | — | 3700 |
| 5 | `#c79a3f` | gate | gate | the basin gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#5f5844` | side slope / outlet works | structure | the side slope stepping down to the floor — and the concrete outlet box at the bottom of it | structure | yes | — | 3469 |
| 7 | `#7b7259` | embankment crest / spillway | structure | the crest of the embankment, and the emergency spillway notched into it | structure | yes | — | 589 |
| 8 | `#4c8450` | low-flow trickle | water-dead | the trickle that runs even when it has not rained, gone green with algae, crossing the floor to the orifice | ground | no | — | 1367 |
| 9 | `#8f8676` | pole light | prop | a light on the crest, head dark, put there to work a basin at night in a storm | prop | yes | — | 2 |
| 10 | `#8a8172` | debris rack / riprap | prop | the trash rack across the orifice, and rock armour where the flow comes in | prop | yes | — | 1613 |
| 11 | `#c9c1aa` | marking | marking | the elevation marks on the outlet box — the record of every flood that filled this | ground | no | — | 3 |
| 12 | `#6a6a72` | perimeter fence | structure | the basin fence, pushed over where the last flood shoved a raft of debris into it | structure | yes | — | 455 |
| 13 | `#7a7266` | storm drain | structure | the concrete box storm drain leaving the outlet | structure | yes | — | 135 |
| 14 | `#8a8478` | gauge mast | structure | the stage gauge on the crest, the flood heights painted up it, the top mark higher than anyone believed | structure | yes | — | 12 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
