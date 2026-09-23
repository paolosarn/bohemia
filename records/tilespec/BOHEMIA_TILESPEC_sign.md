# BOHEMIA DISTRICT DOSSIER — SIGN

_Category: **gaming_resort**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_landmarks.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The Welcome to Fabulous Las Vegas sign: a 1959 steel diamond on two poles with a free parking apron beside it, standing on open hardpan at the south end of the boulevard. No building — the sign IS the building.**

### Real-world reference
- Welcome to Fabulous Las Vegas, Betty Willis, 1959, at 5100 Las Vegas Blvd South. A steel diamond roughly 25 ft tall on two poles, eight white letters on red circles spelling WELCOME, an eight-pointed star on top. A free parking lot of about a dozen bays was added beside it in 2008 because drivers kept stopping on the highway to photograph it.
- Learning From Las Vegas (Venturi and Scott Brown): a Strip plot is SIGN + SHED + PARKING IN FRONT, and the sign is taller than the building. This plot is that idea with the shed removed.

### Layout — what is where
- The SIGN stands toward the WEST front of the plot, facing the boulevard, because a Vegas sign faces the road and not the lot.
- The PARKING APRON sits behind and beside it with its bays marked, reached by one kerb cut off the boulevard.
- Everything else is open hardpan with rock-lag patches: this is the edge of town and it is honestly mostly desert.

### Circulation (street-aware / drivable)
The KERB CUT (11) is the only way in off the boulevard shoulder (1). On foot the walkway (12) runs from the apron (6) to the sign footing (14). Nothing here is enterable — there is no interior, which is the whole point of the plot.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND: hardpan (0), rock lag (2), bay stripes (7), walkway (12), the sign shadow (15), dead mesquite (13). DRIVE: boulevard shoulder (1), parking apron (6), kerb cut (11). STRUCTURE (solid): the sign diamond (3), its star (4), the poles (5), the footing (14), the kerb (8), lamp posts (9), bollards (10).

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | hardpan | ground | the open hardpan at the south end of the boulevard, baked pale and cracked | ground | no | — | 6890 |
| 1 | `#3f3d38` | boulevard shoulder | drive | the shoulder where the boulevard runs past (car-drivable) | ground | no | — | 1781 |
| 2 | `#9a8a68` | rock lag | ground | a patch of desert gravel the wind left behind | ground | no | — | 5197 |
| 3 | `#b9482f` | the sign | structure | WELCOME TO FABULOUS LAS VEGAS NEVADA. The lamps are dead and the paint has gone chalky, and it still stops you. | structure | yes | — | 83 |
| 4 | `#c9c1aa` | sign star | structure | the eight-pointed star on top of the sign, one bulb left in it | structure | yes | — | 61 |
| 5 | `#7a6a50` | sign pole | structure | one of the two steel poles holding the diamond up | structure | yes | — | 42 |
| 6 | `#55514a` | parking apron | drive | the free parking apron, cracked and seal-patched (car-drivable) | ground | no | — | 1134 |
| 7 | `#8f8676` | bay stripe | ground | a parking bay stripe, mostly worn off | ground | no | — | 260 |
| 8 | `#6a6258` | kerb | structure | the low kerb around the apron | structure | yes | — | 305 |
| 9 | `#4a463f` | dead lamp post | structure | a car park lamp post with nothing in the head | structure | yes | — | 4 |
| 10 | `#c2a86a` | bollard | structure | a yellow bollard, sun-bleached to cream | structure | yes | — | 5 |
| 11 | `#46433c` | kerb cut | drive | the kerb cut off the boulevard into the apron (car-drivable) | ground | no | — | 140 |
| 12 | `#b09a72` | walkway | ground | the little concrete walk up to the sign | ground | no | — | 357 |
| 13 | `#4a4030` | dead mesquite | tree-dead | a mesquite that died when the water stopped | prop | no | — | 3 |
| 14 | `#84744f` | sign footing | structure | the concrete footing the poles stand in | structure | yes | — | 53 |
| 15 | `#5c5140` | shadow | ground | the hard shadow the diamond throws across the hardpan | ground | no | — | 69 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
