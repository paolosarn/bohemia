/* ==========================================================================
   HOME BASE (11/8/26, VAMILY rule 437(b), ask lines 356 and 522; rules 347, 343, 412, 429(h), 434)

   PAOLO 11/3: "the custom settlement shit I think that's gonna be really important to give people that itch...
   you plant your part of the city kind of wherever you want... maybe it'll be a smart system... you gotta be in
   charge of the daily battery usage... if we kill the bosses the thing that helps them will help our settlement...
   this is also where unique people throughout the journey can post up... are you sure you wanna plant down here,
   like this is permanent... you'll see progress through the acts."

   MEASURED ON THE DEMO BEFORE THIS FILE (11/8, phone upright, a new game): the game handed him ONE fixed base from
   the first second, the camp the world seed put down for his outfit (canon's player faction, 'Custom'), labelled
   CUSTOM on the map; its BUILD door listed eight things for 4 lots; nothing asked where, nothing was permanent,
   nothing billed it, nobody lived there, no boss's prize stood there, and the camera page HOME made on 11/3 was
   reached only from its VOTE card.

   THIS FILE IS THE MECHANISM, PURE (no window, no DOM; the map hands it what it measured):
     grade(probe)        the smart system: WATER, POWER, ROAD, DANGER, 0 to 3 each, and whether it can be planted
     make(seed)          a fresh home record for one game (keyed by the game's seed, so a new game is a new home)
     plant(rec, at, day) once per game, PERMANENT: a second call is refused, whatever it asks
     bill(rec, ctx)      what the place costs a night: its keep, its people, the water's price, what its prizes pay back
     addResident / prizesFrom / rename / lotsOpen / plan / roadCheck
   Every number is read from records/target/bb/home_base.json (a modder's file, TUNING's row); none is typed here.
   ========================================================================== */
