# BOHEMIA DISTRICT DOSSIER — LANDFILL

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_landfill.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead landfill — big waste cells ringed by earthen berms and filled with picked-over trash, leachate evaporation ponds gone to scum, a scale house + office at the gate, haul roads, gas wells, a dead dozer + compactor. Where everything ends up.**

### Real-world reference
- Landfill design guides (BTL cell design, Waste360, EPA landfill guide): WASTE CELLS are basins ringed by earthen BERMS, each with a liner + leachate collection, filled + compacted under daily cover soil; LEACHATE evaporation PONDS; a SCALE house + office; HAUL ROADS + progressive infrastructure; landfill-gas collection WELLS; heavy EQUIPMENT (dozers/compactors) work the active face.

### Layout — what is where
- The site is cover-soil dirt inside a litter-choked perimeter fence (desert at the margins); a scale house + office + truck scale sit at the south gate.
- Big WASTE CELLS (earthen berms filled with compacted, debris-flecked trash) are the landscape — the hero; a dead DOZER + compactor sit on the faces.
- LEACHATE evaporation PONDS (black scum) sit at the east; gas-collection WELLS dot the capped cells.
- HAUL ROADS ring + spur to every cell from the gate.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street past the scale; HAUL ROADS (code 1) ring + spur so a truck reaches every cell from the curb (K.driveReachFromStreet). WALKABLE-LAND: the cells + berms + waste + ponds dominate; haul roads are minimal. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive/walk, flat): the cover soil (4), waste fill (6), leachate ponds (8), haul roads (1, drive), scale markings (11), desert (0). STRUCTURES (¾ front face, solid): the buildings (2, ENTERABLE), the cell BERMS (7), the perimeter FENCE (12), gas WELLS (13). VEHICLES (solid): the dead EQUIPMENT (10). PROPS: pole lights (9). PORTALS: the gate (5). The bermed trash cells are the mass; you drive the haul roads between them.

### Decisions & rulings
- Act-1: the dump is world-native dead — the trash IS the landscape, picked over; ponds gone to scum, a seized dozer. The salvage/scav economy sifts here (Paolo + the economy rule the loot).
- Infrastructure category (landfill). Zero purple.
- WALKABLE-LAND honored: cells + berms + waste + ponds + equipment dominate; haul roads minimal.
- Research-first (per the playbook): built from real landfill site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2617 |
| 1 | `#4a4438` | haul road | drive | the packed haul road — trucks reach every cell from the gate (drivable) | ground | no | — | 1513 |
| 2 | `#6a5f50` | building (scale/office/gas) | building | the scale house + office + gas-plant shed, dark | structure | yes | scale-house interior: the weigh office + a control room, the gas-plant equipment room behind | 405 |
| 3 | `#3f382c` | dead brush | tree-dead | dead brush + windblown litter caught in the fence | prop | no | — | 139 |
| 4 | `#5a5040` | cover soil / dirt | ground | the daily-cover soil capping the cells / the site dirt | ground | no | — | 4310 |
| 5 | `#c79a3f` | gate | gate | the landfill gate off the street, past the scale, amber curb | portal | no | — | 7 |
| 6 | `#565238` | waste fill | ground | compacted trash — the fill itself, the picked-over landscape of the dump | ground | no | — | 4887 |
| 7 | `#6e6353` | cell berm | structure | the earthen berm ringing a waste cell (contains the leachate) | structure | yes | — | 1071 |
| 8 | `#3a4436` | leachate pond | ground | a leachate evaporation pond, gone to black scum | ground | no | — | 660 |
| 9 | `#8f8676` | pole light | prop | a site pole light, head dark | prop | yes | — | 3 |
| 10 | `#c8a03a` | equipment (dozer/compactor) | vehicle | a dead landfill dozer / spiked compactor, yellow faded, tracks seized | prop | yes | — | 112 |
| 11 | `#c9c1aa` | marking (scale) | marking | the truck-scale pad + faded site markings | ground | no | — | 153 |
| 12 | `#6a6a72` | perimeter fence | structure | the landfill perimeter fence, litter-choked | structure | yes | — | 501 |
| 13 | `#8a8478` | gas well / pipe | prop | a landfill-gas collection wellhead / pipe riser on a capped cell | prop | yes | — | 6 |

**Gate:** `gates/landfill_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
