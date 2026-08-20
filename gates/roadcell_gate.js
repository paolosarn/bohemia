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
  /* THE FREEWAY IS ASKED ABOUT ITS AXIS, NOT ITS NEIGHBOURS (7/27). An interstate is
     laid TWO CELLS WIDE, so a straight run has a freeway neighbour to the side that is
     the PARALLEL CARRIAGEWAY, and you cannot drive sideways off one onto the other —
     there is an embankment between them. The old form of this check asked the freeway
     to be through-drivable toward every freeway neighbour, which is only satisfiable if
     every cell draws itself as a four-way junction, and that is precisely what 926 of
     the valley's 952 freeway cells were doing. */
  if (!FWY.throughDrivable(f)) { notThrough++; console.log('    freeway not through: ' + f.through.join('')); }
  if (f.through.concat(f.parallel).sort().join('') !== links.slice().sort().join('')) {
    notThrough++; console.log('    freeway lost a neighbour: ' + links.join(''));
  }
}
ok('all 16 link masks build for both road modules (' + built + ' cells)', built === 32);
ok('a vehicle reaches every edge the corridor carries, every mask', notThrough === 0);

/* THE LATTICE REGRESSION (7/27). This is the gate for the render defect: a freeway cell
   takes its axis from the direction it has BOTH neighbours in, and the odd one out is
   the parallel carriageway. Before the fix, "any freeway neighbour is my axis" made 97%
   of the corridor draw itself as a crossroads and the interstate rendered as a lattice
   of tan embankment squares. Genuine four-way freeway junctions barely exist in this
   valley — where two interstates really cross, the cells are `interchange`. */
{
  const wv = World.world(E.WorldGen.hashSeed('bohemia'));
  let fwCells = 0, junctions = 0, corners = 0, straight = 0;
  for (let y = 0; y < wv.n; y++) for (let x = 0; x < wv.n; x++) {
    const c = wv.at(x, y);
    if (!c || c.district !== 'freeway') continue;
    fwCells++;
    const p = wv.plot(x, y);
    const links = (p.sameLinks && p.sameLinks.length) ? p.sameLinks : ['N', 'S'];
    const res = FWY.generate(1, { same: links, cross: [] });
    const has = d => links.indexOf(d) >= 0;
    // a CROSSROADS has both pairs; a CORNER has one of each and legitimately draws an L
    if (has('N') && has('S') && has('E') && has('W')) junctions++;
    else if (res.axis.vert && res.axis.horiz) corners++;
    else straight++;
  }
  ok('the interstate is a corridor, not a lattice: <5% of freeway cells are crossroads (' +
     junctions + '/' + fwCells + ')', fwCells > 500 && junctions / fwCells < 0.05);
  ok('the rest run straight through on one axis (' + straight + ') with a few real corners (' +
     corners + ')', straight > fwCells * 0.9 && corners < fwCells * 0.10);
}

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
  /* THIS DEMANDED A TILE HIS OWN RULING DELETED (8/20, RUN lane, red sweep).
     Paolo 8/11: "THE STREETS DONT HAVE WALLS." The arterial's code 8 block wall
     was retired on 8/20 and its number left empty on purpose, because the one
     column that survived the 8/11 pass SEALED THE PLAYER INTO A SINGLE CELL --
     flooding the valley from spawn reached three tiles out of 9,216. This clause
     kept asserting that the wall exists and blocks, so WORLD carrying out his
     ruling turned the gate red. A GATE MUST NEVER OUTRANK A RULING.

     And the invariant flips with it. What matters now is not that a wall blocks;
     it is that a wall never comes BACK -- GRAVEYARD IS FINAL, and this
     particular corpse could wall him in again. So the claim is the tripwire:
     code 8 stays empty and nothing on a STREET type is a wall. */
  ok('THE STREETS DO NOT HAVE WALLS (Paolo 8/11) -- the arterial block wall was '
    + 'retired after one surviving column sealed the player into a single cell, '
    + 'and its legend code stays empty so nothing can put it back by number',
    ART.legend[8] === undefined && ART.palette[8] === undefined);
  ok('...and no arterial tile is a wall under any other number either, because a '
    + 'renumbered wall is the same wall',
    !Object.keys(ART.legend).some(k => /\bwall\b/i.test(ART.legend[k].name)));
  /* AND IT MUST STILL BE WALKABLE OUT OF, which is the thing the wall broke.
     A retired legend entry is bookkeeping; a cell you can leave is the point. */
  {
    const g = ART.generate(5, { links: ['N', 'S', 'E', 'W'] }).g;
    const solidTiles = Object.keys(ART.legend).filter(k => K.tileLayer(ART.legend[k]).solid === true);
    const N = Math.round(Math.sqrt(g.length));
    let sealed = 0;
    for (let x = 0; x < N; x++) {
      const col = [];
      for (let y = 0; y < N; y++) col.push(String(g[y * N + x]));
      if (col.every(v => solidTiles.indexOf(v) >= 0)) sealed++;
    }
    ok('...and no full column of the arterial cell is solid, so it can never seal '
      + 'him in the way the block wall did (' + sealed + ' sealed columns)', sealed === 0);
  }
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
// ROADS ONLY. Terrain became a surface too (7/26, terrain_gate.js owns it), so this
// sweep asks specifically about the road network rather than about surfaces in general.
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y);
  if (!c || (c.district !== 'arterial' && c.district !== 'freeway')) continue;
  const p = w.plot(x, y);
  if (p && p.surface && p.block && p.block.grid && p.legend && Object.keys(p.legend).length) rendered++;
  else blank++;
  if (rendered % 400 === 0 && p && p.block) {                    // spot-check content, cheaply
    const c2 = counts(p.block.grid);
    if (!(c2[1] > 500)) blank++;
  }
}
ok('every road cell in the real valley renders a real plot (' + rendered + '/' + roadCells + ')',
   blank === 0 && rendered === roadCells && roadCells > 3000);
