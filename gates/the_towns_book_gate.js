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
   BUILD C, WHAT WALKING AWAY COSTS: C1 the files (relations.json cancel/fail, renown.json's, the card's code); C2 the card's own words on
   the real bands and gains; C3 on his phone (--build C): a job dropped in town and the turn job walked away from move the bar and CLOUT
   exactly as their cards said, every card button on the glass.
   BUILD D, PAID INTO HIS PLACE: D1 the files (job_into_place.json, TUNING's rows, the card, the map's take, the pay); D2 what the card
   offers on the real files; D3 on his phone (--build D): a one-skull find paid partly as a build, played to the pay, the build his.
   BUILD E (11/18), THE BIG WORK WAITS FOR A NAME: E1 the files (job_clout.json, TUNING's row, the shelf's gate, the board's label);
   E2 the boards by CLOUT on the real shelf (planted: the needs gone); E3 on his phone (--build E): a job done opens a fortress's work.
   node gates/the_towns_book_gate.js     JOBS_FILES=1 the files only     JOBS_BUILD=A,B,C,D,E (the phone legs of those builds)
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
/* ---------- BUILD C, WHAT WALKING AWAY COSTS ---------- */
{ const RN = J('records/target/bb/renown.json'), G = (RN.gains || {}).value || {}, A = REL.acts || {};
  const c1 = [A.cancel_contract && A.cancel_contract.value === -10 && A.fail_civilian_contract && A.fail_civilian_contract.value === -20 && /bb_all\/1670/.test(A.cancel_contract.source || ''),
    G.cancel_contract === -100 && G.fail_civilian_contract === -75,
    /function costOf\(act\)/.test(SS) && /cw\.className = 'trip quit'/.test(SS) && /var CW = costWords\(\)/.test(SS) && /S\.cost = CW/.test(SS)];
  ok('C1 the files: dropping a job costs its town 10 and 100 CLOUT, failing it 20 and 75 (the wiki\'s, relations.json and renown.json), and the card says so before the yes', c1.every(Boolean), c1.map(x => x ? 1 : 0).join('')); }
{ /* the card's own words, lifted out and run on the real bands and the real gains */
  const i = SS.indexOf('function costOf(act){'), j = SS.indexOf('function offerSpeak(o){', i), src = SS.slice(i, j);
  const RE = require(path.join(ROOT, 'engine/bohemia_relations.js')), RN = J('records/target/bb/renown.json');
  const run = (bar, clout) => { const W = { REL: REL, BohemiaRelations: RE, BohemiaRenown: { score: () => clout, data: () => ({ gains: RN.gains.value }) } }; W.window = W; vm.createContext(W);
    vm.runInContext('function opinionNow(){ return ' + bar + '; }\nfunction hagAct(n){ var a = REL && REL.acts && REL.acts[n]; return a ? +a.value : 0; }\n' + src + '\nthis.w = costWords().words;', W); return W.w; };
  const got = [run(50, 300), run(50, 0), run(35, 60)];
  const want = ['DROP IT 50→40 · CLOUT 300→200\nFAIL IT 50→30 COLD · CLOUT 300→225',
    'DROP IT 50→40 · CLOUT 0→0\nFAIL IT 50→30 COLD · CLOUT 0→0',
    'DROP IT 35→25 UNFRIENDLY · CLOUT 60→0\nFAIL IT 35→15 THREATENING · CLOUT 60→0'];
  ok('C2 the card\'s words: at 50 with 300 CLOUT a drop reads 50 to 40 and 300 to 200, a fail 50 to 30 COLD and 300 to 225; a new company is told it loses no CLOUT; at 35 the bands it falls into are named',
    JSON.stringify(got) === JSON.stringify(want), got.join(' | ')); }
/* ---------- BUILD D, PAID INTO HIS PLACE ---------- */
{ const IP = J('records/target/bb/job_into_place.json'), CW = T('slices/BOHEMIA_CITY_WORLD.html'), JK = T('slices/bohemia_job_kinds.js');
  const d1 = [IP.share && IP.share.value === 0.25 && /bb_all\/0441/.test(IP.share.source || '') && /subtracts 25%/.test(IP.share.quote || ''),
    IP.worth && IP.worth.value && IP.worth.value.battery === 1 && IP.worth.value.per_tape === 1 && Array.isArray(IP.builds && IP.builds.value) && IP.builds.value.length >= 3 && IP.full_only && IP.full_only.value === true,
    rowOf('job_into_place.share') === '0.25' && rowOf('job_into_place.worth') === '1 / 1',
    /function intoList\(base\)/.test(SS) && /ib\.dataset\.into = /.test(SS) && /IN \? \{ into: IN \}/.test(SS) && /function payOf\(o\)\{ return Math\.max\(1, payShown\(o\.pay\) - /.test(SS),
    /if\(c\.into && c\.into\.build\)\{ job\.into = .*job\.pay = Math\.max\(1, job\.pay - job\.into\.worth\); \}/.test(CW),
    /if \(job\.into && job\.into\.build && n >= job\.pay\) \{ try \{ var HM = root\.BohemiaHomeMap; into = HM && HM\.give \? HM\.give\(\{ id: 'job:' \+ job\.id, kind: 'build'/.test(JK)];
  ok('D1 the files: up to 25% of a job\'s pay can be one of his builds (the wiki\'s payment shape), worth one battery and its tape, his only when the job is done in full; TUNING\'s rows; the card, the map\'s take and the pay', d1.every(Boolean), d1.map(x => x ? 1 : 0).join('')); }
{ /* the card's own list, lifted out and run on the real files */
  const i = SS.indexOf('function intoWorth(id){'), j = SS.indexOf('function intoNow(o, base){', i), src = SS.slice(i, j);
  const W = { INTO: J('records/target/bb/job_into_place.json'), INTO_B: J('records/target/bb/home_base.json').builds }; vm.createContext(W);
  vm.runInContext(src + '\nthis.l = [57, 20, 10, 7].map(function(b){ return intoList(b).map(function(x){ return x.build + " " + x.worth; }).join(","); });', W);
  const want = ['solar 5,pump 4,tank 3,garden 2', 'solar 5,pump 4,tank 3,garden 2', 'garden 2', ''];
  ok('D2 what the card offers: a 57-battery job any of the four (a panel 5, a pump 4, a tank 3, a garden 2), a 10-battery job only the garden, a 7-battery job none (25% is under 2)', JSON.stringify(W.l) === JSON.stringify(want), JSON.stringify(W.l)); }
/* ---------- BUILD E (11/18), THE BIG WORK WAITS FOR A NAME ---------- */
{ const JC = J('records/target/bb/job_clout.json'), N = (JC.needs || {}).value || {};
  const e1 = [N.fortress && N.fortress['3'] === 1050 && N.fortress['2'] === 250 && N.town && N.town['3'] === 250 && N.camp && N.camp['3'] === 250,
    /require completing an ambition to reach Professional Renown \(1050\) to unlock/.test(JC.needs.quote || '') && /bb_all\/0724/.test(JC.needs.source || '') && /more difficult Contracts people will entrust you/.test(JC.needs.quote2 || ''),
    rowOf('job_clout.needs') === '250 / 1050',
    /function needOf\(o, tier\)/.test(SH) && /if \(CL != null\) ordinary = ordinary\.filter\(function \(o\) \{ var nd = needOf\(o, tier\); if \(CL >= nd\) return true; waiting\.push\(o\)/.test(SH) && /cloutLevel\(clout\(\)\)/.test(SH) && /if \(waiting\.length\) \{/.test(SH) && /waits: function \(name\)/.test(SH) && /job_clout\.json/.test(SH),
    /BohemiaBoardShelf\.waits\(S\.place\.name\)/.test(SS) && /'MORE WORK HERE AT ' \+ WN\.need \+ ' CLOUT \\u00b7 YOU HAVE '/.test(SS)];
  ok('E1 the files: a fortress\'s three-skull work waits for 1050 CLOUT (the wiki\'s Professional, quoted), its two-skull work and any town\'s or camp\'s three-skull work for 250; TUNING\'s row; the shelf\'s gate, its never-empty, the board\'s label', e1.every(Boolean), e1.map(x => x ? 1 : 0).join('')); }
{ /* the shelf itself, on the valley's own tiers, at CLOUT 0, 250 and 1050 over ten windows; planted: the needs gone */
  const TIER = { Caravans: 'fortress', Cartel: 'fortress', Mob: 'fortress', Network: 'fortress', Remnants: 'fortress', Anarchists: 'town', Blues: 'town', Church: 'town', Reds: 'town', Colorful: 'camp', Homeless: 'camp', Trades: 'camp', Volunteers: 'camp' };
  const NEEDS = J('records/target/bb/job_clout.json').needs.value;
  const run = (c, needs, only3) => { const store = {}, W = { localStorage: { getItem: k => (store[k] == null ? null : store[k]), setItem: (k, v) => { store[k] = String(v); } }, WORLD_SEED: 'K7QM9X',
      BohemiaJobDanger: { fits: () => true, fitVer: () => 'v' }, BohemiaRenown: { score: () => c } }; W.window = W; vm.createContext(W); vm.runInContext(SH, W);
    const doc = J('records/target/BOHEMIA_BOARD_SHELF.json'), K = J('records/target/BOHEMIA_JOB_KINDS.json'), have = {}; doc.offers.forEach(o => have[o.id] = 1); K.board_people.rows.forEach(o => { if (!have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
    if (only3) doc.offers = doc.offers.filter(o => (o.tiers || []).indexOf('fortress') < 0 || ((o.skulls | 0) || 1) === 3);   /* a valley whose fortresses post only three-skull work */
    if (needs) doc.clout_needs = needs; W.BohemiaBoardShelf.set(doc); const S = W.BohemiaBoardShelf, P = Object.keys(TIER).map(n => ({ name: n, tier: TIER[n], traits: [] }));
    const o = { fort2: 0, fort3: 0, small3: 0, empty: 0, n: 0, label: {} };
    for (let d = 0; d < 30; d += 3) P.forEach(p => { const L = S.pick(p, d, { places: P }) || []; o.n++; if (!L.length) o.empty++;
      if (p.tier === 'fortress') { if (L.some(x => (x.skulls | 0) === 2)) o.fort2++; if (L.some(x => (x.skulls | 0) >= 3)) o.fort3++; } else if (L.some(x => (x.skulls | 0) >= 3)) o.small3++;
      const w = S.waits(p.name); if (w) o.label[p.tier + ':' + w.need] = 1; });
    o.label = Object.keys(o.label).sort().join(','); return o; };
  const c0 = run(0, NEEDS), c250 = run(250, NEEDS), c1050 = run(1050, NEEDS), plant = run(0, null), lone = run(0, NEEDS, true);
  const e2 = c0.fort2 === 0 && c0.fort3 === 0 && c0.small3 === 0 && c250.fort2 > 0 && c250.fort3 === 0 && c250.small3 > 0 && c1050.fort3 > 0 && [c0, c250, c1050, lone].every(x => x.empty === 0) && plant.fort3 > 0 && plant.small3 > 0 && /fortress:250/.test(c0.label) && /fortress:1050/.test(c250.label) && c1050.label === '';
  ok('E2 the boards by CLOUT (14 places, ten windows): at 0 no fortress posts two- or three-skull work and no town or camp three-skull; at 250 the two-skull fortress work and the towns\' three-skull open; at 1050 the fortresses\' three-skull work; no board is ever empty (a valley whose fortresses hold only three-skull work too); the label says 250, then 1050, then nothing; planted (no needs) the big work is back at 0',
    e2, 'CLOUT 0 ' + JSON.stringify(c0) + ' | 250 ' + JSON.stringify(c250) + ' | 1050 ' + JSON.stringify(c1050) + ' | planted ' + JSON.stringify(plant) + ' | only three-skull fortresses ' + JSON.stringify(lone)); }
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
  if (BUILDS.indexOf('C') >= 0) { const cc = rows.filter(r => r.build === 'C');
    const bad = cc.filter(r => r.err || !r.dropMatch || !r.failMatch || !/^DROP IT /.test((r.dropCard || {}).words || '') || !r.cardFits);
    ok('C3 on his phone, the demo and the alpha, upright and sideways: a job\'s card says what dropping it and failing it cost before the yes; one taken and dropped in the town with a finger moves the bar and CLOUT exactly as its card said; the job that changes halfway taken and walked away from at its turn with a finger is lost and moves them exactly as its card said; every card button on the glass', cc.length === 4 && !bad.length,
      cc.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' [' + r.dropCard.words + '] dropped ' + r.drop0.bar + '->' + r.drop1.bar + ' CLOUT ' + r.drop0.clout + '->' + r.drop1.clout + (r.dropMatch ? '' : ' NOT AS SAID') + '; [' + r.failCard.words + '] walked away ' + r.fail0.bar + '->' + r.fail1.bar + ' CLOUT ' + r.fail0.clout + '->' + r.fail1.clout + (r.failMatch ? '' : ' NOT AS SAID') + (r.cardFits ? '' : '; A BUTTON OFF THE GLASS'))).join(' | ')); }
  if (BUILDS.indexOf('D') >= 0) { const dd = rows.filter(r => r.build === 'D');
    const bad = dd.filter(r => r.err || !r.ok || !r.cardFits);
    ok('D3 on his phone, the demo and the alpha, upright and sideways: a one-skull find\'s card, Into your place tapped with a finger, the pay he is shown drops by exactly the build\'s worth and the map holds the job at that pay; taken and played to the pay, the batteries paid are the card\'s and the build is his (standing, or waiting for his place); every card button on the glass', dd.length === 4 && !bad.length,
      dd.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' ' + r.id + ' ' + r.pay0 + ' -> ' + r.pay1 + ' + ' + (r.into1 || {}).build + ', paid ' + (r.paid || {}).paid + ' of ' + (r.held || {}).pay + ', ' + ((r.home || {}).thing ? 'standing' : (r.home || {}).waiting ? 'waiting for his place' : 'NOT HIS') + (r.ok ? '' : ' NOT OK') + (r.cardFits ? '' : '; A BUTTON OFF THE GLASS'))).join(' | ')); }
  if (BUILDS.indexOf('E') >= 0) { const ee = rows.filter(r => r.build === 'E');
    ok('E3 on his phone, the demo and the alpha, upright and sideways: at 200 CLOUT a fortress\'s board has no two-skull work and says MORE WORK HERE AT 250 CLOUT; one job played to the pay (+100); when the board turns its two-skull work is there (at 200 that window would post none) and the label names 1050', ee.length === 4 && ee.every(r => !r.err && r.ok),
      ee.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' ' + JSON.stringify(r.before.skulls) + ' [' + r.before.label + '] -> paid ' + (r.paid || {}).paid + ', CLOUT ' + r.cloutAfterJob + ' -> ' + JSON.stringify(r.after.skulls) + ' [' + r.after.label + ']' + (r.ok ? '' : ' NOT OK'))).join(' | ')); }
  ok('A5 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
