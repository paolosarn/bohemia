# BOHEMIA DISTRICT DOSSIER — STORAGE

_Category: **industrial**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_storage.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead, looted self-storage facility — rows of drive-up unit buildings with roll-up doors (many pried open + ransacked) facing drive aisles, a fortress perimeter that doubles as the fence, a gate + keypad, an office, debris drifted through the aisles.**

### Real-world reference
- Self-storage site-plan guides (Inside Self-Storage layout guidelines, SteelCo building plans, ZP Architects, Mini Storage Outlet): rows of drive-up UNIT buildings (30-40ft wide) with ROLL-UP DOORS facing ~30ft DRIVE AISLES so a car reaches every unit; a single GATE with a keypad set back from the entrance + an OFFICE on the public side; the FORTRESS configuration runs single-loaded buildings along the perimeter setbacks so they double as security fencing.

### Layout — what is where
- The site is a grid of DRIVE AISLES (desert outside the fence); a security FENCE rings it (with single-loaded perimeter unit rows — the fortress config).
- Interior UNIT rows run across the site — long buildings with a roof ridge and roll-up DOORS on both faces; many doors are pried OPEN, the units ransacked + empty, spill in the aisle.
- A single GATE (street gate + an inner keypad gate) enters past the OFFICE on the public side.
- Aisle markings, pole lights, an abandoned car, and drifted debris fill the dead aisles.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street; the DRIVE AISLES (code 1) are one connected drivable grid reaching every unit door from the gate in any placement (K.driveReachFromStreet). The office sits on the public side of the gate. Corner side streets get a pedestrian gate.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (drive, flat): the drive aisles (1) + markings (11), desert (0). STRUCTURES (¾ front face, solid): the storage-unit buildings (2, ENTERABLE -> a single roll-up bay interior) with their roof ridge (4) and roll-up DOORS (6, closed, solid), the perimeter FENCE (8), the OFFICE (12, ENTERABLE). PORTALS: the gate/keypad (5) and every LOOTED OPEN unit (7 — a pried-up door you step INTO the ransacked bay). PROPS: pole lights (9), abandoned vehicles (10), debris (3). The unit rows are the vertical mass; you drive the aisles and step into whichever bay stands open.

### Decisions & rulings
- Act-1 DEAD + LOOTED: ~40% of doors pried open, units ransacked + empty, spill in the aisles, a dead keypad, debris drifted, an abandoned car. The looting tells the collapse story (this is where people cached what they lost).
- Industrial category (storage). Zero purple. No unit contents (Paolo's + the loot economy's to author) — the open bays read empty/ransacked.
- Fortress perimeter config honored (perimeter buildings double as the fence) per the site-plan security guidance.
- Every looted unit is a PORTAL (step into the bay) — hooks the zoom/interior + loot systems later.
- Research-first (per the playbook): built from real self-storage site plans, not memory.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | desert dead-ground | ground | bare Mojave dirt outside the fence (setback) | ground | no | — | 2627 |
| 1 | `#45433c` | drive aisle | drive | the cracked drive aisle between the unit rows — a car reaches every door (car-drivable) | ground | no | — | 8595 |
| 2 | `#7a6f5c` | storage-unit building | building | a row of drive-up storage units, corrugated steel, sun-faded + dented | structure | yes | unit interior: a single roll-up bay — bare shelving, a few ransacked boxes, dust | 3137 |
| 3 | `#4a4030` | debris / tumbleweed | tree-dead | debris + tumbleweed + dumped junk drifted in the aisles | prop | no | — | 4 |
| 4 | `#8a8078` | unit roof ridge | structure | the corrugated roof ridge running the length of a unit row | structure | yes | — | 552 |
| 5 | `#c79a3f` | gate / keypad | gate | the security gate + dead keypad — the street gate and the inner keypad gate, both hanging | portal | no | — | 7 |
| 6 | `#b06a3a` | roll-up door (closed) | structure | a closed roll-up door, orange paint faded, padlock rusted | structure | yes | — | 316 |
| 7 | `#241f1a` | looted / open unit | portal | a pried-open unit — door jammed up, the bay ransacked + empty, dark inside | portal | no | — | 312 |
| 8 | `#6a6a72` | perimeter fence | structure | the security fence ringing the site (the fortress perimeter), wire sagging | structure | yes | — | 501 |
| 9 | `#8f8676` | pole light | prop | an aisle pole light, head dark | prop | yes | — | 6 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a car abandoned in an aisle, tyres flat, dust-caked | prop | yes | — | 24 |
| 11 | `#c9c1aa` | aisle marking / curb | marking | faded aisle centre-line / curb paint | ground | no | — | 53 |
| 12 | `#6f665a` | office | building | the storage office on the public side of the gate, window smashed, ledger gone | structure | yes | office interior: the counter + a wall of gate-code files, a back room | 250 |

**Gate:** `gates/storage_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
