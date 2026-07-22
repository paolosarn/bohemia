# BOHEMIA DISTRICT DOSSIER — WATERPARK

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_waterpark.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead water park — a big drained wave pool at the centerpiece, a lazy-river loop channel around it, four slide towers along the back edge each dropping into its own splash pool, a locker building + snack bar near the entrance, sun deck between the features, modest entrance parking.**

### Real-world reference
- Real American water-park site plans (the Wet'n'Wild Las Vegas layout before its 2004 closure is the direct regional precedent): a big WAVE POOL as the centerpiece; a LAZY RIVER loop channel; a row of SLIDE TOWERS along one edge each with its own splash-down pool; lockers/changing rooms + a snack bar near the entrance; sun deck paving between the water features; parking kept modest since the water/deck IS the venue.

### Layout — what is where
- Entrance: modest parking lot, ticket booths, a locker/changing building, a snack bar.
- Centerpiece: a big irregular wave pool with a beach-entry zigzag edge; a lazy-river loop channel runs around its east/south side.
- Four slide towers line the back (north) edge, each with a wiggling flume streak down into its own splash pool.
- Cracked sun-deck paving fills the gaps between features, scattered with toppled lounge chairs and weeds.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entrance turnstile is on the primary street; the entrance drive is the only real drivable surface (K.driveReachFromStreet). WALKABLE-LAND: the pools + slide towers + buildings + sun deck dominate the plot — real water parks are mostly water/deck, not parking, matching the real-world venue.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): sun deck (14), parking asphalt (4), the entrance drive (1), desert (0), the drained pools/river/splash pools (6/7/9, not solid — you can walk into the empty basins). STRUCTURES (¾ front face, solid): the locker building (2, ENTERABLE), the snack bar (13, ENTERABLE), the slide towers (8), ticket booths (15), the fence (12). PROPS: lounge chairs (11), pole lights (10), weeds (3). PORTALS: the gate (5). The wave pool + lazy river + slide towers are the mass; the sun deck is the connective tissue between them, not pavement for cars.

### Decisions & rulings
- Act-1 DEAD: every pool drained + cracked, flumes rust-streaked, lounge chairs toppled, weeds through the deck joints. Who squats/holds the site is faction/LIFE canon (Paolo's).
- LEISURE category. Zero purple.
- WALKABLE-LAND honored via real-world precedent: a water park's pools/slides/deck genuinely dominate a real site plan, not an exemption — parking stays modest and the gate proves content dominates without needing vehicular:true.
- Research-first (per the playbook): built from the real regional water-park precedent (Wet'n'Wild Las Vegas layout), not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2617 |
| 1 | `#33333c` | street / drive | drive | the cracked entrance drive (car-drivable) | ground | no | — | 77 |
| 2 | `#726a5c` | locker building | building | the changing rooms / locker building, doors hanging | structure | yes | locker interior: rows of rusted lockers, a dead shower block | 165 |
| 3 | `#3a4520` | weed / brush | tree-dead | weeds pushing through the cracked deck | prop | no | — | 2 |
| 4 | `#524c3e` | parking asphalt | ground | the entrance parking lot, faded striping | ground | no | — | 548 |
| 5 | `#c79a3f` | gate | gate | the park entrance turnstile, amber curb | portal | no | — | 7 |
| 6 | `#2e3a3c` | drained wave pool | water-dead | the wave pool, drained, cracked plaster, a beach-entry zigzag edge | ground | no | — | 2171 |
| 7 | `#27363c` | lazy river channel | water-dead | the lazy river loop, drained, dry leaves in the bottom | ground | no | — | 1396 |
| 8 | `#6a6258` | slide tower | structure | a water-slide tower + its flume, rust-streaked fiberglass | structure | yes | — | 152 |
| 9 | `#324248` | splash pool | water-dead | the drained splash pool at a slide's base, cracked | ground | no | — | 196 |
| 10 | `#8f8676` | pole light | prop | a park pole light, head dark | prop | yes | — | 4 |
| 11 | `#8a7a4a` | lounge chair | prop | a toppled sun-deck lounge chair, faded plastic | prop | no | — | 7 |
| 12 | `#6a6a72` | fence | structure | the park perimeter fence, chain-link sagging | structure | yes | — | 501 |
| 13 | `#5c5648` | snack bar | building | the snack bar kiosk, shutter down, sign faded | structure | yes | snack bar interior: a cramped service counter + a dead walk-in cooler | 117 |
| 14 | `#4a463c` | sun deck | ground | the concrete sun deck between the pools, cracked, weeds through the joints | ground | no | — | 8422 |
| 15 | `#726a5c` | ticket booth | structure | a ticket booth / turnstile post, glass broken | structure | yes | — | 2 |

**Gate:** `gates/waterpark_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
