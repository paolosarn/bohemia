// BOHEMIA OBLIGATION — WHO IS WAITING ON YOU, AND WHO STOPS WAITING.
// (9/7/26, PEOPLE lane. VAMILY [neglect costs], row BB-OBLIGATION-BURN.)
//
// THE ROW, IN ITS OWN WORDS: "THE STAKES TABLE GETS ITS FIRST ENTRY AND IT IS AN
// OBLIGATION, NOT A METER ... ONE thing not five meters; it SCALES WITH SUCCESS
// so a bigger operation is a bigger obligation; the punishment is a person
// walking away, not a bar draining."
//
// *** MEASURED BEFORE A LINE WAS WRITTEN. ***
//   STAKES: []                     the socket is built, applied at every
//                                  reckoning, and EMPTY. This is its first entry.
//   upkeep(purse, verb, ref, day)  debits exactly 1, always. No headcount is in
//                                  its signature, so a household of nine costs
//                                  what a household of one costs. (ECONOMY
//                                  round 23 measured the same thing from the
//                                  other side and routed it here.)
//   desert / leaves / quit /       ZERO across bohemia_commitment,
//   abandon / walk away            bohemia_favour, bohemia_standing and
//                                  bohemia_claim. NOBODY IN THIS VALLEY HAS EVER
//                                  STOPPED WAITING FOR THE PLAYER.
//   neglectFor(state)              EXISTS, returns a per-stage number, and every
//                                  one of those numbers is tagged
//                                  "neglectPlaceholder": true. A cost nobody
//                                  ruled, consumed by nothing.
//
// So the mechanism was half-built and inert: a ladder that knows what neglect
// WOULD cost, a day loop with a socket for it, and nothing that ever charges it.
//
// ============================================================================
// WHY THIS SHIPS WITHOUT PAOLO RULING A SINGLE NUMBER
// ============================================================================
// NO DAMAGE BEFORE THE DIAL froze every stakes conversation, and correctly: a
// hunger meter needs a RATE, and rates are his. The row's own unlock is that a
// SOCIAL burn is not damage -- "Hunger needs a rate. 'Three people are waiting
// on you' needs nothing but the truth."
// So this module states truths and never applies a rate:
//   how many people are waiting on you        counted, not tuned
//   which of them you showed up for today     read off the deed ledger's turns
//   who has stopped waiting                   derived from what THEY have seen
// The placeholder neglect numbers are DELIBERATELY NOT READ here. Consuming a
// number tagged as a placeholder is how a guess becomes canon by accident.
//
// AND THE LEAVING RULE INVENTS NO THRESHOLD EITHER. Battle Brothers is the named
// study and its punishment is loneliness, not death: miss what you owe and men
// desert. What it does NOT hand us is "after how many days", so that is not
// copied. Somebody stops waiting when BOTH of two things the game already
// computes are true:
//   1. everything they have seen of you now comes out NEGATIVE, which is the
//      standing web's own arithmetic (the same sum wouldSquare asks), and
//   2. you did not show up for them on the day that was just reckoned.
// Neither half is a dial. A person with a good opinion of you forgives a quiet
// day; a person you have wronged and then ignored is the one who goes. That is
// the harder, truer version and it costs nothing to defend.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* WHAT COUNTS AS SOMEBODY WAITING ON YOU. Two kinds, and both are read off
     state the game already keeps rather than a list this module invents:
       KIN     the living family the tree holds -- the one you married and the
               children you had. They do not choose to be waiting on you.
       SWORN   every outfit you have committed to, at any stage past 'none'.
               These DID choose, which is why walking away means something. */
  var KIN = 'kin', SWORN = 'sworn';

  function norm(x) { return String(x == null ? '' : x).toLowerCase().trim(); }

  /* ==========================================================================
     WHO IS WAITING ON YOU. Handed the facts; reads no global and keeps no copy.
       facts.tree     the family tree (BohemiaFamily's shape) or null
       facts.commit   save.meta.commit, factionId -> commitment state
       facts.gone     ids that have already walked, so they are not re-counted
     RETURNS one flat list, because the row says ONE THING NOT FIVE METERS and a
     list you have to add up in three places is five meters wearing a coat.
     ========================================================================== */
  function waitingOn(facts) {
    facts = facts || {};
    var gone = facts.gone || {};
    var out = [];

    var tree = facts.tree || [];
    for (var i = 0; i < tree.length; i++) {
      var n = tree[i];
      if (!n || !n.alive) continue;
      /* THE PARENTS AND THE SIBLING ARE NOT ON THIS LIST, and that is a reading
         of the story rather than an oversight: act one opens by losing them and
         the ones who walk out walked out with you. What you TOOK ON is the
         marriage and the children -- the two things the player chose. */
      if (n.rel !== 'spouse' && n.rel !== 'child') continue;
      if (gone[n.id]) continue;
      out.push({ id: n.id, kind: KIN, rel: n.rel, name: n.name || null });
    }

    var commit = facts.commit || {};
    for (var fid in commit) {
      if (!Object.prototype.hasOwnProperty.call(commit, fid)) continue;
      var st = norm(commit[fid]);
      if (!st || st === 'none') continue;      /* 'NOTHING SAID' is not an obligation */
      if (gone['fac:' + fid]) continue;
      out.push({ id: 'fac:' + fid, kind: SWORN, fid: fid, state: st, name: null });
    }
    return out;
  }

  /* IT SCALES WITH SUCCESS, WHICH IS THE ROW'S OWN WORDS, AND IT IS A COUNT
     RATHER THAN A CURVE. A bigger operation is a bigger obligation because more
     people are waiting, full stop. No weighting, because weighting is where a
     number nobody ruled would sneak in. */
  function sizeOf(facts) { return waitingOn(facts).length; }

  /* ==========================================================================
     DID YOU SHOW UP FOR THEM. Read off the deed ledger the game already writes:
     a deed with a turn on it, witnessed by that person, inside the day being
     reckoned. Nothing new is recorded and nothing is rolled.
       facts.deedsFor(id)  -> array of {turn} the caller resolves however it
                              stores them. REQUIRED: this module will not guess
                              at a ledger shape.
       dayStart/dayEnd     the minute bounds of the day being reckoned
     ========================================================================== */
  function showedUpFor(facts, id, dayStart, dayEnd) {
    var f = facts && facts.deedsFor;
    if (typeof f !== 'function')
      throw new Error('BohemiaObligation needs facts.deedsFor(id) handed in. It '
        + 'will not guess how deeds are stored, because guessing a ledger shape '
        + 'is how a check silently starts measuring nothing.');
    var list = f(id) || [];
    for (var i = 0; i < list.length; i++) {
      var t = list[i] && list[i].turn;
      if (typeof t !== 'number') continue;
      if (t >= dayStart && t <= dayEnd) return true;
    }
    return false;
  }

  /* ==========================================================================
     WHO STOPS WAITING. Both halves are truths the game already computes, and
     there is no threshold, no counter and no rate.
       facts.opinionOf(id) -> a number, the standing web's own sum. Negative
                              means everything they have seen of you comes out
                              against you.
     A person leaves only when their opinion is negative AND you did not show up
     for them in the day just reckoned. Somebody who thinks well of you gets a
     quiet day for free, which is true of people.
     KIN ARE NOT EXEMPT AND THAT IS THE POINT OF THE ROW. "You do not die of
     poverty in that game, YOU END UP ALONE."
     ========================================================================== */
  function whoWalks(facts, dayStart, dayEnd) {
    var op = facts && facts.opinionOf;
    if (typeof op !== 'function')
      throw new Error('BohemiaObligation needs facts.opinionOf(id) handed in. '
        + 'Whether somebody has had enough of you is the standing web\'s answer, '
        + 'not a number this module is entitled to invent.');
    var list = waitingOn(facts), out = [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var v = op(p.id);
      if (typeof v !== 'number' || v >= 0) continue;
      if (showedUpFor(facts, p.id, dayStart, dayEnd)) continue;
      out.push(p);
    }
    return out;
  }

  /* ==========================================================================
     THE STAKES ENTRY. The day loop's contract is {name, apply(ledger, state)},
     and the reckoning REPORTS -- it does not starve you, drain you or kill you.
     So apply() writes what is true onto the ledger and nothing else. Who
     actually leaves is the surface's to act on, because removing a person from
     the world is a write and a pure module does not reach out and do that.
     ========================================================================== */
  function stakesEntry(read) {
    if (typeof read !== 'function')
      throw new Error('BohemiaObligation.stakesEntry needs a read() that hands '
        + 'back the facts at reckoning time. A stakes entry that captured them '
        + 'once would report yesterday forever.');
    return {
      name: 'obligation',
      apply: function (ledger, L) {
        var facts = read(L) || {};
        var dayEnd = (L && typeof L.min === 'number') ? L.min : 0;
        var day = (L && L.day) || 1;
        var dayStart = (L && typeof L.WAKE_MIN === 'number') ? L.WAKE_MIN : 0;
        /* the deed ledger stamps absolute minutes, so lift the bounds to them */
        var base = (day - 1) * 1440;
        var list = waitingOn(facts);
        var kept = [], missed = [];
        for (var i = 0; i < list.length; i++) {
          (showedUpFor(facts, list[i].id, base + dayStart, base + dayEnd)
            ? kept : missed).push(list[i]);
        }
        ledger.obligation = {
          waiting: list.length,
          showedUp: kept.length,
          missed: missed.length,
          leaving: whoWalks(facts, base + dayStart, base + dayEnd)
                     .map(function (p) { return p.id; })
        };
        return ledger.obligation;
      }
    };
  }

  /* PLAYER-FACING WORDS, ALL draft:true (8/11: words get an attempt, decisions
     wait). They state the count, because the row's whole argument is that the
     truth is enough and needs no dial under it. */
  function say(o) {
    if (!o || !o.waiting) return 'NOBODY IS WAITING ON YOU';
    var n = o.waiting;
    var people = n === 1 ? 'ONE PERSON IS' : (n + ' PEOPLE ARE');
    if (!o.missed) return people + ' WAITING ON YOU, AND YOU SHOWED UP FOR ALL OF THEM';
    if (!o.showedUp) return people + ' WAITING ON YOU AND YOU SHOWED UP FOR NONE OF THEM';
    return people + ' WAITING ON YOU. YOU SHOWED UP FOR ' + o.showedUp;
  }

  var API = { KIN: KIN, SWORN: SWORN,
              waitingOn: waitingOn, sizeOf: sizeOf, showedUpFor: showedUpFor,
              whoWalks: whoWalks, stakesEntry: stakesEntry, say: say };
  if (HASREQ) module.exports = API; else root.BohemiaObligation = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
