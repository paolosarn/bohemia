/* ==========================================================================
   THE VALLEY HAS AN EDGE  (RUN, 10/2/26, VAMILY [the valley edge], rule 61c)

   PAOLO 10/1: "when I zoom out of Las Vegas there's a square and then the rest is desert
   brown; it's really bad."

   MEASURED BEFORE ANYTHING WAS WRITTEN, on the demo through the one driver: at the far end of
   the pinch (the map's widest zoom, the step before the sky) the 96 x 96 valley is a strip
   about 360 px tall across an 830 px screen, and every canvas pixel outside it was ONE flat
   colour, #8a7a58 (__CITY_VOID__). 100% of the land past the map was a fill.

   NOW the land goes on past the map: ranges standing up behind the city and rising in front of
   it, the freeways that leave the map keep going, Lake Mead past the dam, all named. It is one
   picture baked off the main thread and drawn under the tiles with the tiles' own projection.

   LEGS, on the baked demo, at the far end of the pinch:
     E1 *** NO BARE FILL *** under 10% of the canvas outside the map is bare (one flat tone across a 9 x 9 block)
     E2 the land past the map has relief and texture, not a tint (a spread of tones)
     E3 a range stands up: the tallest land is 8 blocks or more of lift
     E4 the ranges, the lake and the peak are named on the glass (the four ranges, LAKE MEAD,
        MT CHARLESTON), and no name sits on another
     E5 every freeway that reaches the map's edge has a road out, and the 15, the 95 and the 93
        are named
     E6 *** THE LAND NEVER PAINTS OVER A BLOCK *** the picture is clear on every texel of the
        map's own ground and solid out to three quarters of the way, where it fades into the far land (no holes to the old fill)
     E7 the near side is a slope, never a wall: no texel in front of the city stands taller
        than the camera can see past (lift no more than 0.38 of its distance in front)
     E8 the bake is off the main thread (a worker), and landing it costs the page under 60 ms
     E9 a frame pays for it once: the land's own draw is under 15 ms (timed alone, median of 9)
     E10 night has its own darker picture, and the map's edge is dithered into the land (seam)
     E11 *** EVERY VALLEY, NOT ONE SEED *** three other rolls bake with ranges, a lake, the 15,
         and no land on a block
     E12 nothing threw
     E13 ONE LIGHT (rule 70a): a rim block and the land beside it change with the hour together, at four hours
     E14 THE FAR STOP KEEPS THE LAND (rule 70): in the sky past the widest zoom, land below the horizon, not a fill
   node gates/the_valley_has_an_edge_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE VALLEY HAS AN EDGE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    let ready = false;
    for (let i = 0; i < 90 && !ready; i++) { ready = await d.fr.evaluate(() => !!(window.VB && VB.day && VB.seed === om.seed)); if (!ready) await d.page.waitForTimeout(500); }
    const m = await d.fr.evaluate(() => {
      SKY = false; setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render();
      const c = document.getElementById('cv'), x = c.getContext('2d'), R = c.width / CVW, N = om.n;
      const px = x.getImageData(0, 0, c.width, c.height).data;
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      let out = 0, flat = 0; const hist = new Map(); let s1 = 0, s2 = 0;
      for (let Y = 0; Y < c.height; Y += 3) for (let X = 0; X < c.width; X += 3) {
        const a = (X / R - ox) / (TW / 2), b = (Y / R - oy) / (TH / 2), gx = (a + b) / 2, gy = (b - a) / 2;
        if (gx > -1 && gx < N + 1 && gy > -1 && gy < N + 1) continue;   /* the map, and a block of margin for its art */
        const i = (Y * c.width + X) * 4, r = px[i], g2 = px[i + 1], bl = px[i + 2];
        out++;
        /* BARE = a patch of the glass with nothing in it: every pixel in a 9 x 9 device-pixel block
           within 3 of the block's first (the old fill was all of it) */
        let lo = 1e9, hi = -1e9;
        for (let dy = 0; dy < 9 && Y + dy < c.height; dy += 2) for (let dx = 0; dx < 9 && X + dx < c.width; dx += 2) {
          const j = ((Y + dy) * c.width + X + dx) * 4, l = 0.3 * px[j] + 0.59 * px[j + 1] + 0.11 * px[j + 2]; if (l < lo) lo = l; if (l > hi) hi = l; }
        if (hi - lo < 3) flat++;
        const L = 0.3 * r + 0.59 * g2 + 0.11 * bl; s1 += L; s2 += L * L; const q = Math.round(L / 6); hist.set(q, (hist.get(q) || 0) + 1);
      }
      const mean = s1 / out, sd = Math.sqrt(Math.max(0, s2 / out - mean * mean));
      const tones = Array.from(hist.values()).filter(n => n > out * 0.003).length;
      return { out, flat, sd: Math.round(sd * 10) / 10, tones, peak: VB.peak, drawn: VB.drawn || [], labels: VB.labels.map(l => l.txt),
        roads: VB.roads, where: VB.where, landMs: VB.landMs, ms: VB.ms, seamN: VB.seamN, TW };
    });
    const flatPct = Math.round(m.flat / Math.max(1, m.out) * 1000) / 10;   /* a mutation that turns the land off reads 100 here */
    ok('*** E1 NO BARE FILL AT THE FAR END OF THE PINCH *** (' + flatPct + '% of the canvas past the map is bare, one flat tone in a 9 x 9 block; with the old fill it was 100%)', m.out > 1000 && flatPct < 10);
    ok('E2 the land past the map has relief and texture (' + m.tones + ' tones, spread ' + m.sd + ')', m.tones >= 8 && m.sd >= 8);
    ok('E3 a range stands up (the tallest land is ' + Math.round(m.peak * 10) / 10 + ' blocks of lift)', m.peak >= 8);
    const want = ['SPRING MOUNTAINS', 'SHEEP RANGE', 'FRENCHMAN MOUNTAIN', 'BLACK MOUNTAINS', 'LAKE MEAD', 'MT CHARLESTON'];
    const miss = want.filter(w => m.drawn.indexOf(w) < 0);
    ok('E4 the ranges, the lake and the peak are named on the glass (' + m.drawn.length + ' names drawn' + (miss.length ? '; missing ' + miss.join(', ') : '') + ')', miss.length === 0);

    const rd = await d.fr.evaluate(() => {
      const N = om.n, runs = [];
      for (const en of ['x0', 'x1', 'y0', 'y1']) { let inRun = false;
        for (let k = 0; k <= N; k++) { const t = k < N ? (en === 'x0' ? om.at(0, k) : en === 'x1' ? om.at(N - 1, k) : en === 'y0' ? om.at(k, 0) : om.at(k, N - 1)) : null;
          const r = !!(t && /^(freeway|beltway|interchange)$/.test(t.district)); if (r && !inRun) runs.push(en); inRun = r; } }
      return { runs: runs.length, out: VB.roads.length, names: VB.roads.map(r => r.name).filter(Boolean) };
    });
    ok('E5 every freeway at the edge has a road out (' + rd.out + ' roads for ' + rd.runs + ' runs at the edge), and the 15, 95 and 93 are named (' + rd.names.join(' ') + ')',
      rd.runs > 0 && rd.out === rd.runs && ['15', '95', '93'].every(n => rd.names.indexOf(n) >= 0));

    const cov = await d.fr.evaluate(() => {
      const S = VB_S, K = VB_K, N = om.n, P = VB.P, c = VB.day, a = c.getContext('2d').getImageData(0, 0, P, P).data;
      let onBlock = 0, hole = 0;
      for (let v = 0; v < P; v++) for (let u = 0; u < P; u++) {
        const gx = (u + 0.5) / S - K, gy = (v + 0.5) / S - K, al = a[(v * P + u) * 4 + 3], inside = gx > 0 && gx < N && gy > 0 && gy < N;
        if (inside && al) onBlock++;
        if (!inside && al !== 255 && Math.max(-gx, gx - N, -gy, gy - N) < K * 0.75) hole++; }   /* solid out to where it starts fading into the far land */
      return { onBlock, hole, P };
    });
    ok('*** E6 THE LAND NEVER PAINTS OVER A BLOCK *** (' + cov.onBlock + ' texels of land on the map\'s ground; ' + cov.hole + ' holes in the land past it)', cov.onBlock === 0 && cov.hole === 0);

    const wall = await d.fr.evaluate(() => {
      /* re-bake this valley in the page with the heights kept, and measure every texel in front of the city */
      const r = vbCore(Object.assign(vbInput(), { keepHeights: true })), S = r.S || VB_S, K = VB_K, N = om.n, P = r.P;
      let worst = 0, n = 0;
      for (let v = 0; v < P; v++) for (let u = 0; u < P; u++) {
        const qx = (u + 0.5) / S - K, qy = (v + 0.5) / S - K;
        if (qx > 0 && qx < N && qy > 0 && qy < N) continue;
        const lo = Math.max(qx - N, qy - N, 0), hi = Math.min(qx, qy);
        if (!(lo < hi)) continue;
        const h = r.HS[v * P + u] / S; n++;
        if (h > 0.01) worst = Math.max(worst, h / Math.max(0.01, lo));
      }
      return { worst: Math.round(worst * 1000) / 1000, n };
    });
    ok('E7 the near side is a slope, never a wall (steepest texel in front of the city: ' + wall.worst + ' of its distance, over ' + wall.n + ' texels; at 1 it would be seen edge-on)', wall.n > 1000 && wall.worst <= 0.38);

    ok('E8 the bake is off the main thread (' + m.where + ', ' + m.ms + ' ms in the worker; landing it on the page ' + m.landMs + ' ms)', m.where === 'worker' && m.landMs < 60);

    const cost = await d.fr.evaluate(() => {
      /* the land's own draw, timed alone (median of 9): the difference of two whole map paints was
         the first measure and it swung 4 to 16 ms with the box's load, which is noise, not the land */
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      const ts = [], tp = [];
      for (let i = 0; i < 9; i++) { let a = performance.now(); vbDraw(ox, oy, false); g.getImageData(0, 0, 1, 1); ts.push(performance.now() - a);
        MAP_GROUND.key = ''; a = performance.now(); renderCity(); g.getImageData(0, 0, 1, 1); tp.push(performance.now() - a); }
      ts.sort((a, b) => a - b); tp.sort((a, b) => a - b); render();
      return { land: Math.round(ts[4] * 10) / 10, paint: Math.round(tp[4] * 10) / 10 };
    });
    ok('E9 a frame pays for the land once (the land\'s own draw: ' + cost.land + ' ms, inside a ' + cost.paint + ' ms fresh map paint)', cost.land < 15);

    const nt = await d.fr.evaluate(() => {
      const lum = (cv) => { const a = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let s = 0, n = 0;
        for (let i = 0; i < a.length; i += 4 * 97) if (a[i + 3]) { s += 0.3 * a[i] + 0.59 * a[i + 1] + 0.11 * a[i + 2]; n++; } return s / Math.max(1, n); };
      return { day: Math.round(lum(VB.day)), night: Math.round(lum(VB.night)), seam: VB.seamN };
    });
    ok('E10 night has its own darker land (' + nt.night + ' against ' + nt.day + ') and the map\'s edge is dithered into it (' + nt.seam + ' seam texels)', nt.night < nt.day * 0.45 && nt.seam > 500);

    const seeds = await d.fr.evaluate(() => {
      const out = [];
      for (const sd of [7, 2024, 90210]) {
        const v = OM.buildOvermap(sd), r = vbCore(vbInput(v)), S = VB_S, K = VB_K, N = v.n, P = r.P;
        let onBlock = 0; for (let vv = K * S; vv < (K + N) * S; vv += 3) for (let u = K * S; u < (K + N) * S; u += 3) if (r.day[(vv * P + u) * 4 + 3]) onBlock++;
        out.push({ sd, peak: Math.round(r.peak * 10) / 10, lake: !!r.lake, i15: r.roads.some(x => x.name === '15'), onBlock });
      }
      return out;
    });
    ok('*** E11 EVERY VALLEY, NOT ONE SEED *** (' + seeds.map(s => 'seed ' + s.sd + ': peak ' + s.peak + ', lake ' + s.lake + ', the 15 ' + s.i15 + ', on a block ' + s.onBlock).join('; ') + ')',
      seeds.every(s => s.peak >= 8 && s.lake && s.i15 && s.onBlock === 0));

    /* E13 ONE LIGHT (rule 70a): a rim block inside the map and the land just outside it, read at four
       hours; the land's change with the hour must be the city's change (a split fails) */
    const light = await d.fr.evaluate(() => {
      SKY = false; setZoomAt(zoomBounds()[0]);
      const N = om.n, c = document.getElementById('cv'), x = c.getContext('2d'), R = c.width / CVW;
      /* a rim cell of open ground on the far edge (y = 1), mid-way along, and the land four blocks out from it */
      let cx = null; for (let k = 0; k < N; k++) { const xx = (N >> 1) + ((k & 1) ? -(k >> 1) : (k >> 1)), t = om.at(xx, 1); if (t && /^(mountain|desert|wash)$/.test(t.district)) { cx = xx; break; } }
      if (cx === null) return null;
      const lum = (gx, gy) => { const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
        const p = iso(gx, gy, ox, oy), X = Math.round(p.sx * R), Y = Math.round((p.sy + TH / 2) * R), r = Math.max(2, Math.round(TW * R * 0.25));
        const dd = x.getImageData(X - r, Y - r, 2 * r, 2 * r).data; let sum = 0, n = 0; for (let i = 0; i < dd.length; i += 4) { sum += 0.3 * dd[i] + 0.59 * dd[i + 1] + 0.11 * dd[i + 2]; n++; } return sum / n; };
      const keep = T.min, out = [];
      for (const h of [3, 9, 15, 21]) { T.min = h * 60; MAP_GROUND.key = ''; render(); out.push({ h, city: lum(cx + 0.5, 1.5), land: lum(cx + 0.5, -3.5), night: isNight() }); }
      T.min = keep; MAP_GROUND.key = ''; render();
      return out;
    });
    const noon = light && light.find(r => r.h === 15), split = light ? light.map(r => Math.abs((r.city / noon.city) - (r.land / noon.land))) : [1];
    ok('E13 ONE LIGHT: the land beside the city changes with the hour as the city does (' + (light ? light.map(r => r.h + ':00 city ' + Math.round(r.city) + ' land ' + Math.round(r.land)).join(', ') : 'no rim block') + '; worst split ' + Math.max(...split).toFixed(3) + ')',
      !!light && light.some(r => r.night) && Math.max(...split) <= 0.08);

    /* E14 THE FAR STOP KEEPS THE LAND (rule 70): past the map's widest zoom the sky is entered; below its
       horizon the land and the city are drawn (not a flat fill), with no REGION label */
    const far = await d.fr.evaluate(() => {
      const out = [];
      for (const u of [0.12, 0.35]) {
        setZoomAt(zoomBounds()[0]); skyEnter(); SKYU = u; const before = window.__SKY_LAND || 0; render();
        const c = document.getElementById('cv'), x = c.getContext('2d'), R = c.width / CVW, H = CVH;
        const horizon = H * Math.min(0.62, 0.02 + u * 1.1);
        const y0 = Math.round((horizon + 40) * R), y1 = Math.round((H - 120) * R), px = x.getImageData(0, y0, c.width, y1 - y0).data, w = c.width;
        let blocks = 0, flat = 0;
        for (let Y = 0; Y + 9 < y1 - y0; Y += 9) for (let X = 0; X + 9 < w; X += 9) { blocks++; let lo = 1e9, hi = -1e9;
          for (let dy = 0; dy < 9; dy += 2) for (let dx = 0; dx < 9; dx += 2) { const j = ((Y + dy) * w + X + dx) * 4, l = 0.3 * px[j] + 0.59 * px[j + 1] + 0.11 * px[j + 2]; if (l < lo) lo = l; if (l > hi) hi = l; }
          if (hi - lo < 3) flat++; }
        out.push({ u, band: skyBand(), land: (window.__SKY_LAND || 0) > before, bare: Math.round(flat / Math.max(1, blocks) * 1000) / 10 });
      }
      skyExit(); setZoomAt(zoomBounds()[0]); render();
      return out;
    });
    ok('E14 THE FAR STOP KEEPS THE LAND: in the sky past the widest zoom the land is drawn below the horizon (' + far.map(f => f.band + ' ' + (f.land ? 'land' : 'NO LAND') + ', ' + f.bare + '% bare').join('; ') + '), no label over it',
      far.every(f => f.land && f.bare < 15 && f.band !== 'MOON'));
    ok('E12 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
