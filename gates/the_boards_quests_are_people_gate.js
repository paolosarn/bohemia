/* THE BOARD'S QUESTS ARE PEOPLE (RUN TWO [the board's quests are people], 10/18/26).
   His 10/17 ANYTHING ELSE: 'no more cards with quests, make an actual quest'; RUN TWO's 10/1 jump list: 'the contract
   board reading QUESTS' 96-quest shelf instead of 4 drafted offers'. QUESTS is research only (rule 35): read its bank,
   never ask it to build.
     THE SHELF   records/target/BOHEMIA_BOARD_SHELF.json is what tools/bohemia_run2_board_shelf.py bakes; every row is
                 one of QUESTS' act-one contract designs (the file is on disk, KIND contract, the client named in it, its
                 skulls), says two sentences with the pay in the second, pays 30 a skull, and wears a look with a fresh
                 talking portrait; each tier's pool is deep enough that three places read three boards.
     THE BOARD   on his phone's profile with real taps: a camp, a town and a fortress on the same day read three
                 different boards of 1, 2 and 3 people from the shelf, none of the four drafted offers, every face
                 fresh; a client speaks two sentences with the button's pay in the second; take it and someone else
                 steps up; a RAIDED town keeps one job and it names the crew that hit it from FACTIONS' raid ledger;
                 a SICK town asks for medicine first; three map days on, the board is new; with the shelf blocked
                 the four drafted offers stand (the fallback).
     THE PHONE   the phone's list (UI's slices/bohemia_phone_board.js) run against three places lists exactly what
                 each place's board offers that day.
   Run: node gates/the_boards_quests_are_people_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8875;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const SHELF_F = path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json');

/* ---------- THE SHELF ---------- */
const before = fs.readFileSync(SHELF_F, 'utf8');
const bake = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_run2_board_shelf.py')], { cwd: ROOT, encoding: 'utf8' });
const after = fs.readFileSync(SHELF_F, 'utf8');
if (after !== before) fs.writeFileSync(SHELF_F, before);
ok('the shelf is what the bake tool makes from QUESTS\' designs, byte for byte', bake.status === 0 && after === before, (bake.stderr || '').trim().slice(0, 120) || (after === before ? 'same' : 'DRIFTED'));
const shelf = JSON.parse(before), rows = shelf.offers || [];
const crewLooks = ((fs.readFileSync(path.join(ROOT, 'engine/bohemia_crew_faces.js'), 'utf8').match(/var LOOKS = \[([^\]]+)\]/) || [, ''])[1].match(/'[^']+'/g) || []).map(s => s.slice(1, -1));
const bad = [];
rows.forEach(r => {
  const f = path.join(ROOT, r.design || '');
  if (!/^questbook\/designs\/act1\/QD_/.test(r.design || '') || !fs.existsSync(f)) return bad.push(r.id + ': no design file');
  const t = fs.readFileSync(f, 'utf8');
  if (!/^KIND:\s*contract/m.test(t)) bad.push(r.id + ': not a contract');
  if (t.toLowerCase().indexOf(String(r.client && r.client.name).toLowerCase()) < 0) bad.push(r.id + ': client not in the design');
  const sk = (t.match(/SKULLS:\s*(\d)/) || [])[1]; if (sk && +sk !== r.skulls) bad.push(r.id + ': skulls ' + r.skulls + ' vs ' + sk);
  const ss = String(r.says).trim().split(/(?<=[.!?])\s+/);
  if (ss.length !== 2 || ss[1].indexOf('{pay}') < 0 || ss[0].indexOf('{pay}') >= 0) bad.push(r.id + ': not two sentences with the pay in the second');
  if (r.pay !== 30 * r.skulls) bad.push(r.id + ': pay ' + r.pay);
  if (crewLooks.indexOf(r.client && r.client.look) < 0) bad.push(r.id + ': no fresh portrait for ' + (r.client && r.client.look));
  if (r.draft !== true || !r.client || r.client.draft !== true) bad.push(r.id + ': not draft');
});
ok('every row is one of QUESTS\' act-one contracts, its client and skulls, two sentences with the pay in the second, a fresh talking face (' + rows.length + ' rows)', rows.length >= 30 && bad.length === 0, bad.slice(0, 3).join(' | '));
ok('  every id is its own', new Set(rows.map(r => r.id)).size === rows.length);
const pool = w => rows.filter(r => w(r)).length;
const deep = { camp: pool(r => !r.when && r.tiers.includes('camp')), town: pool(r => !r.when && r.tiers.includes('town')), fortress: pool(r => !r.when && r.tiers.includes('fortress')),
  raided: pool(r => r.when === 'raided'), sickness: pool(r => r.when === 'sickness'), market_day: pool(r => r.when === 'market_day') };
