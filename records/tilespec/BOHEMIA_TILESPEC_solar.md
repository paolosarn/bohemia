# BOHEMIA TILE SPEC — SOLAR

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_solar.js` (LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

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
