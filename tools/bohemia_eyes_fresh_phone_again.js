#!/usr/bin/env node
/* BOHEMIA -- [a fresh phone judged again] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17. 10/10/26.
 *
 * Re-walks a wiped phone now that RUN's [a fresh phone sees the door] has shipped, armed by
 * round one's school
 * (records/BOHEMIA_EYES_FRESH_PHONE_AGAIN_ROUND_1_SCHOOL_THE_INSTRUMENT_ALREADY_EXISTS_10_10_26.md):
 *
 * REUSE-FIRST: PLUMBER's own tools/bohemia_first_load.js already built and proved the hard part
 * -- its ARM script installs a real PerformanceObserver on the browser's own standards-based
 * first-contentful-paint entry and polls requestAnimationFrame for the title's first visible
 * frame, the menu buttons' first visible frame, and window.__LOAD_READY. That exact ARM is
 * imported and reused unmodified here, so the fcp/title/buttons/ready numbers are the same
 * instrument PLUMBER's own 2.8s/67s came from, not a re-derived approximation.
 *
 * PLUMBER's own readOnce() closes the browser the moment `ready` fires, because its row never
 * needed to go further. This row's own words do: "walks the first tap." So this tool does its
 * own open() (not readOnce()), waits for the same ARM state PLUMBER's tool waits for, and only
 * THEN taps NEW GAME with a real touch (the exact button selector tools/bohemia_through_the_title.js
 * already proved, [data-k=new]) and times how long until the title visibly answers (classList
 * 'gone'), the single first-interaction latency round one's school scoped like the FID metric,
 * not a full-page INP sampler.
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { ARM } = require(path.join(ROOT, 'tools/bohemia_first_load.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_fresh_phone_again');

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const report = { at: new Date().toISOString() };
  const d = await D.open({ bare: true, file: 'BOHEMIA_DEMO.html', arm: ARM, throttle: 4, pages: true });
  const p = d.page;
  try {
    /* WAIT FOR EXACTLY WHAT PLUMBER'S OWN TOOL WAITS FOR -- same ARM, same state shape. */
    const t0 = Date.now();
    let T = null;
    while (Date.now() - t0 < 240000) {
      T = await p.evaluate(() => window.__BOOT_T ? Object.assign({}, window.__BOOT_T) : null).catch(() => null);
      if (T && T.ready !== null && T.title !== null && T.buttons !== null) break;
      await p.waitForTimeout(500);
    }
    T = T || {};
    report.fcp = T.fcp; report.title = T.title; report.buttons = T.buttons; report.ready = T.ready;
    console.log('  [timing] fcp ' + T.fcp + 'ms | title ' + T.title + 'ms | buttons ' + T.buttons + 'ms | ready ' + T.ready + 'ms');
    if (T.title === null || T.buttons === null || T.ready === null) {
      report.error = 'did not reach a full ready state inside the wait budget';
      console.log('  MEASURE STOPPED: ' + report.error);
    } else {
      await p.waitForTimeout(400);
      await p.screenshot({ path: path.join(OUTDIR, '1_title.png') });

      /* THE FIRST TAP, WITH A REAL TOUCH, ON THE EXACT BUTTON tools/bohemia_through_the_title.js
         ALREADY PROVES WORKS -- not a re-guessed selector. */
      const btn = await p.evaluate(() => {
        const t = document.getElementById('title');
        const b = t && (t.querySelector('.bm-start [data-k=new]') || t.querySelector('[data-k=new]'));
        if (!b) return null;
        const r = b.getBoundingClientRect();
        return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
      }).catch(() => null);
      if (!btn) {
        report.error = 'NEW GAME not found or not sized on the title (ready was true)';
        console.log('  MEASURE STOPPED: ' + report.error);
      } else {
        const tapT0 = Date.now();
        await p.touchscreen.tap(btn.x, btn.y).catch(() => p.mouse.click(btn.x, btn.y));
        /* FIRST TAP LATENCY: input to the next visible response, FID-shaped (round one's own
           scoping), polled every animation frame, not a coarse timer. */
        const gone = await p.evaluate(() => new Promise((resolve) => {
          const t0 = performance.now();
          const check = () => {
            const t = document.getElementById('title');
            if (!t || t.classList.contains('gone')) return resolve(performance.now() - t0);
            if (performance.now() - t0 > 20000) return resolve(null);
            requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        })).catch(() => null);
        report.firstTapLatencyMs = gone === null ? null : Math.round(gone);
        report.firstTapWallMs = Date.now() - tapT0;
        console.log('  [first tap] NEW GAME pressed; title answered in ' + report.firstTapLatencyMs + 'ms (input to next paint)');
        await p.waitForTimeout(600);
        await p.screenshot({ path: path.join(OUTDIR, '2_after_tap.png') });
      }
    }
  } catch (e) {
    report.error = e.message;
    console.log('  MEASURE STOPPED: ' + e.message);
  }
  try { await d.close(); } catch (e) {}
  fs.writeFileSync(path.join(OUTDIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('  report written: ' + path.join(OUTDIR, 'report.json'));
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
