# BOHEMIA DISTRICT DOSSIER — DOWNTOWN

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_downtown.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead downtown core: four blocks that are four different things — a slender blue-glass TOWER off-centre on its podium with a forecourt, an open-sided PARKING STRUCTURE with its ramp climbing the face, a stepped bronze MID-RISE over a mid-block alley beside the gap-toothed lot where a building came down, and TWO SMALLER TOWERS under a run of retail awnings — around a street grid, a roundabout plaza with its dry fountain, and a skybridge over the street.**

### Real-world reference
- REBUILT 8/1 because on the whole-valley contact sheet this read as FOUR GREY SQUARES. It was one podium function called four times with an identical centred tower on each, in one grey — and downtown is the signature of a city, so if any district has to be a landmark it is this one.
- Podium-tower urbanism (ArchDaily podium-tower, LA Downtown Design Guide street wall, Phoenix City Square): a high-coverage low-rise base holding a tight street wall along the sidewalk, slender towers rising off it, the grid threading through.
- A REAL BLOCK IS NEVER ITS NEIGHBOUR. The four quadrants are deliberately four building types, and the parking structure is the load-bearing one — a garage with a visible ramp is the most instantly readable building in any city core.
- THE GLASS IS THE HUE. A core is dated by its curtain wall: 70s bronze, 80s blue, 90s green over concrete. Three faded tones is honest to the building type and it is what makes four blocks read as four.
- Built to the approved standard: the high school (89%), commercial (85%) and mall (85%).

### Layout — what is where
- NW is THE TOWER: a slender blue-glass tower set off-centre on its podium — a tower centred on its own base is a diagram, not a building — with a forecourt plaza and dead street trees in front.
- NE is THE PARKING STRUCTURE: open-sided decks with the cars still on them and a switchback RAMP climbing the east face.
- SW is the stepped bronze MID-RISE over a retail base, with a service ALLEY cut mid-block and the SURFACE LOT beside it where a building came down.
- SE is TWO SMALLER TOWERS, green and blue, on a shared podium under a run of retail awnings at grade.
- The street grid crosses at a ROUNDABOUT around the plaza and its dry fountain; a skybridge spans the street between two blocks.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet. RULE NUMBER ONE (Paolo 7/31): the street grid, the roundabout ring, the mid-block alley and the surface lot are ONE drive network and every tile of it is reachable from the kerb (K.driveNetworkReach) — the roundabout exists precisely so the four street arms can never be severed from each other. On foot the sidewalk runs the whole street wall, the forecourt and the plaza open off it, and the skybridge and awnings are OVERHEAD: you walk under them.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the streets (1), the alley (20), the surface lot (21), with the lane and stall paint (11). GROUND (walk): sidewalk (8), forecourt and plaza (7), desert margin (0). STRUCTURE (solid, ENTERABLE): the podiums (2), the towers and the mid-rise (6/15/16), the parking structure (13) — five different interiors — plus the roof edges (17) and rooftop plant (10), which sit ON the mass and are part of it. STRUCTURE (solid): pole lights (9), the garage ramp (14). OVERHEAD (you pass under): the skybridge (12) and the retail awnings (22). PROP: street trees (3), planters (4). VEHICLE: the cars on the decks and in the lot (19). PORTAL: the kerb gate (5) and every DOORWAY (18).

