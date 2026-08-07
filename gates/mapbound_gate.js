/* BOHEMIA MAP BOUND GATE (8/7/26) — nothing that scans the valley may decide for
 * itself how big the valley is.
 *
 * THE BUG THIS KILLS, AS A CLASS. On 8/6 the valley population turned out to be
 * wrong by 4.25x. tools/bohemia_scale_model.js measured the world with `y < 48`
 * hardcoded, the valley had become 96x96, and the tool kept measuring a quarter of
 * it — silently, because a small loop over a big world does not error, it
 * under-counts.
 *
 * THEN THE CROSS-CHECK TURNED OUT TO HAVE THE SAME LINE. people_gate G6 ("THE SIM
 * HOLDS WHAT THE ARITHMETIC SAYS") is the one claim designed to catch exactly that,
 * and it counted the sim with `y < 48` too. Both sides of the check measured a
 * quarter of the world, agreed perfectly, and reported "0% off" for weeks.
 *
 *   A CROSS-CHECK WHOSE TWO SIDES SHARE AN ERROR IS NOT A CROSS-CHECK.
 *   IT IS ONE MEASUREMENT WRITTEN TWICE, AND IT WILL AGREE WITH ITSELF FOREVER.
 *
 * AND THEN THE SWEEP FOUND NINE MORE IN THE SAME FILE. Ten loops in people_gate
 * bounded at 48, feeding claims that say "EVERY body", "the biggest household in
 * the valley", "it never MOVES anybody" — universal claims about the world, tested
 * on a quarter of it, where a violation in the other 75% passes silently. Widened
 * to world.n they cover 678 residential cells instead of 162 and 1,224 bodies
 * instead of 268, and all 152 claims still pass: the code was right, the tests were
 * just short-sighted. (The oft-quoted "268 derived people" was itself an artefact
 * of that bound.)
 *
 * SWEEP THE PATTERN, NOT THE INSTANCES. Four separate hunts found these one at a
 * time. This is the machine that finds the next one.
 *
 * A RATCHET, NOT A PURGE. The `< 96` loops elsewhere in the fleet are correct
 * TODAY by luck — 96 happens to be the map size — and they are other lanes' files.
 * Dumping red on them would be the thing this repo spent a week learning not to do.
 * So: the known ones are DECLARED below with a date, the count may only go DOWN,
 * and any NEW hardcoded map bound fails immediately.
 *
 *   node gates/mapbound_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* a scan loop whose bound is a bare map-sized literal */
const SCAN = /for\s*\(\s*(?:let|var)\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*(48|96)\b/g;

const DIRS = ['engine', 'gates', 'tools'];
const SKIP = /node_modules|__pycache__|mapbound_gate\.js/;

function sweep() {
  const found = [];
  for (const d of DIRS) {
    if (!fs.existsSync(d)) continue;
    for (const fn of fs.readdirSync(d)) {
      if (!/\.(js|py)$/.test(fn)) continue;
      const p = d + '/' + fn;
      if (SKIP.test(p)) continue;
      const src = fs.readFileSync(p, 'utf8');
      /* strip block and line comments so a bound QUOTED in a post-mortem (this
         file's own header quotes `y < 48` four times) is never counted as a use.
         A checker that cannot tell a mention from a use is the broken one. */
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
        .replace(/^\s*#.*$/gm, '');
      let m, n = 0;
      SCAN.lastIndex = 0;
      while ((m = SCAN.exec(code))) n++;
      if (n) found.push({ file: p, count: n });
    }
  }
  return found.sort((a, b) => b.count - a.count);
}

/* ---- THE DECLARED BASELINE, 8/7/26 ---------------------------------------
   Every file here scans the valley with a typed bound. They are correct today
   only because 96 is currently the map size; the day it changes they all go
   quietly wrong in the same way the scale model did. Declared rather than
   purged, because most are other lanes' and a red suite helps nobody.
   THE RULE: this list may SHRINK, never GROW. */
const DECLARED = {
  'engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js': 4,
  'engine/bohemia_graphics_tests.js': 4,
  'engine/bohemia_overmap.js': 2,
  'gates/exterior_pool_gate.js': 2,
  'gates/mass_edit_gate.js': 2,
  'gates/city_people_gate.js': 6,
  'gates/rail_gate.js': 2,
  'gates/rooms_gate.js': 6,
  'gates/world_gate.js': 2,
};

const found = sweep();
const byFile = {};
found.forEach(f => { byFile[f.file] = f.count; });

/* ---- 1. NO NEW OFFENDERS ------------------------------------------------- */
const novel = found.filter(f => !(f.file in DECLARED));
ok('no NEW file scans the valley with a typed map size' +
  (novel.length ? ' — NEW: ' + novel.map(f => f.file + ' x' + f.count).join(', ') : ''),
  novel.length === 0);

/* ---- 2. THE DECLARED LIST MAY ONLY SHRINK -------------------------------- */
let grew = [];
for (const f in DECLARED) {
  const now = byFile[f] || 0;
  if (now > DECLARED[f]) grew.push(f + ' (' + DECLARED[f] + ' -> ' + now + ')');
}
ok('no declared file grew more typed map bounds' + (grew.length ? ' — ' + grew.join(', ') : ''),
  grew.length === 0);

const total = found.reduce((n, f) => n + f.count, 0);
const declaredTotal = Object.values(DECLARED).reduce((a, b) => a + b, 0);
ok('the fleet total has not grown (' + total + ' against a declared ' + declaredTotal + ')',
  total <= declaredTotal);

/* ---- 3. THE FILES THAT WERE FIXED MUST STAY FIXED ------------------------ */
/* people_gate and the scale model are where this cost 4.25x. They are clean now
   and must not regress — this is the specific ratchet, not a general wish. */
for (const f of ['gates/people_gate.js', 'tools/bohemia_scale_model.js',
  'gates/scale_truth_gate.js']) {
  ok(f.replace(/^\w+\//, '') + ' scans the LIVE map, never a typed one (was the 4.25x bug)',
    !(f in byFile));
}

/* ---- 4. AND THEY READ THE WORLD'S OWN DIMENSION -------------------------- */
const pg = fs.readFileSync('gates/people_gate.js', 'utf8');
ok('people_gate takes its bound from the world model (world.n)', /world\.n/.test(pg));
const sm = fs.readFileSync('tools/bohemia_scale_model.js', 'utf8');
ok('the scale model takes its bound from the world model', /world\.n|const N = world\.n/.test(sm));

console.log('MAP BOUND GATE: ' + pass + ' passed, ' + fail + ' failed  (' + total +
  ' typed map bounds across ' + found.length + ' files, all declared)');
process.exit(fail ? 1 : 0);
