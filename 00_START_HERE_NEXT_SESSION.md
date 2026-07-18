=== BOHEMIA HANDOFF 7/17/26 (REPO DAY ONE COMPLETE) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md ->
BOHEMIA_CANON_INDEX.md -> laws/BOHEMIA_STATE_OF_PLAY_7_17_26.md (the full
account of repo day one lives THERE; this file stays the pointer, not a pile).

## WHERE WE ARE
The repo is born, whole, and on main. 534/534 seed files verified. The layout:
/engine /gates /laws /banks /slices /tools /records /questbook /quests
/archive, spine docs at root. Push access works; everything commits to main
the turn it passes the gates.

ALL GATES GREEN: 16 gates (QUESTBOOK joined 7/17), ~35s.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)

DAY ONE IN ONE BREATH (details + lessons in STATE_OF_PLAY 7/17):
- V11 slice track CLEARED: lamps on (powergrid-ruled dark), patrol wired
  (empty roster IS the law), approved marking paint on the ground. Slice gate
  13 -> 33 checks.
- Engine: blockgen places turn pockets (cell.mk, certified vocabulary); LINE
  COLOR gate grew 6 checks.
- Graphics: a FULL verdict cycle in one day — arrows cooked, all 84 markings
  approved in chat, volume banked (224 tiles), act-1 art_gaps EMPTY. Wall
  batch 2: WB4 into perimeter pool v2; the 47 await other wall classes
  (REJECTION IS PER CLASS, taxonomy addendum 7/17).
- Questbook: batches 8-12, files #139-152, the 7/16 mining queue CLOSED,
  68 of >90. Gate #16 enforces the format; the searchable archive is back
  and freshness-gated.

