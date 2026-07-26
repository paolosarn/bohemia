// BOHEMIA ARTERIAL (7/26/26, WORLD lane) — THE MILE-GRID STREET CELL, BUILT FOR REAL.
//
// Paolo 7/26: "we need to actually build a fucking world." The census said where the
// hole was: of 9,216 valley cells, 3,386 (37%) are ROAD cells — arterial and freeway —
// and not one of them had a generator. They rendered as a flat grey slab. More of the
// valley was untextured road than was built district. This module builds the arterial
// half: 2,434 cells, the mile-grid streets every district in the game fronts onto.
//
// A road cell is not a district, it is a NETWORK TILE: it takes the set of directions
// whose neighbours are also road (N/S/E/W) and builds the corridor that serves them —
// a through street, a corner, a T, a 4-way intersection, a stub. All 16 masks build.
//
// REAL REFERENCE (Clark County / City of Las Vegas arterial standards, the actual
// cross-section you stand in out there, curb to curb and wall to wall):
//   100 ft right-of-way, 6 travel lanes (3 each way) at 12 ft
//   raised landscaped median separating the directions, opening to a left-turn pocket
//     at each intersection
//   8 ft outside shoulder / bike lane, curb and gutter
//   DETACHED sidewalk set behind an amenity strip (the Sun Belt norm, not a
//     curb-attached walk), streetlights in the amenity zone
//   a landscape setback behind the walk, then the 6 ft CMU BLOCK WALL that backs
//     every residential tract in the valley
//   overhead distribution poles down the setback, signal mast arms at the corners
// So the built corridor here is 85 tiles (64 m) wall to wall inside a 128-tile
// (96 m) cell, which leaves the honest dirt shoulder the neighbouring cell shares.
//
// LAWS HELD: SIDEWALK SANCTITY (a continuous walk wraps every corner; nothing but
// street furniture stands on it). LINE COLOR (Paolo 7/13): YELLOW separates opposing
// DIRECTION and appears only at the turn pocket where the median opens; WHITE divides
// lanes going the same way. WALKABLE-LAND: declared `vehicular:true` — a street IS its
// vehicle surface — and still dressed, never a void. 45 DEGREE ART is a paint-time law
// and does not apply to a tile grid. Act-1 DEAD: signals dark, lights dead, faded
// paint, dead palms, a car left at the curb.
//
// LEGEND:
//  0 dirt shoulder  1 asphalt roadway  2 white lane line  3 crosswalk  4 raised median
//  5 curb+gutter    6 sidewalk         7 landscape strip  8 block wall 9 streetlight
// 10 power pole    11 dead palm/shrub 12 signal mast     13 bus stop  14 dead car
// 15 stop bar      16 storm drain     17 yellow turn-pocket line
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var C = 64;          // cell centre (128x128)
  var BOX = 23;        // half-width of the curb-to-curb pavement box at an intersection
  // WALL TO WALL, EDGE TO EDGE (fixed 7/26 after looking at the real map render). The
  // corridor first stopped at a 42-tile half-width and left 20 tiles of bare dirt out to
  // the cell edge, so on the map every street floated in a black moat between the
  // districts it was supposed to join. In the real valley the tract's BLOCK WALL is the
  // property line: the corridor runs right up to it and the next parcel starts on the
  // other side. So the right-of-way now fills the cell and the wall lands on the cell
  // boundary, which is exactly where the neighbouring district's own edge begins.
  var ROW = 63;        // half-width of the whole corridor: the wall sits on the cell edge

  // cross-section, as distance OUT from the road's centreline (in tiles, 0.75 m each)
  var MEDIAN = 2;      // 0..2   raised median island (5 tiles ~ 3.75 m)
  var PAVE = 21;       // 3..21  6 travel lanes + shoulder
  var CURB = 23;       // 22..23 curb + gutter
  var AMEN = 25;       // 24..25 amenity strip (streetlights live here)
  var WALK = 28;       // 26..28 DETACHED sidewalk
  var SET = 61;        // 29..61 landscape setback (deep, the way an arterial frontage reads)
  // 62..63 block wall, sitting on the cell boundary

  var LANE_A = 8, LANE_B = 13;   // white lane lines between same-direction lanes
  var EDGE = 21;                 // solid white edge line
  var POCKET = 30;               // the median opens this far out from the box: turn pocket

  function bandCode(b) {
    if (b <= MEDIAN) return 4;
    if (b <= PAVE) return 1;
    if (b <= CURB) return 5;
    if (b <= AMEN) return 7;
    if (b <= WALK) return 6;
    if (b <= SET) return 7;
    if (b <= ROW) return 8;
    return 0;
  }

  /* THE NETWORK TILE. links = the directions whose neighbour cell is also road. The
     corridor is painted from the band coordinate: for any tile, the distance to the
     nearest centreline that actually serves it. min() over the served axes is what
     makes a corner work — a tile is pavement if EITHER road's pavement reaches it,
     and the curb / walk / wall bands wrap the corner for free. */
  function generate(seed, opts) {
    opts = opts || {};
    var links = opts.links || opts.streets || ['N', 'S'];
    var set = {}; links.forEach(function (d) { set[String(d).toUpperCase()[0]] = 1; });
    if (!set.N && !set.S && !set.E && !set.W) { set.N = set.S = 1; }
    var hasN = !!set.N, hasS = !!set.S, hasE = !!set.E, hasW = !!set.W;
    var vert = hasN || hasS, horiz = hasE || hasW;

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    // does the N-S roadway reach this row / the E-W roadway reach this column?
    function coverV(oy) { return vert && (oy <= 0 ? (hasN || oy >= -BOX) : (hasS || oy <= BOX)); }
    function coverH(ox) { return horiz && (ox <= 0 ? (hasW || ox >= -BOX) : (hasE || ox <= BOX)); }

    function bandAt(ox, oy) {
      var b = 1e9;
      if (coverV(oy)) b = Math.min(b, Math.abs(ox));
      if (coverH(ox)) b = Math.min(b, Math.abs(oy));
      return b;
    }

    // ---- 1. the corridor itself ------------------------------------------------
    var inPave = function (ox, oy) { return Math.abs(ox) <= BOX && Math.abs(oy) <= BOX; };
    for (y = 0; y < 128; y++) {
      var oy = y - C;
      for (x = 0; x < 128; x++) {
        var ox = x - C;
        var b = bandAt(ox, oy);
        if (b > ROW) continue;                       // dirt shoulder, left as 0
        var code = bandCode(b);
        // inside the intersection box the median must not block the crossing road
        if (code === 4 && vert && horiz && inPave(ox, oy)) code = 1;
        g[y][x] = code;
      }
    }

    // ---- 2. markings -----------------------------------------------------------
    // WHITE divides lanes travelling the same way; dashed, 6 on 6 off, so the eye
    // reads movement even on a dead street.
    function laneLine(alongAxis) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        if (Math.abs(oa) <= BOX) continue;                  // never stripe through the box
        if (alongAxis === 'v' && !coverV(oa)) continue;
        if (alongAxis === 'h' && !coverH(oa)) continue;
        var dash = (Math.floor((t % 12) / 6) === 0);
        [LANE_A, LANE_B].forEach(function (o) {
          [-o, o].forEach(function (s) {
            if (!dash) return;
            var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
            if (g[py][px] === 1) g[py][px] = 2;
          });
        });
        [-EDGE, EDGE].forEach(function (s) {                 // solid edge line
          var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
          if (g[py][px] === 1) g[py][px] = 2;
        });
      }
    }
    if (vert) laneLine('v');
    if (horiz) laneLine('h');

    // THE TURN POCKET. The median stops short of the intersection and the opening
    // becomes a left-turn bay: two YELLOW lines, the only yellow on the street,
    // because that is the one place opposing directions meet with no island between
    // them (LINE COLOR LAW: yellow = direction, and it lives nowhere else here).
    function pocket(alongAxis, dirSign) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        if (dirSign > 0 ? (oa < BOX + 1 || oa > POCKET) : (oa > -BOX - 1 || oa < -POCKET)) continue;
        for (var o = -MEDIAN; o <= MEDIAN; o++) {
          var px = alongAxis === 'v' ? C + o : t, py = alongAxis === 'v' ? t : C + o;
          g[py][px] = (Math.abs(o) === MEDIAN) ? 17 : 1;     // yellow border, bay inside
        }
      }
    }
    if (vert && horiz) {
      if (hasN) pocket('v', -1);
      if (hasS) pocket('v', 1);
      if (hasE) pocket('h', 1);
      if (hasW) pocket('h', -1);
    }

    // CROSSWALKS + STOP BARS at every approach that exists, only at a real crossing.
    function approach(dir) {
      var vertical = (dir === 'N' || dir === 'S'), sign = (dir === 'S' || dir === 'E') ? 1 : -1;
      for (var o = -EDGE; o <= EDGE; o++) {
        for (var d = BOX - 3; d <= BOX; d++) {                 // the ladder bars
          var a = C + sign * d;
          var px = vertical ? C + o : a, py = vertical ? a : C + o;
          if (g[py][px] === 1 || g[py][px] === 2) g[py][px] = ((o + 64) % 4 < 2) ? 3 : g[py][px];
        }
        var sa = C + sign * (BOX + 2);                          // the stop bar behind it
        var sx = vertical ? C + o : sa, sy = vertical ? sa : C + o;
        if (g[sy][sx] === 1) g[sy][sx] = 15;
      }
      /* CURB RAMPS. Without these the crosswalk dies at the gutter and a body on the
         sidewalk can never legally reach the other side of the street: the gate caught
         exactly that. The ramp carries the crossing up over the curb and the amenity
         strip to the walk, which is what the corner actually looks like out there. */
      for (var e = 0; e < 2; e++) {
        var side = e ? 1 : -1;
        for (var band = CURB - 1; band <= WALK; band++) {
          for (var d2 = BOX - 3; d2 <= BOX; d2++) {
            var a2 = C + sign * d2, o2 = side * band;
            var rx = vertical ? C + o2 : a2, ry = vertical ? a2 : C + o2;
            if (rx < 0 || ry < 0 || rx > 127 || ry > 127) continue;
            var cc = g[ry][rx];
            if (cc === 5 || cc === 7 || cc === 6 || cc === 1 || cc === 2) g[ry][rx] = 3;
          }
        }
      }
    }
    if (vert && horiz) {
      ['N', 'S', 'E', 'W'].forEach(function (d) { if (set[d]) approach(d); });
    }

    // ---- 3. street furniture (act-1 DEAD) --------------------------------------
    function put(px, py, code, over) {
      if (px < 0 || py < 0 || px > 127 || py > 127) return;
      var c = g[py][px];
      if (over ? over(c) : (c === 7)) g[py][px] = code;
    }
    var onWalkable = function (c) { return c === 7; };

    // streetlights in the amenity strip, staggered down each arm
    function furnishArm(alongAxis, coverFn) {
      for (var t = 6; t < 128; t += 20) {
        if (!coverFn(t - C)) continue;
        if (Math.abs(t - C) <= BOX) continue;
        var s = ((t / 20) | 0) % 2 ? AMEN : -AMEN;
        put(alongAxis === 'v' ? C + s : t, alongAxis === 'v' ? t : C + s, 9, onWalkable);
      }
      for (var u = 12; u < 128; u += 18) {                        // overhead distribution poles
        if (!coverFn(u - C)) continue;
        var s2 = ((u / 26) | 0) % 2 ? SET - 2 : -(SET - 2);
        put(alongAxis === 'v' ? C + s2 : u, alongAxis === 'v' ? u : C + s2, 10, onWalkable);
      }
      for (var v = 4; v < 128; v += 4) {                          // dead palms + shrubs, clumped
        if (!coverFn(v - C)) continue;
        if (r() > 0.62) continue;
        var s3 = (r() < 0.5 ? 1 : -1) * (AMEN + 4 + Math.floor(r() * (SET - AMEN - 5)));
        put(alongAxis === 'v' ? C + s3 : v, alongAxis === 'v' ? v : C + s3, 11, onWalkable);
      }
    }
    if (vert) furnishArm('v', coverV);
    if (horiz) furnishArm('h', coverH);

    // signal mast arms on the four corners of a real intersection (heads dark)
    if (vert && horiz) {
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
        var px = C + q[0] * (CURB + 2), py = C + q[1] * (CURB + 2);
        put(px, py, 12, function (c) { return c === 7 || c === 6; });
      });
      // storm drain inlets in the gutter at each corner (where the valley actually floods)
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
        var px = C + q[0] * CURB, py = C + q[1] * (CURB - 6);
        if (g[py][px] === 5) g[py][px] = 16;
      });
    }

    // ONE bus stop per cell, deterministic: a pad cut into the sidewalk plus a shelter
    if (vert || horiz) {
      var bAxis = vert ? 'v' : 'h', bt = 26 + Math.floor(r() * 60);
      var bs = (r() < 0.5 ? 1 : -1) * WALK;
      if (Math.abs(bt - C) > BOX) {
        for (i = -3; i <= 3; i++) {
          var px2 = bAxis === 'v' ? C + bs : bt + i, py2 = bAxis === 'v' ? bt + i : C + bs;
          put(px2, py2, 13, function (c) { return c === 6 || c === 7; });
        }
      }
    }

    // a car left dead at the curb, on the shoulder, some cells only
    if (r() < 0.6) {
      var cAxis = vert ? 'v' : 'h', ct = 20 + Math.floor(r() * 80);
      var cs = (r() < 0.5 ? 1 : -1) * (PAVE - 2);
      if (Math.abs(ct - C) > BOX + 4) {
        for (i = 0; i < 3; i++) for (var j = 0; j < 2; j++) {
          var px3 = cAxis === 'v' ? C + cs + j : ct + i, py3 = cAxis === 'v' ? ct + i : C + cs + j;
          if (px3 >= 0 && py3 >= 0 && px3 < 128 && py3 < 128 && g[py3][px3] === 1) g[py3][px3] = 14;
        }
      }
    }

    return { g: g, W: 128, H: 128, streets: links, links: links, gates: [], footprints: [] };
  }

  /* a vehicle can cross the cell on every direction the network says connects */
  function throughDrivable(res, links) {
    var g = res.g, drive = { 1: 1, 2: 1, 3: 1, 14: 1, 15: 1, 17: 1 };
    return links.every(function (d) {
      d = String(d).toUpperCase()[0];
      var i, hit = false;
      for (i = 0; i < 128; i++) {
        if (d === 'N' && drive[g[0][i]]) hit = true;
        if (d === 'S' && drive[g[127][i]]) hit = true;
        if (d === 'W' && drive[g[i][0]]) hit = true;
        if (d === 'E' && drive[g[i][127]]) hit = true;
      }
      return hit;
    });
  }

  var PALETTE = {
    1: '#33333c', 2: '#c9c1aa', 3: '#c9c1aa', 4: '#6f6a5e', 5: '#6b6b74', 6: '#8a8a92',
    7: '#6a5f47', 8: '#7a7266', 9: '#8f8676', 10: '#6a5f4a', 11: '#3a4520', 12: '#6a6a72',
    13: '#5c5648', 14: '#55555f', 15: '#c9c1aa', 16: '#4a4842', 17: '#b09a3a'
  };

  var LEGEND = {
    0:  { name: 'dirt shoulder',      kind: 'ground',   act1: 'the bare graded dirt between the block wall and the neighbouring lot' },
    1:  { name: 'asphalt roadway',    kind: 'drive',    act1: 'six lanes of cracked asphalt, patched and sun-bleached' },
    2:  { name: 'white lane line',    kind: 'marking',  act1: 'faded white lane line, dashed between lanes going the same way' },
    3:  { name: 'crosswalk',          kind: 'marking',  act1: 'ladder crosswalk across the approach, half worn off' },
    4:  { name: 'raised median',      kind: 'ground',   act1: 'raised concrete median island, dead landscaping and gravel', solid: false },
    5:  { name: 'curb + gutter',      kind: 'ground',   act1: 'concrete curb and gutter, silt and dead leaves packed in it' },
    6:  { name: 'sidewalk',           kind: 'walk',     act1: 'detached concrete sidewalk, cracked and lifted at the joints' },
    7:  { name: 'landscape strip',    kind: 'ground',   act1: 'decomposed granite amenity and setback strip, irrigation long dead' },
    8:  { name: 'block wall',         kind: 'structure',act1: 'six foot CMU block wall backing the tract, tagged and chipped' },
    9:  { name: 'streetlight',        kind: 'prop',     act1: 'cobra-head streetlight on the amenity strip, head dark' },
    10: { name: 'power pole',         kind: 'prop',     act1: 'overhead distribution pole down the setback, lines sagging' },
    11: { name: 'dead palm / shrub',  kind: 'tree-dead',act1: 'dead palm stump and dry oleander left in the setback' },
    12: { name: 'signal mast',        kind: 'prop',     act1: 'traffic signal mast arm on the corner, every head dark' },
    13: { name: 'bus stop',           kind: 'structure',act1: 'transit stop pad with a bent shelter frame, the ad panel long gone' },
    14: { name: 'dead car',           kind: 'vehicle',  act1: 'a car left at the curb, tyres flat, glass gone' },
    15: { name: 'stop bar',           kind: 'marking',  act1: 'wide white stop bar behind the crosswalk' },
    16: { name: 'storm drain inlet',  kind: 'ground',   act1: 'curb inlet to the flood system, grate half choked with silt' },
    17: { name: 'yellow turn-pocket line', kind: 'marking', act1: 'yellow line bordering the left-turn bay where the median opens' }
  };

  var NOTES = {
    summary: 'The mile-grid arterial street cell: a real six-lane divided Las Vegas arterial with a raised median, detached sidewalks behind an amenity strip, block walls, and a full signalised intersection when two arterials cross. 2,434 cells of the valley are this.',
    reference: [
      'Clark County / City of Las Vegas arterial standard: 100 ft right-of-way, 6 travel lanes at 12 ft, raised landscaped median, 8 ft outside shoulder / bike lane, curb and gutter.',
      'Sun Belt norm: DETACHED sidewalk set behind an amenity strip (not curb-attached), streetlights in the amenity zone, landscape setback, then the 6 ft CMU block wall that backs every residential tract in the valley.',
      'The median opens to a left-turn bay at each intersection; that bay is the only place opposing directions meet without an island between them, which is exactly where the yellow lives.'
    ],
    layout: [
      'The corridor is 85 tiles (64 m) wall to wall inside the 96 m cell: median, three lanes each way, shoulder, curb and gutter, amenity strip, detached sidewalk, landscape setback, block wall.',
      'It is a NETWORK TILE, not a district: it takes the directions whose neighbours are also road and builds what serves them. All sixteen masks build, so a through street, a corner, a T, a 4-way and a stub all come out of one generator.',
      'At a real crossing the median stops short, the opening becomes a yellow-bordered left-turn bay, ladder crosswalks and stop bars land on all four approaches, and signal mast arms stand on the four corners.',
      'Street furniture is act-1 dead: cobra-head lights out, signal heads dark, dead palms in the setback, a car left at the curb, silt in the storm inlets.'
    ],
    circulation: 'Traffic runs through on every connected direction (proven cell-edge to cell-edge by the gate). Pedestrians get a continuous DETACHED sidewalk that wraps every corner and crosses at the marked crosswalks; the walk is unbroken across the cell, so a body can walk from any district on one side to any district on the other.',
    layering: 'GROUND (flat, walk or drive): the roadway (1), every marking (2, 3, 15, 17), the curb and gutter (5), the storm inlet (16), the landscape strips (7), and the raised median (4) which is a low island you can step onto, not a blocker. WALK: the detached sidewalk (6). STRUCTURE (blocks, ¾ face): the block wall (8) and the bus stop shelter (13). PROPS (solid): streetlight (9), power pole (10), signal mast (12), dead car (14), dead palm (11). PORTALS: none, a street cell has no interior. The wall is the hard edge of the corridor; everything inside it is open ground at one level.',
    decisions: [
      'Paolo 7/26: "we need to actually build a fucking world." The census found 37% of the valley was road cells with no generator at all. This is the arterial half of that hole.',
      'A road cell is NOT an auto-district: it never becomes faction territory, an economy district or a quest address. It registers as a SURFACE, so the world renders it and bodies walk it, while everything that counts districts still counts only real districts.',
      'vehicular:true under the WALKABLE-LAND LAW: a street is the one thing whose vehicle surface IS the venue. It is still dressed (walls, walks, furniture, plantings), never a void.',
      'LINE COLOR LAW held exactly: white divides lanes going the same way, yellow appears only at the left-turn bay where the median opens and opposing directions actually meet.',
      'Act-1 DEAD throughout: nothing lit, nothing living, nothing maintained.'
    ]
  };

  K.register('arterial', {
    generate: generate, body: function (c) { return c === 8 || c === 13; },
    category: K.category('arterial') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, throughDrivable: throughDrivable,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaArterial = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
