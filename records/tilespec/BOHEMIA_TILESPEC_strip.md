# BOHEMIA DISTRICT DOSSIER — STRIP

_Category: **gaming_resort**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_strip.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**LAS VEGAS BOULEVARD — the resort corridor itself. Eight lanes divided by a wide landscaped palm median, a promenade at the back of curb running out to the property line on both sides, marquee pylons at the building face, and at every major crossing the enclosed PEDESTRIAN BRIDGES on their stair towers, flying over the traffic. 81 cells of the valley are this street, and every one of them generated bare ground until now.**

### Real-world reference
- RTC of Southern Nevada, Las Vegas Boulevard revitalisation: the median palms were lifted out during construction and RE-PLANTED after, with the sidewalks widened, curb ramps added and lighting rebuilt. The palm median is not decoration on this street, it is the street.
- FHWA Las Vegas Pedestrian Safety Project (phases 2-3) and Clark County Public Works: the Strip walk is built AT THE BACK OF CURB with no buffer between the walk and the travel lanes — the opposite of the valley arterial, which detaches its sidewalk behind an amenity strip.
- Clark County Public Works pedestrian-bridge program: the corridor crosses at the major intersections by ENCLOSED BRIDGE on stair/escalator towers, not at grade — a standing repair and lighting contract runs on four bridges at Flamingo alone.
- Roadway: generally six to eight lanes divided by a central median, with dedicated transit and left-turn lanes opening at the major intersections.

### Layout — what is where
- The cross-section from the centreline out: an 11 m landscaped PALM MEDIAN, four lanes each way plus a bus/turn lane out to 23 m, curb and gutter, then the PROMENADE — and the promenade runs all the way to the cell edge, because on this street the neighbouring RESORT PODIUM is the property line and there is no wall to put anywhere.
- It is a NETWORK TILE, not a lot: it takes the directions whose neighbours are also road and builds what serves them, so a through run, a corner, a T and a four-way all come out of one generator.
- At a real crossing the median stops short for a yellow-bordered left-turn bay, ladder crosswalks and stop bars land on every approach, signal masts stand on the four corners — and the PEDESTRIAN BRIDGES fly across the boulevard clear of the junction box, landing on their stair towers on the promenade either side.
- The promenade is dressed rather than banded: tree wells cut into the pavers, boulevard light standards, dead palms, and one marquee pylon standing at the building line.

### Circulation (street-aware / drivable)
Traffic runs through on every connected direction, cell edge to cell edge. Pedestrians have TWO routes and that is the whole character of this street: at grade along a continuous promenade that wraps every corner and crosses at the marked crosswalks, or UP a bridge tower and ACROSS the enclosed span above the traffic. The span is OVERHEAD, so a body underneath it walks or drives straight through.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk or drive): the roadway (1), every marking (2, 3, 15, 17), the curb and gutter (5), the storm inlet (16), the planters (7), and the palm median (4), which is a low island you step onto, not a blocker. WALK: the promenade (6). OVERHEAD (pass under, walk on): the pedestrian bridge span (18). STRUCTURE (blocks, ¾ face): the bridge towers (19, ENTERABLE -> the tower stair) and the marquee pylons (20). PROPS (solid): streetlight (9), signal mast (12), dead car (14), dead palm (11). The bridge is the only thing in the corridor at a second level, and it is the reason this street reads as the Strip and not as a wide arterial.

