// BOHEMIA OWING — THE DEBT NAMES ITS LENDER AND OUTLIVES YOU (9/12/26, WORLD lane)
// Board row [debt carried] / THE-DEBT-NAMES-ITS-LENDER-AND-OUTLIVES-YOU.
//
// ============================================================================
// THE ROW, FROM THE 9/5 HEIR RESEARCH
// ============================================================================
//   "where there is no state, the lender collects from the family. Every debt in
//    the ledger names WHO is owed (a faction, a person) and survives the
//    generation fold to the heir."
//   (records/BOHEMIA_COORDINATOR_RESEARCH_THE_HEIR_PAYS_9_5_26.md)
//
// ============================================================================
// THE WORD "DEBT" WAS THREE UNRELATED SYSTEMS, AND NOTHING ASKED ALL OF THEM
// ============================================================================
// Measured across the repo before a line of this was written:
//   1. FAVOURS TAKEN     save.meta.owed[faction], a count, written by
//                        bohemia_favour.take, cleared by bohemia_favour.settle.
//                        Real teeth: bohemia_claim reads it, and an outfit you
//                        owe bypasses the weekly ration and costs you one extra
//                        rung per unpaid favour when you refuse them.
//   2. RENT GONE SHORT   OWED_BOOK[faction] = {nights, lastDay}, written on the
//                        walked surface when you cannot pay rent on a faction's
//                        ground (FACTIONS, 9/12).
//   3. PEOPLE YOU DID NOT SHOW UP FOR -- and this one is NOT an account. It is a
//                        charge that fires once and is over. Putting it in a book
//                        of running accounts would be inventing a debt nobody
//                        built, so it is left where it is and named here so the
//                        next reader does not go looking for it.
// Two real running accounts, no shared code, no shared word, and NO ONE PLACE
// THAT ANSWERS "WHO DO I OWE". This file is that place and nothing else.
//
// ============================================================================
// IT OWNS NOTHING AND REACHES INTO NOTHING
// ============================================================================
// THE DEBT GETS CALLED IN (8/18, LOCKED) rule 4: "TWO LEDGERS, TWO OWNERS,
// NUMBERS BETWEEN THEM. Cross-system effects pass scalars through the surface,
// never reach into each other's store." So this takes both books as PLAIN DATA
// handed in by the surface, and writes to neither. bohemia_favour stays the only
// writer of the favour account; the walked surface stays the only writer of the
// rent book. A joiner that started writing would be a third writer of two facts.
//
// ============================================================================
// A COUNT, NEVER AN AMOUNT
// ============================================================================
// How many times an outfit handed you something for free, and how many nights you
// went short on their ground, are FACTS. What one of those is WORTH is a weight,
// and weights are Paolo's. So nothing here multiplies, totals or prices anything,
// and no sentence it produces carries a number that was not counted.
//
// ============================================================================
// AND WHAT OUTLIVES YOU IS THE LENDER, NOT THE BILL
// ============================================================================
// The row as written says a debt survives the fold IN FULL. engine/bohemia_fold.js
// (9/7, ruled:true) says the opposite and says why:
//   "a child is not personally liable for a parent's unsecured debts... YOU DO NOT
//    INHERIT A BILL, YOU INHERIT LESS AND YOU INHERIT THE PEOPLE HE OWED, still
//    standing there."
// NEWEST DATE WINS, and FACTIONS shipped the same reading on 9/12 for rent. Which
// of the two stands is canon-level and is already [PENDING Paolo] on their row; it
// is not asked twice here.
//
// SO THE RULING IS READ, NEVER COPIED. billDies() asks bohemia_fold what it ruled
// about the `debt` field instead of spelling the answer here. If Paolo flips it,
// one row in that table moves and the fold stops clearing -- rather than this file
// quietly disagreeing with the table it was written from. The same reason
// bohemia_hunger asks the purse whether its verb still exists.
//
// MEASURED BEFORE ANY OF THIS: the fold rules `debt: dies, ruled:true` and NOTHING
// EVER EXECUTED IT. Twelve favour debts across four outfits went into a fold on the
// walked surface and twelve came out, so the heir inherited the parent's bill and
// paid for it on every refusal. A ruling with no machine behind it is an intention.
//
// node: require('./bohemia_owing.js')   Gate: gates/debt_carried_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function FOLD() {
    if (HASREQ) { try { return require('./bohemia_fold.js'); } catch (e) { return null; } }
    return root.BohemiaFold || (typeof BohemiaFold !== 'undefined' ? BohemiaFold : null);
  }

  /* THE FIELD IN THE FOLD'S OWN TABLE that this account is. Named once. */
  var FOLD_FIELD = 'debt';

  /* THE TWO REAL RUNNING ACCOUNTS. `word` is what the card calls the kind and
     `why` is what it says you owe them for. Attempts, draft:true. ORDER IS THE
     TIE-BREAK ORDER, so two outfits owed the same amount always read the same way
     round. */
  var KINDS = [
    { kind: 'favour', word: 'YOU OWE THEM',
      why: 'took what they were offering' },
    { kind: 'rent',   word: 'YOU WENT SHORT ON THEM',
      why: 'could not pay for their ground' }
  ];

  function kindAt(k) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i].kind === k) return KINDS[i];
    return null;
  }
  function kindRank(k) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i].kind === k) return i;
    return KINDS.length;
  }
  function name(f) { return String(f == null ? '' : f).toUpperCase().replace(/[\s_]+/g, ' ').trim(); }

  /* ---- THE BOOK ---------------------------------------------------------
     book({ favours, rent }) -> rows, worst first.
       favours : the favour account as it is stored, { FACTION: count }
       rent    : the rent book as it is stored,      { FACTION: {nights,lastDay} }
     Either may be missing; a missing half is simply not in the answer, because a
     surface that has not built one of them yet is a real state and not an error.
     A ZERO IS NOT AN ACCOUNT and never becomes a row: bohemia_favour deletes a key
     at zero and the rent book does not, so a reader that trusted the key would
     report outfits you have already squared with. */
  function book(src) {
    var out = [], seen = {}, k;
    src = src || {};
    var fav = src.favours || {}, rent = src.rent || {};

    /* ONE OUTFIT AND ONE KIND IS ONE ACCOUNT, however it was spelled.
       CAUGHT BY MEASURING, not by reading: the two books key their factions
       differently -- the favour account stores SOCIAL_FORCES and the rent book
       stores whatever turfAt calls them, which is title case -- so a single
       outfit can arrive here under two spellings and used to leave as two rows
       saying the same sentence with two different counts. Normalising the name
       is what lets the two stores agree on who a person is; MERGING is what stops
       the agreement from arriving as a double. */
    function add(who, kind, n, lastDay) {
      if (!(n > 0)) return;
      /* A NESTED MAP RATHER THAN A JOINED STRING KEY: a separator is a
         character a faction name is not allowed to contain, and nobody has
         ruled what a faction name may contain. Two maps cannot collide. */
      var by = seen[kind] || (seen[kind] = {}), at = by[who];
      if (at) { at.n += n; if (lastDay > at.lastDay) at.lastDay = lastDay; return; }
      by[who] = { who: who, kind: kind, n: n, lastDay: lastDay | 0 };
      out.push(by[who]);
    }

    for (k in fav) {
      if (!Object.prototype.hasOwnProperty.call(fav, k)) continue;
      add(name(k), 'favour', fav[k] | 0, 0);
    }
    for (k in rent) {
      if (!Object.prototype.hasOwnProperty.call(rent, k)) continue;
      var r = rent[k] || {};
      add(name(k), 'rent', r.nights | 0, r.lastDay | 0);
    }
    /* WORST FIRST, then the more recent, then the kind, then the name. Every
       step is there so the list can never come back in two different orders for
       one book -- a card that reshuffles itself reads as new news every night. */
    out.sort(function (a, b) {
      return (b.n - a.n)
          || (b.lastDay - a.lastDay)
          || (kindRank(a.kind) - kindRank(b.kind))
          || (a.who < b.who ? -1 : a.who > b.who ? 1 : 0);
    });
    return out;
  }

  /* ---- WHAT IT SAYS -----------------------------------------------------
     One sentence per row, NAMING THE LENDER, which is the whole row. The count is
     the only number in it and it is a count of things that happened. draft:true. */
  function say(row) {
    if (!row || !(row.n > 0)) return '';
    var K = kindAt(row.kind); if (!K) return '';
    var times = (row.n === 1) ? 'once' : (row.n === 2 ? 'twice' : (row.n + ' times'));
    if (row.kind === 'favour')
      return row.who + ' gave you something for nothing, ' + times + '. Nobody has mentioned it yet.';
    return row.who + ' let you stay on their ground without paying, ' + times + '.';
  }

  function lines(rows) {
    var out = [];
    for (var i = 0; i < (rows || []).length; i++) {
      var s = say(rows[i]); if (s) out.push(s);
    }
    return out;
  }

  /* ---- WHO, WITHOUT THE BILL --------------------------------------------
     The names, deduped, in the book's own order. THIS IS THE HALF THAT OUTLIVES
     YOU: "you inherit LESS and you inherit THE PEOPLE HE OWED, still standing
     there." An outfit owed on both counts is one person at the door, not two. */
  function creditors(rows) {
    var seen = {}, out = [];
    for (var i = 0; i < (rows || []).length; i++) {
      var w = rows[i] && rows[i].who; if (!w || seen[w]) continue;
      seen[w] = true; out.push(w);
    }
    return out;
  }

  /* ---- WHAT THE FOLD DOES TO IT -----------------------------------------
     ASKED OF bohemia_fold, NEVER SPELLED HERE. Returns true only if that table
     really carries a `debt` row that really says it dies. If the row is gone, or
     Paolo flips it to carry, this returns false and the caller stops clearing --
     which is the point: one ruling, one reader, no second copy to drift. */
  function billDies() {
    var F = FOLD(); if (!F || typeof F.dies !== 'function') return false;
    var d;
    try { d = F.dies() || []; } catch (e) { return false; }
    for (var i = 0; i < d.length; i++) if (d[i] && d[i].field === FOLD_FIELD) return true;
    return false;
  }

  /* WHY IT DIES, IN THE FOLD'S OWN WORDS, so a surface never has to write its own
     version of a sentence that already exists and is ruled. */
  function whyDies() {
    var F = FOLD(); if (!F || !F.CARRY) return '';
    for (var i = 0; i < F.CARRY.length; i++)
      if (F.CARRY[i].field === FOLD_FIELD) return String(F.CARRY[i].why || '');
    return '';
  }

  /* atFold(rows) -- what the handoff does to this book, as an answer rather than
     an action: the accounts that are cleared, and the people who are still there
     afterwards. NOTHING IS WRITTEN HERE; the caller settles through each account's
     own writer. If the ruling ever says carry, `clears` is empty and everybody
     stays, with no other line of code changing. */
  function atFold(rows) {
    rows = rows || [];
    var dies = billDies();
    return {
      dies: dies,
      why: dies ? whyDies() : '',
      clears: dies ? rows.slice() : [],
      keeps: creditors(rows),
      draft: DRAFT
    };
  }

  var API = { KINDS: KINDS, FOLD_FIELD: FOLD_FIELD,
              book: book, say: say, lines: lines, creditors: creditors,
              billDies: billDies, whyDies: whyDies, atFold: atFold };
  if (HASREQ) module.exports = API;
  root.BohemiaOwing = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
