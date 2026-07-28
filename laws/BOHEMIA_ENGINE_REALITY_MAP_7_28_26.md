# BOHEMIA — THE ENGINE REALITY MAP (7/28/26, coordinator audit)

Paolo's order (7/28): "I need you to have some foresights into our engine and
everything that it needs to make everything compatible... not your numbers and
hallucinated guesses but knowing what IS and knowing what the shell is NOT."

METHOD: two independent read-only auditors swept the real shipped surfaces —
the run slice, the alpha (including the decoded COMBAT_B64 and CITY_B64 blobs),
and every engine/ module — and were required to cite file:line for every claim
and MEASURE where a number was claimed. Nothing below is a guess. Where a prior
claim in a law/handoff turned out stale or wrong, it is called out by name.

EVERY SESSION READS THIS BEFORE PLANNING ENGINE-ADJACENT WORK. It is the
answer to "does the engine already do X?" — check here before assuming either
way. (Wired into the GO procedure read order, autonomy doctrine §2.)

Surfaces audited: slices/BOHEMIA_RUN_CURRENT.html (run code = lines
14,399-16,220), slices/BOHEMIA_ALPHA_0_9.html (+ decoded COMBAT_B64 at :5927,
631,790 chars; decoded CITY_B64 at :6007, 8,463 lines), engine/*.js, gates/*.

=============================================================================
## 1. THE VERDICT TABLE — what EXISTS, what is PARTIAL, what is MISSING
=============================================================================

### MOVEMENT + WORLD

| Capability | Verdict | Proof |
|---|---|---|
| Whole-valley walkable grid (96x96 cells x 128 tiles = 12,288^2) | EXISTS | run crossings all 4 directions, RUN_CURRENT:15738-15741; rim toast "The valley ends here." |
| Engine streaming (bounded LRU + prefetch, crossing <5ms proven) | EXISTS (engine) | bohemia_world.js:458 PLOT_CAP=64, :712 stream(); gates/streaming_gate.js:104-111 asserts <5ms crossing, <1ms median |
| **The run actually using it** | **MISSING** | RUN_CURRENT:14491 loadCell() rebuilds four full 128x128 arrays (16,384 WORLD.tile() calls) synchronously on every edge step (:15742), then buildSim(0). Never calls w.stream(). MEASURED cold: 39.2ms suburb / 32.4ms commercial / 25.2ms desert on DESKTOP node — a visible stall on the phone. |
| CITY human-mode streaming | EXISTS — genuinely seamless | CITY_B64:6033 one global fine grid; :6525-6540 16x16 chunk LRU cap 520; no reload path on district crossing |
| Interior enter/exit | EXISTS (instant swap, no fade) | run enter() :14719 / leave() :14726; CITY inEnter() CITY_B64:8252; the only transition is the 2-beat door clip |
| INTERIOR===FOOTPRINT law | EXISTS + gated | world_gate.js asserts dims match |

### VERTICALITY (Paolo's "2-3 stories you can climb")

| Capability | Verdict | Proof |
|---|---|---|
| Stairs a player can climb | **MISSING — confirmed absent, everywhere** | floorplan vocabulary is only 'floor'/'wall'/'door' (bohemia_floorplan.js:58); "multi-floor stacking" is literally in the module's own pending list (:88, :141); every `stair` in engine/ is a solid prop or legend prose (bohemia_apartment.js:83 `solid:true`) |
| Any z-level / floor index on any surface | **MISSING** | no z variable in run or CITY; interiors are one plate each |
| story:2 house data | PARTIAL (data only, dies unused) | bohemia_suburb.js:203 -> bohemia_world.js:514, nothing consumes it for movement; code 9 "upper floor" is just a taller wall mass (:222, run stackAt() :15077 folds 9 into 2) |
| Garage decks | PARTIAL — generated, never entered | bohemia_garage.js:44-53 builds 2-6 real decks with ramps + stair cores, wired into the world model (bohemia_world.js:520); NOTHING renders or walks them; the run only stamps the exterior door bay (:14982) |

### COMBAT + DANGER

| Capability | Verdict | Proof |
|---|---|---|
| The dial itself | EXISTS (the one system Paolo trusts) | COMBAT_B64, own beat clock, mercy states dead/downed/broken/fleeing (decoded :3553-3558) |
| Walk->combat seamlessness | **MISSING — it is a tab swap by design** | ALPHA:5781 showTabPanel('combat'), :5900 back; full-screen "IT GOES LOUD" card first (RUN_SLICE:1817-1832); hard setTimeout(go,250) both branches |
| The "14ms cold handoff" claim | **STALE — the mechanism was reverted** | laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md:28-30 still promises background warming; ALPHA:6000-6004 records the warming REVERTED 7/26 (pre-baked stale clothing). Today's first fight decodes 632KB at handoff + 250ms + READY queue. |
| **Combat as an engine module** | **MISSING — the biggest structural wall** | BohemiaMelee exists nowhere in engine/; sole canonical body is inside COMBAT_B64, edited only by ~25 one-shot tools/bohemia_combat_*_patch.py scripts; NO resync/freshness tool (CITY_B64 has one: bohemia_city_module_resync.py, 40/40 fresh) |
| Ally-in-combat | MISSING (ruled, unbuilt) | zero ally/friendly/companion token in decoded COMBAT_B64; one hostile array G.e, no side/faction field (:3640); backlog COMBAT item 0 |
| Encounter director | PARTIAL — finished engine, zero callers | bohemia_encounters.js complete (deficit chooser, tension budget, 90s floor); only importer is its own gate (encounter_gate.js:37); its intended socket bohemia_world_resolve.js:209-227 self-declares 'no director yet' — and is itself unwired |
| Ambient spawns on the walk | MISSING | the only trigger is quest-outcome clout: RUN_SLICE:1804 `if(clout==='reckless'||'risky') goLoud()` |
| Companions/cart as walk entities | MISSING | no follower entity on any surface; every `cart` in engine/ is scenery; brotherhood exists only as research prose |

### PEOPLE

| Capability | Verdict | Proof |
|---|---|---|
| Scheduled NPCs on the run | EXISTS (~28 on the home block) | bohemia_agents.js:96 scheduleFor(); measured: home suburb cell -> 24 footprints -> 28 agents, viewport-culled RUN_CURRENT:15396-15403 |
| Scheduled NPCs in CITY human mode | **MISSING — zero people** | no BohemiaAgents/makeSim anywhere in the 8,463-line decoded blob; only cars/planes (moversAdvance CITY_B64:6604). The best renderer in the repo walks an empty city. |
| Phantom desert residents (bug) | REAL | homeFootprints treats ANY code 2/9 blob as a house (bohemia_suburb.js:196); MEASURED: desert cell [17,4] -> 78 "homes", 64 residents with sleep schedules living in rock formations |

### QUESTS + THE RESOLVER

| Capability | Verdict | Proof |
|---|---|---|
| Canon quest corpus | EXISTS | 21 .bq all pass the 10-check gate (bohemia_canon_quests_gate.js) |
| Quests playable in the run | PARTIAL — **exactly 1 of 21** | RUN_SLICE:574-577 hardcoded `Q.id==='bq_meter_reader'`, two literal tile constants LINEMAN_AT/FIXER_AT (:580, RUN_CURRENT:15791-15794). The fix modules (castTarget, bohemia_quest_placement.js) are NOT inlined in the run; placement itself is [PENDING Paolo]. |
| Resolver (moments/RATION/REACH) in the run | EXISTS — WIRED | RUN_SLICE:1439-1479, four registered steps + live resolve() every spent block. (An earlier coordinator premise said "unwired" — that premise was WRONG; the correction stands here.) |
| World half (bohemia_world_resolve.js) | PARTIAL — built + gated 7/27, not yet adopted by the run | only gates import it; adoption is blocked on the [PENDING Paolo] moment table anyway |

### ATMOSPHERE + AUDIO

| Capability | Verdict | Proof |
|---|---|---|
| Day/night module | PARTIAL — **finished, wired NOWHERE current** | bohemia_daycycle.js complete ambient curve; BOH_DAYCYCLE count = 0 in run, alpha, CITY, LIFE slices; only consumers are dead slices. Run clock genuinely advances (SLEEP=8h, :15532) and the screen never changes. CITY reinvented a cruder binary isNight() (CITY_B64:6031). |
| Weather | MISSING everywhere | zero precipitation system in engine/ or any slice — [PENDING Paolo whether it should exist] |
| Music on the run | PARTIAL — binary remote only | run posts {on:bool} (:1877), parent runs CITYMUS; combat receives full song data + HERO BEAT (ALPHA:10146-10173), the run receives nothing |
| Beat-sync on the walk | **MISSING** | run BEAT=500 (:1109) is a hardcoded constant for door swings; no tempo/beat index crosses the postMessage vocabulary (RUN_CURRENT:15842-15860). The walk is nominally on-beat and actually unsynced — in the EVERYTHING-ON-BEAT game. |

### SAVE + PERFORMANCE

| Capability | Verdict | Proof |
|---|---|---|
| Save/load per the ruled spec | EXISTS | one blob, 6-slot ring, sleep/manual/auto, export/import, migrate-forward, death=reload (RUN_CURRENT:15986-16094) |
| Save bug A: no CELL in the blob | REAL | saveBlob (:15987) stores px/py but not the current cell — load after a district crossing = right coordinates, WRONG district. The run gained crossing 7/27; the save format never followed. |
| Save bug B: wrong sim seed on load | REAL | applyBlob (:16019) reseeds agents with base SEED; buildSim (:14672) uses SEED^cellX^cellY — load and your neighbours are different people |
| Memory, measured | EXISTS (instrumented + gated) | records/BOHEMIA_MEMORY_MEASURED_7_27_26.md: alpha 97.5MB resident (44% of the 224MB iOS floor); run 480 steps = +0.0MB pictures; canvas_memory_gate.py |
| CITY render architecture | EXISTS — the reference | chunk canvases + canvas LRU 64 + recycle pool sized against the iOS floor (CITY_B64:7060-7095) |
| Run render architecture | MISSING — naive | draw() :15335 full per-tile redraw of the whole viewport per input, zero chunk cache, zero dirty rects |
| FPS / frame-time instrumentation | MISSING | no frame instrumentation on either walk surface; step latency is gated, render latency is not |

### SYNC BURDEN (what any engine change must chase)

| Carrier | Resync tooling |
|---|---|
| CITY_B64 (40 modules) | EXISTS — bohemia_city_module_resync.py, green 40/40 |
| RUN_CURRENT (50 modules inlined) | EXISTS — build_run_slice.js + run_gate rebuild-is-a-no-op check |
| COMBAT_B64 | **NONE — 25 one-shot patchers, no freshness check** |
| RIG_B64 / PREFAB_B64 | none |
| sync_gate net | tracks only `const BOH_*` — bohemia_loop/agents/bq/quest_runtime + district generators are OUTSIDE it |

=============================================================================
## 2. THE TEN TRUE GAPS (ranked by how much they block)
=============================================================================
1. COMBAT IS A BLOB, NOT A MODULE. Everything Paolo wants next from combat
   (same-screen feel, allies, ambient danger) is blocked behind extracting
   BohemiaMelee into engine/ with a real resync tool. This is the wall.
2. VERTICALITY DOES NOT EXIST. No stair kind, no z-level, no floor index on
   any surface. The generators already produce multi-deck garages and story:2
   data that nothing consumes — the engine half-promises what no surface keeps.
3. THE RUN IGNORES THE STREAMING ENGINE BUILT FOR IT. A proven <5ms crossing
   path sits unused while the shipped run does a measured 25-40ms full-cell
   regen + sim rebuild every crossing. Small fix, big feel.
4. THE CITY WALK IS EMPTY OF PEOPLE and the run's renderer is naive — each
   surface has exactly the half the other one is missing.
5. THE ENCOUNTER DIRECTOR IS FINISHED AND UNPLUGGED (and its socket module is
   also unplugged). Two complete modules, zero surface.
6. QUEST GEOGRAPHY IS HARDCODED: 1 of 21 quests playable, via two literal
   tile constants and a string match. (Placement rule = [PENDING Paolo].)
7. THE RUN HAS NO BEAT. Hardcoded 500ms; the actual song never reaches it.
8. DAYCYCLE IS FINISHED AND WIRED NOWHERE CURRENT (two weeks unplugged);
   weather does not exist at all.
9. TWO REAL SAVE BUGS (missing CELL, wrong sim seed) that only started biting
   when the world got bigger, plus phantom desert residents.
10. DOC DRIFT: the run-handoff law still advertises the reverted warming +
    14ms number. (Corrected by coordinator note in that law, this turn.)

=============================================================================
## 3. THE HONEST WORK LEDGER (what it actually takes, per Paolo's three asks)
=============================================================================
SEAMLESS WALK->COMBAT needs, minimally: (a) BohemiaMelee extracted from
COMBAT_B64 into engine/ (+resync tool) — the precondition for everything;
(b) an enemy renderer on the run's tile canvas; (c) merging two input models
(hold-to-walk pad vs dial ring); (d) reconciling two beat clocks (run's
hardcoded 500ms vs the dial's audio clock). Until then the honest ship is a
FASTER TAB SWAP (re-land warming without the stale-clothing bug), not
seamlessness.

2-3 STORIES WITH CLIMBABLE STAIRS needs: (a) a 'stair' tile kind in the
floorplan vocabulary + a floor index (z) in floorplan state; (b) run + CITY
interior walkers reading z; (c) render treatment for "you are on floor 2"
(the interior plate already === footprint per law, each level too); (d) stair
TILE ART (already filed: BOHEMIA_TILE_REQUESTS.md row 1, HIGH). The garage
decks are the free pilot: generation already exists, only render+walk is new.

SMOOTH LOADING needs: the run calling w.stream() per step instead of
loadCell() full regen (engine path already proven <5ms), then chunk-canvas
rendering on the run (CITY's architecture is the in-repo reference). Memory
is already measured and inside budget; FPS instrumentation is the missing
gauge and should land with this work.

=============================================================================
## 4. ROUTING (which lane owns which gap — appended to BOHEMIA_BACKLOG.md)
=============================================================================
- COMBAT: extract BohemiaMelee to engine/ + COMBAT_B64 resync tool (gap 1).
- WORLD: stair kind + z-level in floorplan (gap 2 engine half); fix
  homeFootprints district filter (gap 9c); world_resolve adoption stays
  blocked on the moment table [PENDING Paolo].
- RUN (integration lane): adopt w.stream() (gap 3); save CELL + per-cell
  seed fixes (gap 9); wire bohemia_daycycle (gap 8, REUSE-FIRST: the module
  is finished); beat handoff from parent (gap 7).
- CITY: people on the human-mode walk surface (gap 4, reuse BohemiaAgents).
- SHARED non-cook: FPS/frame-time instrumentation; widen sync_gate's net.
- NOT ROUTED (canon-level, [PENDING Paolo]): the quest placement rule.
- RULED 7/28 (same day, both former pendings): REAL seamless combat is the
  goal, extraction-not-rewrite ("in the exact whole coding how we built it")
  — laws/BOHEMIA_ADDENDUM_REAL_COMBAT_ON_THE_WALK_7_28_26.md. WEATHER
  EXISTS, Vegas-real and not diverse (sunny > cloudy > rain ~monthly, dead
  foliage is the baseline) — laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_7_28_26.md.
