#!/usr/bin/env node
/* ============================================================================
   TRADE GOODS CARRIED GATE (ECONOMY [trade goods carried], 11/7/26; rule 425(b), asks 196 and 197, rules 265(b) and 266).

   PAOLO 10/26: 'in battle Brothers, you can buy goods from whatever type of settlement it is... luxury goods that you can buy
   just to move them around to different parts of the city and sell them off for higher income... I didn't know off the bat
   which city has the best selling price of my goods'; 'even if there's just a stall at a settlement, I can still sell at it...
   you'll probably make less money'.

   MEASURED BEFORE: the twelve goods and Battle Brothers' prices sat in records/target/bb/stall_prices.json since ECONOMY's
   Day 83 and the map marked what a town pays (WORLD TWO), but no stall sold a good: nothing rode in the stash, nothing sold.

   THE DATA (no browser; the file a modder edits, read through the engine the stall reads):
     D1 every good: a name, a unit, a worth, a maker that is a town on the map, an icon on disk that is its pack tile byte for
        byte (no pixel changed), a slot rule of one
     D2 Battle Brothers' rule at every size: the maker sells at the plain price and buys back for little (under a fifth); every
        town that does not make it pays more than the maker charges at a town or a fortress; a small place pays no more than a
        large one; every stall pays at least a battery (never refuses); no stall pays as much as it charges
     D3 one unit is one piece in one stash slot, nobody wears it (kind 'trade')
     M  PLANTED FAILS: a maker that pays 110 in 100 for its own good, a camp that pays more than a fortress, a stall that pays
        nothing, an icon that is not on disk, a good whose maker is no town: each one turns D1 or D2 red
   THE LIVE DEMO, phone and computer (the stall's real boxes, real taps):
     L1 at the maker (the Trades' camp: copper wire): the stall's goods line says MADE HERE, the week's batch left, its BUY box the
        engine's price with the town's own knobs, its SELL box under a fifth of it
     L2 a double tap buys one: the batteries go down by the box's price, one piece rides in the stash (one slot), the batch one less,
        and the SELL box turns BACK at the price paid (rule 248, undo)
     L3 the batch gone: the BUY box is off and a double tap buys nothing
     L4 at a fortress that does not make it (the Mob's): NOT MADE HERE, the SELL box the engine's price and more than he paid; a
        double tap sells (batteries up by the box), the piece leaves the stash; it sits on their shelf: BUY turns BACK at the same
        price, and a double tap buys it back for exactly that
     L5 a camp that does not make it (the Homeless') still buys it (a battery or more) and pays less than a fortress would with
        the same knobs; a calm town for L4 and L5 (no cards)
     L6 every shop buys it too: a shop's bag in that fortress prices the good as the stall does (when the place has a shop)
     L7 the crew screen: the good wears its pack tile; one tap lights the map's marks for it, best first, and its line names the
        best town he knows at the map's own price; a right click or the second tap never puts it on a man; the second tap closes
        the screen onto the map and the map draws the marks
     L8 selling the last one takes the marks away
     L9 PLANTED ON THE LIVE PAGE: the stall with the engine's tradeItem taken away shows no goods and L1's check reads red
     L10 nothing threw
   node gates/trade_goods_carried_gate.js [phone_portrait|computer|data]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const B = require(path.join(ROOT, 'engine', 'bohemia_stall_prices.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null && w !== '' ? '  [' + w + ']' : '')); };
const FILE = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/stall_prices.json'), 'utf8'));
const TOWNS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Custom', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades', 'Volunteers'];
const TIERS = ['camp', 'town', 'fortress'];

/* ---------------- the data: every fault a file can hold, so a planted one is caught by the same words ---------------- */
function d1Faults(f) {
  const out = [], T = f.trade || {}, G = T.goods || [];
  if (!G.length) out.push('no goods');
  if (!(T.slot && T.slot.value === 1)) out.push('slot is not one');
  G.forEach(g => {
    if (!g.id || !g.name || !g.unit || !(g.worth > 0)) out.push(g.id + ': name, unit or worth missing');
    if (!(g.made_by || []).length || !(g.made_by || []).every(m => TOWNS.indexOf(m) >= 0)) out.push(g.id + ': maker ' + JSON.stringify(g.made_by) + ' is no town on the map');
    const ic = g.icon && path.join(ROOT, 'slices', g.icon), src = String(g.icon_source || '').split(' ')[0];
    if (!ic || !fs.existsSync(ic)) out.push(g.id + ': icon ' + g.icon + ' not on disk');
    else if (!src || !fs.existsSync(path.join(ROOT, src)) || !fs.readFileSync(ic).equals(fs.readFileSync(path.join(ROOT, src)))) out.push(g.id + ': icon is not its pack tile byte for byte');
  });
  return out;
}
function d2Faults(f) {
  const out = [], G = (f.trade && f.trade.goods) || [];
  G.forEach(g => {
    const maker = g.made_by[0];
    TIERS.forEach(t => {
      const mb = B.tradeBuy(f, g.id, { place: maker, tier: t }), ms = B.tradeSell(f, g.id, { place: maker, tier: t });
      if (!(ms < mb / 5 + 1)) out.push(g.id + ' at its maker (' + t + '): buys back ' + ms + ' of ' + mb + ', not little');
      if (!(ms >= 1)) out.push(g.id + ' at its maker (' + t + '): pays nothing');
      const away = 'Volunteers', ab = B.tradeBuy(f, g.id, { place: away, tier: t }), as = B.tradeSell(f, g.id, { place: away, tier: t });
      if (!(as >= 1)) out.push(g.id + ' away (' + t + '): pays nothing, a refusal');
      if (!(as < ab || (ab <= 1 && as === ab))) out.push(g.id + ' away (' + t + '): pays ' + as + ' and charges ' + ab + ', a loop at one stall');
    });
    const mbuy = B.tradeBuy(f, g.id, { place: maker, tier: 'town' });
    ['town', 'fortress'].forEach(t => { const v = B.tradeSell(f, g.id, { place: 'Volunteers', tier: t }); if (!(v > mbuy - 1)) out.push(g.id + ': a ' + t + ' that does not make it pays ' + v + ', under the maker town\'s ' + mbuy); });
    const c = B.tradeSell(f, g.id, { place: 'Volunteers', tier: 'camp' }), tw = B.tradeSell(f, g.id, { place: 'Volunteers', tier: 'town' }), fo = B.tradeSell(f, g.id, { place: 'Volunteers', tier: 'fortress' });
    if (!(c <= tw && tw <= fo && c < fo)) out.push(g.id + ': a small place does not pay less (' + c + '/' + tw + '/' + fo + ')');
  });
  /* the floor is the stall's: with every knob at its worst a good still brings a battery */
  G.forEach(g => { const v = B.tradeSell(f, g.id, { place: g.made_by[0], tier: 'camp', sellMult: 0.5 }); if (!(v >= 1)) out.push(g.id + ': a bad day at its maker pays ' + v); });
  return out;
}
function data() {
  console.log('\n-- the data (records/target/bb/stall_prices.json through engine/bohemia_stall_prices.js) --');
  const f = FILE(), a = d1Faults(f), b = d2Faults(f);
  ok('D1 every good: name, unit, worth, a maker on the map, its pack tile on disk byte for byte, one slot', !a.length, a.slice(0, 3).join('; ') || f.trade.goods.length + ' goods');
  ok('D2 Battle Brothers\' rule at every size: the maker buys back little, the rest pay more than it charges, a small place less, never nothing, never a loop', !b.length, b.slice(0, 3).join('; '));
  const it = B.tradeItem(f, 'salt', { place: 'Blues', paid: 34, day: 2 });
  ok('D3 one unit is one piece (kind trade), nobody wears it, it names where and for what', !!it && it.kind === 'trade' && it.trade === 'salt' && it.from === 'Blues' && it.paid === 34 && !!it.icon, JSON.stringify(it && { id: it.id, kind: it.kind, name: it.name }));
  /* M: the planted fails */
  const m1 = FILE(); m1.trade.made_here.value.sell = 1.1;
  const m2 = FILE(); m2.size_mult.value = Object.assign({}, m2.size_mult.value, { camp: 1.3 });
  const m3 = FILE(); m3.trade.sold_floor.value = 0; m3.trade.made_here.value.sell = 0.01;
  const m4 = FILE(); m4.trade.goods[3].icon = 'market_icons/g_nothing_here.png';
  const m5 = FILE(); m5.trade.goods[0].made_by = ['Atlantis'];
  const caught = [d2Faults(m1).length > 0, d2Faults(m2).length > 0, d2Faults(m3).length > 0, d1Faults(m4).length > 0, d1Faults(m5).length > 0];
  ok('M  planted: a maker paying 110, a camp paying more than a fortress, a stall paying nothing, a missing icon, a maker that is no town: every one red', caught.every(Boolean), caught.join(','));
}

