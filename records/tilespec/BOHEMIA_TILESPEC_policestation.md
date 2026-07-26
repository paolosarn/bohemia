# BOHEMIA DISTRICT DOSSIER — POLICESTATION

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_policestation.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead police station — a big HQ building (public lobby front, secure wing back), a fenced secure yard with the sally port + patrol-fleet motor pool + maintenance bay, a fenced impound yard of seized wrecks, a public plaza + visitor lot + flagpole, roof antennas.**

### Real-world reference
- Police-station design guides (Fentress sally-port + secure-parking best practices, BSW / MW Studios station projects): a big STATION with a PUBLIC lobby strictly SEPARATED from the SECURE side; a SALLY PORT (enclosed prisoner-transport garage) NOT visible from public roads/parking, inside a fenced SECURE area with the MOTOR POOL fleet + a maintenance bay + fuel; a separate PUBLIC visitor entrance + lot; evidence, cells, squad behind the secure line.

### Layout — what is where
- A big STATION HQ block sits front-centre (public lobby + entrance steps facing the street; the secure wing behind).
- The PUBLIC front has a plaza + flagpole + a small VISITOR lot to the west, kept separate from the secure side.
- A fenced SECURE YARD wraps the east + back: the SALLY PORT on the station back, the patrol-fleet MOTOR POOL, and a vehicle MAINTENANCE bay.
- A fenced IMPOUND yard of seized wrecks sits SW-back; roof antennas + pole lights dress the campus.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the drive enters on the primary street and branches to the PUBLIC visitor lot and, through the secure-yard gate, to the SECURE motor pool + impound (code 1 reaches them from the curb, K.driveReachFromStreet). Public and secure circulation are strictly separated (the design rule). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive/walk, flat): the drive + lots (1, drive), the secure-yard concrete (4), the plaza/steps + markings (11), landscaping (3), desert (0). STRUCTURES (¾ front face, solid): the STATION (2, ENTERABLE -> public lobby + secure cells/evidence/sally bay), the SALLY PORT (6), the maintenance bay (2), roof ANTENNAS (10), the secure FENCE/wall (12). VEHICLES (solid): the patrol FLEET (7), impound WRECKS (8). PROPS: pole lights (9), the FLAGPOLE (13). PORTALS: the gate (5). The HQ + secure complex are the mass; the public plaza fronts the street, the secure yard is walled behind.

### Decisions & rulings
- Act-1 DEAD: boarded lobby, barred windows, patrol cars + impound wrecks rusting, cells open, dead antennas. No officers (LIFE + factions place agents later — faction ownership is Paolo's).
- Civic category (policestation). Zero purple. No department name/badge (Paolo's to author).
- Public/secure separation honored (the key design rule); WALKABLE-LAND: the building + secure complex dominate, the lots are minimal.
- Research-first (per the playbook): built from real police-station site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus edge (setback) | ground | no | — | 2659 |
| 1 | `#3a3a42` | drive / lot | drive | the entrance drive + visitor lot + secure-yard lane (car-drivable) | ground | no | — | 1249 |
| 2 | `#6a6f7a` | building (station) | building | the police HQ — public lobby front, dark, windows barred; the secure wing behind | structure | yes | station interior: public lobby + records + duty desk up front; behind the secure line, cells + evidence + squad + the sally-port bay | 3144 |
| 3 | `#3a4526` | landscaping | tree-dead | a dead civic shrub / tree at the campus edge | prop | no | — | 1131 |
| 4 | `#4a4842` | secure-yard concrete | ground | the concrete of the fenced secure yard / campus ground, cracked | ground | no | — | 5428 |
| 5 | `#c79a3f` | gate | gate | the campus drive entrance off the street, amber curb | portal | no | — | 2 |
| 6 | `#5a5f66` | sally port | structure | the enclosed sally-port bay (prisoner transport) on the station back, door seized | structure | yes | — | 117 |
| 7 | `#cfcfc6` | patrol car (fleet) | vehicle | a black-and-white patrol car in the secure motor pool, faded, tyres flat | prop | yes | — | 435 |
| 8 | `#7a5040` | impound wreck | vehicle | a seized / wrecked car in the fenced impound yard, rusting | prop | yes | — | 450 |
| 9 | `#8f8676` | pole light | prop | a campus pole light, head dark | prop | yes | — | 5 |
| 10 | `#8a8478` | roof antenna / dish | structure | a dead comms antenna / dish on the station roof | structure | yes | — | 36 |
| 11 | `#b0b0a4` | marking / plaza | ground | the public plaza + entrance steps + faded stall/hazard paint | ground | no | — | 1432 |
| 12 | `#6a6a72` | fence / wall | structure | the secure-perimeter fence / wall separating public from secure | structure | yes | — | 294 |
| 13 | `#b0863a` | flagpole | prop | the flagpole on the public plaza, halyard slapping | prop | yes | — | 2 |

**Gate:** `gates/policestation_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
