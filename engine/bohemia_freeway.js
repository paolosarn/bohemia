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
  /* THE BRIDGE IS AS WIDE AS THE ROAD IT CARRIES, AND THAT IS THE STREET'S FACT, NOT THE
     FREEWAY'S. Read from bohemia_arterial.js rather than copied, so the deck can never
     again be a number that used to be right. See the deck pass below for what it cost. */
  var ART = (typeof module !== 'undefined') ? require('./bohemia_arterial.js')
        : (typeof BohemiaArterial !== 'undefined' ? BohemiaArterial : root.BohemiaArterial);

  var C = 64;
  var BARRIER = 1;    // 0..1   concrete F-shape median barrier
  var INSHLD = 3;     // 2..3   inside shoulder
  // THE FREEWAY FILLS THE BOX TOO (Paolo 8/11: "the streets should FILL THE WHOLE FUCKING
  // BOX ABSOLUTELY... THE FREEWAYS CAN HAVE WALLS"). Same defect the arterial had and it
  // only became visible as a real top-down grid: 23 of 63 tiles each side were travelling
  // lanes and THIRTY-ONE were graded embankment, so a freeway cell read as a thin ribbon
  // of asphalt lying in a field. A real urban freeway is 8 lanes, shoulders, ramps and
  // gore areas edge to edge; the deep embankment belongs to the parcels beside it.
  // THE WALL STAYS. It is the one thing he said a freeway may keep, and a sound wall is
  // what a real one actually has.
  var LANES = 40;     // 4..40  four lanes each way + auxiliary/ramp lanes
  var OUTSHLD = 46;   // 41..46 outside shoulder
  var RAIL = 48;      // 47..48 guardrail
  var EMBANK = 59;    // 49..59 graded embankment, narrowed to a real verge
  // 64, NOT 63 -- the same off-by-one the arterial had: 63 covers rows 1..127 and MISSES
  // ROW ZERO AND COLUMN ZERO, so two freeway cells met with a one-tile seam of bare dirt
  // between their roadbeds. Caught by truncation_gate.js.
  var ROW = 64;       // 60..63 SOUND WALL, sitting on the cell boundary
  var LANE_LINES = [8, 16, 24, 32];
  var EDGE = 40;

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
    /* THE AXIS IS THE PAIR, NOT ANY NEIGHBOUR (fixed 7/27 after looking at the render).
       The overmap lays an interstate TWO CELLS WIDE, so a cell in the middle of a
       straight east-west run has freeway to its east, its west AND to one side — and
       "any freeway neighbour is my axis" read that third one as a crossing. 926 of the
       valley's 952 freeway cells were drawing themselves as a four-way junction, and
       the corridor rendered as a lattice of tan embankment squares instead of a road.
       A cell's axis is the direction it has BOTH neighbours in; the odd one out is the
       PARALLEL CARRIAGEWAY, which is a different thing entirely and is handled below.
       Only where no pair exists at all (the end of a run, a corner) does it fall back
       to single neighbours, which is what draws an L. */
    var pairV = hasN && hasS, pairH = hasE && hasW;
    var vert, horiz;
    if (pairV || pairH) { vert = pairV; horiz = pairH; }
    else { vert = hasN || hasS; horiz = hasE || hasW; }
    // the carriageway running alongside this one: no sound wall goes between them
    var parN = horiz && !vert && hasN, parS = horiz && !vert && hasS;
    var parE = vert && !horiz && hasE, parW = vert && !horiz && hasW;

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
        // and no sound wall stands between this carriageway and the one beside it:
        // the embankment runs straight through, which is what makes the two read as
        // one interstate instead of two roads back to back
        if (code === 8) {
          if ((oy < 0 && parN) || (oy > 0 && parS) || (ox > 0 && parE) || (ox < 0 && parW)) code = 6;
        }
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
    /* *** AND A BRIDGE OVER A TWO-CELL FREEWAY DOES NOT STOP HALF WAY ACROSS. *** (8/27)
       Paolo 8/16, on this very module: "you gotta recognize when the freeway is two grids
       wide two tiles wide that it has to WORK TOGETHER." bohemia_strip.js took that ruling
       on 8/18 and wired `spanThrough` -- my sibling half has the crossing, so my half has
       to carry it on across. THE FIX NEVER TRAVELLED HERE. An interstate is laid two cells
       abreast, and only the carriageway that actually touches the arterial was handed a
       `cross`, so the overpass was built on ONE carriageway and simply ended at the cell
       boundary: a bridge over an eight-lane freeway that stops in mid-air over the far
       carriageway. Invisible in any single cell, which is why it survived a month.
       The deck runs PERPENDICULAR to the carriageway it crosses, so a half that is only
       spanning-through does not need to know which way the street came from -- it knows
       its own axis, and that is enough. */
    /* *** THE DECK AXIS COMES FROM THE AXIS THE FREEWAY RUNS ON, NOT FROM ITS FAMILY. ***
       `vert`/`horiz` above are derived from `same` -- the cells of the same family beside
       me -- and at a corner, at a merge, or on a cell whose run length TIES, `same` is
       L-shaped, so both are true and the branch above chooses NO axis at all. Those cells
       built no deck while the carriageway beside them built a full one, and the bridge
       ended in mid-air: 40 freeway-to-freeway seams.
       The world already computes the run axis and hands it over as `streets` (roadAxis
       measures RUN LENGTH, which is the same machinery the strip and the arterial use).
       A deck runs PERPENDICULAR to the carriageway it crosses, so knowing the run is
       enough and the family shape is irrelevant. */
    if (!deckAxis) {
      var runAx = null;
      if (opts.streets && opts.streets.length) {
        var s0 = String(opts.streets[0]).toUpperCase().charAt(0);
        runAx = (s0 === 'N' || s0 === 'S') ? 'v' : 'h';
      }
      if (runAx) {
        var perp = runAx === 'v' ? 'h' : 'v';
        var wantPerp = perp === 'h'
          ? cross.some(function (d) { return d === 'E' || d === 'W'; })
          : cross.some(function (d) { return d === 'N' || d === 'S'; });
        if (wantPerp || opts.spanThrough) deckAxis = perp;
      }
    }
    if (deckAxis) {
      /* *** THE BRIDGE WAS TWO THIRDS THE WIDTH OF ITS OWN ROAD (fixed 8/27). ***
         This read `var half = 11` with the comment "~17 m of deck, a real overpass width".
         It WAS a real overpass width -- for the arterial as it stood the day it was typed.
         The arterial's cross-section was rebuilt to real Clark County numbers on 8/26 and
         this number did not move, so MEASURED across the valley: the deck spans 23 tiles
         where the roadway it carries spans 35, on all 116 freeway cells that carry one.
         An arterial ran up to the freeway 35 tiles wide, climbed onto a 23-tile bridge,
         and came off 35 tiles wide again -- and that mismatch is 196 of the 270 broken
         seams left in the whole valley's street contract, the single biggest class.
         FOURTH TIME THIS MONTH a constant moved and its dependent stayed behind (BOX,
         POCKET, the pole offsets, this). So it is not a constant any more: the width of a
         bridge is a fact about the STREET, and the street now exports it. */
      var half = (ART && ART.PAVE_HALF) ? ART.PAVE_HALF : 17;
      for (i = -half; i <= half; i++) {
        for (var t2 = 0; t2 < 128; t2++) {
          var px2 = deckAxis === 'h' ? t2 : C + i, py2 = deckAxis === 'h' ? C + i : t2;
          var cur = g[py2][px2];
          if (cur === 0) continue;                    // the deck only spans the corridor
          /* THE DECK CARRIES THE STREET'S OWN ANATOMY (8/27). `i` is the offset across the
             deck, which is the same coordinate the arterial's cross-section is written in,
             so the bridge can wear the street's parapet at its edges and the street's lane
             lines inside -- rather than being a blank plank with a road at each end. */
          /* THE PARAPET IS THE DECK'S OUTERMOST TILE, INSIDE its span -- not two tiles
             beyond it. Drawn outside, it widened the bridge past the road it carries and
             the seam stopped matching the arterial again (cross-class went 166 -> 263 in
             one edit). The bridge is exactly as wide as the street; the edge of it is the
             last tile of the bridge. */
          if (Math.abs(i) === half) { g[py2][px2] = 19; continue; }        // parapet edge
          var lane = (Math.abs(i) === 8 || Math.abs(i) === 13);             // ARTERIAL's LANE_A/LANE_B
          var dash = (Math.floor((t2 % 12) / 6) === 0);
          g[py2][px2] = (lane && dash) ? 18 : 12;
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

    /* ---- 3b. THE RAILWAY UNDERNEATH (7/27). A freeway has no at-grade crossings and
       that includes the railway: the interstate BRIDGES OVER the UP mainline, and the
       line runs on under it. Six freeway cells in this valley sit on top of the rail
       corridor, and without this the one continuous 90-cell railway is severed into
       three pieces at the freeways. The rail band is laid on the ground exactly where
       bohemia_rail.js puts it (centred in the cell, same half-widths), and the freeway's
       own roadway over that band becomes DECK on piers — the same two-level convention
       the arterial overpass already uses, just with this road on top instead of under. */
    var railCross = (opts.rail || []).map(function (d) { return String(d).toUpperCase()[0]; });
    var railAxis = null;
    if (railCross.length) {
      var rV = railCross.some(function (d) { return d === 'N' || d === 'S'; });
      var rH = railCross.some(function (d) { return d === 'E' || d === 'W'; });
      if (horiz && rV) railAxis = 'v';                 // the line runs across an E-W freeway
      else if (vert && rH) railAxis = 'h';
    }
    if (railAxis) {
      var RBAL = 10, RCESS = 16;                       // bohemia_rail.js's own cross-section
      for (i = -RCESS; i <= RCESS; i++) {
        var isBal = Math.abs(i) <= RBAL;
        for (var t0 = 0; t0 < 128; t0++) {
          var pxr = railAxis === 'v' ? C + i : t0, pyr = railAxis === 'v' ? t0 : C + i;
          var under = g[pyr][pxr];
          // the band runs the WHOLE height of the cell, including the dirt outside the
          // sound wall: the railway does not stop at the interstate's property line, and
          // stopping it there put a one-tile hole in the mainline at every cell edge
          // where the freeway's own corridor had already run out.
          // where the interstate itself is overhead, the tile is DECK; either side of the
          // bridge you are standing on the railway, in the daylight between the abutments
          var onRoad = under === 1 || under === 2 || under === 3 || under === 4 || under === 5;
          g[pyr][pxr] = onRoad ? 12 : (isBal ? 16 : 17);
        }
      }
      [-1, 1].forEach(function (sgn) {                 // the abutments, one each side
        for (var j2 = -RCESS - 3; j2 <= RCESS + 3; j2++) {
          for (var k2 = 0; k2 < 3; k2++) {
            var o2 = sgn * (RCESS + 4 + k2);
            var pxb = railAxis === 'v' ? C + j2 : C + o2, pyb = railAxis === 'v' ? C + o2 : C + j2;
            if (pxb < 0 || pyb < 0 || pxb > 127 || pyb > 127) continue;
            if (g[pyb][pxb] === 12) g[pyb][pxb] = 13;
          }
        }
      });
      // and the running rails themselves, so the line is visibly one line
      [-6, -4, 4, 6].forEach(function (o3) {
        for (var t1 = 0; t1 < 128; t1++) {
          var pxs = railAxis === 'v' ? C + o3 : t1, pys = railAxis === 'v' ? t1 : C + o3;
          if (g[pys][pxs] === 16) g[pys][pxs] = 17;
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

    /* through = the directions the corridor actually CARRIES, which is not the same as
       the directions that have a freeway neighbour. The odd-one-out neighbour is the
       parallel carriageway, and you cannot drive sideways off one carriageway onto the
       other: there is an embankment between them. Saying so out loud here is what lets
       the gate assert the real physics instead of the old any-neighbour assumption. */
    var through = [], parallel = [];
    [['N', hasN, vert], ['S', hasS, vert], ['E', hasE, horiz], ['W', hasW, horiz]]
      .forEach(function (d) { if (!d[1]) return; (d[2] ? through : parallel).push(d[0]); });

    return { g: g, W: 128, H: 128, streets: links, links: links, cross: cross,
             deck: deckAxis, railAxis: railAxis, axis: { vert: vert, horiz: horiz },
             through: through, parallel: parallel, gates: [], footprints: [] };
  }

  function throughDrivable(res, links) {
    var g = res.g, drive = { 1: 1, 2: 1, 3: 1, 10: 1, 11: 1, 14: 1, 15: 1, 12: 1 };
    links = links || res.through || res.links;
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
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#5a5140',
    1: '#33333c', 2: '#b3ab97', 3: '#3d3d46', 4: '#8a8a92', 5: '#6b6b74', 6: '#6a5f47',
    7: '#3a4520', 8: '#7a7266', 9: '#8f8676', 10: '#55555f', 11: '#4a4a54', 12: '#5c5c66',
    13: '#6f6a5e', 14: '#6a6a72', 15: '#4a4842', 16: '#5a5348', 17: '#8e8a84',
    /* the deck's own paint takes the arterial's worn white, and the parapet a concrete a
       shade lighter than the deck so the edge reads from above. REUSE-FIRST: no new
       colour invented, both are values already in this game's street vocabulary. */
    /* 18 DARKENED (8/27). It was #b3ab97, the arterial's worn white, and roadcell_gate's
       visual-constitution check caught it the moment the stripe moved onto the OVERHEAD
       layer: a top surface has its own value band (72.8..137.4) and 171 is outside it.
       The band is right and the colour was wrong. A lane line on a deck that has taken
       thirty Mojave summers with nobody repainting it is not white -- it is a bleached
       ghost of white, which is what every other marking in this game already says in its
       act1 text. Measured to 134.4, inside the band. */
    18: '#8b867c', 19: '#6e6e78'
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
    15: { name: 'rubble / debris',  kind: 'prop',      act1: 'blown tyre, bumper, glass and drift across the lanes', solid: false },
    16: { name: 'rail ballast',     kind: 'ground',    act1: 'the railway ballast running out from under the bridge, in the daylight between the abutments' },
    17: { name: 'rail under bridge',kind: 'ground',    act1: 'the UP mainline passing under the interstate, rails still bright on top' },
    /* *** A BRIDGE IS A ROAD, AND OURS WAS A BLANK SLAB (8/27). *** Photographed the
       overpass at 76,5 the moment it was the right width, and it read as a plain tan plank
       laid across the freeway: no lane line, no edge. It is carrying an ARTERIAL -- the
       same six-lane street that has a median and lane markings on either side of it -- and
       a driver coming off the street onto the bridge should not lose the road.
       THE PARAPET IS THE OTHER HALF, and it is the thing that makes a bridge read as a
       bridge from above: a deck that simply stops at its edge looks like a ramp. It is
       `structure` and solid, which is also true -- you cannot walk off the side. */
    /* NAMED `deck stripe`, NOT `deck lane line`, AND THE NAME IS THE BUG FIX (8/27).
       The walked surface routes any legend name matching /lane line/ to the approved
       harmonized LANE POOL -- and those tiles are painted white ON ASPHALT, background
       included. Blitted onto a bridge deck they stamped dark asphalt rectangles across it:
       photographed it and the bridge came back wearing a row of dark blocks instead of a
       lane line. The pool is right for a road on the ground and wrong for a deck, so this
       stripe draws flat from its own palette entry. A LEGEND NAME IS NOT JUST A LABEL HERE
       -- it is a routing key, and this is the second time this month a name has silently
       chosen a renderer (the first was concrete falling through to the house-roof pool). */
    /* `overhead`, LIKE THE DECK IT IS PAINTED ON (8/27). It was `marking`, which is true
       of what it depicts and false about where it is: the new overhead pass finds the
       camera-facing edge of a deck by asking whether the cell to the south is also
       overhead, and a marking answered NO -- so every stripe put a bridge SIDE across the
       middle of the bridge, a row of dark beams standing on the deck. A deck, its paint
       and its parapet are ONE OBJECT at one height; the paint is not lying on the ground
       under the bridge. The street contract counts overhead as corridor, so the crossing
       still measures exactly as wide as the road it carries. */
    18: { name: 'deck stripe',      kind: 'overhead',  act1: 'the street\'s lane marking carried across the overpass deck, worn to a ghost', solid: false },
    /* `overhead`, NOT `structure`, and that cost two gates to learn (8/27). A parapet IS
       solid in the world -- you cannot walk off the side of a bridge -- but this grid is
       ONE LAYER, so a solid tile drawn where the deck is also says "the ground here blocks
       a body". roadcell_gate went straight red: the corridor's largest traversable space
       fell from 14,133 tiles to 3,959, because a parapet running the length of the deck
       severed the freeway underneath it. The deck already solves this exact problem by
       being an overhead you pass UNDER; its own edge is part of the same object. */
    19: { name: 'deck parapet',     kind: 'overhead',  act1: 'the concrete parapet along the edge of the overpass deck, tagged along its whole length', solid: false }
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
      'Where the RAILWAY crosses, the roles swap: the interstate is the thing on top, the mainline runs under it on the ground between the abutments, and the freeway roadway over that band becomes deck on piers. Six cells in this valley do that, and without them the one continuous 90-cell railway would be severed into three pieces.',
      'The dead dressing is the point: stopped cars clustered in the lanes, a jackknifed semi, debris drifted across, brush up the embankment, every light dark.'
    ],
    circulation: 'Vehicles run through on every direction the corridor continues (proven edge to edge by the gate), threading the stopped traffic. There is no sidewalk and no pedestrian crossing at grade, which is the point of a freeway: a body on foot is trespassing here, and the way across is the overpass deck above.',
    layering: 'GROUND (drive): lanes (1), shoulders (3), markings (2), debris (15). GROUND (walk, rough): the embankment (6). STRUCTURE (solid): median barrier (4), guardrail (5), sound wall (8), bridge columns (13). PROPS (solid): high-mast lights (9), dead cars (10), dead semis (11). OVERHEAD (pass UNDER): the overpass deck (12) and the sign gantry (14) — the deck is the mile-grid street crossing above, carried on the columns, so this cell genuinely has two levels. PORTALS: none.',
    decisions: [
      'CONFORMS TO THE VISUAL CONSTITUTION (7/26). Built during the freeze and shipped\n       flagged provisional; the moment Paolo ruled the target screen CBB this palette was\n       measured against records/target/BOHEMIA_VISUAL_CONSTITUTION.json and brought inside\n       its layer value bands. Road paint and the lake ring were the only things out, and\n       they were wrong on their own terms too: act-1 paint is filthy, not clean white.\n       Locked by the CONSTITUTION CONFORMANCE section of this module\'s gate.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. The act-2 recovering and\n       act-3 rebuilt variants are [PENDING Paolo] content, not mine to invent.',
      'Paolo 7/26: "we need to actually build a fucking world." 952 freeway cells were a flat grey slab; this builds them.',
      'A road cell is NOT an auto-district: never faction territory, never an economy district, never a quest address. It registers as a SURFACE.',
      'The overpass is deliberately an OVERHEAD layer with solid piers, not a painted crossing, so the two-level truth is in the data and not just the picture.',
      'Act-1 DEAD reads differently here than anywhere else in the valley: an empty freeway is not dead, a freeway full of stopped cars is.'
    ]
  };

  K.register('freeway', {
    // A FREEWAY CELL ALWAYS RUNS THROUGH. Callers pass {streets:['S']} meaning "fronts a
    // street on its south side" -- meaningless for a freeway, and it is why the top third
    // of the freeway grid was bare dirt with a hard edge across it: one leg stopped the
    // roadbed half a cell short. Nothing dead-ends on a freeway.
    generate: function (seed, opts) {
      var o = {}; for (var k in (opts || {})) o[k] = opts[k];
      o.same = o.links = o.streets = ['N', 'S'];
      return generate(seed, o);
    },
    body: function (c) { return c === 8 || c === 4; },
    category: K.category('freeway') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, throughDrivable: throughDrivable,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaFreeway = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
