// BOHEMIA STORY SURFACE — the cold open, on screen (8/11/26, PEOPLE lane)
//
// WHY THIS EXISTS. engine/bohemia_scene.js has played the Act 1 cold open
// correctly and deterministically since 8/9, and gates/scene_gate.js proved it
// beat by beat against the locked 7/19 shape — headless, in a terminal, where
// Paolo has never once looked. It appeared in ZERO slices. Under NAME THE TAB
// that is not a feature, it is a thing he cannot reach, and a thing he cannot
// reach does not exist to him. This module is the room the runtime plays in.
//
// THE DIVISION OF LABOUR IS THE RUNTIME'S, AND IT IS KEPT.
//   bohemia_scene.js  OWNS the order of beats. It renders nothing.
//   this file         OWNS pixels. It decides NOTHING about the story: it is a
//                     pure obey-the-beat surface. If a beat does not place an
//                     actor, no actor is drawn. That is not laziness, it is the
//                     line between mechanism and canon:
//
// *** WHO IS AT THE TABLE AFTER THE CUT IS A DECISION, AND IT IS HIS. ***
// The pre-collapse table is placed by five `actor` beats. Nothing places anyone
// after the cut except the player, so after the cut the room holds the player
// and whoever the beats give a line to. A surface that "helpfully" carried the
// family across the cut would be deciding who survived ten years of collapse,
// which is exactly the half of MECHANISM-MINE / CONTENTS-PAOLO'S that the 8/11
// words amendment did NOT touch.
// CHAIRS BELONG TO THE ROOM, BODIES BELONG TO THE BEATS. Five chairs are drawn
// in both eras because a room keeps its furniture. An empty chair after the cut
// is therefore a fact about seating, not a claim about a casualty — which is
// how the [PENDING] EMPTY CHAIR motif gets its shape without being built.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): this module cooks ZERO new pixels.
//   - the room comes from engine/bohemia_coldopen_set.js: 12 tiles lifted
//     byte-identical out of banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, every one
//     carrying a Paolo UP verdict from the Great Sweep.
//   - the people come from the alpha's OWN character renderer (drawChar over
//     Paolo's painted rig) through an injected painter, so the family in the
//     cold open is the same body the CHARACTER tab builds, wearing the same
//     wardrobe, aged on the same 8/11 age axis. Not a lookalike.
//   An art freeze is on. Nothing here needed a new pixel.
//
// 120 BPM LAW: the scene advances one beat every BEAT_MS. Animation phase runs
// faster than that for motion, but nothing about the STORY is timed in
// milliseconds — ask the runtime, never the clock.
(function (root) {
  'use strict';

  /* ---- THE ROOM. One camera, and it does not move across the cut ----------
     "the framing must be IDENTICAL either side of the cut or the match-cut does
     not read as the same table" (the scene's own camera beat). So every number
     below is era-independent BY CONSTRUCTION: there is one layout, and the era
     only changes which tiles are drawn into it. */
  var W = 360, H = 470;
  var HORIZON = 172;            // wall meets floor. NEVER changes.
  var TILE = 48;

  var WINDOW = { x: 128, y: 30, s: 104 };
  var TABLE = { x: 58, y: 288, w: 122, n: 2 };         // n tiles wide
  var TOP = TABLE.y + 26;                               // the table's top surface

  /* five seats. FAR side faces the camera (we see their faces), NEAR side has
     its back to us (the player's seat is one of these, which is what makes
     "same chair" read after the cut). */
  /* THE NEAR SEATS RUN OFF THE BOTTOM OF THE FRAME ON PURPOSE. A near-side body
     drawn whole stands as tall as the table is wide, covers the food, and reads
     as somebody STANDING behind a counter. Cropped at the shoulders it reads as
     what it is: two people sitting with their backs to us, framing the table.
     It is also the shot the match-cut needs, because "you still take the same
     chair" has to be about a chair the camera can see. */
  var SEATS = [
    /* *** PAOLO 8/11 ON v1: "mfs were standing ontop of table." *** They were
       drawn at full height with their feet ABOVE the table's top plane, so three
       people appeared to be standing on the furniture. A person seated at a
       table is cut off by it at the ribs -- so the far row's feet now land BELOW
       the table's top edge, the table is drawn over them, and only chest and
       head clear it. The scale came down too: a body as tall as the table is
       wide is a body standing behind a counter.
       Second pass, because the first correction overshot and buried them
       entirely: the feet land just below the table's TOP PLANE, not below the
       table. Chest and head clear it and the rest is behind furniture, which is
       what sitting at a table looks like. */
    { id: 'far_l',  x: 104, y: 244, dir: 'S', side: 'far',  bodyY: 344, scale: 1.24 },
    { id: 'far_c',  x: 158, y: 240, dir: 'S', side: 'far',  bodyY: 340, scale: 1.24 },
    { id: 'far_r',  x: 212, y: 244, dir: 'S', side: 'far',  bodyY: 344, scale: 1.24 },
    /* the near pair are turned a notch off dead-on. A body drawn at exactly N is
       a back and the back of a head, which at this crop reads as an egg on a
       shoulder; one step to NE/NW gives the silhouette an edge and a cheek and
       it becomes a person sitting with their back to you. */
    { id: 'near_l', x: 62,  y: 360, dir: 'NE', side: 'near', bodyY: 545, scale: 1.9 },
    { id: 'near_r', x: 222, y: 360, dir: 'NW', side: 'near', bodyY: 545, scale: 1.9 }
  ];
  var SEAT_OF = {                       // the scene's `at` field -> a seat
    table_seat_mother: 'far_l', table_seat_sibling_lost: 'far_c',
    table_seat_sibling_older: 'far_r', table_seat_player: 'near_l',
    table_seat_father: 'near_r'
  };
  /* the father is on his feet for his line — he is waking you, not eating. */
  var STANDING = { x: 262, y: 300, dir: 'SW', scale: 1.55 };

  /* ---- WHO PLAYS WHOM ------------------------------------------------------
     The scene names roles (mother, father, sibling_older, sibling_lost). The
     CHARACTER lane's FAMILY_CAST names bodies. This is the only place the two
     vocabularies meet, and it is a lookup rather than a rename so neither lane
     has to know the other's words. sibling_lost -> the cast member the CHARACTER
     lane already marks "the one who is lost"; that mapping is THEIR ruling
     carried, not one made here. */
  var ROLE_TO_CAST = {
    mother: 'MOTHER', father: 'FATHER',
    sibling_older: 'BROTHER', sibling_lost: 'SISTER'
  };

  function el(tag, css) { var e = document.createElement(tag); if (css) e.style.cssText = css; return e; }

  function Story(opts) {
    this.o = opts || {};
    this.cv = this.o.canvas;
    this.cx = this.cv.getContext('2d');
    this.cx.imageSmoothingEnabled = false;
    this.set = this.o.set;
    this.scene = this.o.scene;
    this.RT = this.o.runtime;
    this.paint = this.o.paintBody;         // injected: (canvas, castRoleOrPlayer, dir, clip, phase, age)
    this.img = {};
    this.frames = {};
    this.era = 'pre_collapse';
    this.cast = {};                        // seatId -> {role, age}
    this.standing = null;
    this.sky = null;
    this.player = null;
    this.line = null;
    this.beatNo = 0;
    this.phase = 0;
    this.ended = false;
    this.handoff = null;
  }

  /* ---- ASSETS -------------------------------------------------------------- */
  Story.prototype.loadTiles = function (done) {
    var self = this, list = this.set.TILES, n = list.length, got = 0;
    if (!n) return done();
    list.forEach(function (t) {
      var im = new Image();
      im.onload = im.onerror = function () { if (++got === n) done(); };
      im.src = t.src;
      self.img[t.name] = im;
    });
  };

  /* PRE-RENDER THE BODIES ONCE. Measured on the real alpha: a full body REBUILD
     costs ~19ms (it re-runs rebuildFromRig and clears the frame cache), while
     drawing another clip/phase off an already-built body costs ~0.6ms. So the
     whole cast is built ONE MEMBER AT A TIME and every frame that member needs
     is taken while their rig is installed. Painting live per frame would have
     been 19ms x 6 bodies every tick, which is a slideshow. */
  var PH = 6;                              // phases per clip
  Story.prototype.bake = function (done) {
    var self = this;
    /* FATHER is baked TWICE and that is not waste. He sits at the near side of
       the pre-collapse table with his back to the camera, and he stands facing
       it after the cut when he wakes you -- two different bodies as far as the
       renderer is concerned, and reusing one for the other is how a scene ends
       up with a man talking to a wall. */
    var want = [
      { key: 'MOTHER',      role: 'MOTHER',  dir: 'S',  clips: ['sit-chair', 'talk'] },
      { key: 'SISTER',      role: 'SISTER',  dir: 'S',  clips: ['sit-chair', 'talk'] },
      { key: 'BROTHER',     role: 'BROTHER', dir: 'S',  clips: ['sit-chair', 'talk'] },
      { key: 'FATHER',      role: 'FATHER',  dir: 'SW', clips: ['idle', 'talk'] },
      { key: 'FATHER_BACK', role: 'FATHER',  dir: 'NW', clips: ['sit-chair', 'talk'] },
      { key: 'PLAYER_child', role: null, age: 'child', dir: 'NE', clips: ['sit-chair'] },
      { key: 'PLAYER_adult', role: null, age: 'adult', dir: 'NE', clips: ['sit-chair'] }
    ];
    var i = 0;
    function next() {
      if (i >= want.length) return done();
      var w = want[i++];
      try {
        self.frames[w.key] = self.paint(w.role, w.age || null, w.dir, w.clips, PH);
      } catch (e) { self.frames[w.key] = null; }
      /* yield to the browser between bodies so the tab never looks frozen */
      setTimeout(next, 0);
    }
    next();
  };

  /* ---- DRAWING ------------------------------------------------------------- */
  Story.prototype.tile = function (name, x, y, s) {
    var im = this.img[name];
    if (im && im.width) this.cx.drawImage(im, x, y, s, s);
  };

  /* A BODY WITH NO SHADOW FLOATS, and floating is most of what "glitchy" looks
     like from across a room. One soft ellipse on the floor under each person. */
  Story.prototype.shadow = function (x, footY, w) {
    var c = this.cx;
    c.save();
    c.translate(x, footY); c.scale(1, 0.26);
    var g = c.createRadialGradient(0, 0, 0, 0, 0, w);
    g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.65, 'rgba(0,0,0,0.24)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, w, 0, 6.2832); c.fill();
    c.restore();
  };

  Story.prototype.body = function (key, clip, x, footY, scale, hot) {
    var set = this.frames[key];
    if (!set) return;
    var arr = set[clip] || set[Object.keys(set)[0]];
    if (!arr || !arr.length) return;
    var f = arr[this.phase % arr.length];
    var w = f.width * scale, h = f.height * scale;
    var X = Math.round(x - w / 2), Y = Math.round(footY - h);
    this.cx.drawImage(f, X, Y, Math.round(w), Math.round(h));
    /* WHO IS TALKING, WITHOUT STANDING THEM UP. The first cut swapped a seated
       speaker to the `talk` clip, and `talk` is a STANDING animation -- so the
       mother rose out of her chair to say the food was getting cold. A seated
       body stays seated; the speaker is marked by being a shade brighter, as if
       the room's light found them. The caption carries the name. */
    if (hot) {
      this.cx.save();
      this.cx.globalCompositeOperation = 'lighter';
      this.cx.globalAlpha = 0.20;
      this.cx.drawImage(f, X, Y, Math.round(w), Math.round(h));
      this.cx.restore();
    }
  };

  Story.prototype.draw = function () {
    var c = this.cx, E = this.set.ERA[this.era];
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, W, H);

    /* WALL, THEN FLOOR, AND THEY ARE THE SAME PLANK. See the bake tool: every
       wood floor in the approved pool has weeds growing through it because they
       are outdoor tiles, and a kitchen does not have grass in it. So the floor
       is the wall's plank turned a quarter and darkened -- boards running across
       the floor, boards running up the wall, one approved tile, no new pixel
       cooked during a freeze. */
    /* BIGGER TILES, AND EVERY OTHER ROW OFFSET. At 48px the wall is eight
       identical cracks across and four down, and a repeat that regular reads as
       WALLPAPER, not as a wall -- the eye finds the grid before it finds the
       room. Drawing them larger and running each row half a tile over breaks the
       lattice with no new pixel and no extra cost. */
    var x, y, r, WT = 72, FT = 62;
    for (y = -WT, r = 0; y < HORIZON; y += WT, r++)
      for (x = -WT + (r % 2 ? WT / 2 : 0); x < W + WT; x += WT) this.tile('wall', x, y, WT);
    for (y = HORIZON, r = 0; y < H + FT; y += FT, r++)
      for (x = -FT + (r % 2 ? FT / 2 : 0); x < W + FT; x += FT) this.tile('floor', x, y, FT);
    /* the floor sits in the room's shade -- value separation, or the wall and
       the floor merge and the horizon disappears with them. */
    c.fillStyle = 'rgba(8,6,4,0.34)';
    c.fillRect(0, HORIZON, W, H - HORIZON);
    /* THE BASEBOARD. The cheapest thing in this whole file and the one that says
       "somebody's house" rather than "a room in a dungeon" -- every American
       interior has one and no ruin tileset ships one. */
    c.fillStyle = 'rgba(232,224,206,0.80)'; c.fillRect(0, HORIZON - 9, W, 9);
    c.fillStyle = 'rgba(0,0,0,0.30)';       c.fillRect(0, HORIZON - 10, W, 2);
    c.fillStyle = 'rgba(0,0,0,0.45)';       c.fillRect(0, HORIZON, W, 4);

    /* THE WINDOW. One tile swap carries ten years, and it is the only thing in
       the room that a viewer can point at and say what happened. */
    this.tile(E.window, WINDOW.x, WINDOW.y, WINDOW.s);
    if (this.era === 'pre_collapse') {
      /* LIT FROM OUTSIDE: dinner time, and there is still a world out there with
         its lights on. The first version painted this BEHIND the tile, where the
         opaque glass hid every pixel of it -- a light you cannot see is not a
         light. Painted over, in `lighter`, it glows through the panes and takes
         the broken shard with it, which is the only bit of that tile that does
         not belong ten years early. Lighting approved pixels is not redrawing
         them. */
      var wc = WINDOW.x + WINDOW.s / 2, wy = WINDOW.y + WINDOW.s / 2;
      var wg2 = c.createRadialGradient(wc, wy, 2, wc, wy, WINDOW.s * 0.56);
      wg2.addColorStop(0, 'rgba(255,206,140,0.92)');
      wg2.addColorStop(0.55, 'rgba(226,150,74,0.55)');
      wg2.addColorStop(1, 'rgba(160,90,40,0)');
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = wg2;
      c.fillRect(WINDOW.x - 8, WINDOW.y - 8, WINDOW.s + 16, WINDOW.s + 16);
      c.restore();
    }

    /* fireworks read as light through the boards, never as a drawn firework —
       "you can't always tell a firework from a muzzle flash" (7/19). */
    if (this.sky === 'fireworks') {
      var t = this.beatNo * 7 + this.phase;
      var cols = ['#ff7a4a', '#ffd05a', '#7ab4ff', '#ff5a8a'];
      var a = 0.16 + 0.20 * Math.abs(Math.sin(t * 0.9));
      var g = c.createRadialGradient(WINDOW.x + WINDOW.s / 2, WINDOW.y + WINDOW.s / 2, 4,
        WINDOW.x + WINDOW.s / 2, WINDOW.y + WINDOW.s / 2, WINDOW.s * 0.95);
      g.addColorStop(0, cols[(this.beatNo | 0) % 4]); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.globalAlpha = a; c.fillStyle = g;
      c.fillRect(WINDOW.x - 30, WINDOW.y - 20, WINDOW.s + 60, WINDOW.s + 60);
      c.globalAlpha = 1;
    }

    var self = this;
    function seat(id) { for (var i = 0; i < SEATS.length; i++) if (SEATS[i].id === id) return SEATS[i]; return null; }

    /* FAR: chair, then body — the table will cover them from the ribs down */
    SEATS.forEach(function (s) {
      if (s.side !== 'far') return;
      self.tile('chair', s.x, s.y, 76);
    });
    SEATS.forEach(function (s) {
      if (s.side !== 'far') return;
      var who = self.cast[s.id]; if (!who) return;
      self.shadow(s.x + 38, s.bodyY - 2, 26);
      self.body(who.key, 'sit-chair', s.x + 38, s.bodyY, s.scale, who.clip === 'talk');
    });

    /* THE TABLE */
    for (var i = 0; i < TABLE.n; i++) this.tile('table', TABLE.x + i * TABLE.w, TABLE.y, TABLE.w);

    /* what is on it. Four things before, two after, and nobody remarks on it. */
    var dress = E.dress, dx = TABLE.x + 18, step = (TABLE.w * TABLE.n - 46) / Math.max(1, dress.length);
    dress.forEach(function (name, k) {
      var s = (name === 'lantern') ? 46 : 34;
      self.tile(name, dx + k * step, TOP - s + 10, s);
    });

    /* NEAR: chair, then body in front of it */
    SEATS.forEach(function (s) {
      if (s.side !== 'near') return;
      self.tile('chair', s.x, s.y, 84);
    });
    SEATS.forEach(function (s) {
      if (s.side !== 'near') return;
      var who = self.cast[s.id]; if (!who) return;
      self.body(who.key, 'sit-chair', s.x + 42, s.bodyY, s.scale, who.clip === 'talk');
    });

    /* anyone on their feet */
    if (this.standing) {
      this.shadow(STANDING.x, STANDING.y + 88, 30);
      this.body(this.standing.key, this.standing.clip, STANDING.x, STANDING.y + 88,
        STANDING.scale, this.standing.clip === 'talk');
    }

    /* LIGHT. The only thing that says "ten years" out loud. */
    if (E.amb > 0) {
      c.fillStyle = 'rgba(10,14,22,' + E.amb + ')';
      c.fillRect(0, 0, W, H);
      /* the lantern is the only light source in the after-room, so it gets a pool */
      var lg = c.createRadialGradient(TABLE.x + 150, TOP, 8, TABLE.x + 150, TOP, 190);
      lg.addColorStop(0, 'rgba(255,186,96,0.30)'); lg.addColorStop(1, 'rgba(255,186,96,0)');
      c.fillStyle = lg; c.fillRect(0, 120, W, H - 120);
    } else {
      var wg = c.createRadialGradient(W / 2, TOP - 40, 20, W / 2, TOP - 40, 300);
      wg.addColorStop(0, 'rgba(255,180,90,0.20)'); wg.addColorStop(1, 'rgba(120,60,20,0.10)');
      c.fillStyle = wg; c.fillRect(0, 0, W, H);
    }
    /* a soft vignette, both eras, so the framing itself never changes */
    var vg = c.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  };

  /* ---- OBEYING A BEAT ------------------------------------------------------ */
  Story.prototype.apply = function (b) {
    if (!b) return;
    this.beatNo++;
    /* A LINE BELONGS TO ITS BEAT. The first cut of this left `line` standing
       until the next say beat, so the father's caption sat under the child's
       words for six seconds and the pre-collapse line was still on screen after
       the cut -- a caption outliving its scene reads as a bug in the writing,
       which is the one thing this surface must never do to a draft. */
    if (b.kind !== 'say') this.line = null;
    if (b.kind === 'set') {
      if (b.era) this.era = b.era;
      if (b.sky) this.sky = b.sky;
    } else if (b.kind === 'cut') {
      /* THE MATCH-CUT. One frame, no fade, no transition, and the camera does
         not move. Everything the cut clears is cleared because nothing after it
         has placed anything — see the header. */
      this.era = b.to || 'post_collapse';
      this.cast = {}; this.standing = null; this.sky = null;
    } else if (b.kind === 'actor') {
      var seatId = SEAT_OF[b.at];
      if (b.actor === 'player') {
        var key = (b.age === 'child') ? 'PLAYER_child' : 'PLAYER_adult';
        if (seatId) this.cast[seatId] = { key: key, clip: 'sit-chair' };
        this.player = b.age || 'adult';
      } else {
        var castKey = ROLE_TO_CAST[b.actor];
        /* a near seat has its back to the camera, so it takes the back-facing
           bake if one exists. Falls through to the front bake otherwise, which
           is a slightly wrong angle rather than an empty chair. */
        var back = this.frames[castKey + '_BACK'] ? castKey + '_BACK' : castKey;
        var near = seatId && seatId.indexOf('near') === 0;
        if (castKey && seatId) this.cast[seatId] = { key: near ? back : castKey, clip: 'sit-chair' };
        else if (castKey) this.standing = { key: castKey, clip: 'idle' };
      }
    } else if (b.kind === 'say') {
      this.line = { speaker: b.speaker, text: b.text || '', draft: b.draft === true, cites: b.study || [] };
      /* *** PAOLO 8/11 ON v1: "there was no squiggle voices." *** The alpha has
         had a seeded gibberish-speech engine since 8/9 (BOH_VOICE, six voices he
         approved on the 11th) and the cold open played SILENT, which is the
         second time this lane has shipped a finished system nobody could reach.
         The surface does not synthesise anything -- it hands the line to an
         injected speaker, so this module still owns no audio. */
      if (this.o.speak) { try { this.o.speak(b.speaker, this.line.text); } catch (e) {} }
      /* whoever speaks is HERE. A speaker with no seat is on their feet — the
         father, after the cut, waking you. */
      var ck = ROLE_TO_CAST[b.speaker];
      var placed = null, k;
      /* the same person can be seated under a back-facing key, so match on the
         cast name rather than the bake key -- otherwise the father sits mute at
         his own table while a second copy of him talks from the floor. */
      function isWho(key) { return ck && (key === ck || key === ck + '_BACK'); }
      for (k in this.cast) if (isWho(this.cast[k].key)) placed = k;
      if (ck && placed) this.cast[placed].clip = 'talk';
      else if (ck) this.standing = { key: ck, clip: 'talk' };
      for (k in this.cast) if (!isWho(this.cast[k].key)) this.cast[k].clip = 'sit-chair';
    } else if (b.kind === 'handoff') {
      this.handoff = { to: b.to, encounter: b.encounter, call: b.call };
    } else if (b.kind === 'end') {
      this.ended = true;
    }
  };

  /* ---- PLAY ---------------------------------------------------------------- */
  Story.prototype.start = function () {
    var self = this;
    this.stop();
    this.player_ = new this.RT.Scene(this.scene, {});
    this.era = 'pre_collapse'; this.cast = {}; this.standing = null; this.sky = null;
    this.line = null; this.ended = false; this.handoff = null; this.beatNo = 0;
    /* ONE BEAT EVERY BEAT_MS. 120 BPM LAW: the surface asks the runtime for the
       next beat, it never counts the story in milliseconds itself. */
    this.beatTimer = setInterval(function () {
      var r = self.player_.step();
      self.apply(r.beat);
      if (self.o.onBeat) self.o.onBeat(r, self);
      if (r.done) { self.stop(); self.ended = true; if (self.o.onEnd) self.o.onEnd(self); }
    }, this.RT.BEAT_MS);
    this.animTimer = setInterval(function () { self.phase++; self.draw(); }, 125);
    this.draw();
  };
  Story.prototype.stop = function () {
    if (this.beatTimer) clearInterval(this.beatTimer);
    if (this.animTimer) clearInterval(this.animTimer);
    this.beatTimer = this.animTimer = null;
  };

  /* headless-friendly: play the whole thing with no timers, for a gate */
  Story.prototype.playAll = function () {
    this.player_ = new this.RT.Scene(this.scene, {});
    this.era = 'pre_collapse'; this.cast = {}; this.standing = null;
    var seen = [], n = 0;
    while (!this.player_.done && n++ < 400) {
      var r = this.player_.step();
      this.apply(r.beat);
      if (r.beat) seen.push({ kind: r.beat.kind, id: r.beat.id, era: this.era,
                              cast: Object.keys(this.cast).length, line: this.line && this.line.text });
    }
    return seen;
  };

  var API = {
    Story: Story, W: W, H: H, HORIZON: HORIZON, SEATS: SEATS, SEAT_OF: SEAT_OF,
    ROLE_TO_CAST: ROLE_TO_CAST, PHASES: PH, VERSION: 'story-surface-1.0.0'
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaStorySurface = API;
})(typeof window !== 'undefined' ? window : globalThis);
