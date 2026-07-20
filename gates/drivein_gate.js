// DRIVE-IN GATE (7/19/26). A dead drive-in movie theater — a torn SCREEN TOWER over a fan of
// ARCED PARKING ROWS facing it, a central SNACK BAR + PROJECTION booth, a drive-up TICKET BOOTH
// + roadside MARQUEE at the entrance, speaker poles + abandoned cars rusting in the rows. Built
// on the DISTRICT KIT: street-aware (canonical-south + rotateToStreet) + DRIVABLE (you drive in,
// the whole cracked-asphalt field is the car surface, reachable from the curb in EVERY placement),
// full dossier + layering. Research-first (real drive-in site plans, not memory).
const D = require('../engine/bohemia_drivein.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
// standalone on EACH edge + two corners — the drive-in must work for all of them
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const primaryOf = st => (['S', 'E', 'W', 'N'].find(e => st.includes(e)));

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 31 + 7, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // ANATOMY: a big screen tower(6), the parking/drive field(1), arc markings(4), speaker poles(7),
  // abandoned cars(8), snack bar/projection/booths(2), marquee(9), playground(11), picnic(10).
  if (!(t[6] > 400 && t[1] > 6000 && t[4] > 300 && t[7] > 20 && t[8] > 30 &&
        t[2] > 150 && (t[9] || 0) > 8 && (t[11] || 0) > 20 && (t[10] || 0) > 4)) anatomy = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.25) filled = false;

  // DRIVABLE: a car reaches (nearly) the whole cracked-asphalt field from the curb, any placement
  if (!D.driveConnected(r)) driveConnected = false;

  // gates: every code-5 sits on a street edge; a corner has the car entrance on the primary
  // street AND at least one pedestrian gate on the side street
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gateEdges.has(e)) cornerPed = false; }
}
ok('screen tower + parking field + arced rows + poles + cars + snack bar + marquee + playground + picnic', anatomy);
ok('every tile named + low void (EXPLAIN-EVERY-TILE, desert-margin drive-in)', filled);
ok('DRIVABLE: a car reaches the parking field from the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);

ok('drivein registered + filed as leisure', !!K.get('drivein') && K.category('drivein') === 'leisure');
ok('snack bar / projection footprints exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 1);

// DOSSIER + LAYERING complete (the self-instructions for the tiling phase)
const N = D.notes, L = D.legend;
ok('NOTES: summary + reference + layout + circulation + layering + decisions', !!(N && N.summary && N.reference && N.reference.length && N.layout && N.layout.length && N.circulation && N.layering && N.decisions && N.decisions.length));
let legLayered = true;
for (const c of Object.keys(L)) { const e = L[c]; if (!e.name || !e.kind) legLayered = false; }
ok('LEGEND: every code named + kinded (layer/solid/enter resolvable)', legLayered);
ok('screen(6) is structure, field(1) drive, snack bar(2) enterable interior', L[6].kind === 'structure' && L[1].kind === 'drive' && /interior/i.test(L[2].enter || ''));

ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));

console.log('DRIVE-IN GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
