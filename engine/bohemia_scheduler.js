/* ============================================================================
   BOHEMIA — SCHEDULER  (bohemia_scheduler.js)
   7.1.26 — the "I move, you move" world-turn clock. THE mechanic Paolo fell for
   in Rogue Fable IV / roguetime games (WazHack, Enter the Chronosphere lineage).

   THE ONE RULE THIS ENFORCES:
     Grid POSITION is the only thing that waits for the player. Nothing else.
     Animation is NOT gated — it runs forever on the 120 BPM heartbeat. An actor
     mid-walk keeps its walk cycle playing IN PLACE (treadmill) while the world
     is settled; it only TRANSLATES tile-to-tile when the player takes a step.
     [Paolo LOCKED: "A ABSOLUTELY A" — walkers walk-in-place, never drop to idle.]

   TWO CLOCKS, TWO JOBS (neither replaces the other):
     - HEARTBEAT (bohemia_heartbeat.js, already built): render/animation clock.
       Drives every sprite's current animation continuously, on-beat. Never gated.
     - SCHEDULER (this file): the world-turn / grid clock. Advances grid position
       exactly one world-step per committed player action. This is the new thing.

   ANIMATION END-BEHAVIOR (the taxonomy Paolo confirmed):
     - LOOP      : plays forever, returns to itself (walk/run/idle/dance/sway).
                   Runs in place on the heartbeat regardless of turn state.
     - RETURN    : one-shot, then falls back to the prior loop (flinch/reload/gesture).
     - TERMINAL  : one-shot, actor enters a new RESTING state and stays (death/KO).
                   [Paolo LOCKED] Terminal anims (headshot ragdoll) play through
                   LIVE on their own heartbeat beats IMMEDIATELY — they are a body
                   resolving, not a grid move, so they are NOT gated by player
                   movement. When settled, the actor is a corpse/downed state and
                   (in the full game) becomes an entities delta (permanent).

   ENERGY MODEL (standard roguelike scheduling, "treat the hero as just another
   actor"): every actor banks `energy` at its `speed`; when it crosses the act
   threshold it may take a grid-step. Fast actors step more often, slow ones less,
   all without any wall clock. The PLAYER is actor #0 and is the only actor whose
   decision BLOCKS on real input — until the player commits, the world does not
   advance a single grid-step. That is the whole "nothing moves till you move."

   HEADLESS. Pure logic, deterministic, node-testable like every engine module.
   No DOM, no render. The browser shell reads actor.tile + actor.slide (0..1) and
   lets the skinner draw the interpolated position; animation comes off heartbeat.
   ============================================================================ */

