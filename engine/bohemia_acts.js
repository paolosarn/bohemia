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
// "a generated name per slot, reshuffle, or type your own; sex the same way; no
// flip to an unnamed descendant." Board row [three names], THE-COMPANY-ACROSS-TIME's
// own sibling row, built here: every slot is filled from the first frame, a tap
// reshuffles ONE slot (never the other two -- Battle Brothers rerolls a single
// recruit, not the whole tavern), typing a name is a real API a screen can call,
// and sex is its own choice with the same three doors. The names come from THE
// CITY'S OWN BANK through BohemiaPeople.generatedName -- reuse first, and it
// means the family reads like the valley reads, because it is the same pool
// Paolo corrected toward the county on 9/22.
//
// SEX IS THE PICK; THE NAME FOLLOWS IT, NOT THE OTHER WAY AROUND. Battle Brothers
// generates a recruit with a sex first and a name that fits it second (measured
// against the library: the tavern never hands you a mismatched pair). So a
// prepared slot derives sex from its own hash, then tries a small run of name
// sub-salts for one whose readsAs() agrees, and only falls through to a plain
// pick (his own 'either' names, Juniper/Kai/Sunny, included) if none does inside
// a few tries -- never an infinite search over a hash that might not contain a
// match. A PLAYER-TYPED NAME NEVER GETS OVERRULED FOR A MISMATCH: he can name a
// son Guadalupe if he wants to, because MECHANISM-MINE/CONTENTS-PAOLO'S means
// this file suggests, it does not correct him.
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

  /* SEX FOR A SLOT, DETERMINISTIC, NEVER 'EITHER' AS A FINAL ANSWER. A body has
     to be built from it eventually, so unlike a name's reading -- which is
     allowed to shrug -- a prepared slot's sex is always 'male' or 'female'. One
     coin flip off the same hash family every other derive in this lane uses. */
  function sexFor(seed, act, salt) {
    var key = 'sex:' + String(seed) + ':' + String(act) + ':' + String(salt || 0);
    var h = 0;
    for (var i = 0; i < key.length; i++) h = ((h * 31) + key.charCodeAt(i)) >>> 0;
    return (h & 1) ? 'female' : 'male';
  }

  /* A NAME THAT AGREES WITH A SEX, TRIED A FEW WAYS BEFORE GIVING UP. Never loops
     over the whole bank -- five sub-salts is a search, not a guarantee, and a
     bank with no match for either reading is a real possibility (his own three
     'either' names exist for exactly this). Falls through to the plain pick,
     which is never null-vs-mismatched, only ever mismatched-vs-absent. */
  function nameAgreeing(seed, act, salt, sex) {
    var want = (sex === 'female') ? 'she' : 'he';
    var plain = nameFor(seed, act, salt);
    if (!plain) return null;
    if (readsAs(plain) === want) return plain;
    for (var i = 1; i <= 5; i++) {
      var nm = nameFor(seed, act, salt + ':' + i);
      if (nm && readsAs(nm) === want) return nm;
    }
    return plain;                 /* no match found: the plain pick, not a blank */
  }

  /* THE THREE, PREPARED. Every slot filled, from the first frame, so rule 32(d)'s
     "no flip to an unnamed descendant" is true by construction rather than by a
     check somebody has to remember to run. PURE: same seed and salt, same three,
     forever -- the stateful roster() below is what a screen actually calls. */
  function prepare(seed, salt) {
    return ACTS.map(function (a) {
      var sex = sexFor(seed, a.act, salt);
      var nm = nameAgreeing(seed, a.act, salt, sex);
      return {
        act: a.act, era: a.era, of: a.of,
        later: a.later, laterDraft: a.draft,
        name: nm,                       /* null when no bank is loaded: SAID, not faked */
        sex: sex,
        reads: nm ? readsAs(nm) : 'either',
        named: !!nm,
        custom: false,                  /* prepare() never carries an override */
        draft: DRAFT
      };
    });
  }

  /* ==========================================================================
     THE THREE, LIVE: RESHUFFLE ONE, TYPE ONE, PICK A SEX FOR ONE.
     State the module owns, same as CURRENT below it -- a screen needs one place
     to ask "what does slot 2 say right now", not a pure function it has to
     remember the salt for.
     ========================================================================== */
  var SLOT_SALT = { 1: 0, 2: 0, 3: 0 };     /* bumped by reshuffle(), per slot */
  var OVERRIDE = {};                        /* act -> {name?, sex?}, player-set */

  /* THE LIVE ROSTER: prepare()'s three, with each slot's own salt and any
     override laid on top. Called every time a screen needs the truth, never
     cached, because SLOT_SALT and OVERRIDE are small and this is not a hot loop. */
  function roster(seed) {
    return ACTS.map(function (a) {
      var ov = OVERRIDE[a.act] || {};
      var sex = ov.sex || sexFor(seed, a.act, SLOT_SALT[a.act]);
      var nm = ov.name || nameAgreeing(seed, a.act, SLOT_SALT[a.act], sex);
      return {
        act: a.act, era: a.era, of: a.of,
        later: a.later, laterDraft: a.draft,
        name: nm, sex: sex,
        reads: nm ? readsAs(nm) : 'either',
        named: !!nm,
        custom: !!(ov.name || ov.sex),
        draft: DRAFT
      };
    });
  }

  /* RESHUFFLE ONE SLOT. Battle Brothers rerolls the one recruit you point at,
     never the whole tavern -- this bumps only that slot's salt and CLEARS its
     override, because a reroll is "give me a new one", not "keep my typed name
     but change the face". The other two slots are untouched, in state and in
     the return value: a caller redraws one tile, not three. */
  function reshuffle(act) {
    if (!isAct(act)) return { changed: false, why: 'NOT_AN_ACT' };
    SLOT_SALT[act] = (SLOT_SALT[act] || 0) + 1;
    delete OVERRIDE[act];
    return { changed: true, act: act | 0 };
  }

  /* A TYPED NAME. Refuses rather than accepting garbage, and refusing LEAVES THE
     PRIOR NAME STANDING -- rule 32(d)'s "no flip to an unnamed descendant" holds
     even mid-edit; a bad keystroke never blanks a slot. Trimmed, bounded (the
     tile that shows it is a phone-width third of a phone, measured in [the flip]
     at 36 px), and never rejected for what it reads as -- a typed name is his. */
  function setName(act, name) {
    if (!isAct(act)) return { ok: false, why: 'NOT_AN_ACT' };
    var nm = String(name == null ? '' : name).trim();
    if (!nm) return { ok: false, why: 'EMPTY' };
    if (nm.length > 24) return { ok: false, why: 'TOO_LONG' };
    if (!OVERRIDE[act]) OVERRIDE[act] = {};
    OVERRIDE[act].name = nm;
    return { ok: true, act: act | 0, name: nm };
  }

  /* A CHOSEN SEX. "Sex the same way" (rule 32d) -- its own door, same shape as a
     typed name. Setting it does NOT touch a name the player already typed (his
     typed word is never second-guessed by a later choice), but it DOES retire a
     merely-prepared name if the sex changed under it, so the next read of
     roster() derives a fresh one that agrees -- never leaves last round's
     mismatch sitting there because nothing asked for a new name explicitly. */
  function setSex(act, sex) {
    if (!isAct(act)) return { ok: false, why: 'NOT_AN_ACT' };
    var s = String(sex || '').toLowerCase();
    if (s !== 'male' && s !== 'female') return { ok: false, why: 'NOT_A_SEX' };
    if (!OVERRIDE[act]) OVERRIDE[act] = {};
    OVERRIDE[act].sex = s;
    if (!OVERRIDE[act].name) delete OVERRIDE[act].name;  /* re-derive, not stale */
    return { ok: true, act: act | 0, sex: s };
  }

  /* RESET, for a screen that offers "start over" before he leaves it. Testing
     hook too -- a gate that mutates state needs a way back to zero. */
  function resetRoster() {
    SLOT_SALT = { 1: 0, 2: 0, 3: 0 };
    OVERRIDE = {};
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
    sexFor: sexFor, roster: roster, reshuffle: reshuffle,
    setName: setName, setSex: setSex, resetRoster: resetRoster,
    current: current, setCurrent: setCurrent, flip: flip, isAct: isAct,
    yearsBetween: yearsBetween, groundDiffers: groundDiffers, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaActs = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
