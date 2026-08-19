# BOHEMIA DISTRICT DOSSIER — TERMINAL

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_terminal.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead transit centre — a curved two-storey head house behind a glazed south wall, an open boarding platform, a PHOTOVOLTAIC ARRAY on the head-house roof, SIXTEEN sawtooth bus bays with the buses still in some of them, SEVEN on-street loading points at the kerb, a hundred double-stacked bike racks, a layover row and a small park-and-ride. A VEHICULAR VENUE: the vehicle surface is the venue.**

### Real-world reference
- BONNEVILLE TRANSIT CENTER (2010, 101 E Bonneville Ave, downtown Las Vegas), LEED Platinum: 16 on-site vehicle bays, 7 on-street loading points, roughly 100 double-stacked bike racks with a self-service repair stand, preferred parking for hybrids, a fully enclosed passenger waiting area in a 2-storey ~20,000 sq ft building, and SOLAR-PANEL SHADE STRUCTURES over the bays. Its curved lines are what the design juries singled out.
- Sawtooth bay geometry, standard for bus facilities: angled boxes off a single platform edge so a coach pulls in and pulls straight out again without reversing across the apron.

### Layout — what is where
- THE HEAD HOUSE runs across the north as a bar with a CURVED concourse bulging south out of it — one building, the curve merged into the bar, its whole south wall glazed.
- THE BOARDING PLATFORM runs the full width below it, with a numbered POST at the nose of each bay.
- SIXTEEN SAWTOOTH BAYS are painted off the platform edge onto the apron, angled, with buses still standing in every third one.
- THE PHOTOVOLTAIC ARRAY sits ON THE HEAD-HOUSE ROOF (8/2), not over the platform. Same panels, same count, roof-mounted equipment — nothing left for a person to stand under. The platform is open sky.
- A HUNDRED DOUBLE-STACKED BIKE RACKS stand in two banks on the forecourt either side of the doors.
- THE LAYOVER ROW is the line of parked buses across the middle of the apron; the PARK-AND-RIDE and its stall ticks fill the south strip; SEVEN painted on-street loading points sit at the kerb outside the property line.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut, deliberately wider than a car gate because a bus has to make it, feeds an apron that is a single connected surface a coach can turn in — bays, layover row and park-and-ride all reach the kerb (K.driveNetworkReach = 1.0). Every painted thing here (bay boxes, stall ticks, kerb points) is MARKING, so a bus drives straight over it, and NOTHING on this plot is overhead. Foot circulation is forecourt -> doors -> waiting room -> platform -> bay. A corner adds a pedestrian gate onto the forecourt.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat): the forecourt paving (7), the hardpan (4), the boarding platform (13, WALK), the apron / park-and-ride (1, DRIVE) with bay boxes (20), stall ticks (17) and kerb points (19) all MARKING, bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the HEAD HOUSE (2 — enclosed waiting room, ticket counter, restrooms, upstairs operations), its curtain wall glazing (11), roof edge (14), rooftop plant (8), the ROOF-MOUNTED PV array (6), the bay posts (10), the bike racks (12), the apron lights (9). PROP: dead trees (3), dead buses (15) and cars (18). PORTAL: the doorways (16) and the kerb cut (5).

