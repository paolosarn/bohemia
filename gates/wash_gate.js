// WASH GATE (Paolo 7/19/26) — a Las Vegas flood-control wash with a SEWER TUNNEL MOUTH by the
// street (where the unhoused get underground). Must have the channel anatomy (banks, invert,
// dead trickle), the headwall + box-culvert tunnel mouth, a homeless camp at the mouth, fence
// + riprap, be street-aware + drivable (maintenance O&M roads, any placement), legend + dossier
// complete, act-1 dead, and deterministic.
const Wm = require('../engine/bohemia_wash.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['N'] }, { streets: ['E'] }, { streets: ['W'] }, { streets: ['S', 'E'] }, { streets: ['N', 'W'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };


let anatomy = true, mouth = true, camp = true, filled = true, streetOk = true, allConn = true, cornerPed = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = Wm.generate(s * 17 + 3, cfg), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  if (!(t[4] > 1500 && t[6] > 1500 && t[7] > 200 && t[1] > 300 && t[9] > 100 && t[10] > 100)) anatomy = false; // banks, invert, trickle, roads, riprap, fence
  if (!(t[8] > 100 && t[2] > 40)) mouth = false;                                 // the box-culvert tunnel MOUTH + headwall
  if (!(t[11] > 40)) camp = false;                                               // homeless camp debris at the mouth
  if (!K.legendOk(r.g, Wm.palette) || K.voidFraction(r.g) > 0.35 || K.largestBlob(r.g, c => c === 0) > 0.28) filled = false;
  if (!Wm.driveConnected(r)) allConn = false;                                     // O&M roads reachable from the street, ANY placement
  // (driveTouchesEdge is skipped: the wash O&M roads span the full cell length and touch several
  //  edges, so the heuristic is ambiguous here — driveConnected from the curb is the real check.)
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.streets.length > 1) { for (const e of cfg.streets) if (!gateEdges.has(e)) cornerPed = false; }
}
ok('channel anatomy: banks + invert + dead trickle + O&M roads + riprap + fence', anatomy);
ok('the SEWER TUNNEL MOUTH (box culvert) + headwall exist', mouth);
ok('a homeless camp sits at the mouth', camp);
ok('every tile named + desert margins not a blank slab (EXPLAIN-EVERY-TILE)', filled);
ok('a maintenance vehicle reaches the O&M roads from the street — EVERY placement', allConn);
ok('gates sit only on street edges', streetOk);
ok('CORNER: a gate on each street frontage (vehicle primary + pedestrian side)', cornerPed);

ok('wash registered + categorized (terrain) + LEGEND + NOTES dossier', !!K.get('wash') && K.category('wash') === 'terrain' &&
  !!Wm.legend && !!Wm.notes && !!Wm.notes.summary && Wm.notes.layout.length > 0);
ok('deterministic per seed', JSON.stringify(Wm.generate(41, { streets: ['S'] }).g) === JSON.stringify(Wm.generate(41, { streets: ['S'] }).g));


/* ===================== ONE WASH, NOT FIFTY-ONE (8/25) =====================
   A wash is a RIVER. The canon valley's runs east from cell (56,47) to (89,47) and then
   turns south to (89,75): 51 cells of one continuous flood-control channel. Handed only
   its own cell, every one of them built a COMPLETE channel -- full banks, invert, trickle,
   fence, and its own box-culvert tunnel mouth. Along the east-west run that is 34 parallel
   NORTH-SOUTH channels sitting shoulder to shoulder, each diving under a street. A comb.

   The generator now takes its four neighbours and runs the channel THROUGH the cell on the
   axis the blob continues on, so the next cell's channel starts exactly where this one
   stops. Everything below is what stops that quietly coming apart: a seam that drifts by a
   tile reads as a broken river and throws no error anywhere.

   THE LONE CELL IS DELIBERATELY UNTOUCHED and the first check here is that it stayed that
   way -- canonical-south plus rotateToStreet is the right answer for one cell, and it is
   art that already shipped. */
const OM = require('../engine/bohemia_overmap.js');
const nbOf = o => ({ n: !!o.n, s: !!o.s, e: !!o.e, w: !!o.w });
const SHAPES = [
  ['straight east-west', { e: 1, w: 1 }], ['straight north-south', { n: 1, s: 1 }],
  ['end (west neighbour)', { w: 1 }], ['end (north neighbour)', { n: 1 }],
  ['corner west+south', { s: 1, w: 1 }], ['corner east+north', { n: 1, e: 1 }],
  ['tee west+east+south', { e: 1, s: 1, w: 1 }],
];

let lone = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 6; s++) {
  const a = JSON.stringify(Wm.generate(s * 17 + 3, cfg).g);
  const b = JSON.stringify(Wm.generate(s * 17 + 3, { streets: cfg.streets, neigh: nbOf({}) }).g);
  if (a !== b) lone = false;
}
ok('a wash with no wash neighbour is BYTE-IDENTICAL to the one that shipped', lone);

