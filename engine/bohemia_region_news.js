/* ============================================================================
   BOHEMIA -- THE NEWS DOWN THE ROAD: WHAT EACH TOWN IS TALKING ABOUT  (10/18/26, WORLD lane)
   Row [the news down the road, as data] (the coordinator, from ECONOMY's 10/18 finding: the next town has news
   94 percent of the time and the bar names none of it; RUN TWO carries [the bar names the news]).
   END STATE asked for: for each of the region's places, what happened there lately (a raid, a price jump, a crew
   passing, a death) as data the bar can read, drawn from the region's own events, never invented text.

   WHAT WAS MEASURED BEFORE THIS FILE: the region's 35 places (engine/BOHEMIA_REGION_LAND.json: 34 past the valley
   and Henderson) had NO events at all. Everything that happens in the game happens to the valley's 14 seats
   (WORLD's parties, FACTIONS' raid ledger); out there the only thing a town ever had was the settlement screen's
   weekly dice (sickness, market day), rolled by its name. Nobody moved between Jean and Primm, nobody raided
   Searchlight, nothing a keeper could say had happened.

   SO THE REGION GETS ITS OWN BUSINESS, THE BATTLE BROTHERS WAY (rule 41, the world map page of the library,
   reference/library/battle_brothers/01_WORLDMAP.md, and the wiki's situations): a settlement sends caravans to
   the next settlement and patrols along its roads; a lair sends raiders at the settlements near it. Here:
     WHO SENDS     every place, by its tier, BohemiaTowns.REACH's own table (fortress 3, town 2, camp 1 a week):
                   the business a place has abroad, the same number that sizes the valley's parties.
     WHAT IT SENDS a 'base' place (a settlement) sends a caravan and a patrol by turns; a 'fight' place (the
                   dam, the solar fields, the cave: places you go to fight) sends crews. His three agendas
                   (bohemia_parties.js AGENDAS), nothing new.
     WHERE         a neighbour within reach, 106 blocks (Battle Brothers' 30 of 140 tiles scaled, ECONOMY day 75,
                   the number RUN TWO's bar already uses); a caravan and a crew go to a settlement, a patrol walks
                   half way to a neighbour and back.
     HOW           the real ground: the cheapest road by the land's own minutes a block (5.376 a paved block,
                   10.752 open, 19.354 hills; water and peaks cannot be crossed), so a caravan from Jean to Primm
                   runs down I-15 and passes what I-15 passes, and arrives when the clock says.
     WHAT HAPPENS  in the order the clock reaches it:
                   a crew that meets a caravan on the road ambushes it (the caravan never arrives; Battle
                     Brothers' Ambushed Trade Routes on both its towns: sell +10%);
                   a crew that meets a patrol is stopped by it (the patrol is holding a border);
                   a crew that reaches its town raids it (Raided: items -50%, a week, FACTIONS' card);
                   a caravan that reaches its town comes in (Well Supplied: buy -10%, a week);
                   every fight strikes one man down, and one in five of the struck dies (his 9/27 death rule,
                     laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md: 'a 20% chance to die');
                   a price jump is a town's buy or sell price moving by the situation that just began or ended;
                   a party passing within two blocks of a town is seen there.
     THE DICE      the settlement screen's own weekly roll (engine/bohemia_livingmap.js traitsFor, the same
                   line), so the news of a market day is the market day you find.
   Every number above is somebody else's table, cited; this file adds the two-block 'seen from town' and the
   hour it steps the clock by. TUNING owns all of them (rule 38g); draft:true, tuned:false.

   WHAT IT GIVES (data, no text: the words come from a mouth, RUN TWO's; rule 'A QUEST IS PEOPLE, PLACES AND
   THINGS'):
     world(land, compass, seed, opts)   -> W, once per game (the places, their roads, a memo of the weeks)
     items(W, name, day, window)        -> what happened at that place in the last `window` days, newest first:
                                           { kind, place, day, ago, agenda, from, to, side, price, party, cell }
                                           (price: { side: 'buy'|'sell', move: percent, why: the situation, began };
                                            side on a death or a fight: who it fell on, 'caravan' 'crew' 'town')
                                           kind: left, passing, arrived, raid, ambush, stopped, death, price,
                                                 sickness, market_day
     near(W, here, day, opts)           -> the places within reach of a block, nearest first, each with its items
     week(W, w)                         -> the week's events (for a gate, a map, a feed)
   Pure: the same land, compass, seed and day give the same answer, whatever was asked before.
   Gate: gates/the_news_down_the_road_gate.js. Record: records/BOHEMIA_WORLD_THE_NEWS_DOWN_THE_ROAD_10_18_26.md
   ========================================================================== */
