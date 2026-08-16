/* BOHEMIA 2X — THE RIG DOUBLER (Paolo 8/14, LOCKED: "the character models need
 * twice as many pixels and the black border has to be thinner, like half as thin")
 *
 * Step (1)+(2) of the migration, as a PURE FUNCTION WITH A PROOF, deliberately NOT
 * yet applied to the alpha.
 *
 * WHY IT SHIPS AS A TOOL FIRST. The ruling is explicit that steps 1-4 go together
 * -- double the pixels, double every coordinate, Scale2x off, 1px outline -- and
 * that "everything looks the same but sharper and nothing regresses". A rig that is
 * half-migrated (doubled art, un-doubled bones) does not look worse, IT LOOKS LIKE
 * GARBAGE: every limb bound to a joint at half its true position. So the doubling
 * gets built and PROVED on its own, and the flip happens when 1-4 can land in one
 * commit against re-blessed gates.
 *
 * *** THE ONE CLAIM THAT MATTERS, AND IT IS PROVED HERE, NOT ASSERTED. ***
 * RIG LAW: "Paolo's painted regions are SACROSANCT: never reshape, mesh, mirror, or
 * 'fix' region geometry. Ever." The migration is safe under that law ONLY because
 * the transform is LOSSLESS AND EXACTLY INVERTIBLE -- one pixel becomes a 2x2 block
 * and nothing else. So this file does not say "it is lossless", it HALVES THE
 * OUTPUT BACK and requires the result to be byte-identical to what went in, on his
 * real BAKED, every part, every facing. If that round trip ever fails, the doubling
 * is reshaping his art and must not ship.
 *
 * COORDINATES DOUBLE TOO, and they are the half everybody forgets: bones, the pose,
 * every joint. A doubled body on un-doubled bones is the classic broken migration.
 *
 * WHAT THIS DOES NOT TOUCH: garment/hair anchors and animation keyframes live in
 * other structures (PD layers at 24-grid + G24 offsets, ANIM clips). They are step
 * (2)'s remainder and get the same treatment and the same round-trip proof when the
 * flip lands. Named here so the next session does not think this file covered them.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): READS the rig and writes NOTHING back.
 *   It builds a DOUBLED COPY in memory and proves the copy is exactly invertible --
 *   halve it and his original pixels come back byte for byte -- which is the only
 *   reason a resolution change is legal under a law that says his painted regions
 *   are sacrosanct. BAKED itself is never mutated, on disk or in the page.
 *   built on: BAKED, BAKED.layers
 *   joints: none named
 *     (every joint in skeleton and pose is doubled generically, by iteration, so no
 *      joint is special-cased and none can be missed)
 *   parts: none named -- every part list is doubled by iteration
 *
 *   node tools/bohemia_rig_double.js          # prove it on the real BAKED
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = 'file://' + path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');

/* ---------------------------------------------------------------------------
   THE TRANSFORM. Kept as a string so it can be injected into the page and run
   against the live BAKED, and later lifted verbatim into the alpha when the flip
   happens -- one definition, no second copy to drift (ENGINE SYNC LAW in spirit).
   --------------------------------------------------------------------------- */
