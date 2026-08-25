/* IS EVERY HAIRSTYLE THE SAME HAIRSTYLE IN PROFILE? (8/25/26, CHARACTER lane)
 *
 * Paolo, round 4, 8/20: "east and west hairstyles look like absolute dog shit across
 * the board." He killed 13 of 15 judged. ACROSS THE BOARD means one render defect
 * judged thirteen times, not thirteen taste calls.
 *
 * Two profile defects were found and fixed on 8/21 -- his painted bob leaking a
 * near-white blob over the forehead in every style, and the fade stopping halfway down
 * the skull. Both were real, both were profile-only, and neither has been checked
 * against the thing he actually complained about.
 *
 * THE HYPOTHESIS THIS TESTS, and it comes from looking at the current build side by
 * side: in SOUTH the fifteen styles are obviously different haircuts. In EAST and WEST
 * they look like the same dark dome. If that is true it is the whole finding, because
 * a judge looking at fifteen identical blobs correctly kills them.
 *
 * HOW IT IS MEASURED, and it is the same ruler the faction outfits were chosen with:
 * a WIDTH PROFILE of the hair's own silhouette -- 16 samples down the head, normalised
 * by span and max width, so COLOUR AND SIZE ARE DISCARDED and only shape remains. The
 * distance between two styles is the mean absolute difference of those profiles. Then:
 *   for each facing, the mean and worst pairwise distance across all 105 pairs.
 * A facing where the numbers collapse is a facing where the styles have stopped being
 * different from each other.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own render.
 *
 *   node tools/bohemia_profile_distinctness.js
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
    const HAIR = CANON.filter(g => g.layer === 'hair');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const SAMPLES = 16;

    /* THE HAIR'S OWN SILHOUETTE, as a width profile. Colour and absolute size are
       thrown away on purpose: two styles that differ only in ramp are the SAME SHAPE,
       and STRUCTURE-NOT-COLOR says a recolour is not a new garment. */
    const profileOf = (o, CW) => {
      const rows = {};
      let y0 = 1e9, y1 = -1;
      for (const k in o) { const i = +k, y = (i / CW) | 0, x = i % CW;
        const r = rows[y] || (rows[y] = { a: 1e9, b: -1 });
        if (x < r.a) r.a = x; if (x > r.b) r.b = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (y1 < y0) return null;
      const H = y1 - y0 + 1;
      const w = [];
      let mx = 0;
      for (let s = 0; s < SAMPLES; s++) {
        const y = y0 + Math.min(H - 1, Math.floor(s * H / SAMPLES));
        const r = rows[y];
        const ww = r ? (r.b - r.a + 1) : 0;
        w.push(ww); if (ww > mx) mx = ww;
      }
      return mx ? w.map(v => v / mx) : null;
    };

    const out = [];
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      const profs = [];
      for (const h of HAIR) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        const pr = profileOf(o, f.CW);
        if (pr) profs.push({ n: h.n, pr });
      }
      let sum = 0, n = 0, worst = 9, worstPair = '';
      const dead = [];
      for (let i = 0; i < profs.length; i++) for (let j = i + 1; j < profs.length; j++) {
        let dsum = 0;
        for (let s = 0; s < SAMPLES; s++) dsum += Math.abs(profs[i].pr[s] - profs[j].pr[s]);
        const dist = dsum / SAMPLES;
        sum += dist; n++;
        if (dist < worst) { worst = dist; worstPair = profs[i].n + ' / ' + profs[j].n; }
        if (dist < 0.02) dead.push(profs[i].n + '/' + profs[j].n);
      }
      out.push({ d, styles: profs.length, pairs: n, mean: sum / Math.max(1, n), worst, worstPair,
                 dead: dead.length });
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return out;
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  console.log('  HOW DIFFERENT ARE THE FIFTEEN HAIRSTYLES FROM EACH OTHER, PER FACING?');
  console.log('  Shape only: colour and size discarded. Higher is more distinct.\n');
  console.log('  facing  styles  pairs   mean apart   closest pair   pairs under 0.02');
  for (const q of R) console.log('  ' + q.d.padEnd(8) + String(q.styles).padStart(5) +
    String(q.pairs).padStart(7) + q.mean.toFixed(4).padStart(13) +
    q.worst.toFixed(4).padStart(15) + String(q.dead).padStart(17));
  const s = R.find(q => q.d === 'S'), e = R.find(q => q.d === 'E'), w = R.find(q => q.d === 'W');
  if (s && e && w) {
    console.log('\n  SOUTH is the view he KEPT two styles from. EAST/WEST is the view he called');
    console.log('  dog shit across the board.');
    console.log('  east  is ' + (e.mean / s.mean * 100).toFixed(0) + '% as distinct as south.');
    console.log('  west  is ' + (w.mean / s.mean * 100).toFixed(0) + '% as distinct as south.');
    console.log('  closest pair in south: ' + s.worstPair + '  (' + s.worst.toFixed(4) + ')');
    console.log('  closest pair in east : ' + e.worstPair + '  (' + e.worst.toFixed(4) + ')');
  }
})();
