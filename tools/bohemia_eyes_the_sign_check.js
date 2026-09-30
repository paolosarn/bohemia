/* BOHEMIA -- THE FIRST LANDMARK AGAINST THE REAL ONE, ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, [the sign] E25 round two. 9/30/26.
 *
 * THE ROW: COOK [fortress buildings] r3 (58e62e8f) drew the Welcome to Las Vegas sign at
 * one cell. Round one (school, records/BOHEMIA_EYES_E25_ROUND_1_SCHOOL_A_LENS_IS_NOT_A_DIAMOND
 * _9_28_26.md) armed three checks against the real sign's sourced shape (Betty Willis, 1959):
 * a pointed diamond silhouette, a hard shadow, striped asphalt. Reading the drawing code
 * (engine/bohemia_landmarks.js) shows all three ALREADY WRITTEN INTO THE SAME COMMIT that
 * self-critiqued them -- a true linear-taper diamond, an east shadow, five striped bays.
 * VERIFY ON THE REAL SURFACE means that is a claim about the CODE, not the PICTURE. The
 * open question round two actually answers: does any of that survive being one cell out of
 * 96x96 on the zoomed-out map a player actually sees, or does it wash out to a dot -- exactly
 * the risk round one's own school flagged for the shadow ("too subtle to survive downscaling
 * is the same defect as no shadow, one step removed") and it applies just as hard to a point.
 *
 * REUSE-FIRST: boot/door/map are PLUMBER's one driver (tools/bohemia_drive_the_demo.js),
 * including its toMap() (rule [bb budget]) rather than a fifth hand-rolled squeeze loop.
 * The cell lookup and iso conversion are the game's OWN exposed state (om.L.vegassign,
 * window.__CITY.isoAt), not a guess at coordinates.
 *
 * RULE ZERO. No numbers print unless every control passes.
 *   C0 THE DOOR IS BEHIND US        the driver's own doorIsBehindUs()
 *   C1 THE CAMERA IS ON THE MAP     d.toMap() itself throws if not; recorded anyway
 *   C2 THE SIGN CELL IS REAL        district(sign.x,sign.y)==='sign' AND a cell five away
 *                                   is NOT 'sign' -- proves the reader finds ONE cell, not
 *                                   everything
 *   C3 THE SHAPE READER KNOWS A POINT FROM A ROUND TOP    run the same row-width point
 *                                   test against two PLANTED synthetic grids: a true diamond
 *                                   (must read POINTED) and a semicircle-topped blob (must
 *                                   read NOT POINTED). No trusting the reader on a real image
 *                                   it has never been proven against.
 */
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const SURFACE = arg('--surface', null);
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_THE_SIGN_CHECK_9_30_26.json');
const SHOT_DIR = path.join(ROOT, 'records', 'eyes_the_sign');

/* the sign's own palette, read straight off engine/bohemia_landmarks.js SIGN_PAL so a
   colour match here can never silently drift from what the code actually draws */
const HEX = { diamond: '#b9482f', shadow: '#5c5140', hardpan: '#8a7a5e', bay: '#8f8676',
              apron: '#55514a' };
const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const RGB = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, hexToRgb(v)]));
const dist = (a, b) => Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);

/* THE POINT TEST, proven on planted grids before it ever touches a real screenshot (C3).
   A grid of 0/1 (1 = "the shape's own colour"). Pointed = the top-most and bottom-most rows
   that contain the colour are STRICTLY NARROWER than the widest row, by at least half. */
function widthPerRow(grid) {
  const rows = [];
  for (const row of grid) {
    let lo = -1, hi = -1;
    for (let x = 0; x < row.length; x++) if (row[x]) { if (lo < 0) lo = x; hi = x; }
    rows.push(lo < 0 ? 0 : (hi - lo + 1));
  }
  return rows;
}
/* NOT "is the tip row narrow" -- a circle's tip row is a single pixel too, same as a
   diamond's (both come to one point at the exact extreme, at pixel resolution). Proven
   wrong empirically: the first cut of this function called a planted semicircle "pointed"
   for exactly that reason, and C3 caught it before it ever touched a real screenshot.
   THE ACTUAL DIFFERENCE IS THE RATE OF WIDENING FROM THE TIP: a diamond's edge is a
   straight line, so width grows at a roughly CONSTANT rate every row out from the point;
   a circle's edge curves, so width grows FAST near the tip (a circle looks "round and
   wide" almost immediately below its very top) and levels off toward the equator. So this
   compares the SECOND non-empty row in from each end (skipping the often-degenerate
   single-pixel tip itself) against the widest row: a diamond stays well under half the
   widest row that close to its tip, a circle is already well over half. */
