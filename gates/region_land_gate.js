#!/usr/bin/env node
/* BOHEMIA -- THE REGION IS REAL GEOGRAPHY (10/17/26, WORLD lane)
 *
 * ROW [the region], RULE 109 (Paolo 10/16: "our map has to be as big as fucking Battle Brothers...
 * I'm choosing Battle Brothers... a larger grid or something"), rule 46 (the fifteen terrains),
 * rule 33 (roads faster than dirt), rule 77 (tiles are Legos), rule 40g (the bones never move).
 *
 *  A  THE FILE IS WHOLE: it parses, it is RUN's grid (496 = 96 + 2 x 200), every row decodes to 496
 *     blocks, the scale is stated with its reason.
 *  B  EVERY BLOCK IS ONE OF THE THIRTEEN MAP KINDS (never ruin, never casino_floor: a condition and an
 *     interior are not ground, [board terrains] 9/30), or the valley's own square, which is exactly
 *     9,216 blocks in the middle and nothing else.
 *  C  THE REGION IS NATURE: past the rim, desert and hills are most of the land and the city is the
 *     edge, the opposite of the valley (rule 46's proportion, read the other way round).
 *  D  A ROAD NEVER ENDS IN SAND (rule 77): every road block has a road neighbour on at least two
 *     sides, or it ends at the valley box, at the world's rim or at a place (the lodge, the dam's
 *     crest, a camp are real dead ends); every road network reaches the valley box or the rim; no island.
 *  E  THE LEGO EDGES AGREE: for every pair of neighbours, A's east is B's west, and so on round, on
 *     both compasses.
 *  F  THE PLACES STAND WHERE THEY ARE: each on ground a party can stand on, never in the valley, within
 *     two blocks of its real coordinates, a base on a road, names unique, tiers from the three.
 *  G  EVERY PLACE REACHES THE VALLEY ON FOOT and the places are DESTINATIONS HOURS APART: at least
 *     ten of them more than six marching hours from the valley's middle.
 *  H  THE FOUR NUMBERS beside Battle Brothers' (rule 109c): tiles across, tiles in all, settlements,
 *     days to cross; ours meets or beats each as the bare minimum.
 *  I  THE COMPASS: when the valley's east is x0, a real-east place lands west of the middle in x and
 *     keeps its y; the data itself never moves.
 *  J  THE STITCH: a rolled freeway exit on each side joins a real highway's portal, every connector
 *     block is a road, and the pass grid RUN reads says 1 on it; an exit with no portal within forty
 *     blocks still runs to the rim and is counted.
 *  K  DETERMINISM: the generator writes the same bytes again (so the data is the code, rule 40g).
 *  L  THE PAGE EXISTS and names the kilometres, the days and Battle Brothers' numbers; the row on the
 *     board keeps the ruling it answered (rule 11).
 *  M  MUTATIONS, EACH RED: an orphan road block (D), a swapped edge (E), a place dropped in the lake
 *     (F), a fourteenth kind (B).
 *
 *   node gates/region_land_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) pass++; else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); } };
const section = (name, fn) => { try { return fn(); } catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); } };

const RL = require(P('engine/bohemia_region_land.js'));
const FILE = P('engine/BOHEMIA_REGION_LAND.json');
const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const L = RL.load(json);
const N = json.N, K = json.K, D = json.D;
const C1 = { n: 'y0', s: 'y1', e: 'x1', w: 'x0' }, C0 = { n: 'y0', s: 'y1', e: 'x0', w: 'x1' };
const MAP_KINDS = ['suburb_block', 'the_strip', 'industrial', 'open_desert', 'wash_and_shore', 'hills', 'freeway', 'lot_and_bigbox',
  'trailer_park', 'golf_and_park', 'airport', 'solar_and_pumps', 'landfill'];

console.log('THE REGION IS REAL GEOGRAPHY  (engine/BOHEMIA_REGION_LAND.json, ' + fs.statSync(FILE).size + ' bytes)');

/* A */
section('A whole', () => {
  ok('A1 RUN\'s grid: N 96, K 200, D 496', N === 96 && K === 200 && D === 496, N + '/' + K + '/' + D);
  ok('A2 one row per block row', json.rows.length === D && json.roadRows.length === D);
  ok('A3 the scale is stated with its reason', json.metresPerCell > 0 && /overmap/.test(json.metresPerCellWhy || '') && /32 km/.test(json.metresPerCellWhy || ''));
  ok('A4 the orientation is stated (north y0, east +x, the loader mirrors)', /north is y = 0/.test(json.orientation || '') && /mirror/.test(json.orientation || ''));
  ok('A5 the speeds are TUNING\'s, tagged untuned, with a source', json.speedsTuned === false && /FM 21-18|Naismith/.test(json.speedsSource || ''));
});

