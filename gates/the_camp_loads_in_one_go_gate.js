#!/usr/bin/env node
/* ============================================================================
   THE CAMP LOADS IN ONE GO (PLUMBER 8, 11/22/26; VAMILY rule 472(e), rule 441).
   PAOLO 11/22: 'we made camp, it loads, it takes 30 seconds, I don't know why it freezes when it loads... it's just like the combat
   map, it freezes for like 10 seconds and then everything's populated in'.
   MEASURED BEFORE (the demo upright, the CPU slowed 4x, the GPU canvas a phone has, MAKE CAMP from the map with the phone's HEAL, a CPU
   profile; records/BOHEMIA_PLUMBER_THE_CAMP_LOADS_IN_ONE_GO_11_22_26.md): the camp's picture in 18.5 s after the tap (17.3 s the second
   time), the page held 10 to 11 s in tasks over 50 ms, the longest 2.4 s: the two board pictures written as WebP files in one task
   (2.3 s) and read back; the camp's hours running from the tap (nightfall's reckoning 2.2 s, every job's danger planned again for the
   new day 1.8 to 4.8 s); every man's sheet read back off the GPU for his dusk (0.8 s); the board dealt twice, once a light; the fight
   page's thirteen data files asked one after another.
   NOW (each with its switch, the plant below sets them all): __THE_CAMP_PICTURE_IS_HANDED_NOT_WRITTEN__ (__CAMP_PLATE_ENCODE),
   __THE_CLOCK_WAITS_FOR_THE_CAMP_TO_LOAD__ (__CAMP_CLOCK_DURING_LOAD), __THE_DUSK_IS_WORKED_OUT_ON_THE_CPU__ (__DUSK_ON_THE_GPU),
   __THE_OTHER_LIGHT_IS_THE_SAME_BOARD__ (__CAMP_DEAL_TWICE), __THE_DATA_COMES_IN_ONE_ROUND_TRIP__ (__FIGHT_LOAD_SERIAL).
   On the demo upright, CPU 4x, the GPU canvas, a cold camp (the first since the page opened), the map's HEAL pressed by a finger:
     L1 THE CAMP'S PICTURE IS IN QUICKLY: its board baked and its picture on the screen under SECS_MAX from the tap (measured 5.5 s;
        the old ways 12.8 s on this valley with no network delay, 16.6 to 24.3 s with a phone's)
     L2 NOTHING HOLDS THE PAGE LONG: the longest task of the load under TASK_MAX ms and all of them over 50 ms under HELD_MAX ms
        (measured 581 ms and 2.3 s; the old ways 883 ms and 5.3 s; rule 441's half second is the goal: named in the record)
     L3 NO HOUR RUNS BEFORE THE CAMP IS UP: the camp's hours are 0 the moment its picture is in
     L4 THE OTHER LIGHT IS THE SAME BOARD: the night (or the day) is handed the board the first light dealt, the same board both lights
     L5 THE PICTURE IS HANDED: the camp's screen draws the board's own canvas (camp-board:), never a file written and read back
     P1 PLANTED: the six old ways at once turn L3 red (the hours gone before the camp shows) and L1 or L2 (slow or held)
   The game a stranger plays (fog: true), one valley named (PTBTDN: the camp on THE DECK), never the checkers' bench.
   node gates/the_camp_loads_in_one_go_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SECS_MAX = 9, TASK_MAX = 1000, HELD_MAX = 4000;   /* the ratchet: may only come down (measured on PTBTDN: now 5.5 s, 581 ms, 2.3 s; the old ways 12.8 s, 883 ms, 5.3 s) */
const OLD = 'window.__CAMP_PLATE_ENCODE = true; window.__CAMP_CLOCK_DURING_LOAD = true; window.__DUSK_ON_THE_GPU = true; window.__CAMP_DEAL_TWICE = true; window.__FIGHT_LOAD_SERIAL = true; window.__SHEET_RENDER_EACH = true;';
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x != null ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(200); } return null; }

