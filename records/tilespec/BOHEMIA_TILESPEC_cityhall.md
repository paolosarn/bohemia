# BOHEMIA DISTRICT DOSSIER — CITYHALL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_cityhall.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead city hall — ONE building of two merged shapes, the ANGULAR seven-storey glass office block and the CURVILINEAR council chamber, standing on a podium above a wide flight of ENTRANCE STEPS and a row of entry piers, with 33 SOLAR PANELS on masts standing in their own gravel bed at the plot edge, a public plaza in front, and an attached parking deck to the east. The executive seat, distinct from the judicial courthouse.**

### Real-world reference
- LAS VEGAS CITY HALL (Elkus Manfredi Architects, 2012, 495 S Main St). Two distinctive shapes — the curvilinear Council Chamber and the angular seven-storey glass office structure — that MERGE inside the lobby; a dynamic canopy over the plaza entrance carried on a single 160-foot column; and in the plaza a solar "tree farm" of 33 tubular columns 25 to 35 feet tall mounted with photovoltaic panels, which generated about 7% of the building's energy. The tree farm is what the building is recognised by from the air, so it is what this district is recognised by.
- US municipal civic-centre programme, kept: mayor's office, council chamber, city clerk, permits counter. What changed is the FORM — a clock tower is a New England town hall, and this is a Mojave one.

### Layout — what is where
- ONE BUILDING. The office block runs across the north with a stepped east wing and a stepped-back north wing; the round COUNCIL CHAMBER lands on its south face and merges into it. Every mass shares a wall.
- THE ENTRANCE IS STEPS, NOT SHADE (8/2). A wide flight up onto the podium, a row of squat ENTRY PIERS marking the doors, and the doors straight off the top step. Nothing overhead anywhere on this plot.
- THE SOLAR ARRAY: exactly 33 masts on a grid, each carrying its panel, standing in a DECOMPOSED-GRANITE BED at the plot edge — equipment you walk past, not a canopy you walk under.
- THE PLAZA IS DRESSED (8/4). Two dry reflecting BASINS, a grid of limestone PLANTERS with the dead trees still standing in them, a SEATING STEP where the podium meets the plaza, a BIKE RACK row by the doors, flagpoles either side, and the light line along the kerb. Taking the canopy out was not a licence to leave a hole where it stood.
- THE ARRAY BED IS PLANT, NOT GRAVEL: SERVICE AISLES between the panel rows and an INVERTER CABINET at the head of each one, because the string DC has to turn into AC somewhere.
- THE PARKING DECK is attached on the east — columns on a grid under a roof edge, its floor drivable, with a ramp down to the surface lot and an aisle joining the two.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the surface lot, the east aisle and the ramp up into the deck, and the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The stall ticks are MARKING, so a car drives over them. NOTHING on this plot is overhead. Foot circulation is plaza -> up the entrance steps between the piers -> the doors, and the solar bed is walked past on its granite, not through. A corner adds a pedestrian gate onto the plaza, never a second car entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk on it): the civic plaza (7), the forecourt hardpan (4), the podium, walks, seating step and array service aisles (13), the dry basins (8), the planter beds (4), the lot / aisle / deck floor (1, DRIVE) and its stall ticks (21, MARKING), the solar bed granite (4), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the CITY HALL mass (2 — permits hall, council chamber, seven floors of offices), the curtain wall glazing (11), the chamber roof (17), the roof edge (16), the solar panels (6) and their masts (10), the entry piers (15), the plaza planters (14), the bike racks (26), the inverter cabinets (27), the deck columns (20), the deck edge (22), the plaza lights (9). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18) and the kerb cut (5).

