/* ============================================================================
   FULL PIXEL GATE (7/31/26) — clause B1 of THE BUILT WORLD LAW.

   Paolo 7/31: "WHY WHEN I ZOOM IN ARE ALL THE QUALITY OF THE PIXELS OF THE TILES
   SO DOGSHIT??? WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF."

   There were TWO separate resamplings between his art and his eyes, and both had
   to be measured on a REAL high-DPI page to be seen at all -- neither shows up in
   a code read, and neither is fixed by imageSmoothingEnabled.

   1. THE CANVAS WAS NOT A DEVICE-PIXEL CANVAS.
        function fit(){ cv.width=cv.clientWidth; cv.height=cv.clientHeight; }
      The backing store was CSS pixels. On his phone (DPR 3) a 390x795 buffer was
      stretched by the BROWSER across 1170x2385 real pixels. That blur happens
      after the canvas is finished, on the way to the screen, so nothing you set
      inside the 2D context can prevent it.

   2. THE CELL WAS A FRACTION OF THE SCREEN, NOT A MULTIPLE OF THE ART.
        var CELL = Math.max(16, Math.floor(Math.min(cv.width/11, cv.height/11)));
      "Fit 11 tiles across" gives CELL=35 on a 390px canvas for a 44px source
      tile: every approved tile drawn at 0.795 scale, every frame.

   So this gate asserts the whole chain in ONE real browser at DPR 3, because that
   is the only place either defect is visible. VERIFY ON THE REAL SURFACE.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

function requirePlaywright() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  /* ---- source-level: the two lines that caused it may never come back ----- */
  const dev = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'), 'utf8');
  ok('the canvas buffer is scaled by devicePixelRatio',
     /cv\.width\s*=\s*Math\.round\(cv\.clientWidth\s*\*\s*DPR\)/.test(dev));
  ok('the old CSS-pixel canvas is gone (cv.width = cv.clientWidth)',
     !/cv\.width\s*=\s*cv\.clientWidth\s*;/.test(dev));
  ok('the cell is an integer multiple of the art, not a fraction of the screen',
     /var CELL = ART_PX \* zoomStep\(\)/.test(dev));
  ok('the old fit-11-tiles-across cell math is gone',
     !/Math\.floor\(Math\.min\(cv\.width\/11/.test(dev));
  ok('every zoom step is an integer ratio of the art (no fractional scales)',
     /var ZOOM_STEPS = \[/.test(dev) && /return z > 0 \? z : 1 \/ \(-z\)/.test(dev));

  /* ---- the real surface, at a real phone's pixel ratio -------------------- */
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html'));
    await page.waitForFunction(() => window.__RUN_READY === true, { timeout: 120000 });
    await page.waitForTimeout(800);

    const m = await page.evaluate(() => {
      const cv = document.querySelector('canvas');
      const g = cv.getContext('2d');
      const steps = [];
      if (typeof ZOOM_STEPS !== 'undefined') {
        const keep = ZOOM_I;
        for (let i = 0; i < ZOOM_STEPS.length; i++) { ZOOM_I = i; steps.push(ART_PX * zoomStep()); }
        ZOOM_I = keep;
      }
      return {
        dpr: window.devicePixelRatio,
        bw: cv.width, bh: cv.height, cw: cv.clientWidth, ch: cv.clientHeight,
        smoothing: g.imageSmoothingEnabled,
        art: typeof ART_PX !== 'undefined' ? ART_PX : null,
        cell: (typeof ART_PX !== 'undefined') ? ART_PX * zoomStep() : null,
        cells: steps,
      };
    });

    ok('no page errors at DPR 3', errs.length === 0);
    ok('the canvas backing store is FULL device resolution ('
       + m.bw + 'x' + m.bh + ' for ' + m.cw + 'x' + m.ch + ' @' + m.dpr + 'x)',
       m.bw === Math.round(m.cw * m.dpr) && m.bh === Math.round(m.ch * m.dpr));
    ok('smoothing is off on the world context', m.smoothing === false);
    ok('the art cell is 44px', m.art === 44);
    ok('the drawn cell is a whole multiple of the art (' + m.cell + ')',
       m.cell > 0 && (m.cell % m.art === 0 || (m.art % m.cell === 0)));
    const fractional = m.cells.filter(c => !(c % m.art === 0 || m.art % c === 0));
    ok('EVERY zoom step lands on a whole-pixel lattice (' + m.cells.join(', ') + ')'
       + (fractional.length ? ' -- fractional: ' + fractional.join(', ') : ''),
       fractional.length === 0);
  } finally {
    await browser.close();
  }

  /* ---- THE SURFACE HE ACTUALLY PLAYS ------------------------------------
     Everything above measures the RUN slice. He never opens it. The alpha routes
     the RUN tab to the CITY panel on purpose (his own 7/25 one-view ruling, and
     the alpha says so in a comment at the routing line), so the CITY renderer is
     the game and the run slice is a development surface.
     I fixed, measured, gated and shipped the DPR bug on the run slice and he
     replied "ALL THE FIXES I NEEDED TO SEE ARE NOT THERE!!!" -- because they
     genuinely were not. Measuring rigorously on the wrong canvas is not
     verification, it is a more convincing way to be wrong. So this gate now
     checks the CITY blob too, and that half is the half that matters. */
  const fsx = require('fs');
  const alpha = fsx.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  /* EXTRACT BY INDEX, NOT BY REGEX. The alpha is 42 MB and the base64 group is
     31 MB; a regex with a {5000,} quantifier over that blows the call stack before
     it ever matches. This gate crashed exactly that way on its first run. */
  let city = null;
  for (let ci = alpha.indexOf('CITY_B64'); ci >= 0; ci = alpha.indexOf('CITY_B64', ci + 1)) {
    /* the FIRST occurrence is inside a comment -- walk them until one is a real
       assignment followed by a quote and a long base64 run */
    const tail = alpha.slice(ci + 8, ci + 20);
    const eq = tail.indexOf('=');
    if (eq < 0) continue;
    const qi = tail.slice(eq).search(/['"`]/);
    if (qi < 0) continue;
    const start = ci + 8 + eq + qi + 1;
    const quote = alpha[start - 1];
    const end = alpha.indexOf(quote, start);
    if (end - start < 100000) continue;
    city = Buffer.from(alpha.slice(start, end), 'base64').toString('utf8');
    break;
  }
  ok('the alpha carries a readable CITY blob', !!city && city.length > 100000);
  if (city) {
    /* indexOf, NOT regex: this string is 23 MB and a regex with any backtracking
       on it blows the call stack. Plain substring search is O(n) and cannot. */
    ok('THE SURFACE HE PLAYS: the city canvas is sized in DEVICE pixels',
       city.indexOf('cv.width=Math.round(w*__DPR)') >= 0);
    ok('THE SURFACE HE PLAYS: the city context is scaled by the same factor',
       city.indexOf('setTransform(__DPR,0,0,__DPR,0,0)') >= 0);
    /* SCOPED TO fit(), not the whole blob. `cv.width=w; cv.height=h;` also appears
       in offscreen helper canvases (tile bakers, the house-preview strip) where
       sizing in CSS pixels is correct -- those are buffers, not the screen. Only
       the WORLD canvas must be device-resolution, so only fit() is checked. */
    const fi0 = city.indexOf('function fit(){ const st=');
    /* STRIP COMMENTS FIRST. The patch's own comment QUOTES the old line to explain
       what was wrong with it, so a raw search finds the prose and fails the very
       fix it is guarding. Third time this exact trap has bitten in this session:
       a gate must read CODE, never the story written next to it. */
    const fitCode = fi0 < 0 ? '' :
      city.slice(fi0, fi0 + 2400).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    ok('THE SURFACE HE PLAYS: the old CSS-pixel sizing is gone from fit()',
       fi0 >= 0 && fitCode.indexOf('cv.width=w; cv.height=h;') < 0);
    ok('THE SURFACE HE PLAYS: smoothing is off on the city world context',
       city.indexOf('__g.imageSmoothingEnabled=false') >= 0);
    /* the transform must be re-applied inside fit(), because assigning
       canvas.width RESETS the context state including the transform */
    const fi = city.indexOf('function fit(){ const st=');
    ok('the city re-applies the scale on every resize, not once at boot',
       fi >= 0 && city.slice(fi, fi + 1800).indexOf('setTransform(__DPR') >= 0);
  }

  console.log('FULL PIXEL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FULL PIXEL GATE CRASHED: ' + e.message); process.exit(1); });
