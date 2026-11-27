/* BOHEMIA -- EVERY SONG IN TURN (SOUNDS THREE, 11/27/26, rule 488(c)).

   PAOLO 11/27: 'I keep hearing the same songs. I thought we had lots of songs.' Rule 488(c): the rotation plays them all,
   no song twice in a row, the least-played next.

   MEASURED BEFORE (the alpha's own CITYMUS.pick called in the page, 400 hours of 25 picks, a song every 144 s: its 128 s
   pass and the street's 16 s rest): of 13 songs an hour played 11.5 different ones and 13.5 repeats; the first repeat
   came a median 12 minutes in (7.2 at the tenth percentile); a song could come back after 4.8 minutes. The pick drew at
   random every time (canon 8x, unjudged 4x) and remembered only the song playing now.

   NOW, in the shell (the alpha and the demo), over the music already there; it adds no song and no note:
   - SONGTURN.choose(candidates) is the one choice: never the song playing now (unless it is the only one), a song he took
     out in the MUSIC tab (its verdict 0) only when nothing else is left, then THE LEAST PLAYED THIS SESSION, and among
     those the one he heard longest ago (across sessions, kept in this browser), a tie drawn at random. So every song in a
     pool plays once before any plays twice, and a new session starts with what the last one did not reach.
   - It is asked by the street's pick (CITYMUS.pick, whose first line calls it: the street, the song after a battle, the
     part of town, the song queued a phrase early so its recording is in), the opening's (MENUMUS.pick), the fence's
     (SONGFENCE.pick: a song outside his set swapped for one inside it), and the faction song's hand-off to a fight
     (PARTOFTOWN.fightSong, its own pool: songs with a live engine, the ones held ready first).
   - A song's turns this session are the more of its plays and its choices, so picks made while the music is off still
     go round the pool.
   - PLAYED is what the transport actually started: MUS.cur read every 250 ms while the music plays, counted once each
     time it changes. A choice that never sounded is not a play.
   - Kept in localStorage ('bohemia.songs.in.turn.v1', every read and write in a try: a private window plays the same
     turns, it only forgets them at the end of the session).

   window.SONGTURN: { choose, session, last, order (the songs started, in order), state() } for the gate.
   The patch: tools/bohemia_sounds_every_song_in_turn_patch.py (inlines this file byte for byte, and the hook line in the
   two picks). The gate: gates/every_song_in_turn_gate.js. */
(function (root) {
  'use strict';
  var KEY = 'bohemia.songs.in.turn.v1';
  var TICK = 250;

  function install(W) {
    if (W.SONGTURN) return W.SONGTURN;
    var T = W.SONGTURN = { session: {}, chosen: {}, last: {}, seq: 0, order: [], choices: 0, started: 0, errs: [] };
    /* the page's own globals: MUS and MLOOPS are top-level consts, not window's properties */
    var GET = {};
    function G(n) {
      if (W[n] !== undefined) return W[n];
      try { if (!GET[n]) GET[n] = W.Function('return typeof ' + n + " !== 'undefined' ? " + n + ' : undefined;'); return GET[n](); } catch (e) { return undefined; }
    }
    function nameOf(fi) { try { var f = G('MUS').lib()[fi]; return f ? f.n : null; } catch (e) { return null; } }
    function keyOf(c) { var n = c ? nameOf(c.fi) : null; return n ? n + ((c.slot || 1) === 2 ? ' (SONG 2)' : '') : null; }
    T.keyOf = keyOf;
    try { var j = JSON.parse(W.localStorage.getItem(KEY) || 'null'); if (j && j.last && typeof j.last === 'object') { T.last = j.last; T.seq = j.seq | 0; } } catch (e) {}
    function save() { try { W.localStorage.setItem(KEY, JSON.stringify({ seq: T.seq, last: T.last })); } catch (e) {} }

    T.choose = function (cs) {
      if (!cs || !cs.length) return null;
      if (cs.length === 1) return cs[0];
      var M = G('MUS'), cur = M ? M.cur : null, curSlot = M ? (M.curSlot || 1) : 1;
      var pool = cs.filter(function (c) { return !(c.fi === cur && (c.slot || 1) === curSlot); });
      if (!pool.length) pool = cs.slice();
      var V = M && M.V;
      var kept = pool.filter(function (c) { var n = nameOf(c.fi); return !(V && n && V[n + '#' + (c.slot || 1)] === 0); });
      if (kept.length) pool = kept;
      /* the order: its turns this session (played, or chosen: picks made while the music is off still take a turn), then
         heard longest ago */
      var bs = Infinity, bl = Infinity, ties = [];
      pool.forEach(function (c) {
        var k = keyOf(c), s = Math.max(T.session[k] || 0, T.chosen[k] || 0), l = T.last[k] == null ? -1 : T.last[k];
        if (s < bs || (s === bs && l < bl)) { bs = s; bl = l; ties = [c]; }
        else if (s === bs && l === bl) ties.push(c);
      });
      T.choices++;
      var got = ties[(Math.random() * ties.length) | 0], gk = keyOf(got); if (gk) T.chosen[gk] = (T.chosen[gk] || 0) + 1;
      return got;
    };

    /* PLAYED: what the transport started */
    var seen = null;
    T.tick = function () {
      try {
        var M = G('MUS'); if (!M || !M.playing) return;
        var c = { fi: M.cur, slot: M.curSlot || 1 }, k = keyOf(c); if (!k) return;
        var id = c.fi + ':' + c.slot; if (id === seen) return; seen = id;
        T.started++; T.session[k] = (T.session[k] || 0) + 1; T.last[k] = ++T.seq;
        T.order.push(k); if (T.order.length > 240) T.order.shift();
        save();
      } catch (e) { T.errs.push('tick: ' + e.message); if (T.errs.length > 20) T.errs.shift(); }
    };
    T.timer = setInterval(T.tick, TICK);

    /* THE FENCE'S PICK (a song outside his set swapped for one inside it): the same choice over his set */
    var F = G('SONGFENCE');
    if (F && F.pool) {
      T.fencePick0 = F.pick;
      F.pick = function () { var cs = F.pool(); return cs.length ? T.choose(cs) : null; };
    }
    /* THE FACTION SONG'S HAND-OFF TO A FIGHT (rule 237(d)): its own pool, as engine/bohemia_part_of_town.js builds it (songs
       his engine plays live at once, the ones whose recording is already held first), then the same choice */
    var P = W.PARTOFTOWN;
    if (P && P.fightSong && P.fence) {
      T.fightSong0 = P.fightSong;
      P.fightSong = function () {
        try {
          var B = W.SONGBOOK, cs = P.fence.pool(), held = [], live = [];
          cs.forEach(function (c) { var n = nameOf(c.fi), b = B && B.book && B.book.songs[n];
            if (b && b.row) return; live.push(c);
            var st = B && B.sets && B.sets[n]; if (st && st.buf && (st.buf.level_1 || st.buf.level_2)) held.push(c); });
          var pool = held.length ? held : live;
          return pool.length ? T.choose(pool) : T.fightSong0.call(P);
        } catch (e) { T.errs.push('fight: ' + e.message); return T.fightSong0.call(P); }
      };
    }

    T.state = function () {
      return { started: T.started, choices: T.choices, session: T.session, order: T.order.slice(-40), errs: T.errs.slice(-5),
        hooked: { fence: !!T.fencePick0, fight: !!T.fightSong0 } };
    };
    return T;
  }

  root.BOH_EVERY_SONG_IN_TURN = { KEY: KEY, install: install };
})(typeof window !== 'undefined' ? window : globalThis);
