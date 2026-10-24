/* BOHEMIA -- THE BULLET LANDS (SOUNDS, 10/24, row [the bullet lands], rule 120: guns first; rule 126(c): every hit, kill and
   fall is heard; rule 127: no card, he hears it in his next fight).
   The other half of the gun. The fight posts BOHEMIA_SFX for every shot, hit, miss and fall (slices/BOHEMIA_FIGHT.html, SND);
   this player answers it with real recordings: the real guns of [the guns heard] (slices/vote/guns_heard/, BOH_GUNS_HEARD) and
   where the bullet went (slices/fight_heard/lands.mp3, tools/bohemia_bullet_lands.py): in a man, on his plate, in cover, in the
   dirt, past your ear, off the stone, and the man going down.

   WHAT THE FIGHT SAYS, AND WHAT IT CAN SAY (the message; every field but ev is optional, and the ones COMBAT adds are the
   whole difference between a good guess and the truth):
     { type: 'BOHEMIA_SFX', ev,                      'shot' 'hit' 'vital' 'miss' 'hurt' 'kill' 'went_down' 'mag_home' ...
       gun:    'pistol' | 'shotgun' | 'rifle' | 'mg' (or the weapon's class: dagger, firearm, crossbow)
       side:   'you' | 'them'   who FIRED (for kill and went_down: the side of the man who FELL)
       hp, armour:  what the blow did (armour > 0 and no hp: the plate stopped it; both: it went through)
       head:   true on a head hit
       cover:  the cover piece a miss went into (car_lane, wall, rock_3, shed, dumpster ... : its material is read here) }
   WITH NOTHING BUT ev (the fight today), it listens: whose turn it is (BOHEMIA_FIGHT_TURN), whether the last thing heard was
   a shot or a swing (a miss within a beat of a shot is a bullet's miss; after a swing it stays the swing's), and which gun
   each side carries most (read once off the fight's own roster when the board comes up). A melee blow is never touched.

   THE LEVELS ARE MEASURED THROUGH THE GAME'S OWN OUTPUT CHAIN (its compressor and brickwall, the numbers of MUS.audio):
   slices/fight_heard/index.json carries each voice's gain, found by tools/bohemia_bullet_lands_level.js so every voice lands
   at its mark after the chain, never by ear and never louder to win. Gate: gates/bullet_lands_gate.js.

   THE COUNT-UP (TUNING's change 6, 'a win is a moment'): BOH_BULLET.countUp(from, to) ticks a real electromechanical counter
   once a 16th on the song's own grid while the number climbs, and drops the battery into a steel crate with a bell on the
   beat after the last tick; down (a lost fight) ticks and drops dull, no bell. It returns the plan (when each tick sounds) so
   the number that moves can move with it. UI posts the moment: postMessage({ type: 'BOHEMIA_COUNT_UP', from, to }).

   const B = BOH_BULLET_LANDS.make({ dir: 'fight_heard/', gunsDir: 'vote/guns_heard/', out: fn -> { AC, bus }, clock: fn -> MUS });
   B.load();  B.heard(msg) -> 'done' (played, stand the old sound down) | { swap: ev } (play this approved one instead) | null */
