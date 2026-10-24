// BOHEMIA SPANGLISH AT TEN TO FIFTEEN PERCENT (10/24/26, WORDS lane,
// VAMILY [spanglish at ten percent, and the personalities], rule 143(a))
//
// Paolo 10/24, LOCKED: "I mentioned it one time that I want like 10% of spoken
// conversation being Spanglish, and now all my crew members are in Spanglish;
// it should be 10 to 15% randomized... it's shoving it in my face."
//
// WHAT WAS WRONG, MEASURED BEFORE THIS FILE: the dial lived on the PERSON, not
// on the LINE. A person was English or Spanglish for life (bohemia_people.js
// langOf), and the lines that had no person behind them were simply written in
// Spanglish: 10 of the 13 things the veteran says in every fight, all five
// keeper price lines, and 15 of the settlement keepers' lines. So the voice he
// hears most (the man teaching the fight) was Spanglish on about 3 lines in 4.
//
// THE RULE NOW, ONE PLACE, EVERY MOUTH CALLS IT:
//   * EVERY LINE ROLLS. A spoken line comes out Spanglish on about 1 in 8 tries
//     (RATE), rolled per line, so the same keeper says "Pick one." most visits
//     and "Pick one, mijo." now and then.
//   * SOME PEOPLE LEAN MORE. About one person in five leans (LEAN_HIGH, 25%),
//     the rest less (LEAN_LOW, 10%); a person the valley already rolled as a
//     Spanish speaker (people.js register 'spanglish' or 'es') always leans.
//     The mean lands at ~13%.
//   * NEVER THE PLAYER (first votes 9/21, rule 27): say() for the player is
//     always plain English.
//   * BOTH FORMS EXIST FOR EVERY LINE. plain() takes the tag Spanish out of a
//     line written in Spanglish ("Ándale.", ", mijo.", "gracias a Dios");
//     flavour() puts one tag into a line written in English, in that person's
//     own habit (his word, where it sits). The English sentence is never
//     touched, so LANGUAGE NEVER GATES REQUIRED INFORMATION still holds: a tag
//     is an extra word, never the instruction.
//
// Measured by gates/language_gate.js section H over a long play (every mouth,
// thousands of lines): the share must sit in 10 to 15 percent.
'use strict';
(function (root) {
  var HASREQ = typeof module !== 'undefined' && module.exports;

  var RATE = 0.125;          // the target, his 10 to 15
  var LEAN_LOW = 0.10;       // most people: a word now and then (a crew with no leaner still sits at 10)
  var LEAN_HIGH = 0.25;      // the leaners: two and a half times as often, never always
  var HIGH_SHARE = 0.20;     // how many lean, when nothing else says so
  /* mean for a person with no register: 0.80 * 0.10 + 0.20 * 0.25 = 0.130.
     For the valley's people: 0.85 * 0.10 + 0.15 * 0.25 = 0.123. Both inside.
     THE SPREAD IS SIZED FOR A CREW, not for the valley: a crew of eleven with no
     leaner says 10 percent, one with four of them about 15.5. The first dial
     (7.5 / 42) measured 6.9 percent on COMBAT's crew of eleven, the second
     (10 / 32) 18.8 on the same men: a small crew magnifies the spread. */

  function hash(s) {
    var h = 2166136261; s = String(s == null ? '' : s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13;
    return h >>> 0;
  }
  function unit(s) { return hash(s) / 4294967296; }

  /* a fresh salt each play, so a line's roll is new every time you open the game;
     setSeed() pins it for the gate */
  var SALT = String(Math.floor(Math.random() * 1e9));
  var COUNT = {};
  function setSeed(s) { SALT = String(s); COUNT = {}; }

  function keyOf(who) {
    if (who == null) return '';
    if (typeof who === 'string' || typeof who === 'number') return String(who);
    return String(who.key || who.id || who.name || '');
  }
  function regOf(who) { return who && typeof who === 'object' ? (who.lang || who.reg || null) : null; }

  function isPlayer(who) {
    if (who && typeof who === 'object' && (who.player || who.isPlayer)) return true;
    var k = keyOf(who).toLowerCase();
    return k === 'you' || k === 'player' || k === 'me';
  }

  /* how much this person leans to it, 0..1, the same person every play */
  function lean(who, reg) {
    if (isPlayer(who)) return 0;
    reg = reg || regOf(who);
    if (reg === 'spanglish' || reg === 'es') return LEAN_HIGH;
    if (reg === 'en') return LEAN_LOW;
    return unit('lean|' + keyOf(who)) < HIGH_SHARE ? LEAN_HIGH : LEAN_LOW;
  }

  /* THE ROLL, per line: true means this line comes out Spanglish */
  function roll(who, key, reg) {
    var k = keyOf(who), n = (COUNT[k] = (COUNT[k] || 0) + 1);
    return unit(SALT + '|' + k + '|' + (key || '') + '|' + n) < lean(who, reg);
  }

  /* THE TAG WORDS. Only these come out of a line and only these go in; a line
     whose Spanish is inside the sentence (the quirk and register buckets) has
     its own English twin and never comes through plain(). */
  var OPENERS = ['Ándale', 'Andale', 'Mira', 'Oye', 'Cuidado', 'Bueno', 'Ay', 'Órale', 'Orale', 'Pues', 'Ya', 'Claro', 'Ojalá', 'Ojala', 'Ahorita'];
  var CALLS = ['mijo', 'mija', 'compa', 'carnal', 'güey', 'guey', 'pues', 'hermano', 'hermana', 'primo', 'prima', 'mano', 'jefe', 'nomás', 'ese'];
  var RE_OPEN = new RegExp('^\\s*(?:' + OPENERS.join('|') + ')(?:[.,!]+|\\s*,)\\s+', 'i');
  var RE_OPEN_MID = new RegExp('([.!?]\\s+)(?:' + OPENERS.join('|') + ')(?:[.,!]+)\\s+', 'gi');
  var RE_CALL = new RegExp(',\\s*(?:' + CALLS.join('|') + ')(?=\\s*[.!?,;:]|\\s*$)', 'gi');
  var RE_PHRASE = [
    [/,?\s*gracias a Dios/gi, ', thank God'],
    [/,\s*ya sabes(?=\s*[.!?]|\s*$)/gi, ''],
    [/\bno más\b/gi, 'that\'s it'],
    [/\bGracias\b/g, 'Thanks'],
    [/\bgracias\b/g, 'thanks']
  ];
  /* the tag words, for a quick "does this still carry Spanish" read where the
     people engine's lexicon is not loaded (the fight, the settlement screen) */
  var TAGSET = {};
  OPENERS.concat(CALLS, ['gracias', 'dios']).forEach(function (w) { TAGSET[w.toLowerCase()] = 1; });

  function cap(s) { return s.replace(/^(\s*["'(]?)([a-záéíóúñ])/, function (_m, a, b) { return a + b.toUpperCase(); }); }

  function esIn(text) {
    var P = root.BohemiaPeople;
    if (P && P.esWordsIn) return P.esWordsIn(text);
    var out = [], m, re = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g, s = String(text == null ? '' : text);
    while ((m = re.exec(s))) if (TAGSET[m[0].toLowerCase()]) out.push(m[0]);
    return out;
  }

  /* THE LINE IN PLAIN ENGLISH: the tags out, the sentence untouched */
  function plain(line) {
    if (line == null) return line;
    var s = String(line), prev;
    do { prev = s; s = s.replace(RE_OPEN, ''); } while (s !== prev);
    s = s.replace(RE_OPEN_MID, '$1');
    s = s.replace(RE_CALL, '');
    RE_PHRASE.forEach(function (p) { s = s.replace(p[0], p[1]); });
    s = s.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
    return cap(s);
  }

  /* A PERSON'S HABIT: where his one word sits and which word it is. Fixed per
     person, so a man who says "compa" says "compa" and nobody else's word. */
  var HABIT_CALL = ['mijo', 'compa', 'carnal', 'güey', 'hermano', 'primo', 'mano', 'pues'];
  var HABIT_OPEN = ['Oye', 'Mira', 'Ándale', 'Bueno', 'Ya'];
  function habitOf(who) {
    var h = hash('habit|' + keyOf(who));
    return (h & 1) ? { at: 'call', w: HABIT_CALL[(h >>> 1) % HABIT_CALL.length] }
                   : { at: 'open', w: HABIT_OPEN[(h >>> 1) % HABIT_OPEN.length] };
  }

  /* THE LINE WITH ONE WORD OF SPANISH IN IT, in his habit */
  function flavour(line, who) {
    if (line == null) return line;
    var s = String(line).trim(); if (!s) return s;
    if (esIn(s).length) return s;
    var hb = habitOf(who);
    if (hb.at === 'open') return hb.w + '. ' + s;
    /* the word goes at the end, before the last stop: "Pick one, mijo." */
    var m = /^([\s\S]*?[^.!?"')\s])([.!?]+["')]?)\s*$/.exec(s);
    if (m) return m[1] + ', ' + hb.w + m[2];
    return s + ', ' + hb.w;
  }

  /* SAY: the one call every mouth makes. line is written either way; out comes
     Spanglish on the roll, plain English otherwise; the player always plain. */
  function say(who, line, key, reg) {
    if (line == null || line === '') return line;
    var en = plain(line);
    if (isPlayer(who)) return en;
    var hasEs = esIn(line).length > 0;
    var sp = hasEs ? String(line) : flavour(en, who);
    return roll(who, key || en, reg) ? sp : en;
  }

  /* PICK: for a mouth that already holds both forms (the register buckets, the
     quirk lines): which one this line uses. Returns the register to speak in. */
  function regFor(who, key, reg) {
    reg = reg || regOf(who) || null;   /* no register named: the man's own lean decides (never read as 'en') */
    if (isPlayer(who)) return 'en';
    if (!roll(who, key, reg)) return 'en';
    return !reg || reg === 'en' ? 'spanglish' : reg;
  }

  var API = {
    RATE: RATE, LEAN_LOW: LEAN_LOW, LEAN_HIGH: LEAN_HIGH, HIGH_SHARE: HIGH_SHARE,
    setSeed: setSeed, lean: lean, roll: roll, plain: plain, flavour: flavour,
    say: say, regFor: regFor, habitOf: habitOf, isPlayer: isPlayer, esIn: esIn
  };
  if (HASREQ) module.exports = API;
  root.BohemiaSpanglish = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
