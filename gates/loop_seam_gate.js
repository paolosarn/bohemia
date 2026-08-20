/* THE LOOP SEAM GATE (8/18/26, CHARACTER lane) -- NO ANIMATION JERKS ONCE A BAR
 *
 * A cyclic clip whose LAST rendered frame does not lead back into its FIRST snaps at
 * the wrap, every bar, forever. Two of the three field surgery clips shipped that way
 * in their first cut, and `drunk` had been doing it since it was written: `w` was
 * sin(ph*PI+1.3) where every sibling term in the same pose uses ph*2*PI, so it ran at
 * half the frequency and FLIPPED SIGN across the wrap. w drives hipOff, so the hips
 * teleported 3.5px sideways every two seconds.
 *
 * WHAT IT MEASURES, AND WHY IT IS A RATIO:
 *
 *     seam ratio = pixels that change from the last frame to the first
 *                  -----------------------------------------------------
 *                  the biggest change between any two neighbouring frames
 *
 * At or under 1 the wrap is no bigger than a move the clip already makes -- it flows.
 * Above 1 it is a jump nothing else in the clip matches, which is what a snap IS. A
 * ratio and not a raw count, deliberately, because `run` legitimately changes
 * thousands of pixels a frame and must never be called broken for moving a lot.
 *
 * *** THE FIRST TWO RULERS WERE BOTH WRONG AND BOTH LOOKED FINE. *** This is the
 * whole reason the file says this much:
 *   1. HAND TRAVEL IN RIG-SPACE said 31 clips had open loops, and I wrote that into
 *      the handoff as a repo-wide finding. It is not one: a 3px hand offset at the
 *      seam is invisible in a clip whose normal motion is 2,000 pixels a frame.
 *      Measured on the rendered frame instead, 102 of 103 were already fine.
 *   2. THE MEDIAN STEP as denominator gave `run` a ratio of 2617. POSEHOLD holds each
 *      pose for a whole key, so sampled across the bar every second step is EXACTLY
 *      ZERO and the median of the series is 0. A summary statistic has to fit the
 *      shape of the signal; this one alternates hold-move-hold-move, so the peak is
 *      the honest denominator.
 * Both were caught by the numbers being absurd rather than by anybody reading them.
 *
 * SAMPLED AT FRAME_CACHE.buckets, the renderer's own frame count, so it sees exactly
 * the frames the game draws -- not the pose keys, which are a different grid.
 *
 * TWO INNOCENT CASES ARE SEPARATED, because a sweep that cannot tell a bug from a
 * design decision is the broken one (8/1):
 *   - TERMINAL clips are not cycles. They are meant to end somewhere else. Excluded
 *     from the engine's own TERMINAL table, never from a list typed in here.
 *   - A clip authored to run two cycles inside its bar wraps correctly at both ends;
 *     the ratio catches that automatically, because its midpoint move is just as big.
 *
 * MUTATION-TESTED: put the half-period sway back into `drunk` and this goes red at
 * 1.72 naming it. Confirmed in place, then put back.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and measures, writes nothing. It
 *   sets no globals, authors no pixel and reshapes nothing.
 *   built on: drawChar, CLIPS, TERMINAL, FRAME_CACHE
 *   joints: none named
 *   parts: none named
 *
 *   node gates/loop_seam_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

/* THE PIN, AND IT IS THE MEASURED TRUTH PLUS HEADROOM, NOT A WISH.
   With every clip in the game flowing, the worst seam in the build is 0.81 (weave).
   1.20 leaves real room for a clip that legitimately ends on its biggest move, and
   still catches both defects that produced this gate: drunk at 1.72 and the field
   surgery clips before their loops were closed. Ratchet it DOWN toward 0.9 if the
   build ever holds there; do not raise it to admit a snap. */
