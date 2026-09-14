// BOHEMIA POCKETS — EVERY HOLDER HAS ONE, AND A HANDOFF HAS TWO ENDS (9/14/26, WORLD lane)
// Board row [every pocket] / THERE-IS-EXACTLY-ONE-PURSE-IN-THE-WHOLE-GAME.
//
// ============================================================================
// MEASURED FIRST (rule 12: a dependency on a line is a premise, not a gate)
// ============================================================================
// The board said the swap primitive "is built, works and is half-called". That
// was checked before a line of this was written, and it is not what is there.
//
//   1. ONE PURSE EXISTS IN THE WHOLE GAME. BohemiaPurse.create() has exactly two
//      live call sites on the walked surface: purseGet(), which is the player,
//      and a dry-run costing probe that is thrown away. Everything else is a gate.
//   2. THERE IS NO SWAP. No function anywhere in engine/ takes two purses.
//      transferOut() and transferIn() are two one-legged posts that were never
//      joined, and transferIn() HAS ZERO CALLERS IN THE GAME. Not half-called:
//      the receiving half has never been called once.
//   3. SO THE BATTERIES ARE DESTROYED. Measured with the city's own rent-night
//      call (BOHEMIA_CITY_WORLD.html:55413, verbatim), over one week:
//        the ledger says moved-to-another-holder: 10
//        batteries actually in somebody else's hands: 0
//        the valley's money supply, day 0 -> day 7: 9 -> 0
//      The player's balance IS the money supply of Las Vegas, and it only falls.
//
// AND THE GAME ALREADY NAMES WHO SHOULD HAVE RECEIVED, every single time. Each of
// the four live payment sites passes the counterparty in as the `ref`:
//        the road         'roadpay:'+ev.seq      the crew that stopped you
//        the night's rent  r.faction             the faction whose ground it is
//        a loan repaid     r.who                 the lender, by name
//        restitution       the person's id       the person you wronged
// The code at the road site even says so out loud: "A TRANSFER, NOT A DRAIN. The
// purse's own words: a drain is destroyed and gone, a transfer moved to another
// holder. The crew HAS the cut." The crew did not have the cut. That is a promise
// the ledger makes and does not keep, which is rule 14(d) inside the economy
// instead of on a card.
//
// ============================================================================
// TWO POCKETS AND A WAREHOUSE (ECONOMY Q40, and it is why this is small)
// ============================================================================
// The naive read of "everybody has a pocket" is a ledger per person: 28,844 of
// them. The ruling is not that. It is the player's purse, a treasury per faction,
// and NO POCKET FOR A SHOP AT ALL, because a shop already holds its goods in
// ledger.stocks and a shop's money was never a thing anybody asked to see. That
// is 15 ledgers, and 14 of them are derived from the faction graph rather than
// typed here, so the list cannot drift from the one the rest of the game uses.
//
// A holder that is not a faction still gets a pocket THE MOMENT IT IS PAID, on
// demand, because the game names a lender or a crew at the instant it hands over
// a battery and that name is the pocket. Nothing has to be registered in advance
// and no list here has to know about them.
//
// ============================================================================
// ONE WAY IN AND OUT, AND IT IS ATOMIC
// ============================================================================
// hand() is the only way a battery moves between two holders. It is transferOut
// on one purse and transferIn on the other, and if either leg is refused NOTHING
// HAPPENS -- the same unwind convert() has used inside one purse since 7/31. A
// half-applied handoff would mint or burn currency silently, which is the exact
// class of bug the ledger exists to make impossible, and with two ledgers instead
// of one it is twice as easy to write.
//
// ============================================================================
// IT OWNS NOTHING IT DID NOT MAKE
// ============================================================================
// This file creates purses and moves between them. It does not know what anything
// costs, who owes whom, or when a night ends. Every amount is handed in by the
// caller. THE DEBT GETS CALLED IN (8/18) rule 4 -- two ledgers, two owners,
// numbers between them -- is the whole shape: bohemia_purse stays the only thing
// that knows what a ledger entry is, bohemia_towns stays the only thing that
// knows who holds ground, and this is the road between them.
//
// NO SAVE KEY, ON PURPOSE. The player's own purse is memory-only (purseGet holds
// PURSEV and nothing writes it to storage), so giving the factions a save layer
// the player does not have would make the treasuries outlive the purse they were
// filled from, and the valley would gain batteries across a reload. Pockets live
// exactly as long as the purse they trade with. When the player's purse gets a
// save key, these ride the same one.
//
// node: require('./bohemia_pockets.js')   Gate: gates/every_pocket_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ASK FOR A NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD. */
  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }
  function TOWNS() {
    if (HASREQ) { try { return require('./bohemia_towns.js'); } catch (e) { return null; } }
    return root.BohemiaTowns || (typeof BohemiaTowns !== 'undefined' ? BohemiaTowns : null);
  }
  function GRAPH() {
    if (HASREQ) { try { return require('./BOHEMIA_faction_graph.json'); } catch (e) { return null; } }
    return root.BOHEMIA_FACTION_GRAPH || root.FACTION_GRAPH || null;
  }

  var PLAYER = 'player';

  /* THE ONE REGISTRY. id -> purse. */
  var BOOK = {};

  /* WHO HOLDS GROUND HOLDS A TREASURY, and the list is derived, never typed.
     Returns [] rather than a guess when the graph is not reachable: an empty
     answer is honest, a made-up faction list is not. */
  function factions() {
    var T = TOWNS(), g = GRAPH();
    if (!T || !g || typeof T.selectable !== 'function') return [];
    try { return T.selectable(g) || []; } catch (e) { return []; }
  }

  /* GET OR MAKE. Any named holder, faction or not. */
  function of(who) {
    if (!who) return null;
    var id = String(who);
    if (BOOK[id]) return BOOK[id];
    var P = PURSE(); if (!P) return null;
    BOOK[id] = P.create({ id: id, day: 0 });
    return BOOK[id];
  }

  /* THE PLAYER'S PURSE ALREADY EXISTS. The walked surface made it before this
     file was loaded, so it is REGISTERED rather than created -- creating a second
     one would give the game two player balances that disagree. */
  function adopt(purse) {
    if (!purse) return null;
    var id = String(purse.id || PLAYER);
    BOOK[id] = purse;
    return purse;
  }

  /* SEED THE TREASURIES so holders() and supply() mean something from boot, and
     so a faction that has never been paid still reads as a holder with nothing
     rather than as somebody who does not exist. Empty, always: what a faction
     STARTS with is a number nobody ruled. */
  function seed() {
    var f = factions(), made = 0;
    for (var i = 0; i < f.length; i++) { if (!BOOK[f[i]]) { if (of(f[i])) made++; } }
    return made;
  }

  function has(who) { return !!(who && BOOK[String(who)]); }
  function holders() { var out = [], k; for (k in BOOK) if (BOOK.hasOwnProperty(k)) out.push(k); return out.sort(); }

  function worth(who, currency) {
    var P = PURSE(), p = who && BOOK[String(who)];
    if (!P || !p) return 0;
    return P.balance(p, currency) || 0;
  }

  /* ---------------------------------------------------------------------------
     THE HANDOFF. The one way a battery moves between any two holders.
     Refuses, and moves NOTHING, when: either end is missing, they are the same
     holder, the amount is not a positive number, there is no reason, or the payer
     does not have it. The payer's own ledger is the authority on that last one --
     this does not re-check a balance the purse already checks, because a check
     that re-implements the thing it is guarding drifts from it.
     --------------------------------------------------------------------------- */
  function hand(from, to, currency, amount, reason, ref, day) {
    var P = PURSE();
    if (!P) return { applied: false, reason: 'NO_PURSE_MODULE' };
    if (!from || !to) return { applied: false, reason: 'NO_HOLDER', from: from || null, to: to || null };
    if (String(from) === String(to)) return { applied: false, reason: 'SAME_HOLDER', who: String(from) };
    if (!reason) return { applied: false, reason: 'NO_REASON' };
    var n = Number(amount);
    if (!isFinite(n) || n <= 0) return { applied: false, reason: 'NOT_AN_AMOUNT', amount: amount };

    var payer = of(from), payee = of(to);
    if (!payer || !payee) return { applied: false, reason: 'NO_POCKET' };

    var out = P.transferOut(payer, currency, n, reason, ref, day);
    if (!out.applied) return out;                       /* refused: nothing moved */
    var back = P.transferIn(payee, currency, n, reason, ref, day);
    if (!back.applied) { payer.entries.pop(); return back; }   /* atomic: unwind leg one */

    return { applied: true, from: String(from), to: String(to), currency: currency,
             moved: n, out: out.entry, in: back.entry,
             left: P.balance(payer, currency), now: P.balance(payee, currency) };
  }

  /* WHAT THE VALLEY IS WORTH, and who is holding it. This is the number that was
     unaskable before: every holder's balance in one currency, and the total. It
     is what makes "the day the money dies" a thing you can watch rather than a
     thing you assert. */
  function supply(currency) {
    var P = PURSE(), total = 0, by = {}, k, v;
    if (!P) return { currency: currency, total: 0, holders: 0, by: {} };
    for (k in BOOK) {
      if (!BOOK.hasOwnProperty(k)) continue;
      v = P.balance(BOOK[k], currency) || 0;
      by[k] = v; total += v;
    }
    return { currency: currency, total: total, holders: holders().length, by: by };
  }

  /* THE RICHEST FIRST, for anything that wants to say who is doing well. Ties
     break by name so the order is stable between two reads of the same world. */
  function ranked(currency) {
    var s = supply(currency), out = [], k;
    for (k in s.by) if (s.by.hasOwnProperty(k)) out.push({ who: k, held: s.by[k] });
    out.sort(function (a, b) { return (b.held - a.held) || (a.who < b.who ? -1 : a.who > b.who ? 1 : 0); });
    return out;
  }

  /* WHAT ONE HOLDER TOOK IN AND PAID OUT, so a treasury can be read the same way
     the player's purse is read. */
  function flowOf(who, currency) {
    var P = PURSE(), p = who && BOOK[String(who)];
    if (!P || !p) return null;
    var f = P.flow(p);
    return currency ? (f[currency] || null) : f;
  }

  function reset() { BOOK = {}; }

  var API = {
    PLAYER: PLAYER,
    of: of, adopt: adopt, seed: seed, has: has, holders: holders, factions: factions,
    hand: hand, worth: worth, supply: supply, ranked: ranked, flowOf: flowOf,
    reset: reset
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaPockets = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
