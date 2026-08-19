# BOHEMIA DISTRICT DOSSIER — DAM

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_dam.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The dam: an arch-gravity wall wedged across the canyon with the road on its crest, four intake towers standing out of the reservoir upstream, a spillway cut into each canyon wall, and the powerhouse in a U at the downstream toe. Act 1: the lake is a long way below its own bathtub ring and the turbines are still.**

### Real-world reference
- Hoover Dam: arch-gravity concrete, 726 ft high, 1,244 ft along the crest, wedged into Black Canyon. FOUR intake towers stand upstream, two on each side. TWO spillways are cut into the canyon walls as enormous open funnels. The POWERHOUSE is a U-shaped wing at the downstream toe. Transmission towers climb the canyon walls at angles no other structure is built at. US-93 ran across the crest until the bypass bridge opened in 2010.

### Layout — what is where
- The DAM WALL crosses the blob, curved upstream, with the CREST ROAD along its top.
- The RESERVOIR is upstream of the wall, drawn far below the BATHTUB RING it used to reach.
- FOUR INTAKE TOWERS stand out of the water, two per side.
- A SPILLWAY is cut into each canyon wall beside the dam; the POWERHOUSE is a U at the downstream toe with the TAILRACE below it.

### Circulation (street-aware / drivable)
The CREST ROAD (code 1) crosses the wall and meets the canyon road at both ends, so a car drives across. On foot the gallery door (8) is the way INTO the dam; the powerhouse and the intake towers are the other three volumes.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: canyon rock (0), crest road (1), spillways (6), the bathtub ring (7). WATER (not solid, not walkable): reservoir (3), tailrace (12). STRUCTURE (solid): the DAM WALL (2, ENTERABLE -> a gallery), INTAKE TOWERS (4, ENTERABLE), the POWERHOUSE (11, ENTERABLE). PORTAL: gallery door (8). PROPS: transmission towers (9), abandoned vehicle (10). The wall is the vertical event; everything else hangs off it.

### Decisions & rulings
- CLUSTER-BUILT: 4 cells, one 2x2 blob, so it is ONE dam and not four.
- THE BATHTUB RING is drawn because it is the single most legible fact about this lake in the last twenty years, and the `water` district already carries it — same feature, same reading, one valley.
- NO NAME, NO OWNER, NO FACTION. Who holds the dam is the biggest unruled question on the map and it is Paolo's (MECHANISM-MINE / CONTENTS-PAOLO'S). The boss ladder's own dam entry stays untouched by this file.
- ACT TRIPTYCH: act-1 dead only — the turbines are still and nothing is generating.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | canyon rock | ground | bare canyon rock, blasted flat where the works needed it | ground | no | — | 5592 |
| 1 | `#3f3d38` | crest road | drive | the two-lane road across the dam crest (car-drivable) | ground | no | — | 239 |
| 2 | `#9a948a` | dam wall | building | the arch-gravity wall itself, a concrete curve wedged into the canyon | structure | yes | a gallery inside the dam: wet concrete, a walkway, and the hum that is not there any more | 1356 |
| 3 | `#3a5a72` | reservoir | water | what is left of the reservoir, a long way below the white mineral ring it used to reach | ground | no | — | 5296 |
| 4 | `#8e8880` | intake tower | building | an intake tower standing out of the water on its own plinth | structure | yes | the tower head: a gantry, a dead hoist, and the shaft going straight down | 528 |
| 5 | `#c2a86a` | road entrance | gate | where the crest road meets the canyon road | portal | no | — | 48 |
| 6 | `#6f6a60` | spillway | ground | a spillway: a concrete funnel cut into the canyon wall, dry for twenty years | ground | no | — | 784 |
| 7 | `#b6ae9c` | bathtub ring | ground | the bathtub ring — the white mineral band the water left on the rock as it dropped | ground | no | — | 208 |
| 8 | `#2e2a24` | gallery door | portal | a steel door into the dam gallery, standing open | portal | no | — | 18 |
| 9 | `#8f8676` | transmission tower | prop | a transmission tower marching up the canyon wall, lines down | prop | yes | — | 120 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a car left on the crest where the road closed | prop | yes | — | 15 |
| 11 | `#5a5346` | powerhouse | building | the powerhouse in its U at the toe of the dam | structure | yes | the generator hall: a row of housings the size of rooms, every one silent | 828 |
| 12 | `#4a4a54` | tailrace | water | the tailrace below the powerhouse, a slow green channel | ground | no | — | 1352 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
