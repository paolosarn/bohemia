/* ==========================================================================
   BOHEMIA — WIRED IN A TAB GATE (8/11/26).
   SHOW IT IN A TAB, NEVER A HUNT (Paolo 8/11, LOCKED):

     "you will never ever ever again. Tell me hey check this out by opening
      the run tab... If you have something to show me put it in a different
      tab or I can observe it, but don't waste my time telling me hey Hunt
      for this and I'm not even gonna tell you where it is."

   Four families were wired into the walked world in one day and every reply
   ended with "walk the RUN tab" - a hunt across a valley with no door. NAME
   THE TAB was obeyed in letter (a tab was named) and broken in spirit (the
   thing was not IN the room).

   THE MECHANICAL HALF THIS GATE HOLDS: every tile form whose STATUS line says
   "AND WIRED" must have a card in the ART tab carrying a REAL screenshot of
   the wiring live in the game:
     - records/target/ART_WIRED_<FORM>.png exists (the shot is published)
     - slices/BOHEMIA_ART_CURRENT.html references it (the card is in the room)
   A wiring that ships without its card goes red, so the hunt can never come
   back. Law: laws/BOHEMIA_ADDENDUM_SHOW_IT_IN_A_TAB_NEVER_A_HUNT_8_11_26.md

     node gates/wired_in_tab_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; }
  else { fail++; console.log('  FAIL ' + what); }
}

const tab = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ART_CURRENT.html'), 'utf8');
const formsDir = path.join(ROOT, 'records/tileforms');
const wired = fs.readdirSync(formsDir).filter(f => f.endsWith('.md')).filter(f => {
  const s = fs.readFileSync(path.join(formsDir, f), 'utf8');
  return /^- STATUS:.*AND WIRED/m.test(s);
});

ok('at least one wiring exists to check (else this gate is vacuous)', wired.length >= 1);
wired.forEach(f => {
  const id = f.split('_')[0];
  const shot = 'ART_WIRED_' + id + '.png';
  ok('the ' + id + ' wiring has its live screenshot published (records/target/' + shot + ')',
     fs.existsSync(path.join(ROOT, 'records/target', shot)));
  ok('and the ART tab shows it as a card (no hunt: he taps ART and SEES it)',
     tab.indexOf(shot) >= 0);
});
ok('the tab never sends him hunting the RUN tab for lane work',
   !/walk the RUN tab/i.test(tab));

console.log('WIRED IN A TAB GATE: ' + pass + ' passed, ' + fail + ' failed  ('
            + wired.length + ' wired families, every one visible in the ART tab)');
process.exit(fail ? 1 : 0);
