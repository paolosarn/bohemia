#!/usr/bin/env node
/* THE CITY GOES TO WORK, WHAT IT COSTS A FRAME (WORLD 16, 11/27/26; VAMILY rule 480(c)(d): every screen smooth on a slowed phone).
   The demo upright (390 x 844), the CPU slowed four times (Chrome's own throttle), the GPU canvas on, the map drawn every animation
   frame the way travel draws it, the clock at the busiest hours of this build (07:40, the walk to work; 17:30, the walk home; 20:25, the
   collectors out; 11:00 the caravans with their wagons), each with the work on and off (MAP_WORK.on), at the opening zoom and the
   whole valley. Reported: the map's own draw a frame (render(), the middle and the worst), frames a second, and frames over 50 ms.
   THIS BOX DRAWS WITH A SOFTWARE GPU: its frames a second compare builds; the draw's own milliseconds are what travel to his phone.
   node tools/bohemia_world_sixteen_work_frames.js [--json out.json] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const d = await open({ keepCards: true, profile: 'phone_portrait', gpu: true, fog: false });
  const fr = d.fr, errs = [];
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && window.MAP_WORK)).catch(() => false)) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(500); }
  await fr.evaluate(() => { try { partiesAdvance(300); } catch (e) {} mapWagonSheet(); render(); });
  for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => !!MAP_WORK.plan && MAP_WORK.w.state >= 2 && !rigWaiting())) break; await sleep(300); }
  const out = { phone: '390x844', rate: 4, legs: [] };
  for (const zoom of ['open', 'far']) for (const hm of [[7, 40], [17, 30], [20, 25], [11, 0]]) for (const on of [false, true]) {
    await fr.evaluate(([zoom, m, on]) => { MAP_WORK.on = on; DAY.min = m; T.min = m; const zb = zoomBounds(); city.x = Math.round(om.n / 2) - 12; city.y = Math.round(om.n / 2);
      setZoomAt(zoom === 'far' ? zb[0] : 1); try { camHold(); } catch (e) {} render(); }, [zoom, hm[0] * 60 + hm[1], on]);
    await sleep(3000);
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const R = await fr.evaluate((m0) => new Promise((res) => {
      /* the work's own functions timed where the map calls them (they are the page's globals, so the draw calls the timed ones) */
      const W = window.__WT = { ms: 0 }, wrap = (n) => { const f0 = window[n]; window[n] = function () { const a = performance.now(); try { return f0.apply(this, arguments); } finally { W.ms += performance.now() - a; } }; return () => { window[n] = f0; }; };
      const undo = ['mapWorkDraw', 'mapWorkAway', 'mapWagonPart'].map(wrap);
      const f = [], dr = [], wk = []; let t0 = 0, last = 0, m = m0, n0 = ONE_RENDER.drawn;
      const step = (t) => { if (!t0) { t0 = t; last = t; } else { f.push(t - last); last = t; }
        m += 0.25; DAY.min = m; T.min = m;   /* the clock moving as on a journey (15 minutes a second at 60 frames) */
        const d0 = ONE_RENDER.drawn, w0 = W.ms, a = performance.now(); try { render(); } catch (e) {}
        if (ONE_RENDER.drawn > d0) { dr.push(performance.now() - a); wk.push(W.ms - w0); }   /* only a draw that happened (a second ask in a frame is moved on) */
        if (t - t0 < 4000) requestAnimationFrame(step);
        else { undo.forEach((u) => u()); const s = dr.slice().sort((x, y) => x - y), sw = wk.slice().sort((x, y) => x - y), A = MAP_DREW.art || {};
          res({ fps: +(f.length / ((t - t0) / 1000)).toFixed(1), hitches: f.filter((x) => x > 50).length, frames: f.length, draws: ONE_RENDER.drawn - n0, timed: dr.length,
            drawMid: +(s[s.length >> 1] || 0).toFixed(1), drawWorst: +(s[s.length - 1] || 0).toFixed(1), workMid: +(sw[sw.length >> 1] || 0).toFixed(2), workWorst: +(sw[sw.length - 1] || 0).toFixed(2),
            people: { home: A.crowdPeople | 0, road: A.commuting | 0, coll: A.collectors | 0, wagons: A.wagons | 0, parties: MAP_DREW.parties | 0 } }); } };
      requestAnimationFrame(step);
    }), hm[0] * 60 + hm[1]);
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const L = Object.assign({ zoom, at: String(hm[0]).padStart(2, '0') + ':' + String(hm[1]).padStart(2, '0'), work: on }, R);
    out.legs.push(L);
    console.log(('  ' + L.zoom + ' ' + L.at + ' work ' + (on ? 'ON ' : 'off')).padEnd(24) + 'draw middle ' + L.drawMid + ' ms, worst ' + L.drawWorst + ' ms (' + L.timed + ' timed); the work in it ' + L.workMid + ' ms, worst ' + L.workWorst + '; ' + L.fps + ' fps, hitches ' + L.hitches + ' of ' + L.frames + '  ' + JSON.stringify(L.people));
  }
  out.errs = errs;
  if (arg('--json')) fs.writeFileSync(arg('--json'), JSON.stringify(out, null, 1));
  console.log('page errors: ' + errs.length);
  await d.close();
})().catch((e) => { console.error(e); process.exit(1); });
