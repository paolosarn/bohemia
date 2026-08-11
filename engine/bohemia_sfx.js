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
    { ev: 'money',       label: 'MONEY MOVES',    why: 'cash changes hands. in a post-economic valley this is never neutral' },
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
    { ev: 'equip',    label: 'CLOTHES GO ON',  why: 'the wardrobe is a whole system that never made a sound' }
    /* ---- end batch SFX-03 events ---- */
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
    /* ---- end batch SFX-03 recipes ---- */
  };

  /* ---- THE MEASURED ENVELOPE (8/12/26) ---------------------------------
     Learned from every thumb in records/BOHEMIA_SFX_VERDICT_*.txt, exported so
     the gate checks the SHIPPED numbers instead of a copy of them. See the
     BATCH SFX-03 header in EVENTS for the derivation and the honest limits.
     BATCH is the list of event ids the envelope binds; his older recipes are
     what the envelope was learned FROM and are not retro-fitted to it. */
  var ENVELOPE = {
    since: '8/12/26',
    maxMkup: 1.10,        /* UP mean 0.92 vs DOWN 1.28, effect -1.17 */
    maxDrive: 0.30,       /* UP mean 0.16 vs DOWN 0.30, effect -0.62 */
    winners: ['glass', 'crystal', 'stone', 'bell', 'choir', 'ash'],
    losers:  ['metal', 'wood', 'water'],   /* 9 UP / 26 DOWN across 35 thumbs */
    /* a loser material is legal ONLY where the struck object IS that thing */
    loserOK: { step_wood: 'a floorboard is wood', step_metal: 'a deck plate is steel',
               reload: 'a magazine is steel', drink: 'the sound is water' },
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
    ENVELOPE: ENVELOPE,
    BANK: BANK, q: q, sanitize: sanitize, validate: validate, serialize: serialize,
    beatsOf: beatsOf, durSec: durSec, cook: cook, batch: batch,
    render: render, play: play, bankOf: bankOf, setBank: setBank,
    hashStr: hashStr, rng: rng
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_SFX;
