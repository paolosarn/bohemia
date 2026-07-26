# BOHEMIA DISTRICT DOSSIER — BATTERY

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_battery.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead grid-scale battery storage yard — three fire-lane-spaced rows of containerized battery enclosures each with its own HVAC unit, an inverter/transformer rack tying the array to the grid, a control building, double-fenced on gravel. Storage, distinct from solar (generation) and substation (distribution) — the same CLUSTERED POWER network they all feed.**

### Real-world reference
- Utility-scale BESS (battery energy storage system) site design: NFPA 855 mandates real fire-lane SPACING between container rows (the deliberate gaps here, not decorative); each containerized enclosure pairs with its own HVAC/thermal-management unit; an inverter/transformer rack converts and ties the DC storage array into the AC grid; a control/monitoring building oversees state-of-charge; double security fencing matches substation-class infrastructure.

### Layout — what is where
- The yard is gravel inside a DOUBLE perimeter fence (desert at the margins); the CONTROL building sits at the south gate.
- Three ROWS of containerized BATTERY enclosures (the hero) run north-south, each container paired with an HVAC unit, rows separated by real fire-lane spacing.
- An INVERTER / TRANSFORMER rack runs along the south edge of the array, tying it into the grid, with warning placards along its length.
- Cable TRENCHES run behind each row; pole lights ring the yard.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the yard gate is on the primary street; a gravel access road + perimeter lane (code 1) reach the control building and array from the curb (K.driveReachFromStreet). WALKABLE-LAND: the containers + inverter rack + fence + control building dominate; the road is minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the gravel (4), cable trenches (13), the access road (1, drive), hazard marking (11), desert (0). STRUCTURES (¾ front face, solid): the BATTERY containers (6, the hero rows), their HVAC units (7), the inverter/transformer rack (8), the control building (2, ENTERABLE), the double perimeter FENCE (10). PROPS: pole lights (9), warning placards (12). PORTALS: the gate (5). The container rows are the mass; you cross the gravel fire lanes between them.

### Decisions & rulings
- Act-1 DEAD: containers cold with dead indicator lights, HVAC fans stopped, inverters dark and oil-stained, the control room abandoned. This feeds the same CLUSTERED POWER network substation distributes — who re-energizes it is faction canon (Paolo's).
- Infrastructure category (battery) — already reserved in K.TAXONOMY (Paolo 7/18's taxonomy pass anticipated this slot alongside solar/substation/watertreat), filled in this turn rather than inventing a new bucket.
- WALKABLE-LAND honored: container rows + inverter rack + fence + control building dominate; access road minimal.
- Research-first (per the playbook): built from real utility BESS site design (NFPA 855 spacing), not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2375 |
| 1 | `#45433c` | access road | drive | the gravel access road — a service truck reaches the yard from the gate (drivable) | ground | no | — | 355 |
| 2 | `#6a6358` | control building | building | the control + monitoring building, screens dark, doors chained | structure | yes | control-building interior: the monitoring room up front, the switchgear + comms rooms behind | 540 |
| 3 | `#3f382c` | dead brush | tree-dead | dead brush caught in the double perimeter fence | prop | no | — | 20 |
| 4 | `#514d44` | gravel yard | ground | the crushed-stone storage-yard gravel | ground | no | — | 7302 |
| 5 | `#c79a3f` | gate | gate | the yard gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#4a5560` | battery container | structure | a containerized battery enclosure — the hero, cold, indicator lights dead, rows spaced to the fire-lane standard | structure | yes | — | 3360 |
| 7 | `#7a7268` | HVAC / thermal unit | structure | the thermal-management / HVAC unit beside its container, fans stopped | structure | yes | — | 30 |
| 8 | `#8a8478` | inverter / transformer rack | structure | the inverter + transformer rack tying the array into the grid, dark, oil-stained | structure | yes | — | 480 |
| 9 | `#8f8676` | pole light | prop | a yard pole light, head dark | prop | yes | — | 4 |
| 10 | `#6a6a72` | perimeter fence | structure | the double security fence around the yard, wire sagging | structure | yes | — | 938 |
| 11 | `#c9c1aa` | hazard marking | marking | faded hazard striping at the control-building apron | ground | no | — | 4 |
| 12 | `#b0863a` | warning placard | prop | a high-voltage / thermal-hazard placard along the inverter rack, paint flaked | prop | yes | — | 8 |
| 13 | `#33302a` | cable trench | ground | a covered cable trench running behind each container row | ground | no | — | 963 |

**Gate:** `gates/battery_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
