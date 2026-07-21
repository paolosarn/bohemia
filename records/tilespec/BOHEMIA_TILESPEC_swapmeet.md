# BOHEMIA DISTRICT DOSSIER — SWAPMEET

_Category: **commercial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_swapmeet.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead swap meet / flea market — rows of torn canopy-covered vendor stalls on packed-dirt aisles, a market hall / food court, a gravel parking lot, a dead market sign, junk drifted through the abandoned booths. In Bohemia this is where the barter economy lived.**

### Real-world reference
- Flea-market / swap-meet site guides (Wikipedia flea market, San Fernando + Florida swap-meet layouts, booth-layout guides): broad AISLES run in rows lined with CANOPY-covered vendor STALLS (rows often color-coded so shoppers navigate; a map at the entrance); a permanent indoor market hall + FOOD COURT; a big PARKING lot; big meets reach ~1,000 vendor spaces across many acres.

### Layout — what is where
- The market grounds are packed-dirt AISLE (desert at the margins); a MARKET HALL / food court sits back-left.
- The MARKET is rows of CANOPY-covered stalls (overhead tents) with vendor tables under them, separated by the packed-dirt aisles — the shopper grid; some stalls are collapsed to junk, the canopies torn.
- A gravel PARKING lot spans the front (south) with stall rows + a clear drive aisle; you park here and walk in.
- A market PYLON sign + a map kiosk mark the entrance; pole lights ring the mouth; junk + an abandoned car litter the dead lot.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the entrance is on the primary street; the gravel PARKING + drive (code 1) is the drivable surface reachable from the curb (you park, then WALK) in any placement (K.driveReachFromStreet). Foot circulation is the packed-dirt AISLE grid (7) between the stall rows. Corner side streets get a pedestrian gate onto the aisles.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (walk/drive, flat): the market aisle (7, walk), the gravel parking/drive (1, drive) + its markings (11), desert (0). OVERHEAD (drawn ABOVE, you pass UNDER it): the stall CANOPIES / tents (4) — fabric over the stall rows, the aisle runs under them. STRUCTURES (¾ front face, solid, ENTERABLE): the market hall / food court (2 -> indoor stalls + food-court interior); the market PYLON sign (8). PROPS (solid, weave between): the vendor tables/stalls (6), pole lights (9), the map kiosk (12), abandoned cars (10), junk piles (3). PORTALS: the gate (5). The tents are what you walk UNDER; the hall is what you go INTO; the stalls you weave between.

### Decisions & rulings
- Act-1 DEAD: torn bleached tents, knocked-over + looted stalls (some collapsed to junk), a dead market sign, an abandoned car, junk drifted through the booths. Empty of goods + people (LIFE + the barter economy reactivate it later — this district gives them the STAGE).
- Commercial category (swapmeet). Zero purple. No vendor brands/goods (Paolo's + the economy's to author) — the stalls read empty.
- The barter economy hook: this is the canonical swap-meet stage the LIFE/ECONOMY systems can populate with traders.
- Uses the OVERHEAD layer for the tents (walk under) — the aisle stays walkable beneath.
- Research-first (per the playbook): built from real swap-meet / flea-market site layouts, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt at the market edge (setback) | ground | no | — | 2659 |
| 1 | `#5f5a4e` | gravel parking / drive | drive | the gravel parking lot + drive aisle (car-drivable — you park, then walk the market) | ground | no | — | 3383 |
| 2 | `#6a5f50` | building (food hall / office) | building | the market hall / food court + office, roll doors seized, signage dead | structure | yes | market-hall interior: permanent indoor stalls + a food-court counter up front, storage behind | 252 |
| 3 | `#4a4030` | junk / debris pile | tree-dead | a knocked-over stall / a pile of picked-over junk + torn tarp | prop | no | — | 36 |
| 4 | `#b0a690` | stall canopy / tent | overhead | a vendor canopy / tent over a stall row — fabric bleached + torn, poles leaning (you walk UNDER it) | overhead | no | — | 1008 |
| 5 | `#c79a3f` | gate / entrance | gate | the market entrance off the street, amber curb, turnstile husks | portal | no | — | 9 |
| 6 | `#7a5a44` | vendor stall / table | prop | a vendor table / stall stand, goods long gone, some tipped | prop | yes | — | 280 |
| 7 | `#6f6656` | market aisle (packed-dirt walkway) | ground | the packed-dirt market aisle between the stall rows — the walkable grid | ground | no | — | 6755 |
| 8 | `#b0863a` | market pylon sign | structure | the market sign at the street, letters gone, board cracked | structure | yes | — | 44 |
| 9 | `#8f8676` | pole light | prop | a market pole light, head dark | prop | yes | — | 5 |
| 10 | `#55555f` | abandoned car | vehicle | a car left in the gravel lot, tyres flat, dust-caked | prop | yes | — | 316 |
| 11 | `#c9c1aa` | parking marking | marking | faded stall paint / row markers in the gravel lot | ground | no | — | 80 |
| 12 | `#55603a` | map kiosk / dead planter | prop | the you-are-here map kiosk / a dead planter at the market mouth | prop | no | — | 45 |
| 13 | `#a86a4a` | stall canopy / tent (red) | overhead | a faded red vendor canopy over a stall row — the market navigated by tent color (you walk UNDER it) | overhead | no | — | 936 |
| 14 | `#5f7a72` | stall canopy / tent (teal) | overhead | a faded teal vendor canopy over a stall row — the market navigated by tent color (you walk UNDER it) | overhead | no | — | 576 |

**Gate:** `gates/swapmeet_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
