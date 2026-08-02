# BOHEMIA DISTRICT DOSSIER — CITYHALL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_cityhall.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead city hall — ONE building of two merged shapes, the ANGULAR seven-storey glass office block and the CURVILINEAR council chamber, standing on a podium behind a great entry canopy carried on a single column, with 33 SOLAR TREES in a grid across the public plaza in front of it and an attached parking deck to the east. The executive seat, distinct from the judicial courthouse.**

### Real-world reference
- LAS VEGAS CITY HALL (Elkus Manfredi Architects, 2012, 495 S Main St). Two distinctive shapes — the curvilinear Council Chamber and the angular seven-storey glass office structure — that MERGE inside the lobby; a dynamic canopy over the plaza entrance carried on a single 160-foot column; and in the plaza a solar "tree farm" of 33 tubular columns 25 to 35 feet tall mounted with photovoltaic panels, which generated about 7% of the building's energy. The tree farm is what the building is recognised by from the air, so it is what this district is recognised by.
- US municipal civic-centre programme, kept: mayor's office, council chamber, city clerk, permits counter. What changed is the FORM — a clock tower is a New England town hall, and this is a Mojave one.

### Layout — what is where
- ONE BUILDING. The office block runs across the north with a stepped east wing and a stepped-back north wing; the round COUNCIL CHAMBER lands on its south face and merges into it. Every mass shares a wall.
- THE ENTRY CANOPY spans the plaza in front of the doors on ONE mast — an overhead, so you walk under it and it never blocks a path.
- THE SOLAR TREE FARM: exactly 33 masts on a grid, each under its panel, filling the plaza. Panels are overhead; the masts are what you bump into.
- Two dry reflecting BASINS flank the plaza, flagpoles stand either side of the doors, and the plaza light line runs along the kerb.
- THE PARKING DECK is attached on the east — columns on a grid under a roof edge, its floor drivable, with a ramp down to the surface lot and an aisle joining the two.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the surface lot, the east aisle and the ramp up into the deck, and the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The stall ticks are MARKING, so a car drives over them, and the canopy and panels are OVERHEAD, so they conduct a path instead of severing one. Foot circulation is plaza -> under the canopy -> the doors. A corner adds a pedestrian gate onto the plaza, never a second car entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk on it): the civic plaza (7), the forecourt hardpan (4), the podium and walks (13), the dry basins (8), the lot / aisle / deck floor (1, DRIVE) and its stall ticks (21, MARKING), bare desert (0). OVERHEAD (pass UNDER): the solar panels (6) and the entry canopy (14). STRUCTURE (¾ front face, solid, ENTERABLE): the CITY HALL mass (2 — permits hall, council chamber, seven floors of offices), the curtain wall glazing (11), the chamber roof (17), the roof edge (16), the solar tree masts (10), the canopy mast (15), the deck columns (20), the plaza lights (9). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18) and the kerb cut (5).

