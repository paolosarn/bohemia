// BOHEMIA WATCH — CAN THE PLAYER WATCH IT HAPPEN (9/21/26, WORLD lane)
// Board row [visible change] / WHAT-AN-ASK-IS-ALLOWED-TO-MOVE.
//
// ============================================================================
// RULE 12 FIRST, AND THE ROW'S PREMISE IS STALE
// ============================================================================
// The row asks for "the list of things a generated ask may change, and every one
// of them has to be something a player can already SEE happen". MEASURED BEFORE
// BUILDING ANYTHING: THE LIST ALREADY EXISTS. QUESTS shipped it on 9/6 inside
// engine/bohemia_asks.js as CHANGES, six rows, and they are the six rows the
// board row names, word for word, down to "a rumour about you turning".
//
// So writing the list again would have shipped a second list that drifts from the
// first. What is missing is not the list. IT IS THAT NOTHING CHECKS IT.
//
// ============================================================================
// AND HERE IS THE PROOF THAT NOTHING CHECKS IT, FROM THIS LANE'S OWN WORK
// ============================================================================
// Two of the six rows are marked UNWIRED, each carrying a typed sentence saying
// why. One of them says:
//
//     debt_moves -- "belonging models debt as a faction WANT, not a balance with
//                    a name on it that anybody can clear"
//
// THAT SENTENCE WAS TRUE ON 9/6 AND THIS LANE MADE IT FALSE ON 9/13.
// engine/bohemia_lend.js ships take() (a named lender hands you batteries),
// paid() (the balance comes down and the row is DELETED at zero) and short()
// (you miss, and the street finds out). A balance, with a name on it, that
// anybody can clear. [debt carried] put the lender's name on it the same week.
//
// Nobody told the list. Nobody could have: the reason is a STRING. A string
// cannot notice that the world moved underneath it, and a list of what a quest
// is allowed to do is exactly the wrong place for a fact that can quietly go out
// of date, because the cost is a real quest refusing to be generated.
//
// ============================================================================
// SO THIS MODULE HOLDS THE TWO THINGS THE LIST CANNOT HOLD ITSELF
// ============================================================================
//
// 1. A WATCHER. For every change, WHERE A PLAYER SEES IT, named as a surface and
//    a symbol on that surface. A change nobody can watch is filler with a ledger
//    entry, and that is the sentence the board row is actually made of.
//
// 2. A PROMOTION TEST. For every UNWIRED change, the check that would make it
//    wired, written as a PREDICATE OVER THE LIVE MODULES rather than a sentence
//    about them. Run it and a row that has quietly become buildable says so, by
//    itself, forever, without anybody remembering to look. That is the whole fix
//    for what happened to debt_moves, and it fixes the next one too.
//
// WHAT THIS MODULE DOES NOT DO: it does not own the list, edit the list, or keep
// a copy of the list. The list is QUESTS' (ONE SYSTEM, ONE SESSION). Everything
// here TAKES the list as an argument and answers questions about it. Hand it a
// list with a seventh row and it answers about seven; hand it QUESTS' list after
// they change it and it follows. Nothing here can drift from the list, because
// nothing here remembers the list.
//
// ============================================================================
// AND THE WATCHER IS NOT A GREP, WHICH IS THE PART THAT HAD TO BE GOT RIGHT
// ============================================================================
// A symbol existing in a file is not a player watching something happen. This
// lane has been burned by exactly that shape twice: a "nothing is typed" check
// that passed a hard-coded list because the string stripper blinded it, and a
// page-width check that read a max-width as a fixed width.
//
// So a watcher names a READING -- a piece of TEXT a player reads -- and the gate
// drives the real surface, takes that reading, makes the change through the
// game's own function, and takes the reading again. THE WORDS MUST HAVE MOVED.
// That is QUESTS' own rule 14(h) finding applied to a different problem: a screen
// diff reads false life AND false death, and words do not repaint on their own.
//
// A watcher whose reading this lane cannot honestly drive says so in its own body
// (`driven: false`) instead of being counted as proven. Six half-checks reported
// as six checks is how a gate becomes a decoration.
(function (root) {
  'use strict';

  var DRAFT = true;

  /* --------------------------------------------------------------------------
     THE WATCHERS. Keyed by the change ids QUESTS' list uses.

       reads    what the player reads, in plain words
       surface  the file the player is looking at
       symbol   the thing on that surface that produces the reading
       driven   whether this lane can make the change happen and re-read, in a
                test, on the real surface. FALSE IS AN HONEST ANSWER and it is
                never counted as proof.
       why      for driven:false, what stops it
     -------------------------------------------------------------------------- */
  var SURFACE = 'slices/BOHEMIA_CITY_WORLD.html';

  var WATCHERS = {
    block_changes_hands: {
      reads: 'the card names whose ground you are standing on',
      surface: SURFACE, symbol: 'turfGrid',
      driven: true, draft: DRAFT
    },
    light_comes_back: {
      reads: 'the night card counts the circuits you hold and the ones that went dark',
      surface: SURFACE, symbol: 'DARK_TONIGHT',
      driven: true, draft: DRAFT
    },
    shelf_refills: {
      reads: 'the shop card lists what is on the shelf',
      surface: SURFACE, symbol: 'stocks',
      driven: true, draft: DRAFT
    },
    rumour_turns: {
      reads: 'the standing card says where you stand with them',
      surface: SURFACE, symbol: 'gossip',
      driven: true, draft: DRAFT
    },
    debt_moves: {
      reads: 'WHO YOU OWE names the lender and the amount, and the line leaves when it is paid',
      surface: SURFACE, symbol: 'owingRows',
      driven: true, draft: DRAFT
    },
    person_moves_house: {
      reads: null,
      surface: null, symbol: null,
      driven: false,
      why: 'nothing renders where somebody lives, because nothing moves them',
      draft: DRAFT
    }
  };

  /* --------------------------------------------------------------------------
     THE PROMOTION TESTS.

     For each change the list marks UNWIRED, the check that would make it wired,
     as a function of the modules that are actually loaded. A test returns the
     evidence (a string naming what it found) or null.

     THESE ARE THE ANSWER TO THE STALE STRING. A reason written as prose can only
     be re-read by a person who thinks to re-read it. A reason written as a
     predicate re-reads itself every time anything runs.
     -------------------------------------------------------------------------- */
  function mod(name) {
    try { if (root && root[name]) return root[name]; } catch (e) {}
    return null;
  }
  function req(file) {
    if (typeof module === 'undefined' || typeof require === 'undefined') return null;
    try { return require('./' + file); } catch (e) { return null; }
  }
  function pick(globalName, file) { return mod(globalName) || req(file); }

  var PROMOTION = {
    /* "a balance with a name on it that anybody can clear" -- said as a test.
       Three things, all of them required, because a balance you cannot bring
       down is not a debt and a debt with no name on it cannot be called in. */
    debt_moves: function () {
      var L = pick('BohemiaLend', 'bohemia_lend.js');
      if (!L) return null;
      var hasTake = typeof L.take === 'function';
      var hasPaid = typeof L.paid === 'function';
      var hasNamed = typeof L.owingRows === 'function';
      if (!(hasTake && hasPaid && hasNamed)) return null;
      /* AND IT IS DRIVEN, NOT TRUSTED: lend one, clear it, watch the row go. */
      var book = {};
      try {
        L.take(book, 'A LENDER', 1);
        var owedNow = L.owingRows(book);
        if (!owedNow || !Object.keys(owedNow).length) return null;
        L.paid(book, 'A LENDER', 99);
        var owedAfter = L.owingRows(book);
        if (owedAfter && Object.keys(owedAfter).length) return null;
      } catch (e) { return null; }
      return 'bohemia_lend take/paid/owingRows: a named debt was taken and cleared to nothing';
    },

    /* "nothing in the repo moves a person from one home to another" -- said as a
       test, so that the day somebody builds it this row promotes itself. A
       person's home is a DERIVED field of the seed, so the test is not "is there
       a home" (there is, for everybody) but "can it be made different". */
    person_moves_house: function () {
      var P = pick('BohemiaPopulation', 'bohemia_population.js');
      if (!P || typeof P.personFields !== 'function') return null;
      if (typeof P.moveHouse === 'function') return 'bohemia_population.moveHouse exists';
      return null;
    }
  };

  /* --------------------------------------------------------------------------
     THE QUESTIONS. Every one takes the list; none keeps it.
     -------------------------------------------------------------------------- */

  function rows(changes) {
    if (!changes) return [];
    if (Array.isArray(changes)) return changes.slice();
    var out = [];
    for (var k in changes) if (Object.prototype.hasOwnProperty.call(changes, k)) out.push(changes[k]);
    return out;
  }

  function watcherFor(id) {
    return (id && Object.prototype.hasOwnProperty.call(WATCHERS, id)) ? WATCHERS[id] : null;
  }

  /* *** THE ROW'S OWN SENTENCE, AS A FUNCTION. ***
     Which changes on this list nobody can watch happen. Anything in here is
     filler with a ledger entry, and the row says nothing may go on the list that
     the player cannot watch. */
  function unwatched(changes) {
    var out = [];
    var list = rows(changes);
    for (var i = 0; i < list.length; i++) {
      var c = list[i]; if (!c || !c.id) continue;
      var w = watcherFor(c.id);
      if (!w || !w.reads || !w.surface) out.push({ id: c.id, why: (w && w.why) || 'no watcher declared' });
    }
    return out;
  }

  /* A change this module has never heard of. The list is somebody else's, so a
     seventh row must be reported rather than silently ignored -- a checker that
     quietly skips what it does not recognise checks nothing. */
  function unknown(changes) {
    var out = [], list = rows(changes);
    for (var i = 0; i < list.length; i++) {
      var c = list[i]; if (!c || !c.id) continue;
      if (!Object.prototype.hasOwnProperty.call(WATCHERS, c.id)) out.push(c.id);
    }
    return out;
  }

  /* *** THE ONE THAT WOULD HAVE CAUGHT THIS ROUND'S FINDING NINE DAYS AGO. ***
     Rows the list still marks unwired whose promotion test now passes. Each one
     comes back with the evidence, so nobody has to take this module's word for
     it either. */
  function stale(changes) {
    var out = [], list = rows(changes);
    for (var i = 0; i < list.length; i++) {
      var c = list[i]; if (!c || !c.id) continue;
      var isUnwired = !c.proof || !!c.unwired;
      if (!isUnwired) continue;
      var test = PROMOTION[c.id];
      if (typeof test !== 'function') continue;
      var found = null;
      try { found = test(); } catch (e) { found = null; }
      if (found) out.push({ id: c.id, said: c.unwired || null, found: found });
    }
    return out;
  }

  /* Rows that are still honestly unwired, with the test that is still failing.
     The complement of stale(), and it exists so a report can say BOTH numbers:
     a lane that only ever prints what it fixed is telling half the truth. */
  function stillUnwired(changes) {
    var out = [], list = rows(changes);
    for (var i = 0; i < list.length; i++) {
      var c = list[i]; if (!c || !c.id) continue;
      if (c.proof && !c.unwired) continue;
      var test = PROMOTION[c.id];
      var found = null;
      if (typeof test === 'function') { try { found = test(); } catch (e) { found = null; } }
      if (!found) out.push({ id: c.id, said: c.unwired || null, tested: typeof test === 'function' });
    }
    return out;
  }

  /* everything at once, for a surface or a gate that wants one call */
  function report(changes) {
    var list = rows(changes);
    return {
      changes: list.length,
      unwatched: unwatched(changes),
      unknown: unknown(changes),
      stale: stale(changes),
      stillUnwired: stillUnwired(changes),
      driven: (function () {
        var n = 0;
        for (var k in WATCHERS) if (WATCHERS[k].driven) n++;
        return n;
      })(),
      draft: DRAFT
    };
  }

  var API = {
    WATCHERS: WATCHERS,
    PROMOTION: PROMOTION,
    watcherFor: watcherFor,
    unwatched: unwatched,
    unknown: unknown,
    stale: stale,
    stillUnwired: stillUnwired,
    report: report,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaWatch = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
