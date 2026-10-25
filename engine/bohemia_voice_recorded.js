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
       a sixth of its level), about one letter in twenty-two (10/25: the lines are
       short now), never the first two or the last two.
     - A SYLLABLE DOUBLES: the tape catches and says it again half a step later,
       a little flatter; about one in twenty-five. Together about one
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

   THE FLOOR: ONE VOICE AT A TIME, SHORT, AND GONE WHEN YOU LEAVE (SOUNDS 10/25,
   row [the PC playtest: the sound's part], rule 164 item 19; Paolo on his PC:
   'they just kept running and running and overlapping each other, and even when
   I left the city I was still hearing them'). MEASURED BEFORE: the shell's one
   voice (speakLine) cut its own last line, but the town's walkers muttered
   through their own player on the town's own context, so a mutter and a keeper,
   or a mutter and its answer and the greeter, played on top of each other; and
   the map hides the town's frame on LEAVE without unloading it, so its draw loop
   stops, nothing ever told its voices, and a keeper's line said by the shell had
   no idea where it came from. NOW every player in every frame shares ONE floor
   on the top window (same origin), so:
     - ONE AT A TIME: a line for HIM (the shell's player, make({lead:true}): the
       keepers, the greeter, the crew, the map's people) cuts whatever is talking,
       any frame; a line in the BACKGROUND (every other player: the walkers'
       mutters) is said only into silence (QUIET after the last line ends) and is
       refused, never queued, when somebody is talking;
     - SHORT: a line he is told is said in at most CAP_LEAD letters (under two
       seconds before its breath), a mutter in CAP_BG, cut at a word, with the sag (or a question's
       rise) on the words it keeps, so it ends like a line, never chopped;
     - GONE WHEN YOU LEAVE: every line knows the frame that asked for it (say's
       opts.src, the message's source for the shell); the top window looks every
       SWEEP_MS and the moment that frame is hidden (display none on it or on any
       frame around it), detached or closed, the line fades out in 15 ms.

     const S = BOH_VOICE_RECORDED.make({ dir: 'voice_heard/', clock: fn -> MUS, lead: true|false });
     S.load(AC)                       fetch and decode (once); until it is in, the
                                      caller speaks the old way (engine/bohemia_voice.js)
     S.ready()
     S.say(text, v, AC, dest, when, mood, opts)  -> { blips, seconds, start, recorded:true,
                                      family, creep:{dropped,doubled,breath,sag}, stop() }
                                      opts: { src: the window that asked, lead, cap }
     BOH_VOICE_RECORDED.floor.claim(h, AC, { src, lead })  put any other voice's handle on the floor
   ========================================================================== */
(function (root) {
  'use strict';

  var NUM = {
    MAX_ST: 4,            /* a person's pitch inside his family, semitones either way */
    WOW_HZ: 0.55, WOW: 0.003,
    CAP_HZ: 0.73, CAP_DEPTH: 0.0209,      /* HIS ONE HARD LAW (8/11): never past what he accepted */
    DROP_P: 0.045, DOUBLE_P: 0.04, BREATH_P: 0.34,   /* 10/25: twice the 10/24 rates, so a line cut to its twelve letters is still a little wrong (about 0.7 a line) */
    SAG_MIN: 0.06, SAG_MAX: 0.12,
    ATTACK: 0.005, CUT_FADE: 0.015,
    GAIN_DB: 0,                            /* set by the level the tool measured: index.gain_db */
    /* THE FLOOR (10/25, rule 164 item 19): letters a line keeps (a line for him, a mutter), the silence a mutter waits
       for after any line ends, how often the top window looks for a frame he has left */
    CAP_LEAD: 12, CAP_BG: 7, QUIET_MS: 400, SWEEP_MS: 100
  };

  /* ---------------- THE FLOOR: one voice at a time, across every frame ---------------- */
  var FLOOR_ROOT = (function () { try { var t = root.top; if (t && t.document) return t; } catch (_e) {} return root; })();
  function floorObj() {
    var F = null;
    try { F = FLOOR_ROOT.__BOH_VOICE_FLOOR; } catch (_e) { F = null; }
    if (!F) {
      F = { live: [], said: 0, cut: 0, refused: 0, left: 0, log: [] };
      try { FLOOR_ROOT.__BOH_VOICE_FLOOR = F; } catch (_e) { root.__BOH_VOICE_FLOOR = F; }
    }
    return F;
  }
  /* is the frame that asked for this line gone from his screen: closed, detached, or hidden (on itself or any frame around it) */
  function frameGone(w) {
    try {
      if (!w) return false;
      if (w.closed) return true;
      var x = w, n = 0;
      while (x && x !== x.parent && n++ < 8) {
        var fe = x.frameElement; if (!fe) return false;   /* not ours to read: never cut on a guess */
        if (!fe.isConnected) return true;
        var cs = fe.ownerDocument.defaultView.getComputedStyle(fe);
        if (cs.display === 'none' || cs.visibility === 'hidden') return true;
        x = x.parent;
      }
    } catch (_e) {}
    return false;
  }
  function entryOf(h, AC, o) {
    var now = Date.now(), st = (h.start != null) ? h.start : AC.currentTime;
    return { h: h, src: o.src || root, lead: !!o.lead, start: now + (st - AC.currentTime) * 1000,
             end: now + (st - AC.currentTime + (h.tail || h.seconds || 0)) * 1000, stopped: false };
  }
  function cutEntry(F, e, why) {
    if (e.stopped) return; e.stopped = true;
    try { e.h.stop(); } catch (_e) {}
    if (why === 'left') F.left++; else F.cut++;
    F.log.push({ t: Date.now(), why: why }); if (F.log.length > 60) F.log.shift();
  }
  /* a render (an OfflineAudioContext: a gate, a judge page's file) is never heard live, so it never takes or waits for the floor */
  function offline(AC) { try { return typeof OfflineAudioContext !== 'undefined' && AC instanceof OfflineAudioContext; } catch (_e) { return false; } }
  var floor = {
    /* who is still heard (or still to be heard): a line not cut whose end is ahead */
    alive: function () { var F = floorObj(), now = Date.now(); F.live = F.live.filter(function (e) { return !e.stopped && e.end > now; }); return F.live; },
    /* may a BACKGROUND line start at `startMs` (epoch): only into silence, QUIET after every line still heard */
    free: function (startMs) { var L = this.alive(); for (var i = 0; i < L.length; i++) if (L[i].end + NUM.QUIET_MS > startMs) return false; return true; },
    /* a line for HIM takes the floor: every other line, in any frame, fades out first */
    claim: function (h, AC, o) {
      if (!h || !AC || typeof h.stop !== 'function' || offline(AC)) return h; o = o || {};
      var F = floorObj(), e = entryOf(h, AC, o);
      if (o.lead) { var L = this.alive(); for (var i = 0; i < L.length; i++) if (L[i].h !== h) cutEntry(F, L[i], 'cut'); }
      F.live.push(e); F.said++;
      return h;
    },
    /* the top window's look: a line whose frame he has left fades out */
    sweep: function () { var F = floorObj(), L = this.alive(); for (var i = 0; i < L.length; i++) if (frameGone(L[i].src)) cutEntry(F, L[i], 'left'); return F; },
    state: function () { var F = floorObj(); return { live: this.alive().length, said: F.said, cut: F.cut, refused: F.refused, left: F.left }; },
    frameGone: frameGone
  };
  /* only the top window looks (one look for the whole game); a page opened alone is its own top */
  if (root === FLOOR_ROOT && typeof setInterval === 'function') {
    var sweepIv = setInterval(function () { try { floor.sweep(); } catch (_e) {} }, NUM.SWEEP_MS);
    if (sweepIv && sweepIv.unref) sweepIv.unref();   /* a gate that reads this file in node is not held open by the look */
  }

  /* SHORT: the line said in at most `cap` letters, cut at a word (a single long word is cut inside it), keeping its last mark */
  function shorten(L, cap) {
    var count = (L.match(/[a-z]/g) || []).length; if (count <= cap) return L;
    var out = '', n = 0, words = L.split(' ');
    for (var i = 0; i < words.length; i++) {
      var w = words[i], wl = (w.match(/[a-z]/g) || []).length;
      if (!wl) continue;
      if (n + wl > cap) { if (!n) { var k = 0, cut = ''; for (var j = 0; j < w.length && k < cap; j++) { cut += w[j]; if (/[a-z]/.test(w[j])) k++; } out = cut; } break; }
      out += (out ? ' ' : '') + w; n += wl;
    }
    out = out.replace(/[ ,;:\-]+$/, '');
    var mark = /\?\s*$/.test(L) ? '?' : (/!\s*$/.test(L) ? '!' : '.');
    return out.replace(/[.!?…]+$/, '') + mark;
  }

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

  /* ---------------- MANY MORE VOICES, EACH A REAL PERSON (10/25, rule 164 item 20) ----------------
     Paolo: 'they're getting repetitive, not that different from each other'. MEASURED: every voice was one woman moved by
     Praat into his six, all between 168 and 252 Hz, and a town's seven lines drew two of them. Now index.json's 'more' holds
     twenty real people (AudioMNIST, MIT: tools/bohemia_squiggle_more_voices.py), fourteen men and six women, their own
     voices, in a second sprite that loads after the first. A person is ONE of the twenty-six by his own id (seeded, the same
     voice every time: ONE ID, ONE WHOLE PERSON), a man known to be a man (the people mix: 'm', or a beard) one of the men,
     his own pitch a little either side of the speaker's (two semitones, never a chipmunk); his six are still themselves. */
  var MIXMAP = null;
  function sexOf(seed, src) {
    var m = /^face:(.+)$/.exec(String(seed || '')); if (!m) return null;
    if (!MIXMAP) {
      var P = null, tries = [src, root, FLOOR_ROOT];
      for (var i = 0; i < tries.length && !P; i++) { try { P = tries[i] && tries[i].BOHEMIA_PEOPLE_MIX; } catch (_e) { P = null; } }
      if (!P || !P.people) return null;
      MIXMAP = {}; P.people.forEach(function (p) { MIXMAP[p.look] = (p.sex === 'm' || p.beard) ? 'm' : (p.sex || null); });
    }
    return MIXMAP[m[1]] || null;
  }
  function pickFamily(idx, v, sex, haveMore) {
    var six = idx.families, more = (idx.more && idx.more.families) || [], i;
    for (i = 0; i < six.length; i++) if (v.seed === six[i].id) return { fam: six[i], more: false };
    var pool = [];
    six.forEach(function (f) { if (sex !== 'm') pool.push({ fam: f, more: false }); });
    more.forEach(function (f) { if (sex !== 'm' || f.sex === 'm') pool.push({ fam: f, more: true }); });
    if (!pool.length) return { fam: six[familyOf(idx, v)], more: false };
    var want = pool[hash('family|' + v.seed) % pool.length];
    if (!want.more || haveMore) return want;
    /* his own voice is in the second sprite and it is not in yet: the nearest of the six by pitch until it is */
    var best = six[0], bd = 1e9;
    six.forEach(function (f) { var d = Math.abs(Math.log(want.fam.f0 / f.f0)); if (d < bd) { bd = d; best = f; } });
    return { fam: best, more: false, waiting: want.fam.id };
  }

  function make(opts) {
    opts = opts || {};
    var S = {
      NUM: NUM, dir: opts.dir || 'voice_heard/', idx: null, buf: null, shift: 0, loading: null, err: null,
      clock: opts.clock || null, said: 0, log: [], lead: !!opts.lead,
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
                self.loadMore(AC);
              });
          })
          .catch(function (e) { self.err = String(e); self.loading = null; });
        return this.loading;
      },
      /* the twenty more (10/25): their own sprite, after the first is in, its decoder's offset found the same way */
      more: null, moreErr: null, moreLoading: null,
      loadMore: function (AC) {
        var self = this, M = this.idx && this.idx.more; if (!M || this.more || this.moreLoading || !AC) return this.moreLoading;
        this.moreLoading = fetch(this.dir + M.file).then(function (r) { if (!r.ok) throw new Error(M.file + ' ' + r.status); return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (res, rej) { AC.decodeAudioData(ab, res, rej); }); })
          .then(function (b) {
            var d = b.getChannelData(0), n = Math.min(d.length, Math.floor(b.sampleRate * (M.onset + 0.25))), k;
            for (k = 0; k < n; k++) if (Math.abs(d[k]) > 0.01) break;
            var sh = (k < n) ? (k / b.sampleRate - M.onset) : 0; if (Math.abs(sh) > 0.08) sh = 0;
            self.more = { buf: b, shift: sh }; self.moreLoading = null;
          })
          .catch(function (e) { self.moreErr = String(e); self.moreLoading = null; });
        return this.moreLoading;
      },
      /* a player that borrowed the shell's first sprite (the town's walkers) borrows its second too: one copy on the phone */
      moreOf: function () {
        if (this.more) return this.more;
        try { var T = FLOOR_ROOT.SQUIGGLE; if (T && T !== this && T.more && T.idx === this.idx) return T.more; } catch (_e) {}
        return null;
      },

      say: function (text, v, AC, dest, when, mood, o) {
        if (!this.ready() || !AC || !dest || !v) return null;
        var idx = this.idx, buf = this.buf, self = this;
        o = o || {}; var lead = (o.lead != null) ? !!o.lead : this.lead;
        var BV = root.BOH_VOICE;
        var raw = String(text == null ? '' : text);
        var m = (mood === undefined) ? (BV && BV.moodOf ? BV.moodOf(raw) : { arousal: 0, valence: 0 }) : (mood || { arousal: 0, valence: 0 });
        var a = clamp(m.arousal || 0, -1, 1), val = clamp(m.valence || 0, -1, 1);
        var MO = this.moreOf(), pf = pickFamily(idx, v, o.sex !== undefined ? o.sex : sexOf(v.seed, o.src), !!MO);
        var fam = pf.fam, clips = pf.more ? idx.more.clips[fam.id] : idx.clips[fam.id];
        if (pf.more) { buf = MO.buf; }
        var shiftNow = pf.more ? MO.shift : self.shift;
        var rand = rng(hash('squiggle|' + v.seed + '|' + raw));

        /* HIS PITCH inside his family, and the mood's (Scherer; Juslin & Laukka: roused is higher), on the playback rate */
        var st = 12 * Math.log((v.f0 || fam.f0) / fam.f0) / Math.LN2;
        /* a real person (10/25) keeps his own register: his place in the cast's pitch range is two semitones either side of
           the speaker's own, never pulled up to the six's (a low man stays a low man) */
        if (fam.real) { var E = (BV && BV.ENVELOPE && BV.ENVELOPE.f0) || [168, 252]; st = 2 * (2 * clamp(Math.log((v.f0 || 200) / E[0]) / Math.log(E[1] / E[0]), 0, 1) - 1); }
        st = clamp(st, -NUM.MAX_ST, NUM.MAX_ST) + a * 3 + val * 0.6;
        var pitch = Math.pow(2, st / 12);
        /* HIS SPEED, ON THE GRID: letters a beat at 120 BPM (8, 10 or 12 a second), roused faster */
        var lpb = clamp(Math.round(((v.rate || fam.rate) * (1 + a * 0.28)) / 2), 4, 6), step = 0.5 / lpb;
        var drop = (v.drop != null ? v.drop : fam.drop) * (1 - val * 0.35 + a * 0.10);
        /* his wobble: his family's vibrato as the tape's own, capped at the law */
        var wHz = Math.min(NUM.CAP_HZ, Math.max(0.2, fam.vib || 0.3)), wDepth = Math.min(NUM.CAP_DEPTH - NUM.WOW, (fam.vibA || 0.008) * 0.5);
        var ph1 = rand() * 6.283, ph2 = rand() * 6.283;
        var amp0 = Math.pow(10, NUM.GAIN_DB / 20) * (1 + a * 0.25);

        /* SHORT (10/25): a line for him keeps CAP_LEAD letters, a mutter CAP_BG, cut at a word */
        var L = shorten(letters(raw), o.cap != null ? o.cap : (lead ? NUM.CAP_LEAD : NUM.CAP_BG));
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
        /* ONE AT A TIME (10/25): a mutter is said only into silence; refused, never queued, when anybody is talking */
        if (!lead && !offline(AC) && !floor.free(Date.now() + (t0 - AC.currentTime) * 1000)) { floorObj().refused++; return null; }

        var live = [], t = t0, said = 0, n = 0, lastTake = {}, creep = { dropped: [], doubled: [], breath: null, sag: sagN ? +sagD.toFixed(3) : 0 };
        /* ONE OUTPUT FOR THE LINE, at 1 and never automated until a cut: a cut fades THIS, so it never has to cancel a
           syllable's own envelope mid-ramp (measured 10/24: cancelling them clicked on 86 of 144 cut points) */
        var lineOut = AC.createGain(); lineOut.gain.value = 1; lineOut.connect(dest);
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
          node.connect(lineOut);
          s.start(at, Math.max(0, take[0] + shiftNow), dur);
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
          family: fam.id, real: !!fam.real, waiting: pf.waiting || null, lpb: lpb, pitch: +pitch.toFixed(4), creep: creep, rates: rates,
          stop: function () {
            /* a cut line fades on its own output, it never stops dead (a click); then every syllable stops after the fade */
            var now = AC.currentTime;
            try { lineOut.gain.setValueAtTime(1, now); lineOut.gain.linearRampToValueAtTime(0, now + NUM.CUT_FADE); } catch (_e) {}
            for (var k = 0; k < live.length; k++) { try { live[k].s.stop(now + NUM.CUT_FADE + 0.005); } catch (_e) {} }
          }
        };
        this.log.push({ family: fam.id, blips: n, seconds: h.seconds, creep: creep });
        if (this.log.length > 40) this.log.shift();
        /* on the floor: a line for him cuts every other voice in the game; every line fades the moment its frame is left */
        floor.claim(h, AC, { src: o.src || root, lead: lead });
        return h;
      }
    };
    return S;
  }

  root.BOH_VOICE_RECORDED = { make: make, NUM: NUM, familyOf: familyOf, letters: letters, hash: hash, shorten: shorten, floor: floor };
})(typeof window !== 'undefined' ? window : this);
