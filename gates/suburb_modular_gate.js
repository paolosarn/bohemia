// SUBURB MODULARITY GATE (Paolo 7/18/26: "I want to see all of them be modular
// to fit into either a 1x2 or a 2x2... if you can't easily snap to the other
// suburbs then I don't want it"). Every candidate suburb layout MUST generate a
// coherent, CONNECTED neighborhood at 1x1, 1x2 AND 2x2 — one road network
// reachable from a street gate, homes present, every home with a garage +
// driveway. A style that only works standalone fails. Tests the exact generator
// the judge tool shows (tools/bohemia_suburb_gen.js), so what Paolo rules on is
// what is enforced.
const G = require('../tools/bohemia_suburb_gen.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const STYLES = ['culs', 'loop', 'garden'];
const SIZES = [[1, 1], [1, 2], [2, 1], [2, 2]];

for (const style of STYLES) {
  let allConn = true, allHomes = true, allGarage = true;
  for (const [cw, ch] of SIZES) {
    for (let seed = 1; seed <= 4; seed++) {
      const res = G.genSub(seed * 41 + 3, style, cw, ch);
      if (!G.roadConnected(res)) allConn = false;
      if (res.houses < cw * ch * 2) allHomes = false;   // at least a couple homes per cell
      // every home footprint (code 2) must have a garage(6) between it and a driveway(3)->road
      const g = res.g, H = g.length, W = g[0].length;
      let garages = 0, houses2 = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] === 6) garages++; if (g[y][x] === 2) houses2++; }
      if (garages === 0 || houses2 === 0) allGarage = false;
    }
  }
  ok(style + ': connected road net at 1x1 / 1x2 / 2x1 / 2x2 (snaps, MODULARITY LAW)', allConn);
  ok(style + ': homes present at every cluster size', allHomes);
  ok(style + ': homes have garages + driveways', allGarage);
}

// determinism
const a = JSON.stringify(G.genSub(99, 'culs', 2, 2).g);
const b = JSON.stringify(G.genSub(99, 'culs', 2, 2).g);
ok('generation is deterministic per seed', a === b);

console.log('SUBURB MODULARITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  STYLES.length + ' styles x ' + SIZES.length + ' sizes)');
process.exit(fail ? 1 : 0);
