// STADIUM GATE (7/20/26). A dead sports stadium — a tiered seating BOWL ringing a cracked FIELD,
// a CONCOURSE loop under the stands, the FACADE + entry GATES, huge PARKING aprons, corner LIGHT
// TOWERS + a dead SCOREBOARD. Built on the DISTRICT KIT: street-aware (canonical-south +
// rotateToStreet) + DRIVABLE (the parking apron is the car surface, reachable from the curb in
// EVERY placement), full dossier + layering. Research-first (real stadium bowl + site-plan logic).
const D = require('../engine/bohemia_stadium.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, noPurple = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 41 + 9, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // ANATOMY: seating bowl(6) + field(4) + concourse/aisles(7) + facade(2) + markings(8) +
  // scoreboard(9) + light towers(12) + parking(1) + abandoned cars(11) + rubble(3).
  if (!(t[6] > 1500 && t[4] > 1200 && t[7] > 600 && t[2] > 300 && t[8] > 40 &&
        (t[9] || 0) > 20 && (t[12] || 0) >= 8 && t[1] > 3000 && (t[11] || 0) > 8 && (t[3] || 0) > 30)) anatomy = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.22) filled = false;

  // DRIVABLE: a car reaches the parking apron from the curb, any placement
  if (!D.driveConnected(r)) driveConnected = false;

  // gates on street edges; corner gets car entrance on primary + a pedestrian gate on the side
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gateEdges.has(e)) cornerPed = false; }
}
// PURPLE RESERVATION: no palette swatch may read purple (purple = the Amalgamation alone).
// hue in ~[255,315) with real saturation/value = purple.
for (const c of Object.keys(D.palette)) {
  const hex = D.palette[c]; const R = parseInt(hex.slice(1, 3), 16) / 255, G = parseInt(hex.slice(3, 5), 16) / 255, B = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  if (d > 0.06 && mx > 0.12) { let h = 0;
    if (mx === R) h = 60 * (((G - B) / d) % 6); else if (mx === G) h = 60 * ((B - R) / d + 2); else h = 60 * ((R - G) / d + 4);
    if (h < 0) h += 360; if (h >= 255 && h < 320) noPurple = false; }
}
ok('seating bowl + field + concourse + facade + markings + scoreboard + light towers + parking + cars + rubble', anatomy);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: a car reaches the parking apron from the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple (Amalgamation only)', noPurple);

ok('stadium registered + filed as leisure', !!K.get('stadium') && K.category('stadium') === 'leisure');
ok('facade footprint exposed + enterable (concourse interior)', D.generate(7, { streets: ['S'] }).footprints.length >= 1);

const N = D.notes, L = D.legend;
ok('NOTES: summary + reference + layout + circulation + layering + decisions', !!(N && N.summary && N.reference && N.reference.length && N.layout && N.layout.length && N.circulation && N.layering && N.decisions && N.decisions.length));
let legLayered = true;
for (const c of Object.keys(L)) { const e = L[c]; if (!e.name || !e.kind) legLayered = false; }
ok('LEGEND: every code named + kinded (layer/solid/enter resolvable)', legLayered);
ok('facade(2) enterable interior, stands(6) structure, field(4) ground, parking(1) drive', /interior/i.test(L[2].enter || '') && L[6].kind === 'structure' && L[4].kind === 'ground' && L[1].kind === 'drive');

ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));

console.log('STADIUM GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
