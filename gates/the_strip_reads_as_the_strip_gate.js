#!/usr/bin/env node
/* THE STRIP READS AS THE STRIP (COOK [the Strip close in], line 64 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md: EYES 10/25 'the
   freeway reads as a freeway close in; the Strip NOT LOOKED AT'; rule 164 items 11 and 30, Paolo 10/24: 'the freeway and the Strip
   still look bad'). Looked at before (BUILD 10/26, the fog lifted, the near stop): a wide road between stepped grey boxes, the signs
   plain tan pillars: a downtown. The painter's own resort (slices/BOHEMIA_CITY_WORLD.html, stripResort in vbCityCore, run here on
   its own) and the demo's map on the glass:
     1. THE RESORTS HAVE THEIR SHAPES: the Y stands on three wings with the podium between them; the arc is concave to the Strip
        (its arms nearer the Boulevard than its middle) with its lake between them; the slab runs along the Boulevard.
     2. THE FRONT IS THE BOULEVARD'S: a resort that faces the Strip has its marquee tower (a sign 11 T over the walk) and its
        porte-cochere with a lit fascia on that side, none on its back; its pool is on the deck, drained (the pale tile).
     3. *** THE PAINTING HAS THE STRIP ***: the demo's own painting counts it (VBC.stand.strip): every resort facing the Boulevard
        has its marquee, most resorts stand in their own shapes (three in five or more), the pools drained, the signs boards.
     4. *** ON THE GLASS ***: the demo's map at the near stop on the Strip carries its marquees' faded paint (the painter's own
        rose and teal in their light and shade, 0.2 percent of the glass or more); no rainbow (rule 159): median colour under 12.
        (Downtown is no control: its casinos' old neon spots are the same gold, and its estate tiles near the rose.)
     5. No page error.
   Run: node gates/the_strip_reads_as_the_strip_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
(async () => {
  /* 1, 2: the painter's resort on its own */
  const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const i = src.indexOf('function stripResort('), j = src.indexOf('/* ==== /__THE_STRIP_READS_AS_THE_STRIP__ ==== */', i);
  const T = 1, PART = { ground: 0, top: 3, line: 5, spot: 7, neon: 12 };
  let r = 0.5;
  const stripResort = new Function('T', 'PART', 'rr', 'var r = rr; ' + src.slice(i, j) + '; return stripResort;')(T, PART, r);
  const at = (k, front, f, a) => stripResort(k, front, f, a, 0.5);
  const TH = 21;
  const wing = an => at(1, 0, 0.56 + 0.2 * Math.sin(an), 0.5 + 0.2 * Math.cos(an));
  const wings = [-Math.PI / 2, -Math.PI / 2 + 2 * Math.PI / 3, -Math.PI / 2 + 4 * Math.PI / 3].map(wing), between = [Math.PI / 2, -Math.PI / 6, Math.PI * 7 / 6].map(wing);
  const arcMid = at(2, 1, 0.46, 0.5), arcArm = at(2, 1, 0.3, 0.5 + 0.56 * Math.sin(0.7)), arcFront = at(2, 1, 0.46 - 0.3, 0.5), lake = at(2, 1, 0.27, 0.5);
  const slab = at(3, 1, 0.45, 0.5), slabOff = at(3, 1, 0.7, 0.5);
  leg(wings.every(w => w && w[0] >= TH * 0.9 && w[1] === PART.top) && between.every(w => w && w[0] <= 3 * T) && arcMid[0] >= TH * 0.9 && arcArm && arcArm[0] >= TH * 0.75 && arcFront[0] <= 3 * T && lake[1] === PART.line && slab[0] >= TH && slabOff[0] <= 3 * T,
    'the resorts have their shapes: the Y on three wings, the podium between; the arc concave to the Strip, its lake between its arms; the slab along the Boulevard',
    'Y wings ' + wings.map(w => w[0]).join('/') + ' between ' + between.map(w => w[0]).join('/') + '; arc middle ' + arcMid[0] + ' arm ' + arcArm[0] + ' lake ' + (lake[1] === PART.line ? 'pool' : 'no') + '; slab ' + slab[0]);
  const mq = at(1, 1, 0.04, 0.16), pc = at(1, 1, 0.1, 0.5), back = at(0, 0, 0.04, 0.16), pool = at(1, 1, 0.8, 0.5);
  leg(mq && mq[0] >= 10 * T && mq[1] === PART.neon && pc && pc[0] > 1 * T && pc[0] < 2 * T && at(1, 1, 0.02, 0.5)[1] === PART.neon && back === null && pool[1] === PART.line && pool[0] < 3 * T,
    'the front is the Boulevard\'s: the marquee tower (11 T) and the porte-cochere with its lit fascia where it faces the Strip, none on a back; the pool drained on the deck',
    'marquee ' + (mq && mq[0]) + ' T, porte-cochere ' + (pc && pc[0]) + ' T, pool ' + pool[0] + ' T');
  /* 3, 4: on the glass */
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({ fog: false });
  let shots = {};
  try {
    for (let k = 0; k < 160; k++) { const ok = await d.fr.evaluate(() => { try { return !!(VB && VB.day && VBC && VBC.day); } catch (e) { return false; } }); if (ok) break; await d.page.waitForTimeout(500); }
    const spots = await d.fr.evaluate(() => {
      const N = om.n, strip = [], town = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const c = om.at(x, y); if (!c) continue; if (c.district === 'strip') strip.push([x, y]); if (c.district === 'downtown') town.push([x, y]); }
      const mid = a => a[Math.floor(a.length / 2)];
      return { strip: mid(strip.sort((p, q) => p[1] - q[1])), town: mid(town.sort((p, q) => p[1] - q[1])) };
    });
    for (const [name, b] of Object.entries(spots)) {
      if (!b) continue;
      shots[name] = await d.fr.evaluate(async (b) => {
        CZOOM = zoomBounds()[1]; TW = TW0 * CZOOM; TH = TH0 * CZOOM; try { camLetGo(); } catch (_e) {}
        const put = () => { panX = ((city.x - city.y) - (b[0] - b[1])) * TW / 2; panY = ((city.x + city.y) - (b[0] + b[1] + 1)) * TH / 2; };
        put(); MAP_GROUND.key = ''; render();
        for (let i = 0; i < 40; i++) { await new Promise(r => setTimeout(r, 250)); put(); MAP_GROUND.key = ''; render(); if (!VBT.busy && !VBT.want) break; }
        const W = cv.width, H = cv.height, x0 = Math.floor(W * 0.2), y0 = Math.floor(H * 0.2), w = Math.floor(W * 0.6), h = Math.floor(H * 0.5);
        const px = cv.getContext('2d').getImageData(x0, y0, w, h).data;
        const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }, f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
        let paint = 0, n = 0, mq = 0; const cs = [], hb = new Array(12).fill(0);
        const NEON = [[0x9c, 0x6e, 0x68], [0x5e, 0x84, 0x80]];   /* the painter's STRIP_NEON rose and teal (its gold is the casinos' old neon too): a pixel is its paint when it is that colour in its light or shade */
        const isPaint = (R, G, B) => NEON.some(c => { const k = [R / c[0], G / c[1], B / c[2]]; const lo = Math.min(...k), hi = Math.max(...k); return lo > 0.42 && hi < 1.12 && hi / lo < 1.08; });
        for (let i = 0; i < px.length; i += 16) { const r = lin(px[i]), g = lin(px[i + 1]), bb = lin(px[i + 2]); if (isPaint(px[i], px[i + 1], px[i + 2])) mq++;
          const X = (0.4124 * r + 0.3576 * g + 0.1805 * bb) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * bb, Z = (0.0193 * r + 0.1192 * g + 0.9505 * bb) / 1.08883;
          const A = 500 * (f(X) - f(Y)), B = 200 * (f(Y) - f(Z)), C = Math.hypot(A, B); cs.push(C); n++; if (C >= 12) { paint++; hb[Math.floor(((Math.atan2(B, A) * 180 / Math.PI) + 360) % 360 / 30)]++; } }
        cs.sort((p, q) => p - q);
        return { paint: mq / n, chroma12: paint / n, median: cs[Math.floor(cs.length / 2)], hues: hb.map(v => +(100 * v / n).toFixed(2)) };
      }, b);
    }
    const S = shots.strip, st = await d.fr.evaluate(() => VBC && VBC.stand ? VBC.stand.strip : null);
    leg(st && st.fronts >= 10 && st.marquees === st.fronts && st.shapes[1] + st.shapes[2] + st.shapes[3] >= 0.6 * (st.shapes[0] + st.shapes[1] + st.shapes[2] + st.shapes[3]) && st.pools > 0 && st.signs >= 20,
      '*** THE PAINTING HAS THE STRIP ***: every resort facing the Boulevard has its marquee, most resorts stand in their own shapes, the pools drained, the signs boards (the painting\'s own count)',
      st ? st.marquees + ' marquees of ' + st.fronts + ' fronts; Y ' + st.shapes[1] + ', arc ' + st.shapes[2] + ', slab ' + st.shapes[3] + ', square ' + st.shapes[0] + '; ' + st.pools + ' pool rows; ' + st.signs + ' signs' : 'no count');
    leg(S && S.paint >= 0.002 && S.median < 12, '*** ON THE GLASS ***: the demo\'s map at the near stop on the Strip carries its marquees\' faded paint; no rainbow (rule 159)',
      S ? (100 * S.paint).toFixed(2) + '% of the glass the marquees\' rose and teal, median chroma ' + S.median.toFixed(1) : 'no Strip on this map');
    leg(!d.errs.length, 'no page error', d.errs[0] || 'none');
  } finally { await d.close(); }
  console.log('THE STRIP READS AS THE STRIP: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
