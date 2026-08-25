/* IS A HAIRCUT STILL THE SAME HAIRCUT WHEN THE HEAD TURNS? (8/25/26, CHARACTER lane)
 *
 * Paolo, 8/25: "you just have to be intentional with the hairstyles making them looking
 * good and the same and coordinated from all angles."
 *
 * CLAUSE 1 of laws/BOHEMIA_LAW_HAIR_AT_FOUR_TIMES_THE_PIXELS_8_25_26.md. A hairstyle is
 * not eight drawings, it is one object seen eight ways. Turning the head may change what
 * you SEE. It must not change WHICH HAIRCUT HE IS WEARING.
 *
 * WHY THIS IS A REAL RISK AND NOT A HYPOTHETICAL: genHair branches hard on `back`,
 * `prof` and `front`, and the three branches were written at three different times for
 * three different complaints -- the 8/2 profile fix, the 8/1 back exemption, the front
 * curtain. NOTHING HAS EVER ASSERTED THAT THEY AGREE WITH EACH OTHER.
 *
 * WHAT IS MEASURED, and every one of these is deliberately scale-free so a bigger head
 * does not read as a bigger haircut:
 *
 *   LENGTH   how far the hair falls below the jaw, in head-heights. This is the single
 *            strongest identity signal a haircut has: a bob is not a shoulder-length cut
 *            no matter what angle you look from.
 *   HEIGHT   how far the mass rises above the skull, in head-heights. A pompadour is
 *            tall from every side.
 *   REACH    how far the mass sits out past the skull sideways, in head-widths.
 *   BULK     hair area as a fraction of the head's own area.
 *
 * The first three are TRUE IDENTITY: they describe the object, not the view of it.
 * BULK IS NOT, and that is the point of separating them -- from the front you see a face
 * and two curtains, from behind you see a whole skull of hair, so bulk SHOULD swing.
 * Reporting bulk as a violation would be measuring the anatomy, not the bug.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and measures, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own generators.
 *
 *   node tools/bohemia_hair_identity_audit.js
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
    const out = {};
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      /* THE HEAD ITSELF, from the part grid -- his painted silhouette, never a guess. */
      let hMn = 1e9, hMx = -1, hTop = 1e9, hBot = -1, headArea = 0;
      for (let i = 0; i < f.grid.length; i++) { const gv = f.grid[i];
        if (gv === 1 || gv === 2) { const x = i % f.CW, y = (i / f.CW) | 0;
          if (x < hMn) hMn = x; if (x > hMx) hMx = x;
          if (y < hTop) hTop = y; if (y > hBot) hBot = y; headArea++; } }
      const hw = hMx - hMn + 1, hh = hBot - hTop + 1;
      for (const h of H) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        let top = 1e9, bot = -1, mn = 1e9, mx = -1, n = 0;
        for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
          if (y < top) top = y; if (y > bot) bot = y;
          if (x < mn) mn = x; if (x > mx) mx = x; n++; }
        if (!n) continue;
        (out[h.n] = out[h.n] || {})[d] = {
          length: Math.max(0, bot - hBot) / hh,          /* fall below the jaw, in head-heights */
          height: Math.max(0, hTop - top) / hh,          /* rise above the skull */
          reach:  Math.max(0, Math.max(hMn - mn, mx - hMx)) / hw,
          bulk:   n / headArea,
        };
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { out, DIRS };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const { out, DIRS } = R;
  const KEYS = ['length', 'height', 'reach'];
  console.log('  CLAUSE 1: a haircut is ONE haircut from every angle.');
  console.log('  Scale-free. LENGTH/HEIGHT in head-heights, REACH in head-widths.');
  console.log('  SWING is the biggest gap between ANY two facings of the same style.');
  console.log('  bulk is shown but NOT judged: you see a face from the front, so it should swing.\n');
  console.log('  hairstyle              length swing   height swing   reach swing    bulk swing   worst notch');
  const rows = [];
  for (const n in out) {
    const per = out[n];
    const sw = {}, notch = {};
    for (const k of [...KEYS, 'bulk']) {
      const v = DIRS.filter(d => per[d]).map(d => per[d][k]);
      sw[k] = v.length ? Math.max(...v) - Math.min(...v) : 0;
      /* *** THE LAW SAYS "AS THE HEAD TURNS ONE NOTCH". *** Max-minus-min across all
         eight is the wrong ruler for it: a fall down the back is genuinely longer from
         behind than from the front, and that gap is anatomy, not a defect. What must
         never happen is a haircut CHANGING between two views a player sees back to
         back. The compass wraps, so SW->S counts too. */
      let g = 0;
      for (let i = 0; i < DIRS.length; i++) {
        const a = per[DIRS[i]], b2 = per[DIRS[(i + 1) % DIRS.length]];
        if (a && b2) g = Math.max(g, Math.abs(a[k] - b2[k]));
      }
      notch[k] = g;
    }
    rows.push({ n, sw, notch, per });
  }
  rows.sort((a, c) => (c.sw.length + c.sw.height + c.sw.reach) - (a.sw.length + a.sw.height + a.sw.reach));
  for (const q of rows)
    console.log('  ' + q.n.padEnd(22) + q.sw.length.toFixed(3).padStart(11) +
      q.sw.height.toFixed(3).padStart(15) + q.sw.reach.toFixed(3).padStart(14) +
      q.sw.bulk.toFixed(3).padStart(14) +
      Math.max(q.notch.length, q.notch.height, q.notch.reach).toFixed(3).padStart(14));

  const worst = k => rows.reduce((a, c) => c.sw[k] > a.sw[k] ? c : a, rows[0]);
  console.log('');
  for (const k of KEYS) {
    const w = worst(k);
    const v = DIRS.filter(d => w.per[d]).map(d => [d, w.per[d][k]]);
    const lo = v.reduce((a, c) => c[1] < a[1] ? c : a), hi = v.reduce((a, c) => c[1] > a[1] ? c : a);
    console.log('  worst ' + k.toUpperCase().padEnd(7) + w.n.padEnd(20) +
      hi[0] + ' ' + hi[1].toFixed(3) + '   vs   ' + lo[0] + ' ' + lo[1].toFixed(3));
  }
  const tot = k => Math.max(...rows.map(r => r.sw[k]));
  const notchTot = k => Math.max(...rows.map(r => r.notch[k]));
  const wn = rows.reduce((a, c) => Math.max(c.notch.length, c.notch.height, c.notch.reach) >
                                   Math.max(a.notch.length, a.notch.height, a.notch.reach) ? c : a, rows[0]);
  console.log('\n  ACROSS ALL ' + rows.length + ' CANON STYLES, ALL 8 FACINGS, worst anywhere:');
  console.log('    length ' + tot('length').toFixed(3) + '  height ' + tot('height').toFixed(3) +
    '  reach ' + tot('reach').toFixed(3));
  console.log('\n  *** AND THE ONE THE LAW ACTUALLY ASKS FOR -- ONE NOTCH OF TURN: ' +
    'length ' + notchTot('length').toFixed(3) + '  height ' + notchTot('height').toFixed(3) +
    '  reach ' + notchTot('reach').toFixed(3) + ' ***');
  console.log('  worst single notch: ' + wn.n);
})();
