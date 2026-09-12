// BOHEMIA LEND — WE BUILT THE COURTHOUSE AND NEVER ISSUED A LOAN (9/13/26, WORLD lane)
// Board row [someone lends] / WE-BUILT-THE-COURTHOUSE-AND-NEVER-ISSUED-A-LOAN.
//
// ============================================================================
// THE ROW, HARVESTED FROM ECONOMY ROUND 9
// ============================================================================
//   "Everything courtless credit needs is LIVE: news walks a real acquaintance
//    graph three hops, memory decays, belonging and deeds are recorded, the purse
//    refuses debt. Nothing in the game ever lends anybody anything, so the
//    enforcement machine has never had a debt to enforce. Let a person or a
//    faction lend you batteries, on a handshake, remembered by the machine that
//    already exists; the debt names its lender (with [debt carried]) and the
//    street finds out if you do not pay."
//
// MEASURED, AND THE ROW IS EXACTLY RIGHT: zero hits for lend/loan/borrow anywhere
// in engine/ that are not prose. The only two that read like credit are BARKS in
// bohemia_people.js -- "Everything's a loan. The only question is who's holding
// it." and "Ten percent isn't greed, it's the reason there's anything to lend."
// PEOPLE IN THIS GAME TALK ABOUT LENDING AND NOBODY LENDS.
//
// ============================================================================
// A LOAN IS NOT A NEGATIVE BALANCE, WHICH IS WHY THE PURSE NEVER HAD TO BEND
// ============================================================================
// bohemia_purse's own header: "Balances never go negative, so no hidden debt
// system exists by accident -- debt would be canon, and canon is Paolo's." That
// rule is not in the way here and never was. A real loan is TWO facts, not one
// negative number: the batteries REALLY ARRIVE (a credit, positive, through the
// purse's own writer) and an OBLIGATION is recorded beside it, naming who it is
// to. The purse stays a purse and the book stays a book.
//
// ============================================================================
// WHO LENDS, AND NOT ONE THRESHOLD IS TYPED HERE
// ============================================================================
// A lender is somebody who gives before you have earned it, and THE GAME ALREADY
// SAYS WHO THAT IS. bohemia_favour's GIVES table carries `owes: true` for the
// outfits whose first move is to hand you something for nothing -- the same flag
// that opens the account THE DEBT GETS CALLED IN (8/18) was written about. So the
// outfits that will lend you batteries are read straight off that answer.
// Inventing a rung or a standing floor here would have been a number nobody ruled,
// and it would have disagreed with the table the moment either one moved.
//
// ============================================================================
// EVERYTHING COSTS ONE, INCLUDING THIS
// ============================================================================
// A handshake hands over ONE BATTERY (his 8/15 ONE, in his 9/4 BATTERY) and comes
// back ONE A NIGHT, which is the shape the night already has: rent is billed at
// nightfall and a night you cannot pay is a night you went short. Nothing new had
// to be invented to make a loan bite; it bites the same way the lights do.
//
// HOW MUCH YOU MAY OWE IN TOTAL, WHAT INTEREST IS, AND HOW LONG THEY WAIT ARE
// PRICES, AND PRICES ARE HIS. They ship EMPTY and enumerable in placeholders(),
// per EVERYTHING COSTS ONE section 5, the way bohemia_favour lists its own.
//
// ============================================================================
// AND IT CAN BE PAID OFF, WHICH IS NOT A KINDNESS, IT IS THE MECHANIC
// ============================================================================
// THE DEBT GETS CALLED IN rule 2: "AN INTERVAL MUST BE ABLE TO CLOSE. If an
// obligation can only grow, it has stopped being a relationship and the player has
// stopped having a decision." An account at zero is deleted rather than kept at
// zero, so a squared debt cannot come back as a row saying you owe nothing.
// Interest is exactly the thing that would make the interval uncloseable, which is
// the second reason it is not a number this file gets to pick.
//
// ============================================================================
// THE STREET FINDS OUT, THROUGH THE MACHINE THAT ALREADY EXISTS
// ============================================================================
// A night you go short is published as a DEED, so it is witnessed by whoever is
// standing there and retold across the acquaintance graph with the hops and the
// decay that were already built. That half is real and measured.
//
// WHAT IT DOES NOT DO IS MOVE A STANDING, AND I ASSUMED THE WRONG REASON UNTIL I
// MEASURED IT. I expected bohemia_standing's DEED_WEIGHT to be empty, waiting on a
// ruling. It is not: it has 83 rows. Every one of them is keyed
// `q:<quest>:<stage>@<FACTION>` -- THE WEIGHTS ARE DERIVED FROM THE AUTHORED QUEST
// CORPUS, off the @DO lines, and NOT ONE OF THE FOUR DEED KINDS THE WALKED CITY
// ALREADY PUBLISHES IS IN IT: claim:met, claim:refused, commit and favour are all
// missing too. So a city deed is witnessed, remembered and retold, and weighs
// nothing, and this one is in exactly the same position as four that shipped
// before it rather than in a hole of its own.
// Inventing a weight here would be a number nobody ruled AND a second source for a
// table that has one. It is named in placeholders() and ROUTED instead.
//
// node: require('./bohemia_lend.js')   Gate: gates/someone_lends_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  /* HIS ONE, IN HIS BATTERY. Not a dial: EVERYTHING COSTS ONE (8/15, LOCKED) and
     BATTERIES ARE THE MONEY (9/4, LOCKED). */
  var HANDSHAKE = 1;          /* what one handshake hands over */
  var DUE_A_NIGHT = 1;        /* what the night asks back */
  var CURRENCY = 'electricity';

  /* THE DEED THE STREET HEARS. The kind is an act, not a faction -- a kind per
     outfit would grow his DEED_WEIGHT table with the roster, and he weighs an ACT
     once. Which outfit it was about rides on the memory, the way every other deed
     on this surface already does. */
  var SHORT_DEED = 'loan:short';

  function name(f) { return String(f == null ? '' : f).toUpperCase().replace(/[\s_]+/g, ' ').trim(); }
  function bookOf(b) { return (b && typeof b === 'object') ? b : {}; }
  function keyIn(book, who) {
    var want = name(who);
    for (var k in book) if (name(k) === want) return k;
    return want;
  }

  /* ---- WHO LENDS --------------------------------------------------------
     Takes what bohemia_favour.askFor already answered about this outfit, so this
     never has to know a rule's shape or reach into that module's tables. An
     outfit lends if it is offering at all AND its first move is to give -- the
     `owes` flag, which is the game's own definition of a lender. */
  function offers(ask) {
    return !!(ask && ask.can && ask.owes);
  }

  /* ---- THE HANDSHAKE ----------------------------------------------------
     Opens or grows the account. THIS FILE IS THE ONE WRITER OF THE LOAN BOOK, the
     same discipline bohemia_favour states about the favour account: a second
     writer is how two records of one fact start disagreeing. */
  function take(book, who, day) {
    book = bookOf(book);
    if (!who) return { took: false, why: 'NOBODY TO ASK' };
    var k = keyIn(book, who), r = book[k];
    if (!r) r = book[k] = { batteries: 0, since: day | 0, short: 0, lastShort: 0 };
    r.batteries += HANDSHAKE;
    return { took: true, who: name(k), got: HANDSHAKE, currency: CURRENCY,
             owed: r.batteries, draft: DRAFT };
  }

  /* ---- WHAT TONIGHT ASKS BACK -------------------------------------------
     One per open account, per night. Answers, never acts: the surface pays it
     through the purse's own writer and tells this what happened, so the purse
     stays the only thing that moves money. */
  function due(book) {
    book = bookOf(book);
    var out = [];
    for (var k in book) {
      var r = book[k]; if (!r || !(r.batteries > 0)) continue;
      out.push({ who: name(k), owed: r.batteries | 0,
                 due: Math.min(DUE_A_NIGHT, r.batteries | 0), currency: CURRENCY });
    }
    out.sort(function (a, b) { return (b.owed - a.owed) || (a.who < b.who ? -1 : 1); });
    return out;
  }

  /* A NIGHT THAT WAS PAID. Deletes the account at zero rather than leaving it at
     zero: an interval that closes has to actually close. */
  function paid(book, who, n) {
    book = bookOf(book);
    var k = keyIn(book, who), r = book[k];
    if (!r) return 0;
    r.batteries = Math.max(0, (r.batteries | 0) - (n | 0));
    if (!r.batteries) { delete book[k]; return 0; }
    return r.batteries;
  }

  /* A NIGHT THAT WAS NOT. Counted and dated, never priced -- the same refusal the
     rent book makes, for the same reason. The deed is published by the surface,
     which is the only thing that knows who was standing there to see it. */
  function short(book, who, day) {
    book = bookOf(book);
    var k = keyIn(book, who), r = book[k];
    if (!r) return null;
    r.short = (r.short | 0) + 1;
    r.lastShort = day | 0;
    return { who: name(k), owed: r.batteries | 0, nights: r.short,
             deed: SHORT_DEED, draft: DRAFT };
  }

  /* ---- FOR THE ONE BOOK THAT NAMES EVERY LENDER --------------------------
     [debt carried] shipped the join; this hands it a third kind in the shape it
     already reads, so a loan appears on the nightfall card beside the favours and
     the rent, dies at the fold with them, and leaves the lender standing. */
  function owingRows(book) {
    book = bookOf(book);
    var out = {};
    for (var k in book) {
      var r = book[k]; if (!r || !(r.batteries > 0)) continue;
      out[name(k)] = { nights: r.batteries | 0, lastDay: r.since | 0 };
    }
    return out;
  }

  function words() {
    return {
      offer: 'ASK THEM FOR A BATTERY',                                  /* draft */
      took: 'They put one in your hand. Nothing was written down.',     /* draft */
      night: 'You paid one back.',                                      /* draft */
      missed: 'You did not pay them tonight. People saw.',              /* draft */
      clear: 'You are square with them.'                                /* draft */
    };
  }

  /* every unruled number, enumerable, per EVERYTHING COSTS ONE section 5 */
  function placeholders() {
    return [
      { where: 'bohemia_lend.CEILING', value: null, placeholder: true,
        law: 'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what: 'how much one outfit will let you owe before they stop handing them over' },
      { where: 'bohemia_lend.INTEREST', value: null, placeholder: true,
        law: 'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what: 'what it costs to owe over time; EMPTY on purpose, because a rate is '
            + 'the one thing that can make the interval uncloseable' },
      { where: 'bohemia_lend.PATIENCE', value: null, placeholder: true,
        law: 'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what: 'how many short nights an outfit takes before they do something about it' },
      { where: 'bohemia_standing.DEED_WEIGHT[' + SHORT_DEED + ']', value: null, placeholder: true,
        law: 'MECHANISM-MINE / CONTENTS-PAOLO\'S',
        what: 'what a missed night does to how they feel about you. MEASURED: that '
            + 'table\'s 83 rows are all q:<quest>:<stage>@<FACTION>, derived from the '
            + 'authored quest corpus, and NO city-published deed kind is in it -- not '
            + 'claim:met, claim:refused, commit or favour either. Every act the walked '
            + 'city publishes is witnessed and retold and weighs nothing. That is one '
            + 'gap for all five, not five gaps, and it is ROUTED rather than patched '
            + 'with a number invented here' }
    ];
  }

  var API = { HANDSHAKE: HANDSHAKE, DUE_A_NIGHT: DUE_A_NIGHT, CURRENCY: CURRENCY,
              SHORT_DEED: SHORT_DEED,
              offers: offers, take: take, due: due, paid: paid, short: short,
              owingRows: owingRows, words: words, placeholders: placeholders };
  if (HASREQ) module.exports = API;
  root.BohemiaLend = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
