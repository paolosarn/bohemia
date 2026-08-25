/* STRANDS IN THE HAIR (8/25/26, CHARACTER lane).
 *
 * Paolo, 8/25: "we made the character model 4x and i feel like with especially the hair
 * your still playing with the orignal pixels. not the pixels that are now 1 pixel
 * because we made the canvas 4x bigger you know."
 *
 * HE WAS RIGHT, and a number said he was wrong first. An edge-parity audit reported
 * 50.9% of hair edges on the fine grid, which reads as "already native". That number was
 * measuring the OUTLINE, and the outline is not the haircut. Measuring the INSIDE
 * instead: 9 of 15 canon styles had no one-pixel mark anywhere within their own
 * silhouette -- solid blocks of colour with a shaded rim and nothing in them.
 *
 *     thinnest internal feature, before:  SLICK BACK 8  BOWL CUT 8  SHAG 8
 *                                         LONG LOOSE 6  FRINGE 5   GREY WISPS 5
 *                                         BUZZ CUT 4    CROP 4     SHOULDER LENGTH 4
 *
 * genHair now runs a strand pass: a deterministic one-pixel parting every four cells
 * across the hair's own axis, seeded off the style name so an NPC never shimmers, and
 * skipped where the pixel is already the dark tone. 9/15 -> 0/15 with no mark;
 * 47 -> 820 one-pixel marks. Nothing was thinned and no silhouette moved.
 *
 * Both halves come out of the SAME generator (CLO_NOSTITCH), so the only difference on
 * screen is the thing being judged, and the row says so out loud when nothing differs.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own generators.
 *
 *   node tools/bohemia_hair_strand_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/hair-strands.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 1500 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    /* THE FOUR WORST OFFENDERS, front and side. Every one of these measured as a solid
       block: no strand, no parting, no break, at any size. */
    const ROWS = [
      ['SLICK BACK',       'S', 'was solid: thinnest mark 8 pixels'],
      ['BOWL CUT',         'S', 'was solid: thinnest mark 8 pixels'],
      ['SHOULDER LENGTH',  'S', 'was solid: thinnest mark 4 pixels'],
      ['TEMPLE TAPER',     'E', 'one you kept, seen from the side'],
    ];
    const keep = window.G_WORN, keepH = G.equipped.hair;
    const frame = (nm, d, old) => {
      window.G_WORN = { hair: nm, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      G.equipped.hair = '';
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(!!old);
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      if (window.CLO_SET_NOSTITCH) window.CLO_SET_NOSTITCH(false);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 20, PAD = 22, LBL = 210, HDR = 150;
    const X0 = 0.29, X1 = 0.71, Y0 = 0.03, Y1 = 0.27;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + 2 * (cw + PAD);
    cv.height = HDR + ROWS.length * (ch + PAD) + 62;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 28px monospace';
    cx.fillText('STRANDS IN THE HAIR', PAD, 44);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said the hair was still drawn in the old fat pixels. you were right.', PAD, 76);
    cx.fillText('9 of your 15 haircuts had nothing inside them at all: one flat colour,', PAD, 98);
    cx.fillText('a dark rim, and no strand, parting or break anywhere. now none are like that.', PAD, 120);
    cx.font = 'bold 15px monospace';
    cx.fillStyle = '#c98a6a'; cx.fillText('BEFORE', LBL + PAD, HDR - 8);
    cx.fillStyle = '#8fc07a'; cx.fillText('NOW', LBL + PAD + cw + PAD, HDR - 8);

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
    for (const [nm, d, note] of ROWS) {
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(nm.toLowerCase(), PAD, y + 22);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText(note, PAD, y + 42);
      /* NAME IT ONLY IF IT EXISTS -- a name that is not in the catalogue draws nothing
         and the row reads as an honest "the change did nothing". */
      if (!(window.GARMENTS || []).some(q => q.n === nm)) {
        cx.fillStyle = '#c05a4a'; cx.font = 'bold 12px monospace';
        cx.fillText('NOT IN THE CATALOGUE', PAD, y + 62); }
      /* THE TOOL MUST NOT BE ABLE TO SHOW A ROW WHERE NOTHING DIFFERS. Count the
         differing pixels INSIDE THE CROP and print it in red when it is zero. */
      const A = frame(nm, d, true), B = frame(nm, d, false);
      let diff = 0;
      { const N = A.W, sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
        const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
        for (let yy = sy; yy < sy + sh; yy++) for (let xx = sx; xx < sx + sw; xx++) {
          const a = A.px[yy * N + xx], b2 = B.px[yy * N + xx];
          if (!a !== !b2 || (a && b2 && (a[0] !== b2[0] || a[1] !== b2[1] || a[2] !== b2[2]))) diff++; } }
      if (!diff) { cx.fillStyle = '#c05a4a'; cx.font = 'bold 12px monospace';
        cx.fillText('NO DIFFERENCE IN THIS CROP', PAD, y + 80); }
      else { cx.fillStyle = '#6f6455'; cx.font = '12px monospace';
        cx.fillText(diff + ' pixels changed', PAD, y + 80); }
      blit(A, LBL + PAD, y);
      blit(B, LBL + PAD + cw + PAD, y);
      y += ch + PAD;
    }
    G.equipped.hair = keepH;
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('47 one-pixel marks across all the hair before. 820 now. nothing got thinner and no shape moved.', PAD, cv.height - 32);
    cx.fillText('the parting is worked out from the haircut name, so the same style is the same every time.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
