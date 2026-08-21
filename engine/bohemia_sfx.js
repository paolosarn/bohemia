/* ===========================================================================
   BOHEMIA — THE SFX FACTORY v2, THE RELIQUARY (BOH_SFX)
   ---------------------------------------------------------------------------
   Paolo, on v1: "it sounds like it was made with some software from 2006 so if
   we could do better than that for all of them... they were mid at best tbh but
   its the right direction." Direction kept, sounds killed and remade.

   HE DATED IT ALMOST EXACTLY. v1 was the sfxr topology -- one source, one
   filter, one envelope -- and sfxr shipped in 2007. It was also behind RISSET'S
   BELL (1969), which already had eleven partials each with its OWN duration.
   Full research + sources: records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md

   WHAT FFX ACTUALLY DID, and what this file copies: a RECORDED RESONANT OBJECT
   played into the PS2 SPU2's HARDWARE REVERB (Room/Studio/Hall/Space), in
   STEREO -- FFX was the first Final Fantasy to move its sound effects off mono.
   So: real bodies, in a real room, with width. Not oscillators, dry and centred.

   THE FIVE UPGRADES, each one a defect v1 had:
     1. MODAL BANKS. A sound is a struck material: 8-16 INHARMONIC partials.
        Risset's verified bell ratios are in here as `bell`.
     2. PER-PARTIAL DECAY, shortening as frequency rises. Risset's own durations
        run 1.0 down to 0.075 -- the top partial dies 13x faster than the
        fundamental. One shared envelope is the loudest synthetic tell there is,
        because nothing physical stops all at once.
     3. WARBLE. Paired partials offset by a few HZ (not by ratio) beat slowly
        against each other. Real bells do it from material asymmetry; without it
        a sound sits dead still.
     4. THREE LAYERS: transient (the snap), body (the tone), tail (the room),
        with the transients sample-aligned and the snap slightly hotter.
     5. SPACE AND STEREO, built as SOURCES, never as processors.

   SPACE WITHOUT A DELAY OR A CONVOLVER (the SCREECH LAW, 7/8, is absolute):
     - EARLY REFLECTIONS are the same body re-struck at scheduled offsets at
       falling gain, panned across the field. Finite voices, no feedback.
     - THE LATE TAIL is a filtered noise burst under an exponential decay. That
       is the velvet-noise result inverted: a late reverb tail RESEMBLES noise
       with an exponential decay envelope, so noise GENERATED with that envelope
       is that tail, with no convolution to do it.
     Nothing here can ring, loop or feed back. It is a hall made of finite parts.

   THE DIRECTION: apocalyptic horror Final Fantasy. Every sound is a small ritual
   object struck in a big dead room. Crystal, chapel bell, wet stone, dead metal,
   bone, ash. AND THE RULE THAT KEEPS IT FROM BEING A BELL FESTIVAL: only sounds
   that MEAN something get the room. Footsteps stay dry and close. The contrast is
   the horror -- small sounds intimate, big sounds telling you how empty it is.

   REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): zero graphic pixels, so no banks/
   art lookup applies. Audio reuse is the point: it takes the MUSIC studio's
   existing AudioContext, master gain and brickwall limiter (MUS.audio() /
   MUS.AC / MUS.MAST) and builds none of its own. ONE AUDIOCONTEXT, THE PARENT'S.

   MECHANISM-MINE / CONTENTS-PAOLO'S: the synth and the candidates ship. WHICH
   sound each event makes is his verdict. BANK is empty; play() on an unbanked
   event is silent on purpose.
   =========================================================================== */
