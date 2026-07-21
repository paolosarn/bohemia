# BOHEMIA DISTRICT DOSSIER — JAIL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_jail.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead jail — cell blocks radiating off a central control hub inside a double razor-wire perimeter wall with corner guard towers, walled recreation yards between the blocks, an admin/intake block with a vehicle sally port at the gate.**

### Real-world reference
- Jail/prison layout (NIC Jail Design Guide, prison-zone breakdowns, Fremantle architecture): a secure PERIMETER WALL/fence topped with razor wire + corner GUARD TOWERS; CELL BLOCKS (housing pods) often radiating off a central CONTROL hub; walled RECREATION YARDS; an ADMIN + intake zone with a vehicle SALLY PORT; strict public/secure separation + security rings.

### Layout — what is where
- A DOUBLE perimeter WALL crowned with razor wire rings the site, GUARD TOWERS at the four corners (desert outside).
- CELL BLOCKS (the hero — housing pods with a cell-door rhythm on both faces) radiate off a central CONTROL hub: a north + south block and east + west wings.
- Walled RECREATION YARDS sit between the blocks with a ghosted court line.
- An ADMIN / intake block with an enclosed vehicle SALLY PORT sits at the south gate.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the intake gate is on the primary street; the sally lane / service drive (code 1) reaches the intake from the curb (K.driveReachFromStreet). WALKABLE-LAND: the cell blocks + walls + towers + yards dominate; the drive is minimal. Corner side streets get a pedestrian gate. Public and secure are strictly separated (the design rule).

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the secure-yard concrete (4), recreation yards (7), the drive (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the CELL BLOCKS + admin (2 -> tiers/dayroom/control; intake/holding) with the cell-door detail (13), the GUARD TOWERS (6), the SALLY PORT (10), the perimeter WALL (12), razor WIRE (8). PROPS: pole lights (9), dead brush (3). PORTALS: the gate (5). The radiating cell blocks + walls + towers are the mass; you cross the secure yards between them.

### Decisions & rulings
- Act-1 DEAD: cell doors sprung, the yard cracked, towers empty, the wire rusted, the doors hanging. Who is (or was) held here, and who holds it now, is faction canon (Paolo's).
- Civic category (jail). Zero purple.
- WALKABLE-LAND honored: cell blocks + walls + towers + yards dominate; drive minimal.
- Research-first (per the playbook): built from real jail/prison layouts, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the wall (setback) | ground | no | — | 2568 |
| 1 | `#3a3a42` | drive / lot | drive | the intake sally lane / service drive (car-drivable) | ground | no | — | 135 |
| 2 | `#6f6a62` | building (cell block/admin) | building | a cell block / the admin+intake block, concrete, slit windows | structure | yes | block interior: the two-tier cell tiers around a dayroom, the control picket at the hub; admin = intake, property, holding | 3460 |
| 3 | `#3a4526` | dead brush | tree-dead | dead brush caught in the wall + wire | prop | no | — | — |
| 4 | `#4a4842` | secure yard concrete | ground | the secure-yard concrete between the blocks, cracked | ground | no | — | 6952 |
| 5 | `#c79a3f` | gate | gate | the intake gate off the street, amber curb, the outer sally door | portal | no | — | 5 |
| 6 | `#8a8478` | guard tower | structure | a corner guard tower over the wall, glass gone, empty | structure | yes | — | 99 |
| 7 | `#55603a` | recreation yard | ground | a walled recreation yard, dead dirt + a ghosted court line | ground | no | — | 1856 |
| 8 | `#9a948a` | razor wire (wall top) | structure | coiled razor wire crowning the perimeter wall, rusted | structure | yes | — | 228 |
| 9 | `#8f8676` | pole light | prop | a yard security light, head dark | prop | yes | — | 4 |
| 10 | `#5a5f66` | sally port | structure | the enclosed vehicle sally port (secure transfer), doors seized | structure | yes | — | 70 |
| 11 | `#c9c1aa` | marking | marking | faded yard / control markings | ground | no | — | 7 |
| 12 | `#6a6a72` | perimeter wall | structure | the double secure perimeter wall, concrete | structure | yes | — | 869 |
| 13 | `#2a2824` | cell detail | structure | the individual cell-door rhythm on a block face, doors sprung | structure | yes | — | 131 |

**Gate:** `gates/jail_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
