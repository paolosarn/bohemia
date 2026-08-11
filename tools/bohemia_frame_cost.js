/* BOHEMIA FRAME COST (8/11/26, CITY lane) — WHAT DID I JUST COST THE PHONE?
 *
 * THE DEMO IS A WALKED DAY ON A PHONE (demo plan row 8: "district crossings don't
 * hitch"). This lane shipped two passes into the walked world this week -- the
 * DEAD (a placement pass per district cell plus a draw per remain) and the VISTA
 * (a camera move). Neither was ever measured against frame time, and a feature
 * that costs the demo its frame rate is not a feature, it is a regression with a
 * gate around it.
 *
 * SO THIS MEASURES THE THING THAT ACTUALLY HURTS, and it is not the average.
 * A phone that renders at 60 and hitches to 12 once per district crossing reads as
 * broken, while its mean frame time looks fine. What matters is:
 *
 *   p50   the ordinary frame
 *   p95   the frame you notice
 *   max   the hitch
 *   over  how many frames blew the 16.7 ms budget
 *
 * A/B AGAINST THE FEATURE ITSELF, not against a remembered number from yesterday.
 * The dead pass can be switched off in the live page, so the same session measures
 * with and without and the difference IS the cost. Comparing against a figure from
 * another build would be comparing two different worlds.
 *
 *   node tools/bohemia_frame_cost.js
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const FRAMES = 90;
const BUDGET = 16.7;                 // 60 fps. The 120 BPM LAW moves bodies, not pixels.

const MEASURE = (n) => new Promise(res => {
  const t = [];
  let last = performance.now(), left = n;
  function step() {
    const now = performance.now();
    t.push(now - last); last = now;
    if (--left > 0) { render(); requestAnimationFrame(step); }
    else res(t);
  }
  render(); requestAnimationFrame(step);
});

function stats(t) {
  const s = t.slice().sort((a, b) => a - b);
  const q = p => s[Math.min(s.length - 1, Math.floor(s.length * p))];
  return { p50: q(0.50), p95: q(0.95), max: s[s.length - 1],
           over: t.filter(v => v > 16.7).length, n: t.length };
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'),
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(8000);
  await page.evaluate(() => { if (typeof MODE !== 'undefined' && MODE === 'city') swapMode(); });
  await page.waitForTimeout(2500);

  await page.addScriptTag({ content: 'window.__MEASURE=' + MEASURE.toString() + ';' });

  /* STAND WHERE THE DEAD ACTUALLY ARE. Measuring frame cost on empty desert would
     measure nothing and pass, which is the shape of a probe that cannot fail. */
  const where = await page.evaluate(() => {
    for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
      const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
      if (o.length >= 4) { hx = tx * FN + o[0].x; hy = ty * FN + o[0].y; render(); return { tx, ty, n: o.length }; }
    }
    return null;
  });
  await page.waitForTimeout(800);

  const withDead = await page.evaluate(n => window.__MEASURE(n), FRAMES);
  /* switch the pass off IN THE LIVE PAGE and measure the same ground again */
  const off = await page.evaluate(() => {
    if (typeof deadDraw !== 'function') return false;
    window.__realDeadDraw = deadDraw; deadDraw = function () {}; return true;
  });
  await page.waitForTimeout(400);
  const without = off ? await page.evaluate(n => window.__MEASURE(n), FRAMES) : null;
  await page.evaluate(() => { if (window.__realDeadDraw) deadDraw = window.__realDeadDraw; });

  /* THE DISTRICT CROSSING, WHICH IS THE RISK THE DEMO PLAN ACTUALLY NAMES (row 8:
     "district crossings don't hitch on a phone") AND THE ONE MY FIRST CUT MISSED.
     Research on canvas cost pointed at the right thing: per-frame drawImage
     overhead is O(N) and only bites at hundreds of calls a frame, which the dead
     pass never makes. The expensive moment is COLD, not steady -- deadForCell runs
     a full 128x128 exposure census and a placement pass for a cell it has never
     seen, and the cache is only 64 deep. Standing still measures the cheap case
     and passes; the hitch is at the boundary.
     So: warm the cache, then step into UNVISITED cells and time the first frame in
     each. That is the frame the player feels. */
  const crossing = await page.evaluate(async () => {
    const cold = [];
    for (let k = 0; k < 8; k++) {
      const tx = 30 + k * 5, ty = 41;                 // eight cells never visited yet
      const t0 = performance.now();
      hx = tx * FN + 64; hy = ty * FN + 64;
      render();
      cold.push(performance.now() - t0);
      await new Promise(r => requestAnimationFrame(r));
    }
    /* and the same cells AGAIN, now that the cache holds them: the gap between the
       two is exactly what a first crossing costs. */
    const warm = [];
    for (let k = 0; k < 8; k++) {
      const tx = 30 + k * 5, ty = 41;
      const t0 = performance.now();
      hx = tx * FN + 64; hy = ty * FN + 64;
      render();
      warm.push(performance.now() - t0);
      await new Promise(r => requestAnimationFrame(r));
    }
    return { cold, warm };
  });

  /* AND THE VISTA, which is a one-off camera move rather than a per-frame cost --
     what matters there is how long the MOMENT takes to appear. */
  const vistaMs = await page.evaluate(() => {
    if (!window.__VISTA) return null;
    const t0 = performance.now(); const ok = window.__VISTA.open();
    const t1 = performance.now(); window.__VISTA.close();
    return ok ? (t1 - t0) : null;
  });

  await browser.close();

  const A = stats(withDead), B = without ? stats(without) : null;
  const f = v => v.toFixed(1).padStart(6);
  console.log('FRAME COST — walked world, iPhone portrait, ' + FRAMES + ' frames, 60fps budget ' + BUDGET + ' ms');
  console.log('  standing on ' + (where ? where.n + ' remains in cell ' + where.tx + ',' + where.ty : '(no dead found)'));
  console.log('                    p50     p95     max   over-budget');
  console.log('  dead ON     ' + f(A.p50) + '  ' + f(A.p95) + '  ' + f(A.max) + '   ' + A.over + '/' + A.n);
  if (B) {
    console.log('  dead OFF    ' + f(B.p50) + '  ' + f(B.p95) + '  ' + f(B.max) + '   ' + B.over + '/' + B.n);
    console.log('  THE DEAD COST  ' + (A.p50 - B.p50).toFixed(2) + ' ms at p50, ' +
      (A.p95 - B.p95).toFixed(2) + ' ms at p95');
  } else {
    console.log('  (could not switch the dead pass off — cost not isolated)');
  }
  if (vistaMs != null) console.log('  the vista opens in ' + vistaMs.toFixed(0) + ' ms (a one-off camera move)');
  let crossWorst = 0;
  if (crossing) {
    const C = stats(crossing.cold), Wm = stats(crossing.warm);
    crossWorst = C.max;
    console.log('  --- THE DISTRICT CROSSING (the hitch the demo plan names) ---');
    console.log('  first frame in a NEW cell   ' + f(C.p50) + '  ' + f(C.p95) + '  ' + f(C.max));
    console.log('  same cells, cache warm      ' + f(Wm.p50) + '  ' + f(Wm.p95) + '  ' + f(Wm.max));
    console.log('  A FIRST CROSSING COSTS      ' + (C.p50 - Wm.p50).toFixed(1) + ' ms at p50, worst ' +
      (C.max - Wm.max).toFixed(1) + ' ms');
  }

  /* a hitch is judged on the crossing, not the average: 100 ms is six dropped
     frames in a row and that is what reads as broken. */
  const bad = A.p95 > BUDGET * 1.5 || (B && (A.p50 - B.p50) > 4) || crossWorst > 100;
  console.log(bad ? '  VERDICT: this lane is costing the phone real frames.'
                  : '  VERDICT: within budget on this hardware.');
  process.exit(0);
})();
