/* ==========================================================================
   THE TOWN'S BOOK  (JOBS 11/17/26, VAMILY rules 453, 454(a), 441; the coordinator's routine 'JOBS full sweep')

   THE COORDINATOR: this round is the jobs' SYSTEMS, the way Battle Brothers runs them, from the library, no new prose (rule 454(a)):
   (1) how a town feels about him moves with the jobs he does and fails there, and changes what that town offers and charges; (2) a
   job's danger shown before he takes it, and pay he can push up at a cost; (3) what failing or walking away costs; (4) a job that
   pays into his own settlement. Each its own build; this gate grows a leg set with each.

   BUILD A, THE TOWN REMEMBERS (node, a second):
     A1  the files (and the town screen keeps a settled job until its bands load: measured on the alpha sideways, a finished job's +10
         was dropped when he walked in before relations.json): below Neutral the town's prices worsen (settlement_traits.json relation_prices.below: the Game Guide's 30% buy,
         4% sell, quoted), the board's trust by band (relations.json board, ours on the wiki's access rule), TUNING's rows, the code's
         marks (the town screen's relPrice, BohemiaJobPay.board, the shelf's trust)
     A2  the price, read off the town screen's own relPrice: Neutral nothing; Allied 15% off the buy, 2% on the sell; Hostile 30% on
         the buy, 4% off the sell; Unfriendly 25 halfway
     A3  the board by the bar (the shelf's own file, fourteen towns, ten windows): Neutral as today; from Friendly one more job (never
         over four); Cold to Threatening no three-skull job; Hostile one one-skull job; PLANTED (no trust) the cold boards carry
         three-skull work and the friendly boards no more than today
   ON HIS PHONE (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build A: the demo and the alpha, upright and sideways, a new crew,
   the valley K7QM9X):
     A4  one job done for a town moves its bar up by the wiki's +10; the bar set to Friendly, the next board has one more person; set to
         Unfriendly, the town's shelf charges more than at Neutral and its board has no three-skull job
     A5  nothing threw
   BUILD B, PUSH THE PAY: B1 the files (relations.json haggle and acts.haggle, TUNING's rows, the card's code); B2 the card's own pay sum;
   B3 on his phone (--build B): two asks with a finger push the pay 7% each and cost 1.0 of the bar, the job taken at the pushed pay;
   three asks and they walk: gone from the board, again when he walks back in, and from the phone's list; 4.0 off the bar.
   node gates/the_towns_book_gate.js     JOBS_FILES=1 the files only     JOBS_BUILD=A,B (the phone legs of those builds)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE TOWN\'S BOOK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const TOWNS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Custom', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades', 'Volunteers'];
const TABLE = T('records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), Y = TABLE.indexOf('## Y. ') >= 0 ? TABLE.slice(TABLE.indexOf('## Y. ')) : '';
const rowOf = id => { const m = Y.split('\n').filter(l => l.indexOf('| ' + id + ' |') === 0)[0]; return m ? m.split('|')[2].trim() : null; };

/* ---------- BUILD A ---------- */
const TR = J('records/target/settlement_traits.json'), REL = J('records/target/bb/relations.json'), SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html'), SH = T('slices/bohemia_board_shelf.js'), PE = T('engine/bohemia_job_pay.js');
{ const L = (TR.relation_prices || {}).below || {}, B = (REL.board || {}).value || {};
  const a1 = [L.buy_add_at_0 === 0.3 && L.sell_sub_at_0 === 0.04 && /\(50 \\u2212 relations\) \\u00d7 0\.6%|\(50 − relations\) × 0\.6%/.test(JSON.stringify(L.why || '')) || /0\.6%/.test(L.why || ''),
    B.max_skulls && B.max_skulls.cold === 2 && B.max_skulls.hostile === 1 && B.hostile_jobs === 1 && B.more && B.more.friendly === 1 && /bb_all\/0724/.test(REL.board.why || '') ,
    rowOf('relation_prices.below') === '0.3 / 0.04' && rowOf('relations.board') === '2 / 1 / +1',
    /var L = R\.below; if\(L && op < L\.from\)/.test(SS), /REL_WAIT\.push\(\[place, act\]\); return null;/.test(SS) && /w\.forEach\(function\(x\)\{ relMove\(x\[0\], x\[1\]\); \}\)/.test(SS), /function board\(place, day\)/.test(PE) && /board: board,/.test(PE), /function trust\(name, day\)/.test(SH) && /trusted\(o, TR\)/.test(SH) && /sized\(Math\.min\(C\[tier\] \|\| 1, C\.max \|\| 4\), TR, C\)/.test(SH)];
  ok('A1 the files: below Neutral the price worsens (the Game Guide, quoted), the board trusts by band, TUNING\'s rows, the code\'s marks', a1.every(Boolean), a1.map(b => b ? 1 : 0).join('')); }
{ /* the town screen's own relPrice, lifted out and run */
  const i = SS.indexOf('function relPrice(){'), j = SS.indexOf('\n}\n', i) + 2, src = SS.slice(i, j);
  const at = (op) => { const W = { TRAITS: TR, opinionNow: () => op }; vm.createContext(W); vm.runInContext(src + '\nthis.__r = relPrice();', W); return W.__r; };
  const r50 = at(50), r100 = at(100), r0 = at(0), r25 = at(25), near = (a, b) => Math.abs(a - b) < 1e-9;
  ok('A2 the town\'s price by its bar (its own relPrice): Neutral nothing, Allied 15% off the buy and 2% on the sell, Hostile 30% on the buy and 4% off the sell, 25 halfway',
    near(r50.buySub, 0) && near(r50.sellAdd, 0) && near(r100.buySub, 0.15) && near(r100.sellAdd, 0.02) && near(r0.buySub, -0.3) && near(r0.sellAdd, -0.04) && near(r25.buySub, -0.15) && near(r25.sellAdd, -0.02),
    'at 0 ' + JSON.stringify(r0) + ', 25 ' + JSON.stringify(r25) + ', 50 ' + JSON.stringify(r50) + ', 100 ' + JSON.stringify(r100)); }
