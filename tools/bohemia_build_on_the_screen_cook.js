/* BOHEMIA — BUILD ON THE SCREEN, THE VOTE PICTURE (10/9/26, LIFE + CITY, [build on the screen]).
 * Three shots of RUN TWO's real settlement page on a phone, driven by touch, nothing drawn by this tool:
 *   1  the Mob's place: BUILD, and YOU say it is not your ground (rule 43)
 *   2  your place: the list, wall and tank first, one battery each; the wall and the tank go up
 *   3  the next day (the map's day): both standing on their lot, on the picture
 * tools/bohemia_build_on_the_screen_cook.py stitches them with one caption line each.
 * REFERENCE CHECK:
 *   AH-01    the ordinary frame with ONE wrong thing: the page's own frames, nothing composed here.
 *   BLDG-03  one light direction: the built things carry the street's north light, like the town's roofs.
 *   BLDG-05  structural sanity: the wall and the tank stand on open ground with their own shadows.
 * REUSE CHECK: every pixel is RUN TWO's page as the phone shows it.
 * Run:  node tools/bohemia_build_on_the_screen_cook.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'build_on_the_screen');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  try {
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html'); await p.waitForTimeout(2500);
    await p.evaluate(() => localStorage.clear());
    const openAt = o => p.evaluate(o => BohemiaSettlement.open(o), o).then(() => p.waitForTimeout(1500));
    const tap = async k => { await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(400);
      const w = await p.evaluate(k => BohemiaSettlement.where(k), k); await p.touchscreen.tap(w.x, w.y); await p.waitForTimeout(700); };
    const press = async t => { for (const e of await p.$$('#sbody .act')) if ((await e.$eval('span', s => s.textContent)) === t) {
      const bb = await e.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(600); return; } throw new Error('no ' + t); };
    await openAt({ place: { name: 'MOB', tier: 'town' }, held: false, day: 5, batteries: 3, traits: [] });
    await tap('build'); await p.screenshot({ path: path.join(OUT, '1.png') });
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 5, batteries: 3, traits: [] });
    await tap('build'); await press('WALL'); await press('WATER TANK'); await p.screenshot({ path: path.join(OUT, '2.png') });
    await openAt({ place: { name: 'CUSTOM', tier: 'town' }, held: true, day: 6, traits: [] });
    await p.evaluate(() => BohemiaSettlement.where('build')); await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(OUT, '3.png') });
    console.log('three shots in', OUT);
  } finally { await b.close(); srv.close(); }
})().catch(e => { console.error(e); process.exit(1); });
