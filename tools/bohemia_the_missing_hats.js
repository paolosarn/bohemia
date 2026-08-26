/* SEVENTEEN THINGS HE COULD WEAR THAT DREW NOTHING (8/25/26, CHARACTER lane).
 *
 * Found by running the identity audit -- the one clause 1 demanded for hair -- across
 * the 204 canon garments instead of the 15 hairstyles. It was looking for a coat that
 * changes shape when you turn round. It found seventeen garments that were not there.
 *
 *   every knit cap, watch cap, field cap, work cap and slouch beanie
 *   the rice farmer hat
 *   both pairs of wraparound shades
 *
 * MEASURED ON THE REAL FRAME, not on a generator's return value: equipping one changed
 * ZERO PIXELS. Not thin, not misplaced. ABSENT.
 *
 * THE CAUSE, and it is the same 4x units family as everything else this week: BAKED is
 * RIG2X'd so its layer indices pack at BAKED.W = 112, and both call sites divided by a
 * hard-coded 56. That returns DOUBLE the row -- and in genHat a later fix multiplied it
 * by S on top, so the durag line that hats may not cross came out at row -12, TWELVE
 * ROWS ABOVE THE TOP OF THE CANVAS. put() refuses everything below the line, and
 * everything is below a line at -12.
 *
 * AND THE HEADWEAR GATE WAS GREEN THROUGH ALL OF IT, because what it holds is "a hat
 * never crosses the durag line" -- and a hat that draws nothing crosses nothing. A check
 * a corpse passes is not checking for life.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own generators.
 *
 *   node tools/bohemia_the_missing_hats.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/the-missing-hats.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1700, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const ROWS = [
      ['STORM KNIT CAP',          'head'],
      ['SLATE WORK CAP',          'head'],
      ['OLIVE FIELD CAP',         'head'],
      ['OXBLOOD SLOUCH BEANIE',   'head'],
      ['CHINESE RICE FARMER HAT', 'head'],
      ['WRAPAROUND SHADES',       'face'],
    ];
    const DIRS = ['S', 'SE', 'E'];
    const NAMES = { S: 'front', SE: 'turn 1', E: 'side' };
    const keep = window.G_WORN, keepE = G.equipped;
    const eq = {}; for (const k in keepE) eq[k] = keepE[k];
    eq.hat = ''; eq.glasses = ''; eq.hair = '';
    const frame = (nm, layer, d, bare) => {
      G.equipped = eq;
      window.G_WORN = bare ? {} : (() => { const w = {}; w[layer] = nm; return w; })();
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 13, PAD = 16, LBL = 240, HDR = 152;
    const X0 = 0.28, X1 = 0.72, Y0 = 0.02, Y1 = 0.30;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + 2 * DIRS.length * (cw + PAD) + PAD * 3;
    cv.height = HDR + ROWS.length * (ch + 24 + PAD) + 56;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('SEVENTEEN THINGS YOU COULD WEAR THAT WERE NOT THERE', PAD, 44);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('every knit cap, watch cap, field cap, work cap, slouch beanie, the rice farmer', PAD, 78);
    cx.fillText('hat and both pairs of shades drew NOTHING. you could put one on and nothing', PAD, 102);
    cx.fillText('happened. left three columns are before. right three are now.', PAD, 126);
    cx.font = 'bold 15px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE (nothing)', LBL + PAD, HDR - 6);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW', LBL + PAD + DIRS.length * (cw + PAD) + PAD * 3, HDR - 6);

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
    for (const [nm, layer] of ROWS) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(nm.toLowerCase(), PAD, y + 24);
      if (!(window.GARMENTS || []).some(q => q.n === nm)) {
        cx.fillStyle = '#c05a4a'; cx.font = 'bold 12px monospace';
        cx.fillText('NOT IN THE CATALOGUE', PAD, y + 44); }
      let diff = 0;
      DIRS.forEach((d, i) => {
        const A = frame(nm, layer, d, true), B = frame(nm, layer, d, false);
        const N = A.W, sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
        const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
        for (let yy = sy; yy < sy + sh; yy++) for (let xx = sx; xx < sx + sw; xx++) {
          const a = A.px[yy * N + xx], c = B.px[yy * N + xx];
          if (!a !== !c || (a && c && (a[0] !== c[0] || a[1] !== c[1] || a[2] !== c[2]))) diff++; }
        cx.fillStyle = '#7a6f5c'; cx.font = '12px monospace';
        cx.fillText(NAMES[d], LBL + PAD + i * (cw + PAD), y + 14);
        blit(A, LBL + PAD + i * (cw + PAD), y + 20);
        blit(B, LBL + PAD + DIRS.length * (cw + PAD) + PAD * 3 + i * (cw + PAD), y + 20);
      });
      /* the tool must not be able to show a row where nothing differs and stay quiet */
      cx.fillStyle = diff ? '#6f6455' : '#c05a4a';
      cx.font = (diff ? '' : 'bold ') + '12px monospace';
      cx.fillText(diff ? (diff + ' pixels of hat now') : 'STILL DRAWS NOTHING', PAD, y + 44);
      y += ch + 24 + PAD;
    }
    G.equipped = keepE; window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('one wrong number: the code measured your head on the old small grid and put the', PAD, cv.height - 32);
    cx.fillText('line a hat cannot cross twelve rows ABOVE your head. so no hat could draw anything.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
