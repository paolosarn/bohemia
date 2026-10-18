/* BOHEMIA -- THE CHIP SONG ENGINE (SOUNDS, 10/18, row [a new song every round]).
   Paolo 10/18: 'I haven't heard a new song that was made in a long time... what's up?' The row: a new song every
   round, a real melody he can hum, 120 BPM, made the 8-bit way (his word, 'he likes 8-bit'): clean NES-style chip,
   two pulse voices with the four duty widths, a triangle bass, LFSR noise drums, four voices like the console's four
   channels, a gain envelope on every note, the high-pass on all but the bass, a gentle low-pass on the pulses, NO bit
   crushing, no heavy compression, no muddy low end. The analog horror is in the melody and the mood, never in
   grinding the sound.

   THE VOICES, AS THE NES MADE THEM (the 2A03's own numbers):
     PULSE    a band-limited PeriodicWave per duty (12.5, 25, 50, 75 percent), its Fourier series in closed form:
              a pulse high for a fraction d of the period has cos terms sin(2 pi n d) * 2/(n pi) and sin terms
              (1 - cos(2 pi n d)) * 2/(n pi), every harmonic (the gaps fall where they fall: every 4th at 25 percent).
              The browser band-limits a PeriodicWave per pitch, so nothing aliases. A new oscillator per note, so a
              duty change lands exactly on its note.
     TRIANGLE the 2A03's 32-step, 4-bit staircase (15 down to 0, 0 back up to 15), read into a PeriodicWave by a DFT
              of the staircase, so the bass carries the console's own soft buzz. It has no volume on the chip, so
              here it is on or off, gated by a 3 ms rise and a 15 ms fall so it never clicks.
     NOISE    the 15-bit LFSR, seeded 1, shifted right with feedback into bit 14: bit 0 XOR bit 1 (long mode) or bit 0
              XOR bit 6 (short, metallic); clocked at the NTSC CPU's 1.789773 MHz over the 16-entry period table.
     VOLUME   the way a NES driver moves it: a sequence of the 16 levels (0 to 15), one level a frame at 60 Hz, the
              last level held; a 12 ms ramp to zero at the note's end (declick). Never a free curve.
   THE CLOCK: one look-ahead scheduler on the audio clock (a 25 ms tick, 100 ms ahead), so a busy main thread never
   moves a note; an OfflineAudioContext renders the same song note for note (the gate measures it that way).

   THE SONG IS DATA (rule 38g, mods): a JSON file a person can read and edit, a tracker grid of 16 steps a bar:
     { id, title, bpm, steps_per_bar: 16, voices: { name: { kind: 'pulse'|'triangle'|'noise', duty, vol, env } },
       patterns: { name: { voice: 'C5 . E5 - ...' } }, order: [ pattern names, one per bar ] }
     a note is a pitch (C#5, Bb3) that holds through the dots after it, '-' stops it; the drums line names hits.
   const C = BOH_CHIP.make(ctx, destination, song, { tape: 0 | 1 });
   C.play({ loop: true }); C.stop();                 // live, on the look-ahead clock
   C.renderAll(fromBar, toBar);                      // offline: every note scheduled at once */
