/* ============================================================================
   BOHEMIA SQUIGGLE VOICES  (8/9/26, SOUNDS lane)

   Paolo ruled it 8/4 and made it top priority 8/9: Animal-Crossing-class
   gibberish speech, one voice per character, derived from that character's
   identity seed. "Dialogue that makes sound reads alive; silent portraits read
   dead."

   === WHY THIS IS NOT ANIMALESE'S METHOD, AND HAD TO NOT BE =================

   RESEARCH. Animalese is a sample player: Nintendo recorded a human saying
   every letter, then re-times and pitch-shifts those clips as the text scrolls,
   which is how a handful of files becomes hundreds of villagers (and why a
   happy villager is simply pitched up). That is the lineage and the feel to hit.

   It is also unavailable to us. The demo ruling is explicit -- "ZERO voice
   acting and zero audio files" -- and this repo has no sample pipeline, no
   recording, and a hard rule that everything is synthesised on the one
   AudioContext. So the samples have to be replaced by something that produces
   the same perceptual object from nothing.

   THAT SOMETHING IS FORMANT SYNTHESIS. A vowel is not a waveform, it is two or
   three resonant peaks: shape a buzzy source with bandpass filters at F1/F2/F3
   and the ear hears a vowel, with no recording anywhere. The frequencies below
   are the Peterson & Barney (1952) adult-male measurements -- the standard
   reference set, 76 speakers, ten American-English monophthongs in /h_d/
   context. /i/ really does sit at F1 270 / F2 2290.

   AND THE VOCAL TRACT IS WHY EVERYBODY SOUNDS DIFFERENT. Formants are
   resonances of a tube, so a shorter tube resonates higher: adult male ~17cm,
   adult female ~14.5cm, and female/child formants run 10-20% above male ones
   for the SAME vowel, with the F1/F2 pattern preserved so the vowel is still
   recognisable. That is one multiplier, and it is the single most powerful
   character knob here -- it changes WHO is speaking without changing WHAT the
   vowel is. Pitch alone (Animalese's knob) only makes a chipmunk; tract scale
   makes a different person.

   === WHAT MAKES IT READ AS TALKING RATHER THAN AS A TUNE ==================

   Three things, and none of them is optional:

   1. VOICED / UNVOICED ALTERNATION. Real speech is a buzz interrupted by
      hisses. If every letter is a pitched blip the result is a melody, which is
      the classic failure of naive babble synths. So unvoiced consonants
      (p t k f s h c x q) are a filtered NOISE burst with no pitch at all, and
      that alternation is most of the illusion.
   2. DECLINATION. Pitch drifts DOWN across a sentence in every human language,
      and rises at a question. A flat contour reads as a robot immediately.
   3. CONSONANTS ARE SHORTER THAN VOWELS. Roughly half. Even timing reads as
      morse code.

   === SEEDED, WHICH IS THE WHOLE POINT ======================================

   A character's voice is a pure function of their identity seed: same person,
   same voice, forever, on any device, with nothing stored. And the same person
   saying the same line produces the same babble every time -- the jitter is
   seeded off (character, line, letter index), never off Math.random. A voice
   that changes between two plays of one line is a voice the player cannot learn
   to recognise, and recognising people is the entire reason to do this.

   SCREECH LAW (7/8, absolute): no delay, no convolver, no feedback path
   anywhere in this file. A blip is source -> bandpass -> gain -> out and it is
   over. Nothing can ring.

   MECHANISM-MINE / CONTENTS-PAOLO'S: this cooks CANDIDATE voices and assigns
   none. Which voice belongs to which character is his ruling, and the bank
   stays empty until he thumbs one.
   ========================================================================== */
