// CITY HALL GATE (7/23/26; REWRITTEN 8/2/26 for the rebuilt district).
//
// The district it used to guard was a low block with a CLOCK TOWER and 28% dead green LAWN.
// A clock tower is a New England town hall and the lawn was greenwash in a valley that has
// not watered anything in a decade, so both are gone and this gate is rewritten to what
// replaced them: LAS VEGAS CITY HALL (Elkus Manfredi, 2012) — the curvilinear council
// chamber merged into the angular glass office block, a canopy on a SINGLE column, and the
// SOLAR TREE FARM of thirty-three masts in the plaza.
//
// THE 33 IS THE POINT AND IT IS CHECKED EXACTLY. Elkus Manfredi built 33 solar trees. A
// number taken from the real building is a fact the machine can hold; a number invented on
// the day is decoration, and the 8/2 library post-mortem is what happens when a gate asserts
// a count nobody ever ruled.
const D = require('../engine/bohemia_cityhall.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, contentDom = true,
    trees33 = true, oneBuilding = true, noGreen = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 23 + 11, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  /* THE PROGRAMME: the building (2) with its curtain wall (11), chamber roof (17), roof
     joints (23) and rooftop plant (25); the plaza (7) under the solar panels (6) on their
     masts (10); the entry canopy (14) on its single mast (15); the dry basins (8), the
     flagpoles (12), the plaza lights (9); the podium (13); and the parking deck — its
     floor (24), its columns (20) and its spandrel rail (22) — beside the surface lot (1). */
  if (!(t[2] > 1800 && (t[11] || 0) > 400 && (t[17] || 0) > 150 && (t[23] || 0) > 200 &&
        (t[25] || 0) > 100 && (t[7] || 0) > 1200 && (t[6] || 0) > 400 && (t[15] || 0) > 100 && (t[8] || 0) > 60 && (t[12] || 0) >= 2 && (t[9] || 0) >= 4 &&
        (t[13] || 0) > 1000 && (t[24] || 0) > 300 && (t[20] || 0) > 20 && (t[22] || 0) > 20 &&
        (t[1] || 0) > 800 && (t[21] || 0) > 100 && (t[19] || 0) > 20)) anatomy = false;
  /* EXACTLY 33 SOLAR TREES, in every placement and at every seed. */
  if (r.solarTrees !== 33) trees33 = false;
  /* ONE BUILDING (8/2): chamber, block and north wing share walls. */
  if (r.footprints.length !== 1) oneBuilding = false;
  /* DEAD THINGS ARE NOT GREEN: read the NAME, then read the swatch. */
  for (const code of Object.keys(D.legend)) {
    const e = D.legend[code]; if (K.tileLayer(e).layer !== 'ground') continue;
    if (/tree|plant|shrub/i.test(e.name)) continue;                       // a dead stick may keep a hint
    const h = D.palette[code]; if (!h) continue;
    const R = parseInt(h.slice(1,3),16), G2 = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
    if (G2 > R + 6 && G2 > B + 6) noGreen = false;
  }
  const ls = K.landStats(g, D.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE PROGRAMME: the merged block + council chamber under its own roof, the plaza with its ' +
   'dry basins and flag row, the ENTRANCE STEPS and their piers, the parking deck with columns and ' +
   'rail, the surface lot with ticks and the cars nobody came back for', anatomy);
ok('EXACTLY 33 SOLAR TREES — Elkus Manfredi\'s own count, in every placement and at every seed. ' +
   'This is the thing the building is recognised by from the air', trees33);
ok('ONE BUILDING (8/2, ARTICULATION IS NOT FRAGMENTATION): the curvilinear chamber and the ' +
   'angular block MERGE, the way they do in the real lobby — one footprint, never a campus', oneBuilding);
ok('NOTHING IS GREEN. The old district painted 28% of the plot lawn-green in a valley that ' +
   'stopped watering things a decade before act one opens (Paolo: "are you putting grass in ' +
   'downtown?"). No swatch on any ground tile reads as living plant', noGreen);
ok('THE CLOCK TOWER IS DEAD and cannot come back: no legend entry names one, because a clock ' +
   'tower is a New England town hall and this is a Mojave one',
   !Object.keys(D.legend).some(c => /clock|belfry/i.test(D.legend[c].name)));
ok('WALKABLE-LAND: building + plaza + tree farm dominate the pavement', contentDom);
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
ok('building(2) enterable, lot(1) and deck floor(24) drive, basin(8) water-dead, stall ticks(21) ' +
   'MARKING so a car drives over them',
   /interior/i.test(L[2].enter || '') && L[1].kind === 'drive' && L[24].kind === 'drive' &&
   L[8].kind === 'water-dead' && L[21].kind === 'marking');
ok('NOTHING ON THIS PLOT IS OVERHEAD (Paolo 8/2: "no more canopies I only see canopies at ' +
   'parks and shit"). The entry canopy is gone and the solar array stands in its own bed as ' +
   'EQUIPMENT rather than shade — a solar tree you walk under is a canopy whatever the ' +
   'legend calls it',
   Object.keys(L).every(c => K.tileLayer(L[c]).layer !== 'overhead'));
ok('deliberately distinct from the COURTHOUSE (which owns the sally port, the rotunda dome ' +
   'and the blast setback): none of those words appears in this legend',
   !Object.keys(L).some(c => /sally|portico|dome|blast|bollard/i.test(L[c].name)));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('CITY HALL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
