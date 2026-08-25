/* HOW STRAIGHT IS THE HAIR, ACTUALLY? (8/21/26, CHARACTER lane)
 *
 * Paolo's craft law, clause 3, LOCKED 8/1:
 *   "a lot about hair is about just the little off shapes that it makes ... I'm
 *    seeing you make like a lot of straight lines and that's not realistic at all"
 *
 * The anti-straight-line wobble was built the same day and it works. But it hashes
 * the CELL row and moves by S, so now that the rig composes at 112 the hair edge
 * wobbles in 2x2 blocks -- the same silhouette as 56, drawn bigger. Four times the
 * pixels bought a SHARPER edge, not a FINER one, and his law's other clause says
 * exactly what finer means: "ONE PIXEL not three at 56px".
 *
 * THIS MEASURES THE THING THE LAW IS ABOUT, before anything is changed: walk each
 * hairstyle's silhouette and count STRAIGHT RUNS -- consecutive rows whose edge sits
 * at exactly the same x. A run of 2 at 112 is the floor and means nothing (a cell is
 * two rows tall, so even a perfectly wobbly edge repeats once). Runs of 4, 6, 8 are
 * the machine-drawn look he named.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It calls the alpha's own genHair over the
 * alpha's own posed body and counts edges; it draws nothing of its own.
 *
 *   node tools/bohemia_hair_straightness.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ALPHA = 'file://' + path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const R = await p.evaluate(() => {
    const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { rs: (typeof RIG_RS !== 'undefined' ? RIG_RS : 1), styles: [], hist: {}, rows: 0, longest: 0 };
    for (const h of HAIR) {
      let longest = 0, inLong = 0, rows = 0;
      out.perDir = out.perDir || {};
      for (const d of DIRS) {
        if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
        const f = buildFrame(d, 'idle', 0);
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        /* the hair's own left and right edge, per row */
        const L = {}, Rr = {};
        for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
          if (L[y] === undefined || x < L[y]) L[y] = x;
          if (Rr[y] === undefined || x > Rr[y]) Rr[y] = x; }
        for (const side of [L, Rr]) {
          const ys = Object.keys(side).map(Number).sort((a, b) => a - b);
          let run = 1;
          const pd = out.perDir[d] || (out.perDir[d] = { rows: 0, inLong: 0, longest: 0 });
          for (let n = 1; n <= ys.length; n++) {
            const cont = n < ys.length && ys[n] === ys[n - 1] + 1 && side[ys[n]] === side[ys[n - 1]];
            if (cont) run++;
            else { out.hist[run] = (out.hist[run] || 0) + 1; rows += run;
              pd.rows += run; if (run >= 4) pd.inLong += run;
              if (run > pd.longest) pd.longest = run;
              if (run > longest) longest = run;
              if (run >= 4) inLong += run;
              run = 1; }
          }
        }
      }
      out.styles.push({ n: h.n, longest, straightPct: rows ? +(100 * inLong / rows).toFixed(1) : 0, rows });
      out.rows += rows;
      if (longest > out.longest) out.longest = longest;
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return out;
  });
  await b.close();

  console.log('RIG_RS = ' + R.rs + '   (a cell is ' + R.rs + ' pixel row(s) tall, so a run of ' +
              R.rs + ' is the floor and means nothing)');
  console.log('\n  hairstyle              longest straight run   rows in runs of 4+');
  for (const s of R.styles.sort((a, b) => b.longest - a.longest))
    console.log('  ' + s.n.padEnd(22) + String(s.longest).padStart(12) + '        ' + (s.straightPct + '%').padStart(6));
  const tot = Object.values(R.hist).reduce((a, c) => a + c, 0);
  console.log('\n  RUN LENGTH HISTOGRAM (all styles, all 8 facings)');
  for (const k of Object.keys(R.hist).map(Number).sort((a, b) => a - b))
    console.log('    ' + String(k).padStart(2) + ' rows: ' + String(R.hist[k]).padStart(5) +
      '  ' + '#'.repeat(Math.round(60 * R.hist[k] / tot)));
  const long = Object.keys(R.hist).map(Number).filter(k => k >= 4).reduce((a, k) => a + R.hist[k] * k, 0);
  console.log('\n  PER FACING (this is where the number actually lives):');
  for (const d of ['S','SE','E','NE','N','NW','W','SW']) { const q = R.perDir[d]; if (!q) continue;
    console.log('    ' + d.padEnd(4) + (100 * q.inLong / Math.max(1,q.rows)).toFixed(1).padStart(6) +
      '%  in runs of 4+, longest ' + q.longest); }
  console.log('\n  ' + (100 * long / R.rows).toFixed(1) + '% of all edge rows sit in a straight run of 4 or more.');
  console.log('  longest straight edge anywhere: ' + R.longest + ' rows.');
})();