(function (root) {
  'use strict';
  var NUM = {
    WITHIN: 1400,                 /* ms: a landing or a fall belongs to the shot heard this long before it (a beat is 500) */
    FAR_DB: -4.0, FAR_LP: 5200,   /* over there, on their side of the board: quieter and its top gone in the air */
    RATE: 0.02, DB: 1.0,          /* each play a hair faster or slower and louder or softer, like the guns */
    VOICES: 12,                   /* landings ringing at once, at most (sixteen at once crushed the brickwall, 8/18) */
    RICOCHET: 0.25,               /* one bullet in four that stone or steel stops whines off it */
    PRE: 0.005,                   /* start 5 ms early: an mp3's encoder delay never eats the crack */
    STEP: 0.125, BEAT: 0.5,       /* 120 BPM: a 16th and a beat */
    TICKS: 24                     /* the count-up's 3 s at most: 24 sixteenths */
  };
  var GUN_OF = { dagger: 'pistol', firearm: 'shotgun', crossbow: 'rifle', pistol: 'pistol', shotgun: 'shotgun', rifle: 'rifle', mg: 'mg', machine_gun: 'mg' };
  function gunOf(x) { return x ? (GUN_OF[x] || null) : null; }
  /* the fight's cover pieces (slices/fight_ground/fight_ground.json: cover and cover_extra) by what they are made of */
  function coverOf(piece) {
    var p = String(piece || '');
    if (/^car/.test(p)) return 'car';
    if (/^(pump|trailer|dumpster|slot_bank)/.test(p)) return 'metal';
    if (/^(shed|fence|dock|table)/.test(p)) return 'wood';
    return 'stone';               /* wall, wall_corner, wall_broken, rock_*, outcrop, rubble_*, jersey, steps, pillar */
  }

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var nowMs = opts.now || function () { return (root.performance && performance.now()) || Date.now(); };
    var S = {
      NUM: NUM, dir: opts.dir || 'fight_heard/', idx: null, buf: null, loading: null, err: null,
      guns: (opts.guns !== undefined ? opts.guns : (root.BOH_GUNS_HEARD ? root.BOH_GUNS_HEARD.make({ dir: opts.gunsDir || 'vote/guns_heard/', random: rnd }) : null)),
      gunsDb: 0, turn: null, last: { kind: null, t: -1e9, side: null, gun: null }, sides: {}, live: 0, lastTake: {}, log: [], count: 0,
      out: opts.out || null, clock: opts.clock || null,
      ready: function () { return !!(this.idx && this.buf); },
      ctx: function () { var o = this.out && this.out(); return o && o.AC ? o : null; },
      load: function () {
        var self = this, o = this.ctx(); if (this.loading || !o) return this.loading;
        var AC = o.AC;
        this.loading = fetch(this.dir + 'index.json').then(function (r) { if (!r.ok) throw new Error('index ' + r.status); return r.json(); })
          .then(function (idx) {
            self.gunsDb = idx.guns_db || 0;
            return fetch(self.dir + idx.file).then(function (r) { if (!r.ok) throw new Error(idx.file + ' ' + r.status); return r.arrayBuffer(); })
              .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
              .then(function (b) { self.buf = b; self.idx = idx; });
          })
          .catch(function (e) { self.err = String(e); self.loading = null; });
        if (this.guns) { try { this.guns.preload(AC, 'a').catch(function () {}); } catch (_e) {} }
        return this.loading;
      },
      pick: function (name, n) {
        var last = this.lastTake[name] === undefined ? -1 : this.lastTake[name], k;
        if (n < 2) k = 0; else if (last < 0) k = (rnd() * n) | 0; else { k = (rnd() * (n - 1)) | 0; if (k >= last) k++; }   /* never the take that just played */
        this.lastTake[name] = k; return k;
      },
      /* one take of one voice; far: on their side of the board */
      voice: function (name, o, far, extraDb, delay, force) {
        var v = this.idx && this.idx.voices[name]; if (!v || !this.buf) return null;
        if (this.live >= NUM.VOICES && !force) { this.log.push({ voice: name, dropped: 'voices' }); return null; }
        var AC = o.AC, k = this.pick(name, v.takes.length), tk = v.takes[k];
        var s = AC.createBufferSource(), g = AC.createGain(), dest = o.bus, self = this;
        s.buffer = this.buf; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        var db = (v.db || 0) + (extraDb || 0) + (far ? NUM.FAR_DB : 0) + (rnd() * 2 - 1) * NUM.DB;
        g.gain.value = Math.pow(10, db / 20);
        s.connect(g);
        if (far) { var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = NUM.FAR_LP; g.connect(lp); lp.connect(dest); } else g.connect(dest);
        var at = AC.currentTime + (delay || 0);
        s.start(at, Math.max(0, tk[0] - NUM.PRE), tk[1] + NUM.PRE);
        this.live++; s.onended = function () { self.live = Math.max(0, self.live - 1); };
        this.count++; this.log.push({ voice: name, take: k, far: !!far, db: +db.toFixed(1), at: +at.toFixed(3) }); if (this.log.length > 200) this.log.shift();
        return s;
      },
      /* the gun itself: the real guns, the machine gun from this sprite */
      fire: function (o, gun, side) {
        var persp = side === 'them' ? 'theirs' : 'yours';
        if (gun === 'mg') return this.voice('gun_mg_' + persp, o, false, 0, 0);
        if (!this.guns) return null;
        var bus = o.bus, g = null;
        if (this.gunsDb) { g = o.AC.createGain(); g.gain.value = Math.pow(10, this.gunsDb / 20); g.connect(o.bus); bus = g; }
        var r = this.guns.fire(o.AC, bus, gun, persp, 'a', o.AC.currentTime);
        if (r) { this.count++; this.log.push({ gun: gun, side: persp, take: r.take }); }
        return r;
      },
      reload: function (o, gun) {
        if (!this.guns || gun === 'mg') return null;
        var bus = o.bus; if (this.gunsDb) { var g = o.AC.createGain(); g.gain.value = Math.pow(10, this.gunsDb / 20); g.connect(o.bus); bus = g; }
        var r = this.guns.reload(o.AC, bus, gun, 'a', o.AC.currentTime);
        if (r) { this.count++; this.log.push({ reload: gun, take: r.take }); }
        return r;
      },
      /* the bullet on a man: target 'them' is over there (far), 'you' is one of his */
      land: function (o, target, gun, m, head) {
        var far = target !== 'you', on = m.on;
        if (!on) on = (m.armour > 0 && !(m.hp > 0)) ? 'armour' : (m.armour > 0 ? 'through' : 'flesh');
        if (on === 'armour') {
          this.voice('armour_' + gun, o, far);
          if (gun !== 'shotgun' && rnd() < NUM.RICOCHET) this.voice('ricochet', o, far, 0, 0.03);
        } else if (on === 'through') { this.voice('armour_' + gun, o, far, -3); this.voice('flesh_' + gun, o, far); }
        else this.voice('flesh_' + gun, o, far);
        if (head) this.voice('bone', o, far);
      },
      /* a miss: into cover, past one of his (the crack), or into the dirt */
      miss: function (o, target, gun, m) {
        var far = target !== 'you';
        if (m.cover) {
          var mat = coverOf(m.cover);
          this.voice('cover_' + mat, o, far);
          if (gun === 'shotgun') this.voice('pellets', o, far, -3);
          else if (mat !== 'wood' && rnd() < NUM.RICOCHET) this.voice('ricochet', o, far, 0, 0.02);
          return;
        }
        if (!far) {
          if (gun === 'rifle' || gun === 'mg') this.voice('crack_' + gun, o, false);
          else if (gun === 'shotgun') this.voice('pellets', o, false);
          else this.voice('ground_near', o, false);
          return;
        }
        this.voice(gun === 'shotgun' ? 'pellets' : 'ground_far', o, true);
      },
      /* the roster, read once when the board comes up: the gun each side carries most (the guess when the fight names none) */
      readRoster: function (units) {
        var n = { you: {}, them: {} };
        (units || []).forEach(function (u) {
          var w = u && u.weapon; if (!w || !n[u.side]) return;
          var g = gunOf((w.of && w.of.class) || w.class); if (!g) return;
          n[u.side][g] = (n[u.side][g] || 0) + 1;
        });
        var best = function (h) { var k = null; for (var g in h) if (!k || h[g] > h[k]) k = g; return k; };
        this.sides = { you: best(n.you), them: best(n.them) };
        return this.sides;
      },
      started: function () { this.turn = null; this.last = { kind: null, t: -1e9, side: null, gun: null }; if (!this.ready()) this.load(); },
      heard: function (m) {
        if (!m || !m.ev) return null;
        var ev = m.ev, t = nowMs(), o = this.ctx();
        if (!this.ready() && o && !this.loading) this.load();
        var recent = this.last.kind === 'shot' && t - this.last.t < NUM.WITHIN;
        /* who fired: a hit and a head hit land on THEM (the fight posts 'hurt' instead when it is one of his), a hurt on
           YOURS; a shot and a miss are whoever's turn it is (a free strike in their turn is a blade, never a shot) */
        var shooter = m.side || (ev === 'hit' || ev === 'vital' ? 'you' : ev === 'hurt' ? 'them' : (recent && this.last.side) || this.turn) || null;
        var gun = gunOf(m.gun) || (recent && this.last.gun) || (shooter && this.sides[shooter]) || null;
        if (ev === 'swing_air') { this.last = { kind: 'swing', t: t, side: shooter, gun: null }; return null; }
        if (ev === 'shot') {
          this.last = { kind: 'shot', t: t, side: shooter, gun: gun };
          if (!o || !gun || !this.guns) return null;   /* never late, never silent: the old shot plays until the real one is in */
          if (gun === 'mg' && !this.ready()) return null;
          return this.fire(o, gun, shooter) ? 'done' : null;
        }
        if (ev === 'mag_home') { var rg = gunOf(m.gun); return (o && rg && this.reload(o, rg)) ? 'done' : null; }
        var ranged = !!m.gun || recent;
        if (!o || !this.ready() || !ranged) return null;   /* a blade, a pipe, a fist: never touched */
        var g = gun || 'rifle';
        if (ev === 'hit') { this.land(o, 'them', g, m, !!m.head); return 'done'; }
        if (ev === 'vital') { this.land(o, 'them', g, m, true); return 'done'; }
        if (ev === 'hurt') { this.land(o, 'you', g, m, !!m.head); return null; }   /* his 'that was you' plays on top, always */
        if (ev === 'miss') { this.miss(o, shooter === 'them' ? 'you' : 'them', g, m); return 'done'; }
        if (ev === 'kill' || ev === 'went_down') {
          var fell = m.side || (this.last.side === 'you' ? 'them' : 'you');
          this.voice(ev === 'kill' ? 'down_dead' : 'down_hurt', o, fell !== 'you');
          return 'done';
        }
        return null;
      },
      /* THE COUNT-UP: a tick a 16th on the song's grid, the drop on the beat after the last tick */
      countUp: function (from, to) {
        var o = this.ctx(); if (!o || !this.ready()) return null;
        var AC = o.AC, n = Math.abs((to | 0) - (from | 0)), ticks = Math.min(n, NUM.TICKS), up = to >= from, sd = NUM.STEP;
        /* the song's own grid: the step MUS books next sounds at nextT, and a beat is every fourth step (the playSFX 'beat' rule) */
        var c = this.clock && this.clock(), grid = !!(c && c.playing && c.nextT), base = grid ? c.nextT : AC.currentTime + 0.03, s0 = grid ? (c.step || 0) : 0, j0 = 0;
        while (base + j0 * sd < AC.currentTime + 0.02) j0++;
        var jl = j0 + ticks; if (grid) while ((s0 + jl) % 4) jl++;
        var start = base + j0 * sd, land = base + jl * sd;
        for (var i = 0; i < ticks; i++) this.voice('tick', o, false, up ? 0 : -2, start + i * sd - AC.currentTime, true);
        this.voice(up ? 'tally_up' : 'tally_down', o, false, 0, land - AC.currentTime, true);
        var t0 = nowMs(), plan = { from: from, to: to, ticks: ticks, onGrid: grid, startMs: t0 + (start - AC.currentTime) * 1000, stepMs: sd * 1000, landMs: t0 + (land - AC.currentTime) * 1000 };
        this.log.push({ countUp: [from, to], ticks: ticks, onGrid: grid });
        return plan;
      }
    };
    return S;
  }

  root.BOH_BULLET_LANDS = { NUM: NUM, GUN_OF: GUN_OF, gunOf: gunOf, coverOf: coverOf, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
