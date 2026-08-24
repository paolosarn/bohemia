# BOHEMIA DISTRICT DOSSIER — RADIO

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_radio.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**An antenna farm: five guyed masts with their anchors set far out, equipment huts at their feet, radials fanned under everything, and a transmitter building below.**

### Real-world reference
- The Black Mountain antenna farm above Henderson carries ten transmitter towers on the ridge (KNPR, KCNV, KOMP, KPLV, KXPT, KFRH, KXTE and others).
- A guyed mast needs its anchors set far from the base, which is why an antenna site is mostly empty ground with a few very tall things on it.

### Layout — what is where
- Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.
- The site itself is the MASTS plan: an antenna farm: five guyed masts with their anchors set far out, equipment huts at their feet, radials fanned under everything, and a transmitter building below.

### Circulation (street-aware / drivable)
Street-aware via K.rotateToStreet (canonical-south, order S>E>W>N): the car gate lands on the primary street and a corner adds a PEDESTRIAN gate on the side street, never a second car entrance. The access road plus the perimeter lane are the explicit car surface (code 1) and a vehicle reaches the site building from the curb (K.driveReachFromStreet). WALKABLE-LAND: the working site dominates; the road is minimal.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (walk/drive, flat): the site dead-ground (0), the working surface (4), the access road (1, drive), markings (11), and any standing water (8). STRUCTURE (three-quarter front face, SOLID): the hero mass (6), the secondary structure (7), the site building (2, ENTERABLE), the fence (12), the pipe/conveyor runs (13) and the VERTICAL (14). PROPS (solid): pole lights (9) and the prop cluster (10). PORTAL: the gate (5). What blocks is the mass; what you walk on is the working surface; what you go inside is code 2.

### Decisions & rulings
- ACT ONE ONLY: everything on this site is dead. No act-2/3 material is named anywhere in this module.
- Category infrastructure. Zero purple (PURPLE RESERVATION).
- RESEARCH-FIRST: every reference above is a real Las Vegas valley facility, cited, not remembered.
- Built by the UTILITY LANDMARK FACTORY (engine/bohemia_utility.js) from a typed spec, per the FACTORY LAW: the thirteenth landmark is a spec, not a file.
- MECHANISM-MINE / CONTENTS-PAOLO'S: no operator name, no signage text, no brand anywhere on the site.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | dead-ground (setback) | ground | ridge ground outside the fence, too steep and too high up for anything but this | ground | no | — | 2888 |
| 1 | `#4c483f` | access road | drive | the road up to the transmitter building (drivable) | ground | no | — | 1441 |
| 2 | `#6a6358` | building (equipment hut / transmitter) | building | an equipment hut at the foot of a mast, and the transmitter building below them | structure | yes | the radio building interior: the working room at the front, stores and plant behind it | 806 |
| 3 | `#3f382c` | dead brush | tree-dead | brush on the ridge between the anchors, in the only part of the site nothing needed | prop | yes | — | 143 |
| 4 | `#544f42` | site ground | ground | the ridge ground of the site, mostly empty because the guys need the room | ground | no | — | 4025 |
| 5 | `#c79a3f` | gate | gate | the site gate off the street, amber curb | portal | no | — | 5 |
| 6 | `#8a8478` | anchor block | structure | a guy anchor block, a lump of concrete out in the open with nothing near it | structure | yes | — | — |
| 7 | `#7e7768` | anchor / base plate | structure | the anchor plate and the mast base, still holding | structure | yes | — | 40 |
| 8 | `#8e8878` | guy wire | overhead | a guy wire running out from the mast to its anchor, overhead the whole way | overhead | no | — | 2591 |
| 9 | `#8f8676` | pole light | prop | a site light, head dark, below aircraft-warning lights that are darker still | prop | yes | — | 2 |
| 10 | `#9a9080` | propane tank / ice bridge | prop | the propane tank beside a hut and the ice bridge from hut to mast | prop | yes | — | 3782 |
| 11 | `#c9c1aa` | marking | marking | the station call letters stencilled on a hut door, the only name anywhere on this hill | ground | no | — | 2 |
| 12 | `#6a6a72` | perimeter fence | structure | the site fence, which was never the security here -- the climb was | structure | yes | — | 453 |
| 13 | `#6b6458` | ground radial | structure | a buried copper radial, its trench line still readable in the dirt | structure | yes | — | 161 |
| 14 | `#b0a894` | guyed mast | structure | A GUYED MAST — the tallest thing for miles, and the reason nobody built anything else up here | structure | yes | — | 45 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
