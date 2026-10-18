/* ==========================================================================
   THE DEMO BOOTS LIGHT  (RUN, 10/10/26, VAMILY [first load] + [load hunks], rule 66a, release line 12)

   PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
   MEASURED FIRST (a CPU profile of the demo from the link to BEGIN ready, full speed): 16.3 s with PLUMBER's six
   hunks in. Three costs were work for things the demo never shows:
     - the world seated him on his STREET and drew it, then looked out to the map: the swap 3.0 s (2.8 s of it the
       HUD working out what the street's people say) and the street drawn again as its tiles arrived, 1.7 s;
     - the CHARACTER tab's hair, family and faction boards (no such tab in the demo): 1.1 s;
     - the map's six people put on and taken off once per facing: 96 rig rebuilds, 1.0 s; and the still baked twice.
   And the build watcher pulled the whole page again 15 s in, the middle of a phone's boot.
   NOW: 5.2 s at full speed. At phone speed (PLUMBER's FIRST LOAD): BEGIN ready 75 -> about 22 s, the title 3.6 -> 1.8 s,
   27.1 -> 12.2 MB before ready.

   LEGS, on the demo at the phone's profile, a profile from the link to BEGIN ready:
     B1 *** THE STREET IS NEVER DRAWN BEFORE BEGIN *** (renderHuman and pplHeard: 0 ms; were 2.0 s and 2.8 s)
     B2 the workshop boards are not built in the demo (outfitBuild, famBuild, hairJudgeBuild: 0 ms; the boards empty)
     B3 putting the map's six people on costs at most two rig rebuilds each (was sixteen)
     B4 the still each person stands in is the breath's own 0.25 frame (one bake, not two)
     B5 he is still seated: on the map, the demo's look-out taken, his landing written
     B6 the page itself is fetched once in the first 20 s (no build check during the boot)
     B7 THE WORKSHOP IS UNCHANGED: on the alpha he starts on his street and the boards are built
     B8 nothing threw
   node gates/the_demo_boots_light_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE DEMO BOOTS LIGHT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const NAMES = ['renderHuman', 'pplHeard', 'outfitBuild', 'famBuild', 'hairJudgeBuild'];

(async () => {
  let d, pageAt = [], readyMs = null, CDP = null, profile = null;
  try {
    d = await drive.open({ keepCards: true,
      beforeGoto: async (cdp, page) => { CDP = cdp;
        /* the browser's own network log for this page (a service worker's pass-through of the same navigation is not a
           second download; the page's own fetches are, and so is a reload) */
        await cdp.send('Network.enable');
        cdp.on('Network.requestWillBeSent', e => { if (/\/slices\/BOHEMIA_DEMO\.html/.test(e.request.url) && !e.redirectResponse) pageAt.push(e.timestamp); });
        await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
      },
      beforeTap: async (page) => {
        for (let i = 0; i < 600; i++) { if (await page.evaluate(() => !!window.__LOAD_READY).catch(() => false)) break; await page.waitForTimeout(100); }
        readyMs = await page.evaluate(() => Math.round(performance.now()));
        profile = (await CDP.send('Profiler.stop')).profile;       /* from the link to BEGIN ready, nothing after */
      } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const byId = new Map(); profile.nodes.forEach(n => byId.set(n.id, n));
    const parent = new Map(); profile.nodes.forEach(n => (n.children || []).forEach(c => parent.set(c, n.id)));
    const ms = {}; NAMES.forEach(n => ms[n] = 0);
    profile.samples.forEach((id, i) => { const t = profile.timeDeltas[i] || 0; const seen = new Set(); let x = id;
      while (x !== undefined) { const f = byId.get(x).callFrame.functionName; if (ms[f] !== undefined && !seen.has(f)) { seen.add(f); ms[f] += t; } x = parent.get(x); } });
    Object.keys(ms).forEach(k => ms[k] = Math.round(ms[k] / 1000));
    ok('*** B1 THE STREET IS NEVER DRAWN BEFORE BEGIN *** (BEGIN ready at ' + (readyMs / 1000).toFixed(1) + ' s; the street drawn ' + ms.renderHuman + ' ms, its people\'s lines ' + ms.pplHeard + ' ms)', ms.renderHuman === 0 && ms.pplHeard === 0);
    await d.page.waitForTimeout(3000);
    const boards = await d.page.evaluate(() => ['outfitBoard', 'famBoard', 'hairJudge'].map(id => { const e = document.getElementById(id); return e ? e.querySelectorAll('canvas').length : -1; }));
    ok('B2 the workshop boards are not built in the demo (outfitBuild ' + ms.outfitBuild + ' ms, famBuild ' + ms.famBuild + ' ms, hairJudgeBuild ' + ms.hairJudgeBuild + ' ms; canvases on the boards ' + boards.join('/') + ')',
      ms.outfitBuild === 0 && ms.famBuild === 0 && ms.hairJudgeBuild === 0 && boards.every(n => n <= 0));
    /* B3, B4: the cast again, counted and caught on its way to the map */
    const c = await d.page.evaluate(() => {
      const f = document.getElementById('cityFrame'), w = f.contentWindow, op = w.postMessage; let msg = null, n = 0;
      const R = window.rebuildFromRig; window.rebuildFromRig = function () { n++; return R.apply(this, arguments); };
      w.postMessage = function (m, o) { if (m && m.type === 'BOHEMIA_CITY_CAST' && !m.append && !msg) msg = m; return op.call(w, m, o); };
      try { CCAST = null; citySendCast(); } finally { window.rebuildFromRig = R; w.postMessage = op; }
      const L = msg && msg.looks || [];
      const still = L.length && L.every(l => Object.keys(l.dirs).length === 8 && Object.keys(l.dirs).every(k => { const x = l.dirs[k]; return x.breathe && x.idle === x.breathe[CAST_PHS.indexOf(0.25)]; }));
      return { n, looks: L.length, still: !!still };
    });
    ok('B3 the map\'s six people cost at most two rig rebuilds each (' + c.n + ' rebuilds for ' + c.looks + ' people; it was 96)', c.looks === 6 && c.n > 0 && c.n <= 2 * c.looks + 1);
    ok('B4 each one\'s still is the breath\'s own 0.25 frame (' + c.still + ')', c.still);
    const seat = await d.fr.evaluate(() => ({ mode: MODE, demoMap: DEMO_ON_MAP, landed: !!LANDED, seating: SEATING }));
    ok('B5 he is still seated: on the map ' + (seat.mode === 'city') + ', the look-out taken ' + seat.demoMap + ', his landing written ' + seat.landed, seat.mode === 'city' && seat.demoMap === true && seat.landed && seat.seating === false);
    const left = Math.max(0, 20000 - await d.page.evaluate(() => performance.now()));
    await d.page.waitForTimeout(left + 500);
    /* by the browser's own clock from the page's first request (the two-minute build check is allowed, later) */
    const in20 = pageAt.filter(t => t - pageAt[0] <= 20).length;
    ok('B6 the page itself is fetched once in its first 20 s (' + in20 + '; ' + pageAt.length + ' in the whole run)', in20 === 1);
    ok('B8a nothing threw on the demo (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* B7: the workshop, unchanged */
  let a;
  try {
    a = await drive.open({ alpha: true, keepCards: true });
    await a.page.waitForTimeout(4000);
    const s = await a.fr.evaluate(() => ({ mode: MODE, landed: !!LANDED }));
    const boards = await a.page.evaluate(() => { const e = document.getElementById('outfitBoard'); return e ? e.querySelectorAll('canvas').length : -1; });
    ok('B7 THE WORKSHOP IS UNCHANGED (the alpha starts him on ' + (s.mode === 'human' ? 'his street' : s.mode) + ', landed ' + s.landed + '; the faction board ' + boards + ' canvases)', s.mode === 'human' && s.landed && boards > 0);
    ok('B8 nothing threw on the alpha (' + a.errs.length + (a.errs.length ? ': ' + String(a.errs[0]).slice(0, 120) : '') + ')', a.errs.length === 0);
  } catch (e) { ok('B7 the alpha boots [' + String(e.message).slice(0, 160) + ']', false); }
  if (a) await a.close();
  done();
})();
