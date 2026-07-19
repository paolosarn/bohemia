# BOHEMIA DISTRICT DOSSIER — PARK

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_park.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Realistic neighborhood park — mostly open lawn with a few well-spaced amenities on a winding trail.**

### Real-world reference
- Neighborhood-park design guides (Miracle Recreation, Park N Play, TX AgriLife, Fresno/Tracy PRMPs)
- ~half a park is passive open lawn; high-use amenities sit near the street for surveillance
- paths are curvilinear and route AROUND amenities — never a geometric circle

### Layout — what is where
- Open dead-turf lawn is ~75% of the cell — the passive heart.
- A winding Catmull-Rom loop trail threads the lawn and flows AROUND every feature (drawn after the amenities).
- Playground + one basketball court along the street edge (visible for surveillance).
- Small parking pullout at the entrance; picnic shelter + restroom in the quiet upper-left with a shade grove.
- Naturalistic dead pond (present per seed) OR a tree stand in its place; perimeter tree buffer; benches at the trail bends.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet. ONE car entrance on the primary street (order S>E>W>N) with an explicit asphalt drive (code 12) into the lot; corner side streets get a PEDESTRIAN gate. A car reaches every stall from the curb.

### Decisions & rulings
- v1 "super park" (every amenity crammed in) REJECTED — rebuilt realistic, lawn-dominant (>55% gate).
- v2 perfect-circle path + court punching through it REJECTED — curvilinear trail, amenities drawn first.
- SEED VARIETY: pond present/absent + trail/amenity jitter so several parks differ.
- STREET-AWARE/DRIVABLE law (7/19): one car entrance + pedestrian side, drive reaches every stall, any placement.

### Tile legend — every code, its material to skin
| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |
|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | edge dead-ground | ground | bare cracked dirt at the parcel edge (setback) | 493 tiles | [PENDING Paolo] |
| 1 | `#6a6a70` | path / walking trail | walk | worn decomposed-granite / cracked concrete footpath | 677 tiles | [PENDING Paolo] |
| 2 | `#7a7266` | building (shelter/restroom) | building | weathered CMU + faded metal-roof picnic shelter / restroom block | 164 tiles | [PENDING Paolo] |
| 3 | `#4a4030` | dead tree | tree-dead | bare leafless tree, grey bark, no canopy | 483 tiles | [PENDING Paolo] |
| 4 | `#c9c1aa` | court / field marking | marking | faded cream painted line, cracked | 119 tiles | [PENDING Paolo] |
| 5 | `#c79a3f` | gate / entrance | gate | park entrance gap + low bollards, amber curb paint | 14 tiles | [PENDING Paolo] |
| 6 | `#566058` | basketball court | court | faded sport-court slab, hairline-cracked, ghost of old color | 301 tiles | [PENDING Paolo] |
| 7 | `#5a4f38` | open lawn (dead turf) | turf-dead | dead brown lawn, dry thatch, bald dirt patches | 12299 tiles | [PENDING Paolo] |
| 8 | `#8a6a5a` | playground surface | play | sun-bleached rubber/woodchip safety surfacing + faded equipment | 484 tiles | [PENDING Paolo] |
| 9 | `#3a4a52` | dead pond | water-dead | empty dry basin, cracked mud floor, stone rim | 345 tiles | [PENDING Paolo] |
| 10 | `#c9c1aa` | parking stall | marking | faded stall stripe on asphalt | 104 tiles | [PENDING Paolo] |
| 11 | `#55555f` | parked car | vehicle | abandoned dust-caked car | 30 tiles | [PENDING Paolo] |
| 12 | `#41414a` | driveway / parking aisle | drive | cracked asphalt drive surface (car-drivable) | 741 tiles | [PENDING Paolo] |
| 13 | `#8f8676` | site furniture | prop | weathered bench / picnic table / trash can | 130 tiles | [PENDING Paolo] |

**Gate:** `gates/park_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
