#!/usr/bin/env node
/* BOHEMIA -- [the far stop's pixels counted] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 65a. 10/9/26.
 *
 * Counts distinct painted pixels at the demo's far zoom stop, armed by round one's school
 * (records/BOHEMIA_EYES_FAR_STOP_PIXELS_ROUND_1_SCHOOL_NEAREST_NEIGHBOR_HAS_A_NAME_10_9_26.md):
 * the row's own proposed method (unique colour values per 2x2 block) is the real, matched
 * detector for nearest-neighbor block-duplication upscaling, which is COOK's own documented
 * method for the far stop ("one flat colour plus ninety random rectangles" per cell, scaled up),
 * so this is implemented straight, not replaced with the heavier machinery built for smooth
 * (bilinear/bicubic) resampling we do not have.
 *
 * REACH: real touch gestures only, reusing tools/bohemia_drive_the_demo.js's proven toMap()
 * (gets on the map) then its own pinchOut() repeated until CZOOM stops falling -- the exact
 * method [zoom range measured] round three already proved reaches the camera's true floor
 * (0.208), not invented fresh here.
 *
 * READ: the canvas's own backing-store pixel buffer (getImageData on #cv, inside the city
 * iframe), which is the exact pixels the renderer drew, not a screenshot recompression of
 * them -- more precise than a screenshot, and a real screenshot is ALSO saved alongside it
 * for the VOTE record and as a human-checkable artifact, per rule 14g ("a screenshot is the
 * honest instrument").
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_far_stop_pixels');

/* THE ROW'S OWN METHOD, RUN INSIDE THE PAGE (not pulled out to Node first): a getImageData
   buffer at the far stop's resolution is multiple megapixels, and serialising that much data
   back over the browser protocol is its own kind of slow, fragile instrument. The counting
   runs where the pixels already are; only the small summary numbers cross the wire.
   Unique colour values per non-overlapping 2x2 block, summed. A fully uniform block
   (nearest-neighbor's own signature, per round one's sourcing) counts as ONE real painted
   pixel scaled to four; a block with four different values counts as four -- genuine native
   detail, same as markers, text and sprites drawn over the terrain. A second, cruder, free
   check rides along: how many wholly distinct colours exist anywhere in the frame, no
   blocking -- a flat-filled upscale has far fewer than real painted art. */
const COUNT_FN = function (w, h, data) {
  let distinct = 0, blocks = 0, uniformBlocks = 0;
  const key = (i) => data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
  for (let y = 0; y < h - 1; y += 2) {
    for (let x = 0; x < w - 1; x += 2) {
      const i00 = (y * w + x) * 4, i10 = (y * w + x + 1) * 4,
            i01 = ((y + 1) * w + x) * 4, i11 = ((y + 1) * w + x + 1) * 4;
      const s = new Set([key(i00), key(i10), key(i01), key(i11)]);
      distinct += s.size; blocks++; if (s.size === 1) uniformBlocks++;
    }
  }
  const uniq = new Set();
  for (let i = 0; i < w * h * 4; i += 4) uniq.add(data[i] + ',' + data[i + 1] + ',' + data[i + 2]);
  return { distinct, blocks, uniformBlocks, totalPx: blocks * 4, uniqueColours: uniq.size };
};

