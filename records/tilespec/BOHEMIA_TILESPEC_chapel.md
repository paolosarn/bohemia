# BOHEMIA DISTRICT DOSSIER — CHAPEL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_chapel.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead church — a cruciform stone building (narthex + long nave crossed by the transepts, the sanctuary apse at the head), a bell tower flanking the entrance with the BELL itself lying in the forecourt, a plaza with an arcade and a dry font, a walled MEMORIAL COURT ringed by a COLUMBARIUM of niches, a dead ORCHARD in its granite beds, and a small lot behind a low path wall.**

### Real-world reference
- Church architecture (Keiser Design parts of a church, UMC narthex/nave, cruciform cathedral plans): a CRUCIFORM (Latin-cross) plan — the NARTHEX (entry) + the long NAVE crossed by the TRANSEPTS (cross arms), the SANCTUARY/apse at the head; a BELL TOWER/spire flanking the entrance; often a forecourt COURTYARD/atrium + arcade; stained-glass windows down the nave.

### Layout — what is where
- A CRUCIFORM CHURCH is the hero: the long NAVE crossed by the TRANSEPTS, the rounded SANCTUARY apse at the north head, the NARTHEX vestibule at the south entrance, stained-glass windows down its length.
- A BELL TOWER (with a cross finial) flanks the entrance; a forecourt PLAZA with an entrance arcade + a churchyard cross/statue fronts the doors.
- THE MEMORIAL COURT is walled, and the wall IS a COLUMBARIUM: rows of small sealed niches with name plaques, a third of them prised open. This ground does not take graves, so the dead go in the wall — the same reason real Mojave churchyards are built this way.
- A dead ORCHARD stands in granite beds along the flank, the drip line cut off at the main years ago.
- THE PATH FROM THE LOT TO THE DOORS runs between two LOW WALLS (8/2) — not under a covered walk. One run of coping is shoved out of line.
- A small parking + drop-off drive meets the street, and a churchyard walk rings the whole building.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: a small drop-off drive on the primary street feeds the lot (code 1 reaches it from the curb, K.driveReachFromStreet). Foot circulation is the lot -> the path between the low walls -> the forecourt plaza -> arcade -> narthex, and the churchyard walk rings the building to the transept door and the memorial court gate. NOTHING on this plot is overhead (Paolo 8/2, no more canopies): the covered walk that used to run from the lot to the doors is gone. WALKABLE-LAND: a church IS its building — the plot is nearly all structure + plaza + garden; the lot is minimal. Corner side streets get a pedestrian gate onto the plaza.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk on it): the forecourt plaza (7), the memorial court floor (4), the churchyard walk (12, WALK), the gravel margin (14), the orchard beds (23), the dry font (21), the drive/lot (1, DRIVE) with its stall ticks (20, MARKING), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2). STRUCTURE (¾ front face, solid, ENTERABLE): the cruciform CHURCH (2 — narthex, nave, altar, transept chapels) with its STAINED GLASS (11), roof edge (16) and roof ridge (22), the BELL TOWER (6), the arcade COLUMNS (8), the COLUMBARIUM wall (13, FENCE) and its niche plaques (17), the path walls (15, FENCE). PROP: the churchyard cross and the fallen BELL (10), pole lights (9), dead trees (3), dead cars (19). PORTAL: the doorways (18) and the street gate (5). The cross-plan mass + the bell tower are the vertical hero; you cross the plaza into the narthex.

### Decisions & rulings
- Act-1 DEAD: shattered stained glass, the bell silent, doors chained, the garden dead, the cross weathered. Faith + who gathers here is Paolo's / faction canon.
- Civic category (chapel/church). Zero purple. No denomination/inscription (Paolo's to author).
- WALKABLE-LAND honored (easily): the cruciform building + plaza + garden dominate; lot minimal.
- THE LAWN IS DEAD and the covered walk with it (8/2). 33.9% of this plot was one flat sidewalk code — a monoblock. It is a walk apron computed from the building outline now, with the orchard beds and the memorial court taking the rest, so every pixel is answered for.
- THE DEAD GO IN THE WALL. A columbarium instead of graves is not decoration: caliche hardpan is why Southwest churchyards build niche walls, and it gives the district a piece of purposeful content that is not pavement.
- Research-first (per the playbook): built from real cruciform church plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the churchyard edge (setback) | ground | no | — | 1467 |
| 1 | `#33333c` | drive / lot | drive | the small church parking + drop-off drive (car-drivable) | ground | no | — | 785 |
| 2 | `#7a7060` | building (church) | building | the cruciform church — stone walls, roof steep, doors chained | structure | yes | church interior: the narthex, the long nave of pews to the altar at the apse, the transept chapels off the crossing | 1443 |
| 3 | `#514f40` | dead tree | tree-dead | a dead churchyard tree gone to stick, its grate prised up for the metal | prop | no | — | 99 |
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
| 14 | `#5f5a4c` | gravel margin | ground | the gravel margin at the property line, sun-bleached rock over failed weed cloth | ground | no | — | 3594 |
| 15 | `#9a9184` | path wall | fence | the low wall running either side of the path from the lot to the doors, coping cracked and one run shoved out of line | structure | yes | — | 31 |
| 16 | `#b3a78d` | roof edge | structure | the parapet and eave line where a roof meets its wall, tiles gone in runs | structure | yes | — | 1612 |
| 17 | `#a08f6e` | niche plaque | structure | a name plaque on a columbarium niche, the letters still cut deep enough to read | structure | yes | — | 36 |
| 18 | `#241f1a` | doorway | portal | a way in — the narthex doors, the transept door, the gate into a memorial court | portal | no | — | 3 |
| 19 | `#6a6e72` | dead car | vehicle | a car left in the lot, flat and sun-bleached, nobody came back for it | prop | yes | — | 42 |
| 20 | `#4a4a52` | stall marking | marking | the painted stall ticks, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it | ground | no | — | 140 |
| 21 | `#5a6660` | dry font | water-dead | the font in the forecourt, bone dry, a tidemark ringed inside the bowl | ground | no | — | 36 |
| 22 | `#8e8474` | roof ridge | structure | the ridge line down the nave and the transept arms, tiles gone off it in runs and the battens showing | structure | yes | — | 427 |
| 23 | `#7b7361` | orchard bed | ground | the granite bed round an orchard tree, its drip line long since cut off at the main | ground | no | — | 688 |

**Gate:** `gates/chapel_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
