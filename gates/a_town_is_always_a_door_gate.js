#!/usr/bin/env node
/* ============================================================================
   A TOWN IS ALWAYS A DOOR GATE (WORLD 8, 11/3/26; rule 381, ask line 411; rule 273). Code: __A_TOWN_IS_ALWAYS_A_DOOR__ in
   slices/BOHEMIA_CITY_WORLD.html (hooks H21-H26, tools/bohemia_world_8_map_houses_patch.py).
   PAOLO 11/3: 'I'm trying to enter a city but an enemy I fell back from is trying to crawl up my ass. I should still be able to do
   that.'

   On the demo, his phone, a new game, through the one driver (node gates/a_town_is_always_a_door_gate.js [profile] [--frames dir]):
     K1-K3 FROM THREE SIDES: a crew hunting him catches him 14 to 20 blocks out (past the old ten-block get-away), he taps FALL BACK on the card, then walks to the town
           (the map's own town walk, the one the quest call uses) with them ONE BLOCK BEHIND him every step: the card never comes
           back and the town's screen opens
     K4 THE BEFORE (the mutation, TOWN_DOOR.on false): the same walk, and the card comes back at the gate (his bug, reproduced)
     K5 THEY STOP AT ITS EDGE AND GIVE UP: him on the town's ground, the world stepping: they never step onto it, and give up
     K6 a fight he chooses still comes on a town's ground (ENGAGE on a card, a job's camp); what came for him does not
     C1 nothing threw
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const argv = process.argv.slice(2), fi = argv.indexOf('--frames'), FR = fi >= 0 ? argv[fi + 1] : null;
const PROF = argv.filter((a, i) => !a.startsWith('--') && (fi < 0 || i !== fi + 1))[0] || 'phone_portrait';

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, beforeTap: async (p) => {   /* no engage: the card waits for his FALL BACK */
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.TOWN_DOOR && !!window.BohemiaJobKinds).catch(() => false)) break; }
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  let shot = 0;
  const snap = async (tag) => { if (!FR) return; const dir = path.join(FR, tag); fs.mkdirSync(dir, { recursive: true }); await page.screenshot({ path: path.join(dir, String(shot++).padStart(3, '0') + '.png') }); };

  /* the towns and, for each, starts six blocks out on each side with a road in */
  const plan = await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {}
    const bs = ctBases(), out = [], SIDES = [['west', -1, 0], ['east', 1, 0], ['south', 0, 1], ['north', 0, -1]];
    const names = Object.keys(bs).sort((a, b) => Math.max(Math.abs(bs[a].x - city.x), Math.abs(bs[a].y - city.y)) - Math.max(Math.abs(bs[b].x - city.x), Math.abs(bs[b].y - city.y)));
    for (const nm of names) { const T = bs[nm];
      for (const [side, ax, ay] of SIDES) { if (out.some(o => o.side === side)) continue;
        let st = null;
        for (let k = 0; k < 7 && !st; k++) for (const j of [0, 1, -1, 2, -2]) { const x = (T.x | 0) + ax * (14 + k) + (ay ? j : 0), y = (T.y | 0) + ay * (14 + k) + (ax ? j : 0);
          if (!cityWalkable(x, y) || loopTownAt(x, y, 3)) continue;
          const bx = x + ax, by = y + ay; if (!cityWalkable(bx, by) || loopTownAt(bx, by, 3)) continue;
          let r = null; try { r = BohemiaJobKinds.walkRoute(x, y, { town: { name: nm, x: T.x | 0, y: T.y | 0 } }); } catch (e) {}
          if (r && r.path && r.path.length >= 14 && r.path.length <= 28) { st = { at: [x, y], behind: [bx, by], blocks: r.path.length - 1 }; break; } }
        if (st) out.push({ side, town: nm, T: [T.x | 0, T.y | 0], ...st }); }
      if (out.length >= 4) break; }
    return out; });
  if (plan.length < 3) { ok('K1 ' + prof + ': three sides to walk in from', false, JSON.stringify(plan)); await d.close(); return; }

  /* ON HIS HEELS, EXACTLY: inside each of his steps, before the world moves, the crew stands on the block he just left */
  await fr.evaluate(() => { if (window.__MSW0) return; window.__MSW0 = window.mapStepWorld;
    window.mapStepWorld = function () { const Hh = window.__HEEL; try { if (Hh && Hh.on && HUNT && (city.x !== Hh.last[0] || city.y !== Hh.last[1])) { if (cityWalkable(Hh.last[0], Hh.last[1])) HUNT.at = Hh.last.slice(); Hh.last = [city.x, city.y]; }
      if (Hh && HUNT) Hh.near = Math.min(Hh.near, Math.max(Math.abs(HUNT.at[0] - city.x), Math.abs(HUNT.at[1] - city.y))); } catch (e) {} return __MSW0.apply(this, arguments); }; });
  /* the walk's log: every hand-over (and what the door said), every town opened, every line said */
  await fr.evaluate(() => { if (window.__DL0) return; window.__DL = []; const w = (nm, f) => { const o = window[nm]; if (typeof o !== 'function') return; window[nm] = function () { const r = o.apply(this, arguments); try { __DL.push(f(arguments, r)); if (__DL.length > 60) __DL.shift(); } catch (e) {} return r; }; };
    window.__DL0 = 1; w('cityHandOver', (a, r) => 'door ' + (a[0] && a[0].why) + ' -> ' + r + ' at ' + city.x + ',' + city.y); w('loopOpenTown', (a) => 'open ' + (a[0] && a[0].name)); w('travelSay', (a) => 'say ' + a[0]); w('meetShow', (a) => 'card ' + (a[0] && a[0].why)); });
  /* one walk in: caught, FALL BACK, then the town walk with them one block behind every step */
  const walkIn = async (p, tag, on) => {
    /* RE-AIMED 11/6 BY RUN SIX (rule 413): after FALL BACK a crew now holds the field and never follows him, so THE BEFORE switches that off too
       (window.__RETREAT_AWAY_OFF), or the before could never show the card at the gate; the after legs run with both on, as the game does */
    await fr.evaluate((a) => { TOWN_DOOR.on = a.on; window.__RETREAT_AWAY_OFF = !a.on; try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} try { CITY_CONTACT_POSTED = false; } catch (e) {}
      if (typeof MEET !== 'undefined' && MEET && MEET.up) { try { MEET.up.el && MEET.up.el.remove(); } catch (e) {} MEET.up = null; }
      window.__DL = []; MEET_BACK.list = []; city.x = a.p.at[0]; city.y = a.p.at[1]; CITY_GLIDE.tx = null; try { fogClear(city.x, city.y, 6); } catch (e) {}
      HUNT = { id: 'hunt:door:' + a.tag, ev: { id: 'toll_crew', name: 'the toll crew', seq: 1 }, name: 'THE TOLL CREW', arch: 'human', count: 4, at: a.p.behind.slice(), steps: 0, made: performance.now() };
      window.__HEEL = { last: [city.x, city.y], cards: 0, near: 9, on: true }; HUNT_T0 = 1; if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); setZoomAt(2.2); try { camHold(); } catch (e) {} render();
      BohemiaJobKinds.walkGo([a.p.T[0], a.p.T[1]], a.p.town); }, { p, tag, on });
    /* they catch him: the card; he taps FALL BACK (the card's own way out) */
    let card = null;
    for (let i = 0; i < 40 && !card; i++) { await page.waitForTimeout(250); card = await fr.evaluate(() => (typeof MEET !== 'undefined' && MEET && MEET.up) ? String(MEET.up.msg && MEET.up.msg.why) : null); }
    await snap(tag);
    const fb = await fr.evaluate(() => { window.__HEEL.on = false; if (!(MEET && MEET.up)) return null; const u = MEET.up; MEET.up = null; try { u.el && u.el.remove(); } catch (e) {} meetFallBack(u.msg); return { at: [city.x, city.y], hunt: HUNT && HUNT.at }; });
    await snap(tag);
    /* then he walks to the town again, them ONE BLOCK BEHIND him every step (the worst of 'crawling up my ass') */
    await fr.evaluate((a) => { window.__HEEL = { last: [city.x, city.y], cards: 0, near: 9, on: true }; BohemiaJobKinds.walkGo([a.T[0], a.T[1]], a.town); }, p);
    let res = null, idle = 0;
    for (let i = 0; i < 240 && !res; i++) { await page.waitForTimeout(150);
      const st = await fr.evaluate((a) => { const Hh = window.__HEEL;
        const open = !!(LOOP.frame && LOOP.frame.style.display === 'block'), card = !!(typeof MEET !== 'undefined' && MEET && MEET.up);
        return { open, name: open && LOOP.open && LOOP.open.name, card, trav: !!TRAVEL, at: [city.x, city.y], hunt: HUNT ? HUNT.at.slice() : null, near: Hh.near, fight: !!LOOP.fighting || !!CITY_CONTACT_POSTED,
          held: TOWN_DOOR.held, back: MEET_BACK.held, gave: window.__HUNT_GAVE_UP | 0, last: window.__LAST_HANDOVER ? window.__LAST_HANDOVER.why : null }; }, p);
      if (i % 3 === 0) await snap(tag);
      if (st.open || st.card || st.fight) res = st;
      else if (!st.trav && i > 3) { idle++; if (idle > 8) res = st; }   /* arrived: the town opens a beat after the last step (250 ms) */
      else idle = 0; }
    await snap(tag); await page.waitForTimeout(400); await snap(tag);
    const log = await fr.evaluate(() => (window.__DL || []).slice(-14));
    return { card, fb, res, log };
  };

  /* K4 first, THE BEFORE: the switch off, his bug */
  const pb = plan[0];
  const before = await walkIn(pb, 'before', false);
  ok('K4 ' + prof + ': THE BEFORE (the fix off): the same walk and the card comes back at the gate', !!before.card && !!before.res && before.res.card && !before.res.open,
     'caught: ' + before.card + '; then ' + JSON.stringify(before.res) + (before.res && before.res.card ? '' : '; LOG ' + before.log.join(' | ')));
  const sides = [];
  for (let k = 0; k < 3; k++) { const p = plan[k];
    const r = await walkIn(p, k === 0 ? 'after' : 'side' + k, true); sides.push(r);
    ok('K' + (k + 1) + ' ' + prof + ': from the ' + p.side + ' of ' + p.town + ': fell back, walked in with them one block behind, the town opened', !!r.card && !!r.fb && !!r.res && r.res.open && String(r.res.name || '').toUpperCase() === String(p.town).toUpperCase() && !r.res.card && r.res.near <= 1,
       'caught: ' + r.card + '; ' + p.blocks + ' blocks in; ' + JSON.stringify(r.res) + (r.res && r.res.open ? '' : '; LOG ' + r.log.join(' | '))); }
  /* K5: he stands on the town's ground (his LEAVE), the world steps: they never step onto it, and they give up */
  const k5 = await fr.evaluate((p) => { if (window.__HEEL) __HEEL.on = false; try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} CITY_CONTACT_POSTED = false;
    const T = p.T; let st = null; for (let r = 1; r <= 2 && !st; r++) for (let dy = -r; dy <= r && !st; dy++) for (let dx = -r; dx <= r && !st; dx++) if (cityWalkable(T[0] + dx, T[1] + dy) && !(dx === 0 && dy === 0)) st = [T[0] + dx, T[1] + dy];
    if (!st) return { none: true }; city.x = st[0]; city.y = st[1]; CITY_GLIDE.tx = null;
    let h = null; for (let r = 3; r <= 7 && !h; r++) for (let dy = -r; dy <= r && !h; dy++) for (let dx = -r; dx <= r && !h; dx++) { const x = st[0] + dx, y = st[1] + dy; if (cityWalkable(x, y) && !townGround(x, y) && Math.max(Math.abs(dx), Math.abs(dy)) === r) h = [x, y]; }
    HUNT = { id: 'hunt:door:edge', ev: { id: 'toll_crew', name: 'the toll crew', seq: 2 }, name: 'THE TOLL CREW', arch: 'human', count: 4, at: h, steps: 0, made: performance.now() };
    const g0 = TOWN_DOOR.gave; let onGround = 0, steps = 0, fights = 0, closest = 9;
    for (; steps < 40 && HUNT; steps++) { mapStepWorld(); try { mapContact(); } catch (e) {} if (CITY_CONTACT_POSTED) { fights++; CITY_CONTACT_POSTED = false; }
      if (HUNT) { if (townGround(HUNT.at[0], HUNT.at[1])) onGround++; closest = Math.min(closest, Math.max(Math.abs(HUNT.at[0] - city.x), Math.abs(HUNT.at[1] - city.y))); } }
    return { stood: st, from: h, steps, gaveUp: !HUNT, gave: TOWN_DOOR.gave - g0, onGround, fights, closest }; }, plan[0]);
  ok('K5 ' + prof + ': they stop at the town\'s edge and give up after a while', !k5.none && k5.gaveUp && k5.gave >= 1 && k5.onGround === 0 && k5.fights === 0, JSON.stringify(k5));
  /* K6: on a town's ground, what he chose still comes; what came for him does not */
  const k6 = await fr.evaluate(() => { const H = { at: [0, 0] };
    return { hunt: !!townDoorHolds({ why: 'road:toll_crew:caught', __hunt: H }), pack: !!townDoorHolds({ why: 'contract:x:pack' }), road: !!townDoorHolds({ why: 'road:toll_crew' }),
      engage: !!townDoorHolds({ why: 'road:toll_crew:caught', __hunt: H, __met: true }), camp: !!townDoorHolds({ why: 'contract:x:camp' }), party: !!townDoorHolds({ why: 'party:p1' }), wave: !!townDoorHolds({ why: 'contract:x:wave' }) }; });
  ok('K6 ' + prof + ': on a town\'s ground a fight he chooses still comes; what came for him does not', k6.hunt && k6.pack && k6.road && !k6.engage && !k6.camp && !k6.party && !k6.wave, JSON.stringify(k6));
  ok('C1 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  try { await run(PROF); } catch (e) { ok('the gate ran on ' + PROF, false, String(e.stack || e.message).slice(0, 300)); }
  console.log('\nA TOWN IS ALWAYS A DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