ok('  each pool is deep enough for boards to differ (three times its count; two of each kind of trouble)', deep.camp >= 3 && deep.town >= 6 && deep.fortress >= 9 && deep.raided >= 2 && deep.sickness >= 2 && deep.market_day >= 2, JSON.stringify(deep));

/* ---------- LIVE ---------- */
const PHONE_PAGE = '<!doctype html><meta charset=utf-8><body><div id=cityfeed class=on><div id=cityfeedlist></div></div>' +
  '<script>var T={day:4,min:600}; var city={x:0,y:0}; var LOOP={held:[]}; var PL={"COPPER SHEDS":{x:10,y:0,tier:"camp"},"THE WASH, NORTH LAS VEGAS":{x:0,y:5,tier:"town"},"THE FORT":{x:20,y:20,tier:"fortress"}};' +
  'function ctBases(){ return PL; } function mapTierOf(n){ return PL[n].tier; }</script><script src="bohemia_phone_board.js"></script>';
let block = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/slices/__phone_board_test.html') { rs.setHeader('content-type', 'text/html'); return rs.end(PHONE_PAGE); }
  if (block && /BOHEMIA_BOARD_SHELF\.json$/.test(u)) { rs.statusCode = 404; return rs.end(); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(300);
  const tapBoard = async () => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); }
    const xy = await p.evaluate(() => BohemiaSettlement.where('board')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(500);
  };
  const board = () => p.evaluate(() => [].slice.call(document.querySelectorAll('#sheet .act.client')).map(b => ({ id: b.dataset.id,
    name: (b.querySelector('.cn') || {}).textContent || '', face: (b.querySelector('canvas.face') || { dataset: {} }).dataset.face, pay: (b.querySelector('em') || {}).textContent || '' })));
  const visit = async (o) => { await p.evaluate(o => BohemiaSettlement.open(o), o); await p.waitForTimeout(250); await tapBoard(); return board(); };
  const PLACES = [{ name: 'COPPER SHEDS', tier: 'camp' }, { name: 'THE WASH, NORTH LAS VEGAS', tier: 'town' }, { name: 'THE FORT', tier: 'fortress' }];
  const boards = [];
  for (const pl of PLACES) boards.push(await visit({ place: pl, traits: [], day: 4, contracts: [] }));
  const ids = new Set(rows.map(r => r.id));
  ok('a camp, a town and a fortress on the same day: 1, 2 and 3 people at the board', boards.map(x => x.length).join() === '1,2,3', boards.map(x => x.map(c => c.name).join(' + ')).join(' | '));
  const sig = boards.map(x => x.map(c => c.id).sort().join());
  ok('  three different boards', new Set(sig).size === 3);
  ok('  every one from QUESTS\' shelf, none of the four drafted offers', boards.flat().every(c => ids.has(c.id)) && !boards.flat().some(c => /^ct-/.test(c.id)), boards.flat().map(c => c.id).join(' '));
  ok('  and every face at the board is a fresh portrait', boards.flat().every(c => c.face === 'fresh'), boards.flat().map(c => c.face).join(' '));

  /* he speaks it, the pay in the second sentence */
  await visit({ place: PLACES[1], traits: [], day: 4, contracts: [] });
  const first = (await board())[0];
  await p.click('#sheet .act.client'); await p.waitForTimeout(250);
  const spoke = await p.evaluate(() => ({ nm: (document.querySelector('#sbody .who .nm') || {}).textContent || '', p: (document.querySelector('#sbody .who .say p') || {}).textContent || '',
    face: (document.querySelector('#sbody .who canvas.face') || { dataset: {} }).dataset.face }));
  const ss = spoke.p.split(/(?<=[.!?])\s+/), pay = (first.pay.match(/(\d+)\s*batt/) || [])[1];
  ok('tap one and the client speaks the job in two sentences, the button\'s pay in the second, under a fresh face', ss.length === 2 && !!pay && ss[1].indexOf(pay + ' batteries') >= 0 && ss[0].indexOf(pay) < 0 && spoke.face === 'fresh' && spoke.nm === first.name, spoke.nm + ': ' + spoke.p);
  const take = await p.evaluate(() => { const b = [].slice.call(document.querySelectorAll('#sheet .act')).filter(x => /Take it/.test(x.textContent))[0]; return !!b; });
  if (take) { await p.locator('#sheet .act', { hasText: 'Take it' }).click(); await p.waitForTimeout(350); }
  if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); }
  await tapBoard();
  const after1 = await board();
  ok('take it and someone else steps up to the board, the taken job gone', take && after1.length === 2 && !after1.some(c => c.id === first.id), after1.map(c => c.name).join(' + '));

  /* a raided town keeps one job: the crew that hit it */
  const raid = await visit({ place: PLACES[1], traits: null, day: 5, contracts: [], ledger: { marks: [{ place: 'THE WASH', trait: 'raided', by: 'Cartel', party: 'p1', from: 2, until: 9 }] }, ledgerPlace: 'THE WASH' });
  const traitsNow = await p.evaluate(() => BohemiaSettlement.state ? (BohemiaSettlement.state.traits || []).map(t => t.id) : []);
  let raidLine = '';
  if (raid.length) { await p.click('#sheet .act.client'); await p.waitForTimeout(250); raidLine = await p.evaluate(() => (document.querySelector('#sbody .who .say p') || {}).textContent || ''); }
  const raidIds = new Set(rows.filter(r => r.when === 'raided').map(r => r.id));
  ok('a RAIDED town keeps one job, and it is the crew that hit it, named from the raid ledger', raid.length === 1 && raidIds.has(raid[0].id) && /\bthe Cartel\b/i.test(raidLine), traitsNow.join(',') + ' | ' + (raid[0] || {}).name + ': ' + raidLine);

  /* a sick town asks for medicine first */
  const sick = await visit({ place: PLACES[1], traits: ['sickness'], day: 4, contracts: [] });
  const sickIds = new Set(rows.filter(r => r.when === 'sickness').map(r => r.id));
  ok('a SICK town asks for medicine first, then its own people', sick.length === 2 && sickIds.has(sick[0].id) && !sickIds.has(sick[1].id), sick.map(c => c.id).join(' '));

  /* three map days on, a new board */
  const later = await visit({ place: PLACES[2], traits: [], day: 4 + (shelf.refresh_days || 3), contracts: [] });
  ok('three map days on, the fortress has a new board', later.length === 3 && later.map(c => c.id).sort().join() !== sig[2], later.map(c => c.id).join(' '));

  /* the fallback: the shelf blocked, the four drafted offers stand */
  block = true;
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await q.waitForTimeout(500);
  await q.evaluate(() => BohemiaSettlement.open({ place: { name: 'THE WASH, NORTH LAS VEGAS', tier: 'town' }, traits: [], day: 4, contracts: [] }));
  await q.waitForTimeout(250);
  const xy = await q.evaluate(() => BohemiaSettlement.where('board')); await q.mouse.click(xy.x, xy.y); await q.waitForTimeout(400);
  const fb = await q.evaluate(() => [].slice.call(document.querySelectorAll('#sheet .act.client')).map(b => b.dataset.id));
  ok('with the shelf blocked, the four drafted offers stand (the fallback)', fb.length === 2 && fb.every(id => /^ct-/.test(id)), fb.join(' '));
  block = false;

  /* the phone lists what each place's board offers */
  const ph = await ctx.newPage(); ph.on('pageerror', e => errs.push('phone: ' + e.message));
  await ph.goto('http://127.0.0.1:' + PORT + '/slices/__phone_board_test.html', { waitUntil: 'load' });
  await ph.waitForFunction(() => window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 20000 });
  const phone = await ph.evaluate(() => { const by = {}; BohemiaPhoneBoard.asks().forEach(a => { (by[a.place] = by[a.place] || []).push(a.id); }); return by; });
  const agree = PLACES.every((pl, i) => (phone[pl.name] || []).slice().sort().join() === sig[i]);
  ok('THE PHONE lists exactly what each place\'s board offers that day (three places)', agree, PLACES.map(pl => pl.name.slice(0, 9) + ': ' + (phone[pl.name] || []).join(',')).join(' | '));
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE BOARD\'S QUESTS ARE PEOPLE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
