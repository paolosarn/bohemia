// BOHEMIA CUTSCENE SURFACE — the room a scene plays in (8/12/26, PEOPLE lane)
//
// v1 OF THIS FILE WAS A DIORAMA AND HE CALLED IT. Paolo 8/12: "im more concerned
// of the natural wiring and plumbing of the cutscenes as well. Like it should be
// seemless and not need to be so handcrafted everytime... From location. To it
// being the actual house. To mfs not glitching into furniture."
//
// He was right. v1 held five hand-typed seat coordinates, a hand-typed table
// rectangle, and a `bodyY` per chair found by taking screenshots until nobody
// looked like they were standing on the furniture. It produced exactly one
// scene, and the second one would have cost the same day over again.
//
// EVERY ONE OF THOSE NUMBERS IS GONE. This file now draws what
// engine/bohemia_stage.js hands it:
//   the ROOM is a real room out of engine/bohemia_floorplan.js — the same
//     generator the walked world uses, at a seed, with rects, roles and doors.
//   the FURNITURE is placed by rule from the room's own dimensions.
//   the SEATS fall out of the table, and the seat solver refuses to put a body
//     on a solid cell or two bodies on one cell (OCCUPANCY LAW).
//   the CAMERA is one cell->pixel transform and EVERYTHING goes through it, so
//     a body lands on a chair because the arithmetic says so.
//   DRAW ORDER is by cell depth, which is what actually stops a person being
//     drawn on top of the table they are sitting behind.
//   LINE DURATION comes from reading speed, and the babble is trimmed to fit
//     inside it (see the stage module's TIME section for the published numbers).
//
// WHAT IT STILL REFUSES TO OWN, UNCHANGED:
//   *** WHO IS AT THE TABLE AFTER THE CUT IS A DECISION, AND IT IS HIS. ***
//   Five actor beats fill the pre-collapse table; nothing places anyone after
//   the cut except the player. A surface that helpfully carried the family
//   across would be deciding who survived ten years of collapse. Chairs belong
//   to the room, bodies belong to the beats.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO new pixels. The room's
// tiles come from engine/bohemia_coldopen_set.js (approved interior pool, hashed
// by the gate); the people come from the alpha's own drawChar over Paolo's
// painted rig through an injected painter. An art freeze is on.
(function (root) {
  'use strict';

  var W = 360, H = 470;

  /* THE ONLY THING LEFT THAT MAPS A SCENE'S WORDS TO THE STAGE. A scene says
     `at: "table_seat_mother"`; the stager knows nothing about mothers. This is
     an ALIAS TABLE, not a layout: an unknown seat name takes the next free
     chair rather than failing, so a new scene can invent its own names and
     still stage. That is the difference between plumbing and a diorama. */
  var SEAT_ALIAS = {
    table_seat_mother: 'far_0', table_seat_sibling_lost: 'far_1',
    table_seat_sibling_older: 'far_2', table_seat_player: 'near_0',
    table_seat_father: 'near_1'
  };

  var ROLE_TO_CAST = {
    mother: 'MOTHER', father: 'FATHER',
    sibling_older: 'BROTHER', sibling_lost: 'SISTER'
  };

  /* FAMILY_CAST -> {role token: NAME}. `survivesIf` is the cast's own field:
     'always' for the parents, 'male'/'female' for the two siblings, meaning THAT
     sibling survives when the player is that sex. So the LOST sibling is the one
     whose survivesIf names the other sex, and no gender logic is invented here.
     Returns {} for an empty cast, which prints the token visibly rather than
     silently dropping a name. */
  function famNames(cast, playerSex) {
    var out = {}, other = (playerSex === 'female') ? 'male' : 'female';
    (cast || []).forEach(function (m) {
      if (!m || !m.name) return;
      if (m.role === 'FATHER') out.father = m.name;
      if (m.role === 'MOTHER') out.mother = m.name;
      if (m.survivesIf === playerSex) out.sibling_older = m.name;
      if (m.survivesIf === other) out.sibling_lost = m.name;
    });
    return out;
  }

  function Story(opts) {
    this.o = opts || {};
    this.cv = this.o.canvas;
    this.cx = this.cv.getContext('2d');
    this.cx.imageSmoothingEnabled = false;
    this.set = this.o.set;
    this.scene = this.o.scene;
    this.RT = this.o.runtime;
    /* WHOSE NAME GOES IN THE LINE. A scene writes {sibling_lost}; FAMILY_CAST
       says who that is. 7/19, LOCKED: the surviving sibling matches the player's
       gender, so the one taken is the opposite -- which FAMILY_CAST already
       encodes as `survivesIf`, so this READS that flip rather than restating it.
       ONE PLACE HOLDS THE FAMILY'S NAMES and it is the cast table; this file
       resolves against it and owns no names of its own. */
    this.playerSex = this.o.playerSex || 'male';
    this.names = this.o.names || famNames(this.o.family || (root.FAMILY_CAST || []), this.playerSex);
    this.ST = this.o.stage;                 // BOH_STAGE
    this.FP = this.o.floorplan;             // BOH_FLOORPLAN
    this.paint = this.o.paintBody;
    this.img = {};
    this.frames = {};
    this.reset();
    this.buildRoom();
  }

  Story.prototype.reset = function () {
    this.era = 'pre_collapse';
    this.cast = {};                          // actor -> {key, clip, seat}
    this.standing = null;
    this.sky = null;
    this.line = null;
    this.beatNo = 0;
    this.phase = 0;
    this.ended = false;
    this.handoff = null;
    if (this.seating) this.seating.clear();
  };

  /* ---- THE ACTUAL HOUSE ---------------------------------------------------- */
  Story.prototype.buildRoom = function () {
    /* the scene declares WHERE. It may carry `place`; a `set` beat may carry
       one; otherwise a residential living room, which is what "a house" means
       with nothing else said. */
    /* *** A SCENE THIS SURFACE CANNOT DRAW MUST NOT BE DRAWN WRONG. ***
       Everything below builds an INTERIOR: wall tiles, a floor, a baseboard, a
       window, a table, and bodies posed sit-chair in seats derived from the
       furniture. Handed the ridge burial -- three people standing outdoors over
       a grave -- it silently generated the family's living room and sat them
       down at dinner. Rendered and looked at: it reads as a bug, and it
       misrepresents the most important beat in the opening.
       So a scene declares `needsArt` and gets an HONEST EMPTY FRAME with the
       missing set named on it. The words still play, in order, on the beat,
       which is what the tab is for while art is outstanding. Drawing the wrong
       room would have been the easy green. */
    this.blank = this.scene.needsArt || null;
    var place = this.scene.place || null;
    (this.scene.beats || []).forEach(function (b) { if (!place && b.place && b.place.zone) place = b.place; });
    this.place = place || { zone: 'residential', role: 'living', seed: 7, w: 24, h: 16 };
    this.h = this.ST.house(this.place, this.FP);
    if (!this.h) this.h = { room: { x: 0, y: 0, w: 8, h: 6, role: 'room' } };
    this.furn = this.ST.furnish(this.h.room, this.place.kit || 'dining');
    /* WHERE THE CAMERA IS LOOKING, kept so standing bodies can be placed near it
       rather than wherever Seating.stand() defaults to. */
    this.focus = this.ST.focusOf(this.furn, this.h.room);
    this.cam = this.ST.camera(this.h.room, { w: W, h: H }, this.focus);
    this.seating = new this.ST.Seating(this.h.room, this.furn);
    /* the window sits on the back wall over the middle of the room — derived
       from the room, not typed. */
    var mid = this.cam.project(this.h.room.x + this.h.room.w / 2, this.h.room.y);
    var ws = Math.round(this.cam.cw * 3.2);
    this.win = { x: Math.round(mid.x - ws / 2), y: Math.round(this.cam.wallH * 0.16), s: ws };
  };

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
     costs ~19ms, another clip off an already-installed rig costs ~0.6ms. So each
     member's rig is installed once and every frame it needs is taken then. */
  var PH = 6;
  Story.prototype.bake = function (done) {
    var self = this;
    var want = [
      /* EVERY MEMBER BAKES A STANDING CLIP TOO (8/20). Only the FATHER ever had
         `idle`, because the only scene that existed was a table and the only
         thing anybody did at it was sit. The moment a scene happened somewhere
         other than dinner -- the last room after the raid, the burial on the
         ridge -- every body in it was still posed sit-chair, which is why the
         first cut of the burial rendered three people SITTING AT A TABLE on a
         hilltop. Another clip off an already-installed rig costs ~0.6ms; that
         is the whole price of a family that can stand up. */
      { key: 'MOTHER',      role: 'MOTHER',  dir: 'S',  clips: ['sit-chair', 'talk', 'idle'] },
      { key: 'SISTER',      role: 'SISTER',  dir: 'S',  clips: ['sit-chair', 'talk', 'idle'] },
      { key: 'BROTHER',     role: 'BROTHER', dir: 'S',  clips: ['sit-chair', 'talk', 'idle'] },
      { key: 'FATHER',      role: 'FATHER',  dir: 'SW', clips: ['idle', 'talk'] },
      { key: 'FATHER_BACK', role: 'FATHER',  dir: 'NW', clips: ['sit-chair', 'talk', 'idle'] },
      { key: 'PLAYER_child', role: null, age: 'child', dir: 'NE', clips: ['sit-chair', 'idle'] },
      { key: 'PLAYER_adult', role: null, age: 'adult', dir: 'NE', clips: ['sit-chair', 'idle'] }
    ];
    var i = 0;
    function next() {
      if (i >= want.length) return done();
      var w = want[i++];
      try { self.frames[w.key] = self.paint(w.role, w.age || null, w.dir, w.clips, PH); }
      catch (e) { self.frames[w.key] = null; }
      setTimeout(next, 0);
    }
    next();
  };

  /* ---- DRAWING ------------------------------------------------------------- */
  Story.prototype.tile = function (name, x, y, w, h) {
    var im = this.img[name];
    if (im && im.width) this.cx.drawImage(im, Math.round(x), Math.round(y),
      Math.round(w), Math.round(h === undefined ? w : h));
  };

  Story.prototype.shadow = function (x, footY, w) {
    var c = this.cx;
    c.save(); c.translate(x, footY); c.scale(1, 0.26);
    var g = c.createRadialGradient(0, 0, 0, 0, 0, w);
    g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.65, 'rgba(0,0,0,0.24)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, w, 0, 6.2832); c.fill();
    c.restore();
  };

  /* A BODY IS PLANTED BY ARITHMETIC, NOT BY EYE. Its feet go where its cell is,
     its size comes from the cell width and its depth, and the crop is shared
     across a clip's frames so it cannot jitter. */
  Story.prototype.body = function (key, clip, seat, hot) {
    var set = this.frames[key];
    if (!set) return;
    var arr = set[clip] || set[Object.keys(set)[0]];
    if (!arr || !arr.length) return;
    var f = arr[this.phase % arr.length];
    var p = this.cam.project(seat.cx + 0.5, seat.cy + 0.85);
    /* SIZED BY HEIGHT, NOT WIDTH. A sprite's painted width changes with the pose
       (an outstretched arm is wider than a folded one), so scaling off width
       makes the same person grow and shrink between clips. Height is stable. */
    var tall = this.cam.cw * 2.05 * this.cam.scaleAt(seat.cy);
    var s = tall / Math.max(1, f.height);
    var w = f.width * s, h = f.height * s;
    var X = Math.round(p.x - w / 2), Y = Math.round(p.y - h);
    this.shadow(p.x, p.y, Math.max(8, w * 0.42));
    this.cx.drawImage(f, X, Y, Math.round(w), Math.round(h));
    if (hot) {
      this.cx.save();
      this.cx.globalCompositeOperation = 'lighter';
      this.cx.globalAlpha = 0.20;
      this.cx.drawImage(f, X, Y, Math.round(w), Math.round(h));
      this.cx.restore();
    }
  };

  /* A PROP IS DRAWN ACROSS ITS FOOTPRINT, and how many times the tile repeats
     across it matters: the table tile is a whole little table with legs, so
     repeating it once per cell drew FOUR SMALL TABLES in a row instead of one
     long one. Tables repeat every two cells; everything else once. Returns the
     rect it drew so the dressing can sit on the top of it instead of hovering
     at a guessed offset. */
  Story.prototype.prop = function (p) {
    var a = this.cam.project(p.cx, p.cy + p.h);
    var b = this.cam.project(p.cx + p.w, p.cy + p.h);
    var wpx = b.x - a.x;
    var n = (p.kind === 'table') ? Math.max(1, Math.round(p.w / 2)) : Math.max(1, Math.round(p.w));
    var tileW = wpx / n;
    var hpx = (p.kind === 'chair') ? this.cam.cw * 1.25 : tileW * 0.92;
    for (var i = 0; i < n; i++) this.tile(p.name, a.x + i * tileW, a.y - hpx, tileW, hpx);
    return { x: a.x, y: a.y - hpx, w: wpx, h: hpx };
  };

  Story.prototype.draw = function () {
    var c = this.cx, E = this.set.ERA[this.era], self = this, cam = this.cam;
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, W, H);

    /* THE HONEST EMPTY FRAME. No room, no furniture, no bodies posed at a table
       that is not there. It says what is missing and whose it is, so the gap is
       visible to the person who can close it instead of hidden behind a picture
       of the wrong place. */
    if (this.blank) {
      c.fillStyle = '#100d0a'; c.fillRect(0, 0, W, H);
      c.fillStyle = 'rgba(216,180,90,0.10)';
      c.fillRect(0, Math.round(H * 0.62), W, Math.round(H * 0.38));
      c.fillStyle = 'rgba(216,180,90,0.55)';
      c.font = 'bold 11px ui-monospace, monospace';
      c.textAlign = 'center';
      c.fillText('NO SET ART YET', Math.round(W / 2), Math.round(H * 0.46));
      c.fillStyle = 'rgba(216,180,90,0.34)';
      c.font = '10px ui-monospace, monospace';
      c.fillText(String(this.blank).toUpperCase(), Math.round(W / 2), Math.round(H * 0.52));
      c.fillText('THE WORDS PLAY; THE PICTURE IS OUTSTANDING',
        Math.round(W / 2), Math.round(H * 0.58));
      c.textAlign = 'start';
      return;
    }

    /* WALL, FLOOR, BASEBOARD, all sized off the camera so any room works.
       Bigger tiles with alternate rows offset, or the repeat reads as
       WALLPAPER and the eye finds the grid before it finds the room. */
    var WT = Math.round(cam.cw * 2.4), FT = Math.round(cam.cw * 2.0), x, y, r;
    for (y = -WT, r = 0; y < cam.wallH; y += WT, r++)
      for (x = -WT + (r % 2 ? WT / 2 : 0); x < W + WT; x += WT) this.tile('wall', x, y, WT);
    for (y = cam.wallH, r = 0; y < H + FT; y += FT, r++)
      for (x = -FT + (r % 2 ? FT / 2 : 0); x < W + FT; x += FT) this.tile('floor', x, y, FT);
    c.fillStyle = 'rgba(8,6,4,0.34)'; c.fillRect(0, cam.wallH, W, H - cam.wallH);
    /* THE BASEBOARD: the cheapest thing in this file and the one that says
       "somebody's house" rather than "a room in a dungeon". */
    c.fillStyle = 'rgba(232,224,206,0.80)'; c.fillRect(0, cam.wallH - 9, W, 9);
    c.fillStyle = 'rgba(0,0,0,0.30)';       c.fillRect(0, cam.wallH - 10, W, 2);
    c.fillStyle = 'rgba(0,0,0,0.45)';       c.fillRect(0, cam.wallH, W, 4);

    this.tile(E.window, this.win.x, this.win.y, this.win.s, this.win.s);
    if (this.era === 'pre_collapse') {
      /* lit from outside: dinner time, and there is still a world out there with
         its lights on. Painted OVER in `lighter` because the tile's glass is
         opaque -- a light behind it is a light you cannot see. */
      var wc = this.win.x + this.win.s / 2, wy = this.win.y + this.win.s / 2;
      var wg = c.createRadialGradient(wc, wy, 2, wc, wy, this.win.s * 0.56);
      wg.addColorStop(0, 'rgba(255,206,140,0.92)');
      wg.addColorStop(0.55, 'rgba(226,150,74,0.55)');
      wg.addColorStop(1, 'rgba(160,90,40,0)');
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = wg;
      c.fillRect(this.win.x - 8, this.win.y - 8, this.win.s + 16, this.win.s + 16);
      c.restore();
    }
    if (this.sky === 'fireworks') {
      /* light through the boards, never a drawn firework -- "you can't always
         tell a firework from a muzzle flash" (7/19). */
      var t = this.beatNo * 7 + this.phase;
      var cols = ['#ff7a4a', '#ffd05a', '#7ab4ff', '#ff5a8a'];
      var a2 = 0.16 + 0.20 * Math.abs(Math.sin(t * 0.9));
      var g2 = c.createRadialGradient(this.win.x + this.win.s / 2, this.win.y + this.win.s / 2, 4,
        this.win.x + this.win.s / 2, this.win.y + this.win.s / 2, this.win.s * 0.95);
      g2.addColorStop(0, cols[(this.beatNo | 0) % 4]); g2.addColorStop(1, 'rgba(0,0,0,0)');
      c.globalAlpha = a2; c.fillStyle = g2;
      c.fillRect(this.win.x - 30, this.win.y - 20, this.win.s + 60, this.win.s + 60);
      c.globalAlpha = 1;
    }

    /* *** THE DRAW LIST. This is the answer to "mfs not glitching into
       furniture": ONE list, sorted by cell depth, so a body behind the table is
       drawn before the table and the table covers it. v1 drew far bodies, then
       the table, then near bodies in hand-written order -- the same thing
       written by hand, and correct for exactly one layout. *** */
    var list = [], table = null;
    this.furn.props.forEach(function (p) {
      if (p.kind === 'table') table = p;
      list.push({ d: p.cy + (p.kind === 'chair' ? -0.05 : 0), z: 0, go: function () {
        var r = self.prop(p);
        if (p.kind === 'table') self.tableRect = r;
      } });
    });
    Object.keys(this.cast).forEach(function (k) {
      var who = self.cast[k];
      if (!who || !who.seat) return;
      list.push({ d: who.seat.cy, z: 1, go: function () {
        /* draw them in the pose they were PLACED in. Hardcoding sit-chair here
           was the other half of the same bug: even once a body stood up, the
           draw list sat it back down. */
        self.body(who.key, who.clip === 'talk' ? 'talk' : (who.stand ? 'idle' : 'sit-chair'),
                  who.seat, who.clip === 'talk');
      } });
    });
    if (this.standing && this.standing.seat) {
      var st = this.standing;
      list.push({ d: st.seat.cy, z: 1, go: function () { self.body(st.key, st.clip, st.seat, st.clip === 'talk'); } });
    }
    if (table) {
      var dress = E.dress;
      list.push({ d: table.cy + 0.02, z: 2, go: function () {
        /* ON the table, off the rect the table actually drew -- not a guess. */
        var r = self.tableRect;
        if (!r) return;
        var surfaceY = r.y + r.h * 0.30;
        var step = r.w / Math.max(1, dress.length);
        dress.forEach(function (name, i) {
          var s = self.cam.cw * (name === 'lantern' ? 1.05 : 0.8);
          self.tile(name, r.x + step * (i + 0.5) - s / 2, surfaceY - s * 0.82, s, s);
        });
      } });
    }
    list.sort(function (p, q) { return (p.d - q.d) || (p.z - q.z); });
    list.forEach(function (e) { e.go(); });

    /* LIGHT — the only thing that says "ten years" out loud. */
    if (E.amb > 0) {
      c.fillStyle = 'rgba(10,14,22,' + E.amb + ')';
      c.fillRect(0, 0, W, H);
      var lp = table ? cam.project(table.cx + table.w / 2, table.cy + 1) : { x: W / 2, y: H * 0.6 };
      var lg = c.createRadialGradient(lp.x, lp.y, 8, lp.x, lp.y, 190);
      lg.addColorStop(0, 'rgba(255,186,96,0.30)'); lg.addColorStop(1, 'rgba(255,186,96,0)');
      c.fillStyle = lg; c.fillRect(0, 100, W, H - 100);
    } else {
      var wg2 = c.createRadialGradient(W / 2, cam.wallH + 40, 20, W / 2, cam.wallH + 40, 300);
      wg2.addColorStop(0, 'rgba(255,180,90,0.20)'); wg2.addColorStop(1, 'rgba(120,60,20,0.10)');
      c.fillStyle = wg2; c.fillRect(0, 0, W, H);
    }
    var vg = c.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  };

  /* ---- OBEYING A BEAT ------------------------------------------------------ */
  Story.prototype.apply = function (b) {
    if (!b) return;
    this.beatNo++;
    /* A LINE BELONGS TO ITS BEAT. Left standing, the child's caption sat under
       the father six seconds later, which reads as a bug in the writing. */
    if (b.kind !== 'say') this.line = null;

    if (b.kind === 'set') {
      if (b.era) this.era = b.era;
      if (b.sky) this.sky = b.sky;
    } else if (b.kind === 'cut') {
      this.era = b.to || 'post_collapse';
      this.cast = {}; this.standing = null; this.sky = null;
      this.seating.clear();
    } else if (b.kind === 'actor') {
      var wanted = SEAT_ALIAS[b.at] || b.at || null;
      var castKey = (b.actor === 'player')
        ? ((b.age === 'child') ? 'PLAYER_child' : 'PLAYER_adult')
        : (ROLE_TO_CAST[b.actor] || null);
      if (!castKey) return;
      /* *** THE BEAT SAYS WHETHER THEY ARE SITTING, AND THIS IGNORED IT. ***
         Every actor beat carries a `pose` and every one of them was seated
         anyway, because the only scene that existed was a dinner table.
         bohemia_stage.js has had Seating.stand() the whole time -- it finds the
         nearest free non-solid cell -- and nothing had ever called it. Tenth
         time this lane has found a built, gated capability with zero callers. */
      var standing = b.pose && b.pose !== 'seated';
      /* *** STAND THEM WHERE THE CAMERA IS LOOKING, AND MIND THE UNITS. ***
         Seating.stand(actor, near) falls back to the room's BOTTOM-RIGHT CORNER
         when `near` is null, so the first cut put all three in the far corner
         with two of them outside the frame -- one shoulder at the edge.
         The second cut passed focusOf() straight in and EVERYBODY VANISHED:
         focusOf returns a RECT {x,y,w,h} and stand() wants a CELL {cx,cy}, so
         every distance came out NaN, no cell ever won, stand() returned null and
         the actor was dropped without a word. Both caught by looking at the
         picture; neither would ever have thrown.
         So: the centre cell of the focus rect, and a body that cannot be stood
         up SITS rather than disappearing -- somebody in the wrong pose is a
         thing you can see and fix, somebody missing is not. */
      var f = this.focus || {};
      var near = (typeof f.x === 'number')
        ? { cx: Math.round(f.x + (f.w || 0) / 2), cy: Math.round(f.y + (f.h || 0) / 2) }
        : null;
      var seat = standing ? (this.seating.stand(b.actor, near) || this.seating.sit(b.actor, wanted))
                          : this.seating.sit(b.actor, wanted);
      if (!seat) return;
      if (standing && seat.side !== 'stand') standing = false;   /* it sat after all */
      var back = this.frames[castKey + '_BACK'] ? castKey + '_BACK' : castKey;
      this.cast[b.actor] = {
        key: (!standing && seat.side === 'near') ? back : castKey,
        clip: standing ? 'idle' : 'sit-chair',
        stand: !!standing,
        seat: seat };
    } else if (b.kind === 'say') {
      /* *** PRINT THE RESOLVED LINE, NEVER THE AUTHORED ONE. ***
         The scene file writes "{sibling_lost}. Green ones too." because the name
         flips with the player. This read b.text raw, so the caption on screen
         would have been the literal token with the braces in it -- the runtime
         resolved it correctly and the surface printed past the answer. FOUND BY
         READING THE DRAW PATH, not by the gate: scene_gate proved the RUNTIME
         resolves both cases and went green while the pixels would have shown
         braces to a player. VERIFY ON THE REAL SURFACE, again.
         Resolved HERE, in the module, rather than at the two call sites -- a
         copied line is a fix that only half-ships. */
      var said = (this.RT && this.RT.fillNames)
        ? this.RT.fillNames(b.text || '', this.names)
        : (b.text || '');
      this.line = { speaker: b.speaker, text: said, draft: b.draft === true, cites: b.study || [] };
      /* THE VOICE GETS THE SAME WINDOW THE CAPTION GETS, so the babble finishes
         inside the line rather than talking over the next beat. */
      if (this.o.speak) {
        try { this.o.speak(b.speaker, this.line.text, this.ST.readMs(this.line.text)); } catch (e) {}
      }
      var self = this;
      var who = this.cast[b.speaker];
      if (who) { who.clip = 'talk'; }
      else if (ROLE_TO_CAST[b.speaker]) {
        /* NOT SEATED AND SPEAKING = ON THEIR FEET, and the solver finds a real
           free cell rather than a typed position. */
        var t = null;
        this.furn.props.forEach(function (p) { if (p.kind === 'table') t = p; });
        var s2 = this.seating.stand(b.speaker, t ? { cx: t.cx + t.w, cy: t.cy + t.h } : null);
        if (s2) this.standing = { key: ROLE_TO_CAST[b.speaker], clip: 'talk', seat: s2 };
      }
      Object.keys(this.cast).forEach(function (k) {
        /* back to THEIR pose, not to sitting. Restoring everyone to sit-chair
           put standing people back in chairs the moment somebody else spoke. */
        if (k !== b.speaker) self.cast[k].clip = self.cast[k].stand ? 'idle' : 'sit-chair';
      });
      if (this.standing && this.standing.key !== ROLE_TO_CAST[b.speaker]) this.standing.clip = 'idle';
    } else if (b.kind === 'handoff') {
      this.handoff = { to: b.to, encounter: b.encounter, call: b.call };
    } else if (b.kind === 'end') {
      this.ended = true;
    }
  };

  /* ---- PLAY ---------------------------------------------------------------- */
  Story.prototype._mkPlayer = function () {
    var ST = this.ST;
    /* LINE DURATION IS READING SPEED, injected as a policy. No say beat in any
       scene file carries a hand-typed hold any more. */
    return new this.RT.Scene(this.scene, { time: function (b) { return ST.readBeats(b.text); },
                                            names: this.names });
  };

  Story.prototype.start = function () {
    var self = this;
    this.stop();
    this.reset();
    this.player_ = this._mkPlayer();
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

  /* headless: play with no timers, and report enough for a gate to check
     occupancy, depth order and timing without a browser. */
  Story.prototype.playAll = function () {
    this.reset();
    this.player_ = this._mkPlayer();
    var seen = [], n = 0, self = this;
    while (!this.player_.done && n++ < 900) {
      var r = this.player_.step();
      this.apply(r.beat);
      if (!r.beat) continue;
      var cells = [], who = [];
      Object.keys(this.cast).forEach(function (k) {
        if (self.cast[k].seat) { cells.push(self.cast[k].seat.cx + ',' + self.cast[k].seat.cy); who.push(k); }
      });
      if (this.standing && this.standing.seat) {
        cells.push(this.standing.seat.cx + ',' + this.standing.seat.cy);
        who.push(this.standing.key);
      }
      seen.push({ kind: r.beat.kind, id: r.beat.id, era: this.era, cells: cells, who: who,
                  cast: cells.length, speaker: r.beat.speaker || null,
                  line: this.line && this.line.text, hold: r.needs });
    }
    return seen;
  };

  var API = { Story: Story, W: W, H: H, SEAT_ALIAS: SEAT_ALIAS, ROLE_TO_CAST: ROLE_TO_CAST,
              PHASES: PH, VERSION: 'cutscene-surface-2.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaStorySurface = API;
})(typeof window !== 'undefined' ? window : globalThis);
