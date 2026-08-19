/* THE FIELD SURGERY GATE (8/18/26, CHARACTER lane) -- backlog row FS
 *
 * Paolo 8/13, his direct order: "definitely we're gonna need to make animations for
 * this and yep" (laws/BOHEMIA_ADDENDUM_HEALING_IS_A_BIG_DEAL_8_12_26.md sections 7-8).
 * The procedure is HIS and he wrote it at a bedside: pour iodine, inject lidocaine,
 * sterilise the tweezers, pick the pellets out, inject antibiotics. gates/medkit_gate.js
 * already held the five goods and the five steps; there was nothing to LOOK at.
 *
 * Three clips cover the five steps, because INJECT is used twice (lidocaine, then
 * antibiotics) and the sterilise beat is a held prop rather than a body action --
 * which is what the backlog row itself specifies, not a shortcut taken here.
 *
 * *** WHAT THIS GATE IS REALLY FOR: THE THREE READ AS DIFFERENT ACTIONS. ***
 * All three put both hands in the same small patch in front of the body. They have
 * to -- it is the same wound -- so WHERE the hands are cannot be the channel. They
 * are separated by TIMING, and timing is what is asserted:
 *
 *     pour     the stillest: the most keyframes where the hand has stopped
 *     inject   the fastest single keyframe move of the three -- the jab
 *     tweeze   the most direction reversals -- the tremor, and nothing else trembles
 *
 * Measuring that on rendered pixels does NOT work and this gate does not try: a
 * whole-frame pixel diff is dominated by the body settling, so the first attempt
 * reported pour's loop snapping as "the fastest move" and never saw the jab at all.
 * It measures the HAND, off posedSkel, which is the quantity being designed.
 *
 * THREE BUGS THIS CAUGHT WHILE IT WAS BEING BUILT, all of them invisible to reading:
 *   1. THE WOUND WAS OUT OF REACH. Mid-thigh is 19.1px from the shoulder and the arm
 *      is 16px. A standing person cannot reach their own thigh -- solveIK clamped and
 *      the hand hovered at hip height. The site is the forearm now, which is also the
 *      only one still visible under the long coats most of this valley wears.
 *   2. THE JAB WAS SHORTER THAN A KEYFRAME. POSEHOLD.keys is 12, so 1/12 of a bar is
 *      the shortest move the engine can express; a 0.06-phase jab fell between keys
 *      and rendered as nothing.
 *   3. THE TREMOR WAS SAMPLED AT ITS OWN ZERO CROSSINGS. sin(2*pi*6*t) at t=i/12 is
 *      sin(pi*i) = 0 for every key. Nine still keys out of twelve, in the clip whose
 *      whole identity is that it shakes. cos alternates instead.
 * Every one of those passed a reading and failed a measurement, which is the argument
 * for this file existing.
 *
 * AND IT CHECKS THE LOOP CLOSES, which is a general defect and not specific to these:
 * a cyclic clip whose pose at phase 1 differs from its pose at phase 0 SNAPS once per
 * bar. Two of these three shipped that way in their first cut. Other clips are
 * measured too and REPORTED, never failed -- they belong to work this session did not
 * do, and a gate that fails on somebody else's clip is a gate that gets switched off.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads and measures only. It calls posedSkel
 *   and drawChar, writes nothing, sets no globals, authors no pixel.
 *   built on: BAKED, RIG
 *   joints: handR, handL
 *   parts: none named
 *
 *   node gates/field_surgery_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const FS = ['pour', 'inject', 'tweeze'];

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

  const R = await page.evaluate((FS) => {
    const K = (typeof POSEHOLD !== 'undefined' && POSEHOLD.keys) || 12;
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { keys: K, registered: {}, beats: {}, render: {}, sig: {}, loop: {}, others: [], threw: null };
    try {
      FS.forEach(c => {
        out.registered[c] = { clips: CLIPS.indexOf(c) >= 0, pose: typeof POSE[c] === 'function' };
        out.beats[c] = ANIMBEATS[c];
      });

      /* RENDERS, ON EVERY FACING, WITHOUT THROWING -- and not a blank body. */
      const cv = document.createElement('canvas'); cv.width = cv.height = 112;
      const px = () => { const d = cv.getContext('2d').getImageData(0, 0, 112, 112).data;
        let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++; return n; };
      FS.forEach(c => {
        const counts = [];
        DIRS.forEach(d => { for (let i = 0; i < 4; i++) {
          try { drawChar(cv, d, c, i / 4); counts.push(px()); } catch (e) { counts.push(-1); } } });
        out.render[c] = { min: Math.min.apply(null, counts), n: counts.length };
      });

      /* THE HAND, KEY BY KEY. This is the designed quantity. */
      const handSig = (c, d) => {
        const p = [];
        for (let i = 0; i < K; i++) p.push(posedSkel(d, c, i / K).sk.handR);
        const sp = [];
        for (let i = 0; i < K; i++) { const a = p[i], b = p[(i + 1) % K];
          sp.push(Math.hypot(b[0] - a[0], b[1] - a[1])); }
        let rev = 0;
        for (let i = 1; i < K; i++) {
          const d1 = p[i][1] - p[i - 1][1], d0 = p[(i + 1) % K][1] - p[i][1];
          if (d1 * d0 < -0.01) rev++;
        }
        /* THE LOOP GAP is the distance between the last key and the first: a cyclic
           clip that does not return home snaps once a bar. */
        const peak = Math.max.apply(null, sp);
        return { peak: peak, peakAt: sp.indexOf(peak), still: sp.filter(v => v < 0.35).length,
                 rev: rev, gap: Math.hypot(p[K - 1][0] - p[0][0], p[K - 1][1] - p[0][1]) };
      };
      FS.forEach(c => { out.sig[c] = handSig(c, 'SE'); out.loop[c] = handSig(c, 'S').gap; });

      /* how far each one is from just standing there */
      const bodyDiff = (c) => {
        let t = 0;
        for (let i = 0; i < 8; i++) {
          drawChar(cv, 'SE', c, i / 8);
          const a = cv.getContext('2d').getImageData(0, 0, 112, 112).data.slice();
          drawChar(cv, 'SE', 'idle', i / 8);
          const b = cv.getContext('2d').getImageData(0, 0, 112, 112).data;
          let n = 0; for (let k = 0; k < a.length; k += 4)
            if (a[k] !== b[k] || a[k + 1] !== b[k + 1] || a[k + 2] !== b[k + 2] || a[k + 3] !== b[k + 3]) n++;
          t += n;
        }
        return Math.round(t / 8);
      };
      FS.forEach(c => { out.sig[c].vsIdle = bodyDiff(c); });

      /* INFORMATION ONLY: every other clip's loop gap, so the defect is visible
         without this gate failing on work that is not its own. */
      CLIPS.forEach(c => {
        if (FS.indexOf(c) >= 0 || c === 'headshot' || c === 'headshot-2' || c === 'sleep') return;
        try { const g = handSig(c, 'SE').gap; if (g > 2.0) out.others.push(c + ' ' + g.toFixed(1)); }
        catch (e) {}
      });
    } catch (e) { out.threw = e.message; }
    return out;
  }, FS);

  if (R.threw) { console.log('  THREW: ' + R.threw); process.exit(1); }

  /* --------------------------------------------------------------- registered */
  FS.forEach(c => {
    ok(c + ' is a real clip (in CLIPS and in the POSE table)',
       R.registered[c] && R.registered[c].clips && R.registered[c].pose);
  });
  ok('all three quantize to a full bar -- 120 BPM LAW (' +
     FS.map(c => c + ':' + R.beats[c]).join(' ') + ')',
     FS.every(c => R.beats[c] === 4));

  /* ------------------------------------------------------------------ renders */
  FS.forEach(c => {
    ok(c + ' draws a real body on all 8 facings (min ' + R.render[c].min + ' px over ' +
       R.render[c].n + ' frames)', R.render[c].min > 800);
  });

  /* ------------------------------------------------- it is actually an action */
  FS.forEach(c => {
    ok(c + ' is a different thing from standing still (' + R.sig[c].vsIdle + ' px vs idle)',
       R.sig[c].vsIdle > 600);
  });

  /* --------------------------------------------------- THE LOOP CLOSES (bug 3) */
  FS.forEach(c => {
    ok(c + ' returns to where it started, so the bar does not snap (gap ' +
       R.loop[c].toFixed(2) + 'px)', R.loop[c] < 2.0);
  });

  /* ------------------------------------------- THE THREE READ AS DIFFERENT ONES */
  const P = R.sig.pour, I = R.sig.inject, T = R.sig.tweeze;
  ok('POUR is the stillest of the three -- the hold is its tell (' +
     P.still + ' still keys vs ' + I.still + ' / ' + T.still + ')',
     P.still > I.still && P.still > T.still);
  /* AGAINST BOTH OF THEM, not just pour. The first cut of this line compared inject
     to pour only, and passed while tweeze's lift was FASTER than the jab -- so the
     gate's own header ("the fastest single keyframe move of the three") was a claim
     the check did not make. A check that is weaker than the sentence above it is how
     a header becomes a lie nobody notices. */
  ok('INJECT has the fastest single keyframe of the three -- the jab (' +
     I.peak.toFixed(1) + 'px vs ' + P.peak.toFixed(1) + ' / ' + T.peak.toFixed(1) + ')',
     I.peak > P.peak && I.peak > T.peak);
  ok('TWEEZE is the only one that trembles (' + T.rev + ' reversals vs ' +
     P.rev + ' / ' + I.rev + ')', T.rev >= 4 && T.rev > P.rev && T.rev > I.rev);
  /* AND THE JAB IS WHERE IT IS SUPPOSED TO BE. A clip could pass "fastest key" with
     one wild frame anywhere -- including a loop snap, which is exactly how the first
     cut of this gate was fooled. The procedure puts the needle in around the middle
     of the bar, so that is what is checked: the peak sits in the middle third, not at
     the ends where a discontinuity lives. */
  const mid = R.sig.inject.peakAt >= Math.floor(R.keys / 3) &&
              R.sig.inject.peakAt <= Math.ceil(R.keys * 2 / 3);
  ok('the jab lands mid-bar rather than at the loop seam (peak at key ' +
     R.sig.inject.peakAt + ' of ' + R.keys + ')', mid);

  ok('the page booted clean' + (errs.length ? ' (' + errs[0] + ')' : ''), errs.length === 0);

  console.log('  pose grid ' + R.keys + ' keys/bar   ' +
    FS.map(c => c + ': peak ' + R.sig[c].peak.toFixed(1) + ' still ' + R.sig[c].still +
                ' rev ' + R.sig[c].rev).join('   '));
  if (R.others.length)
    console.log('  FYI, not this gate\'s to fail -- clips whose loop does not close: ' +
      R.others.slice(0, 8).join(', ') + (R.others.length > 8 ? ' (+' + (R.others.length - 8) + ')' : ''));
  console.log('FIELD SURGERY GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
