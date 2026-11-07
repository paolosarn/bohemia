#!/usr/bin/env node
/* ============================================================================
   EVERY CHANGE AT SIXTY (PLUMBER 7, 11/7/26; rule 418, rule 427(d), ask line 441: 'every UI change at 60 frames a second, never
   a slideshow'). MEASURED BEFORE on the demo at 390 x 844 (records/BOHEMIA_PLUMBER_THE_MAP_S_LIGHTS_AND_EVERY_CHANGE_AT_SIXTY_11_7_26.md):
   the crew screen's first grow ran 13.6 frames a second, its worst frame 550 ms: opening it the first time hands the fight's door
   the crew screen's own company, the crew key turns, and the phone's next deal planned every job in the valley again in one piece
   (466 ms at full speed). NOW (__A_NEW_CREW_IS_PLANNED_OVER_FRAMES__, slices/bohemia_job_danger.js) a new crew's plans are made a
   few at a time in the frames' gaps, never under a change that is playing. On the demo, his phone, at full speed, twice: the new
   way and the old (window.__JOB_DANGER_SYNC, the planted fail):
     C1 A NEW CREW NEVER FREEZES THE SCREEN: the crew screen opened the first time (the crew key turns), the longest frame from the
        tap until the board's last plan is made under 200 ms, the plans made in slices (more than one; the longest under 200 ms:
        one job's plan is one piece, and a find on the region's land is 40 to 140 ms of route, named for WORLD in the record)
     C2 THE BOARD POSTS THE SAME JOBS EITHER WAY: the phone's every ask (place and job) after the turn is the same set the old way
        posts
     C3 THE READS STILL COME BACK: every job on the phone's glass is read (its stars played) within 90 s of the turn
     C5 THE FIRST WAY OUT OF A TOWN NEVER FREEZES THE MAP: the map's crowd sheets are unpacked in idle time before they are drawn
        (__A_SHEET_IS_UNPACKED_BEFORE_IT_IS_DRAWN__, engine/bohemia_idles.js), the leave's longest frame under 150 ms (before: the
        fourteen sheets unpacked in the leave's first frame, 367 to 431 ms)
     C4 THE CHANGES, MEASURED: the town's grow and its leave, the crew's grow and its DONE, each's frames a second and its worst
        frame (reported: the budget is sixty; what is short of it is named in the record)
     P1 THE PLANTED FAIL: the old way (the deal plans every job in one piece, window.__IDLES_NO_WARM) turns C1 and C5 red
     E1 nothing threw
   node gates/every_change_at_sixty_gate.js
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x != null ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function session(old) {
  const d = await D.open({ profile: 'phone_portrait', fog: false, gpu: process.env.BOHEMIA_GPU === '1',
    arm: old ? 'window.__JOB_DANGER_SYNC = true; window.__IDLES_NO_WARM = true;' : undefined });   /* the old way in every frame from its first line; BOHEMIA_GPU=1: the canvas on a GPU process (SwiftShader), for the record */
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const M = (fn, a) => d.page.evaluate(fn, a);
  const out = { old, errs, changes: {} };
  try {
    for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded())).catch(() => false)) break; await sleep(500); }
    await M(() => BohemiaFrameMeter.start());
    await M(() => { try { document.getElementById('cityFrame').contentWindow.BohemiaPhone.P.leave(); } catch (e) {} });
    await d.fr.evaluate(() => { try { if (LOOP.open && typeof loopLeave === 'function') loopLeave(); } catch (e) {} });
    await sleep(6000);
    const NOW = () => M(() => performance.now());
    const frames = (a, b) => M(([a, b]) => BohemiaFrameMeter.read(a, b), [a, b]);
    const crewAt = () => M(() => { const e = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (e) { const r = e.getBoundingClientRect(); if (r.width) return [r.x + r.width / 2, r.y + r.height / 2]; }
      try { const b = BohemiaMotion.find('crew'), x = b && BohemiaMotion.box(b); if (x) return [x.x + x.w / 2, x.y + x.h / 2]; } catch (e) {} return null; });
    const crewDone = () => M(() => { const h = [...document.querySelectorAll('iframe')].find(x => { try { return x.contentDocument && x.contentDocument.getElementById('done') && x.getClientRects().length; } catch (e) { return false; } }); if (h) { h.contentDocument.getElementById('done').click(); return true; } return false; });
    /* the crew screen, the first time: the crew key turns */
    const ck0 = await d.fr.evaluate(() => BohemiaJobDanger.crewKey());
    const c = await crewAt(); if (!c) throw new Error('no CREW on the bar');
    const a = await NOW(); await d.page.touchscreen.tap(c[0], c[1]); await sleep(3500);
    for (let i = 0; i < 40; i++) { const w = await d.fr.evaluate(() => BohemiaJobDanger.state().plans.waiting); if (!w) break; await sleep(250); }   /* until the last plan is made */
    await sleep(500); const b = await NOW();
    out.changes['crew grow (a new crew)'] = await frames(a, a + 1200); out.turn = await frames(a, b);
    out.ck = [ck0, await d.fr.evaluate(() => BohemiaJobDanger.crewKey())];
    out.plans = await d.fr.evaluate(() => BohemiaJobDanger.state().plans);
    out.asks = await d.fr.evaluate(() => BohemiaPhoneBoard.asks().map(a => a.place + '|' + a.id).sort());
    let e1 = await NOW(); await crewDone(); await sleep(1600); out.changes['crew DONE'] = await frames(e1, e1 + 1200);
    /* the reads come back: every job on the phone's glass */
    const t0 = Date.now(); let shown = null;
    for (; Date.now() - t0 < 90000;) {
      shown = await d.fr.evaluate(() => { const B = window.__PHONE_BOARD, all = BohemiaBoardShelf.shelf().offers; if (!B || !B.shown || !B.shown.length) return null;
        return B.shown.map(s => { const o = all.filter(x => x.id === s.id)[0], R = o ? BohemiaJobDanger.peek(o, s.place) : null; return { id: s.id, place: s.place, state: R ? R.state : 'none' }; }); });
      if (shown && shown.every(s => s.state === 'read')) break; await sleep(1000); }
    out.shown = shown; out.readMs = Date.now() - t0;
    /* the town's grow and its leave */
    const town = await d.fr.evaluate(() => { const bs = ctBases(); let best = null, bd = 1e9; for (const n in bs) { const dd = Math.abs(bs[n].x - city.x) + Math.abs(bs[n].y - city.y); if (dd < bd && dd > 0) { bd = dd; best = n; } } return best; });
    e1 = await NOW(); await d.fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town); await sleep(2500);
    out.changes['town grow'] = await frames(e1, e1 + 1500);
    e1 = await NOW(); await d.fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(2500);
    out.changes['town leave'] = await frames(e1, e1 + 1200);
    out.warmed = await d.fr.evaluate(() => BohemiaIdles.warmed ? BohemiaIdles.warmed() : null);
  } catch (e) { out.threw = String(e && e.stack || e).slice(0, 300); }
  await d.close();
  return out;
}

