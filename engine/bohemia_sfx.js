/* ===========================================================================
   BOHEMIA — THE SFX FACTORY (BOH_SFX)
   ---------------------------------------------------------------------------
   SOUND EFFECTS ARE PAOLO'S ONLY 0% (his own progress ledger, 7/28:
   records/BOHEMIA_PAOLO_PROGRESS_LEDGER_7_28_26.md). He ordered a dedicated
   SOUNDS chat on 7/29 and greenlit this as item 0 of its backlog.

   FACTORY LAW, applied to audio:
     typed spec  ->  generator  ->  batch output  ->  kill/approve  ->  gate
     (SPEC)          (cook)        (batch: 12x5)     (MUSIC tab)      (sfx_gate)

   A SOUND IS NOT A FILE. It is ~21 numbers. The whole batch of 60 candidates
   is about 6 KB of parameters that synthesize at play time on the AudioContext
   the MUSIC studio already owns. Zero asset weight in a 33 MB one-file alpha,
   and a sound Paolo approves is stored as its vector, not as audio.

   REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): this module cooks ZERO graphic
   pixels, so no banks/ art lookup applies. Its AUDIO reuse is the point of the
   file: it takes the MUSIC studio's existing AudioContext, master gain and
   brickwall limiter chain (MUS.audio() / MUS.AC / MUS.MAST in the alpha) and
   builds nothing of its own. ONE AUDIOCONTEXT, THE PARENT'S — a second audio
   engine is banned by the lane intent, and iOS gives a page a small number of
   contexts before it simply stops making sound. It also reuses the studio's
   note mapping convention (110 * 2^(semi/12)) so a sound and a song agree
   about what a pitch is.

   THE THREE LAWS THIS FILE ANSWERS TO
   -----------------------------------
   120 BPM LAW / EVERY DURATION IS A NOTE. Every time value in a vector is in
   BEATS, not seconds, and quantized to a 16th of a beat (31.25 ms at 120 BPM).
   Attack, hold, decay, the pitch-jump moment and every extra hit of a multi-hit
   sound all land on the grid. A kill that lands on the beat and a hi-hat that
   lands on the beat are then the same event, not two systems that nearly agree.

   SCREECH LAW (7/8, the incident that made the music gate). Nothing may feed
   back and nothing may ring by loop: no createDelay, no createConvolver, ever.
   Every voice here is excited and then decays to actual zero, and every node it
   makes is stopped and dropped on a timer, so a sound cannot outlive itself.

   MECHANISM-MINE / CONTENTS-PAOLO'S. The synth and the 60 candidates are
   mechanism, and they ship. BANK — which sound each game event actually makes —
   is EMPTY and stays empty until he thumbs one. play() on an unbanked event is
   deliberately silent. Nobody fills that table from taste; it is filled from a
   verdict file.
   =========================================================================== */
