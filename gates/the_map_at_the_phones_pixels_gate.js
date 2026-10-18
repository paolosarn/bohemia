/* ==========================================================================
   THE MAP AT THE PHONE'S PIXELS  (RUN, 10/1/26, VAMILY [map pixels] G1, rule 38a)

   PAOLO 9/28: "how many pixels the Battle Brothers map is and we need to have that
   exact same number at the bare minimum... that has to happen like now."

   MEASURED BEFORE (PLUMBER, records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL_IN_THIRTEEN_9_28_26.md):
   the map canvas was 378 x 830 on a 3x phone, so every pixel it painted was shown as a
   3 x 3 block before a single tile was drawn. NOW it is 1134 x 2490, every layout line
   still reads CSS pixels (CVW x CVH), and the context carries the ratio.

   AND THE COST, MEASURED AND PAID: nine times the pixels made a full map paint 67 ms ->
   115 ms on this box, and the glide repaints the whole map every frame of a journey, so
   the ground is now painted ONCE into a picture a margin bigger than the screen and slid
   under him while he moves (__THE_MAP_GROUND_IS_PAINTED_ONCE__). Travelling on the demo at
   1x CPU: 10.8 frames a second against main's 4.4 at a third of the pixels.

   LEGS, on the baked demo (which opens on the map):
     S1  every layout line reads the CSS size: no cv.width / cv.height read is left in the
         city file outside the canvas setup and the two whole-canvas copies.
     P1  *** THE MAP CANVAS IS THE PHONE'S OWN PIXELS *** (backing = CSS x devicePixelRatio)
     P2  a real touch on a block he can stand on sets a journey to THAT block (the layout
         did not move when the backing store did).
     P3  the street stays at one (it repaints every frame and is not how the city is
         crossed any more), and back on the map it is the phone's pixels again.
     P4  *** A SLID GROUND IS THE SAME PICTURE AS A FRESH PAINT *** at three offsets, time
         frozen and the glide in flight, and the taps it recorded slide with it.
     P5  while he travels the ground is slid, not repainted (slides > paints), and a slid
         frame costs under half a fresh one.
     P6  the moment he stops, the ground is painted fresh (so nothing that changed the
         world can stay stale on a still map).
     P7  a paint that threw half way is never slid.

   node gates/the_map_at_the_phones_pixels_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE MAP AT THE PHONE\'S PIXELS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const lines = CITY.split('\n');
  /* the only lines allowed to touch the backing store's size: the setup (cvSize), the
     two whole-canvas snapshot copies (fzSnap), and three local canvases that are not #cv */
  const left = lines.filter(l => /\bcv\.(width|height)\b/.test(l) && !/^\s*(\/\*|\*|\/\/)/.test(l) && !/^\s{3}\S/.test(l)
    && !/cv\.width=Math\.round\(w\*d\)/.test(l)
    && !/^\s*[cb]\.width=cv\.width; [cb]\.height=cv\.height;/.test(l)
    && !/cv\.width=w\*S|ch\.cv\.width=1|cv\.width = 26|cv\.height\*\(160\/cv\.width\)/.test(l)
    && !/var CVW=cv\.width|window\.cvPixels=|MG\.cv\./.test(l));
  ok('S1 every layout line reads the CSS size (' + left.length + ' backing-size reads left outside the setup'
    + (left.length ? ': ' + left[0].trim().slice(0, 80) : '') + ')', left.length === 0);
  ok('S1 the canvas is sized in one place, at the phone\'s ratio on the map',
    /function cvSize\(w,h\)/.test(CITY) && /cvSize\(w,h\);\s+\/\* __THE_MAP_AT_THE_PHONES_PIXELS__/.test(CITY));
  ok('P7 a paint that threw half way is never slid', /if\(!st\.done\)\{ MG\.key='';/.test(CITY));

  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  try {
    await d.page.waitForTimeout(1500);
    ok('the demo is on the map', await fr.evaluate(() => MODE === 'city'));

    const px = await fr.evaluate(() => ({ p: cvPixels(), dpr: devicePixelRatio,
      r: (() => { const r = document.getElementById('cv').getBoundingClientRect(); return [r.width, r.height]; })() }));
    ok('*** P1 THE MAP CANVAS IS THE PHONE\'S OWN PIXELS *** (' + px.p.w + 'x' + px.p.h + ' for '
      + px.p.cssW + 'x' + px.p.cssH + ' CSS at ' + px.dpr + 'x)',
      px.dpr > 1 && px.p.dpr === px.dpr && px.p.w === Math.round(px.p.cssW * px.dpr) && px.p.h === Math.round(px.p.cssH * px.dpr));
    ok('P1 and the CSS box is the size the layout reads (' + px.r.join('x') + ')',
      Math.round(px.r[0]) === px.p.cssW && Math.abs(px.r[1] - px.p.cssH) <= 1);

    /* P2: a real touch. The canvas sits inside the frame below the top bar, so the
       touch goes where the block is ON THE GLASS, measured, not where iso says inside it. */
    const tgt = await fr.evaluate(() => {
      const r = document.getElementById('cv').getBoundingClientRect();
      for (let k = 9; k < 16; k++) for (const [dx, dy] of [[k, 0], [0, k], [-k, 0], [0, -k], [k, k], [-k, -k]]) {
        const x = city.x + dx, y = city.y + dy;
        if (!cityWalkable(x, y)) continue;
        const p = __CITY.isoAt(x, y);
        if (p.sx < 40 || p.sx > CVW - 40 || p.sy < 200 || p.sy > CVH - 200) continue;
        if (JSON.stringify(CBcellAt(p.sx, p.sy + TH / 2)) !== JSON.stringify([x, y])) continue;
        return { x, y, gx: r.left + p.sx, gy: r.top + p.sy + TH / 2 };
      }
      return null; });
    if (!tgt) ok('P2 found a block he can stand on to touch', false);
    else {
      await d.tapAt(tgt.gx, tgt.gy);
      await d.page.waitForTimeout(400);
      const end = await fr.evaluate(() => TRAVEL && TRAVEL.path && TRAVEL.path.length ? TRAVEL.path[TRAVEL.path.length - 1] : null);
      ok('P2 a real touch on a block sets a journey to THAT block ([' + tgt.x + ',' + tgt.y + '] -> ' + JSON.stringify(end) + ')',
        !!end && end[0] === tgt.x && end[1] === tgt.y);
    }

    /* P5: while he travels */
    await d.page.waitForTimeout(1200);
    const tr = await fr.evaluate(() => {
      const moving = !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length);
      const b0 = MAP_GROUND.builds, r0 = MAP_GROUND.reuses;
      const slid = []; for (let i = 0; i < 6; i++) { const a = performance.now(); renderCity(); slid.push(performance.now() - a); }
      const slides = MAP_GROUND.reuses - r0, paints = MAP_GROUND.builds - b0;
      MAP_GROUND.on = false;
      const fresh = []; for (let i = 0; i < 4; i++) { const a = performance.now(); renderCity(); fresh.push(performance.now() - a); }
      MAP_GROUND.on = true;
      slid.sort((a, b) => a - b); fresh.sort((a, b) => a - b);
      return { moving, slides, paints, slid: Math.round(slid[3]), fresh: Math.round(fresh[2]), total: [MAP_GROUND.builds, MAP_GROUND.reuses] };
    });
    ok('P5 he is mid-journey when it is measured', tr.moving);
    ok('*** P5 WHILE HE TRAVELS THE GROUND IS SLID, NOT REPAINTED *** (' + tr.slides + ' slides, ' + tr.paints
      + ' paints in six frames; ' + tr.total[1] + ' slides and ' + tr.total[0] + ' paints since the door)',
      tr.slides >= 5 && tr.total[1] > tr.total[0]);
    ok('P5 and a slid frame costs under half a fresh paint (' + tr.slid + ' ms against ' + tr.fresh + ')', tr.slid * 2 < tr.fresh);

    /* P4: a slid ground is the same picture. Time frozen, the glide put in flight, the
       ground painted once, then the camera panned and the slid frame compared with a
       fresh paint of the same frame. */
    const eq = await fr.evaluate(() => {
      const c = document.getElementById('cv'), x = c.getContext('2d');
      const grab = () => x.getImageData(0, 0, c.width, c.height).data;
      const taps = () => JSON.stringify(Array.from(CB_DREW.entries()).map(([k, v]) => [k, v.sx, v.sy, v.dx, v.dy]).sort());
      const cmp = (A, B) => { let big = 0; for (let i = 0; i < A.length; i += 4) { const m = Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2])); if (m > 8) big++; } return big; };
      try { travelStop(); } catch (_e) {}
      const pn = performance.now.bind(performance); const T = pn(); performance.now = () => T;
      const G = CITY_GLIDE, save = { fx: G.fx, fy: G.fy, tx: G.tx, ty: G.ty, t0: G.t0, dur: G.dur };
      const out = [];
      try {
        G.t0 = T - 100; G.dur = 500; G.fx = city.x - 0.5; G.fy = city.y; G.tx = city.x; G.ty = city.y;
        MAP_GROUND.t = -1e9; renderCity();
        for (const [px, py] of [[5, 0], [0, 7], [-11, 3]]) {
          const p0x = panX, p0y = panY; panX += px; panY += py;
          const r0 = MAP_GROUND.reuses; renderCity(); const slid = MAP_GROUND.reuses > r0;
          const A = grab(), tA = taps();
          /* the fresh paint goes the way every map paint in the game goes, through the
             ground picture, painted now (the age expired), not slid */
          MAP_GROUND.t = -1e9; const b0 = MAP_GROUND.builds; renderCity(); const painted = MAP_GROUND.builds > b0;
          const B = grab(), tB = taps();
          const mA = new Map(JSON.parse(tA).map(r => [r[0], r.slice(1)])), mB = new Map(JSON.parse(tB).map(r => [r[0], r.slice(1)]));
          let common = 0, same = 0; mA.forEach((v, k) => { if (mB.has(k)) { common++; const w = mB.get(k); if (v.every((a, i) => a === w[i] || (typeof a === 'number' && typeof w[i] === 'number' && Math.abs(a - w[i]) < 1e-6))) same++; } });
          /* where the slid picture fits the fresh one best: at no offset, and one CSS pixel
             (three phone pixels) off in any direction must fit far worse */
          const W = c.width, H = c.height;
          const fit = (sx, sy) => { let big = 0, n = 0;
            for (let y = 300; y < H - 300; y += 2) for (let x0 = 150; x0 < W - 150; x0 += 2) {
              const i = (y * W + x0) * 4, j = ((y + sy) * W + (x0 + sx)) * 4; n++;
              if (Math.max(Math.abs(A[i] - B[j]), Math.abs(A[i + 1] - B[j + 1]), Math.abs(A[i + 2] - B[j + 2])) > 8) big++; }
            return big / n; };
          const at0 = fit(0, 0), off = Math.min(fit(3, 0), fit(-3, 0), fit(0, 3), fit(0, -3));
          out.push({ px, py, slid: slid && painted, big: cmp(A, B), share: cmp(A, B) / (W * H), at0, off,
            tapsSame: common > 0 && same === common, taps: common });
          panX = p0x; panY = p0y;
        }
      } finally { performance.now = pn; Object.assign(G, save); }
      return out;
    });
    ok('*** P4 A SLID GROUND IS THE SAME PICTURE AS A FRESH PAINT, IN EXACTLY ITS PLACE *** ('
      + eq.map(e => (e.slid ? 'slid' : 'NOT SLID') + ' ' + e.px + ',' + e.py + ': ' + (100 * e.share).toFixed(1)
        + '% of pixels off in place, ' + (100 * e.off).toFixed(0) + '% one pixel over').join('; ') + ')',
      eq.length === 3 && eq.every(e => e.slid && e.share < 0.05 && e.off > 4 * Math.max(e.at0, 0.002)));
    /* WHY NOT ZERO, SAID HERE SO NOBODY TIGHTENS IT BACK: the browser samples unsmoothed art
       through float32 matrix math, so two FRESH paints from neighbouring camera spots differ
       by the same one-phone-pixel specks (2 to 4% of pixels, measured 10/1). That is the
       shimmer the map always had while the camera moved; a slid frame adds none of its own.
       A slide that is off by even one CSS pixel misses by about two thirds (66%, measured). */
    ok('P4 and the taps it recorded slide with it (' + eq.map(e => e.taps + ' blocks ' + (e.tapsSame ? 'same' : 'DIFFERENT')).join(', ') + ')',
      eq.length === 3 && eq.every(e => e.tapsSame && e.taps > 0));

    /* P6: standing still */
    await d.page.waitForTimeout(800);
    const st = await fr.evaluate(() => {
      try { travelStop(); } catch (_e) {}
      CITY_GLIDE.t0 = performance.now() - 5000;   /* the glide has landed */
      const b0 = MAP_GROUND.builds; renderCity(); return { painted: MAP_GROUND.builds > b0, why: MAP_GROUND.why };
    });
    ok('P6 the moment he stops the ground is painted fresh (' + JSON.stringify(st.why) + ')', st.painted);

    /* P3: the street at one, the map back at the phone's ratio */
    const sw = await fr.evaluate(() => {
      const out = {};
      try { SEAM_INTENT = 'look'; swapMode(); } catch (e) { out.err = String(e).slice(0, 80); }
      try { render(); } catch (_e) {}
      out.mode = MODE; out.street = cvPixels();
      try { swapMode(); } catch (e) { out.err2 = String(e).slice(0, 80); }
      try { render(); } catch (_e) {}
      out.mode2 = MODE; out.map = cvPixels();
      return out;
    });
    if (sw.mode !== 'human') console.log('  NOTE the demo would not step onto the street (' + JSON.stringify(sw).slice(0, 160) + ')');
    else ok('P3 the street draws at one (' + sw.street.w + 'x' + sw.street.h + ')', sw.street.dpr === 1 && sw.street.w === sw.street.cssW);
    ok('P3 and back on the map it is the phone\'s pixels again (' + sw.mode2 + ' ' + sw.map.w + 'x' + sw.map.h + ')',
      sw.mode2 === 'city' && sw.map.dpr > 1 && sw.map.w === Math.round(sw.map.cssW * sw.map.dpr));

    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
