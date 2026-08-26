/* IS A COAT STILL THE SAME COAT WHEN HE TURNS ROUND? (8/25/26, CHARACTER lane)
 *
 * Paolo, 8/25: "you just have to be intentional with the hairstyles making them looking
 * good and the same and coordinated from all angles."
 *
 * HE SAID IT ABOUT HAIR. IT IS NOT A FACT ABOUT HAIR. genHair branches on back/profile/
 * front and so does every other generator in the wardrobe -- genCoat has a hood branch
 * for N/NE/NW, genTop has a front-opening branch, genPants and genShoes both read the
 * facing. The hair audit found two of fifteen styles that were a mane from the front and
 * a crop from the side, hiding inside a green gate, and it found them on its first run.
 * NOTHING HAS EVER ASKED THE SAME QUESTION OF THE 200 GARMENTS.
 *
 * WHAT IS MEASURED, and the split is the whole method the hair audit proved out:
 *
 *   HEM      how far past the hips a garment falls, in body-heights. A duster is not a
 *            vest from any angle. This is the single strongest identity signal a
 *            garment has, and it is the one that was broken in hair.
 *   RISE     how far up the neck/shoulders it reaches, in body-heights.
 *   SLEEVE   how far down the arm it runs, as a fraction of the arm's own length. A
 *            long-sleeved coat with short sleeves from behind is the same bug.
 *   REACH    how far it stands off the body silhouette, in body-widths.
 *
 * All four describe THE OBJECT. Area does NOT -- a coat shows more of itself from the
 * front than in profile no matter how correct it is -- so area is printed and never
 * judged. Pinning a quantity that legitimately moves is exactly how the hair gate sat
 * green through a shoulder-length haircut rendering as a crop.
 *
 * AND THE RULER IS ONE NOTCH OF TURN, not max-minus-min: a hem that is genuinely lower
 * at the back than the front is a garment, not a defect. What must never happen is the
 * thing changing between two views a player sees back to back.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own generators.
 *
 *   node tools/bohemia_garment_identity_audit.js
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
    const SKIP = { hair: 1 };                 /* hair has its own audit and its own gate */
    const G2 = (window.GARMENTS || []).filter(g => g.st === 'canon' && !SKIP[g.layer]);
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = {}, layerOf = {};
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      /* the BODY, off the part grid -- his painted silhouette, never a guess */
      let bTop = 1e9, bBot = -1, bMn = 1e9, bMx = -1;
      let torsoBot = -1, torsoTop = 1e9;
      let armTop = 1e9, armBot = -1;
      const bodyCol = {};                      /* per row, the body's own left/right */
      for (let i = 0; i < f.grid.length; i++) { const gv = f.grid[i];
        if (!gv) continue;
        const x = i % f.CW, y = (i / f.CW) | 0;
        if (y < bTop) bTop = y; if (y > bBot) bBot = y;
        if (x < bMn) bMn = x; if (x > bMx) bMx = x;
        const r = bodyCol[y] || (bodyCol[y] = { a: 1e9, b: -1 });
        if (x < r.a) r.a = x; if (x > r.b) r.b = x;
        if (gv === 4) { if (y > torsoBot) torsoBot = y; if (y < torsoTop) torsoTop = y; }
        if (gv === 5 || gv === 6) { if (y < armTop) armTop = y; if (y > armBot) armBot = y; } }
      const bH = bBot - bTop + 1, bW = bMx - bMn + 1;
      const armH = Math.max(1, armBot - armTop + 1);
      for (const g of G2) {
        let o = null; try { o = g.gen(f.grid, f.CW, f.CH, { name: g.n }); } catch (e) {}
        if (!o || typeof o !== 'object') continue;
        let top = 1e9, bot = -1, n = 0, reach = 0, armReach = -1;
        for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
          if (y < top) top = y; if (y > bot) bot = y; n++;
          const r = bodyCol[y];
          if (r) { const e = Math.max(r.a - x, x - r.b); if (e > reach) reach = e; }
          const gv = f.grid[i];
          if ((gv === 5 || gv === 6) && y > armReach) armReach = y; }
        if (!n) continue;
        layerOf[g.n] = g.layer;
        (out[g.n] = out[g.n] || {})[d] = {
          hem:    Math.max(0, bot - torsoBot) / bH,
          rise:   Math.max(0, torsoTop - top) / bH,
          sleeve: armReach < 0 ? 0 : Math.max(0, armReach - armTop) / armH,
          reach:  Math.max(0, reach) / bW,
          area:   n,
        };
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { out, DIRS, layerOf, n: G2.length };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const { out, DIRS, layerOf } = R;
  const KEYS = ['hem', 'rise', 'sleeve', 'reach'];
  const rows = [];
  for (const n in out) {
    const per = out[n], notch = {}, span = {};
    for (const k of KEYS) {
      let g = 0, pair = '';
      for (let i = 0; i < DIRS.length; i++) {
        const a = per[DIRS[i]], c = per[DIRS[(i + 1) % DIRS.length]];
        if (!a || !c) continue;
        const j = Math.abs(a[k] - c[k]);
        if (j > g) { g = j; pair = DIRS[i] + '->' + DIRS[(i + 1) % DIRS.length]; }
      }
      notch[k] = g; span[k] = pair;
    }
    rows.push({ n, layer: layerOf[n], notch, span,
                worst: Math.max(...KEYS.map(k => notch[k])) });
  }
  rows.sort((a, c) => c.worst - a.worst);

  console.log('  IS A GARMENT THE SAME GARMENT FROM EVERY ANGLE?  ' + rows.length + ' canon garments, 8 facings.');
  console.log('  Scale-free, and every one of these describes THE OBJECT, never the view.');
  console.log('  Numbers are the biggest change across ONE NOTCH of turn. Area is not judged.\n');
  console.log('  garment                   layer      hem    rise  sleeve   reach   worst notch');
  for (const q of rows.slice(0, 24))
    console.log('  ' + q.n.slice(0, 24).padEnd(26) + (q.layer || '').padEnd(9) +
      q.notch.hem.toFixed(3).padStart(7) + q.notch.rise.toFixed(3).padStart(8) +
      q.notch.sleeve.toFixed(3).padStart(8) + q.notch.reach.toFixed(3).padStart(8) +
      ('  ' + q.span[KEYS.reduce((a, k) => q.notch[k] > q.notch[a] ? k : a, 'hem')]).padStart(14));
  if (rows.length > 24) console.log('  ... ' + (rows.length - 24) + ' more, all quieter than these.');

  console.log('');
  for (const k of KEYS) {
    const w = rows.reduce((a, c) => c.notch[k] > a.notch[k] ? c : a, rows[0]);
    const v = DIRS.filter(d => out[w.n][d]).map(d => [d, out[w.n][d][k]]);
    const lo = v.reduce((a, c) => c[1] < a[1] ? c : a), hi = v.reduce((a, c) => c[1] > a[1] ? c : a);
    console.log('  worst ' + k.toUpperCase().padEnd(7) + w.n.slice(0, 24).padEnd(26) +
      hi[0] + ' ' + hi[1].toFixed(3) + '   vs   ' + lo[0] + ' ' + lo[1].toFixed(3) +
      '   (one notch: ' + w.notch[k].toFixed(3) + ' at ' + w.span[k] + ')');
  }
  const tot = k => Math.max(...rows.map(r => r.notch[k]));
  console.log('\n  *** ONE NOTCH OF TURN, WORST ACROSS ALL ' + rows.length + ' GARMENTS: ' +
    KEYS.map(k => k + ' ' + tot(k).toFixed(3)).join('  ') + ' ***');
  const bad = rows.filter(r => r.worst >= 0.10);
  console.log('  ' + bad.length + ' garment(s) change by a tenth of the body or more in a single notch.');
})();
