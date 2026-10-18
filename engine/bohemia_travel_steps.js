/* BOHEMIA -- THE STEPS FROM A RECORDING (SOUNDS, 10/18, row [steps from a recording]).
   The next round of [the desert under travel]. The map hears the recorded desert (MAPDESERT, his fourteenth
   votes: YES on 'the map hears the desert'); the party's footsteps on top of it are still the engine's
   modelled ones (TRAVELBED in the alpha, his YES on 10/13). These are real shoes:
   slices/vote/travel_steps/steps_asphalt.mp3 and steps_dirt.mp3, eight footfalls each, cut out of two CC0
   Freesound walks per surface (via ESC-50; every author in that folder's manifest.json), every cut in its own
   half-second slot. tools/bohemia_from_a_recording.py --steps makes them.

   ON THE BEAT, NEVER A LOOP: a look-ahead clock lays one cut per footfall at the game's own cadence (the road
   two a beat, the dirt one: his 'the road is faster', 10/5), never the same cut twice in a row, each a hair
   faster or slower (3 percent) and louder or softer (1.5 dB), so a long walk never repeats itself.

   WHO LOADS IT: the VOTE page slices/BOHEMIA_THE_STEPS_FROM_A_RECORDING_10_18_26.html, now. The alpha only on
   his YES (unjudged is silent; the row: 'retire TRAVELBED's engine render for the recordings once his VOTE
   says so'), and through RUN's cut (rule 93: the demo is RUN's call), as the cue in BUILD_CALLING_SCRIPT.md
   says: one script tag, and in the 'bohemia-mapstate' listener STEPS.ensure(bus, MUS.AC, surface) in place of
   __travelBedEnsure, STEPS.stopBed() beside TRAVELBED.stopBed(). Gate: gates/travel_steps_gate.js.

   const STEPS = BOH_TRAVEL_STEPS.make({ dir: 'vote/travel_steps/' });   // dir is relative to the page
   STEPS.ensure(bus, audioContext, 'asphalt' | 'dirt');                  // call it on every map state; idempotent
   STEPS.stopBed();                                                      // stopped, settled, or off the map

   THE STEP IN THE FIGHT (SOUNDS, 10/18, row [the step in the fight]): the same cuts, one per tile a man
   crosses, laid by the fight's own move (its 'step' event, a quarter beat a tile at 120 BPM), the tile's
   picture naming the floor (fight_floors.json beside the sprites: the road and the parking lot are the
   asphalt walk, the yards, the scrub, the wash and the roofs the gravel walk, the casino the carpet walk).
   A man's new step cuts his last one short (a choke, 20 ms), so a quick walk never smears; two men never
   choke each other. It replaces SND.step in slices/BOHEMIA_FIGHT.html, a 70 Hz triangle beep, on his YES.
   STEPS.loadFloors().then(...)                                          // the table, once
   STEPS.step(audioContext, bus, STEPS.floorAt(FIGHT.S, x, y), at, man.id);   // one footfall, now or at 'at' */
