# BOHEMIA DISTRICT DOSSIER — WAREHOUSE

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_warehouse.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead multi-tenant flex/light-industrial park — two rows of party-wall tenant bays (roll-up dock at back, small office at front) on an internal drive aisle, a shared truck court, some units burned. Distinct from the single-big-box DC (bohemia_industrial.js): many small businesses, not one tenant.**

### Real-world reference
- Real Vegas flex/business parks (Sunrise Manor, the airport industrial corridor): rows of mid-size tenant units (5,000-15,000 sqft) sharing party walls, each with its own roll-up dock + small front office + a couple reserved stalls, on an internal drive aisle; a shared truck court serves the dock side.

### Layout — what is where
- Two rows of 7 tenant units each face an internal drive aisle, dock doors backed to a shared truck court between the rows.
- Each unit has a front office bay window strip, a rear roll-up dock, and 2 reserved stalls; ~12% are burned-out shells.
- A spine street ties both aisles to the south gate; weeds and dead pole lights through the lot.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entrance gate is on the primary street; a spine street reaches both drive aisles from the gate (code 1, K.driveReachFromStreet). WALKABLE-LAND: the two building rows + docks + office bays dominate; the drive aisles/truck court are the connective ladder.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): lot asphalt (4), the aisles/street (1, drive), desert (0). STRUCTURES (¾ front face, solid): the tenant units (2, ENTERABLE -> office + bay), the office bays (7), burned units (8), the fence (12). PORTALS: dock doors (6, enterable into the bay), the gate (5). PROPS/VEHICLES (solid): loose pallets (13), dumpster (14), abandoned cars (10). PROPS: pole lights (9), weeds (3). The two unit rows are the mass; you drive the aisle-and-spine ladder between them.

### Decisions & rulings
- Act-1 DEAD: roll-up doors torn/open, ~12% units burned, weeds through the truck court, dead cars in reserved stalls. Who squats/salvages here is faction/LIFE canon (Paolo's).
- INDUSTRIAL category, distinct typology from bohemia_industrial.js (one big DC) — many small tenant bays, not one tenant.
- WALKABLE-LAND honored: two building rows + docks + offices dominate; aisles/truck court are the ladder.
- Research-first (per the playbook): built from real flex/business-park site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2617 |
| 1 | `#33333c` | street / drive | drive | the cracked internal park drive / driveway aisle (car-drivable) | ground | no | — | 2144 |
| 2 | `#726a5c` | tenant unit | building | a flex/light-industrial bay, tilt-up concrete, sun-bleached, half the units looted | structure | yes | flex unit interior: a small front office, a bare warehouse bay behind it | 2483 |
| 3 | `#3a4520` | weed / brush | tree-dead | weeds + tumbleweed through the cracked lot | prop | no | — | 7 |
| 4 | `#524c3e` | lot asphalt | ground | the park lot / truck court asphalt, faded striping | ground | no | — | 8218 |
| 5 | `#c79a3f` | gate | gate | the park entrance off the street, amber curb | portal | no | — | 7 |
| 6 | `#8a7a4a` | dock door | portal | a roll-up dock door, half open or torn off | portal | no | the bay behind the dock | 13 |
| 7 | `#5c6068` | office bay | building | the tenant's front office window strip, glass smashed | structure | yes | — | 156 |
| 8 | `#332a26` | burned unit | building | a burned-out tenant bay — charred shell, roof collapsed | structure | yes | — | 204 |
| 9 | `#8f8676` | pole light | prop | a park pole light, head dark | prop | yes | — | 4 |
| 10 | `#55555f` | abandoned car | vehicle | a car dead in a reserved stall, tyres flat | prop | yes | — | — |
| 11 | `#c9c1aa` | stall marking | marking | faded reserved-parking stall paint | ground | no | — | 26 |
| 12 | `#6a6a72` | fence | structure | the park perimeter fence, chain-link sagging | structure | yes | — | 501 |
| 13 | `#8a7050` | loose pallets | prop | a stack of broken pallets behind a dock | prop | yes | — | 3 |
| 14 | `#463f36` | dumpster | prop | a rusted dumpster near the entrance | prop | yes | — | 1 |

**Gate:** `gates/warehouse_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