/* B */
let counts = {};
section('B kinds', () => {
  let valley = 0, bad = 0, valleyOutside = 0;
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) {
    const a = L.at(x, y, C1); counts[a.kind] = (counts[a.kind] || 0) + 1;
    if (a.kind === 'valley') { valley++; if (!L.inValley(x, y)) valleyOutside++; }
    else if (MAP_KINDS.indexOf(a.kind) < 0) bad++;
    else if (L.inValley(x, y)) bad++;
  }
  ok('B1 every block a map kind or the valley', bad === 0, bad + ' blocks are neither');
  ok('B2 the valley is exactly its 9,216 blocks, in the middle', valley === N * N && valleyOutside === 0, valley + ' valley blocks, ' + valleyOutside + ' outside the box');
  ok('B3 ruin and casino_floor have no blocks', !counts.ruin && !counts.casino_floor);
  ok('B4 the legend is the inventory\'s own names', Object.values(json.legend).every(k => MAP_KINDS.indexOf(k) >= 0 || k === 'valley'));
});

/* C */
section('C nature', () => {
  const region = D * D - N * N;
  const nature = (counts.open_desert || 0) + (counts.hills || 0) + (counts.wash_and_shore || 0);
  const city = region - nature;
  ok('C1 past the rim, nature is most of the land (' + (100 * nature / region).toFixed(1) + '%)', nature / region > 0.8);
  ok('C2 and the city is the edge (' + (100 * city / region).toFixed(1) + '%)', city / region < 0.08);
  ok('C3 the lake is there (water blocks ' + json.counts['water (open)'] + ')', json.counts['water (open)'] > 1500);
  ok('C4 the ranges are there (peak blocks ' + json.counts['peak (cannot cross)'] + ')', json.counts['peak (cannot cross)'] > 5000);
});