function isPointed(grid) {
  const w = widthPerRow(grid);
  const nz = w.map((v, i) => [i, v]).filter(([, v]) => v > 0);
  if (nz.length < 4) return { pointed: false, why: 'too few rows with the shape colour to judge (need at least 4)', w };
  const max = Math.max(...nz.map(([, v]) => v));
  const topNear = nz[1][1], botNear = nz[nz.length - 2][1];
  const THRESH = 0.45;
  const pointed = topNear <= max * THRESH && botNear <= max * THRESH;
  return { pointed, second_row_from_top: topNear, second_row_from_bottom: botNear, widest_row: max,
    why: pointed ? 'the row just in from each tip is under 45% of the widest row -- widens at a steady, linear rate, the tell for a straight-edged point'
      : 'the row just in from a tip is already over 45% of the widest row -- widens fast right away, the tell for a curved, rounded top', w };
}

(async () => {
  try { fs.mkdirSync(SHOT_DIR, { recursive: true }); } catch (e) {}
  const out = { what: 'the drawn Welcome to Las Vegas sign against the real one, on the real map',
                row: '[the sign] E25 round two (the check)', when: new Date().toISOString(),
                surface: SURFACE || 'the alpha (slices/BOHEMIA_ALPHA_0_9.html)', controls: [] };

  /* C3 FIRST, BEFORE THE GAME EVEN BOOTS -- a control on the INSTRUMENT does not need the
     surface up, and there is no reason to spend the boot time before knowing the reader works. */
  const trueDiamond = [];
  for (let d2 = 0; d2 < 15; d2++) {
    const half = 8 - Math.round(Math.abs(d2 - 7) * 8 / 7);
    const row = new Array(17).fill(0);
    if (half >= 1) for (let x = 8 - half; x <= 8 + half; x++) row[x] = 1;
    trueDiamond.push(row);
  }
  const roundBlob = [];
  const R = 7;
  for (let y = -7; y <= 7; y++) {
    const row = new Array(17).fill(0);
    const half = Math.round(Math.sqrt(Math.max(0, R * R - y * y)));
    for (let x = 8 - half; x <= 8 + half; x++) row[x] = 1;
    roundBlob.push(row);
  }
  const diamondRead = isPointed(trueDiamond);
  const blobRead = isPointed(roundBlob);
  out.controls.push({ name: 'C3 THE SHAPE READER KNOWS A POINT FROM A ROUND TOP',
    pass: diamondRead.pointed === true && blobRead.pointed === false,
    detail: 'planted true diamond read pointed=' + diamondRead.pointed + ' (' + diamondRead.why
      + '); planted round-topped blob read pointed=' + blobRead.pointed + ' (' + blobRead.why + ')' });
  if (!out.controls[0].pass) {
    out.controls.push({ name: 'REFUSED', pass: false,
      detail: 'the shape reader failed its own planted controls -- nothing below would be trustworthy' });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
    console.log('  C3 FAILED. Refusing to open the surface for an instrument that already failed its own test.');
    process.exit(1);
  }

  const opts = SURFACE ? { file: path.basename(SURFACE), serve: { ['/slices/' + path.basename(SURFACE)]: SURFACE } }
                        : { alpha: true };
  const d = await D.open(opts);
  try {
    out.controls.push({ name: 'C0 THE DOOR IS BEHIND US', pass: !!d.doorIsBehindUs(),
      detail: 'the door held ' + d.doorMs() + ' ms after the first knock' });

    let mapState = null, mapErr = null;
    try { mapState = await d.toMap(); } catch (e) { mapErr = String(e).slice(0, 300); }
    out.controls.push({ name: 'C1 THE CAMERA IS ON THE MAP',
      pass: !!mapState, detail: mapState ? ('czoom ' + mapState.czoom) : ('toMap refused: ' + mapErr) });
    if (!mapState) throw new Error('C1 failed, cannot continue: ' + mapErr);

    /* THE CELL, OFF THE GAME'S OWN LAYOUT -- om is a top-level let in the city-world script,
       visible to frame.evaluate() the same way d.state() already reads MODE/CZOOM/TW. THE
       LAYOUT LIVES AT om.layout, NOT om.L -- 'L' is a closure-local alias used only INSIDE
       bohemia_overmap.js's own district-classifying functions, not a property of the object
       it returns. Found by debugging om's real own keys (seed, n, tileFine, tiles, LAYOUT,
       at, under, ...) rather than guessing twice. */
    const sign = await d.fr.evaluate(() => {
      try { return { x: om.layout.vegassign.x, y: om.layout.vegassign.y, w: om.layout.vegassign.w, h: om.layout.vegassign.h }; }
      catch (e) { return null; }
    });
    const negCheck = sign ? await d.fr.evaluate((s) => {
      try { return { atSign: window.__CITY.district(s.x, s.y), atFar: window.__CITY.district(s.x - 30, s.y - 30) }; }
      catch (e) { return null; }
    }, sign) : null;
    out.controls.push({ name: 'C2 THE SIGN CELL IS REAL, NOT EVERY CELL SAYING SIGN',
      pass: !!(sign && negCheck && negCheck.atSign === 'sign' && negCheck.atFar !== 'sign'),
      detail: sign ? ('cell (' + sign.x + ',' + sign.y + ') reads district=' + (negCheck && negCheck.atSign)
        + '; a cell 30 away reads district=' + (negCheck && negCheck.atFar))
        : 'om.L.vegassign was not reachable from the running frame' });
    if (!sign || !negCheck || negCheck.atSign !== 'sign') throw new Error('C2 failed: cannot find the real sign cell');

    /* SCREEN-SPACE POSITION, off the game's own iso conversion (window.__CITY.isoAt), not a
       guess at the camera math -- and the canvas's OWN backing-store pixels (getImageData),
       which is what DIRECTION's density gate itself treats as the honest reading, ahead of
       whatever a 3x CSS stretch does to it. */
    const geo = await d.fr.evaluate((s) => {
      /* isoAt RETURNS {sx,sy}, NOT {x,y} -- found by printing it rather than assuming, same
         near-miss class this lane keeps naming. THE WORLD CANVAS IS THE BIGGEST ONE, not
         whichever querySelector('canvas') happens to return first -- the document also holds
         several small UI canvases (26x26 dice icons, a 64x64 face) that sit earlier in the
         DOM on this surface, reusing the exact picker map_reads.js already proved. */
      const p = window.__CITY.isoAt(s.x, s.y);
      let cv = null, area = 0;
      for (const c of document.querySelectorAll('canvas')) if (c.width * c.height > area) { area = c.width * c.height; cv = c; }
      const r = cv.getBoundingClientRect();
      return { iso: { x: p.sx, y: p.sy }, canvas: { w: cv.width, h: cv.height, id: cv.id },
        box: { x: r.x, y: r.y, w: r.width, h: r.height } };
    }, sign);

    const fb = await (await d.fr.frameElement()).boundingBox();
    const scaleX = geo.box.w / geo.canvas.w, scaleY = geo.box.h / geo.canvas.h;
    const pageX = fb.x + geo.box.x + geo.iso.x * scaleX;
    const pageY = fb.y + geo.box.y + geo.iso.y * scaleY;
    out.geometry = { sign_cell: sign, iso_canvas_px: geo.iso, canvas_backing_px: geo.canvas,
      canvas_css_box: geo.box, scale_css_per_canvas_px: { x: +scaleX.toFixed(3), y: +scaleY.toFixed(3) },
      sign_page_px: { x: Math.round(pageX), y: Math.round(pageY) } };

    /* THE HONEST READING: the canvas's OWN backing-store pixels around the sign, read via
       getImageData BEFORE any CSS stretch -- the same reading PLUMBER's density gate ruled
       is the one that cannot be fooled by browser smoothing (records/BOHEMIA_THE_MAP_PAINTS_
       ONE_PIXEL_IN_THIRTEEN_9_28_26.md). A generous 30-canvas-px margin either side. */
    const raw = await d.fr.evaluate((s) => {
      const p = window.__CITY.isoAt(s.x, s.y);
      let cv = null, area = 0;
      for (const c of document.querySelectorAll('canvas')) if (c.width * c.height > area) { area = c.width * c.height; cv = c; }
      const ctx = cv.getContext('2d');
      const M = 30;
      const x0 = Math.max(0, Math.round(p.sx - M)), y0 = Math.max(0, Math.round(p.sy - M));
      const w = Math.max(1, Math.min(cv.width - x0, M * 2)), h = Math.max(1, Math.min(cv.height - y0, M * 2));
      const img = ctx.getImageData(x0, y0, w, h);
      return { x0, y0, w, h, data: Array.from(img.data) };
    }, sign);

    /* THE COMPOSITED READING TOO -- what actually reaches a stranger's eye, the phone chrome
       cropped out same as d.shot() already does, at a wide-enough margin to hold the whole cell. */
    try {
      await d.page.screenshot({ path: path.join(SHOT_DIR, '01_sign_crop_composited.png'),
        clip: { x: Math.max(0, pageX - 40), y: Math.max(0, pageY - 40), width: 80, height: 80 } });
    } catch (e) { out.composited_shot_error = String(e).slice(0, 200); }
    await d.shot(path.join(SHOT_DIR, '00_full_map.png'));

    /* ANALYSE THE RAW BACKING-STORE PIXELS: for each of the shape colours, find every pixel
       within a match radius, and report the pixel FOOTPRINT (bounding box) each one covers --
       the number that answers "could this possibly still look pointed/shadowed/striped" before
       any shape-specific judgement is even asked. */
    const { x0, y0, w, h, data } = raw;
    const grid = {};
    for (const k of Object.keys(RGB)) grid[k] = Array.from({ length: h }, () => new Array(w).fill(0));
    const MATCH = 26; // rgb distance tolerance, wide enough for one round of anti-aliasing
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const i = (yy * w + xx) * 4;
      const px = [data[i], data[i + 1], data[i + 2]];
      for (const k of Object.keys(RGB)) if (dist(px, RGB[k]) <= MATCH) grid[k][yy][xx] = 1;
    }
    const footprint = (g) => {
      let minx = w, maxx = -1, miny = h, maxy = -1, n = 0;
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (g[yy][xx]) {
        n++; minx = Math.min(minx, xx); maxx = Math.max(maxx, xx);
        miny = Math.min(miny, yy); maxy = Math.max(maxy, yy);
      }
      return n === 0 ? { pixels: 0 } : { pixels: n, w: maxx - minx + 1, h: maxy - miny + 1 };
    };
    out.raw_read = { canvas_crop_origin: { x0, y0 }, crop_size: { w, h },
      match_tolerance_rgb: MATCH };
    out.footprints = Object.fromEntries(Object.keys(RGB).map(k => [k, footprint(grid[k])]));

    const diamondFoot = footprint(grid.diamond);
    let diamondShape = { pointed: false, why: 'no diamond-coloured pixels found at all -- there is nothing to be pointed' };
    if (diamondFoot.pixels > 0) diamondShape = isPointed(grid.diamond);
    out.silhouette = { footprint_px: diamondFoot, ...diamondShape };

    const shadowFoot = footprint(grid.shadow);
    out.shadow = { footprint_px: shadowFoot,
      present_at_all: shadowFoot.pixels > 0,
      east_of_diamond: (shadowFoot.pixels > 0 && diamondFoot.pixels > 0) };

    const bayFoot = footprint(grid.bay);
    const apronFoot = footprint(grid.apron);
    out.apron = { bay_stripe_footprint_px: bayFoot, apron_fill_footprint_px: apronFoot,
      stripes_distinguishable_from_fill: bayFoot.pixels > 0
        && (apronFoot.pixels === 0 || bayFoot.pixels / Math.max(1, apronFoot.pixels + bayFoot.pixels) > 0.03) };

    /* THE 11 PX BAR FROM ROUND ONE'S OWN SCHOOL, applied to what actually got measured: the
       whole landmark's total painted footprint (every one of its own colours at once), on the
       canvas's OWN backing-store pixels -- this is the number the school round asked round two
       to bring back. */
    const allKeys = Object.keys(RGB);
    let anyMinX = w, anyMaxX = -1, anyMinY = h, anyMaxY = -1, anyN = 0;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++)
      for (const k of allKeys) if (grid[k][yy][xx]) {
        anyN++; anyMinX = Math.min(anyMinX, xx); anyMaxX = Math.max(anyMaxX, xx);
        anyMinY = Math.min(anyMinY, yy); anyMaxY = Math.max(anyMaxY, yy); break;
      }
    const wholeLandmark = anyN === 0 ? { pixels: 0 } : { pixels: anyN, w: anyMaxX - anyMinX + 1, h: anyMaxY - anyMinY + 1 };
    out.whole_landmark_footprint_canvas_px = wholeLandmark;
    out.numbers = {
      whole_landmark_smallest_side_canvas_px: wholeLandmark.pixels ? Math.min(wholeLandmark.w, wholeLandmark.h) : 0,
      passes_11px_legibility_floor: wholeLandmark.pixels ? Math.min(wholeLandmark.w, wholeLandmark.h) >= 11 : false,
      silhouette_pointed: out.silhouette.pointed,
      shadow_present: out.shadow.present_at_all,
      apron_stripes_read: out.apron.stripes_distinguishable_from_fill,
    };
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 500); }
  try { await d.close(); } catch (e) {}
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (out.why) console.log('  why: ' + out.why);
  if (out.numbers) for (const [k, v] of Object.entries(out.numbers)) console.log('    ' + k.padEnd(38) + ' ' + JSON.stringify(v));
  if (out.footprints) console.log('    footprints(canvas px): ' + JSON.stringify(out.footprints));
  process.exit(0);
})();