(async () => {
  console.log('\nEVERY CHANGE AT SIXTY (rule 418, ask line 441)\n');
  const A = await session(false), B = await session(true);
  const say = (r) => r ? r.fps + ' fps, worst ' + r.max + ' ms' : '-';
  console.log('  the crew key: ' + (A.ck || []).join(' -> ') + '; the plans: ' + JSON.stringify(A.plans));
  console.log('  the old way\'s plans: ' + JSON.stringify(B.plans));
  Object.keys(A.changes).forEach(k => console.log('    ' + k.padEnd(24) + ' now ' + say(A.changes[k]) + '  |  the old way ' + say(B.changes[k])));
  const c1 = (R) => !!(R.turn && R.ck && R.ck[0] !== R.ck[1] && R.turn.max < 200 && R.plans && R.plans.slices > 1 && R.plans.sliceMax < 200);
  ok('C1 a new crew never freezes the screen: the crew screen opened the first time, the longest frame until the last plan is made under 200 ms, the board\'s plans in slices', !A.threw && c1(A),
    'longest frame ' + (A.turn && A.turn.max) + ' ms over ' + (A.turn && A.turn.frames) + ' frames, crew key turned ' + !!(A.ck && A.ck[0] !== A.ck[1]) + ', ' + (A.plans ? A.plans.planned + ' plans in ' + A.plans.slices + ' slices, the longest ' + (+A.plans.sliceMax).toFixed(0) + ' ms (' + A.plans.worst + ')' : 'no plans') + ' (the old way: ' + (B.turn && B.turn.max) + ' ms)');
  const c5 = (R) => !!(R.changes['town leave'] && R.changes['town leave'].max < 150);
  ok('C5 THE FIRST WAY OUT OF A TOWN NEVER FREEZES THE MAP: the crowd\'s idle sheets are unpacked in the idle time before they are drawn, and the longest frame of the leave is under 150 ms', !A.threw && c5(A) && !!(A.warmed && A.warmed.n > 0),
    'longest frame ' + (A.changes['town leave'] && A.changes['town leave'].max) + ' ms, ' + (A.warmed ? A.warmed.n + ' sheets unpacked in idle time, the longest ' + A.warmed.max + ' ms' : 'none unpacked') + ' (the old way: ' + (B.changes['town leave'] && B.changes['town leave'].max) + ' ms)');
  const same = A.asks && B.asks && A.asks.length > 0 && A.asks.join(';') === B.asks.join(';');
  ok('C2 the board posts the same jobs either way (every ask on the phone after the turn, place and job)', same, (A.asks || []).length + ' asks now, ' + (B.asks || []).length + ' the old way' + (same ? '' : ': ' + (A.asks || []).filter(x => (B.asks || []).indexOf(x) < 0).slice(0, 3).join(', ')));
  ok('C3 the reads still come back: every job on the phone\'s glass is read within 90 s', !!(A.shown && A.shown.length && A.shown.every(s => s.state === 'read')), A.shown ? A.shown.map(s => s.id + '@' + s.place + ' ' + s.state).join(', ') + ' in ' + Math.round(A.readMs / 1000) + ' s' : 'nothing shown');
  ok('C4 the changes, measured (reported against the sixty budget)', Object.keys(A.changes).length >= 4, Object.keys(A.changes).map(k => k + ' ' + (A.changes[k] ? A.changes[k].fps : '-')).join(', '));
  ok('P1 THE PLANTED FAIL: the old way (every job planned in one piece, a sheet unpacked as it is drawn) turns C1 and C5 red', !B.threw && !c1(B) && !c5(B), 'the old way: C1 ' + (c1(B) ? 'green' : 'red') + ' (' + (B.turn && B.turn.max) + ' ms), C5 ' + (c5(B) ? 'green' : 'red') + ' (' + (B.changes['town leave'] && B.changes['town leave'].max) + ' ms)');
  ok('E1 nothing threw', !A.threw && !B.threw && A.errs.length === 0, (A.threw || B.threw || A.errs.slice(0, 2).join(' | ') || ''));
  console.log('\nEVERY CHANGE AT SIXTY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
