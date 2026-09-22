/* BOHEMIA -- SEVEN SOUNDS COOKED TO THE ANALOG HORROR LAW (9/21 and 9/22/26, SOUNDS lane)
   Row [cook sounds], rule 22 (Paolo 9/21): "I'll enter the sound chat and it's not even
   making fucking sounds... I need to be seeing them cooking up more, every time."

   ONE COPY, READ BY EVERYBODY. The vote page he plays these on and the gate that checks
   them both load THIS FILE. Nothing re-types a number. That is not tidiness: the round
   before this, a second copy of the footstep bank sat in the alpha with a comment inside
   its JSON, the parse threw into an empty catch, and every footstep in the game was
   silent for days. Two copies of one truth is how one of them rots unseen.

   THE LAW THESE ARE COOKED TO is this lane's own school page, ten rules a sound obeys,
   records/BOHEMIA_WHAT_ANALOG_HORROR_SOUNDS_LIKE_9_21_26.md. Every number below is a
   real machine's published limit or a number the game already owns. Rule 20(b) is
   obeyed: no series, channel or film is named anywhere.

   AND ONE OF THEM IS TIMED TO ANOTHER LANE'S WORK, NOT TO A GUESS. ANIMATION's TAPE walk
   (9/21) holds the ground on the lot he left for 55% of the beat then drops it through
   two stations: TAPE_STATIONS = [0.00, 0.55, 0.78] and the beat lands him at 1.00. The
   drop-out sound below fires at those three instants, read from that same list of
   fractions, so if ANIMATION moves a station the sound follows it.

   WHY THESE AND NOT ANY OTHERS: the row names them, all eight, four per round. The room hum
   for the BEGIN tap shipped and is registered on its own. Round one of this row cooked the
   footstep that lands on the beat, the tape drop-out of that step, and the phone's broadcast
   tone. Round two cooked a song through the dead speaker, the fold, the fight's cloud and
   the door.
   AND THREE OF THE SEVEN ARE TIMED OR TUNED TO SOMEBODY ELSE'S NUMBER RATHER THAN TO MINE:
   the step's drop-outs read ANIMATION's ground stations, the cloud reads the city weather
   module's own CLOUD_MULT, and the fold's hum is the same 60 Hz mains the shipped room uses.
   A sound that invents its own version of a number the game already has is a second copy of
   one truth, which is the bug that silenced every footstep in this game for days.
*/
(function (root) {
  'use strict';

  var BPM = 120;                 /* the 120 BPM law. Not a choice. */
  var BEAT = 60 / BPM;           /* 0.5 s */

  /* ANIMATION's own stations, copied as FRACTIONS OF A BEAT and named as theirs.
     slices/BOHEMIA_CITY_WORLD.html, TAPE_STATIONS, 9/21. The ground moves at each of
     these and again when the beat lands, so there are THREE moves in a step. */
  var TAPE_AT = [0.55, 0.78, 1.00];
  /* AND ONLY THE FIRST TWO ARE DROP-OUTS, WHICH MEASURING TAUGHT ME. The station at
     1.00 is not a lost frame, it is the beat LANDING him on the next lot, and the
     sound of that is the next footstep. My first cut put a drop-out there too: it sat
     at the very end of the buffer with nothing left to dive into, so its depth came
     back null. A reading of null is the instrument saying the idea was wrong. */
  var DROPOUT_AT = TAPE_AT.filter(function (x) { return x < 1; });

  /* ---- THE BANDS, AND EACH ONE NAMES ITS MACHINE (school rule 4) --------------
     A band is only right if it is narrow TO SOMETHING. The shelf this lane measured
     was narrow to nothing: 61 of 65 sounds stopped under 5 kHz, all the same way,
     so the narrowness carried no information. */
  var MACHINE = {
    /* heard with your own ears in the open air. DIRECTION's bible rule 8: tape damage
       lives only inside in-world speakers, and the lens is an eye. So a footfall is
       NOT band-limited by a recorder; what limits it is the ground and the air. */
    /* *** AND 'EAR' DELIBERATELY CARRIES NO NUMBER ANY MORE, because a declared corner
       that lives apart from the recipe is a SECOND COPY OF ONE TRUTH, which is the exact
       failure that silenced every footstep in the game the round before this. It said
       12 kHz while the recipe built 5.8 kHz, so the sound "broke" a rule it had never
       been built to, and I filtered a real sound twice trying to satisfy a number in a
       table. A SOUND HEARD DIRECTLY DECLARES THE BAND IT WAS ACTUALLY BUILT WITH, and
       the recipe hands that back. *** */
    EAR:   { lo: 180, hi: null, why: 'heard directly, so its band is whatever the recipe built: the ground and the air, not gear' },
    /* an AM broadcast: 10 kHz channel spacing leaves 5 kHz of audio, which is exactly
       why a transmitted voice sounds boxed in. */
    AM:    { lo: 100, hi: 5000,  why: 'an AM broadcast, 10 kHz spacing leaves 5 kHz of audio' }
  };

  /* ---- THE EMERGENCY ATTENTION SIGNAL, AND IT IS A REAL PUBLISHED PAIR ---------
     Two tones sounded together, 853 Hz and 960 Hz. They are 107 Hz apart, which is
     why the pair grates instead of soothing: the beat between them is audible and it
     never resolves. That is a DEAD INSTITUTION'S signal, which is rule 20's whole
     premise, and it is a technical standard rather than anybody's media, so citing
     the numbers adds no reference game. */
  var ALERT = { a: 853, b: 960 };

  /* ==== SMALL HONEST HELPERS =================================================== */
  function noiseInto(d, n, amp, seed) {
    /* deterministic noise, so a gate measuring this twice gets the same buffer and a
       threshold cannot be measuring the dice */
    var s = seed || 1, i;
    for (i = 0; i < n; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      d[i] += ((s / 0x7fffffff) * 2 - 1) * amp;
    }
  }
  function onePoleLow(d, n, hz, sr) {
    var a = Math.exp(-2 * Math.PI * hz / sr), y = 0, i;
    for (i = 0; i < n; i++) { y = (1 - a) * d[i] + a * y; d[i] = y; }
  }
  function onePoleHigh(d, n, hz, sr) {
    var a = Math.exp(-2 * Math.PI * hz / sr), y = 0, p = 0, i, x;
    for (i = 0; i < n; i++) { x = d[i]; y = a * (y + x - p); p = x; d[i] = y; }
  }
  function normalise(d, n, to) {
    var pk = 0, i;
    for (i = 0; i < n; i++) { var v = Math.abs(d[i]); if (v > pk) pk = v; }
    if (pk > 0) for (i = 0; i < n; i++) d[i] = d[i] / pk * (to == null ? 1 : to);
    return pk;
  }

  /* *** ONE BAND-LIMITER, USED BY EVERY RECIPE, BECAUSE I MADE THE SAME MISTAKE TWICE IN
     TWO DIFFERENT FUNCTIONS. A single one-pole is 6 dB an octave, which does not stop a
     band, it leans on it: the footstep left 6.2% of its energy above its declared corner,
     I fixed that one function, and the phone's carrier was STILL reading all the way to
     Nyquist against a declared 5 kHz. A FIX APPLIED IN ONE PLACE WHEN THE MISTAKE LIVES
     IN THREE IS NOT A FIX, IT IS A HEAD START ON THE NEXT BUG.
     `corner` is the corner a person means. The per-pole corner is DERIVED from it, since
     cascading N identical one-poles moves the combined -3 dB point to
     fc*sqrt(2^(1/N)-1) -- which is what caught me out the second time, when three poles
     at 2,600 gave a real corner near 1.3 kHz and filtered the life out of the sound. */
  function bandTo(d, n, lo, corner, sr, poles) {
    var P = poles || 2;
    var perPole = corner / Math.sqrt(Math.pow(2, 1 / P) - 1);
    for (var q = 0; q < P; q++) onePoleLow(d, n, perPole, sr);
    if (lo) onePoleHigh(d, n, lo, sr);
    return { poles: P, perPoleHz: Math.round(perPole), corner: corner };
  }

  /* ==== 1. A FOOTSTEP THAT LANDS ON THE BEAT =================================== */
  /* WHY THIS IS A COOK AND NOT A TWEAK. Measured on the shipped shelf: 51 of 65 sounds
     read as near-pure tones (spectral flatness under 0.01) and the footsteps are among
     them. A real footfall is not a tone at all, it is a broadband transient with a
     little body under it. So this is noise-first, which is also school rule 3: the hiss
     end of the band is the end this game has nothing in.
     AND IT LANDS ON THE BEAT, which is the row's actual ask: the attack is 3 ms, so the
     loudest instant is ON t0 rather than smeared after it. The fight grades a press
     PERFECT inside 55 ms, so a footstep whose peak arrives 40 ms late is audibly late
     against the one clock this whole game is quantised to. */
  function footstep(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var dur = 0.18;                        /* shorter than half a beat: it cannot smear */
    var n = Math.round(sr * dur);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* the scuff: broadband, and the ground decides how bright it is.
       `bright` IS THE TOP CORNER WE WANT, not a filter coefficient. */
    var bright = opts.bright == null ? 4500 : opts.bright;   /* dirt is dull, concrete is bright */
    var scuff = new Float32Array(n);
    noiseInto(scuff, n, 1, 20260921);
    /* TWO POLES, AND THE CORNER IS DERIVED RATHER THAN TYPED, BECAUSE I GOT THIS WRONG
       TWICE IN A ROW IN OPPOSITE DIRECTIONS.
       CUT ONE, one pole at 2600: only 6 dB an octave, so 6.2% of the energy still sat
       ABOVE the declared 12 kHz corner. It broke school rule 4 while claiming to obey it.
       CUT TWO, three poles at 2600: the skirt was steep and I FORGOT THAT CASCADING
       MOVES THE CORNER DOWN. The combined -3 dB point of N identical one-poles is
       fc*sqrt(2^(1/N)-1), which for three poles is 0.51*fc, so the real corner fell to
       about 1.3 kHz. Measured, the sound's flatness collapsed from 0.253 to 0.0095 and
       its top corner from 4,867 Hz to 1,314 Hz: I had turned it back into the near-tone
       the whole cook exists to replace, while the band claim went green. A FIX THAT
       PASSES THE CHECK BY DESTROYING THE THING BEING CHECKED IS NOT A FIX.
       SO THE CORNER IS COMPUTED FROM THE ONE WE ASKED FOR, by that same formula, and
       the number in the recipe is the number a person means. */
    var band = bandTo(scuff, n, 180, bright, sr, 2);

    /* the body: one short low thump, the weight going through the sole */
    var f0 = opts.body == null ? 96 : opts.body, ph = 0;
    for (i = 0; i < n; i++) {
      var u = i / n;
      /* A 3 ms ATTACK. This is the number the row turns on: the peak is on the beat. */
      var atk = 1 - Math.exp(-i / (sr * 0.003));
      var body = Math.sin(ph) * Math.pow(1 - u, 7) * 0.55;
      ph += 2 * Math.PI * (f0 * (1 - 0.35 * u)) / sr;
      d[i] = atk * (scuff[i] * Math.pow(1 - u, 3.2) * 0.85 + body);
    }
    normalise(d, n, 0.9);
    return {
      buffer: buf,
      /* THE BAND IT WAS BUILT WITH IS THE BAND IT DECLARES. One number, one place. */
      machine: { lo: 180, hi: bright, why: MACHINE.EAR.why },
      poles: band.poles, perPoleHz: band.perPoleHz,
      attackSeconds: 0.003,
      seconds: dur,
      why: 'a broadband footfall with a 3 ms attack, so its loudest instant is ON the beat'
    };
  }

  /* ==== 2. THE TAPE DROP-OUT OF THE STEP ======================================= */
  /* SCHOOL RULE 6, WITH ITS NUMBERS: a drop-out is oxide losing contact with the head.
     It lasts 8 to 60 ms, it DIVES 6 to 20 dB rather than gating to zero, and because
     contact loss costs the short wavelengths first THE HIGH END GOES BEFORE THE LOW.
     A sound that snaps to silence is a bug; one that ducks and goes dull is the genre.
     TIMED TO ANIMATION'S GROUND, NOT TO TASTE: one dive per station, so what he hears
     is the same skip he sees. The step is drawn as a held frame then two dropped ones;
     this is that, in the ear. */
  function stepWithDropouts(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var n = Math.round(sr * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);

    /* the bed this eats into: the room, quiet, so there is something to lose.
       School rule 1: never digital zero, and rule 7: a silence keeps its carrier. */
    noiseInto(d, n, 0.5, 97);
    bandTo(d, n, 140, (opts.bright == null ? 4500 : opts.bright), sr, 2);
    var i, k;
    for (i = 0; i < n; i++) d[i] *= 0.22;

    /* the footfall itself, printed at t0 */
    var fs = footstep(ctx, opts).buffer.getChannelData(0);
    for (i = 0; i < fs.length && i < n; i++) d[i] += fs[i] * 0.85;

    /* AND THE DIVES. depth and length are inside the rule's own range, and the top
       corner drops with the level because that is what losing contact does. */
    var DEPTH_DB = opts.depthDb == null ? 14 : opts.depthDb;   /* rule 6: 6 to 20 dB */
    var MS = opts.dropMs == null ? 34 : opts.dropMs;           /* rule 6: 8 to 60 ms */
    var floorGain = Math.pow(10, -DEPTH_DB / 20);
    var events = [];
    for (k = 0; k < DROPOUT_AT.length; k++) {
      var at = Math.round(DROPOUT_AT[k] * n);
      var len = Math.round(sr * MS / 1000);
      var seg = new Float32Array(len);
      var j;
      for (j = 0; j < len && at + j < n; j++) seg[j] = d[at + j];
      /* dull it: the high end goes first, so the segment gets its own low-pass */
      onePoleLow(seg, len, 900, sr);
      for (j = 0; j < len && at + j < n; j++) {
        var u2 = j / len;
        /* in fast, out slow, and NEVER to zero */
        var g = (u2 < 0.25)
          ? (1 - (1 - floorGain) * (u2 / 0.25))
          : (floorGain + (1 - floorGain) * Math.pow((u2 - 0.25) / 0.75, 1.6));
        d[at + j] = seg[j] * g + d[at + j] * 0.0;
      }
      events.push({ atBeatFraction: DROPOUT_AT[k], atSeconds: +(DROPOUT_AT[k] * beat).toFixed(4) });
    }
    normalise(d, n, 0.9);
    return {
      buffer: buf, machine: { lo: 180, hi: (opts.bright == null ? 4500 : opts.bright), why: MACHINE.EAR.why }, seconds: beat,
      dropouts: events, depthDb: DEPTH_DB, dropMs: MS, floorGain: floorGain,
      stations: TAPE_AT.slice(), dropoutStations: DROPOUT_AT.slice(),
      why: 'the same step, losing contact at ANIMATION\'s three ground stations, dull before quiet, never silent'
    };
  }

  /* ==== 3. THE PHONE'S BROADCAST TONE ========================================== */
  /* THE PHONE IS THE ONE PLACE RULE 19 LEAVES OPEN FOR A SPEAKER WITH NO FACE, so it
     is the one place in this game where a transmitted sound is honest. School rule 4
     gives it the AM band; rule 9 says the voice is too even; rule 7 says the silence
     keeps its carrier, so the hiss does not stop when the tone does.
     TWO TONES, 853 and 960 Hz, sounded together: a real attention signal's published
     pair, 107 Hz apart, so they beat against each other and never resolve. */
  function phoneTone(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beats = opts.beats == null ? 3 : opts.beats;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var n = Math.round(sr * beats * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* THE CARRIER FIRST, and it outlives the tone. */
    noiseInto(d, n, 0.5, 4242);
    /* FOUR POLES HERE, AND THE REASON IS PHYSICAL, NOT COSMETIC. A transmitter's band
       limit is steep BY REGULATION: it has to be, or it splatters into the next
       channel. Two poles measured only 18 dB down by Nyquist, which is inside the
       20 dB the band test allows, so the carrier truthfully read as reaching all the
       way up. The steepest filter in this file belongs on the one sound that came out
       of a licensed transmitter. */
    var pband = bandTo(d, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4);
    for (i = 0; i < n; i++) d[i] *= 0.30;

    /* the pair, ON THE BEAT for exactly one beat, then gone, carrier still running */
    var onFor = Math.round(sr * beat);
    var pa = 0, pb = 0;
    for (i = 0; i < onFor && i < n; i++) {
      /* 8 ms in and out so it does not click; an institution's tone does not thump */
      var env = Math.min(1, i / (sr * 0.008));
      var tail = Math.min(1, (onFor - i) / (sr * 0.008));
      pa += 2 * Math.PI * ALERT.a / sr;
      pb += 2 * Math.PI * ALERT.b / sr;
      d[i] += (Math.sin(pa) + Math.sin(pb)) * 0.5 * env * tail * 0.85;
    }
    /* and one drop-out in the middle of the tone, because the transmitter is old.
       Same rule 6 shape: dull, shallow, never silent. */
    var at = Math.round(onFor * 0.62), len = Math.round(sr * 0.026);
    var seg = new Float32Array(len), j;
    for (j = 0; j < len && at + j < n; j++) seg[j] = d[at + j];
    onePoleLow(seg, len, 1100, sr);
    var fg = Math.pow(10, -11 / 20);
    for (j = 0; j < len && at + j < n; j++) {
      var u = j / len;
      d[at + j] = seg[j] * (u < 0.3 ? 1 - (1 - fg) * (u / 0.3)
                                    : fg + (1 - fg) * Math.pow((u - 0.3) / 0.7, 1.5));
    }
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: MACHINE.AM, poles: pband.poles, perPoleHz: pband.perPoleHz,
      seconds: beats * beat,
      tones: [ALERT.a, ALERT.b], beatBetweenHz: ALERT.b - ALERT.a,
      toneOnForSeconds: beat, dropoutAtSeconds: +(0.62 * beat).toFixed(4),
      why: 'a dead institution\'s two-tone signal through an AM band, over a carrier that does not stop'
    };
  }

  /* ==== 4. A SONG THROUGH THE DEAD SPEAKER ======================================
     THIS IS THE ANSWER TO HIS OWN SOUND RULING BEING AMENDED, MADE AUDIBLE. Rule 20(c)
     (Paolo 9/20) put analog horror ahead of the FFX sound reference and left the manager's
     default as "a warm melody heard through a dead broadcast". That sentence has been on
     the board for two rounds as words. Here it is as two buffers he can A/B: the SAME warm
     phrase clean, and the same phrase arriving through the transmitter.
     WHAT SURVIVES OF THE OLD ANCHOR IS THE TUNE. His own law says what people loved was
     the patience, the bass under it and the late beat. None of those are touched: the
     phrase is unhurried, it has a bass note under it, and it is the ROOM IT WAS RECORDED
     IN that changes. Nothing about the melody is band-limited away that a real AM
     transmitter would not take. */
  function songThroughSpeaker(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var dry = !!opts.dry;                    /* the A side: no transmitter at all */
    var beats = opts.beats == null ? 8 : opts.beats;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var n = Math.round(sr * beats * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i, k;

    /* A PATIENT PHRASE, and the intervals are a minor pentatonic so it cannot read as
       cheerful: root, minor third, fourth, fifth, minor seventh. No major third anywhere,
       which is also this lane's own sting rule (no thirds that name a key).
       One note per beat, held almost the whole beat: rule 20 says stillness is long. */
    var root = opts.root == null ? 174.6 : opts.root;      /* F3, low and warm */
    var semis = [0, 3, 5, 7, 10, 7, 5, 3];
    var hz = function (st) { return root * Math.pow(2, st / 12); };

    for (k = 0; k < beats; k++) {
      var f = hz(semis[k % semis.length]);
      var at = Math.round(k * beat * sr);
      var len = Math.round(beat * sr * 0.92);
      var ph = 0, phb = 0;
      for (i = 0; i < len && at + i < n; i++) {
        var u = i / len;
        /* a plucked, patient envelope: quick in, long out, never a pad */
        var env = (1 - Math.exp(-i / (sr * 0.012))) * Math.pow(1 - u, 1.7);
        ph += 2 * Math.PI * f / sr;
        /* THE BASS UNDER IT, which his law names as one of the three things people
           loved: the root an octave down, quieter, holding through. */
        phb += 2 * Math.PI * (root / 2) / sr;
        d[at + i] += Math.sin(ph) * env * 0.5
                   + Math.sin(ph * 2) * env * 0.12          /* one octave of body */
                   + Math.sin(phb) * Math.pow(1 - (at + i) / n, 0.8) * 0.16;
      }
    }

    if (dry) { normalise(d, n, 0.85);
      return { buffer: buf, machine: { lo: 40, hi: 12000, why: 'no transmitter: the phrase as played' },
               seconds: beats * beat, dry: true, root: root, semitones: semis.slice(),
               why: 'the warm phrase with nothing in front of it, the A side of the A/B' }; }

    /* ---- AND NOW THE TRANSMITTER, which is the whole point --------------------
       THE BAND IS THE MACHINE (school rule 4): 100 Hz to 5 kHz, an AM broadcast, four
       cascaded poles because a licensed band limit is steep or it splatters. */
    bandTo(d, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4);

    /* THE HISS IT ARRIVES OVER (school rule 3), and it starts before the music and does
       not stop after it, because the transmitter is on and the song is only content
       (school rule 7). */
    var hiss = new Float32Array(n);
    noiseInto(hiss, n, 1, 77713);
    bandTo(hiss, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4);
    for (i = 0; i < n; i++) d[i] += hiss[i] * 0.16;

    /* TWO DROP-OUTS, because a dead broadcast is not a clean one. Same rule 6 shape as
       the step: dull before quiet, inside 8 to 60 ms, never silent. Placed off the beat
       on purpose so they read as the transmitter failing rather than as rhythm. */
    var outs = [0.41, 0.73];
    var events = [];
    for (k = 0; k < outs.length; k++) {
      var a0 = Math.round(outs[k] * n), L = Math.round(sr * 0.042);
      var seg = new Float32Array(L), j;
      for (j = 0; j < L && a0 + j < n; j++) seg[j] = d[a0 + j];
      onePoleLow(seg, L, 800, sr);
      var fg = Math.pow(10, -13 / 20);
      for (j = 0; j < L && a0 + j < n; j++) {
        var uu = j / L;
        d[a0 + j] = seg[j] * (uu < 0.22 ? 1 - (1 - fg) * (uu / 0.22)
                                        : fg + (1 - fg) * Math.pow((uu - 0.22) / 0.78, 1.5));
      }
      events.push({ atSeconds: +(outs[k] * beats * beat).toFixed(3), ms: 42, depthDb: 13 });
    }
    normalise(d, n, 0.85);
    return { buffer: buf, machine: MACHINE.AM, seconds: beats * beat, dry: false,
             root: root, semitones: semis.slice(), dropouts: events,
             why: 'the same warm phrase arriving through a dead broadcast: AM band, hiss under it, and it drops out twice' };
  }

  /* ==== 4b. WOW AND FLUTTER, THE ONE RULE STILL COMPLETELY UNMET ==================
     SCHOOL RULE 5: the pitch is not stable, because the motor is not stable. Tape wow is
     slow pitch drift, 0.5 to 6 Hz; a healthy consumer cassette runs 0.1% to 0.3%
     wow-and-flutter and a worn one far more. A digital oscillator is exact forever, and
     EXACT FOREVER IS THE SINGLE CLEAREST TELL THAT A SOUND CAME OUT OF A FORMULA.
     This lane's own scorecard had rule 5 as UNMET AND UNTESTED across all 65 shipped
     sounds: 162 detune calls exist in the build and not one of them is a slow wobble.

     HOW: the buffer is re-read at a rate that breathes, which is what a slipping capstan
     actually does to a tape. Nothing is pitch-shifted by a formula on top; the playback
     position itself moves unevenly, so a held note really does sag and recover.
     AND THE 120 BPM LAW IS NOT TOUCHED. The wobble is inside the voice's own pitch, never
     in WHEN it plays: the buffer is the same length in and out, and a note that started on
     the beat still starts on the beat. That is written into rule 5 itself and it is the
     reason this is safe to do to a song at all. */
  function wowFlutter(ctx, src, opts) {
    opts = opts || {};
    var depth = opts.depth == null ? 0.0035 : opts.depth;   /* 0.35%: a tired deck, inside rule 5 */
    var rate  = opts.rate  == null ? 1.4    : opts.rate;    /* Hz, the slow end: this is WOW */
    var sr = ctx.sampleRate;
    var n = src.length;
    var out = ctx.createBuffer(1, n, sr);
    var d = out.getChannelData(0);
    /* the read head's position, integrated so the rate change is smooth and the total
       length is preserved to within a sample */
    var pos = 0, i;
    for (i = 0; i < n; i++) {
      var t = i / sr;
      var r = 1 + depth * Math.sin(2 * Math.PI * rate * t);
      /* linear interpolation between neighbouring samples: a real head reads between them */
      var i0 = Math.floor(pos), f = pos - i0;
      var a = (i0 >= 0 && i0 < n) ? src[i0] : 0;
      var b = (i0 + 1 >= 0 && i0 + 1 < n) ? src[i0 + 1] : 0;
      d[i] = a + (b - a) * f;
      pos += r;
      if (pos > n - 2) pos = n - 2;
    }
    return { buffer: out, depth: depth, rate: rate,
             why: 'the read head breathes: 0.35% at 1.4 Hz, inside rule 5\'s 0.15 to 0.6% and 0.5 to 6 Hz' };
  }

  /* A SONG OFF A SLIPPING TAPE. The same phrase, the same transmitter, and now the machine
     playing it is not holding speed. This is the sound the row's own "a song through the
     dead speaker" becomes once rule 5 is obeyed rather than skipped. */
  function songOnTape(ctx, opts) {
    opts = opts || {};
    var base = songThroughSpeaker(ctx, opts);
    var w = wowFlutter(ctx, base.buffer.getChannelData(0), opts);
    return { buffer: w.buffer, machine: base.machine, seconds: base.seconds,
             root: base.root, semitones: base.semitones, dropouts: base.dropouts,
             wowDepth: w.depth, wowRateHz: w.rate,
             why: 'the warm phrase, through the dead broadcast, on a deck that is not holding speed' };
  }

  /* A LONG STEADY TONE, WOBBLED, FOR MEASUREMENT ONLY, AND SAID SO OUT LOUD.
     Wow is a property of a pitch over TIME, so measuring it needs a note long enough to
     contain several cycles of the wobble: at 1.4 Hz that is seconds, and the song's notes
     are 460 ms each. A test tone is the honest way to measure the modulation itself, and
     the gate ALSO checks that the song is not perfectly steady, so neither claim stands on
     its own. THE GAME NEVER PLAYS THIS. */
  function wowProbe(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate, secs = opts.secs == null ? 4 : opts.secs;
    var n = Math.round(sr * secs);
    var tmp = new Float32Array(n), ph = 0, i;
    var f = opts.hz == null ? 440 : opts.hz;
    for (i = 0; i < n; i++) { ph += 2 * Math.PI * f / sr; tmp[i] = Math.sin(ph) * 0.8; }
    var w = wowFlutter(ctx, tmp, opts);
    return { buffer: w.buffer, machine: { lo: 40, hi: 12000, why: 'a test tone, not a game sound' },
             seconds: secs, toneHz: f, wowDepth: w.depth, wowRateHz: w.rate, probe: true,
             why: 'a steady 440 Hz tone put through the same slipping head, so the wobble itself can be measured' };
  }

  /* ==== 5. THE FOLD ==============================================================
     THE GENERATION PASSING, which is the largest single moment this game has: a dynast
     dies and the line advances (laws/BOHEMIA_ADDENDUM_COLLAPSE_ORIGIN_AND_DEATH_MODEL,
     "THE FOLD, the generational dynasty structure across the 100-year arc").
     AND THE HORROR IS THAT THE WORLD DOES NOT MARK IT. Everything the person was making
     noise with stops. What does NOT stop is the grid: the 60 Hz mains hum carries on at
     exactly the same pitch and the same level, indifferent, because a dead man's house is
     still connected. That is school rule 7 used for the one thing it was made for, a
     silence that is audibly switched ON, and it needs no new material at all.
     NO STING, NO SWELL, NOTHING RISES. Rule 20: nothing jumps. */
  function theFold(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var beforeBeats = 4, holdBeats = 8, afterBeats = 4;   /* the hold is long on purpose */
    var total = (beforeBeats + holdBeats + afterBeats) * beat;
    var n = Math.round(sr * total);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* THE CARRIER, THE WHOLE WAY THROUGH, UNCHANGED. Mains and its harmonics, plus the
       room's hiss. This is the same recipe the shipped room hum uses, on purpose: it is
       literally the same house. */
    var parts = [[1, 1.00], [2, 0.42], [3, 0.18]];
    var hiss = new Float32Array(n);
    noiseInto(hiss, n, 1, 5150);
    bandTo(hiss, n, 100, 5000, sr, 2);
    for (i = 0; i < n; i++) {
      var t = i / sr, h = 0;
      for (var k2 = 0; k2 < parts.length; k2++)
        h += Math.sin(2 * Math.PI * 60 * parts[k2][0] * t) * parts[k2][1];
      d[i] = h * 0.30 + hiss[i] * 0.18;
    }

    /* WHAT THE PERSON WAS DOING, and it stops. A slow, quiet, unresolved figure over the
       first stretch, then nothing. It fades over one beat rather than cutting, because a
       cut is a sound effect and this is somebody stopping. */
    var livesFor = Math.round(beforeBeats * beat * sr);
    var fadeOver = Math.round(beat * sr);
    var ph = 0, ph2 = 0;
    for (i = 0; i < livesFor && i < n; i++) {
      var g = (i > livesFor - fadeOver) ? (livesFor - i) / fadeOver : 1;
      ph  += 2 * Math.PI * 233.1 / sr;                  /* Bb3 */
      ph2 += 2 * Math.PI * 277.2 / sr;                  /* C#4, a minor third above */
      d[i] += (Math.sin(ph) * 0.22 + Math.sin(ph2) * 0.13) * g
              * (0.55 + 0.45 * Math.sin(2 * Math.PI * 0.35 * (i / sr)));  /* breathing, slow */
    }

    normalise(d, n, 0.82);
    /* WHAT A CHECKER NEEDS TO SEE: the hold is real, and the carrier survives it. */
    return { buffer: buf, machine: { lo: 100, hi: 5000, why: 'the room, unchanged, because the grid does not care' },
             seconds: total,
             personStopsAtSeconds: +(beforeBeats * beat).toFixed(3),
             holdSeconds: +(holdBeats * beat).toFixed(3),
             carrierHz: 60,
             why: 'the person stops and the grid does not: a long hold with the mains hum running through it, and nothing rises' };
  }

  /* ==== 5b. THE ROOM HE VOTED ON, AT A LEVEL =====================================
     PAOLO 9/21, voting THE ROOM ON THE TAP up: "We can play around with this I'll let
     you know as I hear, but you gotta bro this volume has to be very, very low like very
     very very very, very, very, very low." He is judging LOUDNESS, so he needs the same
     bed at more than one level, back to back, in one tap each.

     *** THIS IS A SECOND COPY OF A RECIPE THAT SHIPS IN THE ALPHA, AND THAT IS THE BUG
     THAT SILENCED EVERY FOOTSTEP IN THIS GAME FOR DAYS. *** So it is not defended by this
     comment. Every constant below is asserted EQUAL to the alpha's ROOM by the cooked
     sounds gate, reading both files, and the gate goes red the moment either moves. A
     duplication a machine checks is a fact; a duplication a comment promises is rot
     waiting. (The right end state is the alpha importing this module; that touches a live
     system under the rule 18 hold, so it is named in the handoff, not smuggled in here.)

     THE LEVEL IS A RATIO AGAINST THE HEARTBEAT, exactly as the alpha's REL is, so the
     number on this page is the number in the game. 0.05 is what ships. */
  var ROOM_SEC = 4.0;      /* 8 beats at 120 BPM = 240 whole cycles of 60 Hz */
  var ROOM_HUM = 60;       /* North American mains, and this valley is Las Vegas */
  var ROOM_LO = 100, ROOM_HI = 5000;   /* the AM band the whole room came off */
  var ROOM_SEAM = 0.08;    /* the hiss tail blends into its head over 80 ms */
  var ROOM_PARTS = [[1, 1.00], [2, 0.42], [3, 0.18]];
  var ROOM_HUM_MIX = 0.55, ROOM_HISS_MIX = 0.30;
  var ROOM_REL_SHIPPED = 0.05;

  function roomHum(ctx, opts) {
    opts = opts || {};
    var rel = opts.rel == null ? ROOM_REL_SHIPPED : opts.rel;
    var sr = ctx.sampleRate, n = Math.round(sr * ROOM_SEC);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var seam = Math.max(1, Math.round(ROOM_SEAM * sr)), i;

    /* the hiss first, into its own pass, so the seam blend cannot touch the hum's phase */
    var hiss = new Float32Array(n + seam);
    noiseInto(hiss, hiss.length, 1, 6060);          /* seeded: a checker must repeat */
    for (i = 0; i < seam; i++) {
      var u = i / seam;
      hiss[i] = hiss[i] * u + hiss[n + i] * (1 - u);
    }
    for (i = 0; i < n; i++) {
      var t = i / sr, h = 0;
      for (var k = 0; k < ROOM_PARTS.length; k++)
        h += Math.sin(2 * Math.PI * ROOM_HUM * ROOM_PARTS[k][0] * t) * ROOM_PARTS[k][1];
      d[i] = h * ROOM_HUM_MIX + hiss[i] * ROOM_HISS_MIX;
    }
    bandTo(d, n, ROOM_LO, ROOM_HI, sr, 2);
    normalise(d, n, 1);                              /* peak 1, so rel is the only level */

    /* AND THEN THE LEVEL, so what he hears is the ratio and not a normalised bed.
       The heartbeat's own measured rms is the reference the alpha uses; it is carried
       here as a number the gate checks against the alpha, not as a guess. */
    var ref = opts.pulseRms == null ? 0.0035743714784863784 : opts.pulseRms;
    var q = 0;
    for (i = 0; i < n; i++) q += d[i] * d[i];
    var myRms = Math.sqrt(q / n);
    var g = myRms > 0 ? (ref * rel) / myRms : 0;
    for (i = 0; i < n; i++) d[i] *= g;

    return { buffer: buf, machine: { lo: ROOM_LO, hi: ROOM_HI, why: 'an AM broadcast band, the same transmitter the music came off' },
             seconds: ROOM_SEC, rel: rel, gain: g,
             dBUnderBeat: +(20 * Math.log10(rel)).toFixed(1),
             loops: true, hum: ROOM_HUM, cycles60: ROOM_SEC * ROOM_HUM,
             why: 'the room the loading sits in, at ' + (20 * Math.log10(rel)).toFixed(1) + ' dB under the heartbeat' };
  }

  /* ==== 6. THE FIGHT'S CLOUD =====================================================
     A CLOUD CROSSING THE FIGHT, which COMBAT owns as a picture (rule 17, "the cloud
     passes across the turn as he ruled"). A cloud makes no sound, so the honest question
     is what a cloud DOES to the sound of a place, and the answer is in the city's own
     weather module: CLOUD_MULT = [0.86, 0.88, 0.94] and its comment says it COOLS AS IT
     DIMS. Cooling light is the eye's version of losing the top of the band.
     SO THE CLOUD IS A ROLL-OFF THAT WALKS ACROSS THE BED AND WALKS BACK. Nothing is
     added, nothing swells, no whoosh: a whoosh would be a sound effect pretending to be
     weather. It is the same mechanism as a tape drop-out (the top goes first) used for
     light instead of for oxide, which is why it belongs in this file and not in a new one. */
  function fightCloud(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var beats = opts.beats == null ? 8 : opts.beats;      /* a turn's worth */
    var n = Math.round(sr * beats * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* the fight's bed: the same room, a little more air in it */
    noiseInto(d, n, 1, 8611);
    bandTo(d, n, 120, 6000, sr, 2);
    var parts = [[1, 1.00], [2, 0.40]];
    for (i = 0; i < n; i++) {
      var t = i / sr, h = 0;
      for (var k = 0; k < parts.length; k++)
        h += Math.sin(2 * Math.PI * 60 * parts[k][0] * t) * parts[k][1];
      d[i] = d[i] * 0.30 + h * 0.16;
    }

    /* THE SHADOW WALKS ACROSS. A time-varying low-pass: the corner falls to the cloud's
       own darkest multiple and comes back. The three multiples are the city's, not mine. */
    var MULT = opts.mult || [0.86, 0.88, 0.94];
    var darkest = Math.min.apply(null, MULT);             /* 0.86 */
    var openHz = 6000, shutHz = Math.round(openHz * darkest * darkest);  /* squared: light dims twice over */
    var y = 0, prev = 0;
    var curve = [];
    for (i = 0; i < n; i++) {
      var u = i / n;
      /* in over the first third, held across the middle, out over the last third */
      var shade = (u < 0.33) ? (u / 0.33) : (u < 0.66) ? 1 : (1 - (u - 0.66) / 0.34);
      var corner = openHz + (shutHz - openHz) * shade;
      var a = Math.exp(-2 * Math.PI * corner / sr);
      y = (1 - a) * d[i] + a * y;
      d[i] = y;
      if (i % Math.round(n / 8) === 0) curve.push({ atSeconds: +(i / sr).toFixed(2), cornerHz: Math.round(corner) });
    }
    normalise(d, n, 0.8);
    return { buffer: buf, machine: { lo: 120, hi: openHz, why: 'the fight\'s bed, and a cloud takes the top off it' },
             seconds: beats * beat, cloudMult: MULT.slice(),
             openHz: openHz, shutHz: shutHz, curve: curve,
             why: 'the cloud that crosses the fight, heard the only way a cloud can be: the top of the band dims and comes back' };
  }

  /* ==== 7. THE DOOR ==============================================================
     WALKING THROUGH A DOOR, and the sound of it is NOT the hinge. School rule 1 says
     there is always a room, so the real event is that ONE ROOM BECOMES ANOTHER. This
     game already has both: the outdoor bed and air_inside, approved and cooked since
     8/12. So the door is a crossfade of rooms with a latch on it, and the latch is the
     small part.
     AND THE INSIDE IS NARROWER, WHICH IS PHYSICS AND NOT TASTE: a small hard room has
     less high air in it and more low, because the far sound never arrives and the walls
     return the bottom. Measured in the declaration: outside runs to 5 kHz, inside to
     2.2 kHz, and the bottom comes up. */
  function theDoor(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var beats = opts.beats == null ? 6 : opts.beats;
    var n = Math.round(sr * beats * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    var crossAt = Math.round(n * 0.42);                   /* the latch */
    var crossOver = Math.round(sr * 0.22);                /* the swap takes a moment */

    var outside = new Float32Array(n), inside = new Float32Array(n);
    noiseInto(outside, n, 1, 3301);
    bandTo(outside, n, 100, 5000, sr, 2);
    noiseInto(inside, n, 1, 4402);
    bandTo(inside, n, 60, 2200, sr, 2);                   /* narrower, and lower */

    for (i = 0; i < n; i++) {
      var u = (i - crossAt) / crossOver;
      var w = u <= 0 ? 0 : (u >= 1 ? 1 : u * u * (3 - 2 * u));   /* smoothstep */
      /* the mains hum is in BOTH rooms and does not crossfade: it is the same house */
      var t = i / sr;
      var hum = (Math.sin(2 * Math.PI * 60 * t) + Math.sin(2 * Math.PI * 120 * t) * 0.4);
      d[i] = outside[i] * 0.26 * (1 - w) + inside[i] * 0.34 * w + hum * 0.14;
    }

    /* THE LATCH, and it is short and broadband, the only transient in the sound */
    var L = Math.round(sr * 0.05), ph = 0;
    var latch = new Float32Array(L);
    noiseInto(latch, L, 1, 9119);
    bandTo(latch, L, 400, 4200, sr, 2);
    for (i = 0; i < L && crossAt + i < n; i++) {
      var uu = i / L;
      var env = (1 - Math.exp(-i / (sr * 0.001))) * Math.pow(1 - uu, 5);
      ph += 2 * Math.PI * 320 / sr;
      d[crossAt + i] += (latch[i] * 0.8 + Math.sin(ph) * 0.2) * env * 0.55;
    }
    normalise(d, n, 0.85);
    return { buffer: buf,
             machine: { lo: 60, hi: 5000, why: 'two rooms: outside reaches 5 kHz, inside 2.2 kHz, and the hum is in both' },
             seconds: beats * beat,
             latchAtSeconds: +(crossAt / sr).toFixed(3),
             outsideHi: 5000, insideHi: 2200, crossSeconds: +(crossOver / sr).toFixed(3),
             why: 'one room becoming another, with the latch as the small part and the same mains hum on both sides' };
  }

  root.BOH_HORROR_SOUNDS = {
    BPM: BPM, BEAT: BEAT, TAPE_AT: TAPE_AT, DROPOUT_AT: DROPOUT_AT, MACHINE: MACHINE, ALERT: ALERT,
    footstep: footstep,
    stepWithDropouts: stepWithDropouts,
    phoneTone: phoneTone,
    songThroughSpeaker: songThroughSpeaker,
    roomHum: roomHum,
    ROOM: { sec: ROOM_SEC, hum: ROOM_HUM, lo: ROOM_LO, hi: ROOM_HI, seam: ROOM_SEAM,
            parts: ROOM_PARTS, humMix: ROOM_HUM_MIX, hissMix: ROOM_HISS_MIX,
            relShipped: ROOM_REL_SHIPPED },
    songOnTape: songOnTape,
    wowFlutter: wowFlutter,
    wowProbe: wowProbe,
    theFold: theFold,
    fightCloud: fightCloud,
    theDoor: theDoor,
    /* what a checker and a page both ask for, so neither invents a list */
    list: function () {
      return [
        { id: 'sounds-a-footstep-on-the-beat-9-21',  make: 'footstep',
          title: 'A FOOTSTEP THAT LANDS ON THE BEAT' },
        { id: 'sounds-the-step-loses-contact-9-21',  make: 'stepWithDropouts',
          title: 'THE STEP LOSES CONTACT' },
        { id: 'sounds-the-phone-still-transmits-9-21', make: 'phoneTone',
          title: 'THE PHONE STILL TRANSMITS' },
        { id: 'sounds-a-song-through-the-dead-speaker-9-22', make: 'songThroughSpeaker',
          title: 'A SONG THROUGH THE DEAD SPEAKER' },
        { id: 'sounds-the-fold-9-22', make: 'theFold',
          title: 'THE FOLD' },
        { id: 'sounds-the-fights-cloud-9-22', make: 'fightCloud',
          title: "THE FIGHT'S CLOUD" },
        { id: 'sounds-the-door-9-22', make: 'theDoor',
          title: 'THE DOOR' },
        { id: 'sounds-the-tape-is-slipping-9-23', make: 'songOnTape',
          title: 'THE TAPE IS SLIPPING' }
      ];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
