# BOHEMIA — HOW THE GREATS BUILT THEIRS + THE BOHEMIA GAME PLAN (7/10/26)

## PART 1 — RESEARCH: how real pixel games handled workflow

### Stardew Valley (closest analog: solo dev, giant scope)
- Eric Barone, alone, ~4.5 years, 10-12 hrs/day: code (C#/XNA + xTile tilemap
  lib), art (Paint.NET), music (Reason), design. No engine like Unity — a thin
  custom stack over a tile library. Same shape as Bohemia's custom JS engine.
- KEY LESSON 1 — SLICES: he built the game area by area, vertical slices,
  each slice playable before moving on. Not system-by-system across the whole
  game.
- KEY LESSON 2 — 16x16 DISCIPLINE: one small fixed tile size kept the art
  volume achievable for one person across a huge game. (Bohemia's 44px cell =
  same principle: one cell contract everywhere.)
- KEY LESSON 3 — THE REDO TRAP: he redrew everything repeatedly for years as
  his skill grew; on his next game he explicitly refuses to loop redos.
  Bohemia translation: verdict once, bank, DON'T revisit banked art unless a
  law changes. (Our GRAVEYARD IS FINAL + verdict banks already encode this.)
- KEY LESSON 4 — intuition + scrap: try, feel, scrap fast. (= Paolo's
  verdict-training loop.)

### Terraria (the procgen monster)
- World generation is ONE pipeline: 103 sequential passes in WorldGen.cs.
  Terrain -> caves (TileRunner random-walk brush) -> cellular-automata
  smoothing -> liquids settling -> biome painting -> ores -> structures ->
  cleanup. Each pass small, testable, ordered.
- Structures use the STAMP pattern: design a prefab by hand, export as tile
  block, generation finds a suitable spot + merges edges.
- Modded worldgen best practice: edit-code-in-game, trigger single passes,
  undo world — FAST ITERATION HARNESS is the real secret.
- BOHEMIA TRANSLATION: Vegas gen = ordered pass pipeline (valley terrain ->
  road grid skeleton -> districts -> lots -> buildings -> collapse damage ->
  loot/props -> factions/spawns), each pass a pure function seed->grid,
  individually triggerable in a test harness. Prefab stamps = our PREFAB
  FACTORY law, already filed.

### Autotiling (the industry's tile-joining answer)
- Standard: blob/bitmask autotiling — 8 neighbors -> 256 masks -> 47 visual
  tiles. Proven but art-hungry: 47 tiles PER terrain type.
- Modern trick: DUAL-GRID / dual-tilemap — logic grid separate from display
  grid; display samples 4 corners; only ~5 art tiles per terrain replace the
  47. Massive art savings, cleaner code, used to cut 47->5.
- Wang tiles: edge-matching theory underneath; also enables aperiodic variety.
- BOHEMIA TRANSLATION: we solved SAME-TILE tiling (seam pipeline). The next
  frontier is BETWEEN-TERRAIN transitions (grass->concrete edge). Dual-grid
  means we need only ~5 transition pieces per terrain PAIR that matters, not
  47 — and our quilt/crop machinery can HARVEST those 5 pieces from pack art.
  Bohemia cell contract stays: logic grid = truth, display grid = dressing.

### Procedural cities (the Vegas problem)
- Canon algorithm family: Parish–Müller (CityEngine) — grow road network with
  global goals + local constraints (intersect->crossing, near->snap), then
  blocks = enclosed areas, then LOT SUBDIVISION (OBB recursive slicing with
  area/aspect/access stop rules), then buildings per lot. Citygen generated
  24,000 buildings in 3.5s on 2007 hardware — city-scale procgen is CHEAP
  when the pipeline is right.
- Districts: flood-fill / Voronoi zoning (industrial, residential, commercial,
  parks) before lots.
- DIRECTLY BOHEMIA-RELEVANT FIND: published method for FAVELA/informal-
  settlement generation (A* zigzag roads on rough terrain, quadtree lots,
  alley systems, dead ends). Post-collapse Vegas rebuilding = formal grid
  (old Vegas, real streets) + informal settlement growth (new communities) —
  BOTH have literature. Vegas's real arterial grid also matches our
  REFERENCE-GRID law: real streets are the primary road network, procgen
  fills blocks.

