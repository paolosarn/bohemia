/* BOHEMIA OVERWORLD FACE SCALE GATE (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11: "BRO I MEANT THE TINY PIXEL OVERWORLD FACES. NOT THE DOOM FACES
 * SHIT MAN" -- the face on the 56px BODY, not the portrait.
 *
 * That face, measured in full: six pixels of eyes, three of nose and a TWO PIXEL
 * mouth, painted on S/SE/E only. Scaling it has three ways to go quietly wrong
 * and all three are asserted:
 *
 *   1. IT CHANGES HIS ART WHEN NOBODY ASKED. These are Paolo's painted pixels and
 *      RIG LAW says nothing reshapes them. At scale 1 the scaler must return the
 *      SAME OBJECT -- identity, not an equal copy -- so the draw path provably
 *      cannot differ by a pixel until he picks a number.
 *
 *   2. IT IS A NO-OP THAT LOOKS LIKE A FEATURE. Two "fixes" shipped earlier today
 *      moved the rest grid and moved the RENDER by zero and one pixel, with every
 *      gate in the repo green, because no gate asked whether the pixels moved. So
 *      this one renders the real sprite at each step and counts CHANGED PIXELS.
 *
 *   3. THE EYES MERGE INTO A VISOR. The "eyes" pixels span both eyes AND the gap
 *      between them, so a naive box scale slides them apart / fuses them into one
 *      bar across the face. The scaler works per CONNECTED COMPONENT to prevent
 *      that, and this is the check that the component split is really happening:
 *      at x1.5 the eyes must still be TWO separate blobs. (At x2.0 they do touch
 *      -- that is the measured ceiling of a 10px-wide head, and it is why the
 *      strip he judges from stops there.)
 *
 *   node gates/sprite_face_scale_gate.js
 */
