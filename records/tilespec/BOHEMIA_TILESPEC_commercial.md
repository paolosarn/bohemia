# BOHEMIA DISTRICT DOSSIER — COMMERCIAL

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_commercial.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Corner shopping plaza — an L of stores on the back property lines, parking fronting the streets, a rear service alley, a gas station in the corner.**

### Real-world reference
- Vegas corner strip mall via the PLACEMENT PLAYBOOK (roads/parking FIRST, straight segments, dead-world) + BOHEMIA_PARKING_LAW (2-wide stalls, stripe every 3rd tile, row 4 deep, aisle <=4)

### Layout — what is where
- Stores on the back property lines; a parking lot (striped stalls + drive aisles) fronting the streets; curb cuts connect the lot to the streets.
- Every business has a back service door onto a rear SERVICE ALLEY (the "mini road") wrapping the back corner for trash + deliveries.
- A gas station pad (canopy + pumps + kiosk) sits in the street corner.

### Circulation (street-aware / drivable)
Street-aware CORNER form: 2 curb cuts per street; the parking + aisles + curb cuts + alley form one drive network reachable from a curb cut (driveConnected).

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: parking asphalt, aisles, sidewalk, service alley, stall stripes (flat, walk/drive). STRUCTURES (¾ front face, solid): the store boxes (2, ENTERABLE -> sales floor + back stock). OVERHEAD (drive/walk UNDER, drawn above on posts): the gas canopy (10) — you fuel beneath it. PORTALS: the storefront door (7) into the sales floor, the rear service door (9) into back-of-house, the curb cut/gate (5). PROP solid: the gas pumps (11). The store fronts occupy their cells (block) and draw up with a signed face toward the lot; the canopy blocks nothing at grade.

### Decisions & rulings
- This is the CORNER form BY DESIGN — Paolo: "we'd have to completely remake it to squeeze between two other districts."
- [PENDING Paolo] its standalone / mid-block form (how a plaza reshapes off a corner) — gated on S/corners/N only for now, NOT arbitrary single edges.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / landscape gaps) | ground | no | — | 972 |
| 1 | `#33333c` | parking asphalt | drive | cracked asphalt parking field (car-drivable) | ground | no | — | 2036 |
| 2 | `#7a7266` | store | building | strip-mall storefront box, dead signage, dark glass | structure | yes | retail interior: open sales floor up front, stock room + office in back | 5409 |
| 3 | `#3f3f47` | drive aisle | drive | cracked asphalt lot drive aisle (drivable) | ground | no | — | 4481 |
| 4 | `#c9c1aa` | stall stripe | marking | faded parking-stall stripe | ground | no | — | 1065 |
| 5 | `#c79a3f` | curb cut / gate | gate | driveway curb cut off the street, amber paint | portal | no | — | 21 |
| 6 | `#8a8a92` | sidewalk | walk | cracked concrete storefront sidewalk | ground | no | — | 542 |
| 7 | `#c7a24a` | store door | building | shop entry, boarded / broken glass door | portal | no | into the store sales floor | 23 |
| 8 | `#2b2b31` | service alley | drive | rear service lane (trash/delivery, drivable) | ground | no | — | 1563 |
| 9 | `#b0863a` | service door | building | back roll-up / steel service door | portal | no | into the store back-of-house / stock room | 22 |
| 10 | `#6b6b74` | gas canopy | structure | fuel-island canopy, faded brand, sagging | overhead | no | — | — |
| 11 | `#9a5a4a` | gas pump | prop | dead fuel pump, dust-caked, hoses down | prop | yes | — | — |
| 12 | `#3f4e52` | storefront glass | building | the shopfront glass line between the door entries, dark + cracked, dead signage above | structure | yes | — | 166 |
| 13 | `#41501f` | landscaping planter | prop | a dead landscaping planter island in the lot, gone to weed | prop | no | — | 84 |

**Gate:** `gates/commercial_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
