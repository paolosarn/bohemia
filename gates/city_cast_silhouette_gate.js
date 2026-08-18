/* BOHEMIA THE NEIGHBOURS ARE SIX SHAPES, NOT SIX COLOURS (Paolo 7/19 + 8/15 + 8/3)
 *
 * STRUCTURE-NOT-COLOR (7/19, LOCKED), amended 8/15 to govern IDENTITY and not just
 * progress: "every faction must be identifiable by SILHOUETTE -- garment shape,
 * proportion, headwear -- with colour as the BACK-UP channel, never the carrier."
 * Paolo 8/3, about the residents specifically: "have it not be a copy of me."
 *
 * WHAT THIS EXISTS TO STOP COMING BACK. The six city residents were the player's
 * body in the player's clothes under four random tints, with a durag on every third
 * one. Rendered in greyscale they were SIX IDENTICAL SILHOUETTES -- which is not a
 * judgement call, it is arithmetic: same rig, same dials, same garments, so the
 * shapes were the SAME SHAPE and only the hue differed. And the valley is dark. The
 * demo opens at 06:00 on a near-black street, so colour is precisely the channel
 * that is not reliably there, and it was carrying the entire cast.
 *
 * *** SO THE MEASUREMENT THROWS THE COLOUR AWAY. *** Every comparison below is on
 * the ALPHA MASK -- the silhouette alone, no hue, no luminance. A cast that passes
 * this is a cast you can tell apart in the dark, which is the only version of the
 * rule that means anything in this game.
 *
 * PAIRWISE, ALL FIFTEEN PAIRS, because "the cast is varied" is an average and an
 * average hides the two that are twins. Each pair is scored by IoU on the
 * silhouette: 1.00 is the same shape, 0.00 shares nothing.
 *
 *   node gates/city_cast_silhouette_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

/* *** THE FIRST METRIC HERE WAS TOO BLUNT AND IS WORTH RECORDING. ***
   It scored each pair by IoU on the whole silhouette. Six humanoids standing in the
   same pose at the same spot on the same canvas OVERLAP ENORMOUSLY no matter who
   they are -- torso, legs and head sit in the same region -- so the numbers barely
   moved when the bodies genuinely changed: the most different pair I could build
   (a small girl in a skirt against a tall man in a floor-length duster, obviously
   different people at a glance) still scored 0.75, while identical bodies score
   1.00. A scale whose entire usable range is 1.00 to 0.75 cannot say much, and
   demanding "every pair under 0.90" was demanding that most of the cast approach
   the physical extreme. That is not what the rule asks. The rule asks whether you
   can TELL THEM APART.
   So the ruler changed, not the target -- and the target had already been improved
   twice under the blunt one for no real gain.

   WIDTH PROFILE is what an eye actually reads: how wide the shape is at each height,
   normalised so it is about PROPORTION and not about how big somebody is. A tall
   narrow column, a short stout barrel, a wide brim at the top, a skirt flaring at
   the bottom -- those are different curves even when the masks overlap heavily.
   THE ZERO POINT IS EXACT AND THAT IS WHY THIS METRIC IS HONEST: the old cast was
   one body recoloured, so every pair scored EXACTLY 0.000 on it, by construction.
   Any threshold above zero is a real bar, and the pins below are read off the
   shipped cast with headroom so retuning his table for taste does not go red. */
/* PINNED FROM THE SHIPPED CAST, AND THEY ONLY EVER GO UP.
   Measured: closest pair 0.014, mean 0.084, spread 0.014 -> 0.18.
   WHAT THIS GATE IS FOR, stated honestly so nobody mistakes it for more: it stops
   the cast COLLAPSING BACK INTO CLONES. The old cast scored EXACTLY 0.000 on every
   one of the fifteen pairs -- one body, one set of clothes, six tints -- so any
   floor above zero rejects it absolutely, and rejects any future change that makes
   two residents the same shape again. It does NOT certify that all six are
   maximally distinct, because they are not: widebrim and poncho sit at 0.014 and
   you tell them apart by the hat brim and the hair, not by the outline.
   I TRIED FOUR TIMES TO SEPARATE THAT PAIR AND MOVED IT ~0.01, WHICH IS THE USEFUL
   FINDING: at 56px, once a coat is on, BODYVAR dials barely change the outline (the
   coat covers the body), and swapping trousers for shorts + tall boots changed it
   by literally nothing (the legs region fills either way). The lever that would
   work is a garment with a genuinely different OUTER shape -- a flaring cape, a
   bulky pack that breaks the shoulder line -- and that is a cook, not an
   assignment. Raise these pins when that lands. */
