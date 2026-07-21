# BOHEMIA DISTRICT DOSSIER — TRAILER

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_trailer.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead trailer park — staggered rows of rusted + gutted mobile homes (some burned out) on dirt lots along two internal streets, each lot with a carport + shed + propane, weeds through it, a guest-parking pod. Where the valley's poor washed up.**

### Real-world reference
- Mobile-home park design guides (MHC Buyers layout, Lexington/Fontana plot plans): rows of MOBILE HOMES on lots along 28-30ft internal STREETS; each lot has a CARPORT / parking pad + a SHED + utilities (propane); a STAGGERED / offset layout for privacy; guest parking; cul-de-sacs for a community feel.

### Layout — what is where
- Two internal through-STREETS ladder the park; STAGGERED rows of MOBILE HOMES face them on dirt lots (desert at the margins, fenced).
- Each lot has the trailer (offset for privacy), a metal CARPORT with a car under it, a tin SHED, and a propane tank; some trailers are BURNED-OUT shells.
- A guest-parking pod sits by the entrance; pole lights + weeds choke the dead lots.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the park entrance is on the primary street; a spine links both internal streets to the gate (code 1 reaches every lot from the curb, K.driveReachFromStreet). WALKABLE-LAND: the trailers + carports + sheds dominate; the streets are the connective ladder. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the lot dirt (4), the streets/pads (1, drive), pad markings (11), desert (0). OVERHEAD (park/walk UNDER): the CARPORT awnings (6). STRUCTURES (¾ front face, solid): the MOBILE HOMES (2, ENTERABLE -> single-wide plan), the SHEDS (7), the BURNED trailers (8), the fence (12). VEHICLES/PROPS (solid): abandoned cars (10), propane tanks (13). PROPS: pole lights (9), weeds (3). PORTALS: the gate (5). The rows of trailers are the mass; you drive the ladder streets between them, park under the carports.

### Decisions & rulings
- Act-1 DEAD: trailers rusted + gutted, ~16% burned out, weeds through the lots, abandoned cars, propane long empty. Who squats here now is faction/LIFE canon (Paolo's).
- Residential category (trailer). Zero purple.
- WALKABLE-LAND honored: trailers + carports + sheds dominate; streets are the ladder.
- Research-first (per the playbook): built from real mobile-home park plot plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2627 |
| 1 | `#4a4438` | street / drive | drive | the cracked internal park street / driveway pad (car-drivable) | ground | no | — | 1986 |
| 2 | `#7a7266` | mobile home | building | a mobile home / trailer, aluminium skin dented + sun-bleached, windows dark | structure | yes | trailer interior: a single-wide railroad plan — living + kitchenette up front, a bath + bedroom down the hall | 3517 |
| 3 | `#3a4520` | weed / brush | tree-dead | weeds + tumbleweed choking a dead lot | prop | no | — | 8 |
| 4 | `#565040` | lot dirt | ground | the packed-dirt / gravel lot the trailers sit on | ground | no | — | 6012 |
| 5 | `#c79a3f` | gate | gate | the park entrance off the street, amber curb | portal | no | — | 5 |
| 6 | `#6a6a72` | carport | overhead | a metal carport awning beside a trailer (you park/walk UNDER it), sagging | overhead | no | — | 767 |
| 7 | `#6a5f50` | shed | building | a small tin storage shed on the lot, door hanging | structure | yes | — | 324 |
| 8 | `#332a26` | burned trailer | building | a burned-out trailer — charred shell, roof collapsed | structure | yes | — | 336 |
| 9 | `#8f8676` | pole light | prop | a park pole light, head dark | prop | yes | — | 4 |
| 10 | `#55555f` | abandoned car | vehicle | a car dead on a lot / under a carport, tyres flat | prop | yes | — | 204 |
| 11 | `#c9c1aa` | pad marking | marking | faded pad / tie-down / guest-stall paint | ground | no | — | 63 |
| 12 | `#6a6a72` | fence | structure | the park perimeter fence, chain-link sagging | structure | yes | — | 503 |
| 13 | `#a86a3a` | propane tank | prop | a rusted propane tank at a trailer corner | prop | yes | — | 28 |

**Gate:** `gates/trailer_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