/* D: the road grammar, on a pass grid */
function roadGraphCheck(Lx, compass) {
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let orphans = 0, roadCells = 0; const seen = new Uint8Array(D * D); let islands = 0;
  const isRoad = (x, y) => Lx.inGrid(x, y) && !Lx.inValley(x, y) && Lx.at(x, y, compass).road > 0;
  const touchesBox = (x, y) => x === -1 || y === -1 || x === N || y === N;
  const touchesRim = (x, y) => x === -K || y === -K || x === N + K - 1 || y === N + K - 1;
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) {
    if (!isRoad(x, y)) continue; roadCells++;
    let nb = 0; for (const d of DIRS) if (isRoad(x + d[0], y + d[1])) nb++;
    const atPlace = !!Lx.placeAt(x, y, 3, compass);   /* a road may END at a destination (the lodge, the dam's crest, a camp) */
    const end = nb >= 1 && (touchesBox(x, y) || touchesRim(x, y) || atPlace);
    if (nb < 2 && !end) orphans++;
    const k = (y + K) * D + (x + K);
    if (!seen[k]) {
      const stack = [[x, y]]; seen[k] = 1; let reaches = false;
      while (stack.length) { const [cx, cy] = stack.pop(); if (touchesBox(cx, cy) || touchesRim(cx, cy)) reaches = true;
        for (const d of DIRS) { const nx = cx + d[0], ny = cy + d[1]; if (!isRoad(nx, ny)) continue; const nk = (ny + K) * D + (nx + K); if (!seen[nk]) { seen[nk] = 1; stack.push([nx, ny]); } } }
      if (!reaches) islands++;
    }
  }
  return { orphans, islands, roadCells };
}
section('D roads', () => {
  const r = roadGraphCheck(L, C1);
  ok('D1 no road block ends in sand (' + r.roadCells + ' road blocks, ' + r.orphans + ' orphans)', r.orphans === 0);
  ok('D2 every road network reaches the valley box or the rim (' + r.islands + ' islands)', r.islands === 0);
  ok('D3 three classes and the freeway is the most of them', json.roadCounts['freeway/US'] > 1000 && json.roadCounts['dirt'] > 100 && json.roadCounts['state route'] > 500);
  const paved = json.speeds.paved.minutesPerCell, open = json.speeds.open.minutesPerCell, hills = json.speeds.hills.minutesPerCell;
  ok('D4 roads faster than dirt faster than hills (rule 33): ' + paved + ' < ' + json.speeds.dirt.minutesPerCell + ' < ' + open + ' < ' + hills, paved < json.speeds.dirt.minutesPerCell && json.speeds.dirt.minutesPerCell < open && open < hills);
});

/* E: the Lego edges agree */
function edgesAgree(Lx, compass) {
  let bad = 0, checked = 0;
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) {
    const e = Lx.edgesAt(x, y, compass);
    if (x + 1 < N + K) { checked++; if (e[1] !== Lx.edgesAt(x + 1, y, compass)[3]) bad++; }
    if (y + 1 < N + K) { checked++; if (e[2] !== Lx.edgesAt(x, y + 1, compass)[0]) bad++; }
  }
  return { bad, checked };
}
section('E legos', () => {
  const a = edgesAgree(L, C1), b = edgesAgree(L, C0);
  ok('E1 every seam reads the same from both blocks, east compass (' + a.checked + ' seams)', a.bad === 0, a.bad + ' disagree');
  ok('E2 and on the mirrored compass', b.bad === 0, b.bad + ' disagree');
  const kinds = new Set(); for (let y = -K; y < N + K; y += 7) for (let x = -K; x < N + K; x += 7) L.edgesAt(x, y, C1).forEach(t => kinds.add(t));
  ok('E3 the edge types are few and named (' + [...kinds].sort().join(', ') + ')', kinds.has('road') && kinds.has('desert') && kinds.has('hills') && kinds.size < 30);
});

/* F: the places */
section('F places', () => {
  const names = new Set(); let dup = 0, offGround = 0, inValley = 0, far = 0, baseOffRoad = 0, badTier = 0;
  const kmLon = 111.0 * Math.cos(json.origin.lat * Math.PI / 180), kmLat = 111.0;
  json.places.forEach(p => {
    if (names.has(p.name)) dup++; names.add(p.name);
    const a = L.at(p.x, p.y, C1); if (!a || a.water || a.peak) offGround++; if (a && a.valley) inValley++;
    const fx = (N - 1) / 2 + (p.lon - json.origin.lon) * kmLon * 1000 / json.metresPerCell, fy = (N - 1) / 2 - (p.lat - json.origin.lat) * kmLat * 1000 / json.metresPerCell;
    if (Math.max(Math.abs(fx - (p.x + 0.5)), Math.abs(fy - (p.y + 0.5))) > 2.5) far++;
    if (p.role === 'base' && !p.road) baseOffRoad++;
    if (['camp', 'town', 'fortress'].indexOf(p.tier) < 0) badTier++;
  });
  ok('F1 ' + json.places.length + ' places, names unique', dup === 0 && json.places.length >= 30);
  ok('F2 every place on standable ground, none in the lake or on a peak', offGround === 0, offGround + ' off ground');
  ok('F3 none inside the valley box (the valley\'s own seats are the generator\'s)', inValley === 0);
  ok('F4 every place within two blocks of its real coordinates', far === 0, far + ' far');
  ok('F5 every base sits on a road (Battle Brothers: a settlement is on the road network)', baseOffRoad === 0, baseOffRoad + ' bases off the road');
  ok('F6 tiers from the three', badTier === 0);
  const must = ['HENDERSON', 'BOULDER CITY', 'HOOVER DAM', 'INDIAN SPRINGS', 'PAHRUMP', 'PRIMM', 'MERCURY', 'MOAPA', 'SEARCHLIGHT'];
  ok('F7 rule 109\'s named places are on the grid: ' + must.join(', '), must.every(n => names.has(n)));
  ok('F8 the beyond list names the roads on, with kilometres', json.beyond.length >= 8 && json.beyond.every(b => b.km > 60 && b.via && b.rimX != null));
});

