// BOHEMIA BARTER — AT A CAMP, TO A STRANGER, THEY WANT THE THING (9/15/26, WORLD lane)
// Board row [two prices] / ONE-PRICE-IN-THE-WHOLE-VALLEY, as RE-AIMED 9/15.
//
// ============================================================================
// HIS RULING, AND IT IS THE WHOLE SPEC
// ============================================================================
// PAOLO 9/15, ruling 1 of records/BOHEMIA_RULING_SIX_DEFAULTS_AFTER_HIS_SECOND_PLAY:
//   "THE SURCHARGE IS DEAD. EVERYTHING COSTS ONE is his pillar and it holds
//    everywhere for everyone. The spread lives in ACCESS and DISTANCE... never a
//    number above one."
// This lane built the stranger's surcharge last round and it made the first bag of
// rice cost two days' work (aa3ca379). The row came back re-aimed, and the aim is
// ACCESS: not what it costs, but whether they will take your money at all.
//
// RULING 8 of the nine defaults (9/13) is exact and needs nothing added:
//   "A TRADER WILL REFUSE MONEY AND ASK FOR GOODS: YES, AT A CAMP, TO A STRANGER.
//    BARTER_ONLY already exists and is unreachable. Wire it: a camp's shelf to a
//    stranger (rung 0) trades goods for goods; a counted person pays one. In a real
//    shortage the seller wants the thing, not the paper, from people he does not
//    know."
//
// ============================================================================
// MEASURED FIRST (rule 12), INCLUDING THE THING THAT BIT ME LAST ROUND
// ============================================================================
//   * BARTER_ONLY IS REAL AND UNREACHABLE. bohemia_payday carries
//     `if (PRICE_SOURCE === 'barter') return {source:'barter', price:null}` and
//     buy() answers BARTER_ONLY, and PRICE_SOURCE is the hard-coded string
//     'economy', so neither line has ever run. The pipe was built and never opened.
//   * THE TUTORIAL SURVIVES THIS ONE BY CONSTRUCTION, and it is checked rather than
//     hoped. The five camps are Trades, Custom, Volunteers, Homeless and Colorful.
//     THE PLAYER'S FIRST MARKET IS THE CHURCH'S SEAT, TWO BLOCKS FROM THE BED, AND
//     THE CHURCH IS A TOWN. So the bag of rice still costs one battery on day one,
//     which is exactly what [rice clock] exists to protect and exactly what the
//     surcharge broke.
//   * A CAMP'S SHELF IS ALREADY SHORT. goodsFor() takes a third of the list at camp
//     depth, shipped in [faction towns]. The short shelf is built; this is the other
//     half of what a stranger meets there.
//
// ============================================================================
// ONE THING FOR ONE THING
// ============================================================================
// There is no exchange rate here and there is no table to fill. His pillar says
// EVERYTHING COSTS ONE, so at a camp a stranger pays ONE OF WHAT HE CARRIES for one
// of what they have. The purse holds goods as `resources`, a count, so one-for-one
// is not a simplification of a richer system, it is the shape the purse already has.
// A rate would be a number nobody ruled, and a number above one is now forbidden by
// name.
//
// WHO IS A STRANGER IS READ, NEVER TYPED. The bottom rung of his own ladder, off
// bohemia_belonging, so renumbering the ladder moves this with it.
//
// AND THE SWAP ITSELF IS NOT BUILT, ON PURPOSE, BECAUSE IT CANNOT BE YET.
// MEASURED: the first cut of this really did trade, through the purse's own atomic
// convert(), and it MOVED NOTHING -- applied:true, goods delta 0, battery delta 0.
// The purse has ONE goods pocket (`resources`, a count), so one good for one good
// takes a resource and hands a resource straight back. A transaction that reports
// success and changes no balance is rule 14(d) exactly: a thing that promises and
// does nothing. So what ships is the REFUSAL, which is real, visible, and is
// precisely what his 9/15 re-aim asked for -- the spread lives in ACCESS. The swap
// waits on goods the purse can tell apart, which is an inventory and not this row.
//
// IT MOVES NOTHING ITSELF either way: it answers, the surface acts.
//
// node: require('./bohemia_barter.js')   Gate: gates/two_prices_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function BELONG() {
    if (HASREQ) { try { return require('./bohemia_belonging.js'); } catch (e) { return null; } }
    return root.BohemiaBelonging || (typeof BohemiaBelonging !== 'undefined' ? BohemiaBelonging : null);
  }
  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }

  /* THE TIER THAT HAGGLES IN GOODS. His ruling names it, and only it. */
  var BARTER_TIER = 'camp';
  /* WHAT A STRANGER PAYS WITH. The purse's own goods pocket -- the one both verbs
     that consume a good drain -- not a mapping invented here. */
  var GOODS = 'resources';

  /* THE BOTTOM RUNG, READ OFF HIS LADDER. Ruling 8 says "a stranger (rung 0)". */
  function strangerAt() {
    var B = BELONG(); if (!B || !B.RUNGS || !B.RUNGS.length) return null;
    var lowest = B.RUNGS[0];
    for (var i = 1; i < B.RUNGS.length; i++) if (B.RUNGS[i].at < lowest.at) lowest = B.RUNGS[i];
    return lowest.at;
  }
  function isStranger(given) {
    var at = strangerAt();
    if (at == null || given == null) return false;
    return (given | 0) <= at;
  }

  /* WILL THEY TAKE A BATTERY FROM YOU? Only a camp refuses, and only a stranger is
     refused. Everything else is his one battery, everywhere, for everyone. */
  function wantsGoods(tier, given) {
    return tier === BARTER_TIER && isStranger(given);
  }

  /* ---------------------------------------------------------------------------
     WHAT THE TRADE IS. One of what you carry for one of what they have.
     Answers, never acts. Returns `can:false` with a reason when you have nothing to
     trade, because a camp that takes goods from somebody with no goods is not a
     refusal to explain, it is a trade that cannot happen.
     --------------------------------------------------------------------------- */
  function offer(opts) {
    opts = opts || {};
    if (!wantsGoods(opts.tier, opts.given)) return null;      /* not a barter market */
    var P = PURSE();
    var have = null;
    if (P && opts.purse) { try { have = P.balance(opts.purse, GOODS); } catch (e) { have = null; } }
    var one = 1;                        /* EVERYTHING COSTS ONE (8/15), as a count */
    return {
      barter: true, good: opts.good || null,
      wants: GOODS, wantsHowMany: one, gives: one,
      have: have,
      can: (have != null && have >= one),
      why: (have != null && have >= one) ? null : 'NOTHING_TO_TRADE',
      ruling: 'PAOLO 9/13 ruling 8: a camp\'s shelf to a stranger trades goods for goods',
      draft: DRAFT
    };
  }

  /* ---------------------------------------------------------------------------
     THE WORDS. Attempts, draft:true. No number he did not rule.
     --------------------------------------------------------------------------- */
  function say(o) {
    if (!o || !o.barter) return '';
    return 'They will not take a battery from somebody they do not know. '
         + 'They want something you are carrying.';                        /* draft:true */
  }
  function tag(o) {
    if (!o || !o.barter) return '';
    return 'TRADE, NOT COIN';                                              /* draft:true */
  }

  var API = {
    BARTER_TIER: BARTER_TIER, GOODS: GOODS,
    strangerAt: strangerAt, isStranger: isStranger, wantsGoods: wantsGoods,
    offer: offer, say: say, tag: tag, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaBarter = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
