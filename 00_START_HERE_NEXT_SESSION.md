=== BOHEMIA HANDOFF 7/17/26 (REPO DAY ONE COMPLETE) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md ->
BOHEMIA_CANON_INDEX.md -> laws/BOHEMIA_STATE_OF_PLAY_7_17_26.md (the full
account of repo day one lives THERE; this file stays the pointer, not a pile).

## THE CITY TAB HIJACK - POST-MORTEM (7/19, Paolo caught it: "the city
## builder that we had from the previous build... what's wrong with you")
WHAT HAPPENED: the CITY tab was NEVER an empty tab. The alpha carries the
previous build's ENTIRE streaming Las Vegas city builder embedded as
CITY_B64 (source bohemia_city_unified.html, 22MB decoded: isometric city,
the Strip, day clock, REROLL, UNDER layer, DROP IN with the character,
CITYSAVE suspend saves, prefab pool bridge, city music bridge). It boots
DYNAMICALLY on first CITY tap: the loader creates an iframe named
cityFrame only if none exists. The LIFE session saw `<div id="p-city">`
EMPTY in the static DOM, concluded the tab was unbuilt, and planted a
static iframe... NAMED cityFrame. The loader's guard found it and silently
never booted the real city. Paolo tapped CITY and got a flat colored map
instead of his city builder. REVERTED same turn: panel restored empty, the
real city verified booting again in chromium (isometric render, HUD, 0
new errors).
THE LESSON (verify-on-the-real-surface, extended): AN EMPTY DIV IS NOT AN
EMPTY TAB. Alpha panels boot dynamically on tap. Before claiming ANY alpha
surface, open the tab on the REAL alpha and watch what it does - and grep
the alpha for the panel id + B64 payloads first. MACHINE LOCK: city_tab_
gate now asserts CITY_B64 present, the dynamic boot guard intact, NO
static cityFrame ever again, and the aerial map page wired nowhere.
STATUS AFTER REVERT: the aerial map page (slices/BOHEMIA_CITY_CURRENT.html,
skeleton-as-itself + city-builder verbs) is a DORMANT STANDALONE, linked
nowhere; engine/bohemia_cityedit.js (delta verbs, skeleton sacred) stays
gated + dormant - the delta design still fits whatever save system the
real city grows. THE REAL OPEN QUESTION [PENDING Paolo]: the embedded city
builder is the OLD monolith - it REROLLS its own world and predates the
7/18 canon streets (mile grid, 215/I-15, connectivity laws). Marrying the
real city builder to the canon overmap streets is the actual "implement
the streets" job, it is big, and WHO does it (this session, the overworld
session, a dedicated one) is Paolo's call.

## SESSION SCOPE AMENDED: LIFE + CITY SURFACE (Paolo 7/19: "add an additional
## title to this chat, like life plus tiles")
The LIFE session also owns the CITY TAB SURFACE now. Division per ONE SYSTEM
ONE SESSION: the overworld session keeps the GENERATORS (bohemia_overmap /
world / districts); this session renders them READ-ONLY into the CITY tab,
exactly like it consumes the clothing factory's wardrobe. DONE SAME TURN:
the CITY tab (empty div since birth) now shows the whole generated Vegas
live - tools/bohemia_city_tab.py -> slices/BOHEMIA_CITY_CURRENT.html (stable
URL, lazy iframe): mile grid, 215 beltway, I-15/95, rail, Lake Mead,
mountain ring drawn as themselves, every buildable district as DESERT until
grown on (the blessed 7/18 aerial proof's exact palette + rules); drag pan,
pinch/wheel zoom, tap a plot for its district. Gate #CITY TAB (9 checks):
embedded overmap BYTE-LOCKED to the canon engine body (overworld reshapes
streets -> gate red until the page is rebuilt), skeleton law replayed
against the live enum, no empty-tab regression. Verified 390px chromium.
CITY-BUILDER VERBS SHIPPED (7/19 later, v2): engine/bohemia_cityedit.js -
DEMOLISH a buildable plot to the desert underneath, BUILD a canon district
onto empty desert, THE SKELETON IS SACRED (streets/freeway/rail/water/
mountains untouchable, machine-enforced). Edits are a serializable DELTA
over the generator, device-local (localStorage) until the save system;
RESET restores the generated valley. One canonical category body shared by
render + verbs. Gates #CITY EDIT (13) + #CITY TAB (11, both embedded
modules byte-locked) BOTH registered in bohemia_gates.py (the tab gate had
been left unregistered a turn - caught, fixed). Verified on the real
surface: demolish/build/persist-across-reload/skeleton-refuses, 0 errors.
NEXT for the CITY surface (in order, mine): (a) 4-lot big buildings on the
delta (Paolo's plan), (b) zoom a region into the walkable street/desert
bakes, (c) LIFE's census layered on the map (population per district once
the die-off dial is ruled). Costs/unlocks/what-can-build-where: [PENDING
Paolo].

## LIFE PARKED DORMANT (7/19, Paolo, same day it opened - SEQUENCING RULING)
Paolo saw the LIFE tab and ruled the sequencing, distilled from his words:
(1) TOO EARLY TO SURFACE, not too early to build - "I'm glad you have the
plumbing done" but judging 20 gray skeletons on semantic tiles violates his
standing don't-make-me-walk-it-until-almost-complete law. NO VERDICT OWED on
the LIFE tab; nothing to thumb. The tab stays in the menu un-judged (he may
ask to hide it).
(2) THE ECONOMY CANNOT BE TUNED AGAINST A WORLD THAT DOESN'T EXIST - "we
haven't even put a resort casino... all we really have is one park, one
suburb, one corner store, one hospital." The gates prove the math behaves;
they cannot prove the numbers are TRUE until the valley is built (casinos,
Strip, his placed canon). DO NOT tune economy constants or surface economy
numbers at Paolo until the world is built enough that they come FROM
somewhere.
(3) THE ORDER: build the world out first. LIFE + economy machinery sleeps,
loses nothing, and reads the real world when it exists (it already reads
world() - that was the design). When LIFE resurfaces to Paolo it must wear
the REAL art: actual tiles, the real dressed rig, ~90% less on-screen text.
The section below stays as the record of what was built and gated.
TWO CORRECTIONS SAME DAY (Paolo, fixed + gated the same turn, LIFE gate now
20 checks): (1) VACANCY - not every house has inhabitants; most homes are
abandoned shells. OCCUPIED_RATE dial in bohemia_agents, ships 0.30 as a
FLAGGED PLACEHOLDER ([PENDING Paolo: the real die-off number for the map]).
(2) STAGGER - no more lockstep: four life archetypes (worker staggered
shifts 05:30-09:00 / scav own clock / keeper barely leaves / watch out at
dusk), wake times spread over hours. Slice regenerated: 14 people in 6 of
23 houses, economy panel REMOVED from the surface (parked), text cut way
down. Verified in chromium, 0 errors.
RUNGS 1-2 BUILT DORMANT (7/19 late, "do what you have to do next"): the
TWO-PLANE SIM off the research bank, pure plumbing, zero surface. Population
layer (Zomboid): censusForPlot/sampleValley in bohemia_agents - the valley
holds people as numbers, same hashes as materialization so census ===
bodies EXACTLY. Offline plane (STALKER): whereAt/offlineSummary = the far
sim, zero stepping, gated cheap + gated to AGREE with the online bubble.
Gate #POPULATION (8 checks) in bohemia_gates.py. WHAT COMES AFTER for LIFE,
in order, all waiting: rung 3 smart advertisements (roled rooms/props
advertise acts - needs the world's objects to exist), rung 4 bounded
deviation + witness memory (quest fuel); resurfacing LIFE to Paolo waits on
REAL ART (tiles + dressed rig at world scale); factions acting waits on
Paolo's tables (FACTION_ASSIGN/DRESS/ECONOMY); economy tuning waits on the
built world. The LIFE lane is now built to the edge of what the world's
readiness allows.
RUNGS 3 + 4a BUILT DORMANT (7/19 later, "do what you have to do next"):
ROOM ADVERTISEMENTS (Sims pattern) - rooms advertise acts, at-home agents
live through the house across the day (kitchen at meals, living evenings,
own bed at night, occupants never stack); sim.homeSpots() feeds any future
render; LIFE gate 20 -> 24 checks. WITNESS MEMORY (SoD pattern) -
engine/bohemia_memory.js + gate #MEMORY (9 checks): ring-buffer minds,
familiarity slows decay, lastSeenAcross answers "when did anyone last see
H3-2" - THE SEED OF THE QUESTBOOK'S MISSING-PERSONS ORGAN (Q133/Q134/Q138).
RUNG 4b BUILT DORMANT (7/19 latest): BOUNDED DEVIATION - deviate() with
mechanism verbs (goto/flee/stay_home), expiry REQUIRED, 20% cap, re-
convergence to schedule, offline plane stays the plan. Gate #DEVIATION
(11 checks). The Radiant lesson is now machine law.
THE LIFE LANE IS COMPLETE TO ITS DESIGNED EDGE. Every remaining item is
blocked on its proper unlock: RESURFACING needs real art (tiles + dressed
rig at world scale - the art/world sessions' rung, LIFE's engine is ready
to receive it); FACTIONS ACTING needs Paolo's tables (FACTION_ASSIGN /
DRESS / ECONOMY); NAMES + THE MONEY are Paolo's; ECONOMY TUNING needs the
built world; DEVIATION TRIGGERS need events (combat/quests). A future LIFE
session's standing default: keep gates green, re-bank the wardrobe when
DRESS goes red, and wait for the unlock - do NOT invent content to fill
the silence.

