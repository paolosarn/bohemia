#!/usr/bin/env node
/* ============================================================================
   EVERY JUNCTION ON THE MAP JOINS BY THE RULE  (WORLD lane, row [the map's roads
   as one kit]; the help RUN's [the districts connect on the map] asked for)

   Paolo 10/18: 'the districts look like shit, the streets look like shit,
   doesn't look like shit's connected that smart like it should'. Measured on the
   game's own seed: the street grid is joined, but the map draws all 2,515 street
   cells with one straight picture, so 556 junctions show a straight road. The
   data that says which piece each cell is lives in engine/bohemia_map_joins.js.

   IT REFUSES:
   A. AN ANSWER THAT CHANGES BETWEEN RUNS. Same valley, same bytes.
   B. A ONE-SIDED JOIN. If a cell says it joins north, the cell to the north says
      it joins south. 'Lanes agreeing at every junction' is this test.
   C. A JOIN THE RULE DOES NOT ALLOW. A street never joins a freeway's side; it
      goes over it or meets it at an interchange. Every 'road' join is a pair in
      the JOIN table, read live.
   D. A CROSSING THAT IS NOT ONE. A level crossing is over rail, a bridge over a
      wash, an over is across the freeway band, and the street carries on both
      sides on the crossing's own axis.
   E. MORE BREAKS. An end that meets plain ground with no landmark, rim, water or
      edge to stop at: 2 on the game's seed, a ratchet over twenty valleys too.
   F. A SECOND VALLEY. The seed is read out of the CITY frame (the map RUN ships),
      and the generator the frame inlines is this engine file, byte for byte.
   G. THE RULES ON PAPER ONLY. Five hand-made valleys run through the module: a
      street cut by rail picks up again (a level crossing), one cut by a lot does
      not, a street beside a freeway is not joined to it, a cross is a cross.
   AND IT PRINTS, NEVER REDS: how many junctions the map still draws straight, and
   which pieces the kit has against the pieces the valley needs (for RUN and COOK
   TWO; drawing is theirs).
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const read = p => fs.readFileSync(P(p), 'utf8');

const OM = require('../engine/bohemia_overmap.js');
const MJ = require('../engine/bohemia_map_joins.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

const FRAME = 'slices/BOHEMIA_CITY_WORLD.html';
const frame = read(FRAME);
const BREAKS_GAME = 1;        /* the game's seed, measured 10/18; may only shrink */
const BREAKS_SWEEP = 7;       /* the worst of twenty valleys, measured 10/18 (7); may only shrink */

/* F first: everything else stands on it */
let seed = null;
section('F. the map RUN ships is the valley measured here', () => {
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/);
  const hs = frame.indexOf('function BOH_HASH_SEED(');
  ok('F1 the CITY frame names its seed text', !!st, st ? st[1] : 'not found');
  ok('F2 the CITY frame carries its seed hash', hs >= 0);
  if (st && hs >= 0) {
    const body = frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27);
    seed = new Function(body + '\nreturn BOH_HASH_SEED;')()(st[1]);
  }
  ok('F3 the seed is a number', typeof seed === 'number', String(seed));
  const eng = read('engine/bohemia_overmap.js');
  const i = frame.indexOf('/* ==== engine/bohemia_overmap.js ==== */');
  const inl = i >= 0 ? frame.slice(i, i + 50 + eng.length) : '';
  ok('F4 the frame inlines engine/bohemia_overmap.js verbatim', i >= 0 && inl.indexOf(eng.trim().slice(0, 4000)) >= 0
     && inl.indexOf(eng.trim().slice(-2000)) >= 0);
});
if (typeof seed !== 'number') seed = 2691674296;

const om = OM.buildOvermap(seed);
const J = MJ.joinsFor(om);
const C = J.counts;
const SIDE = { N: [0, -1, 'S'], E: [1, 0, 'W'], S: [0, 1, 'N'], W: [-1, 0, 'E'] };