## PART 2 — THE BOHEMIA GAME PLAN (graphics -> playable world)

PHASE A — RENDER CONTRACT (the bridge everything crosses)
1. One renderer consumes: ground layer (seamless sets) -> overlay layer ->
   prop/standing layer (multicell, DEPTH LAW) -> entities -> fx -> lighting.
2. Dual-grid transitions: harvest ~5 edge pieces per terrain pair that the
   demo needs (concrete<->wash, wash<->water first). Small, testable.
3. Door junction render per Paolo's pick; WALL-MOUNTED compositing.
GATE: one screen of the demo tunnel renders from banked data alone.

PHASE B — WORLDGEN PIPELINE SKELETON (Terraria discipline)
4. Pass harness: seed -> pass list -> grid; run/undo single passes in a test
   page. Passes v1: valley terrain -> real-Vegas arterial grid (reference-grid
   law) -> district zoning -> block/lot subdivision (OBB rules) -> building
   stamping (prefab factory) -> collapse pass (damage/rubble/overlays) ->
   prop dressing (demo prop pool rules) -> spawn tables.
5. Informal-settlement pass (favela method) for post-collapse communities;
   tunnel network pass for the underworld (canon).
GATE: seed generates a walkable district; Paolo judges GENERATOR OUTPUT
GALLERIES (same verdict-training loop, aimed at layouts — his map authority
preserved: he tunes rules, never Claude hand-placing).

PHASE C — SLICE, NOT SYSTEMS (Stardew discipline)
6. Build THE DEMO SLICE end-to-end on A+B: tunnel walk (1-3 min), dark,
   pickups, one encounter with cover, hatch reveal. Every system only as deep
   as the slice needs.
7. Then widen slice by slice (surface district, first settlement, act
   structure), never all-systems-at-once.

PHASE D — FACTORY FOREVER (our own law, validated by their history)
8. Art keeps flowing through the trained pipeline per new need; verdicts keep
   training; banks keep growing. Barone's redo-trap avoided: banked ships.

## PART 3 — HONEST PERCENTAGES (whole game = 100%)

- ART LIBRARY (assets processed, sorted, seam-ready, verdict-trained): ~70%
  of the library work is done. Remaining: transitions harvest, purpose art
  gaps (tunnel-specific, Vegas-modern bridges if ever, E/W variants), rig
  skins volume.
- RENDER INTEGRATION (banked art actually drawing in the engine as layers):
  ~25%. Tile block + bake exist; layered contract (overlays, multicell
  depth, junctions, lighting) not wired.
- MAPS (actual playable spaces): ~5%. Schema + prop pool exist; no map
  content (yours by law).
- PROCGEN (the city generator): ~12%. Strong design canon (citybuilder,
  prefab factory, reference-grid, valley scale laws) + overmap skeleton;
  pipeline passes not built. Research now closes the how.
- COMBAT: ~60%. Dial system, 52 patterns, packages, cover art + rules;
  needs junction with world + group fights.
- CHARACTERS/ANIMATION: ~40%. Rig, regions, 8-dir export, skins/rags
  approved; volume production + in-world animation integration remain.
- MUSIC: ~55%. Repo, laws, verdicts; volume-balance pass + coverage gaps.
- QUESTS/NARRATIVE: writing ~50% (53 questbook-grade docs incl. 3 finales);
  implementation ~2%.
- CITY-BUILDER SIM (economy/survival/logistics): design ~55% (deep addenda),
  implementation ~15% (engine modules + tests).
- UI/UX: ~15%. Menus/roadmap docs; little built.
- PERSISTENCE/META (dynasties, succession, saves): design ~60%,
  implementation ~30% (persistence v1, fold determinism).

WEIGHTED OVERALL: design+assets era ~45% done; IMPLEMENTATION era ~20% done.
Blended honest number for "the whole enchilada": **~25%** — with the single
biggest unlock being Phase A (render contract), because it converts the
week's asset mountain into visible game.
