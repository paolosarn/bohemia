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
   switched inside the boot, every offer the place's tier could post read on AUTO through the shell's door, the shelf's own deal):
     D1  MOST JOBS FIT (rule 192(a)): A NEW CREW of three, days 1 and 20, JOBS_SEEDS seeds: of every offer the job math deals, at
         most JOBS_DEALT_MAX in 100 are lost more often than won (worth under 0.5)
     D2  THE BOARDS HE SEES: through day 20 no posted job is lost more often than won, and no board is empty (rules 255, 335)
     D3  THE SMALL STRONG CREW (rule 183(b)): THE LONE WOLF alone, days 1 and 20: at most JOBS_WOLF_MAX in 100 dealt jobs lost more
         often than won, and his boards post at least 20 jobs in every valley
     D4  THE HUNT IS ONE CONTRACT: no hunt dealt to the new crew (not a giant) is lost more often than won unless it wears three stars;
         and no dire-wolf or hyena fight the job math deals stands more of them than the contract's count at their cost (+1)
     D5  THE GATE BITES (planted): the math before (job_contract taken away in the page, JOBS_PLANT_SEEDS seeds) fails D1
     D6  nothing threw
   THE STARS' TRUTH against fresh dice is gates/the_job_tells_the_truth_gate.js (rule 208(f)), re-run on this change.
   node gates/jobs_fit_the_company_gate.js     JOBS_SEEDS=20  JOBS_PLANT=1 (T1, T2, T3 bite on planted copies; D5 always runs)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const SEEDS = +(process.env.JOBS_SEEDS || 20), PLANT_SEEDS = +(process.env.JOBS_PLANT_SEEDS || 3);
const DEALT_MAX = +(process.env.JOBS_DEALT_MAX || 10), WOLF_MAX = +(process.env.JOBS_WOLF_MAX || 5);
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
  const hunt = /job\.need = Math\.max\(1, Math\.round\(need0 \* contractMult\(sk\) \* \(bc0 == null \? 1 : bc0 \/ packFlat\(\)\)\)\)/.test(KINDS_SRC);
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
  const nc = survey(['--codes', CODES.join(','), '--origins', 'newcrew', '--days', '1,20', '--runs', '8', '--sample', '3', '--truth', '0'], 'newcrew').runs[0];
  const errs = [].concat(nc.errs || []);
  const dealt = [].concat(...nc.days.map(D => D.dealt)), posted = [].concat(...nc.days.map(D => D.posted));
  const seeds = new Set(nc.days.map(D => D.code)).size;
  ok('D1 most jobs fit: a new crew of three, days 1 and 20, ' + seeds + ' seeds: at most ' + DEALT_MAX + ' in 100 dealt jobs lost more often than won', !nc.err && seeds >= Math.min(20, SEEDS) && pct(lostOf(dealt), dealt) <= DEALT_MAX,
    lostOf(dealt).length + ' of ' + dealt.length + ' (' + pct(lostOf(dealt), dealt) + ' in 100); day 1 ' + pct(lostOf(nc.days.filter(D => D.day === 1).flatMap(D => D.dealt)), nc.days.filter(D => D.day === 1).flatMap(D => D.dealt)) + ', day 20 ' + pct(lostOf(nc.days.filter(D => D.day === 20).flatMap(D => D.dealt)), nc.days.filter(D => D.day === 20).flatMap(D => D.dealt)) + (nc.err ? ' ERR ' + nc.err.slice(0, 120) : ''));
  const empty = nc.days.filter(D => D.posted.length < D.places);
  ok('D2 the boards he sees: through day 20 no posted job lost more often than won, every board has work', !lostOf(posted).length && posted.length > 0 && !nc.days.some(D => !D.posted.length),
    posted.length + ' posted, ' + lostOf(posted).length + ' lost more than won, ' + nc.days.length + ' valley-days' + (empty.length ? ', ' + empty.length + ' with a board short of one a place' : ''));
  const hunts = dealt.filter(j => j.plays === 'hunt-kind' && !j.rare && j.most !== 1);   /* a giant's hunt is one animal (rule 389), the rare hard one */
  const badHunt = lostOf(hunts).filter(j => j.stars !== 3);
  const C = nc.contract && nc.contract.beast_cost || {};
  /* the most a contract can field for a new crew (the three skulls' base at Battle Brothers' floor, party_math.json job_bb) at the beast's cost, one more for the pack's fifth */
  const BB = PM.job_bb.value, most = c => Math.round(BB.base_men['3'] * BB.mult_min * c) + 1;
  const overBand = dealt.filter(j => C[j.faction] && j.most > most(C[j.faction]));
  ok('D4 the hunt is one contract: every hunt lost more often than won wears three stars; no dire-wolf or hyena fight past the contract\'s count at its cost', hunts.length > 0 && !badHunt.length && !overBand.length && !!nc.contract,
    hunts.length + ' hunts dealt, ' + lostOf(hunts).length + ' lost more than won (all three stars: ' + !badHunt.length + '); beast fights past their cost ' + overBand.length + (overBand.length ? ' ' + overBand.slice(0, 3).map(j => j.id + ' ' + j.faction + ' ' + j.most).join(', ') : ''));
  const wf = survey(['--codes', CODES.join(','), '--origins', 'wolf', '--days', '1,20', '--runs', '8', '--sample', '3', '--truth', '0'], 'wolf').runs[0];
  errs.push(...(wf.errs || []));
  const wd = [].concat(...wf.days.map(D => D.dealt)), thin = wf.days.filter(D => D.posted.length < 20);
  ok('D3 the small strong crew: the Lone Wolf alone, days 1 and 20: at most ' + WOLF_MAX + ' in 100 dealt jobs lost more often than won, 20 jobs or more on his boards in every valley', !wf.err && pct(lostOf(wd), wd) <= WOLF_MAX && !thin.length && wf.days.length >= 2 * Math.min(20, SEEDS),
    lostOf(wd).length + ' of ' + wd.length + ' (' + pct(lostOf(wd), wd) + ' in 100); boards ' + Math.min(...wf.days.map(D => D.posted.length)) + ' to ' + Math.max(...wf.days.map(D => D.posted.length)) + ' jobs' + (wf.err ? ' ERR ' + wf.err.slice(0, 120) : ''));
  const pl = survey(['--codes', CODES.slice(0, PLANT_SEEDS).join(','), '--origins', 'newcrew', '--days', '1,20', '--runs', '8', '--sample', '3', '--truth', '0', '--plant', 'old'], 'plant').runs[0];
  const pd = [].concat(...pl.days.map(D => D.dealt));
  ok('D5 the gate bites: the math before (job_contract taken away in the page, ' + PLANT_SEEDS + ' seeds) fails D1', pl.plant === 'old' && !pl.contract && pct(lostOf(pd), pd) > DEALT_MAX,
    'planted: ' + lostOf(pd).length + ' of ' + pd.length + ' (' + pct(lostOf(pd), pd) + ' in 100) against the bar ' + DEALT_MAX);
  ok('D6 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the demo legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
