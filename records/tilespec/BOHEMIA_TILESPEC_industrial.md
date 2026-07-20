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

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: asphalt, truck court, trailer stall stripes (flat, drive on them). STRUCTURES (¾ front face, solid): the warehouse (2, ENTERABLE -> open floor + racking), the office (6) + guard shack (11, both enterable), the fence (3). PORTAL: the dock doors (4) — solid wall when closed, an opening into the warehouse floor when up; the truck gate (5). PROPS solid: parked trailers (9, big boxes you route around), containers (10). The warehouse occupies its whole footprint (block) and draws up as a tall face along the dock row.

### Decisions & rulings
- REBUILT from real DC research (Paolo: research the real thing first).
- Gate hardened to all 6 placements + a drive-reach assertion (7/19).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt / gravel (setback, yard gaps) | ground | no | — | — |
| 1 | `#33333c` | asphalt drive | drive | cracked asphalt drive lane / employee lot (car-drivable) | ground | no | — | 7326 |
| 2 | `#7a7a82` | warehouse | building | big tilt-up concrete box, rusted metal siding, dark | structure | yes | WAREHOUSE INTERIOR: one big open floor, tall racking aisles, the dock doors seen from inside, a small office corner | 3875 |
| 3 | `#4a4438` | fence | fence | chain-link perimeter fence, sagging, some down | structure | yes | — | 497 |
| 4 | `#c7a24a` | dock door | building | roll-up loading dock door, dented, some open black | portal | no | through the dock into the warehouse floor | 19 |
| 5 | `#c79a3f` | gate / truck gate | gate | wide drive-in yard gate, amber curb paint | portal | no | — | 11 |
| 6 | `#8c8477` | office | building | small front office block, broken glass | structure | yes | office interior: reception + a few rooms | 30 |
| 7 | `#3f3f47` | truck court | drive | cracked concrete truck apron (backing area, drivable) | ground | no | — | 1765 |
| 8 | `#c9c1aa` | trailer stall stripe | marking | faded trailer-stall stripe on asphalt | ground | no | — | 1228 |
| 9 | `#5a5a64` | parked trailer | vehicle | abandoned box trailer, faded, some tagged | prop | yes | — | 1536 |
| 10 | `#6b5a3a` | container | prop | rusted shipping container, dented, stacked | prop | yes | — | 72 |
| 11 | `#9a8a6a` | guard shack | building | small guard booth at the gate, dark | structure | yes | tiny guard-booth interior (one room) | 25 |

**Gate:** `gates/industrial_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
