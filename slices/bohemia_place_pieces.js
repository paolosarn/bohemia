/* ==========================================================================
   __THE_PLACES_WEAR_THEIR_OWN_PIECE__ (COOK FIVE 11/17, VAMILY rules 453, 441, 408, 409(c))

   THE REAL PLACES (records/target/bb/real_places.json; slices/bohemia_real_places.js names them, takes the tap and opens the
   screen) wore on the map THE KIT ART OF THE KIND EACH IS LIKE: the bus yard a terminal like any terminal, the greenhouses a
   farm like any farm. That file says it in its own words: 'until COOK FOUR's golden piece (rule 408)'. This is where a
   place's own piece is drawn.

   WHAT THIS FILE DOES, and nothing else: for every real place seated on this valley (BOH_REAL_PLACES.cellsNow(), WORLD's own
   list, never a second one) whose id has an entry in place_pieces/place_pieces.json, it draws that place's picture on its
   own block: the picture's ground plate scaled to the block times 'wide' (a landmark is read from a few blocks off, the way a
   boss's place is: 1.3) and never under 'min_css' points across (measured 11/17: the map he travels is 18 points a block, so a
   place at 1.3 blocks was 23 points wide, a crumb), its two frames on the map's own beat. It is drawn where the land is drawn: UNDER the fog (a place
   he has not seen is dark like the land round it), under the night, under the names and the people. A place with no entry
   wears its kind's kit art as before. No tap, no name, no rule: those stay WORLD's.
   The map calls BohemiaPlacePieces.draw(ox, oy) once a frame (one line in BOHEMIA_CITY_WORLD.html, before the fog).
   The pictures: tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py, through the map's rig.
   BohemiaPlacePieces.on = false is the page test's switch (the kit art alone), never the game's.
   THE REGION'S FOUR (COOK SIX 11/20): a region place's piece is drawn by the region's own draw through a wrap of mapBaseDraw by
   its name (the seam at the foot of this file); PP.region counts them.
   ========================================================================== */
