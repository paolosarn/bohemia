/* THE LIVING MAP — the gate for [the living map] (10/9/26, LIFE + CITY)
 *
 * His row: "over one in-game day every party moved and no two stand on one cell (NOBODY STANDS ON
 * ANYBODY)", tracks that fade by the hour, the clock stops them (68a), the gate thickens on market day.
 *
 *   A  THE REAL VALLEY (overmap 12345, his 14 seats, WORLD's 28 parties), hour by hour for three days:
 *      every party moves inside every day, and NO HOUR ends with two parties on one cell off a town.
 *   B  THE CLOCK STOPS THEM: zero hours moves nobody and ages no print.
 *   C  PRINTS FADE BY THE HOUR: full when made, half at twelve hours, gone and pruned at a day.
 *   D  MARKET DAY IS THE SETTLEMENT SCREEN'S OWN: its seedOf/rng/rollTraits, lifted out of its page and
 *      run beside ours over 300 names x 60 days; one difference refuses. The crowd swells on market day
 *      and thins on a raid, and the order the traits rolled in never changes the count.
 *   E  ON THE MAP: the page carries the module byte-for-byte, the step goes through it, the prints and
 *      the gate crowd are drawn, and the settlement is handed the traits the map shows.
 *   F  MUTATION: WORLD's step alone (no settling) stacks parties, so A is measuring something.
 *
 * Run:  node gates/the_living_map_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const R = p => require(path.join(ROOT, p));
const T = R('engine/bohemia_towns.js'), P = R('engine/bohemia_parties.js'), CE = R('engine/bohemia_cityedit.js');
const OM = R('engine/bohemia_overmap.js'), G = R('engine/BOHEMIA_faction_graph.json'), LM = R('engine/bohemia_livingmap.js');
const TRAITS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };

const m = OM.buildOvermap(12345), seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
const PER_HOUR = 90 / 16;   /* the map's own ~90 cells a waking day (partiesCellsPerDay), by the hour */

/* ---- A ---- */
{
  const ps = P.all(seats, { n: m.n }), st = LM.make();
  let stackHours = 0, worst = 0, hour = 6, everyDay = true;
  for (let day = 0; day < 3; day++) {
    const was = ps.map(p => p.at.x + ',' + p.at.y + ',' + p.arrived + ',' + p.left);
    for (let h = 0; h < 24; h++) {
      LM.advanceHours(ps, seats, st, 1, PER_HOUR, ++hour);
      const s = LM.stacks(ps, seats); if (s.length) { stackHours++; worst = Math.max(worst, s.length); }
    }
    const still = ps.filter((p, i) => (p.at.x + ',' + p.at.y + ',' + p.arrived + ',' + p.left) === was[i]).length;
    if (still) everyDay = false;
  }
  ok('A the valley has its parties', ps.length >= 20, ps.length + ' parties');
  ok('A *** EVERY PARTY MOVES INSIDE EVERY DAY, three days running ***', everyDay);
  ok('A *** NOBODY STANDS ON ANYBODY: 72 hours, 0 ending with two on one cell ***', stackHours === 0, 'hours with a stack ' + stackHours);
  ok('A and they leave prints', st.prints.length > 100, st.prints.length + ' prints alive');
}

/* ---- B ---- */
{
  const ps = P.all(seats, { n: m.n }), st = LM.make();
  LM.advanceHours(ps, seats, st, 3, PER_HOUR, 9);
  const at = JSON.stringify(ps.map(p => p.at)), n = st.prints.length;
  LM.advanceHours(ps, seats, st, 0, PER_HOUR, 9);
  ok('B the clock stopped: nobody moves and no print is added', JSON.stringify(ps.map(p => p.at)) === at && st.prints.length === n);
}

/* ---- C ---- */
{
  const pr = { h: 10 };
  ok('C a print is full the hour it is made', LM.fadeOf(pr, 10) === 1);
  ok('C half at twelve hours', Math.abs(LM.fadeOf(pr, 22) - 0.5) < 1e-9);
  ok('C gone a day later', LM.fadeOf(pr, 10 + LM.PRINT_HOURS) === 0);
  const st = { prints: [{ h: 0 }, { h: 5 }, { h: 30 }] };
  ok('C and pruned once gone', LM.prune(st, 30) === 1, 'left ' + st.prints.length);
  ok('C the fade is a number marked for TUNING', LM.PRINT_HOURS === 24 && LM.TUNED === false);
}

