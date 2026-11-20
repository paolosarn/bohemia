/* ==========================================================================
   A HUNT FITS THE CREW  (JOBS [a hunt fits], 11/20/26, row 574, VAMILY rules 461, 441; Battle Brothers never sends a new company
   at an Unhold)

   ROW 574 (PLUMBER 8, BESTIARY): 'A DAY-ONE HUNT CAN WIPE A NEW CREW ... ONE bison, longhorn, bear or sloth beats a crew of 3 ... so no
   size fixes it: ... WORLD/JOBS (a new crew never sent at one; Battle Brothers' way)'. The longhorn, the bear and the sloth are giants
   (never a pack, WORLD 9's __THE_GIANTS_ARE_RARE__); the ancient bison was still drawn for a hunt's pack on the open desert and the park.
   NOW the bison's look carries min_men (records/target/BOHEMIA_JOB_KINDS.json beast_looks.bison.min_men, 6) and a hunt's draw
   (slices/bohemia_job_kinds.js beastFor, __A_HUNT_FITS_THE_CREW__) never deals it to a company of fewer men (the map's crewCount).

     H1  the files: the line and its measured why, TUNING's row, the draw's code
     H2  the draw itself (lifted out of the job kinds and run on the real file, 3,000 packs on the bison's own grounds): never a bison at
         3 or 5 men, bison at 6 and 12; every other beast still drawn at 3; planted (the line taken away) bison at 3 again
     H3  the reason, fought again (tools/bohemia_fight_headless.js, AUTO both sides, 10 seeds): one ancient bison beats 3 farmhands at
         least 7 in 10; 6 win at least 9 in 10
     H4  on his phone (tools/bohemia_jobs_the_hunt_fits_the_crew_on_the_phone.js), the demo and the alpha, upright and sideways, a new
         crew: every hunt on the shelf taken at every town by the map's own contract door: no bison with his three men; bison with the
         company counted as six; planted with three, bison again; and the town's hunt that meets bison at six, taken with three and
         played to the end (every fight's foes read off its board): no bison, paid
     H5  nothing threw
   node gates/the_hunt_fits_the_crew_gate.js        HUNT_FILES=1 the files and the node legs only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nA HUNT FITS THE CREW: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const K = JSON.parse(T('records/target/BOHEMIA_JOB_KINDS.json')), JK = T('slices/bohemia_job_kinds.js'), TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md');
const Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '';
const rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };

/* H1 */
{ const B = (K.beast_looks || {}).bison || {};
  const h1 = [B.min_men === 6 && /8 in 10/.test(B.min_men_why || '') && /10\/10/.test(B.min_men_why || '') && /Unhold/.test(B.min_men_why || ''),
    rowOf('beast_looks.bison.min_men') === '6',
    /function tooBig\(k, men\)/.test(JK) && /!giant\(k\) && !tooBig\(k, men\) && w\[k\] > 0/.test(JK) && /root\.crewCount\(\)/.test(JK) && /__A_HUNT_FITS_THE_CREW__/.test(JK),
    (K.giants || {}).kinds && ['longhorns', 'bears', 'sloths'].every(k => K.giants.kinds.indexOf(k) >= 0)];
  ok('H1 the files: the bison waits for a company of six (measured, said), TUNING\'s row, the draw reads it and the map\'s count; the longhorn, the bear and the sloth stay giants (never a pack)', h1.every(Boolean), h1.map(x => x ? 1 : 0).join('')); }

