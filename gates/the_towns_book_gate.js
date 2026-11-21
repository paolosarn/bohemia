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
   *** 11/21, RULE 466(c) (his votes): B (PUSH THE PAY) and D (PAID INTO YOUR PLACE) are KILLED: their legs are now B1 and D1, which
   hold them dead (and their phone legs in the tool are dead with them, never run); C's card lines are gone and C1/C3 hold the numbers in the
   background and the bar's CLOUT (__CLOUT_ON_THE_BAR__). ***
   BUILD E (11/18), THE BIG WORK WAITS FOR A NAME: E1 the files (job_clout.json, TUNING's row, the shelf's gate, the board's label);
   E2 the boards by CLOUT on the real shelf (planted: the needs gone); E3 on his phone (--build E): a job done opens a fortress's work.
   BUILD H (11/20), THE TOWN'S BAR ON ITS BOARD: H1 the files (the board's line and its marks, the rail, the shelf's key carries the
   bars); H2 the deal follows the bar on the real shelf (planted: the old key); H3 on his phone (--build H): four bars on a fortress's
   board and a friend's extra job on a town's, the line against the board and the arrival card's number.
   node gates/the_towns_book_gate.js     JOBS_FILES=1 the files only     JOBS_BUILD=A,B,C,D,E,H (the phone legs of those builds)
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
/* ---------- 11/21, RULE 466(c): THE JOBS DO WAY TOO MUCH ---------- */
/* PUSH THE PAY (B) and PAID INTO YOUR PLACE (D) are killed and graveyarded; WHAT WALKING AWAY COSTS (C) keeps its numbers in the background
   and the card stops explaining them; CLOUT stands on the map's bar */
{ const SHf = T('slices/bohemia_board_shelf.js'), CWf = T('slices/BOHEMIA_CITY_WORLD.html'), JKf = T('slices/bohemia_job_kinds.js');
  const b1 = [!/function hag(Rule|Ask|Pay|Of|Walked)\(/.test(SS) && !/data-ask/.test(SS) && !/'Ask \+'/.test(SS), !/function walkedOut\(/.test(SHf) && !/bohemia\.haggle\.v1/.test(SHf),
    fs.existsSync(path.join(ROOT, 'graveyard/POSTMORTEM_JOBS_PUSH_THE_PAY_11_21_26.txt'))];
  ok('B1 PUSH THE PAY IS DEAD: no ask on a card, no pushed pay, nobody walks off a board; its post-mortem in the graveyard', b1.every(Boolean), b1.map(x => x ? 1 : 0).join(''));
  const d1 = [!/function intoList\(/.test(SS) && !/Into your place/.test(SS) && !/job_into_place\.json/.test(SS), !/c\.into && c\.into\.build/.test(CWf) && !/job\.into && job\.into\.build/.test(JKf),
    !fs.existsSync(path.join(ROOT, 'records/target/bb/job_into_place.json')) && fs.existsSync(path.join(ROOT, 'graveyard/jobs_paid_into_your_place_11_17_26/job_into_place.json')) && fs.existsSync(path.join(ROOT, 'graveyard/POSTMORTEM_JOBS_PAID_INTO_YOUR_PLACE_11_21_26.txt')),
    rowOf('job_into_place.share') === null];
  ok('D1 PAID INTO YOUR PLACE IS DEAD: no build on a card, the map takes the whole pay, the pay-out stands no build; its file and post-mortem in the graveyard, out of TUNING\'s table', d1.every(Boolean), d1.map(x => x ? 1 : 0).join('')); }
{ const RN = J('records/target/bb/renown.json'), G = (RN.gains || {}).value || {}, A = REL.acts || {}, UIM = T('slices/bohemia_ui_materials.js');
  const c1 = [A.cancel_contract && A.cancel_contract.value === -10 && A.fail_civilian_contract && A.fail_civilian_contract.value === -20 && /bb_all\/1670/.test(A.cancel_contract.source || ''),
    G.cancel_contract === -100 && G.fail_civilian_contract === -75,
    !/function costWords\(/.test(SS) && !/trip quit/.test(SS) && !/'DROP IT '/.test(SS),
    /__CLOUT_ON_THE_BAR__/.test(UIM) && /g \+= '<span class="s clout" data-f="clout"><i>' \+ hudEsc\(RN\.WORD \|\| 'CLOUT'\) \+ '<\/i><b>' \+ RN\.score\(\) \+ '<\/b><\/span>'/.test(UIM)];
  ok('C1 the files: dropping a job still costs its town 10 and 100 CLOUT, failing it 20 and 75 (the wiki\'s), in the background; the card no longer explains it; CLOUT stands on the map\'s bar, one number', c1.every(Boolean), c1.map(x => x ? 1 : 0).join('')); }
/* ---------- BUILD E (11/18), THE BIG WORK WAITS FOR A NAME ---------- */
{ const JC = J('records/target/bb/job_clout.json'), N = (JC.needs || {}).value || {};
  const e1 = [N.fortress && N.fortress['3'] === 1050 && N.fortress['2'] === 250 && N.town && N.town['3'] === 250 && N.camp && N.camp['3'] === 250,
    /require completing an ambition to reach Professional Renown \(1050\) to unlock/.test(JC.needs.quote || '') && /bb_all\/0724/.test(JC.needs.source || '') && /more difficult Contracts people will entrust you/.test(JC.needs.quote2 || ''),
    rowOf('job_clout.needs') === '250 / 1050',
    /function needOf\(o, tier\)/.test(SH) && /if \(CL != null\) ordinary = ordinary\.filter\(function \(o\) \{ var nd = needOf\(o, tier\); if \(CL >= nd\) return true; waiting\.push\(o\)/.test(SH) && /cloutLevel\(clout\(\)\)/.test(SH) && /if \(waiting\.length\) \{/.test(SH) && /function waits\(name, tier, day\)/.test(SH) && /waits: waits,/.test(SH) && /job_clout\.json/.test(SH),
    /BohemiaBoardShelf\.waits\(S\.place\.name, S\.place\.tier, buildDay\(\)\)/.test(SS) && /'MORE WORK HERE AT ' \+ WN\.need \+ ' CLOUT \\u00b7 YOU HAVE '/.test(SS)];
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
      const w = S.waits(p.name, p.tier, d); if (w) o.label[p.tier + ':' + w.need] = 1;   /* the board's own line, worked out when it is asked */ });
    o.label = Object.keys(o.label).sort().join(','); return o; };
  const c0 = run(0, NEEDS), c250 = run(250, NEEDS), c1050 = run(1050, NEEDS), plant = run(0, null), lone = run(0, NEEDS, true);
  const e2 = c0.fort2 === 0 && c0.fort3 === 0 && c0.small3 === 0 && c250.fort2 > 0 && c250.fort3 === 0 && c250.small3 > 0 && c1050.fort3 > 0 && [c0, c250, c1050, lone].every(x => x.empty === 0) && plant.fort3 > 0 && plant.small3 > 0 && /fortress:250/.test(c0.label) && /fortress:1050/.test(c250.label) && c1050.label === '';
  ok('E2 the boards by CLOUT (14 places, ten windows): at 0 no fortress posts two- or three-skull work and no town or camp three-skull; at 250 the two-skull fortress work and the towns\' three-skull open; at 1050 the fortresses\' three-skull work; no board is ever empty (a valley whose fortresses hold only three-skull work too); the label says 250, then 1050, then nothing; planted (no needs) the big work is back at 0',
    e2, 'CLOUT 0 ' + JSON.stringify(c0) + ' | 250 ' + JSON.stringify(c250) + ' | 1050 ' + JSON.stringify(c1050) + ' | planted ' + JSON.stringify(plant) + ' | only three-skull fortresses ' + JSON.stringify(lone)); }
/* ---------- BUILD H (11/20), THE TOWN'S BAR ON ITS BOARD ---------- */
{ const h1 = [/__THE_TOWNS_BAR_ON_ITS_BOARD__/.test(SS) && /TB = JP && JP\.board \? JP\.board\(S\.place\.name, buildDay\(\)\) : null/.test(SS) && /bl\.appendChild\(document\.createTextNode\('WHAT THEY THINK OF YOU: '\)\)/.test(SS),
    /if\(bh\.length <= TB\.cap && under\(TB\.maxSkulls\)\)/.test(SS) && /if\(under\(TB\.maxSkulls\)\)\{ bl\.appendChild\(document\.createTextNode\(' · UP TO '\)\)/.test(SS) && /if\(bh\.length > base\) bl\.appendChild/.test(SS),
    /function barsSig\(\)/.test(SH) && /cloutLevel\(clout\(\)\) \+ '\|' \+ barsSig\(\) \+ '\|'/.test(SH),
    /\.slots\.bar\{/.test(SS) && /\.slots\.bar \.rail\{/.test(SS)];
  ok('H1 the files: the board\'s own line (the arrival card\'s words, read by the reader that sizes the board), each mark said only when the board in front of him keeps it, its rail; the shelf deals again when a bar moves',
    h1.every(Boolean), h1.map(b => b ? 1 : 0).join('')); }
{ /* the deal follows the bar: the shelf's own file, a reader of the bars that reads only the towns' record (as the game's does), one
     window, the same ask twice with only the bar moved between; planted (the old key, no bars in it) the second ask is the first */
  const run = (src) => { const store = {}, B = REL.board.value, W = { localStorage: { getItem: k => (store[k] == null ? null : store[k]), setItem: (k, v) => { store[k] = String(v); } }, WORLD_SEED: 'K7QM9X',
      BohemiaJobDanger: { fits: () => true, fitVer: () => 'v' } };
    W.BohemiaJobPay = { board: (name) => { let v = 50; try { const r = JSON.parse(store['bohemia.relations.v1'] || '{}'); if (r.bars && typeof r.bars[name] === 'number') v = r.bars[name]; } catch (e) {}
      const band = v < 10 ? 'hostile' : v < 40 ? 'cold' : v >= 70 ? 'friendly' : 'neutral'; return { band, score: v, maxSkulls: B.max_skulls[band] == null ? 3 : B.max_skulls[band], cap: band === 'hostile' ? B.hostile_jobs : null, more: (B.more[band] | 0) }; } };
    W.window = W; vm.createContext(W); vm.runInContext(src, W);
    const doc = J('records/target/BOHEMIA_BOARD_SHELF.json'), K = J('records/target/BOHEMIA_JOB_KINDS.json'), have = {}; doc.offers.forEach(o => have[o.id] = 1); K.board_people.rows.forEach(o => { if (!have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
    W.BohemiaBoardShelf.set(doc); const SHx = W.BohemiaBoardShelf, tiers = ['camp', 'town', 'fortress'], P = TOWNS.map((n, i) => ({ name: n, tier: tiers[i % 3], traits: [] }));
    /* each ask on a clean board (a job posted in a window stays posted for it, the game's own rule: a board posted at Neutral keeps its
       work when the town turns Cold, and the line says nothing it does not keep) */
    const put = (n, v) => { delete store['bohemia.board.posted.v1']; delete store['bohemia.board.read.v1']; store['bohemia.relations.v1'] = JSON.stringify({ bars: { [n]: v }, seen: {} }); }, o = { more: 0, less: 0, same: 0, cold3: 0, hostileOver: 0 };
    for (let d = 0; d < 30; d += 3) P.forEach(p => {
      put(p.name, 50); const a = (SHx.pick(p, d, { places: P }) || []).length; put(p.name, 75); const b = (SHx.pick(p, d, { places: P }) || []).length;
      put(p.name, 34); const c = SHx.pick(p, d, { places: P }) || []; put(p.name, 5); const h = SHx.pick(p, d, { places: P }) || [];
      if (b > a) o.more++; else if (b < a) o.less++; else o.same++; if (c.some(x => (x.skulls | 0) >= 3)) o.cold3++; if (h.length > 1) o.hostileOver++; });
    return o; };
  const now = run(SH), plant = run(SH.replace("'|' + barsSig() + '|'", "'|'"));
  ok('H2 the deal follows the bar (the shelf\'s own file, 14 places, ten windows, one window each, only the bar moved): Friendly posts more where it can and never less, Cold then no three-skull work, Hostile then one job; planted (the old key) Friendly the same as Neutral every time',
    now.more > 0 && now.less === 0 && now.cold3 === 0 && now.hostileOver === 0 && plant.more === 0, 'now ' + JSON.stringify(now) + ' | planted ' + JSON.stringify(plant)); }
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
  if (BUILDS.indexOf('C') >= 0) { const cc = rows.filter(r => r.build === 'C');
    const bad = cc.filter(r => r.err || !r.dropMatch || !r.failMatch || r.dropCard.explains || r.failCard.explains || (r.dropCard.acts || []).concat(r.failCard.acts || []).some(a => /^Ask|^Into your place/.test(a)) || !r.cardFits ||
      !(r.bar && r.bar.length === 3 && r.bar.every(b => b.shown && b.shown.seen && b.shown.n === b.clout)));
    ok('C3 on his phone, the demo and the alpha, upright and sideways: a job\'s card no longer explains what dropping or failing costs and has no ask and no build; one taken and dropped in the town with a finger, and the job that changes halfway walked away from at its turn, still move the bar and CLOUT by the game\'s own numbers; the map\'s bar shows CLOUT on the glass, the company\'s own number, before and after each', cc.length === 4 && !bad.length,
      cc.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' card [' + (r.dropCard.acts || []).join('/') + '] dropped ' + r.drop0.bar + '->' + r.drop1.bar + ' CLOUT ' + r.drop0.clout + '->' + r.drop1.clout + ', failed ' + r.fail0.bar + '->' + r.fail1.bar + ' CLOUT ' + r.fail0.clout + '->' + r.fail1.clout + '; the bar ' + (r.bar || []).map(b => b.shown ? b.shown.n + (b.shown.seen ? '' : ' UNSEEN') : 'NONE').join(',') + (r.dropMatch && r.failMatch ? '' : ' NOT THE GAME\'S NUMBERS'))).join(' | ')); }
  if (BUILDS.indexOf('E') >= 0) { const ee = rows.filter(r => r.build === 'E');
    ok('E3 on his phone, the demo and the alpha, upright and sideways: at 200 CLOUT a fortress\'s board has no two-skull work and says MORE WORK HERE AT 250 CLOUT; one job played to the pay (+100); when the board turns its two-skull work is there (at 200 that window would post none) and the label names 1050', ee.length === 4 && ee.every(r => !r.err && r.ok),
      ee.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.town + ' ' + JSON.stringify(r.before.skulls) + ' [' + r.before.label + '] -> paid ' + (r.paid || {}).paid + ', CLOUT ' + r.cloutAfterJob + ' -> ' + JSON.stringify(r.after.skulls) + ' [' + r.after.label + ']' + (r.ok ? '' : ' NOT OK'))).join(' | ')); }
  if (BUILDS.indexOf('H') >= 0) { const hh = rows.filter(r => r.build === 'H');
    ok('H3 on his phone, the demo and the alpha, upright and sideways: a fortress\'s board at Hostile 5, Cold 34, Neutral 50 and Friendly 75 says WHAT THEY THINK OF YOU with the band and the number the arrival card reads, its rail at the number, on the glass, each mark only as the board keeps it (1 JOB, UP TO two, the extra job only when posted); a town at Neutral then Friendly: 2 people then 3 and +1 JOB; one window, only the bar moved: 2 then 3',
      hh.length === 4 && hh.every(r => !r.err && r.ok), hh.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.bars.map(b => b.set + ' [' + (b.line ? b.line.text.replace('WHAT THEY THINK OF YOU: ', '') : 'NONE') + '] ' + b.ids.length).join(', ') + '; ' + r.town2 + ' ' + r.friend.map(f => f.set + ' [' + (f.line ? f.line.text.replace('WHAT THEY THINK OF YOU: ', '') : 'NONE') + '] ' + f.ids.length).join(', ') + ', redeal ' + JSON.stringify(r.redeal) + (r.ok ? '' : ' NOT OK'))).join(' | ')); }
  ok('A5 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
