/* WHAT IS WRONG WITH THE HAIR IN PROFILE? (8/21/26, CHARACTER lane)
 *
 * Paolo: "Continue fixing east and west hair pls"
 *
 * He has looked at the profile facings and something is wrong. Before changing a
 * line, LOOK AT IT (VERIFY ON THE REAL SURFACE, 7/18): every canon hairstyle, E and
 * W, big enough to see individual pixels, beside the south view that he is happy
 * with so the difference is the thing on screen rather than a memory.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own genHair over
 * the alpha's own posed body; this tool arranges and zooms.
 *
 *   node tools/bohemia_hair_profile_look.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/hair-profile-look.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1600 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const hairs = CANON.filter(g => g.layer === 'hair');
    const body = CANON.filter(g => ['WHITE TEE', 'BLUE JEANS'].indexOf(g.n) >= 0);
    const DIRS = ['S', 'E', 'W'];

    /* THE REAL WORN PATH, NOT A HAND COMPOSITE (VERIFY ON THE REAL SURFACE, 7/18).
       The first cut of this tool stamped the generators on top of buildFrame's output
       itself, which happens to match the render order but SKIPS the PD layer logic
       entirely -- so it could never have shown whether his painted bob was suppressed.
       Setting G_WORN drives the same code the game draws him with. */
    const keep = window.G_WORN;
    const frame = (h, d) => {
      window.G_WORN = { hair: h.n, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 9, PAD = 12, LBL = 150, HDR = 76;
    const CROP = { x0: 0.28, x1: 0.72, y0: 0.03, y1: 0.26 };
    const cw = Math.round(112 * (CROP.x1 - CROP.x0)) * Z / 2;
    const ch = Math.round(112 * (CROP.y1 - CROP.y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + DIRS.length * (cw + PAD);
    cv.height = HDR + hairs.length * (ch + PAD) + 20;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 22px monospace';
    cx.fillText('EVERY HAIRSTYLE, FRONT AND BOTH PROFILES', PAD, 34);
    cx.font = 'bold 15px monospace'; cx.fillStyle = '#c98a6a';
    DIRS.forEach((d, i) => cx.fillText(d, LBL + PAD + i * (cw + PAD) + cw / 2 - 6, HDR - 8));

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
    for (const h of hairs) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 13px monospace';
      cx.fillText(h.n, PAD, y + 20);
      DIRS.forEach((d, i) => blit(frame(h, d), LBL + PAD + i * (cw + PAD), y));
      y += ch + PAD;
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
