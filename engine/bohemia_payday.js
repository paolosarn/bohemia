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
  function payForQuest(purse, questState, day, questId) {
    if (!PURSE) return { applied: false, reason: 'NO_PURSE' };
    var ev = questEvent(questState, questId);
    if (!ev) return { applied: false, reason: 'NOT_FINISHED' };
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
  var PRICE_SOURCE = null;   // [PENDING Paolo: demo blocker 2]

  function price(purse, ledger, goodId) {
    if (!PURSE) return { reason: 'NO_PURSE' };
    // his own table always wins, whether or not the valve was ever turned
    if (PURSE.PRICES && Object.prototype.hasOwnProperty.call(PURSE.PRICES, goodId)) {
      return { source: 'ruled', price: PURSE.PRICES[goodId] };
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
  function buy(purse, hubOrNull, goodId, day) {
    if (!PURSE) return { applied: false, reason: 'NO_PURSE' };
    return PURSE.spend(purse, goodId, day);
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
