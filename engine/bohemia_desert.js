// BOHEMIA DESERT (7/26/26, WORLD lane) — THE VACANT MOJAVE LOT, BUILT FOR REAL.
//
// 620 valley cells are desert: the undeveloped land between subdivisions, the edge of
// town, the pockets the grid never swallowed. They rendered as a flat tan square.
//
// REAL REFERENCE (the actual Las Vegas valley floor, not generic movie desert):
//   the plant community is CREOSOTE-BURSAGE, and creosote SELF-SPACES — its roots poison
//     competitors, so the bushes stand in an eerily regular scatter with bare ground
//     between them. That spacing is the signature of this desert from above.
//   DESERT PAVEMENT: a lag of small rock left behind after the fines blow out, with
//     CALICHE (white cemented hardpan) breaking through in patches
//   braided dry rills feeding the wash system, running downhill toward the valley floor
//   OHV tracks: vacant land in the valley is crossed by informal dirt-bike and truck
//     tracks that never get erased
//   ILLEGAL DUMPING is the other constant: mattresses, tyres, a burned car, contractor
//     debris tipped off the shoulder
//   and the one that belongs to THIS game: THE SUBDIVISION THAT NEVER GOT BUILT. Vegas
//     is ringed with graded pads, curb-and-gutter stubs and street lights standing over
//     lots where nothing was ever framed, because the money stopped. In Bohemia the
//     money stopped for good. Some desert cells carry that ghost plat.
//
// CONTINUOUS: every feature is sampled from the global terrain field
// (bohemia_terrain_noise.js) in valley coordinates, so rills, scrub density and pavement
// patches cross cell boundaries without a seam.
//
// LEGEND:
//  0 desert pavement  1 rock lag       2 creosote bush   3 bursage / low scrub
//  4 caliche hardpan  5 dry rill       6 OHV track       7 dumped debris
//  8 burned car       9 graded pad    10 curb stub      11 rock outcrop
// 12 dead tree/yucca 13 survey stake
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);
  var N = (typeof module !== 'undefined') ? require('./bohemia_terrain_noise.js')
        : (typeof BohemiaTerrainNoise !== 'undefined' ? BohemiaTerrainNoise : root.BohemiaTerrainNoise);

  var FIELD = 0x5EED;   // the valley's one terrain field seed

  function generate(seed, opts) {
    opts = opts || {};
    var cx = (opts.cellX || 0) * 128, cy = (opts.cellY || 0) * 128;
    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    for (y = 0; y < 128; y++) {
      var gy = cy + y;
      for (x = 0; x < 128; x++) {
        var gx = cx + x;

        // ---- the ground itself: pavement, rock lag, caliche ----
        var lag = N.fbm(FIELD, gx, gy, 26, 3);
        var cal = N.fbm(FIELD + 101, gx, gy, 70, 3);
        var code = 0;
        if (cal > 0.66) code = 4;               // caliche breaks through in broad patches
        else if (lag > 0.60) code = 1;          // rock lag where the fines blew out

        // ---- dry rills: braided channels crossing the whole valley ----
        var d1 = N.channelDist(FIELD + 7, gx, gy, 'v', cx + 40, 46, 260);
        var d2 = N.channelDist(FIELD + 23, gx, gy, 'v', cx + 96, 38, 190);
        if (d1 < 3 || d2 < 2) code = 5;
        else if (d1 < 6 || d2 < 4) { if (code === 0) code = 1; }   // gravel banks either side

        g[y][x] = code;
      }
    }

    // ---- CREOSOTE, self-spaced. Not scatter: a jittered lattice, which is what root
    //      competition actually produces and what makes this desert readable from above.
    var STEP = 9;
    for (y = -STEP; y < 128 + STEP; y += STEP) {
      for (x = -STEP; x < 128 + STEP; x += STEP) {
        var jx = x + Math.floor(N.hash2(FIELD + 3, cx + x, cy + y) * (STEP - 2));
        var jy = y + Math.floor(N.hash2(FIELD + 4, cx + x, cy + y) * (STEP - 2));
        if (jx < 0 || jy < 0 || jx > 127 || jy > 127) continue;
        // density follows the field: thicker in the swales, thin on the pavement
        var dens = N.fbm(FIELD + 55, cx + jx, cy + jy, 90, 3);
        var roll = N.hash2(FIELD + 5, cx + jx, cy + jy);
        if (roll > 0.25 + dens * 0.55) continue;
        var here = g[jy][jx];
        if (here === 5) continue;                       // nothing grows in the rill bed
        var big = roll < 0.45;
        g[jy][jx] = big ? 2 : 3;
        if (big) {                                      // a creosote is a bush, not a pixel
          if (jx + 1 < 128 && g[jy][jx + 1] !== 5) g[jy][jx + 1] = 2;
          if (jy + 1 < 128 && g[jy + 1][jx] !== 5) g[jy + 1][jx] = 2;
        }
      }
    }

    // ---- OHV tracks: two crossing lines of packed dirt, drawn from the global field so
    //      they run on into the next lot instead of stopping at the property line.
    (function tracks() {
      for (var yy = 0; yy < 128; yy++) {
        for (var xx = 0; xx < 128; xx++) {
          var gx2 = cx + xx, gy2 = cy + yy;
          var a = N.channelDist(FIELD + 71, gx2, gy2, 'h', cy + 30, 34, 300);
          var b = N.channelDist(FIELD + 89, gx2, gy2, 'v', cx + 74, 30, 240);
          if ((a < 1.2 || b < 1.2) && g[yy][xx] !== 5) g[yy][xx] = 6;
        }
      }
    })();

    // ---- rock outcrops where the field runs high ----
    for (i = 0; i < 5; i++) {
      var ox = Math.floor(r() * 118) + 5, oy = Math.floor(r() * 118) + 5;
      if (N.fbm(FIELD + 11, cx + ox, cy + oy, 60, 2) < 0.58) continue;
      var rad = 3 + Math.floor(r() * 4);
      for (y = -rad; y <= rad; y++) for (x = -rad; x <= rad; x++) {
        if (x * x + y * y > rad * rad) continue;
        var px = ox + x, py = oy + y;
        if (px < 0 || py < 0 || px > 127 || py > 127) continue;
        g[py][px] = 11;
      }
    }

    // ---- a dead yucca or two, and survey stakes nobody came back for ----
    for (i = 0; i < 3 + Math.floor(r() * 4); i++) {
      var yx = Math.floor(r() * 126) + 1, yy2 = Math.floor(r() * 126) + 1;
      if (g[yy2][yx] === 5) continue;
      g[yy2][yx] = 12;
    }

    // ---- ILLEGAL DUMPING: the shoulder of every vacant lot in the valley ----
    var dumpN = 2 + Math.floor(r() * 4);
    for (i = 0; i < dumpN; i++) {
      var dx = Math.floor(r() * 110) + 8, dy = Math.floor(r() * 110) + 8;
      var w = 2 + Math.floor(r() * 4), h = 2 + Math.floor(r() * 3);
      for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
        var qx = dx + x, qy = dy + y;
        if (qx > 127 || qy > 127) continue;
        g[qy][qx] = 7;
      }
    }
    if (r() < 0.35) {                                   // and something bigger, burned
      var bx = Math.floor(r() * 112) + 6, by = Math.floor(r() * 112) + 6;
      for (y = 0; y < 4; y++) for (x = 0; x < 7; x++) {
        var ex = bx + x, ey = by + y;
        if (ex > 127 || ey > 127) continue;
        g[ey][ex] = 8;
      }
    }

    /* ---- THE SUBDIVISION THAT NEVER GOT BUILT. Some vacant lots out here are not
       virgin desert at all: they are a plat that got graded, curbed, and abandoned when
       the money stopped. Pads, a curb stub, a stake at every corner, and nothing else,
       ever. In this world that is not a recession story, it is the whole story. */
    var ghost = N.fbm(FIELD + 313, cx + 64, cy + 64, 3.2, 2);
    if (ghost > 0.72) {
      var rows = 2, cols = 3, padW = 26, padH = 34, gapX = 10, gapY = 14;
      // the plat sits where the developer's grid put it, not always the same corner
      var x0 = 8 + Math.floor(N.hash2(FIELD + 411, cx, cy) * 14);
      var y0 = 10 + Math.floor(N.hash2(FIELD + 412, cx, cy) * 18);
      // the curb stub: a road ring that goes nowhere
      for (x = x0 - 6; x < x0 + cols * (padW + gapX); x++) {
        if (x < 0 || x > 127) continue;
        if (y0 - 6 >= 0) g[y0 - 6][x] = 10;
        var yb = y0 + rows * (padH + gapY) - gapY + 4;
        if (yb < 128) g[yb][x] = 10;
      }
      for (y = y0 - 6; y < y0 + rows * (padH + gapY); y++) {
        if (y < 0 || y > 127) continue;
        if (x0 - 6 >= 0) g[y][x0 - 6] = 10;
      }
      for (var rr = 0; rr < rows; rr++) for (var cc = 0; cc < cols; cc++) {
        var px0 = x0 + cc * (padW + gapX), py0 = y0 + rr * (padH + gapY);
        for (y = 0; y < padH; y++) for (x = 0; x < padW; x++) {
          var ax = px0 + x, ay = py0 + y;
          if (ax < 0 || ay < 0 || ax > 127 || ay > 127) continue;
          g[ay][ax] = 9;                                  // the graded pad, still bare
        }
        [[px0 - 1, py0 - 1], [px0 + padW, py0 - 1], [px0 - 1, py0 + padH], [px0 + padW, py0 + padH]]
          .forEach(function (p) {
            if (p[0] >= 0 && p[1] >= 0 && p[0] < 128 && p[1] < 128) g[p[1]][p[0]] = 13;
          });
      }
    }

    return { g: g, W: 128, H: 128, streets: [], gates: [], footprints: [], ghostPlat: ghost > 0.72 };
  }

  var PALETTE = {
    1: '#8f8062', 2: '#4a5230', 3: '#5c5a3a', 4: '#a89c7e', 5: '#7e7256', 6: '#7a6c4e',
    7: '#6a6258', 8: '#4a4038', 9: '#9a8d70', 10: '#a09684', 11: '#6f6551', 12: '#5a5334',
    13: '#b0a070'
  };

  var LEGEND = {
    0:  { name: 'desert pavement',  kind: 'ground',    act1: 'compacted Mojave dirt, the fines long blown out of it' },
    1:  { name: 'rock lag',         kind: 'ground',    act1: 'a lag of small dark rock left standing on the pavement' },
    2:  { name: 'creosote bush',    kind: 'tree-dead', act1: 'creosote, grey-green and half dead, standing in its own poisoned circle', solid: false },
    3:  { name: 'bursage / scrub',  kind: 'tree-dead', act1: 'low bursage and dry grass clumps between the creosote', solid: false },
    4:  { name: 'caliche hardpan',  kind: 'ground',    act1: 'white cemented caliche breaking through the surface' },
    5:  { name: 'dry rill',         kind: 'ground',    act1: 'a braided dry rill cut into the lot, sand and gravel in the bed' },
    6:  { name: 'OHV track',        kind: 'drive',     act1: 'packed dirt track worn by bikes and trucks, still legible' },
    7:  { name: 'dumped debris',    kind: 'prop',      act1: 'a tipped load of mattresses, tyres and contractor trash' },
    8:  { name: 'burned car',       kind: 'vehicle',   act1: 'a car dragged out here and burned, shell rusting into the dirt' },
    9:  { name: 'graded pad',       kind: 'ground',    act1: 'a house pad graded flat and never built on, edges softening' },
    10: { name: 'curb stub',        kind: 'ground',    act1: 'poured curb and gutter for a street that has no houses on it' },
    11: { name: 'rock outcrop',     kind: 'prop',      act1: 'a limestone outcrop pushing up through the pavement' },
    12: { name: 'dead yucca',       kind: 'tree-dead', act1: 'a dead yucca, trunk grey and split' },
    13: { name: 'survey stake',     kind: 'prop',      act1: 'a survey stake with faded ribbon, marking a lot corner nobody claimed', solid: false }
  };

  var NOTES = {
    summary: 'The vacant Mojave lot: self-spaced creosote on desert pavement, braided dry rills, OHV tracks, illegal dumping, and sometimes the ghost of a subdivision that was graded and never built.',
    reference: [
      'The valley floor plant community is CREOSOTE-BURSAGE, and creosote self-spaces (its roots poison competitors), so from above the bushes stand in an eerily regular scatter with bare ground between them. That spacing is the signature of this desert.',
      'Desert pavement: a lag of rock left after the fines blow out, with white CALICHE hardpan breaking through in patches.',
      'Vacant land in the valley is crossed by informal OHV tracks and used for illegal dumping (mattresses, tyres, burned cars, contractor debris). Both are constants, not decoration.',
      'THE GHOST PLAT: Las Vegas is ringed with graded pads, curb-and-gutter stubs and survey stakes on subdivisions that stopped when the money did. In Bohemia the money stopped for good.'
    ],
    layout: [
      'Ground is desert pavement with rock lag and caliche patches, all sampled from the valley-wide terrain field so it never seams at a cell edge.',
      'Braided dry rills cross the lot and continue into the neighbouring cells; nothing grows in the beds.',
      'Creosote stands on a jittered lattice (self-spacing), bursage fills between, density follows the field.',
      'Two OHV tracks cross the lot and run on out of it. Dumped debris and sometimes a burned car sit off them.',
      'Roughly a third of desert cells carry the GHOST PLAT: six graded pads, a curb stub ring, and a survey stake at every corner.'
    ],
    circulation: 'Open ground: crossable in every direction on foot, and the OHV tracks are a real drivable line through it. The rills are walkable beds, a little lower than the pavement. Nothing here gates access to anything, which is the point of vacant land.',
    layering: 'GROUND (flat, walk or drive): pavement (0), rock lag (1), caliche (4), rill bed (5), OHV track (6), graded pad (9), curb stub (10). PROPS: creosote and bursage and dead yucca (2, 3, 12, low and passable), survey stake (13, passable), rock outcrop (11, solid), dumped debris (7, solid), burned car (8, solid). No structures, no portals: this is land nobody built on.',
    decisions: [
      'PROVISIONAL SKIN, under the ART-FIRST RESET (Paolo 7/26, landed the same day as this module): the palette and materials here predate the target screen. This is STRUCTURE (what ground exists, what blocks, what you walk on), not approved art. When the ART lane\'s target screen is picked it becomes the visual constitution and these five surfaces get re-skinned to it. Nothing here is surfaced to Paolo for an art verdict in the meantime.',
      'ACT TRIPTYCH (same ruling): only the act-1 dead material is specified. The act-2 recovering and act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world." 620 cells of flat tan square is not world.',
      'Terrain is sampled from ONE valley-wide noise field in global coordinates, never from the cell seed, so ridges, rills and scrub density cross cell boundaries with no seam. That is the difference between terrain and wallpaper.',
      'A desert cell is a SURFACE, not a district: no faction, economy or address ever resolves to it.',
      'The ghost plat is the one deliberate piece of storytelling in the tile set, and it is the one that is most literally true of the real city.'
    ]
  };

  K.register('desert', {
    generate: generate, body: function (c) { return c === 11; },
    category: K.category('desert') || 'terrain',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaDesert = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