function shelfWith(src, band) {
  const store = {}, W = { localStorage: { getItem: k => (store[k] == null ? null : store[k]), setItem: (k, v) => { store[k] = String(v); } }, WORLD_SEED: 'K7QM9X',
    BohemiaJobDanger: { fits: () => true, fitVer: () => 'v' } };
  if (band) { const B = REL.board.value; W.BohemiaJobPay = { board: () => ({ band, score: 0, maxSkulls: B.max_skulls[band] == null ? 3 : B.max_skulls[band], cap: band === 'hostile' ? B.hostile_jobs : null, more: (B.more[band] | 0) }) }; }
  W.window = W; vm.createContext(W); vm.runInContext(src, W);
  const doc = J('records/target/BOHEMIA_BOARD_SHELF.json'), K = J('records/target/BOHEMIA_JOB_KINDS.json'), have = {}; doc.offers.forEach(o => have[o.id] = 1); K.board_people.rows.forEach(o => { if (!have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
  W.BohemiaBoardShelf.set(doc); return W.BohemiaBoardShelf;
}
function boards(src, band) {
  const SHx = shelfWith(src, band), tiers = ['camp', 'town', 'fortress'], P = TOWNS.map((n, i) => ({ name: n, tier: tiers[i % 3], traits: [] })), out = { n: 0, top: 0, over: 0, cnt: [] };
  for (let d = 0; d < 30; d += 3) P.forEach(p => { const L = SHx.pick(p, d, { places: P }) || []; out.n++; out.cnt.push(L.length); if (L.some(o => (o.skulls | 0) >= 3)) out.top++; if (L.some(o => (o.skulls | 0) > 1)) out.over++; });
  out.avg = out.cnt.reduce((a, b) => a + b, 0) / out.cnt.length; return out;
}
{ const base = boards(SH, null), fr = boards(SH, 'friendly'), co = boards(SH, 'cold'), ho = boards(SH, 'hostile');
  const plantCold = boards(SH.replace('trusted(o, TR); }),', 'true; }),'), 'cold'), plantFr = boards(SH.replace(/return Math\.min\(n \+ \(T\.more \| 0\), C\.max \|\| 4\);/, 'return n;'), 'friendly');
  const a3 = fr.avg > base.avg && fr.cnt.every(c => c <= 4) && co.top === 0 && base.top > 0 && ho.cnt.every(c => c === 1) && ho.over === 0 && plantCold.top > 0 && !(plantFr.avg > base.avg);
  ok('A3 the board by the bar: Friendly one more job (never over four), Cold no three-skull job, Hostile one one-skull job; planted, the cold boards carry three-skull work and the friendly ones no more',
    a3, 'jobs a board: neutral ' + base.avg.toFixed(2) + ', friendly ' + fr.avg.toFixed(2) + '; three-skull boards: neutral ' + base.top + ', cold ' + co.top + '; hostile counts ' + [...new Set(ho.cnt)].join('/') + ', over one skull ' + ho.over + '; planted: cold three-skull ' + plantCold.top + ', friendly ' + plantFr.avg.toFixed(2)); }
/* ---------- BUILD B, PUSH THE PAY ---------- */
{ const H = (REL.haggle || {}).value || {}, A = REL.acts || {};
  const b1 = [H.step === 0.07 && H.lands === 2 && /bb_all\/0441/.test(REL.haggle.why || '') && /Two asks land\. The third ends it\./.test(REL.haggle.why || ''),
    A.haggle && A.haggle.value === -0.5 && /0\.5 points/.test(A.haggle.quote || '') && A.negotiation_fail && A.negotiation_fail.value === -2.5,
    rowOf('relations.haggle') === '0.07 / 2' && rowOf('relations.acts.haggle') === '-0.5',
    /function hagAsk\(o\)/.test(SS) && /relMove\(null, 'haggle'\)/.test(SS) && /relMove\(null, 'negotiation_fail'\)/.test(SS) && /pay: hagPay\(b0, hagOf\(o\.id\)\.asks\)/.test(SS) && /list\.filter\(function\(o\)\{ return !hagWalked\(o\.id\); \}\)/.test(SS)];
  ok('B1 the files: the ask lands 7% and costs 0.5 of the bar (the wiki\'s), two land and the third ends it (-2.5), told before; TUNING\'s rows; the card\'s code', b1.every(Boolean), b1.map(x => x ? 1 : 0).join('')); }
{ /* the card's own pay sum, lifted out and run */
  const i = SS.indexOf('function hagPay(base, asks)'), src = SS.slice(i, SS.indexOf('\n', i));
  const W = { REL: REL }; vm.createContext(W); vm.runInContext('function hagRule(){ var h = REL && REL.haggle && REL.haggle.value; return h ? { step: +h.step || 0.07, lands: (h.lands | 0) || 2 } : null; }\n' + src + '\nthis.p = [hagPay(100,0), hagPay(100,1), hagPay(100,2), hagPay(57,2)];', W);
  ok('B2 the pay as pushed: 100 stays 100, one ask 107, two 114; a 57-battery job two asks 65', JSON.stringify(W.p) === JSON.stringify([100, 107, 114, 65]), JSON.stringify(W.p)); }
if (process.env.JOBS_FILES) done();

/* ---------- ON HIS PHONE ---------- */
function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'tb_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_the_towns_book_on_the_phone.js'), '--out', path.relative(ROOT, out), '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 5400000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'towns_book_' + tag + '.json'), 'utf8'));
}
const BUILDS = (process.env.JOBS_BUILD || 'A').split(',');
try {
  const runs = [walk(['--build', BUILDS.join(',')], 'gate_demo'), walk(['--build', BUILDS.join(','), '--alpha'], 'gate_alpha')];
  const rows = [].concat(...runs.map(R => [].concat(...R.walks.map(w => (w.rows || []).map(r => Object.assign({ shape: w.shape, alpha: R.alpha }, r)))))), errs = [].concat(...runs.map(R => [].concat(...R.walks.map(w => w.errs || []))));
  if (BUILDS.indexOf('A') >= 0) { const a = rows.filter(r => r.build === 'A');
    const bad = a.filter(r => r.err || !(r.doneMove >= 9.9) || !(r.friendlyMore > 0) || !(r.priceUp > 1.01) || r.coldTop);
    ok('A4 on his phone, the demo and the alpha, upright and sideways: a job done moves the town\'s bar +10, Friendly posts one more, Unfriendly charges more and keeps its three-skull work', a.length === 4 && !bad.length,
      a.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : 'bar +' + r.doneMove + ' (' + r.town + '), friendly +' + r.friendlyMore + ' jobs, price x' + (r.priceUp || 0).toFixed(3) + ', cold three-skull ' + (r.coldTop ? 'YES' : 'none'))).join(' | ')); }
  if (BUILDS.indexOf('B') >= 0) { const bb = rows.filter(r => r.build === 'B');
    const bad = bb.filter(r => r.err || !(r.payPushed === r.payHeldExpected && r.payHeldExpected > r.payHeldUnpushed) || !(Math.abs(r.barMove + 1) < 0.01) || !r.walkedGone || !r.cardFits || !(Math.abs(r.walkMove + 4) < 0.01));
    ok('B3 on his phone, the demo and the alpha, upright and sideways: two asks on a job\'s card with a finger push its pay 7% each and cost the town 1.0 of its bar, the job taken at the pushed pay; three asks on another and they walk: gone from the board, gone when he walks back in and from the phone\'s list, 4.0 off the bar (three asks and the walk); every button of the card on the glass with the ask added', bb.length === 4 && !bad.length,
      bb.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' ' + r.id + ' base ' + r.payBase + ' -> ' + r.payExpected + ', held at ' + r.payPushed + ' (the map\'s sum ' + r.payHeldExpected + ', unpushed ' + r.payHeldUnpushed + '), bar ' + r.barMove + '; ' + r.walkId + ' walked ' + (r.walkedGone ? 'gone' : 'STILL THERE') + ', bar ' + r.walkMove + (r.cardFits ? '' : '; A BUTTON OFF THE GLASS ' + JSON.stringify(r.fit)))).join(' | ')); }
  ok('A5 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
