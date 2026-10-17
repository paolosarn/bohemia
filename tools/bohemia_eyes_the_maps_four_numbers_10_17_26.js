#!/usr/bin/env node
/* BOHEMIA -- [the map's four numbers] (EYES AND EARS, lane 17, 10/17/26; rule 109(c))
 *
 * PAOLO 10/16: "our map has to be as big as fucking Battle Brothers and that's still not the case ...
 * I'm choosing Battle Brothers." Rule 109(c): THE FOUR NUMBERS ARE MEASURED (tiles across, days to
 * cross at walking speed, settlements and locations, the zoom's near and far stops), ours meets or
 * beats each as the bare minimum.
 *
 * THIS LANE'S OWN INSTRUMENT, NOT RUN'S SELF-REPORT: RUN's record prints its four numbers from its own
 * BOH_REGION.numbers(). This tool reads the same live page on his phone's profile (390x844 at 3x, the
 * driver's default) but gets to the map and to both zoom stops WITH REAL SQUEEZES (the driver's pinch
 * gesture), not by setting CZOOM, and counts the blocks across the glass from the camera state it
 * actually reached. Where a number comes from RUN's own function it is labelled so.
 *
 *   node tools/bohemia_eyes_the_maps_four_numbers_10_17_26.js
 *     -> records/eyes_map_four_numbers/{numbers.json, far_stop.png, near_stop.png, old_far_stop.png}
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records', 'eyes_map_four_numbers');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const report = { at: new Date().toISOString(), profile: 'phone_portrait 390x844 @3x (the driver default)' };
  const d = await D.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  try {
    const st0 = await d.toMap();                                    /* real squeezes until the map is proven up */
    report.afterToMap = st0;
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready))) break; await d.page.waitForTimeout(250); }
    report.regionReady = await fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready));
    report.runsOwnNumbers = await fr.evaluate(() => (window.BOH_REGION && BOH_REGION.ready) ? BOH_REGION.numbers() : null);
    report.glass = await fr.evaluate(() => ({ CVW, CVH, TW0, TH0, dpr: devicePixelRatio, cvW: document.getElementById('cv').width, cvH: document.getElementById('cv').height }));

    /* THE FAR STOP BY SQUEEZING: pinch until czoom stops moving (two squeezes with no change) */
    const czoom = async () => fr.evaluate(() => +CZOOM.toFixed(4));
    let z = await czoom(), same = 0, squeezes = 0;
    /* the driver's names: pinchOut = pinch(150,25), the squeeze toward the city/map (toMap's own gesture);
       pinchIn = pinch(25,150), the spread back toward the street */
    for (let i = 0; i < 14 && same < 2; i++) {
      await d.pinchOut(); squeezes++;
      await d.page.waitForTimeout(900);
      const z2 = await czoom();
      if (Math.abs(z2 - z) < 1e-4) same++; else same = 0;
      z = z2;
    }
    const far = await fr.evaluate(() => { const zb = zoomBounds(); return { czoom: +CZOOM.toFixed(4), zbFar: +zb[0].toFixed(4), zbNear: +zb[1].toFixed(4),
      blocksAcrossGlass: +(CVW / (TW0 * CZOOM)).toFixed(1), blocksDownGlass: +(CVH / (TH0 * CZOOM)).toFixed(1), blockPx: +(TW0 * CZOOM).toFixed(2), mode: MODE }; });
    report.farStopBySqueezing = Object.assign({ squeezes }, far);
    await d.shot(path.join(OUT, 'far_stop.png'));

    /* THE OLD FAR STOP (the valley fit to the glass, 104f's hazed picture): the engine's own first bound */
    /* the valley's own old bound: the region's zoomBounds returns Math.max(fitAll, oldFar * 0.5), so the old far stop is read back
       from the valley's own fit (the 96-block valley to the glass), the same formula the region uses for its own fit */
    report.oldFarStop = await fr.evaluate(() => { const zb = zoomBounds(); const n = om.n;
      const fitValley = Math.min(CVW / ((n + 1) * TW0), CVH / ((n + 1) * TH0));
      return { regionFar: +zb[0].toFixed(4), valleyFitZoom: +fitValley.toFixed(4), valleyBlocksAcrossGlassAtFit: +(CVW / (TW0 * fitValley)).toFixed(1), valleyN: n }; });
    /* THE NEAR STOP BY SPREADING: pinch out until czoom stops moving */
    z = await czoom(); same = 0; let spreads = 0;
    for (let i = 0; i < 40 && same < 2; i++) {
      await d.pinchIn(); spreads++;
      await d.page.waitForTimeout(900);
      const z2 = await czoom();
      if (Math.abs(z2 - z) < 1e-4) same++; else same = 0;
      z = z2;
      const m = await fr.evaluate(() => MODE);
      if (m !== 'city') { report.nearStopNote = 'the spread crossed the seam out of the map at czoom ' + z + ' (mode ' + m + '); the near stop is the last map reading'; break; }
    }
    const near = await fr.evaluate(() => ({ czoom: +CZOOM.toFixed(4), blocksAcrossGlass: +(CVW / (TW0 * CZOOM)).toFixed(2), blocksDownGlass: +(CVH / (TH0 * CZOOM)).toFixed(2), blockPx: +(TW0 * CZOOM).toFixed(1), mode: MODE }));
    report.nearStopBySpreading = Object.assign({ spreads }, near);
    await d.shot(path.join(OUT, 'near_stop.png'));

    /* THE CROSSING, costed the way a step is costed: rim to rim on the region's diagonal through the city, and the three farthest places */
    report.crossing = await fr.evaluate(() => {
      const R = BOH_REGION; const out = { places: [] };
      const far = R.places.slice().sort((a, b) => Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)) - Math.max(Math.abs(a.x - city.x), Math.abs(a.y - city.y)));
      for (const p of far.slice(0, 4)) { const pa = cityRoute(city.x, city.y, p.x, p.y); if (!pa) { out.places.push({ name: p.name, blocks: null }); continue; }
        let m = 0; for (let i = 1; i < pa.length; i++) m += cityStepMins(pa[i][0], pa[i][1]); out.places.push({ name: p.name, blocks: pa.length - 1, mins: m, days: +(m / 1440).toFixed(2) }); }
      out.settlementsInValley = (typeof ctBases === 'function' && ctBases()) ? Object.keys(ctBases()).length : null;
      out.placesInRegion = R.places.length; out.placeNames = R.places.map(p => p.name);
      out.stepMinsOpenBlock = (function(){ try { return cityStepMins(city.x, city.y); } catch (e) { return null; } })();
      return out; });
    report.errs = d.errs.slice(0, 5);
  } catch (e) { report.error = String(e && e.message || e); }
  fs.writeFileSync(path.join(OUT, 'numbers.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await d.close();
})();
