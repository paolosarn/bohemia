/* ============================================================================
   BOHEMIA -- SCAVENGE, THE BLOCK PLAYS THE SONG: THE RULES (SCAVENGE 2, 11/10/26; the skeleton is SCAVENGE's, 11/7).
   PAOLO 11/10 (rule 444(c), ask line 570): 'the scavenge mini game needs a little more love. I feel the skeleton, I appreciate it,
   but it's not rhythm based; out of everything I want that to be the most rhythm based minigame'.
   PAOLO 11/7, YES on the skeleton (rule 426(b)): 'I want it to be like a fun minigame'. His three, ONE game (rule 331, LOCKED 11/2):
   'Search houses, the detector, the siphon... somehow involving some rhythm-based game working in the Dead Shot Dial'.
   Rule 334 (11/2): 'our crew, whoever is in it, you'll see them on the screen... makes you feel like you're scavenging on the rhythm'.

   THIS FILE IS THE RULES ONLY: no drawing, no page, no sound, nothing of the fight. Node and browser (root.BohemiaScavengeGame).
   The page that plays it is slices/BOHEMIA_SCAVENGE.html; the dial's bands are engine/bohemia_dial.js (the old fight's stamped
   engine, one module); the gate is gates/scavenge_is_the_rhythm_gate.js; the record with the research is
   records/BOHEMIA_SCAVENGE_TWO_THE_BLOCK_PLAYS_THE_SONG_11_10_26.md.

   WHAT IT DECIDES
   1. THE MAP PICKS THE SPOTS (THE SKELETON, UNCHANGED), from the dealt board's own tiles (the board a fight on this block deals): a
      house tile (a roof, level 1 or more) -> SEARCH, from the open tile at its door; a tile with a dead car on it (a cover piece named
      *car*) -> SIPHON, from the open tile beside it; open dirt or a yard by the houses (level 0, no cover, rough first) -> DETECTOR,
      on the tile itself. Never a list of places: a block with no cars has no siphon. At most SIX at once, never more than the lot's
      count says is left, at least one of each kind the board has, the rest in turn, nearest the crew first.
   2. EVERY SPOT IS A PHRASE HE PLAYS (new): four to eight beats of the song at 120 BPM, as BEATS THAT COME TO THE MAN. A beat is
      born at the thing (the door, the dirt, the tank), comes to the end of the dial's track and RIDES THE TRACK to the middle in two
      beats; he taps as it crosses the middle. THE DIAL'S OWN BANDS ARE THE JUDGE: with a two-beat ride the old dial's ember, amber
      and blue are 48, 115 and 248 ms each side of the beat (hZ, vZ, hitZ over LIM, times the ride), which is where good rhythm
      games put their windows; a package only widens or narrows them (WINDOW).
      SEARCH   a house: taps on the beat (one bar, with the odd 'and' from NORMAL up; two bars from HARD up);
      DETECTOR call and response: the detector beeps a bar, each beep a bead born at the dirt; a bar later the same beads reach
               the middle and he taps the bar back;
      SIPHON   hold and let go: a slug rides the track, press as its head crosses the middle, let go as its tail does. Let go too
               soon and the hose coughs; hold past it and it is a mouthful. Both: nothing from that gulp.
   3. THE FIND IS AS GOOD AS HIS TIMING: each note takes the dial's zone at his touch (dead centre 3, amber 2, blue 1, out 0), a
      tap that meets no beat costs one, and the share of the phrase he took is the old dial's four results: DEAD CENTRE the best
      thing there, GOOD an ordinary thing, SCRAPS the least, NOTHING. Always ONE thing or nothing (EVERYTHING COSTS ONE). What each
      place holds is unchanged (a house meds / food / tape; the ground, where a detector hears METAL, batteries / rounds / tape; a
      car its gas traded for a battery / food / tape).
   4. FORGIVING ON A THUMB: a tap goes to the beat he is late for (match); a let-go is judged wider than a press (RELEASE_SLACK); the first
      beat of a visit wider still (FIRST_SLACK); and THE ALLOWANCE (LAG): the judge follows the middle of his own last taps, so a
      phone, a slow glass or a Bluetooth ear that runs him steadily late (or early) is taken out, and the picture never moves.
   NOT HERE (rule 331, not approved, unchanged): a noise meter, anyone coming, hours per search, greed, loot by district, a combo
   that pays. The COMBO across spots (rule 444(c): 'a combo across spots feels good') is counted here and FELT on the page (the
   crew, the sound), and it never changes a find. The outing costs what the SCAVENGE button already cost (four hours, once).
   EVERY NUMBER A PLAYER FEELS IS IN THE TABLE BELOW (TUNING, rule 38g: one place to read and change them).
   Words: the cue words and the result words below are draft:true.
   ============================================================================ */