const BOH_SFX = (function () {
  'use strict';

  /* ---- THE GRID (120 BPM LAW) ------------------------------------------ */
  var BEAT = 0.5;
  var TICK = BEAT / 16;
  function q(beats) { return Math.round(beats * 16) / 16; }
  function clamp(x, lo, hi) { return x < lo ? lo : (x > hi ? hi : x); }

  /* ---- THE MODAL BANKS -------------------------------------------------
     A material is a table of partials: [ratio, amp, durationScale, hzOffset].
     ratio         inharmonic multiplier of the fundamental
     amp           relative loudness
     durationScale how long THIS partial rings vs the fundamental (the physical
                   law: it falls as the ratio climbs)
     hzOffset      a few Hz of offset against its twin, which is what warbles

     `bell` is Risset's canonical table, verified against a published
     implementation, ratios/amps/durations reproduced exactly. Everything else
     is built the same way for its material. NOTHING here is a harmonic stack --
     integer-ratio banks are what made v1 sound like a synth. */
  var MODES = {
    bell: [                                  /* Risset 1969, the chapel bell */
      [0.56, 1.00, 1.000, 0], [0.56, 0.67, 0.900, 1.0],
      [0.92, 1.00, 0.650, 0], [0.92, 1.80, 0.550, 1.7],
      [1.19, 2.67, 0.325, 0], [1.70, 1.67, 0.350, 0],
      [2.00, 1.46, 0.250, 0], [2.74, 1.33, 0.200, 0],
      [3.00, 1.33, 0.150, 0], [3.76, 1.00, 0.100, 0],
      [4.07, 1.33, 0.075, 0]
    ],
    crystal: [                               /* a shard. bright, fast, glassy */
      [1.00, 1.00, 1.000, 0], [1.00, 0.55, 0.880, 0.7],
      [2.41, 0.72, 0.420, 0], [2.41, 0.40, 0.380, 1.3],
      [3.83, 0.48, 0.230, 0], [5.17, 0.34, 0.140, 0],
      [6.62, 0.22, 0.090, 0], [8.94, 0.14, 0.055, 0],
      [11.3, 0.08, 0.030, 0]
    ],
    glass: [                                 /* a pane, wider and wetter */
      [1.00, 1.00, 1.000, 0], [1.00, 0.62, 0.900, 0.5],
      [2.09, 0.66, 0.500, 0], [3.44, 0.44, 0.300, 0.9],
      [4.71, 0.30, 0.180, 0], [6.03, 0.20, 0.110, 0],
      [7.92, 0.12, 0.060, 0], [9.61, 0.07, 0.035, 0]
    ],
    metal: [                                 /* rebar, a struck car panel */
      [1.00, 1.00, 1.000, 0], [1.00, 0.70, 0.930, 1.4],
      [1.47, 0.86, 0.640, 0], [2.09, 0.74, 0.480, 2.1],
      [2.56, 0.62, 0.360, 0], [3.31, 0.50, 0.250, 0],
      [4.18, 0.38, 0.170, 0], [5.42, 0.27, 0.110, 0],
      [6.77, 0.18, 0.070, 0], [8.31, 0.11, 0.040, 0]
    ],
    stone: [                                 /* wet concrete. almost no ring */
      [1.00, 1.00, 1.000, 0], [1.00, 0.48, 0.820, 0.4],
      [1.62, 0.52, 0.330, 0], [2.31, 0.30, 0.190, 0],
      [3.17, 0.17, 0.100, 0], [4.44, 0.09, 0.050, 0]
    ],
    bone: [                                  /* dry, close, impacts */
      [1.00, 1.00, 1.000, 0], [1.79, 0.56, 0.360, 0.6],
      [2.63, 0.32, 0.190, 0], [3.91, 0.18, 0.100, 0],
      [5.28, 0.10, 0.055, 0], [7.14, 0.05, 0.028, 0]
    ],
    wood: [                                  /* a beam, a door, a shut */
      [1.00, 1.00, 1.000, 0], [1.00, 0.44, 0.780, 0.5],
      [2.15, 0.44, 0.290, 0], [3.28, 0.24, 0.160, 0],
      [4.61, 0.13, 0.085, 0], [6.22, 0.06, 0.040, 0]
    ],
    choir: [                                 /* the dead chapel. horror FF */
      [1.00, 1.00, 1.000, 0], [1.00, 0.68, 0.940, 0.6],
      [2.01, 0.54, 0.780, 0], [2.99, 0.40, 0.620, 1.1],
      [4.02, 0.26, 0.480, 0], [5.03, 0.16, 0.340, 0],
      [6.98, 0.09, 0.200, 0], [9.02, 0.05, 0.110, 0]
    ],
    water: [                                 /* something moving in the dark */
      [1.00, 1.00, 1.000, 0], [1.36, 0.62, 0.560, 0.8],
      [1.93, 0.40, 0.320, 0], [2.71, 0.24, 0.180, 0],
      [3.62, 0.13, 0.095, 0], [4.88, 0.07, 0.050, 0]
    ],
    ash: [                                   /* barely a pitch at all: grit */
      [1.00, 1.00, 1.000, 0], [1.53, 0.34, 0.280, 0],
      [2.44, 0.16, 0.140, 0], [3.71, 0.07, 0.070, 0]
    ]
  };
  var MATERIALS = Object.keys(MODES);

  /* ---- THE TYPED SPEC -------------------------------------------------- */
  var SPEC = {
    mat:     { kind: 'enum', of: MATERIALS, d: 'stone' },
    hz:      { kind: 'num',  min: 24,  max: 4200, d: 220 },   /* the fundamental */
    modes:   { kind: 'num',  min: 3,   max: 16,   d: 8 },     /* partials used */
    bright:  { kind: 'num',  min: 0.2, max: 2.5,  d: 1 },     /* spectral tilt */
    decay:   { kind: 'beat', min: 1 / 16, max: 4, d: 0.25 },  /* the FUNDAMENTAL's ring */
    damp:    { kind: 'num',  min: 0.2, max: 3,    d: 1 },     /* how much faster highs die */
    warble:  { kind: 'num',  min: 0,   max: 3,    d: 1 },     /* the beating, scales hzOffset */
    atk:     { kind: 'beat', min: 0,   max: 1,    d: 0 },
    slide:   { kind: 'num',  min: -24, max: 12,   d: 0 },     /* semitones over the ring */
    trans:   { kind: 'num',  min: 0,   max: 1,    d: 0.5 },   /* THE SNAP: layer 1 */
    transHz: { kind: 'num',  min: 200, max: 12000, d: 3000 }, /* snap brightness */
    transQ:  { kind: 'num',  min: 0.3, max: 12,   d: 1 },
    grit:    { kind: 'num',  min: 0,   max: 1,    d: 0 },     /* noise bedded into the body */
    gritHz:  { kind: 'num',  min: 200, max: 12000, d: 2000 },
    space:   { kind: 'num',  min: 0,   max: 1,    d: 0.25 },  /* THE ROOM: layer 3 */
    room:    { kind: 'beat', min: 0,   max: 3,    d: 0.5 },   /* tail length in beats */
    refl:    { kind: 'num',  min: 0,   max: 4,    d: 2 },     /* early reflections */
    dark:    { kind: 'num',  min: 300, max: 9000, d: 2600 },  /* tail colour */
    width:   { kind: 'num',  min: 0,   max: 1,    d: 0.5 },   /* STEREO. never 0 by default */
    drive:   { kind: 'num',  min: 0,   max: 1,    d: 0 },
    gain:    { kind: 'num',  min: 0,   max: 1,    d: 0.5 },
    mkup:    { kind: 'num',  min: 0.25, max: 24,  d: 1 },
    pan:     { kind: 'num',  min: -1,  max: 1,    d: 0 },

    /* ---- HOW THE SOUND IS MADE AT ALL (8/12, BATCH SFX-04) --------------
       Paolo: "you need more diverse sounds bro its getting stale at this
       point." He is right and the cause is structural, not a shortage of
       moments. Everything this engine has ever made is A STRUCK RESONANT
       OBJECT: transient, modal bank, room. Fifty-four moments built one way
       are fifty-four cousins, and no number of new events fixes that -- the
       family resemblance IS the topology. He heard the topology.
       So the method becomes a parameter. Each one below is a different
       physics, not a different preset, and none of them can ring, loop or
       feed back (SCREECH LAW, 7/8, absolute -- no delay line, no convolver,
       which rules out Karplus-Strong and every waveguide, a real cost paid).
         modal     the original. a struck material. UNCHANGED, so all 97 of
                   his approved sounds render byte-identical.
         fm        Chowning 1973. a carrier modulated at audio rate with the
                   INDEX on its own falling envelope. Integer ratios give
                   brass and reed; non-integer (1.41, 2.17, 1/sqrt2) give
                   bells, metal and quasi-pitched drums -- a whole inharmonic
                   family no fixed modal table can reach.
         particle  Cook's PhISEM, 1996. A cloud of many tiny collisions under
                   one exponentially decaying SYSTEM ENERGY. This is what
                   gravel, coins, ice, keys, chain and breaking glass actually
                   are -- Cook's own examples -- and one strike can never
                   sound like a hundred small ones.
         friction  stick-slip. Noise through a resonance, amplitude-driven at
                   the slip rate. Drags, scrapes, hinges, rope: sound that is
                   CONTINUOUS and has no attack at all.
         air       turbulence. Noise through a band that MOVES. Wind, breath,
                   gas, hiss: sound with no body and no strike. */
    synth:   { kind: 'enum', of: ['modal', 'fm', 'particle', 'friction', 'air',
                                 'instrument'], d: 'modal' },
    /* WHICH OF HIS 602 INSTRUMENTS (8/16). Only read when synth==='instrument'.
       Free-text on purpose: the rack lives in the alpha, not in this module, so
       this file cannot enumerate it without duplicating his list and going
       stale the first time the MUSIC lane adds a voice. instrument_gate.py
       resolves every name against the SHIPPED rack instead, which is the check
       that actually matters. */
    inst:    { kind: 'str',  d: '' },
    ratio:   { kind: 'num',  min: 0.1, max: 12,  d: 2 },    /* fm  carrier:modulator */
    index:   { kind: 'num',  min: 0,   max: 20,  d: 3 },    /* fm  modulation index */
    grains:  { kind: 'num',  min: 2,   max: 64,  d: 12 },   /* particle  collisions */
    rough:   { kind: 'num',  min: 0.5, max: 40,  d: 6 }     /* friction/air  rate Hz */
  };
  var FIELDS = Object.keys(SPEC);

  function sanitize(v) {
    var o = {}, i, k, s, x;
    for (i = 0; i < FIELDS.length; i++) {
      k = FIELDS[i]; s = SPEC[k];
      x = (v && v[k] != null) ? v[k] : s.d;
      if (s.kind === 'enum') o[k] = (s.of.indexOf(x) >= 0) ? x : s.d;
      /* A NAME IS NOT A NUMBER (8/16). Without this branch `inst` fell through
         to the numeric clamp, `clamp(+'templeblock' || 0, undefined, undefined)`,
         and every instrument name in the batch silently became 0 -- so every
         instrument-backed sound rendered nothing at all. It cost one cook to
         find and it is exactly why instrument_gate re-renders each name on the
         real surface instead of trusting the recipe text. */
      else if (s.kind === 'str') o[k] = (typeof x === 'string') ? x : s.d;
      else if (s.kind === 'beat') o[k] = clamp(q(+x || 0), s.min, s.max);
      else o[k] = clamp(+x || 0, s.min, s.max);
    }
    o.modes = Math.max(3, Math.min(16, Math.round(o.modes)));
    o.refl = Math.max(0, Math.min(4, Math.round(o.refl)));
    o.ev = (v && v.ev) || 'unnamed';
    o.id = (v && v.id) || (o.ev + '.0');
    o.hits = [];
    var h = (v && v.hits) || [0];
    for (var j = 0; j < h.length && j < 8; j++) o.hits.push(clamp(q(h[j]), 0, 8));
    if (!o.hits.length) o.hits = [0];
    return o;
  }

  /* ---- WHAT HIS RACK ACTUALLY DOES (8/19, MEASURED) --------------------
     Every voice this engine borrows from the music studio, rendered off the
     REAL rack in the REAL alpha and measured down to -50 dB, on a 2x2 grid of
     the two things that turn out to change what a voice does:

       name: [ sec  @ semi -24, step 0.10 |  sec  @ semi -24, step 0.60,
               sec  @ semi +12, step 0.10 |  sec  @ semi +12, step 0.60,
               peak @ semi -24, step 0.10 |  peak @ semi -24, step 0.60,
               peak @ semi +12, step 0.10 |  peak @ semi +12, step 0.60 ]

     THREE THINGS THIS TABLE SAYS THAT NOBODY HAD LOOKED AT. First, HALF HIS
     RACK IGNORES THE STEP: `templeblock` is 45 ms whether you ask for 100 ms or
     600, `udu` is 99 ms, `washboard` is 42 ms -- they are one-shots with their
     own built-in length, and the other half (`dawnpad`, `bottle`, `ironstep`)
     stretch with it linearly, out to six seconds. Second, THEY ARE NOT THE SAME
     LOUDNESS, and not close: `boneplate` peaks at 0.03 where `taiko` peaks at
     0.53 off the same bank at the same drive, a 17x spread. Driving them all at
     one g0 -- which is what the first bridge did -- is why 27 candidates landed
     outside the judgeable band. Paolo would have been picking whichever one he
     could HEAR. Third, BOTH OF THOSE ALSO MOVE WITH PITCH: `edenmist` peaks 7x
     higher two octaves up, `boneplate` is half as long an octave up. That third
     one is why a first table indexed on the step alone still left four
     candidates too quiet to judge and one that was a click.
     Bilinear between the four corners, held inside them at the edges.
     This is calibration data, not content: nothing here is a decision about
     what anything sounds like, it is a ruler held up to his own instruments.
     Regenerate with tools/bohemia_sfx_instrument_measure.py --write. */
  var INST_VOICE = {
    altitudecall:   [0.037, 0.186, 0.366, 0.730, 1.470,
                     0.037, 0.196, 0.366, 0.734, 1.471,
                     0.0766, 0.1268, 0.1268, 0.1268, 0.1268,
                     0.1183, 0.1341, 0.1341, 0.1341, 0.1341],
    anvil:          [0.025, 0.069, 0.128, 0.269, 0.565,
                     0.025, 0.070, 0.134, 0.265, 0.536,
                     0.1599, 0.1801, 0.1832, 0.1556, 0.1244,
                     0.1989, 0.1682, 0.1559, 0.1629, 0.1572],
    boneplate:      [0.040, 0.082, 0.172, 0.285, 0.400,
                     0.036, 0.060, 0.088, 0.097, 0.122,
                     0.0047, 0.0090, 0.0070, 0.0123, 0.0113,
                     0.0336, 0.0484, 0.0518, 0.0626, 0.0642],
    bones:          [0.143, 0.143, 0.143, 0.143, 0.143,
                     0.144, 0.144, 0.144, 0.144, 0.144,
                     0.0913, 0.0913, 0.0913, 0.0913, 0.0913,
                     0.1105, 0.1105, 0.1105, 0.1105, 0.1105],
    bottle:         [0.068, 0.175, 0.325, 0.657, 1.312,
                     0.069, 0.175, 0.329, 0.658, 1.315,
                     0.2331, 0.2538, 0.2550, 0.2550, 0.2550,
                     0.2550, 0.2550, 0.2550, 0.2550, 0.2550],
    breathpad:      [0.060, 0.160, 0.266, 1.217, 2.812,
                     0.041, 0.160, 0.266, 1.352, 2.680,
                     0.0811, 0.1368, 0.1109, 0.0836, 0.0849,
                     0.0867, 0.0908, 0.1641, 0.1553, 0.1645],
    brushkit:       [0.058, 0.056, 0.059, 0.059, 0.056,
                     0.056, 0.055, 0.058, 0.057, 0.059,
                     0.0746, 0.0860, 0.0766, 0.0748, 0.0960,
                     0.0999, 0.0899, 0.0798, 0.0827, 0.0756],
    cabasa:         [0.027, 0.028, 0.029, 0.028, 0.027,
                     0.027, 0.028, 0.028, 0.029, 0.029,
                     0.0952, 0.0566, 0.0662, 0.0710, 0.0734,
                     0.0773, 0.0718, 0.0782, 0.0611, 0.0667],
    capacitor:      [0.144, 0.144, 0.144, 0.144, 0.144,
                     0.142, 0.142, 0.142, 0.142, 0.142,
                     0.1327, 0.1327, 0.1327, 0.1327, 0.1327,
                     0.1338, 0.1338, 0.1338, 0.1338, 0.1338],
    cashreg:        [0.411, 0.411, 0.411, 0.411, 0.411,
                     0.411, 0.411, 0.411, 0.411, 0.411,
                     0.1356, 0.1356, 0.1356, 0.1356, 0.1356,
                     0.1348, 0.1348, 0.1348, 0.1348, 0.1348],
    cellring:       [0.320, 0.320, 0.320, 0.320, 0.320,
                     0.320, 0.320, 0.320, 0.320, 0.320,
                     0.1200, 0.1200, 0.1200, 0.1200, 0.1200,
                     0.1200, 0.1200, 0.1200, 0.1200, 0.1200],
    chapelbreath:   [0.230, 0.565, 1.107, 1.968, 4.665,
                     0.149, 0.606, 1.173, 2.125, 4.629,
                     0.0040, 0.0059, 0.0062, 0.0068, 0.0135,
                     0.0066, 0.0060, 0.0065, 0.0075, 0.0129],
    chip:           [0.029, 0.076, 0.146, 0.291, 0.578,
                     0.029, 0.078, 0.145, 0.290, 0.580,
                     0.1285, 0.1288, 0.1289, 0.1304, 0.1325,
                     0.1285, 0.1288, 0.1311, 0.1331, 0.1341],
    claves:         [0.023, 0.023, 0.023, 0.023, 0.023,
                     0.023, 0.023, 0.023, 0.023, 0.023,
                     0.1741, 0.1741, 0.1741, 0.1741, 0.1741,
                     0.1741, 0.1741, 0.1741, 0.1741, 0.1741],
    coin:           [0.226, 0.226, 0.226, 0.226, 0.226,
                     0.221, 0.221, 0.221, 0.221, 0.221,
                     0.1525, 0.1525, 0.1525, 0.1525, 0.1525,
                     0.1760, 0.1760, 0.1760, 0.1760, 0.1760],
    dawnpad:        [0.165, 1.063, 2.061, 3.848, 6.248,
                     0.465, 1.128, 2.061, 3.848, 6.248,
                     0.2314, 0.1565, 0.1567, 0.1571, 0.2602,
                     0.0349, 0.2294, 0.2308, 0.3264, 0.3512],
    dawnwash:       [0.336, 0.902, 1.702, 3.389, 6.244,
                     0.236, 0.711, 1.697, 3.260, 6.239,
                     0.0405, 0.0438, 0.0470, 0.0518, 0.0630,
                     0.0456, 0.0492, 0.0542, 0.0525, 0.0534],
    dobrowail:      [0.037, 0.098, 0.186, 0.377, 0.753,
                     0.049, 0.127, 0.237, 0.472, 0.943,
                     0.0128, 0.0130, 0.0131, 0.0131, 0.0131,
                     0.0275, 0.0306, 0.0320, 0.0327, 0.0331],
    dropkick:       [0.076, 0.076, 0.076, 0.076, 0.076,
                     0.085, 0.085, 0.085, 0.085, 0.085,
                     0.3463, 0.3463, 0.3463, 0.3463, 0.3463,
                     0.3463, 0.3463, 0.3463, 0.3463, 0.3463],
    dyingfilament:  [0.087, 0.232, 0.406, 0.823, 1.628,
                     0.089, 0.228, 0.417, 0.782, 1.645,
                     0.0567, 0.0702, 0.0774, 0.0817, 0.0860,
                     0.0811, 0.0793, 0.0832, 0.0857, 0.0870],
    edenmist:       [0.375, 0.996, 1.860, 3.719, 6.247,
                     0.371, 0.993, 1.856, 3.715, 6.249,
                     0.0057, 0.0086, 0.0096, 0.0110, 0.0113,
                     0.0626, 0.0729, 0.0760, 0.0779, 0.0779],
    emptyfloorhum:  [0.398, 1.070, 2.008, 3.787, 6.245,
                     0.399, 1.062, 1.992, 3.841, 6.249,
                     0.0336, 0.0288, 0.0526, 0.0655, 0.0657,
                     0.0528, 0.0604, 0.0657, 0.0658, 0.0658],
    formantvox:     [0.017, 0.148, 0.292, 0.601, 1.218,
                     0.016, 0.164, 0.307, 0.618, 1.236,
                     0.0240, 0.0704, 0.0704, 0.0704, 0.0704,
                     0.0437, 0.0437, 0.0437, 0.0437, 0.0437],
    ghostvox:       [0.114, 0.111, 0.172, 1.001, 2.029,
                     0.044, 0.116, 0.173, 1.017, 2.033,
                     0.0096, 0.0107, 0.0294, 0.0295, 0.0295,
                     0.0176, 0.0212, 0.0230, 0.0242, 0.0242],
    glassbottle:    [0.548, 0.548, 0.548, 0.548, 0.548,
                     0.542, 0.542, 0.542, 0.542, 0.542,
                     0.2060, 0.2060, 0.2060, 0.2060, 0.2060,
                     0.2401, 0.2401, 0.2401, 0.2401, 0.2401],
    glassdrop:      [0.317, 0.317, 0.317, 0.317, 0.317,
                     0.318, 0.318, 0.318, 0.318, 0.318,
                     0.1485, 0.1485, 0.1485, 0.1485, 0.1485,
                     0.1485, 0.1485, 0.1485, 0.1485, 0.1485],
    guiro:          [0.150, 0.150, 0.150, 0.150, 0.150,
                     0.150, 0.150, 0.150, 0.150, 0.150,
                     0.1253, 0.1129, 0.1172, 0.1061, 0.1111,
                     0.1106, 0.1132, 0.1148, 0.1058, 0.1093],
    harmonicawail:  [0.018, 0.138, 0.261, 0.551, 1.111,
                     0.018, 0.144, 0.276, 0.564, 1.116,
                     0.0602, 0.0752, 0.0752, 0.0752, 0.0758,
                     0.0935, 0.1135, 0.1135, 0.1135, 0.1137],
    heartbeatsub:   [0.394, 0.394, 0.394, 0.394, 0.394,
                     0.388, 0.388, 0.388, 0.388, 0.388,
                     0.1486, 0.1486, 0.1486, 0.1486, 0.1486,
                     0.2001, 0.2001, 0.2001, 0.2001, 0.2001],
    holdbreath:     [0.108, 0.288, 0.492, 0.963, 2.958,
                     0.095, 0.416, 0.476, 0.979, 2.859,
                     0.0712, 0.0652, 0.0634, 0.0518, 0.0508,
                     0.0539, 0.0247, 0.0778, 0.0742, 0.0792],
    ironheart:      [0.033, 0.086, 0.172, 0.338, 0.683,
                     0.033, 0.092, 0.172, 0.346, 0.692,
                     0.0862, 0.1794, 0.1794, 0.1794, 0.1794,
                     0.1709, 0.1735, 0.1735, 0.1735, 0.1735],
    ironstep:       [0.036, 0.087, 0.158, 0.337, 0.664,
                     0.037, 0.098, 0.184, 0.362, 0.703,
                     0.0757, 0.1272, 0.1601, 0.1807, 0.1915,
                     0.0667, 0.0736, 0.0752, 0.0830, 0.1021],
    ledgerbell:     [0.381, 0.381, 0.381, 0.381, 0.381,
                     0.380, 0.380, 0.380, 0.380, 0.380,
                     0.1917, 0.1917, 0.1917, 0.1917, 0.1917,
                     0.2070, 0.2070, 0.2070, 0.2070, 0.2070],
    ledgerscratch:  [0.031, 0.051, 0.102, 0.210, 0.427,
                     0.031, 0.058, 0.108, 0.219, 0.442,
                     0.1138, 0.1132, 0.1301, 0.1197, 0.1243,
                     0.1347, 0.1200, 0.1356, 0.1207, 0.1144],
    marimba:        [0.220, 0.220, 0.220, 0.220, 0.220,
                     0.217, 0.217, 0.217, 0.217, 0.217,
                     0.2753, 0.2753, 0.2753, 0.2753, 0.2753,
                     0.3274, 0.3274, 0.3274, 0.3274, 0.3274],
    meterclick:     [0.035, 0.073, 0.125, 0.237, 0.463,
                     0.035, 0.073, 0.125, 0.238, 0.463,
                     0.0861, 0.0851, 0.0886, 0.0862, 0.0851,
                     0.0916, 0.0854, 0.0889, 0.0865, 0.0854],
    neonrelic:      [1.087, 1.087, 1.087, 1.087, 1.087,
                     1.087, 1.087, 1.087, 1.087, 1.087,
                     0.1789, 0.1789, 0.1789, 0.1789, 0.1789,
                     0.1794, 0.1794, 0.1794, 0.1794, 0.1794],
    neonsign:       [0.084, 0.223, 0.419, 0.839, 1.679,
                     0.084, 0.224, 0.420, 0.840, 1.680,
                     0.0493, 0.0708, 0.0708, 0.0708, 0.0715,
                     0.0642, 0.0708, 0.0740, 0.0740, 0.0740],
    neontube:       [0.051, 0.144, 0.281, 0.571, 1.151,
                     0.052, 0.149, 0.283, 0.572, 1.151,
                     0.0238, 0.0246, 0.0246, 0.0246, 0.0246,
                     0.0245, 0.0245, 0.0245, 0.0245, 0.0245],
    onebreath:      [0.107, 0.245, 0.446, 0.902, 1.833,
                     0.107, 0.243, 0.457, 0.923, 1.830,
                     0.1216, 0.1430, 0.1647, 0.1662, 0.1693,
                     0.1070, 0.1171, 0.1209, 0.1246, 0.1358],
    paperlung:      [0.038, 0.095, 0.177, 0.355, 0.687,
                     0.035, 0.089, 0.177, 0.352, 0.695,
                     0.0032, 0.0050, 0.0071, 0.0055, 0.0074,
                     0.0189, 0.0254, 0.0203, 0.0218, 0.0254],
    pickscrape:     [0.012, 0.033, 0.061, 0.119, 0.247,
                     0.011, 0.030, 0.057, 0.113, 0.222,
                     0.0295, 0.0248, 0.0362, 0.0396, 0.0459,
                     0.0261, 0.0360, 0.0374, 0.0510, 0.0532],
    prairiestatic:  [0.309, 0.829, 1.556, 2.979, 6.165,
                     0.312, 0.831, 1.559, 3.119, 6.238,
                     0.0204, 0.0294, 0.0282, 0.0523, 0.0523,
                     0.0361, 0.0405, 0.0553, 0.0554, 0.0554],
    ratchet:        [0.189, 0.189, 0.189, 0.189, 0.189,
                     0.189, 0.189, 0.189, 0.189, 0.189,
                     0.0796, 0.0796, 0.0796, 0.0796, 0.0796,
                     0.0796, 0.0796, 0.0796, 0.0796, 0.0796],
    reedorgan:      [0.015, 0.248, 0.464, 0.928, 1.857,
                     0.015, 0.247, 0.464, 0.929, 1.859,
                     0.2217, 0.2276, 0.2276, 0.2276, 0.2276,
                     0.2217, 0.2276, 0.2276, 0.2276, 0.2596],
    reelclick:      [0.116, 0.116, 0.116, 0.116, 0.116,
                     0.116, 0.116, 0.116, 0.116, 0.116,
                     0.1137, 0.1137, 0.1137, 0.1137, 0.1137,
                     0.1141, 0.1141, 0.1141, 0.1141, 0.1141],
    rimshotr:       [0.015, 0.014, 0.014, 0.014, 0.015,
                     0.014, 0.014, 0.015, 0.015, 0.014,
                     0.1980, 0.2589, 0.2530, 0.2522, 0.1990,
                     0.2444, 0.2636, 0.2295, 0.2046, 0.2575],
    riveter:        [0.020, 0.051, 0.103, 0.210, 0.426,
                     0.022, 0.058, 0.108, 0.213, 0.426,
                     0.1430, 0.1430, 0.1434, 0.1538, 0.1593,
                     0.1546, 0.1553, 0.1568, 0.1575, 0.1609],
    rubblelight:    [0.136, 0.352, 1.847, 3.711, 6.234,
                     0.132, 0.314, 1.770, 3.545, 6.246,
                     0.0084, 0.0116, 0.0139, 0.0126, 0.0142,
                     0.0721, 0.0812, 0.0813, 0.0813, 0.0813],
    rubboard:       [0.159, 0.159, 0.159, 0.159, 0.159,
                     0.159, 0.159, 0.159, 0.159, 0.159,
                     0.0898, 0.1043, 0.1053, 0.1078, 0.1117,
                     0.0976, 0.0897, 0.1021, 0.0911, 0.0950],
    scrapchime:     [0.100, 0.215, 0.289, 0.555, 1.078,
                     0.056, 0.147, 0.269, 0.557, 1.113,
                     0.0846, 0.0954, 0.1190, 0.1372, 0.1679,
                     0.1438, 0.1730, 0.1809, 0.1854, 0.1876],
    settlebend:     [0.138, 0.080, 0.690, 1.311, 2.666,
                     0.138, 0.080, 0.150, 1.301, 2.554,
                     0.0149, 0.0252, 0.0119, 0.0115, 0.0189,
                     0.0081, 0.0367, 0.0278, 0.0481, 0.0481],
    shardglass:     [0.040, 0.104, 0.195, 0.390, 0.781,
                     0.030, 0.077, 0.144, 0.289, 0.573,
                     0.0055, 0.0055, 0.0068, 0.0081, 0.0089,
                     0.1864, 0.1935, 0.2034, 0.2089, 0.2116],
    shatterspark:   [0.010, 0.025, 0.047, 0.093, 0.186,
                     0.009, 0.026, 0.047, 0.094, 0.188,
                     0.1676, 0.1676, 0.1677, 0.1679, 0.1696,
                     0.1706, 0.1706, 0.1706, 0.1736, 0.1754],
    shofar:         [0.030, 0.288, 0.542, 1.106, 2.233,
                     0.030, 0.297, 0.556, 1.115, 2.233,
                     0.2140, 0.2140, 0.2140, 0.2140, 0.2140,
                     0.1902, 0.1893, 0.1893, 0.1893, 0.1893],
    signalfade:     [0.040, 0.112, 0.207, 0.421, 0.839,
                     0.042, 0.112, 0.212, 0.422, 0.842,
                     0.0346, 0.0332, 0.0339, 0.0353, 0.0354,
                     0.0324, 0.0351, 0.0324, 0.0343, 0.0353],
    sodahiss:       [0.029, 0.081, 0.145, 0.290, 0.582,
                     0.030, 0.076, 0.148, 0.286, 0.562,
                     0.2013, 0.1684, 0.1967, 0.2092, 0.2195,
                     0.1933, 0.1955, 0.1961, 0.2328, 0.2629],
    solarhum:       [0.036, 0.096, 0.567, 1.148, 2.311,
                     0.036, 0.096, 0.576, 1.155, 2.312,
                     0.0637, 0.1496, 0.1502, 0.1502, 0.1502,
                     0.1345, 0.1440, 0.1502, 0.1502, 0.1502],
    spoonclack:     [0.065, 0.065, 0.065, 0.065, 0.065,
                     0.065, 0.065, 0.065, 0.065, 0.065,
                     0.1217, 0.1217, 0.1217, 0.1217, 0.1217,
                     0.1217, 0.1217, 0.1217, 0.1217, 0.1217],
    springrev:      [0.033, 0.080, 0.174, 0.340, 0.638,
                     0.030, 0.089, 0.166, 0.328, 0.630,
                     0.0038, 0.0101, 0.0075, 0.0098, 0.0107,
                     0.0388, 0.0283, 0.0363, 0.0401, 0.0533],
    stillair:       [0.479, 1.310, 2.441, 3.848, 6.247,
                     0.492, 1.312, 2.459, 3.849, 6.249,
                     0.0432, 0.0425, 0.0476, 0.0476, 0.0476,
                     0.0489, 0.0505, 0.0525, 0.0525, 0.0525],
    subboom:        [0.038, 0.115, 0.198, 0.417, 0.830,
                     0.047, 0.116, 0.212, 0.423, 0.840,
                     0.4084, 0.4142, 0.4020, 0.3928, 0.3884,
                     0.3861, 0.4121, 0.4100, 0.4113, 0.4165],
    sweeppad:       [0.050, 0.108, 0.912, 1.853, 3.662,
                     0.050, 0.107, 0.893, 1.782, 3.549,
                     0.0779, 0.1418, 0.1379, 0.1560, 0.2120,
                     0.0741, 0.1492, 0.1822, 0.1954, 0.1956],
    taiko:          [0.043, 0.118, 0.216, 0.438, 0.882,
                     0.043, 0.118, 0.216, 0.438, 0.893,
                     0.4856, 0.5293, 0.5561, 0.5310, 0.5478,
                     0.4980, 0.5337, 0.5364, 0.5462, 0.5293],
    templeblock:    [0.046, 0.046, 0.046, 0.046, 0.046,
                     0.046, 0.046, 0.046, 0.046, 0.046,
                     0.1955, 0.1955, 0.1955, 0.1955, 0.1955,
                     0.1955, 0.1955, 0.1955, 0.1955, 0.1955],
    thunderdrum:    [0.023, 0.063, 0.112, 0.210, 0.417,
                     0.022, 0.062, 0.097, 0.200, 0.415,
                     0.0177, 0.0354, 0.0519, 0.0615, 0.0620,
                     0.0207, 0.0263, 0.0681, 0.0544, 0.0584],
    ticker:         [0.066, 0.066, 0.066, 0.066, 0.066,
                     0.066, 0.066, 0.066, 0.066, 0.066,
                     0.1137, 0.1137, 0.1137, 0.1137, 0.1137,
                     0.1141, 0.1141, 0.1141, 0.1141, 0.1141],
    timbale:        [0.078, 0.078, 0.078, 0.078, 0.078,
                     0.072, 0.072, 0.072, 0.072, 0.072,
                     0.0447, 0.0447, 0.0447, 0.0447, 0.0447,
                     0.0685, 0.0685, 0.0685, 0.0685, 0.0685],
    timpani:        [0.047, 0.133, 0.259, 0.530, 1.075,
                     0.054, 0.143, 0.270, 0.538, 1.077,
                     0.4229, 0.4375, 0.4436, 0.4461, 0.4477,
                     0.4227, 0.4431, 0.4426, 0.4469, 0.4502],
    udu:            [0.099, 0.099, 0.099, 0.099, 0.099,
                     0.100, 0.100, 0.100, 0.100, 0.100,
                     0.3193, 0.3193, 0.3193, 0.3193, 0.3193,
                     0.3193, 0.3193, 0.3193, 0.3193, 0.3193],
    vendinghum:     [0.084, 0.224, 0.420, 0.840, 1.680,
                     0.084, 0.224, 0.420, 0.840, 1.680,
                     0.1488, 0.1504, 0.1666, 0.1666, 0.1666,
                     0.1009, 0.1604, 0.1632, 0.1632, 0.1632],
    washboard:      [0.042, 0.042, 0.042, 0.042, 0.042,
                     0.042, 0.042, 0.042, 0.042, 0.042,
                     0.0670, 0.0670, 0.0670, 0.0670, 0.0670,
                     0.0670, 0.0670, 0.0670, 0.0670, 0.0670],
    watervoice:     [0.034, 0.197, 0.377, 0.757, 1.524,
                     0.035, 0.201, 0.381, 0.762, 1.528,
                     0.1481, 0.1498, 0.1498, 0.1498, 0.1498,
                     0.1485, 0.1493, 0.1493, 0.1493, 0.1493]
  };
  /* No SFX is longer than a bar and a quarter. His pads run six seconds, which
     is a piece of music, not a game sound: the wake-up swell gets cut to this
     and faded, it does not get to hold the beat grid open. */
  var INST_MAX_BEATS = 2.5;
  /* THE VOICE ARRIVES AT THIS PEAK, whatever it is. The recipe's own
     gain x mkup still rides on top, so the mix ladder between loud and quiet
     moments survives -- only the 17x accident between one borrowed voice and
     the next is taken out. Held under 1.0 because the saturator downstream is
     defined over -1..1 and PINS past it (the lesson already written into
     render()). */
  var INST_VREF = 0.75;
  /* the grid the table was measured on. Each voice is four rows of INST_SD
     numbers: seconds at the low semitone, seconds at the high one, then peak
     at the low semitone and peak at the high one. */
  /* THREE PITCHES, NOT TWO (8/20). Two assumed pitch was linear. `breathpad`
     peaks 0.081 two octaves down and 0.165 an octave up, and a straight line
     between those predicts 0.126 in the middle where the TRUTH IS 0.0255. The
     drive is solved BACKWARDS from that number, so a five-times error in the
     ruler comes out as a sound five times too quiet -- measured, on dog_calls.3
     and lungs_burn.0, at 0.027 and 0.021 against a judgeable floor of 0.15.
     THE MIDDLE ROW IS BUILT AND IT IS NOT IN USE, ON PURPOSE. Adding it moves
     the interpolation for every voice, and that re-tunes 460 candidates Paolo
     has already ruled on -- sfx_render measured come_up.1 moving 46% in RMS off
     nothing but a better ruler. A sound he has judged does not change under him
     for an improvement in the instrument. tools/bohemia_sfx_instrument_measure.py
     can lay the third row down in one pass (--write migrates, outer rows carried
     byte-for-byte) and INST_SEMI here is the one line that turns it on; it wants
     to ride WITH a deliberate re-record of the fingerprint ledger, not sneak in
     under one. Full numbers in the 8/20 commit. */
  var INST_SD = [0.03, 0.08, 0.15, 0.30, 0.60], INST_SEMI = [-24, 12];
  var INST_N = INST_SD.length, INST_M = INST_SEMI.length;
  /* the step this engine hands his rack, for a given vector */
  function instStep(v) { return Math.max(0.03, v.decay * BEAT); }
  /* PIECEWISE, NOT ONE STRAIGHT LINE. `ironlung` sits at 0.20 s until a step of
     0.20 and then jumps to 1.40 s -- a single line through the two ends of that
     predicts 0.56 s where the truth is 0.19, and since the engine INVERTS this
     curve to fit a voice into its window, that error comes back as a sound a
     fifth of the length it declared. */
  function instRow(e, base, sd) {
    if (sd <= INST_SD[0]) return e[base];
    for (var i = 1; i < INST_N; i++) {
      if (sd <= INST_SD[i]) {
        var f = (sd - INST_SD[i - 1]) / (INST_SD[i] - INST_SD[i - 1]);
        return e[base + i - 1] + (e[base + i] - e[base + i - 1]) * f;
      }
    }
    return e[base + INST_N - 1];
  }
  /* piecewise across the pitch rows as well as the step columns */
  function instAt(name, sd, semi, base) {
    var e = INST_VOICE[name];
    if (!e) return null;
    if (semi <= INST_SEMI[0]) return instRow(e, base, sd);
    for (var k = 1; k < INST_M; k++) {
      if (semi <= INST_SEMI[k]) {
        var f = (semi - INST_SEMI[k - 1]) / (INST_SEMI[k] - INST_SEMI[k - 1]);
        var a = instRow(e, base + (k - 1) * INST_N, sd);
        var b = instRow(e, base + k * INST_N, sd);
        return a + (b - a) * f;
      }
    }
    return instRow(e, base + (INST_M - 1) * INST_N, sd);
  }
  function instSec(name, sd, semi) {
    var s = instAt(name, sd, semi, 0);
    return (s == null) ? sd * 1.4 : Math.max(0.02, s);   /* unmeasured: guess */
  }
  function instPeak(name, sd, semi) {
    var p = instAt(name, sd, semi, INST_M * INST_N);
    return (p != null && p > 0.002) ? p : 0.15;
  }
  /* THE PADS DO NOT GET GUILLOTINED. `edenmist` takes 1.24 s just to reach its
     own peak and INST_MAX_BEATS closes the note at 1.25, so cutting it where it
     stands handed Paolo a swell that was chopped a hair before the loudest part
     of itself -- measured at 0.085 against a judgeable floor of 0.15. Instead
     the STEP is solved backwards from the room available, so a long voice plays
     a SHORTER version of its whole shape rather than the front of a long one.
     A voice whose length does not follow the step (half the rack) has nothing
     to solve, and says so by returning its default. */
  function instStepFor(name, want, semi) {
    var e = INST_VOICE[name];
    if (!e) return clamp(want / 1.4, 0.03, 2);
    var a = instSec(name, INST_SD[0], semi);
    var b = instSec(name, INST_SD[INST_N - 1], semi);
    if (Math.abs(b - a) < 0.004) return null;            /* fixed-length voice */
    if (want <= a) return INST_SD[0];
    if (want >= b) return INST_SD[INST_N - 1];
    for (var i = 1; i < INST_N; i++) {
      var p = instSec(name, INST_SD[i - 1], semi);
      var n = instSec(name, INST_SD[i], semi);
      if (want <= n && n - p > 1e-4) {
        return INST_SD[i - 1] + (INST_SD[i] - INST_SD[i - 1]) * (want - p) / (n - p);
      }
    }
    return INST_SD[INST_N - 1];
  }
  /* the absolute wall-clock instant the sound in flight is over. render() sets
     it, bodyInstrument reads it. Synchronous scheduling, one render at a time,
     so a module-level handoff is safe -- and it is the only way an instrument
     body can know where the NOTE ends rather than where ITS OWN hit ends. */
  var INST_CUT = null;

  /* THE WHOLE AUDIBLE LIFE. The room is triggered at the SAME instant as the
     strike, not after it -- so the sound lasts as long as the LONGER of the two,
     never their sum. The first version added them, which overstated every
     roomy sound by about double and made the render gate call five bells
     "a click" for being audible over only a third of a length that was never
     real. A duration this engine reports is a duration the game will schedule
     against, so it has to be the truth. */
  function beatsOf(v) {
    var body = q(v.atk + v.decay);
    /* HIS RACK RINGS LONGER THAN ITS DECAY, AND EVERY VOICE RINGS DIFFERENTLY
       (8/19). bodyInstrument hands synthV a step duration of decay*BEAT, but
       his voices do NOT all obey it: `templeblock` is 45 ms no matter what you
       ask for, `dawnpad` is six seconds. A recipe that declares `decay` alone
       was therefore LYING ABOUT ITS OWN LENGTH in both directions at once --
       sfx_render failed 20 candidates for outliving their spec and 9 more for
       being "a click" inside it, off the SAME wrong number. A single fudge
       multiplier cannot fix that, because there is no multiplier that is right
       for a 45 ms woodblock and a 6 s pad.
       SO THE NUMBER IS MEASURED, NOT GUESSED (VERIFY ON THE REAL SURFACE):
       INST_VOICE holds every borrowed voice's real audible length, rendered
       off his own rack. THE DECLARATION FOLLOWS THE BODY, never the other way
       round -- shortening the sound to fit the number would have been changing
       what he approved to make a gate go green. */
    if (v.synth === 'instrument') {
      body = q(Math.min(INST_MAX_BEATS,
                        v.atk + instSec(v.inst, instStep(v), semiOf(v.hz)) / BEAT + 0.03));
    }
    var tail = (v.space > 0.02) ? q(v.room) : 0;
    return q(Math.max(body, tail)) + Math.max.apply(null, v.hits);
  }
  function durSec(v) { return beatsOf(v) * BEAT; }

  /* ---- THE GAME EVENTS ------------------------------------------------- */
  var EVENTS = [
    { ev: 'step_dirt',    label: 'FOOTSTEP — DIRT',     why: 'every step you take in the desert and the lots' },
    { ev: 'step_asphalt', label: 'FOOTSTEP — ASPHALT',  why: 'the street. the sound you hear most in the game' },
    { ev: 'step_gravel',  label: 'FOOTSTEP — GRAVEL',   why: 'shoulders, yards, the boneyard' },
    { ev: 'door_open',    label: 'DOOR OPENS',          why: 'going INTO a building, every interior in the valley' },
    { ev: 'door_shut',    label: 'DOOR SHUTS',          why: 'the door closing behind you' },
    { ev: 'pickup',       label: 'PICK SOMETHING UP',   why: 'loot, items, anything into the bag' },
    { ev: 'hit',          label: 'YOU LAND A HIT',      why: 'combat contact. this one has to feel like it landed' },
    { ev: 'block',        label: 'BLOCKED',             why: 'the hit that did not land' },
    { ev: 'kill',         label: 'KILL — ON THE BEAT',  why: 'the kill drops exactly on the beat, with the music' },
    { ev: 'ui_tap',       label: 'UI TAP',              why: 'every button on the phone' },
    { ev: 'phone_buzz',   label: 'PHONE BUZZES',        why: 'a new post, a message, the feed' },
    { ev: 'save_chime',   label: 'SAVED',               why: 'the run recorded what you did' },
    /* ---- THE COMBAT VOICE (8/1/26) -------------------------------------
       The 7/30 batch had no gun in it, and combat is a shooting game whose
       gunshot was still a placeholder oscillator. These five are every world
       sound the fight makes that was still beeping. */
    { ev: 'shot',         label: 'YOUR GUN GOES OFF',   why: 'the sound the game makes most in a fight. everything else is judged against it' },
    { ev: 'miss',         label: 'THE SHOT MISSES',     why: 'it went past. you feel it leave without landing' },
    { ev: 'vital',        label: 'VITAL HIT',           why: 'you hit something that matters. worse than a hit, not yet a kill' },
    { ev: 'hurt',         label: 'YOU TAKE THE HIT',    why: 'return fire lands on YOU. the only sound in the game that is bad news' },
    { ev: 'clear',        label: 'THE FIGHT IS OVER',   why: 'everyone is down and the room goes quiet' },
    /* ---- THE WORLD TONE (8/1/26) ---------------------------------------
       The valley makes NO sound. You walk, you hear your own feet, then
       nothing. These are not a wall of wind -- they are the RARE thing you
       hear in the emptiness, fired minutes apart. See the research record. */
    { ev: 'air_day',      label: 'THE VALLEY AT MIDDAY', why: 'outside, in the heat. what you hear when nothing is happening' },
    { ev: 'air_night',    label: 'THE VALLEY AT NIGHT',  why: 'outside, after dark. this one is the horror' },
    { ev: 'air_inside',   label: 'INSIDE A BUILDING',    why: 'a room with nobody in it but you' },
    /* ---- BATCH 02 (8/2/26): SIX MOMENTS THE GAME ALREADY HAS ----------
       Paolo 8/2: "Theres no new sounds make new sounds" and, ruling the moment
       rather than the sound, "eat will be a different sound". Every one of these
       already happens in the run today, in silence. */
    { ev: 'eat',        label: 'YOU EAT',            why: 'what the room was holding, and you took it. nobody else hears this' },
    { ev: 'sleep',      label: 'YOU SLEEP',          why: 'eight hours gone. the biggest block of time in the game' },
    { ev: 'talk_start', label: 'SOMEBODY TURNS TO YOU', why: 'the moment a conversation starts. small: a person is not an event' },
    { ev: 'go_inside',  label: 'YOU STEP INSIDE',    why: 'crossing into a building. the ROOM is the sound, not the door' },
    { ev: 'quest_done', label: 'IT IS DONE',         why: 'the run completed. the one moment that earns the whole room' },
    { ev: 'time_pass',  label: 'HOURS GO BY',        why: 'time spent standing still. the only sound here that moves in pitch' },
    /* ---- DOORS, FRESH COOK (8/9/26) -----------------------------------
       He killed all ten metal/wood doors on 7/30 and named DOORS in the minimum
       demo sound set on 8/9. GRAVEYARD IS FINAL binds me, not him -- and the
       7/30 post-mortem already wrote the brief for the replacement: ash and
       stone won 25 UP / 0 DOWN while metal and wood lost, and the survivors
       were brighter, shorter, harder-driven. NEW IDS so the dead ten stay dead
       and stay findable. */
    { ev: 'door_drag',  label: 'THE DOOR DRAGS OPEN', why: 'thirty years of sand in the sill. it hauls, it does not creak' },
    { ev: 'door_clack', label: 'THE DOOR STOPS DEAD', why: 'latch and frame at the same instant. the sound that CUTS and STOPS' },
    /* ---- end fresh doors events ---- */

    /* =====================================================================
       BATCH SFX-03 (8/12/26) — THE WHOLE GAME, NOT THE DEMO
       ---------------------------------------------------------------------
       Paolo 8/11: "we may need way more voices and way more sounds for the
       whole game." Voices got an ENVELOPE cast from his six approved. Sounds
       get the same treatment from the other direction: his 140 thumbs were
       measured before a single new recipe was written, and the batch is built
       inside what the measurement said.

       WHAT THE 140 VERDICTS ACTUALLY SAY (all five records/BOHEMIA_SFX_VERDICT_*
       files parsed against the cooked vectors, 62 UP / 78 DOWN):

         MATERIAL IS THE VERDICT, not a knob.
           glass  5 UP  0 DOWN   100%      metal  3 UP 12 DOWN   20%
           crystal 8/7  53%                water  1 UP  4 DOWN   20%
           stone  10/10 50%                wood   5 UP 10 DOWN   33%
           bell   10/10 50%
           choir   5/5  50%
           ash    13/17 43%
         Metal, wood and water together are 9 UP / 26 DOWN. That is not one bad
         cook, it is 35 judgements agreeing, and it independently reproduces the
         7/30 door post-mortem (ash and stone lived, metal and wood died) from
         data that post-mortem never touched.

         HE KILLS SOUNDS THAT ARE PUSHED. mkup (makeup gain) is the single
         strongest continuous separator in the whole set: UP mean 0.92, DOWN
         mean 1.28, effect size -1.17. drive is second: UP 0.16, DOWN 0.30,
         -0.62. Nothing else clears 0.45. That IS his v1 complaint ("it sounds
         like it was made with some software from 2006") stated in numbers:
         loud and saturated is the tell.

         WHAT IT DOES NOT SAY, and the gate does not pretend otherwise: WITHIN
         a single event's five candidates there is no parameter with a clean
         direction (8 events split, no knob better than 5/7). Which of five
         cousins he wants is taste, and taste is his. The envelope picks the
         FAMILY; he still picks the sound.

       SO THE LAW THIS BATCH IS BUILT UNDER, machine-checked by sfx_envelope_gate.py:
         1. Cook from the materials that win. metal/wood/water only when the
            object IS that thing, and then brighter, shorter and less driven
            than the ten doors that died.
         2. mkup <= 1.10 and drive <= 0.30 on every new recipe base, and the
            jitter ranges may not climb out of that either.
       ===================================================================== */

    /* ---- A. THE GROUND. He named "footsteps by ground" demo-critical and the
       game shipped three surfaces. A city has more than three. ---- */
    { ev: 'step_concrete', label: 'FOOTSTEP — CONCRETE', why: 'every interior floor and every sidewalk. after asphalt this is the most-heard sound in the game' },
    { ev: 'step_sand',     label: 'FOOTSTEP — DEEP SAND', why: 'off the pavement, where the valley is taking the city back. it swallows the step' },
    { ev: 'step_glass',    label: 'FOOTSTEP — BROKEN GLASS', why: 'a dead city is carpeted in it. you cannot walk quietly through a looted room' },
    { ev: 'step_wood',     label: 'FOOTSTEP — FLOORBOARDS', why: 'porches, motel rooms, anything built before the money left' },
    { ev: 'step_metal',    label: 'FOOTSTEP — METAL DECK', why: 'storage doors, catwalks, a truck bed. the one that announces you' },

    /* ---- B. THE FIGHT. The gun got a voice on 8/1. Everything else the fight
       does was still silent. ---- */
    { ev: 'swing',      label: 'YOU SWING AND MISS',   why: 'the bat goes through the air. no contact, just the weight of it' },
    { ev: 'melee_hit',  label: 'MELEE CONNECTS',       why: 'pipe on a body. the closest, worst sound in the game' },
    { ev: 'reload',     label: 'YOU RELOAD',           why: 'the beat where you cannot shoot. the player has to HEAR the window open and close' },
    { ev: 'dry_fire',   label: 'EMPTY',                why: 'you pulled and nothing happened. the sound that means you counted wrong' },
    { ev: 'casing',     label: 'BRASS HITS THE FLOOR', why: 'after the shot, from a different place in the room. it tells you the room is hard' },

    /* ---- C. THE BODY. Hardcore RPG: the body is a system and it never made a
       sound. ---- */
    { ev: 'heartbeat',  label: 'YOUR HEART, TOO LOUD', why: 'low health. the sound that is inside your head, not in the room' },
    { ev: 'breath',     label: 'OUT OF BREATH',        why: 'you ran too far. the cost of moving fast, made audible' },
    { ev: 'drink',      label: 'YOU DRINK',            why: 'water in a desert. the single most valuable thing anybody has' },
    { ev: 'patch_up',   label: 'YOU PATCH YOURSELF UP', why: 'cloth and tape. slow, close, and nobody is helping you' },

    /* ---- D. THE CITY YOU BUILD. It is a city-builder and building was mute. ---- */
    { ev: 'build_place', label: 'IT GOES DOWN',   why: 'a thing you decided on lands on the map and is now real' },
    { ev: 'demolish',    label: 'IT COMES APART', why: 'you took something down. it should cost you something to hear' },
    { ev: 'deed',        label: 'YOU OWN IT NOW', why: 'the deed lands. ownership is the whole spine of the game' },
    { ev: 'money',       label: 'MONEY MOVES [DEAD 8/20 -- NO CASH]',    why: 'cash changes hands. in a post-economic valley this is never neutral' },
    { ev: 'power_on',    label: 'THE BLOCK LIGHTS', why: 'the grid takes a block. LIGHT IS TERRITORY, so this is a territorial sound' },

    /* ---- E. THE VALLEY MOVES. The three air beds are the silence; these are
       the rare things that break it. ---- */
    { ev: 'wind_gust',  label: 'A GUST COMES THROUGH', why: 'the valley leaning on the building you are standing in' },
    { ev: 'neon_buzz',  label: 'NEON, STILL LIT',      why: 'the 12% that has power. an ugly, beautiful, electric sound' },
    { ev: 'generator',  label: 'A GENERATOR, SOMEWHERE', why: 'somebody is running one. that means PEOPLE, and it is not always good news' },
    { ev: 'dog_far',    label: 'A DOG, FAR OFF',       why: 'the only other living thing you can hear. distance is the whole point' },

    /* ---- F. THE PHONE AND THE MENU. ui_tap was carrying every interface
       moment in the game by itself. ---- */
    { ev: 'ui_back',  label: 'BACK / CLOSE',   why: 'leaving a screen. the answer to the tap, one step down' },
    { ev: 'ui_deny',  label: 'YOU CANNOT DO THAT', why: 'refused. short and flat, never a buzzer' },
    { ev: 'equip',    label: 'CLOTHES GO ON',  why: 'the wardrobe is a whole system that never made a sound' },
    /* ---- end batch SFX-03 events ---- */

    /* =====================================================================
       BATCH SFX-04 (8/12/26) — THE TWELVE THAT DIED, ANSWERED BY A DIFFERENT
       PHYSICS
       ---------------------------------------------------------------------
       Paolo: "you need more diverse sounds bro its getting stale at this
       point." He judged 270 and killed 173, and TWELVE of the 26 new moments
       died with all five candidates dead. The post-mortem blamed material.
       IT WAS NOT MATERIAL. It was that every sound in this engine was a
       STRUCK RESONANT OBJECT -- and the twelve that died are, almost to a
       one, the moments that are not a strike: breaking glass is a hundred
       collisions, a swing is turbulence, a drag is friction, neon is
       electrical, breath has no body at all. A strike-shaped engine was
       being asked to imitate things that never get struck, and he heard it.
       So these are NOT re-cooks. Every one is a new id (GRAVEYARD IS FINAL:
       the sixty dead candidates stay dead and stay findable) built on a
       method the engine did not have this morning. The moment survives, the
       sound is made a different way.
       WHAT ANSWERS WHAT, and why that physics:
         PARTICLE (Cook's PhISEM)   many small collisions under one decaying
           energy: broken glass underfoot, a magazine and slide, coins, a
           deck plate ringing under a boot.
         FRICTION (stick-slip)      continuous, no attack: a bat through the
           air catching, cloth and tape, a thing being dragged apart.
         AIR (turbulence)           no body, no strike: breath, a dog's cry
           carried on distance, wind through a gap.
         FM (Chowning)              inharmonic and electrical, or clean and
           bell-like: neon, money, a deed landing, the wardrobe.
       ===================================================================== */
    { ev: 'glass_crunch', label: 'FOOTSTEP — BROKEN GLASS', why: 'a hundred small collisions under your boot, not one struck pane. the old one died because it was a struck pane' },
    { ev: 'deck_ring',    label: 'FOOTSTEP — METAL DECK',   why: 'the plate rings and the grit on it scatters. metal died as a struck bar; this is the boot AND the grit' },
    { ev: 'swing_air',    label: 'YOU SWING AND MISS',      why: 'the bat catching air. there is nothing to strike in a miss, which is exactly why the struck version died' },
    { ev: 'mag_clack',    label: 'YOU RELOAD',              why: 'three metal parts finding each other. a cloud of small collisions, not one bell' },
    { ev: 'breath_out',   label: 'OUT OF BREATH',           why: 'turbulence through a throat. it has no body at all, and the old one gave it one' },
    { ev: 'tape_pull',    label: 'YOU PATCH YOURSELF UP',   why: 'cloth and tape dragging apart. friction, slow and close, with no attack anywhere in it' },
    { ev: 'set_down',     label: 'IT GOES DOWN',            why: 'the weight arriving and settling. a low landing with the grit of it, not a chime' },
    { ev: 'deed_stamp',   label: 'YOU OWN IT NOW',          why: 'ownership lands like a stamp and rings after. clean and inharmonic, the FF cursor grown up' },
    { ev: 'cash_count',   label: 'MONEY MOVES [DEAD 8/20 -- NO CASH]',             why: 'paper and coin counted off. many small events, never one tone' },
    { ev: 'neon_hum',     label: 'NEON, STILL LIT',         why: 'gas and current, which is electrical and never a struck body. the 12% that has power' },
    { ev: 'dog_cry',      label: 'A DOG, FAR OFF',          why: 'a cry with the air of the distance in it. the only other living thing you can hear' },
    { ev: 'cloth_on',     label: 'CLOTHES GO ON',           why: 'fabric moving over a body. friction, quiet, and over before you place it' },
    /* ---- end batch SFX-04 events ---- */

    /* =====================================================================
       BATCH SFX-05 (8/15/26) — THE SEVEN BIG MOMENTS STILL PLAYING SILENCE
       ---------------------------------------------------------------------
       After three full sweeps the game has 105 sounds and these seven moments
       have none: you shoot and miss, you hit something that matters, the fight
       ends, you sleep, somebody turns to you, you step inside, and the run is
       done -- the last of which his own brief calls "the one moment that earns
       the whole room".
       WHY THESE SEVEN AND NOT THE OTHERS. Every silent moment was sorted
       first. Eight have been killed TWICE and are closed by STOP PRODUCING --
       no third cook, ever, unless he asks for one. Six more (swing, patch_up,
       build_place, equip, and the doors) were answered by SFX-04 or the fresh
       doors, and the answer LIVED. What is left is exactly these seven:
       rejected once, in the very first batch, and never re-answered since.
       THE METHOD IS HIS DATA, NOT MY TASTE. friction is the best-performing
       engine in the game -- 40% against modal's 36% -- and it did not exist
       when these seven were cooked. Four of the seven are friction; the other
       three are moments that genuinely ARE a struck object. particle and air
       are not used at all: they went 0 for 30 and are barred.
       AND THEY ARE THE FIRST BATCH THE REGION ACTUALLY BINDS. Containment has
       been a forward-looking law with an empty list since 8/12, because
       re-cooking SFX-03 to fit the box would have invalidated thumbs he had
       already given. These are new, so every candidate lands inside the
       bounding box of the 105 sounds he has approved. */
    { ev: 'miss_past',   label: 'THE SHOT MISSES',       why: 'it went past you. there is nothing to strike in a miss, which is why the struck one died' },
    { ev: 'vital_deep',  label: 'VITAL HIT',             why: 'worse than a hit and not yet a kill. lower and longer than the hit he kept, and it lands in the body' },
    { ev: 'clear_still', label: 'THE FIGHT IS OVER',     why: 'everyone is down and the room goes quiet. a space with nothing left happening in it' },
    { ev: 'sleep_sink',  label: 'YOU SLEEP',             why: 'settling in, and eight hours gone. the biggest block of time in the game passes in silence today' },
    { ev: 'turn_to_you', label: 'SOMEBODY TURNS TO YOU', why: 'the moment a conversation starts. small on purpose: a person is not an event' },
    { ev: 'cross_in',    label: 'YOU STEP INSIDE',       why: 'crossing into a building. the ROOM is the sound, not the door. NOT named step_* -- every step_ event in this engine is a GROUND SURFACE, and the render gate rightly holds those to no-room and short, which a threshold crossing is the opposite of' },
    { ev: 'done_ring',   label: 'IT IS DONE',            why: 'the run completed. his own words: the one moment that earns the whole room' },

    /* ---- BATCH SFX-06 (8/16, HE ASKED FOR NEW SOUNDS) -------------------
       SEVEN MOMENTS THAT ARE REAL IN THE BUILD TODAY AND MAKE NO NOISE. Every
       one was found by reading the run and the fight for a toast or a verdict
       that already fires, never by inventing a moment to spend a sound on.
       FIVE OF THE SEVEN ARE COMBAT, because the demo opens on the family
       defence fight and his newest locked ruling is THE FIGHT HAS TO MOVE YOU
       -- a fight you can win from one spot is broken. You cannot hear a reason
       to move if nothing about moving makes a sound, so this batch gives ears
       to the three things that punish standing still: your cover degrading,
       the car you are behind heating toward going up, and a gun leaving his
       rock to flank you. */
    { ev: 'dirt_take',   label: 'THE GROUND TAKES IT',     why: 'the shot that missed arrives somewhere. built out of HIS instruments, not synthesis -- the version made of raw physics died 5 of 5' },
    { ev: 'stone_bite',  label: 'YOUR COVER LOSES A PIECE', why: 'the stone you are behind is being eaten while you use it. his instruments this time, five different ones' },
    { ev: 'panel_tick',  label: 'THE CAR TICKS',           why: 'hiding behind a car is a clock you can watch. this is the clock, played on five of his own voices' },
    { ev: 'boots_go',    label: 'BOOTS GOING SOMEWHERE',   why: 'a gun leaves his rock to flank you. the fight has to move you, so you have to hear it move them' },
    { ev: 'will_goes',   label: 'HIS WILL GOES',           why: 'a shooter becomes a person running. five of his voices for the moment a man quits' },
    { ev: 'come_up',     label: 'YOU COME UP',             why: 'waking. the other half of the sleep he swept five of five, and this one is made of his instruments' },

    /* ---- SFX-06, DEAD 30 OF 30 ON 8/16, LISTED SO HIS VERDICTS STAY TRUE ---
       Kept as events because every recipe needs one and because the judge
       sheet must still be able to show him what he already decided. They are
       not re-cooked and nothing new is asked of him here. */
    { ev: 'round_land', label: 'THE ROUND LANDS [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is dirt_take' },
    { ev: 'cover_chew', label: 'YOUR COVER TAKES ONE [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is stone_bite' },
    { ev: 'car_heat', label: 'THE CAR TAKES ANOTHER [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is panel_tick' },
    { ev: 'man_moves', label: 'SOMEBODY REPOSITIONS [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is boots_go' },
    { ev: 'nerve_break', label: 'HIS NERVE GOES [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is will_goes' },
    { ev: 'wake_up', label: 'YOU WAKE UP [DEAD 8/16]', why: 'the raw-synthesis version. died 5 of 5. its replacement is come_up' },
    { ev: 'went_down',   label: 'YOU GO DOWN',           why: 'you lost the fight. the biggest thing that can happen to you in this game and it has been silent since launch' },

    /* ---- BATCH SFX-08 (8/16b) -- VOLUME FOR MOMENTS HE ALREADY KEPT ----
       Siblings, not replacements: each feeds a moment he has already approved,
       alongside the candidate he already keeps. His old thumbs do not move. */
    { ev: 'shot_more',   label: 'THE GUN, AGAIN',        why: 'MORE gunshots, not a different one. shot.3 is the single most-played sound in the game and it has been alone since 8/1, so every firefight is one sample on repeat' },
    { ev: 'hurt_more',   label: 'TAKING IT, AGAIN',      why: 'more of the hit that lands on YOU. hurt.2 has been alone since 8/1 and return fire is constant' },
    { ev: 'hit_more',    label: 'LANDING IT, AGAIN',     why: 'more of the hit you land. two variants for the sound a whole fight is made of is two too few' },
    { ev: 'brass_more',  label: 'MORE BRASS',            why: 'casing.0 plays after every single shot and it is one sample. brass never lands the same way twice' },
    { ev: 'cover_more',  label: 'COVER EATS ANOTHER',    why: 'block.2 has been alone since 7/30 and one volley can be eaten three times in a second' },
    { ev: 'walk_more',   label: 'MORE SIDEWALK',         why: 'step_concrete.2 is one sample for every sidewalk and every interior floor in the valley, the second most-walked surface in the game' },
    /* ---- batch SFX-09 (8/20): the source that works, aimed at moments that
       have never been offered it. Every one of these is the instrument-backed
       answer to a moment that died twice as raw synthesis. ---- */
    { ev: 'gone_quiet',  label: 'THE ROOM GOES QUIET',   why: 'everyone is down and the air comes back. clear died 0 of 65 as synthesis and was never once offered an instrument' },
    { ev: 'mag_home',    label: 'THE MAG SEATS',         why: 'three metal parts finding each other. the beat where you cannot shoot, and the player has to HEAR it' },
    { ev: 'hands_pass',  label: 'IT CHANGES HANDS [DEAD 8/20 -- NO CASH]',      why: 'paper and coin counted off. in a post-economic valley money moving is never nothing' },
    { ev: 'dog_calls',   label: 'A DOG, OUT THERE',      why: 'the only other living thing you can hear, with the air of the distance in it' },
    { ev: 'sign_alive',  label: 'THE SIGN IS STILL ON',  why: 'the 12% that has power. gas and current, which is electrical and never a struck body' },
    { ev: 'lungs_burn',  label: 'YOUR LUNGS CATCH UP',   why: 'you ran too far. turbulence through a throat, with no body in it at all' },
    /* ---- batch SFX-10 (8/20): siblings for the two surfaces that became
       reachable on 8/20 and had one sample each. A single sample under every
       step is the MACHINE GUN, and bare desert falls through to sand. ---- */
    { ev: 'sand_more',   label: 'MORE SAND',             why: 'step_sand.0 is ONE sample, and the ground classifier returns sand for any unnamed tile -- which is most of the open valley' },
    { ev: 'wood_more',   label: 'MORE BOARDS',           why: 'step_wood has two samples for every porch, deck and floorboard in the game' },
    /* ---- 8/20: THERE IS NO PAPER AND THERE ARE NO COINS (Paolo, on the
       hands_pass.4 line). money, cash_count and hands_pass are dead for their
       BRIEF, not their sound -- fifteen candidates across three sources, all
       cooked to be paper and coin in a world that has neither. This is the
       moment written from what actually moves. ---- */
    { ev: 'parts_pass',  label: 'PARTS CHANGE HANDS',    why: 'resource parts, metal with mass, handed over or tipped out. what actually moves when something changes hands in this valley' },
    /* ---- 8/21: THE DESERT MOVES THE METAL. Replaces THE CAR TICKS, which
       died 10 for 10 under panel_tick and car_heat because its brief described
       an engine cooling after a drive, in a valley whose cars are years-old
       wrecks. Sun-heated sheet metal contracting in the late afternoon is the
       version that is true here, needs nobody to have driven anything, and
       belongs to the world rather than to combat cover. ---- */
    { ev: 'metal_ticks', label: 'THE METAL MOVES',    why: 'sun-heated sheet metal contracting as the day comes off it. irregular, and the gaps get longer as it cools. no engine, no driver, just steel and the desert' },
    /* ---- end batch SFX-05 events ---- */
    /* ---- end batch 02 events ---- */
  ];

  /* ---- THE RECIPES -----------------------------------------------------
     Materials first, then the room. THE TAIL RULE: footsteps are DRY and close
     (space near zero) because they fire constantly and a tail on them would
     turn walking into a cathedral. Doors, kills and saves get the room, because
     those are the moments the emptiness is supposed to land. */
  var RECIPE = {
    /* --- the ground. ash and grit, almost no pitch, no room --- */
    step_dirt: {
      base: { mat: 'ash', hz: 96, modes: 4, bright: 0.55, decay: 0.125, damp: 2.1,
              warble: 0.4, trans: 0.72, transHz: 1500, transQ: 0.9, grit: 0.85,
              gritHz: 900, space: 0.06, room: 0.0625, refl: 0, dark: 700,
              width: 0.35, drive: 0.15, mkup: 0.799, gain: 0.34 },
      jit:  { hz: [72, 132], decay: [0.0625, 0.1875], transHz: [900, 2600],
              grit: [0.7, 0.95], gritHz: [600, 1500], damp: [1.6, 2.6],
              bright: [0.4, 0.8], width: [0.25, 0.55] }
    },
    step_asphalt: {
      base: { mat: 'stone', hz: 158, modes: 5, bright: 0.9, decay: 0.0625, damp: 2.4,
              warble: 0.5, trans: 0.85, transHz: 4200, transQ: 1.6, grit: 0.7,
              gritHz: 3200, space: 0.09, room: 0.0625, refl: 1, dark: 2200,
              width: 0.4, drive: 0.2, mkup: 0.831, gain: 0.32 },
      jit:  { hz: [120, 230], transHz: [2600, 6500], grit: [0.5, 0.85],
              gritHz: [2000, 5200], decay: [0.0625, 0.125], damp: [1.8, 2.9],
              bright: [0.7, 1.3], width: [0.3, 0.6] }
    },
    step_gravel: {
      base: { mat: 'ash', hz: 210, modes: 4, bright: 1.1, decay: 0.0625, damp: 2.6,
              warble: 0.3, trans: 0.9, transHz: 5200, transQ: 2.4, grit: 0.95,
              gritHz: 4200, space: 0.08, room: 0.0625, refl: 1, dark: 2600,
              width: 0.55, drive: 0.1, mkup: 0.901, gain: 0.3, hits: [0, 0.0625, 0.125] },
      jit:  { hz: [150, 300], transHz: [3400, 7500], gritHz: [2800, 6000],
              decay: [0.0625, 0.125], transQ: [1.4, 4], width: [0.4, 0.75] },
      hitSets: [[0, 0.0625, 0.125], [0, 0.0625], [0, 0.0625, 0.125, 0.1875],
                [0, 0.125], [0, 0.0625, 0.125]]
    },
    /* --- the doors. THIS is where the building tells you how empty it is --- */
    door_open: {
      base: { mat: 'metal', hz: 132, modes: 9, bright: 0.85, decay: 0.5, damp: 1.5,
              warble: 2.2, atk: 0.0625, slide: 3, trans: 0.4, transHz: 1800,
              transQ: 3.5, grit: 0.35, gritHz: 1100, space: 0.62, room: 0.875,
              refl: 3, dark: 1700, width: 0.7, drive: 0.25, mkup: 1.1, gain: 0.3 },
      jit:  { hz: [96, 210], decay: [0.375, 0.75], warble: [1.2, 3], slide: [1, 6],
              space: [0.45, 0.8], room: [0.625, 1.25], dark: [1100, 2800],
              damp: [1.1, 2], grit: [0.2, 0.5] }
    },
    door_shut: {
      base: { mat: 'wood', hz: 78, modes: 6, bright: 0.7, decay: 0.25, damp: 1.9,
              warble: 0.8, trans: 0.95, transHz: 2400, transQ: 1.2, grit: 0.3,
              gritHz: 1400, space: 0.5, room: 0.625, refl: 2, dark: 1300,
              width: 0.6, drive: 0.35, mkup: 1.071, gain: 0.42, hits: [0, 0.0625] },
      jit:  { hz: [58, 118], decay: [0.1875, 0.375], transHz: [1500, 4200],
              space: [0.35, 0.7], room: [0.4375, 0.9375], dark: [900, 2200],
              drive: [0.2, 0.55], damp: [1.4, 2.4] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625]]
    },
    /* --- the crystal set. the FF cursor family --- */
    pickup: {
      base: { mat: 'crystal', hz: 720, modes: 8, bright: 1.35, decay: 0.375, damp: 1.15,
              warble: 1.4, slide: 2, trans: 0.55, transHz: 7200, transQ: 2.2,
              space: 0.4, room: 0.4375, refl: 2, dark: 4600, width: 0.65,
              mkup: 0.794, gain: 0.3 },
      jit:  { hz: [520, 1050], decay: [0.25, 0.5625], bright: [1.0, 1.8],
              warble: [0.8, 2.2], slide: [0, 5], space: [0.28, 0.55],
              dark: [3200, 6500], damp: [0.9, 1.5] }
    },
    ui_tap: {
      base: { mat: 'crystal', hz: 1180, modes: 6, bright: 1.2, decay: 0.125, damp: 1.6,
              warble: 1.1, trans: 0.6, transHz: 8200, transQ: 2.8, space: 0.22,
              room: 0.1875, refl: 1, dark: 5200, width: 0.5, mkup: 0.599, gain: 0.22 },
      jit:  { hz: [860, 1650], decay: [0.0625, 0.1875], bright: [0.9, 1.6],
              warble: [0.6, 1.8], transHz: [5600, 10500], space: [0.14, 0.32],
              dark: [3600, 7000] }
    },
    save_chime: {
      base: { mat: 'bell', hz: 392, modes: 11, bright: 1.0, decay: 1.25, damp: 0.85,
              warble: 1.8, atk: 0.0625, trans: 0.28, transHz: 5200, transQ: 1.8,
              space: 0.72, room: 1.25, refl: 3, dark: 3400, width: 0.8,
              mkup: 0.239, gain: 0.26 },
      jit:  { hz: [294, 520], decay: [0.9375, 1.75], warble: [1.2, 2.6],
              space: [0.55, 0.9], room: [1, 1.75], dark: [2400, 4800],
              bright: [0.8, 1.4], damp: [0.7, 1.1] }
    },

    /* ===================================================================
       THE COMBAT VOICE (8/1/26)
       -------------------------------------------------------------------
       RESEARCH (records/BOHEMIA_RESEARCH_GUNSHOT_8_1_26.md): a real gunshot
       is not one sound, it is four, and the whole engine already has a layer
       for each of them:
         MUZZLE BLAST   gas decompressing past the muzzle. LOW and broadband,
                        and it falls in pitch as the pressure drops -> low hz,
                        heavy grit, NEGATIVE slide.
         BALLISTIC CRACK the supersonic shock, a separate and much sharper
                        event than the blast -> trans + a high transHz.
         MECHANICAL     firing pin, bolt, slide. A second, tiny, later strike
                        -> hits[], which already exists for gravel.
         ENVIRONMENT    the reflection off whatever you are standing in
                        -> space / room / refl / dark.
       And the game-audio rule that decides the mix: in a game the player needs
       a clear TRANSIENT and reliable feedback more than a cinematic tail. That
       is the same ruling his own thumbs already made on 7/30 -- survivors were
       brighter, shorter, harder-driven, more articulated -- so the research and
       his taste agree, and both say CUT AND STOP.

       MATERIALS ARE CHOSEN FROM HIS THUMBS, NOT FROM CONVENTION. On 7/30:
       ash 10/10, bell 10/10, stone 5/5, crystal 8/10 -- metal 3/15, wood 0/5.
       A gunshot is conventionally a metal crack. Metal is the material he
       killed hardest, and both dead doors were metal and wood. So the gun is
       built from ASH and STONE: concussion and dust rather than a Hollywood
       receiver clank, which is also what a post-collapse valley should sound
       like. This is the inference from his verdict being used to predict what
       dies BEFORE he has to sit and listen to it.
       =================================================================== */

    /* THE GUN. Everything else in a fight is judged against this one. */
    shot: {
      base: { mat: 'ash', hz: 74, modes: 5, bright: 0.5, decay: 0.125, damp: 2.4,
              warble: 0.35, slide: -7, trans: 0.95, transHz: 5600, transQ: 1.1,
              grit: 0.95, gritHz: 700, space: 0.22, room: 0.25, refl: 2,
              dark: 900, width: 0.45, drive: 0.55, mkup: 1.765, gain: 0.34,
              hits: [0, 0.03125] },
      jit:  { hz: [58, 96], transHz: [3800, 8200], gritHz: [500, 1100],
              slide: [-11, -4], decay: [0.0625, 0.1875], drive: [0.4, 0.75],
              space: [0.14, 0.34], dark: [700, 1400], width: [0.35, 0.6] },
      /* the action cycling: one shot, or a shot with the bolt behind it */
      hitSets: [[0, 0.03125], [0, 0.03125], [0], [0, 0.03125, 0.0625], [0, 0.0625]]
    },
    /* IT WENT PAST. Almost no body -- a miss is air, not impact. */
    miss: {
      base: { mat: 'ash', hz: 320, modes: 3, bright: 1.5, decay: 0.0625, damp: 2.8,
              warble: 0.2, slide: -5, trans: 0.5, transHz: 7200, transQ: 0.7,
              grit: 0.98, gritHz: 5200, space: 0.16, room: 0.1875, refl: 1,
              dark: 4200, width: 0.7, drive: 0.12, mkup: 1.25, gain: 0.24 },
      jit:  { hz: [240, 440], gritHz: [3800, 7000], transHz: [5200, 9500],
              slide: [-9, -2], width: [0.55, 0.9], bright: [1.2, 2.0],
              decay: [0.0625, 0.125], space: [0.1, 0.26] }
    },
    /* VITAL. The horrible bright one. crystal went 8/10 with him, and this is
       the moment that wants to sound WRONG rather than powerful. */
    vital: {
      base: { mat: 'crystal', hz: 880, modes: 7, bright: 1.7, decay: 0.1875,
              damp: 1.9, warble: 1.4, trans: 0.88, transHz: 8200, transQ: 3.2,
              grit: 0.4, gritHz: 3600, space: 0.3, room: 0.375, refl: 2,
              dark: 5200, width: 0.6, drive: 0.3, mkup: 2.0, gain: 0.28 },
      jit:  { hz: [660, 1180], transHz: [6200, 10500], warble: [0.9, 2.2],
              decay: [0.125, 0.3125], bright: [1.3, 2.2], space: [0.2, 0.44],
              damp: [1.4, 2.4], width: [0.45, 0.8] }
    },
    /* IT LANDED ON YOU. The only bad-news sound in the game, so it is the
       darkest and the most concussive: low, dull, close, and it does not ring. */
    hurt: {
      base: { mat: 'ash', hz: 58, modes: 4, bright: 0.35, decay: 0.1875, damp: 2.2,
              warble: 0.5, slide: -9, trans: 0.6, transHz: 1100, transQ: 0.8,
              grit: 0.8, gritHz: 420, space: 0.3, room: 0.375, refl: 1,
              dark: 600, width: 0.3, drive: 0.6, mkup: 1.528, gain: 0.36 },
      jit:  { hz: [44, 78], gritHz: [320, 620], transHz: [800, 1800],
              slide: [-14, -5], decay: [0.125, 0.25], drive: [0.45, 0.8],
              space: [0.2, 0.44], dark: [450, 900] }
    },
    /* ===================================================================
       THE WORLD TONE (8/1/26)
       -------------------------------------------------------------------
       RESEARCH (records/BOHEMIA_RESEARCH_AMBIENCE_8_1_26.md): a game ambience
       runs FOUR layers -- the bed (room tone), SPOT ambient (a distant car, a
       door), character foley (footsteps: already shipped), and threat. And the
       horror finding that decided the whole shape:

         "Silence is not a sound you can't add; it is a sound you choose to
          remove. In horror, tension comes not from what you add but from what
          you take away."

       That is already this game's doctrine -- small sounds intimate, big sounds
       telling you how empty it is. So these are NOT a continuous wall of wind.
       They are the SPOT layer: one rare event in a lot of nothing, fired
       minutes apart with the silence between doing the work.

       AND IT DODGES THE LOOP PROBLEM BY CONSTRUCTION. The literature's warning
       is that a repeating ambience bed is what breaks immersion; the fix is
       randomised one-shots over a sparse bed. A one-shot is exactly what this
       engine already makes, so the ambience needs NO new synthesis and no
       loop -- which is also the only way it can obey the SCREECH LAW, because
       there is nothing here that can ring or feed back.

       THESE ARE COOKED LOUD ENOUGH TO JUDGE, not at bed level. He has to hear
       a thing to thumb it. What level it sits at in the world is a wiring
       decision that comes after his verdict, not a number I bake in now. */

    /* MIDDAY. Heat, distance, and dry air. High and thin, almost no body --
       the sound of a valley too hot to be outside in. */
    air_day: {
      base: { mat: 'stone', hz: 1480, modes: 4, bright: 1.3, decay: 1.25, damp: 1.6,
              warble: 2.1, atk: 0.25, slide: -2, trans: 0.06, transHz: 6200,
              transQ: 0.5, grit: 0.55, gritHz: 4800, space: 0.85, room: 1.75,
              refl: 3, dark: 5200, width: 0.9, drive: 0.03, mkup: 1.0, gain: 0.2 },
      jit:  { hz: [1080, 1960], decay: [1, 1.75], warble: [1.5, 2.8],
              gritHz: [3600, 6200], space: [0.7, 0.95], room: [1.5, 2.25],
              dark: [4200, 6500], bright: [1, 1.7], width: [0.75, 1] }
    },
    /* AFTER DARK. THIS ONE IS THE HORROR. Low, wide, and it should sound like
       a room far bigger than the one you are standing in. choir is the dead
       chapel -- the only place in the batch it belongs. */
    air_night: {
      base: { mat: 'choir', hz: 62, modes: 8, bright: 0.4, decay: 2.5, damp: 1.1,
              warble: 2.4, atk: 0.5, slide: -1, trans: 0.04, transHz: 900,
              transQ: 0.6, grit: 0.2, gritHz: 700, space: 0.95, room: 2.75,
              refl: 4, dark: 1200, width: 1, drive: 0.02, mkup: 1.4, gain: 0.22 },
      jit:  { hz: [48, 84], decay: [1.875, 3.25], warble: [1.8, 3],
              room: [2.25, 3], dark: [800, 1900], bright: [0.3, 0.6],
              space: [0.85, 1], damp: [0.9, 1.4] }
    },
    /* INSIDE. A building with nobody in it. Close and dry, because the contrast
       with the night outside is the whole point: the room is SMALL and you can
       hear that it is small. */
    air_inside: {
      base: { mat: 'wood', hz: 148, modes: 5, bright: 0.5, decay: 0.75, damp: 1.8,
              warble: 1.2, atk: 0.125, trans: 0.14, transHz: 1600, transQ: 0.9,
              grit: 0.3, gritHz: 1100, space: 0.35, room: 0.625, refl: 2,
              dark: 1600, width: 0.5, drive: 0.06, mkup: 1.0, gain: 0.2 },
      jit:  { hz: [112, 210], decay: [0.5, 1], warble: [0.8, 1.8],
              space: [0.25, 0.5], room: [0.5, 0.875], dark: [1200, 2400],
              bright: [0.4, 0.75], width: [0.4, 0.7] }
    },

    /* THE ROOM GOES QUIET. The one moment in a fight allowed a real tail, and
       the only one that gets bell -- which went 10/10 with him, and is what
       SAVED is built from. Resolution sounds like resolution. */
    clear: {
      base: { mat: 'bell', hz: 262, modes: 10, bright: 0.85, decay: 1.5, damp: 0.9,
              warble: 1.6, atk: 0.0625, trans: 0.3, transHz: 3800, transQ: 1.6,
              grit: 0.15, gritHz: 1800, space: 0.78, room: 1.5, refl: 3,
              dark: 2600, width: 0.85, drive: 0.05, mkup: 1.538, gain: 0.26 },
      jit:  { hz: [196, 349], decay: [1.125, 2], warble: [1.1, 2.4],
              space: [0.62, 0.92], room: [1.25, 2], dark: [1800, 3600],
              bright: [0.65, 1.15], damp: [0.75, 1.1] }
    },
    /* --- combat. bone and dead metal, close, only the kill gets the hall --- */
    hit: {
      base: { mat: 'bone', hz: 168, modes: 6, bright: 0.8, decay: 0.1875, damp: 2.2,
              warble: 0.6, slide: -9, trans: 1.0, transHz: 2600, transQ: 1.1,
              grit: 0.5, gritHz: 1600, space: 0.18, room: 0.1875, refl: 1,
              dark: 1500, width: 0.45, drive: 0.5, mkup: 0.953, gain: 0.55 },
      jit:  { hz: [124, 260], decay: [0.125, 0.3125], slide: [-16, -4],
              transHz: [1700, 4200], grit: [0.3, 0.7], drive: [0.3, 0.75],
              damp: [1.7, 2.8], bright: [0.6, 1.2] }
    },
    block: {
      base: { mat: 'metal', hz: 296, modes: 10, bright: 1.25, decay: 0.375, damp: 1.2,
              warble: 2.4, trans: 0.8, transHz: 6200, transQ: 2.6, grit: 0.2,
              gritHz: 3400, space: 0.34, room: 0.375, refl: 2, dark: 3200,
              width: 0.7, drive: 0.3, mkup: 1.034, gain: 0.4 },
      jit:  { hz: [220, 470], decay: [0.25, 0.5625], warble: [1.5, 3],
              bright: [1, 1.9], transHz: [4200, 9000], space: [0.22, 0.5],
              dark: [2200, 5200], damp: [0.9, 1.7] }
    },
    kill: {
      base: { mat: 'bell', hz: 104, modes: 11, bright: 0.75, decay: 0.9375, damp: 1.05,
              warble: 2.0, slide: -3, trans: 0.85, transHz: 1900, transQ: 1.4,
              grit: 0.3, gritHz: 1200, space: 0.78, room: 1.0625, refl: 3,
              dark: 1900, width: 0.75, drive: 0.4, mkup: 0.831, gain: 0.72 },
      jit:  { hz: [78, 152], decay: [0.6875, 1.375], warble: [1.4, 2.8],
              space: [0.6, 0.95], room: [0.875, 1.4375], dark: [1300, 2900],
              drive: [0.25, 0.6], damp: [0.85, 1.4] }
    },
    /* --- the phone. dead metal on a table, not a synth buzz --- */
    phone_buzz: {
      base: { mat: 'metal', hz: 62, modes: 7, bright: 0.5, decay: 0.1875, damp: 2.0,
              warble: 2.8, trans: 0.7, transHz: 900, transQ: 1.1, grit: 0.45,
              gritHz: 600, space: 0.3, room: 0.25, refl: 2, dark: 1000,
              width: 0.5, drive: 0.45, mkup: 1.104, gain: 0.38,
              hits: [0, 0.0625, 0.125, 0.5, 0.5625, 0.625] },
      jit:  { hz: [46, 92], warble: [1.8, 3], decay: [0.125, 0.25],
              transHz: [600, 1600], grit: [0.3, 0.6], drive: [0.3, 0.65],
              dark: [700, 1500] },
      hitSets: [[0, 0.0625, 0.125, 0.5, 0.5625, 0.625],
                [0, 0.0625, 0.125],
                [0, 0.0625, 0.125, 0.1875, 0.5, 0.5625, 0.625, 0.6875],
                [0, 0.0625, 0.5, 0.5625],
                [0, 0.0625, 0.125, 0.5, 0.5625, 0.625]]
    },
    /* ---- BATCH 02 RECIPES (8/2/26) ----
       Spread deliberately across this file's own contrast law: eat and talk are
       dry and close, quest_done gets the most room of anything in the game. */
    eat: {
      base: { mat: 'water', hz: 148, modes: 6, bright: 0.7, decay: 0.1875, damp: 2.2,
              warble: 1.4, trans: 0.55, transHz: 1100, transQ: 0.8, grit: 0.6,
              gritHz: 700, space: 0.05, room: 0.0625, refl: 0, dark: 800,
              width: 0.3, drive: 0.2, mkup: 1.2, gain: 0.3,
              hits: [0, 0.125] },
      jit:  { hz: [110, 205], decay: [0.125, 0.3125], transHz: [700, 1900],
              grit: [0.45, 0.8], gritHz: [500, 1200], warble: [0.8, 2.2],
              damp: [1.7, 2.8], width: [0.2, 0.45] },
      hitSets: [[0, 0.125], [0, 0.0625, 0.1875], [0, 0.1875],
                [0, 0.0625, 0.125, 0.25], [0, 0.125, 0.25]]
    },
    sleep: {
      base: { mat: 'choir', hz: 54, modes: 11, bright: 0.45, decay: 3, damp: 0.7,
              warble: 1.9, atk: 0.375, slide: -4, trans: 0.08, transHz: 500,
              transQ: 0.6, grit: 0.18, gritHz: 380, space: 0.72, room: 2.25,
              refl: 3, dark: 900, width: 0.85, drive: 0.05, mkup: 1.6, gain: 0.26 },
      jit:  { hz: [42, 72], decay: [2.25, 3.75], atk: [0.25, 0.5], slide: [-8, -2],
              space: [0.6, 0.85], room: [1.75, 2.75], dark: [650, 1300],
              warble: [1.3, 2.6], width: [0.7, 1] }
    },
    talk_start: {
      base: { mat: 'wood', hz: 262, modes: 5, bright: 1.05, decay: 0.125, damp: 2,
              warble: 0.6, trans: 0.62, transHz: 2100, transQ: 1.3, grit: 0.16,
              gritHz: 1500, space: 0.18, room: 0.125, refl: 1, dark: 1900,
              width: 0.55, drive: 0.1, mkup: 0.95, gain: 0.28 },
      jit:  { hz: [205, 340], decay: [0.0625, 0.1875], transHz: [1500, 3200],
              bright: [0.85, 1.4], damp: [1.6, 2.5], width: [0.5, 0.8],
              space: [0.14, 0.26] }
    },
    go_inside: {
      base: { mat: 'stone', hz: 84, modes: 8, bright: 0.6, decay: 0.75, damp: 1.4,
              warble: 1.1, atk: 0.0625, trans: 0.3, transHz: 1300, transQ: 1.8,
              grit: 0.3, gritHz: 900, space: 0.66, room: 1.125, refl: 4,
              dark: 1200, width: 0.75, drive: 0.15, mkup: 1.25, gain: 0.29 },
      jit:  { hz: [62, 124], decay: [0.5, 1], space: [0.5, 0.8], room: [0.875, 1.5],
              refl: [2, 4], dark: [850, 1900], warble: [0.7, 1.8], width: [0.6, 0.95] }
    },
    quest_done: {
      base: { mat: 'bell', hz: 196, modes: 14, bright: 1.15, decay: 3.5, damp: 1.1,
              warble: 2.4, trans: 0.45, transHz: 3400, transQ: 2.2, grit: 0.1,
              gritHz: 2600, space: 0.88, room: 2.875, refl: 4, dark: 3000,
              width: 0.95, drive: 0.1, mkup: 1.35, gain: 0.3 },
      jit:  { hz: [150, 268], decay: [2.75, 4], space: [0.75, 1], room: [2.25, 3],
              dark: [2200, 4200], warble: [1.7, 3], bright: [0.9, 1.7],
              transHz: [2400, 5200] }
    },
    time_pass: {
      base: { mat: 'glass', hz: 340, modes: 7, bright: 1.3, decay: 1.25, damp: 1.7,
              warble: 1.6, atk: 0.125, slide: -9, trans: 0.2, transHz: 4600,
              transQ: 2.6, grit: 0.08, gritHz: 3400, space: 0.42, room: 0.75,
              refl: 2, dark: 2400, width: 0.62, drive: 0.05, mkup: 1.15, gain: 0.24 },
      jit:  { hz: [255, 460], decay: [0.875, 1.75], slide: [-14, -5],
              space: [0.3, 0.55], room: [0.5, 1], dark: [1700, 3400],
              warble: [1.1, 2.4], atk: [0.0625, 0.1875] }
    }
    /* ---- end batch 02 recipes ---- */,
    /* ---- FRESH DOOR RECIPES (8/9/26) ----
       ASH and STONE only. Metal and wood are a documented dead end here, not an
       untried idea, and the numbers behind that are in the graveyard. Both are
       cooked BRIGHTER, SHORTER and HARDER-DRIVEN than the ten that died, per
       the same post-mortem. */
    door_drag: {
      base: { mat: 'ash', hz: 174, modes: 5, bright: 1.15, decay: 0.1875, damp: 2.5,
              warble: 0.45, atk: 0, slide: -2, trans: 0.88, transHz: 3600,
              transQ: 1.8, grit: 0.92, gritHz: 2600, space: 0.14, room: 0.1875,
              refl: 1, dark: 2900, width: 0.5, drive: 0.62, mkup: 1.05, gain: 0.34,
              hits: [0, 0.0625, 0.125] },
      jit:  { hz: [138, 232], bright: [0.95, 1.35], decay: [0.125, 0.25],
              transHz: [2800, 5200], grit: [0.82, 0.98], gritHz: [1900, 3600],
              drive: [0.5, 0.78], dark: [2200, 3800], damp: [2.1, 2.9],
              width: [0.4, 0.62] },
      hitSets: [[0, 0.0625, 0.125], [0, 0.0625], [0, 0.0625, 0.125, 0.1875],
                [0, 0.125], [0, 0.0625, 0.125]]
    },
    door_clack: {
      base: { mat: 'stone', hz: 232, modes: 4, bright: 1.3, decay: 0.0625, damp: 2.8,
              warble: 0.3, atk: 0, slide: -6, trans: 0.98, transHz: 5200,
              transQ: 2.2, grit: 0.55, gritHz: 3400, space: 0.1, room: 0.125,
              refl: 1, dark: 3200, width: 0.42, drive: 0.75, mkup: 1.12, gain: 0.4 },
      jit:  { hz: [186, 296], bright: [1.1, 1.55], decay: [0.0625, 0.125],
              transHz: [4200, 7000], grit: [0.42, 0.7], drive: [0.62, 0.9],
              dark: [2600, 4200], slide: [-9, -3], damp: [2.4, 3.2] }
    },
    /* ---- end fresh door recipes ---- */

    /* =====================================================================
       BATCH SFX-03 RECIPES (8/12/26) — inside the measured envelope.
       Every base below: mkup <= 1.10, drive <= 0.30, and metal/wood/water used
       ONLY where the struck object is that thing. See the EVENTS header for
       the numbers those two rules came out of.
       ===================================================================== */

    /* ---- A. THE GROUND. Dry and close, like the three that shipped: a tail
       on a sound that fires every half-second turns walking into a cathedral. */
    step_concrete: {
      base: { mat: 'stone', hz: 138, modes: 5, bright: 0.8, decay: 0.0625, damp: 2.5,
              warble: 0.4, trans: 0.8, transHz: 3400, transQ: 1.4, grit: 0.5,
              gritHz: 2400, space: 0.07, room: 0.0625, refl: 1, dark: 1800,
              width: 0.38, drive: 0.14, mkup: 0.86, gain: 0.31 },
      jit:  { hz: [108, 190], transHz: [2200, 5200], grit: [0.35, 0.68],
              gritHz: [1600, 3800], decay: [0.0625, 0.125], damp: [2, 2.9],
              bright: [0.62, 1.1], width: [0.3, 0.55] }
    },
    step_sand: {
      base: { mat: 'ash', hz: 74, modes: 4, bright: 0.42, decay: 0.125, damp: 2.4,
              warble: 0.25, trans: 0.55, transHz: 780, transQ: 0.7, grit: 0.95,
              gritHz: 520, space: 0.05, room: 0.0625, refl: 0, dark: 560,
              width: 0.3, drive: 0.08, mkup: 0.9, gain: 0.3 },
      jit:  { hz: [58, 102], transHz: [520, 1300], grit: [0.85, 1],
              gritHz: [380, 900], decay: [0.0625, 0.1875], damp: [1.9, 2.8],
              bright: [0.3, 0.6], width: [0.22, 0.44] }
    },
    step_glass: {
      /* glass is the only material in the whole judged set that went 5 UP
         0 DOWN, so the surface that is literally glass gets it undiluted. */
      base: { mat: 'glass', hz: 620, modes: 6, bright: 1.3, decay: 0.125, damp: 2.2,
              warble: 0.9, trans: 0.86, transHz: 6800, transQ: 2.6, grit: 0.7,
              gritHz: 5200, space: 0.12, room: 0.125, refl: 1, dark: 4200,
              width: 0.6, drive: 0.1, mkup: 0.72, gain: 0.26,
              hits: [0, 0.0625, 0.125] },
      jit:  { hz: [470, 880], transHz: [5200, 9500], gritHz: [3800, 7000],
              decay: [0.0625, 0.1875], bright: [1.05, 1.6], damp: [1.8, 2.7],
              width: [0.48, 0.8], grit: [0.55, 0.85] },
      hitSets: [[0, 0.0625, 0.125], [0, 0.0625], [0, 0.0625, 0.125, 0.1875],
                [0, 0.125, 0.1875], [0, 0.0625, 0.125]]
    },
    step_wood: {
      /* WOOD IS A LOSING MATERIAL (5 UP / 10 DOWN) and a floorboard is wood.
         The door post-mortem's own prescription applies: brighter, shorter,
         LESS driven than the ones that died. */
      base: { mat: 'wood', hz: 116, modes: 5, bright: 0.95, decay: 0.125, damp: 2.2,
              warble: 0.6, trans: 0.78, transHz: 2800, transQ: 1.3, grit: 0.28,
              gritHz: 1600, space: 0.1, room: 0.125, refl: 1, dark: 1500,
              width: 0.42, drive: 0.12, mkup: 0.84, gain: 0.3 },
      jit:  { hz: [92, 158], transHz: [2000, 4200], decay: [0.0625, 0.1875],
              bright: [0.75, 1.3], damp: [1.8, 2.6], grit: [0.18, 0.42],
              width: [0.34, 0.6], dark: [1100, 2200] }
    },
    step_metal: {
      /* METAL IS THE WORST MATERIAL IN THE SET (3 UP / 12 DOWN). A deck plate
         cannot be anything else, so it is cooked as far from the dead twelve
         as the material allows: short, bright, almost no drive, no room. */
      base: { mat: 'metal', hz: 245, modes: 6, bright: 1.25, decay: 0.125, damp: 2.6,
              warble: 1.6, trans: 0.9, transHz: 5600, transQ: 2, grit: 0.32,
              gritHz: 3400, space: 0.11, room: 0.125, refl: 1, dark: 3200,
              width: 0.5, drive: 0.16, mkup: 0.78, gain: 0.27 },
      jit:  { hz: [190, 330], transHz: [4200, 8200], decay: [0.0625, 0.1875],
              bright: [1, 1.6], warble: [1.1, 2.2], damp: [2.1, 2.9],
              width: [0.4, 0.68], dark: [2400, 4400] }
    },

    /* ---- B. THE FIGHT. Judged against the gunshot, which is the loudest thing
       in the mix: every one of these sits UNDER it on purpose. */
    swing: {
      base: { mat: 'ash', hz: 132, modes: 4, bright: 0.6, decay: 0.1875, damp: 1.9,
              warble: 0.3, atk: 0.0625, slide: -5, trans: 0.3, transHz: 1400,
              transQ: 0.8, grit: 0.88, gritHz: 1100, space: 0.14, room: 0.1875,
              refl: 1, dark: 1200, width: 0.66, drive: 0.1, mkup: 0.8, gain: 0.26 },
      jit:  { hz: [98, 186], decay: [0.125, 0.25], slide: [-9, -2],
              gritHz: [800, 1800], grit: [0.78, 0.98], bright: [0.45, 0.85],
              width: [0.55, 0.85], dark: [900, 1800] }
    },
    melee_hit: {
      base: { mat: 'bone', hz: 92, modes: 6, bright: 0.7, decay: 0.1875, damp: 2.3,
              warble: 0.5, trans: 0.92, transHz: 1900, transQ: 1.1, grit: 0.6,
              gritHz: 1300, space: 0.2, room: 0.25, refl: 2, dark: 1100,
              width: 0.45, drive: 0.26, mkup: 0.94, gain: 0.36, hits: [0, 0.0625] },
      jit:  { hz: [72, 128], decay: [0.125, 0.3125], transHz: [1400, 3000],
              grit: [0.45, 0.78], space: [0.14, 0.3], damp: [1.9, 2.7],
              drive: [0.16, 0.3], dark: [850, 1700] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625]]
    },
    reload: {
      /* THREE HITS ON THE GRID, because a reload is three events: the mag out,
         the mag in, the slide. Metal, cooked bright and undriven per the rule. */
      base: { mat: 'metal', hz: 310, modes: 6, bright: 1.3, decay: 0.0625, damp: 2.7,
              warble: 1.8, trans: 0.85, transHz: 6200, transQ: 2.4, grit: 0.3,
              gritHz: 3800, space: 0.16, room: 0.1875, refl: 1, dark: 3400,
              width: 0.55, drive: 0.12, mkup: 0.7, gain: 0.25,
              hits: [0, 0.25, 0.5] },
      jit:  { hz: [240, 420], transHz: [4600, 9000], bright: [1.05, 1.7],
              warble: [1.2, 2.4], damp: [2.2, 3], width: [0.44, 0.72],
              dark: [2600, 4600] },
      hitSets: [[0, 0.25, 0.5], [0, 0.1875, 0.4375], [0, 0.3125, 0.5625],
                [0, 0.25, 0.4375], [0, 0.1875, 0.5]]
    },
    dry_fire: {
      base: { mat: 'bone', hz: 420, modes: 4, bright: 1.15, decay: 0.0625, damp: 2.8,
              warble: 0.4, trans: 0.95, transHz: 4600, transQ: 3, grit: 0.14,
              gritHz: 2600, space: 0.06, room: 0.0625, refl: 0, dark: 2600,
              width: 0.3, drive: 0.08, mkup: 0.62, gain: 0.31 },
      jit:  { hz: [330, 560], transHz: [3400, 6800], bright: [0.95, 1.45],
              transQ: [2.2, 4.4], damp: [2.4, 3], width: [0.22, 0.44],
              dark: [1900, 3600] }
    },
    casing: {
      /* PANNED AWAY FROM THE SHOT, always: the brass lands somewhere else in
         the room, and that offset is the whole reason this sound exists. */
      base: { mat: 'crystal', hz: 1450, modes: 6, bright: 1.4, decay: 0.1875, damp: 2.4,
              warble: 1.3, trans: 0.7, transHz: 8600, transQ: 2.6, grit: 0.2,
              gritHz: 6000, space: 0.3, room: 0.3125, refl: 2, dark: 5200,
              width: 0.72, drive: 0.06, mkup: 0.55, gain: 0.32,
              hits: [0.25, 0.375, 0.4375] },
      jit:  { hz: [1050, 1950], transHz: [6500, 11000], decay: [0.125, 0.3125],
              bright: [1.1, 1.8], space: [0.22, 0.42], dark: [4000, 7000],
              width: [0.6, 0.95], warble: [0.9, 1.9] },
      hitSets: [[0.25, 0.375, 0.4375], [0.25, 0.3125], [0.1875, 0.3125, 0.375, 0.4375],
                [0.3125, 0.4375], [0.25, 0.375, 0.5]]
    },

    /* ---- C. THE BODY. These are the only sounds in the game that are INSIDE
       the player, so they get almost no room: a tail would put them across
       the street from him. */
    heartbeat: {
      base: { mat: 'stone', hz: 46, modes: 7, bright: 0.3, decay: 0.25, damp: 1.6,
              warble: 0.3, atk: 0.0625, trans: 0.34, transHz: 320, transQ: 0.7,
              grit: 0.55, gritHz: 300, space: 0.14, room: 0.0625, refl: 2,
              dark: 400, width: 0.95, drive: 0.18, mkup: 0.9, gain: 0.4,
              hits: [0, 0.3125] },
      jit:  { hz: [36, 62], decay: [0.1875, 0.375], transHz: [240, 520],
              bright: [0.22, 0.44], damp: [1.3, 2.1], dark: [320, 620],
              width: [0.85, 1] },
      hitSets: [[0, 0.3125], [0, 0.25], [0, 0.375], [0, 0.3125], [0, 0.25, 1]]
    },
    breath: {
      base: { mat: 'ash', hz: 88, modes: 4, bright: 0.5, decay: 0.375, damp: 1.8,
              warble: 0.3, atk: 0.125, slide: -3, trans: 0.16, transHz: 900,
              transQ: 0.6, grit: 0.97, gritHz: 760, space: 0.08, room: 0.125,
              refl: 0, dark: 800, width: 0.35, drive: 0.05, mkup: 0.86, gain: 0.24,
              hits: [0, 0.75] },
      jit:  { hz: [66, 122], decay: [0.25, 0.5], gritHz: [520, 1200],
              slide: [-7, 0], atk: [0.0625, 0.1875], bright: [0.38, 0.7],
              width: [0.26, 0.5], dark: [600, 1300] },
      hitSets: [[0, 0.75], [0, 0.6875], [0, 0.8125], [0, 0.75, 1.5], [0, 0.625]]
    },
    drink: {
      /* WATER IS A LOSING MATERIAL (1 UP / 4 DOWN) and this event is water.
         Cooked short and clean rather than the long wet ring that died. */
      base: { mat: 'water', hz: 250, modes: 5, bright: 0.85, decay: 0.1875, damp: 2.1,
              warble: 1.1, trans: 0.4, transHz: 1700, transQ: 1.2, grit: 0.32,
              gritHz: 1200, space: 0.1, room: 0.125, refl: 1, dark: 1400,
              width: 0.34, drive: 0.06, mkup: 0.78, gain: 0.26,
              hits: [0, 0.375, 0.6875] },
      jit:  { hz: [190, 340], decay: [0.125, 0.3125], transHz: [1200, 2800],
              bright: [0.65, 1.15], warble: [0.7, 1.7], damp: [1.7, 2.5],
              width: [0.26, 0.5], dark: [1000, 2200] },
      hitSets: [[0, 0.375, 0.6875], [0, 0.4375], [0, 0.3125, 0.625, 0.9375],
                [0, 0.5], [0, 0.375, 0.75]]
    },
    patch_up: {
      base: { mat: 'ash', hz: 158, modes: 4, bright: 0.72, decay: 0.25, damp: 2.2,
              warble: 0.35, atk: 0.0625, slide: -2, trans: 0.5, transHz: 2400,
              transQ: 1, grit: 0.93, gritHz: 1900, space: 0.12, room: 0.1875,
              refl: 1, dark: 1600, width: 0.4, drive: 0.09, mkup: 0.82, gain: 0.24,
              hits: [0, 0.4375] },
      jit:  { hz: [120, 220], decay: [0.1875, 0.375], gritHz: [1300, 2800],
              transHz: [1700, 3800], bright: [0.58, 1], damp: [1.8, 2.6],
              width: [0.32, 0.58] },
      hitSets: [[0, 0.4375], [0, 0.375], [0, 0.3125, 0.625], [0, 0.5], [0, 0.4375]]
    },

    /* ---- D. THE CITY YOU BUILD. These are the ONLY sounds in this batch that
       earn the room, because owning a block is the one thing the emptiness is
       supposed to answer. */
    build_place: {
      base: { mat: 'stone', hz: 104, modes: 7, bright: 0.7, decay: 0.375, damp: 1.7,
              warble: 0.8, trans: 0.82, transHz: 2100, transQ: 1.3, grit: 0.42,
              gritHz: 1400, space: 0.5, room: 0.5625, refl: 3, dark: 1500,
              width: 0.68, drive: 0.16, mkup: 1.02, gain: 0.3, hits: [0, 0.0625] },
      jit:  { hz: [82, 148], decay: [0.25, 0.5], space: [0.38, 0.66],
              room: [0.4375, 0.875], transHz: [1500, 3200], dark: [1100, 2400],
              warble: [0.5, 1.3], width: [0.55, 0.88] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625, 0.1875]]
    },
    demolish: {
      base: { mat: 'stone', hz: 66, modes: 6, bright: 0.55, decay: 0.625, damp: 2,
              warble: 0.6, trans: 0.75, transHz: 1500, transQ: 0.9, grit: 0.86,
              gritHz: 1000, space: 0.6, room: 0.875, refl: 3, dark: 1100,
              width: 0.75, drive: 0.24, mkup: 1.06, gain: 0.32,
              hits: [0, 0.0625, 0.1875, 0.375] },
      jit:  { hz: [50, 96], decay: [0.4375, 0.875], space: [0.46, 0.78],
              room: [0.625, 1.25], grit: [0.72, 0.96], dark: [800, 1800],
              drive: [0.14, 0.3], width: [0.62, 0.95] },
      hitSets: [[0, 0.0625, 0.1875, 0.375], [0, 0.125, 0.3125],
                [0, 0.0625, 0.25, 0.4375, 0.5625], [0, 0.1875, 0.375],
                [0, 0.0625, 0.125, 0.3125]]
    },
    deed: {
      base: { mat: 'bell', hz: 262, modes: 11, bright: 0.95, decay: 1.75, damp: 0.95,
              warble: 1.9, atk: 0.0625, trans: 0.3, transHz: 4200, transQ: 1.9,
              grit: 0.08, gritHz: 2800, space: 0.78, room: 1.5, refl: 3,
              dark: 2900, width: 0.85, drive: 0.06, mkup: 0.5, gain: 0.42 },
      jit:  { hz: [196, 350], decay: [1.25, 2.375], space: [0.62, 0.95],
              room: [1.125, 2], dark: [2100, 4000], warble: [1.3, 2.6],
              bright: [0.78, 1.35], damp: [0.8, 1.2] }
    },
    money: {
      base: { mat: 'crystal', hz: 980, modes: 7, bright: 1.25, decay: 0.3125, damp: 1.4,
              warble: 1.5, trans: 0.5, transHz: 7600, transQ: 2, grit: 0.12,
              gritHz: 5200, space: 0.34, room: 0.375, refl: 2, dark: 4400,
              width: 0.62, drive: 0.05, mkup: 0.6, gain: 0.31,
              hits: [0, 0.125, 0.1875] },
      jit:  { hz: [720, 1380], decay: [0.1875, 0.4375], transHz: [5600, 10000],
              bright: [1, 1.7], space: [0.24, 0.46], dark: [3200, 6000],
              warble: [1, 2.1], width: [0.5, 0.85] },
      hitSets: [[0, 0.125, 0.1875], [0, 0.0625, 0.1875], [0, 0.125, 0.25, 0.3125],
                [0, 0.1875], [0, 0.0625, 0.125, 0.25]]
    },
    power_on: {
      /* LIGHT IS TERRITORY. This is the sound of somebody taking ground, so it
         is the choir coming up under a rising line, not a switch clicking. */
      base: { mat: 'choir', hz: 87, modes: 8, bright: 0.65, decay: 1.5, damp: 1.2,
              warble: 1.4, atk: 0.25, slide: 5, trans: 0.18, transHz: 1200,
              transQ: 1.4, grit: 0.16, gritHz: 900, space: 0.8, room: 1.625,
              refl: 4, dark: 1600, width: 0.9, drive: 0.08, mkup: 0.66, gain: 0.26 },
      jit:  { hz: [66, 118], decay: [1.125, 2.125], slide: [2, 9],
              atk: [0.1875, 0.375], space: [0.66, 0.95], room: [1.25, 2.125],
              dark: [1200, 2600], warble: [0.9, 2.1], width: [0.78, 1] }
    },

    /* ---- E. THE VALLEY MOVES. Long, quiet, and fired minutes apart. Same rule
       as the three air beds: these are what you hear when nothing is happening,
       so they must never sound like an EVENT. */
    wind_gust: {
      base: { mat: 'ash', hz: 58, modes: 4, bright: 0.34, decay: 2.5, damp: 1.5,
              warble: 0.4, atk: 0.75, slide: -4, trans: 0.06, transHz: 600,
              transQ: 0.5, grit: 0.98, gritHz: 480, space: 0.6, room: 2.125,
              refl: 2, dark: 700, width: 0.95, drive: 0.04, mkup: 0.9, gain: 0.2 },
      jit:  { hz: [44, 82], decay: [1.875, 3.25], atk: [0.5, 1], slide: [-9, -1],
              gritHz: [340, 760], space: [0.46, 0.78], room: [1.625, 2.75],
              dark: [500, 1100], width: [0.85, 1] }
    },
    neon_buzz: {
      base: { mat: 'glass', hz: 122, modes: 6, bright: 1.1, decay: 1.75, damp: 1.9,
              warble: 2.6, atk: 0.125, trans: 0.14, transHz: 3200, transQ: 2.2,
              grit: 0.55, gritHz: 2600, space: 0.3, room: 0.625, refl: 1,
              dark: 3000, width: 0.48, drive: 0.2, mkup: 0.74, gain: 0.34 },
      jit:  { hz: [98, 168], decay: [1.25, 2.375], warble: [2, 3],
              grit: [0.4, 0.72], transHz: [2400, 4600], dark: [2200, 4200],
              space: [0.22, 0.42], width: [0.38, 0.66] }
    },
    generator: {
      base: { mat: 'stone', hz: 52, modes: 5, bright: 0.36, decay: 2.75, damp: 1.4,
              warble: 1.2, atk: 0.375, trans: 0.1, transHz: 520, transQ: 0.8,
              grit: 0.7, gritHz: 420, space: 0.72, room: 2.375, refl: 3,
              dark: 620, width: 0.7, drive: 0.22, mkup: 0.88, gain: 0.18,
              hits: [0, 0.5, 1] },
      jit:  { hz: [42, 74], decay: [2.125, 3.5], space: [0.58, 0.88],
              room: [1.875, 3], grit: [0.55, 0.85], dark: [460, 950],
              warble: [0.8, 1.8], width: [0.58, 0.9] },
      hitSets: [[0, 0.5, 1], [0, 0.4375, 0.875], [0, 0.5625, 1.125],
                [0, 0.5, 1, 1.5], [0, 0.4375, 0.9375]]
    },
    dog_far: {
      /* DISTANCE IS THE CONTENT. Wide, dark, quiet, and mostly tail: everything
         that says the sound started somewhere you are not. */
      base: { mat: 'choir', hz: 340, modes: 6, bright: 0.6, decay: 0.5, damp: 2,
              warble: 1.3, atk: 0.0625, slide: -6, trans: 0.2, transHz: 1600,
              transQ: 1.6, grit: 0.3, gritHz: 1200, space: 0.9, room: 2, refl: 4,
              dark: 1300, width: 1, drive: 0.05, mkup: 0.7, gain: 0.32,
              hits: [0, 0.5, 0.875] },
      jit:  { hz: [260, 470], decay: [0.375, 0.75], slide: [-11, -2],
              space: [0.78, 1], room: [1.5, 2.5], dark: [950, 1900],
              warble: [0.9, 2], bright: [0.48, 0.9] },
      hitSets: [[0, 0.5, 0.875], [0, 0.625], [0, 0.4375, 0.8125, 1.25],
                [0, 0.5625], [0, 0.5, 1]]
    },

    /* ---- F. THE PHONE AND THE MENU. The tap he approved is the parent; these
       are its family, and they must sit BELOW it so the interface never
       out-shouts the world. */
    ui_back: {
      base: { mat: 'crystal', hz: 780, modes: 5, bright: 1, decay: 0.125, damp: 1.8,
              warble: 0.9, slide: -4, trans: 0.5, transHz: 6200, transQ: 2.4,
              space: 0.18, room: 0.1875, refl: 1, dark: 4000, width: 0.44,
              drive: 0.04, mkup: 0.5, gain: 0.34 },
      jit:  { hz: [580, 1080], decay: [0.0625, 0.1875], slide: [-8, -1],
              bright: [0.8, 1.35], transHz: [4400, 8600], space: [0.12, 0.28],
              dark: [2800, 5400] }
    },
    ui_deny: {
      /* NEVER A BUZZER. Refusal is a short flat glass tap with the tail taken
         off it, not a tone telling him he was stupid. */
      base: { mat: 'glass', hz: 196, modes: 7, bright: 0.8, decay: 0.0625, damp: 2.6,
              warble: 0.5, trans: 0.7, transHz: 2400, transQ: 1.8, grit: 0.18,
              gritHz: 1600, space: 0.14, room: 0.0625, refl: 2, dark: 1700,
              width: 0.62, drive: 0.07, mkup: 0.56, gain: 0.34, hits: [0, 0.0625] },
      jit:  { hz: [152, 268], transHz: [1800, 3600], bright: [0.65, 1.1],
              damp: [2.2, 3], decay: [0.0625, 0.125], dark: [1300, 2400],
              width: [0.56, 0.82] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625]]
    },
    equip: {
      base: { mat: 'ash', hz: 190, modes: 4, bright: 0.8, decay: 0.1875, damp: 2.3,
              warble: 0.4, trans: 0.6, transHz: 3000, transQ: 1.1, grit: 0.9,
              gritHz: 2200, space: 0.14, room: 0.1875, refl: 1, dark: 2000,
              width: 0.46, drive: 0.1, mkup: 0.76, gain: 0.24, hits: [0, 0.1875] },
      jit:  { hz: [148, 264], decay: [0.125, 0.3125], gritHz: [1600, 3200],
              transHz: [2200, 4600], bright: [0.65, 1.15], damp: [1.9, 2.7],
              width: [0.36, 0.64] },
      hitSets: [[0, 0.1875], [0, 0.125], [0, 0.25], [0, 0.1875, 0.375], [0, 0.125]]
    }
    /* ---- end batch SFX-03 recipes ---- */,

    /* =====================================================================
       BATCH SFX-04 RECIPES (8/12/26). Every one declares a `synth` that is
       NOT modal -- that is the whole point of the batch. Materials still set
       the resonance the method excites, and metal is still dead as a BODY
       (the envelope's one surviving law) but is legal as a particle
       resonance, because a cloud of collisions is not a struck bar and the
       thing his 25 metal judgements killed was the struck bar.
       ===================================================================== */

    /* --- PARTICLE: many small collisions under one decaying energy --- */
    glass_crunch: {
      base: { synth: 'particle', mat: 'glass', hz: 900, grains: 26, modes: 6,
              bright: 1.2, decay: 0.1875, damp: 2.1, warble: 0.4, trans: 0.6,
              transHz: 6200, transQ: 2.2, grit: 0.5, gritHz: 4800, space: 0.1,
              room: 0.125, refl: 1, dark: 4200, width: 0.7, drive: 0.08,
              mkup: 0.8, gain: 0.34 },
      jit:  { hz: [680, 1250], grains: [16, 40], decay: [0.125, 0.25],
              bright: [0.95, 1.5], damp: [1.7, 2.6], width: [0.55, 0.9],
              transHz: [4800, 8200], gritHz: [3400, 6200] }
    },
    deck_ring: {
      base: { synth: 'particle', mat: 'metal', hz: 420, grains: 14, modes: 6,
              bright: 1.05, decay: 0.1875, damp: 1.5, warble: 1.4, trans: 0.82,
              transHz: 4400, transQ: 1.8, grit: 0.35, gritHz: 2800, space: 0.14,
              room: 0.1875, refl: 1, dark: 3000, width: 0.6, drive: 0.12,
              mkup: 0.82, gain: 0.33 },
      jit:  { hz: [320, 600], grains: [8, 24], decay: [0.125, 0.3125],
              bright: [0.85, 1.35], damp: [1.1, 2.1], width: [0.48, 0.8],
              transHz: [3400, 6200] }
    },
    mag_clack: {
      base: { synth: 'particle', mat: 'metal', hz: 520, grains: 9, modes: 6,
              bright: 1.15, decay: 0.375, damp: 2, warble: 1.6, trans: 0.7,
              transHz: 5200, transQ: 2, grit: 0.22, gritHz: 3200, space: 0.16,
              room: 0.1875, refl: 1, dark: 3400, width: 0.55, drive: 0.1,
              mkup: 0.76, gain: 0.32, hits: [0, 0.25, 0.5] },
      jit:  { hz: [400, 720], grains: [5, 15], decay: [0.25, 0.5],
              bright: [0.95, 1.45], damp: [1.5, 2.5], width: [0.44, 0.74] },
      hitSets: [[0, 0.25, 0.5], [0, 0.1875, 0.4375], [0, 0.3125, 0.5625],
                [0, 0.25, 0.4375], [0, 0.1875, 0.5]]
    },
    cash_count: {
      base: { synth: 'particle', mat: 'ash', hz: 1150, grains: 18, modes: 4,
              bright: 1.25, decay: 0.25, damp: 2.4, warble: 0.5, trans: 0.4,
              transHz: 6800, transQ: 1.6, grit: 0.4, gritHz: 5200, space: 0.18,
              room: 0.1875, refl: 1, dark: 4600, width: 0.62, drive: 0.05,
              mkup: 0.66, gain: 0.55 },
      jit:  { hz: [820, 1600], grains: [10, 30], decay: [0.1875, 0.375],
              bright: [1, 1.6], damp: [2, 2.7], width: [0.5, 0.85],
              transHz: [5200, 8400] }
    },

    /* --- FRICTION: continuous, and there is no attack anywhere in it --- */
    swing_air: {
      base: { synth: 'friction', mat: 'ash', hz: 150, rough: 22, modes: 4,
              bright: 0.6, decay: 0.25, damp: 1.8, warble: 0.3, atk: 0.0625,
              slide: -7, trans: 0.1, transHz: 1400, transQ: 0.8, grit: 0.6,
              gritHz: 1200, space: 0.12, room: 0.1875, refl: 1, dark: 1300,
              width: 0.68, drive: 0.08, mkup: 0.84, gain: 0.3 },
      jit:  { hz: [110, 210], rough: [12, 34], decay: [0.1875, 0.375],
              slide: [-12, -3], bright: [0.45, 0.9], width: [0.55, 0.9],
              dark: [950, 1900] }
    },
    tape_pull: {
      base: { synth: 'friction', mat: 'ash', hz: 210, rough: 34, modes: 4,
              bright: 0.9, decay: 0.375, damp: 2.2, warble: 0.3, atk: 0.0625,
              slide: -2, trans: 0.16, transHz: 2600, transQ: 1, grit: 0.8,
              gritHz: 2000, space: 0.14, room: 0.125, refl: 2, dark: 2000,
              width: 0.62, drive: 0.07, mkup: 0.78, gain: 0.3 },
      jit:  { hz: [160, 300], rough: [22, 40], decay: [0.25, 0.5],
              bright: [0.7, 1.25], width: [0.56, 0.86], dark: [1500, 2800] }
    },
    cloth_on: {
      base: { synth: 'friction', mat: 'ash', hz: 130, rough: 9, modes: 4,
              bright: 0.55, decay: 0.1875, damp: 2, warble: 0.3, atk: 0.0625,
              slide: -3, trans: 0.12, transHz: 1600, transQ: 0.7, grit: 0.85,
              gritHz: 1300, space: 0.09, room: 0.125, refl: 1, dark: 1400,
              width: 0.46, drive: 0.06, mkup: 0.74, gain: 0.42, hits: [0, 0.1875] },
      jit:  { hz: [98, 190], rough: [5, 16], decay: [0.125, 0.3125],
              bright: [0.42, 0.82], width: [0.36, 0.64], dark: [1000, 2000] },
      hitSets: [[0, 0.1875], [0, 0.125], [0, 0.25], [0, 0.1875, 0.375], [0, 0.125]]
    },

    /* --- AIR: no body, no strike, and the band has to MOVE --- */
    breath_out: {
      base: { synth: 'air', mat: 'ash', hz: 130, rough: 7, modes: 4,
              bright: 0.5, decay: 0.5, damp: 1.7, warble: 0.3, atk: 0.125,
              slide: -4, trans: 0.05, transHz: 900, transQ: 0.6, grit: 0.5,
              gritHz: 800, space: 0.1, room: 0.1875, refl: 0, dark: 900,
              width: 0.4, drive: 0.04, mkup: 0.9, gain: 0.3, hits: [0, 0.75] },
      jit:  { hz: [100, 185], rough: [3, 14], decay: [0.375, 0.6875],
              atk: [0.0625, 0.1875], bright: [0.38, 0.75], slide: [-8, -1],
              width: [0.3, 0.56] },
      hitSets: [[0, 0.75], [0, 0.6875], [0, 0.8125], [0, 0.75, 1.5], [0, 0.625]]
    },
    dog_cry: {
      base: { synth: 'air', mat: 'choir', hz: 300, rough: 18, modes: 5,
              bright: 1.1, decay: 0.5, damp: 1.9, warble: 1.2, atk: 0.0625,
              slide: -5, trans: 0.08, transHz: 1800, transQ: 1.4, grit: 0.25,
              gritHz: 1400, space: 0.88, room: 1.875, refl: 4, dark: 1500,
              width: 0.95, drive: 0.05, mkup: 0.72, gain: 0.3,
              hits: [0, 0.5, 0.875] },
      jit:  { hz: [230, 420], rough: [10, 28], decay: [0.375, 0.75],
              slide: [-10, -2], space: [0.75, 0.96], room: [1.5, 2.375],
              bright: [0.85, 1.5], dark: [1100, 2100] },
      hitSets: [[0, 0.5, 0.875], [0, 0.625], [0, 0.4375, 0.8125, 1.25],
                [0, 0.5625], [0, 0.5, 1]]
    },

    /* --- FM: inharmonic and electrical, or clean and bell-like --- */
    neon_hum: {
      base: { synth: 'fm', mat: 'glass', hz: 120, ratio: 2.17, index: 4.5,
              modes: 6, bright: 1, decay: 1.25, damp: 1.6, warble: 2.2,
              atk: 0.125, trans: 0.1, transHz: 3000, transQ: 2, grit: 0.4,
              gritHz: 2400, space: 0.26, room: 0.5, refl: 1, dark: 2800,
              width: 0.5, drive: 0.14, mkup: 0.7, gain: 0.3 },
      jit:  { hz: [98, 168], ratio: [1.9, 3.4], index: [2.5, 8],
              decay: [0.9375, 1.75], damp: [1.2, 2.2], width: [0.4, 0.68],
              dark: [2100, 4000] }
    },
    deed_stamp: {
      base: { synth: 'fm', mat: 'bell', hz: 262, ratio: 1.41, index: 6.5,
              modes: 8, bright: 1, decay: 1.5, damp: 1.1, warble: 1.8,
              atk: 0.0625, trans: 0.5, transHz: 3400, transQ: 1.6, grit: 0.1,
              gritHz: 2400, space: 0.72, room: 1.375, refl: 3, dark: 2800,
              width: 0.8, drive: 0.06, mkup: 0.6, gain: 0.34, hits: [0, 0.0625] },
      jit:  { hz: [200, 350], ratio: [1.2, 2.9], index: [3.5, 11],
              decay: [1.125, 2], space: [0.6, 0.92], room: [1.125, 1.875],
              damp: [0.85, 1.4], dark: [2100, 3900] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625, 0.1875]]
    },
    set_down: {
      base: { synth: 'fm', mat: 'stone', hz: 78, ratio: 0.707, index: 3,
              modes: 6, bright: 0.7, decay: 0.4375, damp: 1.8, warble: 0.7,
              trans: 0.8, transHz: 1700, transQ: 1.1, grit: 0.55, gritHz: 1200,
              space: 0.42, room: 0.5, refl: 2, dark: 1300, width: 0.62,
              drive: 0.16, mkup: 0.9, gain: 0.34, hits: [0, 0.0625] },
      jit:  { hz: [62, 108], ratio: [0.5, 1.6], index: [1.5, 6],
              decay: [0.3125, 0.625], space: [0.3, 0.58], room: [0.375, 0.75],
              dark: [1000, 2000], width: [0.5, 0.82] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625, 0.1875]]
    }
    /* ---- end batch SFX-04 recipes ---- */,

    /* =====================================================================
       BATCH SFX-05 RECIPES (8/15/26). Every candidate lands inside REGION --
       the bounding box of all 105 sounds he has approved -- and these are the
       first recipes regionBinds actually holds to it.
       ===================================================================== */

    /* --- FRICTION: the method his 330 thumbs rate highest --- */
    miss_past: {
      base: { synth: 'friction', mat: 'stone', hz: 320, rough: 34, modes: 5,
              bright: 1.1, decay: 0.1875, damp: 2.2, warble: 0.5, atk: 0.0625,
              slide: -12, trans: 0.15, transHz: 5200, transQ: 2, grit: 0.7,
              gritHz: 2600, space: 0.14, room: 0.1875, refl: 1, dark: 3000,
              width: 0.75, drive: 0.1, mkup: 0.7, gain: 0.3 },
      jit:  { hz: [250, 430], rough: [24, 40], decay: [0.125, 0.3125],
              slide: [-13.5, -7], bright: [0.9, 1.45], width: [0.6, 0.95],
              dark: [2200, 4200], gritHz: [1900, 3800] }
    },
    sleep_sink: {
      base: { synth: 'friction', mat: 'ash', hz: 96, rough: 5, modes: 4,
              bright: 0.42, decay: 0.75, damp: 2, warble: 0.3, atk: 0.1875,
              slide: -5, trans: 0.1, transHz: 1100, transQ: 0.8, grit: 0.9,
              gritHz: 900, space: 0.16, room: 0.25, refl: 1, dark: 1000,
              width: 0.6, drive: 0.06, mkup: 0.85, gain: 0.3, hits: [0, 0.75] },
      jit:  { hz: [76, 140], rough: [3, 10], decay: [0.5, 1], slide: [-9, -2],
              bright: [0.34, 0.66], width: [0.5, 0.85], dark: [700, 1500] },
      hitSets: [[0, 0.75], [0, 0.625], [0, 0.875], [0, 0.75, 1.5], [0, 0.6875]]
    },
    turn_to_you: {
      base: { synth: 'friction', mat: 'ash', hz: 150, rough: 12, modes: 4,
              bright: 0.6, decay: 0.125, damp: 2.1, warble: 0.3, atk: 0.0625,
              slide: -2, trans: 0.12, transHz: 1900, transQ: 0.9, grit: 0.82,
              gritHz: 1500, space: 0.14, room: 0.125, refl: 2, dark: 1500,
              width: 0.72, drive: 0.05, mkup: 0.62, gain: 0.52 },
      jit:  { hz: [118, 210], rough: [7, 18], decay: [0.0625, 0.1875],
              bright: [0.48, 0.85], width: [0.62, 0.9], dark: [1100, 2200] }
    },
    clear_still: {
      base: { synth: 'friction', mat: 'stone', hz: 58, rough: 3, modes: 6,
              bright: 0.4, decay: 1.5, damp: 1.3, warble: 0.9, atk: 0.25,
              slide: -4, trans: 0.12, transHz: 900, transQ: 0.9, grit: 0.3,
              gritHz: 700, space: 0.8, room: 1.875, refl: 4, dark: 900,
              width: 0.85, drive: 0.08, mkup: 0.8, gain: 0.3 },
      jit:  { hz: [48, 84], rough: [1.5, 7], decay: [1.125, 2.25],
              space: [0.66, 0.95], room: [1.5, 2.5], dark: [600, 1400],
              warble: [0.6, 1.6], atk: [0.1875, 0.375], width: [0.72, 1] }
    },

    /* --- MODAL: these three genuinely ARE a struck object --- */
    vital_deep: {
      base: { mat: 'bone', hz: 74, modes: 6, bright: 0.62, decay: 0.3125,
              damp: 2.2, warble: 0.5, trans: 0.95, transHz: 1600, transQ: 1.2,
              grit: 0.62, gritHz: 1100, space: 0.26, room: 0.3125, refl: 2,
              dark: 950, width: 0.5, drive: 0.3, mkup: 0.98, gain: 0.42,
              hits: [0, 0.0625] },
      jit:  { hz: [60, 100], decay: [0.25, 0.4375], transHz: [1200, 2600],
              grit: [0.45, 0.8], damp: [1.8, 2.6], drive: [0.2, 0.42],
              dark: [700, 1500], width: [0.4, 0.66] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625, 0.1875]]
    },
    cross_in: {
      base: { mat: 'stone', hz: 88, modes: 7, bright: 0.55, decay: 0.625,
              damp: 1.5, warble: 1, atk: 0.0625, trans: 0.3, transHz: 1400,
              transQ: 1.6, grit: 0.32, gritHz: 1000, space: 0.72, room: 1.25,
              refl: 4, dark: 1300, width: 0.8, drive: 0.12, mkup: 0.9, gain: 0.3 },
      jit:  { hz: [70, 124], decay: [0.5, 0.9375], space: [0.58, 0.9],
              room: [1, 1.75], dark: [900, 2000], warble: [0.6, 1.7],
              width: [0.68, 0.98] }
    },
    done_ring: {
      base: { mat: 'crystal', hz: 620, modes: 8, bright: 1.2, decay: 1.25,
              damp: 1.2, warble: 1.6, atk: 0.0625, trans: 0.35, transHz: 6200,
              transQ: 2.2, grit: 0.08, gritHz: 4200, space: 0.78, room: 1.5,
              refl: 3, dark: 4400, width: 0.85, drive: 0.05, mkup: 0.55, gain: 0.34 },
      jit:  { hz: [480, 880], decay: [1, 1.875], space: [0.62, 0.94],
              room: [1.25, 2.125], dark: [3200, 6000], warble: [1.1, 2.4],
              bright: [1, 1.6], transHz: [5000, 8400] }
    },
    /* ---- end batch SFX-05 recipes ---- */

    /* ================= BATCH SFX-06 (8/16/26) =========================
       COOKED FROM HIS 365 THUMBS, NOT FROM TASTE:
         PHYSICS PICKS THE METHOD; HIS DATA PICKS WITHIN IT. This batch was
           first written SIX-OF-SEVEN FRICTION, on the honest but lazy logic
           that friction is his best method (16 UP / 19 DOWN, 46%). The
           diversity gate went red -- friction would have owned 65 of 110
           non-modal candidates -- and it was RIGHT, on craft grounds before
           gate grounds. A bullet into dirt, concrete shedding a piece and a
           body hitting the floor are IMPACTS. They are struck things, and I
           had made them scrapes because scrapes score well with him. That is
           picking the method to flatter the scoreboard.
           So the four that are not scrapes changed: round_land, cover_chew and
           went_down are MODAL (struck, heavily damped, high grit), car_heat is
           FM (a panel under thermal stress ticks INHARMONICALLY, which is what
           FM is for, and it gets metal's character without the metal material
           his thumbs killed 3 UP / 22 DOWN). Three friction survive and all
           three genuinely rub: a scramble, a body shifting in a bed, and the
           slow stick-slip of a cooling panel.
           HIS "GETTING STALE" RULING OUTRANKED HIS OWN SCOREBOARD HERE, and
           that is the right order: the scoreboard says what he likes, the
           ruling says what he cannot stand, and one bad batch of cousins costs
           more than one method's hit rate wins.
         DO NOT ANNOUNCE THE ROOM. Every recipe here sits at space 0.09-0.15
           and room <= 0.25 -- right where the two he swept 5/5 live (0.14 and
           0.16) and nowhere near the three big rooms that all died whole
           (cross_in 0.72, done_ring 0.78, clear_still 0.80).
         NO METAL, NO PARTICLE, NO AIR. `dead` and `deadMethod`, both his data.
         ONE MODAL ON PURPOSE (nerve_break). Seven friction recipes would be a
           monoculture, and "its getting stale" is his complaint on the record.

       AND THE ONE THING THE RESEARCH CHANGED. The stick-slip literature is
       blunt that the SLIP RATE and surface roughness -- not pitch -- are what
       make a friction sound read as a particular material: the slip pattern IS
       the perceived roughness, and the mode shifts riding on it are what read
       as inharmonic. In this engine that is `rough`, the sawtooth slip
       frequency in Hz, clamped [0.5, 400] and ramped to 0.55x across the
       sound. HIS OWN TWO CLEAN SWEEPS SIT AT OPPOSITE ENDS OF IT (sleep_sink
       rough 5, miss_past rough 34), which says the axis is live for him. So
       this batch ladders it deliberately instead of varying pitch and calling
       that variety: 3, 6, 9, 17, 28, 38 across the six friction recipes. A
       tick, a breath, a slump, a scramble, a crack, a spray.
       AND THE LADDER IS THE ONE THE SPEC ACTUALLY ALLOWS. It was first
       written 3/6/9/24/41/62, and SPEC.rough caps at 40 -- so cook()
       clamped 62 and 41 to the SAME 40 and the spray and the crack came out
       as near-cousins. Silent, legal, and it would have shipped two of seven
       sounding alike in a batch whose entire premise is that they do not.
       Caught by printing what cook() RETURNED instead of what the recipe
       SAID. The fix is the recipe, never the spec: 40 Hz is already a fast
       rasp and widening a declared range to fit my numbers would loosen
       validation for every sound in the game to save one of mine. */

    /* ---- end batch SFX-06 recipes ---- */

    /* ---- THE SFX-06 RECIPES HE JUDGED, KEPT EXACTLY AS HE HEARD THEM ----
       These six died 30 of 30 on 8/16 and they are NOT re-cooked, NOT tuned,
       and NOT deleted. THE REASON IS THE WHOLE INTEGRITY OF HIS VERDICT FILE:
       a candidate is a pure function of (event, index) through the recipe, so
       records/BOHEMIA_SFX_VERDICT_8_16_26.txt saying `DOWN round_land.0` is
       only TRUE while round_land.0 still cooks the sound he actually heard.
       I broke that once already -- SFX-07 was first written on top of these
       six ids, which silently reassigned thirty of his thumbs to sounds he
       had never been played, AND hid the new batch behind his own verdicts,
       because the judge sheet opens a decided moment collapsed. He said "I
       didn't see the new sound effect" and he was right.
       So the dead ids stay dead and keep their sounds, and the instrument
       versions got new names -- the same move this engine already made when
       miss -> miss_past, step_glass -> glass_crunch, swing -> swing_air. */
    /* --- FRICTION, the method his thumbs rate highest --- */
    round_land: {
      base: { mat: 'stone', hz: 210, modes: 5, bright: 0.75, decay: 0.125,
              damp: 2.4, warble: 0.4, atk: 0, trans: 0.92, transHz: 3400,
              transQ: 1.6, grit: 0.95, gritHz: 1400, space: 0.09, room: 0.0625,
              refl: 1, dark: 1800, width: 0.7, drive: 0.12, mkup: 0.66,
              gain: 0.34 },
      jit:  { hz: [170, 290], decay: [0.0625, 0.1875], damp: [2, 2.7],
              transHz: [2400, 4800], bright: [0.6, 1], width: [0.58, 0.9],
              grit: [0.85, 0.98], dark: [1300, 2600], gritHz: [1000, 2100] }
    },
    cover_chew: {
      base: { mat: 'stone', hz: 430, modes: 6, bright: 1.25, decay: 0.1875,
              damp: 2.2, warble: 0.5, atk: 0, trans: 0.88, transHz: 5600,
              transQ: 2.1, grit: 0.8, gritHz: 3100, space: 0.11, room: 0.125,
              refl: 1, dark: 3600, width: 0.72, drive: 0.11, mkup: 0.62,
              gain: 0.32, hits: [0, 0.0625] },
      jit:  { hz: [330, 620], decay: [0.125, 0.3125], damp: [1.8, 2.6],
              transHz: [4200, 8000], bright: [1, 1.55], width: [0.6, 0.95],
              dark: [2600, 5000], gritHz: [2300, 4400] },
      hitSets: [[0, 0.0625], [0], [0, 0.09375], [0, 0.0625, 0.15625], [0, 0.125]]
    },
    car_heat: {
      base: { synth: 'fm', mat: 'stone', hz: 128, ratio: 1.41, index: 3.2,
              modes: 5, bright: 0.55, decay: 0.4375, damp: 1.9, warble: 0.35,
              atk: 0.0625, trans: 0.3, transHz: 1400, transQ: 0.9, grit: 0.55,
              gritHz: 800, space: 0.1, room: 0.125, refl: 1, dark: 1100,
              width: 0.58, drive: 0.07, mkup: 0.8, gain: 0.3,
              hits: [0, 0.375, 0.6875] },
      jit:  { hz: [104, 176], ratio: [1.3, 2.2], index: [2, 5],
              decay: [0.3125, 0.625], bright: [0.44, 0.72], width: [0.5, 0.8],
              dark: [800, 1600] },
      hitSets: [[0, 0.375, 0.6875], [0, 0.4375], [0, 0.3125, 0.5625],
                [0, 0.5, 0.875], [0, 0.25, 0.5, 0.8125]]
    },
    man_moves: {
      base: { synth: 'friction', mat: 'ash', hz: 260, rough: 17, modes: 5,
              bright: 0.68, decay: 0.3125, damp: 2.1, warble: 0.4, atk: 0.0625,
              slide: -6, trans: 0.13, transHz: 2200, transQ: 1.1, grit: 0.88,
              gritHz: 1700, space: 0.13, room: 0.1875, refl: 1, dark: 2100,
              width: 0.68, drive: 0.08, mkup: 0.7, gain: 0.28,
              hits: [0, 0.1875, 0.375] },
      jit:  { hz: [205, 350], rough: [12, 24], decay: [0.25, 0.4375],
              slide: [-9, -3], bright: [0.55, 0.92], width: [0.58, 0.88],
              dark: [1600, 3000], gritHz: [1300, 2500] },
      hitSets: [[0, 0.1875, 0.375], [0, 0.25], [0, 0.125, 0.3125],
                [0, 0.1875, 0.375, 0.5625], [0, 0.21875, 0.4375]]
    },
    wake_up: {
      base: { synth: 'friction', mat: 'ash', hz: 110, rough: 6, modes: 4,
              bright: 0.5, decay: 0.5, damp: 2, warble: 0.3, atk: 0.125,
              slide: 4, trans: 0.1, transHz: 1200, transQ: 0.8, grit: 0.85,
              gritHz: 1000, space: 0.14, room: 0.1875, refl: 1, dark: 1200,
              width: 0.62, drive: 0.06, mkup: 0.82, gain: 0.3,
              hits: [0, 0.5] },
      jit:  { hz: [88, 158], rough: [4, 10], decay: [0.375, 0.75],
              slide: [1, 5], bright: [0.4, 0.75], width: [0.52, 0.86],
              dark: [900, 1800] },
      hitSets: [[0, 0.5], [0, 0.4375], [0, 0.5625], [0, 0.375, 0.8125],
                [0, 0.46875]]
    },

    /* --- MODAL: a person is a struck body, not a scrape --- */
    nerve_break: {
      base: { mat: 'bone', hz: 92, modes: 6, bright: 0.6, decay: 0.375,
              damp: 2.3, warble: 0.6, atk: 0.0625, trans: 0.85, transHz: 1500,
              transQ: 1.2, grit: 0.6, gritHz: 1000, space: 0.12, room: 0.125,
              refl: 1, dark: 1200, width: 0.5, drive: 0.28, mkup: 0.9,
              gain: 0.4, hits: [0, 0.0625] },
      jit:  { hz: [74, 124], decay: [0.3125, 0.5625], transHz: [1150, 2400],
              grit: [0.45, 0.78], damp: [1.9, 2.6], drive: [0.2, 0.4],
              dark: [900, 1700], width: [0.4, 0.64] },
      hitSets: [[0, 0.0625], [0], [0, 0.125], [0, 0.0625, 0.1875],
                [0, 0.09375]]
    },

    /* ================= BATCH SFX-07 (8/16/26) =========================
       THE SAME SIX MOMENTS, REBUILT OUT OF HIS OWN INSTRUMENTS.

       PAOLO, on the 400/400 sweep that killed SFX-06 thirty-four of
       thirty-five: "These are all very bad except for one I need you to be
       greater than use more instruments. I like it was really bad."

       HE DID NOT DISPUTE A SINGLE MOMENT. Five of the six below are the combat
       beats his own locked ruling asks for, and the seventh (went_down) he
       KEPT. What he rejected was what they were made of. So the moments stand
       and the SOURCE changes completely: every candidate here is one of the
       602 voices in his own music rack, played through synthV, on the same bus
       and limiter as everything else.

       AND THE QUESTION PUT TO HIM CHANGES SHAPE. Every batch before this asked
       the same thing five times -- here is a sound, and here it is again
       slightly higher. These ask WHICH VOICE: five different instruments per
       moment, one per candidate. His thumbs on this batch do not tune a
       recipe, they teach this lane which of HIS instruments belong in the
       game's sound design, which is a thing no amount of jittering hz could
       ever have found out.

       EVERY NAME BELOW WAS RENDERED THROUGH THE REAL RACK BEFORE IT WAS
       WRITTEN DOWN, and four of the first picks were thrown out for making no
       sound at all (thud, knock, boneshuffle, quiver -- they match the rack's
       source text but are not reachable through synthV). A voice that does not
       resolve is a silent sound effect, which is the worst failure this lane
       can ship, so instrument_gate re-renders every one of them on the shipped
       surface on every run and fails on any that goes quiet. */
    dirt_take: {
      base: { synth: 'instrument', inst: 'templeblock', mat: 'stone', hz: 210,
              modes: 5, bright: 0.75, decay: 0.1875, damp: 2.1, warble: 0.4,
              atk: 0, trans: 0.5, transHz: 3400, transQ: 1.6, grit: 0.5,
              gritHz: 1400, space: 0.09, room: 0.0625, refl: 1, dark: 1800,
              width: 0.7, drive: 0.06, mkup: 0.66, gain: 0.34 },
      jit:  { hz: [150, 300], decay: [0.125, 0.3125], width: [0.58, 0.9],
              dark: [1300, 2600] },
      instSets: ['templeblock', 'udu', 'boneplate', 'spoonclack', 'taiko']
    },
    stone_bite: {
      base: { synth: 'instrument', inst: 'shardglass', mat: 'stone', hz: 430,
              modes: 6, bright: 1.1, decay: 0.25, damp: 2, warble: 0.5,
              atk: 0, trans: 0.5, transHz: 5600, transQ: 2.1, grit: 0.5,
              gritHz: 3100, space: 0.11, room: 0.125, refl: 1, dark: 3600,
              width: 0.72, drive: 0.06, mkup: 0.62, gain: 0.32 },
      jit:  { hz: [300, 620], decay: [0.1875, 0.375], width: [0.6, 0.95],
              dark: [2600, 5000] },
      instSets: ['shardglass', 'shatterspark', 'rubblelight', 'scrapchime',
                 'pickscrape']
    },
    panel_tick: {
      base: { synth: 'instrument', inst: 'ticker', mat: 'stone', hz: 128,
              modes: 5, bright: 0.55, decay: 0.375, damp: 1.9, warble: 0.35,
              atk: 0, trans: 0.4, transHz: 1400, transQ: 0.9, grit: 0.4,
              gritHz: 800, space: 0.1, room: 0.125, refl: 1, dark: 1100,
              width: 0.58, drive: 0.05, mkup: 0.8, gain: 0.3,
              hits: [0, 0.375, 0.6875] },
      jit:  { hz: [100, 190], decay: [0.3125, 0.5], width: [0.5, 0.8],
              dark: [800, 1600] },
      instSets: ['ticker', 'meterclick', 'capacitor', 'ironheart', 'riveter'],
      hitSets: [[0, 0.375, 0.6875], [0, 0.4375], [0, 0.3125, 0.5625],
                [0, 0.5, 0.875], [0, 0.25, 0.5, 0.8125]]
    },
    boots_go: {
      base: { synth: 'instrument', inst: 'ironstep', mat: 'ash', hz: 260,
              modes: 5, bright: 0.68, decay: 0.3125, damp: 2.1, warble: 0.4,
              atk: 0, trans: 0.45, transHz: 2200, transQ: 1.1, grit: 0.5,
              gritHz: 1700, space: 0.13, room: 0.1875, refl: 1, dark: 2100,
              width: 0.68, drive: 0.05, mkup: 0.7, gain: 0.28,
              hits: [0, 0.1875, 0.375] },
      jit:  { hz: [190, 350], decay: [0.25, 0.4375], width: [0.58, 0.88],
              dark: [1600, 3000] },
      instSets: ['ironstep', 'washboard', 'guiro', 'rubboard', 'cabasa'],
      hitSets: [[0, 0.1875, 0.375], [0, 0.25], [0, 0.125, 0.3125],
                [0, 0.1875, 0.375, 0.5625], [0, 0.21875, 0.4375]]
    },
    will_goes: {
      base: { synth: 'instrument', inst: 'onebreath', mat: 'bone', hz: 92,
              modes: 6, bright: 0.6, decay: 0.4375, damp: 2.3, warble: 0.6,
              atk: 0, trans: 0.5, transHz: 1500, transQ: 1.2, grit: 0.45,
              gritHz: 1000, space: 0.12, room: 0.125, refl: 1, dark: 1200,
              width: 0.5, drive: 0.08, mkup: 0.9, gain: 0.4 },
      jit:  { hz: [74, 130], decay: [0.375, 0.625], width: [0.4, 0.64],
              dark: [900, 1700] },
      /* GRAVEYARD IS FINAL (8/19). `ironlung` and `throatsong` were both
         retired with their songs on 7/19 -- "Do not re-add" is written next to
         each of them in gates/bohemia_graveyard.txt -- and I borrowed them
         anyway, because nothing in the machine was checking a voice NAME
         against the registry. They also happened to be the two voices that
         render SILENT through this engine's own gain, so what Paolo thumbed on
         these two slots was a transient and a reflection with no body behind
         them. `chapelbreath` and `ghostvox` are the live breath voices that
         take their places. Gate: instrument_gate.py now sweeps every name. */
      instSets: ['onebreath', 'holdbreath', 'chapelbreath', 'ghostvox',
                 'formantvox']
    },
    come_up: {
      base: { synth: 'instrument', inst: 'dawnpad', mat: 'ash', hz: 110,
              modes: 4, bright: 0.5, decay: 0.625, damp: 2, warble: 0.3,
              atk: 0.0625, trans: 0.3, transHz: 1200, transQ: 0.8, grit: 0.4,
              gritHz: 1000, space: 0.14, room: 0.1875, refl: 1, dark: 1200,
              width: 0.62, drive: 0.04, mkup: 0.82, gain: 0.3 },
      jit:  { hz: [88, 165], decay: [0.5, 0.875], width: [0.52, 0.86],
              dark: [900, 1800] },
      instSets: ['dawnpad', 'dawnwash', 'edenmist', 'stillair', 'solarhum']
    },

    /* --- HIS ONE SURVIVOR FROM SFX-06, UNTOUCHED --------------------
       went_down.4 is the single candidate he kept out of thirty-five, so
       this recipe does not move by one digit. A recipe he has approved is
       frozen: re-cooking it would change what went_down.4 IS and silently
       throw away the only thumb this batch earned. */
    went_down: {
      base: { mat: 'ash', hz: 68, modes: 5, bright: 0.36, decay: 0.875,
              damp: 2.3, warble: 0.45, atk: 0, trans: 0.96, transHz: 900,
              transQ: 0.9, grit: 0.92, gritHz: 700, space: 0.15, room: 0.25,
              refl: 1, dark: 800, width: 0.66, drive: 0.12, mkup: 0.86,
              gain: 0.34, hits: [0, 0.0625, 0.3125] },
      jit:  { hz: [54, 98], decay: [0.625, 1.125], damp: [1.9, 2.7],
              transHz: [700, 1500], bright: [0.3, 0.5], width: [0.56, 0.9],
              dark: [600, 1300], gritHz: [500, 1100] },
      hitSets: [[0, 0.0625, 0.3125], [0, 0.375], [0, 0.0625, 0.25],
                [0, 0.125, 0.4375], [0, 0.0625, 0.28125]]
    },
    /* ---- end batch SFX-06 recipes ---- */

    /* ================= BATCH SFX-08 (8/16b) ===========================
       SIX SIBLINGS FOR SIX MOMENTS HE ALREADY APPROVED -- volume, not new
       moments. APPROVAL UNLOCKS VOLUME is this repo's oldest law and this lane
       had never once applied it. MEASURED: twelve wired moments have exactly
       ONE approved variant and four more have two, and the most-played sound
       in the whole game is one of the ones. Every shot in every firefight is
       byte-identical, and so is every sidewalk step.
       THE MACHINE GUN EFFECT is the oldest problem in game audio: one sample
       fired in rapid succession stops reading as an event and starts reading
       as a machine. It is also exactly "its getting stale" -- except in the
       GAME rather than on the judge sheet, which is why no number of NEW
       moments was ever going to fix it.
       Every one is built on his own rack, because his 430 answered that with
       nothing left to argue: the same six moments scored 0 of 30 as raw
       synthesis and 13 of 30 as his instruments.
       AND THE COUNT IS ODD-SEEKING. Round-robin practice is an odd number of
       variants against an even meter so the cycle never locks to the phrasing,
       and this game quantises EVERYTHING to 120 BPM -- the worst possible case
       for an even count. These moments hold 1 or 2 today; five more each puts
       them near three or five rather than two or four. Reported, never
       enforced: how many survive is his call.
       Every name was rendered through the real rack before it was written
       down, and six of the first picks were thrown out for making no sound at
       all (conga, chestplate, gorget, helm, pauldron, knock) despite all six
       appearing in the rack's source text. */
    shot_more: {
      base: { synth: 'instrument', inst: 'dropkick', mat: 'ash', hz: 66,
              modes: 5, bright: 0.5, decay: 0.1875, damp: 2.4, warble: 0.35,
              atk: 0, trans: 0.6, transHz: 5200, transQ: 1.1, grit: 0.7,
              gritHz: 520, space: 0.22, room: 0.25, refl: 2, dark: 1320,
              width: 0.5, drive: 0.2, mkup: 0.8, gain: 0.34 },
      jit:  { hz: [52, 92], decay: [0.125, 0.25], width: [0.42, 0.66],
              dark: [900, 1900] },
      instSets: ['dropkick', 'subboom', 'thunderdrum', 'taiko', 'anvil']
    },
    hurt_more: {
      base: { synth: 'instrument', inst: 'heartbeatsub', mat: 'ash', hz: 68,
              modes: 4, bright: 0.35, decay: 0.25, damp: 2.2, warble: 0.5,
              atk: 0, trans: 0.5, transHz: 1120, transQ: 0.8, grit: 0.6,
              gritHz: 560, space: 0.37, room: 0.375, refl: 1, dark: 850,
              width: 0.32, drive: 0.18, mkup: 0.86, gain: 0.36 },
      jit:  { hz: [54, 96], decay: [0.1875, 0.375], width: [0.28, 0.5],
              dark: [620, 1200] },
      /* same 8/19 graveyard sweep: `ironlung` and `throatsong` were retired
         7/19 and had to come out of here too. */
      instSets: ['heartbeatsub', 'subboom', 'chapelbreath', 'paperlung',
                 'ghostvox']
    },
    hit_more: {
      base: { synth: 'instrument', inst: 'boneplate', mat: 'bone', hz: 165,
              modes: 6, bright: 1, decay: 0.1875, damp: 2.5, warble: 0.6,
              atk: 0, trans: 0.7, transHz: 2900, transQ: 1.1, grit: 0.5,
              gritHz: 1600, space: 0.18, room: 0.1875, refl: 1, dark: 1500,
              width: 0.46, drive: 0.22, mkup: 0.88, gain: 0.42 },
      jit:  { hz: [130, 220], decay: [0.125, 0.3125], width: [0.38, 0.6],
              dark: [1100, 2200] },
      instSets: ['boneplate', 'bones', 'udu', 'timbale', 'templeblock']
    },
    brass_more: {
      base: { synth: 'instrument', inst: 'glassdrop', mat: 'crystal', hz: 1400,
              modes: 6, bright: 1.3, decay: 0.25, damp: 2.4, warble: 1.3,
              atk: 0, trans: 0.5, transHz: 8400, transQ: 2.6, grit: 0.3,
              gritHz: 5800, space: 0.3, room: 0.3125, refl: 2, dark: 5100,
              width: 0.7, drive: 0.05, mkup: 0.6, gain: 0.3,
              hits: [0.25, 0.375, 0.4375] },
      jit:  { hz: [980, 1800], decay: [0.1875, 0.375], width: [0.6, 0.92],
              dark: [3800, 6000] },
      instSets: ['glassdrop', 'coin', 'bottle', 'cellring', 'glassbottle'],
      hitSets: [[0.25, 0.375, 0.4375], [0.1875, 0.3125], [0.25, 0.4375],
                [0.3125, 0.4375, 0.5625], [0.21875, 0.34375, 0.46875]]
    },
    cover_more: {
      base: { synth: 'instrument', inst: 'anvil', mat: 'stone', hz: 380,
              modes: 6, bright: 1.2, decay: 0.25, damp: 2, warble: 0.8,
              atk: 0, trans: 0.55, transHz: 6200, transQ: 2.2, grit: 0.4,
              gritHz: 3400, space: 0.28, room: 0.3125, refl: 2, dark: 2450,
              width: 0.64, drive: 0.14, mkup: 0.78, gain: 0.38 },
      jit:  { hz: [300, 520], decay: [0.1875, 0.375], width: [0.54, 0.86],
              dark: [1900, 3400] },
      instSets: ['anvil', 'riveter', 'shardglass', 'ironstep', 'timpani']
    },

    /* ================= BATCH SFX-09 (8/20/26) ==========================
       Six moments that make no sound, given the source his own thumbs favour
       48% to 30%. Every voice named below was rendered through this engine's
       own gain path and measured before it was written down; the two that came
       back too quiet to drive (hollowvowl, crtbuzz) were dropped for ones that
       were not. Nothing here is cooked -- it is all his rack. */
    gone_quiet: {
      /* the air coming back into a room where something just stopped. long,
         wide, and quiet on purpose: it is the ABSENCE that is the sound. */
      base: { synth: 'instrument', inst: 'emptyfloorhum', mat: 'ash', hz: 96,
              modes: 4, bright: 0.4, decay: 0.625, damp: 1.8, warble: 0.25,
              atk: 0.0625, trans: 0.18, transHz: 900, transQ: 0.7, grit: 0.2,
              gritHz: 700, space: 0.34, room: 0.375, refl: 2, dark: 1100,
              width: 0.78, drive: 0.03, mkup: 0.86, gain: 0.26 },
      jit:  { hz: [72, 132], decay: [0.5, 0.875], width: [0.66, 0.95],
              dark: [850, 1600], space: [0.28, 0.42] },
      instSets: ['emptyfloorhum', 'stillair', 'prairiestatic', 'settlebend',
                 'signalfade'],
      hitSets: [[0], [0], [0], [0, 0.375], [0]]
    },
    mag_home: {
      /* THREE METAL PARTS FINDING EACH OTHER, which is why it is three hits and
         not one. Tight, close, no room: a reload happens at your chest. */
      base: { synth: 'instrument', inst: 'ratchet', mat: 'metal', hz: 420,
              modes: 6, bright: 1.15, decay: 0.125, damp: 2.5, warble: 0.5,
              atk: 0, trans: 0.6, transHz: 4200, transQ: 1.8, grit: 0.45,
              gritHz: 2600, space: 0.08, room: 0.0625, refl: 1, dark: 3200,
              width: 0.42, drive: 0.12, mkup: 0.9, gain: 0.34,
              hits: [0, 0.125, 0.25] },
      jit:  { hz: [320, 560], decay: [0.0625, 0.1875], width: [0.34, 0.58],
              dark: [2600, 4200] },
      instSets: ['ratchet', 'reelclick', 'springrev', 'meterclick', 'spoonclack'],
      hitSets: [[0, 0.125, 0.25], [0, 0.1875], [0, 0.0625, 0.1875],
                [0, 0.125], [0, 0.0625, 0.125]]
    },
    hands_pass: {
      /* MANY SMALL EVENTS, NEVER ONE TONE -- his own brief for it. Counted off,
         so the hits are uneven on purpose: money is not a metronome. */
      base: { synth: 'instrument', inst: 'coin', mat: 'metal', hz: 880,
              modes: 6, bright: 1.3, decay: 0.125, damp: 2.4, warble: 0.9,
              atk: 0, trans: 0.5, transHz: 6800, transQ: 2.4, grit: 0.35,
              gritHz: 4400, space: 0.14, room: 0.125, refl: 1, dark: 4600,
              width: 0.6, drive: 0.06, mkup: 0.8, gain: 0.3,
              hits: [0, 0.0625, 0.1875, 0.25] },
      jit:  { hz: [660, 1250], decay: [0.0625, 0.1875], width: [0.5, 0.82],
              dark: [3800, 5600] },
      instSets: ['coin', 'cashreg', 'ledgerbell', 'ledgerscratch', 'chip'],
      hitSets: [[0, 0.0625, 0.1875, 0.25], [0, 0.125, 0.1875],
                [0, 0.0625, 0.125, 0.25, 0.3125], [0, 0.1875],
                [0, 0.0625, 0.125, 0.1875]]
    },
    dog_calls: {
      /* THE DISTANCE IS THE WHOLE POINT. Heavy room, dark, one call. It is not
         a dog next to you; it is the only other living thing in the valley. */
      base: { synth: 'instrument', inst: 'dobrowail', mat: 'ash', hz: 210,
              modes: 5, bright: 0.62, decay: 0.4375, damp: 2.0, warble: 0.7,
              atk: 0.0625, trans: 0.2, transHz: 1400, transQ: 0.9, grit: 0.3,
              gritHz: 900, space: 0.46, room: 0.4375, refl: 3, dark: 1500,
              width: 0.85, drive: 0.05, mkup: 0.92, gain: 0.24 },
      jit:  { hz: [160, 300], decay: [0.3125, 0.625], width: [0.72, 1],
              dark: [1100, 2200], space: [0.38, 0.56] },
      /* ghostvox -> watervoice and breathpad -> reedorgan (8/20): not a taste
         call. Both originals render FIVE TIMES quieter than the calibration grid
         predicts at the pitch these recipes actually use, because the grid
         interpolates pitch between two octaves and those two voices dip hard in
         the middle. Measured at the exact operating point and replaced with
         voices that do not. The real fix is a third pitch row, which is built
         and deliberately not switched on -- see INST_SEMI. */
      instSets: ['dobrowail', 'harmonicawail', 'altitudecall', 'watervoice',
                 'shofar'],
      hitSets: [[0], [0], [0, 0.4375], [0], [0]]
    },
    sign_alive: {
      /* GAS AND CURRENT, NEVER A STRUCK BODY -- so the transient is almost off.
         It hums rather than hits, and it sits under everything because a lit
         sign is a PLACE, not an event. */
      base: { synth: 'instrument', inst: 'neonsign', mat: 'metal', hz: 150,
              modes: 4, bright: 0.85, decay: 0.5, damp: 1.7, warble: 1.1,
              atk: 0.0625, trans: 0.08, transHz: 2600, transQ: 1.2, grit: 0.5,
              gritHz: 3400, space: 0.2, room: 0.1875, refl: 1, dark: 2600,
              width: 0.55, drive: 0.1, mkup: 0.84, gain: 0.22 },
      jit:  { hz: [110, 220], decay: [0.375, 0.75], width: [0.44, 0.72],
              dark: [2000, 3600], grit: [0.35, 0.7] },
      instSets: ['neonsign', 'neontube', 'neonrelic', 'dyingfilament',
                 'vendinghum'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    lungs_burn: {
      /* IT HAS NO BODY AT ALL. trans near zero, no grit, and two hits because
         out of breath is IN and OUT, not one push. */
      base: { synth: 'instrument', inst: 'reedorgan', mat: 'ash', hz: 118,
              modes: 4, bright: 0.5, decay: 0.375, damp: 2.2, warble: 0.4,
              atk: 0.0625, trans: 0.1, transHz: 1100, transQ: 0.6, grit: 0.15,
              gritHz: 800, space: 0.16, room: 0.125, refl: 1, dark: 1300,
              width: 0.5, drive: 0.04, mkup: 0.88, gain: 0.28,
              hits: [0, 0.4375] },
      jit:  { hz: [88, 165], decay: [0.3125, 0.5625], width: [0.4, 0.66],
              dark: [1000, 1900] },
      instSets: ['reedorgan', 'chapelbreath', 'holdbreath', 'onebreath',
                 'paperlung'],
      hitSets: [[0, 0.4375], [0, 0.5], [0], [0, 0.375], [0, 0.5625]]
    },

    /* ================= BATCH SFX-10 (8/20/26) ==========================
       Sibling pools for step_sand and step_wood, built on his rack because the
       instrument source runs 48% approval against 30% for raw synthesis and
       both existing recipes are raw synthesis. Every voice was rendered at the
       REAL footstep point -- sd 0.05, the recipe's own semitone -- before it
       was written here; `knock`, `rim`, `wood` and `brim` all looked right for
       boards and all render SILENT through synthV, because they are drumV
       kinds. Measuring is the only reason they are not in this file. */
    sand_more: {
      /* SAND HAS NO RING. Grain, a short hiss, and nothing that sustains -- so
         the decay is tiny, the room is off, and the grit is nearly all of it. */
      base: { synth: 'instrument', inst: 'cabasa', mat: 'ash', hz: 74,
              modes: 4, bright: 0.42, decay: 0.09375, damp: 2.4, warble: 0.25,
              atk: 0, trans: 0.5, transHz: 780, transQ: 0.7, grit: 0.9,
              gritHz: 520, space: 0.05, room: 0.0625, refl: 0, dark: 620,
              width: 0.32, drive: 0.07, mkup: 0.9, gain: 0.3 },
      /* THE NOTE HAS TO BE LONGER THAN THE VOICE. decay jit started at 0.0625,
         which quantises to a 1/16-beat window of 31 ms, and `sweeppad` needs 83
         at this step -- so it was cut to a click. A footstep is short, not
         shorter than the thing making it. */
      jit:  { hz: [58, 102], decay: [0.09375, 0.1875], width: [0.24, 0.44],
              dark: [460, 900], grit: [0.8, 1] },
      /* `sweeppad` was here and came out a CLICK: the calibration grid predicts its
         peak from two semitones, -24 and +12, and this recipe sits at about -18
         where the straight line between them overshoots by roughly 2.6x. Third
         time that two-point pitch model has mispredicted a voice. `guiro` is
         measured accurate at this operating point. The model is the real bug and
         it is written up as the top item; fixing it moves every instrument sound
         he has already approved, so it wants a deliberate re-record, not a
         late-session bolt-on. */
      instSets: ['cabasa', 'washboard', 'brushkit', 'sodahiss', 'guiro'],
      hitSets: [[0], [0], [0], [0], [0]]
    },
    wood_more: {
      /* A BOARD UNDER A BOOT. Brighter and shorter than the materials that die
         in his sweeps -- the door post-mortem's own prescription, which the
         existing step_wood recipe already carries in its comment. */
      base: { synth: 'instrument', inst: 'templeblock', mat: 'wood', hz: 116,
              modes: 5, bright: 0.95, decay: 0.09375, damp: 2.2, warble: 0.6,
              atk: 0, trans: 0.7, transHz: 2800, transQ: 1.3, grit: 0.26,
              gritHz: 1600, space: 0.1, room: 0.125, refl: 1, dark: 1600,
              width: 0.44, drive: 0.09, mkup: 0.88, gain: 0.31 },
      jit:  { hz: [95, 160], decay: [0.0625, 0.125], width: [0.34, 0.58],
              dark: [1200, 2400], bright: [0.78, 1.2] },
      instSets: ['templeblock', 'spoonclack', 'claves', 'rimshotr', 'marimba'],
      hitSets: [[0], [0], [0], [0], [0]]
    },

    parts_pass: {
      /* METAL WITH MASS, SEVERAL PIECES, NO RING. The dead versions were a till:
         bright, small, counted, one event per coin. This is the opposite -- low,
         gritty, uneven, and it lands rather than chimes. Same weight-and-grit
         family as `set_down`, which he approved. */
      base: { synth: 'instrument', inst: 'boneplate', mat: 'metal', hz: 132,
              modes: 5, bright: 0.62, decay: 0.1875, damp: 2.3, warble: 0.5,
              atk: 0, trans: 0.6, transHz: 1800, transQ: 1.1, grit: 0.7,
              gritHz: 1200, space: 0.16, room: 0.1875, refl: 1, dark: 1400,
              width: 0.5, drive: 0.14, mkup: 0.86, gain: 0.32,
              hits: [0, 0.0625, 0.1875] },
      jit:  { hz: [104, 190], decay: [0.125, 0.3125], width: [0.4, 0.66],
              dark: [1000, 2100], grit: [0.55, 0.85] },
      instSets: ['boneplate', 'ratchet', 'anvil', 'reelclick', 'ironstep'],
      hitSets: [[0, 0.0625, 0.1875], [0, 0.125], [0, 0.0625, 0.125, 0.25],
                [0, 0.1875], [0, 0.0625, 0.25]]
    },

    metal_ticks: {
      /* STICK-SLIP, NOT A CLOCK. Every dead candidate for this moment ticked on
         a 32nd grid and therefore read as a meter. Contracting metal releases
         irregularly and SLOWS DOWN, because the panel approaches ambient
         asymptotically -- so every gap below is off the grid and each one is
         roughly 1.5x the gap before it. Thin and bright: this is a panel
         releasing, not a bar being struck. */
      base: { synth: 'fm', mat: 'metal', hz: 1850, ratio: 2.74, index: 1.5,
              modes: 5, bright: 0.68, decay: 0.075, damp: 2.2, warble: 0.2,
              atk: 0, trans: 0.55, transHz: 3100, transQ: 1.5, grit: 0.18,
              gritHz: 2200, space: 0.12, room: 0.1875, refl: 1, dark: 5200,
              width: 0.42, drive: 0.04, mkup: 0.82, gain: 0.52,
              hits: [0, 0.11, 0.29, 0.58, 1.02] },
      jit:  { hz: [1450, 2600], ratio: [2.2, 3.4], index: [1.0, 2.3],
              decay: [0.05, 0.11], bright: [0.55, 0.8], dark: [4200, 6600],
              width: [0.34, 0.55] },
      hitSets: [[0, 0.11, 0.29, 0.58, 1.02], [0, 0.14, 0.33, 0.67],
                [0, 0.09, 0.23, 0.47, 0.88], [0, 0.17, 0.41, 0.83],
                [0, 0.13, 0.31, 0.62, 1.09]]
    },
    walk_more: {
      base: { synth: 'instrument', inst: 'templeblock', mat: 'stone', hz: 140,
              modes: 5, bright: 0.78, decay: 0.125, damp: 2.4, warble: 0.4,
              atk: 0, trans: 0.55, transHz: 2840, transQ: 1.4, grit: 0.5,
              gritHz: 3100, space: 0.07, room: 0.0625, refl: 1, dark: 1800,
              width: 0.38, drive: 0.08, mkup: 0.8, gain: 0.31 },
      jit:  { hz: [112, 190], decay: [0.0625, 0.1875], width: [0.3, 0.52],
              dark: [1300, 2500] },
      instSets: ['templeblock', 'spoonclack', 'boneplate', 'bones', 'ironstep']
    }
    /* ---- end batch SFX-08 recipes ---- */
  };

  /* ---- THE MEASURED ENVELOPE (rewritten 8/12/26, SAME DAY, from 270) ----
     THE FIRST VERSION OF THIS BLOCK WAS WRONG AND HIS OWN THUMBS PROVED IT.

     It was derived from 140 verdicts and it claimed two things: that MATERIAL is
     the verdict (glass 100%, metal 20%, wood 33%, water 20%) and that he kills
     sounds that are PUSHED (makeup gain effect -1.17, drive -0.62). The gate was
     built to RE-DERIVE both from his verdict files on every run, precisely so
     that his data stays upstream of the law. Hours later he judged all 270 and
     the re-derivation went red. Read what happened straight:

       material   140 thumbs        270 thumbs
       water      1 UP / 4  (20%)   6 UP / 4   (60%)   <- best in the game now
       glass      5 UP / 0  (100%)  8 UP / 12  (40%)
       ash       13 UP / 17 (43%)  16 UP / 44  (27%)   <- near worst now
       choir      5 UP / 5  (50%)   7 UP / 13  (35%)
       metal      3 UP / 12 (20%)   3 UP / 22  (12%)   <- the ONE that held

     Glass was five samples. Water was five samples. Every ranking except metal
     was small-sample noise that read like a finding, and a full sweep flattened
     it. The knobs went the same way: makeup gain fell from -1.17 to -0.36 and
     drive from -0.62 to -0.23, and the approved and rejected medians now nearly
     touch (mkup 0.880 vs 0.900). The direction survives; the strength does not.

     SO THE LAW IS CUT DOWN TO WHAT 270 JUDGEMENTS ACTUALLY SUPPORT:
       1. METAL IS DEAD. 3 UP / 22 DOWN across 25 judgements, consistent in both
          sweeps, and both metal moments in the new batch died whole (step_metal
          0/5, reload 0/5). No new recipe cooks from it.
       2. CONTAINMENT, NOT DIRECTION. Nothing predicts WHICH of five cousins he
          wants, so the envelope no longer pretends to. What it can honestly say
          is WHERE his yeses live: REGION below is the bounding box of all 97
          approved candidates, and a new cook has to land inside it. That is a
          claim about coverage, which the data supports, instead of a claim about
          taste, which it does not.
     The weak direction is REPORTED by the gate and asserted only as the sign it
     still has -- approved mkup below rejected mkup -- never as a cap, because a
     cap tight enough to mean anything would be red on sounds HE APPROVED, and a
     gate that outranks a ruling is the failure this whole lane has a law about.

     HIS 8/12 SCOREBOARD ON THE NEW BATCH: 14 of 26 moments live, 12 died whole
     (step_glass step_metal swing reload breath patch_up build_place deed money
     neon_buzz dog_far equip). Those 60 candidates are in the graveyard. */
  var ENVELOPE = {
    since: '8/12/26',
    judged: 460, approved: 148,
    dead: ['metal'],              /* 3 UP / 22 DOWN. the only stable finding */
    /* ---- AND THEN METHOD TURNED OUT TO MATTER MORE (8/14) --------------
       He swept all 330 the day the five physics shipped, and the scoreboard by
       METHOD is sharper than anything material ever gave:
         friction    6 UP /  9 DOWN   40%   the best method in the game
         modal      97 UP / 173      36%
         fm          2 UP / 13       13%
         particle    0 UP / 20        0%
         air         0 UP / 10        0%
       THIRTY CANDIDATES ACROSS PARTICLE AND AIR AND HE KEPT NONE. That is a
       larger sample than the metal finding and a cleaner result, and it points
       the opposite way from where the batch was aimed: the cloud of collisions
       and the turbulence -- the two methods added specifically because breaking
       glass and breath are not struck objects -- are the two he wants least.
       FRICTION IS THE OPPOSITE STORY and it is the reason the batch was worth
       cooking: four moments that had NEVER had a sound got one (swing,
       patch_up, build_place, equip), and all four are friction.
       READ THE LIMIT HONESTLY: 0/30 says these RECIPES failed, and it cannot
       fully separate the method from my writing of it. So they are not deleted
       -- deadMethod is a bar on cooking NEW ones without a ruling from him,
       not a claim that no such sound could ever work.

       ---- AND AT 365 THE FRICTION FINDING STOPPED BEING THIN (8/15) -------
       Fifteen judgements is not a result, and that is all "friction is the best
       method" had behind it on 8/14. SFX-05 put twenty more friction candidates
       in front of him:
         friction   16 UP /  19 DOWN   46%   <- and now it is a result
         modal     100 UP / 185        35%
         fm          2 UP /  13        13%
         particle    0 UP /  20         0%
         air         0 UP /  10         0%
       TWO CLEAN FIVE-OF-FIVE SWEEPS, both friction: miss_past and sleep_sink.
       Nothing has swept 5/5 since the original demo set. Friction is now the
       method to cook in unless a moment argues otherwise.
       AND THE FOUR DEATHS DREW THE SAME LINE FROM THE OTHER SIDE. The three
       roomiest recipes in the batch are three of the four that died whole
       (clear_still space 0.8, cross_in 0.72, done_ring 0.78) and the two that
       swept are the two with almost no room in them (miss_past 0.14,
       sleep_sink 0.16). Both survivors are things happening AT you; all three
       big rooms are a SPACE being described. HE DOES NOT WANT THE ROOM
       ANNOUNCED. Recorded as an OBSERVATION and deliberately not promoted to a
       cap on `space` -- seven recipes is exactly the sample size that produced
       the material law that his next sweep destroyed. */
    deadMethod: ['particle', 'air'],
    methodRate: { friction: 0.46, modal: 0.35, fm: 0.13, particle: 0, air: 0,
                  /* HIS OWN RACK, AND AT 60 CANDIDATES IT IS NOW THE BEST
                     SOURCE IN THE ENGINE (8/17). 29 UP / 60 across SFX-07 and
                     SFX-08 -- ahead of friction, on a larger sample than any
                     new method has ever had here, and against raw synthesis
                     that scored ZERO on the identical six moments. SFX-08 went
                     16 of 30 with TWO clean five-of-five sweeps in one batch,
                     which had never happened before.
                     RAW SYNTHESIS IS THE FALLBACK FROM HERE. Cook from the
                     rack unless a moment genuinely argues otherwise. */
                  instrument: 0.48 },
    /* EIGHT MOMENTS HAVE NOW DIED WHOLE TWICE (SFX-03 and again as SFX-04).
       STOP PRODUCING (Paolo 7/26) is explicit: a second rejection ends the
       feature. No third cook answers these, in this session or any other,
       without him asking for one. */
    twiceDead: ['glass_crunch', 'deck_ring', 'mag_clack', 'breath_out',
                'deed_stamp', 'cash_count', 'neon_hum', 'dog_cry'],
    /* AND FOUR DIED WHOLE ON THEIR FIRST OUTING (8/15). These are NOT twiceDead
       and the difference is stated rather than blurred: STOP PRODUCING ends a
       feature on the SECOND rejection, so one more cook would technically be
       legal here. It is not happening, and not because a rule forbids it. He
       gave a reading with these four -- do not announce the room -- and the
       honest response to a reading is to use it on the next thing, not to
       re-cook the thing it was given about. Nothing here gets a second version
       unless he asks for one. */
    onceDeadWhole: ['clear_still', 'turn_to_you', 'cross_in', 'done_ring',
                    /* 8/17: panel_tick died whole as instruments after
                       car_heat died whole as synthesis -- the ONLY moment to
                       fail on both sources, so it is twice dead as a MOMENT
                       and closed. brass_more is its first rejection: casing
                       stays at one variant and does not get another cook
                       unless he asks. */
                    'panel_tick', 'brass_more'],
    /* kept as history, NOT as law: the direction that survived, and its real
       strength once the whole game was judged */
    /* RE-DERIVED ON EVERY SWEEP, and the direction keeps WEAKENING as the
       sample grows: -1.17 at 140 thumbs, -0.36 at 270, 0.874/0.939 at 330,
       0.868/0.921 at 365, 0.855/0.894 at 430, 0.851/0.888 at 460. It
       survives as a sign and nothing more, which is why it was never allowed
       to become a cap. */
    mkupUp: 0.8510, mkupDown: 0.8875, driveUp: 0.1389, driveDown: 0.1498,
    /* the bounding box of every candidate he has ever said yes to */
    REGION: {
    hz: [46, 1922.1723311021924],
    modes: [4, 11],
    bright: [0.23236137816216795, 1.6733269621850924],
    decay: [0.0625, 3.25],
    damp: [0.7152495026588439, 2.725041580479592],
    warble: [0.25, 2.9784293750301005],
    atk: [0, 0.75],
    slide: [-13.554722697474062, 5],
    trans: [0.04, 1],
    transHz: [320, 8600],
    transQ: [0.5, 4.3834795102477075],
    grit: [0, 0.98],
    gritHz: [300, 6000],
    space: [0.05, 0.9671123819425702],
    room: [0.0625, 2.75],
    refl: [0, 4],
    dark: [348.55567762162536, 6587.331252684817],
    width: [0.2664250782504678, 1],
    drive: [0, 0.7355879963259213],
    gain: [0.18, 0.72],
    mkup: [0.25, 1.765]
    },
    /* WHICH RECIPES THE REGION BINDS. Empty on purpose, and the reason is the
       whole discipline of this lane: a candidate is a pure function of (event,
       index) through the recipe, so narrowing a jitter range CHANGES WHAT
       casing.1 IS -- and 130 of his thumbs are attached to those exact vectors.
       Re-cooking SFX-03 to fit the box would silently invalidate judgements he
       already made. So the region binds FORWARD: any recipe added after 8/12
       goes in this list and must cook entirely inside it. The existing batch is
       measured and REPORTED against the box, never failed on it. */
    /* THE FIRST BATCH THE REGION ACTUALLY BINDS (8/15). It has been a
       forward-looking law with an empty list since 8/12, because re-cooking
       SFX-03 to fit the box would have invalidated thumbs he had already
       given. SFX-05 is new, so it is held to it. */
    regionBinds: ['miss_past','vital_deep','clear_still','sleep_sink',
                  'turn_to_you','cross_in','done_ring',
                  /* SFX-06. Being on this list is what MAKES the region bind:
                     an event not on it is measured and reported, never failed. */
                  'round_land','cover_chew','car_heat','man_moves',
                  'nerve_break','wake_up','went_down',
                  /* SFX-07, his own instruments, on NEW ids because the six
                     above are judged and their sounds are frozen. */
                  'dirt_take','stone_bite','panel_tick','boots_go',
                  'will_goes','come_up',
                  /* SFX-08, the volume batch */
                  'shot_more','hurt_more','hit_more','brass_more',
                  'cover_more','walk_more'],
    batch: ['step_concrete','step_sand','step_glass','step_wood','step_metal',
            'swing','melee_hit','reload','dry_fire','casing',
            'heartbeat','breath','drink','patch_up',
            'build_place','demolish','deed','money','power_on',
            'wind_gust','neon_buzz','generator','dog_far',
            'ui_back','ui_deny','equip']
  };

  /* ---- THE GENERATOR --------------------------------------------------- */
  function hashStr(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cook(ev, n) {
    var r = RECIPE[ev];
    if (!r) return [];
    n = n || 5;
    var out = [];
    for (var i = 0; i < n; i++) {
      var rand = rng(hashStr('v2:' + ev + '#' + i));
      var v = {};
      for (var k in r.base) if (r.base.hasOwnProperty(k)) v[k] = r.base[k];
      /* candidate 0 is the recipe STRAIGHT, always */
      if (i > 0) {
        for (var f in r.jit) {
          if (!r.jit.hasOwnProperty(f)) continue;
          var lo = r.jit[f][0], hi = r.jit[f][1], x = lo + rand() * (hi - lo);
          v[f] = (SPEC[f] && SPEC[f].kind === 'beat') ? q(x) : x;
        }
        if (r.hitSets) v.hits = r.hitSets[i % r.hitSets.length].slice();
        /* FIVE DIFFERENT INSTRUMENTS, NOT FIVE JITTERS OF ONE (8/16). Every
           batch before this asked him the same question five times: here is a
           sound, and here it is again slightly higher. When the SOURCE is his
           602-voice rack the far more useful question is WHICH VOICE, so an
           instrument recipe lists five names and each candidate gets its own.
           His thumbs then teach this lane which of HIS instruments belong in
           the game's sound design, which is a thing no amount of jittering hz
           could ever have found out. */
        if (r.instSets) v.inst = r.instSets[i % r.instSets.length];
        /* every candidate sits somewhere different in the field. FFX moved its
           effects off mono on purpose; nothing here ships dead centre. */
        v.pan = (rand() * 2 - 1) * 0.35;
      }
      v.ev = ev; v.id = ev + '.' + i;
      out.push(sanitize(v));
    }
    return out;
  }
  function batch(n) {
    var out = [];
    for (var i = 0; i < EVENTS.length; i++) out = out.concat(cook(EVENTS[i].ev, n || 5));
    return out;
  }

  /* ---- VALIDATION ------------------------------------------------------ */
  function validate(v) {
    var errs = [];
    if (!v || typeof v !== 'object') return ['not an object'];
    for (var i = 0; i < FIELDS.length; i++) {
      var k = FIELDS[i], s = SPEC[k], x = v[k];
      if (x == null) { errs.push(k + ' missing'); continue; }
      if (s.kind === 'enum') { if (s.of.indexOf(x) < 0) errs.push(k + ' not in spec: ' + x); continue; }
      if (s.kind === 'str') {
        if (typeof x !== 'string') errs.push(k + ' must be a name, got ' + typeof x);
        continue;
      }
      if (typeof x !== 'number' || !isFinite(x)) { errs.push(k + ' not a finite number'); continue; }
      if (x < s.min - 1e-9 || x > s.max + 1e-9) errs.push(k + ' out of range: ' + x);
      if (s.kind === 'beat' && Math.abs(x * 16 - Math.round(x * 16)) > 1e-9)
        errs.push(k + ' is off the 16th grid: ' + x);
    }
    if (!v.hits || !v.hits.length) errs.push('hits missing');
    else for (var j = 0; j < v.hits.length; j++)
      if (Math.abs(v.hits[j] * 16 - Math.round(v.hits[j] * 16)) > 1e-9)
        errs.push('hit ' + j + ' is off the 16th grid: ' + v.hits[j]);
    return errs;
  }

  function serialize(v) {
    var parts = [];
    for (var i = 0; i < FIELDS.length; i++) {
      var k = FIELDS[i], x = v[k];
      parts.push(k + '=' + (typeof x === 'number' ? (Math.round(x * 1e6) / 1e6) : x));
    }
    parts.push('hits=' + v.hits.join('|'));
    return parts.join(' ');
  }

  /* ---- THE RENDERER (browser only) ------------------------------------- */
  var _noise = null;
  function noiseBuf(AC) {
    if (!_noise || _noise.ac !== AC) {
      var len = Math.ceil(AC.sampleRate * 3);
      var b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
      var rr = rng(0x9E3779B9);          /* deterministic: the same grit forever */
      for (var i = 0; i < len; i++) d[i] = rr() * 2 - 1;
      _noise = { ac: AC, buf: b };
    }
    return _noise.buf;
  }
  function driveCurve(amt) {
    var n = 1024, c = new Float32Array(n), k = 1 + amt * 24;
    for (var i = 0; i < n; i++) {
      var x = (i / (n - 1)) * 2 - 1;
      c[i] = Math.tanh(x * k) / Math.tanh(k);   /* soft saturation, never a fold */
    }
    return c;
  }

  /* per-mode radiation directions: alternating, widening, loudest partial never
     dead centre and never hard on one side */
  var SPREADS = [-0.55, 0.72, -0.34, 0.91, -0.83, 0.46, -0.97, 0.26,
                 -0.62, 0.86, -0.18, 1.00, -0.74, 0.58, -0.28, 0.80];

  function panTo(AC, node, pan, dest) {
    if (AC.createStereoPanner && Math.abs(pan) > 0.001) {
      var p = AC.createStereoPanner(); p.pan.value = clamp(pan, -1, 1);
      node.connect(p); p.connect(dest);
    } else node.connect(dest);
  }

  /* ONE STRIKE of the material: the modal body + its snap. */
  /* =====================================================================
     THE OTHER FOUR PHYSICS (8/12, BATCH SFX-04)
     ---------------------------------------------------------------------
     Paolo: "you need more diverse sounds bro its getting stale at this
     point." Every sound this engine had ever made was a struck resonant
     object, so 54 moments came out 54 cousins. These are the bodies that
     are not that. The TRANSIENT and the ROOM stay shared -- they are
     generic layers, and a method that wants no snap sets trans to 0.

     SEEDED, NOT RANDOM. The particle cloud needs stochastic timings, and
     Math.random() inside a render would mean the candidate he thumbed is not
     the candidate that plays. Every draw comes from rng(hashStr(v.id)), so
     an id is one sound forever, which is what the whole verdict pipeline
     rests on. ============================================================ */

  /* FM -- Chowning 1973, "The Synthesis of Complex Audio Spectra by Means of
     Frequency Modulation". A carrier modulated at AUDIO rate: one oscillator
     into another's frequency, with the modulation INDEX on its own falling
     envelope, which is the articulation the paper is actually about.
     THE RATIO IS THE CHARACTER: integer ratios (1, 2, 3) give harmonic,
     brass-and-reed spectra; non-integer ratios spread the sidebands
     inharmonically -- 1.41 and 2.17 for bell and metal, 1/sqrt(2) with a low
     index and a short envelope for the quasi-pitched drum. */
  function bodyFM(v, AC, dest, t, amp, hold) {
    var ring = v.decay * BEAT, A = v.atk * BEAT;
    var car = AC.createOscillator(); car.type = 'sine';
    car.frequency.setValueAtTime(clamp(v.hz, 16, 19000), t);
    if (v.slide) {
      var end = clamp(v.hz * Math.pow(2, v.slide / 12), 16, 19000);
      car.frequency.exponentialRampToValueAtTime(end, t + A + ring);
    }
    var mod = AC.createOscillator(); mod.type = 'sine';
    var mf = clamp(v.hz * v.ratio, 0.5, 19000);
    mod.frequency.setValueAtTime(mf, t);
    /* deviation = index * modulator frequency. The index falls to a fraction
       of itself across the ring: bright at the attack, pure at the tail,
       which is how a real struck or blown thing loses its upper partials. */
    var mg = AC.createGain();
    var dev = v.index * mf;
    mg.gain.setValueAtTime(Math.max(0.0001, dev), t + A * 0.5);
    mg.gain.exponentialRampToValueAtTime(Math.max(0.0001, dev * 0.06),
                                         t + A + ring * Math.max(0.15, 1 / Math.max(0.2, v.damp)));
    mod.connect(mg); mg.connect(car.frequency);
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp * 0.42, t + Math.max(0.002, A));
    g.gain.exponentialRampToValueAtTime(amp * 0.0008, t + A + ring);
    g.gain.linearRampToValueAtTime(0, t + A + ring + 0.005);
    car.connect(g);
    panTo(AC, g, clamp(v.pan + v.width * 0.25, -1, 1), dest);
    mod.start(t); mod.stop(t + A + ring + 0.02);
    car.start(t); car.stop(t + A + ring + 0.02);
    hold.push(mod); hold.push(car);
    return t + A + ring;
  }

  /* PARTICLE -- Perry Cook's PhISEM (1996-99), "Physically Informed Stochastic
     Event Modeling": many independent objects colliding, reduced to a
     statistical process. ONE SYSTEM ENERGY decays exponentially and each
     collision is a tiny resonant ping loud in proportion to what energy is
     left. Gravel, coins, ice in a glass, keys, chain, breaking glass. */
  function bodyParticle(v, AC, dest, t, amp, hold) {
    var span = Math.max(0.03, v.decay * BEAT);
    var n = Math.max(2, Math.min(64, Math.round(v.grains)));
    var rand = rng(hashStr('phisem:' + v.id));
    var src = AC.createBufferSource(); src.buffer = noiseBuf(AC);
    for (var i = 0; i < n; i++) {
      /* collisions cluster at the front and thin out, the way a handful of
         gravel lands. Uniform timings sound like a machine gun. */
      var u = rand();
      var at = t + span * u * u;
      var energy = Math.exp(-3.2 * (at - t) / span);
      var bp = AC.createBiquadFilter(); bp.type = 'bandpass';
      /* every particle is its own size: the resonance scatters around hz */
      var f = clamp(v.hz * (0.55 + rand() * 1.9) * (1 + v.bright * 0.35), 40, 17000);
      bp.frequency.setValueAtTime(f, at);
      bp.Q.value = clamp(4 + v.damp * 9, 1, 40);
      var g = AC.createGain();
      var life = 0.004 + 0.028 / Math.max(0.4, v.damp);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(amp * 0.5 * energy * (0.5 + rand() * 0.7), at + 0.0015);
      g.gain.exponentialRampToValueAtTime(0.0004, at + life);
      g.gain.linearRampToValueAtTime(0, at + life + 0.003);
      bp.connect(g);
      panTo(AC, g, clamp(v.pan + (rand() * 2 - 1) * v.width, -1, 1), dest);
      src.connect(bp);
    }
    src.start(t); src.stop(t + span + 0.08); hold.push(src);
    return t + span;
  }

  /* FRICTION -- stick-slip. Noise through a resonance, its amplitude driven
     by an oscillator at the SLIP RATE: the surface grabs, loads, lets go.
     Drags, scrapes, hinges, rope -- the whole family that is CONTINUOUS and
     has no attack, which a strike-based engine cannot make at all. */
  function bodyFriction(v, AC, dest, t, amp, hold) {
    var ring = v.decay * BEAT, A = Math.max(0.01, v.atk * BEAT);
    var src = AC.createBufferSource(); src.buffer = noiseBuf(AC);
    var bp = AC.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.setValueAtTime(clamp(v.hz * 2.2, 40, 17000), t);
    bp.frequency.exponentialRampToValueAtTime(
      clamp(v.hz * 2.2 * Math.pow(2, v.slide / 12), 40, 17000), t + A + ring);
    bp.Q.value = clamp(2 + v.bright * 8, 0.6, 30);
    var slip = AC.createOscillator(); slip.type = 'sawtooth';
    slip.frequency.setValueAtTime(clamp(v.rough, 0.5, 400), t);
    slip.frequency.linearRampToValueAtTime(clamp(v.rough * 0.55, 0.5, 400), t + A + ring);
    var slipG = AC.createGain(); slipG.gain.value = 0.55;
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp * 5.3, t + A);
    g.gain.setValueAtTime(amp * 5.3, t + A + ring * 0.6);
    g.gain.exponentialRampToValueAtTime(amp * 0.0008, t + A + ring);
    g.gain.linearRampToValueAtTime(0, t + A + ring + 0.005);
    slip.connect(slipG); slipG.connect(g.gain);
    src.connect(bp); bp.connect(g);
    /* THE OFFSET MUST NOT BE ABLE TO CANCEL THE PAN (8/19). This always pushed
       LEFT by a fifth of the width, and for `wake_up.2` -- pan 0.169, width
       0.809 -- the two happened to land within 0.007 of each other, so that one
       candidate came out dead centre and sfx_render failed it as a point source
       while its four siblings were fine. It is arithmetic, not taste: any fixed
       one-directional offset can zero out somebody's pan eventually. Anything
       that would end up in the middle gets pushed back out to the same side it
       was already leaning; every other candidate is untouched, which is why
       this is the fix rather than reversing the offset for half the bank. */
    var fp = v.pan - v.width * 0.2;
    if (Math.abs(fp) < 0.08) fp = (fp < 0 || (fp === 0 && v.pan <= 0)) ? -0.08 : 0.08;
    panTo(AC, g, clamp(fp, -1, 1), dest);
    slip.start(t); slip.stop(t + A + ring + 0.02);
    src.start(t); src.stop(t + A + ring + 0.02);
    hold.push(slip); hold.push(src);
    return t + A + ring;
  }

  /* AIR -- turbulence. Noise through a resonant band that MOVES, under a
     SWELL rather than a strike. Wind, breath, gas, a hiss through a gap. The
     band's motion is the whole difference: a static filtered hiss is a
     texture, a moving one is something happening. */
  function bodyAir(v, AC, dest, t, amp, hold) {
    var ring = v.decay * BEAT, A = Math.max(0.02, v.atk * BEAT);
    var src = AC.createBufferSource(); src.buffer = noiseBuf(AC);
    var bp = AC.createBiquadFilter(); bp.type = 'bandpass';
    var f0 = clamp(v.hz * 3.5, 40, 16000);
    bp.frequency.setValueAtTime(f0, t);
    bp.frequency.linearRampToValueAtTime(clamp(f0 * (1.6 + v.bright), 40, 16000), t + A);
    bp.frequency.exponentialRampToValueAtTime(clamp(f0 * 0.7, 40, 16000), t + A + ring);
    bp.Q.value = clamp(0.6 + v.bright * 3.2, 0.3, 20);
    /* the gust inside the gust: a slow wobble on the band, so it breathes */
    var lfo = AC.createOscillator(); lfo.type = 'sine';
    lfo.frequency.value = clamp(v.rough * 0.12, 0.05, 12);
    var lg = AC.createGain(); lg.gain.value = f0 * 0.45;
    lfo.connect(lg); lg.connect(bp.frequency);
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp * 1.9, t + A);          /* a SWELL, not a hit */
    g.gain.exponentialRampToValueAtTime(amp * 0.0008, t + A + ring);
    g.gain.linearRampToValueAtTime(0, t + A + ring + 0.006);
    src.connect(bp); bp.connect(g);
    panTo(AC, g, clamp(v.pan + v.width * 0.3, -1, 1), dest);
    lfo.start(t); lfo.stop(t + A + ring + 0.02);
    src.start(t); src.stop(t + A + ring + 0.02);
    hold.push(lfo); hold.push(src);
    return t + A + ring;
  }


  /* ===================================================================
     INSTRUMENT -- HIS OWN RACK, PLAYED AS A SOUND EFFECT (8/16/26)
     =================================================================== */
  /* PAOLO, ON HIS 400/400 SWEEP, AFTER SFX-06 DIED 34 OF 35:
       "These are all very bad except for one I need you to be greater
        than use more instruments. I like it was really bad."

     HE WAS POINTING AT A REUSE-FIRST VIOLATION THAT HAD BEEN RUNNING SINCE
     7/29 AND NOBODY HAD MEASURED. The alpha carries a music studio whose
     voice rack, synthV(), holds SIX HUNDRED AND TWO named instruments --
     splinterbell, ashchoir, farbell, chapelbreath, glassrequiem, mournhorn,
     evictionbell, dustbowlguitar, on and on -- and every song he has ever
     called fire is built out of them. This engine had never called one. Five
     raw synthesis primitives, eighty moments, four hundred candidates, and
     not one note of the library sitting in the same HTML file.

     That is why the approval rate on cooked sounds has sat near 30% through
     five straight sweeps and never moved. The recipes were not the problem
     and the moments were not the problem: the SOUND SOURCE was.

     SO THE ENGINE GAINS A SIXTH PHYSICS THAT IS NOT A PHYSICS. It is a door
     into his rack. `synth: "instrument"` plus `inst: "<name>"` renders that
     event by playing HIS instrument, on the parent's AudioContext, through
     the same SFX bus, limiter and volume knob as everything else.

     WHAT THIS DELIBERATELY DOES NOT DO:
       - It does not copy a single one of his voices into this file. There is
         ONE definition of splinterbell and it stays in the studio. If the
         MUSIC lane improves a voice, every sound effect built on it improves
         with it, and neither lane has to know.
       - It does not re-quantise. playSFX already places the event on the
         beat; synthV takes an absolute start time and gets the one it is
         given.
       - It invents no instruments. MECHANISM-MINE / CONTENTS-PAOLO'S: the
         door is mine, the 602 things behind it are his.

     SCREECH LAW, CHECKED NOT ASSUMED: the rack body was swept for
     createDelay / createConvolver before this shipped. Zero of each across
     375KB and 757 oscillators. Routing effects through it adds no feedback
     path to the game.

     PITCH. His rack speaks in SEMITONES from a note function, this engine
     speaks in Hz. semiOf() converts, so a recipe still tunes in Hz like every
     other body and the instrument lands where the recipe asked.

     NODE-SAFE. The rack is in the alpha, not in this module, so under `node`
     (every gate that requires this file) synthV does not exist. The body
     returns the start time unchanged rather than throwing, and
     instrument_gate.py does the real verification on the SHIPPED surface --
     which is the only place the claim is even meaningful. */
  function bodyInstrument(v, AC, dest, t, amp, hold) {
    var SV = null;
    try {
      SV = (typeof window !== 'undefined' && window.synthV) ? window.synthV
         : (typeof synthV !== 'undefined') ? synthV : null;
    } catch (e) { SV = null; }
    if (!SV || !v.inst) return t;
    var sd   = instStep(v);
    var semi = semiOf(v.hz);
    var hzFn = function (x) { return REF_HZ * Math.pow(2, x / 12); };

    /* LOUD ENOUGH TO JUDGE, AND ALL AT THE SAME LOUDNESS (8/19). The first
       bridge mapped into his rack's own g0 range (~0.05-0.13, read off the
       studio's call sites) so a borrowed voice was never driven harder than the
       song drives it. Correct instinct, wrong result twice over: 27 candidates
       landed outside the judgeable band of 0.15-0.85, and worse, they landed
       all over it -- `taiko` came out 17x louder than `boneplate` from the SAME
       bank at the SAME g0. On the board he would have been picking whichever
       one he could HEAR rather than whichever one he liked.
       So the drive is solved backwards from the measured peak: whatever the
       voice is, it arrives at INST_VREF. The recipe's own gain x mkup still
       rides on top downstream, so a punch still outranks a UI tick.
       THE FIX IS HERE AND NOT IN THE RECIPE ON PURPOSE: `gain` is part of the
       cooked vector and verdict_frozen_gate freezes it, so touching it would
       reassign every thumb he has already spent on these. This is ENGINE
       BEHAVIOUR -- the vector is byte-identical and the sound simply arrives
       at a level he can judge. */
    /* ONE VOICE PER STRIKE, NOT ONE PER STRIKE PER HIT (8/19). render() already
       walks v.hits and calls strike() once per hit; this walked v.hits AGAIN
       inside each of those calls, so a 3-hit recipe fired NINE voices and the
       last of them started a beat and a half after the note was over. That is
       most of what sfx_render was reporting as "outlives its own beats" on
       panel_tick and boots_go. A body renders ONE body. */
    var win = Math.min(instSec(v.inst, sd, semi), INST_MAX_BEATS * BEAT);
    /* AND NOTHING GETS PAST THE NOTE. room() re-strikes the body a few tens of
       ms late for its reflections, and a voice whose length does not scale with
       the step (half his rack) comes back the SAME length from that later
       start -- so the reflection, not the body, is what hangs over the end.
       INST_CUT is the render's own spec'd end; past it there is silence, which
       is the SCREECH LAW enforced at the only place that can enforce it. */
    if (INST_CUT != null) win = Math.min(win, Math.max(0.02, INST_CUT - t));
    /* if the voice is longer than the window it has, SHRINK IT rather than cut it */
    if (instSec(v.inst, sd, semi) > win + 0.004) {
      var fit = instStepFor(v.inst, win, semi);
      if (fit != null) sd = fit;
    }
    var end = t + win;

    var g0 = clamp(amp * 0.30 * INST_VREF / instPeak(v.inst, sd, semi), 0.004, 60);

    /* THE BORROWED VOICE OBEYS THIS ENGINE'S ENVELOPE. His rack rings on its
       own schedule -- it was written for music, where a pad holding through the
       next bar is the point. A game sound may not do that, so the voice goes
       through a gain that CLOSES, and everything past the note is silence.
       AND IT PUTS THE VOICE IN THE ROOM. Routed through panTo it finally has a
       position: 50 candidates were failing dead-mono because the bridge
       connected straight to the bus, so every borrowed voice came out as a
       point source in the exact middle of his head -- the one thing FFX
       explicitly moved away from. The placement is the vector's own declared
       `width`, which is what that field has always meant, and the SIDE is
       seeded off the id so it is the same every time he hears it. */
    var seed = hashStr(String(v.id || v.ev || '') + '|' + v.inst);
    var side = (seed & 1) ? 1 : -1;
    var ig = AC.createGain();
    ig.gain.setValueAtTime(1, t);
    ig.gain.setValueAtTime(1, Math.max(t + 0.001, end - 0.018));
    ig.gain.linearRampToValueAtTime(0, end);
    panTo(AC, ig, clamp(v.pan + side * Math.max(0.14, v.width * 0.42), -1, 1), dest);

    /* SEEDED, NOT RANDOM -- the same law the particle cloud already lives
       under, applied to somebody else's code. Several of his voices (`anvil`,
       `rubboard`, `guiro`, `cabasa`, `thunderdrum`) draw from Math.random
       internally, which is fine in a song and fatal here: sfx_render measured
       one of them rendering 161% of its own peak differently the second time.
       A candidate he thumbed has to be the candidate that plays, so Math.random
       is swapped for this vector's own stream across the call and put straight
       back. Restored in a finally: it is the page's Math.random, not ours. */
    var mr = Math.random;
    var draw = rng(seed);
    try {
      Math.random = function () { return draw(); };
      try { SV(v.inst, AC, ig, hzFn, sd, semi, t, g0); } catch (e) {}
    } finally { Math.random = mr; }

    return end;
  }
  /* A3. Chosen because his rack's own call sites pass semitone offsets in
     roughly -55..+12 around it, so a Hz in this engine's legal range converts
     to a semitone his instruments actually sound good at. */
  var REF_HZ = 220;
  function semiOf(hz) {
    return Math.round(12 * Math.log(Math.max(20, hz) / REF_HZ) / Math.LN2);
  }

  function strike(v, AC, dest, t, amp, hold) {
    var bank = MODES[v.mat] || MODES.stone;
    var used = Math.min(v.modes, bank.length);
    var ring = v.decay * BEAT, A = v.atk * BEAT;
    var latest = t + A + ring;

    /* --- LAYER 1: THE TRANSIENT. sample-aligned with the body, slightly hotter
       than it, because that is what reads as "crisp" rather than "mushy". --- */
    if (v.trans > 0.02) {
      var ns = AC.createBufferSource(); ns.buffer = noiseBuf(AC);
      var bp = AC.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = clamp(v.transHz, 60, 16000);
      bp.Q.value = clamp(v.transQ, 0.1, 18);
      var tg = AC.createGain();
      var tl = 0.004 + 0.02 * (1 - v.trans);          /* 4-24 ms: a snap, not a hiss */
      tg.gain.setValueAtTime(0.0001, t);
      tg.gain.linearRampToValueAtTime(v.trans * amp * 1.15, t + 0.0012);
      tg.gain.exponentialRampToValueAtTime(0.0006, t + tl);
      tg.gain.linearRampToValueAtTime(0, t + tl + 0.003);
      ns.connect(bp); bp.connect(tg);
      panTo(AC, tg, v.pan * 0.6, dest);
      ns.start(t); ns.stop(t + tl + 0.02); hold.push(ns);
      if (t + tl > latest) latest = t + tl;
    }

    /* --- LAYER 2: THE BODY -----------------------------------------------
       WHICH PHYSICS MAKES IT (8/12). Everything above and below this point is
       shared -- the snap and the room are generic and every method gets them.
       Only the body changes, and `modal` is the original code untouched, so
       all 97 sounds Paolo has approved render byte-identical. */
    if (v.synth && v.synth !== 'modal') {
      var e2 = (v.synth === 'fm')         ? bodyFM(v, AC, dest, t, amp, hold)
             : (v.synth === 'particle')   ? bodyParticle(v, AC, dest, t, amp, hold)
             : (v.synth === 'friction')   ? bodyFriction(v, AC, dest, t, amp, hold)
             : (v.synth === 'air')        ? bodyAir(v, AC, dest, t, amp, hold)
             : (v.synth === 'instrument') ? bodyInstrument(v, AC, dest, t, amp, hold)
             : latest;
      return (e2 > latest) ? e2 : latest;
    }

    /* --- the modal bank. every partial gets its OWN decay, and the decay
       SHORTENS as the ratio climbs: the physical law v1 broke. --- */
    for (var i = 0; i < used; i++) {
      var m = bank[i];
      var ratio = m[0], mAmp = m[1], mDur = m[2], mOff = m[3];
      var f0 = v.hz * ratio + mOff * v.warble;
      if (f0 < 16 || f0 > 19000) continue;
      /* bright tilts the spectrum; damp is how hard the physical law bites */
      var lvl = mAmp * Math.pow(ratio, -1.1 / Math.max(0.05, v.bright));
      if (lvl < 0.0012) continue;
      var dur = ring * Math.pow(mDur, v.damp);
      if (dur < 0.006) dur = 0.006;

      var o = AC.createOscillator();
      o.type = (v.mat === 'metal' || v.mat === 'ash') ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(f0, t);
      if (v.slide !== 0) {
        o.frequency.exponentialRampToValueAtTime(
          clamp(f0 * Math.pow(2, v.slide / 12), 16, 19000), t + A + dur);
      }
      var g = AC.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(lvl * amp, t + Math.max(0.0015, A));
      g.gain.exponentialRampToValueAtTime(0.0004, t + A + dur);
      g.gain.linearRampToValueAtTime(0, t + A + dur + 0.004);
      o.connect(g);
      /* STEREO: partials are placed AROUND the centre in an alternating,
         widening pattern, not on a left-to-right ramp. A ramp puts partial 0 --
         which is the loudest one in every bank -- hard on one side, and the
         first measurement showed exactly that collapsing several candidates
         back to near-mono. Real objects radiate each mode in its own direction;
         this places them that way. FFX's own upgrade was getting off mono. */
      var spread = SPREADS[i % SPREADS.length];
      panTo(AC, g, clamp(v.pan + spread * v.width * 0.8, -1, 1), dest);
      o.start(t); o.stop(t + A + dur + 0.02); hold.push(o);
      if (t + A + dur > latest) latest = t + A + dur;
    }

    /* grit bedded INTO the body (dust, scrape), not a separate event */
    if (v.grit > 0.02) {
      var gs = AC.createBufferSource(); gs.buffer = noiseBuf(AC);
      var gf = AC.createBiquadFilter(); gf.type = 'bandpass';
      gf.frequency.setValueAtTime(clamp(v.gritHz, 60, 16000), t);
      gf.frequency.exponentialRampToValueAtTime(clamp(v.gritHz * 0.45, 60, 16000), t + A + ring);
      gf.Q.value = 0.9;
      var gg = AC.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.linearRampToValueAtTime(v.grit * amp * 0.5, t + 0.003);
      gg.gain.exponentialRampToValueAtTime(0.0005, t + A + ring * 0.7);
      gg.gain.linearRampToValueAtTime(0, t + A + ring * 0.7 + 0.004);
      gs.connect(gf); gf.connect(gg);
      panTo(AC, gg, clamp(v.pan - v.width * 0.3, -1, 1), dest);
      gs.start(t); gs.stop(t + A + ring + 0.02); hold.push(gs);
    }
    return latest;
  }

  /* --- LAYER 3: THE ROOM. Built as SOURCES, never processors.
     early reflections = the body struck again, quieter, off to the side.
     late tail        = filtered noise under an exponential decay, which is what
                        a late reverb tail physically IS.
     No delay node. No convolver. Nothing can ring. --- */
  function room(v, AC, dest, t, hold) {
    if (v.space < 0.02) return t;
    var tail = v.room * BEAT;
    var latest = t;

    var TAPS = [0.017, 0.031, 0.049, 0.072];
    for (var i = 0; i < v.refl; i++) {
      var rt = t + TAPS[i] * (0.6 + v.room);
      var rv = sanitize(v);
      rv.trans = v.trans * 0.25;
      rv.grit = 0;
      rv.space = 0;
      rv.decay = Math.max(1 / 16, q(v.decay * 0.5));
      rv.pan = clamp(v.pan + ((i % 2) ? 1 : -1) * v.width * 0.55, -1, 1);
      var e = strike(rv, AC, dest, rt, v.space * Math.pow(0.55, i + 1), hold);
      if (e > latest) latest = e;
    }

    if (tail > 0.01) {
      var ns = AC.createBufferSource(); ns.buffer = noiseBuf(AC);
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(clamp(v.dark, 120, 16000), t);
      /* the room gets darker as it dies, like every real room */
      lp.frequency.exponentialRampToValueAtTime(clamp(v.dark * 0.3, 120, 16000), t + tail);
      lp.Q.value = 0.6;
      var hp = AC.createBiquadFilter(); hp.type = 'highpass';
      hp.frequency.value = clamp(v.hz * 0.6, 40, 4000);
      var g = AC.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(v.space * 0.16, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0004, t + tail);
      g.gain.linearRampToValueAtTime(0, t + tail + 0.006);
      ns.connect(lp); lp.connect(hp); hp.connect(g);
      panTo(AC, g, clamp(v.pan * 0.4, -1, 1), dest);
      ns.start(t); ns.stop(t + tail + 0.03); hold.push(ns);
      if (t + tail > latest) latest = t + tail;
    }
    return latest;
  }

  function render(vec, AC, dest, when) {
    var v = sanitize(vec);
    var t0 = (when == null) ? AC.currentTime + 0.02 : when;

    /* CHAIN ORDER MATTERS AND IT BIT ME TWICE. A WaveShaper curve is defined
       over -1..1 and CLAMPS past it, so anything driven into it hotter does not
       get louder, it pins. v1 had the makeup gain before the bitcrusher and
       flattened four PICKUP candidates; the first v2 measurement did it again
       with the output gain in front of the saturator, pinning HIT, BLOCK, KILL
       and PHONE at exactly 1.000. The saturator SHAPES, the gain LEVELS, in
       that order: sources -> drive -> gain -> out. */
    var out = AC.createGain();
    out.gain.value = v.gain * v.mkup;
    out.connect(dest);
    var bus = out;
    if (v.drive > 0.02) {
      var ws = AC.createWaveShaper();
      ws.curve = driveCurve(v.drive);
      /* MEMORYLESS ON PURPOSE. '2x' oversampling wraps the curve in up/down
         sampling filters that carry state, and across the ~120 offline contexts
         a full gate run creates, that state made one candidate render 1.8%
         differently the second time -- while the same candidate measured 0.0001%
         in isolation. A judged sound that depends on how many sounds were
         rendered before it is not a judged sound. A memoryless curve aliases a
         little; it can never drift. */
      ws.oversample = 'none';
      ws.connect(out);
      bus = ws;
    }

    var hold = [], last = t0;
    var prevCut = INST_CUT;
    INST_CUT = t0 + beatsOf(v) * BEAT;
    try {
      for (var i = 0; i < v.hits.length; i++) {
        var t = t0 + v.hits[i] * BEAT;
        var e = strike(v, AC, bus, t, 1, hold);
        if (e > last) last = e;
        var r = room(v, AC, bus, t, hold);
        if (r > last) last = r;
      }
    } finally { INST_CUT = prevCut; }

    /* NOTHING OUTLIVES ITSELF. Realtime only: an OfflineAudioContext renders
       faster than the wall clock, so a wall-clock timer would tear the graph
       down mid-render (v1's first gate run caught exactly that). */
    var offline = (typeof AC.startRendering === 'function');
    if (!offline && typeof setTimeout === 'function') {
      setTimeout(function () {
        for (var j = 0; j < hold.length; j++) { try { hold[j].disconnect(); } catch (e) {} }
        try { out.disconnect(); } catch (e) {}
      }, Math.max(60, (last - AC.currentTime + BEAT) * 1000));
    }
    return { t0: t0, end: last, beats: beatsOf(v) };
  }

  /* ---- THE BANK (MECHANISM-MINE / CONTENTS-PAOLO'S) -------------------- */
  var BANK = {};
  function bankOf(ev) { return BANK[ev] || null; }
  function setBank(table) { BANK = {}; for (var k in table) if (table.hasOwnProperty(k)) BANK[k] = sanitize(table[k]); }
  function play(ev, AC, dest, when) {
    var v = BANK[ev];
    if (!v || !AC || !dest) return null;      /* unjudged = silent */
    return render(v, AC, dest, when);
  }

  return {
    VERSION: 2, BEAT: BEAT, TICK: TICK, SPEC: SPEC, FIELDS: FIELDS,
    EVENTS: EVENTS, RECIPE: RECIPE, MODES: MODES, MATERIALS: MATERIALS,
    ENVELOPE: ENVELOPE,
    BANK: BANK, q: q, sanitize: sanitize, validate: validate, serialize: serialize,
    beatsOf: beatsOf, durSec: durSec, cook: cook, batch: batch,
    render: render, play: play, bankOf: bankOf, setBank: setBank,
    hashStr: hashStr, rng: rng
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_SFX;
