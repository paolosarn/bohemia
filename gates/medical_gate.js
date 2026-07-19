// MEDICAL / HOSPITAL CAMPUS GATE (Paolo 7/18/26) — a CIVIC district on the KIT. A hospital
// campus must have its real anatomy: a big hospital building + ER wing, a SEPARATE ambulance
// canopy, a HELIPAD, a main-entrance canopy, a parking garage, be drive-connected + street-
// aware, registered + filed as civic, and deterministic.
const Me = require('../engine/bohemia_medical.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['S', 'E'] }, { streets: ['S', 'W'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

let allParts = true, allConn = true, streetOk = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = Me.generate(s * 23 + 5, cfg), t = counts(r);
  if (!(t[2] > 800 && t[7] > 40 && t[8] > 400 && t[9] > 10)) allParts = false;   // buildings, canopies, garage, helipad
  if (!Me.driveConnected(r)) allConn = false;
  const g = r.g, W = r.g[0].length, H = r.g.length, edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; }
}
ok('every campus has hospital buildings + canopies + garage + helipad', allParts);
ok('the campus drive connects to the street', allConn);
ok('gates sit only on street edges', streetOk);

// separate emergency vs public entrances: at least 2 entrance canopies worth of area
ok('separate ambulance + main entrance canopies', counts(Me.generate(7, { streets: ['S'] }))[7] > 100);

// enterable buildings + registered + categorized
const fps = Me.generate(7, { streets: ['S'] }).footprints;
ok('hospital footprints exposed, building-sized', fps.length > 0 && fps.every(f => f.w >= 8 && f.h >= 8));
ok('medical registered + filed as civic', !!K.get('medical') && K.category('medical') === 'civic');

// determinism
ok('deterministic per seed', JSON.stringify(Me.generate(55, { streets: ['S'] }).g) === JSON.stringify(Me.generate(55, { streets: ['S'] }).g));

console.log('MEDICAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
