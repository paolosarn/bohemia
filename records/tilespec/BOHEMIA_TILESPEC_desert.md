# BOHEMIA DISTRICT DOSSIER — DESERT

_Category: **terrain**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_desert.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The vacant Mojave lot: self-spaced creosote on desert pavement, braided dry rills, OHV tracks, illegal dumping, and sometimes the ghost of a subdivision that was graded and never built.**

### Real-world reference
- The valley floor plant community is CREOSOTE-BURSAGE, and creosote self-spaces (its roots poison competitors), so from above the bushes stand in an eerily regular scatter with bare ground between them. That spacing is the signature of this desert.
- Desert pavement: a lag of rock left after the fines blow out, with white CALICHE hardpan breaking through in patches.
- Vacant land in the valley is crossed by informal OHV tracks and used for illegal dumping (mattresses, tyres, burned cars, contractor debris). Both are constants, not decoration.
- THE GHOST PLAT: Las Vegas is ringed with graded pads, curb-and-gutter stubs and survey stakes on subdivisions that stopped when the money did. In Bohemia the money stopped for good.

### Layout — what is where
- Ground is desert pavement with rock lag and caliche patches, all sampled from the valley-wide terrain field so it never seams at a cell edge.
- Braided dry rills cross the lot and continue into the neighbouring cells; nothing grows in the beds.
- Creosote stands on a jittered lattice (self-spacing), bursage fills between, density follows the field.
- Two OHV tracks cross the lot and run on out of it. Dumped debris and sometimes a burned car sit off them.
- Roughly a third of desert cells carry the GHOST PLAT: six graded pads, a curb stub ring, and a survey stake at every corner.

### Circulation (street-aware / drivable)
Open ground: crossable in every direction on foot, and the OHV tracks are a real drivable line through it. The rills are walkable beds, a little lower than the pavement. Nothing here gates access to anything, which is the point of vacant land.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walk or drive): pavement (0), rock lag (1), caliche (4), rill bed (5), OHV track (6), graded pad (9), curb stub (10). PROPS: creosote and bursage and dead yucca (2, 3, 12, low and passable), survey stake (13, passable), rock outcrop (11, solid), dumped debris (7, solid), burned car (8, solid). No structures, no portals: this is land nobody built on.

### Decisions & rulings
- Paolo 7/26: "we need to actually build a fucking world." 620 cells of flat tan square is not world.
- Terrain is sampled from ONE valley-wide noise field in global coordinates, never from the cell seed, so ridges, rills and scrub density cross cell boundaries with no seam. That is the difference between terrain and wallpaper.
- A desert cell is a SURFACE, not a district: no faction, economy or address ever resolves to it.
- The ghost plat is the one deliberate piece of storytelling in the tile set, and it is the one that is most literally true of the real city.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert pavement | ground | compacted Mojave dirt, the fines long blown out of it | ground | no | — | 6027 |
| 1 | `#8f8062` | rock lag | ground | a lag of small dark rock left standing on the pavement | ground | no | — | 2193 |
| 2 | `#4a5230` | creosote bush | tree-dead | creosote, grey-green and half dead, standing in its own poisoned circle | prop | no | — | 139 |
| 3 | `#5c5a3a` | bursage / scrub | tree-dead | low bursage and dry grass clumps between the creosote | prop | no | — | 17 |
| 4 | `#a89c7e` | caliche hardpan | ground | white cemented caliche breaking through the surface | ground | no | — | 865 |
| 5 | `#7e7256` | dry rill | ground | a braided dry rill cut into the lot, sand and gravel in the bed | ground | no | — | 1259 |
| 6 | `#7a6c4e` | OHV track | drive | packed dirt track worn by bikes and trucks, still legible | ground | no | — | 187 |
| 7 | `#6a6258` | dumped debris | prop | a tipped load of mattresses, tyres and contractor trash | prop | yes | — | 22 |
| 8 | `#4a4038` | burned car | vehicle | a car dragged out here and burned, shell rusting into the dirt | prop | yes | — | 14 |
| 9 | `#9a8d70` | graded pad | ground | a house pad graded flat and never built on, edges softening | ground | no | — | 5304 |
| 10 | `#a09684` | curb stub | ground | poured curb and gutter for a street that has no houses on it | ground | no | — | 328 |
| 11 | `#6f6551` | rock outcrop | prop | a limestone outcrop pushing up through the pavement | prop | yes | — | — |
| 12 | `#5a5334` | dead yucca | tree-dead | a dead yucca, trunk grey and split | prop | yes | — | 5 |
| 13 | `#b0a070` | survey stake | prop | a survey stake with faded ribbon, marking a lot corner nobody claimed | prop | no | — | 24 |

**Gate:** `gates/desert_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
