// BOHEMIA INTERCHANGE (7/27/26, WORLD lane) — THE STACK, BUILT ACROSS ALL SIXTEEN OF
// ITS CELLS.
//
// 16 valley cells are `interchange`, and they are not sixteen separate things: they are
// ONE four-by-four block at x50-53, y19-22 where the north-south interstate crosses the
// east-west one. In the real valley that is the Spaghetti Bowl, and it is the single
// biggest man-made object in the city. Sixteen grey squares is the worst possible
// rendering of it, because an interchange is nothing BUT its geometry.
//
// SAME TRICK AS THE AIRFIELD, AND FOR THE SAME REASON. A directional flyover is 300 m
// of continuous curve and a cell is 96 m, so no per-cell generator can draw one: you
// get sixteen disconnected arcs that stop at every property line. The world model hands
// every cell of the block the BOUNDS OF ITS CLUSTER (bohemia_world.js clusterBoundsOf)
// and the APPROACHES (which columns and rows the interstate actually arrives on), the
// whole interchange is solved in valley coordinates against those, and each cell draws
// its own 128x128 window onto it. There is no per-cell buffer at all — every tile is a
// pure function of its valley position, which is what makes the seams exact by
// construction instead of by luck.
//
// REAL REFERENCE (I-15 / US-95, and what a big four-level stack is made of):
//   the two mainlines cross, one at grade and one on a DECK carried on centre piers
//   in each of the four quadrants, TWO ramps: a tight direct connector that hugs the
//     inside corner at grade, and a long directional FLYOVER that sweeps wide and
//     rides over both mainlines on its own structure
//   gore-point striping where every ramp leaves and rejoins, and a painted nose
//   the INFIELD: the unreachable weedy ground inside the ramps, with the drainage
//     retention basin the whole thing sheds into
//   sound walls on the outside, because a stack is dropped into a neighbourhood
//   act-1 dead: the ramps are where the jam was worst. Nothing on them ever moved.
//
// LAWS HELD: SURFACE not district. LINE COLOR: white only, exactly as the freeway — the
// barrier separates opposing directions, never paint. WALKABLE-LAND: vehicular:true and
// the truest case of it after the airfield, and the infield is still dressed, never a
// void. LAYERING: every deck is a real OVERHEAD tile on solid piers, so the two-level
// truth is in the data. CONSTITUTION: every palette entry inside its layer's value band.
//
// LEGEND (0-15 are the FREEWAY's own codes, deliberately, so the two read as one road):
//  0 infield dirt   1 travel lane   2 white lane line  3 shoulder    4 median barrier
//  5 guardrail      6 embankment    7 dead brush       8 sound wall  9 high-mast light
// 10 dead car      11 dead semi    12 deck            13 pier       14 sign gantry
// 15 debris        16 ramp lane    17 ramp shoulder   18 gore marking
// 19 retention basin  20 maintenance road
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);
  var N = (typeof module !== 'undefined') ? require('./bohemia_terrain_noise.js')
        : (typeof BohemiaTerrainNoise !== 'undefined' ? BohemiaTerrainNoise : root.BohemiaTerrainNoise);

  var T = 128;
  // the mainline cross-section is the FREEWAY's, tile for tile, so a carriageway arrives
  // out of the neighbouring freeway cell without a step at the seam
  var BARRIER = 1, INSHLD = 3, LANES = 23, OUTSHLD = 28, GRAIL = 30;
  var LANE_LINES = [8, 13, 18], EDGE = 23;
  var RAMP = 4, RAMP_SH = 7;          // half-widths: two-lane ramp, then its shoulders

  function bandOf(d) {
    if (d <= BARRIER) return 4;
    if (d <= INSHLD) return 3;
    if (d <= LANES) return 1;
    if (d <= OUTSHLD) return 3;
    if (d <= GRAIL) return 5;
    return null;
  }
  var CARRIAGE = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 };

  /* THE FIELD SEED COMES FROM THE BLOCK, NEVER FROM THE CELL. Every cell of a cluster
     arrives here with its OWN cell seed, so anything noise-driven keyed on it would give
     sixteen different infields that disagree along every internal boundary — which is
     precisely what the seam check caught the first time it ran. Derived from the bounds,
     all sixteen cells solve the identical field and the seams are exact by construction. */
  function fieldSeed(b) {
    return (Math.imul(b.x0, 73856093) ^ Math.imul(b.y0, 19349663) ^
            Math.imul(b.x1, 83492791) ^ Math.imul(b.y1, 40503431)) >>> 0;
  }

  /* solve() is the whole interchange as ONE PURE FUNCTION of valley position. generate()
     is just a window onto it. Exported so the gate can prove there is no per-cell state
     anywhere in this module rather than inferring it from how the seams happen to look. */
  function solve(seed, opts) {
    opts = opts || {};
    var b = opts.bounds || { x0: opts.cellX || 0, x1: opts.cellX || 0,
                             y0: opts.cellY || 0, y1: opts.cellY || 0, cells: 1 };
    var FS = fieldSeed(b);
    var BX0 = b.x0 * T, BX1 = (b.x1 + 1) * T - 1;
    var BY0 = b.y0 * T, BY1 = (b.y1 + 1) * T - 1;

    /* THE APPROACHES ARE NOT GUESSED. The world model looks at which cells around the
       block are actually freeway and hands over their columns and rows, so the ramps
       land on the real interstate instead of on a symmetry assumption. With nothing
       handed over (a lone cell, a gate calling this directly) it falls back to the
       middle of the block, which is where a single-cell junction belongs anyway. */
    var ap = opts.approach || {};
    function centres(cells, lo, hi) {
      var out = (cells || []).map(function (c) { return c * T + T / 2; });
      if (!out.length) {
        var mid = (lo + hi) / 2, span = hi - lo + 1;
        out = span > 2 * T ? [mid - T / 2, mid + T / 2] : [mid];
      }
      return out.sort(function (p, q) { return p - q; });
    }
    var ns = centres(ap.ns, BX0, BX1);      // north-south carriageway centres (x)
    var ew = centres(ap.ew, BY0, BY1);      // east-west carriageway centres (y)

    var minSpan = Math.min(BX1 - BX0 + 1, BY1 - BY0 + 1);
    /* THE JUNCTION ENVELOPE. Two parallel carriageways per road (that is how the overmap
       lays an interstate: two cells wide), so a ramp is not tangent to a line, it is
       tangent to the OUTSIDE of a corridor 190 tiles across. Getting this wrong was the
       first version's whole failure: radii picked off the axis spacing put every ramp
       INSIDE the mainline it was supposed to leave, and 8 ramps rendered as 0.9% of the
       block. The radii come off the envelope now, so they clear it. */
    var jcx = (ns[0] + ns[ns.length - 1]) / 2, jcy = (ew[0] + ew[ew.length - 1]) / 2;
    var nsHalf = (ns[ns.length - 1] - ns[0]) / 2 + GRAIL;
    var ewHalf = (ew[ew.length - 1] - ew[0]) / 2 + GRAIL;
    var room = Math.min((BX1 - BX0 + 1) / 2 - nsHalf, (BY1 - BY0 + 1) / 2 - ewHalf);
    var R1 = Math.max(40, Math.round(room * 0.95));                 // tight direct connector
    var R2 = Math.max(R1 + 60, Math.round(nsHalf + ewHalf + room * 0.6));  // directional flyover

    /* THE EIGHT RAMPS. One tight and one wide in each of the four quadrants. The tight
       one leaves the outside lane of each mainline and hugs the corner at grade; the
       wide one is tangent to the FAR side of both corridors, which is exactly why it has
       to sweep across the whole junction and ride over it on its own structure. */
    var arcs = [];
    var MERGE = 15;                                   // where a ramp meets a carriageway
    [-1, 1].forEach(function (qx) {
      [-1, 1].forEach(function (qy) {
        var nx = jcx + qx * (nsHalf - MERGE), nyv = jcy + qy * (ewHalf - MERGE);
        arcs.push({ cx: nx + qx * R1, cy: nyv + qy * R1, R: R1, qx: qx, qy: qy, fly: false });
        var fx2 = jcx - qx * (nsHalf - MERGE), fy2 = jcy - qy * (ewHalf - MERGE);
        arcs.push({ cx: fx2 + qx * R2, cy: fy2 + qy * R2, R: R2, qx: qx, qy: qy, fly: true });
      });
    });
    function arcHit(gx, gy, a) {
      if ((gx - a.cx) * a.qx > 0 || (gy - a.cy) * a.qy > 0) return null;   // wrong quadrant
      var dd = Math.sqrt((gx - a.cx) * (gx - a.cx) + (gy - a.cy) * (gy - a.cy));
      var d = Math.abs(dd - a.R);
      if (d > RAMP_SH) return null;
      // u = distance travelled ALONG the arc, which is what spaces the piers evenly
      var u = Math.abs(Math.atan2(gy - a.cy, gx - a.cx)) * a.R;
      return { band: d <= RAMP ? 16 : 17, fly: a.fly, edge: d > RAMP, u: u };
    }
    // inside the junction envelope a flyover is ALWAYS elevated: it comes down outside it
    function inEnvelope(gx, gy) {
      return Math.abs(gx - jcx) <= nsHalf || Math.abs(gy - jcy) <= ewHalf;
    }

    function nearest(v, list) {
      var best = 1e9, at = 0;
      for (var i = 0; i < list.length; i++) {
        var d = Math.abs(v - list[i]);
        if (d < best) { best = d; at = list[i]; }
      }
      return { d: best, at: at };
    }

    // ---- one tile, solved from its VALLEY position and nothing else ---------------
    function codeAt(gx, gy) {
      if (gx < BX0 || gx > BX1 || gy < BY0 || gy > BY1) return 0;
      var dn = nearest(gx, ns), de = nearest(gy, ew);
      var vBand = bandOf(dn.d), hBand = bandOf(de.d);
      var onNS = vBand !== null, onEW = hBand !== null;

      var code;
      if (onEW && onNS) {
        // the east-west mainline rides OVER the north-south one on a deck. Piers stand
        // in the north-south median and on its shoulders, never in a live lane.
        var pier = (dn.d <= BARRIER || (dn.d >= OUTSHLD - 1 && dn.d <= GRAIL)) &&
                   (Math.abs(gy - de.at) % 24) < 3;
        code = pier ? 13 : (hBand === 5 ? 12 : 12);
      } else if (onEW) code = hBand;
      else if (onNS) code = vBand;
      else code = null;

      // the ramps
      var hit = null;
      for (var i = 0; i < arcs.length; i++) {
        var h2 = arcHit(gx, gy, arcs[i]);
        if (!h2) continue;
        if (!hit || h2.band < hit.band || (h2.band === hit.band && h2.fly)) hit = h2;
      }
      if (hit) {
        if (hit.fly && inEnvelope(gx, gy)) {
          // over the whole junction on its own structure, on piers spaced along the arc
          code = (hit.edge && (Math.floor(hit.u) % 30) < 4 && code !== 1 && code !== 2) ? 13 : 12;
        } else if (code === null || code === 4 || code === 5 || code === 6) {
          code = hit.band;                                    // at grade: infield, or merging in
        }
      }

      if (code !== null) {
        // white edge and lane lines, on the mainlines only (a ramp is a single stream)
        if (code === 1) {
          /* OFF BY HALF A TILE, AND SO NO FREEWAY IN THE VALLEY HAD A LANE LINE ON IT (8/25).
             This test was right in every way except one: it compared a DISTANCE to whole
             numbers. The mainline centre of a 128-tile cell is 63.5 -- it lands between two
             tiles, because an even span has no middle tile -- so every offset it produces is
             3.5, 8.5, 13.5, 22.5. `offV === 23` and `LANE_LINES.indexOf(8.5)` can never be
             true, not once, on any cell, since the day this was written. Measured: 2,255
             travel-lane tiles in one junction and ZERO code 2, with the histogram of offsets
             coming out entirely in halves. dead_code_gate found it as a dead legend row.
             THE OFFSET IS NOW A TILE INDEX, not a distance: floor() gives the same answer when
             a centre is a whole number and the right one when it is a half, so this works
             either way and nobody has to know which parity a junction happened to get.
             AND THE EDGE LINE IS DERIVED, NOT A CONSTANT. `EDGE = 23` only ever matched an
             integer centre. The edge line is the last lane before the shoulder -- which is
             exactly "the next tile out is not a lane" -- so ask bandOf that question instead of
             hard-coding the answer for one parity. */
          var offV = onNS ? Math.abs(gx - dn.at) : -1, offH = onEW ? Math.abs(gy - de.at) : -1;
          var dashV = (Math.floor((gy % 14) / 7) === 0), dashH = (Math.floor((gx % 14) / 7) === 0);
          if ((offV >= 0 && bandOf(offV + 1) !== 1) || (offH >= 0 && bandOf(offH + 1) !== 1)) return 2;
          if (offV >= 0 && LANE_LINES.indexOf(Math.floor(offV)) >= 0 && dashV) return 2;
          if (offH >= 0 && LANE_LINES.indexOf(Math.floor(offH)) >= 0 && dashH) return 2;
        }
        /* THE SIGN GANTRIES (code 14), authored in this legend and never once placed -- the
           other dead row dead_code_gate found here. They are the thing that tells you from a
           mile away that a junction is coming, and on a dead freeway they are the thing whose
           panels are gone: the frame still spans the road and the green boards that said where
           you were going have been taken down, blown out or left hanging.
           OVERHEAD, so you drive and walk UNDER them exactly like the deck -- which is also why
           adding them cannot strand a lane: the kit conducts a path through an overhead.
           Spaced 210 tiles, about 158 m, across the whole carriageway including the shoulders,
           and only where a mainline runs AT GRADE -- over the crossing the road is already a
           deck, and you do not hang a gantry under a bridge. Solved from valley coordinates
           like everything else in this module, so a gantry lands in the same place no matter
           which cell you are standing in. */
        if ((code === 1 || code === 2 || code === 3) && (onNS !== onEW)) {
          var along = onNS ? gy : gx;
          if ((((along % 210) + 210) % 210) < 2) return 14;
        }
        // gore striping where a ramp's shoulder runs alongside a carriageway
        if (code === 17 && (onNS || onEW)) return 18;
        return code;
      }

      /* ---- THE INFIELD. The ground inside the ramps that nobody can legally reach, and
         the second thing this module had to be fixed for: at 33% flat dirt it read as a
         void, which is exactly what the WALKABLE-LAND law is about. What is really in
         there is GRADED ground — decomposed-granite slopes shaped by the earthwork, the
         retention basins the whole structure sheds into, the ring track the crews used
         to reach them, riprap around the outfalls, and waist-high dry brush over all of
         it because it has not been touched since the day it stopped. */
      var fx = (gx - BX0) / (BX1 - BX0 + 1), fy = (gy - BY0) / (BY1 - BY0 + 1);
      if (fx < 0.012 || fx > 0.988 || fy < 0.012 || fy > 0.988) return 8;   // perimeter sound wall
      // the wall track: every sound wall in the valley has one running inside it, for the
      // wall itself and for the drainage. It also does the job of breaking the infield
      // into reachable pieces instead of one continuous slab of nothing.
      var ring = Math.min(fx, 1 - fx, fy, 1 - fy);
      if (ring > 0.030 && ring < 0.038) return 20;

      var basins = [[0.20, 0.80, 0.115], [0.80, 0.22, 0.075]];
      for (var bi = 0; bi < basins.length; bi++) {
        var bx = BX0 + (BX1 - BX0) * basins[bi][0], by = BY0 + (BY1 - BY0) * basins[bi][1];
        var bd = Math.sqrt((gx - bx) * (gx - bx) + (gy - by) * (gy - by));
        var bw = minSpan * basins[bi][2] * (0.85 + 0.3 * N.value(FS ^ 0x51ed, gx, gy, 40));
        if (bd < bw) return 19;
        if (bd < bw + 4) return 15;                                          // riprap on the lip
        if (Math.abs(bd - (bw + minSpan * 0.055)) < 3.5) return 20;          // the ring track
      }
      /* PATCHES, NOT CONFETTI, AND NOT CONTINENTS EITHER. Tight high-octave noise
         stippled the infield, which the constitution bans outright (act 1 does not
         dither). Widening it to a fractal stack then went the other way: fbm pulls
         toward its own mean, so at block scale one whole quadrant came out below the
         threshold and another entirely above, and a corner cell went 59% flat dirt.
         Single-octave value noise at a real feature size is the answer: full range,
         smooth edges, patches you could walk between. */
      if (N.value(FS ^ 0x9a71, gx, gy, 26) > 0.58) return 7;                 // dry brush
      if (N.value(FS ^ 0x3e07, gx, gy, 15) > 0.86) return 15;                // gravel stockpiles
      // two fields at different sizes, averaged: the coarse one shapes the earthwork, the
      // finer one keeps the bare ground from ever forming one big connected slab
      return (N.value(FS ^ 0x2c19, gx, gy, 33) + N.value(FS ^ 0x5b41, gx, gy, 11)) / 2 > 0.34 ? 6 : 0;
    }

    /* ACT-1 DEAD, and the lighting, both solved at the same tile rather than in a second
       pass over a buffer. That is what keeps the whole module a pure function: a queue of
       stopped cars runs on across a cell boundary instead of restarting every 96 m, and
       the light towers march evenly across the block instead of per cell. */
    function drivable(c) { return c === 1 || c === 2 || c === 3 || c === 16 || c === 18; }
    function at(gx, gy) {
      var c = codeAt(gx, gy);
      if (drivable(c)) {
        var jam = N.fbm(FS ^ 0x77b3, gx, gy, 9, 2);
        var h = N.hash2(FS ^ 0x1d4b, Math.floor(gx / 3), Math.floor(gy / 5));
        if (jam > 0.74 && h > 0.42) return 11;
        if (jam > 0.60 && h > 0.55) return 10;
        if (N.hash2(FS ^ 0x63a1, gx, gy) > 0.982) return 15;
        return c;
      }
      if (c === 5 || c === 6 || c === 7) {
        if ((((gx % 62) + 62) % 62) < 2 && (((gy % 62) + 62) % 62) < 2) return 9;
      }
      return c;
    }

    return { at: at, bounds: b, ns: ns, ew: ew, R1: R1, R2: R2, ramps: arcs.length,
             jcx: jcx, jcy: jcy, fieldSeed: FS };
  }

  function generate(seed, opts) {
    opts = opts || {};
    var S = solve(seed, opts);
    var cx0 = (opts.cellX || 0) * T, cy0 = (opts.cellY || 0) * T;
    var G = K.grid(seed >>> 0), g = G.g, x, y;
    for (y = 0; y < T; y++) for (x = 0; x < T; x++) g[y][x] = S.at(cx0 + x, cy0 + y);
    return { g: g, W: T, H: T, bounds: S.bounds, ns: S.ns, ew: S.ew, R1: S.R1, R2: S.R2,
             ramps: S.ramps, streets: [], gates: [], footprints: [] };
  }

  var PALETTE = {
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#5a5140',
    1: '#33333c', 2: '#b3ab97', 3: '#3d3d46', 4: '#8a8a92', 5: '#6b6b74', 6: '#6a5f47',
    7: '#4d4a38', 8: '#7a7266', 9: '#8f8676', 10: '#55555f', 11: '#4a4a54', 12: '#5c5c66',
    13: '#6f6a5e', 14: '#6a6a72', 15: '#4a4842', 16: '#38383f', 17: '#42424a',
    18: '#a8a08c', 19: '#4f4b3e', 20: '#6e6552'
  };

  var LEGEND = {
    0:  { name: 'infield dirt',     kind: 'ground',    act1: 'the graded infield inside the ramps, nobody has been in here in years' },
    1:  { name: 'travel lane',      kind: 'drive',     act1: 'mainline lane through the junction, sun-cracked and drifted' },
    2:  { name: 'white lane line',  kind: 'marking',   act1: 'faded white lane line (a freeway has no yellow: the barrier does that job)' },
    3:  { name: 'shoulder',         kind: 'drive',     act1: 'paved shoulder, rumble strip worn flat' },
    4:  { name: 'median barrier',   kind: 'structure', act1: 'concrete F-shape median barrier, scarred and tagged' },
    5:  { name: 'guardrail',        kind: 'structure', act1: 'steel W-beam guardrail, posts bent where something left the road' },
    6:  { name: 'embankment',       kind: 'ground',    act1: 'graded embankment slope, decomposed granite and rock' },
    7:  { name: 'dead brush',       kind: 'tree-dead', act1: 'dry brush and tumbleweed standing waist high in the infield' },
    8:  { name: 'sound wall',       kind: 'structure', act1: 'the block sound wall around the outside of the whole structure' },
    9:  { name: 'high-mast light',  kind: 'prop',      act1: 'a high-mast light tower over the junction, every head dark' },
    10: { name: 'dead car',         kind: 'vehicle',   act1: 'a car stopped in the queue that never moved again, doors open' },
    11: { name: 'dead semi',        kind: 'vehicle',   act1: 'a semi stopped nose to tail on the ramp, trailer stripped' },
    12: { name: 'deck',             kind: 'overhead',  act1: 'the upper roadway on its structure — you drive and walk UNDER it' },
    13: { name: 'pier',             kind: 'structure', act1: 'a concrete pier carrying the deck, tagged as high as anybody could reach' },
    14: { name: 'sign gantry',      kind: 'overhead',  act1: 'overhead sign gantry, panels gone or hanging' },
    15: { name: 'rubble / debris',  kind: 'prop',      act1: 'blown tyre, bumper, glass and drift across the lanes', solid: false },
    16: { name: 'ramp lane',        kind: 'drive',     act1: 'a two-lane connector ramp curving away from the mainline' },
    17: { name: 'ramp shoulder',    kind: 'drive',     act1: 'the narrow shoulder of a connector ramp, nowhere to go if you stop' },
    18: { name: 'gore marking',     kind: 'marking',   act1: 'the painted gore where the ramp splits off, chevrons worn to ghosts' },
    19: { name: 'retention basin',  kind: 'ground',    act1: 'the drainage basin the whole structure sheds into, dry and cracked' },
    20: { name: 'maintenance track',kind: 'drive',     act1: 'the dirt track the crews used to reach the basin and the pier bases' }
  };

  var NOTES = {
    summary: 'The stack: two interstates crossing, one over the other on a piered deck, with eight ramps in the four quadrants — a tight connector at grade and a long directional flyover that rides over both mainlines. Solved across all sixteen cells of the block at once, with the infield, its retention basin and the dead jam that starts here.',
    reference: [
      'I-15 crossing US-95 is the Spaghetti Bowl, the single biggest man-made object in the valley, and the 16 interchange cells are one four-by-four block of it at x50-53, y19-22.',
      'A big stack is: two mainlines crossing on different levels, a tight direct connector hugging the inside of each quadrant at grade, and a long directional flyover sweeping wide over everything.',
      'The infield is the unreachable weedy ground inside the ramps, and the retention basin the whole structure drains into sits in it.',
      'A dead city jams at its interchange first: the ramps back up, and everything behind them stops for good.'
    ],
    layout: [
      'Every tile is a PURE FUNCTION of its valley position — there is no per-cell buffer anywhere in this module — so the sixteen cells agree at their seams by construction rather than by luck.',
      'The world model supplies the cluster bounds and the APPROACHES: which columns and rows the interstate actually arrives on, so the ramps land on the real road instead of on a symmetry assumption.',
      'The mainline cross-section is the freeway module\'s, tile for tile: barrier, inside shoulder, four lanes, outside shoulder, guardrail. That is why a carriageway crosses the block boundary without a step.',
      'Ramp radii scale with the block: about 0.18 of its short span for the tight connectors and 0.38 for the flyovers, so a bigger junction gets bigger sweeps instead of the same eight arcs stretched.'
    ],
    circulation: 'Vehicles run through on both mainlines and around all eight ramps, and every ramp physically meets the carriageway it serves. On foot it is the worst ground in the valley and that is correct: no sidewalk, no crossing, a body walking here is walking on the interstate. The one thing a body CAN do is get underneath — the deck is an overhead tile you pass under, and the infield, the basin and the maintenance track are all walkable.',
    layering: 'GROUND (drive): lanes (1), shoulders (3), ramp lanes (16), ramp shoulders (17), maintenance track (20), and the markings (2, 18). GROUND (walk): infield (0), embankment (6), retention basin (19). STRUCTURE (solid): median barrier (4), guardrail (5), sound wall (8), piers (13). PROPS (solid): high-mast lights (9), dead cars (10), dead semis (11). OVERHEAD (pass UNDER): the deck (12) and the sign gantry (14). PORTALS: none.',
    decisions: [
      'Paolo 7/26: "we need to actually build a fucking world." Sixteen grey squares is the worst possible rendering of the biggest object in the city.',
      'Built across the CLUSTER, not the cell, for the same reason the airfield is: a 300 m flyover cannot be drawn 96 m at a time.',
      'SURFACE, not district: nobody bases a faction on an interchange until Paolo rules it is claimable ground.',
      'Codes 0 to 15 are deliberately the FREEWAY module\'s own codes, so the interstate and its junction read as one road and not two art styles meeting.',
      'CONFORMS TO THE VISUAL CONSTITUTION: every palette entry measured into its layer band, gated in interchange_gate.js.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('interchange', {
    generate: generate, body: function (c) { return c === 8; },
    category: K.category('interchange') || 'infrastructure',
    palette: PALETTE, legend: LEGEND, notes: NOTES, vehicular: true, surface: true
  });

  var API = { generate: generate, solve: solve, fieldSeed: fieldSeed,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaInterchange = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
