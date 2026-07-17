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
  const mod = factory(E, Sched);
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  if (typeof root !== 'undefined') root.BohemiaLoop = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (E, Sched) {
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
      worldMap: null,     // WorldGen.generateWorld(seed). [SEAM: reseed from rng.branch('worldgen')]
      factions: null,     // Factions.FactionWorld + FactionCanon. [SEAM: enforceConstraints into shiftStanding]
      economy: null,      // Economy.Economy. [GAP per map: currency sources from worldMap geography]
      spawner: null,      // Entities.Spawner. [GAP per map: spawn regions from worldMap districts]

      // --- LAYER 4b: DYNASTY (the fold, already save-bridged) [ISLAND] ---
      folds: null,        // Generations.foldFromSave(save) result. Recomputed on load & at each handoff.

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

  // 3b. The world-turn / grid clock: the "I move, you move" scheduler. Real,
  //     poured now — it's tested [SOLID]. Player is actor #0; the world advances
  //     grid position only on commitPlayerAction. Animation stays on the heartbeat.
  function bootScheduler(ctx) {
    // passable now reads the REAL map geography (mountain walls, map bounds) if a
    // world was generated. Actors can no longer phase through the world. Falls
    // back to always-passable only if worldgen hasn't run (headless bare tests).
    const passable = ctx.worldMap
      ? E.WorldGen.passableFromMap(ctx.worldMap)
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

  // 4. World generation. [SEAM] — call exists, but reseeding from the shared RNG
  //    branch is the one-line change the map calls for; not done until we choose
  //    to (keeps this a scaffold, not a behavior change).
  function bootWorldGen(ctx) {
    // Generate the deterministic valley from the save's seed. [SEAM remains:
    // reseeding from rng.branch('worldgen') for a fully unified stream — for now
    // generateWorld self-seeds from the same seed string, which is deterministic
    // and correct; the branch-unification is a later refinement.]
    ctx.worldMap = E.WorldGen.generateWorld(ctx.save.seed).map;
    return ctx;
  }

  // 5. Factions + canon. [SEAM] enforceConstraints-into-shiftStanding is a [STUB]
  //    on the map; base placement into worldgen slots is a [GAP]. Socket ready.
  function bootFactions(ctx) {
    // [SEAM] ctx.factions = new E.Factions.FactionWorld(...);
    // [SEAM] E.FactionCanon.loadFactionCanon(ctx.factions);
    return ctx;
  }

  // 6. Economy. [GAP per map] currency sources come from worldMap geography.
  function bootEconomy(ctx) {
    // [GAP] ctx.economy = new E.Economy.Economy(...); sources hooked to ctx.worldMap.
    return ctx;
  }

  // 7. Entities. [GAP per map] spawn regions come from worldMap districts.
  function bootEntities(ctx) {
    // [GAP] ctx.spawner = new E.Entities.Spawner(...); regions from ctx.worldMap.
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
    bootFactions(ctx);
    bootEconomy(ctx);
    bootEntities(ctx);
    bootDynasty(ctx);
    bootPresentation(ctx);
    ctx.booted = true;
    ctx.ready = true;
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
     LOD DISTRICT MANAGER — the thing that makes the whole 256x256 valley runnable
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

  // distance bands, in tiles, from the player to a district position.
  const LOD_HOT_R = 40;    // within 40 tiles: full sim
  const LOD_WARM_R = 90;   // within 90: counted only
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
    return E.Save.serialize(ctx.save);
  }

  return {
    makeContext, boot, tick, commit, captureSave,
    spawnActorsForDistrict, enemyRuleForDistrict, updateDistrictLOD,
    // individual boot steps exported so each can be tested in isolation
    _steps: {
      bootFoundation, bootSave, bootHeartbeat, bootScheduler, bootWorldGen, bootFactions,
      bootEconomy, bootEntities, bootDynasty, bootPresentation,
    },
  };
});
