# BOHEMIA DISTRICT DOSSIER — MOUNTAIN

_Category: **terrain**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + no car network_

GENERATED from `engine/bohemia_mountain.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The valley wall: ridge and ravine limestone, cliff bands, talus aprons, and alluvial fans spilling onto the flat. Solid rock walls the world in; the ravines are the only way through.**

### Real-world reference
- The ranges that ring Las Vegas (Spring Mountains west, Frenchman and Sunrise east, McCullough south) are grey Paleozoic limestone: bare rock, no soil, and no trees at valley elevation.
- The profile is RIDGE and RAVINE, sharp crests with steep chutes between them, not rolling hills. Talus aprons pile at the base where the cliffs shed rock.
- Vegetation exists only in the drainages where the runoff goes.
- Every ravine mouth lays an ALLUVIAL FAN onto the valley floor, which is why the edge of a desert city sits on a gentle apron and not against a wall.

### Layout — what is where
- Ridged noise sampled in valley coordinates gives crest, face, cliff band, talus and ravine floor by elevation, so a crest leaving one cell arrives in the next one in the right place.
- Drainages run down the ravine floors, carrying the only shrub on the mountain.
- Boulders sit on the talus, with pale rockfall scars on the faces above them.
- Any edge whose neighbour is NOT mountain gets an alluvial fan spilling out of this cell onto the flat.

### Circulation (street-aware / drivable)
THIS IS THE EDGE OF THE WORLD AND IT IS MEANT TO STOP YOU. Bedrock, crest and cliff band are SOLID: no body walks up the face. Talus, ravine floors, drainages and fans are passable, so the mountains wall the valley in and the ravines are the passes. That is how the real geography works, and here it falls out of the terrain rather than being a rule bolted on top. No vehicle surface, no street, no gate.

### Layering — exterior vs interior, what blocks, what you go under/into
STRUCTURE (solid, blocks): bedrock face (0), ridge crest (1), cliff band (2). GROUND (walkable, rough): talus (3), ravine floor (4), dry drainage (5), alluvial fan (8), rockfall scar (9). PROPS: boulder (7, solid), desert shrub (6, passable). No overhead, no portals. One level, and most of it is in your way.

### Decisions & rulings
- CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped
       flagged provisional; the moment Paolo ruled the target screen CBB this palette was
       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside
       its layer value bands. Road paint and the lake ring were the only things out, and
       they were wrong on their own terms too: act-1 paint is filthy, not clean white.
       Locked by the CONSTITUTION CONFORMANCE section of this module's gate.
- ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and
       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.
- Paolo 7/26: "we need to actually build a fucking world." 927 flat brown squares was the single biggest unbuilt thing in the valley.
- Solid rock plus passable ravines is a deliberate play property: the valley is a bowl with named ways through it, and nothing had to be hard-coded to make that true.
- A mountain cell is a SURFACE, not a district: never territory, never an address.
- No trees. At valley elevation these ranges carry none, and putting pines on them would be the exact kind of generic-desert wrongness this project keeps refusing.

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | bedrock face | structure | bare grey limestone face, no soil on it at all | structure | yes | — | 11420 |
| 1 | `#a09781` | ridge crest | structure | the sunlit crest of the ridge, rock scoured clean | structure | yes | — | 79 |
| 2 | `#463f36` | cliff band | structure | a cliff band where the slope breaks, unclimbable | structure | yes | — | 4189 |
| 3 | `#6e6656` | talus / scree | ground | apron of loose broken rock shed off the face, slow going | ground | no | — | 462 |
| 4 | `#7f7666` | ravine floor | ground | the floor of a ravine between two ridges, gravel and rock | ground | no | — | — |
| 5 | `#8b8270` | dry drainage | ground | the dry watercourse down the ravine, sand and cobble | ground | no | — | — |
| 6 | `#49512f` | desert shrub | tree-dead | dry shrub in the drainage, the only living thing on the mountain | prop | no | — | — |
| 7 | `#57503f` | boulder | prop | a boulder come down off the face, house-sized | prop | yes | — | — |
| 8 | `#8f8570` | alluvial fan | ground | washed gravel fanning out where the ravine meets the flat | ground | no | — | — |
| 9 | `#b5ab93` | rockfall scar | ground | a fresh pale scar where the face let go | ground | no | — | 234 |

**Gate:** `gates/mountain_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
