/* ==========================================================================
   JOBS THAT FIT THE COMPANY  (JOBS [jobs that fit], 11/8/26, VAMILY rule 436(c), ask lines 102, 114, 521; rules 183, 192, 208, 254, 255)

   PAOLO: the first fifty days reward a small strong crew (the Lone Wolf plays like he remembers); most jobs fit the company the way
   Battle Brothers sizes its contracts (never 75% overpowered); the stars on a job tell the truth about how hard it is.
   Battle Brothers sizes a contract once, off the roster's levels (never its gear), and spends it on the enemy's own cost
   (bb_all/0827 Game Guide, bb_all/0828 Game Mechanics). Ours: records/target/bb/party_math.json job_contract, read by
   slices/bohemia_job_kinds.js __THE_CONTRACT_IS_THE_BUDGET__; every number in TUNING's one table, section Y.

   THE FILES (node, a second):
     T1  every number of job_contract has its row in TUNING's one table section Y with the same value, and section Y names the file
     T2  one count, never two: no kind the contract costs (beast_cost) is also thinned by the fight's own count_scale
     T3  the code reads the file, types none of it: the marked block, the hand-over (fight) and the stars' fights (fightsOf) cost the
         count the same way, a hunt's kills scale with the contract, and no beast_cost value is typed in the job kinds
   ON THE DEMO, OVER THE CAMPAIGN SEEDS (tools/bohemia_jobs_fit_the_company.js: the origin's own company out of the door, the seed
   switched inside the boot, every offer three places a valley could post read on AUTO through the shell's door, 12 plays a fight on
   the fight's own dice (the same fight plays the same within a boot; across boots the numbers have moved by up to 20 in 100 on the
   wolf and hyena jobs, so the bars carry that margin), the hour pinned to day,
   the shelf's own deal):
     D1  MOST JOBS FIT (rule 192(a)): A NEW CREW of three, days 1 and 20, JOBS_SEEDS seeds: at most JOBS_DEALT_MAX in 100 of every
         offer the job math deals are lost more often than won (worth under 0.5 on the AUTO count)
     D2  THE BOARDS HE SEES: through day 20 no posted job under the day's floor (rule 255), none lost more often than won on day one,
         and every valley's boards hold work (rule 335)
     D3  THE SMALL STRONG CREW (rule 183(b)): THE LONE WOLF alone, days 1 and 20: at most JOBS_WOLF_MAX in 100 dealt jobs lost more
         often than won, and at most 10 in 100 of the dire-wolf and hyena jobs
     D4  A BEAST STANDS AT ITS COST, A HUNT IS ONE CONTRACT (the new crew): at most JOBS_BEAST_MAX in 100 of the jobs whose fight is
         dire wolves or hyenas lost more often than won (before: 87), at most JOBS_HUNT_MAX in 100 of the hunts (before: 55); no wolf
         or hyena fight stands more of them than the contract's count at their cost, plus the pack's one more
     D5  THE GATE BITES (planted): the math before (job_contract taken away in the page) on the first JOBS_PLANT_SEEDS seeds fails D4
     D6  nothing threw
   THE STARS' TRUTH against fresh dice is gates/the_job_tells_the_truth_gate.js (rule 208(f)), re-run on this change.
   node gates/jobs_fit_the_company_gate.js     JOBS_SEEDS=20  JOBS_PLANT=1 (T1, T2, T3 bite on planted copies; D5 always runs)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const SEEDS = +(process.env.JOBS_SEEDS || 20), PLANT_SEEDS = +(process.env.JOBS_PLANT_SEEDS || 3);
const DEALT_MAX = +(process.env.JOBS_DEALT_MAX || 15), WOLF_MAX = +(process.env.JOBS_WOLF_MAX || 5), BEAST_MAX = +(process.env.JOBS_BEAST_MAX || 45), HUNT_MAX = +(process.env.JOBS_HUNT_MAX || 35);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nJOBS THAT FIT THE COMPANY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

/* ---------- THE FILES ---------- */
function filesLegs(PM, TABLE, KINDS_SRC, OURS, ENEM, tag) {
  const C = PM.job_contract, V = C && C.value;
  const Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '';
  const rows = V ? [].concat(Object.keys(V.beast_cost || {}).map(k => ['job_contract.beast_cost.' + k, V.beast_cost[k]]), [['job_contract.hunt_scales', V.hunt_scales ? 'on' : 'off'], ['job_contract.pack_flat', V.pack_flat]]) : [];
  const rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };
  const bad = rows.filter(([id, v]) => { const t = rowOf(id); return t == null || String(t).split(' ')[0] !== String(v); });
  ok('T1' + tag + ' every number of job_contract has its row in TUNING\'s one table section Y, the same value, the file named', !!(V && rows.length >= 4 && !bad.length && /party_math\.json job_contract/.test(Y) && C.source && C.why),
    bad.length ? 'missing or different: ' + bad.map(b => b[0] + '=' + b[1] + ' (table ' + rowOf(b[0]) + ')').join(', ') : rows.map(r => r[0].replace('job_contract.', '') + ' ' + r[1]).join(', '));
  const thin = Object.assign({}, (ENEM && ENEM.count_scale) || {}, (((OURS || {}).enemy_tiers || {}).value || {}).count_scale || {});
  const both = Object.keys((V && V.beast_cost) || {}).filter(k => thin[k] != null);
  ok('T2' + tag + ' one count: no kind the contract costs is also thinned by the fight\'s count_scale', !!V && !both.length, both.length ? 'in both: ' + both.join(', ') : Object.keys(V.beast_cost).join(', ') + ' only in the contract');
  const blk = KINDS_SRC.indexOf('__THE_CONTRACT_IS_THE_BUDGET__ (JOBS 11/8'), end = KINDS_SRC.indexOf('/__THE_CONTRACT_IS_THE_BUDGET__ ====');
  const handOver = /party\.faction = foeOf\(job, faction \|\| 'brigands', w\);\s*\n\s*if \(!\(extra && extra\.pack != null\)\) \{ party\.count = costed\(party\.count, party\.faction\)/.test(KINDS_SRC);
  const stars = /n: Math\.max\(1, \(what === 'pack' \? n : costed\(n, fo\)\) \| 0\)/.test(KINDS_SRC);
  const hunt = /job\.need = Math\.max\(1, Math\.round\(need0 \* contractMult\(sk\) \* \(bc0 == null \? 1 : bc0 \/ packFlat\(\)\)\)\)/.test(KINDS_SRC) && /if \(!giant\(job\.foe\) && !row\.pack_size\)/.test(KINDS_SRC);
  const code = KINDS_SRC.slice(KINDS_SRC.indexOf('*/', blk) + 2, end > 0 ? end : blk + 4000).replace(/\/\*[\s\S]*?\*\//g, '');   /* the block's code, its comments out */
  const typed = Object.values((V && V.beast_cost) || {}).filter(v => new RegExp('[^0-9.]' + String(v).replace('.', '\\.') + '[^0-9]').test(code));
  ok('T3' + tag + ' the code reads the file: the marked block, the hand-over and the stars\' fights cost the count alike, the hunt scales, nothing typed', blk > 0 && end > blk && handOver && stars && hunt && !typed.length,
    'block ' + (blk > 0) + ', hand-over ' + handOver + ', stars ' + stars + ', hunt ' + hunt + ', typed ' + JSON.stringify(typed));
}
const PM = J('records/target/bb/party_math.json'), TABLE = fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), 'utf8');
const KS = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_kinds.js'), 'utf8'), OURS = J('records/target/bb/ours.json'), ENEM = J('records/target/bb/bohemia_enemies.json');
filesLegs(PM, TABLE, KS, OURS, ENEM, '');
if (process.env.JOBS_PLANT) {   /* the file legs bite: a number moved off the table, a kind thinned twice, the hand-over left uncosted */
  console.log('  -- planted copies (JOBS_PLANT=1): each of T1, T2, T3 must FAIL below --');
  const P2 = JSON.parse(JSON.stringify(PM)); P2.job_contract.value.beast_cost.wolves = 0.9;
  const E2 = JSON.parse(JSON.stringify(ENEM)); E2.count_scale.wolves = 0.5;
  const K2 = KS.replace("party.count = costed(party.count, party.faction)", "party.count = party.count");
  const p0 = pass, f0 = fail; filesLegs(P2, TABLE, KS, OURS, ENEM, ' (planted: wolves 0.9)'); filesLegs(PM, TABLE, KS, OURS, E2, ' (planted: wolves thinned twice)'); filesLegs(PM, TABLE, K2, OURS, ENEM, ' (planted: the hand-over uncosted)');
  const bit = fail - f0; pass = p0 + 0; fail = f0;
  ok('T4 the planted copies bite: one red in each (3 of 9 legs)', bit === 3, bit + ' red');
}

