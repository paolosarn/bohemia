# BOHEMIA DISTRICT DOSSIER — INTERCHANGE

_Category: **infrastructure**  ·  Cell: 96 m × 96 m = 128×128 tiles (0.75 m/tile)  ·  Street-aware + drivable (explicit car network)_

GENERATED from `engine/bohemia_interchange.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ACT-2/3 evolution is Paolo's call.

**The stack: two interstates crossing, one over the other on a piered deck, with eight ramps in the four quadrants — a tight connector at grade and a long directional flyover that rides over both mainlines. Solved across all sixteen cells of the block at once, with the infield, its retention basin and the dead jam that starts here.**

### Real-world reference
- I-15 crossing US-95 is the Spaghetti Bowl, the single biggest man-made object in the valley, and the 16 interchange cells are one four-by-four block of it at x50-53, y19-22.
- A big stack is: two mainlines crossing on different levels, a tight direct connector hugging the inside of each quadrant at grade, and a long directional flyover sweeping wide over everything.
- The infield is the unreachable weedy ground inside the ramps, and the retention basin the whole structure drains into sits in it.
- A dead city jams at its interchange first: the ramps back up, and everything behind them stops for good.

### Layout — what is where
- Every tile is a PURE FUNCTION of its valley position — there is no per-cell buffer anywhere in this module — so the sixteen cells agree at their seams by construction rather than by luck.
- The world model supplies the cluster bounds and the APPROACHES: which columns and rows the interstate actually arrives on, so the ramps land on the real road instead of on a symmetry assumption.
- The mainline cross-section is the freeway module's, tile for tile: barrier, inside shoulder, four lanes, outside shoulder, guardrail. That is why a carriageway crosses the block boundary without a step.
- Ramp radii scale with the block: about 0.18 of its short span for the tight connectors and 0.38 for the flyovers, so a bigger junction gets bigger sweeps instead of the same eight arcs stretched.

### Circulation (street-aware / drivable)
Vehicles run through on both mainlines and around all eight ramps, and every ramp physically meets the carriageway it serves. On foot it is the worst ground in the valley and that is correct: no sidewalk, no crossing, a body walking here is walking on the interstate. The one thing a body CAN do is get underneath — the deck is an overhead tile you pass under, and the infield, the basin and the maintenance track are all walkable.

### Layering — exterior vs interior, what blocks, what you go under/into
GROUND (drive): lanes (1), shoulders (3), ramp lanes (16), ramp shoulders (17), maintenance track (20), and the markings (2, 18). GROUND (walk): infield (0), embankment (6), retention basin (19). STRUCTURE (solid): median barrier (4), guardrail (5), sound wall (8), piers (13). PROPS (solid): high-mast lights (9), dead cars (10), dead semis (11). OVERHEAD (pass UNDER): the deck (12) and the sign gantry (14). PORTALS: none.

### Decisions & rulings
- Paolo 7/26: "we need to actually build a fucking world." Sixteen grey squares is the worst possible rendering of the biggest object in the city.
- Built across the CLUSTER, not the cell, for the same reason the airfield is: a 300 m flyover cannot be drawn 96 m at a time.
- SURFACE, not district: nobody bases a faction on an interchange until Paolo rules it is claimable ground.
- Codes 0 to 15 are deliberately the FREEWAY module's own codes, so the interstate and its junction read as one road and not two art styles meeting.
- CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in interchange_gate.js.
- ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].

### Tile legend — every code: material to skin + layer/occupancy/interior
_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._

| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |
|---|---|---|---|---|---|---|---|---|
| 0 | `dead-dirt (kit ground)` | infield dirt | ground | the graded infield inside the ramps, nobody has been in here in years | ground | no | — | 315 |
| 1 | `#33333c` | travel lane | drive | mainline lane through the junction, sun-cracked and drifted | ground | no | — | 1831 |
| 2 | `#b3ab97` | white lane line | marking | faded white lane line (a freeway has no yellow: the barrier does that job) | ground | no | — | 401 |
| 3 | `#3d3d46` | shoulder | drive | paved shoulder, rumble strip worn flat | ground | no | — | 1244 |
| 4 | `#8a8a92` | median barrier | structure | concrete F-shape median barrier, scarred and tagged | structure | yes | — | 128 |
| 5 | `#6b6b74` | guardrail | structure | steel W-beam guardrail, posts bent where something left the road | structure | yes | — | 472 |
| 6 | `#6a5f47` | embankment | ground | graded embankment slope, decomposed granite and rock | ground | no | — | 1357 |
| 7 | `#3a4520` | dead brush | tree-dead | dry brush and tumbleweed standing waist high in the infield | prop | yes | — | 508 |
| 8 | `#7a7266` | sound wall | structure | the block sound wall around the outside of the whole structure | structure | yes | — | 399 |
| 9 | `#8f8676` | high-mast light | prop | a high-mast light tower over the junction, every head dark | prop | yes | — | 3 |
| 10 | `#55555f` | dead car | vehicle | a car stopped in the queue that never moved again, doors open | prop | yes | — | 408 |
| 11 | `#4a4a54` | dead semi | vehicle | a semi stopped nose to tail on the ramp, trailer stripped | prop | yes | — | 192 |
| 12 | `#5c5c66` | deck | overhead | the upper roadway on its structure — you drive and walk UNDER it | overhead | no | — | 6701 |
| 13 | `#6f6a5e` | pier | structure | a concrete pier carrying the deck, tagged as high as anybody could reach | structure | yes | — | 171 |
| 14 | `#6a6a72` | sign gantry | overhead | overhead sign gantry, panels gone or hanging | overhead | no | — | 88 |
| 15 | `#4a4842` | rubble / debris | prop | blown tyre, bumper, glass and drift across the lanes | prop | no | — | 579 |
| 16 | `#38383f` | ramp lane | drive | a two-lane connector ramp curving away from the mainline | ground | no | — | 8 |
| 17 | `#42424a` | ramp shoulder | drive | the narrow shoulder of a connector ramp, nowhere to go if you stop | ground | no | — | 24 |
| 18 | `#a8a08c` | gore marking | marking | the painted gore where the ramp splits off, chevrons worn to ghosts | ground | no | — | 56 |
| 19 | `#4f4b3e` | retention basin | ground | the drainage basin the whole structure sheds into, dry and cracked | ground | no | — | 702 |
| 20 | `#6e6552` | maintenance track | drive | the dirt track the crews used to reach the basin and the pier bases | ground | no | — | 797 |

**Gate:** `gates/interchange_gate.js` (+ the street-aware/drivable law via `gates/district_kit_gate.js`), the walkable-land law via `gates/walkable_gate.js`, and this dossier via `gates/tilespec_gate.js`.
**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.
