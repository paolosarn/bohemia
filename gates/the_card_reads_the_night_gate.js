/* ==========================================================================
   THE CARD READS THE NIGHT  (JOBS [a night's roll], 11/20/26, VAMILY rules 461, 441, 454(a))

   A job's card reads each fight's crowd off the danger reader's roll (fightsFor), and the fight is rolled the moment it is handed over
   (rollInto). The roll weighs who walks by the hour (FACTIONS 11/3, bohemia_enemies.json road.night: the block watch goes home at
   night and the water people come out) and by the fights the company has met (ours.json road_factions after_fights). The card read
   every fight at the hour of reading and the fights met so far, so a fight in the dark was read with the day's crowd: since 11/14 the
   card said 'about N of whoever comes in the dark'. MEASURED (a new crew past its first fight, the demo upright, every job with a fight
   in the dark): the fuel depot's watch till dawn read 5 of the Block Watch (about +135 CLOUT) and 2 water people came.
   NOW fightsOf marks a fight that comes in the dark (dark), the danger reader rolls it at night and each sure fight after the ones before
   it (__THE_CARD_READS_THE_NIGHT__), and the card names them: 'a fight with 2 water people in the dark'.

     R1  the files: the dark mark, the roll's own hour and count, the card's words
     R2  on his phone (tools/bohemia_jobs_the_card_reads_the_night_on_the_phone.js), the demo and the alpha, upright and sideways, a new
         crew past its first fight: every job with a fight in the dark, its card read at noon, walked by the map's own steps and clock
         till each fight is handed over: the crowd the game rolls for it is the card's, fight by fight (two-wave watches among them), and
         the card names each night fight (no 'whoever' left)
     R3  nothing threw
   node gates/the_card_reads_the_night_gate.js        NIGHT_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE CARD READS THE NIGHT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const JK = T('slices/bohemia_job_kinds.js'), DG = T('slices/bohemia_job_danger.js');

{ const r1 = [/if \(out\.length > n0 && \(L\.dark \|\| \(L\.wait && i > 0 && LL\[0\]\.dark\)\)\) out\[out\.length - 1\]\.dark = true;/.test(JK),
    /night: f\.dark \? true : undefined, met: metAt/.test(DG) && /if \(ctx\.night != null\) o\.night = !!ctx\.night;/.test(DG) && /met: ctx\.met != null \? ctx\.met : metNow\(\)/.test(DG) && /if \(!f\.road && f\.p >= 0\.999\) before\+\+;/.test(DG),
    /else if \(f && f\.dark && f\.band\) w \+= ', a fight with ' \+ who\(f\) \+ ' in the dark';/.test(JK),
    /party\.faction = foeOf\(job, faction \|\| 'brigands', near \|\| w\);/.test(JK) && JK.indexOf('var dz = null;') < JK.indexOf("party.faction = foeOf(job, faction || 'brigands', near || w);")];
  ok('R1 the files: a fight that comes in the dark is marked, the reader rolls it at night and after the fights before it, the card names it, and a job\'s animal is picked at the card\'s place', r1.every(Boolean), r1.map(b => b ? 1 : 0).join('')); }
if (process.env.NIGHT_FILES) done();

function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'cn_' + tag + '_' + process.pid);
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_card_reads_the_night_on_the_phone.js'), '--out', out, '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 1800000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'card_night_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')], rows = [], errs = [];
  runs.forEach(r => r.walks.forEach(w => { rows.push(w); (w.errs || []).forEach(e => errs.push(e)); }));
  const bad = rows.filter(w => { const J = w.jobs || []; return w.err || J.length < 4 || !J.some(j => j.pairs.length >= 2) || J.some(j => !j.same || j.walkErr || /whoever comes in the dark/.test(j.words)); });
  ok('R2 on his phone, the demo and the alpha, upright and sideways: every job with a fight in the dark, read at noon and walked till each fight is handed over: the crowd rolled is the card\'s, fight by fight, and the card names it',
    rows.length === 4 && !bad.length,
    rows.map(w => (w.alpha ? 'alpha ' : 'demo ') + (w.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (w.err ? 'ERR ' + w.err : (w.jobs || []).map(j => j.id + ' ' + j.pairs.map(p => (p.met || []).length + (p.night ? 'n' : 'd')).join('+') + (j.same ? '' : ' DIFFERENT')).join(', '))).join(' | '));
  ok('R3 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
