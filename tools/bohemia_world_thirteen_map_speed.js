#!/usr/bin/env node
/* ============================================================================
   THE MAP'S SPEED ON A CHEAP PHONE (WORLD THIRTEEN 11/17, VAMILY rule 453(3); the coordinator: 'the map draws fast on a cheap
   phone at every zoom on every seed (measure it; PLUMBER 8 holds the freeze rows)').

   On the demo at a phone's size, the CPU throttled (the knob DevTools uses; 4 = a phone-shaped CPU), the GPU's canvas on (SwiftShader,
   as PLUMBER 7's journeys), for several valleys (the map's own REROLL), at the four stops (far: the whole valley; opening; near;
   street), it reads:
     valley   the new valley's own set-up (the reroll's handler: the generator, the power, the streets, the tracks, the places)
     first    from the stop set to a whole picture on the glass (no tile with nothing at any detail under it)
     fill     from the stop set to every tile on the glass painted at its own detail (VBT and VBC idle), the tiles asked and landed
     core     the painter's own cost of one tile at that stop's size (vbCityCore on the page's thread, three tiles round the camera)
     pan      the camera slid across the valley for three seconds: frames a second, the median and the worst frame
   and prints a table (and --json writes it).

     node tools/bohemia_world_thirteen_map_speed.js [--throttle 4] [--valleys 6] [--json out.json] [--profile phone_portrait]
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const THR = +arg('--throttle', 4), NV = +arg('--valleys', 6), PROF = arg('--profile', 'phone_portrait'), OUT = arg('--json', null);
const POOL = arg('--pool', null), QUICK = arg('--quick', null), STOPS = (arg('--stops', 'far,opening,near,street')).split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const spot = (v, k) => { let h = 2166136261 >>> 0; for (const c of v + ':' + k) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return [(h & 1023) / 1023, ((h >>> 10) & 1023) / 1023]; };
async function measure(opts) {
  const thr = (opts && opts.throttle) || THR, nv = (opts && opts.valleys) || NV, prof = (opts && opts.profile) || PROF, log = (opts && opts.log) || console.log;
  const d = await open({ keepCards: true, profile: prof, gpu: true });
  const errs = []; d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  const fr = d.fr;
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof vbCityCore === 'function' && typeof setZoomAt === 'function'))) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
  const cdp = d.cdp || await d.page.context().newCDPSession(d.page);
  const stops = await fr.evaluate(() => { const b = zoomBounds(); let st = b[1]; try { if (window.BohemiaMapHouses && BohemiaMapHouses.on()) st = Math.max(st, BohemiaMapHouses.streetTW() / TW0); } catch (e) {} return { far: b[0], opening: 1, near: st * 0.45, street: st }; });
  const pool = (opts && opts.pool != null) ? opts.pool : POOL, quick = (opts && opts.quick != null) ? opts.quick : QUICK, stopList = (opts && opts.stops) || STOPS;
  await fr.evaluate(([p, q]) => { if (p != null && window.VBT) VBT.poolN = +p; if (q != null) VB_QUICK_S = +q || 0; }, [pool, quick]);   /* --pool 1 --quick 0: the map as it was before 11/17 */
  const rows = [];
  for (let v = 0; v < nv; v++) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: thr });
    const vs = await fr.evaluate((v) => { try { travelStop(); } catch (e) {} const t0 = performance.now(); if (v) { const b = document.getElementById('reroll'); if (b) b.click(); }
      const t1 = performance.now(); let t2 = t1; try { vbLanesValley(); vbTemplatesValley(); t2 = performance.now(); } catch (e) {}
      return { seed: om.seed >>> 0, reroll: Math.round(t1 - t0), lanes: Math.round(t2 - t1), n: om.n }; }, v);
    for (const k of stopList) {
      const fill = await fr.evaluate(([z, h]) => new Promise((res) => { const N = om.n; city.x = N * 0.5 + (h[0] - 0.5) * N * 0.3; city.y = N * 0.5 + (h[1] - 0.5) * N * 0.3;   /* the same spot for the same valley and stop, run to run */
        try { CITY_GLIDE.tx = null; } catch (e) {} const a0 = VBT.asked, l0 = VBT.landed, t0 = performance.now(); setZoomAt(z); try { camHold(); } catch (e) {} render();
        let idle = 0, first = null, f0 = 0; const fr0 = VBT.frame | 0; const tick = () => { render(); const busy = (VBT.want | 0) + (VBT.busy ? 1 : 0) + (VBC.busy ? 1 : 0); idle = busy ? 0 : idle + 1;
          if (first === null && (VBT.frame | 0) > fr0 + 1 && !(VBT.bare | 0)) { f0++; if (f0 >= 2) first = Math.round(performance.now() - t0); } else if (first === null) f0 = 0;
          if (idle >= 3 || performance.now() - t0 > 90000) res({ ms: Math.round(performance.now() - t0), first: first === null ? Math.round(performance.now() - t0) : first, asked: VBT.asked - a0, landed: VBT.landed - l0, S: vbTileS(), tw: +TW.toFixed(1), timeout: idle < 3 });
          else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }), [stops[k], spot(v, k)]);
      const core = await fr.evaluate(() => { const S = vbTileS(), T8 = VB_TILE, tx = Math.floor(city.x / T8), ty = Math.floor(city.y / T8), ms = [];
        for (const [a, b] of [[0, 0], [1, 0], [0, 1]]) { try { const inp = vbTileInput(tx + a, ty + b, S); const t0 = performance.now(); vbCityCore(inp); ms.push(performance.now() - t0); } catch (e) { ms.push(-1); } }
        return { S, ms: ms.map((x) => Math.round(x)) }; });
      const pan = await fr.evaluate(() => new Promise((res) => { const f = [], t0 = performance.now(); let last = t0; const dx = 0.04 * (TW0 / Math.max(8, TW)) ;
        const step = (t) => { f.push(t - last); last = t; city.x = Math.max(4, Math.min(om.n - 4, city.x + dx * 6)); city.y = Math.max(4, Math.min(om.n - 4, city.y + dx * 3)); try { camHold(); } catch (e) {} render();
          if (t - t0 < 3000) requestAnimationFrame(step); else { const s = f.slice(1).sort((a, b) => a - b); res({ fps: +(f.length / ((t - t0) / 1000)).toFixed(1), p50: Math.round(s[s.length >> 1] || 0), max: Math.round(s[s.length - 1] || 0), over33: s.filter((x) => x > 33).length / Math.max(1, s.length) }); } };
        requestAnimationFrame(step); }));
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      const row = { valley: v, seed: vs.seed, setup: v ? vs.reroll : null, lanes: vs.lanes, stop: k, tw: fill.tw, S: fill.S, first: fill.first, fill: fill.ms, asked: fill.asked, landed: fill.landed, timeout: fill.timeout, core: core.ms, fps: pan.fps, p50: pan.p50, max: pan.max, over33: +(pan.over33 * 100).toFixed(0) };
      rows.push(row);
      log('  valley ' + v + ' (' + vs.seed + ')' + (v ? ', set up ' + vs.reroll + ' ms' : '') + ', ' + k.padEnd(7) + ' block ' + String(fill.tw).padStart(5) + ' px, tiles ' + fill.S + ': a whole picture in ' + String(fill.first).padStart(5) + ' ms, every tile at its detail in ' + String(fill.ms).padStart(5) + ' ms (' + fill.landed + ' tiles' + (fill.timeout ? ', TIMED OUT' : '') + '), one tile ' + core.ms.join('/') + ' ms; sliding ' + pan.fps + ' fps, median ' + pan.p50 + ' ms, worst ' + pan.max + ' ms');
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: thr });
    }
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
  try { await d.close(); } catch (e) {}
  return { throttle: thr, profile: prof, rows, errs };
}
module.exports = { measure };
if (require.main === module) {
  measure().then((r) => { if (OUT) fs.writeFileSync(OUT, JSON.stringify(r, null, 1)); console.log('errors: ' + r.errs.length); }).catch((e) => { console.error(e); process.exit(1); });
}
