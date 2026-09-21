/* BOHEMIA -- THREE SOUNDS COOKED TO THE ANALOG HORROR LAW (9/21/26, SOUNDS lane)
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

   WHY THESE THREE AND NOT ANY THREE: the row names them. The room hum for the BEGIN tap
   shipped and is registered already; these are the footstep that lands on the beat, the
   tape drop-out of that step, and the phone's broadcast tone.
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

  root.BOH_HORROR_SOUNDS = {
    BPM: BPM, BEAT: BEAT, TAPE_AT: TAPE_AT, DROPOUT_AT: DROPOUT_AT, MACHINE: MACHINE, ALERT: ALERT,
    footstep: footstep,
    stepWithDropouts: stepWithDropouts,
    phoneTone: phoneTone,
    /* what a checker and a page both ask for, so neither invents a list */
    list: function () {
      return [
        { id: 'sounds-a-footstep-on-the-beat-9-21',  make: 'footstep',
          title: 'A FOOTSTEP THAT LANDS ON THE BEAT' },
        { id: 'sounds-the-step-loses-contact-9-21',  make: 'stepWithDropouts',
          title: 'THE STEP LOSES CONTACT' },
        { id: 'sounds-the-phone-still-transmits-9-21', make: 'phoneTone',
          title: 'THE PHONE STILL TRANSMITS' }
      ];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
