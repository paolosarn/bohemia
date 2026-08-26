// RAILYARD GATE (7/21/26). A dead railyard — classification tracks with rolling stock + a loco, an
// engine shed, a container yard under a gantry crane, fenced. Content-dominant (WALKABLE-LAND). Research-first.
const D = require('../engine/bohemia_railyard.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0; const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };
let anatomy = true, filled = true, streetOk = true, cornerPed = true, drive = true, contentDom = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 17 + 3, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  if (!(t[6] > 300 && (t[7] || 0) > 800 && (t[8] || 0) > 80 && (t[10] || 0) > 300 && t[2] > 1000 && (t[13] || 0) > 60 && (t[12] || 0) > 300 && t[4] > 4000)) anatomy = false;
  const ls = K.landStats(g, D.legend); if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, D.palette) || K.voidFraction(g) > 0.22) filled = false;
  if (!D.driveConnected(r)) drive = false;
  const eo = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null); const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = eo(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('classification tracks + rolling stock + loco + containers + engine shed + gantry crane + fence + ballast', anatomy);
ok('WALKABLE-LAND: content dominates', contentDom);
ok('every tile named + low void', filled); ok('DRIVABLE: service road reaches the depot', drive);
ok('gates on street edges', streetOk); ok('CORNER: pedestrian gate on the side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('railyard registered + industrial', !!K.get('railyard') && K.category('railyard') === 'industrial');
ok('depot enterable + footprints', D.generate(7, { streets: ['S'] }).footprints.length >= 1 && /interior/i.test(D.legend[2].enter || ''));
ok('stock(7)+loco(8) vehicle-solid, container(10)+gantry(13) structure, track(6) ground, road(1) drive', K.tileLayer(D.legend[7]).solid === true && K.tileLayer(D.legend[8]).solid === true && D.legend[10].kind === 'structure' && D.legend[13].kind === 'structure' && D.legend[6].kind === 'ground' && D.legend[1].kind === 'drive');
ok('deterministic', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));

/* ===================== ONE YARD, NOT SIX (8/26) =====================
   The valley's railyard is a 3x2 blob and every one of its six cells was building a COMPLETE
   yard: its own engine shed, its own office, its own container stack, its own gantry crane,
   its own perimeter fence. Six sheds and six gantries in a block 288 m across.

   Every line above this passes on a single cell in isolation, which is exactly why that
   survived -- anatomy, legend, void and drivability were all green the whole time.

   A YARD TAKES BOUNDS, NOT NEIGHBOURS, and the difference from the wash is the point. A
   channel is a LINE and needs to know which sides it arrives and leaves on. A classification
   yard is an AREA: one shed at the west end, one container stack at the east, a fan of tracks
   running the whole length between them. Same shape as the solar farm, so it gets the solar
   farm's treatment -- laid out once in valley tiles against the blob's bounds, each cell
   keeping its own window. */
const YB = { x0: 0, x1: 2, y0: 0, y1: 1 };            // the real valley's blob shape, 3 x 2
const cellOf = (x, y, st) => D.generate(4242, { streets: st || [], bounds: YB, cellX: x, cellY: y });
const HAS = (g, code) => { for (const row of g) for (const c of row) if (c === code) return true; return false; };

let lone = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 6; s++) {
  const a = JSON.stringify(D.generate(s * 17 + 3, { streets: cfg }).g);
  const b = JSON.stringify(D.generate(s * 17 + 3, { streets: cfg, bounds: { x0: 0, x1: 0, y0: 0, y1: 0 } }).g);
  if (a !== b) lone = false;
}
ok('a yard that is ONE cell is BYTE-IDENTICAL to the one that shipped', lone);

let sheds = 0, gantries = 0, offices = 0, cells = 0, cVoid = 0, cBlob = 0, cBad = [];
for (let y = YB.y0; y <= YB.y1; y++) for (let x = YB.x0; x <= YB.x1; x++) {
  cells++;
  const r = cellOf(x, y, y === YB.y1 ? ['S'] : []);
  if (HAS(r.g, 2)) sheds++;
  if (HAS(r.g, 13)) gantries++;
  if (r.footprints.length) offices++;
  cVoid = Math.max(cVoid, K.voidFraction(r.g));
  cBlob = Math.max(cBlob, K.largestBlob(r.g, c => c === 0));
  if (!K.legendOk(r.g, D.palette)) cBad.push('legend ' + x + ',' + y);
  /* THE ONE THAT FAILED FIRST. One lane along the yard's south front is what a single-cell
     yard has; across a 3x2 blob it leaves the whole top row with no drivable surface at all,
     and a maintenance vehicle could not reach four of the six cells from any gate. A yard
     this size has a perimeter access road inside the fence, which is how they are built. */
  if (!D.driveConnected(r)) cBad.push('drive ' + x + ',' + y);
}
ok('ONE engine shed in the whole yard, not one per cell (' + sheds + ' of ' + cells + ')', sheds === 1);
ok('ONE gantry crane in the whole yard (' + gantries + ' of ' + cells + ')', gantries === 1);
ok('ONE enterable depot footprint in the whole yard (' + offices + ' of ' + cells + ')', offices === 1);
ok('every cell of the yard still names every tile and dresses its ground (void '
   + cVoid.toFixed(3) + ', blank blob ' + cBlob.toFixed(3) + ')',
   !cBad.filter(b => b.startsWith('legend')).length && cVoid <= 0.35 && cBlob <= 0.28);
ok('a maintenance vehicle reaches the service roads from a gate in EVERY cell of the yard'
   + (cBad.filter(b => b.startsWith('drive')).length ? ' -> ' + cBad.filter(b => b.startsWith('drive')).join(', ') : ''),
   !cBad.filter(b => b.startsWith('drive')).length);

/* AND THE TRAINS LINE UP ACROSS A CELL BOUNDARY, which is not free. Every cell has its own
   seed, so a boxcar decided with the cell's `r()` exists in one cell and not in the neighbour
   that shares the same rail -- a wagon cut in half at every boundary. The stock is placed
   from a hash of the VALLEY coordinate and the BLOB instead.
   ONLY THE EAST-WEST SEAMS ARE CHECKED, and that is deliberate rather than lazy: the rails
   run east-west, so two cells side by side share the same rail rows and their touching
   COLUMNS must agree. Two cells stacked north-south share no rail at all -- adjacent ROWS
   there legitimately differ, one carrying a rail and the other ballast, and a check that
   demanded they match would be measuring nothing and failing. */
let ewSeams = 0, ewBroken = 0;
for (let y = YB.y0; y <= YB.y1; y++) for (let x = YB.x0; x < YB.x1; x++) {
  const a = cellOf(x, y, []).g, b = cellOf(x + 1, y, []).g;
  ewSeams++;
  let bad = 0;
  for (let r = 0; r < a.length; r++) {
    const u = a[r][a[r].length - 1], v = b[r][0];
    if (u !== v && u !== 3 && v !== 3) bad++;      // dead brush is scattered dressing
  }
  if (bad) ewBroken++;
}
ok('the trains run THROUGH a cell boundary: every east-west seam agrees tile for tile ('
   + (ewSeams - ewBroken) + ' of ' + ewSeams + ')', ewSeams > 0 && ewBroken === 0);
console.log('  THE YARD: ' + cells + ' cells, ' + sheds + ' engine shed, ' + gantries
  + ' gantry, ' + ewSeams + ' east-west seams, ' + ewBroken + ' broken');

console.log('RAILYARD GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
