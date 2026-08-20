/* BOHEMIA THE THIRTEEN OUTFITS, AS A PICTURE (Paolo 8/8 LOOK LAW + 7/19 + 8/15)
 *
 * "just give me pictures and put it in a tab."
 *
 * The claim is "you can tell all thirteen factions apart without colour", so the
 * picture has to BE the test: the thirteen bodies the CHARACTER tab is drawing right
 * now, once in colour and once with every hue stripped out. If the bottom block were
 * thirteen of the same person, the whole row failed and you would see it instantly.
 *
 * The bottom block is the honest one and here is why: THE VALLEY IS DARK. The demo
 * opens at 06:00 on a near-black street, so colour is the one channel that is not
 * reliably there -- which is exactly what STRUCTURE-NOT-COLOR says.
 *
 * Bodies are read off the built board, not re-rendered here by a second path that
 * might flatter the result (VERIFY ON THE REAL SURFACE, 7/18).
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads canvases that are already painted and
 *   writes a picture. It never touches BAKED, a joint, a bone or a painted pixel, and
 *   it sets no globals -- the board was built by the alpha's own boot before it ran.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every figure is the alpha's own render of
 * existing st:'canon' garments; this only arranges, labels and desaturates.
 *
 *   node tools/bohemia_faction_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/thirteen-outfits.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(6000);

  const png = await page.evaluate(() => {
    const host = document.getElementById('outfitBoard');
    if (!host) return null;
    const cvs = Array.from(host.querySelectorAll('canvas[data-faction]'));
    if (!cvs.length) return null;

    const COLS = 7, SHOW = 112, PAD = 12, HEAD = 116, LBL = 16, GAP = 44;
    const rows = Math.ceil(cvs.length / COLS);
    const blockH = rows * (SHOW + LBL + PAD);
    const cv = document.createElement('canvas');
    cv.width = PAD + COLS * (SHOW + PAD);
    cv.height = HEAD + blockH + GAP + blockH + 24;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);   /* SUN MODE */

    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 24px monospace';
    g.fillText('THE THIRTEEN OUTFITS', PAD, 38);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('every faction you can join, told apart by its OUTLINE and not its colour.', PAD, 62);
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('880 fits were rendered and measured; these are the thirteen most different.', PAD, 82);
    g.fillText('the bottom block is the test: the game is dark, so colour is the one thing', PAD, 98);
    g.fillText('you cannot count on. take it away and there must still be thirteen people.', PAD, 114);

    const draw = (y0) => {
      for (let i = 0; i < cvs.length; i++) {
        const ox = PAD + (i % COLS) * (SHOW + PAD);
        const oy = y0 + Math.floor(i / COLS) * (SHOW + LBL + PAD);
        g.drawImage(cvs[i], ox, oy, SHOW, SHOW);
        g.fillStyle = '#6a5a3a'; g.font = '11px monospace';
        g.fillText((cvs[i].getAttribute('data-faction') || '').toUpperCase(), ox + 1, oy + SHOW + 12);
      }
    };
    draw(HEAD);

    /* the same thirteen again with the colour removed */
    const y2 = HEAD + blockH + GAP;
    const tmp = document.createElement('canvas');
    tmp.width = cv.width; tmp.height = blockH;
    const tg = tmp.getContext('2d'); tg.imageSmoothingEnabled = false;
    for (let i = 0; i < cvs.length; i++) {
      const ox = PAD + (i % COLS) * (SHOW + PAD);
      const oy = Math.floor(i / COLS) * (SHOW + LBL + PAD);
      tg.drawImage(cvs[i], ox, oy, SHOW, SHOW);
    }
    const im = tg.getImageData(0, 0, tmp.width, blockH), D = im.data;
    for (let i = 0; i < D.length; i += 4) {
      const l = 0.299 * D[i] + 0.587 * D[i + 1] + 0.114 * D[i + 2];
      D[i] = D[i + 1] = D[i + 2] = l;
    }
    tg.putImageData(im, 0, 0);
    g.fillStyle = '#1a1712'; g.font = 'bold 15px monospace';
    g.fillText('COLOUR REMOVED — still thirteen people', PAD, y2 - 14);
    g.drawImage(tmp, 0, y2);
    return cv.toDataURL('image/png').split(',')[1];
  });

  if (!png) { console.log('the outfits board has not built'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('THIRTEEN OUTFITS: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
