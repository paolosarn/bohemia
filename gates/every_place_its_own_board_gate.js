#!/usr/bin/env node
/* EVERY PLACE ITS OWN BOARD (COMBAT MAPS 3, VAMILY rule 341, ask line 350; Paolo 11/3: 'everything just looked exactly the same
   as the main suburb shit we have and then you gave a bunch of greenery to the suburb... nothing made them uniquely unique,
   nothing made them fun to do, no variety, like true variety, it was just recycled hogwash... you're not done').
   COMBAT MAPS 2 measured its own success as 'old sand %' (a colour) and never measured the PLAN, the thing he complained about.
   This gate measures the PLAN of the boards the LIVE fight deals (slices/BOHEMIA_FIGHT.html through the tuning bench's headless
   engine, the alpha's own nfKind hand-over), K fights a place, each from its own map cell, on the FIGHT WINDOW (your back column
   to two past their front: the ground the fight is played on):
     open     a cell you stand on with nothing on it (flat, level 0, no cover)       cover   a cell with a piece a man hides behind
     blocked  no step (a wall, a rock, a wreck, a fence)                              fence   no step, but the shot goes through
     height   a cell above level 0 (a roof, a ledge, a dock)                         slow    rough, rubble, sand, water (3+ AP)
     choke    an open cell with no step on both sides (a lane one wide)              start   where their men stand: how wide their
                                                                                              spread, how far from your front
   and checks, for every place built (ours.place_boards, built: true):
     (1) DIFFERENT: its plan differs from EVERY other place's (built or not) by at least FLOOR (the sum of the share differences,
         plus the start's shape); and from THE SUBURB's by at least FLOOR, whatever else;
     (2) SEEDED: its K fights are K different boards (the tiles, the pieces and where their men stand);
     (3) NAMED: it names its landmark, its things and its twist (the data file, never this gate);
   for THE SUBURBS and THE GOLF COURSE, built or not: (4) NO GREEN: under 1% of the pixels of every block picture they deal are
   green (hue 70-170, saturation over 0.18: his 11/3, 'you gave a bunch of greenery to the suburb');
   and (5) THE RATCHET: a place not yet built must be on OWED below, which may only shrink (push 1: the lab yard, the airport and
   the golf course; push 2 the next six; push 3 the rest).
     node gates/every_place_its_own_board_gate.js [--json out.json] [--before]
   --before measures every place as dealt and reports, never fails (the record's before). */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const G = require('../tools/bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null), BEFORE = process.argv.includes('--before');
const K = 10, FLOOR = 0.6, GREEN_MAX = 0.01;
const OWED = ['trailer', 'desert', 'redrock', 'pass', 'shore', 'wash', 'landfill', 'suburb', 'strip', 'downtown', 'works', 'marina'];
const FIFTEEN = ['lab', 'airport', 'golf', 'trailer', 'desert', 'redrock', 'pass', 'shore', 'wash', 'landfill', 'suburb', 'strip', 'downtown', 'works', 'marina'];
const FEATS = ['open', 'cover', 'blocked', 'fence', 'height', 'slow', 'choke'];

function alphaKind() {
  const a = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const k = a.match(/function nfKind\(district\)\{[\s\S]*?\n\}/); if (!k) throw new Error('THE ALPHA MOVED: no nfKind');
  return new Function(k[0] + '; return nfKind;')();
}
function measure(F) {
  const S = F.S, x0 = Math.max(0, S.cols[0] - 1), x1 = Math.min(S.w - 1, S.cols[1] + 2), c = {}, m = {};
  FEATS.forEach(f => { c[f] = 0; m[f] = 0; });
  let n = 0, nm = 0;
  const blockedAt = (x, y) => x < 0 || y < 0 || x >= S.w || y >= S.h || F.rowAt(x, y) === 'obstacles' || S.solid[y][x];
  const thing = [];   /* not open ground: what a landmark is made of */
  for (let y = 0; y < S.h; y++) { thing.push([]); for (let x = 0; x < S.w; x++) thing[y].push(false); }
  for (let y = 0; y < S.h; y++) for (let x = x0; x <= x1; x++) {
    const mid = x > S.cols[0] && x < S.cols[1];   /* between the two fronts: the middle he saw empty */
    n++; if (mid) nm++;
    const add = f => { c[f]++; if (mid) m[f]++; };
    const t = S.terrain[y][x], obst = F.rowAt(x, y) === 'obstacles';
    if (obst || S.solid[y][x]) { add('blocked'); if (!obst) add('fence'); thing[y][x] = true; continue; }
    const lv = F.level(x, y) > 0, slow = /^(rough|debris|water)$/.test(t), cov = S.coverCount[y][x] > 0;
    if (lv) add('height');
    if (slow) add('slow');
    if (cov) add('cover');
    if (lv || cov) thing[y][x] = true;
    if (!lv && !slow && !cov) add('open');
    if ((blockedAt(x - 1, y) && blockedAt(x + 1, y)) || (blockedAt(x, y - 1) && blockedAt(x, y + 1))) add('choke');
  }
  FEATS.forEach(f => { c[f] /= n; c['mid_' + f] = m[f] / Math.max(1, nm); });
  /* the landmark, as cells: the biggest group of things (walls, roofs, cover, fences) touching the middle */
  let big = 0; const seen = {};
  for (let y = 0; y < S.h; y++) for (let x = S.cols[0] + 1; x < S.cols[1]; x++) {
    if (!thing[y][x] || seen[y * S.w + x]) continue;
    let sz = 0; const q = [[x, y]]; seen[y * S.w + x] = true;
    while (q.length) { const [a, b] = q.pop(); sz++; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const u = a + dx, v = b + dy;
      if (u >= x0 && u <= x1 && v >= 0 && v < S.h && thing[v][u] && !seen[v * S.w + u]) { seen[v * S.w + u] = true; q.push([u, v]); } }); }
    big = Math.max(big, sz);
  }
  c.landmark = Math.min(1, big / 12);
  const them = S.units.filter(u => u.side !== 'you' && u.x >= 0), xs = them.map(u => u.x), ys = them.map(u => u.y);
  c.spread = xs.length ? (Math.max(...xs) - Math.min(...xs)) / 6 : 0;                   /* a line is 0 to 1/6; a camp, wider */
  c.gap = xs.length ? (Math.min(...xs) - S.cols[0]) / 10 : 0;
  c.ysplit = ys.length ? ys.filter(y => Math.abs(y - (S.h - 1) / 2) <= 2).length / ys.length : 0;   /* a pincer leaves the middle */
  c.start = S.boardDef.start || 'line';
  c.key = JSON.stringify([S.terrain, (S.boardDef.cover || []).map(q => [q.piece, q.x_m, q.y_m]), them.map(u => [u.x, u.y])]);
  c.blocks = [].concat(...(S.boardDef.blocks || [])).map(b => String(b).split('|')[0]);
  c.landmarkBetween = S.boardDef.own ? (S.boardDef.blocks || []).some(r => String(r[1]).split('|')[0] === (S.boardDef.lm || '')) : null;
  return c;
}
const MODES = ['line', 'wide', 'camp', 'pincer'];
const ALL = FEATS.concat(FEATS.map(f => 'mid_' + f));
/* the plan distance: the window's shares, the middle's shares, the landmark, and where they start (its mode and its shape) */
const dist = (a, b) => ALL.reduce((t, f) => t + Math.abs(a[f] - b[f]), 0) + Math.abs(a.landmark - b.landmark) * 0.5 +
  MODES.reduce((t, k) => t + Math.abs((a.modes[k] || 0) - (b.modes[k] || 0)), 0) * 0.25 +
  (Math.abs(a.spread - b.spread) + Math.abs(a.gap - b.gap) + Math.abs(a.ysplit - b.ysplit)) * 0.5;

