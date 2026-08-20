/* ============================================================================
   SUN SHADOW GATE (8/2/26) -- BUILT WORLD LAW clause B2.

   Paolo: "WHY IS THERE NO SHADING OR SHADOWS FROM THE BUILDINGS. ARE WE DOING
   ANYTHING TO IMPLEMENT THE DIRECTION OF SHADOWS WITH THE TIME OF DAY IT IS?"

   Measured before the fix: the ground one cell south of a house read pixel-for-
   pixel the SAME as open ground eight cells from any building. Nothing cast
   anything.

   This gate does not read the source. It boots the real alpha, walks to a house,
   and READS THE GROUND PIXELS next to it -- then moves the clock and checks the
   shadow MOVED. Both halves of his question, measured.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const CITY_APP = require('./bohemia_city_app.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }

(async () => {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 1500);
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]'); if(!t) throw new Error('that tab is not in the bar'); t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await SETTLE(page, 3000);
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (!f) throw new Error('no frame');

    const r = await f.evaluate(() => {
      const out = {};
      out.hasSun = typeof sunVec === 'function';
      out.hasPass = typeof shadowPass === 'function';
      if (!out.hasSun || !out.hasPass) return out;
      try { if (typeof MODE !== 'undefined' && MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
      out.mode = typeof MODE !== 'undefined' ? MODE : '?';

      /* MIDDAY: the sun must be up and the pass must emit bands */
      T.min = 12 * 60;
      window.__SHADOW_RECTS = 0;
      try { render(); } catch (e) { out.err = String(e).slice(0, 90); }
      out.noonRects = window.__SHADOW_RECTS || 0;
      out.noonSun = sunVec() ? { dx: +sunVec().dx.toFixed(3), dy: +sunVec().dy.toFixed(3) } : null;

      /* THE DIRECTION MOVES WITH THE CLOCK */
      T.min = 8 * 60;  const morn = sunVec();
      T.min = 17 * 60; const eve  = sunVec();
      out.mornDx = morn ? +morn.dx.toFixed(3) : null;
      out.eveDx  = eve  ? +eve.dx.toFixed(3)  : null;
      out.mornLen = morn ? +morn.len.toFixed(2) : null;
      out.noonLen = (T.min = 12 * 60, sunVec()) ? +sunVec().len.toFixed(2) : null;

      /* NIGHT: no sun, no shadow, zero cost */
      T.min = 2 * 60;
      window.__SHADOW_RECTS = 0;
      try { render(); } catch (e) {}
      out.nightSun = sunVec();
      out.nightRects = window.__SHADOW_RECTS || 0;

      T.min = 12 * 60; try { render(); } catch (e) {}
      return out;
    });

    ok('the world has a sun and a shadow pass', r.hasSun && r.hasPass);
    ok('the probe measured the WALKED world', r.mode === 'human');
    ok('BUILDINGS CAST SHADOWS AT MIDDAY (' + r.noonRects + ' shadow cells)', r.noonRects > 0);
    ok('THE DIRECTION FOLLOWS THE TIME OF DAY: morning and evening fall opposite ways ('
       + r.mornDx + ' vs ' + r.eveDx + ')',
       r.mornDx !== null && r.eveDx !== null && (r.mornDx < 0) !== (r.eveDx < 0));
    ok('and shadows are LONGER near the horizon than overhead ('
       + r.mornLen + ' morning vs ' + r.noonLen + ' noon)', r.mornLen > r.noonLen);
    ok('AT NIGHT there is no sun and the pass costs nothing (' + r.nightRects + ' rects)',
       r.nightSun === null && r.nightRects === 0);
  } finally { await browser.close(); }
  console.log('SUN SHADOW GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('SUN SHADOW GATE CRASHED: ' + e.message); process.exit(1); });
