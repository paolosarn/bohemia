// CEMETERY GATE (7/19/26) — a memorial-park cemetery (CIVIC) on the KIT. Must have its anatomy
// (grave sections of headstone rows on dead lawn, memorial drives, a chapel, a mausoleum, a
// columbarium, a central fountain + monument), be street-aware + DRIVABLE (you drive through a
// cemetery — the drives reach the street in any placement), legend + dossier + layering
// complete, act-1 dead, and deterministic.
const C = require('../engine/bohemia_cemetery.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['N'] }, { streets: ['E'] }, { streets: ['W'] }, { streets: ['S', 'E'] }, { streets: ['N', 'W'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

let anatomy = true, filled = true, streetOk = true, allConn = true, cornerPed = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = C.generate(s * 29 + 7, cfg), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // drives(1), lawn(4), headstones(6, many), chapel/office/shed(2), mausoleum(7), columbarium(8),
  // fountain(9), monument(11), trees(3), walking path(10)
  if (!(t[1] > 1500 && t[4] > 2000 && t[6] > 600 && t[2] > 300 && t[7] > 200 && t[8] > 20 &&
        t[9] > 15 && t[11] > 0 && t[3] > 40 && t[10] > 40)) anatomy = false;
  if (!K.legendOk(r.g, C.palette) || K.voidFraction(r.g) > 0.14 || K.largestBlob(r.g, c => c === 0) > 0.12) filled = false;
  if (!C.driveConnected(r)) allConn = false;                                     // you DRIVE through a cemetery — reach it from the street, any placement
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.streets.length > 1) { for (const e of cfg.streets) if (!gateEdges.has(e)) cornerPed = false; }
}
ok('anatomy: drives + lawn + headstone rows + chapel + mausoleum + columbarium + fountain + monument', anatomy);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('a vehicle reaches the memorial drives from the street — EVERY placement', allConn);
ok('gates sit only on street edges', streetOk);
ok('CORNER: a gate on each street frontage (vehicle primary + pedestrian side)', cornerPed);

ok('cemetery registered + civic + LEGEND + NOTES(+layering) dossier', !!K.get('cemetery') && K.category('cemetery') === 'civic' &&
  !!C.legend && !!C.notes && !!C.notes.summary && !!C.notes.layering && C.notes.layout.length > 0);
ok('chapel + mausoleum are enterable footprints', C.generate(7, { streets: ['S'] }).footprints.length > 0);
ok('deterministic per seed', JSON.stringify(C.generate(63, { streets: ['S'] }).g) === JSON.stringify(C.generate(63, { streets: ['S'] }).g));

console.log('CEMETERY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
