/* ==== __WHAT_LIVES_ON_THE_MAP_HAS_A_CAP__ (WORLD 12, 11/7/26; VAMILY rule 431(b), ask line 511) ====
   PAOLO 11/7: 'there's too many vultures on screen on the map. They don't even look like vultures... you didn't even put any sort of
   checker... this shit is nonstop'. Rule 431(b): no ambient thing (birds, smoke, specks, critters) on the map without a cap on how
   many show at once and how often, held by a gate with a planted flood.
   THE ONE PLACE THE CAP LIVES: every thing that moves on the map on its own (not a town, a party, a job or his crew: those are game
   objects with their own counts) asks here before it draws:
     BohemiaAmbient.frame(kind)        at the start of that drawer's pass (its count back to nought)
     BohemiaAmbient.allow(kind, want)  how many of 'want' may show now (0 when the kind is not in the table: no table row, no show)
     BohemiaAmbient.appear(kind)       a thing that comes and goes (a rise off a kill): true if the minute's allowance has room
   The numbers are records/target/bb/map_ambient.json (the mods law); the defaults below are the same, so the cap holds before the
   file has come in. Gate: gates/the_map_lives_under_a_cap_gate.js (with a planted flood). ==== */
(function (root) {
  'use strict';
  var DEF = {
    vulture: { at_once: 0, per_minute: 0 },        /* rule 431(a)(f): off the map, every one; the vulture is a beast you fight now, never a map sign */
    lair_birds: { at_once: 0, per_minute: 0 },     /* the three birds that circled every lair: a map sign, dropped with the vultures (431(f)) */
    camp_smoke: { at_once: 5, persistent: true },  /* the camps' smoke columns, the nearest five to the middle of the glass */
    mast_light: { at_once: 6, persistent: true },  /* a mast's red light, blinking on the beat */
    camp_embers: { at_once: 7, persistent: true }, /* his own fire's embers while he makes camp (three beats) */
    kill_rise: { at_once: 2, per_minute: 20 }      /* the meat and the hide rising off a kill he tapped */
  };
  var T = null, NOW = {}, PEAK = {}, MIN = {}, REFUSED = {}, ASKED = {};
  try { fetch('../records/target/bb/map_ambient.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) { if (j && j.kinds) T = j.kinds; }).catch(function () {}); } catch (e) {}
  function row(kind) { var t = T || DEF, r = t[kind]; return r && typeof r === 'object' ? r : null; }
  function cap(kind) { var r = row(kind); return r ? Math.max(0, r.at_once | 0) : 0; }
  function frame(kind) { NOW[kind] = 0; }
  function allow(kind, want) {
    want = Math.max(0, want == null ? 1 : want | 0); ASKED[kind] = (ASKED[kind] | 0) + want;
    var n = NOW[kind] | 0, room = Math.max(0, cap(kind) - n), ok = Math.min(want, room);
    NOW[kind] = n + ok; if (NOW[kind] > (PEAK[kind] | 0)) PEAK[kind] = NOW[kind];
    if (want > ok) REFUSED[kind] = (REFUSED[kind] | 0) + (want - ok);
    return ok;
  }
  function appear(kind) {
    var r = row(kind); if (!r) { REFUSED[kind] = (REFUSED[kind] | 0) + 1; return false; }
    if (r.persistent) return true;
    var t = Date.now(), L = MIN[kind] = (MIN[kind] || []).filter(function (x) { return t - x < 60000; });
    if (L.length >= Math.max(0, r.per_minute | 0)) { REFUSED[kind] = (REFUSED[kind] | 0) + 1; return false; }
    L.push(t); return true;
  }
  function stats() {
    var out = {}, t = T || DEF, now = Date.now();
    Object.keys(t).forEach(function (k) { if (k.charAt(0) === '_') return; out[k] = { cap: cap(k), per_minute: t[k].persistent ? null : (t[k].per_minute | 0), now: NOW[k] | 0, peak: PEAK[k] | 0,
      minute: (MIN[k] || []).filter(function (x) { return now - x < 60000; }).length, refused: REFUSED[k] | 0, asked: ASKED[k] | 0 }; });
    Object.keys(ASKED).forEach(function (k) { if (!out[k]) out[k] = { cap: 0, unlisted: true, now: NOW[k] | 0, peak: PEAK[k] | 0, refused: REFUSED[k] | 0, asked: ASKED[k] | 0 }; });
    return out;
  }
  function reset() { NOW = {}; PEAK = {}; MIN = {}; REFUSED = {}; ASKED = {}; }
  root.BohemiaAmbient = { frame: frame, allow: allow, appear: appear, cap: cap, stats: stats, reset: reset, table: function () { return T || DEF; }, loaded: function () { return !!T; } };
})(typeof window !== 'undefined' ? window : this);
