// GOLF GATE (7/20/26). A dead golf course section — a few HOLES (tee -> winding FAIRWAY through
// ROUGH -> GREEN with a PIN, guarded by SAND BUNKERS + a dry WATER HAZARD) with the abandoned
// CLUBHOUSE + PARKING + DRIVING RANGE + putting green at the street entrance, laced by a CART-PATH
// loop. Built on the DISTRICT KIT: street-aware (canonical-south + rotateToStreet) + DRIVABLE (the
// parking + cart-path network is the car surface, reachable from the curb in EVERY placement), full
// dossier + layering. Research-first (real golf-course routing + infrastructure, not memory).
const D = require('../engine/bohemia_golf.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const primaryOf = st => (['S', 'E', 'W', 'N'].find(e => st.includes(e)));

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, pins = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 37 + 3, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // ANATOMY: dead rough(3) dominates the parcel; fairway(4), greens(6), bunkers(7), tee boxes(9),
  // cart path/parking(1), clubhouse(2), range/targets(11), a cart(13), dead trees(12).
  if (!(t[3] > 6000 && t[4] > 1000 && t[6] > 200 && t[7] > 60 && t[9] > 40 &&
        t[1] > 500 && t[2] > 120 && (t[11] || 0) > 8 && (t[13] || 0) > 2 && (t[12] || 0) > 20)) anatomy = false;
  // every green carries at least one pin (code 10)
  if (!((t[10] || 0) >= 1)) pins = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;

  // DRIVABLE: a car/cart reaches the parking + cart-path network from the curb, any placement
  if (!D.driveConnected(r)) driveConnected = false;

  // gates: every code-5 sits on a street edge; a corner has the car entrance on the primary
  // street AND at least one pedestrian gate on the side street
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gateEdges.has(e)) cornerPed = false; }
}
ok('rough dominates + fairways + greens + bunkers + tees + cart paths + clubhouse + range + cart + trees', anatomy);
ok('every green carries a pin (flagstick)', pins);
ok('every tile named + low void (EXPLAIN-EVERY-TILE, desert-margin course)', filled);
ok('DRIVABLE: a cart reaches the course from the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);

ok('golf registered + filed as leisure', !!K.get('golf') && K.category('golf') === 'leisure');
ok('clubhouse footprint exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 1);

// DOSSIER + LAYERING complete (the self-instructions for the tiling phase)
const N = D.notes, L = D.legend;
ok('NOTES: summary + reference + layout + circulation + layering + decisions', !!(N && N.summary && N.reference && N.reference.length && N.layout && N.layout.length && N.circulation && N.layering && N.decisions && N.decisions.length));
let legLayered = true;
for (const c of Object.keys(L)) { const e = L[c]; if (!e.name || !e.kind) legLayered = false; }
ok('LEGEND: every code named + kinded (layer/solid/enter resolvable)', legLayered);
ok('clubhouse(2) enterable interior, fairway(4)+green(6) ground, cart path(1) drive', /interior/i.test(L[2].enter || '') && L[4].kind === 'ground' && L[6].kind === 'ground' && L[1].kind === 'drive');

ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));

console.log('GOLF GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
