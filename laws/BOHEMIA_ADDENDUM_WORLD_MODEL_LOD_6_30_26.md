# BOHEMIA — ADDENDUM: WORLD MODEL, CAMERA LOD & SIMULATION DETAIL
*6.30.26 — the hardest and most load-bearing engine architecture doc. Ties together the three camera zooms, the three-state tile world, faction/economy simulation, the 100-year dynasty timeline, and the ghost time layer into one coherent model. Grounds GDD v2 §20 (textures, ghost layer), §21 (camera), §7 (dynasty), §11 (map) in a buildable architecture. Reads alongside the Engine Architecture addendum (6.30.26).*

---

## THE PROBLEM IN ONE SENTENCE

Bohemia has to simulate a 65-road-mile city, where every 1m tile carries three texture states, where factions and an economy keep running across the whole map, across ~100 years and three dynasty generations, on a phone. You cannot brute-force that. This doc is how it's done: the world runs at full detail only where the player is looking, and at progressively cheaper abstractions everywhere else, and it's the SAME simulation at every level, just at different resolution.

This is the exact problem every large open-world game solves, and it's solved with two linked techniques that Bohemia already has the bones for: **spatial LOD (level of detail) streaming** and **simulation LOD**.

---

## PART ONE — THE TWO KINDS OF LOD

### Spatial LOD (how the WORLD is drawn and stored)

Standard practice, confirmed across open-world titles (RDR2, Skyrim, AC Valhalla, Fortnite): the world is chunked into regions; near the camera regions render at full detail, and distant regions render progressively cheaper (simpler geometry, lower-res textures via mipmapping) until, far enough out, they're just an impostor, a single flat billboard of a whole region. Only chunks near the player (and near active simulation) are resident in memory; the rest live as compact records and stream in asynchronously on a background thread so the main thread never stalls into a loading screen.

For Bohemia specifically, chunk-based streaming with an octree/quadtree-style hierarchy is the fit (aggregate 4 fine tiles into 1 coarser tile, recursively, so a distant district is one cheap tile instead of thousands). The fixed Strip and Freeway Beltway (the only non-procgen map elements) are the natural anchors that pin the streaming grid.

### Simulation LOD (how the WORLD keeps living when you're not looking)

The harder, more important half, and the one that makes Bohemia's living city possible. The precedent is **Dwarf Fortress's "World Activation":** the whole world keeps its history running, but events near the player play out at full mechanical detail while the rest of the world advances at a coarser, abstract level. It's one continuous simulation; the resolution changes with distance and attention, not the existence of the simulation.

Applied to Bohemia, this is a tiered model:

