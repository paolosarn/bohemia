/* THE BOX, SO HE CAN LOOK AT IT (8/20/26).
 *
 * Row 2X has owed one thing since 8/14 and never drawn it. Its own judgeable,
 * verbatim: "a side-by-side of the same character before/after at the same
 * display size ... YES -- the before/after pair is the judgeable".
 *
 * WHY IT MATTERS MORE THAN THE REPORT NEXT TO IT. The 112 flip is built, proved
 * and switched off for exactly one reason: composing natively removes the corner
 * rounding Scale2x was manufacturing, so his head reads as a box, and that walks
 * into his own LOCKED law "no straight lines". That is a real finding. It is also
 * a JUDGEMENT dressed as a fact -- I decided the box was unacceptable on his
 * behalf, and the whole 4x headline he asked for twice has been parked on my
 * opinion of pixels he has never been shown.
 *
 *   LEFT   what he sees today: 56 art, Scale2x to 112, corners rounded for free
 *   RIGHT  native 112: the same art, block-doubled, no invented roundness
 *
 * Same body, same pose, same display size, same clothes. The only difference is
 * whether an upscaler is guessing at his corners.
 *
 * MEASURED ALONGSIDE (tools/bohemia_2x_box_measure.js): the two differ on 5.9% of
 * the lit body, 11% of that on the head, and how much of it is HIS to repaint
 * depends on how dressed he is -- 90% bare, 60% everyday, 48% fully kitted, because
 * every garment pixel is code that can be authored round for free.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. It
 * never touches BAKED, a joint, a bone or a painted pixel; both halves come out of
 * the alpha's own buildFrame and the alpha's own Scale2x.
 *   built on: BAKED (read-only, via buildFrame)
 *   joints: none named       parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own rendered
 * character; this tool arranges, labels and zooms.
 *
 *   node tools/bohemia_2x_box_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/the-box.png');

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1100, height: 1500 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && typeof Scale2x !== 'undefined', { timeout: 30000 });

  const png = await pg.evaluate(() => {
    const same = (a, b) => (!a && !b) ? true : (!a || !b) ? false : (a[0] === b[0] && a[1] === b[1] && a[2] === b[2]);
    /* THE FIT HE ACTUALLY WEARS. A naked rig is the worst case and nobody in the
       game is naked; showing him a body with no clothes would overstate the
       problem, which is the opposite of the mistake this picture exists to fix. */
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const pick = n => CANON.filter(g => g.n === n)[0];
    const hair = CANON.filter(g => g.layer === 'hair')[0];
    const worn = [pick('WHITE TEE'), pick('BLUE JEANS'), pick('BROWN BOOTS'), hair].filter(Boolean);

    const grab = (d) => {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      const W = f.CW, H = f.CH;
      const px = f.px.slice();
      for (const g of worn) { let o = null; try { o = g.gen(f.grid, W, H); } catch (e) {}
        if (o) for (const k in o) px[+k] = o[k]; }
      const A = Scale2x.scale2x(px, W, H, same).data;             /* today */
      const N = W * 2, B = new Array(N * N).fill(null);           /* native 112 */
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = px[y * W + x];
        B[(y*2)*N + x*2] = c; B[(y*2)*N + x*2+1] = c; B[(y*2+1)*N + x*2] = c; B[(y*2+1)*N + x*2+1] = c; }
      return { A, B, N };
    };

    const ROWS = [
      ['THE HEAD',   'S',  0.06, 0.34, 8],   /* the thing the whole blocker is about */
      ['IN PROFILE', 'E',  0.06, 0.34, 8],
      ['FROM BEHIND','N',  0.06, 0.34, 8],
      ['ALL OF HIM', 'S',  0.05, 0.98, 3],
    ];
    const PAD = 22, LBL = 150, HDR = 128;
    const wOf = r => Math.round(112 * 0.55) * r[4] / 2;
    const hOf = r => Math.round(112 * (r[3] - r[2])) * r[4] / 2;

    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + wOf(ROWS[0]) + PAD + wOf(ROWS[0]) + PAD;
    cv.height = HDR + ROWS.reduce((a, r) => a + hOf(r) + PAD, 0) + 62;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('IS THIS A DEALBREAKER?', PAD, 42);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you looked at this and said it looks exactly the same. you were right,', PAD, 72);
    cx.fillText('so the right column shipped. left is every build before 8/20.', PAD, 94);
    cx.font = 'bold 17px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE', LBL + PAD, HDR - 10);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW, SHIPPED', LBL + PAD + wOf(ROWS[0]) + PAD, HDR - 10);

    const blit = (buf, N, dx, dy, y0, y1, z) => {
      const im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = buf[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = N; t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * 0.22), sw = Math.round(N * 0.55);
      const sy = Math.round(N * y0), sh = Math.round(N * (y1 - y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * z / 2, sh * z / 2);
    };

    let y = HDR;
    for (const r of ROWS) {
      const [label, dir, y0, y1, z] = r;
      const g = grab(dir);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 17px monospace';
      cx.fillText(label, PAD, y + 24);
      /* THE COLUMNS ARE FIXED, NOT PER-ROW. Sizing the second column off the row's
         own zoom put the whole-body pair under the "TODAY" heading, which is a
         picture that lies about which half is which. */
      const COL = wOf(ROWS[0]), ind = Math.round((COL - wOf(r)) / 2);
      blit(g.A, g.N, LBL + PAD + ind, y, y0, y1, z);
      blit(g.B, g.N, LBL + PAD + COL + PAD + ind, y, y0, y1, z);
      y += hOf(r) + PAD;
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('they differ on 5.9% of him and you could not see it, which is the whole answer.', PAD, cv.height - 34);
    cx.fillText('the character is four times the pixels now. the border is one true pixel.', PAD, cv.height - 16);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await browser.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
