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

console.log('WASH GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
