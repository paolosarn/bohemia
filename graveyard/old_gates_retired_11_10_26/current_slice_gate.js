// CURRENT SLICE GATE (7/25/26, world-model session) — the live phone the alpha's
// SLICE tab loads (slices/BOHEMIA_CURRENT_SLICE.html) must never silently drift
// from the real engine. bohemia_loop.js is a UMD module (not the `const BOH_X=`
// IIFE pattern), so the generic ENGINE SYNC gate can't see it inlined here — this
// gate closes that specific hole. Found 7/25: the inlined loop.js had been the
// OLD pre-real-world-model / pre-territory-AI body since the phone lane forked,
// silently, for weeks; the live phone was drawing a fake abstract valley instead
// of the real generated one. Never again without this going red.
//
// Proves:
//   1. FRESHNESS: every module tools/build_current_slice.js inlines (loop.js and
//      world.js above all — the two that carry the real world model) is
//      byte-identical to its canon engine/ source.
//   2. REGENERATION IS A NO-OP: actually rerunning the generator produces the
//      exact bytes on disk — the strongest freshness proof there is, since it
//      also catches drift in the dev source (BOHEMIA_SOCIAL_PHONE_DEMO) itself,
//      not just the inlined bodies.
//   3. the real world model, not the old abstract stub: buildRealWorldMap's
//      landmark plumbing (mountainBorders/strip/dam/solar) is present.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const OUT = 'slices/BOHEMIA_CURRENT_SLICE.html';
const page = fs.readFileSync(OUT, 'utf8');

// 1. freshness: the two modules that carry the real world model are byte-identical
for (const mod of ['engine/bohemia_loop.js', 'engine/bohemia_world.js']) {
  const body = fs.readFileSync(mod, 'utf8');
  ok('embedded ' + mod + ' is the canon body (freshness)', page.indexOf(body) >= 0);
}

// 2. regeneration is a no-op — the strongest proof: actually rebuild it and diff
const before = page;
execFileSync('node', ['tools/build_current_slice.js'], { cwd: path.join(__dirname, '..') });
const after = fs.readFileSync(OUT, 'utf8');
ok('regenerating via tools/build_current_slice.js changes nothing (committed slice is current)', before === after);
if (before !== after) {
  // leave the working tree as it was found — a gate run must never itself cause drift
  fs.writeFileSync(OUT, before);
}

// 3. the real world model is what's actually wired in, not the old abstract stub
ok('the live phone boots the REAL world model (buildRealWorldMap), not the old abstract WorldGen',
  page.indexOf('function buildRealWorldMap(') >= 0 && page.indexOf('E.WorldGen.generateWorld') === -1);
ok('the real landmarks (mountain walls / Strip / dam / solar) are plumbed from the real overmap',
  page.indexOf('function scanRealLandmarks(') >= 0);
ok('the quest-gated pacing ruling rode along with the real world model',
  page.indexOf('PACING (Paolo 7/24') >= 0);

console.log('CURRENT SLICE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