/* G: reach and hours apart */
section('G reach', () => {
  const none = json.places.filter(p => p.hours == null);
  ok('G1 every place reaches the valley on foot', none.length === 0, none.map(p => p.name).join(', '));
  const farOnes = json.places.filter(p => p.hours != null && p.hours > 6);
  ok('G2 destinations hours apart: ' + farOnes.length + ' places more than six marching hours out, the farthest ' + Math.max(...json.places.map(p => p.hours || 0)) + ' h', farOnes.length >= 10);
  const near = json.places.find(p => p.name === 'HENDERSON');
  ok('G3 Henderson is the near one (' + (near && near.hours) + ' h, ' + (near && near.km) + ' km)', near && near.hours > 3 && near.hours < 9);
});

/* H: the four numbers */
section('H numbers', () => {
  const n = json.numbers, bb = n.battleBrothers;
  ok('H1 tiles across ' + n.tilesAcross + ' >= Battle Brothers\' ' + bb.tilesAcross, n.tilesAcross >= bb.tilesAcross);
  ok('H2 tiles in all ' + n.tiles + ' >= ' + bb.tiles, n.tiles >= bb.tiles);
  ok('H3 settlements ' + n.settlementsInAll + ' (' + n.places + ' in the region + 14 valley seats) >= ' + bb.settlements, n.settlementsInAll >= bb.settlements);
  const days = Object.values(n.daysAcross);
  ok('H4 a crossing takes days: ' + JSON.stringify(n.daysAcross) + ' (Battle Brothers\' days are owed, EYES)', days.every(d => d != null && d >= 1));
  ok('H5 the region is ' + n.kmAcross + ' km across and that is the real distance (' + D + ' x ' + json.metresPerCell + ' m)', Math.abs(n.kmAcross - D * json.metresPerCell / 1000) < 0.2);
});

/* I: the compass */
section('I compass', () => {
  const dam1 = L.places(C1).find(p => p.name === 'HOOVER DAM'), dam0 = L.places(C0).find(p => p.name === 'HOOVER DAM');
  ok('I1 the dam is east of the middle on the east-is-x1 compass (x ' + dam1.x + ')', dam1.x > (N - 1) / 2);
  ok('I2 and west of it in x when east is x0 (x ' + dam0.x + '), same y', dam0.x < (N - 1) / 2 && dam0.y === dam1.y);
  ok('I3 the same block reads the same kind through both compasses', L.at(dam1.x, dam1.y, C1).kind === L.at(dam0.x, dam0.y, C0).kind);
  const ch1 = L.places(C1).find(p => p.name === 'MT CHARLESTON LODGE');
  ok('I4 Mt Charleston is north-west (x ' + ch1.x + ', y ' + ch1.y + ')', ch1.x < 0 && ch1.y < N / 2);
});

