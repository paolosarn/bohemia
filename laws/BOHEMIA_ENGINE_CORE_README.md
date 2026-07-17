# BOHEMIA ENGINE CORE

The deterministic foundation every Bohemia system sits on. This is the thing a
porting engineer opens first, and it's built to pass the ten-minute checklist in
`BOHEMIA_ADDENDUM_ENGINE_ARCHITECTURE_6_30_26.md`.

Pure simulation core. **Zero render, zero DOM, zero timers.** Runs identically in
node (for the tests) and in the browser (for the game), no build step.

## Files

- `bohemia_core.js` — the core (RNG, Clock, World model). ~290 lines, commented.
- `bohemia_core.test.js` — the proof. 18 tests, all green.
- `bohemia_save.js` — the versioned save system (migration, choices-not-state, reconstruct).
- `bohemia_save.test.js` — 19 tests, all green.
- `bohemia_economy.js` — three-currency economy (faucet/sink flow, monopoly-proof, forward-computable).
- `bohemia_economy.test.js` — 19 tests, all green.
- `bohemia_factions.js` — factions: standing/rungs, territory control, cheap utility AI, LOD-aware.
- `bohemia_factions.test.js` — 21 tests, all green.
- `bohemia_entities.js` — entity/spawn engine: spatial-hash deterministic spawning + delta overlay.
- `bohemia_entities.test.js` — 20 tests, all green.

## Run the tests

```
node bohemia_core.test.js
node bohemia_save.test.js
node bohemia_economy.test.js
node bohemia_factions.test.js
node bohemia_entities.test.js
```

Exit code 0 = all green. Currently 18 + 19 + 19 + 21 + 20 = 97 total.

## What's in it

**1. Seeded RNG (`sfc32` + `xmur3` string hash).**
Chosen over mulberry32 (which provably skips ~1/3 of all 32-bit values). Seed
from a human-shareable string ("SIN CITY"). Branch named independent streams
(`rng.branch('combat')`, `rng.branch('worldgen')`) so subsystems can't correlate
or desync — consuming a combat roll never shifts the map. This is Engine Law 3:
all gameplay randomness flows from the seed, never `Math.random()`.

**2. Fixed-timestep Clock (120 BPM).**
The sim advances in fixed 500ms beats; render runs free and reads the returned
interpolation alpha for smoothness but never drives the sim. The accumulated
delta is **clamped** so a backgrounded tab resumes with at most 5 beats of
catch-up instead of freezing while it replays 200 (the spiral of death). This is
Engine Law 2, and it makes "120 BPM drives everything" a literal engine fact.

**3. World model (three-state tiles + LOD tiers).**
Districts carry a texture-state value (apocalypse→recovering→modern) that drifts
under standing pressures (the dynasty's choices). Three sim tiers: HOT (ticked
every beat), WARM (ticked coarse), COLD (not ticked — computed forward only when
looked at). The camera zoom promotes/demotes tiers.

## The load-bearing proof

The most important test (section C) proves **forward-compute equivalence**: a
COLD district jumped forward 5000 beats in one math step lands on the EXACT same
value as an identical district ticked one beat at a time. This equivalence is
what makes two big claims valid:

- **The save stores choices, not state.** On load, the world is recomputed
  forward from the choice log. Small save, exact result.
- **The generational time-skip is exact.** Handing off between dynasty
  generations is one big deterministic forward-compute across the years.

If that test ever fails, both of those are broken. It passes.

## The save system (`bohemia_save.js`)

