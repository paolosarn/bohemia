# BOHEMIA DISTRICT DOSSIER — SCHOOL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_school.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead HIGH SCHOOL, and the landmark is the STADIUM: an oval running track with the football field inside it, raked bleachers down both sidelines, a press box and four light towers. Behind it a two-storey classroom spine round a courtyard, a teal gymnasium, portable classrooms, tennis courts, the marquee at the street, and the student lot with the cars still in it.**

### Real-world reference
- PAOLO RULED IT (7/28): "High school." He was right that the district had to say which — a high school is not a bigger middle school, it is a different building programme. The old module was a generic K-12 with a PLAYGROUND in it, which is an elementary-school object and was simply wrong.
- What makes it read as a HIGH SCHOOL: the stadium with real bleachers and lights (not a play field); the STUDENT PARKING LOT, because high schoolers drive and that is the clearest programmatic tell there is; tennis courts and a full athletic strip; portable classrooms for overcrowding; and the marquee at the kerb. No playground.
- Friday night lights: the stadium is the most recognisable object an American town owns, and it makes a shape nothing else in this valley makes — an oval track with a rectangle inside it.

### Layout — what is where
- The two-storey classroom spine runs along the north with west and east wings, wrapped around a courtyard of dead planters.
- The GYMNASIUM is its own volume south of the courtyard, in school colours — the second landmark, and the last real colour on a dead campus.
- THE STADIUM is the centre and the point: track, field with ghosted yard lines and end zones, raked bleachers down BOTH sidelines, a press box on the home side, four light towers at the corners.
- Tennis courts run down the east; portable classrooms sit on the north-east lawn.
- The STUDENT LOT fills the south-west with the cars still in their stalls. The bus loop and staff parking are separate, on the east, so student and bus traffic never mix.
- The marquee stands at the street with the flagpole behind it.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street. The paved network — student lot, bus loop, staff parking (code 1) — is the drivable surface and every part of it is reachable from the kerb (K.driveReachFromStreet). On foot the walks (11) run from the street past the marquee to the entry plaza, into the courtyard and out to the stadium. Bus and student traffic are deliberately separated, which is the real site-planning rule. A corner cell gains a pedestrian gate on the side street.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the lot, loop and staff parking (1) and their stall markings (10). GROUND (walk): dead lawn (4), plaza and walks (11), field (6), track (7), courts (8). STRUCTURE (solid, ENTERABLE): the academic building (2), the gymnasium (14), the portables (15) — three different interiors. STRUCTURE (solid): the bleachers and press box (9), the light towers and poles (12), the marquee (16). PROP: dead trees (3), planters (13). VEHICLE (solid): the dead cars (17). PORTAL: the gate (5).

### Decisions & rulings
- Paolo 7/28, LOCKED: "High school." Recorded and built the same turn (NOTES ARE RULINGS).
- THE PLAYGROUND IS GONE. It was an elementary-school object in a district that is now explicitly a high school.
- THE STADIUM IS THE LANDMARK, per EVERY DISTRICT IS ITS OWN LANDMARK (7/28). An oval track around a rectangle is a silhouette nothing else in the valley makes, and it survives shrinking to one tile.
- THE STUDENT LOT IS DRESSED, NOT EMPTY. Measured 7/28: pavement is an absence until something happens on it. The cars were never collected, which is also the true story of a school that stopped.
- THE PALETTE CARRIES REAL HUE. Measured 7/28: our icons ran a median of 3 hue families and 13% chromatic pixels against the Pocket City 2 reference at 12 and 88%. Faded is not the same instruction as brown.
- No school name, no mascot, no marquee text — Paolo's to author. The letter board reads weathered.
- ACT ONE ONLY (Paolo 7/28). Act-2 and act-3 materials are not specified and must not be.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus edge (setback) | ground | no | — | 1435 |
| 1 | `#33333c` | pavement / drive | drive | cracked pavement — the student lot, bus loop and staff parking (car-drivable) | ground | no | — | 1974 |
| 2 | `#7a4038` | academic building | building | the two-storey classroom spine and its wings, maroon roof faded, windows out, doors chained | structure | yes | high school interior: a double-loaded classroom corridor with lockers down both walls, offices and labs off it | 2432 |
| 3 | `#3a4526` | dead tree / landscaping | tree-dead | a dead campus tree gone to stick | prop | no | — | 12 |
| 4 | `#49512e` | dead lawn (campus ground) | ground | the dead campus lawn — brown grass and weeds between everything | ground | no | — | 4107 |
| 5 | `#c79a3f` | gate / entrance | gate | the campus drive entrance off the street, amber curb | portal | no | — | 9 |
| 6 | `#4f6038` | field (dead turf) | ground | the dead football field inside the track — brown, cracked, the yard lines ghosted | ground | no | — | 674 |
| 7 | `#9a4a38` | running track | ground | the rubberised running track, faded rust-red, cracked and weed-split | ground | no | — | 1020 |
| 8 | `#3f5f66` | tennis court | ground | a dead tennis court — cracked blue-green slab, nets gone, lines ghosted | ground | no | — | 522 |
| 9 | `#8a929a` | bleachers | structure | the raked aluminium bleachers down both sidelines, and the press box above the home side | structure | yes | — | 213 |
| 10 | `#c9c1aa` | white markings | ground | faded white paint — yard lines, court lines, parking stalls, kerb stripes | ground | no | — | 860 |
| 11 | `#6a675e` | sidewalk / plaza | ground | the entry plaza and campus walks, concrete cracked, weeds in the joints | ground | no | — | 1410 |
| 12 | `#b0863a` | pole / light tower | structure | a stadium light tower or campus pole, head dark, lamps out | structure | yes | — | 15 |
| 13 | `#41501f` | garden bed | prop | a dead courtyard planter gone to weed | prop | no | — | 338 |
| 14 | `#2f5a52` | gymnasium | building | the gym box, teal school-colour paint still holding long after the windows went | structure | yes | gymnasium interior: one full-height court with retracted bleachers down both walls, locker rooms off the end | 805 |
| 15 | `#a89878` | portable classroom | building | a portable classroom on its blocks, skirting split, ramp rusted | structure | yes | portable interior: one room, desks pushed to the walls | 402 |
| 16 | `#b8912f` | marquee sign | structure | the school marquee at the street, letter board weathered, whatever it last said still up there | structure | yes | — | 38 |
| 17 | `#6a6e72` | dead car | vehicle | a student's car still in its stall, flat, sun-bleached, never collected | prop | yes | — | 118 |

**Gate:** `gates/school_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
