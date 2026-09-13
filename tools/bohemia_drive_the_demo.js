/* ============================================================================
   DRIVE THE DEMO LIKE A PLAYER (9/13/26, LIFE + CITY lane)

   Rule 14: THE DEMO'S FIRST FIVE MINUTES ON A PHONE IS THE ONLY MEASURE OF THE GAME.
   You cannot measure that by setting variables. This lane proved it twice, expensively:

     [tiles not slabs]  I set TW by hand, rendered, and reported "zero images at every
                        zoom". The game recomputes TW every frame from its own zoom, so
                        I had measured a camera the game never has. Two screenshots
                        labelled TW=18 and TW=28 came back PIXEL-IDENTICAL and I nearly
                        read them as a before/after. The real number was the opposite.
     [freeway reads]    Same again with city.x and MODE: four attempts at a before/after
                        picture, every one a frame the game repainted before the shutter.

   SO THIS DRIVES REAL POINTER EVENTS AT REAL SCREEN COORDINATES, and it exists because
   four separate traps sit between a script and the glass. Every one cost this lane a
   round:

     1. THE IFRAME OFFSET. The canvas lives in an iframe, so a rect measured inside it
        is iframe-relative. A tap needs the frame's own box added or it lands nowhere.
     2. THE CARD. A card sits over the glass at the door and eats every tap silently --
        the whole screen reads as "nothing happened". ITS BUTTON SAYS "GET UP". I
        guessed NOT NOW / SKIP / CLOSE / OK, none of which exist, and got a clean
        "nothing moved" from all four.
     3. A TEXT SELECTOR IS NOT A FINGER. Clicking by text matched a hidden copy and
        did nothing; a touch at the element's real screen position worked.
     4. ASSIGNMENT IS NOT INPUT. MODE, TW, city.x and CZOOM are all recomputed by the
        loop. The only honest way in is the control a player uses.

   WHAT IT ANSWERS, measured on the shipped demo 9/13:
     - the way into CITY mode is the PINCH, and it works on the first hard squeeze
       (HZOOM 44 -> 11, mode human -> city). The round button is deliberately quiet
       when nothing is in front of you and the CITY chip is built but never appended,
       so the pinch is the only door -- and it opens.
     - on foot the walked surface paints 37.4M pixels of ART against 9.2M of flat fill:
       FOUR FIFTHS OF WHAT HE SEES IS ART. "the streets don't look like streets" is
       therefore not a missing renderer; the pixels are there and they read flat.

   USE IT:  const D = require('./tools/bohemia_drive_the_demo.js');
            const d = await D.open();          // boots the demo, clears the card
            await d.pinchOut();                // crosses the seam into CITY
            await d.shot('/tmp/x.png');        // the canvas only, no chrome
            console.log(await d.state());
            await d.close();
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png',
               '.webmanifest': 'application/manifest+json' };

async function open(opts) {
  opts = opts || {};
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  /* A PHONE, because that is the only surface rule 14 talks about. */
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
    hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  await page.goto('http://127.0.0.1:' + port + '/slices/'
    + (opts.file || 'BOHEMIA_DEMO.html'), { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(opts.boot || 15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(opts.settle || 22000);

  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0];
  if (!fr) { await browser.close(); server.close(); throw new Error('no city frame'); }
  /* TRAP 1: the frame's own box, added to every coordinate below. */
  const fb = await (await fr.frameElement()).boundingBox();

  const tapAt = (x, y) => page.touchscreen.tap(fb.x + x, fb.y + y);
  /* TRAP 3: a real finger at the element's real position, never a text click. */
  const tapEl = async (sel) => {
    const h = await fr.$(sel); if (!h) return false;
    const b = await h.boundingBox(); if (!b) return false;
    await tapAt(b.x + b.width / 2, b.y + b.height / 2);
    return true;
  };

  /* TRAP 2: the card, and its button says GET UP. */
  const clearCards = async () => {
    for (let i = 0; i < 4; i++) {
      let hit = false;
      for (const label of ['GET UP', 'NOT NOW', 'SKIP', 'CONTINUE', 'CLOSE', 'OK']) {
        const h = await fr.$(`text="${label}"`).catch(() => null);
        if (h && await h.isVisible().catch(() => false)) {
          const b = await h.boundingBox();
          if (b) { await tapAt(b.x + b.width / 2, b.y + b.height / 2); hit = true; break; }
        }
      }
      if (!hit) break;
      await page.waitForTimeout(1400);
    }
  };
  await clearCards();
  await page.waitForTimeout(1200);

  const box = await fr.evaluate(() => {
    const c = document.querySelector('canvas'); const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const CX = fb.x + box.x + box.w / 2, CY = fb.y + box.y + box.h / 2;
  const cdp = await ctx.newCDPSession(page);

  /* TRAP 4: the seam is crossed by a PINCH, not by assigning MODE. Fingers together
     is zoom out is toward the city; measured, one hard squeeze does it. */
  const pinch = async (from, to, steps) => {
    steps = steps || 20;
    for (let i = 0; i <= steps; i++) {
      const r = from + (to - from) * i / steps;
      await cdp.send('Input.dispatchTouchEvent', {
        type: i === 0 ? 'touchStart' : 'touchMove',
        touchPoints: [{ x: CX - r, y: CY, id: 1 }, { x: CX + r, y: CY, id: 2 }] });
      await page.waitForTimeout(28);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(1500);
  };

  return {
    page, fr, ctx, browser, errs,
    state: () => fr.evaluate(() => ({
      mode: typeof MODE !== 'undefined' ? MODE : '?',
      tw: typeof TW !== 'undefined' ? +TW.toFixed(1) : null,
      czoom: typeof CZOOM !== 'undefined' ? +CZOOM.toFixed(3) : null,
      hzoom: typeof HZOOM !== 'undefined' ? +HZOOM.toFixed(3) : null,
      hx: typeof hx !== 'undefined' ? hx : null,
      hy: typeof hy !== 'undefined' ? hy : null })),
    clearCards, tapEl, tapAt,
    pinchOut: () => pinch(150, 25),          /* toward the city */
    pinchIn:  () => pinch(25, 150),          /* back down to the street */
    /* the canvas only: the phone chrome is not the game */
    shot: async (file) => { await page.waitForTimeout(700);
      await page.screenshot({ path: file,
        clip: { x: fb.x + box.x, y: fb.y + box.y, width: box.w, height: box.h } }); },
    /* every visible control by WHAT IT SAYS, because that is all he has */
    controls: () => fr.evaluate(() => {
      const out = [], seen = {};
      for (const el of Array.from(document.querySelectorAll('div,button,span'))) {
        if (el.children.length > 2) continue;
        const t = (el.textContent || '').trim();
        if (!t || t.length > 28 || seen[t]) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) continue;
        seen[t] = 1; out.push({ text: t, id: el.id || '' });
      }
      return out; }),
    close: async () => { await ctx.close(); await browser.close(); server.close(); }
  };
}

module.exports = { open };

/* run it directly for a look: node tools/bohemia_drive_the_demo.js /tmp/out */
if (require.main === module) {
  (async () => {
    const out = process.argv[2] || '/tmp/demo';
    const d = await open();
    console.log('at the door : ' + JSON.stringify(await d.state()));
    console.log('controls    : ' + (await d.controls()).map(c => c.text).join(' | '));
    await d.shot(out + '_00_door.png');
    await d.pinchOut();
    console.log('after pinch : ' + JSON.stringify(await d.state()));
    await d.shot(out + '_01_city.png');
    await d.pinchIn();
    console.log('back down   : ' + JSON.stringify(await d.state()));
    await d.shot(out + '_02_street.png');
    console.log('page errors : ' + (d.errs.length ? d.errs[0] : 'none'));
    await d.close();
  })().catch(e => { console.log('FAILED: ' + e.message); process.exit(1); });
}
