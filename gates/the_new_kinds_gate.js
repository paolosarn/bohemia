/* ==========================================================================
   THE NEW KINDS  (JOBS [the months of jobs], 11/11/26, VAMILY rules 425, 441; the coordinator's round 'JOBS next round')

   THE COORDINATOR: fifteen more jobs, each a job with people, a place and a thing, each from the Battle Brothers contract kinds we do
   not yet have (root out, siege help, find a person, a two-part job), each paying in batteries and name, each fitting the town that
   offers it; and the job board shows what a job really asks before he takes it. Battle Brothers: Root Out Undead (bb_all/1705
   'Destroy objective A and B, then return'), Break Siege (bb_all/0287), Obtain Item (bb_all/1478 'you get the relic right before the
   confrontation begins and could just retreat'), Restore Location (bb_all/1686 'Secure the ruined location..., then return to the
   settlement and escort the workers'), Renown (bb_all/1679 'Destroying a Location +10').

   THE FILES (node, a second):
     N1  the four kinds are legs rows of WORLD's job kinds: root out two places put down then back; break the ring three fights round
         the client's town, its camp put down; get it a talk before its fight with stand, run (part pay) and put it back; restore a
         ruin, back for the workers, the same ruin again, back to be paid, one in three a fight on the way
     N2  fifteen board people by JOBS 11/11, three of each of root out, break the ring, get it, restore, find a person; every tier of
         skulls in each; each a named client from one town with that town's look, posted at that town only (towns), saying its pay
     N3  the felt numbers are TUNING's: each share is the contract's split (root out split 2, the ring split 3, a sure fight 1), the
         twist and the run's pay in section Y, renown.json's place_destroyed in section Y and in the engine's first-frame copy
     N4  the code reads them: 'again' and 'round' in the legs, a leg's CLOUT when its place goes down, asks() exported and on the
         offer card, the board deals a town's own job at that town only and its own person first
     N5  every pay is ECONOMY's bake (tools/bohemia_economy_job_pay.js --check)
     N6  a posted job stays posted for its window (EYES ask row 610): the crew changing and a job taken elsewhere re-deal nothing he
         saw; with the memory planted off, jobs vanish (the bite)
   ON HIS PHONE (tools/bohemia_jobs_the_new_kinds_on_the_phone.js: the demo and the alpha, upright and sideways, a new crew; each kind's
   job found on its own town's board with a finger, its card read, Take it tapped, played to the end):
     P1  the demo, both ways: each of the five kinds is on its town's board, its card says what it asks, it is taken by Take it, every
         fight opens and its end screen names who they were, it pays, and the CLOUT moves at least the job's own gain
     P2  the alpha, both ways: the same
     P3  the card tells the truth: the sure fights it says are the fights met (a twist's fight said as a maybe), each fight's count
         on the card is the count on the page
     P4  THE GATE BITES (planted, the demo upright): asks() taken away in the page, the card no longer says what it asks
     P5  nothing threw
   node gates/the_new_kinds_gate.js       JOBS_PLANT=1 also plants N1 to N4 on copies (each must fail)   JOBS_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE NEW KINDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const KINDS = ['root-out', 'siege', 'obtain', 'restore', 'find-person'];
const TOWNS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Custom', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades', 'Volunteers'];

function files(K, PM, REN, TABLE, KS, SH, SS, ENG, tag) {
  const k = K.kinds || {}, L = id => (k[id] || {}).legs || [];
  const ro = L('root-out'), sg = L('siege'), ob = L('obtain'), rs = L('restore'), tw = (k.restore || {}).twist || {};
  const n1 = ro.filter(l => l.fight && l.clout).length === 2 && ro[ro.length - 1].go === 'client' &&
    sg.filter(l => l.fight && l.round).length === 3 && sg.some(l => l.clout) && sg[sg.length - 1].go === 'client' &&
    ob.some(l => l.talk && l.fight && (l.talk.opts || []).some(o => o.go === 'fight') && (l.talk.opts || []).some(o => o.pay > 0 && o.pay < 1) && (l.talk.opts || []).some(o => o.go === 'lost')) &&
    rs.length === 4 && rs[0].fight && rs[1].go === 'client' && rs[2].go === 'again' && rs[3].go === 'client' && tw.rate > 0 && tw.leg && tw.leg.fight &&
    ['root-out', 'siege', 'obtain', 'restore'].every(x => /bb_all\/\d{4}/.test((k[x] || {}).bb || ''));
  ok('N1' + tag + ' the four kinds: root out, break the ring, get it, restore (two parts), each Battle Brothers\' own contract', n1,
    ['root-out', 'siege', 'obtain', 'restore'].map(x => x + ' ' + L(x).length + ' legs').join(', '));
  const rows = ((K.board_people || {}).rows || []).filter(r => r.by === 'JOBS 11/11'), kindOf = r => ((K.offers || {})[r.id] || {}).kind;
  const by = {}; KINDS.forEach(x => by[x] = rows.filter(r => kindOf(r) === x));
  const bad = rows.filter(r => !(r.client && r.client.name && r.client.look && r.client.from) || !/\{pay\}/.test(r.says || '') || !r.draft ||
    !(Array.isArray(r.towns) && r.towns.length === 1 && TOWNS.indexOf(r.towns[0]) >= 0) || r.client.look !== 'faction_' + String(r.towns && r.towns[0]).toLowerCase() || !(r.pay > 0));
  const n2 = rows.length === 15 && KINDS.every(x => by[x].length === 3 && new Set(by[x].map(r => r.skulls)).size === 3) && !bad.length;
  ok('N2' + tag + ' fifteen jobs, three of each kind, one to three skulls, each a named client of one town in its look, posted there, saying its pay', n2,
    rows.length + ' rows; ' + KINDS.map(x => x + ' ' + by[x].length).join(', ') + (bad.length ? ' | BAD: ' + bad.map(r => r.id).join(', ') : ''));
  const sp = ((PM.job_contract || {}).value || {}).split || {}, legsAll = x => [].concat(L(x), ...rows.filter(r => kindOf(r) === x).map(r => (K.offers[r.id] || {}).legs || []));
  const shares = x => legsAll(x).filter(l => l.fight).map(l => l.fight.share);
  const Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '', rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };
  const g = ((REN.gains || {}).value || {}).place_destroyed, run = ((ob.filter(l => l.talk)[0] || {}).talk || { opts: [] }).opts.filter(o => o.pay > 0)[0];
  const n3 = shares('root-out').every(v => v === sp['2']) && shares('siege').every(v => v === sp['3']) && shares('obtain').every(v => v === 1) && shares('restore').every(v => v === 1) &&
    rowOf('job_kinds.root_out_share') === String(sp['2']) && rowOf('job_kinds.siege_share') === String(sp['3']) && rowOf('job_kinds.restore_twist') === tw.rate + ' / ' + (tw.leg && tw.leg.fight && tw.leg.fight.share) &&
    !!run && rowOf('job_kinds.obtain_run_pay') === String(run.pay) && g === 10 && rowOf('renown.place_destroyed') === String(g) && new RegExp('place_destroyed: ' + g + '\\b').test(ENG);
  ok('N3' + tag + ' every felt number is TUNING\'s: the shares are the contract\'s split, the twist, the run\'s pay and a place\'s CLOUT in section Y', n3,
    'root out ' + JSON.stringify(shares('root-out')) + ' split 2 ' + sp['2'] + ', ring ' + JSON.stringify(shares('siege')) + ' split 3 ' + sp['3'] + ', place_destroyed ' + g + ', table ' + rowOf('renown.place_destroyed'));
  const n4 = [/A = L\.go === 'again' \?/.test(KS), /L\.round \? \{ x: town\.x, y: town\.y \} : prev/.test(KS), /if \(L\.clout\) \{ var cg = cloutOf\(L\.clout\)/.test(KS), /trip: trip, asks: asks,/.test(KS),
    /JA\.asks\(o, S\.place\.name\)/.test(SS), /\(!o\.towns \|\| o\.towns\.indexOf\(String\(place\.name\)\) >= 0\)/.test(SH), /if \(own\.length\) take\(own, /.test(SH)];
  ok('N4' + tag + ' the code reads them: again and round, a place\'s CLOUT, the card\'s asks, a town\'s own jobs at that town and first', n4.every(Boolean), n4.map(b => b ? 1 : 0).join(''));
}
const K = J('records/target/BOHEMIA_JOB_KINDS.json'), PM = J('records/target/bb/party_math.json'), REN = J('records/target/bb/renown.json');
const TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), KS = T('slices/bohemia_job_kinds.js'), SH = T('slices/bohemia_board_shelf.js'), SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), ENG = T('engine/bohemia_renown.js');
files(K, PM, REN, TABLE, KS, SH, SS, ENG, '');
if (process.env.JOBS_PLANT) {
  console.log('  -- planted copies (JOBS_PLANT=1): each of N1, N2, N3, N4 must FAIL below --');
  const K1 = JSON.parse(JSON.stringify(K)); K1.kinds.restore.legs = K1.kinds.restore.legs.filter(l => l.go !== 'again');
  const K2 = JSON.parse(JSON.stringify(K)); K2.board_people.rows.forEach(r => { if (r.by === 'JOBS 11/11') delete r.towns; });
  const P3 = JSON.parse(JSON.stringify(PM)); P3.job_contract.value.split['3'] = 0.9;
  const f0 = fail;
  files(K1, PM, REN, TABLE, KS, SH, SS, ENG, ' (planted: restore has no walk back)');
  files(K2, PM, REN, TABLE, KS, SH, SS, ENG, ' (planted: the jobs fit no town)');
  files(K, P3, REN, TABLE, KS, SH, SS, ENG, ' (planted: split 3 off the shares)');
  files(K, PM, REN, TABLE, KS, SH, SS.replace(/JA\.asks\(o, S\.place\.name\)/g, 'null'), ENG, ' (planted: the card asks nothing)');
  const bit = fail - f0; fail = f0;
  ok('N0 the planted copies bite: one red in each', bit === 4, bit + ' red');
}
/* N6 (EYES ask row 610): one window, the crew changes (the day's floor reads another crew) and a job is taken at another town: every
   other job a board posted is still on it; PLANTED (the memory switched off) the boards re-deal and jobs vanish */
