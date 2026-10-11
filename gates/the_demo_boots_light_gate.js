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
     ADDED 10/11 (round two): B1b no street-crowd poll and no street-walk warm-up before BEGIN; B9 the six people's breath
     and his walk are baked after the world is ready (a facing at a time); B10 the map ends with the same 280 frames as
     the workshop's one-piece bake (hashed), and no run frames (nothing draws them)
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
const NAMES = ['renderHuman', 'pplHeard', 'outfitBuild', 'famBuild', 'hairJudgeBuild', 'everyone', 'warmTick'];
/* the frames the map ends up holding: the boot cast's six (stills and breath) and his own (stills and walk), and his run */
const FRAMES = () => { let h = 2166136261 >>> 0, n = 0; const mix = c => { const a = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 0; i < a.length; i += 3) { h ^= a[i]; h = Math.imul(h, 16777619) >>> 0; } n++; };
  const D8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; let runs = 0;
  for (let i = 0; i < 6; i++) for (const d of D8) { const s = CAST_CV[i][d]; mix(s.idle); (s.breathe || []).forEach(mix); }
  for (const d of D8) { const s = PLAYER_CV[d]; mix(s.idle); (s.walk || []).forEach(mix); runs += (s.run || []).length; }
  return { h, n, runs }; };

(async () => {
  let demoFrames = null, d, pageAt = [], readyMs = null, CDP = null, profile = null;
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
    ok('B1b the street\'s crowd is never asked for on the map (everyone() ' + ms.everyone + ' ms) and his street walk is never warmed (' + ms.warmTick + ' ms)', ms.everyone === 0 && ms.warmTick <= 20);
    ok('*** B1 THE STREET IS NEVER DRAWN BEFORE BEGIN *** (BEGIN ready at ' + (readyMs / 1000).toFixed(1) + ' s; the street drawn ' + ms.renderHuman + ' ms, its people\'s lines ' + ms.pplHeard + ' ms)', ms.renderHuman === 0 && ms.pplHeard === 0);
    await d.page.waitForTimeout(3000);
    const boards = await d.page.evaluate(() => ['outfitBoard', 'famBoard', 'hairJudge'].map(id => { const e = document.getElementById(id); return e ? e.querySelectorAll('canvas').length : -1; }));
    ok('B2 the workshop boards are not built in the demo (outfitBuild ' + ms.outfitBuild + ' ms, famBuild ' + ms.famBuild + ' ms, hairJudgeBuild ' + ms.hairJudgeBuild + ' ms; canvases on the boards ' + boards.join('/') + ')',
      ms.outfitBuild === 0 && ms.famBuild === 0 && ms.hairJudgeBuild === 0 && boards.every(n => n <= 0));
    /* B9: the people's breath and his walk come after the world is ready, and the map ends with every frame */
    let late = null; for (let i = 0; i < 160; i++) { late = await d.page.evaluate(() => ({ breath: CAST_BREATH.sent, steps: CAST_BREATH.steps, walk: PWALK.sent, last: PWALK.lastSteps, open: PWALK.open })); if (late.breath >= 6 && late.walk >= 1 && !late.open) break; await d.page.waitForTimeout(500); }
    /* he may be asked for more than once (a new ask restarts his walk); what reaches the map is always a whole eight */
    ok('*** B9 THE BREATH AND HIS WALK COME AFTER THE DOOR *** (the six people\'s breath ' + late.breath + ' of 6 in ' + late.steps + ' facings; his walk sent ' + late.walk + ' time(s), the last a whole ' + late.last + ' facings, none still baking ' + !late.open + ')', late.breath === 6 && late.steps === 48 && late.walk >= 1 && late.last === 8 && !late.open);
    await d.page.waitForTimeout(1200);
    demoFrames = await d.fr.evaluate(FRAMES);
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
    /* B10: the frames, against the workshop's one-piece bake */
    let af = null; for (let i = 0; i < 60; i++) { af = await a.fr.evaluate(FRAMES).catch(() => null); if (af && af.n === 280) break; await a.page.waitForTimeout(500); }
    ok('*** B10 THE MAP ENDS WITH THE SAME FRAMES AS THE ONE-PIECE BAKE *** (the demo ' + (demoFrames && demoFrames.n) + ' frames, hash ' + (demoFrames && demoFrames.h) + '; the workshop ' + (af && af.n) + ', ' + (af && af.h) + '; his run frames ' + (demoFrames && demoFrames.runs) + '/' + (af && af.runs) + ', none drawn anywhere)',
      !!demoFrames && !!af && demoFrames.n === 280 && demoFrames.h === af.h && demoFrames.runs === 0 && af.runs === 0);
    ok('B8 nothing threw on the alpha (' + a.errs.length + (a.errs.length ? ': ' + String(a.errs[0]).slice(0, 120) : '') + ')', a.errs.length === 0);
  } catch (e) { ok('B7 the alpha boots [' + String(e.message).slice(0, 160) + ']', false); }
  if (a) await a.close();
  done();
})();
