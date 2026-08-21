# BOHEMIA DISTRICT DOSSIER — SUBURB

_Category: **residential**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_suburb.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**Walled tract-home neighborhood — cul-de-sac streets off the entrance, homes with front-garage driveways, packed lots, dead-dirt yards. WALLED always; GATED only if the community was rich enough to buy a gate (suburb = open street through the wall, gated/estate = a gate assembly).**

### Real-world reference
- Vegas suburb: ~14x8m house body + 6x6m front garage + 6m driveway on ~16m lots; ~85-90% single-family by land area; curvilinear cul-de-sacs, walled, few entries
- WALLED IS MANDATORY, GATED IS BOUGHT: Clark County Unified Development Code 30.64.020 requires a developer-installed decorative perimeter wall on a subdivision, so a wall signals nothing in this valley - every tract has one. A GATE is the thing a richer community paid for on top of it, and access gates carry their own 18ft setback from the property line on a collector or arterial.
- The American Housing Survey (2015, the last year it asked) put 5.9% of US households behind a wall or fence and 3.4% behind controlled access. Vegas sits far above both in absolute terms; the RATIO is what Paolo ruled and what the generator now builds - measured on the canon seed at 1.9% gated across 2,631 residential cells.

### Layout — what is where
- Cul-de-sac streets branch off the entrance gate; homes line them on packed ~0.15-acre lots.
- Each home: a short driveway apron -> a front-corner garage -> the house body; 2-story homes add an upper-floor mass (code 9).
- A perimeter block wall; dead-dirt yards — NO vegetation ever in act 1.
- Cluster-aware: fills a cw x ch union as ONE connected neighborhood (snaps into 1x2 / 2x2).

### Circulation (street-aware / drivable)
Street-aware: ENTRANCES only on street edges (a corner exits two streets); roads reach every lot from the entrance (roadConnected). Driveways (code 3) + roads (code 1) are the drivable surface. GATED IS RICH: a gated/estate community gets a GATE ASSEMBLY (code 5) in the aperture; an ordinary walled suburb gets the STREET ITSELF (code 1) running through a gap in the block wall - same 7-tile aperture, different thing standing in it.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane: roads, the one-grid SIDEWALK hugging every street (10), driveways, dead-dirt yards (flat, walk/drive). STRUCTURES (¾ front face, solid): the house (2, ENTERABLE -> floorplan) and its garage (6, ENTERABLE -> car bays + a door into the house); the perimeter wall (4). The 2-story mass (9) is the same house drawing UP a second story (its footprint is the ground-floor cell; the upper story is height, reached inside by stairs). PORTAL: the neighborhood gate (5). Key layering: a house occupies its footprint cells (block) and rises with a front face toward the street; you enter via the front door or drive into the garage — outside shell becomes inside rooms.

### Decisions & rulings
- Every home has a proper street -> driveway -> front-garage (Paolo ruling).
- Every street wears a ONE-GRID SIDEWALK on both sides (code 10), broken only where a driveway crosses it (Paolo 7/31, LOCKED). A real cell in the generator, not a render-time band, so the city and the dossier see it too.
- Driveways are exactly 2 tiles wide x 3 long (Paolo 7/31, LOCKED).
- MODULARITY LAW: must snap into 1x2 / 2x2, connected.
- Loops + garden-curve variants GRAVEYARDED (7/18 verdict) — THE BLOCK packed grid is the one canonical suburb block.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground (yard) | ground | dead-dirt front/back yard, no grass, cracked | ground | no | — | 5991 |
| 1 | `#33333c` | road | drive | cracked residential street asphalt (car-drivable) | ground | no | — | 3325 |
| 2 | `#8a8478` | house | building | single-story stucco tract house, faded, dark windows | structure | yes | house floorplan (residential): living + kitchen up front, bedrooms/bath off a hall, door to the garage | 2620 |
| 3 | `#3f3f47` | driveway | drive | cracked concrete driveway apron (drivable to garage) | ground | no | — | 420 |
| 4 | `#6b6152` | wall | fence | block perimeter wall / side fence, tan stucco, chipped | structure | yes | — | 501 |
| 5 | `#c79a3f` | gate | gate | gated-community entrance assembly off the arterial: sliding leaf, call box, kerb returns - only on a gated/estate community, never an ordinary walled suburb | portal | no | — | — |
| 6 | `#6b6b74` | garage | building | front-corner garage, steel roll door, dented | structure | yes | garage interior: 1-2 car bays, junk shelves, a door into the house | 1001 |
| 9 | `#9a938a` | house upper floor | building | 2-story house upper mass (taller top-down read) | structure | yes | the house floorplan upper story (bedrooms), reached by interior stairs | 615 |
| 10 | `#57575f` | sidewalk | walk | cracked concrete sidewalk, one grid wide, hugging the kerb; weeds in the joints, no vegetation | ground | no | — | 815 |
| 11 | `#9b968a` | gravel yard | ground | decorative desert gravel over weed fabric, the rock that replaced a lawn a long time before anybody left | ground | no | — | 991 |
| 13 | `#7c7263` | yard debris / drift | prop | blown debris drifted against the kerb and the wall -- paper, a bin on its side, what the wind kept moving | prop | no | — | 105 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
