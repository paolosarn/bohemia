# BOHEMIA DISTRICT DOSSIER — WASH

_Category: **terrain**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_wash.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Las Vegas concrete flood-control wash — a lined channel that dives under the street at a box-culvert SEWER TUNNEL MOUTH, the way the unhoused get underground.**

### Real-world reference
- Real LV flood tunnels (reviewjournal.com, nevadacurrent.com, casino.org, Wikipedia "Mole people"): a ~600-mile flood-channel system, box culverts under the Strip, an estimated 1,200-1,500 unhoused "tunnel people" living in them, entered at the wash outfalls; flash floods rip through at ~30mph toward the wetlands/Lake Mead
- Concrete-lined trapezoidal channel: sloped banks + a flat invert + a low-flow trickle, fenced, with top-of-bank maintenance roads

### Layout — what is where
- A concrete channel runs across the cell: sloped banks + a flat invert with a dead low-flow trickle down the middle.
- Top-of-bank maintenance (O&M) roads run both sides (drivable), fenced with chain-link.
- Where the channel meets the street it dives underground: a headwall + a dark BOX-CULVERT tunnel mouth — the sewer entrance.
- A hole cut in the fence + a scramble path from the street lead down to the mouth; a homeless camp (cart, tarps, crates) sits on the invert apron at the mouth.
- Desert embankments on either side, textured with dead brush + rock rubble (riprap).

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet — the channel dives under the PRIMARY street at the tunnel mouth; the maintenance O&M roads (code 1) are the drivable surface, reachable from the street gate in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
THE WASH IS BELOW GRADE — this is its whole layering story. At street/desert level: the O&M roads (1) and fence (10, solid, with a hole by the mouth) run along the TOP OF BANK. The concrete BANKS (4) are a walkable SLOPE descending from that lip down into the channel (not solid — you climb down them). The INVERT (6) + dead trickle (7) are the sunken channel FLOOR, one level down (where the tunnel people walk). STRUCTURE (¾ face, solid): the headwall (2). PORTAL: the SEWER TUNNEL MOUTH (8) — from the sunken invert you step through the box culvert into THE UNDERGROUND, a whole separate below-grade level (the LIFE tunnel network). PROPS: riprap (9, solid rubble), homeless camp debris (11, solid), dead brush (3, low/passable). So a body descends: street-grade road/fence -> slope bank -> sunken invert -> through the mouth -> underground. Three vertical layers in one cell.

### Decisions & rulings
- Paolo 7/19: a wash with a sewer entrance by the street where homeless people get into the sewers — the tunnel mouth is the headline feature.
- Filed TERRAIN in the taxonomy (the wash is the raw drainage land); it carries built flood infrastructure, so [PENDING Paolo] if he wants it moved to infrastructure.
- Act-1 DEAD: dry channel, scummy dead trickle, dead brush, no living vegetation. The "tunnel people" themselves are LIFE (agents), not tiles — this district gives them the DOOR.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt / channel embankment, cracked | ground | no | — | 4282 |
| 1 | `#4a4640` | maintenance (O&M) road | drive | gravel/old-asphalt top-of-bank service road (truck-drivable) | ground | no | — | 1564 |
| 2 | `#6b6660` | concrete flood structure | structure | poured headwall / outfall structure, stained concrete | structure | yes | — | 255 |
| 3 | `#6a5f42` | dead brush / tumbleweed | tree-dead | dry tumbleweed + dead brush caught against the concrete | prop | no | — | 531 |
| 4 | `#7a756c` | channel bank | structure | sloped concrete channel lining, cracked, faded graffiti | ground | no | — | 4554 |
| 5 | `#c79a3f` | gate | gate | flood-district maintenance gate off the street, amber curb | portal | no | — | 7 |
| 6 | `#6e6a61` | channel invert | structure | flat concrete channel floor, silt-stained, tagged | ground | no | — | 3313 |
| 7 | `#4a5048` | dead low-flow trickle | water-dead | scummy dead-green standing trickle / dried mud line | ground | no | — | 371 |
| 8 | `#141410` | SEWER TUNNEL MOUTH | structure | dark box-culvert opening under the street — the way underground | portal | no | THE UNDERGROUND: the LIFE flood-tunnel network where the unhoused live (a separate below-grade level; this is the door) | 204 |
| 9 | `#6b6355` | riprap | prop | grouted rock rubble at the culvert transition | prop | yes | — | 975 |
| 10 | `#8a8f94` | chain-link fence | fence | flood-channel security fence, sagging, a hole cut by the mouth | structure | yes | — | 211 |
| 11 | `#8a7a5a` | homeless camp debris | prop | shopping cart, tarps, milk crates, mattress — a tunnel camp at the mouth | prop | yes | — | 117 |

**Gate:** `gates/wash_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
