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

### Decisions & rulings
- This is the CORNER form BY DESIGN — Paolo: "we'd have to completely remake it to squeeze between two other districts."
- [PENDING Paolo] its standalone / mid-block form (how a plaza reshapes off a corner) — gated on S/corners/N only for now, NOT arbitrary single edges.

### Tile legend — every code, its material to skin
| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt (setback / landscape gaps) | 972 tiles | [PENDING Paolo] |
| 1 | `#33333c` | parking asphalt | drive | cracked asphalt parking field (car-drivable) | 2160 tiles | [PENDING Paolo] |
| 2 | `#7a7266` | store | building | strip-mall storefront box, dead signage, dark glass | 5329 tiles | [PENDING Paolo] |
| 3 | `#3f3f47` | drive aisle | drive | cracked asphalt lot drive aisle (drivable) | 4675 tiles | [PENDING Paolo] |
| 4 | `#c9c1aa` | stall stripe | marking | faded parking-stall stripe | 1120 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | curb cut / gate | gate | driveway curb cut off the street, amber paint | 21 tiles | [PENDING Paolo] |
| 6 | `#8a8a92` | sidewalk | walk | cracked concrete storefront sidewalk | 500 tiles | [PENDING Paolo] |
| 7 | `#c7a24a` | store door | building | shop entry, boarded / broken glass door | 22 tiles | [PENDING Paolo] |
| 8 | `#2b2b31` | service alley | drive | rear service lane (trash/delivery, drivable) | 1563 tiles | [PENDING Paolo] |
| 9 | `#b0863a` | service door | building | back roll-up / steel service door | 22 tiles | [PENDING Paolo] |
| 10 | `#6b6b74` | gas canopy | structure | fuel-island canopy, faded brand, sagging | — | [PENDING Paolo] |
| 11 | `#9a5a4a` | gas pump | prop | dead fuel pump, dust-caked, hoses down | — | [PENDING Paolo] |

**Gate:** `gates/commercial_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
