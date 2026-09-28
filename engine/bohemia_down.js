// BOHEMIA DOWN — YOUR PEOPLE DO NOT DIE FOR GOOD.
// (9/12/26, PEOPLE lane. VAMILY [down not dead], row
// YOUR-PEOPLE-DO-NOT-DIE-FOR-GOOD.)
//
// PAOLO 9/11, LOCKED (laws/BOHEMIA_ADDENDUM_YOUR_PEOPLE_DO_NOT_DIE_FOR_GOOD_9_11_26.md):
//   "I don't want anyone to permanently die, or even have permanent debuffs.
//    There could be debuffs that are a lot longer than others."
// And the law's own examples, which are where every number in this file comes
// from: "a leg that takes a season, a hand that takes a year of the valley's
// time, but every one heals. Nothing on a person you keep is forever."
//
// *** MEASURED BEFORE A LINE WAS WRITTEN, IN THE TWO FILES THAT ARE THE GAME,
// COMMENTS STRIPPED. *** There is no company roster, no companion state, no
// downed state, no injury model, and nothing anywhere that can kill a person you
// keep. So the law is true today BY ACCIDENT -- not because anybody built the
// promise, but because there is nobody to lose. That is the worst way for a law
// to be satisfied, because the first system that can hurt a companion breaks it
// silently and no check says a word.
//
// SO THIS IS THE PROMISE, BUILT, AND IT IS THE HALF A PERSON CARRIES. COMBAT
// owns the body on the board (their row, [downed body]: out of the fight, can be
// reached and carried, never a corpse). This owns what is true about the PERSON
// afterwards: they are down, they are hurt for a long time, and they come back.
//
// ============================================================================
// THE ONE THING THIS MODULE CANNOT DO, AND IT IS THE POINT
// ============================================================================
// There is no way to make a kept person dead. Not a flag, not an option, not a
// length of Infinity. fall() has exactly one outcome and heal() always finishes.
// A law enforced by a module that COULD break it is a law waiting to be broken
// by the next caller in a hurry, so the only honest shape is one where the bad
// state is unreachable. The gate proves it by trying.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* HOW LONG AN INJURY LASTS, AND EVERY ONE OF THESE IS HIS OWN EXAMPLE OR A
     REAL CALENDAR LENGTH. He named two: "a leg that takes a SEASON, a hand that
     takes a YEAR of the valley's time". A season is about ninety days and a year
     is three hundred and sixty-five; those are facts, not dials. The short one
     is a WEEK, because his sentence is "debuffs that are a lot longer than
     others" -- a ladder needs a bottom rung for "a lot longer" to mean anything,
     and a week is the shortest length a person would call an injury rather than
     a bad day.
     THESE ARE DAYS ON THE GAME'S OWN CLOCK, the same T.day the whole city
     already spends, so nobody has to invent a second calendar. */
  var HURT = {
    knocked: { days: 7,   say: 'KNOCKED ABOUT' },      /* draft:true */
    leg:     { days: 90,  say: 'A LEG THAT NEEDS A SEASON' },
    hand:    { days: 365, say: 'A HAND THAT NEEDS A YEAR' }
  };
  var KINDS = ['knocked', 'leg', 'hand'];

  function norm(x) { return String(x == null ? '' : x); }

  /* WHICH INJURY. Derived from the seed the same way the heir is, so a reload
     cannot change how badly somebody was hurt -- the same rule GDD v4 58 sets
     for heir selection, applied here for the same reason. */
  function xmur3(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }
  function hurtFor(id, day) {
    var h = xmur3(norm(id) + '::hurt::' + (day | 0))();
    return KINDS[h % KINDS.length];
  }

  /* ==========================================================================
     SOMEBODY WENT DOWN. The ONLY outcome. There is no second branch, no opts
     that kill, and no caller-supplied length -- a caller in a hurry cannot pass
     `permanent: true` because the parameter does not exist.
       book   the record of who is hurt, {id: {kind, from, until}}
       id     who fell
       day    the game day they fell, off the clock the city already spends
     RETURNS what is true about them now, so a surface can say it.
     ========================================================================== */
  function fall(book, id, day) {
    if (!book || id == null) return null;
    var d = (day | 0);
    if (book[id] && book[id].until > d) return book[id];   /* already down */
    var kind = hurtFor(id, d);
    book[id] = { kind: kind, from: d, until: d + HURT[kind].days };
    return book[id];
  }

  /* ARE THEY DOWN RIGHT NOW. A question, never a state anybody has to remember
     to clear: the answer is the clock against the record, so a save that sat on
     a shelf for a year comes back with everybody healed and nothing to tidy. */
  function isDown(book, id, day) {
    var r = book && book[id];
    return !!(r && (day | 0) < r.until);
  }

  /* HOW LONG LEFT, in days. Never negative, and never Infinity: the arithmetic
     itself is what makes "every one heals" true rather than a comment saying so. */
  function daysLeft(book, id, day) {
    var r = book && book[id];
    if (!r) return 0;
    return Math.max(0, r.until - (day | 0));
  }

  /* *** THREE EXPORTS STOOD HERE AND NOTHING IN THE GAME CALLED THEM. ***
     healed(), downNow() and hurtOf() all read well and all were dead: healed is
     exactly !isDown, downNow re-walked a list the city already filters by family
     itself, and hurtOf answered a question no surface asked. The organ reach
     sweep caught all three the first time it looked, which is the second time
     this lane has shipped a dead export into a brand new module.
     THEY COME BACK IS NOT A FUNCTION, IT IS THE ARITHMETIC: `until` is always
     `from` plus a finite length, so isDown goes false on its own and there is
     nothing for a caller to ask. A helper that restates a fact the numbers
     already carry is decoration with a published seam. */

  /* PLAYER-FACING WORDS, draft:true (8/11: words get an attempt, decisions
     wait). They say the injury and how long, because "a long time" is the whole
     feeling of this law and a bar would not carry it. */
  function say(book, id, day) {
    var r = book && book[id];
    if (!r) return null;
    var left = daysLeft(book, id, day);
    if (!left) return 'BACK ON THEIR FEET';
    var w = HURT[r.kind] ? HURT[r.kind].say : 'HURT';
    if (left === 1) return w + ', ONE MORE DAY';
    return w + ', ' + left + ' DAYS';
  }

  /* ==========================================================================
     *** THE PERSON, NOT THE READOUT. (9/27, [origins] / [the injured], rule
     36b.) ***

     PAOLO 9/27: "you're gonna die a lot and I love that feeling... maybe only a
     20% chance your character can die, else a debilitating injury, 30 to 40
     days." The law that became (s2) says the survivor "leaves a permanent mark
     (a scar, a limp, a lost eye, a stat that never comes back)", and it splits
     the work in one sentence: "TUNING owns the numbers; PEOPLE owns the person
     (the injured stay in the company, cost their day, talk about it)."

     *** AND THAT RULING COLLIDES HEAD-ON WITH THE ONE THIS MODULE WAS BUILT TO
     KEEP, WHICH IS ALSO HIS AND ALSO LOCKED. *** Paolo 9/11: "I don't want
     anyone to permanently die, or even have permanent debuffs." This file is
     shaped so the bad state is UNREACHABLE and a gate proves it by trying.

     WHAT IS BUILT HERE IS THE PART WHERE BOTH OF HIS RULINGS ARE TRUE AT ONCE,
     AND IT IS NOT A COMPROMISE, IT IS THE DISTINCTION HE ALREADY DREW:
         A SCAR IS NOT A DEBUFF. A LIMP YOU CARRY IS NOT A STAT YOU LOST.
     A mark you can SEE and HEAR takes nothing away from you and stays for ever,
     which is exactly the half of 9/27 that 9/11 does not forbid. So the mark is
     built and it is permanent.
     WHAT IS NOT BUILT IS "a stat that never comes back", because that is a
     permanent debuff in the plainest words, it is the half 9/11 forbids, AND IT
     IS A NUMBER, which the same law hands to TUNING. It is flagged rather than
     quietly chosen: see the record, [PENDING Paolo].

     NOTHING HERE CAN KILL ANYBODY EITHER, for the same reason as the rest of
     this file. The 20% death branch is a NUMBER and belongs to TUNING, and this
     module still has no way to express it. */
  /* TWO SENTENCES EACH, AND THEY ARE DIFFERENT SENTENCES ON PURPOSE.
     `down` is said while they are still out, and none of the three is about the
     injury: what hurts a person who is out for a month is BEING NO USE, which is
     the whole feeling his ruling is reaching for. `says` is what they say ever
     after, carrying the mark, and it is lighter -- a man does not keep telling
     you how bad it was, he tells you the shape his life took instead. */
  var MARK = {
    knocked: { mark: 'A SCAR ACROSS THE EYEBROW',                /* draft:true */
               down: 'I am no good to you like this. Do not wait on me.',
               says: 'It opened up. It closed up. Stop looking at it.' },
    leg:     { mark: 'A LIMP THAT NEVER QUITE WENT',
               down: 'Go. I will be here. I am not going anywhere, am I.',
               says: 'I can still walk it. I just take the long way now.' },
    hand:    { mark: 'TWO FINGERS THAT DO NOT CLOSE',
               down: 'I cannot hold anything. Do not hand me anything.',
               says: 'They set it wrong and there was nobody to argue with.' }
  };

  /* markOf(book, id) -- what somebody carries FOR EVER, after they are healed.
     Asked of the record, so a person who was never hurt carries nothing and a
     person who healed years ago still carries it. THE MARK OUTLIVES THE INJURY
     AND THAT IS THE ENTIRE POINT: isDown goes false on its own, and this does
     not. */
  function markOf(book, id) {
    var r = book && book[id];
    if (!r || !MARK[r.kind]) return null;
    return { kind: r.kind, mark: MARK[r.kind].mark, from: r.from, draft: true };
  }

  /* mouth(book, id, day) -- WHAT THEY SAY ABOUT IT, in their own voice.
     say() above is a readout for a card and it stays; this is a person talking,
     which is what rule 19 asks for ("text comes from a mouth with a portrait")
     and what rule 36b asks for ("talk about it"). They say a different thing
     while they are still down than they do years later, because those are
     different sentences and a person who has healed does not report a countdown.
     NO NUMBER IN EITHER ONE. A person does not say "forty-three days" out loud,
     and the countdown already exists on the card for anybody who wants it. */
  function mouth(book, id, day) {
    var r = book && book[id];
    if (!r || !MARK[r.kind]) return null;
    if (isDown(book, id, day)) {
      /* STILL DOWN. They are out of the fight and they know it, and the thing
         that hurts is not the injury, it is being no use. */
      return { text: MARK[r.kind].down, down: true, draft: true };
    }
    return { text: MARK[r.kind].says, down: false,
             mark: MARK[r.kind].mark, draft: true };
  }

  /* *** AND THEY ARE STILL YOURS, WHICH IS A CLAIM ABOUT A LEDGER THIS MODULE
     DOES NOT OWN AND SO IS NOT WRITTEN HERE. *** bohemia_company.js computes
     membership from bonds and witnesses and keeps no list, so an injury cannot
     remove anybody: there is nothing to remove them FROM. That is the promise
     being kept by the shape of two modules rather than by a line either of them
     runs, and the gate holds it by injuring one of yours and asking again. */

  var API = { HURT: HURT, KINDS: KINDS, MARK: MARK,
              fall: fall, isDown: isDown, daysLeft: daysLeft, say: say,
              markOf: markOf, mouth: mouth };
  if (HASREQ) module.exports = API; else root.BohemiaDown = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
