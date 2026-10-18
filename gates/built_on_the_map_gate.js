/* THE LOTS ARE KEPT — was the gate for [built on the map] (10/9/26, LIFE + CITY); RETIRED AND RE-AIMED 10/10 by rule 86
 *
 * Rule 40b: what is built shows on the map and in the derived future. On THE ALPHA, reached by the pinch:
 *   A  the map owns the lots: lotBookFor(place) hands the settlement screen the SAME object.
 *   B  at your base (your outfit's own, the map's answer) a wall and a tank start for one battery each;
 *      a place you do not hold refuses by name.
 *   C  THE MORNING (the game's own SLEEP, then its wake): both stand, the map's century ledger (the one the
 *      derive reads) counts two more builds, and the tank pays its water into the map's purse.
 *   D  AND THE MAP DRAWS NOTHING OF THEM (rule 86, the seventh votes: 'the map is mainly for looks'; Paolo DOWN on the
 *      picture of them at the base). What you build lives in the settlement screen and nowhere else.
 *   E  THE SAVE CARRIES THEM: citySnapshot() holds the lots; applyRestore() of a fresh book brings them back.
 *   F  MUTATION: a morning with no lots in the book finishes nothing.
 * Run:  node gates/built_on_the_map_gate.js
 */
'use strict';
const path = require('path');
const D = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };
(async () => {
  const d = await D.open({ alpha: true });
  try {
    await d.toMap();
    for (let i = 0; i < 3; i++) { await d.pinchIn(); await d.page.waitForTimeout(1500); if (await d.fr.evaluate(() => CZOOM) > 0.5) break; }
    const a = await d.fr.evaluate(() => {
      const bases = ctBases(), names = Object.keys(bases), mine = names.find(n => lotIsMine(n)), other = names.find(n => !lotIsMine(n));
      const site = lotBookFor(mine), P = purseGet();
      BohemiaPurse.credit(P, 'electricity', 3, 'gate', 'gate', DAY.day);
      const b0 = BohemiaPurse.balance(P, 'electricity'), r0 = BohemiaPurse.balance(P, 'resources');
      const w = BohemiaLotBuild.start(site, P, { x: 0, y: 0 }, 'wall', DAY.day, lotHoldFor(mine));
      const t = BohemiaLotBuild.start(site, P, { x: 1, y: 0 }, 'tank', DAY.day, lotHoldFor(mine));
      const no = BohemiaLotBuild.start(lotBookFor(other), P, { x: 0, y: 0 }, 'wall', DAY.day, lotHoldFor(other));
      window.__g = { mine: mine, c0: BohemiaCentury.through(centuryGet(), null).built, r0: r0 };
      city.x = bases[mine].x; city.y = bases[mine].y;
      return { mine: mine, same: lotBookFor(mine) === site, spent: b0 - BohemiaPurse.balance(P, 'electricity'),
               ok: w.ok && t.ok, no: no.why, standing: Object.values(site.lots).filter(l => l.done).length };
    });
    ok('A the map owns the lots and hands out the same object', a.same, 'your base is ' + a.mine);
    ok('B at your base a wall and a tank start, one battery each', a.ok && a.spent === 2, 'spent ' + a.spent);
    ok('B and nothing stands yet', a.standing === 0);
    ok('B a place you do not hold refuses by name', a.no === 'NOT_HELD', a.no);
    const c = await d.fr.evaluate(async () => {
      document.getElementById('sleepbtn').click(); await new Promise(r => setTimeout(r, 600));
      const go = document.querySelector('#daycardIn .dcgo'); if (go) go.click(); else DAY.wake();
      await new Promise(r => setTimeout(r, 600)); render();
      const site = lotBookFor(window.__g.mine);
      return { standing: Object.values(site.lots).filter(l => l.done).map(l => l.id).join(),
               c1: BohemiaCentury.through(centuryGet(), null).built, r1: BohemiaPurse.balance(purseGet(), 'resources'),
               drawn: (MAP_DREW && MAP_DREW.built && MAP_DREW.built[window.__g.mine]) || 0 };
    });
    const g = await d.fr.evaluate(() => window.__g);
    ok('C *** THE MORNING: both stand ***', c.standing === 'wall,tank', c.standing);
    ok('C *** the map\'s century ledger (the derive\'s) counts two more ***', c.c1 === g.c0 + 2, g.c0 + ' -> ' + c.c1);
    ok('C the tank pays its water into the map\'s purse', c.r1 === g.r0 + 1, g.r0 + ' -> ' + c.r1);
    ok('D *** the map draws nothing of them (rule 86) ***', c.drawn === 0, c.drawn + ' drawn');
    const e = await d.fr.evaluate(() => {
      const snap = citySnapshot(), lots = snap && snap.lots && snap.lots[window.__g.mine];
      const keep = LOT_BOOK; LOT_BOOK = {}; applyRestore(JSON.parse(JSON.stringify(snap)));
      const back = LOT_BOOK[window.__g.mine]; const n = back ? Object.values(back.lots).filter(l => l.done).length : 0;
      LOT_BOOK = keep; return { saved: lots ? Object.keys(lots.lots).length : 0, back: n };
    });
    ok('E the save carries the lots', e.saved === 2, e.saved + ' saved');
    ok('E and a restore brings them back standing', e.back === 2, e.back + ' back');
    const f = await d.fr.evaluate(() => { const keep = LOT_BOOK; LOT_BOOK = {}; const n = lotWake(); LOT_BOOK = keep; return n; });
    ok('F MUTATION: a morning with an empty book finishes nothing', f === 0);
    ok('nothing threw', d.errs.length === 0, d.errs.join(' | ').slice(0, 200));
  } finally { await d.close(); }
  console.log('\nTHE LOTS ARE KEPT GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
