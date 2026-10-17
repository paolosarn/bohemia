#!/usr/bin/env node
/* EYES [the map's four numbers]: WHAT THE GLASS SHOWS ON THE WAY TO THE FAR STOP.
   The first run (tools/bohemia_eyes_the_maps_four_numbers_10_17_26.js) squeezed to the region's far stop (czoom 0.1076)
   and the canvas showed the moon and black space with a sliver of planet at the bottom, not the region's 202 blocks.
   This run steps the camera from the old valley stop to the region's stop with the pan reset to zero at each step and
   photographs each, and separately records where the real squeezes left the pan, so the finding is "what the far
   stop draws" and not "where a squeeze gesture happened to pan to".
     node tools/bohemia_eyes_the_far_stop_steps_10_17_26.js -> records/eyes_map_four_numbers/step_<czoom>.png, steps.json */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records', 'eyes_map_four_numbers');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const rep = { at: new Date().toISOString(), steps: [] };
  const d = await D.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  try {
    await d.toMap();
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready))) break; await d.page.waitForTimeout(250); }
    /* squeeze to the stop with the real gesture, then read the pan it left */
    for (let i = 0; i < 6; i++) { await d.pinchOut(); await d.page.waitForTimeout(700); }
    rep.afterSqueezes = await fr.evaluate(() => ({ czoom: +CZOOM.toFixed(4), panX: Math.round(panX), panY: Math.round(panY), city: [city.x, city.y], mode: MODE,
      sky: (typeof SKY !== 'undefined') ? String(SKY).slice(0, 40) : undefined }));
    const zb = await fr.evaluate(() => zoomBounds().map(v => +v.toFixed(4)));
    rep.zoomBounds = zb;
    const list = [0.5, 0.2234, 0.167, 0.14, 0.12, zb[0]];
    for (const z of list) {
      const s = await fr.evaluate((z) => { try { skyExit(); } catch (e) {} CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0; try { clampPan(); } catch (e) {} render();
        return { czoom: +CZOOM.toFixed(4), panX: Math.round(panX), panY: Math.round(panY), blocksAcrossGlass: +(CVW / (TW0 * CZOOM)).toFixed(1), regionPxWide: Math.round(BOH_REGION.D * TW0 * CZOOM), regionPxTall: Math.round(BOH_REGION.D * TH0 * CZOOM) }; }, z);
      await d.page.waitForTimeout(900);
      const f = path.join(OUT, 'step_' + s.czoom.toFixed(4) + '_skyoff.png');
      await d.shot(f);
      /* what the canvas holds: share of near-black pixels (space) against everything else, read from the canvas itself */
      s.darkShare = await fr.evaluate(() => { const cv = document.getElementById('cv'), g = cv.getContext('2d'); const w = cv.width, h = cv.height; const im = g.getImageData(0, 0, w, h).data; let dark = 0, n = 0;
        for (let i = 0; i < im.length; i += 4 * 7) { n++; if (im[i] < 24 && im[i + 1] < 24 && im[i + 2] < 24) dark++; } return +(dark / n).toFixed(3); });
      s.file = path.basename(f); rep.steps.push(s); console.log(JSON.stringify(s));
    }
    /* the real squeezes' pan, photographed as it was */
    await fr.evaluate((p) => { CZOOM = p.czoom; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = p.panX; panY = p.panY; render(); }, rep.afterSqueezes);
    await d.page.waitForTimeout(900);
    await d.shot(path.join(OUT, 'far_stop_as_squeezed_2.png'));
    rep.errs = d.errs.slice(0, 5);
  } catch (e) { rep.error = String(e && e.message || e); }
  fs.writeFileSync(path.join(OUT, 'steps_skyoff.json'), JSON.stringify(rep, null, 2));
  console.log(JSON.stringify(rep, null, 2));
  await d.close();
})();
