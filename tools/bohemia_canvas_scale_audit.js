/* BOHEMIA CANVAS SCALE AUDIT (7/27/26) — measure the LAST blit, the one the
 * phone does, which no amount of reading render code can ever show you.
 *
 * tools/bohemia_render_audit.js instruments drawImage and catches the game
 * damaging its own art while drawing. It found a x1.375 resample of the whole
 * ground plane. But a canvas can draw every pixel perfectly and still arrive at
 * the eye as mush, because the browser scales the finished backing store into
 * the element's CSS box and then onto the device's pixel grid, using whatever
 * `image-rendering` says. That step happens after the game stops drawing, so it
 * is invisible to drawImage instrumentation AND to code review.
 *
 * This measures it. For every canvas on every tab, in every frame:
 *
 *   backing   cv.width x cv.height          (what the game drew into)
 *   css box   getBoundingClientRect()        (what the browser scales it to)
 *   ratio     css / backing                  (non-integer => uneven pixels)
 *   filter    computed image-rendering        (`auto` => bilinear mush)
 *   device    ratio * devicePixelRatio        (what the glass actually gets)
 *
 * A ratio that is not an integer means source pixels land on the screen at
 * different widths — a 1px outline is 3px here and 4px there, which reads as a
 * wobbly, badly-drawn sprite. `auto` at any upscale means bilinear filtering:
 * the art is softened no matter how sharp the canvas is.
 *
 *   node tools/bohemia_canvas_scale_audit.js <file.html> [--json out] [--tabs a,b]
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const FILE = process.argv[2];
const JSONOUT = (process.argv.includes('--json') && process.argv[process.argv.indexOf('--json') + 1]) || null;
const TABS = ((process.argv.includes('--tabs') && process.argv[process.argv.indexOf('--tabs') + 1]) ||
  'char,clothes,anim,rig,combat,city').split(',');
if (!FILE) { console.error('usage: node tools/bohemia_canvas_scale_audit.js <file.html>'); process.exit(2); }

/* runs inside each frame */
const SNAP = () => {
  const out = [];
  for (const cv of document.querySelectorAll('canvas')) {
    const r = cv.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;          // hidden / collapsed
    if (!cv.width || !cv.height) continue;
    out.push({
      id: cv.id || (cv.className && String(cv.className).split(' ')[0]) || '(anon)',
      bw: cv.width, bh: cv.height,
      cw: +r.width.toFixed(3), ch: +r.height.toFixed(3),
      sx: r.width / cv.width, sy: r.height / cv.height,
      filter: getComputedStyle(cv).imageRendering,
      dpr: window.devicePixelRatio,
    });
  }
  return out;
};

const isInt = v => Math.abs(v - Math.round(v)) <= 0.005;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + path.resolve(FILE), { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});          // dismiss the splash
  await page.waitForTimeout(1500);

  const rows = [];
  const collect = async (tab, mode) => {
    for (const f of page.frames()) {
      const r = await f.evaluate(SNAP).catch(() => []);
      for (const x of r) rows.push({ tab, mode, frame: f.name() || 'main', ...x });
    }
  };

  for (const t of TABS) {
    /* THE CITY TAB IS GONE (Paolo 8/2): the world is reached through RUN. The
       SURFACE is still called `city` -- that is the iframe's id and the name
       canvas_scale_gate looks these rows up by -- but the BUTTON that opens it
       is RUN now. Tab and surface are no longer the same word.
       AND THE CLICK NO LONGER SWALLOWS ITS OWN FAILURE. `.catch(() => {})` meant
       that when `.tab[data-p="city"]` stopped existing, this walked on, measured
       whatever panel happened to be open, and reported no walked world at all --
       three gate failures whose real cause was a click that never happened. */
    const BUTTON = (t === 'city') ? 'run' : t;
    await page.click('.tab[data-p="' + BUTTON + '"]');
    await page.waitForTimeout(t === 'city' ? 14000 : 4000);
    await collect(t, 'default');
    // the CITY tab has two completely different surfaces behind one canvas: the
    // builder overview and the walked world. They are allowed different filters,
    // so they have to be measured separately.
    if (t === 'city') {
      const f = page.frames().find(fr => fr.name() === 'cityFrame');
      if (f) {
        await f.evaluate(() => { try { if (typeof MODE !== 'undefined' && MODE === 'city') swapMode(), render(); } catch (e) {} }).catch(() => {});
        await page.waitForTimeout(3500);
        await collect(t, 'walked');
      }
    }
  }

  // de-dupe: the same canvas shows up once per frame sweep
  const seen = new Set(), uniq = [];
  for (const r of rows) {
    const k = [r.tab, r.mode, r.frame, r.id, r.bw, r.bh, r.cw, r.ch, r.filter].join('|');
    if (seen.has(k)) continue; seen.add(k); uniq.push(r);
  }

  let frac = 0, smooth = 0;
  console.log('CANVAS SCALE AUDIT — ' + FILE + '  (iPhone portrait, DPR 3)');
  for (const r of uniq) {
    // What lands on the GLASS is css/backing * devicePixelRatio. A CSS ratio of
    // x0.5 looks clean until you remember the phone is 3x: 0.5 * 3 = x1.5, and
    // half the source rows get duplicated and half do not.
    r.dx = r.sx * (r.dpr || 1); r.dy = r.sy * (r.dpr || 1);
    const bad = !isInt(r.dx) || !isInt(r.dy);
    const mush = !/pixelated|crisp/.test(r.filter) && r.dx > 1.01;
    if (bad) frac++;
    if (mush) smooth++;
    r.fractional = bad; r.smoothed = mush;
    console.log(
      '  ' + (bad ? 'FRAC ' : '     ') + (mush ? 'SMOOTH ' : '       ') +
      (r.tab + (r.mode === 'walked' ? '/walked' : '')).padEnd(14) +
      r.frame.padEnd(12) + r.id.padEnd(13) +
      (r.bw + 'x' + r.bh).padEnd(12) + '-> ' + (r.cw + 'x' + r.ch).padEnd(18) +
      'css x' + r.sx.toFixed(4) + '  glass x' + r.dx.toFixed(4) + '  ' + r.filter);
  }
  console.log('  ' + uniq.length + ' visible canvases · ' + frac + ' land on the glass at a fractional scale · ' +
    smooth + ' composited with smoothing');
  if (JSONOUT) require('fs').writeFileSync(JSONOUT, JSON.stringify(uniq, null, 1));
  await browser.close();
})();
