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

  console.log('FULL PIXEL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FULL PIXEL GATE CRASHED: ' + e.message); process.exit(1); });
