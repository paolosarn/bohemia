# BOHEMIA DISTRICT DOSSIER — RAIL

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_rail.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The Union Pacific mainline: a two-track ballast prism with a passing siding every mile and a half, wayside signals, a maintenance road and a right-of-way fence, meeting the street grid at 17 real at-grade crossings and passing UNDER the freeways. Act-1 dead means the train never left.**

### Real-world reference
- The UP line through the valley is why Las Vegas exists: it was a railroad water stop before it was a town, and the line still runs the full length of the map on column 54.
- Two-track mainline at about 4.5 m centres on a raised ballast prism, cess either side, drainage ditch, a maintenance road on ONE side, right-of-way fence, then wide dirt frontage.
- Long passing sidings so opposing trains can meet, peeling off through point blades and rejoining a mile or more later.
- At-grade crossings on the surface streets: crossing panels through the rails, stop bar, the painted X, gate arms and flashers. Grade separation at the freeways: the interstate bridges over.

### Layout — what is where
- Ballast prism 0 to 10 out from the centreline with the two tracks at plus and minus 5; cess to 16; ditch to 20; maintenance road 21 to 28 on ONE side only; fence at 30 to 31; dirt frontage out to the cell edge.
- A NETWORK TILE: it takes the neighbours that are also rail as its own continuation, and the neighbours that are street as what crosses it at grade.
- The siding is keyed off the CELL COORDINATE and not the cell seed, so it runs continuously for 16 cells and then stops, instead of flickering on and off every 96 m.
- A cell whose links are perpendicular sweeps the track through a quarter arc. Column 54 is dead straight in this seed so nothing uses it yet, but a corridor generator that cannot turn is a trap for the next map.

### Circulation (street-aware / drivable)
On foot the corridor is crossable everywhere except through the fence, the relay huts and the standing rolling stock: ballast is rough going and the ditch is a step down, but nothing blocks. For vehicles there are exactly two surfaces, and that is the point of a railway: the maintenance road down one side, and the 17 at-grade crossings where the street grid gets through. The freeways do not cross here at all, they bridge over, and the corridor runs under them.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: ballast (1), ties (2), rails (3), cess (4), ditch (5), turnout (17), crossing pavement (12), crossing markings (13), dirt frontage (0). GROUND (drive): the service road (6) and the crossing (12). STRUCTURE (solid): relay hut (9), ROW fence (7). PROPS (solid): signal mast (8), gate arm (14), scrap pile (15), mile post (18), and the dead rolling stock (10, 11). OVERHEAD: none in a rail cell — the overhead is in the FREEWAY cell that bridges over it. PORTALS: none; a relay hut is a prop, not a room.

### Decisions & rulings
- Paolo 7/26: "we need to actually build a fucking world." 90 cells of flat grey down the spine of the map is not a world.
- SURFACE, not district: nobody bases a faction on a railway until Paolo rules the corridor is claimable ground.
- A rail corridor is deliberately NOT built out of the arterial vocabulary. No lanes, no median, no sidewalk, no intersections. The only paint on the whole line is at the crossings.
- The line stays CONTINUOUS through the freeway cells: bohemia_freeway.js carries the ballast and rails UNDER its deck wherever a rail cell is on the other side, so the mainline is one line for the whole valley instead of three severed pieces.
- CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in rail_gate.js.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dirt frontage | ground | the wide dirt margin outside the fence, scrap and tag marks and nothing planted | ground | no | — | 1135 |
| 1 | `#5a5348` | ballast | ground | crushed rock ballast prism, weeds coming up through it now | ground | no | — | 2571 |
| 2 | `#4a4038` | tie | ground | creosote sleeper, split and bleached where the sun gets it | ground | no | — | 869 |
| 3 | `#8e8a84` | rail | ground | running rail, still bright on top where the wheels polished it | ground | no | — | 368 |
| 4 | `#6a6152` | cess | ground | the walking cess beside the ballast, where the track crews went | ground | no | — | 1892 |
| 5 | `#5b5647` | drainage ditch | ground | the right-of-way ditch, dry, full of blown trash | ground | no | — | 406 |
| 6 | `#726853` | service road | drive | the gravel maintenance road that runs the length of the line | ground | no | — | 1024 |
| 7 | `#6b6b74` | ROW fence | fence | right-of-way fence, cut open wherever anybody wanted through | structure | yes | — | 746 |
| 8 | `#7d7a72` | signal mast | prop | a wayside signal, every lamp dark, facing a train that is not coming | prop | yes | — | 16 |
| 9 | `#6d675c` | relay hut | structure | a signal relay hut, door forced, the racks inside stripped for copper | structure | yes | — | 12 |
| 10 | `#4e4a46` | dead freight car | vehicle | a covered hopper standing on the rail exactly where it was left | prop | yes | — | 569 |
| 11 | `#43413e` | dead locomotive | vehicle | a dead road unit on the main, cab doors open, long hood gone dull | prop | yes | — | 627 |
| 12 | `#3f3f47` | crossing pavement | drive | the crossing panels and the road surface through the right of way | ground | no | — | — |
| 13 | `#a8a08c` | crossing marking | marking | the crossing X and the stop bar, worn down to ghosts | ground | no | — | — |
| 14 | `#8f8676` | gate arm | prop | a crossing gate arm still down across the road, flashers dead | prop | yes | — | — |
| 15 | `#585349` | scrap pile | prop | relay rail, ties and cut steel stacked on the frontage | prop | yes | — | 672 |
| 16 | `#3a4520` | dead brush | tree-dead | tumbleweed packed into the ditch and against the fence | prop | yes | — | 603 |
| 17 | `#8a867e` | turnout | ground | the point blades where the siding comes off the main | ground | no | — | 232 |
| 18 | `#7a7266` | mile post | prop | a mile post, the number still legible if you get close | prop | yes | — | 3 |
| 19 | `#6e6a62` | loading pad | drive | the concrete team-track pad, stained where the forklifts worked it | ground | no | — | 2545 |
| 20 | `#7a7266` | dock wall | building | the loading dock and the blank back wall of the shed behind it | structure | yes | — | 590 |
| 21 | `#7b7263` | material yard | ground | the graded yard where the railway keeps its own steel, gate hanging open | ground | no | — | 1504 |

**Gate:** `gates/rail_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