## LIFE OPENED - THE VALLEY HAS PEOPLE (7/19, LIFE session, branch claude/bohemia-life-session-9fbnyj)
The LIFE ladder from the world-model roadmap is BUILT and in the alpha. Three
factories, each gated same turn (gates 21-23 in bohemia_gates.py: LIFE 14 /
DRESS 9 / ECONOMY 13 checks): engine/bohemia_agents.js (typed agent =
{home room, job, 1440-min schedule} placed BY world() - agentsForPlot;
households mean ~2.2; jobs read off the real overmap within radius 3;
block sim with OCCUPANCY + BFS walk, one world-turn = one world-minute),
engine/bohemia_dress.js (outfits from the canon wardrobe; the 78 canon
garments extracted READ-ONLY from the clothing factory's GARMENTS array into
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt by tools/bohemia_wardrobe_extract.py;
DRESS gate freshness-checks bank vs the alpha's live canon count - wardrobe
grows, gate goes red, rerun extractor), engine/bohemia_economy.js (grounded
scarcity: 4L/day desert water, 2000kcal rations, barter in salvage-kg,
hyperbolic siege pricing capped 40x, conservation gated; commodity money
[PENDING Paolo]). ALL assignment tables EMPTY per MECHANISM-MINE:
FACTION_ASSIGN / FACTION_DRESS / FACTION_ECONOMY + agent names are H3-2
designations until Paolo rules. Full spec: laws/BOHEMIA_LIFE_SPEC_7_19_26.md.
THE SURFACE (judge, [PENDING Paolo verdict]): a new LIFE tab in the alpha
(lazy iframe -> slices/BOHEMIA_LIFE_CURRENT.html, stable URL, same pattern as
SLICE) shows the approved block ALIVE: 47 residents sleep at night, ration at
dawn, the employed walk out the gate to the commercial block east, scavengers
sweep with a midday heat shelter, dusk return. WATCH = a day in 12 min on the
beat / STEP = i-move-you-move; tap-to-inspect any resident (schedule, outfit,
job); block ledger HUD (water/food days-left + prices); thumbs + comments +
export .txt. Verified on the real surface in 390px chromium (alpha boots,
LIFE tab loads, 0 errors) + a real-surface FIND banked in the law: a body on
the gate's single-file approach BLOCKADES the commute (player spawn moved off
the choke; the emergent blockade kept - it obeys the laws).
NEXT for LIFE (unblocked): agents at world scale (many blocks, the commute
actually crossing cells), patrol integration (factions acting once Paolo
fills the tables), needs feeding back (hunger/thirst driving behavior),
economy trade BETWEEN blocks. PENDING PAOLO: the LIFE verdict, the four empty
tables, the commodity money.

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
-19. COMBAT MOVES BATCH #13 (7/20, latest): Paolo ordered nine combat
   animations, all shipped + wired LIVE (batch #12 take-cover law: used in
   combat regardless of verdict): cover-rise/cover-drop (player LIVES the
   crouch in cover phase now, rises into the aim on POP, drops on turn
   end), gun-walk (MOVE repositions at gunpoint), cover-fire (covered
   enemies fire as a peek-and-snap, never standing; the V20 counter-snap
   has a body now via e._snapAt), get-shoved (doShove plays it before the
   push), floor-rise (prone holds flat on frame 0, the get-up plays when
   the clock runs), shiv-jab/bat-arc/spear-drive (windup HOLDS as the
   one-turn warning, strike swings through; swing frames at 0.2/0.5/0.68 --
   0.42 is a dead zone, envelopes cancel). PRONE OUTRANKS STAGGER law.
   e.wpn bug fixed (was never assigned; all blades drew shiv-length).
   Gate: combat_anim_gate.js (67, registered). Record:
   records/BOHEMIA_COMBAT_ANIM_BATCH13_7_20_26.txt. Nine candidates carry
   * thumbs in the ANIM tab [PENDING Paolo]. Stamp: BUILD 7/20i.
-18. VERDICT FOUR + BATCH 17 + CLOTHING WAVE 5 (7/20): batch 16
   judged (3 canon incl. the first RETURNED-voice songs; EVERY FLOOR BELOW
   THIS ONE down as a song, its voices live). BATCH 17 answers: THE GAPS IN
   THE HYMNAL (holdbreath = composed silence; phasedist bass + reversebloom
   motif returning) [PENDING verdict]. CLOTHING SHORTCUT ran first time --
   wave 5 in COOKING [PENDING thumbs]: DESERT SHEMAGH (eye slit only, full
   back cover), WORN BRACERS, THIGH HOLSTER, TRAILING SCARF. structure_gate
   74. Stamp: BUILD 7/20h.
-17. SONG-DEAD-NOT-VOICES LAW + BATCH 16 + CLOTHING SHORTCUT (7/20, latest):
   Verdict three processed (3 canon, 4 songs down). NEW LAW (Paolo, locked):
   graveyard is final for SONGS only -- voices/topologies from dead songs
   stay legal, re-try them in different fashions; all "voice retired" lines
   superseded (registry note added). BATCH 16 answers the 4 slots under the
   law: new leads (combfake/glissharp/subharmglide/retrig) + retired voices
   returning (ironlung bass, strikeswell/aeolianharp/sourdyad A-motifs).
   NEW badge on 4, [PENDING verdict]. CLOTHING COOK SHORTCUT written for his
   keyboard (laws/BOHEMIA_CLOTHING_COOK_SHORTCUT_7_20_26.md) -- when that
   paste arrives, run the full clothing factory per its spelled-out bindings.
   Stamp: BUILD 7/20g.
-16. TIGHT PONCHO + HOOD TOGGLE EVERYWHERE (7/20, latest): poncho now 1px
   past the torso, arms + hands always free (gate: <15% arm coverage, zero
   px past torso+1). HOOD button on every hooded garment incl. HOOD-UP
   pieces + hooded poncho (default up, strips too). Music export re-verified
   clean on current build (his stale tab explains his report). Stamp: BUILD
   7/20d. Music: 7 batch-15 songs still [PENDING verdict].
-15. HOOD BACK-COVER + TOGGLE + RAIN RULE (7/20, latest): Paolo's screenshot
   ruling -- from N/NE/NW the hood LAYERS OVER the face, zero skin slits
   (face stays open from the front). Baked into genTop hoodUp + genPoncho
   hood; gate asserts back faceCov 100%. Wave 4 all CANON (his words), 
   wardrobe 167, bank re-extracted. HOOD TOGGLE on all 8 hoodies (CLO_HOODUP
   per square). RAIN RULE recorded: rain auto-raises hoods (no umbrella) --
   hook exists, weather belongs to LIFE/world. Stamp: BUILD 7/20c.
-14. BUILD WATCHER + WAVE 4 (7/20, latest): third "nothing new" -- deployed
   bytes were right; causes were the always-open stale tab + no unjudged
   clothes. BUILD WATCHER now lives in the page (2-min + on-focus network
   check, NEW BUILD READY tap-to-reload banner). Stamp = BUILD 7/20b. Wave 4
   COOKING [PENDING thumbs]: HOOD-UP ASH/COAL HOODIES (hood worn, skull =
   garment, face open + shell), HOODED DUST PONCHO, SCRAP CHEST PLATE (X
   harness back). structure_gate 62. REMEMBER: every ship bumps #buildstamp
   and verifies the Pages run concludes SUCCESS (CLAUDE.md ship flow).
-13. SHUFFLE ANIMATION ON EVERY SQUARE (7/19, latest): Paolo's ask -- every
   big clothing square has a bottom-right shuffle button; tap = random clip
   from the APPROVED animation catalog (CLIPS minus candidates), square
   re-renders live on that clip with the clip name shown. Per-canvas clip,
   per-clip beats. structure_gate 54 checks. Verified live.
-12. EVERYTHING CANON: WARDROBE 163 + CANON CLOSET + THUMBS PERSIST (7/19,
   latest): Paolo approved ALL clothing (wave 3 + the 63 colorways). Wardrobe
   163 pieces across 11 categories; cooking empty. Fixed his two callouts:
   thumbs now persist on-device (localStorage, applyV on load; bake = truth),
   and the CANON CLOSET browses the whole approved wardrobe by category
   (replaces the one closed fold). fresh:true = wave 3 (move the tag per
   newest batch on every promotion). Wardrobe extractor parser fixed for
   cw:/fresh: tags (banked 97 of 163 -- DRESS gate caught it; now 163, street
   agents dress from the full closet). NEXT: structure wave 4 (skirts done;
   hood-up, shemagh, armor plates, more bags open); colorways may multiply
   off all 25 structures as filler.
-11. NEW-IN-CANON SURFACING + WAVE 3 (7/19, latest): Paolo could not see his
   newly approved clothes -- the verdict had collapsed them into the closed
   CANON menu (deploy was fine; UI failure). LAW OF THE SURFACE now baked:
   the freshest approved batch stays EXPANDED in a ★ NEW IN CANON section
   (fresh:true tags -- MOVE the tag to each newest batch on promotion) until
   superseded. Wave 3 cooking: BEDROLL, WRAP SKIRT (gap closes, diagonal
   fold), SHIN GUARDS. structure_gate 53 checks. Tab: COOKING (3) -> NEW IN
   CANON (19) -> COLORWAY FILLER (63) -> CANON (97).
-10. ALL 19 STRUCTURES CANON + STRAP RULING (7/19, latest): Paolo approved
   every structure candidate (jackets, ponchos, tall boots, rolled, gear,
   bags, aprons, suspenders, tattered) -- CANON WARDROBE NOW 97 items. The
   63 colorway fillers stay cooking in their drawer, unjudged. His one note
   (NOTES ARE RULINGS, rebuilt same turn): the RUCK PACK's front straps --
   now 2px webbing beside each arm, anchored at the shoulder line, chest
   buckles, gate-locked (structure_gate 45 checks). NEXT structure wave when
   clothing continues: skirts/wraps, hood-up variants, bedroll, shemagh,
   more armor plates. Colorways may now also multiply off the 19 new canon
   structures -- as FILLER, never the headline.
