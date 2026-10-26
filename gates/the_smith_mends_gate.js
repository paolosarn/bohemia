/* ==========================================================================
   THE SMITH MENDS  (RUN TWO, 10/26/26, VAMILY [the smith mends], rule 277)

   PAOLO 10/26: "if I go to a settlement that has a smith and an armourer I should be able to repair my stuff with them pretty
   easily and quickly... the fact that that's not even an option is insane."
   MEASURED BEFORE: the smith said 'Fixed, sharpened, loaded' and only bought and sold; armour damage stays between fights
   (CAMP's condition) and the only mend was the camp's, slow and paid in tape.
   NOW (__THE_SMITH_MENDS__): the smith, the armourer and a camp's GUNS AND PLATE show MEND YOUR GEAR first: MEND IT ALL or one man,
   ECONOMY's craftsman's price on the button (BohemiaStallPrices.mendPrice), paid in batteries, none of his tape, about an hour.

   LEGS, on the demo, a new game, broken gear from a fight's end rows (CAMP's afterFight, the very call the fight's end makes):
     M1 *** THE PRICE FIRST *** a town's smith shows MEND YOUR GEAR above the shelf: MEND IT ALL with the sum of ECONOMY's price for
        every broken piece (worked out here from the file), and a row for each man with a bar for each broken piece
     M2 *** MEND IT ALL *** one tap: the purse down by exactly the shown price, every piece full (nothing broken), TAPE untouched,
        the map's clock an hour on
     M3 one man alone at the armourer: only his pieces mended, the other man still broken, the price his row showed
     M4 a camp's GUNS AND PLATE mends the same
     M5 nothing broken: the counter says so, no mend button
     K1 the computer: MEND IT ALL by a click
     Z  nothing threw
   node gates/the_smith_mends_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/stall_prices.json'), 'utf8'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE SMITH MENDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function openTown(d, pick) {
  const P = d.page, fr = d.fr;
  const name = await fr.evaluate((pick) => { const bs = ctBases(), names = Object.keys(bs), t0 = pick === 'camp' ? names.find(n => mapTierOf(n) === 'camp') : (names.find(k => /church/i.test(k)) || names[0]);
    if (!t0) return null; const t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return t0; }, pick);
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(300);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((nm) => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place.name === nm && !!BohemiaSettlement.mend(); } catch (e) { return false; } }, name).catch(() => false)) { sf = x; break; } }
  if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
  return sf;
}
function taps(d, sf, mouse) {
  const P = d.page;
  const tapAt = async (x, y) => { const b = await (await sf.frameElement()).boundingBox(); if (mouse) await P.mouse.click(b.x + x, b.y + y); else await P.touchscreen.tap(b.x + x, b.y + y); await P.waitForTimeout(600); };
  const tapSel = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false; await tapAt(r.x, r.y); return true; };
  const openShop = async (k) => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(250);
    for (let i = 0; i < 8; i++) { if (await sf.evaluate(k => BohemiaSettlement.state.open === k && !!document.querySelector('#shelfgrid'), k)) return true; const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (w) await tapAt(w.x, w.y); await P.waitForTimeout(600); } return false; };
  const read = () => sf.evaluate(() => { const acts = [...document.querySelectorAll('#sbody .acts > *')], iMend = acts.findIndex(e => /MEND YOUR GEAR/.test(e.textContent)), iShelf = acts.findIndex(e => e.id === 'shelfgrid');
    const all = document.getElementById('mendall'); return { open: BohemiaSettlement.state.open, first: iMend >= 0 && iShelf > iMend, all: all ? { text: all.textContent.replace(/\s+/g, ' ').trim(), off: all.disabled } : null,
      men: [...document.querySelectorAll('#sbody .mendman')].map(b => ({ key: b.dataset.man, text: b.textContent.replace(/\s+/g, ' ').trim(), bars: b.querySelectorAll('.mbar').length })), none: !!document.getElementById('mendnone'),
      M: BohemiaSettlement.mend(), bats: BohemiaSettlement.bats(), tape: (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}).tape | 0, said: (document.querySelector('#sbody .say p') || {}).textContent || '' }; });
  return { tapAt, tapSel, openShop, read };
}
/* a fight's end: YOU and the second man came back with their helmets and body armour dented (CAMP's afterFight, the fight's own call) */
const breakGear = (sf) => sf.evaluate(() => { const C = BohemiaCondition, L = C.members(window.top.BOH_START.picks().company), rows = [];
  L.slice(0, 2).forEach((e, i) => rows.push({ name: e.main ? 'YOU' : e.man.name, main: e.main, hp: 40, hpMax: 50, armH: 20 + i * 10, armHMax: 120, armB: 30, armBMax: 95 + i * 10, head: 'nasal_helmet', body: 'basic_mail_shirt' }));
  C.afterFight(rows, { day: 1 }); return C.broken(window.top.BOH_START.picks().company).map(m => ({ key: m.key, pieces: m.pieces.map(p => p.missing) })); });
