# BOHEMIA DISTRICT DOSSIER — RESORT

_Category: **gaming_resort**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_resort.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead Las Vegas mega-resort — a four-storey podium carrying the casino floor wall-to-wall on the plot, a guest tower standing on it, a porte cochere you walk and drive under into the lobby, an open-deck parking garage on one end, and a dry pool basin behind. Nothing fences it: the building is the edge.**

### Real-world reference
- Las Vegas mega-resort site plans (Encore/Wynn, Paris Las Vegas, Circa; SpotlightVegas on mega-resort spatial design): the canonical form is PODIUM + TOWER. Podium floors 1-4 carry the casino floor, restaurants, theatre and convention space at grade; the GUEST TOWER stands on the podium from floor 5 up and is the whole silhouette. A PORTE COCHERE wraps the tower base and feeds the lobby off the arrival drive; a decked PARKING GARAGE attaches to one end of the podium.

### Layout — what is where
- The PODIUM runs wall-to-wall across the plot and meets the sidewalk on its frontage — a Strip podium has no setback, which is also why it needs no fence.
- The GUEST TOWER stands on the podium, set back from the podium edge, and is the tallest thing in the district.
- The PORTE COCHERE is a canopy on columns over the arrival lane; the LOBBY DOORS open off it into the podium.
- The PARKING GARAGE is an open deck on one end of the podium. The POOL DECK sits behind the building, screened by the building itself.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the lobby/porte cochere is on the primary street. The arrival DRIVE (code 1) is one connected car surface entering off the street, passing under the canopy at the lobby and returning to the street (K.driveReachFromStreet). Pedestrians walk the sidewalk (0) straight onto the podium frontage; the canopy (7) is OVERHEAD, so you pass under it on foot or in a car.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (flat): the sidewalk/apron (0), the arrival drive (1) + markings (11) + the curb cuts (5), the dry pool basin (12). STRUCTURES (¾ front face, solid): the PODIUM (2, ENTERABLE -> the casino floor), the GUEST TOWER (6, ENTERABLE -> a guest corridor), the PARKING GARAGE deck (8, ENTERABLE), and the roof/plant decks (4, 14). OVERHEAD (pass under): the porte cochere canopy (7). PORTALS: the lobby doors (13). PROPS: pole lights / canopy columns (9), abandoned vehicles (10), dead planting (3). The tower is the vertical mass and the podium is the plinth; you walk under the canopy and in through the lobby.

### Decisions & rulings
- NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): no fence, no perimeter wall, no bollard line, no kerb ring. The podium meeting the sidewalk is the edge, which is what the real building does.
- Act-1 DEAD: casino floor dark and stripped, lobby door standing open, pool a dry basin, cars abandoned under the canopy, drift in the drive.
- Gaming/resort category. Zero purple. NO FACTION, NO OWNER, NO NAME anywhere — who holds the Strip is Paolo's to rule (MECHANISM-MINE / CONTENTS-PAOLO'S).
- The podium, the tower and the garage are all ENTERABLE, so the interior/zoom phase has three real volumes to open rather than a facade.
- Research-first (per the playbook): built from real Las Vegas resort site plans, not from memory of what a casino looks like.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | sidewalk / apron | ground | the wide resort sidewalk, cracked, sand drifted along the podium wall | ground | no | — | 6488 |
| 1 | `#3f3d38` | drive lane | drive | the arrival drive in off the street and back out (car-drivable) | ground | no | — | 1765 |
| 2 | `#6d6455` | podium (casino floor) | building | the podium: four storeys of casino floor, restaurants and back of house, glass out at grade | structure | yes | the casino floor: dark, stripped, carpet lifting, banks of dead machines pushed into rows | 2648 |
| 3 | `#4a4030` | dry planting bed | tree-dead | a planting bed gone to dust and dead palm stumps | prop | no | — | 10 |
| 4 | `#847a6a` | podium roof band | structure | the podium roof band along the back of the casino floor, ducting and dead fans standing on it | structure | yes | — | 972 |
| 5 | `#c2a86a` | drive entrance | gate | the curb cut where the arrival drive meets the street — a gap in the kerb, nothing to open, no fence either side | portal | no | — | 10 |
| 6 | `#7b7263` | guest tower | building | the guest tower standing on the podium, window bands blown in places | structure | yes | a guest corridor: doors ajar down both sides, carpet, no light | 2193 |
| 7 | `#8a8172` | porte cochere canopy | overhead | the arrival canopy on columns — you walk and drive UNDER it | overhead | no | — | 574 |
| 8 | `#5f5a52` | parking garage deck | building | the open-deck parking structure on the end of the podium | structure | yes | a parking deck: cars left in the bays, ramp down into the dark | 900 |
| 9 | `#8f8676` | pole light | prop | a canopy column / drive pole light, head dark | prop | yes | — | — |
| 10 | `#55555f` | abandoned vehicle | vehicle | a car left under the canopy where it was abandoned, doors open | prop | yes | — | 30 |
| 11 | `#c9c1aa` | drive marking | marking | faded arrival-drive centre dashes | ground | no | — | 10 |
| 12 | `#4a5560` | dry pool basin | ground | the pool deck: a dry basin, tiles crazed, silt and dead planting in the bottom | ground | no | — | 204 |
| 13 | `#2e2a24` | lobby doors | portal | the lobby doors under the canopy, one leaf standing open | portal | no | — | 26 |
| 14 | `#8e8474` | tower plant deck | structure | the cooling plant standing on the tower roof, fan housings open to the sky | structure | yes | — | 554 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