Engine Law 4: a player must never lose a 100-year dynasty to an update. The
Bohemia-specific insight (proven by the core's forward-compute test): the save
does **not** store the world. It stores `seed + the ordered log of dynasty
choices`, and the world is **recomputed forward on load**. Tiny saves, tractable
migration.

- **Versioned.** Every save carries an integer version. `CURRENT_SAVE_VERSION`
  is what this build writes.
- **Migration chain.** Ordered functions (`v1->v2`, `v2->v3`, ...) each do one
  step. On load, an old save walks forward through the chain to current. Additive
  changes use defaults; renames copy old->new (never rename in place).
- **Refuses what it can't handle.** A save from a *newer* build, a save with no
  version, corrupt JSON — all refused loudly, never silently guessed.
- **`reconstruct()`** rebuilds the live world from `seed + choice log`, replaying
  choices in beat order so a mid-run pressure change only affects later beats.

### The payoff proof (save test section C)

`reconstruct == live`: a world rebuilt from a save is byte-identical to the world
played live, choice-timing and all. This test caught a real bug during the build
(reconstruct was ignoring *when* each choice happened, backdating late choices to
beat 0) — exactly the kind of subtle save corruption that would be brutal to find
in a shipped game. Fixed and proven.

## The economy engine (`bohemia_economy.js`)

The three-currency economy (GDD v2 §12) as a **faucet/sink flow** — the standard
game-economy model. Every currency in a district is a tank: faucets (production)
fill it, sinks (consumption) drain it. Balance the flow or you get inflation
(overflow) or starvation (empty).

- **Three currencies:** electricity, medicine, clout. Anyone can produce; faucets
  differ in scale and quality, not exclusive access (per canon).
- **Medicine quality gate:** low-quality medicine produces nothing usable
  ("bad medicine becomes waste" — GDD v2 §12).
- **Monopoly-proof by construction:** `MAX_PRODUCER_SHARE` (60%) is a hard
  invariant. No single producer can control a currency in a district. The engine
  detects and can refuse/rival any state that would breach it. This is "the
  system that cannot be monopolized cannot be collapsed the same way twice"
  turned into a number.
- **Forward-computable:** net flow per beat is constant between player actions, so
  a COLD district's economy jumps forward in one step exactly like district
  texture-state. Rides the LOD tiers. Proven: beat-by-beat == one jump.

This is what makes "building gets easier as the city backs you" and "your choices
change the world" mean something numerically. It plugs in as a system-island that
reads the world and writes currency state.

## The faction system (`bohemia_factions.js`)

Factions that hold territory, stand somewhere with the player and each other, and
expand/defend via **cheap deterministic AI** that rides the LOD tiers. The system
the Mayor Arc and base-defense read from.

- **Standing** is one number per relationship on a -100..100 scale, with derived
  rungs: HOSTILE < COLD < NEUTRAL < WARM < **FWU** (ally). Shifts clamp, and
  **spillover** nudges linked factions (helping the Trades warms the Volunteers).
- **The Mayor Arc input:** `playerMandate()` returns the fraction of factions at
  FWU toward the player. Crossing ~0.49 is the popular-mandate unlock from the
  Mayor Arc addendum, now a computed number.
- **Territory AI, the cheap way** (Konkr.io + AI War 2): don't search the huge
  move space. Generate a few candidate claims from neighbors, score each with one
  utility function (want vs quota, target value, power vs the owner's resistance),
  take the best. Factions expand to a **quota** then stop sprawling but still bite
  rivals. No per-tile pathfinding brain, which is what keeps it phone-affordable.
- **Deterministic:** AI decisions ride the seeded RNG, so same seed => same map,
  and a COLD region's faction turns forward-compute by running N rounds on
  promotion. Proven in the tests.

A design bug the tests caught: at-quota factions were still sprawling into empty
land (a stray positive term in the utility function). Fixed so a sated faction
stops expanding but stays opportunistic against rivals, exactly the intended feel.

## The entity/spawn engine (`bohemia_entities.js`)

The delta model made real: **the world regenerates from the seed; the save stores
only what you changed.** The system behind "what you kill stays dead" and "is the
guy still there on reload."

- **Spatial-hash spawning:** a location's spawn is decided by hashing
  `(worldSeed, layer, x, y)` (FNV-1a) into a local seed, not by a global RNG
  sequence. So the same tile yields the same entity every time, no matter which
  direction you approach from or how many times you reload. The corner is the
  same corner, with nothing stored.
- **Delta overlay:** the spawn is the default; a player action writes a small
  delta (`cleared` / `emptied` / `depleted` / `built`) that overrides it. Clear a
  camp and it stays clear, permanently within the act. No timer respawn, ever.
- **Save scales with activity, not world size:** scanning 40,000 tiles adds zero
  deltas. A dynasty's save is a handful of records for the things you touched.
  Proven: save the deltas, rebuild the spawner from seed, the world is identical.
- **Generational threat reset:** at an act handoff, prior-act clears are dropped
  so a NEW threat map forms, while built structures survive. What you cleared this
  act stays cleared; next generation's threats are new, in new places. This is the
  Persistent Consequence addendum turned into code.
- **LOD-aware:** `scanRegion` instantiates (HOT), `countRegion` just aggregates
  (WARM), COLD does nothing until promoted. Bounded by the active window, never
  the 65-mile world.

## The foundation is complete

Six proven system-islands, all keeping time and state through the one
deterministic core: **clock, RNG, LOD world, versioned save, monopoly-proof
economy, territorial factions, and the entity/delta engine.** 97 tests, all green.
Every load-bearing engine question from the build order, determinism, time,
persistence, world scale, economy, faction AI, entity permanence, is answered in
running, tested code. What's left is the render layer on top and wiring the rig +
combat's existing 120 BPM clocks into this core's heartbeat. Those are assembly,
not foundation.
