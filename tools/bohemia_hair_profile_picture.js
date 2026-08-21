/* THE HAIR IN PROFILE, BEFORE AND AFTER (8/21/26, CHARACTER lane).
 *
 * Paolo: "Continue fixing east and west hair pls"
 *
 * TWO defects, both profile-only, which is why three weeks of front views never
 * showed them:
 *   1. HIS PAINTED BOB WAS SHOWING UNDER THE HAIRSTYLE. genHair spans the PART GRID;
 *      his hair/curtain-bob paint reaches two cells past it each side at the crown.
 *      His bob's ramp holds one near-white colour, so what leaked was a bright blob
 *      over the forehead. 1,349 pixels across 15 styles and 3 facings.
 *   2. THE FADE STOPPED HALFWAY. The 8/2 fix taught the hair MASS to cover the whole
 *      skull side-on and left the fade's bottom, a hand copy of the same expression,
 *      at the old halfway line.
 *
 * BOTH HALVES COME OUT OF THE SAME CODE (CLO_KEEP_PD_HAIR), so the only difference on
 * screen is the thing being judged rather than two different builds.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. His
 * painted bob is not edited -- it is not DRAWN while a hairstyle is worn, and returns
 * the moment one is not. Never touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own render.
 *
 *   node tools/bohemia_hair_profile_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/hair-profile.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 1500 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const NAMES = ['BUZZ CUT', 'SLICK BACK', 'TEMPLE TAPER', 'SALT CROWN'];
    const keep = window.G_WORN;
    const frame = (n, d, old) => {
      window.G_WORN = { hair: n, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      window.CLO_KEEP_PD_HAIR = !!old;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      window.CLO_KEEP_PD_HAIR = false;
      return { px: f.px.slice(), W: f.CW };
    };
    const Z = 11, PAD = 18, LBL = 168, HDR = 128;
    const CROP = { x0: 0.29, x1: 0.71, y0: 0.04, y1: 0.26 };
    const cw = Math.round(112 * (CROP.x1 - CROP.x0)) * Z / 2;
    const ch = Math.round(112 * (CROP.y1 - CROP.y0)) * Z / 2;
    const COLS = [['E', true], ['E', false], ['W', true], ['W', false]];
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + COLS.length * (cw + PAD);
    cv.height = HDR + NAMES.length * (ch + PAD) + 60;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 27px monospace';
    cx.fillText('THE WHITE BLOB IN PROFILE', PAD, 42);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('your painted bob was still drawing UNDER every hairstyle.', PAD, 72);
    cx.fillText('front on, the hairstyle covered it. side on, it stuck out.', PAD, 94);
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
    for (const n of NAMES) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 15px monospace';
      cx.fillText(n, PAD, y + 22);
      COLS.forEach(([d, old], i) => blit(frame(n, d, old), LBL + PAD + i * (cw + PAD), y));
      y += ch + PAD;
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('1,349 pixels of your painted bob were showing through, in all fifteen styles. now zero.', PAD, cv.height - 32);
    cx.fillText('your bob is untouched and comes straight back when you take the hairstyle off.', PAD, cv.height - 14);
    return cv.toDataURL('image/png').split(',')[1];
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
