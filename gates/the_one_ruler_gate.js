#!/usr/bin/env node
/* ============================================================================
   THE ONE RULER  (WORLD, 10/18/26; the coordinator's ask, from COMBAT TWO's
   finding in records/BOHEMIA_COMBAT2_THE_BOARD_CUT_FROM_THE_MAP_10_18_26.md)

   COMBAT TWO read a map block as 230 m (a lane painted 2 fine cells wide, read
   as a real 3.6 m lane). WORLD's region says 384 m (the 7/6 valley scale law,
   Paolo LOCKED: the 96 x 96 map IS the whole valley, a 1:4 squeeze, GTA's).
   Settled from the data, records/BOHEMIA_WORLD_THE_ONE_RULER_10_18_26.md:

     A BLOCK IS 384 m OF REAL LAS VEGAS GROUND (where things are, how long a
     trip takes) AND ITS DRAWING IS 96 m AT LIFE SIZE (0.75 m a fine cell: a
     lane, a sidewalk, a house, a road kerb to kerb are each their real size).
     The land is squeezed four to one, the things on it are not. 230 m is
     nobody's number: the map paints a lane 4 cells and a line, not 2.

   IT REFUSES:
   A. TWO NUMBERS IN THE DATA. The region file's real metres a block is the
      law's 22.9 miles over 96; its drawn metres are the engine's CELL_M x
      TILE_FINE; the squeeze is their ratio.
   B. A VALLEY THAT IS NOT LAS VEGAS AT 384 m. On the game's seed the long
      arterials sit a real section-line mile apart (Las Vegas's grid) at 384 m
      a block, and Henderson, 20 km from the Strip, lands inside the valley.
   C. A DRAWING THAT IS NOT LIFE SIZE AT CELL_M. From the map's own cells
      (measured by tools/bohemia_world_the_one_ruler_10_18_26.js): a lane, the
      road kerb to kerb, a sidewalk, a house, the houses a hectare, each inside
      the real Las Vegas range. And the test is not vacuous: read at COMBAT
      TWO's 1.8 m a cell, at least four of the five fail.
   D. A MEASUREMENT OF ANOTHER VALLEY, or too few samples to mean anything.
   E. THE DEAD NUMBER IN LIVE CODE: no engine/ or slices/ file says a block is
      230 m.
   F. TWO NUMBERS FOR ONE BLOCK (row [the block size settled], 10/18): every
      live file that declares a block's size, a fine cell or the clock agrees
      with A to D, or is listed as owed with its wrong number pinned (section F
      says how; records/BOHEMIA_WORLD_ONE_NUMBER_FOR_A_BLOCK_10_18_26.md lists
      every carrier and its owner).
   AND IT PRINTS, NEVER REDS: when the painter's functions changed after the
   measurement (re-run the tool), and the Strip's length against the real one.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const P = p => path.join(ROOT, p);
const read = p => fs.readFileSync(P(p), 'utf8');

/* the functions in the CITY frame that decide what a fine cell is */
const PAINT_FNS = ['__subGrid', '__kitGrid', 'tileMeta', 'realizeCell'];
function fnText(src, name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return '';
  let j = src.indexOf('{', i), depth = 0;
  for (; j < src.length; j++) { const c = src[j]; if (c === '{') depth++; else if (c === '}') { depth--; if (!depth) break; } }
  return src.slice(i, j + 1);
}
function painterPrint(frameSrc) {
  const src = frameSrc || read('slices/BOHEMIA_CITY_WORLD.html');
  const h = crypto.createHash('sha1');
  for (const n of PAINT_FNS) h.update(n + '\n' + fnText(src, n) + '\n');
  return h.digest('hex').slice(0, 16);
}
module.exports = { painterPrint };
if (require.main !== module) return;

const OM = require('../engine/bohemia_overmap.js');
const REGION = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));
const MEASURED = 'records/BOHEMIA_WORLD_THE_ONE_RULER_MEASURED_10_18_26.json';
const MI = 1609.344;
const LAW_MILES = 22.9;                 /* laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md */
const COMBAT2_M = 1.8;                  /* COMBAT TWO's reading: 230 m / 128 */

/* real Las Vegas sizes, each with its source in the record's section 3 */
const REAL = {
  lane:    [2.7, 3.9],    /* a travel lane, 10 to 12 ft (3.05 to 3.66 m), its line included */
  kerb:    [18, 36],      /* a six-lane arterial with its median, kerb to kerb; Clark County's 100 ft right of way is 30.5 m with the walks */
  walk:    [1.0, 2.6],    /* a sidewalk; Clark County's standard is 5 ft, 1.5 m */
  houseL:  [9, 22],       /* a tract house's long side, garage in */
  houseS:  [6, 16],       /* its short side */
  perHa:   [8, 30]        /* houses a hectare on a Las Vegas tract block, gross */
};

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const say = (n, note) => console.log('  NOTE ' + n + (note ? '  (' + note + ')' : ''));
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };
const median = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const inR = (v, r) => v >= r[0] && v <= r[1];
const f1 = v => (Math.round(v * 10) / 10).toString();

