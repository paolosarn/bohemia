# BOHEMIA DISTRICT DOSSIER — SCHOOL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_school.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead HIGH SCHOOL, and the landmark is the STADIUM: an oval running track with the football field inside it, raked bleachers down both sidelines, a press box and four light towers. Behind it a two-storey classroom spine round a courtyard, a teal gymnasium under a barrel roof, a village of portable classrooms, the AUTO SHOP under its sawtooth roof over an oil-black yard of cars on jacks, the marquee at the street, and the student lot with the cars still in it.**

### Real-world reference
- PAOLO RULED IT (7/28): "High school." He was right that the district had to say which — a high school is not a bigger middle school, it is a different building programme. The old module was a generic K-12 with a PLAYGROUND in it, which is an elementary-school object and was simply wrong.
- What makes it read as a HIGH SCHOOL: the stadium with real bleachers and lights (not a play field); the STUDENT PARKING LOT, because high schoolers drive and that is the clearest programmatic tell there is; tennis courts and a full athletic strip; portable classrooms for overcrowding; and the marquee at the kerb. No playground.
- Friday night lights: the stadium is the most recognisable object an American town owns, and it makes a shape nothing else in this valley makes — an oval track with a rectangle inside it.
- PAOLO RULED IT (7/30): "Remove the tennis courts make do what you want." The courts are dead and held at zero by the gate. The ground went to a CTE AUTO SHOP: a real high-school building, the only industrial volume on a civic campus, and in act 1 the reason to walk over there — the tools and the parts are in it. The courts were also a live bug: drawn after the east wing, they overwrote it, which is the meshing he has called out across the whole game.
- PAOLO 7/30, THE LEGIBILITY NOTE UNDERNEATH THE RULING: he circled the gym, the courts and the portables and asked what they were. All three were flat colour rectangles. A building read from above is its ROOF and its DOOR, not its fill colour — so the gym got a barrel-roof crown and rooftop plant, the portables got gable ridges, landings and ramps off a spine walk, the classroom spine and wings got ridges and three real entrances, and the shop got sawtooth monitors and roll-up bays. The gate now fails any building mass over 100 tiles that has no roof and no door.

### Layout — what is where
- The two-storey classroom spine runs along the north with west and east wings, wrapped around a courtyard of dead planters.
- The GYMNASIUM is its own volume south of the courtyard, in school colours — the second landmark, and the last real colour on a dead campus.
- THE STADIUM is the centre and the point: track, field with ghosted yard lines and end zones, raked bleachers down BOTH sidelines, a press box on the home side, four light towers at the corners.
- The AUTO SHOP runs down the east under a sawtooth roof, its roll-up bays opening onto an oil-black yard of cars up on jacks and two parts containers; portable classrooms are dropped on the north-east lawn off their own spine walk.
- The STUDENT LOT fills the whole south in double-loaded bays — stalls, aisle, stalls — with the cars still in them, and the one car entrance comes off the south street into it.
- The marquee stands at the street with the flagpole behind it.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street, landing in the STUDENT LOT. The paved network (code 1) is the lot and that entrance drive, and every stall is reachable from the kerb (K.driveReachFromStreet = 1.00 in all six placements). On foot the walks (11) run from the street past the marquee to the entry plaza, into the courtyard, out to the stadium, up the east side to the shop yard and on to the portables' spine walk. The shop yard (8) is a walking surface, not a second drive — the cars in it are on jacks and are not going anywhere. A corner cell gains a pedestrian gate on the side street.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the student lot and its entrance drive (1) with the stall markings (10). GROUND (walk): dead lawn (4), plaza and walks (11), field (6), track (7), the shop yard (8). STRUCTURE (solid, ENTERABLE): the academic building (2), the gymnasium (14), the portables (15), the auto shop (20) — four different interiors. STRUCTURE (solid): the bleachers and press box (9), the light towers and poles (12), the marquee (16), and the roof ridges and rooftop plant (18), which sit ON the building mass and are part of it. PROP: dead trees (3), planters (13). VEHICLE (solid): the dead cars (17), in the lot stalls and up on jacks in the shop yard. PORTAL: the campus gate (5) and every DOORWAY (19) — the school's main and side entrances, the gym's field and courtyard doors, each portable's step-up door, and the shop's roll-up bays.

