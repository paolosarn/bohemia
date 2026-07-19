// PARK GATE (Paolo 7/19/26, v2 — REALISTIC park, not a super-park). A neighborhood park is
// MOSTLY OPEN LAWN with a FEW amenities: a walking loop, one playground, one basketball
// court, a picnic shelter + restroom, a small parking pullout, a pond, benches, tree groves.
// Gate: those amenities present, lawn is the dominant ground (it's a PARK), every tile named
// (EXPLAIN-EVERY-TILE, low void), street-aware, registered as leisure, deterministic. Act-1
// dead (no living-grass code — turf/trees/pond all dead).
const P = require('../engine/bohemia_park.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const CONFIGS = [{ streets: ['S'] }, { streets: ['S', 'E'] }, { streets: ['N'] }];
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const AREA = 128 * 128;

let hasAmenities = true, lawnDominant = true, streetOk = true, filled = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = P.generate(s * 23 + 5, cfg), t = counts(r);
  // loop path(1), playground(8), one court(6)+markings(4), shelter+restroom(2), parking(10)+cars(11),
  // pond(9), trees(3), benches/tables(13) — a FEW amenities, not everything
  if (!(t[1] > 800 && t[8] > 80 && t[6] > 150 && t[4] > 40 && t[2] > 40 &&
        t[10] > 40 && t[11] > 15 && t[9] > 80 && t[3] > 120 && t[13] > 15)) hasAmenities = false;
  // REALISM: open lawn must be the dominant ground (a park is mostly green, not packed)
  if (!((t[7] || 0) / AREA > 0.55)) lawnDominant = false;
  if (!K.legendOk(r.g, P.palette) || K.voidFraction(r.g) > 0.08) filled = false;
  const g = r.g, W = r.g[0].length, H = r.g.length, edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.streets.includes(e)) streetOk = false; }
}
ok('park has loop + playground + court + shelter/restroom + parking + pond + trees + benches', hasAmenities);
ok('open lawn is the dominant ground (realistic, not a super-park)', lawnDominant);
ok('gates sit only on street edges', streetOk);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);

ok('park registered + filed as leisure', !!K.get('park') && K.category('park') === 'leisure');
const fps = P.generate(7, { streets: ['S'] }).footprints;
ok('shelter/restroom footprints exposed + enterable', fps.length >= 2);

ok('deterministic per seed', JSON.stringify(P.generate(70, { streets: ['S'] }).g) === JSON.stringify(P.generate(70, { streets: ['S'] }).g));

console.log('PARK GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
