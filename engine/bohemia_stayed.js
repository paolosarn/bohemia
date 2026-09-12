// BOHEMIA STAYED — WHO STAYED COUNTS (9/12/26, WORLD lane)
// Board row [century stayed] / WHO-STAYED-COUNTS.
//
// ============================================================================
// HIS RULING, 9/7
// ============================================================================
//   "buildings, and some people depending on how many years passed."
//
// The century rule counted BUILDINGS and nothing else. It counts SOME PEOPLE now:
// a person you kept in the valley counts for as long as they could still be alive
// given the years between the acts, and after that what counts is WHAT THEY LEFT.
//
// ============================================================================
// EVERY YEAR IN THIS FILE IS CANON SOMEBODY ELSE ALREADY WROTE DOWN
// ============================================================================
//   ~100 years across the three acts
//       laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md clause 4:
//       "dynasty building choices COMPOUND across the three acts (~100 years)"
//   ~30 years a handoff
//       engine/bohemia_family.js, in its own words: "A handoff is ~30 years and
//       that is canon, so age() at a fold is derived."
//   what age a word is worth
//       engine/bohemia_family.js BAND -- newborn 0, child 6.5, teen 15,
//       adult 41, elder 65. Its own comment: "the MIDPOINT is the estimator you
//       use when all you have is the word, which is all FAMILY_CAST gives."
//
// THE ONE NUMBER THIS FILE DERIVES, AND IT IS DERIVED, NOT PICKED: when is a
// person past living? ELDER + ONE HANDOFF. The age this game itself calls elder,
// plus one whole generation more. Both halves are canon above; the addition is
// the only arithmetic here, and it lands at 95, which is a real outer bound for
// a human life. On a dial, tuned:false, so he can move it by playing.
//
// ============================================================================
// WHAT "A PERSON YOU KEPT" IS, AND IT IS NOT A NEW KIND OF DATA
// ============================================================================
// The people you kept in the valley are THE PEOPLE SLEEPING UNDER ROOFS YOU PUT
// UP. engine/bohemia_century.js has stamped the household on every build entry
// since it was written -- "THE HOUSEHOLD IS RECORDED AT THE TIME IT HAPPENED, not
// looked up later" -- so the record already knows, per act, how many people the
// family housed. Nothing new is stored and no second census is taken.
//
// AND THEIR AGE IS THE BAND MIDPOINT, WHICH IS THE REPO'S OWN ANSWER TO NOT
// KNOWING. bohemia_family.js's agePeople does exactly this for anybody who only
// ever had a word instead of a number, and says why. A resident nobody has met is
// an ADULT, so this uses BAND.adult and says so rather than inventing a census of
// birthdays for people the player has never spoken to.
//
// ============================================================================
// WHAT THIS DELIBERATELY DOES NOT DO
// ============================================================================
// It does not move the act. The fold from one generation to the next is another
// line's job (QUESTS [generation handoff]) and bohemia_century.js says the same
// thing about its own setAct. This READS the act the record is on.
// It does not kill anybody. Nothing in this repo ages a person to death, and
// adding that to bohemia_family.js would be editing another lane's system.
// "Could they still be alive" is answered here, about a housed count, and the
// family tree is untouched.
//
// node: require('./bohemia_stayed.js')   Gate: gates/century_stayed_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ASK FOR A NEIGHBOUR WHEN YOU NEED IT, NEVER WHEN YOU LOAD. */
  function FAM() {
    if (HASREQ) { try { return require('./bohemia_family.js'); } catch (e) { return null; } }
    return root.BohemiaFamily || (typeof BohemiaFamily !== 'undefined' ? BohemiaFamily : null);
  }
  function CENT() {
    if (HASREQ) { try { return require('./bohemia_century.js'); } catch (e) { return null; } }
    return root.BohemiaCentury || (typeof BohemiaCentury !== 'undefined' ? BohemiaCentury : null);
  }

  /* THE CANON, CARRIED WITH ITS SOURCE SO A READER CAN CHECK IT AND SO THE GATE
     CAN CHECK THE SOURCE STILL SAYS IT. A number whose provenance is a comment
     nobody verifies is a number somebody typed. */
  var SPAN = { years: 100, tuned: false,
               source: 'laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md',
               says: 'COMPOUND across the three acts (~100 years)' };
  var HANDOFF = { years: 30, tuned: false,
                  source: 'engine/bohemia_family.js',
                  says: 'A handoff is ~30 years and that is canon' };

  /* WHAT AGE AN UNMET RESIDENT IS. The family module's own midpoint for the word
     it would have. Read, never typed: if he moves the bands, this moves. */
  function adultYears() {
    var F = FAM();
    /* BAND is not exported -- agePeople owns it -- so this asks the module the
       question instead of reaching into it: age a one-person tree by nothing and
       read back what the word is worth. A module's public answer beats a private
       table every time, and it cannot drift from what the fold actually does. */
    if (F && typeof F.agePeople === 'function') {
      var probe = [{ id: 'probe', age: 'adult', alive: true }];
      try {
        F.agePeople(probe, 1);                 /* one year, so years get filled in */
        if (typeof probe[0].years === 'number') return probe[0].years - 1;
      } catch (_e) {}
    }
    return null;                               /* no family module: say so, do not guess */
  }
  function elderYears() {
    var F = FAM();
    if (!F || typeof F.agePeople !== 'function') return null;
    /* the same question for the last band: walk a probe up until the word turns
       'elder' and read the year it turned. Derived from the module, not copied. */
    var probe = [{ id: 'probe', age: 'newborn', years: 0, alive: true }];
    for (var y = 1; y <= 120; y++) {
      try { F.agePeople(probe, 1); } catch (_e) { return null; }
      if (probe[0].age === 'elder') return probe[0].years;
    }
    return null;
  }

  /* *** WHEN IS SOMEBODY PAST LIVING: ELDER PLUS ONE WHOLE HANDOFF. ***
     The age this game itself calls elder, plus one more generation. Both halves
     are canon; the plus is the only arithmetic in this file. */
  function pastLiving() {
    var e = elderYears();
    return (e == null) ? null : e + HANDOFF.years;
  }

  /* ------------------------------------------------------------------------
     WHO STAYED, AND WHAT IS LEFT OF THEM.
     For every act up to the one asked about: the people that act housed, how old
     they would be now, and therefore whether they still count as PEOPLE or as
     WHAT THEY LEFT.
     ------------------------------------------------------------------------ */
  function stayed(rec, atAct) {
    var C = CENT();
    if (!C || typeof C.totals !== 'function') return null;
    var cap = pastLiving(), adult = adultYears();
    if (cap == null || adult == null)
      return { people: 0, left: 0, byAct: [], reason: 'NO_FAMILY' };
    var upto = (atAct == null) ? (rec && rec.act) || 1 : (atAct | 0);
    var out = { people: 0, left: 0, byAct: [], pastLiving: cap, adult: adult,
                handoff: HANDOFF.years };
    for (var a = 1; a <= upto; a++) {
      var t = null;
      try { t = C.totals(rec, a); } catch (_e) { t = null; }
      var housed = t ? Math.max(0, Math.floor(t.housing || 0)) : 0;
      if (!housed) continue;
      var years = (upto - a) * HANDOFF.years;
      var age = adult + years;
      var living = age < cap;
      out.byAct.push({ act: a, housed: housed, years: years, age: age, living: living });
      if (living) out.people += housed; else out.left += housed;
    }
    return out;
  }

  /* THE SENTENCE THE CARD GETS. draft:true -- words get an attempt, decisions
     wait (ALWAYS MAKE AN ATTEMPT, 8/11). */
  function say(s) {
    if (!s) return '';
    var bits = [];
    if (s.people) bits.push(s.people === 1 ? 'one person you kept is still here'
                                           : (s.people + ' people you kept are still here'));
    if (s.left) bits.push(s.left === 1 ? 'one more left what they built behind them'
                                       : (s.left + ' more left what they built behind them'));
    return bits.join(', ');
  }

  var API = { SPAN: SPAN, HANDOFF: HANDOFF,
              adultYears: adultYears, elderYears: elderYears, pastLiving: pastLiving,
              stayed: stayed, say: say };
  if (HASREQ) module.exports = API;
  root.BohemiaStayed = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
