/* BOHEMIA -- THE MAP PLAYS THE PART OF TOWN YOU ARE IN (SOUNDS, 10/26, row [the map plays the part of town you are in], rule 237;
   Paolo 10/26: 'each one's gonna get its own song... I already have faction music, so just put those in for now... they can be the
   placeholder as they are... maybe the music should change depending on what part of town you're closest to on the overworld map,
   that's the whole point of this vibe... depending on the tiles you're walking on the sound changes, super important to me').

   WHAT IT DOES, in the shell (the alpha and the demo), over the music that is already there (his engine MUS, the street's CITYMUS,
   the fence SONGFENCE, the ladder INTENSITY); it adds no song and no note:
   (a) THE FENCE OPENS FOR THE FACTION SONGS (237(a), amends 122): a song his MUSIC tab tags with one of the thirteen faction
       categories (ANARCHISTS to TRADES, his 7/19 rulings in CAT_DEFAULTS) may sound. The menu's, the day's, dusk and dawn's and the
       rooms' songs stay silent; the open road, the opening and a fight still draw only from his overworld set.
   (b) EVERY ORIGIN ITS SONG (237(b)): ORIGIN_SONG below (SOUNDS' table, his to change: THE FAITHFUL the CHURCH's and THE WATER TRUCK
       the CARAVANS', his words). The opening tape asks for it (window.__originSong(origin, 'intro' | 'done'), RUN THREE's call) and
       it plays at once on the beat; at home (his own company's ground, the CUSTOM turf, or his camp) it plays again.
   (c) THE MAP PLAYS THE PART OF TOWN (237(c)): every four seconds the map reports where the party is (BOHEMIA_WHERE); this asks the
       map whose ground that is (turfAt, the map's own owner of every cell; the nearest owned cell within NEAR cells counts, so the
       edge of a district is that district) and the music follows: a faction's ground its faction song, the open land between the
       thirteen overworld songs. The change waits for the song's next phrase line (eight bars, 128 steps) and comes in on the beat,
       never a cut.
   (d) A LOW LEVEL ON THE MAP, A CLOSING THREAT RAISES IT (237(d)): the map plays level 1 (rule 207); a crew out to take something
       within THREAT cells of the party lifts it to level 2 until it is gone; a fight keeps 207's three levels and its songs
       (a faction song playing when a fight comes up gives way to one of his overworld songs, which carry the recorded levels).
   The gate is gates/the_map_plays_the_part_of_town_gate.js; the patch tools/bohemia_part_of_town_patch.py.

   BOH_PART_OF_TOWN.install(window) -> window.PARTOFTOWN (the state, for the gate) */
