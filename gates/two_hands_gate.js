/* TWO HANDS GATE (RUN TWO [two hands], rule 149, 10/24/26).
   PAOLO 10/24: 'if I have a rifle in my hand it should take up both the main hand and the off hand slot; if I have a pistol
   in one hand and a car door as a shield in the other, I should see that in the combat.'
   On his phone's profile with real taps on the one crew screen:
     T1 every weapon knows its hands (the wiki's column; a bow, a crossbow, a firearm carry none and take two): the rifle,
        the shotgun and the sledge take two, the pistol, the pipe and the bottles one
     T2 YOU hold a pistol and a car door; tap MAIN, take the rifle: it is in both hands, the car door is in the bag, the off
        hand reads BOTH HANDS greyed
     T3 tap OFF, take the car door: the rifle goes to the bag, the door is in his off hand
     T4 tap MAIN, take the pistol: a pistol in one hand and the door in the other
     T5 the hand-over the fight reads never has a long gun and a shield on one man
     T6 the fight: a man with a long gun fights with no shield, YOU with the pistol and the car door fights with both
     T7 a man kept from before the rule with a long gun and a shield: the shield goes to the bag when the screen opens
     T8 the shop says a long gun takes two hands
   Run: node gates/two_hands_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8895;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const RIFLE = { id: 'light_crossbow', kind: 'weapon', cls: 'crossbow', name: 'solid rifle', was: 'Light Crossbow', price: 30, nums: 'dmg 30-50' };
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(r => { try { if (sessionStorage.getItem('__w')) return; sessionStorage.setItem('__w', 1); localStorage.clear(); localStorage.setItem('bohemia.bag.v1', JSON.stringify([r])); } catch (e) {} }, RIFLE);
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('crew: ' + e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 }); await p.waitForTimeout(600);
  /* T1 */
  const hands = await p.evaluate(() => { const C = BohemiaRoster, rows = C.data.ours.weapon_rows.value, o = {}; Object.keys(rows).forEach(j => { if (j !== 'car_door') o[j] = C.handsOf(C.itemOf('weapon', rows[j])); }); return o; });
  ok('T1 every weapon knows its hands: the rifle, the shotgun and the sledge two; the pistol, the pipe and the bottles one',
     hands.rifle === 2 && hands.shotgun === 2 && hands.sledge === 2 && hands.pistol === 1 && hands.pipe === 1 && hands.bottles === 1, JSON.stringify(hands));
  const pickIn = async (slot, id) => { await p.locator('#card .gslot[data-slot="' + slot + '"]').click(); await p.waitForTimeout(250);
    const i = await p.evaluate(id => BohemiaRosterScreen.state.bag.findIndex(x => x.id === id), id);
    /* RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple]): the tapped slot cuts the stash beside him; one tap on the
       piece compares, the second puts it on */
    const t = p.locator('#bag .slot[data-bag="' + i + '"]'); await t.click(); await p.waitForTimeout(200); await t.click(); await p.waitForTimeout(350); };
  const you = () => p.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.main); const off = document.querySelector('#card .gslot[data-slot="off"]');
    return { main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id, bag: S.bag.map(x => x.id), offText: off ? off.innerText.replace(/\s+/g, ' ') : '', grey: !!(off && off.classList.contains('both') && parseFloat(getComputedStyle(off).opacity) < 1),
      said: document.getElementById('said').textContent }; });
  const youI = await p.evaluate(() => BohemiaRosterScreen.state.crew.findIndex(m => m.main));
  await p.locator('#lines .cell[data-man="' + youI + '"]').first().click(); await p.waitForTimeout(300);
  const y0 = await you();
  /* T2 */
  await pickIn('main', RIFLE.id); const y1 = await you();
  ok('T2 YOU took the rifle: both hands on it, the car door in the bag, the off hand reads BOTH HANDS greyed',
     y0.off && y1.main === RIFLE.id && !y1.off && y1.bag.indexOf(y0.off) >= 0 && y1.bag.indexOf(y0.main) >= 0 && /BOTH HANDS/.test(y1.offText) && y1.grey, y0.main + '+' + y0.off + ' -> ' + y1.main + '+' + y1.off + '; ' + y1.said);
  /* T3 */
  await pickIn('off', y0.off); const y2 = await you();
  ok('T3 the car door into his off hand: the rifle goes to the bag', y2.off === y0.off && !y2.main && y2.bag.indexOf(RIFLE.id) >= 0, y2.said);
  /* T4 */
  await pickIn('main', y0.main); const y3 = await you();
  ok('T4 the pistol into his main hand: a pistol in one hand and the door in the other', y3.main === y0.main && y3.off === y0.off, y3.main + '+' + y3.off);
  /* give the rifle to the first man who carries a pistol and nothing in his off hand... the second test of the long gun: DESI keeps hers */
  /* T5 */
  const co = await p.evaluate(() => { const C = BohemiaRoster, h = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]');
    return h.map(m => ({ name: m.name, main: m.gear && m.gear.main, off: m.gear && m.gear.off, two: m.gear && m.gear.main ? C.handsOf({ kind: 'weapon', id: m.gear.main }) === 2 : false })); });
  ok('T5 the hand-over the fight reads: no man has a long gun and a shield', co.length >= 3 && co.every(m => !(m.two && m.off)) && co.some(m => m.two), co.filter(m => m.two).map(m => m.name + ' ' + m.main).join(', '));
  /* T6 the fight reads it */
  const f = await ctx.newPage(); f.on('pageerror', e => errs.push('fight: ' + e.message));
  const line = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.company.line.v1') || 'null'));
  const company = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]'));
  await f.addInitScript(o => { window.FIGHT_OPTS = { seed: 4, speed: 1, company: o.company, formation: { front: o.line.front, back: o.line.back } }; }, { company, line });
  await f.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  const us = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, main: u.main, w: u.weapon && u.weapon.id, sh: u.shield ? (u.shield.id || u.shield.name || 'shield') : null })));
  const longs = us.filter(u => co.some(m => m.two && (m.name === u.name || (u.main && co[0].name === m.name))));
  const me = us.find(u => u.main);
  ok('T6 THE FIGHT: every man with a long gun fights with no shield; YOU fight with the pistol and the car door',
     longs.length > 0 && longs.every(u => !u.sh) && me && me.w === y0.main && !!me.sh, 'long: ' + longs.map(u => u.name + ' ' + u.w + (u.sh ? '+' + u.sh : '')).join(', ') + '; YOU ' + (me && me.w + '+' + me.sh));
  await f.close();
  /* T7 a man kept from before the rule */
  const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push('crew2: ' + e.message));
  await p2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p2.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p2.evaluate(r => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.main), c = JSON.parse(localStorage.getItem('bohemia.climb.v1') || '{}');
    c[m.name] = Object.assign({}, c[m.name] || {}, { xp: 0, level: 1, points: 0, perks: [], gear: { main: r, off: { id: 'wooden_shield', kind: 'shield', name: 'a car door', was: 'Wooden Shield', price: 5, nums: 'holds 32' }, body: null, head: null } });
    localStorage.setItem('bohemia.climb.v1', JSON.stringify(c)); localStorage.setItem('bohemia.bag.v1', '[]'); }, RIFLE);
  await p2.reload({ waitUntil: 'load' }); await p2.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 }); await p2.waitForTimeout(400);
  const k = await p2.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.main); return { main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id, bag: S.bag.map(x => x.id) }; });
  ok('T7 a man kept from before with a rifle and a car door: the door goes to the bag when the screen opens', k.main === RIFLE.id && !k.off && k.bag.indexOf('wooden_shield') >= 0, JSON.stringify(k));
  /* T8 the shop */
  const s = await ctx.newPage(); s.on('pageerror', e => errs.push('settlement: ' + e.message));
  await s.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await s.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await s.evaluate(() => BohemiaSettlement.open({ place: { tier: 'fortress', name: 'HENDERSON' }, traits: [], night: false, batteries: 999 })); await s.waitForTimeout(1500);
  const shop = await s.evaluate(() => { const st = BohemiaSettlement.state.stock || {}, all = [].concat(...Object.keys(st).map(k => st[k] || [])).filter(i => i && i.kind === 'weapon');
    return all.length ? all.map(i => ({ cls: i.cls, two: /2 hands/.test(i.nums), hands: i.hands, name: i.name })) : null; });
  ok('T8 the shop says a long gun takes two hands (every bow, rifle and shotgun on the shelves), never a pistol', shop && shop.some(i => /^(bow|crossbow|firearm)$/.test(i.cls)) && shop.filter(i => /^(bow|crossbow|firearm)$/.test(i.cls)).every(i => i.two && i.hands === 2) && shop.filter(i => i.cls === 'dagger' && i.hands === 1).every(i => !i.two),
     shop ? shop.filter(i => i.two).length + ' of ' + shop.length + ' weapons say 2 hands' : 'no shop rows');
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close(); srv.close();
  console.log('\nTWO HANDS GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
