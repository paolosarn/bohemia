/* HAIR GOES TO REFERENCE FIRST, ALL EIGHT DIRECTIONS (8/27/26, CHARACTER lane).
 *
 * Paolo, 8/25 (THE PLAYTEST DISPATCH, item 3): hair goes to reference first, all 8
 * directions, before another cook.
 * Paolo, 8/27: "U HAVE TO FIX THE FOREHEAD SHIT YOU GOT THE FOREHEAD ALL WRONG EAST AND
 * WEST ... MOST HAIRS EAST AND WEST ARE JUST LIKE A SINGLE LINE GOING DOWN ... AFTER THE
 * HEAD THERES NOTHING UNTIL THE SHOULDERS FACING NORTH AND SOUTH."
 *
 * *** THIS TOOL EXISTS BECAUSE MY NUMBERS SAID HE WAS WRONG. ***
 * A measurement pass over all fifteen canon styles reported: zero bare forehead in
 * profile, a median row eleven pixels wide, and one break in forty-five style/facing
 * pairs. Every one of those readings contradicted him. That has now happened enough
 * times in this lane to be a rule rather than a coincidence -- the 8/25 edge-parity
 * audit read 50.9% "already native" while nine of fifteen styles were solid blocks,
 * because it was measuring the OUTLINE and the shape is the INSIDE.
 * SO THE PICTURE COMES FIRST AND THE NUMBER SECOND. Whatever is wrong here is
 * something a person sees and a bounding box does not.
 *
 * WHAT IT DRAWS: every canon style down the page, five facings across (W and the two
 * western diagonals are mirrors of E/SE/NE and would only make the sheet wider), the
 * head and shoulders at 4x so a one-pixel mark is legible, and the hairless head in the
 * first column so the hairline has something to be a hairline AGAINST.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: buildFrame (read-only)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every head is the alpha's own render.
 *
 *   node tools/bohemia_hair_reference_sheet.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/hair-reference.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N'];
    const keepW = window.G_WORN, keepE = G.equipped;
    const shot = (dir, hairName) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
      G.equipped = eq;
      window.G_WORN = { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', hair: hairName };
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      return buildFrame(dir, 'idle', 0);
    };

    /* THE CROP IS MEASURED OFF THE BALD HEAD, ONCE, AND USED FOR EVERY CELL.
       Cropping each cell to its own hair would hide the exact thing being judged:
       a haircut that stops early would be re-framed to look full. Same window on
       every style so they can be compared to each other and to the bare skull. */
    const ref = shot('S', '');
    const N = ref.CW;
    let hy0 = 1e9, hy1 = -1, hx0 = 1e9, hx1 = -1;
    for (let i = 0; i < N * N; i++) { const g = ref.grid[i];
      if (g === 1 || g === 2) { const x = i % N, y = (i / N) | 0;
        if (y < hy0) hy0 = y; if (y > hy1) hy1 = y; if (x < hx0) hx0 = x; if (x > hx1) hx1 = x; } }
    const CX = (hx0 + hx1) / 2;
    const SW = 44, SH = 46;                       /* head + a shoulder's worth of neck */
    const sx0 = Math.round(CX - SW / 2), sy0 = hy0 - 6;

    const Z = 4, PAD = 10, LBL = 132, HDR = 150;
    const cw = SW * Z, ch = SH * Z;
    const cv = document.createElement('canvas');
    cv.width = LBL + (DIRS.length + 1) * (cw + PAD) + PAD;
    cv.height = HDR + HAIR.length * (ch + 22) + 40;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 28px monospace';
    cx.fillText('EVERY HAIRCUT, EVERY WAY HE TURNS', PAD, 42);
    cx.font = '16px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('the first column is the same head with no hair on it, so the hairline has', PAD, 76);
    cx.fillText('something to be a hairline against. W, SW and NW are mirrors of E, SE and NE.', PAD, 98);

    cx.font = 'bold 15px monospace'; cx.fillStyle = '#8fc07a';
    cx.fillText('BALD', LBL + PAD, HDR - 12);
    DIRS.forEach((d, i) => cx.fillText(d, LBL + (i + 1) * (cw + PAD) + PAD, HDR - 12));

    const blit = (fr, dx, dy) => {
      const im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, sx0, sy0, SW, SH, dx, dy, cw, ch);
    };

    HAIR.forEach((h, r) => {
      const y = HDR + r * (ch + 22);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(h.n.toLowerCase(), PAD, y + 22);
      cx.fillStyle = '#6f6455'; cx.font = '12px monospace';
      const m = /side:([\d.]+)/.exec(String(h.gen));
      cx.fillText('side ' + (m ? m[1] : '?'), PAD, y + 40);
      /* the bald head, redrawn per row so the eye compares side by side */
      blit(shot('S', ''), LBL + PAD, y);
      DIRS.forEach((d, i) => blit(shot(d, h.n), LBL + (i + 1) * (cw + PAD) + PAD, y));
    });

    window.G_WORN = keepW; G.equipped = keepE;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
