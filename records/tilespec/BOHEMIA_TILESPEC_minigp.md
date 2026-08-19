# BOHEMIA DISTRICT DOSSIER — MINIGP

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_minigp.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A kart circuit: a road course with real corners, a pit lane down the inside of the straight with the paddock behind it, tyre walls on the outside of every turn, gravel run-off at the fast ones, and a timing tower over the start line.**

### Real-world reference
- A club-level kart circuit is a road course of roughly half a mile: a main straight with the PIT LANE down its inside and the PADDOCK behind that, a mix of hairpins and sweepers, TYRE WALLS strapped in stacks on the outside of every turn, gravel RUN-OFF where the entry speed is highest, and a TIMING TOWER over the start line.

### Layout — what is where
- The CIRCUIT is a closed loop filling the cell, with a long main straight and a hairpin at each end.
- The PIT LANE runs the inside of the main straight; the PADDOCK BUILDING is behind it.
- TYRE BARRIERS line the outside of every turn; gravel RUN-OFF sits at the two fastest corners.
- The TIMING TOWER stands over the start line.

### Circulation (street-aware / drivable)
The circuit and the pit lane are one connected DRIVE surface (codes 1 and 6) entering off the street at the paddock gate, so a vehicle can get onto the track. On foot the infield is open and the paddock (8) is the way inside.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: infield dirt (0), the circuit (1) and pit lane (6) as drive, run-off (7), start line (11), the entrance (5), dead scrub (3). STRUCTURE (solid): the PADDOCK (2, ENTERABLE), its roof (4), the TIMING TOWER (9, ENTERABLE), the TYRE BARRIERS (12, two tiles tall per the 8/2 wall law). PORTAL: the paddock door (8). PROPS: abandoned karts (10).

### Decisions & rulings
- ONE CELL, so no cluster: a kart circuit genuinely fits in 96 m and does not need one.
- The tyre wall is a BARRIER, not a perimeter fence — it lines the turns, it does not ring the plot (Paolo 8/16).
- NO NAME, NO OWNER, NO FACTION.
- ACT TRIPTYCH: act-1 dead only.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | infield dirt | ground | the infield: packed dirt and dead scrub inside the circuit | ground | no | — | 8873 |
| 1 | `#3a3a42` | circuit | drive | the kart circuit itself, seal-coated asphalt gone grey and rubber-streaked | ground | no | — | 4393 |
| 2 | `#7a7264` | paddock building | building | the paddock building behind the pits | structure | yes | the paddock: kart stands, a tyre rack and a bench with the tools gone | 647 |
| 3 | `#4a4030` | dead scrub | tree-dead | dead scrub through the infield | prop | no | — | 8 |
| 4 | `#8a8072` | paddock roof | structure | the paddock roof, one sheet lifted and folded back | structure | yes | — | 132 |
| 5 | `#c2a86a` | drive entrance | gate | the way in off the street, no barrier | portal | no | — | 16 |
| 6 | `#8f8a80` | pit lane | drive | the pit lane down the inside of the straight, boxes still numbered | ground | no | — | 538 |
| 7 | `#5f5a52` | run-off | ground | gravel run-off on the outside of the fast corners | ground | no | — | 128 |
| 8 | `#2e2a24` | paddock door | portal | the paddock roller door standing open | portal | no | — | 14 |
| 9 | `#8f8676` | timing tower | structure | the timing tower over the start line, the board blank | structure | yes | the tower: a desk, a dead PA amp and the whole circuit in front of you | 33 |
| 10 | `#55555f` | abandoned kart | vehicle | a kart left where it stopped, bodywork cracked | prop | yes | — | 30 |
| 11 | `#c9c1aa` | start line | marking | the start line and grid boxes, worn to ghosts | ground | no | — | 12 |
| 12 | `#7d4a3a` | tyre barrier | fence | a tyre wall on the outside of the turn, stacked and strapped, some burst | structure | yes | — | 1560 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
