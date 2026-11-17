#!/usr/bin/env node
/* ask row 646 (COOK FIVE 11/17): close in, with the camera still, an inside's furniture is not drawn.
   The fight page alone on a phone (390 x 844, two device pixels a point), an inside asked for, the page's own wheel zoom to a target zoom,
   then the SAME camera read twice off the glass: a frame the still camera's sheet drew, and a frame the ground drew straight on the glass
   (UI.gprev cleared: the page's own other path). The two must be the same picture. Also counts how many of the board's pieces have any
   of their own pixels on the still frame differ from the straight one.
   node still_vs_direct.js <inside> <layout> <zoom> <out-prefix>      env LOOK_FIGHT=<an older BOHEMIA_FIGHT.html> for the before */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), BASE = 'https://paolosarn.github.io/bohemia/';
const [ID, LAYOUT, ZOOM, OUT] = [process.argv[2], process.argv[3], +(process.argv[4] || 0.55), process.argv[5] || 'still'];
const OLD = process.env.LOOK_FIGHT || null;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary', '.txt': 'text/plain', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = (OLD && rel === 'slices/BOHEMIA_FIGHT.html') ? OLD : path.join(ROOT, rel);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' } });
  });
  await ctx.addInitScript({ content: 'window.FIGHT_OPTS = ' + JSON.stringify({ district: ID === 'hall' ? 'convention' : ID, inside: ID, insideAsk: { layout: LAYOUT, flip: [false, false] }, seed: 7, teach: false }) + ';' });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await page.goto(BASE + 'slices/BOHEMIA_FIGHT.html');
  await page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 0 && typeof UI !== 'undefined' && UI.board && UI.tw > 0, null, { timeout: 60000 });
  await page.waitForTimeout(4000);
  /* the page's own wheel zoom, onto the middle of the board, until the target zoom */
  for (let i = 0; i < 160; i++) {
    const z = await page.evaluate(() => UI.zoom); if (Math.abs(z - ZOOM_T()) < 0.02) break;
    await page.evaluate((dy) => { const cv = document.getElementById('cv'); cv.dispatchEvent(new WheelEvent('wheel', { deltaY: dy, clientX: innerWidth / 2, clientY: innerHeight * 0.4, bubbles: true, cancelable: true })); }, z < ZOOM ? -60 : 60);
    await page.waitForTimeout(120);
  }
  function ZOOM_T() { return ZOOM; }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: OUT + '_still.png' });
  const R = await page.evaluate(async () => {
    const cv = document.getElementById('cv'), g = cv.getContext('2d'), S = FIGHT.S, B = S.boardDef, G = DB.ground;
    const grab = () => g.getImageData(0, 0, cv.width, cv.height).data, raf = () => new Promise(r => requestAnimationFrame(() => r()));
    for (let i = 0; i < 8; i++) await raf();
    const still = grab(); await raf(); const still2 = grab();
    UI.gprev = null; await raf(); const direct = grab();
    const diff = (a, b) => { let s = 0, big = 0, n = 0; for (let i = 0; i < a.length; i += 16) { const d = (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3; s += d; if (d > 24) big++; n++; } return { mean: +(s / n).toFixed(2), big: +(100 * big / n).toFixed(2) }; };
    /* piece by piece: its box on the glass, how far the still frame is from the straight one inside it */
    const k = UI.tw / G.tile_px[0], pxm = G.px_per_metre, pym = G.tile_px[1] / G.tile_metres, z = UI.zoom, D = window.devicePixelRatio || 1; let seen = 0, off = 0;
    (B.cover || []).forEach(c => { const im = UI.imgs[FIGHT.pieceSrc(c.piece)]; if (!im) return;
      const x = sx(c.x_m * pxm * k), y = sy(c.y_m * pym * k), w = im.width * k * z, h = im.height * k * z;
      if (x < 0 || y < 0 || x + w > innerWidth || y + h > innerHeight * 0.6) return; seen++;
      let s = 0, n = 0; for (let yy = Math.round(y * D); yy < Math.round((y + h) * D); yy += 3) for (let xx = Math.round(x * D); xx < Math.round((x + w) * D); xx += 3) { const i = (yy * cv.width + xx) * 4; s += (Math.abs(still[i] - direct[i]) + Math.abs(still[i + 1] - direct[i + 1]) + Math.abs(still[i + 2] - direct[i + 2])) / 3; n++; }
      if (n && s / n > 6) off++; });
    return { zoom: +UI.zoom.toFixed(3), dpr: D, pieces: (B.cover || []).length, onGlass: seen, missingOnStill: off, stillVsDirect: diff(still, direct), noise: diff(still, still2), board: B.name, layout: B.inside && B.inside.layout };
  });
  console.log(JSON.stringify(R), 'errors', errs.length, 'tw', await page.evaluate(() => [UI.tw, UI.zoomMax || null, +(UI.tw * UI.zoom * devicePixelRatio / DB.ground.tile_px[0]).toFixed(3)]));
  await browser.close();
})();
