/* ==========================================================================
   THE STALL BUYS AND SELLS  (RUN TWO, 10/26/26, VAMILY [sell at the stall] + [what you sell sits on their shelf] + the stall's half
   of [one tap selects, two taps buy] + [eyes: prices under the phone], rules 242, 248, 249, 238(b))

   PAOLO 10/26: "at the stall, where a dose of meds, six rounds, food and water are available, I should also be able to sell... buy
   versus sell prices"; "when I sell my junk I should be able to see it on their shelf... I can just re-buy it back at the sell price".
   MEASURED BEFORE: the stall's lines were one button each and one tap bought; nothing at the stall bought his supplies; a piece he
   sold at a shop was gone.
   NOW (__SELL_AT_THE_STALL__, __WHAT_YOU_SELL_SITS_ON_THEIR_SHELF__): BUY and SELL side by side on every line, a battery and the
   count; one tap lights a box, two quick taps do it; what he sold buys back at what it paid, here and at the shops.

   LEGS, on the demo through Church's door, an upright phone, REAL taps:
     T1 *** BUY AND SELL SIDE BY SIDE *** every line of a calm stall: a BUY box and a SELL box, each a battery and a count, 44 points
        tall at least; selling pays under buying, unit for unit, on every line
     T2 *** ONE TAP LIGHTS IT *** one tap on SELL: the box outlined, the strip says what it does, nothing sold, no line moved, the
        keeper says nothing new
     T3 *** SELL ONE OF EACH *** two taps on each SELL: the count drops by what it says, the batteries rise by the shown price
     T4 *** BACK AT WHAT THEY PAID *** after a sale BUY says BACK at the price he got; two taps: the count back, the batteries down by
        exactly that price
     T5 *** A TOWN SHORT PAYS MORE *** the same town sick: food and meds sell for more than calm, unit for unit, and the line says it
     T6 *** THE WARNING *** a sale of food that leaves less than a night for every man: the first two taps only warn, the next two sell
     G1 *** HIS GEAR ON THEIR SHELF *** at the armourer: one piece sold by two taps and two by SELL THE JUNK: each on the shelf at
        once, first, marked YOURS, SOLD, at what it brought
     G2 *** BACK WHERE IT WAS *** two taps on one: the batteries down by exactly its sale, the piece back in the bag at its slot with
        its KEEP mark
     G3 after leaving and coming back: what is left of his on the shelf is their stock at their price, no longer his
     P1 *** CLEAR OF THE PHONE *** upright and sideways: no stall box and no board price under the phone
     K1 the computer: a right click sells at the stall
     Z  nothing threw
   node gates/the_stall_buys_and_sells_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE STALL BUYS AND SELLS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function town(d, re) {
  const P = d.page;
  await d.fr.evaluate((re) => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); const bs = ctBases(), n = Object.keys(bs).find(k => new RegExp(re, 'i').test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, re || 'church');
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
async function openIt(sf, P, k, mouse) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
  const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox();
  if (mouse) await P.mouse.click(fb.x + w.x, fb.y + w.y); else await P.touchscreen.tap(fb.x + w.x, fb.y + w.y);
  await P.waitForTimeout(1300);
  await sf.waitForFunction((k) => BohemiaSettlement.state.open === k && (k !== 'stall' || !!document.querySelector('#stallstrip')), k, { timeout: 8000 }).catch(() => {});
  return sf.evaluate(() => BohemiaSettlement.state.open);
}
/* a real tap (or two) on an element of the town's frame */
async function tapEl(sf, P, sel, n, how) {
  const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel);
  if (!r) return false; const fb = await (await sf.frameElement()).boundingBox(), x = fb.x + r.x, y = fb.y + r.y;
  if (how === 'right') await P.mouse.click(x, y, { button: 'right' });
  else if (how === 'mouse') { if (n === 2) await P.mouse.dblclick(x, y); else await P.mouse.click(x, y); }
  else for (let i = 0; i < (n || 1); i++) { await P.touchscreen.tap(x, y); if (i + 1 < (n || 1)) await P.waitForTimeout(120); }
  await P.waitForTimeout(450); return true;
}
const SUP = () => { try { return JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}; } catch (e) { return {}; } };
const box = (key, side) => '#sbody .stline[data-key="' + key + '"] .sb[data-side=' + side + ']';
const read = (sf) => sf.evaluate((SUPs) => { const SUP = eval(SUPs); const sh = document.getElementById('sheet'), S0 = sh.getBoundingClientRect();
  return { rows: BohemiaSettlement.stall(), sup: SUP(), bats: BohemiaSettlement.bats(), say: (document.querySelector('#sbody .say p') || {}).textContent || '', strip: (document.getElementById('stallstrip') || {}).textContent || '',
    lit: [...document.querySelectorAll('#sbody .stline .sb.sel')].map(b => b.parentNode.dataset.key + ':' + b.dataset.side), traits: BohemiaSettlement.traitsNow(),
    lines: [...document.querySelectorAll('#sbody .stline')].map(l => { const q = l.getBoundingClientRect(); return { key: l.dataset.key, word: l.dataset.word || null, r: [Math.round(q.x - S0.x), Math.round(q.y - S0.y + sh.scrollTop), Math.round(q.width), Math.round(q.height)],
      boxes: [...l.querySelectorAll('.sb')].map(b => { const z = b.getBoundingClientRect(), im = b.querySelector('.sp img'); return { side: b.dataset.side, h: Math.round(z.height), icon: !!(im && im.complete && im.naturalWidth > 0), n: (b.querySelector('.sp') || {}).textContent || '', cap: (b.querySelector('small') || {}).textContent || '' }; }) }; }) }; }, SUP.toString());
