/* ==========================================================================
   THE ROSTER COUNTS WHO CAN FIGHT, AND A DONE JOB IS GONE  (WORLD, 10/26/26; EYES lines 79 and 114 of his list)

   EYES on BUILD 10/25x (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md): after three of the Block Watch's twelve died and four
   were laid up, the next job still said 'SIZED TO YOUR 13 MEN' with six able, and it wiped; the rescue then said 'YOU 8' and sent
   YOU in alone against eight; 'Bring the Salcedo family home', paid, was on the same board again at once, and taking it again wiped.
   THE LIVE DEMO, on his computer (ROSTER2_PROFILE=phone_portrait for the phone):
     R1  twelve on the crew screen, three dead in the fight's rows, four struck down: the enemy is sized to the NINE who can fight
         (the map's own party math, the same as for a crew of nine). RE-AIMED 10/26 (CAMP [struck down, he still fights], rule 234,
         Paolo 10/26: 'they're still active'): a struck-down man fights again at one hitpoint, so he is counted; the dead never are
     R2  the men the enemy took (the wipe's own list) are not counted: YOU alone is sized as YOU alone
     R3  the meet card's YOU is the men the fight's own door stands on the board, and the fight agrees
     D1  a job he finished is not on the town's board (and the same board offers it when it was never done: the leg bites)
     D2  nor on the phone
     R4  nothing threw
   node gates/the_roster_counts_who_can_fight_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.ROSTER2_PROFILE || 'computer';
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE ROSTER COUNTS WHO CAN FIGHT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const NAMES = ['YOU', 'DESI', 'RAUL', 'TINA', 'OSCAR', 'LUPE', 'BETO', 'NENA', 'CHUY', 'PALOMA', 'TONO', 'LALO'];

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: false }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    await waitFor(() => fr.evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 60000);
    /* R1: twelve, three dead, four laid up (the fight's own rows, the day it happened, his laid-up days) */
    const r1 = await fr.evaluate((NAMES) => {
      const men = NAMES.map((n, i) => ({ name: n, background: i ? 'militia' : 'sellsword', level: 3, main: i === 0 }));
      localStorage.setItem('bohemia.company.v1', JSON.stringify(men)); localStorage.removeItem('bohemia.company.line.v1');
      ['bohemia.hired.v1', 'bohemia.walked.v1', 'bohemia.taken.v1'].forEach(k => localStorage.setItem(k, '[]'));
      try { DAY.day = 12; } catch (e) {}
      localStorage.setItem('bohemia.fight.after.v1', JSON.stringify([{ day: 11, rows: [
        { name: 'DESI', dead: true }, { name: 'RAUL', dead: true }, { name: 'TINA', dead: true },
        { name: 'OSCAR', down: true, injury: 'broken arm', laidUpDays: 30 }, { name: 'LUPE', down: true, injury: 'cut', laidUpDays: 6 },
        { name: 'BETO', down: true, injury: 'concussion', laidUpDays: 9 }, { name: 'NENA', down: true, injury: 'fractured ribs', laidUpDays: 20 }] }]));
      const r = BohemiaJobKinds.roster(), nine = partyMath('job', { skulls: 2, strength: 9 * (10 + 2 * 2) }), now = partyMath('job', { skulls: 2 });
      return { men: r.men.map(m => m.name), n: r.men.length, count: now.count, nine: nine.count, strength: now.strength,
        struck: ['OSCAR', 'LUPE', 'BETO', 'NENA'].every(n => r.men.some(m => m.name === n)), dead: ['DESI', 'RAUL', 'TINA'].some(n => r.men.some(m => m.name === n)) };
    }, NAMES);
    ok('R1 twelve on the crew screen, three dead and four struck down: sized to the nine who can fight (the struck down still fight, rule 234; the dead never)', r1.n === 9 && r1.struck && !r1.dead && r1.count === r1.nine && r1.strength === 9 * (10 + 2 * 2),
      'counted ' + r1.n + ' (' + r1.men.join(', ') + '), strength ' + r1.strength + ', a two-star job meets ' + r1.count + ' (nine men meet ' + r1.nine + ')');
    /* R2: the wipe took everyone but YOU */
    const r2 = await fr.evaluate((NAMES) => {
      localStorage.setItem('bohemia.fight.after.v1', '[]');
      localStorage.setItem('bohemia.taken.v1', JSON.stringify([{ by: 'the checker\'s raiders', names: NAMES.slice(1), day: 12 }]));
      const r = BohemiaJobKinds.roster(), one = partyMath('job', { skulls: 1, strength: 10 + 2 * 2 }), now = partyMath('job', { skulls: 1 });
      return { n: r.men.length, men: r.men.map(m => m.name), count: now.count, one: one.count };
    }, NAMES);
    ok('R2 the men the enemy took are not counted: YOU alone is sized as YOU alone', r2.n === 1 && r2.count === r2.one, 'counted ' + r2.men.join(', ') + '; the rescue meets ' + r2.count + ' (a lone man meets ' + r2.one + '; EYES saw 8)');
    /* R3: the meet card's YOU, and the fight */
    const card = await fr.evaluate(() => {
      const pm = partyMath('job', { skulls: 1 }); const roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
      meetWalk(() => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'get your men back', faction: null, draft: true, roster, party: pm, street: true, why: 'contract:checker:rescue', at: { gx: city.x, gy: city.y } }));
      const el = document.getElementById('meetcard'); if (!el) return null;
      /* rule 224: the card draws the counts (their men, his tally); the numbers ride in data-n and data-you */
      const t = el.querySelector('.mcs').textContent, y = el.querySelector('.mcyou'), s = el.querySelector('.mcs [data-n]');
      return { you: y ? +y.dataset.you : null, n: s ? +s.dataset.n : null, text: t, tally: y ? y.querySelectorAll('i[style*="height:8px"]').length : null };
    });
    let fightYou = null, fightThem = null;
    if (card) {
      await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="go"]'); if (b) b.click(); });
      for (let i = 0; i < 160 && fightYou == null; i++) { const h = await page.$('#fightFrame'); const ff = h ? await h.contentFrame() : null;
        if (ff) { const u = await ff.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units.length) ? [FIGHT.S.units.filter(x => x.side === 'you').length, FIGHT.S.units.filter(x => x.side === 'them').length] : null).catch(() => null);
          if (u) { fightYou = u[0]; fightThem = u[1]; } }
        if (fightYou == null) await page.waitForTimeout(250); }
    }
    ok('R3 the meet card\'s YOU is the men the fight stands on the board (and its count is theirs)', !!card && card.you === fightYou && card.n === fightThem && fightYou === 1,
      card ? card.text.replace(/\s+/g, ' ') + ' -> the fight: ' + fightYou + ' of his, ' + fightThem + ' of theirs' : 'no card');
    /* home from that fight, and a clean crew for the board */
    for (let i = 0; i < 40; i++) { const h = await page.$('#fightFrame'); const ff = h ? await h.contentFrame() : null;
      if (ff && await ff.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) {
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }); break; }
      await page.waitForTimeout(250); }
    await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !window.CITYFIGHT), 15000);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    await waitFor(() => page.evaluate(() => !window.CITYFIGHT), 20000); await page.waitForTimeout(800);
    await fr.evaluate(() => { localStorage.setItem('bohemia.taken.v1', '[]'); });
    /* D1: the nearest town and a job its board offers; open it never done, then done */
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
    const boardRows = async () => {
      for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, t); await waitFor(settleOpen, 60000);
        if (await fr.evaluate(() => !!MEET.up)) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
      const sf = await (await fr.$('#settleFrame')).contentFrame(), TOUCH = PROFILE !== 'computer';
      for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')); const hb = await (await fr.$('#settleFrame')).boundingBox();
        if (xy) { if (TOUCH) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y); else await page.mouse.click(hb.x + xy.x, hb.y + xy.y); }
        if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 6000)) break; }
      const ids = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600);
      return ids;
    };
    await fr.evaluate(() => { LOOP.doneIds = []; });
    const before = await boardRows();
    const gone = before[0];
    await fr.evaluate((id) => { LOOP.doneIds = [id]; }, gone);
    const after = await boardRows();
    ok('D1 a job he finished is not on the town\'s board again (the same board offered it before it was done)', !!gone && after.indexOf(gone) < 0 && after.length > 0,
      t.n + ': before ' + before.join(', ') + '; done ' + gone + '; after ' + after.join(', '));
    const phone = await fr.evaluate((id) => { try { return (BohemiaPhoneBoard && BohemiaPhoneBoard.asks ? BohemiaPhoneBoard.asks() : []).map(a => a.id); } catch (e) { return null; } }, gone);
    ok('D2 nor on the phone', phone == null || phone.indexOf(gone) < 0, phone == null ? 'the phone list is not exposed here (it skips LOOP.doneIds, RUN 10/23)' : phone.length + ' asks, ' + gone + ' not among them');
    ok('R4 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close(); done();
})();
