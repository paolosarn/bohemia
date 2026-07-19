// SOLAR FARM GATE (Paolo 7/18/26) — first INFRASTRUCTURE district on the KIT. A utility
// solar farm must have panel arrays + gravel access roads + inverter pads + a substation
// switchyard + a control building, be street-aware, filled (EXPLAIN-EVERY-TILE), registered
// + filed as infrastructure, and deterministic.
const S = require('../engine/bohemia_solar.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['S', 'E'] }, { streets: ['N'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

let allParts = true, streetOk = true, filled = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = S.generate(s * 19 + 7, cfg), t = counts(r);
  if (!(t[7] > 2000 && t[6] > 100 && t[4] > 40 && t[2] > 40)) allParts = false;   // panels, switchgear, inverters, control building
  if (!K.legendOk(r.g, S.palette) || K.voidFraction(r.g) > 0.18 || K.largestBlob(r.g, c => c === 0) > 0.14) filled = false;
  const g = r.g, W = r.g[0].length, H = r.g.length, edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; }
}
ok('every farm has panels + switchyard + inverters + control building', allParts);
ok('gates sit only on street edges', streetOk);
ok('every tile named + no big blank void (EXPLAIN-EVERY-TILE)', filled);

// registered + categorized + footprint (the control building is enterable)
ok('solar registered + filed as infrastructure', !!K.get('solar') && K.category('solar') === 'infrastructure');
const fps = S.generate(7, { streets: ['S'] }).footprints;
ok('control-building footprint exposed', fps.length > 0 && fps.every(f => f.w >= 6 && f.h >= 4));

ok('deterministic per seed', JSON.stringify(S.generate(70, { streets: ['S'] }).g) === JSON.stringify(S.generate(70, { streets: ['S'] }).g));

console.log('SOLAR GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
