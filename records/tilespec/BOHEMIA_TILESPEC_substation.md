# BOHEMIA DISTRICT DOSSIER — SUBSTATION

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_substation.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead electrical substation — a row of power transformers with their radiators + bushings, rows of steel switchgear bays with porcelain arrestors, overhead busbars distributing the yard, a control house, cable trenches, double-fenced on gravel. Where the eerily-perfect power network is fed.**

### Real-world reference
- Substation design guides (National Grid configurations, TYCORUN layout, Autodesk substation basics): TRANSFORMERS step voltage up/down; SWITCHGEAR (disconnects, breakers, arrestors) on steel structures; overhead BUSBARS distribute between circuits; a CONTROL HOUSE monitors; a grounding grid + double fence for safety; cable trenches connect it all.

### Layout — what is where
- The switchyard is gravel inside a DOUBLE perimeter fence (desert at the margins); the CONTROL + relay house sits at the south gate.
- A row of big TRANSFORMERS (the hero — oil-filled blocks, radiator fins, HV bushings) crosses the top; risers drop to the main overhead BUSBARS.
- Rows of steel SWITCHGEAR bays (with porcelain insulator/arrestor stacks) fill the yard below the bus.
- CABLE TRENCHES thread between the structures; pole lights ring the yard.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the switchyard gate is on the primary street; a gravel access road + perimeter lane (code 1) reach the yard from the curb (K.driveReachFromStreet). WALKABLE-LAND: the transformers + switchgear + buildings dominate; the road is minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the gravel (4), cable trenches (13), the access road (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid): the TRANSFORMERS (6, the hero mass), the SWITCHGEAR bays (7), the control house (2, ENTERABLE), the double FENCE (12), insulator/arrestor stacks (10). OVERHEAD (drawn above, pass under): the BUSBARS / conductors (8). PROPS: pole lights (9). PORTALS: the gate (5). The transformers + steel switchyard are the mass; the busbars run overhead; you cross the gravel between the structures.

### Decisions & rulings
- Act-1 DEAD: transformers cold + weeping oil, porcelain shot, switchgear dead, the control house dark, busbars sagging. This feeds the CLUSTERED POWER network (LIGHT=TERRITORY) — who re-energizes it is faction canon (Paolo's).
- Infrastructure category (substation). Zero purple.
- WALKABLE-LAND honored: transformers + switchgear + buildings dominate; access road minimal.
- Research-first (per the playbook): built from real substation switchyard layouts, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2627 |
| 1 | `#45433c` | access road | drive | the gravel access road — a maintenance truck reaches the yard from the gate (drivable) | ground | no | — | 555 |
| 2 | `#6a6358` | control house | building | the control + relay house, panels dark, doors chained | structure | yes | control-house interior: the relay + control room up front, the battery + auxiliary rooms behind | 480 |
| 3 | `#3f382c` | dead brush | tree-dead | dead brush caught in the double perimeter fence | prop | no | — | — |
| 4 | `#514d44` | gravel yard | ground | the crushed-stone switchyard gravel (grounding grid beneath) | ground | no | — | 8365 |
| 5 | `#c79a3f` | gate | gate | the switchyard gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#7a7268` | transformer | structure | a power transformer — a big oil-filled block, radiators + bushings, cold, weeping oil | structure | yes | — | 1547 |
| 7 | `#8a8478` | switchgear structure | structure | a steel lattice switchgear bay — disconnects + breakers, dead | structure | yes | — | 771 |
| 8 | `#9a948a` | busbar / conductor | overhead | the overhead busbars / conductors distributing between circuits (dead, sagging) | overhead | no | — | 475 |
| 9 | `#8f8676` | pole light | prop | a yard pole light, head dark | prop | yes | — | 3 |
| 10 | `#b0a894` | insulator / arrestor | prop | a porcelain insulator stack / lightning arrestor, cracked | prop | yes | — | 90 |
| 11 | `#c9c1aa` | marking | marking | faded hazard / bay markings on the gravel | ground | no | — | — |
| 12 | `#6a6a72` | perimeter fence | structure | the double security fence of the switchyard (grounded), wire sagging | structure | yes | — | 896 |
| 13 | `#33302a` | cable trench | ground | a covered cable trench threading the yard between the structures | ground | no | — | 570 |

**Gate:** `gates/substation_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
