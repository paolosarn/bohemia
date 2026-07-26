// BOHEMIA MOUNTAIN (7/26/26, WORLD lane) — THE VALLEY WALL, BUILT FOR REAL.
//
// 927 cells, the most numerous single thing in the valley after suburb, and every one of
// them rendered as a flat brown square. The mountains are not scenery: they are the
// reason Las Vegas is a bowl. They are the edge of the playable world, and the only way
// through them is where water cut a way through first.
//
// REAL REFERENCE (the ranges that actually ring the valley — Spring Mountains west,
// Frenchman and Sunrise east, McCullough south, Las Vegas Range north):
//   grey Paleozoic LIMESTONE with sandstone at the west end: bare rock, no soil, no trees
//     at valley elevation (the pinyon-juniper belt is far higher up)
//   the profile is RIDGE and RAVINE: sharp crests with steep chutes cutting down between
//     them, not rolling hills
//   TALUS / SCREE aprons pile at the base where the cliffs shed rock
//   ALLUVIAL FANS spread out at the mouth of every ravine onto the valley floor
//   vegetation exists only in the drainages, where the runoff goes: dry desert shrub in
//     the ravine bottoms, nothing on the faces
//
// WHAT IT MEANS FOR PLAY. The rock is SOLID and the cliff bands are solid: a body cannot
// walk up the face. The RAVINE floors are passable. So the mountains wall the valley in
// and the ravines are the passes, which is exactly how the real geography works and it
// falls out of the terrain instead of being a rule bolted on top.
//
// CONTINUOUS: ridges and ravines are sampled from the valley-wide field
// (bohemia_terrain_noise.js) in global coordinates, so a crest that leaves one cell
// arrives in the next one in the right place.
//
// LEGEND:
//  0 bedrock face  1 ridge crest   2 cliff band    3 talus / scree  4 ravine floor
//  5 dry drainage  6 desert shrub  7 boulder       8 alluvial fan   9 rockfall scar
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);
  var N = (typeof module !== 'undefined') ? require('./bohemia_terrain_noise.js')
        : (typeof BohemiaTerrainNoise !== 'undefined' ? BohemiaTerrainNoise : root.BohemiaTerrainNoise);

  var FIELD = 0x5EED;

  function generate(seed, opts) {
    opts = opts || {};
    var cx = (opts.cellX || 0) * 128, cy = (opts.cellY || 0) * 128;
    // how much of this cell is still mountain vs spilling onto the valley floor: a cell
    // with valley neighbours carries the alluvial fan on that side.
    var open = opts.open || [];              // directions whose neighbour is NOT mountain
    var openSet = {};
    open.forEach(function (d) { openSet[String(d).toUpperCase()[0]] = 1; });

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    /* THE MASSIF TERM, and why it is shaped like this. The pure noise field sometimes
       runs low across a whole cell, which produced a "mountain" cell with no mountain
       in it (the gate caught exactly that). A range is not noise: it is a mass that
       rises away from the valley. So elevation gets a bias that is FULL in the interior
       of the range and FEATHERS TO ZERO at any edge facing the valley floor. Two
       neighbouring mountain cells share a CLOSED edge, so both compute full bias there
       and the seam still agrees to the tile; a cell facing the flat drops to the fan
       exactly where the flat begins. */
    var MASSIF = 0.17, DIP = 0.13, FEATHER = 46;
    function bias(px, py) {
      var f = 1;
      if (openSet.N) f = Math.min(f, py / FEATHER);
      if (openSet.S) f = Math.min(f, (127 - py) / FEATHER);
      if (openSet.W) f = Math.min(f, px / FEATHER);
      if (openSet.E) f = Math.min(f, (127 - px) / FEATHER);
      f = Math.max(0, Math.min(1, f));
      // full massif in the interior, and a real DIP toward any edge that faces the
      // valley, so the range grades down into its fan instead of ending in a cliff
      // against somebody's back wall.
      return MASSIF * f - DIP * (1 - f);
    }

    for (y = 0; y < 128; y++) {
      var gy = cy + y;
      for (x = 0; x < 128; x++) {
        var gx = cx + x;

        // RIDGED noise is the shape of a mountain: sharp crests, steep chutes between.
        var h = N.ridged(FIELD + 900, gx, gy, 150, 4);
        var detail = N.fbm(FIELD + 901, gx, gy, 18, 3);
        var elev = h * 0.82 + detail * 0.18 + bias(x, y);

        var code;
        if (elev > 0.78) code = 1;              // the crest itself, bare and bright
        else if (elev > 0.60) code = 0;         // bedrock face
        else if (elev > 0.50) code = 2;         // the cliff band where the slope breaks
        else if (elev > 0.36) code = 3;         // talus apron shed off the face
        else code = 4;                          // ravine floor between the ridges

        g[y][x] = code;
      }
    }

    // ---- the drainage line down each ravine, and the only green in the whole cell ----
    for (y = 0; y < 128; y++) {
      for (x = 0; x < 128; x++) {
        if (g[y][x] !== 4) continue;
        var gx2 = cx + x, gy2 = cy + y;
        var wet = N.fbm(FIELD + 902, gx2, gy2, 30, 3);
        var low = N.ridged(FIELD + 900, gx2, gy2, 150, 4);
        if (low < 0.24 && wet > 0.45) g[y][x] = 5;                 // the dry watercourse
        else if (wet > 0.72 && N.hash2(FIELD + 903, gx2, gy2) < 0.35) g[y][x] = 6;  // shrub
      }
    }

    // ---- boulders shed onto the talus, and the scars they came from ----
    for (i = 0; i < 26; i++) {
      var bx = Math.floor(r() * 124) + 2, by = Math.floor(r() * 124) + 2;
      if (g[by][bx] !== 3 && g[by][bx] !== 4) continue;
      var rad = 1 + Math.floor(r() * 2);
      for (y = -rad; y <= rad; y++) for (x = -rad; x <= rad; x++) {
        if (x * x + y * y > rad * rad) continue;
        var px = bx + x, py = by + y;
        if (px < 0 || py < 0 || px > 127 || py > 127) continue;
        g[py][px] = 7;
      }
    }
    for (i = 0; i < 3; i++) {
      var sx = Math.floor(r() * 110) + 9, sy = Math.floor(r() * 110) + 9;
      if (g[sy][sx] !== 0 && g[sy][sx] !== 2) continue;
      for (y = 0; y < 14; y++) {
        var w = 1 + Math.floor(y / 4);
        for (x = -w; x <= w; x++) {
          var qx = sx + x, qy = sy + y;
          if (qx < 0 || qy < 0 || qx > 127 || qy > 127) continue;
          if (g[qy][qx] === 0 || g[qy][qx] === 2 || g[qy][qx] === 3) g[qy][qx] = 9;
        }
      }
    }

    /* ---- THE ALLUVIAL FAN. Where this cell meets the valley floor, the mountain does
       not stop at a line: it spills. Every ravine mouth lays a fan of washed gravel out
       onto the flat, which is why the edge of town in a desert city always sits on a
       gentle apron rather than against a wall. */
    var FAN = 30;
    ['N', 'S', 'E', 'W'].forEach(function (d) {
      if (!openSet[d]) return;
      for (var t = 0; t < 128; t++) {
        var depth = FAN * (0.45 + N.fbm(FIELD + 904, cx + t, cy + t, 40, 2) * 0.9);
        for (var k = 0; k < depth; k++) {
          var px, py;
          if (d === 'N') { px = t; py = k; }
          else if (d === 'S') { px = t; py = 127 - k; }
          else if (d === 'W') { px = k; py = t; }
          else { px = 127 - k; py = t; }
          if (px < 0 || py < 0 || px > 127 || py > 127) continue;
          var cur = g[py][px];
          if (cur === 1 || cur === 2 || cur === 0) continue;     // the crest still wins
          g[py][px] = 8;
        }
      }
    });

    return { g: g, W: 128, H: 128, streets: [], gates: [], footprints: [] };
  }

  /* THE PASS TEST: a mountain cell must not be a solid wall of rock. Ravine floors,
     drainages and fans are the ways through, and the gate proves they exist. */
  function passableFraction(res) {
    var g = res.g, open = 0;
    for (var y = 0; y < 128; y++) for (var x = 0; x < 128; x++) {
      var c = g[y][x];
      if (c === 4 || c === 5 || c === 6 || c === 8 || c === 3) open++;
    }
    return open / (128 * 128);
  }

  var PALETTE = {
    1: '#a09781', 2: '#463f36', 3: '#6e6656', 4: '#7f7666', 5: '#8b8270', 6: '#49512f',
    7: '#57503f', 8: '#8f8570', 9: '#b5ab93'
  };

  var LEGEND = {
    0: { name: 'bedrock face',  kind: 'structure', act1: 'bare grey limestone face, no soil on it at all', solid: true },
    1: { name: 'ridge crest',   kind: 'structure', act1: 'the sunlit crest of the ridge, rock scoured clean', solid: true },
    2: { name: 'cliff band',    kind: 'structure', act1: 'a cliff band where the slope breaks, unclimbable', solid: true },
    3: { name: 'talus / scree', kind: 'ground',    act1: 'apron of loose broken rock shed off the face, slow going' },
    4: { name: 'ravine floor',  kind: 'ground',    act1: 'the floor of a ravine between two ridges, gravel and rock' },
    5: { name: 'dry drainage',  kind: 'ground',    act1: 'the dry watercourse down the ravine, sand and cobble' },
    6: { name: 'desert shrub',  kind: 'tree-dead', act1: 'dry shrub in the drainage, the only living thing on the mountain', solid: false },
    7: { name: 'boulder',       kind: 'prop',      act1: 'a boulder come down off the face, house-sized' },
    8: { name: 'alluvial fan',  kind: 'ground',    act1: 'washed gravel fanning out where the ravine meets the flat' },
    9: { name: 'rockfall scar', kind: 'ground',    act1: 'a fresh pale scar where the face let go' }
  };

  var NOTES = {
    summary: 'The valley wall: ridge and ravine limestone, cliff bands, talus aprons, and alluvial fans spilling onto the flat. Solid rock walls the world in; the ravines are the only way through.',
    reference: [
      'The ranges that ring Las Vegas (Spring Mountains west, Frenchman and Sunrise east, McCullough south) are grey Paleozoic limestone: bare rock, no soil, and no trees at valley elevation.',
      'The profile is RIDGE and RAVINE, sharp crests with steep chutes between them, not rolling hills. Talus aprons pile at the base where the cliffs shed rock.',
      'Vegetation exists only in the drainages where the runoff goes.',
      'Every ravine mouth lays an ALLUVIAL FAN onto the valley floor, which is why the edge of a desert city sits on a gentle apron and not against a wall.'
    ],
    layout: [
      'Ridged noise sampled in valley coordinates gives crest, face, cliff band, talus and ravine floor by elevation, so a crest leaving one cell arrives in the next one in the right place.',
      'Drainages run down the ravine floors, carrying the only shrub on the mountain.',
      'Boulders sit on the talus, with pale rockfall scars on the faces above them.',
      'Any edge whose neighbour is NOT mountain gets an alluvial fan spilling out of this cell onto the flat.'
    ],
    circulation: 'THIS IS THE EDGE OF THE WORLD AND IT IS MEANT TO STOP YOU. Bedrock, crest and cliff band are SOLID: no body walks up the face. Talus, ravine floors, drainages and fans are passable, so the mountains wall the valley in and the ravines are the passes. That is how the real geography works, and here it falls out of the terrain rather than being a rule bolted on top. No vehicle surface, no street, no gate.',
    layering: 'STRUCTURE (solid, blocks): bedrock face (0), ridge crest (1), cliff band (2). GROUND (walkable, rough): talus (3), ravine floor (4), dry drainage (5), alluvial fan (8), rockfall scar (9). PROPS: boulder (7, solid), desert shrub (6, passable). No overhead, no portals. One level, and most of it is in your way.',
    decisions: [
      'CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped\n       flagged provisional; the moment Paolo ruled the target screen CBB this palette was\n       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside\n       its layer value bands. Road paint and the lake ring were the only things out, and\n       they were wrong on their own terms too: act-1 paint is filthy, not clean white.\n       Locked by the CONSTITUTION CONFORMANCE section of this module\'s gate.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and\n       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world." 927 flat brown squares was the single biggest unbuilt thing in the valley.',
      'Solid rock plus passable ravines is a deliberate play property: the valley is a bowl with named ways through it, and nothing had to be hard-coded to make that true.',
      'A mountain cell is a SURFACE, not a district: never territory, never an address.',
      'No trees. At valley elevation these ranges carry none, and putting pines on them would be the exact kind of generic-desert wrongness this project keeps refusing.'
    ]
  };

  K.register('mountain', {
    generate: generate, body: function (c) { return c === 0 || c === 1 || c === 2; },
    category: K.category('mountain') || 'terrain',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, passableFraction: passableFraction,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaMountain = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
