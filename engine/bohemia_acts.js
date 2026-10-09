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
// NO FLIP AT THE START; ONE PERSON, THEN THE NEXT IS BORN FROM HIM (rule 39c,
// Paolo 9/28, laws/BOHEMIA_LAW_THE_THREE_ACTS_AT_ONCE_9_23_26.md s11)
// ============================================================================
// "You start the game, you can't flip between the three people... customize just
// one person, and when you hop into the second generation you'll be given an
// option to customize the person and it will start off generated based on how
// you made the first." So THREE FACES FROM FRAME ONE IS DEAD, and so is naming all
// three before act 1. What survives, and is kept here rather than thrown away:
// the per-slot roster, the reshuffle, the typed name and the chosen sex -- all
// re-timed. visible() is what the phone strip draws: ONE person until act 2
// unlocks, a second when it does, a third after that. Nothing about the strip's
// look changed; only WHEN a face exists.
//
// A DOOR THAT OPENED STAYS OPEN. unlock() is one-way and ordered (act 3 cannot
// unlock before act 2), and it is saved (save()/load()), because an unlock that
// a reload forgets is a feature that only works until he closes the tab.
//
// WHAT UNLOCKS IT is the manager's default until he rules, "the first home base is
// yours": act n+1 unlocks when the player holds a base in act n. unlockFromBases()
// reads bohemia_homebases' ledger entries for exactly that. AND NOTHING IN THE
// WALKED GAME CAN HAND HIM A BASE YET (measured 9/29: that module is not inlined
// in the city and nothing calls took()), so nothing calls unlock yet. It is one
// call for FACTIONS/RUN to make the moment a base is his, and it is gated here
// against the real ledger rather than against a stand-in.
//
// THE OFFER TO CUSTOMIZE is a window, not a screen: while an unlocked act's window
// is open (customizable()), reshuffle / setName / setSex work on it. It closes when
// he flips away from that act or confirm()s. Acts that are not unlocked yet are
// NOT refused, because nothing can see them and WORDS' standalone screen still
// prepares all three before it is retired.
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
        name: nm, sex: sex, age: ov.age || 'younger',
        reads: nm ? readsAs(nm) : 'either',
        named: !!nm,
        custom: !!(ov.name || ov.sex || ov.age),
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
    if (!customizable(act)) return { changed: false, why: 'CLOSED' };
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
    if (!customizable(act)) return { ok: false, why: 'CLOSED' };
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
    if (!customizable(act)) return { ok: false, why: 'CLOSED' };
    var s = String(sex || '').toLowerCase();
    if (s !== 'male' && s !== 'female') return { ok: false, why: 'NOT_A_SEX' };
    if (!OVERRIDE[act]) OVERRIDE[act] = {};
    OVERRIDE[act].sex = s;
    if (!OVERRIDE[act].name) delete OVERRIDE[act].name;  /* re-derive, not stale */
    return { ok: true, act: act | 0, sex: s };
  }

  /* OLDER OR YOUNGER (Paolo 10/2, rule 67: 'you can choose to be older or younger').
     Its own door, same shape as setSex: only while the window is open, and it never
     touches a typed name. Nobody dies of old age inside an act, so this is who he is
     on arrival, not a clock. */
  function setAge(act, age) {
    if (!isAct(act)) return { ok: false, why: 'NOT_AN_ACT' };
    if (!customizable(act)) return { ok: false, why: 'CLOSED' };
    var a = String(age || '').toLowerCase();
    if (a !== 'older' && a !== 'younger') return { ok: false, why: 'NOT_AN_AGE' };
    if (!OVERRIDE[act]) OVERRIDE[act] = {};
    OVERRIDE[act].age = a;
    return { ok: true, act: act | 0, age: a };
  }

  /* RESET, for a screen that offers "start over" before he leaves it. Testing
     hook too -- a gate that mutates state needs a way back to zero. */
  function resetRoster() {
    SLOT_SALT = { 1: 0, 2: 0, 3: 0 };
    OVERRIDE = {};
  }

  /* THE STATE. Which act he is standing in, which acts exist for him yet, which
     of those he has ever stood in, and which are still open to be customized. */
  var CURRENT = 1;
  var UNLOCKED = { 1: true };        /* act -> true; act 1 is where he starts */
  var MET = { 1: true };             /* acts he has stood in at least once */
  var OPEN = {};                     /* unlocked acts whose customize window is open */
  function current() { return CURRENT; }
  function isAct(n) { n = n | 0; return n === 1 || n === 2 || n === 3; }
  function isUnlocked(n) { return isAct(n) && !!UNLOCKED[n | 0]; }
  function unlocked() { return [1, 2, 3].filter(isUnlocked); }
  /* CAN THIS ACT'S PERSON STILL BE CHANGED. Act 1 is the player and the face
     maker's; an act that has not unlocked has nobody to see it and is left alone
     (WORDS' standalone screen prepares all three before it is retired); an
     unlocked act is changeable only while its window is open. */
  function customizable(n) {
    n = n | 0;
    return n === 1 || !UNLOCKED[n] || !!OPEN[n];
  }

  /* UNLOCK, ONE WAY AND IN ORDER. The next act only, so a caller cannot skip a
     generation; asking again is answered, not repeated. The new person's window
     opens: he is offered to customize them, and they start GENERATED from the one
     before (the strip asks faceKey() for that face; the name is the roster's). */
  function unlock(n) {
    if (!isAct(n)) return { ok: false, why: 'NOT_AN_ACT' };
    n = n | 0;
    if (UNLOCKED[n]) return { ok: false, why: 'ALREADY', act: n };
    if (n > 1 && !UNLOCKED[n - 1]) return { ok: false, why: 'NOT_NEXT', act: n };
    UNLOCKED[n] = true;
    OPEN[n] = true;
    return { ok: true, act: n, open: true };
  }

  /* THE DEFAULT TRIGGER, READ OFF THE REAL LEDGER: act n+1 unlocks when the player
     took a home base in act n (bohemia_homebases entries: {act, how:'taken',
     to:'you'}). Takes the entries, not the module, so it works on a save blob as
     well as a live record. Returns the acts it just unlocked, in order. */
  function unlockFromBases(entries, holder) {
    var who = holder == null ? 'you' : holder, out = [];
    if (Object.prototype.toString.call(entries) !== '[object Array]') return out;
    for (var n = 1; n <= 2; n++) {
      if (UNLOCKED[n + 1] || !UNLOCKED[n]) continue;
      var got = entries.some(function (e) {
        return e && (e.act | 0) === n && e.how === 'taken' && e.to === who;
      });
      if (got && unlock(n + 1).ok) out.push(n + 1);
    }
    return out;
  }

  /* CLOSE AN ACT'S CUSTOMIZE WINDOW ON PURPOSE (an OK button). */
  function confirm(n) {
    if (!isAct(n)) return { ok: false, why: 'NOT_AN_ACT' };
    delete OPEN[n | 0];
    return { ok: true, act: n | 0 };
  }

  /* THE FLIP. Returns what changed, so a caller can redraw exactly what moved
     and a gate can assert it -- and returns `moved:false` for a tap on the act he
     is already in, because a flip to where you already are is not an event and
     must not cost a redraw or a sound. A LOCKED act is refused and said so: there
     is nobody there to become yet. `first` is true the first time he ever stands
     in an act, which is the "hop" the offer to customize belongs to. Leaving an
     act closes its customize window. */
  function flip(n) {
    if (!isAct(n)) return { moved: false, why: 'NOT_AN_ACT' };
    if (!UNLOCKED[n | 0]) return { moved: false, why: 'LOCKED', act: n | 0 };
    if (n === CURRENT) return { moved: false, why: 'ALREADY_THERE', act: CURRENT };
    var from = CURRENT;
    delete OPEN[from];
    CURRENT = n | 0;
    var first = !MET[CURRENT];
    MET[CURRENT] = true;
    return { moved: true, from: from, to: CURRENT, first: first };
  }
  function setCurrent(n) { if (isAct(n) && UNLOCKED[n | 0]) CURRENT = n | 0; return CURRENT; }

  /* WHAT THE PHONE STRIP DRAWS: THE UNLOCKED ACTS ONLY, each with what it needs
     to be a tile. roster() stays the full three (WORDS' standalone screen still
     prepares all of them); this is the timed view. `open` is the customize window.
     `bornOf` names the person before, so a screen can say who this one comes from
     without asking the roster a second time. */
  function visible(seed) {
    var all = roster(seed), out = [];
    for (var i = 0; i < all.length; i++) {
      var a = all[i];
      if (!UNLOCKED[a.act]) continue;
      var row = {};
      for (var k in a) row[k] = a[k];
      row.open = a.act > 1 && !!OPEN[a.act];
      row.met = !!MET[a.act];
      row.bornOf = a.act > 1 ? { act: a.act - 1, name: all[a.act - 2].name, sex: all[a.act - 2].sex } : null;
      out.push(row);
    }
    return out;
  }

  /* THE FACE ASK'S KEY, so a face follows the person and not the slot number.
     [three names] found that ctFaceAsk keyed the cache on 'act2', a fixed string,
     so a reshuffle or a chosen sex changed the name and left the face exactly
     where it was. Now the key carries what a face is made from: this act's reshuffle
     count and sex, and for the third act the second's too (the third is born from
     the second, not from the first). A TYPED NAME IS NOT IN THE KEY: a name is not
     a face. Act 1 is the face he built and its key never changes. Salt 0 with no
     chosen sex still reads as a key the shell parses the same as the bare 'act2'. */
  function reads(sex) { return sex === 'female' ? 'she' : 'he'; }
  function faceKey(seed, n) {
    if (!isAct(n)) return null;
    n = n | 0;
    if (n === 1) return 'act1';
    var all = roster(seed);
    var me = all[n - 1], key = 'act' + n + '~s' + (SLOT_SALT[n] || 0) + '~' + reads(me.sex);
    if (n === 3) {
      var mid = all[1];
      key += '~p' + (SLOT_SALT[2] || 0) + '~' + reads(mid.sex);
    }
    return key;
  }

  /* THE SAVE. A door that opened has to stay open across a reload, and so does the
     person he made: unlocks, which acts he has stood in, which windows are still
     open, where he stands, every reshuffle count and every typed name or chosen
     sex. Small, plain data, and load() treats anything broken as "nothing saved". */
  function save() {
    return {
      V: 1,
      current: CURRENT,
      unlocked: unlocked(),
      met: [1, 2, 3].filter(function (n) { return !!MET[n]; }),
      open: [2, 3].filter(function (n) { return !!OPEN[n]; }),
      salt: { 1: SLOT_SALT[1] | 0, 2: SLOT_SALT[2] | 0, 3: SLOT_SALT[3] | 0 },
      override: JSON.parse(JSON.stringify(OVERRIDE))
    };
  }
  function load(blob) {
    if (!blob || typeof blob !== 'object' || blob.V !== 1) return { ok: false, why: 'NOTHING_SAVED' };
    var u = { 1: true }, m = { 1: true }, o = {}, i, n;
    var ul = Object.prototype.toString.call(blob.unlocked) === '[object Array]' ? blob.unlocked : [];
    /* ordered, so a hand-edited blob cannot skip a generation */
    for (n = 2; n <= 3; n++) if (ul.indexOf(n) >= 0 && u[n - 1]) u[n] = true;
    var ml = Object.prototype.toString.call(blob.met) === '[object Array]' ? blob.met : [];
    for (i = 0; i < ml.length; i++) if (isAct(ml[i]) && u[ml[i] | 0]) m[ml[i] | 0] = true;
    var ol = Object.prototype.toString.call(blob.open) === '[object Array]' ? blob.open : [];
    for (i = 0; i < ol.length; i++) if ((ol[i] | 0) > 1 && isAct(ol[i]) && u[ol[i] | 0]) o[ol[i] | 0] = true;
    var salt = { 1: 0, 2: 0, 3: 0 };
    if (blob.salt && typeof blob.salt === 'object')
      for (n = 1; n <= 3; n++) { var sv = blob.salt[n] | 0; salt[n] = sv > 0 && sv < 1e6 ? sv : 0; }
    var ov = {};
    if (blob.override && typeof blob.override === 'object')
      for (n = 1; n <= 3; n++) {
        var r = blob.override[n]; if (!r || typeof r !== 'object') continue;
        var one = {};
        if (typeof r.name === 'string' && r.name.trim() && r.name.length <= 24) one.name = r.name.trim();
        if (r.sex === 'male' || r.sex === 'female') one.sex = r.sex;
        if (r.age === 'older' || r.age === 'younger') one.age = r.age;
        if (one.name || one.sex || one.age) ov[n] = one;
      }
    UNLOCKED = u; MET = m; OPEN = o; SLOT_SALT = salt; OVERRIDE = ov;
    var c = blob.current | 0;
    CURRENT = (isAct(c) && u[c]) ? c : 1;
    return { ok: true, unlocked: unlocked(), current: CURRENT };
  }

  /* BACK TO A NEW GAME: one act, nothing customized. Testing hook, and the answer
     to "start over". resetRoster() alone clears salts and overrides and leaves
     the unlocks, which is what a name screen wants and a new game does not. */
  function resetAll() {
    UNLOCKED = { 1: true }; MET = { 1: true }; OPEN = {}; CURRENT = 1;
    resetRoster();
  }

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
    setName: setName, setSex: setSex, setAge: setAge, resetRoster: resetRoster,
    current: current, setCurrent: setCurrent, flip: flip, isAct: isAct,
    unlock: unlock, unlocked: unlocked, isUnlocked: isUnlocked,
    unlockFromBases: unlockFromBases, customizable: customizable, confirm: confirm,
    visible: visible, faceKey: faceKey, save: save, load: load, resetAll: resetAll,
    yearsBetween: yearsBetween, groundDiffers: groundDiffers, draft: DRAFT
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaActs = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
