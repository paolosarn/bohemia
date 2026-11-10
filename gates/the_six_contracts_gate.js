/* ==========================================================================
   THE SIX CONTRACTS  (JOBS [more contract kinds], 11/10/26, VAMILY rule 443(c), 441; EYES row 551; ask line 567)

   THE COORDINATOR, from his words: more contract kinds the Battle Brothers way (escort a caravan, defend a place, hunt a beast,
   deliver, clear a place, collect a debt), each sized by the 11/10d budget, each a job he takes from a person with a face, each ending
   with its real foe named. Battle Brothers' civilian contracts (bb_all/0441: Escort Caravan, Defend Settlement, Roaming Beasts and the
   Hunting contracts, Deliver Item, Drive Away Bandits) and its one base value a contract (bb_all/0827).

   THE FILES (node, a second):
     S1  each of the six kinds has at least four ordinary offers on the boards (the shelf and the job kinds' board people), at least
         two of the three tiers, each from a person with a face (a client's name and look), each saying its pay ({pay}), draft
     S2  every job's fight names its foe: the hand-over (fight()) carries the job's own name; foe_says covers every part of a job that is
         a fight; the roll names animals as themselves (the marked line in the reader); the end screen says IS for one
     S3  one contract for a job of several fights: job_contract.split (2 and 3, in TUNING's section Y with the same value), read by the
         waves, the raids and the bands in the hand-over and in the stars' fights alike; a leg's own share where a row once fixed two men
     S4  the pay of every new offer is ECONOMY's bake (tools/bohemia_economy_job_pay.js --check)
   ON HIS PHONE (tools/bohemia_jobs_the_six_on_the_phone.js: the demo upright and sideways, a new crew, each kind's offer taken by the
   board's own message, its fight set off by the job's own code where he would meet it, every one of theirs put down, the end screen read):
     S5  every one of the six fights opens, and its end screen's head line names who they were in the job's own words (or the animal's
         own name), never THE RAIDERS ARE DOWN, both shapes
     S6  THE GATE BITES (planted, upright): the job kinds' names taken away in the page, the defence's end screen no longer says who came
     S7  nothing threw
   node gates/the_six_contracts_gate.js       JOBS_PLANT=1 also plants S1 to S3 on copies (each must fail)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE SIX CONTRACTS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SIX = { 'haul-caravan': 'ESCORT A CARAVAN', 'hold-defend': 'DEFEND A PLACE', 'hunt-kind': 'HUNT A BEAST', 'carry': 'DELIVER', 'clear-camp': 'CLEAR A PLACE', 'collect': 'COLLECT A DEBT' };

function kindOf(K, o) {
  const row = (K.offers || {})[o.id]; if (row && row.kind) return row.kind; if (o.kind) return o.kind;
  for (const g of K.guess || []) { try { if (new RegExp(g.re, 'i').test(o.title || '')) return g.kind; } catch (e) {} }
  return K.default || 'clear-crew';
}
function fileLegs(K, SHELF, KS, JD, SP, PM, TABLE, tag) {
  const all = SHELF.offers.concat(((K.board_people || {}).rows || []).filter(r => !SHELF.offers.some(o => o.id === r.id)));
  const by = {}; Object.keys(SIX).forEach(k => by[k] = all.filter(o => !o.when && kindOf(K, o) === k));
  const thin = Object.keys(SIX).filter(k => { const L = by[k], tiers = new Set([].concat(...L.map(o => o.tiers || [])));
    return L.length < 4 || tiers.size < 2 || L.some(o => !(o.client && o.client.name && o.client.look) || !/\{pay\}/.test(o.says || '') || !o.draft); });
  ok('S1' + tag + ' each of the six kinds: four or more ordinary offers, two tiers or more, every one a person with a face saying its pay', !thin.length,
    Object.keys(SIX).map(k => SIX[k].toLowerCase() + ' ' + by[k].length).join(', ') + (thin.length ? ' | THIN: ' + thin.join(', ') : ''));
  const parts = ['wave', 'raid', 'camp', 'thief', 'lair', 'band', 'gate', 'guards', 'ambush'], FS = K.foe_says || {};
  const s2 = /foe: \(extra && extra\.foe\) \|\| foeSays\(job, what, party\.faction, label\) \|\| null/.test(KS) && parts.every(p => FS[p]) &&
    /__EVERY_JOB_NAMES_ITS_FOE__ \(JOBS 11\/10, a marked line in WORLD's file\)/.test(JD) && /are: !\/\^\(A\|AN\|ONE\) \/i\.test\(foe\)/.test(SP);
  ok('S2' + tag + ' every job\'s fight names its foe: the hand-over carries it, every fight part has its words, animals are named as themselves, one IS', s2,
    'foe_says ' + parts.filter(p => FS[p]).length + ' of ' + parts.length);
  const V = (PM.job_contract || {}).value || {}, Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '';
  const rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };
  const sp = V.split || {}, inTable = ['2', '3'].every(k => sp[k] > 0 && sp[k] < 1 && rowOf('job_contract.split.' + k) === String(sp[k]));
  const uses = [/n = shareOf\(n, job\.waves\);/, /n0 = shareOf\(jm\(\), nw\);/, /shareOf\(base, job\.raids\)/, /shareOf\(jm\(\), job\.raids \|\| \(job\.ambush \|\| \[\]\)\.length\)/, /n = shareOf\(n, job\.bands\);/, /add\(1, 'band', shareOf\(jm\(\), job\.bands\)/, /n = legShare\(n, L\.fight\);/, /legShare\(jm\(\), L\.fight\)/].filter(r => !r.test(KS)).length;
  const legs = ['collect', 'burn', 'follow'].every(k => ((K.kinds[k] || {}).legs || []).some(L => L.fight && L.fight.n === 'party' && L.fight.share > 0));
  ok('S3' + tag + ' one contract for a job of several fights: split 2 and 3 in TUNING\'s section Y, read by the waves, raids and bands both ways; the legs\' shares', inTable && !uses && legs,
    'split ' + JSON.stringify(sp) + ', table ' + inTable + ', code sites missing ' + uses + ', legs ' + legs);
}
const K = J('records/target/BOHEMIA_JOB_KINDS.json'), SHELF = J('records/target/BOHEMIA_BOARD_SHELF.json'), PM = J('records/target/bb/party_math.json');
const KS = T('slices/bohemia_job_kinds.js'), JD = T('slices/bohemia_job_danger.js'), SP = T('slices/BOHEMIA_SPOILS_SCREEN.html'), TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md');
fileLegs(K, SHELF, KS, JD, SP, PM, TABLE, '');
if (process.env.JOBS_PLANT) {
  console.log('  -- planted copies (JOBS_PLANT=1): each of S1, S2, S3 must FAIL below --');
  const K1 = JSON.parse(JSON.stringify(K)); K1.board_people.rows = K1.board_people.rows.filter(r => !/^jb-carry/.test(r.id));
  const K2 = JSON.parse(JSON.stringify(K)); delete K2.foe_says.wave;
  const P3 = JSON.parse(JSON.stringify(PM)); P3.job_contract.value.split['2'] = 0.9;
  const f0 = fail; fileLegs(K1, SHELF, KS, JD, SP, PM, TABLE, ' (planted: the new deliveries taken away)'); fileLegs(K2, SHELF, KS, JD, SP, PM, TABLE, ' (planted: no words for a wave)'); fileLegs(K, SHELF, KS, JD, SP, P3, TABLE, ' (planted: split 2 off the table)');
  const bit = fail - f0; fail = f0;
  ok('S0 the planted copies bite: one red in each', bit === 3, bit + ' red');
}
let pay = false; try { cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_economy_job_pay.js'), '--check'], { stdio: 'ignore' }); pay = true; } catch (e) { pay = false; }
ok('S4 every offer\'s pay is ECONOMY\'s bake', pay);

/* ---------- ON HIS PHONE ---------- */
const EXPECT = { 'haul-caravan': /AFTER THE/, 'hold-defend': /CAME FOR/, 'hunt-kind': /HYENA|DOG|WOLF|WOLVES|COYOTE|LION|HOG/, 'carry': /THIEVES|^AN? [A-Z]|^THE [A-Z]+S ARE/, 'clear-camp': /SQUATTERS|CREW|GANG|DOGS/, 'collect': /COUSINS|NEPHEWS|MECHANICS|CREW/ };
function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'six_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_six_on_the_phone.js'), '--out', path.relative(ROOT, out), '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 3600000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'six_' + tag + '.json'), 'utf8'));
}
try {
  const W = walk([], 'gate'), errs = [];
  const rows = [].concat(...W.walks.map(w => { errs.push(...(w.errs || [])); return w.rows.map(r => Object.assign({ shape: w.shape }, r)); }));
  const bad = rows.filter(r => r.err || !r.head || /^THE RAIDERS ARE DOWN$/.test(r.head) || !EXPECT[r.kind] || !EXPECT[r.kind].test(r.head));
  ok('S5 on his phone, upright and sideways: each of the six fights opens and its end screen names who they were', rows.length === 12 && !bad.length,
    rows.map(r => (r.shape === 'phone_portrait' ? 'up ' : 'side ') + SIX[r.kind].toLowerCase() + ': ' + (r.err ? 'ERR ' + r.err : r.head)).join(' | '));
  const P = walk(['--shapes', 'phone_portrait', '--plant', 'nofoe'], 'plant');
  const pd = (P.walks[0].rows || []).filter(r => r.kind === 'hold-defend')[0];
  ok('S6 the gate bites: the names taken away in the page, the defence no longer says who came', !!pd && !!pd.head && !EXPECT['hold-defend'].test(pd.head), pd ? pd.head || pd.err : 'no row');
  ok('S7 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
