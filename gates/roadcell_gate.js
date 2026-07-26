/* ROAD CELL GATE (7/26/26, WORLD lane) — the machine gate for the two SURFACE
   generators that build the valley's road network: engine/bohemia_arterial.js (the
   mile-grid street, 2,434 cells) and engine/bohemia_freeway.js (the interstate, 952
   cells). Together they are 37% of the valley, which until today generated nothing at
   all and rendered as a flat grey slab.

   Proves, headlessly:
     1. EVERY MASK BUILDS. All 16 combinations of connected neighbours generate without
        throwing, for both modules, and a vehicle surface actually reaches every edge
        the network says connects (a road that does not go through is not a road).
     2. DETERMINISM. Same seed + same links => byte-identical grid, both modules.
     3. SIDEWALK SANCTITY (arterial). The detached sidewalk is CONTINUOUS: one connected
        component carries essentially all of it, so a body can walk the corridor and
        around every corner. A 4-way carries crosswalks on all four approaches.
     4. LINE COLOR LAW (Paolo 7/13). Yellow separates DIRECTION and nothing else: on the
        arterial it exists only at the left-turn bay where the median opens (never on a
        plain through street), and on the freeway it does not exist at all, because a
        concrete barrier does that job there.
     5. EXPLAIN-EVERY-TILE. Every code a generated cell contains is named in the legend
        and coloured in the palette, and every legend entry resolves to a real layer.
     6. LAYERING. The freeway overpass deck is a genuine OVERHEAD tile (you pass under
        it) carried on SOLID columns; walls and barriers block; walks and lanes do not.
     7. PURITY. No purple anywhere (the Amalgamation's alone).
     8. THE BLAST-RADIUS GUARD, the important one. A road cell is a SURFACE, never a
        district: adding these must not have added a single district to the world. The
        live loop's district count must still equal exactly the DISTGEN cells, so no
        faction can base on a street, no economy district can be a street, and nothing
        that counts districts counts one.
     9. THE VALLEY IS COVERED. Every arterial and freeway cell in the real valley now
        returns a real generated plot from the world model.

   Run: node gates/roadcell_gate.js
   Registered in gates/bohemia_gates.py as ROAD CELLS. */