(function () {
  'use strict';
  if (typeof om === 'undefined' || typeof iso !== 'function') return;
  var PP = window.BohemiaPlacePieces = { man: null, pics: null, img: {}, on: true, drew: 0, last: {}, err: null };
  try {
    fetch('place_pieces/place_pieces.json').then(function (r) { return r.json(); }).then(function (j) {
      PP.man = j; PP.pics = (j && j.pictures) || {};
      Object.keys(PP.pics).forEach(function (k) { (PP.pics[k].frames || []).forEach(function (f) { var im = new Image(); im.src = 'place_pieces/' + String(f).replace(/[^\w.]/g, ''); PP.img[f] = im; }); });
      try { if (typeof render === 'function') render(); } catch (_e) {}
    }).catch(function (e) { PP.err = String(e && e.message || e); });
  } catch (_e) {}
  PP.draw = function (ox, oy) {
    PP.drew = 0; PP.last = {}; PP.n = {}; PP.ms = 0; if (PP.region) { PP.region.drew = 0; PP.region.last = {}; }   /* (the region's are counted after the frame, in its own draw) */
    if (!PP.on || !PP.pics) return;
    try {
      if (typeof MODE === 'undefined' || MODE !== 'city') return;
      var RP = window.BOH_REAL_PLACES; if (!RP || !RP.cellsNow) return;
      var minPx = (PP.man && PP.man.min_block_px) || 10; if (!(TW >= minPx)) return;   /* at the far stops the valley is its towns */
      var wide = (PP.man && PP.man.wide) || 1.3, minCss = PP.man && PP.man.min_css_valley != null ? PP.man.min_css_valley : ((PP.man && PP.man.min_css) || 0), ppc = 1, beat = 0;   /* __THE_PLACES_SIT_IN_THE_GROUND__: a valley place's lot is its block (place_pieces.json min_css_valley 0, wide 1.0) */
      try { var r = cv.getBoundingClientRect(); if (r.width) ppc = CVW / r.width; } catch (_e) {}   /* canvas px a CSS px */
      try { beat = mapArtBeat(); } catch (_e) {}
      var now = performance.now(); if (TW !== PP.camTW) { PP.camTW = TW; PP.camT = now; } PP.built = 0; PP.buildMs = 0; PP.waiting = 0; PP.again = false;
      RP.cellsNow().forEach(function (c) {
        var P = PP.pics[c.id]; if (!P) return;
        var fi = beat % P.frames.length, im = PP.img[P.frames[fi]]; if (!im || !im.complete || !im.naturalWidth) return;
        var p = iso(c.x, c.y, ox, oy), sc = Math.max(TW * (P.wide || wide), minCss * ppc) / P.plate;   /* its lot its block (min_css_valley 0, 11/26); a modder's min_css_valley still holds a floor */
        var x = Math.round(p.sx - P.bx * sc), y = Math.round(p.sy + TH / 2 - P.by * sc), w = Math.round(P.w * sc), h = Math.round(P.h * sc);
        if (x > CVW || y > CVH || x + w < 0 || y + h < 0) return;
        var t0 = performance.now(), cut = inDepth(c, P, im, fi, x, y, w, h, p.sx, p.sy + TH / 2, now);
        PP.ms += performance.now() - t0;
        PP.drew++; PP.n[c.id] = (PP.n[c.id] | 0) + 1;
        /* the tap's box (slices/bohemia_real_places.js): the picture as drawn, its plate's two side corners across and its first
           opaque row to its plate's front corner down (place_pieces.json top/bx/by/plate, measured from its own pixels) */
        var top = P.top != null ? P.top : 0, box = { x: x + (P.bx - P.plate / 2) * sc, y: y + top * sc, w: P.plate * sc, h: (P.by + P.plate / 4 - top) * sc };
        PP.last[c.id] = { x: x, y: y, w: w, h: h, at: [c.x, c.y], frame: fi, cut: cut, box: box, sc: sc };
      });
      /* a cut still owed (the zoom moving, or a crowd new on the glass): one more frame once the zoom has held, so a map left
         still never keeps a scaled or uncut place */
      if (PP.again && !PP.timer) PP.timer = setTimeout(function () { PP.timer = 0; try { if (typeof render === 'function' && typeof MODE !== 'undefined' && MODE === 'city') render(); } catch (_e) {} }, PP.waiting ? 16 : PP.HOLD + 20);
    } catch (e) { PP.err = String(e && e.message || e); }
  };

  /* ==== __THE_PLACES_SIT_IN_THE_GROUND__ (WORLD 15, 11/26, VAMILY rule 480(b) on the map's places as built; rule 479's lesson,
     Paolo 11/22: 'they look like they're floating on top of the map rather than actually being integrated properly into the map').
     MEASURED (a phone upright, the 15 places at a block 72 and 36 px, the piece on and off): every place was drawn AFTER the whole
     painted city and over it, so the tower in front of THE DOME, CHANNEL 8, THE COOLING CENTER or SHARK REEF was painted over by
     the place's ground plate: the place sat on top of the towers in front of it, a picture pasted on the map. NOW a place is drawn
     IN DEPTH with the painting, by the map's own reading (RUN's __YOU_WALK_BEHIND_IT__, mapDepthCovers, the one his crew walks
     behind the towers by): a pixel of the place is left out where what is painted there stands nearer the camera than the place's
     block (its own block never stands in front of it); 11% to 47% of each place, measured.
     THE COST, NEVER CHOPPY (rule 480(c)): the cut asked every point of the picture every frame cost 2 to 25 ms on this box. So the
     cut picture is KEPT (one per place and beat frame, at the zoom it was made at) and drawn with one drawImage a frame: a walk
     and a pan move the place and the city together, so the same cut holds. A pinch draws the kept cut scaled with the map (the
     projection is a scale) and the cut is made again once the zoom has held 150 ms, one place a frame. A place first on the glass
     is cut at once. Nothing read back (the mask is drawn out of the picture on the canvas). PP.depth = false is the page test's
     switch (the old way: the picture over everything). ==== */
  PP.depth = true; PP.n = {}; PP.ms = 0; PP.camTW = 0; PP.camT = 0; PP.built = 0; PP.buildMs = 0; PP.waiting = 0; PP.HOLD = 150; PP.STEP = 1; PP.BUDGET = 3; PP.again = false; PP.timer = 0;
  PP.kept = {}; PP.stats = { built: 0, held: 0, scaled: 0, plain: 0 }; PP.depSeq = 0; PP.depRef = null; PP.tileSeq = 0;
  function depKey(c) {
    try { if (VBC.dep !== PP.depRef) { PP.depRef = VBC.dep; PP.depSeq++; } } catch (_e) { return null; }
    /* every close tile under the picture (the glass over a place reads the ground of its block and of the blocks behind it, up to
       its height): a sharper tile arriving under any of them is a new cut (measured: a cut made before the tile behind THE MOB
       MUSEUM came in kept the coarse depth there) */
    var t = [];
    try { if (VBT.onGlass && VBT.NT) { var seen = {};
      for (var dy = -4; dy <= 1; dy++) for (var dx = -4; dx <= 1; dx++) {
        var tx = Math.floor((c.x + dx + 0.5) / VB_TILE), ty = Math.floor((c.y + dy + 0.5) / VB_TILE), kk = tx + ',' + ty; if (seen[kk]) continue; seen[kk] = 1;
        var T = (tx >= 0 && ty >= 0 && tx < VBT.NT && ty < VBT.NT) ? VBT.onGlass[ty * VBT.NT + tx] : null;
        t.push(T && T.dep ? (T.dep.__ppSeq || (T.dep.__ppSeq = ++PP.tileSeq)) : 0); } } } catch (_e) {}   /* the depth itself, not its tile: a tile baked again keeps its object */
    var hs = 0; try { var HL = window.BohemiaMapHouses && window.BohemiaMapHouses.last; hs = (HL && HL.drew) | 0; } catch (_e) {}   /* the houses up close stand in front too (mapDepthCovers asks them) */
    return PP.depSeq + '/' + t.join('.') + '/h' + hs;
  }
  function plain(im, x, y, w, h, P) { g.imageSmoothingEnabled = w < P.w; g.drawImage(im, x, y, w, h); g.imageSmoothingEnabled = false; }
  function inDepth(c, P, im, fi, x, y, w, h, gx, gy, now) {
    var ok = PP.depth && typeof mapDepthCovers === 'function' && typeof mapDepthRef === 'function' && typeof MAP_DEPTH !== 'undefined' && MAP_DEPTH.on && typeof g.getTransform === 'function';   /* (MAP_DEPTH.hide is a checker's switch for the walkers, not the places) */
    var dk = ok ? depKey(c) : null;
    if (!ok || !dk || !VBC.dep) { plain(im, x, y, w, h, P); PP.stats.plain++; return -1; }
    var m = g.getTransform(); if (m.b || m.c) { plain(im, x, y, w, h, P); PP.stats.plain++; return -1; }
    var K = PP.kept[c.id] || (PP.kept[c.id] = {}), C = K[fi], key = Math.round(TW * 100) + ':' + dk + ':' + w + 'x' + h, held = now - PP.camT >= PP.HOLD;
    if (C && C.key === key) { g.imageSmoothingEnabled = false; g.drawImage(C.cv, 0, 0, C.cv.width, C.cv.height, x, y, w, h); C.used = now; PP.stats.held++; return C.share; }
    if (C && (!held || PP.built >= 1)) {   /* the zoom is moving, or a place was cut this frame already: the kept cut, scaled with the map */
      var s = TW / C.TW; g.imageSmoothingEnabled = true; g.drawImage(C.cv, 0, 0, C.cv.width, C.cv.height, gx + C.ox * s, gy + C.oy * s, C.w * s, C.h * s); g.imageSmoothingEnabled = false;
      C.used = now; PP.stats.scaled++; PP.again = true; return C.share; }
    if (!C && PP.built >= 1 && PP.buildMs >= PP.BUDGET) { plain(im, x, y, w, h, P); PP.stats.plain++; PP.waiting++; PP.again = true; return -2; }   /* a crowd of places new on the glass: cut over the next frames, never all in one */
    /* cut it: the picture at the glass's own pixels, the points where the painting stands in front of the place's block taken out */
    var dpr = m.a || 1, pw = Math.max(1, Math.ceil(w * dpr)), ph = Math.max(1, Math.ceil(h * dpr)), st = PP.STEP, cw = Math.ceil(w / st), ch = Math.ceil(h / st);
    var tb = performance.now(), cvs = (C && C.cv) || document.createElement('canvas'); cvs.width = pw; cvs.height = ph;
    var cx = cvs.getContext('2d'); cx.imageSmoothingEnabled = w < P.w; cx.clearRect(0, 0, pw, ph); cx.drawImage(im, 0, 0, pw, ph);
    var mk = PP.mask || (PP.mask = document.createElement('canvas')); if (mk.width < cw) mk.width = cw; if (mk.height < ch) mk.height = ch;
    var mx = mk.getContext('2d'); mx.clearRect(0, 0, mk.width, mk.height); mx.fillStyle = '#000';
    var R = mapDepthRef(c.x, c.y), yCut = -Infinity; try { if (typeof mapDepthOpenAbove === 'function') yCut = mapDepthOpenAbove(R); } catch (_e) {}
    var n = 0, cov = 0;
    for (var j = 0; j < ch; j++) { var Y = y + (j + 0.5) * st; if (Y <= yCut) continue;
      for (var i = 0; i < cw; i++) { n++; if (mapDepthCovers(x + (i + 0.5) * st, Y, R)) { cov++; var i1 = i; while (i1 + 1 < cw && mapDepthCovers(x + (i1 + 1.5) * st, Y, R)) { i1++; cov++; } mx.fillRect(i, j, i1 - i + 1, 1); i = i1; } } }
    if (cov) { cx.globalCompositeOperation = 'destination-out'; cx.imageSmoothingEnabled = false; cx.drawImage(mk, 0, 0, cw, ch, 0, 0, cw * st * dpr, ch * st * dpr); cx.globalCompositeOperation = 'source-over'; }
    C = K[fi] = { cv: cvs, key: key, TW: TW, ox: x - gx, oy: y - gy, w: w, h: h, share: cw * ch ? cov / (cw * ch) : 0, used: now };
    PP.built++; PP.stats.built++; PP.buildMs += performance.now() - tb;
    g.imageSmoothingEnabled = false; g.drawImage(cvs, 0, 0, pw, ph, x, y, w, h);
    /* keep at most 32 places' cuts (two frames each; the valley has 15, so every place on the glass keeps its own and nothing is
       cut again for want of room): the oldest let go */
    var ids = Object.keys(PP.kept); if (ids.length > 32) { ids.sort(function (a, b) { return lastUse(PP.kept[a]) - lastUse(PP.kept[b]); }); delete PP.kept[ids[0]]; }
    return C.share;
  }
  function lastUse(K) { var u = 0; for (var f in K) if (K[f] && K[f].used > u) u = K[f].used; return u; }
  /* ==== /__THE_PLACES_SIT_IN_THE_GROUND__ ==== */

  /* THE REGION'S PLACES (COOK SIX 11/20, VAMILY rules 461, 408, 409(c); COOK FIVE's list: 'measure how the region draws its four
     real places'). MEASURED: the four places out past the rim (real_places.json where 'region': TULE SPRINGS LAB, LENZIE STATION,
     SPRING MOUNTAIN RANCH, CALLVILLE BAY) are drawn by slices/bohemia_region.js drawPlaces, after the whole map frame, through the
     map's own mapBaseDraw(tier, name, sx, footY, mine, beat): the patch the map paints of the far land, or the tier's art. PP.draw
     above sees only the valley's. So this is the one seam: mapBaseDraw is wrapped by NAME. A region place whose id has a picture
     here is drawn as its own piece in place of the patch (its ground plate scaled to the patch's own blocks, a fortress 4 and a
     camp 2, times 0.85, never under min_css) and its size goes back to the region's draw, which takes the tap and sets the name
     by it as before. Any other name, the switch off (PP.on false), a picture not loaded or the far stops: the map's own draw. */
  PP.region = { drew: 0, last: {}, ids: null };
  function regionId(name) {
    if (!PP.region.ids) { var RP = window.BOH_REAL_PLACES; if (!RP || !RP.loaded || !RP.list) return null; var m = {};
      RP.list.forEach(function (p) { if (p && p.where === 'region' && p.name && p.id) m[p.name] = p.id; }); PP.region.ids = m; }
    return PP.region.ids[name] || null;
  }
  try {
    var _mbd = window.mapBaseDraw;
    if (typeof _mbd === 'function') window.mapBaseDraw = function (tier, name, sx, footY) {
      try {
        if (PP.on && PP.pics && typeof MODE !== 'undefined' && MODE === 'city' && window.BOH_REGION && typeof vbRegionPlaceOf === 'function' && vbRegionPlaceOf(name)) {
          var id = regionId(name), P = id && PP.pics[id], minPx = (PP.man && PP.man.min_block_px) || 10;
          if (P && TW >= minPx) {
            var beat = 0; try { beat = mapArtBeat(); } catch (_e) {}
            var im = PP.img[P.frames[beat % P.frames.length]];
            if (im && im.complete && im.naturalWidth) {
              var ppc = 1; try { var r = cv.getBoundingClientRect(); if (r.width) ppc = CVW / r.width; } catch (_e) {}
              var n = tier === 'fortress' ? 4 : tier === 'town' ? 3 : 2, minCss = (PP.man && PP.man.min_css) || 0;   /* the map's own patch (vbRegionPatchGeom) */
              var sc = Math.max(TW * n * 0.85, minCss * ppc) / P.plate, gy = footY - 6;                                   /* the block's ground centre (the region's foot is it + 6) */
              var x = Math.round(sx - P.bx * sc), y = Math.round(gy - P.by * sc), w = Math.round(P.w * sc), h = Math.round(P.h * sc);
              g.imageSmoothingEnabled = w < P.w; g.drawImage(im, x, y, w, h); g.imageSmoothingEnabled = false;
              PP.region.drew++; PP.region.last[id] = { x: x, y: y, w: w, h: h, frame: beat % P.frames.length, name: name };
              try { if (MAP_DREW && MAP_DREW.art) MAP_DREW.art.buildings++; } catch (_e) {}
              return { width: Math.round(w * 0.85), height: Math.max(6, Math.round(footY - y)), piece: 1 };
            }
          }
        }
      } catch (e) { PP.err = String(e && e.message || e); }
      return _mbd.apply(this, arguments);
    };
  } catch (_e) {}
})();
