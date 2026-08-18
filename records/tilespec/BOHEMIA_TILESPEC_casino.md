# BOHEMIA DISTRICT DOSSIER — CASINO

_Category: **gaming_resort**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_casino.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**A dead DOWNTOWN casino block — one enormous low casino floor filling the plot to the building line with no setback at all, a slender hotel wing standing on the back of it, a marquee running the whole building line for a facade, a self-park deck and a service alley behind, and a short valet lane off the side street. Nothing fences it: the building is the edge.**

### Real-world reference
- Fremont Street / Glitter Gulch (the Golden Nugget, Binion's, the Four Queens, the Fremont Street Experience canopy). A downtown casino is the OPPOSITE of a Strip resort: no setback, no arrival drive, no podium-and-tower. The casino floor meets the sidewalk on a block platted before anybody parked a car; the mass is low and wide with a slender hotel wing at the rear; the FRONTAGE IS SIGN, floor to roof, because downtown sold itself with light rather than architecture; the car is banished to a self-park deck on the alley and a short valet lane off the side street.

### Layout — what is where
- The CASINO FLOOR fills the block to the building line on the primary frontage. There is no setback, no apron and no lawn — which is also why it needs no fence.
- The HOTEL WING is slender and stands on the BACK of the floor, never across the front.
- The frontage is SIGN and nothing but: the MARQUEE runs the full building line floor to roof, two end PYLONS stand out at the kerb, and a row of sign standards runs down the walk. No canopy over the pavement (Paolo 8/2) -- the sign stands up instead of reaching out.
- A SERVICE ALLEY crosses the back of the block and runs out to the street down one side; the SELF-PARK DECK sits on it. A short VALET LANE comes in off the side street.

### Circulation (street-aware / drivable)
Street-aware via canonical-south + K.rotateToStreet: the doors and the marquee are on the primary street. The DRIVE surface (code 1) is one connected car surface — alley plus valet lane — entering off the street at the curb cuts and reaching the self-park deck (K.driveReachFromStreet). Pedestrians walk the sidewalk straight into the doors; the entry apron (7) is open ground you walk straight across.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND plane (flat): the sidewalk (0), the alley and valet lane (1) + markings (11) + the curb cuts (5). STRUCTURES (¾ front face, solid): the CASINO FLOOR (2, ENTERABLE -> the floor), the HOTEL WING (6, ENTERABLE -> a corridor of rooms), the SELF-PARK DECK (8, ENTERABLE), the MARQUEE towers (12), the roof/plant decks (4, 14) and the SKYLIGHTS (15). PORTALS: the casino doors (13). PROPS: sign standards (9), abandoned vehicles (10), debris and dead planting (3). The floor is a single low plate and the wing is the only vertical mass; you walk straight in off the pavement under the sign.

### Decisions & rulings
- NOT THE STRIP RESORT. engine/bohemia_resort.js is podium + tower + porte cochere on a 100 m arrival drive; this is a no-setback low floor with a sign for a face. Two gaming types, two real buildings, two icons.
- NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): no fence, no perimeter wall, no bollard line, no kerb ring. The building meeting the sidewalk is the edge, which is what the real block does.
- Act-1 DEAD: floor dark and stripped, doors standing open, every tube broken off, marquee faces blank, cars abandoned in the valet lane, the alley full of what got dragged out.
- Gaming/resort category. Zero purple. NO FACTION, NO OWNER, NO NAME anywhere — the marquee faces are deliberately BLANK. Who holds downtown is Paolo's to rule (MECHANISM-MINE / CONTENTS-PAOLO'S).
- The floor, the wing and the park deck are all ENTERABLE, so the interior/zoom phase has three real volumes to open rather than a facade.
- ACT TRIPTYCH: only the act-1 dead material is specified. Act-2 and act-3 are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | sidewalk | ground | the downtown sidewalk running straight into the building line, cracked, grit in the joints | ground | no | — | 4911 |
| 1 | `#3f3d38` | valet lane / alley | drive | the service alley across the back and the short valet lane off the side street (car-drivable) | ground | no | — | 2399 |
| 2 | `#6a5f4e` | casino floor | building | the casino floor: one enormous low mass filling the block, glass out at the walk | structure | yes | the floor: black carpet under a dead ceiling, machine banks pushed into rows, the cage stripped and standing open | 4722 |
| 3 | `#4a4030` | debris / dead planting | tree-dead | what got dragged out of the building and left in the alley, and dead planting gone to dust | prop | no | — | 19 |
| 4 | `#8a8072` | floor roof band | structure | the roof plant band along the back of the casino floor, ducting and dead fans standing on it | structure | yes | — | 919 |
| 5 | `#c2a86a` | drive entrance | gate | the curb cut where the valet lane and the alley meet the street — a gap in the kerb, nothing to open, no fence either side | portal | no | — | 13 |
| 6 | `#948a76` | hotel wing | building | the slender hotel wing standing on the back of the floor, window units hanging out of half the openings | structure | yes | a corridor of rooms: doors ajar, a smell of dust and old smoke, no light | 738 |
| 7 | `#8c7f63` | entry apron | ground | the paved apron in front of the doors, open to the sky, grit and broken tube glass drifted across it | ground | no | — | — |
| 8 | `#4e4a44` | self-park deck | building | the self-park deck on the alley, ramp mouth open | structure | yes | a parking deck: cars left in the bays, the ramp turning down into black | 1036 |
| 9 | `#8f8676` | sign standard | prop | a sign standard out at the kerb, its tubes broken off at the collar | prop | yes | — | 6 |
| 10 | `#55555f` | abandoned vehicle | vehicle | a car left in the valet lane where it was abandoned, doors open | prop | yes | — | 20 |
| 11 | `#c9c1aa` | lane marking | marking | faded valet-lane centre dashes | ground | no | — | 7 |
| 12 | `#a8944e` | marquee sign | structure | a marquee tower on the building line, floor to roof, the sign face dark and blank | structure | yes | — | 707 |
| 13 | `#2e2a24` | casino doors | portal | the casino doors straight off the sidewalk, one leaf standing open | portal | no | — | 42 |
| 14 | `#a0967e` | wing roof plant | structure | the plant deck on top of the hotel wing, tanks and fan housings, everything still | structure | yes | — | 207 |
| 15 | `#b6b3a4` | floor skylight | structure | a skylight punched through the roof over the pit, glazing starred and one panel gone through | structure | yes | — | 638 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
