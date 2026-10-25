/* MONEY TEACHES GATE (RUN TWO [money teaches], VAMILY rule 151(b), 10/25/26).
   PAOLO 10/24: 'if the first thing I did was I hired a full squad 12 people from three... a lot of people would be dying, I'd be
   wasting money... keep a squad fed and paid... it would hurt my ability to hire better people or get better weapons and armor'.
   TUNING 10/25 (records/BOHEMIA_TUNING_WHAT_YOU_SEE_IN_A_CITY_AND_MONEY_TEACHES_10_25_26.md s2): the men at the post were never
   paid, and the board's pay was flat for ever. WHY THIS WALKS THE DEMO: rule 150(d); the hires are real taps at the hall.
     M1 a new company of three pays its food only (the founding crew is not paid): 2 a man
     M2 *** THE HIRED ARE PAID *** two men hired at the post (real taps): the night rises by each man's food AND his wage (his
        background's wiki wage / 10, x 1.1 a level), and the hall's card said that night before he was paid for
     M3 the crew screen says each hired man's night the same
     M4 nightfall takes it: the bill is food plus pay
     M5 THE PAY CLIMBS WITH THE COMPANY'S NAME: the board's pay and the map's pay are the same number, x1 with no clout and
        x(1 + 3.5 x clout / 4,000) with it (TUNING's x1 to x4.5)
     M6 the retinue's cook and paymaster take 15 percent off the food and the pay
     M7 nothing threw
   node gates/money_teaches_gate.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== MONEY TEACHES GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  try {
    await p.waitForTimeout(3000);
    await fr.evaluate(() => { ['bohemia.renown.v1', 'bohemia.camp.v1', 'bohemia.hired.v1'].forEach(k => localStorage.removeItem(k));
      /* RE-AIMED 10/25 (RUN TWO __THE_WAGON__): the night eats the wagon before the batteries now (THE WAGON AND THE SIX holds that);
         this gate holds the batteries' bill, the food and the pay, so its wagon is empty and stays empty */
      const w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'); if (w) { w.food = 0; w.water = 0; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w)); } });
    await fr.waitForFunction(() => window.BohemiaWages && BohemiaWages.ready(), null, { timeout: 8000 }).catch(() => {});
    /* ---- M1 ---- */
    const m1 = await fr.evaluate(() => ({ crew: crewCount(), food: billFood(), wages: billWages(), night: billPerNight() }));
    ok('M1 a new company of three pays its food only: 2 a man, nobody paid', m1.wages === 0 && m1.food === m1.crew * 2 && m1.night === m1.food, JSON.stringify(m1));
    /* ---- M2 two hires at the hall ---- */
    await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 900), 'the gate'); const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null;
    for (let k = 0; k < 60 && !sf; k++) { await p.waitForTimeout(400);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { ok('a town through the map\'s door', false); return done(); }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    const said = [];
    for (let h = 0; h < 2; h++) {
      for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'hall' && !!document.querySelector('#sbody .hire .act'))) break;
        const w = await sf.evaluate(() => BohemiaSettlement.where('hall')); if (w) await p.touchscreen.tap(box.x + w.x, box.y + w.y); await p.waitForTimeout(800); }
      const card = await sf.evaluate(() => { const c = document.querySelector('#sbody .hire'); if (!c) return null; const em = c.querySelector('.act em').textContent; const m = em.match(/(\d+) batter(?:y|ies) a night/i);
        return { id: c.dataset.id, night: m ? +m[1] : null, em }; });
      const b = await sf.$('#sbody .hire .act'); if (b) { await b.scrollIntoViewIfNeeded(); const r = await b.boundingBox(); if (r) await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); }
      await p.waitForTimeout(700);
      said.push(card);
    }
    const m2 = await fr.evaluate(() => { const H = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]');
      return { hired: H.map(h => ({ name: h.name, bg: h.background, level: h.level || 1, wage: BohemiaWages.wage(h.background, h.level || 1) })), crew: crewCount(), food: billFood(), wages: billWages(), night: billPerNight() }; });
    const wantW = m2.hired.reduce((a, h) => a + h.wage, 0);
    ok('M2 two men hired at the post (real taps): the night is food for every man and each hired man\'s pay, and the hall\'s card said it first',
      m2.hired.length === 2 && m2.wages === wantW && wantW >= 2 && m2.night === m2.crew * 2 + wantW && said.every((c, i) => c && m2.hired[i] && c.night === 2 + m2.hired[i].wage),
      m2.hired.map(h => h.name + ' (' + h.bg + ') ' + h.wage).join(', ') + '; night ' + m2.night + ' = ' + m2.crew + ' x 2 + ' + m2.wages + '; the cards said ' + said.map(c => c && c.night).join(', '));
    /* ---- M3 the crew screen ---- */
    let m3 = null;
    const cb = await sf.$('#crew'); if (cb) { const r = await cb.boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(1800);
      const rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url()));
      if (rf) { m3 = [];
        for (const n of m2.hired.map(h => h.name)) { const c = await rf.$('#lines .cell.full[aria-label="' + n + '"]'); if (!c) { m3.push(null); continue; }
          await c.scrollIntoViewIfNeeded().catch(() => {}); const r = await c.boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(400);
          m3.push(await rf.evaluate(() => { const t = (document.querySelector('#card .sub') || {}).textContent || '', mm = t.match(/(\d+) BATTER(?:Y|IES) A NIGHT/); return mm ? +mm[1] : null; })); }
        await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(500); } }
    ok('M3 the crew screen says each hired man\'s night the same', !!m3 && m3.every((n, i) => n === 2 + m2.hired[i].wage), JSON.stringify(m3));
    const lv = await sf.$('#leave'); if (lv) { const r = await lv.boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(800); }
    /* ---- M4 nightfall takes it ---- */
    const m4 = await fr.evaluate(() => { const b0 = loopBats(), due = billPerNight(); const r = crewBillNight(); return { due, paid: r.paid, food: r.food, wages: r.wages, fell: b0 - loopBats() }; });
    ok('M4 nightfall takes it: food plus pay, out of the batteries', m4.wages === m2.wages && m4.paid === m4.due && m4.fell === m4.due, JSON.stringify(m4));
    /* ---- M5 the pay climbs with clout ---- */
    const m5 = await fr.evaluate(() => { const base = 30, a = loopJobPay(base); BohemiaRenown.add(2000, 'the gate', 'gate:money'); const b = loopJobPay(base), mult = BohemiaRenown.payMult();
      const S = LOOP.start || {}; return { a, b, mult, want: Math.max(1, Math.round(((base) + (S.pay | 0)) * (S.mult || 1) * 2.75)) }; });
    await fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0]; loopOpenTown({ name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }); });
    await p.waitForTimeout(1500);
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board')) break; const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) await p.touchscreen.tap(box.x + w.x, box.y + w.y + (i % 2 ? 30 : 0)); await p.waitForTimeout(700); }
    const board = await sf.evaluate(() => { const S = BohemiaSettlement.state, b = document.querySelector('#sbody .act.client'), id = b && b.dataset.id;
      const o = (window.BohemiaBoardShelf && BohemiaBoardShelf.pick(S.place, (typeof S.mapDay === 'number' ? S.mapDay : S.day | 0), { held: S.held, places: S.places }) || []).find(x => x.id === id);
      const em = b && b.querySelector('em'), n = em ? /(\d+)/.exec(em.textContent) : null; return { id, base: o && o.pay, shown: n ? +n[1] : null }; });
    const paid = board && board.base ? await fr.evaluate((base) => loopJobPay(base), board.base | 0) : null;
    ok('M5 THE PAY CLIMBS WITH THE COMPANY\'S NAME: x' + m5.mult + ' at 2,000 clout, and the board shows what the map pays',
      m5.mult === 2.75 && m5.b === m5.want && m5.b > m5.a && !!board && paid != null && paid === board.shown,
      'a 30 job pays ' + m5.a + ' with no clout, ' + m5.b + ' at 2,000; the board shows ' + (board && board.shown) + (paid != null ? ', the map pays ' + paid : ''));
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(300);
    const lv2 = await sf.$('#leave'); if (lv2) { const r = await lv2.boundingBox(); if (r) await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(600); }
    /* ---- M6 the cook and the paymaster ---- */
    const m6 = await fr.evaluate(() => { const f0 = billFood(), w0 = billWages(); BohemiaCamp.hire('cook'); BohemiaCamp.hire('paymaster'); campSync(); const f1 = billFood(), w1 = billWages();
      BohemiaCamp.letGo('cook'); BohemiaCamp.letGo('paymaster'); campSync(); return { f0, f1, w0, w1 }; });
    ok('M6 the retinue\'s cook and paymaster take 15 percent off the food and the pay', m6.f1 === Math.round(m6.f0 * 0.85) && m6.w1 === Math.round(m6.w0 * 0.85) && m6.f1 < m6.f0, JSON.stringify(m6));
  } catch (e) { ok('the money ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('M7 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
  done();
})();
