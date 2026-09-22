// BOHEMIA HAGGLE -- ASKING FOR MORE IS FREE ONCE AND EXPENSIVE AFTER
// (9/11/26, QUESTS lane, [haggling works] BB-ASK-FOR-MORE)
//
// THE ROW, RE-MEASURED BEFORE A LINE WAS WRITTEN: zero hits for counter-offer,
// retainer or advance pay anywhere in the walked city. The three "haggle" hits in
// the alpha are an ANIMATION CLIP NAME, a gesture, nothing to do with money. A job
// in this valley has a length now (BB-INSIDE-A-DAY, 9/7) and it has no price and
// no terms.
//
// *** AND THE FIRST HALF OF THIS ROW IS NOT THE HAGGLE, IT IS THE DISCLOSURE. ***
// The wake card says the title, says nobody has picked it up yet, and says how long
// the walk is. IT HAS NEVER SAID WHAT THE JOB PAYS. You cannot ask for more of a
// thing you were never told about, so sayPay() lands before ask() does, and the
// study this row came from names it in the same breath: "a job saying what it pays
// before you take it."
//
// ---------------------------------------------------------------------------
// THE SHAPE, AND WHY IT IS NOT THE SHAPE OF THE GAME WE STUDIED
// ---------------------------------------------------------------------------
// The campaign game he named does this: every haggle adds a random 3 to 6 to a
// hidden ANNOYANCE counter, and at 9 you are thrown out with a reputation hit. So
// it is safe once, risky twice, nearly impossible three times. That shape is the
// thing worth taking and our own study said so in its own words: "it needs no
// balance number under EVERYTHING COSTS ONE."
//
// SO THERE IS NO ANNOYANCE COUNTER IN THIS FILE, AND NO THRESHOLD.
//   - 3, 6 and 9 are that game's numbers. Copying them in would be inventing an
//     economy nobody ruled, dressed up as research.
//   - THE COUNTER IS HOW MANY TIMES YOU OPENED YOUR MOUTH. That is not a balance
//     number, it is a fact about the conversation, and the player can count it
//     themselves. Two asks land. The third ends it.
//   - AND IT IS DELIBERATE, not random. A hidden roll would mean the player can
//     never know where they stand, and this valley already refuses that: a claim
//     is checked by going and looking, never by a roll. You are TOLD, out loud,
//     before the ask that would cost you. Deterministic is a real difference from
//     the game we studied and it is the house style winning, not an oversight.
//
// ---------------------------------------------------------------------------
// WHAT YOU CAN ACTUALLY ASK FOR, AND WHY IT IS NEVER "MORE"
// ---------------------------------------------------------------------------
// EVERYTHING COSTS ONE. A job pays one. So "ask for more" cannot mean two, and
// pretending otherwise would break the one locked number in the economy.
// IT MEANS THE SHAPE OF THE ONE, which is exactly what the study found on the
// other side: "PAYMENT SHAPES: more overall, all-on-completion, or per head
// returned. Different jobs, different shapes."
//
//   1. A DIFFERENT ONE.  The job pays one resources; you ask for one electricity.
//      Still one. Real, because the three are not interchangeable: you cannot eat
//      a battery and a battery will not buy you what people say about you.
//   2. UP FRONT.  The same one, now, instead of at the end. A real trade and not a
//      bonus, per the study: you walk away afterwards holding their thing, and
//      that is what walking away costs.
//
// There are at most three asks on any offer and the room is two, so you can change
// the currency AND take it up front, but you cannot change it twice. That is a
// decision with a shape, and not one number of mine is in it.
//
// ---------------------------------------------------------------------------
// THE STANDING MARK IS NOT A NUMBER EITHER
// ---------------------------------------------------------------------------
// The row asks for a haggle that "leaves a standing mark". It would be easy and
// wrong to debit a clout. In this valley work passes hand to hand and the study
// says what the enforcement actually is: "it's unlikely either will do business
// with the other in the future -- reputation and repeat trade ARE the contract."
// So pushing too far WITHDRAWS THE OFFER, and the mark is a real deed row handed
// to the deed ledger that already exists, witnessed by whoever is standing there,
// carrying the clout tag the deed system already grades. No new standing system,
// no invented debit, and the feed reads it like every other thing you did.
//
// WHAT IS DELIBERATELY NOT HERE
// - NO NEW SCREEN. The row says so and it is right: this is options on the offer
//   the wake card already shows.
// - NO WORDS ABOUT WHO GETS ANGRY AT WHAT. That is contents and it is his. Every
//   line below is draft:true and the module names nobody.
// - NO SECOND CURRENCY IN ONE ANSWER. One job, one currency, one unit, always.
// - NO TIMER. Our failure is a sentence somebody says to a face; the study
//   refused a countdown by name and so does this.
//
// REUSE CHECK: cooks no pixels, opens no bank, writes no save, moves nobody, and
// owns no standing of its own -- it hands a deed row to bohemia_deeds.js.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* HIS THREE, LOCKED 7/26. Not a table to grow: a fourth currency is a ruling. */
  var CURRENCIES = ['resources', 'electricity', 'clout'];

  /* THE ONLY AMOUNT. EVERYTHING COSTS ONE until he tunes it. */
  var ONE = 1;

  /* HOW MUCH ROOM THERE IS, AND IT IS NOT A BALANCE NUMBER: two asks land and the
     third ends it, because there are exactly two KINDS of thing to ask for -- a
     different one, or a shape -- and a third ask can only be repeating yourself
     at somebody who has already said yes twice.
     *** AND IT IS THE NUMBER OF KINDS, NOT THE LENGTH OF THE MENU. (9/13, when
     the menu grew from three rows to five.) *** The old note said "the room is
     the size of the menu", which was true when the menu was one swap-pair plus
     one shape and would have been a TRAP the moment a shape was added: room
     would have grown with the row count and the offer would quietly have become
     harder to lose. Two kinds, two asks, whatever the menu happens to list. */
  function room() { return 2; }

  /* ---- 1. WHAT THE JOB PAYS, READ OFF THE QUEST ITSELF ------------------- */

  /* Every COMPLETE ending of a paying quest pays exactly one currency (the job
     pays gate holds that). Different endings may pay DIFFERENT currencies, which
     is not a bug: it is the residual right the player already has -- the job says
     what somebody needs, the PLAYER decides the manner, and the manner is what
     gets recorded. So this answers honestly in three ways and never guesses. */
  function pays(quest) {
    var stages = (quest && quest.stages) || [];
    var found = {}, endings = 0, i, j, m;
    for (i = 0; i < stages.length; i++) {
      var s = stages[i];
      /* FOLLOW THE ARTEFACT, DO NOT ASSUME ITS SHAPE. My first cut read s.kind
         and the parser has no such field: COMPLETE and FAIL land in s.flags. It
         reported "the quest declares no COMPLETE ending" for every quest in the
         corpus and would have shipped a haggle that could never find a price. */
      if (!s || !s.flags || s.flags.indexOf('COMPLETE') < 0) continue;
      endings++;
      var dos = s.dos || [];
      for (j = 0; j < dos.length; j++) {
        m = /^pay\s+(\S+)\s+(\S+)\s*$/.exec(String(dos[j].text || '').trim());
        if (m && CURRENCIES.indexOf(m[1]) >= 0) found[m[1]] = true;
      }
    }
    var got = Object.keys(found);
    if (!endings) return { kind: 'unknown', currency: null, why: 'the quest declares no COMPLETE ending' };
    if (!got.length) return { kind: 'nothing', currency: null, why: 'no ending of this job pays' };
    if (got.length === 1) return { kind: 'one', currency: got[0], why: 'every ending pays the same one' };
    return { kind: 'depends', currency: null, currencies: got.sort(),
             why: 'what it pays depends on how you do it' };
  }

  /* sayPay(p) -- the line the offer wears, before he presses anything.
     draft:true, and it never invents a number: the only number it can say is ONE,
     which is the locked one. */
  function sayPay(p) {
    if (!p) return null;
    if (p.kind === 'nothing') return 'Pays nothing. They said so up front';
    if (p.kind === 'unknown') return null;
    if (p.kind === 'one') return 'Pays one ' + word(p.currency);
    return 'Pays one, and which one depends on how you do it';         /* draft:true */
  }

  function word(c) {
    /* HIS OWN THREE, IN THE WORDS THE GAME ALREADY USES. No synonyms invented. */
    return c === 'electricity' ? 'battery'
         : c === 'resources'   ? 'bag'
         : c === 'clout'       ? 'favour'
         : String(c || '');
  }

  /* ==================================================================== */
  /*  THE THREE SHAPES AN ASK CAN CARRY  (9/13, [half now] part two)         */
  /* ==================================================================== */
  /* WORDS Q21 ROUND TWO IS THE SOURCE AND THE THREE ARE THEIRS, not mine. From
     their school on how people ask across distrust, off the research on how
     migrants pick a smuggler -- reputation, guarantees, escrow, the "substitutes
     for trust":

       "You propose a SHAPE instead of asking for trust, and each ask carries a
        different one. ASK 1 is half on delivery. ASK 2 is a third party who
        already holds things for strangers. ASK 3 is going first on something
        small, priced so that being robbed is survivable. NOBODY SAYS TRUST ME,
        and the section bans it, because it is what somebody says who has no
        shape to offer."

     *** WHAT A SHAPE CHANGES IS WHO IS EXPOSED, NEVER HOW MUCH IT PAYS. ***
     EVERYTHING COSTS ONE, and this module's whole existing discipline is that an
     ask changes the SHAPE of the one and never its size. A shape is the same one
     battery arranged so that a different person is carrying the risk of the
     other one walking away. That is the thing the row asks for -- "the shape
     changes what the player risks" -- and it needs no number to say it.

     ONE SHAPE PER DEAL. You propose A shape; you do not stack all three. The old
     code carried `upfront` as a bare boolean, which could only ever express one
     of the three and could not say who was exposed.

     AND NO NAME IS INVENTED FOR THE THIRD PARTY. "Somebody who holds things for
     strangers" is the shape; WHO that is in this valley is a ruling nobody has
     made, so the words say the role and never a person or a place. */
  var SHAPES = {
    upfront: { id: 'upfront', exposed: 'them',
               say:    'Half of it now, before I go',                 /* draft:true */
               agreed: 'Half now. And you are holding it if you walk' /* draft:true */ },
    held:    { id: 'held', exposed: 'nobody',
               say:    'Leave it with somebody who holds things for strangers',
               agreed: 'It sits with them until the job is done' },
    first:   { id: 'first', exposed: 'you',
               say:    'I will go first, on something small',
               agreed: 'You go first. If they walk, it was cheap to find out' }
  };
  var SHAPE_ORDER = ['upfront', 'held', 'first'];

  /* shapeOf(t) -- the shape this deal took, or null while it has none. */
  function shapeOf(t) {
    return (t && t.shape && SHAPES[t.shape]) ? SHAPES[t.shape] : null;
  }

  /* riskOf(t) -- who is carrying the risk, in words. A deal with no shape has
     nobody carrying it, which is the honest answer and not "safe". */
  function riskOf(t) {
    var sh = shapeOf(t);
    if (!sh) return { exposed: 'nobody', shape: null, say: null };
    return { exposed: sh.exposed, shape: sh.id, say: sh.agreed };
  }

  /* breakMark(t) -- WHAT THE STREET SEES IF THE DEAL BREAKS, and only when the
     player is the one holding something that is not theirs. A deed row in the
     shape bohemia_deeds.publish already takes, so nothing new is built and no
     standing number is invented.
     A shape where THEY are exposed is the only one that can leave this mark:
     you cannot be accused of keeping what you were never handed. */
  function breakMark(t) {
    var sh = shapeOf(t);
    if (!sh || sh.exposed !== 'them') return null;
    return { kind: 'kept_what_was_fronted', clout: 'reckless', delta: 0, faction: null };
  }

  /* ---- 2. OPENING THE TERMS --------------------------------------------- */

  /* open(quest) -- the negotiation as it stands before anybody says anything.
     asked:0, nothing changed, and the offer still on the table. */
  function open(quest, cost) {
    var p = pays(quest);
    return { pays: p, currency: p.currency, upfront: false, shape: null,
             asked: 0, open: true, withdrawn: false, said: null, mark: null,
             /* HIS COST, CARRIED FROM THE START so the warning and the mark are
                the same stake rather than two numbers found at two moments. It
                is a NUMBER the caller derived with pushCost() off his corpus,
                never the corpus itself: this module must not learn how to read
                a quest file, and a surface that passes nothing gets the old
                weightless mark rather than a punishment nobody ruled. */
             pushCost: (typeof cost === 'number') ? cost : null };
  }

  /* asks(t) -- what is still on the table to ask for, each with its own words.
     Derived from the offer, so there is no list of asks to tune anywhere. */
  function asks(t) {
    var out = [];
    if (!t || !t.open) return out;
    if (t.pays && t.pays.kind === 'nothing') return out;   /* nothing to divide */
    if (t.currency) {
      for (var i = 0; i < CURRENCIES.length; i++) {
        var c = CURRENCIES[i];
        if (c === t.currency) continue;
        out.push({ id: 'swap:' + c, kind: 'swap', currency: c,
                   say: 'Make it a ' + word(c) + ' instead' });       /* draft:true */
      }
    }
    /* ONE SHAPE PER DEAL: once a shape is agreed, none of the three is offered
       again. Before that, all three are on the table in his order. */
    if (!t.shape) {
      for (var k = 0; k < SHAPE_ORDER.length; k++) {
        var sh = SHAPES[SHAPE_ORDER[k]];
        out.push({ id: sh.id, kind: 'shape', shape: sh.id, say: sh.say }); /* draft:true */
      }
    }
    return out;
  }

  /* warning(t) -- what he is told BEFORE the ask that would cost him, which is the
     whole reason this is deliberate and not a hidden roll. null while there is
     room. draft:true. */
  function warning(t) {
    if (!t || !t.open) return null;
    if (t.asked < room()) return null;
    return 'Ask again and they take the job back';                    /* draft:true */
  }

  /* ---- 3. THE ASK -------------------------------------------------------- */

  /* ask(t, id) -- returns a NEW terms object. Never mutates, so a caller can show
     the player what an ask would do before they commit to it. */
  function ask(t, id) {
    if (!t || !t.open) return t;
    var n = { pays: t.pays, currency: t.currency, upfront: t.upfront, shape: t.shape,
              asked: t.asked + 1, open: true, withdrawn: false, said: null, mark: null,
              pushCost: t.pushCost };

    /* *** THE THIRD ASK IS THE ONE THAT ENDS IT. *** Not a roll, not a threshold
       anybody can tune: you were told, in words, before you opened your mouth. */
    if (t.asked >= room()) {
      n.open = false; n.withdrawn = true;
      n.currency = null; n.upfront = false; n.shape = null;
      n.said = 'They take it back. Somebody else will do it';         /* draft:true */
      n.mark = markFor(t.pushCost);
      return n;
    }

    var picked = null, list = asks(t);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) picked = list[i];
    if (!picked) { n.asked = t.asked; n.said = null; return n; }      /* asked for nothing */

    if (picked.kind === 'swap') {
      n.currency = picked.currency;
      n.said = 'Fine. A ' + word(picked.currency) + ', then';         /* draft:true */
    } else {
      /* A SHAPE. `upfront` stays true only for the shape that really is half up
         front, because settle() and the surface both still read it and a flag
         that quietly meant "any shape" would be a lie to every existing reader. */
      var sh = SHAPES[picked.shape];
      n.shape = sh.id;
      n.upfront = (sh.id === 'upfront');
      n.said = sh.agreed;                                             /* draft:true */
    }
    return n;
  }

  /* ---- 4. THE MARK ------------------------------------------------------- */

  /* THE ROW ASKS FOR A STANDING MARK AND THIS IS NOT A NUMBER. It is one deed row
     in the shape bohemia_deeds.publish already takes, so the existing ledger, the
     existing witness range and the existing feed all carry it with nothing new
     built. #reckless is the deed system's own loudest tag and pushing a stranger
     until they walk is exactly that. */
  /* ======================================================================
     WHAT PUSHING TOO FAR COSTS  (9/22, row [haggle like bb])

     PAOLO 9/22, voting ARGUING THE PRICE up: "do it the same way Battle Brothers
     does it: push too much hurts reputation and shit. Nothing less than Battle
     Brothers."

     MEASURED BEFORE BUILDING: it hurt nothing. The mark carried delta 0 and no
     faction, `pushed_the_price` had no weight in the standing table, and
     forceOf's own rule is "unruled deed = weightless", so the deed travelled as
     gossip (reach 24, five hops) and moved no opinion by a single point. The
     module's own comment said the cost was that there is no job -- true, and it
     is not what he asked for. In Battle Brothers pushing a contract's terms too
     far makes the employer refuse AND costs you standing that follows you.

     *** THE NUMBER IS HIS, DERIVED, NEVER TYPED HERE. *** The repo's BB study
     binds every renown mechanic to resources, electricity and clout rather than
     coin, and MECHANISM-MINE / CONTENTS-PAOLO'S says a table ships empty except
     what has a ruling. He has now ruled this one, so the cost is taken from HIS
     OWN AUTHORED DEEDS: the median of the negative #reckless deltas across the
     83 he has written (measured: notable -8, risky -6, quiet -10, RECKLESS -12).
     Pushing a price past a warning is a reckless act, so it costs what his own
     reckless acts cost. If he rewrites a quest, this follows him.

     NO SCALING, ON PURPOSE. room() is 2 and the third ask ends it, so there is
     exactly one "too far" state; a curve over it would be a magnitude nobody
     ruled. */
  function pushCost(deeds) {
    if (!deeds || !deeds.length) return null;     /* no corpus = no ruled cost */
    var neg = [];
    for (var i = 0; i < deeds.length; i++) {
      var d = deeds[i];
      if (!d || d.clout !== 'reckless') continue;
      if (!(d.delta < 0)) continue;
      neg.push(d.delta);
    }
    if (!neg.length) return null;
    neg.sort(function (a, b) { return a - b; });
    return neg[Math.floor(neg.length / 2)];
  }

  /* markFor(cost) -- the row the street sees. `cost` is what pushCost answered
     off his corpus; without it the deed stays weightless exactly as before, so a
     surface that never passes it cannot silently invent a punishment. */
  function markFor(cost) {
    return { kind: 'pushed_the_price', clout: 'reckless',
             delta: (typeof cost === 'number') ? cost : 0, faction: null };
  }

  /* ---- 5. WHAT THE PURSE IS OWED, AT THE END --------------------------- */

  /* settle(t) -- what the job actually pays once the terms are settled, in the
     shape payForQuest already reads. ONE, always, of whichever currency the
     conversation landed on.
     A WITHDRAWN OFFER PAYS NOTHING, and that is the whole cost: there is no job. */
  function settle(t) {
    if (!t || t.withdrawn) return null;
    if (!t.currency) return null;               /* 'depends' or 'nothing': unchanged */
    var out = {}; out[t.currency] = ONE;
    return out;
  }

  /* changed(t) -- did the conversation actually move anything. Lets a caller keep
     the quest's own reward untouched when nobody haggled, which is the reuse-first
     answer: no ask, no override. */
  function changed(t, quest) {
    if (!t) return false;
    if (t.withdrawn) return true;
    if (t.upfront) return true;
    var p = pays(quest);
    return !!(t.currency && p.currency && t.currency !== p.currency);
  }

  /* say(t) -- the line the card wears once terms have moved. draft:true. */
  function say(t) {
    if (!t) return null;
    if (t.withdrawn) return t.said;
    if (!t.currency) return null;
    var s = 'One ' + word(t.currency);
    if (t.upfront) s += ', half of it up front';
    return s;                                                          /* draft:true */
  }

  var API = {
    CURRENCIES: CURRENCIES, ONE: ONE, room: room,
    pays: pays, sayPay: sayPay, word: word,
    open: open, asks: asks, warning: warning, ask: ask,
    markFor: markFor, settle: settle, changed: changed, say: say,
    SHAPES: SHAPES, SHAPE_ORDER: SHAPE_ORDER,
    shapeOf: shapeOf, riskOf: riskOf, breakMark: breakMark, pushCost: pushCost
  };
  if (HASREQ) module.exports = API; else root.BohemiaHaggle = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