console.log('THE ONE RULER: a block is 384 m of real ground and 96 m of life-size drawing');

/* the game's seed, out of the CITY frame (the map RUN ships) */
const frame = read('slices/BOHEMIA_CITY_WORLD.html');
let seed = null;
{
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/);
  const hs = frame.indexOf('function BOH_HASH_SEED(');
  if (st && hs >= 0) {
    const body = frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27);
    seed = new Function(body + '\nreturn BOH_HASH_SEED;')()(st[1]);
  }
}

section('A. one number in the data', () => {
  const lawReal = LAW_MILES * MI / OM.OVER_N;
  ok('A1 the region file says 384 m of real ground a block', REGION.metresPerCell === 384 && REGION.scale.metresReal === 384,
     'metresPerCell ' + REGION.metresPerCell);
  ok('A2 ... which is the 7/6 law\'s 22.9 miles over 96', Math.abs(lawReal - REGION.metresPerCell) < 1, f1(lawReal) + ' m');
  ok('A3 the drawn metres are the engine\'s CELL_M x TILE_FINE', REGION.metresDrawn === OM.CELL_M * OM.TILE_FINE && OM.TILE_M === 96,
     OM.CELL_M + ' x ' + OM.TILE_FINE + ' = ' + OM.TILE_M + ' m');
  ok('A4 the squeeze is their ratio, four to one', REGION.compression === REGION.metresPerCell / REGION.metresDrawn, String(REGION.compression));
});

section('B. the valley is Las Vegas at 384 m (the game\'s seed, live)', () => {
  ok('B0 the seed reads out of the CITY frame', typeof seed === 'number', String(seed));
  const om = OM.buildOvermap(typeof seed === 'number' ? seed : 2691674296), N = OM.OVER_N;
  const isA = (x, y) => { const t = om.at(x, y); return !!t && t.district === 'arterial'; };
  const lines = (horiz) => {
    const out = [];
    for (let a = 0; a < N; a++) { let r = 0, best = 0; for (let b = 0; b < N; b++) { (horiz ? isA(b, a) : isA(a, b)) ? (r++, best = Math.max(best, r)) : (r = 0); } if (best >= 12) out.push(a); }
    return out;
  };
  const gaps = [];
  for (const L of [lines(true), lines(false)]) for (let i = 1; i < L.length; i++) gaps.push(L[i] - L[i - 1]);
  const grid = gaps.filter(g => g >= 2 && g <= 7);
  const mean = grid.reduce((a, b) => a + b, 0) / Math.max(1, grid.length);
  const at = m => mean * m;
  ok('B1 the long arterials are a real section-line mile apart at 384 m', grid.length >= 20 && Math.abs(at(384) - MI) / MI <= 0.2,
     grid.length + ' gaps, ' + f1(mean) + ' blocks = ' + Math.round(at(384)) + ' m against 1,609; at 230 m it would be ' + Math.round(at(230)) + ' m');
  const hen = (REGION.inValley || []).find(p => p.name === 'HENDERSON');
  const half = OM.OVER_N / 2;
  const inside = m => hen && Math.abs(hen.km * 1000 * Math.sin(hen.bearing * Math.PI / 180) / m) < half && Math.abs(hen.km * 1000 * Math.cos(hen.bearing * Math.PI / 180) / m) < half;
  ok('B2 Henderson (real, 20 km from the Strip) is inside the valley at 384 m, as the law says the map is the whole valley',
     !!hen && inside(384) && !inside(230), hen ? 'at 384 m inside; at 230 m it falls ' + Math.round(hen.km * 1000 / 230) + ' blocks out, past the edge' : 'not in the file');
  /* the Strip, printed: the 5 x 5 mega-resorts stretch it (the abstraction law), never a red here */
  const strat = om.tiles.find(t => t.district === 'strat'), luxor = om.tiles.find(t => t.district === 'luxor');
  if (strat && luxor) {
    const b = Math.hypot(strat.x - luxor.x, strat.y - luxor.y);
    say('the Strip, the Strat to the Luxor: ' + f1(b) + ' blocks; the real 5.8 km is ' + f1(5800 / 384) + ' at 384 m',
        'the Strip is drawn ' + f1(b / (5800 / 384)) + ' times its real length so its 5 x 5 resorts fit; the roll\'s, row [the roll]');
  }
});

let M = null;
section('D. the measurement is of this valley, and enough of it', () => {
  ok('D0 the map\'s cells were measured', fs.existsSync(P(MEASURED)), MEASURED);
  if (!fs.existsSync(P(MEASURED))) return;
  M = JSON.parse(read(MEASURED));
  ok('D1 measured on the game\'s seed', M.seed === seed, M.seed + ' / ' + seed);
  const roofs = M.suburb.reduce((a, b) => a + b.roofs.length, 0);
  ok('D2 enough of it', M.arterial.length >= 20 && M.suburb.length >= 20 && roofs >= 200,
     M.arterial.length + ' road cuts, ' + M.suburb.length + ' suburb blocks, ' + roofs + ' roofs');
  const now = painterPrint(frame);
  if (M.painter === now) say('the painter is unchanged since the measurement', now);
  else say('THE PAINTER CHANGED SINCE THE MEASUREMENT: re-run node tools/bohemia_world_the_one_ruler_10_18_26.js', M.painter + ' -> ' + now);
});

