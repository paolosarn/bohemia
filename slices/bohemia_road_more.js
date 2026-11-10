/* ==========================================================================
   __THE_ROAD_MORE__ (WORLD 14, 11/10; VAMILY rule 443(b), ask line 567; the overworld law,
   laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md: an event may stop the party on the road, a face with a portrait,
   two or three choices, never in the first minute, nothing pops up without a mouth)

   MEASURED FIRST (records/BOHEMIA_WORLD_14_EVENTS_ON_THE_ROAD_11_10_26.md): the road had 45 events (CONTENT 11/2-11/3), every one a
   STRANGER met on the road (Battle Brothers' location events). Battle Brothers' other kinds were missing: the COMPANY's own events (a
   man steals from the box, food spoils, two men fight, a man is called home) and the INJURY events; and no event could wound a man or
   open a place. And sideways on the phone every card cut its last choice (fixed in the card, __THE_CARD_SIDEWAYS__).

   THIS FILE is the other side of one seam in slices/bohemia_road_events.js (marked __THE_ROAD_MORE__). The events themselves are rows
   of records/target/BOHEMIA_ROAD_EVENTS.json like every other (the one file a modder edits); what they may now ask for:
     needs.crew  {n: 1 or 2, bg: [trades]}  one or two of HIS men (never YOU), by trade if given: {man}, {man_look}, {man_bg},
                 {other}, {other_look} (no digits: the road's word filler reads letters and _ only); the speaker can be his own man (who.name '{man}', who.look '{man_look}')
     needs.place {hidden: true}             a real place still under the fog (records/target/bb/real_places.json): {place},
                 {place_id}, {blocks} (how far, in blocks)
     fx.wound    {name, hp}                 the man loses that many hitpoints, kept by the company's own condition record
                                            (engine/bohemia_condition.js: the HEAL bar's numbers; the clock and the camp mend it)
     fx.leaves   {name}                     the man leaves the company, the one way a man goes (BohemiaHireLock.dismiss)
     fx.open     {id}                       the place's fog lifts (its block and the blocks round it) and it is named on the map
   Loaded by BOHEMIA_CITY_WORLD.html after bohemia_road_events.js.
     BohemiaRoadMore.ctx(needs)        the words a row asks for, or null (then the row is not a candidate)
     BohemiaRoadMore.apply(fx, ctx, out)  the three new consequences
     BohemiaRoadMore.men()             his men (not YOU): name, look, trade
     BohemiaRoadMore.status()          what was wounded, who left, what opened
   ========================================================================== */
