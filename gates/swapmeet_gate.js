// SWAP MEET GATE (7/20/26). A dead swap meet / flea market — rows of torn color-coded canopy stalls
// on packed-dirt aisles, a market hall, a gravel parking lot, junk through the booths. The barter-
// economy stage. Street-aware + drivable (you park then walk), full dossier + layering (tents are
// the OVERHEAD layer). Research-first (real swap-meet site layouts).
const D = require('../engine/bohemia_swapmeet.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 19 + 8, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  const canopy = (t[4] || 0) + (t[13] || 0) + (t[14] || 0);
  if (!(t[7] > 4000 && t[1] > 2000 && t[2] > 150 && canopy > 2000 && (t[6] || 0) > 150 &&
        (t[8] || 0) > 20 && (t[9] || 0) >= 4 && (t[10] || 0) > 20 && (t[11] || 0) > 40 && (t[3] || 0) > 10 && (t[12] || 0) > 20)) anatomy = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('aisles + parking + market hall + canopy rows + vendor tables + pylon + lights + car + markings + junk + kiosk', anatomy);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the gravel parking reaches the curb (park then walk) in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('swapmeet registered + filed as commercial', !!K.get('swapmeet') && K.category('swapmeet') === 'commercial');
ok('market-hall footprint exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('tents(4/13/14) OVERHEAD pass-under, aisle(7) walk-ground, parking(1) drive, hall(2) enterable', K.tileLayer(L[4]).layer === 'overhead' && K.tileLayer(L[4]).solid === false && K.tileLayer(L[13]).layer === 'overhead' && K.tileLayer(L[14]).layer === 'overhead' && L[7].kind === 'ground' && L[1].kind === 'drive' && /interior/i.test(L[2].enter || ''));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('SWAP MEET GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