function greenShare(files) {
  /* GREEN, AS HE SAW IT: green or olive, the green channel at or over the red and well over the blue (the olive dead lawn
     (141,136,97) of 11/2 is hue 55, outside any hue test, and read green on his phone); a dead brown thatch has red 10+ over green */
  const py = 'import sys, json, numpy as np\nfrom PIL import Image\nout = {}\nfor f in sys.argv[1:]:\n' +
    '    a = np.asarray(Image.open(f).convert("RGB")).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]\n' +
    '    mx = a.max(-1); mn = a.min(-1); s = (mx - mn) / np.maximum(mx, 1)\n' +
    '    out[f] = float(((g >= r - 4) & (g > b + 18) & (s > 0.15)).mean())\nprint(json.dumps(out))\n';
  return JSON.parse(cp.execFileSync('python3', ['-c', py].concat(files), { encoding: 'utf8', maxBuffer: 1 << 24 }));
}

(async () => {
  const nfKind = alphaKind();
  const ours = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
  const PB = ours.place_boards && ours.place_boards.value;
  const fails = [], notes = [];
  if (!PB || !PB.places) { console.log('EVERY PLACE ITS OWN BOARD: FAIL\n  ours.place_boards is missing: the fifteen places are not named'); process.exit(1); }
  const places = PB.places;
  FIFTEEN.forEach(id => {
    const p = places[id];
    if (!p) { fails.push(id + ': not in ours.place_boards'); return; }
    ['name', 'landmark', 'things', 'twist'].forEach(k => { if (!p[k] || String(p[k]).length < 8) fails.push(id + ': names no ' + k); });
    if (!p.gate_district) fails.push(id + ': no gate_district');
  });
  const ctx = await G.engine(true), F = ctx.FIGHT, DB = ctx.DB;
  const M = {}, MEAN = {};
  FIFTEEN.forEach((id, pi) => {
    const p = places[id]; if (!p) return;
    M[id] = [];
    for (let k = 0; k < K; k++) {
      const d = p.gate_district, o = { kind: nfKind(d), district: d, cell: { x: 9 + ((k * 7 + pi * 3) % 70), y: 11 + ((k * 13 + pi * 5) % 60) }, auto: true, formation: null, night: false };
      ctx.setSeed(4100 + k * 31 + pi);
      F.setup(o); M[id].push(measure(F));
    }
    const m = {}; ALL.concat(['landmark', 'spread', 'gap', 'ysplit']).forEach(f => { m[f] = M[id].reduce((t, r) => t + r[f], 0) / K; });
    const st = {}; M[id].forEach(r => { st[r.start] = (st[r.start] || 0) + 1; }); m.starts = st;
    m.modes = {}; MODES.forEach(k => { m.modes[k] = (st[k] || 0) / K; });
    m.distinct = new Set(M[id].map(r => r.key)).size;
    m.blocks = Array.from(new Set([].concat(...M[id].map(r => r.blocks)))).sort();
    MEAN[id] = m;
  });
  const D = {};
  FIFTEEN.forEach(a => { D[a] = {}; FIFTEEN.forEach(b => { if (a !== b && MEAN[a] && MEAN[b]) D[a][b] = Math.round(dist(MEAN[a], MEAN[b]) * 1000) / 1000; }); });
  /* the green: every block picture the suburbs and the golf course deal */
  const gfiles = {};
  ['suburb', 'golf'].forEach(id => { (MEAN[id] ? MEAN[id].blocks : []).forEach(b => { const src = DB.ground.blocks[b] && DB.ground.blocks[b].src; if (src) gfiles[path.join(ROOT, 'slices/fight_ground', src)] = id; }); });
  const GS = Object.keys(gfiles).length ? greenShare(Object.keys(gfiles)) : {};
  const greenOf = id => Object.keys(GS).filter(f => gfiles[f] === id).map(f => ({ file: path.basename(f), share: GS[f] }));
  const built = FIFTEEN.filter(id => places[id] && places[id].built);
  FIFTEEN.filter(id => places[id] && !places[id].built).forEach(id => { if (OWED.indexOf(id) < 0) fails.push(id + ': not built and not OWED (the ratchet only shrinks)'); });
  built.forEach(id => {
    const near = Object.keys(D[id]).sort((a, b) => D[id][a] - D[id][b])[0];
    if (D[id][near] < FLOOR) fails.push(id + ': its plan is within ' + D[id][near] + ' of ' + near + "'s (floor " + FLOOR + ')');
    if (D[id].suburb !== undefined && D[id].suburb < FLOOR) fails.push(id + ": its plan matches the suburb's (" + D[id].suburb + ')');
    if (MEAN[id].distinct < K) fails.push(id + ': ' + K + ' fights dealt only ' + MEAN[id].distinct + ' different boards');
    const lm = places[id].landmark_block; if (!MEAN[id].blocks.includes(lm)) fails.push(id + ': its landmark ' + lm + ' was never dealt');
    if (M[id].some(r => !r.landmarkBetween)) fails.push(id + ': its landmark did not stand between the two lines in every fight');
    if ((MEAN[id].modes.line || 0) > 0.6) fails.push(id + ': ' + Math.round(MEAN[id].modes.line * 100) + '% of its fights start as the two plain lines (never always the lines at the edges)');
    if (MEAN[id].landmark < 0.3) fails.push(id + ': no landmark in the middle (its biggest group of things there is ' + Math.round(MEAN[id].landmark * 12) + ' cells)');
    const strangers = MEAN[id].blocks.filter(b => b.split('.')[0] !== lm.split('.')[0]);
    if (strangers.length) fails.push(id + ' deals another place\'s blocks: ' + strangers.join(', '));
  });
  ['suburb', 'golf'].forEach(id => greenOf(id).forEach(g => { if (g.share > GREEN_MAX) fails.push(id + ': ' + g.file + ' is ' + (g.share * 100).toFixed(1) + '% green'); }));
  const rows = FIFTEEN.filter(id => MEAN[id]).map(id => {
    const m = MEAN[id], near = Object.keys(D[id]).sort((a, b) => D[id][a] - D[id][b])[0];
    return { place: id, built: !!places[id].built, mid_open: +m.mid_open.toFixed(3), landmark: +m.landmark.toFixed(2), open: +m.open.toFixed(3), cover: +m.cover.toFixed(3), blocked: +m.blocked.toFixed(3), fence: +m.fence.toFixed(3),
      height: +m.height.toFixed(3), slow: +m.slow.toFixed(3), choke: +m.choke.toFixed(3), spread: +m.spread.toFixed(2), gap: +m.gap.toFixed(2), starts: m.starts,
      distinct: m.distinct, nearest: near, nearest_d: D[id][near], to_suburb: D[id].suburb === undefined ? 0 : D[id].suburb, blocks: m.blocks };
  });
  const pairsUnder = []; FIFTEEN.forEach((a, i) => FIFTEEN.slice(i + 1).forEach(b => { if (D[a] && D[a][b] !== undefined && D[a][b] < FLOOR) pairsUnder.push(a + '/' + b + ' ' + D[a][b]); }));
  const green = { suburb: greenOf('suburb'), golf: greenOf('golf') };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ k: K, floor: FLOOR, rows, pairs_under_floor: pairsUnder, green, distances: D }, null, 1));
  console.log('place      built open  cover block fence hght  slow  choke  midopen lmark spread gap  starts                     boards nearest (d)       suburb');
  rows.forEach(r => console.log([r.place.padEnd(10), (r.built ? 'YES' : '-').padEnd(5), r.open.toFixed(2).padEnd(5), r.cover.toFixed(2).padEnd(5), r.blocked.toFixed(2).padEnd(5),
    r.fence.toFixed(2).padEnd(5), r.height.toFixed(2).padEnd(5), r.slow.toFixed(2).padEnd(5), r.choke.toFixed(2).padEnd(6), r.mid_open.toFixed(2).padEnd(7), r.landmark.toFixed(2).padEnd(5), r.spread.toFixed(2).padEnd(6), r.gap.toFixed(2).padEnd(4),
    JSON.stringify(r.starts).padEnd(26), String(r.distinct).padEnd(6), (r.nearest + ' ' + r.nearest_d).padEnd(16), r.to_suburb].join(' ')));
  console.log('pairs of places under the floor (' + FLOOR + '): ' + pairsUnder.length + ' of ' + (FIFTEEN.length * (FIFTEEN.length - 1) / 2));
  console.log('green: suburb ' + green.suburb.map(g => (g.share * 100).toFixed(1) + '%').join(' ') + ' | golf ' + green.golf.map(g => (g.share * 100).toFixed(1) + '%').join(' '));
  console.log('owed (built later, may only shrink): ' + FIFTEEN.filter(id => places[id] && !places[id].built).join(', '));
  if (BEFORE) { console.log('EVERY PLACE ITS OWN BOARD: BEFORE (measured, not judged): ' + fails.length + ' would fail'); fails.forEach(f => console.log('  ' + f)); process.exit(0); }
  if (fails.length) { console.log('EVERY PLACE ITS OWN BOARD: FAIL'); fails.forEach(f => console.log('  ' + f)); process.exit(1); }
  console.log('EVERY PLACE ITS OWN BOARD: PASS (' + built.length + ' of 15 built, every built place past the floor from all fifteen and the suburb, ' + K + ' different boards each, the suburb and the golf course under 1% green)');
})().catch(e => { console.error(e); process.exit(1); });
