# BOHEMIA DISTRICT DOSSIER — PUMPSTATION

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_pumpstation.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A water pumping station: a plain pump house with pipe bigger than a person leaving both ends of it, a surge tank, a switchgear yard and a pig launcher pad.**

### Real-world reference
- Las Vegas Valley Water District: 55 pumping stations with the capacity to move more than a million gallons a minute.
- A major Las Vegas pumping station project runs two 66-inch steel pipelines lined with concrete mortar — the pipe is the dominant object on such a site, not the building.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the PUMPS plan: a water pumping station: a plain pump house with pipe bigger than a person leaving both ends of it, a surge tank, a switchgear yard and a pig launcher pad.

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
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | the setback outside the station fence, and the pipe runs under it either way | ground | no | — | 2893 |
| 1 | `#4c483f` | access road | drive | the road in to the pump house door (drivable) | ground | no | — | 1471 |
| 2 | `#6d6659` | building (pump house) | building | the pump house — inside it the pumps are the size of the room, and the water in them stopped moving a decade ago | structure | yes | the pumpstation building interior: the working room at the front, stores and plant behind it | 1595 |
| 3 | `#3f382c` | dead brush | tree-dead | brush along the line of the buried main, greener than anything either side of it | prop | yes | — | 121 |
| 4 | `#5f5a4e` | station yard | ground | the graded station yard, dropped and levelled for cranes that had to lift pumps out | ground | no | — | 3750 |
| 5 | `#c79a3f` | gate | gate | the station gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#8e9498` | surge tank | structure | the surge tank — the thing that keeps a stopped column of water from tearing the pipe apart | structure | yes | — | 152 |
| 7 | `#77716a` | switchgear / roof monitor | structure | the switchgear yard, and the monitor along the pump house roof | structure | yes | — | 651 |
| 8 | `#3a5560` | leak / standing water | water-dead | water standing where a gland finally let go | ground | no | — | 2006 |
| 9 | `#8f8676` | pole light | prop | a station light, head dark, over a building that only ever needed light inside it | prop | yes | — | 4 |
| 10 | `#a39a86` | valve vault cover | prop | a valve vault cover set flush in the yard | prop | yes | — | 2885 |
| 11 | `#c9c1aa` | marking | marking | pig launcher and lane markings on the pad | ground | no | — | 33 |
| 12 | `#6a6a72` | perimeter fence | structure | the station fence, low, because there is nothing here worth climbing for | structure | yes | — | 455 |
| 13 | `#7f776a` | transmission main | structure | sixty-six-inch steel lined with concrete mortar — the pipe is the station | structure | yes | — | 288 |
| 14 | `#8a8478` | standpipe | structure | the standpipe beside the surge tank, open at the top the way a standpipe has to be | structure | yes | — | 75 |

**Gate:** `gates/pumpstation_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
