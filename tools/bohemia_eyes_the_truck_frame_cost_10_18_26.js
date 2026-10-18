#!/usr/bin/env node
/* BOHEMIA -- EYES [the new demo cut, measured] (10/18): THE RIG TRUCK'S FRAME COST ON THE MAP, AT THREE ZOOMS.
   The row's end state: 'the truck's frame cost measured on the map at three zooms'. Measured, never eyeballed.

   HOW: the COMMITTED demo (the one driver, tools/bohemia_drive_the_demo.js) on the phone profile at 4x CPU, the
   movers held still, the camera panned so the truck sits mid-glass, at the map's nearest zoom, its middle and its
   farthest (zoomBounds()). At each zoom, N whole-map render() calls WITH the rig truck and N with the old 6 x 4 box
   (window.__RIG_TRUCK swapped out, exactly as RUN's own before-and-after shot does), INTERLEAVED one by one so the
   box's speed drifting over the minute lands on both sides equally. The truck's cost is the median difference.
   A second, tighter number: the truck's own drawImage timed alone, 2,000 times, against the box's fillRect.

     node tools/bohemia_eyes_the_truck_frame_cost_10_18_26.js [renders=40]
   Writes records/target/BOHEMIA_EYES_THE_TRUCK_FRAME_COST_10_18_26.json. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/BOHEMIA_EYES_THE_TRUCK_FRAME_COST_10_18_26.json');
const N = +process.argv[2] || 40;
const THROTTLE = 4;

(async () => {
  process.chdir(ROOT);
  const d = await D.open({ throttle: THROTTLE, boot: 15000 * THROTTLE, settle: 22000 * THROTTLE });
  const fr = d.fr;
  await fr.evaluate(() => { try { moversAdvance = function () {}; } catch (_e) {} });
  /* the truck must be loaded, or every 'with' render draws the box and the difference is zero by construction */
  await fr.waitForFunction(() => window.__RIG_TRUCK && window.__RIG_TRUCK.complete && window.__RIG_TRUCK.naturalWidth > 0,
    null, { timeout: 60000 });
  const zooms = await fr.evaluate(() => { const zb = zoomBounds(); return [zb[0], (zb[0] + zb[1]) / 2, zb[1]]; });
  const rows = [];
  for (const z of zooms) {
    const r = await fr.evaluate(([z, n]) => {
      CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
      const L = om.layout, cy2 = Math.round(6 + cargo.t * (96 - 12));
      panX = -((L.fwyX - city.x) - (cy2 - city.y)) * TW / 2; panY = -((L.fwyX - city.x) + (cy2 - city.y)) * TH / 2;
      try { clampPan(); } catch (_e) {}
      const TRUCK = window.__RIG_TRUCK, BOX = { complete: false, naturalWidth: 0 };
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      const p = iso(L.fwyX, cy2, ox, oy);
      const onGlass = p.sx > 0 && p.sx < CVW && p.sy > 0 && p.sy < CVH;
      for (let i = 0; i < 4; i++) render();               /* warm both paths before the clock starts */
      const withT = [], withB = [];
      for (let i = 0; i < n; i++) {
        /* ABBA: the first run of 10/18 put the truck first in every pair and the box's render came out 126 ms
           SLOWER than the truck's, which no 18-point drawImage can cause: the second render of a pair pays for
           something the first left behind. Swapping the order every pair puts that cost on both sides. */
        const one = (img, arr) => { window.__RIG_TRUCK = img; const t = performance.now(); render(); arr.push(performance.now() - t); };
        if (i % 2) { one(BOX, withB); one(TRUCK, withT); } else { one(TRUCK, withT); one(BOX, withB); }
      }
      window.__RIG_TRUCK = TRUCK; render();
      /* the truck's own draw, alone: same call, same size, same smoothing switch, as the map makes it */
      const g = document.getElementById('cv').getContext('2d');
      const tw = 18, th = Math.round(18 * TRUCK.naturalHeight / TRUCK.naturalWidth);
      let t = performance.now();
      for (let i = 0; i < 2000; i++) { const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
        g.drawImage(TRUCK, Math.round(p.sx - tw / 2), Math.round(p.sy + 2 - th), tw, th); g.imageSmoothingEnabled = sm; }
      const truckDraw = (performance.now() - t) / 2000;
      t = performance.now();
      for (let i = 0; i < 2000; i++) { g.fillStyle = '#e8b048'; g.fillRect(p.sx - 3, p.sy - 2, 6, 4); }
      const boxDraw = (performance.now() - t) / 2000;
      render();
      const med = a => { const s = a.slice().sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
      const diffs = withT.map((v, i) => v - withB[i]);
      const first = withT.map((v, i) => i % 2 ? withB[i] : v), second = withT.map((v, i) => i % 2 ? v : withB[i]);
      return { zoom: z, onGlass, truckPx: [tw, th], renderWithTruckMs: med(withT), renderWithBoxMs: med(withB),
        truckCostMs: med(diffs), firstOfPairMs: med(first), secondOfPairMs: med(second), truckDrawAloneMs: truckDraw, boxDrawAloneMs: boxDraw, n };
    }, [z, N]);
    rows.push(r);
    console.log('zoom ' + r.zoom.toFixed(3) + (r.onGlass ? '' : ' (TRUCK OFF THE GLASS)') + ': render ' + r.renderWithTruckMs.toFixed(2)
      + ' ms with the truck, ' + r.renderWithBoxMs.toFixed(2) + ' ms with the box, median difference ' + r.truckCostMs.toFixed(3)
      + ' ms; the truck drawn alone ' + (r.truckDrawAloneMs * 1000).toFixed(1) + ' us (the box ' + (r.boxDrawAloneMs * 1000).toFixed(1) + ' us)');
  }
  const frameBudget = 1000 / 60;
  const worst = Math.max(...rows.map(r => r.truckCostMs));
  const line = 'THE RIG TRUCK ON THE MAP (4x phone profile, ' + N + ' interleaved renders a zoom): '
    + rows.map(r => 'zoom ' + r.zoom.toFixed(2) + ' ' + r.truckCostMs.toFixed(2) + ' ms').join(', ')
    + ' of a ' + frameBudget.toFixed(1) + ' ms frame; drawn alone ' + (Math.max(...rows.map(r => r.truckDrawAloneMs)) * 1000).toFixed(0) + ' us at worst.';
  console.log('\n' + line);
  fs.writeFileSync(OUT, JSON.stringify({ what: 'EYES [the new demo cut, measured]: the rig truck\'s frame cost on the demo map at three zooms',
    demoStamp: (fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO_STAMP.txt'), 'utf8') || '').trim(),
    throttle: THROTTLE, line, worstTruckCostMs: worst, frameBudgetMs: frameBudget, rows }, null, 2));
  console.log(path.relative(ROOT, OUT));
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
