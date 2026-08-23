/* THE BOOTS GOT STITCHING (8/22/26, CHARACTER lane). Row 2X step 5.
 *
 * MEASURED FIRST (tools/bohemia_seam_width_audit.js): 0 of 18 canon shoes had a single
 * one-pixel feature. Every mark on them was a whole cell wide, so four times the pixels
 * had bought a BIGGER boot rather than a finer one. Footwear, gloves, scarves, belts and
 * face pieces were all at zero -- 102 of 200 canon garments with no fine detail at all.
 *
 * A boot is stitched where the upper meets the sole. That stitch is one pixel with a gap
 * either side, and at 56 there was nowhere to put it. This is the first thing on a shoe
 * that the extra pixels actually buy.
 *
 * BOTH HALVES COME OUT OF THE SAME GENERATOR (CLO_NOSTITCH), so the only difference on
 * screen is the thing being judged rather than two different builds.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own genShoes.
 *
 *   node tools/bohemia_boot_stitch_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/boot-stitch.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const NAMES = ['BROWN BOOTS', 'WRAPPED BOOTS', 'WHITE SNEAKERS'];
    const keep = window.G_WORN;
    const frame = (nm, d, old) => {
      window.G_WORN = { base: 'WHITE TEE', legs: 'BLUE JEANS', feet: nm };
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(!!old);
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(false);
      return { px: f.px.slice(), W: f.CW };
    };
    const Z = 16, PAD = 20, LBL = 180, HDR = 126;
    const CROP = { x0: 0.30, x1: 0.70, y0: 0.72, y1: 0.98 };
    const cw = Math.round(112 * (CROP.x1 - CROP.x0)) * Z / 2;
    const ch = Math.round(112 * (CROP.y1 - CROP.y0)) * Z / 2;
    const COLS = [['S', true], ['S', false], ['E', true], ['E', false]];
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + COLS.length * (cw + PAD);
    cv.height = HDR + NAMES.length * (ch + PAD) + 56;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 26px monospace';
    cx.fillText('THE BOOTS GOT STITCHING', PAD, 42);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('not one of your 18 shoes had a single one-pixel detail on it.', PAD, 72);
    cx.fillText('4x the pixels was buying a bigger boot, not a finer one.', PAD, 94);
    cx.font = 'bold 15px monospace';
    COLS.forEach(([d, old], i) => {
      cx.fillStyle = old ? '#c98a6a' : '#8fc07a';
      cx.fillText(d + (old ? ' BEFORE' : ' NOW'), LBL + PAD + i * (cw + PAD), HDR - 10);
    });
    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * CROP.x0), sw = Math.round(N * (CROP.x1 - CROP.x0));
      const sy = Math.round(N * CROP.y0), sh = Math.round(N * (CROP.y1 - CROP.y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };
    let y = HDR;
    for (const nm of NAMES) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(nm, PAD, y + 22);
      COLS.forEach(([d, old], i) => blit(frame(nm, d, old), LBL + PAD + i * (cw + PAD), y));
      y += ch + PAD;
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('a stitch line where the upper meets the sole. one pixel, dotted, on every shoe.', PAD, cv.height - 30);
    cx.fillText('nothing you already ruled on got thinner: the heel seam and the laces are untouched.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
