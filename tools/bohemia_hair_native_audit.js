/* IS THE HAIR STILL DRAWN IN OLD-SIZE PIXELS? (8/25/26, CHARACTER lane)
 *
 * Paolo, 8/25: "we made the character model 4x and i feel like with especially the hair
 * your still playing with the orignal pixels. not the pixels that are now 1 pixel
 * because we made the canvas 4x bigger you know."
 *
 * HE IS RIGHT AND THIS MEASURES HOW RIGHT. The rig composes at 112. A generator that
 * thinks in the old 56 grid moves every edge in TWO-PIXEL STEPS, so its shape can only
 * ever land on even boundaries -- the canvas got four times the pixels and the haircut
 * still cannot use the ones in between. The 8/21 sub-cell pass gave the WOBBLE a
 * one-pixel step; it did not touch the mass, the taper, the volume, the side extent or
 * the fade, and those are the shape.
 *
 * THE MEASUREMENT, and it is deliberately blunt: for every canon style on every facing,
 * take the hair's own left and right edge on each row, and ask what fraction of those
 * edges sit on an ODD pixel. A shape drawn in old-size chunks can only land on even
 * boundaries, so it scores near zero. A shape drawn in the pixels we actually have uses
 * both, so it scores near half.
 *
 *   ODD-EDGE SHARE   ~0%   every edge is cell-aligned: old pixels, scaled up
 *                    ~50%  the shape uses the real grid
 *
 * WHAT THIS IS NOT: a demand that hair be noisy. Cell-aligned is not automatically
 * wrong -- a crown that happens to land on an even column is fine. It is the SHARE
 * across thousands of edges that tells you whether the generator can express a
 * one-pixel move at all, and a generator that never does cannot.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own generators.
 *
 *   node tools/bohemia_hair_native_audit.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const R = await p.evaluate(() => {
    const H = (window.GARMENTS || []).filter(g => g.st === 'canon' && g.layer === 'hair');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const rs = (typeof RIG_RS !== 'undefined' ? RIG_RS : 1);
    const per = {}, byDir = {};
    let odd = 0, tot = 0;
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      let dOdd = 0, dTot = 0;
      for (const h of H) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        const L = {}, Rr = {};
        for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
          if (L[y] === undefined || x < L[y]) L[y] = x;
          if (Rr[y] === undefined || x > Rr[y]) Rr[y] = x; }
        let sOdd = 0, sTot = 0;
        for (const y in L) { sTot += 2; if (L[y] % 2) sOdd++; if (Rr[y] % 2) sOdd++; }
        const e = per[h.n] || (per[h.n] = { odd: 0, tot: 0 });
        e.odd += sOdd; e.tot += sTot;
        odd += sOdd; tot += sTot; dOdd += sOdd; dTot += sTot;
      }
      byDir[d] = { odd: dOdd, tot: dTot };
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { rs, odd, tot, per, byDir, styles: H.length };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  console.log('  RIG_RS = ' + R.rs + '.  An edge on an ODD pixel is a move the old 56 grid could not make.');
  console.log('  ~0% means the haircut is still drawn in old-size chunks. ~50% means it uses the real grid.\n');
  console.log('  hairstyle              odd edges   share');
  const rows = Object.keys(R.per).map(n => [n, R.per[n]]).sort((a, c) => (a[1].odd / a[1].tot) - (c[1].odd / c[1].tot));
  for (const [n, e] of rows)
    console.log('  ' + n.padEnd(22) + (e.odd + '/' + e.tot).padStart(11) +
      (100 * e.odd / Math.max(1, e.tot)).toFixed(1).padStart(8) + '%');
  console.log('\n  per facing:');
  for (const d in R.byDir) { const e = R.byDir[d];
    console.log('    ' + d.padEnd(4) + (100 * e.odd / Math.max(1, e.tot)).toFixed(1).padStart(6) + '%'); }
  console.log('\n  *** ALL ' + R.styles + ' STYLES, ALL 8 FACINGS: ' +
    (100 * R.odd / Math.max(1, R.tot)).toFixed(1) + '% of hair edges sit on a pixel the old grid could reach. ***');
})();
