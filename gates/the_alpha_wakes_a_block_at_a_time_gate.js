#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE DRIVES THE ALPHA ON A SLOWED CPU, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py).
   ============================================================================
   THE ALPHA WAKES A BLOCK AT A TIME (PLUMBER 8, 11/26/26; ask row 724, FOUND BY EYES: 'the door into the game freezes on a slowed
   phone', BEGIN to the barber frames frozen 5.1, 3.2, 2.3 s, one task 7.5 s on the last walk; rule 480 'never choppy', rule 441).
   MEASURED (the alpha, the game's own link, upright 390 x 844, CPU 4x, the canvas on a GPU process; a CPU profile from the tap on BEGIN
   for 30 s, each long task given the functions that ran in it): the single longest freeze was the map's morning offer building its
   street's people, six blocks, in ONE task under his first tap (showWake -> offerRing -> ringFarLive -> castAddresses -> pplPeople ->
   realizeCell): 2.9 to 5.5 s. RUN's block-a-task warm (wakeWarm) ran in the demo only.
   NOW (__THE_ALPHA_WAKES_A_BLOCK_AT_A_TIME__, BOHEMIA_CITY_WORLD.html bootWake): inside the alpha the wake warms its blocks on idle time
   first, as the demo's does; the same ring. The demo is untouched.
     S1 the alpha's map warmed its morning a block at a time (WAKE_WARM done, blocks built), within 90 s at 4x (when printed)
     P1 PLANT the old way (__WAKE_ALL_AT_ONCE): S1 red
   The page's freezes in the 30 s after BEGIN are printed, not judged: the old 2-D crowd's whole-person bake still runs in the alpha
   (0.9 to 1.9 s a person at 4x; its split is the demo's and switched on here it stopped his first map tap in THE MAP ANSWERS AFTER
   BEGIN: the next cut, row 724), and this box's software GPU swings one task 2x.
   records/BOHEMIA_PLUMBER_THE_ALPHA_WAKES_A_BLOCK_AT_A_TIME_11_26_26.md. About 4 minutes.
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const LT = "(function(){ if (window !== window.top) return; window.__LT = []; try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { window.__LT.push([Math.round(e.startTime), Math.round(e.duration)]); }); }).observe({ entryTypes: ['longtask'] }); } catch (e) {} })();";
const WW = () => { try { const f = document.getElementById('cityFrame'); return f && f.contentWindow && f.contentWindow.WAKE_WARM ? JSON.parse(JSON.stringify(f.contentWindow.WAKE_WARM)) : null; } catch (e) { return null; } };

async function door(arm) {
  const d = await D.open({ file: 'BOHEMIA_ALPHA_0_9.html', bare: true, profile: 'phone_portrait', throttle: 4, gpu: true, arm: (arm || '') + LT });
  const p = d.page;
  try {
    await p.waitForFunction(() => window.__LOAD_READY === true, null, { timeout: 240000 });
    await sleep(1500);
    const t0 = await p.evaluate(() => performance.now());
    await p.touchscreen.tap(195, 500);
    await sleep(30000);
    const r = await p.evaluate((t0) => { const L = (window.__LT || []).filter(x => x[0] >= t0 - 50);
      return { n: L.length, ms: L.reduce((q, x) => q + x[1], 0), max: L.reduce((q, x) => Math.max(q, x[1]), 0), over1: L.filter(x => x[1] > 1000).length, over500: L.filter(x => x[1] > 500).length,
        map: !!document.getElementById('cityFrame') }; }, t0);
    let warmAt = null; for (let i = 0; i < 60; i++) { const w = await p.evaluate(WW); if (w && w.done) { warmAt = Math.round(((await p.evaluate(() => performance.now())) - t0) / 1000); break; } await sleep(1000); }
    r.ww = await p.evaluate(WW); r.warmAt = warmAt; return r;
  } finally { try { await d.close(); } catch (e) {} }
}
const say = (r) => 'the map behind the barber ' + r.map + ', its morning warm done ' + (r.warmAt != null ? r.warmAt + ' s after BEGIN' : 'not by 90 s') + '; in the first 30 s long tasks ' + r.n + ', ' + r.ms + ' ms in them, the longest ' + r.max + ' ms, past 500 ms ' + r.over500 + ', past 1 s ' + r.over1;

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--plant-only')) {
    const r = await door('');
    console.log('  now: ' + say(r));
    ok('S1 the alpha\'s map warmed its morning a block at a time on idle time (done within 90 s at 4x)', !!(r.map && r.ww && r.ww.done && r.ww.built > 0), JSON.stringify(r.ww));
  }
  if (!a.includes('--no-plant')) {
    const q = await door('window.__WAKE_ALL_AT_ONCE = true;');
    console.log('  the old way: ' + say(q));
    ok('P1 PLANT the old way (__WAKE_ALL_AT_ONCE): S1 red', !(q.ww && q.ww.done && q.ww.built > 0), JSON.stringify(q.ww));
  }
  console.log('\nTHE ALPHA WAKES A BLOCK AT A TIME: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nTHE ALPHA WAKES A BLOCK AT A TIME: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
