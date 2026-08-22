/* YOUR PAINTED CLOTHES WERE SHOWING THROUGH (8/21/26, CHARACTER lane).
 *
 * The hair blob he pointed at was one instance of a slot bug, not a hair bug. Audited
 * afterwards (tools/bohemia_pd_leak_audit.js), three more of his painted layers were
 * doing the same thing under a worn garment of the same slot:
 *     pants/leather-legwarmer  68 px through BLUE JEANS
 *     shoes/balenciaga         61 px through WHITE SNEAKERS
 *     jacket/japanese-fuzz     18 px through WASTELAND DUSTER
 * Smaller than the hair blob and in less obvious places, which is exactly why they
 * needed a picture rather than a number.
 *
 * BOTH HALVES COME OUT OF THE SAME CODE (CLO_KEEP_PD), so the only difference on screen
 * is the thing being judged rather than two different builds.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. His
 * painted layers are not edited -- one is not DRAWN while its slot is filled, and it
 * returns the moment the slot is empty. Never touches BAKED, a joint or a bone.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own render.
 *
 *   node tools/bohemia_slot_leak_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/slot-leak.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    /* the facing each leak is worst on, from the audit */
    const ROWS = [
      ['YOUR LEGWARMERS',  'legs',  'BLUE JEANS',       'S', 0.20, 0.55, 1.00],
      ['YOUR BALENCIAGAS', 'feet',  'WHITE SNEAKERS',   'S', 0.20, 0.72, 1.00],
      ['YOUR FUZZ HOODIE', 'outer', 'WASTELAND DUSTER', 'E', 0.18, 0.20, 0.72],
    ];
    const keep = window.G_WORN;
    const frame = (lay, nm, d, old) => {
      window.G_WORN = { hair: 'SUN CROP', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
      window.G_WORN[lay] = nm;
      window.CLO_KEEP_PD = !!old;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      window.CLO_KEEP_PD = false;
      return { px: f.px.slice(), W: f.CW };
    };
    const Z = 10, PAD = 20, LBL = 196, HDR = 126;
    const cv = document.createElement('canvas');
    const wOf = r => Math.round(112 * (0.78 - r[4])) * Z / 2;
    const hOf = r => Math.round(112 * (r[6] - r[5])) * Z / 2;
    cv.width = LBL + PAD + 2 * (wOf(ROWS[0]) + PAD);
    cv.height = HDR + ROWS.reduce((a, r) => a + hOf(r) + PAD, 0) + 58;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 26px monospace';
    cx.fillText('IT WAS NEVER JUST THE HAIR', PAD, 42);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('three more of your painted clothes were showing through', PAD, 72);
    cx.fillText('whatever you put on over them.', PAD, 94);
    cx.font = 'bold 15px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE', LBL + PAD, HDR - 10);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW', LBL + PAD + wOf(ROWS[0]) + PAD, HDR - 10);

    const blit = (fr, dx, dy, x0, y0, y1) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * x0), sw = Math.round(N * (0.78 - x0));
      const sy = Math.round(N * y0), sh = Math.round(N * (y1 - y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };
    let y = HDR;
    for (const r of ROWS) {
      const [label, lay, nm, d, x0, y0, y1] = r;
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(label, PAD, y + 20);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText('under ' + nm.toLowerCase(), PAD, y + 38);
      blit(frame(lay, nm, d, true), LBL + PAD, y, x0, y0, y1);
      blit(frame(lay, nm, d, false), LBL + PAD + wOf(r) + PAD, y, x0, y0, y1);
      y += hOf(r) + PAD;
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('147 stray pixels of your painted outfit across three slots. now zero.', PAD, cv.height - 30);
    cx.fillText('nothing of yours was edited, and with nothing worn you look exactly as painted.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
