/* ============================================================================
   THE TRADING HUB GATE (8/14/26)

   The demo cut, ruled 8/4, row 3: "GET PAID -> SPEND AT A TRADING HUB". GET PAID
   shipped 8/12. SPEND did not, and my own handoff said it was blocked on Paolo
   because "a price is a number, and numbers are his."

   THAT WAS WRONG AND I HAD NOT READ THE FILE. He ruled it three days earlier:

       @RULING PRICES A (Paolo 8/11): "Three goods, priced off the scarcity sim we
       already have."   records/BOHEMIA_VERDICT_ICONS_AND_DEMO_BLOCKERS_8_11_26.txt

   engine/bohemia_payday.js has carried PRICE_SOURCE='economy' ever since. The lane
   spent three days waiting for a ruling it already had. That is the seventh finished
   thing this week that never reached the surface he taps, and the first assertion
   below exists so a ruling can never again be treated as pending in the code that
   depends on it.

   WHAT THIS GATE HOLDS:
     1. the ruling is READ BACK, not re-asked: the price source is the scarcity sim
     2. a price is COMPUTED from stock, not typed -- and it MOVES when stock moves,
        monotonically, which is the only reason ruling A is worth having
     3. HIS TABLE STILL WINS: a price he names beats the sim, and his table is empty
     4. THE RUN ACTUALLY CALLS IT -- the assertion that would have caught the whole
        class of defect this lane keeps finding
     5. on the real surface: he stands in a hub the OVERMAP placed, the shelf opens,
        he buys, the balance really drops, and buying the last of something makes the
        next one dearer
     6. A MARKET IS A PLACE: standing somewhere else, there is no market button
     7. it rides the save, because a valley that forgets its stocks reprices to base
        on every reload
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PURSE = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const PAYDAY = require(path.join(ROOT, 'engine/bohemia_payday.js'));
const ECON = require(path.join(ROOT, 'engine/bohemia_economy.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('MARKET GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---- 1. the ruling is read back, never re-asked ------------------------- */
{
  ok('PRICES=A is READ BACK from the code that depends on it (Paolo 8/11), not re-asked',
     PAYDAY.PRICE_SOURCE === 'economy');
  const L = ECON.makeLedger(7, 40, 12);
  const p = PAYDAY.price(PURSE.create(), L, 'water');
  ok('so a price ANSWERS instead of refusing (' + JSON.stringify(p) + ')',
     p.source === 'economy' && typeof p.price === 'number' && p.price > 0);
}

/* ---- 2. the price is computed from stock, and it MOVES ------------------ */
{
  const rich = ECON.makeLedger(7, 40, 12);
  const poor = ECON.makeLedger(7, 40, 12);
  poor.stocks.water = Math.round(rich.stocks.water * 0.05);
  const a = ECON.price(rich, 'water'), b = ECON.price(poor, 'water');
  ok('a price is COMPUTED FROM STOCK, not typed: scarce water costs more than plentiful'
     + ' (' + a + ' -> ' + b + ')', b > a);
  /* monotone: every step down in stock must not lower the price */
  let prev = 0, mono = true;
  for (let s = rich.stocks.water; s >= 0; s = Math.floor(s / 2)) {
    const L = ECON.makeLedger(7, 40, 12); L.stocks.water = s;
    const v = ECON.price(L, 'water');
    if (v < prev) mono = false;
    prev = v;
    if (s === 0) break;
  }
  ok('and it moves MONOTONICALLY with scarcity, never bouncing', mono);
}

/* ---- 3. his table still wins, and it is still empty --------------------- */
{
  ok('HIS TABLE IS STILL EMPTY -- nobody typed a price into his canon',
     PURSE.PRICES && Object.keys(PURSE.PRICES).length === 0);
  const L = ECON.makeLedger(7, 40, 12);
  const sim = PAYDAY.price(PURSE.create(), L, 'water').price;
  PURSE.PRICES.water = sim + 99;                       /* pretend he named one */
  const ruled = PAYDAY.price(PURSE.create(), L, 'water');
  ok('but the DAY HE NAMES ONE it beats the sim, with no other change',
     ruled.source === 'ruled' && ruled.price === sim + 99);
  delete PURSE.PRICES.water;
  ok('(and the table is left exactly as empty as it was found)',
     Object.keys(PURSE.PRICES).length === 0);
}

