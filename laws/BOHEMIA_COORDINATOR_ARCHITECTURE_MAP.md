# BOHEMIA — COORDINATOR ARCHITECTURE MAP (maintained by the coordinator session)

Purpose: the coordinator holds the WHOLE machine in view so every lane-prompt it
drafts carries the real plumbing — exact files, exact re-sync steps, exact gates —
and a lane physically cannot wander into a silent-revert or stale-embed fuckup.
This is a COORDINATOR-PROCESS file (allowed under the coordinator brief). It is
READ-ONLY reporting about game code; it changes no engine/tools/gates/slices.

First built 7/25/26 from a six-pass read-only sweep (engine, embed/sync plumbing,
gates, tools/factory, alpha runtime, plus outside RPG-architecture research).
Re-verify against HEAD before trusting any line count or file name; the repo moves.

=============================================================================
## 0. THE ONE THING THAT CAUSES FUCKUPS: canonical code vs embedded copies
=============================================================================
Engine logic lives in engine/*.js (CANONICAL). But the shipped game
(slices/BOHEMIA_ALPHA_0_9.html) does NOT load those files — it carries COPIES of
them, some raw-inlined, some hidden inside base64 blobs. Edit a module and forget
to re-embed the copy and the live game silently runs STALE code. The global sync
gate CANNOT see inside base64, so a family of per-blob "byte-lock" gates exists to
cover that blind spot. Every lane prompt that touches engine code MUST name the
re-embed tool AND the gate, or it risks a silent revert. This section is the spine
of everything below.

=============================================================================
## 1. THE TWO ENGINES + THE SPINE (hub files — extra caution editing)
=============================================================================
The repo is deliberately TWO engines that must not be confused:
- GAME ENGINE ("the brain"): bohemia_engine.js, _scheduler.js, _loop.js,
  _overmap.js, _world.js + all district builders + agents/dress/economy/memory/
  cityedit/bq.
- GRAPHICS ENGINE ("the body"): bohemia_engine_graphics_7_14_26.js + the 9 BOH_*
  modules (blockgen, tilepool, powergrid, light_registry, light_pass, daycycle,
  patrol, prop_scale, slice_engine) + overmap_bridge, plotgen, floorplan.

DEPENDENCY SPINE (who requires whom):
  bohemia_loop.js  → engine.js (leaf), scheduler.js (leaf), world.js
  bohemia_world.js → overmap.js, overmap_bridge.js, blockgen.js, floorplan.js,
                     district_kit.js, + ~38 district builders
  each district builder → district_kit.js   (EXCEPT suburb.js & commercial.js,
                     the two ORIGINAL standalone builders the kit was extracted
                     from — they depend on nothing)

HUB FILES (highest blast radius — a coordinator gates edits to these behind extra
review; a change here ripples across the whole game):
  1. engine/bohemia_district_kit.js  — required by ~36 district builders + world.
     Change grid/register/rotateToStreet/footprints → every district shifts.
  2. engine/bohemia_world.js         — the composer over the whole gen pipeline
     (~44 requires); break it and everything above the generators breaks.
  3. engine/bohemia_engine.js        — 16 sub-systems; game-side root.
  4. engine/bohemia_scheduler.js     — the 120-BPM BEAT/turn contract everything
     assumes.
  5. engine/bohemia_overmap.js       — valley layout every plot derives from.
  6. engine/bohemia_engine_graphics_7_14_26.js — graphics core the bundle mirrors.

The ~38 district builders are cookie-cutter (config + K.register); low individual
risk but all share the district_kit blast radius. Life/graphics-runtime/paint
modules are LEAVES — safe to edit in isolation EXCEPT the 9 sync-canon BOH_*
modules (§3B).

=============================================================================
## 2. THE EMBED/SYNC PLUMBING — THE FUCKUP-PRONE LAYER, MAPPED
=============================================================================
### 2A. The four base64 blobs in the alpha (each is a whole standalone HTML page,
decoded into an iframe srcdoc on first tab click):
  - RIG_B64    → rig/anim lab.   Maintainer tool: NONE. Byte-lock gate: NONE. (orphan)
  - COMBAT_B64 → combat demo.    Tool: bohemia_combat_melee_patch.py. Gates: content-only
                 (combat_lab/pool/anim/herobeat) — NOT a full body byte-lock.
  - CITY_B64   → the live city.  EMBEDS MANY ENGINE MODULES inside it (overmap,
                 powergrid, suburb, district_kit + ~10 districts, + nested LAMP_B64).
                 Tools: bohemia_city_overmap_resync.py + ~15 bohemia_city_*_patch.py.
                 Gates: city_tab_gate.js, hero_wire_gate.js, houseart_gate.py.
  - PREFAB_B64 → prefab lab.     Tool: NONE. Gate: NONE. (orphan)

### 2B. Raw-inlined "CURRENT" standalone pages (verbatim bodies + engine-md5 stamps,
NOT base64):
  - BOHEMIA_MAP_CURRENT.html — LIVE (the MAP tab). Embeds 44 modules (district_kit
    + 36 districts + overmap/bridge/blockgen/floorplan/garage/crypt/world).
    Built by tools/bohemia_map_tab.py. Gate: map_tab_gate.js (per-module STALE: check).
  - BOHEMIA_CITY_CURRENT.html — DORMANT (wired nowhere; the live CITY tab is the
    alpha's inline CITY_B64). Embeds overmap + cityedit. Built by bohemia_city_tab.py.
    Gate: city_tab_gate.js also asserts it stays unwired.

### 2C. THE CHECKLISTS — "edit engine module X → run Y → or gate G goes red":
  Edit engine/bohemia_overmap.js:
    1) python3 tools/bohemia_city_overmap_resync.py   (patches CITY_B64)
    2) python3 tools/bohemia_city_tab.py              (refreshes CITY_CURRENT md5)
    3) python3 tools/bohemia_map_tab.py               (overmap is 1 of MAP's 44)
    Gates: city_tab_gate.js, map_tab_gate.js.
    ⚠ The resync ALONE is not enough — city_tab.py is required for the md5 stamps.
  Edit engine/bohemia_cityedit.js:  python3 tools/bohemia_city_tab.py → city_tab_gate.js
  Edit powergrid / suburb / district_kit / a CITY-embedded district:
    re-run the specific bohemia_city_*_patch.py that embeds it (lights_patch for
    powergrid, suburbs_patch, districtart_patch, or newdistricts_patch for a brand
    new type) + python3 tools/bohemia_map_tab.py. Gates: city_tab_gate.js, map_tab_gate.js.
  Edit world.js or any of the 36 district generators: python3 tools/bohemia_map_tab.py
    → map_tab_gate.js. (Full new-district add also touches overmap enum, world DISTGEN,
    tilespec.js + gate, aerial MODMAP, district_registry.py, taxonomy — see §5.)
  Edit combat (COMBAT_B64): DECODE FRESH FROM HEAD (never an old scratch decode —
    parallel combat sessions land real changes in this same blob), edit, re-encode,
    then run the FULL gate suite (not a spot check).
  Edit door art: python3 tools/bohemia_suburb_walk.py → doorart_gate.py
  Edit district hero sprites: python3 tools/bohemia_city_hero_wire_patch.py → hero_wire_gate.js
  Edit RIG_B64 / PREFAB_B64 source: NO TOOL, NO GATE — hand-re-embed; nothing catches staleness.

### 2D. ENGINE SYNC LAW (gates/bohemia_sync_canon.txt): declares, per BOH_* module,
its ONE canonical carrier file (9 listed: BLOCKGEN, OMBRIDGE, DAYCYCLE, LIGHT,
LIGHTREG, PATROL, SCALE, SLICE, TILEPOOL). The gate rips every `const BOH_* =` body
out of every .js/.html, normalizes (comments/whitespace stripped), md5s it, and
FAILS if any module has >1 distinct body anywhere. Standalone .js is canonical;
bundle + slice copies are downstream and must be re-inlined from it the same turn.
Canon is DECLARED, not mtime-inferred (dropping an old copy makes it the newest AND
most-wrong file — this literally happened 7/16). Modules NOT in the list (PLOTGEN,
POWERGRID, FLOORPLAN, TRANSITIONS) fall back to mtime-inference — a gap worth closing.
Origin story: BOH_SLICE once had 4 distinct bodies across 14 carriers.

### 2E. Documented gotchas (recorded in the handoff / laws — cite these in prompts):
  - Base64 blind spot: the sync gate skips base64, so stale bodies hide in blobs;
    the byte-lock gates exist for exactly that.
  - Never re-embed COMBAT_B64 from an old scratch decode — silent revert shipped
    clean twice because only a spot-check ran. Run the FULL suite.
  - Resync ≠ tab rebuild: overmap/world edits need BOTH resync AND city_tab.py.
  - CITY_B64 merge conflicts: take the OTHER/more-recent side, re-run only the
    resync on top — never keep your own older copy (it silently reverts a
    concurrent patch; caught only when city_tab_gate's lock count dropped).

=============================================================================
## 3. THE GATE SYSTEM (FACTORY LAW enforcement)
=============================================================================
gates/bohemia_gates.py is the master runner: one GATES list of
(name, ['node'|'python3', path], what-it-protects, slow?). ~95 registered. .js
gates run under Node and require the engine modules; .py gates do pixel/filesystem/
docstring sweeps. --fast skips the two slow pixel sweeps (LEAF PIXEL, PURITY).
--strict makes the runner exit non-zero on any failure (default just reports).
Every law maps to a gate (art_45_gate→45° law, walkable_gate→walkable-land law,
tan_gate→tan wall 85/15, structure_gate→structure-not-color, landlocked_gate,
etc.). The ~35 individual district gates each enforce the SAME law stack
(street-aware + walkable + dossier + purity + deterministic) via a shared template
over 6 street configs × 3 seeds; park_gate.js is the reference. district_kit_gate.js
proves the shared machine (primitives, streetEdges S>E>W>N, rotateToStreet, drive
network, registry/taxonomy).
NEW LAW = NEW GATE, SAME TURN, and it MUST be registered in bohemia_gates.py — an
unregistered gate is treated as no gate (bohemia_loop_gate.js was silently red +
unregistered for weeks until 7/23; that was the canonical failure). Run the FULL
suite before any ship. Known non-gate: bohemia_canon_index.py is a generator
utility, correctly not registered. Standing risk the repo documents: BEHAVIORAL
staleness — a gate green on output NUMBERS but wrong on rendered PIXELS (the crawl-
dying + hoodie post-mortems). Hence VERIFY ON THE REAL SURFACE.

=============================================================================
## 4. THE TOOLS/FACTORY PIPELINE + VERDICT WORKFLOW
=============================================================================
FACTORY LAW: typed spec → generator → batch output → kill/approve judge → its own
gate. In tools/:
  - Generators/factories (cook NEW pixels): *_factory.py, *_gen.py, *_cook*.py.
    Shared 3D→sprite BAKER = bohemia_iso3d.py (software iso renderer; every hero
    factory imports it). bohemia_district_hero_factory.py bakes the 15 city-builder
    hero buildings from it.
  - Judges (Paolo's thumbs): *_judge.py → slices/*_JUDGE_*.html (thumbs, per-item
    comment, global comment box, SUN MODE, EXPORT .txt never .json). Reached from
    inside the alpha (LIFE tab hub), never a separate link (one-alpha/one-link law).
  - Marriage/wire/resync patches (approved asset → live alpha): bohemia_city_*_patch.py
    (all decode CITY_B64, inject idempotently via markers, re-encode).
  - Extract/embed (source of truth → machine bank): wardrobe_extract, tilespec.js,
    district_registry.py, district_grid_dump.js.
FLOW: factory → banks/*_CANDIDATES_*.txt (UNJUDGED) → judge HTML → Paolo taps →
records/*_VERDICT_*.txt (the ruling of record) → marriage patch embeds into the
alpha → gate locks it. Approval unlocks volume. Rejects → graveyard + post-mortem.
NOTES ARE RULINGS: if he said he likes it, that IS the verdict — build it, don't re-thumb.
REUSE-FIRST: every *_factory.py / *_cook*.py must carry a `REUSE CHECK:` docstring
naming which banks/ it opened; a claimed reuse must actually open() the bank in code.
Gate: reusefirst_gate.py.
Biggest "touch X → regenerate Y" couplings: iso3d (shared by all heroes); a
district's palette/legend feeds grid_dump → heroes + tilespec + registry; house-skin
bank fans out to judge + houseart_patch + districtart_patch; the marking chain is
strictly ordered (turn_arrow → bold → volume → bake); vehicle sizes globally locked
by vehicle_size_gate.py.

=============================================================================
## 5. THE ALPHA RUNTIME (slices/BOHEMIA_ALPHA_0_9.html — the one shipped file)
=============================================================================
~10.4k lines / 32MB (almost all of it the four base64 blobs). Ten tabs, three
delivery styles:
  - INLINE (drawn in parent doc): char, clothes, anim, music.
  - EMBEDDED-BLOB iframes (srcdoc from base64, decoded on first click): rig, combat,
    city, prefab(hidden).
  - EXTERNAL-FILE iframes (data-src → sibling *_CURRENT.html, lazy src on click):
    slice, life, map.
BOOT: service worker registers first → front splash "TAP TO ENTER" → buildUI() →
blobs decode LAZILY per tab click (atob → TextDecoder → iframe.srcdoc), each guarded
to mount once. window.BohemiaEngine is the shared combat/inventory engine.
CROSS-TAB COMMS: raw window.postMessage / addEventListener('message'), parent = hub,
iframes = spokes, wildcard origin. No shared globals cross the iframe boundary.
  - combatMsgIn(d) is the main child→parent router (shot resolution, sprite bakes,
    city player, save persistence, prefab sync).
  - MUSIC→COMBAT hero-beat channel: musicPushToCombat() posts {bohemiaMusic:{...,
    factions,song2,pools}} to combatFrame; the hero beat rides inside as
    MUS.hero["<name>#1"] / "#2" (there is NO top-level _hero1 var). A hero-beat
    button sets MUS.hero[key]=n, saves, calls musicPushToCombat() → reaches combat live.
FRESHNESS (one-URL-forever law): #buildstamp visible token (currently BUILD 7/24aa)
+ a 120s/visibility build-watcher that re-fetches and shows "NEW BUILD READY" if the
remote stamp differs; plus slices/sw.js network-first service worker. No ?v= ever.
HEADLESS-VERIFY GOTCHA: G is a page-level const (NOT window.G — window.G is
undefined). MUS/CITYSAVE/CITYMUS/CBRIDGE likewise. Combat/city internals live inside
srcdoc iframes (separate windows) reachable only by postMessage. A verifier reading
window.G gets undefined; evaluate inside the closure or reach through the DOM.

=============================================================================
## 6. LANE OWNERSHIP + COLLISION SURFACES (the coordinator's core job)
=============================================================================
The alpha is the highest-contention file; ownership by region:
  - COMBAT lane → COMBAT_B64 blob + parent combat bridge (combatMsgIn,
    combatSendSprites, CBRIDGE/BohemiaEngine wiring, encounter lifecycle).
  - LIFE/CITY lane → CITY_B64 + PREFAB_B64 blobs + citySendPlayer/CITYSAVE + city
    save/restore/prefab handlers + external life/slice/map iframes + district art +
    district heroes.
  - CHARACTER/SOUND lane → music studio (MUS/MFACTIONS/MLOOPS), hero-beat UI,
    musicPushToCombat, CITYMUS shuffle, char/anim/face/rig sprite baking.
  - SHELL/SHARED (coordinator watches) → tab bar + panels, the tab-click lazy-mount
    switch (EVERY lane's boot/mute/push converges here — THE classic conflict point),
    front boot, buildstamp/build-watcher, export modal, RIG_B64.
STRUCTURAL COLLISION HOTSPOTS to watch every check-in:
  1. The tab-click handler (all lanes' mount/mute/push logic).
  2. combatMsgIn router (combat + city/life both extend it).
  3. CITY_B64 (many city patches mutate one blob; ONE-SYSTEM-ONE-SESSION exists for this).
  4. bohemia_loop.js (world-model lane's territory-AI vs the quest lane's feed/social —
     see the 7/25 check-in finding: the quest lane is a SEPARATE git history).
  5. engine/bohemia_district_kit.js (any edit ripples through ~36 districts).

=============================================================================
## 7. KNOWN ORPHANS / RISKS / STANDING FLAGS (for prompts + check-ins)
=============================================================================
  - RIG_B64 and PREFAB_B64: no maintainer tool, no byte-lock gate. Edits are
    invisible to the machine — a real coverage hole.
  - Sync-canon list omits PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS (mtime fallback).
  - Behavioral gate staleness (numbers-green, pixels-wrong) — always verify on the
    real surface for anything visual.
  - QUEST/LORE lane (branch claude/bohemia-quest-log-access) shares NO git ancestor
    with main — a whole separate history, its own loop.js and its own alpha copy,
    never merged. A real reconcile (not a merge button) will be needed eventually.

=============================================================================
## 8. RESEARCH — how the greats architect games, distilled to Bohemia principles
=============================================================================
The universal shape across Bethesda, Larian/BG3, CDPR, Paradox, RimWorld, Dwarf
Fortress, Caves of Qud, Pocket City: the ENGINE IS A SMALL STABLE INTERPRETER; THE
GAME IS A LARGE PILE OF DECLARATIVE DATA. Everything below is downstream of that.

  1. DATA-DRIVEN: behavior written once, hundreds of instances stamped as data the
     code never names. Bethesda records/FormID with load-order override; Larian tiers
     (stats .txt with `using` inheritance / LSX object graphs / Osiris rules); Caves
     of Qud's 22k-line ObjectBlueprints inheritance tree of component "parts"; Paradox
     90%-script + a validator that yells on load; DF raws. Robust because: typed
     schema, prototype/inheritance (deltas not copies), STABLE STRING IDs (never array
     index), one interpreter per concern, load-time resolution + a legible error list.
  2. QUEST GRAPHS: explicit state as data + a machine that enumerates/validates it.
     Bethesda = numbered stages + aliases (roles filled at runtime) + flags, all
     inspectable. Larian Osiris = declarative event/query/call rules over a fact DB
     (local, composable). Ink/Yarn/Twine = narrative graph compiled to data. Keep
     flags a namespaced dumpable store; gating = a DECLARED precondition the engine
     evaluates, never if-towers; add a REACHABILITY validator (every quest terminates,
     every flag is set somewhere, no orphan nodes).
  3. SIMULATION: composition over inheritance (component "parts"), one small SYSTEM
     per behavior ticking the entities that have the relevant part. Three-tier LOD:
     active (near player, full) / dormant (state kept, not ticked) / abstract (a few
     numbers + occasional events). Deterministic seeded gen from ONE controlled PRNG,
     gen = pure fn of (seed, cell).
  4. LIVING WORLD, cheap + legible + not runaway: EVENT-GATED not continuously ticked.
     RimWorld's Storyteller (a rate-limited event DIRECTOR spending a drama budget on
     a weighted incident table) is the model — cheaper, more legible, AUTHORED. Guard
     with caps, negative feedback, decay-to-baseline, discrete states over floats, and
     a REASON record on every autonomous change.
  5. PIPELINES: 3D→sprite baking done offline, output regenerable + never hand-edited
     (Bohemia already does this via iso3d). Prevent silent rot with schema validation
     on load, referential-integrity checks, "construct every entity" smoke loads,
     golden/seed-hash regressions. THE GATE IS THE PIPELINE.
  6. SOLO-DEV FILTER (one person + AI + one HTML file — entropy is the enemy, not perf):
     WORTH IT — engine/content split; typed content + a load-time validator (point the
     existing gates at DATA, not just art); stable string IDs; prototype/inheritance
     (object spread, formalized); systems-tick-over-data (light composition, NOT a real
     ECS); a rate-limited event director instead of continuous faction sim; three-tier
     LOD; one seeded PRNG; a dumpable flag store + reachability gate for quests; offline
     art baking as a factory.
     OVER-ENGINEERING — a real archetype ECS; a homegrown scripting language/VM (JS data
     + predicate closures already ARE the rules engine); a Bethesda multi-plugin override
     stack (git is your layering); continuous autonomous economic sim (the classic
     solo-dev world-eater); a homemade Creation-Kit IDE; pixel-diffing every UI.
  THE THROUGH-LINE: the best studios converged on exactly Bohemia's existing law stack
  (factory law, gates, dossiers, reuse-first) — small interpreters you can hold in your
  head, content as validated data an AI can extend without touching logic, a gate for
  every invariant. Bohemia's next architectural leverage is pointing that same gate
  culture at CONTENT/DATA (quests, districts-as-records) the way it already points at art.

=============================================================================
## 9. HOW THE COORDINATOR WRITES A FUCKUP-PROOF LANE PROMPT (template)
=============================================================================
Every engine-touching prompt names, explicitly: (a) the exact canonical file(s),
(b) the re-embed/resync tool(s) to run after, (c) the gate(s) that must be green,
(d) whether the edit hits a hub file or a shared blob (name the collision risk),
(e) "decode fresh from HEAD, run the FULL suite, verify on the real surface." A
prompt that says "fix the city" without the CITY_B64 resync+city_tab.py+map_tab.py
chain is a prompt that ships a silent revert. Pull the NEXT task from that lane's own
handoff notes — never invent the task. Draft only; Paolo dispatches.
