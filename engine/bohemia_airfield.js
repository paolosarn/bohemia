// BOHEMIA AIRFIELD (7/26/26, WORLD lane) — THE RUNWAY, BUILT ACROSS ITS WHOLE FIELD.
//
// The last big flat thing in the valley: 40 airport cells and 54 airbase cells, 94 in
// all, every one of them a grey square. This builds both from one generator, because a
// commercial field and a military one are the same anatomy with different buildings on
// it.
//
// WHY THIS ONE IS DIFFERENT FROM EVERY OTHER GENERATOR HERE. A runway is three
// kilometres long. A cell is 96 metres. So an airfield is not a cell that happens to
// contain an airport, it is a BLOB of cells with one runway lying across all of them,
// and a per-cell generator physically cannot draw it: you would get thirty little
// runway stubs that stop at every property line. The world model hands each cell the
// BOUNDS OF ITS OWN CLUSTER (bohemia_world.js clusterBoundsOf), the runway is laid in
// valley coordinates against those bounds, and every cell of the field draws its slice
// of the same line. That is why it arrives in the next cell exactly where it left this
// one.
//
// REAL REFERENCE (McCarran/Harry Reid and Nellis, which are the two in this valley):
//   runway 45 m wide with a painted centreline, threshold bars, touchdown-zone stripes
//     and aiming points, paved shoulders and a blast pad at each end
//   a full-length PARALLEL TAXIWAY, connected to the runway by angled links
//   the APRON off the taxiway: stands, lead-in lines, jet bridges at a terminal, or
//     revetments and alert pads at a base
//   the LANDSIDE row: terminal + garages at an airport, hangars + ops at a base
//   the whole thing inside a perimeter fence with a service road inside it
//   act-1 dead: the aircraft never left. They sit on the stands with the doors open.
//
// LAWS: SURFACE not district (nobody bases a faction on a runway until Paolo rules an
// airfield is claimable ground). LINE COLOR is a street law and does not reach here:
// airfield markings are their own vocabulary, and this uses white for the runway and
// amber only for the taxiway centreline, which is exactly what the real ones do.
// WALKABLE-LAND: vehicular:true, and it is the truest case of it in the whole game.
// CONSTITUTION: every palette entry sits in its layer's value band, gated.
//
// LEGEND:
//  0 dead ground   1 runway         2 runway marking  3 shoulder     4 taxiway
//  5 taxi centre   6 apron          7 stand marking   8 terminal      9 hangar
// 10 jet bridge   11 dead airliner 12 dead fighter   13 perimeter fence
// 14 service road 15 light mast    16 blast pad      17 revetment
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var T = 128;

  /* THE ANATOMY IS A FRACTION OF THE FIELD, NOT A FIXED NUMBER. The first version used
     fixed offsets off one centreline and left the whole north half of the airbase as
     bare dirt: that field is 768 tiles across and a fixed cross-section only dressed
     300 of them. A real field uses all its land, and the big ones have TWO parallel
     runways (both fields in this valley do). So every band below is a share of the
     field's width, which also means a small strip and a big international lay out
     correctly out of the same code. */
  var BANDS = { runwayA: 0.17, runwayB: 0.40, taxi1: 0.28, taxi2: 0.51,
                apron0: 0.58, apron1: 0.79, row0: 0.81, row1: 0.89, road: 0.92, fence: 0.96 };

  function generate(seed, opts) {
    opts = opts || {};
    var kind = opts.kind === 'airbase' ? 'airbase' : 'airport';
    var cx = (opts.cellX || 0) * T, cy = (opts.cellY || 0) * T;
    var b = opts.bounds || { x0: opts.cellX || 0, x1: opts.cellX || 0,
                             y0: opts.cellY || 0, y1: opts.cellY || 0, cells: 1 };

    var fx0 = b.x0 * T, fx1 = (b.x1 + 1) * T - 1;
    var fy0 = b.y0 * T, fy1 = (b.y1 + 1) * T - 1;
    var wide = (fx1 - fx0) >= (fy1 - fy0);            // true: the runway runs east-west
    var acr0 = wide ? fy0 : fx0, acr1 = wide ? fy1 : fx1;
    var A0 = wide ? fx0 : fy0, A1 = wide ? fx1 : fy1;   // along-field extent
    var width = acr1 - acr0 + 1, length = A1 - A0 + 1;
    var at = function (f) { return Math.round(acr0 + width * f); };

    /* A field under about three cells across cannot hold the full anatomy. It becomes
       a general-aviation strip: one runway, one taxiway, hangars beside it. Which is
       exactly what a small field IS, not a degraded big one. */
    var small = width < 380 || length < 380;
    var runA   = small ? at(0.28) : at(BANDS.runwayA);
    var runB   = (!small && width > 620) ? at(BANDS.runwayB) : null;
    var taxi1  = small ? at(0.50) : at(BANDS.taxi1);
    var taxi2  = runB ? at(BANDS.taxi2) : null;
    var apron0 = small ? at(0.58) : at(BANDS.apron0);
    var apron1 = small ? at(0.78) : at(BANDS.apron1);
    var row0   = small ? at(0.80) : at(BANDS.row0);
    var row1   = small ? at(0.90) : at(BANDS.row1);
    var roadAt = small ? at(0.93) : at(BANDS.road);
    var RUN_HALF = Math.max(12, Math.min(30, Math.round(width * 0.045)));
    var SHOULDER = Math.max(4, Math.round(RUN_HALF * 0.34));
    var TAXI_HALF = Math.max(6, Math.round(RUN_HALF * 0.5));

    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd, x, y, i;

    // ACROSS = position across the field, ALONG = position down it, both in VALLEY
    // tiles. That is the whole trick: a cell is just a window onto the field.
    var runs = runB === null ? [runA] : [runA, runB];
    function bandCodeAt(across) {
      for (var i2 = 0; i2 < runs.length; i2++) {
        var d = Math.abs(across - runs[i2]);
        if (d <= RUN_HALF) return 1;
        if (d <= RUN_HALF + SHOULDER) return 3;
      }
      if (Math.abs(across - taxi1) <= TAXI_HALF) return 4;
      if (taxi2 !== null && Math.abs(across - taxi2) <= TAXI_HALF) return 4;
      if (across >= apron0 && across <= apron1) return 6;
      if (across >= row0 && across <= row1) return kind === 'airport' ? 8 : 9;
      if (across >= roadAt && across <= roadAt + 5) return 14;
      return 0;
    }
    for (y = 0; y < T; y++) {
      var gy = cy + y;
      for (x = 0; x < T; x++) g[y][x] = bandCodeAt(wide ? gy : cx + x);
    }

    function paint(a0, a1, c0, c1, code, over) {
      for (var yy = 0; yy < T; yy++) {
        var gy2 = cy + yy;
        for (var xx = 0; xx < T; xx++) {
          var gx2 = cx + xx;
          var ac = wide ? gy2 : gx2, al = wide ? gx2 : gy2;
          if (al < a0 || al > a1 || ac < c0 || ac > c1) continue;
          if (over && !over(g[yy][xx])) continue;
          g[yy][xx] = code;
        }
      }
    }
    var onRunway = function (c) { return c === 1; };
    var onApron = function (c) { return c === 6; };

    // ---- runway markings, in valley coordinates, so they never repeat per cell ----
    runs.forEach(function (rc) {
      for (var al = A0; al <= A1; al++) {                       // centreline, 30 on 20 off
        if ((al % 50) >= 30) continue;
        paint(al, al, rc - 1, rc + 1, 2, onRunway);
      }
      [A0 + 20, A1 - 44].forEach(function (thr) {               // threshold bars
        for (var k = -RUN_HALF + 3; k <= RUN_HALF - 6; k += 7) {
          paint(thr, thr + 24, rc + k, rc + k + 2, 2, onRunway);
        }
      });
      [A0 + 120, A1 - 150, A0 + 200, A1 - 230].forEach(function (tdz) {
        if (tdz < A0 || tdz > A1) return;
        [-16, 12].forEach(function (k) { paint(tdz, tdz + 28, rc + k, rc + k + 3, 2, onRunway); });
      });
      paint(A0, A0 + 12, rc - RUN_HALF, rc + RUN_HALF, 16, function (c) { return c === 1 || c === 3; });
      paint(A1 - 12, A1, rc - RUN_HALF, rc + RUN_HALF, 16, function (c) { return c === 1 || c === 3; });
    });

    // taxiway amber centreline, and the angled links out to the runway
    [taxi1, taxi2].forEach(function (tc) {
      if (tc === null) return;
      for (var al2 = A0; al2 <= A1; al2++) paint(al2, al2, tc - 1, tc + 1, 5, function (c) { return c === 4; });
    });
    for (var link = A0 + 150; link < A1 - 90; link += 400) {
      paint(link, link + 24, Math.min(runA, taxi1), Math.max(runA, taxi1), 4,
            function (c) { return c === 0 || c === 3; });
    }

    // ---- the apron: lead-in lines, and the aircraft that never left ---------------
    for (var st = A0 + 90; st < A1 - 120; st += 150) {
      paint(st, st + 2, apron0 + 6, apron1 - 4, 7, onApron);
      if (kind === 'airport') {
        paint(st + 10, st + 62, apron1 - 40, apron1 - 10, 11, onApron);
        paint(st + 30, st + 36, apron1 - 9, apron1, 10, onApron);
      } else {
        paint(st + 8, st + 30, apron1 - 36, apron1 - 18, 12, onApron);
        paint(st - 6, st + 44, apron1 - 44, apron1 - 41, 17, onApron);
        paint(st - 6, st + 44, apron1 - 13, apron1 - 10, 17, onApron);
      }
    }

    // an airbase's landside is separate hangars, not one continuous terminal
    if (kind === 'airbase') {
      for (var hg = A0; hg <= A1; hg++) {
        if ((hg % 190) < 120) continue;
        paint(hg, hg, row0, row1, 0, function (c) { return c === 9; });
      }
    }

    // ---- the perimeter fence, on the boundary of the FIELD, not of the cell -------
    var fOut = at(BANDS.fence), fIn = at(0.03);
    paint(A0, A1, fOut, fOut + 1, 13, function () { return true; });
    paint(A0, A1, fIn, fIn + 1, 13, function (c) { return c === 0; });
    [A0, A1 - 1].forEach(function (end) {
      paint(end, end + 1, fIn, fOut, 13, function (c) { return c !== 1 && c !== 16; });
    });

    // ---- floodlight masts down the apron edge, dark like everything else ----------
    for (var lm = A0 + 70; lm < A1 - 40; lm += 190) paint(lm, lm + 1, apron0 + 2, apron0 + 3, 15, onApron);

    // ---- honest decay: sand drifted across the pavement --------------------------
    for (i = 0; i < 40; i++) {
      var px = Math.floor(r() * T), py = Math.floor(r() * T);
      var c3 = g[py][px];
      if ((c3 === 1 || c3 === 4 || c3 === 6) && r() < 0.35) g[py][px] = 0;
    }

    return { g: g, W: T, H: T, kind: kind, bounds: b, wide: wide, small: small,
             runways: runs.length, streets: [], gates: [], footprints: [] };
  }

  function runwayFraction(res) {
    var n = 0;
    res.g.forEach(function (row) { row.forEach(function (v) { if (v === 1 || v === 2) n++; }); });
    return n / (T * T);
  }

  var PALETTE = {
    1: '#4a4a52', 2: '#b3ab97', 3: '#3f3f47', 4: '#50505a', 5: '#a08a3a', 6: '#565660',
    7: '#a8a08c', 8: '#7a7266', 9: '#6a6a72', 10: '#8a8a92', 11: '#8f8f97', 12: '#5c6152',
    13: '#6b6b74', 14: '#44444c', 15: '#8f8676', 16: '#3a3a42', 17: '#6f6a5e'
  };

  var LEGEND = {
    0:  { name: 'dead ground',    kind: 'ground',    act1: 'the graded infield between the pavements, gone to dust and weeds' },
    1:  { name: 'runway',         kind: 'drive',     act1: 'grooved runway concrete, rubber-streaked at the touchdown zones' },
    2:  { name: 'runway marking', kind: 'marking',   act1: 'centreline, threshold bars and touchdown stripes, chalky and worn' },
    3:  { name: 'paved shoulder', kind: 'drive',     act1: 'the asphalt shoulder either side of the runway, sand drifting over it' },
    4:  { name: 'taxiway',        kind: 'drive',     act1: 'the full-length parallel taxiway and its angled links' },
    5:  { name: 'taxi centreline',kind: 'marking',   act1: 'the amber taxiway centreline, the one warm line on the whole field' },
    6:  { name: 'apron',          kind: 'drive',     act1: 'the apron, oil-stained where the stands were' },
    7:  { name: 'stand marking',  kind: 'marking',   act1: 'a lead-in line to a parking stand nobody is coming to' },
    8:  { name: 'terminal',       kind: 'building',  act1: 'the terminal block, glass dead dark, every door standing open' },
    9:  { name: 'hangar',         kind: 'building',  act1: 'a hangar, doors half open on nothing' },
    10: { name: 'jet bridge',     kind: 'overhead',  act1: 'a jet bridge still docked to an aeroplane that never pushed back' },
    11: { name: 'dead airliner',  kind: 'vehicle',   act1: 'an airliner on the stand, doors open, slides deployed and rotted' },
    12: { name: 'dead fighter',   kind: 'vehicle',   act1: 'a fighter on the pad, canopy up, tyres flat' },
    13: { name: 'perimeter fence',kind: 'fence',     act1: 'the field perimeter fence, barbed top, cut through in places' },
    14: { name: 'service road',   kind: 'drive',     act1: 'the perimeter service road inside the fence' },
    15: { name: 'light mast',     kind: 'prop',      act1: 'an apron floodlight mast, every head dark' },
    16: { name: 'blast pad',      kind: 'ground',    act1: 'the chevroned blast pad off the runway threshold' },
    17: { name: 'revetment',      kind: 'structure', act1: 'a concrete blast revetment around an alert pad' }
  };

  var NOTES = {
    summary: 'The airfield, built across its whole cluster instead of per cell: one runway with real markings, a full-length parallel taxiway, an apron of stands, a landside row of terminal or hangars, all inside a perimeter fence, with the aircraft still sitting where they stopped.',
    reference: [
      'Harry Reid and Nellis, the two fields in this valley: 45 m runway with centreline, threshold bars, touchdown-zone stripes and blast pads; a full-length parallel taxiway joined by angled links; an apron of stands off it; the landside row (terminal and garages, or hangars and ops); a perimeter fence with a service road inside it.',
      'A runway is three kilometres long and a cell is 96 metres, so the field is a BLOB of cells with one runway across all of them.',
      'Amber is the taxiway centreline colour on a real field, and it is the only warm line out there.'
    ],
    layout: [
      'The world model hands every cell of a field the BOUNDS OF ITS CLUSTER, and the runway is laid in valley coordinates against those bounds, so each cell draws its slice of one continuous line and the markings never repeat per cell.',
      'Cross-section from the centreline out: runway, paved shoulder, infield, parallel taxiway, apron with stands, landside row, service road, perimeter fence.',
      'The field lies along its long axis, so a wide cluster gets an east-west runway and a tall one gets north-south.',
      'An airport parks dead airliners with jet bridges still docked; an airbase parks fighters between concrete revetments.'
    ],
    circulation: 'Every pavement on the field connects: runway to shoulder to link taxiway to the parallel taxiway to the apron to the service road, which runs the length of the fence line. It is one enormous drivable surface, which is what makes an airfield worth having in a world with vehicles. On foot it is crossable everywhere except through the fence, the revetments and the buildings.',
    layering: 'GROUND (drive): runway (1), shoulder (3), taxiway (4), apron (6), service road (14), blast pad (16), dead ground (0), and every marking (2, 5, 7). STRUCTURE (solid): terminal (8), hangar (9), revetment (17), fence (13). PROPS (solid): light mast (15), dead airliner (11), dead fighter (12). OVERHEAD (pass under): the jet bridge (10). PORTALS: none yet; terminal and hangar interiors are a CITY-lane item when someone wants inside.',
    decisions: [
      'Paolo 7/26: build the world. This is the last big flat thing in it, 94 cells.',
      'SURFACE, not district: nobody bases a faction on a runway until Paolo rules that an airfield is claimable ground. Promoting it later is one line plus a re-verified placement pass.',
      'Built across the CLUSTER, not the cell. A per-cell airport would have been thirty runway stubs, and that is the kind of thing that reads as fake instantly from the map.',
      'CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in airfield_gate.js.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  ['airport', 'airbase'].forEach(function (t) {
    K.register(t, {
      generate: function (seed, o) {
        o = o || {}; o.kind = o.kind || t; return generate(seed, o);
      },
      body: function (c) { return c === 8 || c === 9; },
      category: K.category(t) || 'infrastructure',
      palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
    });
  });

  var API = { generate: generate, runwayFraction: runwayFraction,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaAirfield = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
