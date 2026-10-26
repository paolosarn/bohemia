/* ==========================================================================
   THE SHOP TAPS  (RUN TWO, 10/26/26, VAMILY [one tap selects, two taps buy] + [nothing moves while he browses] + [the shop shows
   only what changes] + [the shop lights upgrades], rules 249, 250, 251, 282)

   PAOLO 10/26: "when I click something once in a shop it should be highlighted... it shouldn't open up a second menu... I just
   double click it"; "as I click through the items the things don't change locations"; "just an icon, a green arrow up, a red arrow
   down and a number"; "if the shop has a better version... it's highlighted in green... it recommends it goes to the one with the
   bad helmet first".
   MEASURED BEFORE: a tap on a piece took the whole sheet away for its card (the keeper saying its price, 'Not this one'), so the
   shelf left the glass on every tap.
   NOW (__ONE_TAP_SELECTS__ and its neighbours): one strip at the sheet's foot, always one size; one tap lights a box and fills the
   strip in place; two taps (a right click on a computer) buy it onto the man the strip names, or sell his own piece.

   LEGS, on the demo through Church's own door, the armourer and the smith, REAL taps:
     S1 *** ONE TAP LIGHTS IT, IN PLACE *** the box is outlined, the strip names it and its price, the keeper says nothing new, no
        second menu (no 'Not this one', the sheet not rebuilt)
     S2 *** NOTHING MOVES *** ten taps in a row over the shelf and the bag: every rectangle (the strip, its facts, his men, the two
        buttons, the shelf, the bag) the same within a pixel, the strip one size
     S3 *** EACH MAN, ONLY WHAT CHANGES *** every face in the strip carries the piece's change on him (an arrow and how much), the
        man it suits marked; his lines are only what changes (no 'same', no full stat block)
     S4 *** TWO TAPS BUY IT *** a double tap on a piece: bought and worn by the man the strip named, no dialogue, the sheet in place
     S5 *** GREEN FOR AN UPGRADE *** every shelf piece that raises one of his men is marked green and its tap names that man first;
        a piece that raises nobody is not marked
     S6 a bag piece: one tap shows its sale and KEEP; two taps sell it
     K1 the computer: a right click buys it, the same as two taps
     Z  nothing threw
   node gates/the_shop_taps_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE SHOP TAPS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function town(d) {
  const P = d.page;
  await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200); }
  return sf;
}
/* the shop's every rectangle: the strip by the sheet's glass (it stands at its foot), the grids by the sheet's own content */
const layout = (sf) => sf.evaluate(() => {
  const sh = document.getElementById('sheet'), S0 = sh.getBoundingClientRect(), r = (e, sticky) => { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.x - S0.x), Math.round(q.y - S0.y + (sticky ? 0 : sh.scrollTop)), Math.round(q.width), Math.round(q.height)]; };
  const btns = [...document.querySelectorAll('#shopstrip .ss-acts .act')].map(b => r(b, true));
  return { strip: r(document.getElementById('shopstrip'), true), facts: r(document.querySelector('#shopstrip .ss-facts'), true), man: r(document.querySelector('#shopstrip .ss-man'), true),
    acts: r(document.querySelector('#shopstrip .ss-acts'), true), btns, shelf: r(document.getElementById('shelfgrid')), bag: r(document.getElementById('baggrid')),
    sel: document.querySelectorAll('#sheet .slot.sel').length, say: (document.querySelector('#sbody .say p') || {}).textContent || '', notThis: [...document.querySelectorAll('#sbody .act')].some(b => /Not this one/.test(b.textContent)),
    title: (document.querySelector('#shopstrip .ss-title b') || {}).textContent || '', price: (document.querySelector('#shopstrip .ss-acts .act em') || {}).textContent || '', gen: window.__SHOPGEN | 0 };
});
async function tapTile(sf, P, sel, twice, mouse) {
  const h = await sf.$(sel); if (!h) return false;
  await h.scrollIntoViewIfNeeded().catch(() => {}); await P.waitForTimeout(120);
  const b = await h.boundingBox(); if (!b) return false;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  if (mouse) { await P.mouse.click(x, y); if (twice) { await P.waitForTimeout(140); await P.mouse.click(x, y); } }
  else { await P.touchscreen.tap(x, y); if (twice) { await P.waitForTimeout(140); await P.touchscreen.tap(x, y); } }
  await P.waitForTimeout(450); return true;
}
async function openShop(sf, P, k, mouse) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(400);
  const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox();
  if (mouse) await P.mouse.click(fb.x + w.x, fb.y + w.y); else await P.touchscreen.tap(fb.x + w.x, fb.y + w.y);
  await P.waitForTimeout(1500);
  await sf.waitForFunction(() => !!document.querySelector('#shopstrip .ss-facts'), null, { timeout: 8000 }).catch(() => {});
  /* a counter of the sheet being built: one tap must never build it again */
  await sf.evaluate(() => { const b = document.getElementById('sbody'); window.__SHOPGEN = 0; if (!window.__SHOPOBS) { window.__SHOPOBS = new MutationObserver(() => { window.__SHOPGEN = (window.__SHOPGEN | 0) + 1; }); window.__SHOPOBS.observe(b, { childList: true }); } });
  return sf.evaluate(() => BohemiaSettlement.state.open);
}

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page;
  try {
    await P.waitForTimeout(3000);
    const sf = await town(d); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    await sf.evaluate(() => BohemiaSettlement.hireReady ? BohemiaSettlement.hireReady() : null).catch(() => {});
    const op = await openShop(sf, P, 'armourer');
    await sf.waitForFunction(() => document.querySelectorAll('#shelfgrid .slot.full').length > 2 && document.querySelectorAll('#shopstrip .ss-man .fstrip button').length > 0, null, { timeout: 15000 }).catch(() => {});
    const L0 = await layout(sf);
    /* S1 */
    await tapTile(sf, P, '#shelfgrid .slot.full');
    const L1 = await layout(sf);
    ok('*** S1 ONE TAP LIGHTS IT, IN PLACE *** (the ' + op + ': ' + L1.sel + ' box lit, the strip says "' + L1.title + '" for ' + L1.price + '; the keeper still "' + L0.say.slice(0, 40) + '"; the sheet built again ' + L1.gen + ' times, a second menu ' + L1.notThis + ')',
      op === 'armourer' && L1.sel === 1 && L1.title.length > 3 && /\d/.test(L1.price) && L1.say === L0.say && L1.gen === 0 && !L1.notThis);
    /* S2: ten taps over the shelf and the bag (a piece in the bag first: buy one to the stash) */
    const nShelf = await sf.evaluate(() => document.querySelectorAll('#shelfgrid .slot.full').length);
    const same = (a, b) => !!a && !!b && a.every((v, i) => Math.abs(v - b[i]) <= 1);
    const moved = [];
    for (let i = 0; i < 10; i++) {
      const sel = '#shelfgrid .slot.full:nth-child(' + (1 + (i % Math.max(1, nShelf))) + ')';
      await tapTile(sf, P, sel);
      const L = await layout(sf);
      ['strip', 'facts', 'man', 'acts', 'shelf', 'bag'].forEach(k => { if (!same(L[k], L1[k])) moved.push(i + ':' + k + ' ' + JSON.stringify(L1[k]) + '->' + JSON.stringify(L[k])); });
      if (L.btns.length !== L1.btns.length || L.btns.some((b, j) => !same(b, L1.btns[j]))) moved.push(i + ':buttons');
      if (L.gen) moved.push(i + ':rebuilt ' + L.gen);
    }
    ok('*** S2 NOTHING MOVES *** (ten taps over ' + nShelf + ' pieces: the strip ' + JSON.stringify(L1.strip) + ', the shelf ' + JSON.stringify(L1.shelf) + '; moved: ' + (moved.slice(0, 3).join(' | ') || 'nothing') + ')', moved.length === 0 && same(L0.strip, L1.strip));
    /* S3 */
    const s3 = await sf.evaluate(() => {
      const faces = [...document.querySelectorAll('#shopstrip .ss-man .fstrip button')].map(b => ({ man: b.dataset.man, on: b.classList.contains('on'), dv: (b.querySelector('.dv') || {}).textContent || null, d: (b.querySelector('.dv') || {}).dataset ? b.querySelector('.dv').dataset.delta : null }));
      const lines = [...document.querySelectorAll('#shopstrip .ss-man .ln')].map(l => ({ k: l.dataset.k, delta: +l.dataset.delta }));
      return { faces, lines, block: document.querySelectorAll('#shopstrip .ss-man .ln').length };
    });
    const marked = s3.faces.filter(f => f.on).length, badged = s3.faces.filter(f => f.dv && /^([▲▼]\d+|·|×)$/.test(f.dv)).length;
    ok('*** S3 EACH MAN, ONLY WHAT CHANGES *** (' + s3.faces.length + ' faces, ' + badged + ' with an arrow and how much (' + s3.faces.map(f => f.man + ' ' + f.dv).slice(0, 5).join(', ') + '), ' + marked + ' marked; his lines ' + s3.lines.map(l => l.k + ' ' + l.delta).join(', ') + ')',
      s3.faces.length >= 1 && badged === s3.faces.length && marked === 1 && s3.lines.every(l => l.delta !== 0) && s3.block <= 6);
    /* S5: green for an upgrade, a tap names that man */
    const s5 = [];
    for (let i = 1; i <= nShelf; i++) {
      await tapTile(sf, P, '#shelfgrid .slot.full:nth-child(' + i + ')');
      s5.push(await sf.evaluate((i) => { const t = document.querySelectorAll('#shelfgrid .slot.full')[i - 1]; const faces = [...document.querySelectorAll('#shopstrip .ss-man .fstrip button')];
        const up = faces.filter(b => +((b.querySelector('.dv') || {}).dataset || {}).delta > 0), on = faces.find(b => b.classList.contains('on'));
        return { marked: !!t && t.classList.contains('up'), upMan: t ? t.dataset.up || null : null, raises: up.map(b => b.dataset.man), on: on ? on.dataset.man : null, best: up.length ? up.sort((a, b) => +b.querySelector('.dv').dataset.delta - +a.querySelector('.dv').dataset.delta)[0].dataset.man : null }; }, i));
    }
    const s5bad = s5.filter(x => x.marked !== x.raises.length > 0 || (x.marked && x.on !== x.upMan));
    ok('*** S5 GREEN FOR AN UPGRADE *** (' + s5.filter(x => x.marked).length + ' of ' + s5.length + ' marked, each one raising a man and naming him first; the others raise nobody' + (s5bad.length ? '; wrong: ' + JSON.stringify(s5bad.slice(0, 2)) : '') + ')', s5.length >= 3 && !s5bad.length && s5.some(x => x.marked));
    /* S4: two taps buy it onto the man the strip names */
    const ti = s5.findIndex(x => x.marked) + 1 || 1;
    await tapTile(sf, P, '#shelfgrid .slot.full:nth-child(' + ti + ')');
    const before = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), man: (document.querySelector('#shopstrip #buywear') || {}).dataset ? document.querySelector('#shopstrip #buywear').dataset.man : null, n: (window.__WORE || {}).n | 0 }));
    const b4 = await sf.evaluate((ti) => { const t = document.querySelectorAll('#shelfgrid .slot.full')[ti - 1]; return t ? t.getAttribute('aria-label') : null; }, ti);
    await tapTile(sf, P, '#shelfgrid .slot.full:nth-child(' + ti + ')', true);
    await P.waitForTimeout(500);
    const after = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), wore: window.__WORE || null, open: BohemiaSettlement.state.open, said: (document.querySelector('#shopstrip .ss-said') || {}).textContent || '', notThis: [...document.querySelectorAll('#sbody .act')].some(b => /Not this one/.test(b.textContent)), gone: document.querySelectorAll('#shelfgrid .slot.gone').length }));
    ok('*** S4 TWO TAPS BUY IT *** (' + b4 + ': ' + before.bats + ' -> ' + after.bats + ' batteries, worn by ' + (after.wore && after.wore.man) + ' (the strip named ' + before.man + '), the strip says "' + after.said.slice(0, 60) + '", its place on the shelf kept empty ' + after.gone + ', the ' + after.open + ' still open)',
      after.bats < before.bats && !!after.wore && (after.wore.n | 0) > before.n && after.wore.man === before.man && after.open === 'armourer' && /wear|carr|take/i.test(after.said) && after.gone >= 1 && !after.notThis);
    /* S6: the bag */
    await sf.evaluate(() => { const s = document.getElementById('sheet'); s.scrollTop = s.scrollHeight; }); await P.waitForTimeout(300);
    await tapTile(sf, P, '#baggrid .slot.full');
    const b6 = await sf.evaluate(() => ({ sell: (document.querySelector('#shopstrip #sellit') || {}).textContent || '', keep: (document.querySelector('#shopstrip #keepit') || {}).textContent || '', n: BohemiaSettlement.state.stash.length, bats: BohemiaSettlement.bats() }));
    await tapTile(sf, P, '#baggrid .slot.full', true);
    const a6 = await sf.evaluate(() => ({ n: BohemiaSettlement.state.stash.length, bats: BohemiaSettlement.bats() }));
    ok('S6 a bag piece: one tap shows "' + b6.sell.replace(/\s+/g, ' ').trim() + '" and "' + b6.keep.replace(/\s+/g, ' ').trim().slice(0, 30) + '"; two taps sell it (' + b6.n + ' -> ' + a6.n + ' in the stash, ' + b6.bats + ' -> ' + a6.bats + ')',
      /Sell it/.test(b6.sell) && /keep|junk/i.test(b6.keep) && a6.n === b6.n - 1 && a6.bats > b6.bats);
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    const sf = await town(d), P = d.page;
    await openShop(sf, P, 'smith', true);
    await sf.waitForFunction(() => document.querySelectorAll('#shelfgrid .slot.full').length > 0, null, { timeout: 15000 }).catch(() => {});
    const before = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), n: (window.__WORE || {}).n | 0, stash: BohemiaSettlement.state.stash.length }));
    const h = await sf.$('#shelfgrid .slot.full'); await h.scrollIntoViewIfNeeded().catch(() => {}); const b = await h.boundingBox();
    await P.mouse.click(b.x + b.width / 2, b.y + b.height / 2, { button: 'right' }); await P.waitForTimeout(700);
    const after = await sf.evaluate(() => ({ bats: BohemiaSettlement.bats(), n: (window.__WORE || {}).n | 0, stash: BohemiaSettlement.state.stash.length, open: BohemiaSettlement.state.open }));
    ok('K1 the computer: a right click buys it (' + before.bats + ' -> ' + after.bats + ' batteries, worn ' + (after.n - before.n) + ', the stash ' + before.stash + ' -> ' + after.stash + ', the ' + after.open + ' still open)',
      after.bats < before.bats && (after.n > before.n || after.stash > before.stash) && after.open === 'smith');
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
