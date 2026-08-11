// LIBRARY GATE (7/21/26). A dead public library — a big columned building around an inner reading
// courtyard, a colonnade + entrance steps down to a piazza with a dead fountain, admin/community
// wings, a reading garden, a small lot. Building-dominant (WALKABLE-LAND easily). Research-first.
const D = require('../engine/bohemia_library.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy = true, filled = true, streetOk = true, cornerPed = true, drive = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 27 + 6, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  /* REBUILT 8/2 on the research. The old district was ONE building mass -- 37% of the plot
     under a single code, one footprint, a flat rectangle on a lawn, and the worst thing
     left on the contact sheet.
     THE REFERENCE IS REAL AND IT IS IN LAS VEGAS: Antoine Predock's Las Vegas Library and
     Lied Discovery Museum (1986-90, Las Vegas Blvd). What everybody remembers is the
     geometry -- the CONES and the giant concrete TOWER -- in sandstone, because "the color
     scheme is provided by the desert". */
  if (!((t[2] || 0) > 1500 && (t[14] || 0) > 200 && (t[11] || 0) > 300 && (t[12] || 0) > 500 &&
        (t[7] || 0) > 800 && (t[13] || 0) > 1500 && (t[10] || 0) > 50 && (t[9] || 0) > 4 &&
        (t[1] || 0) > 800 && (t[19] || 0) > 20 && (t[3] || 0) > 4 && (t[18] || 0) > 10 &&
        (t[17] || 0) > 200)) anatomy = false;
  /* EVERY PIXEL ANSWERED FOR (7/31): no code owns 30% of the plot. */
  { const A = r.g.length * r.g[0].length; let big = 0; for (const k in t) if (t[k] > big) big = t[k];
    if (100 * big / A >= 30) anatomy = false; }
  /* A LIBRARY IS ONE BUILDING. Paolo 8/2, at 22%: "There's like six different buildings of
     the library. What's up with that?"
     THIS GATE USED TO ASSERT `footprints >= 4` -- it was REQUIRING the bug. I read the 7/30
     law (NO BUILDING IS A FLAT RECTANGLE) as "make several separate buildings", which is a
     different thing and a wrong one. ARTICULATION IS NOT FRAGMENTATION: a civic landmark is
     ONE mass whose parts differ, all joined, the roof line stepping between them. A wrong
     law encoded in a machine is worse than a wrong drawing, because it outlives the turn
     that made it and teaches the same error to everyone after.
     So: ONE footprint, and the variety is asserted by the PARTS it contains, above. */
  if (r.footprints.length !== 1) anatomy = false;
  const ls = K.landStats(g, D.legend); if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, D.palette) || K.voidFraction(g) > 0.22) filled = false;
  if (!D.driveConnected(r)) drive = false;
  const eo = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = eo(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE DRUM AND THE TOWER: Predock\'s geometry — the drum with its oculus ring, the ' +
   'concrete tower, the reading wing under its clerestory, the museum wing, walled ' +
   'courtyards, the entry plaza with its dry fountain, the terrace it all sits on and the ' +
   'lot with the cars still in it — ALL OF IT ONE BUILDING, because a library is one building (Paolo 8/2), and no code owning 30% of the plot', anatomy);
ok('WALKABLE-LAND: content dominates (a library IS its building)', contentDom);
ok('every tile named + low void', filled);
ok('DRIVABLE: the drop-off + side lots reach the curb', drive);
ok('gates on street edges', streetOk);
ok('CORNER: pedestrian gate on the side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('library registered + civic', !!K.get('library') && K.category('library') === 'civic');
ok('library enterable + footprints', D.generate(7, { streets: ['S'] }).footprints.length >= 1 && /interior/i.test(D.legend[2].enter || ''));
/* THE TERRACE IS GROUND, NOT WALK (8/11/26). It was `walk`, and that one field
   made D1 KERB read 23,514 mass-on-sidewalk violations here -- because a code
   doing double duty as both the public walk AND the plinth the building stands on
   means the building legally stands on a sidewalk. The legend's own act1 text
   settled it: "the raised concrete TERRACE THE WHOLE BUILDING SITS ON". A surface
   a building stands on is ground. Renamed 'terrace / walk' -> 'terrace / plinth'
   and reclassified at the source; the d1_kerb ratchet for library is 0 forever,
   so flipping it back goes red there as well as here.
   Full reasoning: records/BOHEMIA_I_DECIDE_THE_MECHANISM_8_11_26.md */
ok('the library(2) is ENTERABLE, the plaza(7) and courtyard(12) are ground, the terrace(13) ' +
   'is GROUND (a plinth is not a sidewalk), the lot(1) is drive, and the doorway(18) is a PORTAL',
   /interior/i.test((D.legend[2] || {}).enter || '') && D.legend[7].kind === 'ground' &&
   D.legend[12].kind === 'ground' && D.legend[13].kind === 'ground' &&
   D.legend[1].kind === 'drive' && D.legend[18].kind === 'portal');
ok('deterministic', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('LIBRARY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
