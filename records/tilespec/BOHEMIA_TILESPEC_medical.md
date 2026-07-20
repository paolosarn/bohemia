# BOHEMIA DISTRICT DOSSIER — MEDICAL

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_medical.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Hospital campus — hospital + ER wing, a separate ambulance court with a helipad, a parking garage, a visitor lot, and a medical office building.**

### Real-world reference
- Real hospital site guides (healthfacilityguidelines.com, hdrinc.com): hospital + ER, a separate ambulance court + canopy + helipad, a main-entrance drop-off, a visitor lot, a decked garage, an MOB

### Layout — what is where
- Big hospital + ER wing back the campus; a main-entrance canopy + drop-off lane + crosswalk across the front.
- A SEPARATE ambulance court at the ER: staging bays (parked ambulances) + a helipad.
- A decked parking garage (with a ramp) on one side; a full visitor lot (striped stalls, parked cars, dead-planter islands); a medical office building at a lot corner.
- A bottom DRIVE BAND ties the gates, the front apron, the lot, and the garage ramp together.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet — the whole campus rotates onto the real street (this FIXED a real bug where a north-only cell left the drive band stranded behind the hospital). Drive = code 1; a car reaches the drive network from the curb in ANY placement (K.driveReachFromStreet).

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: drives, aisles, walkways, stalls, helipad (flat). STRUCTURES (¾ front face, solid): the hospital/ER/MOB (2, ENTERABLE -> floorplan rooms) and the parking GARAGE (8) — the garage reads as a solid decked shell from outside, and going in it becomes the multi-deck interior (ramp up, parked cars per level); its footprint is solid at grade except the ramp mouth. OVERHEAD (walk/drive UNDER, drawn above): the entrance + ambulance canopies (7) — the drop-off lane runs beneath them. PORTALS: the entrance doors (4) into the lobby/ER; the gate/curb cut (5). PROPS solid: parked vehicles (11), planters (3). This is the key "capacity when front-facing" case: the garage/hospital occupy their ground cells (block) but draw UP with a face, while canopies do NOT block the cells under them.

### Decisions & rulings
- EXPLAIN-EVERY-TILE: no blank slabs — planters/walkways fill the apron.
- Retrofit onto rotateToStreet (7/19) FIXED a real drive-disconnect bug for north-only + N+W-corner cells.
- Two curb cuts on the PRIMARY street (public + emergency) are allowed (same frontage); corner side streets get a pedestrian gate.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / unbuilt gaps) | ground | no | — | 2886 |
| 1 | `#33333c` | drive / asphalt | drive | cracked asphalt drive lane / parking aisle (car-drivable) | ground | no | — | 4702 |
| 2 | `#8a8478` | building | building | concrete/panel hospital, ER wing, MOB — grimy, dark windows | structure | yes | hospital floorplan: ER + intake, wards, halls, service back-of-house | 3491 |
| 3 | `#55503f` | dead planter island | tree-dead | dry curbed planter, dead shrub stumps, gravel | prop | yes | — | 56 |
| 4 | `#c7a24a` | entrance door | building | boarded / cracked glass main + ambulance doors, amber frame | portal | no | into the hospital lobby / ER intake | 6 |
| 5 | `#c79a3f` | gate / curb cut | gate | campus vehicle entrance, amber curb paint | portal | no | — | 14 |
| 6 | `#7a7a80` | walkway / crosswalk | walk | faded concrete walkway + crosswalk stripes | ground | no | — | 643 |
| 7 | `#9a9088` | canopy | structure | sagging entrance / ambulance drive-through canopy | overhead | no | — | 198 |
| 8 | `#4c4c55` | parking garage | structure | decked concrete garage shell, columns, ramp | structure | yes | GARAGE INTERIOR: multiple decks of parked cars, a spiral/switchback ramp between levels, columns — you drive up the ramp and the shell you saw outside becomes the deck you are on | 2130 |
| 9 | `#b04038` | helipad | marking | faded rooftop-red helipad circle + H, cracked | ground | no | — | 81 |
| 10 | `#c9c1aa` | parking stall | marking | faded stall stripe on asphalt | ground | no | — | 1100 |
| 11 | `#5a5a64` | parked vehicle | vehicle | abandoned car / dead ambulance, dust-caked | prop | yes | — | 1077 |

**Gate:** `gates/medical_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
