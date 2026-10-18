/* ============================================================================
   BOHEMIA FREEWAYS -- EACH REAL FREEWAY AS ONE ROAD  (10/18/26, WORLD lane)
   Row [the freeway as one road in the data] (the coordinator, from Paolo 10/18:
   'the freeway as it runs through the city should be unified, it doesn't look
   unified, it looks really bad'), for RUN's [one freeway, and nobody is an icon].

   WHAT WAS MEASURED BEFORE THIS FILE (the game's seed, 'bohemia' -> 2691674296):
     The valley's freeway is 968 cells (952 freeway, 16 the Spaghetti Bowl) laid
     two abreast by the overmap's layout: the I-15 spine, the cross-town through
     the bowl, the beltway ring, three exit stubs, the mountain passes. Nothing in
     the data says which two cells are ONE road, which half a cell is, or which
     real highway a piece is, so every cell is drawn as its own freeway and two
     cells side by side read as two roads.
     And at the valley's rim the loader's stitch() joins a valley exit to the
     nearest real highway ON THE SAME SIDE of the box: on the game's seed the
     valley's I-15 leaves into NV-159 (Charleston, a state route), its US-95 into
     NV-147 (Lake Mead Blvd), and the real I-15 north and I-515 to Henderson are
     joined to nothing. Over twenty seeds I-515 / US-93 is never joined.

   WHAT THIS FILE GIVES (data, no drawing; RUN draws):
     BohemiaFreeways.of(om, land, compass) -> {
       freeways: [{ name, lanes, steps: [{ x, y, cells, where, seg, axis, district,
                    beside, lanes, junction, made, ramp }], ramps, interchanges,
                    districts, squares, breaks, ends }]
                 I-15 (California to the Virgin River: I-15 S, the valley, I-15 N),
                 US-95 (the proving ground to Searchlight: US-95 NW, the valley,
                 I-515 / US-93, US-95 S), I-11 / US-93 (the bowl to Arizona),
                 CC-215 (the valley's ring, one closed loop). Each is ONE ordered
                 list of steps, valley pairs two cells abreast, every step touching
                 the next.
       cells:    { 'x,y': { names, seg, axis, median, junction, lanes, ramp } } for
                 every valley freeway cell: median is the side its sibling half is
                 on (N, E, S, W), so a pair is drawn as ONE roadway with the median
                 on the shared edge and the lanes outward.
       exits:    the valley's freeway exits with the real road each one meets.
       stitch:   the rim connectors, by name: every class-1 highway is joined to
                 the valley exit the real road leaves by (never to a state route),
                 around a corner of the box when it must; made blocks counted.
       orphans, lonely, breaks, counts }
     cellAt(F, x, y) for a renderer.

   HOW THE NAMES ARE CHOSEN (realism first, real compass): the spine is I-15;
   the cross-town is US-95, its west half to the north-west and its east half to
   Henderson (as the real US-95 and I-515 leave the Spaghetti Bowl); the ring is
   CC-215; each real highway's portal on the box (engine/BOHEMIA_REGION_LAND.json)
   takes the valley exit nearest it around the box, one road to one exit, two
   abreast only. A road with no exit within half a side is a BREAK, said with the
   blocks it lacks.

   Gate: gates/the_freeway_is_one_road_gate.js. Pure: same om, same answer, no DOM.
   ========================================================================== */
