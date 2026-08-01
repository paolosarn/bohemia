/* BOHEMIA RENDER AUDIT (7/26/26) — catch the machine degrading approved art.
 *
 * Paolo, all day: the world looks like shit. The CITY tab turned out to be
 * bilinear-filtering every approved tile it drew, because it never set
 * imageSmoothingEnabled and took the browser default. Nobody found that by
 * reading code — another lane's gate tripped over it. That class of bug is
 * invisible in review and ruins the look everywhere at once.
 *
 * So stop reading code. INSTRUMENT THE REAL SURFACE: patch
 * CanvasRenderingContext2D before the app boots, record every drawImage the
 * game actually makes, and report the ones that damage pixel art:
 *
 *   SMOOTHED   drawn while imageSmoothingEnabled was true -> bilinear mush
 *   FRACTIONAL drawn at a non-integer x/y -> the browser resamples across
 *              two pixel columns; a 1px outline becomes a 2px smear
 *   SQUASHED   drawn at a destination aspect that is not the source aspect
 *              (beyond a hair) -> the art is literally the wrong shape
 *   UPSCALED   drawn much larger than the source with smoothing on
 *
 * It reports what the game DID, not what the source looks like it might do.
 *
 *   node tools/bohemia_render_audit.js <file.html> [--frame NAME] [--json out]
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const FILE = process.argv[2];
const FRAME = (process.argv.includes('--frame') && process.argv[process.argv.indexOf('--frame') + 1]) || null;
const JSONOUT = (process.argv.includes('--json') && process.argv[process.argv.indexOf('--json') + 1]) || null;
if (!FILE) { console.error('usage: node tools/bohemia_render_audit.js <file.html> [--frame NAME]'); process.exit(2); }

/* The probe, installed before ANY app script runs. It wraps drawImage on the
 * prototype, so every context in the page (and every iframe that inherits this
 * document's realm) is covered without the app knowing. */
