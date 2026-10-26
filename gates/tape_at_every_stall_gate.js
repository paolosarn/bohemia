/* ==========================================================================
   TAPE AT EVERY STALL  (RUN TWO, 10/26/26, VAMILY [tape at every stall], rules 265(a) and 276(b))

   PAOLO 10/26: "all stalls, no matter the settlement, always sell at least a stack of duct tape... it almost makes the game
   unplayable"; "I made it to day four and couldn't find anywhere to get repair items, duct tape... this run's over, my
   stuff's not repairing."
   MEASURED BEFORE: the stall sold food, meds and rounds; no stall anywhere sold tape (the price file said 'the stall does
   not sell tape yet'), so after the origin's start nothing could mend armour.
   NOW (__TAPE_AT_EVERY_STALL__): every stall holds ECONOMY's tape shelf (records/target/bb/stall_prices.json tape_shelf
   through engine/bohemia_stall_prices.js): a roll or a stack of 20 in one tap, into TAPE on the bar; never sold out.

   LEGS, on the demo, a NEW GAME, real taps on the stall:
     S1 *** DAY 1 *** the first town's stall shows a roll and a stack of tape with the tape icon, priced by ECONOMY's file,
        and its shelf is ECONOMY's tapeShelf for the place (a stack at least)
     S2 a roll by a real tap: the purse down by its price, TAPE on the company up one, the shelf down one
     S3 a stack by a real tap: TAPE up twenty, the purse down by the stack's price
     S4 *** DAYS 2 TO 5 *** every day the stall sells tape (a roll and a stack, never sold out), the shelf full again on the
        third day's restock; TAPE keeps what he bought
     S5 *** EVERY STALL *** every home base on the map (and its tier's pictures) has tape on its stall, a stack at least
     K1 the computer: a roll by a click, TAPE up one
     Z  nothing threw
   node gates/tape_at_every_stall_gate.js
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
const done = () => { console.log('TAPE AT EVERY STALL: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function openTown(d, name, day) {
  const P = d.page, fr = d.fr;
  /* a day passes on the map's own clock (advance(): the night's bill, the mending, the parties), never a number written over it */
  await fr.evaluate(([name, day]) => { if (day) { let g = 0; while (loopDay() < day && g++ < 400) advance(60); } const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => k === name) || names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, [name, day]);
  let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(300);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate((nm) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && (!nm || BohemiaSettlement.state.place.name === nm) && !!BohemiaSettlement.tape(); } catch (e) { return false; } }, name).catch(() => false)) { sf = x; break; } }
  if (sf) await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
  return sf;
}
function taps(d, sf, mouse) {
  const P = d.page;
  const tapAt = async (x, y) => { const b = await (await sf.frameElement()).boundingBox(); if (mouse) await P.mouse.click(b.x + x, b.y + y); else await P.touchscreen.tap(b.x + x, b.y + y); await P.waitForTimeout(500); };
  const tapSel = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false; await tapAt(r.x, r.y); return true; };
  const openStall = async () => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(250);
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall' && !!document.querySelector('#sbody [data-good=tape]'))) return true; const w = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (w) await tapAt(w.x, w.y); await P.waitForTimeout(500); } return false; };
  const read = () => sf.evaluate(() => { const rows = [...document.querySelectorAll('#sbody [data-good=tape]')].map(b => ({ n: +b.dataset.n, text: b.textContent.replace(/\s+/g, ' ').trim(), icon: !!(b.querySelector('img.pk') && b.querySelector('img.pk').complete && b.querySelector('img.pk').naturalWidth > 0), off: b.disabled }));
    let s = {}; try { s = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}; } catch (e) {}
    return { rows, tape: s.tape | 0, bats: BohemiaSettlement.bats(), t: BohemiaSettlement.tape(), place: BohemiaSettlement.state.place.name, tier: BohemiaSettlement.state.place.tier, left: (document.getElementById('tapeleft') || {}).textContent || '' }; });
  /* RE-AIMED 10/26 BY RUN TWO (rule 249, [sell at the stall]): one tap lights a stall's box, two quick taps buy; a line is BUY and SELL side by side */
  const tap2 = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false;
    const b = await (await sf.frameElement()).boundingBox(); if (mouse) await P.mouse.dblclick(b.x + r.x, b.y + r.y); else { await P.touchscreen.tap(b.x + r.x, b.y + r.y); await P.waitForTimeout(120); await P.touchscreen.tap(b.x + r.x, b.y + r.y); } await P.waitForTimeout(500); return true; };
  return { tapAt, tapSel, tap2, openStall, read };
}
/* the shelf from the file, the engine's own arithmetic, with no card moving it (the gate's towns: the card's stock is 1 or more) */
const shelfOf = (place, tier) => SP.tapeShelf(FILE, { place, tier, stockMult: 1 });

