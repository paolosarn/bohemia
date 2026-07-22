# BOHEMIA DISTRICT DOSSIER — MALL

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_mall.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead enclosed shopping mall — a dumbbell-shaped building (a long concourse spine with a big-box anchor store at each end + a food-court bump-out), multiple boarded entrances, loading docks on the service side, parking fields north and south. The building itself is the mass, not a small store in a sea of asphalt.**

### Real-world reference
- Real dead-mall anatomy (Rolling Acres Mall / Randall Park Mall / Euclid Square Mall post-mortems, and Vegas's own Boulevard Mall / Meadows Mall layout): a DUMBBELL shape — a long enclosed concourse with a big-box ANCHOR department store at each end, a food-court bump-out, multiple mall-entrance vestibules along the front, service loading docks on the back, and a large parking field — but the ENCLOSED BUILDING is genuinely huge (100k-1M+ sqft), reading as the dominant mass from the air, not a footnote to the parking.

### Layout — what is where
- A long concourse spine runs east-west with a big anchor store box at each end and a food-court bump-out on the north side.
- Entrance vestibules line the south (main) face; loading docks sit on the north (service) face.
- Parking fields sit north and south of the building, tied together by a perimeter drive ring reaching the south entrance gate.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the main driveway gate is on the primary street; a perimeter drive ring (code 1) links both parking fields all the way around the building to the gate (K.driveReachFromStreet). WALKABLE-LAND: the concourse + two anchors + food court are a genuinely massive single building — real enclosed-mall precedent, not an exemption.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): parking asphalt (4), the drive ring/gate lane (1, drive), desert (0), stall markings (11). STRUCTURES (¾ front face, solid): the concourse (2, ENTERABLE), the anchor stores (6, ENTERABLE), the food court (7, ENTERABLE). PORTALS: entrance doors (12, into the concourse), loading docks (8, into service). PROPS/VEHICLES (solid): dumpster (13), abandoned cars (10). PROPS: pole lights (9), weeds (3). The dumbbell building is the mass; the drive ring is the connective ladder around it, never the main event.

### Decisions & rulings
- Act-1 DEAD: entrances boarded/smashed, food-court glazing shattered, weeds through the lot, scattered dead cars. Who squats/scavenges the anchors is faction/LIFE canon (Paolo's).
- COMMERCIAL category, distinct from downtown/strip-mall commercial — one ENCLOSED building, not an outdoor street grid or open storefronts.
- No perimeter fence (real mall lots are open to the street grid, unlike a residential complex) — a deliberate contrast with the fenced districts this session.
- WALKABLE-LAND satisfied by real-world precedent: the enclosed building mass genuinely dominates a real mall site plan, no vehicular exemption needed.
- Research-first (per the playbook): built from real dead-mall site-plan anatomy, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the lot edge | ground | no | — | 1653 |
| 1 | `#33333c` | street / drive | drive | the cracked mall ring-road / driveway (car-drivable) | ground | no | — | 1412 |
| 2 | `#5c5648` | concourse | building | the enclosed mall concourse, tilt-up + glazing, most glass gone | structure | yes | concourse interior: a long dead promenade, storefronts dark on both sides | 3204 |
| 3 | `#3a4520` | weed / brush | tree-dead | weeds through the cracked lot | prop | no | — | 3 |
| 4 | `#524c3e` | parking asphalt | ground | the mall parking field, faded striping, sun-bleached | ground | no | — | 7402 |
| 5 | `#c79a3f` | gate | gate | the main driveway curb cut off the street, amber curb | portal | no | — | 9 |
| 6 | `#726a5c` | anchor store | building | a big-box anchor department store, sign faded, doors boarded | structure | yes | anchor store interior: a cavernous dead sales floor | 2358 |
| 7 | `#6a6258` | food court | building | the food court bump-out, skylight glazing shattered | structure | yes | food court interior: dead counter stalls around a seating pit | 299 |
| 8 | `#8a7a4a` | loading dock | portal | a service loading dock on the back face, roll-up torn | portal | no | the back-of-house service corridor | 4 |
| 9 | `#8f8676` | pole light | prop | a tall parking-lot light standard, head dark | prop | yes | — | 4 |
| 10 | `#55555f` | abandoned car | vehicle | a car dead in the lot, tyres flat | prop | yes | — | 4 |
| 11 | `#c9c1aa` | stall marking | marking | faded parking-stall paint | ground | no | — | 24 |
| 12 | `#8a7a4a` | entrance door | portal | a mall entrance vestibule, glass smashed or boarded | portal | no | into the concourse | 7 |
| 13 | `#463f36` | dumpster | prop | a rusted dumpster at the service corner | prop | yes | — | 1 |

**Gate:** `gates/mall_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
