# BOHEMIA DISTRICT DOSSIER — INDUSTRIAL

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_industrial.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Distribution center — one big warehouse, a dock-door row, a truck court, a trailer yard, a front office + employee lot, a guard shack, fenced.**

### Real-world reference
- Real DC site plans (renoindustrial.com, steelcobuildings.com, alliedbuildings.com): one big box (not equal sheds), dock doors ~14ft o.c., a ~130ft truck court, ~1 trailer stall per dock, a front office + car park, fenced drive-in gates

### Layout — what is where
- ONE big warehouse backs the far edge (a DC is one box).
- A row of dock doors along the front feeds a deep truck-court apron for backing trailers.
- Trailer staging + a parking yard (striped stalls, many parked trailers); an employee car lot + office + guard shack at the front; shipping containers; a perimeter fence.

### Circulation (street-aware / drivable)
Street-aware: exits the streets it touches with wide drive-in TRUCK gates; the asphalt + truck court form one connected yard reachable from the gate (driveConnected). Verified connected in all 6 placements.

### Decisions & rulings
- REBUILT from real DC research (Paolo: research the real thing first).
- Gate hardened to all 6 placements + a drive-reach assertion (7/19).

### Tile legend — every code, its material to skin
| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt / gravel (setback, yard gaps) | — | [PENDING Paolo] |
| 1 | `#33333c` | asphalt drive | drive | cracked asphalt drive lane / employee lot (car-drivable) | 7326 tiles | [PENDING Paolo] |
| 2 | `#7a7a82` | warehouse | building | big tilt-up concrete box, rusted metal siding, dark | 3875 tiles | [PENDING Paolo] |
| 3 | `#4a4438` | fence | fence | chain-link perimeter fence, sagging, some down | 497 tiles | [PENDING Paolo] |
| 4 | `#c7a24a` | dock door | building | roll-up loading dock door, dented, some open black | 19 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | gate / truck gate | gate | wide drive-in yard gate, amber curb paint | 11 tiles | [PENDING Paolo] |
| 6 | `#8c8477` | office | building | small front office block, broken glass | 30 tiles | [PENDING Paolo] |
| 7 | `#3f3f47` | truck court | drive | cracked concrete truck apron (backing area, drivable) | 1765 tiles | [PENDING Paolo] |
| 8 | `#c9c1aa` | trailer stall stripe | marking | faded trailer-stall stripe on asphalt | 1228 tiles | [PENDING Paolo] |
| 9 | `#5a5a64` | parked trailer | vehicle | abandoned box trailer, faded, some tagged | 1536 tiles | [PENDING Paolo] |
| 10 | `#6b5a3a` | container | prop | rusted shipping container, dented, stacked | 72 tiles | [PENDING Paolo] |
| 11 | `#9a8a6a` | guard shack | building | small guard booth at the gate, dark | 25 tiles | [PENDING Paolo] |

**Gate:** `gates/industrial_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
