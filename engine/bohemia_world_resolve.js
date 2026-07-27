/* ============================================================================
   BOHEMIA — THE WORLD'S HALF OF THE RESOLVER   (bohemia_world_resolve.js, 7/27/26)

   Paolo, 7/27: "adopt the world's half of the approved resolver: the world's
   systems (encounter director when it lands, faction beats, day advance)
   subscribe to the declared time-spend moments — a meal moves the world a
   little, a night moves it more, because each system declares it, never
   hardcoded. All tables stay empty until I rule numbers."

   engine/bohemia_resolve.js shipped the MACHINE: an ordered list of pure steps
   run at one named moment, with each step declaring which moments it answers.
   Nothing was plugged into it. This file is the world side of that plug, and it
   is deliberately the thinnest thing that can be called an adoption.

   ----------------------------------------------------------------------------
   THE THREE RULES THIS FILE EXISTS TO HOLD
   ----------------------------------------------------------------------------
   1. NO MOMENT NAMES LIVE HERE. A moment ("a night", "a meal", "a hangout") and
      what it SPENDS are canon, and canon is Paolo's (7/26,
      laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md). The caller
      builds the resolver with its declared moments and tells each system which of
      them it answers. Search this file for a moment name and you will not find
      one — that is the point, and its gate proves it by construction.

   2. EVERY TABLE SHIPS EMPTY. "All tables stay empty until I rule numbers."
      A system with no ruling does not guess, does not fall back and does not
      quietly do nothing: it runs, changes NOTHING, and reports NO_RULING by name,
      so an unruled world is visibly unruled instead of invisibly broken. That is
      MECHANISM-MINE / CONTENTS-PAOLO'S with a report attached.

   3. THE SIZE OF THE MOMENT IS THE ONLY DIAL. "a meal moves the world a little,
      a night moves it more, because each system declares it." Each system gets a
      per-unit rate FROM THE CALLER and multiplies it by the moment's own `spends`.
      So the relative sizes are one ruling (the moment table) and each system's
      sensitivity is another (its rate), and neither is written down in here.

   ----------------------------------------------------------------------------
   WHY A STEP MAY NOT READ ANOTHER STEP'S REPORT, AND WHAT TO DO INSTEAD
   ----------------------------------------------------------------------------
   The resolver forbids it on purpose. So the day step does not TELL anyone the
   day rolled — it writes the new day onto the shared ctx, and any later-phase
   system that cares compares ctx.day against the last day it itself saw. Shared
   world state is what ctx is for; a back channel between steps is what the ban is
   for. Phase order (WORLD, PLACES, PEOPLE, BOOKS, FEED) makes that safe: the day
   moves in WORLD, before anybody downstream looks.

   ----------------------------------------------------------------------------
   THE FACTION PACING RULING IS NOT OVERRIDDEN BY THIS
   ----------------------------------------------------------------------------
   Paolo 7/24, recorded in bohemia_loop.js: a faction turn "must stay RARE and
   QUEST-GATED — a faction's turn fires when the narrative calls for it (a quest
   resolves, a story beat lands), never on a tick, a heartbeat, or any kind of
   background clock. Default OFF."

   He said "faction beats" today, and a BEAT is exactly the thing the 7/24 ruling
   allows. Both hold, and this file makes that structural rather than hopeful: the
   faction system subscribes like everything else, but it cannot fire without an
   explicit caller-supplied `beat` predicate. No predicate, no turn, ever — so the
   default really is OFF, and a spent meal can never quietly become a war.

   HEADLESS. No DOM, no clock, no engine dependency. Runs in node.
   Gate: gates/world_resolve_gate.js
   ========================================================================== */
