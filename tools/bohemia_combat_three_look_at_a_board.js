#!/usr/bin/env node
/* a look at one inside's layout on the fight page alone (served from disk at the real address): node look_inside.js <id> <layout> <out.png> [w] [h] [notches] [seed]
   The board is ASKED FOR here (FIGHT_OPTS.inside and insideAsk.layout), so this is a look and a card picture, never the page proof. */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), BASE = 'https://paolosarn.github.io/bohemia/';
const [ID, LAYOUT, OUT, W, H, NOTCH, SEED] = [process.argv[2], process.argv[3], process.argv[4], +(process.argv[5] || 1170), +(process.argv[6] || 826), +(process.argv[7] || 3), +(process.argv[8] || 7)];
const OPTS = process.env.LOOK_OPTS ? JSON.parse(process.env.LOOK_OPTS) : null, OLD = process.env.LOOK_FIGHT || null;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.glb': 'model/gltf-binary', '.txt': 'text/plain', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]), f = (OLD && rel === 'slices/BOHEMIA_FIGHT.html') ? OLD : path.join(ROOT, rel);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' } });
  });
  await ctx.addInitScript({ content: 'window.FIGHT_OPTS = ' + JSON.stringify(OPTS ? Object.assign({ seed: SEED, teach: false }, OPTS) : { district: ID === 'hall' ? 'convention' : ID === 'powerhouse' ? 'dam' : ID, inside: ID, insideAsk: { layout: LAYOUT, flip: [false, false] }, seed: SEED, teach: false }) + ';' });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await page.goto(BASE + 'slices/BOHEMIA_FIGHT.html');
  await page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 0 && typeof UI !== 'undefined' && UI.board && UI.tw > 0, null, { timeout: 60000 });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => ({ board: FIGHT.S.boardDef.name, inside: FIGHT.S.boardDef.inside, zoom: UI.zoom, night: FIGHT.S.night, blocks: (FIGHT.S.boardDef.blocks || []).map(r => r.join(' ')).join(' / ') }));
  await page.evaluate((n) => { const cv = document.getElementById('cv'); for (let i = 0; i < n; i++) cv.dispatchEvent(new WheelEvent('wheel', { deltaY: 400, clientX: innerWidth / 2, clientY: innerHeight * 0.45, bubbles: true, cancelable: true })); }, NOTCH);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT });
  const rect = await page.evaluate(() => [sx(0), sy(0), sx(FIGHT.S.w * UI.tw), sy(FIGHT.S.h * UI.th)].map(Math.round));
  console.log('RECT ' + JSON.stringify(rect));
  console.log(JSON.stringify(info), 'zoom now', await page.evaluate(() => UI.zoom), 'errors', errs.length, errs.slice(0, 2).join(' | '));
  await browser.close();
})();
