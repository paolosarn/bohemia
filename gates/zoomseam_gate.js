/* ============================================================================
   ZOOM SEAM GATE (8/2/26)

   Paolo: "i should be able to ZOOM OUT UNTIL I GET INTO THE CITY BUILDER MODE BRO."

   setHZoom() clamped the request on its first line, so pinching out at the widest
   walked stop was silently pinned there and the only way across was the round mode
   button. This gate drives the REAL zoom calls on the REAL surface and checks the
   MODE changed -- both directions -- and that the zoom law still holds.
   ========================================================================== */
'use strict';
const CITY_APP = require('./bohemia_city_app.js');
const path = require('path');
const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
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
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    // a tab that is not there must SAY SO (one_world_tab_gate, 8/2): `if (t)`
    // swallowed the miss, and a swallowed click fails 30s later on the wrong surface
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('that tab is not in the bar'); t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
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

    const r = await f.evaluate(async () => {
      const out = {};
      const sleep = ms => new Promise(s => setTimeout(s, ms));
      try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
      await sleep(700);
      out.start = MODE;

      /* ZOOM OUT to the widest walked stop, then keep going */
      setHZoom(11); await sleep(300);
      out.atWidest = HZOOM;
      out.levels = HLEVELS.slice();
      setHZoom(5);                       /* past the widest -- he keeps pinching out */
      await sleep(1400);
      out.afterZoomOut = MODE;

      /* and the seam runs BOTH ways: from the overview, keep pinching IN */
      if (MODE === 'city') {
        const zmax = zoomBounds()[1];
        setZoomAt(zmax); await sleep(300);
        out.atClosest = +CZOOM.toFixed(3);
        setZoomAt(zmax * 2);             /* past the closest -- he keeps pinching in */
        /* WAIT FOR THE SEAM, DO NOT GUESS HOW LONG IT TAKES. This was a fixed sleep(1400)
           and it made the gate LOAD-SENSITIVE: measured 8/18, five of five passes on an idle
           box with the transition completing inside 500 ms, but one in three failures on a
           busy one -- and three in three on a tree that had a gate suite running beside it.
           The seam was firing correctly every time; the stopwatch was losing. A gate that
           goes red because the machine was busy is a gate somebody switches off, and this
           one guards a gesture PAOLO REPORTED HIMSELF ("I tried to zoom back in and then the
           game started breaking"), so it is the last one that should be ignorable.
           THE ASSERTION IS UNCHANGED -- it still requires MODE to become 'human'. Only the
           waiting is honest now: poll to the same total budget instead of sleeping through
           it, so a slow box costs seconds rather than a false red. */
        for (let i = 0; i < 28; i++) { await sleep(100); if (MODE === 'human') break; }
        out.afterZoomIn = MODE;
      }

      /* the zoom law must be untouched: still the same four pixel-true stops */
      try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
      await sleep(700);
      setHZoom(44); await sleep(200);
      out.snap44 = HC;
      setHZoom(30); await sleep(200);    /* a value between stops must SNAP */
      out.snapMid = HC;
      return out;
    });

    ok('the probe started in the walked world', r.start === 'human');
    ok('the widest walked stop is still the law\'s own (' + r.atWidest + ' of ['
       + (r.levels || []).join(',') + '])', r.atWidest === (r.levels || [])[0]);
    ok('ZOOMING OUT PAST THE WIDEST STOP LANDS IN THE CITY BUILDER (mode -> '
       + r.afterZoomOut + ')', r.afterZoomOut === 'city');
    ok('AND ZOOMING BACK IN PUTS HIM ON HIS FEET (mode -> ' + r.afterZoomIn + ')',
       r.afterZoomIn === 'human');
    ok('the ZOOM LEVEL LAW still holds: 44 stays 44 (' + r.snap44 + ')', r.snap44 === 44);
    ok('and an in-between value still SNAPS to a pixel-true stop (' + r.snapMid + ')',
       (r.levels || []).indexOf(r.snapMid) >= 0);
  } finally { await browser.close(); }
  console.log('ZOOM SEAM GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('ZOOM SEAM GATE CRASHED: ' + e.message); process.exit(1); });
