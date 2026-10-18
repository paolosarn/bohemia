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

console.log('\n' + (fail ? 'THE ONE RULER: RED' : 'THE ONE RULER: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
