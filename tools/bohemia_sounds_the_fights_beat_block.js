/* ============================================================================
   __THE_FIGHTS_BEAT__ (SOUNDS 10/25/26, rows [the fight's music you can hear] and [three intensities in every song];
   rules 166(e), 167, 168)

   PAOLO 10/25, PLAYING A FIGHT: 'just make sure from now on everything's at 120 BPM... I only hear the sound effects...
   I'm not hearing any music... it doesn't have tempo, doesn't have BPM, doesn't intensify... that's really important to
   me'. The same hour: 'all this music so far is great ambience but it's not great combat music... three intensity is
   like when it's your turn to attack, two when they're attacking, and one when you're in the world map or chilling...
   we have a way we've been doing it'.

   MEASURED BEFORE (tools/bohemia_sounds_fight_music_measure.js, a road fight in the demo on AUTO, the ear on the music,
   the effects and the brickwall at once): the song played the whole fight, 9.4 dB UNDER the effects on the phone
   profile and 5.3 dB under on the computer; its 120 BPM pulse read 1.03 and 1.33 (the onset envelope folded on the
   500 ms beat, against two periods that are not the beat: 1.0 is no beat at all). His engine's kick is a 70 to 48 Hz
   sine for 70 ms, a drum a phone speaker cannot play, and its hats are 15 to 45 ms ticks.

   THE WAY WE HAVE BEEN DOING IT STAYS THE WAY (167(d)): the ladder is window.INTENSITY (KILLMUS), the arrangement is
   MUS.layers committed at the top of the next bar, the fight tells the turn with BOHEMIA_FIGHT_TURN. This block reads
   MUS.layers for the step the transport books, so it plays whatever level the ladder committed, on that step's own
   audio time: on the 120 BPM grid by construction (THE ONE BEAT stamps the same step).

     level 1  MUS.layers 0   the map, a town, chilling: his song exactly as it plays, with a SOFT PULSE under it (a
                             recorded muted bass drum on the beat, a stick or a tick: something to tap a foot to, 168(a))
     level 2  MUS.layers 2   their turn: TENSION. The kit on every beat, a shaker, a cello ostinato in his song's key
     level 3  MUS.layers 4   HIS TURN TO ATTACK: COMBAT MUSIC. A full kit with a backbeat, sixteenths, fills and a crash
                             on the phrase, a driving cello, trombone stabs, and a riff in his song's own lead voice

   EVERY SONG ITS OWN FIGHT (166): each of his nine songs has its own recipe below, its own groove (a train beat, a
   march, a shuffle, a half-time doom that doubles, a four on the floor, war drums), its own kit pieces and its own riff
   in its own scale and voice; a song outside the nine gets one made from its own row.

   ALL OF IT IS RECORDED (166(e), NO SAND): slices/music_kit/fight_kit.mp3 (a muted concert bass drum, two snares, two
   tenor drums, a giant hand drum, a shaker, a tambourine, a brake drum, an anvil, claves, timpani, cymbals), cello_spic
   and trombone_stac: VSCO-2-CE, CC0 1.0, one worn tape baked in at the source (tools/bohemia_sounds_fight_kit.py,
   tools/bohemia_sounds_instrument_sprite.py). The riff plays on his own rack's voice (synthV), so the song stays his.

   THE MUSIC ABOVE THE EFFECTS (168(b)): from the board coming up to the fight's end a lift (+6 dB) sits between the
   music master and his MUSIC slider, ramped on the bar; his slider still moves it, and at 0 it is still silence. The
   fight never plays without music: a fight that opens on a stopped transport starts one of his songs.

   A CHANGE IS A FILL (the ear hears the turn before the bar lands): with a change pending, the last beat of the bar
   plays a fill toward it (toms into his turn, a scraped cymbal into theirs) and the new level opens on a crash.
   ========================================================================== */
