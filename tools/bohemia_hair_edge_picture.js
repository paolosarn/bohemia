/* THE HAIR EDGE, BEFORE AND AFTER (8/21/26, CHARACTER lane).
 *
 * Paolo's craft law, clause 3, LOCKED 8/1:
 *   "a lot about hair is about just the little off shapes that it makes ... I'm
 *    seeing you make like a lot of straight lines and that's not realistic at all"
 *
 * The anti-straight-line wobble has worked since 8/1, but it steps by a whole CELL,
 * so when the rig went to 112 the hair edge kept moving in 2x2 blocks: a sharper
 * edge, not a finer one. Measured before the change, 50.7% of all hair edge rows sat
 * in a straight run of FOUR OR MORE, with 16-row straight edges. After: 18.5%, and
 * the longest straight edge anywhere is 6.
 *
 * THIS DRAWS BOTH, BIG, SO THE CLAIM CAN BE LOOKED AT RATHER THAN BELIEVED. The
 * "before" is not a stored screenshot -- it is the SAME generator called with the
 * sub-step disabled, so the only difference on screen is the thing being judged.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own genHair over
 * the alpha's own posed body; this tool arranges, labels and zooms.
 *
 *   node tools/bohemia_hair_edge_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/hair-edge.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1500 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    /* THE TWO WORST OFFENDERS BY MEASUREMENT, not by eye: TEMPLE TAPER and BOWL CUT
       both had 16-row straight edges before the change. */
    const NAMES = ['TEMPLE TAPER', 'BOWL CUT', 'SUN CROP'];
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const hairs = NAMES.map(n => CANON.filter(g => g.n === n)[0]).filter(Boolean);
    const body = CANON.filter(g => ['WHITE TEE', 'BLUE JEANS', 'BROWN BOOTS'].indexOf(g.n) >= 0);

    const frame = (h, flat) => {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
      if (window.CLO_SET_NOSUB) window.CLO_SET_NOSUB(flat);
      const f = buildFrame('S', 'idle', 0);
      const px = f.px.slice();
      for (const g of body.concat([h])) { let o = null;
        try { o = g.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (o) for (const k in o) px[+k] = o[k]; }
      if (window.CLO_SET_NOSUB) window.CLO_SET_NOSUB(false);
      return { px, W: f.CW };
    };

    const PAD = 24, LBL = 168, HDR = 132, Z = 16;   /* each rig pixel ~8 screen px: the mark being judged is ONE pixel wide */
    const CROP = { x0: 0.30, x1: 0.70, y0: 0.04, y1: 0.25 };
    const cw = Math.round(112 * (CROP.x1 - CROP.x0)) * Z / 2;
    const ch = Math.round(112 * (CROP.y1 - CROP.y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + cw + PAD + cw + PAD;
    cv.height = HDR + hairs.length * (ch + PAD) + 64;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 29px monospace';
    cx.fillText('THE HAIR STOPPED BEING STRAIGHT', PAD, 42);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said hair is little off shapes, not straight lines.', PAD, 72);
    cx.fillText('the head has 4x the pixels now, so the edge moves by ONE of them.', PAD, 94);
    cx.font = 'bold 17px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE', LBL + PAD, HDR - 10);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW', LBL + PAD + cw + PAD, HDR - 10);

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
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 16px monospace';
      cx.fillText(h.n, PAD, y + 24);
      blit(frame(h, true), LBL + PAD, y);
      blit(frame(h, false), LBL + PAD + cw + PAD, y);
      y += ch + PAD;
    }
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('half of every hair edge used to run straight for 4 rows or more, some for 16.', PAD, cv.height - 34);
    cx.fillText('now 18.5%, longest 6. your painted head is untouched.', PAD, cv.height - 16);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
