/* ==========================================================================
   THE FAR END AT THE PHONE'S PIXELS  (RUN, 10/10/26, VAMILY [the far end at two million pixels], rules 60, 65, 88)

   PAOLO (10/1, 10/2 twice, 10/4): "how many pixels is the Battle Brothers map, we haven't made any progress."
   MEASURED FIRST, on his phone's profile at the far stop: the city in the middle is painted at twelve texels a
   block (0.93 phone pixels a texel), but the land around it, most of the glass, is baked at two texels a block:
   5.6 phone pixels a texel, stair-stepped ranges. And the city stood on a raised plate (DIRECTION af0287b2): the
   land in front of it was allowed to rise toward the camera at 0.38 a block, close enough to the camera's own 0.5
   that the ramp was squeezed into a band a quarter of its run: a wall.
   NOW (__THE_FAR_END_AT_THE_PHONES_PIXELS__, __NO_SLAB__, the map): when the camera is still, the worker paints the
   land on the glass one sample per phone pixel from the bake's own heights, lake and roads, with relief under a block;
   the bake's picture shows while the camera moves; the land in front of the city rises at 0.14 a block.

   LEGS, on the demo at the far stop, phone portrait:
     P1 *** THE LAND IS PAINTED AT THE PHONE'S PIXELS *** (the mean run of identical pixels on the land, the
        same crop with and without: DIRECTION's 3a reading, floor 1.5)
     P2 *** THE MAP AT THE FAR STOP IS PAINTED AT ITS OWN PIXELS OVER AT LEAST 2,073,600 PHONE PIXELS ***
        (Battle Brothers' 1920 x 1080: the land painted 1:1 plus the city's painting, inside the glass)
     P3 the ranges stand where the bake put them (the two pictures agree at a block's scale)
     P4 *** NO SLAB *** the land in front of the city rises gently enough to read as ground (the ramp's band on
        the glass is at least 0.6 of its run; it was 0.24)
     P5 it is painted off the page (the worker) and laid in quickly (the page's part under 150 ms)
     P6 while the camera moves the bake still covers the land (no hole at the glass's corners)
     P7 nothing threw
   node gates/the_far_end_at_the_phones_pixels_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE FAR END AT THE PHONE\'S PIXELS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const r2 = v => Math.round(v * 100) / 100;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  try {
    for (let i = 0; i < 90; i++) { if (await fr.evaluate(() => !!(window.VB && VB.day && VB.seed === om.seed))) break; await d.page.waitForTimeout(500); }
    await fr.evaluate(() => { SKY = false; setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render(); });
    let landed = false;
    for (let i = 0; i < 80 && !landed; i++) { landed = await fr.evaluate(() => !!(VBC.day && VBC.seed === om.seed) && VBV.lands > 0 && VBV.key === vbViewKey()); if (!landed) await d.page.waitForTimeout(500); }
    /* the land picture, with the sharp layer and without it: the same crop of the ground picture */
    const read = (withView) => fr.evaluate((withView) => {
      const keep = VBV.key; if (!withView) { VBV.key = 'off'; VBV.busy = true; }
      MAP_GROUND.key = ''; render();
      const c = MAP_GROUND.cv, x = c.getContext('2d'), R = CV_DPR, M = MAP_GROUND.M, W = c.width, H = c.height;
      /* a land crop: the band above the city, left of the phone, where only land is painted */
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      const n = 256, X0 = Math.round((CVW * 0.08 + M) * R), Y0 = Math.round((CVH * 0.18 + M) * R);
      const px = x.getImageData(X0, Y0, n, n).data;
      let runs = 0, seg = 0;
      for (let y = 0; y < n; y++) { let run = 1; for (let i = 1; i < n; i++) { const a = (y * n + i) * 4, b = a - 4; if (px[a] === px[b] && px[a + 1] === px[b + 1] && px[a + 2] === px[b + 2]) run++; else { runs += run; seg++; run = 1; } } runs += run; seg++; }
      /* a block-scale picture of the same crop, for P3 */
      const B = 16, blk = []; for (let by = 0; by < n; by += B) for (let bx = 0; bx < n; bx += B) { let s = 0; for (let y = by; y < by + B; y++) for (let i = bx; i < bx + B; i++) { const o = (y * n + i) * 4; s += 0.3 * px[o] + 0.59 * px[o + 1] + 0.11 * px[o + 2]; } blk.push(s / (B * B)); }
      /* P2: inside the glass, the pixels the sharp land paints plus the city's painted diamond */
      let own = 0;
      if (withView && VBV.cv) {
        const vx = VBV.x.getImageData(Math.round(VBV.M * R), Math.round(VBV.M * R), Math.round(CVW * R), Math.round(CVH * R)).data;
        for (let i = 3; i < vx.length; i += 4) if (vx[i] > 0) own++;
        /* the city: its diamond on the glass, painted at 0.93 phone px a texel (THE FAR END IS PAINTED holds that) */
        const N = om.n; let cityPx = 0;
        for (let yy = 0; yy < CVH * R; yy += 2) for (let xx = 0; xx < CVW * R; xx += 2) { const a = (xx / R - ox) / (TW / 2), b = (yy / R - oy) / (TH / 2), gu = (a + b) / 2, gv = (b - a) / 2; if (gu >= 0 && gv >= 0 && gu <= N && gv <= N) cityPx += 4; }
        own += cityPx;
      }
      if (!withView) { VBV.key = keep; VBV.busy = false; MAP_GROUND.key = ''; render(); }
      return { run: runs / seg, blk, own, glass: Math.round(CVW * R) * Math.round(CVH * R) };
    }, withView);
    const A = await read(true), Bk = await read(false);
    ok('*** P1 THE LAND IS PAINTED AT THE PHONE\'S PIXELS *** (the sharp layer ' + (landed ? 'landed' : 'NEVER landed') + '; a painted unit on the land ' + r2(Bk.run) + ' phone px from the bake, ' + r2(A.run) + ' now; floor 1.5)',
      landed && A.run <= 1.5 && Bk.run >= 2.5);
    ok('*** P2 THE FAR STOP IS PAINTED AT ITS OWN PIXELS OVER ' + A.own.toLocaleString() + ' PHONE PIXELS *** (of the glass\'s ' + A.glass.toLocaleString() + '; Battle Brothers\' floor 2,073,600)', A.own >= 2073600);
    let mad = 0; for (let i = 0; i < A.blk.length; i++) mad += Math.abs(A.blk[i] - Bk.blk[i]); mad /= A.blk.length;
    let ma = 0, mb = 0; A.blk.forEach((v, i) => { ma += v; mb += Bk.blk[i]; }); ma /= A.blk.length; mb /= A.blk.length;
    let sab = 0, saa = 0, sbb = 0; A.blk.forEach((v, i) => { sab += (v - ma) * (Bk.blk[i] - mb); saa += (v - ma) ** 2; sbb += (Bk.blk[i] - mb) ** 2; });
    const corr = sab / Math.sqrt(saa * sbb || 1);
    ok('P3 the ranges stand where the bake put them (block-scale agreement r = ' + r2(corr) + ', mean difference ' + r2(mad) + ' of 255)', corr >= 0.6 && mad <= 30);
    /* P4: the ramp in front of the city, from the bake's own heights (run on the page with the heights kept) */
    const ramp = await fr.evaluate(() => {
      const inp = vbInput(); inp.keepHeights = true; const keep = VB_LAST; const r = vbCore(inp); VB_LAST = keep;
      const S = r.S, K = VB_K, N = om.n, P = r.P; let worst = 0;
      /* in front of the city (both coordinates past its start, one past its end), the steepest rise per block of run */
      for (let lo = 1; lo <= 30; lo++) { const u = Math.round((N + lo + K) * S), v = Math.round((N * 0.5 + K) * S); const h = r.HS[v * P + u] / S; worst = Math.max(worst, h / lo); }
      return { worst, front: VB_FRONT, TH, TW };
    });
    const band = (0.5 - ramp.worst) / 0.5;
    ok('*** P4 NO SLAB *** (the land in front of the city rises at most ' + r2(ramp.worst) + ' a block; on the glass its band is ' + r2(band) + ' of its run; the old 0.38 made it 0.24)', band >= 0.6);
    const t = await fr.evaluate(() => { const t0 = performance.now(); const im = new ImageData(new Uint8ClampedArray(VBV.cv.width * VBV.cv.height * 4), VBV.cv.width, VBV.cv.height); VBV.x.putImageData(im, 0, 0); const ms = performance.now() - t0; return { ms, where: VB.where, paint: VBV.ms, samples: VBV.samples }; });
    await fr.evaluate(() => { VBV.key = ''; });   /* the test put a blank in it: ask again */
    ok('P5 painted off the page (' + t.where + ', ' + t.paint + ' ms there, ' + t.samples.toLocaleString() + ' samples) and laid in quickly (' + Math.round(t.ms) + ' ms on the page)', t.where === 'worker' && t.ms < 150);
    /* P6: a zoom step; before the sharp layer comes back, the glass's corners are still land */
    const mv = await fr.evaluate(() => { setZoomAt(zoomBounds()[0] * 1.15); VBV.busy = true; MAP_GROUND.key = ''; render();
      const c = MAP_GROUND.cv, x = c.getContext('2d'), R = CV_DPR, M = MAP_GROUND.M;
      const pts = [[4, 4], [CVW - 4, 4], [4, CVH - 4], [CVW - 4, CVH - 4]].map(p => x.getImageData(Math.round((p[0] + M) * R), Math.round((p[1] + M) * R), 1, 1).data[3]);
      VBV.busy = false; return { pts, stale: VBV.key !== vbViewKey() }; });
    ok('P6 while the camera moves the bake covers the land (the sharp layer stale ' + mv.stale + '; alpha at the four corners ' + mv.pts.join('/') + ')', mv.stale && mv.pts.every(a => a > 0));
    ok('P7 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();
