#!/usr/bin/env node
/* COOK [the map remade, in colour] (10/24/26), THE MEASURE. Rule 137 (Paolo 10/24: 'the map still looks like shit, so we
   have to remake all the map assets, and let's be careful having everything look like a grey yellow sand color, I don't
   want that to flood all of our art').

   The map he opens on, and its whole pinch, photographed from the game's own camera on the driver's phone (the one
   driver, tools/bohemia_drive_the_demo.js), and every photograph's colour spread measured on the map's own canvas
   (the phone, the speed bar and the feed are DOM over the glass and are not counted).

   THE SAND FAMILY, written down so a lane can argue with it: a pixel is grey-yellow sand when, in CIELAB,
   L* is 30 to 86, chroma C* is 5 to 40 and the hue angle is 45 to 105 degrees (tan, beige, khaki, ochre-grey, the
   pale olive-sand). Under 5 of chroma is a neutral grey (concrete, asphalt, shadow), not sand; under 30 of L* is a
   shadow or a dark brown, not sand. The bar (rule 137b): no sand family over a third of the map's pixels at any zoom.
   The other families, for the spread: neutral (C* < 5), dark (L* < 30), red/rust (h < 45 or h >= 330), yellow-sand
   proper (above), green (105 to 170), cyan-blue (170 to 265), violet-magenta (265 to 330); saturated means C* >= 40.

     node tools/bohemia_cook_map_colour_spread_10_24_26.js [label]
   -> records/target/cook_map_colour/<label>/{z*.jpg, spread.json}
   REFERENCE CHECK (the 9/4 standing duty): the compare law: the map is measured as it ships, from the game's camera;
   Battle Brothers' map (9/24) and Pocket City 2's pinch (9/30) are the references, written into the record. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const LABEL = process.argv[2] || 'before';
const OUT = path.join(ROOT, 'records/target/cook_map_colour', LABEL);

(async () => {
  process.chdir(ROOT);
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({});
  /* the far land is baked in a worker; wait for it and for every district picture */
  for (let i = 0; i < 120; i++) {
    const ok = await d.fr.evaluate(() => { try { if (typeof vbReady === 'function') vbReady();
      let n = 0, l = 0; for (const k in HERO_IMG) { n++; if (HERO_IMG[k].complete && HERO_IMG[k].naturalWidth) l++; }
      return !!(VB && VB.day) && l === n; } catch (e) { return false; } });
    if (ok) break; await d.page.waitForTimeout(500);
  }
  const zb = await d.fr.evaluate(() => zoomBounds());
  const stops = [['z0_far', zb[0]], ['z1_valley', 0.214], ['z2_district', 0.5], ['z3_opening', 1], ['z4_step', 2.6], ['z5_near', zb[1]]];
  const res = { label: LABEL, zoomBounds: zb, stops: {} };
  for (const [name, z] of stops) {
    const info = await d.fr.evaluate(async (z) => {
      CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0;
      try { clampPan(); } catch (_e) {}
      MAP_GROUND.key = ''; render();
      await new Promise(r => setTimeout(r, 900)); MAP_GROUND.key = ''; render();
      const W = cv.width, H = cv.height, a = g.getImageData(0, 0, W, H).data;
      function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
      function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
      const fam = { sand: 0, neutral: 0, dark: 0, red: 0, green: 0, blue: 0, violet: 0, yellow_sat: 0 };
      let n = 0, sat = 0, sumL = 0, rg = [], yb = [];
      let sr = 0, sg = 0, sb = 0;
      const step = 2;
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4; if (a[i + 3] < 200) continue;
        const R = a[i], G = a[i + 1], B = a[i + 2];
        const r = lin(R), gg = lin(G), b = lin(B);
        const X = (0.4124 * r + 0.3576 * gg + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * gg + 0.0722 * b, Z = (0.0193 * r + 0.1192 * gg + 0.9505 * b) / 1.08883;
        const L = 116 * f(Y) - 16, A = 500 * (f(X) - f(Y)), Bb = 200 * (f(Y) - f(Z));
        const C = Math.hypot(A, Bb); let h = Math.atan2(Bb, A) * 180 / Math.PI; if (h < 0) h += 360;
        n++; sumL += L; sr += R; sg += G; sb += B;
        if (C >= 40) sat++;
        if (L < 30) fam.dark++;
        else if (C < 5) fam.neutral++;
        else if (h >= 45 && h < 105) { if (L <= 86 && C < 40) fam.sand++; else fam.yellow_sat++; }
        else if (h < 45 || h >= 330) fam.red++;
        else if (h < 170) fam.green++;
        else if (h < 265) fam.blue++;
        else fam.violet++;
        rg.push(R - G); yb.push(0.5 * (R + G) - B);
      }
      const ms = (v) => { let m = 0; for (const x of v) m += x; m /= v.length; let s = 0; for (const x of v) s += (x - m) * (x - m); return [m, Math.sqrt(s / v.length)]; };
      const [mrg, srg] = ms(rg), [myb, syb] = ms(yb);
      const colourfulness = Math.sqrt(srg * srg + syb * syb) + 0.3 * Math.sqrt(mrg * mrg + myb * myb);
      const share = {}; for (const k in fam) share[k] = +(fam[k] / n).toFixed(4);
      return { czoom: +CZOOM.toFixed(3), tw: +TW.toFixed(2), px: n, share, saturated: +(sat / n).toFixed(4), meanL: +(sumL / n).toFixed(1),
        mean_rgb: [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)], colourfulness: +colourfulness.toFixed(1) };
    }, z);
    await d.page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 72 });
    res.stops[name] = info;
    console.log(name, JSON.stringify(info));
  }
  res.worst_sand = Math.max(...Object.values(res.stops).map(s => s.share.sand));
  res.bar = 'sand <= 0.3333 at every stop';
  res.pass = res.worst_sand <= 1 / 3;
  fs.writeFileSync(path.join(OUT, 'spread.json'), JSON.stringify(res, null, 1));
  console.log('worst sand share', res.worst_sand, res.pass ? 'PASS' : 'OVER A THIRD');
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