-9. STRUCTURE WAVE 2 + COOK UI RE-LED (7/19, latest): Paolo flagged the UI
   still led with colorways after his ruling -- the CLOTHES tab now renders
   COOKING - NEW STRUCTURES first and collapses COLORWAY FILLER (63) into a
   drawer (gate-checked). Four more shapes born (7 candidates): BAGS (genBag,
   new 'back' layer: RUCK PACK + SALVAGE SATCHEL), APRONS (genApron front
   panel: SMITH'S/TRADES), WORK SUSPENDERS (genGear Y-crossback), TATTERED
   hems (genTop tatter, torn-out pixels: TEE + FLANNEL). structure_gate now
   42 checks. COOKING: 19 structures (the headline) + 63 colorway filler.
   NEXT structures open: skirts/wraps, hood-up variants, bedroll, shemagh
   full-wrap, armor plates beyond the pauldron.
-8. STRUCTURE-NOT-COLOR LAW + 5 NEW GARMENT SHAPES (7/19, latest): Paolo
   rejected colorways-as-progress ("I need to see actual different clothes").
   Law locked (laws addendum + CLAUDE.md): colorways legal, NEVER progress;
   progress = new shapes, machine-locked by gates/structure_gate.js (28
   checks, registered). Born same turn, 12 in COOKING: JACKETS (waist-length
   open outer -- denim/field/leather), PONCHOS (new class: shoulder-wide
   diamond, fringed hem -- dust/oxblood), TALL BOOTS (shaft up the shin --
   moto/ranch), ROLLED SLEEVES (third real length -- work shirt/flannel),
   GEAR (new category: kneepads/pauldron/chest rig). Post-mortems recorded:
   cloth-ramp shoes crashed per-facing on missing sole colors (fixed with
   fallbacks, colorway shoes included); poncho v1 left shoulders bare (now
   starts shoulder-wide). Wardrobe: 78 canon + 75 cooking (12 structures +
   63 colorway filler). NEXT clothing turns lead with structures: aprons,
   skirts/wraps, bags, hood-up, tattered hems, suspenders are open territory.
-7. MUSIC VERDICT TWO + BATCH 15 + CLOTHING COLORWAY WAVE (7/19, latest):
   Paolo judged batches 13+14: 4 CANON (SOMETHING SINGS THROUGH THE PIPES,
   THE SHAPE THE WATER TAKES, TWO LIGHTS OVER THE FLOOD, THE STAIRS UNDER THE
   LAKEBED), 7 DOWN graveyard-final (registry tokens added, voices retired).
   BATCH 15 answers the 7 slots -- 7 new topologies: pulseform (VOSIM
   pulse-train formant), octgate (octave-gate), roundchoir (staggered canon),
   reversebloom (tail-attack reverse), phasedist (Casio CZ phase distortion),
   settlebend (arrive-sharp-and-settle), ghosttriad (noise triad). NEW badge
   on all 7, [PENDING verdict]. COMMENT-BOX LAW: the music comment box now
   CLEARS when comments ride an export (his complaint: old comments re-rode
   every export). CLOTHING COOK BATCH 14: the colorway multiplication wave one
   -- 63 candidates across all layers from approved structures x canon
   palettes, in COOKING [PENDING thumbs]; wardrobe 78 canon + 63 cooking.
   NOTE: his verdict-two export tagged the now-dead WIND THROUGH THE COUNTING
   HOUSE -> CUSTOM; the kill wins, tag died with the song.
-6. COMBAT SESSION OPENED — RESEARCH PASS + BEAT TACTICS LAB SHIPPED (7/19):
   the COMBAT session (brief: laws/BOHEMIA_SESSION_BRIEF_COMBAT_7_19_26.md)
   ran the mandated research pass on the best beat/tactics combat ever made
   (fresh web sweep, sources inline) and shipped the findings as PLAYABLE
   OPTIONS in the alpha. Law: laws/BOHEMIA_ADDENDUM_BEAT_TACTICS_RESEARCH_
   7_19_26.md (extends the 7/3 turn-based research). Headlines: NecroDancer's
   100%-leeway forgiveness discovery (our SILENT-PLAY LAW is the shipped
   consensus); Hi-Fi Rush's quantize-the-result-never-gate-the-input; the
   declare-then-answer telegraph consensus (Into the Breach / Shogun
   Showdown); Hoplite's movement-as-attack grammar; displacement-beats-
   damage-numbers (Tight Spaces / TBW); the ~6-8 enemy cognitive ceiling
   (confirms our 8); Shogun Showdown's QUEUE (greed spatialized, parked).
   THE BUILD: the alpha COMBAT tab now has a DIAL / BEAT TACTICS LAB
   switcher (canon Dead Eye Dial demo untouched). The LAB (slices/BOHEMIA_
   COMBAT_LAB_7_19_26.html, generated by tools/bohemia_combat_lab_gen.py
   which re-stamps the canon dial engine LIVE from COMBAT_B64 so it can
   never drift) = four playable turn-shell grammars on a 9x12 occupancy
   grid, I-MOVE-YOU-MOVE at 120: A THE CONDUCTOR (enemies as beat
   signatures), B THE PROMISE (committed red attack tiles, prevention),
   C THE DANCE (sidestep past a guard = OPENED = easier dial; disengage =
   swipe), D THE SHOVE (wall=stagger, body=both stagger, barrel=cooked).
   ALL damage goes through the real stamped dial (canon zones/forgiveness/
   tiers: vital 60 + 2-beat stun, no stun-lock, two vitals kill, kill
   chains, vital chains to a different target). THE CURRENCY THESIS
   presented as its own thumb: position never moves damage, it bends WHICH
   PACKAGE the shot pulls (extends locked distance-pull with opened/
   staggered/stunned -1, surrounded +1). Verdict UI per workflow: thumbs
   x5, per-mode comments, bottom comment box, SUN MODE, .txt export.
   GATE #COMBAT LAB same turn: gates/combat_lab_gate.js (33 checks: engine
   stamp byte-sync, dial-gated damage static+simulated, occupancy sims,
   whole-beat advancement, canon tier rules, verdict UI, alpha wiring).
   Verified on the real surface (390px chromium, alpha itself): switcher
   works, lab plays, dial opens/fires, 0 errors. NOTE (pre-existing, not
   this turn's regression — verified identical on pristine alpha): the
   canon DIAL demo renders black in headless file:// (its start screen
   needs network fonts); check on phone, works in production.
   [PENDING Paolo: thumb the 4 grammars + the currency thesis in the LAB.]
   NEXT for combat (mine, after his thumbs): graduate the winning
   grammar(s) into the canon combat demo's spatial field; the queue
   option; enemy archetypes as beat signatures on the winning shell.
   VERDICT 1 PROCESSED + LAB v2 SHIPPED (7/19 same day): Paolo's first
   pass landed as notes (verbatim + deciphered: records/BOHEMIA_COMBAT_
   LAB_VERDICT_7_19_26.txt; rulings law: laws/BOHEMIA_ADDENDUM_COMBAT_
   LAB_RULINGS_7_19_26.md). RULED + BUILT same turn: (1) melee enemies
   move differently BY WEAPON — lab A now runs shiv (every beat) / bat
   (every 2nd, hit knocks you back) / spear (keeps 2 distance, pokes a
   telegraphed 2-tile lance); (2) FORESIGHT IS A PERK — movement-intent
   arrows now sit behind the PERK: FORESIGHT toggle (attack telegraphs
   stay always-on = fairness; converges with the 6/27 catalogued
   see-next-move ability); (3) THE SHOVE (he loves it): contextual
   (button lights on adjacency; tapping an adjacent enemy offers SHOVE
   or DIAL with a BG3-style preview "stun 1 · 65% topple · wall"),
   ALWAYS stuns 1 turn, seeded-deterministic chance to TOPPLE (prone =
   helpless = easier dial), IRON SHOULDER perk = guaranteed 2-turn stun,
   NO-STUN-LOCK holds for shoves (braced). (4) C DANCE was "kind of
   confused" — re-taught with live OPENED/SWIPED event labels, dies if
   still confusing. (5) "provide some more" research — PASS 2 shipped:
   laws/BOHEMIA_ADDENDUM_ENEMY_ARCHETYPE_RESEARCH_7_19_26.md (NecroDancer
   enemy taxonomy + archetype menu; the degenerate-CC triple and why
   no-stun-lock breaks it; VISIBLE immunity classes as the answer to his
   garbled "different enemy character" line; BG3 show-odds-before-commit;
   info-perk pricing doctrine). Gate now 46 checks. Verified in chromium,
   0 errors. STILL [PENDING Paolo]: which enemy classes resist the shove;
   the fall-odds table.
   NOTES-ARE-RULINGS + CANON DEMO INCORPORATION (7/19, third pass): Paolo
   ruled the workflow itself ("if I told you what I liked, I don't need to
   double check it... start actually incorporating it into the actual
   combat demo") -> LAW: laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md
   + CLAUDE.md verdict-workflow amendment. DONE same turn — the canon Dead
   Eye Dial demo (COMBAT_B64) now carries the ruled mechanics via
   tools/bohemia_combat_melee_patch.py (idempotent, anchor-asserted, 3
   passes): weapon-typed MELEE archetypes join encounters (SHIV fast
   adv3/cad1, BAT heavy cad2 26-38dmg + knockback hit, SPEAR keeps
   distance reach4.2 — MELEE MIX setting NONE/SOME/PACK default SOME,
   rides the 7/4 melee plumbing); blades advance/windup/strike AFTER your
   action at the ONE turn-end choke (tickTurnEnd; doWait now routes
   through it — v2 fix, caught by the chromium drive); telegraph law
   (windup ring pulses on the beat, a strike never lands unannounced);
   contextual SHOVE button in the action row at point-blank ("SHOVE SHIV
   (stun 1 · 30%)" odds preview): always stuns 1 (IRON SHOULDER setting:
   2 + 50%), topple -> prone (flat ellipse, gets up over 2 turns), braced
   under no-stun-lock; FORESIGHT setting draws next-move intent ON THE
   FIELD (green advance arrow / amber will-windup dot — enemy cards are
   retired canon, v3). Pure decision logic = MELEE CORE block inside the
   demo, gate-required headless: combat_lab_gate.js now 57 checks.
   VERIFIED live in the real alpha (chromium: blades close over WAITs,
   windup->strike alternation, shove label/stun/prone/push, 0 errors).
   ENVIRONMENT NOTE (for every future session): the combat tab srcdoc
   iframe reads BLACK/hung in this sandbox because the Google Fonts
   stylesheet fetch hangs at the proxy and BLOCKS srcdoc script execution
   — NOT a production bug (fonts load on real networks). To test locally:
   abort fonts.g* routes in playwright. Root-caused 7/19 by srcdoc parse
   bisection; the pristine alpha behaved identically.
   MOVEMENT LANDS IN THE CANON DEMO (7/19, fourth pass; Paolo playing the
   new alpha: "did you fix it so that I can move around now... players
   are running after me and I can't even move"): the 6/27 locked canon
   "move 1 tile = 1 turn" is finally BUILT (patch v4 in bohemia_combat_
   melee_patch.py). MOVE button in the action row arms the 3x3 ring; tap
   a cell = step that direction; the whole polar world (enemies, corpses,
   litter) shifts around the player-centered camera (worldShift). A move
   COSTS the turn (endTurnReturn(false): exposed shooters answer, blades
   advance) and MOVEMENT IS THE MELEE DODGE — stepping out of a wound-up
   blade's reach makes its telegraphed strike WHIFF (verified in
   chromium: dodge test hpLost 0, whiff true; world-shift bearings
   correct; 0 errors). Cover ring stays hand-authored overlay (persists
   through moves — geometry drives it later, as canon says). Gate 60
   checks. NOTE: player sprite stays center (camera is player-locked);
   the read is the world sliding — matches the demo's polar model.
   RING MOVEMENT + PILLAR COVER (7/19, fifth pass; Paolo: "we already
   have eight cardinal directions right next to the action button" +
   "shuffled pillars that I can take cover from... a wall pillar"):
   (1) the 7/4 move ring (which only set G.moveIntent, plumbing waiting
   for movement) now CALLS doMove directly — one tap on N/NE/E/... = one
   step; the arm-then-tap MOVE button is DEAD. (2) REAL GEOMETRY COVER:
   G.pillars — 5-7 shuffled world-anchored pillars per encounter (ride
   worldShift). The locked RF4 line-of-fire model, geometry-driven at
   last: myCoverAgainst(ang,dist) is pillar-aware (a pillar on the line
   to the shooter = cover; behind him = not); enemies take pillar cover
   too (e.gcov in peeking/firing/hasLine/arc — an enemy behind stone is
   tucked until the line clears); pillars BLOCK the step (occupancy);
   shove into a pillar = PILLAR SLAM (65% topple); rendered tan with a
   sky-lit top (45-law nod), zero purple. Hand 3x3 toggles still work,
   OR'd with geometry (authoring layer stays until full tile geometry).
   Gate 67 checks. Chromium-verified: ring one-tap moves the world,
   enemy behind pillar gcov+excluded from exposed pool, my cover true
   through the same stone, step into pillar refused. 0 errors.
   STREET TILE BOARD + PUSH-1 (7/19, sixth pass; Paolo: "I need to see
   each tile... we have a good ass street... add the street" + "when you
   shove people they get pushed back one tile... maybe a perk for two"):
   (1) STREET FLOOR V6 — the combat floor is now a readable WORLD-
   ANCHORED tile board in street anatomy: asphalt tiles with gentle
   deterministic tone jitter (never confetti), grid lines, double-yellow
   median + white lane dashes per the LINE COLOR law. It slides exactly
   one tile per step, so the board IS the movement ruler. (2) Steps are
   full-tile Chebyshev now (diagonals = 1 tile each axis, worldOff
   integers). (3) Shove pushback = ONE tile (was 3), LONG ARM perk = two
   (settings toggle beside IRON SHOULDER); melee-core signature grew a
   perks object (back-compat). Gate 72 checks, ALL GREEN, chromium-
   verified (push 2.0->3.0 exact, NE step = worldOff +1,-1, floor
   renders). NOTE: enemy positions are still analog polar (fieldPos maps
   distance nonlinearly) — full enemy tile-snap is the next big refactor
   if Paolo wants the whole fight grid-true.
   GRID-TRUE FIELD + REAL BLOCKS + TWO-TURN RED LINE (7/19, seventh pass;
   Paolo: "the cover tiles... magical cover... has to be the same tiles
   you have on the grid" + "enemies need a red line on you for two turns
   before they can shoot"): (1) GRID TRUE — fieldPos is linear now (1
   tile of distance = 1 board cell), so enemies/pillars/corpses/floor
   share ONE ruler; demo spawn band compressed to the visible board
   (~6.5-14.5 tiles; long-range returns with the world model; the
   locked PT_BLANK/FAR/MAX numbers untouched, package math unchanged).
   (2) THE MAGIC ARCS ARE DEAD: pCover no longer grants cover; tapping a
   ring cell places/removes a REAL cover block ON that grid tile
   (identical rules to pillars: blocks lines both ways, blocks steps,
   slammable); shuffled pillars snap to tile centers, r=0.55, block
   fills its tile. (3) TWO-TURN RED LINE LAW: a gun must hold its bead
   two turns before firing — first turn = ACQUIRING (bright warning
   line, cannot fire; e.acq clock in tickTurnEnd, pools filter acq>=1);
   breaking the line resets his clock. Blades keep instant red (they
   don't shoot). Gate 78 checks, ALL GREEN. Chromium-verified: pillars
   snapped, turn-1 wait = zero gun damage + acq 0->1, turn-2 = fire,
   placed N-block covers north. 0 errors.
   GRID LOCK + DIAL-ON-BOARD + MANUAL TARGETING (7/19-20, passes 8-9;
   Paolo: "the ghost tiles have to be on the exact same grid" + "the dial
   should be the same tile shit, same location, zoomed in" + "the power
   of who to shoot next"): (v8 GRID LOCK) floor cells are centered on
   integer world coords so the player stands MID-CELL; ghost tap-cells
   draw as exactly the painted tiles; pillars snap to integer centers —
   one grid, no half-tile lie. (v9 ZOOMED BOARD) the aim phase's stand-in
   world is DEAD: the dial renders over the REAL field (street tiles,
   pillars, bodies) scaled about the player so the man under the dial is
   the man on the board (zoom = RAD*1.18/(edist*ring), clamp 0.9-3.2,
   field at 0.85 alpha under the wedge). (v9 TARGET SELECT — settles the
   6/27 manual-targeting fork): tap any enemy to SELECT him (gold ring,
   read line); pickTarget honors the pick, auto = fallback; tapping the
   selected man again toggles his cover (authoring stays); blades always
   join the shoot pool when visible; stunned/prone men ARE targets (the
   easy dial you manufactured); selection resets per encounter. Gate 86
   checks, ALL GREEN, chromium-verified (blade manually picked through a
   pop while exposed to a gun; dial-over-board screenshot). ALSO: the
   earlier "alpha not updating" report was deploy timing — all Pages
   deploys green; the always-fresh sw.js is correct; the b64-packed
   demo is NOT plaintext-greppable in the alpha (gate decodes it — do
   not repeat my false clobber scare, check with the gate).
   ONE SCENE (7/20, pass 10; Paolo on v9: "you literally slapped it on
   top of it instead of it being what it actually is" — he was right):
   v9 layered the board UNDER the intact dial stage = two worlds at once
   (field player + pose-silhouette needle, ghost cells, dimmed tiles,
   clamped zoom putting the target away from the reticle). v10 makes the
   zoomed board THE stage: EXACT zoom (zb=RAD*1.18/(edist*ring), clamp
   0.35-3.6) puts the real target token precisely at the wedge rim where
   the needle sweeps and the reticle locks; drawField grew an aim mode
   ({dial:true}) that hides the player token (the canon sweeping POSE is
   you), ghost cells and threat lines; full opacity; corpses moved onto
   the grid-true ruler (they were still nonlinear). enterAim already
   faces the target (canon), so the wedge points at your PICK. Gate 90
   checks, ALL GREEN, chromium-verified with clean screenshots (selected
   blade at the rim under the reticle). KNOWN AESTHETIC OPEN: the pose
   needle draws at dial scale OUTSIDE the board zoom, so at far shots
   (zb<1) it reads bigger than board sprites — if Paolo flags it, scale
   the pose layer by zb or draw the arm on the board player.
   TEST-HARNESS NOTE: clicking INTO the combat iframe with playwright
   page coords needs the iframe's page offset added, and a missed click
   can PAN the user camera (reset G.userPan/userZoom before screenshots).
   BOARD BODY + COVER AI + LOOP ARMOR (7/20, passes 11-13; Paolo: "change
   the size... integrate it better" then "got shot and it broke" + "remove
   auto cover, work on their AI" + "more game on screen"):
   (v11 BOARD BODY) the full-body pose-silhouette needle is DEAD — the
   field sprite stays as you during the dial and the needle is an ARM+
   weapon at board scale from your sprite's shoulder (the 6/28 locked
   canon made literal). drawArmNeedle; ghost fan = arm echoes; ARML =
   ring*(G._zb)*1.05. (v12) AIM CAM PIN: cam pinned each non-ks frame +
   biased 35% to the target; floor bounds expand 1/zb on zoom-out (no
   floating board); median/lane/grid overdraw. (v13) LOOP ARMOR: the rAF
   body is try/caught, one bad frame can never freeze the game (Paolo's
   "broke when shot" could not be reproduced headless — shot/death/
   restart all clean — so the class got fixed; G._lastErr holds the last
   frame error, bomb-tested). COVER AI: nobody spawns behind magic
   cover (inCover:false all); coverSeekAI runs at the turn-end choke:
   uncovered gunmen run up to 2.2 tiles/turn for the far side of the
   nearest pillar until geometry covers them (verified: 0 spawn-covered,
   2/4 reached stone in 6 turns), blades charge as before, hand cover
   toggles remain Paolo's tool. UI COMPACT: logo 30px, WAGER + PATTERN
   moved into the SETTINGS drawer (TABLE group), WAIT/SHOVE/NEW
   ENCOUNTER stay at hand. Gate 96 checks, ALL GREEN.
   PAOLO'S STANDING NOTE (7/20): "a lot of the game mechanics still
   aren't good... look back in the plumbing" — next passes should
   re-examine the turn/pool plumbing end-to-end (engagement modes, pop
   vs shoot semantics on the board, chain flow on the one scene, wound/
   attrition curve) rather than only adding features.
   THE FEEL PASS (7/20, pass 14; Paolo's big list): logo REMOVED from the
   fight + view starts wide (userZoom 0.82). CHAIN SKILL: how many people
   you can shoot in one turn is now a SKILL setting 1..8 (settings,
   default 3; '8 perfect kills = 1 turn' stays the ceiling at max) —
   verified: skill 2 killed exactly 2 then the turn ended. WEAPON READ:
   every body draws what it holds pointed at you (spear pole, bat club,
   shiv blade, gun barrel) so blades vs guns read at a glance (answers
   his LOS confusion — the pools were right, the READ was missing).
   MISS CINEMATIC: every return volley plays the quick incoming camera
   even on an all-miss (you always see WHO shot at you) — verified via
   forced-miss volley. AIM CAM GLIDE: the player's own pan/zoom framing
   eases (k=0.14) into the shot framing when the dial opens; settings
   toggle AIM CAM GLIDE/SNAP. The aiming arm's gun reads per weapon
   (pistol short, rifle long + stock). Gate 102 checks, ALL GREEN.
   OWED (his ask, bigger lift): the REAL rig gun-pose animation (the
   alpha's _gun aim frames) on the combat field sprites instead of the
   drawn arm — needs the rig bake piped into the demo's SPR sheets.
   THE TUNNEL POST-MORTEM (7/20, passes 15-16; Paolo's screenshot showed
   a recursive-frame tunnel + smeared bodies): ROOT CAUSE — a frame that
   THROWS between ctx.save() and restore() leaks its transform; v13's
   loop armor kept the game alive but let the leak compound every frame
   (the armor caught the error, wore the transform). CLASS FIX (v15):
   draw() hard-resets the transform AND clearRects the canvas at frame
   start; the armor catch also resets and paints a visible ERR chip with
   the message (so Paolo can screenshot the underlying error — it is
   still unidentified, iPhone-only). Bomb-tested: 1.5s of forced
   every-frame mid-draw throws while zoomed+panned = clean screen.
   ALSO v15: street floor bounds now account for USER pinch zoom AND pan
   (his "world map too small / doesn't fit the screen" was the floor
   under-covering at userZoom<1); boot fight shuffles its faction.
   v16: the MUSIC studio's boot push was killing factionShuffle on every
   COMBAT tab open (userPicked persists) — per Paolo's ruling, studio
   pushes steer the CURRENT song, SHUFFLE stays the encounter default
   unless the studio is live-driving (m.audit). Cross-system note for
   the MUSIC session: combat now ignores userPicked's shuffle-kill on
   boot pushes; live audit behavior unchanged. Gate 107 checks, ALL
   GREEN. STILL OWED: the real rig gun-pose animation on field sprites;
   the plumbing re-examination pass.
   THE PHONE GHOST NAMED AND KILLED (7/20, passes 17-18): Paolo's ERR
   chip caught it on day one — "ReferenceError: Can't find variable:
   DIRS". Root cause: v10 wrapped drawField's DIRS table inside the
   not-during-dial block while the ring cover-save FX below still read
   it; that FX fires exactly when YOUR COVER EATS A SHOT, so getting
   shot at while covered killed the frame (the original "it broke when
   I got shot" + the dial-stopped-drawing). v18 scopes DIRS whole-field;
   the exact scenario reproduces clean. ALSO v17: EXACT FLOOR (bounds
   from uzInvert-ed viewport corners + PAD 6 — no heuristics; kills
   "he's outside the map"), SHOT n/skill counter in the aim readout,
   DIAL FACING menu removed (obsolete). v18: THE REAL CROUCH — the
   alpha has ALWAYS baked 'take-cover' frames per enemy look (7/3
   canon: cover112/coverE/coverW) and enemyFrame beat-bobs them, but
   only for the hand inCover flag; pillar gcov now triggers the same
   baked crouch (peek/fire stand them up — the readable pop is built
   in). v17's squash placeholder removed. Chain-skill button reads
   KILLSHOTS/TURN in the SKILLS + PERKS group. Gate 113 checks, ALL
   GREEN. PROCESS NOTE: a red gate reached main for two commits because
   the ship chain PIPED the gate (exit code swallowed by tail) — ship
   commands now run the gate unpiped and refuse to push on red.
   RHYTHM IDEAS BATCH DELIVERED (Paolo: "give me more good ideas"):
   laws/BOHEMIA_ADDENDUM_RHYTHM_IDEAS_7_19_26.md — 8 pitched, none built:
   1 FACTION RHYTHM IDENTITY (fighters inherit their faction's swing/feel
   from the FACTIONS music table — the Bohemia-native pick), 2 THE QUEUE,
   3 BAR-PHRASE COMBAT (volley on beat 4), 4 THE BREAK (groove cashes into
   half-time = the time-dilation bar earned), 5 LAST-BEAT DODGE, 6 BODY
   TELEGRAPHS ON THE OFF-BEAT (art-pipeline law), 7 STREAK-BUILDS-THE-SONG
   (re-pitch), 8 ELITE SYNCOPATION. [PENDING Paolo: pick numbers; if "you
   pick": 1+3+4.]
   THE AFTERMATH PASS (7/20, pass 19; shipped in 5360119, logged here late):
   VICTORY WALK — when the last body drops the fight does not slam to a
   result screen; you keep the board and WALK it (loot-pretend per Paolo),
   NEW ENCOUNTER when he is done. BLOOD BY HEALTH — thresholds, not events:
   under 66% a wounded body drips a trail as it moves, under 33% it stands
   in a growing pool; corpses pool where they fell (canvas-persistent
   spots ride worldShift). KILLSHOTS/TURN group moved to the TOP of
   settings (he could not find it mid-drawer). Gate 116, ALL GREEN.
   THE ANIMATION PASS (7/20, pass 20; his list): V20 WALK — the alpha
   bakes 'walk' for the player (4 phases, all 8 dirs) and every enemy look
   (2 phases); stepping plays them (G._stepAt/e._movedAt windows), blades
   and cover-seekers walk too. THE DEADEYE POSE IS THE NEEDLE — his ask
   ("there's an Animation for the dead shot dial me holding a gun"): during
   the dial the field body renders the baked deadeye gun pose AT the
   current needle angle (sprAimFrame, all 9 offsets x 8 dirs were already
   baked); the drawn live arm went compute-only (muzzle math for ghosts/
   tracer), so the BODY sweeps. DEATH POSES ARE STATIC — corpses re-rolled
   their look every step because enemyLook keys off bearing and worldShift
   changes bearings; the look now LOCKS at death (e._lookLock). 1v1 RISK
   (his "I can miss a million shots and never take damage"): COUNTER-SNAP —
   tucked gunmen (in cover, not in the return pool) answer a BLOWN
   engagement from cover at 0.35x accuracy, 0.7x damage, so a miss is
   punishable at ANY enemy count; NO DAMAGE BEFORE THE DIAL holds (fires
   only after your dial resolves). GLIDE actually glides — cam ease
   0.14->0.055 AND the aim zoom eases (G._zbS, reset off-aim); SNAP toggle
   unchanged. HONEST CROUCH — take-cover pose now requires real stone
   (gcov, or hand-flag within 1.8 tiles of a pillar): nobody ducks behind
   air. Parent-side: combatSendSprites bakes walk both places (plaintext
   edits at out.dirs[d].walk / L.look.walk112). Gate 124 checks ALL GREEN;
   chromium-verified on the real alpha: walk bakes present all dirs, step
   plays frames, corpse look identical across worldShift, counter-snap
   sim 100->90 vs tucked gunman, zbS mid-ease, aim shot shows the deadeye
   body + board-scale dial arc. ANIMATION REQUESTS FOR PAOLO'S ANIMATION
   CHAT: records/BOHEMIA_COMBAT_ANIM_REQUESTS_7_20_26.txt (9 clips,
   priority-ordered: cover-rise + cover-drop are his named asks, then
   gun-walk, cover-fire, get-shoved, floor-rise, shiv-jab/bat-arc/
   spear-drive; graveyard-safe names; combat pulls any clip that lands in
   the pipeline with zero surgery). STILL OWED: rig gun-pose pipeline
   expansion; the plumbing re-examination pass; rhythm picks pending.
   BRASS IS FLOOR STATE (7/20, pass 21; Paolo's screenshot: "my shell
   casings follow me around instead of staying on the floor where I shot
   them"): root cause was the 7/3 AF v2 law written BEFORE movement
   existed — player brass stored as {p:1,dx,dy} player-anchored offsets;
   worldShift's mover skips entries with no ea/edist and the renderer
   drew them at cx+dx, glued to the screen-centered body. v21: brass
   lands with world coords at the tile you fired from (ea:0,edist:0 +
   pixel jitter), renders through fieldPos, rides worldShift like blood
   and corpses; the p-glue render branch is dead; the JUICE AF demo
   scatter converted too. BONUS: worldShift's 0.6-tile minimum clamp
   (exists so live enemies never stand inside you) no longer applies to
   STATICS — corpses, pillars, blood, litter shift with true minimum
   0.02, so walking over them never nudges them. Gate 127 checks ALL
   GREEN (one stale v19 blood string updated to mv(s,0.02)). Chromium
   verified: spawn brass, step E then S, brass reads 1 then 1.414 tiles
   away; walk back, it is where it fell; real fxShot landings carry
   world coords, no p flag. Shipped to main (b91d825, BUILD 7/20i).
   THE PLUMBING PASS, part 1 (7/20, pass 22; Paolo: "do what you have to
   do next"): re-read the whole engagement pipeline (doWait/doPop/
   enterAim/endTurnReturn/tickTurnEnd/coverSeekAI/acq clocks/wounds).
   THREE ROTS FOUND AND FIXED, all in the TWO-TURN RED LINE law:
   (1) MOVE BREAKS THE BEAD — the law text ruled "break the line (move,
   cover, stun, kill)" but only stun/kill were built; a gun held its bead
   across your step and shot you the turn you emerged, no warning. Now a
   move resets every gun's acq clock (a moving target is re-acquired);
   verified live: held beads acq 3 and 1 both reset on a step, guns
   restart at ACQUIRING. Balance note to watch: mobile play is now
   strong (move->pop = no aimed return fire, only the 0.35x counter-snap
   on a whiff); melee pressure + zero damage while dancing are the
   counterweights. (2) DANGER OUTRANKS ITS WARNING — the live RED threat
   line drew at 0.15 alpha vs its amber ACQUIRING warning at 0.32; red
   now 0.30, amber 0.18. (3) THE WARNING SPEAKS — fresh beads announce
   on damage-free turn ends: "ACQUIRING — n guns drawing a bead, one
   turn to break it" (both doWait and endTurnReturn ends). Gate 130
   checks ALL GREEN. CROSS-SESSION NOTE: commit b12842e ("Combat moves
   batch #13") — Paolo's Animation chat cooked the 9 requested clips and
   a sibling session wired them into the combat B64 (crouch-live cover
   phase, cover-rise into the aim, cover-drop on turn end, gun-walk
   steps, weapon swings, shoved/prone/rise bodies, counter-snap from the
   crouch); my v22 anchors updated to the b13 text, all markers green.
   STILL OWED / WHAT COMES AFTER (the roadmap): (a) rhythm build once
   Paolo picks numbers (my pick if told "you pick": 1 faction rhythm +
   3 bar phrases + 4 the break); (b) plumbing part 2 — wounds are
   cosmetic only (no mechanical bite), prone/stun stand-up has no
   telegraph, coverSeekAI has no behavior when no pillar exists (open-
   ground gunmen just stand); (c) enemy archetypes with VISIBLE immunity
   classes per the 7/19 research addendum (shove-resist classes still
   [PENDING Paolo]); (d) balance watch on move->pop after real play.
-5. LOOP DROPPED + TWO NEW SESSIONS BRIEFED (7/19): Paolo RULED the loop away
   (laws/BOHEMIA_ADDENDUM_LOOP_DROPPED_7_19_26.md): Bohemia is NOT one-life
   permadeath; death/failure meaning stays [PENDING Paolo]. Stop planning
   run-resets. He is opening dedicated LIFE and COMBAT sessions -- briefs:
   laws/BOHEMIA_SESSION_BRIEF_LIFE_7_19_26.md (agents/economy/factions,
   branch claude/life-session) and laws/BOHEMIA_SESSION_BRIEF_COMBAT_7_19_26
   .md (fun-first beat combat, NO DAMAGE BEFORE THE DIAL, branch
   claude/combat-session). Wardrobe stands at 78 CANON, all categories.
-3b. MUSIC: FULL-CATALOG VERDICT + CATEGORY LAW + BATCH 14 (7/19, PROCESSED):
   Paolo judged EVERYTHING after 30 min of listening. Nearly all CANON. FIVE
   DOWN graveyard-final (removed from MLOOPS/NEW_VIBES/CANON_DEFAULTS, registry
   tokens added, lead voices retired): A PRAYER WOUND BACKWARDS + THROAT OF THE
   DROWNED NAVE (batch 11), THE TIDE THAT KEEPS THE NAMES + A CHORD OF DROWNED
   BELLS + LAST BREATH OF THE ORGAN (batch 12). Batch 12 survivors canon.
   MUSIC CATEGORY LAW (locked, in the embedded lawbook): EDIT button DEAD ("I'm
   never editing shit"), replaced by the CAT button -- checklist of HIS
   categories (one per faction, MENU, OVERWORLD NIGHT / DAY / DUSK+DAWN; the
   old overworld = the NIGHT set, his ruling). His 7/19 assignments baked as
   CAT_DEFAULTS (SERVER FARM + DELTA BLUES -> NETWORK, FLUORESCENT DAWN ->
   CHURCH, DEAD MANS SLIDE -> HOMELESS "elder and King Hobo", HIGHWAY 15 SOUTH
   -> CARAVANS, THRONE OF STATIC -> REMNANTS, PYREFLIES RISE -> DAY, TWO COINS
   FOR THE FERRYMAN + THE WIND LEARNS WORDS -> DUSK/DAWN, CAMPFIRE CONFESSION +
   THE VAULT + THE CHOIR THAT STAYED + THE ORGAN IN THE DROWNED CHAPEL ->
   NIGHT). UI groups by category (faction vibes ride indented under the
   faction's hymns; 3 overworld sections); categories ride the export; city
   shuffle picks by CITYMUS.phase (NIGHT until a world clock lands -- the clock
   builder sets phase). UNJUDGED LAW fix (caught on the real surface): fresh
   cooks no longer pre-bake CANON_DEFAULTS=2; unjudged = absent = NEW badge +
   thumbs live. BATCH 14 cooked answering the 5 graves (shepardfall/sourdyad/
   unisonsplit/spectretide/strikeswell -- Shepard glide, interval morph,
   detune-spread envelope, noise ring-mod, strike-into-swell). NEW set = batch
   13 (6) + batch 14 (5) = 11 unjudged. Records: BOHEMIA_MUSIC_VERDICT_RECORD_
   7_19_26.txt, BOHEMIA_MUSIC_BATCH14_7_19_26.txt. NEXT: his verdict on the 11;
   [PENDING Paolo] re-file CAMPFIRE CONFESSION / THE VAULT if not night.
-3a. MUSIC BATCH 13 — NEW BADGE, PENDING VERDICT (7/19): pure expansion, no open
   slots. 6 songs, 6 voices born: THE REED THAT HOLDS ITS BREATH
   (pwmreed, true comparator PWM), SOMETHING SINGS THROUGH THE PIPES
   (filterfmgrowl, audio-rate filter-FM), WIND THROUGH THE COUNTING HOUSE
   (aeolianharp, wind-excited resonator bank), WHAT THE DRAWBARS REMEMBER
   (drawbarmorph, crossing drawbar envelopes), THE SHAPE THE WATER TAKES
   (wavemorph, dual-waveshaper antiphase morph), TWO LIGHTS OVER THE FLOOD
   (harmonictrem, band-split antiphase tremolo). Offline-render balanced
   0.10-0.20. Record: BOHEMIA_MUSIC_BATCH13_7_19_26.txt.
-3. MUSIC BATCH 12 + GRAVEYARD SWEEP — JUDGED 7/19, see -3b (7/18): Paolo's
   mega-verdict thumbed nearly the whole catalog CANON, killed 6 (SUNKEN VESPERS,
   UNDERTOW, VIA PURIFICO, HYMN IN THE FLOOD, THE DROWNED CHOIR, WHAT THE GLASS
   REMEMBERS — first 3 were briefly canon, newest verdict wins, GRAVEYARD FINAL).
   Swept from MLOOPS/NEW_VIBES/CANON_DEFAULTS, doc copies tombstoned, registry
   tokens n:'NAME' added (graveyard gate 0 live refs). BATCH 12 answers the slots:
   THE TIDE THAT KEEPS THE NAMES, WHERE THE PROCESSION DROWNED, A CHORD OF DROWNED
   BELLS, THE HYMN THE STATIC ATE, LAST BREATH OF THE ORGAN, THE BELL THAT COOLS
   TO SALT — 6 new topologies (Chebyshev/noise-flute/cluster/bitcrush/bellows/
   stretched-bell). Records: BOHEMIA_MUSIC_GRAVEYARD_7_18_26.txt. NEXT: verdict.
-2b. CLOTHING — ALL 51 CANON, COOKING EMPTY (7/18 end of day): the whole
   wardrobe is approved (tops incl. plaid flannels/henleys/button-ups/hoodies,
   pants, shoes, open coats, vests). The hoodie took SIX rounds because four
   stacked defects hid behind broken verification -- now LAW + GATE:
   laws/BOHEMIA_ADDENDUM_VERIFY_ON_THE_REAL_SURFACE_7_18_26.md (verify only on
   the real preview canvas; look before shipping; symptom-survives-content =
   pipeline bug; audit blanket rules per facing; audit generator inheritance)
   + gates/hood_gate.js (11 checks) + CLAUDE.md pointer. Render-order note:
   the CLO_PREVIEW garment hook now runs LAST in buildFrame (after SKIN_DETAIL).
   WARDROBE 66 CANON, BATCH 13 COOKING (7/19 latest): shades approved --
   accessories COMPLETE, every category exists. Batch 13 (12 cooking): new
   structures (turtlenecks via neck:'turtle', knee-cut shorts via cut:'short',
   slouch beanie via slouch:true) + first colorway wave off approved bases
   (slate plaid flannel, sand hoodie, rust striped tee, denim vest, slate
   sneakers, copper scarf, charcoal dust mask). NEXT: Paolo thumbs -> full
   colorway multiplication toward 500-800 -> his renaming/act/rarity passes.
   FACE CALIBRATION BAKED CANON (7/19): Paolo calibrated + exported; offsets
   baked VERBATIM into FACE_OFFSETS (records/BOHEMIA_FACE_CALIBRATION_7_19_26
   .txt -- the big one: profile nose moves 6px toward the facing). SHADES v2
   back in COOKING, anchored to the TRUE iris pixels + calibration + head bob
   (widest-row heuristic = fallback only; canon masks untouched).
   FACE CALIBRATION SHIPPED (7/19, superseded by the bake above): 7/8 accessories canon
   (wardrobe 65); BLACK SHADES shelved NOT dead (his words) until he
   recalibrates the per-direction EYE positions. The dormant FACE_OFFSETS
   system is wired into the render (facial px classified brows+iris/mouth/
   skin-marks -> eyes/lips/nose, moved never reshaped, cache re-keys) and a
   FACE CALIBRATION panel lives in the face editor (tap portrait, CHARACTER
   tab): facing + feature + arrow nudges on the live char + EXPORT .txt.
   [PENDING Paolo]: calibrate + export -> bake offsets as canon defaults ->
   re-cook shades v2 on the true eye pixels. Mini-expressions (brows/lips)
   ride these same per-feature rails later.
   ACCESSORIES FACTORY BORN (7/19, "keep cooking"): genAcc -- 5 zone-locked
   facing-aware types (scarf/mask/shades/gloves/belt), new layers neck/face/
   hands/waist. THE EYE LINE = the widest rows of the face part (probed, not
   guessed); masks start below it, shades sit ON it, gate #ACCESSORY (13 checks)
   enforces. 8 IN COOKING pending thumbs: DUST/OXBLOOD SCARF, BONE/OXBLOOD DUST
   MASK, BLACK SHADES, LEATHER/SOOT GLOVES, LEATHER BELT. Wardrobe 58 canon
   (all headwear approved; DESERT WIDE-BRIM renamed CHINESE RICE FARMER HAT by
   Paolo's ruling). AFTER: colorway multiplication toward 500-800, then Paolo's
   renaming/act/rarity passes.
   HEADWEAR FACTORY BORN (7/18, "do what you have to do next"): genHat --
   beanie/cap/wide-brim/wrap, facing-aware, on the skull, never the eyes (the
   FOREHEAD BAND rule) or body. Layer 'head'. Gate #HEADWEAR (hat_gate.js, 12
   checks). 7 hats IN COOKING pending thumbs (DUST/COAL BEANIE, SALVAGE/RUST
   CAP, DESERT WIDE-BRIM, OXBLOOD/OLIVE HEADWRAP).
   WHAT COMES AFTER (standing roadmap): accessories factory (~16%: scarf/mask/
   glasses/belt/gloves) -> colorway multiplication off approved bases toward the
   500-800 target -> Paolo's passes (renaming process, act + rarity assignment,
   faction dress, world-grade ruling -- his, never mine).
-2. MUSIC BATCH 11 — JUDGED (7/18 cook, 7/19 verdict): 3 CANON (THE CHOIR UNDER
   THE RESERVOIR, BONE RELIQUARY, THE TURBINE STILL TURNS), 3 DOWN graveyard-
   final across the two verdicts (WHAT THE GLASS REMEMBERS killed 7/18; A PRAYER
   WOUND BACKWARDS + THROAT OF THE DROWNED NAVE killed 7/19; wailmorph/
   throatsong/foldchoir voices retired). Record:
   records/BOHEMIA_MUSIC_BATCH11_7_18_26.txt (tombstoned).
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

## EXPLAIN-EVERY-TILE LAW (Paolo 7/18): no blank slabs; every tile maps to a named thing
in the legend; research what fills the space and put it there. Kit helpers legendOk/
voidFraction/largestBlob gate it. Applies to EVERY district.

## DISTRICT DOSSIER + LAYERING — RECORD WHAT THE HELL IS HAPPENING (Paolo 7/19: "record all the
notes of what the hell is happening... understand the LAYERING and what it looks like when the
player goes INSIDE — a building, a parking garage, the tunnel — what tiles, what positions, what
blocks. very important"): DONE for all 7 built districts. Each module exposes NOTES {summary,
reference[], layout[], circulation, LAYERING, decisions[]} + LEGEND {code -> name, kind, ACT-1
material, + layer/solid/enter} beside its PALETTE. LAYERING: every tile resolves (via kit
KIND_LAYER/tileLayer) to a render+occupancy LAYER — ground (flat floor) / structure (¾ front
face, blocks) / overhead (pass UNDER: canopy, garage deck) / prop / portal (go INTO an interior:
door, garage ramp, tunnel mouth) — plus solid? + what's INSIDE (enter). Examples recorded: the
medical parking GARAGE (solid shell outside -> multi-deck interior inside, ramp portal), store/
dock/house doors as portals, canopies as overhead (walk under, block nothing), the wash as a
BELOW-GRADE 3-layer descent (street road/fence -> slope bank -> sunken invert -> tunnel-mouth
PORTAL into the underground). tools/bohemia_tilespec.js GENERATES the full DOSSIER (records/
tilespec/ + INDEX) incl. a LAYERING section + a per-tile layer/solid/enter table. gates/
tilespec_gate.js (49 checks) fails if a district lacks the NOTES dossier (incl. layering), ships
an undocumented tile, OR has a tile with no valid layer. ACT-2/3 = [PENDING Paolo]. STANDING FLOW
(keep in mind forever): NEVER build/approve a district without its NOTES+LEGEND+LAYERING dossier
+ rerun the generator, same turn. The ¾ renderer + the interior/zoom system READ these flags.
LAYERING IS NOW CONSUMABLE (7/19): world.js plot() exposes it live — plot.tileInfo(x,y) ->
{code,name,layer,solid,enter}, plot.solidAt(x,y) (OCCUPANCY: does the cell block a body),
plot.portals() (every way INTO an interior: doors/garage-ramps/tunnel-mouths/gates), and each
building carries .enter (its interior from the dossier). world_gate.js asserts these (9 checks).
So the render/collision/interior systems read what blocks + what you go into, not just raw codes.
Proof: a LAYER VIEW render colors each tile by resolved layer (portals glow green) —
scratchpad only, regenerate from bohemia_wash/medical/cemetery via K.tileLayer.
FIRST SPECIAL INTERIOR — THE PARKING GARAGE (7/19): engine/bohemia_garage.js — a multi-DECK
parking structure (NOT rooms; the generic BSP floorplan can't do it): each deck = a central
drive aisle + 90-degree stalls + abandoned cars + a stair/elevator core, decks joined by an
aligned RAMP, the ground deck holding the ENTRANCE (from the exterior ramp). The solid garage
shell you see in the overworld becomes the deck you stand on. Gate garage_gate.js (7 checks incl.
a 3D reachability test: drive from the entrance UP THE RAMPS to every deck). WIRED: medical
exposes the garage as ONE enveloping footprint tagged code:8 (its shell is punched by stalls),
world.js building.interior() dispatches on enter text -> garage yields decks, everything else
rooms; building.kind='garage'. world_gate proves a real valley garage yields multi-deck parking
(10 checks). NEXT special interiors: the mausoleum CRYPT (cemetery, enter says CRYPT INTERIOR —
DONE 7/19) and the sewer TUNNEL network (wash mouth -> coordinate w/ LIFE, the tunnel people live there).
CRYPT INTERIOR DONE (7/19): engine/bohemia_crypt.js — the mausoleum interior (cemetery portal,
enter says CRYPT INTERIOR). A single-floor stone crypt: a central aisle threading a grid of
burial-VAULT banks, walls lined with stacked niches, an ALTAR terminus, the ENTRANCE at the
front, some vaults broken open (act-1 dead). INTERIOR===EXTERIOR (grid is exactly the mausoleum
footprint w x h; verified 29x17 via the world model). world.js interior() now dispatches
garage/CRYPT/floorplan on the enter text; building.kind='crypt'. Gate crypt_gate.js (7 checks
incl. footprint-exact any shape + floor reachable from entrance). Registered in the runner.
Two special interiors live: GARAGE (multi-deck) + CRYPT; generic ROOM FLOORPLAN for the rest.
INTERIOR===EXTERIOR LAW (Paolo 7/19, LOCKED): a building's interior floor plate is ALWAYS exactly
its exterior footprint w x h (garage clamps removed; each deck = footprint W x H; room floorplans
already matched). CLAUDE.md law + world_gate.js hard check (interior dims === footprint dims,
every building, 11 checks).
HOW-TO-BUILD-A-DISTRICT PLAYBOOK (Paolo 7/19: "make instructions for even how you make
instructions for yourself... the district kit... we're learning things together"):
laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md is the read-this-BEFORE-you-build brief — the DISTRICT
KIT (the shared machine + its helpers) and the 9-step method (research -> canonical-south on the
kit -> street-aware/drivable via rotateToStreet -> dossier NOTES+LEGEND -> render+look -> gate ->
wire (DISTGEN+tilespec) -> interior=exterior -> ship), plus how the self-instructions get made
(the dossier is GENERATED, not hand-written) + a module template. district_kit_gate asserts it
exists + covers the kit/method. So: this playbook (build) + per-district dossiers (record) + the
tiling brief (tile) = the full self-instruction stack, all gated.
TILING-PHASE INSTRUCTIONS (Paolo 7/19: "leave instructions for yourself when it's time to place
tiles"): laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md is the single read-this-when-you-tile brief —
scale, act-1-dead, 45-degree, purple ban, layering->render/occupancy, INTERIOR===EXTERIOR,
exterior<->interior zoom, order of operations, what's Paolo's. The tilespec INDEX points to it;
tilespec_gate asserts it exists + is linked (58 checks). So when tiling starts, one doc has it all.

## STREET-AWARE / DRIVABLE ACCESS LAW (Paolo 7/19, LOCKED — "one street vs two because it's
a corner is gonna be super important, for everything moving forward"): every road-fronting
district is built for BOTH a standalone grid (1 street, any edge) AND a corner (2 streets).
ONE car entrance on the primary street (order S>E>W>N); corners add a PEDESTRIAN gate on the
side street, never a 2nd car entrance. The drivable network (driveway + lot aisles) is an
EXPLICIT car surface separate from walking paths; a car reaches EVERY stall from the curb.
MECHANISM (author once): build canonical-south, call K.rotateToStreet(g,streets,{...}) ->
{g,primary,gates}; kit helpers primaryStreet/rotateCW/scanGates/pedGate + gate checks
driveNetworkOk/driveTouchesEdge/stallsReachable. GATES: district_kit_gate.js (machinery,
23 checks) + each district gate (park_gate.js reference, 11 checks/6 configs). Law:
laws/BOHEMIA_ADDENDUM_STREET_AWARE_DRIVABLE_LAW_7_19_26.md + CLAUDE.md law list. NEW districts
use it from the start.
RETROFIT DONE (7/19, "do something important"): diagnosed all 4 pre-law districts across the
6 placements (each single edge + 2 corners). Found + FIXED a real bug: MEDICAL's drive was
DISCONNECTED for a north-only cell (and N+W corner) — its south-biased "bottom drive band" sat
stranded behind the hospital. Fixed by retrofitting medical onto canonical-south + K.rotateToStreet
(the whole campus now rotates onto the real street; ambulance/ER/garage/lot all reached). New kit
helper K.driveReachFromStreet(g,driveCode) = fraction of the car network reachable from the curb
(right metric for complex sites whose drive isn't one tidy blob). INDUSTRIAL + SOLAR were NOT
broken (genuinely street-connected in all placements) but their gates only tested a couple configs
— HARDENED all gates to the full 6-placement sweep + a drive-reach assertion so this bug class
can't hide again (the medical gate only ever tested S-configs, which is exactly why the N bug
slipped through). Gate status now: park 11/6cfg, medical 12/6cfg, industrial 8/6cfg, solar 7/6cfg.
COMMERCIAL is the exception: it's the CORNER-plaza form by design (Paolo: "we'd have to completely
remake it to squeeze between two other districts"), so it's gated on S/corners/N only. [PENDING
Paolo]: commercial's standalone-any-edge / mid-block form is a DESIGN call — how a shopping plaza
reshapes when it's not on a corner. Everything else obeys the law across all placements.

## DISTRICTS ON THE FACTORY (running list) — Paolo 7/18
Built + folded into world.plot (each = a generator on the kit + a gate + one DISTGEN line):
- suburb/gated/estate -> RESIDENTIAL (bohemia_suburb)
- commercial -> COMMERCIAL (bohemia_commercial, corner plaza)
- industrial -> INDUSTRIAL (bohemia_industrial, distribution center, research-first)
- medical -> CIVIC (bohemia_medical, hospital campus, EXPLAIN-EVERY-TILE: hospital + ER,
  ambulance canopy + staging bays + helipad, drop-off lane + walkway/crosswalk, a full
  visitor lot with PARKED CARS + dead-planter islands, garage packed with cars + ramp, MOB).
  Gate medical_gate.js checks legend-complete + no-big-void + parked-cars.
- solar -> INFRASTRUCTURE (bohemia_solar, utility solar farm: panel arrays, gravel access
  roads, inverter/transformer pads, a substation switchyard + control building, fence+gate;
  fits the CLUSTERED-POWER lore). EXPLAIN-EVERY-TILE (void ~10%). Gate solar_gate.js.
- park -> LEISURE (bohemia_park, v4 — RESEARCHED custom grid + DRIVABLE + street-aware).
  RESEARCH (park design guides): FLOWING CURVILINEAR trails wind + route AROUND amenities
  (never a geometric circle, nothing sits on the path); ~half the park is PASSIVE OPEN LAWN;
  high-use amenities (playground + court) near the STREET for surveillance w/ LIMITED parking
  at the entrance; pavilion in a quieter shaded zone; TREES buffer the perimeter. BUILD:
  amenities drawn FIRST, then a Catmull-Rom WINDING pedestrian trail (code 1) laid only over
  open ground so it flows around every feature. DRIVABLE (Paolo 7/19: "do you have drivable
  parts where a car normally would go, corner or standalone"): the car network is EXPLICIT
  and separate from the walking trail — an asphalt DRIVEWAY + parking AISLES (code 12) run
  from the street curb cut into the lot so a car reaches every stall (0 orphan stalls,
  driveConn 1.0). STREET-AWARE via CANONICAL-SOUTH + ROTATE: the park is built entrance-at-
  south, then rotCW'd so the car entrance lands on the actual street; a CORNER gets the car
  entrance on the primary street (order S>E>W>N) + a PEDESTRIAN gate on each side street (one
  car entrance is realistic). Works for a standalone grid (1 street, any edge) AND a corner.
  Lawn ~75%. ACT-1 DEAD. void ~3%. Gate park_gate.js (11 checks over 6 configs incl.
  LAWN-DOMINANT >55%, drive-network-connected, driveway-reaches-primary-street, every-stall-
  car-reachable, corner-pedestrian-gate). v1 super-park + v2 perfect-circle both REJECTED —
  git history has them. NOTE: the canonical-south + rotate-to-street pattern (+ explicit
  drive code 12) is a reusable convention to push into the other districts' parking next.
  SEED VARIETY (7/19, "we're gonna have several parks"): the generator varies per seed so
  valley park cells DIFFER while staying realistic — pond present-or-absent (a tree stand
  fills in when absent), per-seed jitter on the trail waypoints + playground + court. 6 seeds
  verified as distinct-but-realistic; lawn 75-77%, drivable + street-aware hold on all. Gate
  makes the pond OPTIONAL (absent or a real pond, never a sliver). NEXT for parks: distinct
  park TYPES (pocket/plaza/greenbelt/sports) as their own generators when Paolo wants them.
FAILURE TRAINING (7/19, Paolo "record + train on all failures I thumbs down"): every
  thumbs-down catalogued w/ root cause + lesson + guardrail in records/BOHEMIA_FAILURE_
  GRAVEYARD_7_19_26.md; park v1/v2 tombstoned (PARKFAIL-SUPERPARK/PARKFAIL-CIRCLE, graveyard
  green); 4 new lessons in laws/BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md (realistic>impressive;
  research proportions not parts-list; no fake geometry; explain-every-tile != cram).
- wash -> TERRAIN (bohemia_wash, Paolo 7/19: "a wash where homeless people can get into the
  sewers — a sewer entrance by the street"). A LV concrete flood-control channel: wide lined
  channel (banks + invert + dead trickle), fenced maintenance O&M roads (drivable), riprap
  shoulders, clumped desert margins — and the HEADLINE: a headwall + a dark BOX-CULVERT TUNNEL
  MOUTH where the channel dives under the street, with a hole in the fence + a scramble path +
  a homeless CAMP (cart/tarps/crates) at the mouth. Grounded in the real LV flood tunnels
  (~600mi, ~1,200-1,500 unhoused "tunnel people"). Act-1 DEAD. Street-aware + drivable via
  rotateToStreet. footprints EMPTY (the mouth = future LIFE tunnel-interior hook, not a surface
  building). Gate wash_gate.js (9 checks/6 configs). The "tunnel people" are LIFE (agents); this
  district gives them the DOOR.
- cemetery -> CIVIC (bohemia_cemetery, 7/19 autonomous, research-first: memorial-park design
  guides). A dead-world cemetery: a rectilinear grid of grave SECTIONS (rows of headstones on
  dead memorial lawn) laced by memorial drives for graveside access (you DRIVE through it), a
  chapel + office + parking by the entrance, a MAUSOLEUM terminus (enterable crypt), a
  COLUMBARIUM cremation garden (niche wall + reflecting pool + monument), a central FOUNTAIN +
  OBELISK roundabout plaza, dead memorial trees lining the drives, a maintenance shed. Act-1
  DEAD (weathered stone, empty fountain, bare trees, no living lawn). Street-aware + drivable
  via rotateToStreet (drive reach 1.0 all placements). RECTILINEAR by design (grid maximizes
  graveside access — correct here, not fake geometry, unlike the organic park). Full dossier +
  layering (mausoleum = crypt interior; headstones = props you weave between). Gate
  cemetery_gate.js (8 checks/6 configs). 8 built districts now.
- drivein -> LEISURE (bohemia_drivein, 7/20 autonomous, research-first: drive-in site-plan
  guides — conceptdraw / drive-insdownunder / Film-Tech). A dead drive-in movie theater: a torn
  SCREEN TOWER spanning the back (its ¾ face IS the giant screen), a fan of ARCED PARKING ROWS
  centered on the screen (wheel-stop arc markings + speaker poles + abandoned cars rusting nosed
  to the screen), a central SNACK BAR + PROJECTION booth (enterable concession interior) with a
  little playground + picnic tables beside it, a drive-up TICKET BOOTH + roadside MARQUEE at the
  entrance. The WHOLE cracked-asphalt field is the drivable surface (you drive in and park),
  reachable from the curb in every placement (driveReachFromStreet). Act-1 DEAD. Street-aware +
  drivable via rotateToStreet. Full dossier + layering. Gate drivein_gate.js (11 checks/6
  configs). BUG CAUGHT + FIXED on the real render: the marquee had walled the entrance lane off
  from the field (single-street drive-reach failed while corners passed via the ped-walk leak) —
  moved the marquee roadside, off the lane. 9 built districts now. Stamp BUILD 7/20c.
- golf -> LEISURE (bohemia_golf, 7/20 autonomous, research-first: golf course design guides —
  Under Armour "Golf Course Layout 101", Keiser College of Golf, Archweb). A dead golf course
  SECTION (a full course is ~50ha, dwarfs a 96m cell, so one cell = the clubhouse end + a few
  holes): dead ROUGH dominates the parcel, brown mown FAIRWAYS wind through it (worm-of-discs,
  never straight) from TEE BOXES to GREENS (each with a leaning PIN), guarded by pale SAND
  BUNKERS + a seed-optional dry cracked WATER HAZARD; the abandoned CLUBHOUSE + two PARKING lots
  + DRIVING RANGE (tee line + mats + downrange targets) + practice PUTTING GREEN cluster at the
  south street entrance; a thin pale-concrete CART-PATH perimeter loop (front-nine-out/back-nine-
  in) hugs the fairway edges with stubs to each green. Street-aware + drivable (parking + cart
  paths reachable from the curb). Full dossier + layering; enterable clubhouse. Gate golf_gate.js
  (12 checks/6 configs). RENDER BUG CAUGHT + FIXED: cart paths first read as a dark tree-trunk up
  the middle (dark + thick + radial) — recolored to receding concrete, thinned, rerouted as the
  perimeter loop; now reads unmistakably as golf. 10 built districts now. Stamp BUILD 7/20j.
FACTORY now spans 7 categories: residential, commercial, industrial, civic, infrastructure, leisure, terrain.
GAMING & RESORT = BESPOKE (Paolo 7/18): casinos/resorts get hand-crafted individual love,
NOT the auto-factory. A first casino generator was built then PULLED per that ruling (git
history has it if ever wanted as a starting sketch). Do NOT auto-generate gaming_resort.
NEXT non-casino districts to stamp (research-first, on the kit): more leisure (stadium/golf/
waterpark), more commercial (downtown/mall/swapmeet), more infrastructure (substation/
transit/airport), residential (trailer park/town/downtown highrise). Then L3 tiles + L4
3-act states (build once, all inherit).

## DISTRICT TAXONOMY (Paolo 7/18: "you have to categorize things nicely")
Every one of the 77 district types files into ONE of 8 top-level categories (source of
truth: engine/bohemia_district_kit.js TAXONOMY; law: laws/BOHEMIA_DISTRICT_TAXONOMY_7_18_26.md;
gate: gates/district_taxonomy_gate.js, nothing can be uncategorized). Grounded in real
land-use zoning + the two Vegas needs. Counts: residential 5, commercial 5, industrial 9,
gaming_resort 9, civic 13, leisure 8, infrastructure 24, terrain 4. world().plot() now
returns .category. The distribution center = INDUSTRIAL. A few judgment calls flagged for
Paolo in the law (convention/truckstop/fort/springs/farm) — easy to move.

## THE DISTRICT FACTORY (Paolo 7/18 late: "get this factory going... speed this up")
Built the shared machine so a NEW district is a short config, not a from-scratch build:
- engine/bohemia_district_kit.js: grid primitives, street-aware streetEdges(neigh),
  footprints, connectedFrom, dead-world ground(), a REGISTRY (register/get/types), and a
  3-ACT hook act(res,a,rules) (act 1 = as-built; act 2/3 rules are CONTENTS-PAOLO'S).
  Gate: gates/district_kit_gate.js (16 checks).
- engine/bohemia_industrial.js: FIRST district on the kit — a real DISTRIBUTION CENTER,
  REBUILT from site-plan research (Paolo: research the real thing FIRST): one big warehouse
  + office, a dock-door row, a truck court apron, trailer STAGING + a trailer PARKING yard
  (~58 staged trailers), employee car lot, guard shack, containers, fenced gates. Gate:
  gates/industrial_gate.js (8 checks). Rendered + verified.
- RESEARCH-FIRST LAW (Paolo 7/18): online research of the REAL thing before building ANY
  district; the generator is inspired by real reference. Added to the workflow law.
- engine/bohemia_world.js: routing is now GENERIC. DISTGEN table maps district type ->
  generator (suburb/gated/estate->SUB, commercial->COM, industrial->IND). Adding a
  district = ONE line. world.plot generates + exposes enterable buildings uniformly.
  Valley now: suburb 2332 / commercial 405 / industrial 36 / gated 18 / estate 11 plots
  with real buildings (297 total, was 38). world_gate green.
NEXT (fast now): stamp out the remaining ~25 district types on the kit (downtown, casino,
resort, strip, medical, campus, stadium, park, mall...), each a short generator + gate +
one DISTGEN line. Then the L3 TILE PIPELINE + L4 3-ACT states (build once, all inherit).
Status doc: records/BOHEMIA_OVERWORLD_STATUS_7_18_26.md. Workflow: laws/BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md.

## PLACEMENT PLAYBOOK + FIRST COMMERCIAL DISTRICT (Paolo 7/18 late)
Paolo: the suburb ate half a day; RECORD the issues so it never repeats, then pivot to
the first commercial district (a corner shopping plaza).
- POST-MORTEM: laws/BOHEMIA_PLACEMENT_PLAYBOOK_7_18_26.md. THE process rule: render a
  PNG and LOOK every change (a green gate is not a look); roads-first; spread not
  blind-stride; fill both grains; straight segments only (rigid footprints can't front
  curves); never add road to squeeze a house; constant house depth, vary width/story.
  The bugs that cost most: asymmetric inset (verify ALL four edges), dead-ground-as-void.
  This is the reference for the ~30 home models Paolo wants + every new district.
- COMMERCIAL (first cut, gated): engine/bohemia_commercial.js — a CORNER SHOPPING PLAZA.
  L-shaped store building on the back property lines; parking lot fronting the streets
  (striped stalls + drive aisles); curb cuts connect the lot back to the streets;
  storefront doors face the parking. Street-aware (exits the streets it touches, corner=2).
  generate(seed,{streets:[...]}) -> {g, stores, gates}; storeFootprints + driveConnected
  exported. Gate #23 gates/commercial_gate.js (8 checks), registered in bohemia_gates.py.
  Proof (still): tools/bohemia_commercial_proof.py -> slices/BOHEMIA_COMMERCIAL_PROOF.html.
  ITERATED (Paolo 7/18 eve): (1) PARKING now obeys BOHEMIA_PARKING_LAW (2-wide stalls,
  stripe every 3rd tile, row 4 deep, aisle 4 — the approved ST0 stall tiles texture it).
  (2) BACK ENTRANCE LAW: every business has a service door (9) onto a rear SERVICE ALLEY
  (8) that wraps the back corner (the "mini road") for trash/deliveries; hasServiceAccess()
  gates it. (3) GAS STATION pad (canopy 10 + pumps 11 + kiosk) in the street corner.
  (4) MORE curb cuts: 2 per street (corner = 4). Gate #23 now 11 checks. All green.
  NOTE: parking code (1/3/4) maps to the approved parking/stall-line TEXTURES at render
  time (banks); the proof shows geometry, the real render applies the tiles.
  VARIANT NOTE (Paolo 7/18): this is the CORNER form. A commercial cell squeezed
  between two other districts (frontage on one edge, or mid-block) needs its own
  layout variant, remade — not just the corner rotated. Build when folding into the map.
  NEXT: subdivide the store strip into TENANT UNITS (each own storefront), then fold
  commercial into the world model like the suburb. [PENDING Paolo: react.]

## SUBURB — FOLDED INTO THE WHOLE VALLEY (Paolo 7/18 late: "one done, what's next")
DONE: the approved suburb generator is now wired into the world model. engine/bohemia_world.js
plot(x,y) routes any RESIDENTIAL cell (suburb/gated/estate) through BohemiaSuburb.generate
with streets inferred from road-district neighbors (streetEdges), exposing homeFootprints as
enterable buildings (residential floorplans) + a suburbBlock() grid in world cells. Result:
2361 residential plots across the valley are real neighborhoods, ~56,540 homes, every one
enterable via world().plot().building().floorplan(). world_gate.js +1 check (6 total), 280
plots-with-buildings (was 38). All gates green.
STILL 1x1 PER CELL (merge across neighbors not yet done in the world model — the generator
supports cw/ch but the world addresses per-cell; multi-cell union + shared plot API is the
next refinement). Interior collector streets from the overmap not yet fed in (gates default
to road-neighbor edges, else S).
NEXT FORK (Paolo to call — AskUserQuestion dropped, asked inline): (1) LIFE — agents in the
houses; (2) the OTHER building types (commercial/civic/etc.) to this modular standard;
(3) the city-builder delete-to-desert/place-a-plot mechanic.

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
