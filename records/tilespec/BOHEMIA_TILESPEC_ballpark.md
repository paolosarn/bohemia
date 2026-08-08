# BOHEMIA DISTRICT DOSSIER — BALLPARK

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_ballpark.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead minor-league ballpark laid out from home plate: the skinned dirt DIAMOND with its mound and bases, chalked foul lines running ninety degrees out to the wall, an outfield of dead turf inside a warning track, a raked grandstand bowl that wraps behind the plate and stops partway down each line, dugouts and bullpens in foul territory, six light towers and a lot outside.**

### Real-world reference
- Las Vegas Ballpark and minor-league parks generally: a skinned dirt infield with a pitcher's mound at its centre and four bases at ninety degrees to each other; foul lines running out from home plate at ninety degrees; an outfield of grass with a WARNING TRACK of dirt inside the wall so a fielder feels the wall before he hits it; a grandstand bowl behind the plate; dugouts and bullpens down the lines in FOUL territory; and parking outside.
- THE DIAMOND IS A WEDGE, and that is what makes a ballpark impossible to confuse with the stadium district: a stadium is a closed ring around a rectangle, a ballpark is a quarter-circle opening away from one corner.
- SCALE: a real park is about 120 m home to centre field and a cell is 96 m, so the park is compressed to roughly half — the same compression the stadium district takes. What stays true is the GEOMETRY (ninety-degree foul lines, the diamond, a bowl that stops down the lines), never the yardage.

### Layout — what is where
- Home plate at (64, 80) canonical, high enough on the plot that the whole bowl fits BEHIND it. Everything else is placed relative to it, which is how a real park is laid out.
- THE COORDINATE SYSTEM IS THE DESIGN: not x and y but `a` (how far ALONG a foul line you are, home = 0, the pole = 70) and `q` (how DEEP into foul territory, on the line = 0, growing behind the plate). Both are the 45-degree rotation of (dx, dy).
- The field is everything inside the two foul lines and inside the wall arc at 70 tiles; the warning track is the last five tiles of it and the wall follows the same arc.
- The infield diamond is a rotated square joining the four bases, so it reads as a diamond and never as a square; the mound is at its centre and the foul lines are chalked from home out to the poles.
- FOUL TERRITORY is grass out to depth 9, with only the circle round home plate and the strip in front of the stands skinned to dirt.
- THE BOWL is three bands of DEPTH — foul dirt, seats to 21, concourse to 27 — so it wraps behind the plate on its own and runs down both lines. It stops at a = 40 and TAPERS over its last stretch: no minor-league park seats the corners.
- Dugouts (a 16..30) and bullpens (a 46..60) sit in foul territory, parallel to the baselines, in front of the seats. Six light towers stand out in the lot clear of the bowl.
- The lot wraps the park to 17 tiles past the wall and then stops — a real park does not pave its whole site — striped in BLOCKS with cross aisles and a clear entrance drive, off ONE car entrance on the primary street.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto a lot that wraps the whole park and reaches the plot edge, so a car gets to every row from the curb (driveReachFromStreet 1.00 on all six orientations). On foot you cross the lot, enter the concourse (9) behind the seating, pass through the bowl into foul territory and out onto the field — the outfield wall is the only thing that stops you, which is exactly its job. A corner cell gains a pedestrian gate on the side street.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): the lot (1) and its stall markings (10). GROUND (walk): outfield (4), infield dirt and warning track (6), the mound (14), concourse (9), desert (0), and the chalk (7). STRUCTURE (solid, ENTERABLE): grandstand (2), dugouts (8), bullpens (13) — three different interiors. STRUCTURE (solid): the outfield wall (11). PROPS (solid): light towers (12). TREE-DEAD (pass): brush (3). PORTAL: the gate (5).

### Decisions & rulings
- Paolo 7/26: build the world. 8 valley cells were flat.
- THE DIAMOND IS THE SIGNATURE and the geometry is built out from home plate, never drawn as a decorative shape. Foul lines at ninety degrees, bases at ninety degrees to each other, mound at the centre of the diamond.
- THE FIRST VERSION USED RADIUS FROM HOME PLATE and it could not work: a ring behind the plate is a ring, so the seating came out as two disconnected side wings with a hole where the backstop belongs, and home plate sat so low that the bowl ran off the plot. Depth is `q` down the lines and RADIUS behind the plate, and the two agree exactly at a = 0 — straight along the baselines, curved round the backstop.
- THE STANDS STOP DOWN THE LINES. Wrapping seating all the way round would have been easier and would have made this the stadium district again.
- DUGOUTS AND BULLPENS ARE IN FOUL TERRITORY, which is where they actually are. Drawn as axis-aligned rectangles they crossed the lot ring, severed the parking from the entrance and merged into the grandstand blob.
- No team name, no ad panels, no scoreboard text — Paolo's to author. The panels read sun-bleached blank.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the edge of the site | ground | no | — | 940 |
| 1 | `#3d3a33` | parking / drive | drive | the ballpark lot, cracked, weeds down every joint | ground | no | — | 7470 |
| 2 | `#4d4b53` | grandstand | building | the horseshoe of seating behind home plate, every seat folded and grey | structure | yes | grandstand interior: the concourse under the seating, shuttered stands either side | 1142 |
| 3 | `#3a4520` | dead brush | tree-dead | brush and tumbleweed, thickest through the outfield nobody mows | prop | no | — | 60 |
| 4 | `#4a5533` | outfield (dead turf) | ground | the outfield, brown to the root, the mow pattern still faintly in it | ground | no | — | 2772 |
| 5 | `#c79a3f` | gate / entrance | gate | the gate off the street, turnstiles standing open | portal | no | — | 11 |
| 6 | `#7a5f42` | infield dirt | ground | the skinned dirt of the diamond and the warning track, weed coming through | ground | no | — | 1738 |
| 7 | `#c9c1aa` | base / chalk | marking | the bases and the chalked foul lines, ghosted but still readable | ground | no | — | 271 |
| 8 | `#5c5546` | dugout | building | a sunken dugout on the baseline, bench still bolted down | structure | yes | dugout interior: a low bench room, the tunnel to the clubhouse behind it | 120 |
| 9 | `#847f73` | concourse | ground | the concourse behind the seating, concessions shuttered | ground | no | — | 672 |
| 10 | `#8f8676` | stall markings | marking | faded parking rows across the lot | ground | no | — | 612 |
| 11 | `#67676f` | outfield wall | structure | the padded outfield wall, ad panels sun-bleached blank | structure | yes | — | 341 |
| 12 | `#a09a88` | light tower | prop | a field light tower, every head dark | prop | yes | — | 54 |
| 13 | `#6d6455` | bullpen | building | the bullpen beyond the baseline, mound and bench under a shade roof | structure | yes | bullpen interior: a shaded bench run with a warm-up mound at one end | 132 |
| 14 | `#8a6a48` | pitcher's mound | ground | the mound at the middle of the diamond, rubber still set in it | ground | no | — | 49 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
