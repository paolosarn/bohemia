# BOHEMIA DISTRICT DOSSIER — CHAPEL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_chapel.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead church — a cruciform stone building (narthex + long nave crossed by the transepts, the sanctuary apse at the head), a bell tower flanking the entrance, a forecourt plaza with an arcade + a churchyard cross, a memorial garden, a small lot.**

### Real-world reference
- Church architecture (Keiser Design parts of a church, UMC narthex/nave, cruciform cathedral plans): a CRUCIFORM (Latin-cross) plan — the NARTHEX (entry) + the long NAVE crossed by the TRANSEPTS (cross arms), the SANCTUARY/apse at the head; a BELL TOWER/spire flanking the entrance; often a forecourt COURTYARD/atrium + arcade; stained-glass windows down the nave.

### Layout — what is where
- A CRUCIFORM CHURCH is the hero: the long NAVE crossed by the TRANSEPTS, the rounded SANCTUARY apse at the north head, the NARTHEX vestibule at the south entrance, stained-glass windows down its length.
- A BELL TOWER (with a cross finial) flanks the entrance; a forecourt PLAZA with an entrance arcade + a churchyard cross/statue fronts the doors.
- A memorial GARDEN + dead trees flank the church on its terrace; a small parking + drop-off drive meets the street.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: a small drop-off drive on the primary street feeds the lot (code 1 reaches it from the curb, K.driveReachFromStreet). Foot circulation is the forecourt plaza -> arcade -> narthex. WALKABLE-LAND: a church IS its building — the plot is nearly all structure + plaza + garden; the lot is minimal. Corner side streets get a pedestrian gate onto the plaza.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the forecourt plaza (7), memorial garden (4), sidewalk (12), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the cruciform CHURCH (2 -> narthex/nave/altar/transept chapels) with its STAINED GLASS (11), the BELL TOWER (6), the arcade COLUMNS (8). PROPS: the churchyard CROSS/statue (10), pole lights (9), dead trees (3). PORTALS: the gate (5). The cross-plan mass + the bell tower are the vertical hero; you cross the plaza into the narthex.

### Decisions & rulings
- Act-1 DEAD: shattered stained glass, the bell silent, doors chained, the garden dead, the cross weathered. Faith + who gathers here is Paolo's / faction canon.
- Civic category (chapel/church). Zero purple. No denomination/inscription (Paolo's to author).
- WALKABLE-LAND honored (easily): the cruciform building + plaza + garden dominate; lot minimal.
- Research-first (per the playbook): built from real cruciform church plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the churchyard edge (setback) | ground | no | — | 1467 |
| 1 | `#33333c` | drive / lot | drive | the small church parking + drop-off drive (car-drivable) | ground | no | — | 785 |
| 2 | `#7a7060` | building (church) | building | the cruciform church — stone walls, roof steep, doors chained | structure | yes | church interior: the narthex, the long nave of pews to the altar at the apse, the transept chapels off the crossing | 1443 |
| 3 | `#514f40` | dead tree | tree-dead | a dead churchyard tree gone to stick, its grate prised up for the metal | prop | no | — | 96 |
| 4 | `#6b6250` | memorial court | ground | the walled memorial court — decomposed granite raked once, now hardpan split by weeds. Not a lawn: in this ground you do not dig graves, you build a wall and fill it | ground | no | — | 2582 |
| 5 | `#c79a3f` | gate | gate | the churchyard entrance off the street, amber curb | portal | no | — | 11 |
| 6 | `#6f665a` | bell tower | structure | the bell tower flanking the entrance, tall, the bell silent, a cross finial atop | structure | yes | — | 88 |
| 7 | `#8f8676` | forecourt plaza | ground | the forecourt piazza before the doors, cracked pavers, weeds | ground | no | — | 1413 |
| 8 | `#a89e8a` | arcade columns | structure | the entrance arcade / colonnade across the front | structure | yes | — | 66 |
| 9 | `#b0863a` | pole light | prop | a churchyard pole light, head dark | prop | yes | — | 5 |
| 10 | `#8e8a7c` | cross / fallen bell | prop | the churchyard cross, and the BELL itself lying in the forecourt where it came through the belfry floor | prop | yes | — | 41 |
| 11 | `#4a6a72` | stained glass | structure | a stained-glass window (nave/transept/rose), shattered, lead buckled | structure | yes | — | 62 |
| 12 | `#7d7a71` | churchyard walk | walk | the concrete walk that rings the church, cracked corner to corner and lifted where the roots got under it | ground | no | — | 1320 |
| 13 | `#8a8272` | columbarium wall | fence | the niche wall round the memorial court — rows of small sealed compartments, a third of them prised open | structure | yes | — | 393 |
| 14 | `#5f5a4c` | gravel margin | ground | the gravel margin at the property line, sun-bleached rock over failed weed cloth | ground | no | — | 3524 |
| 15 | `#9a9184` | covered walk | overhead | the covered walk from the lot to the doors, half its roof sheets peeled back. You pass UNDER it | overhead | no | — | 104 |
| 16 | `#b3a78d` | roof edge | structure | the parapet and eave line where a roof meets its wall, tiles gone in runs | structure | yes | — | 1612 |
| 17 | `#a08f6e` | niche plaque | structure | a name plaque on a columbarium niche, the letters still cut deep enough to read | structure | yes | — | 36 |
| 18 | `#241f1a` | doorway | portal | a way in — the narthex doors, the transept door, the gate into a memorial court | portal | no | — | 3 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 42 |
| 20 | `#4a4a52` | stall marking | marking | the painted stall ticks, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 140 |
| 21 | `#5a6660` | dry font | water-dead | the font in the forecourt, bone dry, a tidemark ringed inside the bowl | ground | no | — | 36 |
| 22 | `#8e8474` | roof ridge | structure | the ridge line down the nave and the transept arms, tiles gone off it in runs and the battens showing | structure | yes | — | 427 |
| 23 | `#7b7361` | orchard bed | ground | the granite bed round an orchard tree, its drip line long since cut off at the main | ground | no | — | 688 |

**Gate:** `gates/chapel_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
