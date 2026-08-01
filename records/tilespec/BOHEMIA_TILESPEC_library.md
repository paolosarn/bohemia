# BOHEMIA DISTRICT DOSSIER — LIBRARY

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_library.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead public library — a big columned stone building wrapped around an inner reading courtyard, a grand colonnade + entrance steps down to a piazza with a dead fountain, admin + community wings, a reading garden, a small side lot.**

### Real-world reference
- Library design guides (WBDG public-library space types, Boston/Salt Lake/LA central-library plans, Opening the Book space planning): the plan centres on CIRCULATION, wrapped by multi-tiered book STACKS, wrapped by READING ROOMS; a grand ENTRANCE (steps + colonnade) opening onto a PIAZZA/plaza; an administration wing; an inner reading COURTYARD/garden. A library is BUILDING-dominant.

### Layout — what is where
- The library BUILDING is a big columned mass filling the plot, wrapped around an inner reading COURTYARD (a garden + centre sculpture) with the multi-tiered STACKS + reading detail around it, admin + community wings at the back corners.
- A grand COLONNADE of columns spans the south front; broad entrance STEPS drop to the PIAZZA/plaza with a dead central FOUNTAIN + planters.
- A dead reading GARDEN + trees ring the building on its terrace/sidewalk.
- A small drop-off drive + two side lots (minimal — a library is a building, not a lot) meet the street; book-return kiosks + pole lights dress the plaza.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: a drop-off drive on the primary street feeds two small side lots (code 1 reaches them from the curb, K.driveReachFromStreet). Foot circulation is the piazza -> steps -> colonnade -> the building. WALKABLE-LAND: the plot is nearly ALL building + plaza + garden — content dominates overwhelmingly; the lots are minimal. Corner side streets get a pedestrian gate onto the piazza.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the piazza (7), reading garden (4), sidewalk/terrace (13), the reading courtyard (12), the drive/lots (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the LIBRARY (2 -> circulation + stacks + reading rooms interior) with its stack/reading detail (11), the COLONNADE columns (8), the entrance STEPS (6). PROPS: the dead FOUNTAIN/sculpture (10), pole lights (9), book-return kiosks (13), dead trees (3). PORTALS: the gate (5). The columned mass + colonnade are the vertical hero; you cross the piazza and climb the steps into it.

### Decisions & rulings
- Act-1 DEAD: broken windows + chained doors, the stacks spilled + rotting, a dry fountain, cracked pavers, a toppled column or two. Books are a knowledge/scarcity resource (Paolo's + the economy's to rule — what survives on the shelves is his).
- Civic category (library). Zero purple. No library name/inscription (Paolo's to author).
- WALKABLE-LAND LAW honored (easily): a library IS its building — the plot is nearly all structure + plaza + garden, lots minimal.
- Research-first (per the playbook): built from real central-library plans (core -> stacks -> reading rooms), not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb | ground | no | — | 1836 |
| 1 | `#33333c` | drive / lot | drive | the library lot and its service drive — asphalt gone to plates, weeds up every joint (car-drivable) | ground | no | — | 1547 |
| 2 | `#9a7f5c` | library / museum | building | sandstone and concrete geometry — Predock built this valley a landmark out of a drum, a tower and two long low wings, and the sandstone is still the colour of the desert it was matched to | structure | yes | library interior: the drum is one round room under a dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery | 2095 |
| 3 | `#514f40` | dead tree | tree-dead | a dead courtyard tree gone to stick, its grate prised up for the metal | prop | no | — | 8 |
| 4 | `#6b6250` | forecourt ground | ground | the unpaved forecourt — decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this | ground | no | — | 1473 |
| 5 | `#c79a3f` | gate / kerb cut | gate | the kerb cut off the street into the lot, amber paint gone chalky | portal | no | — | 11 |
| 7 | `#8a8175` | entry plaza | ground | the civic plaza across the front — big sandstone pavers heaved by roots, and the fountain basin dry in the middle of it | ground | no | — | 1820 |
| 9 | `#b0863a` | plaza light | structure | a plaza light on its concrete stem, head dark, the glass long gone | structure | yes | — | 7 |
| 10 | `#8e8a7c` | rooftop lantern / plant | structure | the drum's rooftop lantern and the mechanical plant on the tower and the wings, ducting collapsed, one unit stripped for its copper | structure | yes | — | 332 |
| 11 | `#93a2a8` | clerestory glazing | structure | the clerestory teeth running the length of the reading wing — the glass that lit the stacks, now mostly sky | structure | yes | — | 695 |
| 12 | `#6f6a5c` | courtyard | ground | a walled reading courtyard between the masses, its paving cracked, the planting dead in place | ground | no | — | 1459 |
| 13 | `#7d7a71` | terrace / walk | walk | the raised concrete terrace the whole building sits on, and the walks across it, cracked corner to corner | ground | no | — | 3371 |
| 14 | `#c2b48c` | oculus ring | structure | the ring of the drum's oculus — the round clerestory that dropped daylight into the middle of the reading room, its glazing gone | structure | yes | — | 374 |
| 17 | `#bfa87f` | roof edge | structure | the parapet line where a roof meets its wall, coping missing in runs | structure | yes | — | 1143 |
| 18 | `#241f1a` | doorway | portal | a way in — the plaza doors under the reading wing, the museum entrance, the tower stair core | portal | no | — | 125 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 88 |

**Gate:** `gates/library_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
