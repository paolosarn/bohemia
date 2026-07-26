/* ============================================================================
   BOHEMIA — RESOLVE / RATION / CEILING / REACH   (bohemia_resolve.js, 7/26/26)

   THE FIRST PORT OUT OF THE REFERENCE LAB. Paolo, after playing LAB-03:
   "Did you learn anything. Anything we can throw in the bohemia code right now?"

   Four mechanisms, learned by rebuilding Stardew's fishing, farming and
   marriage from its own source and then standing them in one walkable world.
   Read the two records before changing anything here:
     records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt
     records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md
   Law: laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md
   Gate: gates/resolve_gate.js

   THIS FILE IS MECHANISM ONLY. Every table in it is EMPTY until Paolo rules
   the contents (MECHANISM-MINE / CONTENTS-PAOLO'S). It declares no action
   costs, no faction thresholds, no ration limits and no reach number for any
   real Bohemia system: callers pass those in, and the day a caller wants a
   default, that default is a ruling and not a line of code I get to write.

   HEADLESS. No DOM, no engine dependency, no clock of its own. Runs in node.

   ----------------------------------------------------------------------------
   1. RESOLVE — ONE MOMENT, MANY SYSTEMS, ZERO COUPLING
   AMENDED 7/26 by Paolo, same turn it shipped: "sleep can be hangout or eat too
   u know". So a MOMENT is ANY BLOCK OF TIME THE PLAYER SPENDS, and sleep is only
   the biggest one. Law: laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md
   A moment carries a SIZE, a system declares WHICH moments it answers, and the
   names and sizes are canon and therefore his: this file ships none.
   ----------------------------------------------------------------------------
   The finding: in the emulation, fishing, farming and courtship never touch
   each other. They share exactly ONE thing, the day rollover. Sleep, and the
   crops advance or stall, the soil dries, her friendship decays if you did not
   say hello, the wedding counts down, the schedule resets. Three systems, one
   integration point, and not one of them knows the others exist.

   That is what this registry is. Not an event bus, not a pub/sub graph: an
   ORDERED LIST OF PURE STEPS run at one named moment. A step gets the context
   and returns a small report. A step cannot see another step's report, cannot
   register another step mid-resolve, and cannot reorder itself. If a step
   throws, the moment still completes and the failure is reported by name,
   because one bad system must never eat the player's night.

   It lands directly on TIME IS SPENT BY ACTIONS (Paolo 7/26): the biggest
   chunk of time the player can spend is a night, and it is the one that
   changes the most.

   ----------------------------------------------------------------------------
   2. RATION — LIMIT BY COUNT, NEVER BY PRICE
   ----------------------------------------------------------------------------
   The finding: Stardew's gifts are capped at one a day and two a week, and
   birthdays bypass both AND pay 8x. The limit is a COUNT, not a cost. A priced
   limit stops mattering the moment the player is rich; a rationed one never
   stops mattering. For a game about clout and favours in a dead city, that is
   the more useful shape by a mile.

   ----------------------------------------------------------------------------
   3. CEILING — A CAP THAT ONLY MOVES ON A COMMITMENT
   ----------------------------------------------------------------------------
   The finding: Utility.GetMaximumHeartsForCharacter returns EIGHT for a
   datable villager you are not dating, and the point clamp is
   (maxHearts + 1) * 250 - 1. So an undated love interest hard-caps at 2249 and
   no amount of gifting moves it. You cannot grind past a relationship; you have
   to ACT. Accept the bouquet and the ceiling becomes 10 hearts. Marry and it
   becomes 14. And neglect gets MORE expensive as you get closer: -2 a stranger,
   -8 dating, -20 a spouse.

   Progress gates are STATE CHANGES, not point totals. That is the shape our
   faction standing wants: you reach the wall by doing jobs, and you only get
   past it by taking a side.

   ----------------------------------------------------------------------------
   4. REACH — FORGIVENESS IS A NUMBER, AND IT IS SMALL
   ----------------------------------------------------------------------------
   The finding: the moment a mechanic lives in a place it needs an answer to
   "how close is close enough", and three ad-hoc answers is three bugs. One
   declared number, one facing rule, one predicate. Same lesson as the fishing
   tolerance (a 28-unit fish in a 96-unit bar) and the corner slip (a nudge of
   an eighth of your walk speed): the slack is small, explicit, and never zero.
   ========================================================================== */
