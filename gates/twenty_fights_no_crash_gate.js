/* ==========================================================================
   TWENTY FIGHTS, NO CRASH  (RUN, 10/25/26, VAMILY [the crash before the fight], rule 173(d))

   PAOLO 10/25: "the game keeps crashing at random times, usually right before a fight loads up; maybe it's because of the
   amount of people on the screen."

   MEASURED BEFORE (BUILD 10/25o, tools/bohemia_run_the_fight_weight.js, his phone's profile, twelve of his against
   thirteen): the tab went 1.09 GB on the map to 1.94 GB as the fight loaded and 2.07 GB at its end screen; the fight's
   bitmaps alone 547 to 567 MB, canvases and bitmaps together about 755 MB. A phone's WebContent process is killed near
   1.5 GB (WebKit's own number, lower on phones with less memory) and Safari refuses canvases past 224 to 576 MB by version
   (384 MB on iOS 15). records/BOHEMIA_RUN_THE_CRASH_AND_ONLY_THE_FINAL_LOOK_10_25_26.md

   THE GATE, beside the crash hunt (tools/bohemia_run_the_crash_hunt.js): the demo as a stranger, the widest company the
   door builds (THE BLOCK WATCH, twelve men) on OUTLIVED IT, and TWENTY of the biggest fights the game rolls in a row (day
   100, the party math's cap, the four road factions in turn), each the way he plays it: the map, the MEET card, ENGAGE,
   the fight's load, AUTO, the end screen, LEAVE, the map. On his computer and on a phone held upright. At every step the
   tab is told memory is CRITICAL (what a phone does before it kills a tab: it throws away every picture nothing is
   drawing) and read from the operating system.
     T1 twenty fights stood and ended, and the tab never crashed
     T2 they were the biggest: twelve of his every time, against six to thirteen, at least once thirteen
     T3 THE CEILING: the tab never holds more than 1,300 MB after the notice (200 MB of room under a phone's 1.5 GB)
     T4 canvases and bitmaps together never past 384 MB (Safari's canvas line on iOS 15)
     T5 nothing creeps for ever: over the last five fights the map comes back within 60 MB of itself
     T6 the men were drawn from their packed sheets (__THE_SHEETS_ARE_PACKED__), and nothing threw
   node gates/twenty_fights_no_crash_gate.js [--profile computer|phone_portrait] [--fights 20]   (about 15 min a profile)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? ' (' + why + ')' : '')); } };
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PROFILES = arg('profile', null) ? [arg('profile')] : ['computer', 'phone_portrait'];
const N = +arg('fights', 20);
const CEIL = 1300, CANVAS = 384, CREEP = 60;

for (const prof of PROFILES) {
  console.log('== ' + prof + ', ' + N + ' fights');
  const out = path.join(ROOT, 'records/run/TWENTY_FIGHTS_' + prof + '.json');
  const r = spawnSync('node', [path.join(ROOT, 'tools/bohemia_run_the_fight_weight.js'), '--profile', prof, '--fights', String(N), '--auto', '6000', '--press', '--out', out],
    { cwd: ROOT, encoding: 'utf8', timeout: 3600000, maxBuffer: 64 * 1048576 });
  let H = null; try { H = JSON.parse(fs.readFileSync(out, 'utf8')); } catch (e) {}
  if (!H) { ok(prof + ': the run wrote its record', false, String(r.stderr || r.stdout || '').slice(-300)); continue; }
  const F = H.fights || [], S = H.steps || [];
  const stood = F.filter((f) => !f.error && f.men).length;
  ok('T1 ' + prof + ': ' + stood + ' of ' + N + ' fights stood and ended, the tab ' + (H.crashed ? 'CRASHED at ' + H.crashed.step : 'never crashed'), !H.crashed && stood === N && F.length === N);
  const men = F.filter((f) => f.men).map((f) => f.men.ours + 'v' + f.men.theirs);
  ok('T2 ' + prof + ': the biggest fights (' + [...new Set(men)].join(' ') + ')', F.every((f) => f.men && f.men.ours === 12 && f.men.theirs >= 6) && F.some((f) => f.men && f.men.theirs === 13));
  const pressed = S.map((s) => [(s.pressedMB || {}).renderer || 0, s.label]).sort((a, b) => b[0] - a[0]);
  ok('T3 ' + prof + ': THE CEILING, the most the tab held after the notice ' + pressed[0][0] + ' MB (' + pressed[0][1] + '; ceiling ' + CEIL + ')', pressed[0][0] > 0 && pressed[0][0] <= CEIL);
  const locked = S.map((s) => [s.lockedMB || 0, s.label]).sort((a, b) => b[0] - a[0]);
  ok('T4 ' + prof + ': canvases and bitmaps at most ' + locked[0][0] + ' MB (' + locked[0][1] + '; line ' + CANVAS + ')', locked[0][0] <= CANVAS);
  const back = S.filter((s) => /back on the map/.test(s.label)).map((s) => (s.pressedMB || {}).renderer || 0), last = back.slice(-5);
  ok('T5 ' + prof + ': the map after each fight ' + back.join(' ') + ' MB; the last five within ' + (Math.max(...last) - Math.min(...last)) + ' MB (at most ' + CREEP + ')', last.length === 5 && Math.max(...last) - Math.min(...last) <= CREEP);
  const packed = F.reduce((a, f) => a + ((f.packed && f.packed.used) | 0), 0);
  ok('T6 ' + prof + ': the men drawn from packed sheets (' + packed + ' atlases over the run) and nothing threw (' + (H.errors || []).length + ')', packed > N * 10 && (H.errors || []).length === 0);
}
console.log('TWENTY FIGHTS, NO CRASH: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
