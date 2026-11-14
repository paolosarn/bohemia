/* ==========================================================================
   THE NIGHT, THE TURN AND THE BID  (JOBS 11/14/26, VAMILY rules 447, 441; row 610 again)

   THE COORDINATOR (rule 447, his 'turn up'): first row 610, a board he has read stays what he read until its time is up; then
   fifteen more jobs in the Battle Brothers kinds still missing (escort a caravan, defend a place through a night, a two-part job
   that changes halfway, a job two towns bid on), each people, a place and a thing, each fitting the town that offers it, some
   paying into his own settlement.

   THE FILES (node, a second):
     R1  the three new kinds are legs rows: a night watch (dark, two fights at one place with the small hours between, back to be
         paid), a turn (a thing picked up; halfway a talk where the job changes: finish it and fight, end it there paid by the other
         side, or walk away), a bid (one place, a town's side of it); each cites Battle Brothers
     R2  fifteen jobs by JOBS 11/14: three escorts, three night watches, three turns, three bids of two rows each, every row a named
         client of one town in that town's look, posted there, saying its pay; each bid's two rows are each other's rival and its last
         leg tells the other town; three or more pay into his own settlement (fx.home, HOME BASE's seam)
     R3  the felt numbers are TUNING's (section Y): the watch's share and its wait, the turn's paid-there part, the bid's rival act
     R4  the code: a talk choice that ends the job paid there ('paid'), the shelf's read board ('seen') and the rival rule, the town
         screen marking a board read
     R5  ROW 610 (node, the shelf's own file, fourteen towns): a board read stays exactly what was read through the day turning inside
         its window, the towns' news changing and a floor that keeps back everything; PLANTED (the read mark off) it changes
     R6  A JOB TWO TOWNS BID ON (node): both towns post their side; once he holds one side, the other town no longer posts the other
     R7  every pay is ECONOMY's bake
   ON HIS PHONE (tools/bohemia_jobs_the_new_kinds_on_the_phone.js --set r4: the demo and the alpha, upright and sideways, a new crew,
   the valley K7QM9X; each kind's job found on its own town's board with a finger, its card read, Take it tapped, played to the pay):
     P1  the demo, both ways: escort, watch, turn and bid each played to the pay, every fight named; the bid's other side gone from
         the other town's board; the watch's nurse at his place; a board read stays the same through the day turning
     P2  the alpha, both ways: the same
     P3  nothing threw
   node gates/the_night_the_turn_and_the_bid_gate.js     JOBS_PLANT=1 plants R1, R2, R4 copies (each must fail)   JOBS_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE NIGHT, THE TURN AND THE BID: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const TOWNS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Custom', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades', 'Volunteers'];

function files(K, TABLE, KS, SH, SS, tag) {
  const k = K.kinds || {}, L = id => (k[id] || {}).legs || [];
  const nw = L('night-watch'), tu = L('turn'), bi = L('bid');
  const r1 = nw.length === 3 && nw[0].dark && nw[0].fight && nw[1].go === 'again' && nw[1].wait > 0 && nw[1].fight && nw[2].go === 'client' &&
    tu.some(l => l.talk && (l.talk.opts || []).some(o => o.go === 'fight') && (l.talk.opts || []).some(o => o.go === 'paid' && o.pay > 0 && o.pay < 1)) && tu[tu.length - 1].go === 'client' &&
    bi.some(l => l.fight) && bi[bi.length - 1].go === 'client' && ['night-watch', 'turn', 'bid'].every(x => /bb_all\/\d{4}/.test((k[x] || {}).bb || ''));
  ok('R1' + tag + ' the three kinds: a night watch, a job that changes halfway, a job two towns bid on, each Battle Brothers\' own', r1, 'watch ' + nw.length + ', turn ' + tu.length + ', bid ' + bi.length + ' legs');
  const rows = ((K.board_people || {}).rows || []).filter(r => r.by === 'JOBS 11/14'), kindOf = r => ((K.offers || {})[r.id] || {}).kind, legsOf = r => ((K.offers || {})[r.id] || {}).legs || [];
  const by = {}; ['haul-caravan', 'night-watch', 'turn', 'bid'].forEach(x => by[x] = rows.filter(r => kindOf(r) === x));
  const bad = rows.filter(r => !(r.client && r.client.name && r.client.from) || r.client.look !== 'faction_' + String((r.towns || [])[0]).toLowerCase() || !/\{pay\}/.test(r.says || '') || !r.draft ||
    !(Array.isArray(r.towns) && r.towns.length === 1 && TOWNS.indexOf(r.towns[0]) >= 0) || !(r.pay > 0));
  const bids = by.bid, pairs = bids.filter(r => { const o = bids.filter(x => x.id === r.rival)[0]; const last = legsOf(r).slice(-1)[0] || {};
    return o && o.rival === r.id && o.towns[0] !== r.towns[0] && last.fx && last.fx.mood && last.fx.mood.place === o.towns[0] && last.fx.mood.act === 'minor_offensive_action'; });
  const home = rows.filter(r => JSON.stringify((K.offers || {})[r.id] || {}).indexOf('"home":{"kind"') >= 0 || JSON.stringify((K.offers || {})[r.id] || {}).indexOf('"home": {"kind"') >= 0);
  const r2 = rows.length === 15 && by['haul-caravan'].length === 3 && by['night-watch'].length === 3 && by.turn.length === 3 && bids.length === 6 && pairs.length === 6 && !bad.length && home.length >= 3;
  ok('R2' + tag + ' fifteen jobs: three escorts, three night watches, three turns, three bids of two towns; each a client of one town in its look, posted there; three or more pay into his own place', r2,
    rows.length + ' rows; escort ' + by['haul-caravan'].length + ', watch ' + by['night-watch'].length + ', turn ' + by.turn.length + ', bid rows ' + bids.length + ' (' + pairs.length + ' paired); to his place ' + home.length + (bad.length ? ' | BAD ' + bad.map(r => r.id).join(',') : ''));
  const Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '', rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };
  const r3 = nw.filter(l => l.fight).every(l => String(l.fight.share) === rowOf('job_kinds.night_watch_share')) && String(nw[1] && nw[1].wait) === rowOf('job_kinds.night_watch_wait') &&
    /0\.5/.test(rowOf('job_kinds.turn_paid_there') || '') && /minor_offensive_action/.test(rowOf('job_kinds.bid_rival') || '');
  ok('R3' + tag + ' the felt numbers are TUNING\'s: the watch\'s share and wait, the turn\'s part, the bid\'s rival act', r3, 'share ' + rowOf('job_kinds.night_watch_share') + ', wait ' + rowOf('job_kinds.night_watch_wait'));
  const r4 = [/if \(o\.go === 'paid'\) \{ if \(L\.fight\) L\.fight\.left = 0; L\.done = true; legsPaid\(job/.test(KS), /function seen\(name, ids, day\)/.test(SH), /if \(m\.seen\) \{/.test(SH),
    /!\(o\.rival && \(held\.indexOf\(o\.rival\) >= 0 \|\| done\.indexOf\(o\.rival\) >= 0\)\)/.test(SH), /BohemiaBoardShelf\.seen\(S\.place\.name, bh\.map/.test(SS)];
  ok('R4' + tag + ' the code: paid there, the read board, the rival rule, the town screen marks a board read', r4.every(Boolean), r4.map(b => b ? 1 : 0).join(''));
}
const K = J('records/target/BOHEMIA_JOB_KINDS.json'), TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), KS = T('slices/bohemia_job_kinds.js'), SH = T('slices/bohemia_board_shelf.js'), SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html');
files(K, TABLE, KS, SH, SS, '');
if (process.env.JOBS_PLANT) {
  console.log('  -- planted copies (JOBS_PLANT=1): each of R1, R2, R4 must FAIL below --');
  const K1 = JSON.parse(JSON.stringify(K)); K1.kinds['night-watch'].legs = K1.kinds['night-watch'].legs.filter(l => l.go !== 'again');
  const K2 = JSON.parse(JSON.stringify(K)); K2.board_people.rows.forEach(r => { if (r.by === 'JOBS 11/14') delete r.rival; });
  const f0 = fail, each = [];
  const plant = (fn) => { const a = fail; fn(); each.push(fail - a); };
  plant(() => files(K1, TABLE, KS, SH, SS, ' (planted: the watch has no second fight)'));
  plant(() => files(K2, TABLE, KS, SH, SS, ' (planted: the bids have no rival)'));
  plant(() => files(K, TABLE, KS, SH.replace(/if \(m\.seen\) \{/, 'if (false) {'), SS, ' (planted: the read board off)'));
  fail = f0;
  ok('R0 the planted copies bite: a red in each', each.every(n => n > 0), each.join(', ') + ' red');
}
/* R5, R6: the shelf in node, its own file, the real shelf and the job kinds' board people */
function shelfWith(src, fits) {
  const store = {}, W = { localStorage: { getItem: k => (store[k] == null ? null : store[k]), setItem: (k, v) => { store[k] = String(v); } }, WORLD_SEED: 'K7QM9X',
    BohemiaJobDanger: { fits: (o) => fits.f(o), fitVer: () => 'v' + fits.v } };
  W.window = W; vm.createContext(W); vm.runInContext(src, W);
  const doc = J('records/target/BOHEMIA_BOARD_SHELF.json'), have = {}; doc.offers.forEach(o => have[o.id] = 1); K.board_people.rows.forEach(o => { if (!have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
  W.BohemiaBoardShelf.set(doc); return W.BohemiaBoardShelf;
}
const tiers = ['camp', 'town', 'fortress'], mk = (tr) => TOWNS.map((n, i) => ({ name: n, tier: tiers[i % 3], traits: tr(i) }));
function readBoard(src) {
  const fits = { f: () => true, v: 1 }, SHx = shelfWith(src, fits);
  const P0 = mk(() => []), b0 = {}; P0.forEach(p => { b0[p.name] = (SHx.pick(p, 3, { places: P0 }) || []).map(o => o.id); });
  ['Church', 'Mob', 'Network', 'Trades'].forEach(n => SHx.seen(n, b0[n], 3));   /* his eyes on four boards */
  fits.f = () => false; fits.v = 2;   /* the floor turns against everything, the day turns, the news changes */
  const P1 = mk(i => i % 4 === 0 ? ['market_day'] : i % 4 === 1 ? ['sickness'] : []), b1 = {}; P1.forEach(p => { b1[p.name] = (SHx.pick(p, 4, { places: P1 }) || []).map(o => o.id); });
  return ['Church', 'Mob', 'Network', 'Trades'].map(n => ({ n, same: b0[n].join(',') === b1[n].join(','), before: b0[n], after: b1[n] }));
}
{ const a = readBoard(SH), b = readBoard(SH.replace(/if \(m\.seen\) \{/, 'if (false) {'));
  ok('R5 row 610: four boards read stay exactly what was read through the day turning, the towns\' news changing and a floor against everything; with the read mark planted off they change',
    a.every(x => x.same && x.before.length > 0) && b.some(x => !x.same), a.map(x => x.n + (x.same ? ' same' : ' CHANGED')).join(', ') + '; planted: ' + b.filter(x => !x.same).length + ' of 4 changed'); }
{ const SHx = shelfWith(SH, { f: () => true, v: 1 }), rows = K.board_people.rows.filter(r => r.by === 'JOBS 11/14' && r.rival), bad = [];
  rows.forEach(r => { const me = { name: r.towns[0], tier: 'fortress', traits: [] }, o = rows.filter(x => x.id === r.rival)[0], them = { name: o.towns[0], tier: 'fortress', traits: [] };
    const mine = (SHx.pick(me, 30, { held: [] }) || []).concat(SHx.pick(me, 33, { held: [] }) || []).concat(SHx.pick(me, 36, { held: [] }) || []);
    const theirsHeld = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27].some(d => (SHx.pick(them, d, { held: [r.id] }) || []).some(x => x.id === o.id));
    if (theirsHeld) bad.push(o.id + ' still posted at ' + them.name + ' while ' + r.id + ' is held'); });
  ok('R6 a job two towns bid on: once he holds one town\'s side, the other town never posts its side (ten windows, all six rows)', rows.length === 6 && !bad.length, rows.length + ' rows; ' + (bad.join(' | ') || 'none posted')); }
let pay = false; try { cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_economy_job_pay.js'), '--check'], { stdio: 'ignore' }); pay = true; } catch (e) { pay = false; }
ok('R7 every pay is ECONOMY\'s bake', pay);
if (process.env.JOBS_FILES) done();

/* ---------- ON HIS PHONE ---------- */
function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'ntb_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_new_kinds_on_the_phone.js'), '--set', 'r4', '--out', path.relative(ROOT, out), '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 5400000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'new_kinds_' + tag + '.json'), 'utf8'));
}
function judge(W, label) {
  const rows = [].concat(...W.walks.map(w => (w.rows || []).map(r => Object.assign({ shape: w.shape }, r)))), errs = [].concat(...W.walks.map(w => w.errs || []));
  const bad = rows.filter(r => r.err || !r.done || !/^What it asks: /.test(r.asks || '') || r.fights.some(f => !f.head || /^THE RAIDERS ARE DOWN$/.test(f.head)) ||
    (r.kind === 'night-watch' && (r.fights.length !== 2 || !(r.homeNew > 0))) || (r.kind === 'bid' && !(r.rival && r.rival.gone)) || (r.kind === 'turn' && !r.talks.length) || (r.kind === 'haul-caravan' && !r.fights.length));
  const boards = W.walks.map(w => w.board || {}), bb = boards.filter(b => !b.same);
  ok(label, rows.length === 8 && !bad.length && !bb.length, rows.map(r => (r.shape === 'phone_portrait' ? 'up ' : 'side ') + r.kind + ' ' + r.id + ': ' + (r.err ? 'ERR ' + r.err : (r.done ? 'paid ' + r.paid.paid : 'NOT PAID') + ', ' + r.fights.length + ' fights' + (r.rival ? ', rival ' + (r.rival.gone ? 'gone' : 'POSTED') : '') + (r.homeNew > 0 ? ', to his place' : ''))).join(' | ') +
    ' || read boards: ' + boards.map(b => b.town + (b.same ? ' same' : ' ' + (b.err || 'CHANGED'))).join(', '));
  return { rows, errs };
}
try {
  const A = judge(walk([], 'gate_demo'), 'P1 the demo, upright and sideways: escort, watch, turn and bid each found on its town\'s board, taken, played to the pay; the rival gone, the nurse at his place, a read board the same');
  const B = judge(walk(['--alpha'], 'gate_alpha'), 'P2 the alpha, upright and sideways: the same');
  ok('P3 nothing threw', !A.errs.length && !B.errs.length, A.errs.concat(B.errs).slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
