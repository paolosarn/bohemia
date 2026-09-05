// BOHEMIA PAYDAY — the circulatory link between a finished quest, the player's purse,
// and a place to spend it. (8/9/26, WORLD lane.)
//
//   "the quest payout hook so the day loop PAYS, one act-1 trading hub reachable and
//    spendable"                                                    -- Paolo, 8/9/26
//
// WHY THIS EXISTS, AND IT IS NOT WHAT I SAID IT WAS. Earlier the same day I wrote, in a
// surface he reads, that "payQuest() fires on every quest outcome and credits the purse."
// THAT WAS FALSE AND I HAD NOT CHECKED IT. Nothing in this repo called payQuest. Nothing
// imported bohemia_purse.js at all. The purse was an island: a finished ledger with six
// verbs, three currencies and an audit, wired to nothing, reachable from nothing.
// (laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md: do not claim things about the
// codebase without checking. This module is that claim made true instead of retracted.)
//
// AND THE PROBE HAD ALREADY SAID SO, in the only voice that counts -- the surface he
// taps. tools/bohemia_game_day_probe.js walks the real RUN surface and reports link by
// link where the day stops:
//
//     [BLOCKED] 5 GET PAID      currency on the walked surface: NONE AT ALL
//     [BLOCKED] 6 SPEND SOMETHING   nothing to spend: no currency exists here
//
// THE THREE ORGANS ALL EXISTED AND NOTHING JOINED THEM:
//     bohemia_quest_runtime.js  ends a quest with {done, outcome:'COMPLETE'|'FAIL',
//                               doneTags} -- and hands it to nobody.
//     bohemia_purse.js          payQuest(purse, ev) wants exactly {outcome, tags} -- and
//                               is called by nobody.
//     bohemia_economy.js        prices goods hyperbolically against remaining supply,
//                               anchored in real siege data -- and sells to nobody.
// This is the joint. It invents no organ and duplicates none.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, HELD EXACTLY. Every number a player would feel is
// his and every one of them is still empty:
//     what a quest pays        PURSE.PAYOUT      {}  [PENDING Paolo, demo blocker 1]
//     what a thing costs       PURSE.PRICES      {}  [PENDING Paolo, demo blocker 2]
//     what a building yields   PURSE.PRODUCTION  {}  [PENDING Paolo, demo blocker 3]
// So this module carries VALUE END TO END and delivers ZERO, out loud, by name. The pipe
// is finished and the valve is his. One letter opens it.
//
// MAP LAW HELD: Claude never designs map layouts, plumbing only. The hubs below are not
// placed by me -- they are the swap-meet cells THE OVERMAP ALREADY SITED, read back out
// of the world model. If the seed moves them, they move.
//
// WHY A SWAP MEET IS THE ACT-1 TRADING HUB, and it is the realistic answer rather than a
// convenient one: informal markets in a collapsed economy do not get founded, they
// ACCRETE at a fixed, already-known, high-traffic spot with room to park and a boundary
// somebody can watch -- which is the definition of a swap meet, and Las Vegas ran real
// ones for decades. A market needs no new building, no charter and nobody's permission;
// it needs a place everybody can already find. The overmap sites those cells; the ledger
// gives them a till.
//
// REUSE CHECK: cooks NO pixels and adds NO tables. Opens engine/bohemia_purse.js (the
// ledger and its six verbs), engine/bohemia_economy.js (GOODS + price(), both already
// research-anchored in their own source) and the world model's districtsOfType(). It
// writes nothing any of them already owns.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var PURSE = HASREQ ? require('./bohemia_purse.js')
    : (root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null));
  var ECON = HASREQ ? require('./bohemia_economy.js')
    : (root.BohemiaEconomy || (typeof BohemiaEconomy !== 'undefined' ? BohemiaEconomy : null));

  var NO_RULING = 'NO_RULING';

  /* THE DISTRICT TYPES A MARKET ACCRETES ON, most market-like first. NOT a placement:
     a filter over cells the overmap already made. swapmeet is a market by definition;
     a truckstop is the other place in a dead valley that already has fuel, water, a
     paved apron and people passing through. */
  var HUB_TYPES = ['swapmeet', 'truckstop'];

  /* ---------------------------------------------------------------------------
     1. THE PAYOUT HOOK. A quest ended; tell the purse.
     --------------------------------------------------------------------------- */

  /* The quest runtime's finished state IS the event -- no third shape in between, because
     a translation layer between two things that already agree is a place for them to
     drift apart. It ends with {done, outcome, doneTags}; payQuest wants {outcome, tags}. */
  function questEvent(questState, questId) {
    if (!questState || !questState.done) return null;
    return {
      questId: questId || questState.id || null,
      outcome: questState.outcome || null,
      tags: (questState.doneTags || []).slice()
    };
  }

  /* Pay for a finished quest. Returns the purse's own answer verbatim, INCLUDING its
     refusal -- a caller must be able to tell "paid nothing because it is worth nothing"
     from "paid nothing because nobody has ruled what it is worth". */
  /* WHAT A QUEST PAYS IS THE QUEST'S OWN BUSINESS -- RULED 8/11.
     Asked what a day's work should pay, Paolo answered: "Whatever currency the quest decida
     to give." That is not a number, it is a DESIGN RULING, and it is a better one than the
     option I offered him. I had proposed a global PAYOUT table keyed on the outcome tier --
     every #notable job in the valley worth the same thing forever. He put the reward back
     where the job is: a water run pays water, a courier job pays clout, a salvage job pays
     salvage, and each quest says so itself.
     SO THE MECHANISM CHANGED SHAPE, not just its contents. The quest declares `reward` and
     the bridge pays exactly that. The AMOUNTS stay contents -- they live in the .bq quest
     files with the rest of that quest's canon, which is where he just put them.
     His global table still works and is still empty: a quest that declares nothing falls
     through to PURSE.PAYOUT and gets the same honest refusal as before. */
  function questReward(questState, quest) {
    var r = (questState && questState.reward) || (quest && quest.reward) || null;
    if (!r) return null;
    var out = {}, any = false;
    for (var i = 0; i < CURRENCIES().length; i++) {
      var c = CURRENCIES()[i];
      if (typeof r[c] === 'number' && r[c] !== 0) { out[c] = r[c]; any = true; }
    }
    return any ? out : null;
  }

  function CURRENCIES() { return PURSE ? PURSE.CURRENCIES : []; }

  function payForQuest(purse, questState, day, questId, quest) {
    if (!PURSE) return { applied: false, reason: 'NO_PURSE' };
    var ev = questEvent(questState, questId);
    if (!ev) return { applied: false, reason: 'NOT_FINISHED' };
    var reward = questReward(questState, quest);
    if (reward) {
      var done = [];
      for (var c in reward) {
        if (!Object.prototype.hasOwnProperty.call(reward, c)) continue;
        done.push(PURSE.credit(purse, c, reward[c], 'quest:' + (ev.outcome || 'done'),
                               ev.questId, day));
      }
      return { applied: true, source: 'quest', paid: reward,
               balances: PURSE.balances(purse) };
    }
    return PURSE.payQuest(purse, ev, day);
  }

  /* ---------------------------------------------------------------------------
     2. THE HUBS. Read out of the world, never placed here.
     --------------------------------------------------------------------------- */

  /* TAKES EITHER SHAPE, BECAUSE THE VALLEY HAS TWO AND I CHECKED WHICH IS WHERE.
     Headless and in the run slice there is a full world model with districtsOfType().
     In the CITY page -- the surface Paolo actually walks -- there is no world model at
     all; that page inlines the OVERMAP and nothing else, so the first version of this
     returned an empty hub list on the one surface that mattered and looked fine
     everywhere I happened to test it. Follow the artefact, do not assume its shape. */
  function overmapOf(w) {
    if (!w) return null;
    if (typeof w.at === 'function' && w.n) return w;           // a raw overmap
    if (w.m && typeof w.m.at === 'function') return w.m;       // one wrapping an overmap
    return null;
  }

  function hubs(w) {
    var out = [], i, j, t;
    if (w && typeof w.districtsOfType === 'function') {
      for (i = 0; i < HUB_TYPES.length; i++) {
        t = HUB_TYPES[i];
        var cells = w.districtsOfType(t) || [];
        for (j = 0; j < cells.length; j++) {
          out.push({ id: t + ':' + cells[j].x + ',' + cells[j].y, kind: t,
                     x: cells[j].x, y: cells[j].y });
        }
      }
      return out;
    }
    var m = overmapOf(w);
    if (!m) return out;
    for (var y = 0; y < m.n; y++) {
      for (var x = 0; x < m.n; x++) {
        var c = m.at(x, y);
        if (!c || HUB_TYPES.indexOf(c.district) < 0) continue;
        out.push({ id: c.district + ':' + x + ',' + y, kind: c.district, x: x, y: y });
      }
    }
    return out;
  }

  /* REACHABLE means a body can get to it, and the honest test of that is the one the
     district kit already applies to every plot: the drivable/walkable network reaches
     the curb. Ask the plot itself rather than asserting it from up here.
     RETURNS NULL WHEN IT CANNOT BE TESTED -- on a surface with no plot API there is no
     answer, and reporting `false` there would be a guess dressed as a measurement. */
  function reachable(w, hub) {
    if (!w || !hub || typeof w.plot !== 'function') return null;
    var p = null;
    try { p = w.plot(hub.x, hub.y); } catch (e) { return false; }
    if (!p) return false;
    if (typeof p.driveConnected === 'function') { try { return !!p.driveConnected(); } catch (e) { } }
    return !!(p.buildings && p.buildings.length);
  }

  function nearestHub(w, x, y) {
    var hs = hubs(w), best = null, bd = Infinity;
    for (var i = 0; i < hs.length; i++) {
      var dx = hs[i].x - x, dy = hs[i].y - y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = hs[i]; }
    }
    if (best) best.dist = Math.sqrt(bd);
    return best;
  }

  /* ---------------------------------------------------------------------------
     3. THE SHELF, AND THE ONE VALVE THAT IS HIS.
     --------------------------------------------------------------------------- */

  /* What a hub offers. The goods are engine/bohemia_economy.js's GOODS -- already in
     this repo, already carrying their own real-world anchors in that file's header, and
     NOT invented here. What is missing is never the shelf; it is the tag on it. */
  function shelf(hub) {
    if (!ECON || !ECON.GOODS) return [];
    var out = [];
    for (var g in ECON.GOODS) {
      if (!Object.prototype.hasOwnProperty.call(ECON.GOODS, g)) continue;
      if (!ECON.GOODS[g].need) continue;        // a numeraire is not a thing on a shelf
      out.push({ good: g, unit: ECON.GOODS[g].unit, note: ECON.GOODS[g].note });
    }
    return out;
  }

  /* PRICE_SOURCE IS THE VALVE AND IT IS SHUT. Demo blocker 2 asks him which of three:
       A  price off the scarcity sim we already have  -> 'economy'
       B  he names goods and prices                   -> 'ruled' (PURSE.PRICES filled)
       C  barter only, no prices at all               -> 'barter'
     Until he answers a letter this stays null and every price says NO_RULING by name.
     A DEFAULT HERE WOULD BE CANON NOBODY RULED, which is the one thing the mechanism/
     contents split exists to prevent -- and the 8/3 mistake this repo already paid for
     once, off a sentence that sounded warm. */
  /* HE OPENED IT. @RULING PRICES A (Paolo 8/11): "Three goods, priced off the scarcity sim
     we already have." records/BOHEMIA_VERDICT_ICONS_AND_DEMO_BLOCKERS_8_11_26.txt
     So the tag on the shelf is READ, never typed: bohemia_economy.js prices every good
     hyperbolically against how many days of it are left, anchored in real siege data
     (Sarajevo 92-95, staples moved 10-100x not 2x). The price MOVES when the valley gets
     thirstier, which is why this is the realistic answer and not merely the convenient one.
     HIS OWN TABLE STILL WINS: PURSE.PRICES is checked first and is still empty, so if he
     ever names a price it beats the sim for that good and nothing else changes. */
  var PRICE_SOURCE = 'economy';   // RULED 8/11 by Paolo, blocker 2 = A

  function price(purse, ledger, goodId) {
    if (!PURSE) return { reason: 'NO_PURSE' };
    /* HIS OWN TABLE ALWAYS WINS, whether or not the valve was ever turned.
       AND THIS BRANCH HAD NEVER RUN. It returned the whole ROW -- {currency, amount,
       ruling, tuned} -- where every caller wants a NUMBER, so the shelf on the walked
       surface would have rendered "[object Object] res". Written when PRICES was empty
       and exercised for the first time the day it was filled (9/5). A branch that has
       never executed is not code, it is an intention. */
    if (PURSE.PRICES && Object.prototype.hasOwnProperty.call(PURSE.PRICES, goodId)) {
      var rr = PURSE.PRICES[goodId];
      return { source: 'ruled', price: rr.amount, currency: rr.currency,
               ruling: rr.ruling || null };
    }
    if (PRICE_SOURCE === 'economy' && ECON && ledger) {
      return { source: 'economy', price: ECON.price(ledger, goodId) };
    }
    if (PRICE_SOURCE === 'barter') return { source: 'barter', price: null };
    return { reason: NO_RULING, table: 'PRICES', key: goodId,
             about: 'what a thing costs is Paolo\'s ruling (demo blocker 2)' };
  }

  /* Buy. Goes through the purse's own debit so the ledger records a HARD SINK -- the
     thing that actually fights inflation, and the reason the purse is a ledger and not
     three counters. */
  /* WHICH CURRENCY A GOOD IS BOUGHT WITH -- AND HE ANSWERED IT ON 9/4.
     THIS SAID `resources` AND THE REASONING WAS GOOD AND IS NOW OVERRULED. It read:
     the economy quotes everything in SALVAGE-KG, of his three currencies that IS
     resources, "electricity is a service off the 12% live grid and clout is
     reputation; neither buys a litre of water." Correct on 8/11 with no money ruled.
     PAOLO 9/4, LOCKED: "i dont want there to be money money maybe electronics like
     batteries are the currency. For one aa battery a bag of rice and so on so forth."
     A BATTERY BUYS THE RICE. Electricity stops being only a service and becomes the
     MEDIUM OF EXCHANGE: food and tape are what you buy, batteries are what you buy
     them with, clout is what you cannot buy. No fourth currency -- the three stand
     and one of them changed job, which is the whole reason the anti-spreadsheet
     ruling survives this.
     AND IT DOUBLES THE DRAIN, free: "the night eats power" now means YOUR LIGHTS
     BURN YOUR MONEY. Holding a lit block costs what a bag of rice costs. */
  var SALVAGE_CURRENCY = 'electricity';

  function buy(purse, hubOrNull, goodId, day, ledger) {
    if (!PURSE) return { applied: false, reason: 'NO_PURSE' };
    var p = price(purse, ledger, goodId);
    /* ONE SHAPE OUT OF THIS FUNCTION, WHATEVER PRICED IT. The ruled branch used to
       return PURSE.spend() raw -- a ledger entry, not a purchase -- so a shop that
       could not afford something answered in a different vocabulary from the one the
       card reads (`reason`, `price`, `have`). The shelf quotes price() and the till
       charges through the same price(), so THE TAG AND THE TILL CANNOT DISAGREE. That
       is the same rule the street contract lives under: measure it off the one thing,
       never off two. */
    if (p.reason) return { applied: false, reason: p.reason, table: p.table, key: goodId,
                           about: p.about };
    if (p.source === 'barter') return { applied: false, reason: 'BARTER_ONLY', key: goodId };
    if (p.price == null) return { applied: false, reason: 'NO_PRICE', key: goodId };
    /* WHICH POCKET IT COMES OUT OF. A ruled row names its own currency; the sim's
       quote does not, and falls back to the money of the day. */
    var cur = p.currency || SALVAGE_CURRENCY;
    if (PURSE.balance(purse, cur) < p.price) {
      return { applied: false, reason: 'CANNOT_AFFORD', key: goodId, price: p.price,
               currency: cur, have: PURSE.balance(purse, cur) };
    }
    /* A HARD SINK, on purpose: the goods leave the world when you consume them, so the
       value is DESTROYED rather than moved. That is the half of a faucet-and-drain economy
       that actually fights inflation, and the reason the purse is a ledger not a counter. */
    var e = PURSE.debit(purse, cur, p.price, 'buy:' + goodId, goodId, day);
    return { applied: true, good: goodId, paid: p.price, source: p.source,
             currency: cur, entry: e, balances: PURSE.balances(purse) };
  }

  /* ---------------------------------------------------------------------------
     4. THE DAY, END TO END. One call a host can make to prove the loop circulates --
        and to see, in one object, exactly where it stops and whose call that is.
     --------------------------------------------------------------------------- */
  function dayReport(w, purse, ledger) {
    var hs = hubs(w);
    var reach = [], untested = 0;
    for (var i = 0; i < hs.length && i < 8; i++) {
      var r = reachable(w, hs[i]);
      if (r === null) untested++; else if (r) reach.push(hs[i]);
    }
    var sh = shelf();
    var priced = [], unruled = [];
    for (var j = 0; j < sh.length; j++) {
      var p = price(purse, ledger, sh[j].good);
      (p.reason === NO_RULING ? unruled : priced).push(sh[j].good);
    }
    return {
      purseExists: !!PURSE,
      currencies: PURSE ? PURSE.CURRENCIES.slice() : [],
      hubs: hs.length, hubsReachable: reach.length, hubsUntestable: untested,
      shelf: sh.length, priced: priced, unruled: unruled,
      payoutRuled: !!(PURSE && Object.keys(PURSE.PAYOUT || {}).length),
      priceSource: PRICE_SOURCE,
      blocking: (!(PURSE && Object.keys(PURSE.PAYOUT || {}).length) ? ['PAYOUT'] : [])
        .concat(unruled.length ? ['PRICES'] : [])
    };
  }

  var API = {
    HUB_TYPES: HUB_TYPES, PRICE_SOURCE: PRICE_SOURCE, NO_RULING: NO_RULING,
    questEvent: questEvent, payForQuest: payForQuest,
    hubs: hubs, reachable: reachable, nearestHub: nearestHub,
    shelf: shelf, price: price, buy: buy, dayReport: dayReport
  };
  if (HASREQ) module.exports = API;
  root.BohemiaPayday = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
