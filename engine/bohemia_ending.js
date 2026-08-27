/* BOHEMIA ENDING — the last thirty seconds of the demo, which nobody had built.
   (8/27/26, PEOPLE lane. Demo critical path row DEMO-END.)

   WHY IT EXISTS, AND IT IS THE ONE ROW ON THE PATH WITH NO OWNER. The handoff's
   own line: "BUILD -> DOOR -> ENDING -> INSTRUMENT -> INVITE ... DEMO-END (the
   last thirty seconds, which nobody has designed and which peak-end says is half
   of what anybody keeps)". The RUN lane it was assigned to has not shipped since
   8/12. This is a message from a person, on a phone, at the end of a day, which
   is this lane's whole subject.

   THE RESEARCH IT IS BUILT ON, already banked in
   records/BOHEMIA_WHAT_THE_DEMO_IS_STILL_MISSING_8_25_26.md:
     - KAHNEMAN AND FREDRICKSON'S PEAK-END RULE: what a person keeps of an
       episode is predicted almost entirely by TWO MOMENTS, the most intense one
       and the LAST one. Not the average. Not the total.
     - DURATION NEGLECT: how long it went barely registers at all.
     - Zukowski's demo work, from the other direction: a demo's ending is not
       neutral, and ending without giving a reason to come back actively hurts
       it. It has to leave a person thinking "I need to play more of this",
       never "that was annoying".
   His ruled demo cut is COLD OPEN -> THE VISTA -> ONE GOOD DAY -> sleep, and the
   coordinator's finding was that BOTH PEAKS ARE IN THE FIRST FIVE MINUTES AND
   THE LAST THING THE PLAYER FEELS IS GOING TO BED. The cut is his and it is
   good. This is the thirty seconds after it.

   *** AND THE DEMO ENDS ON A THING YOU ARE NOT ALLOWED TO SAY. *** The corpus's
   single most repeated craft finding is the withheld verb: seven of the
   CONVERSATIONS MASTER's marquee nodes are remembered for the line the game
   refused to let the player speak. The message that lands here asks the player
   something, and the reply they want to send is sitting right there, greyed and
   dead. That is the game's own grammar, used once, at the end, on purpose.

   IT SPEAKS TO WHAT THEY ACTUALLY DID. The quest already classifies its own
   outcome (#quiet / #notable / #reckless, plus its author's FAIL branch, plus
   never having taken the job at all), so the last beat is different for each
   without anybody inventing a fifth thing to measure. Peak-end says the last
   moment is half of what they keep; a last moment that is the same whatever they
   did is half of what they keep spent on nothing.

   WORDS ARE A REAL ATTEMPT AND HIS TO RETYPE (ALWAYS MAKE AN ATTEMPT, 8/11).
   Every line here is draft:true, written against laws/BOHEMIA_VOICE_CARD_8_26_26:
   contracted, varied hard in length, no aphorism in the last sentence, and one
   physical detail per speech that only this person could have said. NOBODY IN
   BOHEMIA IS WISE.

   REUSE CHECK: cooks no graphic pixels and opens no bank. It draws nothing. */
(function (root) {
  'use strict';

  /* THE FIVE WAYS ONE GOOD DAY CAN END, and the game already knows which. The
     keys are the quest's OWN tags, not a vocabulary invented here. */
  /* *** NOT ONE LINE HERE ASSUMES A GENDER, AND THAT IS A BUG I SHIPPED FIRST. ***
     The first cut of the withheld verbs said "Tell him it was you", and the
     probe that proved the ending working printed it under the header LOURDES
     IBARRA. The cast is PROCEDURAL -- the person the quest lands on is whoever
     really stands on that block -- so a line that names a pronoun is a line that
     will be wrong for half the valley. They/them, every time, for everybody.
     Same rule the names themselves already follow. */
  var ENDINGS = {
    quiet: {
      says: [
        'Light all night. Right through nine, past ten, past when I gave up waiting for it to go.',
        "I still went out at nine. Forty years standing on that corner at nine o'clock, you don't stop just because the lights stayed on.",
        "Nobody's said a word. Not one.",
        'Was it you?'
      ],
      noverb: 'Tell them it was you'
    },
    notable: {
      says: [
        'They came in daylight. Two of them, a clipboard, a van with the doors open and half the street watching them do it.',
        "My name's on that order.",
        'Mine. Not theirs.',
        "I don't know yet what I think about that. Ask me in a week.",
        'You still around?'
      ],
      noverb: "Tell them you're still around"
    },
    reckless: {
      says: [
        'Sparks went up past the second floor.',
        "Half this street saw it and the other half heard it, and by breakfast three people had asked me who you were, and I told all three I didn't know you.",
        'That was true when I said it.',
        "It isn't now.",
        "They're coming to look. You get that, right?"
      ],
      noverb: 'Warn them'
    },
    failed: {
      says: [
        'Brown at nine. Same as always.',
        "I waited out front a good while, longer than I meant to, watching the corner for somebody I'd met the once.",
        'Got cold. Went in.',
        "I'm not asking again. I don't think.",
        'You still out there?'
      ],
      noverb: "Tell them you'll come tomorrow"
    },
    untaken: {
      says: [
        'This is the number that called you this morning.',
        "You didn't pick up. That's fine. People don't.",
        "Nine tonight it goes brown again and I'll be stood out front like a fool with a torch in my mouth.",
        'Anyway.'
      ],
      noverb: 'Pick up'
    }
  };

  /* WHICH ONE. Reads the day the player actually had: the quest's own outcome
     and its own hashtag, or the fact that the phone rang and nobody answered.
     UNTAKEN IS FIRST because it is the only branch where no quest ever ran, and
     asking a quest that never started what its outcome was is how a "failed"
     ending gets shown to somebody who simply had a quiet day. */
  function pick(ctx) {
    ctx = ctx || {};
    if (!ctx.taken) return 'untaken';
    if (ctx.outcome === 'FAIL') return 'failed';
    var tag = String((ctx.tags && ctx.tags[0]) || '').toLowerCase();
    if (ENDINGS[tag] && tag !== 'untaken' && tag !== 'failed') return tag;
    /* A COMPLETE WITH A TAG NOBODY WROTE AN ENDING FOR IS NOT A CRASH. It reads
       as the quietest version, which is the truthful default: the job got done
       and the valley did not hear about it. */
    return ctx.outcome === 'COMPLETE' ? 'quiet' : 'failed';
  }

  /* THE WHOLE BEAT, as plain data. Renders nothing: the surface owns pixels and
     this owns which words, exactly like every other organ in this lane. */
  function endingFor(ctx) {
    ctx = ctx || {};
    var key = pick(ctx);
    var e = ENDINGS[key];
    if (!e) return null;
    return {
      key: key,
      from: ctx.from || null,        /* the cast person, when the day had one */
      says: e.says.slice(),
      noverb: e.noverb,
      draft: true                    /* every word above is his to retype */
    };
  }

  function keys() { var out = []; for (var k in ENDINGS) out.push(k); return out.sort(); }

  var API = { endingFor: endingFor, pick: pick, keys: keys, ENDINGS: ENDINGS,
              VERSION: 'bohend-1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaEnding = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
