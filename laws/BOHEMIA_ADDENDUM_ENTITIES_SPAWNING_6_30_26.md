# BOHEMIA — ADDENDUM: ENTITIES, SPAWNING & THE DELTA MODEL
*6.30.26 — how thousands of things (NPCs, buildings, enemies, resources, base structures) exist across a 65-mile procedural world on a phone budget, and how they persist across save/reload. The load-bearing system for the base-building + defense + open-world + economy DNA. Builds directly on the Engine Core (bohemia_core.js), the Save System (bohemia_save.js), and the World Model / LOD addendum. Grounds GDD v2 §10 (base building), §11 (proc-gen map), §16 (companions), §19 (enemies).*

---

## THE PROBLEM

Bohemia's DNA (Paolo's words): Stardew + Rogue Fable + Pocket City 2 + Fallout New Vegas + Skyrim + State of Decay 2, city-builder + base defense + procedural open world + economy + roguelite, on HTML that runs without a powerhouse PC. Every one of those games is a large world full of individual things. The hard question is not "how do I make one NPC," it's **how do tens of thousands of things exist across 65 miles without melting a phone, and still be there (or correctly not there) after a save and reload.**

The naive answer, store every entity in the save, is exactly what you must NOT do. This doc is the model that avoids it, assembled from how the named games actually solve it.

---

## THE ONE BIG IDEA: SEED-REGENERATES, DELTAS-PERSIST

The universal solution, proven in every open-world game: **the world is regenerated from the seed; only the CHANGES the player caused are stored.** Minecraft stores 18.4 quintillion possible worlds in a 64-bit seed and saves nothing but the blocks you personally altered. Same seed + same version = the same terrain, the same ore, the same villages, every time. The save is just the delta from that.

This is the SAME model as Bohemia's already-built save system (seed + choice log, world recomputed on load). Entities extend it: the world FULL of things regenerates from the seed, and the save carries only what the player changed. So an entity exists in one of two states, and knowing which is the entire design:

- **GENERATED** — spawned deterministically from seed + location + world state. Not in the save. Regenerated identically every load. (Most things.)
- **TRACKED** — the player did something that changed it, so a DELTA is logged. In the save. Overrides the generated version on load. (Few things.)

