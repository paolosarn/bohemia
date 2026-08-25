# BOHEMIA DISTRICT DOSSIER — PRISON

_Category: **civic**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_prison.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A Nevada desert prison: four housing units around a central services core, each with its own exercise yard, inside a double perimeter with corner guard towers and a sally-port vehicle trap — and the administration building sitting OUTSIDE the wire, which is the tell.**

### Real-world reference
- High Desert State Prison / Southern Desert Correctional Center, Indian Springs NV. A modern desert facility is a campus, not a cellblock: long single-storey HOUSING UNITS arranged around a central SERVICES CORE (kitchen, laundry, infirmary), each unit with its own fenced exercise yard; a DOUBLE PERIMETER of chain-link with razor coil and electronic detection between the runs; GUARD TOWERS at the corners; a SALLY-PORT vehicle trap as the only way a vehicle enters; and ADMINISTRATION outside the wire so visitors never cross it.

### Layout — what is where
- FOUR HOUSING UNITS on the diagonals around a central SERVICES CORE, each with its own exercise yard.
- The DOUBLE PERIMETER rings the compound with a service road inside it and GUARD TOWERS at the four corners.
- The SALLY PORT is the only vehicle way in, on the primary street.
- ADMINISTRATION is outside the wire, between the sally port and the street.

### Circulation (street-aware / drivable)
The service ROAD (code 1) runs the inside of the perimeter and out through the sally port to the street, so a vehicle reaches every unit. On foot the compound is deliberately hard: the yards are enclosed, and the one cut in the wire is the way out.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: compound dirt (0), service road (1), exercise yards (6), dead scrub (3), sally port (5). STRUCTURE (solid): HOUSING UNITS (2, ENTERABLE -> a dayroom), the SERVICES CORE (11, ENTERABLE), ADMINISTRATION (12, ENTERABLE), GUARD TOWERS (9, ENTERABLE -> the cab), unit roofs (4), and the PERIMETER FENCE (7, two tiles tall per the 8/2 wall law). PORTAL: unit doors (8). PROPS: abandoned vehicle (10).

### Decisions & rulings
- CLUSTER-BUILT: 4 cells, one 2x2 blob, laid in valley coordinates so it is ONE prison.
- THE PERIMETER IS THE DECLARED EXCEPTION to Paolo 8/16 ("no perimeter walls until I tell you"). A prison's perimeter IS the building, and `jail` already ships a walled secure yard with four guard towers, approved since 7/19. Same class, same precedent — declared out loud rather than hidden, and one word kills it.
- ONE CUT IN THE WIRE, because a district that cannot be left is a prison in the wrong sense (Paolo 8/1: "make sure I cant be locked in any certain district ever again").
- NO NAME, NO OWNER, NO FACTION, and nobody in it. Who is inside is Paolo's.
- ACT TRIPTYCH: act-1 dead only.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | compound dirt | ground | the graded dirt of the compound, nothing growing on it | ground | no | — | 1456 |
| 1 | `#3f3d38` | service road | drive | the perimeter service road and the sally-port lane (car-drivable) | ground | no | — | 1826 |
| 2 | `#7a7264` | housing unit | building | a housing unit: a long single-storey block with a slot window every cell | structure | yes | a dayroom with two tiers of cell doors around it, every door standing open | 2492 |
| 3 | `#4a4030` | dead scrub | tree-dead | dead scrub against the wire | prop | no | — | 8 |
| 4 | `#8c8274` | unit roof | structure | the unit roof with its swamp coolers, every fan still | structure | yes | — | 580 |
| 5 | `#c2a86a` | sally port | gate | the sally-port vehicle trap, both gates hanging open | portal | no | — | 262 |
| 6 | `#6a6558` | exercise yard | ground | a yard of packed dirt with a bare backboard at one end | ground | no | — | 1080 |
| 7 | `#8a8a92` | perimeter fence | fence | the double perimeter: two chain-link runs with razor coil between them, cut through in one place | structure | yes | — | 2094 |
| 8 | `#2e2a24` | unit door | portal | a unit door standing open onto the dayroom | portal | no | — | 48 |
| 9 | `#8f8676` | guard tower | structure | a corner guard tower on its legs, glass gone, nobody in it | structure | yes | the tower cab: a swivel chair, a dead phone, and the whole compound below you | 324 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a transport van left in the sally port | prop | yes | — | 12 |
| 11 | `#5f5a52` | services core | building | the services core: kitchen, laundry and infirmary in one block at the middle | structure | yes | the core: steam kettles cold, the infirmary cabinets emptied first | 296 |
| 12 | `#9a9184` | administration | building | the administration building, OUTSIDE the wire | structure | yes | admin: a counter, a visitor bench, and files pulled out onto the floor | 336 |
| 13 | `#8a7f66` | outside ground | ground | the desert outside the wire — never graded, never walked, creosote coming back into it | ground | no | — | 3069 |
| 14 | `#75694f` | rock lag | ground | rock lag and creosote in patches outside the wire, the desert taking it back | ground | no | — | 2501 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
