/* BOHEMIA THE SIX NEIGHBOURS, AS A PICTURE (Paolo 7/19 + 8/15 + 8/3, LOOK LAW 8/8)
 *
 * "just give me pictures and put it in a tab."
 *
 * The claim is "you can tell them apart without colour", so the picture has to be
 * the test itself: the six residents the city is actually drawing, once in colour
 * and once with every hue stripped out. If the bottom row were six of the same
 * person, the change did not work and you would see that instantly.
 *
 * It is the bottom row that matters, and here is why it is the honest one: THE
 * VALLEY IS DARK. The demo opens at 06:00 on a near-black street, so colour is the
 * one channel that is not reliably there. What was shipping before this was one
 * body in one set of clothes under four random tints -- which is the bottom row
 * with every figure identical.
 *
 * Bodies are read straight out of CAST_CV, the array the city received and is
 * blitting right now, so this is the cast in the game and not a table read out of
 * the source.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the already-baked resident sprites
 *   and writes a picture. It never touches BAKED, a joint, a bone or a painted
 *   pixel, and it sets no globals -- the bodies were baked before it ran.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every figure is a sprite the alpha
 * already baked from existing st:'canon' garments; nothing is drawn or invented.
 *
 *   node tools/bohemia_city_cast_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/six-neighbours.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(12000);

  const fr = page.frames().find(f => f.url().includes('CITY_WORLD'));
  if (!fr) { console.log('no city frame'); process.exit(1); }

  const ids = await page.evaluate(() => (window.CITY_CAST_LOOKS || []).map(l => l.id));
  const png = await fr.evaluate((ids) => {
    if (typeof CAST_CV === 'undefined' || !CAST_CV) return null;
    const bodies = CAST_CV.map(c => c && (c.S ? c.S.idle : (c[Object.keys(c)[0]] || {}).idle)).filter(Boolean);
    if (!bodies.length) return null;

    const SHOW = 132, PAD = 18, HEAD = 104, GAP = 46;
    const cv = document.createElement('canvas');
    cv.width = PAD + bodies.length * (SHOW + PAD);
    cv.height = HEAD + SHOW + GAP + SHOW + 40;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);   /* SUN MODE */

    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 24px monospace';
    g.fillText('THE SIX PEOPLE ON YOUR STREET', PAD, 38);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('they used to be YOU, six times, in six random colours.', PAD, 62);
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('the bottom row is the test: the game is dark, so colour is the one', PAD, 82);
    g.fillText('thing you cannot count on. take it away and they must still be six people.', PAD, 98);

    for (let i = 0; i < bodies.length; i++) {
      const ox = PAD + i * (SHOW + PAD);
      g.drawImage(bodies[i], ox, HEAD, SHOW, SHOW);
      if (ids[i]) { g.fillStyle = '#8a7a5a'; g.font = '12px monospace';
        g.fillText(ids[i], ox + 2, HEAD + SHOW + 14); }
    }

    /* the same row again with the colour removed */
    const y2 = HEAD + SHOW + GAP;
    const tmp = document.createElement('canvas');
    tmp.width = cv.width; tmp.height = SHOW;
    const tg = tmp.getContext('2d'); tg.imageSmoothingEnabled = false;
    for (let i = 0; i < bodies.length; i++) tg.drawImage(bodies[i], PAD + i * (SHOW + PAD), 0, SHOW, SHOW);
    const im = tg.getImageData(0, 0, tmp.width, SHOW), D = im.data;
    for (let i = 0; i < D.length; i += 4) {
      const l = 0.299 * D[i] + 0.587 * D[i + 1] + 0.114 * D[i + 2];
      D[i] = D[i + 1] = D[i + 2] = l;
    }
    tg.putImageData(im, 0, 0);
    g.fillStyle = '#1a1712'; g.font = 'bold 15px monospace';
    g.fillText('COLOUR REMOVED — still six people', PAD, y2 - 12);
    g.drawImage(tmp, 0, y2);

    return cv.toDataURL('image/png').split(',')[1];
  }, ids);

  if (!png) { console.log('no cast in the city yet'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('SIX NEIGHBOURS: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
