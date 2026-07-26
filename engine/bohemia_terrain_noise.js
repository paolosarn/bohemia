// BOHEMIA TERRAIN NOISE (7/26/26, WORLD lane) — the shared, deterministic field the
// terrain generators read.
//
// WHY IT EXISTS. A district cell is a self-contained lot: it can be generated from its
// own seed and nothing outside it needs to line up. TERRAIN is the opposite. A ridge
// that stops dead at a cell boundary, a wash that does not continue into the next cell,
// a shoreline with a seam in it — that is what tells you the world is fake. So terrain
// is not generated from the cell seed at all: it is SAMPLED out of one continuous field
// defined over the whole valley in GLOBAL tile coordinates. Two neighbouring cells
// sample the same field either side of their shared edge, so features cross the seam
// for free and always agree.
//
// Integer-hash value noise: no RNG call anywhere, no state, no allocation. Same (seed, x, y)
// gives the same number forever, in node and in the browser, which is what every gate
// in this repo demands of anything that touches the world.
(function (root) {
  'use strict';

  function hash2(seed, x, y) {
    var h = (seed ^ Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263)) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function smooth(t) { return t * t * (3 - 2 * t); }

  // value noise at a chosen feature size (in tiles)
  function value(seed, x, y, scale) {
    var fx = x / scale, fy = y / scale;
    var x0 = Math.floor(fx), y0 = Math.floor(fy);
    var tx = smooth(fx - x0), ty = smooth(fy - y0);
    var a = hash2(seed, x0, y0), b = hash2(seed, x0 + 1, y0);
    var c = hash2(seed, x0, y0 + 1), d = hash2(seed, x0 + 1, y0 + 1);
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  }

  // fractal sum: broad shape plus finer detail, the standard terrain stack
  function fbm(seed, x, y, scale, octaves) {
    octaves = octaves || 4;
    var sum = 0, amp = 1, norm = 0, s = scale;
    for (var i = 0; i < octaves; i++) {
      sum += value(seed + i * 7919, x, y, s) * amp;
      norm += amp;
      amp *= 0.5; s *= 0.5;
    }
    return sum / norm;
  }

  // RIDGED noise: what makes a mountain read as a mountain instead of a lumpy blanket.
  // Folding the field around its midpoint turns smooth humps into sharp crests.
  function ridged(seed, x, y, scale, octaves) {
    octaves = octaves || 4;
    var sum = 0, amp = 1, norm = 0, s = scale;
    for (var i = 0; i < octaves; i++) {
      var v = 1 - Math.abs(value(seed + i * 6151, x, y, s) * 2 - 1);
      sum += v * v * amp;
      norm += amp;
      amp *= 0.5; s *= 0.5;
    }
    return sum / norm;
  }

  /* A WINDING LINE through the field: distance from a channel whose centreline drifts
     with the noise. This is how a wash braid or a ravine crosses a cell boundary and
     still lines up: both cells evaluate the same drift from the same global coordinate. */
  function channelDist(seed, x, y, axis, at, wander, scale) {
    var along = axis === 'v' ? y : x, across = axis === 'v' ? x : y;
    var drift = (fbm(seed, along, along * 0.37, scale || 220, 3) - 0.5) * 2 * (wander || 40);
    return Math.abs(across - (at + drift));
  }

  var API = { hash2: hash2, value: value, fbm: fbm, ridged: ridged, channelDist: channelDist };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaTerrainNoise = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