(function (root) {
'use strict';

var FWY = { freeway: 1, beltway: 1, interchange: 1 };
var STREET = { arterial: 'arterial', strip: 'boulevard' };
/* real lanes each way, approximate, NDOT's roads as they stand: the valley's stretch and the open road */
var LANES = { 'I-15': [5, 2], 'US-95': [4, 2], 'I-11 / US-93': [3, 2], 'CC-215': [3, 3] };
/* the real highways the valley's freeway joins, by their region parts (engine/BOHEMIA_REGION_LAND.json freewayPaths) */
var THROUGH = [
  { name: 'I-15',         from: 'I-15 S',   to: 'I-15 N',        after: [],              via: 'bowl' },
  { name: 'US-95',        from: 'US-95 NW', to: 'I-515 / US-93', after: ['US-95 S'],     via: 'bowl' },
  { name: 'I-11 / US-93', from: null,       to: 'I-515 / US-93', after: ['I-11 / US-93'], via: 'bowl' }
];
var CLASS1 = ['I-15 S', 'I-15 N', 'US-95 NW', 'I-515 / US-93'];
var RIM_BUDGET = 48;                      /* half a side: further than that and it is not this road's exit */
/* the piece each real road is, where the valley has it: the spine is the 15 to the south, the cross-town is the 95
   both ways out of the bowl (the overmap's own words, 7/5: 'the cross-town freeway (US-95) runs BOTH directions
   through the bowl'); a road takes its own piece over a nearer stub when the two are within FIT blocks */
var FIT = { 'I-15 S': 'spine', 'US-95 NW': 'bend', 'I-515 / US-93': 'bend' }, FIT_BONUS = 12;

function key(x, y) { return x + ',' + y; }

function of(om, land, compass) {
  var N = om.n, L = om.layout;
  compass = compass || { e: (L.fwyX < L.stripX) ? 'x1' : 'x0' };   /* vbCore's rule: east is the town's side of the 15 */
  var mirror = compass.e === 'x0';
  var realX = function (x) { return mirror ? N - 1 - x : x; };
  var tile = function (x, y) { return (x < 0 || y < 0 || x >= N || y >= N) ? null : om.at(x, y); };
  var isF = function (x, y) { var t = tile(x, y); return !!(t && FWY[t.district]); };
  var distOf = function (x, y) { var t = tile(x, y); return t ? t.district : null; };

  /* 1. THE RAW PIECES, off the layout the overmap laid them by */
  var raw = [], B = L.beltRect;
  function run(id, kind, axis, at, w, a, b) {
    var steps = [], d = b >= a ? 1 : -1;
    for (var v = a; ; v += d) {
      var c = [];
      for (var i = 0; i < w; i++) { var x = axis === 'ns' ? at + i : v, y = axis === 'ns' ? v : at + i; if (isF(x, y)) c.push([x, y]); }
      steps.push(c);
      if (v === b) break;
    }
    raw.push({ id: id, kind: kind, axis: axis, w: w, steps: steps });
  }
  run('spine', 'spine', 'ns', L.fwyX, 2, N - 1, B.top);
  run('bend', 'cross-town', 'ew', L.bendNorthY, 2, 0, N - 1);
  run('ringTop', 'ring', 'ew', B.top, 2, B.lft, B.rgt);
  run('ringRgt', 'ring', 'ns', B.rgt - 1, 2, B.top, B.bot);
  run('ringBot', 'ring', 'ew', B.bot - 1, 2, B.rgt, B.lft);
  run('ringLft', 'ring', 'ns', B.lft, 2, B.bot, B.top);
  (L.exits || []).forEach(function (e, i) { run('exit' + i, 'exit', 'ns', e.x, 2, e.y0 === 0 ? 0 : N - 1, e.y0 === 0 ? e.y1 : e.y0); });
  if (!L.axisFlip) {
    (L.passesA || []).forEach(function (p, i) { run('passA' + i, 'pass', 'ew', p, 1, 0, B.lft + 1); });
    (L.passesB || []).forEach(function (p, i) { run('passB' + i, 'pass', 'ew', p, 1, N - 1, B.rgt - 1); });
  } else {
    (L.passesA || []).forEach(function (p, i) { run('passA' + i, 'pass', 'ns', p, 1, 0, B.top + 1); });
    (L.passesB || []).forEach(function (p, i) { run('passB' + i, 'pass', 'ns', p, 1, N - 1, B.bot - 1); });
  }
  /* a cell an earlier piece already runs ALONG is that piece's (an exit stub laid down the spine is the spine);
     a cell two pieces run ACROSS each other is a junction; so is the bowl */
  var along = {}, cover = {};
  raw.forEach(function (p) {
    p.steps = p.steps.map(function (c) { return c.filter(function (q) { var k = key(q[0], q[1]); if (along[k] === p.axis) return false; return true; }); });
    p.steps.forEach(function (c) { c.forEach(function (q) { var k = key(q[0], q[1]); if (!along[k]) along[k] = p.axis; (cover[k] = cover[k] || []).push(p.id); }); });
  });
  var isJ = {};
  Object.keys(cover).forEach(function (k) { var xy = k.split(','), t = tile(+xy[0], +xy[1]); if (cover[k].length > 1 || (t && t.district === 'interchange')) isJ[k] = 1; });
  for (var iy = 0; iy < N; iy++) for (var ix = 0; ix < N; ix++) { var ti = tile(ix, iy); if (ti && ti.district === 'interchange') isJ[key(ix, iy)] = 1; }   /* the whole bowl, its corners too */

  /* 2. JUNCTIONS: each knot of crossing cells is one node */
  var jid = {}, clusters = [];
  Object.keys(isJ).forEach(function (k) {
    if (jid[k] !== undefined) return;
    var id = clusters.length, st = [k], cells = []; jid[k] = id;
    while (st.length) {
      var c = st.pop(), xy = c.split(','), x = +xy[0], y = +xy[1]; cells.push([x, y]);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var n = key(x + d[0], y + d[1]); if (isJ[n] && jid[n] === undefined) { jid[n] = id; st.push(n); } });
    }
    clusters.push({ id: 'J' + id, cells: cells });
  });
  var bowlC = null;
  clusters.forEach(function (c) { if (c.cells.some(function (q) { var t = tile(q[0], q[1]); return t && t.district === 'interchange'; })) bowlC = c; });

  /* 3. SEGMENTS between nodes; an end at the map's edge is an exit */
  var segs = [], nodes = {}, onBorder = function (q) { return q[0] === 0 || q[1] === 0 || q[0] === N - 1 || q[1] === N - 1; };
  clusters.forEach(function (c) { nodes[c.id] = { id: c.id, kind: c === bowlC ? 'bowl' : 'junction', cells: c.cells }; });
  raw.forEach(function (p) {
    var cur = null, prevNode = null;
    function close(endNode) {
      if (!cur) return;
      cur.b = endNode; segs.push(cur); cur = null;
    }
    for (var i = 0; i < p.steps.length; i++) {
      var c = p.steps[i];
      var jn = null; c.forEach(function (q) { var k = key(q[0], q[1]); if (isJ[k]) jn = 'J' + jid[k]; });
      if (!c.length) { if (cur) close(endNodeOf(cur, 'end')); prevNode = null; continue; }
      if (jn) { if (cur) close(jn); prevNode = jn; continue; }
      if (!cur) {
        var a = prevNode;
        if (!a) a = (i === 0 && c.some(onBorder)) ? exitNode(c, p) : endNodeOfStep(c, 'end');
        cur = { id: 'S' + segs.length, piece: p.id, kind: p.kind, axis: p.axis, w: p.w, a: a, steps: [] };
      }
      cur.steps.push(c);
      if (i === p.steps.length - 1) close(c.some(onBorder) ? exitNode(c, p) : endNodeOfStep(c, 'end'));
    }
  });
  function exitNode(c, p) {
    var q = c[0], edge = q[1] === 0 && p.axis === 'ns' ? 'y0' : q[1] === N - 1 && p.axis === 'ns' ? 'y1' : q[0] === 0 ? 'x0' : 'x1';
    var along2 = edge[0] === 'y' ? c.reduce(function (s, r) { return s + r[0]; }, 0) / c.length : c.reduce(function (s, r) { return s + r[1]; }, 0) / c.length;
    var id = 'E' + Object.keys(nodes).length;
    nodes[id] = { id: id, kind: 'exit', edge: edge, c: along2, w: c.length, cells: c, piece: p.id };
    return id;
  }
  function endNodeOfStep(c, kind) { var id = 'D' + Object.keys(nodes).length; nodes[id] = { id: id, kind: kind, cells: c }; return id; }
  function endNodeOf(seg, kind) { return endNodeOfStep(seg.steps[seg.steps.length - 1], kind); }
  /* a nub of one or two steps off a junction into nothing (an exit stub laid one block past the ring) belongs to the junction */
  segs = segs.filter(function (s) {
    var na = nodes[s.a], nb = nodes[s.b];
    if (s.steps.length <= 2 && ((na.kind === 'end' && nb.kind !== 'end') || (nb.kind === 'end' && na.kind !== 'end'))) {
      var j = na.kind === 'end' ? nb : na;
      if (j.kind === 'junction' || j.kind === 'bowl') { s.steps.forEach(function (c) { c.forEach(function (q) { j.cells.push(q); isJ[key(q[0], q[1])] = 1; jid[key(q[0], q[1])] = +j.id.slice(1); }); }); delete nodes[na.kind === 'end' ? s.a : s.b]; return false; }
    }
    return true;
  });

  /* 4. THE EXITS AND THE REAL ROADS THEY MEET, around the box in the real compass */
  var per = function (edge, c) {           /* a place on the box's edge, clockwise from the real north-west corner */
    var e = edge, v = c;
    if (mirror && (e === 'y0' || e === 'y1')) v = N - 1 - v;
    if (mirror && e[0] === 'x') e = e === 'x0' ? 'x1' : 'x0';
    return e === 'y0' ? v : e === 'x1' ? N + v : e === 'y1' ? 3 * N - v : 4 * N - v;
  };
  var gap = function (s1, s2) { var d = Math.abs(s1 - s2) % (4 * N); return Math.min(d, 4 * N - d); };
  var J = land && land.json ? land.json : (land || {});
  var portals = (J.portals || []).map(function (p) {
    var edge = p.edge, c = edge[0] === 'y' ? p.x : p.y;
    return { road: p.road, cls: p.cls, x: p.x, y: p.y, edge: edge, s: edge === 'y0' ? c : edge === 'x1' ? N + c : edge === 'y1' ? 3 * N - c : 4 * N - c };
  });
  var exits = Object.keys(nodes).map(function (k) { return nodes[k]; }).filter(function (n) { return n.kind === 'exit'; });
  exits.forEach(function (e) { e.s = per(e.edge, e.c); });
  var best = null;
  (function assign(i, used, cost, pick) {
    if (i === CLASS1.length) { if (!best || cost < best.cost) best = { cost: cost, pick: pick.slice() }; return; }
    var P = portals.filter(function (p) { return p.road === CLASS1[i]; })[0];
    assign(i + 1, used, cost + RIM_BUDGET, pick.concat([null]));          /* this road takes no exit */
    if (!P) return;
    exits.forEach(function (e) {
      if (used[e.id] || e.w < 2) return;
      var d = gap(P.s, e.s); if (d > RIM_BUDGET) return;
      var c2 = d - (FIT[CLASS1[i]] === e.piece ? FIT_BONUS : 0);
      used[e.id] = 1; assign(i + 1, used, cost + c2, pick.concat([e.id])); used[e.id] = 0;
    });
  })(0, {}, 0, []);
  var exitOf = {};
  CLASS1.forEach(function (r, i) { if (best && best.pick[i]) { exitOf[r] = best.pick[i]; nodes[best.pick[i]].road = r; } });
  /* the passes: the nearest state route on the box, one each; then any exit still unnamed is a SPUR of the
     nearest real road of any class (it is drawn as that road, and the rim joins only the road's own exit) */
  exits.forEach(function (e) {
    if (e.road || e.w >= 2) return;
    var bd = 1e9, br = null;
    portals.forEach(function (p) { if (p.cls === 1 || exitOf[p.road]) return; var d = gap(p.s, e.s); if (d < bd) { bd = d; br = p.road; } });
    if (br && bd <= RIM_BUDGET) { e.road = br; exitOf[br] = e.id; }
  });
  exits.forEach(function (e) {
    if (e.road) return;
    var bd = 1e9, br = null;
    portals.forEach(function (p) { var d = gap(p.s, e.s); if (d < bd) { bd = d; br = p.road; } });
    if (br && bd <= RIM_BUDGET) { e.road = br; e.spur = true; }
  });

  /* 5. ROUTES through the valley: shortest by blocks, through the bowl */
  var adj = {};
  segs.forEach(function (s) { (adj[s.a] = adj[s.a] || []).push(s); (adj[s.b] = adj[s.b] || []).push(s); });
  function shortest(a, b) {
    if (!a || !b || !nodes[a] || !nodes[b]) return null;
    var dist = {}, prev = {}, q = [a]; dist[a] = 0;
    while (q.length) {
      q.sort(function (u, v) { return dist[u] - dist[v]; }); var u = q.shift();
      if (u === b) break;
      (adj[u] || []).forEach(function (s) { var v = s.a === u ? s.b : s.a, d = dist[u] + s.steps.length + (nodes[v].cells ? nodes[v].cells.length / 4 : 0);
        if (dist[v] === undefined || d < dist[v]) { if (dist[v] === undefined) q.push(v); dist[v] = d; prev[v] = { n: u, s: s }; } });
    }
    if (dist[b] === undefined) return null;
    var path = [], n = b; while (n !== a) { path.unshift({ from: prev[n].n, seg: prev[n].s, to: n }); n = prev[n].n; }
    return path;
  }
  function nearestNode(p) {             /* the valley freeway node nearest a portal, in the real compass */
    if (!p) return null;
    var px = mirror ? N - 1 - p.x : p.x, bd = 1e9, bn = null;
    Object.keys(nodes).forEach(function (k) { var n = nodes[k]; if (!adj[k]) return; n.cells.forEach(function (q) { var d = Math.max(Math.abs(q[0] - px), Math.abs(q[1] - p.y)); if (d < bd) { bd = d; bn = { id: k, d: d, cell: q }; } }); });
    return bn;
  }
  /* the steps of a node path, junction cells walked cell by cell so every step touches the next */
  function walk(path, out) {
    var touch = function (a, b) { return a.some(function (p) { return b.some(function (q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) <= 1; }); }); };
    path.forEach(function (hop, i) {
      var st = hop.seg.steps.slice(); if (hop.seg.a !== hop.from) st.reverse();
      if (out.length && st.length && !touch(out[out.length - 1].cells, st[0])) {
        var J2 = nodes[hop.from]; if (J2 && J2.cells) bridge(J2.cells, out[out.length - 1].cells, st[0], hop.from, out);
      }
      st.forEach(function (c) { out.push(stepOf(c, hop.seg)); });
    });
    return out;
  }
  function bridge(cells, fromC, toC, nid, out) {       /* breadth-first across a junction's own cells */
    var inJ = {}; cells.forEach(function (q) { inJ[key(q[0], q[1])] = q; });
    var start = cells.filter(function (q) { return fromC.some(function (p) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) === 1; }); });
    var goal = function (q) { return toC.some(function (p) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) === 1; }); };
    var prev = {}, qu = start.slice(); start.forEach(function (q) { prev[key(q[0], q[1])] = null; });
    var end = null;
    while (qu.length) { var c = qu.shift(); if (goal(c)) { end = c; break; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var k = key(c[0] + d[0], c[1] + d[1]); if (inJ[k] && prev[k] === undefined) { prev[k] = c; qu.push(inJ[k]); } }); }
    if (!end) return;
    var chain = []; for (var c2 = end; c2; c2 = prev[key(c2[0], c2[1])]) chain.unshift(c2);
    chain.forEach(function (q) { out.push({ x: q[0], y: q[1], cells: [q], where: 'valley', node: nid, junction: true }); });
  }
  function stepOf(c, seg) {
    var x = c.reduce(function (s, q) { return s + q[0]; }, 0) / c.length, y = c.reduce(function (s, q) { return s + q[1]; }, 0) / c.length;
    var st = { x: x, y: y, cells: c, where: 'valley', seg: seg.id, axis: seg.axis };
    var fl = flanks(c, seg.axis); st.beside = [distOf(fl[0][0], fl[0][1]), distOf(fl[1][0], fl[1][1])];
    if (STREET[st.beside[0]] && STREET[st.beside[1]]) st.ramp = STREET[st.beside[0]] === 'boulevard' || STREET[st.beside[1]] === 'boulevard' ? 'boulevard' : 'arterial';
    return st;
  }
  function flanks(c, axis) {
    var xs = c.map(function (q) { return q[0]; }), ys = c.map(function (q) { return q[1]; });
    return axis === 'ns' ? [[Math.min.apply(null, xs) - 1, ys[0]], [Math.max.apply(null, xs) + 1, ys[0]]]
                         : [[xs[0], Math.min.apply(null, ys) - 1], [xs[0], Math.max.apply(null, ys) + 1]];
  }
  /* the rim: from a valley exit around the box, one block out, to a real road's portal */
  function rim(e, P) {
    if (!e || !P) return [];
    var px = mirror ? N - 1 - P.x : P.x, py = P.y;
    var q = e.cells[Math.floor(e.cells.length / 2)];
    var sx = e.edge === 'x0' ? -1 : e.edge === 'x1' ? N : q[0], sy = e.edge === 'y0' ? -1 : e.edge === 'y1' ? N : q[1];
    var ring = function (x, y) { return x === -1 || y === -1 || x === N || y === N; };
    var cw = function (x, y) {                 /* the next block clockwise round the ring one out */
      if (y === -1 && x < N) return [x + 1, y]; if (x === N && y < N) return [x, y + 1];
      if (y === N && x > -1) return [x - 1, y]; return [x, y - 1];
    };
    var ccw = function (x, y) {
      if (y === -1 && x > -1) return [x - 1, y]; if (x === -1 && y < N) return [x, y + 1];
      if (y === N && x < N) return [x + 1, y]; return [x, y - 1];
    };
    var go = function (f) { var out = [[sx, sy]], c = [sx, sy], g = 0; while ((c[0] !== px || c[1] !== py) && g++ < 4 * N + 8) { c = f(c[0], c[1]); out.push(c); } return g <= 4 * N + 8 ? out : null; };
    if (!ring(sx, sy) || !ring(px, py)) return [];
    var a = go(cw), b = go(ccw), path = (!a || (b && b.length < a.length)) ? b : a;
    return (path || []).map(function (c) { return { x: c[0], y: c[1], cells: [c], where: 'rim', made: !(c[0] === px && c[1] === py) }; });
  }
  function regionSteps(name, from) {
    var fp = (J.freewayPaths || {})[name]; if (!fp) return [];
    var path = fp.path.map(function (p) { return [mirror ? N - 1 - p[0] : p[0], p[1]]; });
    var st = path.map(function (c) { return { x: c[0], y: c[1], cells: [c], where: 'region', part: name }; });
    return from ? st.slice(from) : st;
  }

  /* 6. EACH REAL FREEWAY, ONE ROAD */
  var freeways = [], breaks = [];
  var portalOf = function (r) { return portals.filter(function (p) { return p.road === r; })[0]; };
  function cat(steps, more) {             /* join two runs; the block they share is counted once */
    var last = steps[steps.length - 1];
    if (last && more.length && more[0].cells.length === 1 && last.cells.length === 1 && more[0].x === last.x && more[0].y === last.y) more = more.slice(1);
    return steps.concat(more);
  }
  THROUGH.forEach(function (T) {
    var steps = [], bk = [];
    if (T.from) steps = steps.concat(regionSteps(T.from).reverse());
    var A = T.from ? exitOf[T.from] : null, Bx = exitOf[T.to];
    var bowl = bowlC ? bowlC.id : null;
    var lost = function (r) { return portalOf(r) ? 'the roll laid no freeway out of the valley toward ' + r : 'the region file has no portal for ' + r; };
    if (T.from && !A) { var na = nearestNode(portalOf(T.from)); A = na && na.id; bk.push({ name: T.name, at: T.from, from: na && na.cell, gap: na ? na.d : null, why: lost(T.from) }); }
    if (!Bx) { var nb = nearestNode(portalOf(T.to)); Bx = nb && nb.id; bk.push({ name: T.name, at: T.to, from: nb && nb.cell, gap: nb ? nb.d : null, why: lost(T.to) }); }
    if (T.from) steps = cat(steps, rim(nodes[A] && nodes[A].kind === 'exit' ? nodes[A] : null, portalOf(T.from)).reverse());
    var leg1 = T.from ? shortest(A, bowl) : [], leg2 = shortest(bowl, Bx);
    if (T.from && !leg1) bk.push({ name: T.name, at: 'the valley', why: 'no freeway from ' + T.from + '\'s exit to the bowl' });
    if (!leg2) bk.push({ name: T.name, at: 'the valley', why: 'no freeway from the bowl to ' + T.to + '\'s exit' });
    var vs = []; walk((leg1 || []).concat(leg2 || []), vs);
    if (T.from && leg1 && !leg1.length && bowlC) vs.unshift({ x: bowlC.cells[0][0], y: bowlC.cells[0][1], cells: [bowlC.cells[0]], where: 'valley', node: bowl, junction: true });
    steps = cat(steps, vs);
    steps = cat(steps, rim(nodes[Bx] && nodes[Bx].kind === 'exit' ? nodes[Bx] : null, portalOf(T.to)));
    steps = cat(steps, regionSteps(T.to));
    T.after.forEach(function (n) { steps = cat(steps, regionSteps(n)); });
    freeways.push(finish(T.name, steps, bk));
    breaks = breaks.concat(bk);
  });
  /* CC-215: round the ring, corner to corner */
  (function () {
    var ringSegs = segs.filter(function (s) { return s.kind === 'ring'; });
    if (!ringSegs.length) { breaks.push({ name: 'CC-215', at: 'the valley', why: 'no ring' }); return; }
    var used = {}, start = ringSegs[0].a, at = start, path = [], g = 0;
    while (g++ < 200) {
      var nx = (adj[at] || []).filter(function (s) { return s.kind === 'ring' && !used[s.id]; })[0];
      if (!nx) break; used[nx.id] = 1; var to = nx.a === at ? nx.b : nx.a; path.push({ from: at, seg: nx, to: to }); at = to;
      if (at === start) break;
    }
    var st = []; walk(path, st);
    var closed = at === start && path.length === ringSegs.length;
    if (closed && st.length) { var J3 = nodes[start]; if (J3 && J3.cells) bridge(J3.cells, st[st.length - 1].cells, st[0].cells, start, st); }
    var bk = closed ? [] : [{ name: 'CC-215', at: 'the ring', why: 'the ring does not close (' + path.length + ' of ' + ringSegs.length + ' pieces walked)' }];
    var f = finish('CC-215', st, bk); f.loop = closed; freeways.push(f); breaks = breaks.concat(bk);
  })();

  function finish(name, steps, bk) {
    var ln = LANES[name] || [2, 2];
    steps.forEach(function (s) {
      s.lanes = s.where === 'valley' ? ln[0] : ln[1];
      s.district = land && land.districtAt ? ((land.districtAt(Math.round(s.x - 0.25), Math.round(s.y - 0.25), compass) || {}).name || null) : null;
    });
    var touch = function (a, b) { return a.cells.some(function (p) { return b.cells.some(function (q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) <= 1; }); }); };
    var holes = [];
    for (var i = 1; i < steps.length; i++) if (!touch(steps[i - 1], steps[i])) holes.push({ i: i, from: [steps[i - 1].x, steps[i - 1].y], to: [steps[i].x, steps[i].y] });
    var ramps = steps.filter(function (s) { return s.ramp; }).map(function (s) { return { x: s.x, y: s.y, street: s.ramp }; });
    var inter = [], seenN = {};
    steps.forEach(function (s) { if (s.node && !seenN[s.node]) { seenN[s.node] = 1; inter.push({ node: s.node, x: s.x, y: s.y, name: bowlC && s.node === bowlC.id ? 'THE SPAGHETTI BOWL' : null }); } });
    var runs = [];
    steps.forEach(function (s) { var d = s.where === 'valley' ? 'LAS VEGAS VALLEY' : (s.district || '?'); if (runs.length && runs[runs.length - 1][0] === d) runs[runs.length - 1][1]++; else runs.push([d, 1]); });
    var made = steps.filter(function (s) { return s.made; }).length;
    return { name: name, lanes: { valley: ln[0], region: ln[1] }, steps: steps, holes: holes, ramps: ramps, interchanges: inter,
             districts: runs, squares: steps.map(function (s) { return [s.x, s.y, s.where === 'valley' ? (s.beside || []).filter(Boolean).join('|') || 'junction' : s.district]; }),
             breaks: bk, made: made,
             ends: steps.length ? [[steps[0].x, steps[0].y, steps[0].where], [steps[steps.length - 1].x, steps[steps.length - 1].y, steps[steps.length - 1].where]] : [] };
  }

  /* 7. EVERY VALLEY FREEWAY CELL: its names, its piece, its sibling half */
  var cells = {};
  freeways.forEach(function (f) { f.steps.forEach(function (s) { if (s.where !== 'valley') return; s.cells.forEach(function (q) {
    var k = key(q[0], q[1]), c = cells[k] || (cells[k] = { names: [], seg: s.seg || null, node: s.node || null, axis: s.axis || null, junction: !!s.junction, lanes: 0, ramp: s.ramp || null });
    if (c.names.indexOf(f.name) < 0) c.names.push(f.name); c.lanes = Math.max(c.lanes, s.lanes);
    if (s.cells.length === 2) { var o = s.cells[0] === q ? s.cells[1] : s.cells[0]; c.median = o[0] > q[0] ? 'E' : o[0] < q[0] ? 'W' : o[1] > q[1] ? 'S' : 'N'; }
  }); }); });
  /* the pieces no through-road takes (a stub, a pass): named by the road their exit meets, still one pair */
  segs.forEach(function (s) {
    /* the spine's corridor is I-15 the whole way (north of the bowl too: the real I-15 and US-93 run on north of the
       Spaghetti Bowl); the ring is CC-215 */
    var nA = nodes[s.a], nB = nodes[s.b], nm = (nA && nA.road) || (nB && nB.road) ||
      (s.kind === 'spine' ? 'I-15' : s.kind === 'ring' ? 'CC-215' : s.kind === 'cross-town' ? 'US-95' : s.kind === 'pass' ? 'a mountain pass' : s.kind === 'exit' ? 'an exit stub' : s.piece);
    var ln0 = (LANES[nm] || [s.w === 2 ? 2 : 1])[0];
    s.steps.forEach(function (c) { c.forEach(function (q) { var k = key(q[0], q[1]); if (cells[k]) return;
      var cc = cells[k] = { names: [nm], seg: s.id, axis: s.axis, junction: false, lanes: ln0, ramp: null, spur: true };
      if (c.length === 2) { var o = c[0] === q ? c[1] : c[0]; cc.median = o[0] > q[0] ? 'E' : o[0] < q[0] ? 'W' : o[1] > q[1] ? 'S' : 'N'; } }); });
  });
  Object.keys(nodes).forEach(function (k) { var n = nodes[k]; if (n.kind !== 'junction' && n.kind !== 'bowl') return;
    n.cells.forEach(function (q) { var kk = key(q[0], q[1]); if (!cells[kk]) cells[kk] = { names: [], node: k, junction: true, lanes: 0 }; }); });
  var orphans = [], lonely = [];
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) if (isF(x, y) && !cells[key(x, y)]) orphans.push([x, y]);
  segs.forEach(function (s) { if (s.w === 2) s.steps.forEach(function (c) { if (c.length === 1) lonely.push(c[0]); }); });

  /* 8. THE RIM BY NAME, beside today's stitch: every exit and the road it meets */
  /* the rim connectors by name, in stitch()'s own shape */
  var joins = [];
  exits.forEach(function (e) {
    if (!e.road || e.spur) return; var P = portalOf(e.road); if (!P) return;
    var r = rim(e, P); joins.push({ road: e.road, cls: P.cls, edge: e.edge, c: e.c, piece: e.piece, cells: r.map(function (q) { return [q.x, q.y]; }), made: r.filter(function (q) { return q.made; }).length });
  });
  var exitList = exits.map(function (e) { return { id: e.id, edge: e.edge, c: e.c, w: e.w, piece: e.piece, road: e.road || null, spur: !!e.spur,
    rimBlocks: e.road && !e.spur && portalOf(e.road) ? Math.max(0, rim(e, portalOf(e.road)).length - 1) : null }; });
  var counts = { cells: Object.keys(cells).length, freewayCells: 0, segments: segs.length, junctions: clusters.length, exits: exits.length,
                 orphans: orphans.length, lonely: lonely.length, breaks: breaks.length,
                 breakBlocks: breaks.reduce(function (s, b) { return s + (b.gap || 0); }, 0),
                 holes: freeways.reduce(function (s, f) { return s + f.holes.length; }, 0),
                 made: freeways.reduce(function (s, f) { return s + f.made; }, 0) };
  for (var yy = 0; yy < N; yy++) for (var xx = 0; xx < N; xx++) if (isF(xx, yy)) counts.freewayCells++;
  return { seed: om.seed, compass: compass, freeways: freeways, cells: cells, exits: exitList, joins: joins, segments: segs.map(function (s) { return { id: s.id, piece: s.piece, kind: s.kind, axis: s.axis, w: s.w, a: s.a, b: s.b, steps: s.steps.length }; }),
           junctions: clusters.map(function (c) { return { id: c.id, cells: c.cells.length, bowl: c === bowlC }; }),
           orphans: orphans, lonely: lonely, breaks: breaks, counts: counts };
}
function cellAt(F, x, y) { return F.cells[key(x, y)] || null; }
/* THE SWAP FOR RUN: where slices/bohemia_region.js calls L.stitch(r.roads, C), this joins every rim road BY ITS
   NAME instead of by the nearest portal on the same side, writes the same connector table the loader's own stitch
   writes (so L.at, passGrid and the clock see it), and returns stitch()'s shape: the cells, then one line an exit. */
function stitch(F, land, compass) {
  var N = land.N, K = land.K, D = land.D, m = compass && compass.e === 'x0', ex = {}, out = [];
  F.joins.forEach(function (j) {
    j.cells.forEach(function (q) {
      var x = q[0], y = q[1]; if (x >= 0 && y >= 0 && x < N && y < N) return;
      var k = (y + K) * D + ((m ? N - 1 - x : x) + K); if (!ex[k] || j.cls < ex[k]) ex[k] = j.cls; out.push({ x: x, y: y, cls: j.cls });
    });
    out.push({ stitched: true, edge: j.edge, c: j.c, to: j.road, cells: j.cells.length, made: j.made });
  });
  land.extra[m ? 'x0' : 'x1'] = ex;
  return out;
}

var API = { of: of, cellAt: cellAt, stitch: stitch, THROUGH: THROUGH, LANES: LANES, CLASS1: CLASS1, RIM_BUDGET: RIM_BUDGET };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else root.BohemiaFreeways = API;
})(typeof self !== 'undefined' ? self : this);
