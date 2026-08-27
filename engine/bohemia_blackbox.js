/* ============================================================================
   BOHEMIA -- THE BLACK BOX AND THE CARD (8/27/26, PEOPLE lane)
   Backlog row 0f, THE FEEDBACK CARD. The last unowned row on the demo path:
   BUILD -> DOOR -> ENDING -> INSTRUMENT -> INVITE, and this is INSTRUMENT.

   THE ROW SAYS: "three taps (fun? / confusing? / play again?) + an optional
   text box, exported exactly like the save blob so a tester can paste it into
   a chat." Amended 8/25: the paste carries THE BUILD AND THE SEED, because
   "it froze when I went in the door" is unanswerable without them.

   *** AND THE ROW AND THE PROTOCOL CONTRADICT EACH OTHER. ***
   The protocol's own standing rule (records/BOHEMIA_CLOSED_PLAYTEST_PROTOCOL_
   8_11_26.md): "A tester who stops playing is a FINDING, never a failure --
   where and why is the whole point of the instrument."
   A card at the END is filled in only by people who reached the end. Everybody
   who stopped -- the exact population the protocol calls the whole point --
   never sees it. AN END-OF-DAY CARD CANNOT COLLECT THE ONE FINDING THE
   PROTOCOL NAMES AS ITS REASON FOR EXISTING.

   SO THE PASTE EXISTS BEFORE THE CARD DOES. This module is a flight recorder
   that runs from the first tap. By the time anybody opens the card, the record
   of their session is already written; the card only adds the words. Somebody
   who quits at minute four and comes back next week still has it, and the card
   has a door that is not the ending.

   AND IT SAMPLES, IT DOES NOT HOOK. The city's own save carries the reason, in
   its own comment: "ONE SEAM, NOT TWENTY: the writers are record/adjust/
   setState and two ledgers, and hooking each is five chances to miss one." A
   ticker reads the state the game already keeps and stamps a beat the first
   time it becomes true. No call site is touched, so no lane can break this by
   moving a function, and there is no writer to miss.

   THE QUESTIONS ARE NOT THE ROW'S LITERAL THREE, and that is deliberate.
   Researched 8/27, and every source lands on the same two points:
     - PEOPLE ARE NICE AND THEY WILL LIE TO YOU, friends and family worst of
       all. "Did you have fun?" is the textbook vague question and "would you
       play again?" is the textbook polite one. The fix both aisles give is to
       ask about A BEHAVIOUR ONLY PEOPLE WHO LOVE A THING PERFORM: they send it
       to somebody. That is Net Promoter's whole finding, and its other half is
       that only the top of the scale counts, so the answers are three and the
       middle one is not a pass.
     - THE USEFUL CUT IS FUN VERSUS WORK, and the single best open prompt is
       "if you could change one thing". Vague in, vague out.
   The row's SHAPE is kept exactly: three taps, one box, one paste.

   AND THE TAPS ARE ABOUT THEIR OWN SESSION. "What felt like work" offers the
   parts THEY REACHED, never a generic list, which is only possible because the
   recorder ran while they played. A tester who quit before the phone rang is
   never asked about the phone.

     node gates/feedback_gate.js
   ============================================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BohemiaBlackBox = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 'bohbb-1.0.0';
  var REC_V = 1;

  /* ---- THE BEATS OF ONE GOOD DAY -----------------------------------------
     Fine enough that "where did they stop" is a real answer, and each one is
     read off state the game already keeps. `bucket` is how the beat is named
     to the person who played it; several beats share a bucket because "the
     phone rang" and "I took the job" are one thing to a player and two things
     to whoever is reading the paste. */
  var BEATS = [
    { key: 'open',     bucket: 'morning',  said: 'the game came up' },
    { key: 'up',       bucket: 'morning',  said: 'got out of bed' },
    { key: 'rang',     bucket: 'phone',    said: 'the phone rang' },
    { key: 'took',     bucket: 'phone',    said: 'took the job' },
    { key: 'walked',   bucket: 'getting',  said: 'left the block' },
    { key: 'found',    bucket: 'getting',  said: 'got to the address' },
    { key: 'talked',   bucket: 'people',   said: 'talked to somebody' },
    { key: 'named',    bucket: 'people',   said: 'asked somebody their name' },
    { key: 'answered', bucket: 'people',   said: 'answered somebody' },
    { key: 'finished', bucket: 'job',      said: 'finished the job' },
    { key: 'slept',    bucket: 'end',      said: 'went to bed' }
  ];

  /* WHAT A PLAYER CALLS IT. Six, because eleven chips do not fit under a thumb
     on a 390 wide phone and because a person does not think in eleven parts. */
  var BUCKETS = [
    { key: 'morning', label: 'the morning' },
    { key: 'phone',   label: 'the phone' },
    { key: 'getting', label: 'getting there' },
    { key: 'people',  label: 'talking to people' },
    { key: 'job',     label: 'the job' },
    { key: 'end',     label: 'the end' }
  ];

  function beatKeys() { return BEATS.map(function (b) { return b.key; }); }
  function bucketOf(key) {
    for (var i = 0; i < BEATS.length; i++) if (BEATS[i].key === key) return BEATS[i].bucket;
    return null;
  }

  /* ---- THE RECORD --------------------------------------------------------- */
  function blank() {
    return { v: REC_V, sessions: 1, ms: 0, beats: {}, seed: null, seedText: null,
             build: null, device: null, day: 1, min: 0, answers: null, words: '' };
  }

  /* A BEAT IS STAMPED ONCE, THE FIRST TIME IT IS TRUE. Stamping it again would
     turn "when did they get there" into "when did the ticker last look", which
     is the difference between a record and a clock. */
  function mark(rec, key, at) {
    if (!rec || !rec.beats) return rec;
    if (beatKeys().indexOf(key) < 0) return rec;
    if (rec.beats[key]) return rec;
    at = at || {};
    rec.beats[key] = { ms: at.ms | 0, day: at.day == null ? null : at.day | 0,
                       min: at.min == null ? null : at.min | 0 };
    return rec;
  }

  function reached(rec) {
    var got = [];
    for (var i = 0; i < BEATS.length; i++)
      if (rec && rec.beats && rec.beats[BEATS[i].key]) got.push(BEATS[i].key);
    return got;
  }

  /* WHERE THEY STOPPED. The furthest beat IN ORDER, not the last one stamped:
     a player can talk to somebody before they take the job, and the honest
     answer to "how far did they get" is how deep into the day they went. */
  function lastBeat(rec) {
    var last = null;
    for (var i = 0; i < BEATS.length; i++)
      if (rec && rec.beats && rec.beats[BEATS[i].key]) last = BEATS[i].key;
    return last;
  }

  /* AND HOW LONG THEY SAT THERE. A tester who reached the phone and then spent
     nine minutes not finding the next thing is a different finding from one who
     reached the phone and closed the tab, and this is the only number that
     tells them apart. */
  function stalledMs(rec) {
    var lb = lastBeat(rec);
    if (!rec || !lb || !rec.beats[lb]) return 0;
    return Math.max(0, (rec.ms | 0) - (rec.beats[lb].ms | 0));
  }

  /* AN OLDER RECORD IS NEVER THROWN AWAY. iOS reloads the page on its own
     schedule (row 0h), so a second visit is normal, not a new tester. Beats
     keep their FIRST time, minutes add up, and the session count is the tell. */
  function merge(older, newer) {
    if (!older || older.v !== REC_V) return newer;
    if (!newer) return older;
    var out = newer;
    out.sessions = (older.sessions | 0 || 1) + 1;
    out.ms = (older.ms | 0) + (newer.ms | 0);
    for (var k in older.beats) if (older.beats.hasOwnProperty(k) && !out.beats[k])
      out.beats[k] = older.beats[k];
    if (!out.words && older.words) out.words = older.words;
    if (!out.answers && older.answers) out.answers = older.answers;
    return out;
  }

  /* ---- THE THREE TAPS -----------------------------------------------------
     Every word here is draft:true. The wording is researched, not preferred,
     and the reasoning sits above each one so a later session can argue with
     the reason instead of the taste. */
  var QUESTIONS = [
    {
      id: 'send',
      /* THE ONLY ONE THAT IS NOT ABOUT FEELINGS. People who love a thing send
         it to somebody; people who are being kind say they had fun. The middle
         answer is on purpose and it is not a pass. */
      ask: 'WOULD YOU SEND THIS TO SOMEBODY?',
      options: ['I already want to', 'if it were finished', 'no'],
      draft: true
    },
    {
      id: 'work',
      /* FUN VERSUS WORK, which is the cut that produces a change. Options come
         from their own session. */
      ask: 'WHAT PART FELT LIKE WORK?',
      fromBuckets: true,
      extra: ['none of it did'],
      draft: true
    },
    {
      id: 'lost',
      /* THE CONFUSION MAP. Not "was it confusing", which is a yes or a no and
         neither one is a place. */
      ask: 'WHERE DID YOU NOT KNOW WHAT TO DO?',
      fromBuckets: true,
      extra: ['I always knew'],
      draft: true
    }
  ];

  /* THE ONE OPEN PROMPT. Research is unanimous that a single forced priority
     beats a blank box, and that a blank box beats five boxes. */
  var WORDS = {
    ask: 'IF YOU COULD CHANGE ONE THING',
    hint: 'anything. the first thing you thought of is the right one.',
    draft: true
  };

  /* AND THE OPTIONS ARE THEIR OWN DAY. A tester who never got the phone call is
     never asked about the phone: an option they cannot have an opinion about is
     an invitation to make one up. */
  function optionsFor(q, rec) {
    if (!q.fromBuckets) return q.options.slice();
    var lit = {}, got = reached(rec);
    for (var i = 0; i < got.length; i++) lit[bucketOf(got[i])] = 1;
    var out = [];
    for (var j = 0; j < BUCKETS.length; j++)
      if (lit[BUCKETS[j].key]) out.push(BUCKETS[j].label);
    return out.concat(q.extra || []);
  }

  function cardFor(rec) {
    return QUESTIONS.map(function (q) {
      return { id: q.id, ask: q.ask, options: optionsFor(q, rec) };
    });
  }

  /* ---- THE PASTE ----------------------------------------------------------
     Plain text, because it is going into a chat message on a phone. Readable
     top to bottom by a person, and every line is `KEY: value` so a digest of
     eight testers can be compiled without anybody retyping anything. */
  function mmss(ms) {
    var s = Math.max(0, Math.round((ms | 0) / 1000));
    var m = Math.floor(s / 60);
    return m + 'm ' + (s % 60) + 's';
  }

  function render(rec, answers, words) {
    rec = rec || blank();
    answers = answers || rec.answers || {};
    words = (words == null ? (rec.words || '') : words);
    var L = [];
    L.push('BOHEMIA / ONE DAY / what it was like');
    L.push('');
    L.push('BUILD: ' + (rec.build || 'unknown'));
    L.push('SEED: ' + (rec.seedText || '?') + ' / ' + (rec.seed == null ? '?' : rec.seed));
    L.push('DEVICE: ' + (rec.device || 'unknown'));
    L.push('PLAYED: ' + mmss(rec.ms) + ' over ' + (rec.sessions | 0 || 1)
      + ' sitting' + ((rec.sessions | 0) > 1 ? 's' : ''));
    L.push('');
    var lb = lastBeat(rec);
    var said = null;
    for (var i = 0; i < BEATS.length; i++) if (BEATS[i].key === lb) said = BEATS[i].said;
    L.push('GOT AS FAR AS: ' + (said || 'nothing at all'));
    if (lb !== 'slept') L.push('STOPPED THERE FOR: ' + mmss(stalledMs(rec)));
    L.push('IN GAME: day ' + (rec.day | 0) + ', '
      + ('0' + Math.floor((rec.min | 0) / 60)).slice(-2) + ':'
      + ('0' + ((rec.min | 0) % 60)).slice(-2));
    L.push('');
    /* IN THE ORDER IT HAPPENED, not in the order the day is supposed to go.
       The first paste off the real demo read "the phone rang" ABOVE "got out of
       bed" and looked like a bug; it was the game telling the truth, because
       the phone is already ringing while he is still in bed. A list that claims
       to be chronological and is not makes a reader distrust the whole page. */
    var hits = [];
    for (var j = 0; j < BEATS.length; j++) {
      var hit = rec.beats && rec.beats[BEATS[j].key];
      if (hit) hits.push({ said: BEATS[j].said, ms: hit.ms | 0 });
    }
    hits.sort(function (a, b) { return a.ms - b.ms; });
    L.push('THE DAY, IN THE ORDER IT HAPPENED:');
    if (!hits.length) L.push('  nothing at all');
    for (var h = 0; h < hits.length; h++)
      L.push('  ' + (mmss(hits[h].ms) + '        ').slice(0, 8) + hits[h].said);
    var missed = [];
    for (var n = 0; n < BEATS.length; n++)
      if (!(rec.beats && rec.beats[BEATS[n].key])) missed.push(BEATS[n].said);
    if (missed.length) { L.push('NEVER GOT TO:'); L.push('  ' + missed.join(', ')); }
    L.push('');
    for (var q = 0; q < QUESTIONS.length; q++) {
      var Q = QUESTIONS[q];
      L.push(Q.ask);
      L.push('  ' + (answers[Q.id] || '(no answer)'));
    }
    L.push('');
    L.push(WORDS.ask);
    L.push('  ' + (String(words).trim() || '(nothing written)'));
    L.push('');
    L.push('--- paste this whole thing, nothing in it is edited ---');
    return L.join('\n');
  }

  /* WHAT THE PASTE CANNOT ANSWER, SAID OUT LOUD. Anything not in this list is
     a claim the instrument does not support, and a round that is read as if it
     did is worse than a round with no instrument at all. */
  var CANNOT = [
    'why they stopped, only where and for how long',
    'whether they were being kind, on any question',
    'anything at all about a tester who never opens the card'
  ];

  return {
    VERSION: VERSION, REC_V: REC_V,
    BEATS: BEATS, BUCKETS: BUCKETS, QUESTIONS: QUESTIONS, WORDS: WORDS,
    CANNOT: CANNOT,
    blank: blank, mark: mark, merge: merge,
    beatKeys: beatKeys, bucketOf: bucketOf,
    reached: reached, lastBeat: lastBeat, stalledMs: stalledMs,
    optionsFor: optionsFor, cardFor: cardFor,
    mmss: mmss, render: render
  };
}));