/* H2: the draw, lifted out and run */
{ const i = JK.indexOf('  function giant(f)'), j = JK.indexOf('  function foeOf(job, foe, at)'), src = JK.slice(i, j);
  const draw = (men, plant, grounds) => { const D = JSON.parse(JSON.stringify(K)); if (plant) delete D.beast_looks.bison.min_men;
    let g = 0, seed = 7; const W = { DATA: D, root: { crewCount: () => men }, groundAt: () => grounds[(g++) % grounds.length] };
    vm.createContext(W); vm.runInContext(src + '\nthis.beastFor = beastFor;', W);
    const R = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }, n = {};
    for (let k = 0; k < 3000; k++) { const b = W.beastFor(0, 0, R); n[b] = (n[b] || 0) + 1; } return n; };
  const G = ['open_desert', 'golf_and_park'], all = ['open_desert', 'golf_and_park', 'hills', 'suburb_block', 'industrial', 'default'];
  const m3 = draw(3, false, G), m5 = draw(5, false, G), m6 = draw(6, false, G), m12 = draw(12, false, G), p3 = draw(3, true, G), a3 = draw(3, false, all), a6 = draw(6, false, all);
  const others = Object.keys(a6).filter(k => k !== 'bison').every(k => (a3[k] || 0) > 0);
  ok('H2 the draw (3,000 packs on the bison\'s grounds): no bison at 3 or 5 men, bison at 6 and 12; every other beast still drawn at 3; planted (no line) bison at 3 again',
    !m3.bison && !m5.bison && m6.bison > 0 && m12.bison > 0 && others && p3.bison > 0,
    'bison at 3 men ' + (m3.bison || 0) + ', 5 ' + (m5.bison || 0) + ', 6 ' + (m6.bison || 0) + ', 12 ' + (m12.bison || 0) + '; planted at 3 ' + (p3.bison || 0) + '; the valley at 3 ' + JSON.stringify(a3)); }

/* H3: the reason, fought again */
{ let r = null; try { const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js')), ctx = engine(), F = ctx.FIGHT;
    const crew = n => Array.from({ length: n }, () => ({ background: 'farmhand', level: 1 }));
    const won = (men) => { let w = 0; for (let s = 1; s <= 10; s++) { ctx.setSeed(s); F.setup({ auto: true, formation: null, kind: ['ruin', 'suburb', 'strip'][s % 3], deploy: false, company: crew(men), party: { count: 1, days: 1, difficulty: 0, faction: 'bison' } });
      let g = 0; while (!F.S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); F.S.events = []; g++; } if (F.S.result === 'won') w++; } return w; };
    r = { three: won(3), six: won(6) }; } catch (e) { r = { err: String(e.message).slice(0, 120) }; }
  ok('H3 the reason, fought again (AUTO, 10 seeds): one ancient bison beats 3 farmhands at least 7 in 10; 6 win at least 9 in 10', !r.err && r.three <= 3 && r.six >= 9, JSON.stringify(r)); }

if (process.env.HUNT_FILES) done();

/* H4, H5: on his phone */
function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'hf_' + tag + '_' + process.pid);
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_hunt_fits_the_crew_on_the_phone.js'), '--out', out, '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 1500000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'hunt_fits_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')], rows = [], errs = [];
  runs.forEach(r => r.walks.forEach(w => { rows.push(w); (w.errs || []).forEach(e => errs.push(e)); }));
  const bad = rows.filter(w => w.err || !w.three || w.three.company !== 3 || (w.three.kinds.bison | 0) !== 0 || !(w.six && w.six.kinds.bison > 0) || !(w.planted && w.planted.kinds.bison > 0) ||
    !w.hunt || !w.hunt.paid || !w.hunt.fights.length || w.hunt.fights.some(f => f.kinds.indexOf('ancient_bison') >= 0) || w.hunt.company !== 3);
  ok('H4 on his phone, the demo and the alpha, upright and sideways: every hunt at every town by the map\'s own door: no bison with his three men, bison at six, bison at three when planted; the town\'s hunt that meets bison at six, taken with three and played to the end: no bison in any fight, paid',
    rows.length === 4 && !bad.length,
    rows.map(w => (w.alpha ? 'alpha ' : 'demo ') + (w.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (w.err ? 'ERR ' + w.err : w.three.hunts + ' hunts, bison at 3: ' + (w.three.kinds.bison | 0) + ', at 6: ' + (w.six.kinds.bison | 0) + ', planted: ' + (w.planted.kinds.bison | 0) + '; ' + w.hunt.id + ' at ' + w.hunt.town + ': ' + w.hunt.fights.map(f => f.kinds.join('+') + ' x' + f.n).join(', ') + ', paid ' + (w.hunt.paid || {}).paid)).join(' | '));
  ok('H5 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
