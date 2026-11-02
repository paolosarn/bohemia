/* HOLD PLAY, SLIDE THE SPEED -- the probe (WORLD 5, 11/2/26, rule 311, ask 304)
   On the demo, an upright phone (390 x 844), real touches through CDP (a held finger that slides is not a tap):
     1. the clock's numbers came from engine/bohemia_travel_speeds.json, and the default is ours
     2. a short tap on PLAY still plays and pauses
     3. HOLD: the slider comes up under the thumb on PLAY; SLIDE up one notch; LET GO: the speed is his, saved, the clock
        not started by the hold; the saved pick is what the next boot reads
     4. each step 1x 2x 4x on a real journey: blocks a second, game minutes a block, every block's time against the
        map's own beat (the metronome) -- on the beat or on an even split of it
     5. the crossings: the valley's longest town-to-town route and the median trip from where he starts, timed at each step
        (from the measured blocks a second)
     6. a road happening at 4x (the meet's own door, on an extra block) drops it to regular time; PLAY goes on at 1x on the beat
   8x was built and measured here and left out of the steps (it cannot hold the beat even with the drawing off; see the record).
   Pictures: records/target/world_slide_the_speed/.
   node tools/bohemia_world_slide_the_speed_probe.js   (writes records/target/world_slide_the_speed/probe.json) */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/world_slide_the_speed');
fs.mkdirSync(OUT, { recursive: true });
const R = { checks: [] };
const ok = (name, cond, info) => { R.checks.push({ name, ok: !!cond, info: info == null ? '' : info }); console.log((cond ? '  ok   ' : '  FAIL ') + name + (info != null ? '  (' + (typeof info === 'string' ? info : JSON.stringify(info)) + ')' : '')); };

