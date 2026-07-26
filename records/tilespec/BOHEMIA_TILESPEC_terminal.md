# BOHEMIA DISTRICT DOSSIER — TERMINAL

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_terminal.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead transit terminal — a waiting-hall building with a stopped schedule-board clock, a row of bus bays under a long boarding canopy with a raised platform, a bus layover yard, a kiss-and-ride loop, a small park-and-ride lot. Passenger transport, distinct from the freight-only railyard.**

### Real-world reference
- Intercity/regional bus-terminal design precedent: a TERMINAL BUILDING (waiting hall, ticket counters, restrooms) fronts a row of BUS BAYS under a long boarding CANOPY with a raised PLATFORM; a separate LAYOVER/staging yard holds off-duty buses; a KISS-AND-RIDE drop-off loop and a small PARK-AND-RIDE lot serve car access; a schedule-board clock is the conventional terminal landmark.

### Layout — what is where
- The TERMINAL building sits at the back of the lot with a schedule-board CLOCK tower over its doors.
- A boarding CANOPY (overhead — pass under it) shelters the raised PLATFORM in front of the building; benches line the platform.
- A row of BUS BAYS runs along the platform, a dead bus staged at each; bay-line striping marks the lane.
- A LAYOVER/staging yard (SE) holds more of the fleet parked dead, off the passenger bays; a kiss-and-ride loop + small park-and-ride lot sit SW.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entrance opens onto the primary street; the bays, layover yard, kiss-and-ride loop, and park-and-ride lot are ALL one connected drivable surface (code 1) reachable from the curb (K.driveReachFromStreet) — buses and cars alike. Corner side streets get a pedestrian gate onto the platform side. Foot circulation is the platform along the canopy.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the platform (7), lawn (4), the drive/bays/lot (1, drive), bay marking (11), desert (0). OVERHEAD (drawn above, pass under): the boarding CANOPY (6). STRUCTURES (¾ front face, solid, ENTERABLE): the TERMINAL building (2 -> waiting hall/ticket counters/restrooms/office) with the schedule-board CLOCK (12). PROPS / VEHICLES: dead buses (10, solid, at bays and in the layover yard), benches (8), pole lights (9), bike rack (13). PORTALS: the gate (5). The terminal + clock are the vertical mass; the canopy and its dead bus fleet are the wide low read you approach across the platform.

### Decisions & rulings
- Act-1 DEAD: buses dead at the bays and in the layover yard (flat tyres, blank destination signs), the schedule board dark and stopped, the waiting hall boarded, benches empty. Who if anyone still runs a route is faction canon (Paolo's).
- Infrastructure category (terminal) — already reserved in K.TAXONOMY (Paolo 7/18's taxonomy pass anticipated this slot alongside airport/rail/freeway), filled in this turn rather than inventing a new bucket.
- Deliberately distinct from railyard: PASSENGER transport (terminal building, platform, bus bays, kiss-and-ride) vs railyard's FREIGHT classification tracks and rolling stock — no overlap in vocabulary.
- WALKABLE-LAND honored: the building + canopy + platform + parked bus fleet are the content that anchors the paved bus surface — never a bare apron with a tiny building stranded in it.
- Research-first (per the playbook): built from real intercity/regional bus-terminal design, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the terminal-lot edge (setback) | ground | no | — | 2413 |
| 1 | `#4a463c` | drive | drive | the bus bays, layover yard, kiss-and-ride loop, and park-and-ride lot — one connected car surface (drivable) | ground | no | — | 5002 |
| 2 | `#726a58` | building (terminal) | building | the terminal — waiting hall, ticket counters, restrooms, boarded, the departures board dark | structure | yes | terminal interior: the waiting hall + ticket counters up front, restrooms + a small office behind | 2336 |
| 3 | `#3a4526` | dead landscaping | tree-dead | a dead tree / hedge at the lot edge | prop | no | — | 13 |
| 4 | `#49512e` | lawn | ground | the dead lawn edging the terminal lot | ground | no | — | 4318 |
| 5 | `#c79a3f` | gate | gate | the terminal entrance off the street, amber curb | portal | no | — | 2 |
| 6 | `#5a564a` | boarding canopy | overhead | the boarding canopy over the bus bays (pass under it to reach the platform) | overhead | no | — | 502 |
| 7 | `#8f887a` | platform | ground | the raised boarding platform under the canopy, paint worn to bare concrete | ground | no | — | 332 |
| 8 | `#7a7268` | bench / shelter | prop | a platform bench, seat cracked, no one waiting | prop | yes | — | 8 |
| 9 | `#8f8676` | pole light | prop | a canopy-mounted light, dead | prop | yes | — | 8 |
| 10 | `#556065` | dead bus | vehicle | a bus dead at its bay or in the layover yard, tyres flat, destination sign blank | prop | yes | — | 1413 |
| 11 | `#c9c1aa` | bay marking | marking | faded bay-line striping on the bus lane | ground | no | — | 34 |
| 12 | `#8a7f5e` | schedule board / clock | structure | the schedule-board clock tower over the terminal doors, hands stopped, board blank | structure | yes | — | 1 |
| 13 | `#635c4a` | bike rack | prop | a bike rack near the entrance, empty, rusted | prop | yes | — | 2 |

**Gate:** `gates/terminal_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
