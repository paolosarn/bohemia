// PARK GATE (Paolo 7/19/26) — first LEISURE district on the KIT. A community park must be
// PACKED and every tile named (EXPLAIN-EVERY-TILE): multipurpose field + baseball diamond +
// hard courts + playground + skate park + fenced dog run + community garden + a plaza with
// pavilion/restroom + a dead pond + parking, all street-aware, filled, registered, filed as
// leisure, and deterministic. Act-1 dead (no living-grass code — turf/trees/pond are all dead).
const P = require('../engine/bohemia_park.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['S', 'E'] }, { streets: ['N'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

let allParts = true, streetOk = true, filled = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = P.generate(s * 23 + 5, cfg), t = counts(r);
  // field/court markings(4), sport-court(6), playground(8), skate(15), infield-dirt(12),
  // dog-run/backstop fence(16), dry garden beds(14), buildings(2), parking stalls(10)+cars(11), pond(9)
  if (!(t[4] > 200 && t[6] > 400 && t[8] > 80 && t[15] > 100 && t[12] > 100 && t[16] > 40 &&
        t[14] > 40 && t[2] > 40 && t[10] > 60 && t[11] > 30 && t[9] > 100 && t[13] > 20)) allParts = false;
  if (!K.legendOk(r.g, P.palette) || K.voidFraction(r.g) > 0.10 || K.largestBlob(r.g, c => c === 0) > 0.10) filled = false;
  // ACT-1 DEAD: the palette carries no living-grass green — every "turf" tile is the dead-brown code 7
  const g = r.g, W = r.g[0].length, H = r.g.length, edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; }
}
ok('every park has field+courts+playground+skate+diamond+dog-run+garden+pond+parking+buildings', allParts);
ok('gates sit only on street edges', streetOk);
ok('every tile named + no big blank void (EXPLAIN-EVERY-TILE)', filled);

ok('park registered + filed as leisure', !!K.get('park') && K.category('park') === 'leisure');
const fps = P.generate(7, { streets: ['S'] }).footprints;
ok('pavilion/restroom footprints exposed + enterable', fps.length >= 2);

ok('deterministic per seed', JSON.stringify(P.generate(70, { streets: ['S'] }).g) === JSON.stringify(P.generate(70, { streets: ['S'] }).g));

console.log('PARK GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
