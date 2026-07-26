// FIRE STATION GATE (7/20/26). A dead fire station — apparatus bays opening onto a big concrete
// apron with red engines dead on it, a hose tower, boarded quarters, staff parking, guideline
// stripes to the street pull-out. Street-aware + drivable, full dossier + layering. Research-first
// (real fire-station design standards).
const D = require('../engine/bohemia_firestation.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 17 + 6, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // WALKABLE-LAND rebuild: a BIG station(2) + training yard(13) + drill tower(7) + burn doors +
  // RED engines(8) + wreck cars(10) dominate; the apron(1) is small.
  if (!(t[2] > 2000 && (t[13] || 0) > 800 && (t[7] || 0) > 300 && (t[8] || 0) > 200 && (t[6] || 0) > 40 &&
        t[4] > 2000 && t[1] > 800 && (t[10] || 0) > 100 && (t[11] || 0) > 200 && (t[9] || 0) >= 4 && (t[3] || 0) > 5 && (t[12] || 0) >= 1)) anatomy = false;
  const ls = K.landStats(g, D.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;  // content dominates pavement (the new law, locally)
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('BIG station + training yard + drill tower + burn doors + RED engines + wreck cars + small apron + stripes', anatomy);
ok('WALKABLE-LAND: content dominates pavement (not a tiny building in a sea of apron)', contentDom);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the apron + parking reach the curb (rigs pull straight out) in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('firestation registered + filed as civic', !!K.get('firestation') && K.category('firestation') === 'civic');
ok('station footprint exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('station(2) enterable, apron(1) drive, engine(8) solid vehicle, tower(7) structure', /interior/i.test(L[2].enter || '') && L[1].kind === 'drive' && K.tileLayer(L[8]).solid === true && L[7].kind === 'structure');
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('FIRE STATION GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
