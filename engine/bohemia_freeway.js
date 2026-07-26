// BOHEMIA FREEWAY (7/26/26, WORLD lane) — THE INTERSTATE CELL, BUILT FOR REAL.
//
// The other half of the road hole Paolo's 7/26 ruling pointed at ("we need to actually
// build a fucking world"). 952 valley cells are freeway and every one of them rendered
// as a flat grey slab. This builds them: the 15 and the beltway, eight lanes between
// concrete barrier and sound wall, an embankment, and the ARTERIAL OVERPASS where a
// mile-grid street crosses over the corridor.
//
// REAL REFERENCE (I-15 / CC-215 through the valley, and what a dead one looks like):
//   4 travel lanes each way at 12 ft, 10 ft outside shoulder, 4 ft inside shoulder
//   a concrete F-shape median barrier separating the directions (so NO yellow line
//     belongs anywhere on a freeway: nothing here separates opposing traffic by paint)
//   guardrail, then a graded embankment slope, then the SOUND WALL that fronts every
//     neighbourhood the corridor runs past
//   the surface street grid does not meet it at grade: arterials cross on an OVERPASS
//     carried on centre columns
//   act-1 DEAD: the lanes are where the traffic stopped. Cars sit in them, doors open,
//     burned out, drifted over. A dead freeway is a junkyard with lines painted on it.
//
// LAWS HELD: LINE COLOR (white divides same-direction lanes; the barrier does the
// direction-separating job so no yellow exists here). WALKABLE-LAND: `vehicular:true`,
// and still dressed. LAYERING: the overpass deck is a real OVERHEAD tile you pass
// UNDER, with solid columns. Act-1 DEAD throughout.
//
// LEGEND:
//  0 dirt frontage   1 travel lane   2 white lane line  3 shoulder   4 median barrier
//  5 guardrail       6 embankment    7 dead brush       8 sound wall 9 light pole
// 10 dead car       11 dead semi    12 overpass deck   13 bridge column 14 sign gantry
// 15 rubble/debris
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var C = 64;
  var BARRIER = 1;    // 0..1   concrete F-shape median barrier
  var INSHLD = 3;     // 2..3   inside shoulder
  var LANES = 23;     // 4..23  four 12 ft lanes each way
  var OUTSHLD = 28;   // 24..28 outside shoulder
  var RAIL = 30;      // 29..30 guardrail
  var EMBANK = 61;    // 31..61 graded embankment
  var ROW = 63;       // 62..63 sound wall, sitting on the cell boundary
  var LANE_LINES = [8, 13, 18];
  var EDGE = 23;

  function bandCode(b) {
    if (b <= BARRIER) return 4;
    if (b <= INSHLD) return 3;
    if (b <= LANES) return 1;
    if (b <= OUTSHLD) return 3;
    if (b <= RAIL) return 5;
    if (b <= EMBANK) return 6;
    if (b <= ROW) return 8;
    return 0;
  }

  /* links = the neighbours that are FREEWAY (the corridor's own continuation — an
     arterial neighbour is NOT a connection, a freeway has no at-grade crossings).
     cross = the neighbours that are surface street, which is what puts an OVERPASS
     across the corridor. */
  function generate(seed, opts) {
    opts = opts || {};
    var links = opts.same || opts.links || opts.streets || ['N', 'S'];
    var cross = opts.cross || [];
    var set = {}; links.forEach(function (d) { set[String(d).toUpperCase()[0]] = 1; });
    if (!set.N && !set.S && !set.E && !set.W) { set.N = set.S = 1; }
    var hasN = !!set.N, hasS = !!set.S, hasE = !!set.E, hasW = !!set.W;
    var vert = hasN || hasS, horiz = hasE || hasW;

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i, j;

    function coverV(oy) { return vert && (oy <= 0 ? (hasN || oy >= -RAIL) : (hasS || oy <= RAIL)); }
    function coverH(ox) { return horiz && (ox <= 0 ? (hasW || ox >= -RAIL) : (hasE || ox <= RAIL)); }

    // ---- 1. the corridor ------------------------------------------------------
    for (y = 0; y < 128; y++) {
      var oy = y - C;
      for (x = 0; x < 128; x++) {
        var ox = x - C, b = 1e9;
        if (coverV(oy)) b = Math.min(b, Math.abs(ox));
        if (coverH(ox)) b = Math.min(b, Math.abs(oy));
        if (b > ROW) continue;
        var code = bandCode(b);
        // a true freeway-to-freeway junction keeps pavement through the box; the
        // barrier never blocks the crossing roadway
        if (code === 4 && vert && horiz && Math.abs(ox) <= LANES && Math.abs(oy) <= LANES) code = 1;
        g[y][x] = code;
      }
    }

    // ---- 2. lane markings (white only — the barrier separates the directions) ---
    function stripe(axis, coverFn) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        if (!coverFn(oa)) continue;
        if (vert && horiz && Math.abs(oa) <= LANES) continue;      // no paint through a junction
        var dash = (Math.floor((t % 14) / 7) === 0);
        LANE_LINES.forEach(function (o) {
          if (!dash) return;
          [-o, o].forEach(function (s) {
            var px = axis === 'v' ? C + s : t, py = axis === 'v' ? t : C + s;
            if (g[py][px] === 1) g[py][px] = 2;
          });
        });
        [-EDGE, EDGE].forEach(function (s) {
          var px = axis === 'v' ? C + s : t, py = axis === 'v' ? t : C + s;
          if (g[py][px] === 1) g[py][px] = 2;
        });
      }
    }
    if (vert) stripe('v', coverV);
    if (horiz) stripe('h', coverH);

    // ---- 3. THE OVERPASS. A mile-grid arterial crossing the corridor does not meet
    //         it: it rides over on a deck carried by columns in the median and on the
    //         shoulders. The deck is an OVERHEAD tile — you drive and walk UNDER it.
    var deckAxis = null;
    if (cross.length) {
      var wantH = cross.some(function (d) { return d === 'E' || d === 'W'; });
      var wantV = cross.some(function (d) { return d === 'N' || d === 'S'; });
      if (vert && !horiz && wantH) deckAxis = 'h';
      else if (horiz && !vert && wantV) deckAxis = 'v';
    }
    if (deckAxis) {
      var half = 11;                                  // ~17 m of deck, a real overpass width
      for (i = -half; i <= half; i++) {
        for (var t2 = 0; t2 < 128; t2++) {
          var px2 = deckAxis === 'h' ? t2 : C + i, py2 = deckAxis === 'h' ? C + i : t2;
          var cur = g[py2][px2];
          if (cur === 0) continue;                    // the deck only spans the corridor
          g[py2][px2] = 12;
        }
      }
      // columns: a centre pier in the median plus one on each shoulder
      [0, -OUTSHLD - 1, OUTSHLD + 1].forEach(function (o) {
        for (i = -half; i <= half; i += 22) {
          for (j = -1; j <= 1; j++) {
            var px3 = deckAxis === 'h' ? C + o : C + i + j, py3 = deckAxis === 'h' ? C + i + j : C + o;
            if (px3 >= 0 && py3 >= 0 && px3 < 128 && py3 < 128) g[py3][px3] = 13;
          }
        }
      });
    }

    // ---- 4. act-1 DEAD dressing: this is where the traffic stopped ---------------
    function onLane(c) { return c === 1 || c === 2 || c === 3; }
    function block(px, py, w, h, code, test) {
      for (var a = 0; a < w; a++) for (var b2 = 0; b2 < h; b2++) {
        var xx = px + a, yy = py + b2;
        if (xx < 0 || yy < 0 || xx > 127 || yy > 127) continue;
        if (test(g[yy][xx])) g[yy][xx] = code;
      }
    }
    var alongAxis = vert ? 'v' : 'h';
    var coverFn = vert ? coverV : coverH;
    for (i = 0; i < 26; i++) {                        // stopped cars, clustered like a jam
      var t3 = Math.floor(r() * 128);
      if (!coverFn(t3 - C)) continue;
      var s3 = (r() < 0.5 ? -1 : 1) * (INSHLD + 1 + Math.floor(r() * (LANES - INSHLD)));
      var px4 = alongAxis === 'v' ? C + s3 : t3, py4 = alongAxis === 'v' ? t3 : C + s3;
      block(px4, py4, alongAxis === 'v' ? 2 : 3, alongAxis === 'v' ? 3 : 2, 10, onLane);
    }
    for (i = 0; i < 4; i++) {                         // a jackknifed semi or two
      var t4 = Math.floor(r() * 128);
      if (!coverFn(t4 - C)) continue;
      var s4 = (r() < 0.5 ? -1 : 1) * (INSHLD + 2 + Math.floor(r() * (LANES - INSHLD - 2)));
      var px5 = alongAxis === 'v' ? C + s4 : t4, py5 = alongAxis === 'v' ? t4 : C + s4;
      block(px5, py5, alongAxis === 'v' ? 3 : 9, alongAxis === 'v' ? 9 : 3, 11, onLane);
    }
    for (i = 0; i < 40; i++) {                        // debris drifted across the lanes
      var t5 = Math.floor(r() * 128);
      if (!coverFn(t5 - C)) continue;
      var s5 = (r() < 0.5 ? -1 : 1) * Math.floor(r() * LANES);
      var px6 = alongAxis === 'v' ? C + s5 : t5, py6 = alongAxis === 'v' ? t5 : C + s5;
      block(px6, py6, 1, 1, 15, onLane);
    }
    for (i = 6; i < 128; i += 11) {                   // dead brush up the embankment
      if (!coverFn(i - C)) continue;
      var s6 = (r() < 0.5 ? -1 : 1) * (RAIL + 3 + Math.floor(r() * (EMBANK - RAIL - 4)));
      var px7 = alongAxis === 'v' ? C + s6 : i, py7 = alongAxis === 'v' ? i : C + s6;
      block(px7, py7, 2, 2, 7, function (c) { return c === 6; });
    }
    for (i = 14; i < 128; i += 30) {                  // high-mast lights on the shoulder
      if (!coverFn(i - C)) continue;
      var s7 = ((i / 30) | 0) % 2 ? RAIL - 1 : -(RAIL - 1);
      var px8 = alongAxis === 'v' ? C + s7 : i, py8 = alongAxis === 'v' ? i : C + s7;
      block(px8, py8, 1, 1, 9, function (c) { return c === 5 || c === 6; });
    }
    // ONE overhead sign gantry, deterministic, spanning the lanes
    var gt = 20 + Math.floor(r() * 80);
    if (coverFn(gt - C) && !(vert && horiz)) {
      for (i = -LANES; i <= LANES; i++) {
        var px9 = alongAxis === 'v' ? C + i : gt, py9 = alongAxis === 'v' ? gt : C + i;
        if (px9 >= 0 && py9 >= 0 && px9 < 128 && py9 < 128 && onLane(g[py9][px9])) g[py9][px9] = 14;
      }
    }

    return { g: g, W: 128, H: 128, streets: links, links: links, cross: cross,
             deck: deckAxis, gates: [], footprints: [] };
  }

  function throughDrivable(res, links) {
    var g = res.g, drive = { 1: 1, 2: 1, 3: 1, 10: 1, 11: 1, 14: 1, 15: 1, 12: 1 };
    return links.every(function (d) {
      d = String(d).toUpperCase()[0];
      for (var i = 0; i < 128; i++) {
        if (d === 'N' && drive[g[0][i]]) return true;
        if (d === 'S' && drive[g[127][i]]) return true;
        if (d === 'W' && drive[g[i][0]]) return true;
        if (d === 'E' && drive[g[i][127]]) return true;
      }
      return false;
    });
  }

  var PALETTE = {
    1: '#33333c', 2: '#c9c1aa', 3: '#3d3d46', 4: '#8a8a92', 5: '#6b6b74', 6: '#6a5f47',
    7: '#3a4520', 8: '#7a7266', 9: '#8f8676', 10: '#55555f', 11: '#4a4a54', 12: '#5c5c66',
    13: '#6f6a5e', 14: '#6a6a72', 15: '#4a4842'
  };

  var LEGEND = {
    0:  { name: 'dirt frontage',    kind: 'ground',    act1: 'graded dirt outside the sound wall, weeds through it' },
    1:  { name: 'travel lane',      kind: 'drive',     act1: 'interstate lane, sun-cracked and drifted with grit' },
    2:  { name: 'white lane line',  kind: 'marking',   act1: 'faded white lane line (a freeway has no yellow: the barrier does that job)' },
    3:  { name: 'shoulder',         kind: 'drive',     act1: 'paved shoulder, rumble strip worn flat' },
    4:  { name: 'median barrier',   kind: 'structure', act1: 'concrete F-shape median barrier, scarred and tagged' },
    5:  { name: 'guardrail',        kind: 'structure', act1: 'steel W-beam guardrail, posts bent where something left the road' },
    6:  { name: 'embankment',       kind: 'ground',    act1: 'graded embankment slope, decomposed granite and rock' },
    7:  { name: 'dead brush',       kind: 'tree-dead', act1: 'dry brush and tumbleweed piled up the embankment' },
    8:  { name: 'sound wall',       kind: 'structure', act1: 'the tall block sound wall fronting the neighbourhood, tagged end to end' },
    9:  { name: 'high-mast light',  kind: 'prop',      act1: 'high-mast freeway light, every head dark' },
    10: { name: 'dead car',         kind: 'vehicle',   act1: 'a car stopped in the lane where it died, doors open, glass gone' },
    11: { name: 'dead semi',        kind: 'vehicle',   act1: 'a jackknifed semi across the lanes, trailer stripped' },
    12: { name: 'overpass deck',    kind: 'overhead',  act1: 'the mile-grid street crossing overhead on its deck (you pass UNDER)' },
    13: { name: 'bridge column',    kind: 'structure', act1: 'concrete bridge pier carrying the overpass, tagged at the base' },
    14: { name: 'sign gantry',      kind: 'overhead',  act1: 'overhead sign gantry, panels gone or hanging' },
    15: { name: 'rubble / debris',  kind: 'prop',      act1: 'blown tyre, bumper, glass and drift across the lanes', solid: false }
  };

  var NOTES = {
    summary: 'The interstate cell: eight lanes between a concrete median barrier and the sound wall, on an embankment, with the mile-grid street crossing OVER it on a deck. Act-1 dead, which on a freeway means the traffic is still sitting in it.',
    reference: [
      'I-15 / CC-215 through the Las Vegas valley: 4 travel lanes each way at 12 ft, 10 ft outside shoulder, 4 ft inside shoulder, concrete F-shape median barrier, guardrail, graded embankment, and the sound wall that fronts every neighbourhood the corridor passes.',
      'A freeway has no at-grade crossings: the surface street grid rides OVER it on an overpass carried by centre and shoulder piers.',
      'No yellow paint exists on a freeway cross-section: opposing directions are separated by the barrier, not a line (LINE COLOR LAW satisfied by construction).'
    ],
    layout: [
      'Median barrier, inside shoulder, four lanes, outside shoulder, guardrail, embankment, sound wall, out to the cell boundary on both sides.',
      'A NETWORK TILE like the arterial: it takes the neighbours that are also FREEWAY as its own continuation, and the neighbours that are surface street as what crosses it.',
      'Where an arterial crosses, an OVERPASS DECK spans the whole corridor on three lines of piers, and the freeway runs on underneath it.',
      'The dead dressing is the point: stopped cars clustered in the lanes, a jackknifed semi, debris drifted across, brush up the embankment, every light dark.'
    ],
    circulation: 'Vehicles run through on every direction the corridor continues (proven edge to edge by the gate), threading the stopped traffic. There is no sidewalk and no pedestrian crossing at grade, which is the point of a freeway: a body on foot is trespassing here, and the way across is the overpass deck above.',
    layering: 'GROUND (drive): lanes (1), shoulders (3), markings (2), debris (15). GROUND (walk, rough): the embankment (6). STRUCTURE (solid): median barrier (4), guardrail (5), sound wall (8), bridge columns (13). PROPS (solid): high-mast lights (9), dead cars (10), dead semis (11). OVERHEAD (pass UNDER): the overpass deck (12) and the sign gantry (14) — the deck is the mile-grid street crossing above, carried on the columns, so this cell genuinely has two levels. PORTALS: none.',
    decisions: [
      'PROVISIONAL SKIN, under the ART-FIRST RESET (Paolo 7/26, landed the same day as this module): the palette and materials here predate the target screen. This is STRUCTURE (what ground exists, what blocks, what you walk on), not approved art. When the ART lane\'s target screen is picked it becomes the visual constitution and these five surfaces get re-skinned to it. Nothing here is surfaced to Paolo for an art verdict in the meantime.',
      'ACT TRIPTYCH (same ruling): only the act-1 dead material is specified. The act-2 recovering and act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world." 952 freeway cells were a flat grey slab; this builds them.',
      'A road cell is NOT an auto-district: never faction territory, never an economy district, never a quest address. It registers as a SURFACE.',
      'The overpass is deliberately an OVERHEAD layer with solid piers, not a painted crossing, so the two-level truth is in the data and not just the picture.',
      'Act-1 DEAD reads differently here than anywhere else in the valley: an empty freeway is not dead, a freeway full of stopped cars is.'
    ]
  };

  K.register('freeway', {
    generate: generate, body: function (c) { return c === 8 || c === 4; },
    category: K.category('freeway') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, throughDrivable: throughDrivable,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaFreeway = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