const vm = require('vm');
function redeal(src, memo) {
  const store = {}, ls = { getItem: k => memo ? (store[k] == null ? null : store[k]) : null, setItem: (k, v) => { store[k] = String(v); } };
  let crew = 'A';
  const W = { localStorage: ls, WORLD_SEED: 'K7QM9X', BohemiaJobDanger: { fits: (o) => !(crew === 'B' && (parseInt(require('crypto').createHash('md5').update(o.id).digest('hex').slice(0, 2), 16) % 3 === 0)), fitVer: () => 'v|' + crew } };
  W.window = W; vm.createContext(W); vm.runInContext(src, W);
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json'), 'utf8'));
  const K = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8'));
  const have = {}; doc.offers.forEach(o => have[o.id] = 1); K.board_people.rows.forEach(o => { if (!have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
  W.BohemiaBoardShelf.set(doc);
  const names = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Custom', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades', 'Volunteers'];
  const tiers = ['camp', 'town', 'fortress'], places = names.map((n, i) => ({ name: n, tier: tiers[i % 3], traits: [] }));
  const board = (held) => { const m = {}; places.forEach(p => m[p.name] = (W.BohemiaBoardShelf.pick(p, 4, { places, held: held || [] }) || []).map(o => o.id)); return m; };
  const b1 = board(); crew = 'B'; const b2 = board(); const took = b1.Church[0]; const b3 = board([took]);
  let lost = 0, kept = 0;
  /* a job the new crew's floor now keeps back comes off by rule 255 (said, never a re-shuffle): only the ones the floor still lets through count */
  const under = (id) => !W.BohemiaJobDanger.fits({ id: id });
  let off = 0; names.forEach(n => b1[n].forEach(id => { if (id === took) return; if (under(id)) { off++; return; } if (b2[n].indexOf(id) >= 0 && b3[n].indexOf(id) >= 0) kept++; else lost++; }));
  /* the day turns inside the window and the towns' news changes (a market day here, a sickness there): EYES 610's two visits */
  crew = 'A'; const mk = (tr) => names.map((n, i) => ({ name: n, tier: tiers[i % 3], traits: tr(i) }));
  const dealOn = (pl, day) => { const m = {}; pl.forEach(p => m[p.name] = (W.BohemiaBoardShelf.pick(p, day, { places: pl }) || []).map(o => o.id)); return m; };
  const d1 = dealOn(mk(() => []), 3), d2 = dealOn(mk(i => i % 4 === 0 ? ['market_day'] : i % 4 === 1 ? ['sickness'] : []), 4);
  let dk = 0, dl = 0; names.forEach(n => d1[n].forEach(id => { if (d2[n].indexOf(id) >= 0) dk++; else dl++; }));
  return { kept, lost, off, dayKept: dk, dayLost: dl, own: names.map(n => n + ':' + (b1[n].filter(id => /^jb-(root|ring|get|restore|find)/.test(id)).length)).join(' ') };
}
{ const src = T('slices/bohemia_board_shelf.js'); const a = redeal(src, true), b = redeal(src, false);
  ok('N6 a posted job stays posted (EYES row 610): the day turns inside the window and the towns\' news changes, the crew changes, a job is taken elsewhere, and every posted job the floor still lets through stands; with the memory planted off they vanish',
    a.dayLost === 0 && a.dayKept >= 20 && a.lost === 0 && a.kept >= 10 && b.dayLost > 0,
    'the day turning: kept ' + a.dayKept + ', lost ' + a.dayLost + '; the crew changing: kept ' + a.kept + ', lost ' + a.lost + ' (' + a.off + ' off by the floor, rule 255); planted: the day turning lost ' + b.dayLost); }
let pay = false; try { cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_economy_job_pay.js'), '--check'], { stdio: 'ignore' }); pay = true; } catch (e) { pay = false; }
ok('N5 every pay is ECONOMY\'s bake', pay);
if (process.env.JOBS_FILES) done();

/* ---------- ON HIS PHONE ---------- */
function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'newkinds_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_new_kinds_on_the_phone.js'), '--out', path.relative(ROOT, out), '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 5400000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'new_kinds_' + tag + '.json'), 'utf8'));
}
const nums = s => (String(s || '').match(/(?:a fight with|come to a fight with|: )(\d+) /g) || []).map(x => +x.match(/(\d+) $/)[1]);
function judge(W, label) {
  const rows = [].concat(...W.walks.map(w => (w.rows || []).map(r => Object.assign({ shape: w.shape }, r)))), errs = [].concat(...W.walks.map(w => w.errs || []));
  const bad = rows.filter(r => r.err || !r.done || !/^What it asks: /.test(r.asks || '') || !/CLOUT/.test(r.asks || '') || !(r.clout >= 100) ||
    r.fights.some(f => !f.head || /^THE RAIDERS ARE DOWN$/.test(f.head)) || (r.kind !== 'find-person' && !r.fights.length));
  ok(label, rows.length === 10 && !bad.length, rows.map(r => (r.shape === 'phone_portrait' ? 'up ' : 'side ') + r.kind + ' ' + r.id + ': ' + (r.err ? 'ERR ' + r.err : (r.done ? 'paid ' + r.paid.paid : 'NOT PAID') + ' +' + r.clout + ' CLOUT, ' + r.fights.length + ' fights')).join(' | '));
  return { rows, errs };
}
try {
  const A = judge(walk([], 'gate_demo'), 'P1 the demo, upright and sideways: each kind found on its own town\'s board, read, taken by Take it, every fight named, paid, CLOUT moved');
  const B = judge(walk(['--alpha'], 'gate_alpha'), 'P2 the alpha, upright and sideways: the same');
  const all = A.rows.concat(B.rows).filter(r => !r.err && r.done);
  const lies = all.filter(r => { const said = (String(r.asks).match(/(\d+) fights?\b/) || [0, 0])[1] | 0, met = r.fights.length, maybes = ((String(r.asks).match(/, (\d+) maybe\./) || [0, 0])[1] | 0) + ((String(r.asks).match(/, (\d+) if it comes to that/) || [0, 0])[1] | 0);
    const ns = nums(r.asks), shown = r.fights.map(f => f.n);
    return !(met >= said && met <= said + maybes) || !shown.every((n, i) => ns[i] == null || ns.indexOf(n) >= 0); });
  ok('P3 the card tells the truth: the fights it says are the fights met, each count on the card a count on the page', all.length >= 10 && !lies.length,
    all.length + ' jobs; ' + (lies.length ? 'LIES: ' + lies.map(r => r.id + ' said "' + r.asks + '" met ' + r.fights.map(f => f.n).join('/')).join(' || ') : 'none'));
  const P = walk(['--shapes', 'phone_portrait', '--kinds', 'root-out', '--plant', 'noasks'], 'gate_plant');
  const pr = (P.walks[0].rows || [])[0] || {};
  ok('P4 the gate bites: asks() taken away in the page, the card no longer says what it asks', !!pr.err && /says nothing|not .*'s/.test(pr.err), pr.err || 'no error');
  ok('P5 nothing threw', !A.errs.length && !B.errs.length, A.errs.concat(B.errs).slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
