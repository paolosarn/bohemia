# BOHEMIA DISTRICT DOSSIER — STADIUM

_Category: **leisure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_stadium.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead sports stadium — a tiered seating bowl ringing a cracked playing field, a concourse loop under the stands, the facade + entry gates, huge parking aprons, corner light towers and a dead scoreboard.**

### Real-world reference
- Stadium site-plan + bowl-design guides (Preferred-Seating "Stadium Bowl Design", conceptdraw stadium plan, Wabash Valley "How to Design a Sports Stadium", Carroll Engineering): the tiered SEATING BOWL rings the FIELD with sightlines converging on it (the "restricted bowl" pulls the farthest seat close); a CONCOURSE runs as a LOOP under/around the stands (8-15m, never a dead end) with vomitory aisles up to the seats; the FACADE wraps the outside with the entry GATES; the site needs big PARKING + highway access; LIGHT TOWERS at the corners, a SCOREBOARD over one end. A full stadium is >100m, so one 96m cell holds the bowl itself + a parking apron.

### Layout — what is where
- A parking APRON rings the whole parcel (desert only at the very margins); the BOWL is centered with room for the south entrance.
- The bowl is concentric: the FACADE wall outside, a CONCOURSE loop just inside it, the tiered SEATING stands stepping down (cut by tier walkways + 12 radial vomitory aisles), and the FIELD at the center.
- The FIELD carries faded markings (sidelines, a midline, a center circle); a SCOREBOARD hangs over the north end.
- LIGHT TOWERS stand at the four corners of the bowl; abandoned cars + rubble + weeds litter the cracked lots and the empty stands.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the main entry gates are on the primary street; the parking apron (code 1) is the drivable ring around the bowl (a car reaches it from the curb in any placement — K.driveReachFromStreet). Foot circulation is the concourse LOOP (7) under the stands with radial vomitories up to the seats; the facade gates (5) are the street->concourse portals. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the parking/drive apron (1, drive), the field (4) + its markings (8), the concourse + aisles (7), desert (0). STRUCTURES (¾ front face, solid): the FACADE wall (2, ENTERABLE -> concourse interior under the stands), the tiered SEATING bowl (6 — its ¾ face is the raked rows stepping to the field; solid mass you climb, not pass through), the SCOREBOARD (9), the LIGHT TOWERS (12, tall masts). PROPS: abandoned cars (11), weeds/rubble (3). PORTALS: the gates (5). The bowl is a big ring of vertical stand-mass around a sunken flat field — you enter through the facade, walk the concourse loop, and come UP a vomitory into the seats overlooking the field.

### Decisions & rulings
- Act-1 DEAD: cracked dead field + faded lines, weeds through the empty stands, a blank cracked scoreboard, dark shattered light towers, abandoned cars, spalled-concrete rubble. No living turf, no working lights.
- Leisure category (stadium). Zero purple. No team names/logos/colors (Paolo's to author if ever) — the facade signage + scoreboard read dead.
- ONE cell = the bowl + its apron (a real stadium footprint is >100m); the seating is generic (bowl, not sport-specific) so it serves any event canon Paolo rules later.
- Research-first (per the playbook): built from real stadium bowl + concourse + site-plan logic, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the parcel edge (setback) | ground | no | — | 2896 |
| 1 | `#33333c` | parking / drive asphalt | drive | cracked asphalt parking apron + drive lanes ringing the bowl (car-drivable) | ground | no | — | 6710 |
| 2 | `#6f665a` | facade (outer stadium wall) | building | the outer stadium wall — concrete + dead signage, the gates cut through it | structure | yes | concourse interior: the ring corridor under the stands, ramps up to the seating bowl, boarded concession windows + restrooms | 560 |
| 3 | `#4a4030` | dead weeds / rubble | tree-dead | weeds + spalled concrete rubble through the cracked lots and stands | prop | no | — | 159 |
| 4 | `#5b6a44` | dead field turf | ground | the dead playing field — brown cracked turf, the crown still faintly there | ground | no | — | 1997 |
| 5 | `#c79a3f` | gate / entrance | gate | a stadium entry gate cut through the facade, amber curb, turnstile husks | portal | no | — | 7 |
| 6 | `#6a655c` | seating / stands (the bowl) | structure | the tiered seating bowl — rows of dead seats stepping down to the field (the ¾ face is the rake of the stands) | structure | yes | — | 2499 |
| 7 | `#8f8676` | concourse (loop under the stands) | ground | the concourse ring + the aisle walkways / vomitory tunnels through the stands | ground | no | — | 1315 |
| 8 | `#c9c1aa` | field markings | ground | faded painted lines — sidelines, midline, the center circle | ground | no | — | 133 |
| 9 | `#2c2c28` | scoreboard / jumbotron | structure | the dead scoreboard over the north end, screen blank + cracked | structure | yes | — | 60 |
| 11 | `#55555f` | abandoned car | vehicle | a car rusting in the lot, dust-caked, tyres flat | prop | yes | — | 36 |
| 12 | `#9a9488` | light tower / floodlight mast | structure | a floodlight mast at a corner of the bowl, lamps dark + shattered | structure | yes | — | 12 |

**Gate:** `gates/stadium_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
