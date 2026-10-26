/* BOHEMIA -- DEATH SOUNDS THAT TERRIFY (SOUNDS, 10/26, row [death sounds that terrify], rule 235; Paolo 10/26: 'during combat
   when people die, I wanna hear terrible, terrible noises that are scary, like people are literally dying... many types, like
   broken bones, the whole enchilada').
   Every death in a fight plays a take of its kind from slices/fight_death/death.mp3 (tools/bohemia_death_sounds.py: real CC0
   recordings through the bullets' street, camcorder and tape), never the take that just played, on the song's next 16th (the
   shell's one beat routes this bus), the tail ringing past.

   WHAT THE FIGHT SAYS (slices/BOHEMIA_FIGHT.html, SND.death; every field but ev is optional):
     { type: 'BOHEMIA_SFX', ev: 'kill',
       side:     'you' | 'them'     whose man died
       weapon:   the killing weapon's class (mace, sword, dagger, crossbow, firearm, natural ...)
       blow:     'blunt' | 'cutting' | 'piercing' | 'natural'
       gun:      true when a gun or a bow killed him
       by_beast: true when a beast's bite or claws killed him
       armour_gave: true when the killing blow broke the last of his plate there
       finish:   true when the killing blow was a small one (he was already going: the slow one)
       head:     true when the blow took the head (the skull's crunch on top)
       beast:    the dead thing's enemy id when it was a beast (its own death: canine, big, cat)
       victim:   'machine' | 'ghost' (nothing human dies: the old sound plays) }
   THE KIND (rule 235(b): the killing blow picks it): a beast's own death first; then killed by a beast; the plate that gave;
   the slow one; the gun; a blunt blow is bone; a cut or a stab is the blade; a brute's natural blow is bone.
   HIS MEN AND THEIRS (235(e)): <kind>_yours for one of his (the worst sound in the game: close, six beats), <kind>_theirs for
   an enemy (still horrible: down the street, four beats, played far). With nothing but ev, a death is theirs and a gun's if a
   shot was heard within a beat and a half, else bone.

   const D = BOH_DEATH.make({ dir: 'fight_death/', out: fn -> { AC, bus } });
   D.load();  D.heard(msg) -> 'done' (played: stand every other sound for this death down) | null (not a death, or not loaded) */
