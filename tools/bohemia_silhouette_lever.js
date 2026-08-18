/* BOHEMIA WHICH GARMENTS ACTUALLY CHANGE THE SHAPE? (8/18/26, CHARACTER lane)
 *
 * Making the six city residents distinguishable by SILHOUETTE ran into a wall: two
 * of them (the wide brim and the poncho) sit at 0.014 apart on the width profile
 * and four attempts barely moved it. What that taught me is that BODYVAR dials are
 * a weak lever once a coat is on -- the coat covers the body -- so the strong lever
 * has to be the GARMENT.
 *
 * REUSE-FIRST (Paolo 7/22) says prove nothing in the bank does the job before
 * cooking anything, and I had NOT proved that. The wardrobe holds capes, mantles,
 * packs and ponchos I never tried. Some of them may already break the outline.
 *
 * SO THIS RANKS THE WHOLE WARDROBE BY HOW MUCH IT CHANGES THE SILHOUETTE. One body,
 * one pose, one garment at a time, measured against the same body wearing nothing
 * on that layer. The number is the mean width-profile distance -- the same metric
 * city_cast_silhouette_gate scores residents by -- so a garment's score here is
 * directly comparable to the 0.014 gap I could not close.
 *
 * *** AND IT MEASURES THE FRONT, WHICH IS THE POINT I MISSED. *** I gave one
 * resident a RUCK PACK to break his outline and then measured the S facing, where a
 * back item is INVISIBLE. A garment that only reads from behind cannot separate
 * people walking toward you. Every score below is the S facing for that reason, and
 * the tool reports the N facing too so the difference is visible rather than
 * assumed.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the rig, writes nothing. It borrows
 *   window.G_WORN around a buildFrame and restores it, exactly as famPaintBody does;
 *   no painted pixel, joint or bone is touched, and no garment is authored -- this
 *   only measures what already exists.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It opens the alpha's own GARMENTS
 * catalogue (the st:'canon' entries) and renders each existing piece to measure it.
 * Nothing is drawn, generated or invented -- the entire output is a ranking.
 *
 *   node tools/bohemia_silhouette_lever.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4000);

  const R = await page.evaluate(() => {
    if (!window.GARMENTS) return { err: 'no GARMENTS' };

    /* the same width profile the cast gate scores by, so the numbers compare */
    const profileOf = (f) => {
      const W = f.CW, H = f.CH, rows = [];
      for (let y = 0; y < H; y++) {
        let lo = -1, hi = -1;
        for (let x = 0; x < W; x++) if (f.px[y * W + x]) { if (lo < 0) lo = x; hi = x; }
        rows.push(hi < 0 ? 0 : (hi - lo + 1));
      }
      let top = 0; while (top < rows.length && !rows[top]) top++;
      let bot = rows.length - 1; while (bot > top && !rows[bot]) bot--;
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const N = 16, p = [];
      for (let k = 0; k < N; k++) {
        const y = top + Math.round(span * k / (N - 1));
        p.push(rows[Math.min(rows.length - 1, y)] / wide);
      }
      return p;
    };
    const dist = (a, b) => {
      let d = 0; for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - b[k]);
      return d / a.length;
    };

    const keepW = window.G_WORN, keepEq = {};
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    PD.forEach(s => { if (s in G.equipped) { keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });

    const base = { base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };
    const shot = (worn, dir) => {
      window.G_WORN = worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      return profileOf(buildFrame(dir, 'idle', 0));
    };

    let out = { rows: [], err: null };
    try {
      const refS = shot(base, 'S'), refN = shot(base, 'N');
      /* every canon garment on the layers that could plausibly change an outline */
      const LAYERS = ['outer', 'back', 'head', 'legs', 'gear', 'neck', 'base', 'feet'];
      for (const g of window.GARMENTS) {
        if (g.st !== 'canon' || LAYERS.indexOf(g.layer) < 0) continue;
        const w = Object.assign({}, base); w[g.layer] = g.n;
        const s = dist(refS, shot(w, 'S'));
        const n = dist(refN, shot(w, 'N'));
        out.rows.push({ n: g.n, layer: g.layer, s: +s.toFixed(4), b: +n.toFixed(4) });
      }
    } catch (e) { out.err = e.message; }
    finally {
      window.G_WORN = keepW;
      for (const s in keepEq) G.equipped[s] = keepEq[s];
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    }
    return out;
  });

  if (R.err) { console.log('THREW: ' + R.err); await browser.close(); process.exit(1); }

  R.rows.sort((a, b) => b.s - a.s);
  console.log('HOW MUCH EACH GARMENT CHANGES THE SILHOUETTE (front / back)');
  console.log('  the two residents I could not separate are 0.0140 apart, so anything');
  console.log('  scoring well above that is a real lever; below it is not.\n');
  console.log('  ' + 'front'.padStart(7) + '  ' + 'back'.padStart(6) + '  layer    garment');
  for (const r of R.rows.slice(0, 22))
    console.log('  ' + r.s.toFixed(4).padStart(7) + '  ' + r.b.toFixed(4).padStart(6) +
                '  ' + r.layer.padEnd(7) + '  ' + r.n);

  const useless = R.rows.filter(r => r.s < 0.014);
  console.log('\n  ' + useless.length + ' of ' + R.rows.length + ' canon garments change the FRONT ' +
              'outline by LESS than the gap I could not close.');
  const backOnly = R.rows.filter(r => r.s < 0.014 && r.b >= 0.014);
  if (backOnly.length)
    console.log('  ' + backOnly.length + ' of those DO change the back: ' +
                backOnly.slice(0, 6).map(r => r.n).join(', ') +
                '\n  -- which is exactly the trap: invisible on somebody walking toward you.');
  await browser.close();
})();
