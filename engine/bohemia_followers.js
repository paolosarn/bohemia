// BOHEMIA FOLLOWERS -- THE RETINUE (10/1/26, PEOPLE lane, VAMILY [followers])
// CORRECTED 10/9/26 under rule 56 (his fifth votes, LOCKED): "THE RETINUE IS
// BOUGHT ONCE, NO DAILY WAGE... one time purchases." The first version of this
// module charged a nightly wage; that was wrong by his own direct words, and
// it is deleted here, root cause, not patched around.
//
// THE REAL SIX, from the wiki page itself (reference/library/grok/
// GROK_121_UNDERBELLY_FOLLOWERS_2026_10_04.md, PASSED FILTER, cited:
// https://battlebrothers.fandom.com/wiki/Retinue): cook, scout, lookout,
// paymaster, blacksmith, surgeon. There is no "negotiator" in the real
// retinue; this round's rebuild drops that guessed role and the other three
// invented ones from the first draft and replaces them with the real six.
// Prices are the wiki's crowns converted at the game's own established rate,
// batteries = crowns at 10 to 1 (rule 63d, GROK_31_TEN_TO_ONE); every price
// and every effect size is still tuned:false -- the ROLE and the EFFECT KIND
// are the wiki's, the felt number is TUNING's to rule on.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  var FOLLOWERS = [
    { id: 'cook', bb: 'cook', price: 200, tuned: false,
      ask: "I can keep food from going bad and nurse a man back up. A cook, for 200 batteries, once.",
      hireSays: "The cook falls in.",
      changes: { kind: 'food', mult: null, tuned: false,
        note: "not yet live: this game has no food-duration or hourly-health clock to speed up yet (wiki: +3 days food, +1 health/hour)" } },
    { id: 'scout', bb: 'scout', price: 250, tuned: false,
      ask: "I used to run routes before the roads got bad. A scout, for 250 batteries, once.",
      hireSays: "The scout falls in. The roads go by quicker now.",
      changes: { kind: 'travel', mult: 0.85, tuned: false,
        note: "LIVE: every block crossed on the map costs 15% less time (wiki: +15% travel speed)" } },
    { id: 'lookout', bb: 'lookout', price: 250, tuned: false,
      ask: "I can spot trouble before it spots you. A lookout, for 250 batteries, once.",
      hireSays: "The lookout falls in.",
      changes: { kind: 'sight', mult: null, tuned: false,
        note: "not yet live: this game has no sight-radius mechanic yet to widen (wiki: +25% sight)" } },
    { id: 'paymaster', bb: 'paymaster', price: 350, tuned: false,
      ask: "I know how to talk a price down. A paymaster, for 350 batteries, once.",
      hireSays: "The paymaster falls in. Every other hire costs a little less now.",
      changes: { kind: 'hireDiscount', mult: 0.85, tuned: false,
        note: "LIVE: every OTHER follower's one-time price is 15% cheaper, hired before or after (wiki: -15% wages, re-read as the one-time price now that there is no wage; -50% desertion chance is not modeled, nothing in this game deserts a follower)" } },
    { id: 'blacksmith', bb: 'blacksmith', price: 300, tuned: false,
      ask: "I can keep gear from falling apart. A blacksmith, for 300 batteries, once.",
      hireSays: "The blacksmith falls in.",
      changes: { kind: 'repair', mult: null, tuned: false,
        note: "not yet live: this game has a flat plate-spent switch, not a repair meter, to make cheaper or faster yet (wiki: +20% repair speed, -20% tool use)" } },
    { id: 'surgeon', bb: 'surgeon', price: 350, tuned: false,
      ask: "I patched people up for a living. A surgeon, for 350 batteries, once.",
      hireSays: "The surgeon falls in.",
      changes: { kind: 'healing', mult: null, tuned: false,
        note: "not yet live: this game has no wound/injury clock to shorten yet (wiki: -1 day injury time, saves a man from a fatal blow if the injury is not permanent -- NEVER applied to the main character, who is downed, never dead, by his own lock)" } }
  ];

  function byId(id) { for (var i = 0; i < FOLLOWERS.length; i++) if (FOLLOWERS[i].id === id) return FOLLOWERS[i]; return null; }

  // which role to offer next, in the wiki's own order, skipping any already
  // hired AND any already declined (a decline is a free no, never asked
  // twice; being unable to afford one is NOT a decline and is not tracked
  // here at all, so it can come up again once the purse can pay).
  function offerFor(hired, declined) {
    hired = hired || {}; declined = declined || {};
    for (var i = 0; i < FOLLOWERS.length; i++) {
      var f = FOLLOWERS[i];
      if (!hired[f.id] && !declined[f.id]) return f.id;
    }
    return null;
  }

  function askLine(id) { var f = byId(id); return f ? f.ask : null; }
  function hireLine(id) { var f = byId(id); return f ? f.hireSays : null; }
  function cantAffordLine(id) {
    var f = byId(id); if (!f) return null;
    return "Can't afford a " + f.id + " right now.";
  }

  // the one-time price, discounted by a hired paymaster on every OTHER role
  // (never its own). Rounded to a whole battery, same as every other price
  // in this game.
  function hirePrice(id, hired) {
    var f = byId(id); if (!f) return 0;
    hired = hired || {};
    if (id !== 'paymaster' && hired.paymaster) {
      var pm = byId('paymaster');
      return Math.round(f.price * pm.changes.mult);
    }
    return f.price;
  }

  // the real, live effect: the scout's cut on time-per-block. 1 with no
  // scout hired, so the hook this plugs into is a no-op by default.
  function travelMultiplier(hired) {
    if (hired && hired.scout) { var f = byId('scout'); return (f && typeof f.changes.mult === 'number') ? f.changes.mult : 1; }
    return 1;
  }

  var API = { FOLLOWERS: FOLLOWERS, byId: byId, offerFor: offerFor,
    askLine: askLine, hireLine: hireLine, cantAffordLine: cantAffordLine,
    hirePrice: hirePrice, travelMultiplier: travelMultiplier };
  if (HASREQ) module.exports = API;
  root.BohemiaFollowers = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
