// BOHEMIA RAIL (7/27/26, WORLD lane) — THE MAINLINE, AND THE 17 PLACES THE CITY
// CROSSES IT AT GRADE.
//
// 90 valley cells are `rail`: one unbroken north-south corridor down column 54, from
// the top of the map to the bottom, with the railyard hanging off it at y29-30. It is
// the Union Pacific line that made Las Vegas exist — the town was a railroad water
// stop before it was anything else — and until now all 90 cells rendered as flat grey.
//
// A RAIL CORRIDOR IS NOT A ROAD. It has no lanes, no median, no sidewalk and no
// intersections. What it has is a BALLAST PRISM carrying two tracks, a cess either
// side, a drainage ditch, a maintenance road on one side only, a right-of-way fence,
// and then a wide dirt frontage that in the real valley is scrap, tagged concrete and
// the backs of industrial buildings. It meets the street grid in exactly one way: at
// grade, over a paved crossing, with crossbucks and gate arms. That is the whole
// vocabulary and it is deliberately nothing like bohemia_arterial.js.
//
// REAL REFERENCE (the UP mainline through the valley):
//   two-track mainline, ~4.5 m track centres, 1.435 m gauge, on a raised ballast prism
//   wayside signal masts in pairs facing each direction, with relay huts at their feet
//   long passing SIDINGS every mile or two so trains can meet: a third track that
//     peels off through a turnout, runs parallel, and rejoins
//   at-grade crossings on the surface streets: crossing panels through the rails,
//     stop bars, the painted RXR and the X, gate arms and flashers on both approaches
//   grade SEPARATION at the freeways: the interstate bridges over, the line runs under
//   act-1 dead: the train is still on the line. Covered hoppers and a dead unit stand
//     where the crew walked away from them, and nothing has moved since.
//
// LAWS HELD: SURFACE not district (nobody bases a faction on a railway until Paolo
// rules the corridor is claimable ground). LINE COLOR is a street law: the only paint
// out here is the crossing's, and it obeys it. WALKABLE-LAND: vehicular:true — the
// maintenance road and the crossings are the vehicle surface — and it is dressed end
// to end, never a void. CONSTITUTION: every palette entry measured into its layer band.
//
// LEGEND:
//  0 dirt frontage   1 ballast        2 tie           3 rail          4 cess
//  5 drainage ditch  6 service road   7 ROW fence     8 signal mast   9 relay hut
// 10 dead freight   11 dead locomotive 12 crossing pavement 13 crossing marking
// 14 gate arm       15 scrap pile     16 dead brush   17 turnout      18 mile post
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var T = 128, C = 64;

  // cross-section, as SIGNED offset from the centreline (tiles, 0.75 m each). Signed and
  // not absolute because a real right of way is asymmetric: the maintenance road runs on
  // one side and the passing siding on the other.
  var BAL = 10;        // 0..10   ballast prism, two tracks at +/-5
  var TRACK = 5;       //         track centre offset (10 tiles apart = 7.5 m centres)
  var CESS = 16;       // 11..16  cess / ballast shoulder
  var DITCH = 20;      // 17..20  drainage ditch
  var MRD0 = 21, MRD1 = 28;   // maintenance road, WEST/NORTH side only
  var FEN0 = 30, FEN1 = 31;   // right-of-way fence, both sides
  var SID_C = 22, SID_HALF = 6;  // passing siding centre and its ballast half-width (+ side)

  // the grade crossing borrows the arterial's own cross-section so the roadway arrives
  // and leaves at exactly the tile it left the neighbouring street cell on
  var PAVE = 21, CURB = 23;

  /* THE SIDING IS A MULTI-CELL FEATURE, so it is keyed off the CELL COORDINATE and not
     the cell seed: cells 0..15 of every 48 along the line carry the siding, which makes
     a 1.5 km passing loop with its turnouts at the two ends, continuous across every
     cell in between. Keyed on the seed instead it would flicker on and off cell by cell
     and read as damage. */
  function sidingAt(along) {
    var m = ((along % 48) + 48) % 48;
    return m < 16 ? { on: true, head: m === 0, tail: m === 15, m: m, run: Math.floor(along / 48) }
                  : { on: false, m: m, run: Math.floor(along / 48) };
  }

  /* WHAT LINES A MAINLINE. The corridor proper is only about 45 m of the cell's 96, and
     the first draft left the other half as bare dirt on both sides — half the cell a
     void, which is exactly the failure the WALKABLE-LAND law was written about. What is
     actually out there on the UP line through this valley is INDUSTRY THAT EXISTS
     BECAUSE THE RAILWAY DOES: team tracks and spurs running into concrete loading pads
     behind dock walls, and between them fenced material yards stacked with relay rail,
     ties and ballast. So the frontage is a feature, not a margin, and which one a cell
     gets is keyed off the cell coordinate so a pad and its spur never split across a
     boundary. */
  function frontageAt(along) {
    var m = ((along % 7) + 7) % 7;
    if (m === 0 || m === 1) return 'pad';        // rail-served loading pad + its spur
    if (m === 3) return 'yard';                  // fenced material yard
    return 'lot';                                // graded dirt, scrap, brush
  }

  function generate(seed, opts) {
    opts = opts || {};
    var links = opts.same || opts.links || ['N', 'S'];
    var cross = opts.cross || [];
    var set = {}; links.forEach(function (d) { set[String(d).toUpperCase()[0]] = 1; });
    if (!set.N && !set.S && !set.E && !set.W) { set.N = set.S = 1; }
    var vert = !!(set.N || set.S), horiz = !!(set.E || set.W);
    if (vert && horiz) horiz = false;      // a corridor runs one way through a cell; a
                                           // real curve is handled by curveInto below
    var curve = null;
    if ((set.N || set.S) && (set.E || set.W)) {
      curve = { v: set.N ? 'N' : 'S', h: set.E ? 'E' : 'W' };
      vert = true;
    }
    var cellX = opts.cellX || 0, cellY = opts.cellY || 0;
    var along = vert ? cellY : cellX;
    var sid = sidingAt(along);

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    // s = signed offset ACROSS the corridor, t = position ALONG it, both in cell tiles
    function put(s, t, code, over) {
      var px = vert ? C + s : t, py = vert ? t : C + s;
      if (px < 0 || py < 0 || px >= T || py >= T) return;
      if (over && !over(g[py][px])) return;
      g[py][px] = code;
    }
    function span(s0, s1, t0, t1, code, over) {
      for (var s = s0; s <= s1; s++) for (var t = t0; t <= t1; t++) put(s, t, code, over);
    }

    // ---- 1. the cross-section ---------------------------------------------------
    function bandCode(s) {
      var a = Math.abs(s);
      if (a <= BAL) return 1;
      if (a <= CESS) return 4;
      if (a <= DITCH) return 5;
      if (s <= -MRD0 && s >= -MRD1) return 6;
      if (a < FEN0) return 4;
      if (a <= FEN1) return 7;
      return 0;
    }
    for (var s2 = -C; s2 < C; s2++) {
      var code = bandCode(s2);
      for (var t2 = 0; t2 < T; t2++) put(s2, t2, code);
    }

    // ---- 2. the track: ties, then the rails on top -------------------------------
    var tracks = [-TRACK, TRACK];
    if (sid.on) tracks.push(SID_C);
    function layTrack(tc, t3) {
      if (t3 % 3 === 0) span(tc - 4, tc + 4, t3, t3, 2, function (c) { return c === 1; });
      [-1, 1].forEach(function (o) { put(tc + o, t3, 3, function (c) { return c === 1 || c === 2; }); });
    }
    [-TRACK, TRACK].forEach(function (tc) { for (var t3 = 0; t3 < T; t3++) layTrack(tc, t3); });

    /* THE SIDING AND ITS TURNOUT. A third track that just appears beside the mainline is
       a bug you can see from the map, so at the head and tail cells the siding is drawn
       at a TAPERING offset: it comes off the main through real point blades, opens out
       across the cell, and runs parallel from there. Everywhere in between it sits at a
       constant offset, which is why it crosses cell boundaries without a step. */
    function sidOffsetAt(t) {
      if (!sid.on) return null;
      if (!sid.head && !sid.tail) return SID_C;
      var f = sid.head ? t / (T - 1) : 1 - t / (T - 1);
      return TRACK + (SID_C - TRACK) * f;
    }
    if (sid.on) {
      for (var t5 = 0; t5 < T; t5++) {
        var off = Math.round(sidOffsetAt(t5));
        span(off - SID_HALF, off + SID_HALF, t5, t5, 1, function (c) { return c !== 3 && c !== 2; });
        layTrack(off, t5);
        if (off < SID_C - 1) { put(off - 1, t5, 17); put(off + 1, t5, 17); }  // point blades
      }
    }

    /* THE CURVE. Column 54 runs dead straight the whole valley in this seed, so no cell
       currently needs this — but a corridor generator that physically cannot turn is a
       trap for the next map, so a cell whose links are perpendicular sweeps the track
       through a quarter arc instead of drawing a T. */
    if (curve) {
      var sgnV = curve.v === 'N' ? -1 : 1, sgnH = curve.h === 'W' ? -1 : 1;
      var ccx = C + sgnH * C, ccy = C + sgnV * C, R = C;
      for (y = 0; y < T; y++) for (x = 0; x < T; x++) {
        var d = Math.sqrt((x - ccx) * (x - ccx) + (y - ccy) * (y - ccy));
        var off = d - R;
        var band = Math.abs(off) <= BAL ? 1 : (Math.abs(off) <= CESS ? 4 : null);
        if (band !== null) g[y][x] = band;
      }
      for (y = 0; y < T; y++) for (x = 0; x < T; x++) {
        var d2 = Math.sqrt((x - ccx) * (x - ccx) + (y - ccy) * (y - ccy)) - R;
        tracks.slice(0, 2).forEach(function (tc2) {
          if (Math.abs(Math.abs(d2 - tc2) - 1) < 0.6 && g[y][x] === 1) g[y][x] = 3;
        });
      }
    }

    /* THE GRADE CROSSING. The only place the city and the railway touch — and it is laid
       LAST, after the frontage, because the road has to get through everything: the
       fence, the ditch, the maintenance road, the loading pad, all of it. */
    var crossE = cross.indexOf(vert ? 'E' : 'S') >= 0, crossW = cross.indexOf(vert ? 'W' : 'N') >= 0;
    var crossing = crossE || crossW;
    function layCrossing() {
      // the roadway arrives on the arterial's OWN pavement band (curb to curb), so it
      // lines up tile for tile with the street cell it came out of
      var t0 = C - CURB, t1 = C + CURB;
      var w0 = crossW ? -C : -(FEN1 + 3);
      var w1 = crossE ? C - 1 : (FEN1 + 3);
      span(w0, w1, t0, t1, 12);                     // crossing pavement, straight through
      // the rails survive the crossing: the panels sit BETWEEN them, steel stays proud
      tracks.forEach(function (tc3) {
        [-1, 1].forEach(function (o) { for (var t6 = t0 - 3; t6 <= t1 + 3; t6++) put(tc3 + o, t6, 3); });
      });
      var isPave = function (c) { return c === 12; };
      // one full set of furniture per approach that actually exists
      [[crossW, -1], [crossE, 1]].forEach(function (ap) {
        if (!ap[0]) return;
        var side = ap[1];
        var h0 = side < 0 ? C + 1 : C - PAVE;       // the approaching half of the roadway
        var h1 = side < 0 ? C + PAVE : C - 1;
        var hm = (h0 + h1) >> 1;
        var bar = side * (CESS + 4);                 // stop bar, set back clear of the ballast
        span(Math.min(bar, bar - side), Math.max(bar, bar - side), h0, h1, 13, isPave);
        var xc = side * (CESS + 15);                 // the big painted X on the approach
        for (i = -10; i <= 10; i++) {
          put(xc + i, hm + i, 13, isPave);
          put(xc + i, hm - i, 13, isPave);
        }
        var mast = side * (CESS + 2);                // flasher mast on the approach corner
        var post = side < 0 ? C + CURB + 1 : C - CURB - 1;
        var armDir = side < 0 ? -1 : 1;              // the arm swings out over ITS half
        put(mast, post, 14); put(mast + side, post, 14);
        for (var a2 = 1; a2 <= PAVE + 1; a2++) put(mast, post + armDir * a2, 14, isPave);
      });
    }

    // ---- 3. wayside signals, relay huts and a mile post ---------------------------
    var period = 46, phase = ((along * 29) % period + period) % period;
    for (var t7 = phase; t7 < T; t7 += period) {
      span(-CESS + 1, -CESS + 2, t7, t7 + 1, 8, function (c) { return c === 4; });
      span(CESS - 2, CESS - 1, t7 + 6, t7 + 7, 8, function (c) { return c === 4; });
      span(-DITCH - 3, -DITCH, t7 + 2, t7 + 5, 9, function (c) { return c === 5 || c === 4; });
    }
    if (((along * 7) % 5) === 0) span(CESS + 1, CESS + 1, 30, 32, 18, function (c) { return c === 5 || c === 4; });

    // ---- 4. THE FRONTAGE, which is a feature and not a margin ----------------------
    /* Everything outside the fence, both sides, all the way to the cell edge. Whichever
       of the three it is, it is USED ground: a rail-served loading pad with its own spur
       off the main, a fenced material yard, or a graded lot with the line's own cast-off
       steel stacked on it. */
    var front = frontageAt(along);
    var OUT0 = FEN1 + 2;                                    // first tile outside the fence

    function padSide(side) {                                 // side: +1 east, -1 west
      var p0 = side * OUT0, p1 = side * (C - 1);
      var lo = Math.min(p0, p1), hi = Math.max(p0, p1);
      span(lo, hi, 6, T - 7, 19);                            // the concrete loading apron
      var wall = side * (C - 8);                             // the dock wall at the back
      span(Math.min(wall, wall + side * 4), Math.max(wall, wall + side * 4), 4, T - 5, 20);
      // the SPUR: a track off the main, through the fence, onto the pad
      var lead = side > 0 ? (sid.on ? SID_C : TRACK) : -TRACK;
      var tt = 34;
      for (var q = 0; q <= Math.abs(p1) - Math.abs(lead); q++) {
        var sx = lead + side * q;
        var ty = tt + Math.round(q * 0.55);
        if (ty >= T - 8) break;
        span(sx, sx, ty - 5, ty + 5, 1, function (c) { return c === 19 || c === 7 || c === 4 || c === 5 || c === 6; });
        put(sx, ty - 1, 3); put(sx, ty + 1, 3);
        if (q % 3 === 0) span(sx, sx, ty - 4, ty + 4, 2, function (c) { return c === 1; });
      }
      for (i = 0; i < 7; i++) {                              // what was being loaded, still there
        var cs2 = side * (OUT0 + 4 + Math.floor(r() * (C - OUT0 - 14)));
        var ct = 10 + Math.floor(r() * (T - 30));
        span(Math.min(cs2, cs2 + 5), Math.max(cs2, cs2 + 5), ct, ct + 9, 15, function (c) { return c === 19; });
      }
    }
    function yardSide(side) {
      var y0 = side * OUT0, y1 = side * (C - 3);
      var lo2 = Math.min(y0, y1), hi2 = Math.max(y0, y1);
      span(lo2, hi2, 8, T - 9, 21);                          // graded gravel yard
      span(side * (C - 2), side * (C - 2), 8, T - 9, 7);     // its own chain-link line
      for (i = 0; i < 12; i++) {                             // relay rail, ties and ballast, stacked
        var ys = side * (OUT0 + 3 + Math.floor(r() * (C - OUT0 - 12)));
        var yt = 12 + Math.floor(r() * (T - 40));
        var lng = 14 + Math.floor(r() * 20);
        span(Math.min(ys, ys + 3), Math.max(ys, ys + 3), yt, yt + lng, 15, function (c) { return c === 21; });
      }
    }
    /* THE BACK LOT. The default frontage, and the one that had to be fixed twice: the
       first draft left it as bare dirt with a few blobs on it, which is 37% of the cell
       reading as nothing. What is actually behind a right-of-way fence in this valley is
       GRADED GROUND that somebody once used — gravel to the chain link, the alignment of
       a spur whose rails were lifted for scrap, rows of relay ties, and tumbleweed packed
       solid against the fence because that is where the wind stops. */
    function lotSide(side) {
      var edge = C - 5;
      for (var q2 = OUT0; q2 <= edge; q2++) {                 // gravel out to the chain link,
        var jag = 3 + Math.floor(r() * 5);                    // with an edge nothing graded straight
        for (var t9 = 0; t9 < T; t9++) {
          if (q2 > edge - ((t9 % 23) < 11 ? jag : 0)) continue;
          put(side * q2, t9, 21, function (c) { return c === 0; });
        }
      }
      span(Math.min(side * (edge + 1), side * (edge + 2)), Math.max(side * (edge + 1), side * (edge + 2)),
           0, T - 1, 7, function (c) { return c === 0 || c === 21; });
      // the alignment of a spur whose rails were lifted for scrap years ago
      var al = side * (OUT0 + 8 + Math.floor(r() * 10));
      span(Math.min(al, al + side * 7), Math.max(al, al + side * 7), 0, T - 1, 1,
           function (c) { return c === 21; });
      for (var t10 = 0; t10 < T; t10 += 3) {
        span(Math.min(al + side, al + side * 6), Math.max(al + side, al + side * 6), t10, t10, 2,
             function (c) { return c === 1; });
      }
      // relay ties and cut rail, stacked in rows the way a section gang stacks them
      for (i = 0; i < 9; i++) {
        var ls = side * (OUT0 + 14 + Math.floor(r() * (C - OUT0 - 24)));
        var lt = 6 + Math.floor(r() * (T - 40));
        var lng2 = 16 + Math.floor(r() * 22);
        span(Math.min(ls, ls + side * 4), Math.max(ls, ls + side * 4), lt, lt + lng2, 15,
             function (c) { return c === 21 || c === 0; });
      }
      // tumbleweed packed against the fence, because that is where the wind stops
      for (var t11 = 0; t11 < T; t11++) {
        if ((t11 % 17) > 12) continue;
        span(Math.min(side * (FEN1 + 1), side * (FEN1 + 3)), Math.max(side * (FEN1 + 1), side * (FEN1 + 3)),
             t11, t11, 16, function (c) { return c === 0 || c === 21; });
      }
      // the graded track everybody drives down the back of the right of way — only on
      // the side that does NOT already have the maintenance road, because two parallel
      // vehicle tracks 20 m apart is not a corridor, it is a car park with weeds
      if (side > 0) {
        var tk = side * (edge - 5);
        span(Math.min(tk, tk + 3), Math.max(tk, tk + 3), 0, T - 1, 6, function (c) { return c === 21 || c === 0; });
      }
    }
    if (front === 'pad') { padSide(1); lotSide(-1); }
    else if (front === 'yard') { yardSide(-1); lotSide(1); }
    else { lotSide(1); lotSide(-1); }

    if (crossing && !curve) layCrossing();     // the road goes through ALL of it, last

    // ---- 5. act-1 DEAD: the train is still on the line -----------------------------
    /* A railway with nothing on it reads as a park path. What makes it a dead railway is
       rolling stock standing exactly where the crew stopped it. A siding is what a train
       gets held on, so every other passing loop has a whole consist standing in it, ten
       cells of it, running on across the boundaries instead of appearing and vanishing
       every 96 m. On the main it is short cuts of cars and, rarely, the unit itself. */
    if (sid.on && sid.m >= 3 && sid.m <= 12 && (sid.run % 2) === 0) {
      for (var t8 = 0; t8 < T; t8++) {
        if ((t8 % 34) >= 30) continue;                       // the gap between two cars
        span(SID_C - 4, SID_C + 4, t8, t8, 10, function (c) { return c === 1 || c === 2 || c === 3; });
      }
    }
    if (((along * 13) % 9) === 0) {
      for (var car = 0; car < 3; car++) {
        var a0 = car * 34 + ((along * 19) % 30) - 6;
        span(TRACK - 4, TRACK + 4, Math.max(0, a0), Math.min(T - 1, a0 + 24), 10,
             function (c) { return c === 1 || c === 2 || c === 3; });
      }
    }
    if (((along * 23) % 31) === 0) {
      span(-TRACK - 5, -TRACK + 5, 40, 96, 11, function (c) { return c === 1 || c === 2 || c === 3; });
    }

    // ---- 6. the small decay: brush in the ditch, sand over the ballast --------------
    for (i = 0; i < 18; i++) {           // brush in the ditch, which is where it actually grows
      var bs = (r() < 0.5 ? -1 : 1) * (DITCH - Math.floor(r() * 3));
      span(bs, bs + 1, Math.floor(r() * T), Math.floor(r() * T) + 2, 16, function (c) { return c === 5; });
    }
    for (i = 0; i < 30; i++) {           // sand drifted over the ballast
      var ds = -BAL + Math.floor(r() * (2 * BAL));
      put(ds, Math.floor(r() * T), 0, function (c) { return (c === 1 || c === 2) && r() < 0.4; });
    }

    return { g: g, W: T, H: T, links: links, cross: cross, siding: sid.on,
             crossing: crossing, curve: !!curve, vert: vert,
             streets: [], gates: [], footprints: [] };
  }

  var PALETTE = {
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#57503f',
    1: '#5a5348', 2: '#4a4038', 3: '#8e8a84', 4: '#6a6152', 5: '#5b5647', 6: '#726853',
    7: '#6b6b74', 8: '#7d7a72', 9: '#6d675c', 10: '#4e4a46', 11: '#43413e', 12: '#3f3f47',
    13: '#a8a08c', 14: '#8f8676', 15: '#585349', 16: '#3a4520', 17: '#8a867e', 18: '#7a7266',
    19: '#6e6a62', 20: '#7a7266', 21: '#7b7263'
  };

  var LEGEND = {
    0:  { name: 'dirt frontage',    kind: 'ground',    act1: 'the wide dirt margin outside the fence, scrap and tag marks and nothing planted' },
    1:  { name: 'ballast',          kind: 'ground',    act1: 'crushed rock ballast prism, weeds coming up through it now' },
    2:  { name: 'tie',              kind: 'ground',    act1: 'creosote sleeper, split and bleached where the sun gets it' },
    3:  { name: 'rail',             kind: 'ground',    act1: 'running rail, still bright on top where the wheels polished it' },
    4:  { name: 'cess',             kind: 'ground',    act1: 'the walking cess beside the ballast, where the track crews went' },
    5:  { name: 'drainage ditch',   kind: 'ground',    act1: 'the right-of-way ditch, dry, full of blown trash' },
    6:  { name: 'service road',     kind: 'drive',     act1: 'the gravel maintenance road that runs the length of the line' },
    7:  { name: 'ROW fence',        kind: 'fence',     act1: 'right-of-way fence, cut open wherever anybody wanted through' },
    8:  { name: 'signal mast',      kind: 'prop',      act1: 'a wayside signal, every lamp dark, facing a train that is not coming' },
    9:  { name: 'relay hut',        kind: 'structure', act1: 'a signal relay hut, door forced, the racks inside stripped for copper' },
    10: { name: 'dead freight car', kind: 'vehicle',   act1: 'a covered hopper standing on the rail exactly where it was left' },
    11: { name: 'dead locomotive',  kind: 'vehicle',   act1: 'a dead road unit on the main, cab doors open, long hood gone dull' },
    12: { name: 'crossing pavement',kind: 'drive',     act1: 'the crossing panels and the road surface through the right of way' },
    13: { name: 'crossing marking', kind: 'marking',   act1: 'the crossing X and the stop bar, worn down to ghosts' },
    14: { name: 'gate arm',         kind: 'prop',      act1: 'a crossing gate arm still down across the road, flashers dead' },
    15: { name: 'scrap pile',       kind: 'prop',      act1: 'relay rail, ties and cut steel stacked on the frontage' },
    16: { name: 'dead brush',       kind: 'tree-dead', act1: 'tumbleweed packed into the ditch and against the fence' },
    17: { name: 'turnout',          kind: 'ground',    act1: 'the point blades where the siding comes off the main' },
    18: { name: 'mile post',        kind: 'prop',      act1: 'a mile post, the number still legible if you get close' },
    19: { name: 'loading pad',      kind: 'drive',     act1: 'the concrete team-track pad, stained where the forklifts worked it' },
    20: { name: 'dock wall',        kind: 'building',  act1: 'the loading dock and the blank back wall of the shed behind it' },
    21: { name: 'material yard',    kind: 'ground',    act1: 'the graded yard where the railway keeps its own steel, gate hanging open' }
  };

  var NOTES = {
    summary: 'The Union Pacific mainline: a two-track ballast prism with a passing siding every mile and a half, wayside signals, a maintenance road and a right-of-way fence, meeting the street grid at 17 real at-grade crossings and passing UNDER the freeways. Act-1 dead means the train never left.',
    reference: [
      'The UP line through the valley is why Las Vegas exists: it was a railroad water stop before it was a town, and the line still runs the full length of the map on column 54.',
      'Two-track mainline at about 4.5 m centres on a raised ballast prism, cess either side, drainage ditch, a maintenance road on ONE side, right-of-way fence, then wide dirt frontage.',
      'Long passing sidings so opposing trains can meet, peeling off through point blades and rejoining a mile or more later.',
      'At-grade crossings on the surface streets: crossing panels through the rails, stop bar, the painted X, gate arms and flashers. Grade separation at the freeways: the interstate bridges over.'
    ],
    layout: [
      'Ballast prism 0 to 10 out from the centreline with the two tracks at plus and minus 5; cess to 16; ditch to 20; maintenance road 21 to 28 on ONE side only; fence at 30 to 31; dirt frontage out to the cell edge.',
      'A NETWORK TILE: it takes the neighbours that are also rail as its own continuation, and the neighbours that are street as what crosses it at grade.',
      'The siding is keyed off the CELL COORDINATE and not the cell seed, so it runs continuously for 16 cells and then stops, instead of flickering on and off every 96 m.',
      'A cell whose links are perpendicular sweeps the track through a quarter arc. Column 54 is dead straight in this seed so nothing uses it yet, but a corridor generator that cannot turn is a trap for the next map.'
    ],
    circulation: 'On foot the corridor is crossable everywhere except through the fence, the relay huts and the standing rolling stock: ballast is rough going and the ditch is a step down, but nothing blocks. For vehicles there are exactly two surfaces, and that is the point of a railway: the maintenance road down one side, and the 17 at-grade crossings where the street grid gets through. The freeways do not cross here at all, they bridge over, and the corridor runs under them.',
    layering: 'GROUND: ballast (1), ties (2), rails (3), cess (4), ditch (5), turnout (17), crossing pavement (12), crossing markings (13), dirt frontage (0). GROUND (drive): the service road (6) and the crossing (12). STRUCTURE (solid): relay hut (9), ROW fence (7). PROPS (solid): signal mast (8), gate arm (14), scrap pile (15), mile post (18), and the dead rolling stock (10, 11). OVERHEAD: none in a rail cell — the overhead is in the FREEWAY cell that bridges over it. PORTALS: none; a relay hut is a prop, not a room.',
    decisions: [
      'Paolo 7/26: "we need to actually build a fucking world." 90 cells of flat grey down the spine of the map is not a world.',
      'SURFACE, not district: nobody bases a faction on a railway until Paolo rules the corridor is claimable ground.',
      'A rail corridor is deliberately NOT built out of the arterial vocabulary. No lanes, no median, no sidewalk, no intersections. The only paint on the whole line is at the crossings.',
      'The line stays CONTINUOUS through the freeway cells: bohemia_freeway.js carries the ballast and rails UNDER its deck wherever a rail cell is on the other side, so the mainline is one line for the whole valley instead of three severed pieces.',
      'CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in rail_gate.js.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('rail', {
    generate: generate, body: function (c) { return c === 9; },
    category: K.category('rail') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, sidingAt: sidingAt,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES,
              BAL: BAL, TRACK: TRACK, C: C };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaRail = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