async function camp(old) {
  /* the game a stranger plays (the fog, a new valley), never the checkers' bench (the whole valley lit: measured, there every draw of the map
     costs a second and the load reads 26 s): and one valley named, so every run makes camp on the same board (BOHEMIA_CAMP_SEED overrides) */
  const SEED = process.env.BOHEMIA_CAMP_SEED || 'PTBTDN';
  const d = await D.open({ profile: 'phone_portrait', pages: true, throttle: 4, gpu: true, door: 180000, engage: true, fog: true,
    arm: "try { localStorage.setItem('bohemia.world.next.v1', '" + SEED + "'); } catch (e) {} " + (old ? OLD : '') });
  const p = d.page, fr = d.fr, M = (fn, a) => p.evaluate(fn, a), out = { old };
  try {
    await waitFor(() => fr.evaluate(() => typeof MODE !== 'undefined' && !!window.BohemiaMapCamp), 60000); await sleep(3000);
    const btn = (sel) => M((sel) => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
    for (let i = 0; i < 3; i++) { if (!(await fr.evaluate(() => !!(LOOP.open && LOOP.frame && LOOP.frame.style.display === 'block')))) break;
      const b = await btn('#bohphone.on .lv, #bohphone.on .app[data-app=leave]'); if (b) await p.touchscreen.tap(b[0], b[1]); else await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(2500); }
    await fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { if (window.MEET && MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (_e) {}
      try { if (typeof townSafeAt === 'function' && townSafeAt(city.x, city.y)) { const N = om.n; for (let r = 3; r < 14; r++) for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) { const x = city.x + dx, y = city.y + dy; if (x > 1 && y > 1 && x < N - 2 && y < N - 2 && cityWalkable(x, y) && !townSafeAt(x, y) && !loopTownAt(x, y, 2)) { city.x = x; city.y = y; render(); return; } } } } catch (e) {} });
    await sleep(4000);
    await M(() => { try { BohemiaFrameMeter.start(); } catch (e) {} });
    const heal = await btn('#bohphone.on .app[data-app=heal]'); if (!heal) { out.err = 'no HEAL on the phone'; return out; }
    const PROF = process.env.BOHEMIA_CAMP_PROF && !old; if (PROF) { await d.cdp.send('Profiler.enable'); await d.cdp.send('Profiler.setSamplingInterval', { interval: 1000 }); await d.cdp.send('Profiler.start'); }
    const t0 = Date.now(), pt0 = await M(() => performance.now());
    await p.touchscreen.tap(heal[0], heal[1]);
    for (let i = 0; i < 240; i++) {
      const s = await fr.evaluate(() => { const f = LOOP.frame, w = f && f.contentWindow, CB = w && w.BohemiaCampBoard, st = CB ? CB.state() : null, BS = w && w.BohemiaSettlement;
        let src = null; try { src = BS && BS.camp2 ? BS.camp2().src : null; } catch (e) {}
        return { cb: st ? st.state : null, plates: st ? st.plates.filter(q => q.ready).length : 0, same: st ? st.sameBoth : null, hours: CAMP.hours, src: src ? String(src).slice(0, 40) : null, err: st ? st.err : null, board: st && st.board ? st.board.name : null, code: typeof WORLD_SEED !== 'undefined' ? WORLD_SEED : null, ready: !!LOOP.ready }; }).catch(() => ({}));
      if (process.env.BOHEMIA_CAMP_TRACE) { const k = JSON.stringify([s.cb, s.plates, s.src, s.hours, s.board, s.code, s.ready]); if (k !== out.lastK) { console.log('    ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s ' + k); out.lastK = k; } }
      if (s.cb === 'failed') { out.err = 'the board failed: ' + s.err; break; }
      if (s.cb === 'in' && s.plates > 0 && s.src && !/^data:image\/gif/.test(s.src)) { out.ms = Date.now() - t0; out.hours = s.hours; out.same = s.same; out.src = s.src; break; }
      await sleep(250);
    }
    await sleep(1500);
    const pt1 = await M(() => performance.now());
    if (PROF) { const { profile } = await d.cdp.send('Profiler.stop'); require('fs').writeFileSync(process.env.BOHEMIA_CAMP_PROF, JSON.stringify(profile)); }
    out.frames = await M(([a, b]) => BohemiaFrameMeter.read(a, b), [pt0, pt1]);
    out.bake = await fr.evaluate(() => { try { const st = LOOP.frame.contentWindow.BohemiaCampBoard.state(); return { t: st.t, sameBoth: st.sameBoth }; } catch (e) { return null; } });
  } catch (e) { out.err = String(e && e.message || e).slice(0, 200); }
  finally { await d.close().catch(() => {}); }
  return out;
}

(async () => {
  console.log('\nTHE CAMP LOADS IN ONE GO (rule 472(e), rule 441): the demo upright, CPU 4x, the GPU canvas, MAKE CAMP from the map, a cold camp\n');
  const A = await camp(false), B = await camp(true);
  const say = (R) => R.err ? 'ERROR ' + R.err : (R.ms / 1000).toFixed(1) + ' s to the picture; the longest task ' + (R.frames && R.frames.longMax) + ' ms, held ' + (R.frames && R.frames.longSum) + ' ms in tasks over 50 ms, the worst frame ' + (R.frames && R.frames.max) + ' ms';
  console.log('  now:          ' + say(A)); console.log('  the old ways: ' + say(B) + '\n');
  ok('L1 THE CAMP\'S PICTURE IS IN QUICKLY: under ' + SECS_MAX + ' s from the tap', !A.err && A.ms != null && A.ms < SECS_MAX * 1000, say(A));
  ok('L2 NOTHING HOLDS THE PAGE LONG: the longest task under ' + TASK_MAX + ' ms, all over 50 ms under ' + HELD_MAX + ' ms', !A.err && !!A.frames && A.frames.longMax < TASK_MAX && A.frames.longSum < HELD_MAX, A.frames ? A.frames.longMax + ' ms, ' + A.frames.longSum + ' ms' : 'not measured');
  ok('L3 NO HOUR RUNS BEFORE THE CAMP IS UP: the camp\'s hours the moment its picture is in', !A.err && A.hours === 0, 'hours ' + A.hours);
  ok('L4 THE OTHER LIGHT IS THE SAME BOARD: handed the first light\'s board, the same board both lights', !A.err && A.same === true && !!(A.bake && A.bake.t && A.bake.t.steps && A.bake.t.steps.some(s => s[0] === 'the other light dealt' && s[1] < 200)), JSON.stringify(A.bake && A.bake.t && (A.bake.t.steps || []).filter(s => s[0] === 'the other light dealt')) + ', same both ' + A.same);
  ok('L5 THE PICTURE IS HANDED: the screen draws the board\'s own canvas', !A.err && /^camp-board:/.test(A.src || ''), A.src);
  ok('P1 PLANTED: the six old ways at once turn L3 red (the hours gone) and L1 or L2 (slow or held)', !B.err && B.ms != null && B.hours > 0 && (B.ms >= SECS_MAX * 1000 || B.frames.longMax >= TASK_MAX || B.frames.longSum >= HELD_MAX), say(B) + ', hours gone ' + B.hours);
  console.log('\nTHE CAMP LOADS IN ONE GO: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('THE CAMP LOADS IN ONE GO: ' + pass + ' passed, ' + (fail + 1) + ' failed (threw)'); process.exit(1); });
