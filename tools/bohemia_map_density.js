/* HOW MANY PIXELS THE MAP REALLY PAINTS (PLUMBER 9/28/26, row [density leg], rule 38a)
   ================================================================================
   Paolo 9/28: "how many pixels the Battle Brothers map is and we need to have that
   exact same number at the bare minimum... that has to happen like now."
   DIRECTION [bb density] wrote THE MAP FLOOR (records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md):
     1. one painted pixel per screen pixel at the default map zoom: the map canvas
        renders at the device pixel ratio;
     2. no flat-colour cells;
     3. the measure: mean flat-colour run <= 1.5 device px on both axes.

   A FLAT RUN is a stretch of pixels of exactly one colour along a row (X) or a column
   (Y). Mean run = pixels / number of runs. One run per pixel is full detail (1.0); a
   picture blown up 3x with no smoothing reads 3.0. Checked against DIRECTION's own
   filed frame (records/target/DIRECTION_THE_MAP_TODAY_9_24.png): this reads it 3.79 x 3.51,
   their record says 3.8 x 3.5.

   *** AND THE GLASS READING CAN BE PASSED BY BLUR, SO THE VERDICT DOES NOT USE IT. ***
   Measured 9/28 on the demo's opening view: the map canvas is 378 pixels wide, shown
   1134 device pixels wide (a 3x stretch), and the browser SMOOTHS the stretch. Smoothing
   makes neighbouring device pixels differ by a shade, and a shade reads as a new run:
   the glass reads 1.15 x 1.11, under the floor, while the canvas's own pixels read
   1.21 x 1.18 painted pixels per run, each one shown 3 device pixels wide: 3.6 x 3.5
   device pixels per painted unit. So the verdict reads THE CANVAS'S OWN PIXELS and
   multiplies by how many device pixels each one covers. The glass number is still
   printed, labelled, so it can be compared with DIRECTION's 9/24 frame.

   What this still cannot see, stated: a canvas at full resolution that draws small
   textures blown up WITH smoothing has the same blur inside its own pixels. Floor
   item 2 (no flat-colour cells) is the rule against that; a measure that proves it
   would read detail by frequency, not by runs, and is named OWED in the gate.

   node tools/bohemia_map_density.js      demo and alpha, opening zoom and far stop
   require(...).measureMap(driver)        one reading of whatever the map shows now
   require(...).runs(rgba, w, h, tol)     the pure measure
   ================================================================================ */
'use strict';
const path = require('path');

/* The pure measure. tol 0 is DIRECTION's exact-colour reading; a larger tol treats a
   difference of that many levels as the same colour, which is printed alongside so a
   grain filter cannot pass for painted detail unnoticed. */
function runs(d, w, h, tol) {
  tol = tol || 0;
  let sx = h, sy = w;
  const diff = (i, j) => Math.max(Math.abs(d[i] - d[j]), Math.abs(d[i + 1] - d[j + 1]),
    Math.abs(d[i + 2] - d[j + 2])) > tol;
  for (let y = 0; y < h; y++) for (let x = 1; x < w; x++) { const i = (y * w + x) * 4; if (diff(i, i - 4)) sx++; }
  for (let y = 1; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (diff(i, i - w * 4)) sy++; }
  return [w * h / sx, w * h / sy];
}

/* Decode a PNG in the browser (no image library in this repo's node) and read its runs. */
async function pngRuns(ctx, buf, tol) {
  const p = await ctx.newPage();
  try {
    return await p.evaluate(async ([b64, src, t]) => {
      const R = eval('(' + src + ')');
      const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
      const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const dd = g.getImageData(0, 0, c.width, c.height).data;
      return { w: c.width, h: c.height, run: R(dd, c.width, c.height, 0), runTol: R(dd, c.width, c.height, t) };
    }, [buf.toString('base64'), runs.toString(), tol || 2]);
  } finally { await p.close(); }
}

/* One reading of the map the driver is showing now. The map canvas is found, not
   assumed: the biggest visible canvas in the city frame, so a renamed canvas does not
   silently measure nothing. */
