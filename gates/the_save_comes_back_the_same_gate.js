/* THE SAVE COMES BACK THE SAME (RUN SIX, 11/6/26; the finish line's stage 1 item 1, 'nothing breaks a run, the saves included').
   PLUMBER 4's whole-loop smoke test saw a save made after a fight come back about 5.5 hours later, twice in four loops.
   MEASURED (records/BOHEMIA_RUN6_THE_SAVE_COMES_BACK_THE_SAME_11_6_26.md): the save held the right minute and the reload put it
   back; then a second finger on CONTINUE or the door, while the door switched itself off, fell through onto the map, and on the
   map a tap is where you are going: the party marched off by itself (32 blocks, 353 game minutes). Fixed in the shell's door
   (__THE_DOOR_KEEPS_ITS_TAPS__). And a tab closed in the first seconds after a fight's LEAVE put the fight back at its bell
   (__THE_FIGHT_SAVES_AT_ITS_START__ kept its record 2.5 s past the map's own save): fixed there.
   ONE STRANGER'S GAME ON THE DEMO HE PLAYS (phone held up), the tab closed and the link opened again at four moments; every
   reload goes through the title the way a hurried thumb does: CONTINUE pressed twice (a double tap), then a third tap in the
   middle of the glass while the door switches off.
     S1 IN A TOWN          the game opens in one; the tab goes; back: the same day, minute, block, batteries and crew
     S2 MID-TRAVEL         the party walking at his speed; the tab goes; back: between the save a moment before and the glass when
                           the tab went (never later than the glass, at most one save beat behind), and he does not walk on by himself
     S3 AFTER A FIGHT      a crew met, ENGAGE, won, the end screen's LEAVE; the tab goes ONE SECOND after the map is back;
                           back: the same, and the fight does not come back
     S4 AT CAMP            camped on the map, the hours running; the tab goes; back: between the save and the glass (never later
                           than the glass, at most one save beat of camp hours behind), and the camp's hours stop
     EVERY RELOAD          for four seconds after CONTINUE nothing moves: no journey, no minute, no block (the double tap and
                           the door's third tap never reach the map)
     S5 THE LEG CAN FAIL   the same reload with the door's hold switched off (window.__DOOR_HOLD_OFF, the before): the taps
                           reach the map and the party moves; if this leg ever passes the gate is blind, and it says so
     S6 nothing threw on any page
   node gates/the_save_comes_back_the_same_gate.js [--no-mutation] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const MUTATE = !process.argv.includes('--no-mutation');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
let pass = 0, fail = 0, d = null, cur = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }
const cityOf = (dd) => dd.page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url())) || dd.fr;
/* what a player would miss, read on the glass */
const GLASS = () => ({ day: T.day, min: T.min, x: city.x, y: city.y, bats: loopBats(), crew: crewCount(), trav: !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length && TRAVEL_SPEED > 0), camp: !!(window.CAMP && CAMP.on), mode: MODE });
const abs = (s) => s.day * 1440 + s.min;
const fmt = (s) => s ? 'day ' + s.day + ' ' + String(Math.floor(s.min / 60)).padStart(2, '0') + ':' + String(Math.round(s.min) % 60).padStart(2, '0') + ' at ' + s.x + ',' + s.y + (s.bats != null ? ', ' + s.bats + ' batteries' : '') + (s.crew != null ? ', ' + s.crew + ' men' : '') : '?';
/* the save the shell holds this instant: what a reload will read */
const HELD = () => { try { const s = CITYSAVE.load(); return s && s.data ? { day: s.data.day, min: s.data.min, x: s.data.cx, y: s.data.cy } : null; } catch (e) { return null; } };

/* THE THUMB AT THE TITLE: CONTINUE twice, 120 ms apart, once the valley has loaded (so the first press goes in), then the middle of
   the glass 250 ms later, while the door is switching itself off */