let shapeAnat = true, shapeFill = true, shapeDrive = true, shapeLegend = true;
let interiorMouth = false, endMouth = true;
for (const [, nb] of SHAPES) for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = Wm.generate(s * 17 + 3, { streets: cfg.streets, neigh: nbOf(nb) }), t = counts(r);
  if (!(t[4] > 1000 && t[6] > 1500 && t[7] > 100 && t[1] > 300 && t[10] > 50)) shapeAnat = false;
  if (!K.legendOk(r.g, Wm.palette)) shapeLegend = false;
  if (K.voidFraction(r.g) > 0.35 || K.largestBlob(r.g, c => c === 0) > 0.28) shapeFill = false;
  if (!Wm.driveConnected(r)) shapeDrive = false;
  /* THE MOUTH IS A BLOB FEATURE. A cell the channel runs THROUGH must not dive underground
     -- that is the whole defect. A cell where it ENDS must. */
  const ends = (nb.n ? 1 : 0) + (nb.s ? 1 : 0) + (nb.e ? 1 : 0) + (nb.w ? 1 : 0);
  if (ends > 1 && t[8] > 0) interiorMouth = true;
  if (ends === 1 && !(t[8] > 100 && t[2] > 40 && t[11] > 40)) endMouth = false;
}
ok('every shape keeps the channel anatomy (banks, invert, trickle, O&M roads, fence)', shapeAnat);
ok('every shape names every tile', shapeLegend);
ok('every shape dresses its desert margins whichever way the channel runs', shapeFill);
ok('a maintenance vehicle reaches the O&M roads on every shape and every street', shapeDrive);
ok('a cell the channel RUNS THROUGH never dives underground (that was the 51-mouth bug)', !interiorMouth);
ok('a cell where the channel ENDS has the headwall, the box culvert and the camp', endMouth);

/* AND THE SEAM, WHICH IS THE ONLY CHECK THAT CAN SEE THE DEFECT AT ALL. Every other line
   above passes on a single cell in isolation. This walks the REAL valley, generates every
   wash cell with the neighbours the map actually gives it, and compares the touching edges
   tile for tile. Dead brush is allowed to differ -- it is scattered dressing and does not
   line up in life either; concrete is not. */
const map = OM.buildOvermap('bohemia'), N = OM.OVER_N;
const isW = (x, y) => { const c = (x < 0 || y < 0 || x >= N || y >= N) ? null : map.at(x, y); return !!(c && c.district === 'wash'); };
const cache = {};
const cellAt = (x, y) => cache[x + ',' + y] || (cache[x + ',' + y] =
  Wm.generate(map.at(x, y).seed >>> 0,
    { streets: [], neigh: { n: isW(x, y - 1), s: isW(x, y + 1), e: isW(x + 1, y), w: isW(x - 1, y) } }).g);
const soft = v => v === 0 || v === 3 || v === 9 || v === 11;   // brush, rock, litter: scattered dressing
let washCells = 0, seams = 0, brokenSeams = 0, mouthCells = 0;
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (!isW(x, y)) continue;
  washCells++;
  const g = cellAt(x, y);
  let hasMouth = false;
  for (let r = 0; r < 128 && !hasMouth; r++) for (let c = 0; c < 128; c++) if (g[r][c] === 8) { hasMouth = true; break; }
  if (hasMouth) mouthCells++;
  if (isW(x + 1, y)) { const h = cellAt(x + 1, y); seams++; let bad = 0;
    for (let r = 0; r < 128; r++) if (g[r][127] !== h[r][0] && !(soft(g[r][127]) && soft(h[r][0]))) bad++;
    if (bad) brokenSeams++; }
  if (isW(x, y + 1)) { const h = cellAt(x, y + 1); seams++; let bad = 0;
    for (let c = 0; c < 128; c++) if (g[127][c] !== h[0][c] && !(soft(g[127][c]) && soft(h[0][c]))) bad++;
    if (bad) brokenSeams++; }
}
ok('the real valley still has a wash to check (' + washCells + ' cells, ' + seams + ' seams)', washCells > 20 && seams > 20);
ok('EVERY seam lines up: the channel leaves one cell exactly where it enters the next ('
  + (seams - brokenSeams) + ' of ' + seams + ')', brokenSeams === 0);
/* One mouth at each END of each run: the channel dives under the cross street and comes
   back out the other side, which is how the real Las Vegas system behaves. 51 was one per
   cell and meant nothing. */
ok('the tunnel mouths are the ends of runs, not one per cell (' + mouthCells + ' of ' + washCells + ')',
  mouthCells > 0 && mouthCells <= washCells * 0.4);
console.log('  REAL VALLEY: ' + washCells + ' wash cells, ' + seams + ' seams, '
  + brokenSeams + ' broken, ' + mouthCells + ' tunnel mouths (was ' + washCells + ')');

console.log('WASH GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
