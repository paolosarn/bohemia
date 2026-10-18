// BOHEMIA CONTRACTS -- THE CONTRACT'S WORTH (10/9/26, ECONOMY)
// VAMILY [the contract's worth], rule 74 top row. "Contracts priced by skulls and distance,
// clout raising the pay, a failed one costing relation; the board shows the real number."
//
// Pure functions over records/target/bb/contract_terms.json (the haggle mechanic, the one
// real worked example in all four outcomes, and the relations-cost table) and
// records/target/bb/price_table.json's own toBatteries-shaped conversion (ten to one, floored
// at one). REUSE-FIRST: the battery conversion itself is engine/bohemia_pricetable.js's
// toBatteries; this file requires it rather than re-implementing the rounding rule.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: every number this file touches carries its source in the
// JSON beside it. Where the wiki states no formula (the skull-to-pay curve, the renown-to-pay
// curve), this file refuses to invent one -- it reports the gap, same discipline as last round.
//
// node: require('./bohemia_contracts.js')   Gate: gates/contracts_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function loadJSON(path) {
    if (!HASREQ) return null;
    try { return require(path); } catch (e) { return null; }
  }
  var TERMS = loadJSON('../records/target/bb/contract_terms.json');
  var PT = loadJSON('./bohemia_pricetable.js');

  function toBatteries(crowns, opts) {
    if (PT) return PT.toBatteries(crowns, opts);
    // fallback identical to bohemia_pricetable's rule, kept in sync by the gate's own cross-check
    opts = opts || {};
    var c = crowns || 0;
    if (c === 0 && opts.allowZero) return 0;
    return Math.max(1, Math.floor(c / 10));
  }

  /* ONE HAGGLE ATTEMPT. Annoyance accumulates BEFORE the roll (the wiki's own order), and the
     failure chance is annoyance * 0.1 on the NEW total. Returns whether this attempt is kept
     out (annoyance >= 9, after this gain) and whether the ask itself failed. rand is injected
     (0..1) so this is deterministic under test; the caller supplies its own seeded roll. */
  function haggleAttempt(annoyanceSoFar, hasNegotiator, rand) {
    if (!TERMS) return null;
    var range = hasNegotiator ? TERMS.haggle.annoyance.withNegotiatorRange : TERMS.haggle.annoyance.gainPerAttemptRange;
    var r = (typeof rand === 'number') ? rand : 0.5;
    var gain = range[0] + r * (range[1] - range[0]);
    var newAnnoyance = annoyanceSoFar + gain;
    var failChance = newAnnoyance * 0.1; // the wiki's own formula, named in contract_terms.json's annoyance.failureChanceFormula
    return {
      newAnnoyance: newAnnoyance,
      failChance: Math.min(1, failChance),
      keptOut: newAnnoyance >= TERMS.haggle.annoyance.kickedOutAt,
      relationsCost: hasNegotiator ? TERMS.haggle.relationsPenaltyPerAttempt.withoutNegotiator / 2 : TERMS.haggle.relationsPenaltyPerAttempt.withoutNegotiator
    };
  }

  /* APPLY ONE ASK TYPE to a contract's wiki-crown terms, per the exact wiki rules (not a
     felt curve): "more total pay" scales everything by a random 4-11%; "advance" and "per
     head" both move a flat 25% between completion/advance/per-head, never touching the total
     sum (approximately -- the wiki itself warns of rounding loss, which this function does
     not hide: it reports the pre-rounding transfer, a caller rounds). */
  function applyAsk(terms, askType, rand) {
    if (!TERMS) return null;
    var out = { advance: terms.advance, afterCompletion: terms.afterCompletion, perHead: terms.perHead, maxHeads: terms.maxHeads };
    if (askType === 'moreTotalPay') {
      var range = TERMS.haggle.askTypes.moreTotalPay.percentRange;
      var r = (typeof rand === 'number') ? rand : 0.5;
      var pct = 1 + (range[0] + r * (range[1] - range[0]));
      out.advance = terms.advance * pct;
      out.afterCompletion = terms.afterCompletion * pct;
      out.perHead = terms.perHead * pct;
    } else if (askType === 'payInAdvance') {
      var t = TERMS.haggle.askTypes.payInAdvance.transferPercent;
      var moved = terms.afterCompletion * t + terms.perHead * terms.maxHeads * t;
      out.afterCompletion = terms.afterCompletion * (1 - t);
      out.perHead = terms.perHead * (1 - t);
      out.advance = terms.advance + moved;
    } else if (askType === 'payPerHead') {
      var t2 = TERMS.haggle.askTypes.payPerHead.transferPercent;
      var moved2 = terms.afterCompletion * t2 + terms.advance * t2;
      out.afterCompletion = terms.afterCompletion * (1 - t2);
      out.advance = terms.advance * (1 - t2);
      out.perHead = terms.perHead + (moved2 / terms.maxHeads);
    }
    out.total = out.advance + out.afterCompletion + out.perHead * out.maxHeads;
    return out;
  }

  /* THE WORKED EXAMPLE, IN BATTERIES, derived from the wiki's own "nothing" row rather than
     re-typed, so a change to the source row cannot drift from the derived ones. */
  function workedExample(askType) {
    if (!TERMS) return null;
    var base = TERMS.workedExampleWikiCrowns.nothing;
    var terms = (askType === 'nothing' || !askType) ? base : applyAsk(base, askType);
    return {
      advanceBatteries: toBatteries(terms.advance, { allowZero: true }),
      afterCompletionBatteries: toBatteries(terms.afterCompletion),
      perHeadBatteries: toBatteries(terms.perHead),
      maxHeads: terms.maxHeads,
      totalBatteries: toBatteries(terms.total)
    };
  }

  /* RELATIONS COST of a named action, straight off the wiki's own table. Returns null for an
     action not on the sourced page (section 118's own gap: no bread-theft cost exists). */
  function relationsCost(action) {
    if (!TERMS) return null;
    var v = TERMS.relationsCost[action];
    return (typeof v === 'number') ? v : null;
  }

  function relationBand(score) {
    if (!TERMS) return null;
    var b = TERMS.relationBands;
    if (score >= b.hostile[0] && score <= b.hostile[1]) return 'hostile';
    if (score >= b.threatening[0] && score <= b.threatening[1]) return 'threatening';
    if (score >= b.neutral[0] && score <= b.neutral[1]) return 'neutral';
    if (score >= b.allied[0] && score <= b.allied[1]) return 'allied';
    return 'unbanded'; // 20-39 and 60-89 are gaps the wiki page itself does not name
  }

  var API = {
    toBatteries: toBatteries,
    haggleAttempt: haggleAttempt,
    applyAsk: applyAsk,
    workedExample: workedExample,
    relationsCost: relationsCost,
    relationBand: relationBand,
    _terms: TERMS
  };

  if (HASREQ) module.exports = API;
  if (typeof window !== 'undefined') window.BohemiaContracts = API;
})(this);
