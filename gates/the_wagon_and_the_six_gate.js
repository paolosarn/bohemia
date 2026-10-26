/* ==========================================================================
   THE WAGON AND THE SIX  (RUN TWO, 10/25/26, VAMILY [eyes: four currencies] + [every origin starts like itself])

   PAOLO 10/24 (rule 164 item 2): "we have four different currencies in this game, you're only showing batteries, it's insane."
   EYES 10/25: on BUILD 10/25o the bar carried the batteries alone, phone and computer, through two hours of play.
   ECONOMY (records/BOHEMIA_ECONOMY_DAY_80_HOW_MANY_CURRENCIES_HIS_FOUR_ARE_BATTLE_BROTHERS_FOUR_AND_THE_GAME_COUNTS_ONE_10_25_26.md):
   only ONE of the six was a real number; the stall sold water, meds and rounds for a battery that bought nothing.
   NOW (__THE_WAGON__): the company's counts in bohemia.supplies.v1, seeded at the door once a game: FOOD and WATER the origin's
   food_days of the bill in the wagon (TUNING), TAPE, ROUNDS and MEDS its Battle Brothers start for the shelves picked (the wiki's
   Starting Funds table); the night eats the wagon before the batteries; the stall and the loot add to it; the fight pit pays its men.

   LEGS:
     C1 the file: every origin carries the wiki's Tools, Ammunition and Medicine for its three funds (its crowns the file's), and
        every door block its food_days
     C2 *** THE FIVE FROM THE FIRST MINUTE *** (the demo, the phone, NEW GAME and BEGIN as a stranger does): batteries, food (food
        and water, one count since rule 209), tape, meds and rounds stand on the bar with the origin's numbers; no water alone
     C3 the night: the wagon feeds the crew first and the batteries are not touched; an empty wagon is the batteries' bill as before;
        the nights left count the wagon
     C4 the stall (real taps in a town): a dose of meds, six rounds, a night of food and water each go into their count, and the
        bar says so
     C9 a save from before (rations and jugs apart) folds into the one count, nothing lost, and water is gone from it
     C5 the loot's rounds go into ROUNDS (the spoils screen, LOOT ALL)
     C6 the fight pit pays its three men their 6 a night; the Lone Wolf on bare shelves starts with 5 tape, 3 meds, no rounds
     C7 the computer: the six on the bar
     C8 NEW GAME forgets the wagon (the start screen's list names it); nothing threw
   node gates/the_wagon_and_the_six_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE WAGON AND THE SIX: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const FILE = J('records/target/bb/origins.json'), BY = {}; FILE.origins.forEach(o => { BY[o.id] = o; });
const BAR = () => { const r = document.getElementById('bmtb'); const o = {}; [...(r ? r.querySelectorAll('.s.six') : [])].forEach(e => { const b = e.querySelector('b'); o[e.dataset.f] = b ? +b.textContent : null; }); return o; };
const KEYS = ['food', 'tape', 'meds', 'rounds'];   /* RE-AIMED 10/26 (rule 209, [food and water are one]): food and water one count, the bar five */

