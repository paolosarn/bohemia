# BOHEMIA DISTRICT DOSSIER — COMMERCIAL

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_commercial.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead power center: a big-box ANCHOR across the back, an L of inline shop bays under coloured awnings down the east, a lot of double-loaded parking bays with landscape islands, outparcel pads at the kerb (a fuel canopy and a drive-thru restaurant with its lane wrapping it), a pylon sign at the street, and a service alley with docks behind the whole thing.**

### Real-world reference
- PAOLO 7/31: "WE GOTTA BUILD THIS FUCKING WORLD!!! AND MAKE IT LOOK GOOD." Every district was rendered onto one contact sheet and compared; this was the worst thing on it — one flat tan L and a striped lot — and it is the most common district type in a city, so it was doing the most damage to how the valley reads.
- Real Vegas power-center site planning: anchor at the back of the pad, inline shops in an L, outparcels held out at the kerb where the traffic is, service drive behind. The outparcels are what make a lot read as a retail centre rather than an apron.
- THE AWNINGS ARE THE COLOUR. A real strip is identical concrete boxes made different by a row of faded brand awnings. The 7/28 hue measurement said our districts ran a median of three colour families against the reference twelve; this is the cheapest honest colour available and it is what the building type actually looks like.
- Built to the approved HIGH SCHOOL standard (89%, 7/31): landmark silhouette, density over pavement, no flat rectangles, real hue, and dressed.

### Layout — what is where
- The ANCHOR is the big box across the north, the largest roof on the plot, with loading docks onto the service alley behind it.
- The INLINE SHOPS run down the east in narrow bays, each with its own glass line, its own awning colour and its own back door onto the side alley.
- The LOT is double-loaded bays — stalls, aisle, stalls — with kerbed landscape islands breaking it up and the cars still in it.
- OUTPARCELS sit at the kerb: a fuel canopy with its kiosk on the west pad, a drive-thru restaurant on the east pad with the order lane wrapping the building.
- The PYLON SIGN stands at the street beside the entrance, board blank.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street. The drive network is the lot, the outparcel pads, the drive-thru lane and the rear service alley (code 1 and 15), all one connected surface reachable from the kerb (K.driveReachFromStreet). On foot the covered walks (6) run the shopfronts and the anchor front. A corner cell gains a pedestrian gate on the side street. Every business keeps a back door onto the alley for trash and deliveries (Paolo 7/18).

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): lot asphalt and the pads (1), the service alley (15), with the stall ticks (11). GROUND (walk): the setback (4), the storefront walks (6). STRUCTURE (solid, ENTERABLE): the anchor and the shop bays (2), their glass line (7), and the roof edge and rooftop plant (13), which sit ON the mass and are part of it. OVERHEAD (you pass UNDER): the shop awnings (8/9/10) and the fuel canopy (19). PROP: docks and pallets (16), fuel pumps (20), carts (18), dead trees (3). VEHICLE: the cars left in the stalls (17). PORTAL: the kerb cut (5) and every DOORWAY (14) — shop entries and steel back doors.

### Decisions & rulings
- REBUILT 7/31 on Paolo's "make it look good" ruling. The old module was a flat L and a striped lot with no second building and no colour.
- IT IS NOW ACTUALLY REGISTERED. The old one never bound K — its registration hid behind `typeof K!=='undefined'` resolving against a global another module happened to leak, so the walked city has been drawing commercial from LEGACY PREFAB STAMPS with not one enterable building. Binding K used to turn walkable_gate red because the old single-street form was 61% pavement; this one is dense enough that the law is satisfied by the design rather than by not being registered.
- The old module's "[PENDING Paolo] its standalone / mid-block form" is CLOSED: this builds canonical-south and rotates, so it works on any single edge and on corners, which is what the district kit is for.
- No brand names, no signage text, no logos anywhere. The pylon board and the shop fascias are blank because the words on them are Paolo's (MECHANISM-MINE / CONTENTS-PAOLO'S).
- ACT ONE ONLY (Paolo 7/28): looted, stripped, sun-bleached. No act-2/3 materials are specified.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground | ground | bare cracked dirt at the property line | ground | no | — | 1461 |
| 1 | `#33333c` | lot asphalt | drive | the cracked parking field and its drive aisles, weeds up every joint (car-drivable) | ground | no | — | 4667 |
| 2 | `#7c7367` | store | building | concrete shell — the anchor box and the inline shop bays, fascia stripped, glass out | structure | yes | retail interior: an open sales floor, checkout line stripped for metal, stock room and office behind | 2582 |
| 3 | `#514f40` | dead tree | tree-dead | a dead lot tree in its island, gone to stick | prop | yes | — | 167 |
| 4 | `#4a4a35` | landscape island | ground | a kerbed planting island inside the parking field — the shrub is a stick, the kerb is cracked open, and this is where the loose carts end up | ground | no | — | 419 |
| 5 | `#c79a3f` | curb cut / gate | gate | the driveway curb cut off the street, amber paint gone chalky | portal | no | — | 11 |
| 6 | `#8a8a92` | storefront walk | walk | the covered concrete walk along the shopfronts, cracked, glass underfoot | ground | no | — | 499 |
| 7 | `#3f4e52` | storefront glass | building | the shopfront glazing line, dark and mostly out | structure | yes | — | 42 |
| 8 | `#8c3f38` | awning (red) | structure | a faded red shop awning, canvas split and hanging | overhead | no | — | 72 |
| 9 | `#2f6058` | awning (teal) | structure | a faded teal shop awning, sun-bleached to grey-green | overhead | no | — | 48 |
| 10 | `#a8842f` | awning (gold) | structure | a faded gold shop awning, one end torn away | overhead | no | — | 158 |
| 11 | `#c9c1aa` | stall marking | marking | a faded white stall tick, most of them ghosts now | ground | no | — | 638 |
| 12 | `#b0863a` | pylon sign / pole | structure | the tall pylon sign at the kerb, board blank and weather-blown, and the lot light poles | structure | yes | — | 51 |
| 13 | `#a39a88` | roof ridge / plant | structure | the roof edge and the rooftop units — the parapet line, HVAC boxes, a stripped condenser | structure | yes | — | 1434 |
| 14 | `#241f1a` | doorway | portal | a way in — a shop entry with the glass gone, or a steel back door standing open | portal | no | — | 45 |
| 15 | `#2b2b31` | service alley | drive | the rear service lane, oil-black, drivable | ground | no | — | 1238 |
| 16 | `#6a6e72` | dock / pallets | prop | a loading dock with pallets still stacked on it and nobody to load them | prop | yes | — | 144 |
| 17 | `#6a6e72` | dead car | vehicle | a car left in its stall, flat, sun-bleached, never collected | prop | yes | — | 114 |
| 18 | `#9aa0a6` | shopping cart | prop | a shopping cart drifted up against a kerb | prop | no | — | 12 |
| 19 | `#5f6670` | fuel canopy | structure | the fuel-island canopy, brand panels stripped, you drive under it | overhead | no | — | 233 |
| 20 | `#8a5a4a` | fuel pump | prop | a dead pump, hoses down, screen dark | prop | yes | — | 6 |
| 21 | `#6e6a5c` | garden centre wall | fence | the block wall round the garden centre yard — open to the sky, which is why it has no roof, gate hanging off its hinge | structure | yes | — | 97 |
| 22 | `#46442f` | setback ground | ground | the unpaved property setback between the kerb and the pavement — hardpan dirt that was decorative gravel once, split by weeds, with the drift sand banked against every kerb face | ground | no | — | 2246 |

**Gate:** `gates/commercial_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
