/* ============================================================================
   VALLEY SCALE GATE (7/30/26) — the valley has ONE size, and it is the one the
   law says.

   Paolo 7/30/26: "The districts should have always been full size bro."

   He was right, and the reason they were not is the part worth keeping. laws/
   BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md is LOCKED, is titled as REVOKING
   the 24m slot scale of 7/5, says a cell is 128x128 fine cells (96m x 96m), and
   its own checklist line marks the relock DONE. It was not done. bohemia_overmap.js
   still read 32 on 7/30, three and a half weeks later.

   IT SURVIVED THAT LONG BECAUSE THERE WERE TWO SOURCES OF TRUTH FOR ONE NUMBER.
   bohemia_world.js carried its own `var T = 128` and never read the overmap, so
   the RUN was right by an independent constant while the CITY was wrong by the
   real one. Both halves looked internally consistent. Nothing compared them.
   Same shape as the ONE MAP seed bug (hashSeed('bohemia') against a hardcoded
   2026) found in the same module the same week.

   So this gate does not check that the number is 128 and stop there. It checks
   that there is only ONE number:

     1. the overmap's TILE_FINE equals the LAW's number, READ OUT OF THE LAW FILE
        rather than typed in here. A gate that hardcodes the value it guards will
        happily agree with itself after somebody edits the law.
     2. SLOT_FINE agrees with TILE_FINE
     3. the world model's TILE_PER_CELL is the same value and comes FROM the
        overmap, not from a second literal
     4. the derived metres and valley span come out to what the law claims
     5. no other engine module reintroduces a hardcoded scale constant

   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LAW = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* ---- 1. what does the LAW say the number is? ----------------------------- */
const lawText = fs.readFileSync(LAW, 'utf8');
const m = lawText.match(/(\d+)\s*x\s*\1\s*fine cells/i);
ok('the VALLEY SCALE LAW states a cell size this gate can read', !!m);
const LAW_N = m ? parseInt(m[1], 10) : 0;
ok('the law\'s cell size is a sane power of two', LAW_N >= 32 && (LAW_N & (LAW_N - 1)) === 0);

/* ---- 2. the overmap obeys it --------------------------------------------- */
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
ok('overmap TILE_FINE === the law (' + OM.TILE_FINE + ' vs ' + LAW_N + ')', OM.TILE_FINE === LAW_N);
ok('overmap SLOT_FINE === TILE_FINE (one grid, not two)', OM.SLOT_FINE === OM.TILE_FINE);
ok('overmap CELL_M is the law\'s 0.75 m per fine cell', OM.CELL_M === 0.75);
ok('overmap TILE_M is DERIVED, never typed (' + OM.TILE_M + ')', OM.TILE_M === OM.TILE_FINE * OM.CELL_M);

/* ---- 3. the world model uses THAT number, not a copy of it ---------------
   The whole bug. A world that happens to equal the overmap today but reads a
   literal is one edit away from disagreeing again, so the SOURCE TEXT is checked
   as well as the value. */
const worldSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_world.js'), 'utf8');
ok('bohemia_world.js takes its scale FROM the overmap, not a second literal',
   /var\s+T\s*=\s*OM\.TILE_FINE\s*;/.test(worldSrc));
ok('bohemia_world.js no longer hardcodes a cell size',
   !/var\s+T\s*=\s*\d+\s*;/.test(worldSrc));

const World = require(path.join(ROOT, 'engine/bohemia_world.js'));
const w = World.world(2691674296);      // hashSeed('bohemia'), the ONE MAP seed
ok('world TILE_PER_CELL === overmap TILE_FINE (' + w.TILE_PER_CELL + ' vs ' + OM.TILE_FINE + ')',
   w.TILE_PER_CELL === OM.TILE_FINE);
ok('world tile span === cells x TILE_PER_CELL', w.tiles === w.n * w.TILE_PER_CELL);

/* ---- 4. the numbers Paolo actually feels --------------------------------- */
const metres = OM.TILE_FINE * OM.CELL_M;
const valleyMi = (OM.OVER_N * metres) / 1609.34;
ok('a district is ' + metres + 'm on a side (a neighbourhood, not a lot)', metres >= 90);
ok('the valley is over 5 miles across (' + valleyMi.toFixed(2) + ' mi)', valleyMi > 5);
ok('a district holds ' + (OM.TILE_FINE * OM.TILE_FINE) + ' walkable cells',
   OM.TILE_FINE * OM.TILE_FINE >= 16384);

/* ---- 5. nothing sneaks a third copy back in ------------------------------ */
const engineDir = path.join(ROOT, 'engine');
const suspects = [];
for (const f of fs.readdirSync(engineDir)) {
  if (!f.endsWith('.js')) continue;
  if (f === 'bohemia_overmap.js') continue;                 // the one legal home
  const src = fs.readFileSync(path.join(engineDir, f), 'utf8');
  // strip comments first: the modules EXPLAIN this history in prose, and a gate
  // that reads prose fails the very fix it guards (learned on the integration gate)
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (/(TILE_FINE|SLOT_FINE|TILE_PER_CELL)\s*[:=]\s*\d+/.test(code)) suspects.push(f);
}
ok('no engine module outside the overmap assigns a scale constant a literal'
   + (suspects.length ? ' (' + suspects.join(', ') + ')' : ''), suspects.length === 0);

console.log('VALLEY SCALE GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (1 cell = ' + OM.TILE_FINE + 'x' + OM.TILE_FINE + ' = ' + metres + 'm, valley '
  + valleyMi.toFixed(2) + ' mi across)');
process.exit(fail ? 1 : 0);
