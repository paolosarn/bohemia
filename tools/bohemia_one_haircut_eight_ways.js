/* ONE HAIRCUT, EIGHT WAYS (8/25/26, CHARACTER lane).
 *
 * Paolo, 8/25: "you just have to be intentional with the hairstyles making them looking
 * good and the same and coordinated from all angles."
 *
 * CLAUSE 1 of the 8/25 law. A hairstyle is one object seen eight ways, not eight
 * drawings. This is the picture that shows whether that is true, and it is the whole
 * turn around in one row per haircut.
 *
 * WHAT IT CAUGHT, measured before it was drawn:
 *   SHOULDER LENGTH   11 pixels of hair below the jaw facing SOUTH.  ZERO facing EAST,
 *   LONG LOOSE        NORTH, or any other way he can turn. Turn the head one notch and
 *                     a shoulder-length haircut became a crop.
 *   and LONG LOOSE carries a length dial 50% bigger than SHOULDER LENGTH and drew the
 *   SAME 11 pixels, because the taper closed the fall before the dial ever mattered.
 *
 * Both halves come out of the SAME generator, so the only difference on screen is the
 * thing being judged, and each row says out loud how many pixels changed inside the crop.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own generators.
 *
 *   node tools/bohemia_one_haircut_eight_ways.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/one-haircut.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1700, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const STYLES = ['SHOULDER LENGTH', 'LONG LOOSE', 'WOLF CUT'];
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const LBLS = { S: 'front', SE: 'turn 1', E: 'side', NE: 'turn 3',
                   N: 'back', NW: 'turn 5', W: 'side', SW: 'turn 7' };
    const keep = window.G_WORN, keepH = G.equipped.hair;
    const frame = (nm, d) => {
      window.G_WORN = { hair: nm, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      G.equipped.hair = '';
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 11, PAD = 14, LBL = 200, HDR = 152;
    const X0 = 0.26, X1 = 0.74, Y0 = 0.02, Y1 = 0.46;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + DIRS.length * (cw + PAD);
    cv.height = HDR + STYLES.length * (ch + 26 + PAD) + 56;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('ONE HAIRCUT, THE WHOLE WAY ROUND', PAD, 44);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said the haircuts have to be the same and coordinated from all angles.', PAD, 78);
    cx.fillText('two of the fifteen were not: long hair from the front, a crop from every other side.', PAD, 102);
    cx.fillText('each row is one haircut, turning all the way around, one step at a time.', PAD, 126);

    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
      const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };

    let y = HDR;
    for (const nm of STYLES) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 15px monospace';
      cx.fillText(nm.toLowerCase(), PAD, y + 30);
      if (!(window.GARMENTS || []).some(q => q.n === nm)) {
        cx.fillStyle = '#c05a4a'; cx.font = 'bold 12px monospace';
        cx.fillText('NOT IN THE CATALOGUE', PAD, y + 50); }
      DIRS.forEach((d, i) => {
        const x = LBL + PAD + i * (cw + PAD);
        cx.fillStyle = (d === 'S' || d === 'N') ? '#8fc07a' : '#7a6f5c';
        cx.font = '13px monospace'; cx.fillText(LBLS[d], x, y + 16);
        blit(frame(nm, d), x, y + 24);
      });
      y += ch + 26 + PAD;
    }
    G.equipped.hair = keepH;
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('the fall used to stop dead at the jaw on six of these eight views. it does not now.', PAD, cv.height - 32);
    cx.fillText('the long one is genuinely longer than the shoulder one, which it was not before either.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
