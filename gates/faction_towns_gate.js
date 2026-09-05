/* ============================================================================
   THE FACTION TOWNS GATE (9/5/26, WORLD lane)
   FACTION-TOWNS. Paolo 9/4, LOCKED:
     "each part of Vegas is owned by a faction and that's where you can do all your
      trading... the more bigger or more prominent factions kind of feel like strong
      fortress parts... and then for the smaller ones like the colorful maybe they
      just have... not a lot of goods not a lot of buildings not a lot of good
      quests and it's just smaller."

   Ship test (the row's own words): every selectable faction has a seat, a derived
   tier and a market reachable on the walked surface; the demo's first day reaches
   one.

   *** THE THING THIS GATE EXISTS TO STOP CAME BACK WITHIN ONE ROUND. ***
   Measured 9/5 before any of it was written: bohemia_loop.js seated factions by
   striding over cells passing bohemia_world.js's isAutoDistrict (3,919 of them),
   while the walked surface -- which cannot load that module at all -- counted
   4,009 by bohemia_cityedit.js's cat()=='sand'. Same seed, same valley, NINETY
   CELLS APART, so two different answers to where the Mob lives. Nothing had
   noticed, because nothing had ever asked the walked surface the question: its own
   FACTION_ASSIGN table is {} and its comment says so.
   Check 3 is the whole point of this file: it asks BOTH surfaces, through the
   SHIPPED module rather than through a rule retyped in the gate, and they must
   name the same fourteen seats. A comparison that reimplements one side proves
   nothing about the other -- the first draft of my own comparison did exactly
   that and reported a disagreement that was its own.

   node gates/faction_towns_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const PD = require(path.join(ROOT, 'engine/bohemia_payday.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('FACTION TOWNS GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (14 seats, tiers off his own power column, one seat rule for both'
            + ' surfaces, a market at every seat)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the tier, derived off his own numbers --------------------------- */
{
  const sel = T.selectable(G);
  ok('the fourteen selectable factions are the roster', sel.length === 14);
  const t1 = T.tiers(G, 1), t3 = T.tiers(G, 3);
  ok('every one of them gets a tier', Object.keys(t1).length === 14);
  ok('and every tier is one of his three',
     Object.keys(t1).every(k => T.TIERS.indexOf(t1[k].tier) >= 0));
  ok('every tier ships draft:true, so moving one is a single edit',
     Object.keys(t1).every(k => t1[k].draft === true));

  /* HIS OWN WORDS ARE THE TEST. He named "the colorful" as the small one, and
     Colorful is act1_power 1 of 14 in a graph he wrote months earlier. Nothing was
     tuned to make that land, which is why the derivation is trusted at all. */
  ok('COLORFUL IS A CAMP -- the faction he named as the small one, off his own'
     + ' power column and nothing else', t1.Colorful.tier === 'camp');
  ok('and the strongest faction in act 1 is a FORTRESS',
     t1.Remnants.tier === 'fortress' && t1.Remnants.power === 14);

  const n = k => Object.keys(t1).filter(x => t1[x].tier === k).length;
  ok('thirds, with the top rounding up (5 fortress / 4 town / 5 camp)',
     n('fortress') === 5 && n('town') === 4 && n('camp') === 5);

  /* THE CENTURY RULE WITH NO NEW FIELD. act3_power is already in his graph, so a
     fortress in act 1 really can be a camp by act 3 without a second table. */
  const moved = Object.keys(t1).filter(k => t1[k].tier !== t3[k].tier);
  ok('A FORTRESS IN ACT 1 CAN BE SOMETHING ELSE BY ACT 3, off act3_power alone'
     + ' (' + moved.length + ' factions move)', moved.length >= 3);
  ok('and Reds climb while Caravans fall, which is what his own graph says',
     t1.Reds.tier === 'town' && t3.Reds.tier === 'fortress'
     && t1.Caravans.tier === 'fortress' && t3.Caravans.tier === 'town');

  /* CONTENTS-PAOLO'S: both override doors ship shut. */
  ok('the seat override table ships EMPTY -- which faction sits where is his',
     Object.keys(T.SEATS).length === 0);
  ok('and so does the tier override', Object.keys(T.TIER).length === 0);
}

