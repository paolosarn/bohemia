// BOHEMIA LOCK -- ONE TAP ON SOMEBODY YOU WILL NOT LOSE.
// (9/15/26, PEOPLE lane. VAMILY [lock them], row
// ONE-TAP-LOCKS-A-PERSON-YOU-WILL-NOT-LOSE.)
//
// PAOLO 9/11:
//   "there has to be a way to make it easy to lock characters they don't want
//    to die, companions, people in your company, not endgame bullshit."
//
// Three words in that sentence set every rule in this file: EASY (one tap, no
// gate, no rare item), NOT ENDGAME (it works in the first hour), and LOCK (he
// says who, the game does not decide for him).
//
// ============================================================================
// MEASURED ON THE RUNNING DEMO BEFORE A LINE OF THIS WAS WRITTEN
// ============================================================================
// The first morning, phone profile, the card he already opens:
//     YOUR PEOPLE          RAY, DENISE, MARCO        (the cold open's family)
//     WOULD COME WITH YOU  46 of 61 here
//     WOULD FOLLOW YOU     NOBODY YET
//     ctYours()            0
// So on the morning he starts, the game can name nobody as his except the three
// he was born to. And the word "lock" appears nowhere in any people module: every
// hit in the standing web, the deeds ledger and the down module is the word
// "clock" or the word "LOCKED" inside a citation of one of his own rulings.
//
// ============================================================================
// WHY A MARK AND NOT A COMPUTATION, WHICH IS THE WHOLE REASON THIS FILE EXISTS
// ============================================================================
// bohemia_company.js decides who is yours and says so in its own words:
//     "NO ROSTER, NO STATE, NO ADD, NO REMOVE. Pure functions of a snapshot."
// That is right for a company. It is exactly wrong for a promise, because a
// computed membership can stop being true without anybody doing anything: a
// witness is somebody who has one of your deeds in their head, and a deed fades
// on a three-week halflife. So the person the game called yours this morning can
// quietly stop being yours, and the law that protects the people you keep stops
// covering them with nothing said and nobody at fault.
//
// A LOCK IS THE ONE THING IN THIS GAME THE PLAYER WRITES HIMSELF. It is not
// derived, not weighted, not inferred from a ledger, and it does not decay. He
// tapped it, so it is true until he taps it off.
//
// ============================================================================
// THE THING THIS MODULE CANNOT DO, AND IT IS THE POINT
// ============================================================================
// There is no way to lose a locked person. unlock() removes the MARK, never the
// person; there is no kill, no drop, no expiry, and isLocked takes no day because
// a lock is not a question against the clock. That is deliberately the opposite
// shape from bohemia_down.js, where "are they down" IS the clock. One decays by
// arithmetic, the other cannot decay at all, and the gate proves both by trying.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  function norm(x) { return String(x == null ? '' : x); }
  function book(b) { return (b && typeof b === 'object') ? b : {}; }

  /* ==========================================================================
     ONE TAP. It takes no price, no item and no rung, because there is no
     parameter here that could carry one: "not endgame bullshit" is enforced by
     the shape of the call, not by a comment promising to be nice.
     `day` is recorded only so a surface can say how long you have kept them.
     Locking somebody already locked is not an error and costs nothing.
     ========================================================================== */
  function lock(bk, id, day) {
    if (!bk || id == null) return null;
    var k = norm(id);
    if (!k) return null;
    if (bk[k]) return bk[k];
    bk[k] = { id: k, since: (day | 0) };
    return bk[k];
  }

  /* ONE TAP BACK OFF. He said EASY, and a mark you cannot take off is the
     endgame bullshit under a friendlier name. THIS REMOVES THE MARK AND NOTHING
     ELSE: there is no person in this book to delete, only his own note that he
     will not lose them. */
  function unlock(bk, id) {
    if (!bk || id == null) return false;
    var k = norm(id);
    if (!bk[k]) return false;
    delete bk[k];
    return true;
  }

  /* NO CLOCK ARGUMENT, ON PURPOSE. See the header: this is the one fact in the
     people systems that time cannot take away. */
  function isLocked(bk, id) {
    return !!(bk && bk[norm(id)]);
  }

  function list(bk) {
    var b = book(bk), out = [], k;
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) out.push(b[k]);
    out.sort(function (a, c) { return (a.since - c.since) || (a.id < c.id ? -1 : 1); });
    return out;
  }
  function count(bk) { return list(bk).length; }

  /* ==========================================================================
     WHAT IT COSTS, WHICH IS THE HALF THAT MAKES IT A CHOICE
     ==========================================================================
     The coordinator armed this row off the craft: in the games that made
     companions unkillable, the weight of a fall is WHAT YOU LOSE WHILE THEY ARE
     DOWN. Their perk, their turn in the fight, their share of the carry goes with
     them for the whole timer, so protecting them still matters without a death.

     SO THE COST IS NOT A NEW NUMBER. It is the contribution the world already
     computes for them, withheld for exactly as long as the injury the down module
     already rolled. Nothing here invents a length, a price or a penalty: it reads
     the two books and says who is not giving you anything right now and until
     when.
       bk        the lock book
       downFn    isDown(id) -> bool, the down module's own question
       leftFn    daysLeft(id) -> number, the down module's own arithmetic
     RETURNS the locked people who are down, so a surface can say what it cost.
     ========================================================================== */
  function withheld(bk, downFn, leftFn) {
    var rows = list(bk), out = [], i;
    if (typeof downFn !== 'function') return out;
    for (i = 0; i < rows.length; i++) {
      var id = rows[i].id;
      var d = false;
      try { d = !!downFn(id); } catch (_e) { d = false; }
      if (!d) continue;
      var left = 0;
      try { left = (typeof leftFn === 'function') ? (leftFn(id) | 0) : 0; } catch (_e2) { left = 0; }
      out.push({ id: id, since: rows[i].since, daysLeft: Math.max(0, left) });
    }
    return out;
  }

  /* PLAYER-FACING WORDS, draft:true (8/11: words get an attempt, decisions wait).
     The mark says the promise, not a status. The cost says what is gone and for
     how long, because "a long time" is the whole feeling of the law it stands on
     and a badge would not carry it. */
  function sayKept() { return 'YOU WILL NOT LOSE THEM'; }
  function sayCost(row) {
    if (!row) return null;
    var left = row.daysLeft | 0;
    if (!left) return 'BACK WITH YOU';
    if (left === 1) return 'GIVING YOU NOTHING, ONE MORE DAY';
    return 'GIVING YOU NOTHING, ' + left + ' DAYS';
  }

  var API = { lock: lock, unlock: unlock, isLocked: isLocked,
              list: list, count: count, withheld: withheld,
              sayKept: sayKept, sayCost: sayCost };
  if (HASREQ) module.exports = API; else root.BohemiaLock = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
