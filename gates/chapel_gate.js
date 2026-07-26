// CHURCH GATE (7/21/26). A dead church — a cruciform building (nave + transepts + apse + narthex), a
// bell tower, a forecourt plaza with an arcade + a cross, a memorial garden. Building-dominant
// (WALKABLE-LAND easily). Research-first.
const D = require('../engine/bohemia_chapel.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy = true, filled = true, streetOk = true, cornerPed = true, drive = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 23 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  if (!(t[2] > 2000 && (t[6] || 0) > 50 && t[7] > 600 && (t[8] || 0) > 30 && (t[11] || 0) > 20 && t[12] > 2000 && t[4] > 1000 && (t[10] || 0) >= 2)) anatomy = false;
  const ls = K.landStats(g, D.legend); if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, D.palette) || K.voidFraction(g) > 0.22) filled = false;
  if (!D.driveConnected(r)) drive = false;
  const eo = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null); const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = eo(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('cruciform church + bell tower + forecourt plaza + arcade + stained glass + cross + memorial garden', anatomy);
ok('WALKABLE-LAND: content dominates (a church IS its building)', contentDom);
ok('every tile named + low void', filled); ok('DRIVABLE: the small lot reaches the curb', drive);
ok('gates on street edges', streetOk); ok('CORNER: pedestrian gate on the side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('chapel registered + civic', !!K.get('chapel') && K.category('chapel') === 'civic');
ok('church enterable + footprints', D.generate(7, { streets: ['S'] }).footprints.length >= 1 && /interior/i.test(D.legend[2].enter || ''));
ok('church(2)+tower(6)+arcade(8) structure/building, plaza(7) ground, drive(1) drive', (D.legend[2].kind === 'building') && D.legend[6].kind === 'structure' && K.tileLayer(D.legend[8]).solid === true && D.legend[7].kind === 'ground' && D.legend[1].kind === 'drive');
ok('deterministic', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('CHURCH GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
