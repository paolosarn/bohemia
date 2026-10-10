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
     *** AND THEN PAOLO KILLED THREE SOUNDS IN ONE BATCH FOR SOUNDING LIKE SAND, AND THIS
     FUNCTION WAS THE SAND. (9/24, rule 32e.) The old version DERIVED a per-pole corner
     above the number it was asked for, so the combined -3 dB landed on the corner while
     the roll-off had barely started there. Measured on white noise through an honest FFT
     band sum, with a declared 5 kHz corner:

       design                    -3 dB    energy above 5 kHz   above 10 kHz
       derived, 2 one-poles      5,383         37.9%              17.4%     <- what shipped
       derived, 4 one-poles      5,728         35.8%              14.1%
       derived, 8 one-poles      6,471         39.3%              15.8%
       one-poles AT the corner   2,231          3.4%               0.3%     <- band destroyed
       BUTTERWORTH order 8       5,001          2.6%               0.0%     <- what ships now

     *** AND THAT TABLE CORRECTS A SENTENCE I WROTE TWICE AND QUOTED THREE TIMES: "more
     poles at a derived corner makes it WORSE". It does not. Derived 2, 4 and 8 all sit
     between 35.8% and 39.3%, and the 4-pole one is the BEST of the three. The pole count
     was never the story; THE DERIVED CORNER WAS THE WHOLE STORY. The earlier reading came
     off a ruler that cascaded four one-pole high-passes at the frequency it named, which
     really turns over at 2.299 times it. A FINDING TAKEN WITH A BROKEN RULER IS NOT A
     FINDING, and this one survived three records before it got re-measured.

     *** AND "PUT THE POLES AT THE NOMINAL CORNER" WOULD HAVE BEEN THE OTHER MISTAKE. The
     row's own wording says to, and the table says what it costs: four one-poles at 5 kHz
     turn over at 2,231 Hz, which is the band destroyed and the life filtered out of the
     sound -- exactly the failure this lane already shipped once and had to revert.

     SO IT IS A REAL FILTER NOW. Cascaded biquads with Butterworth Q values, which is the
     maximally flat design: flat to the corner, the -3 dB ON the number (5,001 Hz against
     5,000 asked), then 48 dB an octave. That is also what a transmitter really has, because
     a broadcast mask is steep BY REGULATION, and it is why order 8 is the default rather
     than a compromise. THE ORDER HAS A FLOOR OF 6 because under 6 the energy test cannot
     be met (order 4 reads 6.1% against rule 4's 5%), so a caller can ask for more and
     never for less. The old `poles` argument is read as an order and clamped, so no call
     site had to change and none can set this wrong.
     THE BOTTOM END IS DELIBERATELY UNTOUCHED, one one-pole high-pass exactly as before:
     the defect measured is above the corner, and moving two ends at once would make his
     next verdict unreadable. Same reasoning that left the room's duck alone. */
  function butterQ(order) {
    var qs = [], k;
    for (k = 0; k < order / 2; k++)
      qs.push(1 / (2 * Math.cos(Math.PI * (2 * k + 1) / (2 * order))));
    return qs;
  }
  /* a biquad low-pass, the standard RBJ form: a PAIR of poles, which is what a filter
     really is, rather than a chain of one-poles pretending to be one */
  function biquadLow(d, n, hz, q, sr) {
    var w = 2 * Math.PI * hz / sr, cw = Math.cos(w), sw = Math.sin(w), al = sw / (2 * q);
    var a0 = 1 + al;
    var B0 = ((1 - cw) / 2) / a0, B1 = (1 - cw) / a0, B2 = ((1 - cw) / 2) / a0;
    var A1 = (-2 * cw) / a0, A2 = (1 - al) / a0;
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0, i, x, y;
    for (i = 0; i < n; i++) {
      x = d[i];
      y = B0 * x + B1 * x1 + B2 * x2 - A1 * y1 - A2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y; d[i] = y;
    }
  }
  function butterLow(d, n, hz, sr, order) {
    var qs = butterQ(order), k;
    for (k = 0; k < qs.length; k++) biquadLow(d, n, hz, qs[k], sr);
  }
  var BAND_ORDER_FLOOR = 6;          /* under this, rule 4's 5% cannot be met. Measured. */
  /* `band` is the ONE way to ask for anything other than the honest filter, and it exists
     for exactly two callers: a judge page that has to play the BEFORE beside the AFTER, and
     the checker. It is an argument and never module state, and a caller that passes nothing
     gets the honest band, so no existing call site changed.
       band.legacy  reproduces the OLD derived-corner chain, so the "as you heard it" side
                    of an A/B comes out of THIS function and can never drift into a second
                    copy of the recipe. Same reasoning as the song that renders its clean
                    side by switching the transmitter off rather than by keeping two tunes.
       band.hi      a different machine's corner, for asking WHICH machine this valley is
                    recorded on. */
  function bandTo(d, n, lo, corner, sr, poles, band) {
    band = band || {};
    var c = band.hi || corner;
    if (band.legacy) {
      var P = poles || 2;
      var perPole = c / Math.sqrt(Math.pow(2, 1 / P) - 1);
      for (var q = 0; q < P; q++) onePoleLow(d, n, perPole, sr);
      if (lo) onePoleHigh(d, n, lo, sr);
      return { order: P, poles: P, corner: c, cornerIsReal: false, legacy: true,
               perPoleHz: Math.round(perPole),
               why: 'THE OLD CHAIN, kept only so an A/B can play what he actually heard: '
                 + P + ' one-poles at a DERIVED ' + Math.round(perPole) + ' Hz for a '
                 + c + ' Hz band, which leaks about a third of a noise bed above it' };
    }
    var order = Math.max(BAND_ORDER_FLOOR, poles || 8);
    if (order % 2) order += 1;       /* a biquad is a pair of poles */
    butterLow(d, n, c, sr, order);
    if (lo) onePoleHigh(d, n, lo, sr);
    return { order: order, poles: order, corner: c, cornerIsReal: true, minus3Hz: c,
             why: 'a Butterworth low-pass of order ' + order + ' AT ' + c
               + ' Hz: flat to the corner, the -3 dB on the number, then '
               + (6 * order) + ' dB an octave' };
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
      bandOrder: band.order, bandCornerHz: band.corner, bandWhy: band.why,
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
      buffer: buf, machine: MACHINE.AM, bandOrder: pband.order, bandCornerHz: pband.corner,
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
    bandTo(d, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4, opts.band);

    /* THE HISS IT ARRIVES OVER (school rule 3), and it starts before the music and does
       not stop after it, because the transmitter is on and the song is only content
       (school rule 7). */
    var hiss = new Float32Array(n);
    noiseInto(hiss, n, 1, 77713);
    bandTo(hiss, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4, opts.band);
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
    /* *** AND THE END OF THE BUFFER IS FADED, BECAUSE PAOLO APPROVED THIS SOUND WITH A
       CLICK IN IT AND NOBODY HEARD IT UNTIL A RULER BUILT FOR A DIFFERENT SOUND FOUND IT
       (round [not sand], 9/27). *** The hiss runs right up to the last sample, so a
       one-shot buffer ending mid-amplitude is a discontinuity against the silence after
       it, which is a click. Measured before this fix: last sample 0.050992 against the
       sound's own biggest step of 0.1074, 47.5% of it -- not a rounding error, an audible
       edge. The same 12 ms raised cosine used nowhere near either drop-out (the later one
       sits at 2.92 s of a 4.0 s buffer, more than two seconds clear of this window), so
       the fix touches only the tail. */
    var fade = Math.min(n, Math.round(0.012 * sr));
    for (i = 0; i < fade; i++) {
      var u = i / fade;
      d[n - fade + i] *= 0.5 * (1 + Math.cos(Math.PI * u));
    }
    normalise(d, n, 0.85);
    return { buffer: buf, machine: MACHINE.AM, seconds: beats * beat, dry: false,
             root: root, semitones: semis.slice(), dropouts: events, fadeMs: fade / sr * 1000,
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

  /* ==== 7. THE FLIP: ONE ACT TO ANOTHER ==========================================
     ROW [flip sound], rule 31 (Paolo 9/23): the three acts are open at once and he FLIPS
     between them with one tap on the phone. The law's own words for what that is under the
     bible: "a phone that shows you a face that has not been born yet."

     *** FIRST, THE THING THAT DECIDES EVERYTHING ELSE: THE FLIP IS ALWAYS AVAILABLE. ***
     One tap, no place to walk to, no mode change (rule 24: same screen, same buttons, same
     UI every second). So this is not a moment, it is a sound he will hear HUNDREDS of times,
     and the failure mode is not "too quiet", it is "I am sick of it". Therefore: it fits
     inside ONE BEAT, it has no riser, no whoosh and no stinger, and it never announces
     itself. A whoosh here would be the same violation as a whoosh on the fight's cloud --
     a sound effect pretending to be a mechanism.

     REALISM FIRST, AND THE MECHANISM IS A REAL ONE. What does it really sound like to move
     between two recordings of the same place at different times? A receiver retuning. And
     the honest detail, the one that carries the whole meaning, is AGC: when a carrier drops,
     a receiver's automatic gain control winds the gain UP hunting for signal, so the gap
     between two stations is LOUDER and WIDER-BANDED than either station. That is not a
     flourish, it is what every analog radio does, and it is why inter-station hiss is the
     loudest thing on the dial.

       THE GAP IS THE SOUND OF A MACHINE TURNING ITSELF ALL THE WAY UP LISTENING FOR
       SOMETHING THAT IS NOT THERE YET. That is the future before he has built it.

     SO THE SOUND REPORTS WHAT THE CITY REPORTS. Rule 31 says the future is derived from the
     earlier acts' ledgers and early on it is a ruin. A thin act has less to receive, so the
     hunt is longer and the hiss swells further; an act already lived captures fast and
     clean. ONE PARAMETER, `signal` from 0 to 1, and IT IS NOT MINE TO SET: DYNASTY owns the
     derivation (mechanism mine, contents theirs). This file ships the mechanism and a
     default of 1 so nothing here decides how ruined his future is.

     THE BAND IS THE SAME TRANSMITTER THE WHOLE GAME CAME OFF (MACHINE.AM), because it is
     the same phone and the same dead broadcast. The carrier is the same 60 Hz mains the room
     and the fold use, because it is the same grid in every act. Nothing new enters. */
  function theFlip(ctx, opts) {
    opts = opts || {};
    var signal = opts.signal == null ? 1 : Math.max(0, Math.min(1, opts.signal));
    var sr = ctx.sampleRate;
    var total = BEAT;                                  /* ONE BEAT. The 120 BPM law. */
    var n = Math.round(sr * total);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);

    /* THE GAP: where the old carrier has gone and the new one has not captured. A thin act
       hunts longer. 24% of a beat at full signal, up to 44% at none -- still inside the
       beat either way, because the beat is the law and the ledger is not allowed to break it. */
    var gapFrom = 0.24 * total;
    var gapTo   = (0.48 + 0.36 * (1 - signal)) * total;
    var i, t, u;

    /* 1. THE HISS, one pass, seeded so a checker can repeat it. Its LEVEL is the AGC: flat
          under a carrier, swelling through the gap, back down when the new one captures. */
    var hiss = new Float32Array(n);
    noiseInto(hiss, n, 1, 31313);
    /* THE SWELL IS A REAL CURVE, NOT A TRIANGLE: an AGC has a time constant, so it ramps up
       over tens of milliseconds and recovers faster than it rises, which is what makes the
       capture sound like a catch rather than a fade. */
    var riseT = 0.055, fallT = 0.022;                  /* seconds, attack and recovery */
    var agc = 1, want;
    /* THE THREE LEVELS ARE OPTIONS SO THE REAL FUNCTION CAN BE SWEPT, NOT A COPY OF IT.
       My first attempt at finding these swept a throwaway re-implementation of this recipe
       and read 0.52x where the real one reads 0.66x, because its filters were not these
       filters. A SWEEP BUILT ON A COPY IS NOT MEASURING THE RECIPE -- the same duplication
       trap that silenced every footstep in this game, wearing a different hat. The defaults
       below are what ships; the gate reads them back off this object. */
    /* AND THESE THREE ARE MEASURED, NOT PICKED. A real AM receiver's inter-station hiss
       runs about +6 to +12 dB over a tuned station, because the AGC has 20 to 30 dB of
       range and nothing to hold it down. My first cut had carrier 0.30 / hiss 0.16 /
       hold 3.2 and MEASURED THE GAP QUIETER THAN THE STATION (0.66x, -3.6 dB) -- exactly
       backwards from the mechanism the whole sound is built on, because a coherent hum at
       0.30 carries far more rms than band-limited noise at 0.34. The sound was wrong, not
       the ruler. Swept on THE REAL FUNCTION, twice: once across 64 level combinations, and
       again after the band was tightened to pass school rule 4, because A TIGHTER BAND
       COSTS THE SWELL ITS SIZE (the gap's extra top was carrying some of its loudness) and
       the two have to be tuned together. MEASURED, WHAT SHIPS:
         full signal   gap 2.00x the station = +6.0 dB, the bottom of the real band
         a ruined act  gap 6.05x            = +15.6 dB, ABOVE what a real receiver does,
                       and that is deliberate: a future he has not built should sound
                       worse than any radio ever made
         the station   3.1% of its energy above its own 5 kHz corner (rule 4 asks under 5) */
    var HISS = opts.hiss == null ? 0.28 : opts.hiss;
    var CARR = opts.carrier == null ? 0.18 : opts.carrier;
    var HOLDX = opts.holdX == null ? 10 : opts.holdX;
    var hold = 1 + HOLDX * (0.35 + 0.65 * (1 - signal)); /* how far up it hunts */
    for (i = 0; i < n; i++) {
      t = i / sr;
      want = (t >= gapFrom && t < gapTo) ? hold : 1;
      var k = want > agc ? (1 - Math.exp(-1 / (riseT * sr))) : (1 - Math.exp(-1 / (fallT * sr)));
      agc += (want - agc) * k;
      d[i] = hiss[i] * HISS * agc;
    }

    /* 2. THE TWO CARRIERS: the act he is leaving, and the act he lands in. The same 60 Hz
          mains in both, because it is the same grid -- what changes is only which harmonics
          survive the trip, which is what a different distance from the transmitter sounds
          like. Nothing pitches up or down: a pitch move would make this a transition effect. */
    function carrier(from, to, parts, lvl) {
      var a = Math.round(from * sr), b = Math.round(to * sr), fade = Math.round(0.018 * sr);
      for (var j = a; j < b && j < n; j++) {
        var h = 0, tt = j / sr;
        for (var q = 0; q < parts.length; q++)
          h += Math.sin(2 * Math.PI * 60 * parts[q][0] * tt) * parts[q][1];
        var g = 1;
        if (j - a < fade) g = (j - a) / fade;                 /* in  */
        if (b - j < fade) g = Math.min(g, (b - j) / fade);     /* out */
        d[j] += h * lvl * g;
      }
    }
    carrier(0, gapFrom, [[1, 1.00], [2, 0.42], [3, 0.18]], CARR);
    /* the act he lands in: thinner in its harmonics the thinner its ledger, so a ruined
       future is a weaker station. The FUNDAMENTAL never goes away -- the grid is always on
       (school rule 7: a silence keeps its carrier). */
    var lands = [[1, 1.00], [2, 0.42 * signal], [3, 0.18 * signal]];
    carrier(gapTo, total, lands, CARR);

    /* 3. THE BAND. Inside the gap a receiver with no carrier to hold it has NO band either,
          so the gap is wider than the stations on both sides. That is done by band-limiting
          the whole thing to the transmitter and then adding back a little top ONLY in the
          gap, which is cheaper and truer than two filters fighting. */
    /* FOUR POLES, NOT TWO, AND THE GATE IS WHY. With two the station leaked 22% of its
       energy above its own 5 kHz corner, which fails this lane's own school rule 4 (under
       5% above the machine's number) -- and it also flattened the "no carrier, no band"
       claim to 1.93x because the station already had the top the gap was supposed to add.
       The phone's carrier uses four for exactly this reason. A transmitter's band edge is
       steep BY REGULATION, so four is the honest number and two was the lazy one. */
    bandTo(d, n, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4);
    /* *** THE TAIL POLES THAT USED TO BE HERE ARE GONE, AND THE REASON IS THAT THE
       HELPER IS HONEST NOW. *** This function used to add its own extra one-poles AT the
       nominal corner to plug what bandTo was leaking, and the comment that lived here
       said "more poles at a derived corner makes it WORSE". MEASURED PROPERLY 9/24 ON AN
       FFT BAND SUM, THAT SENTENCE IS FALSE: derived at 2, 4 and 8 poles all leak between
       35.8% and 39.3%, so the pole count was never the story and the derived corner was.
       bandTo is a Butterworth of order 8 at the nominal corner now, which is 2.6% above it
       on white noise, so a patch on top of it would only be filtering a second time. */
    var a2 = Math.round(gapFrom * sr), b2 = Math.round(Math.min(gapTo, total) * sr);
    var wide = new Float32Array(n);
    noiseInto(wide, n, 1, 77771);
    bandTo(wide, n, 2000, 11000, sr, 2);               /* the top a carrier would have cut */
    for (i = a2; i < b2 && i < n; i++) {
      u = (i - a2) / Math.max(1, b2 - a2);
      d[i] += wide[i] * 0.055 * Math.sin(Math.PI * u);  /* in and out with the gap */
    }

    /* 4. AND IT NEVER REACHES SILENCE (school rule 1), because a receiver that is on is
          never silent. No normalise to a peak here: the whole point is that the GAP is the
          loudest part, and normalising to the peak would hide that behind the ceiling. */
    var pk = 0;
    for (i = 0; i < n; i++) { var av = Math.abs(d[i]); if (av > pk) pk = av; }
    if (pk > 0.85) for (i = 0; i < n; i++) d[i] *= 0.85 / pk;

    return { buffer: buf, machine: MACHINE.AM, seconds: total,
             signal: signal,
             gapFromSeconds: +gapFrom.toFixed(3), gapToSeconds: +Math.min(gapTo, total).toFixed(3),
             gapSeconds: +(Math.min(gapTo, total) - gapFrom).toFixed(3),
             agcHold: +hold.toFixed(2), carrierHz: 60,
             levels: { hiss: HISS, carrier: CARR, holdX: HOLDX },
             why: 'a receiver leaving one act and capturing another: the gap is the machine '
                + 'turning itself up for a signal that is not there yet' };
  }

  /* ==== 4b. THE WALK HAS A CADENCE, AND A RUN DOES NOT ==========================
     MEASURED ON THE REAL SURFACE THIS ROUND, row [footsteps on the beat]. The row asked
     whether footsteps fire FOUR TIMES per ruled step. They do not. They fire ONCE PER
     BEAT, and the row's premise was backwards:

       walked 320 cells across three directions   355 step events, 19 sounds
       one step event per cell                    events/cells 0.90 to 1.00
       one sound every 12 to 25 cells             94% of footfalls make no sound
       mean gap between sounds 0.554 s            against a beat of 0.500 s

     WHY, FROM THE CODE PATH: one press walks STEP_CELLS = 25 cells in a synchronous
     loop and posts a step event for every one of them. The audio clock does not advance
     inside a synchronous loop, so all 25 see the same currentTime and the shell's 0.12 s
     limiter lets exactly ONE through. ONE PRESS = ONE LOT = ONE HOUSE = ONE FOOTSTEP,
     which is THE STEP IS A HOUSE law working, not a bug.

     AND THE LIMITER IS DOING A JOB NOBODY WROTE DOWN. Its comment says "one step per
     footfall, not per frame". Measured, the frame is not what it is protecting against:
     the beat already spaces the presses 0.5 s apart and 0.12 s would allow four. What it
     actually does is collapse a 25-cell burst into one house-step. It is load-bearing for
     a reason its own comment does not state.

     *** SO HERE IS THE THING THAT IS ACTUALLY WRONG, AND IT IS WHY THIS EXISTS. *** A run
     is two lots in one beat: the metronome calls the step twice in the same tick when the
     hold has been going two beats. BOTH CALLS ARE SYNCHRONOUS, microseconds apart, so the
     0.12 s limiter swallows the second one. A RUN COVERS TWICE THE GROUND AND MAKES THE
     SAME ONE SOUND. Evidence, and stated as two things because it is two things: the code
     path above, AND the gap distribution -- a second sound inside a running beat would
     land about 0.12 s after the first, and across 16 measured gaps the SMALLEST was
     0.351 s. Nothing ever landed where a running beat's second step would be.
     (What I could NOT do is attribute sounds to individual beats: the beat lives in the
     city frame and the limiter lives in the shell, and joining them across postMessage by
     wall time lost most of the events. That join is named as failed rather than dressed
     up, and the two lines above do not depend on it.)

     THIS RECIPE IS THE JUDGEMENT, NOT A NEW SOUND. It lays his own approved footfall out
     at a cadence so he can hear whether a run should sound faster than a walk. The sound
     is the cooked footstep this module already holds; only the spacing changes. */
  function walkCadence(ctx, opts) {
    opts = opts || {};
    var perBeat = opts.perBeat == null ? 1 : opts.perBeat;   /* 1 = walk, 2 = run */
    var beats = opts.beats == null ? 8 : opts.beats;
    var sr = ctx.sampleRate;
    var one = footstep(ctx, {});
    var src = one.buffer.getChannelData(0);
    var n = Math.round(sr * beats * BEAT);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var at = [], i, k;
    for (var b = 0; b < beats; b++) {
      for (k = 0; k < perBeat; k++) {
        /* ON the beat for the first, and HALF a beat later for the second, because a
           run is two strides in the time of one walked stride -- not two strides
           jammed together, which is what the game does now (both inside one tick). */
        var t = (b + k / perBeat) * BEAT;
        at.push(+t.toFixed(3));
        var off = Math.round(t * sr);
        for (i = 0; i < src.length && off + i < n; i++) d[off + i] += src[i];
      }
    }
    normalise(d, n, 0.85);
    return { buffer: buf, machine: one.machine, seconds: beats * BEAT,
             perBeat: perBeat, beats: beats, atSeconds: at,
             gapSeconds: +(BEAT / perBeat).toFixed(3),
             why: perBeat === 1
               ? 'one footfall a beat, which is one house a beat: what walking does now'
               : 'two footfalls a beat, evenly spaced: what running SHOULD do and does not' };
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
  /* HE PICKED B (9/23 in the tab, pasted 9/24): HOW LOW THE ROOM went UP with one
     letter, and B on that page is 0.025, LOWER STILL. Rule 32e says it in words too.
     -26.0 dB under the heartbeat became -32.0 dB. The gate holds this equal to the
     alpha's own ROOM.REL, constant for constant, so the two copies cannot drift. */
  var ROOM_REL_SHIPPED = 0.025;
  var ROOM_BAND_ORDER = 8;   /* Butterworth, and the alpha's own chain must match it */

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
    bandTo(d, n, ROOM_LO, ROOM_HI, sr, ROOM_BAND_ORDER);
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

  /* ==== 5b. THREE HUMS OFF THE GRID (round six of [not sand], 9/28) =============
     Redo of generator/power_on/sign_alive, three moments in bohemia_sfx.js's own
     RECIPE table, judged and FROZEN (__SFX_APPROVED, verdict_frozen_gate.py: "the fix
     for a red is never to re-bless the file, give the new sound a NEW EVENT ID").
     Last round measured generator at 60 Hz and power_on at 115-with-slide both under
     1% of their real targets already, but sign_alive is synth:'instrument', a
     borrowed sample voice, and bodyInstrument() rounds hz to the nearest SEMITONE of
     a 220 Hz reference before pitch-shifting the sample -- proved by feeding two
     different hz through two different jit ranges and getting the identical
     123.273 Hz back both times. No semitone on that grid sits within 1% of 120 Hz.

     THE FIX IS NOT A BETTER NUMBER, IT IS A DIFFERENT INSTRUMENT: every partial below
     is its own oscillator built at the exact hz asked for, so there is no sample to
     snap to a note. And rather than touch a frozen id, all three ship here as new
     recipes under new ids, which sidesteps the frozen-verdict question entirely by
     never writing to bohemia_sfx.js at all.

     ONE HELPER, THREE REAL MACHINES, this lane's own school rule 2 (a live circuit
     hums at 60 Hz or an integer multiple of it, a dead one does not hum at all): a
     2-pole alternator at 3,600 RPM makes 60 Hz mains BY SHAFT SPEED, not by choice; a
     transformer or a ballast's core pulls twice every mains cycle (magnetostriction),
     so it hums at 120 Hz whether it is energising a city block or lighting a sign. */
  function harmonicHum(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var secs = opts.secs == null ? 4.0 : opts.secs;
    var hz = opts.hz;
    var parts = opts.parts || [[1, 1.0]];
    var riseSec = opts.riseSec || 0;
    var riseFromHz = opts.riseFromHz || hz;
    var strikes = opts.strikes || 0;        /* a sign catching before it holds steady */
    var n = Math.round(sr * secs);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var i, k, t, f, h;
    for (i = 0; i < n; i++) {
      t = i / sr;
      if (riseSec > 0 && t < riseSec) {
        f = riseFromHz + (hz - riseFromHz) * (t / riseSec);   /* the choir coming up under a rising line, not a switch clicking */
      } else {
        f = hz;
      }
      h = 0;
      for (k = 0; k < parts.length; k++) h += Math.sin(2 * Math.PI * f * parts[k][0] * t) * parts[k][1];
      d[i] = h;
    }
    /* THE STRIKES: a few uneven catches before the hum holds, each one the SAME hum
       gated on and off. Not a separate noise layer, and not shoe-style invented tones:
       the only sound source is the hum itself, switched. */
    if (strikes > 0) {
      var seed = 20260928, cursor = 0, env = new Float32Array(n);
      for (k = 0; k < strikes && cursor < n * 0.6; k++) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        var on = Math.round((0.02 + (seed / 0x7fffffff) * 0.05) * sr);
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        var off = Math.round((0.02 + (seed / 0x7fffffff) * 0.10) * sr);
        for (i = cursor; i < Math.min(n, cursor + on); i++) env[i] = 1;
        cursor += on + off;
      }
      for (i = cursor; i < n; i++) env[i] = 1;   /* holds steady after the last catch */
      for (i = 0; i < n; i++) d[i] *= env[i];
    }
    normalise(d, n, 0.9);
    for (i = 0; i < n; i++) d[i] = Math.tanh(d[i] * 1.15) * 0.88;   /* saturation, not clipping (school rule 8) */
    return {
      buffer: buf, seconds: secs, hz: hz, riseSec: riseSec, riseFromHz: riseFromHz,
      strikes: strikes, noiseSources: 0, synth: 'additive',
      /* heard directly, the same as a footfall under your own boot (DIRECTION's bible
         rule 8): a generator, a transformer or a sign is not an in-world speaker, so it
         declares no machine and school rule 4's band question is not asked of it. */
      machine: MACHINE.EAR,
      why: opts.why || 'a live circuit built from oscillators, so its hum lands on the real target exactly'
    };
  }

  function generatorHum(ctx, opts) {
    opts = opts || {};
    return harmonicHum(ctx, {
      secs: opts.secs == null ? 4.0 : opts.secs,
      hz: 60,
      parts: [[1, 1.0], [2, 0.5], [3, 0.28], [5, 0.12]],
      why: 'a 2-pole alternator at 3,600 RPM makes 60 Hz mains by shaft speed; a small engine\'s own harmonics ride on top of it'
    });
  }

  function powerOnHum(ctx, opts) {
    opts = opts || {};
    return harmonicHum(ctx, {
      secs: opts.secs == null ? 2.0 : opts.secs,
      hz: 120,
      parts: [[1, 1.0], [2, 0.35]],
      riseSec: opts.riseSec == null ? 0.6 : opts.riseSec,
      riseFromHz: 40,
      why: 'a transformer energising a block: its core pulls twice a mains cycle, so it settles at 120 Hz, not a switch clicking'
    });
  }

  function signAliveHum(ctx, opts) {
    opts = opts || {};
    return harmonicHum(ctx, {
      secs: opts.secs == null ? 3.0 : opts.secs,
      hz: 120,
      parts: [[1, 1.0], [2, 0.30], [3, 0.10]],
      strikes: opts.strikes == null ? 3 : opts.strikes,
      why: 'a neon or fluorescent sign\'s own ballast, the same 120 Hz core pull as a transformer, catching unevenly before it holds'
    });
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
    bandTo(d, n, 120, 6000, sr, 2, opts.band);
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
  /* ==== 11. A FOOTSTEP THAT IS NOT SAND ==========================================
     *** PAOLO 9/23 IN THE TAB, THREE SOUNDS DOWN IN ONE BATCH, ONE COMPLAINT SAID THREE
     WAYS: "These are all dogshit and unimpressive u needs to REALLY MAKE NEW SANDS NOT
     THIS SAND SOUNDING SHIT LIKE IM ON THE Beach", "Bro this shit was like all sand
     sounding bro it all sounded like sand", "Kinda dogshit". ***
     He is right and the reason is in this file: every sound I cooked starts with
     noiseInto() through bandTo(), which is band-limited white noise, and band-limited
     white noise IS the sound of sand. Rule 32e makes the RECIPE the graveyard rather
     than any one sound (laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md s5), and what
     he KEPT all have a real source.

     *** SO THERE IS NOT ONE NOISE GENERATOR IN THIS FUNCTION, AND THE GATE READS THE
     SHIPPED FUNCTION'S OWN TEXT TO PROVE IT. ***

     WHAT IT IS INSTEAD: the physics of one hard thing hitting another, which is what a
     footstep is. Three parts, and only the third is a guess:

     (1) THE CONTACT. A Hertzian impact is a half-sine force pulse of duration tau, and
         the spectrum of that pulse is flat to about 1/tau and falls away above it. THAT
         IS WHY A SIDEWALK IS BRIGHT AND A ROAD IS DULL, and it is not taste: tau is set
         by how stiff the two things are. A heel on concrete is about 0.4 ms, so it
         carries to about 2.5 kHz; on asphalt, which is an order of magnitude softer, the
         contact lasts longer and the top goes with it. The pulse RADIATES DIRECTLY as
         well as exciting the ground, and the direct part is the click.

     (2) THE GROUND'S OWN MODES, COMPUTED FROM PUBLISHED CONSTANTS, NOT CHOSEN.
         A slab is a plate, and a simply supported square plate of side a and thickness h
         has modes at f(m,n) = (pi/2) * sqrt(D/(rho*h)) * (m^2+n^2)/a^2, with the flexural
         rigidity D = E*h^3 / (12*(1-v^2)).
           concrete  E 30 GPa   rho 2400   v 0.20   loss 0.06   ->  first mode about 227 Hz
           asphalt   E  3 GPa   rho 2300   v 0.35   loss 0.30   ->  first mode about  77 Hz
           boards    E 13 GPa   rho  500   v 0.30   loss 0.02   ->  its own answer
         A sidewalk slab is 1.2 m across and 100 mm thick, which is the ordinary spec.
         Asphalt's loss factor is an order of magnitude above concrete's because it is
         viscoelastic, so a road THUDS and a sidewalk RINGS, from the material and not
         from a decision.

     (3) THE SHOE, AND IT IS THE ONE PART I PICKED: three short modes in the low kHz with
         an 8 ms decay. A heel is small and stiff so its modes are up there, but I have no
         published figures for a shoe, so this is named as a guess instead of dressed up
         as physics.

     AND A WALK IS TWO CONTACTS, NOT ONE: heel then the foot going flat, about 90 ms
     apart, which is inside one beat at 120 BPM (500 ms) and is why a real footfall reads
     as a foot rather than as a tap. The second contact is softer, so its tau is longer
     and it is duller, which the same arithmetic gives for free. */
  /* *** WHICH NUMBERS ARE COMPUTED AND WHICH ARE CHOSEN, SAID ON THE FACE OF THE TABLE.
     E, rho and v are published material constants and the mode frequencies fall out of
     them with no choice left in it. tau (the contact time) is bounded by how stiff the
     two things are and is chosen inside that, an order of magnitude apart between
     concrete and asphalt because their moduli are an order of magnitude apart.
     LOSS IS THE ONE I HAD TO CORRECT AND THE CORRECTION WAS PHYSICAL, NOT COSMETIC:
     I first used concrete's own internal loss, 0.06, and the slab rang for 23 ms at
     227 Hz, which is a bell and not a sidewalk. A SLAB ON GRADE IS NOT A FREE PLATE --
     it is lying on soil, and the soil and the radiation take the energy out of it far
     faster than the concrete's own damping ever would. On grade the effective loss is
     several tenths, which gives a few milliseconds of ring, which is what a pavement
     really does. Floorboards on joists genuinely DO ring, so they keep a low loss, and
     that difference is audible and correct. These three are engineering estimates and
     they are labelled as such rather than dressed up as published figures. ***

     TWO MORE, ADDED FOR THE HARD-CONTACT REDO LIST (records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md
     3b, step_dirt and step_sand, both frozen in bohemia_sfx.js and both redone here as new
     ids rather than touched in place, same rule as the three hums). DIRT is packed trail
     soil: geotechnical subgrade design figures put compacted soil's resilient modulus at
     roughly 20 to 100 MPa, two orders of magnitude softer than concrete, and soil's own
     internal damping runs well above a paved surface's -- so a HIGHER loss than asphalt,
     same shape as the concrete-to-asphalt step. SAND IS THE PHYSICALLY HONEST CASE: loose
     sand does not propagate a coherent flexural wave the way a slab does, so this is not
     "sand tuned quieter", it is the SAME contact-plus-grit machine with the ring driven to
     almost nothing (loss high enough that a mode dies in about a millisecond) -- what is
     left is the contact click and the grain crush, which is the actual physics of a boot
     sinking into loose ground. Small-strain shear-modulus figures for loose dry sand sit in
     the low tens of MPa; both are engineering estimates, labelled as such. */
  var GROUND = {
    concrete: { E: 30e9, rho: 2400, v: 0.20, loss: 0.40, h: 0.10, a: 1.2, tau: 0.00040,
                grains: 22, spread: 0.010, grit: 0.55,
                why: 'a 100 mm sidewalk slab, 1.2 m across, lying on soil' },
    asphalt:  { E: 3e9,  rho: 2300, v: 0.35, loss: 0.60, h: 0.10, a: 1.2, tau: 0.00110,
                grains: 34, spread: 0.016, grit: 0.40,
                why: 'a road course, an order of magnitude softer and viscoelastic on top of that' },
    boards:   { E: 13e9, rho: 500,  v: 0.30, loss: 0.04, h: 0.025, a: 0.9, tau: 0.00055,
                grains: 5,  spread: 0.006, grit: 0.30,
                why: '25 mm floorboards on joists, which really do ring' },
    dirt:     { E: 80e6, rho: 1700, v: 0.35, loss: 2.00, h: 0.10, a: 1.2, tau: 0.00130,
                grains: 26, spread: 0.012, grit: 0.50,
                why: 'packed trail soil, subgrade-order stiffness (tens of MPa): so much softer than a slab that the plate formula puts its mode below hearing, and the loss that kills a genuinely audible ring at 227 Hz on concrete kills an inaudible one here just as fast, so the loss is raised to match rather than left to ring silently at a frequency nobody would hear' },
    sand:     { E: 8e6,  rho: 1600, v: 0.30, loss: 3.00, h: 0.10, a: 1.2, tau: 0.00160,
                grains: 45, spread: 0.020, grit: 0.45,
                why: 'loose dry sand: no coherent plate ring at this loss (a mode dies in about a millisecond), so what carries the sound is the contact and the grain crush, which is what sand actually does under a boot' }
  };
  function plateModes(g, count) {
    var D = g.E * Math.pow(g.h, 3) / (12 * (1 - g.v * g.v));
    var c = (Math.PI / 2) * Math.sqrt(D / (g.rho * g.h)) / (g.a * g.a);
    var out = [], m, n;
    for (m = 1; m <= 4; m++) for (n = 1; n <= 4; n++) out.push({ m: m, n: n, hz: c * (m*m + n*n) });
    out.sort(function (p, q) { return p.hz - q.hz; });
    return out.slice(0, count || 10);
  }
  /* ==== 12. WHAT THIS VALLEY STRIKES ON THE HOUR ==================================
     *** RULE 33, PAOLO 9/24: the valley is crossed on a MAP the Battle Brothers way, time
     passes as you travel, and the row asks for THE CLOCK AUDIBLE. Rule 33g, his words: "BB
     is just a bunch of pictures... we can do more and put more life into it" -- so where
     BB's map is a still with music over it, ours has a thing in it that MOVES and sounds.
     And rule 32e: NO SAND, new sounds from REAL MATERIAL. ***

     THERE IS NOT ONE NOISE GENERATOR IN THIS FUNCTION EITHER. A struck metal object is a
     set of MODES, and the mode ratios of both objects here are PUBLISHED SERIES, not
     numbers I liked:

     A TUNED BELL is tuned to a MINOR THIRD, which is why a bell sounds sad and why this
     one belongs in a dead valley. Its partials, as a bell founder tunes them, relative to
     the prime:
         0.5  hum        1.0  prime      1.2  tierce (a MINOR third: 6/5)
         1.5  quint      2.0  nominal    2.5  deciem
         3.0  undecim    4.0  double octave
     The tierce being minor is the whole character, and it is also this lane's own no-major-
     third rule agreeing with a bell founder by accident.

     A STRUCK BAR OR PIPE is INHARMONIC, and that is why it reads as metal-you-found rather
     than as a bell. The transverse modes of a free-free bar are the classic series
         1 : 2.756 : 5.404 : 8.933 : 13.34
     which is not a chord at all, and it is what somebody hitting a length of pipe gets.

     A CRACKED BELL is the same bell with the ring taken out of it and its tuning pulled
     off: a crack stops the shell from vibrating as one piece, so the partials go sharp and
     flat of where they were cast and the decay collapses. Nothing in this valley has been
     maintained for ten years, so this is the realistic one, and REALISM FIRST says it
     leads.

     HIGHER MODES DIE FIRST, WHICH IS PHYSICS AND NOT A CHOICE: damping rises with
     frequency, so a bell's hum outlasts its nominal by many seconds and that is why a bell
     "warms" as it decays. Each partial's decay here is derived from its own frequency.

     AND IT LANDS ON THE BEAT (the 120 BPM law): the strike is at zero and the ring runs on
     past it. A bell tail is seconds long, which is legal because the LAW is about when a
     sound starts, never about how long it may hold. */
  var STRIKE = {
    bell: {
      /* a founder's minor-third tuning */
      ratios: [0.5, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0],
      levels: [0.62, 1.00, 0.74, 0.55, 0.62, 0.30, 0.22, 0.12],
      f0: 220, damp: 0.18, secs: 6.0, hit: 0.0016,
      why: 'a cast bell tuned the way a founder tunes one, on a minor third'
    },
    cracked: {
      /* THE SAME BELL, ten years unmaintained: the tuning pulled off and the ring gone */
      ratios: [0.5, 1.0, 1.23, 1.44, 2.07, 2.42, 3.11, 4.09],
      levels: [0.40, 1.00, 0.80, 0.70, 0.55, 0.40, 0.34, 0.22],
      f0: 220, damp: 0.40, secs: 2.5, hit: 0.0011,
      why: 'the same bell cracked: a crack stops the shell moving as one piece, so the partials go off their tuning and the ring collapses'
    },
    pipe: {
      /* the transverse modes of a free-free bar, which are inharmonic */
      ratios: [1, 2.756, 5.404, 8.933, 13.34],
      /* a struck bar is CLANGY, and that is the high modes being LOUD, not an afterthought */
      levels: [1.00, 0.92, 0.78, 0.60, 0.42],
      f0: 196, damp: 0.08, secs: 5.0, hit: 0.0007,
      why: 'a length of steel pipe, struck: the free-free bar series, which is not a chord'
    },
    /* GLASS IS NOT METAL, BUT THIS FUNCTION NEVER CARED: it is a generic struck-resonator
       engine (a half-sine force pulse, a bank of decaying modes, saturate, fade), and a
       drinking glass is just another material with its own real numbers. A GLASS IS THE
       ONE ENTRY IN THIS TABLE WITH ONE PARTIAL, AND THAT IS ITS OWN REAL CHARACTER: a
       struck tumbler's well-known "singing" quality is one clear pitch, not a chord --
       unlike the bell's tuned stack or the pipe's clangy inharmonic series. Glass also
       loses far less energy than bronze or steel per cycle (it is why a glass harmonica
       works at all), so the damping here is set BELOW the pipe's own 0.08%, the lowest
       figure already in this table. ENGINEERING ESTIMATES, STATED AS SUCH: f0 (a bar
       tumbler's struck tone commonly falls in the few-hundred-Hz range; 650 is the middle
       of that range, not a measured glass) and damp (lower than pipe's because glass is
       the lower-loss material, but far above an isolated suspended crystal's figure,
       because this glass sits on a counter and is held by a hand, the same contact-
       damping reasoning the pipe entry already uses). hit is shorter than the pipe's
       because glass is the stiffer contact of the two. */
    glass: {
      ratios: [1.0],
      levels: [1.00],
      f0: 650, damp: 0.05, secs: 1.2, hit: 0.0004,
      why: 'a drinking glass, struck: one clear pitch, which is the real character a bell\'s chord and a pipe\'s clangy stack do not have'
    }
  };
  function struckMetal(ctx, opts) {
    opts = opts || {};
    var which = opts.what || 'cracked';
    var k = STRIKE[which] || STRIKE.cracked;
    var sr = ctx.sampleRate;
    var f0 = opts.f0 || k.f0;
    var n = Math.round(sr * (opts.secs || k.secs));
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i, q;

    /* THE STRIKE ITSELF, and it is the same physics as the footstep's contact: a half-sine
       force pulse of duration `hit`, radiating directly as its own rate of change, which is
       the bright click of metal being hit. A harder object gives a shorter pulse and a
       brighter click, which is why the pipe's is the shortest. */
    var w = Math.max(2, Math.round(k.hit * sr)), prev = 0;
    for (i = 0; i < w && i < n; i++) {
      var f = Math.sin(Math.PI * i / w);
      d[i] += (f - prev) * 0.42;
      prev = f;
    }

    /* THE MODES. Each one is a decaying sine at its published ratio, and its decay time
       falls with frequency because damping rises with it. */
    var tails = [];
    for (q = 0; q < k.ratios.length; q++) {
      var hz = f0 * k.ratios[q];
      if (hz >= sr / 2) continue;
      /* AN AMPLITUDE E-FOLD: 1/(pi * f * loss), the same relation the footstep's slab uses,
         and `damp` is the loss factor in PERCENT so the table reads in human numbers.
         *** AND THE FIRST CUT OF THIS TABLE WAS TWENTY TIMES TOO DAMPED AND THE BELL RANG
         FOR 85 MILLISECONDS. *** Metals barely lose energy: bronze and steel have loss
         factors around 1e-4 to 1e-3, so a cast bell's hum rings for SECONDS and that is
         the whole sound of a bell.
         AND THEN THE SECOND CUT WENT TOO FAR THE OTHER WAY: at the bronze's own 0.03% the
         hum rings 9.6 s, which is a CATHEDRAL bell and longer than any buffer worth
         holding, and measuring the last quarter of the buffer found 0.21 rms still going
         when the samples ran out. THIS IS A TOWN BELL, and what limits a town bell is not
         the bronze, it is how hard it RADIATES and how it is MOUNTED, so 0.18% and a 1.6 s
         hum, which is what a town bell really does. A CRACK raises the loss again because
         the shell stops moving as one piece, so 0.40% gives 0.7 s and a thud; a pipe
         somebody is holding sits below both at 0.08%. The numbers are the material's and
         the mounting's; the first cut's were mine. */
      var tail = 1 / (Math.PI * hz * (k.damp / 100));
      tails.push({ hz: +hz.toFixed(2), tailSeconds: +tail.toFixed(3), level: k.levels[q] });
      for (i = 0; i < n; i++) {
        var t = i / sr, env = Math.exp(-t / tail);
        if (env < 1e-4) break;
        d[i] += Math.sin(2 * Math.PI * hz * t) * k.levels[q] * env;
      }
    }

    /* saturation rather than a ceiling (school rule 8) */
    for (i = 0; i < n; i++) d[i] = Math.tanh(d[i] * 0.9) * 0.94;

    /* *** AND THE END OF THE BUFFER IS FADED, BECAUSE THE FIRST CUT CHOPPED THE RING OFF
       AND A CHOPPED RING IS A CLICK. *** A raised cosine over the last 200 ms: long enough
       that nothing can snap, short enough that nobody hears it as a fade-out. The gate
       checks the last sample against the sound's own biggest step, so this cannot be
       claimed without being measured. */
    var fade = Math.min(n, Math.round(0.20 * sr));
    for (i = 0; i < fade; i++) {
      var u = i / fade;
      d[n - fade + i] *= 0.5 * (1 + Math.cos(Math.PI * u));
    }
    normalise(d, n, 0.85);

    return {
      buffer: buf, machine: MACHINE.EAR, seconds: n / sr, what: which,
      noiseSources: 0,
      f0: f0, ratios: k.ratios, levels: k.levels, damp: k.damp,
      hitMs: +(k.hit * 1000).toFixed(3), partials: tails,
      /* the longest and shortest ring, so "the top dies first" is a number and not a claim */
      longestTailSeconds: tails.length ? tails[0].tailSeconds : null,
      shortestTailSeconds: tails.length ? tails[tails.length - 1].tailSeconds : null,
      fadeMs: 200,
      why: k.why
    };
  }

  /* ==== 5c. THE TURN CLOSES (row [one song and the volumes], 10/4) ===============
     Rule 54b's demo-only row asks for "the end-turn" on COMBAT's rebuilt fight, from
     real material, no sand. There is no sound on that button at all right now: the
     fight's own placeholder SND object (slices/BOHEMIA_FIGHT.html) never wired one.
     A TURN ENDING IS A SMALL STEEL PART ENGAGING, NOT A CHIME. struckMetal's 'pipe'
     material is already a published free-free-bar series (REUSE-FIRST, no new modal
     math); heard for 90 ms instead of the full 5 s a pipe actually rings for, it is
     the first bright instant of that same strike and nothing invented. f0 is raised
     from the pipe's own 196 Hz to 1400 Hz because a bolt catch or a ratchet pawl is a
     much smaller, stiffer part than a pipe somebody is holding, and a smaller part's
     modes sit higher -- the same relation GROUND's own materials use (stiffer/smaller
     rings higher), applied here by ear rather than a fourth material table for one
     click. secs is short enough that struckMetal's own 200 ms end-fade covers the
     WHOLE buffer, so what plays is a clean rise-and-fall with no chopped edge, built
     out of the strike's true bright modes rather than a separate envelope pasted over
     noise. NOT WIRED LIVE THIS ROUND: every other new sound this lane has ever cooked
     stayed out of the real game until he thumbed it (unjudged = silent is the bank's
     own law, bohemia_sfx.js); this keeps that line rather than making itself the one
     exception because it is small. */
  function endTurnClick(ctx, opts) {
    opts = opts || {};
    var secs = opts.secs == null ? 0.09 : opts.secs;
    var f0 = opts.f0 == null ? 1400 : opts.f0;
    var m = struckMetal(ctx, { what: 'pipe', f0: f0, secs: secs });
    return {
      buffer: m.buffer, machine: m.machine, seconds: m.seconds, what: 'pipe',
      noiseSources: 0, f0: f0, secs: secs,
      why: 'a small steel catch, struck and heard before it has time to ring like a pipe: ' +
        'the turn closing the way a bolt drops into its notch'
    };
  }

  function footstepModelled(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var which = opts.surface || 'concrete';
    var g = GROUND[which] || GROUND.concrete;
    var beat = opts.beat == null ? BEAT : opts.beat;
    var n = Math.round(sr * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var modes = plateModes(g, 10);
    var i, k;

    /* *** THE ONE FOOTSTEP EVERYONE HEARS FOREVER, FOUND BEFORE HE DID (9/30). *** Every
       surface here rendered byte-identical on every call: grit()'s seed was the same
       constant every time and nothing else in the function rolls a die, so a footstep on
       concrete would have been the exact same sample on repeat -- the precise defect
       walk_more/wood_more/tread_more exist in the OLD system to fix ("step_concrete.2 is
       one sample for every sidewalk... the second most-walked surface in the game").
       Proved with two live calls compared sample for sample: maxDiff 0 over 22,050
       samples. A REAL WALK NEVER LANDS THE SAME TWICE, so opts.variant (default 0, so an
       already-registered candidate's exact render is untouched unless asked for a
       different one) derives a small seeded jitter: which grains fall where, and the
       ordinary stride variation a real gait has -- tau, gain and the heel-toe gap all
       move a few percent, never the surface's own material numbers. */
    var variant = opts.variant || 0;
    /* variant 0 IS THE EXACT OLD RENDER, on purpose: concrete/asphalt/dirt/sand/boards are
       already registered candidates nobody has judged yet, and a candidate does not need
       to change to be improved -- only variant 1+ turns the jitter on, so what he already
       sees stays byte-for-byte what it was. */
    var jitTau = 1, jitGain = 1, gritSeedOffset = 0;
    var heelToe = opts.heelToe == null ? 0.090 : opts.heelToe;
    if (variant !== 0) {
      var vseed = 20260930 + variant * 7919;
      var vrand = function () { vseed = (vseed * 1103515245 + 12345) & 0x7fffffff; return vseed / 0x7fffffff; };
      jitTau = 1 + (vrand() * 2 - 1) * 0.08;      /* +-8%: no two heel strikes are identical */
      jitGain = 1 + (vrand() * 2 - 1) * 0.10;     /* +-10% */
      gritSeedOffset = Math.round(vrand() * 1e6);
      heelToe += (vrand() * 2 - 1) * 0.015;       /* +-15 ms, ordinary gait variance */
    }

    /* ONE CONTACT: the half-sine force pulse, its direct radiation, and the modes it
       rings. The only randomness anywhere in here is the seeded gait variance above;
       every material number (E, rho, v, loss) is still exactly the table's own. */
    function contact(at, tau, gain, bright) {
      var t0 = Math.round(at * sr), w = Math.max(2, Math.round(tau * sr));
      /* THE DIRECT CLICK: a monopole radiates the RATE OF CHANGE of the force, so the
         pulse is differentiated. That is what puts real energy above 1 kHz, and its
         corner is 1/tau, which is the whole reason a stiff ground is bright. */
      var prev = 0;
      for (i = 0; i < w && t0 + i < n; i++) {
        var f = Math.sin(Math.PI * i / w);
        d[t0 + i] += (f - prev) * sr * tau * 0.55 * gain * bright;
        prev = f;
      }
      /* THE GROUND, RINGING. Each mode is a decaying sine started by the pulse. The decay
         comes from the material's loss factor: an amplitude e-fold takes 1/(pi*f*loss). */
      for (k = 0; k < modes.length; k++) {
        var hz = modes[k].hz;
        if (hz >= sr / 2) continue;
        var tail = 1 / (Math.PI * hz * g.loss);
        /* higher modes take less of the pulse's energy, and the pulse itself rolls off
           above 1/tau, so the mode amplitudes are the pulse's own spectrum */
        /* THE GROUND IS THE BODY, NOT THE SOUND. 0.55 of the contact, because what you
           actually hear standing on a pavement is the contact and the shoe; the slab
           gives it somewhere to have happened. */
        var amp = 0.55 * gain / (1 + Math.pow(hz * tau, 2)) / (1 + k * 0.35);
        for (i = 0; t0 + i < n; i++) {
          var t = i / sr, env = Math.exp(-t / tail);
          if (env < 1e-4) break;
          d[t0 + i] += Math.sin(2 * Math.PI * hz * t) * amp * env;
        }
      }
      /* *** THE SHOE, WHICH KILLED THIS SOUND, AND IS GONE (fixed 9/28, Paolo: "these
         sound effects have like the reverb of like a glass jar"). *** It was three pure
         sine tones (1800, 3100, 4700 Hz, an 8 ms decay), the one part of this recipe that
         was a guess and not physics, and measured on the rendered buffer they carried
         33.9% of the whole sound's energy: 1800 Hz alone was 25% of it, in a window with
         almost nothing else above 1 kHz to mask it. THREE ISOLATED, INHARMONICALLY
         RELATED PURE TONES RINGING TOGETHER IS THE TEXTBOOK DEFINITION OF A GLASS OR
         BELL TIMBRE -- it is the exact mechanism the struck-hour bell uses on purpose,
         landing here by accident. The contact click above is already broadband by
         construction (a monopole radiating the rate of change of a real force pulse) and
         grit is already a dense sum of real impacts; between them a heel does not need
         three invented tones to sound bright. Nothing replaces this layer: the contact
         and the grit carry the top end because they are the physics, not a guess. */
    }

    /* *** GRIT, AND IT IS THE REASON THIS DOES NOT SOUND LIKE A DOORBELL. ***
       Ten modes with no noise is a set of discrete partials, which is a PING. A real footfall is dense because the ground is not smooth: a few dozen
       grains of sand and stone crush under the heel, each one its own tiny impact. THAT
       IS WHERE THE DENSITY COMES FROM IN THE REAL WORLD, and it is a sum of impulses
       rather than a hiss bed -- there is still not one noise generator here. The grain
       COUNT and the scatter of their arrival times are what the surface decides: a
       sidewalk has a little, a road course has more and softer, boards have almost none.
       The times are laid out by a fixed integer sequence so a checker measuring this
       twice gets the same buffer; what is being modelled is WHEN particles arrive, never
       a random waveform. */
    function grit(at, count, spread, amp) {
      var seed = 20260924 + gritSeedOffset, q, j;
      for (q = 0; q < count; q++) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        var frac = seed / 0x7fffffff;
        var t0 = Math.round((at + frac * spread) * sr);
        var w = Math.max(2, Math.round(0.00015 * sr));       /* a grain is tiny and stiff */
        var prev = 0, lvl = amp * (0.35 + 0.65 * (1 - frac));  /* the first ones are loudest */
        for (j = 0; j < w && t0 + j < n; j++) {
          var f = Math.sin(Math.PI * j / w);
          d[t0 + j] += (f - prev) * lvl;
          prev = f;
        }
      }
    }

    contact(0.002, g.tau * jitTau, 1.0 * jitGain, 1.0);     /* the heel, on the beat */
    grit(0.002, g.grains, g.spread, g.grit);
    if (heelToe > 0) {
      contact(0.002 + heelToe, g.tau * 2.2 * jitTau, 0.45 * jitGain, 0.6);   /* the foot going flat */
      grit(0.002 + heelToe, Math.round(g.grains * 0.6), g.spread, g.grit * 0.5);
    }

    /* saturation instead of clipping (school rule 8): tanh rounds the peaks and adds
       harmonics, which is what a machine too small for the sound does. */
    for (i = 0; i < n; i++) d[i] = Math.tanh(d[i] * 1.2) * 0.92;
    normalise(d, n, 0.85);

    return {
      buffer: buf, machine: MACHINE.EAR, seconds: beat, surface: which,
      noiseSources: 0,
      ground: { E: g.E, rho: g.rho, v: g.v, loss: g.loss, h: g.h, a: g.a, why: g.why },
      contactMs: +(g.tau * jitTau * 1000).toFixed(3),
      contactCornerHz: Math.round(1 / (g.tau * jitTau)),
      modesHz: modes.map(function (x) { return +x.hz.toFixed(1); }),
      firstModeHz: +modes[0].hz.toFixed(1),
      shoeHz: null, shoeIsAGuess: false, shoeRemoved: true,
      grains: g.grains, gritSpreadMs: +(g.spread * 1000).toFixed(1),
      heelToeMs: +(heelToe * 1000).toFixed(1),
      contacts: heelToe > 0 ? 2 : 1,
      variant: variant,
      why: 'a heel on ' + g.why + ': a ' + (g.tau * jitTau * 1000).toFixed(2)
        + ' ms contact radiating directly, ringing the slab\'s own modes from its '
        + 'published stiffness, and NOT ONE NOISE GENERATOR ANYWHERE IN IT'
    };
  }

  /* THREE THIN WRAPPERS SO H.list()'S GENERIC SWEEP (rule 22a: `H[item.make](ctx, {})`,
     always empty opts) CAN REACH THE OTHER THREE GROUND MATERIALS, the same reason
     generatorHum/powerOnHum/signAliveHum wrap harmonicHum instead of exporting it bare. */
  function footstepDirt(ctx, opts) { return footstepModelled(ctx, Object.assign({}, opts || {}, { surface: 'dirt' })); }
  function footstepSand(ctx, opts) { return footstepModelled(ctx, Object.assign({}, opts || {}, { surface: 'sand' })); }
  function footstepWood(ctx, opts) { return footstepModelled(ctx, Object.assign({}, opts || {}, { surface: 'boards' })); }

  /* ==== 13b. A WALK THAT NEVER REPEATS (9/30) ====================================
     walk_more/wood_more/tread_more's real complaint, in the OLD system's own words:
     "step_concrete.2 is one sample for every sidewalk... the second most-walked
     surface in the game", "step_wood has two samples for every porch, deck and
     floorboard", "a boot on a hard floor, on a two-beat pattern". The old fix was
     MORE PRE-RENDERED SAMPLES, a fixed pool that eventually repeats too. THE NEW FIX
     NEVER RUNS OUT: footstepModelled's own variant seed (above) makes every step a
     little different forever, so a walk built out of it is not a sample on repeat at
     all -- there is no pool to exhaust. Same timing convention as walkCadence
     (perBeat 1 = walk, 2 = run), but every footfall calls footstepModelled with its
     own step index as the variant, never variant 0 (the exact render already sitting
     in front of him as a single candidate), so a sequence never repeats even once. */
  function footstepWalk(ctx, opts) {
    opts = opts || {};
    var surface = opts.surface || 'concrete';
    var perBeat = opts.perBeat == null ? 1 : opts.perBeat;
    var beats = opts.beats == null ? 6 : opts.beats;
    var sr = ctx.sampleRate;
    var n = Math.round(sr * beats * BEAT);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var at = [], step = 0, i;
    for (var b = 0; b < beats; b++) {
      for (var k = 0; k < perBeat; k++) {
        step++;
        var t = (b + k / perBeat) * BEAT;
        var one = footstepModelled(ctx, { surface: surface, variant: step, beat: BEAT / perBeat });
        var src = one.buffer.getChannelData(0);
        var off = Math.round(t * sr);
        at.push(+t.toFixed(3));
        for (i = 0; i < src.length && off + i < n; i++) d[off + i] += src[i];
      }
    }
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: MACHINE.EAR, seconds: beats * BEAT, surface: surface,
      steps: step, perBeat: perBeat, atSeconds: at,
      why: (perBeat === 1 ? 'walking' : 'running') + ' on ' + surface + ', ' + step
        + ' footfalls, never the same variant twice, because footstepModelled\'s own '
        + 'seed moves with every step it is asked for'
    };
  }
  function footstepWalkConcrete(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'concrete', perBeat: 1 })); }
  function footstepWalkWood(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'boards', perBeat: 1 })); }
  function footstepRunConcrete(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'concrete', perBeat: 2 })); }

  /* ==== 13d. THE MAP IN MOTION (row [the map's sounds], 10/5) =====================
     Rule 54b: "the party's steps on asphalt and on dirt (two beds, the road faster)."
     Both are footstepWalk, already real material and already proven never to repeat a
     footfall -- the only question travel asks of it is TEMPO, and footstepWalk already
     answers that with perBeat (one footfall a beat walking, two running). A paved road
     moves the party faster than open dirt (the same relation THE OVERWORLD IS BATTLE
     BROTHERS already costs in travel time, roughly halved on a road), so the road bed is
     perBeat 2 and the dirt bed stays perBeat 1 -- no new number, the game's own ratio
     read onto the footfall engine instead of a second one typed for ambience alone.
     LOOPS, because a travel bed plays for as long as the clock takes to cross the block,
     not for a fixed six beats; the caller decides how many. */
  function travelRoadBed(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'asphalt', perBeat: 2 })); }
  function travelDirtBed(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'dirt', perBeat: 1 })); }

  /* ==== 13e. THE NIGHT HAS INSECTS (row [the map's sounds], 10/5) =================
     Rule 54b: "the night's insects." A cricket's chirp is not a hiss, it is
     STRIDULATION -- a wing scraping a wing, mechanically a train of short clicks, the
     same real mechanism crackleInto already models for the broadcast's distant
     lightning (REUSE-FIRST, no second click generator). Run far denser (many insects
     calling, not one distant strike) and band-limited to where a cricket actually
     sits: a field cricket's calling song carries a tone centred in the low kHz, commonly
     measured around 4 to 5 kHz for the familiar temperate species, so the band here is
     3000 to 6000 Hz -- nowhere near the broadcast's own band (100 to 5000 Hz, an AM
     transmitter's) and nowhere near a footstep's (under a kHz). Still zero noise
     generators: crackleInto places discrete half-sine clicks at known times, which is
     exactly what one insect's leg stroke is. */
  function nightInsects(ctx, opts) {
    opts = opts || {};
    var secs = opts.secs == null ? 4.0 : opts.secs;
    var sr = ctx.sampleRate, n = Math.round(sr * secs);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var rate = opts.ratePerSec == null ? 90 : opts.ratePerSec;
    var seed = opts.seed == null ? 20261005 : opts.seed;
    var events = crackleInto(d, n, sr, rate, 0.9, seed, 0);
    bandTo(d, n, 3000, 6000, sr, 8);
    normalise(d, n, 0.8);
    return {
      buffer: buf, machine: MACHINE.EAR, seconds: secs, clicks: events.length, lo: 3000, hi: 6000,
      noiseSources: 0,
      why: 'many insects as a dense click train (crackleInto, the same mechanism the '
        + 'broadcast\'s lightning uses), band-limited to 3 to 6 kHz, a field cricket\'s own range'
    };
  }

  /* ==== 13b. THE TITLE'S OWN MUSIC (row [the title's music], 10/5) ===============
     PAOLO 10/5: "I wish there was cool main menu music... everything we do has to
     follow this analog horror aesthetic." Rule 66a names the pieces: tape hiss and
     wow, a mains hum, a detuned slow theme, the room tone of the power authority's
     last camera (RUN's new start screen IS that camera).
     EVERY PIECE ALREADY EXISTS, REUSE-FIRST, DOWN TO THE LETTER. songThroughSpeaker
     already built an original warm phrase (minor pentatonic, patient, a bass under
     it) run through an AM transmitter's band with its own hiss and two drop-outs;
     songOnTape already runs that same phrase through wowFlutter, the slipping-tape
     deck this lane proved in round 5 (0.35% at 1.4 Hz, inside the real wow-and-
     flutter range a worn consumer cassette actually measures). That is three of the
     four pieces, already built and already this lane's own composition, not the
     MUSIC tab's content (MECHANISM-MINE: this treats a phrase, it does not touch
     the MUSIC tab's songs or its vote). roomHum is the fourth: its own comment
     already calls it "the room the loading sits in" -- the power authority's own
     camera, named before this row ever existed, because the loading screen and the
     new start screen are the same kind of in-world machine.
     DETUNED IS A SEPARATE REAL CAUSE FROM WOW, AND BOTH ARE ASKED FOR BY NAME. Wow
     is the motor moving NOW, a wobble around a centre; detuned is an instrument
     that drifted off true pitch and stayed there, a fixed offset with no motion in
     it at all -- an old tape deck's bias long since wandered off spec. So the root
     is a fixed 3% flat of the canon F3 (174.61 Hz, standard 12-TET) before any of
     the wobble is added, which is the one number this function adds that the three
     reused pieces do not already carry.
     THE TEMPO IS A THEME'S, NOT THE BEAT'S, AND IT IS STILL 120 BPM FRIENDLY: twice
     the master beat (1.0 s instead of 0.5 s) is a theme felt as half speed while
     staying an exact multiple of the grid everything else in this game is
     quantised to -- a phrase that could still hand off on a beat boundary if the
     start screen ever needed it to. */
  function titleTheme(ctx, opts) {
    opts = opts || {};
    var beats = opts.beats == null ? 32 : opts.beats;        /* four passes of the 8-note phrase */
    var beat = opts.beat == null ? BEAT * 2 : opts.beat;      /* half speed, still a clean multiple of BEAT */
    var detune = opts.detune == null ? 0.97 : opts.detune;    /* 3% flat: drifted, not wobbling */
    var root = (opts.root == null ? 174.61 : opts.root) * detune;
    var song = songOnTape(ctx, { beats: beats, beat: beat, root: root,
      depth: opts.wowDepth, rate: opts.wowRate, band: opts.band });
    var room = roomHum(ctx, { rel: opts.roomRel == null ? ROOM_REL_SHIPPED : opts.roomRel });
    var sr = ctx.sampleRate, n = song.buffer.length;
    var sd = song.buffer.getChannelData(0), rd = room.buffer.getChannelData(0), rn = rd.length;
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = sd[i] + rd[i % rn];
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: song.machine, seconds: n / sr,
      root: song.root, detune: detune, canonRoot: opts.root == null ? 174.61 : opts.root,
      wowDepth: song.wowDepth, wowRateHz: song.wowRateHz,
      dropouts: song.dropouts, roomRel: room.rel,
      why: 'the warm phrase on a slipping, detuned deck, through the dead broadcast, '
        + 'with the room the loading sits in underneath it'
    };
  }

  /* ==== 13b2. THE SETTLEMENT ANSWERS THE FINGER (row [the settlement's sounds], 10/5) ====
     Rule 54b, rule 71a. Each building taps back before its label does: the barber's
     clippers, the stall's can on wood, the posts' paper, the board's nail. Every one
     is a REUSE of a primitive this lane already built; the only new work is which real
     mechanism each tap is. "The clinic's door" needs nothing new at all -- door_open and
     door_shut are already approved, frozen bank events (bohemia_sfx.js), so that one is
     wired live below rather than cooked here. */

  /* A CLIPPER IS A VIBRATING ARMATURE, NOT A MOTOR SPINNING. A mains-driven clipper (the
     kind that has not needed a battery since before this valley died) uses an
     electromagnet that pulls the blade once every half-cycle of the AC line -- twice a
     cycle, so at 60 Hz mains that is 120 Hz, a published, real number, the same family
     this lane's generator and sign hums already use. The strike against the stop at each
     end is why it buzzes instead of humming clean: a rich harmonic stack, not one partial. */
  function barberClippers(ctx, opts) {
    opts = opts || {};
    return harmonicHum(ctx, {
      secs: opts.secs == null ? 3.0 : opts.secs,
      hz: opts.hz == null ? 120 : opts.hz,
      parts: opts.parts || [[1, 1.0], [2, 0.55], [3, 0.38], [4, 0.22], [5, 0.12]],
      why: 'a vibrating-armature clipper, the blade struck against its stop twice every '
        + 'mains cycle: 120 Hz and a buzzy stack of harmonics, not a clean tone'
    });
  }

  /* A CAN SET DOWN ON A COUNTER IS TWO MATERIALS, ONE CONTACT. The same heel-strike
     physics footstepModelled already uses for a boot on a slab applies here to a boot's
     own cousin -- a rigid object landing on a surface -- so the wood gets objectSetDown
     unmodified, just told which ground it is (boards, already in GROUND). What a boot
     does not have is a thin metal shell ringing on top of the thump, which is what makes
     a can a can: struckMetal's own 'pipe' modes, shorter and higher than a held pipe
     because a tin can is far smaller and lighter. */
  function canOnWood(ctx, opts) {
    opts = opts || {};
    var wood = objectSetDown(ctx, { surface: 'boards', variant: opts.variant });
    var tin = struckMetal(ctx, { what: 'pipe', f0: opts.f0 == null ? 740 : opts.f0,
      secs: opts.tinSecs == null ? 0.22 : opts.tinSecs });
    var sr = ctx.sampleRate;
    var wd = wood.buffer.getChannelData(0), td = tin.buffer.getChannelData(0);
    var n = Math.max(wd.length, td.length);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (i < wd.length ? wd[i] : 0) * 0.7 + (i < td.length ? td[i] : 0) * 0.55;
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: wood.machine, seconds: n / sr, woodSurface: wood.surface, tinF0: tin.f0,
      why: 'a tin can\'s own thin ring (struckMetal\'s pipe modes, short and high) landing on '
        + 'the stall\'s wood counter (objectSetDown on boards) -- the same contact two ways at once'
    };
  }

  /* A TACK PINNING A CARD IS THE SAME STRIKE endTurnClick ALREADY USES, SMALLER. A nail's
     point is a far smaller, stiffer thing than a bolt catch, so it rings even higher and
     dies even faster -- the same published pipe series, raised further and heard for even
     less of it, which is the whole reason this is a variation on that function's own
     numbers and not a new material. */
  function boardNail(ctx, opts) {
    opts = opts || {};
    var f0 = opts.f0 == null ? 1900 : opts.f0;
    var secs = opts.secs == null ? 0.05 : opts.secs;
    var m = struckMetal(ctx, { what: 'pipe', f0: f0, secs: secs });
    return {
      buffer: m.buffer, machine: m.machine, seconds: m.seconds, what: 'pipe', f0: f0,
      why: 'a tack pinning a card to the board: the same strike endTurnClick uses, smaller '
        + 'and higher -- a nail\'s point instead of a bolt catch\'s whole jaw'
    };
  }

  /* PAPER CRINKLING IS MANY TINY CREASES, NOT A HISS. The same discrete-click mechanism
     the broadcast's lightning and the night's insects already use (crackleInto, REUSE-
     FIRST a third time on a third real cause), run dense and wide: a crease catching and
     releasing is a broadband transient, not a tone, so the band here is wide (1.2 to 8
     kHz) rather than the insects' narrow calling-song band. */
  function paperRustle(ctx, opts) {
    opts = opts || {};
    var secs = opts.secs == null ? 1.5 : opts.secs;
    var sr = ctx.sampleRate, n = Math.round(sr * secs);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var rate = opts.ratePerSec == null ? 420 : opts.ratePerSec;
    var seed = opts.seed == null ? 20261005 : opts.seed;
    var events = crackleInto(d, n, sr, rate, 0.7, seed, 0);
    bandTo(d, n, 1200, 8000, sr, 8);
    normalise(d, n, 0.75);
    return {
      buffer: buf, machine: MACHINE.EAR, seconds: secs, clicks: events.length, lo: 1200, hi: 8000,
      noiseSources: 0,
      why: 'many tiny paper creases catching and releasing (crackleInto, the same mechanism '
        + 'the broadcast\'s lightning and the night\'s insects use), broadband 1.2 to 8 kHz the '
        + 'way real paper crinkle actually spreads'
    };
  }

  /* ==== 13b3. THE SOUNDSCAPE'S FIRST TWO WORKING SOUNDS (row [the soundscape], 10/9) ====
     Rule 80a, Paolo's own words: "the clinking of someone making disorder" at the smith and
     the armourer. Both REUSE struckMetal's own free-free bar series (the same one boardNail
     already uses), never a new material -- what changes is the mass behind the strike and
     the cadence it is struck at, which is the real difference between a forge and a rivet
     gun, not a new recipe. */

  /* AN ANVIL IS A MASSIVE, WELL-COUPLED BLOCK, SO IT RINGS LOW AND BRIEF. A pipe somebody is
     holding keeps most of a free blow's energy in the bar; an anvil bolted to a stump bleeds
     it into the ground almost at once, so the same inharmonic series rings for a fraction of
     a pipe's own tail and the fundamental sits low (a heavy mass, not a thin bar). */
  function smithHammer(ctx, opts) {
    opts = opts || {};
    var m = struckMetal(ctx, { what: 'pipe', f0: opts.f0 == null ? 140 : opts.f0,
      secs: opts.secs == null ? 0.6 : opts.secs });
    return {
      buffer: m.buffer, machine: m.machine, seconds: m.seconds, what: 'pipe', f0: opts.f0 == null ? 140 : opts.f0,
      why: 'the same free-free bar series struckMetal already uses for a held pipe, low and '
        + 'short: an anvil is a massive block bolted to a stump, so the ring bleeds into the '
        + 'ground almost at once instead of hanging the way a handheld length of steel does'
    };
  }

  /* A RIVET IS SET IN SEVERAL QUICK, SMALL BLOWS, NOT ONE. A rivet's own metal is tiny and
     stiff, so each blow rings even higher and shorter than boardNail's tack; what makes it a
     rivet gun and not one tap is the cadence, four strikes at a pneumatic hammer's working
     rate rather than a single hit. */
  function armourerRivets(ctx, opts) {
    opts = opts || {};
    var f0 = opts.f0 == null ? 2600 : opts.f0;
    var hitSecs = opts.hitSecs == null ? 0.035 : opts.hitSecs;
    var strikes = opts.strikes == null ? 4 : opts.strikes;
    var gapSec = opts.gapSec == null ? 0.09 : opts.gapSec;
    var sr = ctx.sampleRate;
    var one = struckMetal(ctx, { what: 'pipe', f0: f0, secs: hitSecs });
    var od = one.buffer.getChannelData(0), ol = od.length;
    var total = Math.round(sr * (gapSec * (strikes - 1))) + ol;
    var buf = ctx.createBuffer(1, total, sr), d = buf.getChannelData(0);
    var i, k, off;
    for (k = 0; k < strikes; k++) {
      off = Math.round(sr * gapSec * k);
      for (i = 0; i < ol && off + i < total; i++) d[off + i] += od[i];
    }
    normalise(d, total, 0.85);
    return {
      buffer: buf, machine: one.machine, seconds: total / sr, what: 'pipe', f0: f0, strikes: strikes,
      why: 'the same tiny, stiff pipe mode boardNail uses for a tack, raised higher still, struck '
        + 'four times at a rivet gun\'s own working cadence -- a rivet is set in several quick '
        + 'blows, never one'
    };
  }

  /* ==== 13b4. THE BAR'S GLASS (row [the soundscape], 10/10) ========================
     Rule 80a's own list names "the bar's murmur and glass"; the murmur is a crowd of
     voices and this lane's whole palette is struck, resonant and particle material,
     never a faked voice, so that half stays the standing gap every bar row in this
     lane has named. The glass half has no voice in it at all, so it builds. THE SAME
     CONSTRUCTION canOnWood ALREADY USES: a contact landing on the counter (objectSetDown,
     REUSED whole, zero new ground math) summed with a material's own ring (struckMetal,
     REUSED whole, one new table entry: glass). A bar counter is wood the same way the
     stall's counter is (REUSE-FIRST: no new surface either). */
  function barGlassDown(ctx, opts) {
    opts = opts || {};
    var wood = objectSetDown(ctx, { surface: 'boards', variant: opts.variant });
    var glass = struckMetal(ctx, { what: 'glass', f0: opts.f0 == null ? 650 : opts.f0,
      secs: opts.glassSecs == null ? 1.2 : opts.glassSecs });
    var sr = ctx.sampleRate;
    var wd = wood.buffer.getChannelData(0), gd = glass.buffer.getChannelData(0);
    var n = Math.max(wd.length, gd.length);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (i < wd.length ? wd[i] : 0) * 0.65 + (i < gd.length ? gd[i] : 0) * 0.6;
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: wood.machine, seconds: n / sr, woodSurface: wood.surface, glassF0: glass.f0,
      why: 'a glass\'s own single clear pitch (struckMetal\'s new glass mode) landing on the '
        + 'bar\'s wood counter (objectSetDown on boards) -- the same contact two ways at once '
        + 'canOnWood already uses for the tin can'
    };
  }

  /* ==== 13b5. THE BLOCK (row [not sand], the keep/redo list's own last eight) ===========
     records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md 3b: block is one of the 21 hard-contact
     ids measured with no real top end (0.289% of its energy above 4 kHz against the row's
     own 1% bar -- "a boot on concrete, brass on a floor... the contact is a step change in
     air pressure, and a step change is broadband by definition"). A BLOCK IS TWO HARD
     THINGS TOUCHING, THE SAME DEFINITION THE ROW ALREADY WROTE: a blade's edge glancing off
     a shield's rim or a haft, which is wood (the shield's core, or a spear's shaft) AND
     metal (the rim binding or the blade) in the same contact, at once -- canOnWood's own
     construction, a third time: objectSetDown (REUSED whole, zero new ground math) summed
     with struckMetal's existing 'pipe' mode (REUSED whole, zero new table entry; this is
     the only one of the three sounds built this way that needed no new material at all).
     SHORTER THAN A HELD STRIKE ON PURPOSE: a glancing parry does not pin the blade the way
     a smith's hammer pins an anvil, so most of the energy carries on into the follow-through
     rather than ringing in place -- the same real cause smithHammer already argues for an
     anvil's own stump, run the other way. */
  function weaponBlock(ctx, opts) {
    opts = opts || {};
    var wood = objectSetDown(ctx, { surface: 'boards', variant: opts.variant });
    var edge = struckMetal(ctx, { what: 'pipe', f0: opts.f0 == null ? 1700 : opts.f0,
      secs: opts.edgeSecs == null ? 0.15 : opts.edgeSecs });
    var sr = ctx.sampleRate;
    var wd = wood.buffer.getChannelData(0), ed = edge.buffer.getChannelData(0);
    var n = Math.max(wd.length, ed.length);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (i < wd.length ? wd[i] : 0) * 0.6 + (i < ed.length ? ed[i] : 0) * 0.65;
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: wood.machine, seconds: n / sr, woodSurface: wood.surface, edgeF0: edge.f0,
      why: 'a blade\'s edge glancing off a shield\'s wood-and-metal rim: the same contact '
        + 'canOnWood already sums two ways at once, a wood landing (objectSetDown on boards) '
        + 'with the blade\'s own pipe mode, held for a fraction of boardNail\'s already-brief tack'
    };
  }

  /* ==== 13b7. SOMETHING HERE STILL WORKS (Paolo, direct, 10/10: 'create more of the best
     sounds of all time instead of implementing mid sounds... impress me'). HIS RULING,
     NOT A REDO-LIST ITEM: build an ambitious, memorable moment, not another checkbox.

     WHAT THE MOMENT IS: finding something genuinely rare in a dead valley where almost
     nothing works any more. THE CONSTRUCTION IS REUSE-FIRST ALL THE WAY DOWN -- both
     layers are sounds this engine already shipped, zero new material, zero new table
     entries -- but the TECHNIQUE is new to this file: a real sidechain duck, the
     transient's own envelope pulling the sustained layer back while it is loudest, the
     way a mixer manages two real sources competing for the same air. Every composite
     sound this lane has built before this (canOnWood, barGlassDown, weaponBlock,
     partsPass) is a FLAT sum at a fixed ratio; this is the first one where one layer
     reacts to the other over time.

     THE BELL is struckMetal's own founder-tuned minor third (STRIKE.bell), the same
     material [bb ambience]'s hourly chime already uses -- reused for a second diegetic
     moment, not a second bell. A found object that still works, ringing true, is the
     "voice" of the moment: bright, immediate, the transient.

     THE HUM is powerOnHum, already shipped (a transformer's core pulling in, 40 to 120 Hz
     over 0.6 s) -- the valley itself catching up to the object, the sustained body under
     the ring. Two real electrical/acoustic causes, nothing invented, the sum timed so the
     hum's own rise lands under the bell's decay rather than racing it. */
  function legendaryFind(ctx, opts) {
    opts = opts || {};
    var f0 = opts.f0 == null ? 220 : opts.f0;
    var bellSecs = opts.bellSecs == null ? 2.5 : opts.bellSecs;
    var humSecs = opts.humSecs == null ? 2.2 : opts.humSecs;
    var duckAmount = opts.duckAmount == null ? 0.6 : opts.duckAmount;
    var bell = struckMetal(ctx, { what: 'bell', f0: f0, secs: bellSecs });
    var hum = powerOnHum(ctx, { secs: humSecs, riseSec: 0.6 });
    var sr = ctx.sampleRate;
    var bd = bell.buffer.getChannelData(0), hd = hum.buffer.getChannelData(0);
    var n = Math.max(bd.length, hd.length);
    var buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    var env = new Float64Array(n);
    /* THE SIDECHAIN FOLLOWER: a fast attack (2 ms), a slower release (120 ms), the
       standard shape a real compressor's detector uses so a duck snaps in on the hit
       and eases back out rather than chattering on every sample. Normalised to the
       bell's own loudest instant so duckAmount is a fraction of THIS strike, not an
       absolute level that would duck differently at a different f0 or gain. */
    var atk = Math.exp(-1 / (sr * 0.002)), rel = Math.exp(-1 / (sr * 0.12));
    var peak = 0, i;
    for (i = 0; i < n; i++) { var a = i < bd.length ? Math.abs(bd[i]) : 0;
      env[i] = a > (i ? env[i - 1] : 0) ? atk * (i ? env[i - 1] : 0) + (1 - atk) * a
                                        : rel * (i ? env[i - 1] : 0) + (1 - rel) * a;
      if (env[i] > peak) peak = env[i]; }
    for (i = 0; i < n; i++) {
      var duck = peak > 0 ? 1 - duckAmount * (env[i] / peak) : 1;
      d[i] = (i < bd.length ? bd[i] : 0) * 0.85 + (i < hd.length ? hd[i] * duck : 0) * 0.5;
    }
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: bell.machine, seconds: n / sr, bellF0: f0, duckAmount: duckAmount,
      /* the ratio the gate proves the duck really happened by: how loud the hum's own
         band reads inside the bell's loudest 50 ms against how loud it reads once the
         bell's transient has passed, when nothing is ducking it any more */
      why: 'struckMetal\'s own founder-tuned bell (the hourly chime\'s material, a second '
        + 'moment for it) ringing over powerOnHum\'s transformer catching in, the hum '
        + 'sidechain-ducked by the bell\'s own envelope -- the first sound in this file '
        + 'where one real layer reacts to another instead of a flat sum'
    };
  }

  /* ==== 13c. THE GROUND TAKES IT, AND BOOTS GOING SOMEWHERE (10/1) ===============
     Continuing the keep/redo list (records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md 3b):
     dirt_take ("the shot that missed arrives somewhere... built out of HIS instruments,
     not synthesis") and boots_go ("a gun leaves his rock to flank you") are both already
     solved by what this row built across the last two rounds. A missed shot hitting dirt
     is ONE contact with no stride to follow it -- footstepModelled's own heel strike with
     heelToe forced to zero, on the dirt material that already renders a dull, no-ring
     impact rather than a ring. Boots going somewhere IS a walk, so footstepWalk already
     plays it; the only question was which ground, and outdoors in a dead valley the
     honest default is dirt, not a sidewalk. */
  function groundTakesIt(ctx, opts) {
    return footstepModelled(ctx, Object.assign({}, opts || {}, { surface: (opts && opts.surface) || 'dirt', heelToe: 0 }));
  }
  function bootsGoDirt(ctx, opts) { return footstepWalk(ctx, Object.assign({}, opts || {}, { surface: 'dirt', perBeat: 1 })); }

  /* ==== 13d. IT GOES DOWN, AND SET IT DOWN AGAIN (10/1) ===========================
     set_down ("the weight arriving and settling. a low landing with the grit of it, NOT
     A CHIME") and seton_more ("placing a thing, twice, forever") are the same complaint
     this whole row has been solving since round one: a dull, textured contact that is
     never the same twice. set_down's own words rule out exactly what a bright plate mode
     would give it, so this reuses the sidewalk's own concrete material (an object set
     down on a real floor really does ring the floor, not itself, the same reasoning
     already proven for a boot) with heelToe forced to zero -- one contact, one piece of
     weight arriving, and the variant seed already built in means seton_more's "twice,
     forever" is free: ask for a second variant and it is a different placement. */
  function objectSetDown(ctx, opts) {
    return footstepModelled(ctx, Object.assign({}, opts || {}, { surface: (opts && opts.surface) || 'concrete', heelToe: 0 }));
  }
  /* seton_more IS set_down's own complaint ("placing a thing, twice, forever"), so its
     wrapper defaults to a different variant than set_down's own default -- the cheapest
     possible proof that asking twice does not render the same placement twice. */
  function objectSetDownAgain(ctx, opts) { return objectSetDown(ctx, Object.assign({ variant: 1 }, opts || {})); }

  /* ==== 14. THE DECK ITSELF, AND THE FLIP AS A TAPE CHANGING =======================
     *** RULE 32e, PAOLO 9/23, ON THE TAPE AND ON THE FLIP: "IT ALL SOUNDED LIKE SAND",
     "KINDA DOGSHIT". *** Both were band-limited noise wearing a mechanism's name, and the
     recipe is the graveyard, not the sound. These are their NEW ids, from REAL MATERIAL,
     and the material is the machine itself: a cassette transport, which is a set of
     plastic parts being knocked and a set of wheels turning at rates the standard fixes.

     *** THERE IS NOT ONE NOISE GENERATOR IN EITHER OF THESE FUNCTIONS, AND THE REASON IS
     NOT DISCIPLINE, IT IS THAT A TAPE DECK IS NOT MADE OF HISS. *** What a cassette deck
     actually sounds like is four things, and hiss is not among them:
       1. PLASTIC BEING KNOCKED    the lever, the head assembly, the shell seating
       2. THE SPEED NOT HOLDING    wow and flutter, on the programme, not beside it
       3. THE TAPE COMING UP TO    a real deck sweeps UP to speed over about 120 ms
          SPEED
       4. THE SIGNAL GOING AWAY    a drop-out is oxide LOST, so it is silence, not noise
     The hiss everybody reaches for is the recording medium's noise floor, which is the
     one part of a cassette that a phone speaker in a dead valley would never reproduce
     and the one part this lane kept reaching for anyway.

     *** EVERY RATE IN HERE IS THE GEOMETRY, NOT A NUMBER I LIKED. *** The Compact
     Cassette standard fixes the tape speed at 1 7/8 inches per second, which is 4.7625
     cm/s exactly, and a wheel's rotation rate is that speed divided by its circumference:
       capstan        2 mm across   ->  7.580 rev/s     THE FLUTTER RATE
       pinch roller   6 mm across   ->  2.527 rev/s
       hub, empty    22 mm across   ->  0.689 rev/s     THE WOW RATE AT THE START OF A SIDE
       reel, full    38 mm across   ->  0.399 rev/s     THE WOW RATE AT THE END OF ONE
     *** AND THAT LAST PAIR IS THE HONEST DETAIL THAT CARRIES THE WHOLE SOUND: THE WOW
     RATE FALLS AS THE SIDE PLAYS, because the tape piling onto the take-up reel makes it
     fatter, so it turns slower for the same tape speed. A deck at the end of a side
     breathes slower than the same deck at the start. That is why a tape sounds tired
     rather than broken, and it costs one parameter to be true instead of invented. Before
     this, the wobble rate in this file was 1.4 Hz, which is inside school rule 5's window
     and corresponds to no part of any machine.

     WHAT IS AN ESTIMATE AND SAID SO: the shell's LOSS FACTOR. Polystyrene's E, rho and v
     are published; how much energy a moulded shell loses per cycle depends on the mould
     and what it is resting against, so 2% is an engineering estimate for a filled
     polymer, in the same spirit as the slab's 0.40 in GROUND. The mode FREQUENCIES are
     the plate formula's, unchanged, off the same function the footstep uses. */

  /* THE CASSETTE, MEASURED IN MILLIMETRES BECAUSE THAT IS HOW THE STANDARD WRITES IT */
  var TAPE_CM_PER_S = 4.7625;      /* 1 7/8 ips, exact, by the standard */
  var TRANSPORT = {
    capstanMm:  2.0,
    rollerMm:   6.0,
    hubMm:      22.0,             /* an empty hub, at the teeth */
    fullReelMm: 38.0,             /* a wound C60 side */
    spinUpS:    0.120,            /* the tape coming up to speed once the roller grabs */
    why: 'a Compact Cassette transport: 4.7625 cm/s by the standard, and every rate below is that speed over a circumference'
  };
  /* the shell: polystyrene, and the plate formula does the rest. The walls are the thing
     that rings when a lever hits the mechanism, and they are 1.2 mm of it. */
  var SHELL = {
    E: 3.2e9, rho: 1050, v: 0.34, h: 0.0012, a: 0.064,
    /* *** LOSS CORRECTED 9/28: Paolo, "I hated all these noiseS", on the deck and the
       flip both, which share this shell. Measured on the rendered buffer: flatness
       0.0000, essentially a pure tone, and the 493 Hz fundamental alone carried 55.8% of
       the loudest window's whole energy -- a 32 ms ring at a clean pitch is a chime, not
       a clack, and it is the SAME mechanism the struck-hour bell uses on purpose (a low
       loss factor, a long clean ring) landing here by accident. *** THE OLD ESTIMATE WAS
       THE BARE MATERIAL'S OWN LOSS, AND THIS SHELL IS NOT FREE: it is held in a hand and
       seated against a mechanism, so it is damped by everything touching it, the same
       reason a slab on grade needs a higher loss than a free plate (footstepModelled's
       own correction, this same lane, an earlier round). 0.22 gives the fundamental a
       ~2.3 ms tail, in the footstep's own ground-mode range, so it reads as a knock. */
    loss: 0.22,
    tau:  0.00035,                /* the contact time of plastic on plastic: short, so it clacks */
    why:  'a moulded polystyrene cassette shell, 1.2 mm walls, 64 mm across, damped by the hand and the mechanism holding it'
  };
  function revsPerSecond(diameterMm) {
    return TAPE_CM_PER_S / (Math.PI * diameterMm / 10);
  }
  /* the wow rate anywhere through a side: 0 is the first minute, 1 is the last */
  function wowRateAt(through) {
    var a = revsPerSecond(TRANSPORT.hubMm), b = revsPerSecond(TRANSPORT.fullReelMm);
    return a + (b - a) * Math.max(0, Math.min(1, through));
  }

  /* A SPARSE TRAIN OF CRACKLE, FOR ATMOSPHERIC STATIC ON A RADIO BAND. Real static is not
     a smooth hiss bed: it is distant lightning (sferics), which arrives as discrete
     broadband clicks, a few to a few dozen a second depending on weather and distance.
     Same mechanism as the footstep's grit (a seeded sum of tiny impulses, not a noise
     generator) reused for a third material: a struck slab, a struck shell, now a struck
     sky. Rate and level are engineering estimates for background atmospheric noise and
     are named as such; the impulse SHAPE (a half-sine click, broadband by construction)
     is not a choice. */
  function crackleInto(d, n, sr, ratePerSec, amp, seed, marginSamples) {
    var count = Math.round(ratePerSec * (n / sr));
    var s = seed, q, j, events = [];
    var lo = marginSamples || 0, span = n - 2 * lo;
    for (q = 0; q < count; q++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      var fracT = s / 0x7fffffff;
      var t0 = lo + Math.round(fracT * span);
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      var fracA = s / 0x7fffffff;
      var w = Math.max(2, Math.round((0.0006 + fracA * 0.0012) * sr));  /* 0.6 to 1.8 ms */
      var lvl = amp * (0.3 + 0.7 * fracA);                              /* distant vs near */
      var prev = 0;
      for (j = 0; j < w && t0 + j < n; j++) {
        var f = Math.sin(Math.PI * j / w);
        d[t0 + j] += (f - prev) * lvl;
        prev = f;
      }
      events.push(t0);
    }
    return events;
  }

  /* ONE CLACK: a piece of plastic struck, ringing the shell's own modes. This is the
     footstep's contact physics and the bell's modal sum, on a third material, which is
     REUSE-FIRST doing what it is for: no third copy of either idea. */
  function clackInto(d, n, sr, at, gain) {
    var modes = plateModes(SHELL, 10);
    var i0 = Math.round(at * sr), i, q;
    /* the contact: a half-sine force pulse radiating as its own rate of change */
    var w = Math.max(2, Math.round(SHELL.tau * sr)), prev = 0;
    for (i = 0; i < w && i0 + i < n; i++) {
      var f = Math.sin(Math.PI * i / w);
      d[i0 + i] += (f - prev) * 0.55 * gain;
      prev = f;
    }
    var rung = [];
    for (q = 0; q < modes.length; q++) {
      var hz = modes[q].hz;
      if (hz >= sr / 2) continue;
      /* the same amplitude e-fold as the slab and the bell: 1/(pi f loss) */
      var tail = 1 / (Math.PI * hz * SHELL.loss);
      /* the higher modes are excited harder by a short sharp contact and die sooner,
         which together are the whole difference between a clack and a knock */
      var lvl = gain / (1 + q * 0.55);
      rung.push({ hz: +hz.toFixed(1), tailSeconds: +tail.toFixed(4), level: +lvl.toFixed(3) });
      for (i = 0; i0 + i < n; i++) {
        var t = i / sr, env = Math.exp(-t / tail);
        if (env < 1e-4) break;
        d[i0 + i] += Math.sin(2 * Math.PI * hz * t) * lvl * env;
      }
    }
    return rung;
  }

  /* ONE SPEED LAW, USED BY THE DECK AND BY THE PROBE THAT MEASURES IT.
     r is how far the head advances per output sample: 1 is dead on speed.
       the spin-up   a deck sweeps UP to speed over about 120 ms after the roller grabs
       the wow       once per turn of the take-up reel, 0.69 Hz falling to 0.40 Hz
       the flutter   once per turn of the capstan, 7.58 Hz, much smaller
     Both wobbles are there at once because both wheels are there at once. */
  function transportSpeed(t, sp) {
    var ramp = 1 - Math.exp(-t / sp.spinUp);
    return ramp * (1 + sp.wow * Math.sin(2 * Math.PI * sp.fWow * t)
                     + sp.flut * Math.sin(2 * Math.PI * sp.fFlut * t));
  }

  /* THE DECK: press play, the mechanism takes the tape, the song comes up to speed.
     what: 'deck'    the whole thing, the song included            <- ships
           'machine' the mechanism alone, for when nothing is playing
           'worn'    the same deck with a flat spot on the roller  */
  function theTapeDeck(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var which = opts.what || 'deck';
    var through = opts.through == null ? 0.15 : opts.through;   /* where in the side */
    var beat = opts.beat == null ? BEAT : opts.beat;
    var secs = opts.secs == null ? (which === 'machine' ? 1.0 : 3.0) : opts.secs;
    var n = Math.round(sr * secs);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* 1. THE MECHANISM. Two knocks, not one: the lever goes over, and 45 ms later the
       head assembly and the pinch roller arrive against the tape. A single clack is a
       button; two are a machine, and the gap is the part that says so. */
    var LEVER = 0.0, SEAT = 0.045;
    /* `knocks` exists so a checker can build the WRONG deck and watch the claim fail: one
       knock is a button, two are a machine, and a claim that cannot be falsified is not a
       claim. Same reason bandTo carries its `legacy` flag. Nothing in the game passes it. */
    var knocks = opts.knocks == null ? 2 : opts.knocks;
    var rung = clackInto(d, n, sr, LEVER, 0.80);
    if (knocks > 1) clackInto(d, n, sr, SEAT, 0.62);

    /* 2. THE SPEED. The roller grabs at SEAT, and the tape sweeps up over 120 ms: a real
       deck does not start at pitch, and this is the thing a whoosh was standing in for. */
    var fWow = wowRateAt(through);
    var fFlut = revsPerSecond(TRANSPORT.capstanMm);
    var wowDepth  = opts.wowDepth  == null ? 0.0035 : opts.wowDepth;   /* rule 5: 0.15 to 0.6% */
    var flutDepth = opts.flutDepth == null ? 0.0008 : opts.flutDepth;
    /* *** AND C IS DELIBERATELY OUTSIDE SCHOOL RULE 5, WHICH IS WHAT 'WORN' MEANS. ***
       I first wrote "still inside rule 5" here and the measurement said otherwise: the two
       wobbles together come to 0.635% on a tone, against rule 5's 0.15 to 0.60% window.
       A deck this tired is a deck outside the spec the standard sets for it, so the number
       being out of the window is the option, not a slip. A ships at 0.358%, inside. */
    if (which === 'worn') { wowDepth = 0.0058; flutDepth = 0.0026; }

    /* THE SPEED LAW LIVES IN transportSpeed() AND NOTHING COPIES IT, because the probe
       below has to measure THE SAME FUNCTION the deck plays through. The first cut of
       this round measured the wobble on the SONG by counting zero crossings, which read a
       318% "pitch spread" -- that was the music changing notes, not the tape slipping. A
       WOBBLE IN A READ SPEED CANNOT BE MEASURED ON A TUNE; it needs a steady tone, which
       is exactly why wowProbe exists, and this is that lesson reused rather than relearnt. */
    var sp = { wow: wowDepth, flut: flutDepth, fWow: fWow, fFlut: fFlut, spinUp: TRANSPORT.spinUpS };
    var programme = null, pn = 0;
    if (which !== 'machine') {
      var song = songThroughSpeaker(ctx, { secs: secs, beat: beat });
      programme = song.buffer.getChannelData(0);
      pn = programme.length;
    }
    if (programme) {
      var pos = 0;
      var i0 = Math.round(SEAT * sr);
      for (i = i0; i < n; i++) {
        var t = (i - i0) / sr;
        var r = transportSpeed(t, sp);
        var j = Math.floor(pos), f2 = pos - j;
        var a = (j >= 0 && j < pn) ? programme[j] : 0;
        var b = (j + 1 >= 0 && j + 1 < pn) ? programme[j + 1] : 0;
        /* the programme fades in with the ramp too, because a tape at half speed is also
           being read at less head-to-tape contact than it wants */
        var ramp = 1 - Math.exp(-t / TRANSPORT.spinUpS);
        d[i] += (a + (b - a) * f2) * 0.85 * Math.min(1, ramp * 1.6);
        pos += r;
        if (pos > pn - 2) pos = pn - 2;
      }
    }

    for (i = 0; i < n; i++) d[i] = Math.tanh(d[i] * 0.9) * 0.94;
    var fade = Math.min(n, Math.round(0.12 * sr));
    for (i = 0; i < fade; i++) d[n - fade + i] *= 0.5 * (1 + Math.cos(Math.PI * i / fade));
    normalise(d, n, 0.85);

    return {
      buffer: buf, machine: MACHINE.EAR, seconds: n / sr, what: which,
      noiseSources: 0,
      clacks: knocks, clackGapMs: +((SEAT - LEVER) * 1000).toFixed(1),
      shellModes: rung,
      wowRateHz: +fWow.toFixed(4), flutterRateHz: +fFlut.toFixed(4),
      wowDepth: wowDepth, flutterDepth: flutDepth,
      through: through, spinUpMs: TRANSPORT.spinUpS * 1000,
      wowRateStartHz: +revsPerSecond(TRANSPORT.hubMm).toFixed(4),
      wowRateEndHz: +revsPerSecond(TRANSPORT.fullReelMm).toFixed(4),
      hasProgramme: !!programme,
      speed: sp,
      why: which === 'machine'
        ? 'the transport alone: the lever, the head seating 45 ms later, and the shell ringing its own modes'
        : (which === 'worn'
          ? 'the same deck with a flat spot on the roller, so it breathes harder and faster'
          : 'press play: the lever, the head seating, and the song sweeping up to speed on a reel that breathes at 0.69 Hz')
    };
  }

  /* A STEADY TONE THROUGH THE SAME TRANSPORT, FOR MEASUREMENT ONLY, AND THE GAME NEVER
     PLAYS IT. Same reasoning as wowProbe, and for the same reason it had to exist: a
     wobble is a property of a pitch over TIME, and the deck's programme is a tune whose
     notes change every 460 ms, so counting anything on the tune measures the tune. This
     hands the probe THE DECK'S OWN transportSpeed(), not a second copy of it, so a claim
     measured here is a claim about what he hears. */
  function transportProbe(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate, secs = opts.secs == null ? 6 : opts.secs;
    var which = opts.what || 'deck';
    var hz = opts.hz == null ? 440 : opts.hz;
    var n = Math.round(sr * secs);
    var tone = new Float32Array(n), ph = 0, i;
    for (i = 0; i < n; i++) { ph += 2 * Math.PI * hz / sr; tone[i] = Math.sin(ph) * 0.8; }
    var sp = {
      wow:  opts.wowDepth  == null ? (which === 'worn' ? 0.0058 : 0.0035) : opts.wowDepth,
      flut: opts.flutDepth == null ? (which === 'worn' ? 0.0026 : 0.0008) : opts.flutDepth,
      fWow: wowRateAt(opts.through == null ? 0.15 : opts.through),
      fFlut: revsPerSecond(TRANSPORT.capstanMm),
      /* THE SPIN-UP IS SWITCHED OFF FOR THE PROBE BY DEFAULT, and said so out loud: a
         ramp from zero is a much bigger speed change than the wobble, so leaving it in
         would swamp the thing being measured. The deck keeps it; the ruler does not. */
      spinUp: opts.spinUp == null ? 1e-9 : opts.spinUp
    };
    var out = ctx.createBuffer(1, n, sr), d = out.getChannelData(0);
    var pos = 0;
    for (i = 0; i < n; i++) {
      var r = transportSpeed(i / sr, sp);
      var j = Math.floor(pos), f = pos - j;
      var a = (j >= 0 && j < n) ? tone[j] : 0;
      var b = (j + 1 >= 0 && j + 1 < n) ? tone[j + 1] : 0;
      d[i] = a + (b - a) * f;
      pos += r;
      if (pos > n - 2) pos = n - 2;
    }
    return { buffer: out, machine: { lo: 40, hi: 12000, why: 'a test tone, not a game sound' },
             seconds: secs, toneHz: hz, probe: true, speed: sp, what: which,
             noiseSources: 0,
             why: 'a steady 440 Hz tone through the deck\'s own speed law, so the two wobbles can be measured instead of described' };
  }

  /* THE FLIP, AS THE THING IT ALREADY SAID IT WAS: A TAPE CHANGING.
     *** AND THE OLD ONE'S REAL DEFECT WAS NOT ONLY THE NOISE. It declared the AM band
     while its own gap was deliberately wider-banded than any AM channel, so the number it
     published never described the sound: the third time this lane has caught a claim
     asking the wrong question. This one is heard with your ears in the room, so it
     declares EAR and there is no band to lie about. ***
     *** AND IT IS HONEST ABOUT WHAT IT IS NOT: A REAL TAPE CHANGE TAKES SECONDS AND HE
     WILL DO THIS HUNDREDS OF TIMES. *** So this is not a whole tape change slowed down to
     fit; it is the last part of one, the part you actually hear: the shell seating and the
     transport taking it. One beat, no riser, no stinger.
     what: 'change' the shell seats and the transport engages   <- ships
           'seat'   one clack, the shell only
           'door'   the old one comes out first, three knocks, and it runs past a beat */
  function theTapeChange(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var which = opts.what || 'change';
    var beat = opts.beat == null ? BEAT : opts.beat;
    /* WHERE THE KNOCKS FALL, and the first is always ON the beat (the 120 BPM law is
       about when a sound STARTS). The gaps are a hand's speed, not a musical figure. */
    var AT = which === 'seat' ? [0]
           : which === 'door' ? [0, 0.145, 0.315]
           : [0, 0.155];
    var GAIN = which === 'seat' ? [0.92]
             : which === 'door' ? [0.70, 0.92, 0.66]
             : [0.92, 0.66];
    var tail = Math.max.apply(null, AT) + 0.34;
    var n = Math.round(sr * Math.max(beat, tail));
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i, rung = null;
    for (i = 0; i < AT.length; i++) {
      var r = clackInto(d, n, sr, AT[i], GAIN[i]);
      if (!rung) rung = r;
    }
    for (i = 0; i < n; i++) d[i] = Math.tanh(d[i] * 0.9) * 0.94;
    var fade = Math.min(n, Math.round(0.08 * sr));
    for (i = 0; i < fade; i++) d[n - fade + i] *= 0.5 * (1 + Math.cos(Math.PI * i / fade));
    normalise(d, n, 0.85);
    return {
      buffer: buf, machine: MACHINE.EAR, seconds: n / sr, what: which,
      noiseSources: 0,
      clacks: AT.length, atMs: AT.map(function (x) { return +(x * 1000).toFixed(1); }),
      shellModes: rung, beatSeconds: beat,
      fitsOneBeat: n / sr <= beat + 1e-6,
      why: which === 'seat' ? 'one clack: the shell seating and nothing else'
         : (which === 'door' ? 'the old shell out, the new one in, the transport taking it: three knocks, and it runs past a beat'
                             : 'the shell seats and the transport takes it: the part of a tape change you actually hear, inside one beat')
    };
  }

  /* ==== 10. THE VALLEY STILL BROADCASTS ==========================================
     DIRECTION'S BIBLE, RULE 9, AND NOTHING IN THIS GAME DOES IT: "THE MACHINES KEEP
     TALKING. Broadcasts, PA calls and signs repeat on schedule whatever happens; the
     120 BPM beat is the dead pulse they ride. Repetition is the dread; the content
     never acknowledges you." (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md)
     There is no broadcast, no PA and no scheduled emission anywhere in the build.

     AND IT IS THE ONE PLACE TAPE DAMAGE IS LEGAL. The bible's rule 8 is DIEGETIC OR
     DEAD -- static, scanlines, tape damage and drop-outs live ONLY inside in-world
     screens and speakers, and the lens is an eye. This module already carries that
     ruling on MACHINE.EAR. A transmitter is the in-world speaker, so the band, the
     hiss, the wobble and the drop-outs belong here by right rather than by taste,
     which is why this is the redo the keep/redo list puts first.

     THE NUMBERS ARE PUBLISHED STANDARD, NOT INVENTED, AND ONE OF THEM IS A GIFT:
       the two-tone attention signal is 853 Hz and 960 Hz TOGETHER, and the standard
       asks for it to run 8 TO 25 SECONDS. Eight seconds at 120 BPM is exactly
       SIXTEEN BEATS, which is FOUR BARS. The real minimum duration of a real
       emergency signal lands on this game's own grid with nothing bent.
       Then the dead air: one bar, carrier only, and nobody ever speaks.

     THE HORROR IS THE THING THAT DOES NOT HAPPEN. The signal is what plays BEFORE an
     announcement. Ours is followed by a bar of carrier and then it starts again, so
     the machine has been clearing its throat for ten years with nothing to say. No
     riser, no stinger, nothing rises (rule 20). The content never acknowledges you,
     which is the bible's own sentence.

     THE SHAPE AROUND THE CARRIER IS UNCHANGED FROM WHAT ALREADY SHIPPED: same pair as
     the phone he voted UP, same AM band and the same four-pole limit (steep BY
     REGULATION), same drop-out shape as every other one in this file, and the slipping
     head now reads the SAME transport geometry the tape deck does rather than its own
     number. WHAT IS NEW, ROUND [not sand] 9/27: the carrier itself, which used to be
     the noise generator dressed as static and is now a mains hum plus a sparse click
     train, neither of them a noise generator. */
  function theBroadcast(ctx, opts) {
    opts = opts || {};
    var sr = ctx.sampleRate;
    var beat = opts.beat == null ? BEAT : opts.beat;
    /* 16 beats of signal = 8.0 s = the standard's own minimum; then 4 beats of dead air */
    var toneBeats = opts.toneBeats == null ? 16 : opts.toneBeats;
    var airBeats  = opts.airBeats  == null ? 4  : opts.airBeats;
    var wear = opts.wear == null ? 1 : opts.wear;   /* 0 = as it left the station */
    var n = Math.round(sr * (toneBeats + airBeats) * beat);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    var i;

    /* *** THE CARRIER, REBUILT (round [not sand], 9/27), AND NOT ONE NOISE GENERATOR IN
       IT. *** This was the row's own IOU, pulled from queue last time because its carrier
       and wear were the noise generator dressed as static: "registering it would have been THE
       FOURTH SAND SOUND IN A ROW." What is really under an AM carrier's hiss is two real
       things, neither of them a noise generator:
         1. THE TRANSMITTER'S OWN MAINS RIPPLE: the same 60 Hz family the room hums with,
            because it is the same grid (rule 7, "THE GRID IS ON IN BOTH ACTS"). Reused
            straight from ROOM_HUM / ROOM_PARTS rather than a second copy of the numbers.
         2. ATMOSPHERIC STATIC, WHICH IS SFERICS, NOT A HISS BED: distant lightning
            arrives at a receiver as discrete broadband clicks, a handful a second in
            quiet weather, not a smooth wash. crackleInto is the footstep's grit reused a
            third time (REUSE-FIRST), on a struck sky instead of a struck slab or shell.
       WEAR BUYS MORE OF BOTH, AND FOR TWO SEPARATE REAL REASONS: a corroded antenna and
       dirty contacts let more atmospheric noise in, and the power supply's own filter
       capacitor dries out over a decade, which is a well-documented aging failure and
       means less ripple filtering, so the hum rises too. Both numbers below are
       engineering estimates and are named as such; the click SHAPE (a half-sine impulse,
       broadband by construction) is not a choice. */
    var crackleRate = opts.crackleRate != null ? opts.crackleRate : (wear ? 220 : 30);  /* clicks/s, ESTIMATE */
    var crackleAmp  = opts.crackleAmp  != null ? opts.crackleAmp  : (wear ? 0.34 : 0.15); /* ESTIMATE */
    /* *** AND WEAR DOES BUY MORE HUM AFTER ALL, AND IT IS NOT A KNOB, IT IS A CAPACITOR.
       *** A power supply's ripple is filtered by an electrolytic capacitor, and those
       capacitors dry out over years: less filtering, more ripple on the rail, MORE hum,
       which is a well-documented aging failure and not the "not a maintenance question"
       this comment first said. Corrected in the same round it was written: ten years of
       neglect buys both a noisier antenna (static) and a drier capacitor (hum). */
    var humLevel = opts.humLevel != null ? opts.humLevel : (wear ? 0.62 : 0.28);  /* ESTIMATE */
    /* A SHORT PRE-ROLL SO THE FILTER IS ALREADY WARM AT SAMPLE 0. bandTo has memory that
       starts at zero, so without this the first cycle of hum carries a transient the last
       cycle does not, and the loop would click at the wrap for a reason that has nothing
       to do with the sound. The margin also keeps every crackle click clear of both ends,
       so nothing straddles the wrap. This replaces the old noise-and-blend seam trick,
       which existed only because a stochastic bed has no natural phase to close on; a
       periodic hum does, once the filter has settled into it. */
    var pre = Math.max(1, Math.round(0.05 * sr));
    var work = new Float32Array(n + pre);
    for (i = 0; i < work.length; i++) {
      var t = i / sr, h = 0;
      for (var k = 0; k < ROOM_PARTS.length; k++)
        h += Math.sin(2 * Math.PI * ROOM_HUM * ROOM_PARTS[k][0] * t) * ROOM_PARTS[k][1];
      work[i] = h * humLevel;
    }
    crackleInto(work, work.length, sr, crackleRate, crackleAmp, wear ? 51413 : 51417,
                pre + Math.round(0.02 * sr));
    var pband = bandTo(work, work.length, MACHINE.AM.lo, MACHINE.AM.hi, sr, 4);
    for (i = 0; i < n; i++) d[i] = work[pre + i];
    /* THE TAIL POLES THAT USED TO BE HERE ARE GONE TOO: bandTo is a real filter now and
       the dead air, which is the carrier ALONE and therefore the worst case for a leak,
       measures inside school rule 4 without any help. */
    var carrierLevel = 0.30;
    for (i = 0; i < n; i++) d[i] *= carrierLevel;
    var seam = 0;   /* reported field kept for the gate; there is no seam blend any more */

    /* THE PAIR, SOUNDED TOGETHER FOR SIXTEEN BEATS */
    var onFor = Math.round(sr * toneBeats * beat);
    var pa = 0, pb = 0;
    for (i = 0; i < onFor && i < n; i++) {
      /* 8 ms in and out: an institution's tone does not thump */
      var env = Math.min(1, i / (sr * 0.008));
      var tail = Math.min(1, (onFor - i) / (sr * 0.008));
      pa += 2 * Math.PI * ALERT.a / sr;
      pb += 2 * Math.PI * ALERT.b / sr;
      d[i] += (Math.sin(pa) + Math.sin(pb)) * 0.5 * env * tail * 0.85;
    }

    /* THE DROP-OUTS, AND ONLY WHEN THE MACHINE IS WORN. Rule 6's shape exactly: a
       dive, never a cut, and the top goes before the level. PLACED OFF THE BEAT, the
       same reasoning the song through the speaker used: a fault ON the beat reads as
       rhythm, and a transmitter failing is not playing along. */
    var drops = [];
    if (wear) {
      var atBeats = [5.3, 11.7];    /* deliberately not on a beat line */
      for (var k = 0; k < atBeats.length; k++) {
        var at = Math.round(sr * atBeats[k] * beat), len = Math.round(sr * 0.034);
        if (at + len >= n) continue;
        var seg = new Float32Array(len), j;
        for (j = 0; j < len; j++) seg[j] = d[at + j];
        onePoleLow(seg, len, 900, sr);            /* the top goes first */
        var fg = Math.pow(10, -12 / 20);          /* 12 dB down: inside rule 6's 6 to 20 */
        for (j = 0; j < len; j++) {
          var u = j / len;
          d[at + j] = seg[j] * (u < 0.3 ? 1 - (1 - fg) * (u / 0.3)
                                        : fg + (1 - fg) * Math.pow((u - 0.3) / 0.7, 1.5));
        }
        drops.push({ atSeconds: +(atBeats[k] * beat).toFixed(4),
                     lengthMs: +(len / sr * 1000).toFixed(1), downDb: 12 });
      }
    }

    normalise(d, n, 0.85);

    /* THE SLIPPING HEAD, LAST, so the wobble is on everything the machine plays and
       not only on the tone. The length is preserved to a sample, so the 120 BPM law is
       untouched: a signal that started on the beat still starts on the beat.
       *** THE RATE IS THE DECK'S OWN GEOMETRY, NOT A NUMBER I LIKED (round [not sand],
       9/27), because this is the same shape of loop tape theTapeDeck plays: THE VALLEY
       STILL BROADCASTS is a dead PA system replaying a recorded loop, which is why a
       tape mechanism belongs here at all. wowRateAt(through) is the same function the
       deck exposes, so the two do not carry two different guesses about how fast a
       reel breathes. The depth (0.35%) is unchanged: rule 5's window, not the geometry's
       question. What this replaces: a bare 1.4 Hz, which was inside the rule and matched
       no wheel this file has ever measured. */
    var wow = null;
    /* opts.wow exists so a control can switch the head to PERFECT while leaving
       everything else alone. A control that changes two things at once proves nothing
       about either, and this lane has already shipped a mutation that was a no-op. */
    var wantWow = (opts.wow == null) ? !!wear : !!opts.wow;
    if (wantWow) {
      var wowHz = wowRateAt(opts.through == null ? 0.5 : opts.through);
      var w = wowFlutter(ctx, buf.getChannelData(0), { depth: 0.0035, rate: wowHz });
      buf = w.buffer; d = buf.getChannelData(0);
      wow = { depth: w.depth, rate: w.rate };
    }

    return {
      buffer: buf, machine: MACHINE.AM, bandOrder: pband.order, bandCornerHz: pband.corner,
      seconds: (toneBeats + airBeats) * beat,
      tones: [ALERT.a, ALERT.b], beatBetweenHz: ALERT.b - ALERT.a,
      toneSeconds: toneBeats * beat, airSeconds: airBeats * beat,
      /* the same two field names the rest of this file hands back, so the checker's
         existing dive and carrier machinery reads this recipe without a second copy */
      toneOnForSeconds: toneBeats * beat, dropMs: 34, depthDb: 12,
      loops: true, seamSeconds: +(seam / sr).toFixed(4),
      toneBeats: toneBeats, airBeats: airBeats, bars: (toneBeats + airBeats) / 4,
      wear: wear, hiss: crackleAmp, carrierLevel: carrierLevel, dropouts: drops, wow: wow,
      /* noiseSources:0 for the structural check (round [not sand], 9/27): the carrier is
         mains hum plus a sparse click train now, never the noise generator. crackleRate
         and crackleAmp are the wear-scaled static; humLevel is the ripple, which wear
         does not touch. */
      noiseSources: 0, crackleRate: crackleRate, crackleAmp: crackleAmp, humLevel: humLevel,
      why: wear
        ? 'the attention signal off a transmitter nobody has touched in ten years, then a bar of dead air, and nobody ever speaks'
        : 'the attention signal as it leaves the station: the band and the carrier a real transmitter has, and no wear at all'
    };
  }

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
    bandTo(outside, n, 100, 5000, sr, 2, opts.band);
    noiseInto(inside, n, 1, 4402);
    bandTo(inside, n, 60, 2200, sr, 2, opts.band);                   /* narrower, and lower */

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
    bandTo(latch, L, 400, 4200, sr, 2, opts.band);
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
    theFlip: theFlip,
    walkCadence: walkCadence,
    roomHum: roomHum,
    harmonicHum: harmonicHum,
    generatorHum: generatorHum,
    powerOnHum: powerOnHum,
    signAliveHum: signAliveHum,
    ROOM: { sec: ROOM_SEC, hum: ROOM_HUM, lo: ROOM_LO, hi: ROOM_HI, seam: ROOM_SEAM,
            parts: ROOM_PARTS, humMix: ROOM_HUM_MIX, hissMix: ROOM_HISS_MIX,
            relShipped: ROOM_REL_SHIPPED,
            /* THE FILTER, so the checker can compare the MACHINE and not only the
               numbers. The two rooms matched on every constant for rounds while running
               different filters at different corners. */
            bandOrder: ROOM_BAND_ORDER },
    /* THE VALLEY'S LIVE AMBIENT INSTANCE (10/10), THE SAME SHAPE ROOM ALREADY IS:
       this module's theBroadcast renders offline for judge pages; the alpha's
       BROADCAST object (same name, duplicated, never shared) plays a live
       buffer through live filter nodes. These are the constants the gate reads
       the alpha's own source text against, so the two cannot quietly diverge
       the way ROOM's filter once did while its numbers kept matching. */
    BROADCAST_CONST: { toneBeats: 16, airBeats: 4, beat: 0.5, lo: MACHINE.AM.lo,
            hi: MACHINE.AM.hi, crackleRate: 220, crackleAmp: 0.34, humLevel: 0.62,
            carrierLevel: 0.30, bandOrder: ROOM_BAND_ORDER },
    /* THE BAR'S GLASS, LIVE (10/10): sounds-the-bars-glass-10-10 is APPROVED and never
       wired. barGlassDown is pure buffer math (objectSetDown/footstepModelled and
       struckMetal, no filter node anywhere in either), so the alpha's own BARGLASS
       object duplicates the same math directly rather than a filter chain -- simpler
       than ROOM/BROADCAST because there is no filter to keep in sync, but the same
       discipline: the gate reads these constants against the alpha's own source text
       so the two copies cannot quietly diverge. */
    BARGLASS_CONST: { woodE: GROUND.boards.E, woodRho: GROUND.boards.rho, woodV: GROUND.boards.v,
            woodLoss: GROUND.boards.loss, woodH: GROUND.boards.h, woodA: GROUND.boards.a,
            woodTau: GROUND.boards.tau, woodGrains: GROUND.boards.grains,
            glassF0: STRIKE.glass.f0, glassDamp: STRIKE.glass.damp, glassSecs: STRIKE.glass.secs,
            glassHit: STRIKE.glass.hit, woodMix: 0.65, glassMix: 0.6 },
    songOnTape: songOnTape,
    titleTheme: titleTheme,
    barberClippers: barberClippers,
    canOnWood: canOnWood,
    boardNail: boardNail,
    paperRustle: paperRustle,
    smithHammer: smithHammer,
    armourerRivets: armourerRivets,
    barGlassDown: barGlassDown,
    weaponBlock: weaponBlock,
    legendaryFind: legendaryFind,
    wowFlutter: wowFlutter,
    wowProbe: wowProbe,
    theFold: theFold,
    fightCloud: fightCloud,
    theDoor: theDoor,
    theBroadcast: theBroadcast,
    crackleInto: crackleInto,
    footstepModelled: footstepModelled,
    footstepDirt: footstepDirt,
    footstepSand: footstepSand,
    footstepWood: footstepWood,
    footstepWalk: footstepWalk,
    footstepWalkConcrete: footstepWalkConcrete,
    footstepWalkWood: footstepWalkWood,
    footstepRunConcrete: footstepRunConcrete,
    travelRoadBed: travelRoadBed,
    travelDirtBed: travelDirtBed,
    nightInsects: nightInsects,
    groundTakesIt: groundTakesIt,
    bootsGoDirt: bootsGoDirt,
    objectSetDown: objectSetDown,
    objectSetDownAgain: objectSetDownAgain,
    struckMetal: struckMetal,
    endTurnClick: endTurnClick,
    STRIKE: STRIKE,
    theTapeDeck: theTapeDeck,
    theTapeChange: theTapeChange,
    transportProbe: transportProbe,
    transportSpeed: transportSpeed,
    TRANSPORT: TRANSPORT,
    SHELL: SHELL,
    revsPerSecond: revsPerSecond,
    wowRateAt: wowRateAt,
    TAPE_CM_PER_S: TAPE_CM_PER_S,
    /* exported so a judge page can play the BEFORE from THIS function and never from a
       second copy of it, and so a checker can measure the filter on its own */
    bandTo: bandTo,
    butterQ: butterQ,
    GROUND: GROUND,
    plateModes: plateModes,
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
          title: 'THE TAPE IS SLIPPING' },
        /* *** THE VALLEY STILL BROADCASTS IS BUILT, MEASURED AND NOT IN THIS LIST, AND
           THAT IS THE POINT. It was cooked this round, and then his second batch of votes
           landed: the tape, the run and the flip all DOWN with one complaint said three
           ways -- "it all sounded like sand", "not this sand-sounding shit like I'm on the
           beach", "kinda dogshit". Rule 32e (laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md
           s5) makes the BAND-LIMITED-NOISE RECIPE the graveyard, not one sound.
           The broadcast's carrier and its wear are that recipe. Putting it in front of him
           would be the fourth sand sound in a row, and STOP PRODUCING says finding a legal
           way to ship anyway IS the violation. So it stays in the module, held by its gate
           claims, and it goes to VOTE only if it is rebuilt from real material. *** */
        { id: 'sounds-a-footstep-that-is-not-sand-9-24', make: 'footstepModelled',
          title: 'A FOOTSTEP THAT IS NOT SAND' },
        { id: 'sounds-the-sand-is-out-9-24', make: 'theDoor',
          title: 'THE SAND IS OUT OF THE ONES YOU LIKED' },
        { id: 'sounds-what-this-valley-strikes-9-24', make: 'struckMetal',
          title: 'WHAT THIS VALLEY STRIKES ON THE HOUR' },
        /* THE TWO HE KILLED FOR SOUNDING LIKE SAND, BACK AS NEW IDS FROM REAL MATERIAL
           (rule 32e, and rule 15b: a redo is a new id that names the old one). The old
           ids keep their DOWN and never render again. */
        { id: 'sounds-the-deck-is-not-the-hiss-9-27', make: 'theTapeDeck',
          title: 'THE DECK IS NOT THE HISS' },
        { id: 'sounds-a-flip-is-a-tape-changing-9-27', make: 'theTapeChange',
          title: 'A FLIP IS A TAPE CHANGING' },
        /* HELD OUT OF QUEUE 9/24, REBUILT AND REGISTERED 9/27: the carrier used to be
           the same graveyarded noise recipe rule 32e killed; it is now mains hum plus a
           sparse click train, zero noise generators. */
        { id: 'sounds-the-valley-still-broadcasts-9-27', make: 'theBroadcast',
          title: 'THE VALLEY STILL BROADCASTS' },
        /* THREE REDOS IN ONE ROUND, ALL THE SAME ROOT CAUSE (round [not sand], 9/28):
           three DOWN votes -- "reverb of a glass jar" on the footstep, no comment on the
           deck, "I hated all these noiseS" on the flip -- and all three traced to modal
           synthesis rung with too little damping, concentrating a third to over half of
           the sound's energy in one or a few pure tones. Rule 15b: a redo is a new id
           that names the old one and quotes why he killed it; the old three ids keep
           their DOWN and never render again. First redo of each; a second down on any
           one of these three ends it for the session (STOP PRODUCING). */
        { id: 'sounds-a-footstep-that-is-not-glass-9-28', make: 'footstepModelled',
          title: 'A FOOTSTEP THAT IS NOT GLASS' },
        { id: 'sounds-the-deck-does-not-ring-9-28', make: 'theTapeDeck',
          title: 'THE DECK DOES NOT RING' },
        { id: 'sounds-the-flip-is-a-knock-not-a-chime-9-28', make: 'theTapeChange',
          title: 'THE FLIP IS A KNOCK, NOT A CHIME' },
        /* THREE HUMS OFF THE GRID (round six of [not sand], 9/28): generator, power_on
           and sign_alive redone as new additive-sine recipes, never touching their
           frozen ids in bohemia_sfx.js (verdict_frozen_gate.py). No jit here: a hum has
           one honest pitch, not a range, so each plays its single measured target. */
        { id: 'sounds-the-generator-is-sixty-hertz-9-28', make: 'generatorHum',
          title: 'THE GENERATOR IS SIXTY HERTZ' },
        { id: 'sounds-the-block-lights-at-one-twenty-9-28', make: 'powerOnHum',
          title: 'THE BLOCK LIGHTS AT ONE TWENTY' },
        { id: 'sounds-the-sign-catches-then-holds-9-28', make: 'signAliveHum',
          title: 'THE SIGN CATCHES, THEN HOLDS' },
        /* THREE MORE GROUNDS (9/29): continuing the keep/redo list's footstep family
           (records/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.md 3b), the other three of the six
           frozen step_* ids -- dirt, sand and a wood floor -- from the same model that
           already shipped for concrete and asphalt. */
        { id: 'sounds-a-footstep-on-dirt-9-29', make: 'footstepDirt',
          title: 'A FOOTSTEP ON DIRT' },
        { id: 'sounds-a-footstep-on-sand-9-29', make: 'footstepSand',
          title: 'A FOOTSTEP ON SAND' },
        { id: 'sounds-a-footstep-on-a-wood-floor-9-29', make: 'footstepWood',
          title: 'A FOOTSTEP ON A WOOD FLOOR' },
        /* A WALK THAT NEVER REPEATS (9/30): walk_more, wood_more and tread_more's real
           complaint is repetition, not material, so this is the same footstep played as
           a real sequence, never the same variant twice. */
        { id: 'sounds-a-walk-on-the-sidewalk-does-not-repeat-9-30', make: 'footstepWalkConcrete',
          title: 'A WALK ON THE SIDEWALK DOES NOT REPEAT' },
        { id: 'sounds-a-walk-on-a-wood-floor-does-not-repeat-9-30', make: 'footstepWalkWood',
          title: 'A WALK ON A WOOD FLOOR DOES NOT REPEAT' },
        { id: 'sounds-a-run-on-the-sidewalk-does-not-repeat-9-30', make: 'footstepRunConcrete',
          title: 'A RUN ON THE SIDEWALK DOES NOT REPEAT' },
        /* THE GROUND TAKES IT, AND THINGS GET SET DOWN (10/1): dirt_take, boots_go,
           set_down and seton_more, four more of the keep/redo list, all solved by the
           same two machines this row already built. */
        { id: 'sounds-the-ground-takes-it-10-1', make: 'groundTakesIt',
          title: 'THE GROUND TAKES IT' },
        { id: 'sounds-boots-going-somewhere-on-dirt-10-1', make: 'bootsGoDirt',
          title: 'BOOTS GOING SOMEWHERE, ON DIRT' },
        { id: 'sounds-it-goes-down-10-1', make: 'objectSetDown',
          title: 'IT GOES DOWN' },
        { id: 'sounds-set-it-down-again-10-1', make: 'objectSetDownAgain',
          title: 'SET IT DOWN AGAIN' },
        /* THE TURN CLOSES (row [one song and the volumes], 10/4): end_turn, one of the
           six named sounds for COMBAT's rebuilt fight, has no approved sound yet so it
           is built and registered here, not wired into the live fight (unjudged =
           silent, the bank's own law, same as every other new sound this round). */
        { id: 'sounds-the-turn-closes-10-4', make: 'endTurnClick',
          title: 'THE TURN CLOSES' },
        /* THE MAP IN MOTION (row [the map's sounds], 10/5): the party's steps on asphalt
           and on dirt, and the night's insects -- three of the five moments the row
           names, demonstrated together on the travel clip judge page. */
        { id: 'sounds-the-road-is-faster-10-5', make: 'travelRoadBed',
          title: 'THE ROAD IS FASTER' },
        { id: 'sounds-dirt-is-slower-10-5', make: 'travelDirtBed',
          title: 'DIRT IS SLOWER' },
        { id: 'sounds-the-night-has-insects-10-5', make: 'nightInsects',
          title: 'THE NIGHT HAS INSECTS' },
        /* THE TITLE'S OWN MUSIC (row [the title's music], 10/5): Paolo's own direct ask,
           analog horror, built from three already-reused pieces (the tape deck's wow, the
           dead broadcast, the loading screen's room tone) plus one new number (detuned). */
        { id: 'sounds-the-title-is-detuned-10-5', make: 'titleTheme',
          title: "THE TITLE IS DETUNED" },
        /* THE SETTLEMENT'S SOUNDS (row [the settlement's sounds], 10/5): Paolo's own
           words, "the settlement screen looking real dogshit, look how Battle Brothers
           settlements work" -- taps on the barber, the stall, the board and the posts
           had nothing. Four new, each REUSE-FIRST off an already-built primitive. The
           clinic's door is zero new content (door_open/door_shut, already frozen) and
           is not in this list; the bar's murmur stays unbuilt, same reason as always:
           this lane's palette cannot fake a voice. */
        { id: 'sounds-the-barbers-clippers-10-5', make: 'barberClippers',
          title: "THE BARBER'S CLIPPERS" },
        { id: 'sounds-a-can-on-the-counter-10-5', make: 'canOnWood',
          title: "A CAN ON THE COUNTER" },
        { id: 'sounds-the-boards-own-nail-10-5', make: 'boardNail',
          title: "THE BOARD'S OWN NAIL" },
        { id: 'sounds-paper-against-the-post-10-5', make: 'paperRustle',
          title: "PAPER AGAINST THE POST" },
        /* THE SOUNDSCAPE'S FIRST TWO WORKING SOUNDS (row [the soundscape], 10/9): his own
           words, "the clinking of someone making disorder" at the smith and the armourer. */
        { id: 'sounds-the-smiths-hammer-10-9', make: 'smithHammer',
          title: "THE SMITH'S HAMMER" },
        { id: 'sounds-the-armourers-rivets-10-9', make: 'armourerRivets',
          title: "THE ARMOURER'S RIVETS" },
        /* THE BAR'S GLASS (row [the soundscape], 10/10): the murmur half of his own
           "the bar's murmur and glass" stays the standing no-faked-voice gap; the glass
           half has no voice in it and builds. */
        { id: 'sounds-the-bars-glass-10-10', make: 'barGlassDown',
          title: "THE BAR'S GLASS" },
        /* THE BLOCK (row [not sand], the keep/redo list's last eight): a parry is two
           hard things touching, which the redo list's own definition already covers. */
        { id: 'sounds-a-block-is-two-things-touching-10-10', make: 'weaponBlock',
          title: "A BLOCK IS TWO THINGS TOUCHING" },
        /* SOMETHING HERE STILL WORKS (Paolo, direct, 10/10: build the best, not the mid). */
        { id: 'sounds-something-here-still-works-10-10', make: 'legendaryFind',
          title: "SOMETHING HERE STILL WORKS" }
      ];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