## THE WORLD MODEL — THE STRUCTURAL SPINE (7/18, Paolo: "step back... really
## think about what structurally we should be building")
Researched the games closest to our ambition (Shadows of Doubt = enterable
simulated procgen city; Caves of Qud/Dwarf Fortress = simulated agents +
factions + history; Against the Storm = city-builder roguelite that beats
stagnation via run structure). THE READ: we built a beautiful STAGE, not yet the
play. THE SPINE to build: ONE canonical WORLD MODEL — an addressable hierarchy
valley -> district -> plot -> building -> floor -> ROOM -> tile — that the
bakes/combat/city-builder/sim all read and write, instead of today's scattered
representations. Three ladders climb it: ZOOM (enterable top-to-bottom), LIFE
(agents/economy/factions), LOOP (the roguelite run — [PENDING Paolo, his call]).
Full plan: laws/BOHEMIA_WORLD_MODEL_ROADMAP_7_18_26.md.
DONE THIS TURN — the bottom ZOOM rung (the enterable one): engine/bohemia_
floorplan.js. Given a footprint + zone + seed it BSP-splits into rooms, walls
the gaps, carves a door graph that GUARANTEES every room is reachable, cuts a
street entrance, and zones rooms (public near the door, private/service back,
the Shadows-of-Doubt model). 8 zones (residential/retail/office/civic/
institutional/warehouse/landmark/default). Gate #20 gates/floorplan_gate.js:
every room reachable, no overlap, entrance exists, roled, deterministic. Proof:
slices/BOHEMIA_FLOORPLAN_PROOF_7_18_26.png (verified by eye, reads as real
floor plans).
ALSO DONE — THE UNIFIER (the spine itself): engine/bohemia_world.js. world(seed)
.at(x,y) -> overmap cell; .plot(x,y) -> block grid + building footprints;
.plot(x,y).building(i).floorplan() -> that building's interior rooms. COMPOSES
overmap/bridge/blockgen/floorplan, lazy + deterministic (addressing one room
never builds the valley). Gate #21 gates/world_gate.js: 676 plots resolve, no
throws, every exposed building yields a fully-reachable interior, deterministic.
Proof: slices/BOHEMIA_WORLD_ZOOM_PROOF_7_18_26.png (ONE image: valley -> district
-> plot -> building -> rooms, all through the one API). Note: today only the
built-lot archetypes expose buildings (38/676 sampled); suburb houses +
commercial storefronts still owe footprints.
ALSO DONE — THE SEAMLESS ZOOM (first cut, playable): slices/BOHEMIA_ENTER_SLICE
_7_18_26.html (tools/bohemia_enter_slice.py). Spawn outside a building on a real
plot, walk to the door (arrows / on-screen d-pad), step INSIDE the exact rooms
world().plot().building().floorplan() generated, walk back out. Self-contained
(concatenates overmap/bridge/blockgen/floorplan/world + a compact walk loop),
verified in a 390px chromium: enter + exit, 0 console errors. Wired into the
alpha SLICE tab organically (SLICES_MANIFEST current='enter', regenerated
BOHEMIA_CURRENT_SLICE.html) — ONE-ALPHA safe, the 31MB alpha never changed. Made
world.js browser-robust (typeof-guarded module resolution) for embedding.
SUBURB INTERIOR — NOW A JUDGING TOOL IN THE SLICE MENU (Paolo 7/18: "if there's
anything you want me to judge... make an interactive in the slice menu"). The
suburb interior (loops/culs) is his under MAP LAW and it's THE unblock for homes
-> LIFE. tools/bohemia_suburb_judge.py -> slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html:
3 candidate layouts (THE LOOP / CUL-DE-SACS / GARDEN CURVE) generated from the
anatomy (curvilinear, loops+culs, walled), thumbs + per-style + global comments,
SUN MODE, RESEED, export .txt (verdict workflow). Wired into the SLICE tab
(manifest current='suburb'). STATUS: [PENDING Paolo verdict]. On approval, the
chosen generator graduates into bohemia_plotgen (suburb houses), homes exist,
LIFE opens.
ITERATED (Paolo verdicts, same session): (1) "all houses in Vegas have proper
driveways on the street to the garage" -> every home rebuilt as street->driveway
->front garage->body. (2) MODULARITY LAW (Paolo: "modular to fit into a 1x2 or
2x2... if you can't easily snap to the other suburbs I don't want it") -> the
generator is now CLUSTER-AWARE: genSub(seed,style,cw,ch) fills a cw x ch union as
ONE connected neighborhood; the tool shows each style at 1x1 AND 2x2. Generator
extracted to tools/bohemia_suburb_gen.js (candidate; the judge tool embeds it AND
the gate tests it). Law: laws/BOHEMIA_ADDENDUM_MODULARITY_LAW_7_18_26.md. Gate #22
gates/suburb_modular_gate.js: every style connected + homed + garaged at 1x1/1x2/
2x1/2x2, deterministic. RESEARCH folded into the law: LV is ~62% single-family /
~32-38% multifamily BY UNITS, but by LAND AREA suburbs are ~85-90% (apartments
4-6x denser) -> ~1 apartment cell per ~7-9 suburb cells (tunable, [PENDING Paolo]).
NEW WORKFLOW LAW (Paolo 7/18): anything needing his judgment/feedback MUST be an
interactive in the alpha SLICE menu — not a chat proof image. Stop sending PNG
proofs as pseudo-verdicts.
NEXT: (a) [PENDING Paolo] the suburb verdict (unblocks homes->LIFE) + he rules
LOOP; (b) mine, unblocked: overmap-scale walk (streets between plots) + real art
in the enter slice, then start LIFE once homes exist.

## CITY-BUILDER FOUNDATION (7/18, Paolo scoping the city start)
Paolo's plan: put streets into the CITY tab now, empty lots = DESERT until
built; in citybuilder you can delete/blow up a plot down to the desert
underneath; a big building can span 4 lots. FILES CHECKED — the canon
already supports ALL of it:
- CELL-IS-PLOT (laws/...CELL_IS_PLOT_WALLED_SUBURBS): each overmap cell IS
  a plot, wall to wall (128x128 fine tiles = 96m x 96m, CELL_M 0.75).
  Commercial = parking+storefront, suburb = walled tract, streets = the
  connective tissue.
- THREE-LAYER TILE SYSTEM (laws/...GRID_UNIT_DESIGN): GROUND / STRUCTURE /
  DECAL per cell. Buildings write STRUCTURE over GROUND; DELETE a building
  -> the GROUND (desert) shows. Paolo's delete-to-desert mechanic + 4-lot
  building = 4 plots IS this system, already designed. Cells group 16x16
  into cached chunks; tile replacement = write layer + dirty-rect redraw.
- THE FREEWAY IS ALREADY LOCKED (laws/...VEGAS_GEOGRAPHY, 7/5/26): the "C"
  = 215 beltway (rounded rect hugging the valley rim), the "X" = I-15
  (SW-NE by the Strip) + US-95 crossing at the Spaghetti Bowl, a near-
  perfect MILE GRID of surface arterials under them, 3 exit highways,
  mountain passes. So "lock the freeway" is DONE; the city skeleton is
  canon. (Suburbs are CURVILINEAR loops/culs, walled, few entries.)
- DESERT CONFETTI is a NAMED BANNED crime (per-cell shuffle == checkerboard);
  the perfect desert must be CONTINUOUS, not per-cell random.
BIG DESERT LOT PERFECTED (the GROUND under the whole city): tools/bohemia_
desert_lot.py -> slices/BOHEMIA_DESERT_LOT_PROOF_7_18_26.png. Anti-confetti:
one seamless cropped sand base + multi-octave value noise for tone (spans
the parcel, no grid) + fine grain + sparse whole-parcel scatter (tan
pebbles, dry-wash hairlines). 28x28 cells (1232px), deterministic, zero
purple. Paolo BLESSED it ("really impressed, continue moving on") -> CITY
STARTED.
THE CITY MAP RENDERS (7/18): tools/bohemia_city_map.py -> slices/BOHEMIA_
CITY_MAP_PROOF_7_18_26.png — the whole 96x96 generated Vegas from above.
The overmap generator already lays the canon: 2448 arterial cells = the
mile grid, 1011 freeway (215 beltway + I-15/95), rail, Lake Mead (water),
the mountain ring, and 80+ landmark districts. Paolo's rule applied: only
the SKELETON draws as itself (streets/freeway/rail/water/mountain); every
BUILDABLE district (suburb/commercial/estate/resort/casino/strip/downtown
/...) renders as DESERT LOT until grown on. This is the CITY tab's base.
STREETS MADE WHOLE (7/18, Paolo TWO verdicts on the aerial map: first
"there should really be no breaking in any of the street layouts... unless
it is the strip and its casinos"; then, seeing it still fragmented, "look
at all these streets that are not connected to each other. That's not how
it's gonna be"). THREE root causes, all fixed in engine/bohemia_overmap.js,
gate is gates/street_connectivity_gate.js (STREET CONNECT, 3 checks now):
  (1) the old `half` truncation let extra local streets dead-end mid-block
      -> removed; every surface street runs arterial-to-arterial.
  (2) collectors were PER-BLOCK (each mile block hashed its own offset, so
      adjacent blocks' collectors sat a cell apart and never met) -> now
      PER-STRIP: one column-pick per mile-column, one row-pick per mile-row,
      so every collector runs the full unbroken length of the valley. The
      per-block "extra local street" is gone.
  (3) DEAD-END PRUNE heals stubs into empty lots, but left orphan arterial
      fragments BOXED IN by real terminators (estate/dam/jail/rail/water/
      mountain/edge) -> new STREET ISLAND PRUNE: label road components, keep
      the LARGEST, demote every orphan arterial in any other component to
      desert. Only arterials pruned; freeway/strip/downtown stay put.
  (4) MONUMENTS WERE BREAKING STREETS (Paolo circled the map again: "even
      monuments would just be in their big ass plots not breaking any city
      streets"). ROOT CAUSE: in skeleton() the landmark rects are stamped
      BEFORE the arterial/collector lines, so any soft landmark overlapping a
      street cell ERASED it -> a stub. FIX: GRID RE-ASSERT post-pass punches the
      full street predicate (mile arterials + per-strip collectors) back through
      every SOFT landmark; only BIG architecture may break the grid. BIG = real
      physical masses + huge installations + the blessed Strip/casino megablocks
      (the set lives in engine + gate, mirrored). Streets 2258 -> 2335. Dead-end
      prune rewritten: a street ends ONLY at road/BIG/edge; true stubs 153 -> 0.
Gate (STREET CONNECT, 3 checks): 0 stubs into fabric, ONE connected grid (flood-
fill, 0 islands), mile grid intact (>=2000). Seed 12345: 0 breaks, 0 islands,
2335 arterials. Map re-rendered clean + a zoom of the circled region verified
(monuments sit in plots, streets route around them). NOTE: (16,3) engine test
repointed to (23,18) — the old sample was a legit orphan the prune removed.
DOWNSTREAM (expected): +77 arterials re-rolled the power grid's 12%-live
lottery, relighting one V11 lamp block. The V11 lamp factory's lit path (never
finished) is now WIRED: a live cell shows the approved lamp body + a runtime
amber head-glow (rgb-only, per the light law, no new baked art, no verdict
owed). Verified in chromium (3 lit / 8 dead, 0 errors). Robust to any future
power reshuffle from map edits.
DISTRICT REGISTRY BORN (7/18, Paolo: "do you have all the info of all the
types of buildings... for the procedural generation landmarks"): the info was
scattered across VEGAS_GEOGRAPHY (748 lines) + code comments, 10 types had NO
write-up. Now ONE catalog: laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md, GENERATED
by tools/bohemia_district_registry.py (render status read LIVE from the bridge,
can't drift). 77 types: 9 BAKES (visible in a slice now), 8 RECIPE (grid exists,
art pending), 60 PENDING (placed on the map, fine-layer [PENDING Paolo] per
MECHANISM-MINE/CONTENTS-PAOLO'S). Gate #19 gates/district_registry_gate.js:
every enum type MUST have a registry row + count must match — a new district
can never go uncatalogued again.
PROCEDURAL DISTRICTS (7/18, Paolo ruled the 60 pending: "those can be randomly
generated throughout the map... this is a procedural generated world game"). So
they are NOT hand-authored — every district generates from a build ARCHETYPE.
engine/bohemia_blockgen.js genBuiltLot + the ARCHETYPE map in bohemia_overmap_
bridge.js: ~9 rules (civic/bigbox/institutional/industrial/utility/landmark/
green/water/rail/extraction) cover all landmark types; the bridge no longer
returns null (default -> builtlot). estate->residential, interchange->freeway.
Registry now 10 BAKES / 67 RECIPE / 0 PENDING. Proof: slices/BOHEMIA_BUILTLOT_
PROOF_7_18_26.png (one lot per archetype, verified by eye, distinct + readable).
Law: laws/BOHEMIA_ADDENDUM_PROCEDURAL_DISTRICTS_7_18_26.md. REFINES MECHANISM/
CONTENTS: generic building footprints are procedural; only true game-lore
(Amalgamation, purple, faction ownership, what SPAWNS) stays reserved.
SYNC COUPLING (bit me this turn): blockgen + ombridge are INLINED into the
graphics core (bohemia_engine_graphics) — editing either standalone requires
re-inlining + bundle resync (scratchpad reinline.py / resync_bundle.py pattern);
ombridge is now DECLARED in bohemia_sync_canon.txt. OWED next: art pools per
archetype (building/roof/signage sprites) so the RECIPE rows flip to BAKES.
NEXT for the city: (a) mark/zoom the landmarks (Strip, Sphere, Luxor, dam
— all in overmap.layout), (b) a detail bake where you zoom a region to
walkable streets + desert lots (compose from the street/intersection/
desert bakes), (c) wire the CITY tab to this map (alpha edit, ONE-ALPHA).

## IN FLIGHT (resume here)
-3. MUSIC BATCH 12 + GRAVEYARD SWEEP — NEW BADGE, PENDING VERDICT (7/18): Paolo's
   mega-verdict thumbed nearly the whole catalog CANON, killed 6 (SUNKEN VESPERS,
   UNDERTOW, VIA PURIFICO, HYMN IN THE FLOOD, THE DROWNED CHOIR, WHAT THE GLASS
   REMEMBERS — first 3 were briefly canon, newest verdict wins, GRAVEYARD FINAL).
   Swept from MLOOPS/NEW_VIBES/CANON_DEFAULTS, doc copies tombstoned, registry
   tokens n:'NAME' added (graveyard gate 0 live refs). BATCH 12 answers the slots:
   THE TIDE THAT KEEPS THE NAMES, WHERE THE PROCESSION DROWNED, A CHORD OF DROWNED
   BELLS, THE HYMN THE STATIC ATE, LAST BREATH OF THE ORGAN, THE BELL THAT COOLS
   TO SALT — 6 new topologies (Chebyshev/noise-flute/cluster/bitcrush/bellows/
   stretched-bell). Records: BOHEMIA_MUSIC_GRAVEYARD_7_18_26.txt. NEXT: verdict.
-2b. CLOTHING COOK BATCH 2 — 12 CANDIDATES IN COOKING, PENDING THUMBS (7/18):
   NAVY LONGSLEEVE, MUSTARD TEE, OLIVE FIELD SHIRT, MAROON HENLEY, CHARCOAL
   HOODIE, RUST TANK, TAN CHINOS, RAW DENIM, FADED JEANS, RED SNEAKERS, BLACK
   BOOTS, DESERT BOOTS. Variants off the approved template silhouettes, live on
   the rig in COOKING. Thumb UP -> CANON menu, DOWN -> graveyard. NEXT: verdict.
-2. MUSIC BATCH 11 — NEW BADGE, PENDING PAOLO VERDICT (7/18): "THE DROWNED
   CATHEDRAL DEEPENS." 6 FF10-horror songs, each births its own lead voice via a
   topology the catalog never ran: ring modulation (ashenbell), modal synthesis
   (boneplate), wavefolding (foldchoir), rotary/Leslie (roterror), moving-ratio
   FM (wailmorph), overtone singing (throatsong). Songs: THE CHOIR UNDER THE
   RESERVOIR, BONE RELIQUARY, WHAT THE GLASS REMEMBERS, THE TURBINE STILL TURNS,
   A PRAYER WOUND BACKWARDS, THROAT OF THE DROWNED NAVE. Music gate 14/14 (variety
   + new-voices + screech all green), offline-render verified. NEW_VIBES now
   points at batch 11 (batch 9/10 judged canon, dropped the badge). Record:
   records/BOHEMIA_MUSIC_BATCH11_7_18_26.txt. NEXT: process Paolo's verdict.
-1. CLOTHING FACTORY — CANON MENU LIVE, all 9 approved (7/18): CLOTHES tab now
   has a COOKING area (fresh candidates + thumbs) and a collapsible CANON WARDROBE
   (approved items collapse in, each with a CANON chip; only visible rigs animate).
   Thumb UP promotes cook->canon, DOWN->graveyard. All 9 garments are canon
   (records/BOHEMIA_CLOTHING_CANON.txt). A WORLD GRADE toggle (default off) grades
   cloth to world ambient RGB(67,61,56) like the skin — [PENDING Paolo: bake it in
   or keep clean catalog colors?]. NEXT: cook more clothing batches into COOKING;
   on an approved template, build the colorway/wear variant factory.
-1b. CLOTHING FACTORY v2 — LIVE RIG (superseded by -1 above): the CLOTHES
   tab in the alpha now renders every garment ON THE LIVE ANIMATED CHARACTER
   (not a mannequin — Paolo: "I really wanna see it on the live skeleton"). How
   it works: buildFrame has a CLO_PREVIEW hook (~line 3628) that paints the
   garment onto the DEFORMED body grid, so each piece rides the real rig at the
   idle beat in any of 8 facings. Generators (window.CLO, ~line 8032): genTop
   (collar + neck hole + button placket + sleeve cuffs), genPants (hip
   waistband + belt + fly + rolled ankle hems), genShoes (dark sole + light
   midsole + tongue laces + padded collar). Batch of 9: RED SHIRT, WHITE TEE,
   BLACK TANK, GREEN FLANNEL, BLUE JEANS, BLACK CARGOS, GREY SWEATS, WHITE
   SNEAKERS, BROWN BOOTS. Thumb up/down + comments -> exports verdict .txt.
   Batch 1 (flat body-traced, no detail) all went DOWN -> graveyard
   (records/BOHEMIA_CLOTHING_GRAVEYARD.txt). NEXT: process Paolo's v2 verdict;
   the UP ones become silhouette/coverage TEMPLATES that spawn variants
   (palette-swap + wear-state factory — research banked: seed-vs-variant split,
   hand-author bases, automate variants). Live canvases throttled ~12fps.
0. THE INTERSECTION EXISTS (7/17 evening, Paolo asked, same turn): blockgen
   type 'intersection' — two roads crossing, clean box (no paint inside, per
   real anatomy), four crosswalks at the box edges, medians stopping at the
   crossings, left-turn pockets feeding every approach, corner lamps. LINE
   COLOR gate grew 6 intersection checks (30 total). A real anatomy bug was
   caught mid-build (B-side lanes started with a divider against the median;
   fixed half-aware). The graphics core's inlined blockgen re-inlined from
   canon AGAIN (second time today — the sync gate keeps earning). Baked proof:
   slices/BOHEMIA_V12_INTERSECTION_PROOF_7_17_26.png. ALSO: the v1 arrows were
   ruled illegible at phone zoom (Paolo: "wtf is the purpose of these lines")
   — BOLD marking candidates cooked (banks/BOHEMIA_MARKING_BOLD_CANDIDATES_
   7_17_26.txt, UNJUDGED: 5px shafts, solid tips, edge-positioned pocket
   lines); the intersection proof renders them and IS their judging surface.
   If Paolo blesses the proof, bold goes through the verdict->volume flow and
   the v1 confetti arrows get graveyarded FOR ARROWS (per-class rule).
0b. FIRST COMMISSIONED ORIGINAL ART (7/17 night, Paolo's call: "you could
   hallucinate and actually draw yourself"): Vegas mast-arm TRAFFIC SIGNALS,
   drawn from scratch in the corpus style. tools/bohemia_traffic_signal_
   factory.py -> banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt: 12
   sprites, 3 mast variants (two-head+sign / three-head arterial / two-head+
   pole-mount+sign) x dead/red/amber/green. FOUR COOKS TO GET HERE, lessons
   banked: v2 sampled lum 40-150 off the lamp and built all-rust orange
   poles (the lamps' DOMINANT metal is the near-black cluster); v3 went
   dark-flat with per-pixel flecks and Paolo's zoom verdict was "looks like
   dog shit in comparison" — THE CRAFT LESSON: the corpus is PAINTED, not
   filled. v4 paints: tone ramp sampled from the lamp (5 steps + warm rust
   cluster), cylindrical shading with a dithered highlight band, 1px
   silhouette outline pass, rust as coherent BLOTCHES + drip streaks below
   joints (never confetti), stacked base discs, bulged collars, rivet seam,
   cap. ALSO FIXED: seed used hash(state), which is process-salted — the
   determinism law was silently broken v1-v3; fixed mapping now. THEN v5,
   because Paolo ruled a NEW LAW off v4: THE 45 DEGREE ART LAW ("every art
   ... has to be viewed from like a 45 degree angle... yours is like a flat
   90, like it's a 2D scroller"). All original art is three-quarter view:
   ellipse cross-sections, sky-lit visible tops, bands bow toward the
   viewer. Law: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md +
   CLAUDE.md law list; GATE THE SAME TURN: gates/art_45_gate.py (gate #18,
   ellipse-base + top-lit machine proxies on every registered commission
   bank). v5 stands on stacked ellipse discs with a lidded cap, bowed
   collars, sky-lit arm, heads with visible top + side faces. THEN v6
   (Paolo: "so close... do better. It's not good enough yet"), self-diagnosed
   against the lamp: (1) SHAPE — the arm is now a real smooth quadratic
   curve off a low junction, capped pole showing above it, nothing straight;
   (2) RANGE — a true 'spec' brass tone sampled at p97 of the lamp rides the
   highlight bands, rims, and clamp tops; (3) CALM — grain cut to 10%, bands
   decisive; (4) STORY — rust blob centers seeded below collars, base skirt,
   arm junction (where water sits), not scattered. THEN v7 (Paolo circled
   the base on his phone): OCCLUSION LESSON — the base discs drew AFTER
   the pole and read as standing in FRONT of it. Draw order IS depth:
   base first bottom-up, pole planted INTO the top disc (ends at its
   center line), back halves hidden, front rims wrapping the foot.
   Applies to every planted prop from now on. THEN v8 (Paolo's expansion,
   7/18 early): ARM LAW — arm reach tracks street width (1 lane -> short
   2 cells / 2 -> med 3 / 3 -> long 4.5, heads 1/2/3 like real warrants;
   mapping shipped in the bank as arm_law). COLOR RESEARCH — real masts
   are hot-dip galvanized (25-50yr zinc coat): majority weather to dull
   GRAY with rust at joints; only stripped ones brown to the lamp family.
   Two families cooked: galv + bronze. WRECKS — fallen_arm (jagged stub,
   span on the ground with a dead head still bolted), jury_rigged (lash
   splice, sags past it), headless (empty hangers, dangling cable).
   EAST+WEST both shipped per sprite with per-entry pcx anchors (bake
   reads pcx, no transpose). DOUBLE BORDER — sampled rim + 1px true black
   (Paolo: reading thin). THEN v9 (Paolo: "what about when it's facing
   north or south"): FACE LAW — in the billboard convention heads either
   face the camera (face s, lenses, serves northbound) or away (face n =
   the BACKS: yellowed plate, ribbed panel, visor edges poking out, no
   lenses; lit shows only as colored light SPILL around the housing;
   sign backs are unpainted metal, no green, nothing to read). Every
   intact mast ships both faces; the proof now stands all FOUR corners
   (south side faces, north side backs). THEN v10-v12, THE EAST/WEST
   SAGA (two wrong swings, banked so nobody swings wrong again): v10
   made skinny side-profile heads — Paolo circled them ("this is how the
   stoplight has to look, bro come on"): a stoplight NEVER diets, full
   mass always. v11 kept full heads on the horizontal arm with biased
   lenses — still wrong. THE RULING (v12, Paolo verbatim): "if its
   facing west or east it wont be having the stop lights extending east
   or west, left or right — it will be UP OR DOWN." Face e/w = the arm
   runs VERTICALLY on screen, spanning the EW road: arm_dir n (up) or s
   (down), FULL map length per the ARM LAW (grid distances never
   foreshorten in the billboard world), elbow + junction collar + tip
   cap, full-mass heads hanging along the arm at 66px spacing (46
   overlapped them into a totem), lenses biased toward the facing edge.
   draw_mast extracted and shared by both orientations. base_y per bank
   entry (vertical-south sprites extend below the pole foot; the bake
   anchors on base_y). MIRROR TRUTH RULE: flipping swaps e<->w and the
   bank stores the face AFTER the flip. THEN THE FACING-THE-STREET
   ARRANGEMENT (Paolo's arrow sketch on the proof, 7/18): one mast per
   SIDE, arms circling the intersection counterclockwise, every mast's
   lights facing the oncoming traffic on the road they hang over — N
   side arms east + lenses south (serves northbound), E side arms DOWN
   + lights west (eastbound), S side arms west + backs north
   (southbound), W side arms UP + lights east (westbound). The proof
   stands exactly these four; this is the placement law the engine
   wiring will follow once Paolo approves the art. CORRECTED same
   night (Paolo): (1) ONE POST PER CORNER — the engine's corner lamp
   yields wherever a signal mast stands; (2) every facing FLIPPED to
   the near approach: N side backs, E side lights east, S side faces,
   W side lights west. That flip exposed that arm chirality and lens
   facing are INDEPENDENT axes (a pole east of its road carries the arm
   west while lights still face east), so the vertical drawer grew
   head_facing and the bank now carries all four arm-side x facing
   combos. THEN ARM LAW v2 + LOOK-DOWN OCCLUSION (Paolo, same night):
   the arm extends HALFWAY ACROSS THE STREET covering every forward
   driving lane (1 lane -> 3 cells, 2 -> 6, 3 -> 9, heads ONE PER LANE
   at the lane centers, measured from the median end), and because the
   camera looks DOWN, the arm paints OVER the hanging heads. FINAL
   REFINEMENT (Paolo: "these should be under the pole, not jutting out
   to the side"): heads center DIRECTLY BENEATH the arm with a 4px lean
   toward the facing side (lens column clears the pipe), arm over their
   middles, clamps riding the arm. INTACT LOOK APPROVED by Paolo
   ("Awesomeee nice") — THEN v16 wrecks derived from it untouched
   ("take it how it is and break it and add it to the floor"): the
   horizontal fallen span now carries its lane-count of dead heads
   lying on their sides with glass; NEW vertical fallen_arm (both
   arm_dirs): jagged stub at the junction, the span lying on the ROAD
   beside its old line, dead heads on their backs staring at the sky,
   shattered lens glass. THEN v17 (Paolo): the broke-off span moved to
   THE BASE of the mast (lies on the floor from the foot out along the
   road), and a NEW wreck kind dropped_heads — pole and arm stay UP,
   the lights themselves lie dead on the floor below their clamps, one
   tipped sideways, glass around them (horizontal + vertical, both
   arm_dirs). Proof went HALF BROKEN HALF GOOD (N dropped_heads, E
   fallen, S+W intact) — Paolo: "So good!!!! Awesome!" THEN v18
   (Paolo: "broken street lights scattered around randomly on the
   floor nearby"): new kind SCATTERED — sheared stub + a seeded debris
   field: pipe chunks with torn ends at random angles, dead heads
   thrown in random rotations, glass, stray bolts; 3 variants per
   color horizontal + 2 per arm_dir vertical, every seed different so
   corners never repeat. THEN v19 (Paolo x2): (1) scattered FOR ALL
   DIRECTIONS — scatter demo proof slices/BOHEMIA_V12_SCATTER_PROOF_
   7_18_26.png stands debris fields on all four sides (bake gained a
   corner_mode arg; the approved half-broken proof unchanged); (2) THE
   SALVAGED HEAD ("people taking these red green yellow stop lights
   for themselves... world building"): the lone dead head as a
   standalone portable texture, 4 carry poses (kept/side_l/side_r/
   flipped), in the bank under salvaged_heads with salvage_lore.
   [PENDING Paolo]: WHERE salvaged heads appear around the map (MAP
   LAW — texture ready, placement is his). 348 sprites + 4 salvage
   props; wrecks + non-approved classes still UNJUDGED. JUDGING SURFACE
   READY: tools/BOHEMIA_SIGNAL_PICKER_7_18_26.html (gen:
   tools/bohemia_signal_picker_gen.py) — 16 classes, SUN MODE, thumbs +
   comments + export .txt. Paolo taps when ready; UP unlocks the cooked
   volume, NO -> graveyard w/ post-mortem; verdicts land in /records. Laws:
   DEAD is default (act-1 grid pending), lit lenses rgb-only glow, sign
   plates ILLEGIBLE (names are Paolo's), zero purple. STATUS: UNJUDGED.
   Two dead-state masts are composited onto the intersection proof (SW
   arm-east + NE mirrored) as the judging surface, same as the bold
   markings; bank carries pole_center_px for the bake's anchor math. PROOF
   PLACEMENT ONLY: engine prop placement waits for approval.
1. V12-class bake: THE BAKE FACTORY EXISTS (7/17, tools/bohemia_bake_factory.py
   — rebuilt from the harmonized pools' data-laws: 88/12 weather rarity, family
   edge harmonization, the APPROVED marking bank for native cell.mk, dark lamps).
   7/18: WRECKS + FIRE BARRELS ARE IN — tools/bohemia_street_prop_extract.py
   derives banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt (20 top-down cars from
   HD part2 "Abandoned cars" — the V11 bake's own family — + 12 burn barrels
   from the demo prop pool, provenance recorded, corpus art not new canon);
   the baker composites car_wreck per the engine's w x h + facing (rot90 for
   EW) and fire_barrel/lamp props over them. ALL FOUR live cells baked:
   slices/BOHEMIA_V12_BAKE_PROOF_{33,34,35,36}_6.{png,html}.
   THE V12 SLICE = THE INTERSECTION, WALKABLE (7/18, v2 after Paolo's
   verdict on v1): tools/bohemia_v12_slice.py bakes the intersection with
   ALL FOUR STOPLIGHTS standing at their approaches (bake_factory
   --intersection 3 3 intact; new 'intact' corner_mode + an .occ.json
   sidecar of the SOLID cells), wraps V11's harness verbatim (light pass,
   patrol, walk loop; the 3 overlay payloads removed). Result:
   slices/BOHEMIA_LIVE_SLICE_V12_7_18_26.html — 24x35, opens in DAYLIGHT
   on the south approach framing a 3-head mast, only 4 OCC cells (the mast
   pole bases; the road/box/crosswalks fully walkable), verified in
   chromium: player roams the whole intersection freely in all 4 dirs, 0
   errors. V1 LESSON BANKED (Paolo: "the intersections and street lights
   aren't even here... invisible walls everywhere... you made this to
   smell your own fart"): v1 showcased the native-bake PLUMBING (4 random
   street cells) and blocked every wrecked-car footprint on the road ->
   no signals + invisible walls. FIX: show the CONTENT he cares about
   (the intersection + our stoplights) and only block real posts.
   THE THESIS still holds (bake IS the world, zero overlay).
   THE MOJAVE RENDERS (7/18): the desert around dead Vegas now bakes.
   tools/bohemia_desert_extract.py -> banks/BOHEMIA_DESERT_POOLS_7_18_26
   .txt (seamless-certified pale-sand ground from GROUND_SEAMLESS_SET's
   "Soil and dirt tiles" + HD rocks + rubble, corpus art no canon), and
   bake_factory --desert renders the engine's procedural desert block
   (24x14: sand + scattered rocks/rubble + a soft radial scorch scar).
   GRID-KILL LESSON: raw HD ground tiles have dark borders -> tiling them
   grids/checkerboards; fix = crop the inner ~78% past the border + use
   ONE sand tile with per-cell flip + gentle tone jitter (mixing 8
   variants made a checkerboard). Proof: slices/BOHEMIA_V12_DESERT_PROOF_
   7_18_26.png. ROCKS TANNED (Paolo: "the rocks should be more tan") —
   bake-time warm tint (R*1.18,G*1.02,B*0.72, then B clamped <= G so no
   cool shadow reads purple + stone stays sandstone). THE MOUNTAIN
   RENDERS TOO: bake_factory --mountain -> slices/BOHEMIA_V12_MOUNTAIN_
   PROOF_7_18_26.png — the engine's dense boulder field (123/block) as
   tan sandstone (Red Rock / Spring Mountains) on stonier ground. LESSON:
   the HD "Rock Formations" packs are FANTASY green/lava rocks (wrong);
   the Mojave stone is HD "Rocks and stones" tan-tinted. Desert + mountain
   are the two UN-gated wilderness types and BOTH render now;
   wash/solar/farm/airfield still need cooked+judged art. NEXT for the
   bake track: plot/building strips (HOUSE_FACTORY_BANK) when Paolo gives
   plot canon; and folding these terrains into the overmap / a walkable
   wilderness slice whenever wanted.
   LIVE-SLICE HOSTING (7/18, Paolo asked how to host slices in the alpha
   organically): the alpha's menu is a TAB BAR (char/anim/rig/combat/
   music/city). The design: ONE new tab points at a STABLE URL,
   slices/BOHEMIA_CURRENT_SLICE.html, and slices/SLICES_MANIFEST.json
   decides which slice it shows (current pointer + a short entries list,
   catalog-ready but no catalog until the game ships). Updating the slice
   = bump the manifest + rerun tools/bohemia_slice_host.py; the 31MB alpha
   NEVER changes again. Loader built + verified (card in the alpha's style,
   ENTER loads the slice full-bleed + BACK bar, 0 errors). TAB NAME LOCKED
   BY PAOLO: "SLICE". The alpha tab handler is generic (removes 'on' from
   all, adds to clicked, shows #p-<data-p>), so the insert is TWO divs, no
   JS change:
     (a) after the CITY tab in <div id="tabs">:
         <div class="tab" data-p="slice">SLICE</div>
     (b) a panel in <div id="stage">:
         <div class="panel" id="p-slice"><iframe src="BOHEMIA_CURRENT_SLICE.html"
           style="width:100%;height:100%;min-height:78vh;border:0"></iframe></div>
   DONE 7/18 (Paolo reported the mobile menu bug directly — "the top menu
   is fucked on mobile, I should be able to drag it"): the SLICE tab is IN
   the alpha, AND the tab bar is now properly mobile-scrollable. The bug:
   6 tabs summed to ~374px, jammed edge-to-edge at 390, and the game's
   global touch handlers ate native scroll so it wouldn't drag. Fix (all
   in #tabs, a region the ragdoll session never touches): touch-action:
   none + a window-driven pointer-drag handler that owns scrollLeft (works
   mouse + touch), padding:0 10px breathing room, click-suppression after
   a >8px drag so a drag never fires a tab, grab cursor. SLICE panel lazy-
   loads BOHEMIA_CURRENT_SLICE.html on first open. VERIFIED in a 390px
   mobile chromium: alpha boots, 7 tabs (scrollW 444 > 390, 54px drag
   range), SLICE activates + loads the slice, 0 console errors.
   ONE-ALPHA honored by COORDINATION not avoidance: synced the alpha to
   the latest origin/main FIRST, patched only the tab region, pushed
   non-force so a concurrent ragdoll push rebases cleanly (different
   regions). Future: when a slice updates, only the manifest+loader change
   — this alpha edit never repeats.
2. Questbook mining: PAUSED AT 68 pending Paolo's lane pick (see below).
3. Alpha absorption: preflight GO since 7/14; ONE session, WITH Paolo.

## NEXT ACTION
Whatever Paolo picks off the PENDING shelf; if he says "do what's next"
without picking, the standing default is: keep the gates green, consolidate
(this file stays a pointer; STATE_OF_PLAY carries the day), and take the
largest unblocked item in IN FLIGHT.

## OPEN FORKS PENDING PAOLO (never decide these)
- THE MINING FORK: fresh game names / systematic re-mine of the ~72-game pool
  / the 136-file backfill queue (the gate counts it every run).
- THE NEXT WALL CLASS: names one -> the 47 waiting candidates re-enter
  judging under its banner (banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26.txt).
- GRAPHICS EYE-CALLS: lamp pairing at (16,44)/(2,44); patrol owner colors
  (placeholder grays); 101 purple world tiles kill-or-REDMAG; flashlight_36
  orange-or-cool-white; siren_blue; ASPHALT_BASE rgb; NETWORK zone placement;
  suburban kit path; single-file alpha vs streaming launcher (NOT locked).
- QUEST: the 7/16 list stands unchanged (relationships-gate-arcs, Q135
  mindscape centerpiece, Q130 Act 2 spine, Q124 Emil grammar, Q131 betrayal
  staging, Q115 SOMA-truth, when to end research/start compile, production
  quests 046-053 + master compile PARKED).
- STANDING: act-1 grid-power ruling / ragdoll head+neck / multi-enemy dial /
  pinch-zoom cap / perks gap / female + child rigs / gloves slot / mirrored
  garment art / currency logos.
- ANIMATION, THE SECOND DEATH (7/18, UNJUDGED, now a FAKE-PHYSICS RAGDOLL):
  'headshot-2' beside 'headshot' THE TOPPLE (v1, untouched). The whole arc:
  physics-crumple -> keyframe-crumple (Paolo: "so stiff") -> RAGDOLL. Paolo's
  order: "have RULES FOR THE LIMBS and ragdoll it based on a fake physics thing
  for all directions" + he REVOKED the FACE-LAW head lock ("head always faces
  north, i dont like that anymore -- move it with the body"). Built a clean
  Verlet ragdoll (RG in the alpha): gravity + rigid bones + torso braces +
  LIMB HINGE rules (elbow/knee one-way, partial-correct) + a NECK CONE so the
  head flops in range. FREE HEAD that ROTATES with the body via headStampFrame
  (RG_HEADROT follows the real neck->headTop bone; the rigid-upright stamp WAS
  the 'faces north'). Per-direction shot impulse = 8 distinct falls. Anti-jitter
  (the hard part): speed cap + SOFT floor push (hard clamps caused 20-30px leaf
  teleports) + 2.5px/frame per-joint MOVE CAP + freeze-on-settle; waist-centered
  camera + fixed floor. None of v1's fighting laws. Verified all 8 in frame,
  freeze, distinct rests, head rotates. Record: records/BOHEMIA_ANIM_DEATHS_
  7_17_26.txt. Combat bakes both deaths. Judge the FEEL in ANIMATION tab,
  'headshot-2'; headshot-3 still on the table if the ragdoll feel needs tuning.
  LESSON BANKED: verify animation by WATCHING motion, never static frames.
- MUSIC (verdict pass 7/17 PROCESSED; gate #17 gates/music_gate.js guards it
  all): CANON now: THE CANCELLED MAN, THE WIND LEARNS WORDS, THE PIT BOSS IS
  GONE (Paolo loves it; added to the OVERWORLD playlist, now six, his verbatim
  "add to overworld rn"). BURIED 7/17: SUNKEN VESPERS, UNDERTOW (no kill
  reason given; post-mortem in the embedded repo block). FRESH + UNJUDGED
  (batch 9b, NEW badges live): TAPS FOR THE VALLEY (ladderhorn, harmonic-ladder
  bugle) / WHAT THE DAM HELD BACK (tidewheel, nested-AM cascade). STILL
  UNJUDGED from before: SALT ON THE HIGHWAY, WHAT GROWS IN THE VAULT, THE LAST
  TABLE STANDING, MOJAVE GHOST, LONG WALK HOME, ONE CANDLE, MOB THE HOUSE
  REMEMBERS. UI shipped 7/17 per Paolo: export COPY fixed (modern clipboard
  first; the old order burned the iOS gesture window), COMMENT SECTION at the
  bottom of the music page always (persists, rides the export as PAOLO
  COMMENTS). Repair banked: the 7/8 "CANON baked" claim for THE LAST DEALER
  FOLDS + WHAT THE MIRRORS KEPT had never landed in CANON_DEFAULTS; landed now.
  A verdict claimed is not a verdict baked.

## THE QUESTBOOK TRACK — LOCKED LAWS (folded 7/16 from the launch handoff)
Every law below is CONFIRMED in the research corpus (verified by grep at the
merge: the files are all in the repo). This list is the SUMMARY of what the
questbook sprint concluded, and it lived in exactly one file. Now it lives here.

- **FORMAT LAW v2**: every quest file carries CAST + WHAT EACH WANTS,
  CONVERSATIONS as node trees (gates/TRAPs/SILENCE/NOVERBs), BRANCH MAP with
  counts. Gate: exactly 10 W-points, >0 option lines, END marker.
  (`BOHEMIA_QUESTBOOK_FORMAT_LAW_7_16_26.md`)
- **.bq FORMAT**: plain-text quest format, roles cast at runtime (Bethesda alias
  model), **STAT/KARMA GATES BANNED AT PARSER LEVEL**. Validator: alias-fill,
  orphans, dead links, named-body zero-loot, round-trip. (`bohemia_bq.js`, 29/29)
- **Target RAISED: >90 individual quests at v2 before master compile.** At 54.
- **BATCH LAW**: `BOHEMIA_QUESTBOOK_BATCH_LAW_7_16_26.md`

**LAW LOCKS STAGED FOR COMPILE** (confirmation counts live in the questbook index):
  - COMPREHENSION IS A BRANCH (11x confirmed)
  - AUTHOR-CANNOT-DELEGATE + HEIR-CANNOT-DELEGATE (one law)
  - ABSENT-PARTY DECISION (3x)
  - RESCUE-DENIAL register (4 instruments)
  - truth-delivery grid (unasked / begged-against / pre-authorized)
  - honest-devil set (buys / collects / exchanges / hosts / dominates)
  - exit-design theory (last-exit / first-exit / no-exit)
  - THE FINALE IS A LEDGER-READ (theater Q136 + arithmetic Q137 + rooftop Q102)
  - persuasion trilogy (deserved / written / midwifed)
  - HELP DECLARED IS HELP DENIED + verbs-removed-for-the-hearer
  - NO KARMA BAR (4-leg proof)
  - reward-flat forks, or the gradient is the point
  - @REDLINE companions
  - lures need ledgers
  - singleton registry (one Strange-Man, one Papyrus-class, one Sheogorath-class
    per game)

**FRESH MINING QUEUE** (from the ~72 whole-game teardowns still in the pool):
  Witcher contracts · Kenshi second story · Sunless Sea · Spec Ops white
  phosphorus · Undertale Sans · Obra Dinn · Mask of the Betrayer · Tyranny ·
  SH2 Eddie · Vampyr citizen-webs · Shivering Isles · Vaermina · Pamela-sibling
  files (Sharp/Flat, Ikana suite)

**ENGINE BACKLOG, EACH WITH A NAMED TEST**:
  - THE SETTLEMENT'S MISSING-PERSONS ORGAN (demanded by Q133/Q134/Q138) +
    vigilant-order response states
  - generational audit engine (Q137 PORT 1)
  - Fold ledger-view (Q136 PORT 1)

**EXTRACTION REPOS** (what the research is FOR):
  CRAFT_MASTER / FLAWS_MASTER / CONVERSATIONS_MASTER / **PORTS_MASTER = THE BUILD
  QUEUE**. PORTS is the one that turns research into game.

## BANKED LESSONS (folded from the questbook handoff, 7/16 merge. Do not lose.)
- **THE #102 INCIDENT.** A carried note said "two files at #102, fix the collision
  at compile." It was WRONG: not a collision, a LOSS. The EMIL file had been built,
  verified, shipped and presented, and was gone anyway. Transcript grep recovered
  it verbatim; it is now #124. FOUR LESSONS: (1) NEVER-LOSE-FILES LAW works and
  paid for itself; (2) a deferred fix is a fix that never happens, fix on
  discovery; (3) same-number-different-filename does NOT collide at the filesystem
  level, so it survives silently until someone counts: AUDIT BY NUMBER, NOT
  FILENAME; (4) never trust a carried note about file state over `ls`.
- **THE ZIP INCIDENT.** The first archive zip globbed BOHEMIA_QUESTBOOK_* only,
  silently excluding 57 files of Paolo's actual written work sitting in the same
  directory. LESSON: a wrap zip globs by DIRECTORY, then subtracts what is
  deliberately excluded. It NEVER globs by name prefix, because a prefix silently
  drops everything that does not match. Diff zip contents against disk every time.
  (This bit AGAIN at the 7/16 merge: a `*HD_TILE_REPO*.txt` skip glob also ate the
  `.chunkmanifest.txt` files. Same failure class, six days later. The diff caught
  it both times. THE DIFF IS THE GATE.)
- **THE GDD NEAR-MISS (7/16).** Two inherited registries claimed v2/v3/v4 were
  superseded by v5. Both wrong. v5 EXTENDS them and says so in its own first line.
  Archiving on that claim would have deleted the three-dynasty arc, the
  Amalgamation's origin, the Fifth Dimensional Element, the endgame and the fold.
  Caught only because Paolo asked "did you read the GDDs." LESSON, now gated by
  gdd_gate.js: a registry line is a CLAIM, not evidence. Read both documents
  before anything stops riding.
- Questbook files 01-16 run 11-13 craft points BY DESIGN (early format). Not
  damage. Do not "fix."
- Flaw laws locked 7/16: (12) the music repo's most emotional cue must have a KILL
  PATH (Q123, SCREECH LAW); (15) if a character asks the player for something, let
  the player be asked FOR REAL (Q124).
- Craft findings 7/16: the horror is the CLIPBOARD not the cross (Q122); mercy
  shows up in the PASSENGER MANIFEST (Q123); the enemy faction leaves if you fix
  their logistics (Q123); hope as a 12.5% trajectory improvement (Q123); the room
  list AS the atrocity (Q124); quest hooks as FORGERIES sent by people who love the
  target (Q124).

## DO NOT LOSE
- Paolo works from iPhone + two laptops. The alpha is stale and he wants ONE
  beautiful package: launcher UI tying alpha + music menus + character
  customization, fast on phones. First big build of the repo era. ONE session,
  with him, ONE-ALPHA LAW.
- Zero-dialogue-by-design registry (never "fix"): questbook #99 #104 #110 #114.
- 40/79 questbook files are superseded AS PRIMARY only (#122/#123 are primary).
  Both still ride. Registry-not-deletion.
- HD tile repos are NOT in the seed. They travel as chunks, separately.
- 103+ songs, faction genre bible locked for all 13 factions, music repo embedded
  in the alpha (lines 3249-5465), extractable as bohemia_music.js.
=== END HANDOFF ===

## SUBURB VERDICT (7/18): CUL-DE-SACS APPROVED, SCALE CHECK PENDING
Paolo verdict: CUL-DE-SACS UP; THE LOOPS + GARDEN CURVE DOWN (records/BOHEMIA_SUBURB_VERDICT_7_18_26.txt). He HELD graduation: 'before we continue I want to see house size vs the character, real human-vs-house ratios (single/two story).' SCALE STUDY is now the SLICE current: slices/BOHEMIA_SCALE_STUDY_7_18_26.html (tools/bohemia_scale_study.py) — 0.75 m/tile, a 1.75 m human vs single-story (14x11 m, 5 m) + two-story (11x10 m, 7.5 m) houses, top-down + elevation, toggle/check/export. ON SCALE SIGN-OFF: graduate cul-de-sacs into bohemia_plotgen at REAL dimensions, drop loop/garden from the generator + graveyard them (reference-clean), homes exist -> LIFE opens. [PENDING Paolo: scale sign-off].

## SUBURB — MODULAR, BOTH LEVELS (Paolo 7/18 eve: "houses + neighborhood must be modular")
DONE + gated (gates/suburb_modular_gate.js, 14 checks; laws/BOHEMIA_ADDENDUM_MODULARITY_LAW):
- HOUSE FACTORY: typed MODELS[] in engine/bohemia_suburb.js — varied width (13..21),
  garage size + SIDE (L/R corner), and STORIES (2-story stamps inset upper floor code 9,
  reads taller). Per-lot deterministic. No more clones.
- STREET-AWARE + MERGE: generate(seed,{cw,ch,streets:['S','E',...]}). Gates ONLY on the
  edges that face a street; a CORNER exits two streets; neighbor cells MERGE into a
  connected cw x ch union (one wall, one network, gates scaled per edge — 2x1 = 2 gates
  on the main street). ~19 homes 1x1, ~50 at 2x1, ~107 at 2x2. Old generate(seed,'ring',
  cw,ch) still works.
- Proof (STILL image, not walkable — Paolo: don't make me walk unless near-done):
  tools/bohemia_suburb_modular_proof.py -> slices/BOHEMIA_SUBURB_MODULAR_PROOF.html.
  Sent Paolo the screenshot. WALK CAMPANA slice still current + works with modular houses.
WORKFLOW NOTE (Paolo 7/18 eve, LOCKED): do NOT spend tokens on walkable demos for him to
judge unless a thing is ALMOST COMPLETE. Still top-down proof images are fine for progress.
NEXT (mine, unblocked): fold into the FULL world model — overmap/bridge tells a residential
cell which edges face streets + whether it merges with same-type neighbors, then calls
generate() with those streets+shape; world().plot() returns correctly-gated varied homes.
Then LIFE (agents move in).

## SUBURB — APPROVED + GRADUATED TO WALKABLE (Paolo 7/18 verdict: THE BLOCK is UP)
VERDICT (records/BOHEMIA_SUBURB_VERDICT_BLOCK_APPROVED_7_18_26.txt): THE BLOCK (packed
grid) UP = canonical suburb; the central cul-de-sac court DOWN = graveyard (post-mortem
logged, court branch/throughStreet REMOVED from the generator, no respawn). Path taken
through the rejections that got here: empty-band bug (self-inflicted asymmetric wall
reject) -> rail+rung dense fill packing the whole block; dead ground rendered near-black
-> textured dead-dirt so backyards read as dead earth not void.
GRADUATED SAME TURN (approval -> implement): slices/BOHEMIA_SUBURB_WALK_7_18_26.html
(tools/bohemia_suburb_walk.py) — the approved block, WALKABLE. Spawn at the gate, walk
the dead streets, step on any yellow front door -> stand INSIDE that house's live
floorplan rooms (engine/bohemia_floorplan.js), walk out. 22 homes, all enterable.
Verified chromium (0 errors, interior render confirmed). SLICE current='subwalk'.
Gate #22 now 11 checks (added: no-vegetation dead-world, wall-backyard, campana n/a,
enter-path = every house yields a valid floorplan). engine/bohemia_suburb.js
generate(seed) is the ONE canonical block (style arg ignored, court gone).
NEXT (mine, unblocked): fold suburb houses into the FULL world model — bridge/blockgen
must emit these house footprints at the world scale so world().plot() over a residential
cell returns real homes (today the walk is a standalone slice; the world model still owes
suburb footprints via the bridge). Then LIFE (agents) once homes exist valley-wide.

## SUBURB — DEAD WORLD + 3-TILE WALL BACKYARD + YOUR TRACT (Paolo 7/18, three angry corrections)
Paolo rejected the block hard with three concrete complaints. ALL THREE fixed + machine-gated this turn:
1. "WHERE IS MY NEIGHBORHOOD I CAN THUMBS UP." -> Added the CAMPANA DR candidate (engine/bohemia_suburb.js style 'campana'): his real tract at 8xxx Campana Dr / 89147 reconstructed at 0.75 m/tile — walled block, homes packed all around the perimeter, an interior cul-de-sac court (the real "perimeter + court" Vegas tract off Tropicana: Van Carol->Mt Nido->Jadero->Campana). It is now the FIRST card in the judge, thumbs-up-able. ~14-16 homes (matches real ~0.15-acre lots on a 96 m block).
2. "EVERYTHING'S DEAD IN ACT 1 — no water for lil bushes, no grass, no trees, no pools." -> Stripped ALL vegetation. Removed the backyard tree/pool fill; codes 7/8 are never emitted. Judge palette is dead (dead-dirt ground, no green, no pool-blue). Gate asserts NO tree(7)/pool(8) anywhere (DEAD WORLD check).
3. "HOW DARE YOU PUT THE END OF THE HOUSE TOUCHING THE WALL — at least a 3-tile border for backyards." -> home() now rejects any footprint within 3 tiles of a wall; the ring inset was pushed out so every perimeter home keeps a >=3-tile DEAD backyard to the wall. New WALL BACKYARD LAW check in gates/suburb_modular_gate.js (ring + campana, no house cell within 3 of a wall).
Gate #22 now 10 checks (added wall-backyard, dead-world, campana-renders). ALL GATES GREEN. Judge shows TWO cards (Campana + the packed grid block), SLICE current='suburb'. Verified in chromium (0 errors). [PENDING Paolo: thumb Campana vs the block].

## SUBURB REMADE — WALLED-BLOCK MODEL (Paolo 7/18, two corrections)
Graduating cul-de-sacs surfaced two rulings that rebuilt the home + block:
1. HOMES BACK ONTO THE PERIMETER WALL. Backyards to the wall, fronts (driveway+garage) facing an INTERIOR street. So streets run inside, one home-depth off the wall; homes fill the band to the wall + the interior. The old 'grid of culs' schematic was wrong; the block is a walled ring.
2. DRIVEWAY = A CAR APRON, not a runway. 3 tiles long x 4 wide (2 cars). The GARAGE is the FRONT CORNER of the house; the house is the bulk. (Was: long driveway+garage+body strip, driveway bigger than the house — Paolo: 'what is wrong with you.') Fixed in engine/bohemia_suburb.js home().
engine/bohemia_suburb.js is the candidate generator (BohemiaSuburb.generate(seed,style,cw,ch), styles culs/double/court, real 0.75 m/tile, cluster-aware, ~18-23 homes/96 m block). Old tools/bohemia_suburb_gen.js RETIRED (loop/garden gone). Judge tool remade at 1x1 (Paolo: 'start with one grid'), SLICE current='suburb'. Gate #22 gates/suburb_modular_gate.js updated: connected + homed + garaged at 1x1/1x2/2x1/2x2, footprints house-sized (6-30 tiles), deterministic.
PRIOR VERDICT still stands (cul-de-sacs approved); these are the corrected designs for a fresh thumb. On pick: graduate into plotgen, homes exist, LIFE. [PENDING Paolo: re-verdict the remade designs].
