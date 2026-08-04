#!/usr/bin/env node
/* ============================================================================
   DISTRICT FILL GATE — the floor under every district, 8/2/26.

   Paolo, on the map-size question: "Before you cut anything."
   He said it about the valley. It is just as true one district down, and there
   was nothing holding it there either.

   WHAT walkable_gate ALREADY HOLDS (and this does not repeat): pavement may not
   dominate content. That is the WALKABLE-LAND LAW's letter and it catches the
   failure it was written for -- the fire station that was 8% building and 52%
   apron.

   WHAT NOTHING HELD, and the law's own text admits it: "SPIRIT the number can't
   fully catch -- a walkable district must read FINISHED and USED, not thin
   features stranded in empty lawn." A district with NO pavement at all passes
   walkable_gate no matter how empty it is, because there is no drive to compare
   against. Content could fall to nothing, one district at a time, and every gate
   in this repo would stay green.

   SO THIS HOLDS A FLOOR, NOT AN OPINION. Each district type is pinned at the
   content share it MEASURED on 8/2/26, worst case across all six street configs.
   Nothing here claims any district is currently wrong. It claims that whatever
   they are today, they do not quietly get emptier.

   WHY IT IS A FLOOR AND NOT A TARGET -- the part worth reading before "fixing"
   anything it reports. Every district near the bottom of this list was checked
   against the real world before being left alone:

     suburb, 26.9% content, 22.9% pavement
       Real single-family zoning caps building lot coverage at 30-40% PER LOT,
       and a subdivision is lots plus streets plus yards. 27/23/50 is what a Sun
       Belt subdivision actually is. It is not thin. It is right.

     cemetery, 14.3% content, 61% memorial lawn
       Looks wrong. Is not. The plot is 96 x 96 m = 2.28 acres and carries 917
       headstone cells: 403 graves an acre. Real conventional cemeteries run
       400-1,000 an acre and historic ones with family plots and winding paths
       run 300-600. It sits inside the real band.

     park / golf / desert / mountain
       Open ground IS the land use. A park that is 77% lawn is a park.

   The lesson that produced this comment: two separate times today a number that
   LOOKED like a defect turned out to be the real world being modelled correctly,
   and both times the check took one search. DO NOT CLAIM THINGS ABOUT THE
   CODEBASE WITHOUT CHECKING (8/1) covers land use too. If this gate goes red,
   the district got emptier -- that is a regression. If you think a baseline is
   too LOW, that is a content decision and it is Paolo's, not a gate's.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
require(path.join(ROOT, 'engine/bohemia_world.js'));   // registers every generator

const BASELINE = path.join(ROOT, 'records/BOHEMIA_DISTRICT_FILL_BASELINE_8_2_26.json');
const MARGIN = 5;          // points of drift allowed before it is a regression

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

ok('the 8/2 baseline is on disk', fs.existsSync(BASELINE));
const rawBase = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
/* JSON cannot carry a comment, so the baseline keeps its reasons under keys
   prefixed with _ . They are notes, not districts -- counting one as a district
   inflated the registry to 50 and dragged the median. */
const base = {};
for (const [k, v] of Object.entries(rawBase)) if (k[0] !== '_') base[k] = v;
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];

const measured = {};
for (const t of K.types().slice().sort()) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  let worst = null;
  for (const cfg of CONFIGS) {
    try {
      const r = spec.generate(7, { streets: cfg });
      const s = K.landStats(r.g, spec.legend);
      if (worst === null || s.contentPct < worst) worst = s.contentPct;
    } catch (e) { /* a generator that throws is another gate's problem */ }
  }
  if (worst !== null) measured[t] = worst;
}

ok('every district type in the baseline still exists (' + Object.keys(base).length + ')',
  Object.keys(base).every(t => measured[t] !== undefined));
ok('and the registry has not shrunk (' + Object.keys(measured).length + ' measured)',
  Object.keys(measured).length >= Object.keys(base).length);

let worstDrop = 0, worstName = '';
for (const [t, floor] of Object.entries(base)) {
  const now = measured[t];
  if (now === undefined) continue;
  const drop = floor - now;
  if (drop > worstDrop) { worstDrop = drop; worstName = t; }
  ok(t + ' is not emptier than it was on 8/2 (' + now.toFixed(1) + '% vs ' + floor + '%)',
    now >= floor - MARGIN);
}

/* and the shape of the whole set, so nobody hollows out half the registry by a
   few points each and stays under the per-district margin */
const vals = Object.values(measured).sort((a, b) => a - b);
const median = vals[Math.floor(vals.length / 2)];
const baseVals = Object.values(base).sort((a, b) => a - b);
const baseMedian = baseVals[Math.floor(baseVals.length / 2)];
ok('the MEDIAN district has not got emptier (' + median.toFixed(1) + '% vs ' + baseMedian + '%)',
  median >= baseMedian - 2);

console.log('');
console.log('  DISTRICT FILL, worst street config, share of the plot that is real content:');
const rank = Object.entries(measured).sort((a, b) => a[1] - b[1]);
const line = r => '    ' + r[0].padEnd(14) + (r[1].toFixed(1) + '%').padStart(7);
for (const r of rank.slice(0, 5)) console.log(line(r) + '   (open ground / vehicular by nature)');
console.log('    ...');
for (const r of rank.slice(-3)) console.log(line(r));
console.log('    median ' + median.toFixed(1) + '% across ' + rank.length + ' types'
  + (worstName ? '   ·  biggest drop since 8/2: ' + worstName + ' ' + worstDrop.toFixed(1) + ' pts' : ''));
console.log('\n=== DISTRICT FILL GATE: ' + pass + ' passed, ' + fail + ' failed ===');
if (fail) process.exit(1);
