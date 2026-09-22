// BOHEMIA AFTER MONEY — THE DAY AFTER THE MONEY DIES (9/21/26, WORLD lane)
// Board row [full shelves] / THE-DAY-AFTER-THE-MONEY-DIES.
//
// ============================================================================
// RULE 12: THE FIRST HALF OF THE ROW IS ALREADY TRUE, AND IT IS GRIM
// ============================================================================
// The row says: "the day after the last battery is spent, THE SHELVES FILL UP
// AND NOBODY CAN BUY ANYTHING. Goods exist, money does not, and trade stops
// dead until people fall back to swapping and owing."
//
// MEASURED BEFORE BUILDING ANYTHING, by driving the real modules: stock the
// valley the way the game stocks it (19 holders, 55 batteries), then spend every
// holder down through the game's own payday.buy():
//
//     56 batteries burned buying food
//     BATTERIES IN THE VALLEY: 0 across 19 hands
//     made from nothing: 0          (nobody minted a single one)
//     goods still on the shelf: 4 kinds
//     any purchase, by anybody:     CANNOT_AFFORD
//
// It works because a purchase is a CONVERT, not a transfer: the battery is
// destroyed to make the good, so the supply falls with every sale and only a
// building can put one back. THE VALLEY REALLY CAN RUN OUT, AND IT ALREADY DOES.
//
// SO THE FIRST HALF OF THE ROW NEEDED NOTHING. What is missing is the second
// half, and its absence is the bug: at zero, NOTHING MOVES AT ALL. There is no
// fallback. Every shop answers CANNOT_AFFORD forever and the game stands still
// with full shelves. Trade does not stop when money dies in the real world; it
// changes form. That is what this module is.
//
// ============================================================================
// AND BOTH FORMS ARE ALREADY BUILT, BY THIS LANE, WITH NO CALLER FOR THIS
// ============================================================================
//   SWAPPING  engine/bohemia_barter.js -- a stranger at a camp refuses your
//             battery and asks for goods instead. Shipped [two prices] 9/15.
//   OWING     engine/bohemia_lend.js -- a named lender hands you batteries on a
//             handshake, the debt names them, and the street finds out if you do
//             not pay. Shipped [someone lends] 9/13.
//
// This module does not re-implement either one. It ANSWERS ONE QUESTION -- is
// the money dead -- and hands the trade to whichever of them can still carry it.
// REUSE-FIRST, and the row itself says so: "the ledger of who owes whom (which
// exists) becomes the only way anything moves".
//
// ============================================================================
// *** YOUR EMPTY POCKET IS NOT A DEAD CURRENCY. ***
// ============================================================================
// The trap this file exists to avoid, and it is the same shape that cost the
// block-strike row six rounds: an empty purse and an empty valley look identical
// from inside a shop. Both say CANNOT_AFFORD. They are not the same fact and the
// rules only change for one of them.
//
// If being broke flipped the world into barter, the game would tell a player on
// their first bad afternoon that money has collapsed, which is both wrong and
// the death of the beat -- you cannot stage the day the money dies if it happens
// every time somebody overspends.
//
// So `state()` has THREE answers and a reading it does not have is never a
// verdict:
//     WORKS       the valley has batteries; being broke is your problem
//     BROKE       the valley has batteries and you have none
//     DEAD        NOBODY has any, and only then do the rules change
//     (unknown)   nothing measured; answers null rather than guessing
// ============================================================================
// *** CORRECTED 9/22 BY HIS RULING, AND THE BEAT GOT BETTER FOR IT ***
// ============================================================================
//   "Mfs charge batteries bro. i know buildings can help in our game but jesus
//    christ mfs can charge batteries"          -- Paolo 9/21, in the VOTE tab
//
// This file shipped on the premise that the valley stays dead once it is spent,
// because "only a building can put a battery back". THAT IS NOW FALSE. Anybody
// with a rig and a source charges cells (engine/bohemia_charge.js), so the
// valley CANNOT run out of cells while one person still has a panel.
//
// THE BEAT SURVIVES AND IT IS A BETTER BEAT. The money does not die when the
// cells run out. It dies when THE CHARGE does: no sun on the panels, no lit wire
// anybody can reach, no rig left working. That is a thing a player can watch
// coming and act on, which a fixed supply quietly draining never was.
//
// NOTHING IN THE CODE BELOW CHANGES, and that is on purpose. state() has always
// read the supply and never claimed to know why it was low; the reason lived in
// this header and the header was wrong. What a DEAD valley means is now "nobody
// has a cell AND nobody could charge one", and the second half belongs to
// bohemia_charge, which is why this file still asks only the first.
// THE CALLER THAT JOINS THEM DOES NOT EXIST YET because rule 18 keeps this lane
// off every play surface. Named here rather than left implied.
(function (root) {
  'use strict';

  var DRAFT = true;

  var WORKS = 'WORKS', BROKE = 'BROKE', DEAD = 'DEAD';

  function mod(name, file) {
    try { if (root && root[name]) return root[name]; } catch (e) {}
    if (typeof module !== 'undefined' && typeof require !== 'undefined') {
      try { return require('./' + file); } catch (e) {}
    }
    return null;
  }
  function cells()  { return mod('BohemiaCells',   'bohemia_cells.js'); }
  function barter() { return mod('BohemiaBarter',  'bohemia_barter.js'); }
  function lend()   { return mod('BohemiaLend',    'bohemia_lend.js'); }

  /* --------------------------------------------------------------------------
     IS THE MONEY DEAD.

     The valley's supply is READ, never passed as a belief: bohemia_cells already
     counts every battery in every hand and it is the only honest source. A
     caller may hand a supply in for a test, but the default is to go and look.
     -------------------------------------------------------------------------- */
  function state(opts) {
    opts = opts || {};
    var total = null, holders = null;
    if (typeof opts.total === 'number') { total = opts.total; holders = opts.holders; }
    else {
      var C = cells();
      if (!C || typeof C.count !== 'function') return { known: false, why: 'NO_SUPPLY_MODULE' };
      var c = null;
      try { c = C.count(); } catch (e) { return { known: false, why: 'SUPPLY_THREW' }; }
      if (!c || typeof c.total !== 'number') return { known: false, why: 'NOTHING_COUNTED' };
      total = c.total; holders = c.holders;
    }
    /* A VALLEY WITH NO HOLDERS HAS NOT BEEN COUNTED, IT HAS BEEN MISSED. Zero
       batteries across zero hands is an unstocked game, not a collapsed one, and
       calling it collapsed would fire the beat on the first frame of a new save.
       This is the same reading that made the night card say 0 on the first
       night; it cost a card once and it does not get to cost a beat. */
    if (!holders) return { known: false, why: 'NOBODY_HAS_BEEN_COUNTED_YET' };

    if (total > 0) {
      var mine = (typeof opts.mine === 'number') ? opts.mine : null;
      if (mine === null) return { known: true, state: WORKS, total: total, holders: holders,
                                  why: 'THERE_IS_MONEY_IN_THE_VALLEY', draft: DRAFT };
      return { known: true, state: mine > 0 ? WORKS : BROKE, total: total, holders: holders,
               mine: mine,
               why: mine > 0 ? 'YOU_HAVE_MONEY' : 'YOU_ARE_BROKE_BUT_THE_MONEY_IS_NOT',
               draft: DRAFT };
    }
    return { known: true, state: DEAD, total: 0, holders: holders,
             why: 'NOBODY_IN_THE_VALLEY_HAS_A_BATTERY', draft: DRAFT };
  }

  /* --------------------------------------------------------------------------
     WHAT A PRICE MEANS NOW.

     PRICES MEAN NOTHING, which is the row's own phrase, and it is not a
     metaphor: a number denominated in a currency nobody holds is not a price,
     it is a memory of one. So a quote made while the money is dead comes back
     REFUSED, carrying the number it would have been, so a shop can still post
     its list and a player can still read it and see that it is worthless.

     It does NOT change the price. Prices are his (EVERYTHING COSTS ONE) and a
     collapse that quietly re-tariffs the valley would be this lane inventing
     economics he did not rule.
     -------------------------------------------------------------------------- */
  function quote(price, st) {
    if (!st || !st.known) return { good: false, why: 'STATE_UNKNOWN' };
    if (st.state !== DEAD) return { good: true, price: price, draft: DRAFT };
    return { good: false, why: 'THE_PRICE_IS_IN_A_CURRENCY_NOBODY_HOLDS',
             wouldHaveBeen: price, draft: DRAFT };
  }

  /* --------------------------------------------------------------------------
     SO HOW DOES ANYTHING MOVE.

     The two ways that still work, in the order a person would actually try them,
     and NEITHER IS INVENTED HERE. Both are modules this lane already shipped
     with nothing calling them for this.

       1. SWAP   you have goods; give goods. bohemia_barter already refuses a
                 battery and asks for goods, which is exactly this trade.
       2. OWE    you have nothing; the deal is remembered instead of paid.
                 bohemia_lend already records a debt with a name on it.

     A trade with neither goods nor a lender is REFUSED and says which. Nothing
     here quietly gives anybody anything: "the shelves are full and you cannot
     have any of it" is the beat, and softening it would delete the row.
     -------------------------------------------------------------------------- */
  function ways(st, has) {
    if (!st || !st.known) return { known: false, why: 'STATE_UNKNOWN' };
    if (st.state !== DEAD) return { known: true, dead: false, ways: ['PAY'], draft: DRAFT };
    has = has || {};
    var out = [];
    var B = barter(), L = lend();
    if (B && (has.goods > 0)) out.push('SWAP');
    if (L && has.lender) out.push('OWE');
    return { known: true, dead: true, ways: out,
             why: out.length ? 'THE_MONEY_IS_DEAD_BUT_THE_TRADE_IS_NOT'
                             : 'NOTHING_TO_SWAP_AND_NOBODY_TO_OWE',
             draft: DRAFT };
  }

  /* THE WHOLE ANSWER FOR ONE ATTEMPTED TRADE. What a shop should do. */
  function trade(opts) {
    opts = opts || {};
    var st = state(opts);
    if (!st.known) return { done: false, why: st.why };
    var q = quote(opts.price, st);
    if (st.state !== DEAD) {
      /* the money still works: this is not this module's business, and saying so
         is the point -- a shop with money in the valley should go on being a
         shop and never route through here. */
      return { done: false, why: 'THE_MONEY_STILL_WORKS', state: st.state,
               price: q.price, draft: DRAFT };
    }
    var w = ways(st, opts.has);
    return { done: w.ways.length > 0, state: DEAD, ways: w.ways, why: w.why,
             priceMeans: q, draft: DRAFT };
  }

  var API = {
    WORKS: WORKS, BROKE: BROKE, DEAD: DEAD,
    state: state, quote: quote, ways: ways, trade: trade,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaAfterMoney = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
