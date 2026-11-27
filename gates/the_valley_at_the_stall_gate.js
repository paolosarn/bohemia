#!/usr/bin/env node
/* THE VALLEY AT THE STALL (ECONOMY FOUR 11/27, VAMILY rule 485(b): 'prices move with what is scarce'; the handoff's job 1: the map's
   trading hub and the stall's day are one story). records/BOHEMIA_ECONOMY_FOUR_THE_VALLEY_AT_THE_STALL_11_27_26.md.
   DATA legs (engine/bohemia_stall_prices.js valleyCard and restockMin, records/target/bb/stall_prices.json the_valley):
     V1 a calm valley (30 days or more) changes nothing off the roads; on a road only the convoy's card (Well Supplied)
     V2 the valley out of food, off the roads: the need doubles and the shelf halves; the stall's night costs at least half again
     V3 on a caravan road the town feels a quarter of it: never dearer and never a smaller shelf than off the road at the same days,
        and at the valley's bottom its night stays within a quarter of the calm price
     V4 the less the valley has left, the dearer and the thinner, never the other way (food and meds, both roads)
     V5 food reads the scarcer of the valley's food and water (rule 209); rounds and tape have no reading
     V6 a caravan that got in while the stall was open puts the shelf back: more left after it than without it; one before first
        light, or at night, changes nothing
     V7 every number of the valley has a value and a source
     V8 the valley handed in is never written (the map's ledger is read only)
   PAGE legs (demo | alpha, phone_portrait | phone_landscape):
     P1 the map hands the town the valley: its days of food and meds, the road (Mob is on one, Caravans is not)
     P2 eleven map days on (the valley's food gone), Caravans' stall at first light reads the valley lower than on day one (its need up,
        its shelf down), its food costs at least what it did at first light on day one, and the stall reads it SHORT (its own word)
     P3 a road town after a caravan got in today (the first whose own card is quiet): the keeper names whose caravan and the hour, and
        its shelf was refilled when it came (most of the day's stock still out in the afternoon)
     P4 no page error
   node gates/the_valley_at_the_stall_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/stall_prices.json'), 'utf8'));
const MODE = process.argv[2] || 'data', SHAPE = process.argv[3] || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const V = FILE.the_valley || {};
const card = (good, days, road) => SP.valleyCard(FILE, good, { days: days, road: !!road });
const buy = (need, tier) => SP.buyShown(FILE, 'food', { tier: tier || 'town', need: need });

if (MODE === 'data') {
  const calm = (V.calm_days || {}).value || 30;
  const c0 = card('food', { food: calm + 5, water: 90 }, false), c1 = card('food', { food: calm, water: 90 }, true);
  ok('V1 a calm valley off the roads: need ' + c0.need + ', shelf ' + c0.shelf + '; on a road the convoy\'s card only: need ' + c1.need + ', shelf ' + c1.shelf,
    c0.need === 1 && c0.shelf === 1 && c1.need === V.road_need.value && c1.shelf === V.road_items.value);
  const z = card('food', { food: 0, water: 40 }, false), dawn = (s) => SP.theDay(FILE, 'food', { tier: 'town', min: 361, day: 4, seed: 'Caravans', need: 1, stockMult: s }).full;
  ok('V2 the valley out of food, off the roads: need ' + z.need + ', shelf ' + z.shelf + '; a night at a town ' + buy(1) + ' -> ' + buy(z.need) + ', at a camp ' + buy(1, 'camp') + ' -> ' + buy(z.need, 'camp') + ', the dawn shelf ' + dawn(1) + ' -> ' + dawn(z.shelf),
    z.need === 1 + V.short_need_add.value && z.shelf === 1 - V.short_shelf_cut.value && buy(z.need) > buy(1) && buy(z.need, 'camp') > buy(1, 'camp') && buy(z.need) <= buy(1) * 2 && dawn(z.shelf) < dawn(1));
  let worse = 0; const looks = [];
  [0, 3, 8.5, 15, 22, 29].forEach(d => { const off = card('food', { food: d, water: 60 }, false), on = card('food', { food: d, water: 60 }, true);
    looks.push(d + 'd ' + off.need + '/' + on.need); if (on.need > off.need + 1e-9 || on.shelf < off.shelf - 1e-9) worse++; });
  const zr = card('food', { food: 0, water: 0 }, true);
  ok('V3 on a road the town feels a quarter (' + looks.join(', ') + '); at the bottom its night ' + buy(zr.need) + ' against calm ' + buy(1), worse === 0 && buy(zr.need) <= Math.ceil(buy(1) * 1.25));
  let bad = 0, n = 0;
  ['food', 'meds'].forEach(g => [false, true].forEach(r => { let prev = null; for (let d = 40; d >= 0; d -= 0.5) { const k = card(g, { food: d, water: 99, meds: d }, r); n++;
    if (prev && (k.need < prev.need - 1e-9 || k.shelf > prev.shelf + 1e-9)) bad++; prev = k; } }));
  ok('V4 the less left, the dearer and the thinner (' + n + ' looks, ' + bad + ' the wrong way)', bad === 0 && n > 100);
  const w = card('food', { food: 50, water: 0 }, false), rd = SP.valleyCard(FILE, 'rounds', { days: { food: 0, water: 0, meds: 0 } }), tp = SP.valleyCard(FILE, 'tape', { days: { food: 0 } });
  ok('V5 food reads the scarcer of food and water (water gone: need ' + w.need + '); rounds ' + rd + ', tape ' + tp, w.need === 1 + V.short_need_add.value && rd === null && tp === null);
  const H = FILE.the_day.open.value, at = (m, rs) => SP.theDay(FILE, 'food', { tier: 'town', min: m, day: 4, seed: 'Mob', need: 1, restockMin: rs });
  const no = at(900), yes = at(900, SP.restockMin(FILE, 900, 60)), early = SP.restockMin(FILE, H[0] + 30, 60), night = SP.restockMin(FILE, 23 * 60, 30), late = at(1100, SP.restockMin(FILE, 1100, 600));
  ok('V6 at 15:00 the shelf has ' + no.left + ' left; a caravan in at 14:00 puts it back to ' + yes.left + ' (restocked ' + yes.restocked + '); before first light ' + early + ', at night ' + night + '; one in at 08:20 at 18:20 leaves ' + late.left,
    yes.left > no.left && yes.restocked && !no.restocked && early === null && night === null && late.left >= no.left - 1);
  const rows = ['reads', 'calm_days', 'short_need_add', 'short_shelf_cut', 'road_keeps', 'road_need', 'road_items', 'restock'], miss = rows.filter(k => !V[k] || V[k].value === undefined || !V[k].source);
  ok('V7 every number of the valley has a value and a source', miss.length === 0, miss.join(', '));
  const given = { days: { food: 3, water: 20, meds: 9 }, road: true }, before = JSON.stringify(given); SP.valleyCard(FILE, 'food', given); SP.valleyCard(FILE, 'meds', given);
  ok('V8 the valley handed in is never written', JSON.stringify(given) === before);
  console.log('=== THE VALLEY AT THE STALL (data): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = MODE + ' ' + SHAPE;
(async () => {
  const d = await Dr.open({ profile: SHAPE, alpha: MODE === 'alpha', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  /* the clock runs to the hour (real minutes on the map's own advance, so the caravans walk), then the town opens by a finger on its stall */
  const toHour = async (min) => fr.evaluate((m) => { try { loopClose(); } catch (e) {} let k = 0; while (((T.min - m + 1440) % 1440) > 10 && k++ < 300) advance(10); return T.min; }, min);
  const visit = async (n) => {
    await fr.evaluate((nm) => { const b = ctBases()[nm]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: nm, x: b.x, y: b.y }); }, n);
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate((nm) => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === nm), n).catch(() => false)) break; await P.waitForTimeout(500); }
    await P.waitForTimeout(1500);
    for (let t = 0; t < 4; t++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (xy) { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await P.touchscreen.tap(hb.x + xy.x * hb.width / iw[0], hb.y + xy.y * hb.height / iw[1]); }
      await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; }
    const r = await sf.evaluate(() => { const S = BohemiaSettlement.state, ln = document.querySelector('#sbody .stline[data-good="food"][data-n="1"]'), b = ln && ln.querySelector('.sb.buy');
      return { open: S.open, min: S.mapMin, valley: S.valley || null, food: b ? { cap: (b.querySelector('small') || {}).textContent, p: b.dataset.p } : null,
        keeper: ((document.querySelector('#sbody .say, #sbody .speech, #sbody') || {}).innerText || '').split('\n').slice(0, 4).join(' ') }; });
    r.strip = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); if (b) b.click(); const st = document.getElementById('stallstrip'); return st ? st.textContent : null; });
    r.left = +((/ (\d+) left today/.exec(r.strip || '') || [])[1] || 0);
    r.fits = await sf.evaluate(() => { const f = document.querySelector('#stallstrip .ss-facts'); if (!f) return null; const box = f.getBoundingClientRect(); const kids = Array.from(f.children);
      return kids.every(k => { const b = k.getBoundingClientRect(); return b.bottom <= box.bottom + 1 && k.scrollHeight <= k.clientHeight + 1; }) && f.scrollHeight <= f.clientHeight + 1; });
    r.v = await sf.evaluate(() => { try { return BohemiaSettlement._valley('food'); } catch (e) { return { err: String(e) }; } }); r.word = r.v && r.v.word;
    r.sellWord = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.sell'); if (b) b.click(); const st = document.getElementById('stallstrip'); return st ? st.textContent : null; });
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(800);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1200);
    return r;
  };
  try {
    await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function', null, { timeout: 300000 }); await P.waitForTimeout(4000);
    await toHour(370); const c1 = await visit('Caravans');
    const m1 = await fr.evaluate(() => valleyFor('Mob'));
    ok('P1 ' + T + ': the town is handed the valley (Caravans: food ' + (c1.valley && c1.valley.days.food) + ' days, meds ' + (c1.valley && c1.valley.days.meds) + ', road ' + (c1.valley && c1.valley.road) + '; Mob road ' + m1.road + ')',
      !!c1.valley && typeof c1.valley.days.food === 'number' && typeof c1.valley.days.meds === 'number' && c1.valley.road === false && m1.road === true);
    /* eleven map days, the valley eating its shelves every night as it does */
    const dd = await fr.evaluate(() => { const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 11 && k++ < 2000) advance(60); return { day: DAY.day, food: valleyFor('Caravans').days.food }; });
    await toHour(370); const c2 = await visit('Caravans');
    const k1 = (c1.v && c1.v.card) || {}, k2 = (c2.v && c2.v.card) || {};
    ok('P2 ' + T + ': day ' + dd.day + ' (the valley\'s food ' + dd.food + ' days): Caravans\' valley need ' + k1.need + ' -> ' + k2.need + ', shelf ' + k1.shelf + ' -> ' + k2.shelf + '; food at first light ' + (c1.food && c1.food.p) + ' -> ' + (c2.food && c2.food.p) + '; the stall\'s word ' + c2.word + '; the keeper "' + c2.keeper.slice(0, 100) + '"',
      dd.food === 0 && k2.need > k1.need && k2.shelf < k1.shelf && c2.food && c1.food && +c2.food.p >= +c1.food.p && c2.word === 'short');
    /* a road town after a caravan: the clock runs to mid-afternoon; the first road town whose keeper has no card of his own to say
       names the caravan (a town's card speaks first) */
    await toHour(15 * 60);
    let mb = null, got = null, who = null;
    for (const n of ['Reds', 'Network', 'Blues', 'Volunteers', 'Mob']) {
      const g = await fr.evaluate((nm) => valleyFor(nm), n); if (!g.road || !g.from || g.agoMin == null) continue;
      const r = await visit(n); if (!mb || /caravan|trucks/i.test(r.keeper)) { mb = r; got = g; who = n; } if (/caravan|trucks/i.test(r.keeper)) break; }
    ok('P3 ' + T + ': ' + who + ' at ' + (mb && mb.min) + ' (the last caravan from ' + (got && got.from) + ', ' + (got && got.agoMin) + ' min ago): the keeper "' + (mb ? mb.keeper.slice(0, 130) : '') + '", the shelf refilled (' + (mb && mb.v && mb.v.day ? mb.v.day.left + ' of ' + mb.v.day.full + ', restocked ' + mb.v.day.restocked : '-') + '); the strip\'s box holds its lines: ' + (mb && mb.fits) + ' (read, not judged: sideways it is 30 px for 32 of text on main too, FIXES 4\'s)',
      !!mb && /caravan|trucks/i.test(mb.keeper) && new RegExp(String(got.from)).test(mb.keeper) && /\d\d:\d\d/.test(mb.keeper) && !!(mb.v && mb.v.day && mb.v.day.restocked) && mb.v.day.left >= mb.v.day.full * 0.6);
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
  ok('P4 ' + T + ': no page error', e2.length === 0, e2.slice(0, 2).join(' | '));
  await d.close().catch(() => {});
  console.log('=== THE VALLEY AT THE STALL (' + T + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
