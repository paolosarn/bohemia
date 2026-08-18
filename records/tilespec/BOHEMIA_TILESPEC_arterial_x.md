# BOHEMIA DISTRICT DOSSIER — ARTERIAL_X

_Category: **(uncategorized)**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_arterial_x.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The mile-grid arterial street cell: a real six-lane divided Las Vegas arterial with a raised median, detached sidewalks behind an amenity strip, block walls, and a full signalised intersection when two arterials cross. 2,434 cells of the valley are this.**

### Real-world reference
- Clark County / City of Las Vegas arterial standard: 100 ft right-of-way, 6 travel lanes at 12 ft, raised landscaped median, 8 ft outside shoulder / bike lane, curb and gutter.
- Sun Belt norm: DETACHED sidewalk set behind an amenity strip (not curb-attached), streetlights in the amenity zone, landscape setback, then the 6 ft CMU block wall that backs every residential tract in the valley.
- The median opens to a left-turn bay at each intersection; that bay is the only place opposing directions meet without an island between them, which is exactly where the yellow lives.

### Layout — what is where
- The corridor is 85 tiles (64 m) wall to wall inside the 96 m cell: median, three lanes each way, shoulder, curb and gutter, amenity strip, detached sidewalk, landscape setback, block wall.
- It is a NETWORK TILE, not a district: it takes the directions whose neighbours are also road and builds what serves them. All sixteen masks build, so a through street, a corner, a T, a 4-way and a stub all come out of one generator.
- At a real crossing the median stops short, the opening becomes a yellow-bordered left-turn bay, ladder crosswalks and stop bars land on all four approaches, and signal mast arms stand on the four corners.
- Street furniture is act-1 dead: cobra-head lights out, signal heads dark, dead palms in the setback, a car left at the curb, silt in the storm inlets.

### Circulation (street-aware / drivable)
Traffic runs through on every connected direction (proven cell-edge to cell-edge by the gate). Pedestrians get a continuous DETACHED sidewalk that wraps every corner and crosses at the marked crosswalks; the walk is unbroken across the cell, so a body can walk from any district on one side to any district on the other.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk or drive): the roadway (1), every marking (2, 3, 15, 17), the curb and gutter (5), the storm inlet (16), the landscape strips (7), and the raised median (4) which is a low island you can step onto, not a blocker. WALK: the detached sidewalk (6). STRUCTURE (blocks, ¾ face): the block wall (8) and the bus stop shelter (13). PROPS (solid): streetlight (9), power pole (10), signal mast (12), dead car (14), dead palm (11). PORTALS: none, a street cell has no interior. The wall is the hard edge of the corridor; everything inside it is open ground at one level.

### Decisions & rulings
- CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped
       flagged provisional; the moment Paolo ruled the target screen CBB this palette was
       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside
       its layer value bands. Road paint and the lake ring were the only things out, and
       they were wrong on their own terms too: act-1 paint is filthy, not clean white.
       Locked by the CONSTITUTION CONFORMANCE section of this module's gate.
- ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and
       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.
- Paolo 7/26: "we need to actually build a fucking world." The census found 37% of the valley was road cells with no generator at all. This is the arterial half of that hole.
- A road cell is NOT an auto-district: it never becomes faction territory, an economy district or a quest address. It registers as a SURFACE, so the world renders it and bodies walk it, while everything that counts districts still counts only real districts.
- vehicular:true under the WALKABLE-LAND LAW: a street is the one thing whose vehicle surface IS the venue. It is still dressed (walls, walks, furniture, plantings), never a void.
- LINE COLOR LAW held exactly: white divides lanes going the same way, yellow appears only at the left-turn bay where the median opens and opposing directions actually meet.
- Act-1 DEAD throughout: nothing lit, nothing living, nothing maintained.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dirt shoulder | ground | the bare graded dirt between the block wall and the neighbouring lot | ground | no | — | — |
| 1 | `#33333c` | asphalt roadway | drive | six lanes of cracked asphalt, patched and sun-bleached | ground | no | — | 13421 |
| 2 | `#b3ab97` | white lane line | marking | faded white lane line, dashed between lanes going the same way | ground | no | — | 308 |
| 3 | `#b3ab97` | crosswalk | marking | ladder crosswalk across the approach, half worn off | ground | no | — | 944 |
| 4 | `#6f6a5e` | raised median | ground | raised concrete median island, dead landscaping and gravel | ground | no | — | 350 |
| 5 | `#6b6b74` | curb + gutter | ground | concrete curb and gutter, silt and dead leaves packed in it | ground | no | — | 8 |
| 6 | `#8a8a92` | sidewalk | walk | detached concrete sidewalk, cracked and lifted at the joints | ground | no | — | 528 |
| 7 | `#6a5f47` | landscape strip | ground | decomposed granite amenity and setback strip, irrigation long dead | ground | no | — | 681 |
| 8 | `#7a7266` | block wall | structure | six foot CMU block wall backing the tract, tagged and chipped | structure | yes | — | 1 |
| 9 | `#8f8676` | streetlight | prop | cobra-head streetlight on the amenity strip, head dark | prop | yes | — | 4 |
| 10 | `#6a5f4a` | power pole | prop | overhead distribution pole down the setback, lines sagging | prop | yes | — | 2 |
| 11 | `#3a4520` | dead palm / shrub | tree-dead | dead palm stump and dry oleander left in the setback | prop | yes | — | 5 |
| 12 | `#6a6a72` | signal mast | prop | traffic signal mast arm on the corner, every head dark | prop | yes | — | 4 |
| 13 | `#5c5648` | bus stop | structure | transit stop pad with a bent shelter frame, the ad panel long gone | structure | yes | — | — |
| 14 | `#55555f` | dead car | vehicle | a car left at the curb, tyres flat, glass gone | prop | yes | — | — |
| 15 | `#b3ab97` | stop bar | marking | wide white stop bar behind the crosswalk | ground | no | — | 128 |
| 16 | `#4a4842` | storm drain inlet | ground | curb inlet to the flood system, grate half choked with silt | ground | no | — | — |
| 17 | `#b09a3a` | yellow turn-pocket line | marking | yellow line bordering the left-turn bay where the median opens | ground | no | — | — |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
