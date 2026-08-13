/* ============================================================================
   BOHEMIA — MASTER LOOP SCAFFOLD  (bohemia_loop.js)
   7.1.26 — LIGHT INFRASTRUCTURE. The spine that turns nine islands into one
   engine. This is the carbon-nanotube frame: almost no weight, but every seam
   is in its exact final position so nothing can drift or collide when we pour
   the real logic in later. NOTHING here guesses a shape — every wiring point
   maps to a real exported handle (verified) or is marked [SEAM]/[GAP] per the
   Master Systems Map so we always know where everything goes.

   WHAT IS REAL RIGHT NOW (the only concrete poured):
     - ONE clock. Core.Clock is the sole time source. Heartbeat reads from it via
       fromCoreClock. There is never a second clock. This kills the drift bug the
       heartbeat island was built to prevent, on day one.
     - The boot ORDER (create → load → generate → seed → spawn → ready).
     - The per-frame TICK order (advance clock → beat logic → frame render).
   Everything else is a labelled empty socket. Filling a socket = one small,
   testable step, with its neighbours already locked in place.

   HEADLESS. No DOM, no render. Runs in node like every other green module. The
   render seam is marked; the browser shell calls loop.tick(performance.now()).
   Same UMD pattern as the rest of the engine. No build step.

   Build-order note (Master Systems Map step 1): this file is step 1. It does not
   wire the content islands' INTERNAL gaps (faction bases into worldgen slots,
   economy sources into map, entity regions from map) — those are steps 2-3 and
   are marked [GAP per map] at their sockets so they're impossible to forget.
   ========================================================================== */

