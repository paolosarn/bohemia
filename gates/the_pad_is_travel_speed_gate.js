/* THE PAD IS TRAVEL SPEED  (UI lane 11, VAMILY [speed pad], 9/30/26; RE-AIMED BY PLUMBER 4, 11/5/26)

   RULE 44(a), PAOLO 9/29: "bring the trackpad back but instead of controlling your directions... how Battle Brothers does it when
   you travel on the map, you control how fast." The pad of plates (PAUSE 1x 2x 3x 5x) was that answer on 9/30.

   RE-AIMED 11/5 (PLUMBER 4, the coordinator's job 4 of rule 409): this gate looked for the old plates on the glass and the old 3x and
   5x steps and failed ten legs on a build that does exactly what was asked, because the speed moved. The plates are gone BY RULE (the
   phone is the one control: THE PHONE gate proves the pad is off the glass) and the clock's steps are TRAVEL_CLOCK.steps, 1 2 4, with
   PAUSE before them (rule 384 and 396: the speed is his, at every zoom; HOLD PLAY for 4x, the coordinator's BUILD 11/5a). A gate that
   fails on the right build teaches everybody to ignore it, so it now holds what the game does:
     S1 the speeds are PAUSE and TRAVEL_CLOCK's steps, 1 2 4 (source and live)
     S2 PAUSE holds a journey without ending it (the route is not consulted; source)
     S3 every extra block of a fast beat is a real stepOnce that pays its own clock, spread one every BEAT/N (source)
     S4 the one door every fight comes through stops the journey (source)
     S5 the plates are not on the glass (no #speedpad shown); the phone's PLAY is the control, a thumb tall
     L1 PAUSE: 0 blocks and 0 game minutes in 4 s, and the journey is still set
     L2 1x travels; 2x crosses at least 1.7 times the blocks of 1x; 4x at least 3 times (whole beats, so not exactly 2 and 4)
     L3 every block paid its own clock: the game minutes grow with the blocks at every speed (never a skip)
     L4 HOLD PLAY FOR 4X (bohemia_phone.js __HOLD_FOR_FOUR_TIMES__): a real finger held on PLAY runs the map at 4x while it is down;
        let go and it is his speed again
     L5 no page error
   A speed window a road party interrupted (a card came up) is measured again on a new journey, once, and says so.

   node gates/the_pad_is_travel_speed_gate.js [--profile phone_portrait|computer] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const PHONE = fs.readFileSync(path.join(ROOT, 'slices/bohemia_phone.js'), 'utf8');
const ai = process.argv.indexOf('--profile'), profile = ai > 0 ? process.argv[ai + 1] : 'phone_portrait';

let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) pass++; else fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (extra != null ? '  [' + extra + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('\nTHE PAD IS TRAVEL SPEED  (rule 44a; re-aimed at the travel clock, rules 384 and 396)  ' + profile + '\n');
  ok('S1 the clock\'s steps are 1 2 4, with PAUSE before them', /var TRAVEL_CLOCK = \{ steps: \[1, 2, 4\]/.test(CITY) && /var TRAVEL_SPEEDS_ALL = \[0\]\.concat\(TRAVEL_CLOCK\.steps\);/.test(CITY));
  ok('S2 PAUSE holds the journey without ending it (the route is not consulted)', /!\(TRAVEL && TRAVEL_SPEED===0\)\) \? travelNext\(\)/.test(CITY));
  ok('S3 every extra block is a real stepOnce that pays its own clock, one every BEAT/N', /const m2=stepOnce\(d2\); travelStepped\(m2\);/.test(CITY)
     && /k\*BEAT\/\(XTRA\+1\)/.test(CITY));   /* timed from the beat (WORLD 5, __HOLD_PLAY_SLIDE_THE_SPEED__): slot k of XTRA+1 */
  ok('S4 the one door every fight comes through stops the journey', /travelInterrupt\('fight'\)/.test(CITY));
  ok('S4b the phone holds PLAY for the fastest step and gives his speed back', /function holdFast\(\)/.test(PHONE) && /__HOLD_FOR_FOUR_TIMES__/.test(PHONE) && /function holdEnd\(\)/.test(PHONE));

  const d = await open({ profile, fog: false });
  const errs = [];
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  try {
    await sleep(2500);
    if (await d.fr.evaluate(() => !!(window.LOOP && LOOP.open)).catch(() => false)) {
      await d.page.evaluate(() => { try { document.getElementById('cityFrame').contentWindow.BohemiaPhone.P.leave(); } catch (e) {} });
      await d.fr.evaluate(() => { try { if (LOOP.open && typeof loopLeave === 'function') loopLeave(); } catch (e) {} });
      await sleep(2500);
    }
    const live = await d.fr.evaluate(() => ({ speeds: TRAVEL_SPEEDS.slice(), mode: MODE,
      pad: (function () { const p = document.getElementById('speedpad'); return !!(p && getComputedStyle(p).display !== 'none' && p.getBoundingClientRect().width > 0); })() }));
    ok('S1 live: TRAVEL_SPEEDS is PAUSE 1 2 4', live.speeds.join(' ') === '0 1 2 4', live.speeds.join(' '));
    const play = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .home button[data-app=play]'); if (!b) return null; const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height) }; });
    ok('S5 the old plates are not on the glass; the phone\'s PLAY is the control, a thumb tall', !live.pad && !!play && play.h >= 40 && play.w >= 40,
       'plates ' + (live.pad ? 'SHOWN' : 'gone') + '; PLAY ' + (play ? play.w + 'x' + play.h : 'NOT FOUND') + '; MODE ' + live.mode);

    /* a long journey that never passes through a town (a town's screen would end it), the game's own route read */
    const setOut = () => d.fr.evaluate(() => { try { travelStop(); } catch (e) {} const N = om.n, C = [];
      for (let y = 2; y < N - 2; y += 2) for (let x = 2; x < N - 2; x += 2) { const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd >= 44 && dd <= 80 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, dd]); }
      C.sort((a, b) => a[2] - b[2]);
      for (const c of C.slice(0, 40)) { const r = travelTo(0, 0, [c[0], c[1]]);
        if (r && TRAVEL && TRAVEL.path && TRAVEL.path.length >= 42 && !TRAVEL.path.slice(1).some(q => loopTownAt(q[0], q[1], 0))) return { to: [c[0], c[1]], n: TRAVEL.path.length };
        try { travelStop(); } catch (e) {} }
      return null; });
    const st = () => d.fr.evaluate(() => ({ t: T.day * 1440 + T.min, speed: TRAVEL_SPEED, trav: !!TRAVEL, left: TRAVEL ? TRAVEL.path.length - TRAVEL.i : 0,
      intr: (window.__TRAVEL_INTERRUPT && window.__TRAVEL_INTERRUPT.at) || 0, meet: !!(window.MEET && MEET.up) }));
    const clearCard = () => d.fr.evaluate(() => { try { if (window.MEET && MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} });
    async function measure(n) {
      for (let tryN = 0; tryN < 2; tryN++) {
        await clearCard(); await sleep(400);
        const j = await setOut(); if (!j) return { refused: 'no long journey could be set' };
        await d.fr.evaluate((n) => { travelSpeedSet(n); }, n);
        await sleep(300);
        const a = await st(); await sleep(4000); const b = await st();
        if (b.intr !== a.intr || b.meet) { console.log('       ' + n + 'x: a road party came in the window; measured again on a new journey'); continue; }
        return { speed: a.speed, blocks: a.left - b.left, minutes: b.t - a.t, stillSet: b.trav, retried: tryN > 0 };
      }
      return { refused: 'a road party came in both windows' };
    }
    const R = {};
    for (const n of [0, 1, 2, 4]) { R[n] = await measure(n); const m = R[n];
      console.log('       ' + (n ? n + 'x' : 'PAUSE').padEnd(6) + (m.refused ? 'NOT MEASURED: ' + m.refused : 'crossed ' + m.blocks + ' blocks, +' + m.minutes + ' game minutes in 4 s, journey still set ' + m.stillSet)); }
    const got = (n) => R[n] && !R[n].refused;
    ok('L1 PAUSE HOLDS: 0 blocks and 0 game minutes, and the journey is still set', got(0) && R[0].blocks === 0 && R[0].minutes === 0 && R[0].stillSet, got(0) ? JSON.stringify(R[0]) : R[0].refused);
    ok('L2 1x travels', got(1) && R[1].blocks >= 2, got(1) ? R[1].blocks + ' blocks' : R[1].refused);
    ok('L2 2x crosses at least 1.7 times the blocks of 1x', got(1) && got(2) && R[2].blocks >= 1.7 * R[1].blocks, got(1) && got(2) ? R[1].blocks + ' -> ' + R[2].blocks : 'not measured');
    ok('L2 4x crosses at least 3 times the blocks of 1x', got(1) && got(4) && R[4].blocks >= 3 * R[1].blocks, got(1) && got(4) ? R[1].blocks + ' -> ' + R[4].blocks : 'not measured');
    ok('L3 every block paid its own clock (game minutes grow with the blocks at every speed)', [1, 2, 4].every(n => got(n) && R[n].blocks > 0 && R[n].minutes >= R[n].blocks * 3),
       [1, 2, 4].map(n => got(n) ? n + 'x ' + R[n].minutes + ' min / ' + R[n].blocks + ' blocks' : n + 'x not measured').join('; '));

    /* L4: HOLD PLAY FOR 4X, a real finger on the phone's PLAY */
    await clearCard(); await setOut(); await d.fr.evaluate(() => travelSpeedSet(1)); await sleep(500);
    const p = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .home button[data-app=play]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    let held = null, after = null;
    if (p) {
      if (profile === 'computer') { await d.page.mouse.move(p.x, p.y); await d.page.mouse.down(); }
      else await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 7 }] });
      await sleep(1200);
      held = await d.fr.evaluate(() => TRAVEL_SPEED);
      const h4 = await d.page.evaluate(() => window.__PHONE_HOLD4 || null);
      if (profile === 'computer') await d.page.mouse.up(); else await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(800);
      after = await d.fr.evaluate(() => TRAVEL_SPEED);
      held = { speed: held, phone: h4 };
    }
    ok('L4 HOLD PLAY FOR 4X: while the finger holds PLAY the map runs at 4x; let go and it is his 1x again', !!held && held.speed === 4 && after === 1,
       held ? 'held ' + held.speed + 'x (' + JSON.stringify(held.phone) + '), let go ' + after + 'x' : 'no PLAY on the phone');
    await d.fr.evaluate(() => { try { travelStop(); } catch (e) {} });
  } finally { await d.close(); }
  ok('L5 no page error', errs.length === 0, errs.slice(0, 2).join(' | '));
  console.log('\nTHE PAD IS TRAVEL SPEED: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
