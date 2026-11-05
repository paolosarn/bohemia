/* ============================================================================
   THE HOUSES STAND UP CLOSE (WORLD 8, 11/3/26; ask lines 117 and 185; rules 300 and 337)

   PAOLO 10/25: 'on the map I need the buildings to be taller taller taller... the bottom of your legs, depending on how
   zoomed in zoomed out you are, are behind the buildings.' PAOLO 10/26: 'zoom in a lot more, even on the main map... almost
   like I'm on the combat map... you feel like you're actually watching your team walk through the city... it doesn't have
   to transition to a whole other screen.' PAOLO 10/27: 'why can't the graphics just get better as you zoom in.'

   MEASURED BEFORE (the demo, his phone, 390 x 844): the pinch stopped at a block 85 CSS px wide; a house there was a painted
   box about 25 px wide and 20 tall while his men stand 51 px, so the crew stood taller than the houses and nothing hid them
   (EYES q28, 10/25w). The block war's walk and the fight have real models; the map had none.

   NOW, ONE PINCH ON THE SAME MAP AND THE SAME CAMERA: from a block 96 px every house lot the painter rolls (where it stood
   at every zoom, the same rolls) gets the studio's own model (COOK's five ranch houses, COOK PROPS' single-wide in a trailer
   park), shot from THE MAP'S camera (corner-on, 30 down, the land's one sun: tools/bohemia_world_8_map_houses.py), standing
   2.0 times its metres, toned to the map's light; the painter lays those lots as yards and a tile's models stand the moment its
   yards land (never a box and a model at once). The
   pinch goes on to THE STREET STOP, a block 380 CSS px, where a house is about 100 to 120 px tall to his 56 px men. His
   men, the roaming parties and the hunters walk BEHIND a model nearer the camera (the painting's own depth test, the same
   ghost of his outline when most of him is hidden). Up close THE WALK READS: past a block 90 px the crew crosses the glass at
   about 80 px a second (each block takes more beats, the mountain's own way; the clock pays the same minutes a block).
   The fog's rule holds: a model stands only on ground he has seen. The HUD, the phone and PLAY never move.
   Hooks: tools/bohemia_world_8_map_houses_patch.py (__THE_HOUSES_STAND_UP_CLOSE__). Gate: gates/the_houses_stand_up_close_gate.js.
   ============================================================================ */
