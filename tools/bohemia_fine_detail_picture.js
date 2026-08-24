/* THE SMALL THINGS (8/22/26, CHARACTER lane). Row 2X step 5, third pass.
 *
 * MEASURED (tools/bohemia_seam_width_audit.js): 102 of 200 canon garments had no
 * one-pixel detail anywhere -- every mark a whole cell wide, so four times the pixels
 * was buying bigger clothes rather than finer ones. Boots got a welt stitch on 8/22a
 * (feet 0/18 -> 18/18). This is the next four:
 *     gloves   a knuckle seam        hands 0/4 -> 4/4
 *     belts    edge stitching        waist 0/5 -> 2/5 (tool belts are genGear's)
 *     scarves  a woven weft line     neck  0/7 -> 7/7
 *     masks    a hem stitch          face  0/8 -> 5/8
 *
 * NONE OF THESE THIN A MARK HE RULED ON. Every one is a mark that did not exist,
 * because at 56 there was no row to put it in. That distinction is the whole method:
 * ADD detail the finer grid can hold, never shrink the detail he approved.
 *
 * Both halves come out of the SAME generators (CLO_NOSTITCH), so the only difference on
 * screen is the thing being judged.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own generators.
 *
 *   node tools/bohemia_fine_detail_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/fine-detail.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    /* label, worn layer, garment, facing, crop y0, y1 */
    const ROWS = [
      ['GLOVES',  'hands', 'LEATHER GLOVES', 'S', 0.56, 0.70],
      ['BELT',    'waist', 'LEATHER BELT',   'S', 0.44, 0.58],
      ['SCARF',   'neck',  'DUST SCARF',     'S', 0.22, 0.38],
      ['MASK',    'face',  'BONE DUST MASK', 'S', 0.12, 0.28],
    ];
    const keep = window.G_WORN;
    const frame = (lay, nm, d, old) => {
      window.G_WORN = { base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
      window.G_WORN[lay] = nm;
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(!!old);
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(false);
      return { px: f.px.slice(), W: f.CW };
    };
    const Z = 20, PAD = 20, LBL = 190, HDR = 126, X0 = 0.30, X1 = 0.70;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const cv = document.createElement('canvas');
    const hOf = r => Math.round(112 * (r[5] - r[4])) * Z / 2;
    cv.width = LBL + PAD + 2 * (cw + PAD);
    cv.height = HDR + ROWS.reduce((a, r) => a + hOf(r) + PAD, 0) + 56;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 26px monospace';
    cx.fillText('THE SMALL THINGS', PAD, 42);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('gloves had no knuckles, belts no stitching, scarves no weave.', PAD, 72);
    cx.fillText('none of it existed because 56 pixels had no row to put it in.', PAD, 94);
    cx.font = 'bold 15px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE', LBL + PAD, HDR - 10);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW', LBL + PAD + cw + PAD, HDR - 10);
    const blit = (fr, dx, dy, y0, y1) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
      const sy = Math.round(N * y0), sh = Math.round(N * (y1 - y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };
    let y = HDR;
    for (const r of ROWS) {
      const [label, lay, nm, d, y0, y1] = r;
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(label, PAD, y + 20);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText(nm.toLowerCase(), PAD, y + 38);
      blit(frame(lay, nm, d, true), LBL + PAD, y, y0, y1);
      blit(frame(lay, nm, d, false), LBL + PAD + cw + PAD, y, y0, y1);
      y += hOf(r) + PAD;
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('66 of your 200 clothes still have no fine detail. it was 102 yesterday morning.', PAD, cv.height - 30);
    cx.fillText('nothing you ruled on got thinner. these are marks that did not exist before.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
