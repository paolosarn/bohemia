# BOHEMIA DISTRICT DOSSIER — TRUCKSTOP

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_truckstop.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead highway truck stop / gas station — an overhead fuel canopy on columns over dry rusted pump islands, a boarded store + diner, a dead wash bay, long pull-through big-rig parking, a blank price pylon, all on a cracked drivable forecourt.**

### Real-world reference
- Gas station + fuel-station site-plan guides (plan7architect, Scottsdale gas-station design guidelines, architecture4design petrol stations, Venture Fuels c-store layouts): a big overhead CANOPY on columns shelters the PUMP ISLANDS (islands ~12-20ft wide, ≥24ft between for maneuvering); a CONVENIENCE STORE / diner attaches; a WASH bay sits near the exit to avoid backups; separate entry/exit lanes feed a drivable forecourt (≥24ft access); a tall PYLON PRICE SIGN faces the street; canopy + pole lights cover the site. A TRUCK STOP adds long pull-through big-rig parking. FUEL is the post-apocalypse scarcity currency, so a dead fuel stop is core Bohemia.

### Layout — what is where
- The whole lot is a cracked drivable FORECOURT (desert only at the very margins); entry/exit is off the south street.
- A CONVENIENCE STORE + diner sits at the back (north) with customer parking stalls in front of it.
- The FUEL CANOPY (an overhead roof on columns, open to the south so you drive in) shelters the CAR PUMP ISLANDS center-left; a WASH bay with a drive-through lane sits on the west.
- Long pull-through BIG-RIG stalls line the east; a tall PYLON price sign stands at the south street corner; pole lights, abandoned cars + rigs, and rubble litter the dead forecourt.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entry/exit is on the primary street; the whole forecourt (code 1) is the drivable surface (a car pulls in off the curb, crosses to any pump/stall, and out) reachable in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive/walk, flat): the forecourt asphalt (1, drive) + the stall markings (11), desert (0). OVERHEAD (drawn ABOVE, you pass UNDER it): the fuel CANOPY (4) — its roof floats over the pumps on columns, the forecourt runs under it. STRUCTURES (¾ front face, solid, ENTERABLE): the store/diner (2 -> store interior), the wash bay (7 -> wash-bay interior); the PYLON sign (8, tall, solid). PROPS (solid, weave between): the pump islands (6, dispensers on a raised curb), pole lights (9), abandoned vehicles (10). PORTALS: the gate (5). The canopy is the one thing you go UNDER; everything else you drive around or enter.

### Decisions & rulings
- Act-1 DEAD: dry rusted pumps, a sagging torn canopy with dead lights, a blank cracked price pylon, a boarded store, a seized wash, abandoned cars + rigs, cracked forecourt. No power, no fuel flowing (the fuel itself is a scarcity-economy resource Paolo rules).
- Filed COMMERCIAL as a truckstop (retail fuel + convenience + parking) — the taxonomy home for a fuel stop. Zero purple. No brand names/logos on the pylon or store (Paolo's to author if ever) — they read dead.
- Uses the OVERHEAD layer for the canopy (the layering law's pass-under case) — the forecourt stays drivable under the roof.
- Research-first (per the playbook): built from real gas-station + truck-stop site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the parcel edge (setback) | ground | no | — | 3169 |
| 1 | `#33333c` | forecourt / drive asphalt | drive | cracked forecourt + entry/exit lanes — the drivable apron cars pull across to the pumps | ground | no | — | 11543 |
| 2 | `#6f665a` | building (store / diner) | building | the boarded convenience store + diner, dead coolers, faded signage | structure | yes | store interior: registers + coolers + aisles up front, a small diner + back stockroom behind | 688 |
| 3 | `#4a4030` | dead brush / rubble | tree-dead | tumbleweed + spalled-concrete rubble at the cracked margins | prop | no | — | 268 |
| 4 | `#8f8a82` | fuel canopy | overhead | the fuel canopy roof on its columns — steel sagging, panels torn, the lights dead (you drive/walk UNDER it) | overhead | no | — | 121 |
| 5 | `#c79a3f` | gate / entrance | gate | the drive entrance/exit off the street, amber curb | portal | no | — | 9 |
| 6 | `#9a5a3a` | pump island / dispensers | prop | a raised pump island, dispensers dry + rusted, hoses cracked, screens dead | prop | yes | — | 38 |
| 7 | `#5a5f63` | wash bay (car / truck wash) | building | the wash bay, doors seized, brushes rotted, the drive-through lane silted | structure | yes | wash-bay interior: the wash tunnel + the equipment room off the side | 278 |
| 8 | `#b0863a` | pylon / price sign | structure | the tall pylon price sign at the street, panels blank + cracked, brand dead | structure | yes | — | 36 |
| 9 | `#8f8676` | pole light | prop | a forecourt pole light, head shattered, dark | prop | yes | — | 5 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a car or big rig left at a pump / in a stall, tyres flat, dust-caked | prop | yes | — | 60 |
| 11 | `#c9c1aa` | parking / truck stall marking | marking | faded stall paint — customer parking + the long pull-through big-rig stalls | ground | no | — | 169 |

**Gate:** `gates/truckstop_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
