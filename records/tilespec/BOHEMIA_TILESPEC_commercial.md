# BOHEMIA TILE SPEC — COMMERCIAL

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_commercial.js` (LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / landscape gaps) | 972 tiles | [PENDING Paolo] |
| 1 | `#33333c` | parking asphalt | drive | cracked asphalt parking field (car-drivable) | 2160 tiles | [PENDING Paolo] |
| 2 | `#7a7266` | store | building | strip-mall storefront box, dead signage, dark glass | 5329 tiles | [PENDING Paolo] |
| 3 | `#3f3f47` | drive aisle | drive | cracked asphalt lot drive aisle (drivable) | 4675 tiles | [PENDING Paolo] |
| 4 | `#c9c1aa` | stall stripe | marking | faded parking-stall stripe | 1120 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | curb cut / gate | gate | driveway curb cut off the street, amber paint | 21 tiles | [PENDING Paolo] |
| 6 | `#8a8a92` | sidewalk | walk | cracked concrete storefront sidewalk | 500 tiles | [PENDING Paolo] |
| 7 | `#c7a24a` | store door | building | shop entry, boarded / broken glass door | 22 tiles | [PENDING Paolo] |
| 8 | `#2b2b31` | service alley | drive | rear service lane (trash/delivery, drivable) | 1563 tiles | [PENDING Paolo] |
| 9 | `#b0863a` | service door | building | back roll-up / steel service door | 22 tiles | [PENDING Paolo] |
| 10 | `#6b6b74` | gas canopy | structure | fuel-island canopy, faded brand, sagging | — | [PENDING Paolo] |
| 11 | `#9a5a4a` | gas pump | prop | dead fuel pump, dust-caked, hoses down | — | [PENDING Paolo] |

**Gate:** `gates/commercial_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
