# BOHEMIA DISTRICT DOSSIER — GOLF

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_golf.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead golf course section — a winding run of holes (tee -> brown fairway -> green with a pin, sand bunkers + a dry pond) with the abandoned clubhouse, parking, driving range + putting green clustered at the street entrance, cart paths threading it all.**

### Real-world reference
- Golf course design guides (Under Armour "Golf Course Layout 101", Keiser College of Golf "How to Design a Golf Course", Archweb): every hole is a TEE BOX -> winding FAIRWAY through ROUGH -> GREEN with a pin, guarded by SAND BUNKERS + WATER HAZARDS; infrastructure = a CLUBHOUSE (pro shop, grill, locker rooms), TRAINING (driving range + putting green), CART PATHS + signage, PARKING at the entrance; modern routing sends the front nine OUT from the clubhouse and the back nine back IN. A full course is ~50ha, so one 96m cell holds a SECTION: the clubhouse complex on the street + a few holes winding away.

### Layout — what is where
- The whole parcel is dead ROUGH (dry scrub) with desert only at the very margins; FAIRWAYS are mown corridors cut through it, winding (never straight) from tee to green.
- Three holes: hole 1 heads out NE to a bunkered green, hole 2 bends back NW guarded by the dry water hazard, hole 3 is a short north hole. Each has a tee box, a green with a leaning pin, and sand bunkers.
- The CLUBHOUSE + pro shop sits at the south entrance, flanked by two PARKING lots (a forgotten cart in one), with the DRIVING RANGE (tee line + mats + downrange targets) and a practice PUTTING GREEN beside it.
- CART PATHS run from the parking up a central spine and branch to each hole — the drivable network.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the clubhouse entrance drive is on the primary street; the parking lots + the whole cart-path network (code 1) are the drivable surface (a cart/maintenance vehicle reaches the course from the curb), reachable in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/cross, flat): the fairways (4), rough (3), greens (6), tee boxes (9), sand bunkers (7), dry pond bed (8), desert (0), and the cart-path/parking asphalt (1, drive on it). STRUCTURE (¾ front face, solid, ENTERABLE -> clubhouse interior): the clubhouse/pro shop (2). PROPS (weave between): the flagsticks (10, on the greens), range mats/targets (11), dead trees (12), the abandoned cart (13). The clubhouse is the one vertical mass; the course is a low rolling ground you walk and drive across, greens/bunkers/pond reading as color patches in the dead brown.

### Decisions & rulings
- Act-1 DEAD: brown dead fairways + rough, dry cracked pond beds, sand traps drifted with dust, dead ornamental trees, an abandoned cart, a boarded clubhouse, cracked cart paths, bleached flags. No living turf.
- Leisure category (golf). Zero purple.
- ONE cell = a SECTION of a course, not 18 holes (a full course dwarfs a 96m cell) — the clubhouse anchors the street edge, holes wind away, and adjacent golf cells continue the routing.
- Water hazard is seed-optional (some sections have a pond, some do not) but never a sliver — absent or a real pond.
- Research-first (per the playbook): built from real golf-course routing + infrastructure, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt out of bounds at the parcel edge | ground | no | — | 2433 |
| 1 | `#6f6b62` | cart path / parking asphalt | drive | cracked cart-path + clubhouse parking asphalt (car/cart-drivable) | ground | no | — | 1201 |
| 2 | `#7a6f5c` | building (clubhouse / pro shop) | building | the abandoned clubhouse + pro shop, boarded, faded | structure | yes | clubhouse interior: pro shop + bag room up front, grill + locker rooms behind | 217 |
| 3 | `#403a20` | dead rough | ground | dry knee-high scrub + weeds between the holes (out of the short grass) | ground | no | — | 9726 |
| 4 | `#776d38` | dead fairway | ground | the brown dead mown corridor of a hole — flat, walkable, cart-crossable | ground | no | — | 1822 |
| 5 | `#c79a3f` | gate / entrance | gate | the drive-in entrance off the street, amber curb | portal | no | — | 7 |
| 6 | `#7d8a4a` | green (putting surface) | ground | a dead putting green, the cup still cut, ringed by a collar | ground | no | — | 354 |
| 7 | `#c9be93` | sand bunker | ground | a sand trap, still pale, half-drifted with dust | ground | no | — | 155 |
| 8 | `#5a5b52` | dry water hazard | ground | a cracked dry pond bed, cattails dead at the rim | ground | no | — | 272 |
| 9 | `#5c5a30` | tee box | ground | a level tee pad, markers toppled, turf dead | ground | no | — | 100 |
| 10 | `#b04a3a` | flagstick / pin | prop | a leaning flagstick in the cup, the flag a bleached rag | prop | yes | — | 1 |
| 11 | `#8f8676` | driving-range mat / target | prop | a rubber range mat / a downrange yardage target, weathered | prop | yes | — | 14 |
| 12 | `#2f2a18` | dead tree / landscaping | tree-dead | a dead ornamental tree dotting the rough | prop | no | — | 78 |
| 13 | `#8a6a5a` | abandoned golf cart | vehicle | a golf cart left in the lot, tyres flat, dust-caked | prop | yes | — | 4 |

**Gate:** `gates/golf_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
