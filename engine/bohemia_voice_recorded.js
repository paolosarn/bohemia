/* ============================================================================
   THE SQUIGGLE, FROM A RECORDING  (SOUNDS 10/24/26, row [the squiggle, creepier], rule 135)

   Paolo 10/24: 'we have squiggle voices... every time people speak... we might
   have to revamp or upgrade or remake from scratch the squiggle voices; it's
   supposed to be this Animal Crossing style squiggle voice, but maybe it could
   be more creepy.'

   ANIMALESE'S OWN METHOD. A real person recorded saying the sound of every
   letter; the game plays one short clip per letter of the line, re-timed and
   pitched per person. engine/bohemia_voice.js (8/9) could not do that, because
   the demo then forbade audio files, so it built the same object out of formant
   filters on a buzz. Since 9/23 ('no sand, sounds from real material') the
   recording is allowed, and this is the recording:
     slices/voice_heard/squiggle.mp3   one woman (LJ Speech, public domain) cut
                                       into three syllables per letter, rendered
                                       as HIS SIX voice families of 8/11 by
                                       Praat (tools/bohemia_squiggle_from_a_recording.py)
     slices/voice_heard/index.json     every take's [at, dur] per family per letter

   WHO IS SPEAKING. A person is still a voice object from engine/bohemia_voice.js
   (voiceOf, castVoice, speakerVoice: his seed, his f0, his tract, his rate), so
   identity is exactly what it was. This file only says it out loud: the family
   nearest his tract and pitch (his six, the vocal tract weighted first, the way
   the ear tells people apart), then his own pitch inside it (the playback rate,
   Animalese's own knob, at most four semitones), his own speed on the 120 BPM
   grid (4, 5 or 6 letters a beat), his own wobble.

   CREEPIER, INSIDE ANALOG HORROR, NEVER COMEDY (rule 135(c)). The tape is a
   little wrong, always in the same place for the same person saying the same
   words (seeded, never Math.random: a voice you cannot learn is not a person):
     - A SYLLABLE DROPS: the tape lets go of it (heard under a 600 Hz lowpass at
       a sixth of its level), about one letter in forty-five, never the first two
       or the last two.
     - A SYLLABLE DOUBLES: the tape catches and says it again half a step later,
       a little flatter; about one in fifty. Together about one
       wrong thing in a line, never two within six letters.
     - TAPE WOBBLE: the speed wanders under the head, slow (0.55 Hz at 0.3
       percent) plus his family's own vibrato, all of it inside the one law his
       8/11 verdicts prove: never past 0.73 Hz, never deeper than 2.09 percent.
     - A BREATH THAT SHOULD NOT BE THERE: a real frightened breath in (ESC-50,
       Adam_N, CC0), on about one line in three: inside the line at a word gap
       (the words after it wait), or after the line is over.
     - A SAG AT THE LINE'S END: the last three or four letters slow and fall,
       the way a tape motor dies, never on a question (a question rises).
     - A ROOM ON IT: baked into every syllable by the tool (a small front room,
       RT60 0.35 s), so nothing here builds a convolver.

   NO CLICKING (his 8/11 note, a ruling): every take starts and ends on zero in
   the file; every gain starts at zero, ramps up in 5 ms and down to TRUE zero
   before stop(); a cut line fades in 15 ms instead of stopping dead.
   SCREECH LAW (7/8): no delay, no convolver, no waveshaper, no feedback path.

     const S = BOH_VOICE_RECORDED.make({ dir: 'voice_heard/', clock: fn -> MUS });
     S.load(AC)                       fetch and decode (once); until it is in, the
                                      caller speaks the old way (engine/bohemia_voice.js)
     S.ready()
     S.say(text, v, AC, dest, when, mood)  -> { blips, seconds, start, recorded:true,
                                      family, creep:{dropped,doubled,breath,sag}, stop() }
   ========================================================================== */