(function (root) {
  'use strict';
  var FACTIONS = ['ANARCHISTS', 'HOMELESS', 'NETWORK', 'CHURCH', 'VOLUNTEERS', 'CARAVANS', 'COLORFUL', 'MOB', 'CARTEL', 'REDS', 'BLUES', 'REMNANTS', 'TRADES'];
  /* each origin its faction song: two are his (237(b)); the rest SOUNDS' reading of the origin's own line, in the record */
  var ORIGIN_SONG = {
    rebuild: 'REDS',        /* THE CREW THAT IS LEFT: 'a debt paid off, and a name to fix' -> The Foreclosure Notice */
    newcrew: 'TRADES',      /* A NEW CREW: 'start clean' -> What the Apprentice Builds */
    south: 'CARTEL',        /* UP FROM HENDERSON: north on the 95 with three guns -> The Counting Room */
    truck: 'CARAVANS',      /* THE WATER TRUCK: his word -> Highway 15 South */
    watch: 'VOLUNTEERS',    /* THE BLOCK WATCH: twelve neighbours with pipes -> Hands That Still Build */
    scav: 'HOMELESS',       /* THE SCAVENGERS: every gutted store to the dam -> Dead Man's Slide */
    promise: 'CHURCH',      /* THE PROMISE KEEPERS: a promise made at a grave -> Fluorescent Dawn */
    desert: 'REMNANTS',     /* THE DESERTERS: walked off a faction's line -> Throne of Static */
    raid: 'ANARCHISTS',     /* THE RAIDERS: you take -> Broken Window Anthem */
    lab: 'NETWORK',         /* THE LAB RATS: the lab the animals broke out of -> Delta Blues, Server Farm */
    faith: 'CHURCH',        /* THE FAITHFUL: his word -> Fluorescent Dawn */
    debt: 'MOB',            /* THE DEBT COLLECTORS: the two collect -> The Boss Takes His Cut */
    hunt: 'REMNANTS',       /* THE HUNTERS: out where the static is -> Throne of Static */
    pit: 'COLORFUL',        /* THE FIGHT PIT: a casino floor that charged to watch -> Parade of Lost Balloons */
    wolf: 'BLUES'           /* THE LONE WOLF: just you -> The Last Good Check */
  };
  var NUM = { NEAR: 2, THREAT: 3, PHRASE: 128, TICK: 150 };

  function install(W) {
    if (W.PARTOFTOWN) return W.PARTOFTOWN;
    var T = W.PARTOFTOWN = { NUM: NUM, FACTIONS: FACTIONS, ORIGIN_SONG: ORIGIN_SONG, faction: null, home: false, camp: false, origin: null,
      tape: null, threat: false, at: null, reports: 0, pendAt: null, pendFor: undefined, turns: [], log: [], errs: [] };
    function note(o) { o.t = Date.now(); T.log.push(o); if (T.log.length > 120) T.log.shift(); }
    /* the page's own globals: MUS, MLOOPS, MFACTIONS and CAT_DEFAULTS are top-level consts (not window's properties); a function
       made here runs in the page's global scope and reads them by name */
    var GET = {};
    function G(n) {
      if (W[n] !== undefined) return W[n];
      try { if (!GET[n]) GET[n] = W.Function('return typeof ' + n + " !== 'undefined' ? " + n + ' : undefined;'); return GET[n](); } catch (e) { return undefined; }
    }
    T.G = G;
    function nf() { try { return G('MFACTIONS').length; } catch (e) { return 0; } }
    function lib() { try { return G('MUS').lib(); } catch (e) { return []; } }
    function nameOf(fi) { var f = lib()[fi]; return f ? f.n : null; }
    function catsOf(n) {
      var c = null;
      try { var M = G('MUS'); if (M && M.cats) c = M.cats[n + '#1']; } catch (e) {}
      try { var D = G('CAT_DEFAULTS'); if (!c && D) c = D[n + '#1']; } catch (e) {}
      return c || [];
    }
    function factionOfSong(fi, slot) {
      if (fi == null || fi < nf() || (slot || 1) !== 1) return null;
      var c = catsOf(nameOf(fi)); for (var i = 0; i < c.length; i++) if (FACTIONS.indexOf(c[i]) >= 0) return c[i];
      return null;
    }
    T.factionOfSong = factionOfSong;
    T.isFaction = function (c) { return !!(c && factionOfSong(c.fi, c.slot)); };
    /* every song his MUSIC tab files under a faction (NETWORK has two) */
    T.songsOf = function (cat) {
      var out = [], L = lib(), k = nf();
      for (var fi = k; fi < L.length; fi++) if (catsOf(L[fi].n).indexOf(cat) >= 0) out.push({ fi: fi, slot: 1 });
      return out;
    };
    /* what the music should be now: the tape's song, home's, the part of town's, or null for the open road */
    T.want = function () {
      if (T.tape) return T.tape;
      if ((T.home || T.camp) && T.origin && ORIGIN_SONG[T.origin]) return ORIGIN_SONG[T.origin];
      return T.faction;
    };
    T.now = function () { try { var M = G('MUS'); return factionOfSong(M.cur, M.curSlot || 1); } catch (e) { return null; } };
    function matches() { var w = T.want(), n = T.now(); return w ? n === w : !n; }
    T.matches = matches;
    /* a fight owns the music from the moment its frame is in the page (the rebuilt fight never turns FIGHTMUS on) */
    function fightOn() {
      try { if (W.document.getElementById('fightFrame')) return true; } catch (e) {}
      try { var K = G('INTENSITY'); if (K && (K.threat || K.nf)) return true; } catch (e) {}
      var FM = G('FIGHTMUS'); return !!(FM && FM.on);
    }
    T.fightOn = fightOn;

    /* ---- (a) THE FENCE OPENS FOR THE FACTION SONGS, AND ONLY FOR THEM ---- */
    var F = G('SONGFENCE');
    if (F) {
      var allowed0 = F.allowed, pool0 = F.pool, fight0 = F.fight;
      F.allowed = function (fi, slot) { return allowed0.call(F, fi, slot) || !!factionOfSong(fi, slot); };
      /* the open road, the opening, a fight and the song after one draw from his overworld set as before */
      F.pool = function () { return pool0.call(F).filter(function (c) { return !factionOfSong(c.fi, c.slot); }); };
      /* a fight keeps 207's recorded levels: a faction song playing gives way to one of his overworld songs, one his engine can
         play live at once (the four new songs have no notes but their recording: picked, they were silent until it decoded,
         measured 10/26, six silent windows at the fight's first frame), the one whose recording is already held first */
      T.fightSong = function () {
        var B = W.SONGBOOK, cs = F.pool(), held = [], live = [];
        cs.forEach(function (c) { var n = nameOf(c.fi), b = B && B.book && B.book.songs[n];
          if (b && b.row) return; live.push(c);
          var st = B && B.sets && B.sets[n]; if (st && st.buf && (st.buf.level_1 || st.buf.level_2)) held.push(c); });
        var pool = held.length ? held : live;
        if (!pool.length) return F.pick();
        var M = G('MUS'), fresh = pool.filter(function (c) { return c.fi !== M.cur; });
        pool = fresh.length ? fresh : pool;
        return pool[(Math.random() * pool.length) | 0];
      };
      F.fight = function () {
        if (T.now()) { var c = T.nextFight || T.fightSong(); T.nextFight = null; if (c) { var M = G('MUS'); note({ fight: 'faction song gives way', from: nameOf(M.cur), to: nameOf(c.fi) }); M.cur = c.fi; M.curSlot = c.slot; return; } }
        return fight0.call(F);
      };
      T.fence = F;
    }
    try { var IM = G('INTERIORMUS'), ic = IM.candidates; IM.candidates = function () { return ic.call(IM).filter(function (c) { return !factionOfSong(c.fi, c.slot); }); }; } catch (e) {}

    /* ---- (c) THE STREET'S PICK ASKS WHERE HE IS ---- */
    var C = G('CITYMUS');
    if (C) {
      var cand0 = C.candidates;
      C.candidates = function () {
        if (fightOn()) return cand0.call(C);             /* in a fight, his overworld set, as before */
        var w = T.want();
        if (w) { var s = T.songsOf(w); if (s.length) return s; }
        return cand0.call(C);
      };
    }
    /* a song in now, on the beat (the street's own play: step 0 on the next beat of the one clock) */
    function playNow(why) {
      try {
        if (!C) return false;
        var M = G('MUS'), from = nameOf(M.cur);
        if (C.resting) { C.pend = true; C.pendAt = null; note({ turn: why, rest: true }); return true; }
        C.play();
        var o = { turn: why, from: from, to: nameOf(M.cur), want: T.want(), oldStep: T.oldStep, step0: true, ac: M.AC ? +M.AC.currentTime.toFixed(3) : null, nextT: M.nextT };
        T.turns.push(o); if (T.turns.length > 60) T.turns.shift(); note(o);
        return true;
      } catch (e) { T.errs.push('play: ' + e.message); return false; }
    }
    T.playNow = playNow;
    /* the change waits for the next phrase line: armed here, played by the watch when the transport reaches it */
    function arm(why) {
      if (matches()) { T.pendAt = null; T.pendFor = undefined; return; }
      var w = T.want();
      if (T.pendAt != null && T.pendFor === w) return;
      var st = 0; try { st = G('MUS').step | 0; } catch (e) {}
      T.pendAt = (Math.floor(st / NUM.PHRASE) + 1) * NUM.PHRASE; T.pendFor = w; T.pendWhy = why; T.armedAt = Date.now();
      note({ arm: why, want: w, now: T.now(), at: T.pendAt, step: st });
    }
    T.arm = arm;
    T.watch = setInterval(function () {
      try {
        /* THE FIGHT IS COMING (its frame is in the page, seconds before its board): a faction song gives way now, so the
           fight's song is sounding and its recorded levels decode before the first turn */
        /* while a faction song plays on the map, the song a fight would take is chosen now and held ready (SONGBOOK.warm) */
        var B = W.SONGBOOK;
        if (B && T.now() && !fightOn()) {
          if (!T.nextFight) { T.nextFight = T.fightSong(); if (T.nextFight) note({ warm: nameOf(T.nextFight.fi) }); }
          if (T.nextFight) B.warm = [nameOf(T.nextFight.fi)];
        } else if (B && !T.now() && B.warm && B.warm.length && !fightOn()) { B.warm = []; T.nextFight = null; }
        var ff = W.document.getElementById('fightFrame');
        if (ff && !T.fightSwapped) { T.fightSwapped = true; if (T.now() && F) F.fight(); }
        else if (!ff) T.fightSwapped = false;
        if (T.pendAt == null || fightOn()) return;      /* the part of town waits until the fight is over */
        if (!C || !C.on) return;    /* somebody else owns the music: the turn waits */
        if (matches()) { T.pendAt = null; T.pendFor = undefined; return; }
        var st = G('MUS').step | 0;
        /* the song started over under us (the street's own turn, a rest): the next line is counted from where it is now */
        if (st < T.pendAt - NUM.PHRASE) { T.pendAt = (Math.floor(st / NUM.PHRASE) + 1) * NUM.PHRASE; return; }
        /* in the last beat before the line: the new song's first step is booked on the next beat, the line itself */
        if (st < T.pendAt - 3) return;
        T.oldStep = st; T.pendAt = null; var why = T.pendWhy; T.pendFor = undefined;
        playNow(why || 'phrase'); T.oldStep = null;
      } catch (e) { T.errs.push('watch: ' + e.message); }
    }, NUM.TICK);

    /* ---- where the party is: the map's own answer, read through the report it already sends ---- */
    function read(win) {
      var at = win.roadWhere(), best = null, bd = 99, x = at[0] | 0, y = at[1] | 0;
      for (var r = 0; r <= NUM.NEAR && !best; r++) {
        var tally = {};
        for (var dx = -r; dx <= r; dx++) for (var dy = -r; dy <= r; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          var t = null; try { t = win.turfAt(x + dx, y + dy); } catch (e) { t = null; }
          var f = t && t.faction ? String(t.faction).toUpperCase() : null;
          if (f) tally[f] = (tally[f] || 0) + 1;
        }
        for (var k in tally) if (!best || tally[k] > tally[best]) best = k;
        if (best) bd = r;
      }
      var camp = false; try { camp = !!(win.CAMP && (win.CAMP.on || win.CAMP.active || win.CAMP.pitched)); } catch (e) {}
      var threat = false;
      try { (win.partiesNear(NUM.THREAT) || []).forEach(function (p) { var q = p.party || p; if (q && q.agenda === 'crew' && q.from && q.from.faction !== 'Custom') threat = true; }); } catch (e) {}
      return { x: x, y: y, faction: best, dist: best ? bd : null, camp: camp, threat: threat };
    }
    T.read = read;
    function originFrom(win) {
      try { var s = win.__START_IN_TOWN; if (s && s.origin) return s.origin; } catch (e) {}
      try { var j = JSON.parse(W.localStorage.getItem('bohemia.origin.roll.v1') || 'null'); if (j && (j.origin || j.id)) return j.origin || j.id; } catch (e) {}
      return null;
    }
    T.report = function (win, d) {
      if (d && d.inside) return;
      var r; try { r = read(win); } catch (e) { T.errs.push('read: ' + e.message); return; }
      T.reports++; T.at = r;
      if (!T.origin) T.origin = originFrom(win);
      var home = r.faction === 'CUSTOM';
      T.home = home; T.camp = r.camp;
      T.faction = (r.faction && FACTIONS.indexOf(r.faction) >= 0) ? r.faction : null;
      if (r.threat !== T.threat) { T.threat = r.threat; note({ threat: r.threat }); try { G('INTENSITY').apply(); } catch (e) {} }
      arm('where');
    };

    /* ---- (d) A CLOSING THREAT LIFTS THE MAP ONE LEVEL ---- */
    try {
      var K = G('INTENSITY'), lv0 = K.level;
      K.level = function () {
        var v = lv0.call(this);
        if (v === 1 && T.threat && C && C.on && !fightOn()) return 2;
        return v;
      };
    } catch (e) { T.errs.push('ladder: ' + e.message); }

    /* ---- (b) THE TAPE ASKS FOR THE ORIGIN'S SONG ---- */
    W.__originSong = function (origin, phase) {
      try {
        if (origin) T.origin = origin;
        if (phase === 'intro') {
          T.tape = ORIGIN_SONG[T.origin] || null;
          note({ tape: 'intro', origin: T.origin, song: T.tape });
          if (T.tape && !matches()) playNow('the tape');
        } else {
          T.tape = null; note({ tape: phase || 'done', origin: T.origin });
          arm('after the tape');
        }
      } catch (e) { T.errs.push('origin: ' + e.message); }
    };

    W.addEventListener('message', function (ev) {
      var d = ev && ev.data; if (!d || !d.type) return;
      try {
        if (d.type === 'BOHEMIA_WHERE' && d.from === 'city' && ev.source && ev.source !== W && typeof ev.source.turfAt === 'function') T.report(ev.source, d);
        else if (d.type === 'BOHEMIA_COMBAT_STARTED' && T.now() && F) { F.fight(); }
      } catch (e) { T.errs.push('msg: ' + e.message); }
    });
    return T;
  }

  root.BOH_PART_OF_TOWN = { FACTIONS: FACTIONS, ORIGIN_SONG: ORIGIN_SONG, NUM: NUM, install: install };
})(typeof window !== 'undefined' ? window : globalThis);
