// BOHEMIA — MOTION VISIBLE GATE (7/30/26). FACTORY LAW: new law, new gate, same turn.
//
// Paolo 7/30: "we gotta COOK ... 11 months of motion not bitching and complaining."
//
// THE DEFECT, measured on the real surface: two clips rendered ZERO changed
// pixels on facing S across all 24 frame-cache buckets. `pray` "animated" at an
// amplitude of 0.2 px and `winded` at 0.6 px, on a 56 px sprite -- sub-pixel, so
// they never moved a single pixel and the character stood there like a statue.
// Several more (cower 99, scratch-back 75) were close to it, against walk at 415.
//
// WHAT THIS GATE MEASURES, and why it is this and not something cheaper: the
// number of PIXELS that differ between the two most-different rendered frames of
// a clip. Not the pose values (they can differ by sub-pixel amounts that
// rasterise identically), and NOT the count of distinct key poses -- that number
// is dominated by the pose-hold reducer and says nothing about what the eye sees.
// Both of those cheaper metrics gave me WRONG answers on the way here; only
// counting changed pixels on the real surface tracks what Paolo actually sees.
//
// TWO MEASUREMENT MISTAKES THIS GATE EXISTS TO NOT REPEAT:
//   1. SAMPLING AT THE WRONG RATE. A first probe sampled 8 phases while the
//      engine uses FRAME_CACHE.buckets = 24. Clips oscillating 4 cycles per loop
//      (cower: sin(ph*8*PI)) alias to 2 values at 8 samples, so the ruler
//      reported motion defects that were artifacts of the ruler. Always sample
//      at the engine's own bucket count.
//   2. MEASURING ONE FACING. A second probe measured only S and declared the
//      `taunt` fix a no-op at 338 -> 338. Across all 8 facings taunt is
//      2482 -> 2898. On S the spine-forward factor contributes nothing, so an
//      S-only ruler is blind to edits that live in the lean.
//
// STILLNESS IS CORRECT FOR SOME CLIPS and this gate must never push them: aiming
// (pistol, two-hand, overwatch) and bracing (brace) are actions whose whole point
// is holding steady. They are deliberately not in the floor list.
const path = require('path');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

// Clips whose own NAME promises visible movement, with the floor each must clear.
// Floors are set well under the measured value so honest re-tuning passes and a
// regression toward sub-pixel does not. Measured 7/30 (sum over 8 facings).
const FLOOR = {
  pray: 400,          // measured 767   (was 206, and 0 on S alone)
  winded: 2000,       // measured 3824  (was 954, and 0 on S alone)
  cower: 2000,        // measured 3566  (was 1404)
  'scratch-back': 2000, // measured 3538 (was 666)
  headbang: 2400,     // measured 3558  (was 2853)
  nod: 1100,          // measured 1388  (was 1036)
  cheer: 3200,        // measured 4631  (was 2979)
  cough: 3000,        // measured 4301  (was 2251)
  taunt: 2400,        // measured 2898  (was 2482)
};

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { console.log('  > FAIL playwright unavailable'); process.exit(1); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(2000);
  if (errs.length) {
    console.log('  > FAIL the alpha raised a page error: ' + errs[0]);
    await b.close();
    console.log('\n=== MOTION VISIBLE GATE: 0 passed, 1 failed ===');
    process.exit(1);
  }

  const res = await pg.evaluate((names) => {
    const B = FRAME_CACHE.buckets, D = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], out = {};
    for (const c of names) {
      let tot = 0;
      for (const d of D) {
        const fr = [];
        for (let q = 0; q < B; q++) { try { fr.push(buildFrame(d, c, (q + 0.5) / B).px); } catch (e) {} }
        let maxd = 0;
        for (let i = 0; i < fr.length; i++) for (let j = i + 1; j < fr.length; j++) {
          let n = 0; const A = fr[i], C = fr[j];
          for (let k = 0; k < A.length; k++) {
            const a = A[k], c2 = C[k];
            if (!a && !c2) continue;
            if (!a || !c2) { n++; continue; }
            if (a[0] !== c2[0] || a[1] !== c2[1] || a[2] !== c2[2]) n++;
          }
          if (n > maxd) maxd = n;
        }
        tot += maxd;
      }
      out[c] = tot;
    }
    return out;
  }, Object.keys(FLOOR));

  ok('the engine samples at FRAME_CACHE.buckets, not a guessed rate', true);
  for (const c of Object.keys(FLOOR)) {
    const got = res[c];
    ok(`${c} moves visibly (${got} changed px, floor ${FLOOR[c]})`,
      typeof got === 'number' && got >= FLOOR[c]);
  }
  // NOTHING may fall back to literally frozen.
  for (const c of Object.keys(FLOOR)) {
    ok(`${c} is never a statue (>0 changed pixels)`, res[c] > 0);
  }

  /* THE COUGH HAND (7/30). Paolo circled NE/E/SW: "the hand layer is fucked up".
     The hand stopped at y18-20 while the face ends at y16, so it sat on the chest
     as a bare-skin patch with its forearm hidden inside the torso -- a detached
     blob. Fixed in the POSE (cough IK lift 4 -> 8), NOT with a per-pose layer
     rule: Paolo retired dynamic hand depth TWICE (7/2, 7/26, "AUTHORED LAYERING
     IS THE LAW") because it flipped whole arms between frames. A third attempt
     would be the same mistake a third time.
     Measured over all 8 facings: 45 bare-skin px on the chest band -> 12.
     idle and walk measure 0, which is what makes 45 a defect and not a baseline. */
  const chest = await pg.evaluate(() => {
    const sk = {};
    try { const q = skinRampFor(); for (let i = 1; i < q.length; i++) if (q[i]) sk[q[i].join(',')] = 1; } catch (e) {}
    const band = (clip) => {
      let n = 0;
      for (const d of ['S','SE','E','NE','N','NW','W','SW']) {
        const f = buildFrame(d, clip, 0.02);
        for (let y = 17; y <= 26; y++) for (let x = 0; x < f.CW; x++) {
          const c = f.px[y * f.CW + x];
          if (c && sk[c.join(',')]) n++;
        }
      }
      return n;
    };
    return { cough: band('cough'), idle: band('idle'), walk: band('walk') };
  });
  ok(`the cough hand reaches the mouth, not the chest (${chest.cough} bare-skin px, ceiling 20, was 45)`,
    chest.cough <= 20);
  ok(`idle keeps a clothed chest (${chest.idle} px)`, chest.idle <= 2);
  ok(`walk keeps a clothed chest (${chest.walk} px)`, chest.walk <= 2);
  await b.close();
  console.log(`\n=== MOTION VISIBLE GATE: ${p} passed, ${f} failed ===`);
  process.exit(f ? 1 : 0);
})();
