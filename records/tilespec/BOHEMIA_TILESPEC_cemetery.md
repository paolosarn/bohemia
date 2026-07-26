# BOHEMIA DISTRICT DOSSIER — CEMETERY

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_cemetery.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A memorial-park cemetery — a rectilinear grid of grave sections on dead memorial lawn, laced by drives for graveside access, with a chapel, a mausoleum terminus, a columbarium cremation garden, and a central fountain-and-monument plaza.**

### Real-world reference
- Cemetery / memorial-park design guides (Rome Monument, EDA Land Planning, TCLF, VA National Cemetery Administration): sections/gardens of plots; roads maximizing graveside access while minimizing paving; a chapel + office + maintenance yard; a mausoleum + a columbarium (max ~5 niches high) for cremation; central water features/statuary as section identifiers; park-like lawns with rows of markers; tree-defined outdoor rooms; visual terminuses (mausoleum one end, chapel the other)

### Layout — what is where
- A perimeter memorial-drive LOOP + a grid of cross drives divide the grounds into grave SECTIONS (maximizes graveside access, minimizes paving).
- Each section is dead memorial lawn filled with neat ROWS OF HEADSTONES, a lawn border left along every drive for access.
- A CHAPEL + office + parking sit by the entrance; a large MAUSOLEUM is the visual terminus at the far end.
- A COLUMBARIUM niche wall in a cremation garden (a reflecting pool + a monument + benches) forms one quadrant.
- A central FOUNTAIN + OBELISK plaza marks the main crossroads; dead memorial trees line the drives; a maintenance shed sits in a back corner.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: a monumental entrance gate off the primary street feeds the drive loop. You DRIVE through a cemetery, so the memorial drives (code 1) are the car network, reachable from the gate in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: the memorial drives, the dead lawn, walking paths, the empty fountain basin (flat, walk/drive). STRUCTURES (¾ front face, solid): the chapel/office/shed (2, ENTERABLE), the MAUSOLEUM (7, ENTERABLE -> a dim crypt of wall vaults — the solid stone block outside becomes the vault hall inside), the columbarium wall (8), the obelisk monument (11, height, not enterable). PROPS (solid, you weave BETWEEN them): the HEADSTONES (6 — thousands of small markers in rows define the graveside occupancy), dead trees (3), parked cars (12), benches (13). Key layering: the mausoleum is the one real interior; everything else is an outdoor grid you thread on foot or by car.

### Decisions & rulings
- Act-1 DEAD: dead-brown memorial lawn, bare dead trees, weathered/stained stone, empty fountain — a cemetery in the apocalypse. No living vegetation.
- RECTILINEAR by design (unlike the organic park): real cemeteries are a grid of sections to maximize graveside road access — the grid is correct here, NOT fake geometry.
- Civic category. Zero purple. Headstones are blank markers — no names/canon on them (Paolo's to author if ever).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / bare gaps) | ground | no | — | 996 |
| 1 | `#4a4640` | memorial drive | drive | cracked narrow asphalt cemetery lane (car-drivable, graveside access) | ground | no | — | 3042 |
| 2 | `#8a8478` | building (chapel/office/shed) | building | weathered stone/stucco funeral chapel, office, or maintenance shed | structure | yes | chapel interior: a small nave + a viewing room; office rooms; the shed is one bay | 497 |
| 3 | `#4a4030` | dead tree | tree-dead | bare leafless memorial tree, grey bark | prop | yes | — | 76 |
| 4 | `#5a4f38` | memorial lawn | turf-dead | dead brown memorial lawn, dry thatch between the plots | ground | no | — | 10013 |
| 5 | `#c79a3f` | gate | gate | monumental cemetery entrance gate/arch off the street, amber curb | portal | no | — | 7 |
| 6 | `#9a9488` | headstone | prop | weathered granite grave marker, lichen-stained, some leaning (blank — no names) | prop | yes | — | 929 |
| 7 | `#9a938a` | mausoleum | building | pale-stone family/community crypt building, columns, dim | structure | yes | CRYPT INTERIOR: a dim central aisle flanked by walls of vaults — the solid stone block outside becomes the vault hall inside | 493 |
| 8 | `#8f8a80` | columbarium wall | structure | stone niche wall (cremation), rows of small plaques, weathered | structure | yes | — | 102 |
| 9 | `#3a4a52` | dead fountain / pond | water-dead | empty dry fountain basin / reflecting pool, cracked, stained | ground | no | — | 76 |
| 10 | `#6a6a70` | walking path | walk | cracked concrete memorial path between sections | ground | no | — | 87 |
| 11 | `#b0a89a` | monument (obelisk) | structure | stone obelisk / memorial statue, weathered (has height, not enterable) | structure | yes | — | 2 |
| 12 | `#55555f` | parked car | vehicle | abandoned dust-caked car (hearse / visitor) | prop | yes | — | 54 |
| 13 | `#8f8676` | site furniture | prop | weathered memorial bench / urn planter | prop | yes | — | 10 |

**Gate:** `gates/cemetery_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
