# BOHEMIA DISTRICT DOSSIER — CITYHALL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_cityhall.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead city hall — a wide low modern administrative block with a stopped clock tower, a public forecourt plaza with a bone-dry reflecting fountain and flagpoles, a civic-seal monument, notice kiosks, a sidewalk to a small visitor lot. The executive/administrative seat, distinct from the judicial courthouse.**

### Real-world reference
- US municipal civic-center precedent: a modern low-rise administrative block (mayor's office, council chamber, city clerk, permits counter) rather than the classical colonnaded language a courthouse uses; a CLOCK TOWER is the conventional City Hall landmark feature; a public forecourt PLAZA with a reflecting fountain and flagpoles reads as "come to a public meeting" civic space; visitor parking stays modest — city hall draws walk-ins and bus/transit riders, not commuter volume, unlike a big-box civic campus.

### Layout — what is where
- The ADMINISTRATIVE BLOCK sits at the back (north) of the lot with the CLOCK TOWER rising off its front face — the vertical landmark, distinct from courthouse's dome.
- A public PLAZA fills the forecourt: a dry reflecting FOUNTAIN at its center, flagpoles flanking it, the civic SEAL monument near the entry edge, notice KIOSKS at the plaza corners.
- A SIDEWALK band links the plaza to a small VISITOR lot (SW) — modest, not commuter-scaled.
- Dead landscaping edges the lawn; pole lights mark the lot corners.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the visitor lot + entrance drive (code 1) reach the curb from any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate onto the sidewalk/plaza rather than a second car entrance. Foot circulation is plaza -> sidewalk -> tower entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the plaza (7), lawn (4), sidewalk (11), the dry fountain basin (8, water-dead), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the CITY HALL block (2 -> public counter/records, council chamber, mayor's + department offices) with the CLOCK TOWER (6). PROPS: the civic seal monument (10), flagpoles (12), notice kiosks (13), pole lights (9). PORTALS: the gate (5). The block + tower are the vertical mass; the plaza and its dry fountain are the public forecourt you cross to reach the doors.

### Decisions & rulings
- Act-1 DEAD: the clock stopped, doors chained, fountain bone dry with old waterline stains, the civic seal toppled and oxidized, notices rotted off the kiosk. Whose administration (if any) runs it now is faction canon (Paolo's).
- Civic category (cityhall), filed alongside courthouse/library/firestation. Zero purple.
- Deliberately differentiated from courthouse: a modern administrative block + clock tower (not classical columns + dome), a fountain-centered public plaza (not just cracked pavers), no sally port (city hall has no jail function).
- WALKABLE-LAND honored: the block + tower + plaza dominate; the visitor lot is minimal by design (walk-in/transit civic use, not commuter parking).
- Research-first (per the playbook): built from real municipal civic-center precedent, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the civic-block edge (setback) | ground | no | — | 2475 |
| 1 | `#4a463c` | drive / lot | drive | the small visitor lot + entrance drive (car-drivable) | ground | no | — | 1678 |
| 2 | `#726a58` | building (city hall) | building | the administrative block — mayor's office, council chamber, clerk + permits counter — windows boarded, doors chained | structure | yes | city hall interior: the public counter + records hall up front, the council chamber behind it, the mayor's + department offices in the wings | 3560 |
| 3 | `#3a4526` | dead landscaping | tree-dead | a dead civic tree / hedge at the lawn edge | prop | no | — | 15 |
| 4 | `#49512e` | lawn | ground | the dead civic lawn ringing the block | ground | no | — | 4607 |
| 5 | `#c79a3f` | gate | gate | the lot entrance off the street, amber curb | portal | no | — | 2 |
| 6 | `#847a64` | clock tower | structure | the clock tower over the entrance, hands stopped, face cracked | structure | yes | — | 246 |
| 7 | `#8f887a` | plaza | ground | the public forecourt plaza before city hall, pavers cracked, weeds through the joints | ground | no | — | 3040 |
| 8 | `#5a6660` | dry fountain | water-dead | the reflecting fountain at the plaza's center, bone dry, basin stained with old waterlines | ground | no | — | 253 |
| 9 | `#8f8676` | pole light | prop | a plaza pole light, head dark | prop | yes | — | 4 |
| 10 | `#9c8e76` | civic seal / monument | prop | the city seal monument at the plaza entry, toppled, bronze gone green | prop | yes | — | 1 |
| 11 | `#b7ae98` | sidewalk | ground | the sidewalk band linking the plaza to the visitor lot, cracked | ground | no | — | 499 |
| 12 | `#8a7f5e` | flagpole | prop | a flagpole flanking the fountain, halyard slapping, no flag left | prop | yes | — | 2 |
| 13 | `#635c4a` | bulletin / notice kiosk | prop | a public-notice kiosk at the plaza edge, the meeting agendas long since rotted off | prop | yes | — | 2 |

**Gate:** `gates/cityhall_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
