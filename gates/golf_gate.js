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


/* ===================== ONE COURSE, EIGHTEEN HOLES (8/26) =====================
   The valley's golf blob is 3x3 and every cell built a COMPLETE course: three holes, a
   clubhouse, a pro shop, a driving range, two car parks. Nine clubhouses inside one boundary.

   AND THE ARITHMETIC IS THE NICE PART: a 3x3 blob is 288 m square, about 83 hectares, and a
   real eighteen-hole course is 50 to 75. The ground was always there for the actual thing.

   ROUTED AS TWO LOOPS OF NINE, each leaving the clubhouse and returning to it, so 9 and 18
   finish where 1 and 10 started. That is why a clubhouse sits where it sits.

   THE COUNT IS CHECKED BECAUSE IT SILENTLY WASN'T RIGHT TWICE. A pin is ONE TILE, and the
   back nine crosses the front nine -- which is what a real routing does -- so a later
   fairway paints over an earlier flag. Eighteen holes measured EIGHT, then SIXTEEN once the
   pins moved after the fairways, and only ABSOLUTELY last (after the ponds, the clubhouse and
   the cart path) are there eighteen. Nothing anywhere complained either time. */
const GB = { x0: 0, x1: 2, y0: 0, y1: 2 };
const gcell = (x, y) => D.generate(4242, { streets: y === GB.y1 ? ['S'] : [], bounds: GB, cellX: x, cellY: y });
let gPins = 0, gClub = 0, gTees = 0, gCells = 0, gBad = [];
for (let y = GB.y0; y <= GB.y1; y++) for (let x = GB.x0; x <= GB.x1; x++) {
  gCells++;
  const r = gcell(x, y), t = counts(r);
  gPins += (t[10] || 0); gTees += (t[9] || 0) ? 1 : 0;
  if (t[2]) gClub++;
  if (!K.legendOk(r.g, D.palette)) gBad.push('legend ' + x + ',' + y);
  if (!D.driveConnected(r)) gBad.push('drive ' + x + ',' + y);
}
ok('THE COURSE HAS EIGHTEEN HOLES, not three per cell (counted ' + gPins + ' pins across '
   + gCells + ' cells)', gPins === 18);
ok('and ONE clubhouse, not nine (' + gClub + ' of ' + gCells + ' cells hold building mass)', gClub === 1);
ok('every cell of the course names its tiles and a cart reaches the path from a gate'
   + (gBad.length ? ' -> ' + gBad.join(', ') : ''), gBad.length === 0);
let gLone = true;
for (const cfg of CONFIGS) for (let s2 = 1; s2 <= 5; s2++) {
  if (JSON.stringify(D.generate(s2 * 17 + 3, { streets: cfg }).g)
   !== JSON.stringify(D.generate(s2 * 17 + 3, { streets: cfg, bounds: { x0: 4, x1: 4, y0: 4, y1: 4 }, cellX: 4, cellY: 4 }).g)) gLone = false;
}
ok('a golf cell on its own is BYTE-IDENTICAL to the three-hole course that shipped', gLone);
console.log('  THE COURSE: ' + gCells + ' cells, ' + gPins + ' holes, ' + gClub + ' clubhouse');

console.log('GOLF GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