/* ---- 4. buying is a real debit, and a hard sink ------------------------- */
{
  const L = ECON.makeLedger(7, 40, 12), purse = PURSE.create();
  const p = PAYDAY.price(purse, L, 'water').price;
  const broke = PAYDAY.buy(purse, null, 'water', 1, L);
  ok('with an empty purse a buy is REFUSED and says why (' + broke.reason + ')',
     broke.applied === false && broke.reason === 'CANNOT_AFFORD');
  PURSE.credit(purse, 'resources', Math.ceil(p) + 10, 'gate', 1);
  const before = PURSE.balance(purse, 'resources');
  const r = PAYDAY.buy(purse, null, 'water', 1, L);
  ok('and with money it goes through, in resources', r.applied === true && r.currency === 'resources');
  ok('the balance REALLY DROPPED by the price (' + before + ' -> '
     + PURSE.balance(purse, 'resources') + ')',
     Math.abs((before - PURSE.balance(purse, 'resources')) - r.paid) < 1e-9);
}

/* ---- 5. THE RUN ACTUALLY CALLS IT --------------------------------------- */
{
  const c = fs.readFileSync(CITY, 'utf8');
  ok('the run has a market', c.indexOf('__THE_TRADING_HUB__') >= 0);
  ok('BohemiaPayday.buy is CALLED by the run, not merely present', /BohemiaPayday\.buy\(/.test(c));
  ok('the hubs are READ OUT OF THE OVERMAP (MAP LAW: nothing placed here)',
     /BohemiaPayday\.nearestHub\(om,/.test(c));
  ok('and the ledger ages every nightfall so tomorrow is not today',
     /BohemiaEconomy\.advanceDay\(/.test(c));
  ok('the market rides the save', /market:MKT_LEDGER\?\{ledger:MKT_LEDGER/.test(c));
}

/* ---- 6. on the real surface -------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 120000 });
  for (let i = 0; i < 120; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 250);

  /* A MARKET IS A PLACE. Where he wakes up is not a swap meet, so there is no button. */
  const away = await pg.evaluate(() => {
    updHud();
    const h = mktHub();
    return { hub: h ? { x: h.x, y: h.y, kind: h.kind } : null, at: mktAt(),
             btn: getComputedStyle(document.getElementById('mktbtn')).display };
  });
  ok('the overmap has a hub and the run found it (' + JSON.stringify(away.hub) + ')', !!away.hub);
  ok('A MARKET IS A PLACE: standing anywhere else there is NO market button',
     away.at === false && away.btn === 'none');

  /* now stand in it -- the same move as tapping the plot on the builder map */
  const at = await pg.evaluate(() => {
    const h = mktHub();
    city.x = h.x; city.y = h.y; MODE = 'city';
    updHud();
    return { at: mktAt(), btn: getComputedStyle(document.getElementById('mktbtn')).display };
  });
  ok('standing IN the hub, the market button is there', at.at === true && at.btn === 'block');

  const shop = await pg.evaluate(() => {
    document.getElementById('mktbtn').click();
    const rows = mktShelf();
    const card = document.getElementById('daycardIn').textContent || '';
    return { rows: rows, card: card, n: document.querySelectorAll('#daycardIn .mrow').length,
             heads: (MKT_LEDGER || {}).agents };
  });
  ok('the shelf opened with real goods on it (' + shop.n + ' rows)', shop.n >= 3);
  ok('and it is sized by the valley\'s OWN people (' + shop.heads + ' heads)', shop.heads > 0);
  ok('every row carries a computed price, none of them typed',
     shop.rows.length > 0 && shop.rows.every(r => r.source === 'economy' && r.price > 0));
  ok('the card says what is left in the valley, not just a number',
     /days of it left in the valley/.test(shop.card));

  const buy = await pg.evaluate(() => {
    const good = mktShelf().sort((a, b) => a.price - b.price)[0].good;
    const p0 = mktShelf().filter(r => r.good === good)[0].price;
    const refused = mktBuy(good);                       /* broke: must be refused */
    BohemiaPurse.credit(purseGet(), 'resources', 500, 'gate', DAY.day);
    const before = purseBalances().resources;
    const r = mktBuy(good);
    const p1 = mktShelf().filter(r2 => r2.good === good)[0].price;
    return { good: good, refused: refused && refused.reason, applied: r && r.applied,
             paid: r && r.paid, before: before, after: purseBalances().resources,
             p0: p0, p1: p1, bought: window.__BOUGHT || 0 };
  });
  ok('broke, the run refuses the sale out loud (' + buy.refused + ')',
     buy.refused === 'CANNOT_AFFORD');
  ok('HE CAN SPEND AT A TRADING HUB -- bought ' + buy.good + ' for ' + buy.paid,
     buy.applied === true && buy.bought >= 1);
  ok('and the money really left the purse (' + buy.before + ' -> ' + buy.after + ')',
     Math.abs((buy.before - buy.after) - buy.paid) < 1e-9);
  ok('a HARD SINK: buying the stock makes the next one dearer, never cheaper ('
     + buy.p0 + ' -> ' + buy.p1 + ')', buy.p1 >= buy.p0);

  /* the phone tells him WHERE it is, because that is what makes the walk worth it */
  const ph = await pg.evaluate(() => phoneState().market);
  ok('the phone knows where the market is', !!ph && !!ph.cell && ph.at === true);

  /* and it survives the night AND the reload */
  const night = await pg.evaluate(() => {
    const w0 = MKT_LEDGER.stocks.water;
    advance(20 * 60);                                  /* nightfall */
    const w1 = MKT_LEDGER.stocks.water;
    return { w0: w0, w1: w1, day: DAY.day };
  }).catch(e => ({ err: e.message }));
  ok('a day passes in the valley too -- stock moved overnight ('
     + (night && !night.err ? night.w0 + ' -> ' + night.w1 : 'ERR ' + (night && night.err)) + ')',
     !!night && !night.err && night.w1 !== night.w0);

  ok('no page error across a day at the market' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 7. AND ON THE SURFACE HE ACTUALLY TAPS ---------------------------
     VERIFY ON THE REAL SURFACE (7/18): the city page is where I develop, the
     ALPHA'S RUN TAB is where Paolo stands. Six times this week this lane has found
     finished work that never reached him, and every one of them was green in the
     file it lived in. So the sale is made again, through the tab. */
  {
    const CITY_APP = require(path.join(ROOT, 'gates/bohemia_city_app.js'));
    const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
    const pg2 = await b.newPage({ viewport: { width: 390, height: 844 } });
    await pg2.route(/^https?:/, r => r.abort());
    await pg2.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(pg2, 2500);
    await pg2.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(pg2, 1200);
    await pg2.evaluate(() => {
      const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('THE RUN TAB IS GONE from the alpha tab bar');
      t.click();
    });
    let fr = null;
    for (let i = 0; i < 20; i++) {
      await SETTLE(pg2, 2500);
      fr = pg2.frames().find(f2 => CITY_APP.isFrame(f2, pg2));
      if (!fr) continue;
      const up = await fr.evaluate(() => typeof mktHub === 'function' && typeof om !== 'undefined'
        && document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted inside the alpha', !!fr);
    if (fr) {
      const sold = await fr.evaluate(() => {
        const c = document.getElementById('daycardIn');
        const go = c && c.querySelector('.dcgo'); if (go) go.click();
        const h = mktHub();
        city.x = h.x; city.y = h.y; MODE = 'city';
        updHud();
        const btn = getComputedStyle(document.getElementById('mktbtn')).display;
        document.getElementById('mktbtn').click();
        const good = mktShelf().sort((a, b) => a.price - b.price)[0].good;
        BohemiaPurse.credit(purseGet(), 'resources', 500, 'gate', DAY.day);
        const before = purseBalances().resources;
        const r = mktBuy(good);
        return { btn: btn, good: good, applied: r && r.applied, paid: r && r.paid,
                 before: before, after: purseBalances().resources,
                 rows: document.querySelectorAll('#daycardIn .mrow').length };
      });
      ok('THROUGH THE RUN TAB HE ACTUALLY STANDS IN: the market button is there and the '
         + 'shelf opens (' + sold.rows + ' rows)', sold.btn === 'block' && sold.rows >= 3);
      ok('and he buys ' + sold.good + ' for ' + sold.paid + ' with the money really leaving ('
         + sold.before + ' -> ' + sold.after + ')',
         sold.applied === true && Math.abs((sold.before - sold.after) - sold.paid) < 1e-9);
    }
    await pg2.close();
  }

  await b.close();
  done();
})();