section('C. the drawing is life size at CELL_M ' + OM.CELL_M + ' m a cell', () => {
  if (!M) { ok('C0 a measurement to read', false); return; }
  /* lanes: asphalt runs with a paint line on at least one side; walks: sidewalk runs;
     kerb to kerb: the span between two sidewalks that holds painted lanes (a cut through
     a junction or a lot's drive has no such span and is not a road's cross-section) */
  const lanes = [], kerbs = [], walks = [];
  for (const cut of M.arterial) {
    const s = cut.seq;
    let lastSide = -1, span = 0, painted = false;
    for (let i = 0; i < s.length; i++) {
      const [t, n] = s[i];
      if (t === 'asphalt') {
        const lp = i > 0 && s[i - 1][0] === 'paint', rp = i + 1 < s.length && s[i + 1][0] === 'paint';
        if (lp || rp) lanes.push(n + 0.5 * ((lp ? 1 : 0) + (rp ? 1 : 0)));
      }
      if (t === 'side') {
        walks.push(n);
        if (lastSide >= 0 && painted && span > 0) kerbs.push(span);
        lastSide = i; span = 0; painted = false;
      } else if (lastSide >= 0) { span += n; if (t === 'paint') painted = true; }
    }
  }
  const houses = [], perBlock = [];
  for (const b of M.suburb) { perBlock.push(b.roofs.length); for (const r of b.roofs) houses.push(r); }
  const hL = median(houses.map(r => Math.max(r[0], r[1]))), hS = median(houses.map(r => Math.min(r[0], r[1])));
  const blockHa = m => Math.pow(M.FN * m, 2) / 10000;
  const cells = { lane: median(lanes), kerb: median(kerbs), walk: median(walks), houseL: hL, houseS: hS, perBlock: median(perBlock) };
  const read = m => ({ lane: cells.lane * m, kerb: cells.kerb * m, walk: cells.walk * m, house: [cells.houseL * m, cells.houseS * m], perHa: cells.perBlock / blockHa(m) });
  const tests = r => [inR(r.lane, REAL.lane), inR(r.kerb, REAL.kerb), inR(r.walk, REAL.walk),
                      inR(r.house[0], REAL.houseL) && inR(r.house[1], REAL.houseS), inR(r.perHa, REAL.perHa)];
  const R = read(OM.CELL_M);
  ok('C1 a lane is a real lane', inR(R.lane, REAL.lane), cells.lane + ' cells with its line = ' + f1(R.lane) + ' m (real 3.05 to 3.66, line in)');
  ok('C2 an arterial kerb to kerb is a real six-lane arterial', inR(R.kerb, REAL.kerb), cells.kerb + ' cells = ' + f1(R.kerb) + ' m');
  ok('C3 a sidewalk is a real sidewalk', inR(R.walk, REAL.walk), cells.walk + ' cells = ' + f1(R.walk) + ' m (Clark County 1.5)');
  ok('C4 a house is a real tract house', inR(R.house[0], REAL.houseL) && inR(R.house[1], REAL.houseS),
     cells.houseL + ' x ' + cells.houseS + ' cells = ' + f1(R.house[0]) + ' x ' + f1(R.house[1]) + ' m, median of ' + houses.length);
  ok('C5 the houses a hectare are a real tract', inR(R.perHa, REAL.perHa), cells.perBlock + ' a block of ' + f1(blockHa(OM.CELL_M)) + ' ha = ' + f1(R.perHa) + ' a hectare');
  const at18 = tests(read(COMBAT2_M)).filter(Boolean).length, at3 = tests(read(384 / M.FN)).filter(Boolean).length;
  ok('C6 not vacuous: read at 1.8 m a cell (230 m a block) at least four of the five fail', 5 - at18 >= 4,
     'at 1.8 m: ' + (5 - at18) + ' of 5 fail (a lane ' + f1(cells.lane * 1.8) + ' m, a house ' + f1(cells.houseL * 1.8) + ' m); at 3.0 m (384 m drawn): ' + (5 - at3) + ' of 5 fail');
});

section('E. the dead number is in no live file', () => {
  const hits = [];
  const walk = dir => {
    for (const f of fs.readdirSync(P(dir))) {
      const p = path.join(dir, f);
      if (!/\.(js|json|html)$/.test(f)) continue;
      const s = read(p);
      const re = /230\s*m(?:etres|eters)?\s*(?:a|per|each)\s*(?:map\s*)?block|metresPerBlock\W{1,4}230\b/gi;
      if (re.test(s)) hits.push(p);
    }
  };
  walk('engine'); walk('slices');
  ok('E1 no engine/ or slices/ file says a block is 230 m', hits.length === 0, hits.length ? hits.join(', ') : 'none');
});

