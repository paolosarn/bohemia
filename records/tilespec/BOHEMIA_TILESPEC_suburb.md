# BOHEMIA DISTRICT DOSSIER — SUBURB

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_suburb.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Walled tract-home neighborhood — cul-de-sac streets off the gate, homes with front-garage driveways, packed lots, dead-dirt yards.**

### Real-world reference
- Vegas suburb: ~14x8m house body + 6x6m front garage + 6m driveway on ~16m lots; ~85-90% single-family by land area; curvilinear cul-de-sacs, walled, few entries

### Layout — what is where
- Cul-de-sac streets branch off the entrance gate; homes line them on packed ~0.15-acre lots.
- Each home: a short driveway apron -> a front-corner garage -> the house body; 2-story homes add an upper-floor mass (code 9).
- A perimeter block wall; dead-dirt yards — NO vegetation ever in act 1.
- Cluster-aware: fills a cw x ch union as ONE connected neighborhood (snaps into 1x2 / 2x2).

### Circulation (street-aware / drivable)
Street-aware: gates only on street edges (a corner exits two streets); roads reach every lot from the gate (roadConnected). Driveways (code 3) + roads (code 1) are the drivable surface.

### Decisions & rulings
- Every home has a proper street -> driveway -> front-garage (Paolo ruling).
- MODULARITY LAW: must snap into 1x2 / 2x2, connected.
- Loops + garden-curve variants GRAVEYARDED (7/18 verdict) — THE BLOCK packed grid is the one canonical suburb block.

### Tile legend — every code, its material to skin
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
