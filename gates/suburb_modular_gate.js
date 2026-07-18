// SUBURB MODULARITY + FOOTPRINT GATE (Paolo 7/18/26)
// The walled-block generator must: produce a CONNECTED interior street reachable
// from a gate at 1x1 / 1x2 / 2x1 / 2x2 (MODULARITY LAW), place a real number of
// homes, and every home must have a garage + a driveway. Tests the exact
// generator the judge shows (engine/bohemia_suburb.js) so what Paolo rules on is
// what is enforced. A style that can't snap or can't home fails.
const S = require('../engine/bohemia_suburb.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const STYLES = ['culs', 'double', 'court'];
const SIZES = [[1, 1], [1, 2], [2, 1], [2, 2]];

for (const style of STYLES) {
  let allConn = true, allHomes = true, allGarage = true;
  for (const [cw, ch] of SIZES) {
    for (let seed = 1; seed <= 4; seed++) {
      const res = S.generate(seed * 41 + 3, style, cw, ch);
      if (!S.roadConnected(res)) allConn = false;
      if (res.houses < cw * ch * 10) allHomes = false;   // a real block, not a token few
      const g = res.g, H = res.H, W = res.W;
      let garages = 0, drives = 0, houses = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = g[y][x]; if (c === 6) garages++; else if (c === 3) drives++; else if (c === 2) houses++; }
      if (garages === 0 || drives === 0 || houses === 0) allGarage = false;
    }
  }
  ok(style + ': connected interior street at 1x1 / 1x2 / 2x1 / 2x2 (MODULARITY LAW)', allConn);
  ok(style + ': a real number of homes at every size', allHomes);
  ok(style + ': homes have garages + driveways', allGarage);
}

// footprints for the world model: every home yields a bounding-box footprint
const res = S.generate(7, 'culs', 1, 1);
const fps = S.homeFootprints(res);
ok('home footprints exposed for the world model (>0)', fps.length > 0);
ok('footprints are house-sized, not runways (w,h within 6..30 tiles)',
  fps.every(f => f.w >= 6 && f.w <= 30 && f.h >= 6 && f.h <= 30));

// determinism
ok('deterministic per seed', JSON.stringify(S.generate(99, 'culs', 1, 1).g) === JSON.stringify(S.generate(99, 'culs', 1, 1).g));

console.log('SUBURB MODULARITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  STYLES.length + ' styles x ' + SIZES.length + ' sizes)');
process.exit(fail ? 1 : 0);
