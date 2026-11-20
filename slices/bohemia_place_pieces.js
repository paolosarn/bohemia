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
    PP.drew = 0; PP.last = {}; if (PP.region) { PP.region.drew = 0; PP.region.last = {}; }   /* (the region's are counted after the frame, in its own draw) */
    if (!PP.on || !PP.pics) return;
    try {
      if (typeof MODE === 'undefined' || MODE !== 'city') return;
      var RP = window.BOH_REAL_PLACES; if (!RP || !RP.cellsNow) return;
      var minPx = (PP.man && PP.man.min_block_px) || 10; if (!(TW >= minPx)) return;   /* at the far stops the valley is its towns */
      var wide = (PP.man && PP.man.wide) || 1.3, minCss = (PP.man && PP.man.min_css) || 0, ppc = 1, beat = 0;
      try { var r = cv.getBoundingClientRect(); if (r.width) ppc = CVW / r.width; } catch (_e) {}   /* canvas px a CSS px */
      try { beat = mapArtBeat(); } catch (_e) {}
      RP.cellsNow().forEach(function (c) {
        var P = PP.pics[c.id]; if (!P) return;
        var im = PP.img[P.frames[beat % P.frames.length]]; if (!im || !im.complete || !im.naturalWidth) return;
        var p = iso(c.x, c.y, ox, oy), sc = Math.max(TW * (P.wide || wide), minCss * ppc) / P.plate;   /* a landmark: never under min_css across, however far out (a boss's place is held to 64 the same way) */
        var x = Math.round(p.sx - P.bx * sc), y = Math.round(p.sy + TH / 2 - P.by * sc), w = Math.round(P.w * sc), h = Math.round(P.h * sc);
        if (x > CVW || y > CVH || x + w < 0 || y + h < 0) return;
        g.imageSmoothingEnabled = w < P.w; g.drawImage(im, x, y, w, h); g.imageSmoothingEnabled = false;
        PP.drew++; PP.last[c.id] = { x: x, y: y, w: w, h: h, at: [c.x, c.y], frame: beat % P.frames.length };
      });
    } catch (e) { PP.err = String(e && e.message || e); }
  };

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
