/* THE HEAP STAYS FLAT (PLUMBER 6, 11/6/26; rule 418(b), ask line 475).
   PAOLO 11/6: 'my idea of this game was that it was always not taxing on any system, international, this is how the African kids
   can play it, on a little laptop.' Rule 418(b): the heap flat and under 200 MB through the whole loop.
   THE COORDINATOR MEASURED a 212 MB JavaScript heap on the demo (11/6). This gate plays PLUMBER 4's THE WHOLE LOOP PLAYS exactly
   as it is (the title, a new game, a town, the map, travel, an event, a fight, the victory, a save, a reload and CONTINUE) and
   reads the page's JavaScript heap after every step (every same-origin frame shares it: the shell, the map, the town, the fight):
   LIVE as it stands, HELD after a forced garbage collection (what the game keeps).
     H1 the loop played to the end (THE WHOLE LOOP PLAYS green; a heap read on a broken loop is about the wrong screen)
     H2 UNDER 200 MB: the live heap at every step is under 200 MB (the budget), the 8 MB-download goal's companion number
     H3 FLAT ACROSS A FIGHT: what the game holds on the map after the fight, its end screen and LEAVE, is within 30 MB of what it
        held on the map before it (a fight's board, men and pictures let go when the fight is over)
     H4 FLAT ACROSS A RELOAD: the game he continues holds no more than 30 MB over the first boot's map
     H5 THE INSTRUMENT SEES GROWTH: 64 MB planted in the page after the last step reads as at least 50 MB more (a reader that
        cannot see a leak cannot say there is none)
   node gates/the_heap_stays_flat_gate.js [--profile phone_portrait|computer]   (about four minutes: the loop's own length) */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const BUDGET_MB = 200, FLAT_MB = 30, PLANT_MB = 64;
const ai = process.argv.indexOf('--profile'), profile = ai > 0 ? process.argv[ai + 1] : 'phone_portrait';
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n + (why ? '  [' + why + ']' : '')); } else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

console.log('\nTHE HEAP STAYS FLAT (rule 418(b)): the whole loop on the demo, ' + profile + ', the heap read after every step\n');
const log = path.join(os.tmpdir(), 'bohemia_heap_' + process.pid + '.json');
const run = spawnSync(process.execPath, [path.join(ROOT, 'gates/the_whole_loop_plays_gate.js'), '--profile', profile],
  { cwd: ROOT, encoding: 'utf8', timeout: 900000, maxBuffer: 1 << 26, env: Object.assign({}, process.env, { BOHEMIA_HEAP_LOG: log, BOHEMIA_HEAP_PLANT: String(PLANT_MB) }) });
const out = (run.stdout || '') + (run.stderr || '');
let H = null; try { H = JSON.parse(fs.readFileSync(log, 'utf8')); } catch (e) { H = null; }
try { fs.unlinkSync(log); } catch (e) {}
const steps = (H && H.steps) || [];
for (const s of steps) console.log('    ' + String(s.at).padEnd(26).slice(0, 26) + ' live ' + String(s.liveMb).padStart(6) + ' MB   held ' + String(s.heldMb).padStart(6) + ' MB   (' + s.page + ')');
const loopLine = (out.match(/THE WHOLE LOOP PLAYS: \d+ passed, \d+ failed[^\n]*/) || ['(no result line)'])[0];
const broke = (out.match(/\*\*\* THE LOOP BROKE AT STEP[^\n]*/) || [''])[0];
ok('H1 the whole loop played to the end (' + loopLine + ')', run.status === 0 && steps.filter(s => !/^planted/.test(s.at)).length >= 11, broke || (run.error ? String(run.error.message) : ''));
const real = steps.filter(s => !/^planted/.test(s.at) && s.liveMb != null);
const peak = real.reduce((m, s) => Math.max(m, s.liveMb), 0), peakAt = (real.find(s => s.liveMb === peak) || {}).at;
ok('H2 the live heap stays under ' + BUDGET_MB + ' MB at every step (peak ' + peak + ' MB at ' + (peakAt || '?') + ')', real.length > 0 && peak < BUDGET_MB,
  real.length ? 'over the budget at: ' + real.filter(s => s.liveMb >= BUDGET_MB).map(s => s.at + ' ' + s.liveMb + ' MB').join(', ') : 'no heap was read');
const at = (re) => real.find(s => re.test(s.at));
const mapBefore = at(/^5 /) || at(/^4 /), mapAfter = at(/^8 /);
ok('H3 flat across a fight: the map holds within ' + FLAT_MB + ' MB of what it held before it (' + (mapBefore ? mapBefore.heldMb : '?') + ' -> ' + (mapAfter ? mapAfter.heldMb : '?') + ' MB)',
  !!(mapBefore && mapAfter) && mapAfter.heldMb - mapBefore.heldMb <= FLAT_MB, mapBefore && mapAfter ? 'the fight left ' + (mapAfter.heldMb - mapBefore.heldMb).toFixed(1) + ' MB behind' : 'the steps were not read');
const back = at(/^10 /), firstMap = at(/^4 /) || mapBefore;
ok('H4 flat across a reload: the continued game holds within ' + FLAT_MB + ' MB of the first boot\'s map (' + (firstMap ? firstMap.heldMb : '?') + ' -> ' + (back ? back.heldMb : '?') + ' MB)',
  !!(back && firstMap) && back.heldMb - firstMap.heldMb <= FLAT_MB, back && firstMap ? (back.heldMb - firstMap.heldMb).toFixed(1) + ' MB more' : 'not read');
const planted = steps.find(s => /^planted/.test(s.at)), last = real[real.length - 1];
ok('H5 the instrument sees growth: ' + PLANT_MB + ' MB planted reads as at least 50 MB more (' + (last ? last.heldMb : '?') + ' -> ' + (planted ? planted.heldMb : '?') + ' MB)',
  !!(planted && last) && planted.heldMb - last.heldMb >= 50, planted ? '' : 'no planted reading');
console.log('\nTHE HEAP STAYS FLAT: ' + pass + ' passed, ' + fail + ' failed  (peak ' + peak + ' MB live of a ' + BUDGET_MB + ' MB budget)');
process.exit(fail ? 1 : 0);
