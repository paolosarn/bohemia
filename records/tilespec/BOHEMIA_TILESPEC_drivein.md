# BOHEMIA DISTRICT DOSSIER — DRIVEIN

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_drivein.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead drive-in movie theater — a torn screen tower over a fan of arced parking rows, a central snack bar + projection booth, a ticket booth + marquee at the entrance.**

### Real-world reference
- Drive-in theater design guides (conceptdraw drive-in site plan, drive-insdownunder "how to build a drive-in", Film-Tech): a screen tower built high enough to be seen from every spot; the land sculpted into ARCED ramped parking rows facing the screen; a central projection booth + concession/snack bar; a drive-up ticket booth; speaker poles + wires along the rows; often a small playground + picnic tables by the snack bar

### Layout — what is where
- A tall SCREEN TOWER spans the back (facing the cars); the whole cell is the cracked asphalt PARKING FIELD.
- ARCED parking rows curve across the field centered on the screen, each with a wheel-stop line, speaker poles, and abandoned cars nosed to the screen.
- A central SNACK BAR + PROJECTION booth faces the screen; a small playground + picnic tables sit beside it.
- A drive-up TICKET BOOTH (two booths flanking the entrance lane) + a dead MARQUEE mark the street entrance.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the ticket-booth entrance is on the primary street; the whole parking field (code 1) is the drivable surface (you drive in and park), reachable from the entrance in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: the parking/drive asphalt + arc markings (flat, drive on them). STRUCTURES (¾ front face, solid): the SCREEN TOWER (6 — its face IS the giant screen), the snack bar/projection/booths (2, ENTERABLE -> concession + projection rooms), the marquee (9). PROPS (solid, weave between): speaker poles (7), abandoned cars (8, rusting in the rows), picnic furniture (10). GROUND leisure: the playground (11). The screen is the one big vertical mass; everything else is a low field you drive across.

### Decisions & rulings
- Act-1 DEAD: torn/faded screen, rusting abandoned cars in the rows, dead speaker poles, cracked asphalt, dead marquee neon. No living vegetation.
- Leisure category (drivein). Zero purple. The screen/marquee show no readable film titles (Paolo's to author if ever).
- Research-first (per the reminder): built from real drive-in site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the parcel edge (setback/berms) | ground | no | — | 3194 |
| 1 | `#33333c` | parking / drive asphalt | drive | cracked asphalt parking field + drive lanes (car-drivable) | ground | no | — | 10859 |
| 2 | `#7a7266` | building (snack bar/projection/booth) | building | concrete-block snack bar + projection booth / ticket booths, faded | structure | yes | concession interior: counter + kitchen up front, the projection room behind | 378 |
| 3 | `#4a4030` | dead brush | tree-dead | dry tumbleweed + dead brush at the desert margins | prop | no | — | 86 |
| 4 | `#c9c1aa` | parking-row arc marking | marking | faded painted arc + wheel-stop line of a ramped parking row | ground | no | — | 710 |
| 5 | `#c79a3f` | gate / ticket booth | gate | drive-up entrance lane past the ticket booths, amber curb | portal | no | — | 7 |
| 6 | `#8a8890` | screen tower | structure | the giant movie screen on its tower — torn, sun-faded, streaked (the ¾ face is the screen) | structure | yes | — | 920 |
| 7 | `#6b6355` | speaker pole | prop | a leaning speaker pole, wire dangling, box rusted | prop | yes | — | 60 |
| 8 | `#55555f` | abandoned car | vehicle | a car rusting in its row, nosed to the screen, dust-caked | prop | yes | — | 86 |
| 9 | `#b0863a` | marquee sign | structure | the entrance marquee, dead neon, half the letters gone | structure | yes | — | 20 |
| 10 | `#8f8676` | picnic furniture | prop | weathered picnic table / bench by the concession | prop | yes | — | 8 |
| 11 | `#8a6a5a` | playground | play | sun-bleached little playground beside the snack bar | ground | no | — | 56 |

**Gate:** `gates/drivein_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
