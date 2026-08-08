// BOHEMIA BROWNOUTS AND BLACKOUTS (8/8/26) — the grid stops being a constant.
//
// GDD v3, LOCKED, and in nobody's queue until the 8/4 mechanics routing found it:
// act-1-frequent power instability. It composes with three things this lane already owns —
// CLUSTERED POWER (12% of circuits live, every live circuit OWNED), LIGHT = TERRITORY, and
// the daycycle — and it changes what all three MEAN, because until now the grid was a
// constant. bohemia_powergrid.js answers at(x,y) with the same thing forever. A valley
// where the lit 12% never flickers is a valley where territory never has a bad night.
//
// WHAT THIS ADDS: a TIME axis on the grid, and nothing else. It does not decide who owns
// what, it does not move territory, and it does not touch the light pass. It answers one
// new question: IS THIS CIRCUIT UP RIGHT NOW.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, and this file is the strict form of it. EVERY NUMBER
// THAT WOULD MAKE THIS A DESIGN IS ABSENT: how often the grid fails, how long an outage
// lasts, how wide it spreads, whether act 1 is worse than act 3. All of it is his. With no
// dial set this module RUNS, CHANGES NOTHING, and reports NO_RULING BY NAME — the same
// contract bohemia_world_resolve.js uses, because a zero that looks like a decision is the
// thing that gets built on by accident.
//
// DETERMINISM: no Date, no Math.random. An outage is a pure function of (seed, day, turn),
// so the same valley on the same day fails the same way for everybody, and a save that
// reloads mid-blackout is still mid-blackout.
(function(root){
  var HAS = (typeof module !== 'undefined');
  var NO_RULING = 'NO_RULING';

  function hash(a, b, c){
    var h = (a >>> 0) ^ 0x9E3779B1;
    h = Math.imul(h ^ ((b >>> 0) + 0x85EBCA6B), 0x27D4EB2D) >>> 0;
    h = Math.imul(h ^ ((c >>> 0) + 0xC2B2AE35), 0x165667B1) >>> 0;
    return (h ^ (h >>> 15)) >>> 0;
  }
  function unit(a, b, c){ return hash(a, b, c) / 4294967296; }

  /* THE DIALS. Every one of them is HIS, and every one is null until he rules it.
   *
   *   failuresPerDay   how many outages the valley has in a day
   *   brownoutShare    of those, how many are brownouts rather than full blackouts
   *   turnsBrownout    how long a brownout holds
   *   turnsBlackout    how long a blackout holds
   *   scopeShare       how much of the grid one event takes with it
   *
   * They are NOT given defaults. A default here would be me designing the pace of the
   * apocalypse, which is the whole of what he reserved. Missing dial => NO_RULING. */
  var DIALS = {
    failuresPerDay: null,
    brownoutShare:  null,
    turnsBrownout:  null,
    turnsBlackout:  null,
    scopeShare:     null
  };
  function dials(){ var o = {}; for (var k in DIALS) o[k] = DIALS[k]; return o; }
  function unruled(over){
    var miss = [], k;
    for (k in DIALS) if ((over && over[k] != null ? over[k] : DIALS[k]) == null) miss.push(k);
    return miss;
  }

  /* THE DAY'S SCHEDULE. Deterministic per (seed, day). With no dials it is EMPTY and says
   * why -- it does not return one outage "just so something happens". */
  function scheduleFor(seed, day, over){
    var miss = unruled(over);
    if (miss.length) return { day: day, events: [], applied: false, reason: NO_RULING, unruled: miss };
    var D = {}, k;
    for (k in DIALS) D[k] = (over && over[k] != null) ? over[k] : DIALS[k];

    var n = Math.max(0, Math.round(D.failuresPerDay));
    var events = [];
    for (var i = 0; i < n; i++) {
      var brown = unit(seed, day, 1000 + i) < D.brownoutShare;
      var turns = Math.max(1, Math.round(brown ? D.turnsBrownout : D.turnsBlackout));
      events.push({
        kind: brown ? 'brownout' : 'blackout',
        // the turn it starts is spread across the day rather than bunched at dawn
        startTurn: Math.floor(unit(seed, day, 2000 + i) * 24),
        turns: turns,
        // WHICH circuits go is a share of the grid, resolved against the circuit's own
        // stable key -- so the same circuits fail together, the way a real feeder does.
        share: brown ? D.scopeShare : Math.min(1, D.scopeShare * 2),
        salt: 3000 + i
      });
    }
    events.sort(function(a, b){ return a.startTurn - b.startTurn; });
    return { day: day, events: events, applied: true, reason: null, unruled: [] };
  }

  /* WHAT IS DOWN AT THIS MOMENT. An event covers a turn if the turn is inside its window. */
  function activeAt(seed, day, turn, over){
    var s = scheduleFor(seed, day, over);
    if (!s.applied) return { active: [], applied: false, reason: s.reason, unruled: s.unruled };
    var out = [];
    for (var i = 0; i < s.events.length; i++) {
      var e = s.events[i];
      if (turn >= e.startTurn && turn < e.startTurn + e.turns) out.push(e);
    }
    return { active: out, applied: true, reason: null, unruled: [] };
  }

  /* THE GRID, SEEN THROUGH THE OUTAGE. Wraps a bohemia_powergrid powerMap and returns the
   * SAME shape -- at(x,y) -> {live, owner} -- so every existing consumer keeps working and
   * simply sees a darker valley during an event. It never invents light: a circuit that was
   * already dead stays dead, and an outage can only ever take live circuits DOWN.
   *
   * A BROWNOUT IS NOT A SMALL BLACKOUT. A browned-out circuit is still ENERGISED and still
   * OWNED -- the lights are just too weak to hold territory. So it reports live:true with
   * dim:true, and LIGHT = TERRITORY consumers get to decide what a dim circuit is worth.
   * Collapsing it to "off" would have thrown away the entire distinction the GDD drew. */
  function through(powerMap, seed, day, turn, over){
    var a = activeAt(seed, day, turn, over);
    if (!a.applied) {
      return { applied: false, reason: a.reason, unruled: a.unruled,
               at: function(x, y){ return powerMap.at(x, y); },
               circuits: powerMap.circuits, liveCircuits: powerMap.liveCircuits, downed: 0, dimmed: 0 };
    }
    var ev = a.active;
    function hit(x, y){
      // a circuit's identity is its own coordinates; the same cells fail together every time
      for (var i = 0; i < ev.length; i++) {
        var e = ev[i];
        if (unit(seed ^ e.salt, x, y) < e.share) return e.kind;
      }
      return null;
    }
    var down = 0, dim = 0;
    return {
      applied: true, reason: null, unruled: [],
      circuits: powerMap.circuits, liveCircuits: powerMap.liveCircuits,
      events: ev,
      at: function(x, y){
        var base = powerMap.at(x, y);
        if (!base.live) return base;                       // already dark; an outage adds nothing
        var k = hit(x, y);
        if (k === 'blackout') return { live: false, owner: base.owner, out: 'blackout' };
        if (k === 'brownout') return { live: true, owner: base.owner, dim: true, out: 'brownout' };
        return base;
      },
      // a measured count over a cell list, for gates and readouts. Never estimated.
      measure: function(cells){
        down = 0; dim = 0;
        for (var i = 0; i < cells.length; i++) {
          var c = cells[i], b = powerMap.at(c[0], c[1]);
          if (!b.live) continue;
          var k = hit(c[0], c[1]);
          if (k === 'blackout') down++; else if (k === 'brownout') dim++;
        }
        return { down: down, dimmed: dim };
      }
    };
  }

  var API = { NO_RULING: NO_RULING, DIALS: DIALS, dials: dials, unruled: unruled,
              scheduleFor: scheduleFor, activeAt: activeAt, through: through };
  if (HAS) module.exports = API;
  root.BohemiaBrownout = API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
