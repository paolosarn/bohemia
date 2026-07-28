// SCHOOL GATE (7/20/26). A dead K-12 school — an E-shaped building + gym on dead lawn, a sports
// field ringed by a running track, tennis courts, and SEPARATE bus-loop / student parking
// (7/28: Paolo ruled the district a HIGH SCHOOL, so the playground assertion is gone)
// / staff-parking drives. Street-aware + drivable (the paved network reaches the curb), full dossier
// + layering. Research-first (real school campus site plans).
const D = require('../engine/bohemia_school.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 13 + 4, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  /* PAOLO RULED IT A HIGH SCHOOL (7/28), answering his own bulk-verdict note that the
     district had to say which. This gate used to REQUIRE a PLAYGROUND (code 9) — an
     elementary-school object — because it was written for the old generic K-12. His
     ruling supersedes the gate, so the gate moves to the ruling rather than the district
     being bent back to satisfy a stale assertion. Code 9 is now BLEACHERS.
     THE HIGH-SCHOOL PROGRAMME, asserted: the academic building(2) + gymnasium(14) +
     portables(15); the STADIUM — field(6) inside a running track(7) with raked
     bleachers(9) and light towers(12); tennis courts(8); the marquee(16); and the STUDENT
     LOT, which is the clearest tell of all — high schoolers drive — with the cars(17)
     still in it. */
  if (!(t[2] > 2200 && (t[14] || 0) > 600 && (t[15] || 0) > 200 && t[11] > 300 &&
        t[6] > 600 && t[7] > 400 && (t[9] || 0) > 100 && t[8] > 400 &&
        (t[10] || 0) > 100 && t[4] > 2500 && t[1] > 400 && (t[12] || 0) >= 4 &&
        (t[16] || 0) > 10 && (t[17] || 0) > 20)) anatomy = false;
  // NO PLAYGROUND. It is an elementary-school object and this district is explicitly a
  // high school; its presence would be a regression, so the gate holds it at zero.
  if ((t[9] || 0) > 0 && D.legend[9] && /playground/i.test(D.legend[9].name)) anatomy = false;
  const ls = K.landStats(g, D.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE HIGH-SCHOOL PROGRAMME: academic building + gym + portables + the STADIUM ' +
   '(field inside a track, raked bleachers, four light towers) + tennis courts + marquee ' +
   '+ the student lot with the cars still in it, and NO playground', anatomy);
ok('WALKABLE-LAND: content dominates pavement (a finished campus, not a sparse lot)', contentDom);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: bus loop + drop-off + parking reach the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('school registered + filed as civic', !!K.get('school') && K.category('school') === 'civic');
ok('school/gym footprints exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('building(2) enterable, field(6)+track(7)+lawn(4) ground, pavement(1) drive', /interior/i.test(L[2].enter || '') && L[6].kind === 'ground' && L[7].kind === 'ground' && L[4].kind === 'ground' && L[1].kind === 'drive');
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('SCHOOL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