/* ---- 2. depth, which is the only axis his words give -------------------- */
{
  const goods = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
  const f = T.goodsFor('fortress', goods).length;
  const t = T.goodsFor('town', goods).length;
  const c = T.goodsFor('camp', goods).length;
  ok('A FORTRESS CARRIES EVERYTHING', f === goods.length);
  ok('A CAMP CARRIES LESS THAN A TOWN CARRIES LESS THAN A FORTRESS -- "not a lot'
     + ' of goods", as a count (' + c + '/' + t + '/' + f + ')', c < t && t < f);
  ok('and a camp still carries something -- a market with nothing in it is not a'
     + ' market', c >= 1);
  /* DEPTH, NOT PRICE. Everything is one battery wherever you buy it (8/15 + 9/4);
     a camp charging more would be a number nobody ruled.
     THE FIRST DRAFT OF THIS CHECK GREPPED THE SOURCE FOR /price/i AND WENT RED ON ITS
     OWN COMMENTS -- the module says "prices are Paolo's" and "a camp is not dearer",
     and a checker that cannot tell a mention from a use is the broken one (8/1 law,
     and this repo has now paid for it three times). It asks the DATA instead. */
  ok('DEPTH is a fraction of a shelf, never a price: every tier is 0..1',
     Object.keys(T.DEPTH).every(k => typeof T.DEPTH[k] === 'number'
       && T.DEPTH[k] > 0 && T.DEPTH[k] <= 1));
  ok('and goodsFor hands back the shelf rows UNTOUCHED -- it thins the list and'
     + ' never writes a number onto a good',
     T.goodsFor('camp', goods).every(g => typeof g === 'string')
     && T.goodsFor('camp', [{ good: 'water', price: 1 }])[0].price === 1);
}