function thumb(hold) {
  return async (page) => {
    if (hold === false) await page.evaluate(() => { window.__DOOR_HOLD_OFF = true; });
    const c = await waitFor(() => page.evaluate(() => { const t = document.getElementById('title'); if (!t || t.classList.contains('gone') || !window.__LOAD_READY) return null;
      const b = t.querySelector('.bm-start [data-k=continue]') || t.querySelector('[data-k=cont]'); if (!b || b.classList.contains('off')) return null;
      const r = b.getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }), 180000, 100);
    if (!c) return;
    await page.touchscreen.tap(c.x, c.y); await sleep(120); await page.touchscreen.tap(c.x, c.y);
    await sleep(250); const vw = await page.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(vw[0] / 2, vw[1] / 2);
    /* a door that still asks (the valley was not ready for the first press): BEGIN, then the same third tap */
    const b = await waitFor(() => page.evaluate(() => { const f = document.getElementById('fronttap'), fr = document.getElementById('front'); if (!fr || getComputedStyle(fr).display === 'none') return 'in';
      if (!window.__LOAD_READY || !f) return null; const r = f.getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }), 30000, 100);
    if (b && b !== 'in') { await page.touchscreen.tap(b.x, b.y); await sleep(250); await page.touchscreen.tap(vw[0] / 2, vw[1] / 2); }
  };
}
/* the tab goes (a closed tab, the way he leaves) and the link opens again on the same phone; the state read back after CONTINUE */
async function reopen(hold) {
  await cur.page.close().catch(() => {});
  cur = await D.open({ again: d, profile: 'phone_portrait', fog: true, beforeTap: thumb(hold) });
  cur.page.on('pageerror', e => errs.push('again: ' + String(e).slice(0, 140)));
  const c = cityOf(cur);
  await waitFor(() => c.evaluate(() => typeof T !== 'undefined' && MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 60000);
  const a = await c.evaluate(GLASS); await sleep(4000); const b = await c.evaluate(GLASS);
  const fight = await cur.page.evaluate(() => !!document.getElementById('fightFrame') || !!(window.BohemiaFightStart && BohemiaFightStart.pending()));
  return { c, a, b, fight, title: cur.title };
}
const still = (r) => r.a.day === r.b.day && r.a.min === r.b.min && r.a.x === r.b.x && r.a.y === r.b.y && !r.b.trav;
const same = (p, q) => !!p && !!q && p.day === q.day && p.min === q.min && p.x === q.x && p.y === q.y;
/* the moment's own check: back is the game when the tab went (exactly, standing; between the save and the glass, moving), never later
   than the glass and at most `lag` minutes behind it, the batteries and the crew as the glass had them, nothing moving after CONTINUE */
function judge(tag, G, S, R, lag) {
  /* S is the save read a moment before the tab went, G the glass at the moment it went; the page lives on for that moment (the save
     beat, pagehide's flush), so a moving game may come back anywhere between the two, never before S and never after G */
  /* moving, the page lives on for the instant between reading the glass and the tab going: one block's minutes (about 11) of slack */
  const back = abs(R.a), behind = abs(G) - back, slack = lag ? 12 : 0;
  const between = lag ? (abs(S) <= back && back <= abs(G) + slack) : (same(R.a, G) && same(S, G));
  ok(tag + ': back is the game when the tab went' + (lag ? ' (between the save a moment before and the glass)' : ', the same day, minute and block'), between,
    'the save ' + fmt(S) + '; the glass ' + fmt(G) + '; back ' + fmt(R.a));
  ok(tag + ': never later than the glass' + (lag ? ' (one block of slack), and at most one save beat behind it (' + lag + ' game min)' : ', to the minute'), behind >= -slack && behind <= lag,
    behind >= 0 ? behind + ' min behind the glass' : (-behind) + ' MIN AHEAD OF THE GLASS');
  ok(tag + ': the batteries and the crew come back as they were', R.a.bats === G.bats && R.a.crew === G.crew, 'had ' + G.bats + ' batteries, ' + G.crew + ' men; back ' + R.a.bats + ', ' + R.a.crew);
  ok(tag + ': for four seconds after CONTINUE (a double tap, a third tap on the door) nothing moves', still(R) && R.title.via !== 'new', fmt(R.a) + ' -> ' + fmt(R.b) + (R.b.trav ? ', A JOURNEY RUNNING' : '') + (R.fight ? ', A FIGHT' : ''));
}

(async () => {
  console.log('\nTHE SAVE COMES BACK THE SAME: the demo, phone_portrait\n');
  d = cur = await D.open({ profile: 'phone_portrait', fog: true });
  d.page.on('pageerror', e => errs.push('page: ' + String(e).slice(0, 140)));
  let c = d.fr;
  /* ---- S1 IN A TOWN ---- */
  const inTown = await waitFor(() => c.evaluate(() => !!(LOOP.open && LOOP.frame && LOOP.frame.style.display === 'block')), 30000);
  await sleep(2500);
  let S = await cur.page.evaluate(HELD); let G = await c.evaluate(GLASS);
  console.log('S1 in a town (' + (inTown ? 'the town screen up' : 'NO TOWN SCREEN') + '): the tab goes at ' + fmt(G));
  let R = await reopen(true); c = R.c;
  judge('S1 in a town', G, S, R, 0);
  /* ---- S2 MID-TRAVEL ---- */
  const j = await c.evaluate(() => { try { if (window.MEET) MEET.walk = 0; } catch (e) {} try { if (LOOP.open) loopClose(); } catch (e) {} const N = om.n, C = [];
    for (let y = 2; y < N - 2; y += 2) for (let x = 2; x < N - 2; x += 2) { const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd >= 24 && dd <= 60 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, dd]); }
    C.sort((p, q) => p[2] - q[2]);
    for (const q of C.slice(0, 40)) { const r = travelTo(0, 0, [q[0], q[1]]); if (r && TRAVEL && TRAVEL.path && TRAVEL.path.length >= 20 && !TRAVEL.path.slice(1).some(p => loopTownAt(p[0], p[1], 0))) { travelSpeedSet(1); return TRAVEL.path.length; } try { travelStop(); } catch (e) {} }
    return 0; });
  await sleep(3200);
  S = await cur.page.evaluate(HELD); G = await c.evaluate(GLASS);
  console.log('S2 mid-travel (a journey of ' + j + ' blocks): the tab goes at ' + fmt(G) + (G.trav ? ', walking' : ', NOT WALKING'));
  R = await reopen(true); c = R.c;
  judge('S2 mid-travel', G, S, R, 30);
  ok('S2 mid-travel: the party was walking when the tab went, and stands after the reload', G.trav && !R.b.trav, 'walking ' + G.trav + ' -> ' + R.b.trav);
  /* ---- S3 AFTER A FIGHT ---- */
  await c.evaluate(() => { try { travelStop(); } catch (e) {} const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:the-save', at: { gx: city.x + 2, gy: city.y + 1 } };
    return meetWalk(() => cityHandOver(msg)); });
  const eng = await waitFor(() => c.evaluate(() => { const m = document.getElementById('meetcard'); if (!m || +getComputedStyle(m).opacity < 0.9) return null;
    const x = m.querySelector('[data-meet="go"]'); if (!x) return null; const r = x.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }), 15000);
  let fought = false, home = false;
  if (eng) { const fb = await (await c.frameElement()).boundingBox(); await cur.page.touchscreen.tap(fb.x + eng.x, fb.y + eng.y);
    const f = await waitFor(async () => { const h = await cur.page.$('#fightFrame'), ff = h && await h.contentFrame(); return ff && await ff.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board) ? true : null) ? ff : null; }, 60000);
    if (f) { fought = true;
      await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
      /* the end screen's LEAVE, a real tap, pressed again until the screen is gone (it takes his tap once it stands; THE WHOLE LOOP's way) */
      await waitFor(() => cur.page.evaluate(() => !!(window.SPOILS && SPOILS.frame && document.getElementById('spoilsdoor'))), 30000);
      const gone = () => cur.page.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
      home = !!(await waitFor(async () => { if (await gone()) return true;
        const h = await cur.page.$('#spoilsdoor iframe'), sf = h && await h.contentFrame(), lb = sf && await sf.$('#leave'); if (!lb) return null;
        await lb.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await sleep(200);
        const b = await lb.boundingBox(); if (b && b.width >= 2) await cur.page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
        await sleep(1500); return (await gone()) || null; }, 60000, 500));
      if (home) await waitFor(() => c.evaluate(() => MODE === 'city' && !(window.MEET && MEET.up)), 15000);
    } }
  await sleep(1000);   /* a quick thumb: the tab goes one second after the map is back */
  S = await cur.page.evaluate(HELD); G = await c.evaluate(GLASS);
  const rec = await cur.page.evaluate(() => !!localStorage.getItem('bohemia.fight.start.v1'));
  console.log('S3 after a fight (' + (fought ? 'fought and won' : 'NO FIGHT') + ', ' + (home ? 'LEAVE: the map' : 'NOT HOME') + '): the tab goes one second after the map is back, at ' + fmt(G) + '; the fight\'s bell record ' + (rec ? 'STILL KEPT' : 'cleared'));
  ok('S3 after a fight: the fight was fought, won and left by LEAVE', fought && home, fought ? (home ? 'the map' : 'not home') : 'no fight opened (ENGAGE ' + (eng ? 'tapped' : 'never on the glass') + ')');
  R = await reopen(true); c = R.c;
  judge('S3 after a fight', G, S, R, 0);
  ok('S3 after a fight: the fight does not come back (its bell is not put back over the won fight)', !R.fight && !rec, (rec ? 'the bell record was still kept when the tab went; ' : '') + (R.fight ? 'A FIGHT CAME BACK' : 'no fight'));
  /* ---- S4 AT CAMP ---- */
  const made = await c.evaluate(() => { try { travelStop(); } catch (e) {} try { return !!(window.BohemiaMapCamp && BohemiaMapCamp.make()); } catch (e) { return false; } });
  await sleep(2600);
  S = await cur.page.evaluate(HELD); G = await c.evaluate(GLASS);
  console.log('S4 at camp (' + (made ? 'camp made' : 'NO CAMP') + '): the tab goes at ' + fmt(G) + (G.camp ? ', camped' : ', NOT CAMPED'));
  R = await reopen(true); c = R.c;
  judge('S4 at camp', G, S, R, 240);
  ok('S4 at camp: he was camped with the hours running when the tab went, and the hours stop after the reload', made && G.camp && !R.b.camp, 'camped ' + G.camp + ' -> ' + R.b.camp);
  /* ---- S5 THE LEG CAN FAIL ---- */
  if (MUTATE) {
    await c.evaluate(() => { try { travelStop(); } catch (e) {} try { if (LOOP.open) loopClose(); } catch (e) {} });
    await sleep(2000);
    G = await c.evaluate(GLASS);
    R = await reopen(false); c = R.c;
    const moved = !still(R) || R.a.x !== G.x || R.a.y !== G.y || abs(R.b) !== abs(G);
    ok('S5 the leg can fail: with the door\'s hold off (the before) the same thumb reaches the map and he moves', moved,
      moved ? 'saved ' + fmt(G) + ', back ' + fmt(R.a) + ' -> ' + fmt(R.b) + (R.b.trav ? ', walking' : '') : 'HE DID NOT MOVE: the thumb never reached the map, so the legs above prove nothing about the door');
  }
  ok('S6 nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE SAVE COMES BACK THE SAME: ' + pass + ' passed, ' + fail + ' failed');
  try { await cur.page.close(); } catch (e) {} try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
