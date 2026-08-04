# BOHEMIA DISTRICT DOSSIER — COURTHOUSE

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_courthouse.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead federal courthouse — ONE L-shaped building wrapping a public plaza in its elbow, with a three-storey ROTUNDA at the corner under a dead sixty-foot glass dome, a broad flight of ENTRANCE STEPS up out of the plaza between the piers that carry the wall above them, a blast standoff setback held by a bollard line, and a walled SECURE YARD with its sally port. The judicial seat, distinct from the executive city hall.**

### Real-world reference
- LLOYD D. GEORGE U.S. COURTHOUSE (CannonDesign, 2000, 333 Las Vegas Blvd S): a 450,000 sq ft L-SHAPED building of beige limestone, glass and 22ft x 10ft precast wall panels; a three-storey ROTUNDA public lobby capped by a 60-foot cable-truss glass dome; and a dramatic steel and aluminium canopy PROJECTING FROM THE TOP OF THE BUILDING that shadows the plaza. One of only three buildings in the country to take the GSA Honor Award for Architecture.
- It was the FIRST federal building constructed to the post-Oklahoma-City blast-resistance requirements. That is why the setback is wide and empty and why the bollard line exists: standoff distance IS the security, so the emptiness is a feature and not a void.

### Layout — what is where
- ONE BUILDING, an L. The west leg runs north-south, the north leg east-west, and the ROTUNDA bulges out of the elbow into the plaza. Every mass shares a wall.
- THE DOME reads from above as a bright RING, because sixty feet of it was glass and most of that is gone.
- THE PRECAST PANEL GRID (22ft x 10ft) runs across both roof plates — the cladding module, legible from the air — and the rooftop plant sits in a line along the north leg.
- THE ENTRANCE IS STEPS AND A SCREENING PORCH (8/2), not a cantilever: a broad flight up out of the plaza, the row of PIERS carrying the wall above them, and the public doors at the head of it. Nothing overhead on this plot.
- THE PUBLIC PLAZA fills the elbow with a dry basin, a flag row along the building face and a light line at its edge.
- THE BLAST SETBACK rings the whole plot, held by a BOLLARD LINE on the street side and the east flank.
- THE SECURE YARD is walled on the west with staff parking inside it, a SALLY PORT into the west leg, and a gated drive out to the public lot.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the public lot, and the drive along the south links it to the secure yard gate, so the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The sally port and yard gate are PORTALS, never a second car entrance. Stall ticks are MARKING, so a car drives over them, and NOTHING on this plot is overhead. Foot circulation is plaza -> up the entrance steps between the piers -> the public doors. A corner adds a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat): the public plaza (7), the blast setback (4), the walks (13), the dry basin (8), the lot and yard floor (1, DRIVE) with their stall ticks (21, MARKING), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the COURTHOUSE mass (2 — rotunda lobby, screening hall, courtrooms and jury suites up both legs, holding behind the sally port), the precast panel joints (6), the dome (17) and its glazing (11), the roof edge (16), the rooftop plant (10), the plaza lights (9), the security bollards and entrance piers (15), the secure yard wall (20, FENCE). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18), the sally port and yard gate (22), the kerb cut (5).

