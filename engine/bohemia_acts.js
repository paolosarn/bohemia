// BOHEMIA ACTS -- THE THREE, AND THE FLIP BETWEEN THEM (9/24/26, DYNASTY lane)
// Board row [the flip] / ONE-TAP-ON-THE-PHONE. Rule 31 (Paolo 9/23): "play all
// three at the same time and flip through them."
//
// ============================================================================
// WHAT THIS FILE IS AND, MORE IMPORTANTLY, WHAT IT IS NOT
// ============================================================================
// It is WHO THE THREE ARE and WHICH ONE IS CURRENT. That is the whole job.
//
// IT DOES NOT DERIVE A WORLD. School round two
// (records/BOHEMIA_DYNASTY_SCHOOL_THE_DERIVE_ROUND_TWO_9_24_26.md) named the
// derive's field list, its hands-versus-world split and its gate; building it is
// WORLD's and LIFE+CITY's rows, not this one. A flip that re-derived the valley
// from inside this file would be a second answer to a question another lane owns.
//
// AND THAT IS WHY THE FLIP IS HONEST WITH NOTHING BUILT YET. Rule 32(b), his own
// words on 9/23: the game STARTS in the ruin and the future GETS BETTER; the base
// of act 2 and act 3 is ACT 1'S RUIN, and the derive ADDS what was reclaimed. So
// a player who has done nothing SHOULD see the same ruin in all three, and that
// is not a missing feature, it is the tutorial: "the city is built like shit
// because you're not making enough of an impact in your earlier act" (Paolo,
// 9/23, which is the sentence rule 31 exists for). The date changes, the person
// changes, the ground has not earned a change yet.
//
// ============================================================================
// THE NAMES COME PREPARED (rule 32(d), Paolo 9/23, "like Battle Brothers")
// ============================================================================
// "a generated name per slot, reshuffle, or type your own; no flip to an unnamed
// descendant." So: every slot is filled from the first frame, a reshuffle gives a
// new one, and typing your own is [three names]' row, not this one. The names
// come from THE CITY'S OWN BANK through BohemiaPeople.generatedName -- reuse
// first, and it means the family reads like the valley reads, because it is the
// same pool Paolo corrected toward the county on 9/22.
//
// ============================================================================
// EVERY NUMBER IN HERE IS EITHER HIS OR MARKED
// ============================================================================
// The ERA NAMES are canon (Paolo 9/7: Animal / Human / Angel are ERAS, never
// creatures -- the anarchy decade, the world clawing back, the cyberpunk
// healing). THE GAP BETWEEN ACTS IS NOT RULED. The laws carry a HUNDRED YEARS
// (the monument sums the virtues "at the end of the hundred years"), so three
// lives across a century spaced evenly is 0, 35, 70 -- an ATTEMPT, tagged
// draft:true, his to knock down in one word. Nothing else in this file is a
// number anybody chose.
(function (root) {
  'use strict';

  var DRAFT = true;

  /* THE THREE. Era names are his; the years-later are the attempt. */
  var ACTS = [
    { act: 1, era: 'ANIMAL', later: 0,  draft: false,
      of: 'the anarchy decade' },
    { act: 2, era: 'HUMAN',  later: 35, draft: DRAFT,
      of: 'the world clawing back' },
    { act: 3, era: 'ANGEL',  later: 70, draft: DRAFT,
      of: 'the cyberpunk healing' }
  ];

  function people() {
    try { if (root && root.BohemiaPeople) return root.BohemiaPeople; } catch (e) {}
    if (typeof module !== 'undefined' && typeof require !== 'undefined') {
      try { return require('./bohemia_people.js'); } catch (e) {}
    }
    return null;
  }

  /* A NAME FOR A SLOT. Keyed by the world's seed and the act, so the same valley
     always hands him the same family and a reshuffle is a different SALT rather
     than a different pool. No pool means NO NAME, said rather than invented: the
     city's bank is the only pool and this file does not carry a second one. */
  function nameFor(seed, act, salt) {
    var P = people();
    if (!P || typeof P.generatedName !== 'function') return null;
    var key = 'act:' + String(seed) + ':' + String(act) + ':' + String(salt || 0);
    try { return P.generatedName(key); } catch (e) { return null; }
  }

  /* WHAT THE NAME READS AS. The city already answers this for every citizen and
     the answer steers a body, so the descendants use the same door instead of a
     second opinion about what a name means. 'either' is a legal answer and is
     never converted into a guess. */
  function readsAs(name) {
    var P = people();
    if (!P || typeof P.readsAs !== 'function') return 'either';
    try { return P.readsAs(name) || 'either'; } catch (e) { return 'either'; }
  }

  /* THE THREE, PREPARED. Every slot filled, from the first frame, so rule 32(d)'s
     "no flip to an unnamed descendant" is true by construction rather than by a
     check somebody has to remember to run. */
  function prepare(seed, salt) {
    return ACTS.map(function (a) {
      var nm = nameFor(seed, a.act, salt);
      return {
        act: a.act, era: a.era, of: a.of,
        later: a.later, laterDraft: a.draft,
        name: nm,                       /* null when no bank is loaded: SAID, not faked */
        reads: nm ? readsAs(nm) : 'either',
        named: !!nm,
        draft: DRAFT
      };
    });
  }

  /* THE STATE. Which act he is standing in, and nothing else lives here. */
  var CURRENT = 1;
  function current() { return CURRENT; }
  function isAct(n) { n = n | 0; return n === 1 || n === 2 || n === 3; }

  /* THE FLIP. Returns what changed, so a caller can redraw exactly what moved
     and a gate can assert it -- and returns `moved:false` for a tap on the act he
     is already in, because a flip to where you already are is not an event and
     must not cost a redraw or a sound. */
  function flip(n) {
    if (!isAct(n)) return { moved: false, why: 'NOT_AN_ACT' };
    if (n === CURRENT) return { moved: false, why: 'ALREADY_THERE', act: CURRENT };
    var from = CURRENT;
    CURRENT = n | 0;
    return { moved: true, from: from, to: CURRENT };
  }
  function setCurrent(n) { if (isAct(n)) CURRENT = n | 0; return CURRENT; }

  /* HOW FAR APART TWO ACTS ARE, in years. Reads the table; never re-typed at a
     call site, so his one ruling on the gap moves every surface at once. */
  function yearsBetween(a, b) {
    var A = ACTS[(a | 0) - 1], B = ACTS[(b | 0) - 1];
    if (!A || !B) return null;
    return Math.abs(B.later - A.later);
  }

  /* WHAT THE GROUND OWES HIM, AND THE HONEST ANSWER TODAY. A caller asks this
     instead of assuming: with no derive built and no ledger behind it, act 2 and
     act 3 ARE act 1's ruin (rule 32b), and that is a truthful state rather than a
     stub. When WORLD's derive lands, this is the one place that stops saying it. */
  function groundDiffers() { return { differs: false, why: 'NO_DERIVE_YET', draft: DRAFT }; }

  var API = {
    ACTS: ACTS, prepare: prepare, nameFor: nameFor, readsAs: readsAs,
    current: current, setCurrent: setCurrent, flip: flip, isAct: isAct,
    yearsBetween: yearsBetween, groundDiffers: groundDiffers, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaActs = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
