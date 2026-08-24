# BOHEMIA DISTRICT DOSSIER — GYPSUM

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_gypsum.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A gypsum works: a white quarry face cut in benches, a mobile conveyor straight into the mill, and the monolithic storage dome that is the one hemisphere in the valley.**

### Real-world reference
- PABCO Gypsum, Las Vegas: a 4,000 acre complex holding the gypsum mine, ore processing and the wallboard plant together.
- A mobile conveyor belt moves the ore from the quarry directly into processing; the gypsum passes through Raymond IMP mills before calcination and storage.
- The PABCO storage dome is a monolithic dome — the reason this site has a hemisphere on it and nowhere else in the valley does.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the PIT plan: a gypsum works: a white quarry face cut in benches, a mobile conveyor straight into the mill, and the monolithic storage dome that is the one hemisphere in the valley.

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
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave outside the mine line, and the white dust reaches a long way past it | ground | no | — | 2842 |
| 1 | `#5c5140` | haul road | drive | the haul road off the quarry face down to the plant (drivable) | ground | no | — | 2044 |
| 2 | `#6e6558` | building (mill / board plant) | building | the mill building — the Raymond mills inside it silent, the board line cold | structure | yes | the gypsum building interior: the working room at the front, stores and plant behind it | 407 |
| 3 | `#3f382c` | dead brush | tree-dead | brush at the edge of the workings, every leaf on it powdered white | prop | yes | — | 98 |
| 4 | `#9a9282` | quarry floor | ground | the white working floor, gypsum dust over every surface on the site | ground | no | — | 3654 |
| 5 | `#c79a3f` | gate | gate | the plant gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#c2b9a4` | gypsum bench | structure | a cut bench of raw gypsum, so pale it reads white at any hour | structure | yes | — | 1216 |
| 7 | `#d2cab6` | bench lip / crest | structure | the crest of a bench of raw gypsum, the edge crumbling white where nobody has scaled it | structure | no | — | 160 |
| 8 | `#3f8076` | pit water | water-dead | water standing in the low corner of the workings, gone turquoise the way sulfate water does -- the one colour on a site that is otherwise all white dust | ground | no | — | 1682 |
| 9 | `#8f8676` | pole light | prop | a plant yard light, head dark, on a site that made its own power and still went out | prop | yes | — | 3 |
| 10 | `#a89f8c` | stockpile | prop | a cone of milled rock waiting for a calciner that stopped | prop | yes | — | 2960 |
| 11 | `#c9c1aa` | marking | marking | faded hazard paint on the mill floor, powdered over white like everything else here | ground | no | — | 4 |
| 12 | `#6a6a72` | perimeter fence | structure | the plant fence, which stops at the quarry line because nobody fences a cliff | structure | yes | — | 405 |
| 13 | `#6b6154` | conveyor run | structure | the mobile conveyor that carried ore straight from the quarry into the plant | structure | yes | — | 364 |
| 14 | `#8a8478` | calciner stack / dome crown | structure | the calciner stack, and the crown vent at the top of the storage dome | structure | yes | — | 180 |
| 15 | `#b6b2a8` | dome shell | structure | the shell of the monolithic storage dome, a hemisphere of shotcrete over rebar, the one curved roof in the valley | structure | yes | — | 360 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
