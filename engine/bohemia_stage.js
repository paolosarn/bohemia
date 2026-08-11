// BOHEMIA STAGE — the plumbing under a cutscene (8/12/26, PEOPLE lane)
//
// Paolo 8/12, after watching the cold open: "im more concerned of the natural
// wiring and plumbing of the cutscenes as well. Like it should be seemless and
// not need to be so handcrafted everytime... From location. To it being the
// actual house. To mfs not glitching into furniture. To understanding how long
// voices should play compared to how long their text shit is."
//
// HE IS DESCRIBING THE DIFFERENCE BETWEEN A DIORAMA AND A SYSTEM, and v1 was a
// diorama. Its room was five hand-typed seat coordinates, a hand-typed table
// rect, and a hand-tuned `bodyY` per chair found by taking screenshots until
// nobody looked like they were standing on the furniture. That produces exactly
// one scene. The second scene would have cost the same day again, and the demo
// needs a lot more than two.
//
// SO EVERY NUMBER THAT WAS TYPED IS NOW DERIVED. Four answers, in his order:
//
//   LOCATION      a scene names a PLACE, not pixels.
//   THE ACTUAL    the room comes out of engine/bohemia_floorplan.js -- the same
//   HOUSE         generator the walked world uses, the one floorplan_gate proves
//                 every room of is reachable and every building enterable. A
//                 residential plan really does hand back a living room and a
//                 kitchen with rects and doors. The cutscene stands in a room
//                 the game could have built anyway, at a seed.
//   NO GLITCHING  furniture declares SOLID CELLS and the seat solver refuses to
//   INTO          put a body on one, or two bodies on the same cell. That is the
//   FURNITURE     OCCUPANCY LAW applied to a scene instead of a walk. Draw order
//                 is by cell depth, so a body behind the table is BEHIND it
//                 rather than accidentally on top of it.
//   VOICE vs TEXT a line's duration is computed from its own text at a real
//                 reading speed, and the babble is trimmed to fit inside that
//                 window. See TIME below -- it is the part of his note with an
//                 actual right answer.
//
// TIME: THE NUMBERS ARE NOT INVENTED. Subtitle practice has measured this for
// decades and the whole industry publishes its limits:
//   Netflix  20 chars/sec adult, 17 children; minimum 5/6 second on screen,
//            maximum 7 seconds; 42 characters per line.
//   BBC      17 chars/sec, subtitles held 2-5 seconds.
//   general  12-14 chars/sec (~180 wpm) as the comfortable rule of thumb.
// A cutscene is worse than television for reading: it is a phone, in one hand,
// with animation competing for the same eye. So this takes the COMFORTABLE end
// (14 cps), keeps Netflix's floor and ceiling, and then rounds UP to a whole
// beat because everything in this game quantizes to 120 BPM. A short line gets
// a short hold and a long line gets a long one, automatically, forever.
//
// DETERMINISTIC AND HEADLESS. No DOM, no clock, no Math.random. The gate stages
// rooms and counts overlaps without a browser; the surface only draws what this
// hands it.
(function (root) {
  'use strict';

  var BEAT_MS = 500;                 // 120 BPM LAW, stated once

  /* ---- 1. TIME ------------------------------------------------------------- */
  var CPS = 14;                      // comfortable end of the published range
  var MIN_MS = 833;                  // Netflix minimum, 5/6 of a second
  var MAX_MS = 7000;                 // Netflix maximum

  function readMs(text) {
    var n = String(text == null ? '' : text).trim().length;
    if (!n) return 0;
    var ms = (n / CPS) * 1000;
    return Math.max(MIN_MS, Math.min(MAX_MS, ms));
  }
  /* rounded UP: a line that needs 1.2 beats gets 2, never 1. Reading speed is a
     floor on comfort, so the rounding has to go the safe way. */
  function readBeats(text) {
    var ms = readMs(text);
    return ms ? Math.max(1, Math.ceil(ms / BEAT_MS)) : 0;
  }

  /* HOW MUCH OF THE LINE THE VOICE ACTUALLY SPEAKS. The babble engine emits one
     letter every 1/rate seconds, so a 51-letter line at rate 10.7 runs 4.8s. Say
     that under a caption held for 1s and the voice is still talking over the
     next beat; hold the caption for 5s to cover it and every short line drags.
     Both halves are wrong, and both were wrong in v1.
     The caption's length is set by READING SPEED (above, which is the human
     constraint), and the SPOKEN line is then trimmed to fit inside it on whole
     words -- 85% of the window, so a line lands and leaves a breath rather than
     running to the last frame. This is the coupling he asked for, in one place,
     for every line ever written. */
  function voiceFit(text, ms, rate) {
    text = String(text == null ? '' : text);
    if (!text || !(rate > 0)) return text;
    var budget = Math.floor(rate * (ms / 1000) * 0.85);
    if (!budget) return '';
    var letters = function (s) { return s.replace(/[^A-Za-z]/g, '').length; };
    if (letters(text) <= budget) return text;
    var words = text.split(/\s+/), out = '', i;
    for (i = 0; i < words.length; i++) {
      var next = out ? out + ' ' + words[i] : words[i];
      if (letters(next) > budget) break;
      out = next;
    }
    return out || words[0] || '';
  }

  /* ---- 2. THE ACTUAL HOUSE ------------------------------------------------- */
  /* A scene asks for a PLACE and gets a real generated building. No cutscene
     ever types a room rectangle again. */
  function house(spec, FP) {
    spec = spec || {};
    FP = FP || root.BOH_FLOORPLAN;
    if (!FP || !FP.generate) return null;
    var w = spec.w || 24, h = spec.h || 16;
    var fp = FP.generate(spec.seed == null ? 7 : spec.seed, w, h, {
      zone: spec.zone || 'residential',
      entrance: spec.entrance || 'S'
    });
    var want = spec.role || 'living';
    /* the biggest room with the wanted role, so a scene gets the room somebody
       would actually eat in rather than the first four-by-four the plan made. */
    var best = null;
    (fp.rooms || []).forEach(function (r) {
      if (r.role !== want) return;
      if (!best || r.w * r.h > best.w * best.h) best = r;
    });
    if (!best) (fp.rooms || []).forEach(function (r) {
      if (!best || r.w * r.h > best.w * best.h) best = r;
    });
    if (!best) return null;
    return { fp: fp, room: { x: best.x, y: best.y, w: best.w, h: best.h, role: best.role },
             zone: fp.meta && fp.meta.zone, seed: spec.seed == null ? 7 : spec.seed };
  }

  /* ---- 3. FURNISH BY RULE -------------------------------------------------- */
  /* Props carry a CELL FOOTPRINT and a solid flag. Everything downstream --
     occupancy, draw order, the seat solver -- reads those two facts, so adding a
     prop is adding a row here and nothing else anywhere. */
  function furnish(room, kind) {
    var props = [], seats = [];
    var cx = room.x + (room.w / 2), cy = room.y + (room.h / 2);

    if (kind === 'dining' || kind == null) {
      /* THE TABLE, centred, two cells deep, as wide as the room allows up to 4. */
      var tw = Math.max(2, Math.min(4, room.w - 2));
      var tx = Math.round(cx - tw / 2), ty = Math.round(cy - 1);
      props.push({ name: 'table', cx: tx, cy: ty, w: tw, h: 2, solid: true, kind: 'table' });

      /* CHAIRS ON BOTH LONG SIDES, derived from the table, never typed. The far
         row faces the camera, the near row has its back to it, and the count
         falls out of the table's width. */
      var i;
      for (i = 0; i < tw; i++) {
        seats.push({ id: 'far_' + i, cx: tx + i, cy: ty - 1, face: 'S', side: 'far' });
      }
      for (i = 0; i < tw; i++) {
        seats.push({ id: 'near_' + i, cx: tx + i, cy: ty + 2, face: 'N', side: 'near' });
      }
      seats.forEach(function (s) {
        props.push({ name: 'chair', cx: s.cx, cy: s.cy, w: 1, h: 1, solid: false,
                     kind: 'chair', seat: s.id });
      });
      /* what is ON the table is dressing: it sits on a solid cell on purpose and
         is drawn above it, so it is not part of occupancy. */
      props.dressCells = [];
      for (i = 0; i < tw; i++) props.dressCells.push({ cx: tx + i, cy: ty });
    }
    return { props: props, seats: seats,
             centre: { cx: cx, cy: cy } };
  }

  /* ---- 4. OCCUPANCY -------------------------------------------------------- */
  function key(cx, cy) { return cx + ',' + cy; }

  function solidCells(props) {
    var s = {};
    (props || []).forEach(function (p) {
      if (!p.solid) return;
      for (var y = 0; y < p.h; y++) for (var x = 0; x < p.w; x++) s[key(p.cx + x, p.cy + y)] = p.name;
    });
    return s;
  }

  /* ONE BODY PER CELL, AND NEVER INSIDE THE FURNITURE (OCCUPANCY LAW, applied to
     a scene). A scene asks for a named seat; if that seat is taken or standing on
     something solid, the solver walks to the next free one instead of stacking
     two people in a chair or planting somebody in the tabletop. Deterministic:
     same order in, same seats out. */
  function Seating(room, furn) {
    this.room = room;
    this.seats = furn.seats.slice();
    this.solid = solidCells(furn.props);
    this.taken = {};
    this.byActor = {};
  }
  Seating.prototype.free = function (s) {
    return !this.taken[key(s.cx, s.cy)] && !this.solid[key(s.cx, s.cy)];
  };
  Seating.prototype.sit = function (actorId, wanted) {
    if (this.byActor[actorId]) return this.byActor[actorId];
    var i, s = null;
    if (wanted) for (i = 0; i < this.seats.length; i++)
      if (this.seats[i].id === wanted && this.free(this.seats[i])) s = this.seats[i];
    if (!s) for (i = 0; i < this.seats.length; i++)
      if (this.free(this.seats[i])) { s = this.seats[i]; break; }
    /* MORE PEOPLE THAN CHAIRS IS NORMAL, AND VANISHING IS NOT AN ANSWER. A small
       room seats four and a family is five; v1 could not express that at all and
       the fifth person simply did not get drawn. Somebody with nowhere to sit
       STANDS, which is what a person does. */
    if (!s) return this.stand(actorId);
    if (!s) return null;
    this.taken[key(s.cx, s.cy)] = actorId;
    this.byActor[actorId] = s;
    return s;
  };
  /* somebody on their feet still takes a cell, and still may not take a solid
     one -- that is the case v1 could not express at all. */
  Seating.prototype.stand = function (actorId, near) {
    if (this.byActor[actorId]) return this.byActor[actorId];
    var r = this.room, best = null, bd = 1e9;
    var tx = near ? near.cx : r.x + r.w - 1, ty = near ? near.cy : r.y + r.h - 1;
    for (var y = r.y; y < r.y + r.h; y++) for (var x = r.x; x < r.x + r.w; x++) {
      if (this.taken[key(x, y)] || this.solid[key(x, y)]) continue;
      var d = Math.abs(x - tx) + Math.abs(y - ty);
      if (d < bd) { bd = d; best = { id: 'stand:' + x + ':' + y, cx: x, cy: y, face: 'SW', side: 'stand' }; }
    }
    if (!best) return null;
    this.taken[key(best.cx, best.cy)] = actorId;
    this.byActor[actorId] = best;
    return best;
  };
  Seating.prototype.clear = function () { this.taken = {}; this.byActor = {}; };

  /* ---- 5. CAMERA ----------------------------------------------------------- */
  /* ONE transform, room cells -> screen pixels, and everything goes through it:
     props, bodies, shadows, dressing. That is what makes a body land on a chair
     without anybody tuning a `bodyY` by screenshot. Fixed for the life of a
     scene, which is also what keeps a match-cut a match-cut. */
  /* IT FRAMES THE ACTION, NOT THE FLOORPLAN. The first version fitted the whole
     room to the screen, and a ten-by-nine living room put a four-cell table in
     the top-left corner with two hundred pixels of empty tile under it. A camera
     operator frames the subject; the room only decides where the walls are. So
     the camera takes a FOCUS -- the bounding box of the furniture and its seats,
     computed in furnish(), never typed -- and pushes in on that. Any room, any
     table size, any number of chairs: the shot composes itself. */
  function focusOf(furn, room) {
    var xs = [], ys = [];
    (furn.props || []).forEach(function (p) { xs.push(p.cx, p.cx + p.w); ys.push(p.cy, p.cy + p.h); });
    (furn.seats || []).forEach(function (s) { xs.push(s.cx, s.cx + 1); ys.push(s.cy, s.cy + 1); });
    if (!xs.length) return { x: room.x, y: room.y, w: room.w, h: room.h };
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function camera(room, view, focus) {
    view = view || { w: 360, h: 470 };
    var F = focus || room;
    /* AIR EACH SIDE, IN CELLS. This is the zoom knob and it is the only one:
       more air, more cells across the same screen, smaller everybody. At 0.7 the
       four diners were shoulder-overlapping giants; 1.6 puts a whole person in a
       cell and leaves the room around them visible. */
    var pad = 1.6;
    var cw = view.w / (F.w + pad * 2);
    var cd = cw * 0.62;                              // three-quarter foreshortening
    var wallH = Math.max(96, Math.round(view.h * 0.34));
    var ox = view.w / 2 - (F.x + F.w / 2) * cw;
    /* the far row sits just under the wall, so the back wall is behind the
       people rather than a hundred pixels above them. */
    var oy = wallH + cd * 0.9 - F.y * cd;
    var depth0 = F.y, depthN = F.y + F.h;
    return {
      cw: cw, cd: cd, wallH: wallH, view: view, room: room,
      project: function (cx, cy) { return { x: ox + cx * cw, y: oy + cy * cd }; },
      /* a body further back is smaller. Linear is plenty at this depth and it
         keeps the scene readable rather than technically correct. */
      scaleAt: function (cy) {
        var t = (cy - depth0) / Math.max(1, (depthN - depth0));
          return 0.82 + 0.46 * Math.max(0, Math.min(1, t));
      },
      depth: function (cy) { return cy; }
    };
  }

  var API = {
    BEAT_MS: BEAT_MS, CPS: CPS, MIN_MS: MIN_MS, MAX_MS: MAX_MS,
    readMs: readMs, readBeats: readBeats, voiceFit: voiceFit,
    house: house, furnish: furnish, solidCells: solidCells, Seating: Seating,
    camera: camera, focusOf: focusOf, VERSION: 'stage-1.1.0',
    SOURCES: ['Netflix Timed Text Style Guide (20 cps adult / 17 children, 5/6s min, 7s max, 42 chars per line)',
              'BBC subtitle guidelines (17 cps, 2-5s on screen)',
              'general practice 12-14 cps / ~180 wpm']
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BOH_STAGE = API;
})(typeof window !== 'undefined' ? window : globalThis);