section('A. same valley, same answer', () => {
  const J2 = MJ.joinsFor(OM.buildOvermap(seed));
  ok('A1 two runs are byte-equal', JSON.stringify(J) === JSON.stringify(J2));
  ok('A2 every road cell is in the answer', C.road === om.tiles.filter(t => MJ.KIND[t.district]).length, C.road + ' road cells');
});

section('B. every join is two-sided', () => {
  let one = 0, badPiece = 0, ex = '';
  for (const k in J.cells) {
    const c = J.cells[k];
    if (MJ.PIECE[c.mask] !== c.piece) badPiece++;
    for (const s in c.joins) {
      if (c.joins[s] !== 'road') continue;
      const o = J.cells[(c.x + SIDE[s][0]) + ',' + (c.y + SIDE[s][1])];
      if (!o || o.joins[SIDE[s][2]] !== 'road') { one++; if (!ex) ex = k + ' ' + s; }
    }
  }
  ok('B1 no one-sided road join', one === 0, one ? one + ', first ' + ex : 'all ' + C.road + ' cells agree');
  ok('B2 every piece matches its sides', badPiece === 0);
});

section('C. every join is a pair the rule allows', () => {
  let bad = 0, sideFw = 0, ex = '';
  for (const k in J.cells) {
    const c = J.cells[k];
    for (const s in c.joins) {
      if (c.joins[s] !== 'road') continue;
      const o = J.cells[(c.x + SIDE[s][0]) + ',' + (c.y + SIDE[s][1])];
      if (!o || !MJ.joinsKinds(c.kind, o.kind)) { bad++; if (!ex) ex = k; }
      if (o && ((c.kind === 'street' || c.kind === 'boulevard') && o.kind === 'freeway')) sideFw++;
    }
  }
  ok('C1 every road join is in the JOIN table', bad === 0, bad ? bad + ', first ' + ex : '');
  ok('C2 no street joins a freeway side', sideFw === 0, C.sideTouch + ' streets touch a freeway side and are kept apart');
  ok('C3 the rule itself forbids street|freeway', !MJ.joinsKinds('street', 'freeway') && !MJ.joinsKinds('boulevard', 'freeway'));
});

section('D. every crossing is real', () => {
  const OVER = { level: 'rail', bridge: 'wash' };
  let bad = 0, ex = '';
  for (const x of J.crossings) {
    const right = x.kind === 'over' ? MJ.KIND[x.over] === 'freeway' : x.over === OVER[x.kind];
    const [dx, dy] = x.axis === 'ew' ? [1, 0] : [0, 1];
    const walk = sgn => { for (let k = 1; k <= 13; k++) { const c = J.cells[(x.x + dx * k * sgn) + ',' + (x.y + dy * k * sgn)];
      const t = om.at(x.x + dx * k * sgn, x.y + dy * k * sgn); if (!t) return false;
      if (c && (c.kind === 'street' || c.kind === 'boulevard')) return true;
      if (t.district !== x.over && MJ.KIND[t.district] !== MJ.KIND[x.over]) return false; } return false; };
    if (!right || !walk(1) || !walk(-1)) { bad++; if (!ex) ex = x.x + ',' + x.y + ' ' + x.kind; }
  }
  ok('D1 every crossing sits on what it says and the street carries on both sides', bad === 0,
     bad ? bad + ', first ' + ex : C.level + ' level crossings, ' + C.bridge + ' bridges, ' + C.over + ' freeway deck cells');
  ok('D2 the railway and the washes are crossed somewhere', C.level > 0 && C.bridge > 0);
});

section('E. breaks only shrink', () => {
  ok('E1 the game\'s seed: breaks <= ' + BREAKS_GAME, C.break <= BREAKS_GAME,
     C.break + ' (' + J.breaks.map(b => b.x + ',' + b.y + ' into ' + b.faces).join('; ') + ')');
  let worst = 0, total = 0, junc = 0;
  for (let s = 1; s <= 20; s++) { const c = MJ.joinsFor(OM.buildOvermap(s)).counts; worst = Math.max(worst, c.break); total += c.break; junc += c.junction; }
  ok('E2 twenty valleys: the worst <= ' + BREAKS_SWEEP, worst <= BREAKS_SWEEP, 'worst ' + worst + ', mean ' + (total / 20).toFixed(1) + ', junctions mean ' + Math.round(junc / 20));
  ok('E3 every end is accounted for', C.end + C.lone === C.stop + C.break);
});