### Decisions & rulings
- FOUR BLOCKS, FOUR DIFFERENT BUILDINGS. The old module had one podium function called four times, which is exactly why it read as squares.
- THE TOWER IS OFF-CENTRE ON ITS PODIUM, deliberately. Centred towers are what made the old one read as a diagram rather than a place.
- NO SIGNAGE TEXT, no brand, no logo anywhere — MECHANISM-MINE / CONTENTS-PAOLO'S.
- ACT ONE ONLY (Paolo 7/28): stripped, dark, sun-bleached. No act-2/3 materials are specified.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt where the block ends and nobody ever built the next one | ground | no | — | — |
| 1 | `#33333c` | mid-block alley | drive | the service alley cut through the middle of the block — the townsite platted two rows of lots back-to-back onto it, so this is where every delivery, dumpster and back door on the block has always been (car-drivable, and it runs through to the street at both ends) | ground | no | — | 1139 |
| 2 | `#6d675b` | podium / retail base | building | the low podium that holds the street wall — ground-floor retail with every window out, dark mezzanine above | structure | yes | podium interior: a stripped retail floor, the escalator well dead, a service corridor running back to the alley | 762 |
| 3 | `#514f40` | street tree | tree-dead | a dead street tree still standing in its grate, trunk split, the iron grate itself long since prised up | prop | no | — | 18 |
| 4 | `#5b5343` | vacant parcel | ground | the parcel where a building came down and nothing replaced it — hardpan dirt and broken slab, its old footprint still printed in the ground, sun-bleached to the colour of everything else out here. NOT GRASS: nothing is watering downtown Las Vegas | ground | no | — | 2664 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the block entrance off the street, amber kerb paint gone chalky | portal | no | — | 11 |
| 6 | `#3f5570` | tower (blue glass) | building | an 80s blue curtain-wall tower — the glass gone milky where it survived and open to the sky where it did not | structure | yes | tower interior: a lobby stripped to its core, lift shafts standing open, the floor plates above reachable only by stair | 778 |
| 7 | `#6a675e` | forecourt plaza | ground | the tower forecourt — pavers heaved up by roots, the granite benches still exactly where they were bolted | ground | no | — | 216 |
| 8 | `#7d7a71` | sidewalk | walk | the downtown sidewalk, wide slabs cracked corner to corner, the awning bolts still in the wall above them | ground | no | — | 2696 |
| 9 | `#b0863a` | pole light | structure | a street light on its cast pole, head dark, the banner arm bent and empty | structure | yes | — | 6 |
| 10 | `#8e8a7c` | rooftop plant | structure | rooftop mechanical — cooling towers and duct runs, one unit stripped back to its coil for the copper | structure | yes | — | 98 |
| 11 | `#c9c1aa` | lane / stall marking | marking | faded paint — lane dashes down the street, stall ticks in the lot, most of it a ghost you read by the shadow | ground | no | — | 559 |
| 12 | `#5e6a72` | blade sign | structure | a blade sign cantilevered out over the sidewalk from a storefront parapet — downtown is where the neon started, and the board is blank because every word on it is Paolo's | overhead | no | — | 54 |
| 13 | `#3a3a42` | surface parking lot | drive | the surface lot — about a THIRD of downtown Las Vegas is off-street surface parking, and this is it: asphalt gone to plates, striping ghosted, the cars that were in it when everything stopped still in it (car-drivable) | ground | no | — | 3967 |
| 14 | `#6a6e72` | loading dock | prop | a loading dock off the alley — the dumpster still chained to the wall beside it, pallets stacked and never collected | prop | yes | — | 24 |
| 15 | `#7a5c34` | mid-rise (bronze) | building | a 70s bronze-glass mid-rise, stepped back at the shoulder, spandrel panels hanging off their clips | structure | yes | mid-rise interior: office floor plates with the partitions collapsed, the stair core still sound | 973 |
| 16 | `#3f6152` | storefront (green) | building | a 1930s storefront in faded green — the Arts District blocks still standing date from then — parapet stepped, transom glass gone | structure | yes | storefront interior: one deep narrow room to the party walls, counter ripped out, stock room and back door onto the alley | 1022 |
| 17 | `#9a9384` | roof edge | structure | the parapet line where a roof meets its wall, coping stones missing in long runs | structure | yes | — | 921 |
| 18 | `#241f1a` | doorway | portal | a way in — a lobby entrance with the glass gone, a stair-core door, a shopfront standing open | portal | no | — | 18 |
| 19 | `#6a6e72` | dead car | vehicle | a car left exactly where it was parked, flat and sun-bleached, on a deck or out in the lot | prop | yes | — | 304 |
| 20 | `#8c3f38` | storefront awning | structure | the awning over the shopfront walk, canvas split back to its frame, and you pass under it | overhead | no | — | 154 |

**Gate:** `gates/downtown_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
