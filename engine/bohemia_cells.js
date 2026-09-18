// BOHEMIA CELLS — HOW MANY BATTERIES EXIST, AND WHERE THEY CAME FROM (9/15/26, WORLD lane)
// Board row [battery worth] / YOU-ARE-BUYING-THE-CONTAINER.
//
// ============================================================================
// THE ROW SAID "PUT THE LADDER IN", AND THE RESEARCH IT WAS HARVESTED FROM SAYS
// A LADDER IS THE WRONG ANSWER (rule 12, measure the premise)
// ============================================================================
// records/BOHEMIA_ECONOMY_DAY_8_THE_MONEY_SUPPLY_IS_THE_CELLS_9_5_26.md, section 4b:
//   "Q8 asks for denominations. The honest answer is that EVERYTHING COSTS ONE
//    ALREADY REMOVED THE DENOMINATIONS OF PRICE, so all of the design work has moved
//    into the SIZE OF ONE UNIT of each good... If he ever wants physical
//    denominations, make them BODY-SCALE, NOT NUMERIC: a cell in a pocket, a car
//    battery two people carry, a bank on a cart. Not one, five and twenty five."
// So a numeric ladder is refused by the record the row cites. What that record puts
// in its place is the finding it calls the one that proves us wrong:
//   "WE HAVE BEEN ASKING WHAT A BATTERY IS WORTH. THE REAL QUESTION IS HOW MANY
//    BATTERIES EXIST, BECAUSE THE VALLEY CAN MAKE CHARGE ALL DAY AND CANNOT MAKE A
//    SINGLE CELL." The supply is fixed and shrinking; the charge inside is renewable;
//    so the money gets scarcer while staying just as useful.
//
// ============================================================================
// AND NOTHING IN THE GAME HAS EVER ASKED IT. MEASURED:
// ============================================================================
//   ten days of work, on the real pipe:
//     the valley's batteries .... 0 -> 10
//     the purse's own flow ...... source (made from nothing) 10, drain 0, transfer 0
//   A DAY OF WORK MINTED A CELL. payForWork credited kind 'source', the purse's own
//   word for created-from-nothing, so the supply grew by one every day the player
//   worked, without bound -- exactly the infinite money the record warns about.
//
// *** AND HE RULED IT, 9/16 (ruling 9 of the six defaults after his second play). ***
//   "one battery per head on day one, held by the treasury of whoever holds that
//    person's ground, plus one a day per lit site; a day's work is PAID from a
//    treasury, never minted."
//   So the shape is settled, and it is not the one this file first described:
//     THE OPENING STOCK IS NOT MINTING. Those cells were on the shelves when the
//       lights went out. They post as `source` because they come from outside the
//       ledger, and made() excludes them BY THEIR REASON.
//     A DAY'S WORK IS NOT MINTING EITHER. It is a handoff from the treasury of the
//       ground you worked on, so the valley's total does not move when you are paid.
//     WHAT A LIVE WIRE MAKES IS REAL NEW MONEY, and it is the only thing that is.
//       made() counts it, which is the honest answer to "where did the new ones come
//       from": a lit circuit, one a night, and a dark one makes nothing.
//
// THE 267x UNIT BUG IS REAL AND IS NOT LIVE, which is worth writing down so nobody
// hunts it: the `power` good is priced at one battery with unit kWh, and one kWh is
// 267 AA cells of energy. But power is on NO shelf -- fortress sells water, food,
// meds, fuel; town water, food, meds; camp water, food -- and nothing anywhere
// converts kWh into batteries (the pumps compute kWh and [water lifted] deliberately
// left them uncharged). So the unit is wrong and unreachable. Named, not chased.
//
// ============================================================================
// WHAT THIS FILE IS, AND WHAT IT DELIBERATELY IS NOT
// ============================================================================
// IT IS THE QUESTION, ASKED. count() is the valley's cell count across every holder,
// and made() is how many of them were created rather than found. Both come off the
// pockets book [every pocket] shipped on 9/14; before that there was one purse in
// the game and the question could not be asked at all.
//
// IT IS NOT THE FIX, AND THAT IS ON PURPOSE. Making the supply fixed needs a
// STARTING STOCK -- how many cells were in the valley when the lights went out --
// and that is a number nobody has ruled. Every version of the fix needs it: a pool
// that work draws from needs a size, and paying the player out of a faction treasury
// needs those treasuries to start non-empty, which is the same number wearing a hat.
// Ship an empty pool and a day's work pays nothing on day one, which breaks the loop
// [rice clock] exists to close -- this lane has already broken the first bag of rice
// once this round and will not do it again to make a mechanism fire. So the count
// ships, the growth is visible and honest, and the stock is [PENDING Paolo].
//
// WHEN THE NUMBER LANDS this becomes the fix in about an hour: seed a holder with it,
// turn payForWork's credit into a hand() from that holder, and count() becomes a
// countdown instead of a tally. Nothing else has to move.
//
// node: require('./bohemia_cells.js')   Gate: gates/battery_worth_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function POCKETS() {
    if (HASREQ) { try { return require('./bohemia_pockets.js'); } catch (e) { return null; } }
    return root.BohemiaPockets || (typeof BohemiaPockets !== 'undefined' ? BohemiaPockets : null);
  }
  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }

  /* THE MONEY IS ELECTRICITY. His 9/4 ruling, read off the purse rather than typed
     here: batteries are the money, and electricity is the pocket they live in. */
  function money() {
    var P = PURSE();
    if (!P || !P.PRICES) return null;
    for (var k in P.PRICES) if (Object.prototype.hasOwnProperty.call(P.PRICES, k)) {
      if (P.PRICES[k] && P.PRICES[k].currency) return P.PRICES[k].currency;
    }
    return null;
  }

  /* HOW MANY CELLS ARE IN THE VALLEY, across every holder there is. Null rather than
     zero when the pockets book is not reachable: "nobody is holding anything" and "I
     could not ask" are different answers and a card must not print the first for the
     second. */
  function count() {
    var K = POCKETS(), cur = money();
    if (!K || !cur) return null;
    var s = null; try { s = K.supply(cur); } catch (e) { return null; }
    return s ? { total: s.total, holders: s.holders, currency: cur } : null;
  }

  /* HOW MANY OF THEM WERE MADE RATHER THAN FOUND. The purse's own flow already
     separates `source` (created from nothing) from `transfer` (moved from somebody),
     so this is read, not inferred. This is the number the record says should be ZERO
     in a dead city, and it is not. */
  function made(purses) {
    var P = PURSE(), K = POCKETS(), cur = money();
    if (!P || !cur || !purses || !purses.length) return null;
    /* THE OPENING STOCK IS NOT MINTING. RULED 9/16: one battery per head on day one.
       Those cells were on the shelves when the lights went out -- the valley did not
       make them, it inherited them -- so they post as `source` (they come from
       outside the ledger) and are excluded here BY THEIR REASON. Counting them would
       make this read 3,352 on the first frame and answer this row's question wrongly
       for ever. */
    var opening = (K && K.OPENING) || null;
    var n = 0;
    for (var i = 0; i < purses.length; i++) {
      var h = null; try { h = P.history(purses[i], cur); } catch (e) { continue; }
      for (var j = 0; j < (h || []).length; j++) {
        var e2 = h[j];
        if (!e2 || e2.kind !== 'source') continue;
        if (opening && e2.reason === opening) continue;
        n += e2.amount || 0;
      }
    }
    return n;
  }

  /* EVERY HOLDER'S PURSE, for made(). Asked of the pockets book so the two can never
     disagree about who exists. */
  function purses() {
    var K = POCKETS();
    if (!K) return [];
    var out = [], who = [];
    try { who = K.holders() || []; } catch (e) { return []; }
    for (var i = 0; i < who.length; i++) { var p = K.of(who[i]); if (p) out.push(p); }
    return out;
  }

  /* THE ONE LINE THE CARD PRINTS. An attempt, draft:true, and it says the count and
     nothing about whether the count is right -- that is his ruling to make. */
  function say(c) {
    if (!c || c.total == null) return '';
    var n = c.total;
    return 'BATTERIES IN THE VALLEY: ' + n
         + (c.holders ? ' across ' + c.holders + ' hands' : '');            /* draft:true */
  }
  /* AND WHETHER IT WENT UP TONIGHT, which is the honest tell that the valley is
     still making cells it should not be able to make. */
  function drift(before, after) {
    if (before == null || after == null) return null;
    return after - before;
  }
  function driftSay(d) {
    if (d == null || d === 0) return '';
    return d > 0 ? ('and ' + d + ' more exist than last night')             /* draft:true */
                 : (-d + ' fewer exist than last night');                   /* draft:true */
  }

  var API = {
    money: money, count: count, made: made, purses: purses,
    say: say, drift: drift, driftSay: driftSay, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaCells = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
