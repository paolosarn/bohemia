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
  await p.waitForTimeout(600);

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
  ok('a town has six: hall, board, stall, barber, bar, scavenge', keys.join() === 'hall,board,stall,barber,bar,lot', keys.join());
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

  /* the bar: a round costs one battery and pays a rumour */
  const bb = await bat();
  await tapB('bar'); await p.waitForTimeout(200);
  await p.click('#sbody .act'); await p.waitForTimeout(200);
  const rum = await p.evaluate(() => (window.__settleLog.filter(m => m.act === 'round').pop() || {}).rumour || '');
  ok('the bar: one battery for a round, and a rumour out of a mouth', bb - (await bat()) === 1 && rum.length > 20, rum.slice(0, 50));
  await p.evaluate(() => BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 1, 'gate', null, 0));

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

  /* a camp has four and the rest are SHUT, not tappable */
  const camp = await p.evaluate(() => { BohemiaSettlement.open({ place: { tier: 'camp', name: 'A CAMP' } });
    return { o: BohemiaSettlement.order().join(), shut: !!BohemiaSettlement.where('barber') }; });
  ok('a camp: hall, board, stall, scavenge, and no barber standing', camp.o === 'hall,board,stall,lot' && !camp.shut, camp.o);

  /* a fortress has all eight; the clinic and the yard only work for a real reason */
  const fort = await p.evaluate(() => { BohemiaSettlement.open({ place: { tier: 'fortress', name: 'A FORTRESS' } }); return BohemiaSettlement.order().length; });
  ok('a fortress has all eight', fort === 8, fort);
  await tapB('clinic'); await p.waitForTimeout(200);
  const noHurt = await p.evaluate(() => document.querySelector('#sbody .act').disabled);
  await p.evaluate(() => BohemiaSettlement.open({ wounded: ['rosa'], veterans: ['jonah'] }));
  await tapB('clinic'); await p.waitForTimeout(200);
  const cb = await bat(); await p.click('#sbody .act'); await p.waitForTimeout(150);
  ok('the clinic refuses with nobody hurt, and takes one battery for a wound', noHurt && cb - (await bat()) === 1);
  await tapB('train'); await p.waitForTimeout(200);
  const tb = await bat(); await p.click('#sbody .act'); await p.waitForTimeout(150);
  ok('the yard swaps a veteran\'s mastery for one battery', tb - (await bat()) === 1);
  await p.click('#close'); await p.waitForTimeout(300);
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' } }));
  await p.waitForTimeout(200);
  await p.screenshot({ path: SHOT });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' } }));
  await p.waitForTimeout(200);
  await p.screenshot({ path: SHOT.replace('_10_1', '_FORTRESS_10_1') });
  await p.click('#leave');
  const left = await p.evaluate(() => (window.__settleLog || []).some(m => m.act === 'leave'));
  ok('LEAVE tells the game you left', left);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));

  await b.close(); srv.close();
  console.log('\nTHE SETTLEMENT SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