const priceOf = (missing, tier, buyMult) => SP.mendPrice(FILE, missing, { tier, buyMult: buyMult || 1 });

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    await d.fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 600), 'the gate'); });
    let sf = await openTown(d, null); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    let T = taps(d, sf, false);
    const broke = await breakGear(sf);
    await T.openShop('smith');
    const r1 = await T.read(), tier = await sf.evaluate(() => BohemiaSettlement.state.place.tier), bm = await sf.evaluate(() => { try { return BohemiaSettlement.traitsNow ? 1 : 1; } catch (e) { return 1; } });
    const want = r1.M ? r1.M.men.reduce((t, m) => t + m.pieces.reduce((u, p) => u + priceOf(p.missing, tier, r1.M.ctx.buyMult), 0), 0) : null;   /* the town's own card on the price (the screen's traitMult().buy), the file's arithmetic here */
    ok('*** M1 THE PRICE FIRST *** the smith shows MEND YOUR GEAR above the shelf: "' + (r1.all && r1.all.text) + '" (ECONOMY\'s price, the sum here ' + want + ' at the card\'s x' + (r1.M && r1.M.ctx.buyMult) + '), ' + r1.men.length + ' men: ' + r1.men.map(m => m.text).join(' | '),
      r1.first && !!r1.all && !r1.all.off && r1.men.length === broke.length && broke.length === 2 && r1.men.every(m => m.bars === 2) && r1.M.all === want && r1.all.text.indexOf(want + ' batter') >= 0, JSON.stringify(broke));
    /* M2 */
    const min0 = await d.fr.evaluate(() => (T.day | 0) * 1440 + (T.min | 0));
    await T.tapSel('#mendall');
    const r2 = await T.read(), min1 = await d.fr.evaluate(() => (T.day | 0) * 1440 + (T.min | 0)), left = await sf.evaluate(() => BohemiaCondition.broken(window.top.BOH_START.picks().company).length);
    ok('*** M2 MEND IT ALL *** one tap: the purse ' + r1.bats + ' -> ' + r2.bats + ' (shown ' + r1.M.all + '), ' + left + ' men broken after, TAPE ' + r1.tape + ' -> ' + r2.tape + ', the clock +' + (min1 - min0) + ' min; "' + r2.said + '"',
      r2.bats === r1.bats - r1.M.all && left === 0 && r2.tape === r1.tape && min1 - min0 >= 60 && r2.none);
    /* M3 one man alone (the smith again: today's Church picture puts the armourer in the bottom-right corner, under the phone on the
       phone AND the computer (measured 10/26: the tap lands on the phone); RUN TWO [the towns wired tall and wide] moves it out. The
       armourer's counter is the same shopSheet, so the smith and the camp's GUNS AND PLATE prove the code) */
    const broke2 = await breakGear(sf);
    await T.openShop('smith');
    const r3 = await T.read(), one = r3.men[1] || r3.men[0];
    await T.tapSel('#sbody .mendman[data-man="' + one.key + '"]');
    const r3b = await T.read(), still = await sf.evaluate(() => BohemiaCondition.broken(window.top.BOH_START.picks().company).map(m => m.key));
    const rowPrice = r3.M.men.find(m => m.key === one.key).price;
    ok('M3 one man alone (' + one.key + ', ' + rowPrice + '): the purse ' + r3.bats + ' -> ' + r3b.bats + ', still broken ' + JSON.stringify(still),
      r3b.bats === r3.bats - rowPrice && still.indexOf(one.key) < 0 && still.length === broke2.length - 1);
    await sf.evaluate(() => BohemiaCondition.mend());
    /* M5 nothing broken */
    await T.openShop('smith'); const r5 = await T.read();
    ok('M5 nothing broken: the counter says so, no mend button', r5.none && !r5.all && !r5.men.length);
    /* M4 a camp's GUNS AND PLATE */
    sf = await openTown(d, 'camp');
    if (!sf) ok('M4 a camp on the map', false);
    else { T = taps(d, sf, false); await breakGear(sf); const has = await sf.evaluate(() => BohemiaSettlement.order().indexOf('arms') >= 0);
      if (has) await T.openShop('arms'); const r4 = await T.read(); if (has && r4.all) await T.tapSel('#mendall'); const r4b = await T.read();
      ok('M4 a camp\'s GUNS AND PLATE (' + (await sf.evaluate(() => BohemiaSettlement.state.place.name)) + '): "' + (r4.all && r4.all.text) + '", then ' + r4b.bats + ' batteries and nothing broken', has && !!r4.all && r4.first && r4b.bats === r4.bats - r4.M.all && r4b.none); }
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    await d.fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 600), 'the gate'); });
    const sf = await openTown(d, null); const T = taps(d, sf, true); await breakGear(sf); await T.openShop('smith'); const a = await T.read();
    await T.tapSel('#mendall'); const b = await T.read();
    ok('K1 the computer: MEND IT ALL by a click (' + (a.all && a.all.text) + '), the purse ' + a.bats + ' -> ' + b.bats, a.open === 'smith' && !!a.all && b.bats === a.bats - a.M.all && b.none);
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
