# BOHEMIA DISTRICT DOSSIER — COURTHOUSE

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_courthouse.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead courthouse — a grand columned stone building with office wings and a central dome, a portico + monumental steps down to a civic plaza with the Justice statue + flagpoles, a small visitor lot + a prisoner sally port on the secure wing.**

### Real-world reference
- Civic / courthouse design (classical seat-of-law: a grand columned MASS + PORTICO + central DOME/rotunda, monumental STEPS to a civic PLAZA, office WINGS, a secure prisoner SALLY PORT for transport, a statue of Justice): the monumental civic building form.

### Layout — what is where
- The COURTHOUSE is the hero: a big columned stone mass with office WINGS and a central DOME over the rotunda, window/cornice detail down its face.
- A grand PORTICO colonnade + monumental STEPS descend to a civic PLAZA with the Justice STATUE + flanking FLAGPOLES.
- A small VISITOR lot flanks the plaza; a prisoner SALLY PORT bay sits on the secure wing; dead landscaping edges the square.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: a small drive on the primary street feeds the visitor lot + the secure sally lane (code 1 reaches them from the curb, K.driveReachFromStreet). Foot circulation is the plaza -> steps -> portico. WALKABLE-LAND: a courthouse IS its building — nearly all structure + plaza; the lots are minimal. Corner side streets get a pedestrian gate onto the plaza.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the plaza (7), lawn (4), sidewalk (12), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the COURTHOUSE (2 -> rotunda + courtrooms + chambers + holding) with the DOME (10) + PORTICO columns (8) + grand STEPS (6). PROPS: the Justice STATUE (11), FLAGPOLES (13), pole lights (9), dead landscaping (3). PORTALS: the gate (5), the sally port. The columned mass + dome are the vertical hero; you climb the steps through the portico.

### Decisions & rulings
- Act-1 DEAD: boarded, the dome streaked, columns cracked, seals defaced, the plaza weed-split. Whose law rules now is faction canon (Paolo's).
- Civic category (courthouse). Zero purple. No jurisdiction/seal (Paolo's to author).
- WALKABLE-LAND honored (easily): the building + plaza dominate; lots minimal.
- Research-first (per the playbook): built from the classical courthouse form, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the civic-square edge (setback) | ground | no | — | 2671 |
| 1 | `#3a3a42` | drive / lot | drive | the small visitor lot + the secure sally lane (car-drivable) | ground | no | — | 891 |
| 2 | `#7a7365` | building (courthouse) | building | the courthouse — columned stone mass + office wings, boarded, seals defaced | structure | yes | courthouse interior: the rotunda + courtrooms off the public hall, clerk + records + judges' chambers in the wings, holding by the sally port | 5828 |
| 3 | `#3a4526` | landscaping | tree-dead | a dead civic tree / hedge on the square | prop | no | — | 1 |
| 4 | `#49512e` | lawn | ground | the dead civic-square lawn | ground | no | — | 1603 |
| 5 | `#c79a3f` | gate | gate | the civic-square entrance off the street, amber curb | portal | no | — | 5 |
| 6 | `#8a8175` | grand steps | structure | the monumental stone steps rising to the portico | structure | yes | — | 689 |
| 7 | `#8f8676` | plaza | ground | the civic plaza before the steps, cracked pavers, weeds | ground | no | — | 1451 |
| 8 | `#a89e8a` | portico columns | structure | the grand portico colonnade across the front, a column or two cracked | structure | yes | — | 299 |
| 9 | `#8f8676` | pole light | prop | a civic pole light, head dark | prop | yes | — | 2 |
| 10 | `#9a9082` | dome / cupola | structure | the central dome / cupola over the rotunda, copper streaked green-black | structure | yes | — | 292 |
| 11 | `#b0863a` | statue / monument | prop | the Justice statue / civic monument on the plaza, weathered | prop | yes | — | 37 |
| 12 | `#6a675e` | sidewalk | ground | the civic-square terrace / sidewalk, cracked | ground | no | — | 2613 |
| 13 | `#c79a3f` | flagpole | prop | a flagpole flanking the plaza, halyard slapping | prop | yes | — | 2 |

**Gate:** `gates/courthouse_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
