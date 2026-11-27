#!/usr/bin/env node
/* THE STALL'S DAY (ECONOMY THREE 11/27, VAMILY rule 485(b): 'the city's money moves whether he is there or not, and he can see it:
   stalls open, sell out and close... prices move with what is scarce'; rule 441). records/BOHEMIA_ECONOMY_THREE_THE_RUNNING_CITY_11_27_26.md.
   DATA legs (engine/bohemia_stall_prices.js theDay, records/target/bb/stall_prices.json the_day):
     D1 at first light the shelf is full and the price is the dawn price; as the day goes the town buys it down and the price climbs;
        shut at night
     D2 a town short of it (its card's need) runs out sooner than a calm one at the same hour
     D3 the same place on the same day gives the same answer; two places, or two days, differ (the day's own luck)
     D4 what he bought this visit comes off the shelf
     D5 the price never under the dawn price, never over (1 + climb) times it
     D6 tape has no day (its own shelf and back room, rule 271)
     D7 every number of the day has a value and a source
   PAGE legs (demo | alpha, phone_portrait | phone_landscape), Caravans' stall opened by a finger at three hours of the map's day:
     P1 first light: every BUY at its dawn price, nothing shut, nothing sold out (the stall as it always was in the morning)
     P2 late in the day: the food costs more than at dawn or says SOLD OUT; the strip says how many are left today
     P3 night: food, meds and rounds say SHUT and do not sell; the tape still sells; the keeper says the shutters are down
     P4 no page error
   node gates/the_stalls_day_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/stall_prices.json'), 'utf8'));
const MODE = process.argv[2] || 'data', SHAPE = process.argv[3] || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const day = (good, o) => SP.theDay(FILE, good, Object.assign({ tier: 'town', day: 4, seed: 'Caravans', need: 1, bought: 0 }, o));

if (MODE === 'data') {
  const H = (FILE.the_day && FILE.the_day.open && FILE.the_day.open.value) || [360, 1200];
  const dawn = day('food', { min: H[0] }), noon = day('food', { min: 780 }), dusk = day('food', { min: H[1] - 1 }), night = day('food', { min: 1380 });
  ok('D1 the food at first light ' + dawn.left + ' of ' + dawn.full + ', at one ' + noon.left + ', at dusk ' + dusk.left + ' (the price x' + dawn.climb.toFixed(2) + ', x' + noon.climb.toFixed(2) + ', x' + dusk.climb.toFixed(2) + '); at night shut',
    dawn.open && dawn.left === dawn.full && dawn.climb === 1 && noon.left < dawn.left && dusk.left <= noon.left && noon.climb > 1 && dusk.climb >= noon.climb && !night.open);
  const calm = day('food', { min: 900 }), short = day('food', { min: 900, need: 1.5 });
  ok('D2 a town short of food at three (need x1.5) has ' + short.left + ' left, a calm one ' + calm.left, short.left < calm.left);
  const a1 = day('meds', { min: 900 }), a2 = day('meds', { min: 900 }), others = ['Mob', 'Church', 'Blues', 'Trades'].map(n => day('food', { min: 900, seed: n }).left).concat([1, 2, 3, 5].map(d => day('food', { min: 900, day: d }).left));
  ok('D3 the same place and day the same (' + a1.left + ', ' + a2.left + '); other places and days differ (' + others.join(', ') + ')', a1.left === a2.left && new Set(others).size > 2);
  const b0 = day('rounds', { min: 600 }), b3 = day('rounds', { min: 600, bought: 3 });
  ok('D4 he bought 3: ' + b0.left + ' -> ' + b3.left, b3.left === Math.max(0, b0.left - 3));
  const climbs = []; for (let m = H[0]; m < H[1]; m += 30) ['food', 'meds', 'rounds'].forEach(g => ['camp', 'town', 'fortress'].forEach(t => [0.8, 1, 1.5, 2].forEach(n => climbs.push(day(g, { min: m, tier: t, need: n }).climb))));
  const top = 1 + ((FILE.the_day.climb || {}).value || 1);
  ok('D5 the price between the dawn price and x' + top + ' (' + Math.min(...climbs).toFixed(2) + ' to ' + Math.max(...climbs).toFixed(2) + ', ' + climbs.length + ' looks)', Math.min(...climbs) >= 1 && Math.max(...climbs) <= top + 1e-9);
  ok('D6 tape has no day (its own shelf, rule 271)', SP.theDay(FILE, 'tape', { tier: 'town', min: 900 }) === null);
  const D = FILE.the_day || {}, rows = ['open', 'stock', 'left_at_close', 'spread', 'climb'], bad = rows.filter(k => !D[k] || D[k].value === undefined || !D[k].source);
  ok('D7 every number of the day has a value and a source', bad.length === 0, bad.join(', '));
  console.log('=== THE STALL\'S DAY (data): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = MODE + ' ' + SHAPE;
(async () => {
  const d = await Dr.open({ profile: SHAPE, alpha: MODE === 'alpha', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const visit = async (min) => {
    await fr.evaluate((m) => { try { loopClose(); } catch (e) {} T.min = m; const n = 'Caravans', b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, min);
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === 'Caravans')).catch(() => false)) break; await P.waitForTimeout(500); }
    await P.waitForTimeout(1500);
    for (let t = 0; t < 4; t++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (xy) { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await P.touchscreen.tap(hb.x + xy.x * hb.width / iw[0], hb.y + xy.y * hb.height / iw[1]); }
      await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; }
    const r = await sf.evaluate(() => { const box = (good) => { const ln = document.querySelector('#sbody .stline[data-good="' + good + '"][data-n="1"]'); if (!ln) return null; const b = ln.querySelector('.sb.buy'); return { cap: b.querySelector('small').textContent, p: b.dataset.p, off: b.classList.contains('off') }; };
      const k = document.querySelector('#sbody p, .speak p, #sbody .say'); return { min: BohemiaSettlement.state.mapMin, food: box('food'), meds: box('meds'), rounds: box('rounds'), tape: box('tape'), keeper: (document.querySelector('#sbody') || {}).innerText.split('\n').slice(0, 3).join(' ') }; });
    const sel = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); if (b) b.click(); const st = document.getElementById('stallstrip'); return st ? st.textContent : null; });
    r.strip = sel;
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(800);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1500);
    return r;
  };
  try {
    await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function', null, { timeout: 300000 }); await P.waitForTimeout(4000);
    const dawn = await visit(361);
    ok('P1 ' + T + ': first light (' + dawn.min + '): food ' + JSON.stringify(dawn.food) + ', meds ' + JSON.stringify(dawn.meds) + ', nothing shut, nothing sold out',
      dawn.min === 361 && dawn.food && dawn.food.cap === 'BUY' && +dawn.food.p === 2 && dawn.meds && dawn.meds.cap === 'BUY' && dawn.rounds && dawn.rounds.cap === 'BUY');
    const late = await visit(19 * 60 + 30);
    ok('P2 ' + T + ': late (' + late.min + '): food ' + JSON.stringify(late.food) + ', the strip "' + String(late.strip).slice(0, 90) + '"',
      late.food && ((late.food.cap === 'BUY' && +late.food.p > +dawn.food.p && /left today/.test(late.strip)) || (late.food.cap === 'SOLD OUT' && late.food.off && /Sold out/.test(late.strip))));
    const night = await visit(23 * 60);
    ok('P3 ' + T + ': night (' + night.min + '): food ' + JSON.stringify(night.food) + ', meds ' + JSON.stringify(night.meds) + ', tape ' + JSON.stringify(night.tape) + '; the keeper "' + night.keeper.slice(0, 110) + '"',
      ['food', 'meds', 'rounds'].every(g => night[g] && night[g].cap === 'SHUT' && night[g].off) && night.tape && night.tape.cap === 'BUY' && !night.tape.off && /Shutters are down/.test(night.keeper));
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
  ok('P4 ' + T + ': no page error', e2.length === 0, e2.slice(0, 2).join(' | '));
  await d.close().catch(() => {});
  console.log('=== THE STALL\'S DAY (' + T + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
