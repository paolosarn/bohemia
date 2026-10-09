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
 * REACH: a real touch gesture only, reusing tools/bohemia_drive_the_demo.js's proven toMap(),
 * which already lands at czoom 0.208 -- the camera's own documented floor (zmin), confirmed by
 * [zoom range measured] round three's live reading and by the engine's own clamp. NOTHING
 * SQUEEZES PAST THAT LANDING: a first draft of this tool did, and it crossed the engine's own
 * seam guard into a different screen (the sky) while CZOOM's own number stayed frozen, caught
 * only by looking at the actual screenshot -- see the comment at the reach step below.
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
/* THE GLOBAL NUMBER, COMPARABLE TO COOK'S 9,216 AND THE GATE'S OWN 2,073,600 -- the 2x2 method
   above answers a LOCAL question (is this pixel a copy of its own immediate neighbour) and the
   99.87% finding on its own first run proved that question alone is not COOK's: COOK's number is
   how many truly independent source values exist before the WHOLE upscale, which needs the real
   repeat-block size, not an assumed 2x2. This is round one's second method, "downsample until it
   stops changing," run for real: try candidate block sizes, and for each one check whether every
   block really is one flat colour (a true k-times nearest-neighbor upscale would make it so); the
   smallest k with a near-total match is the real cell size, and distinct source pixels at that k
   is (w/k)*(h/k) blocks plus the handful of pixels that never fit the grid at all (markers, the
   phone overlay, real fine detail), counted individually since those ARE genuinely unique. */
const SWEEP_FN = function (w, h, data) {
  const candidates = [2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 48, 64];
  const out = [];
  for (const k of candidates) {
    let totalBlocks = 0, uniformBlocks = 0, nonUniformPx = 0;
    for (let by = 0; by < h; by += k) {
      const bh = Math.min(k, h - by);
      for (let bx = 0; bx < w; bx += k) {
        const bw = Math.min(k, w - bx);
        const base = (by * w + bx) * 4;
        const r0 = data[base], g0 = data[base + 1], b0 = data[base + 2], a0 = data[base + 3];
        let uniform = true, blockPx = 0;
        for (let yy = 0; yy < bh; yy++) {
          for (let xx = 0; xx < bw; xx++) {
            const i = ((by + yy) * w + (bx + xx)) * 4;
            blockPx++;
            if (data[i] !== r0 || data[i + 1] !== g0 || data[i + 2] !== b0 || data[i + 3] !== a0) uniform = false;
          }
        }
        totalBlocks++;
        if (uniform) uniformBlocks++; else nonUniformPx += blockPx;
      }
    }
    const matchPct = +(100 * uniformBlocks / totalBlocks).toFixed(2);
    const globalDistinct = uniformBlocks + nonUniformPx;
    out.push({ k, totalBlocks, uniformBlocks, matchPct, nonUniformPx, globalDistinct });
  }
  return out;
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

    /* DO NOT SQUEEZE AGAIN. toMap() already lands at czoom 0.208, the camera's own documented
       floor (zmin) from [zoom range measured] round three's own live reading -- the engine
       clamps CZOOM at zmin itself (z=Math.max(zmin,Math.min(zmax,z))), so toMap() cannot land
       short of it. A FIRST ATTEMPT HERE DID SQUEEZE AGAIN AND IT WAS WRONG, CAUGHT BEFORE
       SHIPPING: asking to zoom out further while already sitting at zmin does not fail quietly,
       it trips the engine's own seam guard (SEAM_GUARD, skyEnter()) and swaps the canvas to a
       different screen entirely -- a starfield and a moon, not the valley -- while CZOOM's own
       number stays frozen at 0.208, so the state read alone could not have caught it; only
       looking at the actual screenshot did. The fix is to not ask: toMap()'s own landing IS the
       far stop, and a SKY check below refuses the measurement outright if it ever happens again. */
    const skyCheck = await fr.evaluate(() => (typeof SKY !== 'undefined' ? !!SKY : null)).catch(() => null);
    if (skyCheck === true) throw new Error('toMap() landed in SKY mode, not the valley -- refusing '
      + 'to measure the wrong screen');
    report.farStopCzoom = s0.czoom;
    report.skyCheck = skyCheck;
    console.log('  [driver] far stop reached: czoom ' + s0.czoom + ' (no extra squeeze; SKY=' + skyCheck + ')');
    await p.waitForTimeout(1500);

    /* THE CANVAS'S OWN BACKING BUFFER, READ AND COUNTED IN-PAGE -- the exact pixels the
       renderer drew, counted where they sit; only the summary crosses the wire. */
    const canvasRead = await fr.evaluate(({ countSrc, sweepSrc }) => {
      const cv = document.getElementById('cv');
      if (!cv) return null;
      const r = cv.getBoundingClientRect();
      const ctx = cv.getContext('2d');
      const img = ctx.getImageData(0, 0, cv.width, cv.height);
      const countFn = new Function('w', 'h', 'data', 'return (' + countSrc + ')(w, h, data);');
      const sweepFn = new Function('w', 'h', 'data', 'return (' + sweepSrc + ')(w, h, data);');
      const b2 = countFn(cv.width, cv.height, img.data);
      const sweep = sweepFn(cv.width, cv.height, img.data);
      return { w: cv.width, h: cv.height,
        cssRect: { x: r.x, y: r.y, width: r.width, height: r.height }, b2, sweep };
    }, { countSrc: COUNT_FN.toString(), sweepSrc: SWEEP_FN.toString() });
    if (!canvasRead) throw new Error('no #cv canvas found inside the city frame');
    report.canvas = { w: canvasRead.w, h: canvasRead.h };
    report.blockSweep = canvasRead.sweep;
    const bestK = canvasRead.sweep.filter(r => r.matchPct >= 99).sort((a, b) => a.k - b.k)[0]
      || canvasRead.sweep.sort((a, b) => b.matchPct - a.matchPct)[0];
    report.bestBlockSize = bestK;
    console.log('  [block sweep] ' + canvasRead.sweep.map(r => 'k=' + r.k + ':' + r.matchPct + '%').join('  '));
    console.log('  [best fit] k=' + bestK.k + ' (' + bestK.matchPct + '% of blocks uniform), '
      + 'global distinct source pixels ~' + bestK.globalDistinct);
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
      localDistinct2x2: b2.distinct,
      note2x2: 'a LOCAL measure (is each pixel a copy of its own 2x2 neighbour), not the global '
        + 'source-pixel count COOK\'s 9,216 and the gate\'s 2,073,600 both mean',
      globalDistinctAtBestFit: bestK.globalDistinct,
      globalFitBlockSize: bestK.k,
      globalFitMatchPct: bestK.matchPct,
      passesBattleBrothersFloor: bestK.globalDistinct >= 2073600
    };
  } catch (e) {
    report.error = e.message;
    console.log('  MEASURE STOPPED: ' + e.message);
  }
  try { await d.close(); } catch (e) {}
  fs.writeFileSync(path.join(OUTDIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('  report written: ' + path.join(OUTDIR, 'report.json'));
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