(function (root) {
  'use strict';

  var NUM = {
    MAX_ST: 4,            /* a person's pitch inside his family, semitones either way */
    WOW_HZ: 0.55, WOW: 0.003,
    CAP_HZ: 0.73, CAP_DEPTH: 0.0209,      /* HIS ONE HARD LAW (8/11): never past what he accepted */
    DROP_P: 0.022, DOUBLE_P: 0.02, BREATH_P: 0.34,
    SAG_MIN: 0.06, SAG_MAX: 0.12,
    ATTACK: 0.005, CUT_FADE: 0.015,
    GAIN_DB: 0                             /* set by the level the tool measured: index.gain_db */
  };

  function hash(str) {
    var h = 2166136261 >>> 0, i; str = String(str);
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }

  /* the letters as the mouth says them: accents to their letter (baterías is baterias), the rest dropped */
  function letters(text) {
    var s = String(text == null ? '' : text);
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (_e) {}
    return s.toLowerCase().replace(/ñ/g, 'n').replace(/[^a-z .,!?;:'…-]/g, '');
  }

  /* the family nearest him: tract first (formant dispersion is the second cue the ear uses, and the one a playback rate
     cannot move on its own), then pitch. His own six are themselves, exactly. */
  function familyOf(idx, v) {
    var F = idx.families, best = 0, bd = 1e9, i;
    for (i = 0; i < F.length; i++) {
      if (v.seed === F[i].id) return i;
      var dt = Math.log((v.tract || 1) / F[i].tract), df = Math.log((v.f0 || 200) / F[i].f0);
      var d = dt * dt * 4 + df * df;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  function make(opts) {
    opts = opts || {};
    var S = {
      NUM: NUM, dir: opts.dir || 'voice_heard/', idx: null, buf: null, shift: 0, loading: null, err: null,
      clock: opts.clock || null, said: 0, log: [],
      ready: function () { return !!(this.idx && this.buf); },
      load: function (AC) {
        var self = this; if (this.loading || this.ready() || !AC) return this.loading;
        this.loading = fetch(this.dir + 'index.json').then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.json(); })
          .then(function (idx) {
            return fetch(self.dir + idx.file).then(function (r) { if (!r.ok) throw new Error(idx.file + ' ' + r.status); return r.arrayBuffer(); })
              .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
              .then(function (b) {
                /* WHERE THE DECODER PUT THE FIRST TAKE. An mp3 carries an encoder delay that some decoders keep and some
                   trim; the tool wrote where the first take's first sample over -40 dBFS sits, so look for it here and
                   move every take by the difference, instead of trusting one browser's habit. */
                var d = b.getChannelData(0), n = Math.min(d.length, Math.floor(b.sampleRate * (idx.onset + 0.25))), k;
                for (k = 0; k < n; k++) if (Math.abs(d[k]) > 0.01) break;
                self.shift = (k < n) ? (k / b.sampleRate - idx.onset) : 0;
                if (Math.abs(self.shift) > 0.08) self.shift = 0;
                NUM.GAIN_DB = idx.gain_db || 0;
                self.buf = b; self.idx = idx; self.loading = null;
              });
          })
          .catch(function (e) { self.err = String(e); self.loading = null; });
        return this.loading;
      },

      say: function (text, v, AC, dest, when, mood) {
        if (!this.ready() || !AC || !dest || !v) return null;
        var idx = this.idx, buf = this.buf, self = this;
        var BV = root.BOH_VOICE;
        var raw = String(text == null ? '' : text);
        var m = (mood === undefined) ? (BV && BV.moodOf ? BV.moodOf(raw) : { arousal: 0, valence: 0 }) : (mood || { arousal: 0, valence: 0 });
        var a = clamp(m.arousal || 0, -1, 1), val = clamp(m.valence || 0, -1, 1);
        var fi = familyOf(idx, v), fam = idx.families[fi], clips = idx.clips[fam.id];
        var rand = rng(hash('squiggle|' + v.seed + '|' + raw));

        /* HIS PITCH inside his family, and the mood's (Scherer; Juslin & Laukka: roused is higher), on the playback rate */
        var st = 12 * Math.log((v.f0 || fam.f0) / fam.f0) / Math.LN2;
        st = clamp(st, -NUM.MAX_ST, NUM.MAX_ST) + a * 3 + val * 0.6;
        var pitch = Math.pow(2, st / 12);
        /* HIS SPEED, ON THE GRID: letters a beat at 120 BPM (8, 10 or 12 a second), roused faster */
        var lpb = clamp(Math.round(((v.rate || fam.rate) * (1 + a * 0.28)) / 2), 4, 6), step = 0.5 / lpb;
        var drop = (v.drop != null ? v.drop : fam.drop) * (1 - val * 0.35 + a * 0.10);
        /* his wobble: his family's vibrato as the tape's own, capped at the law */
        var wHz = Math.min(NUM.CAP_HZ, Math.max(0.2, fam.vib || 0.3)), wDepth = Math.min(NUM.CAP_DEPTH - NUM.WOW, (fam.vibA || 0.008) * 0.5);
        var ph1 = rand() * 6.283, ph2 = rand() * 6.283;
        var amp0 = Math.pow(10, NUM.GAIN_DB / 20) * (1 + a * 0.25);

        var L = letters(raw);
        var spoken = (L.match(/[a-z]/g) || []).length; if (!spoken) return null;
        var q = /\?\s*$/.test(raw);
        var sagN = q ? 0 : (spoken >= 8 ? 3 + ((rand() * 2) | 0) : 0);
        var sagD = NUM.SAG_MIN + rand() * (NUM.SAG_MAX - NUM.SAG_MIN);
        var breathAt = -1, breathAfter = false;
        if (idx.breaths && idx.breaths.length && rand() < NUM.BREATH_P) {
          var gaps = []; for (var gi = 0; gi < L.length; gi++) if (L[gi] === ' ') gaps.push(gi);
          if (gaps.length >= 3 && rand() < 0.45) breathAt = gaps[1 + ((rand() * (gaps.length - 2)) | 0)];
          else breathAfter = true;
        }

        /* start on the song's grid when it plays (the step MUS books next), else now */
        var t0 = (when != null) ? when : AC.currentTime + 0.03;
        try {
          var c = (when == null && this.clock) ? this.clock() : null;
          if (c && c.playing && c.nextT && c.nextT > AC.currentTime && c.nextT - AC.currentTime < 0.3) t0 = c.nextT;
        } catch (_e) {}

        var live = [], t = t0, said = 0, n = 0, lastTake = {}, creep = { dropped: [], doubled: [], breath: null, sag: sagN ? +sagD.toFixed(3) : 0 };
        var lastWeird = -9, rates = [], i, ch;

        function blip(at, take, rate0, rate1, gain, dropped) {
          var s = AC.createBufferSource(), g = AC.createGain(), node = g, dur = take[1];
          s.buffer = buf;
          /* A NEW GAIN IS 1 UNTIL ITS FIRST EVENT. A source started between two samples hands out its first frame before the
             envelope's 0 applies, and at gain 1 that frame is a one-sample spike: the click the gate found on a doubled
             syllable (60.9 dB over its neighbours, 10/24). Born at zero, there is no such frame. */
          g.gain.value = 0; s.playbackRate.value = rate0;
          s.playbackRate.setValueAtTime(rate0, at);
          if (Math.abs(rate1 - rate0) > 1e-4) s.playbackRate.linearRampToValueAtTime(rate1, at + dur / ((rate0 + rate1) / 2));
          var real = dur / ((rate0 + rate1) / 2);          /* how long the take lasts at this speed */
          g.gain.setValueAtTime(0, at);
          g.gain.linearRampToValueAtTime(gain, at + NUM.ATTACK);
          g.gain.setValueAtTime(gain, at + Math.max(NUM.ATTACK, real - 0.012));
          g.gain.linearRampToValueAtTime(0, at + real);      /* TRUE zero before stop(), the 8/11 fix */
          s.connect(g);
          if (dropped) { var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; lp.Q.value = 0.5; g.connect(lp); node = lp; }
          node.connect(dest);
          s.start(at, Math.max(0, take[0] + self.shift), dur);
          s.stop(at + real + 0.01);
          live.push({ s: s, g: g });
          return real;
        }
        function pick(letter) {
          var takes = clips[letter]; if (!takes || !takes.length) return null;
          var k = (rand() * takes.length) | 0;
          if (takes.length > 1 && k === lastTake[letter]) k = (k + 1) % takes.length;   /* never the same take twice running */
          lastTake[letter] = k; return takes[k];
        }
        function breath(at) {
          var B = idx.breaths[(rand() * idx.breaths.length) | 0];
          var r = pitch * (0.92 + rand() * 0.08);
          return { real: blip(at, B, r, r, amp0 * 0.9, false), take: B };
        }

        for (i = 0; i < L.length; i++) {
          ch = L[i];
          if (ch === ' ') {
            if (i === breathAt) { var br = breath(t + step * 0.5); creep.breath = { at: +(t - t0 + step * 0.5).toFixed(3), inside: true }; t += step * 0.5 + br.real * 0.75; }
            t += step; continue;
          }
          if (ch === ',' || ch === ';' || ch === ':' || ch === '-') { t += step * 2; continue; }
          if (ch === '.' || ch === '!' || ch === '?' || ch === '…') { if (said < spoken) t += step * 3; continue; }
          if (ch === "'") continue;
          var take = pick(ch); if (!take) { t += step * 0.5; continue; }
          var frac = said / spoken;
          /* DECLINATION down the line; a question rises at the end (every language, or it is a robot) */
          var contour = 1 - drop * frac;
          if (q && frac > 0.72) contour = 1 + 0.16 * (frac - 0.72) / 0.28;
          var tt = t - t0;
          var wob = 1 + NUM.WOW * Math.sin(6.283 * NUM.WOW_HZ * tt + ph1) + wDepth * Math.sin(6.283 * wHz * tt + ph2);
          var r0 = pitch * contour * wob * (1 + (rand() * 2 - 1) * 0.015);
          var r1 = r0, gain = amp0 * (0.9 + rand() * 0.15), adv = step;
          /* THE SAG: the last letters slow and fall, the tape motor dying */
          var fromEnd = spoken - 1 - said;
          if (sagN && fromEnd < sagN) {
            var k0 = (sagN - fromEnd - 1) / sagN, k1 = (sagN - fromEnd) / sagN;
            r0 *= 1 - sagD * Math.pow(k0, 1.4); r1 = r1 * (1 - sagD * Math.pow(k1, 1.4));
            adv = step * (1 + sagD * 1.6 * k1); gain *= Math.pow(10, (-1.5 * k1) / 20);
          }
          rates.push(+r0.toFixed(4));
          var odd = (said >= 2 && fromEnd >= 2 && said - lastWeird > 6) ? rand() : 1;
          if (odd < NUM.DROP_P) {
            blip(t, take, r0, r1, gain * 0.17, true); creep.dropped.push(said); lastWeird = said;
          } else if (odd < NUM.DROP_P + NUM.DOUBLE_P) {
            blip(t, take, r0, r1, gain, false);
            blip(t + step * 0.5, take, r0 * 0.97, r1 * 0.97, gain * 0.8, false);
            creep.doubled.push(said); lastWeird = said; adv += step;
          } else {
            blip(t, take, r0, r1, gain, false);
          }
          t += adv; said++; n++;
        }
        var end = t;
        if (breathAfter) {
          var at2 = t + 0.35 + rand() * 0.5;
          var b2 = breath(at2); creep.breath = { at: +(at2 - t0).toFixed(3), inside: false };
          end = Math.max(end, at2 + b2.real);
        }
        this.said++;
        var h = {
          blips: n, seconds: +(t - t0).toFixed(3), tail: +(end - t0).toFixed(3), start: t0, mood: m, recorded: true,
          family: fam.id, lpb: lpb, pitch: +pitch.toFixed(4), creep: creep, rates: rates,
          stop: function () {
            var now = AC.currentTime;
            for (var k = 0; k < live.length; k++) {
              try {
                var gp = live[k].g.gain;
                if (gp.cancelAndHoldAtTime) gp.cancelAndHoldAtTime(now); else { var cur = gp.value; gp.cancelScheduledValues(now); gp.setValueAtTime(cur, now); }
                gp.linearRampToValueAtTime(0, now + NUM.CUT_FADE);      /* a cut line fades, it never stops dead (a click) */
                live[k].s.stop(now + NUM.CUT_FADE + 0.005);
              } catch (_e) {}
            }
          }
        };
        this.log.push({ family: fam.id, blips: n, seconds: h.seconds, creep: creep });
        if (this.log.length > 40) this.log.shift();
        return h;
      }
    };
    return S;
  }

  root.BOH_VOICE_RECORDED = { make: make, NUM: NUM, familyOf: familyOf, letters: letters, hash: hash };
})(typeof window !== 'undefined' ? window : this);
