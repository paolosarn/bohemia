// BOHEMIA AMBITIONS -- A GOAL THE COMPANY SETS ITSELF (9/30/26, PEOPLE lane)
// VAMILY [ambitions], row A-GOAL-THE-COMPANY-SETS-ITSELF. Rule 48, the
// translation table's own NOT STARTED: Battle Brothers' ambitions (a chosen
// goal, a light reward in renown) translated for us.
//
// ============================================================================
// THE REAL BATTLE BROTHERS SHAPE, READ FROM THE LIBRARY, NOT GUESSED
// ============================================================================
// reference/library/battle_brothers/07_ECONOMY.md: "AMBITIONS: chosen goals
// with renown rewards, a light spine ('hire 12 men', 'amass 5,000 crowns',
// 'win a contract with three skulls', 'defeat a champion', 'reach 1,000
// renown', 'gain a legendary item')."
//
// THE ONE WORD THAT DOES NOT TRANSLATE: RENOWN. This game's currencies are
// LOCKED AT EXACTLY THREE (laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md,
// engine/bohemia_purse.js CURRENCIES) -- resources, electricity, clout -- and
// none of them is a renown-shaped accumulating score, and inventing a fourth
// is the one thing this file is not allowed to do. So the reward is paid in
// electricity (batteries), the currency every other "you did something, here
// is a little something" moment in this game already pays in. A light reward
// stays light: this file names an amount and TUNING owns whether it is right.
//
// ============================================================================
// EVERY GOAL READS A REAL FACT THIS GAME ALREADY TRACKS, NOTHING NEW STORED
// ============================================================================
// "hire 12 men"       -> bohemia_company.js's yours(snapshot).length. NAMED
//                        HONESTLY: yours() counts who a bond or a witness
//                        already calls yours, which is a real, computed
//                        headcount and not literally "recruited"; there is no
//                        recruitment roster in this codebase to count instead
//                        (bohemia_company.js's own header: "THEY ARE PEOPLE
//                        WITH LEDGERS, NOT A ROSTER").
// "amass 5,000 crowns" -> bohemia_purse.js's balance(purse,'electricity').
// "reach 1,000 renown" -> the belonging ladder's own rung, reused rather than
//                        invented: 'useful' or better with ANY ONE faction
//                        (bohemia_belonging.js rungOf/gaveOf, the same organ
//                        PEOPLE's own [somebody hires you] already reads).
// MEASURED so these are not guessed: a fresh save reads 0 people, 0
// electricity, every faction at 'stranger' (measured live, 9/30). Three
// goals, not Battle Brothers' six -- a light spine stays light, and the
// mechanism below is built so a fourth or fifth goal is one more table row,
// never a new function.
//
// WHAT THIS FILE DOES NOT DO
// - NO ROSTER, NO NEW SAVE FIELD FOR PROGRESS: every GOAL's check is a pure
//   read of facts other modules already keep. The only new state anywhere is
//   WHICH goal is currently chosen and WHETHER it has been paid -- two small
//   facts, owned by the caller (this file holds no save of its own, matching
//   bohemia_company.js's own rule: a module that can drift from the world is
//   worse than a module that recomputes).
// - NO NUMBER PRETENDS TO BE FINAL. Every threshold and the reward carry
//   tuned:false; TUNING [respec]/the numbers table is who rules them for
//   real. This file's job is the mechanism, not the difficulty curve.
// - NO CARD. This file returns words and facts; whoever calls it puts the
//   words in a mouth (rule 19/20), never a popup.
//
// node: require('./bohemia_ambitions.js')   Gate: gates/ambitions_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* ==========================================================================
     THE THREE GOALS. Each is DATA: an id, what the companion asks for it
     (draft:true, WORDS corrects), the threshold, and a pure check(facts) that
     reads ONLY the facts object handed in -- never a global, never the DOM.
     A fourth goal is one more entry here, never a new function. ========== */
  var GOALS = [
    {
      id: 'keep-company',
      ask: "we should keep more people close. Three, at least.",     /* draft:true */
      doneSays: "we kept three. That's a company now, not a couple of strangers walking together.", /* draft:true */
      need: 3, tuned: false,
      have: function (facts) { return (facts.company | 0); },
      done: function (facts) { return (facts.company | 0) >= 3; }
    },
    {
      id: 'bank-batteries',
      ask: "we should bank ten batteries. Not spend them the second we have them.", /* draft:true */
      doneSays: "ten batteries banked. First time this company has had a cushion.", /* draft:true */
      need: 10, tuned: false,
      have: function (facts) { return (facts.electricity | 0); },
      done: function (facts) { return (facts.electricity | 0) >= 10; }
    },
    {
      id: 'somebodys-word',
      ask: "we should be more than strangers to somebody out here.", /* draft:true */
      doneSays: "somebody's word is good for us now. That took doing.", /* draft:true */
      need: 1, tuned: false,
      have: function (facts) { return (facts.usefulWith && facts.usefulWith.length) ? 1 : 0; },
      done: function (facts) { return !!(facts.usefulWith && facts.usefulWith.length); }
    }
  ];

  /* THE REWARD. One number, one currency, named as a draft the way every
     other reward this game hands out already is. */
  var REWARD = { currency: 'electricity', amount: 2, tuned: false };

  function byId(id) {
    for (var i = 0; i < GOALS.length; i++) if (GOALS[i].id === id) return GOALS[i];
    return null;
  }

  /* progressOf(id, facts) -- {have, need, done}, or null for an id that is
     not one of the three. Never throws on a malformed facts object: a
     missing fact reads as zero/none, which is the honest state of a fresh
     save, not an error. */
  function progressOf(id, facts) {
    var g = byId(id); if (!g) return null;
    facts = facts || {};
    var have = 0, done = false;
    try { have = g.have(facts) | 0; } catch (_e) { have = 0; }
    try { done = !!g.done(facts); } catch (_e) { done = false; }
    return { id: g.id, have: have, need: g.need, done: done };
  }

  /* offerFor(facts, excludeDone) -- which goal the companion should ask about
     next: the FIRST one (declared order) that is not already done. Returns
     null when every goal is done -- an honest "nothing left to ask for",
     never a repeat. Deterministic: the same facts always offer the same
     goal, so two people asking the same question on the same save get the
     same answer, which is what "the company's own goal" has to mean. */
  function offerFor(facts) {
    facts = facts || {};
    for (var i = 0; i < GOALS.length; i++) {
      var p = progressOf(GOALS[i].id, facts);
      if (p && !p.done) return GOALS[i];
    }
    return null;
  }

  /* THE WORDS. Kept here, never inline at a call site, so ONE place says what
     the mouth says (this lane's own recurring lesson: two writers for one
     line drift). draft:true throughout; WORDS corrects the register. */
  function askLine(id) { var g = byId(id); return g ? g.ask : null; }
  function doneLine(id) { var g = byId(id); return g ? g.doneSays : null; }

  var API = {
    GOALS: GOALS, REWARD: REWARD,
    progressOf: progressOf, offerFor: offerFor,
    askLine: askLine, doneLine: doneLine
  };
  if (HASREQ) module.exports = API;
  root.BohemiaAmbitions = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