(function (root) {
  'use strict';

  /* Peterson & Barney (1952), adult male, Hz. F3 matters less than F1/F2 but
     leaving it out makes everything sound like a kazoo. */
  var VOWELS = {
    i: [270, 2290, 3010],    /* beet */
    I: [390, 1990, 2550],    /* bit  */
    e: [530, 1840, 2480],    /* bet  */
    a: [660, 1720, 2410],    /* bat  */
    A: [730, 1090, 2440],    /* father */
    O: [570,  840, 2410],    /* bought */
    U: [440, 1020, 2240],    /* foot */
    u: [300,  870, 2240],    /* boot */
    V: [640, 1190, 2390],    /* but  */
    R: [490, 1350, 1690]     /* bird */
  };
  var VKEYS = ['i', 'I', 'e', 'a', 'A', 'O', 'U', 'u', 'V', 'R'];

  /* which vowel colour each letter carries. Vowels get the obvious one;
     voiced consonants borrow a colour so they still sound like the mouth is
     somewhere, and unvoiced ones are noise and need none. */
  var LETTER = {
    a: 'a', e: 'e', i: 'I', o: 'O', u: 'V', y: 'i',
    b: 'A', d: 'e', g: 'A', j: 'i', l: 'e', m: 'u', n: 'I',
    r: 'R', v: 'e', w: 'u', z: 'i',
    p: null, t: null, k: null, f: null, s: null, h: null,
    c: null, x: null, q: null
  };
  var VOICED = { b:1, d:1, g:1, j:1, l:1, m:1, n:1, r:1, v:1, w:1, z:1 };

  /* ---- seeded randomness. Deterministic, tiny, and never Math.random ---- */
  function hash(str) {
    var h = 2166136261 >>> 0, i;
    str = String(str);
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function rng(seed) {                      /* mulberry32 */
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- A PERSON'S VOICE, from their identity seed and nothing else ------ */
  function voiceOf(seed) {
    var r = rng(hash('bohemia-voice:' + seed));
    /* TRACT is the character knob, not pitch. 0.82 is a big chest, 1.30 is a
       child. Formants scale by it; the vowel survives because F1 and F2 move
       together (that is why a child saying "beet" is still "beet"). */
    var tract = 0.82 + r() * 0.48;
    /* f0 tracks the tract loosely -- a big tube usually comes with long folds --
       but not rigidly, because the mismatches are where the memorable people
       are. 78Hz is a very low man, 300Hz is a small child. */
    var f0 = Math.round((250 / tract) * (0.62 + r() * 0.72));
    f0 = Math.max(78, Math.min(300, f0));
    return {
      seed: String(seed),
      f0: f0,
      tract: +tract.toFixed(3),
      rate: +(7.5 + r() * 7.5).toFixed(2),      /* letters per second */
      wave: ['sawtooth', 'square', 'triangle'][(r() * 3) | 0],
      gruff: +(r() * 0.55).toFixed(3),          /* breath mixed into the buzz */
      vib: +(r() * 5.5).toFixed(2),             /* Hz of wobble */
      vibA: +(0.004 + r() * 0.022).toFixed(4),  /* how deep the wobble goes */
      tilt: +(0.55 + r() * 0.9).toFixed(3),     /* bright vs dark overall */
      drop: +(0.10 + r() * 0.22).toFixed(3)     /* how hard the pitch declines */
    };
  }

  function serialize(v) {
    return 'f0=' + v.f0 + ' tract=' + v.tract + ' rate=' + v.rate +
           ' wave=' + v.wave + ' gruff=' + v.gruff + ' vib=' + v.vib +
           ' vibA=' + v.vibA + ' tilt=' + v.tilt + ' drop=' + v.drop;
  }

  /* ---- one blip: either a vowel-shaped buzz or an unvoiced hiss --------- */
  function blip(AC, dest, v, colour, t0, dur, f0, amp, noisy, rand) {
    var g = AC.createGain();
    /* THE ENVELOPE IS WHERE THE CLICKING WAS (Paolo 8/11: "I LIKE IT ALL JUST
       REMOVE THE CLICKING"). Two faults, both here, both measured offline:

       1. THE OLD RELEASE ENDED AT 0.0001 AND THEN stop() CUT THE SOURCE. That
          leaves a real step at the end of every single blip. Ramping to TRUE
          zero before the stop removes it entirely -- exponential cannot reach
          zero, so it hands over to a short linear ramp that can.
       2. AN UNVOICED BURST GOT THE SAME 6ms ATTACK AS A VOWEL. On a 40ms hiss
          that is an EDGE, and an edge on broadband noise is exactly what a
          click is. A hiss needs a shape: roughly a third of its length rising.

       Attack and release scale with the blip so a short consonant is not given
       a vowel's envelope, which was the whole mistake. */
    var atk = noisy ? Math.max(0.005, dur * 0.32) : Math.min(0.006, dur * 0.3);
    var knee = Math.max(atk + 0.002, dur * 0.88);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(amp, t0 + atk);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, amp * 0.03), t0 + knee);
    g.gain.linearRampToValueAtTime(0, t0 + dur);   /* TRUE zero before stop() */
    g.connect(dest);

    var src, i;
    if (noisy) {
      /* UNVOICED: filtered noise, no pitch. This is half of why it reads as
         speech instead of as a tune. */
      var n = Math.max(1, Math.floor(AC.sampleRate * dur));
      var buf = AC.createBuffer(1, n, AC.sampleRate);
      var d = buf.getChannelData(0);
      for (i = 0; i < n; i++) d[i] = rand() * 2 - 1;
      src = AC.createBufferSource();
      src.buffer = buf;
      var bp = AC.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = (2600 + rand() * 3200) * v.tract;
      bp.Q.value = 0.7;
      src.connect(bp); bp.connect(g);
      src.start(t0); src.stop(t0 + dur);
      return;
    }

    /* VOICED: a buzzy source through F1/F2/F3. The formants ARE the vowel. */
    var F = VOWELS[colour] || VOWELS.V;
    src = AC.createOscillator();
    src.type = v.wave;
    src.frequency.setValueAtTime(f0, t0);
    if (v.vib > 0.1) {
      /* the wobble is a real oscillator, not a delay: SCREECH LAW */
      var lfo = AC.createOscillator(), lg = AC.createGain();
      lfo.frequency.value = v.vib;
      lg.gain.value = f0 * v.vibA;
      lfo.connect(lg); lg.connect(src.frequency);
      lfo.start(t0); lfo.stop(t0 + dur);
    }
    var sum = AC.createGain(); sum.gain.value = 1;
    for (i = 0; i < 3; i++) {
      var bq = AC.createBiquadFilter();
      bq.type = 'bandpass';
      bq.frequency.value = F[i] * v.tract;
      bq.Q.value = [7, 9, 11][i];
      var fg = AC.createGain();
      fg.gain.value = [1, 0.62 * v.tilt, 0.28 * v.tilt][i];
      src.connect(bq); bq.connect(fg); fg.connect(sum);
    }
    sum.connect(g);
    if (v.gruff > 0.02) {
      /* breath ON TOP of the buzz, never instead of it */
      var nn = Math.max(1, Math.floor(AC.sampleRate * dur));
      var nb = AC.createBuffer(1, nn, AC.sampleRate);
      var nd = nb.getChannelData(0);
      for (i = 0; i < nn; i++) nd[i] = rand() * 2 - 1;
      var ns = AC.createBufferSource(); ns.buffer = nb;
      var nf = AC.createBiquadFilter();
      nf.type = 'bandpass';
      nf.frequency.value = F[1] * v.tract;
      nf.Q.value = 1.2;
      var ng = AC.createGain(); ng.gain.value = v.gruff * 0.25;
      ns.connect(nf); nf.connect(ng); ng.connect(g);
      ns.start(t0); ns.stop(t0 + dur);
    }
    src.start(t0); src.stop(t0 + dur);
  }

  /* ---- SAY A LINE ------------------------------------------------------
     Returns the schedule it built (count + seconds) so a gate can count what
     was actually produced instead of trusting that something happened. */
  function say(text, v, AC, dest, when) {
    text = String(text == null ? '' : text);
    var letters = text.toLowerCase().replace(/[^a-z .,!?']/g, '');
    var t0 = (when != null ? when : AC.currentTime + 0.02);
    /* SEEDED PER LINE: the same person saying the same words is identical every
       time. Recognising a person is the whole point, and Math.random would make
       that impossible. */
    var rand = rng(hash(v.seed + '|' + text));
    var step = 1 / v.rate;
    var t = t0, n = 0, i, ch;
    /* how far through the sentence, for declination */
    var speakable = letters.replace(/[^a-z]/g, '').length || 1;
    var said = 0;
    var q = /\?\s*$/.test(text);
    for (i = 0; i < letters.length; i++) {
      ch = letters[i];
      if (ch === ' ') { t += step * 0.9; continue; }          /* a real gap between words */
      if (ch === ',') { t += step * 1.4; continue; }
      if (ch === '.' || ch === '!' || ch === '?' || ch === "'") { continue; }
      if (!(ch in LETTER)) { t += step * 0.5; continue; }

      var frac = said / speakable;
      /* DECLINATION: down across the line, up at the end of a question. Every
         language does this and its absence is instantly a robot. */
      var f0 = v.f0 * (1 - v.drop * frac);
      if (q && frac > 0.72) f0 = v.f0 * (1 + 0.16 * (frac - 0.72) / 0.28);
      f0 *= 0.97 + rand() * 0.06;

      var colour = LETTER[ch];
      var noisy = (colour === null);
      /* CONSONANTS ARE SHORTER THAN VOWELS. Even timing reads as morse. */
      var isVowel = 'aeiouy'.indexOf(ch) >= 0;
      var dur = step * (isVowel ? 0.95 : (VOICED[ch] ? 0.6 : 0.42));
      /* CONSONANTS ARE QUIETER THAN VOWELS, AND MINE WERE LOUDER.
         MEASURED before the fix: vowels peaked at 0.046 and the unvoiced bursts
         at 0.115 -- the hisses were EIGHT DECIBELS ABOVE the voice. The cause is
         structural rather than careless: a vowel is squeezed through three
         narrow bandpasses (Q 7/9/11) that throw most of a sawtooth away, while a
         hiss goes through one wide one (Q 0.7) that passes nearly everything, so
         the numbers below did not mean what they looked like.
         RESEARCH: in real speech the consonant-vowel intensity ratio averages
         about -7.4 dB and the fricative-to-vowel contrast runs 7 to 14 dB, with
         sibilants strongest (-2.4 dB) and dentals weakest (-21 dB). So the
         target is roughly EIGHT DB DOWN, and the old value was about sixteen dB
         the wrong side of it. */
      var amp = (isVowel ? 0.30 : (noisy ? 0.021 : 0.20)) * (0.85 + rand() * 0.3);

      blip(AC, dest, v, colour, t, Math.max(0.012, dur), f0, amp, noisy, rand);
      t += step * (isVowel ? 1 : 0.78);
      said++; n++;
    }
    return { blips: n, seconds: +(t - t0).toFixed(3), start: t0 };
  }

  /* ---- a batch of candidate voices, cooked from an index --------------- */
  function cook(count) {
    var out = [], i;
    for (i = 0; i < (count || 8); i++) out.push(voiceOf('cand-' + i));
    return out;
  }

  root.BOH_VOICE = {
    VOWELS: VOWELS, VKEYS: VKEYS, LETTER: LETTER,
    hash: hash, rng: rng,
    voiceOf: voiceOf, serialize: serialize, say: say, cook: cook
  };
})(typeof window !== 'undefined' ? window : this);
