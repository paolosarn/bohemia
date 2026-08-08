# BOHEMIA DISTRICT DOSSIER — WATER

_Category: **terrain**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + no car network_

GENERATED from `engine/bohemia_water.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The reservoir in drawdown: a shrunken sheet of dead water, the white bathtub ring above it, miles of exposed lakebed, and a launch ramp that stops in mid-air.**

### Real-world reference
- Lake Mead: two decades of decline left a bright mineral BATHTUB RING over 100 feet tall on the rock, marking where the water used to be.
- Below it, exposed lakebed: cracked silt, stranded quagga-mussel shell beds, and the things the water gave back (sunken boats, a WWII plane, bodies in barrels).
- Marinas and concrete launch ramps were extended again and again and finally abandoned, ending in mid-air a long way from the shore.
- The surviving water sits in the deepest channel, flat and still.

### Layout — what is where
- One continuous depth field over the whole reservoir, sampled in valley coordinates, gives every band: open water, shallows, shell bed, cracked silt, exposed bed, bathtub ring, shore rock. The shoreline crosses cell boundaries as one curve.
- Dead brush colonises the newly exposed ground; rock scatters on the shore.
- Most cells that hold a stretch of old shoreline carry a launch ramp running down from the ring, across the exposed bed, and stopping short of the water, with mooring debris at the top of it.
- Some cells carry what the water gave back.

### Circulation (street-aware / drivable)
Everything below the ring is walkable ground now, which is the whole horror of it: you can stroll a quarter mile out onto what used to be a lake. Open water and shallows are the only tiles that are not simply crossed on foot. No street, no gate, no vehicle network.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (flat, walkable): bathtub ring (2), exposed lakebed (3), cracked silt (4), shell bed (5), shore rock (6), launch ramp (7). WATER (dead, not walked): open water (0), shallows (1). PROPS: sunken boat (8, solid), mooring debris (10, solid), dead brush (9, passable). No structures, no portals, one level.

### Decisions & rulings
- CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped
       flagged provisional; the moment Paolo ruled the target screen CBB this palette was
       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside
       its layer value bands. Road paint and the lake ring were the only things out, and
       they were wrong on their own terms too: act-1 paint is filthy, not clean white.
       Locked by the CONSTITUTION CONFORMANCE section of this module's gate.
- ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and
       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.
- Paolo 7/26: "we need to actually build a fucking world."
- The drawdown IS the content. A full blue lake would be the one thing about this landscape that is not true, and the ring says more about the world than any prop could.
- A water cell is a SURFACE, not a district.
- Whether anyone lives down on the exposed bed is LIFE/faction canon and stays Paolo's call; the terrain gives them the ground and nothing more.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | open water | water-dead | what is left of the reservoir, flat and dead still | ground | no | — | 1839 |
| 1 | `#3c6a76` | shallow water | water-dead | silty shallows over the drowned bed | ground | no | — | 1201 |
| 2 | `#b8b09c` | bathtub ring | ground | the white mineral band on the rock marking where the water used to be | ground | no | — | 2619 |
| 3 | `#8a8069` | exposed lakebed | ground | lakebed the water gave up, grey silt gone hard | ground | no | — | 2337 |
| 4 | `#948a72` | cracked silt | ground | silt dried into plates and curled at the edges | ground | no | — | 1281 |
| 5 | `#a49a80` | shell bed | ground | a crust of stranded mussel shell, crunching underfoot | ground | no | — | 548 |
| 6 | `#6b6153` | shore rock | ground | broken rock above the old high-water mark | ground | no | — | 5839 |
| 7 | `#a8a396` | launch ramp | ground | a concrete launch ramp running down and stopping in mid-air, a quarter mile short of the water | ground | no | — | 639 |
| 8 | `#5c564a` | sunken boat | vehicle | a boat the lake gave back, hull open to the sky | prop | yes | — | 65 |
| 9 | `#4a5230` | dead brush | tree-dead | brush that colonised the new ground and then died too | prop | no | — | 6 |
| 10 | `#6a6458` | mooring debris | prop | cleats, cable and dock section left where the marina was | prop | yes | — | 10 |

**Gate:** the street-aware/drivable law via `gates/district_kit_gate.js`, the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