/* ============================================================================
   F. ONE NUMBER FOR A BLOCK  (WORLD, 10/18, row [the block size settled]; the
   coordinator, from COMBAT TWO's flag: 'the map, the fight boards and the
   travel times all read the block's size; two numbers means two of them are
   wrong'. Record: records/BOHEMIA_WORLD_ONE_NUMBER_FOR_A_BLOCK_10_18_26.md)

   THE ONE NUMBER is A to D above, read out of two files and never typed here:
   the region file (384 m of ground a block, the travel clock) and the overmap
   (0.75 m a fine cell, 128 cells a block, so 96 m of drawing).

   THE CARRIERS. Every live file that DECLARES one of these quantities (a
   const/let/var, a property, a JSON key, a Python assignment; comments out,
   because the canon registry learned that PROSE NUMBERS ARE SUBJECT-BLIND) is
   listed below with its owner.
     - A listed carrier that agrees and then drifts is RED.
     - A carrier that already disagrees is OWED: its own wrong value is pinned,
       so it can only be fixed (a NOTE says take it off the list), never moved
       to a third number.
     - A declaration nobody listed that disagrees is RED; one that agrees is a
       NOTE (list it).
   PLUS three carriers that are not one declaration (the canon registry's rows,
   the VOTE tab's words, RUN's fallback towns) and two structural facts: the
   CITY frame's old parametric road (a lane 2 cells, 1.5 m) is reached by no
   road on the game's seed, and the 7/16 block generator (LANE_W 2) is loaded
   by none of the three live pages.
   ========================================================================== */
const ONE = (() => {
  const ck = REGION.scale.clock, cellM = OM.CELL_M, cells = OM.TILE_FINE, minCell = ck.minPerFineCell, minBlock = minCell * cells;
  return { real: REGION.metresPerCell, drawn: cellM * cells, cellM, cells, minCell, minBlock, secCell: minCell * 60,
           mpm: cellM / minCell, bpdRoad: ck.minutesADay / (minBlock * ck.roadFactor), bpdOpen: ck.minutesADay / minBlock,
           valleyKm2: Math.pow(OM.OVER_N * cellM * cells / 1000, 2) };
})();
const QNAME = { real: 'metres of ground a block', drawn: 'metres drawn a block', cellM: 'metres a fine cell', cells: 'fine cells a block',
  minCell: 'minutes a fine cell', minBlock: 'minutes an open block', secCell: 'seconds a fine cell', mpm: 'drawn metres a minute',
  bpdRoad: 'road blocks a day', bpdOpen: 'open blocks a day', valleyKm2: 'drawn valley km2', lane: 'cells a lane (a real lane with its line at CELL_M)' };
/* which quantity each declared name can mean; a name with two means two subjects (TILE_M is a block in the
   overmap and a fine tile on the 7/27 lab page), and a value matching either is that subject */
const QOF = {
  METRES_PER_BLOCK: ['real'], METERS_PER_BLOCK: ['real'], metresPerBlock: ['real'], metersPerBlock: ['real'], metres_per_block: ['real'],
  metresPerCell: ['real'], metresReal: ['real'], world_block_m: ['real'], metresDrawn: ['drawn'],
  BLOCK_M: ['real', 'drawn'], BLOCK_METRES: ['real', 'drawn'], block_m: ['real', 'drawn'], blockM: ['real', 'drawn'], blockMetres: ['real', 'drawn'],
  CELL_M: ['cellM'], M_FINE: ['cellM'], fine_cell_m: ['cellM'], TILE_M: ['drawn', 'cellM'], TILE_FINE: ['cells'], fineCellsPerBlock: ['cells'],
  MIN_PER_CELL: ['minCell'], minPerFineCell: ['minCell'], minutesOpenBlock: ['minBlock'], METRES_PER_MINUTE: ['mpm'], metresPerMinute: ['mpm'],
  blocks_per_day_road: ['bpdRoad'], blocksPerDayRoad: ['bpdRoad'], blocks_per_day_open: ['bpdOpen'], blocksPerDayOpen: ['bpdOpen'],
  SECONDS_PER_STEP: ['secCell'], LANE_W: ['lane']
};
/* the cook tools reuse CELL_M, TILE_M and LANE_W for other grids (a house tile, a sprite cell), so tools/ is swept
   for the names that can only mean the map block or its clock */
const TOOL_NAMES = ['METRES_PER_BLOCK', 'METERS_PER_BLOCK', 'metresPerBlock', 'metersPerBlock', 'metres_per_block', 'world_block_m',
  'BLOCK_METRES', 'block_m', 'blockMetres', 'M_FINE', 'fine_cell_m', 'MIN_PER_CELL', 'minPerFineCell',
  'blocks_per_day_road', 'blocks_per_day_open', 'blocksPerDayRoad', 'blocksPerDayOpen'];
const SWEEP = [['engine', true, null], ['slices', true, null], ['banks', false, null], ['mods', true, null],
               ['reference/art_bank/fight_board', false, null], ['tools', true, TOOL_NAMES]];
