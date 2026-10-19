/* BOHEMIA -- THE GUNS HEARD (SOUNDS, 10/19, row [the guns heard], rule 120: guns first).
   The fight's guns from real guns: THE FREE FIREARM SOUND LIBRARY (Still North Media, CC0 1.0, mirrored whole at
   github.com/buddingmonkey/FreeFirearmsSFXLibrary), cut, layered (the near or mid mic with the same gun's far mic), through
   a street canyon that claps back on every 16th, a camcorder's automatic gain and tape, by tools/bohemia_guns_heard.py.
   slices/vote/guns_heard/: guns_<pistol|shotgun|rifle>_<yours|theirs>_<a|c>.mp3 (five takes each, every one two beats long)
   and reload_<gun>_<a|c>.mp3 (three takes, the real motions laid on 16ths). A is the street on tape, C the clean recording.

   WHICH GUN: the fight's weapon class, the way records/target/bb/weapon_lines.json skins it (ours.gun_classes): the
   dagger row is the PISTOL, the firearm row the SHOTGUN, the crossbow row the RIFLE. YOURS when the man who fired is
   yours (the near mic), THEIRS when he is theirs (the mid mic, further off): you hear who fired before you see it.

   NEVER THE SAME TAKE TWICE IN A ROW per voice; each shot a hair faster or slower (2 percent) and louder or softer
   (1 dB), so a firefight never becomes one sample on repeat (the machine gun effect).

   WHO LOADS IT: the VOTE page slices/BOHEMIA_THE_GUNS_HEARD_10_19_26.html, now. The game only on his YES (unjudged is
   silent), through COMBAT's three lines in the fight's sound block and RUN's cut (rule 93): CUE 7.7 in
   BUILD_CALLING_SCRIPT.md. Gate: gates/guns_heard_gate.js.

   const GUNS = BOH_GUNS_HEARD.make({ dir: 'vote/guns_heard/' });     // dir is relative to the page
   GUNS.preload(AC, 'a');                                               // every voice of one version, decoded once
   GUNS.fire(AC, bus, GUNS.gunOf(weapon.class), 'yours' | 'theirs', 'a' | 'c', at);
   GUNS.reload(AC, bus, gun, 'a' | 'c', at); */
(function (root) {
  'use strict';
  var NUM = {
    BEAT: 0.5,                        /* 120 BPM */
    SLOT: 1.25, LEAD: 0.05,           /* a shot's sprite: take k starts at k*SLOT + LEAD (manifest.json) */
    CUT: 1.0,                         /* two beats: every shot ends on a beat */
    RSLOT: 1.25, RCUT: 1.1,           /* a reload's sprite and its length */
    PRE: 0.01,                        /* start 10 ms early: an mp3's encoder delay never eats the crack */
    N: 5, RN: 3,                      /* takes per voice; reloads per gun */
    RATE: 0.02, DB: 1.0,              /* the per-shot wobble */
    REL: 1.0                          /* the level the tool made them at; the page's output chain is the alpha's */
  };
  var GUN_OF = { dagger: 'pistol', firearm: 'shotgun', crossbow: 'rifle' };

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var S = {
      NUM: NUM, dir: opts.dir || 'vote/guns_heard/', buf: {}, loading: {}, last: {}, log: [], count: 0,
      gunOf: function (cls) { return GUN_OF[cls] || null; },
      file: function (kind, gun, side, version) { return kind === 'reload' ? 'reload_' + gun + '_' + version + '.mp3' : 'guns_' + gun + '_' + side + '_' + version + '.mp3'; },
      load: function (AC, name) {
        var self = this; if (this.buf[name]) return Promise.resolve(this.buf[name]);
        if (this.loading[name]) return this.loading[name];
        return (this.loading[name] = fetch(this.dir + name)
          .then(function (r) { if (!r.ok) throw new Error(name + ' ' + r.status); return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
          .then(function (b) { self.buf[name] = b; return b; })
          .catch(function (e) { delete self.loading[name]; self.log.push({ name: name, err: String(e) }); throw e; }));
      },
      /* the three YOURS voices first (the buttons), then THEIRS and the reloads */
      preload: function (AC, version) {
        var self = this, first = ['pistol', 'shotgun', 'rifle'].map(function (g) { return self.load(AC, self.file('shot', g, 'yours', version)); });
        return Promise.all(first).then(function () {
          return Promise.all(['pistol', 'shotgun', 'rifle'].map(function (g) {
            return Promise.all([self.load(AC, self.file('shot', g, 'theirs', version)), self.load(AC, self.file('reload', g, null, version))]);
          }));
        });
      },
      pick: function (key, n) {
        var last = this.last[key] === undefined ? -1 : this.last[key], k;
        if (last < 0) k = (rnd() * n) | 0; else { k = (rnd() * (n - 1)) | 0; if (k >= last) k++; }   /* never the take that just played */
        this.last[key] = k; return k;
      },
      play: function (AC, bus, name, slot, cut, n, at) {
        var b = this.buf[name];
        at = Math.max(at || 0, AC.currentTime);
        if (!b) { this.load(AC, name).catch(function () {}); this.log.push({ name: name, dropped: 'loading' }); return null; }   /* never late: the beat does not wait */
        var k = this.pick(name, n), s = AC.createBufferSource(), g = AC.createGain();
        s.buffer = b; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        g.gain.value = NUM.REL * Math.pow(10, ((rnd() * 2 - 1) * NUM.DB) / 20);
        s.connect(g); g.connect(bus);
        s.start(at, Math.max(0, k * slot + NUM.LEAD - NUM.PRE), cut + NUM.PRE + 0.01);
        this.count++; this.log.push({ name: name, take: k, at: at }); if (this.log.length > 256) this.log.shift();
        return { src: s, gain: g, take: k };
      },
      fire: function (AC, bus, gun, side, version, at) {
        if (!gun) return null;
        return this.play(AC, bus, this.file('shot', gun, side === 'theirs' ? 'theirs' : 'yours', version || 'a'), NUM.SLOT, NUM.CUT, NUM.N, at);
      },
      reload: function (AC, bus, gun, version, at) {
        if (!gun) return null;
        return this.play(AC, bus, this.file('reload', gun, null, version || 'a'), NUM.RSLOT, NUM.RCUT, NUM.RN, at);
      }
    };
    return S;
  }

  root.BOH_GUNS_HEARD = { NUM: NUM, GUN_OF: GUN_OF, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
