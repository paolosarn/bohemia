/* BUILD ON THE SCREEN — the gate for [build on the screen] (10/9/26, LIFE + CITY)
 *
 * Rule 40b (building is a thing you do in the settlement screen of a place you hold) and rule 43 (you
 * build where you hold). Drives RUN TWO's real settlement page on a phone with real touches:
 *   A  ON SOMEBODY ELSE'S GROUND: BUILD opens with YOUR mouth, says it is not your ground, offers nothing,
 *      and no battery moves.
 *   B  ON YOURS: the list is the build module's own, in its order (the wall and the tank first), each
 *      with its cost and what it does; a tap spends exactly one battery, the map hears 'build' with the
 *      lot and the day, and the thing is GOING UP, not standing.
 *   C  THE NEXT DAY (the map's day): it stands; it is drawn on its lot (every sprite exists and loads);
 *      and it survives the page reopening (the place keeps its lots).
 *   D  FOUR LOTS: the fifth thing is refused in words and costs nothing.
 *   E  THE MAP SAYS WHO HOLDS IT: the city page hands `held` (its own outfit's base) and `day` on open.
 *   F  MUTATION: a page told the place is NOT held, with lots already standing, still refuses a new one.
 *
 * Run:  NODE_PATH=/opt/node22/lib/node_modules node gates/build_on_the_screen_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' };
(async () => {
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html'); await p.waitForTimeout(2500);
    const openAt = o => p.evaluate(o => { BohemiaSettlement.open(o); }, o).then(() => p.waitForTimeout(1200));
    const tap = async k => { await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(300);
      const w = await p.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return false; await p.touchscreen.tap(w.x, w.y); await p.waitForTimeout(500); return true; };
    const sheet = () => p.evaluate(() => ({ name: (document.querySelector('#sbody .nm') || {}).textContent,
      say: (document.querySelector('#sbody .say p') || {}).textContent || '',
      acts: [...document.querySelectorAll('#sbody .act')].map(a => ({ t: a.querySelector('span').textContent, off: a.disabled })),
      slots: (document.querySelector('#sbody .slots') || {}).textContent || '' }));
    const press = async t => { for (const e of await p.$$('#sbody .act')) { if ((await e.$eval('span', s => s.textContent)) === t) {
      const bb = await e.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(500); return true; } } return false; };
    const bats = () => p.evaluate(() => { const t = document.getElementById('bat').textContent; return parseInt(t, 10); });
    const builds = () => p.evaluate(() => (window.__settleLog || []).filter(m => m.act === 'build'));

    await p.evaluate(() => localStorage.clear());
    /* ---- A ---- */
    await openAt({ place: { name: 'MOB', tier: 'town' }, held: false, day: 5, batteries: 3 });
    ok('A BUILD is a place on the picture you can tap', await tap('build'));
    let s = await sheet();
    ok('A on somebody else\'s ground YOUR mouth says so, and offers nothing', s.name === 'YOU' && /not our ground/i.test(s.say) && s.acts.length === 0, s.name + ': ' + s.say);
    ok('A and no battery moves', await bats() === 3);
    /* ---- B ---- */
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 5, batteries: 3 });
    await tap('build'); s = await sheet();
    const want = await p.evaluate(() => BohemiaLotBuild.CATALOG.map(e => e.name));
    ok('B on your ground the list is the build module\'s own, wall and tank first', s.acts.map(a => a.t).join() === want.join() && want[0] === 'WALL' && want[1] === 'WATER TANK', s.acts.map(a => a.t).join(', '));
    await press('WALL');
    ok('B a tap spends exactly one battery', await bats() === 2);
    const bl = await builds();
    ok('B the map hears it: build, the wall, its lot and the day', bl.length === 1 && bl[0].id === 'wall' && bl[0].lot && bl[0].day === 5, JSON.stringify(bl[0] || {}));
    s = await sheet();
    ok('B it is GOING UP, not standing', /Going up: WALL/.test(s.slots) && /Standing: nothing yet/.test(s.slots), s.slots);
    await press('WATER TANK');
    /* ---- C ---- */
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 6 });
    await tap('build'); s = await sheet();
    ok('C the next day both stand', /Standing: WALL, WATER TANK/.test(s.slots), s.slots);
    const spr = await p.evaluate(() => Promise.all(BohemiaLotBuild.CATALOG.map(e => new Promise(r => { const im = new Image();
      im.onload = () => r(im.naturalWidth > 0); im.onerror = () => r(false); im.src = 'settlement/lot/' + e.id + '.png'; }))));
    ok('C every thing on the list has its picture to stand on its lot', spr.every(Boolean), spr.filter(Boolean).length + ' of ' + spr.length);
    await p.reload(); await p.waitForTimeout(2500);
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 6, batteries: 1 });
    await tap('build'); s = await sheet();
    ok('C the place keeps its lots when the page opens again', /Standing: WALL, WATER TANK/.test(s.slots), s.slots);
    /* ---- D ---- */
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 6, batteries: 5 });
    await tap('build'); await press('SHED'); await press('PUMP HOUSE');
    s = await sheet(); const before = await bats();
    ok('D four lots: with every lot taken the list is offered and none can be pressed', s.acts.length > 0 && s.acts.every(a => a.off) && /Lots: 4 of 4/.test(s.slots), s.slots);
    ok('D and nothing is spent', await bats() === before);
    /* ---- F ---- */
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: false, day: 7, batteries: 5 });
    await tap('build'); s = await sheet();
    ok('F MUTATION: the same place told it is NOT held refuses, whatever stands on it', s.acts.length === 0 && /not our ground/i.test(s.say));
    ok('nothing threw', errs.length === 0, errs.join(' | ').slice(0, 200));
  } finally { await b.close(); srv.close(); }
  /* ---- E ---- */
  const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('E the map hands the screen whether the place is yours (FACTIONS\' ledger on the map, your outfit\'s base from day one) and its day',
     /held: \(function\(\)\{ try\{ if\(typeof lotIsMine === 'function'\) return lotIsMine\(t\.name\)/.test(city) && /day: loopDay\(\) \}, '\*'\)/.test(city));
  console.log('\nBUILD ON THE SCREEN GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
