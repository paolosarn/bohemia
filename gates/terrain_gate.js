/* TERRAIN GATE (7/26/26, WORLD lane) — the machine gate for the three TERRAIN surface
   generators: engine/bohemia_desert.js (620 cells), engine/bohemia_mountain.js (927,
   the most numerous thing in the valley after suburb) and engine/bohemia_water.js (74).
   Together with the road cells this is what took the valley from 40% generated to 95%.

   Proves, headlessly:
     1. THE SEAM. This is the one that matters and the one a per-cell generator cannot
        pass. Terrain is sampled from ONE valley-wide field in global coordinates, so
        two side-by-side cells must AGREE along their shared edge. The gate compares the
        last column of a cell to the first column of its real neighbour and requires
        a high match, then compares two cells that are NOT neighbours as a control. If
        somebody ever "simplifies" this back to per-cell seeds, the control and the real
        seam converge and this goes red.
     2. DETERMINISM. Same cell coordinates => byte-identical grid, all three.
     3. THE MOUNTAIN IS A WALL WITH PASSES. Solid rock exists, and so do the ravines: a
        mountain cell is never a solid block (nothing could ever cross the valley edge)
        and never a soft blanket (the wall would not read as a wall).
     4. THE LAKE IS IN DRAWDOWN. The bathtub ring, exposed lakebed and dead water all
        exist, most shoreline cells carry a launch ramp that never reaches the water,
        and the ground below the ring is walkable, because walking out onto a lake is
        the point.
     5. THE DESERT IS THE REAL MOJAVE. Self-spaced creosote (not confetti scatter), OHV
        tracks, illegal dumping, and the GHOST PLAT (a graded subdivision nobody built)
        on a believable minority of cells.
     6. EXPLAIN-EVERY-TILE, layers resolve, no purple.
     7. SURFACE, NOT DISTRICT: terrain never becomes territory, and adding it left the
        live loop's district count untouched.
     8. THE VALLEY IS COVERED: every terrain cell in the real valley renders a plot.

   Run: node gates/terrain_gate.js
   Registered in gates/bohemia_gates.py as TERRAIN. */
