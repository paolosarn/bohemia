/* ============================================================================
   TWO PRICES GATE (9/15/26, WORLD lane) -- board row [two prices] /
   ONE-PRICE-IN-THE-WHOLE-VALLEY, as RE-AIMED by Paolo 9/15.

   WHAT THIS DEFENDS: his pillar, and the tutorial it nearly cost.
     * EVERYTHING COSTS ONE holds everywhere for everyone. NO PRICE ABOVE ONE, on
       any shelf, at any market, at any rung. That is checked on the real map.
     * A CAMP WILL NOT TAKE A STRANGER'S BATTERY (ruling 8, 9/13), and BARTER_ONLY
       -- dead in bohemia_payday since it was written -- is the reason it gives.
     * AND THE FIRST BAG OF RICE STILL COSTS ONE BATTERY. This lane shipped a
       stranger's surcharge last round, it made the tutorial cost two days' work,
       and it was taken back out (aa3ca379). This check is the tripwire on that.

   node gates/two_prices_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const BA = require(path.join(ROOT, 'engine/bohemia_barter.js'));
const PU = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const BE = require(path.join(ROOT, 'engine/bohemia_belonging.js'));
const TO = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const GR = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('TWO PRICES GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (nothing anywhere costs more than one battery, a camp will not take'
            + ' a stranger\'s money, and the first bag of rice still costs one)');
  process.exit(fail ? 1 : 0);
};
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
            .replace(/'(\\.|[^'\\])*'/g, "''")
            .replace(/"(\\.|[^"\\])*"/g, '""');
}

/* ---- 1. *** HIS PILLAR: NOTHING COSTS MORE THAN ONE *** ----------------- */
{
  const goods = Object.keys(PU.PRICES);
  ok('every good he has ruled costs exactly one (' + goods.length + ' goods)',
     goods.length > 0 && goods.every(g => PU.PRICES[g].amount === 1));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_barter.js'), 'utf8');
  const body = code(src);
  ok('the barter module names no price at all', !/price/i.test(body));
  ok('and no multiplier, rate or random anywhere in it',
     !/Math\.random|\brate\b|\bmult/i.test(body));
}

/* ---- 2. WHO IS REFUSED, AND IT IS READ NOT TYPED ------------------------ */
{
  ok('the stranger rung is read off his ladder (' + BA.strangerAt() + ')',
     BA.strangerAt() === Math.min.apply(null, BE.RUNGS.map(r => r.at)));
  ok('*** ONLY A CAMP, ONLY A STRANGER ***',
     BA.wantsGoods('camp', 0) === true
     && BA.wantsGoods('camp', 6) === false
     && BA.wantsGoods('town', 0) === false
     && BA.wantsGoods('fortress', 0) === false);
  /* BEHAVIOURAL, not a source scan: move the bottom rung and the door moves */
  const row = BE.RUNGS.filter(r => r.at === 0)[0], was = row.at;
  const before = BA.strangerAt();
  row.at = 2;                        /* the old floor moves up past peripheral */
  const after = BA.strangerAt();
  const flips = BA.wantsGoods('camp', after) === true
             && BA.wantsGoods('camp', after + 1) === false;
  row.at = was;
  ok('*** MOVE THE BOTTOM RUNG AND THE REFUSAL MOVES WITH IT *** (floor '
     + before + ' -> ' + after + ')', after !== before && flips
     && BA.strangerAt() === before);
  ok('a tier the graph does not have is not a barter market',
     BA.wantsGoods('nonsense', 0) === false && BA.offer({ tier: 'town', given: 0 }) === null);
  const tiers = TO.tiers(GR, 1);
  const camps = Object.keys(tiers).filter(k => tiers[k].tier === 'camp');
  ok('the valley really has camps to be refused at (' + camps.join(', ') + ')', camps.length > 0);
  ok('*** AND THE CHURCH, WHOSE MARKET HE WAKES BESIDE, IS NOT ONE OF THEM ***',
     tiers.Church && tiers.Church.tier !== 'camp');
}

/* ---- 3. THE OFFER SAYS WHAT IT IS AND MOVES NOTHING --------------------- */
{
  const p = PU.create(); PU.credit(p, 'resources', 2, 'x', 'y', 0);
  const before = JSON.stringify(PU.balances(p));
  const o = BA.offer({ tier: 'camp', given: 0, good: 'food', purse: p });
  ok('a camp asks a stranger for goods, not money', o && o.barter === true && o.wants === 'resources');
  ok('and asking moves nothing', JSON.stringify(PU.balances(p)) === before);
  ok('it carries the ruling it is executing', /ruling 8/.test(o.ruling || ''));
  ok('the words are an attempt and name no number',
     BA.draft === true && !/\d/.test(BA.say(o)) && BA.tag(o).length > 0);
  ok('nothing is said where there is nothing to explain',
     BA.say(null) === '' && BA.tag(null) === '');
}

