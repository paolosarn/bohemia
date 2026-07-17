# BOHEMIA
## Game Design Document — Version 5
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Compiled July 6, 2026 — Extends GDD v2 (lore foundation), GDD v3 (combat, endgame), GDD v4 (systems through 7/2)

## HOW TO READ THIS DOCUMENT
GDD v2 remains the lore foundation. GDD v3 remains the Dead Eye Dial combat core and endgame. GDD v4 remains the master reference for time/persistence, the fold, the character stack, and the engine laws through 7/2/26. THIS document folds in everything designed, researched, and built from 7/3/26 through 7/6/26: the grid brief, the complete Las Vegas overmap (86 tests, 200-seed hardened, frame-locked), the survival-economy accounting batch, the Factory Law, the Verdict Workflow, the combat resolution canon, the 120 BPM Request Law, the Valley Scale Law with the 128 neighborhood cell, the vehicle ladder, and the continuous streamed walk world shipped 7/6. LOCKED means build to it. [PENDING] means Paolo has not called it. Where a later law supersedes an earlier rule, the supersession is stated explicitly. The addendum files remain the full implementation detail.

## TABLE OF CONTENTS
- PART ONE — World Scale & the Continuous World (valley scale law, abstraction law, continuous walk law, the streamed world as built)
- PART TWO — The Vegas Overmap (geography canon, generation laws, the complete building set, the underground, quality map)
- PART THREE — The Survival Economy (the ceiling math, death math, logistics, currencies, life-support organs, the educational mission)
- PART FOUR — Movement & Vehicles (120 Request Law, the vehicle ladder, travel tables)
- PART FIVE — Combat Canon Evolution (resolution model, facing math, dial odds evidence, turn-shell research, juice menu)
- PART SIX — Production Law (Factory Law, Verdict Workflow, perf budgets, seed + scaling decisions)
- PART SEVEN — Consolidated Pending Decisions

# PART ONE — WORLD SCALE & THE CONTINUOUS WORLD
*(folds: Grid Unit Design 7/3, Overmap Scale Resolution 7/6, Neighborhood Scale Research 7/6, Valley Scale Law 7/6, Vehicles & Cell Size 7/6, the streaming build 7/6)*

## The Grid Cell — the Atom (LOCKED 7/3, refined 7/6)
A grid cell is the atom of POSITION, OWNERSHIP, and CHANGE: the player moves cell to cell (grid position is the only thing that waits for the player), every persistent world change keys "layer:x,y" to a cell, the fold serializes cells. Animation, ragdolls, and the dial never touch the grid clock; they live on the 120 BPM real-time clock. Two clocks, one map. Three layers per cell, bottom up: GROUND (terrain, walkable flags), STRUCTURE (buildings, walls, cover — the citybuilder writes here), DECAL (blood, scorch, corpse-persist — the consequence system writes here). A tile replacement = one cell write in one layer + a dirty-rect chunk redraw. Corpses land as DECAL entries (recorded:true), persistent world memory the Amalgamation can read.

