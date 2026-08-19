# BOHEMIA DISTRICT DOSSIER — CONVENTION

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_convention.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The convention centre: two ENORMOUS column-free exhibit halls filling the blob, a glazed concourse spine threading them, and a WALL OF LOADING DOCKS onto a truck marshalling yard along the back — which is what the building is actually for.**

### Real-world reference
- Las Vegas Convention Center (~200 acres, ~4.6 million sq ft across North/Central/South/West halls). From above the building IS its exhibit halls: column-free boxes a city block across, blind on three sides, with the roof plant field the only texture on them. A thin glazed concourse threads the halls and carries registration. The back of every hall is a dock wall onto a marshalling yard, because a hall's real job is swallowing a hundred semi-trailers of freight in two days.

### Layout — what is where
- TWO HALLS fill most of the blob, side by side along its long axis, each one column-free and blind.
- The CONCOURSE is a thin glazed spine between them, running the long axis, and is the only glass on the building.
- The DOCK WALL runs the whole back edge: roll-up doors onto a dock apron and a marshalling drive with trailers still backed in.
- The ENTRY PLAZA is on the primary street frontage. No canopy over it (Paolo 8/2).

### Circulation (street-aware / drivable)
The service DRIVE (code 1) enters at curb cuts off the street and runs the length of the dock wall, so a truck reaches every door. Pedestrians cross the entry plaza (12) into the concourse (6); the dock doors (8) are portals onto the hall floor.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: apron (0), service drive (1) + markings (11), dock apron (7), entry plaza (12), curb cuts (5), dry planters (3). STRUCTURE (solid, ¾ face): the EXHIBIT HALLS (2, ENTERABLE), the CONCOURSE (6, ENTERABLE), the roof plant (4). PORTAL: dock doors (8). PROPS: pole lights (9), abandoned trailers (10). The halls are one low enormous plate; nothing else on the site has height.

### Decisions & rulings
- CLUSTER-BUILT: 6 cells, one 3x2 blob, laid in valley coordinates so it is ONE convention centre and not six.
- No fence, no perimeter wall, no canopy (Paolo 8/16 and 8/2). The hall wall is the edge.
- NO NAME, NO OWNER, NO FACTION anywhere (MECHANISM-MINE / CONTENTS-PAOLO'S).
- ACT TRIPTYCH: act-1 dead only. Act 2 and 3 are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | apron | ground | the cracked concrete apron between the halls, weeds in every joint | ground | no | — | 2569 |
| 1 | `#3f3d38` | service drive | drive | the truck marshalling drive along the dock wall (car-drivable) | ground | no | — | 1397 |
| 2 | `#726a5b` | exhibit hall | building | an exhibit hall: a column-free box the size of a city block, blind on three sides | structure | yes | the hall floor: acres of sealed concrete under a dead ceiling grid, booth numbers still taped down | 6296 |
| 3 | `#4a4030` | dry planter | tree-dead | a planter gone to dust | prop | no | — | 5 |
| 4 | `#8a8072` | hall roof plant | structure | the roof plant field: air handlers and duct runs the length of the hall | structure | yes | — | 1680 |
| 5 | `#c2a86a` | drive entrance | gate | the curb cut off the street, no barrier | portal | no | — | — |
| 6 | `#8e8a80` | concourse | building | the glazed concourse spine threading the halls, most panes starred | structure | yes | the concourse: a long glass corridor, registration counters shoved aside | 368 |
| 7 | `#5f5a52` | dock apron | ground | the dock apron, oil-black where the trailers stood | ground | no | — | 768 |
| 8 | `#2e2a24` | dock door | portal | a roll-up dock door standing open onto the hall floor | portal | no | — | 154 |
| 9 | `#8f8676` | pole light | prop | a yard light on its stem, head dark | prop | yes | — | 12 |
| 10 | `#55555f` | abandoned trailer | vehicle | a semi-trailer left backed into its dock | prop | yes | — | 183 |
| 11 | `#c9c1aa` | lane marking | marking | faded dock lane numbers | ground | no | — | 20 |
| 12 | `#a49a86` | entry plaza | walk | the entry plaza pavers, drifted with grit | ground | no | — | 2932 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