(function (root) {
  'use strict';
  var D = null;
  function data() { return D; }
  function setData(d) { D = d || null; return !!D; }

  /* ---------------- THE SMART SYSTEM ----------------
     probe: { district: the block's own kind, near: { water: blocks to the nearest water kind, power: ..., road: ...,
     danger: blocks to the nearest rival home or roaming crew }, town: a town's ground is under it, boss: a boss's place } */
  function mark(dist, near) {
    if (dist == null || !isFinite(dist)) return 0;
    if (dist <= near[0]) return 3; if (dist <= near[1]) return 2; if (dist <= near[2]) return 1; return 0;
  }
  function grade(p) {
    if (!D) return null;
    var G = D.grade, n = (p && p.near) || {};
    var g = { water: mark(n.water, G.water.near), power: mark(n.power, G.power.near), road: mark(n.road, G.road.near),
              danger: mark(n.danger, G.danger.near), district: p && p.district || null, ok: true, why: null };
    if (!p || !p.district) { g.ok = false; g.why = 'nothing'; }
    else if (G.never_on.indexOf(p.district) >= 0) { g.ok = false; g.why = 'ground'; }
    else if (p.town) { g.ok = false; g.why = 'town'; }
    else if (p.boss) { g.ok = false; g.why = 'boss'; }
    else if (g.water < G.needs.water) { g.ok = false; g.why = 'water'; }
    else if (g.road < G.needs.road) { g.ok = false; g.why = 'road'; }
    /* one number to rank spots by (the smart system's 'better ground near'): water and road weigh most, danger counts against */
    g.score = g.water * 3 + g.road * 2 + g.power - g.danger * 2;
    return g;
  }
  /* the best plantable spot among probes [{x, y, probe}], nearest first on a tie; null if none */
  function best(list) {
    var b = null;
    (list || []).forEach(function (o) { var g = grade(o.probe); if (!g || !g.ok) return; o.g = g;
      if (!b || g.score > b.g.score || (g.score === b.g.score && (o.d | 0) < (b.d | 0))) b = o; });
    return b;
  }

  /* ---------------- THE RECORD ---------------- */
  function make(seed) { return { v: 1, seed: seed == null ? null : String(seed), planted: null, name: null, residents: [], prizes: {}, lots: {}, nights: 0, lastBill: null, story: [] }; }
  function planted(rec) { return !!(rec && rec.planted); }
  /* PERMANENT: the first planting stands for the whole game; nothing in this file moves it or plants twice */
  function plant(rec, at, day, g) {
    if (!rec) return { ok: false, why: 'NO_RECORD' };
    if (rec.planted) return { ok: false, why: 'PERMANENT', at: [rec.planted.x, rec.planted.y] };
    if (!at || at.x == null || at.y == null) return { ok: false, why: 'NO_SPOT' };
    if (g && !g.ok) return { ok: false, why: 'NOT_HERE', because: g.why };
    rec.planted = { x: at.x | 0, y: at.y | 0, day: day | 0, act: (g && g.act) || 1, grade: g ? { water: g.water, power: g.power, road: g.road, danger: g.danger, district: g.district } : null };
    note(rec, { kind: 'planted', day: day | 0, act: rec.planted.act, what: g && g.district || null });
    return { ok: true, at: [rec.planted.x, rec.planted.y] };
  }
  function nameOf(rec) {
    if (!D) return null;
    if (!planted(rec)) return D.names.before;
    return (rec.name && String(rec.name).trim()) ? String(rec.name).trim().toUpperCase().slice(0, 22) : D.names['default'];
  }
  function rename(rec, nm) {
    if (!rec || !planted(rec)) return false;
    var s = String(nm == null ? '' : nm).replace(/[<>&"]/g, '').trim().slice(0, 22);
    rec.name = s || null; if (rec.name) note(rec, { kind: 'named', what: rec.name.toUpperCase(), day: rec.lastDay | 0 }); return true;
  }

  /* ---------------- WHO LIVES THERE ---------------- */
  function addResident(rec, who) {
    if (!rec || !planted(rec) || !who || !who.name) return false;
    var nm = String(who.name);
    if (rec.residents.some(function (r) { return r.name === nm; })) return false;
    if (D && rec.residents.length >= (D.residents.max | 0)) return false;
    rec.residents.push({ name: nm, look: who.look || null, why: who.why || 'came', day: who.day | 0 });
    note(rec, { kind: 'moved_in', who: nm, why: who.why || 'came', day: who.day | 0, act: who.act || null });
    return true;
  }

  /* ---------------- THE BOSSES' PRIZES ----------------
     verbs: BohemiaBosses' own state().verbs ({ cook: { from: 'THE POT', day }, ... }); a prize stands only at a planted home */
  function prizesFrom(rec, verbs) {
    var out = [];
    if (!D || !rec || !planted(rec) || !verbs) return out;
    Object.keys(D.prizes).forEach(function (id) { if (id.charAt(0) === '_') return; var v = verbs[id]; if (!v) return;
      if (!rec.prizes[id]) { rec.prizes[id] = { day: v.day | 0, from: v.from || D.prizes[id].from }; note(rec, { kind: 'prize', what: String(D.prizes[id].name).replace(/^YOUR /, ''), who: D.prizes[id].from, day: v.day | 0 }); }
      out.push({ id: id, piece: D.prizes[id].piece, name: D.prizes[id].name, from: D.prizes[id].from }); });
    return out;
  }

  /* ---------------- THE BILL ----------------
     ctx: { perMan: nightly_bill.json's per_man_per_night (READ by the caller from that file), prizes: prizesFrom(...) } */
  function bill(rec, ctx) {
    if (!D || !planted(rec)) return null;
    var B = D.bill, g = rec.planted.grade || { water: 3, power: 3 }, per = ctx && ctx.perMan != null ? +ctx.perMan : null;
    if (per == null || !isFinite(per)) return null;
    var people = rec.residents.length, wm = B.water_cost_by_mark[String(g.water)] || 1, pw = B.power_cost_by_mark[String(g.power)] || 0;
    var eat = Math.ceil(people * per * wm), back = 0;
    (ctx && ctx.prizes || []).forEach(function (p) { var pp = B.prize_pays[p.id]; if (pp) for (var k in pp) back += pp[k] | 0; });
    back = Math.min(back, eat);   /* a prize feeds the people who live there; it never pays the gate's lamp */
    var due = (B.keep | 0) + pw + eat - back;
    return { keep: B.keep | 0, power: pw, people: people, per: per, waterMult: wm, eat: eat, back: back, due: Math.max(0, due) };
  }

  /* ---------------- THE PLAN: EVERY LOT FRONTS A ROAD (429(h)) ---------------- */
  function plan(rows) {
    var R = rows || (D && D.plan.rows) || [], lots = [], roads = [];
    for (var y = 0; y < R.length; y++) for (var x = 0; x < R[y].length; x++) {
      var c = R[y].charAt(x); if (c === 'L') lots.push({ i: lots.length, x: x, y: y }); else if (c === 'R') roads.push({ x: x, y: y }); }
    return { rows: R, w: R.length ? R[0].length : 0, h: R.length, lots: lots, roads: roads };
  }
  function roadCheck(rows, frontRow) {
    var P = plan(rows), at = function (x, y) { return (P.rows[y] || '').charAt(x); };
    var cut = [], fr = frontRow == null ? (D ? D.plan.front_row : 0) : frontRow;
    P.lots.forEach(function (L) { var n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { return at(L.x + d[0], L.y + d[1]) === 'R'; }); if (!n) cut.push([L.x, L.y]); });
    /* one network: every road tile reaches the front street through roads */
    var seen = {}, q = [], k = function (x, y) { return x + ',' + y; };
    P.roads.forEach(function (r) { if (r.y === fr) { seen[k(r.x, r.y)] = 1; q.push(r); } });
    while (q.length) { var r = q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var x = r.x + d[0], y = r.y + d[1];
      if (at(x, y) === 'R' && !seen[k(x, y)]) { seen[k(x, y)] = 1; q.push({ x: x, y: y }); } }); }
    var stub = P.roads.filter(function (r) { return !seen[k(r.x, r.y)]; }).map(function (r) { return [r.x, r.y]; });
    return { ok: !cut.length && !stub.length && P.lots.length > 0, lots: P.lots.length, roads: P.roads.length, cut: cut, stub: stub };
  }
  /* PROGRESS YOU CAN SEE: lots open at planting, more each time every open lot has something standing */
  function lotsOpen(rec, standing) {
    if (!D || !planted(rec)) return 0;
    var P = plan(), open = Math.min(P.lots.length, D.plan.open | 0), s = standing | 0;
    while (open < P.lots.length && s >= open) open = Math.min(P.lots.length, open + (D.plan.grow | 0));
    return open;
  }

  /* ---------------- THE PLACE REMEMBERS (rule 412) ----------------
     what happened here, in order, kept on the record; a person who lives here tells it from his own mouth, to whoever
     holds the family now: 'you' in the act it happened, 'your father' one act on, 'your granddad' two on */
  function note(rec, ev) {
    if (!rec || !ev || !ev.kind) return false;
    if (!rec.story) rec.story = [];
    var max = (D && D.story && D.story.max) | 0 || 60;
    if (ev.act == null && rec.planted) ev.act = rec.lastAct || rec.planted.act || 1;
    rec.story.push(ev); if (rec.story.length > max) rec.story.splice(0, rec.story.length - max);
    return true;
  }
  function whoFor(evAct, actNow) {
    var W = (D && D.story && D.story.who) || {}, d = Math.max(0, (actNow | 0 || 1) - (evAct | 0 || 1));
    return d >= 2 ? (W.two || 'your granddad') : d === 1 ? (W.one || 'your father') : (W.zero || 'you');
  }
  function fill(t, ev, who) {
    return String(t).replace(/\{who\}/g, who).replace(/\{Who\}/g, who.charAt(0).toUpperCase() + who.slice(1))
      .replace(/\{day\}/g, String(ev.day | 0)).replace(/\{WHAT\}/g, String(ev.what || '')).replace(/\{what\}/g, String(ev.what || '').toLowerCase()).replace(/\{name\}/g, String(ev.who || ''))
      .replace(/\{why\}/g, String(ev.why || ''));
  }
  /* the line a resident says: his own coming first, then what he saw after; the same resident on the same day says the same */
  function tell(rec, name, actNow, day) {
    if (!D || !rec || !rec.story || !rec.story.length) return null;
    var T = (D.story && D.story.lines) || {}, mine = null, seen = [];
    rec.story.forEach(function (ev) { if (ev.kind === 'moved_in' && ev.who === name) mine = ev; else if (ev.kind !== 'moved_in' || ev.who !== name) seen.push(ev); });
    var pick = seen.filter(function (ev) { return T[ev.kind]; });
    var h = 0, k = String(name) + ':' + (day | 0); for (var i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    /* ONE THING A VISIT (it fits his talk box): his own coming, or one thing he saw, by the day */
    var all = [];
    if (mine && T['me_' + (mine.why === 'let go' ? 'let_go' : 'came')]) all.push(fill(T['me_' + (mine.why === 'let go' ? 'let_go' : 'came')], mine, whoFor(mine.act, actNow)));
    pick.forEach(function (ev) { all.push(fill(T[ev.kind], ev, whoFor(ev.act, actNow))); });
    return all.length ? all[h % all.length] : null;
  }
  function save(rec) { try { return JSON.stringify(rec); } catch (e) { return null; } }
  function load(txt, seed) {
    var r = null; try { r = JSON.parse(txt || 'null'); } catch (e) { r = null; }
    if (!r || r.v !== 1 || (seed != null && r.seed !== String(seed))) return make(seed);   /* a new game is a new home */
    if (!r.residents) r.residents = []; if (!r.prizes) r.prizes = {}; if (!r.lots) r.lots = {}; if (!r.story) r.story = [];
    return r;
  }

  var API = { setData: setData, data: data, grade: grade, best: best, make: make, planted: planted, plant: plant, nameOf: nameOf, rename: rename,
              addResident: addResident, prizesFrom: prizesFrom, note: note, tell: tell, whoFor: whoFor, bill: bill, plan: plan, roadCheck: roadCheck, lotsOpen: lotsOpen, save: save, load: load };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHome = API;
})(typeof window !== 'undefined' ? window : this);