ok('surfaces now cover the roads AND the terrain (' + surfaceCells + ' cells)',
   surfaceCells > roadCells);
console.log('  the valley: ' + districtCells + ' district cells + ' + roadCells +
            ' road cells now generated (' + (100 * (districtCells + roadCells) / (w.n * w.n)).toFixed(1) +
            '% of ' + (w.n * w.n) + ' cells)');

const CONFORM_MODS = [['arterial', ART], ['freeway', FWY]];

// ---- CONSTITUTION CONFORMANCE (7/26, after the target screen was ruled CBB) --
/* The freeze lifted the moment Paolo ruled, and the price of cooking again is that
   every cook answers to records/target/BOHEMIA_VISUAL_CONSTITUTION.json. These
   surfaces were built DURING the freeze and shipped flagged PROVISIONAL SKIN, so
   this is that promise coming due: every palette entry must sit inside the measured
   value band for the layer it is drawn on. It caught real drift the first time it
   ran — road paint and the lake's mineral ring were brighter than anything in the
   target, which for act-1 paint was wrong anyway: dead paint is filthy paint. */
{
  const fs2 = require('fs');
  const CPATH = 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json';
  if (!fs2.existsSync(CPATH)) {
    ok('the visual constitution exists to conform to', false);
  } else {
    const C = JSON.parse(fs2.readFileSync(CPATH, 'utf8'));
    const bands = C.proxies.value_bands, slack = 26.0;
    const LAYER_BAND = { ground: 'ground', walk: 'ground', drive: 'ground',
                         marking: 'ground', prop: 'ground', portal: 'wall',
                         structure: 'wall', building: 'wall', fence: 'wall',
                         overhead: 'top' };
    const lum = h => {
      h = h.replace('#', '');
      return 0.299 * parseInt(h.slice(0, 2), 16) + 0.587 * parseInt(h.slice(2, 4), 16)
           + 0.114 * parseInt(h.slice(4, 6), 16);
    };
    let outside = 0, seen = 0;
    for (const [name, mod] of CONFORM_MODS) {
      Object.keys(mod.palette).forEach(code => {
        const L = mod.legend[code];
        if (!L) return;
        seen++;
        const b = bands[LAYER_BAND[K.tileLayer(L).layer] || 'ground'] || bands.ground;
        const v = lum(mod.palette[code]);
        if (v < b.lo - slack || v > b.hi + slack) {
          outside++;
          console.log('    OUT OF BAND: ' + name + ' ' + code + ' ' + L.name +
                      ' lum ' + v.toFixed(0) + ' vs ' + b.lo + '..' + b.hi);
        }
      });
    }
    ok('every palette entry sits in its layer\'s value band (' + (seen - outside) + '/' + seen + ')',
       seen > 0 && outside === 0);
    ok('the constitution being conformed to is the frozen one', C.status === 'IN FORCE');
  }
}

console.log('ROAD CELL GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
