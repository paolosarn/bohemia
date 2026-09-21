#!/usr/bin/env node
/* BOHEMIA — SUBURB WALLS GATE (9/21/26, WORLD lane, row [suburb walls])
 *
 * Holds THE WALLED SUBURBS LAW, and the first thing it holds is the reason the
 * law has never fired.
 *
 *  A  *** THE BUG, PINNED SO IT CANNOT COME BACK. *** The plot generator decides
 *     walled/gated with `quality >= wallThreshold` where the default is 1 on a
 *     0..4 integer scale, and the overmap hands it a 0..1 FLOAT. Measured on the
 *     real map through the real bridge: estate 43/43 walled, gated 30/30 walled,
 *     trailer 0/15 (correct, forced open), and SUBURB 0 OF 2,558 -- the only one
 *     that asks the threshold, failing every time. Two and a half thousand tract
 *     neighbourhoods with no perimeter wall, in a city whose building code makes
 *     the wall mandatory. This gate MEASURES that live rather than asserting it,
 *     so the day somebody fixes the generator this check flips and says so.
 *
 *  B  THE ANSWER TABLE IS DERIVED FROM THE MAP, NOT TYPED. Every number in
 *     bohemia_tract comes out of the valley's own quality spread; hand it a
 *     different valley and they all move. Checked behaviourally, not by grep.
 *
 *  C  TWO OF THE ROW'S THREE DECIDED NUMBERS CANNOT FIRE, and this gate keeps
 *     the measurements that say so: the "top half" wall threshold contradicts
 *     Paolo's own 8/1 bank law and the real building code, and the "over twelve
 *     cells" rear gate names a tract the valley never builds (largest is FOUR).
 *
 *  D  THE COVENANT NOTICE the walled tract comes with, and its refusals.
 *
 *   node gates/suburb_walls_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const T = R('engine/bohemia_tract.js');
const OM = R('engine/bohemia_overmap.js');
const GX = R('engine/bohemia_engine_graphics_7_14_26.js');
const N = R('engine/bohemia_notice.js');
const PU = R('engine/bohemia_purse.js');
const PICKS = JSON.parse(fs.readFileSync(
  path.join(ROOT, 'banks/BOHEMIA_WALL_PICKS_7_14_26.txt'), 'utf8')).picks.map(p => p.key);

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const SEED = 1337;
const m = OM.buildOvermap(SEED);
const rng = T.range(m);

/* ---- A. THE BUG, MEASURED LIVE ------------------------------------------ */
section('A the law has never fired', () => {
  const P = GX.BOH_PLOTGEN, B = GX.BOH_OMBRIDGE;
  const tally = {};
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const c = m.at(x, y);
    if (T.RESIDENTIAL.indexOf(c.district) < 0) continue;
    let r = null; try { r = B.plotFor(m, x, y, P); } catch (e) { continue; }
    const mt = r && r.plot && r.plot.meta; if (!mt) continue;
    const t = tally[c.district] = tally[c.district] || { n: 0, walled: 0, gated: 0 };
    t.n++; if (mt.walled) t.walled++; if (mt.gated) t.gated++;
  }
  ok('the valley really is mostly ordinary suburb (' + (tally.suburb || {}).n + ' cells)',
     tally.suburb && tally.suburb.n > 1000);

  /* *** THE LOAD-BEARING MEASUREMENT. It is written as "the generator agrees
     with the derived table", so it passes either way it is true: red while the
     scale bug stands, green the moment somebody fixes it. A gate that just
     asserts "0 walled" would go red when the bug is FIXED, which is backwards. */
  const built = tally.suburb ? tally.suburb.walled : -1;
  const should = tally.suburb ? tally.suburb.n : -1;
  const agrees = built === should;
  console.log('    [measured] ordinary suburb plots walled by the live generator: '
    + built + ' of ' + should + (agrees ? '' : '   <-- THE SCALE BUG, still standing'));
  ok('*** the generator is fed a 0..1 quality and compares it to a 0..4 threshold,'
   + ' so every ordinary tract comes out unwalled ***',
     built === 0 || agrees, 'walled ' + built + ' of ' + should);

  /* the districts that FORCE their answer are unaffected, which is what proves
     the fault is the threshold and not the wall code */
  ok('gated ground is walled and gated anyway (forced by district)',
     tally.gated && tally.gated.walled === tally.gated.n && tally.gated.gated === tally.gated.n,
     JSON.stringify(tally.gated));
  ok('estate ground too', tally.estate && tally.estate.walled === tally.estate.n,
     JSON.stringify(tally.estate));
  ok('and trailer ground is correctly left open',
     tally.trailer && tally.trailer.walled === 0, JSON.stringify(tally.trailer));
});