- **HOT (full detail):** the district the player is in. Every enemy, every cover state, the dial, per-tile texture, individual NPCs, full combat. Runs on the 120 BPM clock.
- **WARM (coarse):** nearby districts and any district with active player-relevant simulation (a faction war two districts over, a base under raid while you're away). No per-tile, no individual pixel-NPCs. Aggregate state: who controls it, its economy output, its texture-state average, its threat level. Ticks far slower than HOT.
- **COLD (abstract):** everything else across the 65 miles. Stored as compact records. Advances in big cheap steps: faction territory drifts, economy accrues, districts slowly shift texture-state from accumulated pressure. No moment-to-moment anything.

The player moving, or zooming the camera, is what promotes a region HOT→WARM→COLD and back. Crucially, because the world is deterministic (Engine Architecture addendum, Law 3), a COLD region can be advanced by **computing forward from its last state + elapsed ticks** rather than having simulated every step. You don't pay for what nobody watched; you compute the result when someone looks.

---

## PART TWO — THE THREE CAMERA ZOOMS ARE THE LOD SELECTOR

GDD v2 §21 defines three camera levels. The key architectural insight, newly written down: **the three zooms are not three separate views bolted on. They are the player-facing handle on the simulation-LOD system.** Each zoom reads the same world data at a different resolution.

### Street Level — "Animal" (HOT)
The full-detail render of the player's immediate district. Pixel-art world, combat, NPCs, per-tile three-state textures showing their current blend. This is the HOT tier made visible. No UI clutter; just the world at maximum fidelity.

### City Zoom — "Human" (WARM)
Zooms out to the district/faction resolution. Faction borders light up, district status indicators, the feed becomes visible, economic and political relationships become legible. This is literally the WARM-tier aggregate state rendered as a map: you're seeing the coarse simulation data (who controls what, district health, faction standing) because at this zoom that's the resolution that matters. The city "as a system of relationships rather than a collection of immediate experiences" (§21) is the WARM data model shown directly.

### Planetary Zoom — "Angel" (COLD + meta)
The furthest abstraction. Earth-at-night light distribution (which communities survived, how brightly), Moon and Mars bases, plus the meta-layer that has no spatial home: karma, family virtues, faction standing summary, the quest log. This is the COLD tier plus the dynasty's accumulated meta-state. That the quest log lives ONLY here (§21, deliberate) is thematically load-bearing: checking your objectives forces the "tiny and everything" zoom-out, and mechanically it's just reading the top-level abstract state where objectives naturally live.

**So the camera is the LOD dial.** Zooming out doesn't load a different scene; it reads the same world at a coarser tier and renders the tier appropriate to that zoom. This is elegant and cheap: the data the WARM/COLD simulation already maintains for performance reasons is exactly the data the City/Planetary zooms need to display. One system serves both performance and the signature camera feature.

---

## PART THREE — THE THREE-STATE TILE AT EVERY LOD

The three-texture-state tile (Engine Architecture addendum) threads through every LOD tier cleanly:

- **HOT:** each 1m tile shows its actual current-state blend, per pixel, full res. The scarred-recovering-modern look the player walks through.
- **WARM:** a district's tiles aggregate to a single texture-state average. The City zoom shows a district as "mostly recovering, edging modern," one color-graded blob, not ten thousand tiles.
- **COLD:** a whole region is one number, its aggregate recovery level, feeding the Earth-at-night brightness at Planetary zoom (a thriving region literally glows brighter).

The dynamic texture generation GDD v2 §20 promises (build infrastructure → district advances; Cartel allegiance → district degrades; combat scars tiles) is **WARM/COLD simulation writing the current-state value**, and it propagates up the LOD hierarchy automatically: change enough HOT tiles and the WARM district average shifts, which shifts the COLD region number, which changes the Planetary glow. The city reflecting 100 years of choices at the end is not an endgame render; it's the natural top-of-hierarchy readout of accumulated per-tile history.

**Save implication (resolves an open question from the Engine addendum):** because the world is deterministic, the save does NOT need to store per-tile state across 65 miles for 100 years (huge). It stores the **dynasty's choices and events**, and tile/district/region states are **recomputed forward deterministically on load**. Small save, leans on Law 3. This is almost certainly the right call and this doc commits to it as the working plan.

---

## PART FOUR — SIMULATION TIME ACROSS 100 YEARS

The dynasty spans three generations (~100 years, three acts; GDD v2 §7). This is a second axis of LOD: **time detail**, not just space detail.

- **Within an act (playing a generation):** time runs at the fine tick. HOT district on the 120 BPM combat/action clock; WARM/COLD ticking coarsely underneath. This is the normal moment-to-moment game.
- **Between acts (generational handoff):** time fast-forwards years in one deterministic jump. The world is advanced from its stored state across the gap: factions shift territory, districts drift texture-state from the standing pressures the last generation set, the economy accrues, NPCs age or die. The new generation inherits a world computed forward, not one that was simulated second-by-second through the intervening years. Same trick as promoting a COLD region: compute the result of elapsed time rather than living through it.

This is why determinism is non-negotiable and why the save-choices-not-state model works: the generational handoff IS a big deterministic forward-compute. "Each generation inherits everything the previous built" (§7) is mechanically "recompute the world forward from the accumulated choice log to the start of the next act."

The Julius/Augustus sideways inheritance (§7, act three plays the niece/nephew, not the direct heir) is a data-model note, not an engine problem: the family tree is a small graph in the meta-state; which node the player controls next act is a selection, the world-forward-compute is identical regardless.

---

## PART FIVE — THE GHOST TIME LAYER AS AN LOD-NATIVE FEATURE

The ghost time layer (GDD v2 §20, the signature visual, colored trajectory lines showing movement through time, Interstellar's 5D language) is not a special effect bolted on each zoom. It's a natural readout of the simulation at each LOD tier, which is why §20 says it appears at every camera level:

- **Combat (HOT):** enemy movement trajectories projected. This is the HOT simulation's next-tick prediction drawn as a line. Reading it correctly and acting faster than it suggests is the mechanic. (Ties to the [ABILITY — not built] "see the enemy's next move" in the combat addendum.)
- **Base building (HOT):** projected future build state before committing. The simulation computed forward a few steps and drawn.
- **City zoom (WARM):** faction expansion projections; past and present of the city shown simultaneously. The WARM simulation's trend lines.
- **Planetary zoom (COLD/meta):** connection lines between dynasty events, Mars/Moon, the shape of the world; the Amalgamation's fifth-dimensional quality faintly visible. The COLD/meta simulation's relationships.

The through-line: at every tier the engine already computes "where is this going" (that's what forward-compute IS). The ghost layer is that computation made visible. This means the signature aesthetic and the core engine technique are the same thing wearing different clothes at each zoom, which is exactly the "one brain, many faces" law. The fifth-dimensional theme (the Amalgamation brushing 5D from above, King Hobo from below, GDD v3) gets a literal engine echo: the game's own ability to see across time-as-a-dimension is the ghost layer, and it deepens as you zoom out toward the Amalgamation's vantage.

---

## THE ARCHITECTURE IN ONE DIAGRAM (text)

```
                    CAMERA ZOOM = LOD SELECTOR
   Street(Animal)         City(Human)          Planetary(Angel)
        |                     |                       |
      HOT                   WARM                    COLD + meta
   full detail          district aggregate      region abstract + dynasty meta
   per-tile 3-state     district avg state      region avg state -> Earth glow
   per-NPC, combat      faction borders, econ   karma, virtues, quest log
   120 BPM clock        slow coarse tick         big deterministic steps
        |                     |                       |
        +------- same world data, different resolution ------+
                            |
              GHOST LAYER = forward-compute made visible at every tier
                            |
              DETERMINISM (seed + choice log) makes forward-compute exact
                            |
              SAVE stores choices/events, recomputes world on load
                            |
              GENERATIONAL HANDOFF = one big forward-compute across years
```

---

## WHY THIS IS THE RIGHT ARCHITECTURE (research basis)

- **Spatial LOD + streaming + impostors for distant regions** is the universal open-world solution (RDR2, Skyrim, AC Valhalla). Chunk-based loading on a background thread avoids the loading-screen stall.
- **Octree/quadtree chunk aggregation** (aggregate N fine chunks into 1 coarse) is the standard hierarchy for scaling detail with distance; used in voxel and terrain engines.
- **Simulation LOD via world-activation** (full detail near the player, abstract history elsewhere, one continuous sim) is Dwarf Fortress's proven approach to a living world at scale, from its creator directly.
- **Deterministic forward-compute** (seed + inputs reproduce any state) is what makes "don't simulate what nobody watched, compute the result when someone looks" safe, and what makes the save-choices-not-state model and the generational time-skip exact rather than approximate.

None of this is invented for Bohemia. It's the assembled standard practice, chosen to fit the specific shape of this game.

---

## OPEN QUESTIONS [PENDING]

- **WARM promotion triggers:** exactly what promotes a district COLD→WARM? Player proximity is obvious; what about a scripted faction war, a base raid, a quest actor? Needs a clear rule so off-screen events that matter stay warm and get simulated at the right fidelity.
- **Forward-compute cost spikes:** promoting a long-COLD region (untouched for years of game time) means computing forward across a big gap on the spot. Does that cause a hitch? Likely needs the compute chunked across frames, or capped resolution for very long gaps (you don't need year-by-year detail for a region nobody touched for 40 years, just the endpoint).
- **Determinism vs. player surprise:** if everything is deterministic forward-compute, does the world feel too predictable on replay? RF4-style randomness lives in layout/drops (seed), and dynasty choices are the input variance, so two playthroughs diverge from choices even on the same seed. Confirm this gives enough surprise, or whether some bounded controlled randomness (still seed-derived) is wanted in the COLD sim.
- **Ghost layer performance at HOT:** projecting enemy trajectories every combat tick is a forward-compute per enemy per frame. Cheap for 3-6 enemies (the RF4-sized fights), but confirm it holds if a fight ever spikes larger.
- **Godot vs. custom (carried from Engine addendum):** this LOD/streaming architecture is a lot to hand-build in raw web canvas. Godot gives some of it (scene streaming, viewport) but not the bespoke three-state-tile or the simulation-LOD tiers, those are custom regardless. Flag before the world-streaming stage gets heavy: how much of this is custom either way, and does an engine buy enough of the spatial half to be worth the port.

---

*BOHEMIA — World Model, Camera LOD & Simulation Detail — 6.30.26*
*The camera is the LOD dial. The world runs at full detail only where you look, at cheap abstractions everywhere else, and it's one simulation the whole way down. The ghost layer is that simulation seeing forward. Determinism makes it all exact.*
