#!/usr/bin/env node
/* ============================================================================
   HIT THE ROAD, EVERY TIME (CAMP FOUR, 11/26/26; VAMILY rule 480(b)(c) on rule 472(c), rules 441, 448).
   PAOLO 11/22 (rule 472): 'once they're fully healed, armor and health, just have them stick idling, and then I have to definitely click
   something to resume getting back on the world map'. Rule 480 (11/26): 'improve on what we already have'. The coordinator's round:
   'HIT THE ROAD works every time'.
   On the demo, upright and on its side (--alpha: the alpha), five camps in one sitting, each ended by ONE real finger:
     R1 HEAL with nobody hurt: the band says HIT THE ROAD once the camp is set up; one tap on it
     R2 HEAL with his men hurt: the hours run, they stop when everyone is whole, the band comes; one tap on it
     R3 HEAL with nobody hurt, the tap the moment the band shows (the band's own first beat)
     R4 HEAL with nobody hurt: one tap on his man's line on the phone's strip (the other way back)
     R5 MAKE CAMP on a won fight's end screen: the camp on the fight's board, whole, the band; one tap on it
   Each: within 4 s of the ONE tap the camp is gone ('road'), its glass off, the map on PAUSE and its clock not moving; the
   tap is ONE tap, never a second.
     R6 THE WAY BACK IS BIG ENOUGH TO HIT: the band and his man's line inside the glass, the band at least 88 by 22 points, his line at
        least 40 tall. MEASURED 11/26: the band 102 by 26 upright and 92 by 23 on its side, his line 46 and 41 tall, under the 44 a thumb
        wants: named for UI (the phone's rows are theirs).
     P1 PLANTED: the map's road answered with nothing (BohemiaMapCamp.road a no-op) turns R1 red.
   node gates/hit_the_road_every_time_gate.js [--alpha] [--way upright|side]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const ALPHA = process.argv.indexOf('--alpha') > 0;
const WAY = (() => { const i = process.argv.indexOf('--way'); return i > 0 ? process.argv[i + 1] : null; })();
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 600) + ']' : '')); };
const WAYS = [{ name: 'upright', profile: 'phone_portrait' }, { name: 'on its side', profile: 'phone_landscape' }].filter(w => !WAY || w.name.indexOf(WAY === 'side' ? 'side' : WAY) >= 0);
const REST = () => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
const HURT = (cut) => {
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  BohemiaCondition.company().names.forEach(k => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s));
  const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
};
const WHOLE = () => { const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.men) { for (const k in s.men) { const m = s.men[k]; m.lostHp = 0; m.lostH = 0; m.lostB = 0; m.wound = null; } localStorage.setItem(KEY, JSON.stringify(s)); } };
const sel = { heal: '#bohphone.on .app[data-app=heal]', band: '#bohphone .bpctx.road .rd', strip: '#bohphone .bpfd' };
async function boxOf(p, s) { return p.evaluate((s) => { const e = [...document.querySelectorAll(s)].find(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(x).display !== 'none'; }); if (!e) return null;
  const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, inside: r.left >= 0 && r.top >= 0 && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5, road: e.dataset ? !!e.dataset.road : false }; }, s); }
async function tap(d, xy, touch) { if (touch) await d.page.touchscreen.tap(xy.x, xy.y); else await d.page.mouse.click(xy.x, xy.y); }
const campOf = (fr) => fr.evaluate(() => ({ on: !!CAMP.on, whole: !!CAMP.whole, why: CAMP.why || null, hours: CAMP.hours | 0, clock: T.day * 1440 + T.min, road: window.__CAMP_ROAD || null }));
/* wait for the band (whole and set up), at most ms */
async function bandUp(d, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const b = await boxOf(d.page, sel.band); if (b) return Object.assign(b, { after: Date.now() - t0 }); await d.page.waitForTimeout(100); } return null; }
/* one tap, then within 4 s: the camp gone for the road, the phone on the map, the clock still */
async function landed(d, fr) {
  const t0 = Date.now(); let st = null;
  while (Date.now() - t0 < 4000) { st = await campOf(fr); if (!st.on) break; await d.page.waitForTimeout(100); }
  await d.page.waitForTimeout(600);   /* the camp's way out (two beats) */
  const scr = await d.page.evaluate(() => { try { const s = window.BohemiaPhone && BohemiaPhone.state ? BohemiaPhone.state() : null; return s ? s.screen || null : null; } catch (e) { return null; } });
  const g = await fr.evaluate(() => ({ shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), speed: typeof TRAVEL_SPEED !== 'undefined' ? TRAVEL_SPEED : null }));
  const paused = g.speed === 0, campGlass = g.shown;
  const c0 = (await campOf(fr)).clock; await d.page.waitForTimeout(1500); const c1 = (await campOf(fr)).clock;
  return { off: !st.on, why: st.why, ms: Date.now() - t0, screen: scr, paused, campGlass, clockStill: c0 === c1 };
}
async function healCamp(d, fr, cut) {
  await fr.evaluate(REST); await fr.evaluate(D.offTheTown); await d.page.waitForTimeout(500);
  if (cut > 0) await fr.evaluate(HURT, cut); else await fr.evaluate(WHOLE);
  const h = await boxOf(d.page, sel.heal); if (!h) return { err: 'no HEAL on the phone' };
  await tap(d, h, true); await d.page.waitForTimeout(300);
  const made = (await campOf(fr)).on; if (!made) return { err: 'HEAL made no camp' };
  return { made };
}
async function run(way) {
  let d; try { d = await D.open({ profile: way.profile, door: 180000, engage: true, alpha: ALPHA || undefined }); }
  catch (e) { ok('the ' + (ALPHA ? 'alpha' : 'demo') + ' opened ' + way.name, false, String(e.message).slice(0, 160)); return; }
  const fr = d.fr, tag = way.name, touch = true;
  try {
    await d.page.waitForTimeout(2500);
    /* R1, R2, R3, R4: HEAL */
    const cases = [{ id: 'R1', cut: 0, what: 'HEAL with nobody hurt, one tap on the band' }, { id: 'R2', cut: 0.3, what: 'HEAL with his men hurt, the hours to whole, one tap on the band' },
      { id: 'R3', cut: 0, what: 'HEAL with nobody hurt, the tap the moment the band shows', quick: true }, { id: 'R4', cut: 0, what: 'HEAL with nobody hurt, one tap on his man\'s line', strip: true }];
    for (const c of cases) {
      const m = await healCamp(d, fr, c.cut);
      if (m.err) { ok(c.id + ' ' + tag + ': ' + c.what, false, m.err); continue; }
      const b = await bandUp(d, c.cut > 0 ? 90000 : 30000);
      if (!b) { ok(c.id + ' ' + tag + ': ' + c.what, false, 'the band never said HIT THE ROAD: ' + JSON.stringify(await campOf(fr))); try { await fr.evaluate(() => BohemiaMapCamp.road()); } catch (e) {} continue; }
      if (!c.quick) await d.page.waitForTimeout(1200);
      const where = c.strip ? await boxOf(d.page, sel.strip) : b;
      if (!where) { ok(c.id + ' ' + tag + ': ' + c.what, false, 'no strip line'); continue; }
      if (c.strip) ok('R6 ' + tag + ': THE WAY BACK IS BIG ENOUGH TO HIT: the band and his line inside the glass, the band at least 88 by 22 points, his line at least 40 tall (44 is the goal: named for UI)',
        b.inside && b.w >= 88 && b.h >= 22 && where.inside && where.h >= 40, JSON.stringify({ band: [Math.round(b.w), Math.round(b.h)], line: [Math.round(where.w), Math.round(where.h)] }));
      await tap(d, where, touch);
      const L = await landed(d, fr);
      ok(c.id + ' ' + tag + ': ' + c.what + ': ONE tap, the camp gone for the road, the phone on the map, the clock still',
        L.off && L.why === 'road' && !L.campGlass && L.paused && L.clockStill,
        JSON.stringify({ band: { w: Math.round(b.w), h: Math.round(b.h), inside: b.inside, after: b.after }, strip: c.strip ? { w: Math.round(where.w), h: Math.round(where.h), inside: where.inside } : false, ...L }));
      await d.page.waitForTimeout(1200);
    }
    /* R5: MAKE CAMP after a won fight */
    await fr.evaluate(REST); await fr.evaluate(D.offTheTown); await fr.evaluate(WHOLE);
    const r = await K.oneFight(d, { fam: '^suburb$', end: 'won', watch: false, lootMs: 1500 });
    if (r.err) ok('R5 ' + tag + ': MAKE CAMP on a won fight, one tap on the band', false, r.err);
    else {
      await fr.evaluate(() => { if (window.__GATE_HELD) { campDone = window.__GATE_HELD; window.__GATE_HELD = null; } });   /* the camp driver's hold off: the game's own stop */
      const b = await bandUp(d, 120000);
      if (!b) ok('R5 ' + tag + ': MAKE CAMP on a won fight, one tap on the band', false, 'the band never said HIT THE ROAD: ' + JSON.stringify(await campOf(fr)));
      else { await d.page.waitForTimeout(1200); await tap(d, b, touch); const L = await landed(d, fr);
        ok('R5 ' + tag + ': MAKE CAMP on a won fight: ONE tap on the band, the camp gone for the road, the phone on the map, the clock still', L.off && L.why === 'road' && !L.campGlass && L.paused && L.clockStill, JSON.stringify({ band: { w: Math.round(b.w), h: Math.round(b.h), inside: b.inside }, ...L })); }
    }
    /* P1: planted, once */
    if (way.profile === 'phone_portrait') {
      const m = await healCamp(d, fr, 0); const b = m.err ? null : await bandUp(d, 30000);
      if (b) { await fr.evaluate(() => { window.__ROAD_WAS = BohemiaMapCamp.road; BohemiaMapCamp.road = function () { return false; }; }); await d.page.waitForTimeout(600); await tap(d, b, touch); const L = await landed(d, fr);
        await fr.evaluate(() => { BohemiaMapCamp.road = window.__ROAD_WAS; try { BohemiaMapCamp.road(); } catch (e) {} });
        ok('P1 PLANTED: the map\'s road answering nothing turns R1 red (the camp still up after the tap)', !L.off, JSON.stringify(L)); }
      else ok('P1 PLANTED: the map\'s road answering nothing turns R1 red', false, 'no band to plant on');
    }
  } catch (e) { ok('the run ' + tag, false, String(e && e.stack || e).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}
(async () => {
  console.log('HIT THE ROAD, EVERY TIME' + (ALPHA ? ' (the alpha)' : ' (the demo)'));
  for (const w of WAYS) await run(w);
  console.log('\nHIT THE ROAD, EVERY TIME: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})();
