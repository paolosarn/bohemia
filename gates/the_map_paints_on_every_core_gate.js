#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES TIME, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   ============================================================================
   THE MAP PAINTS ON EVERY CORE (WORLD THIRTEEN 11/17, VAMILY rule 453(3); the coordinator: 'the map draws fast on a cheap phone at
   every zoom on every seed (measure it; PLUMBER 8 holds the freeze rows)').

   MEASURED (tools/bohemia_world_thirteen_map_speed.js, the demo at a phone's size, records/BOHEMIA_WORLD_THIRTEEN_THE_MAP_PAINTS_ON_
   EVERY_CORE_11_17_26.md): at the near stop the close tiles (128 texels a block) were painted one after another on the one worker
   that also paints the whole valley, two to seven seconds a tile, so the glass showed the valley's blur for 32 to 58 seconds.

     Q1 THE POOL: the close tiles go to painters of their own, half the cores (one at least, three at most), never the whole
        painting's worker; a tile is never asked twice while it is being painted; a painter that never answers is let go
     Q2 A QUICK PICTURE FIRST: at the near stop a tile with nothing at any detail under it is asked at 60 texels a block before its
        own detail, the nearest first, and stands in until its own lands
     Q3 THE GLASS FILLS (the demo on a phone upright, three valleys, the near and street stops, full speed): every stop ends with
        every tile at its own detail, nothing thrown, and a whole picture on the glass at least as soon as the old way's (one
        painter, no quick picture) on the same spots, summed over the stops (this box shares its cores with its software GPU, so
        the sum is the measure, each stop is printed)
     Q4 PLANTED: the pool switched to the old one painter and the quick picture off: Q1 and Q2 read red
     Q6 A NEW VALLEY'S WHOLE PAINTING goes to a free painter, not in line behind the land past the map on the one old worker
        (MEASURED: the first painting after the page opens waited 10.5 s there, 2.4 s on the pool); planted: the old worker
     Q5 THE ALPHA ON ITS SIDE (rule 441): the same near stop on the alpha, the phone on its side: it fills, the pool and the quick
        picture at work, nothing thrown

   Run: node gates/the_map_paints_on_every_core_gate.js        (about 12 minutes: the old way and the new on the same spots)
        node gates/the_map_paints_on_every_core_gate.js --quick (Q1, Q2, Q4 only)
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { measure } = require(path.join(ROOT, 'tools/bohemia_world_thirteen_map_speed.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const done = () => { console.log('\nTHE MAP PAINTS ON EVERY CORE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function structure(planted, prof, alpha) {
  const d = await open(Object.assign({ keepCards: true, profile: prof || 'phone_portrait', gpu: true }, alpha ? { alpha: true } : {})); const fr = d.fr, errs = [];
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof setZoomAt === 'function' && window.VBT))) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
  await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { try { swapMode(); } catch (e) {} } });   /* the alpha opens walking: the map's city view, as a tap on the map does */
  for (let i = 0; i < 20; i++) { if (await fr.evaluate(() => MODE === 'city').catch(() => false)) break; await sleep(250); }
  const R = await fr.evaluate((planted) => new Promise((res) => {
    if (planted) { VBT.poolN = 1; VB_QUICK_S = 0; }
    const hc = navigator.hardwareConcurrency | 0, want = Math.max(1, Math.min(3, Math.floor((hc || 2) / 2)));
    const sends = [], twice = []; const S0 = window.vbTileSend; let maxFly = 0;
    window.vbTileSend = function (inp) { if (VBT.flying[inp.key]) twice.push(inp.key); sends.push({ key: inp.key, S: inp.S, t: performance.now() }); S0(inp); maxFly = Math.max(maxFly, VBT.fly); };
    const st = BohemiaMapHouses.streetTW() / TW0; city.x = om.n * 0.45; city.y = om.n * 0.55; try { travelStop(); } catch (e) {}
    setZoomAt(st * 0.45); try { camHold(); } catch (e) {} const t0 = performance.now(); let idle = 0;
    const tick = () => { render(); const b = (VBT.want | 0) + (VBT.fly | 0) + (VBC.busy ? 1 : 0); idle = b ? 0 : idle + 1;
      if (idle >= 3 || performance.now() - t0 > 120000) {
        /* the reaper: a flight older than its limit is let go */
        VBT.flying['__gate_dead__'] = { w: null, at: performance.now() - 60000 }; VBT.fly++; try { vbTileReap(); } catch (e) {}
        const reaped = !VBT.flying['__gate_dead__'];
        res({ hc, want, pool: VBT.pool.length, poolN: (typeof vbTilePool === 'function') ? vbTilePool() : 1, maxFly, twice, S: vbTileS(), sends: sends.slice(0, 40), whole: VB.worker && VBT.pool.indexOf(VB.worker) >= 0, reaped, onPage: VBT.onPage | 0, ms: Math.round(performance.now() - t0), timedOut: idle < 3 }); }
      else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }), planted);
  try { await d.close(); } catch (e) {}
  const firstQuick = R.sends.findIndex((s) => s.S === 60), firstFull = R.sends.findIndex((s) => s.S === R.S);
  return Object.assign(R, { errs, firstQuick, firstFull, quickN: R.sends.filter((s) => s.S === 60).length, fullN: R.sends.filter((s) => s.S === R.S).length });
}

