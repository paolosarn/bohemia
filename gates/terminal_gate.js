// TRANSIT TERMINAL GATE (7/23/26). A dead passenger transit terminal — a waiting-hall building with
// a stopped schedule-board clock, bus bays under a boarding canopy with a raised platform, a layover
// yard, a kiss-and-ride loop, a park-and-ride lot. Street-aware + drivable (all car surfaces are one
// connected network), full dossier + layering. Infrastructure PASSENGER transport, distinct from the
// freight-only railyard.
const D = require('../engine/bohemia_terminal.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const MARGIN = 22; // matches the WALKABLE-LAND gate: a terminal is paved-heavy but the fleet+building anchor it
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, walkable = true, oneNetwork = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 37 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // terminal building(2) + canopy(6) + platform(7) + dead buses(10) + bay markings + clock(12) + benches.
  if (!(t[2] > 1800 && (t[6] || 0) > 300 && (t[7] || 0) > 250 && (t[10] || 0) > 800 &&
        (t[11] || 0) > 20 && (t[8] || 0) >= 6 && (t[9] || 0) >= 6 && (t[12] || 0) >= 1 &&
        (t[13] || 0) >= 2 && t[1] > 3000 && t[4] > 3000)) anatomy = false;
  const ls = K.landStats(g, D.legend);
  if (!(ls.drivePct <= ls.contentPct + MARGIN)) walkable = false;
  if (K.driveReachFromStreet(g, 1) < 0.999) oneNetwork = false;  // one connected car surface: buses+cars reach every bay/lot
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('terminal building + boarding canopy + platform + dead bus fleet + bays + schedule clock + benches', anatomy);
ok('WALKABLE-LAND: drive does not dominate content by more than the +22 margin (fleet+building anchor the paved surface)', walkable);
ok('ONE connected car surface: bays, layover, loop, and lot all reach the curb (driveReachFromStreet)', oneNetwork);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the drive network reaches the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('terminal registered + filed as infrastructure', !!K.get('terminal') && K.category('terminal') === 'infrastructure');
ok('terminal-building footprint exposed + enterable', D.generate(5, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('terminal(2) enterable, drive(1) drive, canopy(6) overhead (pass under), bus(10) solid vehicle, clock(12) structure', /interior/i.test(L[2].enter || '') && L[1].kind === 'drive' && L[6].kind === 'overhead' && K.tileLayer(L[10]).solid === true && L[12].kind === 'structure');
ok('distinct from railyard: PASSENGER vocabulary (platform/bay/terminal), not freight', /platform/i.test(JSON.stringify(L)) && /terminal/i.test(JSON.stringify(L)));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('TERMINAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
