const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE ROAD LEAVES SOMETHING BEHIND (8/27/26, RUN lane)

     Paolo 8/25, the playtest dispatch, item 8: "ENEMIES, LOOT, and Valheim-style
     DANGER BY PLACE."

   The enemies landed this morning and NOTHING CAME OFF THEM. A road that stops
   you twelve times on the way across the valley and hands you nothing is a toll
   booth.

   WHAT THIS GATE IS REALLY HOLDING, and it is not "loot exists":

   A. IT LANDS IN THE ECONOMY THAT ALREADY EXISTS. Bohemia has GOODS with
      researched values and SALVAGE as the numeraire, and a purse with three
      LOCKED currencies. Loot is not a new item table; it is resources in the
      ledger the game already keeps. So the balance really moves, and it moves by
      exactly the sum of what was left. A number that does not reach the ledger is
      an orphan waiting five weeks to be discovered, which is this repo's
      signature failure.
   B. IT IS A FAUCET AND ONLY A FAUCET. TEN YEARS COLD clause 2 bans "prices that
      move on a clock ... any market the player reads or plays", and draws its own
      boundary: "A tag is fine. A market is not." So every entry is kind `source`
      and the two [PENDING Paolo] tables stay empty.
   C. MOST OF IT IS NOTHING, AND THAT IS THE FEATURE. The crash was ten years ago
      and real collapse looting takes the food and water inside 48 hours. Five of
      the twelve road moments leave nothing at all.
   D. NOTHING IS EVER TAKEN FROM HIM. the_snatcher's approved ends is "loss
      without death", but the beat-timed chase that makes that fair is not built,
      and an unavoidable loss you cannot win back is a tax wearing the mechanic's
      name. No debit, ever, until the chase exists.
   E. AND THE AMOUNT IS DERIVED, NOT PICKED. It answers one question: how much
      MANUFACTURED STUFF was that thing carrying? Animals nothing, the man with no
      shoes nothing, the dead machine the most.

   node gates/the_road_leaves_something_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE ROAD LEAVES SOMETHING: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1500);

    /* ---- E. THE TABLE IS DERIVED, AND THE DERIVATION IS CHECKABLE -------- */
    const tbl = await city.evaluate(() => ({
      have: typeof ROAD_LEAVINGS !== 'undefined',
      t: (typeof ROAD_LEAVINGS !== 'undefined') ? ROAD_LEAVINGS : null,
      roster: (typeof BohemiaEncounters !== 'undefined')
        ? BohemiaEncounters.ROSTER.map(r => r.id) : [] }));
    ok('every approved token has a ruling about what it leaves, so nothing falls '
      + 'through a hole (' + (tbl.t ? Object.keys(tbl.t).length : 0) + ' of '
      + tbl.roster.length + ')',
      tbl.have && tbl.roster.length === 12
      && tbl.roster.every(id => typeof tbl.t[id] === 'number'));
    const zero = tbl.t ? tbl.roster.filter(id => tbl.t[id] === 0) : [];
    ok('*** MOST OF THE ROAD LEAVES NOTHING, AND THAT IS THE POINT *** -- ' + zero.length
      + ' of 12 give nothing. The crash was TEN YEARS ago and the food and water '
      + 'went in the first 48 hours', zero.length >= 5);
    ok('THE ANIMALS CARRY NO CARGO, because a salvage economy wants metal and not '
      + 'meat -- dogs, coyote and snake all zero',
      tbl.t && tbl.t.feral_dog_pack === 0 && tbl.t.coyote_shadow === 0
      && tbl.t.rattlesnake === 0);
    ok('AND THE DEAD MACHINE LEAVES THE MOST, which is the one place the fiction '
      + 'and the economy say the same thing (bot ' + (tbl.t && tbl.t.casino_security_bot)
      + ' vs wanderer ' + (tbl.t && tbl.t.crazed_wanderer) + ')',
      tbl.t && tbl.t.casino_security_bot >= 3
      && tbl.t.casino_security_bot > tbl.t.crazed_wanderer);

    /* ---- A + B + C + D. A REAL CROSSING, AGAINST THE REAL LEDGER --------- */
    const run = await city.evaluate(async () => {
      MODE = 'city';
      const D = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      const before = BohemiaPurse.balance(purseGet(), 'resources');
      const fired = [];
      let steps = 0, card = null, sawZeroCard = false;
      for (let i = 0; i < 300 && steps < 140; i++) {
        const [dx, dy] = D[i % 8];
        const nx = city.x + dx, ny = city.y + dy;
        if (!cityWalkable(nx, ny)) continue;
        city.x = nx; city.y = ny; advance(10);
        steps++;
        const g = roadInterrupt(600);
        if (g && g.fired) {
          const kg = ROAD_LEAVINGS[g.id] || 0;
          fired.push({ id: g.id, kg: kg });
          const txt = document.getElementById('daycardIn').textContent;
          if (kg > 0 && !card) card = { kg: kg, text: txt };
          if (kg === 0 && /LEFT ON THE ROAD/.test(txt)) sawZeroCard = true;
        }
        try { cardHide(); } catch (e) { }
      }
      const after = BohemiaPurse.balance(purseGet(), 'resources');
      const expect = fired.reduce((a, f) => a + f.kg, 0);
      const p = purseGet();
      const mine = p.entries.filter(e => /^road:/.test(e.ref || ''));
      return { steps: steps, fired: fired.length, expect: expect,
               before: before, after: after, moved: after - before,
               entries: mine.length,
               kinds: Array.from(new Set(mine.map(e => e.kind))),
               currencies: Array.from(new Set(mine.map(e => e.currency))),
               debits: mine.filter(e => e.amount < 0).length,
               dry: fired.filter(f => f.kg === 0).length,
               card: card, sawZeroCard: sawZeroCard,
               taken: (typeof ROAD_TAKEN !== 'undefined') ? ROAD_TAKEN : -1 };
    });

    ok('the gauge really crossed the valley (' + run.steps + ' cells, ' + run.fired
      + ' road moments)', run.steps >= 40 && run.fired >= 4);
    /* *** THE CLAIM THAT MATTERS. A number that never reaches the ledger is an
       orphan, and this repo has five weeks of receipts for what that costs. */
    ok('*** WHAT THE ROAD LEAVES REALLY LANDS IN HIS PURSE *** -- balance moved '
      + run.before + ' -> ' + run.after + ' and the road accounted for exactly '
      + run.expect, run.expect > 0 && run.moved === run.expect
      && run.taken === run.expect);
    ok('and it is in the currency the economy already counts, not a new one ('
      + JSON.stringify(run.currencies) + ')',
      run.currencies.length === 1 && run.currencies[0] === 'resources');
    /* B. A TAG IS FINE, A MARKET IS NOT. */
    ok('*** IT IS A FAUCET AND ONLY A FAUCET *** -- every road entry is kind '
      + '"source", so nothing converts, drifts or moves by itself ('
      + JSON.stringify(run.kinds) + ')',
      run.kinds.length === 1 && run.kinds[0] === 'source');
    ok('and the two tables he has never ruled on are still empty and still his',
      await city.evaluate(() => {
        try {
          return Object.keys(BohemiaPurse.PRICES || {}).length === 0
              && Object.keys(BohemiaPurse.PAYOUT || {}).length === 0;
        } catch (e) { return false; }
      }));
    /* D. NOTHING IS EVER TAKEN. */
    ok('*** AND NOTHING IS EVER TAKEN FROM HIM *** -- not one debit on the road, '
      + 'because the snatcher\'s chase is not built and a loss you cannot win '
      + 'back is a tax wearing a mechanic\'s name (' + run.debits + ' debits)',
      run.debits === 0);
    /* C. */
    ok('and a real crossing really is mostly dry (' + run.dry + ' of ' + run.fired
      + ' left nothing)', run.dry > 0);

    ok('*** AND HE SEES WHAT HE PICKED UP *** (' + (run.card
      ? run.card.kg + ' kg on the card' : 'NO CARD WITH LOOT') + ')',
      !!(run.card && /LEFT ON THE ROAD/.test(run.card.text)
         && new RegExp(run.card.kg + ' KG').test(run.card.text)));
    ok('and an empty road never prints a zero row, because a "LEFT BEHIND: 0" '
      + 'every time teaches him to stop reading the card', run.sawZeroCard === false);

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: ' + run.fired + ' road moments over ' + run.steps
      + ' cells · ' + run.dry + ' left nothing · purse ' + run.before + ' -> '
      /* *** THIS LINE PRINTS WHAT WAS MEASURED, NOT WHAT I EXPECTED. *** It read
         "... source entries · 0 debits" with BOTH of those hardcoded, and a
         mutation caught it saying "0 debits" on the same run where the claim
         above it reported 3. A summary that cannot disagree with me is
         decoration, and this is the third time this exact shape has turned up in
         this lane's gates. Every number below now comes from the run. */
      + run.after + ' resources across ' + run.entries + ' road entries ('
      + run.kinds.join('/') + ') · ' + run.debits + ' debits');
    console.log('  MINE, NOT HIS, AND CORRECTABLE IN ONE WORD: 0 kg dogs/coyote/'
      + 'snake/wanderer/snatcher, 1 scavenger + robotaxi, 2 drone + toll crew, '
      + '3 patrols colliding + dead casino bot. The GOODS values, the three '
      + 'currencies and the empty PRICES table are all his.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
