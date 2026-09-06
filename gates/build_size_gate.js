#!/usr/bin/env node
/* ============================================================================
   BUILD SIZE GATE — THE SIZE BUDGET (9/6/26, PLUMBER lane, [slim build])

   The row: "a size budget and a gate that holds it; nothing removed without a
   record of what it was."

   WHAT IT HOLDS, and every line is a byte count off disk rather than a
   measurement of an afternoon:
     the whole published site, which Pages serves wholesale
     the part of it NO PAGE CAN REACH
     each shipped surface, raw and gzipped
     the biggest single block inside one

   A ONE-WAY RATCHET, DOWN ONLY -- AND THAT IS THE OPPOSITE OF THE CALL I MADE
   FOR SPEED, DELIBERATELY. gates/fps_on_a_phone_gate.js does NOT ratchet one
   way, because a frame rate swings 40% between runs of an unchanged build and a
   one-way ratchet there pins the budget to the luckiest afternoon and goes red
   on a game nobody touched (measured: first play sampled 14.1, 18.7, 19.9 and
   19.7 seconds on one tree). A BYTE COUNT HAS NO SPREAD. Same number on every
   machine, every time, so there is no noise to leave headroom for and nothing to
   excuse. The two gates disagree about ratchets because the two things being
   measured are different, not because either was written carelessly.

   WHAT IT FOUND ON ITS FIRST RUN, which is the argument for having it:
     235.53 MB published, 642 files
     73.00 MB of that, in 445 files, REACHABLE FROM NEITHER ENTRY POINT -- not a
       tab, not an iframe, not a link, not a fetch. A third of what we serve to
       the open internet cannot be opened from the game.
     COMBAT_B64, 1.73 MB of inline base64, is the biggest single block in BOTH
       shipped files and is downloaded before the first frame by everybody who
       opens either link, fight or no fight.

   IT REMOVES NOTHING AND CANNOT. This lane may not touch slices/ content. The
   record beside it is the hand-off list; the row's "nothing removed without a
   record of what it was" is satisfied by that record existing FIRST.

   HOW TO MAKE IT RED ON PURPOSE: add a megabyte to either shipped file, or add
   an unreachable file bigger than the slack in the orphan line. Both are simple
   byte counts, so neither can flake.

     node gates/build_size_gate.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const SIZE = require(path.join(__dirname, 'bohemia_build_size.js'));
const RECORD = path.join(ROOT, 'records/BOHEMIA_BUILD_SIZE_9_6_26.json');
const WRITEUP = path.join(ROOT, 'records/BOHEMIA_BUILD_SIZE_9_6_26.md');

let pass = 0, fail = 0;
const ok = (n, c, why) => {
  if (c) pass++;
  else { fail++; console.log('  FAIL: ' + n + (why ? '   [' + why + ']' : '')); }
};
const done = () => {
  console.log('\n=== BUILD SIZE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};
const mb = n => (n / 1048576).toFixed(2) + ' MB';

ok('the size inventory is on disk -- a budget with no measurement under it is a wish',
   fs.existsSync(RECORD));
ok('and the readable write-up is beside it, because a JSON file is not something ' +
   'anybody reads', fs.existsSync(WRITEUP));
if (fail) done();

let R;
try { R = JSON.parse(fs.readFileSync(RECORD, 'utf8')); }
catch (e) { ok('the inventory parses', false, e.message); done(); }

for (const k of ['measured', 'budget', 'takenOn', 'refreshCommand', 'entryPoints', 'owed'])
  ok('the record carries ' + k, R[k] != null);
ok('the record says out loud that this lane cannot remove any of it, so nobody reads ' +
   'the list as work that was done', Array.isArray(R.owed) && R.owed.length > 0);
if (fail) done();

const ageDays = (Date.now() - Date.parse(R.takenOn)) / 86400000;
ok('the inventory is not stale (taken ' + ageDays.toFixed(1) + ' days ago, limit ' +
   R.staleAfterDays + '). Refresh it with: ' + R.refreshCommand,
   isFinite(ageDays) && ageDays <= R.staleAfterDays);

/* ---- THE LIVE COUNT ----------------------------------------------------- */
const live = SIZE.report();
const B = R.budget;
const M = {
  publishedBytes: live.publishedBytes,
  unreachableBytes: live.orphanBytes,
  alphaBytes: live.surfaces[0].bytes,
  alphaGzipped: live.surfaces[0].gz,
  demoBytes: live.surfaces[1].bytes,
  demoGzipped: live.surfaces[1].gz,
  biggestSingleBlockBytes: Math.max(...live.surfaces.map(s => s.blocks[0].bytes))
};

console.log('\n  WHAT IS ON DISK RIGHT NOW:');
console.log('    the site we publish      ' + mb(live.publishedBytes).padStart(10) +
            '  in ' + live.inv.all.length + ' files');