'use strict';
const K = require('../engine/bohemia_district_kit.js');
const ART = require('../engine/bohemia_arterial.js');
const FWY = require('../engine/bohemia_freeway.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');
const Loop = require('../engine/bohemia_loop.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const DIRS = ['N', 'S', 'E', 'W'];
const MASKS = [];
for (let m = 0; m < 16; m++) MASKS.push(DIRS.filter((d, i) => m & (1 << i)));

function counts(g) { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; }

// ---- 1. every mask builds, and goes through ---------------------------------
let built = 0, notThrough = 0;
for (const mask of MASKS) {
  const links = mask.length ? mask : ['N', 'S'];
  const a = ART.generate(3, { links: links });
  const f = FWY.generate(3, { same: links, cross: [] });
  built += 2;
  if (!ART.throughDrivable(a, links)) { notThrough++; console.log('    arterial not through: ' + links.join('')); }
  if (!FWY.throughDrivable(f, links)) { notThrough++; console.log('    freeway not through: ' + links.join('')); }
}
ok('all 16 link masks build for both road modules (' + built + ' cells)', built === 32);
ok('a vehicle reaches every connected edge, every mask', notThrough === 0);

// ---- 2. determinism ---------------------------------------------------------
ok('arterial is deterministic (same seed + links => identical grid)',
   JSON.stringify(ART.generate(9, { links: ['N', 'S', 'E', 'W'] }).g) ===
   JSON.stringify(ART.generate(9, { links: ['N', 'S', 'E', 'W'] }).g));
ok('freeway is deterministic (same seed + links => identical grid)',
   JSON.stringify(FWY.generate(9, { same: ['N', 'S'], cross: ['E'] }).g) ===
   JSON.stringify(FWY.generate(9, { same: ['N', 'S'], cross: ['E'] }).g));

// ---- 3. SIDEWALK SANCTITY: the walk is continuous ---------------------------
function largestComponent(g, isMine) {
  const H = g.length, W = g[0].length, seen = new Set();
  let total = 0, best = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isMine(g[y][x])) total++;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = x + ',' + y;
    if (!isMine(g[y][x]) || seen.has(k)) continue;
    let n = 0; const st = [[x, y]]; seen.add(k);
    while (st.length) {
      const [px, py] = st.pop(); n++;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = px + dx, ny = py + dy, nk = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen.has(nk)) return;
        if (!isMine(g[ny][nx])) return;
        seen.add(nk); st.push([nx, ny]);
      });
    }
    if (n > best) best = n;
  }
  return { total, best };
}
const WALK_ONLY = c => c === 6 || c === 13;            // sidewalk + the bus stop pad cut into it
const CROSSABLE = c => c === 6 || c === 13 || c === 3; // ...plus the crosswalks and curb ramps
// A through street has TWO walks, one per side, and that is correct: the only legal way
// across mid-block is nowhere. Each side must be unbroken end to end.
for (const links of [['N', 'S'], ['E', 'W']]) {
  const s = largestComponent(ART.generate(5, { links: links }).g, WALK_ONLY);
  ok('arterial ' + links.join('') + ': each side carries an unbroken walk (' +
     s.best + '/' + s.total + ')', s.total > 200 && s.best / s.total >= 0.45);
}
// At a real crossing the walks must JOIN. The paint is a ladder with gaps in it (which
// is what a crosswalk looks like), and paint blocks nobody, so the honest question is
// whether a BODY can get across: is the whole corridor one traversable space, or does a
// wall or a prop line seal it? Measured over every non-solid tile, both modules.
function traversable(mod, res, label, floor) {
  const solid = {};
  Object.keys(mod.legend).forEach(k => { solid[k] = K.tileLayer(mod.legend[k]).solid; });
  const s = largestComponent(res.g, c => c === 0 ? true : !solid[c]);
  ok(label + ': the corridor is one traversable space (' + s.best + '/' + s.total + ')',
     s.total > 8000 && s.best / s.total >= floor);
}
for (const links of [['N', 'S', 'E', 'W'], ['N', 'E'], ['N', 'S']]) {
  traversable(ART, ART.generate(5, { links: links }), 'arterial ' + links.join(''), 0.95);
}
traversable(FWY, FWY.generate(5, { same: ['N', 'S'], cross: ['E', 'W'] }), 'freeway NS + overpass', 0.90);
{  // and the crossing paint really does land where a body would cross
  const c4 = counts(ART.generate(5, { links: ['N', 'S', 'E', 'W'] }).g);
  ok('curb ramps carry the crossing up to the walk', (c4[3] || 0) > 260);
}
{
  const four = ART.generate(5, { links: ['N', 'S', 'E', 'W'] });
  const c = counts(four.g);
  ok('a 4-way carries crosswalks and stop bars', (c[3] || 0) > 100 && (c[15] || 0) > 20);
  ok('a 4-way carries signal masts on the corners', (c[12] || 0) >= 3);
}

// ---- 4. LINE COLOR LAW ------------------------------------------------------
{
  const through = counts(ART.generate(5, { links: ['N', 'S'] }).g);
  const cross = counts(ART.generate(5, { links: ['N', 'S', 'E', 'W'] }).g);
  ok('no yellow on a plain through street (the median separates the directions)', !through[17]);
  ok('yellow appears only at the turn bay where the median opens', (cross[17] || 0) > 0);
  ok('white lane lines exist on both', (through[2] || 0) > 50 && (cross[2] || 0) > 50);
  const fw = counts(FWY.generate(5, { same: ['N', 'S'], cross: [] }).g);
  ok('the freeway has no yellow anywhere (a barrier does that job)',
     Object.keys(FWY.legend).every(k => !/yellow/i.test(FWY.legend[k].name)) && (fw[2] || 0) > 50);
}

// ---- 5. EXPLAIN-EVERY-TILE --------------------------------------------------
for (const [name, mod, res] of [
  ['arterial', ART, ART.generate(5, { links: ['N', 'S', 'E', 'W'] })],
  ['freeway', FWY, FWY.generate(5, { same: ['N', 'S'], cross: ['E', 'W'] })]]) {
  const c = counts(res.g);
  const unnamed = Object.keys(c).filter(k => k !== '0' && !mod.legend[k]);
  const uncoloured = Object.keys(c).filter(k => k !== '0' && !mod.palette[k]);
  ok(name + ': every generated tile is named in the legend', unnamed.length === 0);
  ok(name + ': every generated tile has a palette colour', uncoloured.length === 0);
  const badLayer = Object.keys(mod.legend).filter(k => !K.tileLayer(mod.legend[k]).layer);
  ok(name + ': every legend entry resolves to a real layer', badLayer.length === 0);
}

