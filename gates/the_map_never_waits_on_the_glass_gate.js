#!/usr/bin/env node
/* ============================================================================
   THE MAP NEVER WAITS ON THE GLASS (WORLD THIRTEEN 11/26, VAMILY rule 480(c)(d): 'the map's draw loop is yours this round... all at
   full frames on a slowed phone (390x844, CPU slowed 4x); the zoom-out freeze you filed is yours to fix at its source'; row 661;
   records/BOHEMIA_WORLD_THIRTEEN_THE_MAP_NEVER_WAITS_ON_THE_GLASS_11_26_26.md).

   MEASURED BEFORE (the demo upright, the GPU canvas on, the CPU slowed 4x, the whole valley on the glass): 1.6 to 2.2 frames a second,
   frames of 1.6 s; 74 in 100 of the page thread in getImageData: the outline of every walker and the armour's head found on it read
   pictures the GPU held (each read a wait for the whole GPU queue), and the ink line read one again every ten seconds (row 661).

     W1 THE SPRITES ARE IN MEMORY: the map's walkers' sprites (the rig's frame and its outline, as the map draws them) keep their pixels
        in memory ('read often'); PLANTED (MAP_SPRITE_MEM off, the old way): on the GPU (red)
     W2 THE WHOLE VALLEY SLIDING ON A SLOWED PHONE: the armour reads no picture off the GPU (no read made off the thread of a canvas
        the GPU holds) and its drawing costs under 300 ms of a 4 s slide (it was 1.3 s of 5); the page's own long tasks under 150 ms
     W3 THE HUD WRITES ONLY WHAT CHANGED: a 3 s slide wakes the page's watchers under 40 times (it was 91: the action button's classes
        22 times a second, the button column taken out and put back 23 times a second, the halving's classes, the phone's clock), none
        of them the action button, the column or the clock with the same value
     W4 THE MARKET'S HUBS ARE LISTED ONCE: 20 moves of the marker list the valley's hubs once (it listed them every beat), the nearest
        the same as the payday engine's own answer at 20 points, and a cleared key lists them again at once (the market gates' way)
     W6 THE BORDERS, ONE STROKE A COLOUR: the territory's borders at the whole valley are stroked once a holder (they were an edge a
        stroke: 108,000 strokes in 8 s, 19,134 canvas calls in one frame, 128,893 line draws in the GPU's batch after a new valley);
        PLANTED (MAP_TURF_ONE_STROKE off, the old way): thousands (red)
     W5 nothing threw

   Run: node gates/the_map_never_waits_on_the_glass_gate.js     (about 3 minutes)
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) pass++; else fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (info ? '  [' + info + ']' : '')); return cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let d; const errs = [];
  try { d = await open({ keepCards: true, profile: 'phone_portrait', gpu: true }); } catch (e) { ok('the page boots [' + String(e.message).slice(0, 120) + ']', false); process.exit(1); }
  d.page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  const fr = d.fr;
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && window.BohemiaWear && typeof spriteAt === 'function'))) break; await sleep(400); }
    for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(400); }
    await fr.evaluate(() => { if (typeof MODE !== 'undefined' && MODE !== 'city') { try { swapMode(); } catch (e) {} } try { travelStop(); } catch (e) {} setZoomAt(1); try { camHold(); } catch (e) {} render(); });
    await sleep(3000);

    /* W1 */
    const W1 = await fr.evaluate(() => { const one = () => { const S = RIG_CAST && RIG_CAST.sets, k = S && Object.keys(S)[0], f = k && (S[k].S || S[k][Object.keys(S[k])[0]]); const fr0 = f && (f.idle || (f.walk && f.walk[0]));
        if (!fr0) return null; RIG_LRU.clear(); SPRITE_AT_LRU.clear(); for (const kk of Object.keys(fr0)) if (/^_k/.test(kk)) delete fr0[kk];
        const rc = rigCanvas(fr0), sp = spriteAt(fr0, 32), a = (c) => { try { return !!c.getContext('2d').getContextAttributes().willReadFrequently; } catch (e) { return null; } };
        return { rig: a(rc), sprite: a(sp), kind: fr0 instanceof RigFrame ? 'a rig frame' : 'a canvas' }; };
      const A = one(); MAP_SPRITE_MEM.on = false; let B = null; try { B = one(); } finally { MAP_SPRITE_MEM.on = true; RIG_LRU.clear(); SPRITE_AT_LRU.clear(); } return { A, B }; });
    ok('W1 THE SPRITES ARE IN MEMORY: ' + (W1.A ? W1.A.kind + ': its canvas ' + (W1.A.rig ? 'in memory' : 'on the GPU') + ', the outlined sprite ' + (W1.A.sprite ? 'in memory' : 'on the GPU') : 'no frame') + '; PLANTED (the old way): ' + (W1.B ? (W1.B.rig || W1.B.sprite ? 'still in memory' : 'on the GPU (red)') : 'no frame'),
      !!W1.A && W1.A.rig === true && W1.A.sprite === true && !!W1.B && W1.B.rig === false && W1.B.sprite === false);

    /* W2 + W3: the whole valley sliding at 4x */
    await fr.evaluate(() => { setZoomAt(zoomBounds()[0]); city.x = Math.round(om.n / 2); city.y = Math.round(om.n / 2); try { camHold(); } catch (e) {} render(); });
    await sleep(9000);
    await fr.evaluate(() => { const W = BohemiaWear; if (!W.__gateOn) { const o = W.on; W.__gateOn = o; W.on = function () { const t = performance.now(); try { return o.apply(this, arguments); } finally { window.__GW.ms += performance.now() - t; window.__GW.n++; } }; }
      window.__GW = { ms: 0, n: 0, cib: 0 }; if (!window.__gateCib) { const c0 = window.createImageBitmap; window.__gateCib = c0; window.createImageBitmap = function (s) { if (s && s.getContext) window.__GW.cib++; return c0.apply(window, arguments); }; } });
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const S = await fr.evaluate(() => new Promise((res) => {
      const L = [], M = { cb: 0, recs: 0, same: [] }; let po = null;
      try { po = new PerformanceObserver((l) => l.getEntries().forEach((e) => L.push(Math.round(e.duration)))); po.observe({ type: 'longtask' }); } catch (e) {}
      const mo = new MutationObserver((rs) => { M.cb++; rs.forEach((r) => { M.recs++; const t = r.target, id = t.id || (t.parentNode && t.parentNode.id) || '';
        const same = r.type === 'attributes' ? r.oldValue === t.getAttribute(r.attributeName) : [...r.addedNodes].map((n) => n.textContent).join('|') === [...r.removedNodes].map((n) => n.textContent).join('|');
        if (same && /^(mode|modeLbl|blstack|tlstack|cityfeedclock)$/.test(id)) M.same.push(r.type + ':' + id); }); });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'open'], attributeOldValue: true });
      const t0 = performance.now(); let n = 0; const W0 = BohemiaWear.readsOffThread().asked;
      const step = (t) => { n++; city.x += 0.05 * (TW0 / Math.max(8, TW)) * 3; city.y += 0.02; try { camHold(); } catch (e) {} try { render(); } catch (e) {}
        if (t - t0 < 4000) requestAnimationFrame(step);
        else { mo.disconnect(); try { po && po.disconnect(); } catch (e) {}
          res({ fps: +(n / ((t - t0) / 1000)).toFixed(1), long: L.length, longWorst: L.length ? Math.max(...L) : 0, wearMs: Math.round(__GW.ms), wearN: __GW.n, cib: __GW.cib, offThread: BohemiaWear.readsOffThread().asked - W0, M }); } };
      requestAnimationFrame(step); }));
    await d.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    ok('W2 THE WHOLE VALLEY SLIDING, THE CPU SLOWED 4x (' + S.fps + ' frames a second on this box): the armour drew ' + S.wearN + ' times in ' + S.wearMs + ' ms, ' + S.cib + ' reads of a canvas off the thread (' + S.offThread + ' asked); the page\'s long tasks ' + S.long + (S.long ? ', the worst ' + S.longWorst + ' ms' : ''),
      S.wearN > 0 && S.wearMs < 300 && S.cib === 0 && S.longWorst < 150);
    ok('W3 THE HUD WRITES ONLY WHAT CHANGED: the slide woke the page\'s watchers ' + S.M.cb + ' times (' + S.M.recs + ' changes); the same value written again to the action button, the button column or the clock: ' + S.M.same.length + (S.M.same.length ? ' (' + [...new Set(S.M.same)].join(', ') + ')' : ''),
      S.M.cb < 40 && S.M.same.length === 0);

    /* W6 the borders */
    const W6 = await fr.evaluate(() => { const P = CanvasRenderingContext2D.prototype, o = P.stroke; let n = 0; P.stroke = function () { if (this === g) n++; return o.apply(this, arguments); };
      const run = () => { n = 0; travelStop && (() => { try { travelStop(); } catch (e) {} })(); setZoomAt(zoomBounds()[0]); try { camHold(); } catch (e) {} render(); return n; };
      let one = 0, old = 0, ink = 0; try { one = run(); ink = Object.keys(window.__TURF_INK || {}).length; MAP_TURF_ONE_STROKE = false; old = run(); } finally { MAP_TURF_ONE_STROKE = true; P.stroke = o; }
      return { one, old, ink }; });
    ok('W6 THE BORDERS, ONE STROKE A COLOUR: the whole valley on the glass strokes ' + W6.one + ' times a frame for ' + W6.ink + ' holders\' borders; PLANTED (an edge a stroke, the old way): ' + W6.old + ' (red)',
      W6.ink > 0 && W6.one <= 4 * W6.ink + 60 && W6.old > 5 * Math.max(1, W6.one));

    /* W4 */
    const W4 = await fr.evaluate(() => { const P = BohemiaPayday, h0 = P.hubs; let calls = 0; P.hubs = function () { calls++; return h0.apply(this, arguments); };
      let agree = 0, asked = 0, fresh = 0; const wasX = city.x, wasY = city.y, wasM = MODE;
      try { MODE = 'city'; MKT_HUB_KEY = null; mktHub(); calls = 0;
        for (let i = 0; i < 20; i++) { city.x = 5 + (i * 37) % (om.n - 10) + 0.3; city.y = 5 + (i * 53) % (om.n - 10) + 0.7; const h = mktHub();
          P.hubs = h0; const want = P.nearestHub(om, city.x, city.y); P.hubs = function () { calls++; return h0.apply(this, arguments); };
          asked++; if ((!h && !want) || (h && want && h.id === want.id && Math.abs(h.dist - want.dist) < 1e-9)) agree++; }
        const listed = calls; MKT_HUB_KEY = null; mktHub(); fresh = calls - listed;
        return { listed, agree, asked, fresh };
      } finally { P.hubs = h0; city.x = wasX; city.y = wasY; MODE = wasM; MKT_HUB_KEY = null; } });
    ok('W4 THE MARKET\'S HUBS ARE LISTED ONCE: 20 moves of the marker listed the valley\'s hubs ' + W4.listed + ' times; the nearest the payday engine\'s own answer at ' + W4.agree + ' of ' + W4.asked + ' points; a cleared key listed them again ' + W4.fresh + ' time',
      W4.listed <= 1 && W4.agree === W4.asked && W4.fresh === 1);
  } catch (e) { ok('the page legs ran [' + String(e && e.message).slice(0, 160) + ']', false); }
  ok('W5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  try { await d.close(); } catch (_e) {}
  console.log('\nTHE MAP NEVER WAITS ON THE GLASS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
