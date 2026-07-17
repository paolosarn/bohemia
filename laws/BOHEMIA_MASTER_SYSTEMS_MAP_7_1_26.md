# BOHEMIA — MASTER SYSTEMS MAP (the no-more-backtracking document)
### 7.1.26 — Paolo's standing order: never go into any work blind again, never backtrack again. This is the map that prevents it. Every system, its dependencies, its status, where it plugs into every other system, and EVERY KNOWN GAP marked before we build on top of it. Read this before starting any new system. If a new system isn't on this map with its wiring drawn, it doesn't get built yet.

---

## HOW TO READ THIS

Status tags:
- **[SOLID]** — built, tested, green. Safe to build on.
- **[ISLAND]** — built and tested, but NOT yet wired to the systems it needs. Works alone; will need a cable. Building on an island is fine IF you know it's an island.
- **[STUB]** — partially exists, has holes named below.
- **[GAP]** — does not exist. Named here so we never discover it mid-build.

The cardinal rule this doc enforces: **a system is only safe to build on when everything BENEATH it is [SOLID] and wired.** Building on an [ISLAND] or over a [GAP] is how we backtrack. This map makes the layer beneath always visible.

---

## THE LAYER STACK (bottom = foundation, top = what the player sees)

Everything rests on the layer below it. You cannot safely build a layer until the one under it is solid AND wired.

```
  LAYER 6  PLAYER-FACING     [GAP] UI, input, the actual game screens
  LAYER 5  PRESENTATION      [ISLAND] skinner (render), [GAP] tile/prop render, [GAP] camera
  LAYER 4  CONTENT SYSTEMS   [ISLAND] worldgen, factions+canon, economy, entities
  LAYER 3  SIMULATION        [ISLAND] heartbeat, [GAP] the master game loop that ticks everything
  LAYER 2  PERSISTENCE       [SOLID] save (seed+choicelog+forward-compute)
  LAYER 1  FOUNDATION        [SOLID] core (RNG, Clock, World/tiles/LOD)
```

**The single most important gap:** LAYER 3's master game loop. Every module was BUILT to be driven by the core (they all reference `core.`, `rng.branch`, `fromCoreClock`) but nothing actually drives them yet. Nine islands with matching plugs and no cables. Until the master loop exists and wires them, everything above Layer 2 is an island. **This is the next thing to build, and building anything player-facing before it is exactly the blind-forward mistake.**

---

## EVERY SYSTEM, ITS STATUS, ITS WIRING

### LAYER 1 — FOUNDATION

**core (bohemia_core.js) — [SOLID], 18 tests**
- Provides: `RNG` (seeded, branchable named streams), `Clock` (120 BPM fixed-timestep), `World` (three-state tiles, LOD tiers).
- Depended on by: EVERYTHING. This is the heartbeat and the dice for the whole game.
- Wiring OUT: every other module takes a `core` / `rng.branch(name)` / clock. Correct by design.
- Gaps: none known. Solid floor.

### LAYER 2 — PERSISTENCE

**save (bohemia_save.js) — [SOLID], 19 tests**
- Provides: versioned save (seed + choice-log, NOT world state), migration chain, `reconstruct()` replays choices in beat order then forward-computes.
- Depends on: core (replays through it).
- KEY CONTRACT: the world is a pure function of seed + choice log. Every system that changes the world MUST do it through a logged choice, or it won't survive a save/reload. **This is a constraint on every content system above.** [see Recorded-vs-Unrecorded addendum: choices carry a `recorded` bool.]
- Gaps: the `recorded:false` unrecorded-ledger flag is DESIGNED (addendum) but NOT yet implemented in the choice log. [STUB on that one field.]

### LAYER 3 — SIMULATION

**heartbeat (bohemia_heartbeat.js) — [ISLAND], 23 tests**
- Provides: the one 120 BPM clock all presentation subscribes to; `onBeat`/`onFrame`/`beatsFloat`/`phase`.
- Designed to wire to core via `fromCoreClock(coreClock)` — but NOTHING CALLS THAT YET.
- Wiring NEEDED: the master loop must create the core Clock, build the heartbeat from it, and tick both. Until then the rig and combat still each run their own clock.

**master game loop — [GAP] — THE CRITICAL MISSING PIECE**
- Does not exist. This is the spine that: creates core RNG+Clock, builds the heartbeat from the clock, loads a save (or new seed), generates the world (worldgen), seeds factions (faction_canon), spawns entities, and every frame ticks the clock → advances the sim → lets the skinner render. 
- Until this exists, all of Layer 4 and 5 are islands. **BUILD THIS NEXT.**

### LAYER 4 — CONTENT SYSTEMS (all [ISLAND] — built, tested, unwired)