(function (root) {
  'use strict';
  var NUM = {
    BEAT: 0.5,                         /* 120 BPM */
    SLOT: 0.5, LEAD: 0.02,             /* the sprite: cut k starts at k*SLOT + LEAD (manifest.json slots[k].offset) */
    REL: 0.5,                          /* TRAVELBED's own level, so the swap is a swap and not a volume change */
    PERBEAT: { asphalt: 2, dirt: 1 },  /* the road is faster (10/5), TRAVELBED's PERBEAT */
    CUT: { asphalt: 0.22, dirt: 0.38, carpet: 0.22 }, /* each cut's length, the tool's tail per surface */
    FIGHT: { REL: 0.5, CHOKE: 0.02 },  /* the fight: the map's level; a man's new step chokes his last in 20 ms */
    N: { asphalt: 8, dirt: 8, carpet: 6 },  /* cuts per surface: four from each of two recordings; the carpet is one walk, all six of its footfalls */
    RATE: 0.03, DB: 1.5,               /* the per-step wobble */
    AHEAD: 0.25, TICK: 100             /* the look-ahead clock */
  };

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var S = {
      NUM: NUM, dir: opts.dir || 'vote/travel_steps/',
      buf: {}, loading: {}, surface: null, timer: null, next: 0, last: -1, count: 0, picks: [], log: [],
      lastBy: {}, voice: {}, floors: null, fightLog: [],
      load: function (AC, surface) {
        var self = this; if (this.buf[surface]) return Promise.resolve(this.buf[surface]);
        if (this.loading[surface]) return this.loading[surface];
        return (this.loading[surface] = fetch(this.dir + 'steps_' + surface + '.mp3')
          .then(function (r) { if (!r.ok) throw new Error(surface + ' ' + r.status); return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
          .then(function (b) { self.buf[surface] = b; return b; })
          .catch(function (e) { delete self.loading[surface]; self.log.push({ surface: surface, err: String(e) }); throw e; }));
      },
      pick: function (surface) {
        surface = surface || this.surface;
        var n = NUM.N[surface], last = surface === this.surface ? this.last : (this.lastBy[surface] === undefined ? -1 : this.lastBy[surface]);
        var k = (rnd() * (n - 1)) | 0;
        if (last >= 0 && k >= last) k++;               /* never the cut that just played on this ground */
        else if (last < 0) k = (rnd() * n) | 0;
        this.lastBy[surface] = k; if (surface === this.surface) this.last = k;
        this.picks.push(k); if (this.picks.length > 64) this.picks.shift();
        return k;
      },
      one: function (AC, bus, b, at, surface, rel) {
        surface = surface || this.surface;
        var k = this.pick(surface), s = AC.createBufferSource(), g = AC.createGain();
        s.buffer = b; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        g.gain.value = (rel === undefined ? NUM.REL : rel) * Math.pow(10, ((rnd() * 2 - 1) * NUM.DB) / 20);
        s.connect(g); g.connect(bus);
        s.start(at, k * NUM.SLOT + NUM.LEAD - 0.004, NUM.CUT[surface] + 0.01);
        this.count++;
        return { src: s, gain: g, cut: k };
      },
      /* THE STEP IN THE FIGHT: one footfall on one floor. A step that arrives before its sprite has loaded
         is dropped, never late (the beat does not wait); the load it starts serves the next one. */
      step: function (AC, bus, surface, at, who) {
        if (!NUM.N[surface]) surface = 'dirt';
        at = Math.max(at || 0, AC.currentTime);
        var b = this.buf[surface];
        if (!b) { this.load(AC, surface).catch(function () {}); this.fightLog.push({ surface: surface, dropped: 'loading' }); return null; }
        var key = who === undefined ? '_' : String(who), prev = this.voice[key];
        if (prev && prev.end > at) {                    /* the same man's last step: cut short, never two of his at once */
          try { prev.gain.gain.cancelScheduledValues(at); prev.gain.gain.setValueAtTime(prev.gain.gain.value, at); prev.gain.gain.linearRampToValueAtTime(0, at + NUM.FIGHT.CHOKE); prev.src.stop(at + NUM.FIGHT.CHOKE + 0.005); } catch (_e) {}
        }
        var v = this.one(AC, bus, b, at, surface, NUM.FIGHT.REL);
        v.end = at + NUM.CUT[surface] + 0.01; this.voice[key] = v;
        this.fightLog.push({ surface: surface, who: key, at: at, cut: v.cut, choked: !!(prev && prev.end > at) });
        if (this.fightLog.length > 256) this.fightLog.shift();
        return v;
      },
      loadFloors: function () {
        var self = this; if (this.floors) return Promise.resolve(this.floors);
        return fetch(this.dir + 'fight_floors.json').then(function (r) { if (!r.ok) throw new Error('fight_floors ' + r.status); return r.json(); })
          .then(function (t) { self.floors = t; return t; });
      },
      /* the floor under tile (x, y) of the fight's board: its block, from the deal (boardDef.blocks) and the crop if
         the board was cut (S.crop), then the block's own tile in the table; 'dirt' where the table has no word */
      floorAt: function (S, x, y) {
        var t = this.floors; if (!t || !S || !S.boardDef || !S.boardDef.blocks) return 'dirt';
        var bt = t.block_tiles, c = S.crop || { ox: 0, oy: 0 }, gx = x + (c.ox || 0), gy = y + (c.oy || 0);
        var row = S.boardDef.blocks[Math.floor(gy / bt)], name = row && row[Math.floor(gx / bt)], blk = name && t.blocks[name];
        var f = blk && blk.floor[gy % bt] && blk.floor[gy % bt][gx % bt];
        return NUM.N[f] ? f : 'dirt';
      },
      ensure: function (bus, AC, surface) {
        var self = this;
        if (!NUM.PERBEAT[surface]) surface = 'dirt';
        if (this.surface === surface) return;
        this.stopBed();
        this.surface = surface; this.last = -1; this.log.push({ on: surface, t: Date.now() });
        this.load(AC, surface).then(function (b) {
          if (self.surface !== surface || self.timer) return;
          var gap = NUM.BEAT / NUM.PERBEAT[surface];
          self.next = AC.currentTime + 0.05;
          (function tick() {
            if (self.surface !== surface) return;
            while (self.next < AC.currentTime + NUM.AHEAD) { self.one(AC, bus, b, self.next); self.next += gap; }
            self.timer = setTimeout(tick, NUM.TICK);
          })();
        }).catch(function () { if (self.surface === surface) self.surface = null; });
      },
      stopBed: function () {
        if (this.timer) clearTimeout(this.timer);
        if (this.surface) this.log.push({ off: this.surface, t: Date.now() });
        this.timer = null; this.surface = null;
      },
      playing: function () { return !!this.timer; }
    };
    return S;
  }

  root.BOH_TRAVEL_STEPS = { NUM: NUM, make: make };
})(typeof window !== 'undefined' ? window : globalThis);
