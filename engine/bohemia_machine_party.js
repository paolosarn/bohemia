/* ============================================================================
   BOHEMIA -- THE MACHINE PARTY: a real machine that plays inside his songs (SOUNDS, 10/19/26, row [the machine party])

   RULE 121(k), PAOLO 10/19: 'Remodel everything 3D grimey Crashbox analog horror machine party vibes. And the music too
   man.' RULE 119: a song is made with his songs' own machine (MLOOPS, synthV, drumV, SONG_ARR), read and reused, never
   edited. So this file adds no note and no voice. His engine (MUS.playStep) plays his row exactly as the map plays it;
   this file listens to what his engine does and a real machine answers, from recordings of real machines
   (slices/vote/songs/machine_party_kit/, cut by tools/bohemia_sounds_machine_party.py, CC0 at the source):

     THE PRESS   every time his kick sounds, a coupling slams between two train wagons, on the same sample clock time.
     THE RELAY   every time his hat sounds, a Soviet electromechanical clock ticks.
     THE PARTY   in his D sections (the full) the press also lands on beats two and four, so the half-time groove
                 stamps four to the bar; steel on steel answers at the end of every other bar.
     THE MOTOR   under the whole song a washing machine's motor whines on the song's own root, and when his SONG_ROOT
                 moves the song (every four bars) the motor changes speed with it: the machine changes gear.
     THE HALL    (spec.hall) one concrete hall around everything, the machine wetter than the music, then a worn tape
                 (spec.tape: a head bump, a soft tanh, wow and flutter on a delay line, a gentle 2:1, a 9 kHz top):
                 one grime over every part, Klubnika's 'dirty and grimy leaks to every corner, which blends everything
                 together'. No noise is added anywhere: the only hiss is the machines'. NO SAND, no crush.

   Nothing here runs unless MACHINEPARTY.attach() is called, and detach() puts drumV and MUS.playStep back exactly. The
   alpha does not load this file until his YES (a CUE row, RUN's, rule 93).

     MACHINEPARTY.load(AC, base)         -> Promise: the kit decoded (base: the kit folder's URL, ends in '/')
     MACHINEPARTY.loadFrom(AC, bytes)    -> Promise: the same from {name: ArrayBuffer} (the recorder, offline)
     MACHINEPARTY.chain(AC, dest, spec)  -> { input, machine }: where the music and the machine go in
     MACHINEPARTY.attach(spec, bus)      wraps drumV and MUS.playStep; bus = { music, machine } nodes
     MACHINEPARTY.detach()
     MACHINEPARTY.log                    [[what, t, step, section]] for the gate
   ========================================================================== */
