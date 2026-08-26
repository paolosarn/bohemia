// BOHEMIA STRIP (8/18/26, WORLD lane). LAS VEGAS BOULEVARD ITSELF — the 81 cells of the
// resort corridor that had NO GENERATOR AT ALL and rendered as bare ground while every
// neighbour treated them as a street (`strip` has been in ROADSET since the overmap was
// written, and in SURFACEGEN never). It is a SURFACE, not a district: a network tile like
// the arterial, handed the directions whose neighbours are also road, never rotateToStreet.
//
// WHY IT IS NOT JUST A FAT ARTERIAL. Researched 8/18 (RTC of Southern Nevada on the Las
// Vegas Boulevard revitalisation; Clark County Public Works pedestrian-bridge program;
// FHWA Las Vegas Pedestrian Safety Project phases 2-3):
//   * EIGHT LANES divided by a wide LANDSCAPED MEDIAN, with left-turn bays opening at the
//     major intersections. The county lifted the median palms out during construction and
//     RE-PLANTED them after, which is how central the palm median is to what the street is.
//   * The walk is a PROMENADE AT THE BACK OF CURB — no amenity strip, no buffer, no
//     detached sidewalk. The Strip's sidewalk is the widest continuous pedestrian surface
//     in the valley and it is packed against the traffic.
//   * NO BLOCK WALL, EVER. A tract wall backs an arterial; a RESORT PODIUM fronts this.
//     The neighbour's own building is the edge.
//   * The signature of the corridor is the ENCLOSED PEDESTRIAN BRIDGE over the boulevard
//     at each major crossing, on stair/escalator towers at the corners — Clark County runs
//     a standing repair program on them. That is an OVERHEAD span you walk across and pass
//     UNDER, which is exactly what our layering system was built to carry.
//   * The MARQUEE PYLONS stand at the property line on the promenade: the tallest thing on
//     the street that is not a building.
//
// A RUN AND A CROSSING ARE TWO DIFFERENT THINGS (Paolo 8/11, LOCKED, and it applies here
// for the same reason it applied to the arterial): `strip` is the straight boulevard run,
// `strip_x` is the signalised crossing with the bridges. Same generator, same palette, one
// canonical body — asked the other question, so the ICON LAW gives the pair two icons.
//
// ACT-1 DEAD: the palms in the median dead on their feet, every signal head dark, the
// bridges standing with their escalators stopped, the marquee faces blank, cars left where
// the traffic stopped.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): STREETS ARE THE HARMONIZED POOL (Paolo 7/31) —
// read records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md first, which names
// banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt as the source of every street pixel
// (pools.street, pools.side, pools.median, pools.lane_div, pools.cross, the turn-pocket
// lines) plus its embedded 30yr-marking-wash and weather-rarity rulings. THIS MODULE COOKS
// ZERO PIXELS. It emits CODES, and it deliberately reuses the ARTERIAL's exact code
// vocabulary for every shared meaning (1 roadway, 2 lane line, 3 crosswalk, 4 median,
// 5 curb, 6 walk, 9 light, 11 dead palm, 12 signal, 14 dead car, 15 stop bar, 16 inlet,
// 17 pocket line) so the renderer's existing map from those codes to the harmonized pool
// tiles carries straight over with nothing hand-painted. Only what the Strip has and the
// arterial does not gets new codes: 18 bridge span, 19 bridge tower, 20 marquee pylon.
//
// LEGEND:
//  0 dirt margin        1 asphalt roadway     2 white lane line     3 crosswalk
//  4 palm median        5 curb + gutter       6 promenade (walk)    7 planter
//  9 streetlight       11 dead palm          12 signal mast        14 dead car
// 15 stop bar          16 storm inlet        17 yellow pocket line
// 21 paver band        22 building-line margin                    23 junction box
// 24 bus / taxi lane
// 18 pedestrian bridge span (OVERHEAD)       19 bridge tower       20 marquee pylon
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var C = 64;          // cell centre (128x128)
  // THE CROSS-SECTION, as distance OUT from the centreline (tiles of 0.75 m).
  // THE STREET FILLS THE BOX (Paolo 8/11, LOCKED). Same law the arterial lives under, and
  // the Strip is the easiest street in the game to obey it with, because out there the
  // right-of-way really does run building face to building face with nothing between.
  var MEDIAN = 7;      // 0..7    wide landscaped palm median (~11 m)
  var PAVE = 31;       // 8..31   4 lanes each way + bus/turn lane (~18 m per side)
  var CURB = 33;       // 32..33  curb + gutter
  var WALK = 64;       // 34..64  THE PROMENADE, at the back of curb, out to the cell edge
  var ROW = 64;        // and no wall: the resort podium next door is the edge
  // 64, NOT 63 — the arterial's truncation_gate lesson: a half-width of 63 misses row 0
  // and column 0, so two road cells side by side get a one-tile seam of bare dirt.
  var BOX = 33;        // half-width of the curb-to-curb junction box (tracks CURB)

  var LANE_A = 12, LANE_B = 19, LANE_C = 26;  // white lines between same-direction lanes
  var EDGE = 30;                              // solid white edge line
  var POCKET = 16;                            // how far past the box the left-turn bay runs

  /* THE PROMENADE IS NOT ONE SLAB, and measuring it proved it: laid as a single code the
     walk owned 47.3% of the cell, which breaks the MONOBLOCK law (no code owns 30% of a
     plot -- nobody has ANSWERED FOR ground that big) and reads on the grid as exactly the
     blank plate this whole ship exists to kill. Out there it is three surfaces you can see
     the joint between: the KERB-SIDE WALK you actually move along, a PAVER BAND of
     patterned banding through the middle of it, and the BUILDING-LINE MARGIN where the
     resort's own frontage takes over the ground. Same width, three real things. */
  var PAVER_A = 42, PAVER_B = 52;   // the banded middle of the promenade
  /* AND THE ROADWAY IS NOT ONE SLAB EITHER, for the same measured reason (33.5% as one
     code) and the same real one: the outside lane of Las Vegas Boulevard is the BUS AND
     TAXI lane, and on a street where a resort's whole arrival depends on the kerb it is
     the most heavily used, most heavily marked surface out there. Naming it is what the
     street actually is. */
  var BUSLANE = 23;    // 24..31: the kerb-side bus and taxi lane
  function bandCode(b) {
    if (b <= MEDIAN) return 4;
    if (b <= BUSLANE) return 1;
    if (b <= PAVE) return 24;
    if (b <= CURB) return 5;
    if (b < PAVER_A) return 6;      // kerb-side walk
    if (b <= PAVER_B) return 21;    // the paver band
    if (b <= ROW) return 22;        // building-line margin
    return 0;
  }

  /* THE NETWORK TILE. Identical machinery to the arterial's, for the same reason: a tile
     is pavement if EITHER road's pavement reaches it, so corners, tees and four-ways all
     fall out of one generator instead of sixteen hand-built masks. */
  /* THE BOULEVARD IS TWO CELLS WIDE, AND ITS OWN OTHER HALF IS NOT A CROSS STREET.
     Paolo 8/16 on the freeway, and it is the identical defect here: "you gotta recognize
     when the freeway is two grids wide two tiles wide that it has to work together."
     MEASURED IN THE SEED VALLEY: the Strip is 81 cells and it runs TWO CELLS ABREAST, so
     every single cell has a road neighbour on all four sides — its continuation ahead and
     behind, and its own SIBLING HALF to the side. Keyed off "is there a road next to me",
     78 of the 81 built a full signalised junction: seventy-eight sets of crosswalks,
     signal masts and pedestrian bridges in an unbroken row down Las Vegas Boulevard.
     So the cell is told three different things and never confuses them:
       links  — the axis the boulevard RUNS on (from run length, not from adjacency)
       cross  — the legs where a road that is NOT this boulevard actually meets it. THIS,
                and only this, makes a crossing.
       spanThrough — my sibling half has the crossing and its pedestrian bridge has to
                keep going across me, because a bridge over an eight-lane boulevard does
                not stop halfway. This is the halves working together. */
  function generate(seed, opts) {
    opts = opts || {};
    /* `same` FIRST, and it was missing (8/20). The world hands a road cell `sameLinks`
       and `crossLinks`, and freeway and rail both read `opts.same || opts.links || ...`.
       This one read only links/streets, so the corridor axis was taken from whatever a
       caller happened to pass and the world's own answer was ignored. */
    var links = opts.same || opts.links || opts.streets || ['N', 'S'];
    var set = {}; links.forEach(function (d) { set[String(d).toUpperCase()[0]] = 1; });
    if (!set.N && !set.S && !set.E && !set.W) { set.N = set.S = 1; }
    var hasN = !!set.N, hasS = !!set.S, hasE = !!set.E, hasW = !!set.W;
    var xset = {}; (opts.cross || []).forEach(function (d) { xset[String(d).toUpperCase()[0]] = 1; });

    /* THE CORRIDOR AXIS IS THE AXIS WITH BOTH LEGS, NOT EITHER LEG (8/20). This is the
       other half of the two-cells-wide problem described above, and it silently undid
       the 8/18 fix: because the boulevard runs two abreast, a cell's `same` set holds
       its continuation AHEAD and BEHIND plus its SIBLING HALF to the side -- in the seed
       valley, `same = [N, S, E]`. The old test asked "is there any leg on this axis",
       which for that cell answers YES on both axes, so the filter below rejected every
       cross street as "along the boulevard" and NOT ONE OF THE 81 CELLS EVER BUILT A
       JUNCTION. Twelve of them have a real cross street and the world computes them
       correctly; they were thrown away here.
       A corridor RUNS on the axis it enters and leaves by -- both legs. A sibling is one
       leg. That distinction is the whole difference. */
    var vert = hasN && hasS, horiz = hasE && hasW;
    if (!vert && !horiz) { vert = hasN || hasS; horiz = !vert && (hasE || hasW); }
    /* a cross street only counts if it comes in ACROSS the boulevard, not along it */
    var xLegs = ['N', 'S', 'E', 'W'].filter(function (d) {
      if (!xset[d]) return false;
      return (d === 'N' || d === 'S') ? !vert : !horiz;
    });
    /* AND THE CROSSING ARM HAS TO BE PAVED. A cross leg that never enters `set` is a
       junction with no road arriving at it: coverH() stays false on that axis, so the
       approach, its crosswalk and its stop bar are all drawn onto ground that is not
       roadway and none of them survive. The cross street is part of this cell's
       pavement, which is what makes it an intersection rather than a painted rumour. */
    xLegs.forEach(function (d) {
      set[d] = 1;
      if (d === 'N') hasN = true; else if (d === 'S') hasS = true;
      else if (d === 'E') hasE = true; else hasW = true;
    });
    if (xLegs.length) { horiz = hasE || hasW; vert = hasN || hasS; }
    /* NO CALLER, OLD BEHAVIOUR. A caller that knows nothing about cross streets (the
       standalone dossier, the icon, a gate) still gets the crossing anatomy off a
       four-leg mask, exactly as before, so nothing that already worked changes. */
    var xing = (opts.cross != null) ? xLegs.length > 0 : (vert && horiz);
    var through = !xing && !!opts.spanThrough;

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    function coverV(oy) { return vert && (oy <= 0 ? (hasN || oy >= -BOX) : (hasS || oy <= BOX)); }
    function coverH(ox) { return horiz && (ox <= 0 ? (hasW || ox >= -BOX) : (hasE || ox <= BOX)); }
    function bandAt(ox, oy) {
      var b = 1e9;
      if (coverV(oy)) b = Math.min(b, Math.abs(ox));
      if (coverH(ox)) b = Math.min(b, Math.abs(oy));
      return b;
    }

    // ---- 1. the corridor -------------------------------------------------------
    var inPave = function (ox, oy) { return Math.abs(ox) <= BOX && Math.abs(oy) <= BOX; };
    for (y = 0; y < 128; y++) {
      var oy = y - C;
      for (x = 0; x < 128; x++) {
        var ox = x - C;
        var b = bandAt(ox, oy);
        if (b > ROW) continue;
        var code = bandCode(b);
        if (code === 4 && xing && inPave(ox, oy)) code = 1;            // never block the crossing
        /* AND THE JUNCTION BOX IS ITS OWN SURFACE. A crossing cell measured 56.3% "asphalt
           roadway" as one code; out there the box is visibly different ground -- older,
           polished by the turning traffic, unstriped because nothing may be painted through
           a junction. Naming it is honest AND it is what stops one code owning the cell. */
        if ((code === 1 || code === 24) && xing && inPave(ox, oy)) code = 23;
        g[y][x] = code;
      }
    }

    // ---- 2. markings -----------------------------------------------------------
    function laneLine(alongAxis) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        if (xing && Math.abs(oa) <= BOX) continue;            // never stripe through a junction
        if (alongAxis === 'v' && !coverV(oa)) continue;
        if (alongAxis === 'h' && !coverH(oa)) continue;
        var dash = (Math.floor((t % 12) / 6) === 0);
        [LANE_A, LANE_B, LANE_C].forEach(function (o) {
          [-o, o].forEach(function (s) {
            if (!dash) return;
            var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
            if (g[py][px] === 1 || g[py][px] === 24) g[py][px] = 2;
          });
        });
        [-EDGE, EDGE].forEach(function (s) {
          var px = alongAxis === 'v' ? C + s : t, py = alongAxis === 'v' ? t : C + s;
          if (g[py][px] === 1 || g[py][px] === 24) g[py][px] = 2;
        });
      }
    }
    if (vert) laneLine('v');
    if (horiz) laneLine('h');

    // THE PALMS DOWN THE MEDIAN. The one thing the county lifted out and re-planted, so
    // it is the one thing this street cannot be built without. Act-1: dead on their feet.
    function medianPalms(alongAxis, coverFn) {
      for (var t = 5; t < 128; t += 9) {
        if (!coverFn(t - C)) continue;
        if (xing && Math.abs(t - C) <= BOX + 2) continue;
        var o = ((t / 9) | 0) % 2 ? 3 : -3;
        var px = alongAxis === 'v' ? C + o : t, py = alongAxis === 'v' ? t : C + o;
        if (g[py][px] === 4) g[py][px] = 11;
      }
    }
    if (vert) medianPalms('v', coverV);
    if (horiz) medianPalms('h', coverH);

    // THE TURN POCKET (LINE COLOR LAW: yellow lives only where opposing directions meet
    // with no island between them, and on this street that is the left-turn bay).
    function pocket(alongAxis, dirSign) {
      for (var t = 0; t < 128; t++) {
        var oa = t - C;
        // the bay is a BAY, not the whole leg: it opens just clear of the junction box and
        // closes again well before the cell edge, so the palm median survives on both sides
        // of it. (Get this wrong by making it open-ended and the crossing cell loses its
        // median entirely — measured: 1,906 median tiles down to 30.)
        if (dirSign > 0 ? (oa < BOX + 1 || oa > BOX + POCKET) : (oa > -BOX - 1 || oa < -(BOX + POCKET))) continue;
        for (var o = -MEDIAN; o <= MEDIAN; o++) {
          var px = alongAxis === 'v' ? C + o : t, py = alongAxis === 'v' ? t : C + o;
          g[py][px] = (Math.abs(o) === MEDIAN) ? 17 : 1;
        }
      }
    }
    /* THE LEFT-TURN BAY OPENS TOWARD THE CROSS STREET, and nowhere else. On a run the
       median is unbroken, because nothing turns across a run. */
    if (xing) {
      if (vert) { pocket('v', -1); pocket('v', 1); }
      if (horiz) { pocket('h', 1); pocket('h', -1); }
    }

    function put(px, py, code, over) {
      if (px < 0 || py < 0 || px > 127 || py > 127) return;
      var c = g[py][px];
      if (over ? over(c) : (c === 6)) g[py][px] = code;
    }
    var onWalk = function (c) { return c === 6 || c === 7 || c === 21 || c === 22; };

    // CROSSWALKS + STOP BARS at every approach that exists.
    function approach(dir) {
      var vertical = (dir === 'N' || dir === 'S'), sign = (dir === 'S' || dir === 'E') ? 1 : -1;
      for (var o = -EDGE; o <= EDGE; o++) {
        for (var d = BOX - 3; d <= BOX; d++) {
          var a = C + sign * d;
          var px = vertical ? C + o : a, py = vertical ? a : C + o;
          var _c0 = g[py][px];
          if (_c0 === 1 || _c0 === 2 || _c0 === 23 || _c0 === 24) g[py][px] = ((o + 64) % 4 < 2) ? 3 : g[py][px];
        }
        var sa = C + sign * (BOX + 2);
        var sx = vertical ? C + o : sa, sy = vertical ? sa : C + o;
        if (g[sy][sx] === 1 || g[sy][sx] === 24) g[sy][sx] = 15;
      }
      /* CURB RAMPS: without them the crossing dies at the gutter and a body on the
         promenade can never legally reach the other side. (The arterial's gate caught
         exactly this; the same hole is the same hole here.) */
      for (var e = 0; e < 2; e++) {
        var side = e ? 1 : -1;
        for (var band = CURB - 1; band <= CURB + 6; band++) {
          for (var d2 = BOX - 3; d2 <= BOX; d2++) {
            var a2 = C + sign * d2, o2 = side * band;
            var rx = vertical ? C + o2 : a2, ry = vertical ? a2 : C + o2;
            if (rx < 0 || ry < 0 || rx > 127 || ry > 127) continue;
            var cc = g[ry][rx];
            if (cc === 5 || cc === 6 || cc === 1 || cc === 2 || cc === 21 || cc === 23 || cc === 24) g[ry][rx] = 3;
          }
        }
      }
    }
    /* THE CROSS STREET HAS TO REACH THE BOULEVARD. Its roadway lives in ITS OWN cell, so
       without this it stopped dead at my cell boundary and ran into 23 m of promenade --
       an intersection you cannot drive through. Pave its mouth in from the edge to my kerb,
       at an arterial's half-width, and lay its kerbs beside it. */
    var XHALF = 22;                                   // half-width of a mile-arterial roadway
    xLegs.forEach(function (d) {
      var vertical = (d === 'N' || d === 'S'), sign = (d === 'S' || d === 'E') ? 1 : -1;
      for (var o = -(XHALF + 2); o <= XHALF + 2; o++) {
        for (var b = ROW; b >= CURB; b--) {
          var px = vertical ? C + o : C + sign * b, py = vertical ? C + sign * b : C + o;
          if (px < 0 || py < 0 || px > 127 || py > 127) continue;
          g[py][px] = (Math.abs(o) > XHALF) ? 5 : 1;
        }
      }
    });
    /* AND THE CROSSWALK GOES ACROSS THE BOULEVARD, NOT ACROSS THE SIDE STREET. What a
       pedestrian needs at a Strip junction is a way over EIGHT LANES; a ladder painted
       across the side street's mouth is not that, and is what the first cut drew because
       it called approach() on the cross legs. The bars land at the two ends of the
       junction box, spanning the roadway -- the standard anatomy, and the one the
       crossing icon has been showing since the first grid sheet. */
    if (xing) {
      var walkLegs = vert ? ['N', 'S'] : ['E', 'W'];
      if (!xLegs.length) walkLegs = ['N', 'S', 'E', 'W'].filter(function (d) { return set[d]; });
      walkLegs.forEach(approach);
    }

    /* ---- 3. THE PEDESTRIAN BRIDGES. The signature of the corridor, and the reason the
       county keeps a standing repair contract on them: at a real Strip crossing you do
       not cross at grade at all, you go UP a tower on one corner, ACROSS an enclosed span
       over eight lanes of traffic, and DOWN the tower on the other side.

       The span is code 18, layer OVERHEAD — you walk ON it and pass UNDER it, which is
       the layering the district kit already carries (kind 'overhead' -> pass under).
       The towers are code 19: real structure, standing on the promenade at the corner. */
    if (xing || through) {
      var SPAN = 4;                                  // half-width of the enclosed deck
      // one span per leg, landing on the promenade either side of the roadway
      function bridge(alongAxis) {
        var at = C + (alongAxis === 'v' ? -1 : 1) * (BOX + 12);   // clear of the junction box
        if (at < 6 || at > 121) return;
        for (var b = -(CURB + 8); b <= CURB + 8; b++) {
          for (var s = -SPAN; s <= SPAN; s++) {
            var px = alongAxis === 'v' ? C + b : at + s, py = alongAxis === 'v' ? at + s : C + b;
            if (px < 0 || py < 0 || px > 127 || py > 127) continue;
            var cur = g[py][px];
            // the deck flies over roadway, median and paint alike; it only LANDS on walk
            if (cur === 1 || cur === 2 || cur === 3 || cur === 4 || cur === 5 || cur === 21 ||
                cur === 23 || cur === 24 || cur === 11 || cur === 15 || cur === 17 || cur === 6) g[py][px] = 18;
          }
        }
        /* THE TOWERS BELONG TO THE CROSSING HALF. On the sibling half the deck is just
           passing over -- a bridge over a two-cell-wide boulevard has two towers total,
           not four, and putting a stair tower in the middle of the roadway would be
           absurd. This is what "they have to work together" means in code. */
        if (through) return;
        [-1, 1].forEach(function (side) {
          for (var tb = CURB + 4; tb <= CURB + 12; tb++) {
            for (var ts = -SPAN; ts <= SPAN; ts++) {
              var tx = alongAxis === 'v' ? C + side * tb : at + ts;
              var ty = alongAxis === 'v' ? at + ts : C + side * tb;
              if (tx < 0 || ty < 0 || tx > 127 || ty > 127) continue;
              if (g[ty][tx] === 18 || g[ty][tx] === 6 || g[ty][tx] === 21) g[ty][tx] = 19;
            }
          }
        });
      }
      /* THE DECK FLIES ACROSS THE TRAFFIC, so it is laid on the boulevard's OWN axis --
         a bridge over a north-south boulevard runs east-west. On a through-half it runs
         edge to edge so it meets its other half exactly at the cell boundary. */
      if (vert) bridge('v');
      if (horiz && !vert) bridge('h');
      if (xing) {
        // signal mast arms on the four corners, heads dark
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
          put(C + q[0] * (CURB + 2), C + q[1] * (CURB + 2), 12, onWalk);
        });
        // storm inlets in the gutter at the corners (this is where the valley floods)
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
          var px = C + q[0] * CURB, py = C + q[1] * (CURB - 6);
          if (g[py][px] === 5) g[py][px] = 16;
        });
      }
    }

    /* STORM INLETS DOWN THE WHOLE CORRIDOR, not only at four corner tiles (8/20).
       The block above is the only inlet code on the Strip and it fires solely at a
       junction, on one exact tile per corner that has to already be curb -- so across
       all 81 cells of the boulevard the flood system had ZERO inlets in it. This valley
       floods hard enough that Clark County built the regional flood-control district
       that half the basins in this game belong to; a boulevard with no inlet on it has
       never seen a monsoon. Roughly one per side per cell, in the gutter band, which is
       where the water actually goes. Same fix and same reasoning as the arterial's. */
    function inletsAlong(alongAxis, coverFn) {
      for (var q2 = 30; q2 < 128; q2 += 108) {   // ~81 m, the real curb-inlet spacing
        if (!coverFn(q2 - C)) continue;
        if (xing && Math.abs(q2 - C) <= BOX) continue;
        [-1, 1].forEach(function (side) {
          for (var d3 = 0; d3 < 3; d3++) {
            var off = side * CURB;
            var px2 = alongAxis === 'v' ? C + off : q2 + d3;
            var py2 = alongAxis === 'v' ? q2 + d3 : C + off;
            if (px2 < 0 || py2 < 0 || px2 > 127 || py2 > 127) continue;
            if (g[py2][px2] === 5) g[py2][px2] = 16;
          }
        });
      }
    }
    if (vert) inletsAlong('v', coverV);
    if (horiz) inletsAlong('h', coverH);

    // ---- 4. the promenade, dressed (act-1 DEAD) --------------------------------
    // PLANTERS punched into the promenade rather than laid as a band: out there the walk
    // is one continuous surface with tree wells and pots cut into it, not a lawn strip.
    function dressWalk(alongAxis, coverFn) {
      for (var t = 3; t < 128; t += 6) {
        if (!coverFn(t - C)) continue;
        for (var e = 0; e < 2; e++) {
          var side = e ? 1 : -1;
          var b = CURB + 5 + Math.floor(r() * 10);
          var px = alongAxis === 'v' ? C + side * b : t, py = alongAxis === 'v' ? t : C + side * b;
          if (r() < 0.55) put(px, py, 7, function (c) { return c === 6 || c === 21 || c === 22; });
        }
      }
      // streetlights and dead palms standing in the promenade, staggered down each arm
      for (var u = 8; u < 128; u += 14) {
        if (!coverFn(u - C)) continue;
        var s2 = ((u / 14) | 0) % 2 ? (CURB + 3) : -(CURB + 3);
        put(alongAxis === 'v' ? C + s2 : u, alongAxis === 'v' ? u : C + s2, 9, onWalk);
      }
      for (var v = 6; v < 128; v += 11) {
        if (!coverFn(v - C)) continue;
        if (r() > 0.7) continue;
        var s3 = (r() < 0.5 ? 1 : -1) * (CURB + 9 + Math.floor(r() * 14));
        put(alongAxis === 'v' ? C + s3 : v, alongAxis === 'v' ? v : C + s3, 11, onWalk);
      }
    }
    if (vert) dressWalk('v', coverV);
    if (horiz) dressWalk('h', coverH);

    /* THE MARQUEE PYLON. The tallest thing on the street that is not a building, standing
       at the property line where the resort meets the walk. ONE per cell, deterministic,
       and its face is BLANK — whose resort this is, and what its name is, is Paolo's
       (MECHANISM-MINE / CONTENTS-PAOLO'S). */
    if (vert || horiz) {
      var mAxis = vert ? 'v' : 'h', mt = 24 + Math.floor(r() * 70);
      var ms = (r() < 0.5 ? 1 : -1) * (ROW - 6);
      if (!xing || Math.abs(mt - C) > BOX + 16) {
        for (i = -2; i <= 2; i++) for (var j = 0; j < 4; j++) {
          var mx = mAxis === 'v' ? C + ms + (ms > 0 ? j : -j) : mt + i;
          var my = mAxis === 'v' ? mt + i : C + ms + (ms > 0 ? j : -j);
          put(mx, my, 20, onWalk);
        }
      }
    }

    // cars left where the traffic stopped
    if (r() < 0.75) {
      var cAxis = vert ? 'v' : 'h', ct = 18 + Math.floor(r() * 84);
      var cs = (r() < 0.5 ? 1 : -1) * (PAVE - 2);
      if (Math.abs(ct - C) > BOX + 4) {
        for (i = 0; i < 3; i++) for (var k = 0; k < 2; k++) {
          var px3 = cAxis === 'v' ? C + cs + k : ct + i, py3 = cAxis === 'v' ? ct + i : C + cs + k;
          if (px3 >= 0 && py3 >= 0 && px3 < 128 && py3 < 128 &&
              (g[py3][px3] === 1 || g[py3][px3] === 24)) g[py3][px3] = 14;
        }
      }
    }

    /* ACCESS. Every edge that faces something that is NOT road is where a resort stands,
       and a body has to be able to step off its podium onto the promenade. There is no
       wall to break through here — the promenade already runs to the boundary — so this
       just clears any planter, palm or pylon out of the doorway. */
    var access = opts.access || [];
    access.forEach(function (d) {
      d = String(d).toUpperCase()[0];
      var half = 9;
      for (var o = -half; o <= half; o++) {
        for (var b = ROW; b >= CURB; b--) {
          var px, py;
          if (d === 'N') { px = C + o; py = C - b; }
          else if (d === 'S') { px = C + o; py = C + b; }
          else if (d === 'W') { px = C - b; py = C + o; }
          else { px = C + b; py = C + o; }
          if (px < 0 || py < 0 || px > 127 || py > 127) continue;
          var cur = g[py][px];
          if (cur === 7 || cur === 11 || cur === 9 || cur === 20 || cur === 0 ||
          cur === 21 || cur === 22) g[py][px] = 6;
        }
      }
    });

    return { g: g, W: 128, H: 128, streets: links, links: links, access: access,
             gates: [], footprints: [] };
  }

  /* a vehicle can cross the cell on every direction the network says connects */
  function throughDrivable(res, links) {
    var g = res.g, drive = { 1: 1, 2: 1, 3: 1, 14: 1, 15: 1, 17: 1, 23: 1, 24: 1 };
    return (links || res.links).every(function (d) {
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

  // THE ARTERIAL'S PALETTE FOR EVERY SHARED CODE (one street, one look — the harmonized
  // pool law). The three Strip-only codes are the only new colours, and they sit inside
  // the same layer value bands as the structures around them.
  var PALETTE = {
    0: '#5a5140',
    1: '#33333c', 2: '#b3ab97', 3: '#b3ab97', 4: '#5f5f4a', 5: '#6b6b74', 6: '#8a8a92',
    7: '#4a4030', 9: '#8f8676', 11: '#4d4a38', 12: '#6a6a72', 14: '#55555f',
    15: '#b3ab97', 16: '#4a4842', 17: '#b09a3a',
    18: '#7c8390', 19: '#6d7280', 20: '#5c5648',
    21: '#7e7e86', 22: '#6f6f78', 23: '#2e2e36', 24: '#3b3b44'
  };

  var LEGEND = {
    0:  { name: 'dirt margin',        kind: 'ground',   act1: 'a strip of graded dirt where the promenade stops short of the property line' },
    1:  { name: 'asphalt roadway',    kind: 'drive',    act1: 'eight lanes of Las Vegas Boulevard, patched, rutted and sun-bleached' },
    2:  { name: 'white lane line',    kind: 'marking',  act1: 'faded white lane line, dashed between lanes going the same way' },
    3:  { name: 'crosswalk',          kind: 'marking',  act1: 'ladder crosswalk across the approach, worn down to ghosts of bars' },
    4:  { name: 'palm median',        kind: 'ground',   act1: 'the wide landscaped median down the middle of the boulevard, irrigation dead, gravel and dust', solid: false },
    5:  { name: 'curb + gutter',      kind: 'ground',   act1: 'concrete curb and gutter, silt packed in it, the promenade starting right off the back of it' },
    6:  { name: 'promenade',          kind: 'walk',     act1: 'the Strip promenade: wide pavers at the back of curb, cracked and lifted, sand drifted along the building line' },
    7:  { name: 'planter',            kind: 'tree-dead',act1: 'a tree well cut into the promenade, the tree gone, the pit full of grit and trash', solid:false },
    9:  { name: 'streetlight',        kind: 'prop',     act1: 'a boulevard light standard on the promenade, head dark' },
    11: { name: 'dead palm',          kind: 'tree-dead',act1: 'a Strip palm dead on its feet — bare grey trunk, the crown collapsed years ago; nothing in this valley is green' },
    12: { name: 'signal mast',        kind: 'prop',     act1: 'traffic signal mast arm reaching out over the lanes, every head dark' },
    14: { name: 'dead car',           kind: 'vehicle',  act1: 'a car left in the lane where the traffic stopped, tyres flat, glass gone' },
    15: { name: 'stop bar',           kind: 'marking',  act1: 'wide white stop bar behind the crosswalk' },
    16: { name: 'storm drain inlet',  kind: 'ground',   act1: 'curb inlet to the flood system, grate half choked with silt' },
    17: { name: 'yellow turn-pocket line', kind: 'marking', act1: 'yellow line bordering the left-turn bay where the median opens' },
    18: { name: 'pedestrian bridge',  kind: 'overhead', act1: 'the enclosed pedestrian bridge over the boulevard — you walk ACROSS it and you pass UNDER it; the glazing is starred and the moving walkway is stopped', solid: false },
    19: { name: 'bridge tower',       kind: 'structure',act1: 'the stair and escalator tower carrying the bridge down to the promenade, escalator treads frozen mid-flight', enter: 'the tower stair: switchback flights up to the bridge deck, handrails cold, one landing open to the street' },
    20: { name: 'marquee pylon',      kind: 'structure',act1: 'a resort marquee pylon standing at the property line, the sign face dark and blank'  },
    21: { name: 'paver band',         kind: 'walk',     act1: 'the banded pavers running down the middle of the promenade, lifted and rocking where the roots got under them' },
    22: { name: 'building-line margin',kind: 'walk',    act1: 'the last strip of promenade against the property line, where the resort frontage takes the ground over — sand drifted deep along it' },
    23: { name: 'junction box',       kind: 'drive',    act1: 'the asphalt inside the junction, polished by the turning traffic and unpainted, because nothing is ever striped through a crossing' },
    24: { name: 'bus / taxi lane',    kind: 'drive',    act1: 'the kerb-side bus and taxi lane, rutted where a thousand coaches stopped in the same spot every day' }
  };

  var NOTES = {
    summary: 'LAS VEGAS BOULEVARD — the resort corridor itself. Eight lanes divided by a wide landscaped palm median, a promenade at the back of curb running out to the property line on both sides, marquee pylons at the building face, and at every major crossing the enclosed PEDESTRIAN BRIDGES on their stair towers, flying over the traffic. 81 cells of the valley are this street, and every one of them generated bare ground until now.',
    reference: [
      'RTC of Southern Nevada, Las Vegas Boulevard revitalisation: the median palms were lifted out during construction and RE-PLANTED after, with the sidewalks widened, curb ramps added and lighting rebuilt. The palm median is not decoration on this street, it is the street.',
      'FHWA Las Vegas Pedestrian Safety Project (phases 2-3) and Clark County Public Works: the Strip walk is built AT THE BACK OF CURB with no buffer between the walk and the travel lanes — the opposite of the valley arterial, which detaches its sidewalk behind an amenity strip.',
      'Clark County Public Works pedestrian-bridge program: the corridor crosses at the major intersections by ENCLOSED BRIDGE on stair/escalator towers, not at grade — a standing repair and lighting contract runs on four bridges at Flamingo alone.',
      'Roadway: generally six to eight lanes divided by a central median, with dedicated transit and left-turn lanes opening at the major intersections.'
    ],
    layout: [
      'The cross-section from the centreline out: an 11 m landscaped PALM MEDIAN, four lanes each way plus a bus/turn lane out to 23 m, curb and gutter, then the PROMENADE — and the promenade runs all the way to the cell edge, because on this street the neighbouring RESORT PODIUM is the property line and there is no wall to put anywhere.',
      'It is a NETWORK TILE, not a lot: it takes the directions whose neighbours are also road and builds what serves them, so a through run, a corner, a T and a four-way all come out of one generator.',
      'At a real crossing the median stops short for a yellow-bordered left-turn bay, ladder crosswalks and stop bars land on every approach, signal masts stand on the four corners — and the PEDESTRIAN BRIDGES fly across the boulevard clear of the junction box, landing on their stair towers on the promenade either side.',
      'The promenade is dressed rather than banded: tree wells cut into the pavers, boulevard light standards, dead palms, and one marquee pylon standing at the building line.'
    ],
    circulation: 'Traffic runs through on every connected direction, cell edge to cell edge. Pedestrians have TWO routes and that is the whole character of this street: at grade along a continuous promenade that wraps every corner and crosses at the marked crosswalks, or UP a bridge tower and ACROSS the enclosed span above the traffic. The span is OVERHEAD, so a body underneath it walks or drives straight through.',
    layering: 'GROUND (flat, walk or drive): the roadway (1), every marking (2, 3, 15, 17), the curb and gutter (5), the storm inlet (16), the planters (7), and the palm median (4), which is a low island you step onto, not a blocker. WALK: the promenade (6). OVERHEAD (pass under, walk on): the pedestrian bridge span (18). STRUCTURE (blocks, ¾ face): the bridge towers (19, ENTERABLE -> the tower stair) and the marquee pylons (20). PROPS (solid): streetlight (9), signal mast (12), dead car (14), dead palm (11). The bridge is the only thing in the corridor at a second level, and it is the reason this street reads as the Strip and not as a wide arterial.',
    decisions: [
      'A SURFACE, NOT A DISTRICT: a road cell never becomes faction territory, an economy district or a quest address. It registers surface:true, so the world renders it and bodies walk it while everything that counts districts keeps counting only districts. Same ruling the arterial ships under.',
      'A RUN AND A CROSSING ARE TWO DIFFERENT THINGS (Paolo 8/11, LOCKED): `strip` is the straight boulevard run, `strip_x` is the signalised crossing that carries the bridges. Same generator, same palette, one canonical body — two registered types so the ICON LAW gives the pair two icons and the map can never draw a crossing where a run is.',
      'vehicular:true under the WALKABLE-LAND LAW: a street is the one venue whose vehicle surface IS the venue. It is still dressed the whole length — median palms, planters, lights, pylons, bridges — and never a void.',
      'NO WALL, NO FENCE, NOTHING ENCLOSING (Paolo 8/16, LOCKED, and the real street agrees): a tract wall backs an arterial, but a resort podium fronts the Strip. The promenade runs to the boundary and the neighbour\'s own building starts on the other side of the line.',
      'LINE COLOR LAW held exactly: white divides lanes going the same way; yellow appears only at the left-turn bay where the median opens and opposing directions actually meet.',
      'MECHANISM-MINE / CONTENTS-PAOLO\'S: the marquee pylons stand with BLANK faces and there is not one resort name, owner or faction anywhere in this module. Who holds the Strip is his to rule.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. Act-2 recovering and act-3 rebuilt are [PENDING Paolo].'
    ]
  };

  var SPEC = {
    body: function (c) { return c === 19 || c === 20; },
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  };
  /* THE REGISTERED FORM TAKES THE REAL MASK WHEN IT IS GIVEN ONE. A road cell's
     `streets` and its `links` are THE SAME LIST -- the directions whose neighbour is also
     road -- so a caller that hands this module {streets:[...]} (the district-kit registry
     signature, which is what the city page's __kitBlock passes) is handing it the network
     mask, and forcing a fixed pair on top of that would draw a north-south boulevard
     through an east-west cell. Fall back to the fixed legs only when nobody said. */
  /* A STREET ALWAYS RUNS THROUGH. Callers pass {streets:['S']} to mean "the thing on my
     south side is a road" -- correct for a LOT, and for a street CELL it means the
     boulevard dead-ends inside the block: measured, a one-leg mask left the northern 30
     tiles of the cell as bare dirt with a hard line across it, which is the exact defect
     the arterial spent 7/26 fixing. So a mask that names one end of an axis gets the
     other end too. It still TURNS -- an east-west mask builds an east-west boulevard --
     it just never stops halfway. */
  function bothLegs(dirs) {
    var s = {}; dirs.forEach(function (d) { s[String(d).toUpperCase()[0]] = 1; });
    if (s.N || s.S) { s.N = s.S = 1; }
    if (s.E || s.W) { s.E = s.W = 1; }
    var out = ['N', 'S', 'E', 'W'].filter(function (d) { return s[d]; });
    return out.length ? out : ['N', 'S'];
  }
  /* THE CROSSING TAKES THE ARMS IT IS ACTUALLY GIVEN (8/26, STREET CONTRACT).
     `strip_x` was registered with force:true -- all four legs, always, ignoring whatever
     the world handed it -- on the reasoning that this type "is a portrait, not a
     placement". It is BOTH: kitRoadType() puts it on real cells. So a boulevard cell with
     one cross street to the east also grew a full arm to the WEST, out to a cell boundary
     whose neighbour is a plain north-south run with nothing on that edge. The two halves
     of the Strip disagreed about where the road was. The portrait is unaffected: called
     with no legs at all it still falls back to all four, which is what the icon renders. */
  function reg(name, legs, force) {
    var s = { generate: function (seed, opts) {
        var o = {}; for (var k in (opts || {})) o[k] = opts[k];
        var given = (o.links || o.streets) || null;
        var want = (given && given.length) ? bothLegs(given) : legs;   // `force` retired
        var cross = o.cross || [];                   // plus an arm per street that arrives
        for (var ci = 0; ci < cross.length; ci++) {
          var cd = String(cross[ci]).toUpperCase().charAt(0);
          if (want.indexOf(cd) < 0) want = want.concat([cd]);
        }
        o.links = ['N', 'S', 'E', 'W'].filter(function (d) { return want.indexOf(d) >= 0; });
        o.streets = o.links;
        return generate(seed, o); },
      /* the surface/world caller hands the network mask in, and it is the ONLY caller that
         can know whether the road beside this cell is a cross street or this boulevard's
         own other half -- the module cannot see the map. */
      category: K.category(name) || 'gaming_resort' };
    for (var k2 in SPEC) s[k2] = SPEC[k2];
    K.register(name, s);
  }
  // THE RUN, AND IT ALWAYS RUNS THROUGH. A street that dead-ends inside a block is not a
  // street — the arterial learned this the hard way and left a third of every grid bare.
  reg('strip', ['N', 'S']);
  // THE CROSSING: all four legs, the lights, and the bridges. FORCED, because this type
  // exists to be the icon of a crossing -- it is a portrait, not a placement.
  reg('strip_x', ['N', 'S', 'E', 'W'], true);

  var API = { generate: generate, throughDrivable: throughDrivable,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaStrip = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
