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

### Decisions & rulings
- CLUSTERED-POWER lore: this plant is INTACT + generating while the world is dead — panels/switchgear read maintained, NOT decayed (unlike other districts).
- driveConnected + full 6-placement gate coverage added 7/19.

### Tile legend — every code, its material to skin
| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare desert dirt (setback between fence and field) | 1667 tiles | [PENDING Paolo] |
| 1 | `#5a5346` | gravel access road | drive | compacted gravel O&M road (maintenance-vehicle drivable) | 8989 tiles | [PENDING Paolo] |
| 2 | `#7a7266` | control building | building | small intact concrete control/switch house (powered) | 126 tiles | [PENDING Paolo] |
| 3 | `#4a4438` | fence | fence | intact chain-link security fence + posts (maintained) | 871 tiles | [PENDING Paolo] |
| 4 | `#6b6b74` | inverter / transformer pad | structure | concrete pad + intact inverter/transformer box, humming | 156 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | gate | gate | security drive gate off the access road, amber curb | 7 tiles | [PENDING Paolo] |
| 6 | `#8a8a92` | substation switchgear | structure | switchyard racks, breakers, bus — intact, live | 320 tiles | [PENDING Paolo] |
| 7 | `#2e3440` | solar panel | panel | PV panel row, dark blue-black glass, clean (still generating) | 4248 tiles | [PENDING Paolo] |

**Gate:** `gates/solar_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
