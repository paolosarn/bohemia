/* BOHEMIA — BUILT ON THE BOARD, THE VOTE PICTURE (10/9/26, LIFE + CITY, [built on the board]).
 * COMBAT's real fight on a phone, the same seed and the same place twice: once as dealt, once with what you
 * built handed in (a wall, a water tank, a roof), the camera pulled to the fight's own far stop (the whole
 * board, what a pinch shows). Nothing is drawn by this tool; the .py sets the two shots side by side.
 * REFERENCE CHECK:
 *   AH-01    the game's own frames, nothing composed.
 *   BLDG-03  one light direction: the board's own; the tank keeps the street's north light.
 *   BLDG-05  structural sanity: each thing stands on one open tile of your side of the board.
 * REUSE CHECK: every pixel is COMBAT's fight as the phone shows it.
 * Run:  node tools/bohemia_built_on_the_board_cook.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'built_on_the_board');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch();
  try {
    for (const k of ['without', 'with']) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
      const o = { kind: 'suburb', seed: 11, deploy: false };
      if (k === 'with') o.built = [{ id: 'wall', fight: 'wall' }, { id: 'tank', fight: 'building' }, { id: 'roof', fight: 'high' }];
      await ctx.addInitScript({ content: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
      const p = await ctx.newPage();
      await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html');
      await p.waitForFunction(() => document.getElementById('load') && document.getElementById('load').style.display === 'none', { timeout: 60000 });
      await p.waitForTimeout(3000);
      await p.evaluate(() => { const U = FIGHT_UI, S = FIGHT.S; U.zoom = U.far; U.cx = S.w * U.tw / 2; U.cy = S.h * U.th / 2; try { eval('clampCam')(); } catch (e) {} U.openUntil = 0; });
      await p.waitForTimeout(1500);
      await p.screenshot({ path: path.join(OUT, k + '.png') });
      await ctx.close();
    }
    console.log('two shots in', OUT);
  } finally { await b.close(); srv.close(); }
})().catch(e => { console.error(e); process.exit(1); });
