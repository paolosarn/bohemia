#!/usr/bin/env node
/* ============================================================================
   WHERE IT SELLS BEST GATE (WORLD TWO [where it sells best], 10/26, rule 266(b) and (c), the map's legs).

   PAOLO 10/26: 'is there a way we can visually let people know from map mode... one of the more frustrating parts of my Battle
   Brothers experience, I didn't know off the bat which city has the best selling price of my goods.'
   Code: slices/bohemia_his_map.js (5); one marked line in RUN TWO's town screen (arrive() posts 'prices'). Record:
   records/BOHEMIA_WORLD_TWO_WHERE_IT_SELLS_BEST_10_26_26.md.

   THE STRANGER'S GAME (fog: true) on the live demo, phone and computer, through RUN THREE's start in a town:
     W1 standing in the first town, the map knows what its stall pays for every trade good, and each number is the stall's own
        (ECONOMY's tradeSell with that town's tier, its cards and what it thinks of him, read through the town screen's own door,
        BohemiaSettlement.tradeSell, the call its stall sells by)
     W2 walked to a second town (a tap on the town, the map's own walk): the map knows that one too, and nothing else
     W3 the marks for a good: every town he knows is marked with what it pays, best first (rank 1 the most), the best ringed;
        a town he has seen and never priced wears a question mark; a town under the static is not on his map
     W4 a price HEARD (the feed's call) for a town he has never been to marks it too, as heard, and an old one fades
     W5 a good off the stash's tap (null) takes the marks away
     W6 reopened in a new tab: what he knows is still known
     W7 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const settle = () => page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
  const known = () => fr.evaluate(() => Object.keys(BohemiaHisMap.state().prices || {}));
  const leave = async () => {
    const sf = settle(); if (!sf) return false;
    const lv = await sf.$('#leave'), bx = lv && await lv.boundingBox(); if (!bx) return false;
    if (prof === 'computer') await page.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); else await page.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2);
    await page.waitForTimeout(1500); return true;
  };
  /* the start: his squad, then the closest town's screen; the stall tells the map on arrival */
  for (let i = 0; i < 120; i++) { if ((await known().catch(() => [])).length) break; await page.waitForTimeout(500); }
  const k0 = await known();
  const first = k0[0];
  /* W1: the stall's own numbers, read in the town's screen with its own knobs */
  /* the town's own screen: the frame whose S.place is the first town (there may be more than one settlement frame loaded) */
  let own = null, ownErr = '';
  for (const f of page.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) {
    const r = await f.evaluate(() => { try { const B = window.BohemiaSettlement; if (!B || !B.tradeSell || !B.state || !B.state.place) return { err: 'no door' };
      const ids = ['charcoal', 'casino_linen', 'mountain_timber', 'copper_wire', 'turquoise', 'hides', 'coffee', 'salt', 'candles', 'pharmacy_stock', 'runway_cloth', 'pawn_gold'], g = {};
      ids.forEach(id => { const v = B.tradeSell(id); if (v != null) g[id] = v; });
      return { place: B.state.place.name, goods: g }; } catch (e) { return { err: String(e && e.message || e) }; } }).catch(e => ({ err: String(e.message).slice(0, 120) }));
    if (r && r.place === first) { own = r; break; } ownErr += (r && (r.err || r.place)) + ' | ';
  }
  const mine = first ? await fr.evaluate((n) => BohemiaHisMap.state().prices[n], first) : null;
  const same = own && mine && own.place === first && Object.keys(own.goods).length >= 10 && Object.keys(own.goods).every(id => mine.goods[id] === own.goods[id]);
  ok('W1 ' + prof + ': in the first town the map knows what its stall pays for every trade good, the stall\'s own numbers', !!same,
     first ? first + ': ' + (own ? Object.keys(own.goods).length + ' goods, ' + Object.keys(own.goods).filter(id => mine && mine.goods[id] === own.goods[id]).length + ' the same (salt ' + (mine && mine.goods.salt) + ', the stall says ' + own.goods.salt + ')' : 'no stall read: ' + ownErr) : 'nothing known');
  await leave();
  /* W2: walk to a second town by a tap on it */
  const second = await fr.evaluate((first) => { const bs = ctBases(); let best = null, bd = 1e9;
    for (const n in bs) { if (n === first) continue; const b = bs[n], dd = Math.max(Math.abs((b.x | 0) - city.x), Math.abs((b.y | 0) - city.y)); if (dd > 2 && dd < bd) { bd = dd; best = { name: n, x: b.x | 0, y: b.y | 0 }; } }
    if (best) { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); townTap(best); try { travelGoes(); } catch (e) {} } return best; }, first);
  for (let i = 0; i < 240; i++) { const k = await known(); if (second && k.indexOf(second.name) >= 0) break; await page.waitForTimeout(500); }
  const k1 = await known();
  ok('W2 ' + prof + ': walked to a second town, the map knows that one too and nothing else', !!second && k1.length === 2 && k1.indexOf(second.name) >= 0,
     (second ? second.name : 'no town') + '; known: ' + k1.join(', '));
  await leave();
  /* W3: the marks for a good, the whole valley on the glass */
  await fr.evaluate(() => { const zb = zoomBounds(), n = om.n; let best = null;
    for (let z = zb[0]; z <= 1; z *= 1.06) { setZoomAt(z); panX = 0; panY = 0; render(); const L = BohemiaHisMap.last();
      const inside = [[0, 0], [n, 0], [n, n], [0, n]].map(p => iso(p[0], p[1], L.ox, L.oy)).every(p => p.sx >= -2 && p.sx <= CVW + 2 && p.sy >= -2 && p.sy <= CVH + 2);
      if (inside) best = z; else if (best) break; }
    setZoomAt(best || zb[0]); render(); return null; });
  if (process.env.SELL_SHOTS) { try { await d.shot(path.join(process.env.SELL_SHOTS, prof + '_before.png')); } catch (e) {} }
  const marks = await fr.evaluate(() => {
    const R = BohemiaHisMap.sellMarks('salt'); render();
    const drew = BohemiaHisMap.last().drew.sell || [], bs = ctBases();
    const hiddenTowns = Object.keys(bs).filter(t => fogHides(bs[t].x | 0, bs[t].y | 0));
    return { R, drew, hiddenTowns, all: Object.keys(bs).length }; });
  if (process.env.SELL_SHOTS) { try { await d.shot(path.join(process.env.SELL_SHOTS, prof + '_marks.png')); } catch (e) {} }
  const kn = marks.R.filter(o => !o.unknown), unk = marks.R.filter(o => o.unknown);
  const ordered = kn.every((o, i) => i === 0 || kn[i - 1].v >= o.v) && kn.length && kn[0].rank === 1;
  const drewKnown = kn.every(o => marks.drew.some(m => m.name === o.name && m.v === o.v));
  const ringed = marks.drew.some(m => m.rank === 1);
  const noHidden = marks.R.every(o => marks.hiddenTowns.indexOf(o.name) < 0 || !o.unknown);
  ok('W3 ' + prof + ': the marks for SALT: every town he knows with what it pays, best first, the best ringed; seen and never priced a question mark; under the static nothing',
     kn.length === 2 && ordered && drewKnown && ringed && noHidden && unk.every(o => marks.drew.some(m => m.name === o.name && m.unknown)),
     kn.map(o => o.rank + '. ' + o.name + ' ' + o.v).join(', ') + ' | ? ' + unk.map(o => o.name).join(', ') + ' | not on his map: ' + marks.hiddenTowns.length + ' of ' + marks.all);
  /* W4: a price heard for a town he has never been to, twenty days old */
  const heard = await fr.evaluate((k) => { const bs = ctBases(), t = Object.keys(bs).filter(n => k.indexOf(n) < 0)[0];
    const today = loopDay(); BohemiaHisMap.priceHeard(t, 'salt', 999, today - 20); render();
    const d1 = (BohemiaHisMap.last().drew.sell || []).filter(m => m.name === t)[0] || null, R = BohemiaHisMap.sellRank('salt');
    BohemiaHisMap.priceHeard(t, 'salt', 999, today); render();
    const d2 = (BohemiaHisMap.last().drew.sell || []).filter(m => m.name === t)[0] || null;
    return { t, d1, d2, top: R[0] }; }, k1);
  ok('W4 ' + prof + ': a price heard for a town never visited marks it as heard, and an old one fades', !!heard.d1 && heard.d1.src === 'heard' && heard.top.name === heard.t && heard.d1.alpha < heard.d2.alpha,
     heard.t + ': ' + JSON.stringify(heard.d1) + ' twenty days old, ' + JSON.stringify(heard.d2) + ' today; best now ' + (heard.top && heard.top.name));
  /* W5: off */
  const off = await fr.evaluate(() => { BohemiaHisMap.sellMarks(null); render(); return BohemiaHisMap.last().drew.sell || null; });
  ok('W5 ' + prof + ': the stash lets go (null) and the marks are gone', !off, JSON.stringify(off));
  /* W6: reopened */
  const e = await open({ again: d, fog: true });
  for (let i = 0; i < 60; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && typeof city !== 'undefined').catch(() => false)) break; }
  await e.page.waitForTimeout(2500);
  const k2 = await e.fr.evaluate(() => Object.keys(BohemiaHisMap.state().prices || {}));
  ok('W6 ' + prof + ': reopened, what he knows is still known', k1.every(n => k2.indexOf(n) >= 0), k2.join(', '));
  ok('W7 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  await e.close().catch(() => {});
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nWHERE IT SELLS BEST: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
