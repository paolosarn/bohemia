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
  /* WHY THIS GROUND IS NEVER A PLACE (FIXES 11/10, ask row 553, FOUND BY EYES 11/10: an arterial said 'Nothing stands here. Find open
     ground.', the opposite of why: it IS the road). Each kind of home_base.json never_on says its own reason; the words are the phone's */
  var NEVER_WHY = { freeway: 'on_road', arterial: 'on_road', rail: 'on_road', water: 'on_water', reservoir: 'on_water', dam: 'on_water', intake: 'on_water',
    wash: 'on_wash', basin: 'on_wash', mountain: 'on_rock', quarry: 'on_rock', gypsum: 'on_rock', airbase: 'walled', prison: 'walled', landfill: 'dump' };
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
    else if (G.never_on.indexOf(p.district) >= 0) { g.ok = false; g.why = NEVER_WHY[p.district] || 'ground'; }   /* FIXES 11/10 (ask row 553): the true reason, the road a road */
    else if (p.town) { g.ok = false; g.why = 'town'; }
    else if (p.boss) { g.ok = false; g.why = 'boss'; }
    else if (g.water < G.needs.water) { g.ok = false; g.why = 'water'; }
    else if (g.road < G.needs.road) { g.ok = false; g.why = 'road'; }
    /* one number to rank spots by (the smart system's 'better ground near'): water and road weigh most, danger counts against */
    g.score = g.water * 3 + g.road * 2 + g.power - g.danger * 2;
    return g;
  }
  /* THE SPOTS (HOME BASE 6 11/27, rule 492(b): 'the map shows where a place can go... the better spots read at a glance'): every
     plantable block among probes [{x, y, d, walk, probe}], the best first (the grade's score, nearest on a tie), never two within two
     blocks of each other so the marks never crowd, at most n; each with strength 1..3 (3 the best of them) for the mark on the map */
  function spots(list, n) {
    var all = [], kept = [];
    (list || []).forEach(function (o) { var g = grade(o.probe); if (!g || !g.ok) return; all.push({ x: o.x, y: o.y, d: o.d | 0, walk: o.walk || null, g: g }); });
    all.sort(function (a, b) { return b.g.score - a.g.score || a.d - b.d; });
    all.forEach(function (s) { if (kept.length >= (n || 6)) return; if (kept.some(function (k) { return Math.max(Math.abs(k.x - s.x), Math.abs(k.y - s.y)) < 3; })) return; kept.push(s); });
    var hi = kept.length ? kept[0].g.score : 0, lo = kept.length ? kept[kept.length - 1].g.score : 0;
    kept.forEach(function (s, i) { s.rank = i; s.strength = hi === lo ? 3 : 1 + Math.round(2 * (s.g.score - lo) / (hi - lo)); });
    return kept;
  }
  /* the best plantable spot among probes, nearest first on a tie; null if none (the spots' first) */
  function best(list) { return spots(list, 1)[0] || null; }
  /* what a spot gives, in a few plain words, from its grade (water and a road first: they weigh most); raiders near said plainly */
  function gives(g) {
    if (!g) return ''; var W = (flowWords().gives) || {}, w = [];
    if (g.water >= 2) w.push(W.water || 'water'); if (g.road >= 2) w.push(W.road || 'a road'); if (g.power >= 2) w.push(W.power || 'power');
    var t = w.length ? (w.length > 1 ? w.slice(0, -1).join(', ') + ' and ' + w[w.length - 1] : w[0]) : (W.little || 'not much');
    t = t.charAt(0).toUpperCase() + t.slice(1) + '.';
    if ((g.danger | 0) >= 2) t += ' ' + (W.raiders || 'Raiders near.'); else if ((g.danger | 0) === 0) t += ' ' + (W.quiet || 'Quiet.');
    return t;
  }

  /* ---------------- THE RECORD ---------------- */
  function make(seed) { return { v: 1, seed: seed == null ? null : String(seed), planted: null, name: null, residents: [], prizes: {}, lots: {}, nights: 0, lastBill: null, story: [], things: [], waiting: [], places: [], deeds: [] }; }
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
  /* ---------------- THE SEAM (rule 445(d)): ONE WAY IN FOR EVERYTHING THAT IS HIS ----------------
     give(rec, t): t = { id (unique, a lane's own), kind: 'prize' | 'trophy' | 'build' | 'person', name, pic (a picture path under
     slices/), gives ({ food: 1 } a day, or null), from (who gave it: a boss, a job, an event, 'you'), says (one line, draft) };
     a build gift also carries build (a lotbuild id). Before he plants it WAITS (rec.waiting) and says so; once planted it is PLACED:
     a prize or a trophy on the back lots of the plan, a person among those who live there; a build is the caller's to stand on a lot.
     The same id given twice is one thing. */
  var KINDS = ['prize', 'trophy', 'build', 'person', 'deed'];   /* a deed (11/17, rule 453(3)): a job he did, pinned on his place's cork board, no lot of its own */
  function had(rec, id) { return rec.things.some(function (x) { return x.id === id; }) || rec.waiting.some(function (x) { return x.id === id; }); }
  function give(rec, t, taken) {
    if (!rec || !t || !t.id || KINDS.indexOf(t.kind) < 0) return { ok: false, why: 'NOT_A_THING' };
    if (!rec.things) rec.things = []; if (!rec.waiting) rec.waiting = [];
    if (had(rec, t.id)) return { ok: true, again: true };
    var x = { id: String(t.id), kind: t.kind, name: String(t.name || t.id), pic: t.pic || null, gives: t.gives || null, from: t.from || null, says: t.says || null, build: t.build || null, look: t.look || null, saved: !!t.saved, held: !!t.held, day: t.day | 0 };   /* held: a raid he held at his gate (HOME BASE 11/18) */
    if (!planted(rec)) { rec.waiting.push(x); return { ok: true, waiting: true, thing: x }; }
    return place(rec, x, taken);
  }
  /* a prize or a trophy takes the back lots, from the last lot of the plan forward, never one built on (taken: lot indexes in use) */
  function place(rec, x, taken) {
    taken = taken || {};
    if (x.kind === 'deed') { if (!rec.deeds) rec.deeds = []; x.lot = null; rec.deeds.push({ id: x.id, name: x.name, from: x.from, saved: !!x.saved, held: !!x.held, day: x.day | 0 }); rec.things.push(x); return { ok: true, placed: true, thing: x }; }
    if (x.kind === 'person') { addResident(rec, { name: x.name, look: x.look || null, why: x.from ? 'came with ' + x.from : 'came', day: x.day | 0 }); x.lot = null; }
    else if (x.kind === 'prize' || x.kind === 'trophy') { var P = plan(), used = {}; rec.things.forEach(function (y) { if (y.lot != null) used[y.lot] = 1; }); (rec.places || []).forEach(function (y) { used[y.lot] = 1; });
      for (var i = P.lots.length - 1; i >= 0; i--) if (!used[i] && !taken[i]) { x.lot = i; break; }
      if (x.lot == null) x.lot = -1; }   /* no lot left: it is his, kept in the hall (named on the desk) */
    rec.things.push(x);
    note(rec, { kind: 'given', what: x.name, who: x.from || '', day: x.day | 0 });
    return { ok: true, placed: true, thing: x };
  }
  /* on planting, everything that waited is placed */
  function placeWaiting(rec, taken) { var out = []; if (!planted(rec)) return out; var w = rec.waiting.slice(); rec.waiting = [];
    w.forEach(function (x) { out.push(place(rec, x, taken).thing); }); return out; }
  /* ---------------- HIS PLACE'S OWN BUILDINGS (11/17, rules 445, 453): the training yard, the forge, the lookout ----------------
     one of each, on a free lot (never one a build, a prize or another of these holds), standing the day after it is put up */
  function placeRow(id) { return D && D.places && id && id.charAt(0) !== '_' && id !== 'words' ? D.places[id] || null : null; }
  function placeLots(rec, taken) { var used = {}; for (var k in (taken || {})) used[k] = 1;
    (rec.things || []).forEach(function (y) { if (y.kind !== 'build' && y.lot != null && y.lot >= 0) used[y.lot] = 1; }); (rec.places || []).forEach(function (y) { used[y.lot] = 1; }); return used; }   /* a build's lot is the lot book's (taken): a cleared gift build frees its lot */
  function buildPlace(rec, id, lot, day, taken) {
    if (!planted(rec)) return { ok: false, why: 'NOT_PLANTED' };
    var P = placeRow(id); if (!P) return { ok: false, why: 'NOT_A_PLACE' };
    if (!rec.places) rec.places = [];
    if (rec.places.some(function (p) { return p.id === id; })) return { ok: false, why: 'ONE_OF_EACH' };
    if (lot == null || lot < 0 || lot >= plan().lots.length || placeLots(rec, taken)[lot]) return { ok: false, why: 'LOT_TAKEN' };
    var x = { id: id, lot: lot | 0, day: day | 0 }; rec.places.push(x);
    note(rec, { kind: 'built', what: P.name, day: day | 0 }); return { ok: true, place: x };
  }
  function placesOf(rec, day) { return (rec && rec.places || []).map(function (p) { var P = placeRow(p.id) || {}; return { id: p.id, lot: p.lot, day: p.day, done: (day | 0) > (p.day | 0), name: P.name || p.id, piece: P.piece || null, can: P.can || null }; }); }
  /* THE YARD (Battle Brothers' Veteran's Lessons): a man trained gains his share more experience from his next fights; the price is his
     level's. trained() is what the crew screen's after-fight count asks (BOHEMIA_ROSTER_SCREEN __HOME_BASE_TRAINED__) */
  function trainCost(level) { var Y = placeRow('yard') || {}; return Math.max(Y.min | 0 || 2, (Y.per_level || 1) * (level | 0 || 1)); }
  function train(store, name, day) { var Y = placeRow('yard'); if (!Y || !name) return null; store = store || {};
    if (store[name] && store[name].left > 0) return null; store[name] = { mult: +Y.mult || 1, left: Y.fights | 0, day: day | 0 }; return store; }
  function trained(store, name, xp) { store = store || {}; var t = store[name], x = Math.max(0, Math.round(+xp || 0));
    if (!t || !(t.left > 0)) return { xp: x, store: store, bonus: 0 };
    var out = Math.round(x * (+t.mult || 1)); t.left--; if (t.left <= 0) delete store[name]; return { xp: out, store: store, bonus: out - x }; }
  /* ---------------- HIS PLACE, HIS WAY (HOME BASE 5 11/27, rule 347(c): 'literally every thing in our custom settlement can be
     customized... super easy') ----------------
     rec.look: spots { thingKey: footage lot 1..12 } (where it stands), paint { thingKey: paint id } (records/target/bb/home_base.json
     look.paints; 'bare' is no paint), signs { thingKey: his words, 'gate': ... } (A-Z 0-9 and a little punctuation, look.sign_max),
     jobs { resident name: lot key '3,0' | 'rest' } (who works what), called { resident name: what he calls them }. A thing's key is the screen's 'h<lot>:<id>', so a lot cleared
     and built again is a new thing. Pure: the map keeps it in the home record and saves it with the rest. */
  function lookOf(rec) {
    if (!rec) return null;
    if (!rec.look || typeof rec.look !== 'object') rec.look = {};
    ['spots', 'paint', 'signs', 'jobs', 'called'].forEach(function (k) { if (!rec.look[k] || typeof rec.look[k] !== 'object') rec.look[k] = {}; });
    return rec.look;
  }
  function signText(t) {
    var max = (D && D.look && D.look.sign_max) | 0 || 12;
    return String(t == null ? '' : t).replace(/<[^>]*>/g, '').toUpperCase().replace(/[^A-Z0-9 .,!?'&#\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, max).trim();
  }
  function paintIds() { return ((D && D.look && D.look.paints) || []).map(function (p) { return p.id; }); }
  function setLook(rec, what, key, val) {
    if (!rec || !planted(rec)) return { ok: false, why: 'NOT_PLANTED' };
    var L = lookOf(rec); key = String(key == null ? '' : key);
    if (!key || key.length > 48) return { ok: false, why: 'NO_KEY' };
    if (what === 'spot') {
      if (val == null || val === '') { delete L.spots[key]; return { ok: true }; }
      var n = val | 0; if (n < 1 || n > 12) return { ok: false, why: 'NO_LOT' };
      for (var k in L.spots) if (L.spots[k] === n && k !== key) delete L.spots[k];   /* one lot, one thing: whoever stood there by his word goes back to where it falls */
      L.spots[key] = n; return { ok: true, spot: n };
    }
    if (what === 'paint') {
      var ids = paintIds(); if (ids.indexOf(val) < 0) return { ok: false, why: 'NO_PAINT' };
      if (val === ids[0]) delete L.paint[key]; else L.paint[key] = val; return { ok: true, paint: val };   /* the first paint is the bare one */
    }
    if (what === 'sign') {
      var s = signText(val); if (s) L.signs[key] = s; else delete L.signs[key]; return { ok: true, sign: s };
    }
    if (what === 'called') {   /* a person who lives there, called what he calls them (Battle Brothers: tap the name); the name they came with stays their key */
      var c = String(val == null ? '' : val).replace(/<[^>]*>/g, '').toUpperCase().replace(/[^A-Z0-9 .'\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20).trim();
      if (c && c !== key) L.called[key] = c; else delete L.called[key]; return { ok: true, called: c || null };
    }
    if (what === 'job') {
      if (val == null || val === '') { delete L.jobs[key]; return { ok: true }; }
      var v = String(val); if (v !== 'rest' && !/^\d+,\d+$/.test(v)) return { ok: false, why: 'NO_JOB' };
      L.jobs[key] = v; return { ok: true, job: v };
    }
    return { ok: false, why: 'NOT_A_CHOICE' };
  }
  /* ---------------- YOUR PLACE IS EASY (HOME BASE 6 11/27, rule 492(a): 'one obvious next step on screen at every moment, said by
     a face') ----------------
     step(c) is the one next thing to do, from what the map knows (c.planted, c.offer, c.onMap, c.inside, c.sheet, c.booked, c.here,
     c.better, c.travelling) and what he pressed (c.open, c.later, c.going, c.target, c.at, c.asked, c.built). It answers
     { id, line, buttons: [{ id, label, gold }] } with the words from home_base.json flow (draft); 'quiet' says nothing and shows
     nothing. Pure: the glass (slices/bohemia_your_place.js) draws it and the gate reads it. */
  function flowWords() { return (D && D.flow) || { lines: {}, why: {}, buttons: {} }; }
  function btn(id, gold) { var B = flowWords().buttons || {}; return { id: id, label: B[id] || id.toUpperCase(), gold: !!gold }; }
  function says(id, vars) { var t = (flowWords().lines || {})[id] || ''; vars = vars || {};
    return String(t).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? String(vars[k]) : ''; }).replace(/\s+/g, ' ').trim(); }
  function step(c) {
    c = c || {}; var F = flowWords(), W = (D && D.words) || {};
    var out = function (id, buttons, vars) { return { id: id, line: id === 'quiet' ? '' : (id === 'sure' ? (W.plant_sure || says(id)) : says(id, vars)), buttons: buttons || [] }; };
    if (c.planted) {
      if (c.booked > 0) {   /* the first build is booked: the flow is done, said once, on his cameras */
        if (c.inside && c.built && !c.sheet) return out('built');
        if (c.onMap && c.away) return out('home', [btn('home', true)]);   /* THE WAY BACK (plan H): away from his place, one button walks him home */
        return out('quiet'); }
      if (c.inside) return out(c.sheet ? 'quiet' : 'inside');                  /* a sheet open is his to read; the line waits */
      if (c.onMap) return out('planted', [btn('in', true)]);
      return out('quiet');
    }
    if (!c.offer) return out('quiet');
    if (c.asked) return out('sure', [btn('plant', true), btn('no')]);
    var g = c.here && c.here.g;
    if (c.going && c.travelling) return out('going');
    if (c.going && g && g.ok && c.target && c.at && Math.max(Math.abs(c.at[0] - c.target[0]), Math.abs(c.at[1] - c.target[1])) <= 1) return out('arrived', [btn('plant', true), btn('close')]);
    if (!c.open && !c.going) return c.later ? out('pill', [btn('pill', true)]) : out('offer', [btn('look', true), btn('later')]);
    if (c.picked && c.picked.g) return out(c.picked.rank === 0 ? 'pick' : 'spot', [btn('walk', true), btn('close')], { gives: gives(c.picked.g) });   /* a mark on the map tapped */
    if (g && g.ok) return out('good', [btn('plant', true), btn('close')]);
    if (c.better) return out('bad', [btn('walk', true), btn('close')], { why: (F.why || {})[(g && g.why) || 'nothing'] || '', dir: String(c.better.dir || '').toLowerCase() });
    return out('none', [btn('close', true)]);   /* the one thing left to do: put it away and walk on */
  }
  /* who says it: his crew's best man (rule 492(b)): the highest level, then the most experience; never him, never the dead; a man
     with no face says nothing. men: [{ name, look, level, xp, main, dead }] */
  function bestMan(men) {
    var c = (men || []).filter(function (m) { return m && m.look && m.name && !m.main && !m.dead; });
    c.sort(function (a, b) { return (b.level || 1) - (a.level || 1) || (b.xp || 0) - (a.xp || 0); });
    return c[0] || null;
  }
  function save(rec) { try { return JSON.stringify(rec); } catch (e) { return null; } }
  function load(txt, seed) {
    var r = null; try { r = JSON.parse(txt || 'null'); } catch (e) { r = null; }
    if (!r || r.v !== 1 || (seed != null && r.seed !== String(seed))) return make(seed);   /* a new game is a new home */
    if (!r.residents) r.residents = []; if (!r.prizes) r.prizes = {}; if (!r.lots) r.lots = {}; if (!r.story) r.story = []; if (!r.things) r.things = []; if (!r.waiting) r.waiting = []; if (!r.places) r.places = []; if (!r.deeds) r.deeds = [];
    return r;
  }

  var API = { setData: setData, data: data, grade: grade, best: best, make: make, planted: planted, plant: plant, nameOf: nameOf, rename: rename,
              addResident: addResident, prizesFrom: prizesFrom, note: note, tell: tell, whoFor: whoFor, give: give, placeWaiting: placeWaiting, buildPlace: buildPlace, placesOf: placesOf, trainCost: trainCost, train: train, trained: trained, bill: bill, plan: plan, roadCheck: roadCheck, lotsOpen: lotsOpen, save: save, load: load,
              lookOf: lookOf, setLook: setLook, signText: signText, step: step, bestMan: bestMan, spots: spots, gives: gives };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHome = API;
})(typeof window !== 'undefined' ? window : this);
