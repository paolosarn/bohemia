/* ==========================================================================
   THE MAP ANSWERS AFTER BEGIN  (RUN, 10/11/26, VAMILY [ten seconds to play], round three)

   PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
   MEASURED, the demo at the phone's profile (4x, served like Pages), the twenty seconds after BEGIN with no tap:
   93% frozen, the longest freeze 3.9 to 5.7 s. Four things, all under his first tap:
     - the phone's act faces looked themselves up among the street's people: nine blocks of the street built (3 s)
       to find nobody and answer 'either';
     - the morning's job offer found its people (how far the walk is) by building six street blocks in ONE task (3.9 s);
     - every sprite of the 26 MB street bank made a picture in ONE task (4.9 s);
     - the shell baking six more people and twelve people's walks, a whole person a task (2 s each).
     - and the map's page "finished loading" after its sprites, 12 s after BEGIN, and the shell took that as a boot:
       the save put back and his body sent again.
   NOW: the act faces answer without the street; the ring's street is built one block a task, the search run dry
   first so it builds exactly the blocks the ring would; the sprites are made in handfuls of 6 ms; the crowd bakes a
   facing a task, after his walk and the six's breath, and none of it (nor the breath, nor the ring's street) while
   his party is on the road; the late load sends nothing the map already asked for and got.

   LEGS, the demo at 4x served like Pages, the honest stopwatch (NEW GAME, BEGIN the moment it lights, one tap on
   open ground a second later):
     M1 *** HIS FIRST TAP MOVES THE PARTY *** the tap is taken and the party crosses its first block (the time from the
        link is printed: the row's own number)
     M2 *** NOTHING FREEZES OVER 2.5 s IN THE 20 s AFTER BEGIN *** (was 3.9 to 5.7 s)
     M3 *** THE CROWD WAITS WHILE HE IS ON THE ROAD *** no crowd, breath or ring-street step while the map says moving
     M4 the act faces never build the street (asking an act face's reading calls the street's people 0 times)
     M5 the morning still rings, once its street is built (the ring rang, the warm-up done)
     M6 the street sprites are all made: every family, hero and door clip, and nothing left in the queue
     M7 *** THE CROWD'S FRAMES ARE THE SAME AS THE WHOLE-PERSON BAKE *** (the six later people's stills and breath and
        all twelve walks, hashed person by person against the workshop, which bakes a whole person a task)
     M9 *** THE LATE LOAD IS NOT A SECOND BOOT *** the map's page finishes loading after its sprites, after his first
        trip: in the demo it no longer puts the save back (2.3 s frozen at 4x, and a save a beat behind moves him back)
        nor sends his body again (his walk baked twice)
     M8 nothing threw
   node gates/the_map_answers_after_begin_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE MAP ANSWERS AFTER BEGIN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SECS = 20, FREEZE_MAX = 2500;
/* the crowd's frames on the map: the people baked after the boot six (stills and breath) and every walk */
const CROWD = () => { const D8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], out = { looks: {}, walks: {}, n: 0 };
  const hash = cs => { let h = 2166136261 >>> 0; cs.forEach(c => { const a = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 0; i < a.length; i += 3) { h ^= a[i]; h = Math.imul(h, 16777619) >>> 0; } out.n++; }); return h; };
  for (let i = 6; i < (CAST_CV || []).length; i++) { const cs = []; for (const d of D8) { const s = CAST_CV[i][d]; if (!s) continue; cs.push(s.idle); (s.breathe || []).forEach(c => cs.push(c)); } out.looks[(CAST_ID || [])[i] || ('#' + i)] = hash(cs); }
  Object.keys(CAST_WALK || {}).forEach(id => { const cs = []; D8.forEach(d => (CAST_WALK[id][d] || []).forEach(c => cs.push(c))); out.walks[id] = hash(cs); });
  return out; };