(function (root) {
  'use strict';
  var MAX_SPOTS = 6;
  var FINDS = {
    house:  { kill: 'medicine', vital: 'food', hit: 'tape' },
    ground: { kill: 'battery',  vital: 'ammo', hit: 'tape' },
    car:    { kill: 'battery',  vital: 'food', hit: 'tape' }
  };

  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

  /* ------------------------------------------------------------------ 1. the spots, from the dealt board
     board: { w, h, tiles: [[{ lvl, pass, terr, cover }]] } (cover: the cover piece's name or ''), crew: [{ x, y }] */
  /* a dead car: a cover piece that IS a car (yards_car, strip_car, car_kerb, ...), never the carts (a golf cart runs on batteries, a
     luggage cart on nothing) */
  function carAt(t) { return !!(t && t.cover && /(^|_)car(_|$)/i.test(t.cover)); }
  function at(board, x, y) { return x >= 0 && y >= 0 && x < board.w && y < board.h ? board.tiles[y][x] : null; }
  /* A HOUSE: on a board laid from the map, the map's own house or shop (the fight's FIGHT.isRoof reads the map's roofs there); on a
     template board, a raised tile of a block of built ground. Raised LAND is never a house: the canyon's shelves, the desert's and the
     wash's rises, a freeway's deck, the rail bed, a landfill's pile (slices/fight_ground/fight_ground.json's block families). */
  var LAND = ['basin', 'canyon', 'desert', 'golf', 'lakebed', 'pass', 'scrub', 'scrubroad', 'shore', 'wash', 'landfill', 'dump', 'freeway', 'freewayo', 'rail'];
  function houseAt(t) {
    if (!t) return false;
    if (t.laid) return !!t.roof;
    return t.lvl > 0 && t.terr !== 'blocked' && !(t.fam && LAND.indexOf(t.fam) >= 0);
  }
  function openTile(t) { return !!(t && t.pass && !(t.lvl > 0) && !t.cover && t.terr !== 'blocked' && t.terr !== 'water'); }
  var ASPHALT = 92;   /* a tile whose own ground reads darker than this on the baked board is road (luma 0..255; the page measures it) */
  function dirt(t) { return openTile(t) && !(t.luma != null && t.luma < ASPHALT); }
  var N4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  var N8 = N4.concat([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  function standBeside(board, x, y, near) {
    var best = null;
    N4.forEach(function (d) { var X = x + d[0], Y = y + d[1], t = at(board, X, Y); if (!openTile(t)) return;
      var k = Math.abs(X - near.x) + Math.abs(Y - near.y) + (d[1] === 1 ? -0.5 : 0);   /* the front (south, toward the camera) first */
      if (!best || k < best.k) best = { x: X, y: Y, k: k }; });
    return best;
  }
  function candidates(board, near) {
    var out = { house: [], ground: [], car: [] }, built = false;
    for (var yy = 0; yy < board.h && !built; yy++) for (var xx = 0; xx < board.w; xx++) if (houseAt(at(board, xx, yy))) { built = true; break; }
    for (var y = 0; y < board.h; y++) for (var x = 0; x < board.w; x++) {
      var t = at(board, x, y); if (!t) continue;
      if (houseAt(t)) {
        /* A COMBAT TILE IS A HOUSE (Paolo 9/4, 9/28): every roof tile is one house to search, from the open tile at its door */
        var sd = standBeside(board, x, y, near);
        if (sd) out.house.push({ kind: 'house', x: x, y: y, sx: sd.x, sy: sd.y });
      } else if (carAt(t)) {
        var s2 = standBeside(board, x, y, near); if (s2) out.car.push({ kind: 'car', x: x, y: y, sx: s2.x, sy: s2.y });
      } else if (dirt(t)) {
        var byHouse = false, byCar = false;
        N8.forEach(function (d) { var u = at(board, x + d[0], y + d[1]); if (houseAt(u)) byHouse = true; if (carAt(u)) byCar = true; });
        /* in a built block: the yards by the houses and the rough lots; on open land (no house on the board), any dirt */
        if (!byCar && (t.terr === 'rough' || byHouse || !built)) out.ground.push({ kind: 'ground', x: x, y: y, sx: x, sy: y, rough: t.terr === 'rough' });
      }
    }
    return out;
  }
  function centroid(crew) {
    if (!crew || !crew.length) return { x: 0, y: 0 };
    var x = 0, y = 0; crew.forEach(function (c) { x += c.x; y += c.y; }); return { x: x / crew.length, y: y / crew.length };
  }
  function spots(board, o) {
    o = o || {};
    var n = Math.max(0, Math.min(MAX_SPOTS, o.n == null ? MAX_SPOTS : o.n | 0));
    var near = o.near || centroid(board.crew), r = rng(o.seed || 1), C = candidates(board, near);
    var crewAt = {}; (board.crew || []).forEach(function (c) { crewAt[c.x + ',' + c.y] = 1; });
    var dist = function (s) { return Math.hypot(s.sx - near.x, s.sy - near.y) + (s.rough ? -0.5 : 0) + r() * 0.8; };
    ['house', 'ground', 'car'].forEach(function (k) {
      C[k] = C[k].filter(function (s) { return !crewAt[s.sx + ',' + s.sy] && !crewAt[s.x + ',' + s.y] && (!o.keep || o.keep(s)); })   /* o.keep: the page keeps the spots it can show (on the glass, clear of the plate) */
        .map(function (s) { s.d = dist(s); return s; }).sort(function (a, b) { return a.d - b.d; });
    });
    var kinds = ['house', 'ground', 'car'].filter(function (k) { return C[k].length; })
      .sort(function (a, b) { return C[b].length - C[a].length; });
    var chosen = [], used = {}, idx = { house: 0, ground: 0, car: 0 };
    /* two spots never share a tile or a stand, and never sit side by side (their marks and labels would touch) */
    var clash = function (s) { return chosen.some(function (c) { return Math.abs(c.x - s.x) + Math.abs(c.y - s.y) <= 1 || (c.sx === s.sx && c.sy === s.sy) || (c.sx === s.x && c.sy === s.y) || (s.sx === c.x && s.sy === c.y); }); };
    var guard = 0;
    while (chosen.length < n && kinds.length && guard++ < 200) {
      for (var i = 0; i < kinds.length && chosen.length < n; i++) {
        var k = kinds[i], L = C[k];
        while (idx[k] < L.length && clash(L[idx[k]])) idx[k]++;
        if (idx[k] >= L.length) { kinds.splice(i, 1); i--; continue; }
        var s = L[idx[k]++]; s.id = k + ':' + s.x + ',' + s.y; delete s.d; chosen.push(s); used[s.id] = 1;
      }
    }
    return chosen;
  }

  /* ------------------------------------------------------------------ 2. THE PHRASE: the table of every number he feels */
  var BPM = 120, BEAT_MS = 60000 / BPM;
  var RIDE_BEATS = 2;              /* a beat rides the dial's track from its end to the middle in two beats (one second to read it) */
  var HOUSE_DRIFT = 1, CAR_DRIFT = 1;   /* beats from the thing to the end of the track, before the ride (the detector's is its call's length less the ride) */
  var WINDOW = { 0: 1.5, 1: 1.25, 2: 1, 3: 0.85, 4: 0.7 };   /* the dial's bands, times this, by package (EASY ... BOHEMIAN); NORMAL: 60 / 143 / 310 ms */
  var RELEASE_SLACK = 1.3;         /* a let-go is judged this much wider than a press (a thumb leaves the glass less exactly than it lands) */
  var FIRST_SLACK = 1.5;           /* the first beat of a visit: wider still, the lesson is free */
  var POINTS = { kill: 3, vital: 2, hit: 1, miss: 0 };
  var STRAY_COST = 1;              /* a tap that meets no beat (mashing): a third of a note */
  var SHARE = { kill: 0.8, vital: 0.55, hit: 0.25 };   /* the share of the phrase's points for DEAD CENTRE / GOOD / SCRAPS */
  var LAG = { KEEP: 8, FROM: 3, MIN: -70, MAX: 190, SURE: 25, WILD: 100 };   /* THE ALLOWANCE: the median of his last KEEP offsets, from the third on, inside MIN..MAX ms; trusted in full when they sit within SURE ms of it, not at all past WILD */
  var COMBO_STEPS = [4, 8, 16, 24];                     /* where the crew and the sound step up; never a find */
  var ZONE_WORD = { kill: 'DEAD CENTRE', vital: 'GOOD', hit: 'SCRAPS', miss: 'NOTHING' };   /* the phrase (draft:true) */
  var TAP_WORD = { kill: 'DEAD ON', vital: 'GOOD', early: 'EARLY', late: 'LATE', miss: 'MISS', cough: 'TOO SOON', mouthful: 'A MOUTHFUL' };   /* a tap (draft:true) */
  var CUE = { house: ['TAP THE BEAT'], ground: ['LISTEN', 'TAP IT BACK'], car: ['HOLD', 'LET GO'] };   /* over the dial (draft:true) */
  /* THE PHRASES, as data a person can read: a row of eighth notes, two to a beat, 'x' a beat he plays, '.' a rest.
     house: the taps. ground: the detector's CALL (he taps the same row back a bar later). car: [press, let go] in beats. */
  var PHRASES = {
    house: {
      0: ['x.x.x.x.'],
      1: ['x.x.x.x.', 'x.x.xxx.', 'x.xxx.x.', 'xxx.x.x.'],
      2: ['x.x.xxx.x.xxx.x.', 'x.xxx.x.xxx.x.x.', 'xxx.x.x.x.x.xxx.'],
      3: ['x.xxx.xxx.xxx.x.', 'xxx.xxx.x.x.xxx.', 'x.x.xxxxx.xxx.x.'],
      4: ['xxx.xxxxx.xxxxx.', 'x.xxxxx.xxxxx.xx']
    },
    ground: {
      0: ['x...x...', 'x.x.x...'],
      1: ['x.xx..x.', 'x..xx.x.', 'x.x..xx.', 'xx..x.x.'],
      2: ['x.xx.xx.', 'xx.xx.x.', 'x.xxx.x.'],
      3: ['xx.xxx.x', 'x.xxxx.x', 'xxx.xx.x'],
      4: ['xxx.xxxx', 'xx.xxxxx']
    },
    car: {
      0: [{ beats: 4, holds: [[0, 2]] }, { beats: 4, holds: [[0, 3]] }],
      1: [{ beats: 8, holds: [[0, 2], [4, 6]] }, { beats: 8, holds: [[0, 3], [4, 6]] }, { beats: 8, holds: [[0, 2], [4, 7]] }],
      2: [{ beats: 8, holds: [[0, 1.5], [2, 4], [5, 7]] }, { beats: 8, holds: [[0, 2], [3, 4], [5, 7]] }],
      3: [{ beats: 8, holds: [[0, 1], [1.5, 3], [4, 5.5], [6, 7]] }],
      4: [{ beats: 8, holds: [[0, 1], [1.5, 2.5], [3, 4.5], [5, 5.5], [6, 7]] }]
    }
  };
  /* THE SONG, when the page is opened alone (the shell hands the one that is playing): SLOW CREEP's own root and scale */
  var SONG = { name: 'SLOW CREEP', root: 45, scale: [0, 1, 5, 6, 10] };
  var REGISTER = { house: 12, ground: 36, car: 0 };   /* semitones over the song's root: a door's knock, the detector's beep, a can's ring */

  function dial() { return root.BohemiaDial || (typeof require === 'function' ? require('../engine/bohemia_dial.js') : null); }
  function pk(pkg) { pkg = pkg | 0; return pkg < 0 ? 0 : pkg > 4 ? 4 : pkg; }
  function hzOf(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  /* the phrase's tune: n notes walking the song's own scale from its root, a step or two at a time, home on the root or the fifth */
  function melody(song, n, kind, r) {
    song = song && song.scale && song.scale.length ? song : SONG; r = r || Math.random;
    var sc = song.scale, L = sc.length, base = (song.root | 0) + (REGISTER[kind] || 0), out = [], d = Math.floor(r() * 3);
    for (var i = 0; i < n; i++) {
      if (i === n - 1) d = r() < 0.6 ? 0 : Math.min(L - 1, 3);
      else if (i) { d += [-2, -1, 1, 1, 2][Math.floor(r() * 5)]; if (d < -1) d = 0; if (d > L + 1) d = L - 1; }
      var oct = Math.floor(d / L), k = ((d % L) + L) % L;
      out.push(hzOf(base + sc[k] + 12 * oct));
    }
    return out;
  }
  /* a phrase for a spot: { kind, pkg, beats, lead, cue, call: [{ b, hz, step }], notes: [{ i, b, type, hz, born, hold, step }] }
     b: beats from the phrase's first beat (the ONE he plays first); born: the beat it leaves the thing; lead: how many beats before
     the first the dial must be open (the call, or the drift and the ride). type: 'tap', or 'down' and 'up' of a hold. */
  function phrase(kind, pkg, r, song) {
    pkg = pk(pkg); r = r || Math.random;
    var pool = (PHRASES[kind] || PHRASES.house)[pkg], pick = pool[Math.floor(r() * pool.length)] || pool[0], notes = [], call = [], beats, lead;
    if (kind === 'car') {
      beats = pick.beats; lead = CAR_DRIFT + RIDE_BEATS;
      var tune = melody(song, pick.holds.length, kind, r);
      pick.holds.forEach(function (h, i) {
        notes.push({ b: h[0], type: 'down', hz: tune[i], hold: i, born: h[0] - RIDE_BEATS - CAR_DRIFT });
        notes.push({ b: h[1], type: 'up', hz: tune[i] * 1.5, hold: i, born: h[1] - RIDE_BEATS - CAR_DRIFT });
      });
    } else {
      var steps = []; for (var s = 0; s < pick.length; s++) if (pick.charAt(s) === 'x') steps.push(s);
      beats = pick.length / 2;
      var t2 = melody(song, steps.length, kind, r), drift = kind === 'ground' ? beats - RIDE_BEATS : HOUSE_DRIFT;
      lead = kind === 'ground' ? beats : HOUSE_DRIFT + RIDE_BEATS;
      steps.forEach(function (st, i) {
        notes.push({ b: st / 2, type: 'tap', hz: t2[i], step: st, born: st / 2 - RIDE_BEATS - drift });
        if (kind === 'ground') call.push({ b: st / 2 - beats, hz: t2[i], step: st });
      });
    }
    notes.forEach(function (n, i) { n.i = i; });
    return { kind: kind, pkg: pkg, row: typeof pick === 'string' ? pick : null, beats: beats, lead: lead, cue: CUE[kind] || CUE.house, call: call, notes: notes,
      holds: kind === 'car' ? pick.holds.map(function (h) { return h.slice(); }) : [] };
  }
  /* where a beat is, t beats from the phrase's first: before it is born, drifting from the thing to the track's end (k 0..1),
     riding the track (u 0 at the end, 1 in the middle, past 1 it is late) */
  function beadAt(note, t) {
    var ride = note.b - RIDE_BEATS;
    if (t < note.born) return { stage: 'unborn', k: 0, u: 0 };
    if (t < ride) return { stage: 'drift', k: (t - note.born) / Math.max(0.0001, ride - note.born), u: 0 };
    return { stage: 'ride', k: 1, u: (t - ride) / RIDE_BEATS };
  }
  /* THE JUDGE IS THE DIAL: his touch, ms from the beat (after the allowance), is the angle the bead sits from the middle of the
     track at that moment; the old fight's own resolution (zoneOf: kill / vital / hit / miss) names the band it is in. A package
     widens or narrows the bands; so does the slack of a let-go or of the first beat. */
  function span() { var K = dial().K; return K.LIM * K.ARC_MULT; }               /* the track's end, radians from the middle */
  function angleOf(ms, beatMs) { return ms / (RIDE_BEATS * (beatMs || BEAT_MS)) * span(); }
  function judge(ms, pkg, slack, beatMs) {
    var a = angleOf(ms, beatMs), k = WINDOW[pk(pkg)] * (slack || 1), zone = dial().zoneOf({ angle: a / k });
    return { zone: zone, ms: ms, angle: a, early: ms < 0, word: zone === 'kill' || zone === 'vital' || zone === 'miss' ? TAP_WORD[zone] : (ms < 0 ? TAP_WORD.early : TAP_WORD.late) };
  }
  /* the bands in ms each side of the beat, as the page draws them and a reader can check them */
  function windowsMs(pkg, slack, beatMs) {
    var D = dial(), W = D.defaultState().W, k = WINDOW[pk(pkg)] * (slack || 1), per = RIDE_BEATS * (beatMs || BEAT_MS) / D.K.LIM;
    return { kill: W.hZ * per * k, vital: W.vZ * per * k, hit: W.hitZ * per * k };
  }
  function slackOf(note, first) { return (note.type === 'up' ? RELEASE_SLACK : 1) * (first ? FIRST_SLACK : 1); }
  /* WHICH BEAT A TAP IS FOR. Of the beats of this kind not yet judged whose outer band holds his touch: the last one that has
     already crossed the middle (he is LATE for it: a thumb, a slow glass and a far ear all run late, never early), unless his
     touch sits inside the dead-centre band of the next one coming (then it is for that one: he let the other go by). Rows with an
     'and' put beats 250 ms apart and the bands are wider than that, so nearest-wins would hand a thumb 150 ms late to the wrong
     beat (MEASURED on the page: GOOD, LATE, then EARLY by 100 and LATE by 250). null: no beat is there (a stray).
     notes carry at (ms, the page's clock); t is his touch less the allowance. */
  function match(notes, t, type, pkg, first, beatMs) {
    var before = null, after = null;
    for (var i = 0; i < notes.length; i++) { var n = notes[i]; if (n.res || n.type !== type) continue;
      var d = t - n.at, w = windowsMs(pkg, slackOf(n, first && i === 0), beatMs).hit; if (Math.abs(d) > w) continue;
      if (d >= 0) { if (!before || n.at > before.at) before = n; } else if (!after || n.at < after.at) after = n; }
    if (before && after) return after.at - t <= windowsMs(pkg, 1, beatMs).kill ? after : before;
    return before || after;
  }
  /* THE FIND IS AS GOOD AS HIS TIMING: zones is one zone a note, strays the taps that met nothing */
  function score(zones, strays) {
    var n = zones.length, pts = 0; zones.forEach(function (z) { pts += POINTS[z] || 0; });
    var got = Math.max(0, pts - (strays | 0) * STRAY_COST), share = n ? got / (3 * n) : 0;
    var zone = share >= SHARE.kill ? 'kill' : share >= SHARE.vital ? 'vital' : share >= SHARE.hit ? 'hit' : 'miss';
    return { zone: zone, share: share, points: pts, strays: strays | 0, of: 3 * n, clean: n > 0 && zones.every(function (z) { return z === 'kill'; }) && !strays };
  }
  /* THE ALLOWANCE: the middle of his own last taps (ms after the beat; raw, before any allowance), TRUSTED ONLY AS FAR AS HIS
     TAPS AGREE: a phone, a slow glass or a far ear runs him late by the SAME amount every tap (on average within LAG.SURE ms of
     their middle: taken out in full), a wild thumb lands all over (past LAG.WILD of spread: nothing is taken out, he is not
     lagging, he is missing). Before the third tap, what the last visit learned (start), 0 on a first visit. The judge takes it
     off his touch; the picture never moves. */
  function lagOf(offsets, start) {
    var a = (offsets || []).slice(-LAG.KEEP), from = Math.max(LAG.MIN, Math.min(LAG.MAX, +start || 0));
    if (a.length < LAG.FROM) return from;
    var mid = function (v) { v = v.slice().sort(function (x, y) { return x - y; }); return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2; };
    var m = mid(a), spread = a.reduce(function (t, x) { return t + Math.abs(x - m); }, 0) / a.length, trust = Math.max(0, Math.min(1, (LAG.WILD - spread) / (LAG.WILD - LAG.SURE)));
    return Math.max(LAG.MIN, Math.min(LAG.MAX, from + (m - from) * trust));
  }
  function comboStep(combo) { var k = 0; COMBO_STEPS.forEach(function (c) { if (combo >= c) k++; }); return k; }
  function findOf(kind, zone) { return zone && zone !== 'miss' && FINDS[kind] ? FINDS[kind][zone] || null : null; }
  /* the resolution contract's row (engine/bohemia_engine.js CombatBridge: outcome killshot | hit | miss, zone, greedMult, patMeta) */
  function result(spot, zone, extra) {
    var D = dial();
    return Object.assign({ outcome: D.outcomeOf(zone), zone: zone, greedMult: 1, kind: spot.kind, spot: spot.id, got: findOf(spot.kind, zone), word: ZONE_WORD[zone] || '' }, extra || {});
  }

  var API = {
    MAX_SPOTS: MAX_SPOTS, FINDS: FINDS, ZONE_WORD: ZONE_WORD, TAP_WORD: TAP_WORD, CUE: CUE,
    BPM: BPM, BEAT_MS: BEAT_MS, RIDE_BEATS: RIDE_BEATS, WINDOW: WINDOW, RELEASE_SLACK: RELEASE_SLACK, FIRST_SLACK: FIRST_SLACK, POINTS: POINTS, STRAY_COST: STRAY_COST,
    SHARE: SHARE, LAG: LAG, COMBO_STEPS: COMBO_STEPS, PHRASES: PHRASES, SONG: SONG, REGISTER: REGISTER,
    candidates: candidates, spots: spots, dirt: dirt, houseAt: houseAt, LAND: LAND, ASPHALT: ASPHALT, centroid: centroid, carAt: carAt, openTile: openTile, rng: rng,
    melody: melody, phrase: phrase, beadAt: beadAt, span: span, angleOf: angleOf, judge: judge, windowsMs: windowsMs, slackOf: slackOf, match: match, score: score,
    lagOf: lagOf, comboStep: comboStep, findOf: findOf, result: result
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaScavengeGame = API;
})(typeof window !== 'undefined' ? window : this);
