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
   11/11 (the coordinator's round, batch two): events that touch HIS PLACE, THE BOSSES and HIS JOBS
     needs.home  {planted: true} or {}      his place (HOME BASE): {home} (its name; YOUR CAMP before he plants), {home_blocks}
     needs.boss  {sign | found | fallen}    the next boss whose sign is up / a boss found and standing / a boss he put down:
                                            {boss}, {boss_place}, {boss_blocks}
     needs.job   {held: true}               a job he holds: {job} (its words), {job_from} (the client's town), {job_pay}
     fx.home     {kind, name, build|look|gives|says}   a gift to his place through HOME BASE's own seam (BohemiaHomeMap.give; before
                                            he plants it waits, the phone says so)
     fx.boss     {find: true}               the boss's sign read the sign's own way (BohemiaHisMap.readSign): found, his place out of the dark
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
    if (n.home) { var H = homeNow(); if (!H || (n.home.planted && !H.planted)) return null; c.home = H.name; c.home_blocks = String(H.blocks || 0); }
    if (n.boss) { var B = bossNow(n.boss); if (!B) return null; c.boss = B.name; c.boss_place = B.place; c.boss_blocks = String(B.blocks || 1); }
    if (n.job) { var J = jobNow(); if (!J) return null; c.job = J.title; c.job_from = J.from; c.job_pay = String(J.pay || 0); }
    return c;
  };
  /* ---- HIS PLACE (HOME BASE's state), THE BOSSES (the map's memory, the bosses' rows), HIS JOBS (the ones he holds) ---- */
  function homeNow() {
    var S = null; try { S = root.BohemiaHomeMap && root.BohemiaHomeMap.state ? root.BohemiaHomeMap.state() : null; } catch (e) { S = null; }
    if (!S) return null; var w = at();
    return { name: String(S.name || 'YOUR CAMP'), planted: !!S.planted, blocks: S.at ? Math.max(Math.abs(S.at[0] - w[0]), Math.abs(S.at[1] - w[1])) : null };
  }
  function bossRow(n) { try { var D = root.BohemiaBosses && root.BohemiaBosses.data ? root.BohemiaBosses.data() : null; return ((D && D.bosses) || []).filter(function (b) { return b && b.boss && b.boss.name === n; })[0] || null; } catch (e) { return null; } }
  function bossNow(want) {
    var h = null; try { h = root.BohemiaHisMap && root.BohemiaHisMap.state ? root.BohemiaHisMap.state() : null; } catch (e) { h = null; }
    if (!h || !h.boss) return null; var w = at(), n = null, x = null, y = null;
    var fallen = h.boss.fallen || {}, found = h.boss.found || {};
    if (want.sign) { var sg = h.boss.sign; if (!sg || fallen[sg.n] || found[sg.n]) return null; n = sg.n; x = sg.boss && sg.boss.x; y = sg.boss && sg.boss.y; }
    else if (want.found) { Object.keys(found).some(function (k) { if (fallen[k] || !found[k]) return false; n = k; x = found[k].x; y = found[k].y; return true; }); }
    else if (want.fallen) { Object.keys(fallen).some(function (k) { if (!fallen[k]) return false; n = k; var f = found[k] || {}; x = f.x; y = f.y; return true; }); }
    if (!n) return null; var r = bossRow(n);
    return { name: String(n), place: r && r.place && r.place.name ? String(r.place.name) : 'his place', blocks: x != null ? Math.max(1, Math.max(Math.abs(x - w[0]), Math.abs(y - w[1]))) : 1 };
  }
  function jobNow() {
    var L = []; try { L = (root.LOOP && root.LOOP.held) || []; } catch (e) { L = []; }
    var own = function (j) { try { return root.BohemiaJobKinds && root.BohemiaJobKinds.owns ? root.BohemiaJobKinds.owns(j) : true; } catch (e) { return true; } };
    var j = L.filter(function (q) { return q && q.title && q.from && own(q); })[0] || null;
    return j ? { title: String(j.title).replace(/\.$/, ''), from: String(j.from), pay: j.pay | 0, id: j.id } : null;
  }

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
  function gift(g, ctx) {
    var M = root.BohemiaHomeMap; if (!M || !M.give || !g || !g.kind || !g.name) return null;
    var o = { id: 'road:' + (ctx && ctx.id || 'road') + ':' + String(g.name).toLowerCase().replace(/[^a-z0-9]+/g, '_') + ':' + day(), kind: g.kind, name: String(g.name),
      from: String(g.from || (ctx && ctx.name) || 'THE ROAD') };
    ['build', 'look', 'gives', 'says', 'pic'].forEach(function (k) { if (g[k] != null) o[k] = g[k]; });
    var r = null; try { r = M.give(o); } catch (e) { RM.err = String(e && e.message || e); return null; }
    if (!r || !r.ok) return null;
    RM.gifts.push({ id: o.id, kind: o.kind, name: o.name, waiting: !!r.waiting, again: !!r.again, day: day() });
    if (r.again) return null;   /* the same gift twice is one thing (HOME BASE's rule): nothing new to say */
    return { name: o.name, waiting: !!r.waiting };
  }
  function find() {
    var H = root.BohemiaHisMap; if (!H || !H.readSign) return null;
    var r = null; try { r = H.readSign(); } catch (e) { RM.err = String(e && e.message || e); return null; }
    if (!r) return null; try { if (typeof render === 'function') render(); } catch (e) {}
    RM.found.push({ n: r.n, x: r.x, y: r.y, day: day() }); return r;
  }
  RM.wound = wound; RM.leaves = leaves; RM.open = open; RM.gift = gift; RM.find = find; RM.gifts = []; RM.found = [];
  RM.apply = function (fx, ctx, out) {
    out = out || { got: [] }; out.got = out.got || [];
    if (fx.wound && fx.wound.name) { var h = wound(fx.wound.name, fx.wound.hp | 0); if (h > 0) out.got.push(String(fx.wound.name).toUpperCase() + ' -' + h + ' HP'); }
    if (fx.leaves && fx.leaves.name) { if (leaves(fx.leaves.name)) out.got.push(String(fx.leaves.name).toUpperCase() + ' LEFT'); }
    if (fx.open && fx.open.id) { var p = open(fx.open.id); if (p) out.got.push(String(p.name).toUpperCase() + ' ON THE MAP'); }
    if (fx.home && fx.home.kind) { var g = gift(fx.home, ctx); if (g) out.got.push(String(g.name).toUpperCase() + (g.waiting ? ' WAITS FOR YOUR PLACE' : ' AT YOUR PLACE')); }
    if (fx.boss && fx.boss.find) { var b = find(); if (b) out.got.push(String(b.n).toUpperCase() + ' ON THE MAP'); }
    return out;
  };
  RM.status = function () { return { men: men().map(function (m) { return m.name + ':' + (m.bg || '-'); }), hidden: hiddenPlaces().length, wounded: RM.wounded.slice(-10), left: RM.left.slice(-10), opened: RM.opened.slice(-10), gifts: RM.gifts.slice(-10), found: RM.found.slice(-10), err: RM.err }; };
})(window);
