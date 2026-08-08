# BOHEMIA DISTRICT DOSSIER — AIRPORT

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_airport.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The airfield, built across its whole cluster instead of per cell: one runway with real markings, a full-length parallel taxiway, an apron of stands, a landside row of terminal or hangars, all inside a perimeter fence, with the aircraft still sitting where they stopped.**

### Real-world reference
- Harry Reid and Nellis, the two fields in this valley: 45 m runway with centreline, threshold bars, touchdown-zone stripes and blast pads; a full-length parallel taxiway joined by angled links; an apron of stands off it; the landside row (terminal and garages, or hangars and ops); a perimeter fence with a service road inside it.
- A runway is three kilometres long and a cell is 96 metres, so the field is a BLOB of cells with one runway across all of them.
- Amber is the taxiway centreline colour on a real field, and it is the only warm line out there.

### Layout — what is where
- The world model hands every cell of a field the BOUNDS OF ITS CLUSTER, and the runway is laid in valley coordinates against those bounds, so each cell draws its slice of one continuous line and the markings never repeat per cell.
- Cross-section from the centreline out: runway, paved shoulder, infield, parallel taxiway, apron with stands, landside row, service road, perimeter fence.
- The field lies along its long axis, so a wide cluster gets an east-west runway and a tall one gets north-south.
- An airport parks dead airliners with jet bridges still docked; an airbase parks fighters between concrete revetments.

### Circulation (street-aware / drivable)
Every pavement on the field connects: runway to shoulder to link taxiway to the parallel taxiway to the apron to the service road, which runs the length of the fence line. It is one enormous drivable surface, which is what makes an airfield worth having in a world with vehicles. On foot it is crossable everywhere except through the fence, the revetments and the buildings.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): runway (1), shoulder (3), taxiway (4), apron (6), service road (14), blast pad (16), dead ground (0), and every marking (2, 5, 7). STRUCTURE (solid): terminal (8), hangar (9), revetment (17), fence (13). PROPS (solid): light mast (15), dead airliner (11), dead fighter (12). OVERHEAD (pass under): the jet bridge (10). PORTALS: none yet; terminal and hangar interiors are a CITY-lane item when someone wants inside.

### Decisions & rulings
- Paolo 7/26: build the world. This is the last big flat thing in it, 94 cells.
- SURFACE, not district: nobody bases a faction on a runway until Paolo rules that an airfield is claimable ground. Promoting it later is one line plus a re-verified placement pass.
- Built across the CLUSTER, not the cell. A per-cell airport would have been thirty runway stubs, and that is the kind of thing that reads as fake instantly from the map.
- CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in airfield_gate.js.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead ground | ground | the graded infield between the pavements, gone to dust and weeds | ground | no | — | 4124 |
| 1 | `#4a4a52` | runway | drive | grooved runway concrete, rubber-streaked at the touchdown zones | ground | no | — | 1950 |
| 2 | `#b3ab97` | runway marking | marking | centreline, threshold bars and touchdown stripes, chalky and worn | ground | no | — | 672 |
| 3 | `#3f3f47` | paved shoulder | drive | the asphalt shoulder either side of the runway, sand drifting over it | ground | no | — | 992 |
| 4 | `#50505a` | taxiway | drive | the full-length parallel taxiway and its angled links | ground | no | — | 1240 |
| 5 | `#a08a3a` | taxi centreline | marking | the amber taxiway centreline, the one warm line on the whole field | ground | no | — | 372 |
| 6 | `#565660` | apron | drive | the apron, oil-stained where the stands were | ground | no | — | 3340 |
| 7 | `#a8a08c` | stand marking | marking | a lead-in line to a parking stand nobody is coming to | ground | no | — | — |
| 8 | `#7a7266` | terminal | building | the terminal block, glass dead dark, every door standing open | structure | yes | — | 1736 |
| 9 | `#6a6a72` | hangar | building | a hangar, doors half open on nothing | structure | yes | — | — |
| 10 | `#8a8a92` | jet bridge | overhead | a jet bridge still docked to an aeroplane that never pushed back | overhead | no | — | — |
| 11 | `#8f8f97` | dead airliner | vehicle | an airliner on the stand, doors open, slides deployed and rotted | prop | yes | — | — |
| 12 | `#5c6152` | dead fighter | vehicle | a fighter on the pad, canopy up, tyres flat | prop | yes | — | — |
| 13 | `#6b6b74` | perimeter fence | fence | the field perimeter fence, barbed top, cut through in places | structure | yes | — | 894 |
| 14 | `#44444c` | service road | drive | the perimeter service road inside the fence | ground | no | — | 496 |
| 15 | `#8f8676` | light mast | prop | an apron floodlight mast, every head dark | prop | yes | — | 4 |
| 16 | `#3a3a42` | blast pad | ground | the chevroned blast pad off the runway threshold | ground | no | — | 564 |
| 17 | `#6f6a5e` | revetment | structure | a concrete blast revetment around an alert pad | structure | yes | — | — |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