### Decisions & rulings
- THE CLOCK TOWER IS DEAD and the LAWN with it. A clock tower is a New England town hall; the lawn was 28% of the plot painted green in a valley that stopped watering anything. Replaced with the real local landmark and with decomposed granite.
- THE 33 IS NOT DECORATIVE. Elkus Manfredi built 33 solar trees; this district draws 33 and its gate counts them. A number taken from the real building is a fact the machine can hold.
- Deliberately differentiated from the courthouse (L-plan + rotunda + blast setback) and from the library (drum + tower + reading wing): here it is a grid of solar trees under a single-masted canopy. Every district is its own landmark (7/28).
- ONE BUILDING (8/2): the chamber and the block merge, the way they do in the real lobby. Articulation, not fragmentation.
- WALKABLE-LAND: building + plaza + tree farm dominate; the lot and deck are the only pavement, and the deck is a real vehicular structure rather than more apron.
- Act-1 DEAD: panels milky and half stripped for the copper in the leads, basins dry with tidemarks, curtain wall boarded in runs, deck columns spalled to the rebar. Who administers anything now is faction canon and stays Paolo's.
- Zero purple. No city name, seal text or signage anywhere (Paolo's to author).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb | ground | no | — | 1467 |
| 1 | `#33333c` | drive / lot / deck | drive | the visitor lot, the aisle and the deck floor above it — asphalt gone to plates, weeds up every joint (car-drivable) | ground | no | — | 1573 |
| 2 | `#7d7566` | city hall | building | sand-coloured precast and glass — the angular office block and the curved council chamber that merge in the lobby, the curtain wall boarded in runs where it came down | structure | yes | city hall interior: the public counter and permits hall behind the doors, the round council chamber under its own roof, seven floors of department offices in the block | 2336 |
| 3 | `#514f40` | dead tree | tree-dead | a dead civic tree gone to stick, its grate prised up for the metal | prop | no | — | 1 |
| 4 | `#6b6250` | forecourt hardpan | ground | decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this | ground | no | — | 1293 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street into the lot, amber paint gone chalky | portal | no | — | 11 |
| 6 | `#3f4a55` | solar panel | overhead | a photovoltaic panel on its tree — the glass milky, half the array stripped for the copper in the leads. You walk and drive UNDER it | overhead | no | — | 792 |
| 7 | `#8b8478` | civic plaza | ground | the public plaza under the solar trees, big pavers heaved by roots, the meeting-day chalk long gone | ground | no | — | 1775 |
| 8 | `#5a6660` | dry fountain basin | water-dead | a reflecting basin bone dry, the old waterline stained around it like a tidemark | ground | no | — | 129 |
| 9 | `#b0863a` | plaza light | structure | a plaza light on its concrete stem, head dark, the glass long gone | structure | yes | — | 7 |
| 10 | `#6e6a60` | solar tree mast | structure | the tubular column of a solar tree, thirty feet of steel, powder coat blistered off the sunward side | structure | yes | — | 33 |
| 11 | `#8fa2ad` | curtain wall glazing | structure | the glass curtain wall — the panels that are left are sun-hazed, the rest is board and sky | structure | yes | — | 761 |
| 12 | `#8a7f5e` | flagpole | prop | a flagpole beside the doors, halyard slapping in the wind, nothing left on it | prop | yes | — | 2 |
| 13 | `#7d7a71` | walk / podium | walk | the raised concrete podium the building stands on and the walks across it, cracked corner to corner | ground | no | — | 2681 |
| 14 | `#9a9184` | entry canopy | overhead | the great canopy over the main entrance, one edge folded down where a panel let go. You walk UNDER it | overhead | no | — | 1047 |
| 15 | `#a89c86` | canopy mast | structure | the single column that holds the whole canopy up, a hundred and sixty feet of it, still dead plumb | structure | yes | — | 49 |
| 16 | `#b3a78d` | roof edge | structure | the parapet line where a roof meets its wall, coping missing in runs | structure | yes | — | 457 |
| 17 | `#a3947a` | council chamber roof | structure | the round roof over the council chamber, its ring of clerestory glazing gone | structure | yes | — | 300 |
| 18 | `#241f1a` | doorway | portal | a way in — the main doors under the canopy, the deck stair, the loading door on the north wing | portal | no | — | 92 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 72 |
| 20 | `#77726a` | deck column | structure | a concrete column holding the parking deck up, corner spalled to the rebar | structure | yes | — | 48 |
| 21 | `#4a4a52` | stall marking | marking | the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 253 |
| 22 | `#8b8272` | deck edge | structure | the spandrel rail round the parking deck, a bay of it folded outward where something went through | structure | yes | — | 62 |
| 23 | `#635c4f` | roof joint | structure | the joint line between two roof plates, sealant gone chalky and lifted out in runs | structure | yes | — | 450 |
| 24 | `#4c4a48` | deck floor | drive | the covered floor of the parking deck — lighter than the open lot because the sun never got at it, oil ghosts still in every stall (car-drivable) | ground | no | — | 453 |
| 25 | `#6e6a60` | rooftop plant | structure | a mechanical unit on the office roof, ducting collapsed, one of them stripped for its copper | structure | yes | — | 240 |

**Gate:** `gates/cityhall_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