/* person by person, by name: the workshop re-sends its first six after its first later person has landed, which
   wipes that one there (main does the same; noted for its owner), so a position is not a person */
const SAME = (a, b) => { const same = { looks: 0, walks: 0 }, diff = [];
  ['looks', 'walks'].forEach(k => Object.keys(a[k]).forEach(id => { if (!(id in b[k])) return; if (a[k][id] === b[k][id]) same[k]++; else diff.push(k + ':' + id); }));
  return { same, diff }; };
const bakesDone = () => !!(window.CROWD_HOLD && typeof CREST !== 'undefined' && CREST && CREST.done && typeof CWALK !== 'undefined' && CWALK && CWALK.done);

(async () => {
  let d, CDP = null; const R = {};
  const now = p => p.evaluate(() => performance.now());
  try {
    d = await drive.open({ throttle: 4, pages: true, keepCards: true, boot: 200000, door: 5000, settle: 200000, world: 1,
      beforeGoto: async (cdp, page) => { CDP = cdp;
        await page.addInitScript(() => { if (window !== window.top) return; window.__LT = [];
          try { new PerformanceObserver(l => l.getEntries().forEach(e => __LT.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); } catch (_e) {} }); },
      beforeTap: async (page) => {
        await T.throughTheTitle(page, 300000);
        let fr = null;
        while (!(fr = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()))) || !(await fr.evaluate(() => typeof city !== 'undefined' && !!window.__CITY && typeof TH !== 'undefined').catch(() => false))) await page.waitForTimeout(100);
        const fb = await (await fr.frameElement()).boundingBox();
        /* aimed before BEGIN lights, the way a finger is: three blocks east of the party, open ground */
        const tgt = await fr.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(city.x + 3, city.y);
          window.__X0 = { x: city.x, y: city.y };
          (function w() { const t = window.parent.performance.now();
            if (!window.__TOOK && typeof TRAVEL !== 'undefined' && TRAVEL && TRAVEL.path && TRAVEL.path.length) window.__TOOK = t;
            if (!window.__MOVED && (city.x !== __X0.x || city.y !== __X0.y)) window.__MOVED = t;
            if (!window.__MOVED) setTimeout(w, 16); })();
          /* M9: the save put back after BEGIN (the late load used to) */
          window.__AR = 0; const A = applyRestore; applyRestore = function () { if (window.parent.__PLAY_BEGAN) __AR++; return A.apply(this, arguments); };
          return { x: r.left + q.sx, y: r.top + q.sy + TH / 2 }; });
        const b = await page.evaluate(() => { for (const i of ['fronttap', 'front']) { const f = document.getElementById(i); if (f && getComputedStyle(f).display !== 'none') { const r = f.getBoundingClientRect(); if (r.width > 4) return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; } } return null; });
        while (!(await page.evaluate(() => !!window.__LOAD_READY))) await page.waitForTimeout(30);
        R.lit = await now(page);
        R.begin = await now(page); await page.touchscreen.tap(b.x, b.y);
        await page.waitForTimeout(1000);
        R.tap = await now(page); await page.touchscreen.tap(fb.x + tgt.x, fb.y + tgt.y);
        /* M3: what was still to bake when he set out (so the trip had something to hold back) */
        R.pending = await page.evaluate(() => ({ breath: CAST_BREATH.queue.length, crowd: !(CREST && CREST.done), walk: !(CWALK && CWALK.done) }));
        for (let i = 0; i < 600; i++) { if (await page.evaluate(() => !!(window.BOH_MAP_STATE && BOH_MAP_STATE.moving))) { R.sawMoving = true; break; } await page.waitForTimeout(50); }
        for (let i = 0; i < 900 && R.sawMoving; i++) { if (!(await page.evaluate(() => !!(window.BOH_MAP_STATE && BOH_MAP_STATE.moving)))) break; await page.waitForTimeout(50); }
      } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const page = d.page, fr = d.fr;
    const F = await fr.evaluate(() => ({ took: window.__TOOK, moved: window.__MOVED }));
    const sec = x => x ? (x / 1000).toFixed(1) + ' s' : 'never';
    ok('*** M1 HIS FIRST TAP MOVES THE PARTY *** (from the link: BEGIN lit ' + sec(R.lit) + ', tapped ' + sec(R.begin) + '; the map tapped ' + sec(R.tap) + ', the tap taken ' + sec(F.took) + ', HIS FIRST BLOCK CROSSED ' + sec(F.moved) + ', at 4x)', !!F.moved && F.moved > R.tap);
    const left = R.begin + SECS * 1000 - await now(page); if (left > 0) await page.waitForTimeout(left + 300);
    const LT = (await page.evaluate(() => window.__LT)).filter(x => x[0] >= R.begin && x[0] < R.begin + SECS * 1000);
    const mx = LT.reduce((m, x) => Math.max(m, x[1]), 0), busy = LT.reduce((m, x) => m + x[1], 0);
    ok('*** M2 NOTHING FREEZES OVER ' + (FREEZE_MAX / 1000) + ' s IN THE ' + SECS + ' s AFTER BEGIN *** (the longest ' + mx + ' ms, frozen ' + Math.round(busy / SECS / 10) + '% in all, ' + LT.filter(x => x[1] > 1000).length + ' over a second; was 3.9 to 5.7 s, 93%)', mx > 0 && mx <= FREEZE_MAX);
    const rr = await page.evaluate(() => window.ROAD_RECEIPT || null), ww = await fr.evaluate(() => window.WAKE_WARM || null);
    const pend = R.pending && (R.pending.breath > 0 || R.pending.crowd || R.pending.walk);
    ok('*** M3 THE CROWD WAITS WHILE HE IS ON THE ROAD *** (he set out with ' + (R.pending ? R.pending.breath + ' breath facings, the crowd ' + (R.pending.crowd ? 'still to bake' : 'done') + ', their walks ' + (R.pending.walk ? 'still to bake' : 'done') : '?') + '; the map said moving ' + !!R.sawMoving + '; steps run while moving: breath ' + (rr && rr.breath) + ', crowd ' + (rr && rr.crowd) + ', walks ' + (rr && rr.walk) + ', the ring\'s street ' + (ww && ww.onRoad) + ')',
      !!R.sawMoving && !!pend && !!rr && rr.breath === 0 && rr.crowd === 0 && rr.walk === 0 && !!ww && ww.onRoad === 0);
    /* the rest at full speed: the timing legs are done */
    try { await CDP.send('Emulation.setCPUThrottlingRate', { rate: 1 }); } catch (_e) {}
    const m4 = await fr.evaluate(() => { const P = pplPeople; let n = 0; pplPeople = function () { n++; return P.apply(this, arguments); };
      let r = []; try { FACE_ASKED = FACE_ASKED || {}; r = ['act1', 'act2~s0~he', 'act3~s0~she~p0~he'].map(k => ctFaceReads(k)); } finally { pplPeople = P; }
      return { n, r }; });
    ok('M4 the act faces never build the street (reading three act faces called the street\'s people ' + m4.n + ' times; they read ' + m4.r.join('/') + ')', m4.n === 0 && m4.r.every(x => x === 'either'));
    let ring = null; for (let i = 0; i < 120; i++) { ring = await fr.evaluate(() => ({ rang: window.__OFFER_RANG || 0, warm: window.WAKE_WARM || null })); if (ring.rang && ring.warm && ring.warm.done) break; await page.waitForTimeout(500); }
    ok('M5 the morning still rings, once its street is built (rang ' + ring.rang + '; the ring\'s street ' + (ring.warm && ring.warm.built) + ' blocks, a block a task, done ' + (ring.warm && ring.warm.done) + ')', ring.rang >= 1 && !!ring.warm && ring.warm.done);
    let spr = null; for (let i = 0; i < 120; i++) { spr = await fr.evaluate(() => { const p = window.__TILES_PUMP ? __TILES_PUMP() : null;
        const fam = Object.keys(TP_TILES).filter(k => TP_IMG[k] && TP_IMG[k].length === TP_TILES[k].length && TP_IMG[k].every(Boolean)).length;
        return { p, fam, fams: Object.keys(TP_TILES).length, hero: Object.keys(HERO_SRC).filter(k => HERO_IMG[k]).length, heroes: Object.keys(HERO_SRC).length, door: DOOR_ANIM_IMG.length, doors: DOOR_ANIM.length }; });
      if (spr.p && !spr.p.queued && spr.fam === spr.fams) break; await page.waitForTimeout(500); }
    ok('M6 the street sprites are all made (families ' + spr.fam + '/' + spr.fams + ', heroes ' + spr.hero + '/' + spr.heroes + ', door clips ' + spr.door + '/' + spr.doors + ', left in the queue ' + (spr.p && spr.p.left) + ')', !!spr.p && !spr.p.queued && spr.p.left === 0 && spr.fam === spr.fams && spr.fams > 0 && spr.hero === spr.heroes && spr.door === spr.doors);
    for (let i = 0; i < 240; i++) { if (await page.evaluate(bakesDone)) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(800);
    R.demo = await fr.evaluate(CROWD);
    const late = await fr.evaluate(() => ({ ar: window.__AR, loaded: document.readyState, tiles: !!(window.__TILES_LATE && __TILES_LATE.called) }));
    const pw = await page.evaluate(() => ({ gen: PWALK.gen, sent: PWALK.sent }));
    ok('*** M9 THE LATE LOAD IS NOT A SECOND BOOT *** (the map\'s page finished loading: ' + late.loaded + ', its sprites in ' + late.tiles + '; the save put back after BEGIN ' + late.ar + ' times; his body baked ' + pw.gen + ' time(s), sent ' + pw.sent + ')', late.loaded === 'complete' && late.tiles && late.ar === 0 && pw.gen === 1 && pw.sent === 1);
    ok('M8a nothing threw on the demo (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* M7: the workshop bakes a whole person a task; the crowd's frames must be the same */
  let a;
  try {
    a = await drive.open({ alpha: true, keepCards: true });
    for (let i = 0; i < 240; i++) { if (await a.page.evaluate(bakesDone)) break; await a.page.waitForTimeout(500); }
    await a.page.waitForTimeout(800);
    const af = await a.fr.evaluate(CROWD), cmp = R.demo ? SAME(R.demo, af) : { same: { looks: 0, walks: 0 }, diff: ['no demo'] };
    const dl = R.demo ? Object.keys(R.demo.looks).length : 0, dw = R.demo ? Object.keys(R.demo.walks).length : 0;
    ok('*** M7 THE CROWD\'S FRAMES ARE THE SAME AS THE WHOLE-PERSON BAKE *** (the demo: ' + dl + ' later people and ' + dw + ' walks, ' + (R.demo && R.demo.n) + ' frames; against the workshop, person by person: ' + cmp.same.looks + ' people and ' + cmp.same.walks + ' walks the same, ' + cmp.diff.length + ' different' + (cmp.diff.length ? ' (' + cmp.diff.slice(0, 4).join(', ') + ')' : '') + ')',
      dl === 6 && dw === 12 && cmp.diff.length === 0 && cmp.same.walks === 12 && cmp.same.looks >= 3);
    ok('M8 nothing threw on the alpha (' + a.errs.length + (a.errs.length ? ': ' + String(a.errs[0]).slice(0, 120) : '') + ')', a.errs.length === 0);
  } catch (e) { ok('M7 the alpha boots [' + String(e.message).slice(0, 160) + ']', false); }
  if (a) await a.close();
  done();
})();