### Decisions & rulings
- THE LAWN IS DEAD. 26% of this plot was painted green in a valley that stopped watering things a decade before act one opens — the exact greenwash Paolo caught in downtown. Replaced with hardpan and paved forecourt.
- THE NUMBERS ARE THE REAL BUILDING'S: 16 bays, 7 kerb loading points, 100 double-stacked racks. The gate counts all three. A number taken from the real thing is a fact the machine can hold; a number invented on the day is decoration.
- VEHICULAR VENUE (WALKABLE-LAND exception, 7/20): at a transit centre the vehicle surface IS the venue, so the pavement cap does not apply — but the exemption is not a licence for a bare apron, and this one is dressed with platform, shade, posts, racks, buses and a layover row.
- Deliberately differentiated from the railyard (FREIGHT rail, no passengers) and from every other district: nothing else in the valley is a sawtooth of sixteen bays under a solar deck. Every district is its own landmark (7/28).
- Act-1 DEAD: buses in the bays with the glass gone and the tyres perished into the concrete, route boards faded to blank rectangles, panels milky and half stripped for copper. Who runs anything on these roads now is faction canon and stays Paolo's.
- Zero purple. No route numbers, agency name or signage text anywhere (Paolo's to author).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb | ground | no | — | 1325 |
| 1 | `#33333c` | apron / drive / lot | drive | the bus apron and the park-and-ride — heavy-duty concrete gone to plates, weeds up every joint (bus- and car-drivable) | ground | no | — | 4595 |
| 2 | `#8c8577` | head house | building | the two-storey terminal, its long curved south wall glazed end to end, the waiting room dark behind it | structure | yes | terminal interior: the enclosed waiting room along the curve, the ticket and information counter, restrooms, and the operations offices on the upper floor | 1666 |
| 3 | `#514f40` | dead tree | tree-dead | a dead forecourt tree gone to stick, its grate prised up for the metal | prop | yes | — | 1 |
| 4 | `#6b6250` | hardpan | ground | decomposed granite gone to hardpan at the edges of the site, split by weeds. Not a lawn: nothing is watering this | ground | no | — | 1224 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street onto the apron, wide enough for a bus, amber paint gone chalky | portal | no | — | 13 |
| 6 | `#3f4a55` | rooftop solar array | structure | the photovoltaic array bolted across the head house roof — the LEED Platinum signature, the glass milky now and half the strings stripped for the copper in their leads | structure | yes | — | 270 |
| 7 | `#7f7a70` | forecourt paving | ground | the paved forecourt between the street and the head house, big scored slabs heaved at the joints | ground | no | — | 2174 |
| 8 | `#6e6a60` | rooftop plant | structure | a mechanical unit on the head house roof, ducting collapsed, one of them stripped out entirely | structure | yes | — | 153 |
| 9 | `#b0863a` | light | structure | an apron light on its concrete stem, head dark, the glass long gone | structure | yes | — | 7 |
| 10 | `#5f5c54` | bay post | structure | the numbered post at the nose of a bay, the route board on it faded to a blank white rectangle | structure | yes | — | 16 |
| 11 | `#8fa2ad` | curtain wall glazing | structure | the glazed curve of the waiting room — the panels that are left are sun-hazed, the rest is board and sky | structure | yes | — | 476 |
| 12 | `#5d6a6e` | bike rack | structure | a double-stacked bike rack, two bikes high, most of the hoops empty and one wheel still locked to the frame | structure | yes | — | 50 |
| 13 | `#96907f` | boarding platform | walk | the raised boarding platform running the length of the bays, tactile edge strip worn smooth | ground | no | — | 1340 |
| 14 | `#b3a78d` | roof edge | structure | the parapet line where the head house roof meets its wall, coping missing in runs | structure | yes | — | 246 |
| 15 | `#5c6468` | dead bus | vehicle | a bus left where it stopped, glass gone, tyres flat and perished into the concrete | prop | yes | — | 625 |
| 16 | `#241f1a` | doorway | portal | a way in — the platform doors, and the operations door on the north side | portal | no | — | 78 |
| 17 | `#4a4a52` | stall marking | marking | the painted stall ticks across the park-and-ride, chalked out to ghosts — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 301 |
| 18 | `#6a6e72` | dead car | vehicle | a car left in the park-and-ride, flat and sun-bleached, nobody came back for it | prop | yes | — | 88 |
| 19 | `#8a7a48` | kerb loading mark | marking | a painted on-street loading point at the kerb — one of seven, yellow gone to bone. PAINT IS NOT A WALL | ground | no | — | 204 |
| 20 | `#55555f` | bay marking | marking | the painted box of a sawtooth bay, angled so a bus pulls straight out without reversing. PAINT IS NOT A WALL | ground | no | — | 994 |
| 21 | `#6f6a5e` | roof joint | structure | the joint line between two roof plates on the head house, sealant gone chalky and lifted out in runs | structure | yes | — | 427 |
| 22 | `#57575f` | lane line | marking | the dashed lane line down the apron, showing a coach the through route past the bays. PAINT IS NOT A WALL | ground | no | — | 111 |

**Gate:** `gates/terminal_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
