# BOHEMIA ADDENDUM: LAS VEGAS VALLEY GEOGRAPHY (top-down) 7/4/26
Paolo's orientation + researched real geography. The overmap must READ as Vegas
from above, and the STREETS are the priority. Grounded in real road/landform data.

## PAOLO'S ORIENTATION (LOCKED 7/4/26)
Top-down / birdseye valley. Cardinal anchors:
- EAST + WEST borders = MOUNTAINS (the valley rim ranges).
- SOUTH = the way to HOOVER DAM (and Lake Mead).
- NORTH border = the SOLAR GRID panel field.
(This is Bohemia's framing; real Vegas has the dam SE and solar fields scattered,
but Paolo's cardinal layout is the game's authored truth. Locked.)

## REAL VEGAS ROAD STRUCTURE (researched, the skeleton to author)
Vegas reads as a big "C" with an "X" cutting through it:
- THE "C" = the 215 BELTWAY. Wraps the OUTER edge of the valley (west, south, north
  arcs). Mostly free-flowing ring road hugging the inner base of the mountains.
- THE "X" = two freeways crossing near downtown (the "Spaghetti Bowl"):
  - I-15: runs SOUTHWEST -> NORTHEAST (from California up toward Utah). Parallels
    the Strip on its west side.
  - US-95 / I-515: cuts SOUTHEAST -> NORTHWEST through the heart of the city.
  - They cross just north of downtown = the Spaghetti Bowl interchange.
- THE STRIP = Las Vegas Blvd, runs NORTH-SOUTH, ~4 miles, just EAST of and parallel
  to I-15. The mega-resorts line it. Downtown (Fremont) sits at its north end.
- SURFACE STREETS = a near-perfect MILE GRID under the freeways. Major arterials
  every ~1 mile:
  - E-W arterials (south to north): Blue Diamond, Windmill, Silverado, Sunset,
    Russell, Tropicana, Flamingo, Sahara, Charleston, Washington, Lake Mead,
    Cheyenne, Craig, Centennial.
  - N-S arterials (west to east): Durango, Rainbow, Decatur, Valley View, Rancho,
    Las Vegas Blvd (Strip), Eastern, Pecos, Nellis.
  So the base texture is a clean mile grid; the freeways (C + X) and the Strip are
  the overlays that break and organize it.