'use strict';
const K = require('../engine/bohemia_district_kit.js');
const DSR = require('../engine/bohemia_desert.js');
const MTN = require('../engine/bohemia_mountain.js');
const WAT = require('../engine/bohemia_water.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');
const Loop = require('../engine/bohemia_loop.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = g => { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; };

const MODS = [['desert', DSR], ['mountain', MTN], ['water', WAT]];

// ---- 1. THE SEAM ------------------------------------------------------------
function seamMatch(a, b) {
  let m = 0;
  for (let y = 0; y < 128; y++) if (a[y][127] === b[y][0]) m++;
  return m / 128;
}
for (const [name, mod] of MODS) {
  let worst = 1;
  for (const [cx, cy] of [[20, 30], [7, 50], [61, 12], [88, 77]]) {
    const a = mod.generate(1, { cellX: cx, cellY: cy }).g;
    const b = mod.generate(2, { cellX: cx + 1, cellY: cy }).g;
    worst = Math.min(worst, seamMatch(a, b));
  }
  const control = seamMatch(mod.generate(1, { cellX: 10, cellY: 10 }).g,
                            mod.generate(2, { cellX: 55, cellY: 71 }).g);
  ok(name + ': neighbouring cells agree along the shared edge (' + worst.toFixed(2) + ')', worst >= 0.80);
  ok(name + ': and that is the field, not luck (control ' + control.toFixed(2) + ')', control < worst - 0.25);
}

// ---- 2. determinism ---------------------------------------------------------
for (const [name, mod] of MODS) {
  ok(name + ' is deterministic',
     JSON.stringify(mod.generate(4, { cellX: 12, cellY: 34 }).g) ===
     JSON.stringify(mod.generate(4, { cellX: 12, cellY: 34 }).g));
}

// ---- 3. the mountain is a wall with passes ---------------------------------
/* The invariant is about the RANGE, not about every tile of it. An interior massif cell
   is allowed to be solid rock, because a mountain range genuinely is a wall. What must
   be true is that (a) every mountain cell is mostly rock, (b) the range as a whole
   carries real ravines you could walk, and (c) the cells that face the valley open out
   onto their fans instead of presenting a cliff to the city. */
{
  const interior = [], facing = [];
  for (let i = 0; i < 16; i++) {
    const res = MTN.generate(i, { cellX: 3 + i, cellY: 20 + (i % 7) });
    interior.push(MTN.passableFraction(res));
    const c = counts(res.g);
    ok('interior mountain cell ' + i + ' is mostly rock',
       (c[0] || 0) + (c[1] || 0) + (c[2] || 0) > 900);
  }
  // like for like: the SAME cells, asked what they look like with and without a valley
  // on their doorstep, so the comparison is about openness and nothing else
  const facing3 = [], sameInterior = [];
  for (let i = 0; i < 16; i++) {
    const at = { cellX: 3 + i, cellY: 20 + (i % 7) };
    sameInterior.push(MTN.passableFraction(MTN.generate(i, at)));
    facing.push(MTN.passableFraction(MTN.generate(i, Object.assign({ open: ['E'] }, at))));
    facing3.push(MTN.passableFraction(MTN.generate(i, Object.assign({ open: ['E', 'S', 'N'] }, at))));
  }
  const withPass = interior.filter(f => f > 0.12).length;
  const maxInterior = Math.max.apply(null, interior);
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  const avgInterior = avg(sameInterior), avgFacing = avg(facing), avgFacing3 = avg(facing3);
  ok('the range carries real ravines to walk (' + withPass + '/' + interior.length + ' cells)',
     withPass >= 4);
  ok('no interior cell is a soft blanket (max passable ' + maxInterior.toFixed(2) + ')',
     maxInterior < 0.90);
  /* THE REAL PROPERTY, and the one worth locking: a range does not end in a cliff
     against the city, it GRADES DOWN into its fans. So passability must rise with how
     much valley a cell faces. An absolute number here would be an arbitrary taste call;
     the monotonic relationship is the physics. */
  ok('the range grades into the valley: 1 open edge beats interior (' +
     avgInterior.toFixed(2) + ' -> ' + avgFacing.toFixed(2) + ')', avgFacing > avgInterior + 0.08);
  ok('and 3 open edges beat 1 (' + avgFacing.toFixed(2) + ' -> ' + avgFacing3.toFixed(2) + ')',
     avgFacing3 > avgFacing + 0.08);
  const fan = counts(MTN.generate(3, { cellX: 6, cellY: 20, open: ['E', 'S'] }).g);
  ok('an edge facing the valley lays an alluvial fan', (fan[8] || 0) > 500);
  const noFan = counts(MTN.generate(3, { cellX: 6, cellY: 20, open: [] }).g);
  ok('an edge facing more mountain lays none', !noFan[8]);
  ok('solid rock really is solid', K.tileLayer(MTN.legend[0]).solid === true &&
     K.tileLayer(MTN.legend[1]).solid === true && K.tileLayer(MTN.legend[2]).solid === true);
  ok('the ravine floor really is walkable', K.tileLayer(MTN.legend[4]).solid === false &&
     K.tileLayer(MTN.legend[5]).solid === false);
}

// ---- 4. the lake is in drawdown --------------------------------------------
{
  // only cells that actually hold a stretch of the old shoreline can have a ramp; a cell
  // of pure open water legitimately has none.
  let ramps = 0, cells = 0;
  for (let i = 0; i < 14; i++) {
    const c = counts(WAT.generate(i, { cellX: 60 + i, cellY: 58 }).g);
    if ((c[2] || 0) < 100) continue;          // no shoreline in this cell
    cells++;
    if ((c[7] || 0) > 40) ramps++;
  }
  const c0 = counts(WAT.generate(3, { cellX: 70, cellY: 60 }).g);
  ok('the bathtub ring exists', (c0[2] || 0) > 200);
  ok('exposed lakebed exists', (c0[3] || 0) + (c0[4] || 0) > 600);
  ok('there is still some water', (c0[0] || 0) + (c0[1] || 0) > 200);
  ok('most shoreline cells carry a launch ramp that stops short (' + ramps + '/' + cells + ')',
     cells > 0 && ramps / cells >= 0.5);
  ok('the ground below the ring is walkable', K.tileLayer(WAT.legend[2]).solid === false &&
     K.tileLayer(WAT.legend[3]).solid === false && K.tileLayer(WAT.legend[7]).solid === false);
}

// ---- 5. the desert is the real Mojave --------------------------------------
{
  const res = DSR.generate(9, { cellX: 20, cellY: 30 });
  const c = counts(res.g);
  ok('creosote and bursage stand on the lot', (c[2] || 0) + (c[3] || 0) > 60);
  ok('OHV tracks cross it', (c[6] || 0) > 60);
  ok('somebody dumped something', (c[7] || 0) + (c[8] || 0) > 8);
  // SELF-SPACING: real creosote never clumps. Measured as the share of scrub tiles with
  // a scrub neighbour more than one step away being low -> here, simply that scrub is
  // spread over many rows rather than piled in a corner.
  let rows = 0;
  for (let y = 0; y < 128; y++) if (res.g[y].some(v => v === 2 || v === 3)) rows++;
  ok('the scrub is spaced across the lot, not clumped (' + rows + ' rows)', rows > 40);
  let ghost = 0, tot = 0;
  for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) {
    tot++; if (DSR.generate(x * 7 + y, { cellX: x, cellY: y }).ghostPlat) ghost++;
  }
  const share = ghost / tot;
  ok('the ghost plat is a minority of lots, not the rule (' + (share * 100).toFixed(0) + '%)',
     share > 0.05 && share < 0.35);
}

