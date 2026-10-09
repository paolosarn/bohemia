/* ==========================================================================
   ONE FIGHT  (COMBAT [one fight], 10/9; from MODS [what is data and what is not], rules 22 and 63d)

   MODS 10/9: the demo still shipped the sealed OLD fight (COMBAT_B64, the frozen Dead Eye Dial, 17 big
   tables, 0 data files) beside the rebuilt one, so a modder who edits records/target/bb/weapons.json
   changes only one of the two: 'two truths for one gun'. Measured on the baked demo 10/9: nothing a
   stranger can do opens the old fight (the map's doors open slices/BOHEMIA_FIGHT.html, the old RUN slice
   is never loaded, the cold open has no caller), but the shell WARMED it on idle anyway: a hidden 1.95 MB
   copy of the old game booting on every phone that sat still.

   LEGS, on the baked demo:
     O1  idle twelve seconds on the map: the old fight is never built (no #combatFrame)
     O2  a road fight opens THE REBUILT FIGHT (slices/BOHEMIA_FIGHT.html) and still no old fight is built
     O3  the rebuilt fight reads its weapons from records/target/bb/weapons.json, the one truth (its own
         data list names the file)
   Not here, and routed: the 2.67 MB of COMBAT_B64 still DOWNLOADS with both files until PLUMBER
   [first load] cuts it (blob_integrity and alpha_loads hold it in place today); the alpha's COMBAT tab
   still opens the old fight for its own gates (RUN's call site).
   node gates/one_fight_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n + (why ? '  [' + why + ']' : '')); } else { fail++; console.log('  FAIL ' + n + (why ? '  [' + why + ']' : '')); } };
(async () => {
  console.log('\nONE FIGHT  (COMBAT [one fight])\n');
  const d = await drive.open({});
  await d.page.waitForTimeout(12000);
  const idle = await d.page.evaluate(() => ({ old: !!document.getElementById('combatFrame'), file: location.pathname.split('/').pop() }));
  ok('O1 *** IDLE ON THE MAP, THE OLD FIGHT IS NEVER BUILT *** (it warmed a hidden 1.95 MB copy until 10/9)', !idle.old, idle.file + ', combatFrame ' + (idle.old ? 'BUILT' : 'absent'));
  const st = await d.fr.evaluate(async () => {
    for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
    try { stepOnce(0); stepOnce(4); } catch (_e) {}
    return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 });
  }).catch(e => 'threw ' + e.message);
  let src = null;
  for (let i = 0; i < 100 && !src; i++) { src = await d.page.evaluate(() => { const f = document.getElementById('fightFrame'); return f ? (f.getAttribute('src') || '') : null; }); if (!src) await d.page.waitForTimeout(200); }
  const old2 = await d.page.evaluate(() => !!document.getElementById('combatFrame'));
  ok('O2 a road fight opens the rebuilt fight, and still no old fight is built', !!src && /BOHEMIA_FIGHT\.html/.test(src) && !old2, 'started ' + st + ', fightFrame ' + src + ', combatFrame ' + (old2 ? 'BUILT' : 'absent'));
  const fight = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  ok('O3 the rebuilt fight reads its guns from records/target/bb/weapons.json, the one truth', /records\/target\/bb\/weapons\.json/.test(fight) && !/COMBAT_B64/.test(fight));
  ok('nothing threw', d.errs.length === 0, d.errs[0] || '');
  await d.close();
  console.log('ONE FIGHT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); console.log('ONE FIGHT: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
