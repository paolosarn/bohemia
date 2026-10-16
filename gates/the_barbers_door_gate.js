/* THE BARBER'S DOOR GATE (RUN TWO, row [the barber's door], 10/16/26).
   His third votes (37i) and his 9/27 note: 'you can only customize your face and portrait at the barber in the
   settlement menu.' On his phone's profile, in the REAL alpha: the settlement screen sits inside it (as the city does,
   a frame below the top); every tier's picture has the barber as a building; tap it, sit in the chair (one battery),
   tap 'Your face' and the alpha's face maker opens on its own tab with PORTRAIT's sliders (every dial a slider) and the
   haircut shelf; 'Your haircut' opens the same. Nothing else in the settlement opens it.
   Run: node gates/the_barbers_door_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8871;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.txt': 'text/plain' };
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
  const p = await ctx.newPage(); const errs = [];
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load' });
  await p.waitForFunction(() => document.getElementById('portraitCv') && typeof buildFaceEditor === 'function', null, { timeout: 120000 });
  await p.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await p.waitForTimeout(800);
  const before = await p.evaluate(() => document.getElementById('faceEd').classList.contains('on'));
  /* the settlement, a frame below the top, the way the city hosts it */
  await p.evaluate(() => { const f = document.createElement('iframe'); f.id = '__settle'; f.src = 'BOHEMIA_SETTLEMENT_SCREEN.html';
    f.style.cssText = 'position:fixed;inset:0;width:390px;height:844px;z-index:99999;border:0;background:#000'; document.body.appendChild(f); });
  let S = null;
  for (let i = 0; i < 120 && !S; i++) { await p.waitForTimeout(250); S = p.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url())); if (S && !(await S.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.ready()).catch(() => false))) S = null; }
  S.on && 0; p.on('pageerror', e => errs.push(e.message));
  for (const tier of ['camp', 'town', 'fortress']) {
    await S.evaluate(t => BohemiaSettlement.open({ place: { tier: t, name: 'X ' + t }, traits: [], batteries: 20 }), tier); await S.waitForTimeout(500);
    const has = await S.evaluate(() => BohemiaSettlement.order().indexOf('barber') >= 0);
    ok(tier + ': the barber is a building in the picture', has);
  }
  await S.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], batteries: 20 })); await S.waitForTimeout(700);
  ok('nothing in the settlement opened the face maker on its own', !before && !(await p.evaluate(() => document.getElementById('faceEd').classList.contains('on'))));
  const fb = await (await S.frameElement()).boundingBox();
  await S.evaluate(() => BohemiaSettlement.where('barber')); await S.waitForTimeout(200);
  const pt = await S.evaluate(() => BohemiaSettlement.where('barber'));
  await p.mouse.click(fb.x + pt.x, fb.y + pt.y + 20); await S.waitForTimeout(600);
  ok('tap the barber and his chair is offered', (await S.evaluate(() => BohemiaSettlement.state.open)) === 'barber');
  await S.click('#sbody .act:has-text("Sit in the chair")'); await S.waitForTimeout(400);
  await S.click('#sbody .act:has-text("Your face")'); await p.waitForTimeout(900);
  const fm = await p.evaluate(() => { const fe = document.getElementById('faceEd'); return { on: fe.classList.contains('on'), sliders: fe.querySelectorAll('input[type=range]').length,
    cuts: fe.querySelectorAll('button').length, tab: (document.querySelector('.tab.on') || {}).textContent || '', by: window.__faceMakerOpenedBy || '' }; });
  ok('sit, tap Your face: the alpha\'s face maker opens with PORTRAIT\'s sliders', fm.on && fm.sliders >= 10 && /settlement:faceEditor/.test(fm.by), fm.sliders + ' sliders, tab ' + fm.tab.trim());
  ok('  and the haircut shelf is inside it', fm.cuts >= 5, fm.cuts + ' buttons');
  await p.evaluate(() => { document.getElementById('portraitCv').dispatchEvent(new Event('click')); window.__faceMakerOpenedBy = ''; });
  await S.click('#sbody .act:has-text("Your haircut")'); await p.waitForTimeout(900);
  const hb = await p.evaluate(() => ({ on: document.getElementById('faceEd').classList.contains('on'), by: window.__faceMakerOpenedBy || '' }));
  ok('Your haircut opens the same face maker', hb.on && /hairBank/.test(hb.by), hb.by);
  await b.close(); srv.close();
  console.log('\nTHE BARBER\'S DOOR GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
