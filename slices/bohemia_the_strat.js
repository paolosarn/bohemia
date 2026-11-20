/* ==========================================================================
   __THE_STRAT_LOOKOUT__ (WORLD 14, 11/20; rule 461's sweep: 'the world: more places to arrive at'; rule 454(a): no line added;
   rule 441). The tower is on the map since Paolo 7/5 ('THE STRAT ... first thing in the arts district', engine/bohemia_overmap.js
   strat) and drawn as the needle; arriving there did nothing.

   REAL: the Strat (the Stratosphere, 2000 Las Vegas Blvd S) is the tallest free-standing observation tower in the United States,
   350 m, the pod at about 260 m; its stair race ('Scale the Strat') is 1,455 steps, 108 floors. With the power gone the elevators
   are dead: a crew climbs it, an hour and a half up and down with their gear. From the pod the whole valley lies open in the desert
   air; what a man can pick out in the dust of a dead city is a few miles.
   BATTLE BROTHERS FIRST: the high ground widens the company's sight (the billboards' rule, slices/bohemia_billboards.js); the Strat
   is the valley's highest ground.

   SO: when HE GOES THERE (he tapped the tower itself and the trip has ended at its foot: its block is a building, so a trip to it
   stops on the block beside it; a trip to anything else, the town beside it or the street past it, climbs nothing: nothing is
   forced), the crew climbs: 90 minutes on the clock (the map's own advance, the valley's parties move with it), and from the top:
     by day, the fog opens 30 blocks round the tower (about 11 km);
     by night, only the lights: every town within 40 blocks shows through the dark (rule 457: where the lights are on, people are).
   Once a day: a second trip there the same day climbs nothing more. The fog keeps what he saw. No words: the read is the map opening.
     BohemiaStrat.at()        the tower's block [x, y] on this valley, or null
     BohemiaStrat.status()    the last climb: {day, night, opened, mins}
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof root.loopArrived !== 'function' || typeof root.fogReveal !== 'function') return;
  var ST = root.BohemiaStrat = { on: true, CLIMB_MINS: 90, DAY_R: 30, NIGHT_R: 40, cell: null, seed: null, last: null, err: null, climbs: 0, goal: false };
  function valley() { return (typeof om !== 'undefined' && om && om.n && om.at) ? om : null; }
  ST.at = function () {
    var M = valley(); if (!M) return null;
    var seed = M.seed != null ? M.seed : 0;
    if (ST.seed === seed && ST.cell) return ST.cell;
    var c = null;
    for (var y = 0; y < M.n && !c; y++) for (var x = 0; x < M.n && !c; x++) { var t = M.at(x, y); if (t && t.district === 'strat') c = [x, y]; }
    ST.seed = seed; ST.cell = c; return c;
  };
  function dayNo() { try { return (typeof DAY !== 'undefined' && DAY.day) ? DAY.day : 0; } catch (e) { return 0; } }
  function night() { try { return !!root.isNight(); } catch (e) { return false; } }
  function seen(x, y) { try { return !!root.fogSeen(x, y); } catch (e) { return false; } }
  function towns() { var out = []; try { var bs = root.ctBases ? root.ctBases() : null; for (var n in (bs || {})) { var b = bs[n]; if (b) out.push([b.x | 0, b.y | 0]); } } catch (e) {} return out; }

  ST.climb = function () {
    var c = ST.at(); if (!c) return null;
    var d = dayNo(); if (ST.last === d) return null;
    try { root.advance(ST.CLIMB_MINS); } catch (e) { ST.err = String(e && e.message || e); }
    var n = night(), opened = 0;
    if (!n) {
      var R = ST.DAY_R;
      for (var y = c[1] - R; y <= c[1] + R; y++) for (var x = c[0] - R; x <= c[0] + R; x++) if (!seen(x, y) && Math.hypot(x - c[0], y - c[1]) <= R) opened++;
      root.fogReveal(c[0], c[1], R);
    } else {
      towns().forEach(function (t) { if (Math.max(Math.abs(t[0] - c[0]), Math.abs(t[1] - c[1])) <= ST.NIGHT_R) { if (!seen(t[0], t[1])) opened++; root.fogReveal(t[0], t[1], 1.6); } });
    }
    try { root.fogSave(); } catch (e) {}
    try { if (typeof FOG !== 'undefined') FOG.last = null; } catch (e) {}
    ST.last = dayNo(); ST.climbs++;
    ST.lastClimb = { day: ST.last, night: n, opened: opened, mins: ST.CLIMB_MINS };
    try { if (typeof root.render === 'function') root.render(); } catch (e) {}
    return ST.lastClimb;
  };
  /* WHAT HE TAPPED: the map's own travel (travelTo hands the tapped block, or finds it from the tap the map's own way) */
  if (typeof root.travelTo === 'function') {
    var _tt = root.travelTo;
    root.travelTo = function (sx, sy, cell) {
      var r = _tt.apply(this, arguments);
      try {
        var c = null; try { c = cell ? [cell[0] | 0, cell[1] | 0] : (typeof root.CBcellAt === 'function' ? root.CBcellAt(sx, sy) : null); } catch (e) { c = null; }
        var t = ST.at(); ST.goal = !!(r && c && t && c[0] === t[0] && c[1] === t[1]);
      } catch (e) { ST.goal = false; }
      return r;
    };
  }
  /* the trip has ended at the tower's foot and the tower was what he tapped: the crew goes up, then the map's own arrival (a town at
     the tower's foot still opens after; a fight that is already on is never climbed over) */
  var _arr = root.loopArrived;
  root.loopArrived = function (to, town) {
    var go = false;
    try {
      if (ST.on && ST.goal && !(typeof LOOP !== 'undefined' && LOOP.fighting) && !(typeof MODE !== 'undefined' && MODE !== 'city')) {
        var c = ST.at();
        go = !!(c && typeof city !== 'undefined' && Math.max(Math.abs((city.x | 0) - c[0]), Math.abs((city.y | 0) - c[1])) <= 1);
      }
    } catch (e) { ST.err = String(e && e.message || e); }
    ST.goal = false;
    if (go) { try { ST.climb(); } catch (e) { ST.err = String(e && e.message || e); } }
    return _arr.apply(this, arguments);
  };
  ST.status = function () { return { at: ST.at(), climbs: ST.climbs, last: ST.lastClimb || null, err: ST.err }; };
})(window);