### Decisions & rulings
- THE COLONNADE IS DEAD, and the lawn with it. A portico and monumental steps is a county courthouse in Ohio; this valley has a blast-rated federal L with a glass dome, and that is what actually got built here.
- THE SETBACK IS NOT A VOID, and this is the one district where empty ground is CORRECT. Standoff distance is the security measure the building was the first in the country to be designed around. It is named, written and bollarded, so it is answered for.
- Deliberately differentiated from city hall (a seven-storey block merged with a round chamber over a bed of solar masts) and the library (drum + tower + reading wing): here it is an L round a plaza with a ringed dome at the elbow, standing back behind a bollarded setback. Every district is its own landmark (7/28).
- NO CANOPY (8/2, Paolo: "no more canopies I only see canopies at parks and shit"). The cantilever the real building is known for is gone. The reference line above KEEPS it, because the reference is a record of the real building and not a description of this plot — the LAYOUT note is what describes what got drawn.
- ONE BUILDING (8/2): both legs and the rotunda share walls; the yard wall is a fence, not a second courthouse.
- THE SECURE HALF is what a courthouse has and a city hall does not: a walled yard, staff parking inside it, and a sally port. It stays a PORTAL, never a second car entrance (street-aware law).
- Act-1 DEAD: the dome mostly sky, sealant dropped out of the panel joints, plant stripped for copper, pavers heaved, one sally port leaf standing open. Who holds the building now is faction canon and stays Paolo's.
- Zero purple. No inscriptions, seals or signage text anywhere (Paolo's to author).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb | ground | no | — | 1467 |
| 1 | `#33333c` | drive / lot | drive | the public lot and the secure yard floor — asphalt gone to plates, weeds up every joint (car-drivable) | ground | no | — | 1888 |
| 2 | `#9c9179` | courthouse | building | beige limestone and precast panel, an L wrapped round its own plaza, blast-rated walls that outlived the government that ordered them | structure | yes | courthouse interior: the rotunda lobby under the dead dome, the screening hall, courtrooms and jury suites stacked up both legs, holding cells behind the sally port | 2183 |
| 3 | `#514f40` | dead tree | tree-dead | a dead setback tree gone to stick, its grate prised up for the metal | prop | no | — | 7 |
| 4 | `#6b6250` | blast setback | ground | the standoff strip between the kerb and the wall — decomposed granite gone to hardpan. It is empty ON PURPOSE: this was the first federal building in the country built to the post-Oklahoma-City blast rules, and the emptiness IS the security | ground | no | — | 2257 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street into the public lot, amber paint gone chalky | portal | no | — | 11 |
| 6 | `#8a8069` | precast panel joint | structure | the joint line between two precast panels, twenty-two feet by ten, the sealant gone chalky and dropped out in runs | structure | yes | — | 748 |
| 7 | `#8b8478` | public plaza | ground | the plaza in the elbow of the building, big pavers heaved by roots, open to the sun corner to corner now that the cantilever is gone | ground | no | — | 2490 |
| 8 | `#5a6660` | dry basin | water-dead | a reflecting basin bone dry, the old waterline stained around it like a tidemark | ground | no | — | 103 |
| 9 | `#b0863a` | plaza light | structure | a plaza light on its concrete stem, head dark, the glass long gone | structure | yes | — | 5 |
| 10 | `#6e6a60` | rooftop plant | structure | a mechanical unit on the roof of the north leg, ducting collapsed, one of them stripped for its copper | structure | yes | — | 175 |
| 11 | `#93a2a8` | dome glazing | structure | what is left of the sixty-foot glass dome over the rotunda — a cable truss and mostly sky | structure | yes | — | 149 |
| 12 | `#8a7f5e` | flagpole | prop | a flagpole in the row facing the plaza, halyard slapping, nothing left on it | prop | yes | — | 3 |
| 13 | `#7d7a71` | walk | walk | the concrete walks across the setback, cracked corner to corner | ground | no | — | 2722 |
| 15 | `#5f5c54` | security bollard / entrance pier | structure | in the standoff line, a steel bollard still dead upright — nothing short of a truck moves one, and nothing has; at the entrance, one of the squat concrete piers carrying the wall above the doors | structure | yes | — | 154 |
| 16 | `#c0b498` | roof edge | structure | the parapet line where a roof meets its wall, coping missing in runs | structure | yes | — | 869 |
| 17 | `#b6a888` | rotunda dome | structure | the ring of the rotunda dome, the crown of the public lobby, its glazing gone | structure | yes | — | 230 |
| 18 | `#241f1a` | doorway | portal | a way in — the public doors at the head of the entrance steps, the staff entrance on the north leg | portal | no | — | 122 |
| 19 | `#6a6e72` | dead car | vehicle | a car left where it was parked, flat and sun-bleached, nobody came back for it | prop | yes | — | 96 |
| 20 | `#585349` | secure yard wall | fence | the wall round the secure yard, razor wire long since rusted off the top of it | structure | yes | — | 114 |
| 21 | `#4a4a52` | stall marking | marking | the painted stall ticks, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 240 |
| 22 | `#3a3630` | sally port | portal | the sally port — the sealed vehicle door prisoners came in through, one leaf standing open | portal | no | — | 85 |
| 23 | `#7a7263` | plaza planter | structure | a low limestone planter across the plaza, bed gone to hardpan with a dead tree still in it, coping cracked where people sat on it waiting to be called | structure | yes | — | 266 |

**Gate:** `gates/courthouse_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
