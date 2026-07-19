# BOHEMIA TILE SPEC — MEDICAL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_medical.js` (LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / unbuilt gaps) | 2886 tiles | [PENDING Paolo] |
| 1 | `#33333c` | drive / asphalt | drive | cracked asphalt drive lane / parking aisle (car-drivable) | 4702 tiles | [PENDING Paolo] |
| 2 | `#8a8478` | building | building | concrete/panel hospital, ER wing, MOB — grimy, dark windows | 3491 tiles | [PENDING Paolo] |
| 3 | `#55503f` | dead planter island | tree-dead | dry curbed planter, dead shrub stumps, gravel | 56 tiles | [PENDING Paolo] |
| 4 | `#c7a24a` | entrance door | building | boarded / cracked glass main + ambulance doors, amber frame | 6 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | gate / curb cut | gate | campus vehicle entrance, amber curb paint | 14 tiles | [PENDING Paolo] |
| 6 | `#7a7a80` | walkway / crosswalk | walk | faded concrete walkway + crosswalk stripes | 643 tiles | [PENDING Paolo] |
| 7 | `#9a9088` | canopy | structure | sagging entrance / ambulance drive-through canopy | 198 tiles | [PENDING Paolo] |
| 8 | `#4c4c55` | parking garage | structure | decked concrete garage shell, columns, ramp | 2130 tiles | [PENDING Paolo] |
| 9 | `#b04038` | helipad | marking | faded rooftop-red helipad circle + H, cracked | 81 tiles | [PENDING Paolo] |
| 10 | `#c9c1aa` | parking stall | marking | faded stall stripe on asphalt | 1100 tiles | [PENDING Paolo] |
| 11 | `#5a5a64` | parked vehicle | vehicle | abandoned car / dead ambulance, dust-caked | 1077 tiles | [PENDING Paolo] |

**Gate:** `gates/medical_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