### Decisions & rulings
- A SURFACE, NOT A DISTRICT: a road cell never becomes faction territory, an economy district or a quest address. It registers surface:true, so the world renders it and bodies walk it while everything that counts districts keeps counting only districts. Same ruling the arterial ships under.
- A RUN AND A CROSSING ARE TWO DIFFERENT THINGS (Paolo 8/11, LOCKED): `strip` is the straight boulevard run, `strip_x` is the signalised crossing that carries the bridges. Same generator, same palette, one canonical body — two registered types so the ICON LAW gives the pair two icons and the map can never draw a crossing where a run is.
- vehicular:true under the WALKABLE-LAND LAW: a street is the one venue whose vehicle surface IS the venue. It is still dressed the whole length — median palms, planters, lights, pylons, bridges — and never a void.
- NO WALL, NO FENCE, NOTHING ENCLOSING (Paolo 8/16, LOCKED, and the real street agrees): a tract wall backs an arterial, but a resort podium fronts the Strip. The promenade runs to the boundary and the neighbour's own building starts on the other side of the line.
- LINE COLOR LAW held exactly: white divides lanes going the same way; yellow appears only at the left-turn bay where the median opens and opposing directions actually meet.
- MECHANISM-MINE / CONTENTS-PAOLO'S: the marquee pylons stand with BLANK faces and there is not one resort name, owner or faction anywhere in this module. Who holds the Strip is his to rule.
- ACT TRIPTYCH: only the act-1 dead material is specified. Act-2 recovering and act-3 rebuilt are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dirt margin | ground | a strip of graded dirt where the promenade stops short of the property line | ground | no | — | — |
| 1 | `#33333c` | asphalt roadway | drive | eight lanes of Las Vegas Boulevard, patched, rutted and sun-bleached | ground | no | — | 3832 |
| 2 | `#b3ab97` | white lane line | marking | faded white lane line, dashed between lanes going the same way | ground | no | — | 652 |
| 3 | `#b3ab97` | crosswalk | marking | ladder crosswalk across the approach, worn down to ghosts of bars | ground | no | — | — |
| 4 | `#5f5f4a` | palm median | ground | the wide landscaped median down the middle of the boulevard, irrigation dead, gravel and dust | ground | no | — | 1906 |
| 5 | `#6b6b74` | curb + gutter | ground | concrete curb and gutter, silt packed in it, the promenade starting right off the back of it | ground | no | — | 512 |
| 6 | `#8a8a92` | promenade | walk | the Strip promenade: wide pavers at the back of curb, cracked and lifted, sand drifted along the building line | ground | no | — | 2035 |
| 7 | `#4a4030` | planter | tree-dead | a tree well cut into the promenade, the tree gone, the pit full of grit and trash | prop | no | — | 19 |
| 9 | `#8f8676` | streetlight | prop | a boulevard light standard on the promenade, head dark | prop | yes | — | 9 |
| 11 | `#4d4a38` | dead palm | tree-dead | a Strip palm dead on its feet — bare grey trunk, the crown collapsed years ago; nothing in this valley is green | prop | yes | — | 23 |
| 12 | `#6a6a72` | signal mast | prop | traffic signal mast arm reaching out over the lanes, every head dark | prop | yes | — | — |
| 14 | `#55555f` | dead car | vehicle | a car left in the lane where the traffic stopped, tyres flat, glass gone | prop | yes | — | — |
| 15 | `#b3ab97` | stop bar | marking | wide white stop bar behind the crosswalk | ground | no | — | — |
| 16 | `#4a4842` | storm drain inlet | ground | curb inlet to the flood system, grate half choked with silt | ground | no | — | — |
| 17 | `#b09a3a` | yellow turn-pocket line | marking | yellow line bordering the left-turn bay where the median opens | ground | no | — | — |
| 18 | `#7c8390` | pedestrian bridge | overhead | the enclosed pedestrian bridge over the boulevard — you walk ACROSS it and you pass UNDER it; the glazing is starred and the moving walkway is stopped | overhead | no | — | — |
| 19 | `#6d7280` | bridge tower | structure | the stair and escalator tower carrying the bridge down to the promenade, escalator treads frozen mid-flight | structure | yes | the tower stair: switchback flights up to the bridge deck, handrails cold, one landing open to the street | — |
| 20 | `#5c5648` | marquee pylon | structure | a resort marquee pylon standing at the property line, the sign face dark and blank | structure | yes | — | 20 |
| 21 | `#7e7e86` | paver band | walk | the banded pavers running down the middle of the promenade, lifted and rocking where the roots got under them | ground | no | — | 2793 |
| 22 | `#6f6f78` | building-line margin | walk | the last strip of promenade against the property line, where the resort frontage takes the ground over — sand drifted deep along it | ground | no | — | 2923 |
| 23 | `#2e2e36` | junction box | drive | the asphalt inside the junction, polished by the turning traffic and unpainted, because nothing is ever striped through a crossing | ground | no | — | — |
| 24 | `#3b3b44` | bus / taxi lane | drive | the kerb-side bus and taxi lane, rutted where a thousand coaches stopped in the same spot every day | ground | no | — | 1660 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