const agreesQ = (q, v) => q === 'lane' ? inR((v + 1) * OM.CELL_M, REAL.lane) : Math.abs(v - ONE[q]) <= 0.01 * Math.abs(ONE[q]);
const agrees = (id, v) => (QOF[id] || []).some(q => agreesQ(q, v));
const declRe = names => new RegExp('(?:\\b(?:const|let|var)\\s+|[,{.(]\\s*|^[ \\t]*)["\']?(' + names.join('|') +
  ')["\']?\\s*(?::|=(?!=))\\s*(-?\\d+(?:\\.\\d+)?)(?![\\d.])', 'gm');
const stripComments = (f, t) => /\.json$/.test(f) ? t
  : /\.py$/.test(f) ? t.replace(/(^|[^'"])#[^\n]*/g, '$1 ')
  : t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:"'\\])\/\/[^\n]*/g, '$1 ');

/* every listed carrier: file, the declared name, its owner, and (only when it already disagrees) the pinned wrong value */
const CARRIERS = [
  ['engine/BOHEMIA_REGION_LAND.json', ['metresPerCell', 'metresReal', 'metresDrawn', 'minPerFineCell', 'fineCellsPerBlock', 'minutesOpenBlock'], 'WORLD (the source)'],
  ['engine/bohemia_overmap.js', ['TILE_FINE', 'CELL_M'], 'the overmap (the source)'],
  ['engine/bohemia_lattice.js', ['CELL_M'], 'LIFE+CITY'],
  ['engine/bohemia_reach.js', ['METRES_PER_BLOCK', 'METRES_PER_MINUTE'], 'QUESTS (9/7 module)'],
  ['slices/BOHEMIA_CITY_WORLD.html', ['TILE_FINE', 'CELL_M', 'MIN_PER_CELL', 'METRES_PER_BLOCK', 'METRES_PER_MINUTE'], 'RUN (the CITY frame the demo opens)'],
  ['slices/BOHEMIA_CITY_WORLD.html', ['LANE_W'], 'RUN', 2, 'the parametric road kept as a fallback: no road on the seed reaches it (F3)'],
  ['slices/bohemia_region.js', ['metresPerBlock'], 'RUN'],
  ['slices/BOHEMIA_CITY_CURRENT.html', ['TILE_FINE', 'CELL_M'], 'RUN (the alpha\'s CITY tab)'],
  ['slices/BOHEMIA_CURRENT_SLICE.html', ['TILE_FINE', 'CELL_M'], 'RUN (the alpha\'s SLICE tab)'],
  ['slices/BOHEMIA_CURRENT_SLICE.html', ['LANE_W'], 'RUN', 2, 'the July street painter in the alpha\'s SLICE tab: a lane 1.5 m'],
  ['slices/BOHEMIA_MAP_CURRENT.html', ['TILE_FINE', 'CELL_M'], 'RUN (the alpha\'s MAP tab)'],
  ['slices/BOHEMIA_MAP_CURRENT.html', ['LANE_W'], 'RUN', 2, 'the July street painter in the alpha\'s MAP tab: a lane 1.5 m'],
  ['slices/BOHEMIA_ENTER_SLICE_7_18_26.html', ['TILE_FINE', 'CELL_M'], 'an old July page'],
  ['slices/BOHEMIA_ENTER_SLICE_7_18_26.html', ['LANE_W'], 'an old July page', 2, 'a lane 1.5 m'],
  ['slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html', ['TILE_FINE', 'CELL_M'], 'an old July judge page'],
  ['slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html', ['LANE_W'], 'an old July judge page', 2, 'a lane 1.5 m'],
  ['slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html', ['TILE_M'], 'the retired LAB (TILE_M is a fine tile there)'],
  ['engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js', ['LANE_W'], 'the 7/16 engine', 2, 'the root of 230 m; no live page loads it (F4)'],
  ['engine/bohemia_blockgen.js', ['LANE_W'], 'the 7/16 engine', 2, 'no live page loads it (F4)'],
  ['engine/bohemia_engine_graphics_7_14_26.js', ['LANE_W'], 'the 7/14 engine', 2, 'no live page loads it (F4)'],
  ['banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json', ['blocks_per_day_open'], 'FACTIONS'],
  ['banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json', ['blocks_per_day_road'], 'FACTIONS', 260, '496 blocks over RUN\'s rounded 1.9 days (10/16); the clock is 1,440 / 5.376'],
  ['tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py', ['world_block_m'], 'COMBAT TWO'],
  ['tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py', ['M_FINE'], 'COMBAT TWO', 1.8, 'read off LANE_W 2, before THE ONE RULER'],
  ['reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json', ['world_block_m'], 'COMBAT TWO'],
  ['reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json', ['fine_cell_m'], 'COMBAT TWO', 1.8, 'the board manifest\'s ruler'],
  ['reference/art_bank/fight_board/COMBAT2_CUT_FROM_THE_MAP_10_18.json', ['block_m'], 'COMBAT TWO', 230, 'the board manifest\'s ruler: the large board is 2.4 x 1.8 blocks of drawing, not one block']
].map(([file, ids, owner, owed, why]) => ({ file, ids, owner, owed, why }));
/* the VOTE tab items whose words still say a block is 230 m or a cell 1.8 m (owed; a new one is red) */
const VOTE_OWED = ['combat2-the-board-cut-from-the-map-10-18'];
/* RUN's twelve hand-placed fallback towns (used only when the region file fails to load): how many sit more than
   15 percent off 384 m a block against their real kilometres (owed; it may shrink, never grow) */
const TOWNS_OWED = 8;
/* the canon registry rows that carry a block's size or its clock */
const CANON_Q = { METRES_PER_TILE: 'cellM', TILES_PER_CELL_SIDE: 'cells', METRES_PER_BLOCK_REAL: 'real', METRES_PER_BLOCK_DRAWN: 'drawn',
                  MINUTES_PER_FINE_CELL: 'minCell', SECONDS_PER_STEP: 'secCell', VALLEY_KM2: 'valleyKm2' };

const DISK_FOUND = {}, ROAD_KINDS = {};   /* a mutation re-reads only the files it changes */
function carriersCheck(over) {
  over = over || {};
  const has = f => (f in over) ? over[f] !== null : fs.existsSync(P(f));
  const src = f => (f in over) ? over[f] : read(f);
  const R = { red: [], owedStill: [], fixed: [], newAgree: [], listed: 0, decls: 0, files: 0 };
  const red = (cat, msg) => R.red.push({ cat, msg });
  /* 1. sweep every live folder for declarations */
  const found = {};      /* file -> id -> [values] */
  const visit = (f, names) => {
    if (!/\.(js|json|html|py)$/.test(f) || !has(f)) return;
    let got = !(f in over) ? DISK_FOUND[f] : undefined;
    if (got === undefined) {
      got = null;
      if ((f in over) || fs.statSync(P(f)).size <= 8e6) {
        const t = stripComments(f, src(f)), re = declRe(names); let m;
        while ((m = re.exec(t))) { ((got = got || {})[m[1]] = got[m[1]] || []).push(+m[2]); }
      }
      if (!(f in over)) DISK_FOUND[f] = got;
    }
    if (got) { found[f] = got; for (const k in got) R.decls += got[k].length; }
  };
  const walkDir = (d, deep, names) => {
    if (!fs.existsSync(P(d))) return;
    for (const e of fs.readdirSync(P(d), { withFileTypes: true })) {
      const f = d + '/' + e.name;
      if (e.isDirectory()) { if (deep) walkDir(f, deep, names); continue; }
      R.files++; visit(f, names);
    }
  };
  for (const [d, deep, names] of SWEEP) walkDir(d, deep, names || Object.keys(QOF));
  /* a file that exists only in a mutation is visited too */
  for (const f of Object.keys(over)) if (over[f] !== null && !fs.existsSync(P(f))) { R.files++; visit(f, f.startsWith('tools/') ? TOOL_NAMES : Object.keys(QOF)); }
  /* 2. every listed carrier against the one number */
  const covered = new Set();
  for (const c of CARRIERS) for (const id of c.ids) {
    covered.add(c.file + '|' + id);
    const vals = (found[c.file] || {})[id] || [];
    if (!vals.length) { R.fixed.push(c.file + ' ' + id + ': no longer declared'); continue; }
    R.listed++;
    for (const v of vals) {
      if (agrees(id, v)) { if (c.owed !== undefined) R.fixed.push(c.file + ' ' + id + ' = ' + v + ' now agrees (' + c.owner + '): take it off the owed list'); }
      else if (c.owed !== undefined && v === c.owed) R.owedStill.push(c.file + ' ' + id + ' = ' + v + ' (' + c.owner + '; ' + c.why + ')');
      else red('listed', c.file + ' ' + id + ' = ' + v + ' against the one ' + QOF[id].map(q => QNAME[q] + ' ' + (q === 'lane' ? '4 or 5' : f1(ONE[q]))).join(' or ') + (c.owed !== undefined ? ' (owed at ' + c.owed + ', moved to a third number)' : ' (' + c.owner + ')'));
    }
  }
  /* 3. declarations nobody listed */
  for (const f of Object.keys(found)) for (const id of Object.keys(found[f])) {
    if (covered.has(f + '|' + id)) continue;
    for (const v of found[f][id]) {
      if (agrees(id, v)) R.newAgree.push(f + ' ' + id + ' = ' + v);
      else red('unlisted', f + ' ' + id + ' = ' + v + ': an unlisted carrier of another number (' + QOF[id].map(q => QNAME[q]).join(' or ') + ')');
    }
  }
  /* 4. the canon registry's rows */
  const reg = has('records/BOHEMIA_CANON_CONSTANTS.md') ? src('records/BOHEMIA_CANON_CONSTANTS.md') : '';
  const block = (reg.match(/```constants([\s\S]*?)```/) || [, ''])[1];
  R.canon = [];
  for (const line of block.split('\n')) {
    const [k, v] = line.split('|').map(s => s.trim()); const q = CANON_Q[k]; if (!q) continue;
    const ok5 = q === 'valleyKm2' ? Math.abs(+v - ONE[q]) <= 0.05 * ONE[q] : agreesQ(q, +v);
    R.canon.push(k + ' ' + v); if (!ok5) red('canon', 'records/BOHEMIA_CANON_CONSTANTS.md ' + k + ' = ' + v + ' against the one ' + QNAME[q] + ' ' + f1(ONE[q]));
  }
  for (const k of ['METRES_PER_BLOCK_REAL', 'METRES_PER_BLOCK_DRAWN', 'MINUTES_PER_FINE_CELL'])
    if (!R.canon.some(r => r.startsWith(k + ' '))) red('canon', 'records/BOHEMIA_CANON_CONSTANTS.md declares no ' + k);
  /* 5. the VOTE tab's words */
  R.vote = [];
  if (has('records/target/BOHEMIA_VOTE_REGISTRY.json')) {
    const V = JSON.parse(src('records/target/BOHEMIA_VOTE_REGISTRY.json'));
    for (const it of (V.items || V)) {
      const s = JSON.stringify(it); let says = false;
      for (const m of s.matchAll(/\b(230|1\.8) ?m\b/g)) if (/block|cell/i.test(s.slice(Math.max(0, m.index - 80), m.index + 80))) says = true;
      if (!says) continue;
      R.vote.push(it.id);
      if (VOTE_OWED.indexOf(it.id) < 0) red('vote', 'the VOTE tab item ' + it.id + ' says a block is 230 m or a cell 1.8 m');
    }
    for (const id of VOTE_OWED) if (R.vote.indexOf(id) < 0) R.fixed.push('the VOTE tab item ' + id + ' no longer says 230 m: take it off the owed list');
  }
  /* 6. RUN's fallback towns */
  if (has('slices/bohemia_region.js')) {
    const reg2 = src('slices/bohemia_region.js'), byName = {};
    REGION.places.concat(REGION.inValley || []).forEach(p => byName[p.name] = p);
    const T = [...reg2.matchAll(/\['([A-Z .]+)',\s*(-?\d+),\s*(-?\d+),/g)].map(m => [m[1].trim(), +m[2], +m[3]]).filter(t => byName[t[0]]);
    const off = T.filter(t => Math.abs(byName[t[0]].km * 1000 / Math.hypot(t[1], t[2]) - ONE.real) > 0.15 * ONE.real);
    R.towns = { of: T.length, off: off.length, names: off.map(t => t[0] + ' ' + Math.round(byName[t[0]].km * 1000 / Math.hypot(t[1], t[2])) + ' m') };
    if (off.length > TOWNS_OWED) red('towns', 'slices/bohemia_region.js: ' + off.length + ' fallback towns off 384 m a block, owed at ' + TOWNS_OWED + ' (may shrink, never grow)');
    else if (off.length < TOWNS_OWED) R.fixed.push('slices/bohemia_region.js: ' + off.length + ' fallback towns off, was ' + TOWNS_OWED + ': lower TOWNS_OWED');
  }
  /* 7. the CITY frame: every road kind on the game's seed draws from its own kit, so the 2-cell lane is never painted */
  const frameSrc = src('slices/BOHEMIA_CITY_WORLD.html');
  const kitRoad = (frameSrc.match(/const KIT_ROAD=\{([^}]*)\}/) || [, ''])[1].split(',').map(s => s.split(':')[0].trim()).filter(Boolean);
  const rd = (frameSrc.match(/const RD=\{([^}]*)\}/) || [, ''])[1].split(',').map(s => s.split(':')[0].trim()).filter(Boolean);
  const sd = typeof seed === 'number' ? seed : 2691674296;
  if (!ROAD_KINDS[sd]) { ROAD_KINDS[sd] = {}; for (const t of OM.buildOvermap(sd).tiles) ROAD_KINDS[sd][t.district] = (ROAD_KINDS[sd][t.district] || 0) + 1; }
  const kinds = {}; for (const k of rd) if (ROAD_KINDS[sd][k]) kinds[k] = ROAD_KINDS[sd][k];
  R.param = Object.keys(kinds).filter(k => kitRoad.indexOf(k) < 0);
  R.kinds = kinds; R.kitRoad = kitRoad;
  if (!rd.length || !kitRoad.length) red('reach', 'the CITY frame\'s RD or KIT_ROAD table did not read');
  if (R.param.length) red('reach', 'road kinds on the game\'s seed drawn by the 2-cell parametric lane (1.5 m): ' + R.param.map(k => k + ' x' + kinds[k]).join(', '));
  /* 8. the 7/16 block generator is loaded by none of the live pages */
  R.loads = [];
  for (const f of ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/BOHEMIA_CITY_WORLD.html']) {
    if (!has(f)) continue;
    const t = src(f);
    if (/src="[^"]*(bohemia_blockgen|BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26|bohemia_engine_graphics_7_14_26)[^"]*"|\bBOH_BLOCKGEN\b/.test(t)) R.loads.push(f);
  }
  if (R.loads.length) red('loads', 'a live page loads the 7/16 block generator (LANE_W 2): ' + R.loads.join(', '));
  return R;
}

section('F. one number for a block: every file that carries it', () => {
  say('the one number', 'a block is ' + ONE.real + ' m of ground and ' + ONE.drawn + ' m drawn; ' + ONE.cellM + ' m a fine cell, ' + ONE.cells +
      ' a block; ' + ONE.minCell + ' min a fine cell (' + ONE.secCell.toFixed(2) + ' s), ' + f1(ONE.minBlock) + ' an open block; ' +
      Math.round(ONE.bpdRoad) + ' road blocks a day, ' + Math.round(ONE.bpdOpen) + ' open');
  const R = carriersCheck();
  const reds = cat => R.red.filter(r => r.cat === cat).map(r => r.msg);
  ok('F1 every listed carrier still declares the one number, or its own pinned owed value', !reds('listed').length,
     reds('listed').join('; ') || R.listed + ' listed declarations in ' + CARRIERS.length + ' entries; ' + R.decls + ' declarations swept in ' + R.files + ' files');
  ok('F2 no unlisted file declares another number for a block, a cell or the clock', !reds('unlisted').length, reds('unlisted').join('; ') || 'none');
  ok('F3 every road kind on the game\'s seed draws from its own kit, so the CITY frame\'s 2-cell lane (1.5 m) is painted nowhere',
     !reds('reach').length, reds('reach').join('; ') || Object.keys(R.kinds).map(k => k + ' ' + R.kinds[k]).join(', ') + '; kit roads: ' + R.kitRoad.join(', '));
  ok('F4 no live page (the alpha, the demo, the CITY frame) loads the 7/16 block generator', !reds('loads').length, R.loads.join(', ') || 'none');
  ok('F5 the canon registry declares the block\'s two sizes and the clock, and every row agrees', !reds('canon').length, reds('canon').join('; ') || R.canon.join(', '));
  ok('F6 no VOTE tab item but the owed one says a block is 230 m or a cell 1.8 m', !reds('vote').length, (R.vote.join(', ') || 'none') + ' (owed: ' + VOTE_OWED.join(', ') + ')');
  ok('F7 RUN\'s fallback towns do not drift further off the one number', !reds('towns').length,
     R.towns ? R.towns.off + ' of ' + R.towns.of + ' off by over 15%, owed at ' + TOWNS_OWED + ': ' + R.towns.names.join(', ') : 'no list');
  for (const o of R.owedStill) say('OWED', o);
  for (const o of R.fixed) say('FIXED', o);
  for (const o of R.newAgree) say('a new carrier that agrees: list it', o);

  /* mutations, in memory: each must go red, and the fix must not */
  const mut = (name, over, wantRed) => { const M = carriersCheck(over);
    ok(name, wantRed ? M.red.length > 0 : M.red.length === 0, M.red.length ? M.red[0].msg : (M.fixed.find(x => /now agrees|lower|off the owed/.test(x)) || M.newAgree[0] || 'no red')); };
  const sub = (f, a, b) => { const t = read(f); if (t.indexOf(a) < 0) throw new Error('mutation anchor gone in ' + f + ': ' + a); return t.replace(a, b); };
  mut('FM1 a listed carrier drifts: the reach module says 230 m a block', { 'engine/bohemia_reach.js': sub('engine/bohemia_reach.js', 'METRES_PER_BLOCK  = 384', 'METRES_PER_BLOCK  = 230') }, true);
  mut('FM2 an owed carrier moves to a third number: FACTIONS 250 road blocks a day', { 'banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json': sub('banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json', '"blocks_per_day_road": 260', '"blocks_per_day_road": 250') }, true);
  mut('FM3 the fix is never blocked: FACTIONS 268 road blocks a day passes', { 'banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json': sub('banks/BOHEMIA_FACTIONS_THE_SIGHT_NUMBERS_10_18_26.json', '"blocks_per_day_road": 260', '"blocks_per_day_road": 268') }, false);
  mut('FM4 an unlisted file declares a block of 230 m', { 'engine/__the_one_ruler_mutation.js': 'var metresPerBlock = 230;\n' }, true);
  mut('FM5 an unlisted file that agrees is a note, not a red', { 'engine/__the_one_ruler_mutation.js': 'const CELL_M = 0.75, TILE_FINE = 128;\n' }, false);
  mut('FM6 a road kind drawn by the 2-cell lane: freeway off the kit list', { 'slices/BOHEMIA_CITY_WORLD.html': sub('slices/BOHEMIA_CITY_WORLD.html', 'const KIT_ROAD={strip:1,arterial:1,freeway:1,', 'const KIT_ROAD={strip:1,arterial:1,') }, true);
  mut('FM7 the canon registry brings back the dead step, 3.52 s', { 'records/BOHEMIA_CANON_CONSTANTS.md': sub('records/BOHEMIA_CANON_CONSTANTS.md', 'GENERATIONS | 3 |', 'SECONDS_PER_STEP | 3.52 | x | x\nGENERATIONS | 3 |') }, true);
  mut('FM8 a cook tool reads a fine cell as 1.8 m', { 'tools/__the_one_ruler_mutation.py': 'M_FINE = 1.8\n' }, true);
});

console.log('\n' + (fail ? 'THE ONE RULER: RED' : 'THE ONE RULER: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