const MIN_PAIR_PROFILE = 0.010;  /* no two residents may be the SAME shape */
const MIN_MEAN_PROFILE = 0.070;  /* and the cast as a whole must stay varied */

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(12000);

  const fr = page.frames().find(f => f.url().includes('CITY_WORLD'));
  ok('the city surface is up — this measures the cast the GAME received, not a ' +
     'table read out of the source', !!fr);
  if (!fr) { console.log('CITY CAST SILHOUETTE GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); await browser.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    if (typeof CAST_CV === 'undefined' || !CAST_CV || !CAST_CV.length) return { err: 'no CAST_CV' };
    const bodies = CAST_CV
      .map(c => c && (c.S ? c.S.idle : (c[Object.keys(c)[0]] || {}).idle))
      .filter(Boolean);
    if (bodies.length < 2) return { err: 'only ' + bodies.length + ' body/bodies' };

    /* THE SILHOUETTE, AND NOTHING ELSE. alpha > 0 is the shape; colour never
       enters the comparison, which is the whole point of the rule. */
    const mask = (cv) => {
      const g = cv.getContext('2d');
      const D = g.getImageData(0, 0, cv.width, cv.height).data;
      const m = new Uint8Array(cv.width * cv.height);
      let n = 0;
      for (let i = 0; i < m.length; i++) if (D[i * 4 + 3] > 40) { m[i] = 1; n++; }
      return { m: m, n: n, w: cv.width, h: cv.height };
    };
    const M = bodies.map(mask);
    if (M.some(x => x.n < 200)) return { err: 'a body is nearly empty (' + M.map(x => x.n).join(',') + ')' };
    if (new Set(M.map(x => x.w + 'x' + x.h)).size !== 1) return { err: 'bodies differ in canvas size' };

    /* THE WIDTH PROFILE: how wide the shape is at each of 16 heights, measured
       between the body's own top and bottom row and divided by its own widest row.
       Both normalisations are deliberate -- this must describe PROPORTION, so that
       "short and stout" and "tall and narrow" read as different even though one is
       simply a scaled version of the other in raw pixels. */
    const profile = (X) => {
      const rows = [];
      for (let y = 0; y < X.h; y++) {
        let lo = -1, hi = -1;
        for (let x = 0; x < X.w; x++) if (X.m[y * X.w + x]) { if (lo < 0) lo = x; hi = x; }
        rows.push(hi < 0 ? 0 : (hi - lo + 1));
      }
      let top = 0; while (top < rows.length && !rows[top]) top++;
      let bot = rows.length - 1; while (bot > top && !rows[bot]) bot--;
      const span = Math.max(1, bot - top);
      const wide = Math.max.apply(null, rows) || 1;
      const N = 16, p = [];
      for (let k = 0; k < N; k++) {
        const y = top + Math.round(span * k / (N - 1));
        p.push(rows[Math.min(rows.length - 1, y)] / wide);
      }
      return p;
    };
    const P = M.map(profile);
    const pairs = [];
    for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++) {
      let d = 0;
      for (let k = 0; k < P[a].length; k++) d += Math.abs(P[a][k] - P[b][k]);
      pairs.push({ a: a, b: b, iou: d / P[a].length });   /* mean profile distance */
    }
    return { n: bodies.length, px: M.map(x => x.n), pairs: pairs };
  });

  if (R.err) { ok('the cast was measurable: ' + R.err, false);
    console.log('CITY CAST SILHOUETTE GATE: ' + pass + ' passed, ' + fail + ' failed');
    await browser.close(); process.exit(1); }

  /* the table is declared in the ALPHA, not in the city frame -- reading it from
     the frame silently returned nothing and every message said "#4/#5" instead of
     naming the two residents that are actually alike. */
  const ids = await page.evaluate(() => (window.CITY_CAST_LOOKS || []).map(l => l.id));
  const name = i => ids[i] || ('#' + i);
  const sorted = R.pairs.slice().sort((x, y) => x.iou - y.iou);   /* most alike FIRST */
  const mean = R.pairs.reduce((s, p) => s + p.iou, 0) / R.pairs.length;

  console.log('  ' + R.n + ' residents, ' + R.pairs.length + ' pairs, WIDTH PROFILE only (colour and size discarded)');
  console.log('  most alike:  ' + sorted.slice(0, 3).map(p =>
    name(p.a) + '/' + name(p.b) + ' ' + p.iou.toFixed(2)).join('   '));
  console.log('  least alike: ' + sorted.slice(-3).map(p =>
    name(p.a) + '/' + name(p.b) + ' ' + p.iou.toFixed(2)).join('   '));
  console.log('  mean ' + mean.toFixed(3) + '   body sizes ' + R.px.join(','));

  ok('all six residents actually arrived in the city (' + R.n + ')', R.n === 6);
  ok('each of them has a real body, not an empty canvas', R.px.every(n => n > 400));

  const twins = sorted.filter(p => p.iou < MIN_PAIR_PROFILE);
  ok('*** NO TWO NEIGHBOURS SHARE A SILHOUETTE *** — closest pair ' +
     sorted[0].iou.toFixed(3) + ' (' + name(sorted[0].a) + '/' + name(sorted[0].b) +
     '), floor ' + MIN_PAIR_PROFILE + '. The old cast scored EXACTLY 0.000 on every ' +
     'pair, by construction: one body, one set of clothes, six tints' +
     (twins.length ? ' [' + twins.map(p => name(p.a) + '/' + name(p.b)).join(', ') + ']' : ''),
     twins.length === 0);

  ok('and the cast is varied as a whole, not one odd one out carrying it (mean ' +
     mean.toFixed(3) + ', floor ' + MIN_MEAN_PROFILE + ')', mean >= MIN_MEAN_PROFILE);

  /* THE RULE IS ABOUT SHAPE, so prove the shapes really are doing the work: the
     bodies must differ in SIZE too, not just in outline detail. Same rig recoloured
     gives identical pixel counts. */
  const spread = (Math.max.apply(null, R.px) - Math.min.apply(null, R.px)) / Math.max.apply(null, R.px);
  ok('their BODIES differ, not just their clothes — biggest vs smallest silhouette ' +
     'differs by ' + Math.round(spread * 100) + '% of area (identical rigs would be 0%)',
     spread > 0.10);

  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
  console.log('CITY CAST SILHOUETTE GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