(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  if (typeof root !== 'undefined') root.BohemiaScheduler = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* Energy needed to earn one grid-step. Actor speed is measured against this.
     speed === STEP_COST  -> steps every world-turn.
     speed === STEP_COST/2 -> steps every OTHER world-turn (slow).
     speed === STEP_COST*2 -> can step TWICE in one world-turn (fast animal). */
  const STEP_COST = 100;

  /* Animation end-behaviour tags. */
  const ANIM = { LOOP: 'loop', RETURN: 'return', TERMINAL: 'terminal' };

  /* Actor life states. ALIVE actors participate in the grid queue. RESOLVING
     actors are mid-terminal-anim (e.g. dying) — they DO NOT take grid-steps but
     their terminal animation advances live every frame. DOWN actors are settled
     resting states (corpse/KO) — no grid-steps, a looping/rest anim only. */
  const LIFE = { ALIVE: 'alive', RESOLVING: 'resolving', DOWN: 'down' };

  /* --------------------------------------------------------------------------
     ACTOR — the one shape for every moving thing (player, npc, dancer, animal).
     Position is grid; animation is a label the heartbeat renders. The scheduler
     only ever writes `tile`, `slide`, `energy`, `life`. It never touches which
     animation plays — that is the actor's own intent, so a walker keeps walking.
     ------------------------------------------------------------------------ */
  function makeActor(opts) {
    opts = opts || {};
    return {
      id: opts.id,
      tile: opts.tile || { x: 0, y: 0 },   // where it IS (grid cell)
      target: null,                          // tile it is sliding toward, or null
      slide: 0,                              // 0..1 interpolation of the current slide
      speed: opts.speed || STEP_COST,        // energy earned per world-turn
      energy: 0,                             // banked energy toward the next step
      life: LIFE.ALIVE,
      anim: opts.anim || 'idle',             // current animation label (heartbeat renders this)
      animMode: opts.animMode || ANIM.LOOP,  // loop/return/terminal
      animT: 0,                              // 0..1 progress of a one-shot (return/terminal) anim
      isPlayer: !!opts.isPlayer,
      // ai(view) -> intent. intent: {kind:'move', dx, dy} | {kind:'wait'} | null.
      // Player ai is null; the player's intent is injected via commit().
      ai: opts.ai || null,
      _prevAnim: null,                        // loop to restore after a RETURN anim
    };
  }

  /* --------------------------------------------------------------------------
     SCHEDULER — owns the actor set and the world-turn counter. The turn counter
     is the ONLY time-of-day source (sun = f(turns), never a wall clock): the
     world literally cannot advance toward night while the player stands still.
     ------------------------------------------------------------------------ */
  function makeScheduler(opts) {
    opts = opts || {};
    return {
      actors: [],
      turn: 0,                 // world-turns elapsed. THE macro clock. Saveable.
      passable: opts.passable || function () { return true; }, // (x,y)->bool tile gate
      onDeath: opts.onDeath || null,  // (actor)=>void, fired once when a terminal anim settles DOWN
      _byId: {},
    };
  }

  function addActor(sched, actor) {
    sched.actors.push(actor);
    sched._byId[actor.id] = actor;
    return actor;
  }
  function getActor(sched, id) { return sched._byId[id]; }
  function removeActor(sched, id) {
    sched.actors = sched.actors.filter(a => a.id !== id);
    delete sched._byId[id];
  }

  /* --------------------------------------------------------------------------
     THE TURN — commitPlayerAction: the heart of "I move, you move".
     Called ONLY when the player commits (a move, a wait, an interact). Advances
     the whole world exactly one world-turn: banks energy, lets every ALIVE actor
     that can afford it take one grid-step (its AI decides where), player included.
     Returns a summary of what stepped (for the render layer to start slides).

     RESOLVING actors (dying) are skipped here — their terminal anim is advanced
     by tickAnimations() every frame, NOT by the turn. That's why a death plays
     through live even if the player never moves again.
     ------------------------------------------------------------------------ */
  function commitPlayerAction(sched, playerIntent) {
    const player = sched.actors.find(a => a.isPlayer);
    if (!player || player.life !== LIFE.ALIVE) return { moved: [], turn: sched.turn };

    sched.turn += 1;
    const moved = [];

    // 1) player acts first with the committed intent (already "decided").
    _bankAndMaybeStep(sched, player, playerIntent, moved);

    // 2) every other ALIVE actor banks energy and acts via its AI. Deterministic
    //    order = insertion order (stable; no RNG in ordering so saves replay).
    for (const a of sched.actors) {
      if (a.isPlayer || a.life !== LIFE.ALIVE) continue;
      const intent = a.ai ? a.ai(_view(sched, a)) : { kind: 'wait' };
      _bankAndMaybeStep(sched, a, intent, moved);
    }

    return { moved, turn: sched.turn };
  }

  /* Bank one turn of energy; if the actor can afford a step and its intent is a
     move to a passable tile, set its target (a slide the render layer plays out).
     A fast actor (speed > STEP_COST) may afford MULTIPLE steps in one turn — we
     allow up to the energy it banked, resolving intent each sub-step. */
  function _bankAndMaybeStep(sched, actor, intent, moved) {
    actor.energy += actor.speed;
    let steps = 0;
    while (actor.energy >= STEP_COST && steps < 4) {   // clamp: max 4 sub-steps/turn
      if (!intent || intent.kind !== 'move') break;    // wait/interact: bank but don't move
      const nx = actor.tile.x + (intent.dx || 0);
      const ny = actor.tile.y + (intent.dy || 0);
      if (!sched.passable(nx, ny)) break;              // blocked: keep energy, stop
      actor.energy -= STEP_COST;
      actor.target = { x: nx, y: ny };
      actor.slide = 0;                                  // render layer drives 0->1 then commits
      moved.push(actor.id);
      steps++;
      // for multi-step in one turn, re-poll AI for the next sub-step
      if (actor.energy >= STEP_COST && !actor.isPlayer && actor.ai) {
        // provisionally commit the tile so the next AI poll sees the new position
        actor.tile = actor.target; actor.target = null; actor.slide = 0;
        intent = actor.ai(_view(sched, actor));
      } else {
        break;
      }
    }
  }

  /* Minimal world-view handed to an actor's AI. Kept tiny on purpose; expands as
     content needs it (nearby actors, LOS, threat). [SEAM] enrich later. */
  function _view(sched, self) {
    return {
      turn: sched.turn,
      self: self,
      passable: sched.passable,
      actors: sched.actors,   // AI can scan; keep read-only by convention
    };
  }

  /* --------------------------------------------------------------------------
     SLIDE RESOLUTION — the render layer advances actor.slide 0->1 over a couple
     heartbeat beats, then calls this to COMMIT the grid move. Headless callers
     (tests) can call finishSlides() to snap all pending slides to done.
     ------------------------------------------------------------------------ */
  function commitSlide(actor) {
    if (actor.target) {
      actor.tile = actor.target;
      actor.target = null;
      actor.slide = 0;
    }
  }
  function finishSlides(sched) {
    for (const a of sched.actors) commitSlide(a);
  }

  /* --------------------------------------------------------------------------
     ANIMATION TICK — called EVERY FRAME with the heartbeat's beat delta. This is
     where NON-GATED animation lives. It:
       - advances one-shot (RETURN/TERMINAL) anims toward completion,
       - on RETURN completion, restores the prior loop,
       - on TERMINAL completion, settles the actor to DOWN (corpse/KO rest).
     LOOP anims need nothing here — the heartbeat renders them continuously; the
     scheduler doesn't touch them, which is exactly why a walker walks in place.
     ------------------------------------------------------------------------ */
  function tickAnimations(sched, beatDelta) {
    for (const a of sched.actors) {
      if (a.animMode === ANIM.LOOP) continue;             // heartbeat handles it; nothing gated
      a.animT += (beatDelta || 0);
      if (a.animT >= 1) {
        if (a.animMode === ANIM.RETURN) {                 // flinch/reload done -> back to loop
          a.anim = a._prevAnim || 'idle';
          a.animMode = ANIM.LOOP;
          a.animT = 0; a._prevAnim = null;
        } else if (a.animMode === ANIM.TERMINAL) {        // death/KO done -> settle DOWN
          a.animT = 1;
          const wasResolving = a.life !== LIFE.DOWN;
          a.life = LIFE.DOWN;
          // stays DOWN; render shows the resting/corpse frame. Fire the death sink
          // exactly ONCE (on the resolving->down transition) so the game can write
          // a permanent entities delta. The scheduler stays content-agnostic: it
          // knows nothing about DeltaStore; it just announces "this actor settled
          // dead at this tile." The loop's handler does the persistence.
          if (wasResolving && typeof sched.onDeath === 'function') {
            sched.onDeath(a);
          }
        }
      }
    }
  }

  /* Trigger a one-shot animation on an actor. RETURN remembers the loop to come
     back to. TERMINAL flips the actor to RESOLVING so it stops taking grid-steps
     immediately, while its death anim plays through live via tickAnimations. */
  function playOneShot(actor, animName, mode) {
    if (mode === ANIM.TERMINAL) {
      actor.life = LIFE.RESOLVING;                        // out of the grid queue at once
      actor.target = null; actor.slide = 0;               // cancel any in-flight slide
    } else {
      actor._prevAnim = actor.anim;                       // RETURN: remember the loop
    }
    actor.anim = animName;
    actor.animMode = mode;
    actor.animT = 0;
  }

  /* --------------------------------------------------------------------------
     SAVE HOOK — the world-turn counter is the macro clock; it belongs in the
     save so a reload resumes the same turn (and thus the same sun/day phase).
     Actor grid state is reconstructable from the choice log in the full game;
     here we expose the turn so the loop can fold it into the save meta.
     ------------------------------------------------------------------------ */
  function snapshotTurn(sched) { return sched.turn; }
  function restoreTurn(sched, turn) { sched.turn = turn | 0; }

  return {
    STEP_COST, ANIM, LIFE,
    makeActor, makeScheduler, addActor, getActor, removeActor,
    commitPlayerAction, commitSlide, finishSlides,
    tickAnimations, playOneShot,
    snapshotTurn, restoreTurn,
    _internal: { _bankAndMaybeStep, _view },
  };
});