const BOH_RESOLVE = (function () {
  'use strict';

  /* ==========================================================================
     1. RESOLVE
     ========================================================================== */

  /* Order is DECLARED, never inferred from registration order, because
     registration order is whatever the boot sequence happened to be that day
     and that is not authority. A step whose phase is not in this list is a
     build error, not a step that quietly runs last. */
  const PHASES = ['WORLD', 'PLACES', 'PEOPLE', 'BOOKS', 'FEED'];

  function makeResolver(config) {
    const steps = [];          /* { name, phase, fn, moments } */
    let running = false;

    /* THE MOMENTS ARE THE CALLER'S. A night, a hangout, a meal: all the same
       mechanism at different sizes. This file ships no names and no sizes,
       because both are canon (Paolo 7/26). Declare none and the resolver accepts
       any moment name and no step may subscribe to one — that is a legal, and
       deliberately weaker, way to use it. */
    const declared = (config && Array.isArray(config.moments)) ? config.moments.map(m => {
      if (typeof m === 'string') return { name: m, spends: null };
      if (!m || typeof m.name !== 'string') throw new Error('resolve: a moment needs a name');
      return { name: m.name, spends: (m.spends !== undefined ? m.spends : null) };
    }) : null;
    if (declared && !declared.length) throw new Error('resolve: declare at least one moment, or none at all');
    const momentNames = declared ? declared.map(m => m.name) : null;
    function momentDef(name) {
      if (!declared) return { name: name, spends: null };
      for (let i = 0; i < declared.length; i++) if (declared[i].name === name) return declared[i];
      throw new Error('resolve: undeclared moment "' + name + '"');
    }

    function register(name, phase, fn, opts) {
      if (typeof name !== 'string' || !name) throw new Error('resolve: a step needs a name');
      if (PHASES.indexOf(phase) < 0) throw new Error('resolve: unknown phase "' + phase + '" for ' + name);
      if (typeof fn !== 'function') throw new Error('resolve: ' + name + ' needs a function');
      if (running) throw new Error('resolve: ' + name + ' tried to register DURING a resolve');
      if (steps.some(s => s.name === name)) throw new Error('resolve: duplicate step ' + name);
      let moments = null;
      if (opts && opts.moments) {
        if (!declared) throw new Error('resolve: ' + name + ' subscribes to moments but none were declared');
        moments = [].concat(opts.moments);
        moments.forEach(m => {
          if (momentNames.indexOf(m) < 0) throw new Error('resolve: ' + name + ' subscribes to undeclared moment "' + m + '"');
        });
      }
      /* a step that declares nothing answers EVERY moment. That is a real choice
         and it is the documented default, not an oversight. */
      steps.push({ name: name, phase: phase, fn: fn, moments: moments });
      return true;
    }

    function ordered(moment) {
      /* stable inside a phase: registration order breaks ties, and that is the
         only thing registration order is allowed to decide */
      const out = [];
      PHASES.forEach(p => steps.forEach(s => {
        if (s.phase !== p) return;
        if (moment && s.moments && s.moments.indexOf(moment) < 0) return;
        out.push(s);
      }));
      return out;
    }

    /* Run the moment. Every step gets the SAME ctx and the moment as its own
       frozen argument — never through ctx, and never another step's report, so
       no step can start depending on one. */
    function resolve(ctx, opts) {
      if (running) throw new Error('resolve: already resolving');
      const name = (opts && opts.moment) || null;
      if (declared && !name) throw new Error('resolve: this resolver has declared moments, so name the one you are spending');
      const def = momentDef(name || 'MOMENT');
      const moment = Object.freeze({ name: def.name, spends: def.spends });
      running = true;
      const reports = {}, failures = [];
      const list = ordered(declared ? moment.name : null);
      try {
        for (let i = 0; i < list.length; i++) {
          const s = list[i];
          try {
            const r = s.fn(ctx, moment);
            reports[s.name] = (r === undefined) ? null : r;
          } catch (e) {
            /* one bad system must never eat the block of time the player spent */
            failures.push({ step: s.name, error: String(e && e.message || e) });
            reports[s.name] = null;
          }
        }
      } finally { running = false; }
      return {
        moment: moment.name,
        spends: moment.spends,
        order: list.map(s => s.name),
        reports: reports,
        failures: failures,
        ok: failures.length === 0
      };
    }

    return { register, resolve, ordered, PHASES: PHASES.slice(),
             moments: momentNames ? momentNames.slice() : null,
             get count() { return steps.length; } };
  }

  /* ==========================================================================
     2. RATION
     ========================================================================== */

  /* A ration is a COUNT per window, not a cost. `limits` is {perDay, perWeek},
     either optional; a missing limit is unlimited on that window (which is a
     real choice a caller can make, not a default I invented).

     `bypass` is the birthday shape: a caller-supplied predicate that, when
     true, ignores BOTH windows and may carry a multiplier. Nothing in here
     knows what a birthday is or what an occasion is worth. */
  function makeRation(limits) {
    const perDay = (limits && limits.perDay != null) ? limits.perDay : Infinity;
    const perWeek = (limits && limits.perWeek != null) ? limits.perWeek : Infinity;
    if (perDay < 0 || perWeek < 0) throw new Error('ration: a limit cannot be negative');
    const state = {};          /* key -> { day, week, dayStamp, weekStamp } */

    function slot(key) {
      if (!state[key]) state[key] = { day: 0, week: 0, dayStamp: null, weekStamp: null };
      return state[key];
    }
    /* The caller owns the calendar. It hands us its own day and week stamps, so
       this file never decides how long a Bohemia week is. */
    function sync(s, dayStamp, weekStamp) {
      if (dayStamp !== undefined && s.dayStamp !== dayStamp) { s.dayStamp = dayStamp; s.day = 0; }
      if (weekStamp !== undefined && s.weekStamp !== weekStamp) { s.weekStamp = weekStamp; s.week = 0; }
    }

    function check(key, when, bypass) {
      const s = slot(key);
      sync(s, when && when.day, when && when.week);
      if (bypass && bypass.allow) {
        return { allowed: true, reason: 'BYPASS', multiplier: (bypass.multiplier != null ? bypass.multiplier : 1),
                 dayLeft: Math.max(0, perDay - s.day), weekLeft: Math.max(0, perWeek - s.week) };
      }
      if (s.day >= perDay) return { allowed: false, reason: 'DAY_SPENT', multiplier: 0, dayLeft: 0, weekLeft: Math.max(0, perWeek - s.week) };
      if (s.week >= perWeek) return { allowed: false, reason: 'WEEK_SPENT', multiplier: 0, dayLeft: Math.max(0, perDay - s.day), weekLeft: 0 };
      return { allowed: true, reason: 'OK', multiplier: 1,
               dayLeft: perDay - s.day, weekLeft: perWeek - s.week };
    }

    /* spend() is check() plus the bookkeeping, so a caller cannot forget the
       second half and quietly get an unlimited ration. */
    function spend(key, when, bypass) {
      const r = check(key, when, bypass);
      if (!r.allowed) return r;
      const s = slot(key);
      s.day += 1; s.week += 1;
      return { allowed: true, reason: r.reason, multiplier: r.multiplier,
               dayLeft: Math.max(0, perDay - s.day), weekLeft: Math.max(0, perWeek - s.week) };
    }
    function left(key, when) {
      const s = slot(key); sync(s, when && when.day, when && when.week);
      return { dayLeft: Math.max(0, perDay - s.day), weekLeft: Math.max(0, perWeek - s.week) };
    }
    return { check, spend, left, limits: { perDay, perWeek } };
  }

  /* ==========================================================================
     3. CEILING
     ========================================================================== */

  /* `stages` is an ORDERED list of {state, ceiling, neglect}. The state names,
     the ceilings and the neglect costs are all the CALLER's: this file only
     enforces the three properties the lab measured.
       - the ceiling belongs to the CURRENT state, so points cannot pass it
       - the only way up is a STATE CHANGE (advance), never more points
       - neglect is allowed to grow with the state, and the ceiling check does
         not care whether it does */
  function makeCeiling(stages) {
    if (!Array.isArray(stages) || !stages.length) throw new Error('ceiling: needs at least one stage');
    stages.forEach((s, i) => {
      if (!s || typeof s.state !== 'string') throw new Error('ceiling: stage ' + i + ' needs a state name');
      if (typeof s.ceiling !== 'number' || s.ceiling < 0) throw new Error('ceiling: ' + s.state + ' needs a ceiling');
    });
    for (let i = 1; i < stages.length; i++) {
      if (stages[i].ceiling < stages[i - 1].ceiling) {
        throw new Error('ceiling: ' + stages[i].state + ' lowers the ceiling below ' + stages[i - 1].state);
      }
    }
    function indexOf(state) {
      for (let i = 0; i < stages.length; i++) if (stages[i].state === state) return i;
      return -1;
    }
    function stageOf(state) {
      const i = indexOf(state);
      if (i < 0) throw new Error('ceiling: unknown state ' + state);
      return stages[i];
    }
    function ceilingFor(state) { return stageOf(state).ceiling; }
    function neglectFor(state) { const s = stageOf(state); return s.neglect != null ? s.neglect : 0; }
    /* the clamp IS the wall: gifting, grinding, favours, anything additive */
    function add(state, points, amount) {
      const cap = ceilingFor(state);
      const before = Math.max(0, Math.min(points, cap));
      const after = Math.max(0, Math.min(before + amount, cap));
      return { points: after, gained: after - before, capped: (before + amount) > cap, ceiling: cap };
    }
    /* the only way the ceiling moves. `gate` is the caller's requirement to be
       allowed to take the step: a point threshold, an item, a ruling, whatever.
       This file does not decide what earns a commitment. */
    function advance(state, points, gate) {
      const i = indexOf(state);
      if (i < 0) throw new Error('ceiling: unknown state ' + state);
      if (i === stages.length - 1) return { state: state, moved: false, reason: 'FINAL', ceiling: ceilingFor(state) };
      if (gate && gate.requiredPoints != null && points < gate.requiredPoints) {
        return { state: state, moved: false, reason: 'NOT_EARNED', need: gate.requiredPoints, have: points, ceiling: ceilingFor(state) };
      }
      if (gate && gate.allow === false) {
        return { state: state, moved: false, reason: 'REFUSED', ceiling: ceilingFor(state) };
      }
      const next = stages[i + 1];
      return { state: next.state, moved: true, reason: 'COMMITTED', ceiling: next.ceiling, neglect: neglectFor(next.state) };
    }
    function isWalled(state, points) { return points >= ceilingFor(state); }
    return { ceilingFor, neglectFor, add, advance, isWalled,
             states: stages.map(s => s.state) };
  }

  /* ==========================================================================
     4. REACH
     ========================================================================== */

  /* ONE declared number per surface, passed in, never defaulted here. The
     facing rule is the emulation's: the tile you FACE is the tile you act on,
     and a body within `tiles` of you in manhattan distance is in reach. */
  const DIRS = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };
  function facingTile(x, y, facing) {
    if (facing === DIRS.UP) return { x: x, y: y - 1 };
    if (facing === DIRS.RIGHT) return { x: x + 1, y: y };
    if (facing === DIRS.DOWN) return { x: x, y: y + 1 };
    if (facing === DIRS.LEFT) return { x: x - 1, y: y };
    throw new Error('reach: facing must be 0-3');
  }
  function makeReach(tiles) {
    if (typeof tiles !== 'number' || tiles < 0) throw new Error('reach: needs a declared tile count');
    function inReach(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) <= tiles; }
    /* the honest version of "am I standing in front of it": the faced tile, or
       anything inside the declared slack. One predicate, used everywhere. */
    function canAct(from, facing, target) {
      const f = facingTile(from.x, from.y, facing);
      if (f.x === target.x && f.y === target.y) return true;
      return inReach(from, target);
    }
    return { tiles, inReach, canAct, facingTile, DIRS };
  }

  return {
    PHASES, makeResolver, makeRation, makeCeiling, makeReach, facingTile, DIRS,
    /* provenance, so nobody has to guess where these shapes came from */
    LEARNED_FROM: {
      resolve: 'LAB-03: three mechanics, one rollover, zero coupling; a moment is ANY spent block (Paolo 7/26: sleep can be hangout or eat too)',
      ration:  'LAB-02: gifts limited by count (1/day, 2/week), not by price',
      ceiling: 'LAB-02: Utility.cs:2901 — undated caps at 8 hearts, only a commitment moves it',
      reach:   'LAB-03: forgiveness is one declared number, and it is small'
    }
  };
})();
if (typeof module !== 'undefined') module.exports = BOH_RESOLVE;
