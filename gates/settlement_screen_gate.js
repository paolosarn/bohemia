/* ============================================================================
   THE SETTLEMENT SCREEN GATE  (RUN 2, row [settlement screen], 10/1/26)

   Rule 37b (Paolo 9/27): "you see the settlement but you just click the building."
   This drives slices/BOHEMIA_SETTLEMENT_SCREEN.html on his phone's profile (390x844 at
   3x) and proves every building is a real door that does a real thing:
     - the place is drawn from the approved storefront art, at real pixels
     - five buildings, each tappable ON THE PICTURE and on the shelf, every target 44
     - every building speaks through a face and a name (rule 32a), never a bare card
     - the barber takes exactly one battery and refuses when broke (CHARACTER's cost)
     - the board holds two contracts at most (rule 51) and tells the game each one
     - scavenge is one thing or nothing and the lot runs out (WORLD's engine)
     - the hall offers a follower through a mouth and hires on a tap
     - LEAVE tells the game; nothing threw
   It also writes the proof shot to slices/vote/RUN2_THE_SETTLEMENT_SCREEN_10_1.png.

   Run: node gates/settlement_screen_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.dirname(__dirname);
const PORT = 8833;
const SHOT = path.join(ROOT, 'slices/vote/RUN2_THE_SETTLEMENT_SCREEN_10_1.png');
const SHOT2 = path.join(ROOT, 'slices/vote/RUN2_THE_SETTLEMENT_SCREEN_BARBER_10_1.png');
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };

let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], missing = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(300);

  /* a thumb on the building itself (rule 67: the buildings are the buttons); a window that is
     open is closed first, the way a player would */
  const tapB = async k => {
    if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(300); }
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    if (!xy) throw new Error('no pixels for ' + k);
    await p.mouse.click(xy.x, xy.y);
  };
  ok('every file the screen loads is there', missing.length === 0, missing.slice(0, 2).join(' '));
  const art = await p.evaluate(() => {
    const c = document.getElementById('cv'); const x = c.getContext('2d');
    const d = x.getImageData(0, 0, c.width, c.height).data; let lit = 0;
    for (let i = 0; i < d.length; i += 64) if (d[i] + d[i + 1] + d[i + 2] > 120) lit++;
    return { w: c.width, cssw: c.clientWidth, lit };
  });
  ok('the place is drawn, not a blank box', art.lit > 1000, art.lit + ' lit samples');
  ok('  at the phone\'s real pixels', art.w >= art.cssw * 3 - 1, art.w + ' for ' + art.cssw + ' css');

  const keys = await p.evaluate(() => window.BohemiaSettlement.order());
  ok('the place is ONE painted picture (COMBAT TWO\'s), with the buildings in it: hall, board, stall, smith, armourer, barber, clinic, scavenge', keys.join() === 'hall,board,stall,smith,armourer,barber,clinic,lot', keys.join());
  /* nothing is written on the picture until a finger is on a building (rule 71a) */
  const quiet = await p.evaluate(() => BohemiaSettlement.state.open === null);
  ok('  and no building names itself until it is touched', quiet);
  /* every building is a button on its own pixels, big enough for a thumb, and there is no
     other button on the screen but LEAVE (no shelf, no plates) */
  const onPic = [], small = [];
  for (const k of keys) {
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    if (!xy) continue;
    if (xy.px < 44 * 44) small.push(k + ':' + xy.px);
    await tapB(k); await p.waitForTimeout(150);
    if (await p.evaluate(k => BohemiaSettlement.state.open === k, k)) onPic.push(k);
  }
  ok('every building is a button: tap its own pixels and it opens', onPic.length === keys.length, onPic.join());
  ok('  and every building is bigger than a thumb', small.length === 0, small.join(' ') || 'all over 44x44');
  const extra = await p.evaluate(() => [].slice.call(document.querySelectorAll('button')).filter(b => b.offsetParent && !b.closest('#sheet') && b.id !== 'leave').length);
  ok('  and there are no extra buttons (Battle Brothers: the buildings are the buttons)', extra === 0, extra + ' extra');
  await p.click('#close'); await p.waitForTimeout(300);

  /* every building through a mouth */
  for (const k of keys) {
    await tapB(k);
    await p.waitForTimeout(320);
    const s = await p.evaluate(() => {
      const sh = document.getElementById('sheet');
      return { on: sh.classList.contains('on'), face: !!sh.querySelector('canvas.face'),
               name: (sh.querySelector('.nm') || {}).textContent || '', line: (sh.querySelector('.say p') || {}).textContent || '',
               acts: sh.querySelectorAll('.act').length };
    });
    ok(k + ' opens with a face, a name and a line', s.on && s.face && s.name && s.line.length > 10 && s.acts > 0, s.name + ': ' + s.line.slice(0, 40));
  }

  /* the barber costs one battery */
  const bat = () => p.evaluate(() => BohemiaPurse.balance(BohemiaSettlement.state.purse, 'electricity'));
  const b0 = await bat();
  await tapB('barber'); await p.waitForTimeout(250);
  await p.click('#sbody .act'); await p.waitForTimeout(250);
  const b1 = await bat();
  const opens = await p.evaluate(() => document.querySelectorAll('#sbody .act').length);
  ok('the barber takes exactly one battery', b0 - b1 === 1, b0 + ' -> ' + b1);
  ok('  and opens the face maker and the haircut shelf', opens === 2);
  await p.screenshot({ path: SHOT2 });
  await p.evaluate(() => { const s = BohemiaSettlement.state; BohemiaPurse.debit(s.purse, 'electricity', BohemiaPurse.balance(s.purse, 'electricity'), 'gate', null, 0); });
  await tapB('stall'); await tapB('barber'); await p.waitForTimeout(250);
  const broke = await p.evaluate(() => document.querySelector('#sbody .act').disabled);
  ok('  and refuses when you are broke', broke && (await bat()) === 0);
  await p.evaluate(() => BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 3, 'gate', null, 0));

  /* THE MARKET (rule 75d): the smith sells weapons from the wiki's rows in our names at 10 crowns
     to a battery; the keeper says the price; buying spends exactly that and you carry it; selling
     it back pays the cut */
  await p.waitForFunction(() => (BohemiaSettlement.state.stock.smith || []).length > 0, null, { timeout: 30000 });
  await p.evaluate(() => BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 400, 'gate', null, 0));
  await tapB('smith'); await p.waitForTimeout(250);
  const shelfN = await p.evaluate(() => document.querySelectorAll('#sbody .act').length);
  await p.screenshot({ path: SHOT.replace('_10_1', '_SMITH_10_5') });
  const first = await p.evaluate(() => BohemiaSettlement.state.stock.smith[0]);
  await p.click('#sbody .act'); await p.waitForTimeout(250);
  const said = await p.evaluate(() => document.querySelector('#sbody .say p').textContent + ' | ' + (document.querySelector('#sbody .slots') || {}).textContent);
  ok('the smith has a shelf of weapons in our names', shelfN >= 5 && /pistol|pipe|sledge|rifle|machete|axe|spear|cleaver|chain|hook|bow|bottles|shotgun/.test(first.name), shelfN + ' items, first ' + first.name + ' (was ' + first.was + ')');
  ok('  the keeper says the price and the card shows the numbers', said.indexOf(String(first.price)) >= 0 && /dmg/.test(said), said.slice(0, 90));
  const m0 = await bat();
  await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(250);
  const m1 = await bat(), carried = await p.evaluate(() => BohemiaSettlement.state.stash.length);
  ok('  buying spends exactly the price (10 crowns a battery, floor 1) and you carry it', m0 - m1 === first.price && carried === 1, m0 + ' -> ' + m1 + ', price ' + first.price);
  await tapB('armourer'); await p.waitForTimeout(250);
  const armShelf = await p.evaluate(() => BohemiaSettlement.state.stock.armourer.map(i => i.name).join(', '));
  ok('the armourer sells armour and shields', /vest|jacket|carrier|riot|hood|hat|helm|door|shield/.test(armShelf), armShelf.slice(0, 80));
  const sellBtn = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sbody .act')).findIndex(b => /^Sell your/.test(b.textContent)));
  const s0 = await bat();
  await p.evaluate(i => document.querySelectorAll('#sbody .act')[i].click(), sellBtn); await p.waitForTimeout(250);
  const s1 = await bat();
  ok('  and what you carry sells back for half (the cut is TUNING\'s to source)', sellBtn >= 0 && s1 - s0 === Math.max(1, Math.floor(first.price / 2)), s0 + ' -> ' + s1);
  await p.evaluate(() => BohemiaPurse.debit(BohemiaSettlement.state.purse, 'electricity', BohemiaPurse.balance(BohemiaSettlement.state.purse, 'electricity') - 3, 'gate', null, 0));
  /* the board reads as work: every contract shows its skulls and its pay */
  await tapB('board'); await p.waitForTimeout(250);
  const skulls = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sbody .act em')).map(e => e.textContent));
  ok('the board is where work is: each job shows its skulls and its pay', skulls.length > 0 && skulls.every(t => /\u2620/.test(t) && /batt/.test(t)), skulls.join(' / '));

  /* the board: two contracts max, each told to the game */
  for (let i = 0; i < 3; i++) {
    await tapB('board'); await p.waitForTimeout(200);
    const first = await p.$('#sbody .act:not([disabled])');
    if (!first) break;
    await first.click(); await p.waitForTimeout(150);
    const take = await p.$('#sbody .act:not([disabled])');
    if (take) { await take.click(); await p.waitForTimeout(150); }
  }
  const held = await p.evaluate(() => ({ n: BohemiaSettlement.state.held.length,
    told: (window.__settleLog || []).filter(m => m.act === 'contract').length }));
  ok('the board holds two contracts at most', held.n === 2, held.n + ' held');
  ok('  and tells the game each one it hands over', held.told === 2, held.told + ' posted');

  /* the hall hires through a mouth */
  await tapB('hall'); await p.waitForTimeout(200);
  await p.click('#sbody .act'); await p.waitForTimeout(200);
  const hired = await p.evaluate(() => Object.keys(BohemiaSettlement.state.hired));
  ok('the hall hires the one who asked', hired.length === 1, hired.join());

  /* scavenge: one thing or nothing, and the lot runs out */
  const finds = [];
  for (let i = 0; i < 40; i++) {
    await tapB('lot'); await p.waitForTimeout(60);
    const btn = await p.$('#sbody .act');
    if (!btn || await btn.isDisabled()) break;
    await btn.click(); await p.waitForTimeout(60);
    finds.push(await p.evaluate(() => { const l = window.__settleLog.filter(m => m.act === 'scavenge').pop(); return l.result.found ? 1 : 0; }));
  }
  const total = finds.reduce((a, c) => a + c, 0);
  const clean = await p.evaluate(() => /took it all|picked clean/.test(document.getElementById('sbody').textContent) ? 'picked clean' : 'not');
  ok('scavenge finds one thing or nothing, never a pile', finds.every(f => f === 0 || f === 1), finds.join(''));
  ok('  and the lot runs out', clean === 'picked clean' && total === 6, total + ' found, shelf says ' + clean);

  await p.click('#close'); await p.waitForTimeout(300);

  /* every tier is its own painting, and the same buildings stand in each */
  for (const t of ['camp', 'fortress']) {
    const o = await p.evaluate(t => { BohemiaSettlement.open({ place: { tier: t, name: 'A ' + t.toUpperCase() } }); return BohemiaSettlement.order().join(); }, t);
    await p.waitForFunction(() => BohemiaSettlement.ready(), null, { timeout: 30000 });
    const want = t === 'camp' ? 'hall,board,stall,arms,barber,clinic,lot' : 'hall,board,stall,smith,armourer,barber,clinic,lot';
    ok('a ' + t + ' is its own picture, with Battle Brothers\' shops for its size (camp one stall, town and fortress a smith and an armourer)', o === want, o);
  }
  await tapB('clinic'); await p.waitForTimeout(200);
  const noHurt = await p.evaluate(() => document.querySelector('#sbody .act').disabled);
  await p.evaluate(() => BohemiaSettlement.open({ wounded: ['rosa'], veterans: ['jonah'] }));
  await tapB('clinic'); await p.waitForTimeout(200);
  const cb = await bat(); await p.click('#sbody .act'); await p.waitForTimeout(150);
  ok('the clinic refuses with nobody hurt, and takes one battery for a wound', noHurt && cb - (await bat()) === 1);
  await p.click('#close'); await p.waitForTimeout(300);
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' } }));
  await p.waitForTimeout(800);
  await p.screenshot({ path: SHOT });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' }, night: true }));
  await p.waitForTimeout(800);
  await p.screenshot({ path: SHOT.replace('_10_1', '_FORTRESS_10_1') });
  await p.click('#leave');
  const left = await p.evaluate(() => (window.__settleLog || []).some(m => m.act === 'leave'));
  ok('LEAVE tells the game you left', left);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));

  await b.close(); srv.close();
  console.log('\nTHE SETTLEMENT SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
