/* BOHEMIA SCALE TRUTH GATE (8/6/26) — the population of the game must agree with
 * the map it is derived from.
 *
 * WHAT HAPPENED. tools/bohemia_scale_model.js exists to keep one number honest:
 * how many people are alive in the valley. Its own header promises the figure
 * "can never drift away from the world it describes". It then measured the world
 * like this:
 *
 *     for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++)
 *     const side = 48 * 96;
 *
 * The valley became 96x96. THE TOOL KEPT MEASURING A QUARTER OF IT and said
 * nothing, because a small loop over a big world does not error — it under-counts.
 *
 *     the tool said     12,259 homes over 21.2 km2  ->  1,112 people
 *     the world holds   55,391 homes over 84.9 km2  ->  4,723 people (exact census)
 *
 * A 4.25x error in the population of the game, sitting inside the tool built to
 * prevent exactly that, cited across ten files including a gate and two engine
 * modules. The occupancy RATE was right the whole time; only the arithmetic
 * describing it was wrong, which is why nothing about the world changed when this
 * was fixed — only what we believed about it.
 *
 * THE CHECK THAT WOULD HAVE CAUGHT IT ON DAY ONE is claim 3: the derived
 * population and an EXACT census of every residential cell must agree. Two ways
 * of counting the same thing, one cheap and one exhaustive. They cannot both be
 * wrong in the same direction by accident.
 *
 *   node gates/scale_truth_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const TOOL = 'tools/bohemia_scale_model.js';
const src = fs.readFileSync(TOOL, 'utf8');
const W = require('../engine/bohemia_world.js');
const A = require('../engine/bohemia_agents.js');

/* ---- 1. THE MAP SIZE IS READ, NEVER TYPED -------------------------------- */
/* the literal 48 was the whole bug. Any hardcoded dimension in the measuring
   loop is the same bug wearing a different number. */
const loop = /for\s*\(\s*let\s+y\s*=\s*0;\s*y\s*<\s*(\w+)\s*;/.exec(src);
ok('the scale model measures the map with a READ bound, not a typed one (got "' +
  (loop ? loop[1] : 'none') + '")', !!loop && !/^\d+$/.test(loop[1]));
ok('the side length is derived from that same bound, not typed',
  !/const side = \d+ \* 96/.test(src));

/* ---- 2. IT MEASURES THE WHOLE LIVE MAP ----------------------------------- */
const world = W.world(7);
const measured = (() => {
  try {
    const m = require('../' + TOOL);
    return (m && typeof m.measure === 'function') ? m.measure(7) : null;
  } catch (e) { return null; }
})();
if (measured && measured.n != null) {
  ok('the scale model measured the LIVE map size (' + measured.n + ' x ' + measured.n +
    ', world says ' + world.n + ')', measured.n === world.n);
} else {
  /* not exported: fall back to proving the source cannot hold a stale literal */
  ok('the scale model does not carry a stale map dimension anywhere in its measure()',
    !/<\s*48\s*;/.test(src));
}

/* ---- 3. THE LOAD-BEARING CLAIM: two counts of the same thing agree -------- */
/* cheap estimate vs exhaustive census. This is what a hardcoded 48 could never
   have survived, and it is the reason this gate exists at all. */
const exact = (() => {
  const w = W.world(12345);
  let cells = 0, people = 0;
  for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
    const c = w.at(x, y);
    if (!c || !A.RESIDENTIAL[c.district]) continue;
    cells++;
    people += A.censusForPlot(w, x, y).people;
  }
  return { cells, people };
})();
const sampled = A.sampleValley(W.world(12345), 24);
const ratio = exact.people ? sampled.estimatedPeople / exact.people : 0;
ok('THE SAMPLED VALLEY AND AN EXACT CENSUS AGREE (sampled ' + sampled.estimatedPeople +
  ' vs exact ' + exact.people + ' over ' + exact.cells + ' residential cells, ratio ' +
  ratio.toFixed(2) + 'x) — two ways of counting the same thing, and a map-size bug ' +
  'cannot survive both', ratio > 0.7 && ratio < 1.4);

/* the occupancy the world actually produces must still be the dial's value */
const homes = (() => {
  const w = W.world(12345);
  let h = 0;
  for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
    const c = w.at(x, y);
    if (!c || !A.RESIDENTIAL[c.district]) continue;
    const p = w.plot(x, y);
    if (p && p.buildings) h += p.buildings.length;
  }
  return h;
})();
const impliedRate = homes ? (exact.people / 2.2) / homes : 0;
ok('the occupancy the world PRODUCES is the dial we set (' + (impliedRate * 100).toFixed(2) +
  '% against OCCUPIED_RATE ' + (A.OCCUPIED_RATE * 100).toFixed(1) + '%)',
  Math.abs(impliedRate - A.OCCUPIED_RATE) < 0.012);

/* ---- 4. THE ENGINE'S WRITTEN FIGURE MUST NOT BE STALE -------------------- */
/* ten files cited 1,113. A number in a comment is documentation until somebody
   builds an economy on it, and then it is a bug. */
const eng = fs.readFileSync('engine/bohemia_agents.js', 'utf8');
ok('the engine no longer states the stale 1,113 as the valley population',
  !/=\s*1,113 PEOPLE IN THE WHOLE VALLEY/.test(eng));
ok('the engine records the correction and why the RATE did not change',
  /CORRECTED 8\/6/.test(eng) && /OCCUPIED_RATE DOES NOT CHANGE/i.test(eng));
ok('the engine\'s stated valley population is within reach of the measured one',
  (() => {
    const m = /=\s*~?([\d,]+)\s+PEOPLE IN THE WHOLE VALLEY/.exec(eng);
    if (!m) return false;
    const stated = parseInt(m[1].replace(/,/g, ''), 10);
    return stated > exact.people * 0.7 && stated < exact.people * 1.5;
  })());

console.log('SCALE TRUTH GATE: ' + pass + ' passed, ' + fail + ' failed  (valley holds ' +
  exact.people + ' people across ' + exact.cells + ' residential cells, ' + homes + ' homes)');
process.exit(fail ? 1 : 0);
