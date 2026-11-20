/* ==========================================================================
   EVERY FIGHT WON COUNTS  (JOBS [the CLOUT a job pays], 11/20/26, VAMILY rules 461, 441)

   The card says what a job pays in name: 'Your name: about +N CLOUT' (slices/bohemia_job_kinds.js asks: the job done +100, each man
   beaten +5, each place put down its own; engine/bohemia_renown.js gains). The handoff's question since 11/11: the phone walk's forced
   fight ends counted fewer. MEASURED with every fight played on AUTO by a finger: the company's first won fight paid its five a man
   and NO FIGHT AFTER IT EVER DID: the map keyed a won fight by the fight's map spot (BOHEMIA_CITY_WORLD.html, the __CLOUT__ hook,
   BohemiaRenown.fightWon(n, d.at)), a job's fight sends that spot as an object ({gx, gy}), and every key read 'fight:[object
   Object]', so BohemiaRenown.add dropped each later one as a repeat (a job's 4 men +20, the next job's 2 men +0: card +110, paid +100).
   NOW each fight handed over carries its own stamp (cityHandOver: FIGHT_STAMP, its why and the moment) and its CLOUT is keyed by it
   (__EVERY_FIGHT_WON_COUNTS__): a repeated end message still pays once, the next fight pays again.
   AND (found by the same walk on the alpha): the card reads who holds a fight's place at the place itself, the fight read it where he
   stood (the road beside it, sometimes the next district): a card's '2 keepers' (+110) met 4 of the Block Watch (+120). A job's fight now
   rolls who comes at the card's own place (bohemia_job_kinds.js __THE_CARD_S_PLACE_IS_THE_FIGHT_S__, rollDistrict; the board is still
   cut where he stands).

     C1  the files: the stamp at the hand-over, the hook keys by it, the card's sum reads the same gains
     C2  the hook and the stamp lifted out of the map and run on the real CLOUT file (engine/bohemia_renown.js): three fights handed over
         at map spots ({gx, gy}), each won: +20, +10, +15; the same end message twice pays once; PLANTED (the old key) the second and third
         pay nothing
     C3  on his phone (tools/bohemia_jobs_the_clout_a_job_pays_on_the_phone.js), the demo and the alpha, upright and sideways, a new crew:
         jobs whose every fight is sure, read right before the yes, taken by the map's own door, every fight played on AUTO pressed with a
         finger to the end: the CLOUT gained is the card's, job after job (two at least, the second's fight after the company's first)
     C4  nothing threw
   node gates/every_fight_won_counts_gate.js        COUNTS_FILES=1 the files and the node leg only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nEVERY FIGHT WON COUNTS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const CW = T('slices/BOHEMIA_CITY_WORLD.html'), JK = T('slices/bohemia_job_kinds.js'), RN = T('engine/bohemia_renown.js'), DG = T('slices/bohemia_job_danger.js');
const HOOK = (CW.split('\n').filter(l => /BohemiaRenown\.fightWon\(/.test(l))[0] || '').trim();
const STAMP = (CW.split('\n').filter(l => /FIGHT_STAMP = String\(msg\.why/.test(l))[0] || '').trim();

/* C1 */
{ const c1 = [/var FIGHT_STAMP = null;/.test(CW) && !!STAMP && /__EVERY_FIGHT_WON_COUNTS__/.test(CW),
    /BohemiaRenown\.fightWon\(\(oc\.dead \| 0\) \+ \(oc\.fled \| 0\), FIGHT_STAMP \|\|/.test(HOOK),
    /cloutOf\('civilian_contract_done'\) \+ Math\.round\(men \* cloutOf\('fight_won_per_enemy'\)\) \+ places/.test(JK) && /fight_won_per_enemy: 5/.test(RN),
    /__THE_CARD_S_PLACE_IS_THE_FIGHT_S__/.test(JK) && /rollDistrict: dz \|\| undefined/.test(JK) && /district: msg\.rollDistrict \|\| msg\.district/.test(DG)];
  ok('C1 the files: each fight handed over is stamped, the won fight\'s CLOUT is keyed by its stamp, the card\'s sum reads the same gains (the job +100, five a man); a job\'s fight rolls who comes at the card\'s own place', c1.every(Boolean), c1.map(b => b ? 1 : 0).join('')); }

/* C2: the hook and the stamp, lifted out and run on the real CLOUT file */
function play(hook) {
  const store = {}, W = { localStorage: { getItem: k => (store[k] == null ? null : store[k]), setItem: (k, v) => { store[k] = String(v); } } };   /* the sandbox keeps its own clock (its Date) */
  W.window = W; W.root = W; vm.createContext(W); vm.runInContext(RN, W);
  vm.runInContext('var FIGHT_STAMP = null; var __t = 1000; Date.now = function () { return __t; };' +
    'function handOver(msg) { ' + STAMP + ' }' +
    'function end(d) { ' + hook + ' }', W);
  const won = (n) => ({ type: 'BOHEMIA_CITY_COMBAT_END', at: null, outcome: { result: 'win', victory: true, dead: n, fled: 0, alive: 0 } });
  const out = [];
  [[4, { gx: 12, gy: 30 }], [2, { gx: 40, gy: 7 }], [3, { gx: 40, gy: 7 }]].forEach(([n, at], i) => {
    W.__t = 1000 + i * 60000; vm.runInContext('__t = ' + W.__t, W);
    W.handOver({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'contract:jb-' + i + ':guards', at: at });
    const d = won(n); d.at = at; const before = W.BohemiaRenown.score(); W.end(d); out.push(W.BohemiaRenown.score() - before);
    if (i === 1) { const b2 = W.BohemiaRenown.score(); W.end(d); out.push(W.BohemiaRenown.score() - b2); }   /* the same end message again */
  });
  return out;
}
{ let now = null, plant = null, err = null;
  try { now = play(HOOK); plant = play(HOOK.replace(/FIGHT_STAMP \|\| \(d\.at && typeof d\.at === 'object' \? JSON\.stringify\(d\.at\) : d\.at\) \|\| Date\.now\(\)/, 'd.at || Date.now()')); } catch (e) { err = String(e.message).slice(0, 160); }
  ok('C2 the hook and the stamp, lifted out and run on the real CLOUT file: three fights handed over at map spots, each won: +20, +10, +15, the same end message twice pays once; planted (the old key, the spot) the second and third pay nothing',
    !err && JSON.stringify(now) === JSON.stringify([20, 10, 0, 15]) && JSON.stringify(plant) === JSON.stringify([20, 0, 0, 0]), err || ('now ' + JSON.stringify(now) + ' | planted ' + JSON.stringify(plant))); }

if (process.env.COUNTS_FILES) done();

function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'ec_' + tag + '_' + process.pid);
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_clout_a_job_pays_on_the_phone.js'), '--out', out, '--tag', tag, '--jobs', '2'].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 3000000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'clout_pays_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')], rows = [], errs = [];
  runs.forEach(r => r.walks.forEach(w => { rows.push(w); (w.errs || []).forEach(e => errs.push(e)); }));
  const bad = rows.filter(w => { const D = (w.jobs || []).filter(j => j.done); return w.err || D.length < 2 || D.some(j => j.gain !== j.card) || D.reduce((t, j) => t + j.fights.length, 0) < 2; });
  ok('C3 on his phone, the demo and the alpha, upright and sideways: jobs whose every fight is sure, read right before the yes, every fight played on AUTO pressed with a finger: the CLOUT gained is the card\'s, job after job',
    rows.length === 4 && !bad.length,
    rows.map(w => (w.alpha ? 'alpha ' : 'demo ') + (w.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (w.err ? 'ERR ' + w.err : (w.jobs || []).filter(j => j.done || j.err).map(j => j.id + (j.err ? ' ERR ' + j.err : ' card +' + j.card + ' paid +' + j.gain + ' (' + j.fights.map(f => f.dead + f.fled).join('+') + ' men)')).join(', '))).join(' | '));
  ok('C4 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
