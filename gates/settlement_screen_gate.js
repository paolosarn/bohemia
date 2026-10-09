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
  /* the plain town first: no trait, so every other leg reads the base numbers */
  await p.waitForTimeout(500);
  await p.evaluate(() => BohemiaSettlement.open({ traits: [] }));
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
  ok('the place is ONE painted picture (COMBAT TWO\'s), with the buildings in it: hall, board, stall, bar, smith, armourer, barber, clinic, scavenge', keys.join() === 'hall,board,stall,bar,smith,armourer,barber,clinic,lot,build', keys.join());   /* + BUILD, LIFE+CITY 10/9 [build on the screen] (rule 40b) */
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
               acts: sh.querySelectorAll('.act, .slot.full').length };
    });
    ok(k + ' opens with a face, a name and a line', s.on && s.face && s.name && s.line.length > 10 && (s.acts > 0 || k === 'clinic'), s.name + ': ' + s.line.slice(0, 40));
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
  await p.evaluate(() => { BohemiaSettlement.state.stash.length = 0; });
  await tapB('smith'); await p.waitForTimeout(250);
  const shelfN = await p.evaluate(() => document.querySelectorAll('#shelfgrid .slot.full').length);
  const bagSlots = await p.evaluate(() => document.querySelectorAll('#baggrid .slot').length);
  await p.screenshot({ path: SHOT.replace('_10_1', '_SMITH_10_5') });
  const first = await p.evaluate(() => BohemiaSettlement.state.stock.smith[0]);
  ok('a shop is two grids: their shelf of icons, and your bag of 36 slots under it', shelfN >= 5 && bagSlots === 36, shelfN + ' on the shelf, ' + bagSlots + ' bag slots');
  ok('  the shelf is weapons in our names', /pistol|pipe|sledge|rifle|machete|axe|spear|cleaver|chain|hook|bow|bottles|shotgun/.test(first.name), first.name + ' (was ' + first.was + ')');
  await p.click('#shelfgrid .slot.full'); await p.waitForTimeout(250);
  const said = await p.evaluate(() => document.querySelector('#sbody .say p').textContent + ' | ' + (document.querySelector('#sbody .slots') || {}).textContent);
  ok('  the keeper says the price and the card shows the numbers', said.indexOf(String(first.price)) >= 0 && /dmg/.test(said), said.slice(0, 90));
  const m0 = await bat();
  await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(250);
  const m1 = await bat(), inBag = await p.evaluate(() => document.querySelectorAll('#baggrid .slot.full').length);
  ok('  buying takes exactly the price and the item lands in your bag', m0 - m1 === first.price && inBag === 1, m0 + ' -> ' + m1 + ', bag ' + inBag);
  await tapB('armourer'); await p.waitForTimeout(250);
  const armShelf = await p.evaluate(() => BohemiaSettlement.state.stock.armourer.map(i => i.name).join(', '));
  ok('the armourer sells armour and shields', /vest|jacket|carrier|riot|hood|hat|helm|door|shield/.test(armShelf), armShelf.slice(0, 80));
  await p.click('#shelfgrid .slot.full'); await p.waitForTimeout(200);
  await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(250);
  const bag2 = await p.evaluate(() => BohemiaSettlement.state.stash.map(i => i.kind).join(','));
  ok('  armour lands in the same bag', /weapon/.test(bag2) && /(body|head|shield)/.test(bag2), bag2);
  const s0 = await bat();
  await p.click('#baggrid .slot.full'); await p.waitForTimeout(200);
  await p.click('#sbody .act'); await p.waitForTimeout(250);
  const s1 = await bat(), bag3 = await p.evaluate(() => BohemiaSettlement.state.stash.length);
  ok('  selling takes it out of the bag and pays the Battle Brothers cut, a seventh (TUNING)', s1 - s0 === Math.max(1, Math.floor(first.price / 7)) && bag3 === 1, s0 + ' -> ' + s1 + ', bag ' + bag3);
  const posted = await p.evaluate(() => { const b = (window.__settleLog || []).filter(m => m.act === 'bag').pop(); return b ? b.bag.length + '/' + b.slots : 'none'; });
  ok('  the game is told what is in the bag on every change', posted === '1/36', posted);
  await p.evaluate(() => BohemiaPurse.debit(BohemiaSettlement.state.purse, 'electricity', BohemiaPurse.balance(BohemiaSettlement.state.purse, 'electricity') - 3, 'gate', null, 0));
  /* the board reads as work: every contract shows its skulls and its pay */
  await tapB('board'); await p.waitForTimeout(250);
  const skulls = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sbody .act em')).map(e => e.textContent));
  ok('the board is where work is: each job shows its skulls and its pay', skulls.length > 0 && skulls.every(t => /\u2620/.test(t) && /batt/.test(t)), skulls.join(' / '));

  /* A PLACE HAS TRAITS (rule 71): the same town rolled two ways looks different, prices differently,
     and the keeper says why first */
  const roll = async ids => {
    await p.evaluate(ids => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ids }), ids);
    await p.waitForFunction(() => (BohemiaSettlement.state.stock.smith || []).length > 0, null, { timeout: 30000 });
    await p.waitForTimeout(500);
    const px = await p.evaluate(() => { const c = document.getElementById('cv'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 400) h = (h * 31 + d[i] + d[i + 1] * 3 + d[i + 2] * 7) >>> 0; return h; });
    const st = await p.evaluate(() => { const s = BohemiaSettlement.state.stock; return { n: s.smith.length, items: s.smith.map(i => [i.id, i.price]), ids: BohemiaSettlement.traitsNow().join() }; });
    return { px, st };
  };
  const plain = await roll([]), raided = await roll(['raided']);
  await p.screenshot({ path: SHOT.replace('_10_1', '_RAIDED_10_5') });
  await tapB('smith'); await p.waitForTimeout(250);
  const raidLine = await p.evaluate(() => document.querySelector('#sbody .say p').textContent);
  await tapB('hall'); await p.waitForTimeout(250);
  const raidHall = await p.evaluate(() => document.querySelector('#sbody .say p').textContent + '|' + document.querySelectorAll('#sbody .act').length);
  await p.click('#close'); await p.waitForTimeout(300);
  const market = await roll(['market_day']);
  await p.screenshot({ path: SHOT.replace('_10_1', '_MARKET_DAY_10_5') });
  ok('a trait changes the picture (the same town, raided and on market day, draws differently)', plain.px !== raided.px && raided.px !== market.px && plain.px !== market.px);
  /* the same rows on each shelf, priced three ways */
  const priceOf = (st, id) => (st.items.find(x => x[0] === id) || [0, null])[1];
  const common = raided.st.items.map(x => x[0]).filter(id => priceOf(plain.st, id) != null && priceOf(market.st, id) != null);
  const dearer = common.every(id => priceOf(raided.st, id) >= priceOf(plain.st, id)) && common.some(id => priceOf(raided.st, id) > priceOf(plain.st, id));
  const cheaper = common.every(id => priceOf(market.st, id) <= priceOf(plain.st, id)) && common.some(id => priceOf(market.st, id) < priceOf(plain.st, id));
  ok('  and the shelves: raided is dearer and thinner, market day cheaper and fuller', common.length > 0 && dearer && cheaper && raided.st.n < plain.st.n && market.st.n > plain.st.n,
     common.length + ' same rows; ' + common.slice(0, 2).map(id => id + ' ' + priceOf(plain.st, id) + '/' + priceOf(raided.st, id) + '/' + priceOf(market.st, id)).join(', ') + '; counts ' + plain.st.n + '/' + raided.st.n + '/' + market.st.n);
  ok('  and the keeper says it first, out of a mouth', /burned|crew came/i.test(raidLine), raidLine.slice(0, 60));
  ok('  and who stands at the posts: nobody signs on in a raided town', /nobody/i.test(raidHall) && /\|0$/.test(raidHall), raidHall.slice(0, 60));
  await p.evaluate(() => BohemiaSettlement.open({ traits: [] }));
  await p.waitForTimeout(400);

  /* THE BAR (Battle Brothers' tavern): a round priced by the company's size, morale and the town's
     opinion up, one rumour from the keeper's mouth that can mark the map, four rounds a night */
  await p.evaluate(() => { BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], crewSize: 5 });
    BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 40, 'gate', null, 0); });
  await p.waitForTimeout(400);
  const rumours = [], br0 = await bat();
  for (let i = 0; i < 5; i++) {
    await tapB('bar'); await p.waitForTimeout(220);
    const btn = await p.$('#sbody .act:not([disabled])'); if (!btn) break;
    await btn.click(); await p.waitForTimeout(220);
    rumours.push(await p.evaluate(() => document.querySelector('#sbody .say p').textContent));
    if (i === 0) await p.screenshot({ path: SHOT.replace('_10_1', '_BAR_10_9') });
  }
  const br1 = await bat(), rounds = await p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'round').slice(-4));
  const marks = await p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'rumour').map(m => m.mark));
  ok('the bar: a round costs a battery a head and you can buy four a night', rumours.length === 4 && br0 - br1 === 20, rumours.length + ' rounds, ' + (br0 - br1) + ' batteries for 5 men');
  ok('  each lifts morale a step and the town likes you a tenth more', rounds.length === 4 && rounds.every(r => r.morale === 1 && r.relation === 0.1));
  ok('  and the keeper tells a different rumour each round, some marked on your map', new Set(rumours).size === 4 && rumours.every(t => t.length > 30), marks.join(', ') || 'no marks');
  await p.evaluate(() => BohemiaSettlement.open({ traits: [] }));
  await p.waitForTimeout(300);

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
  await p.click('#sbody .act:has-text("Take the")'); await p.waitForTimeout(200);
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
    const want = (t === 'camp' ? 'hall,board,stall,bar,arms,barber,clinic,lot' : 'hall,board,stall,bar,smith,armourer,barber,clinic,lot') + ',build';   /* + BUILD, LIFE+CITY 10/9 */
    ok('a ' + t + ' is its own picture, with Battle Brothers\' shops for its size (camp one stall, town and fortress a smith and an armourer)', o === want, o);
    if (t === 'camp') {
      await p.waitForFunction(() => (BohemiaSettlement.state.stock.arms || []).length > 0, null, { timeout: 30000 });
      await p.evaluate(() => BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 300, 'gate', null, 0));
      const c0 = await p.evaluate(() => BohemiaSettlement.state.stash.length);
      await tapB('arms'); await p.waitForTimeout(250);
      await p.click('#shelfgrid .slot.full'); await p.waitForTimeout(200);
      await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(250);
      const c1 = await p.evaluate(() => BohemiaSettlement.state.stash.length);
      ok('  the camp\'s guns-and-plate stall sells into the same bag', c1 === c0 + 1, c0 + ' -> ' + c1);
      await p.click('#close'); await p.waitForTimeout(300);
    }
  }
  /* THE CLINIC (Battle Brothers' temple, injuries.json): every hurt man with his days left; treatment
     halves the days at 20 crowns x days x (1 + 0.2 a level past one), ten crowns a battery; a medic a day more */
  await tapB('clinic'); await p.waitForTimeout(200);
  const noHurt = await p.evaluate(() => document.querySelectorAll('#sbody .act').length === 0);
  await p.evaluate(() => { BohemiaSettlement.open({ traits: [], wounded: [{ name: 'ROSA', days: 30, level: 3 }, { name: 'OSO', days: 4, level: 1 }], hired: {} });
    BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 200, 'gate', null, 0); });
  await p.waitForTimeout(300);
  await tapB('clinic'); await p.waitForTimeout(250);
  const rows = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sbody .slots')).map(e => e.textContent));
  await p.screenshot({ path: SHOT.replace('_10_1', '_CLINIC_10_9') });
  const cb = await bat(); await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(200);
  const ca = await bat(), rosa = await p.evaluate(() => BohemiaSettlement.state.wounded[0].days);
  ok('the clinic: nobody hurt, nothing to buy; hurt men each shown with the injury and the days left', noHurt && rows.length === 2 && /ROSA: .+30 days left/.test(rows[0]), rows.join(' / ').slice(0, 90));
  ok('  treating halves the days at the wiki\'s temple price (20 x 30 days x 1.4 at level 3 = 84)', cb - ca === 84 && rosa === 15, (cb - ca) + ' batteries, ROSA 30 -> ' + rosa);
  await p.evaluate(() => BohemiaSettlement.open({ wounded: [{ name: 'GRIZ', days: 10, level: 1 }], hired: { medic: true } }));
  await p.waitForTimeout(200);
  await tapB('clinic'); await p.waitForTimeout(200); await p.click('#sbody .act:not([disabled])'); await p.waitForTimeout(200);
  const griz = await p.evaluate(() => BohemiaSettlement.state.wounded[0].days);
  ok('  and a hired medic takes a day more', griz === 4, 'GRIZ 10 -> ' + griz);
  await p.click('#close'); await p.waitForTimeout(300);

  /* THE NIGHT VARIANT QUIETER (row [the settlement's sounds], 10/9): the clinic's
     door is the only building sound wired live so far; by day it posts no multiplier
     at all (byte-identical to every round before this), by night it posts the same
     -6 dB ratio his sixth votes already approved for the valley's ambience (AMB_TRIM,
     SOUNDS E5), scoped to the call rather than the event so the same door walking into
     any other building in daylight is untouched. */
  await p.evaluate(() => { window.__settleLog = []; });
  await tapB('clinic'); await p.waitForTimeout(150); await p.click('#close'); await p.waitForTimeout(150);
  const dayDoorSfx = await p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'sfx'));
  await p.evaluate(() => { window.__settleLog = []; BohemiaSettlement.open({ night: true }); });
  await p.waitForTimeout(150);
  await tapB('clinic'); await p.waitForTimeout(150); await p.click('#close'); await p.waitForTimeout(150);
  const nightDoorSfx = await p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'sfx'));
  await p.evaluate(() => { BohemiaSettlement.open({ night: false }); });
  console.log('  door sfx by day: ' + JSON.stringify(dayDoorSfx) + '  by night: ' + JSON.stringify(nightDoorSfx));
  ok('the clinic\'s door is quieter at night, and untouched by day', dayDoorSfx.length === 2 && dayDoorSfx.every(m => !m.mul)
    && nightDoorSfx.length === 2 && nightDoorSfx.every(m => m.mul === 0.5),
    JSON.stringify({ day: dayDoorSfx, night: nightDoorSfx }));

  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' } }));
  await p.waitForTimeout(800);
  await p.screenshot({ path: SHOT });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' }, night: true }));
  await p.waitForTimeout(800);
  await p.screenshot({ path: SHOT.replace('_10_1', '_FORTRESS_10_1') });
  /* THE POSTS (Battle Brothers' recruits, PEOPLE's roll): a camp two, a town four, a fortress six,
     two more on market day; every card shows the man before you pay; hiring puts him on the roster */
  await p.evaluate(() => { try { localStorage.removeItem('bohemia.hired.v1'); localStorage.removeItem('bohemia.bag.v1'); } catch (e) {} BohemiaSettlement.state.stash.length = 0; });
  const posts = {};
  for (const [t, extra] of [['camp', []], ['town', []], ['fortress', []], ['town', ['market_day']]]) {
    await p.evaluate(({ t, extra }) => BohemiaSettlement.open({ place: { tier: t, name: 'POSTS ' + t.toUpperCase() }, traits: extra, hired: {} }), { t, extra });
    await p.waitForTimeout(300);
    await tapB('hall'); await p.waitForTimeout(250);
    posts[t + (extra.length ? '+market' : '')] = await p.evaluate(() => document.querySelectorAll('#sbody .hire').length);
  }
  ok('the posts: a camp two, a town four, a fortress six, two more on market day', posts.camp === 2 && posts.town === 4 && posts.fortress === 6 && posts['town+market'] === 6, JSON.stringify(posts));
  const card = await p.evaluate(() => { const c = document.querySelector('#sbody .hire'); return { stats: c.querySelectorAll('.hstats span').length, star: c.querySelectorAll('.hstats .star').length, nm: c.querySelector('.nm').textContent, price: c.querySelector('.act em').textContent,
    face: (() => { const d = c.querySelector('canvas.face').getContext('2d').getImageData(0, 0, 64, 64).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; })() }; });
  ok('  every hire card shows his face, name, background, eight stats with his star, and the price before you pay', card.stats === 8 && card.star === 1 && card.face > 300 && /batt/.test(card.price), card.nm + ' | ' + card.price);
  await p.screenshot({ path: SHOT.replace('_10_1', '_POSTS_10_10') });
  await p.evaluate(() => BohemiaPurse.credit(BohemiaSettlement.state.purse, 'electricity', 500, 'gate', null, 0));
  const h0 = await bat(), price = await p.evaluate(() => parseInt(document.querySelector('#sbody .hire .act em').textContent, 10));
  await p.click('#sbody .hire .act'); await p.waitForTimeout(250);
  const h1 = await bat(), hiredN = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length), cardsLeft = await p.evaluate(() => document.querySelectorAll('#sbody .hire').length);
  ok('  hiring takes his price and he leaves the posts for your company', h0 - h1 === price && hiredN === 1 && cardsLeft === 5, (h0 - h1) + ' batteries, ' + cardsLeft + ' left at the posts');
  const rp = await ctx.newPage(); await rp.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await rp.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  const roster = await rp.evaluate(() => { const s = BohemiaRosterScreen.state, m = s.crew[s.crew.length - 1]; return { n: s.crew.length, last: m.name, hired: !!m.hired, onLine: s.front.concat(s.back).indexOf(s.crew.length - 1) >= 0 }; });
  ok('  and he stands on the roster screen, on the line', roster.hired && roster.onLine, roster.n + ' men, the last ' + roster.last);
  await rp.close();
  await p.click('#close'); await p.waitForTimeout(300);
  await p.click('#leave');
  const left = await p.evaluate(() => (window.__settleLog || []).some(m => m.act === 'leave'));
  ok('LEAVE tells the game you left', left);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));

  await b.close(); srv.close();
  console.log('\nTHE SETTLEMENT SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
