# BOHEMIA DISTRICT DOSSIER — TOWN

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_town.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The old townsite: ONE wide main street with angle parking, walled on both sides by attached false-front storefronts under a continuous covered boardwalk, CUT INTO BLOCKS by three cross streets, with a saloon and a hall as the anchors, back alleys, houses and sheds on dirt lots behind, a gas station at the town's mouth, and the water tower that is the reason the town is where it is.**

### Real-world reference
- The original Fremont Street townsite and the surviving Nevada towns around this valley (Goodsprings, Searchlight, Nelson): a single wide main street — wide because it was laid out for a wagon team to turn around in — with ANGLE PARKING down both sides.
- Attached one- and two-storey masonry storefronts with tall FALSE FRONTS hiding shallow roofs, and a continuous covered boardwalk, because in a desert town shade over the footway is not decoration.
- A WATER TOWER is the tallest thing in a desert town and usually the reason the town exists at all — Las Vegas itself began as a railroad water stop.
- AND THE THING THAT IS EASIEST TO MISS: a townsite is platted in BLOCKS. The cross streets are not decoration, they are the unit the whole place is measured in.

### Layout — what is where
- The main street runs the full length of the plot, curb to curb at x 56..71, with angled parking bays either side.
- THREE CROSS STREETS at y 22, 60 and 98 cut everything — the row, the boardwalk and the alleys — into four blocks per side. They stop short of the side edges so the town keeps exactly ONE car entrance.
- THE STREET WALL: storefronts shoulder to shoulder on BOTH sides with no gaps, each unit divided by a party wall and topped by a false front, unit widths varying so no two neighbours match. That continuity is the difference between a town and a strip mall; the cross streets are the difference between a town and a corridor.
- A saloon on one side and a hall on the other are the bigger anchor units in the row.
- Service alleys run behind both rows; detached houses and their sheds sit on dirt lots behind those, at varied sizes on varied lots — a uniform grid back there would be a suburb.
- A gas station stands at the town's mouth, pumps under a CANOPY you walk under, which is the one overhead layer in the district.
- The water tower stands on the west lot on its legs. The town's single car entrance is the main street itself, meeting the highway at the primary street edge.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the MAIN STREET is the car surface and it IS the entrance — the town meets the highway by simply continuing. The three cross streets are real carriageway off it, so a car reaches every block (driveReachFromStreet 1.00 on all six orientations); the back alleys (13) are the second drivable surface, reaching the rear of every unit. On foot it is the boardwalk (6) the whole length of both rows, under cover, which is how the place was meant to be walked. A corner cell gains a pedestrian gate on the side street.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the main street and cross streets (1), the back alleys (13), and the angle-park markings (10). GROUND (walk): boardwalk (6), dirt lot (4), desert (0). OVERHEAD (pass under): the fuel canopy (16). STRUCTURE (solid, ENTERABLE): storefronts (2), saloon/hall (8), houses (9), sheds (15) — four different interiors. STRUCTURE (solid): the false fronts (7) and the water tower (11). PROPS: pole lights (12), the fallen sign (14). TREE-DEAD (pass): dead trees (3). PORTAL: the gate (5).

### Decisions & rulings
- Paolo 7/26: build the world. 9 valley cells were flat; the townsite is what the valley grew out of.
- THE STREET WALL IS THE POINT and it is deliberately unbroken WITHIN a block. Detached buildings with gaps between them is a strip mall, a different and much later object.
- THE BLOCK IS THE UNIT. The first version had every correct part and was a BARCODE — five full-height stripes running unbroken top to bottom. A town's structure is not its main street, it is its block, and a block is what you get when cross streets cut the row.
- MATERIALS SEPARATE. The first version was one brown end to end: masonry shopfronts are warm, timber houses grey and silvered, dirt pale, alley dark, boardwalk pale timber.
- THE FALLEN SIGN DOES NOT SPAN THE STREET. It did, and it sealed the town in half, stranding a third of the drive network. It fell; it did not become a wall.
- No town name, no shop names, no signage text — Paolo's to author. The lettering has weathered off.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the edge of the townsite | ground | no | — | 976 |
| 1 | `#33333b` | main street | drive | the one wide street, laid out for a wagon team to turn in, sand drifted across it | ground | no | — | 3829 |
| 2 | `#8a6f4e` | storefront | building | an attached shopfront in the street wall, glass gone or boarded, the goods long carried off | structure | yes | storefront interior: one deep narrow room, a counter across the back, a stockroom behind it | 2717 |
| 3 | `#3a4526` | dead tree | tree-dead | a dead street tree, the only one anybody ever watered | prop | yes | — | 39 |
| 4 | `#6f6449` | dirt lot | ground | the graded dirt the town sits on — never paved, never needed to be | ground | no | — | 4856 |
| 5 | `#c79a3f` | gate / entrance | gate | where the main street meets the highway, amber curb | portal | no | — | 16 |
| 6 | `#b0a184` | boardwalk | ground | the covered boardwalk under the canopy, boards split, shade still working | ground | no | — | 888 |
| 7 | `#a8895f` | false front | structure | the tall false front hiding a shallow roof, lettering weathered off it | structure | yes | — | 532 |
| 8 | `#96604a` | saloon / hall | building | the corner anchor — the bar, or the hall the town used for everything else | structure | yes | hall interior: one big room with a bar or a stage at one end, chairs stacked | 171 |
| 9 | `#6e6f66` | house | building | a detached house on a dirt lot behind the row, porch sagging | structure | yes | house interior: a few small rooms off a front parlour | 858 |
| 10 | `#a8a08c` | angle-park marking | marking | the angled parking bays either side of the street, paint nearly gone | ground | no | — | 165 |
| 11 | `#9a948a` | water tower | structure | the water tower on its legs, the tallest thing here and the reason the town is here | structure | yes | — | 205 |
| 12 | `#b0863a` | pole light | prop | a street pole light, head dark | prop | yes | — | 18 |
| 13 | `#403a33` | back alley | drive | the service alley behind the row, where the deliveries came in | ground | no | — | 906 |
| 14 | `#5c554a` | fallen sign | prop | the town sign that used to span the street, down across it now | prop | yes | — | 20 |
| 15 | `#57544a` | shed / outbuilding | building | a tin shed on the back lot, door hanging, whatever was in it gone | structure | yes | shed interior: one room, a dirt floor, a bench along one wall | 103 |
| 16 | `#8e8a7c` | fuel canopy | overhead | the canopy over the pumps at the town's mouth, panels blown out of it | overhead | no | — | 85 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