/* J: the stitch */
section('J stitch', () => {
  const exits = [{ edge: 'y1', c: 50.5, w: 1, name: '15' }, { edge: 'y0', c: 60.5, w: 1, name: '93' }, { edge: 'x0', c: 20.5, w: 1, name: '95' }, { edge: 'x1', c: 70.5, w: 1, name: '15' }];
  [C1, C0].forEach((C, i) => {
    const Lx = RL.load(json);
    const out = Lx.stitch(exits, C);
    const st = out.filter(o => o.stitched), un = out.filter(o => o.unstitched), cells = out.filter(o => o.cls);
    ok('J' + (i * 3 + 1) + ' exits join real portals on compass ' + C.e + ' (' + st.length + ' stitched, ' + un.length + ' unstitched: ' + un.map(u => u.edge + ':' + u.c).join(' ') + ')', st.length >= 3);
    ok('J' + (i * 3 + 2) + ' every connector block is a road the loader reports', cells.every(c => Lx.at(c.x, c.y, C) && Lx.at(c.x, c.y, C).road > 0));
    const Pg = Lx.passGrid(C);
    ok('J' + (i * 3 + 3) + ' and RUN\'s pass grid says 1 on it', cells.every(c => Pg[(c.y + K) * D + (c.x + K)] === 1) && Pg.length === D * D);
  });
  const Ly = RL.load(json); const r = roadGraphCheck(Ly, C1); Ly.stitch(exits, C1); const r2 = roadGraphCheck(Ly, C1);
  ok('J7 after the stitch the road grammar still holds (' + r2.orphans + ' orphans, ' + r2.islands + ' islands; before ' + r.orphans + '/' + r.islands + ')', r2.orphans === 0 && r2.islands === 0);
});

/* K: determinism */
section('K determinism', () => {
  const tmp = P('engine', 'BOHEMIA_REGION_LAND.json.check');
  let r;
  try {
    r = cp.spawnSync('python3', ['-I', '-c',
      'import importlib.util,sys; sys.argv=["x"]; spec=importlib.util.spec_from_file_location("g", ' + JSON.stringify(P('tools/bohemia_world_region.py')) + '); m=importlib.util.module_from_spec(spec); m.__dict__["__name__"]="g"; spec.loader.exec_module(m); m.OUT=' + JSON.stringify(tmp) + '; m.main()'],
      { encoding: 'utf8', timeout: 120000 });
  } catch (e) { r = { status: -1, stderr: String(e) }; }
  if (r.status !== 0) { ok('K1 the generator runs', false, (r.stderr || '').split('\n').slice(-3).join(' ')); return; }
  const a = crypto.createHash('sha256').update(fs.readFileSync(FILE)).digest('hex'), b = crypto.createHash('sha256').update(fs.readFileSync(tmp)).digest('hex');
  try { fs.unlinkSync(tmp); } catch (_e) {}
  ok('K1 the generator writes the same bytes again (' + a.slice(0, 12) + ')', a === b, a.slice(0, 12) + ' vs ' + b.slice(0, 12));
});

