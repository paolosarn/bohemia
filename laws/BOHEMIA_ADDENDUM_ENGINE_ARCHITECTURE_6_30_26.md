# BOHEMIA — ADDENDUM: ENGINE ARCHITECTURE & BUILD ORDER
*6.30.26 — the technical foundation doc. How the game gets built so it survives a real engineer's eyes and a porting studio's audit. Grounds GDD v2/v3 systems in an actual buildable architecture.*

---

## WHY THIS DOC EXISTS

Paolo is not building "a game." He is building an engine that happens to ship a game on top of it, the same way real studios do. A 65-road-mile procgen map, a world where every tile carries three texture states that shift across 100 years of player choices, three currencies, dynasty saves spanning three generations, faction AI, base building, and the Dead Eye Dial is not a single-scene project. It is a systems engine.

The danger Paolo named directly: a porting house charges 5x when they open the hood and smell vibe-code, because they know they will be untangling spaghetti. This doc is the countermeasure. It is the map a real engineer greps for in the first ten minutes, and finding it means they quote 1x, not 5x.

**The through-line, locked since combat:** one shared engine, single source of truth, many faces. Combat already lives this way (one engine, demos stamped from it, never hand-edited so they can't drift). Every system below inherits that same law.

---

## THE ORDER STUDIOS ACTUALLY BUILD AN ENGINE (and where Paolo is)

Real engines are not built feature-first. They are built foundation-first, in this order, because each layer holds up the next. Building out of order is what creates the bugs that never fully die.

1. **The clock.** A fixed-timestep loop that owns time. Nothing else gets built until the heartbeat is real. *(Bohemia: the 120 BPM law IS this clock. It is already canon. This is a massive head start most solo devs don't have.)*
2. **The data model.** How the world is stored in memory: entities, tiles, state. Decided before any behavior is written, because behavior reads from it.
3. **Determinism.** Same seed + same inputs = same result, every time. Built in early because retrofitting it later is agony. *(Bohemia: the seed system is already canon. The engine just has to honor it everywhere.)*
4. **The render layer.** Draws the data model. Kept strictly separate so the sim never depends on what's on screen. *(Bohemia: already living this with the character rig, sim moves joints, renderer rasterizes pixels, they don't touch.)*
5. **Save/load with versioning.** The moment the data model is stable, saves get a version tag and migration rules. *(Bohemia: the Bedroll save is canon; the versioning is the missing engineering piece.)*
6. **Systems out from the core.** Economy, factions, base building, each reading the model and the clock, each testable in isolation.
7. **Content last.** Quests, feed posts, CDs, dialogue. The most expensive to make, so never touched until the systems under them are stable.

Paolo already has 1 and 3 as canon and is living 4 in the rig work. The gap is writing 2 and 5 down as deliberate architecture instead of letting them emerge by accident. That's what the rest of this doc does.

---

## THE FIVE ARCHITECTURAL LAWS

### LAW 1 — SEPARATE DATA, LOGIC, AND RENDER

The single most important structural rule, and the one that prevents the entire class of bug that has cost Paolo sleep. Every disaster in the rig work traced to one root: **one fact living in two places that silently disagreed.** The poisoned leg storage, the "nothing happened," the holes, all the same failure.

The fix is architectural, not a patch:

- **DATA** is the one true state. The tile grid, the entities, the dynasty, the save. It is dumb. It holds facts, nothing else.
- **LOGIC** reads DATA, reads the clock, and writes DATA. It never draws. It never stores its own copy of a fact.
- **RENDER** reads DATA and draws. It never writes DATA. It never decides anything.

If a fact exists in exactly one place and everyone reads from that place, it can never disagree with itself. That is the whole cure. The rig already proved this works: the moment the paint and the skeleton read from one shared state instead of two, the eating-limbs bug became structurally impossible.

This is the same idea big engines get from ECS (entity-component-system): keep data and behavior apart for modularity and for cache performance. Bohemia does not need a full formal ECS (that would be its own kind of overengineering a solo dev doesn't need), but it lives the core principle everywhere.

### LAW 2 — THE CLOCK OWNS TIME (fixed timestep)

The simulation runs on a fixed timestep locked to the 120 BPM beat. The render runs as fast as the device allows. They are decoupled.

- The sim advances in fixed beats. Same on a 60Hz laptop, a 120Hz phone, a potato. This is what makes the 120 BPM law a literal fact of the engine rather than a hope.
- The render interpolates between sim states for smoothness, but never drives the sim.
- **The delta is clamped.** If the tab is backgrounded or the phone stutters and a big time gap appears, the loop does NOT try to catch up all at once (that's the "spiral of death" where the sim falls behind and never recovers). It clamps the catch-up and moves on.

One loop. One clock. Never `setTimeout` or `setInterval` driving motion, ever. That pattern is the number one thing an engineer greps for to detect amateur code.

### LAW 3 — DETERMINISM (seed + inputs = the whole world)

The game is already canon-committed to seeds (share a seed, get the identical map). The engine honors this by making the whole simulation deterministic: given the starting seed and the sequence of player inputs, every result reproduces exactly.

Requirements:
- Entities update in a fixed, stable order every tick. Never "whatever order the list happened to be in."
- All randomness flows from the seed, never from `Math.random()` called ad hoc. One seeded generator, threaded through everything.
- No system depends on wall-clock time or render framerate for a gameplay outcome.

The payoff is enormous and specific: **a bug report becomes "seed X, inputs Y" and it reproduces on the first try.** No more "it happened once, good luck." This is how games like Trackmania verify runs, and it turns debugging a 100-year dynasty sim from impossible into tractable. For a solo dev with no QA team, determinism is the QA team.

### LAW 4 — SAVE VERSIONING (never break an old save)

The Bedroll save is canon. The engineering the game needs on top of it:

- Every save is stamped with a schema **version number.**
- On load, if the save's version is older than the current, ordered **migration rules** upgrade it step by step to the current shape.
- The game never assumes a save matches the current code. It checks the version and migrates.

This matters triple for Bohemia because a single playthrough spans three generations and could span months of real-world time and many game updates. A player must never lose a dynasty because an update changed a data shape. The blunt "bump the storage key to wipe it" move used during rig debugging is fine as a one-time dev reset; it is NOT the shipping pattern. Versioned migration is.

### LAW 5 — SYSTEMS ARE ISLANDS (talk through DATA, not to each other)

Economy, factions, base building, combat, weather, the feed. Each is its own system. They do not call each other directly. They read and write the shared DATA model, and that is how they coordinate.

Why: when the faction system needs to react to a combat event, it does not reach into the combat system. Combat writes the event to DATA; factions read it on their tick. This means any system can be built, tested, and fixed in isolation without knowing the internals of the others. A solo dev can only hold so much in their head at once; islands mean you only have to hold one at a time.

This is the same law the combat engine already follows (one brain, many faces) generalized to the whole game.

---

## THE WORLD MODEL — THE THREE-STATE TILE (locked canon, newly written down)

**This is the piece that was discussed but never documented, and it is load-bearing for the entire engine.**

GDD v2 §20 establishes that every asset exists in three texture states (Apocalypse / Recovering / Modern) and that player choices push districts between them across 100 years. Paolo's clarification, now locked: **this is not just an art concept. It is how the world is stored. Every 1m ground tile carries all three versions.**

The implications the engine must be built around:

- A tile is not one texture. It is a small record holding its three state variants plus a current-state value (which can be a blend point, not just a hard 1/2/3, since GDD v2 §20 says states blend at borders rather than hard-cutting).
- The "dynamic texture generation" that GDD v2 promises (build infrastructure → district advances; side with the Cartel → district degrades; combat leaves marks) is just **logic writing the current-state value on affected tiles.** The three variants are always present; what changes is which one shows and how they blend.
- This makes the world's visual memory cheap and deterministic. The city at the end reflecting 100 years of dynasty choices is not a special end-game render. It is the natural readout of every tile's current-state value, accumulated tick by tick.

**Engineering consequences that must be respected:**
- **Memory:** three variants per tile across a 65-mile map is large. The map cannot all live in memory at once. It streams: only tiles near the player (and near active simulation) are resident; the rest live as compact records (each tile is really just "three variant IDs + a state float," not three full images). Variant art is shared/tiled, not unique per tile.
- **Determinism:** a tile's current-state is a pure function of dynasty history, so it reproduces from seed + inputs like everything else. Nothing about the world's visual state is random or wall-clock dependent.
- **Streaming boundary:** the fixed Strip and Freeway Beltway (the only non-procgen elements) are natural anchors for the streaming grid.

This tile model is the foundation the render layer, the save system, and the faction/economy systems all sit on. It gets built early, right after the clock.

---

## THE PACKAGING REALITY (why code quality = app quality)

The game is HTML/JS targeting iPhone. It ships to native platforms by wrapping the web build in a native shell (Capacitor is the standard path: it wraps the web app in a native iOS/Android WebView, with the native project committed as real source a studio can open).

The consequence that makes all of the above non-negotiable: **the WebView runs the code exactly as written.** There is no compiler cleaning it up, no engine layer hiding the mess. The quality of the web code translates one-to-one into the quality and performance of the mobile app. A porting studio opens the actual JS. This is precisely why "does it smell vibe-coded" is a real financial question and why the five laws are worth the discipline.

---

## THE TEN-MINUTE ENGINEER CHECKLIST

What a hired engineer greps for to decide 1x or 5x. Bohemia should pass every line:

- [ ] **One game loop**, one clock. Not motion scattered across timers.
- [ ] **No `setTimeout`/`setInterval` driving the simulation.** (Fine for a UI toast, never for game state.)
- [ ] **No `eval`** in gameplay code.
- [ ] **One seeded RNG**, threaded through. No stray `Math.random()` in gameplay.
- [ ] **Deterministic update order** for entities.
- [ ] **Data / logic / render separated.** Render never writes state; logic never draws.
- [ ] **Saves are versioned** with migration, not raw dumps.
- [ ] **One source of truth per fact.** No fact stored in two places.
- [ ] **State readable in one object** you can log and inspect. (The debug-overlay habit.)
- [ ] **Systems talk through data**, not by reaching into each other.

---

## STAGED REFACTOR / BUILD PLAN (never stops the game working)

The engine is assembled in stages, each shippable, each leaving a working build. Same order studios use, mapped to what Bohemia already has.

1. **Clock (done as canon).** Formalize the 120 BPM fixed-timestep loop with a clamped delta as the single heartbeat everything subscribes to.
2. **Tile world model.** Build the three-state streaming tile grid. This is the biggest new foundation piece and it unblocks render, save, and every world system.
3. **Determinism pass.** One seeded RNG, fixed update order, no wall-clock gameplay dependencies. Lock it while the systems are still small; it's cheap now and agony later.
4. **Save schema + versioning.** Once the tile model and core state are stable, stamp saves and write the migration path. Retire the dev-only key-bump resets.
5. **Systems out from core**, each an island reading data + clock: economy (three currencies), factions (AI + territory), base building, weather/blackouts (already canon as gameplay windows).
6. **Character/animation pipeline** plugs in as the render-layer citizen it already is (see the character pipeline addendum).
7. **Content last:** quests, feed, CDs, dialogue.

Every stage ends with the game still running. Nothing is a big-bang rewrite. This is the anti-vibe-code discipline made concrete.

---

## RESEARCH BASIS (so this isn't vibes)

The architecture above is standard practice, not invention. The load-bearing ideas and where they come from in the wider craft:

- **Separate data from behavior for modularity and cache performance** — the core ECS insight, adopted in principle without forcing the full formal pattern.
- **Fixed timestep with a clamped delta to avoid the spiral of death** — the canonical game-loop reference (Gaffer On Games, "Fix Your Timestep").
- **Determinism = seed + inputs reproduce any run; entities must update in matching order** — the approach games like Trackmania use to verify runs.
- **Versioned saves with ordered migration rules** — standard save-system practice; upgrade an old save to the current shape on load rather than breaking it.
- **Capacitor wraps the web build in a native shell as committed source; web code quality translates directly to app quality** — the reality of the HTML/JS-to-native path.

---

## OPEN ENGINE QUESTIONS [PENDING]

- **Streaming granularity:** what's the resident-tile radius around the player, and does active off-screen simulation (a faction war two districts away) keep its tiles hot or run headless on compact records?
- **Blend storage:** is a tile's current-state a single float (one axis, apocalypse→modern) or does it need per-source history (combat-scarred vs Cartel-degraded look different)? GDD v2 §20 implies different causes leave different marks, which may need more than one number.
- **Save size across 100 years:** a full dynasty's per-tile history could be large. Does the save store per-tile current-state, or store the dynasty's choices and recompute tile states deterministically on load (smaller save, leans on Law 3)? The determinism law makes the recompute option viable and probably correct.
- **Web engine vs raw canvas:** GDD v3 §Part Four floats Godot as the eventual engine. If the current HTML/JS prototype line continues to native via Capacitor, that's a fork in the road to decide before content stage: keep building the custom web engine, or port the proven systems into Godot. Not blocking now; flag before Stage 5 gets heavy.

---

*BOHEMIA — Engine Architecture & Build Order — 6.30.26*
*One shared engine, single source of truth, many faces. The law that started in combat, now the law for the whole game.*
