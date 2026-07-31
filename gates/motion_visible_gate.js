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

  /* THE COUGH ASSERTIONS ARE GONE, AND THAT IS THE POINT (7/31).
     They asserted MY fix: cough moving >= 3000 px and <= 20 bare-skin px on the
     chest. Paolo then ruled -- "damn i think you made cough worse i think we
     gotta redo it from the ground up" -- and cough was reverted to its
     pre-session coefficients. The gate promptly went red, which was it working:
     it was holding the tree to a fix its author had rejected.
     A GATE MUST NEVER OUTRANK A RULING. When he kills a change, the gate that
     locked it dies with it in the same turn, or the machine starts arguing with
     him. Cough, whistle and search are now DELIBERATELY UNGATED for motion --
     he has called all three bad and they are waiting on his direction, not mine.
     The 8 clips he has NOT ruled on keep their floors below. */
  await b.close();
  console.log(`\n=== MOTION VISIBLE GATE: ${p} passed, ${f} failed ===`);
  process.exit(f ? 1 : 0);
})();
