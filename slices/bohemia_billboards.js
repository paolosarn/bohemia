/* ==========================================================================
   __THE_BILLBOARDS__ (WORLD 14, 11/18; the coordinator's round under rule 453: the next jobs on WORLD 14's list, the checklist's
   item 13 'billboards (a prop the feed can use)', records/BOHEMIA_PAOLO_POCKET_CITY_2_BUILDINGS_AGAINST_OURS_11_5_26.md;
   rule 454(a): no line a human speaks, the fewest words: this file adds none; rule 441)

   REAL: the valley's freeways are lined with billboards, the I-15 and the 95 the most (the injury lawyers' boards, the casinos' and
   the shows'): steel poles, a catwalk under the face for the men who paste the paper. In the collapse nobody pastes; the paper peels
   off in strips, the lights are dead, and the catwalk is the highest place for a block.
   BATTLE BROTHERS FIRST: on its world map the high ground widens the company's sight and the low and the trees narrow it. Our valley
   is flat; its high ground beside the road is a billboard. So: STANDING BY ONE (his crew within a block of its foot) HE SEES FARTHER,
   3 blocks more by day, 1 by night (nobody sees far in the dark, and the boards are dark), never where a boss has made it dark.
   The fog keeps what he saw, so a drive down the 15 past the boards clears more of the valley than the same drive anywhere else.

   WHERE: beside the freeway, on the land block next to a freeway block (never a road, water or a mountain, never a town's or a real
   place's block), one in about nine freeway blocks, at least five blocks apart, the same on every load of a valley (the valley's seed).
   THE LOOK (a STAND-IN for COOK's piece, rule 408): two steel poles, the catwalk, the face, peeled pale paper with a dark strip where
   an old face shows through, no word on it. Drawn in the buildings' pass (vbCityDraw), so the people walk over it and the fog
   covers it where he has not been.
     BohemiaBillboards.list()      the boards of this valley [{x, y, fx, fy}] (fx, fy the freeway block it faces)
     BohemiaBillboards.near(x, y)  the board within a block of x, y, or null
     BohemiaBillboards.status()    what it drew last, the sight it gave
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof root.vbCityDraw !== 'function' || typeof root.fogRadius !== 'function') return;
  var B = root.BohemiaBillboards = { on: true, drawn: 0, err: null, seed: null, boards: [], lastSight: 0, DAY_PLUS: 3, NIGHT_PLUS: 1, EVERY: 9, APART: 5 };
  var LAND = { suburb: 1, commercial: 1, desert: 1, industrial: 1, warehouse: 1, storage: 1, apartment: 1, trailer: 1, solar: 1, farm: 1, wash: 1, rail: 1, estate: 1, gated: 1, resort: 1 };
  function h32(x, y, s) { var n = (x * 374761393 + y * 668265263 + (s | 0) * 2246822519) | 0; n = (n ^ (n >>> 13)) * 1274126177 | 0; return (n ^ (n >>> 16)) >>> 0; }
  function taken() {
    var t = {};
    try { var bs = root.ctBases ? root.ctBases() : null; for (var n in (bs || {})) { var b = bs[n]; if (b) for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) t[((b.x | 0) + dx) + ',' + ((b.y | 0) + dy)] = 1; } } catch (e) {}
    try { var RP = root.BOH_REAL_PLACES; (RP && RP.cellsNow ? RP.cellsNow() : []).forEach(function (c) { t[c.x + ',' + c.y] = 1; }); } catch (e) {}
    return t;
  }
  function build() {
    /* the map's valley is a top-level binding of the page (let), never a window property */
    var M = (typeof om !== 'undefined' ? om : null);
    if (!M || !M.n || !M.at) return [];
    var seed = M.seed != null ? M.seed : 0;
    if (B.seed === seed && B.boards.length) return B.boards;
    var T = taken(), out = [], N = M.n, D = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var c = M.at(x, y); if (!c || c.district !== 'freeway' || c.xing) continue;
      if (h32(x, y, seed) % B.EVERY) continue;
      var k = h32(y, x, seed) & 3, put = null;
      for (var i = 0; i < 4 && !put; i++) { var d = D[(k + i) & 3], bx = x + d[0], by = y + d[1], b = M.at(bx, by);
        if (b && LAND[b.district] && !T[bx + ',' + by]) put = { x: bx, y: by, fx: x, fy: y }; }
      if (!put) continue;
      if (out.some(function (q) { return Math.max(Math.abs(q.x - put.x), Math.abs(q.y - put.y)) < B.APART; })) continue;
      out.push(put);
    }
    B.seed = seed; B.boards = out; return out;
  }
  B.list = function () { return build().slice(); };
  B.near = function (x, y) { var L = build(); for (var i = 0; i < L.length; i++) if (Math.max(Math.abs(L[i].x - x), Math.abs(L[i].y - y)) <= 1) return L[i]; return null; };

  /* ---- THE SIGHT: by a board he sees farther (the map's own fogRadius, wrapped; the fog keeps what he saw) ---- */
  var _fr = root.fogRadius;
  root.fogRadius = function () {
    var r = _fr.apply(this, arguments);
    if (!B.on) return r;
    try {
      if (typeof city === 'undefined') return r;
      var dk = (root.BohemiaBosses && root.BohemiaBosses.dark) ? root.BohemiaBosses.dark(city.x, city.y) : 0;
      if (dk > 0) return r;
      if (!B.near(city.x | 0, city.y | 0)) return r;
      var night = false; try { night = !!root.isNight(); } catch (e) {}
      r = r + (night ? B.NIGHT_PLUS : B.DAY_PLUS); B.lastSight = r;
    } catch (e) { B.err = String(e && e.message || e); }
    return r;
  };

  /* ---- THE LOOK (a stand-in): drawn after the buildings, so the people walk over it ---- */
  function board(g, sx, sy, s, night, v) {
    var w = s * 0.92, ph = s * 0.40, pole = Math.max(1, s * 0.06), top = sy - s * 1.15, cat = top + ph;
    g.fillStyle = night ? '#16140f' : '#24211c';                                   /* the poles */
    g.fillRect(sx - w * 0.30 - pole / 2, cat, pole, sy - cat); g.fillRect(sx + w * 0.30 - pole / 2, cat, pole, sy - cat);
    g.fillStyle = night ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.22)';                 /* its shadow on the ground */
    g.fillRect(sx - w * 0.45, sy - Math.max(1, s * 0.05), w * 0.9, Math.max(1, s * 0.08));
    g.fillStyle = night ? '#1d1a15' : '#332e27';                                   /* the frame */
    g.fillRect(sx - w / 2 - pole, top - pole, w + pole * 2, ph + pole * 2);
    g.fillStyle = night ? '#4a463d' : '#a69c86';                                   /* the face: the paper gone pale */
    g.fillRect(sx - w / 2, top, w, ph);
    g.fillStyle = night ? '#2c2923' : '#6b6354';                                   /* where the paper peeled, the old face under it */
    var px = sx - w / 2 + w * (0.15 + (v % 5) * 0.12), pw = w * (0.18 + (v % 3) * 0.08);
    g.fillRect(px, top, pw, ph * (0.55 + (v % 4) * 0.1));
    if (v % 7 === 3) { g.fillStyle = night ? '#38140f' : '#5a2219'; g.fillRect(sx - w / 2 + w * 0.08, top + ph * 0.25, w * 0.22, ph * 0.5); }   /* a red that was a casino's */
    g.fillStyle = night ? '#120f0b' : '#1c1915';                                   /* the catwalk */
    g.fillRect(sx - w / 2 - pole, cat + pole, w + pole * 2, Math.max(1, s * 0.05));
  }
  var _vb = root.vbCityDraw;
  root.vbCityDraw = function (ox, oy, night) {
    var r0 = _vb.apply(this, arguments);
    if (!B.on) { B.drawn = 0; return r0; }
    try {
      var g = root.g; if (!g || typeof TW === 'undefined' || typeof MODE === 'undefined' || MODE !== 'city' || TW < 8) { B.drawn = 0; return r0; }
      var L = build(), n = 0, s = TW;
      g.save();
      for (var i = 0; i < L.length; i++) {
        var p = L[i], a = root.iso(p.x, p.y, ox, oy), sx = a.sx, sy = a.sy + TH * 0.62;
        if (sx < -s * 2 || sy < -s * 2 || sx > (typeof CVW !== 'undefined' ? CVW : 4000) + s * 2 || sy > (typeof CVH !== 'undefined' ? CVH : 4000) + s * 3) continue;
        board(g, sx, sy, s, !!night, h32(p.x, p.y, 7));
        n++;
      }
      g.restore();
      B.drawn = n;
    } catch (e) { B.err = String(e && e.message || e); }
    return r0;
  };
  B.status = function () { return { boards: build().length, drawn: B.drawn, sight: B.lastSight, err: B.err }; };
})(window);