### Decisions & rulings
- Paolo 7/28, LOCKED: "High school." Recorded and built the same turn (NOTES ARE RULINGS).
- THE PLAYGROUND IS GONE. It was an elementary-school object in a district that is now explicitly a high school.
- THE STADIUM IS THE LANDMARK, per EVERY DISTRICT IS ITS OWN LANDMARK (7/28). An oval track around a rectangle is a silhouette nothing else in the valley makes, and it survives shrinking to one tile.
- THE STUDENT LOT IS DRESSED, NOT EMPTY. Measured 7/28: pavement is an absence until something happens on it. The cars were never collected, which is also the true story of a school that stopped.
- THE PALETTE CARRIES REAL HUE. Measured 7/28: our icons ran a median of 3 hue families and 13% chromatic pixels against the Pocket City 2 reference at 12 and 88%. Faded is not the same instruction as brown.
- No school name, no mascot, no marquee text — Paolo's to author. The letter board reads weathered.
- THE TENNIS COURTS ARE DEAD (Paolo 7/30) and the gate holds them at zero, the same way it holds the playground at zero from his 7/28 ruling. Two rulings, two ratchets, neither can creep back.
- NO BUILDING IS A FLAT RECTANGLE (Paolo 7/30, and it is the general lesson, not a school note). He circled three objects and asked what they were, which is the whole Pocket City bar failing out loud: "everything looks unique enough to know what it is at a glance." Roof (18) and door (19) are now a shared vocabulary, machine-checked here, and the other 35 districts are going to need the same treatment.
- THE DOSSIER SAID BUS LOOP AND STAFF PARKING AND THE MODULE NEVER BUILT THEM. Corrected 7/30 rather than left standing: a district dossier that describes something the generator does not make is a lie the tiling and interior phases would have built on.
- ACT ONE ONLY (Paolo 7/28). Act-2 and act-3 materials are not specified and must not be.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus edge (setback) | ground | no | — | 1249 |
| 1 | `#33333c` | pavement / drive | drive | cracked pavement — the student lot, bus loop and staff parking (car-drivable) | ground | no | — | 2233 |
| 2 | `#7a4038` | academic building | building | the two-storey classroom spine and its wings, maroon roof faded, windows out, doors chained | structure | yes | high school interior: a double-loaded classroom corridor with lockers down both walls, offices and labs off it | 1918 |
| 3 | `#3a4526` | dead tree / landscaping | tree-dead | a dead campus tree gone to stick | prop | no | — | 18 |
| 4 | `#49512e` | dead lawn (campus ground) | ground | the dead campus lawn — brown grass and weeds between everything | ground | no | — | 4209 |
| 5 | `#c79a3f` | gate / entrance | gate | the campus drive entrance off the street, amber curb | portal | no | — | 9 |
| 6 | `#4f6038` | field (dead turf) | ground | the dead football field inside the track — brown, cracked, the yard lines ghosted | ground | no | — | 614 |
| 7 | `#9a4a38` | running track | ground | the rubberised running track, faded rust-red, cracked and weed-split | ground | no | — | 739 |
| 8 | `#3f5f66` | shop yard | ground | the auto shop yard — a slab gone black with forty years of oil, cars still up on jacks where the work stopped | ground | no | — | 307 |
| 9 | `#8a929a` | bleachers | structure | the raked aluminium bleachers down both sidelines, and the press box above the home side | structure | yes | — | 303 |
| 10 | `#c9c1aa` | white markings | ground | faded white paint — yard lines, court lines, parking stalls, kerb stripes | ground | no | — | 862 |
| 11 | `#6a675e` | sidewalk / plaza | ground | the entry plaza and campus walks, concrete cracked, weeds in the joints | ground | no | — | 1221 |
| 12 | `#b0863a` | pole / light tower | structure | a stadium light tower or campus pole, head dark, lamps out | structure | yes | — | 40 |
| 13 | `#41501f` | garden bed | prop | a dead courtyard planter gone to weed | prop | no | — | 234 |
| 14 | `#2f5a52` | gymnasium | building | the gym box, teal school-colour paint still holding long after the windows went | structure | yes | gymnasium interior: one full-height court with retracted bleachers down both walls, locker rooms off the end | 584 |
| 15 | `#a89878` | portable classroom | building | a portable classroom on its blocks, skirting split, ramp rusted | structure | yes | portable interior: one room, desks pushed to the walls | 246 |
| 16 | `#b8912f` | marquee sign | structure | the school marquee at the street, letter board weathered, whatever it last said still up there | structure | yes | — | 38 |
| 17 | `#6a6e72` | dead car | vehicle | a student's car still in its stall, flat, sun-bleached, never collected | prop | yes | — | 264 |
| 18 | `#a7a08e` | roof ridge / vent | structure | the ridge line and rooftop plant — the gym's barrel crown, the shop's sawtooth monitors, the classroom ridges; rusted, some panels gone | structure | yes | — | 919 |
| 19 | `#241f1a` | doorway | portal | a way in — the school's main and side entrances, the gym's field doors, a portable's step-up door, the shop's roll-up bays standing open | portal | no | — | 38 |
| 20 | `#3d5570` | auto shop (CTE) | building | the vocational shop under its sawtooth roof, roll-up bay doors buckled open, and the parts containers in the yard | structure | yes | auto shop interior: four bays over drive-on lifts, benches and a tool crib down the back wall, the parts containers still chained | 339 |

**Gate:** `gates/school_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