## The Valley Scale Law (LOCKED 7/6, revokes the 24m Slot Scale Law of 7/5)
The 96x96 overmap IS the whole Las Vegas valley. One overmap cell is ONE NEIGHBORHOOD:
- 1 cell = 128x128 fine cells = 8x8 chunks (CHUNK=16) = 96m x 96m at 0.75m per fine cell = ~one Pelican Town of tiles (16,384 vs Stardew's 13,200 — the proven pixel-density unit).
- Valley = 96 x 96m = ~5.7 miles across = Los Santos scale. A 1:4 linear compression of the real 22.9-mile valley, GTA's exact proven ratio (real Hollywood is bigger than all of Los Santos, and Los Santos still reads as the whole of LA).
- CELL_M = 0.75 unchanged: one fine cell = one footstep, the 120 BPM gait law untouched.
- The 96x96 authoring (Strip cells, arterials, districts) never moved; only the amount of fine world under each cell changed. Constants: TILE_FINE=128, SLOT_FINE=128, TILE_M=96 in bohemia_overmap.js.

The road here: 512 was locked first (true scale, 22.9 mi), then comparative research (Project Zomboid 256-300 tile cells, CDDA 24m tiles, GTA 1:3-1:4 compression, Stardew's 13,200-tile town) plus Paolo's content-density law (DENSE OVER VAST — the world must be filled with content, never a cheap way to traverse an empty world) moved it to 128. At 128, one neighborhood = one Pelican Town's worth of designed-feeling ground (8-12 houses, yards, alleys, a corner spot, every screen a thing); at 256+ the same stuff spreads over 4x the ground and becomes lawns and filler.

## The Abstraction Law (LOCKED 7/6, Paolo verbatim intent)
The city map draws the CLASS of a neighborhood; the fine layer holds the REALITY of it. One house sprite on the overmap = a whole housing neighborhood underneath. A collection of house cells = a large-house neighborhood or an apartment complex. One commercial cell = a parking lot with stores. A collection = a big-anchor lot (Walmart-class) or a mini mall. The principle extends to every district class: the overmap glyph is the legend entry, the fine layer is the place. [PENDING: per-class fine-layer templates, Paolo's calls as each district gets its drop-in pass.]

## The Continuous Walk Law (LOCKED 7/6, BUILT + SHIPPED same day)
The fine layer is ONE UNBROKEN WORLD: 12288x12288 fine cells. The player can walk from one end of the valley to the other without ever surfacing to city view. City view is the zoomed-out READ of the world, never a wall, never a loading gate. DROP IN is a camera/mode change, not a level load. Fine cells realize DETERMINISTICALLY per (seed, overmap cell) as the player approaches, CDDA-style streaming; chunks behind are evicted (LRU).

AS BUILT (in the alpha's CITY tab, 14/14 headless proofs):
- Chunk store: 16x16 cells realized together, LRU cap 520 chunks, deterministic per seed (same cell twice = identical).
- Neighborhood meta: one plan per overmap cell (interior streets + building rects) hashed from the cell's own seed. Suburbs roll 8-12 houses, commercial rolls a lot + store blocks, downtown towers, resort/mall/casino megablocks (no interior streets), parks tree clumps, open terrain (desert/wash/mountain) scattered clutter, water/mountain unwalkable.
- STREET RING LAW: built neighborhoods are BOUNDED BY STREETS on a 3-wide border band. Adjacent rings touch = one shared 6-wide street between neighborhoods. Real Vegas structure AND the valley-wide connectivity guarantee.
- Road-district cells: centered bands with fixed widths from the 4-neighbor road mask, seam-exact across borders (the 7/5 edge-matching law, carried up to 128 scale).
- Marker sync: surfacing to CITY moves the marker to wherever your feet took you. The walk IS the travel, both directions.
- Interior street/building placement never intersects the ring or street bands; placement is collision-checked.

## The Movement Gait (LOCKED, carried from 7/3 with the run law)
Walk = one cell per half-cycle footfall, 0.5s per cell at 120 BPM, ~0.75m per step at ~1.5 m/s — the real human numbers and the beat math agree by construction, no foot-slide. RUN = TWO CELLS PER MOVE (real running is almost exactly double the ground per step at double-time cadence). [PENDING from 7/3, still open: 4-way vs 8-way movement cost treatment; whether running costs exposure, recorded-ledger noise, or arrival aim penalty.]

# PART TWO — THE VEGAS OVERMAP (COMPLETE, FRAME-LOCKED)
*(folds: Vegas Geography 7/4 + every 7/5 pass + 7/6 additions; 86 tests green, 200-seed stress hardened, KEY coverage green)*

## Status: COMPLETE
Paolo frame-locked the overmap building set 7/6: complete for procedural generation and storyline purposes. No more building hunts. New buildings enter only by Paolo naming them or a storyline demanding them.

## Orientation & Skeleton (LOCKED)
Top-down valley. Cardinal anchors (Bohemia's authored truth): E+W borders = mountain rim (rollable to N/S per seed, solar + dam flip with the axis). The 215 BELTWAY = a snapped rectangle ring, 2 wide, inset from the rim with a desert gap. I-15 = THE CENTRAL SPINE: square L, dead-straight vertical leg parallel to the Strip (~5-cell gap), originates at the south border, one 90-degree bend, exits the opposite border. US-95 cross-town leg runs border to border through the SPAGHETTI BOWL, a 4x4 interchange knot at the L's corner just north of downtown, touching freeways on ALL FOUR sides. Three exit highways (NE, SW, S). Mountain passes: 2-4 total across both rims, 1 wide (two-lane mountain roads). THE STRIP: absolutely stagnant, always N-S, 2 wide, fixed length, downtown at its north head, resort buffer 2 deep both sides, cross streets pierce it at every mile crossing. The town MIRRORS around the I-15 spine per seed (UNLV, medical, geography flip sides together).

## The Generation Laws (all LOCKED, all suite-tested)
- ABSOLUTE 90-DEGREE LAW: NOTHING runs diagonal. Not streets, not freeways, not anything. (Supersedes the earlier freeway exception.)
- FREEWAY WIDTH LAW: no freeway ever wider than 2 cells. Structural guarantees (exit stubs coincide with the spine's columns, the bend row clears the ring) plus a suite test.
- FREEWAY CONNECTIVITY LAW: every freeway cell reachable by BFS from the spine on every seed. No floating segments. Passes run border to ring.
- PARALLEL SIDE-STREET LAW: no street alongside a freeway one cell over; that ground is hybrid frontage real estate.
- COLLECTOR LAW: every mile block gets a full collector cut both ways (~quarter blocks), 40% roll one extra local street, only extras dead-end. Max building blob 24 (measured 16). All freeway geometry snaps mid-block so arterials can never sit adjacent-parallel to a freeway by construction.
- GRADE SEPARATION: arterial-freeway crossings roll over or under per seed hash; surface streets are never severed. Freeway sound-wall ticks explain the crossing rule visually.
- PASS PARALLEL LAW: a mountain pass never runs alongside another freeway.
- GENERIC CLEAR-SPOT NUDGER (Factory Law applied): one placement mechanism for all pieces — forbidden geometry + spiral search. 200/200 seeds generate complete.
- PARKS TOUCH STREET LAW; COMMERCIAL MUST TOUCH A STREET; COMPLEX LAW (interior street-less housing renders as apartment/condo prisms); NELLIS QUADRANT + CORNER LAWS (base opposite-end same-side as the dam cluster, hugs the rim outside the ring, never breaks a freeway); AIRBASE/AIRPORT/BASIN/CASINO freeway dodges; DRIVE-IN touches a non-HRI airport.

## The Quality Map (LOCKED)
Every tile carries quality 0..1, mirror-aware. Grounded in real Vegas: east side rough reaching north, Summerlin and Henderson good, the SE transition, west fringe busier commercial. Quality drives parks, vacant lots, commercial bias, suburb roof/ground tint (readable at a glance), and later the drill-in ruin/patched/rebuilt density.

## The Complete Building Set (LOCKED census, highlights)
Water: Intake 3, treatment plant, aqueduct through the rim, 3 reservoir tanks, pumping station, reclaim plant on the wash, detention basins. Power: solar field (N border band), 3 substations, battery farm, Hoover Dam + water cluster (Lake Las Vegas → Boulder City → dam → Lake Mead at a corner where the border meets the rim, highways dead-end into it). Food: FARM district on every plowed dead golf course (crop strips follow the fairway ghosts; ONE course still operational, held by the Karen community, remnants of Remnants and Reds), real-grass parks are FOOD, sport parks stay recreational, ~4% homesteads (one family, wells) + 3 COMPOUND neighborhoods (whole block organized — those factions notice), THE GRANARY (dead grocery DC recommissioned: harvest + seed stock + cold rooms = the medicine vault). Fuel: TWO depots (CalNev by rail north, UNEV at Apex) with dead pipes drawn in the UNDER view. Materials: Sloan quarry, Blue Diamond gypsum, warehouse district, Apex landfill (+ half-built shells flag). Civic ruins: 3 fire stations, 2 police substations, jail (CCDC), courthouse 2x1 with the EOC folded in as lore (the mayor arc's physical seat). Memory: THE LIBRARY (analog memory, the counter-fortress) vs THE DATA FORTRESS (Switch-equivalent, 3x2, near-black slab, cyan night hum, THE NETWORK'S GROUND). Voice: radio station downtown + antenna farm on the rim. Force: THE ARSENAL (Battlefield-Vegas-equivalent one block off the strip; REMNANTS hold it at game start, contested with the Cartel — the fight is quest material; helicopters folded in). Fabrication: ROBOTICS FACTORY beside the Henderson airport, TIED TO THE NETWORK at game start — machines that make machines. Transit/icons: monorail, Brightline terminal, Boring Loop, Sphere, High Roller, Fremont canopy (exactly 2 cells), Welcome sign, the Strat (position law: first arts-district block past the gridline beside the Blvd), Luxor pyramid + night beam, Red Rock sandstone segment (~a third of the west rim), Springs Preserve, UNLV 4x3 + CSN, Allegiant Stadium, speedway, convention center, chapels, casinos (exactly 5 locals), trailer parks + self-storage by quality, Chinatown corridor, swap meet, drive-in, cemetery law (big one welds to Sunset Park, small at the north cluster), desert prison, Mount Charleston massif with estates, gated communities, golf/BMX superseded by FOOD OVER BMX.

## The Underground (LOCKED, 7 systems, UNDER view toggle)
STORM tunnels (the Homeless territory, entrances ON the wash, trunks from strip + downtown, every basin tied in — real Vegas: 600+ miles, 90-degree culverts, the law matches reality), SEWERS (every line L-pathed to the reclaim plant — the 99% loop literally drawn), BORING LOOP (convention → resort corridor → airport, spurs: downtown, Chinatown, medical, Allegiant), AQUEDUCT (intake → treatment → through the rim → pump → reservoirs), FIBER BACKBONE (under the 15 from the CA border to the data fortress — the Enron fiber, the wire the portraits traveled in on), THE DEEP TUNNEL (Paolo's canon: fortress → deeper → water reclamation plant; grounded both directions, the real fortress runs on 100% recycled water), DEAD FUEL PIPES (CalNev + UNEV). [PENDING: walking the tunnels in human mode; Homeless storm-territory vs Network-adjacent Loop as faction canon.]

## The Interactive KEY (LOCKED, alpha-grade)
The KEY is a LAYER TOOL: tap any row to isolate (matching cells full, rest dimmed 15%), multi-select stacks, quality and crossing-type splits filterable, coverage test guarantees every togglable row matches at least one cell on every seed. The same isolate-layer pattern seeds the future in-game zoning/utility overlays.

# PART THREE — THE SURVIVAL ECONOMY
*(folds: Grass-to-Food Math 7/5, Death Math 7/5, Survival Accounting 7/5, Unthought Infra 7/5, Last Finds 7/5, Gameloop Infra Gaps 7/5, Logistics 7/6, Life-Support Buildings 7/6)*

## The Educational Mission (CANON, mission-level)
Bohemia is meant to be an educational experience that makes people reconsider how civilization works, from the plumbing under the hotels to the interstate fuel pipes. The infrastructure IS the curriculum. The game never preaches it; the map teaches it.

## The Clock (CANON)
Game start is roughly a DECADE post-crash (supersedes the older 15-year figure): collapse, the hell years, first stability. 10 vs 15 is tuning; the number serves the arc.

## The Ceiling Math (grounded, the population law)
The valley inherits ~10,000 acres of irrigated/irrigable soil (parks + golf + scraps; everything else is caliche). Converting grass to food uses LESS water than the grass did (turf ~7 acre-ft/acre, vegetables 3-4); water is not the binding constraint — soil and labor are. Calorie ceiling: 10,000 acres feeds ~50,000-80,000 people honestly. THE GRASS CANNOT FEED 2 MILLION. Post-crash Vegas's maximum population is written in its dirt. Labor: the full conversion needs 5,000-10,000 farm workers — whoever organizes farm labor organizes the city. Golf courses are the crown jewels (irrigation already in the ground; fairways = strip-fields following the dogleg ghosts, greens = seedbeds, hazards = tanks). Seasons invert: winter grows, summer survives under shade cloth. The soil economy runs on compost from the landfill and reclaim-plant biosolids: every calorie in Bohemia has passed through the reclaim plant twice.

## The Death Math (grounded; split PENDING)
Pre-crash ~2.3M people; the map must account for ~2.2M gone. History says mostly EXODUS (the 15 south to California through 40 miles of open Mojave — the CA approach desert is the exodus road), then die-off in the first 18 months (heat, water pressure, medication runouts, violence), ~3% remain. Plausible grounded split ~70-80% exodus / 15-25% die-off. [PENDING: Paolo picks the split; it sets the tone of every ruin.] CORPSE COLLECTION is LOCKED as a natural in-game system; WHICH fertilizer story is true (compost rows / quiet arrangement / refusal / faction split) is deliberately deferred — "whole story content we'll be ready for." Story-via-map damage layers (exodus litter, tower die-off, first-winter burn scars, hospital order) all [PENDING].

## Survival Accounting (the organ-by-organ answers)
WATER: answered — Intake 3 below dead pool + the reclaim plant kept running, THE survival event (cities that lose sewage die of cholera in months). Lake Mead RISES post-crash (downstream pumps died with the grid; Vegas draws 300k acre-feet of a ~9M river) — the shrinking bathtub ring is canon. POWER: solar + substations + battery + the dam (2GW for whoever can run and hold it). FOOD: answered, the ceiling above. FUEL: gasoline chemically dies in 6-12 months, stabilized diesel 2-3 years; the surviving regional source is small-scale Salt Lake refining, making the 15 NORTH the caravan road. MEDICINE: the brutal ledger — insulin's cold chain fails year one, antibiotics run out, ten years in it's trauma surgery + herbals + hoarded stock as treasure + whatever the campus labs restarted [PENDING: UNLV chemistry as the pharmacy, faction-grade]. ORDER: factions instead of civilization; the police ruins are the evidence of the thing that stopped existing. CLIMATE: the 120-degree question — towers as thermal mass, tunnels 20 degrees cooler (the Homeless knew first), nocturnal summers leaning no [PENDING]. MATERIALS: there is no lumber; every rebuild is salvage steel, concrete, block, rammed earth; quarry + gypsum complete the leg.

## The Three-Currency System (LOCKED)
USD is dead. Bohemia runs on MEDICINE, ELECTRICITY, and RESOURCES (food + building materials as one bucket). NO casino chips (explicitly rejected). The economy is resource-denominated.

## Logistics — the Barely-Barely Restart (LOCKED)
Modern logistics dies of broken PROMISES, not broken machines (dollar settlement fails → letters of credit freeze → cargo stops changing hands → shelves empty in 72 hours). It restarts the way it always has: THE CARAVAN, THE CARAVANSERAI (our truck stop, same building same job 900 years apart), THE GUARANTOR (whoever plays banker accumulates terrifying power — protection of trade routes is how states are born; the escort becomes the army). GAME-START STATE: internal movement works (bikes, carts, solar EVs, Loop cars — the city works at walking speed); external trade is RARE escorted convoys on the 15 north to Salt Lake fuel; a convoy arrival is a market day, a festival, and a security crisis at once [PENDING cadence, proposal 1-3/month]. The guarantor/banker seat is an unassigned faction-defining power position [PENDING, and it is a big one]. Implied systems (all PENDING): convoy events, escort quests, price spreads, radio as the information layer, the guarantor as a Succession seat.

## Life-Support Trio (BUILT + LOCKED)
THE GRANARY (surplus, not wealth, is what civilization actually is), THE LIBRARY (paper memory: the fortress remembers PEOPLE and demands power; the library remembers HOW TO LIVE and asks for nothing — one of them is the antagonist), THE RADIO STATION (no radio, no market; whoever holds the microphone shapes the truth). Civ-5 audit: every other civ-critical building already exists on the map or maps to one. WALLS are a mechanic, not a rect [PENDING, city-builder act tiers].

# PART FOUR — MOVEMENT & VEHICLES
*(folds: 120 Request Law 7/6, Vehicles & Cell Size 7/6)*

## The 120 BPM Request Law (LOCKED, WORLD LAW)
"You REQUEST to walk on the same timing. You don't just do it." Movement input is a REQUEST, never an execution: pressing a direction queues the step; the world metronome (BEAT=500ms) executes it on the next grid tick. Applies in human mode AND city mode — anything that moves by player input anywhere in Bohemia answers to the same clock. WORLD MOVERS LAW intact: the metronome ticks continuously but the world only advances when a step actually EXECUTES. HOLD-TO-RUN implemented as default (hold 2+ beats → run, two cells per beat, real run clip) [PENDING verdict: hold vs dedicated run button].

## The Vehicle Ladder (LOCKED)
START: MAN-POWERED travel only — bikes, scooters, skateboards. It's the economic-crash apocalypse: the gas economy is dead, human power is the economy (grounded: Cuba's Special Period went bicycle-first). PROGRESSION: cars/EVs UNLOCK later, gated on building it right + acquiring the resources. Vehicles are an achievement of the rebuild, not a given. The scale is sized to the ladder — the world slightly too big on foot, right on a bike, conquered by a car:

| mode | cells/beat | m/s | cross 1 neighborhood | cross valley |
| walk | 1 | 1.5 | 64 s | 1.7 h |
| run | 2 | 3.0 | 32 s | 51 min |
| bike | ~4 | 6.0 | 16 s | ~26 min |
| car/EV late | ~10 | 15.0 | 6 s | ~10 min |

[PENDING: exact cells/beat per vehicle; skateboard/scooter tier (~3); whether vehicles move in city mode; unlock chain; which factions gate parts/fuel/batteries; transit as a city-builder output.]

# PART FIVE — COMBAT CANON EVOLUTION
*(folds: Combat/Character/Menu Roadmap 7/4, Turn-Based Research 7/3, Rhythm/Grid Juice Research 7/3, Dial Odds 7/3)*

## Combat Resolution Model (LOCKED CANON 7/4, built, gated)
NO DAMAGE BEFORE THE DIAL, ever — popping breaks cover but never costs HP on its own; the risk is realized only on a MISS. MISS: turn ends, return fire lands (the only thing that damages you). HIT: damage, clean turn end, no return fire. VITAL: damage + 2-turn stun (with stun cooldown), chain continues. KILL: KILL_DMG=100 through armor via applyDamage — NOT an instakill flag; elites/bosses/robots with armor or big HP can survive the arc, but the kill arc ALWAYS buys the clean turn ("power is loud and safe"). Bad pop-out into exposed guns resolves the enemies' shot FIRST (damage + incoming animation), THEN the dial opens.

## Cover-Stance Facing Math (LOCKED CANON 7/4, proven headless)
Facing is a WEIGHTED THREAT VOTE, not a body count: range weight 1/(0.15+distT) (point-blank ~6.7x), melee multiplies up to 4x more as it closes, and EXPOSURE is the GATE — if anyone is exposed to you, only exposed enemies vote; fully covered = defense mode, face the fullest 180 window. Facing = 8-way snap of the weighted resultant. POSITIONAL, not peek-state (the spin bug is dead): stable per turn. Demo spawns roll five layout classes so the math reads.

## The Dial Odds Evidence (measured 7/3, decisions Paolo's)
Headless sim, 300 trials/pattern/package: the package ladder is monotonic (EASY 78% → BOHEMIAN 33% hit). Flagged for Paolo: avalanche 0% (delete candidate confirmed), the EASY-shape betrayal (felt-equalization makes stagger/hook/hitch brutal at HARD), the never-hard trio (feint/lurch/piston near-100% even at BOHEMIAN), three patterns that get EASIER held (crawl/static/flutter2). Rankings durable; absolute numbers move with arc width. [All PENDING Paolo's re-tier calls.]

## The Turn Shell Research (filed 7/3, adoptions PENDING)
The dial is a skill-shot turn resolver (SteamWorld Heist / Mario-RPG lineage) with two Bohemia-only twists: the 120 grid makes timing musical, greed is a held-risk multiplier. The spine of the greats: THE TURN IS A PROMISE — show consequence before commitment. Adoption menu (all pending): next-turn telegraph icons (Into the Breach), overwatch cones on tiles making the street the encounter (XCOM), range bands per weapon family (Darkest Dungeon), the DECAL layer as the off-ledger weapon — environmental kills quieter on the recorded ledger than gunfire, a Bohemia-only mechanic hiding in existing canon (Divinity), the zone map drawn on the enemy silhouette during aim (Fallout/VATS lineage).

## The Standstill Juice Menu (Verdict Menu A-H, PENDING Paolo's thumbs)
A beat-breathing world, B floor pulse, C muzzle+casing on the grid, D return-fire cracks, E low-HP heartbeat, F hit-stop, G greed desaturation, H kill echo. Rhythm lessons filed: Necrodancer (one clock, everything obeys), Hi-Fi Rush (ambient beat-sync is free addictiveness), BPM (the gun is the drum), Patapon (call-and-response return fire on the offbeat). GDD-level commitments queued: the one-clock law made visible; standing still as a stance once the grid lands.

# PART SIX — PRODUCTION LAW
*(folds: Factory Law 7/4, Verdict Workflow 7/3, Dial Odds/Seeds/Perf 7/3, display scaling research 7/3)*

## The Factory Law (LOCKED CANON)
Everything built into this engine is a FACTORY, never a one-off. Required shape: typed spec in → generator → batch volume out → tagging/metadata for pooling → kill/approve verdict pipeline → its own regression gate. One-offs are banned. Existing factories are the pattern: music (383 voices, dual-rank tiers, MUS.pool), character (skinner + rig + garments, NPCFactory), enemies (ARCH archetypes), dial (52 patterns + packages), placement (the generic clear-spot nudger). Everything next ships as a factory: menus, terrain (x3 act versions), buildings (x3), roads (x3), props/clothing/hairstyles — each with animal-view AND city-view representations, each through the thumbs pipeline.

## The Verdict Workflow (LOCKED)
Claude cooks volume → Paolo verdicts fast (thumbs) → up = implemented same turn, filed to canon → down = GRAVEYARD with source preserved AND a POST-MORTEM (why it died), consulted before every new batch. Rejected work is never deleted, never re-pitched as-is. The graveyard is a lesson catalog. A broken export/copy pipe outranks new production. Case law: the BMX render was correct approved work; the food math superseded it; the hurt is canon material.

## Measured Engineering Decisions (7/3, evidence filed)
- Frame economics: cold buildFrame ~13ms desktop / ~50ms iPhone estimate → uncached frames unaffordable live; the FrameCache + runtime warmer is load-bearing. NO build-time atlas (full roster = ~44MB, dead on arrival); the warmer IS the atlas. Crowd strategy: NPC look ARCHETYPES warmed once, unlimited instances [archetype count/looks PENDING].
- World seed PRNG: mulberry32 over sfc32 (10.6x faster, equal statistical quality, smaller fold state) [adoption nod pending, data one-sided].
- Display scaling: Scale2x composes — applied twice = clean 4x with zero new art. Integer scale only, per device class; layout (not pixels) is the real port work. Filed, nothing needed until a second display class.

# PART SEVEN — CONSOLIDATED PENDING DECISIONS [all Paolo's calls]
World/scale: per-district fine-layer templates; shared border-street width feel on phone; 4-way vs 8-way; run costs (exposure/noise/aim).
Vehicles: cells/beat per tier; city-mode vehicles; unlock chain; faction gates; transit.
Overmap/lore: fuel depot final name; fertilizer story (4 versions on file); exodus vs die-off exact split; guarantor/banker seat; convoy cadence; WALLS mechanic; nocturnal summers (leaning no); Amalgamation body specifics beyond the deep tunnel; robotics factory story content; Karen community details; tunnel walking + Homeless/Network underground faction canon; Luxor/resort signature looks; foothill development confirm; strip mirror confirm.
Combat: dial re-tiers from the sim (avalanche delete, EASY betrayal trio, never-hard trio, greed-easier trio); turn-shell adoptions (telegraphs, overwatch, range bands, decal surfaces, silhouette zones); juice menu A-H; multi-enemy dial model (three candidates); standing-still stance.
Character/production: ragdoll head/neck rigidity; hair occlusion visual pass; face-feature per-direction values; logo direction; NPC archetype count/looks; perks scope (needs Paolo to clarify before cataloguing); gloves slot, female + child rigs, mirrored garment art.
Systems: time-of-day mechanics vs cosmetic; economy carry fraction; standing decay; act-two permanent decisions; wound modeling; UNLV pharmacy; hydroponics supplement (towers); mm-workflow studio tagging UI layout.