The tell for which bucket: **did the player cause a persistent change?** Loot a container → the "emptied" delta is logged (it stays empty). Kill a named enemy → the "dead" delta is logged. Walk past a random scavenger and do nothing → nothing logged; he regenerates (or doesn't) from seed next time, and nobody can tell. This is the graduation rule: an entity is anonymous and generated until the player's action promotes it to tracked.

---

## THE FOUR ENTITY CLASSES (each persists differently)

### 1. TERRAIN & STATIC WORLD (roads, buildings-as-geometry, the Strip, freeway)
Pure seed-generated. The fixed elements (Strip, Freeway Beltway, GDD v2 §11) are hardcoded anchors; everything else (district layout, building placement, offramps) is deterministic proc-gen from the seed. Never in the save. The three-state texture tint on top is the world-model's per-district state (already handled). **Persistence: regenerate from seed. Player changes to a tile's state are the district-pressure deltas the save already logs.**

### 2. THE PLAYER'S BASE (the city-builder / Pocket City layer)
The opposite extreme. Everything the player builds is 100% player-caused, so it is 100% tracked. Every structure placed, upgraded, or destroyed is a delta in the save. This is small (a base is hundreds of structures, not millions) and it MUST be exact, so it's fully stored, not regenerated. **Persistence: fully in the save as a structure list. This is the one entity class that is entirely delta, because the player authored all of it.**

### 3. NPCs & FACTIONS (the Skyrim / New Vegas / SoD2 layer)
Split by the graduation rule:
- **Anonymous background NPCs** (crowd, random scavengers, filler): seed + tile-state generated. A district's "population flavor" regenerates deterministically. Never individually saved. If the exact body re-rolls on reload, nobody notices, that's the point, and it's what keeps the save from tracking ten thousand nobodies.
- **Named / consequential NPCs** (quest givers, faction lieutenants, King Hobo, anyone the player interacted with meaningfully): TRACKED. Their existence, location, state (alive/dead/moved), and relationship become deltas/events in the save. On reload they're placed exactly and remember you. A background NPC graduates to tracked the instant an interaction has consequence.
- **Enclave lesson (SoD2, hard-won):** SoD2 caps enclaves at ~16 and warns performance degrades near the cap. **There is a hard ceiling on how many fully-simulated groups can exist at once.** Bohemia must cap concurrent HOT/WARM factions-and-NPCs per district and let the rest stay COLD-abstract. Count IS the enemy of a phone budget; design to a cap, don't pretend it's unlimited.

### 4. ENEMIES & LOOT & RESOURCES (the roguelite / defense / scavenging layer)
Seed + world-state generated, per the roguelite model. Enemy spawns, loot in a container, resource nodes, all deterministic from seed + location + current world state (act, district control, player rep). Player changes are small deltas: this container is emptied, this resource node is depleted (with a regen timer), this spawn is cleared. **Persistence: regenerate from seed; store only emptied/depleted/cleared deltas.** A base-defense wave is a seed-driven spawn function of (base value, act, threat level), reproducible and fair, never a stored army.

---

## THE OFFLINE-SIMULATION FORK (the State of Decay lesson — Paolo must decide)

This is a real design decision with a shipped-game cautionary tale behind it, flagged now so it's a conscious choice, not an accident.

**State of Decay 1** fully simulated your survivors while you were offline, they ate your food, got tired, got angry, and you'd load back into a depleted, upset base. **Players hated it so much it made people stop playing.** **State of Decay 2 removed it entirely:** when you're not playing, survivors do nothing.

Bohemia's LOD tiers make BOTH options cheap, so it's purely a design call, and it maps onto the tiers:
- **Option A — "the world waits" (SoD2):** on reload, WARM/COLD regions are forward-computed only up to `save.beat`. Time didn't pass for them while the game was closed. Safe, forgiving, no nasty surprises. The forward-compute already does exactly this.
- **Option B — "the world turns" (SoD1):** on reload, advance the world by the REAL wall-clock time elapsed since the save (deterministically, via forward-compute to a later beat). Your base got raided while you were at work; the Cartel expanded overnight. Immersive, punishing, and historically hated when mandatory.
- **The likely-right hybrid:** default to Option A (world waits) so nobody loses a dynasty to a work week, but allow *specific, opt-in, telegraphed* real-time events (a timed defense mission, a "hold this for 3 days" contract) where the passage matters and the player chose it. This threads the needle: the New Vegas/Skyrim forgiveness by default, with State-of-Decay tension where it's earned and consented to. **Ties to the blackout/rain windows already in GDD v3, those are exactly this kind of telegraphed timed event.**

**[PENDING — Paolo's call]** which model. The engine supports all three; this is a feel decision. Logged, not decided.

---

## HOW THIS RIDES THE LOD TIERS

Entities inherit the HOT/WARM/COLD tiers from the world model:
- **HOT (player's district):** every tracked entity instantiated live, every anonymous entity spawned from seed, full simulation, 120 BPM. This is where base defense, combat, and NPCs actually run as individuals.
- **WARM (nearby / actively-relevant districts):** entities exist as counts and aggregates, not individuals. "12 Cartel, 3 hostiles, base at 60% integrity." A faction war two districts over runs at this resolution.
- **COLD (the other 60 miles):** no entities instantiated at all. Just the district's abstract state. Entities are spawned fresh from seed the moment the district promotes toward HOT (the forward-compute catch-up already brings the district state current, and the seed regenerates its contents to match).

The **entity cap** lives here: a hard limit on concurrent HOT individuals (the SoD2 lesson). Exceed it and lower-priority anonymous entities don't instantiate. Named/tracked entities always get a slot; anonymous fill the remainder up to the cap.

---

## SAVE IMPACT (extends bohemia_save.js)

The save gains a small, bounded delta section beyond the choice log:
- `base` — the player's built structures (fully stored; small; exact).
- `tracked` — named entity states/events (alive/dead/moved/relationship). Bounded by how many things the player actually touched.
- `deltas` — emptied containers, depleted nodes, cleared spawns, keyed by location. Bounded by player activity, not world size.

Everything else regenerates from `seed`. So the save stays small and scales with **what the player did**, never with the size of the world. A 65-mile map and a 6-mile map have nearly the same save size for the same amount of play. That is the property that makes this shippable on a phone. And it migrates cleanly through the existing versioned-migration chain, because it's just more fields with defaults.

---

## WHY THIS FITS THE HTML / NO-POWERHOUSE CONSTRAINT

- **Small saves** (deltas, not world) → fast load, fits mobile storage, cheap to sync.
- **Seed regeneration** → the world costs CPU to generate only where the player is, only when they get there (like Minecraft generating chunks at the player's edge). Never all 65 miles at once.
- **Entity caps + LOD tiers** → a bounded number of live individuals regardless of world size, which is the only way a WebView on a mid-range phone stays smooth. The SoD2 cap is not a limitation to hide; it's the design honesty that keeps the frame rate.
- **Determinism** → the whole thing reproduces from seed + deltas, so it's testable the same way the core and save already are (the forward-compute equivalence proof extends to "regenerated entities match").

---

## OPEN QUESTIONS [PENDING]

- **Anonymous NPC re-roll tolerance:** when a background NPC regenerates, is it acceptable that the *exact* individual differs (same crowd, different faces), or must a district's background cast be stable across reloads? Stable costs a little more save; re-roll costs nothing. Probably: stable *flavor*, re-rollable *individuals*, but confirm.
- **Base-defense spawn fairness:** defense waves are seed-driven functions of base value + act + threat. Confirm they read as fair/earned (RF4 "difficulty from shape, not cheap tricks") and never as a stored gotcha army.
- **The offline-sim fork** (above) — the single biggest feel decision here.
- **Entity cap number:** what's the concurrent-HOT-individual ceiling on a target mid-range phone? Needs profiling once the render layer exists. SoD2's ~16 *groups* is a reference point, not a rule.
- **Resource node regen timers:** are depletion deltas permanent, or do they expire (node regrows after N beats)? Timed regen keeps the world from being strip-mined dead but adds a per-delta clock. Likely timed, confirm.

---

*BOHEMIA — Entities, Spawning & The Delta Model — 6.30.26*
*The world regenerates from the seed. The save stores only what you changed. The player's base is the one thing kept whole, because the player made it. Everyone else the world remembers only if they mattered.*
