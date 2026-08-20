/* BOHEMIA FACE FEATURE SCALE GATE (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11: "maybe all eyes eyebrows and mouths should be twice the size idk"
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and this knob has exactly two
 * ways to be quietly wrong -- opposite ways, which is why both are asserted:
 *
 *   1. IT CHANGES CANON WHEN NOBODY ASKED. PUNK's spec is marked "VERBATIM from
 *      alpha vault (PUNK face, do not remake)". At scale 1 the rendered face must
 *      be BYTE-IDENTICAL to the face rendered with no knob at all. Not "looks the
 *      same" -- compared byte for byte across the whole 64x64 buffer.
 *
 *   2. IT IS A NO-OP THAT LOOKS LIKE A FEATURE. This is the one I actually
 *      shipped twice today on the age axis: a limb-stamp scale that moved the
 *      rest grid and moved the RENDER by zero pixels, and a dial bias that moved
 *      it by one. Both passed every gate in the repo, because no gate asked
 *      whether the pixels changed. So this one counts CHANGED PIXELS at each step
 *      and requires the change to grow monotonically with the dial. A knob that
 *      does nothing is a lie told to Paolo, and it is a lie a gate can catch.
 *
 * MEASURED ON THE REAL renderFace IN THE BOOTED ALPHA, never a re-implementation.
 *
 *   node gates/face_feature_scale_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 1500);

  const R = await page.evaluate(() => {
    if (typeof renderFace !== 'function') return { err: 'renderFace missing' };
    if (typeof faceFeatScale !== 'function') return { err: 'faceFeatScale missing' };
    const spec = (typeof buildSpec === 'function') ? buildSpec() : PUNK;
    const ramp = (typeof portraitRamp === 'function') ? portraitRamp() : undefined;
    const shot = feat => Array.from(renderFace(spec, (feat === null) ? { ramp: ramp } : { ramp: ramp, feat: feat }));
    const base = shot(null);            // no knob at all
    const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++; return n; };
    const out = { deflt: (typeof window.BOH_FACE_FEAT === 'number') ? window.BOH_FACE_FEAT : null,
      one: diff(base, shot(1)), steps: [] };
    for (const s of [1.25, 1.5, 1.75, 2]) out.steps.push({ s: s, d: diff(base, shot(s)) });
    /* THE SPEC ITSELF MUST NOT BE MUTATED. faceFeatScale copies; if it ever
       reached in and edited PUNK in place, every later render would inherit the
       last scale used and his canon face would be gone for the session. */
    const before = JSON.stringify(spec.eyes) + JSON.stringify(spec.brows) + JSON.stringify(spec.mouth);
    faceFeatScale(spec, 2);
    out.specIntact = (JSON.stringify(spec.eyes) + JSON.stringify(spec.brows) + JSON.stringify(spec.mouth)) === before;
    /* and the scaled copy really is bigger */
    const big = faceFeatScale(spec, 2);
    out.eyeW = [spec.eyes.w, big.eyes.w];
    out.mouthW = [spec.mouth.w, big.mouth.w];
    out.identity = (faceFeatScale(spec, 1) === spec);
    return out;
  });

  if (R.err) { console.log('  FAIL: ' + R.err); console.log('FACE FEATURE SCALE GATE: 0 passed, 1 failed'); await browser.close(); process.exit(1); }

  ok('the knob DEFAULTS TO 1 (' + R.deflt + ') — nothing Paolo has approved changes ' +
     'appearance until he picks a number', R.deflt === 1);
  ok('at scale 1 the face is BYTE-IDENTICAL to no knob at all (' + R.one + ' differing pixels) — ' +
     'PUNK is marked do-not-remake', R.one === 0);
  ok('scale 1 returns the spec BY IDENTITY, so the fast path really is a no-op', R.identity === true);
  ok('faceFeatScale never mutates the spec it is handed — a in-place edit would ' +
     'leave his canon face scaled for the rest of the session', R.specIntact === true);
  ok('the scaled copy is actually bigger (eye w ' + R.eyeW.join(' -> ') + ', mouth w ' +
     R.mouthW.join(' -> ') + ')', R.eyeW[1] > R.eyeW[0] && R.mouthW[1] > R.mouthW[0]);

  /* THE ANTI-NO-OP ASSERTION. Two "fixes" shipped today moved the rest grid and
     moved the render by 0 and 1 pixels. Green gates said nothing. Never again on
     this surface: the dial has to move real pixels, and move more of them the
     further it goes. */
  let mono = true, prev = 0, detail = [];
  for (const st of R.steps) { detail.push('x' + st.s + '=' + st.d + 'px'); if (st.d <= prev) mono = false; prev = st.d; }
  ok('every step CHANGES REAL PIXELS (' + detail.join(' ') + ') — a knob that renders ' +
     'identically at every setting is a no-op dressed as a feature', R.steps.every(s => s.d > 0));
  ok('the change grows with the dial, monotonically (' + detail.join(' ') + ')', mono);

  console.log('FACE FEATURE SCALE GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
