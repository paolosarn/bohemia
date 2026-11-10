/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES THE GAPS BETWEEN FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE CAMP LETS GO WHEN HE LEAVES  (MOTION 3, 11/10/26, VAMILY rule 441, ask row 560, found by PLUMBER 8's NO FREEZE OVER HALF A SECOND:
   'leaving camp freezes 1.4 s on his phone with the CPU slowed 4x... the camp now stands on the fight's board, and its way out is the new
   cost'.)
   MEASURED BEFORE (main ede366bb5, a CPU profile of the leave, the demo upright, the CPU slowed 4x): the camp's board page (a hidden copy
   of the fight page beside the map that lays the camp's ground) was let go only when a town opened, so a camp broken before its board
   came in left that page loading and baking behind the map for 6 to 8 s: its setup, its deal and its bake in pieces of 150 to 650 ms
   (the worst gap 667 ms, 3.5 s after the leave), then its landing copied the pictures for a camp that was gone.
   NOW (slices/bohemia_camp_look.js __THE_CAMP_LETS_GO_WHEN_HE_LEAVES__, called by the map the moment the camp breaks and by the settlement
   screen as the map hides it): the camp broken, a board still baking is let go at once (its page never bakes), a board already in lets
   its pictures go after the map's way back; a peek at the map (the camp still standing) keeps it.
   On the demo, the phone UPRIGHT (390 x 844), the CPU slowed 4x, a camp made on the map by the phone's HEAL (the street camp, its board
   laid from the block):
     L1 HIS TAP: the phone's HEAL again while the camp's board still bakes: the camp breaks ('left'), and within two seconds of the break
        (the let-go waits its turn behind the leave's own work on the slowed phone) the board page is gone (no #campboardframe), the board 'none', and no task of the fight page from 0.4 s after the break
     L2 THE CENSUS'S WAY (the camp's screen shut from the map's side, the camp breaking on its next hour): the same from the break
     L3 THE FREEZE PLUMBER FOUND NEVER COMES BACK: in L1 and L2, the worst gap between frames in the 6 s after the leave under the
        1.4 s ask row 560 measured; the census's own 1 s line for camp > map and rule 441(a)'s half second printed beside it. MEASURED
        AFTER over six full runs: 550 to 1,050 ms, over 1 s twice (both the census's way); 350 to 483 ms on the probes. What is left is the map drawn twice on
        the way out (the leave's own render inside loopClose, then RUN's __THE_MAP_FRAMES_AROUND_THE_PHONE__ redraw on the phone's
        event, 200 to 400 ms each at 4x), there before the board page came (every walk before it under 0.8 s), routed to RUN
     L4 A PEEK KEEPS IT: the camp's screen hidden while the camp stands: the camp still on, its board page kept, nothing let go
     L5 A BOARD ALREADY IN: the camp left after its board came in: its pictures let go 1.6 s after the break, within 4 s (the board 'none')
     P1 PLANTED: window.__CAMP_LEAVE_KEEPS_BOARD (the way it was): the board page lives on after the break: L1's check RED
     A1 nothing of the camp threw
   MEASURED, NOT YET EXPLAINED: one session's later camps draw slower on the way out (195, then 101 to 164, then 14 to 77 frames in the
   6 s; a camp waited on for its board passes many hours of the valley); the census walks one camp.
   The legs run in this order: L1, L2, L3, L5, P1, L4 (the planted way leaves a board page baking and a camp's screen hidden from outside
   slows the page after it, so those come last; L5 is watched 9 s).
   node gates/the_camp_lets_go_when_he_leaves_gate.js   (about 6 minutes) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const C = require(path.join(ROOT, 'tools/bohemia_freeze_census.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('THE CAMP LETS GO WHEN HE LEAVES: the demo upright, the CPU slowed 4x');
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, throttle: 4, arm: C.CLOCK });
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => { const s = String(e && e.message || e); if (/camp|Camp|CAMP|away/.test(s + String(e && e.stack || ''))) errs.push(s.slice(0, 160)); });
  try {
    await sleep(3000);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(2500);
    const quiet = () => fr.evaluate(() => { try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} }).catch(() => {});
    await quiet();
    const btn = (sel) => p.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
    const heal = async () => { const h = await btn('#bohphone.on .app[data-app=heal]'); if (h) { await p.touchscreen.tap(h[0], h[1]); return 'the phone\'s HEAL'; } await fr.evaluate(() => BohemiaMapCamp.toggle()); return 'the map\'s camp toggle'; };
    const st = () => fr.evaluate(() => { const cw = LOOP.frame && LOOP.frame.contentWindow; let b = null, aw = null; try { b = cw.BohemiaCampBoard.state().state; } catch (e) {} try { aw = cw.BohemiaCampLook.awayN(); } catch (e) {}
      return { board: b, away: aw, frame: !!top.document.getElementById('campboardframe'), camp: window.__CAMP ? (__CAMP.on ? 'on' : 'off:' + __CAMP.why) : (CAMP.on ? 'on' : 'none'), shown: !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.open && LOOP.open.camp) }; }).catch(e => ({ err: String(e).slice(0, 80) }));
    const make = async () => {
      await quiet(); const how = await heal(); let s = null;
      for (let i = 0; i < 80; i++) { s = await st(); if (s.camp === 'on' && s.shown && (s.board === 'baking' || s.board === 'in')) break; await sleep(150); }
      return { how, s };
    };
    const now = () => p.evaluate(() => performance.now());
    /* the frames and the fight page's tasks from t0 for ms */
    const frames = (t0, ms, tb) => p.evaluate(([t0, ms, tb, process_dbg]) => { const F = window.__FZ; const t = F.t.filter(x => x > t0 - 20 && x < t0 + ms); const g = t.slice(1).map((x, i) => [x - t[i], t[i] - t0]); g.sort((a, b) => b[0] - a[0]);
      return { worst: g.length ? [Math.round(g[0][0]), Math.round(g[0][1])] : null, n: t.length, all: process_dbg ? F.long.filter(l => l[0] > t0 - 20 && l[0] < t0 + ms).map(l => [Math.round(l[0] - t0), Math.round(l[1]), (l[2] || 'top').replace(/^.*\//, '')]) : null, fight: F.long.filter(l => l[0] > t0 + tb + 400 && l[0] < t0 + ms && /BOHEMIA_FIGHT/.test(l[2] || '')).map(l => [Math.round(l[0] - t0), Math.round(l[1])]) }; }, [t0, ms, tb, !!process.env.CAMP_LEAVE_DEBUG]);
    /* one leave: the camp made, waited on, left by `way`. Watched FROM INSIDE THE PAGE every 50 ms (a reader that polls the page from
       here starves a slowed phone's frames and measures itself): when the camp broke, when its board page went, when the camp look let
       go; then 6 s of frames and the fight page's tasks from 0.4 s after the break, read once at the end. */
    const leave = async (way, waitMs, untilIn) => {
      const m = await make(); if (m.s.camp !== 'on') return { err: 'no camp (' + JSON.stringify(m.s) + ')' };
      if (untilIn) { for (let i = 0; i < 200; i++) { const s = await st(); if (s.board === 'in') break; await sleep(250); } } else await sleep(waitMs);
      const at = await st();
      const t0 = await fr.evaluate(() => { const cw = LOOP.frame && LOOP.frame.contentWindow, W = window.__LV = { t0: top.performance.now(), brk: null, gone: null, none: null, how: null, n0: 0 };
        try { W.n0 = cw.BohemiaCampLook.awayN().n; } catch (e) {}
        W.iv = setInterval(function () { var t = top.performance.now() - W.t0;
          if (W.brk == null && window.__CAMP && !window.__CAMP.on) W.brk = t;
          if (W.brk != null && W.gone == null && !top.document.getElementById('campboardframe')) W.gone = t;
          if (W.brk != null && W.none == null) { try { var a = cw.BohemiaCampLook.awayN(); if (a.n > W.n0) { W.none = t; W.how = a.how; } } catch (e) {} }
          if (t > 9500) clearInterval(W.iv); }, 50);
        return W.t0; });
      if (way === 'heal') await heal(); else await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
      await sleep(untilIn ? 9000 : 6200);
      const W = await fr.evaluate(() => { const W = window.__LV; return { brk: W.brk, gone: W.gone, none: W.none, how: W.how }; });
      const last = await st(), r = (x) => x == null ? null : Math.round(x);
      const f = await frames(t0, 6000, W.brk == null ? 0 : W.brk);
      return { at, tBreak: r(W.brk), tGone: r(W.gone), tNone: r(W.none), how: W.how, last, f };
    };
    const say = (r) => r.err || ('board at the leave ' + r.at.board + '; the camp broke at ' + r.tBreak + ' ms (' + (r.last && r.last.camp) + '), its board page gone at ' + r.tGone + ' ms, let go (' + r.how + ') at ' + r.tNone + ' ms, the board ' + (r.last && r.last.board)
      + '; the fight page\'s tasks from 0.4 s after the break ' + JSON.stringify(r.f.fight) + '; worst gap ' + JSON.stringify(r.f.worst) + ' over ' + r.f.n + ' frames' + (r.f.all ? '; ALL TASKS ' + JSON.stringify(r.f.all) : ''));
    const gone = (r) => !r.err && r.tBreak != null && r.tGone != null && r.tNone != null && Math.max(r.tGone, r.tNone) - r.tBreak <= 2000 && r.how === 'baking' && r.last.board === 'none' && r.f.fight.length === 0;

    const r1 = await leave('heal', 1500);
    ok('L1 HIS TAP: the phone\'s HEAL again while the camp\'s board still bakes: the camp breaks, its board page gone within two seconds of the break (the let-go waits its turn behind the leave\'s own work on a slowed phone), no task of the fight page from 0.4 s after it', r1.at && r1.at.board === 'baking' && gone(r1), say(r1));
    await sleep(3000);
    const r2 = await leave('census', 1500);
    ok('L2 THE CENSUS\'S WAY: the camp\'s screen shut from the map\'s side (the camp breaks on its next hour): the same, its board page gone within two seconds of the break', r2.at && r2.at.board === 'baking' && gone(r2), say(r2));
    const w = [r1, r2].map(r => r.f && r.f.worst ? r.f.worst[0] : 9999);
    ok('L3 THE FREEZE PLUMBER FOUND NEVER COMES BACK: the worst gap between frames in the 6 s after either leave under the 1.4 s ask row 560 measured (the CPU slowed 4x); the census\'s own 1 s line for camp > map and rule 441\'s half second printed (what is left is the map drawn twice, RUN\'s __THE_MAP_FRAMES_AROUND_THE_PHONE__ redraw on the phone\'s event, routed)', Math.max(...w) < 1400, 'his tap ' + w[0] + ' ms, the census\'s way ' + w[1] + ' ms; under the census\'s 1 s: ' + w.filter(x => x <= 1000).length + ' of 2; under half a second: ' + w.filter(x => x <= 500).length + ' of 2');
    await sleep(3000);
    const r5 = await leave('heal', 0, true);
    ok('L5 A BOARD ALREADY IN: the camp left after its board came in: its pictures let go 1.6 s after the break, within 4 s on a slowed page (the board \'none\', let go as \'in\')',
      !r5.err && r5.at.board === 'in' && r5.tBreak != null && r5.tNone != null && r5.tNone - r5.tBreak <= 4000 && r5.how === 'in' && r5.last.board === 'none', r5.err || say(r5));
    await sleep(3000);
    await p.evaluate(() => { window.__CAMP_LEAVE_KEEPS_BOARD = true; });
    const rp = await leave('heal', 1500);
    await p.evaluate(() => { window.__CAMP_LEAVE_KEEPS_BOARD = false; });
    ok('P1 PLANTED: window.__CAMP_LEAVE_KEEPS_BOARD (the way it was): the board page lives on after the break: L1\'s check goes RED', !rp.err && rp.at.board === 'baking' && rp.tBreak != null && !gone(rp), say(rp));
    /* L4 last (a camp's screen hidden from outside slows the page after it): a peek keeps it */
    await sleep(3000);
    { const m = await make(); await sleep(1500); const s0 = await st();
      await fr.evaluate(() => { LOOP.frame.style.display = 'none'; });
      const r = await fr.evaluate(() => { try { return LOOP.frame.contentWindow.BohemiaCampLook.away(); } catch (e) { return 'threw ' + e; } });
      await sleep(900); const s1 = await st();
      await fr.evaluate(() => { if (CAMP.on && LOOP.open && LOOP.open.camp) LOOP.frame.style.display = 'block'; });
      ok('L4 A PEEK KEEPS IT: the camp\'s screen hidden while the camp stands (made by ' + m.how + '): the camp still on, its board page kept, nothing let go',
        s0.camp === 'on' && s1.camp === 'on' && r === false && s1.frame === s0.frame && (s1.board === s0.board || (s0.board === 'baking' && s1.board === 'in')) && (s1.away && s1.away.n) === (s0.away && s0.away.n),
        'away() said ' + JSON.stringify(r) + '; before ' + JSON.stringify(s0) + '; after ' + JSON.stringify(s1));
      await heal(); await sleep(2000); }

  } catch (e) { ok('the walk', false, String(e && e.stack || e).slice(0, 300)); }
  await d.close();
  ok('A1 nothing of the camp threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE CAMP LETS GO WHEN HE LEAVES: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