(function (root) {
  'use strict';
  var NUM = {
    FAR_DB: -4.0, FAR_LP: 5200,   /* theirs and the beasts: over there, quieter, the top gone in the air (the bullets' numbers) */
    RATE: 0.015, DB: 0.8,         /* each play a hair faster or slower, louder or softer */
    VOICES: 6,                    /* deaths ringing at once, at most (a death is long: six at once is a massacre, not a mix);
                                     a seventh lets the oldest one's tail go */
    PRE: 0.005,                   /* start 5 ms early: an mp3's encoder delay never eats the blow */
    WITHIN: 1500                  /* ms: a death with no facts belongs to a shot heard this long before it */
  };
  var KINDS = ['bone', 'blade', 'gun', 'beast', 'slow', 'armour'];
  function animalOf(id) {
    var s = String(id || '').toLowerCase();
    if (/unhold|lindwurm|schrat|kraken|golem|ifrit|bear|mammoth|sloth|bison|camel|horse|boar|bull/.test(s)) return 'big';
    if (/ghoul|nachzehrer|cat|lion|tiger|smilodon|serpent|spider|webknecht|alp\b|hexe/.test(s)) return 'cat';
    return 'canine';   /* the wolves, hyenas and war dogs, and any beast not named */
  }
  /* the facts -> the voice: '<kind>_<yours|theirs>' or 'animal_<what>'; null when nothing human or animal died */
  function kindOf(m) {
    if (!m) return null;
    if (m.victim === 'machine' || m.victim === 'ghost') return null;
    if (m.beast) return 'animal_' + animalOf(m.beast);
    var side = m.side === 'you' ? 'yours' : 'theirs', k;
    if (m.by_beast) k = 'beast';
    else if (m.armour_gave) k = 'armour';
    else if (m.finish) k = 'slow';
    else if (m.gun) k = 'gun';
    else if (m.blow === 'cutting' || m.blow === 'piercing') k = 'blade';
    else if (m.blow === 'blunt' || m.blow === 'natural') k = 'bone';
    else if (m.weapon || m.blow) k = 'bone';
    else k = m._guess || 'bone';
    return k + '_' + side;
  }

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var nowMs = opts.now || function () { return (root.performance && performance.now()) || Date.now(); };
    var S = {
      NUM: NUM, dir: opts.dir || 'fight_death/', idx: null, buf: null, loading: null, err: null,
      lastTake: {}, lastAny: null, live: 0, playing: [], log: [], count: 0, lastShot: -1e9,
      out: opts.out || null,
      ready: function () { return !!(this.idx && this.buf); },
      ctx: function () { var o = this.out && this.out(); return o && o.AC ? o : null; },
      load: function () {
        var self = this, o = this.ctx(); if (this.loading || !o) return this.loading;
        var AC = o.AC;
        this.loading = fetch(this.dir + 'index.json').then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.json(); })
          .then(function (idx) {
            return fetch(self.dir + idx.file).then(function (r) { if (!r.ok) throw new Error(idx.file + ' ' + r.status); return r.arrayBuffer(); })
              .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
              .then(function (b) { self.buf = b; self.idx = idx; });
          })
          .catch(function (e) { self.err = String(e); self.loading = null; });
        return this.loading;
      },
      /* never the take that just played (per voice), nor the very take the last death played */
      pick: function (name, n) {
        var last = this.lastTake[name] === undefined ? -1 : this.lastTake[name], k;
        if (n < 2) k = 0; else if (last < 0) k = (rnd() * n) | 0; else { k = (rnd() * (n - 1)) | 0; if (k >= last) k++; }
        this.lastTake[name] = k; return k;
      },
      voice: function (name, o, far) {
        var v = this.idx && this.idx.voices[name]; if (!v || !this.buf) return null;
        var AC = o.AC;
        /* a massacre: the newest death is heard, the oldest one's tail is let go (30 ms), never a death gone silent */
        while (this.playing.length >= NUM.VOICES) {
          var old = this.playing.shift();
          try { old.g.gain.setTargetAtTime(0, AC.currentTime, 0.01); old.s.stop(AC.currentTime + 0.06); } catch (_e) {}
          this.log.push({ voice: old.name, stolen: true });
        }
        var k = this.pick(name, v.takes.length), tk = v.takes[k];
        var s = AC.createBufferSource(), g = AC.createGain(), dest = o.bus, self = this;
        s.buffer = this.buf; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        var db = (v.db || 0) + (far ? NUM.FAR_DB : 0) + (rnd() * 2 - 1) * NUM.DB;
        g.gain.value = Math.pow(10, db / 20);
        s.connect(g);
        var lp = null;
        if (far) { lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = NUM.FAR_LP; g.connect(lp); lp.connect(dest); } else g.connect(dest);
        var at = AC.currentTime;
        s.start(at, Math.max(0, tk[0] - NUM.PRE), tk[1] + NUM.PRE);
        var rec = { s: s, g: g, name: name }; this.playing.push(rec); this.live = this.playing.length;
        /* let go of every node when it ends (COMBAT's hygiene note 10/26: WebKit frees a node only when its collector reaches it) */
        s.onended = function () { var i = self.playing.indexOf(rec); if (i >= 0) self.playing.splice(i, 1); self.live = self.playing.length;
          try { s.disconnect(); g.disconnect(); if (lp) lp.disconnect(); } catch (_e) {} };
        this.count++; this.lastAny = name + '#' + k;
        this.log.push({ voice: name, take: k, far: !!far, db: +db.toFixed(1), at: +at.toFixed(3), t: nowMs() }); if (this.log.length > 300) this.log.shift();
        return s;
      },
      heard: function (m) {
        if (!m || !m.ev) return null;
        if (m.ev === 'shot') { this.lastShot = nowMs(); return null; }
        if (m.ev !== 'kill') return null;
        var facts = m;
        if (!m.side && !m.weapon && !m.blow && !m.beast) facts = Object.assign({}, m, { _guess: nowMs() - this.lastShot < NUM.WITHIN ? 'gun' : 'bone' });
        var name = kindOf(facts); if (!name) return null;
        var o = this.ctx();
        if (!o) return null;
        if (!this.ready()) { if (!this.loading) this.load(); return null; }   /* never silent: the old fall plays until this is in */
        var far = !/_yours$/.test(name);
        if (!this.voice(name, o, far)) return null;
        if (m.head) this.voice('skull', o, far);
        return 'done';
      }
    };
    return S;
  }

  root.BOH_DEATH = { NUM: NUM, KINDS: KINDS, kindOf: kindOf, animalOf: animalOf, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
