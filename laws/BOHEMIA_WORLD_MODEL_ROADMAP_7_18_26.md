# BOHEMIA WORLD MODEL — ROADMAP (7/18/26)

A structural step-back (Paolo asked for it). NOT locked canon — this is the
PLAN, the spine to build against. Game-loop specifics are flagged [PENDING Paolo].

## THE READ (grounded in the games closest to our ambition)
- Shadows of Doubt (a fully enterable, simulated procedural city — our closest
  sibling): built as a ZOOM LADDER. Hand-authored floorplan pieces -> buildings
  assembled from them -> interiors procedurally divided into rooms with ZONING
  (street-facing ground = public/retail, back/up = private) -> citizens simulated
  on top with homes, jobs, schedules -> the story maps onto whatever population
  the seed made.
- Caves of Qud / Dwarf Fortress: every NPC fully simulated (skills, faction,
  body), generated history, 70+ factions, economy + production chains. The world
  is ALIVE before the player arrives.
- Against the Storm (the city-builder + roguelite hybrid that works): run-based,
  meta-progression between runs — the roguelite structure exists to kill the
  mid-game stagnation pure city-builders hit.

## THE STRUCTURAL INSIGHT
We built a beautiful STAGE. The thing that turns a map you look at into a place
you live in is ONE canonical WORLD MODEL and three ladders climbing it.

Today the world lives in scattered representations (overmap tiles, block grids,
plot grids, bake PNGs, slice occupancy). They share no spine. The move is a
single addressable hierarchy that everything reads and writes:

  valley -> district -> plot -> building -> floor -> ROOM -> tile
                                                     + agents & systems attached

The bakes render FROM it, combat runs ON it, the city-builder edits it, the sim
breathes through it. All the "environment" work so far is the top rungs of
exactly this model — we are closer than it feels.

## THE THREE LADDERS
1. ZOOM (make it enterable, top to bottom). Have: valley -> district -> plot ->
   building footprint. DONE THIS TURN: the bottom rung — building INTERIORS
   (engine/bohemia_floorplan.js: rooms, walls, a door graph that guarantees
   reachability, a street entrance, zoning). Gate: floorplan_gate. Proof:
   slices/BOHEMIA_FLOORPLAN_PROOF_7_18_26.png. NEXT: wire floorplans onto the
   real plot/building footprints (plot fine-layer) and the seamless zoom
   transition (overmap -> walk a street -> enter a door).
2. LIFE (make it breathe). Agents with homes/jobs/schedules, economy, factions
   living on the model. Seeds already here: the 120 BPM beat, patrol, the power
   grid, occupancy. NEXT: an agent = {home room, work room, schedule} placed by
   the model; the economy + faction ownership layers.
3. LOOP (make it a roguelite). What a run IS, what persists (git already =
   "the world never resets"), what death does. [PENDING Paolo — this is the big
   game-shape call, his to make.]

## THE UNIFIER — BUILT (7/18/26)
engine/bohemia_world.js: world(seed).at(x,y) -> the overmap cell; .plot(x,y) ->
the block grid + building footprints; .plot(x,y).building(i).floorplan() -> that
building's interior rooms. It COMPOSES the existing generators (overmap ->
bridge -> blockgen -> floorplan), lazy + deterministic, so addressing a single
room never generates the whole valley. Gate: world_gate (676 plots resolve, no
throws, every exposed building yields a fully-reachable interior, deterministic).
Proof: slices/BOHEMIA_WORLD_ZOOM_PROOF_7_18_26.png (one image, valley -> district
-> plot -> building -> rooms, all through the one API).

## WHAT COMES AFTER (the ladder from here)
1. FILL THE FOOTPRINTS: today only the built-lot archetypes expose buildings;
   wire suburb houses + commercial storefronts so every plot has interiors, and
   scale footprints to the fine 128 plot resolution.
2. THE SEAMLESS ZOOM — FIRST CUT DONE (7/18/26): slices/BOHEMIA_ENTER_SLICE
   (tools/bohemia_enter_slice.py). Spawn outside a building on a real plot, walk
   to the door, step INSIDE the exact rooms world().plot().building().floorplan()
   returns, walk back out onto the plot. Verified in chromium (enter + exit, 0
   errors). Wired into the alpha SLICE tab (manifest current='enter'). NEXT here:
   overmap-scale walk (streets between plots) + real art instead of semantic
   color, and enter ANY building once footprints are filled.
3. LIFE: an agent = {home room, work room, schedule} placed BY the model, then
   the economy + faction ownership layers, hung on world(seed). The 120 BPM
   beat, patrol, and power grid are the seeds.
4. LOOP: the roguelite run structure. [PENDING Paolo — his call.]

## WHAT STAYS PAOLO'S (untouched by any of this)
The run/death loop shape, faction ownership, what SPAWNS where, and all reserved
lore (the Amalgamation, purple, the three arcs). The model is the mechanism;
the meaning is his.
