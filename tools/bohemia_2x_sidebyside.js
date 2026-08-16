/* BOHEMIA 2X -- BEFORE AND AFTER, THE SAME CHARACTER, THE SAME SIZE (Paolo 8/14)
 *
 * The one image the ruling can be judged from. Same person, same clip, same facing,
 * same display size -- the ONLY thing that changed is whether the frame was composed
 * at 56 and smeared to 112 by Scale2x, or composed at 112 outright.
 *
 * Both halves are read off disk from records/2x/before and records/2x/after, which
 * were captured through drawChar itself (VERIFY ON THE REAL SURFACE, 7/18) rather
 * than re-rendered here with some second code path that might flatter the result.
 *
 * WHAT TO LOOK AT, in his words: "the black border has to be thinner, like half as
 * thin". It is measured at 2px -> 1px against skin, and the zoom panel is there so
 * the count is visible and not just asserted.
 *
 *   node tools/bohemia_2x_sidebyside.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const D2X = path.join(REPO, 'records/2x');
const OUT = path.join(REPO, 'records/BOHEMIA_2X_BEFORE_AFTER_8_16_26.png');

const SHOTS = [['S', 'idle', 0], ['SE', 'walk', 0.25], ['E', 'idle', 0], ['N', 'walk', 0.5]];

(async () => {
  const load = (which, k) =>
    'data:image/png;base64,' + fs.readFileSync(path.join(D2X, which, k + '.png')).toString('base64');

  const pairs = SHOTS.map(([d, c, p]) => {
    const k = d + '_' + c + '_' + p;
    return { label: d + ' ' + c, a: load('before', k), b: load('after', k) };
  });

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });

  const png = await page.evaluate(async (pairs) => {
    const imgs = await Promise.all(pairs.flatMap(p => [p.a, p.b]).map(src =>
      new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; })));

    const Z = 3, S = 112 * Z, PAD = 22, HEAD = 64, FOOT = 150, COLW = S + PAD;
    const cv = document.createElement('canvas');
    cv.width = PAD + pairs.length * COLW;
    cv.height = HEAD + 2 * (S + 34) + FOOT;
    const x = cv.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.fillStyle = '#0d0d12'; x.fillRect(0, 0, cv.width, cv.height);

    x.fillStyle = '#e8e2d2'; x.font = 'bold 26px monospace'; x.textAlign = 'left';
    x.fillText('2X — TWICE THE PIXELS, HALF THE BORDER', PAD, 34);
    x.fillStyle = '#9a94a6'; x.font = '15px monospace';
    x.fillText('same character, same size on screen. only the resolution the frame is BUILT at changed.', PAD, 54);

    for (let r = 0; r < 2; r++) {
      const y0 = HEAD + r * (S + 34);
      x.fillStyle = r ? '#8fe89a' : '#d8a06a';
      x.font = 'bold 17px monospace';
      x.fillText(r ? 'AFTER — built at 112, border 1px' : 'BEFORE — built at 56, Scale2x to 112, border 2px', PAD, y0 - 8);
      for (let i = 0; i < pairs.length; i++) {
        const ox = PAD + i * COLW;
        x.drawImage(imgs[i * 2 + r], ox, y0, S, S);
        x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 1;
        x.strokeRect(ox + 0.5, y0 + 0.5, S, S);
        if (r === 0) { x.fillStyle = '#79738a'; x.font = '14px monospace';
          x.fillText(pairs[i].label, ox, y0 - 26); }
      }
    }

    /* THE BORDER, ZOOMED, so the pixel count is visible rather than asserted */
    const zy = HEAD + 2 * (S + 34) + 16;
    x.fillStyle = '#e8e2d2'; x.font = 'bold 17px monospace';
    x.fillText('THE BORDER, ZOOMED 10x  —  his ask: "the black border has to be thinner, like half as thin"', PAD, zy);
    const ZZ = 10, CROP = 11;
    for (let r = 0; r < 2; r++) {
      const src = imgs[r];                       // S idle, before / after
      const tmp = document.createElement('canvas'); tmp.width = tmp.height = 112;
      const tc = tmp.getContext('2d'); tc.imageSmoothingEnabled = false;
      tc.drawImage(src, 0, 0);
      const D = tc.getImageData(0, 0, 112, 112).data;
      /* find the left silhouette edge on a face row */
      let fy = 26, fx = 0;
      for (let x2 = 0; x2 < 112; x2++) if (D[(fy * 112 + x2) * 4 + 3] > 40) { fx = x2; break; }
      const ox = PAD + r * (CROP * ZZ + 40), oy = zy + 16;
      x.drawImage(tmp, fx - 1, fy - 4, CROP, CROP, ox, oy, CROP * ZZ, CROP * ZZ);
      x.strokeStyle = 'rgba(255,255,255,0.14)';
      for (let g = 0; g <= CROP; g++) {
        x.beginPath(); x.moveTo(ox + g * ZZ, oy); x.lineTo(ox + g * ZZ, oy + CROP * ZZ); x.stroke();
        x.beginPath(); x.moveTo(ox, oy + g * ZZ); x.lineTo(ox + CROP * ZZ, oy + g * ZZ); x.stroke();
      }
      x.fillStyle = r ? '#8fe89a' : '#d8a06a'; x.font = 'bold 14px monospace';
      x.fillText(r ? 'AFTER 1px' : 'BEFORE 2px', ox, oy + CROP * ZZ + 18);
    }
    return cv.toDataURL('image/png').split(',')[1];
  }, pairs);

  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('2X SIDE BY SIDE: wrote ' + OUT);
  await browser.close();
})();