(function (root) {
'use strict';
var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
function DEP(file, global) {
  if (HASREQ) { try { return require('./' + file + '.js'); } catch (e) { return null; } }
  return root[global] || null;
}

var REACH_BLOCKS = 106;          /* ECONOMY day 75 / RUN TWO: Battle Brothers' 30 of 140 tiles, scaled to 496 */
var SEEN_BLOCKS = 2;             /* MINE, draft: a party within two blocks of a town is seen from it (768 m) */
var STEP_MINUTES = 5;            /* MINE: the road is checked every five minutes, under one paved block's 5.376, so two
                                    parties closing at two blocks a step can never slip past each other */
var MEET_BLOCKS = 1;             /* two parties on one block or the next, at one moment, meet */
var SITUATION_DAYS = 7;          /* records/target/bb/arrival_traits.json duration_days: one week */
var DEATH_CHANCE = 0.2;          /* his 9/27: 'a 20% chance to die, else a debilitating injury' */
var PERIOD = 7;                  /* a week: the dice's period (settlement_traits.json roll.period_days) */
var HILL_MINUTES = 19.354;
var TIER = { camp: 1, town: 2, fortress: 3 };   /* the size order BohemiaTowns.REACH already ranks places by */       /* the land's own rough-ground minutes a block (BOHEMIA_REGION_LAND.json speeds.hills) */
/* Battle Brothers' situations, the price side (records/target/bb/price_table.json situationMultipliers and
   arrival_traits.json): a caravan in, a trade road ambushed */
var SITUATIONS = {
  well_supplied: { buy: -0.1, sell: 0 },
  ambushed_trade_routes: { buy: 0, sell: 0.1 },
  raided: { buy: 0, sell: 0, items: -0.5 }
};
var KINDS = ['left', 'passing', 'arrived', 'raid', 'ambush', 'stopped', 'death', 'price', 'sickness', 'market_day'];
var TUNED = false, DRAFT = true;

function seedOf(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { var x = seed >>> 0 || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
function cheb(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }

/* ---- THE WORLD: the places and the ground, once per game ---- */
function world(land, compass, seed, opts) {
  opts = opts || {};
  compass = compass || { e: 'x1' };
  var json = land.json || {}, N = land.N, K = land.K, D = land.D;
  var places = land.places(compass).map(function (p) { return { name: p.name, x: p.x, y: p.y, tier: p.tier, role: p.role || 'base', inValley: false }; });
  (json.inValley || []).forEach(function (p) {
    var x = land.mirrored && land.mirrored(compass) ? N - 1 - p.x : p.x;
    places.push({ name: p.name, x: x, y: p.y, tier: p.tier, role: p.role || 'base', inValley: true });
  });
  places.sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
  var T = DEP('bohemia_towns', 'BohemiaTowns'), REACH = (T && T.REACH) || { fortress: 3, town: 2, camp: 1 };
  /* the ground's minutes a block, read once (water and peaks: Infinity) */
  var MIN = new Float32Array(D * D);
  for (var y = -K; y < N + K; y++) for (var x = -K; x < N + K; x++) {
    var a = land.at(x, y, compass); MIN[(y + K) * D + (x + K)] = (a && a.minutes != null && a.pass !== 3) ? a.minutes : Infinity;
  }
  places.forEach(function (p) {
    p.sends = Object.prototype.hasOwnProperty.call(REACH, p.tier) ? REACH[p.tier] : REACH.camp;
    p.neighbours = places.filter(function (q) { return q !== p && cheb(p, q) <= REACH_BLOCKS; }).map(function (q) { return q.name; });
    if (!p.neighbours.length) {        /* never alone: the nearest place, however far */
      var best = null; places.forEach(function (q) { if (q !== p && (!best || cheb(p, q) < cheb(p, best))) best = q; });
      if (best) p.neighbours = [best.name];
    }
  });
  var byName = {}; places.forEach(function (p) { byName[p.name] = p; });
  return { V: 1, seed: (seed >>> 0) || 0, compass: compass, N: N, K: K, D: D, MIN: MIN, places: places, byName: byName,
           routes: {}, weeks: [], tail: [], sit: {}, parties: {}, REACH: REACH, draft: DRAFT, tuned: TUNED };
}

/* ---- THE ROAD: the cheapest way by the land's minutes, from one place to every neighbour at once ---- */
function routesFrom(W, A) {
  if (W.routes[A.name]) return W.routes[A.name];
  var K = W.K, D = W.D, MIN = W.MIN, pad = REACH_BLOCKS + 24;
  var x0 = Math.max(-K, A.x - pad), x1 = Math.min(W.N + K - 1, A.x + pad), y0 = Math.max(-K, A.y - pad), y1 = Math.min(W.N + K - 1, A.y + pad);
  var bw = x1 - x0 + 1, bh = y1 - y0 + 1, n = bw * bh;
  var dist = new Float64Array(n).fill(Infinity), prev = new Int32Array(n).fill(-1), done = new Uint8Array(n);
  var heap = [], hd = [];
  function push(i, d) { heap.push(i); hd.push(d); var c = heap.length - 1; while (c > 0) { var p = (c - 1) >> 1; if (hd[p] <= hd[c]) break; var t = heap[p]; heap[p] = heap[c]; heap[c] = t; var u = hd[p]; hd[p] = hd[c]; hd[c] = u; c = p; } }
  function pop() { var top = heap[0], last = heap.pop(), ld = hd.pop(); if (heap.length) { heap[0] = last; hd[0] = ld; var c = 0;
      for (;;) { var l = 2 * c + 1, r = l + 1, m = c; if (l < heap.length && hd[l] < hd[m]) m = l; if (r < heap.length && hd[r] < hd[m]) m = r; if (m === c) break;
        var t = heap[m]; heap[m] = heap[c]; heap[c] = t; var u = hd[m]; hd[m] = hd[c]; hd[c] = u; c = m; } } return top; }
  var li = function (x, y) { return (y - y0) * bw + (x - x0); };
  var mins = function (x, y) { return MIN[(y + K) * D + (x + K)]; };
  var targets = A.neighbours.map(function (nm) { return W.byName[nm]; }).filter(function (q) { return q.x >= x0 && q.x <= x1 && q.y >= y0 && q.y <= y1; });
  var left = targets.length, s = li(A.x, A.y);
  dist[s] = 0; push(s, 0);
  while (heap.length && left > 0) {
    var i = pop(); if (done[i]) continue; done[i] = 1;
    var cx = (i % bw) + x0, cy = ((i / bw) | 0) + y0;
    for (var t = 0; t < targets.length; t++) if (targets[t].x === cx && targets[t].y === cy) left--;
    var here = mins(cx, cy); if (here === Infinity && i !== s) continue;
    var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (var k = 0; k < 4; k++) {
      var nx = cx + nb[k][0], ny = cy + nb[k][1]; if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
      var j = li(nx, ny); if (done[j]) continue;
      var step = mins(nx, ny);                  /* a block costs what entering it costs on the clock */
      /* a place on a block the land says cannot be crossed (a marina, the dam's crest) is still reachable: its own block costs a hill's */
      if (step === Infinity && targets.some(function (q) { return q.x === nx && q.y === ny; })) step = HILL_MINUTES;
      if (step === Infinity) continue;
      var nd = dist[i] + step; if (nd < dist[j]) { dist[j] = nd; prev[j] = i; push(j, nd); }
    }
  }
  var out = {};
  targets.forEach(function (q) {
    var j = li(q.x, q.y); if (dist[j] === Infinity) return;
    var cells = [], c = j; while (c >= 0) { cells.push([(c % bw) + x0, ((c / bw) | 0) + y0, dist[c]]); c = prev[c]; }
    cells.reverse();
    out[q.name] = { to: q.name, cells: cells, minutes: dist[j] };
  });
  W.routes[A.name] = out;
  return out;
}

/* who sees a road go by: the places within SEEN_BLOCKS of each block, but never its two ends */
function seenAlong(W, route, from, to) {
  var seen = [];
  W.places.forEach(function (p) {
    if (p.name === from || p.name === to) return;
    for (var i = 0; i < route.cells.length; i++) {
      var c = route.cells[i];
      if (Math.max(Math.abs(c[0] - p.x), Math.abs(c[1] - p.y)) <= SEEN_BLOCKS) { seen.push({ place: p.name, i: i }); return; }
    }
  });
  return seen;
}

/* ---- THE WEEK'S BUSINESS: who leaves, by the place's own dice, and where they go ---- */
function sendsOfWeek(W, w) {
  var out = [];
  W.places.forEach(function (A) {
    var R = rng(seedOf(W.seed + ':' + A.name + ':sends:' + w));
    /* a place keeps a timetable: its n parties leave n times a week, evenly, from an hour its own dice set once
       (the Thursday caravan); so a week never passes without its business on the road */
    var phase = Math.floor(rng(seedOf(W.seed + ':' + A.name + ':timetable'))() * PERIOD * 24 / A.sends) / 24;
    for (var i = 0; i < A.sends; i++) {
      /* by turns: a settlement's trade and its patrol, a lair's take and its patrol. A fight place of fortress size
         (the dam's powerhouse, Creech's hangars, Mercury's gate, the solar fields, the intake) is a HOLD: it guards
         the prize it sits on and only patrols (Battle Brothers' legendary locations wait for you; its lairs roam) */
      var mine = (((i + w + (seedOf(A.name) & 1)) % 2) === 0), hold = A.role === 'fight' && A.tier === 'fortress';
      var agenda = (mine && !hold) ? (A.role === 'fight' ? 'crew' : 'caravan') : 'patrol';
      /* a caravan trades with a settlement; a crew goes for one it can take: a camp's crew is not enough for a town's
         walls (Battle Brothers' small lairs prey on villages, never on cities) */
      var pool = A.neighbours.map(function (nm) { return W.byName[nm]; }).filter(function (q) {
        return agenda === 'patrol' || (q.role !== 'fight' && (agenda !== 'crew' || TIER[q.tier] <= TIER[A.tier])); });
      var pick = R(), t0 = w * PERIOD + phase + i * PERIOD / A.sends, hunt = false;
      /* a town already picked clean is not worth the walk: a crew with nothing to take hunts the road instead,
         out and back like a patrol, for the caravans on it */
      if (agenda === 'crew') {
        var fresh = pool.filter(function (q) { return !standing(W, q.name, 'raided', t0); });
        if (!fresh.length) { hunt = true; pool = A.neighbours.map(function (nm) { return W.byName[nm]; }); } else pool = fresh;
      }
      /* a settlement's patrol holds the border it has: the road toward the nearest hold, when one is in reach */
      if (agenda === 'patrol' && A.role !== 'fight') {
        var holds = pool.filter(function (q) { return q.role === 'fight'; }).sort(function (a, b) { return cheb(A, a) - cheb(A, b) || (a.name < b.name ? -1 : 1); });
        if (holds.length) pool = [holds[0]];
      }
      if (!pool.length) continue;
      var B = pool[Math.floor(pick * pool.length) % pool.length];
      var r = routesFrom(W, A)[B.name]; if (!r) continue;
      /* the clock along the road, in days; a patrol (and a hunting crew) turns back half way */
      var cells = r.cells, sched = [];
      if (agenda === 'patrol' || hunt) {
        var half = Math.max(1, Math.floor(cells.length / 2)), outLeg = cells.slice(0, half + 1), tm = outLeg[outLeg.length - 1][2];
        outLeg.forEach(function (c) { sched.push([c[0], c[1], t0 + c[2] / 1440]); });
        for (var k = outLeg.length - 2; k >= 0; k--) sched.push([outLeg[k][0], outLeg[k][1], t0 + (2 * tm - outLeg[k][2]) / 1440]);
      } else cells.forEach(function (c) { sched.push([c[0], c[1], t0 + c[2] / 1440]); });
      var home = agenda === 'patrol' || hunt;
      out.push(W.parties[A.name + '/' + w + '/' + i] = { id: A.name + '/' + w + '/' + i, agenda: agenda, from: A.name, to: B.name, home: home, hunt: hunt, t0: t0,
                 t1: sched[sched.length - 1][2], sched: sched, seen: seenAlong(W, { cells: sched }, A.name, home ? A.name : B.name),
                 stoppedAt: null });
    }
  });
  return out;
}
function posAt(p, t) {                      /* the block a party stands on at day t (null off the road) */
  if (t < p.t0 || t > (p.stoppedAt != null ? p.stoppedAt : p.t1)) return null;
  var s = p.sched, lo = 0, hi = s.length - 1;
  while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (s[mid][2] <= t) lo = mid; else hi = mid - 1; }
  return s[lo];
}
function nearestPlace(W, x, y) {
  var best = null, bd = 1e9; W.places.forEach(function (p) { var d = Math.max(Math.abs(p.x - x), Math.abs(p.y - y)); if (d < bd) { bd = d; best = p; } });
  return best;
}

/* ---- THE CLOCK, A WEEK AT A TIME: everything that happens in [7w, 7w + 7) ---- */
function week(W, w) {
  if (w < 0) return { w: w, events: [] };
  for (var k = W.weeks.length; k <= w; k++) W.weeks[k] = runWeek(W, k);
  return W.weeks[w];
}
function runWeek(W, w) {
  var ta = w * PERIOD, tb = ta + PERIOD, ev = [];
  var fresh = sendsOfWeek(W, w);
  var live = W.tail.concat(fresh);                /* last week's parties still on the road, then this week's */
  var deathRoll = function (tag) { return rng(seedOf(W.seed + ':death:' + tag))() < DEATH_CHANCE; };
  /* the meetings, in the order the clock reaches them */
  var meets = [];
  for (var a = 0; a < live.length; a++) {
    var A = live[a]; if (A.agenda !== 'crew') continue;
    for (var b = 0; b < live.length; b++) {
      var B = live[b]; if (b === a || B.agenda === 'crew' || B.from === A.from) continue;
      var s = Math.max(A.t0, B.t0, ta), e = Math.min(A.t1, B.t1, tb);
      for (var t = Math.ceil(s * 1440 / STEP_MINUTES) * STEP_MINUTES / 1440; t < e; t += STEP_MINUTES / 1440) {
        var pa = posAt(A, t), pb = posAt(B, t);
        if (pa && pb && Math.max(Math.abs(pa[0] - pb[0]), Math.abs(pa[1] - pb[1])) <= MEET_BLOCKS) { meets.push({ t: t, crew: A, other: B, at: [pa[0], pa[1]] }); break; }
      }
    }
  }
  meets.sort(function (m, n) { return m.t - n.t || (m.crew.id < n.crew.id ? -1 : 1); });
  meets.forEach(function (m) {
    var C = m.crew, O = m.other;
    if (C.stoppedAt != null && C.stoppedAt <= m.t) return;
    if (O.stoppedAt != null && O.stoppedAt <= m.t) return;
    var town = nearestPlace(W, m.at[0], m.at[1]);
    if (O.agenda === 'caravan') {
      O.stoppedAt = m.t; C.stoppedAt = m.t;          /* the caravan is gone; the crew goes home with it */
      ev.push({ kind: 'ambush', place: town.name, day: m.t, agenda: 'crew', from: C.from, to: O.to, side: 'caravan', party: C.id, victim: O.id, cell: m.at });
      [O.from, O.to].forEach(function (nm) { situation(W, nm, 'ambushed_trade_routes', m.t, C.id, ev); });
      if (deathRoll(C.id + '>' + O.id)) ev.push({ kind: 'death', place: town.name, day: m.t, side: 'caravan', from: O.from, party: O.id, by: C.id, cell: m.at });
    } else {
      C.stoppedAt = m.t;                             /* the patrol holds the road */
      ev.push({ kind: 'stopped', place: town.name, day: m.t, agenda: 'patrol', from: O.from, to: C.to, side: 'crew', party: O.id, victim: C.id, cell: m.at });
      if (deathRoll(O.id + '>' + C.id)) ev.push({ kind: 'death', place: town.name, day: m.t, side: 'crew', from: C.from, party: C.id, by: O.id, cell: m.at });
    }
  });
  /* the leaving, the passing, the arriving, inside this week */
  live.forEach(function (p) {
    var end = p.stoppedAt != null ? p.stoppedAt : p.t1;
    if (p.t0 >= ta && p.t0 < tb) ev.push({ kind: 'left', place: p.from, day: p.t0, agenda: p.agenda, from: p.from, to: p.to, party: p.id, out: p.home ? 'and back' : null });
    p.seen.forEach(function (sn) {
      var t = p.sched[sn.i][2]; if (t < ta || t >= tb || t > end) return;
      ev.push({ kind: 'passing', place: sn.place, day: t, agenda: p.agenda, from: p.from, to: p.to, party: p.id, cell: [p.sched[sn.i][0], p.sched[sn.i][1]] });
    });
    if (p.stoppedAt == null && p.t1 >= ta && p.t1 < tb && !p.home) {
      if (p.agenda === 'caravan') { ev.push({ kind: 'arrived', place: p.to, day: p.t1, agenda: 'caravan', from: p.from, to: p.to, party: p.id }); situation(W, p.to, 'well_supplied', p.t1, p.id, ev); }
      if (p.agenda === 'crew') {
        ev.push({ kind: 'raid', place: p.to, day: p.t1, agenda: 'crew', from: p.from, to: p.to, party: p.id });
        situation(W, p.to, 'raided', p.t1, p.id, ev);
        if (deathRoll(p.id + '>' + p.to)) ev.push({ kind: 'death', place: p.to, day: p.t1, side: 'town', party: p.id, by: p.id });
      }
    }
  });
  /* a situation that ends inside this week moves the price back */
  Object.keys(W.sit).forEach(function (nm) {
    W.sit[nm].forEach(function (s) { if (s.until >= ta && s.until < tb && !s.ended) { s.ended = true; priceMove(W, nm, s.id, s.until, -1, s.by, ev); } });
  });
  W.tail = live.filter(function (p) { return (p.stoppedAt != null ? p.stoppedAt : p.t1) >= tb; });
  ev.sort(function (m, n) { return m.day - n.day || KINDS.indexOf(m.kind) - KINDS.indexOf(n.kind) || (m.place < n.place ? -1 : m.place > n.place ? 1 : 0); });
  return { w: w, events: ev, parties: fresh.length };
}
function standing(W, nm, id, t) {
  return (W.sit[nm] || []).some(function (s) { return s.id === id && s.from <= t && s.until > t; });
}
/* a situation begins: Battle Brothers refreshes one that stands rather than stacking it */
function situation(W, nm, id, t, by, ev) {
  var list = W.sit[nm] = W.sit[nm] || [];
  for (var i = 0; i < list.length; i++) if (list[i].id === id && !list[i].ended && list[i].until > t) { list[i].until = Math.max(list[i].until, t + SITUATION_DAYS); return; }
  list.push({ id: id, from: t, until: t + SITUATION_DAYS, by: by, ended: false });
  priceMove(W, nm, id, t, +1, by, ev);
}
function priceMove(W, nm, id, t, sign, by, ev) {
  var S = SITUATIONS[id]; if (!S) return;
  ['buy', 'sell'].forEach(function (side) {
    if (!S[side]) return;
    ev.push({ kind: 'price', place: nm, day: t, price: { side: side, move: Math.round(sign * S[side] * 100), why: id, began: sign > 0 }, party: by });
  });
}

/* ---- WHAT A TOWN IS TALKING ABOUT ---- */
function items(W, name, day, window, opts) {
  opts = opts || {};
  window = window == null ? PERIOD : window;
  var lo = day - window, out = [];
  for (var w = Math.max(0, Math.floor(lo / PERIOD)); w <= Math.floor(day / PERIOD); w++) {
    week(W, w).events.forEach(function (e) { if (e.place === name && e.day > lo && e.day <= day) out.push(e); });
  }
  /* the dice the settlement screen rolls for the place, on the same day (so the news is what you find) */
  if (opts.traits) {
    var LM = DEP('bohemia_livingmap', 'BohemiaLivingMap');
    if (LM && LM.traitsFor) LM.traitsFor(opts.traits, name, day).forEach(function (t) {
      if (KINDS.indexOf(t.id) >= 0) out.push({ kind: t.id, place: name, day: Math.floor(day / PERIOD) * PERIOD, dice: true });
    });
  }
  out = out.map(function (e) { var q = {}; for (var k in e) q[k] = e[k]; q.ago = Math.max(0, Math.floor(day - e.day)); return q; });
  out.sort(function (a, b) { return b.day - a.day || KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind); });
  return out;
}
function near(W, here, day, opts) {
  opts = opts || {};
  var reach = opts.reach == null ? REACH_BLOCKS : opts.reach;
  return W.places.filter(function (p) { return cheb(p, here) <= reach; })
    .map(function (p) { return { place: p.name, x: p.x, y: p.y, tier: p.tier, role: p.role, dist: cheb(p, here), items: items(W, p.name, day, opts.window, opts) }; })
    .sort(function (a, b) { return a.dist - b.dist || (a.place < b.place ? -1 : 1); });
}

var API = { world: world, week: week, items: items, near: near, routesFrom: routesFrom, posAt: posAt, KINDS: KINDS, SITUATIONS: SITUATIONS, TIER: TIER,
            MEET_BLOCKS: MEET_BLOCKS,
            REACH_BLOCKS: REACH_BLOCKS, SEEN_BLOCKS: SEEN_BLOCKS, DEATH_CHANCE: DEATH_CHANCE, SITUATION_DAYS: SITUATION_DAYS, PERIOD: PERIOD,
            seedOf: seedOf, draft: DRAFT, tuned: TUNED };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else root.BohemiaRegionNews = API;
})(typeof self !== 'undefined' ? self : this);