const MAX_SEAM = 1.20;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4000);

  const R = await page.evaluate(() => {
    const K = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const cv = document.createElement('canvas'); cv.width = cv.height = 112;
    const g = cv.getContext('2d');
    const grab = (c, d, ph) => { try { drawChar(cv, d, c, ph); } catch (e) {}
      return g.getImageData(0, 0, 112, 112).data.slice(); };
    const diff = (a, b) => { let n = 0;
      for (let i = 0; i < a.length; i += 4)
        if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) n++;
      return n; };

    const rows = [], dead = [], flat = [];
    for (const c of CLIPS) {
      if (TERMINAL[c]) continue;
      let worst = null;
      for (const d of ['SE', 'S']) {
        const f = [];
        for (let i = 0; i < K; i++) f.push(grab(c, d, i / K));
        let bodyPx = 0;
        for (let i = 3; i < f[0].length; i += 4) if (f[0][i] > 8) bodyPx++;
        if (bodyPx < 800) { dead.push(c + '/' + d); continue; }
        const steps = [];
        for (let i = 0; i < K - 1; i++) steps.push(diff(f[i], f[i + 1]));
        const peak = Math.max.apply(null, steps);
        const seam = diff(f[K - 1], f[0]);
        /* A CLIP THAT NEVER MOVES CANNOT BE JUDGED BY THIS RULER, and dividing by its
           peak would invent a verdict. Named, not silently passed. */
        if (peak < 12) { flat.push(c + '/' + d); continue; }
        const r = { d: d, seam: seam, peak: peak, ratio: seam / peak };
        if (!worst || r.ratio > worst.ratio) worst = r;
      }
      if (worst) rows.push({ c: c, d: worst.d, seam: worst.seam, peak: worst.peak,
                             ratio: +worst.ratio.toFixed(3) });
    }
    return { keys: K, rows: rows, dead: dead, flat: flat, clips: CLIPS.length };
  });

  ok('there are clips to check and they were actually measured (' + R.rows.length +
     ' of ' + R.clips + ')', R.rows.length >= 60);
  ok('every clip measured drew a real body (' + R.dead.length + ' blank' +
     (R.dead.length ? ': ' + R.dead.slice(0, 5).join(', ') : '') + ')', R.dead.length === 0);
  /* A still clip has no seam to judge, and saying so is the difference between a
     sweep and a claim of coverage it has not earned. But NAMING them is not a check:
     the first cut of this line was ok(..., true === true), which is the exact vacuous
     assertion this repo has a name for. The real claim is that the unjudgeable set
     stays SMALL -- if most of the game became too still to measure, this gate would
     be passing on nothing and that must go red, not print a note. */
  ok('the sweep judges the great majority of clips; the unjudgeable are named (' +
     R.flat.length + ' too still' + (R.flat.length ? ': ' + R.flat.slice(0, 6).join(', ') : '') + ')',
     R.flat.length <= Math.max(4, Math.floor(R.clips * 0.08)));

  R.rows.sort((a, b) => b.ratio - a.ratio);
  const bad = R.rows.filter(r => r.ratio > MAX_SEAM);
  ok('NO clip snaps at the loop seam (worst ' + (R.rows[0] ? R.rows[0].ratio.toFixed(2) +
     ' ' + R.rows[0].c : 'n/a') + ', pin ' + MAX_SEAM.toFixed(2) + ')' +
     (bad.length ? ' -- ' + bad.map(r => r.c + ' ' + r.ratio.toFixed(2)).join(', ') : ''),
     bad.length === 0);

  /* THE RULER ITSELF CANNOT GO VACUOUS. If every denominator collapsed the ratios
     would all be tiny and this would pass on nothing -- which is exactly how the
     median version of this metric produced garbage that looked like a result. */
  const realPeaks = R.rows.filter(r => r.peak >= 100).length;
  ok('the measurement is real, not a division by nothing (' + realPeaks + '/' +
     R.rows.length + ' clips move at least 100px in a frame)', realPeaks > R.rows.length * 0.5);
  ok('and it is sampled at the RENDERER\'s frame count, not the pose grid (' +
     R.keys + ' frames)', R.keys >= 24);

  ok('the page booted clean' + (errs.length ? ' (' + errs[0] + ')' : ''), errs.length === 0);

  console.log('  ' + R.rows.length + ' cyclic clips, ' + R.keys + ' rendered frames, worst of 2 facings');
  console.log('  worst seams: ' + R.rows.slice(0, 5)
    .map(r => r.c + ' ' + r.ratio.toFixed(2)).join('   '));
  console.log('LOOP SEAM GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
