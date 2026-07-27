# BOHEMIA DISTRICT DOSSIER — CAMPUS

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_campus.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead community-college campus built around its QUAD: academic halls turned to face an open green heart with the walks cutting across it on the real desire lines, a library as the biggest mass, a fan-plan lecture hall, a residence row set apart, rec courts, and the parking pushed out to a ring road because a campus core is walkable on purpose.**

### Real-world reference
- UNLV and CSN, the two campuses in this valley, plus standard American campus site planning: a central quad with diagonal walks; academic halls on three sides with their entrances facing IN; the library as the single biggest mass, usually colonnaded or raised; a lecture hall whose fan-shaped plan reads from outside; residence halls set apart from the teaching core; rec courts; parking at the ring.
- THE QUAD IS THE WHOLE DIFFERENCE between a campus and a business park. Buildings that face a shared middle are a campus; the same buildings facing a car park are an office estate.
- In the Mojave a quad is irrigated turf, so it is the first thing act 1 kills — the lawn is brown to the root and the fountain is dry.

### Layout — what is where
- Dead lawn fills the plot inside a desert setback; the QUAD is a large open rectangle at the centre, crossed by two orthogonal walks and both diagonals, with the dry fountain where they meet.
- Academic halls stand on the west, east and north sides of the quad with their fronts turned in; the LIBRARY is the biggest single mass, on the north-east, with a colonnade of piers facing the quad.
- The LECTURE HALL is drawn as a real fan — it widens row by row — so its plan is legible from outside the way the reference ones are.
- A residence row of three halls sits along the south, apart from the teaching core; rec courts take the east lawn.
- The ring road runs the perimeter with ONE car entrance on the primary street (canonical south, rotated to the real street), feeding two striped lots. The core stays car-free.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto a perimeter RING ROAD (code 1) that reaches both lots, so a car gets to every stall from the curb (K.driveReachFromStreet). Inside the ring the campus is deliberately pedestrian: the quad walks (6) knit every building entrance to every other, and the diagonals exist because that is the line people take. A corner cell gains a PEDESTRIAN gate on the side street, never a second car entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (walk): quad lawn (4), walkways and plaza (6), the dry fountain basin (7), rec courts (14), desert setback (0). GROUND (drive): the ring road and lots (1) with their stall markings (10). STRUCTURE (solid, ENTERABLE): academic halls (2), library (8), residence halls (9), lecture hall (13) — four different interiors, each named in this legend. PROPS (solid): pole lights (12), benches and planters (11). TREE-DEAD (pass): dead trees (3). PORTAL: the gate (5).

### Decisions & rulings
- Paolo 7/26: build the world. 16 valley cells were flat; this is the largest single buildable landmark type left.
- THE QUAD IS THE HERO and it is sized to be the biggest open thing on the plot. A campus whose middle is a car park is not a campus, and that is the failure this layout is arranged to avoid.
- WALKABLE-LAND: buildings plus the quad dominate; pavement is the ring and two lots, connective tissue only.
- No university name, no mascot, no signage text — that is Paolo's to author if it ever matters. The signage reads dead.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus setback | ground | no | — | 1561 |
| 1 | `#33333c` | pavement / drive | drive | the ring road and the lots, cracked, weeds in the joints | ground | no | — | 3080 |
| 2 | `#7a6f5c` | academic hall | building | a teaching hall facing the quad, glass out, doors chained, a noticeboard still full | structure | yes | academic interior: a double-loaded corridor of classrooms and offices | 1782 |
| 3 | `#3a4526` | dead tree | tree-dead | a campus tree gone to stick, the irrigation that kept it long dead | prop | no | — | 203 |
| 4 | `#49512e` | quad (dead lawn) | ground | the quad, brown to the root — in the Mojave the lawn is the first thing to die | ground | no | — | 6796 |
| 5 | `#c79a3f` | gate / entrance | gate | the campus entrance off the street, amber curb, barrier arm up | portal | no | — | 9 |
| 6 | `#6a675e` | walkway / plaza | ground | the walks across the quad, on the diagonals people actually cut | ground | no | — | 677 |
| 7 | `#4c5a5f` | dry fountain | ground | the quad fountain, basin dry and silted, coins long gone | ground | no | — | 100 |
| 8 | `#857a64` | library | building | the library, the biggest mass on the campus, colonnade facing the quad | structure | yes | library interior: reading floor, stacks, study rooms off it | 665 |
| 9 | `#6e6553` | residence hall | building | a residence hall set apart from the teaching core, every window dark | structure | yes | residence interior: a corridor of rooms either side | 414 |
| 10 | `#c9c1aa` | white markings | marking | faded parking stall lines and court lines | ground | no | — | 312 |
| 11 | `#5a5344` | bench / planter | prop | a quad bench or planter, slats split, the planting dead | prop | yes | — | 6 |
| 12 | `#b0863a` | pole light | prop | a campus pole light, head dark | prop | yes | — | 1 |
| 13 | `#807561` | lecture hall | building | the lecture hall, its fan plan legible from outside, doors open on tiered dark | structure | yes | lecture interior: raked seating down to a single stage wall | 204 |
| 14 | `#4e5a5f` | rec court | ground | a dead outdoor court, slab cracked, lines ghosted, hoops bent | ground | no | — | 574 |

**Gate:** `gates/campus_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