### Decisions & rulings
- THE CLOCK TOWER IS DEAD and the LAWN with it. A clock tower is a New England town hall; the lawn was 28% of the plot painted green in a valley that stopped watering anything. Replaced with the real local landmark and with decomposed granite.
- THE 33 IS NOT DECORATIVE. Elkus Manfredi built 33 solar trees; this district draws 33 and its gate counts them. A number taken from the real building is a fact the machine can hold.
- Deliberately differentiated from the courthouse (L-plan + rotunda + blast setback) and from the library (drum + tower + reading wing): here it is a seven-storey block merged with a round chamber, over a granite bed of 33 solar masts. Every district is its own landmark (7/28).
- NO CANOPY (8/2, Paolo: "no more canopies I only see canopies at parks and shit"). The entry canopy on its 160-foot mast is gone and the solar trees came off the plaza people walk across into their own bed. A solar tree you stand under is a canopy whatever the legend calls it.
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
| 2 | `#7d7566` | city hall | building | sand-coloured precast and glass — the angular office block and the curved council chamber that merge in the lobby, the curtain wall boarded in runs where it came down | structure | yes | city hall interior: the public counter and permits hall behind the doors, the round council chamber under its own roof, seven floors of department offices in the block | 2292 |
| 3 | `#514f40` | dead tree | tree-dead | a dead civic tree gone to stick, its grate prised up for the metal | prop | no | — | 16 |
| 4 | `#6b6250` | forecourt hardpan | ground | decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this | ground | no | — | 2096 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street into the lot, amber paint gone chalky | portal | no | — | 11 |
| 6 | `#3f4a55` | solar panel | structure | a photovoltaic panel on its tree, tilted to the south — the glass milky, half the array stripped for the copper in the leads. Equipment in its own bed, not something you shelter under | structure | yes | — | 528 |
| 7 | `#8b8478` | civic plaza | ground | the public plaza in front of the entrance steps, big pavers heaved by roots, the meeting-day chalk long gone, no shade on it anywhere | ground | no | — | 1388 |
| 8 | `#5a6660` | dry fountain basin | water-dead | a reflecting basin bone dry, the old waterline stained around it like a tidemark | ground | no | — | 90 |
| 9 | `#b0863a` | plaza light | structure | a plaza light on its concrete stem, head dark, the glass long gone | structure | yes | — | 4 |
| 10 | `#6e6a60` | solar tree mast | structure | the tubular column of a solar tree, thirty feet of steel, powder coat blistered off the sunward side | structure | yes | — | 33 |
| 11 | `#8fa2ad` | curtain wall glazing | structure | the glass curtain wall — the panels that are left are sun-hazed, the rest is board and sky | structure | yes | — | 761 |
| 12 | `#8a7f5e` | flagpole | prop | a flagpole beside the doors, halyard slapping in the wind, nothing left on it | prop | yes | — | 3 |
| 13 | `#7d7a71` | walk / podium | walk | the raised concrete podium the building stands on and the walks across it, cracked corner to corner | ground | no | — | 3346 |
| 14 | `#a79a7f` | plaza planter | structure | a low limestone planter across the plaza, bed gone to hardpan with a dead tree still standing in it, coping cracked along the edge people sat on | structure | yes | — | 138 |
| 15 | `#a89c86` | entry pier | structure | one of the squat piers marking the main entrance, concrete, a corner knocked off the sunward one | structure | yes | — | 120 |
| 16 | `#b3a78d` | roof edge | structure | the parapet line where a roof meets its wall, coping missing in runs | structure | yes | — | 457 |
| 17 | `#a3947a` | council chamber roof | structure | the round roof over the council chamber, its ring of clerestory glazing gone | structure | yes | — | 291 |
| 18 | `#241f1a` | doorway | portal | a way in — the main doors at the top of the entrance steps, the deck stair, the loading door on the north wing | portal | no | — | 126 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 72 |
| 20 | `#77726a` | deck column | structure | a concrete column holding the parking deck up, corner spalled to the rebar | structure | yes | — | 48 |
| 21 | `#4a4a52` | stall marking | marking | the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 253 |
| 22 | `#8b8272` | deck edge | structure | the spandrel rail round the parking deck, a bay of it folded outward where something went through | structure | yes | — | 62 |
| 23 | `#635c4f` | roof joint | structure | the joint line between two roof plates, sealant gone chalky and lifted out in runs | structure | yes | — | 450 |
| 24 | `#4c4a48` | deck floor | drive | the covered floor of the parking deck — lighter than the open lot because the sun never got at it, oil ghosts still in every stall (car-drivable) | ground | no | — | 453 |
| 25 | `#6e6a60` | rooftop plant | structure | a mechanical unit on the office roof, ducting collapsed, one of them stripped for its copper | structure | yes | — | 240 |
| 26 | `#5c5952` | bike rack | structure | a staple rack by the doors, two of the hoops cut through with a grinder and whatever was locked to them long gone | structure | yes | — | 42 |
| 27 | `#55524a` | inverter cabinet | structure | a string inverter at the head of a panel row, door hanging, the copper busbars inside cut out clean | structure | yes | — | 24 |

**Gate:** `gates/cityhall_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