(function (root) {
  'use strict';

  /* The world's systems, by name. These are MECHANISM (which parts of the world
     answer a spent moment at all), not CONTENT (how much, how often, at which
     moments). Order here is documentation only — the resolver orders by PHASE. */
  var SYSTEMS = [
    { id: 'day',        phase: 'WORLD',
      about: 'accrues spent time and rolls the day over when enough has accrued' },
    { id: 'economy',    phase: 'WORLD',
      about: 'advances the ledger when the day has moved under it' },
    { id: 'faction',    phase: 'PLACES',
      about: 'the faction beat — DEFAULT OFF, fires only on a caller-supplied beat' },
    { id: 'encounters', phase: 'PEOPLE',
      about: 'the ambient encounter director; registers only once a director exists' }
  ];

  var NO_RULING = 'NO_RULING';

  function systemById(id) {
    for (var i = 0; i < SYSTEMS.length; i++) if (SYSTEMS[i].id === id) return SYSTEMS[i];
    return null;
  }

  /* How much this moment moves a system that is sensitive at `perUnit`. Returns
     null when either half is unruled, and null is what makes a step report
     NO_RULING instead of inventing a zero that looks like a decision. */
  function amountFor(moment, perUnit) {
    if (perUnit === null || perUnit === undefined) return null;
    var spends = moment ? moment.spends : null;
    if (spends === null || spends === undefined) return null;
    return spends * perUnit;
  }

  /* --------------------------------------------------------------------------
     attach(resolver, wiring)

     resolver : one made by BOH_RESOLVE.makeResolver({moments: [...]}) — the
                caller's, with the caller's declared moments.
     wiring   : { <systemId>: { moments, perUnit, ...system-specific } }
                Every field is optional and every default is "unruled". A system
                absent from the wiring is NOT REGISTERED AT ALL, which is how
                `encounters` stays off the board until the director lands.

     Common per-system fields:
       moments  : the moment names this system answers. Omitted => every moment,
                  which is bohemia_resolve.js's own documented default.
       perUnit  : how much this system moves per unit of a moment's `spends`.
                  Omitted => the system reports NO_RULING and changes nothing.

     Returns { registered: [id...], skipped: [{id, reason}...] }.
     ------------------------------------------------------------------------ */
  function attach(resolver, wiring) {
    if (!resolver || typeof resolver.register !== 'function') {
      throw new Error('world-resolve: attach needs a resolver from makeResolver()');
    }
    wiring = wiring || {};
    var registered = [], skipped = [];

    Object.keys(wiring).forEach(function (id) {
      if (!systemById(id)) throw new Error('world-resolve: unknown world system "' + id + '"');
    });

    function opts(w) {
      // only pass `moments` through when the caller actually named some: passing
      // an empty list would mean "answers nothing", which is a different thing
      // from "answers everything" and is not what an omission means
      return (w && w.moments && w.moments.length) ? { moments: w.moments } : undefined;
    }

    // ---- WORLD / day --------------------------------------------------------
    /* Time accrues; when the accrual reaches the length of a day, the day rolls.
       BOTH numbers are the caller's: `perUnit` is how much of a day a unit of
       spend is worth, and there is no default length of a day in here. */
    if (wiring.day) {
      var dw = wiring.day;
      resolver.register('day', 'WORLD', function (ctx, moment) {
        var amount = amountFor(moment, dw.perUnit);
        if (amount === null) return { applied: false, reason: NO_RULING, system: 'day' };
        ctx.clock = ctx.clock || { day: (ctx.day || 0), accrued: 0 };
        ctx.clock.accrued += amount;
        /* TOLERANCE, and it is not a fudge. Ten spends of 0.1 sum to
           0.9999999999999999 in binary floating point, so a strict `>= 1` eats one
           moment in every ten and the player eats ten meals and the day never
           turns. The tolerance is far below any size Paolo could rule and far
           above the drift, and the remainder is clamped so it can never go
           negative and steal from the next day. */
        var EPS = 1e-9;
        var rolled = 0;
        while (ctx.clock.accrued >= 1 - EPS) { ctx.clock.accrued -= 1; rolled++; }
        if (ctx.clock.accrued < 0) ctx.clock.accrued = 0;
        ctx.clock.day += rolled;
        ctx.day = ctx.clock.day;
        return { applied: true, system: 'day', spent: amount,
                 rolled: rolled, day: ctx.clock.day, accrued: ctx.clock.accrued };
      }, opts(dw));
      registered.push('day');
    } else skipped.push({ id: 'day', reason: 'not wired' });

    // ---- WORLD / economy ----------------------------------------------------
    /* Reads the DAY off ctx rather than being told by the day step, because a
       step may not read another step's report. It advances once per day that has
       passed under it, so a moment too small to roll a day moves nothing — which
       is the "a meal moves the world a little" half working correctly. */
    if (wiring.economy) {
      var ew = wiring.economy;
      resolver.register('economy', 'WORLD', function (ctx, moment) {
        if (typeof ew.advanceDay !== 'function' || !ew.ledger) {
          return { applied: false, reason: NO_RULING, system: 'economy' };
        }
        var seen = (ctx.__econDay === undefined) ? (ctx.day || 0) : ctx.__econDay;
        var now = ctx.day || 0;
        var days = now - seen;
        ctx.__econDay = now;
        if (days <= 0) return { applied: false, reason: 'NO_DAY_PASSED', system: 'economy', day: now };
        for (var d = 0; d < days; d++) ew.advanceDay(ew.ledger, ew.agents || null);
        return { applied: true, system: 'economy', days: days, day: now };
      }, opts(ew));
      registered.push('economy');
    } else skipped.push({ id: 'economy', reason: 'not wired' });

    // ---- PLACES / faction ---------------------------------------------------
    /* DEFAULT OFF, and structurally so. `beat` is a caller-supplied predicate;
       with none, this step can only ever report NO_RULING. That is the 7/24
       pacing ruling held in code instead of in a comment. */
    if (wiring.faction) {
      var fw = wiring.faction;
      resolver.register('faction', 'PLACES', function (ctx, moment) {
        if (typeof fw.beat !== 'function') {
          return { applied: false, reason: NO_RULING, system: 'faction', pacing: 'DEFAULT_OFF' };
        }
        if (!fw.beat(ctx, moment)) {
          return { applied: false, reason: 'NO_BEAT', system: 'faction' };
        }
        if (typeof fw.advance !== 'function') {
          return { applied: false, reason: NO_RULING, system: 'faction' };
        }
        var moves = fw.advance(ctx, moment);
        return { applied: true, system: 'faction',
                 moves: Array.isArray(moves) ? moves.length : 0, detail: moves || null };
      }, opts(fw));
      registered.push('faction');
    } else skipped.push({ id: 'faction', reason: 'not wired (faction beats are DEFAULT OFF)' });

    // ---- PEOPLE / encounters ------------------------------------------------
    /* The ambient encounter director is APPROVED but not built (WORLD backlog
       item 2). This is its socket and nothing more: with no director supplied the
       system is not registered at all, so the moment does not carry a step that
       pretends to exist. */
    if (wiring.encounters) {
      var nw = wiring.encounters;
      if (typeof nw.director !== 'function') {
        skipped.push({ id: 'encounters', reason: 'no director yet' });
      } else {
        resolver.register('encounters', 'PEOPLE', function (ctx, moment) {
          var budget = amountFor(moment, nw.perUnit);
          if (budget === null) return { applied: false, reason: NO_RULING, system: 'encounters' };
          var out = nw.director(ctx, moment, budget);
          return { applied: true, system: 'encounters', budget: budget,
                   spawned: (out && out.length) || 0, detail: out || null };
        }, opts(nw));
        registered.push('encounters');
      }
    } else skipped.push({ id: 'encounters', reason: 'not wired (director has not landed)' });

    return { registered: registered, skipped: skipped };
  }

  /* Every system, whether it is wired or not — so a caller (or a gate, or the
     handoff) can ask what the world is capable of answering without guessing. */
  function systems() {
    return SYSTEMS.map(function (s) { return { id: s.id, phase: s.phase, about: s.about }; });
  }

  /* Which systems ran, which reported an unruled table, and which failed. The
     honest summary of a spent moment: an unruled world reads as unruled. */
  function summarize(result) {
    var applied = [], unruled = [], idle = [];
    Object.keys(result.reports || {}).forEach(function (name) {
      var r = result.reports[name];
      if (!r) return;
      if (r.applied) applied.push(name);
      else if (r.reason === NO_RULING) unruled.push(name);
      else idle.push(name);
    });
    return { moment: result.moment, spends: result.spends,
             applied: applied, unruled: unruled, idle: idle,
             failures: (result.failures || []).map(function (f) { return f.step; }),
             ok: !!result.ok };
  }

  var API = { attach: attach, systems: systems, summarize: summarize,
              amountFor: amountFor, NO_RULING: NO_RULING,
              SYSTEM_IDS: SYSTEMS.map(function (s) { return s.id; }) };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaWorldResolve = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