/* ---------------- the live demo ---------------- */
const drive = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js'));
const { leaveTown } = require(path.join(ROOT, 'tools', 'bohemia_leave_the_town.js'));
async function town(d, re) {
  const P = d.page;
  await d.fr.evaluate((re) => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); const bs = ctBases(), n = Object.keys(bs).find(k => new RegExp(re, 'i').test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, re);
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((re) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && new RegExp(re, 'i').test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, re).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
async function openIt(sf, P, k, mouse) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
  const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return null;
  const fb = await (await sf.frameElement()).boundingBox();
  if (mouse) await P.mouse.click(fb.x + w.x, fb.y + w.y); else await P.touchscreen.tap(fb.x + w.x, fb.y + w.y);
  await P.waitForTimeout(1300);
  await sf.waitForFunction((k) => BohemiaSettlement.state.open === k && (k !== 'stall' || !!document.querySelector('#stallstrip')), k, { timeout: 8000 }).catch(() => {});
  return sf.evaluate(() => BohemiaSettlement.state.open);
}
async function tapEl(sf, P, sel, n, mouse) {
  const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel);
  if (!r) return false; const fb = await (await sf.frameElement()).boundingBox(), x = fb.x + r.x, y = fb.y + r.y;
  if (mouse) { if (n === 2) await P.mouse.dblclick(x, y); else await P.mouse.click(x, y); }
  else for (let i = 0; i < (n || 1); i++) { await P.touchscreen.tap(x, y); if (i + 1 < (n || 1)) await P.waitForTimeout(120); }
  await P.waitForTimeout(500); return true;
}
const LINE = (id) => '#stallgoods .tgline[data-good=' + id + ']';
const readGood = (sf, id) => sf.evaluate((id) => {
  const r = BohemiaSettlement.trade().filter(x => x.id === id)[0] || null, ln = document.querySelector('#stallgoods .tgline[data-good=' + id + ']');
  const box = (side) => { const b = ln && ln.querySelector('.sb[data-side=' + side + ']'); return b ? { cap: (b.querySelector('small') || {}).textContent, n: (b.querySelector('.sp') || {}).textContent, off: b.classList.contains('off'), back: b.classList.contains('back') } : null; };
  const bag = (() => { try { return JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]'); } catch (e) { return []; } })();
  const F = window.BohemiaStallPrices, file = BohemiaSettlement.tradeFile ? BohemiaSettlement.tradeFile() : null;
  return { row: r, line: ln ? ln.textContent : null, buyBox: box('buy'), sellBox: box('sell'), bats: BohemiaSettlement.bats(), bag: bag.length, goods: bag.filter(x => x && x.trade === id).length,
    eng: r && F && file ? { buy: F.tradeBuy(file, id, r.ctx), sell: F.tradeSell(file, id, r.ctx), fort: F.tradeSell(file, id, Object.assign({}, r.ctx, { tier: 'fortress' })), stock: F.tradeStock(file, id, r.ctx) } : null };
}, id);

async function live(prof) {
  console.log('\n-- ' + prof + ' --');
  const mouse = prof === 'computer', G = 'copper_wire';
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    await P.waitForTimeout(3000);
    await P.evaluate(() => { try { localStorage.removeItem('bohemia.trade.bought.v1'); } catch (e) {} });
    /* L1 at the maker */
    let sf = await town(d, '^Trades$'); if (!sf) { ok('L1 ' + prof + ': the Trades\' camp through the map\'s door', false); return; }
    await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(500);
    await openIt(sf, P, 'stall', mouse);
    const a = await readGood(sf, G);
    ok('L1 ' + prof + ': the maker\'s stall shows its good MADE HERE, the batch left, BUY the engine\'s price, SELL under a fifth', !!a.row && a.row.made && /MADE HERE/.test(a.line) && a.row.left === a.eng.stock && a.row.left >= 1 && a.buyBox.n === String(a.eng.buy) && a.row.buy.p === a.eng.buy && a.row.sell.p < a.row.buy.p / 5 + 1,
       a.row ? 'left ' + a.row.left + ' of ' + a.eng.stock + ', BUY ' + a.buyBox.n + ' (engine ' + a.eng.buy + '), SELL ' + a.row.sell.p : 'no line: ' + a.line);
    /* L2 a double tap buys one */
    await tapEl(sf, P, LINE(G) + ' .sb.buy', 2, mouse);
    const b = await readGood(sf, G);
    ok('L2 ' + prof + ': a double tap buys one: batteries -' + a.row.buy.p + ', one piece in the stash, the batch one less, SELL turns BACK at the price', b.bats === a.bats - a.row.buy.p && b.goods === a.goods + 1 && b.bag === a.bag + 1 && b.row.left === a.row.left - 1 && b.row.sell.back && b.row.sell.p === a.row.buy.p,
       a.bats + ' -> ' + b.bats + ', goods ' + a.goods + ' -> ' + b.goods + ', left ' + b.row.left + ', sell ' + JSON.stringify(b.row.sell));
    const paid = a.row.buy.p;
    /* L3 the batch gone (a camp makes one a week) */
    while ((await readGood(sf, G)).row.left > 0) { await tapEl(sf, P, LINE(G) + ' .sb.buy', 2, mouse); }
    const c0 = await readGood(sf, G); await tapEl(sf, P, LINE(G) + ' .sb.buy', 2, mouse); const c1 = await readGood(sf, G);
    ok('L3 ' + prof + ': the week\'s batch gone, BUY is off and a double tap buys nothing', c0.row.left === 0 && c0.buyBox.off && c1.bats === c0.bats && c1.goods === c0.goods, 'left 0, box ' + JSON.stringify(c0.buyBox) + ', batteries ' + c0.bats + ' -> ' + c1.bats);
    const carried = c1.goods;
    /* L4 at a fortress that does not make it */
    sf = await town(d, '^Mob$'); await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(500);
    await openIt(sf, P, 'stall', mouse);
    const e0 = await readGood(sf, G);
    const showOk = !!e0.row && !e0.row.made && /NOT MADE HERE/.test(e0.line) && e0.sellBox.n === '+' + e0.eng.sell && e0.row.sell.p > paid && !e0.sellBox.off;
    await tapEl(sf, P, LINE(G) + ' .sb.sell', 2, mouse);
    const e1 = await readGood(sf, G);
    const soldOk = e1.bats === e0.bats + e0.row.sell.p && e1.goods === e0.goods - 1 && e1.row.buy.back && e1.row.buy.p === e0.row.sell.p;
    await tapEl(sf, P, LINE(G) + ' .sb.buy', 2, mouse);
    const e2 = await readGood(sf, G);
    ok('L4 ' + prof + ': the Mob pays more than he paid (' + paid + '); a double tap sells, it sits on their shelf, BACK buys it back for exactly that', showOk && soldOk && e2.bats === e0.bats && e2.goods === e0.goods,
       'sells +' + e0.row.sell.p + ' (engine ' + e0.eng.sell + '), batteries ' + e0.bats + ' -> ' + e1.bats + ' -> ' + e2.bats + ', carried ' + e0.goods + ' -> ' + e1.goods + ' -> ' + e2.goods);
    /* L6 every shop buys it: a shop's bag here prices it as the stall does */
    let shopSeen = null;
    for (const k of ['arms', 'smith', 'armourer']) {
      const has = await sf.evaluate(k => !!BohemiaSettlement.where(k), k); if (!has) continue;
      await openIt(sf, P, k, mouse);
      shopSeen = await sf.evaluate(() => { const t = [...document.querySelectorAll('#baggrid .slot')].find(x => x.__it && x.__it.trade); return t ? { k: BohemiaSettlement.state.open, n: (t.querySelector('em') || {}).textContent, pk: !!t.querySelector('img.pk[src*="market_icons/g_"]') } : { k: BohemiaSettlement.state.open, none: true }; });
      break;
    }
    if (shopSeen) ok('L6 ' + prof + ': the ' + shopSeen.k + '\'s bag shows the good on its pack tile at the stall\'s price', !shopSeen.none && shopSeen.pk && shopSeen.n === '+' + e0.row.sell.p, JSON.stringify(shopSeen));
    else console.log('  --   L6 ' + prof + ': the Mob has no shop this game; the shops\' bag is checked where one stands');
    /* L5 a camp that does not make it */
    sf = await town(d, '^Homeless$'); await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P.waitForTimeout(500);
    await openIt(sf, P, 'stall', mouse);
    const h = await readGood(sf, G);
    ok('L5 ' + prof + ': the Homeless\' camp still buys it, a battery or more, and less than a fortress would with the same knobs', !!h.row && !h.row.made && h.row.sell.p >= 1 && h.sellBox.n === '+' + h.eng.sell && h.row.sell.p < h.eng.fort && !h.sellBox.off,
       h.row ? 'camp +' + h.row.sell.p + ', a fortress +' + h.eng.fort : 'no line');
    /* L7 the crew screen and the map */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
    await leaveTown(P, sf, { ms: 6000, mouse }); await P.waitForTimeout(2500);
    await d.fr.evaluate(() => BohemiaMaterials.ten.crewDoor());
    const rf = await (await d.fr.waitForSelector('#crewdoor iframe', { timeout: 30000 })).contentFrame();
    await rf.waitForFunction(() => document.querySelectorAll('#bag [data-bag]').length > 0, null, { timeout: 15000 }).catch(() => {});
    await P.waitForTimeout(1500);
    const where = () => rf.evaluate(() => { const im = document.querySelector('#bag [data-bag] img.pk[src*="market_icons/g_copper_wire"]'); if (!im) return null; const el = im.closest('[data-bag]'); el.scrollIntoView({ block: 'nearest' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, loaded: im.complete && im.naturalWidth > 0 }; });
    const fb = await (await rf.frameElement()).boundingBox(), t0 = await where();
    const gear0 = await rf.evaluate(() => JSON.stringify(BohemiaRosterScreen && BohemiaRosterScreen.state ? BohemiaRosterScreen.state.crew.map(m => m.gear) : null)).catch(() => null);
    if (t0) { if (mouse) await P.mouse.click(fb.x + t0.x, fb.y + t0.y); else await P.touchscreen.tap(fb.x + t0.x, fb.y + t0.y); }
    await P.waitForTimeout(800);
    const tp = await rf.evaluate(() => ({ t: window.__GOOD_TAPPED || null, said: (document.getElementById('said') || {}).textContent || '' }));
    const msel = await d.fr.evaluate(() => ({ s: window.__HIS_MAP_SELL || null, rank: BohemiaHisMap.sellRank('copper_wire') }));
    const best = (msel.rank || []).filter(o => !o.unknown)[0];
    const sorted = (msel.rank || []).filter(o => !o.unknown).every((o, i, A) => !i || A[i - 1].v >= o.v);
    ok('L7 ' + prof + ': the good wears its pack tile; one tap lights the map for it, best first, and its line names the best town at the map\'s price',
       !!t0 && t0.loaded && !!tp.t && msel.s && msel.s.good === G && sorted && !!best && new RegExp(best.name.toUpperCase() + ' \\+' + best.v).test(tp.said),
       (t0 ? 'tile' : 'no tile') + '; best ' + (best ? best.name + ' ' + best.v : '-') + '; said: ' + tp.said.slice(0, 90));
    if (mouse) { await P.mouse.click(fb.x + t0.x, fb.y + t0.y, { button: 'right' }); await P.waitForTimeout(800); }
    else { await P.touchscreen.tap(fb.x + t0.x, fb.y + t0.y); await P.waitForTimeout(800); }
    await P.waitForTimeout(2200);
    const gone = await d.fr.evaluate(() => !document.querySelector('#crewdoor'));
    const gear1 = gone ? null : await rf.evaluate(() => JSON.stringify(BohemiaRosterScreen && BohemiaRosterScreen.state ? BohemiaRosterScreen.state.crew.map(m => m.gear) : null)).catch(() => null);
    await P.waitForTimeout(800);
    const drew = await d.fr.evaluate(() => { const L = BohemiaHisMap.last(); return L && L.drew && L.drew.sell || null; });
    const bagNow = await P.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').filter(x => x && x.trade).length; } catch (e) { return -1; } });
    ok('L7 ' + prof + ': the ' + (mouse ? 'right click' : 'second tap') + ' puts it on nobody and closes the screen onto the map, the towns marked', gone && (gear1 == null || gear1 === gear0) && bagNow === carried && !!drew && drew.some(o => o.rank === 1),
       'closed ' + gone + ', carried ' + bagNow + ', marks ' + JSON.stringify((drew || []).slice(0, 3)));
    /* L8 selling the last one takes the marks away */
    sf = await town(d, '^Mob$'); await openIt(sf, P, 'stall', mouse);
    for (let i = 0; i < 6 && (await readGood(sf, G)).goods > 0; i++) await tapEl(sf, P, LINE(G) + ' .sb.sell', 2, mouse);
    const z = await readGood(sf, G), ms = await d.fr.evaluate(() => window.__HIS_MAP_SELL || null);
    ok('L8 ' + prof + ': the last one sold, the map\'s marks for it are gone', z.goods === 0 && (!ms || ms.good == null), 'carried ' + z.goods + ', the map ' + JSON.stringify(ms));
    /* L9 planted on the live page: the engine without tradeItem, the stall reopened */
    sf = await town(d, '^Trades$'); await sf.evaluate(() => { window.__TI = BohemiaStallPrices.tradeItem; delete BohemiaStallPrices.tradeItem; });
    await openIt(sf, P, 'stall', mouse);
    const pl = await readGood(sf, G);
    const l1red = !(!!pl.row && pl.row.made && /MADE HERE/.test(pl.line || ''));
    await sf.evaluate(() => { BohemiaStallPrices.tradeItem = window.__TI; });
    ok('L9 ' + prof + ': PLANTED, the stall without the engine\'s tradeItem shows no goods and L1\'s check reads red', l1red, 'line ' + JSON.stringify(pl.line));
    ok('L10 ' + prof + ': nothing threw', errs.length === 0 && !(d.errs || []).length, errs.concat(d.errs || []).slice(0, 2).join(' | '));
  } finally { await d.close().catch(() => {}); }
}

(async () => {
  const want = process.argv[2];
  data();
  if (want !== 'data') for (const p of (want ? [want] : ['phone_portrait', 'computer'])) { try { await live(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTRADE GOODS CARRIED: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