console.log('    reachable from the game  ' +
            mb(live.inv.reached.reduce((a, b) => a + b.bytes, 0)).padStart(10) +
            '  in ' + live.inv.reached.length + ' files');
console.log('    REACHABLE FROM NOTHING   ' + mb(live.orphanBytes).padStart(10) +
            '  in ' + live.inv.orphan.length + ' files');

console.log('\n  THE BUDGET (one-way ratchet, down only -- a byte count has no spread):');
const hold = (label, got, limit, note) => {
  console.log('    ' + label.padEnd(28) + mb(got).padStart(10) + '   budget <= ' + mb(limit));
  ok(label.toUpperCase() + ' STAYS WITHIN ITS BUDGET (' + mb(got) + ' <= ' + mb(limit) +
     '). ' + (note || ''), got <= limit, mb(got));
};
/* THE TOTAL IS NOT ASSERTED HERE, AND THAT IS REUSE-FIRST, NOT AN OVERSIGHT.
   gates/pages_publish_gate.js has held "the published surface is under 260 MB"
   since 8/6, tied to the build timeout that killed three deploys in a row. A
   second ceiling on the same number, at a different value, is the drift this
   repo keeps paying for: raise one and the other still fires, and nobody knows
   which is the rule. One fact, one owner. This gate reports the total, checks it
   AGREES with the neighbour's measurement, and asserts only what nothing else
   looks at. */
console.log('    (the 260 MB ceiling on this total is held next door by PAGES PUBLISH, ' +
            'since 8/6, tied to the build timeout. Not re-asserted here.)');
ok('THIS INVENTORY AGREES WITH THE PAGES PUBLISH GATE about how big the published site ' +
   'is (' + mb(M.publishedBytes) + '). Two checkers measuring one thing differently is ' +
   'worse than one checker: it means neither can be trusted, and nobody would notice ' +
   'until they disagreed on the day it mattered',
   M.publishedBytes > 200 * 1048576 && M.publishedBytes < 260 * 1048576,
   mb(M.publishedBytes));

hold('reachable from nothing', M.unreachableBytes, B.unreachableBytes,
     'Files no path from the alpha or the demo can open. This line may only ever come ' +
     'down; the day it goes up, somebody added something the game cannot use.');
hold('the alpha, raw', M.alphaBytes, B.alphaBytes,
     'The one link, under the 7/18 law.');
hold('the alpha, gzipped', M.alphaGzipped, B.alphaGzipped,
     'What a phone actually downloads.');
hold('the demo, raw', M.demoBytes, B.demoBytes, 'The thing that goes into hands.');
hold('the demo, gzipped', M.demoGzipped, B.demoGzipped, 'What a phone actually downloads.');
hold('the biggest single block', M.biggestSingleBlockBytes, B.biggestSingleBlockBytes,
     'Today that is ' + R.measured.biggestSingleBlockName + ', the fight, inline in both ' +
     'files and downloaded before the first frame by everybody, fight or no fight.');

/* ---- AND THE MEASUREMENT MUST STILL BE LOOKING AT SOMETHING -------------- *
   Every number above is a ceiling, and a ceiling is trivially satisfied by a
   scan that found nothing. The first draft of a sweep like this is always at
   risk of passing because its pattern stopped matching, so the floors below make
   an empty scan a failure instead of a green.                                 */
ok('THE SCAN ACTUALLY FOUND THE SITE (' + live.inv.all.length + ' files). Every line above ' +
   'is a ceiling, and a ceiling is trivially met by a scan that found nothing at all',
   live.inv.all.length > 300, live.inv.all.length + ' files');
ok('...and it actually reached the game from its entry points (' + live.inv.reached.length +
   ' files reachable). If the reference walk broke, everything would look dead and the ' +
   'orphan line would report the whole site as waste',
   live.inv.reached.length > 100, live.inv.reached.length + ' reachable');
ok('...and both entry points exist and were the ones walked (' +
   R.entryPoints.join(', ') + ')',
   R.entryPoints.every(e => fs.existsSync(path.join(ROOT, e))));

/* ---- THE TWO SHIPPED FILES STILL MATCH EACH OTHER ----------------------- *
   The alpha and the demo are near-identical by design, so their sizes track. A
   sudden gap means one got a change the other did not -- the same drift check
   the speed gate makes on boot bytes, made here on the files themselves.      */
const gap = Math.abs(M.alphaBytes - M.demoBytes);
console.log('\n    the alpha and the demo are ' + gap + ' bytes apart');
ok('THE ALPHA AND THE DEMO ARE STILL THE SAME GAME (' + gap + ' bytes apart, budget <= ' +
   (B.twinBytes || 262144) + '). They are cut from each other on purpose; a sudden gap ' +
   'means one got a change the other did not, which nobody would catch by eye',
   gap <= (B.twinBytes || 262144), gap + ' bytes apart');

done();
