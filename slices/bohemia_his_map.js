/* HIS MAP (WORLD TWO [the best of both maps], 10/26/26, rule 243).
   PAOLO 10/26: 'think about Valheim's map and how Battle Brothers' map is, let's do the best of both worlds... there are
   supposed to be bosses in this game where you're able to alter the map and what's going on in the world around you,
   that's gonna be super important.' Research first: records/BOHEMIA_WORLD_TWO_THE_BEST_OF_BOTH_MAPS_10_26_26.md.
   RUN's map (BOHEMIA_CITY_WORLD.html) keeps its painting, its travel, its fog and its fights; this file is Valheim's half,
   drawn over it through five marked hooks (__HIS_MAP__), and every one of them does nothing if this file is missing:
     (1) THE MAP FILLS IN WHERE HE HAS BEEN. RUN's fog (rule 155) decides WHAT he has seen; this file decides how the unseen
         LOOKS: the city is still there, grey and dark under crawling tape static, its shape (the blocks, the freeway, the
         towers) and none of its detail (no colour; RUN's fog already keeps the towns, their names and every walker off it).
         The seen city stays painted. Never a black void: the whole valley reads on one screen at the far stop.
     (2) HIS OWN PINS. Hold a finger (or the mouse) on the map: CAMP, DANGER, LOOT, SHOP or A WORD of his own. Drawn at one
         size at every zoom, kept with the game. Hold a pin to take it off. When one of his men dies the map drops a cross
         where it happened, with his name (Valheim's tombstone; ours stays, Battle Brothers' dead stay dead).
     (3) THE BOSS IS FOUND. The next boss on HIS ladder (records/target/bb/boss_map.json, his order) has a sign in the world
         near him: a tag, a flyer, the radio, a man at a bar (Valheim's runestone). Walk to it and his place is marked on the
         map, the static round it cleared (Battle Brothers' Ancient Spire clears the fog in a circle).
     (4) THE BOSS CHANGES THE MAP. At his place the fight comes through RUN's one door (cityHandOver, the meet card first);
         when he falls, his part of the city changes the next time the map is drawn, by the table's row: the lights come back
         on, a place appears, a wall comes down (the walk goes through it), the map opens, a home base changes hands ('boss',
         one of his four ways). The next boss's sign turns up where this one fell. Every row is draft:true and his.
   THE BENCH (localStorage bohemia.fog.off, what every gate before rule 155 measures) gets none of (1), (3) or (4): those are
   the stranger's game, and RUN's checkers measure the painting without them. His pins draw everywhere.
   Gate: gates/his_map_gate.js (phone and computer, on the live demo). */
