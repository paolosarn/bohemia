// CITY HALL GATE (7/23/26). A dead municipal seat — a low administrative block with a stopped clock
// tower, a public plaza with a dry reflecting fountain, flagpoles, a civic-seal monument, notice
// kiosks, a small visitor lot. Street-aware + drivable, full dossier + layering. Deliberately
// distinct from courthouse (no sally port, no classical columns/dome).
const D = require('../engine/bohemia_cityhall.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 23 + 11, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // building(2) + tower(6) + plaza(7) dominate; the visitor lot(1) stays small (WALKABLE-LAND).
  if (!(t[2] > 3000 && (t[6] || 0) > 150 && (t[7] || 0) > 2500 && (t[8] || 0) > 150 &&
        t[4] > 3500 && t[1] > 1000 && (t[11] || 0) > 300 && (t[9] || 0) >= 4 &&
        (t[12] || 0) >= 2 && (t[13] || 0) >= 2 && (t[10] || 0) >= 1)) anatomy = false;
  const ls = K.landStats(g, D.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('administrative block + clock tower + plaza + dry fountain + flagpoles + seal + kiosks + small lot', anatomy);
ok('WALKABLE-LAND: block + tower + plaza dominate over the small visitor lot', contentDom);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the lot + entrance drive reach the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('cityhall registered + filed as civic', !!K.get('cityhall') && K.category('cityhall') === 'civic');
ok('building footprint exposed + enterable', D.generate(9, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('building(2) enterable, lot(1) drive, tower(6) structure, fountain(8) water-dead', /interior/i.test(L[2].enter || '') && L[1].kind === 'drive' && K.tileLayer(L[6]).solid === true && L[8].kind === 'water-dead');
ok('deliberately distinct from courthouse: no sally-port/dome/portico tile in the legend', !Object.keys(L).some(c => /sally|portico|dome/i.test(L[c].name)));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('CITY HALL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