const PROBE = `(() => {
  const P = CanvasRenderingContext2D.prototype;
  const orig = P.drawImage;
  const rec = { calls: 0, smoothed: 0, fractional: 0, squashed: 0, upsmoothed: 0, samples: {} };
  window.__RENDER_AUDIT = rec;
  const note = (kind, detail) => {
    rec[kind]++;
    const k = kind + '|' + detail;
    rec.samples[k] = (rec.samples[k] || 0) + 1;
  };
  P.drawImage = function (img, ...a) {
    rec.calls++;
    try {
      let sw, sh, dx, dy, dw, dh;
      const nw = img && (img.naturalWidth || img.videoWidth || img.width) || 0;
      const nh = img && (img.naturalHeight || img.videoHeight || img.height) || 0;
      if (a.length === 2) { dx = a[0]; dy = a[1]; dw = nw; dh = nh; sw = nw; sh = nh; }
      else if (a.length === 4) { dx = a[0]; dy = a[1]; dw = a[2]; dh = a[3]; sw = nw; sh = nh; }
      else if (a.length === 8) { sw = a[2]; sh = a[3]; dx = a[4]; dy = a[5]; dw = a[6]; dh = a[7]; }
      const smooth = this.imageSmoothingEnabled !== false;
      const scaled = Math.abs(dw - sw) > 0.01 || Math.abs(dh - sh) > 0.01;
      const tag = (img && img.__auditTag) || (img && img.src ? String(img.src).slice(0, 24) : (img && img.tagName) || '?');
      // SMOOTHED: only matters when the draw is actually resampling
      if (smooth && scaled) note('smoothed', Math.round(sw) + 'x' + Math.round(sh) + ' -> ' + Math.round(dw) + 'x' + Math.round(dh));
      // FRACTIONAL destination: resamples across pixel columns even at 1:1
      if (Math.abs(dx - Math.round(dx)) > 0.001 || Math.abs(dy - Math.round(dy)) > 0.001)
        note('fractional', 'dx/dy ' + (+dx).toFixed(2) + ',' + (+dy).toFixed(2));
      // SQUASHED: destination aspect != source aspect
      if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
        const ar = (dw / dh) / (sw / sh);
        if (ar < 0.97 || ar > 1.03)
          note('squashed', Math.round(sw) + 'x' + Math.round(sh) + ' -> ' + Math.round(dw) + 'x' + Math.round(dh) + ' (aspect x' + ar.toFixed(2) + ')');
      }
      // non-integer SCALE FACTOR with smoothing off still shreds pixel art
      if (scaled && sw > 0 && dw / sw > 1.001) {
        const f = dw / sw;
        if (Math.abs(f - Math.round(f)) > 0.02) note('upsmoothed', 'scale x' + f.toFixed(3) + ' (' + Math.round(sw) + ' -> ' + Math.round(dw) + ')');
      }
    } catch (e) { /* never break the game to measure it */ }
    return orig.apply(this, [img, ...a]);
  };
})();`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.addInitScript(PROBE);                     // before any app script
  await page.goto('file://' + path.resolve(FILE), { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  // dismiss a front splash if this surface has one
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1200);
  if (FRAME) {
    /* THE CITY TAB IS GONE (Paolo 8/2): the world is reached through RUN, which
       has routed to the city panel since 7/28. The FRAME asked for is still
       `city` - that is the iframe's id and it has not changed - but the BUTTON
       that opens it is RUN now. Tab and frame are no longer the same word. */
    const TAB = (FRAME === 'city') ? 'run' : FRAME;
    await page.click('.tab[data-p="' + TAB + '"]').catch(() => {});
    await page.waitForSelector('#' + FRAME + 'Frame', { timeout: 60000 }).catch(() => {});
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      const f = page.frames().find(fr => fr.name() === FRAME + 'Frame');
      if (f && await f.evaluate(() => !!window.__RENDER_AUDIT && window.__RENDER_AUDIT.calls > 0).catch(() => false)) break;
    }
  }
  // WALK: the tile art only draws once you are on foot. Drop in and take a few
  // real steps so the audit sees the surface Paolo actually looks at, not the
  // zoomed-out overview that draws almost nothing.
  if (process.argv.includes('--walk')) {
    const f = FRAME ? page.frames().find(fr => fr.name() === FRAME + 'Frame') : page.mainFrame();
    if (f) {
      const dropped = await f.evaluate(() => {
        try { if (typeof MODE !== 'undefined' && MODE === 'city') { swapMode(); render(); } return typeof MODE !== 'undefined' && MODE === 'human'; } catch (e) { return false; }
      }).catch(() => false);
      if (!dropped) console.log('  WARNING: the drop-in did not take — these numbers are the OVERVIEW, not the walked world');
      await page.waitForTimeout(3500);
      /* MEASURE ONE SURFACE. --walk is about the WALKED world, but the frames
       * before the drop-in are the city-builder OVERVIEW, whose iso projection
       * is fractional by design and is approved. Leaving them in made the total
       * depend on how many overview frames happened to render before the drop,
       * which swung the ratchet from 3.4% to 12.4% between runs on an unchanged
       * tree. Zero the counters once we are on foot. */
      await f.evaluate(() => { const r = window.__RENDER_AUDIT; if (r) { r.calls = 0; r.smoothed = 0; r.fractional = 0; r.squashed = 0; r.upsmoothed = 0; r.samples = {}; } }).catch(() => {});
      for (const di of [4, 4, 2, 2, 0, 6]) {
        await f.evaluate(d => { try { startHold(d); } catch (e) {} }, di).catch(() => {});
        await page.waitForTimeout(700);
        await f.evaluate(() => { try { endHold(); } catch (e) {} }).catch(() => {});
      }
    }
  }
  await page.waitForTimeout(4000);

  const targets = FRAME ? page.frames().filter(f => f.name() === FRAME + 'Frame') : [page.mainFrame()];
  let total = null;
  for (const t of targets) {
    const r = await t.evaluate(() => window.__RENDER_AUDIT || null).catch(() => null);
    if (r && r.calls) total = r;
  }
  if (!total) { console.log('no draws recorded (' + FILE + (FRAME ? ' / ' + FRAME : '') + ')'); await browser.close(); process.exit(1); }

  const pct = n => total.calls ? (100 * n / total.calls).toFixed(1) + '%' : '0%';
  console.log('RENDER AUDIT — ' + FILE + (FRAME ? '  [' + FRAME + ' tab]' : ''));
  console.log('  ' + total.calls + ' draws recorded');
  console.log('  SMOOTHED   ' + total.smoothed + ' (' + pct(total.smoothed) + ')  resampled with smoothing ON');
  console.log('  FRACTIONAL ' + total.fractional + ' (' + pct(total.fractional) + ')  drawn at a non-integer position');
  console.log('  SQUASHED   ' + total.squashed + ' (' + pct(total.squashed) + ')  destination aspect != source aspect');
  console.log('  NON-INT    ' + total.upsmoothed + ' (' + pct(total.upsmoothed) + ')  upscaled by a fractional factor');
  const worst = Object.entries(total.samples).sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (worst.length) { console.log('  worst offenders:'); for (const [k, n] of worst) console.log('    ' + String(n).padStart(6) + '  ' + k); }
  if (JSONOUT) require('fs').writeFileSync(JSONOUT, JSON.stringify(total, null, 1));
  await browser.close();
})();
