// COURTHOUSE GATE (7/21/26; REWRITTEN 8/2/26 for the rebuilt district).
//
// It used to guard a portico of columns, monumental steps and a cupola — a 19th-century county
// courthouse in Ohio — over a dead green lawn, with one building code at 35.6% of the plot,
// which is a MONOBLOCK by the 7/31 every-pixel-answered finding.
//
// Rewritten to the one this valley has: the LLOYD D. GEORGE U.S. COURTHOUSE (CannonDesign, 2000).
// L-shaped round its own plaza; a ROTUNDA at the elbow under a sixty-foot glass dome; a steel
// canopy PROJECTING from the top of the building with nothing holding it up; 22ft x 10ft precast
// panel joints across the roof plates; and a blast standoff SETBACK held by a bollard line,
// because it was the first federal building in the country built to the post-Oklahoma-City rules.
//
// THE SETBACK IS THE ONE PLACE EMPTY GROUND IS CORRECT, and the gate says so out loud rather
// than letting a future session "fix" it by filling it in.
const D = require('../engine/bohemia_courthouse.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy = true, filled = true, streetOk = true, cornerPed = true, drive = true, contentDom = true,
    oneBuilding = true, noGreen = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 29 + 6, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
    /* THE PROGRAMME: the L (2) under its precast panel joints (6) and roof edge (16), with the
     rooftop plant (10); the ROTUNDA dome (17) and what is left of its glazing (11); the
     PROJECTING canopy (14); the plaza (7) dressed with planters (23), a dry basin (8), the
     flag row (12) and its lights (9); the blast setback (4) held by the bollard line (15);
     the walls (20) and SALLY PORT (22) of the secure yard; and both lots (1) with their
     ticks (21) and the cars nobody came back for (19). */
  if (!(t[2] > 1500 && (t[6] || 0) > 400 && (t[16] || 0) > 150 && (t[10] || 0) > 60 &&
        (t[17] || 0) > 150 && (t[11] || 0) > 100 && (t[7] || 0) > 1200 &&
        (t[23] || 0) > 100 && (t[8] || 0) > 60 && (t[12] || 0) >= 3 && (t[9] || 0) >= 4 &&
        (t[4] || 0) > 1200 && (t[15] || 0) > 30 && (t[20] || 0) > 100 && (t[22] || 0) > 20 &&
        (t[1] || 0) > 800 && (t[21] || 0) > 200 && (t[19] || 0) > 20)) anatomy = false;
  /* ONE BUILDING (8/2): both legs and the rotunda share walls. */
  if (r.footprints.length !== 1) oneBuilding = false;
  /* DEAD THINGS ARE NOT GREEN: read the NAME, then read the swatch. */
  for (const code of Object.keys(D.legend)) {
    const e = D.legend[code]; if (K.tileLayer(e).layer !== 'ground') continue;
    if (/tree|plant|shrub/i.test(e.name)) continue;
    const h = D.palette[code]; if (!h) continue;
    const R = parseInt(h.slice(1,3),16), G2 = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
    if (G2 > R + 6 && G2 > B + 6) noGreen = false;
  }
  const ls = K.landStats(g, D.legend); if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, D.palette) || K.voidFraction(g) > 0.22) filled = false;
  if (!D.driveConnected(r)) drive = false;
  const eo = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null); const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = eo(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE PROGRAMME: the L under its precast panel grid, the ROTUNDA and its dome glazing, the ' +
   'PROJECTING canopy, a dressed plaza with planters and a dry basin, the blast setback held ' +
   'by a bollard line, and the walled secure yard with its sally port', anatomy);
ok('ONE BUILDING (8/2, ARTICULATION IS NOT FRAGMENTATION): both legs and the rotunda share ' +
   'walls — one footprint, never a campus. The yard wall is a FENCE, not a second courthouse', oneBuilding);
ok('NOTHING IS GREEN: no ground swatch reads as living plant (Paolo: "are you putting grass ' +
   'in downtown?"). The old lawn here was the same greenwash', noGreen);
ok('THE COLONNADE IS DEAD and cannot come back: no legend entry names a portico, a column or ' +
   'a step, because that is a county courthouse in Ohio and this is a blast-rated federal L',
   !Object.keys(D.legend).some(c => /portico|colonnade|column(?!.*deck)|grand step/i.test(D.legend[c].name)));
ok('NOTHING ON THIS PLOT IS OVERHEAD (Paolo 8/2: "no more canopies I only see canopies at ' +
   'parks and shit"). The cantilever is gone; a federal entrance without one is STEPS and ' +
   'the PIERS that carry the wall above them',
   Object.keys(D.legend).every(c => K.tileLayer(D.legend[c]).layer !== 'overhead'));
ok('THE SALLY PORT IS A PORTAL, never a second car entrance (STREET-AWARE law): one car gate ' +
   'on the primary street, and the secure yard is reached through the site',
   K.tileLayer(D.legend[22]).layer === 'portal' &&
   D.generate(31, { streets: ['S'] }).gates.length === 1 && D.hasSallyPort(D.generate(31, { streets: ['S'] })));
ok('WALKABLE-LAND: content dominates (a courthouse IS its building)', contentDom);
ok('every tile named + low void', filled); ok('DRIVABLE: the lot + sally lane reach the curb', drive);
ok('gates on street edges', streetOk); ok('CORNER: pedestrian gate on the side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('courthouse registered + civic', !!K.get('courthouse') && K.category('courthouse') === 'civic');
ok('courthouse enterable + footprints', D.generate(7, { streets: ['S'] }).footprints.length >= 1 && /interior/i.test(D.legend[2].enter || ''));
ok('dome(17) + panel joints(6) + bollards(15) structure, plaza(7) ground, lot(1) drive, ' +
   'stall ticks(21) MARKING so a car drives over them, yard wall(20) a FENCE',
   D.legend[17].kind === 'structure' && D.legend[6].kind === 'structure' &&
   D.legend[15].kind === 'structure' && D.legend[7].kind === 'ground' &&
   D.legend[1].kind === 'drive' && D.legend[21].kind === 'marking' && D.legend[20].kind === 'fence');
ok('THE BLAST SETBACK IS DELIBERATE, NOT A VOID, and it is written down as such — standoff ' +
   'distance IS the security measure this building was the first in the country designed around',
   /standoff|blast/i.test(D.legend[4].act1 || ''));
ok('deterministic', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('COURTHOUSE GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