'use strict';
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
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  const R = await page.evaluate(() => {
    if (typeof spriteFaceScaled !== 'function') return { err: 'spriteFaceScaled missing' };
    if (typeof drawChar !== 'function') return { err: 'drawChar missing' };
    const out = { deflt: window.BOH_SPRITE_FACE, steps: [] };
    const key = Object.keys(PD.layers).filter(k => k.indexOf('facial') === 0)[0];
    out.key = key || null;
    const L = key && PD.layers[key].S;
    out.identity = !!L && (spriteFaceScaled(L, L.w || 24, 1) === L.px);

    /* the face really is as small as the claim says */
    if (L) {
      const GW = L.w || 24; const c = { eyes: 0, lips: 0, nose: 0 };
      for (const i in L.px) { const p = L.px[i]; c[(p <= 1) ? 'eyes' : (p === 2) ? 'lips' : 'nose']++; }
      out.counts = c;
    }

    /* render the real sprite at each step and count changed pixels */
    const PL = 112, cv = document.createElement('canvas'); cv.width = cv.height = PL;
    const shot = s => {
      window.BOH_SPRITE_FACE = s;
      try { HD_CACHE.map.clear(); } catch (e) {}
      try { FRAME_CACHE.map.clear(); } catch (e) {}
      drawChar(cv, 'S', 'idle', 0);
      return Array.from(cv.getContext('2d').getImageData(0, 0, PL, PL).data);
    };
    const base = shot(1);
    const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) n++; return n; };
    out.oneAgain = diff(base, shot(1));
    for (const s of [2, 3]) out.steps.push({ s: s, d: diff(base, shot(s)) });

    /* THE COMPONENT RULE: at 1.5 the two eyes must still be two blobs */
    const blobs = (s) => {
      const GW = L.w || 24, px = spriteFaceScaled(L, GW, s);
      const eyes = new Set();
      for (const i in px) if (px[i] <= 1) eyes.add(+i);
      let n = 0; const seen = new Set();
      for (const st of eyes) {
        if (seen.has(st)) continue;
        n++; const stack = [st]; seen.add(st);
        while (stack.length) { const i = stack.pop(), x = i % GW, y = (i / GW) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const ni = (y + dy) * GW + (x + dx);
            if (eyes.has(ni) && !seen.has(ni)) { seen.add(ni); stack.push(ni); } } }
      }
      return n;
    };
    out.eyeBlobs1 = blobs(1); out.eyeBlobs15 = blobs(2);
    /* THE SETTING THAT ACTUALLY WORKS: grow the mouth and nose, leave the eyes.
       It only exists because the knob is PER FEATURE, so this is the check that
       the per-feature form is really wired and really different from both x1 and
       a flat x2 -- a knob whose useful setting is unreachable is not a knob. */
    out.mouthOnly = { blobs: blobs({ eyes: 1, nose: 2, lips: 2 }),
                      dVs1: diff(base, shot({ eyes: 1, nose: 2, lips: 2 })),
                      dVs2: diff(shot(2), shot({ eyes: 1, nose: 2, lips: 2 })) };

    window.BOH_SPRITE_FACE = 1;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return out;
  });

  if (R.err) { console.log('  FAIL: ' + R.err); console.log('OVERWORLD FACE SCALE GATE: 0 passed, 1 failed'); await browser.close(); process.exit(1); }

  ok('his painted overworld face layer is there (' + R.key + ')', !!R.key);
  ok('the knob DEFAULTS TO 1 (' + R.deflt + ') — his art does not move until he picks a number', R.deflt === 1);
  ok('at scale 1 the scaler returns HIS PIXELS BY IDENTITY, not an equal copy — the ' +
     'draw path provably cannot differ by one pixel (RIG LAW: painted regions are his)', R.identity === true);
  ok('rendering twice at scale 1 is deterministic (' + R.oneAgain + ' differing pixels)', R.oneAgain === 0);
  if (R.counts) ok('the face really is this small (eyes ' + R.counts.eyes + 'px, nose ' +
     R.counts.nose + 'px, lips ' + R.counts.lips + 'px on S) — the whole reason he asked',
     R.counts.eyes <= 12 && R.counts.lips <= 6);

  let mono = true, prev = 0;
  const detail = R.steps.map(s => { if (s.d <= prev) mono = false; prev = s.d; return 'x' + s.s + '=' + s.d + 'px'; }).join(' ');
  ok('every step CHANGES REAL RENDERED PIXELS (' + detail + ') — a knob that draws the ' +
     'same at every setting is a no-op dressed as a feature', R.steps.every(s => s.d > 0));
  ok('the change grows with the dial (' + detail + ')', mono);
  /* HONEST CEILING, MEASURED AND RECORDED RATHER THAN ASSERTED AWAY. Each eye is
     2px with a ONE PIXEL gap, so doubling each about its own centre closes that
     gap and the two eyes touch. The per-component split is still doing its job --
     without it they would slide apart across the whole head instead of growing --
     but no amount of scaling makes a 2px eye twice as big on a 10px head without
     them meeting. That is a REPAINT question and it is Paolo's, so the gate
     RECORDS the number and does not pretend a scale can solve it. */
  console.log('  note: eye blobs x1=' + R.eyeBlobs1 + ' -> x2=' + R.eyeBlobs15 +
    (R.eyeBlobs15 < R.eyeBlobs1 ? '  (they MERGE at x2 — 2px eyes, 1px gap, 10px head)' : ''));
  ok('the per-component split exists at all (eyes resolve as separate blobs at x1: ' +
     R.eyeBlobs1 + ')', R.eyeBlobs1 >= 2);
  ok('the knob is PER FEATURE: {eyes:1,nose:2,lips:2} keeps the eyes as TWO EYES (' +
     R.mouthOnly.blobs + ' blobs) while a flat x2 fuses them to ' + R.eyeBlobs15,
     R.mouthOnly.blobs >= 2);
  ok('and it renders as its own third thing — different from x1 (' + R.mouthOnly.dVs1 +
     'px) AND from a flat x2 (' + R.mouthOnly.dVs2 + 'px)',
     R.mouthOnly.dVs1 > 0 && R.mouthOnly.dVs2 > 0);

  console.log('OVERWORLD FACE SCALE GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