section('G. the rules, on hand-made valleys', () => {
  const fake = rows => { const n = rows[0].length, tiles = [];
    const L = { s: 'arterial', r: 'rail', w: 'wash', f: 'freeway', '.': 'suburb', m: 'mountain', i: 'interchange' };
    rows.forEach((r, y) => [...r].forEach((ch, x) => tiles.push({ x, y, district: L[ch] })));
    return { seed: 0, n, tiles, at: (x, y) => (x < 0 || y < 0 || x >= n || y >= rows.length) ? null : tiles[y * n + x] }; };
  let j = MJ.joinsFor(fake(['.......', 'ssrssss', '.......']));
  ok('G1 a street cut by rail that picks up again is a level crossing', j.counts.level === 1 && j.cells['1,1'].piece === 'straight', JSON.stringify(j.cells['1,1'].joins));
  j = MJ.joinsFor(fake(['.......', 'sss....', '.......']));
  ok('G2 a street that stops at plain ground is a break', j.counts.break === 1 && j.breaks[0].x === 2);
  j = MJ.joinsFor(fake(['fffffff', 'sssssss', '.......']));
  ok('G3 a street beside a freeway is not joined to it', j.cells['3,1'].piece === 'straight' && !j.cells['3,1'].joins.N);
  j = MJ.joinsFor(fake(['..s..', '..s..', 'sssss', '..s..', '..s..']));
  ok('G4 a cross is a cross, a tee is a tee', j.cells['2,2'].piece === 'cross' && j.cells['0,2'].piece === 'end');
  j = MJ.joinsFor(fake(['..s..', 'fffff', 'fffff', '..s..', '.....']));
  ok('G5 a street that comes out the far side of the freeway goes over it', j.counts.over === 2 && j.cells['2,0'].joins.S === 'over');
  j = MJ.joinsFor(fake(['.......', 'ssr.sss', '.......']));
  ok('G6 rail then a lot is an end, not a crossing', j.counts.level === 0);
  j = MJ.joinsFor(fake(['.....', 'ssssm', '.....']));
  ok('G7 a road at the rock is a stop, not a break', j.counts.stop === 2 && j.counts.break === 0, JSON.stringify(j.stops));
});

/* ---------------------------------------------------------------- FINDINGS */
console.log('\n--- FINDINGS (printed, never red; the drawing is RUN\'s and the pieces COOK TWO\'s) ---');
const wired = /BOH_MAP_JOINS|bohemia_map_joins/.test(frame);
console.log('  the game\'s seed ' + seed + ': ' + C.street + ' street cells = ' + C.straight + ' straight, ' + C.corner + ' corner, '
  + C.tee + ' tee, ' + C.cross + ' cross, ' + C.end + ' end, ' + C.lone + ' lone');
console.log('  the CITY frame reads this data: ' + (wired ? 'YES' : 'NO -- all ' + C.junction + ' junctions (' +
  (100 * C.junction / C.street).toFixed(0) + '% of the streets) draw the straight picture'));
const anch = frame.match(/var HERO_ANCH=(\{.*?\});/);
const have = anch ? Object.keys(JSON.parse(anch[1])).filter(k => /^(arterial|strip)/.test(k)) : [];
console.log('  street pictures the kit has: ' + (have.join(', ') || 'none found') + '; the valley needs: straight, cross'
  + ' (have), and corner x' + C.corner + ', tee x' + C.tee + ', end x' + C.end + ', level crossing x' + C.level + ', bridge x' + C.bridge + ' (cut none yet)');

console.log('\nMAP JOINS: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