(async () => {
  /* ---- C1 ---- */
  const c1 = FILE.origins.filter(o => !o.supplies || ['tape', 'rounds', 'meds'].some(k => ['full', 'thin', 'bare'].some(e => typeof o.supplies[k][e] !== 'number'))
    || !/bb_all\//.test(o.supplies.source) || !(o.door && o.door.food_days >= 3));
  ok('C1 the file: every origin carries the wiki\'s tools, ammunition and medicine at its three funds, every door its food_days (A NEW CREW: tape ' + BY.newcrew.supplies.tape.full + ', rounds ' + BY.newcrew.supplies.rounds.full + ', meds ' + BY.newcrew.supplies.meds.full + '; the water truck ' + BY.truck.door.food_days + ' days)',
    c1.length === 0 && BY.newcrew.supplies.tape.full === 40 && BY.wolf.supplies.rounds.bare === 0 && BY.truck.door.food_days === 19, c1.map(o => o.id).join(' ') || 'all 15');

  let d, pick = null;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg);
    for (let i = 0; i < 60; i++) { if (await pg.evaluate(() => !!(window.BohemiaOriginStart && BohemiaOriginStart.data.ready))) break; await pg.waitForTimeout(250); }
    pick = await pg.evaluate(() => ({ origin: BOH_START.state.origin, econ: BOH_START.state.econ })); } }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(3500);
    /* ---- C2 ---- */
    const o = BY[pick.origin], n = o.men.length, dd = o.door.food_days;
    const want = { food: dd * n, tape: o.supplies.tape[pick.econ], meds: o.supplies.meds[pick.econ], rounds: o.supplies.rounds[pick.econ] };
    const bar0 = await fr.evaluate(BAR), bats0 = await fr.evaluate(() => loopBats());
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'the_six_phone.png') });
    ok('*** C2 THE FIVE FROM THE FIRST MINUTE *** (the phone, ' + o.name + ' on ' + pick.econ + ' shelves: ' + JSON.stringify(bar0) + ')',
      bar0.batteries === bats0 && KEYS.every(k => bar0[k] === want[k]) && !('water' in bar0), 'the file says ' + JSON.stringify(want));
    /* ---- C3 ---- */
    const night = await fr.evaluate(() => { const b0 = loopBats(), d0 = billDaysLeft(); const r = crewBillNight(); return { fell: b0 - loopBats(), ate: r.ate, paid: r.paid, d0, w: JSON.parse(localStorage.getItem('bohemia.supplies.v1')) }; });
    const empty = await fr.evaluate(() => { const w = JSON.parse(localStorage.getItem('bohemia.supplies.v1')); const keep = Object.assign({}, w); w.food = 0; delete w.water; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w));
      const b0 = loopBats(), crew = crewCount(), r = crewBillNight(), fell = b0 - loopBats(); loopSettleBats(b0, 'the gate'); localStorage.setItem('bohemia.supplies.v1', JSON.stringify(keep)); return { fell, crew, per: BILL.per_man, wages: r.wages }; });
    ok('C3 the night: the wagon feeds the crew first (a night of food and water a man, no batteries); an empty wagon is the batteries\' bill as before; the nights left count the wagon',
      night.fell === 0 && night.ate && night.ate.food === n && !('water' in night.ate) && night.w.food === want.food - n && !('water' in night.w) && empty.fell === empty.crew * empty.per + empty.wages && night.d0 >= dd,
      JSON.stringify({ night: { fell: night.fell, ate: night.ate, left: night.w.food }, empty, nightsLeft: night.d0 }));
    /* ---- C4 the stall, real taps ---- */
    await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    let c4 = null;
    if (sf) {
      await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
      const box = await (await sf.frameElement()).boundingBox(), before = await sf.evaluate(() => JSON.parse(localStorage.getItem('bohemia.supplies.v1')));
      for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; const w = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (w) await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(800); }
      for (const label of ['A dose of meds', 'Six rounds', 'Food and water, a night for one man']) {
        /* RE-AIMED 10/26 BY RUN TWO (rule 249, [sell at the stall]): a line is BUY and SELL side by side; two quick taps on BUY buy one */
        const r = await sf.evaluate((l) => { const ln = [...document.querySelectorAll('#sbody .act')].find(x => x.textContent.indexOf(l) >= 0), b = ln && (ln.querySelector('.sb[data-side=buy]') || ln); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, label);
        if (r) { await P.touchscreen.tap(box.x + r.x, box.y + r.y); await P.waitForTimeout(120); await P.touchscreen.tap(box.x + r.x, box.y + r.y); } await P.waitForTimeout(700); }
      const after = await sf.evaluate(() => JSON.parse(localStorage.getItem('bohemia.supplies.v1')));
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(500);
      const tbar = await sf.evaluate(BAR);
      await sf.evaluate(() => { const l = document.getElementById('leave'); if (l) l.click(); }); await P.waitForTimeout(1500);
      const mbar = await fr.evaluate(BAR);
      c4 = { d: { meds: after.meds - before.meds, rounds: after.rounds - before.rounds, food: after.food - before.food }, water: 'water' in after, tbar, mbar, after };
    }
    ok('C4 the stall, real taps: a dose of meds +1, six rounds +6, a night of food and water +1, and the bar says so in the town and on the map',
      !!c4 && c4.d.meds === 1 && c4.d.rounds === 6 && c4.d.food === 1 && !c4.water && KEYS.every(k => c4.mbar[k] === c4.after[k]) && (Object.keys(c4.tbar).length === 0 || KEYS.every(k => c4.tbar[k] === c4.after[k])),
      JSON.stringify(c4 && { added: c4.d, mapBar: c4.mbar, townBar: c4.tbar }));
    /* ---- C9 a save from before ---- */
    const c9 = await fr.evaluate(() => { const keep = localStorage.getItem('bohemia.supplies.v1'); const w = JSON.parse(keep); w.food = 21; w.water = 20; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w));
      const got = wagonGet(), stored = JSON.parse(localStorage.getItem('bohemia.supplies.v1')); localStorage.setItem('bohemia.supplies.v1', keep); return { food: got.food, water: 'water' in got, storedWater: 'water' in stored }; });
    ok('C9 a save from before (21 rations, 20 jugs) folds into one count, ' + c9.food + ' nights of food and water, nothing lost; water is gone from it', c9.food === 21 && !c9.water && !c9.storedWater, JSON.stringify(c9));
    /* ---- C8a ---- */
    const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
    const forgot = await P.evaluate(() => { BohemiaOriginStart.forget(); return localStorage.getItem('bohemia.supplies.v1'); });
    ok('C8a NEW GAME forgets the wagon (the start screen\'s forget list names it; the engine\'s forget clears it)', /'bohemia\.supplies\.v1'[^\]]*\]\.forEach/.test(demo)   /* RE-AIMED 10/26 BY RUN TWO: other lanes' keys follow the wagon's in the one list */ && forgot === null);
    /* ---- C6 the pit and the wolf, through the door's own ask ---- */
    const c6 = await P.evaluate(() => { const out = {};
      [['pit', 'full'], ['wolf', 'bare']].forEach(([id, e]) => { BohemiaOriginStart.forget(); BOH_START.state.origin = id; BOH_START.state.econ = e; BOH_START.picks(); out[id] = JSON.parse(localStorage.getItem('bohemia.supplies.v1')); });
      return out; });
    const pitWage = await fr.evaluate((w) => { localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w)); return { wages: billWages(), crew: crewCount() }; }, c6.pit);
    ok('C6 the fight pit pays its founding men 6 a night each (' + pitWage.wages + ' for ' + pitWage.crew + '); the Lone Wolf on bare shelves starts with 5 tape, 3 meds, no rounds and a week of food',
      c6.pit.wage === 6 && pitWage.wages === 6 * pitWage.crew && c6.wolf.tape === 5 && c6.wolf.meds === 3 && c6.wolf.rounds === 0 && c6.wolf.food === 7, JSON.stringify({ pit: c6.pit, wolf: c6.wolf }));
    ok('C8b nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the phone legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* ---- C5 the loot's rounds (the spoils screen on its own sample) ---- */
  const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
  const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); } rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright'); const b = await chromium.launch();
  try {
    const sp = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
    await sp.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SPOILS_SCREEN.html');
    await sp.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
    const r0 = await sp.evaluate(() => { localStorage.setItem('bohemia.supplies.v1', JSON.stringify({ origin: 'newcrew', food: 21, water: 21, tape: 40, meds: 30, rounds: 80 })); localStorage.setItem('bohemia.bag.v1', '[]');
      BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 }); return (BohemiaSpoilsScreen.state.counts || {}).rounds | 0; });
    await sp.tap('#lootall'); await sp.waitForTimeout(300);
    const r1 = await sp.evaluate(() => JSON.parse(localStorage.getItem('bohemia.supplies.v1')).rounds);
    ok('C5 the loot\'s rounds go into ROUNDS (LOOT ALL, a real tap: ' + r0 + ' rounds on the ground, 80 -> ' + r1 + ')', r0 > 0 && r1 === 80 + r0);
    /* ---- C7 the computer ---- */
    await b.close();
    let c;
    c = await drive.open({ profile: 'computer', keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); for (let i = 0; i < 60; i++) { if (await pg.evaluate(() => !!(window.BohemiaOriginStart && BohemiaOriginStart.data.ready))) break; await pg.waitForTimeout(250); } } });
    await c.page.waitForTimeout(3500);
    const cb = await c.fr.evaluate(BAR);
    if (process.env.BOHEMIA_SHOT_DIR) await c.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'the_six_computer.png') });
    ok('C7 the computer: the six on the bar from the first minute', ['batteries'].concat(KEYS).every(k => typeof cb[k] === 'number') && cb.food > 0, JSON.stringify(cb));
    await c.close();
  } catch (e) { ok('the spoils and computer legs ran [' + String(e.message).slice(0, 200) + ']', false); try { await b.close(); } catch (_e) {} }
  srv.close();
  done();
})();