(function (root) {
  'use strict';
  var RM = root.BohemiaRoadMore = { wounded: [], left: [], opened: [], err: null };
  function json(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function day() { try { return loopDay() | 0; } catch (e) { return 0; } }
  function at() { try { return [city.x | 0, city.y | 0]; } catch (e) { return [0, 0]; } }

  /* ---- HIS MEN: the hired, then the company he started with (never YOU), none gone, walked, taken or dead ---- */
  function goneSet() {
    var g = {};
    try { (crewWalked() || []).forEach(function (x) { if (x && x.name) g[x.name] = 1; }); } catch (e) {}
    try { (crewTaken() || []).forEach(function (n) { g[n] = 1; }); } catch (e) {}
    try { (crewDead() || []).forEach(function (n) { g[n] = 1; }); } catch (e) {}
    return g;
  }
  function men() {
    var g = goneSet(), seen = {}, out = [];
    (json('bohemia.hired.v1', []) || []).forEach(function (h) {
      if (!h || !h.name || h.dead || g[h.name] || seen[h.name]) return; seen[h.name] = 1;
      out.push({ name: String(h.name), look: h.look || null, bg: h.background || null, hp: (h.stats && +h.stats.hp) || null, hired: true });
    });
    try {
      var co = (LOOP.start && LOOP.start.company) || [], dm = (CREW_DEFS && CREW_DEFS.men) || [], dl = (CREW_DEFS && CREW_DEFS.looks) || [];
      var on = []; try { on = (typeof crewOriginNamed === 'function' && crewOriginNamed()) || []; } catch (e) { on = []; }
      for (var i = 1; i < co.length; i++) {   /* the crew's own naming (crewWhoWalks): never i 0, he is YOU */
        var nm = (on[i] && on[i].name) || (dm[i] && dm[i].name) || ('MAN ' + i);
        if (i >= dm.length && dm.length && !(on[i] && on[i].name)) nm = (dm[i % dm.length].name || 'MAN') + ' II';
        if (g[nm] || seen[nm]) continue; seen[nm] = 1;
        out.push({ name: String(nm), look: (on[i] && on[i].look) || dl[i] || null, bg: (co[i] && co[i].background) || (dm[i] && dm[i].background) || null,
          hp: (co[i] && co[i].stats && +co[i].stats.hp) || null, i: i });
      }
    } catch (e) { RM.err = String(e && e.message || e); }
    return out;
  }
  RM.men = men;
  function pick(list) { return list.length ? list[Math.floor(Math.random() * list.length)] : null; }

  /* ---- A REAL PLACE STILL UNDER THE FOG, the nearest first ---- */
  function hiddenPlaces() {
    var out = [], w = at(), R = root.BOH_REAL_PLACES, G = root.BOH_REGION;
    if (!R || !R.list || typeof root.fogHides !== 'function') return out;
    try { (R.cellsNow ? R.cellsNow() : []).forEach(function (c) { if (root.fogHides(c.x, c.y)) out.push({ id: c.id, name: c.name, x: c.x, y: c.y }); }); } catch (e) {}
    try { (R.list || []).forEach(function (p) { if (p.where !== 'region' || !G || !G.places) return; var q = G.places.filter(function (x) { return x.name === p.name; })[0];
      if (q && root.fogHides(q.x, q.y)) out.push({ id: p.id, name: p.name, x: q.x, y: q.y }); }); } catch (e) {}
    out.forEach(function (p) { p.d = Math.max(Math.abs(p.x - w[0]), Math.abs(p.y - w[1])); });
    out.sort(function (a, b) { return a.d - b.d; });
    return out;
  }
  RM.hidden = hiddenPlaces;

  RM.ctx = function (n) {
    n = n || {}; var c = {};
    if (n.crew) {
      var want = Math.max(1, n.crew.n | 0), bg = n.crew.bg ? [].concat(n.crew.bg) : null, all = men();
      var first = bg ? all.filter(function (m) { return bg.indexOf(m.bg) >= 0; }) : all;
      var a = pick(first); if (!a) return null;
      c.man = a.name; c.man_look = a.look || 'person_town_0'; c.man_bg = a.bg || '';
      if (want >= 2) { var b = pick(all.filter(function (m) { return m.name !== a.name; })); if (!b) return null; c.other = b.name; c.other_look = b.look || 'person_town_1'; }
    }
    if (n.place) { var h = hiddenPlaces(); if (!h.length) return null; var p = h[0]; c.place = p.name; c.place_id = p.id; c.blocks = String(Math.max(1, p.d)); }
    return c;
  };

  /* ---- THE THREE CONSEQUENCES ---- */
  function wound(name, hp) {
    var C = root.BohemiaCondition; if (!C || !C.get || !C.canon || !C.KEY) return 0;
    var k = C.canon(name); if (!k || k === 'YOU') return 0;
    var s = C.get(), m = s.men[k] || {}, me = men().filter(function (x) { return x.name === name; })[0] || {};
    var max = +m.hpMax > 0 ? +m.hpMax : (+me.hp > 0 ? +me.hp : ((C.RATE && +C.RATE.unknown_hp_max) || 55));
    var was = +m.lostHp || 0, now = Math.min(max - 1, was + Math.max(0, hp | 0));   /* a wound on the road never kills: he keeps one hitpoint */
    m.shown = m.shown || String(name); if (me.look && !m.look) m.look = me.look; m.hpMax = max; m.lostHp = now; m.day = day();
    m.roadWounds = (m.roadWounds | 0) + 1;
    s.men[k] = m;
    try { localStorage.setItem(C.KEY, JSON.stringify(s)); } catch (e) {}
    try { if (root.dispatchEvent && root.CustomEvent) root.dispatchEvent(new root.CustomEvent('bohemia:condition', { detail: null })); } catch (e) {}
    RM.wounded.push({ name: String(name), hp: now - was, of: max, day: day() });
    return now - was;
  }
  function leaves(name) {
    var me = men().filter(function (x) { return x.name === name; })[0]; if (!me) return false;
    try {
      if (root.BohemiaHireLock && root.BohemiaHireLock.dismiss) root.BohemiaHireLock.dismiss({ name: me.name, look: me.look || null, hired: !!me.hired, day: day() }, 'road');
      else { var w = json('bohemia.walked.v1', []) || []; w.push({ name: me.name, look: me.look || null, day: day(), dismissed: true, why: 'road' }); localStorage.setItem('bohemia.walked.v1', JSON.stringify(w)); }
    } catch (e) { RM.err = String(e && e.message || e); return false; }
    try { if (typeof updHud === 'function') updHud(); } catch (e) {}
    RM.left.push({ name: me.name, day: day() });
    return true;
  }
  function open(id) {
    var p = hiddenPlaces().filter(function (q) { return q.id === id; })[0]; if (!p) return null;
    try { if (typeof fogReveal === 'function') fogReveal(p.x, p.y, 3); } catch (e) { RM.err = String(e && e.message || e); }
    try { if (typeof render === 'function') render(); } catch (e) {}
    RM.opened.push({ id: p.id, name: p.name, x: p.x, y: p.y, day: day() });
    return p;
  }
  RM.wound = wound; RM.leaves = leaves; RM.open = open;
  RM.apply = function (fx, ctx, out) {
    out = out || { got: [] }; out.got = out.got || [];
    if (fx.wound && fx.wound.name) { var h = wound(fx.wound.name, fx.wound.hp | 0); if (h > 0) out.got.push(String(fx.wound.name).toUpperCase() + ' -' + h + ' HP'); }
    if (fx.leaves && fx.leaves.name) { if (leaves(fx.leaves.name)) out.got.push(String(fx.leaves.name).toUpperCase() + ' LEFT'); }
    if (fx.open && fx.open.id) { var p = open(fx.open.id); if (p) out.got.push(String(p.name).toUpperCase() + ' ON THE MAP'); }
    return out;
  };
  RM.status = function () { return { men: men().map(function (m) { return m.name + ':' + (m.bg || '-'); }), hidden: hiddenPlaces().length, wounded: RM.wounded.slice(-10), left: RM.left.slice(-10), opened: RM.opened.slice(-10), err: RM.err }; };
})(window);
