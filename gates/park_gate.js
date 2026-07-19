// PARK GATE (Paolo 7/19/26, v4 — REALISTIC + DRIVABLE). A neighborhood park is mostly open
// lawn with a few amenities on a winding trail; AND it has a real DRIVABLE network — an
// asphalt driveway (12) from the street curb into the parking lot, whose aisles let a car
// reach every stall, working whether the cell is a STANDALONE grid (1 street) or a CORNER
// (2 streets: one car entrance + a pedestrian gate on the side street).
const P = require('../engine/bohemia_park.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const AREA = 128 * 128;
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
// standalone on EACH edge + two corners — the drive must work for all of them
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const primaryOf = st => (['S', 'E', 'W', 'N'].find(e => st.includes(e)));
const driveTouches = g => { const H = g.length, W = g[0].length;
  for (let x = 0; x < W; x++) { if (g[1][x] === 12) return 'N'; if (g[H - 2][x] === 12) return 'S'; }
  for (let y = 0; y < H; y++) { if (g[y][1] === 12) return 'W'; if (g[y][W - 2] === 12) return 'E'; } return null; };
const orphanStalls = g => { const H = g.length, W = g[0].length; let bad = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 10) continue;
    if (!((g[y + 1] && g[y + 1][x] === 12) || (g[y - 1] && g[y - 1][x] === 12) || g[y][x + 1] === 12 || g[y][x - 1] === 12)) bad++; } return bad; };

let hasAmenities = true, lawnDominant = true, filled = true, streetOk = true;
let driveConnected = true, driveOnStreet = true, stallsReachable = true, cornerPed = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = P.generate(s * 23 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // amenities: trail(1), playground(8), court(6)+marks(4), shelter+restroom(2), stalls(10)+cars(11),
  // drive(12), pond(9), trees(3), benches(13) — a FEW, not everything
  if (!(t[1] > 700 && t[8] > 80 && t[6] > 150 && t[4] > 40 && t[2] > 40 && t[10] > 40 &&
        t[11] > 15 && t[12] > 200 && t[9] > 80 && t[3] > 120 && t[13] > 15)) hasAmenities = false;
  if (!((t[7] || 0) / AREA > 0.55)) lawnDominant = false;                         // REALISM: lawn dominates
  if (!K.legendOk(r.g, P.palette) || K.voidFraction(r.g) > 0.08) filled = false;

  // DRIVABLE: the asphalt network is one connected blob, it touches the PRIMARY street, and
  // every parking stall is reachable by a car (adjacent to a drive aisle)
  if (K.connectedFrom(g, c => c === 12, c => c === 12) < 0.999) driveConnected = false;
  if (driveTouches(g) !== primaryOf(cfg)) driveOnStreet = false;
  if (orphanStalls(g) !== 0) stallsReachable = false;

  // gates: every code-5 sits on a street edge; a corner has the car entrance on the primary
  // street AND at least one pedestrian gate on the side street
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gateEdges.has(e)) cornerPed = false; }
}
ok('park has trail + playground + court + shelter/restroom + parking + pond + trees + benches', hasAmenities);
ok('open lawn is the dominant ground (realistic, not a super-park)', lawnDominant);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('gates sit only on street edges', streetOk);
ok('DRIVABLE: the asphalt drive network is one connected blob', driveConnected);
ok('DRIVABLE: the driveway reaches the primary street (curb cut)', driveOnStreet);
ok('DRIVABLE: every parking stall is reachable by car (adjacent to a drive aisle)', stallsReachable);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);

ok('park registered + filed as leisure', !!K.get('park') && K.category('park') === 'leisure');
ok('shelter/restroom footprints exposed + enterable', P.generate(7, { streets: ['S'] }).footprints.length >= 2);
ok('deterministic per seed', JSON.stringify(P.generate(70, { streets: ['S'] }).g) === JSON.stringify(P.generate(70, { streets: ['S'] }).g));

console.log('PARK GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
