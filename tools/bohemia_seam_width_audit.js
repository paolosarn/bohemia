/* IS THE FINEST LINE IN A GARMENT STILL ONE PIXEL? (8/22/26, CHARACTER lane)
 *
 * Row 2X step 5. The rig composes at 112 now, and the border fix of 8/16 is the shape
 * of the whole problem: the outline was 2px on screen purely because it was derived
 * BEFORE the upscale, and moving it after took it to 1px. Everybody could see the
 * difference and Paolo asked for it by name.
 *
 * EVERY OTHER FINE LINE ON A GARMENT HAS THE SAME QUESTION HANGING OVER IT. A seam, a
 * stitch line, a zip, a cuff edge, a buttonhole: at 56 those are one pixel because one
 * pixel is all there is. If the generator draws them S wide, then at 112 they are TWO
 * pixels -- the same line, twice as thick relative to the body, which reads CHUNKIER
 * rather than sharper. Four times the pixels would have bought coarser tailoring.
 *
 * WHAT THIS MEASURES, and it is deliberately narrow: for every canon garment, the
 * THINNEST distinct-colour run it draws, at 56 and at 112. A garment whose thinnest
 * mark is 1 cell at 56 and 1 PIXEL at 112 is authoring fine detail. One whose thinnest
 * mark doubles to 2 has simply been scaled up.
 *
 * NOT EVERY THICK LINE IS A DEFECT, and this is why the tool reports rather than
 * judges: a waistband, a boot sole and a lapel are genuinely thick, and they SHOULD
 * scale. The signal is a garment whose THINNEST mark -- its finest detail, whatever
 * that is -- has no 1px feature at all at 112.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It calls the alpha's own generators over the
 * alpha's own posed body and counts run widths.
 *
 *   node tools/bohemia_seam_width_audit.js
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
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const DIRS = ['S', 'E', 'N'];
    const rs = (typeof RIG_RS !== 'undefined' ? RIG_RS : 1);

    /* the thinnest horizontal run of a single colour that has a DIFFERENT colour on both
       sides -- that is what a seam, a stitch line or a zip looks like in the output */
    const thinnest = (o, CW) => {
      const rows = {};
      for (const k in o) { const i = +k, y = (i / CW) | 0; (rows[y] = rows[y] || []).push(i % CW); }
      let min = 99, count1 = 0, tot = 0;
      for (const y in rows) {
        const xs = rows[y].sort((a, c) => a - c);
        let s = 0;
        for (let n = 1; n <= xs.length; n++) {
          const cont = n < xs.length && xs[n] === xs[n-1] + 1 &&
            o[y * CW + xs[n]].join() === o[y * CW + xs[s]].join();
          if (cont) continue;
          const w = n - s;
          /* a run is a SEAM only if something different sits on both sides of it */
          const L = o[y * CW + xs[s] - 1], Rr = o[y * CW + xs[n-1] + 1];
          const bounded = (L && L.join() !== o[y * CW + xs[s]].join()) &&
                          (Rr && Rr.join() !== o[y * CW + xs[s]].join());
          if (bounded) { tot++; if (w < min) min = w; if (w === 1) count1++; }
          s = n;
        }
      }
      return { min: min === 99 ? null : min, count1, tot };
    };

    const out = [];
    for (const g of CANON) {
      if (g.layer === 'hair') continue;   /* hair got its sub-cell pass on 8/21 */
      let worst = null;
      for (const d of DIRS) {
        if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
        const f = buildFrame(d, 'idle', 0);
        let o = null; try { o = g.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        const t = thinnest(o, f.CW);
        if (t.min === null) continue;
        if (!worst || t.min > worst.min) worst = { d, ...t };
      }
      if (worst) out.push({ n: g.n, layer: g.layer, ...worst });
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { rs, out };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  console.log('  RIG_RS = ' + R.rs + '. A garment authoring fine detail has 1-pixel seams at 112.');
  console.log('  "thinnest" = the narrowest colour run with a different colour on BOTH sides,');
  console.log('  taken as the WORST of three facings (a garment is only as fine as its coarsest view).\n');
  const byLayer = {};
  for (const q of R.out) (byLayer[q.layer] = byLayer[q.layer] || []).push(q);
  let none = 0;
  console.log('  layer     garments   have a 1px seam   thinnest is 2px+   worst example');
  for (const L of Object.keys(byLayer).sort()) {
    const g = byLayer[L];
    const fine = g.filter(q => q.count1 > 0).length;
    const coarse = g.filter(q => q.min >= 2);
    none += coarse.length;
    const ex = coarse.sort((a, c) => c.min - a.min)[0];
    console.log('  ' + L.padEnd(10) + String(g.length).padStart(6) + String(fine).padStart(16) +
      String(coarse.length).padStart(19) + '   ' + (ex ? ex.n + ' (' + ex.min + 'px, ' + ex.d + ')' : '-'));
  }
  console.log('\n  ' + none + ' of ' + R.out.length + ' canon garments have NO one-pixel detail at all.');
})();
