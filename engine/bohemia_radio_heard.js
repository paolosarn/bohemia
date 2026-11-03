/* BOHEMIA -- THE LAST TRANSMISSIONS HEARD (RADIO, 11/3/26; Paolo 11/3, rule 353, ask line 367).
   The shell's half of THE TOWN YOU DID NOT DEFEND: when the map says a town you hold has fallen with nobody at its gate
   ({type:'BOHEMIA_RADIO', ev:'fall', id}), this plays that town's channel as your phone picks it up: one recording
   (slices/radio/fall.mp3, tools/bohemia_radio_cook.py) of a real handheld's physics carrying real CC0 recordings: the talk
   switch, the carrier going quiet under a strong post and hissing under a weak one, the squelch tail after every key-up,
   the open mic, the carrier lost, then nothing. No voice in it, ever (Paolo 11/3, rule 353g: 'we're not adding real voices'):
   the words are the phone's.
   It starts on the music's next beat (window.__beatNext), on the effects bus under the music (window.__sfxOut), and answers
   the map with how long until it starts, so the words on the phone and the sound land together.
   Nothing loads until a fall asks (500 KB, rare by nature).

   const R = BOH_RADIO.make({ dir: 'radio/', out: fn -> { AC, bus } });
   R.fall(id) -> Promise<{ in_ms, at } | null>
   R.under(id, {from, dur, db}) -> a slice of it under one of the feed's important posts (rule 371(c))                                                               */
(function (root) {
  'use strict';
  function make(opts) {
    opts = opts || {};
    var R = {
      dir: opts.dir || 'radio/', idx: null, buf: null, loading: null, err: null, playing: null, log: [],
      out: opts.out || null,
      ctx: function () { var o = this.out && this.out(); return o && o.AC ? o : null; },
      ready: function () { return !!(this.idx && this.buf); },
      load: function () {
        var self = this, o = this.ctx(); if (this.loading || !o) return this.loading;
        this.loading = fetch(this.dir + 'index.json').then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.json(); })
          .then(function (idx) {
            return fetch(self.dir + idx.file).then(function (r) { if (!r.ok) throw new Error(idx.file + ' ' + r.status); return r.arrayBuffer(); })
              .then(function (ab) { return new Promise(function (res, rej) { o.AC.decodeAudioData(ab, res, rej); }); })
              .then(function (b) { self.buf = b; self.idx = idx; return self; });
          })
          .catch(function (e) { self.err = String(e); self.loading = null; return null; });
        return this.loading;
      },
      stop: function () {
        var p = this.playing; this.playing = null; if (!p) return;
        try { var AC = p.s.context; p.g.gain.setTargetAtTime(0, AC.currentTime, 0.05); p.s.stop(AC.currentTime + 0.3); } catch (_e) {}
      },
      fall: function (id) {
        var self = this, o = this.ctx(); if (!o) return Promise.resolve(null);
        return Promise.resolve(this.ready() ? this : this.load()).then(function (ok) {
          if (!ok || !self.ready()) return null;
          var AC = o.AC; self.stop();
          var minT = AC.currentTime + 0.08, at = minT;
          try { if (typeof root.__beatNext === 'function') at = Math.max(minT, root.__beatNext(minT)); } catch (_e) { at = minT; }
          var s = AC.createBufferSource(), g = AC.createGain();
          s.buffer = self.buf; g.gain.value = Math.pow(10, (self.idx.db || -10) / 20);
          s.connect(g); g.connect(o.bus); s.start(at);
          var rec = { s: s, g: g, id: id }; self.playing = rec;
          s.onended = function () { if (self.playing === rec) self.playing = null; try { s.disconnect(); g.disconnect(); } catch (_e) {} };
          var in_ms = Math.round((at - AC.currentTime) * 1000);
          self.log.push({ id: id, at: at, in_ms: in_ms, t: Date.now() }); if (self.log.length > 20) self.log.shift();
          return { in_ms: in_ms, at: at };
        });
      },
      /* rule 371(c): a slice of the same recording under one of the feed's important posts ({from, dur} seconds into the fall,
         db its own gain), on the next beat, faded in and out; never over a fall that is playing */
      under: function (id, seg) {
        var self = this, o = this.ctx(); if (!o || !seg || this.playing) return Promise.resolve(null);
        return Promise.resolve(this.ready() ? this : this.load()).then(function (ok) {
          if (!ok || !self.ready() || self.playing) return null;
          var AC = o.AC, from = Math.max(0, +seg.from || 0), dur = Math.max(0.2, Math.min(4, +seg.dur || 1));
          var minT = AC.currentTime + 0.08, at = minT;
          try { if (typeof root.__beatNext === 'function') at = Math.max(minT, root.__beatNext(minT)); } catch (_e) { at = minT; }
          var s = AC.createBufferSource(), g = AC.createGain(), v = Math.pow(10, (seg.db == null ? (self.idx.db || -10) - 4 : +seg.db) / 20);
          s.buffer = self.buf; s.connect(g); g.connect(o.bus);
          g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + 0.04);
          g.gain.setValueAtTime(v, at + dur - 0.12); g.gain.linearRampToValueAtTime(0, at + dur);
          s.start(at, from, dur);
          s.onended = function () { try { s.disconnect(); g.disconnect(); } catch (_e) {} };
          var in_ms = Math.round((at - AC.currentTime) * 1000);
          self.log.push({ id: id, under: true, from: from, dur: dur, at: at, in_ms: in_ms, t: Date.now() }); if (self.log.length > 20) self.log.shift();
          return { in_ms: in_ms, at: at };
        });
      }
    };
    return R;
  }
  root.BOH_RADIO = { make: make };
})(typeof window !== 'undefined' ? window : globalThis);