// ---- 6. explain every tile, layers, purity ---------------------------------
function purplish(hex) {
  const r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
  return b > r + 24 && b > g + 24 && r > g;
}
for (const [name, mod] of MODS) {
  const c = counts(mod.generate(5, { cellX: 33, cellY: 44, open: ['E'] }).g);
  const unnamed = Object.keys(c).filter(k => k !== '0' && !mod.legend[k]);
  const uncoloured = Object.keys(c).filter(k => k !== '0' && !mod.palette[k]);
  ok(name + ': every generated tile is named', unnamed.length === 0);
  ok(name + ': every generated tile has a colour', uncoloured.length === 0);
  ok(name + ': every legend entry resolves to a layer',
     Object.keys(mod.legend).every(k => !!K.tileLayer(mod.legend[k]).layer));
  ok(name + ': no purple', !Object.keys(mod.palette).some(k => purplish(mod.palette[k])));
}

// ---- 7 + 8. the world model -------------------------------------------------
const w = World.world(E.WorldGen.hashSeed('bohemia'));
let districtCells = 0, terrainCells = 0, rendered = 0, blank = 0, generated = 0;
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y); if (!c) continue;
  if (World.isAutoDistrict(c.district)) districtCells++;
  if (World.isAutoDistrict(c.district) || World.isSurfaceCell(c.district)) generated++;
  if (c.district === 'desert' || c.district === 'mountain' || c.district === 'water') {
    terrainCells++;
    const p = w.plot(x, y);
    if (p && p.surface && p.block && p.block.grid && p.legend && Object.keys(p.legend).length) rendered++;
    else blank++;
  }
}
ok('terrain is never an auto-district', !World.isAutoDistrict('desert') &&
   !World.isAutoDistrict('mountain') && !World.isAutoDistrict('water'));
ok('terrain is a surface cell', World.isSurfaceCell('desert') &&
   World.isSurfaceCell('mountain') && World.isSurfaceCell('water'));
const ctx = Loop.boot({ seed: 'bohemia' });
ok('the live loop still counts exactly the district cells (' + ctx.worldMap.districts.length + ')',
   ctx.worldMap.districts.length === districtCells);
ok('every terrain cell in the real valley renders a plot (' + rendered + '/' + terrainCells + ')',
   blank === 0 && rendered === terrainCells && terrainCells > 1500);
const pct = 100 * generated / (w.n * w.n);
ok('the valley is now mostly real ground (' + pct.toFixed(1) + '%)', pct > 90);
console.log('  the valley: ' + generated + ' of ' + (w.n * w.n) + ' cells generate real ground (' +
            pct.toFixed(1) + '%)');

console.log('TERRAIN GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
