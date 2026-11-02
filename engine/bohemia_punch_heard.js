/* BOHEMIA -- THE PUNCH HEARD (SOUNDS, 11/3, ask line 266; Paolo 11/2: 'nothing feels punchy yet, satisfying punchy, not from
   the music to the combat to the walking around the city to the camp').
   MEASURED FIRST on the real demo at phone size (tools/bohemia_sounds_every_event_heard.js): the guns, the bullets landing and
   the deaths were real recordings already (BULLET, DEATH). Everything else a fight, the map and the phone asked for was an
   oscillator or nothing: a blow with a pipe or a blade, its swing, a swing that missed, a man struck down by a blow, the
   body landing on COMBAT's thud, the high ground, the robot, the road event, the boss found, camp, they come, the phone.
   This player answers every one of them from real recordings (slices/fight_punch/, tools/bohemia_sounds_the_punch.py: CC0
   at the source, every source in its manifest), at levels measured through the game's own chain
   (tools/bohemia_sounds_the_punch_level.js), on the effects bus, so the one beat's 16th and his mix hold for it.

   WHAT IT ANSWERS (the message; it is heard BEFORE the bullets and gives them everything it does not claim):
     swing_air                      the swing's air (a machine's: its servo under it)
     melee_hit / vital  {melee}     a blow: blunt or blade by the weapon's blow, steel when it lands on a machine
     miss               {melee}     the swing that missed: a foot thrown aside
     hurt               {melee}     a blow on one of his, close; returns null so his ruled 'that was you' plays on top
     went_down                      a man struck down by a blow (a shot heard in the last 1.4 s leaves it to the bullets)
     kill / went_down {victim:'machine'}  a machine going down
     body_land, high_ground, fight_step {machine: a machine's only; a man's step stays the fight's own, his DOWN 10/18}, road_stop, boss_found, they_come, camp_make, camp_break,
     phone_tap, phone_open, phone_close
   Until its sprite is in (300 KB, late), it claims nothing and the game plays what it played before.

   const P = BOH_PUNCH.make({ dir: 'fight_punch/', out: fn -> { AC, bus } });
   P.load();  P.heard(msg) -> 'done' (played, stand the old sound down) | null (not its event, not loaded, or play on top) */
(function (root) {
  'use strict';
  var NUM = {
    RATE: 0.03, DB: 1.0,          /* each play a hair faster or slower, louder or softer: no two blows the same */
    VOICES: 10,                   /* punch voices ringing at once, at most; an eleventh lets the oldest one's tail go */
    PRE: 0.004,                   /* start 4 ms early: an mp3's encoder delay never eats the attack */
    WITHIN: 1400                  /* ms: a fall with no facts belongs to a shot heard this long before it (the bullets') */
  };
  var ONLY = { high_ground: ['high'], road_stop: ['road_stop'], boss_found: ['boss_found'], they_come: ['they_come'],
    camp_make: ['camp_make'], camp_break: ['camp_break'], phone_tap: ['phone_tap'], phone_open: ['phone_open'], phone_close: ['phone_close'] };
  function blowOf(m) { return (m.blow === 'cutting' || m.blow === 'piercing') ? 'blade' : 'blunt'; }
  /* the facts -> [voices] to play, or null when it is not this player's */
  function voicesOf(m, recentShot) {
    var ev = m.ev, mach = !!m.machine;
    if (ONLY[ev]) return ONLY[ev];
    if (ev === 'swing_air') return mach ? ['servo', 'swing'] : ['swing'];
    if (ev === 'fight_step') return mach ? ['metal_step', 'servo'] : null;   /* a man's step stays the fight's own (his DOWN, 10/18) */
    if (ev === 'body_land') return mach ? ['thud', 'metal_step'] : ['thud'];
    if ((ev === 'kill' || ev === 'went_down') && m.victim === 'machine') return ['machine_fall'];
    if (!m.melee) { if (ev === 'went_down' && !m.gun && !recentShot) return ['down']; return null; }
    if (ev === 'melee_hit' || ev === 'vital') return [m.target_machine ? 'machine_hit' : blowOf(m)];
    if (ev === 'miss') return ['scuff'];
    if (ev === 'hurt') return ['hurt_body'];
    if (ev === 'went_down') return ['down'];
    return null;
  }

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var nowMs = opts.now || function () { return (root.performance && performance.now()) || Date.now(); };
    var S = {
      NUM: NUM, dir: opts.dir || 'fight_punch/', idx: null, buf: null, loading: null, err: null,
      lastTake: {}, playing: [], log: [], count: 0, lastShot: -1e9,
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
      /* never the take that just played for this voice */
      pick: function (name, n) {
        var last = this.lastTake[name] === undefined ? -1 : this.lastTake[name], k;
        if (n < 2) k = 0; else if (last < 0) k = (rnd() * n) | 0; else { k = (rnd() * (n - 1)) | 0; if (k >= last) k++; }
        this.lastTake[name] = k; return k;
      },
      voice: function (name, o) {
        var v = this.idx && this.idx.voices[name]; if (!v || !this.buf) return null;
        var AC = o.AC;
        while (this.playing.length >= NUM.VOICES) {
          var old = this.playing.shift();
          try { old.g.gain.setTargetAtTime(0, AC.currentTime, 0.01); old.s.stop(AC.currentTime + 0.05); } catch (_e) {}
        }
        var k = this.pick(name, v.takes.length), tk = v.takes[k];
        var s = AC.createBufferSource(), g = AC.createGain(), self = this;
        s.buffer = this.buf; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        var db = (v.db || 0) + (rnd() * 2 - 1) * NUM.DB;
        g.gain.value = Math.pow(10, db / 20);
        s.connect(g); g.connect(o.bus);
        var at = AC.currentTime;
        s.start(at, Math.max(0, tk[0] - NUM.PRE), tk[1] + NUM.PRE);
        var rec = { s: s, g: g, name: name }; this.playing.push(rec);
        /* let go of every node when it ends (WebKit frees a node only when its collector reaches it) */
        s.onended = function () { var i = self.playing.indexOf(rec); if (i >= 0) self.playing.splice(i, 1); try { s.disconnect(); g.disconnect(); } catch (_e) {} };
        this.count++;
        this.log.push({ voice: name, take: k, db: +db.toFixed(1), t: nowMs() }); if (this.log.length > 300) this.log.shift();
        return s;
      },
      heard: function (m) {
        if (!m || !m.ev) return null;
        if (m.ev === 'shot') { this.lastShot = nowMs(); return null; }
        var names = voicesOf(m, nowMs() - this.lastShot < NUM.WITHIN); if (!names) return null;
        var o = this.ctx(); if (!o) return null;
        if (!this.ready()) { if (!this.loading) this.load(); return null; }   /* never silent where it was not: the old sound until this is in */
        var any = false;
        for (var i = 0; i < names.length; i++) if (this.voice(names[i], o)) any = true;
        if (!any) return null;
        return m.ev === 'hurt' ? null : 'done';   /* 'hurt' is his ruled 'that was you': it always plays on top */
      }
    };
    return S;
  }

  root.BOH_PUNCH = { NUM: NUM, voicesOf: voicesOf, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