(async () => {
  const A = await structure(false);
  ok('Q1 THE POOL: the close tiles go to painters of their own (' + A.pool + ' on ' + A.hc + ' cores, half of them, at most three; up to ' + A.maxFly + ' tiles at once), never the whole painting\'s worker, no tile asked twice while it is painted (' + A.twice.length + '), a painter that never answers let go (' + A.reaped + '), none painted on the page (' + A.onPage + ')',
    A.poolN === A.want && A.pool >= 1 && A.pool <= A.want && A.maxFly >= Math.min(2, A.want) && !A.whole && A.twice.length === 0 && A.reaped && A.onPage === 0 && !A.timedOut, 'the near stop filled in ' + A.ms + ' ms');
  ok('Q2 A QUICK PICTURE FIRST: at the near stop (tiles of ' + A.S + ') the bare tiles are asked at 60 texels a block first (' + A.quickN + ' quick, ' + A.fullN + ' at their own detail; the first ask ' + (A.sends[0] ? A.sends[0].S : '?') + ')',
    A.S >= 96 && A.quickN >= 1 && A.firstQuick === 0 && A.firstFull > A.firstQuick);
  const P = await structure(true);
  ok('Q4 PLANTED FAIL: the old one painter and no quick picture: Q1 red (' + P.pool + ' painter, up to ' + P.maxFly + ' at once) and Q2 red (' + P.quickN + ' quick)', !(P.poolN === P.want && P.maxFly >= Math.min(2, P.want)) && P.quickN === 0);
  ok('Q nothing threw on the page', A.errs.length === 0 && P.errs.length === 0, A.errs.concat(P.errs).slice(0, 2).join(' | '));
  /* Q6 (11/18): the whole painting of a new valley goes to a free painter, never in line behind the land past the map */
  { const d = await open({ keepCards: true, profile: 'phone_portrait', gpu: true }); const fr = d.fr;
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && typeof vbTileSend === 'function'))) break; await sleep(400); }
    for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
    const run = (old) => fr.evaluate((old) => new Promise((res) => { VB_CITY_ON_VB = !!old; const sent = []; const S0 = window.vbTileSend; window.vbTileSend = function (inp) { sent.push(inp.kind); return S0(inp); };
      try { travelStop(); } catch (e) {} setZoomAt(zoomBounds()[0]); try { camHold(); } catch (e) {} const t0 = performance.now(); document.getElementById('reroll').click();
      const tick = () => { render(); if ((VBC.day && VBC.seed === om.seed && !VBC.busy) || performance.now() - t0 > 120000) { window.vbTileSend = S0; VB_CITY_ON_VB = false; res({ city: sent.filter((k) => k === 'city').length, landMs: VBC.landMs, ok: VBC.seed === om.seed }); } else requestAnimationFrame(tick); };
      requestAnimationFrame(tick); }), old);
    const A6 = await run(false), P6 = await run(true);
    ok('Q6 A NEW VALLEY\'S WHOLE PAINTING ON A FREE PAINTER (' + A6.city + ' asked of the pool, landed in ' + A6.landMs + ' ms), never behind the land; planted on the old worker: ' + P6.city + ' asked of the pool (red)', A6.ok && A6.city >= 1 && P6.city === 0);
    try { await d.close(); } catch (e) {} }
  const L = await structure(false, 'phone_landscape', true);
  ok('Q5 THE ALPHA ON ITS SIDE: the near stop fills (' + L.ms + ' ms) with the pool (' + L.pool + ' painters, up to ' + L.maxFly + ' at once) and the quick picture first (' + L.quickN + ' quick), nothing thrown',
    !L.timedOut && L.pool >= 1 && L.quickN >= 1 && L.firstQuick === 0 && L.twice.length === 0 && L.onPage === 0 && L.errs.length === 0, L.errs.slice(0, 2).join(' | '));
  if (process.argv.includes('--quick')) return done();

  const opts = { throttle: 1, valleys: 3, stops: ['near', 'street'], log: (l) => console.log('       ' + l.trim()) };
  console.log('     THE OLD WAY (one painter, no quick picture):');
  const O = await measure(Object.assign({ pool: 1, quick: 0 }, opts));
  console.log('     THIS BUILD:');
  const N = await measure(opts);
  const sum = (r, k) => r.rows.reduce((t, x) => t + x[k], 0), all = (r) => r.rows.every((x) => !x.timeout);
  const of = sum(O, 'first'), nf = sum(N, 'first'), om = sum(O, 'fill'), nm = sum(N, 'fill');
  ok('Q3 THE GLASS FILLS on three valleys at the near and street stops: a whole picture in ' + (nf / 1000).toFixed(1) + ' s summed (the old way ' + (of / 1000).toFixed(1) + ' s), every tile at its own detail in ' + (nm / 1000).toFixed(1) + ' s (the old way ' + (om / 1000).toFixed(1) + ' s); every stop finished, nothing thrown',
    all(N) && N.errs.length === 0 && nf <= of * 1.1, 'per stop, new / old first: ' + N.rows.map((x, i) => x.stop + ' ' + (x.first / 1000).toFixed(1) + '/' + (O.rows[i].first / 1000).toFixed(1)).join(', '));
  done();
})().catch((e) => { console.error(e); process.exit(2); });