async function shoot(d, name, clip) {
  const p = path.join(OUTDIR, name + '.png');
  const opts = { path: p };
  if (clip) opts.clip = clip;
  await d.page.screenshot(opts);
  return p;
}

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const d = await D.open({ keepCards: true });
  const p = d.page;
  const report = { at: new Date().toISOString() };
  try {
    await p.waitForTimeout(1200);
    await throughTheTitle(p, 60000).catch(() => false);
    await p.waitForTimeout(600);
    const s0 = await d.toMap();
    report.toMapState = s0;
    const fr = d.fr || (await (async () => { for (const f of p.frames()) {
      if (await f.evaluate(() => typeof CZOOM !== 'undefined').catch(() => false)) return f; } return null; })());
    if (!fr) throw new Error('no city frame found after toMap()');

    /* SQUEEZE TO THE TRUE FLOOR, THE PROVEN WAY ([zoom range measured] round three): toMap()
       only promises czoom < 0.5, not the camera's own minimum; keep pinching out for real
       until CZOOM stops falling. */
    let czoom = s0.czoom, steps = 0;
    for (let i = 0; i < 10; i++) {
      await d.pinchOut();
      await p.waitForTimeout(900);
      const now = await fr.evaluate(() => (typeof CZOOM !== 'undefined' ? +CZOOM.toFixed(4) : null)).catch(() => null);
      steps++;
      if (now === null || now >= czoom - 1e-4) break;
      czoom = now;
    }
    report.farStopCzoom = czoom;
    report.squeezesToFloor = steps;
    console.log('  [driver] far stop reached: czoom ' + czoom + ' after ' + steps + ' extra squeeze(s)');
    await p.waitForTimeout(1500);

    /* THE CANVAS'S OWN BACKING BUFFER, READ AND COUNTED IN-PAGE -- the exact pixels the
       renderer drew, counted where they sit; only the summary crosses the wire. */
    const canvasRead = await fr.evaluate((countSrc) => {
      const cv = document.getElementById('cv');
      if (!cv) return null;
      const r = cv.getBoundingClientRect();
      const ctx = cv.getContext('2d');
      const img = ctx.getImageData(0, 0, cv.width, cv.height);
      const countFn = new Function('w', 'h', 'data', 'return (' + countSrc + ')(w, h, data);');
      const b2 = countFn(cv.width, cv.height, img.data);
      return { w: cv.width, h: cv.height,
        cssRect: { x: r.x, y: r.y, width: r.width, height: r.height }, b2 };
    }, COUNT_FN.toString());
    if (!canvasRead) throw new Error('no #cv canvas found inside the city frame');
    report.canvas = { w: canvasRead.w, h: canvasRead.h };
    const b2 = canvasRead.b2;
    report.canvasBuffer = { totalPx: canvasRead.w * canvasRead.h,
      distinctPainted2x2: b2.distinct, blocks: b2.blocks, uniformBlocks: b2.uniformBlocks,
      uniformBlockPct: +(100 * b2.uniformBlocks / b2.blocks).toFixed(2),
      uniqueColours: b2.uniqueColours };
    console.log('  [canvas buffer] ' + canvasRead.w + 'x' + canvasRead.h + ' = ' + report.canvasBuffer.totalPx
      + ' px; distinct (2x2 method) ' + b2.distinct + '; ' + report.canvasBuffer.uniformBlockPct
      + '% of 2x2 blocks are one flat colour; ' + b2.uniqueColours + ' unique colours total');

    /* REAL SCREENSHOTS FOR THE RECORD: the canvas region at device pixels, and the full phone
       profile (his 2.96 million target), both real captures, not synthetic. */
    const canvasPng = await shoot(d, 'far_stop_canvas', canvasRead.cssRect);
    const fullPng = await shoot(d, 'far_stop_full_phone', null);
    report.canvasPngBytes = fs.statSync(canvasPng).size;
    report.fullPngBytes = fs.statSync(fullPng).size;
    console.log('  [shot] far_stop_canvas.png (' + report.canvasPngBytes + ' B), far_stop_full_phone.png ('
      + report.fullPngBytes + ' B)');

    report.verdict = {
      cookTheoreticalFloor: 9216,
      battleBrothersFloorSourced: 2073600,
      ours2x2Count: b2.distinct,
      passesBattleBrothersFloor: b2.distinct >= 2073600
    };
  } catch (e) {
    report.error = e.message;
    console.log('  MEASURE STOPPED: ' + e.message);
  }
  try { await d.close(); } catch (e) {}
  fs.writeFileSync(path.join(OUTDIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('  report written: ' + path.join(OUTDIR, 'report.json'));
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
