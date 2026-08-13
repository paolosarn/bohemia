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
      return src;
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
    return src;
  }

  /* ---- SAY A LINE ------------------------------------------------------
     Returns the schedule it built (count + seconds) so a gate can count what
     was actually produced instead of trusting that something happened. */
  /* ---- MOOD: HOW IT IS SAID, NOT JUST WHO SAYS IT (8/13) ---------------
     Every character in the game sounded exactly the same whether they were
     shouting at you or trailing off. Identity was solved; DELIVERY was not,
     and delivery is most of what makes a conversation feel like people.

     THE RESEARCH IS OLD AND IT AGREES WITH ITSELF. Scherer (1986) and the
     Juslin & Laukka meta-analysis (2003, 104 studies of vocal expression)
     both land on the same pattern: high-arousal states -- anger, fear,
     elation -- carry HIGH MEAN F0, HIGH F0 VARIABILITY, HIGH INTENSITY and
     an INCREASED SPEAKING RATE, while sadness carries reduced intensity,
     lower pitch, slower tempo and a narrow range. Fear and happiness are
     specifically marked by greater pitch variability.

     SO THE DIAL IS DIMENSIONAL, NOT A LIST OF EMOTIONS. Two axes, arousal
     and valence, which is the form the dimensional literature uses and, more
     importantly, the form that does not invent canon: naming which of
     Paolo's characters feel "contempt" would be writing his people for him.
     MECHANISM-MINE / CONTENTS-PAOLO'S -- I ship the dial, he decides who is
     angry.

     WHAT THE DEFAULT READS, when a caller passes no mood: PUNCTUATION AND
     CASE ONLY. A shout, a trail-off, a question -- marks the writers already
     type, that mean the same thing in every script ever written. It does NOT
     guess at sentiment from the words, because that is a machine deciding
     what a line MEANS, and it would be wrong in exactly the places that
     matter. Valence therefore stays 0 unless a caller states it.

     NEUTRAL IS BYTE-IDENTICAL TO BEFORE. Every scale below is 1 or 0 at
     mood zero and consumes the same random draws in the same order, so the
     six voices Paolo approved on 8/11 render exactly as he heard them. The
     gate asserts it rather than trusting it. */
  var MOOD_NEUTRAL = { arousal: 0, valence: 0 };

  function moodOf(text) {
    var s = String(text == null ? '' : text);
    var a = 0, v = 0;
    var bangs = (s.match(/!/g) || []).length;
    if (bangs >= 2) a += 0.80; else if (bangs === 1) a += 0.55;
    if (/\.\.\.|\u2026/.test(s)) a -= 0.45;          /* a trail-off is small and slow */
    if (/\?\s*$/.test(s)) a += 0.15;                 /* asking leans forward a little */
    /* SHOUTING IS TYPED IN CAPS and has been since scripts were typed. Only
       counts when the line is mostly caps: one proper noun is not a shout. */
    var caps = (s.match(/[A-Z]/g) || []).length, low = (s.match(/[a-z]/g) || []).length;
    if (caps + low >= 6 && caps / (caps + low) > 0.6) a += 0.50;
    return { arousal: clampM(a), valence: clampM(v) };
  }
  function clampM(x) { return x < -1 ? -1 : (x > 1 ? 1 : x); }

  /* the voice, bent by the mood. IDENTITY IS PRESERVED: the seed never moves,
     so a person under any mood is still recognisably that person -- which is
     the entire point of having voices at all. */
  function bend(v, m) {
    if (!m || (!m.arousal && !m.valence)) return v;
    var a = clampM(m.arousal || 0), val = clampM(m.valence || 0);
    var o = {};
    for (var k in v) if (v.hasOwnProperty(k)) o[k] = v[k];
    /* F0 in SEMITONES, because pitch is perceived in ratios. +-3 semitones at
       full arousal: audible as a different delivery, never as a different
       person. */
    o.f0 = v.f0 * Math.pow(2, (a * 3 + val * 0.6) / 12);
    o.rate = v.rate * (1 + a * 0.28);                /* faster when roused, slower when flat */
    o.drop = v.drop * (1 - val * 0.35 + a * 0.10);   /* sadness falls away harder */
    o.gruff = v.gruff * (1 - val * 0.40);            /* pleasure is a cleaner signal */
    o.tilt = v.tilt * (1 + a * 0.30);                /* high-frequency energy rises with arousal */
    return o;
  }
  function ampScaleOf(m) { return 1 + (m ? clampM(m.arousal || 0) : 0) * 0.25; }
  /* THE FRICATIVES HAVE TO COME UP TOO, and this was found by measurement, not
     by theory. Raising f0 and the formant tilt made the VOICED part brighter
     and the whole line still measured DARKER, because aroused speech is faster,
     the hiss bursts get shorter, and the blip envelope's 5 ms attack floor eats
     a short burst -- so the hiss quietened relative to the vowels and took the
     high-frequency energy down with it.
     The fix belongs in the engine, not in the ruler: high-frequency energy IS
     the cue the research names, and in real raised speech a large part of it is
     stronger fricatives. So the unvoiced share rises with arousal as well. */
  function hissScaleOf(m) { return 1 + (m ? clampM(m.arousal || 0) : 0) * 0.85; }
  /* F0 VARIABILITY is the cue Juslin & Laukka single out for fear and joy, and
     it is the one that stops a roused voice sounding merely transposed. */
  function varScaleOf(m) { return 1 + (m ? clampM(m.arousal || 0) : 0) * 0.90; }

  function say(text, v, AC, dest, when, mood) {
    text = String(text == null ? '' : text);
    var letters = text.toLowerCase().replace(/[^a-z .,!?']/g, '');
    var t0 = (when != null ? when : AC.currentTime + 0.02);
    /* SEEDED PER LINE: the same person saying the same words is identical every
       time. Recognising a person is the whole point, and Math.random would make
       that impossible. THE SEED IS THE UNBENT VOICE, so mood changes delivery
       and never identity. */
    var rand = rng(hash(v.seed + '|' + text));
    var m = (mood === undefined) ? moodOf(text) : (mood || MOOD_NEUTRAL);
    var vB = bend(v, m), aScale = ampScaleOf(m), vScale = varScaleOf(m);
    var hScale = hissScaleOf(m);
    v = vB;
    var step = 1 / v.rate;
    var t = t0, n = 0, i, ch, live = [];
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
      /* the same draw, widened or narrowed by arousal. Consuming the SAME
         random number in the same order is what keeps neutral identical. */
      f0 *= 1 + ((0.97 + rand() * 0.06) - 1) * vScale;

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
      var amp = (isVowel ? 0.30 : (noisy ? 0.021 * hScale : 0.20)) * (0.85 + rand() * 0.3) * aScale;

      var node = blip(AC, dest, v, colour, t, Math.max(0.012, dur), f0, amp, noisy, rand);
      if (node) live.push(node);
      t += step * (isVowel ? 1 : 0.78);
      said++; n++;
    }
    /* A HANDLE, so a new line can CUT the one still talking. Two people
       babbling over each other is not two people, it is a fault. */
    return { blips: n, seconds: +(t - t0).toFixed(3), start: t0, mood: m,
             stop: function(){ for (var k = 0; k < live.length; k++) {
               try { live[k].stop(); } catch (e) {} } } };
  }

  /* ---- WHICH OF HIS VOICES A PERSON HAS ------------------------------
     MECHANISM-MINE / CONTENTS-PAOLO'S, and the split matters here. The RULE --
     a person's voice is a pure function of their identity, so they sound like
     themselves forever -- is mechanism and it is the whole point of the
     feature. WHICH voices exist is HIS: he judged eight on 8/11 and kept six.
     So this maps an identity onto HIS approved set and never generates a fresh
     voice, because a fresh voice is one he has not heard.
     PEOPLE SHARING A VOICE IS CORRECT, not a shortcut. Animal Crossing runs
     hundreds of villagers off a handful of voice types; what makes someone
     recognisable is that THEIR voice never changes, not that nobody else has
     it. Assigning a specific person to a specific voice is still his ruling and
     is not made here -- this is the fallback for everyone he has not ruled on. */
  function speakerVoice(id, approved, group) {
    var pool = (approved && approved.length) ? approved : ['cand-1'];
    var k = hash('bohemia-speaker:' + String(id == null ? '' : id));
    var want = k % pool.length;
    /* A SCENE'S CAST MUST NOT SHARE A VOICE.
       Measured on the real cold open: the MOTHER and the small CHILD both
       landed on cand-1. With six voices and four family members a collision is
       close to a coin flip, and two of the four most important people in the
       game sounding identical in the demo's opening fifteen seconds is the
       worst place for it to happen.
       Sharing is correct for a CROWD -- Animal Crossing runs hundreds of
       villagers off a handful of types, and what makes somebody recognisable is
       that THEIR voice never changes, not that nobody else has it. It is wrong
       for a CAST, where the people are few, named, and on screen together.
       So a group deals without replacement: the hash still chooses, and a
       collision walks to the next free voice. Deterministic wherever
       first-appearance order is deterministic, which a scripted scene
       guarantees -- and it is NOT applied to the open world, where you meet
       people in whatever order you wander into them and an order-dependent
       voice would stop being theirs. */
    if (group && typeof group === 'object') {
      group.by = group.by || {};
      if (group.by[id] != null) return voiceOf(pool[group.by[id]]);
      var taken = {}, key;
      for (key in group.by) taken[group.by[key]] = 1;
      var pick = want, tries = 0;
      while (taken[pick] && tries < pool.length) { pick = (pick + 1) % pool.length; tries++; }
      if (taken[pick]) {
        /* HIS SIX ARE DEALT. WHEN A SCENE HAS MORE PEOPLE THAN HE HAS APPROVED
           VOICES, reusing one would put two speakers in the same room with the
           same voice -- the exact thing this whole branch exists to prevent.
           Measured 8/12: the cold open grew to forty beats and more than six
           speakers, which is precisely why he said "we may need way more
           voices". So the overflow is CAST FROM HIS ENVELOPE: still inside the
           hull his verdicts describe, still vibrato-capped, and distinct.
           The named family keep the voices he actually heard, because they are
           dealt first. */
        group.cast = group.cast || {};
        if (!group.cast[id]) group.cast[id] = castVoice('overflow:' + id);
        return group.cast[id];
      }
      group.by[id] = pick;
      return voiceOf(pool[pick]);
    }
    return voiceOf(pool[want]);
  }

  /* THE FIRST SENTENCE, WHICH IS WHAT YOU ACTUALLY HEAR SOMEONE START TO SAY.
     Animalese speaks the whole line because the TEXT SCROLLS at babble speed.
     Ours appears instantly, so babbling a twenty-word line over text he has
     already finished reading would be a drone rather than a person. A sentence
     is the natural unit -- not an arbitrary letter count -- and the cap only
     catches the runaway case. */
  function opener(text, cap) {
    text = String(text == null ? '' : text).trim();
    cap = cap || 70;
    /* KEEP TAKING SENTENCES UNTIL IT IS WORTH HEARING. One sentence alone is
       often a single word -- "Batteries." -- and one word is not somebody
       talking, it is a grunt. Sentences accumulate to a floor and then stop,
       so a short opener borrows the next clause and a long one still gets cut. */
    var parts = text.match(/[^.!?]+[.!?]?/g) || [text];
    var out = '';
    for (var pi = 0; pi < parts.length; pi++) {
      var nxt = (out + parts[pi]).trim();
      if (out && nxt.length > cap) break;
      out = nxt;
      if (out.replace(/[^a-z]/gi, '').length >= 22) break;   /* enough to hear */
    }
    out = out.trim() || text;
    if (out.length > cap) {
      out = out.slice(0, cap);
      var sp = out.lastIndexOf(' ');
      if (sp > 20) out = out.slice(0, sp);
    }
    return out;
  }

  /* ================= CASTING: UNLIMITED VOICES FROM HIS ENVELOPE =========
     Paolo 8/12: "we may need way more voices and way more sounds for the whole
     game". APPROVE UNLOCKS VOLUME is this repo's own law, and his eight verdicts
     are enough to build the volume from -- but only because of what they say.

     WHAT HIS VERDICTS ACTUALLY SAY. Comparing the six he kept against the two he
     killed, parameter by parameter, SEVEN OF EIGHT OVERLAP COMPLETELY. Pitch,
     vocal tract, rate, breath, tilt, declination, even the waveform: the killed
     voices sit inside the approved range on every one of them. Exactly one thing
     separates them cleanly, and it separates them with no overlap at all:

         VIBRATO          approved 0.05 - 0.73 Hz     killed 0.97, 1.73
         VIBRATO DEPTH    approved 0.0049 - 0.0209    killed 0.0235, 0.0254

     HE REJECTED WOBBLE. Not a pitch, not a size, not a timbre -- a WAVER. That
     is the whole of his taste that these eight can prove, so it is the whole of
     what is treated as law here, and it is a HARD CAP rather than a preference.
     Every other range below is descriptive: the hull of what he has heard and
     accepted, which is a much weaker claim and is not pretended otherwise.

     HOW MANY VOICES CAN BE DISTINCT, AND ON WHICH KNOB.
     RESEARCH: listeners' judgements of "different person" are driven most
     strongly by mean FUNDAMENTAL FREQUENCY, then by FORMANT DISPERSION (which
     indexes vocal tract length), then by voice quality / harmonic-to-noise
     ratio. So the casting spreads people across f0 first, tract second, breath
     third -- the same order the ear uses.

     AND IT QUANTISES, WHICH IS THE POINT. Sampling a continuous range gives
     pairs that are ALMOST the same, which is the worst outcome: not a shared
     voice and not a different person, just muddle. Snapping to a grid one
     semitone wide in f0 and about four percent in tract means two people are
     either the SAME voice or an audibly DIFFERENT one, never nearly. It also
     makes the count knowable instead of a hope. */
  var ENVELOPE = {
    f0:    [168, 252],       tract: [0.943, 1.225],
    rate:  [7.55, 12.35],    gruff: [0.055, 0.527],
    tilt:  [0.604, 1.426],   drop:  [0.167, 0.254],
    vib:   [0.05, 0.73],     vibA:  [0.0049, 0.0209],   /* HIS ONE HARD LAW */
    waves: ['sawtooth', 'square', 'triangle'],
    f0Step: 0.06,            /* ~a semitone: the strongest identity cue */
    tractStep: 0.04          /* formant dispersion, the second strongest */
  };

  function gridSteps(range, step) {
    return Math.max(1, Math.round(Math.log(range[1] / range[0]) / Math.log(1 + step)));
  }
  function onGrid(range, step, t) {          /* t in [0,1) -> a grid value */
    var n = gridSteps(range, step);
    var i = Math.min(n, Math.floor(t * (n + 1)));
    return range[0] * Math.pow(1 + step, i);
  }
  function lerp(range, t) { return range[0] + (range[1] - range[0]) * t; }

  /* THE COUNT, so nobody has to guess how much volume this actually is. */
  function castCount() {
    return (gridSteps(ENVELOPE.f0, ENVELOPE.f0Step) + 1)
         * (gridSteps(ENVELOPE.tract, ENVELOPE.tractStep) + 1)
         * ENVELOPE.waves.length;
  }

  /* A PERSON'S OWN VOICE, from their identity, inside what he approved.
     Every draw is decorrelated from the others: one hash per parameter, so two
     people who happen to share a pitch do not thereby share a tract as well. */
  function castVoice(id) {
    var key = 'bohemia-cast:' + String(id == null ? '' : id);
    function u(salt) { return (hash(key + '#' + salt) % 100000) / 100000; }
    var tract = onGrid(ENVELOPE.tract, ENVELOPE.tractStep, u('tract'));
    var f0 = onGrid(ENVELOPE.f0, ENVELOPE.f0Step, u('f0'));
    return {
      seed: String(id),
      f0: Math.round(f0),
      tract: +tract.toFixed(3),
      rate: +lerp(ENVELOPE.rate, u('rate')).toFixed(2),
      wave: ENVELOPE.waves[hash(key + '#wave') % ENVELOPE.waves.length],
      gruff: +lerp(ENVELOPE.gruff, u('gruff')).toFixed(3),
      /* HIS HARD CAP. Never above what he accepted -- this is the one thing the
         eight verdicts prove, and it is not sampled loosely. */
      vib: +lerp(ENVELOPE.vib, u('vib')).toFixed(2),
      vibA: +lerp(ENVELOPE.vibA, u('vibA')).toFixed(4),
      tilt: +lerp(ENVELOPE.tilt, u('tilt')).toFixed(3),
      drop: +lerp(ENVELOPE.drop, u('drop')).toFixed(3)
    };
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
    voiceOf: voiceOf, serialize: serialize, say: say, cook: cook,
    speakerVoice: speakerVoice, opener: opener,
    ENVELOPE: ENVELOPE, castVoice: castVoice, castCount: castCount,
    moodOf: moodOf, bend: bend, MOOD_NEUTRAL: MOOD_NEUTRAL
  };
})(typeof window !== 'undefined' ? window : this);
