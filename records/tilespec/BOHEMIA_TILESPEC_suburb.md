# BOHEMIA TILE SPEC — SUBURB

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_suburb.js` (LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground (yard) | ground | dead-dirt front/back yard, no grass, cracked | 7601 tiles | [PENDING Paolo] |
| 1 | `#33333c` | road | drive | cracked residential street asphalt (car-drivable) | 2947 tiles | [PENDING Paolo] |
| 2 | `#8a8478` | house | building | single-story stucco tract house, faded, dark windows | 3545 tiles | [PENDING Paolo] |
| 3 | `#3f3f47` | driveway | drive | cracked concrete driveway apron (drivable to garage) | 288 tiles | [PENDING Paolo] |
| 4 | `#6b6152` | wall | fence | block perimeter wall / side fence, tan stucco, chipped | 501 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | gate | gate | neighborhood street entrance off the arterial | 7 tiles | [PENDING Paolo] |
| 6 | `#6b6b74` | garage | building | front-corner garage, steel roll door, dented | 1148 tiles | [PENDING Paolo] |
| 9 | `#9a938a` | house upper floor | building | 2-story house upper mass (taller top-down read) | 347 tiles | [PENDING Paolo] |

**Gate:** `gates/suburb_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