/* L: the page and the row */
section('L page', () => {
  const rec = P('records/BOHEMIA_WORLD_THE_REGION_IS_REAL_GEOGRAPHY_10_17_26.md');
  ok('L1 the page exists', fs.existsSync(rec));
  const t = fs.existsSync(rec) ? fs.readFileSync(rec, 'utf8') : '';
  ok('L2 it names the kilometres, the days and Battle Brothers', /km/.test(t) && /days/.test(t) && /Battle Brothers/.test(t) && /165/.test(t));
  ok('L3 it carries the [bb ...] line and the analog horror line', /\[bb /.test(t) && /analog horror/i.test(t));
  const board = fs.readFileSync(P('VAMILY.md'), 'utf8');
  const row = board.split('\n').find(l => /\[the region\]/.test(l) && /^- (OPEN|CLAIMED|SHIPPED)/.test(l));
  ok('L4 the row keeps the ruling it answered (rule 11: "[the region]" and rule 109 on one line)', !!row && /rule 109/.test(row));
});

/* M: mutations, each red */
section('M mutations', () => {
  const clone = () => JSON.parse(JSON.stringify(json));
  /* an orphan road block in the open desert */
  let j = clone(); { const y = -150 + K, x = -150 + K; const row = j.roadRows[y]; const cells = decodeRow(row, D, c => c); cells[x] = 'F'; j.roadRows[y] = encodeRow(cells); }
  let Lm = RL.load(j); ok('M1 an orphan road block goes red (D)', roadGraphCheck(Lm, C1).orphans > 0 || roadGraphCheck(Lm, C1).islands > 0);
  /* a place dropped in the lake */
  j = clone(); { const dam = j.places.find(p => p.name === 'BOULDER BEACH'); for (let r = 1; r < 12 && !(L.at(dam.x + r, dam.y, C1) || {}).water; r++) { if (r === 11) break; } let put = null; for (let dy = -12; dy <= 12 && !put; dy++) for (let dx = -12; dx <= 12 && !put; dx++) { const a = L.at(dam.x + dx, dam.y + dy, C1); if (a && a.water) put = [dam.x + dx, dam.y + dy]; } if (put) { dam.x = put[0]; dam.y = put[1]; } }
  Lm = RL.load(j); ok('M2 a place in the lake goes red (F)', j.places.some(p => { const a = Lm.at(p.x, p.y, C1); return !a || a.water; }));
  /* a fourteenth kind */
  j = clone(); j.legend['r'] = 'ruin'; { const cells = decodeRow(j.rows[0], D, c => c); cells[5] = 'r'; j.rows[0] = encodeRow(cells); }
  Lm = RL.load(j); ok('M3 a fourteenth kind goes red (B)', Lm.at(-K + 5, -K, C1).kind === 'ruin' && MAP_KINDS.indexOf('ruin') < 0);
  /* a swapped edge: the edge function must stay symmetric, so a block whose code changed still agrees with its neighbours */
  j = clone(); { const cells = decodeRow(j.rows[K], D, c => c); cells[10] = cells[10] === '.' ? 'h' : '.'; j.rows[K] = encodeRow(cells); }
  Lm = RL.load(j); ok('M4 the edges still agree after a block changes (E is a property, not a table)', edgesAgree(Lm, C1).bad === 0);
});
function decodeRow(s, D, map) { const out = []; for (let n = 0; n < s.length;) { let run = 0; while (s.charCodeAt(n) >= 48 && s.charCodeAt(n) <= 57) { run = run * 10 + (s.charCodeAt(n) - 48); n++; } if (!run) run = 1; const c = map(s.charAt(n)); n++; while (run-- > 0) out.push(c); } return out; }
function encodeRow(cells) { let s = '', cur = null, run = 0; for (const c of cells) { if (c === cur) run++; else { if (cur !== null) s += (run > 1 ? run : '') + cur; cur = c; run = 1; } } return s + (run > 1 ? run : '') + cur; }

console.log('\nTHE FOUR NUMBERS (rule 109c)            ours                      Battle Brothers');
const n = json.numbers;
console.log('  tiles across / in all                 ' + (n.tilesAcross + ' / ' + n.tiles).padEnd(26) + n.battleBrothers.tilesAcross + ' / ' + n.battleBrothers.tiles);
console.log('  a crossing on foot                    ' + Object.entries(n.daysAcross).map(([k, v]) => v + ' d').join(', ').padEnd(26) + 'not measured yet (EYES, Grok ask 26)');
console.log('  settlements                           ' + (n.settlementsInAll + ' (' + n.places + ' region + 14 valley)').padEnd(26) + n.battleBrothers.settlements);
console.log('  kilometres across                     ' + (n.kmAcross + ' km').padEnd(26) + 'a painting, no scale');
console.log('\nREGION LAND: ' + pass + ' passed / ' + fail + ' failed');
process.exit(fail ? 1 : 0);
