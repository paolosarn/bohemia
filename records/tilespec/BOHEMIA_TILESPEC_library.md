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
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the campus edge (setback) | ground | no | — | 2669 |
| 1 | `#3a3a42` | drive / lot | drive | the drop-off drive + a small side lot (car-drivable) | ground | no | — | 880 |
| 2 | `#7a7060` | building (library) | building | the library — columned stone mass, windows broken, the doors chained | structure | yes | library interior: circulation + the reading room at the core, wrapped by multi-tiered stacks, reading rooms + the admin/community wings around | 6074 |
| 3 | `#3a4526` | landscaping / tree | tree-dead | a dead campus tree / planter shrub | prop | no | — | 23 |
| 4 | `#49512e` | reading garden | ground | the dead reading-garden lawn around the library | ground | no | — | 1288 |
| 5 | `#c79a3f` | gate | gate | the library drop-off entrance off the street, amber curb | portal | no | — | 2 |
| 6 | `#8a8175` | entrance steps | structure | the broad stone entrance steps up to the colonnade | structure | yes | — | 392 |
| 7 | `#8f8676` | entrance plaza / piazza | ground | the entrance piazza — cracked pavers, weeds in the joints | ground | no | — | 1634 |
| 8 | `#a89e8a` | colonnade columns | structure | the row of stone columns across the grand front, one or two toppled | structure | yes | — | 211 |
| 9 | `#8f8676` | pole light | prop | a campus pole light, head dark | prop | yes | — | 4 |
| 10 | `#5a6a5a` | dead fountain / sculpture | prop | the dry central fountain / a civic sculpture on the plaza | prop | yes | — | 53 |
| 11 | `#b0a894` | stacks / reading detail | structure | the multi-tiered book stacks / reading-room floor read of the interior mass | structure | yes | — | 231 |
| 12 | `#43521f` | reading courtyard | ground | the inner reading courtyard / garden at the heart of the building | ground | no | — | 1214 |
| 13 | `#6a675e` | sidewalk | ground | the terrace / sidewalk the library sits on, cracked | ground | no | — | 1709 |

**Gate:** `gates/library_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
