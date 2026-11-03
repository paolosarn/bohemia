#!/usr/bin/env node
/* WORLD 8's two VOTE cards, moving, from the game's own camera (11/3; ask lines 117 + 185, and 39).
   On the demo, his phone (390 x 844, touch), fog on, through the one driver; frames to <out>/<card>/NN.png, then
   tools/bohemia_world_8_vote_cards.py stitches each into an animated WebP under records/target/world_8/.
     node tools/bohemia_world_8_vote_cards.js <out> [pinch|sight] [phone_portrait|phone_landscape]
   pinch: one pinch from the opening stop down to the street stop, then his crew walking among the models.
   sight: him walking down a straight street; the blocks he sees at their own light move with him; a party down the street. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = process.argv[2], WANT = process.argv[3] || 'both', PROF = process.argv[4] || 'phone_portrait';

(async () => {
  const d = await open({ profile: PROF, fog: true, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page;
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaMapHouses && FOG.ready).catch(() => false)) break; }
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  for (let i = 0; i < 30; i++) { if (await fr.evaluate(() => BohemiaMapHouses.ready()).catch(() => false)) break; await fr.evaluate(() => { try { render(); } catch (e) {} }); await page.waitForTimeout(500); }
  const settle = async (ms) => { const t0 = Date.now(); for (;;) { const w = await fr.evaluate(() => { render(); return VBT.want | 0; }); if ((!w && Date.now() - t0 > 400) || Date.now() - t0 > ms) break; await page.waitForTimeout(250); } };
  let n = 0;
  const snap = async (card) => { const dir = path.join(OUT, card); fs.mkdirSync(dir, { recursive: true }); await page.screenshot({ path: path.join(dir, String(n++).padStart(3, '0') + '.png') }); };

  if (WANT === 'both' || WANT === 'pinch') {
    n = 0;
    /* a road beside a suburb he has seen, away from any town (the same spot the gate stands him on) */
    const to = await fr.evaluate(() => { const N = om.n, H = /^(suburb|estate|gated|trailer)$/; let best = null, bd = 1e9;
      for (let y = 3; y < N - 3; y++) for (let x = 3; x < N - 3; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 3)) continue;
        let k = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const t = om.at(x + a, y + b); if (t && H.test(t.district)) k++; }
        if (k < 5) continue; const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd < bd) { bd = dd; best = [x, y]; } }
      if (best) { try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; CITY_GLIDE.tx = null; fogClear(best[0], best[1], 8); } return best; });
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} setZoomAt(1); try { camHold(); } catch (e) {} render(); });
    await settle(3000);
    const z1 = await fr.evaluate(() => BohemiaMapHouses.streetTW() / TW0);
    const steps = 22;
    for (let i = 0; i <= steps; i++) { const z = Math.exp(Math.log(1) + (Math.log(z1) - Math.log(1)) * i / steps);
      await fr.evaluate((z) => { setZoomAt(z); try { camHold(); } catch (e) {} render(); }, z); await settle(i > steps * 0.55 ? 5000 : 1500); await snap('pinch'); }
    /* at the street stop: his crew walks a few blocks among the houses */
    await fr.evaluate(() => { const C = []; for (let y = city.y - 4; y <= city.y + 4; y++) for (let x = city.x - 4; x <= city.x + 4; x++) { const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd >= 2 && cityWalkable(x, y) && !loopTownAt(x, y, 1)) C.push({ x, y, dd }); }
      C.sort((a, b) => a.dd - b.dd); if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1);
      for (const c of C) { if (travelTo(0, 0, [c.x, c.y]) && TRAVEL && !TRAVEL.path.slice(1).some(q => loopTownAt(q[0], q[1], 0))) { try { travelGoes(); } catch (e) {} return; } try { travelStop(); } catch (e) {} } });
    for (let i = 0; i < 18; i++) { await page.waitForTimeout(450); await fr.evaluate(() => render()); await snap('pinch'); }
    console.log('pinch: ' + n + ' frames, to ' + JSON.stringify(to));
  }
  if (WANT === 'both' || WANT === 'sight') {
    n = 0;
    const at = await fr.evaluate(() => {
      const N = om.n; let best = null, bd = 1e9;
      for (let y = 8; y < N - 8; y++) for (let x = 8; x < N - 8; x++) { if (!sightRoad(x, y)) continue;
        for (const [ax, ay] of [[1, 0], [0, 1]]) { let run = true; for (let k = -6; k <= 6 && run; k++) if (!sightRoad(x + ax * k, y + ay * k)) run = false;
          if (!run || sightRoad(x + ay, y + ax) || sightRoad(x - ay, y - ax) || loopTownAt(x, y, 8)) continue;
          let walk = true; for (let k = -4; k <= 4 && walk; k++) if (!cityWalkable(x + ax * k, y + ay * k)) walk = false; if (!walk) continue;
          const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd < bd) { bd = dd; best = { x, y, ax, ay }; } } }
      if (!best) return null;
      try { travelStop(); } catch (e) {}
      city.x = best.x - best.ax * 4; city.y = best.y - best.ay * 4; CITY_GLIDE.tx = null; fogClear(city.x, city.y, 6);
      T.min = 13 * 60; BohemiaMapSight.rebuild(); setZoomAt(1.8); try { camHold(); } catch (e) {} render(); return best; });
    if (at) {
      await settle(3000);
      for (let i = 0; i < 3; i++) { await snap('sight'); await page.waitForTimeout(400); }
      /* by day (the clock to one in the afternoon), he steps down the street a block at a time (his glide carries each step) */
      await fr.evaluate(() => { T.min = 13 * 60; BohemiaMapSight.rebuild(); render(); });
      for (let i = 0; i < 33; i++) {
        if (i > 2 && i % 3 === 0 && i <= 26) await fr.evaluate((a) => { if (cityWalkable(city.x + a.ax, city.y + a.ay)) { city.x += a.ax; city.y += a.ay; } }, at);
        await page.waitForTimeout(380); await fr.evaluate(() => render()); await snap('sight'); }
    }
    console.log('sight: ' + n + ' frames at ' + JSON.stringify(at));
  }
  await d.close().catch(() => {});
})().catch(e => { console.log('FAILED ' + (e.stack || e.message)); process.exit(1); });
