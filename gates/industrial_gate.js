// INDUSTRIAL DISTRICT GATE (Paolo 7/18/26) — the first district built on the KIT, proving
// the factory. A warehouse yard must: have warehouse buildings + a truck yard, keep the
// yard connected to the street (drive-in gates reach it), be street-aware (gates only on
// street edges, a corner exits two), and be deterministic.
const I = require('../engine/bohemia_industrial.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// STREET-AWARE/DRIVABLE LAW (7/19): every placement — each single edge + corners.
const CONFIGS = [{ streets: ['S'] }, { streets: ['N'] }, { streets: ['E'] }, { streets: ['W'] }, { streets: ['S', 'E'] }, { streets: ['N', 'W'] }];

let allWare = true, allYard = true, allConn = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = I.generate(s * 31 + 7, cfg);
  if (!r.footprints.length) allWare = false;
  let yard = 0, ware = 0;
  for (const row of r.g) for (const c of row) { if (c === 1) yard++; else if (c === 2) ware++; }
  if (yard < 800) allYard = false;
  if (ware < 400) allWare = false;
  if (!I.driveConnected(r)) allConn = false;
}
ok('every yard has warehouse buildings', allWare);
ok('every yard has a real truck yard (asphalt)', allYard);
ok('the yard stays connected to the street (gates reach the yard)', allConn);

// street-aware: gates only on street edges; corner exits two
let gatesOk = true;
for (const cfg of CONFIGS) {
  const r = I.generate(99, cfg), g = r.g, W = r.g[0].length, H = r.g.length;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== 5) continue;
    const e = edgeOf(x, y);
    if (!e || !cfg.streets.includes(e)) gatesOk = false;
  }
  for (const e of cfg.streets) if (!new Set(r.gates.map(t => t.edge)).has(e)) gatesOk = false;
}
ok('gates sit ONLY on street edges, every street gets one', gatesOk);
ok('a corner yard exits two streets', new Set(I.generate(9, { streets: ['S', 'E'] }).gates.map(t => t.edge)).size === 2);

// footprints building-sized + enterable-ready
const fps = I.generate(7, { streets: ['S'] }).footprints;
ok('warehouse footprints are building-sized (>= 8 tiles)', fps.every(f => f.w >= 8 && f.h >= 8));

// registered in the KIT (the world model finds it via the registry)
ok('industrial is registered in the district kit', !!K.get('industrial'));

// determinism
ok('deterministic per seed', JSON.stringify(I.generate(42, { streets: ['S', 'E'] }).g) === JSON.stringify(I.generate(42, { streets: ['S', 'E'] }).g));

console.log('INDUSTRIAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
