# BOHEMIA DISTRICT DOSSIER — LIBRARY

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_library.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead public library — ONE building, articulated: a sandstone DRUM under a dead oculus, a giant concrete TOWER standing where the parts meet, a MUSEUM WING wrapped around an enclosed courtyard, and a long low READING WING under a clerestory that runs its whole length. It stands on a raised terrace over a civic plaza with a dry fountain, and a small lot behind. Modelled on the real one this valley has.**

### Real-world reference
- ANTOINE PREDOCK, LAS VEGAS LIBRARY AND LIED DISCOVERY MUSEUM (1986-90, 833 Las Vegas Blvd N, opposite Cashman Field): a single continuous composition of primary geometric solids — a great sandstone drum/cone lit from an oculus, a tall square concrete tower, a museum wing and a low reading wing — NOT a campus of separate pavilions. Predock on the palette: "the color scheme is provided by the desert," which is why this district is sandstone and concrete with no green anywhere.
- Public-library programme (WBDG space types, Opening the Book space planning): circulation at the centre, wrapped by stacks, wrapped by reading rooms lit from above. That programme is kept — it is WHAT the drum and the reading wing contain — but the FORM is Predock's, not a generic colonnaded central library.

### Layout — what is where
- ONE BUILDING (Paolo 8/2, at 22%: "there's like six different buildings of the library"). The READING WING is the spine across the south of the plot; the DRUM lands on it; the TOWER is the hinge between the drum and the museum; the MUSEUM WING lands on the spine too. Every mass shares a wall with the mass beside it.
- THE DRUM carries the oculus RING (14) and its rooftop lantern (10) — the round clerestory that dropped daylight into the middle of the reading room.
- THE COURTYARD (12) is carved INSIDE the museum wing, enclosed on all four sides with dead planting in it. That is what makes it a courtyard and not a gap between two buildings.
- THE CLERESTORY (11) runs the length of the reading wing as a row of teeth; roof edges (17) and doorways (18) are placed by K.roofsAndDoors so no mass is a flat rectangle.
- THE ENTRY PLAZA (7) spans the front with a dry fountain basin and a line of plaza lights; the raised terrace (13) is what the whole building stands on; the forecourt (4) is unpaved hardpan with dead trees, never a lawn.
- THE LOT (1) and its service drive run behind, ticked into stalls, with a few cars nobody came back for.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut (5) on the primary street feeds the lot and the service drive down the west side, and code 1 is reachable from the curb end to end (K.driveReachFromStreet > 0.85). Foot circulation is plaza -> terrace -> the doors under the reading wing, with the museum entrance and the tower stair core as the other two ways in. WALKABLE-LAND: the plot is overwhelmingly building + plaza + terrace; the lot is the only pavement. A corner adds a pedestrian gate onto the plaza, never a second car entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk on it): the entry plaza (7), the forecourt hardpan (4), the terrace/walks (13), the enclosed courtyard (12), the lot and service drive (1, DRIVE), bare desert (0). STRUCTURE (¾ front face, solid, ENTERABLE): the LIBRARY/MUSEUM mass (2 — the drum is one round room under the dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery), the oculus RING (14), the clerestory glazing (11), the roof edge (17), the plaza lights (9), the rooftop lantern and mechanical plant (10). PROP: dead trees (3). PORTAL: the doorways (18) and the kerb cut/gate (5). The DRUM and the TOWER are the vertical hero — you cross the plaza, climb onto the terrace and go in under the reading wing.

### Decisions & rulings
- ARTICULATION IS NOT FRAGMENTATION (Paolo 8/2). "No building is a flat rectangle" means articulate the mass, never split it into a campus. The building type decides: a library is one building, a downtown block is many. The gate was rewritten the same turn — it had been REQUIRING four or more separate footprints.
- The generic columned central library was killed for the real local landmark. A valley builds what it built; Predock's is the library Las Vegas actually has.
- Act-1 DEAD: the oculus glazing gone, the clerestory mostly sky, the fountain basin dry, coping missing off the parapets, one plant unit stripped for its copper, cars flat in the lot. What survives on the shelves is a knowledge/scarcity question and stays PENDING Paolo.
- NO GREEN. Predock's desert palette is also the honest act-1 answer: nothing is watering this. The forecourt is decomposed granite gone to hardpan, not lawn.
- Civic category. Zero purple. No library name or inscription anywhere (Paolo's to author).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb | ground | no | — | 1467 |
| 1 | `#33333c` | drive / lot | drive | the library lot and its service drive — asphalt gone to plates, weeds up every joint (car-drivable) | ground | no | — | 1389 |
| 2 | `#9a7f5c` | library / museum | building | sandstone and concrete geometry — Predock built this valley a landmark out of a drum, a tower and two long low wings, and the sandstone is still the colour of the desert it was matched to | structure | yes | library interior: the drum is one round room under a dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery | 2712 |
| 3 | `#514f40` | dead tree | tree-dead | a dead courtyard tree gone to stick, its grate prised up for the metal | prop | no | — | 34 |
| 4 | `#6b6250` | forecourt ground | ground | the unpaved forecourt — decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this | ground | no | — | 1577 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street into the lot, amber paint gone chalky | portal | no | — | 11 |
| 6 | `#4a4a52` | stall marking | marking | the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 130 |
| 7 | `#8a8175` | entry plaza | ground | the civic plaza across the front — big sandstone pavers heaved by roots, and the fountain basin dry in the middle of it | ground | no | — | 1171 |
| 9 | `#b0863a` | plaza light | structure | a plaza light on its concrete stem, head dark, the glass long gone | structure | yes | — | 7 |
| 10 | `#8e8a7c` | rooftop lantern / plant | structure | the drum's rooftop lantern and the mechanical plant on the tower and the wings, ducting collapsed, one unit stripped for its copper | structure | yes | — | 507 |
| 11 | `#93a2a8` | clerestory glazing | structure | the clerestory teeth running the length of the reading wing — the glass that lit the stacks, now mostly sky | structure | yes | — | 627 |
| 12 | `#6f6a5c` | courtyard | ground | a walled reading courtyard between the masses, its paving cracked, the planting dead in place | ground | no | — | 775 |
| 13 | `#7d7a71` | terrace / walk | walk | the raised concrete terrace the whole building sits on, and the walks across it, cracked corner to corner | ground | no | — | 2373 |
| 14 | `#c2b48c` | oculus ring | structure | the ring of the drum's oculus — the round clerestory that dropped daylight into the middle of the reading room, its glazing gone | structure | yes | — | 509 |
| 15 | `#7a6f57` | plaza planter | structure | a low sandstone planter wall across the plaza, its bed gone to hardpan with a dead tree still standing in it, coping cracked where people sat on it for thirty years | structure | yes | — | 516 |
| 17 | `#bfa87f` | roof edge | structure | the parapet line where a roof meets its wall, coping missing in runs | structure | yes | — | 2414 |
| 18 | `#241f1a` | doorway | portal | a way in — the plaza doors under the reading wing, the museum entrance, the tower stair core | portal | no | — | 77 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 88 |

**Gate:** `gates/library_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