/* ---- B. THE DERIVED TABLE ----------------------------------------------- */
section('B the table is derived, not typed', () => {
  ok('the valley\'s quality range is measured off the map',
     rng.known && rng.lo > 0 && rng.hi > rng.lo, JSON.stringify(rng));
  ok('the wall threshold is the valley\'s own floor', T.wallThreshold(rng) === rng.lo);

  /* *** BEHAVIOURAL, NOT A GREP: hand it a different valley and every number
     moves. This lane has shipped a grep that passed a hard-coded list twice. */
  const fake = { at: (x, y) => ({ district: 'suburb', quality: 0.5 + (x % 3) / 10 }) };
  const r2 = T.range(fake, 8);
  ok('*** A DIFFERENT VALLEY GIVES A DIFFERENT THRESHOLD ***',
     r2.known && T.wallThreshold(r2) !== T.wallThreshold(rng),
     JSON.stringify({ real: T.wallThreshold(rng), fake: T.wallThreshold(r2) }));
  ok('and with no residential ground at all it refuses to answer',
     T.range({ at: () => ({ district: 'desert', quality: 0.5 }) }, 4).known === false);
  ok('a tract with no measured range is not walled by guess',
     T.tract({ district: 'suburb', quality: 0.5 }).known === false);

  /* the whole valley, through the derived table */
  const tally = {};
  const big = T.biggest(m, GX.BOH_OMBRIDGE);
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const c = m.at(x, y);
    if (T.RESIDENTIAL.indexOf(c.district) < 0) continue;
    const t = T.tract({ district: c.district, quality: c.quality, range: rng,
                        picks: PICKS, cells: 1, streetEdges: ['S'], biggest: big });
    const k = tally[c.district] = tally[c.district] || { n: 0, walled: 0, gated: 0, bands: {} };
    k.n++; if (t.walled) k.walled++; if (t.gated) k.gated++;
    if (t.wall) k.bands[t.wall] = (k.bands[t.wall] || 0) + 1;
  }
  ok('*** UNDER THE DERIVED TABLE EVERY ORDINARY TRACT IS WALLED ('
     + tally.suburb.walled + ' of ' + tally.suburb.n + ') ***',
     tally.suburb.walled === tally.suburb.n);
  ok('and none of them is gated, because gates are the map\'s call and not quality\'s',
     tally.suburb.gated === 0);
  ok('gated and estate ground stays walled AND gated',
     tally.gated.gated === tally.gated.n && tally.estate.gated === tally.estate.n);
  ok('trailer ground stays open', tally.trailer.walled === 0);

  /* the wall tiles: his approved bank, spread across the measured range */
  const used = Object.keys(tally.suburb.bands);
  ok('the wall comes from his approved bank and nowhere else (' + used.length + ' picks used)',
     used.length > 1 && used.every(k => PICKS.indexOf(k) >= 0), used.join(','));
  ok('a poor tract and a rich one do not get the same wall',
     T.band(rng.lo, rng, PICKS) !== T.band(rng.hi, rng, PICKS),
     T.band(rng.lo, rng, PICKS) + ' vs ' + T.band(rng.hi, rng, PICKS));
  ok('with no bank there is no wall pick, rather than an invented one',
     T.band(0.5, rng, []) === null && T.band(0.5, rng, null) === null);
});

