/* ==========================================================================
   A DIFFERENT VALLEY EVERY GAME (WORLD 7, 11/3/26, rule 339, ask line 347).

   PAOLO, AGAIN: "the map is not giving procedurally generated vibes."
   MEASURED BEFORE: WORLD 6's campaign seed moved the fourteen home bases among real places, and nothing else on the map
   moved: the same blocks lit at night (the land seed's 160 live circuits, every game), no burned or looted or rebuilt
   block anywhere, no camp, lair, ruin or legendary place on the valley at all, every road open, the same sky. Two codes
   side by side read as one valley with the town labels shuffled.

   THE CALL (Battle Brothers is the school: every campaign's world reads different at a glance): THE LAND STAYS REAL.
   What state it is in and what stands out there come from the SAME campaign code, all on real blocks of the right kind
   (records/target/bb/world_state.json): which neighbourhoods are dark, where a fire burned, which strip was looted,
   which block a faction rebuilt; the camps, the lairs, the ruins and the legendary places, each with a landmark seen from
   far (smoke, a fire's glow, a wreck under circling birds, a burned shell, a mast with a red light); the freeway blocks
   that are shut and the passes that are closed (only where the valley stays one piece); the sky he starts under.

   ONE MODULE, BOTH SURFACES: node requires the data file; the page inlines the same JSON as BOHEMIA_WORLD_STATE_DATA and
   this file as-is (tools/bohemia_world_state_patch.py; the gate refuses a drift). PURE: no clock, no Math.random, no
   storage, no page globals. The page hands it the real valley (a district at every block, the live circuits, the seeded
   bases, the walk test); slices/bohemia_world_state_map.js draws it and makes it true.
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = typeof module !== 'undefined' && module.exports && typeof require === 'function';

  function data() {
    if (root && root.BOHEMIA_WORLD_STATE_DATA) return root.BOHEMIA_WORLD_STATE_DATA;
    if (HASREQ) { try { return require('../records/target/bb/world_state.json'); } catch (_e) {} }
    return null;
  }
  /* the same two small tools as the seed (FNV-1a, mulberry32), so a code means one thing everywhere */
  function hash(text) {
    var h = 2166136261, s = String(text == null ? '' : text);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function span(R, a) { if (!a || a.length < 2) return a ? +a[0] || 0 : 0; return (a[0] | 0) + Math.floor(R() * ((a[1] | 0) - (a[0] | 0) + 1)); }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  var CODES = { none: 0, burned: 1, looted: 2, reclaimed: 3 };
  var NAMES = ['none', 'burned', 'looted', 'reclaimed'];

  /* the valley as a flat list of districts, whatever the caller hands (a grid object with at(x,y), or rows of names) */
  function flat(grid) {
    var n = grid.n | 0, D = new Array(n * n), x, y;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      var t = null;
      if (typeof grid.at === 'function') { var c = grid.at(x, y); t = c ? (typeof c === 'string' ? c : c.district) : null; }
      else if (grid.rows) t = grid.rows[y][x];
      D[y * n + x] = t || null;
    }
    return { n: n, d: D };
  }
  /* a kind name in the data, with the two made-up ones: the mountain's foot and a road's side */
  function kindOk(V, x, y, list) {
    var n = V.n, d = V.d[y * n + x]; if (!d) return false;
    for (var i = 0; i < list.length; i++) {
      var k = list[i];
      if (k === d) return true;
      if (k === 'mountain_foot' && (d === 'desert' || d === 'wash')) {
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var X = x + dx, Y = y + dy;
          if (X >= 0 && Y >= 0 && X < n && Y < n && V.d[Y * n + X] === 'mountain') return true; }
      }
      if ((k === 'freeway_side' || k === 'arterial_side') && d !== 'freeway' && d !== 'arterial' && d !== 'mountain' && d !== 'water') {
        var want = k === 'freeway_side' ? 'freeway' : 'arterial';
        for (var q = 0; q < 4; q++) { var X2 = x + (q === 0 ? 1 : q === 1 ? -1 : 0), Y2 = y + (q === 2 ? 1 : q === 3 ? -1 : 0);
          if (X2 >= 0 && Y2 >= 0 && X2 < n && Y2 < n && V.d[Y2 * n + X2] === want) return true; }
      }
    }
    return false;
  }
  function listOf(V, on, ok) {
    var out = [], n = V.n;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (kindOk(V, x, y, on) && (!ok || ok(x, y))) out.push([x, y]);
    return out;
  }
  function farFrom(pts, x, y, m) { for (var i = 0; i < pts.length; i++) if (cheb(pts[i][0], pts[i][1], x, y) < m) return false; return true; }
  function basesList(bases) { var out = []; for (var k in (bases || {})) { var b = bases[k]; if (b && b.x != null) out.push([b.x | 0, b.y | 0, k]); } out.sort(function (a, b) { return a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0; }); return out; }

  /* THE SCARS: burned, looted, rebuilt, as blobs on real blocks of their kinds */
  function scars(V, code, D, B, cell) {
    var S = D.scars || {}, out = [], n = V.n, keep = (D.keep_clear && D.keep_clear.round_bases) || 3, centres = [];
    var nearBase = function (x, y, r) { for (var i = 0; i < B.length; i++) if (cheb(B[i][0], B[i][1], x, y) <= r) return true; return false; };
    function blob(R, kind, cx, cy, r, on, guard) {
      var cells = 0, code2 = CODES[kind];
      for (var dy = -r - 1; dy <= r + 1; dy++) for (var dx = -r - 1; dx <= r + 1; dx++) {
        var x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= n || y >= n) continue;
        /* a ragged edge, never a square: the distance with a little of the code's noise in it */
        var e = Math.sqrt(dx * dx + dy * dy) + (rng(hash(code + ':edge:' + kind + ':' + x + ',' + y))() - 0.5) * 1.1;
        if (e > r + 0.35) continue;
        if (cell[y * n + x]) continue;
        if (!kindOk(V, x, y, on)) continue;
        if (guard && !guard(x, y)) continue;
        cell[y * n + x] = code2; cells++;
      }
      return cells;
    }
    ['burned', 'looted'].forEach(function (kind) {
      var K = S[kind]; if (!K) return;
      var R = rng(hash(code + ':scar:' + kind)), want = span(R, K.count), apart = K.apart || 8;
      var cand = listOf(V, K.seat_on || K.on, function (x, y) { return !nearBase(x, y, keep + 2) && x >= 3 && y >= 3 && x < n - 3 && y < n - 3; });
      for (var t = 0, got = 0; t < 400 && got < want && cand.length; t++) {
        var c = cand[Math.floor(R() * cand.length) % cand.length];
        if (!farFrom(centres, c[0], c[1], apart)) continue;
        var r = span(R, K.radius);
        var m = blob(R, kind, c[0], c[1], r, K.on, function (x, y) { return !nearBase(x, y, keep); });
        if (m < 4) continue;
        centres.push(c); got++; out.push({ kind: kind, x: c[0], y: c[1], r: r, cells: m, name: K.name || kind.toUpperCase() });
      }
    });
    var K3 = S.reclaimed;
    if (K3 && B.length) {
      var R3 = rng(hash(code + ':scar:reclaimed')), want3 = Math.min(B.length, span(R3, K3.count)), order = B.slice();
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(R3() * (i + 1)); var tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
      for (var bi = 0, got3 = 0; bi < order.length && got3 < want3; bi++) {
        var b = order[bi], fb = K3.from_base || [3, 6], placed = false;
        for (var tt = 0; tt < 30 && !placed; tt++) {
          var ang = R3() * Math.PI * 2, dist = fb[0] + R3() * (fb[1] - fb[0]);
          var cx = Math.round(b[0] + Math.cos(ang) * dist), cy = Math.round(b[1] + Math.sin(ang) * dist);
          if (cx < 2 || cy < 2 || cx >= n - 2 || cy >= n - 2 || !kindOk(V, cx, cy, K3.on)) continue;
          var r3 = span(R3, K3.radius), m3 = blob(R3, 'reclaimed', cx, cy, r3, K3.on, null);
          if (m3 < 3) continue;
          placed = true; got3++; out.push({ kind: 'reclaimed', x: cx, y: cy, r: r3, cells: m3, by: b[2], name: K3.name || 'REBUILT' });
        }
      }
    }
    return out;
  }

  /* THE DARK: whole neighbourhoods of the live circuits put out, never round a base or on a rebuilt block */
  function dark(V, code, D, B, cell, circuits) {
    var K = D.dark || {}, n = V.n, R = rng(hash(code + ':dark')), k = K.regions || 22;
    var share = (K.share || [0.3, 0.6]); share = share[0] + R() * (share[1] - share[0]);
    var pts = []; for (var i = 0; i < k; i++) pts.push([R() * n, R() * n, R() < share]);
    var keep = K.keep_lit_round_bases == null ? 5 : K.keep_lit_round_bases, out = [], lit = 0;
    (circuits || []).forEach(function (c) {
      var x = c.x, y = c.y, best = 1e9, off = false;
      for (var j = 0; j < pts.length; j++) { var dx = pts[j][0] - x, dy = pts[j][1] - y, dd = dx * dx + dy * dy; if (dd < best) { best = dd; off = pts[j][2]; } }
      var xi = Math.round(x), yi = Math.round(y), st = (xi >= 0 && yi >= 0 && xi < n && yi < n) ? cell[yi * n + xi] : 0;
      if (st === CODES.burned || st === CODES.looted) off = true;   /* nothing burned or stripped has power */
      if (st === CODES.reclaimed) off = false;
      for (var b = 0; b < B.length && off; b++) if (cheb(B[b][0], B[b][1], x, y) <= keep) off = false;
      if (off) out.push(c.id); else lit++;
    });
    return { ids: out, lit: lit, share: Math.round(share * 100) / 100, regions: k };
  }

  /* WHAT STANDS OUT THERE */
  function marks(V, code, D, B, cell) {
    var M = D.marks || {}, out = [], all = [], n = V.n;
    ['legend', 'ruin', 'lair', 'camp'].forEach(function (kind) {
      var K = M[kind]; if (!K) return;
      var R = rng(hash(code + ':mark:' + kind)), want = span(R, K.count), apart = K.apart || 10, fb = K.from_bases || 6;
      var names = (K.names || []).slice();
      var pool = K.pool ? K.pool.slice() : null;
      for (var t = 0, got = 0; t < 60 && got < want; t++) {
        var on = K.on, name = null, pi = -1;
        if (pool) { if (!pool.length) break; pi = Math.floor(R() * pool.length) % pool.length; on = pool[pi].on; name = pool[pi].name; }
        var cand = listOf(V, on, function (x, y) { return x >= 2 && y >= 2 && x < n - 2 && y < n - 2 && farFrom(B, x, y, fb) && farFrom(all, x, y, apart) && !cell[y * n + x]; });
        if (pool) pool.splice(pi, 1);
        if (!cand.length) continue;
        var c = cand[Math.floor(R() * cand.length) % cand.length];
        if (!name) { if (!names.length) names = (K.names || [kind.toUpperCase()]).slice(); name = names.splice(Math.floor(R() * names.length) % names.length, 1)[0]; }
        all.push(c); got++;
        out.push({ kind: kind, look: K.look || kind, x: c[0], y: c[1], name: name, on: V.d[c[1] * n + c[0]] });
      }
    });
    return out;
  }

  /* THE ROADS: a freeway shut across its whole width, only where every street still reaches every other */
  function comps(n, walk, block) {
    var lab = new Int32Array(n * n).fill(-1), sizes = [], q = new Int32Array(n * n);
    for (var s = 0; s < n * n; s++) {
      if (lab[s] >= 0 || !walk[s] || block[s]) continue;
      var id = sizes.length, h = 0, tl = 0; q[tl++] = s; lab[s] = id;
      while (h < tl) { var c = q[h++], x = c % n, y = (c / n) | 0;
        for (var d = 0; d < 4; d++) { var X = x + (d === 0 ? 1 : d === 1 ? -1 : 0), Y = y + (d === 2 ? 1 : d === 3 ? -1 : 0);
          if (X < 0 || Y < 0 || X >= n || Y >= n) continue; var k = Y * n + X;
          if (lab[k] >= 0 || !walk[k] || block[k]) continue; lab[k] = id; q[tl++] = k; } }
      sizes.push(tl);
    }
    return { lab: lab, sizes: sizes };
  }
  function roads(V, code, D, B, walkFn) {
    var K = D.roads || {}, n = V.n, out = [], block = new Uint8Array(n * n);
    if (!walkFn) return { list: out, block: block };
    var walk = new Uint8Array(n * n); for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) walk[y * n + x] = walkFn(x, y) ? 1 : 0;
    var base0 = comps(n, walk, block), big = 0; for (var i = 1; i < base0.sizes.length; i++) if (base0.sizes[i] > base0.sizes[big]) big = i;
    var R = rng(hash(code + ':roads')), want = span(R, K.count), kinds = Object.keys(K.kinds || {}).sort(), centres = [];
    var cand = listOf(V, ['freeway', 'interchange'], function (x, y) { return x >= 3 && y >= 3 && x < n - 3 && y < n - 3 && walk[y * n + x] && farFrom(B, x, y, K.from_bases || 4); });
    for (var t = 0; t < 80 && out.length < want && cand.length; t++) {
      var c = cand[Math.floor(R() * cand.length) % cand.length];
      if (!farFrom(centres, c[0], c[1], K.apart || 10)) continue;
      var kind = null, d0 = V.d[c[1] * n + c[0]];
      var fit = kinds.filter(function (k) { return (K.kinds[k].on || []).indexOf(d0) >= 0; });
      if (!fit.length) continue;
      kind = fit[Math.floor(R() * fit.length) % fit.length];
      /* the whole width: every freeway block touching the centre */
      var cells = [];
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var X = c[0] + dx, Y = c[1] + dy, dd = V.d[Y * n + X];
        if ((dd === 'freeway' || dd === 'interchange') && walk[Y * n + X] && !block[Y * n + X]) cells.push([X, Y]); }
      if (!cells.length) continue;
      cells.forEach(function (p) { block[p[1] * n + p[0]] = 1; });
      /* ONE PIECE: every walkable block that was in the valley's big piece is still in one piece without these */
      var after = comps(n, walk, block), ok = true, home = -1;
      for (var s = 0; s < n * n && ok; s++) { if (!walk[s] || block[s] || base0.lab[s] !== big) continue;
        if (home < 0) home = after.lab[s]; else if (after.lab[s] !== home) ok = false; }
      if (!ok) { cells.forEach(function (p) { block[p[1] * n + p[0]] = 0; }); continue; }
      centres.push(c);
      out.push({ kind: kind, x: c[0], y: c[1], cells: cells, name: K.kinds[kind].name || kind, on: d0 });
    }
    return { list: out, block: block };
  }
  /* THE PASSES: which of the real roads out through the ranges are shut this campaign (the page hands the portals when the
     region has joined them; out past the valley the rock is still crossable, slowly) */
  function passes(code, list, D) {
    D = D || data(); var K = (D && D.roads && D.roads.passes) || {}, out = [];
    var R = rng(hash(code + ':passes')), names = (list || []).map(function (p) { return p.road; }).filter(function (r, i, a) { return r && a.indexOf(r) === i; }).sort();
    var want = Math.min(names.length ? names.length - 1 : 0, span(R, K.closed || [1, 2])), shut = {};
    for (var i = names.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)); var tmp = names[i]; names[i] = names[j]; names[j] = tmp; }
    for (var k = 0; k < want; k++) shut[names[k]] = 1;
    var kinds = Object.keys(K.kinds || { slide: 1 }).sort();
    (list || []).forEach(function (p) {
      var closed = !!shut[p.road] && !p.shared, kind = closed ? kinds[hash(code + ':pass:' + p.road) % kinds.length] : null;
      out.push({ road: p.road, x: p.x, y: p.y, open: !closed, kind: kind, name: kind ? ((K.kinds || {})[kind] || kind) : null });
    });
    return out;
  }
  function weather(code, D) {
    var W = D.weather || {}, L = W.starts || [], R = rng(hash(code + ':weather')), sum = 0, i;
    for (i = 0; i < L.length; i++) sum += +L[i].w || 1;
    var r = R() * sum;
    for (i = 0; i < L.length; i++) { r -= +L[i].w || 1; if (r <= 0) break; }
    var w = L[Math.min(i, L.length - 1)] || null;
    return w ? { id: w.id, name: w.name, season: w.season, days: W.days || 2, tint: w.tint, alpha: w.alpha, grain: w.grain || 0, shimmer: w.shimmer || 0, stars: w.stars || 0 } : null;
  }

  /* THE ONE CALL. grid: { n, at(x,y) } (a district at every block); code: the campaign seed (no code, no state: the old
     valley); opts.bases: the seeded bases; opts.circuits: [{ id, x, y }] the live circuits' middles; opts.walk(x, y): the
     map's own walk test. The same valley and the same code give the same state, always. */
  function make(grid, code, opts) {
    opts = opts || {};
    var D = opts.data || data(); if (!D || !code) return null;
    var c = String(code), V = flat(grid), n = V.n, B = basesList(opts.bases), cell = new Uint8Array(n * n);
    var sc = scars(V, c, D, B, cell);
    var dk = dark(V, c, D, B, cell, opts.circuits || []);
    var mk = marks(V, c, D, B, cell);
    var rd = roads(V, c, D, B, opts.walk || null);
    var wx = weather(c, D);
    var count = { burned: 0, looted: 0, reclaimed: 0 };
    for (var i = 0; i < cell.length; i++) if (cell[i]) count[NAMES[cell[i]]]++;
    var key = hash(c + ':' + Array.prototype.join.call(cell, '') + ':' + dk.ids.join(',') + ':' + rd.list.map(function (r) { return r.x + ',' + r.y; }).join(';')).toString(36);
    return { code: c, v: D.version || 1, n: n, cell: cell, scars: sc, dark: dk, marks: mk, roads: rd.list, block: rd.block, weather: wx, count: count, key: key };
  }
  function stateAt(S, x, y) { if (!S || x < 0 || y < 0 || x >= S.n || y >= S.n) return 'none'; return NAMES[S.cell[y * S.n + x]] || 'none'; }
  /* what a stranger reads in it: the counts he could see, for the gate and the record */
  function summary(S) {
    if (!S) return null;
    var m = {}; S.marks.forEach(function (k) { m[k.kind] = (m[k.kind] || 0) + 1; });
    return { code: S.code, burned: S.count.burned, looted: S.count.looted, reclaimed: S.count.reclaimed, scars: S.scars.length, dark: S.dark.ids.length, lit: S.dark.lit,
             marks: m, roads: S.roads.length, weather: S.weather && S.weather.id, key: S.key };
  }

  var API = { data: data, hash: hash, rng: rng, make: make, passes: passes, stateAt: stateAt, summary: summary, CODES: CODES, NAMES: NAMES };
  if (HASREQ) module.exports = API;
  if (root) root.BohemiaWorldState = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
