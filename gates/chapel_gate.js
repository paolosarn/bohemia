// CHURCH GATE (7/21/26; REWRITTEN 8/2/26 for the rebuilt district).
//
// The CRUCIFORM plan was always right and it stays: nave, transepts, apse, narthex, bell tower.
// What was wrong was everything around it, and both faults are findings Paolo made elsewhere:
//   THE GREEN. "memorial garden" and "dead landscaping" were lawn-green across a fifth of the
//     plot, in a valley that stopped watering things a decade before act one opens. A Mojave
//     churchyard is not a lawn; it is a walled MEMORIAL COURT of decomposed granite with a
//     COLUMBARIUM of niches, because in this ground you do not dig graves, you build a wall.
//   THE MONOBLOCK. 33.9% of the plot was one code called "sidewalk". A walk is the APRON that
//     hugs a building, so it is now computed from the building instead of guessed at, and the
//     ground it used to cover is a DEAD ORCHARD -- because renaming emptiness never fixes it,
//     putting something there does.
const D = require('../engine/bohemia_chapel.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy = true, filled = true, streetOk = true, cornerPed = true, drive = true, contentDom = true,
    oneBuilding = true, noGreen = true, monoblock = false;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 23 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
    /* THE PROGRAMME: the cruciform church (2) under its ridge (22) and roof edge (16) with the
     stained glass (11) and the bell tower (6); the walk apron (12); the memorial courts (4)
     inside their columbarium walls (13) with the niche plaques (17); the dead orchard in its
     beds (23); the forecourt (7) with the arcade (8), the cross and fallen bell (10), the dry
     font (21) and its lights (9); the covered walk (15); the lot (1) with ticks (20) and the
     cars nobody came back for (19); the gravel margin (14). */
  if (!(t[2] > 1300 && (t[22] || 0) > 150 && (t[16] || 0) > 300 && (t[11] || 0) > 20 &&
        (t[6] || 0) > 60 && (t[12] || 0) > 800 && (t[4] || 0) > 1500 && (t[13] || 0) > 200 &&
        (t[17] || 0) > 30 && (t[23] || 0) > 400 && (t[7] || 0) > 800 && (t[8] || 0) > 30 &&
        (t[10] || 0) >= 6 && (t[21] || 0) > 6 && (t[9] || 0) >= 4 && (t[15] || 0) > 50 &&
        (t[1] || 0) > 400 && (t[20] || 0) > 120 && (t[19] || 0) > 10 &&
        (t[14] || 0) > 1000)) anatomy = false;
  /* ONE BUILDING (8/2): the tower shares a wall with the narthex, the parish hall with the
     east transept. The columbarium is a FENCE, not a second church. */
  if (r.footprints.length !== 1) oneBuilding = false;
  /* DEAD THINGS ARE NOT GREEN: read the NAME, then read the swatch. */
  for (const code of Object.keys(D.legend)) {
    const e = D.legend[code]; if (K.tileLayer(e).layer !== 'ground') continue;
    if (/tree|plant|shrub/i.test(e.name)) continue;
    const h = D.palette[code]; if (!h) continue;
    const R = parseInt(h.slice(1,3),16), G2 = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
    if (G2 > R + 6 && G2 > B + 6) noGreen = false;
  }
  /* NO MONOBLOCK: no single code owns 30% of the plot (7/31, EVERY PIXEL ANSWERED FOR). */
  {
    let mx = 0; for (const c of Object.keys(t)) if (t[c] > mx) mx = t[c];
    if (mx / (W * H) >= 0.30) monoblock = true;
  }
  const ls = K.landStats(g, D.legend); if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, D.palette) || K.voidFraction(g) > 0.22) filled = false;
  if (!D.driveConnected(r)) drive = false;
  const eo = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null); const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = eo(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE PROGRAMME: the cruciform church under its ridge with the stained glass and the bell ' +
   'tower, the walk apron, the walled MEMORIAL COURTS with their columbarium niches, the dead ' +
   'ORCHARD in its beds, the forecourt with the arcade, the fallen bell and the dry font, the ' +
   'covered walk, and the lot', anatomy);
ok('ONE BUILDING (8/2, ARTICULATION IS NOT FRAGMENTATION): the bell tower shares a wall with ' +
   'the narthex and the parish hall with the east transept — one footprint. The columbarium ' +
   'is a FENCE, not a second church', oneBuilding);
ok('NOTHING IS GREEN. The "memorial garden" and "dead landscaping" here were lawn-green over a ' +
   'fifth of the plot; a Mojave churchyard is decomposed granite and a niche wall', noGreen);
ok('NO MONOBLOCK: no single code owns 30% of the plot. "Sidewalk" used to own 33.9% of it, and ' +
   'renaming that to "gravel" would have been the same bug wearing a different name', !monoblock);
ok('THE COVERED WALK IS OVERHEAD — you pass UNDER it, so it never severs the route from the ' +
   'lot to the doors (RULE NUMBER ONE, 7/31)', K.tileLayer(D.legend[15]).layer === 'overhead');
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