(function (root) {
  'use strict';
  var KEY = 'bohemia.hismap.v1', DATA_URL = '../records/target/bb/boss_map.json';
  var DATA = null, S = null, BOUND = false, MENU = null, OPEN = null, PLACING = false;
  var GLY = {}, FAINT = { on: true, cv: null, x: null, snow: null, pat: null, beat: -1, far: null };
  var LAST = { ox: 0, oy: 0, tw: 0, th: 0, drew: {} };
  var KINDS = ['camp', 'danger', 'loot', 'shop', 'word'];
  var WORDS = { camp: 'CAMP', danger: 'DANGER', loot: 'LOOT', shop: 'SHOP', word: 'A WORD' };   /* draft:true */

  /* ---------- small things ---------- */
  function has(n) { try { return typeof root[n] !== 'undefined'; } catch (e) { return false; } }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  function hash(a, b) { var h = 2166136261 ^ (a | 0); h = Math.imul(h, 16777619) ^ (b | 0); h = Math.imul(h, 16777619); return h >>> 0; }
  function N() { try { return (om && om.n) | 0; } catch (e) { return 0; } }
  function here() { try { return [city.x | 0, city.y | 0]; } catch (e) { return null; } }
  function bench() { try { return !FOG.on; } catch (e) { return true; } }
  function fogOn() { try { return FOG.on && FOG.ready && !FOG.all; } catch (e) { return false; } }
  function hidden(x, y) { try { return typeof fogHides === 'function' && fogHides(x, y); } catch (e) { return false; } }
  function walk(x, y) { try { return cityWalkable(x, y); } catch (e) { return false; } }
  function dist(x, y) { try { var t = om.at(x, y); return t ? t.district : null; } catch (e) { return null; } }
  function day() { try { return loopDay(); } catch (e) { return 0; } }
  function say(t) { try { if (typeof travelSay === 'function') travelSay(t); } catch (e) {} }
  function moving() { try { return !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length); } catch (e) { return false; } }
  function bases() { try { return ctBases() || {}; } catch (e) { return {}; } }
  function nearTown(x, y, r) { var bs = bases(); for (var n in bs) { var b = bs[n]; if (b && cheb(b.x | 0, b.y | 0, x, y) <= r) return n; } return null; }
  function font(px) { var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {} return '700 ' + px + 'px ' + f; }

  /* ---------- the state, kept with the game (RUN's fog keeps its own the same way) ---------- */
  function fresh() {
    return { v: 1, seed: (Math.floor(Math.random() * 0x7fffffff) ^ (Date.now() & 0x7fffffff)) >>> 0, pins: [], crosses: [], deadSeen: {},
      boss: { i: 0, sign: null, found: {}, fallen: {} }, open: [], lit: [], places: [], fighting: null };
  }
  function load() {
    var st = null; try { st = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
    S = (st && st.v === 1) ? st : fresh();
    ['pins', 'crosses', 'open', 'lit', 'places'].forEach(function (k) { if (!Array.isArray(S[k])) S[k] = []; });
    if (!S.deadSeen) S.deadSeen = {}; if (!S.boss) S.boss = fresh().boss;
    if (!S.boss.found) S.boss.found = {}; if (!S.boss.fallen) S.boss.fallen = {};
    S.fighting = null;   /* a fight is never carried across a reload: the fight saves at its start (rule 233) and comes home once */
    openMap();
    if (!st) seedDead();
  }
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  /* a new game: everything here belongs to the old company (called from RUN's fogNewGame, its hook) */
  function newGame() { S = fresh(); openMap(); seedDead(); save(); }
  /* the men dead before this file saw them get no cross (we never knew where) */
  function seedDead() { try { (BohemiaCondition.get().dead || []).forEach(function (d) { if (d && d.name) S.deadSeen[d.name] = 1; }); } catch (e) {} }

  /* ---------- the table (his, draft) ---------- */
  function loadData() {
    if (DATA || typeof fetch === 'undefined') return;
    fetch(DATA_URL).then(function (r) { return r.json(); }).then(function (j) { if (j && Array.isArray(j.bosses)) DATA = j; }).catch(function () {});
  }
  function row(n) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].n === n) return DATA.bosses[i]; return null; }
  function nextRow() { return DATA && S ? (DATA.bosses[S.boss.i] || null) : null; }

  /* ---------- (4) a wall down: the blocks the walk may now cross (RUN's cityWalkable reads window.__HIS_MAP_OPEN, its hook) ---------- */
  function openMap() {
    var n = N() || 96, a = null;
    if (S && S.open.length) { a = new Uint8Array(n * n); S.open.forEach(function (k) { if (k >= 0 && k < n * n) a[k] = 1; }); }
    root.__HIS_MAP_OPEN = a; root.__HIS_MAP_N = n;
  }

  /* ================= (3) THE BOSS IS FOUND ================= */
  /* a street block r0..r1 from (x, y), inside what he can see, next to a wall to carry a tag */
  function streetNear(x, y, r0, r1, R) {
    var c = [];
    for (var dy = -r1; dy <= r1; dy++) for (var dx = -r1; dx <= r1; dx++) {
      var d = Math.max(Math.abs(dx), Math.abs(dy)); if (d < r0 || d > r1) continue;
      var a = x + dx, b = y + dy; if (!walk(a, b) || hidden(a, b) || nearTown(a, b, 1)) continue;
      if (walk(a + 1, b) && walk(a - 1, b) && walk(a, b + 1) && walk(a, b - 1)) continue;   /* a crossing has no wall */
      c.push([a, b]);
    }
    return c.length ? c[Math.floor(R() * c.length) % c.length] : null;
  }
  function placeSign() {
    var r = nextRow(), h = here(); if (!r || !h || !N()) return false;
    var R = rng(hash(S.seed, S.boss.i + 7)), sight = 6;
    try { sight = fogRadius(); } catch (e) {}
    var at = streetNear(h[0], h[1], 2, Math.max(2, Math.min(5, sight - 1)), R) || streetNear(h[0], h[1], 1, 6, R);
    if (!at) return false;
    var place = bossPlace(r, at, R); if (!place) return false;
    S.boss.sign = { n: r.n, x: at[0], y: at[1], kind: (r.sign && r.sign.kind) || 'tag', boss: place };
    save();
    return true;
  }
  /* the boss stands at the street block nearest a block of his district kind, 8 to 30 blocks from the sign, reachable */
  function bossPlace(r, from, R) {
    var n = N(), kinds = r.district || [], best = null;
    var route = function (p) { try { return !!cityRoute(from[0], from[1], p[0], p[1]); } catch (e) { return false; } };
    for (var ki = 0; ki < kinds.length && !best; ki++) {
      var c = [];
      for (var y = 1; y < n - 1; y++) for (var x = 1; x < n - 1; x++) {
        if (dist(x, y) !== kinds[ki]) continue;
        var d = cheb(x, y, from[0], from[1]); if (d < 8 || d > 30 || nearTown(x, y, 3)) continue;
        c.push([d + R() * 3, x, y]);
      }
      c.sort(function (a, b) { return a[0] - b[0]; });
      for (var i = 0; i < c.length && i < 12 && !best; i++) {
        var door = doorOf(c[i][1], c[i][2]);
        if (door && route(door)) best = { x: door[0], y: door[1], dk: kinds[ki], bx: c[i][1], by: c[i][2] };
      }
    }
    if (!best) {   /* none of his kinds within reach: a street 10 to 20 blocks out, said in the state */
      for (var t = 0; t < 200 && !best; t++) {
        var a = from[0] + Math.floor((R() * 2 - 1) * 20), b = from[1] + Math.floor((R() * 2 - 1) * 20);
        if (cheb(a, b, from[0], from[1]) < 10 || !walk(a, b) || nearTown(a, b, 3)) continue;
        if (route([a, b])) best = { x: a, y: b, dk: dist(a, b), bx: a, by: b, fallback: true };
      }
    }
    return best;
  }
  function doorOf(x, y) {
    if (walk(x, y)) return [x, y];
    for (var r = 1; r <= 2; r++) for (var a = -r; a <= r; a++) for (var b = -r; b <= r; b++)
      if (Math.max(Math.abs(a), Math.abs(b)) === r && walk(x + a, y + b)) return [x + a, y + b];
    return null;
  }
  function readSign() {
    var s = S.boss.sign, r = row(s.n); if (!r) return;
    S.boss.found[s.n] = s.boss; S.boss.sign = null;
    try { fogReveal(s.boss.x, s.boss.y, 1.6); } catch (e) {}   /* the Ancient Spire's circle: his place shows through the static */
    save();
    say(((r.sign && r.sign.says) || r.n) + ' Marked on your map.');   /* draft:true */
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-found', { detail: { n: r.n, at: [s.boss.x, s.boss.y] } })); } catch (e) {}
    try { if (typeof render === 'function') render(); } catch (e) {}
  }

  /* ================= (4) THE BOSS CHANGES THE MAP ================= */
  function startFight(r, at) {
    var party = null;
    try { party = partyMath('job', { skulls: (DATA.fight && DATA.fight.skulls) || 3 }); } catch (e) { party = null; }
    party = party || { count: 6, days: 1, difficulty: 1 };
    party.count = Math.max(1, party.count | 0);
    try { party.word = partyWord(party.count); } catch (e) {}
    party.faction = r.faction || (DATA.fight && DATA.fight.faction) || 'brigands';
    var roster = []; for (var i = 0; i < party.count; i++) roster.push({ arch: 'human' });
    var w = at; try { w = roadWhere(); } catch (e) {}
    var pkg = 1; try { if (LOOP.start && LOOP.start.pkg != null) pkg = LOOP.start.pkg; } catch (e) {}
    S.fighting = { n: r.n, fb: root.__MEET_FELL_BACK | 0, t: Date.now() };
    var ok = false;
    try { ok = cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: r.n, faction: null, draft: true, packageId: pkg, roster: roster, party: party,
      street: true, why: 'boss:' + r.n, at: { gx: w[0] | 0, gy: w[1] | 0 } }); } catch (e) { ok = false; }
    if (!ok) { S.fighting = null; return false; }
    try { CITY_CONTACT_POSTED = true; } catch (e) {}
    root.__BOSS_FIGHTS = (root.__BOSS_FIGHTS | 0) + 1;
    return true;
  }
  function fightEnded(o) {
    var f = S && S.fighting; if (!f) return;
    S.fighting = null;
    var won = !!(o && (o.victory || o.result === 'win')) && !((o && o.alive) | 0);
    if (won) fell(f.n); else save();
  }
  /* he fell: the row's changes, on the map the next time it is drawn */
  function fell(n) {
    var r = row(n), f = S.boss.found[n]; if (!r || !f || S.boss.fallen[n]) return null;
    var fx = r.falls || {}, done = [];
    S.boss.fallen[n] = { day: day(), x: f.x, y: f.y };
    if (fx.lights) { S.lit.push({ x: f.bx != null ? f.bx : f.x, y: f.by != null ? f.by : f.y, r: fx.lights | 0, n: n }); done.push('lights'); }
    if (fx.place) { S.places.push({ x: f.x, y: f.y, name: String(fx.place), n: n }); done.push('place'); }
    if (fx.wall) { var o = wallsDown(f, fx.wall | 0); if (o.length) done.push('wall'); }
    if (fx.reveal) { try { if (typeof fogShowTowns === 'function') { fogShowTowns(); fogSave(); } } catch (e) {} done.push('reveal'); }
    if (fx.holds) { var hb = holds(f, fx.holds, n); if (hb) done.push('holds'); }
    try { fogReveal(f.x, f.y, Math.max(3, (fx.lights | 0) + 1)); } catch (e) {}   /* he sees what changed */
    S.boss.fallen[n].did = done;
    S.boss.i = Math.max(S.boss.i, DATA.bosses.indexOf(r) + 1);
    S.boss.sign = null;   /* the next sign turns up near here, the next time the map ticks */
    openMap(); save();
    /* where, in his words: the side of the nearest town ('the Cartel side'), else the block */
    var bs = bases(), tn = null, td = 1e9; for (var bn in bs) { var bb = bs[bn]; if (!bb) continue; var dd = cheb(bb.x | 0, bb.y | 0, f.x, f.y); if (dd < td) { td = dd; tn = bn; } }
    var word = (tn && td <= 14) ? 'the ' + tn + ' side' : 'that block';
    try { if (root.BOHEMIA_FEED && r.feed) root.BOHEMIA_FEED.push({ who: '@valleyradio', txt: String(r.feed).replace(/\{district\}/g, word), kind: 'world', draft: true }); } catch (e) {}
    var what = { lights: 'The lights are back on.', place: (fx.place ? String(fx.place) + ' opens.' : ''), wall: 'A wall came down.', reveal: 'Every town is on your map.', holds: 'Who holds it changed.' };
    say(r.n + ' is down. ' + done.slice(0, 2).map(function (k) { return what[k]; }).join(' '));   /* draft:true */
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-fell', { detail: { n: n, at: [f.x, f.y], did: done } })); } catch (e) {}
    try { if (typeof saveNow === 'function') saveNow('boss:' + n); } catch (e) {}
    try { if (typeof render === 'function') render(); } catch (e) {}
    return done;
  }
  /* a wall comes down: the nearest short run (one to three blocks) between two streets near him, never a town's ground, never water
     or the freeway, and only where it is a real new way through (the map's own walk round it is at least two blocks longer) */
  function wallsDown(f, k) {
    var n = N(), cands = [];
    var bad = function (x, y) { if (x < 1 || y < 1 || x >= n - 1 || y >= n - 1 || walk(x, y) || nearTown(x, y, 2)) return true;
      var dk = dist(x, y); return !dk || /lake|water|reservoir|basin|freeway|interchange|exits|mountain|dam/.test(dk); };
    for (var dy = -12; dy <= 12; dy++) for (var dx = -12; dx <= 12; dx++) {
      var x = f.x + dx, y = f.y + dy;
      for (var dir = 0; dir < 2; dir++) {
        var ax = dir ? 0 : 1, ay = dir ? 1 : 0;
        if (!walk(x - ax, y - ay)) continue;
        for (var len = 1; len <= 3; len++) {
          var run = [], okR = true;
          for (var t = 0; t < len; t++) { var px = x + ax * t, py = y + ay * t; if (bad(px, py)) { okR = false; break; } run.push([px, py]); }
          if (!okR) break;
          if (walk(x + ax * len, y + ay * len)) { cands.push({ d: Math.max(Math.abs(dx), Math.abs(dy)) + len, run: run, a: [x - ax, y - ay], b: [x + ax * len, y + ay * len] }); break; }
        }
      }
    }
    cands.sort(function (a, b) { return a.d - b.d; });
    var out = [];
    for (var i = 0; i < cands.length && out.length < k && i < 24; i++) {
      var c = cands[i], p = null; try { p = cityRoute(c.a[0], c.a[1], c.b[0], c.b[1]); } catch (e) { p = null; }
      if (p && p.length - 1 < c.run.length + 1 + 2) continue;   /* the street already goes round close by: not a new way */
      if (c.run.some(function (q) { return S.open.indexOf(q[1] * n + q[0]) >= 0; })) continue;
      c.run.forEach(function (q) { S.open.push(q[1] * n + q[0]); });
      out.push(c.run);
      openMap();
    }
    return out;
  }
  /* who holds what: the nearest home base changes hands by 'boss' (WORLD's ledger, engine/bohemia_homebases.js) */
  function holds(f, to, n) {
    var bs = bases(), best = null, bd = 1e9;
    for (var k in bs) { var b = bs[k]; if (!b) continue; var d = cheb(b.x | 0, b.y | 0, f.x, f.y); if (d < bd) { bd = d; best = k; } }
    if (!best) return null;
    try { var rec = hbRec(); var res = BohemiaHomeBases.took(rec, { base: best, to: to === 'you' ? 'you' : String(to), by: 'boss', why: n, day: day() });
      if (res && res.applied) { S.boss.fallen[n].holds = { base: best, to: res.entry.to, from: res.entry.from }; return best; } } catch (e) {}
    return null;
  }

  /* ================= (2) HIS PINS, AND THE CROSS ================= */
  function pinAt(x, y) { for (var i = 0; i < S.pins.length; i++) if (S.pins[i].x === x && S.pins[i].y === y) return i; return -1; }
  function crossAt(x, y) { for (var i = 0; i < S.crosses.length; i++) if (S.crosses[i].x === x && S.crosses[i].y === y) return i; return -1; }
  function drop(x, y, k, w) {
    if (KINDS.indexOf(k) < 0) return false;
    var i = pinAt(x, y), p = { x: x | 0, y: y | 0, k: k, w: k === 'word' ? String(w || '').toUpperCase().replace(/[^A-Z0-9 '!?.-]/g, '').slice(0, 14) : null, t: Date.now() };
    if (k === 'word' && !p.w) return false;
    if (i >= 0) S.pins[i] = p; else S.pins.push(p);
    if (S.pins.length > 200) S.pins.shift();
    save(); try { if (typeof render === 'function') render(); } catch (e) {}
    return true;
  }
  function lift(x, y) {
    var i = pinAt(x, y); if (i >= 0) { S.pins.splice(i, 1); save(); try { render(); } catch (e) {} return true; }
    var c = crossAt(x, y); if (c >= 0) { S.crosses.splice(c, 1); save(); try { render(); } catch (e) {} return true; }
    return false;
  }
  /* the dead: CAMP's list (engine/bohemia_condition.js) names who; this file saw where the fight was */
  var FIGHT_AT = null, HANDOVER_SEEN = null;
  function deadCheck() {
    var list = []; try { list = BohemiaCondition.get().dead || []; } catch (e) { return; }
    var at = FIGHT_AT || here(); if (!at) return;
    var added = 0;
    list.forEach(function (d) {
      if (!d || !d.name || S.deadSeen[d.name]) return;
      S.deadSeen[d.name] = 1;
      var k = S.crosses.filter(function (c) { return c.x === at[0] && c.y === at[1]; }).length;
      S.crosses.push({ x: at[0], y: at[1], name: String(d.shown || d.name).toUpperCase(), day: d.day != null ? d.day : day(), k: k });
      added++;
    });
    if (added) { save(); try { render(); } catch (e) {} }
  }

  /* ================= THE TICK (every frame the map draws; cheap) ================= */
  function tick() {
    if (!S) return;
    bind();
    /* where the fight is: the moment RUN's one door hands one over (its __LAST_HANDOVER), he is standing at it */
    try { var h = root.__LAST_HANDOVER; if (h && h !== HANDOVER_SEEN) { HANDOVER_SEEN = h; FIGHT_AT = here(); } } catch (e) {}
    if (S.fighting && (root.__MEET_FELL_BACK | 0) > S.fighting.fb) S.fighting = null;   /* FALL BACK: no fight, no end */
    if (bench() || !DATA || !N()) return;
    var h2 = here(); if (!h2) return;
    try { if (!FOG.ready) return; } catch (e) { return; }
    /* the sign is placed off the frame (a few walks of the map's own route), never in the first second (the second votes) */
    if (!S.boss.sign && nextRow() && !S.boss.found[nextRow().n] && !moving() && !PLACING) {
      PLACING = true;
      setTimeout(function () { PLACING = false; try { if (!S.boss.sign && !moving() && placeSign()) render(); } catch (e) {} }, 1500);
    }
    var s = S.boss.sign;
    if (s && cheb(h2[0], h2[1], s.x, s.y) <= 1) readSign();
    for (var n in S.boss.found) {
      if (S.boss.fallen[n]) continue;
      var f = S.boss.found[n];
      if (cheb(h2[0], h2[1], f.x, f.y) >= 2) { f.armed = true; continue; }
      if (h2[0] !== f.x || h2[1] !== f.y || moving() || S.fighting || f.armed === false) continue;
      try { if (LOOP.fighting || (MEET && MEET.up)) continue; } catch (e) {}
      var r = row(n); if (!r) continue;
      f.armed = false;
      if (r.how === 'meet') fell(n); else startFight(r, [f.x, f.y]);
    }
  }

  /* ================= DRAWING ================= */
  var PAL = { o: 'rgba(14,11,8,0.9)', w: '#e8dcc0', r: '#d23a2a', R: '#8e1d14', y: '#ffd27a', g: '#8a8478', k: '#2a241c', b: '#6f9ab8' };
  var GLYPHS = {
    camp:   ['....o....', '...owo...', '..owrwo..', '.owwrwwo.', 'owwwrwwwo', 'ooooooooo'],
    danger: ['....o....', '...ooo...', '..orwro..', '..orwro..', '.orrwrro.', '.orrrrro.', 'orrrwrrro', 'ooooooooo'],
    loot:   ['.ooooooo.', 'owwwwwwwo', 'oooowoooo', 'owwwwwwwo', 'owwwwwwwo', '.ooooooo.'],
    shop:   ['...oo....', '.oooooo..', 'owwwwwwo.', 'owyyyywoo', 'owyyyywo.', 'owwwwwwo.', '.oooooo..'],
    word:   ['oo.......', 'owooooo..', 'owwwwwwo.', 'owwwwwwo.', 'owooooo..', 'oo.......', 'oo.......', 'oo.......'],
    cross:  ['..ooo..', '..owo..', 'oooworo', 'owwwwwo', 'ooowooo', '..owo..', '..owo..', '..owo..', '.ooooo.'],
    skull:  ['.ooooooo.', 'orrrrrrro', 'orwwrwwro', 'orwwrwwro', 'orrrrrrro', '.orrwrro.', '.orororo.', '..ooooo..'],
    dead:   ['.ooooooo.', 'oggggggwo', 'ogkkgwwgo', 'ogkkwkkgo', 'oggwggggo', '.owgkgko.', 'w.ogogo..', '..ooooo..'],
    tag:    ['ooooooooo', 'okkkkkkko', 'okrkkkrko', 'okkrkrkko', 'okkkrkkko', 'okkrkrkko', 'okrkkkrko', 'ooooooooo'],
    flyer:  ['ooooooo.', 'owwwwwo.', 'owrrrwo.', 'owwwwwo.', 'owrwrwo.', 'owwwwwo.', 'ooooooo.'],
    radio:  ['.....o...', '....o.o..', '.....o...', 'ooooooooo', 'okkkkwkko', 'okrrkwkwo', 'okkkkwkko', 'ooooooooo'],
    bar:    ['.ooooo..', 'owwwwwoo', 'oyyyyyo.o', 'oyyyyyo.o', 'oyyyyyoo.', 'oyyyyyo.', '.ooooo..'],
    rubble: ['....o....', '..ogo.o..', '.oggo.ogo', 'oggggoggo', 'ogkggggko', 'ooooooooo'],
    door:   ['.ooooo.', 'owwwwwo', 'owkkkwo', 'owkkkwo', 'owkkywo', 'owkkkwo', 'ooooooo'] };
  function glyph(name, s) {
    var k = name + ':' + s; if (GLY[k]) return GLY[k];
    var rows = GLYPHS[name] || GLYPHS.camp, h = rows.length, w = 0; rows.forEach(function (r) { w = Math.max(w, r.length); });
    var c = document.createElement('canvas'); c.width = w * s; c.height = h * s; var x = c.getContext('2d');
    for (var j = 0; j < h; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch === '.') continue; x.fillStyle = PAL[ch] || PAL.w; x.fillRect(i * s, j * s, s, s); }
    GLY[k] = c; return c;
  }
  function scale() { var W = 390; try { W = CVW; } catch (e) {} return W >= 900 ? 3 : 2; }
  function blit(gx, name, sx, sy, a) {
    var c = glyph(name, scale()); gx.globalAlpha = a == null ? 1 : a;
    gx.drawImage(c, Math.round(sx - c.width / 2), Math.round(sy - c.height));
    gx.globalAlpha = 1; return c;
  }
  function plate(gx, t, sx, sy, col, bg) {
    gx.font = font(scale() === 3 ? 11 : 9); gx.textAlign = 'center'; gx.textBaseline = 'alphabetic';
    var w = gx.measureText(t).width + 6, h = scale() === 3 ? 13 : 11;
    gx.fillStyle = bg || 'rgba(14,11,8,0.82)'; gx.fillRect(Math.round(sx - w / 2), Math.round(sy), Math.round(w), h);
    gx.fillStyle = col || PAL.w; gx.fillText(t, Math.round(sx), Math.round(sy + h - 3));
    gx.textAlign = 'start';
  }
  function onGlass(p, m) { var W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {} m = m || 30; return p.sx > -m && p.sx < W + m && p.sy > -m && p.sy < H + m; }
  function ground(x, y, ox, oy) { var p = iso(x, y, ox, oy); return { sx: p.sx, sy: p.sy + TH * 0.5 }; }

  /* the lights back on: warm windows over his district's buildings (a soft warm glow when the city is small) */
  function drawLit(gx, ox, oy, beat) {
    var night = false; try { night = isNight(); } catch (e) {}
    S.lit.forEach(function (L) {
      for (var dy = -L.r; dy <= L.r; dy++) for (var dx = -L.r; dx <= L.r; dx++) {
        var x = L.x + dx, y = L.y + dy; if (walk(x, y) || hidden(x, y)) continue;
        var p = ground(x, y, ox, oy); if (!onGlass(p, 60)) continue;
        var h0 = hash(x * 31 + 7, y * 17 + 3);
        if ((h0 & 3) === 0) continue;   /* not every building: a quarter stay dark, the power is back, not everywhere */
        if (TW < 6) { gx.globalAlpha = night ? 0.6 : 0.3; gx.fillStyle = PAL.y; gx.fillRect(Math.round(p.sx), Math.round(p.sy - 2), 1, 1); continue; }
        var k = 1 + ((h0 >>> 4) & 1), hh = TH * 2.2, s = Math.max(1, Math.round(TW / 9));
        for (var i = 0; i < k; i++) {
          var u = ((h0 >>> (i * 3 + 6)) & 7) / 7 - 0.5, v = 0.25 + ((h0 >>> (i * 3 + 14)) & 7) / 10;
          var wx = Math.round(p.sx + u * TW * 0.5), wy = Math.round(p.sy - TH * 0.4 - v * hh);
          var on = ((h0 >>> (i + 20)) + beat) % 13 !== 0;   /* one in thirteen flickers on the beat */
          gx.globalAlpha = on ? (night ? 0.95 : 0.75) : 0.2; gx.fillStyle = PAL.y;
          gx.fillRect(wx, wy, s, s + 1);
          if (night && on) { gx.globalAlpha = 0.18; gx.fillRect(wx - s, wy - s, s * 3, s * 3 + 1); }   /* the glow round a lit window at night */
        }
      }
    });
    gx.globalAlpha = 1;
    LAST.drew.lit = S.lit.length;
  }
  function draw(ox, oy) {
    if (!S) return;
    try { tick(); } catch (e) {}
    var gx = null; try { gx = g; } catch (e) { return; }
    LAST.ox = ox; LAST.oy = oy; LAST.tw = TW; LAST.th = TH; LAST.drew = {};
    var beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    gx.save(); gx.imageSmoothingEnabled = false;
    try {
      var stranger = !bench();
      if (stranger) {
        if (S.lit.length) drawLit(gx, ox, oy, beat);
        S.open.forEach(function (k) { var n = N() || 96, x = k % n, y = Math.floor(k / n); var p = ground(x, y, ox, oy); if (onGlass(p)) { blit(gx, 'rubble', p.sx, p.sy + 2); LAST.drew.open = (LAST.drew.open | 0) + 1; } });
        S.places.forEach(function (P) { var p = ground(P.x, P.y, ox, oy); if (!onGlass(p)) return; blit(gx, 'door', p.sx + 6 * scale() / 2, p.sy - 2); plate(gx, P.name, p.sx, p.sy + 1, PAL.y); LAST.drew.places = (LAST.drew.places | 0) + 1; });
        var s = S.boss.sign;
        if (s && !hidden(s.x, s.y)) { var ps = ground(s.x, s.y, ox, oy); if (onGlass(ps)) { blit(gx, s.kind, ps.sx, ps.sy - 2, (beat % 2) ? 1 : 0.7); LAST.drew.sign = { x: Math.round(ps.sx), y: Math.round(ps.sy) }; } }
        for (var n in S.boss.found) {
          var f = S.boss.found[n], down = !!S.boss.fallen[n], pb = ground(f.x, f.y, ox, oy);
          if (onGlass(pb, 0)) {
            var placed = down && S.places.some(function (P) { return P.n === n; });
            blit(gx, down ? 'dead' : 'skull', placed ? pb.sx - 14 * scale() / 2 : pb.sx, pb.sy - 2, down ? 0.9 : ((beat % 2) ? 1 : 0.8));
            if (!placed) plate(gx, n, pb.sx, pb.sy, down ? PAL.g : '#ff6a55');   /* a fallen boss whose place stands there gives his plate to the place */
            LAST.drew.boss = LAST.drew.boss || []; LAST.drew.boss.push({ n: n, x: Math.round(pb.sx), y: Math.round(pb.sy), down: down });
          } else if (!down) edge(gx, pb, n);
        }
      }
      /* his pins and the crosses: every zoom, one size, the game's own ink */
      S.crosses.forEach(function (c) {
        var p = ground(c.x, c.y, ox, oy); p.sx += (c.k | 0) * 9 * (scale() / 2); if (!onGlass(p)) return;
        blit(gx, 'cross', p.sx, p.sy);
        if (TW >= 12) plate(gx, c.name, p.sx, p.sy + 1, PAL.w);
        LAST.drew.crosses = (LAST.drew.crosses | 0) + 1;
      });
      S.pins.forEach(function (P) {
        var p = ground(P.x, P.y, ox, oy); if (!onGlass(p)) return;
        blit(gx, P.k, p.sx, p.sy);
        if (P.k === 'word' && P.w) plate(gx, P.w, p.sx + 6, p.sy + 1, PAL.w);
        LAST.drew.pins = (LAST.drew.pins | 0) + 1;
      });
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
  }
  /* a found boss off the glass: his name waits at the edge of the OPEN glass (RUN's mapOpenArea: the glass less the phone's margin,
     rule 213(c)), on the line from the focus to him (the jobs' way), never under the phone */
  function edge(gx, p, n) {
    var A = null; try { A = typeof root.mapOpenArea === 'function' ? root.mapOpenArea() : null; } catch (e) { A = null; }
    var x0 = A ? A.x0 : 0, y0 = A ? A.y0 : 0, x1 = A ? A.x1 : CVW, y1 = A ? A.y1 : CVH, cx = A ? A.cx : CVW / 2, cy = A ? A.cy : CVH / 2;
    var dx = p.sx - cx, dy = p.sy - cy;
    var tx = dx > 0 ? (x1 - 34 - cx) / dx : dx < 0 ? (x0 + 34 - cx) / dx : 1e9, ty = dy > 0 ? (y1 - 40 - cy) / dy : dy < 0 ? (y0 + 40 - cy) / dy : 1e9;
    var t = Math.max(0, Math.min(tx, ty)), ex = cx + dx * t, ey = cy + dy * t;
    blit(gx, 'skull', ex, ey, 0.85); plate(gx, n, ex, ey + 1, '#ff6a55');
    LAST.drew.edge = (LAST.drew.edge | 0) + 1; LAST.drew.edgeAt = { x: Math.round(ex), y: Math.round(ey), open: A ? [A.x0, A.y0, A.x1, A.y1] : null };
  }

  /* ================= (1) THE UNSEEN CITY, FAINT UNDER STATIC ================= */
  /* the tape: grey snow with scanlines and a tracking line. SOFT when the whole city is on the glass (a block a few pixels wide): the
     same tape with half the grain, so the valley's shape reads from the far stop (Pocket City 2's whole city, rule 6) */
  function snowTile(soft) {
    var key = soft ? 'snowSoft' : 'snow'; if (FAINT[key]) return FAINT[key];
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d'), im = x.createImageData(128, 128), d = im.data, r = 90210, amp = soft ? 22 : 44, line = soft ? 7 : 14;
    for (var j = 0; j < 128; j++) for (var i = 0; i < 128; i++) {
      r = (r * 1103515245 + 12345) >>> 0;
      var v = 112 + (soft ? 11 : 0) + ((r >>> 24) % amp) - ((j % 2) ? 0 : line);   /* grey tape snow, every other line darker (scanlines); grey, so no colour comes through it */
      if (j % 64 === 7) v += 30;                            /* a tracking line */
      var k = (j * 128 + i) * 4; d[k] = v; d[k + 1] = v; d[k + 2] = v; d[k + 3] = 255;
    }
    x.putImageData(im, 0, 0); FAINT[key] = c; return c;
  }
  /* RUN's fogDraw hands over here; true means it is drawn and RUN's dark fill is not.
     ONE SMALL CANVAS, ONE DRAW BACK. The painted land already on the glass is copied DOWN into a canvas a third of the
     glass each way (one pixel of the tape for every three of the glass: the map's own pixels on the phone, 390 x 736; 480 x 279 on
     the computer), and
     everything happens there: SATURATION with grey (the colour goes: who is there, what is open, whose paint), MULTIPLY with
     the tape snow (the shape stays, dark, grained, scanlined), DESTINATION-IN with RUN's own fog mask (only what he has not
     seen is kept). Then it goes back over the glass in one plain draw, three glass pixels to one: the unseen city is drawn
     with a third of the pixels, which is what 'its shape and not its detail' means on the glass. MEASURED: blending the full
     glass twice cost 12 ms a frame more than RUN's dark on the phone and 20 more on the computer (the gate's software glass);
     this way the heavy work is done on a ninth of the pixels. */
  function fogDraw(ox, oy) {
    if (!FAINT.on || !S) return false;
    var F; try { F = FOG; } catch (e) { return false; }
    if (!F || !F.cv) return false;
    var gx = g, cnv = gx.canvas, GW = cnv.width, GH = cnv.height;
    var K3 = 3, q = 1 / K3;   /* one pixel of the tape for every three of the glass, on every device: the phone's own map pixel */
    var W = Math.max(1, Math.ceil(GW / K3)), H = Math.max(1, Math.ceil(GH / K3));
    if (!FAINT.cv || FAINT.cv.width !== W || FAINT.cv.height !== H) {
      FAINT.cv = document.createElement('canvas'); FAINT.cv.width = W; FAINT.cv.height = H; FAINT.x = FAINT.cv.getContext('2d'); FAINT.pat = null; FAINT.far = null;
    }
    var x = FAINT.x, m = gx.getTransform(), S2 = F.S, K = F.K, n = F.N, beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    var soft = TW < 6;
    if (!FAINT.pat || FAINT.soft !== soft) { FAINT.pat = x.createPattern(snowTile(soft), 'repeat'); FAINT.soft = soft; }
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
    x.globalCompositeOperation = 'copy'; x.imageSmoothingEnabled = true; x.drawImage(cnv, 0, 0, W * K3, H * K3, 0, 0, W, H);   /* the land, down */
    x.globalCompositeOperation = 'saturation'; x.fillStyle = '#808080'; x.fillRect(0, 0, W, H);                        /* no colour */
    x.globalCompositeOperation = 'multiply'; x.fillStyle = FAINT.pat; x.fillRect(0, 0, W, H);                          /* the tape */
    x.globalCompositeOperation = 'destination-in'; x.imageSmoothingEnabled = true;                                     /* only the unseen */
    x.setTransform(m.a * q, m.b * q, m.c * q, m.d * q, m.e * q, m.f * q);
    x.transform(TW / 2 / S2, TH / 2 / S2, -TW / 2 / S2, TH / 2 / S2, ox, oy - K * TH);
    x.drawImage(F.cv, 0, 0);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over';
    gx.save(); gx.setTransform(1, 0, 0, 1, 0, 0); gx.imageSmoothingEnabled = false; gx.globalAlpha = 1;
    gx.drawImage(FAINT.cv, 0, 0, W, H, 0, 0, W * K3, H * K3);
    /* the tracking band: a brighter strip of the same tape rolling down the glass on the beat */
    var bh = Math.max(3, Math.round(H * 0.035)), by = (beat * 29) % (H + bh) - bh, y0 = Math.max(0, by), y1 = Math.min(H, by + bh);
    if (y1 > y0) { gx.globalCompositeOperation = 'screen'; gx.globalAlpha = (beat % 2) ? 0.3 : 0.24; gx.drawImage(FAINT.cv, 0, y0, W, y1 - y0, 0, y0 * K3, W * K3, (y1 - y0) * K3); }
    gx.restore();
    /* past the region's own square (the far fill, RUN's): the same tape, darker, as one path with the square cut out */
    try {
      if (!FAINT.far) { var fc = document.createElement('canvas'); fc.width = fc.height = 128; var fx = fc.getContext('2d'); fx.drawImage(snowTile(), 0, 0); fx.globalCompositeOperation = 'multiply'; fx.fillStyle = '#5a5a5a'; fx.fillRect(0, 0, 128, 128); FAINT.far = gx.createPattern(fc, 'repeat'); }
      var c1 = iso(-K, -K, ox, oy), c2 = iso(n + K, -K, ox, oy), c3 = iso(n + K, n + K, ox, oy), c4 = iso(-K, n + K, ox, oy);
      gx.save(); gx.beginPath(); gx.rect(-4, -4, CVW + 8, CVH + 8); gx.moveTo(c1.sx, c1.sy); gx.lineTo(c2.sx, c2.sy); gx.lineTo(c3.sx, c3.sy); gx.lineTo(c4.sx, c4.sy); gx.closePath();
      gx.fillStyle = FAINT.far; gx.fill('evenodd'); gx.restore();
    } catch (e) {}
    LAST.faint = (LAST.faint | 0) + 1;
    return true;
  }

  /* ================= THE FINGER: hold to pin ================= */
  var HOLD = null, FINGERS = {};
  function toCanvas(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * CVW / r.width, y: (e.clientY - r.top) * CVH / r.height }; }
  function blockAt(c) { try { var b = CBcellAt(c.x, c.y); return b ? [b[0] | 0, b[1] | 0] : null; } catch (e) { return null; } }
  function bind() {
    if (BOUND) return; var el = null; try { el = cv; } catch (e) { return; } if (!el || !el.addEventListener) return;
    BOUND = true;
    var cancel = function () { if (HOLD && HOLD.t) clearTimeout(HOLD.t); HOLD = null; };
    el.addEventListener('pointerdown', function (e) {
      FINGERS[e.pointerId] = 1;
      if (Object.keys(FINGERS).length > 1) { cancel(); return; }   /* two fingers is a pinch */
      try { if (MODE !== 'city') return; } catch (_e) { return; }
      if (e.button != null && e.button > 0) return;
      cancel();
      var c = toCanvas(e);
      HOLD = { id: e.pointerId, c: c, x: e.clientX, y: e.clientY, t: setTimeout(function () { held(HOLD); }, 550) };
    });
    el.addEventListener('pointermove', function (e) { if (HOLD && e.pointerId === HOLD.id && Math.abs(e.clientX - HOLD.x) + Math.abs(e.clientY - HOLD.y) > 9) cancel(); });
    var up = function (e) { delete FINGERS[e.pointerId]; if (HOLD && e.pointerId === HOLD.id) cancel(); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('contextmenu', function (e) {   /* the computer's right button is the same as a held finger */
      e.preventDefault(); cancel(); try { if (MODE !== 'city') return; } catch (_e) { return; }
      if (MENU && MENU.style.display !== 'none') return;
      held({ c: toCanvas(e), x: e.clientX, y: e.clientY });
    });
  }
  function held(h) {
    if (!h) return; HOLD = null;
    try { CB._tapStart = null; } catch (e) {}   /* RUN's tap never fires for a held finger: holding is not travelling */
    var b = blockAt(h.c); if (!b) return;
    menu(b, h.x, h.y);
  }
  /* what stands over the map's corners (the phone, the bar, the heal button), in this page or the shell's, in this page's pixels */
  function obstacles() {
    var out = [], add = function (q, dx, dy) { out.push({ left: q.left - dx, top: q.top - dy, right: q.right - dx, bottom: q.bottom - dy }); };
    var look = function (D, pts, dx, dy, skip) {
      pts.forEach(function (pt) { var els = []; try { els = D.elementsFromPoint(pt[0], pt[1]) || []; } catch (e) {}
        for (var i = 0; i < els.length; i++) { var el = els[i]; if (skip.indexOf(el) >= 0 || el === D.body || el === D.documentElement) break;
          var q = el.getBoundingClientRect(); if (q.width >= 60 && q.height >= 40 && q.width < innerWidth * 0.85) { add(q, dx, dy); break; } } }); };
    var corners = function (L, T, R, B) { return [[R - 24, T + 60], [L + 24, T + 60], [R - 24, B - 50], [L + 24, B - 50], [R - 90, B - 40], [L + 90, B - 40]]; };
    try { look(document, corners(0, 0, innerWidth, innerHeight), 0, 0, [cv, MENU]); } catch (e) {}
    try { var fe = root.frameElement, P = root.parent && root.parent !== root ? root.parent.document : null;
      if (fe && P) { var f = fe.getBoundingClientRect(); look(P, corners(f.left, f.top, f.right, f.bottom), f.left, f.top, [fe]); } } catch (e) {}
    return out;
  }
  function menu(b, cx, cy) {
    if (!MENU) {
      MENU = document.createElement('div'); MENU.id = 'hismapmenu';
      MENU.style.cssText = 'position:fixed;z-index:9000;display:none;background:#16120d;border:1px solid rgba(232,220,192,0.55);box-shadow:0 2px 0 #000;padding:6px;font:700 10px monospace;color:#e8dcc0;letter-spacing:1px;touch-action:none;user-select:none';
      ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend'].forEach(function (ev) { MENU.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      document.body.appendChild(MENU);
      document.addEventListener('pointerdown', function (e) { if (MENU.style.display !== 'none' && !MENU.contains(e.target)) close(); }, true);
    }
    try { MENU.style.fontFamily = font(10).replace(/^700 10px /, ''); } catch (e) {}
    OPEN = { x: b[0], y: b[1] };
    MENU.innerHTML = '';
    var pi = pinAt(b[0], b[1]), ci = crossAt(b[0], b[1]);
    var head = document.createElement('div'); head.style.cssText = 'margin:0 2px 5px;opacity:0.8';
    head.textContent = ci >= 0 ? S.crosses[ci].name : (pi >= 0 ? (S.pins[pi].w || WORDS[S.pins[pi].k]) : 'PIN IT');   /* draft:true */
    MENU.appendChild(head);
    var rowEl = document.createElement('div'); rowEl.style.cssText = 'display:flex;gap:4px';
    KINDS.forEach(function (k) {
      var bt = document.createElement('button'); bt.dataset.k = k;
      bt.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px;min-width:44px;min-height:44px;padding:5px 3px;background:#231d16;border:1px solid rgba(232,220,192,0.3);color:#e8dcc0;font:inherit;font-size:8px;letter-spacing:1px';
      var gc = glyph(k, 3), im = document.createElement('canvas'); im.width = gc.width; im.height = gc.height; im.getContext('2d').drawImage(gc, 0, 0); im.style.imageRendering = 'pixelated';
      bt.appendChild(im); var t = document.createElement('span'); t.textContent = k === 'word' ? 'WORD' : WORDS[k]; bt.appendChild(t);
      bt.addEventListener('click', function () { if (k === 'word') return askWord(); drop(OPEN.x, OPEN.y, k); close(); });
      rowEl.appendChild(bt);
    });
    MENU.appendChild(rowEl);
    if (pi >= 0 || ci >= 0) {
      var rm = document.createElement('button'); rm.dataset.k = 'remove'; rm.textContent = 'TAKE IT OFF';   /* draft:true */
      rm.style.cssText = 'margin-top:5px;width:100%;min-height:36px;background:#2b1410;border:1px solid #8e1d14;color:#ff8a7a;font:inherit';
      rm.addEventListener('click', function () { lift(OPEN.x, OPEN.y); close(); });
      MENU.appendChild(rm);
    }
    MENU.style.display = 'block';
    var r = MENU.getBoundingClientRect(), W = innerWidth, H = innerHeight, obs = obstacles();
    /* below his finger first (the phone sits up in his corner), then above; never under the phone or the bar (rule 213(c)) */
    var hits = function (l, t) { var a = 0; obs.forEach(function (q) { var w = Math.min(l + r.width, q.right) - Math.max(l, q.left), h = Math.min(t + r.height, q.bottom) - Math.max(t, q.top); if (w > 0 && h > 0) a += w * h; }); return a; };
    var left = Math.max(6, Math.min(W - r.width - 6, cx - r.width / 2)), best = null;
    [cy + 26, cy - r.height - 26].concat(obs.map(function (q) { return q.bottom + 6; }), obs.map(function (q) { return q.top - r.height - 6; })).forEach(function (t) {
      t = Math.max(6, Math.min(H - r.height - 6, t)); var a = hits(left, t), d = Math.abs(t - cy);
      if (!best || a < best.a || (a === best.a && d < best.d)) best = { t: t, a: a, d: d }; });
    MENU.style.left = Math.round(left) + 'px'; MENU.style.top = Math.round(best.t) + 'px';
    LAST.menuHits = best.a; LAST.menuObs = obs.length;
    root.__HIS_MAP_MENU = { at: [b[0], b[1]], open: true };
  }
  function askWord() {
    var box = document.createElement('div'); box.style.cssText = 'display:flex;gap:4px;margin-top:5px';
    var inp = document.createElement('input'); inp.maxLength = 14; inp.placeholder = 'YOUR WORD'; inp.id = 'hismapword';
    inp.style.cssText = 'flex:1;min-height:36px;background:#0e0b08;border:1px solid rgba(232,220,192,0.5);color:#e8dcc0;font:inherit;font-size:12px;padding:0 6px;text-transform:uppercase;user-select:text;-webkit-user-select:text';
    var ok = document.createElement('button'); ok.textContent = 'PIN'; ok.dataset.k = 'wordok';
    ok.style.cssText = 'min-width:44px;min-height:36px;background:#231d16;border:1px solid rgba(232,220,192,0.5);color:#e8dcc0;font:inherit';
    var go = function () { if (drop(OPEN.x, OPEN.y, 'word', inp.value)) close(); };
    ok.addEventListener('click', go); inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') go(); });
    box.appendChild(inp); box.appendChild(ok); MENU.appendChild(box);
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 0);
  }
  function close() { if (MENU) MENU.style.display = 'none'; OPEN = null; root.__HIS_MAP_MENU = { open: false }; }

  /* ---------- a fight's end: the boss, and the dead ---------- */
  if (typeof document === 'undefined' || !root.addEventListener) { root.BohemiaHisMap = { node: true }; return; }   /* a page file: under node it says so and stops */
  root.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END' || !S) return;
    var o = d.outcome || {};
    root.__HIS_MAP_LAST_END = { o: o, fighting: S.fighting ? S.fighting.n : null, at: Date.now() };   /* what the fight said, for the gate */
    setTimeout(function () { try { deadCheck(); } catch (e) {} try { fightEnded(o); } catch (e) {} FIGHT_AT = null; }, 400);   /* after CAMP's list has the dead */
  });

  load(); loadData();
  root.BohemiaHisMap = {
    /* RUN's hooks (__HIS_MAP__) */
    fogDraw: fogDraw, draw: draw, newGame: newGame,
    /* reading, for the gate and for RUN, WORLD, UI */
    state: function () { return S; }, data: function () { return DATA; }, last: function () { return LAST; },
    faint: function (on) { if (on != null) FAINT.on = !!on; return FAINT.on; },
    size: function () { return FAINT.cv ? { w: FAINT.cv.width, h: FAINT.cv.height, bytes: FAINT.cv.width * FAINT.cv.height * 4 + 4 * 128 * 128 * 4 } : null; },
    drop: drop, lift: lift, pins: function () { return S ? S.pins.slice() : []; }, crosses: function () { return S ? S.crosses.slice() : []; },
    fell: fell, next: nextRow, placeSign: placeSign, deadCheck: deadCheck, menu: menu, close: close,
    reload: load, KEY: KEY
  };
})(typeof window !== 'undefined' ? window : this);
