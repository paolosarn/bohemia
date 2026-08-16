/* BOHEMIA THE BORDER, BEFORE AND AFTER, AS A PICTURE (Paolo 8/14 + 8/8)
 *
 * 8/14: "the black border has to be thinner, like half as thin."
 * 8/8 LOOK LAW: "just give me pictures and put it in a tab."
 *
 * One picture, for the LOOK tab. Same character, same clip, same facing, same size
 * on screen. The ONLY thing that changed is when the border pass runs: it used to be
 * drawn on the 56 composition and then doubled by the Scale2x that takes the frame
 * to 112, so it arrived 2px thick; it now runs after the upscale and arrives at 1px.
 *
 * Both halves are read off disk from records/2x/before and records/2x/border, which
 * were captured through drawChar itself -- the same function the CHARACTER tab calls
 * -- rather than re-rendered here by some second path that might flatter the result.
 * (VERIFY ON THE REAL SURFACE, 7/18.)
 *
 * The zoom panel is there because the whole claim is a PIXEL COUNT, and a claim
 * about single pixels shown at 1x is not a claim anybody can check.
 *
 *   node tools/bohemia_border_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const D2X = path.join(REPO, 'records/2x');
const OUT = path.join(REPO, 'slices/look/border-one-pixel.png');

const SHOTS = [['S', 'idle', 0], ['SE', 'walk', 0.25], ['E', 'idle', 0]];

(async () => {
  const load = (which, k) =>
    'data:image/png;base64,' + fs.readFileSync(path.join(D2X, which, k + '.png')).toString('base64');
  const pairs = SHOTS.map(([d, c, p]) => {
    const k = d + '_' + c + '_' + p;
    return { label: d + ' ' + c, a: load('before', k), b: load('border', k) };
  });

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 });

  const png = await page.evaluate(async (pairs) => {
    const imgs = await Promise.all(pairs.flatMap(p => [p.a, p.b]).map(src =>
      new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; })));

    const Z = 3, S = 112 * Z, PAD = 26, TOP = 96, ROWLBL = 30, GAP = 26;
    const zoomH = 150;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + pairs.length * (S + PAD) - PAD;
    cv.height = TOP + 2 * (ROWLBL + S + GAP) + zoomH + PAD;
    const x = cv.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.fillStyle = '#0d0d12'; x.fillRect(0, 0, cv.width, cv.height);

    x.textAlign = 'left';
    x.fillStyle = '#e8e2d2'; x.font = 'bold 28px monospace';
    x.fillText('THE BLACK BORDER IS ONE PIXEL NOW', PAD, 42);
    x.fillStyle = '#9a94a6'; x.font = '16px monospace';
    x.fillText('"the black border has to be thinner, like half as thin"  —  8/14', PAD, 66);
    x.fillStyle = '#6f6a7c'; x.font = '14px monospace';
    x.fillText('same character, same size on screen. only WHEN the border is drawn changed.', PAD, 86);

    for (let r = 0; r < 2; r++) {
      const y0 = TOP + r * (ROWLBL + S + GAP) + ROWLBL;
      x.fillStyle = r ? '#8fe89a' : '#d8a06a';
      x.font = 'bold 17px monospace';
      x.fillText(r ? 'AFTER — 1 pixel' : 'BEFORE — 2 pixels', PAD, y0 - 10);
      for (let i = 0; i < pairs.length; i++) {
        const ox = PAD + i * (S + PAD);
        x.drawImage(imgs[i * 2 + r], ox, y0, S, S);
        x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 1;
        x.strokeRect(ox + 0.5, y0 + 0.5, S, S);
      }
    }

    /* the count, visible */
    const zy = TOP + 2 * (ROWLBL + S + GAP) + 6;
    x.fillStyle = '#e8e2d2'; x.font = 'bold 17px monospace';
    x.fillText('THE EDGE OF THE FACE, ZOOMED 11x', PAD, zy);
    const ZZ = 11, CROP = 10;
    for (let r = 0; r < 2; r++) {
      const src = imgs[r];
      const tmp = document.createElement('canvas'); tmp.width = tmp.height = 112;
      const tc = tmp.getContext('2d'); tc.imageSmoothingEnabled = false;
      tc.drawImage(src, 0, 0);
      const D = tc.getImageData(0, 0, 112, 112).data;
      let fy = 28, fx = 0;
      for (let x2 = 0; x2 < 112; x2++) if (D[(fy * 112 + x2) * 4 + 3] > 40) { fx = x2; break; }
      const ox = PAD + r * (CROP * ZZ + 70), oy = zy + 14;
      x.drawImage(tmp, fx - 1, fy - 4, CROP, CROP, ox, oy, CROP * ZZ, CROP * ZZ);
      x.strokeStyle = 'rgba(255,255,255,0.16)'; x.lineWidth = 1;
      for (let g = 0; g <= CROP; g++) {
        x.beginPath(); x.moveTo(ox + g * ZZ + 0.5, oy); x.lineTo(ox + g * ZZ + 0.5, oy + CROP * ZZ); x.stroke();
        x.beginPath(); x.moveTo(ox, oy + g * ZZ + 0.5); x.lineTo(ox + CROP * ZZ, oy + g * ZZ + 0.5); x.stroke();
      }
      x.fillStyle = r ? '#8fe89a' : '#d8a06a'; x.font = 'bold 14px monospace';
      x.fillText(r ? 'AFTER' : 'BEFORE', ox, oy + CROP * ZZ + 20);
    }
    return cv.toDataURL('image/png').split(',')[1];
  }, pairs);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('BORDER PICTURE: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
