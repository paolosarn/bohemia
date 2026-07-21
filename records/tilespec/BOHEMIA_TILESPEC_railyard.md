# BOHEMIA DISTRICT DOSSIER — RAILYARD

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_railyard.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead railyard — a fan of classification tracks holding rusted boxcars + a dead locomotive, an engine shed / maintenance depot, a container stacking yard under a seized gantry crane, a fuel + sand shed, all on ballast behind the fence.**

### Real-world reference
- Rail-yard guides (Wikipedia rail yard, railway-technical depot layout, classification yards): a fan of parallel CLASSIFICATION TRACKS sorts + stores ROLLING STOCK + LOCOMOTIVES; an ENGINE SHED / maintenance depot (inspection pits, light + heavy shops); a CONTAINER stacking area worked by a GANTRY crane; a fueling + sand facility; all on ballast.

### Layout — what is where
- The yard is ballast/gravel inside the perimeter fence (desert at the margins); an ENGINE SHED / depot + a fuel/sand + office building line the west end.
- A FAN of parallel CLASSIFICATION TRACKS (the hero) crosses the yard, sorted rusted BOXCARS + a dead LOCOMOTIVE stranded along them, gaps where cars were pulled.
- A CONTAINER stacking yard fills the SE, spanned by a seized GANTRY crane on its rails.
- A service road runs from the gate to the depot + a yard service lane along the front.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the yard gate is on the primary street; a service road (code 1) reaches the depot from the curb (K.driveReachFromStreet). WALKABLE-LAND: the tracks + rolling stock + containers + buildings dominate; the road is minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the ballast (4), the rail tracks (6, walk across the ties), the service road (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid): the depot/shed/office (2, ENTERABLE), the CONTAINERS (10), the GANTRY crane (13), the perimeter FENCE (12). VEHICLES (solid): the BOXCARS (7) + LOCOMOTIVE (8) on the rails. PROPS: pole lights (9). PORTALS: the gate (5). The rolling stock + containers + gantry are the mass; you walk the ballast + tracks between them.

### Decisions & rulings
- Act-1 DEAD: rusted boxcars + a dead loco stranded, containers rotting + ajar (picked over), the gantry seized. The rolling stock + containers are salvage/shelter (Paolo + the economy rule the loot).
- Industrial category (railyard). Zero purple. No railroad/reporting marks (generic stock).
- WALKABLE-LAND honored: tracks + stock + containers + buildings dominate; the road is minimal.
- Research-first (per the playbook): built from real rail-yard + depot layouts, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2627 |
| 1 | `#45433c` | service road | drive | the yard service road — a truck reaches the depot from the gate (drivable) | ground | no | — | 695 |
| 2 | `#6a6358` | building (engine shed/depot/office) | building | the engine shed / maintenance depot + office + fuel/sand shed, dark | structure | yes | depot interior: the inspection + light-maintenance bays (pits in the floor), the heavy shop + office off the side | 1825 |
| 3 | `#3f382c` | dead brush | tree-dead | dead brush in the ballast + fence | prop | no | — | — |
| 4 | `#4a4640` | ballast / gravel | ground | the crushed-stone ballast + gravel of the yard | ground | no | — | 7167 |
| 5 | `#c79a3f` | gate | gate | the yard gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#565048` | rail track | ground | a steel running rail on ties — the classification tracks fanned across the yard | ground | no | — | 358 |
| 7 | `#7a5548` | rolling stock (boxcar) | vehicle | a rusted freight car stranded on the track, doors sprung | prop | yes | — | 2172 |
| 8 | `#46545e` | locomotive | vehicle | a dead diesel locomotive on the track, cab dark, hulking | prop | yes | — | 308 |
| 9 | `#8f8676` | pole light | prop | a yard pole light, head dark | prop | yes | — | 4 |
| 10 | `#a8683e` | container | structure | a shipping container in the stacking yard, paint faded + streaked, doors ajar | structure | yes | — | 574 |
| 11 | `#c9c1aa` | marking | marking | faded shed-bay / yard markings | ground | no | — | 9 |
| 12 | `#6a6a72` | perimeter fence | structure | the yard perimeter fence, wire sagging | structure | yes | — | 503 |
| 13 | `#9a948a` | gantry crane | structure | the container gantry crane spanning the stack — rails, legs, a seized hoist trolley | structure | yes | — | 137 |

**Gate:** `gates/railyard_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
