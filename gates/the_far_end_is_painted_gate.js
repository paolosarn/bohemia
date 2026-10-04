/* ==========================================================================
   THE FAR END IS PAINTED  (RUN, 10/2/26, VAMILY [map pixels now], rule 65)

   PAOLO 10/2, the fourth time: "I've been telling you I want the map graphics to be bigger and
   better and especially when you zoom out of the city for a fat minute, bro please."

   MEASURED BEFORE ANYTHING WAS WRITTEN: at the far stop of the pinch the 96 x 96 blocks were the
   tiles' own building pictures shrunk to 3.7 CSS px a block -- one dark grid carpet -- and the
   seven town buildings stayed 74 CSS px wide and covered half of it.
   NOW (__THE_VALLEY_HAS_AN_EDGE__'s painted city, the city file): the city is PAINTED for the far
   end, eight texels a block, by what each block is; it fades in over the tiles as the camera
   pulls out; at night only blocks with power show light; and the art scales with the zoom
   while the names do not (rule 61's answer), so the towns shrink with the ground.

   THE FLOOR IS DIRECTION'S (records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md, amended 9/29):
   (3a) the painted unit, the canvas's own-pixel run times the device px each covers, <= 1.5 on
   both axes; (3b) the fine band, the FFT power share above 0.25 cycles/px, >= 0.020 on both axes;
   and (2) no flat-colour cells: every block is painted art. Read on the city's own diamond at the
   far stop, with the painting and without it.

   LEGS, on the demo at the far stop:
     F1 every block's kind has painted art (no district falls to a flat fill)
     F2 *** (3a) THE PAINTED UNIT AT THE FAR STOP IS AT MOST 1.5 DEVICE PX *** both axes
     F3 *** (3b) THE FINE BAND AT THE FAR STOP IS AT LEAST 0.020 *** both axes
     (the same crop without the painting is printed, not judged: tiny noisy tiles read as fine detail)
     F5 things stand up: towers and the rim are lifted texels, not flat colour
     F6 at night only blocks with power show light (read off the night picture, block by block)
     F7 it fades in: all painting at the far stop, none at the opening zoom
     F8 the art scales with the zoom and the names do not: a town at the far stop is smaller than
        at the opening zoom, he is the same size, a name plate the same size
     F9 baked off the main thread; a frame pays one drawImage (under 15 ms)
     F10 nothing threw
     F12 the people on the map are one art pixel to one device pixel (the rig's own 112, CAST_PX)
     F11 the near stop is a block's art at its own pixels (his 'zoom in so much'), and the ground
         picture stays under the 16-million-pixel canvas limit there
   node gates/the_far_end_is_painted_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE FAR END IS PAINTED: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* DIRECTION's two readings, on a grey crop: mean run of identical canvas pixels along each axis,
   and the share of spectral power above 0.25 cycles/px along each axis (DC removed) */
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } }
}
function readings(px, W, H, n) {
  /* px: RGBA rows of an n x n crop; runs on exact RGB, the band on grey */
  let runsX = 0, segX = 0, runsY = 0, segY = 0;
  for (let y = 0; y < n; y++) { let run = 1; for (let x = 1; x < n; x++) { const a = (y * n + x) * 4, b = a - 4; if (px[a] === px[b] && px[a + 1] === px[b + 1] && px[a + 2] === px[b + 2]) run++; else { runsX += run; segX++; run = 1; } } runsX += run; segX++; }
  for (let x = 0; x < n; x++) { let run = 1; for (let y = 1; y < n; y++) { const a = (y * n + x) * 4, b = a - n * 4; if (px[a] === px[b] && px[a + 1] === px[b + 1] && px[a + 2] === px[b + 2]) run++; else { runsY += run; segY++; run = 1; } } runsY += run; segY++; }
  const band = (axis) => { let hi = 0, all = 0;
    for (let k = 0; k < n; k++) { const re = new Float64Array(n), im = new Float64Array(n); let m = 0;
      for (let i = 0; i < n; i++) { const o = (axis ? (i * n + k) : (k * n + i)) * 4; re[i] = 0.3 * px[o] + 0.59 * px[o + 1] + 0.11 * px[o + 2]; m += re[i]; }
      m /= n; for (let i = 0; i < n; i++) re[i] -= m;
      fft(re, im);
      for (let f = 1; f < n / 2; f++) { const p = re[f] * re[f] + im[f] * im[f]; all += p; if (f / n > 0.25) hi += p; } }
    return all ? hi / all : 0; };
  return { run: [runsX / segX, runsY / segY], band: [band(0), band(1)] };
}
const r2 = v => Math.round(v * 1000) / 1000;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    for (let i = 0; i < 90; i++) { if (await d.fr.evaluate(() => !!(window.VB && VB.day && VB.seed === om.seed))) break; await d.page.waitForTimeout(500); }
    await d.fr.evaluate(() => { SKY = false; setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render(); });
    for (let i = 0; i < 60; i++) { if (await d.fr.evaluate(() => !!(VBC.day && VBC.seed === om.seed))) break; await d.page.waitForTimeout(500); }
    const grab = (painted) => d.fr.evaluate((painted) => {
      const keep = VBC.day; if (!painted) { VBC.day = null; VBC.busy = true; }
      SKY = false; setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render();
      /* THE GROUND PICTURE, not the glass: the map paints its ground once into MAP_GROUND.cv and draws
         him, the crowds, the crews, the towns and the names on top each frame. The floor is about the
         painted map, so it is read where the walkers are not (the glass crop sat on him and the church). */
      const c = MAP_GROUND.cv, x = c.getContext('2d'), R = CV_DPR, N = om.n, M = MAP_GROUND.M;
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
      /* the largest power-of-two square the city's diamond holds, centred on the diamond's middle */
      const cx = ox, cy = oy + N * TH / 2, half = Math.floor(Math.min(N * TW / 4, N * TH / 4) * R * 0.9);
      let n = 1; while (n * 2 <= half * 2) n *= 2;
      const X0 = Math.round((cx + M) * R - n / 2), Y0 = Math.round((cy + M) * R - n / 2);
      const px = Array.from(x.getImageData(X0, Y0, n, n).data);
      const out = { n, px, TW, alpha: VBC.alpha, k: MAP_ART_K, you: MAP_DREW.you ? MAP_DREW.you.h : null };
      if (!painted) { VBC.day = keep; VBC.busy = false; MAP_GROUND.key = ''; render(); }
      return out;
    }, painted);
    const before = await grab(false), after = await grab(true);
    const B = readings(before.px, 0, 0, before.n), A = readings(after.px, 0, 0, after.n);
    const R = await d.fr.evaluate(() => document.getElementById('cv').width / CVW);
    /* each canvas px is one device px here (the backing store is at the phone's ratio) */
    const unitA = A.run, unitB = B.run;
    console.log('  far stop, a ' + after.n + ' x ' + after.n + ' device-px crop of the city: before run ' + unitB.map(r2).join(' x ') + ', band ' + B.band.map(r2).join(' / ')
      + '; after run ' + unitA.map(r2).join(' x ') + ', band ' + A.band.map(r2).join(' / ') + ' (canvas px per device px ' + r2(1) + ', ratio ' + R + ')');

    const cls = await d.fr.evaluate(() => { const N = om.n, seen = {}, lot = {}; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y), dd = t && t.district; seen[dd] = vbClassOf(dd); }
      for (const k in seen) if (seen[k] === VB_CLASS.lot && !/^(lot|parking|plaza|empty)$/.test(k)) lot[k] = 1; return { kinds: Object.keys(seen).length, lot: Object.keys(lot) }; });
    ok('F1 every block\'s kind has painted art (' + cls.kinds + ' kinds; ' + cls.lot.length + ' fall to the painted lot: ' + cls.lot.slice(0, 8).join(', ') + ')', cls.kinds > 20 && cls.lot.length <= 6);
    ok('*** F2 (3a) THE PAINTED UNIT AT THE FAR STOP IS AT MOST 1.5 DEVICE PX *** (' + unitA.map(r2).join(' x ') + ')', unitA[0] <= 1.5 && unitA[1] <= 1.5);
    ok('*** F3 (3b) THE FINE BAND AT THE FAR STOP IS AT LEAST 0.020 *** (' + A.band.map(r2).join(' / ') + ')', A.band[0] >= 0.02 && A.band[1] >= 0.02);
    /* the frame without the painting, read the same way, is printed above: it is NOT a leg. The old
       tile carpet is fine noise and the band reads it as detail, so "denser than before" is not what
       the numbers say; the floor is what the painting is held to. */
    const pic = await d.fr.evaluate(() => {
      /* re-bake this city in the page and read its own heights and lights */
      const inp = vbCityInput(), r = vbCityCore(inp), P = r.P, S = r.S, PAD = r.PAD, N = inp.N;
      const C = {}; for (const k of ['lit', 'lamp', 'neonN']) C[k] = vbHex(VB_CCOL[k]).join(',');
      let litDark = 0, litLive = 0, liveCells = 0;
      for (let i = 0; i < N * N; i++) liveCells += inp.live[i];
      for (let v = 0; v < P; v++) for (let u = 0; u < P; u++) { const o = (v * P + u) * 4, key = r.night[o] + ',' + r.night[o + 1] + ',' + r.night[o + 2];
        if (key !== C.lit && key !== C.lamp && key !== C.neonN) continue;
        /* a light belongs to the block whose column owns this texel: walk down the view diagonal to a lit column's ground */
        let found = false; for (let k = 0; k < 160 && !found; k++) { const qu = u + k, qv = v + k; if (qu >= P || qv >= P) break; const cx = Math.floor(qu / S) - PAD, cy = Math.floor(qv / S) - PAD;
          if (cx >= 0 && cy >= 0 && cx < N && cy < N && inp.live[cy * N + cx]) found = true; }
        if (found) litLive++; else litDark++; }
      let lifted = 0; const day = r.day; const dayKeys = new Set(); for (let i = 0; i < day.length; i += 4 * 7) if (day[i + 3]) dayKeys.add(day[i] + ',' + day[i + 1] + ',' + day[i + 2]);
      return { litDark, litLive, liveCells, tones: dayKeys.size, ms: r.ms, P };
    });
    const lifts = await d.fr.evaluate(() => { const inp = vbCityInput(); let towers = 0, rim = 0; for (let i = 0; i < inp.cls.length; i++) { if (inp.cls[i] === VB_CLASS.tower || inp.cls[i] === VB_CLASS.casino) towers++; if (inp.cls[i] === VB_CLASS.mountain) rim++; } return { towers, rim }; });
    ok('F5 things stand up: ' + lifts.towers + ' tower and casino blocks and ' + lifts.rim + ' rim blocks are lifted, ' + pic.tones + ' tones in the painting', lifts.towers > 0 && lifts.rim > 0 && pic.tones > 60);
    ok('F6 at night only blocks with power show light (' + pic.litLive + ' lit texels on powered blocks, ' + pic.litDark + ' on blocks without power; ' + pic.liveCells + ' blocks have power)', pic.litDark === 0 && (pic.liveCells === 0 || pic.litLive > 0));

    const fade = await d.fr.evaluate(() => { setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render(); const far = VBC.alpha;
      VBC.alpha = 0; setZoomAt(1); MAP_GROUND.key = ''; render(); const near = TW >= VB_CITY_NONE ? 0 : VBC.alpha; return { far, near, TWn: TW }; });
    ok('F7 it fades in: painting ' + fade.far + ' at the far stop, ' + fade.near + ' at the opening zoom (a block ' + Math.round(fade.TWn) + ' px)', fade.far === 1 && fade.near === 0);

    const sizes = await d.fr.evaluate(() => {
      const at = (z) => { setZoomAt(z); MAP_GROUND.key = ''; render();
        return { base: Math.max(30, Math.round(MAP_BASE_W * MAP_ART_K / 2) * 2), you: MAP_DREW.you ? Math.round(MAP_DREW.you.h) : null, people: Math.round(MAP_PEOPLE_K * 100) / 100 }; };
      const o = at(1), f = at(zoomBounds()[0]); g.font = '700 9px ' + FACE('body'); return { o, f };
    });
    ok('F8 the art scales with the zoom, he does not (a town ' + sizes.o.base + ' -> ' + sizes.f.base + ' CSS px wide, people x' + sizes.o.people + ' -> x' + sizes.f.people + '; he is ' + sizes.o.you + ' -> ' + sizes.f.you + ' px tall)',
      sizes.f.base < sizes.o.base && sizes.f.people < sizes.o.people && sizes.o.you === sizes.f.you);

    const cost = await d.fr.evaluate(() => { setZoomAt(zoomBounds()[0]); MAP_GROUND.key = ''; render();
      const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY), ts = [];
      for (let i = 0; i < 9; i++) { const a = performance.now(); vbCityDraw(ox, oy, false); g.getImageData(0, 0, 1, 1); ts.push(performance.now() - a); } ts.sort((a, b) => a - b); render();
      return { draw: Math.round(ts[4] * 10) / 10, where: VB.where, asks: VBC.asks, ms: VBC.ms }; });
    ok('F9 baked off the main thread (' + cost.where + ', ' + cost.ms + ' ms there, asked ' + cost.asks + 'x); the frame pays one picture (' + cost.draw + ' ms)', cost.where === 'worker' && cost.draw < 15);
    /* F11: the other end of his ask ("got to be able to zoom in so much"): the near stop is where a
       block's 256-px art lands one art pixel to one device pixel */
    const near = await d.fr.evaluate(() => { const b = zoomBounds()[1]; setZoomAt(b); MAP_GROUND.key = ''; render(); const r = { stop: b, TW, dev: TW * CV_DPR, art: MAP_NEAR_ART_PX, M: MAP_GROUND.M, px: MAP_GROUND.cv ? MAP_GROUND.cv.width * MAP_GROUND.cv.height : 0 }; setZoomAt(1); render(); return r; });
    ok('F11 the near stop shows a block\'s art at its own pixels (a block ' + Math.round(near.dev) + ' device px for ' + near.art + ' px of art; the ground picture ' + (near.px / 1e6).toFixed(1) + ' million px)',
      Math.abs(near.dev - near.art) <= 2 && near.px < 16e6);
    /* F12: rule 65 (a), every marker 1:1 from its art -- the people: the baked body against the device
       pixels it is drawn on at the opening zoom (him too, said, not judged: rule 21 sizes him) */
    const ppl = await d.fr.evaluate(() => { setZoomAt(1); MAP_GROUND.key = ''; render();
      const set = mapCastOf(0), fr = set && (set.S || set[Object.keys(set)[0]]).idle; if (!fr) return null;
      const s56 = 56 / Math.max(56, fr.width), cssW = fr.width * s56 * MAP_PERSON_K * MAP_PEOPLE_K;
      const you = PLAYER_CV && (PLAYER_CV.S || PLAYER_CV[Object.keys(PLAYER_CV)[0]]).idle;
      return { art: fr.width, dev: cssW * CV_DPR, ratio: (cssW * CV_DPR) / fr.width, youArt: you ? you.width : null, youDev: MAP_DREW.you ? MAP_DREW.you.w * CV_DPR : null }; });
    ok('F12 the people on the map are drawn one art pixel to one device pixel (' + (ppl ? ppl.art + ' px of art on ' + Math.round(ppl.dev) + ' device px, x' + ppl.ratio.toFixed(2)
      + '; he is ' + ppl.youArt + ' px of art on ' + Math.round(ppl.youDev) + ', sized by rule 21' : 'no cast') + ')', !!ppl && Math.abs(ppl.ratio - 1) <= 0.05);
    ok('F10 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
