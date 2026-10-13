/* EQUIP FROM THE STASH GATE (RUN TWO, row [equip from the stash], 10/13/26).
   His twelfth vote: 'still not a button for me to view my crew and equip them with items from my storage.' Played with
   real taps and drags on his phone's profile: buy a weapon at the smith, it lands in the stash; tap CREW in the bar and
   the company screen opens over the place (engine/bohemia_crew_door.js, the one door every screen calls); the stash is
   its bag; drag the weapon onto a man's main hand; DONE closes it, the stash lost the weapon, and the company the fight
   reads carries its id; then boot the fight with that company and the man fights with it. Shot in slices/vote/.
   Run: node gates/equip_from_the_stash_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8870;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('__w')) { sessionStorage.setItem('__w', 1); ['bohemia.bag.v1', 'bohemia.climb.v1', 'bohemia.company.v1', 'bohemia.hired.v1'].forEach(k => localStorage.removeItem(k)); localStorage.setItem('bohemia.formation.v1', 'null'); } } catch (e) {} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], batteries: 300 })); await p.waitForTimeout(900);
  /* 1. buy a weapon at the smith */
  await p.evaluate(() => BohemiaSettlement.where('smith')); await p.waitForTimeout(200);
  const ps = await p.evaluate(() => BohemiaSettlement.where('smith')); await p.mouse.click(ps.x, ps.y + 30); await p.waitForTimeout(700);
  await p.click('#shelfgrid .slot.full'); await p.waitForTimeout(400);
  await p.click('#sbody .act:has-text("Buy it")'); await p.waitForTimeout(400);
  const bought = await p.evaluate(() => { const b = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'); return b.filter(i => i.kind === 'weapon').map(i => ({ id: i.id, name: i.name })); });
  ok('a weapon bought at the smith lands in the stash', bought.length === 1, bought.map(i => i.name).join());
  /* 2. CREW in the bar opens the company screen over the place */
  const cb = await p.locator('#crew').boundingBox();
  ok('a CREW button in the bar, thumb-sized', cb && cb.width >= 44 && cb.height >= 44, cb && Math.round(cb.width) + 'x' + Math.round(cb.height));
  await p.click('#crew'); await p.waitForTimeout(400);
  const fr = p.frameLocator('#crewdoor iframe'); const F = () => p.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
  await p.waitForFunction(() => document.getElementById('crewdoor'), null, { timeout: 5000 });
  for (let i = 0; i < 60 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
  const R = F(); await p.waitForTimeout(600);
  const inBag = await R.evaluate(id => BohemiaRosterScreen.state.bag.some(i => i.id === id), bought[0].id);
  ok('the company screen opens over the place, and its bag is the stash', !!R && inBag);
  /* 3. drag it onto the selected man's main hand */
  const who = await R.evaluate(() => { const s = BohemiaRosterScreen.state; return s.crew[s.sel].name; });
  const box = async sel => { const q = await fr.locator(sel).first().boundingBox(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; };
  const a = await box('#bag .slot.full'), z = await box('#card .gslot[data-slot="main"]');
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 10, a.y - 10, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(400);
  const worn = await R.evaluate(() => { const s = BohemiaRosterScreen.state; return s.crew[s.sel].gear.main && s.crew[s.sel].gear.main.id; });
  ok('drag it from the stash onto a man\'s main hand and he wears it', worn === bought[0].id, who + ' wears ' + worn);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_EQUIP_FROM_THE_STASH_10_13.png') });
  /* 4. DONE closes it and hands the company back */
  await fr.locator('#done').click(); await p.waitForTimeout(500);
  const after = await p.evaluate(id => ({ open: !!document.getElementById('crewdoor'), co: JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]'),
    stash: (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]')).some(i => i.id === id), posted: (window.__settleLog || []).filter(x => x.act === 'crew').length }), bought[0].id);
  const man = after.co.find(m => m.name === who);
  ok('DONE closes it; the stash lost the weapon; the company carries his gear', !after.open && !after.stash && man && man.gear.main === bought[0].id, man && JSON.stringify(man.gear));
  /* 5. the fight reads it */
  const f2 = await ctx.newPage(); f2.on('pageerror', e => errs.push('fight: ' + e.message));
  await f2.addInitScript(c => { window.FIGHT_OPTS = { seed: 3, speed: 1, company: c }; }, after.co);
  await f2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await f2.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  const u = await f2.evaluate(n => { const v = FIGHT.S.units.find(x => x.side === 'you' && x.name === n); return v && v.weapon.id; }, who);
  ok('the next fight: he fights with the weapon from the stash', u === bought[0].id, who + ' -> ' + u);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nEQUIP FROM THE STASH GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
