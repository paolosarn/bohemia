# BOHEMIA DISTRICT DOSSIER — APARTMENT

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_apartment.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead garden apartment complex — three 2-3 story buildings with exterior breezeway stairs on internal drive aisles, a drained pool + boarded-up clubhouse near the entrance, carports, a mailbox kiosk, dumpster enclosures. Closes the SUBURB_FAMILY gap the LANDLOCKED DISTRICT LAW flagged.**

### Real-world reference
- Sun Belt garden-apartment norm (Vegas/Phoenix low-rise multifamily): 2-3 story buildings, EXTERIOR breezeway stair access (no elevator, no interior double-loaded corridor — that's a colder-climate/urban typology), buildings arranged in parallel rows on internal drive aisles, a shared pool + leasing office near the entrance, carports, cluster mailboxes, dumpster enclosures.

### Layout — what is where
- Three parallel apartment building rows on internal drive aisles tied by a spine street to the entrance.
- Each row has two EXTERIOR STAIR breezeways (no elevator) and a carport row along its front, some carport bays with a dead car.
- Near the south entrance: a drained pool, a small clubhouse/leasing office, a mailbox kiosk, and two dumpster enclosures.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entrance gate is on the primary street; a spine street ties all three internal drive aisles to the gate (code 1 reaches every row, K.driveReachFromStreet). WALKABLE-LAND: the building mass + carports + pool/clubhouse dominate; the drive aisles are the connective ladder.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): parking asphalt (4), the drive aisles/street (1), desert (0), the drained pool (8, not solid — you can walk into the empty basin). OVERHEAD (park/walk UNDER): the carport rows (6). STRUCTURES (¾ front face, solid): the apartment buildings (2, ENTERABLE -> breezeway + unit), the clubhouse (7, ENTERABLE), the exterior stairs (15), dumpster enclosures (14), the fence (12). PROPS/VEHICLES (solid): mailbox kiosk (13), abandoned cars (10). PROPS: pole lights (9), weeds (3). PORTALS: the gate (5). The three building rows are the mass; you drive the aisle-and-spine ladder between them.

### Decisions & rulings
- Act-1 DEAD: pool drained + cracked, clubhouse dark, some units boarded, weeds through the lot, dead cars under carports. Who squats/holds units here is faction/LIFE canon (Paolo's).
- RESIDENTIAL category, joins SUBURB_FAMILY in bohemia_world.js (suburb/gated/estate/apartment) — landlocked interior apartment cells now relay through it exactly like suburb.
- EXTERIOR breezeway stairs, not an interior corridor — the correct Sun Belt garden-apartment typology, not a cold-climate mid-rise. Zero purple.
- WALKABLE-LAND honored: three building rows + carports + pool/clubhouse dominate; drive aisles are the ladder.
- Research-first (per the playbook): built from the real Sun Belt garden-apartment norm, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2385 |
| 1 | `#33333c` | street / drive | drive | the cracked internal complex drive / driveway aisle (car-drivable) | ground | no | — | 2879 |
| 2 | `#726a5c` | apartment building | building | a 2-3 story garden apartment block, stucco cracked, most windows dark, some boarded | structure | yes | garden apartment interior: exterior breezeway stairs up to a shared landing, then a railroad-plan unit off it | 3186 |
| 3 | `#3a4520` | weed / brush | tree-dead | weeds + tumbleweed through the cracked lot | prop | no | — | 10 |
| 4 | `#524c3e` | parking asphalt | ground | the complex parking lot, faded striping | ground | no | — | 5168 |
| 5 | `#c79a3f` | gate | gate | the complex entrance off the street, amber curb | portal | no | — | 7 |
| 6 | `#6a6a72` | carport | overhead | a metal carport row along the building front (you park/walk UNDER it), sagging | overhead | no | — | 1087 |
| 7 | `#5c5648` | clubhouse | building | the leasing office / clubhouse, glass fronted, dark inside | structure | yes | small office interior: a front desk + a back room | 425 |
| 8 | `#2e3a3c` | drained pool | water-dead | a drained pool, cracked plaster shell, dead leaves at the bottom | ground | no | — | 325 |
| 9 | `#8f8676` | pole light | prop | a complex pole light along the drive aisle, head dark | prop | yes | — | 8 |
| 10 | `#55555f` | abandoned car | vehicle | a car dead under a carport bay, tyres flat | prop | yes | — | 26 |
| 11 | `#c9c1aa` | stall marking | marking | faded parking-stall paint | ground | no | — | 12 |
| 12 | `#6a6a72` | fence | structure | the complex perimeter fence, chain-link sagging | structure | yes | — | 763 |
| 13 | `#8a7a4a` | mailbox kiosk | prop | a cluster mailbox kiosk (CBU), doors hanging open | prop | yes | — | 1 |
| 14 | `#463f36` | dumpster enclosure | structure | a block-wall trash enclosure, gate off its hinges | structure | yes | — | 48 |
| 15 | `#847c6c` | exterior stair | structure | a breezeway stair to the upper units, rust-streaked | structure | yes | — | 54 |

**Gate:** `gates/apartment_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