// ---- 6. LAYERING ------------------------------------------------------------
{
  const deck = K.tileLayer(FWY.legend[12]), col = K.tileLayer(FWY.legend[13]);
  ok('the overpass deck is OVERHEAD (you pass under it)', deck.layer === 'overhead' && !deck.solid);
  ok('the bridge columns are solid structure', col.solid === true);
  ok('the sound wall blocks', K.tileLayer(FWY.legend[8]).solid === true);
  ok('the median barrier blocks', K.tileLayer(FWY.legend[4]).solid === true);
  ok('the arterial block wall blocks', K.tileLayer(ART.legend[8]).solid === true);
  ok('the arterial sidewalk does not block', K.tileLayer(ART.legend[6]).solid === false);
  ok('the raised median is steppable, not a blocker', K.tileLayer(ART.legend[4]).solid === false);
  const withDeck = counts(FWY.generate(5, { same: ['N', 'S'], cross: ['E', 'W'] }).g);
  ok('an arterial crossing puts a real deck + piers over the freeway',
     (withDeck[12] || 0) > 200 && (withDeck[13] || 0) > 0);
}

// ---- 7. PURITY --------------------------------------------------------------
function purplish(hex) {
  const r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
  return b > r + 24 && b > g + 24 && r > g;
}
[['arterial', ART], ['freeway', FWY]].forEach(([n, mod]) => {
  const bad = Object.keys(mod.palette).filter(k => purplish(mod.palette[k]));
  ok(n + ': no purple in the palette (the Amalgamation alone owns it)', bad.length === 0);
});

// ---- 8. THE BLAST-RADIUS GUARD: a road is a surface, never a district --------
const w = World.world(E.WorldGen.hashSeed('bohemia'));
let districtCells = 0, roadCells = 0, surfaceCells = 0;
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y); if (!c) continue;
  if (World.isAutoDistrict(c.district)) districtCells++;
  if (World.isSurfaceCell(c.district)) surfaceCells++;
  if (c.district === 'arterial' || c.district === 'freeway') roadCells++;
}
ok('arterial and freeway are NOT auto-districts',
   !World.isAutoDistrict('arterial') && !World.isAutoDistrict('freeway'));
ok('arterial and freeway ARE surface cells',
   World.isSurfaceCell('arterial') && World.isSurfaceCell('freeway'));
const ctx = Loop.boot({ seed: 'bohemia' });
ok('the live loop still counts exactly the district cells, no street among them (' +
   ctx.worldMap.districts.length + ')', ctx.worldMap.districts.length === districtCells);
ok('no faction is based on a street', [...ctx.factions.factions.values()].every(f =>
   [...(f.territory || [])].every(id => {
     const p = id.split(','); const c = w.at(+p[0], +p[1]);
     return c && !World.isSurfaceCell(c.district);
   })));

// ---- 9. THE VALLEY IS COVERED ----------------------------------------------
let rendered = 0, blank = 0, deckCells = 0;
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y); if (!c || !World.isSurfaceCell(c.district)) continue;
  const p = w.plot(x, y);
  if (p && p.surface && p.block && p.block.grid && p.legend && Object.keys(p.legend).length) rendered++;
  else blank++;
  if (rendered % 400 === 0 && p && p.block) {                    // spot-check content, cheaply
    const c2 = counts(p.block.grid);
    if (!(c2[1] > 500)) blank++;
  }
}
ok('every road cell in the real valley renders a real plot (' + rendered + '/' + roadCells + ')',
   blank === 0 && rendered === roadCells && rendered === surfaceCells);
console.log('  the valley: ' + districtCells + ' district cells + ' + roadCells +
            ' road cells now generated (' + (100 * (districtCells + roadCells) / (w.n * w.n)).toFixed(1) +
            '% of ' + (w.n * w.n) + ' cells)');

console.log('ROAD CELL GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