/* ---- 3. ONE SEAT RULE, ASKED OF BOTH SURFACES --------------------------- */
(async () => {
  /* the loop's answer, through its own boot */
  const L = require(path.join(ROOT, 'engine/bohemia_loop.js'));
  const api = L.Loop || L;
  const ctx = (api.boot || api.bootAll || api.start)({ seed: 'bohemia' });
  const loop = {};
  Object.keys(ctx.factionBases || {}).forEach(k => { loop[k] = [ctx.factionBases[k].x, ctx.factionBases[k].y]; });
  ok('the loop seats all fourteen', Object.keys(loop).length === 14);

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const city = await pg.evaluate(() => {
    const R = { seats: {}, tiers: {} };
    R.hasModule = typeof BohemiaTowns !== 'undefined';
    R.hasGraph = typeof BOHEMIA_FACTION_GRAPH !== 'undefined';
    const hs = BohemiaPayday.hubs(om);
    hs.filter(h => h.kind === 'seat').forEach(h => { R.seats[h.faction] = [h.x, h.y]; R.tiers[h.faction] = h.tier; });
    R.hubCount = hs.length;
    R.accreted = hs.filter(h => h.kind !== 'seat').length;
    const open = [(hx / FN) | 0, (hy / FN) | 0];
    R.opening = open;
    const nh = BohemiaPayday.nearestHub(om, open[0], open[1]);
    R.nearestCells = nh ? Math.max(Math.abs(nh.x - open[0]), Math.abs(nh.y - open[1])) : null;
    R.nearestKind = nh ? nh.kind : null;
    /* STAND IN A FORTRESS AND IN A CAMP AND OPEN EACH MARKET, the way the game does */
    const fort = hs.find(h => h.tier === 'fortress'), camp = hs.find(h => h.tier === 'camp');
    const visit = (h) => {
      MODE = 'human'; hx = h.x * FN + (FN >> 1); hy = h.y * FN + (FN >> 1); MKT_HUB_KEY = null;
      const at = mktAt();
      showMarket();
      return { at: at, rows: mktShelf().length,
               card: (document.getElementById('daycardIn') || {}).textContent || '' };
    };
    BohemiaPurse.credit(purseGet(), 'electricity', 3, 'gate:seed', null, 1);
    R.fortress = visit(fort); R.fortressFaction = fort.faction;
    R.camp = visit(camp); R.campFaction = camp.faction;
    /* AND HE CAN ACTUALLY BUY THERE */
    MODE = 'human'; hx = fort.x * FN + (FN >> 1); hy = fort.y * FN + (FN >> 1); MKT_HUB_KEY = null;
    const first = mktShelf()[0];
    const before = purseBalances().electricity;
    const r = mktBuy(first.good);
    R.bought = { good: first.good, ok: !!(r && r.applied), paid: r && r.paid,
                 cur: r && r.currency, before: before, after: purseBalances().electricity };
    return R;
  });
  await b.close();

  ok('the walked surface carries the towns module', city.hasModule === true);
  ok('and HIS OWN faction graph, spliced verbatim rather than retyped', city.hasGraph === true);
  ok('EVERY SELECTABLE FACTION HAS A SEAT ON THE SURFACE HE WALKS',
     Object.keys(city.seats).length === 14);
  ok('and a derived tier with it',
     Object.keys(city.tiers).length === 14
     && Object.keys(city.tiers).every(k => T.TIERS.indexOf(city.tiers[k]) >= 0));

  /* THE CHECK THIS WHOLE FILE IS FOR. */
  const differ = Object.keys(loop).filter(f => !city.seats[f]
    || city.seats[f][0] !== loop[f][0] || city.seats[f][1] !== loop[f][1]);
  ok('*** THE LOOP AND THE WALKED SURFACE NAME THE SAME FOURTEEN SEATS *** -- one'
     + ' rule, asked of both, not a rule retyped in this gate'
     + (differ.length ? ' -- differ: ' + differ.join(', ') : ''), differ.length === 0);

  /* A SEAT IS A MARKET. His ruling: the seat is "where you can do all your trading". */
  ok('the accreted markets are still there too -- a swap meet belongs to nobody and'
     + ' that is not a bug', city.accreted === 2);
  ok('A MARKET OPENS WHERE A FACTION SITS, on the walked surface',
     city.fortress.at === true && city.camp.at === true);
  ok('and the card says WHOSE town it is and WHAT SIZE',
     city.fortress.card.indexOf(city.fortressFaction.toUpperCase()) >= 0
     && /FORTRESS/.test(city.fortress.card)
     && city.camp.card.indexOf(city.campFaction.toUpperCase()) >= 0
     && /CAMP/.test(city.camp.card));
  ok('A CAMP IS THINNER THAN A FORTRESS ON THE REAL SHELF ('
     + city.camp.rows + ' vs ' + city.fortress.rows + ')', city.camp.rows < city.fortress.rows);
  ok('AND HE CAN BUY THERE, in batteries, with the money really leaving',
     city.bought.ok === true && city.bought.cur === 'electricity'
     && city.bought.after === city.bought.before - city.bought.paid);

  /* THE DEMO CLAUSE. Day 19 measured the first required person at a seven-hour
     round trip, and the whole valley carried exactly TWO markets, the nearer one
     38 cells from where the game opens. */
  ok('THE FIRST MARKET IS INSIDE THE FIRST DAY -- ' + city.nearestCells + ' cells'
     + ' from where the game opens (it was 38 with only the accreted two)',
     city.nearestCells != null && city.nearestCells <= 15);
  ok('and the nearest one is a faction seat', city.nearestKind === 'seat');

  ok('no page error across two towns and a purchase' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 4. the measured list stays measured ------------------------------ */
  /* NOT_A_TOWN was derived by asking the district kit how many buildings each kind
     carries, not by taste. If a kind's answer changes, this goes red rather than
     letting a list somebody once measured rot into a list somebody believes. */
  const w = W.world(12345);
  const seen = {};
  for (let y = 0; y < w.n; y += 3) for (let x = 0; x < w.n; x += 3) {
    const c = w.at(x, y);
    if (!c || !c.district || CE.cat(c.district) !== 'sand') continue;
    let p = null; try { p = w.plot(x, y); } catch (e) { continue; }
    if (!p) continue;
    const k = c.district;
    seen[k] = seen[k] || { some: 0 };
    if (p.buildings && p.buildings.length) seen[k].some++;
  }
  const stillEmpty = Object.keys(T.NOT_A_TOWN).filter(k => seen[k] && seen[k].some === 0);
  const wrongly = Object.keys(T.NOT_A_TOWN).filter(k => seen[k] && seen[k].some > 0);
  ok('NOT_A_TOWN IS STILL TRUE: every kind on it really carries no buildings'
     + (wrongly.length ? ' -- now built on: ' + wrongly.join(', ') : ''), wrongly.length === 0);
  ok('and it is not empty, so the exclusion is doing something (' + stillEmpty.length + ')',
     stillEmpty.length >= 1);

  done();
})();