const XFORM = `
/* one pixel -> a 2x2 block. Index math only; no resampling, no interpolation,
   nothing that could invent or move a pixel of his art. */
function dblList(list, W){
  const out = [];
  for (let k = 0; k < list.length; k++){
    const i = list[k], x = i % W, y = (i / W) | 0;
    const X = x * 2, Y = y * 2, W2 = W * 2;
    out.push(Y * W2 + X, Y * W2 + X + 1, (Y + 1) * W2 + X, (Y + 1) * W2 + X + 1);
  }
  return out;
}
/* the exact inverse: collapse each 2x2 back to its source pixel. Used ONLY by the
   proof -- if this does not return the input exactly, the doubling is lying. */
function halveList(list, W2){
  const seen = new Set(), out = [];
  const W = W2 / 2;
  for (let k = 0; k < list.length; k++){
    const j = list[k], x = (j % W2) >> 1, y = ((j / W2) | 0) >> 1;
    const i = y * W + x;
    if (!seen.has(i)) { seen.add(i); out.push(i); }
  }
  return out;
}
function dblPt(p){ return [p[0] * 2, p[1] * 2]; }
function dblSkel(sk){ const o = {}; for (const j in sk) o[j] = dblPt(sk[j]); return o; }
function doubleRig(baked){
  const W = baked.W || 56, layers = {}, skeleton = {}, pose = {};
  for (const d in baked.layers){
    const src = baked.layers[d], dst = {};
    for (const pid in src) dst[pid] = dblList(src[pid], W);
    layers[d] = dst;
  }
  for (const d in (baked.skeleton || {})) skeleton[d] = dblSkel(baked.skeleton[d]);
  for (const d in (baked.pose || {}))     pose[d]     = dblSkel(baked.pose[d]);
  return { W: W * 2, H: (baked.H || 56) * 2, layers, skeleton, pose,
           layerOverride: baked.layerOverride, swingAmt: baked.swingAmt };
}
`;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  const R = await page.evaluate((xform) => {
    eval(xform);
    if (typeof BAKED === 'undefined') return { err: 'no BAKED' };
    const W = BAKED.W || 56;
    const big = doubleRig(BAKED);

    const out = { W: W, W2: big.W, H2: big.H, parts: 0, pxIn: 0, pxOut: 0,
                  roundTripBad: [], countBad: [], dupBad: [], oobBad: [],
                  joints: 0, jointBad: [], facings: Object.keys(BAKED.layers).length };

    for (const d in BAKED.layers){
      for (const pid in BAKED.layers[d]){
        const src = BAKED.layers[d][pid], dst = big.layers[d][pid];
        out.parts++; out.pxIn += src.length; out.pxOut += dst.length;

        /* 4x exactly -- one pixel becomes four, none dropped, none invented */
        if (dst.length !== src.length * 4) out.countBad.push(d + '/' + pid);

        /* no target index written twice: a collision would mean two source pixels
           landed on the same block, which is reshaping */
        if (new Set(dst).size !== dst.length) out.dupBad.push(d + '/' + pid);

        /* everything stays on the doubled plate */
        for (let k = 0; k < dst.length; k++)
          if (dst[k] < 0 || dst[k] >= big.W * big.H) { out.oobBad.push(d + '/' + pid); break; }

        /* *** THE PROOF: halve it back and demand the ORIGINAL, exactly. *** */
        const back = halveList(dst, big.W);
        const a = src.slice().sort((x, y) => x - y).join(',');
        const b = back.slice().sort((x, y) => x - y).join(',');
        if (a !== b) out.roundTripBad.push(d + '/' + pid);
      }
    }

    /* coordinates: every joint doubled, and halving returns the original */
    for (const set of ['skeleton', 'pose']){
      for (const d in (BAKED[set] || {})){
        for (const j in BAKED[set][d]){
          const p = BAKED[set][d][j], q = big[set][d][j];
          out.joints++;
          if (!q || q[0] !== p[0] * 2 || q[1] !== p[1] * 2) out.jointBad.push(set + '.' + d + '.' + j);
        }
      }
    }
    return out;
  }, XFORM);

  if (R.err) { console.log('  FAIL: ' + R.err); process.exit(1); }

  console.log('  rig ' + R.W + ' -> ' + R.W2 + 'x' + R.H2 + '   ' +
              R.facings + ' facings, ' + R.parts + ' part lists, ' +
              R.pxIn + ' painted pixels -> ' + R.pxOut + '   ' + R.joints + ' joints');

  ok('the doubled rig is 112 (his ruling: canonical character resolution 56 -> 112)',
     R.W2 === 112 && R.H2 === 112);
  ok('every part list is EXACTLY 4x (' + R.pxIn + ' -> ' + R.pxOut + ') — no pixel ' +
     'dropped, none invented' + (R.countBad.length ? ' [' + R.countBad.slice(0,4).join(',') + ']' : ''),
     R.countBad.length === 0 && R.pxOut === R.pxIn * 4);
  ok('no two source pixels collide on the same target block' +
     (R.dupBad.length ? ' [' + R.dupBad.slice(0,4).join(',') + ']' : ''), R.dupBad.length === 0);
  ok('every doubled pixel lands on the 112 plate' +
     (R.oobBad.length ? ' [' + R.oobBad.slice(0,4).join(',') + ']' : ''), R.oobBad.length === 0);
  ok('*** LOSSLESS AND EXACTLY INVERTIBLE: halving the doubled rig returns HIS ' +
     'ORIGINAL PIXELS, byte for byte, on every part of every facing. This is what ' +
     'makes RIG LAW safe BY CONSTRUCTION rather than by promise ***' +
     (R.roundTripBad.length ? ' [' + R.roundTripBad.slice(0,4).join(',') + ']' : ''),
     R.roundTripBad.length === 0);
  ok('EVERY COORDINATE DOUBLES TOO (' + R.joints + ' joints across skeleton+pose) — ' +
     'doubled art on un-doubled bones is the classic broken migration' +
     (R.jointBad.length ? ' [' + R.jointBad.slice(0,4).join(',') + ']' : ''),
     R.jointBad.length === 0);

  console.log('RIG DOUBLER: ' + pass + ' passed, ' + fail + ' failed' +
              (fail ? '' : '  — the transform is safe to apply when steps 1-4 land together'));
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
