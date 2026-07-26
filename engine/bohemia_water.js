// BOHEMIA WATER (7/26/26, WORLD lane) — THE RESERVOIR, BUILT FOR REAL.
//
// 74 cells of the valley are water: Lake Mead and the reservoirs behind the dam. They
// rendered as a flat blue square, which is the least true thing the map could have said,
// because the ONE fact everybody knows about this lake is that it is going away.
//
// REAL REFERENCE (Lake Mead, and what a drawdown actually looks like from above):
//   THE BATHTUB RING. Two decades of decline left a bright white mineral band on the
//     rock, 100+ feet tall, marking where the water used to be. It is the most
//     photographed thing in the American southwest that nobody wants to photograph.
//   EXPOSED LAKEBED below it: cracked silt, stranded quagga-mussel shell beds, and the
//     things the water gave back (sunken boats, a WWII-era plane, bodies in barrels)
//   MARINAS AND RAMPS LEFT HIGH AND DRY: concrete launch ramps ending in mid-air a
//     quarter mile from the shore, extended again and again and finally abandoned
//   the surviving water is a narrow dead-flat sheet in the deepest channel
//
// In Bohemia the collapse came for the money first, so nobody extended the ramp again.
// This tile set is the drawdown, frozen.
//
// CONTINUOUS: the shoreline is sampled from the valley-wide field
// (bohemia_terrain_noise.js) in global coordinates, so the lake edge crosses cell
// boundaries as one curve instead of a staircase of separate ideas.
//
// LEGEND:
//  0 open water    1 shallow water  2 bathtub ring  3 exposed lakebed  4 cracked silt
//  5 shell bed     6 shore rock     7 launch ramp   8 sunken boat      9 dead brush
// 10 mooring debris
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);
  var N = (typeof module !== 'undefined') ? require('./bohemia_terrain_noise.js')
        : (typeof BohemiaTerrainNoise !== 'undefined' ? BohemiaTerrainNoise : root.BohemiaTerrainNoise);

  var FIELD = 0x5EED;

  function generate(seed, opts) {
    opts = opts || {};
    var cx = (opts.cellX || 0) * 128, cy = (opts.cellY || 0) * 128;
    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    for (y = 0; y < 128; y++) {
      var gy = cy + y;
      for (x = 0; x < 128; x++) {
        var gx = cx + x;
        // ONE continuous depth field over the whole reservoir. Everything else is a
        // band cut out of it, which is exactly how a drawdown reads on the ground.
        var depth = N.fbm(FIELD + 600, gx, gy, 190, 4);
        var edge = N.fbm(FIELD + 601, gx, gy, 34, 3) * 0.10;
        var d = depth + edge;

        var code;
        if (d > 0.62) code = 0;             // what is left of the lake
        else if (d > 0.565) code = 1;       // the shallows, silty and warm
        else if (d > 0.545) code = 5;       // the shell beds the water left behind
        else if (d > 0.50) code = 4;        // cracked silt just above the waterline
        else if (d > 0.44) code = 3;        // exposed lakebed
        else if (d > 0.40) code = 2;        // THE BATHTUB RING
        else code = 6;                      // shore rock above the old high-water mark
        g[y][x] = code;
      }
    }

    // ---- dead brush colonising the exposed bed, and rock scatter on the shore ----
    for (i = 0; i < 90; i++) {
      var bx = Math.floor(r() * 126) + 1, by = Math.floor(r() * 126) + 1;
      var c = g[by][bx];
      if (c === 3 || c === 4) { if (r() < 0.5) g[by][bx] = 9; }
      else if (c === 6 && r() < 0.35) g[by][bx] = 6;
    }

    /* ---- A LAUNCH RAMP LEFT IN MID-AIR. Where this cell holds a stretch of the old
       shoreline, there is a concrete ramp running down from the rock, across the
       bathtub ring, over the exposed bed, and stopping. The water it was built for is
       somewhere off in the middle distance. Nobody extended it again. */
    // only a cell that actually holds a stretch of the old shoreline can have a ramp,
    // and the ramp has to be built on a column that really crosses the ring
    var ringCols = [];
    for (x = 6; x < 122; x++) {
      var hasRing = false, hasBed = false;
      for (y = 0; y < 128; y++) {
        if (g[y][x] === 2) hasRing = true;
        if (g[y][x] === 3 || g[y][x] === 4) hasBed = true;
      }
      if (hasRing && hasBed) ringCols.push(x);
    }
    var wantRamp = ringCols.length > 8 && N.hash2(FIELD + 602, cx, cy) < 0.75;
    if (wantRamp) {
      var rx = ringCols[Math.floor(N.hash2(FIELD + 603, cx, cy) * ringCols.length)];
      var started = false, len = 0;
      // run down the column from whichever end is dry land
      var topDry = (g[0][rx] === 2 || g[0][rx] === 6 || g[0][rx] === 3 || g[0][rx] === 4);
      for (var k = 0; k < 128; k++) {
        y = topDry ? k : (127 - k);
        var here = g[y][rx];
        if (!started && (here === 2 || here === 6)) started = true;   // starts up on the ring
        if (!started) continue;
        if (here === 0 || here === 1) break;                          // never reaches water
        for (x = -4; x <= 4; x++) {
          var px = rx + x;
          if (px < 0 || px > 127) continue;
          g[y][px] = 7;
        }
        if (++len > 70) break;
      }
      // the mooring hardware and dock debris left at the top of it
      for (i = 0; i < 10; i++) {
        var mx = rx - 8 + Math.floor(r() * 17), my = 6 + Math.floor(r() * 26);
        if (mx < 0 || mx > 127 || my > 127) continue;
        if (g[my][mx] === 7) continue;
        g[my][mx] = 10;
      }
    }

    // ---- what the water gave back ----
    if (N.hash2(FIELD + 604, cx + 5, cy + 5) < 0.4) {
      var sx = 20 + Math.floor(r() * 80), sy = 20 + Math.floor(r() * 80);
      for (y = 0; y < 5; y++) for (x = 0; x < 13; x++) {
        var qx = sx + x, qy = sy + y;
        if (qx > 127 || qy > 127) continue;
        var cc = g[qy][qx];
        if (cc === 3 || cc === 4 || cc === 5 || cc === 1) g[qy][qx] = 8;
      }
    }

    return { g: g, W: 128, H: 128, streets: [], gates: [], footprints: [] };
  }

  var PALETTE = {
    1: '#3c6a76', 2: '#b8b09c', 3: '#8a8069', 4: '#948a72', 5: '#a49a80', 6: '#6b6153',
    7: '#a8a396', 8: '#5c564a', 9: '#4a5230', 10: '#6a6458'
  };

  var LEGEND = {
    0:  { name: 'open water',     kind: 'water-dead', act1: 'what is left of the reservoir, flat and dead still' },
    1:  { name: 'shallow water',  kind: 'water-dead', act1: 'silty shallows over the drowned bed' },
    2:  { name: 'bathtub ring',   kind: 'ground',     act1: 'the white mineral band on the rock marking where the water used to be' },
    3:  { name: 'exposed lakebed',kind: 'ground',     act1: 'lakebed the water gave up, grey silt gone hard' },
    4:  { name: 'cracked silt',   kind: 'ground',     act1: 'silt dried into plates and curled at the edges' },
    5:  { name: 'shell bed',      kind: 'ground',     act1: 'a crust of stranded mussel shell, crunching underfoot' },
    6:  { name: 'shore rock',     kind: 'ground',     act1: 'broken rock above the old high-water mark' },
    7:  { name: 'launch ramp',    kind: 'ground',     act1: 'a concrete launch ramp running down and stopping in mid-air, a quarter mile short of the water' },
    8:  { name: 'sunken boat',    kind: 'vehicle',    act1: 'a boat the lake gave back, hull open to the sky' },
    9:  { name: 'dead brush',     kind: 'tree-dead',  act1: 'brush that colonised the new ground and then died too', solid: false },
    10: { name: 'mooring debris', kind: 'prop',       act1: 'cleats, cable and dock section left where the marina was' }
  };

  var NOTES = {
    summary: 'The reservoir in drawdown: a shrunken sheet of dead water, the white bathtub ring above it, miles of exposed lakebed, and a launch ramp that stops in mid-air.',
    reference: [
      'Lake Mead: two decades of decline left a bright mineral BATHTUB RING over 100 feet tall on the rock, marking where the water used to be.',
      'Below it, exposed lakebed: cracked silt, stranded quagga-mussel shell beds, and the things the water gave back (sunken boats, a WWII plane, bodies in barrels).',
      'Marinas and concrete launch ramps were extended again and again and finally abandoned, ending in mid-air a long way from the shore.',
      'The surviving water sits in the deepest channel, flat and still.'
    ],
    layout: [
      'One continuous depth field over the whole reservoir, sampled in valley coordinates, gives every band: open water, shallows, shell bed, cracked silt, exposed bed, bathtub ring, shore rock. The shoreline crosses cell boundaries as one curve.',
      'Dead brush colonises the newly exposed ground; rock scatters on the shore.',
      'Most cells that hold a stretch of old shoreline carry a launch ramp running down from the ring, across the exposed bed, and stopping short of the water, with mooring debris at the top of it.',
      'Some cells carry what the water gave back.'
    ],
    circulation: 'Everything below the ring is walkable ground now, which is the whole horror of it: you can stroll a quarter mile out onto what used to be a lake. Open water and shallows are the only tiles that are not simply crossed on foot. No street, no gate, no vehicle network.',
    layering: 'GROUND (flat, walkable): bathtub ring (2), exposed lakebed (3), cracked silt (4), shell bed (5), shore rock (6), launch ramp (7). WATER (dead, not walked): open water (0), shallows (1). PROPS: sunken boat (8, solid), mooring debris (10, solid), dead brush (9, passable). No structures, no portals, one level.',
    decisions: [
      'CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped\n       flagged provisional; the moment Paolo ruled the target screen CBB this palette was\n       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside\n       its layer value bands. Road paint and the lake ring were the only things out, and\n       they were wrong on their own terms too: act-1 paint is filthy, not clean white.\n       Locked by the CONSTITUTION CONFORMANCE section of this module\'s gate.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and\n       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world."',
      'The drawdown IS the content. A full blue lake would be the one thing about this landscape that is not true, and the ring says more about the world than any prop could.',
      'A water cell is a SURFACE, not a district.',
      'Whether anyone lives down on the exposed bed is LIFE/faction canon and stays Paolo\'s call; the terrain gives them the ground and nothing more.'
    ]
  };

  K.register('water', {
    generate: generate, body: function (c) { return c === 8; },
    category: K.category('water') || 'terrain',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaWater = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