(function (root) {
  'use strict';
  var H = { on: true, from: 96, full: 96, tone: [0.70, 0.67, 0.62], grey: 0.3, streetTW: 380, walkPx: 80, walkFrom: 90, walkReads: false, B: 36, eps: 0.08,
            houses: ['ranch_plain', 'ranch_porch', 'ranch_wing', 'ranch_garage', 'ranch_carport'], trailer: 'trailer' };
  var MAN = null, IMG = {}, AL = {}, ASKED = false, READY = false, FR = [], GRID = null, GC = 64;
  var LAST = { drew: 0, tiles: 0, lots: 0, culled: 0, unseen: 0, a: 0, ms: 0, covered: 0 };

  function on() {
    try { return !!(H.on && READY && VB_ONE_MAP && typeof MODE !== 'undefined' && MODE === 'city' && !(typeof LOOK !== 'undefined' && LOOK.on)
      && !(typeof VISTA !== 'undefined' && VISTA) && !(typeof SKY !== 'undefined' && SKY)); } catch (e) { return false; }
  }
  function load() {
    if (ASKED) return; ASKED = true;
    var done = function (m) {
      MAN = m; var ks = Object.keys(m.sprites || {}), left = ks.length;
      ks.forEach(function (k) {
        var im = new Image();
        im.onload = function () {
          try { var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d', { willReadFrequently: true });
            x.drawImage(im, 0, 0); var D = x.getImageData(0, 0, c.width, c.height), d = D.data, a = new Uint8Array(c.width * c.height);
            /* toned to the map's own light once, at load (the painting is dust and shade; a render under the studio's sun is paler):
               a third of the way to grey, then the map's warm dim; never a filter or a blend on the world canvas */
            for (var i = 0; i < a.length; i++) { var o = i * 4, l = 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2];
              for (var ch = 0; ch < 3; ch++) d[o + ch] = Math.round((d[o + ch] + (l - d[o + ch]) * H.grey) * H.tone[ch]);
              a[i] = d[o + 3]; }
            x.putImageData(D, 0, 0); AL[k] = a; IMG[k] = c; } catch (e) {}
          if (--left <= 0) { READY = true; try { MAP_GROUND.key = ''; render(); } catch (e) {} }
        };
        im.onerror = function () { if (--left <= 0) READY = Object.keys(IMG).length > 0; };
        im.src = 'map_houses/' + m.sprites[k].file;
      });
    };
    try { fetch('map_houses/manifest.json').then(function (r) { return r.json(); }).then(done).catch(function () {}); } catch (e) {}
  }
  /* ONE HAND-OVER, NO GHOST (rule 142's measurement: a long fade is two cities through each other): from a block H.full px a
     tile's houses are its models, and only once that tile's yards are laid (until then its painted boxes stand, never both) */
  function fade() { return TW >= H.full ? 1 : 0; }
  function flat() { return on() && TW >= H.full; }
  function seen(x, y) { try { return typeof fogSeen !== 'function' || !!fogSeen(x, y); } catch (e) { return true; } }
  function pick(kind, along, roll, idx) {
    if (kind === 1) return H.trailer + '_' + (along ? (roll < 0.5 ? 0 : 180) : (roll < 0.5 ? 90 : 270));
    var m = H.houses[Math.floor(roll * 997) % H.houses.length];
    /* its front to the nearer edge of the block on its long side: the south half faces south (grid +y), the north half north */
    var big = idx < 16, i = big ? idx : idx - 16, lgx = i % 3, lgy = (i / 3) | 0, n = big ? 2 : 3;
    var t;
    if (along) t = lgy === n - 1 ? 0 : lgy === 0 && n > 1 ? 180 : (roll * 13 % 1 < 0.5 ? 0 : 180);
    else t = lgx === n - 1 ? 90 : lgx === 0 && n > 1 ? 270 : (roll * 13 % 1 < 0.5 ? 90 : 270);
    return m + '_' + t;
  }

  function draw(ox, oy) {
    FR = []; GRID = null; LAST.drew = 0; LAST.tiles = 0; LAST.lots = 0; LAST.culled = 0; LAST.unseen = 0;
    load();   /* once, after the painting is up: about 30 small pictures, never in the first load */
    if (!on()) { LAST.a = 0; return; }
    var a = fade(); LAST.a = a; if (a <= 0) return;
    var t0 = performance.now(), list = VBT.onGlass, NT = VBT.NT; if (!list || !NT || !MAN) return;
    var k = TW / (Math.SQRT2 * H.B), ppm = MAN.ppm || 16, seenT = [];
    for (var ti = 0; ti < list.length; ti++) {
      var T = list[ti]; if (!T || !T.lots || !T.flat || seenT.indexOf(T) >= 0) continue; seenT.push(T); LAST.tiles++;
      var L = T.lots, bx0 = T.tx * VB_TILE, by0 = T.ty * VB_TILE;
      for (var j = 0; j + 9 < L.length; j += 10) {
        var gx = L[j + 1], gy = L[j + 2];
        if (gx < bx0 || gy < by0 || gx >= bx0 + VB_TILE || gy >= by0 + VB_TILE) continue;   /* a margin block is its neighbour tile's */
        LAST.lots++;
        if (!seen(gx, gy)) { LAST.unseen++; continue; }
        var key = pick(L[j], L[j + 7], L[j + 8], L[j + 9]), m = MAN.sprites[key], im = IMG[key]; if (!m || !im) continue;
        var w = L[j + 5], d = L[j + 6], X = gx + L[j + 3] + w / 2, Y = gy + L[j + 4] + d / 2;
        var fit = Math.max(0.8, Math.min(1.0, Math.min(w * H.B / m.foot_m[0], d * H.B / m.foot_m[1])));   /* to its lot, never shrunk under 0.8 (a small lot's house still stands over his men) */
        if (L[j] === 1) fit = Math.max(0.8, Math.min(1.1, Math.max(w, d) * H.B / Math.max(m.foot_m[0], m.foot_m[1])));
        var s = k * fit / ppm, p = iso(X, Y, ox, oy), rx = p.sx - m.origin_px[0] * s, ry = p.sy - m.origin_px[1] * s, rw = m.w * s, rh = m.h * s;
        if (rx > CVW || ry > CVH || rx + rw < 0 || ry + rh < 0) { LAST.culled++; continue; }
        FR.push({ k: key, im: im, al: AL[key], iw: m.w, ih: m.h, rx: rx, ry: ry, rw: rw, rh: rh, s: s, d: X + Y, gx: gx, gy: gy, X: X, Y: Y, kind: L[j], T: T });
      }
    }
    FR.sort(function (q, r) { return q.d - r.d; });
    var ga = g.globalAlpha, sm = g.imageSmoothingEnabled;
    g.globalAlpha = a; g.imageSmoothingEnabled = true;
    for (var f = 0; f < FR.length; f++) { var q = FR[f]; g.drawImage(q.im, q.rx, q.ry, q.rw, q.rh); }
    g.globalAlpha = ga; g.imageSmoothingEnabled = sm;
    LAST.drew = FR.length; LAST.ms = Math.round((performance.now() - t0) * 100) / 100;
    /* a grid of the glass, so a walker's pixel asks only the models over it */
    GRID = {}; for (var f2 = 0; f2 < FR.length; f2++) { var e = FR[f2];
      for (var gy2 = Math.floor(e.ry / GC); gy2 <= Math.floor((e.ry + e.rh) / GC); gy2++) for (var gx2 = Math.floor(e.rx / GC); gx2 <= Math.floor((e.rx + e.rw) / GC); gx2++) {
        var c = gx2 + ',' + gy2; (GRID[c] || (GRID[c] = [])).push(e); } }
  }
  /* is the glass at (X, Y) (CSS px) a model nearer the camera than the walker R ({d: his depth})? */
  function covers(X, Y, R) {
    if (!GRID || !R) return false;
    var c = GRID[Math.floor(X / GC) + ',' + Math.floor(Y / GC)]; if (!c) return false;
    for (var i = 0; i < c.length; i++) { var e = c[i];
      if (e.d <= R.d + H.eps) continue;
      if (X < e.rx || Y < e.ry || X >= e.rx + e.rw || Y >= e.ry + e.rh) continue;
      var u = Math.floor((X - e.rx) / e.s), v = Math.floor((Y - e.ry) / e.s);
      if (u < 0 || v < 0 || u >= e.iw || v >= e.ih) continue;
      if (e.al && e.al[v * e.iw + u] > 110) { LAST.covered++; return true; } }
    return false;
  }
  /* THE WALK READS up close: how many of the walk's beats a block takes, so the crew crosses the glass at about H.walkPx a
     second (a block along a street is half a diamond, 0.56 of TW on the glass); one below H.walkFrom, as everywhere */
  function watchBeats() {
    /* ZOOMING NEVER SLOWS TIME (rule 384, Paolo 11/4: 'when I zoom in why does time slow down... that makes people not want to use it';
       'I'm tired of when I'm zoomed in on my characters and it wants to slow down time'): a block takes one beat at every zoom, the pace
       his speed sets; up close the crew simply covers more of the glass. THE WALK READS below is kept only behind H.walkReads (off) */
    if (!H.walkReads) return 1;
    try { if (!on() || TW <= H.walkFrom) return 1;
      /* a waited step is a whole beat (the walk steps once a beat while a block is being crossed, at any speed) */
      return Math.max(1, Math.round(0.559 * TW / H.walkPx / (BEAT / 1000))); } catch (e) { return 1; }
  }
  /* and his glide across that block takes all of those beats, so he walks, never dashes then stands (the glide counts a step as
     a beat over the speed: times the speed it is the whole wait) */
  function glideK() { try { return watchBeats() > 1 && typeof TRAVEL_SPEED === 'number' && TRAVEL_SPEED > 1 ? TRAVEL_SPEED : 1; } catch (e) { return 1; } }
  function streetTW() { return H.streetTW; }   /* the street stop, a block this many CSS px wide (the pinch's own clamp, setZoomAt) */
  root.BohemiaMapHouses = { draw: draw, covers: covers, flat: flat, fade: fade, on: on, watchBeats: watchBeats, glideK: glideK, streetTW: streetTW,
    frame: function () { return FR; }, last: LAST, H: H, ready: function () { return READY; }, load: load };
})(typeof window !== 'undefined' ? window : this);