(function (G) {
  'use strict';
  var KIT = ['press_1', 'press_2', 'relay_1', 'relay_2', 'relay_3', 'clank_1', 'clank_2', 'bed', 'hall'];
  var MP = { kit: {}, on: false, spec: null, bus: null, log: [], _dv: null, _ps: null, _bed: null, _n: { press: 0, relay: 0, clank: 0 } };

  MP.loadFrom = function (AC, bytes) {
    return Promise.all(KIT.map(function (k) {
      return new Promise(function (res, rej) { AC.decodeAudioData(bytes[k].slice(0), function (b) { MP.kit[k] = b; res(); }, rej); });
    }));
  };
  MP.load = function (AC, base) {
    var bytes = {};
    return Promise.all(KIT.map(function (k) {
      return fetch(base + k + '.wav').then(function (r) { if (!r.ok) throw new Error(k + ' ' + r.status); return r.arrayBuffer(); }).then(function (ab) { bytes[k] = ab; });
    })).then(function () { return MP.loadFrom(AC, bytes); });
  };

  function hit(AC, name, t, gain, dest) {
    var s = AC.createBufferSource(), g = AC.createGain();
    s.buffer = MP.kit[name]; g.gain.value = gain; s.connect(g); g.connect(dest); s.start(t);
  }
  function take(kind, n) { var i = MP._n[kind]++ % n; return kind + '_' + (i + 1); }

  /* THE HALL AND THE TAPE. dest is where the finished sound goes; spec.hall/spec.tape off gives the clean take. */
  MP.chain = function (AC, dest, spec) {
    var music = AC.createGain(), machine = AC.createGain(), mix = AC.createGain();
    music.connect(mix); machine.connect(mix);
    if (spec.hall) {
      var cv = AC.createConvolver(); cv.buffer = MP.kit.hall;
      var sm = AC.createGain(), sx = AC.createGain(); sm.gain.value = spec.hall.music; sx.gain.value = spec.hall.machine;
      music.connect(sm); machine.connect(sx); sm.connect(cv); sx.connect(cv); cv.connect(mix);
    }
    if (!spec.tape) { mix.connect(dest); return { input: music, machine: machine }; }
    var T = spec.tape;
    var shelf = AC.createBiquadFilter(); shelf.type = 'lowshelf'; shelf.frequency.value = 110; shelf.gain.value = T.bump_db;
    var sat = AC.createWaveShaper(), N = 2048, c = new Float32Array(N), th = Math.tanh(T.drive);
    for (var i = 0; i < N; i++) { var x = i / (N - 1) * 2 - 1; c[i] = Math.tanh(T.drive * x) / th; }
    sat.curve = c; sat.oversample = '2x';
    /* wow and flutter: a delay line whose length wanders; a speed change of w at f Hz is a delay swing of w / (2 pi f) */
    var dl = AC.createDelay(0.05); dl.delayTime.value = 0.006;
    [[T.wow_hz, T.wow], [T.flutter_hz, T.flutter]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = p[0]; g.gain.value = p[1] / (2 * Math.PI * p[0]);
      o.connect(g); g.connect(dl.delayTime); o.start(0);
    });
    var cmp = AC.createDynamicsCompressor(); cmp.threshold.value = -18; cmp.ratio.value = 2; cmp.knee.value = 0; cmp.attack.value = 0.008; cmp.release.value = 0.12;
    var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = T.top_hz; lp.Q.value = 0.707;
    mix.connect(shelf); shelf.connect(sat); sat.connect(dl); dl.connect(cmp); cmp.connect(lp); lp.connect(dest);
    return { input: music, machine: machine };
  };

  /* THE MOTOR for one section of his form: four bars at the speed his key move asks for, faded in and out over 60 ms
     at the joins so a gear change is a change and never a click. */
  function motor(AC, t, dur, semi, gain, dest) {
    var b = MP.kit.bed, s = AC.createBufferSource(), g = AC.createGain();
    s.buffer = b; s.loop = true; s.playbackRate.value = Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.06);
    g.gain.setValueAtTime(gain, t + dur - 0.06); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(g); g.connect(dest); s.start(t, (MP._bedPos = ((MP._bedPos || 0) + 1.37) % (b.duration - 0.1))); s.stop(t + dur + 0.02);
  }

  MP.attach = function (spec, bus) {
    if (MP.on) MP.detach();
    MP.spec = spec; MP.bus = bus; MP.log = []; MP._n = { press: 0, relay: 0, clank: 0 }; MP._bedPos = 0; MP._ctx = null;
    MP._dv = G.drumV; MP._ps = MUS.playStep;
    var dv = MP._dv, ps = MP._ps;
    G.drumV = function (kind, AC, MAST, t) {
      var r = dv.apply(this, arguments), f = MUS.fac(), c = MP._ctx;
      if (!MP.on || !c) return r;
      if (kind === ((f.kit && f.kit.k) || 'punchk')) {
        hit(AC, take('press', 2), t, c.fill ? spec.press.fill : spec.press.gain, bus.machine); MP.log.push(['press', t, c.s, c.sec]);
      } else if (kind === ((f.kit && f.kit.h) || 'tight')) {
        hit(AC, take('relay', 3), t, spec.relay.gain, bus.machine); MP.log.push(['relay', t, c.s, c.sec]);
      }
      return r;
    };
    MUS.playStep = function (s, t, sc) {
      sc = sc || { sec: 'A', rs: 0, fill: false, barIn: 0, bar: 0 };
      var held = MUS.drumsHeld(), f = MUS.fac(), AC = MUS.AC, sd = MUS.stepDur();
      MP._ctx = { s: s, sec: sc.sec, fill: sc.fill && s >= 12 && f.kick.indexOf(s) < 0 };
      var r = ps.apply(MUS, arguments);
      MP._ctx = null;
      if (!MP.on) return r;
      if (s === 0 && sc.barIn === 0) {
        var semi = f.scale[sc.rs % f.scale.length] || 0;
        motor(AC, t, 64 * sd, semi, spec.motor.gain * (sc.sec === 'C' ? spec.motor.strip : 1), bus.machine);
        MP.log.push(['motor', t, s, sc.sec, semi]);
      }
      if (held) return r;
      var P = spec.party;
      if (P.sections.indexOf(sc.sec) >= 0 && P.steps.indexOf(s) >= 0 && f.kick.indexOf(s) < 0) {
        hit(AC, take('press', 2), t, P.gain, bus.machine); MP.log.push(['party', t, s, sc.sec]);
      }
      var K = spec.clank;
      if (K.sections.indexOf(sc.sec) >= 0 && s === K.step && sc.barIn % K.every === K.every - 1) {
        hit(AC, take('clank', 2), t, K.gain, bus.machine); MP.log.push(['clank', t, s, sc.sec]);
      }
      return r;
    };
    MP.on = true;
  };

  MP.detach = function () {
    if (MP._dv) G.drumV = MP._dv;
    if (MP._ps) MUS.playStep = MP._ps;
    MP._dv = MP._ps = null; MP.on = false; MP._ctx = null;
  };

  G.MACHINEPARTY = MP;
})(typeof window !== 'undefined' ? window : globalThis);