/* ---- D ---- */
{
  const page = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  const grab = re => { const x = page.match(re); return x ? x[0] : null; };
  const src = [grab(/function rng\(seed\)\{[^\n]*\}/), grab(/function seedOf\(str\)\{[^\n]*\}/),
               grab(/function rollTraits\(\)\{[\s\S]*?\n\}/)];
  ok('D the settlement screen\'s own roll was found in its page', src.every(Boolean));
  let diff = 0, tried = 0, markets = 0;
  if (src.every(Boolean)) {
    const theirs = new Function('TRAITS', 'S', src.join('\n') + '\nrollTraits(); return S.traits.map(function(t){return t.id;});');
    for (let i = 0; i < 300; i++) for (let day = 0; day < 60; day++) {
      const name = i < seats.length ? seats[i].faction : 'Place' + i;
      const a = theirs(TRAITS, { place: { name: name }, day: day }).join();
      const b = LM.traitsFor(TRAITS, name, day).map(t => t.id).join();
      tried++; if (a !== b) diff++; if (/market_day/.test(b)) markets++;
    }
  }
  ok('D *** THE MAP AND THE SETTLEMENT ROLL THE SAME MARKET DAY: 18,000 rolls, 0 differ ***', tried === 18000 && diff === 0, diff + ' differ, ' + markets + ' market days');
  const by = id => TRAITS.traits.find(t => t.id === id), base = (T.REACH && T.REACH.town) || 2;
  const plain = LM.crowdOf(base, []).count, mk = LM.crowdOf(base, [by('market_day')]).count, rd = LM.crowdOf(base, [by('raided')]).count;
  ok('D an ordinary day: the tier\'s own business at the gate', plain === base, 'town ' + plain);
  ok('D market day swells it, a raid thins it', mk > plain && rd < plain, 'market ' + mk + ', raided ' + rd);
  let orderSafe = true;
  for (const b0 of [1, 2, 3]) for (const x of TRAITS.traits) for (const y of TRAITS.traits)
    if (LM.crowdOf(b0, [x, y]).count !== LM.crowdOf(b0, [y, x]).count) orderSafe = false;
  ok('D the count does not depend on the order the traits rolled in (every pair, every tier)', orderSafe);
  ok('D crowdAt is that arithmetic on the shared roll', LM.crowdAt(TRAITS, { name: 'Mob', tier: 'town' }, 9).count ===
     LM.crowdOf(base, LM.traitsFor(TRAITS, 'Mob', 9)).count);
}

/* ---- E ---- */
{
  const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_livingmap.js'), 'utf8').replace(/\n+$/, '');
  const i = city.indexOf('/* ==== engine/bohemia_livingmap.js ==== */\n'), j = city.indexOf('\n/* ==== /engine/bohemia_livingmap.js ==== */');
  ok('E the map carries the module byte for byte', i >= 0 && j > i && city.slice(i + '/* ==== engine/bohemia_livingmap.js ==== */\n'.length, j) === mod);
  ok('E the parties step through it (WORLD\'s step only if it is missing)', /try\{ livingMapSteps\(ps, __whole\); \}catch/.test(city));
  ok('E the prints are drawn, fading by the hour', /BohemiaLivingMap\.fadeOf\(__pr, __lh\)/.test(city) && /window\.__TRACK_INK = __lk/.test(city));
  ok('E every home base draws its gate crowd', /var __gc = livingMapCrowd\(__n, __tier\)/.test(city));
  ok('E the settlement is handed the traits the map shows', /traits: \(function\(\)\{ var c = livingMapCrowd\(t\.name, t\.tier\)/.test(city));
}

/* ---- F ---- */
{
  const ps = P.all(seats, { n: m.n }); let stacked = 0;
  for (let s = 0; s < 90; s++) { P.advance(ps, 1, 1); if (LM.stacks(ps, seats).length) stacked++; }
  ok('F MUTATION: WORLD\'s step alone stacks parties, so A measures something', stacked > 0, stacked + ' of 90 steps stacked');
}

console.log('\nTHE LIVING MAP GATE: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
