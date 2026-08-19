# BOHEMIA DISTRICT DOSSIER — FORT

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_fort.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The Old Mormon Fort: an adobe square with a corner bastion beside Las Vegas Creek, one original adobe building still standing inside it — the oldest structure in the valley, and the reason a city is here at all.**

### Real-world reference
- Old Las Vegas Mormon Fort State Historic Park. Built 1855 as an adobe square roughly 150 ft on a side with a bastion at one corner, sited on Las Vegas Creek — the spring that made the valley a stop on the Spanish Trail and the reason a city exists here. One original adobe building survives; the rest of the walls are reconstruction on the footprint.

### Layout — what is where
- The ADOBE SQUARE fills the middle of the cell with a BASTION at one corner and the GATE on the primary street side.
- THE ORIGINAL ADOBE BUILDING stands inside the square against one wall.
- LAS VEGAS CREEK runs down one side with the only living grass in the valley along it.
- An interpretive path loops the outside; a dirt track comes up to the gate.

### Circulation (street-aware / drivable)
The dirt TRACK (code 1) comes off the street to the gate. On foot the gate (5) is the way into the square, the doorway (8) the way into the adobe building, and the interpretive path (11) loops the outside.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: dust yard (0), the track (1), creek grass (6), interpretive path (11), dead mesquite (3). WATER: the creek (12). STRUCTURE (solid): the ADOBE WALL (2, ENTERABLE -> a store room in the wall thickness), THE ADOBE BUILDING (4, ENTERABLE), the BASTION (7, ENTERABLE). PORTAL: the gate (5) and the doorway (8). PROPS: corral posts (9), a park truck (10).

### Decisions & rulings
- ONE CELL. The real fort is about 150 ft square and fits inside 96 m with room for the creek.
- THE ADOBE WALL IS THE BUILDING, not a perimeter fence — it is the fort (Paolo 8/16 stands everywhere else in this file).
- THE CREEK STILL RUNS and the grass beside it is the only living green in the valley. That is a real fact about the site, not a mood: the spring is why the city exists. Whether anyone is using it is Paolo's.
- NO NAME, NO OWNER, NO FACTION, nobody in it.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dust yard | ground | the beaten dust of the fort yard, a century and a half of it | ground | no | — | 12617 |
| 1 | `#3f3d38` | track | drive | the dirt track up to the gate (car-drivable) | ground | no | — | 313 |
| 2 | `#a08a66` | adobe wall | building | the adobe curtain wall, mud brick under a century of weather, slumped in two places | structure | yes | inside the wall thickness: a store room, cool, dark, smelling of earth | 804 |
| 3 | `#4a4030` | dead mesquite | tree-dead | dead mesquite along the creek line | prop | no | — | 5 |
| 4 | `#b09a72` | adobe building | building | THE original adobe building — the oldest standing structure in the valley | structure | yes | one room with a beamed ceiling, a hearth, and a floor of packed earth | 331 |
| 5 | `#c2a86a` | fort gate | gate | the gap where the fort gate hung | portal | no | — | 35 |
| 6 | `#5f7a4a` | creek grass | ground | the last grass in the valley, along the creek, because the spring never stopped | ground | no | — | 730 |
| 7 | `#7a6a50` | bastion | building | the corner bastion, higher than the wall, with a view down the creek | structure | yes | the bastion: a ladder, a platform and loopholes onto three sides | 144 |
| 8 | `#2e2a24` | doorway | portal | a doorway in the adobe, no door left in it | portal | no | — | 10 |
| 9 | `#8f8676` | post | prop | a corral post standing on its own | prop | yes | — | 8 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a park truck left outside the wall | prop | yes | — | 11 |
| 11 | `#c9c1aa` | interpretive path | walk | the visitor path, its plaques prised off | ground | no | — | 608 |
| 12 | `#3a6a72` | creek | water | Las Vegas Creek: still running, which is the whole reason a city is here | ground | no | — | 768 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