**worldgen (bohemia_worldgen.js) — [ISLAND], 16 tests**
- Provides: deterministic valley from a seed, all geographic invariants enforced.
- Wiring NEEDED: take its RNG from `core.RNG.branch('worldgen')` instead of its own, so the map shares the world seed. Currently self-seeded (fine standalone, wrong for the unified game). One-line change when the loop exists.
- Feeds: faction base placement (the 14 factionSlots), district system, entity spawn regions.

**factions (bohemia_factions.js) — [ISLAND], 21 tests** + **faction_canon (bohemia_faction_canon.js) — [ISLAND], 13 tests**
- Provides: standing/rungs/spillover/AI + the canon relationship loader (war locks, protected floors, act power).
- Wiring NEEDED: (a) canon loader's `enforceConstraints` is NOT yet called inside `shiftStanding` — the constraints exist but the engine doesn't consult them on every change. [STUB]. (b) faction base placement into worldgen's factionSlots is [GAP] — designed, not built. (c) the Amalgamation "proximity to secret" heat value (threat-logic addendum) is [GAP].

**economy (bohemia_economy.js) — [ISLAND], 19 tests**
- Provides: 3 currencies, faucet/sink, monopoly-proof, medicine quality gate.
- Wiring NEEDED: hook currency sources to worldgen (solar border, dam, mega-project sites) and to territory control (factions). Currently abstract. [GAP on the geographic hookup.]

**entities (bohemia_entities.js) — [ISLAND], 20 tests**
- Provides: seed-spawn + delta overlay, permanent clears, generational reset.
- Wiring NEEDED: spawn regions must come from worldgen (which districts, which biomes). Currently region-agnostic. [GAP on the map hookup.]

### LAYER 5 — PRESENTATION

**skinner (bohemia_skinner.js) — [ISLAND], 50 tests — MOST DISCONNECTED**
- Provides: bakes a painted export + posed skeleton into a pixel grid; walk/idle poses off `beatsFloat`.
- Wiring NEEDED: it doesn't reference core OR heartbeat yet. The master loop must feed it `heartbeat.beatsFloat()` each frame. Right now it's called with a hand-passed number. This is the cleanest island — it's a pure function, so wiring is trivial, but it IS unwired.
- Feeds: the character render. The RIG TOOL (BOHEMIAN_RIG.html) is the authoring front-end for skinner's input (the export).

**tile / prop / clothing render — [GAP]**
- The skinner does the BODY. Nothing yet renders tiles, props, buildings, or clothing-on-bones. This is the big art-production plumbing Paolo flagged: one style decision → hundreds of assets. [GAP], and it's the next big art-pipeline build after the loop.

**camera / killshot camera — [GAP]** (combat has camera notes; not built as an engine system.)

### LAYER 6 — PLAYER-FACING — [GAP]
- Input handling, screens, HUD, the actual playable shell. Correctly last. Do not touch until 1-5 are wired.

---

## THE DEPENDENCY TRUTH (what must be solid before what)

- **Before ANY player-facing work:** the master loop (Layer 3 gap) must exist and wire core→heartbeat→content→skinner.
- **Before tile/prop art production:** worldgen must be wired to the loop (so there's a real map to place tiles on) AND Paolo must have locked an art direction (creative call, his).
- **Before combat integration:** heartbeat must be wired (combat's dial rides the same clock) and the skinner's combat-arm/detached-limb render path must exist [GAP].
- **Before faction gameplay:** faction_canon's `enforceConstraints` must be wired into `shiftStanding` [STUB→fix], and bases placed into worldgen slots [GAP].
- **Before economy gameplay:** currency sources hooked to worldgen geography [GAP].

---

## THE BUILD ORDER THAT PREVENTS BACKTRACKING

1. **Master game loop** (wire core → heartbeat → save → worldgen → factions → entities → skinner). Turns 9 islands into one engine. NOTHING player-facing before this.
2. **Wire the [STUB]s:** faction_canon into shiftStanding; recorded-flag into the choice log.
3. **Geographic hookups [GAP→build]:** faction bases into worldgen slots; entity spawn regions from map; economy sources from map.
4. **Art-production pipeline [GAP]:** tile/prop/clothing render (after Paolo locks a direction). The big asset-volume plumbing.
5. **Combat integration:** dial + detached-limb render onto the heartbeat + skinner.
6. **Player-facing shell:** input, screens, HUD. Last.

Each step's foundation is [SOLID] before it starts. That's the whole point.

---

## THE ONE-LINE RULE

**Before building anything, find it on this map. If the layer beneath it isn't [SOLID] and wired, build that first. If it's not on the map, add it to the map before you write code.** That is how we never go in blind and never backtrack again.

---

*BOHEMIA — Master Systems Map — 7.1.26*
*Nine solid islands, matching plugs, no cables yet. The next build is the cables. Never build a layer whose floor isn't solid. Never build off the map.*