async function measureMap(d) {
  const state = await d.state();
  const cv = await d.fr.evaluate((src) => {
    const R = eval('(' + src + ')');
    const vis = [...document.querySelectorAll('canvas')].map(c => ({ c, r: c.getBoundingClientRect() }))
      .filter(o => { const s = getComputedStyle(o.c); return s.display !== 'none' && s.visibility !== 'hidden'
        && +s.opacity > 0 && o.r.width * o.r.height > 20000; })
      .sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
    if (!vis.length) return null;
    const { c, r } = vis[0];
    let own = null, kind = 'other';
    try { const g = c.getContext('2d'); if (g) { kind = '2d';
      const dd = g.getImageData(0, 0, c.width, c.height).data;
      own = { run: R(dd, c.width, c.height, 0), runTol: R(dd, c.width, c.height, 2) }; } } catch (e) { kind = 'unreadable'; }
    return { id: c.id, w: c.width, h: c.height, x: r.x, y: r.y, cw: r.width, ch: r.height,
      dpr: devicePixelRatio, kind, own };
  }, runs.toString());
  if (!cv) return { state, canvas: null };
  /* device pixels each painted pixel covers, on each axis */
  const per = [cv.cw * cv.dpr / cv.w, cv.ch * cv.dpr / cv.h];
  const fb = await (await d.fr.frameElement()).boundingBox();
  const png = await d.page.screenshot({ clip: { x: fb.x + cv.x, y: fb.y + cv.y, width: cv.cw, height: cv.ch } });
  const glass = await pngRuns(d.ctx, png, 2);
  return {
    state, canvas: cv, per,
    /* THE VERDICT NUMBER: device pixels per painted unit, from the canvas's own pixels */
    device: cv.own ? [cv.own.run[0] * per[0], cv.own.run[1] * per[1]] : null,
    deviceTol: cv.own ? [cv.own.runTol[0] * per[0], cv.own.runTol[1] * per[1]] : null,
    /* DIRECTION's reading, off the glass, for comparison only (blur passes it) */
    glass: glass.run, glassTol: glass.runTol,
  };
}

const fmt = (a) => a ? a.map(v => v.toFixed(2)).join(' x ') : 'n/a';
function line(tag, m) {
  if (!m.canvas) return tag + ': NO MAP CANVAS FOUND';
  return tag.padEnd(22) + ' czoom ' + String(m.state.czoom).padEnd(6)
    + ' canvas ' + (m.canvas.w + 'x' + m.canvas.h).padEnd(9) + ' shown ' + (m.canvas.cw * m.canvas.dpr + 'x' + m.canvas.ch * m.canvas.dpr).padEnd(10)
    + ' PAINTED UNIT ' + fmt(m.device) + ' device px   (glass reads ' + fmt(m.glass) + ')';
}

/* the two views every surface is read at: the zoom the map opens on, and the far stop */
async function readSurface(open, which) {
  const d = await open(which === 'alpha' ? { alpha: true, runtab: true } : {});
  try {
    await d.page.waitForTimeout(3000);
    for (let i = 0; i < 4; i++) { if ((await d.state()).mode === 'city') break; await d.pinchOut(); }
    await d.page.waitForTimeout(1500);
    const opening = await measureMap(d);
    await d.toMap(); await d.page.waitForTimeout(1500);
    const far = await measureMap(d);
    return { opening, far, says: d.says() };
  } finally { await d.close(); }
}

module.exports = { runs, pngRuns, measureMap, readSurface, line, fmt };

if (require.main === module) {
  const { open } = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
  (async () => {
    console.log('\nTHE MAP FLOOR (DIRECTION 9/28): one painted unit per 1.5 device px or finer, the canvas at the phone\'s own pixels\n');
    for (const which of ['demo', 'alpha']) {
      const r = await readSurface(open, which);
      console.log(line(which + ' opening zoom', r.opening));
      console.log(line(which + ' far stop', r.far));
    }
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