(function (root, factory) {
  const E = (typeof require !== 'undefined')
    ? require('./bohemia_engine.js')
    : (root.BohemiaEngine);
  const Sched = (typeof require !== 'undefined')
    ? require('./bohemia_scheduler.js')
    : (root.BohemiaScheduler);
  const World = (typeof require !== 'undefined')
    ? require('./bohemia_world.js')
    : (root.BohemiaWorld);
  const BQ = (typeof require !== 'undefined')
    ? require('./bohemia_bq.js')
    : (root.BQ);
  const BQRT = (typeof require !== 'undefined')
    ? require('./bohemia_quest_runtime.js')
    : (root.BQRuntime);
  // the real canon faction graph (GDD v2 §9, all Paolo's, nothing invented) —
  // DEFAULT_GRAPH so every boot() gets real factions unless a caller explicitly
  // overrides (tests inject a smaller graph). Browser carriers inline it as
  // root.BOHEMIA_FACTION_GRAPH (same pattern as every other engine global).
  const DEFAULT_GRAPH = (typeof require !== 'undefined')
    ? require('./BOHEMIA_faction_graph.json')
    : (root.BOHEMIA_FACTION_GRAPH);
  const mod = factory(E, Sched, World, BQ, BQRT, DEFAULT_GRAPH);
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  if (typeof root !== 'undefined') root.BohemiaLoop = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (E, Sched, World, BQ, BQRT, DEFAULT_GRAPH) {
  'use strict';

  const Core = E.Core;

  /* --------------------------------------------------------------------------
     GameContext — the single object that holds the whole live engine. Every
     island hangs off this at its correct slot. Systems that don't exist yet or
     aren't wired yet are `null` with a comment naming their status. This object
     IS the map made real: if you want to know where something plugs in, it's a
     field here.
     ------------------------------------------------------------------------ */
  function makeContext() {
    return {
      // --- LAYER 1: FOUNDATION [SOLID] ---
      rng: null,          // Core.RNG — seeded, branchable. Built at boot.
      clock: null,        // Core.Clock — THE sole time source. Built at boot.
      world: null,        // Core.World — tiles/LOD. Built at boot from rng.branch('world').

      // --- LAYER 2: PERSISTENCE [SOLID] ---
      save: null,         // the loaded (migrated, validated) save, or a fresh newSave.
      deltas: null,       // Entities.DeltaStore — permanent world changes (corpses/clears/builds). [WIRED at boot]

      // --- LAYER 3: SIMULATION ---
      heartbeat: null,    // Heartbeat.heartbeat — reads the ONE clock via fromCoreClock. [WIRED at boot]
      scheduler: null,    // Scheduler — the "I move, you move" grid clock. [WIRED at boot]

      // --- LAYER 4: CONTENT SYSTEMS [ISLAND — sockets ready, internal gaps marked] ---
      worldMap: null,     // buildRealWorldMap(seed) — the REAL canon valley (bohemia_world.js), same one live in CITY/MAP tabs. [WIRED at boot]
      factions: null,     // Factions.FactionWorld, canon-loaded from BOHEMIA_faction_graph.json. [WIRED at boot]
      factionBases: null, // factionId -> {x,y} real worldMap district coord. [WIRED at boot]
      factionConstraints: null, // FactionCanon.loadFactionCanon() result; enforced on every shiftStanding. [WIRED at boot]
      factionAdjacency: null, // districtId -> [neighbor districtIds], real 4-way grid adjacency. Feed to factions.advanceRound()/claimableTargets() for the territory AI to actually run against real geography. [WIRED at boot]
      economy: null,      // Economy.Economy, one empty DistrictEconomy per worldMap district. [WIRED at boot; faucets/sinks are content, not poured here]
      spawner: null,      // Entities.Spawner, shared instance keyed on save.seed + ctx.deltas. [WIRED at boot]

      // --- LAYER 4b: DYNASTY (the fold, already save-bridged) [ISLAND] ---
      folds: null,        // Generations.foldFromSave(save) result. Recomputed on load & at each handoff.

      // --- LAYER 4c: QUESTS (the .bq runtime, pullable from anywhere) [WIRED at boot] ---
      quests: null,       // QuestManager: parse/start/get a .bq quest via BQ + BQRuntime.
                          // Any part of the game pulls a quest off ctx.quests at any time.

      // --- LAYER 5: PRESENTATION ---
      skinner: null,      // Skinner — pure fn, fed heartbeat.beatsFloat() each frame. [SEAM: render step]
      // tile/prop/clothing render — [GAP per map], not on the frame yet.
      // camera / killshot camera — [GAP per map].

      // --- lifecycle flags ---
      booted: false,
      ready: false,
    };
  }

  /* --------------------------------------------------------------------------
     BOOT — the one correct order. Each step is a named function so it's
     individually testable and so a half-built step can't hide inside a big one.
     Steps that aren't ready yet are present but skip cleanly (return the ctx
     unchanged) with a [SEAM]/[GAP] note. The ORDER is the load-bearing part and
     it is final: nothing below can be safely reordered.
     ------------------------------------------------------------------------ */

  // 1. Foundation: the RNG and the ONE clock. Real, poured now.
  function bootFoundation(ctx, seedText) {
    ctx.rng = new Core.RNG(seedText);
    ctx.clock = new Core.Clock(function onBeat(/* beatIndex */) {
      // whole-beat SIM logic lands here later (advance turn, step economy, etc).
      // [SEAM] left empty on purpose — the beat spine exists, the beat WORK does not.
    });
    ctx.world = new Core.World(ctx.rng.branch('world'));
    return ctx;
  }

  // 2. Persistence: load a save or start fresh. Real, poured now (save is [SOLID]).
  function bootSave(ctx, saveTextOrNull, seedText) {
    if (saveTextOrNull) {
      ctx.save = E.Save.deserialize(saveTextOrNull);   // migrates + validates
    } else {
      ctx.save = E.Save.newSave(seedText);
    }
    return ctx;
  }

  // 3. Simulation spine: build the heartbeat FROM the core clock. THE anti-drift
  //    wiring. Real, poured now — this is the whole reason the scaffold exists.
  function bootHeartbeat(ctx) {
    const hb = E.Heartbeat.heartbeat;      // the shared single instance
    if (typeof hb.fromCoreClock === 'function') hb.fromCoreClock(ctx.clock);
    ctx.heartbeat = hb;
    return ctx;
  }

  // Real-world terrain block: only genuinely solid overmap cells (mountain,
  // water) stop a body; every buildable/street/desert cell is walkable at this
  // coarse overworld scale (building/interior collision is a [SEAM] for later,
  // same as the old stub — this only replaces the terrain floor with real
  // geography instead of a synthetic border band).
  const TERRAIN_BLOCK = { mountain: 1, water: 1 };
  function passableFromRealWorld(worldMap) {
    const w = worldMap.real, size = worldMap.size;
    return function passable(x, y) {
      if (x < 0 || y < 0 || x >= size || y >= size) return false;   // off-map
      const c = w.at(x, y);
      if (!c) return false;
      return !TERRAIN_BLOCK[c.district];
    };
  }

  // 3b. The world-turn / grid clock: the "I move, you move" scheduler. Real,
  //     poured now — it's tested [SOLID]. Player is actor #0; the world advances
  //     grid position only on commitPlayerAction. Animation stays on the heartbeat.
  function bootScheduler(ctx) {
    // passable now reads the REAL map geography (mountain/water, map bounds) if
    // a world was generated. Actors can no longer phase through the world. Falls
    // back to always-passable only if worldgen hasn't run (headless bare tests).
    const passable = ctx.worldMap
      ? passableFromRealWorld(ctx.worldMap)
      : function () { return true; };

    // Deltas are the only thing that persists (they live in the save). Rehydrate
    // from the save if present so a reloaded dynasty keeps its corpses/clears.
    ctx.deltas = new E.Entities.DeltaStore(ctx.save && ctx.save.deltas ? ctx.save.deltas : null);

    // Death sink: when an actor settles dead, write a permanent 'cleared' delta at
    // its tile on its layer. Same mechanism the world uses for a cleared camp — a
    // corpse is just a tile whose spawn is overridden to null forever. Survives
    // save/reload because it's in save.deltas. The clock beat is stamped for lore.
    const onDeath = function (actor) {
      const layer = actor.layer || 'enemy';
      const beat = ctx.clock ? ctx.clock.snapshot().beat : 0;
      ctx.deltas.set(layer, actor.tile.x, actor.tile.y, { kind: 'cleared', beat: beat, was: actor.id });
      if (ctx.save) ctx.save.deltas = ctx.deltas.toJSON();
    };

    ctx.scheduler = Sched.makeScheduler({ passable: passable, onDeath: onDeath });
    // resume the world-turn (sun/day phase) from the save if present.
    if (ctx.save && typeof ctx.save.turn === 'number') {
      Sched.restoreTurn(ctx.scheduler, ctx.save.turn);
    }
    return ctx;
  }

  // Build ctx.worldMap from the REAL, live canon world model (bohemia_world.js
  // — the same 33-district-type, real-street, real-connectivity valley that's
  // already live in the CITY/MAP tabs), not the old abstract point-scatter
  // WorldGen this scaffold used to boot from. `districts` is every overmap
  // cell whose type is a real auto-factory district (World.isAutoDistrict),
  // catalogued from the CHEAP per-cell type read (w.at) — never calling
  // w.plot() here, so this stays lazy: no district's actual block/building
  // content generates until something (a HOT-tier spawn, a render) asks for
  // it by coordinate. `real` carries the live World handle for anything that
  // needs the full addressable API (w.plot(x,y), landlockConnect, etc).
  function buildRealWorldMap(seedText) {
    const seedNum = E.WorldGen.hashSeed(seedText);
    const w = World.world(seedNum);
    const districts = [];
    const landmarks = scanRealLandmarks(w);
    for (let y = 0; y < w.n; y++) {
      for (let x = 0; x < w.n; x++) {
        const c = w.at(x, y);
        if (!c || !World.isAutoDistrict(c.district)) continue;
        districts.push({ id: x + ',' + y, pos: [x, y], kind: c.district, zone: World.districtZone(c.district) });
      }
    }
    const solarD = districts.find(function (d) { return d.kind === 'solar'; });
    return { seed: seedText, size: w.n, real: w, districts: districts,
             mountainBorders: landmarks.mountainBorders, strip: landmarks.strip, dam: landmarks.dam,
             solar: solarD ? { at: solarD.pos } : null };
  }

  /* Real landmarks the MAP UI wants (mountain valley walls, the Strip corridor,
     the dam), plumbed straight from cells the overmap ALREADY generated — none
     of MOUNTAIN/STRIP/DAM carry a DISTGEN entry (they are terrain/road-network
     cells, not buildable auto-districts), so districtsOfType can't see them and
     this reads w.at() directly instead. MAP LAW: plumbing only, nothing here
     invents a layout — mountainBorders is just which grid edges the generator
     already lined with mountain cells, strip/dam are just where the generator
     already put those cells. A seed with no strip cells still returns a valid
     (degenerate, center-point) strip so a consumer's .from/.to never crashes. */
  function scanRealLandmarks(w) {
    const N = w.n;
    const BAND = Math.max(2, Math.floor(N * 0.06));
    const edge = { N: false, S: false, E: false, W: false };
    const stripCells = [];
    let damAt = null;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const c = w.at(x, y);
        if (!c) continue;
        if (c.district === 'mountain') {
          if (x < BAND) edge.W = true;
          if (x >= N - BAND) edge.E = true;
          if (y < BAND) edge.N = true;
          if (y >= N - BAND) edge.S = true;
        } else if (c.district === 'strip') {
          stripCells.push([x, y]);
        } else if (c.district === 'dam' && !damAt) {
          damAt = [x, y];
        }
      }
    }
    const mountainBorders = ['N', 'S', 'E', 'W'].filter(function (k) { return edge[k]; });
    let strip;
    if (stripCells.length) {
      // endpoints = the two strip cells farthest apart (a real corridor runs roughly straight)
      let a = stripCells[0], b = stripCells[0], best = -1;
      stripCells.forEach(function (p) {
        const d = (p[0] - a[0]) * (p[0] - a[0]) + (p[1] - a[1]) * (p[1] - a[1]);
        if (d > best) { best = d; b = p; }
      });
      best = -1;
      stripCells.forEach(function (p) {
        const d = (p[0] - b[0]) * (p[0] - b[0]) + (p[1] - b[1]) * (p[1] - b[1]);
        if (d > best) { best = d; a = p; }
      });
      strip = { from: a, to: b };
    } else {
      const mid = [Math.floor(N / 2), Math.floor(N / 2)];
      strip = { from: mid, to: mid };
    }
    return { mountainBorders: mountainBorders, strip: strip, dam: damAt ? { at: damAt } : null };
  }

  // Real 4-way grid adjacency between district cells — the injected
  // `adjacency(districtId)` the Factions territory AI (claimableTargets/
  // factionTurn/advanceRound) has always required but nothing ever supplied,
  // since the old abstract WorldGen had no grid to be adjacent ON (districts
  // were free-floating points). Built once per worldMap, O(districts): a
  // Set for O(1) membership, then each district's 4 grid neighbors filtered
  // to ones that are ALSO real districts (a street/desert/terrain cell
  // between two districts is not a claimable link — same spirit as
  // rawStreetEdges only counting REAL edges, no default ever assumed).
  //
  // PACING (Paolo 7/24, IMPORTANT, read before ever calling advanceRound()
  // from a live loop): factions are NOT at war with everyone 24/7, and they
  // do not sit there migrating/conquering in real time. This mechanism must
  // stay RARE and QUEST-GATED — a faction's turn fires when the narrative
  // calls for it (a quest resolves, a story beat lands), never on a tick,
  // a heartbeat, or any kind of background clock. Building the AI cheap
  // (the Konkr.io/AI War 2 pattern in bohemia_factions.js's own docstring)
  // was about being AFFORDABLE if/when it runs, not a green light to run it
  // constantly. Whoever wires this to anything live: default OFF, fire it
  // only from a quest/story trigger.
  function buildRealAdjacency(worldMap) {
    const byId = new Map();
    const districts = worldMap.districts;
    for (const d of districts) byId.set(d.id, d);
    const adjacency = new Map();
    const DIRS = [[0, -1], [0, 1], [1, 0], [-1, 0]];
    for (const d of districts) {
      const neighbors = [];
      for (const dir of DIRS) {
        const nid = (d.pos[0] + dir[0]) + ',' + (d.pos[1] + dir[1]);
        if (byId.has(nid)) neighbors.push(nid);
      }
      adjacency.set(d.id, neighbors);
    }
    return adjacency;
  }

  // 4. World generation. POURED: builds from the real canon world (above),
  //    keyed on the save's seed text (hashed the same way WorldGen.generateWorld
  //    always did, so a given seed string still yields one deterministic valley).
  function bootWorldGen(ctx) {
    ctx.worldMap = buildRealWorldMap(ctx.save.seed);
    return ctx;
  }

  // 5. Factions + canon. POURED: the graph is Paolo's own GDD v2 §9 data
  //    (BOHEMIA_faction_graph.json), FactionCanon.loadFactionCanon() invents
  //    nothing — it mechanically encodes relationships he already wrote into
  //    initial standings + permanent constraints. shiftStanding is wrapped so
  //    every write is clamped through those constraints (never a raw call).
  //    Base placement: the 14 selectable faction ids (sorted) are zipped 1:1
  //    onto an EVENLY-STRIDED sample of the real district list (index i ->
  //    districts[floor(i * len/14)]) — pure mechanical spread across whatever
  //    the real overmap generated, not a lore/layout decision (MAP LAW is
  //    about Paolo placing canon on the live overmap; this only picks WHICH
  //    already-generated real districts a faction starts holding, same as
  //    the old abstract scaffold's dormant slot system did with fake points).
  //    A faction's founding territory IS its base district — no separate
  //    nearest-neighbor search needed now that bases are real districts.
  function bootFactions(ctx, opts) {
    ctx.factions = new E.Factions.FactionWorld(ctx.rng.branch('factions'));
    // real canon by default (DEFAULT_GRAPH, GDD v2 §9) — an explicit
    // opts.factionGraph still overrides (tests inject their own smaller graph);
    // opts.factionGraph === false is the one deliberate way to stay empty.
    const graph = (opts && 'factionGraph' in opts) ? opts.factionGraph : DEFAULT_GRAPH;
    if (!graph) return ctx;   // explicitly opted out, or no default graph could be loaded — stays empty

    ctx.factionConstraints = E.FactionCanon.loadFactionCanon(ctx.factions, graph, (ctx.save && ctx.save.act) || 1);

    // wrap shiftStanding so every write is canon-clamped — the invariant the
    // SEAM comment named ("enforceConstraints into shiftStanding").
    const world = ctx.factions;
    const rawShift = world.shiftStanding.bind(world);
    const constraints = ctx.factionConstraints;
    world.shiftStanding = function (aId, bId, delta, symmetric) {
      const before = world.standingWithSafe(aId, bId);
      rawShift(aId, bId, delta, symmetric);
      const a = world.factions.get(aId);
      if (a) a.standing[bId] = E.FactionCanon.enforceConstraints(constraints, aId, bId, a.standingWith(bId));
      if (symmetric) {
        const b = world.factions.get(bId);
        if (b) b.standing[aId] = E.FactionCanon.enforceConstraints(constraints, bId, aId, b.standingWith(aId));
      }
    };
    world.standingWithSafe = function (aId, bId) {
      const a = world.factions.get(aId);
      return a ? a.standingWith(bId) : 0;
    };
    world._canonWired = true;

    // base placement: zip sorted faction ids to an evenly-strided sample of
    // the real district list.
    ctx.factionBases = {};
    if (ctx.worldMap && ctx.worldMap.districts && ctx.worldMap.districts.length) {
      const ids = [...ctx.factions.factions.keys()].sort();
      const districts = ctx.worldMap.districts;
      ids.forEach(function (fid, i) {
        const d = districts[Math.floor(i * districts.length / ids.length)];
        ctx.factionBases[fid] = { x: d.pos[0], y: d.pos[1] };
        const f = ctx.factions.factions.get(fid);
        f.territory.add(d.id);
        ctx.factions.owner.set(d.id, fid);
      });
    }

    // real adjacency for the territory AI (claimableTargets/factionTurn/
    // advanceRound) to actually expand against — the mechanism existed, real
    // geography to run it on did not, until the real worldMap did.
    ctx.factionAdjacency = ctx.worldMap ? buildRealAdjacency(ctx.worldMap) : new Map();
    return ctx;
  }

  // 6. Economy. POURED: one empty DistrictEconomy per real worldMap district —
  //    the tank/faucet/sink MACHINERY, zero currency numbers invented. Real
  //    faucet/sink rates are content (what produces how much where) and stay
  //    unpoured until the world is built out enough to tune against (Paolo's
  //    7/19 ruling — economy cannot be tuned against a world that doesn't exist).
  function bootEconomy(ctx) {
    ctx.economy = new E.Economy.Economy();
    if (ctx.worldMap && ctx.worldMap.districts) {
      for (const d of ctx.worldMap.districts) ctx.economy.addDistrict(d.id);
    }
    return ctx;
  }

  // 7. Entities. POURED: a shared Spawner keyed on the save's seed + the boot's
  //    DeltaStore, matching the exact pairing spawnActorsForDistrict already
  //    builds ad hoc — now available at ctx.spawner for any caller instead of
  //    each call site constructing its own (deterministic either way, since
  //    both key off the same seed + deltas).
  function bootEntities(ctx) {
    ctx.spawner = new E.Entities.Spawner(ctx.save.seed, ctx.deltas);
    return ctx;
  }

  // 8. Dynasty fold. Already save-bridged and [SOLID]-tested — safe to pour now.
  function bootDynasty(ctx) {
    ctx.folds = E.Generations.foldFromSave(ctx.save);
    return ctx;
  }

  // 9. Presentation binding. [SEAM] skinner is a pure fn fed per-frame; nothing
  //    to build at boot, the socket is on the frame tick instead.
  function bootPresentation(ctx) {
    ctx.skinner = E.Skinner;   // module handle available; not yet driven.
    return ctx;
  }

  /* QUEST MANAGER — the .bq system as a first-class engine citizen. Holds live
     quest runtimes so ANY part of the game can pull a quest off ctx.quests at any
     time (the pull-from-anywhere law). Wraps BQ (parse) + BQRuntime (play).
     Serializable so in-flight quests ride the save. Content-agnostic: it plays
     whatever .bq text it is handed and authors nothing.

     THE FEED PIPE (Paolo 7/20: TOTAL RECALL — everything is remembered on the
     feed, no exceptions): if constructed with a `record` sink, the manager fires
     that sink for every quest CHOICE and every COMPLETE/FAIL OUTCOME played through
     a runtime it owns, so quest outcomes reach the engine's choice-log and feed the
     fold + the world instead of dying inside the runtime. EVERYTHING is recorded,
     period. There is no secret / off-feed channel (the old recorded:false split was
     retired 7/20 — see the SOCIAL FEED addendum). Non-invasive: it wraps the
     runtime's own choose()/setStage() so the runtime code is untouched. */
  function makeQuestManager(opts) {
    opts = opts || {};
    const active = {};   // questId -> { text, rt }
    /* THE CROSS-QUEST LEDGER (Paolo 8/7, ruling A: "a bond built in one quest opens a
       door in another. Continuity is the dynasty."). ONE object, handed to every
       runtime this manager makes, so a bond earned in S06 is already there when S09
       asks. Keyed by WHO the person is (the role's own REQ conditions), never by the
       quest's label for them -- the corpus has two different `runner`s and one
       `neighbor` written identically twice, and the author's conditions are what tell
       them apart. SHIPS EMPTY: it holds only what his quests actually award. */
    const shared = { bonds: {} };
    const placed = {};   // questId -> { x, y, layer, speaker }  (world binding: see placeQuest)
    const sink = typeof opts.record === 'function' ? opts.record : null;
    const factions = opts.factions || null;                 // ctx.factions — real FactionWorld, or null (bare/legacy boot)
    const save = opts.save || null;                          // ctx.save — for meta.gave, or null on a bare boot
    const factionAdjacency = opts.factionAdjacency || null;  // ctx.factionAdjacency — real 4-way grid, or null
    const worldMap = opts.worldMap || null;                  // ctx.worldMap — the real valley, or null

    /* THE WORLD BRIDGE (7/25, closes the loop the pacing law described but
       nothing ever fired): a quest's own accumulated @DO effects, applied to
       the REAL factions the moment it resolves — not just recorded in the
       quest's own scratch state (rt.state.faction/advanceTerritory), which is
       all that ever happened before this. Two effects, two very different bars:
         - STANDING always applies when factions are real: the quest author
           already wrote the exact delta (@DO faction TRADES +8) — applying it
           invents nothing, it is the content decision already made.
         - TERRITORY only ever moves opt-in, per the PACING LAW (Paolo 7/24:
           factions are not at war 24/7, advanceRound fires only when "the
           narrative calls for it"): a quest must explicitly mark itself with
           @DO advance_territory. An everyday errand's faction bump NEVER
           shakes the map on its own, no matter the delta size. */
    // quests write faction ids ALL-CAPS (@DO faction TRADES +8); the canon
    // graph's own ids are Title Case ('Trades') — two vocabularies authored
    // independently that mean the same 18 factions. Case-fold once, not per-quest.
    function resolveFactionId(fid) {
      if (!factions) return null;
      if (factions.factions.get(fid)) return fid;
      const upper = String(fid).toUpperCase();
      for (const real of factions.factions.keys()) if (real.toUpperCase() === upper) return real;
      return null;
    }
    /* ---- POSTURE: THE THIRD EFFECT, AUTHORED SINCE 7/25 AND READ BY NOTHING ----
       (8/7, FACTIONS lane.) The quest runtime has always parsed `@DO faction_posture
       CARTEL +1` into rt.state.posture — 17 of them across the canon corpus — and
       this bridge carried the OTHER TWO effects to the real world and dropped that
       one on the floor. Same disease as the clout tags: authored content nothing
       reads.

       POSTURE IS NOT STANDING, and the corpus says so itself rather than me deciding
       it. S17 stage 33 writes BOTH on the same faction in the same breath:
           @DO faction CARAVANS -15        <- what they think of YOU
           @DO faction_posture CARAVANS +1 <- something else entirely
       If posture meant "toward the player" that line would be a duplicate. It is not.
       Read against the quest that carries it ("a public humiliation of one is a real
       faction event"), posture is HOW MOBILISED THAT FACTION BECOMES — agitated,
       hardened, moving. Every authored value is +1 or +2: nobody ever writes a
       faction calmer, only stirred up.

       WHAT MOBILISATION MEANS IN THE MODEL WE ALREADY HAVE: Faction.quota is
       literally "districts it WANTS to hold", and it is already the appetite term
       scoreClaim() reads. A stirred-up faction wants more ground. So posture moves
       the knob that already exists rather than adding a parallel one — no new field,
       no new system, no new module. The territory AI is unchanged.

       GROUNDED, and this is the escalation literature rather than a game feel: the
       spiral model holds that groups escalate in response to PERCEIVED hostility,
       and the reciprocal-escalation evidence is that hostility from one side reliably
       raises the other's. Which is why this belongs on the same clock as the rest of
       the quest bridge and not on a timer: a faction hardens because something
       HAPPENED, and the quest author already said what and how much.

       IT STILL CANNOT SHAKE THE MAP BY ITSELF. The PACING LAW (Paolo 7/24: factions
       are not at war 24/7) is untouched — appetite is not a turn. advanceRound still
       fires only on an explicit @DO advance_territory, so a quest that stirs somebody
       up changes what they'd reach for NEXT TIME the narrative calls a round, never
       this instant. */
    function applyWorldEffects(rt) {
      if (!factions) return;
      const s = rt.state;
      Object.keys(s.faction || {}).forEach(function (fid) {
        const delta = s.faction[fid];
        const real = resolveFactionId(fid);
        if (!delta || !real) return;
        factions.shiftStanding(real, 'player', delta, false);
        /* HOW MANY TIMES YOU DID SOMETHING THEY WANTED (8/12). Standing is what
           they THINK of you; this is a plain count of the times you actually did
           the thing, and the two are not the same question -- you can be well
           liked by an outfit you have never once turned up for.
           engine/bohemia_belonging.js walks Lave & Wenger's periphery-to-inside
           gradient off this number, and it has to be a COUNT or the gradient is
           just standing wearing a hat. Only POSITIVE deltas count: doing them
           harm is not a step toward belonging, it is a different axis entirely,
           and it already has one (standing). Rides meta, which is where abstract
           dynasty-scale state already lives, so no save migration is needed. */
        if (delta > 0 && save && save.meta) {
          const g = save.meta.gave || (save.meta.gave = {});
          g[real] = (g[real] | 0) + 1;
        }
      });
      Object.keys(s.posture || {}).forEach(function (fid) {
        const delta = s.posture[fid];
        const real = resolveFactionId(fid);
        if (!delta || !real) return;
        const f = factions.factions.get(real);
        if (f) f.quota = Math.max(0, f.quota + delta);
      });
      // advanceRound wants adjacency as a FUNCTION (id -> [neighborIds]); the
      // stored ctx.factionAdjacency is the Map that function reads (same
      // adapter shape gates/bohemia_loop_gate.js's own proof uses).
      if (s.advanceTerritory && factionAdjacency) {
        factions.advanceRound(function (id) { return factionAdjacency.get(id) || []; });
      }
    }

    /* ------------------------------------------------------------------------
       THE CASTING BRIDGE (7/25) — a quest PLACES ITSELF into the real valley by
       reading its OWN declared requirements. Nothing here invents geography or
       content: a .bq file already says who it needs
         @ROLE lineman REQ faction=TRADES block=browned
       and factions now really hold real districts, so "where does this quest
       happen" has an answer the quest itself already gave. Before this, the
       only way a quest reached the world was a hand-typed literal {x:40,y:40}
       (which is what the live phone's three throwaway demo quests still used) —
       so the nine gate-proven canon quests could not be placed at all without
       someone inventing coordinates for each, i.e. designing map content.

       MAP LAW HELD: Claude never designs map layouts. This picks WHICH already-
       generated, already-faction-owned district a quest binds to, from the
       quest's own text — the same class of mechanical placement bootFactions
       already does when it zips faction bases onto real districts.

       DETERMINISTIC: same seed + same quest id -> same tile, forever (stable
       hash into a SORTED candidate list, no live RNG), so a quest does not
       wander between reloads and a save's placements stay true.
       ---------------------------------------------------------------------- */

    // the faction a role demands, straight out of its own condition string
    // ('faction=TRADES  block=browned' -> 'TRADES'). 'faction_any' is a real
    // authored value meaning "anyone", and is deliberately NOT a faction name.
    function roleFaction(role) {
      const m = /(?:^|\s)faction=([A-Za-z_]+)/.exec((role && role.cond) || '');
      return m ? m[1] : null;
    }

    /* CHANNEL (Paolo 7/20): 'inperson' — you cannot get it over the phone, you
       must pull up on them — is "reserved for the phoneless, e.g. homeless
       faction" (CLAUDE.md, his own cited example). That one ruling is applied
       here and nothing else is guessed: every other faction defaults to 'feed'.
       WHICH other npcs are phoneless stays Paolo's content call. */
    const PHONELESS = { HOMELESS: true };

    function castTarget(Q) {
      if (!worldMap || !worldMap.districts || !worldMap.districts.length) return null;
      const roles = Q.roles || [];
      // the REQ roles carry the quest's real demands; OPT roles are garnish.
      const req = roles.filter(function (r) { return r.req; });
      const withFaction = req.concat(roles).filter(function (r) {
        const f = roleFaction(r);
        return f && f.toUpperCase() !== 'ANY';
      });
      const speakerRole = withFaction[0] || req[0] || roles[0] || null;
      const wanted = speakerRole ? roleFaction(speakerRole) : null;

      let candidates = null, factionId = null;
      if (wanted && factions) {
        factionId = resolveFactionId(wanted);
        const f = factionId ? factions.factions.get(factionId) : null;
        if (f && f.territory && f.territory.size) candidates = Array.from(f.territory).sort();
      }
      // no faction demand (or that faction holds nothing yet): any real district,
      // still deterministic. The quest happens SOMEWHERE real rather than nowhere.
      if (!candidates) candidates = worldMap.districts.map(function (d) { return d.id; }).sort();
      if (!candidates.length) return null;

      const pick = candidates[hashStr(Q.id || '') % candidates.length];
      const parts = String(pick).split(',');
      const channel = (wanted && PHONELESS[String(wanted).toUpperCase()]) ? 'inperson' : 'feed';
      return { x: parseInt(parts[0], 10), y: parseInt(parts[1], 10),
               speaker: speakerRole ? speakerRole.name : null,
               channel: channel, faction: factionId || null };
    }

    /* Start a quest AND bind it to the real valley in one call — the canon path
       for shipping real quests into a playable surface. Returns place()'s record
       (with .at.faction added) so a caller can show who owns the ground. */
    function cast(text) {
      if (!BQ) return null;
      const Q = BQ.parse(text);
      const at = castTarget(Q);
      const rec = place(text, at || {});
      if (rec && at) rec.at.faction = at.faction;
      return rec;
    }

    // Wrap a runtime so its plays fan out to the ledger sink and the world
    // bridge. Idempotent per rt.
    function _wire(id, rt) {
      if (!rt || rt.__wired) return rt;
      rt.__wired = true;
      // fire OUTCOME effects exactly once, whenever any interaction flips done true.
      let fired = rt.state && rt.state.done;   // a restored-already-done quest never re-fires
      function checkOutcome() {
        if (!fired && rt.state && rt.state.done) {
          fired = true;
          // TOTAL RECALL: every outcome hits the feed. No silence/off-feed exception.
          if (sink) sink({ questId: id, kind: 'outcome', outcome: rt.state.outcome,
                 tags: (rt.state.doneTags || []).slice() });
          applyWorldEffects(rt);
        }
      }
      const origChoose = rt.choose.bind(rt);
      rt.choose = function (i) {
        const before = rt.node;
        const opt = (before && before.opts) ? before.opts[i] : null;
        const view = origChoose(i);
        if (opt && sink) {
          // TOTAL RECALL: every choice hits the feed. No silence/off-feed exception.
          sink({ questId: id, kind: 'choice', node: before.id, choiceId: i,
                 text: opt.text, to: opt.to });
        }
        checkOutcome();     // a choice can drive a stage to COMPLETE/FAIL
        return view;
      };
      // completion can also come from a node/stage @DO set_stage (not just choose).
      const origBegin = rt.begin.bind(rt);
      rt.begin = function (nid) { const v = origBegin(nid); checkOutcome(); return v; };
      const origSetStage = rt.setStage.bind(rt);
      rt.setStage = function (n) { const v = origSetStage(n); checkOutcome(); return v; };
      return rt;
    }

    function start(text) {
      if (!BQ || !BQRT) return null;
      const Q = BQ.parse(text);
      // ONCE LAW (dead-stays-dead for quests): @ONCE defaults true. A completed
      // one-time quest never restarts, even across a fold — re-calling start just
      // hands back the finished runtime. A @ONCE false quest is repeatable and
      // starts fresh each call. This keeps a done errand from re-offering forever.
      const prior = active[Q.id];
      if (prior && prior.rt.state.done && Q.once !== false) return prior.rt;
      const rt = _wire(Q.id, new BQRT.Runtime(Q, null, shared).start());
      active[Q.id] = { text: text, rt: rt };
      return rt;
    }
    function get(id)  { return active[id] ? active[id].rt : null; }
    function ids()    { return Object.keys(active); }

    /* WORLD BINDING (the talk-trigger half): bind a quest to an NPC's tile so the
       walkable world can offer it. Starts the quest if it isn't already live, then
       records where its speaker stands. Pure placement — it authors nothing and
       decides no geography (content/worldgen passes the tile). Rides the save so a
       reload keeps the NPC bound. */
    function place(text, at) {
      at = at || {};
      let id;
      if (typeof text === 'string' && active[text]) { id = text; }   // already-live questId
      else { const rt = start(text); if (!rt) return null; id = rt.Q.id; }
      // ACQUISITION CHANNEL (Paolo 7/20): 'feed' = pick it up over the phone
      // (surfaces in the feed, remote). 'inperson' = you cannot get it over the
      // phone, you have to PULL UP on them physically (the phoneless, like the
      // homeless). Either way, once done it is still remembered on the feed (total
      // recall — the player posts about the in-person deed). The channel is
      // MECHANISM; WHICH npcs are 'inperson' (homeless) is content, Paolo's call.
      const channel = at.channel === 'inperson' ? 'inperson' : 'feed';
      placed[id] = { x: at.x, y: at.y, layer: at.layer || 'npc', speaker: at.speaker || null,
                     channel: channel, faction: at.faction || null };
      return { questId: id, at: placed[id] };
    }
    function placements() {
      return Object.keys(placed).map(function (id) {
        return { questId: id, x: placed[id].x, y: placed[id].y,
                 layer: placed[id].layer, speaker: placed[id].speaker,
                 channel: placed[id].channel, faction: placed[id].faction || null };
      });
    }

    /* THE FEED OFFERS: the quests you can pick up OVER THE PHONE right now — the
       'feed' channel, live, not done. In-person quests (the phoneless: homeless)
       are deliberately EXCLUDED; the only way to get those is to pull up on them
       (talkablesNear). This is "you can't get their quest over the phone." */
    function feedOffers() {
      const out = [];
      Object.keys(placed).forEach(function (id) {
        if (placed[id].channel !== 'feed') return;
        const rt = active[id] ? active[id].rt : null;
        if (!rt || rt.state.done) return;
        out.push({ questId: id, title: rt.Q.title || id, act: rt.Q.act || null,
                   speaker: placed[id].speaker, available: rt.available() });
      });
      return out;
    }

    /* THE JOURNAL (pull-from-anywhere): one read that gives the HUD + the quest-log
       screen everything they draw — every live quest with its title/act, current
       stage, done/outcome, its objectives (active + done), and which talk nodes are
       begin-able right now. Content-agnostic; it reports state, authors nothing. */
    function journal() {
      return Object.keys(active).map(function (id) {
        const rt = active[id].rt, Q = rt.Q;
        return {
          id: id, title: Q.title || id, act: Q.act || null,
          stage: rt.state.stage, done: !!rt.state.done, outcome: rt.state.outcome || null,
          objectives: rt.objectives(),          // [{n, text, target, status}]
          available: rt.available(),            // begin-able talk nodes right now
          channel: placed[id] ? placed[id].channel : null,   // feed = phone pickup; inperson = pull up
          placed: placed[id] ? { x: placed[id].x, y: placed[id].y,
                                 layer: placed[id].layer, speaker: placed[id].speaker } : null,
        };
      });
    }
    /* Just the active (not-done) objectives across ALL quests, for the objective
       HUD line. Flat + sorted by quest then objective number; stable for render. */
    function activeObjectives() {
      const out = [];
      journal().forEach(function (j) {
        if (j.done) return;
        j.objectives.forEach(function (o) {
          if (o.status === 'active') out.push({ questId: j.id, title: j.title, n: o.n, text: o.text });
        });
      });
      out.sort(function (a, b) { return a.questId < b.questId ? -1 : a.questId > b.questId ? 1 : a.n - b.n; });
      return out;
    }

    function serialize() {
      const out = { _shared: shared };   // THE CROSS-QUEST LEDGER (8/7 ruling A)

      for (const id in active) {
        out[id] = { text: active[id].text, state: active[id].rt.state };
        if (placed[id]) out[id].at = placed[id];   // keep the NPC binding across reload
      }
      return out;
    }
    function restore(blob) {
      if (!blob || !BQ || !BQRT) return;
      /* CONTINUITY HAS TO SURVIVE A RELOAD or it is not continuity. Restored IN PLACE
         so every already-wired runtime keeps pointing at the same object. */
      if (blob._shared && blob._shared.bonds) {
        shared.bonds = shared.bonds || {};
        for (const k in blob._shared.bonds) shared.bonds[k] = blob._shared.bonds[k];
      }
      for (const id in blob) {
        if (id === '_shared') continue;
        const Q = BQ.parse(blob[id].text);
        active[id] = { text: blob[id].text, rt: _wire(id, BQRT.Runtime.load(Q, blob[id].state, shared)) };
        if (blob[id].at) placed[id] = blob[id].at;
      }
    }
    return { start, get, ids, place, cast, castTarget, placements, feedOffers, journal,
             activeObjectives, serialize, restore, _active: active, _placed: placed };
  }

  /* the generation to stamp on a recorded quest choice: the live dynasty gen if
     the fold is loaded, else the save's, else gen 1. Kept tiny + guessing-free. */
  function currentGen(ctx) {
    if (ctx.folds && typeof ctx.folds.gen === 'number') return ctx.folds.gen;
    if (ctx.save && ctx.save.meta && typeof ctx.save.meta.gen === 'number') return ctx.save.meta.gen;
    return 1;
  }

  // 8b. Quests. The .bq runtime, made pullable from the context and save-bridged:
  //     any in-flight quests restore from the save so a reload resumes mid-quest.
  //     The FEED pipe is bound here: quest choices/outcomes flow into the choice-log
  //     the fold reads, so a quest played through ctx.quests actually moves the
  //     dynasty. TOTAL RECALL (Paolo 7/20): everything is remembered on the feed,
  //     no exceptions, no secret/off-feed channel.
  function bootQuests(ctx) {
    ctx.quests = makeQuestManager({
      factions: ctx.factions,                    // THE WORLD BRIDGE: quest outcomes reach real faction standing
      save: ctx.save,                            // for meta.gave: the COUNT of times you did what an outfit wanted
      factionAdjacency: ctx.factionAdjacency,     // and, opt-in per quest, the territory AI
      worldMap: ctx.worldMap,                     // THE CASTING BRIDGE: a quest places itself into the real valley
      record: function (evt) {
        if (!ctx.save || !E.Save || typeof E.Save.recordChoice !== 'function') return;
        const beat = ctx.clock ? ctx.clock.snapshot().beat : (ctx.save.beat || 0);
        const id = (evt.kind === 'outcome')
          ? 'quest:' + evt.questId + ':' + String(evt.outcome || 'END').toLowerCase()
          : 'quest:' + evt.questId + ':' + evt.node + ':' + evt.choiceId;
        E.Save.recordChoice(ctx.save, id, beat, {
          gen: currentGen(ctx),
          recorded: true,   // TOTAL RECALL: everything is on the feed, always
          effect: (evt.kind === 'outcome')
            ? { quest: evt.questId, outcome: evt.outcome, tags: evt.tags || [] }
            : { quest: evt.questId, node: evt.node, to: evt.to },
        });
      },
    });
    if (ctx.save && ctx.save.quests) ctx.quests.restore(ctx.save.quests);
    return ctx;
  }

  /* ------------------------------------------------------------------------
     THE WALK SURFACE (7/26/26, WORLD lane — engine support request 2 of 2 from
     the RUN lane: "the player is not registered in ctx.scheduler, so the run's
     grid clock is the block sim's, not the loop's turn scheduler. Engine request
     for WORLD: a player actor the run can commit() through").

     WHY IT IS A SECOND SCHEDULER AND NOT THE FIRST ONE. ctx.scheduler runs in
     OVERMAP CELL space: its actors are spawned per district cell and its passable
     asks "is this cell crossable". A body walking a street lives in VALLEY TILE
     space, 128 tiles to the cell. Those are two different grids, and one
     scheduler cannot hold both without every existing actor silently changing
     what its coordinates mean. So the walk surface is its own scheduler on the
     same 120 BPM contract, with passability read straight off the world model's
     new tile rung — which means the player is blocked by the actual block wall,
     the actual median, the actual bedrock, not by a hand-kept collision list.

     Everything else stays the loop's: same scheduler module, same I-MOVE-YOU-MOVE
     turn, same actor shape, so an NPC added here behaves like any other actor.
     ---------------------------------------------------------------------- */
  function makeWalkSurface(ctx, opts) {
    opts = opts || {};
    const w = ctx.worldMap && ctx.worldMap.real;
    if (!w || typeof w.solidAt !== 'function') return null;   // no valley, no walk
    const T = w.TILE_PER_CELL || 128;

    // start where the caller says, else the centre of the first real district
    let gx = opts.gx, gy = opts.gy;
    if (gx == null || gy == null) {
      const d = (ctx.worldMap.districts && ctx.worldMap.districts[0]) || { pos: [0, 0] };
      gx = d.pos[0] * T + T / 2; gy = d.pos[1] * T + T / 2;
    }
    gx = Math.floor(gx); gy = Math.floor(gy);
    // never start inside a wall: settle onto the nearest real ground
    if (w.solidAt(gx, gy)) {
      outer:
      for (let r = 1; r < 60; r++) {
        for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
          if (!w.solidAt(gx + dx, gy + dy)) { gx += dx; gy += dy; break outer; }
        }
      }
    }

    const sched = Sched.makeScheduler({
      passable: function (x, y) { return !w.solidAt(x, y); }
    });
    // speed is left at the scheduler's default (one grid-step per world-turn); a
    // caller that wants a faster body passes its own.
    const player = Sched.addActor(sched, Sched.makeActor(
      opts.speed ? { id: opts.id || 'player', isPlayer: true, tile: { x: gx, y: gy }, speed: opts.speed }
                 : { id: opts.id || 'player', isPlayer: true, tile: { x: gx, y: gy } }));

    function where() { return w.tile(player.tile.x, player.tile.y); }

    /* ONE STEP, THE LOOP'S WAY. The run calls this instead of moving a sprite: the
       turn advances, the world gets its move, and the answer says whether the step
       CROSSED into another district so the surface can react (stream the next cell,
       name the place, whatever it wants). Authors nothing. */
    function commit(dx, dy) {
      const before = { x: player.tile.x, y: player.tile.y };
      /* STREAM FIRST, MOVE SECOND. The ground you are about to step onto is warmed
         before the step is taken, never after, which is the whole difference between
         a walk and a hitch at every cell boundary. Cheap: it no-ops unless the hot
         set actually changed. */
      if (typeof w.stream === 'function') w.stream(before.x + (dx | 0) * 8, before.y + (dy | 0) * 8, { radius: 1 });
      // the scheduler's intent shape is {kind:'move', dx, dy}; anything else banks
      // energy and stands still, which is how "wait" is expressed.
      const intent = (dx || dy) ? { kind: 'move', dx: dx | 0, dy: dy | 0 } : { kind: 'wait' };
      const res = Sched.commitPlayerAction(sched, intent);
      /* SETTLE. The scheduler deliberately only sets `target` and leaves the slide
         for a render layer to play out (that is the animation contract). A caller
         driving the world headlessly, or a surface that has already played its
         slide, needs the step to land, so the walk surface settles it here. The
         tile is the truth; the slide is presentation. */
      if (player.target) { player.tile = player.target; player.target = null; player.slide = 0; }
      const after = { x: player.tile.x, y: player.tile.y };
      const moved = (after.x !== before.x || after.y !== before.y);
      const from = w.tile(before.x, before.y), to = w.tile(after.x, after.y);
      const crossed = (moved && from && to && (from.cellX !== to.cellX || from.cellY !== to.cellY))
        ? { fromCell: [from.cellX, from.cellY], toCell: [to.cellX, to.cellY],
            fromDistrict: from.district, toDistrict: to.district } : null;
      return { moved: moved, blocked: !moved, turn: res.turn, at: after,
               tile: to, crossed: crossed, others: res.moved };
    }

    /* ROUTE FROM WHERE I AM. The surface does not need to know how the ground
       connects, only that it does: ask for a path, then commit() its steps. This is
       the whole intended usage, and it is what the gate walks. */
    function routeTo(tx, ty, o) { return w.route(player.tile.x, player.tile.y, Math.floor(tx), Math.floor(ty), o || {}); }

    /* Walk a route the loop's way: one commit per step, so the world turn advances
       per step exactly like a player holding a direction. Stops on the first step
       the world refuses and says where it stopped. */
    function follow(path, max) {
      const out = { steps: 0, crossings: [], stoppedAt: null };
      const lim = max || path.length;
      for (let i = 1; i < path.length && i <= lim; i++) {
        const dx = path[i][0] - player.tile.x, dy = path[i][1] - player.tile.y;
        if (Math.abs(dx) + Math.abs(dy) !== 1) { out.stoppedAt = i; break; }   // not a step
        const r = commit(dx, dy);
        if (!r.moved) { out.stoppedAt = i; break; }
        out.steps++;
        if (r.crossed) out.crossings.push(r.crossed);
      }
      return out;
    }

    return { scheduler: sched, player: player, where: where, commit: commit,
             routeTo: routeTo, follow: follow,
             teleport: function (nx, ny) {
               if (w.solidAt(nx, ny)) return false;
               player.tile = { x: Math.floor(nx), y: Math.floor(ny) };
               player.target = null; player.slide = 0; return true;
             } };
  }

  /* Run the whole boot in the one correct order. Returns a ready ctx. */
  function boot(opts) {
    opts = opts || {};
    const seedText = opts.seed || (opts.saveText ? null : 'bohemia');
    const ctx = makeContext();
    bootFoundation(ctx, seedText || 'bohemia');
    bootSave(ctx, opts.saveText || null, seedText || 'bohemia');
    // if we loaded a save, its seed is the real seed — rebuild foundation on it
    if (opts.saveText && ctx.save && ctx.save.seed && ctx.save.seed !== (seedText || 'bohemia')) {
      bootFoundation(ctx, ctx.save.seed);
    }
    bootHeartbeat(ctx);
    bootWorldGen(ctx);
    bootScheduler(ctx);
    bootFactions(ctx, opts);
    bootEconomy(ctx);
    bootEntities(ctx);
    bootDynasty(ctx);
    bootQuests(ctx);
    bootPresentation(ctx);
    ctx.booted = true;
    ctx.ready = true;
    // a walk surface is CHEAP (one scheduler, one actor, no generation) and the run
    // needs it the moment it boots, so the context carries one by default. Callers
    // that want a different start tile just make their own.
    ctx.walk = makeWalkSurface(ctx, opts.walkAt || {});
    return ctx;
  }

  /* --------------------------------------------------------------------------
     TICK — the per-frame spine. ONE place advances time (the wiring guide's
     rule). Order is final: advance the clock (which fires onBeat for whole-beat
     sim work), then let per-frame render read the interpolated beat. Render is a
     [SEAM] — headless now; the browser shell passes performance.now() and wires
     the skinner read here.
     ------------------------------------------------------------------------ */
  function tick(ctx, nowMs) {
    if (!ctx.ready) return ctx;

    // (a) advance the ONE clock. Fires ctx.clock.onBeat per whole beat.
    ctx.clock.advance(nowMs);

    // (b) heartbeat MIRRORS the one clock (guide: "the core Clock drives; the
    //     heartbeat mirrors its beat and fans out"). Re-adopt its position each
    //     tick so there is exactly one source of truth and zero drift. The
    //     heartbeat is never advanced independently — it only reflects the clock.
    if (ctx.heartbeat && typeof ctx.heartbeat.fromCoreClock === 'function') {
      ctx.heartbeat.fromCoreClock(ctx.clock);
    }

    // (b2) advance NON-GATED animation every frame: one-shot RETURN/TERMINAL anims
    //      resolve on the heartbeat's beats regardless of player movement. This is
    //      why a death plays through live. LOOP anims need nothing here.
    if (ctx.scheduler && ctx.heartbeat) {
      const bf = ctx.heartbeat.beatsFloat();
      if (ctx._lastBeatsFloat != null) {
        const dBeat = bf - ctx._lastBeatsFloat;
        if (dBeat > 0) Sched.tickAnimations(ctx.scheduler, dBeat);
      }
      ctx._lastBeatsFloat = bf;
    }

    // (c) per-frame render. [SEAM per map — GAP for tiles/props/camera]
    //     browser shell will: skinner.pose(..., ctx.heartbeat.beatsFloat()); draw tiles; draw entities.

    return ctx;
  }

  /* --------------------------------------------------------------------------
     SPAWN BRIDGE — populate the world with actors from the map, deterministically.
     A district's TEXTURE is its danger readout: an 'apocalypse' district (never
     rebuilt) crawls with hostiles; a 'modern' one is nearly safe. Spawns are a
     pure function of (world seed, tile, rule), so the same district always yields
     the same enemies — reload-stable, no storage — and the DeltaStore overlay
     means anything the player already killed does NOT respawn (dead stays dead).
     ------------------------------------------------------------------------ */

  // danger by district texture -> spawn density (probability a tile has a hostile)
  const DANGER_BY_TEXTURE = { apocalypse: 0.06, recovering: 0.025, modern: 0.008 };

  /* Build the deterministic enemy spawn rule for a district. Kept tiny and
     content-agnostic; the game can swap richer rolls later. */
  function enemyRuleForDistrict(district) {
    const density = DANGER_BY_TEXTURE[district.texture] != null
      ? DANGER_BY_TEXTURE[district.texture] : 0.02;
    return {
      layer: 'enemy',
      density: density,
      roll: function (rng /*, ctx */) {
        // deterministic pick of a coarse hostile archetype; real roster is content.
        const t = rng();
        const type = t < 0.6 ? 'scav' : t < 0.9 ? 'raider' : 'brute';
        const speed = type === 'brute' ? Sched.STEP_COST / 2      // slow, every other turn
                    : type === 'raider' ? Sched.STEP_COST * 2      // fast, twice a turn
                    : Sched.STEP_COST;                              // scav, normal
        return { type: type, speed: speed };
      },
    };
  }

  /* Spawn scheduler-ready actors for one district: scan a radius around the
     district position, turn each surviving spawn into an actor with a simple
     wander AI, and (optionally) add them straight into the scheduler. Returns the
     actors. `radius` bounds the HOT window — never the whole map. */
  function spawnActorsForDistrict(ctx, district, opts) {
    opts = opts || {};
    const radius = opts.radius || 6;
    if (!ctx.deltas) ctx.deltas = new E.Entities.DeltaStore();
    const spawner = new E.Entities.Spawner(ctx.save.seed, ctx.deltas);
    const rule = enemyRuleForDistrict(district);
    const [cx, cy] = district.pos;
    const found = spawner.scanRegion(rule, cx - radius, cy - radius, cx + radius, cy + radius, {});
    const passable = ctx.scheduler ? ctx.scheduler.passable : function () { return true; };
    const actors = [];
    for (const f of found) {
      if (!passable(f.x, f.y)) continue;             // don't spawn inside a wall
      const a = Sched.makeActor({
        id: 'e_' + district.id + '_' + f.x + '_' + f.y,   // stable, tile-derived id
        tile: { x: f.x, y: f.y },
        layer: 'enemy',
        speed: f.entity.speed || Sched.STEP_COST,
        anim: 'idle',
        ai: wanderAI(),
      });
      a.type = f.entity.type;
      actors.push(a);
      if (opts.add !== false && ctx.scheduler) Sched.addActor(ctx.scheduler, a);
    }
    return actors;
  }

  /* A minimal deterministic wander AI: steps toward a slowly-changing direction,
     staying on passable tiles. Deterministic per actor+turn so replays match.
     Content can replace this with real threat/pursuit behaviour later. */
  function wanderAI() {
    const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
    return function (view) {
      const self = view.self;
      // derive a direction from the actor id + current turn (no live RNG stream)
      const h = hashStr(self.id + ':' + view.turn);
      const d = DIRS[h % 4];
      const nx = self.tile.x + d[0], ny = self.tile.y + d[1];
      if (!view.passable(nx, ny)) return { kind: 'wait' };
      return { kind: 'move', dx: d[0], dy: d[1] };
    };
  }

  /* tiny stable string hash (no live RNG) so wander is deterministic + reload-safe */
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* --------------------------------------------------------------------------
     LOD DISTRICT MANAGER — the thing that makes the whole real valley runnable
     on a phone. Every district gets a simulation TIER by distance from the player:

       HOT  (near)  : actors are INSTANTIATED into the scheduler (full sim).
       WARM (mid)   : actors are only COUNTED (cheap threat awareness, no objects).
       COLD (far)   : nothing runs; the district sleeps. Deterministic spawns +
                      the delta overlay mean re-entering it reproduces the exact
                      same state (minus what the player already killed) with zero
                      stored per-tile data. Sleeping costs nothing.

     Because spawns are a pure function of (seed, tile) and deaths are deltas,
     despawning a district's actors when it goes COLD loses NOTHING — walking back
     in respawns the survivors identically. This is why the valley can be huge and
     the phone only ever holds the HOT actors in memory.
     ------------------------------------------------------------------------ */

  // distance bands, in overmap CELLS from the player. The real valley
  // (bohemia_world.js) is a 96x96 grid, not the old abstract map's 256x256 —
  // these keep the SAME fractional radius (~15.6% / ~35% of the map span)
  // the old constants (40/90 of 256) encoded, just converted to the real
  // grid's scale, so a district still goes HOT/WARM at roughly the same
  // FRACTION of the valley it always did rather than swallowing the whole
  // map (real district cells sit right next to each other, dense — unlike
  // the old model's sparse scattered points — so an unconverted radius would
  // have put nearly every real district in HOT/WARM at all times).
  const LOD_HOT_R = 15;    // within 15 cells: full sim
  const LOD_WARM_R = 34;   // within 34: counted only
  // beyond LOD_WARM_R: COLD (asleep)

  function tierForDistance(dist) {
    if (dist <= LOD_HOT_R) return E.Core.TIER.HOT;
    if (dist <= LOD_WARM_R) return E.Core.TIER.WARM;
    return E.Core.TIER.COLD;
  }

  /* Recompute every district's tier from the player's current tile and reconcile
     the scheduler: instantiate actors for districts newly HOT, remove actors for
     districts that dropped out of HOT, and keep a cheap count for WARM. Idempotent
     and deterministic. Call this after the player moves (or every N turns).
     Returns a small summary {hot, warm, cold, spawned, despawned}. */
  function updateDistrictLOD(ctx, opts) {
    opts = opts || {};
    if (!ctx.worldMap || !ctx.scheduler) return null;
    const player = ctx.scheduler.actors.find(a => a.isPlayer);
    if (!player) return null;
    if (!ctx._lodState) ctx._lodState = {};   // districtId -> current tier
    const summary = { hot: 0, warm: 0, cold: 0, spawned: 0, despawned: 0, warmCounts: {} };
    const rule = null;

    for (const district of ctx.worldMap.districts) {
      const dx = district.pos[0] - player.tile.x;
      const dy = district.pos[1] - player.tile.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const tier = tierForDistance(dist);
      const prev = ctx._lodState[district.id];

      if (tier === E.Core.TIER.HOT) {
        summary.hot++;
        if (prev !== E.Core.TIER.HOT) {
          // promote: instantiate this district's surviving actors
          const added = spawnActorsForDistrict(ctx, district, { radius: 8, add: true });
          summary.spawned += added.length;
        }
      } else {
        // WARM or COLD: this district must hold NO live actors
        if (prev === E.Core.TIER.HOT) {
          const removed = _despawnDistrict(ctx, district.id);
          summary.despawned += removed;
        }
        if (tier === E.Core.TIER.WARM) {
          summary.warm++;
          // cheap count only (no instantiation) — WARM threat awareness
          const spawner = new E.Entities.Spawner(ctx.save.seed, ctx.deltas || (ctx.deltas = new E.Entities.DeltaStore()));
          const er = enemyRuleForDistrict(district);
          const [cx, cy] = district.pos;
          summary.warmCounts[district.id] = spawner.countRegion(er, cx - 8, cy - 8, cx + 8, cy + 8, {});
        } else {
          summary.cold++;
        }
      }
      ctx._lodState[district.id] = tier;
    }
    return summary;
  }

  /* Remove all live actors that belong to a district (its spawns share the id
     prefix "e_<districtId>_"). Player and non-district actors are never touched.
     Removing them loses nothing — deterministic respawn + deltas restore them. */
  function _despawnDistrict(ctx, districtId) {
    const prefix = 'e_' + districtId + '_';
    let n = 0;
    for (const a of ctx.scheduler.actors.slice()) {
      if (typeof a.id === 'string' && a.id.indexOf(prefix) === 0) {
        Sched.removeActor(ctx.scheduler, a.id);
        n++;
      }
    }
    return n;
  }

  /* --------------------------------------------------------------------------
     TALK-TRIGGER — the join between the walkable world and the quest system. A
     quest is bound to an NPC's tile via ctx.quests.place(...). This asks: standing
     at (px,py), which quest talk-nodes can I begin RIGHT NOW? A node qualifies when
     its NPC is within `radius` (chebyshev — step-adjacent by default) AND the
     runtime's own entry condition passes (available()). This is the connective
     tissue that will let the walkable slice pop a "talk" prompt; it authors no
     dialogue and decides no placement. Choosing through the returned node already
     feeds the ledger (the pipe above). Headless + deterministic.
     ------------------------------------------------------------------------ */
  function talkablesNear(ctx, px, py, radius) {
    radius = (radius == null) ? 1 : radius;
    const out = [];
    if (!ctx.quests || typeof ctx.quests.placements !== 'function') return out;
    ctx.quests.placements().forEach(function (p) {
      if (p.x == null || p.y == null) return;
      const dist = Math.max(Math.abs(p.x - px), Math.abs(p.y - py));   // chebyshev adjacency
      if (dist > radius) return;
      const rt = ctx.quests.get(p.questId);
      if (!rt || rt.state.done) return;              // finished quests offer nothing
      rt.available().forEach(function (nodeId) {
        out.push({ questId: p.questId, node: nodeId, speaker: p.speaker,
                   x: p.x, y: p.y, dx: p.x - px, dy: p.y - py, dist: dist });
      });
    });
    out.sort(function (a, b) { return a.dist - b.dist; });
    return out;
  }

  /* Begin a talk node returned by talkablesNear — the one call the walkable slice
     makes when the player taps "talk". Returns the runtime's view (speaker/says/
     options) or null. The caller renders it; choosing on the runtime feeds the
     ledger automatically. */
  function talkTo(ctx, questId, nodeId) {
    if (!ctx.quests) return null;
    const rt = ctx.quests.get(questId);
    if (!rt) return null;
    return rt.begin(nodeId);
  }

  /* CLOUT (Paolo 7/21 LOCK): "reckless/dangerous shit gets more followers than
     quiet good deeds, yes." Real virality doesn't reward the biggest deed, it
     rewards the best STORY — and it matches the Amalgamation's own canon logic
     (GDD v2: "the Amalgamation watches viral moments most carefully," proximity-
     to-secret kills). Chasing clout is choosing exposure, on purpose.

     A quest's completing @STAGE line can carry ONE hashtag from this scale to
     classify its own outcome: #quiet #notable #risky #reckless (content's call,
     per quest — the parser already captures arbitrary #tags on any line via
     tagsOf(), so no format change was needed). Untagged stages score NEUTRAL.
     The ORDERING (reckless > risky > notable > quiet) is now locked canon and
     enforced by the LOOP CLOUT gate; the exact numbers stay tunable. */
  const CLOUT_TAGS = ['quiet', 'notable', 'risky', 'reckless'];
  const CLOUT_WEIGHTS = { quiet: 8, notable: 25, risky: 55, reckless: 110 };
  const CLOUT_NEUTRAL = 15;   // untagged stage: a mild default (below 'notable')

  function cloutWeight(tag) {
    return CLOUT_WEIGHTS.hasOwnProperty(tag) ? CLOUT_WEIGHTS[tag] : CLOUT_NEUTRAL;
  }
  /* pick the one clout tag off a stage's raw #hashtag list (first vocabulary hit;
     a stage should only carry one — that's a content-authoring discipline, not
     enforced here). */
  function cloutTagFrom(tags) {
    tags = tags || [];
    for (let i = 0; i < CLOUT_TAGS.length; i++) if (tags.indexOf(CLOUT_TAGS[i]) >= 0) return CLOUT_TAGS[i];
    return null;
  }
  /* THE real default follower score (replaces the old ad hoc demo placeholders):
     a post earns followers only when it's a quest outcome (posts == quests done),
     weighted by how reckless its completing stage declared itself to be. */
  function defaultFollowerScore(post) {
    if (!post || post.kind !== 'outcome') return 0;
    return cloutWeight(post.clout);
  }

  /* --------------------------------------------------------------------------
     THE FEED — the phone's front page. Paolo 7/20: ONE POST PER COMPLETED QUEST
     ("you complete a quest, you make a post"), so posts == quests done. The feed is
     NOT a log of every choice — that granular record still lives in the choice-log
     for the fold (the game remembers everything), but what you SEE is a clean post
     per finished quest. A projection over save.choices; authors nothing. Followers
     are scored by CLOUT (above) via defaultFollowerScore, or a custom scoreFn.
     Newest-first.

     Each post: { beat, gen, kind:'outcome', questId, title, outcome, clout, id }.
     Pass {all:true} to include the granular per-choice entries too (debugging); the
     default feed is completions only. {limit:N} trims to the latest N.
     ------------------------------------------------------------------------ */
  function buildFeed(ctx, opts) {
    opts = opts || {};
    if (!ctx.save || !Array.isArray(ctx.save.choices)) return [];
    const titleOf = function (qid) {
      const rt = ctx.quests ? ctx.quests.get(qid) : null;
      return rt && rt.Q && rt.Q.title ? rt.Q.title : qid;
    };
    let posts = ctx.save.choices.map(function (c, idx) {
      const eff = c.effect || {};
      const qid = eff.quest || null;
      let kind = 'event', outcome = null, node = null, to = null, clout = null;
      if (qid) {
        if (eff.outcome != null) { kind = 'outcome'; outcome = eff.outcome; clout = cloutTagFrom(eff.tags); }
        else { kind = 'choice'; node = eff.node != null ? eff.node : null; to = eff.to != null ? eff.to : null; }
      }
      return { seq: idx, beat: c.beat || 0, gen: c.gen || 1, kind: kind,
               questId: qid, title: qid ? titleOf(qid) : null,
               outcome: outcome, node: node, to: to, clout: clout, id: c.id };
    });
    // ONE POST PER COMPLETED QUEST: the feed is completions only unless {all}.
    if (!opts.all) posts = posts.filter(function (p) { return p.kind === 'outcome'; });
    // newest-first: primary by beat desc, tiebreak by insertion order desc (stable).
    posts.sort(function (a, b) { return (b.beat - a.beat) || (b.seq - a.seq); });
    if (opts.limit) return posts.slice(0, opts.limit);
    return posts;
  }

  /* THE SOCIAL PROFILE — the readout at the top of the phone: how much you've done
     and how far it reached. A pure projection over the feed. Paolo 7/20: "you gain
     FOLLOWERS when you do cool shit"; Paolo 7/21 LOCK: "reckless/dangerous shit gets
     more followers than quiet good deeds" (see CLOUT above). `scoreFn(post) -> number`
     defaults to `defaultFollowerScore` (the real CLOUT-weighted math) when omitted —
     pass a different scoreFn only to override it. Whether followers and clout end up
     as one number or two is still open: call this once per metric with its own scoreFn.
       returns { posts, questsTouched, questsCompleted, reach }
     posts == quests done (one post per completion). questsTouched counts every quest
     you have engaged (from the full choice-log). reach = followers, summed by scoreFn
     over the POSTS (completions) only — you gain followers when you complete and post. */
  function socialProfile(ctx, scoreFn) {
    const score = typeof scoreFn === 'function' ? scoreFn : defaultFollowerScore;
    const all = buildFeed(ctx, { all: true });
    const touched = {}, completed = {};
    let reach = 0, posts = 0;
    all.forEach(function (p) {
      if (p.questId) touched[p.questId] = true;
      if (p.kind === 'outcome') {                       // a completion == a post
        posts++;
        if (p.outcome === 'COMPLETE' && p.questId) completed[p.questId] = true;
        reach += (score(p) || 0);
      }
    });
    return { posts: posts,
             questsTouched: Object.keys(touched).length,
             questsCompleted: Object.keys(completed).length,
             reach: reach };
  }

  /* The player commits a grid action. This is the ONE thing that advances the
     world's grid clock by a turn (I move, you move). Animation keeps running via
     tick() every frame regardless; this only moves grid position. Returns the
     scheduler's move summary. */
  function commit(ctx, playerIntent) {
    if (!ctx.ready || !ctx.scheduler) return null;
    const result = Sched.commitPlayerAction(ctx.scheduler, playerIntent);
    // keep the save's world-turn (sun/day phase) current
    if (ctx.save) ctx.save.turn = ctx.scheduler.turn;
    return result;
  }

  /* --------------------------------------------------------------------------
     SAVE HOOK — the loop is where a save is written. Real contract: pull the
     clock beat into the save meta so a reload resumes the same beat (snapshot/
     restore already exist on Clock + Heartbeat). Choice logging happens at the
     content layer via Save.recordChoice; the loop just persists the current beat.
     ------------------------------------------------------------------------ */
  function captureSave(ctx) {
    if (!ctx.save) return null;
    const snap = ctx.clock.snapshot();     // {beat, acc}
    ctx.save.beat = snap.beat;
    if (ctx.scheduler) ctx.save.turn = ctx.scheduler.turn;   // sun/day phase
    if (ctx.deltas) ctx.save.deltas = ctx.deltas.toJSON();   // permanent world changes
    if (ctx.quests) ctx.save.quests = ctx.quests.serialize();  // in-flight quest progress
    return E.Save.serialize(ctx.save);
  }

  return {
    makeContext, boot, tick, commit, captureSave,
    // THE WALK SURFACE: a player the run can commit() through, on the loop's own
    // scheduler, blocked by the world model's real tiles (engine support for RUN)
    makeWalkSurface,
    spawnActorsForDistrict, enemyRuleForDistrict, updateDistrictLOD,
    talkablesNear, talkTo, buildFeed, socialProfile,
    CLOUT_TAGS, CLOUT_WEIGHTS, cloutWeight, cloutTagFrom, defaultFollowerScore,
    // individual boot steps exported so each can be tested in isolation
    _steps: {
      bootFoundation, bootSave, bootHeartbeat, bootScheduler, bootWorldGen, bootFactions,
      bootEconomy, bootEntities, bootDynasty, bootQuests, bootPresentation,
    },
    makeQuestManager,
  };
});
