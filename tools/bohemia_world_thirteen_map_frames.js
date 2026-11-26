#!/usr/bin/env node
/* ============================================================================
   THE MAP'S FRAMES ON A SLOWED PHONE (WORLD THIRTEEN 11/26, VAMILY rule 480(c)(d): 'the map's draw loop is yours this round...
   pan, pinch from closest to the whole valley, travel, fog of war, the dead shrinking with zoom, all at full frames on a slowed phone
   (390x844, CPU slowed 4x)'; records/BOHEMIA_WORLD_THIRTEEN_THE_MAP_NEVER_WAITS_ON_THE_GLASS_11_26_26.md).

   One browser, the phone upright (390 x 844) or on its side, the GPU's canvas on (the drawing off the page's thread, as a phone draws),
   the page's CPU slowed four times for every leg (Chrome's own throttle), the map's own calls driving it the way a finger does:
     stand     the opening zoom, nothing touched
     drag      the camera let go and dragged a third of the glass a second
     pinch     from the closest zoom (the street) to the whole valley in 3 s, and back in 3 s, about the middle of the glass
     far       the whole valley, the crew walking under the camera (the far stop's own load: everybody on the glass)
     travel    a travel order 18 blocks off, the fog of war on (what he sees fills in as he goes)
   Each leg: frames a second, the middle frame, the worst frame, HITCHES (frames over 50 ms, rule 480(d)), and the page's own long tasks
   (over 50 ms, the browser's own count) with the worst. THIS BOX DRAWS WITH A SOFTWARE GPU (SwiftShader) on CPUs it shares with the
   page: its frames a second compare builds, they are not his phone's; the long tasks are what travel to his phone.

   Run: node tools/bohemia_world_thirteen_map_frames.js [--alpha] [--side] [--json out.json] [--legs stand,drag,pinch,far,travel]
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
const ALPHA = process.argv.includes('--alpha'), SIDE = process.argv.includes('--side');
const LEGS = (arg('--legs') || 'stand,drag,pinch,far,travel').split(','), OUT = arg('--json'), RATE = +(arg('--rate') || 4);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function leg(d, name) {
  const fr = d.fr;
  /* set the leg up at full speed, let the painting land, then slow the CPU and drive it */
  await fr.evaluate((name) => {
    try { if (typeof MODE !== 'undefined' && MODE !== 'city') swapMode(); } catch (e) {}
    try { travelStop(); } catch (e) {}
    const st = BohemiaMapHouses.streetTW() / TW0, zb = zoomBounds();
    window.__MF = { st, zmin: zb[0] };
    city.x = Math.round(om.n / 2); city.y = Math.round(om.n / 2);
    setZoomAt(name === 'far' ? zb[0] : name === 'pinch' ? st : 1);
    try { camHold(); } catch (e) {} render();
  }, name);
  await sleep(name === 'pinch' ? 9000 : 7000);
  await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  const R = await fr.evaluate((name) => new Promise((res) => {
    const L = []; let po = null;
    try { po = new PerformanceObserver((l) => l.getEntries().forEach((e) => L.push(Math.round(e.duration)))); po.observe({ type: 'longtask', buffered: false }); } catch (e) {}
    const DUR = name === 'pinch' ? 6000 : name === 'travel' ? 6000 : 4000, M = window.__MF;
    let t0 = 0, last = 0; const f = [];
    if (name === 'drag') { try { camLetGo(); } catch (e) {} }
    if (name === 'travel') { const tx = Math.min(om.n - 3, city.x + 18), ty = city.y; let ok = false; try { ok = travelTo(0, 0, [tx, ty]); } catch (e) {} M.travel = ok; M.from = [city.x, city.y]; }
    const step = (t) => {
      if (!t0) { t0 = t; last = t; }
      else { f.push(t - last); last = t; }
      const u = (t - t0) / DUR;
      if (name === 'drag') { panX += (innerWidth / 3) / 60 * (Math.floor(u * 4) % 2 ? -1 : 1); }
      if (name === 'pinch') { const a = Math.log(M.st), b = Math.log(M.zmin), w = u < 0.5 ? u * 2 : (1 - u) * 2; try { setZoomAt(Math.exp(a + (b - a) * w), innerWidth / 2, innerHeight / 2); } catch (e) {} }
      if (name === 'far') { city.x += 0.02; try { camHold(); } catch (e) {} }
      try { render(); } catch (e) {}
      if (t - t0 < DUR) requestAnimationFrame(step);
      else { try { po && po.disconnect(); } catch (e) {}
        const s = f.slice().sort((a, b) => a - b);
        res({ fps: +(f.length / ((t - t0) / 1000)).toFixed(1), mid: Math.round(s[s.length >> 1] || 0), worst: Math.round(s[s.length - 1] || 0),
              hitches: f.filter((x) => x > 50).length, frames: f.length, f: f.map((x) => Math.round(x)), long: L.length, longWorst: L.length ? Math.max(...L) : 0,
              travelled: name === 'travel' ? (M.travel ? Math.round(Math.hypot(city.x - M.from[0], city.y - M.from[1]) * 10) / 10 : 'refused') : undefined,
              fog: (function () { try { return !!(window.FOG && FOG.on !== false) && !localStorage.getItem('bohemia.fog.off'); } catch (e) { return null; } })() }); }
    };
    requestAnimationFrame(step);
  }), name);
  await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  return R;
}

(async () => {
  const d = await open(Object.assign({ keepCards: true, profile: SIDE ? 'phone_landscape' : 'phone_portrait', gpu: true }, ALPHA ? { alpha: true } : {}));
  const fr = d.fr, errs = [];
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && typeof travelTo === 'function'))) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
  const out = { page: ALPHA ? 'alpha' : 'demo', phone: SIDE ? '844x390' : '390x844', rate: RATE, legs: {} };
  for (const L of LEGS) { try { out.legs[L] = await leg(d, L); } catch (e) { out.legs[L] = { err: String(e && e.message).slice(0, 160) }; }
    const r = out.legs[L]; console.log(('  ' + L).padEnd(10) + (r.err ? 'ERR ' + r.err : r.fps + ' fps, middle ' + r.mid + ' ms, worst ' + r.worst + ' ms, hitches ' + r.hitches + ' of ' + r.frames + ', long tasks ' + r.long + (r.long ? ' (worst ' + r.longWorst + ' ms)' : '') + (r.travelled !== undefined ? ', travelled ' + r.travelled + ' blocks' : '') + (r.fog !== undefined && L === 'travel' ? ', fog ' + (r.fog ? 'on' : 'off') : ''))); }
  out.errors = errs;
  console.log('MAP FRAMES ' + out.page + ' ' + out.phone + ' at ' + RATE + 'x: ' + LEGS.map((L) => L + ' ' + (out.legs[L].fps || '?') + ' fps / ' + (out.legs[L].long | 0) + ' long').join(', ') + (errs.length ? '; ERRORS ' + errs.length + ': ' + errs[0] : ''));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  await d.close();
})().catch((e) => { console.error(e); process.exit(1); });