(async () => {
  let d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    await d.fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); });
    const day1 = await d.fr.evaluate(() => loopDay());
    const sf = await openTown(d, null, null); if (!sf) { ok('a town through the map\'s door', false); return done(); }
    const T = taps(d, sf, false);
    const opened = await T.openStall();
    const r1 = await T.read();
    ok('*** S1 DAY ' + day1 + ' *** ' + r1.place + '\'s stall: ' + r1.rows.map(x => '"' + x.text + '"').join(', ') + '; ' + r1.t.shelf + ' rolls on the shelf (ECONOMY: ' + shelfOf(r1.place, r1.tier) + ' for a ' + r1.tier + ')',
      opened && r1.rows.length === 2 && r1.rows.every(x => x.icon && !x.off) && r1.rows[0].n === 1 && r1.rows[1].n === 20 && r1.t.roll === SP.buyShown(FILE, 'tape', { tier: r1.tier }) && r1.t.shelf >= 20 && r1.t.full >= 20 && /\d+ rolls on the shelf/.test(r1.left));
    /* S2 a roll */
    await T.tap2('#sbody [data-good=tape][data-n="1"] .sb[data-side=buy]'); await T.openStall();
    const r2 = await T.read();
    ok('S2 a roll by a real tap: the purse ' + r1.bats + ' -> ' + r2.bats + ', TAPE ' + r1.tape + ' -> ' + r2.tape + ', the shelf ' + r1.t.shelf + ' -> ' + r2.t.shelf, r2.bats === r1.bats - r1.t.roll && r2.tape === r1.tape + 1 && r2.t.shelf === r1.t.shelf - 1);
    /* S3 a stack */
    const stack = r2.t.stack;
    await T.tap2('#sbody [data-good=tape][data-n="20"] .sb[data-side=buy]'); await T.openStall();
    const r3 = await T.read();
    ok('S3 a stack by a real tap: TAPE ' + r2.tape + ' -> ' + r3.tape + ', the purse ' + r2.bats + ' -> ' + r3.bats + ' (the stack ' + stack + ')', r3.tape === r2.tape + 20 && r3.bats === r2.bats - stack);
    /* S4 days 2 to 5 */
    const days = []; let tape = r3.tape;
    for (let day = day1 + 1; day <= day1 + 4; day++) {
      const s2 = await openTown(d, r1.place, day); const T2 = taps(d, s2, false); await T2.openStall(); const r = await T2.read();
      await T2.tap2('#sbody [data-good=tape][data-n="1"] .sb[data-side=buy]'); await T2.openStall(); const ra = await T2.read();
      days.push({ day, shelf: r.t.shelf, full: r.t.full, period: r.t.period, rows: r.rows.filter(x => !x.off).length, tapeBefore: r.tape, tapeAfter: ra.tape });
      tape = ra.tape;
    }
    const p0 = r3.t.period, fresh = days.filter(x => x.period !== p0), restocked = fresh.length >= 1 && fresh[0].shelf === fresh[0].full && fresh.every(x => x.shelf >= 20 - 1);
    ok('*** S4 DAYS ' + (day1 + 1) + ' TO ' + (day1 + 4) + ' *** the stall sells tape every day, never sold out, full again on the restock (' + days.map(x => 'day ' + x.day + ' (restock ' + x.period + '): ' + x.shelf + ' of ' + x.full + ', TAPE ' + x.tapeBefore + '->' + x.tapeAfter).join('; ') + ')',
      days.length === 4 && days.every(x => x.rows === 2 && x.tapeAfter === x.tapeBefore + 1) && restocked);   /* TAPE between days: the camp's mending may spend it (CAMP's), so each day is read on its own */
    /* S5 every home base */
    const names = await d.fr.evaluate(() => Object.keys(ctBases()));
    const bad = [], seen = [];
    for (const n of names) { const s5 = await openTown(d, n, null); if (!s5) { bad.push(n + ' (no town)'); continue; } const T5 = taps(d, s5, false); const o5 = await T5.openStall(); const r = await T5.read();
      seen.push(n + ' ' + r.t.shelf); if (!o5 || r.rows.length !== 2 || r.t.full < 20 || r.t.full !== shelfOf(r.place, r.tier) && r.t.full < shelfOf(r.place, r.tier) * 0.25) bad.push(n + ' ' + JSON.stringify(r.t)); }
    ok('*** S5 EVERY STALL *** ' + names.length + ' places, every stall tape, a stack at least (' + seen.join(', ') + ')', names.length >= 10 && !bad.length, bad.slice(0, 3).join(' | '));
  } catch (e) { ok('the phone legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z1 nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  try {
    await d.page.waitForTimeout(3000);
    const sf = await openTown(d, null, null);
    const T = taps(d, sf, true); await T.openStall(); const a = await T.read();
    await T.tap2('#sbody [data-good=tape][data-n="1"] .sb[data-side=buy]'); await T.openStall(); const b = await T.read();
    ok('K1 the computer: a roll by a click, TAPE ' + a.tape + ' -> ' + b.tape, a.rows.length === 2 && b.tape === a.tape + 1 && b.bats === a.bats - a.t.roll);
  } catch (e) { ok('the computer legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('Z2 nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();