const BOH_SFX = (function () {
  'use strict';

  /* ---- THE GRID (120 BPM LAW) ------------------------------------------ */
  var BEAT = 0.5;            /* seconds per beat at 120 BPM, the whole game's spine */
  var TICK = BEAT / 16;      /* the shortest legal duration: a 16th of a beat */

  /* quantize a beat count onto the 16th grid. EVERY DURATION IS A NOTE. */
  function q(beats) { return Math.round(beats * 16) / 16; }

  /* ---- THE TYPED SPEC -------------------------------------------------- */
  /* 21 fields. kind 'beat' fields are quantized by sanitize(); nothing else in
     the codebase is allowed to invent an audio parameter outside this table. */
  var SPEC = {
    src:    { kind: 'enum', of: ['sine', 'tri', 'saw', 'sq', 'noise', 'metal'], d: 'sine' },
    hz:     { kind: 'num',  min: 24,   max: 7000,  d: 220 },
    slide:  { kind: 'num',  min: -48,  max: 48,    d: 0 },     /* semitones across the life */
    jump:   { kind: 'num',  min: -24,  max: 24,    d: 0 },     /* one instant pitch jump */
    jumpAt: { kind: 'beat', min: 0,    max: 2,     d: 0 },
    atk:    { kind: 'beat', min: 0,    max: 1,     d: 0 },
    hold:   { kind: 'beat', min: 0,    max: 2,     d: 0 },
    dec:    { kind: 'beat', min: 1 / 16, max: 4,   d: 0.25 },
    ftype:  { kind: 'enum', of: ['lp', 'hp', 'bp'], d: 'lp' },
    cut:    { kind: 'num',  min: 90,   max: 16000, d: 4000 },
    res:    { kind: 'num',  min: 0.0001, max: 18,  d: 0.8 },
    sweep:  { kind: 'num',  min: 0.05, max: 16,    d: 1 },     /* cutoff multiplier across the life */
    noise:  { kind: 'num',  min: 0,    max: 1,     d: 0 },     /* noise/tone blend */
    body:   { kind: 'num',  min: 1,    max: 5,     d: 1 },     /* partial count (int) */
    det:    { kind: 'num',  min: 0,    max: 0.06,  d: 0 },     /* detune between partials */
    crush:  { kind: 'num',  min: 0,    max: 1,     d: 0 },     /* bitcrush, waveshaper only */
    trem:   { kind: 'num',  min: 0,    max: 40,    d: 0 },     /* tremolo Hz */
    tremD:  { kind: 'num',  min: 0,    max: 1,     d: 0 },
    vib:    { kind: 'num',  min: 0,    max: 30,    d: 0 },     /* vibrato Hz */
    vibD:   { kind: 'num',  min: 0,    max: 140,   d: 0 },     /* vibrato depth, cents */
    mkup:   { kind: 'num',  min: 0.25, max: 24,    d: 1 },     /* makeup for filter loss, post-filter */
    gain:   { kind: 'num',  min: 0,    max: 1,     d: 0.5 },
    pan:    { kind: 'num',  min: -1,   max: 1,     d: 0 }
  };
  var FIELDS = Object.keys(SPEC);

  /* hits[] is the one non-scalar: extra strikes of the same voice, in beats.
     A gravel crunch is three strikes 1/16 of a beat apart; a phone buzz is two
     pulses half a beat apart. Kept out of SPEC because it is a list, kept on
     the grid by the same q(). */

  function clamp(x, lo, hi) { return x < lo ? lo : (x > hi ? hi : x); }

  function sanitize(v) {
    var o = {}, k, s;
    for (var i = 0; i < FIELDS.length; i++) {
      k = FIELDS[i]; s = SPEC[k];
      var x = (v && v[k] != null) ? v[k] : s.d;
      if (s.kind === 'enum') o[k] = (s.of.indexOf(x) >= 0) ? x : s.d;
      else if (s.kind === 'beat') o[k] = clamp(q(+x || 0), s.min, s.max);
      else o[k] = clamp(+x || 0, s.min, s.max);
    }
    o.body = Math.max(1, Math.min(5, Math.round(o.body)));
    o.ev = (v && v.ev) || 'unnamed';
    o.id = (v && v.id) || (o.ev + '.0');
    o.hits = [];
    var h = (v && v.hits) || [0];
    for (var j = 0; j < h.length && j < 8; j++) o.hits.push(clamp(q(h[j]), 0, 8));
    if (!o.hits.length) o.hits = [0];
    return o;
  }

  /* the sound's length, in beats and in seconds — the judge page shows beats
     because that is the unit the game thinks in */
  function beatsOf(v) { return q(v.atk + v.hold + v.dec) + Math.max.apply(null, v.hits); }
  function durSec(v) { return beatsOf(v) * BEAT; }

  /* ---- THE GAME EVENTS ------------------------------------------------- */
  /* WHAT a sound is for. WHICH sound it becomes is Paolo's verdict, never this
     file's. `why` is the one line the judge card shows him so he is thumbing a
     moment in the game, not an abstract noise. */
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

  /* ---- THE RECIPES (the generator's raw material) ----------------------- */
  /* base = the shape of the event. jit = which axes the batch is allowed to
     explore, and how far. The jitter is PERCEPTUAL on purpose — five candidates
     differ in attack, brightness, pitch fall and grit, never in volume alone,
     because five volumes of one sound is not a choice.

     THE MIX IS DESIGNED, NOT ACCIDENTAL. `mkup` is makeup gain for filter loss,
     and it is not guesswork: the first render measured the twelve families
     20 dB apart — a bandpass at Q 5 throws most of a saw away, so BLOCK and the
     asphalt footsteps came out near-silent next to KILL. Judging those side by
     side would have been judging which ones he could HEAR. Each family's mkup
     was measured off the real render (gates/sfx_render_gate.py) and set so its
     median peak lands on a DELIBERATE loudness ladder:

        kill 1.00 > hit 0.90 > block 0.72 > door shut 0.75 ~ phone 0.70
        > pickup 0.65 > save 0.60 > door open 0.55 > footsteps 0.45 > tap 0.35

     A kill SHOULD dwarf a footstep — that ladder is the point. What must never
     happen again is a sound that loses the comparison because it was quiet.
     Re-measure and re-set these if a recipe's filter changes; the gate holds
     the band and the ladder. */
  var RECIPE = {
    step_dirt: {
      base: { src: 'sine', hz: 120, slide: -7, atk: 0, hold: 0, dec: 0.125, ftype: 'lp',
              cut: 900, res: 0.7, sweep: 0.35, noise: 0.72, body: 1, mkup: 1.364, gain: 0.34 },
      jit:  { hz: [86, 165], dec: [0.0625, 0.1875], cut: [620, 1500], noise: [0.55, 0.9],
              slide: [-12, -3], sweep: [0.22, 0.6], crush: [0, 0.25] }
    },
    step_asphalt: {
      base: { src: 'sine', hz: 190, slide: -9, atk: 0, hold: 0, dec: 0.0625, ftype: 'bp',
              cut: 2400, res: 1.6, sweep: 0.5, noise: 0.88, body: 1, mkup: 4.03, gain: 0.32 },
      jit:  { hz: [150, 260], cut: [1500, 3600], res: [0.9, 4], noise: [0.75, 1],
              dec: [0.0625, 0.125], sweep: [0.3, 0.9] }
    },
    step_gravel: {
      base: { src: 'noise', hz: 320, atk: 0, hold: 0, dec: 0.0625, ftype: 'bp',
              cut: 2800, res: 2.4, sweep: 0.55, noise: 1, body: 1, mkup: 5.41, gain: 0.3,
              hits: [0, 0.0625, 0.125] },
      jit:  { cut: [1900, 4200], res: [1.4, 5], dec: [0.0625, 0.125], sweep: [0.35, 1.1] },
      hitSets: [[0, 0.0625, 0.125], [0, 0.0625], [0, 0.0625, 0.125, 0.1875], [0, 0.125], [0, 0.0625, 0.125]]
    },
    door_open: {
      base: { src: 'saw', hz: 168, slide: 5, atk: 0.0625, hold: 0.125, dec: 0.75, ftype: 'bp',
              cut: 900, res: 5, sweep: 1.9, noise: 0.3, body: 2, det: 0.012,
              trem: 9, tremD: 0.45, mkup: 10.0, gain: 0.3 },
      jit:  { hz: [120, 250], slide: [2, 11], dec: [0.5, 1.25], cut: [600, 1500],
              res: [3, 9], trem: [5, 16], tremD: [0.25, 0.7], noise: [0.15, 0.5] }
    },
    door_shut: {
      base: { src: 'sine', hz: 84, slide: -10, atk: 0, hold: 0, dec: 0.25, ftype: 'lp',
              cut: 1300, res: 0.9, sweep: 0.28, noise: 0.42, body: 2, det: 0.006,
              mkup: 1.5, gain: 0.42, hits: [0, 0.0625] },
      jit:  { hz: [62, 120], dec: [0.1875, 0.375], cut: [850, 2100], noise: [0.28, 0.6],
              slide: [-16, -6], crush: [0, 0.35] },
      hitSets: [[0, 0.0625], [0], [0, 0.0625], [0, 0.125], [0, 0.0625]]
    },
    pickup: {
      base: { src: 'sq', hz: 520, slide: 5, jump: 7, jumpAt: 0.0625, atk: 0, hold: 0.0625,
              dec: 0.1875, ftype: 'lp', cut: 5200, res: 1.2, sweep: 1.4, body: 1, mkup: 1.3, gain: 0.3 },
      jit:  { hz: [380, 760], jump: [4, 12], slide: [0, 7], dec: [0.125, 0.375],
              cut: [3200, 8000], crush: [0, 0.4] }
    },
    hit: {
      base: { src: 'saw', hz: 210, slide: -22, atk: 0, hold: 0, dec: 0.1875, ftype: 'lp',
              cut: 2600, res: 1.4, sweep: 0.14, noise: 0.46, body: 2, det: 0.02,
              crush: 0.3, mkup: 1.32, gain: 0.55 },
      jit:  { hz: [140, 330], slide: [-32, -14], dec: [0.125, 0.3125], cut: [1600, 4200],
              noise: [0.28, 0.66], crush: [0.1, 0.6], res: [0.8, 4] }
    },
    block: {
      base: { src: 'metal', hz: 330, slide: -3, atk: 0, hold: 0, dec: 0.375, ftype: 'bp',
              cut: 3000, res: 5.5, sweep: 0.7, noise: 0.2, body: 4, mkup: 8.47, gain: 0.4 },
      jit:  { hz: [230, 520], dec: [0.25, 0.625], cut: [2000, 5200], res: [3, 9],
              noise: [0.08, 0.4], sweep: [0.4, 1.3] }
    },
    kill: {
      base: { src: 'sine', hz: 132, slide: -14, atk: 0, hold: 0.0625, dec: 0.9375, ftype: 'lp',
              cut: 2200, res: 1.1, sweep: 0.12, noise: 0.34, body: 2, det: 0.01,
              crush: 0.35, mkup: 1.04, gain: 0.72 },
      jit:  { hz: [88, 190], slide: [-22, -9], dec: [0.6875, 1.4375], cut: [1400, 3600],
              noise: [0.2, 0.55], crush: [0.15, 0.6] }
    },
    ui_tap: {
      base: { src: 'tri', hz: 940, slide: -4, atk: 0, hold: 0, dec: 0.0625, ftype: 'hp',
              cut: 500, res: 0.8, sweep: 1.5, body: 1, mkup: 0.928, gain: 0.22 },
      jit:  { hz: [620, 1500], dec: [0.0625, 0.125], cut: [300, 1100], slide: [-9, 0] }
    },
    phone_buzz: {
      base: { src: 'sq', hz: 58, atk: 0, hold: 0.375, dec: 0.0625, ftype: 'lp',
              cut: 620, res: 1.2, sweep: 0.9, trem: 26, tremD: 0.85, body: 1,
              mkup: 0.907, gain: 0.38, hits: [0, 0.5] },
      jit:  { hz: [40, 88], trem: [17, 36], tremD: [0.6, 1], hold: [0.25, 0.5],
              cut: [400, 1000] },
      hitSets: [[0, 0.5], [0, 0.5, 1], [0], [0, 0.625], [0, 0.5]]
    },
    save_chime: {
      base: { src: 'sine', hz: 784, jump: 7, jumpAt: 0.125, atk: 0.0625, hold: 0.0625,
              dec: 1.25, ftype: 'lp', cut: 6000, res: 0.7, sweep: 0.55, body: 3,
              det: 0.004, vib: 5, vibD: 9, mkup: 1.558, gain: 0.26 },
      jit:  { hz: [560, 1050], jump: [3, 12], dec: [0.875, 1.75], cut: [3600, 9000],
              vib: [0, 7], vibD: [0, 22], body: [2, 4] }
    }
  };

  /* ---- THE GENERATOR --------------------------------------------------- */
  /* Deterministic by construction: the seed is the event name and the candidate
     index, so candidate step_dirt.3 is the same 21 numbers on every machine, in
     every session, forever. That is what makes the regression gate possible —
     if a recipe is edited, the fingerprints move and the gate says so out loud
     instead of quietly handing Paolo a different sound than the one he judged. */
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
      var rand = rng(hashStr(ev + '#' + i));
      var v = {};
      for (var k in r.base) if (r.base.hasOwnProperty(k)) v[k] = r.base[k];
      /* candidate 0 is always the recipe UNJITTERED: the batch always contains
         the straight reading of the event, so "none of these" can never mean
         "you never played me the plain one" */
      if (i > 0) {
        for (var f in r.jit) {
          if (!r.jit.hasOwnProperty(f)) continue;
          var lo = r.jit[f][0], hi = r.jit[f][1];
          var x = lo + rand() * (hi - lo);
          v[f] = (SPEC[f] && SPEC[f].kind === 'beat') ? q(x) : x;
        }
        if (r.hitSets) v.hits = r.hitSets[i % r.hitSets.length].slice();
      }
      v.ev = ev; v.id = ev + '.' + i;
      out.push(sanitize(v));
    }
    return out;
  }

  /* the whole sitting: 12 events x 5 = 60 candidates, ~6 KB of numbers */
  function batch(n) {
    var out = [];
    for (var i = 0; i < EVENTS.length; i++) out = out.concat(cook(EVENTS[i].ev, n || 5));
    return out;
  }

  /* ---- VALIDATION (what the gate calls) -------------------------------- */
  function validate(v) {
    var errs = [];
    if (!v || typeof v !== 'object') return ['not an object'];
    for (var i = 0; i < FIELDS.length; i++) {
      var k = FIELDS[i], s = SPEC[k], x = v[k];
      if (x == null) { errs.push(k + ' missing'); continue; }
      if (s.kind === 'enum') { if (s.of.indexOf(x) < 0) errs.push(k + ' not in spec: ' + x); continue; }
      if (typeof x !== 'number' || !isFinite(x)) { errs.push(k + ' not a finite number'); continue; }
      if (x < s.min - 1e-9 || x > s.max + 1e-9) errs.push(k + ' out of range: ' + x);
      /* 120 BPM LAW: every duration is a note */
      if (s.kind === 'beat' && Math.abs(x * 16 - Math.round(x * 16)) > 1e-9)
        errs.push(k + ' is off the 16th grid: ' + x);
    }
    if (!v.hits || !v.hits.length) errs.push('hits missing');
    else for (var j = 0; j < v.hits.length; j++)
      if (Math.abs(v.hits[j] * 16 - Math.round(v.hits[j] * 16)) > 1e-9)
        errs.push('hit ' + j + ' is off the 16th grid: ' + v.hits[j]);
    return errs;
  }

  /* a stable text form of a vector — the thing the regression gate hashes, and
     the thing an approved sound is banked AS */
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
  /* Takes the AudioContext it is given. NEVER constructs one — one context, the
     parent's, is the lane's law and iOS's practical limit. */

  var _noiseCache = null;
  function noiseBuf(AC, secs) {
    var n = Math.max(1, Math.ceil(AC.sampleRate * Math.min(6, secs)));
    if (!_noiseCache || _noiseCache.ac !== AC || _noiseCache.buf.length < n) {
      var len = Math.max(n, Math.ceil(AC.sampleRate * 2));
      var b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
      /* deterministic noise: the same crunch every time, so a fingerprint means
         something and a judged sound cannot drift under him */
      var rr = rng(0x9E3779B9);
      for (var i = 0; i < len; i++) d[i] = rr() * 2 - 1;
      _noiseCache = { ac: AC, buf: b };
    }
    return _noiseCache.buf;
  }

  function crushCurve(amt) {
    var steps = Math.max(2, Math.round(2 + (1 - amt) * 46));
    var n = 1024, c = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var x = (i / (n - 1)) * 2 - 1;
      c[i] = Math.round(x * steps) / steps;
    }
    return c;
  }

  var RATIOS = { metal: [1, 1.414, 1.93, 2.71, 3.42] };

  function voice(v, AC, dest, t, hold) {
    var A = v.atk * BEAT, H = v.hold * BEAT, D = v.dec * BEAT, life = A + H + D;
    var end = t + life;

    var env = AC.createGain();
    env.gain.setValueAtTime(0.0001, t);
    if (A > 0.0015) env.gain.linearRampToValueAtTime(1, t + A);
    else env.gain.linearRampToValueAtTime(1, t + 0.0015);
    env.gain.setValueAtTime(1, t + A + H);
    env.gain.exponentialRampToValueAtTime(0.0006, end);
    env.gain.linearRampToValueAtTime(0, end + 0.004);   /* to ACTUAL zero: nothing rings */

    var f = AC.createBiquadFilter();
    f.type = (v.ftype === 'lp') ? 'lowpass' : (v.ftype === 'hp' ? 'highpass' : 'bandpass');
    f.Q.value = Math.max(0.0001, v.res);
    var c0 = clamp(v.cut, 40, 18000), c1 = clamp(v.cut * v.sweep, 40, 18000);
    f.frequency.setValueAtTime(c0, t);
    f.frequency.exponentialRampToValueAtTime(c1, end);

    /* MAKEUP GOES AFTER THE FILTER AND AFTER THE CRUSHER, which is where makeup
       gain belongs on any real synth. It sat before them in the first cut and
       the measurement caught it: a WaveShaper curve is defined over -1..1 and
       CLAMPS anything past it, so driving a crushed voice hotter did not make it
       louder, it hard-clipped four of the five PICKUP candidates to exactly the
       output gain and flattened their character. Compensate for what the filter
       took, downstream of everything that shapes the sound. */
    var mk = AC.createGain(); mk.gain.value = v.mkup; mk.connect(env);
    var head = f;
    if (v.crush > 0.02) {
      var ws = AC.createWaveShaper();
      ws.curve = crushCurve(v.crush);
      f.connect(ws); ws.connect(mk);
    } else f.connect(mk);

    var tailNode = env;
    if (v.trem > 0.01 && v.tremD > 0.01) {
      var tg = AC.createGain();
      tg.gain.value = 1 - v.tremD * 0.5;
      var lfo = AC.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = v.trem;
      var lg = AC.createGain(); lg.gain.value = v.tremD * 0.5;
      lfo.connect(lg); lg.connect(tg.gain);
      lfo.start(t); lfo.stop(end + 0.02); hold.push(lfo);
      env.connect(tg); tailNode = tg;
    }
    tailNode.connect(dest);

    var toneAmt = 1 - v.noise, noiseAmt = v.noise;

    if (toneAmt > 0.01 && v.src !== 'noise') {
      var tg2 = AC.createGain(); tg2.gain.value = toneAmt; tg2.connect(head);
      var ratios = (v.src === 'metal') ? RATIOS.metal.slice(0, Math.max(2, v.body)) : null;
      var count = ratios ? ratios.length : v.body;
      for (var i = 0; i < count; i++) {
        var o = AC.createOscillator();
        o.type = (v.src === 'sq' || v.src === 'metal') ? 'square'
               : (v.src === 'saw' ? 'sawtooth' : (v.src === 'tri' ? 'triangle' : 'sine'));
        var mul = ratios ? ratios[i] : (1 + (i - (count - 1) / 2) * v.det);
        var h0 = clamp(v.hz * mul, 12, 20000);
        var h1 = clamp(h0 * Math.pow(2, v.slide / 12), 12, 20000);
        o.frequency.setValueAtTime(h0, t);
        if (v.jump !== 0 && v.jumpAt * BEAT < life) {
          var tj = t + v.jumpAt * BEAT;
          var hj = clamp(h0 * Math.pow(2, v.jump / 12), 12, 20000);
          o.frequency.setValueAtTime(h0, tj);
          o.frequency.exponentialRampToValueAtTime(hj, tj + 0.004);
          o.frequency.exponentialRampToValueAtTime(clamp(hj * Math.pow(2, v.slide / 12), 12, 20000), end);
        } else {
          o.frequency.exponentialRampToValueAtTime(h1, end);
        }
        if (v.vib > 0.01 && v.vibD > 0.01) {
          var vo = AC.createOscillator(); vo.type = 'sine'; vo.frequency.value = v.vib;
          var vg = AC.createGain(); vg.gain.value = h0 * (Math.pow(2, v.vibD / 1200) - 1);
          vo.connect(vg); vg.connect(o.frequency);
          vo.start(t); vo.stop(end + 0.02); hold.push(vo);
        }
        var og = AC.createGain(); og.gain.value = 1 / Math.max(1, count);
        o.connect(og); og.connect(tg2);
        o.start(t); o.stop(end + 0.02); hold.push(o);
      }
    }

    if (noiseAmt > 0.01 || v.src === 'noise') {
      var amt = (v.src === 'noise') ? 1 : noiseAmt;
      var ns = AC.createBufferSource();
      ns.buffer = noiseBuf(AC, life + 0.05);
      var ng = AC.createGain(); ng.gain.value = amt * 0.8;
      ns.connect(ng); ng.connect(head);
      ns.start(t); ns.stop(end + 0.02); hold.push(ns);
    }

    return end;
  }

  /* render one candidate onto a context. `when` is an absolute AC time; the
     caller (the run, the judge page, the gate) decides whether that is the
     next beat or right now. */
  function render(vec, AC, dest, when) {
    var v = sanitize(vec);
    var t0 = (when == null) ? AC.currentTime + 0.02 : when;
    var out = AC.createGain();
    out.gain.value = v.gain;
    if (AC.createStereoPanner && Math.abs(v.pan) > 0.001) {
      var p = AC.createStereoPanner(); p.pan.value = clamp(v.pan, -1, 1);
      out.connect(p); p.connect(dest);
    } else out.connect(dest);

    var hold = [], last = t0;
    for (var i = 0; i < v.hits.length; i++) {
      var e = voice(v, AC, out, t0 + v.hits[i] * BEAT, hold);
      if (e > last) last = e;
    }
    /* NOTHING OUTLIVES ITSELF: every node is dropped a beat after the tail.
       ONLY ON A REALTIME CONTEXT. An OfflineAudioContext renders faster than the
       wall clock, so a wall-clock timer set here lands in the MIDDLE of its own
       render and tears the graph down under itself — which is exactly how the
       first run of gates/sfx_render_gate.py caught this: eight candidates came
       out different on the second render. Offline graphs are discarded whole
       when the context is, so there is nothing to clean up. */
    var offline = (typeof AC.startRendering === 'function');
    var kill = (last - AC.currentTime + BEAT) * 1000;
    if (!offline && typeof setTimeout === 'function') setTimeout(function () {
      for (var j = 0; j < hold.length; j++) { try { hold[j].disconnect(); } catch (e) {} }
      try { out.disconnect(); } catch (e) {}
    }, Math.max(60, kill));
    return { t0: t0, end: last, beats: beatsOf(v) };
  }

  /* ---- THE BANK (MECHANISM-MINE / CONTENTS-PAOLO'S) -------------------- */
  /* event -> the ONE approved vector. EMPTY. It is filled from a verdict file
     in records/, never from a session's taste. play() on an unbanked event is
     silent ON PURPOSE: the game makes no sound Paolo did not choose. */
  var BANK = {};

  function bankOf(ev) { return BANK[ev] || null; }
  function setBank(table) { BANK = {}; for (var k in table) if (table.hasOwnProperty(k)) BANK[k] = sanitize(table[k]); }

  /* the in-game call. AC/dest come from whoever owns the audio (the studio). */
  function play(ev, AC, dest, when) {
    var v = BANK[ev];
    if (!v || !AC || !dest) return null;      /* unjudged = silent */
    return render(v, AC, dest, when);
  }

  return {
    BEAT: BEAT, TICK: TICK, SPEC: SPEC, FIELDS: FIELDS, EVENTS: EVENTS, RECIPE: RECIPE,
    BANK: BANK, q: q, sanitize: sanitize, validate: validate, serialize: serialize,
    beatsOf: beatsOf, durSec: durSec, cook: cook, batch: batch,
    render: render, play: play, bankOf: bankOf, setBank: setBank,
    hashStr: hashStr, rng: rng
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_SFX;