(function (root) {
  'use strict';
  var NUM = {
    TICK_MS: 25, AHEAD: 0.1,                            /* the look-ahead scheduler */
    CPU: 1789773,                                       /* NTSC 2A03 */
    NOISE_PERIODS: [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068],
    DUTIES: [0.125, 0.25, 0.5, 0.75],
    HARMONICS: 96, FRAME: 1 / 60, DECLICK: 0.012, TRI_GATE: [0.003, 0.015],
    HP_HZ: 90, LP_PULSE_HZ: 12000,                      /* high-pass all but the bass; a gentle low-pass on the pulses */
    MASTER: 0.5,
    TAPE: { WOW_HZ: 0.45, WOW_CENTS: 7, FLUTTER_HZ: 5.8, FLUTTER_CENTS: 2, LP_HZ: 6000 }   /* the worn tape: a pitch drift and a duller top, never a crush */
  };
  var NAMES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(note) {
    var m = /^([A-G])([#b]?)(-?\d)$/.exec(note); if (!m) return null;
    return NAMES[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12;
  }
  function hz(note) { var k = midi(note); return k === null ? 0 : 440 * Math.pow(2, (k - 69) / 12); }

  var waves = new WeakMap();
  function bank(ctx) {
    var w = waves.get(ctx); if (w) return w;
    w = { pulse: {}, tri: null, noise: {} };
    NUM.DUTIES.forEach(function (d) {
      var N = NUM.HARMONICS, re = new Float32Array(N + 1), im = new Float32Array(N + 1);
      for (var n = 1; n <= N; n++) { re[n] = Math.sin(2 * Math.PI * n * d) * 2 / (n * Math.PI); im[n] = (1 - Math.cos(2 * Math.PI * n * d)) * 2 / (n * Math.PI); }
      w.pulse[d] = ctx.createPeriodicWave(re, im);
    });
    var S = 32, L = 2048, x = new Float32Array(L), i, n;
    for (i = 0; i < L; i++) { var st = Math.floor(i * S / L), v = st < 16 ? 15 - st : st - 16; x[i] = (v - 7.5) / 7.5; }
    var NH = 64, tr = new Float32Array(NH + 1), ti = new Float32Array(NH + 1);
    for (n = 1; n <= NH; n++) { var a = 0, b = 0; for (i = 0; i < L; i++) { var ph = 2 * Math.PI * n * i / L; a += x[i] * Math.cos(ph); b += x[i] * Math.sin(ph); } tr[n] = 2 * a / L; ti[n] = 2 * b / L; }
    w.tri = ctx.createPeriodicWave(tr, ti);
    waves.set(ctx, w);
    return w;
  }
  /* one LFSR noise buffer, a second long, at one period and mode */
  function noiseBuf(ctx, period, short) {
    var w = bank(ctx), key = period + (short ? 's' : 'l'); if (w.noise[key]) return w.noise[key];
    var sr = ctx.sampleRate, len = sr, buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    var reg = 1, rate = NUM.CPU / NUM.NOISE_PERIODS[period], acc = 0, out = 1, tap = short ? 6 : 1;
    for (var i = 0; i < len; i++) {
      acc += rate / sr;
      while (acc >= 1) { var fb = (reg & 1) ^ ((reg >> tap) & 1); reg = (reg >> 1) | (fb << 14); out = (reg & 1) ? -1 : 1; acc -= 1; }
      d[i] = out;
    }
    w.noise[key] = buf; return buf;
  }

  /* the kit, from the noise and the triangle, the way NES composers built drums from four channels:
     noise period, mode, the volume sequence at 60 Hz, and for the kick and the tom a triangle falling fast */
  var KIT = {
    k: { noise: 12, short: false, env: [15, 10, 6, 3, 1], tri: [150, 45, 0.08] },
    s: { noise: 6, short: false, env: [15, 12, 9, 7, 5, 4, 3, 2, 1] },
    h: { noise: 1, short: false, env: [8, 4, 1] },
    o: { noise: 2, short: true, env: [6, 5, 4, 3, 2, 1] },
    t: { noise: 9, short: false, env: [12, 8, 5, 3, 1], tri: [230, 110, 0.1] }
  };

  function parse(line, steps) {
    var t = String(line || '').trim().split(/\s+/).filter(Boolean), out = [];
    for (var i = 0; i < steps; i++) out.push(t[i] === undefined ? '.' : t[i]);
    return out;
  }
  /* a volume sequence on a gain, from 'at', for 'dur' seconds, then the declick to zero */
  function envelope(g, seq, peak, at, dur, rel) {
    seq = seq && seq.length ? seq : [15];
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(peak * seq[0] / 15, at + 0.002);
    var last = seq[0];
    for (var k = 1; k < seq.length && k * NUM.FRAME < dur; k++) { g.gain.setValueAtTime(peak * seq[k] / 15, at + k * NUM.FRAME); last = seq[k]; }
    g.gain.setValueAtTime(peak * last / 15, at + dur);
    g.gain.linearRampToValueAtTime(0, at + dur + rel);
  }

  function make(ctx, dest, song, opts) {
    opts = opts || {};
    var W = bank(ctx), spb = song.steps_per_bar || 16, stepS = 60 / song.bpm / (spb / 4);
    var level = NUM.MASTER * (opts.gain === undefined ? 1 : opts.gain);
    var master = ctx.createGain(); master.gain.value = level;
    if (opts.tape) { var tl = ctx.createBiquadFilter(); tl.type = 'lowpass'; tl.frequency.value = NUM.TAPE.LP_HZ; tl.Q.value = 0.4; master.connect(tl); tl.connect(dest); }
    else master.connect(dest);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = NUM.LP_PULSE_HZ; lp.Q.value = 0.5;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = NUM.HP_HZ; hp.Q.value = 0.5;
    lp.connect(hp); hp.connect(master);                 /* the pulses: low-pass, then high-pass */
    var hpN = ctx.createBiquadFilter(); hpN.type = 'highpass'; hpN.frequency.value = NUM.HP_HZ; hpN.Q.value = 0.5; hpN.connect(master);   /* the noise */
    var bassBus = ctx.createGain(); bassBus.connect(master);   /* the triangle skips the high-pass: it IS the bottom */
    var drift = null;
    if (opts.tape) {                                    /* the worn tape: one slow drift and one flutter on every pitched voice, in cents */
      drift = ctx.createGain(); drift.gain.value = 1;
      var wow = ctx.createOscillator(), wg = ctx.createGain(); wow.frequency.value = NUM.TAPE.WOW_HZ; wg.gain.value = NUM.TAPE.WOW_CENTS; wow.connect(wg); wg.connect(drift);
      var fl = ctx.createOscillator(), fg = ctx.createGain(); fl.frequency.value = NUM.TAPE.FLUTTER_HZ; fg.gain.value = NUM.TAPE.FLUTTER_CENTS; fl.connect(fg); fg.connect(drift);
      wow.start(); fl.start();
    }
    var hits = 0;
    var S = {
      NUM: NUM, song: song, stepS: stepS, barS: stepS * spb, timer: null, bar: 0, playing: false, log: [],
      note: function (vname, v, f, at, dur) {
        var o = ctx.createOscillator(), g = ctx.createGain(), tri = v.kind === 'triangle';
        o.setPeriodicWave(tri ? W.tri : W.pulse[v.duty || 0.5]);
        o.frequency.setValueAtTime(f, at);
        var rel = tri ? NUM.TRI_GATE[1] : NUM.DECLICK;
        if (tri) { g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v.vol, at + NUM.TRI_GATE[0]); g.gain.setValueAtTime(v.vol, at + dur); g.gain.linearRampToValueAtTime(0, at + dur + rel); }
        else envelope(g, v.env, v.vol, at, dur, rel);
        if (v.vibrato && dur > v.vibrato.after + 0.05) {    /* the vibrato waits for the note to settle, the way a singer's does */
          var lf = ctx.createOscillator(), lg = ctx.createGain(); lf.frequency.value = v.vibrato.hz;
          lg.gain.setValueAtTime(0, at); lg.gain.setValueAtTime(0, at + v.vibrato.after); lg.gain.linearRampToValueAtTime(v.vibrato.cents, at + v.vibrato.after + 0.25);
          lf.connect(lg); lg.connect(o.detune); lf.start(at); lf.stop(at + dur + rel + 0.02);
        }
        if (drift) drift.connect(o.detune);
        o.connect(g); g.connect(tri ? bassBus : lp);
        o.start(at); o.stop(at + dur + rel + 0.01);
        this.log.push({ v: vname, f: Math.round(f * 100) / 100, at: Math.round(at * 1000) / 1000, dur: Math.round(dur * 1000) / 1000 });
        if (this.log.length > 8192) this.log.shift();
      },
      drum: function (vname, v, hit, at) {
        var k = KIT[hit]; if (!k) return;
        var s = ctx.createBufferSource(), g = ctx.createGain(), dur = k.env.length * NUM.FRAME;
        s.buffer = noiseBuf(ctx, k.noise, k.short);
        envelope(g, k.env, v.vol, at, dur, NUM.DECLICK);
        s.connect(g); g.connect(hpN); s.start(at, ((hits++ * 0.137) % 0.8)); s.stop(at + dur + NUM.DECLICK + 0.01);
        if (k.tri) {
          var o = ctx.createOscillator(), og = ctx.createGain(); o.setPeriodicWave(W.tri);
          o.frequency.setValueAtTime(k.tri[0], at); o.frequency.exponentialRampToValueAtTime(k.tri[1], at + k.tri[2]);
          og.gain.setValueAtTime(0, at); og.gain.linearRampToValueAtTime(v.vol * 1.4, at + 0.002); og.gain.setValueAtTime(v.vol * 1.4, at + k.tri[2]); og.gain.linearRampToValueAtTime(0, at + k.tri[2] + NUM.TRI_GATE[1]);
          o.connect(og); og.connect(bassBus); o.start(at); o.stop(at + k.tri[2] + NUM.TRI_GATE[1] + 0.01);
        }
        this.log.push({ v: vname, hit: hit, at: Math.round(at * 1000) / 1000 });
      },
      layBar: function (b, at) {
        var self = this, P = song.patterns[song.order[b % song.order.length]] || {};
        Object.keys(song.voices).forEach(function (vn) {
          var v = song.voices[vn], cells = parse(P[vn], spb);
          if (v.kind === 'noise') { cells.forEach(function (c, i) { if (c !== '.' && c !== '-') c.split('').forEach(function (h) { self.drum(vn, v, h, at + i * stepS); }); }); return; }
          for (var i = 0; i < spb; i++) {
            var c = cells[i]; if (c === '.' || c === '-') continue;
            var f = hz(c); if (!f) continue;
            var j = i + 1; while (j < spb && cells[j] === '.') j++;   /* a note holds to the next note or stop, never past its bar */
            self.note(vn, v, f, at + i * stepS, (j - i) * stepS * (v.legato === undefined ? 0.92 : v.legato));
          }
        });
      },
      play: function (o) {
        o = o || {}; var self = this; this.stop(true); this.playing = true; this.bar = o.fromBar || 0;
        master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(level, ctx.currentTime);
        var next = ctx.currentTime + 0.08, loop = o.loop !== false;
        (function tick() {
          if (!self.playing) return;
          while (next < ctx.currentTime + NUM.AHEAD) {
            if (!loop && self.bar >= song.order.length) { self.playing = false; return; }
            self.layBar(self.bar, next); self.bar++; next += self.barS;
          }
          self.timer = setTimeout(tick, NUM.TICK_MS);
        })();
      },
      stop: function (quiet) {
        this.playing = false; if (this.timer) clearTimeout(this.timer); this.timer = null;
        if (quiet) return;
        try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15); } catch (_e) {}
      },
      renderAll: function (from, to) { from = from || 0; for (var b = from; b < (to === undefined ? song.order.length : to); b++) this.layBar(b, 0.05 + (b - from) * this.barS); },
      seconds: function () { return song.order.length * this.barS; }
    };
    return S;
  }

  root.BOH_CHIP = { NUM: NUM, KIT: KIT, hz: hz, midi: midi, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
