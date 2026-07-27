# BOHEMIA DISTRICT DOSSIER — SPEEDWAY

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_speedway.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead 1.5-mile banked tri-oval: the racing surface with its painted apron and catch fence, the grandstand on the front stretch only, pit road and the garage row inside the oval, the spectator tunnel that is the only way under the track, light towers, and a gravel parking apron bigger than the track itself. Act-1 dead means the cars are still on the grid.**

### Real-world reference
- Las Vegas Motor Speedway and superspeedway site planning generally: a banked asphalt oval with a painted apron on the inside and a barrier plus catch fence outside; the grandstand along the FRONT STRETCH ONLY, because the other three sides are backstretch and you do not seat people there; the start/finish line under a flag stand; pit road inside the oval parallel to the front stretch with the garage row behind it; an infield holding a road course and a great deal of nothing; light towers for night racing; and parking that dwarfs the track.
- The spectator TUNNEL exists because you cannot cross a live oval on foot. It is the single most speedway-specific piece of circulation there is, and leaving it out would be leaving out the reason the infield feels like another country.

### Layout — what is where
- The oval is centred high on the plot so the front stretch faces the entrance, which is how you actually arrive at one.
- Racing surface as a ring of constant thickness around the infield, with the painted apron on its inside edge and the catch fence outside it.
- Start/finish across the front stretch; pit road just inside the oval on the same side, its stall boxes painted; the garage row behind pit road with gaps between the bays.
- The grandstand is one long mass outside the front stretch, on that side alone.
- The tunnel runs from the grandstand side under the banking into the infield, skipping the racing surface rather than cutting it.
- Five light towers ring the oval. The rest of the plot is gravel parking, striped in rows, off ONE car entrance on the primary street.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto the parking apron, which is continuous, so a car reaches every row from the curb. On foot you cross the apron to the grandstand and take the TUNNEL under the banking to reach the infield — the racing surface is crossable on foot but the tunnel is the way the place was built to be used. A corner cell gains a pedestrian gate on the side street, never a second car entrance.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the parking apron (1), the racing surface (6), pit road (9). GROUND (walk): infield (4), desert (0), and the markings (7, 10). STRUCTURE (solid, ENTERABLE): the grandstand (2) and the garage row (8). FENCE (solid): the catch fence (11). PROPS (solid): light towers (12), dead race cars (14). TREE-DEAD (pass): brush (3). PORTAL: the entrance gate (5) and the spectator TUNNEL (13), which is a real portal into an interior, not a painted arch.

### Decisions & rulings
- Paolo 7/26: build the world. 12 valley cells were flat; this is the second-largest buildable landmark type left.
- VEHICULAR VENUE, declared: the WALKABLE-LAND law's own exception, and the clearest case of it in the game — at a speedway the vehicle surface IS the venue. Still dressed everywhere, never a void.
- The grandstand is on ONE side. Ringing the oval with seating would have been easy and wrong: three of the four sides of a superspeedway have no stands.
- No sponsor names, no series branding, no track name — Paolo's to author if it ever matters. The panels read sun-bleached blank.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | blown grit and bare Mojave dirt at the site edge and across the racing line | ground | no | — | 501 |
| 1 | `#3d3a33` | parking / drive | drive | the gravel parking apron, bigger than the track, empty | ground | no | — | 4075 |
| 2 | `#6f6858` | grandstand | building | the front-stretch grandstand, tier on tier of dead seats, the sponsor panels sun-bleached blank | structure | yes | grandstand interior: the concourse under the seating bowl, shuttered stands either side | 1316 |
| 3 | `#3a4520` | dead brush | tree-dead | tumbleweed and dry brush, thickest in the infield where nobody mows now | prop | no | — | 47 |
| 4 | `#4a4c33` | infield (dead turf) | ground | the infield, brown to the root, the road-course paint ghosting through it | ground | no | — | 3855 |
| 5 | `#c79a3f` | gate / entrance | gate | the spectator entrance off the street, turnstiles standing open | portal | no | — | 11 |
| 6 | `#3f3f47` | racing surface | drive | the banked asphalt oval, rubber still black on the racing line, grit drifting over it | ground | no | — | 2681 |
| 7 | `#b3ab97` | track marking | marking | the start/finish line and the painted apron, chalky and worn | ground | no | — | 835 |
| 8 | `#6a6a72` | garage row | building | the garage stalls behind pit road, doors up, every bay stripped | structure | yes | service bay interior: a bare concrete workshop bay, lift pit open, tool boards stripped | 741 |
| 9 | `#4a4a52` | pit road | drive | pit road inside the oval, stall boxes still painted on it | ground | no | — | 620 |
| 10 | `#8f8676` | stall markings | marking | faded paint — pit boxes on the road, parking rows across the apron | ground | no | — | 638 |
| 11 | `#6b6b74` | catch fence | fence | the catch fence and its cable, leaning where something hit it | structure | yes | — | 676 |
| 12 | `#8f8676` | light tower | prop | a race-night light tower, the tallest thing on the site, every head dark | prop | yes | — | 100 |
| 13 | `#2b2b31` | tunnel mouth | portal | the spectator tunnel under the track — the only way into the infield | portal | no | tunnel interior: a concrete underpass beneath the banking, water at the low point | 245 |
| 14 | `#5c5c66` | dead race car | vehicle | a car still sitting on the grid where the race stopped, tyres flat, numbers faded | prop | yes | — | 43 |

**Gate:** `gates/speedway_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
