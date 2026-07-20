# BOHEMIA DISTRICT DOSSIER — SOLAR

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_solar.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Utility solar farm — panel arrays, gravel access roads, inverter/transformer pads, a substation switchyard + control building, fenced. INTACT + generating (clustered-power lore).**

### Real-world reference
- Real utility-solar sites (pvfarm.io, pvcase.com): long panel rows, 20-30ft gravel O&M roads splitting the field into blocks, an inverter/transformer pad per block, a project substation switchyard, a control building, a perimeter fence + driveway gate

### Layout — what is where
- Panel array rows fill the field; gravel access roads split it into blocks.
- An inverter/transformer pad anchors each block; a substation switchyard + control building in a corner link to the grid; a perimeter fence + a driveway gate.

### Circulation (street-aware / drivable)
Street-aware: a security drive gate off the access road on the street(s) it touches; the gravel roads run edge-to-edge and are reachable from the gate in any placement (driveConnected).

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: the gravel O&M roads (walk/drive). STRUCTURES (¾ front face, solid): the panel arrays (7) sit on waist-to-head-high racks and block movement — you route BETWEEN them on the gravel roads (the field is not a walkable floor); the control building (2, ENTERABLE -> switch room), the substation switchgear (6, a fenced equipment yard, solid, not enterable), the fence (3). PROP solid: the inverter/transformer pads (4). PORTAL: the gate (5). Panels could later be a walk-under overhead in spots, but for now treat the array as solid — the roads are the movement network.

### Decisions & rulings
- CLUSTERED-POWER lore: this plant is INTACT + generating while the world is dead — panels/switchgear read maintained, NOT decayed (unlike other districts).
- driveConnected + full 6-placement gate coverage added 7/19.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare desert dirt (setback between fence and field) | ground | no | — | 1667 |
| 1 | `#5a5346` | gravel access road | drive | compacted gravel O&M road (maintenance-vehicle drivable) | ground | no | — | 8989 |
| 2 | `#7a7266` | control building | building | small intact concrete control/switch house (powered) | structure | yes | control-room interior: switchgear panels, a monitoring desk (lit, powered) | 126 |
| 3 | `#4a4438` | fence | fence | intact chain-link security fence + posts (maintained) | structure | yes | — | 871 |
| 4 | `#6b6b74` | inverter / transformer pad | structure | concrete pad + intact inverter/transformer box, humming | structure | yes | — | 156 |
| 5 | `#c79a3f` | gate | gate | security drive gate off the access road, amber curb | portal | no | — | 7 |
| 6 | `#8a8a92` | substation switchgear | structure | switchyard racks, breakers, bus — intact, live | structure | yes | — | 320 |
| 7 | `#2e3440` | solar panel | panel | PV panel row, dark blue-black glass, clean (still generating) | structure | yes | — | 4248 |

**Gate:** `gates/solar_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
