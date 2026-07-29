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
    pan:     { kind: 'num',  min: -1,  max: 1,    d: 0 }
  };
  var FIELDS = Object.keys(SPEC);

  function sanitize(v) {
    var o = {}, i, k, s, x;
    for (i = 0; i < FIELDS.length; i++) {
      k = FIELDS[i]; s = SPEC[k];
      x = (v && v[k] != null) ? v[k] : s.d;
      if (s.kind === 'enum') o[k] = (s.of.indexOf(x) >= 0) ? x : s.d;
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

  /* THE WHOLE AUDIBLE LIFE. The room is triggered at the SAME instant as the
     strike, not after it -- so the sound lasts as long as the LONGER of the two,
     never their sum. The first version added them, which overstated every
     roomy sound by about double and made the render gate call five bells
     "a click" for being audible over only a third of a length that was never
     real. A duration this engine reports is a duration the game will schedule
     against, so it has to be the truth. */
  function beatsOf(v) {
    var body = q(v.atk + v.decay);
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
    { ev: 'save_chime',   label: 'SAVED',               why: 'the run recorded what you did' }
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
    }
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

    /* --- LAYER 2: THE BODY. the modal bank. every partial gets its OWN decay,
       and the decay SHORTENS as the ratio climbs: the physical law v1 broke. --- */
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
    for (var i = 0; i < v.hits.length; i++) {
      var t = t0 + v.hits[i] * BEAT;
      var e = strike(v, AC, bus, t, 1, hold);
      if (e > last) last = e;
      var r = room(v, AC, bus, t, hold);
      if (r > last) last = r;
    }

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
    BANK: BANK, q: q, sanitize: sanitize, validate: validate, serialize: serialize,
    beatsOf: beatsOf, durSec: durSec, cook: cook, batch: batch,
    render: render, play: play, bankOf: bankOf, setBank: setBank,
    hashStr: hashStr, rng: rng
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_SFX;
