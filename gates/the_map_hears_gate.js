/* ==========================================================================
   THE MAP HEARS  (RUN, 10/9/26, VAMILY [the map hears])

   SOUNDS 10/5 measured: the travel screen posts nothing to the parent, so the road and dirt beds and the
   sight-stop sound (rule 68a) have nothing to play to on the MAP.
   NOW (__THE_MAP_HEARS__): the map posts its travel state on the beat (500 ms at 120 BPM); the shell keeps
   it (window.BOH_MAP_STATE) and raises 'bohemia-mapstate' for whoever plays to it.

   LEGS, on the demo:
     H1 *** IT ARRIVES ON THE BEAT *** (spacing about 500 ms, whichever tab is up)
     H2 the clock in it is the map's own (minute, hour, night)
     H3 *** ROAD OR DIRT, FROM THE GROUND UNDER THE PARTY *** (a paved district says road, a desert says dirt)
     H4 moving while a journey runs, still when it is over
     H5 the clock stopped when the speed pad is on pause, running at 1X
     H6 *** ARRIVING AT A TOWN IS SAID *** (its name, the moment he gets there)
     H7 the settlement screen open is said too
     H8 nothing threw
   node gates/the_map_hears_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE MAP HEARS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const fr = d.fr, page = d.page;
  try {
    await page.waitForTimeout(2500);
    /* the shell's own record of every state it is handed */
    await page.evaluate(() => { window.__heard = []; addEventListener('bohemia-mapstate', e => window.__heard.push({ t: performance.now(), d: e.detail })); });
    await page.waitForTimeout(5200);
    const h1 = await page.evaluate(() => { const a = window.__heard; const gaps = []; for (let i = 1; i < a.length; i++) gaps.push(a[i].t - a[i - 1].t);
      gaps.sort((x, y) => x - y); return { n: a.length, med: gaps[gaps.length >> 1] || 0, kept: !!window.BOH_MAP_STATE, tab: (document.querySelector('.tab.on') || {}).dataset ? document.querySelector('.tab.on').dataset.p : null }; });
    ok('*** H1 IT ARRIVES ON THE BEAT *** (' + h1.n + ' in 5.2 s, median gap ' + Math.round(h1.med) + ' ms, kept by the shell ' + h1.kept + ', tab ' + h1.tab + ')', h1.n >= 9 && h1.med >= 400 && h1.med <= 650 && h1.kept);
    const last = () => page.evaluate(() => window.BOH_MAP_STATE);
    const start = await fr.evaluate(() => ({ x: city.x, y: city.y }));
    const clk = await fr.evaluate(() => ({ min: T.min | 0, night: isNight() }));
    const s2 = await last();
    ok('H2 the clock in it is the map\'s own (map ' + clk.min + ' night ' + clk.night + '; said ' + s2.min + ' hour ' + s2.hour + ' night ' + s2.night + ')', Math.abs(s2.min - clk.min) <= 2 && s2.hour === Math.floor(s2.min / 60) % 24 && s2.night === clk.night);

    /* H3: stand on a paved block, then on a desert one, and read what the beat says */
    const cells = await fr.evaluate(() => { let road = null, dirt = null; const N = om.n;
      for (let y = 0; y < N && !(road && dirt); y++) for (let x = 0; x < N && !(road && dirt); x++) { const t = om.at(x, y); if (!t) continue;
        if (!road && CITY_PAVED[t.district]) road = { x, y, d: t.district }; if (!dirt && /^(desert|wash|scrub|mountain)$/.test(t.district) && cityWalkable && cityWalkable(x, y)) dirt = { x, y, d: t.district }; }
      return { road, dirt }; });
    const standAt = async (c) => { await fr.evaluate((c) => { try { travelStop(); } catch (_e) {} city.x = c.x; city.y = c.y; }, c); await page.waitForTimeout(1200); return last(); };
    const onRoad = cells.road ? await standAt(cells.road) : null, onDirt = cells.dirt ? await standAt(cells.dirt) : null;
    ok('*** H3 ROAD OR DIRT, FROM THE GROUND UNDER THE PARTY *** (' + (cells.road ? cells.road.d : '?') + ' says ' + (onRoad && onRoad.surface) + '; ' + (cells.dirt ? cells.dirt.d : '?') + ' says ' + (onDirt && onDirt.surface) + ')',
      !!onRoad && onRoad.surface === 'road' && !!onDirt && onDirt.surface === 'dirt');

    /* H4, H6, H7: a real journey to the nearest town, with a touch at 1X */
    /* from where the game put him (the start), the way the loop check goes: back there, at 1X */
    await fr.evaluate((s) => { city.x = s.x; city.y = s.y; try { travelSpeedSet(1); } catch (_e) {} }, start);
    await page.evaluate(() => { window.__heard = []; });
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y); return { x: r.left + q.sx, y: r.top + q.sy + TH / 2 }; }, [town.x, town.y]);
    await d.tapAt(p.x, p.y);
    let opened = false; for (let i = 0; i < 80 && !opened; i++) { await page.waitForTimeout(300); opened = await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')); }
    await page.waitForTimeout(1500);
    const trip = await page.evaluate(() => window.__heard.map(h => h.d));
    const moved = trip.filter(s => s.moving).length, arrived = trip.find(s => s.arriving && s.arriving.ago < 1500), still = trip[trip.length - 1];
    /* H4 on its own, longer journey: a far point, four seconds of walking, then the stop */
    await fr.evaluate(() => { try { loopClose(); } catch (_e) {} });
    await page.evaluate(() => { window.__heard = []; });
    const far = await fr.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.22 }; });
    await d.tapAt(far.x, far.y); await page.waitForTimeout(4000);
    const walking = await page.evaluate(() => window.__heard.map(h => h.d.moving));
    await fr.evaluate(() => { try { travelStop(); } catch (_e) {} }); await page.waitForTimeout(1100);
    const halted = await last();
    ok('H4 moving while a journey runs, still when it is over (' + walking.filter(Boolean).length + ' of ' + walking.length + ' beats moving on the way; after the stop: moving ' + halted.moving + ')', walking.filter(Boolean).length >= 4 && halted.moving === false);
    ok('*** H6 ARRIVING AT A TOWN IS SAID *** (' + (arrived ? '"' + arrived.arriving.name + '", ' + arrived.arriving.ago + ' ms after' : 'never') + '; the town was ' + town.n + ')', !!arrived && arrived.arriving.name.toUpperCase() === town.n.toUpperCase());
    ok('H7 the settlement screen open is said too (screen open ' + opened + ', said ' + (still && still.settlement) + ')', opened && !!still && still.settlement === true);

    /* H5: the pad */
    await fr.evaluate(() => travelSpeedSet(0)); await page.waitForTimeout(1100); const paused = await last();
    await fr.evaluate(() => travelSpeedSet(1)); await page.waitForTimeout(1100); const running = await last();
    ok('H5 the clock stopped on pause, running at 1X (pause: stopped ' + paused.stopped + ', speed ' + paused.speed + '; 1X: stopped ' + running.stopped + ', speed ' + running.speed + ')', paused.stopped === true && paused.speed === 0 && running.stopped === false && running.speed === 1);
    ok('H8 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