/* ---- 4. AND IT ALL HAPPENS IN THE GAME, AT REAL MARKETS ON THE REAL MAP -- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 400);

  const r = await pg.evaluate(() => {
    const R = { module: typeof window.BohemiaBarter };
    if (R.module !== 'object') return R;
    const P = window.BohemiaPurse, p = purseGet();

    /* THE TUTORIAL, where he actually wakes */
    R.startWho = mktWho() && { holder: mktWho().holder, tier: mktWho().tier };
    P.credit(p, 'electricity', 8, 'gate', 'g', 0);
    const e0 = P.balances(p).electricity, g0 = P.balances(p).resources;
    R.startBuy = mktBuy('food');
    R.startBattery = P.balances(p).electricity - e0;
    R.startGoods = P.balances(p).resources - g0;

    /* EVERY SHELF IN THE VALLEY, and not one price above one */
    const all = BohemiaPayday.hubs(om) || [];
    let seats = null; try { seats = turfSeats(); } catch (e) {}
    R.hubs = all.length;
    let worst = 0, shelves = 0, campHubs = [];
    all.forEach(h => {
      MODE = 'city'; city.x = h.x; city.y = h.y; MKT_HUB_KEY = null;
      const sh = mktShelf() || [];
      if (sh.length) shelves++;
      sh.forEach(x => { if (x.price != null && x.price > worst) worst = x.price; });
      let hold = null; try { hold = BohemiaTowns.holderOf(seats, h.x, h.y); } catch (e) {}
      if (hold && hold.tier === 'camp') campHubs.push({ x: h.x, y: h.y, f: hold.faction });
    });
    R.shelvesRead = shelves; R.worstPrice = worst; R.campCount = campHubs.length;

    /* A CAMP, AS A STRANGER */
    if (campHubs.length) {
      const c = campHubs[0];
      MODE = 'city'; city.x = c.x; city.y = c.y; MKT_HUB_KEY = null;
      R.campFaction = c.f;
      R.inCamp = mktAt();
      R.campShelf = (mktShelf() || []).slice(0, 3).map(x =>
        ({ good: x.good, price: x.price, barter: x.barter, tag: x.tag }));
      const e1 = P.balances(p).electricity, g1 = P.balances(p).resources;
      R.campBuy = mktBuy('food');
      R.campBattery = P.balances(p).electricity - e1;
      R.campGoods = P.balances(p).resources - g1;
      /* and once they count you */
      try { BohemiaBelonging.adjust(ctBelongSave(), c.f, 10, T.day || 1); } catch (e) {}
      R.campShelfCounted = (mktShelf() || []).slice(0, 3).map(x =>
        ({ good: x.good, price: x.price, barter: x.barter }));
      const e2 = P.balances(p).electricity, g2 = P.balances(p).resources;
      R.campBuyCounted = mktBuy('food');
      R.countedBattery = P.balances(p).electricity - e2;
      R.countedGoods = P.balances(p).resources - g2;
    }
    return R;
  });
  await b.close();

  ok('the barter book reaches the surface he walks', r.module === 'object');
  ok('*** THE MARKET HE WAKES BESIDE IS A ' + ((r.startWho || {}).tier || '?').toUpperCase()
     + ', NOT A CAMP ***', r.startWho && r.startWho.tier !== 'camp');
  ok('*** AND THE FIRST BAG OF RICE STILL COSTS ONE BATTERY *** (battery '
     + r.startBattery + ', goods ' + r.startGoods + ')',
     r.startBuy && r.startBuy.applied === true && r.startBattery === -1 && r.startGoods === 1);
  ok('every shelf in the valley was read (' + r.shelvesRead + ' of ' + r.hubs + ')',
     r.shelvesRead > 0);
  ok('*** AND NOT ONE PRICE ANYWHERE IS ABOVE ONE *** (worst ' + r.worstPrice + ')',
     r.worstPrice === 1);
  ok('the valley has camps on the real map (' + r.campCount + ')', r.campCount > 0);
  ok('he is standing in the camp when it is read', r.inCamp === true);
  ok('*** A CAMP REFUSES A STRANGER\'S BATTERY *** (' + ((r.campBuy || {}).reason) + ')',
     r.campBuy && r.campBuy.applied === false && r.campBuy.reason === 'BARTER_ONLY');
  ok('*** AND THE REFUSAL MOVES NOTHING *** (battery ' + r.campBattery
     + ', goods ' + r.campGoods + ')', r.campBattery === 0 && r.campGoods === 0);
  ok('the shelf says so before he taps ("' + ((r.campShelf || [])[0] || {}).tag + '")',
     (r.campShelf || []).length > 0 && r.campShelf.every(x => x.barter === true && x.tag));
  ok('and the camp\'s tag never hides a price above one',
     (r.campShelf || []).every(x => x.price === 1));
  ok('*** THEN THEY COUNT YOU AND THE BATTERY IS GOOD *** (battery '
     + r.countedBattery + ', goods ' + r.countedGoods + ')',
     r.campBuyCounted && r.campBuyCounted.applied === true
     && r.countedBattery === -1 && r.countedGoods === 1
     && (r.campShelfCounted || []).every(x => x.barter === false && x.price === 1));
  ok('no page error across every market in the valley'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  /* the rider block is intact -- resync after a splice can eat one, 9/15 */
  {
    const raw = fs.readFileSync(CITY, 'utf8');
    const tool = fs.readFileSync(path.join(ROOT, 'tools/bohemia_city_work_patch.py'), 'utf8');
    const riders = (tool.slice(tool.indexOf('RIDERS = ['), tool.indexOf(']', tool.indexOf('RIDERS = [')))
      .match(/bohemia_[a-z_]+\.js/g) || []);
    const bad = riders.filter(f =>
      raw.split('/* ==== engine/' + f + ' ==== */').length !== 2 ||
      raw.split('/* ==== /engine/' + f + ' ==== */').length !== 2);
    ok('every spliced module block is opened once and closed once (' + riders.length
       + ' riders' + (bad.length ? ', broken: ' + bad.join(', ') : '') + ')',
       riders.length >= 12 && bad.length === 0);
  }

  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  const inDemo = fs.existsSync(demo)
    && fs.readFileSync(demo, 'utf8').indexOf('engine/bohemia_barter.js') > 0;
  console.log('  note: the demo file carries this: ' + (inDemo ? 'yes'
    : 'not in the shell -- but the demo loads the city BY PATH, so this reaches him'
      + ' on push. Rule 14(a): only THE RUN re-cuts.'));
  done();
})();
