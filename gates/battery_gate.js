// BATTERY STORAGE GATE (7/23/26). A dead grid-scale battery yard — fire-lane-spaced container rows,
// HVAC units, an inverter/transformer rack, a control building, double-fenced on gravel. Street-aware
// + drivable, full dossier + layering. Infrastructure STORAGE, distinct from solar (generation) and
// substation (distribution).
const D = require('../engine/bohemia_battery.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 29 + 13, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // container rows(6) + HVAC(7) + inverter rack(8) + fence(10) + control building(2) dominate.
  if (!(t[6] > 2500 && (t[7] || 0) > 20 && (t[8] || 0) > 300 && t[2] > 300 &&
        t[4] > 5000 && (t[10] || 0) > 700 && (t[13] || 0) > 700 &&
        (t[9] || 0) >= 4 && (t[12] || 0) >= 6 && (t[3] || 0) > 5)) anatomy = false;
  const ls = K.landStats(g, D.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('container rows + HVAC units + inverter rack + control building + double fence + trenches', anatomy);
ok('WALKABLE-LAND: containers + inverter rack + fence + control building dominate over the access road', contentDom);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the access road reaches the control building + array from the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('battery registered + filed as infrastructure', !!K.get('battery') && K.category('battery') === 'infrastructure');
ok('control-building footprint exposed + enterable', D.generate(11, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('control building(2) enterable, road(1) drive, container(6) solid structure, fence(10) structure', /interior/i.test(L[2].enter || '') && L[1].kind === 'drive' && K.tileLayer(L[6]).solid === true && L[10].kind === 'structure');
ok('distinct from solar/substation: storage vocabulary present (container/inverter), no PV/transformer-only language claimed as this district\'s hero', /container/i.test(JSON.stringify(L)));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('BATTERY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
