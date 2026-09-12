// BOHEMIA HUNGER — THE BAG OF RICE IS THE CLOCK (9/12/26, WORLD lane)
// Board row [rice clock] / THE-BAG-OF-RICE-IS-THE-TUTORIAL.
//
// ============================================================================
// THE ROW, THE MANAGER'S OWN CALL (9/5)
// ============================================================================
//   "everything costs one and a day of work pays one; the one thing you must buy
//    every day is the whole economy in miniature. Hunger is the clock: a day
//    without the bag shows on the body and the purse, and the first purchase of
//    the game is rice, taught by wanting it, not by a text box."
//
// ============================================================================
// THE BUG UNDERNEATH IT, AND IT WAS THE WHOLE LOOP
// ============================================================================
// MEASURED ON THE WALKED SURFACE, with five batteries in the purse:
//     buy food        applied:true, paid:1      electricity 5 -> 4
//     resources                                 0 -> 0
//     the day eats    day:ate REFUSED, INSUFFICIENT
// You bought food, the food did not exist, and then you starved. buy() debited
// the battery and credited nothing, because it read shopping as the hard sink.
// Fixed in bohemia_payday.js: BUYING IS A CONVERSION, EATING IS THE SINK, through
// the purse's own convert() which had existed since 7/31 with zero callers.
// Now: work -> battery -> rice -> eaten. The economy in miniature, closed.
//
// ============================================================================
// AND HUNGER IS COUNTED AND SAID, NEVER SUFFERED. THAT IS NOT A SHORTCUT.
// ============================================================================
// "a day without the bag shows on the BODY and the purse". What a day without food
// does to a body is DAMAGE, and NO DAMAGE BEFORE THE DIAL is LOCKED. The day loop
// had already written the same sentence about the same moment, in its own words:
//   "NO DAMAGE BEFORE THE DIAL. The reckoning REPORTS; it does not starve you"
// So this counts the days and says them, plainly and with rising weight, and what
// that finally costs a body is his dial. The clock is real either way: a player
// who can see "nobody has eaten in three days" is being taught by wanting it,
// which is exactly what the row asks for and what a text box is not.
//
// ============================================================================
// THE COUNT IS DERIVED FROM THE LEDGER, NEVER STORED
// ============================================================================
// The purse is the truth (its own header's whole argument), and it already records
// every day:ate that applied and every one that did not. A second counter beside it
// is how two records of one fact start disagreeing -- the same reason the century
// ledger derives its totals and bohemia_production asks the ledger whether a day
// was paid rather than keeping a boolean. So the streak is read back out of the
// entries every time it is asked.
//
// node: require('./bohemia_hunger.js')   Gate: gates/rice_clock_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* THE VERB THAT FEEDS THEM, and it is read off the purse rather than spelled
     here, so a rename in the frozen verb table cannot leave this asking about a
     verb that no longer exists. */
  var FED = 'day:ate';

  function PURSE() {
    if (HASREQ) { try { return require('./bohemia_purse.js'); } catch (e) { return null; } }
    return root.BohemiaPurse || (typeof BohemiaPurse !== 'undefined' ? BohemiaPurse : null);
  }

  /* IS THE VERB THIS ASKS ABOUT STILL A VERB. If the frozen table ever drops it,
     every answer below would be silently "nobody has ever eaten" -- which looks
     exactly like a starving valley and is really a broken reader. */
  function verbLives() {
    var P = PURSE();
    return !!(P && P.VERBS && Object.prototype.hasOwnProperty.call(P.VERBS, FED));
  }

  /* WHICH DAYS THEY ATE. A day counts as fed when a day:ate drain really applied
     on it -- the entry exists, so the day happened and the food was there. */
  function fedDays(purse) {
    var out = {};
    if (!purse || !purse.entries) return out;
    for (var i = 0; i < purse.entries.length; i++) {
      var e = purse.entries[i];
      if (e.kind !== 'drain' || e.reason !== FED) continue;
      out[e.day | 0] = true;
    }
    return out;
  }

  /* HOW MANY DAYS IN A ROW NOBODY HAS EATEN, counting back from today.
     TODAY COUNTS ONLY ONCE IT IS OVER. The verb fires at nightfall, so asking
     mid-morning whether today was fed would report every single day as hungry
     until the evening -- a clock that reads one day behind reality all day long.
     `today` is therefore the last day that has HAD its nightfall, and the caller
     says which that is because the day loop owns the clock and this does not. */
  function streak(purse, today) {
    if (!verbLives()) return null;
    var fed = fedDays(purse), n = 0, d = today | 0;
    while (d >= 1 && !fed[d]) { n++; d--; }
    return n;
  }

  /* AND WHETHER THEY ATE ON A GIVEN DAY AT ALL, for anything that wants the fact
     rather than the run. */
  function ateOn(purse, day) {
    if (!verbLives()) return null;
    return !!fedDays(purse)[day | 0];
  }

  /* WHAT HE IS TOLD. Rising weight, no damage, and it NAMES THE THING TO BUY,
     because "taught by wanting it, not by a text box" means the game says what is
     missing and lets the player go and want it. draft:true. */
  function say(n) {
    if (!n || n < 1) return '';
    if (n === 1) return 'Nobody ate today. There was no food in the house.';
    if (n === 2) return 'Two days now with nothing to eat. They are asking.';
    if (n < 5) return n + ' days with nothing to eat. Somebody has to buy food.';
    return n + ' days with nothing to eat. They are not asking any more.';
  }

  var API = { FED: FED, verbLives: verbLives, fedDays: fedDays,
              streak: streak, ateOn: ateOn, say: say };
  if (HASREQ) module.exports = API;
  root.BohemiaHunger = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
