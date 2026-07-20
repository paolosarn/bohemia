# BOHEMIA DISTRICT DOSSIER — SCHOOL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_school.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead K-12 school — an E-shaped classroom building + gym on a campus of dead lawn, a sports field ringed by a running track, basketball courts, a playground, and separate bus-loop / drop-off / staff-parking drives with a flagpole at the entry plaza.**

### Real-world reference
- School campus site-plan guides (edrawmax school layouts, SC Dept of Ed bus-lot planning, Whisker Architecture campus planning, CA Dept of Ed site guide): academic BUILDINGS (classrooms/gym/library/admin) plus SPORTS areas (field, track, courts); the BUS loop is kept SEPARATE from the passenger DROP-OFF loop for student safety, each with sidewalk access to the entry; short-term parking near the main entrance; fire/service roads; playgrounds, pathways + gardens across the campus.

### Layout — what is where
- The campus is dead LAWN (desert only at the margins); an E-shaped SCHOOL building (front spine + three classroom wings) sits at the back with the GYM box on the east.
- The hero is the SPORTS FIELD ringed by a rust-red running TRACK, lower-center, with faded field lines; two BASKETBALL COURTS sit on the east lawn and a PLAYGROUND on the west.
- Three SEPARATE drives run up the campus (SC-Ed safety rule): a BUS LOOP on the west edge, a passenger DROP-OFF lane center (queue stripes), and a staff PARKING lot at the SE.
- Dead trees line the drives + dot the lawn; a flagpole stands at the entry plaza; walkways knit the buildings to the entrances.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the campus drive is on the primary street; the paved network (bus loop + drop-off + staff parking, code 1) is the drivable surface, all knit to the street entrance so a car/bus reaches every part from the curb (K.driveReachFromStreet). Foot circulation is the sidewalks/plaza (11) + lawn; buses and passenger cars are separated. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the dead lawn (4), pavement/drives (1, drive), sidewalk/plaza (11), sports field (6), running track (7), courts (8), and white markings (10) — all flat, you cross them. STRUCTURES (¾ front face, solid, ENTERABLE): the school + gym (2 -> classroom-corridor interior). PLAY: the playground (9). PROPS: dead trees (3), the flagpole/pole lights (12). PORTALS: the gate (5). The buildings are the vertical mass; the rest is a broad low campus of lawn, field, track and pavement you move across.

### Decisions & rulings
- Act-1 DEAD: broken windows + chained doors, weeds through the field/track/lawn, ghosted court + field lines, dead trees, an empty flagpole, cracked courts. No living turf, no children (LIFE places agents later).
- Civic category (school). Zero purple. No school name/mascot (Paolo's to author if ever) — signage reads dead.
- Bus loop and passenger drop-off are DELIBERATELY separate drives (the site-plan safety rule), not one shared lane.
- Research-first (per the playbook): built from real school campus site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus edge (setback) | ground | no | — | 2659 |
| 1 | `#33333c` | pavement / drive | drive | cracked pavement — the bus loop, drop-off lane + staff parking (car-drivable) | ground | no | — | 1738 |
| 2 | `#7a6f5c` | building (school / gym) | building | the school wings + gym, windows broken, doors chained, faded lettering | structure | yes | school interior: a double-loaded classroom corridor (classrooms both sides), the gym + library + offices off it | 1802 |
| 3 | `#3a4526` | dead tree / landscaping | tree-dead | a dead campus tree / shrub gone to stick | prop | no | — | 20 |
| 4 | `#49512e` | dead lawn (campus ground) | ground | the dead campus lawn — brown grass + weeds, the ground between everything | ground | no | — | 7257 |
| 5 | `#c79a3f` | gate / entrance | gate | the campus drive entrance off the street, amber curb | portal | no | — | 9 |
| 6 | `#5b6a44` | sports field (dead turf) | ground | the dead football/soccer field inside the track — brown, cracked, the crown faint | ground | no | — | 1240 |
| 7 | `#8a5040` | running track | ground | the rubberized running track ring, faded rust-red, cracked + weed-split | ground | no | — | 510 |
| 8 | `#4e5a5f` | basketball court | ground | a dead outdoor court — cracked slab, hoops bent, lines ghosted | ground | no | — | 432 |
| 9 | `#8a6a3a` | playground | play | the sun-bleached playground — structures rusted, safety surface split | ground | no | — | 285 |
| 10 | `#c9c1aa` | white markings | ground | faded white paint — field/court lines, drop-off queue + parking stalls | ground | no | — | 335 |
| 11 | `#6a675e` | sidewalk / plaza | ground | the entry plaza + walkways, concrete cracked, weeds in the joints | ground | no | — | 95 |
| 12 | `#b0863a` | flagpole / light | prop | the empty flagpole / a campus pole light, halyard slapping, head dark | prop | yes | — | 2 |

**Gate:** `gates/school_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
