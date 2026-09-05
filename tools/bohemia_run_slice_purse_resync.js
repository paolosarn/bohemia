#!/usr/bin/env node
/* ============================================================================
   THE RUN SLICE'S PURSE IS A STALE COPY, AND THE MONEY LIVES IN IT (9/5/26)

   slices/BOHEMIA_RUN_CURRENT.html inlines engine/bohemia_purse.js and
   engine/bohemia_payday.js under its OWN marker (a slash-star "inlined:" banner) --
   which is not the marker tools/bohemia_city_module_resync.py looks for, so
   the run slice has never been resynced by anything. BB-THE-LETTER-IS-ONE
   names it as one of the three places carrying `[PENDING Paolo]` beside an
   empty table, and it was the only one nothing could reach.

   THIS IS NOT A SECOND COPY OF THE TABLES. It lifts the canonical block
   straight out of engine/bohemia_purse.js and splices it in, so the run slice
   cannot say a different number from the engine. Same reason PRICES is built
   from the economy's own GOODS instead of a list typed by hand: a second
   system drifts the day somebody edits one of them.

   RE-RUNNABLE. It matches on the SHAPE of the block, so running it twice is a
   no-op and running it after an engine change picks the change up.

     node tools/bohemia_run_slice_purse_resync.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const PURSE = path.join(ROOT, 'engine/bohemia_purse.js');

/* THE WHOLE MODULE, NOT A BLOCK OF IT. The first cut spliced only the TABLES and
   left everything below them stale, which is how the run slice ended up with a
   `payQuest` that returned ledger entries where the engine returns a map -- a second
   copy is a second copy however small the window is. It replaces the module body
   between its own banner and the banner of whatever is inlined next. */
function moduleBounds(html, file) {
  const banner = '/* inlined: ' + file + ' */';
  const a = html.indexOf(banner);
  if (a < 0) return null;
  const from = a + banner.length;
  const next = html.indexOf('/* inlined: engine/', from);
  const to = next < 0 ? html.length : next;
  return { from: from, to: to };
}

const purse = fs.readFileSync(PURSE, 'utf8');
let run = fs.readFileSync(RUN, 'utf8');
let changed = 0;

/* 1. the purse module, verbatim from the engine. */
{
  const b = moduleBounds(run, 'engine/bohemia_purse.js');
  if (!b) { console.log('FAIL: no purse banner in the run slice'); process.exit(1); }
  const wanted = '\n' + purse.replace(/\s+$/, '') + '\n';
  if (run.slice(b.from, b.to) !== wanted) {
    run = run.slice(0, b.from) + wanted + run.slice(b.to);
    changed++;
    console.log('  RESYNCED: engine/bohemia_purse.js into the run slice');
  } else console.log('  already fresh: engine/bohemia_purse.js');
}

/* 2. the market's currency. His 9/4 ruling moved it and the run slice never heard. */
if (run.indexOf("var SALVAGE_CURRENCY = 'resources';") >= 0) {
  run = run.split("var SALVAGE_CURRENCY = 'resources';")
           .join("var SALVAGE_CURRENCY = 'electricity';   /* batteries are the money, 9/4 */");
  changed++;
  console.log('  RESYNCED: SALVAGE_CURRENCY -> electricity');
} else {
  console.log('  already fresh: SALVAGE_CURRENCY');
}

/* 3. the header comment that still claims all three ship empty. A comment that
      asserts something the code stopped doing is the rot this repo keeps paying
      for -- five constants this month had one. */
const staleClaim = 'So PAYOUT, PRICES and PRODUCTION ship\n// EMPTY, and with an empty table the answer is NO_RULING';
const freshClaim = 'PAYOUT and PRICES now carry the ONE he\n// ruled on 8/15, denominated in the battery he ruled on 9/4, each value tagged;\n// PRODUCTION is still empty because produce() has no caller. An uncovered key is\n// still NO_RULING';
if (run.indexOf(staleClaim) >= 0) {
  run = run.split(staleClaim).join(freshClaim);
  changed++;
  console.log('  RESYNCED: the header comment that claimed the tables ship empty');
}

if (changed) { fs.writeFileSync(RUN, run); console.log('  -> run slice written (' + changed + ' change(s))'); }
else console.log('  -> nothing to do');