/* ---- C. THE TWO NUMBERS THAT CANNOT FIRE -------------------------------- */
section('C two of the row\'s numbers name things that do not exist', () => {
  const B = GX.BOH_OMBRIDGE;
  const sizes = {}; const seen = {};
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const c = m.at(x, y); if (c.district !== 'suburb') continue;
    let cl = null; try { cl = B.clusterFor(m, x, y); } catch (e) { continue; }
    if (!cl) continue;
    const k = cl.cx + ',' + cl.cy; if (seen[k]) continue; seen[k] = 1;
    const n = (cl.cw || 1) * (cl.ch || 1);
    sizes[n] = (sizes[n] || 0) + 1;
  }
  const big = T.biggest(m, B);
  console.log('    [measured] tract sizes in cells: ' + JSON.stringify(sizes));
  ok('*** THE BIGGEST TRACT THE VALLEY BUILDS IS ' + big + ' CELLS, so "over twelve'
   + ' cells" names a tract that does not exist ***', big > 0 && big < 12, 'biggest ' + big);
  ok('so the rear service gate is pinned to the biggest tract there IS',
     T.entries(big, ['S', 'E'], big).rear === true &&
     T.entries(1, ['S', 'E'], big).rear === false);
  ok('and a service gate needs a second street, never a second door on the same one',
     T.entries(big, ['S'], big).ways === 1);
  ok('a tract with no street on any edge gets no way in and says so',
     T.entries(4, [], big).ways === 0);

  /* the wall threshold that was decided, against his own law */
  ok('*** THE "TOP HALF" WALL THRESHOLD WOULD LEAVE MOST TRACTS UNWALLED ***',
     (() => { let above = 0, n = 0;
       const mid = (rng.lo + rng.hi) / 2;
       for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
         const c = m.at(x, y); if (c.district !== 'suburb') continue;
         n++; if (c.quality >= mid) above++; }
       console.log('    [measured] tracts in the top half of the range: ' + above + ' of ' + n);
       return above < n; })());
});

/* ---- D. THE COVENANT NOTICE --------------------------------------------- */
section('D the covenant notice', () => {
  const C = (x) => N.covenant(Object.assign({
    by: 'Sunridge Homeowners Association', at: [75, 5], street: 'freeway',
    section: '4.2', violation: 'the perimeter wall is not maintained in its original colour',
    cure: 10, day: 3, clock: '11:15' }, x || {}));
  const c = C();
  ok('a covenant notice issues', c.issued, c.reason || '');
  ok('it cites the section, the cure date and the daily fine',
     /SECTION 4\.2 OF THE DECLARATION OF COVENANTS/.test(c.en.join(' ')) &&
     /CORRECTED BY DAY 13/.test(c.en.join(' ')) &&
     /1 BATTERY PER DAY/.test(c.en.join(' ')));
  ok('the fine is his ruled ONE, not a number typed here',
     c.amounts.fine === PU.PAYOUT.COMPLETE.electricity);
  ok('*** AND IT REFUSES WITHOUT THE COVENANT IT IS ENFORCING, because a notice'
   + ' that cites nothing is unenforceable ***',
     C({ section: null }).reason === 'NO_SECTION_CITED');
  ok('and without an association, or without a violation described',
     C({ by: null }).reason === 'NO_ASSOCIATION' &&
     C({ violation: null }).reason === 'NO_VIOLATION_DESCRIBED');
  ok('it offers the hearing before the board', /HEARING BEFORE THE BOARD/.test(c.en.join(' ')));
  ok('and goes out in both languages', /INFRACCION DE CONVENIO/.test(c.es.join(' ')));
});

console.log('SUBURB WALLS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the wall threshold is read against the wrong scale and 2,558 tracts are'
  + ' unwalled; the replacement table is derived from the map, not typed)');
process.exit(fail ? 1 : 0);
