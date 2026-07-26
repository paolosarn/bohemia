# BOHEMIA DISTRICT DOSSIER — FIRESTATION

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_firestation.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead fire station — a row of apparatus bays opening onto a big concrete apron with red engines dead on it, a hose/drying tower, the boarded quarters, staff parking, guideline stripes leading the rigs to the street pull-out.**

### Real-world reference
- Fire-station design standards (RRM industry standards, Sherer Architects apparatus-bay layout, US Army Corps standard fire-station design, Fire Apparatus Magazine): APPARATUS BAYS with 14-18ft doors open onto a concrete APRON; the DRIVE-THROUGH layout (enter one side, exit the other, no backing) is the safety gold standard; guideline STRIPES extend onto the apron to align the rig; a HOSE / DRYING TOWER preserves the hoses; parking is ~2x the on-shift crew; the pedestrian path must not cross the apparatus response path.

### Layout — what is where
- The lot is a big light CONCRETE APRON / drive (dead lawn edging it, desert at the margins) — the rigs' operational surface.
- The STATION quarters + admin block sits at the back with the roll-up APPARATUS BAY doors on its front; a HOSE / DRYING TOWER stands beside it (east).
- RED fire ENGINES sit dead nosed out of the bays (one bay empty); faded guideline STRIPES run down the apron to line the rigs up.
- Staff PARKING is marked on the SW apron (a couple of abandoned crew cars); pole lights ring the apron; a flagpole stands in the entry lawn median.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the apron pulls straight out onto the primary street (the rigs launch from here — no backing); the whole apron + drive + parking (code 1) is one connected drivable surface reachable from the curb in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate. Foot paths (the crew) are kept off the apparatus response path.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive/walk, flat): the concrete apron/drive (1, drive) + its white stripes/stalls (11), the dead lawn (4), desert (0). STRUCTURES (¾ front face, solid): the station quarters (2, ENTERABLE -> apparatus floor + day room/dorm/offices), the apparatus BAY doors (6, on the building front), the HOSE TOWER (7, tall). PROPS / VEHICLES (solid): the fire ENGINES (8, the red hero), abandoned staff cars (10), pole lights (9), the flagpole (12). PORTALS: the gate (5). The station + tower are the vertical mass; the red rigs sit on the broad light apron you drive across.

### Decisions & rulings
- Act-1 DEAD: rigs faded to rust with flat tyres + seized pumps, a bleached hose tower, boarded quarters, cracked apron, a dead flagpole, the bell silent. No crew (LIFE places agents later).
- Civic category (firestation). Zero purple. No department name/number (Paolo's to author if ever).
- The apron is the light hero surface (drive-code 1) so the RED engines pop — the deliberate inversion of the usual dark-asphalt base, for a clean fire-station read.
- Drive-through bay logic honored (pull straight out, no backing) per the safety standard.
- Research-first (per the playbook): built from real fire-station design standards, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the lot edge (setback) | ground | no | — | 2649 |
| 1 | `#565248` | concrete apron / drive | drive | the cracked concrete apparatus apron + drive — the rigs stage here and pull straight to the street (car-drivable) | ground | no | — | 2075 |
| 2 | `#7a6f5c` | building (station quarters) | building | the station — living quarters + admin, windows boarded, the bell dead | structure | yes | station interior: the apparatus floor up front, the day room + dorm + kitchen + offices behind | 3205 |
| 3 | `#3a4526` | dead landscaping | tree-dead | a dead shrub / tree at the lot edge | prop | no | — | 12 |
| 4 | `#49512e` | dead lawn | ground | the dead lawn edging the apron | ground | no | — | 4598 |
| 5 | `#c79a3f` | gate / entrance | gate | the apron pull-out onto the street, amber curb, the rigs launched from here | portal | no | — | 2 |
| 6 | `#8a2f22` | apparatus bay door | structure | a roll-up apparatus bay door on the station front, paint peeling, glass gone | structure | yes | — | 92 |
| 7 | `#6a6358` | hose / drying tower | structure | the hose-drying + training tower, tall, concrete bleached, ladder rusted | structure | yes | — | 767 |
| 8 | `#c0392b` | fire engine (rig) | vehicle | a fire engine dead on the apron, red faded to rust, tyres flat, pump seized | prop | yes | — | 399 |
| 9 | `#8f8676` | pole light | prop | an apron pole light, head dark | prop | yes | — | 5 |
| 10 | `#55555f` | abandoned staff car | vehicle | a crew car left in the staff stalls, dust-caked | prop | yes | — | 272 |
| 11 | `#c9c1aa` | white marking | ground | faded white paint — the apron guideline stripes + the staff parking stalls | ground | no | — | 536 |
| 12 | `#b0863a` | flagpole / plaza | prop | the empty flagpole at the station entry, halyard slapping | prop | yes | — | 1 |
| 13 | `#625d51` | training yard | ground | the concrete drill / training yard — hose racks, wreck cars for extrication, drill marks, all weathered | ground | no | — | 1771 |

**Gate:** `gates/firestation_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
