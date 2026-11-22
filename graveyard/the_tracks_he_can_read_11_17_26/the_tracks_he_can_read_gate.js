#!/usr/bin/env node
/* THE TRACKS HE CAN READ (WORLD 14, 11/17; the coordinator's round under rule 453: 'parties that roam and leave tracks he can read';
   rule 441: on the real page, alpha and demo, a phone both ways; rule 454(a): no words added).
   slices/bohemia_tracks_read.js draws the living map's own prints round him as footprints (two marks a step, the faction's colour, fading
   by the hour); a phone has no F, so before this a phone never saw a track. The read is the map's own line (tracksHere).
     T1 the seam: the module wraps loopJobsDraw, is loaded after the road's modules, draws marks (ellipses), never a line (151(f)),
        and stands down while F's full trails are on
     On the page (time passed the parties' own way, partiesAdvance; he stands where a party just walked):
     T2 footprints round him are drawn on the map's own canvas: the glass round his party differs with them on and off (the measure
        bites: off, nothing is drawn and the pixels are the same as with no tracks)
     T3 with F's full trails on, these stand down (none drawn by this file)
     T4 at the farthest stop none are drawn (a print is a close thing)
     T5 the read: the map's own line says who came through where he stands
     T6 nothing threw
   Run: node gates/the_tracks_he_can_read_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 500) + ']' : '')); };
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function nodeChecks() {
  const src = read('slices/bohemia_tracks_read.js'), city = read('slices/BOHEMIA_CITY_WORLD.html');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');
  const order = city.indexOf('src="bohemia_road_more.js"') > 0 && city.indexOf('src="bohemia_tracks_read.js"') > city.indexOf('src="bohemia_road_more.js"');
  const why = [];
  if (!/root\.loopJobsDraw = function \(ox, oy\)/.test(code)) why.push('no wrap');
  if (!/g\.ellipse\(/.test(code)) why.push('no marks');
  if (/lineTo|\.stroke\(/.test(code)) why.push('draws a line');
  if (!/MAP_PRINTS_SHOWN/.test(code)) why.push('does not stand down for F');
  if (!order) why.push('not loaded after the road');
  ok('T1 the seam: wraps the map\'s draw, loaded after the road, marks never lines, stands down for F', !why.length, why.join(', ') || 'all');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BohemiaTracks && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {} try { await d.pinchIn(); } catch (e) {}
    /* the alpha under the driver can stay on its old street view sideways (MODE human, the squeezes not taken; RUN's note): the map is
       where a party walks, so the gate stands on it the way the pinch would */
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { MODE = 'city'; try { updHud(); } catch (e) {} try { render(); } catch (e) {} } });
    const r = await fr.evaluate(async () => {
      const o = {}, cv = document.getElementById('cv'), cx = cv.getContext('2d');
      try { loopClose(); } catch (e) {}
      DAY.min += 300; partiesAdvance(300);   /* five hours of the valley's business, the parties' own step */
      const h = livingMapHour(), P = (LIVING_MAP.st && LIVING_MAP.st.prints) || [];
      o.prints = P.length;
      const p = P.filter(q => h - q.h < 3).slice(-1)[0]; if (!p) return o;
      /* he stands five blocks off their trail (his own men are drawn over the ground he stands on), the trail in plain sight */
      city.x = p.x + 5; city.y = p.y; try { fogReveal(p.x, p.y, 6); fogReveal(city.x, city.y, 4); } catch (e) {}
      /* at each footprint's own spot (the map animates its people between frames, so the whole glass is never still) */
      const dpr = cv.width / cv.clientWidth;
      const at = async (pts) => { render(); await new Promise(z => setTimeout(z, 60)); return pts.map(q => { const d = cx.getImageData(Math.round(q[0] * dpr) - 1, Math.round(q[1] * dpr) - 1, 3, 3).data; let r = 0, gg = 0, bb = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; bb += d[i + 2]; } return [r, gg, bb]; }); };
      const moved = (A, B) => A.filter((a, i) => Math.abs(a[0] - B[i][0]) + Math.abs(a[1] - B[i][1]) + Math.abs(a[2] - B[i][2]) > 200).length;   /* a pale print on the dark ground moves a 3 x 3 spot by hundreds; the map's own grain flickers by tens */
      BohemiaTracks.on = true;
      /* the camera eases onto him after a jump: measure once it has stopped */
      for (let i = 0, last = ''; i < 60; i++) { render(); await new Promise(z => setTimeout(z, 100)); const k = Math.round(__MAP_OXY.ox) + ',' + Math.round(__MAP_OXY.oy) + ',' + Math.round(TW * 10); if (k === last) break; last = k; }
      /* not under his own party (his men are drawn over the block he stands on) */
      const me = iso(city.x, city.y, __MAP_OXY.ox, __MAP_OXY.oy), meY = me.sy + TH / 2;
      const pts = (BohemiaTracks.marks || []).filter(q => Math.hypot(q[0] - me.sx, q[1] - meY) > 45).slice(0, 60); o.drawn = BohemiaTracks.status().drawn; o.near = BohemiaTracks.status().near;
      const on1 = await at(pts); BohemiaTracks.on = false; const off1 = await at(pts), off2 = await at(pts); BohemiaTracks.on = true;
      o.marks = pts.length; o.diffOn = moved(on1, off1); o.diffOff = moved(off1, off2);
      o.noise = Math.max.apply(null, [0].concat(off1.map((a, i) => Math.abs(a[0] - off2[i][0]) + Math.abs(a[1] - off2[i][1]) + Math.abs(a[2] - off2[i][2]))));
      o.signal = on1.map((a, i) => Math.abs(a[0] - off1[i][0]) + Math.abs(a[1] - off1[i][1]) + Math.abs(a[2] - off1[i][2])).sort((x, y) => x - y)[Math.floor(on1.length / 2)] || 0;
      /* T3: F's trails on */
      const F0 = MAP_PRINTS_SHOWN; MAP_PRINTS_SHOWN = true; render(); o.drawnF = BohemiaTracks.status().drawn; MAP_PRINTS_SHOWN = F0; render();
      /* T4: the farthest stop */
      const z = CZOOM, b = zoomBounds(); setZoomAt(b[0], CVW / 2, CVH / 2); render(); o.drawnFar = BohemiaTracks.status().drawn; setZoomAt(z, CVW / 2, CVH / 2); render();
      /* T5: the map's own read, standing on their print */
      city.x = p.x; city.y = p.y; let t = null; try { t = tracksHere(); } catch (e) {} o.read = t ? (t.faction || t.f || t.who || JSON.stringify(t).slice(0, 80)) : null;
      o.mode = MODE; o.tw = TW; o.hid = fogHides(city.x, city.y);
      return o; });
    ok(W + ' T2 footprints round him on the map\'s own canvas: at their own spots ' + r.diffOn + ' of ' + r.marks + ' change with them on, ' + r.diffOff + ' between two frames with them off',
       r.prints > 0 && r.drawn > 0 && r.marks > 0 && r.diffOn >= Math.ceil(r.marks / 2) && r.diffOff <= Math.floor(r.marks / 4), JSON.stringify({ prints: r.prints, near: r.near, drawn: r.drawn, median_change: r.signal, flicker_max: r.noise, mode: r.mode, tw: r.tw }));
    ok(W + ' T3 with F\'s full trails on, these stand down', r.drawnF === 0, r.drawnF);
    ok(W + ' T4 at the farthest stop none are drawn', r.drawnFar === 0, r.drawnFar);
    ok(W + ' T5 the read: the map\'s own line says who came through where he stands', !!r.read, r.read);
    ok(W + ' T6 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const only = process.argv[2];
  if (only !== 'node') for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nTHE TRACKS HE CAN READ: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();
