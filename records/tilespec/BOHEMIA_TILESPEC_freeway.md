# BOHEMIA DISTRICT DOSSIER — FREEWAY

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_freeway.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The interstate cell: eight lanes between a concrete median barrier and the sound wall, on an embankment, with the mile-grid street crossing OVER it on a deck. Act-1 dead, which on a freeway means the traffic is still sitting in it.**

### Real-world reference
- I-15 / CC-215 through the Las Vegas valley: 4 travel lanes each way at 12 ft, 10 ft outside shoulder, 4 ft inside shoulder, concrete F-shape median barrier, guardrail, graded embankment, and the sound wall that fronts every neighbourhood the corridor passes.
- A freeway has no at-grade crossings: the surface street grid rides OVER it on an overpass carried by centre and shoulder piers.
- No yellow paint exists on a freeway cross-section: opposing directions are separated by the barrier, not a line (LINE COLOR LAW satisfied by construction).

### Layout — what is where
- Median barrier, inside shoulder, four lanes, outside shoulder, guardrail, embankment, sound wall, out to the cell boundary on both sides.
- A NETWORK TILE like the arterial: it takes the neighbours that are also FREEWAY as its own continuation, and the neighbours that are surface street as what crosses it.
- Where an arterial crosses, an OVERPASS DECK spans the whole corridor on three lines of piers, and the freeway runs on underneath it.
- Where the RAILWAY crosses, the roles swap: the interstate is the thing on top, the mainline runs under it on the ground between the abutments, and the freeway roadway over that band becomes deck on piers. Six cells in this valley do that, and without them the one continuous 90-cell railway would be severed into three pieces.
- The dead dressing is the point: stopped cars clustered in the lanes, a jackknifed semi, debris drifted across, brush up the embankment, every light dark.

### Circulation (street-aware / drivable)
Vehicles run through on every direction the corridor continues (proven edge to edge by the gate), threading the stopped traffic. There is no sidewalk and no pedestrian crossing at grade, which is the point of a freeway: a body on foot is trespassing here, and the way across is the overpass deck above.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): lanes (1), shoulders (3), markings (2), debris (15). GROUND (walk, rough): the embankment (6). STRUCTURE (solid): median barrier (4), guardrail (5), sound wall (8), bridge columns (13). PROPS (solid): high-mast lights (9), dead cars (10), dead semis (11). OVERHEAD (pass UNDER): the overpass deck (12) and the sign gantry (14) — the deck is the mile-grid street crossing above, carried on the columns, so this cell genuinely has two levels. PORTALS: none.

### Decisions & rulings
- CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped
       flagged provisional; the moment Paolo ruled the target screen CBB this palette was
       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside
       its layer value bands. Road paint and the lake ring were the only things out, and
       they were wrong on their own terms too: act-1 paint is filthy, not clean white.
       Locked by the CONSTITUTION CONFORMANCE section of this module's gate.
- ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and
       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.
- Paolo 7/26: "we need to actually build a fucking world." 952 freeway cells were a flat grey slab; this builds them.
- A road cell is NOT an auto-district: never faction territory, never an economy district, never a quest address. It registers as a SURFACE.
- The overpass is deliberately an OVERHEAD layer with solid piers, not a painted crossing, so the two-level truth is in the data and not just the picture.
- Act-1 DEAD reads differently here than anywhere else in the valley: an empty freeway is not dead, a freeway full of stopped cars is.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dirt frontage | ground | graded dirt outside the sound wall, weeds through it | ground | no | — | 2048 |
| 1 | `#33333c` | travel lane | drive | interstate lane, sun-cracked and drifted with grit | ground | no | — | 7364 |
| 2 | `#b3ab97` | white lane line | marking | faded white lane line (a freeway has no yellow: the barrier does that job) | ground | no | — | 646 |
| 3 | `#3d3d46` | shoulder | drive | paved shoulder, rumble strip worn flat | ground | no | — | 1783 |
| 4 | `#8a8a92` | median barrier | structure | concrete F-shape median barrier, scarred and tagged | structure | yes | — | 336 |
| 5 | `#6b6b74` | guardrail | structure | steel W-beam guardrail, posts bent where something left the road | structure | yes | — | 445 |
| 6 | `#6a5f47` | embankment | ground | graded embankment slope, decomposed granite and rock | ground | no | — | 2422 |
| 7 | `#3a4520` | dead brush | tree-dead | dry brush and tumbleweed piled up the embankment | prop | yes | — | 42 |
| 8 | `#7a7266` | sound wall | structure | the tall block sound wall fronting the neighbourhood, tagged end to end | structure | yes | — | 1008 |
| 9 | `#8f8676` | high-mast light | prop | high-mast freeway light, every head dark | prop | yes | — | 3 |
| 10 | `#55555f` | dead car | vehicle | a car stopped in the lane where it died, doors open, glass gone | prop | yes | — | 132 |
| 11 | `#4a4a54` | dead semi | vehicle | a jackknifed semi across the lanes, trailer stripped | prop | yes | — | 51 |
| 12 | `#5c5c66` | overpass deck | overhead | the mile-grid street crossing overhead on its deck (you pass UNDER) | overhead | no | — | — |
| 13 | `#6f6a5e` | bridge column | structure | concrete bridge pier carrying the overpass, tagged at the base | structure | yes | — | — |
| 14 | `#6a6a72` | sign gantry | overhead | overhead sign gantry, panels gone or hanging | overhead | no | — | 73 |
| 15 | `#4a4842` | rubble / debris | prop | blown tyre, bumper, glass and drift across the lanes | prop | no | — | 31 |
| 16 | `#5a5348` | rail ballast | ground | the railway ballast running out from under the bridge, in the daylight between the abutments | ground | no | — | — |
| 17 | `#8e8a84` | rail under bridge | ground | the UP mainline passing under the interstate, rails still bright on top | ground | no | — | — |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