const COUNT = { food: 'food', meds: 'meds', rounds: 'rounds', tape1: 'tape', tape20: 'tape' };

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page;
  try {
    await P.waitForTimeout(3000);
    const sf = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    await sf.evaluate(() => BohemiaSettlement.open({ traits: [] }));   /* a calm town for the first legs */
    await P.waitForTimeout(500);
    const op = await openIt(sf, P, 'stall');
    const A = await read(sf);
    /* T1 */
    const t1bad = A.rows.filter(r => !(r.buy.p >= 1 && r.sell.k >= 1 && r.sell.p >= 1 && r.sell.p / r.sell.k < r.buy.p / r.buy.k));
    const boxesOk = A.lines.length >= 3 && A.lines.every(l => l.boxes.length === 2 && l.boxes[0].side === 'buy' && l.boxes[1].side === 'sell' && l.boxes.every(b => b.h >= 44 && b.icon && /\d/.test(b.n)));
    ok('*** T1 BUY AND SELL SIDE BY SIDE *** (the ' + op + ' of ' + A.traits.join('+') + ' calm: ' + A.rows.map(r => r.key + ' ' + r.buy.p + '/' + r.sell.k + ' for +' + r.sell.p).join(', ') + ')',
      op === 'stall' && boxesOk && A.rows.length === A.lines.length && !t1bad.length, t1bad.map(r => r.key).join(',') || (boxesOk ? '' : JSON.stringify(A.lines[0])));
    /* T2 */
    await tapEl(sf, P, box('meds', 'sell'), 1);
    const B = await read(sf);
    const moved = A.lines.filter((l, i) => !B.lines[i] || l.r.some((v, j) => Math.abs(v - B.lines[i].r[j]) > 1)).map(l => l.key);
    ok('*** T2 ONE TAP LIGHTS IT *** (lit ' + B.lit.join(',') + '; the strip "' + B.strip.slice(0, 70) + '"; meds ' + A.sup.meds + ' -> ' + B.sup.meds + ', moved ' + (moved.join(',') || 'nothing') + ', the keeper the same ' + (A.say === B.say) + ')',
      B.lit.length === 1 && B.lit[0] === 'meds:sell' && /^Sell /.test(B.strip) && B.sup.meds === A.sup.meds && B.bats === A.bats && !moved.length && A.say === B.say);
    /* T3 one of each */
    const t3 = [];
    for (const r of A.rows) {
      const pre = await read(sf), pr = pre.rows.find(x => x.key === r.key), c = COUNT[r.key], per = r.per || 1;
      await tapEl(sf, P, box(r.key, 'sell'), 2);
      const post = await read(sf);
      t3.push({ key: r.key, k: pr.sell.k * per, p: pr.sell.p, dc: (pre.sup[c] | 0) - (post.sup[c] | 0), db: post.bats - pre.bats, back: (post.rows.find(x => x.key === r.key) || {}).buy });
    }
    ok('*** T3 SELL ONE OF EACH *** (' + t3.map(x => x.key + ' -' + x.dc + ' of ' + x.k + ', +' + x.db + ' of +' + x.p).join('; ') + ')', t3.length === A.rows.length && t3.every(x => x.dc === x.k && x.db === x.p && x.p >= 1));
    /* T4 back at what they paid: the meds */
    const m0 = await read(sf), mr = m0.rows.find(x => x.key === 'meds'), sold = t3.find(x => x.key === 'meds');
    const cap = m0.lines.find(l => l.key === 'meds').boxes[0].cap;
    await tapEl(sf, P, box('meds', 'buy'), 2);
    const m1 = await read(sf);
    ok('*** T4 BACK AT WHAT THEY PAID *** (BUY said "' + cap + '" at ' + mr.buy.p + ', the sale was ' + (sold && sold.k) + ' for +' + (sold && sold.p) + '; two taps: meds ' + m0.sup.meds + ' -> ' + m1.sup.meds + ', batteries ' + m0.bats + ' -> ' + m1.bats + ')',
      cap === 'BACK' && mr.buy.back && mr.buy.p === sold.p && m1.sup.meds === m0.sup.meds + sold.k && m0.bats - m1.bats === sold.p);   /* the handful he sold, all of it back */
    /* T5 a sick town */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); BohemiaSettlement.open({ traits: ['sickness'] }); }); await P.waitForTimeout(600);
    await openIt(sf, P, 'stall');
    const C = await read(sf), unit = (rows, k) => { const r = rows.find(x => x.key === k); return r && r.sell.k ? r.sell.p / r.sell.k : 0; };
    const words = C.lines.filter(l => l.word === 'short').map(l => l.key);
    ok('*** T5 A TOWN SHORT PAYS MORE *** (' + C.traits.join('+') + ': food ' + unit(C.rows, 'food') + ' a night against ' + unit(A.rows, 'food') + ' calm, meds ' + unit(C.rows, 'meds') + ' a dose against ' + unit(A.rows, 'meds') + '; the word on ' + words.join(',') + '; the keeper "' + C.say.slice(0, 60) + '")',
      unit(C.rows, 'food') > unit(A.rows, 'food') && unit(C.rows, 'meds') > unit(A.rows, 'meds') && words.indexOf('food') >= 0 && words.indexOf('meds') >= 0);
    /* T6 the warning: the wagon down to a night for every man */
    const crew = await sf.evaluate(() => BohemiaSettlement.state.crewSize || 3);
    await sf.evaluate((n) => { const s = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); s.food = n; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(s)); }, crew);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); BohemiaSettlement.open({ traits: [] }); }); await P.waitForTimeout(400);
    await openIt(sf, P, 'stall');
    const w0 = await read(sf);
    await tapEl(sf, P, box('food', 'sell'), 2);
    const w1 = await read(sf), warnT = await sf.evaluate(() => (document.querySelector('#stallstrip .st-warn') || {}).textContent || '');
    await P.waitForTimeout(500); await tapEl(sf, P, box('food', 'sell'), 2);
    const w2 = await read(sf);
    ok('*** T6 THE WARNING *** (' + crew + ' men, ' + w0.sup.food + ' nights: the first two taps "' + warnT + '", food ' + w1.sup.food + '; the next two: food ' + w2.sup.food + ', batteries ' + w1.bats + ' -> ' + w2.bats + ')',
      w0.rows.find(x => x.key === 'food').warns && /less than tonight/.test(warnT) && w1.sup.food === w0.sup.food && w2.sup.food < w1.sup.food && w2.bats > w1.bats);
    /* G1 his gear on the armourer's shelf */
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); });
    const put = await sf.evaluate(() => { const S = BohemiaSettlement.state, src = (S.stock.armourer || []).slice(0, 3); if (src.length < 3) return null;
      const mk = (it, i) => Object.assign(JSON.parse(JSON.stringify(it)), { keep: i === 0 ? true : false, gateMark: 'g' + i });
      S.stash.forEach(x => { if (x.keep !== true) x.keep = true; });   /* his own pieces kept, so SELL THE JUNK takes only the gate's two */
      S.stash = src.map(mk).concat(S.stash); localStorage.setItem('bohemia.bag.v1', JSON.stringify(S.stash)); return S.stash.slice(0, 3).map(x => ({ id: x.id, keep: x.keep, mark: x.gateMark })); });
    await openIt(sf, P, 'armourer');
    const g0 = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), n: BohemiaSettlement.state.stash.length }));
    await tapEl(sf, P, '#baggrid .slot.full:nth-child(1)', 2);   /* the kept one, sold by two taps */
    await tapEl(sf, P, '#selljunk', 1);   /* the two marked junk */
    const g1 = await sf.evaluate(() => { const t = [...document.querySelectorAll('#shelfgrid .slot')]; return { bats: BohemiaSettlement.bats(), n: BohemiaSettlement.state.stash.length,
      yours: t.map((x, i) => x.classList.contains('yours') ? { i, price: +((x.querySelector('em') || {}).textContent || '').replace(/\D/g, ''), badge: (x.querySelector('.ys') || {}).textContent || '', id: x.dataset.id } : null).filter(Boolean), rows: BohemiaSettlement.soldTo() }; });
    const firsts = g1.yours.every((y, j) => y.i === j), paidOk = g1.rows.length === 3 && g1.yours.every(y => g1.rows.some(r => r.it.id === y.id && r.paid === y.price));
    ok('*** G1 HIS GEAR ON THEIR SHELF *** (' + (put ? put.length : 0) + ' put in his bag; sold: the bag ' + g0.n + ' -> ' + g1.n + ', batteries ' + g0.bats + ' -> ' + g1.bats + '; on the shelf ' + g1.yours.map(y => y.badge + ' ' + y.price + ' at ' + y.i).join(', ') + ')',
      !!put && g1.n === g0.n - 3 && g1.yours.length === 3 && firsts && paidOk && g1.yours.every(y => y.badge === 'YOURS, SOLD'));
    /* G2 buy the kept one back */
    const kept = g1.rows.find(r => r.it.gateMark === 'g0'), ki = kept ? g1.yours.findIndex(y => y.id === kept.it.id && y.price === kept.paid) : -1;
    const b0 = await sf.evaluate(() => BohemiaSettlement.bats());
    if (ki >= 0) await tapEl(sf, P, '#shelfgrid .slot:nth-child(' + (g1.yours[ki].i + 1) + ')', 2);
    const g2 = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), back: window.__BOUGHT_BACK || null, at: BohemiaSettlement.state.stash.findIndex(x => x.gateMark === 'g0'), keep: (BohemiaSettlement.state.stash.find(x => x.gateMark === 'g0') || {}).keep, mine: [...document.querySelectorAll('#shelfgrid .slot.yours')].length }));
    ok('*** G2 BACK WHERE IT WAS *** (two taps: batteries ' + b0 + ' -> ' + g2.bats + ' (it brought ' + (kept && kept.paid) + '), back in the bag at slot ' + g2.at + ' (it was ' + (kept && kept.slot) + '), KEEP ' + g2.keep + '; ' + g2.mine + ' of his left on the shelf)',
      !!kept && b0 - g2.bats === kept.paid && g2.at === kept.slot && g2.keep === true && g2.mine === 2);
    /* G3 leave and come back */
    const sf2 = await town(d);
    await openIt(sf2, P, 'armourer');
    const g3 = await sf2.evaluate(() => { const rows = BohemiaSettlement.soldTo(), t = [...document.querySelectorAll('#shelfgrid .slot.full')];
      return rows.map(r => { const tile = t.find(x => x.dataset.id === r.it.id && !x.classList.contains('gone')); return { id: r.it.id, paid: r.paid, base: r.it.base || r.it.price, shown: tile ? +((tile.querySelector('em') || {}).textContent || '').replace(/\D/g, '') : null, yours: tile ? tile.classList.contains('yours') : null }; }); });
    ok('G3 after leaving and coming back: his two are their stock at their price (' + g3.map(x => x.shown + ' (it brought ' + x.paid + ')' + (x.yours ? ' STILL HIS' : '')).join(', ') + ')',
      g3.length === 2 && g3.every(x => x.shown != null && x.yours === false && x.shown > x.paid));
    /* P1 upright: the stall's boxes and the board's prices clear of the phone */
    const clear = async (s) => { const fb = await (await s.frameElement()).boundingBox(), ph = await P.evaluate(() => { const r = window.BOH_PHONE_RECT; return r ? (typeof r === 'function' ? r() : r) : null; });
      const out = [];
      for (const k of ['stall', 'board']) { await openIt(s, P, k);
        const els = await s.evaluate((k) => [...document.querySelectorAll(k === 'stall' ? '#sbody .stline .sb' : '#sbody .act em, #sbody .act .pay')].map(e => { e.scrollIntoView({ block: 'nearest' }); const q = e.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height, vis: q.width > 0 }; }), k);
        for (const e of els) { if (!e.vis || !ph || !ph.on) continue; const x = fb.x + e.x, y = fb.y + e.y; if (x < ph.right && x + e.w > ph.left && y < ph.bottom && y + e.h > ph.top) out.push(k); }
        out.push(k + ':' + els.length); }
      return { out, ph }; };
    const up = await clear(sf2);
    ok('*** P1 CLEAR OF THE PHONE *** upright (' + up.out.join(', ') + '; the phone ' + JSON.stringify(up.ph && [up.ph.left, up.ph.top, up.ph.right, up.ph.bottom]) + ')', up.out.every(x => /:\d+$/.test(x)) && up.out.some(x => /^stall:[1-9]/.test(x)));
    await P.setViewportSize({ width: 844, height: 390 }); await P.waitForTimeout(2500);
    const side = await clear(sf2);
    ok('    and sideways (' + side.out.join(', ') + '; the phone ' + JSON.stringify(side.ph && [side.ph.left, side.ph.top, side.ph.right, side.ph.bottom]) + ')', side.out.every(x => /:\d+$/.test(x)) && side.out.some(x => /^stall:[1-9]/.test(x)));
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    const P2 = d.page; await P2.waitForTimeout(3000);
    const sf = await town(d); await sf.evaluate(() => BohemiaSettlement.open({ traits: [] })); await P2.waitForTimeout(400);
    await openIt(sf, P2, 'stall', true);
    const a = await read(sf), r = a.rows.find(x => x.key === 'rounds');
    await tapEl(sf, P2, box('rounds', 'sell'), 1, 'right');
    const b = await read(sf);
    ok('K1 the computer: a right click sells (rounds ' + a.sup.rounds + ' -> ' + b.sup.rounds + ', batteries ' + a.bats + ' -> ' + b.bats + ', the box said ' + r.sell.k * 6 + ' for +' + r.sell.p + ')', a.sup.rounds - b.sup.rounds === r.sell.k * 6 && b.bats - a.bats === r.sell.p);
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