## HOW THIS MAPS TO THE 96x96 OVERMAP (the authoring plan)
The fixed skeleton (bohemia_overmap.js) gets rebuilt to match:
- MOUNTAINS: thick ragged bands on the EAST and WEST edges (Paolo's rim). Thinner
  or open on N/S where the dam-road and solar sit.
- STRIP: a NORTH-SOUTH corridor, straight (not diagonal), sitting a bit east of
  center, ~4-mile run, mega-resorts (5x5 fixed tiles) strung along it.
- DOWNTOWN: cluster at the NORTH end of the Strip.
- THE "X" FREEWAYS: I-15 as a SW-NE diagonal just west of the Strip; US-95 as a
  SE-NW diagonal through the middle; crossing north of downtown.
- THE "C" BELTWAY: a ring arc hugging the inner edge of the mountain rim.
- SOLAR GRID: the NORTH border band (Paolo's call).
- DAM + LAKE: the SOUTH edge / exit (Paolo's call), water pooling SE-ish.
- MILE GRID: the procedural districts fill on a regular arterial grid, streets
  every ~1 mile = every ~13 tiles (1 mile = 1609m / 180m per tile ≈ 9 tiles; use
  ~8-10 tile arterial spacing) so the surface reads as the Vegas grid, not noise.
[PENDING Paolo: exact mountain thickness E vs W, how literally to place named
arterials vs just "a mile grid," whether the C-beltway is drivable/relevant in-game
or just a read.]

## WHY STREETS MATTER (Paolo's priority, grounded)
The mile grid is Vegas's DNA, it is how the city is legible from above and how a
player navigates. Blocks between arterials are the neighborhoods (the drill-in
tiles). The freeways and Strip are the landmarks that orient you. Getting the grid
right is what makes the overmap read as VEGAS and not generic-city.

## STATUS
LOCKED: Paolo's cardinal orientation (E/W mountains, S dam, N solar); the real
C+X+Strip+mile-grid structure as the authoring target. Overmap skeleton to be
rebuilt to this. Exact arterial placement + mountain asymmetry PENDING Paolo.

## SEED-DRIVEN LAYOUT ROLLS (LOCKED 7/5/26, Paolo's calls)
The overmap layout now ROLLS per seed while the Strip stays sacred:
- I-15 = a CURVY L freeway: vertical leg with sine wiggle beside the Strip, bends
  at a seed-picked latitude, horizontal leg rolls east or west per seed. 2 wide.
- MOUNTAINS: the border pair can roll E/W <-> N/S per seed.
- SOLAR + DAM: flip to the perpendicular borders WITH the mountain axis (mountains
  E/W -> solar N + dam S; mountains N/S -> solar W + dam E).
- THE STRIP: ABSOLUTELY STAGNANT. Always N-S, always 2 wide, fixed length, downtown
  at its north head. Its side of center mirrors per seed [PENDING Paolo confirm the
  mirror, voice-to-text was ambiguous].
- RANDOM MID-BLOCK STREETS: per 9x9 arterial block, seed-hashed extra streets cut
  through (col, row, both, or none), so every reroll gets different local streets.
- INDUSTRIAL CLUSTERS: industrial rolls ONE cluster center per seed, well away from
  the Strip, ~75% industrial within radius 9. No more scatter across the whole town.
- Corner commercial + residential-grows-with-distance both retained.
Engine: bohemia_overmap.js rewritten (layoutFromSeed + skeleton(x,y,layout)).
15 tests green incl: strip stagnant on every seed, both mountain axes occur across
seeds, L has both legs, streets reshuffle per seed, industrial spread < 12.

## FREEWAY REALISM PASS (LOCKED 7/5/26, Paolo's calls)
- THE L NEVER CROSSES THE STRIP: its horizontal leg always rolls AWAY from the
  Strip side (geometry-guaranteed via bendDir = freeway side, plus an adjacency
  test: no freeway cell within 1 cell of any strip cell, enforced in the suite).
  No offramp through the Strip, ever.
- BELTWAY = ROUNDED RECTANGLE, not a circle: long straight runs + curved corners
  (rounded-rect SDF, R=10) with subtle organic wiggle and seeded per-side inset
  variation. Pulled IN from the borders (inset 13-16 tiles), leaving a desert gap
  between the ring and the mountain rim. Tests: ring cells never within 8 of a
  border (L legs excepted).

## INFRASTRUCTURE PASS (LOCKED 7/5/26, Paolo's calls)
- TWO SMALL INDUSTRIAL CLUSTERS, not one big: opposite-ish sides of the valley,
  both away from the Strip, radius ~5.5, seeded positions. Tested: each cluster
  populated + tight (mean spread < 7).
- THREE EXIT HIGHWAYS out of town, matching real Vegas: NE (I-15 north), SW
  (I-15 south), S (95 toward the dam). Generated as 2-wide freeway segments from
  the beltway ring out to the map edge, seeded endpoint jitter, carving passes
  through the rim. Tested: all three reach their edges on every seed.
- AIRPORTS (procedural, seeded jitter):
  - HARRY REID INTL: 5x4 tiles at the VERY SOUTH END OF THE STRIP, adjacent to it.
  - Small airport SE (Henderson-equivalent), 2x2.
  - Small airport NW (North Las Vegas-equivalent), 2x2.
  Rendered as gray pads with runway stripe + tower in the city view.
Census now carries 'airport'. 20 tests green.

## INFRASTRUCTURE PASS 3 (LOCKED 7/5/26, Paolo's calls)
- INDUSTRIAL clusters HALVED: two tiny clusters (radius ~2.8, ~28 tiles total).
- AIRPORTS reshaped WIDER THAN TALL (real runway read): Harry Reid 8x4 at the
  Strip's south end; small SE + NW airfields 4x2. Tested wider>taller.
- CAMPUSES: UNLV 3x2 placed central (just east of the Strip, seeded jitter);
  CSN 2x2 placed anywhere buildable (seeded). District 'campus'.
- AIR BASE (Nellis-equivalent): 9x6 near a SEEDED CORNER (any of 4), bigger than
  HRI. Real Nellis is ~4x Harry Reid's land (11,300 vs 2,800 acres); game-scaled.
  District 'airbase', long-runway render.
- MOUNTAIN PASSES: 2-3 two-wide highway passes cut through EACH mountain range,
  seeded positions. The rims are permeable now, not walls.
- RAIL: Union-Pacific-style line runs parallel to I-15 (offset outboard), full
  valley run, plus a 3x2 RAIL YARD near industrial cluster 1. Districts
  'rail'/'railyard'.
- STORM TUNNELS: generated as an underground polyline network (3 lines from
  city points), every line EXITS at the dam / Lake Mead edge. Stored in
  layout.tunnels; not surface-rendered (underground). Render + gameplay hookup
  later. Tested: all exits reach the dam/lake edge on every seed.
- FOOTHILL DEVELOPMENT: 1-2 notches per mountain range where the rim thins and
  the city creeps up the mountainside. [PENDING Paolo: confirm this is what
  "Las Vegas incorporated into the mountainside" meant.]
27 tests green.

## INFRASTRUCTURE PASS 4 (LOCKED 7/5/26, Paolo's calls)
- STRIP BUFFER: 2 RESORT cells flank the strip street on BOTH sides for its full
  run. Dedicated strip architecture zone. District 'resort', tall gold towers.
- FASHION SHOW MALL: 3x2 'mall' district ON the strip (west buffer side), north
  of the run's center (real position: just north of Caesars).
- I-15 TRUE BORDER-TO-BORDER: starts at one map border, carves through the rim,
  bends (curvy L), ends at another border. Checked before mountains so it cuts
  passes like a real interstate. Tested at both borders on every seed.
- MOUNTAIN PASSES: 2-4 TOTAL across BOTH ranges combined (not per side), seeded
  split between the rims.
- LAKE LAS VEGAS WATER SYSTEM (clustered, that's how the water works): Lake Las
  Vegas (4x4 water) carved INTO the rim -> Boulder City ('town', 3x3) beside it ->
  Hoover Dam (2x2) -> Lake Mead water at the border. Non-flipped seeds: east rim;
  flipped: south rim. Cluster proximity tested. Supersedes the old south-center dam.
- DENSE SUB-BLOCK STREETS: every 9x9 arterial block gets one seeded column split
  (4 or 5) plus two row splits, so the LARGEST building blob is ~4x2/4x3 (flood-
  fill tested max <= 12 cells). No more streetless land blobs.
- COMMERCIAL MUST TOUCH A STREET: post-pass flips any road-less commercial to
  suburb. No commercial in the middle of residential blobs, ever. Tested.
- MONORAIL: elevated polyline weaving the strip's east side, stored in
  layout.monorail, rendered as an elevated line with pylons (a layer above).
34 tests green. UNLV placement dodges the I-15 bend so the freeway never slices
the campus.

## INFRASTRUCTURE PASS 5 (LOCKED 7/5/26, Paolo's calls)
- WATER SYSTEM POSITION CORRECTED: Lake Las Vegas + Boulder City + Hoover Dam +
  Lake Mead cluster sits on the SOLAR-OPPOSITE border AT A CORNER where that
  border meets the mountain rim (not mid-rim). Non-flip: solar N -> cluster at a
  south corner; flip: solar W -> cluster at an east corner. The corner is chosen
  to NEVER share the I-15 target corner. Highways dead-end INTO the cluster
  (US-93 really ends at the dam), because the cluster claims ground before roads.
- NELLIS QUADRANT LAW: the air base NEVER spawns in the same map quadrant as ANY
  airport (HRI, SE field, NW field). Corner retry until clear. Tested.
- HRI + DOWNTOWN EAST BIAS: both sit a little EAST of the strip line, still
  touching it (real Vegas). HRI has a 3-4 cell BUFFER below the strip's south end
  before the airport starts. Tested.
- I-15 INCORPORATED INTO THE FREEWAY SYSTEM: enters at the top border, curvy
  vertical leg, bends, then SHOOTS A DIAGONAL to the OPPOSITE CORNER border
  (crossing the beltway ring, one continuous system). Tested at entry border and
  exit corner.
- PARKS GROUNDED: Clark County alone runs 100+ public parks and it is one of
  four systems in the valley (County, City, North LV, Henderson), ~300+ valley-
  wide; scaled to our half-valley slice = ~150-250 park cells, which the 5%
  procedural roll already delivers (~190). PLUS two named 2x2 big parks:
  SUNSET PARK (east of HRI, real position) and CRAIG RANCH (north). Tested.
- Blob law refined: parks are green space, not buildings; the max-4x2 building
  blob rule counts suburb/commercial/industrial only.
38 tests green.

## I-15 SPINE LAW + MIRROR LOCKED (7/5/26, Paolo's calls)
- I-15 = THE CENTRAL SPINE of the freeway system. It ORIGINATES at the SOUTH
  border, runs PARALLEL to Las Vegas Blvd (gap ~5 cells) for the whole map, and
  at the NORTH end (past where the strip ends) takes its direction and EXITS the
  opposite border. No mid-map bends, no corner shoots. Tested: freeway at the
  south border near the spine AND at the north border at the exit point.
- THE MIRROR, LOCKED: the I-15 spine is effectively the center; the EAST and
  WEST sides of town FLIP around it per seed. The strip always rides beside the
  spine; UNLV, the medical cluster, and the rest of the town geography flip
  sides together (real Vegas: I-15 west, UNLV east; mirrored seeds reverse it).
- THE BLVD TOUCHES THE AIRPORT: the 2-wide strip STREET continues south past the
  resort run (buffer of city between resort end and airport stands) and runs
  alongside HRI, whose west edge TOUCHES the street. Tested per seed.
- LAS VEGAS WASH: continuous dry channel generated from mid-city to Lake Las
  Vegas (same side of town as the water cluster), district 'wash'. Tested it
  terminates at the lake.
- TINY MEDICAL CLUSTER: 2x2 'medical' near downtown / the strip's north (its
  historic position), flips sides with the town.
- KEY UI: the city view has a 🔑 KEY button toggling a legend panel listing every
  district color and what it represents.
41 tests green.

## NEIGHBORHOOD QUALITY MAP + WASH LORE (LOCKED 7/5/26, Paolo's calls)
- QUALITY FIELD: every tile carries quality 0..1, mirror-aware (flips with the
  town around the I-15 spine). Grounded in real Vegas (searched): the east side
  is the rough part and it reaches into the north; Summerlin (far west, master-
  planned against Red Rock) and Henderson (south) are the good parts; where the
  east side meets Henderson (southeast) it TRANSITIONS from rough to good; most
  of town is decent; the west fringe near the residential borders runs busier
  (commercial bias up). Tested: east avg < 0.45, Summerlin > 0.75, Henderson > 0.7.
- QUALITY DRIVES GENERATION: parks scale with quality; rough side rolls vacant
  desert lots; busier fringe rolls extra commercial. Quality will drive the
  drill-in building tier (ruin/patched/rebuilt density) later.
- QUALITY IS VISIBLE: suburb roofs tint from worn brown (rough) to bright red
  (good); ground from dusty to green. Readable at a glance on the city view.
- SUMMERLIN LAKES: the west master-planned zone procedurally rolls small
  neighborhood lakes (real refs: The Lakes, Desert Shores). Tested.
- WASH, CORRECTED + LORE LOCKED: the wash is BROKEN UP by the surface streets
  crossing it (streets win at crossings, the channel runs beneath/between). You
  can hop down into it, and it is THE SURFACE ENTRANCE to the storm/sewer tunnel
  system underneath the city WHERE THE HOMELESS LIVE. The tunnel network's entry
  points now sit ON the wash. Tested: streets cross the wash; tunnels start at it.
- FASHION SHOW MALL, FIXED: now directly ON the strip touching the street (real
  position north of Caesars), flips sides with the town mirror, renders hot pink
  and tall so it never disappears again. Tested adjacency to the street.
- RAIL RENDER: rail was reading as a second freeway (Paolo mistook it for the
  15). Now renders as track with cross ties, and the KEY labels it "NOT a
  freeway". The 15 itself was confirmed correct.
46 tests green.

## 90-DEGREE STREET LAW + STRIP CROSSINGS (LOCKED 7/5/26, Paolo's calls)
- STREETS ARE 90 DEGREES, ALWAYS. Arterials, sub-block streets, and the strip
  never run diagonal. Only FREEWAYS may angle (the I-15 offshoot, the three
  exits). This is a hard generator law with a suite test (no isolated diagonal
  arterial stubs can exist).
- CROSS STREETS RUN THROUGH THE STRIP: the resort wall OPENS at every mile
  crossing (Flamingo/Tropicana style). E-W arterials cut through the strip
  corridor; the boulevard cell at the crossing is an intersection. Tested: at
  least 2 crossings pierce the corridor on every seed.
- FREEWAY RIBBONS: because freeways are the only angled roads, they render as
  smooth continuous dark ribbons with dashed centerlines OVER the cell grid
  (spine, north offshoot, three exits) in both the city view and the traverse
  proof, so diagonals read as highway, never as staircase blocks.
- KEY added to the traverse proof (same legend as the city view, plus cargo,
  plane, and the marker).
48 overmap tests green, 4 traverse headless checks green.

## ABSOLUTE 90-DEGREE LAW (LOCKED 7/5/26, supersedes the freeway exception)
NOTHING runs diagonal. Not streets, not freeways, not anything. The freeway
exception from earlier today is REVOKED. Everything is blocks:
- I-15 = a SQUARE L: dead-straight vertical spine (wiggle deleted) from the
  south border to the north bend, one 90-degree turn, straight horizontal run
  out the side border. Border to border, all axis-aligned.
- BELTWAY = a RECTANGLE ring, square corners, 2 wide, per-side inset variation
  kept, wiggle and rounded corners deleted. It is district 'freeway'.
- EXIT HIGHWAYS = straight VERTICAL 2-wide stubs (NE out the top, SW and S out
  the bottom).
- WASH = axis-aligned channel legs (real Vegas washes are engineered straight
  concrete runs), nudged off arterial lines so streets cross it instead of
  eating it. MONORAIL straightened.
- FREEWAY RIBBON overlays DELETED from both views (they existed for diagonals).
- Suite test: no freeway cell may sit diagonal-only. 49 tests green.

## SPARSE SECONDARY STREETS (LOCKED 7/5/26, supersedes the max-4x2 blob law)
Building parts of town must read DECENTLY LARGE. Secondary streets are now
sparse: ~35% of mile blocks get none, ~60% get ONE split (col or row), ~5% get
both, and about half the splits DEAD-END mid-block (they do not run through).
Max building blob raised from 12 to one full block interior (suite cap 70;
measured ~61). Arterial count dropped from ~3200 to ~1800 cells, matching the
real ratio of arterials to surface streets at this scale.

## SPAGHETTI BOWL + GRADE SEPARATION (LOCKED 7/5/26, Paolo's calls)
- THE SPAGHETTI BOWL: the interchange centerpiece where the freeways exchange.
  Grounded: the real bowl is the I-15 / US-95 (now I-11) / US-93 system
  interchange just northwest of downtown, 300,000+ vehicles/day, first built
  1968, rebuilt 1999-2000, named for its tangle of ramps. In Bohemia it sits AT
  the I-15 L's corner (which lands just north of downtown, its real position):
  a 4x4 'interchange' district knot the spine and horizontal leg feed into.
  Rendered as a dark base with loop-ramp rings. City-mode walkable.
- OVERPASS / UNDERPASS LAW: where an arterial line crosses a freeway, the
  crossing is GRADE-SEPARATED. Each crossing rolls 'over' (light deck across
  the freeway) or 'under' (dark notch) per seed hash, with the crossing
  direction stored. Surface streets are never severed by freeways; they
  continue over or under. Tested: both kinds exist on every seed.
- HYBRID NEIGHBORHOODS: building cells pressed against a freeway or the bowl
  carry a hybrid flag (a surface street's block with the freeway through its
  middle). The drill-in will use the flag for sound walls, frontage lots, and
  the rougher-edge look. Tested: 20+ hybrid cells per seed.
- MODE TRANSITION v1 (killed the snap): switching city <-> human now plays a
  460ms seam: the current view punches its zoom in, a dark veil peaks at the
  swap, and the new view settles out of the zoom. Research direction filed:
  the end goal is a continuous-LOD zoom (Google-Earth style, the dual-
  projection seam made literal), with the slot's city-view art morphing into
  the human-mode scene; v1 is the scale-punch + crossfade stepping stone.
52 overmap tests green, 5 traverse headless checks green.

## FREEWAY REAL-ESTATE PASS (LOCKED 7/5/26, Paolo's calls)
- AIRBASE NEVER BREAKS A FREEWAY: Nellis placement now collision-checks against
  the I-15 spine, the horizontal leg, every exit stub, and the beltway
  rectangle. It sits fully INSIDE the ring, whole (all 54 cells), interrupting
  nothing. Corner + inset retried per seed until clean. Tested: zero freeway
  cells inside the base rect on every seed.
- PARALLEL SIDE-STREET LAW: no street runs alongside a freeway one cell over.
  That cell is VALUABLE FRONTAGE REAL ESTATE: parallel arterial cells beside
  freeways are removed and filled as hybrid frontage lots (buildings, sound-
  wall look via the hybrid flag). Perpendicular crossings (over/underpasses)
  are untouched. Tested: no arterial with a same-orientation freeway neighbor
  exists on any seed. Blob measure treats frontage ribbons as linear real
  estate, not landmass blobs.
- TRANSITION DIRECTION FIXED: leaving human mode now ZOOMS OUT (pulling up and
  away) before the veil, then the city settles from close to normal. Diving
  down still zooms in. The seam reads directional both ways.
54 overmap tests green, 4 traverse headless checks green.

## AMENITIES PASS (LOCKED 7/5/26, Paolo's batch, all searched + grounded)
- MOUNT CHARLESTON: 12x9 mountain massif ALWAYS in the corner OPPOSITE the dam
  cluster (real: Charleston NW, dam SE). Estates dot its inner face; grounded:
  Mt Charleston really has luxury custom homes. Bowl feel: rim base width up to
  5 with deeper bulges; foothill notches now generate ESTATE ground (grounded:
  The Ridges 793ac vs Red Rock; MacDonald Highlands 1,320ac + Seven Hills
  1,300ac in the Black Mountain foothills; millionaires live on the rims).
- GOLF: valley runs 50+ courses (42 18-hole + 8 nine-hole), Summerlin west +
  Henderson southeast weighted, Bali Hai on the Blvd. Scaled: ~9 courses of
  3x2 to 4x3 cells, same weighting, one on the strip. Tested.
- GATED COMMUNITIES: ~6 guard-gated 3x3 communities, foothill-weighted west +
  SE, plus Southern Highlands by the 15 south (its real spot). Placed in good-
  quality ground (tested avg > 0.55). Walled render.
- SCHOOLS: ~9-14 one-block schools on a jittered lattice, never on street
  lines (nudged into blocks). High schools + magnets. Tested.
- CONVENTION CENTER: 3x2 extending off the strip's east side below downtown.
- ALLEGIANT STADIUM: 2x2 across the spine from the strip's south end (real
  position vs Mandalay), by the freeway. SPEEDWAY (LVMS / EDC): 4x3 directly
  beside Nellis (real position). Both tested.
- OFF-STRIP LOCALS CASINOS: exactly 5 (Red Rock W, Green Valley Ranch SE,
  Aliante N, the M far S beside the 15 with a freeway-column dodge, Durango
  SW). Purple prism render. Tested count === 5.
- WATERPARKS: two, one beside a freeway, one not. MINI GRAND PRIX: one, by the
  freeway. (Real Vegas.) Tested.
- PARKS TOUCH STREET LAW: any park cell with no street contact flips to
  housing; the two big named parks are snapped beside arterials and exempt as
  units. Tested: every park touches a street on every seed.
- COMPLEX LAW: interior housing with no street contact flags t.complex and
  renders as APARTMENT/CONDO prisms. Cul-de-sac street fabric is drill-in
  scale, filed for stage 3. Tested: 50+ complex cells per seed.
- FREEWAY WALLS: freeways render sound-wall ticks (except at crossings). The
  walls are the flat-map stand-in for topography: you cannot step off a
  freeway into someone's yard; over/underpasses are the only crossings, which
  the walls now visually explain.
- CA HIGHWAY APPROACH: the south corridor along the spine beyond the beltway
  is ~75% dirt: the 15 enters Vegas through desert before the city swallows
  it, like the real drive in from California. Tested > 50% dirt.
- UNLV: expanded to 4x3 (housing, halls, parking, Thomas & Mack), opposite
  side of the strip from the spine.
62 overmap tests green. Movers law in its own addendum.

## COLLECTOR LAW (LOCKED 7/5/26, supersedes sparse-secondary weights)
Grounded: the Las Vegas Valley address grid runs ~10 blocks per mile, and
standard planning practice puts combined arterial + collector spacing at half
a mile. So EVERY mile block gets a full collector cut BOTH ways (quarters of
~4x4), 40% roll an EXTRA local street, and only the extras may dead-end
mid-block. Max building blob capped at 24 in the suite (measured 16). No
giant interior masses; the character dead-ends stay.
Supporting structural fixes locked with it: ALL freeway geometry snaps
MID-BLOCK (bend row to %9=2, exits and beltway rectangle edges to %9=4 lanes)
so a mile arterial can never sit adjacent-parallel to a freeway by
construction; mile arterials always punch through at freeways (grade-
separated, like MLK riding the real Spaghetti Bowl) while collector/side
streets never parallel a freeway (the frontage law); the CA approach corridor
runs ~93% dirt rolls; industrial cluster cores fattened so street cuts cannot
starve them. 62 tests green, max blob 16.

## FREEWAY WIDTH LAW (LOCKED 7/5/26, Paolo's call)
NO freeway is ever wider than 2 cells. The 3-wide reads came from two seam
bugs, both killed structurally:
- Exit stubs snapping one column off the spine or a ring vertical made a
  3-wide union. Now any exit within 2 columns of the spine or a ring edge
  COINCIDES exactly (rides the same 2 columns).
- The I-15 horizontal leg could land flush against the beltway's top band
  making a 4-wide mass. The bend row is now fixed at 20 (mid-block), clearing
  the ring top by 5 rows.
Suite test locked: no freeway cell surrounded by freeway on all four sides
outside known junction squares (ring corners, spine/leg/exit crossings, the
bowl). Fat freeways can never ship again. 63 tests green.

## FREEWAY CONNECTIVITY LAW + 1-WIDE PASSES (LOCKED 7/5/26, Paolo's calls)
- EVERY FREEWAY CONNECTS TO THE SYSTEM. No floating segments, ever. Three
  structural guarantees: (1) mountain passes now run from the border INWARD all
  the way to the beltway ring, so they join the system instead of dying in the
  suburb fabric; (2) the beltway ring claims ground BEFORE amenity rects (a
  gated community or golf course can never sever it again); (3) a post-pass
  BFS sweep from the spine returns any severed stub (e.g. an exit tail cut by
  the water cluster) to desert. Suite test: BFS from the spine must reach
  every freeway cell on every seed.
- PASSES ARE 1 WIDE: border highways through the mountains are two-lane
  mountain roads, not interstates. Exit termination law refined: an exit ends
  at the border OR dead-ends into the water cluster (US-93 really terminates
  at the dam). Tested.
64 tests green.

## INTERACTIVE KEY FILTERS (LOCKED 7/5/26, Paolo's call, ALPHA-GRADE)
The KEY is no longer a legend, it is a LAYER TOOL. Tap any row to isolate that
layer: matching cells render full, everything else dims to 15% opacity.
Multi-select stacks (e.g. FREEWAY + ARTERIAL shows the whole road network
alone). CLEAR FILTERS resets. Active rows highlight. Rows carry district
predicates including the split ones: SUBURB good vs rough filter by the
quality field, OVERPASS vs UNDERPASS filter by crossing type. Legend-only rows
(cargo, plane, the marker) do not toggle. Shipped in BOTH the city view and
the traverse proof, headless-tested (isolation, quality split, crossing split,
no-filter passthrough).
ALPHA 0.9 NOTE: this view + key + filter system is built alpha-grade and is
the intended CITY TAB when the overmap merges into BOHEMIA_ALPHA_0_9.html
(merge is a queued build task, not yet done). The filter mechanism is also the
seed of the in-game city-management overlay (zoning/utility views later reuse
the same isolate-layer pattern).

## AMENITIES PASS 2 (LOCKED 7/5/26, Paolo's batch)
- NELLIS CORNER LAW: the air base + speedway sit on the SAME side of town as
  the dam cluster, at the OPPOSITE border end (dam SE -> Nellis NE; dam SW ->
  Nellis NW; real geography). Corner fixed by seed geometry, insets retried
  until it clears every freeway. The small north airport mirrors to the other
  top corner so the no-shared-quadrant rule holds. Tested.
- DESERT CORRIDOR: the Nellis -> speedway -> dam/Boulder side of town runs
  through concentrated dirt (30% corridor rolls in the border band, 45% within
  reach of the base, speedway, Boulder City, and the dam, so the dam and
  Boulder sit IN desert). The even city-wide desert spread SHRUNK (10% -> 5%
  outer-ring rolls). Tested: the dam side band is dirtier than the opposite.
- SPAGHETTI BOWL 3-FREEWAY LAW: the cross-town freeway (US-95) runs BOTH
  directions through the bowl, border to border, so the bowl always touches
  at least THREE freeways (spine below + both leg directions), like the real
  interchange. Tested.
- RAIL BORDER LAW: the rail line runs border to border, carving the rim like
  the real UP line ("otherwise what's the point"). Tested at y=0 and y=95.
- GOLF DECAY LAW: 15 years post-crash, exactly ONE golf course is still
  operational; every other course is a BMX / dirt-rider park (dirt oval
  render). KEY splits GOLF (operational) vs BMX PARK, filterable. Tested.
69 overmap tests green, 4 traverse checks green.

## BOWL 4-SIDE LAW (LOCKED 7/5/26)
The spine's corridor continues NORTH of the bowl to the beltway ring (the
US-93/515 reality), so the Spaghetti Bowl touches freeways on ALL FOUR sides:
spine below, north spur above, cross-town leg both directions. Suite test
demands 4 sides on every seed. 69 tests green.

## NELLIS HUGS THE MOUNTAINS (LOCKED 7/5/26, Paolo's call)
The air base + speedway moved OUTSIDE the beltway, pressed against the rim
(real: Nellis backs Sunrise Mountain, LVMS sits out by the range). The base
claims ground first so the mountain edge wraps around it; exit highways now
dodge the base by shifting a full block toward center (snap preserved) instead
of the base dodging them. Corner still fixed by the Nellis corner law (same
side as the dam, opposite end). Suite test: the base rect must sit within 2
cells of mountain ground on every seed. 70 tests green.

## THE FULL STRUCTURES BATCH (LOCKED 7/5/26, Paolo approved ALL 22 + adds)
Every proposal from both lists is IN, procedurally generated in its grounded
position, rendered, keyed, filterable, and tested:
- INFRASTRUCTURE: water reclamation ON the wash (the 99% loop made physical),
  Apex landfill north along the spine, the Lake Mead intake straw on the
  shore, 3 substations (solar grid nodes), cemetery, desert prison opposite
  Nellis (pass-row dodge), Brightline terminal beside the rail at the strip's
  south end.
- STRUCTURES: THE SPHERE east of the strip mid-run; the LAS VEGAS BLVD NORTH
  CLUSTER exactly like real life (Cashman Field + Neon Boneyard + Old Mormon
  Fort generate together north of downtown); 3 wedding chapels on the
  corridor (buffer law now accepts strip attractions as strip architecture,
  the real Linq wheel lives in that flank); Las Vegas Ballpark in Summerlin
  (BALLPARK district covers Cashman too, Paolo's add); 2 flood detention
  basins feeding the wash (spine-dodged); swap meet north; drive-in; HIGH
  ROLLER on the strip flank.
- FABRIC: TRAILER PARKS roll procedurally in rough-quality ground;
  SELF-STORAGE rolls near arterials in mid/low quality.
- FLAGS: FREMONT CANOPY strip across mid-downtown; CHINATOWN corridor on a
  west arterial (Spring Mountain); ANTENNA FARM on the rim peaks; INDUSTRIAL
  ROAD corridor flag near the rail; SPORT PARK TYPES (Paolo's add): park
  cells roll soccer / baseball / football / plain, rendered as field marks.
- ORDER LAW: infrastructure rects claim before leisure rects. All 1x1 pieces
  nudge off street lines. Basins and casinos dodge freeway columns.
72 overmap tests green (batch census + flags tests included), 5 headless.

## POCKETS + DRIVE-IN + KEY COVERAGE (LOCKED 7/5/26, Paolo's batch)
- DESERT POCKETS: the border band is dead. Desert concentrates in TWO distinct
  pockets: around the whole water cluster (Mead, Lake LV, Boulder City, dam,
  60% rolls within 6) and around Nellis + speedway (55% within 5), with normal
  city fabric between them. Tested: both pockets 2x+ dirtier than the core.
- DRIVE-IN LAW: the drive-in always touches an airport that is NOT Harry Reid
  (real: West Wind sits by North Las Vegas Airport). It generates beside the
  small north airport's runway; that airport is now clamped between the ring
  band and the cross-town leg. Tested.
- KEY COVERAGE GUARANTEE: the flags that had no key rows now have them
  (FREMONT CANOPY, CHINATOWN, ANTENNA FARM, INDUSTRIAL RD CORRIDOR, SPORT
  PARKS) with working filter predicates, and a headless coverage test asserts
  EVERY togglable key row matches at least one cell on the map, both views,
  multiple seeds. Nothing in the key can ever be missing from the map again.
74 overmap tests green, key coverage 4/4.

## CANOPY FIX + CEMETERY LAW + UNDERGROUND THIRD LAYER (LOCKED 7/5/26)
- FREMONT CANOPY: exactly TWO adjacent downtown cells, straight, never an L
  (headless-tested: count===2, same row, adjacent columns).
- CEMETERY LAW: the big cemetery WELDS to Sunset Park's east edge (real: Palm
  Eastern sits by Sunset Park). One more small cemetery at the north cluster
  (real: Woodlawn, 1914, near Cashman). Both generate and are tested.
- UNDERGROUND THIRD LAYER (the big one): om.under = {storm, sewer, loop},
  all 90-degree (street law holds underground):
  * STORM TUNNELS: the wash system the Homeless live in. Trunks run from
    under the strip and under downtown to the wash head; every detention
    basin ties in. (Real: 600+ miles of flood tunnels under Vegas.)
  * SEWERS: a grid under every other mile arterial, every line L-pathed to
    the WATER RECLAMATION PLANT. The 99% loop is now literally drawn: every
    drop flows to the plant on the wash.
  * BORING LOOP: bored car tunnels from the convention center down the
    resort corridor to the airport, one spur to downtown (real: the LVCC
    loop growing across the corridor). Distinct from the storm tunnels.
  City view has an UNDER toggle: dim surface for orientation, rock-dark
  tunnel cells, three color-coded systems (storm amber, sewer green, loop
  cyan), KEY legend rows added. Suite-tested: all three networks generate
  and anchor correctly (storm reaches wash + basins, sewer reaches the
  plant, loop spans convention to airport).
  [PENDING Paolo]: walking the tunnels in human mode (drill-in for the
  underground layer), and whether the Homeless storm-tunnel territory vs
  Network-adjacent Boring loop distinction becomes faction canon.
75 overmap tests green, 5 layer headless checks green.

## UNDERGROUND REALISM VERIFIED + WATER SYSTEM STAPLES (LOCKED 7/5/26)
Paolo asked whether the underground matches real Las Vegas. Verified hard:
- The real valley is a bowl with ONE outlet, the Las Vegas Wash, everything
  drains east to Mead. Our storm topology already matched. Better: the REAL
  flood channels turn at near-90-degree angles through culverts, so the
  90-DEGREE LAW is literally how Clark County built it. ~650 miles of
  channels, ~100 detention basins up to 50 feet deep, begun late 70s.
- REALISM FIXES SHIPPED: a WEST STORM COLLECTOR added (real runoff races off
  the west/north rims into the valley). The Boring loop gained its real
  confirmed spurs: Spring Mountain / CHINATOWN corridor (confirmed March
  2026), MEDICAL DISTRICT, and ALLEGIANT stadium stop. (Real Loop status:
  11 stations running, 68 miles / 104 stations approved.)
- NEW WATER SYSTEM STAPLES (research: the deepest infrastructure story in
  Vegas): Intake 3 was bored UNDER Lake Mead and works below dead pool; the
  Low Lake Level Pumping Station runs the world's deepest submersible pumps
  down 500ft shafts; treated water crosses a 3.78-mile tunnel bored THROUGH
  the River Mountains; 55 pump stations push water UPHILL to tanks, gravity
  brings it down. SHIPPED: WATER TREATMENT plant at the lake (cluster +
  ring dodging), 3 RESERVOIR TANKS on the foothills, a PUMPING STATION
  inland, and the AQUEDUCT as the FOURTH underground system: intake ->
  treatment -> through the rim -> pump -> every reservoir, rendered dark
  blue in the UNDER view. All suite-tested, coverage green.
76 overmap tests green, key coverage 4/4.

## 200-SEED HARDENING (LOCKED 7/5/26)
Full stress sweep: every district on every seed, width law, connectivity,
underground. Two structural laws came out of it:
- PASS PARALLEL LAW: a mountain pass never runs alongside another freeway
  (the union read 3 wide on flip seeds); passes shift clear of the spine,
  the leg, and every exit column.
- GENERIC CLEAR-SPOT NUDGER (FACTORY LAW): all ad-hoc placement dodges
  replaced by ONE mechanism: forbidden geometry (freeway lines, rail, solar,
  ring, every placed rect) + spiral search. Intake claims the shore before
  the water cluster. 200/200 seeds generate complete. 76 tests green.

## FOOD OVER BMX (LOCKED 7/5/26, Paolo's call) + CLOCK UPDATE
Every dead golf course is PLOWED: FARM district, crop-strip render following
the old fairway ghosts, one course still operational golf. Supersedes the
BMX conversion. GRAVEYARD POST-MORTEM: the BMX render was correct work and
approved, but the grass-to-food math proved dead courses are the valley's
only ready farmland (irrigation already installed), and Paolo chose calories
over culture. It hurt, and the hurt is canon material.
[PENDING: does the LAST course get plowed too, or does someone powerful keep
the only golf course left in America.]
[PENDING: do the parks convert to farms on the map as well, or split
commons-parks vs food-parks.]
CLOCK: Paolo states game start is ALMOST 10 YEARS post-crash (supersedes the
15-year figure in the earlier priority addendum).
76 tests green, farms live in both views, coverage green.

## ICONS + RED ROCK (LOCKED 7/5/26) + CLOCK CANON
WELCOME TO FABULOUS LAS VEGAS sign placed south of the strip end; THE STRAT
needle placed between downtown and the strip (both 200-seed stress clean,
keyed, filterable). RED ROCK: the west wall (north wall on flip seeds) is
red sandstone, tinted render, own filter row. Luxor pyramid held [PENDING,
signature look is Paolo's call]. CLOCK CANON: the start-date number serves
the ARC (collapse, hell years, first stability), roughly a decade; 10 vs 15
is tuning. CORPSE COLLECTION: LOCKED as a natural in-game system; which of
the four fertilizer stories is true remains pending.

## STRAT LAW + RED ROCK SEGMENT + HOMESTEADS (LOCKED 7/5/26, Paolo's calls)
- STRAT POSITION LAW: the needle sits on the strip's border, the FIRST block
  of the arts district past the grid street, closest downtown cell to the
  strip (y snaps to gridline+1 at the 0.30N border, beside the Blvd). Tested.
- RED ROCK is PART of the west wall, not all of it: a seeded sandstone band
  roughly a third of the rim, west-southwest like the real one. Tested: red
  cells AND plain rim cells must both exist.
- HOMESTEADS: neighborhood-scale self-sufficiency is now on the map. ~4% of
  suburb cells (weighted to the middle-quality fabric: means enough for a
  well, outside faction cores) carry yard crops + a private water dot.
  Grounded: the valley sits on real groundwater, the water district runs
  66+ wells, thousands of private wells exist. Bottom-up survival is
  visible next to the top-down faction farms. Keyed + filterable.
79 tests green, 200-seed stress clean, coverage 4/4.

## HOMESTEAD TIERS (LOCKED 7/5/26, Paolo's correction)
Lone homestead = one family surviving by itself, not a faction target.
COMPOUND = a whole neighborhood or cul-de-sac organized together, THAT is
what factions notice. 3 compound blobs per map (2x2-3x2), spiral-placed on
guaranteed suburb ground, fence-ring render, KEY split into HOMESTEAD (one
family, surviving alone) vs COMPOUND (whole block organized, factions
notice) with separate filters. 80 tests green, 200-seed stress clean.

## THE DATA FORTRESS (LOCKED 7/5/26, Paolo's call)
The Switch-equivalent is ON THE MAP at real scale: 3x2 slots (speedway-class
footprint, matching the real Core Campus's eleven-building sprawl in the
southwest valley), placed inside the ring at the DIAGONAL CORNER FROM NELLIS
(real geography: Switch SW, Nellis NE), dodging every freeway line and every
placed rect (200-seed stress: whole on all seeds). Render: near-black
windowless slab with faint cyan vent lines, and at NIGHT IT HUMS: a cyan
glow in the night render while the city around it is dark. THE NETWORK'S
GROUND (Paolo: "probably where the Network is gonna be hanging out",
locked as the working canon).
[STILL PENDING, Paolo's alone: whether the Amalgamation itself physically
lives inside it, or somewhere else. Nothing about the Amalgamation moves
without him.]
81 tests green, coverage 4/4.

## THE ARSENAL (LOCKED 7/5/26, Paolo's call)
The range that houses tanks + helicopters is ON THE MAP: 1 slot (5 real
acres compresses below one slot at airport-compression scale), one block
off the strip on the rail side (real: behind Circus Circus). Fenced
compound render with a tank silhouette. 200-seed stress whole.
LORE (Paolo): the REMNANTS saw the Arsenal as super important. Contested
with the CARTEL, probable fight over it. [PENDING: the outcome of that
fight, who holds it at game start, what survived 10 years of it, and
whether the tank still runs.]
81 tests green.

## VERDICT PASS (LOCKED 7/5/26, Paolo's calls, full batch)
BUILT (all 200-seed stress clean, 84 tests green, keyed, both views):
- A/B/C/D CIVIC RUINS: 3 fire station ruins (arterial fabric), 2 police
  substation ruins, the JAIL downtown (CCDC), the COURTHOUSE 2x1 downtown,
  the mayor arc's physical seat.
- F WAREHOUSE DISTRICT 2x2 by the rail. G TRUCK STOP on the 15's south
  approach. H BATTERY FARM on the solar field's edge.
- I MATERIALS LEG: Sloan quarry (south by the 15) + Blue Diamond gypsum
  mine (southwest by the red wall), 1 block each per Paolo.
- J SPRINGS PRESERVE downtown-west, the meadows the city is named for.
- L FIBER BACKBONE: 5th underground system, thin line under the 15 from
  the CA border to the data fortress. The Enron fiber, the reason the
  fortress is where it is.
- M APEX SHELLS: half-built flavor flag on the landfill corridor cells.
- N LUXOR: gold pyramid on the strip south, NIGHT BEAM in the night render.
- W THE DEEP TUNNEL (Paolo's canon): a tunnel system from the data
  fortress goes DEEPER underground, connecting to the water reclamation
  plant. 6th underground system, magenta line, fortress to reclaim.
  Grounded both directions: the real fortress runs on 100% recycled water.
- R PARKS: only FAKE-GRASS parks stay recreational (the sport parks);
  every real-grass park is FOOD now. Farm census jumped to ~190 cells.

LOCKED CANON (Paolo's words):
- O HELICOPTERS: folded into the Arsenal, the civilian fleets are part of
  the gun-range-tank complex story, no separate rect.
- P FERTILIZER STORY: deferred deliberately, "whole story content we'll
  be ready for." The four versions stay on file.
- Q THE LAST GOLF COURSE: saved by a Karen community, remnants of the
  Remnants and Reds. The op course has owners now.
- S CURRENCY: NO casino chips. People care about resources: MEDICINE and
  ELECTRICITY. The economy is resource-denominated.
- T LAKE MEAD RISES post-crash. The bathtub ring shrinking is canon.
- U NOCTURNAL SUMMERS: leaning no, pending the explanation below.
- V THE SPLIT: most people DIED OR LEFT. Exact ratio still open.
- X THE ARSENAL: at game start the REMNANTS have it. The fight that got
  it there is quest material.
- E FUEL TANK FARM: skipped this pass, stays pending.
- K COUNTY EOC: explanation requested, not built.

## K. THE EOC (LOCKED 7/5/26, Paolo's call)
The EOC goes in as LORE, not a new rect: it is just the mayor's office in
the downtown civic block. The courthouse/civic 2x1 already on the map
contains the old emergency operations room, the back room where the
government worked the phones through the crash until the calls stopped.
When the player restores the civic block in the mayor arc, they inherit
that room, dead screens and all. No separate building, no new district.

## E. THE FUEL DEPOTS + THE EDUCATIONAL MISSION (LOCKED 7/5/26)
Paolo's E verdict: YES, renamed off "tank farm" (working name FUEL DEPOT,
final name pending his pick). Built as TWO terminals because reality has
two: the CalNev terminal by the rail north (real: 550 miles from LA, two
parallel pipes, 128k barrels/day, 90% of Southern Nevada's fuel, ends at
Nellis) and the UNEV terminal beside the landfill corridor (real: 400
miles from Salt Lake City, 60k barrels/day, ends AT APEX, in service since
2012). Paolo's east-pipe hunch was literally already true. Both pipes are
drawn in the UNDER view as under.pipes (7th underground system, dead-rust
lines from the SW and NE borders to the depots) so the player can SEE the
straws the city drank through. 85 tests green, 200-seed stress clean.

THE EDUCATIONAL MISSION (Paolo, canon, mission-level): Bohemia is meant to
be an educational experience that makes people reconsider how civilization
works, from the plumbing under the hotels to the toilets to the interstate
fuel pipes. The infrastructure IS the curriculum. The game never preaches
it; the map teaches it.

FUEL GEOGRAPHY CANON (grounded): America's oil is made in Texas (the
Permian, the biggest by far), and 55% of US refining sits on the Gulf
Coast, but THE WEST IS AN ISLAND: no product pipelines cross from the Gulf
to the Pacific states. Vegas's fuel world is LA's refineries (west pipe)
and Salt Lake's five small refineries (northeast pipe, next to Utah's own
crude). Post-crash, the most plausible surviving fuel source in the region
is small-scale Salt Lake refining, which makes the 15 NORTH the fuel
caravan road, priced to the highest bidder, exactly as Paolo guessed.
[PENDING: caravan story details, the depots' hell-years fate, final name.]

## LOGISTICS STATE (LOCKED 7/6/26, Paolo's call)
At game start logistics is BARELY, BARELY back up: internal city movement
works (bikes, carts, solar EVs, Loop cars), external trade is rare escorted
convoys on the 15 north to Salt Lake fuel, a convoy arrival is an event not
a schedule. Full teaching doc + restart sequence + pending game systems in
BOHEMIA_ADDENDUM_LOGISTICS_7_6_26.md. The guarantor/banker seat (who
vouches for trades without a dollar) is flagged as an unassigned
faction-defining power position [PENDING].

## THREE-CURRENCY SYSTEM + LIFE-SUPPORT TRIO (LOCKED 7/6/26, Paolo)
THE THREE CURRENCIES, canon: MEDICINE, ELECTRICITY, RESOURCES (food and
building materials as one bucket). USD is dead.
BUILT (86 tests green, 200-seed clean, keyed, both views): THE GRANARY
(dead grocery distribution center recommissioned by the rail north:
harvest storage + seed stock + cold rooms = the medicine vault), THE
LIBRARY (downtown, the analog memory, the counter-fortress), THE RADIO
STATION (downtown, the voice of the valley, the market's information
layer). Civ 5 audit result: every other Civ-critical building already
exists on the map or maps to one (market=swap meet, caravansary=truck
stop, monument=the sign, university=the campuses, recycling center=the
reclaim plant, arsenal=the Arsenal, courthouse/jail/police=the civic
ruins, aqueduct=the aqueduct). WALLS are a mechanic not a rect, flagged
for the city-builder act tiers [PENDING]. Proposal D pending: THE MACHINE
SHOP (the last place that can still cut steel, quest-grade, rail
corridor).

## ROBOTICS FACTORY + BUILDING SET CLOSED (LOCKED 7/6/26, Paolo)
Paolo's find: real Vegas has a robotics/machine-tool factory next to the
Henderson airport. BUILT: 1 cell beside apSE, machines that make machines,
absorbing the machine-shop role (proposal D closed by this). 86 tests
green, 200-seed clean, keyed both views.
FRAME LOCK (Paolo): the overmap building set is COMPLETE for procedural
generation and storyline purposes. No more building hunts, no 100+ type
sprawl. New buildings only enter by Paolo naming them or a storyline
demanding them.
[PENDING, Paolo's call: does the robotics factory tie to the Network and
the Amalgamation, or is it independent salvage ground.]

## ROBOTICS FACTORY ALLEGIANCE (LOCKED 7/6/26, Paolo)
The robotics factory is TIED TO THE NETWORK when the game begins. The
machines that make machines belong to the people who keep the Amalgamation
running. What the Network does there, and what rolls out of those doors,
is story content [PENDING].