(async () => {
  const d = await open({ profile: 'phone_portrait', door: 120000, engage: true });
  const p = d.page, fr = d.fr;
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await p.waitForTimeout(100); } return false; };
  const tapIn = async (sel) => { const h = await p.$(sel); if (!h) return false; const b = await h.boundingBox(); if (!b) return false; await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  const cdp = await p.context().newCDPSession(p);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 8, radiusY: 8, force: 1 }] });
  const phoneShot = async (name) => { const b = await p.evaluate(() => { const r = document.getElementById('bohphone').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await p.screenshot({ path: path.join(OUT, name), clip: { x: Math.max(0, b.x - 6), y: Math.max(0, b.y - 6), width: Math.min(390 - Math.max(0, b.x - 6), b.w + 12), height: b.h + 12 } }); };
  try {
    /* leave the first town the way a player does (rule 236: the game opens in the closest town) */
    if (await until(() => fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)), 20000)) {
      await until(() => p.evaluate(() => { const e = document.getElementById('bohphone'); return !!e && e.classList.contains('on') && e.dataset.screen === 'town'; }), 8000);
      await p.waitForTimeout(800); await tapIn('#bohphone .bpctx .lv');
      await until(() => fr.evaluate(() => !LOOP.open), 8000); await p.waitForTimeout(600);
    }
    await until(() => p.evaluate(() => { const e = document.getElementById('bohphone'); return !!e && e.classList.contains('on') && e.dataset.screen === 'map'; }), 30000);
    await p.waitForTimeout(1200);

    /* 1. the numbers */
    const C = await fr.evaluate(() => ({ clock: JSON.parse(JSON.stringify(TRAVEL_CLOCK)), speeds: TRAVEL_SPEEDS.slice(), speed: TRAVEL_SPEED, last: TRAVEL_SPEED_LAST, saved: localStorage.getItem(TRAVEL_CLOCK.saveKey) }));
    const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/bohemia_travel_speeds.json'), 'utf8'));
    R.clock = C;
    ok('1 the clock read engine/bohemia_travel_speeds.json (steps ' + C.clock.steps.join(' ') + ', default ' + C.clock.pick + 'x)', C.clock.from === 'file' && C.clock.steps.join() === FILE.steps.join() && C.clock.pick === FILE.pick, C.clock.from);
    ok('  the map stands on our default with nothing saved', C.saved === null && C.last === FILE.pick, 'last ' + C.last + ', speed ' + C.speed);

    /* 2. a short tap still plays and pauses: set a journey, tap, tap */
    const far = await fr.evaluate(() => { const bs = ctBases(); let best = null, bd = -1; for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd > bd) { bd = dd; best = [b.x | 0, b.y | 0, n]; } } return best; });
    /* every journey aims at the town farthest from where he stands NOW (an earlier one may have brought him close), and a town
       that opened on the way is left first; each window ends with travelStop so he never arrives inside the probe */
    const go = async () => {
      if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'))) { await fr.evaluate(() => { try { BohemiaPhone.P.leave(); } catch (e) {} }); await p.waitForTimeout(1500); }
      return fr.evaluate(() => { try { travelStop(); } catch (e) {} const bs = ctBases(); let f = null, bd = -1;
        for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd > bd) { bd = dd; f = [b.x | 0, b.y | 0]; } }
        const r = travelTo(0, 0, f); return { r: !!r, trav: !!TRAVEL, len: TRAVEL ? TRAVEL.path.length : 0 }; }); };
    let g = await go();
    const play = async () => { const b = await p.evaluate(() => { const r = document.querySelector('#bohphone .app[data-app=play]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); return b; };
    const P0 = await play();
    const s0 = await fr.evaluate(() => TRAVEL_SPEED);
    await p.touchscreen.tap(P0.x, P0.y); await p.waitForTimeout(300);
    const s1 = await fr.evaluate(() => TRAVEL_SPEED);
    await p.touchscreen.tap(P0.x, P0.y); await p.waitForTimeout(300);
    const s2 = await fr.evaluate(() => TRAVEL_SPEED);
    ok('2 a short tap on PLAY still pauses and plays (no slider)', g.trav && s0 > 0 && s1 === 0 && s2 === s0 && !(await p.evaluate(() => !!document.querySelector('#bohphone .spdsl.on'))), s0 + ' -> ' + s1 + ' -> ' + s2);

    /* 3. HOLD, SLIDE, LET GO -- paused first, so the hold must not start the clock */
    await fr.evaluate(() => travelSpeedSet(0));
    await touch('touchStart', P0.x, P0.y); await p.waitForTimeout(250);
    const early = await p.evaluate(() => !!document.querySelector('#bohphone .spdsl.on'));
    await p.waitForTimeout(350);
    const open1 = await p.evaluate(() => { const s = document.querySelector('#bohphone .spdsl'), r = s && s.getBoundingClientRect(), pl = document.querySelector('#bohphone .app[data-app=play]').getBoundingClientRect();
      return { on: !!s && s.classList.contains('on'), slide: window.__PHONE_SLIDE, now: s && s.getAttribute('aria-valuenow'), r: r && { x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom }, play: { x: pl.x, y: pl.y, w: pl.width } }; });
    await p.waitForTimeout(260); await phoneShot('1_held_the_slider_up_on_2x.png');
    ok('3 HOLD: nothing before the hold time (a tap stays a tap)', !early);
    ok('  the slider comes up over PLAY\'s own column, under the thumb, on the speed he has (2x)', open1.on && open1.now === '2' && open1.r.bottom <= open1.play.y + 2 && open1.r.x <= open1.play.x + 2,
      'notch ' + (open1.slide && open1.slide.notchPx) + ' px; slider ' + JSON.stringify(open1.r));
    const np = open1.slide.notchPx;
    for (let k = 1; k <= 8; k++) { await touch('touchMove', P0.x, P0.y - k * np / 8); await p.waitForTimeout(30); }
    await p.waitForTimeout(260);
    const mid = await p.evaluate(() => document.querySelector('#bohphone .spdsl').getAttribute('aria-valuenow'));
    await phoneShot('2_slid_up_one_notch_4x.png');
    ok('  SLIDE: one notch up is 4x, the top', mid === '4', mid);
    await touch('touchEnd'); await p.waitForTimeout(500);
    const after = await fr.evaluate(() => ({ speed: TRAVEL_SPEED, last: TRAVEL_SPEED_LAST, saved: localStorage.getItem(TRAVEL_CLOCK.saveKey), slid: window.__PHONE_SLID }));
    const afterPh = await p.evaluate(() => ({ open: !!document.querySelector('#bohphone .spdsl.on'), mark: document.querySelector('#bohphone .app[data-app=play] .mark').textContent }));
    await phoneShot('3_let_go_play_marked_4x.png');
    ok('  LET GO: 4x is his, saved; the slider goes; the mark on PLAY says 4x', after.last === 4 && after.saved === '4' && !afterPh.open && afterPh.mark === '4x', JSON.stringify(after.slid) + ' mark ' + afterPh.mark);
    ok('  and the hold did not start the clock (still paused)', after.speed === 0, after.speed);
    await p.touchscreen.tap(P0.x, P0.y); await p.waitForTimeout(300);
    ok('  then a tap on PLAY goes at 4x', (await fr.evaluate(() => TRAVEL_SPEED)) === 4);
    const boot = await fr.evaluate(() => { const keep = [TRAVEL_SPEED_LAST, window.__TRAVEL_PICK, window.__TRAVEL_INTERRUPT]; TRAVEL_SPEED_LAST = 1; delete window.__TRAVEL_PICK; delete window.__TRAVEL_INTERRUPT;
      travelClockBoot(); const got = TRAVEL_SPEED_LAST; window.__TRAVEL_PICK = keep[1]; return got; });
    ok('  a fresh boot reads his saved 4x back (remembered)', boot === 4, boot);

    /* 4 and 5. each step on a real journey, every block against the beat */
    const routes = await fr.evaluate(() => { const bs = ctBases(), L = []; for (const n in bs) L.push([n, bs[n].x | 0, bs[n].y | 0]);
      const snap = (x, y) => { if (cityWalkable(x, y)) return [x, y]; for (let r = 1; r <= 2; r++) for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (Math.max(Math.abs(a), Math.abs(b)) === r && cityWalkable(x + a, y + b)) return [x + a, y + b]; return null; };
      const len = (a, b) => { const p0 = snap(a[1], a[2]), p1 = snap(b[1], b[2]); if (!p0 || !p1) return null; const r = cityRoute(p0[0], p0[1], p1[0], p1[1]); if (!r) return null; let m = 0; for (let i = 1; i < r.length; i++) m += cityStepMins(r[i][0], r[i][1]); return { blocks: r.length - 1, mins: Math.round(m) }; };
      let long = null; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const q = len(L[i], L[j]); if (q && (!long || q.blocks > long.blocks)) long = Object.assign({ from: L[i][0], to: L[j][0] }, q); }
      const here = ['here', city.x, city.y], trips = L.map(t => Object.assign({ to: t[0] }, len(here, t) || {})).filter(t => t.blocks > 1).sort((a, b) => a.blocks - b.blocks);
      return { towns: L.length, long, median: trips[trips.length >> 1], nearest: trips[0], trips: trips.length }; });
    R.routes = routes;
    /* a block's time is when its step STARTS (stepOnce), the moment the clock hands it out; what the step costs after is the machine */
    await fr.evaluate(() => { window.__STEPS = []; const f = stepOnce; window.__STEP_WRAPPED = true;
      stepOnce = function (dd) { const t = performance.now(); const r = f.apply(this, arguments); try { if (TRAVEL || r) window.__STEPS.push({ t, b: window.__MAP_BEAT_AT, sp: TRAVEL_SPEED, cost: performance.now() - t }); } catch (e) {} return r; }; });
    R.steps = {};
    for (const n of [1, 2, 4]) {
      let m = null;
      for (let tries = 0; tries < 6 && !m; tries++) {
        g = await go(); if (!g.trav) continue;
        await fr.evaluate((n) => { travelSpeedSet(n); }, n);
        await p.waitForTimeout(700);
        const a = await fr.evaluate(() => { window.__STEPS = []; TRAVEL_LATE.length = 0; return { i: TRAVEL ? TRAVEL.i : -1, t: T.day * 1440 + T.min, it: window.__TRAVEL_INTERRUPT ? window.__TRAVEL_INTERRUPT.at : 0, at: performance.now() }; });
        await p.waitForTimeout(n >= 4 ? 2500 : 4000);   /* a fast march meets a party sooner: a shorter window, still five beats or more */
        const b = await fr.evaluate(() => ({ i: TRAVEL ? TRAVEL.i : -1, t: T.day * 1440 + T.min, it: window.__TRAVEL_INTERRUPT ? window.__TRAVEL_INTERRUPT.at : 0, at: performance.now(), steps: window.__STEPS.slice(), late: TRAVEL_LATE.slice(), street: typeof streetIsOn === 'function' && streetIsOn() }));
        await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        if (b.it !== a.it || b.i < 0) { const w = await fr.evaluate(() => window.__TRAVEL_INTERRUPT && window.__TRAVEL_INTERRUPT.why); console.log('    ' + n + 'x: a road happening (' + w + ') cut the window, again'); continue; }
        /* THE BEAT, from the engine's own ledger (TRAVEL_LATE): each split block against its slot k/N of its beat, and each beat
           against the beat before (the metronome's own drift, the same at every speed if the machine keeps up) */
        const beats = new Set(b.steps.map(s => s.b)).size;
        const q = (arr, f) => { const v = arr.slice().sort((u, w) => u - w); return v.length ? +v[Math.min(v.length - 1, Math.floor(v.length * f))].toFixed(1) : 0; };
        const split = b.late.filter(x => x[0] === n && x[1] > 0).map(x => x[2]), drift = b.late.filter(x => x[0] === n && x[1] === 0).map(x => Math.abs(x[2]));
        const costs = b.steps.map(s => s.cost).sort((u, v) => u - v), perBeat = {}; b.steps.forEach(s => { perBeat[s.b] = (perBeat[s.b] || 0) + 1; });
        m = { stepCostMedMs: +(costs[costs.length >> 1] || 0).toFixed(1), stepCostP90Ms: +(costs[Math.floor(costs.length * 0.9)] || 0).toFixed(1), perBeat: Object.values(perBeat).join(','), beats, blocksABeat: +(b.steps.length / Math.max(1, beats)).toFixed(2), blocks: b.i - a.i, secs: (b.at - a.at) / 1000, minutes: b.t - a.t, steps: b.steps.length, splitLateMedMs: q(split, .5), splitLateP90Ms: q(split, .9), splitN: split.length, beatDriftMedMs: q(drift, .5), beatDriftP90Ms: q(drift, .9), beatsN: drift.length, street: b.street };
        m.blocksPerSec = +(m.blocks / m.secs).toFixed(2); m.minPerBlock = m.blocks ? +(m.minutes / m.blocks).toFixed(1) : null;
      }
      R.steps[n] = m || { refused: 'three journeys cut by road happenings' };
      console.log('    ' + n + 'x ' + JSON.stringify(R.steps[n]));
    }
    const S = R.steps, got = k => S[k] && !S[k].refused;
    ok('4 every step travels and goes faster than the one below it', [1, 2, 4].every(got) && S[2].blocksPerSec > S[1].blocksPerSec && S[4].blocksPerSec > S[2].blocksPerSec, [1, 2, 4].map(k => got(k) ? S[k].blocksPerSec + '/s' : 'x').join(' '));
    ok('  1x is one block a beat (2 a second, within one beat of the window)', got(1) && Math.abs(S[1].blocksPerSec - 2) <= 0.3, got(1) && S[1].blocksPerSec);
    ok('  2x lands its full blocks (within one beat of the window)', got(2) && Math.abs(S[2].blocksPerSec - 4) <= 0.6, got(2) && S[2].blocksPerSec);
    console.log('    REPORTED, NOT ASSERTED (bound by what one map step costs on the machine running this): 4x ' + (got(4) && S[4].blocksABeat) + ' blocks a beat of 4; a step costs ' + [1, 2, 4].map(k => got(k) && S[k].stepCostMedMs).join('/') + ' ms');
    { const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_REGION_LAND.json'), 'utf8')).speeds, costs = Object.values(L).map(v => v.minutesPerCell), lo = Math.min(...costs), hi = Math.max(...costs);
      ok('  every block pays its own clock (game minutes a block inside the map\'s own cheapest to dearest block, ' + lo + ' to ' + hi + ', at every step)', [1, 2, 4].every(k => got(k) && S[k].minPerBlock >= lo * 0.9 && S[k].minPerBlock <= hi * 1.1), [1, 2, 4].map(k => got(k) && S[k].minPerBlock).join(' ')); }
    { const keeps = got(1) && S[1].beatDriftMedMs < 20, line = [1, 2, 4].map(k => got(k) && (k + 'x split late ' + S[k].splitLateMedMs + '/' + S[k].splitLateP90Ms + ' ms, beat drift ' + S[k].beatDriftMedMs + '/' + S[k].beatDriftP90Ms)).join('; ');
      if (keeps) ok('  THE BEAT, DRAWING ON: at 2x every split block starts on its slot (median under 20 ms late)', got(2) && S[2].splitLateMedMs < 20, line);
      else console.log('    THE BEAT, DRAWING ON: REPORTED, NOT ASSERTED (this machine\'s own beat drifts ' + (got(1) && S[1].beatDriftMedMs) + ' ms at 1x, it does not keep up): ' + line); }
    /* THE SCHEDULE ALONE: the same journeys with the canvas's drawing taken out for the window (drawImage and fill:
       measured as over half of this machine's main thread, software raster with no graphics chip). What is left is the
       clock: do the blocks start on their slots when the machine keeps up? Restored after. */
    const NODRAW = () => { const C = CanvasRenderingContext2D.prototype; window.__KEEP_DRAW = { d: C.drawImage, f: C.fill, g: C.getImageData };
      C.drawImage = function () {}; C.fill = function () {};   /* getImageData stays real: a stand-in that allocates a buffer per call cost ~100 ms a beat itself */
      window.__KEEP_DRAW.raf = window.requestAnimationFrame; window.requestAnimationFrame = function () { return 0; }; };   /* and no frame loop: the clock and the steps only */
    const DRAW = () => { const C = CanvasRenderingContext2D.prototype, K = window.__KEEP_DRAW; if (K) { C.drawImage = K.d; C.fill = K.f; window.requestAnimationFrame = K.raf; } };
    R.schedule = {};
    for (const n of [2, 4]) {
      let m = null;
      for (let tries = 0; tries < 6 && !m; tries++) {
        g = await go(); if (!g.trav) continue;
        await fr.evaluate(NODRAW); await fr.evaluate((n) => { travelSpeedSet(n); }, n); await p.waitForTimeout(600);
        const a = await fr.evaluate(() => { TRAVEL_LATE.length = 0; window.__STEPS = []; return { i: TRAVEL ? TRAVEL.i : -1, it: window.__TRAVEL_INTERRUPT ? window.__TRAVEL_INTERRUPT.at : 0, at: performance.now() }; });
        await p.waitForTimeout(2500);
        const b = await fr.evaluate(() => ({ i: TRAVEL ? TRAVEL.i : -1, it: window.__TRAVEL_INTERRUPT ? window.__TRAVEL_INTERRUPT.at : 0, at: performance.now(), late: TRAVEL_LATE.slice(), steps: window.__STEPS.slice() }));
        await fr.evaluate(() => { try { travelStop(); } catch (e) {} }); await fr.evaluate(DRAW);
        if (b.it !== a.it || b.i < 0) continue;
        const q = (arr, f) => { const v = arr.slice().sort((u, w) => u - w); return v.length ? +v[Math.min(v.length - 1, Math.floor(v.length * f))].toFixed(1) : 0; };
        const split = b.late.filter(x => x[0] === n && x[1] > 0).map(x => x[2]), drift = b.late.filter(x => x[0] === n && x[1] === 0).map(x => Math.abs(x[2]));
        const beats = Math.max(1, drift.length);
        m = { blocksPerSec: +((b.i - a.i) / ((b.at - a.at) / 1000)).toFixed(2), splitLateMedMs: q(split, .5), splitLateP90Ms: q(split, .9), splitN: split.length, beatDriftMedMs: q(drift, .5), beatDriftP90Ms: q(drift, .9), stepCostMedMs: q(b.steps.map(x => x.cost), .5) };
      }
      R.schedule[n] = m || { refused: 'cut by road happenings' };
      console.log('    schedule alone ' + n + 'x ' + JSON.stringify(R.schedule[n]));
    }
    const SA = R.schedule, sg = k => SA[k] && !SA[k].refused;
    ok('  THE BEAT, THE SCHEDULE ALONE (the drawing and the frame loop out): at 2x and 4x every split block starts within 15 ms of its slot (median), and the blocks are all there',
      [2, 4].every(k => sg(k) && SA[k].splitLateMedMs < 15 && SA[k].blocksPerSec >= 2 * k * 0.85), [2, 4].map(k => sg(k) && (k + 'x ' + SA[k].blocksPerSec + '/s, late ' + SA[k].splitLateMedMs + '/' + SA[k].splitLateP90Ms + ' ms')).join('; '));
    R.crossing = {};
    if (routes.long && routes.median) for (const k of [1, 2, 4]) if (got(k)) R.crossing[k] = { longSec: +(routes.long.blocks / S[k].blocksPerSec).toFixed(1), longSecOnPaper: +(routes.long.blocks / (2 * k)).toFixed(1), medianSec: +(routes.median.blocks / S[k].blocksPerSec).toFixed(1), nearestSec: +(routes.nearest.blocks / S[k].blocksPerSec).toFixed(1) };
    console.log('    crossings ' + JSON.stringify(R.crossing) + '  routes ' + JSON.stringify(routes));

    /* 6. a road happening at 4x drops to regular time, on the block that met it */
    g = await go(); await fr.evaluate(NODRAW); await fr.evaluate(() => travelPick(4)); await p.waitForTimeout(800);
    await fr.evaluate(() => { window.__DROP_DONE = false; let k = 0; const f = travelStepped;
      travelStepped = function (m) { const r = f.apply(this, arguments); if (!window.__DROP_DONE && ++k === 6) { window.__DROP_DONE = true; travelStop(); travelInterrupt('meet'); } return r; }; });
    await until(() => fr.evaluate(() => window.__DROP_DONE), 5000);
    const dr = await fr.evaluate(() => ({ it: window.__TRAVEL_INTERRUPT, speed: TRAVEL_SPEED, last: TRAVEL_SPEED_LAST, saved: localStorage.getItem(TRAVEL_CLOCK.saveKey), at: [city.x, city.y] }));
    await p.waitForTimeout(500);
    const still = await fr.evaluate(() => [city.x, city.y]); await fr.evaluate(DRAW);
    const mark1 = await p.evaluate(() => document.querySelector('#bohphone .app[data-app=play] .mark').textContent);
    const ph = dr.it.beatPhaseMs, sl = dr.it.slot, onSplit = !!sl && /^[0-3]\/4$/.test(sl), lateMs = onSplit && ph != null ? Math.round(ph - (+sl.split('/')[0]) * 125) : null;
    ok('6 a party met at 4x holds the map and drops it to regular time; his saved pick stays 4x', dr.speed === 0 && dr.it.dropped && dr.last === 1 && dr.saved === '4' && mark1 === '1x', JSON.stringify({ from: dr.it.from, resume: dr.last, mark: mark1 }));
    ok('  on its beat: the drop fell on the block that met it, slot ' + sl + ' of its beat (4x splits a beat in four), and no block of that beat moved after it', onSplit && still.join() === dr.at.join(), 'slot ' + sl + ', ' + ph + ' ms into the beat (' + lateMs + ' ms after its slot: the machine); ' + dr.at + ' -> ' + still);
    g = await go(); await p.waitForTimeout(200);
    await fr.evaluate(() => { window.__STEPS = []; });
    await p.waitForTimeout(3000);
    const af = await fr.evaluate(() => ({ speed: TRAVEL_SPEED, steps: window.__STEPS.slice() }));
    const e1 = af.steps.filter(s => s.b).map(s => { const x = (s.t - s.b) % 500; return Math.min(x, 500 - x); });
    ok('  the march after it goes at 1x, every block on the beat', af.speed === 1 && af.steps.length >= 4 && af.steps.length <= 8 && e1.every(e => e < 15), af.speed + 'x, ' + af.steps.length + ' blocks in 3 s, off ' + e1.map(e => e.toFixed(0)).join(','));
    await phoneShot('4_after_a_meet_back_to_1x.png');
    /* the music: nothing outside the map, the phone and the jobs reads the speed (static), so it cannot speed up or bend */
    const readers = ['slices/BOHEMIA_ALPHA_0_9.html'].concat(fs.readdirSync(path.join(ROOT, 'engine')).filter(f => /\.js$/.test(f)).map(f => 'engine/' + f))
      .filter(f => /TRAVEL_SPEED|travelPick|TRAVEL_CLOCK/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    ok('  THE MUSIC: no music or sound code reads the travel speed (it never speeds up or changes pitch)', readers.length === 0, readers.join(' ') || 'no reader');
    ok('no page error', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the probe ran to the end', false, String(e && e.stack || e).slice(0, 300)); }
  finally { R.errs = errs; fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1)); await d.close(); }
  const f = R.checks.filter(c => !c.ok).length;
  console.log('\nHOLD PLAY, SLIDE THE SPEED: ' + (R.checks.length - f) + ' ok, ' + f + ' failed');
  process.exit(f ? 1 : 0);
})();