(function () {
  'use strict';
  if (window.FIGHTBEAT) return;
  if (typeof MUS === 'undefined' || !MUS.playStep) return;
  var FB = window.FIGHTBEAT = { state: 'idle', err: null, hits: 0, notes: 0, steps: 0, by: { 1: 0, 2: 0, 3: 0 }, last: 0, fills: 0, entries: 0,
    LIFT_DB: 6, liftOn: false, started: 0, base: 'music_kit/', inst: {}, kit: null, loads: 0, mute: false, cues: 0, turnsSeen: null,
    /* THE MIX, by level, measured against his songs (tools/bohemia_sounds_fight_beat_render.js): the recordings are cut at
       -1 dB and his songs play near -35 dBFS, so the kit is brought down to sit inside them: level 1 a soft pulse under
       the song, level 2 beside it, level 3 over it (the drums and the drive lead the mix, 167(c)) */
    MIX: { drums: { 1: 0.26, 2: 0.3, 3: 0.26 }, inst: { 1: 0.12, 2: 0.16, 3: 0.2 }, voice: { 1: 1, 2: 1, 3: 1.2 } } };

  /* ---------------- the recordings ---------------- */
  function decode(ac, ab) { return new Promise(function (res, rej) { try { var p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); } catch (e) { rej(e); } }); }
  function getJ(u) { return fetch(FB.base + u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.json(); }); }
  function getB(u) { return fetch(FB.base + u).then(function (r) { if (!r.ok) throw new Error(u + ' ' + r.status); return r.arrayBuffer(); }); }
  /* one piece out of the decoded sprite, from its true onset (the decoder's padding moves it a few ms; looked for in 60 ms) */
  function cut(ac, buf, at, dur) {
    var sr = buf.sampleRate, d = buf.getChannelData(0), a = Math.max(0, Math.floor((at - 0.06) * sr)), b = Math.min(d.length, Math.floor((at + 0.06) * sr)), pk = 0, i;
    for (i = a; i < Math.min(d.length, Math.floor((at + dur) * sr)); i++) pk = Math.max(pk, Math.abs(d[i]));
    var on = Math.floor(at * sr);
    for (i = a; i < b; i++) if (Math.abs(d[i]) > pk * 0.05) { on = Math.max(0, i - Math.floor(0.002 * sr)); break; }
    var n = Math.max(1, Math.min(d.length - on, Math.floor(dur * sr))), o = ac.createBuffer(1, n, sr), od = o.getChannelData(0);
    od.set(d.subarray(on, on + n));
    return o;
  }
  FB.load = function (ac) {
    if (FB.state === 'loading' || FB.state === 'ready') return FB.ready();
    FB.state = 'loading'; FB.loads++;
    FB._ready = Promise.all([
      getJ('fight_kit.json').then(function (m) { return getB('fight_kit.mp3').then(function (ab) { return decode(ac, ab); }).then(function (buf) {
        var K = {}; for (var k in m.hits) { var h = m.hits[k]; K[k] = { b: cut(ac, buf, h.at, h.dur), hz: h.hz || null }; } FB.kit = K; }); }),
      ['cello_spic', 'trombone_stac'].reduce(function (p, nm) { return p.then(function () { return getJ(nm + '.json').then(function (m) {
        return getB(nm + '.mp3').then(function (ab) { return decode(ac, ab); }).then(function (buf) {
          FB.inst[nm] = m.notes.map(function (n) { return { midi: n.midi, b: cut(ac, buf, n.at, n.dur) }; }); }); }); }); }, Promise.resolve())
    ]).then(function () { FB.state = 'ready'; }, function (e) { FB.state = 'failed'; FB.err = String(e && e.message || e); });
    return FB._ready;
  };
  FB.ready = function () { return FB._ready || Promise.resolve(); };

  /* ---------------- the buses (one per audio context: an offline render gets its own) ---------------- */
  var BUS = null;
  function bus(ac, mast) {
    if (BUS && BUS.ac === ac && BUS.mast === mast) return BUS;
    var drums = ac.createGain(), glue = ac.createDynamicsCompressor(), pitch = ac.createGain();
    glue.threshold.value = -16; glue.knee.value = 6; glue.ratio.value = 3; glue.attack.value = 0.004; glue.release.value = 0.12;
    var dc = ac.createBiquadFilter(); dc.type = 'highpass'; dc.frequency.value = 20; dc.Q.value = 0.7;   /* his rack's voices can carry DC (see the lift) */
    drums.gain.value = 1; pitch.gain.value = 1;
    drums.connect(glue); glue.connect(mast); pitch.connect(dc); dc.connect(mast);
    BUS = { ac: ac, mast: mast, drums: drums, pitch: pitch };
    return BUS;
  }
  /* THE LIFT: between the music master and his MUSIC slider, live only */
  var LIFT = null;
  function lift() {
    try {
      var ac = MUS.AC; if (!ac || !MUS.MUSVOL || !MUS.MAST) return null;
      if (window.OfflineAudioContext && ac instanceof window.OfflineAudioContext) return null;
      if (LIFT && LIFT.ac === ac && LIFT.mast === MUS.MAST && LIFT.vol === MUS.MUSVOL) return LIFT.g;
      /* AND A DC BLOCKER IN FRONT OF IT. MEASURED: his rack's 'rustlead' voice leaves a DC offset while it sounds, and two of
         his songs carry it (rendered offline: SLOW BLEED at level 2 a mean of -0.73 of full scale, SLOW CREEP -0.07 at
         level 1). Nobody can hear DC, but the game's compressor and brickwall can: they squash the whole song under it. A
         20 Hz high-pass takes out only what is under hearing; his songs sound as they did, with their headroom back. */
      var g = ac.createGain(), dc = ac.createBiquadFilter(); g.gain.value = 1; dc.type = 'highpass'; dc.frequency.value = 20; dc.Q.value = 0.7;
      try { MUS.MAST.disconnect(MUS.MUSVOL); } catch (e) {}
      MUS.MAST.connect(dc); dc.connect(g); g.connect(MUS.MUSVOL);
      LIFT = { ac: ac, mast: MUS.MAST, vol: MUS.MUSVOL, g: g, dc: dc }; window.__FIGHTLIFT = g;
      return g;
    } catch (e) { return null; }
  }
  function inFight() { try { return !!((window.FIGHTMUS && FIGHTMUS.on) || (window.KILLMUS && KILLMUS.nf)); } catch (e) { return false; } }

  /* ---------------- playing a hit, a note ---------------- */
  var MD = 0.1, MI = 0.1, MV = 1;
  function hit(ac, B, name, t, v, rate) {
    v *= MD;
    var k = FB.kit && FB.kit[name]; if (!k || v <= 0) return;
    var s = ac.createBufferSource(), g = ac.createGain(); s.buffer = k.b; if (rate && rate !== 1) s.playbackRate.value = rate;
    g.gain.value = v; s.connect(g); g.connect(B.drums); s.start(Math.max(t, 0)); FB.hits++;
  }
  /* a tuned drum at the song's root (or a degree): the timpani, the toms */
  function tuned(name, midi) { var k = FB.kit && FB.kit[name]; if (!k || !k.hz) return 1; var hz = 440 * Math.pow(2, (midi - 69) / 12), r = hz / k.hz;
    while (r > 1.42) r /= 2; while (r < 0.71) r *= 2; return r; }
  function note(ac, B, inst, midi, t, len, v) {
    var L = FB.inst[inst]; if (!L || !L.length || v <= 0) return; v *= MI;
    var best = L[0]; for (var i = 1; i < L.length; i++) if (Math.abs(L[i].midi - midi) < Math.abs(best.midi - midi)) best = L[i];
    var s = ac.createBufferSource(), g = ac.createGain(); s.buffer = best.b; s.playbackRate.value = Math.pow(2, (midi - best.midi) / 12);
    g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + len); g.gain.linearRampToValueAtTime(0.0001, t + len + 0.06);
    s.connect(g); g.connect(B.pitch); s.start(Math.max(t, 0)); s.stop(t + len + 0.08); FB.notes++;
  }
  /* his rack's own voice, given the step length his tune gives it (a half-time song's notes twice as long), so it sounds
     the way it does in his song */
  function voice(ac, B, kind, midi, t, sdd, v) {
    try { synthV(kind, ac, B.pitch, function (x) { return MUS.noteHz(x); }, sdd, midi - 45, t, v * MV); FB.notes++; } catch (e) {}
  }

  /* ---------------- the patterns ----------------
     A drum pattern is one bar of sixteen steps: X 1.0, x 0.75, o 0.5, - 0.28, . rest. An array cycles bar by bar.
     A note pattern is one bar: a digit (or a to f) is a degree of the song's own scale counted up from its root (past the
     scale's length it climbs an octave), . is a rest; the note lasts to the next one, at most `len` steps. */
  var VEL = { X: 1, x: 0.75, o: 0.5, '-': 0.28 };
  function pick(p, bar) { return typeof p === 'string' ? p : p[((bar % p.length) + p.length) % p.length]; }
  function degMidi(f, base, rs, ch) {
    var d = parseInt(ch, 16); if (isNaN(d)) return null;
    var n = f.scale.length; return base + rs + f.scale[d % n] + 12 * Math.floor(d / n);
  }
  function rootMidi(f) { return 45 + (f.root - 55); }   /* the bass register his engine uses: noteHz(root-55) is this midi */

  /* ---------------- the nine recipes ---------------- */
  var R = {};
  /* REPO MAN (G, 1 2 b3 5 b6, cold piano, the machine party): the repo machine. Their turn a four with the brake drum
     ticking; his turn the backbeat is a brake drum on a snare, the cello pedal jumps the octave, the trombone stabs */
  R['REPO MAN'] = {
    1: [{ h: 'kick_p', p: 'x.......x.......', v: 0.6 }, { h: 'click', p: '....x.......x...', v: 0.62 }, { h: 'kick_pp', p: '....x.......x...', v: 0.45 }],
    2: [{ h: 'kick_mf', p: 'x...x...x...x...', v: 0.62 }, { h: ['shk2', 'shk1'], p: '..x...x...x...x.', v: 0.34 },
        { h: 'brake_p', p: ['...............x', '.............x.x'], v: 0.3 },
        { i: 'cello_spic', p: '0.0.0.0.0.0.4.3.', o: 12, len: 1, v: 0.5 }],
    3: [{ h: 'kick', p: ['X..x..x.X..x....', 'X..x..x.X..x..x.'], v: 0.92 }, { h: 'boom', p: ['X...............', '', '', ''], v: 0.45 },
        { h: 'snare', p: '....X.......X...', v: 0.78 }, { h: 'brake', p: '....x.......x...', v: 0.42 }, { h: 'ghost', p: '.......-......-.', v: 1 },
        { h: ['tamb', 'tamb_p'], p: 'xoxoxoxoxoxoxoxo', v: 0.24 },
        { i: 'cello_spic', p: '0.5.0.5.0.5.4.3.', o: 12, len: 1, v: 0.55 }, { i: 'trombone_stac', p: ['0.....0.........', '..........3.4...'], o: 12, len: 2, v: 0.42 },
        { s: 'lead', p: ['5...4.3...2.3...', '2...0.....2.3.4.'], o: 24, len: 3, v: 0.06 }],
    fillUp: 'toms', fillDown: 'scrape'
  };
  /* GHOST IN THE GRID (F#, dorian-ish, the signal fading): the grid's clock. A soft four; their turn claps and a cello
     arpeggio; his turn an electro four on the floor with an anvil pinging like a dead signal */
  R['GHOST IN THE GRID'] = {
    1: [{ h: 'kick_p', p: 'x...x...x...x...', v: 0.42 }, { h: 'triangle', p: ['x...............', ''], v: 0.22 }],
    2: [{ h: 'kick_mf', p: 'x...x...x...x...', v: 0.6 }, { h: 'snare2_p', p: '....x.......x...', v: 0.38 }, { h: ['shk4', 'shk2'], p: 'o.x.o.x.o.x.o.x.', v: 0.3 },
        { i: 'cello_spic', p: '0.3.5.3.0.3.5.3.', o: 12, len: 1, v: 0.45 }],
    3: [{ h: 'kick', p: 'X...x...X...x.x.', v: 0.9 }, { h: 'snare2', p: '....X.......X...', v: 0.78 }, { h: 'snare_mp', p: '....x.......x..o', v: 0.4 },
        { h: ['shk2', 'shk4'], p: 'xoxoxoxoxoxoxoxo', v: 0.28 }, { h: 'anvil_p', p: ['..............x.', '..............x.', '', '......x.......x.'], v: 0.3 },
        { i: 'cello_spic', p: '0.3.5.3.0.3.6.5.', o: 12, len: 1, v: 0.55 },
        { s: 'lead', p: ['5.5.6.5.3...2.3.', '0.....2.3.5.....'], o: 24, len: 2, v: 0.06 }],
    fillUp: 'snareroll', fillDown: 'scrape'
  };
  /* CAMPFIRE CONFESSION (C#, minor with a flat seven, the strummed guitar): the campfire turns into a desert train.
     A shaker clock by the fire; their turn a gallop; his turn the train beat with a rimshot crack */
  R['CAMPFIRE CONFESSION'] = {
    1: [{ h: 'kick_p', p: 'x.......x.......', v: 0.6 }, { h: 'war_hand', p: '....x.......x...', v: 0.55 }, { h: 'tshake', p: '..x...x...x...x.', v: 0.3 }],
    2: [{ h: 'kick_f', p: 'x...x...x...x...', v: 0.55 }, { h: ['shk1', 'shk3'], p: 'x.xxx.xxx.xxx.xx', v: 0.24 },
        { i: 'cello_spic', p: '0.0.4.0.0.0.4.3.', o: 12, len: 1, v: 0.45 }],
    3: [{ h: 'kick', p: 'X..xX...X..xX...', v: 0.86 }, { h: 'rimshot', p: '....X.......X...', v: 0.72 }, { h: 'oldsnare_p', p: '..o.......o...o.', v: 0.35 },
        { h: ['shk1', 'shk3'], p: 'xoxxxoxxxoxxxoxx', v: 0.3 }, { h: 'tom_lo', p: ['...............x', '.............xxx'], v: 0.5 },
        { i: 'cello_spic', p: '0.0.3.0.4.0.3.2.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['3.3.4.3.2...0.2.', '3.....2.0.......'], o: 24, len: 2, v: 0.065 }],
    fillUp: 'toms', fillDown: 'timp', swing: true
  };
  /* SATELLITE PRAYER (F#, major pentatonic, the solar hymn): a prayer into war drums. A hand drum on the beat; their
     turn the giant drum and the timpani on his root; his turn tribal toms and a trombone call */
  R['SATELLITE PRAYER'] = {
    1: [{ h: 'war_hand', p: 'x...x...x...x...', v: 0.75 }, { h: 'kick_pp', p: 'x.......x.......', v: 0.7 }, { h: 'triangle', p: ['x...............', ''], v: 0.2 }],
    2: [{ h: 'war', p: 'x...x...x...x...', v: 0.5 }, { h: 'tom_lo_p', p: '......x.......x.', v: 0.42 }, { h: ['shk1', 'shk2'], p: '..x...x...x...x.', v: 0.26 },
        { t: 'timp_lo', p: ['x...............', ''], d: '0', v: 0.45 },
        { i: 'cello_spic', p: '0.0.0.0.0.0.5.5.', o: 12, len: 1, v: 0.42 }],
    3: [{ h: 'war', p: 'X.....x.X.......', v: 0.85 }, { h: 'kick', p: 'x.......x.......', v: 0.6 }, { h: 'snare', p: '....X.......X...', v: 0.7 },
        { h: ['tom_hi', 'tom_lo'], p: ['....x.x.....xxxx', '..x...x...x.x.x.'], v: 0.45 }, { h: 'tamb', p: '..x...x...x...x.', v: 0.28 },
        { i: 'trombone_stac', p: ['0.........3.....', '0.......4...3...'], o: 12, len: 3, v: 0.45 }, { i: 'cello_spic', p: '0.2.3.2.0.2.4.3.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['5...3...4...3...', '2...1...0.......'], o: 24, len: 4, v: 0.06 }],
    fillUp: 'toms', fillDown: 'timp'
  };
  /* SLOW BLEED (G, 1 b2 4 b5 b7, the rusted lead): bleeding out. A lub-dub heartbeat; their turn a half-time doom;
     his turn it doubles into a thrash with the flat second grinding under it */
  R['SLOW BLEED'] = {
    1: [{ h: 'kick_p', p: 'x.x.....x.x.....', v: 0.6 }, { h: 'click2', p: '....x.......x...', v: 0.55 }, { h: 'kick_pp', p: '....x.......x...', v: 0.4 }],
    2: [{ h: 'boom', p: ['x...............', ''], v: 0.5 }, { h: 'kick_mf', p: 'x...x.x.x...x...', v: 0.6 }, { h: 'snare_f', p: '........x.......', v: 0.6 },
        { h: ['shk2', 'shk4'], p: '..x...x...x...x.', v: 0.24 }, { h: 'metal', p: ['..............x.', ''], v: 0.22 },
        { i: 'cello_spic', p: '0.1.0.1.0.1.0.1.', o: 12, len: 1, v: 0.45 }],
    3: [{ h: 'kick', p: 'X.x...x.X.x...x.', v: 0.9 }, { h: 'snare', p: '....X.......X...', v: 0.78 }, { h: 'ghost', p: '.......-.......-', v: 1 },
        { h: ['tamb', 'tamb_p'], p: 'xoxoxoxoxoxoxoxo', v: 0.26 }, { h: 'brake_mf', p: '..............x.', v: 0.4 },
        { i: 'cello_spic', p: '0.0.1.0.0.0.3.1.', o: 12, len: 1, v: 0.55 }, { i: 'trombone_stac', p: ['1.0.............', '........1.0.....'], o: 12, len: 2, v: 0.4 },
        { s: 'lead', p: ['4.3.1.0.....1.3.', '4...3...1...0...'], o: 24, len: 2, v: 0.06 }],
    fillUp: 'snareroll', fillDown: 'scrape'
  };
  /* SLOW CREEP (B, 1 b2 4 b5 b7, the rusted lead): something stalking. A clock ticking; their turn a military snare
     creeping; his turn the march breaks into a charge, snare rolls and tenor drums */
  R['SLOW CREEP'] = {
    1: [{ h: 'click', p: 'x.......x.......', v: 0.65 }, { h: 'click2', p: '....x.......x...', v: 0.6 }, { h: 'kick_p', p: 'x.......x.......', v: 0.55 }, { h: 'kick_pp', p: '....x.......x...', v: 0.4 }],
    2: [{ h: 'oldsnare_p', p: 'x.xxx.x.x.xxx.x.', v: 0.3 }, { h: 'kick_mf', p: 'x.......x.......', v: 0.58 }, { h: 'tom_lo_p', p: '..........x.....', v: 0.42 },
        { i: 'cello_spic', p: '0...0...1...0...', o: 12, len: 3, v: 0.45 }],
    3: [{ h: 'kick', p: 'X...x.x.X...x...', v: 0.86 }, { h: 'snare', p: '....X.......X...', v: 0.75 }, { h: 'oldsnare', p: ['.............xxx', '.........x...xxx'], v: 0.38 },
        { h: ['tom_hi', 'tom_lo'], p: '..x...x...x.....', v: 0.42 }, { h: 'tshake', p: '..x...x...x...x.', v: 0.3 },
        { i: 'trombone_stac', p: '0.....0.1.......', o: 12, len: 2, v: 0.4 }, { i: 'cello_spic', p: '0.0.1.0.0.0.5.4.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['3...4...3.1.0...', '1.0.....3.4.3...'], o: 24, len: 3, v: 0.06 }],
    fillUp: 'snareroll', fillDown: 'timp'
  };
  /* THE ORGAN IN THE DROWNED CHAPEL (D, minor with a flat seven, the hollow vowel): the drowned church. A tenor drum
     tuned to his root like a far bell; their turn the timpani on root and fifth; his turn gothic: kit, timpani, trombones */
  R['THE ORGAN IN THE DROWNED CHAPEL'] = {
    1: [{ t: 'tom_lo_p', p: 'x...x...x...x...', d: '0', v: 0.6 }, { h: 'kick_pp', p: 'x.......x.......', v: 0.7 }],
    2: [{ t: 'timp_lo', p: 'x.....x.........', d: '0', v: 0.45 }, { t: 'timp_hi', p: '........x.......', d: '3', v: 0.35 }, { h: 'kick_mf', p: 'x...x...x...x...', v: 0.45 },
        { h: 'metal', p: ['............x...', ''], v: 0.2 }, { i: 'cello_spic', p: '0.3.0.3.0.3.4.3.', o: 12, len: 1, v: 0.45 }],
    3: [{ h: 'kick', p: 'X..x..x.X..x..x.', v: 0.85 }, { h: 'snare', p: '....X.......X...', v: 0.74 }, { t: 'timp_lo', p: 'x.........x.....', d: '0', v: 0.55 },
        { h: 'tamb', p: '..x...x...x...x.', v: 0.25 },
        { i: 'trombone_stac', p: ['0.......3.....4.', '0...........2...'], o: 12, len: 4, v: 0.45 }, { i: 'cello_spic', p: '0.0.3.0.0.0.4.5.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['5...4...3...2.3.', '4...3...0.......'], o: 24, len: 4, v: 0.06 }],
    fillUp: 'timproll', fillDown: 'scrape'
  };
  /* THE PIT BOSS IS GONE (G, 1 2 b3 5 b6, the roulette ghost): the casino after the money died. A brushed shuffle;
     their turn a cross-stick and a ride; his turn a swung big band hitting back, trombone hits and a walking cello */
  R['THE PIT BOSS IS GONE'] = {
    1: [{ h: ['shk3', 'shk1'], p: 'x...x...x...x...', v: 0.36 }, { h: 'kick_pp', p: 'x.......x.......', v: 0.6 }],
    2: [{ h: 'kick_mf', p: 'x.......x.......', v: 0.52 }, { h: 'oldrim', p: '....x.......x...', v: 0.38 }, { h: 'metal', p: 'x.x.x.x.x.x.x.x.', v: 0.12 },
        { i: 'cello_spic', p: ['0...2...3...4...', '3...2...1...0...'], o: 12, len: 3, v: 0.45 }],
    3: [{ h: 'kick', p: 'X.....x.X.....x.', v: 0.85 }, { h: 'snare', p: '....X.......X...', v: 0.75 }, { h: 'ghost', p: '..-...-...-...-.', v: 1 },
        { h: 'metal', p: 'x.x.x.x.x.x.x.x.', v: 0.16 }, { h: 'tamb_p', p: '..x...x...x...x.', v: 0.24 },
        { i: 'trombone_stac', p: ['X.....x.........', '..........X.x...'], o: 12, len: 2, v: 0.5 }, { i: 'cello_spic', p: '0.2.3.2.4.3.2.0.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['5.4.3...2.3.4...', '3...2...0.......'], o: 24, len: 2, v: 0.06 }],
    fillUp: 'toms', fillDown: 'scrape', shuffle: true
  };
  /* THE VAULT (G, 1 2 b3 5 b6, the dusk organ): steel doors. A slow heavy pulse; their turn a dotted drum and an anvil;
     his turn industrial: anvils and a brake drum on the backbeat */
  R['THE VAULT'] = {
    1: [{ h: 'kick_pp', p: 'x...x...x...x...', v: 0.7 }, { h: 'metal', p: ['x...............', '', '', ''], v: 0.16 }],
    2: [{ h: 'boom', p: ['x...............', ''], v: 0.5 }, { h: 'kick_mf', p: 'x..x..x.x..x..x.', v: 0.52 }, { h: 'anvil_p', p: ['', '............x...'], v: 0.28 },
        { h: ['shk4', 'shk2'], p: '..x...x...x...x.', v: 0.2 }, { i: 'cello_spic', p: '0...0..4.0...3..', o: 12, len: 2, v: 0.45 }],
    3: [{ h: 'kick', p: 'X.xX..x.X.xX..x.', v: 0.9 }, { h: 'snare', p: '....X.......X...', v: 0.72 }, { h: 'brake', p: '....x.......x...', v: 0.48 },
        { h: 'anvil', p: ['..............x.', '......x.......x.'], v: 0.32 }, { h: ['tamb', 'tamb_p'], p: 'xoxoxoxoxoxoxoxo', v: 0.24 },
        { i: 'trombone_stac', p: ['X.x.....X.x.....', '0...........4...'], o: 12, len: 2, v: 0.45 }, { i: 'cello_spic', p: '0.0.4.3.0.0.2.3.', o: 12, len: 1, v: 0.5 },
        { s: 'lead', p: ['5...4.3.4...3...', '2.3.4...0.......'], o: 24, len: 3, v: 0.06 }],
    fillUp: 'toms', fillDown: 'timp'
  };
  /* ANY OTHER SONG: one made from its own row (its kick and hats for the pulse, its scale for the cello) */
  function generic(f) {
    var k = '', h = '';
    for (var s = 0; s < 16; s++) { k += (s % 4 === 0) ? 'x' : '.'; h += (f.hat && f.hat.indexOf(s) >= 0) ? 'x' : '.'; }
    return {
      1: [{ h: 'kick_p', p: k, v: 0.48 }, { h: 'click', p: '....x.......x...', v: 0.36 }],
      2: [{ h: 'kick_mf', p: 'x...x...x...x...', v: 0.6 }, { h: ['shk1', 'shk2'], p: '..x...x...x...x.', v: 0.3 }, { i: 'cello_spic', p: '0.0.0.0.0.0.2.1.', o: 12, len: 1, v: 0.45 }],
      3: [{ h: 'kick', p: 'X..x..x.X..x....', v: 0.88 }, { h: 'snare', p: '....X.......X...', v: 0.75 }, { h: ['tamb', 'tamb_p'], p: 'xoxoxoxoxoxoxoxo', v: 0.24 },
          { i: 'cello_spic', p: '0.0.2.0.3.0.2.1.', o: 12, len: 1, v: 0.5 }, { s: 'lead', p: ['4...3...2...1...', '2...1...0.......'], o: 24, len: 3, v: 0.06 }],
      fillUp: 'toms', fillDown: 'scrape'
    };
  }
  FB.recipes = R;
  FB.recipe = function (f) { if (!f) return null; if (f._fight) return f._fight; return R[f.n] || (FB._gen[f.n] = FB._gen[f.n] || generic(f)); };
  FB._gen = {};

  /* ---------------- the fills ---------------- */
  var FILL = {
    toms: [[12, 'tom_hi', 0.5], [13, 'tom_hi', 0.55], [14, 'tom_lo', 0.6], [15, 'tom_lo', 0.7]],
    snareroll: [[12, 'snare_mp', 0.35], [13, 'snare_mp', 0.42], [14, 'snare_f', 0.5], [15, 'snare', 0.62]],
    timproll: [[12, 'timp_lo', 0.35], [13, 'timp_lo', 0.42], [14, 'timp_lo', 0.5], [15, 'timp_lo', 0.6]],
    scrape: [[12, 'scrape', 0.8]],
    timp: [[12, 'timp_lo', 0.55], [14, 'timp_lo', 0.4]]
  };

  /* ---------------- one step ---------------- */
  function lvlOf(x) { return x >= 4 ? 3 : (x >= 2 ? 2 : 1); }
  FB.play = function (f, s, t, sc, layers) {
    var ac = MUS.AC, mast = MUS.MAST; if (!ac || !mast || !FB.kit || !f) return;
    var B = bus(ac, mast), rc = FB.recipe(f); if (!rc || FB.mute) return;
    var L = f.menu ? 1 : lvlOf(layers | 0), parts = rc[L] || [], bar = sc ? (sc.bar | 0) : 0, sd = MUS.stepDur();
    MD = FB.MIX.drums[L]; MI = FB.MIX.inst[L]; MV = FB.MIX.voice[L];   /* into each hit's own gain, so a hit booked ahead keeps its level's mix */
    var rs = (f.scale && sc) ? (f.scale[(sc.rs | 0) % f.scale.length] || 0) : 0, base = rootMidi(f);
    var tt = t;
    if (rc.shuffle && (s % 4 === 2)) tt = t + sd * 0.66;                 /* a swung eighth: two thirds of the beat */
    else if ((rc.swing || f.swing) && (s % 2 === 1)) tt = t + (f.swing || 0.12) * sd * 0.5;   /* his row's own swing, the same as his notes */
    /* the new level opens on a crash; his turn's phrase opens on one every four bars; a fill leads into a pending change */
    if (s === 0) {
      var entering = FB.last && L !== FB.last;
      if (entering && L > 1) { hit(ac, B, L === 3 ? 'crash' : 'crash_p', t, L === 3 ? 0.42 : 0.3); FB.entries++; }
      else if (L === 3 && (bar % 4) === 0) hit(ac, B, 'crash', t, 0.3);
      FB.last = L;
    }
    /* THE TURN IS HEARD ON THE NEXT BEAT, the level on the next bar: the first beat booked after a turn passes plays the
       turn's cue (his: a tenor-drum pickup into a rimshot; theirs: a scraped cymbal over the timpani on his root), so a
       turn shorter than a bar (their men can act in under two seconds) is still heard */
    var K = window.KILLMUS;
    if (K && K.turns !== FB.turnsSeen && (s % 4) === 0) {
      var first = FB.turnsSeen == null; FB.turnsSeen = K.turns;
      if (!first && K.nf) {
        if (K.yourTurn) { hit(ac, B, 'tom_hi', t, 0.55); hit(ac, B, 'tom_lo', t + sd, 0.65); hit(ac, B, 'rimshot', t + sd * 2, 0.55); }
        else if (K.theirTurn) { hit(ac, B, 'scrape', t, 0.75); hit(ac, B, 'timp_lo', t, 0.45, tuned('timp_lo', base + 12 + rs)); }
        FB.cues = (FB.cues | 0) + 1;
      }
    }
    var pend = null; try { pend = window.KILLMUS && KILLMUS.pending ? KILLMUS.pending() : null; } catch (e) {}
    if (pend && s >= 12 && pend.q === 16) {
      var to = lvlOf(pend.want | 0);
      if (to !== L) { var fl = FILL[to > L ? (rc.fillUp || 'toms') : (rc.fillDown || 'scrape')] || [];
        for (var j = 0; j < fl.length; j++) if (fl[j][0] === s) { hit(ac, B, fl[j][1], t, fl[j][2], /^timp/.test(fl[j][1]) ? tuned(fl[j][1], base + 12 + rs) : 1); if (s === 12) FB.fills++; } }
    }
    for (var i = 0; i < parts.length; i++) {
      var P = parts[i], pat = pick(P.p, bar); if (!pat) continue;
      var c = pat.charAt(s); if (!c || c === '.') continue;
      if (P.h || P.t) {
        var v = VEL[c]; if (!v) continue;
        var nm = P.h || P.t; if (typeof nm !== 'string') nm = nm[(s + bar) % nm.length];
        var rate = P.t ? tuned(nm, degMidi(f, base + 12, rs, P.d || '0') || base + 12) : 1;
        hit(ac, B, nm, tt, v * P.v, rate);
      } else {
        var m = degMidi(f, base + (P.o || 0), rs, c); if (m === null) continue;
        /* the note lasts to the next one, at most len steps */
        var n = 1; while (n < (P.len || 1) && s + n < 16 && pat.charAt(s + n) === '.') n++;
        if (P.i) note(ac, B, P.i, m, tt, n * sd * 0.92, P.v);
        else voice(ac, B, MUS.leadVoice((f.inst && f.inst.l) || 'pluck'), m, tt, f.feel === 'half' ? sd * 2 : sd, P.v);
      }
    }
    FB.by[L]++;
  };

  /* ---------------- the hook: after his step (the fence's net and his engine), on the same step ---------------- */
  var inner = MUS.playStep;
  FB.inner = inner;
  FB.step = function (s, t, sc) {
    var F = window.SONGFENCE, n0 = F ? F.notes : 0;
    var r = inner.apply(MUS, arguments);
    try {
      if (F && F.notes === n0) return r;                                /* the fence kept it silent: nothing under silence */
      var ac = MUS.AC; if (!ac) return r;
      if (FB.state === 'idle') FB.load(ac);
      FB.steps++;
      var live = !(window.OfflineAudioContext && ac instanceof window.OfflineAudioContext);
      var g = live ? lift() : null;
      if (g && (MUS.step % 16) === 0) {
        var on = inFight();
        var want = on ? Math.pow(10, FB.LIFT_DB / 20) : 1;
        if (on !== FB.liftOn) { g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(want, t, 0.25); FB.liftOn = on; }
      }
      FB.play(MUS.fac(), s, t, sc, MUS.layers);
    } catch (e) { FB.err = String(e && e.message || e); }
    return r;
  };
  MUS.playStep = FB.step;

  /* ---------------- the fight never plays without music (168(b)) ---------------- */
  try {
    var en = FIGHTMUS.enter;
    FIGHTMUS.enter = function () {
      var r = en.apply(FIGHTMUS, arguments);
      try {
        var mx = window.getMix ? getMix() : null;
        if (!MUS.playing && !(mx && mx.music <= 0)) { if (window.SONGFENCE) SONGFENCE.fix('fight'); MUS.start(); FB.started++; }
      } catch (e) {}
      return r;
    };
  } catch (e) {}
})();
