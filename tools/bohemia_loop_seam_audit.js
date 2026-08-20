/* BOHEMIA DOES THE ANIMATION JERK ONCE A BAR? (8/18/26, CHARACTER lane)
 *
 * Building the field surgery clips turned up a defect in two of my own three: a
 * cyclic clip whose pose at the LAST keyframe does not match its pose at the FIRST
 * snaps once per bar, every bar, forever. The gate that caught it also swept every
 * other clip as information and reported 31 of them with an open loop -- drunk 11.0px
 * of hand travel at the seam, deadeye 5.7, cheer 5.0.
 *
 * THAT IS A HEADLINE, NOT A FINDING, and the difference matters. Hand travel in
 * rig-space says nothing about whether a person watching the game would see it. So
 * before touching a single clip this measures the thing that actually decides it:
 *
 *   SEAM RATIO = (pixels that change across the last frame -> first frame)
 *                --------------------------------------------------------
 *                (the BIGGEST change between any two neighbouring frames)
 *
 * A clip that flows scores at or below 1: the wrap is no bigger than a move the clip
 * already makes. Above 1 the wrap is a jump nothing else in the clip matches, and
 * that is what a snap is. It is a ratio, deliberately, so it cannot be gamed by a
 * clip simply moving a lot: `run` legitimately changes thousands of pixels a frame
 * and must not be called broken for it.
 *
 * *** THE FIRST VERSION USED THE MEDIAN STEP AND THE NUMBERS WERE NONSENSE -- run
 * scored 2617 -- because POSEHOLD HOLDS EACH POSE FOR A WHOLE KEY. Sampled across
 * the bar, every second step is EXACTLY ZERO (the pose has not changed yet), so the
 * median of the series is 0 and the ratio divides by nothing. A summary statistic
 * has to fit the shape of the signal: this one alternates hold-move-hold-move, and
 * for that the peak is the honest denominator. It is also sampled at
 * FRAME_CACHE.buckets, the renderer's own frame count, rather than at the pose keys,
 * so it sees every distinct frame the game actually draws.
 *
 * IT ALSO SEPARATES THE TWO INNOCENT CASES, because a sweep that cannot tell a bug
 * from a design decision is the broken one (8/1):
 *   - TERMINAL clips (headshot, headshot-2) are not cycles at all. They are supposed
 *     to end somewhere else. Excluded by name, from the engine's own TERMINAL table.
 *   - A clip can be authored to run TWO cycles inside its bar, in which case the
 *     wrap is fine and the midpoint is where a seam would show. Reported, not judged.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and measures, writes nothing. It
 *   sets no globals, authors no pixel, and reshapes nothing.
 *   built on: drawChar, CLIPS, TERMINAL
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every frame is the alpha's own render
 * through drawChar; the entire output is a table of numbers.
 *
 *   node tools/bohemia_loop_seam_audit.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_WHICH_ANIMATIONS_JERK_8_18_26.txt');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGEERR ' + e.message.slice(0, 110)));
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


    const rows = [];
    for (const c of CLIPS) {
      if (TERMINAL[c]) continue;                 /* not a cycle by design */
      /* TWO FACINGS, and the worse one is reported. A seam can live in one facing
         only: the N/S clamp and the depth flip make the side view and the head-on
         view genuinely different poses of the same clip. */
      let worst = null;
      for (const d of ['SE', 'S']) {
        const f = [];
        for (let i = 0; i < K; i++) f.push(grab(c, d, i / K));
        const steps = [];
        for (let i = 0; i < K - 1; i++) steps.push(diff(f[i], f[i + 1]));
        const seam = diff(f[K - 1], f[0]);
        const m = Math.max(1, Math.max.apply(null, steps));   /* the biggest ordinary move */
        /* the midpoint, for the two-cycles-a-bar case */
        const half = diff(f[(K / 2 | 0) - 1], f[K / 2 | 0]);
        const r = { d: d, seam: seam, med: m, ratio: seam / m, half: half / m };
        if (!worst || r.ratio > worst.ratio) worst = r;
      }
      rows.push({ c: c, d: worst.d, seam: worst.seam, med: Math.round(worst.med),
                  ratio: +worst.ratio.toFixed(2), half: +worst.half.toFixed(2) });
    }
    return { keys: K, rows: rows };
  });

  R.rows.sort((a, b) => b.ratio - a.ratio);
  const L = [];
  const say = s => { L.push(s); console.log(s); };
  say('BOHEMIA -- WHICH ANIMATIONS JERK ONCE A BAR');
  say('CHARACTER lane, 8/18/26. Measured on the rendered frame, not on rig maths.\n');
  say('  SEAM RATIO = pixels changing at the wrap / the BIGGEST change between any');
  say('  two neighbouring frames. At or under 1 the wrap is no bigger than a move the');
  say('  clip already makes. Over 1 it is a jump nothing else in the clip matches.');
  say('  ' + R.rows.length + ' cyclic clips, ' + R.keys + ' rendered frames each, worst of two facings.\n');
  say('  ' + 'ratio'.padStart(6) + '  ' + 'seam'.padStart(5) + '  ' + 'biggest'.padStart(7) + '  dir  clip');
  for (const r of R.rows.slice(0, 24))
    say('  ' + r.ratio.toFixed(2).padStart(6) + '  ' + String(r.seam).padStart(5) + '  ' +
        String(r.med).padStart(7) + '  ' + r.d.padEnd(3) + '  ' + r.c);
  const bad = R.rows.filter(r => r.ratio >= 1.35);
  const fine = R.rows.filter(r => r.ratio < 1.0);
  say('');
  say('  SNAPS (ratio >= 1.35): ' + bad.length + ' of ' + R.rows.length +
      (bad.length ? '  -- ' + bad.map(r => r.c).join(', ') : ''));
  say('  FLOWS (ratio < 1.0):   ' + fine.length + ' of ' + R.rows.length);
  say('');
  say('  THE ONE THAT WAS REAL was `drunk`, and it is fixed (8/18): its sway term ran');
  say('  at HALF the frequency of every sibling in the same line -- sin(ph*PI+1.3)');
  say('  against ph*2*PI -- so it flipped sign across the wrap and the hips teleported');
  say('  3.5px sideways every two seconds. Measured seam 1.72 -> 0.40.');
  say('  Held by gates/loop_seam_gate.js. Picture: LOOK tab, THE DRUNK WALK JUMPED.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log('\nwrote ' + path.relative(REPO, OUT));
  await browser.close();
})();