/* ---------- ON THE DEMO ---------- */
function survey(args, tag) {
  const out = path.join(os.tmpdir(), 'jobs_fit_' + tag + '_' + process.pid + '.json');
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_fit_the_company.js'), '--json', out].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 7200000 });
  const r = JSON.parse(fs.readFileSync(out, 'utf8')); try { fs.unlinkSync(out); } catch (_e) {}
  return r;
}
const lostOf = L => L.filter(j => j.clean != null && j.clean < 0.5);
const pct = (a, b) => Math.round(100 * a.length / Math.max(1, b.length));
try {
  const CODES = ['K7QM9X', 'VEGAS7', 'DUST42', 'NEXNHB', 'BATT3R', 'MEADXX', 'CRASH5', 'REDRK9', 'SAHARA', 'HQQVER', 'BQNANZ', 'MQJAVE', 'FREMNT', 'SPRNGS', 'TRQPCA', 'PAHRMP', 'BQUZDR', 'NE22S7', 'SUMMRN', 'CHARZ5', 'GQQDSP', 'PRMM7X', 'APX99Z', 'JEAN44'].slice(0, SEEDS);
  const nc = survey(['--codes', CODES.join(','), '--origins', 'newcrew', '--days', '1,20', '--runs', '12', '--sample', '3', '--truth', '0'], 'newcrew').runs[0];
  const errs = [].concat(nc.errs || []);
  const dealt = [].concat(...nc.days.map(D => D.dealt)), posted = [].concat(...nc.days.map(D => D.posted));
  const seeds = new Set(nc.days.map(D => D.code)).size;
  ok('D1 most jobs fit: a new crew of three, days 1 and 20, ' + seeds + ' seeds: at most ' + DEALT_MAX + ' in 100 dealt jobs lost more often than won', !nc.err && seeds >= Math.min(20, SEEDS) && pct(lostOf(dealt), dealt) <= DEALT_MAX,
    lostOf(dealt).length + ' of ' + dealt.length + ' (' + pct(lostOf(dealt), dealt) + ' in 100); day 1 ' + pct(lostOf(nc.days.filter(D => D.day === 1).flatMap(D => D.dealt)), nc.days.filter(D => D.day === 1).flatMap(D => D.dealt)) + ', day 20 ' + pct(lostOf(nc.days.filter(D => D.day === 20).flatMap(D => D.dealt)), nc.days.filter(D => D.day === 20).flatMap(D => D.dealt)) + (nc.err ? ' ERR ' + nc.err.slice(0, 120) : ''));
  const floorOf = day => day <= 10 ? 0.5 : day >= 50 ? 0 : 0.5 * (50 - day) / 40;   /* job_danger.json's curve (ramp_floor 0.5 to day 10, none at 50) */
  const under = nc.days.filter(D => D.posted.some(j => j.clean != null && j.clean < floorOf(D.day) - 1e-9));
  const day1lost = lostOf(nc.days.filter(D => D.day === 1).flatMap(D => D.posted));
  ok('D2 the boards he sees: through day 20 nothing under the day\'s floor, nothing lost more than won on day one, every valley has work', !under.length && !day1lost.length && posted.length > 0 && !nc.days.some(D => !D.posted.length),
    posted.length + ' posted in ' + nc.days.length + ' valley-days; under the floor ' + under.length + '; day one lost more than won ' + day1lost.length);
  const C = nc.contract && nc.contract.beast_cost || {};
  const beastJobs = dealt.filter(j => j.faction === 'wolves' || j.faction === 'hyenas');
  const hunts = dealt.filter(j => j.plays === 'hunt-kind' && !j.rare);
  /* the most a contract can field for a new crew (the three skulls' base at Battle Brothers' floor, party_math.json job_bb) at the beast's cost, one more for the pack's fifth */
  const BB = PM.job_bb.value, most = c => Math.round(BB.base_men['3'] * BB.mult_min * c) + 1;
  const overBand = dealt.filter(j => C[j.faction] && j.most > most(C[j.faction]));
  ok('D4 a beast stands at its cost, a hunt is one contract: wolf and hyena jobs lost at most ' + BEAST_MAX + ' in 100, hunts at most ' + HUNT_MAX + ', no beast fight past its cost', !!nc.contract && beastJobs.length > 20 && hunts.length > 20 && pct(lostOf(beastJobs), beastJobs) <= BEAST_MAX && pct(lostOf(hunts), hunts) <= HUNT_MAX && !overBand.length,
    'wolf and hyena jobs ' + lostOf(beastJobs).length + ' of ' + beastJobs.length + ' (' + pct(lostOf(beastJobs), beastJobs) + ' in 100); hunts ' + lostOf(hunts).length + ' of ' + hunts.length + ' (' + pct(lostOf(hunts), hunts) + '); past the cost ' + overBand.length + (overBand.length ? ' ' + overBand.slice(0, 3).map(j => j.id + ' ' + j.faction + ' ' + j.most).join(', ') : ''));
  const wf = survey(['--codes', CODES.join(','), '--origins', 'wolf', '--days', '1,20', '--runs', '12', '--sample', '3', '--truth', '0'], 'wolf').runs[0];
  errs.push(...(wf.errs || []));
  const wd = [].concat(...wf.days.map(D => D.dealt)), wb = wd.filter(j => j.faction === 'wolves' || j.faction === 'hyenas'), thin = wf.days.filter(D => !D.posted.length);
  ok('D3 the small strong crew: the Lone Wolf alone, days 1 and 20: at most ' + WOLF_MAX + ' in 100 dealt jobs lost more often than won, at most 10 of the wolf and hyena jobs, work in every valley', !wf.err && pct(lostOf(wd), wd) <= WOLF_MAX && pct(lostOf(wb), wb) <= 10 && !thin.length && wf.days.length >= 2 * Math.min(20, SEEDS),
    lostOf(wd).length + ' of ' + wd.length + ' (' + pct(lostOf(wd), wd) + ' in 100); wolf and hyena jobs ' + lostOf(wb).length + ' of ' + wb.length + '; boards ' + Math.min(...wf.days.map(D => D.posted.length)) + ' to ' + Math.max(...wf.days.map(D => D.posted.length)) + ' jobs a valley' + (wf.err ? ' ERR ' + wf.err.slice(0, 120) : ''));
  const pl = survey(['--codes', CODES.slice(0, PLANT_SEEDS).join(','), '--origins', 'newcrew', '--days', '1,20', '--runs', '12', '--sample', '3', '--truth', '0', '--plant', 'old'], 'plant').runs[0];
  const pd = [].concat(...pl.days.map(D => D.dealt)), pb = pd.filter(j => j.faction === 'wolves' || j.faction === 'hyenas');
  ok('D5 the gate bites: the math before (job_contract taken away in the page, ' + PLANT_SEEDS + ' seeds) fails D4', pl.plant === 'old' && !pl.contract && pb.length > 0 && pct(lostOf(pb), pb) > BEAST_MAX,
    'planted: wolf and hyena jobs ' + lostOf(pb).length + ' of ' + pb.length + ' (' + pct(lostOf(pb), pb) + ' in 100) against the bar ' + BEAST_MAX);
  ok('D6 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the demo legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
