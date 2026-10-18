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
   STEPS.stopBed();                                                      // stopped, settled, or off the map */
(function (root) {
  'use strict';
  var NUM = {
    BEAT: 0.5,                         /* 120 BPM */
    SLOT: 0.5, LEAD: 0.02,             /* the sprite: cut k starts at k*SLOT + LEAD (manifest.json slots[k].offset) */
    REL: 0.5,                          /* TRAVELBED's own level, so the swap is a swap and not a volume change */
    PERBEAT: { asphalt: 2, dirt: 1 },  /* the road is faster (10/5), TRAVELBED's PERBEAT */
    CUT: { asphalt: 0.22, dirt: 0.38 },/* each cut's length, the tool's tail per surface */
    N: 8,                              /* cuts per surface: four from each of two recordings */
    RATE: 0.03, DB: 1.5,               /* the per-step wobble */
    AHEAD: 0.25, TICK: 100             /* the look-ahead clock */
  };

  function make(opts) {
    opts = opts || {};
    var rnd = opts.random || Math.random;
    var S = {
      NUM: NUM, dir: opts.dir || 'vote/travel_steps/',
      buf: {}, loading: {}, surface: null, timer: null, next: 0, last: -1, count: 0, picks: [], log: [],
      load: function (AC, surface) {
        var self = this; if (this.buf[surface]) return Promise.resolve(this.buf[surface]);
        if (this.loading[surface]) return this.loading[surface];
        return (this.loading[surface] = fetch(this.dir + 'steps_' + surface + '.mp3')
          .then(function (r) { if (!r.ok) throw new Error(surface + ' ' + r.status); return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
          .then(function (b) { self.buf[surface] = b; return b; })
          .catch(function (e) { delete self.loading[surface]; self.log.push({ surface: surface, err: String(e) }); throw e; }));
      },
      pick: function () {
        var k = (rnd() * (NUM.N - 1)) | 0;
        if (this.last >= 0 && k >= this.last) k++;     /* never the cut that just played */
        else if (this.last < 0) k = (rnd() * NUM.N) | 0;
        this.last = k; this.picks.push(k); if (this.picks.length > 64) this.picks.shift();
        return k;
      },
      one: function (AC, bus, b, at) {
        var k = this.pick(), s = AC.createBufferSource(), g = AC.createGain();
        s.buffer = b; s.playbackRate.value = 1 + (rnd() * 2 - 1) * NUM.RATE;
        g.gain.value = NUM.REL * Math.pow(10, ((rnd() * 2 - 1) * NUM.DB) / 20);
        s.connect(g); g.connect(bus);
        s.start(at, k * NUM.SLOT + NUM.LEAD - 0.004, NUM.CUT[this.surface] + 0.01);
        this.count++;
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
