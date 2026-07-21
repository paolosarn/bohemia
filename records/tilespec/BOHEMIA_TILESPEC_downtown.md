# BOHEMIA DISTRICT DOSSIER — DOWNTOWN

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_downtown.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead downtown block — four podium blocks with slender towers rising from them, filling the block to the street wall, a street grid threading through, a central plaza with a sculpture, a skybridge between towers. The densest district — the core.**

### Real-world reference
- Downtown / podium-tower urbanism (ArchDaily podium-tower, LA Downtown Design Guide street wall, Phoenix City Square): a high-coverage low-rise PODIUM base (retail + parking + loading) fills the block to a tight STREET WALL along the sidewalks; slender TOWERS rise from the podiums; plazas + a street grid; the model maximizes density while holding a human-scaled street wall.

### Layout — what is where
- Four PODIUM blocks (dead retail + parking base, window/floor detail) fill the quadrants to the STREET WALL along the wide sidewalks, each with a slender TOWER rising from its centre (rooftop mech atop).
- An internal STREET grid (a cross with lane dashes) threads the block.
- A central PLAZA at the crossing carries dead street trees + a sculpture/fountain; setback planters + street trees line the street wall; a SKYBRIDGE spans between towers.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the block entrance is on the primary street; the internal STREET grid (code 1) is drivable, reached from the curb (K.driveReachFromStreet). Foot circulation is the wide sidewalks + the plaza. WALKABLE-LAND: the podiums + towers dominate overwhelmingly — the densest district, almost all building. Corner side streets get a pedestrian gate onto the sidewalk.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the street (1, drive) + crosswalks (11), the sidewalks (8), the plaza (7), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the PODIUM blocks (2 -> retail concourse + lobby + parking + cores) with the TOWERS (6) rising from them + rooftop mech (10) + parking decks (13). OVERHEAD (pass under): the SKYBRIDGE (12). PROPS: street trees (3), planters (4), pole lights (9). PORTALS: the gate (5). The towers over the podium street wall are the vertical hero; the street grid + plaza are the low plane you move through.

### Decisions & rulings
- Act-1 DEAD: towers dark + glass shattered, ground-floor retail boarded, the plaza weed-split, the skybridge dead. Who holds the core (the high ground of the dead city) is faction canon (Paolo's).
- Commercial category (downtown). Zero purple. No corporate names/signage (Paolo's to author).
- WALKABLE-LAND honored overwhelmingly: the densest district — podiums + towers dominate, streets are the connective grid.
- Research-first (per the playbook): built from real podium-tower downtown design, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare dirt at a broken block edge (rare downtown) | ground | no | — | 2196 |
| 1 | `#33333c` | street | drive | the cracked downtown street threading the block (car-drivable), double-yellow gone | ground | no | — | 1679 |
| 2 | `#6a6a72` | podium / mid-rise | building | a low-rise podium block — dead ground-floor retail + parking, boarded | structure | yes | podium interior: the retail concourse + lobby at grade, parking + back-of-house behind, cores up to the tower | 8110 |
| 3 | `#3a4526` | street tree | tree-dead | a dead street tree in its grate | prop | no | — | 24 |
| 4 | `#43521f` | setback planter | prop | a dead streetwall planter | prop | no | — | — |
| 5 | `#c79a3f` | gate | gate | the street entrance to the block, amber curb | portal | no | — | 7 |
| 6 | `#4e4e58` | tower | structure | a slender tower rising from the podium — dark glass shattered, floors dead | structure | yes | — | 888 |
| 7 | `#8f8676` | plaza | ground | the central plaza at the crossing, cracked pavers, weeds | ground | no | — | 242 |
| 8 | `#6a675e` | sidewalk | ground | the wide downtown sidewalk / street-wall frontage, cracked | ground | no | — | 2941 |
| 9 | `#8f8676` | pole light | prop | a street pole light, head dark | prop | yes | — | 5 |
| 10 | `#8a8478` | tower rooftop mech | structure | rooftop mechanical / a water tank atop a tower | structure | yes | — | 15 |
| 11 | `#c9c1aa` | crosswalk / marking | ground | faded crosswalk / lane paint | ground | no | — | 210 |
| 12 | `#43521f` | skybridge | overhead | a skybridge spanning the street between towers (you pass UNDER it) | overhead | no | — | 67 |
| 13 | `#4a4a52` | parking podium deck | structure | exposed structured-parking deck in a podium base | structure | yes | — | — |

**Gate:** `gates/downtown_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
