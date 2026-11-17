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
    PP.drew = 0; PP.last = {};
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
})();
