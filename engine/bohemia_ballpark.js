// BOHEMIA BALLPARK (7/27/26). LEISURE, on the DISTRICT KIT. 8 valley cells were flat.
//
// The minor-league ballpark. Its signature is THE DIAMOND, and a diamond is a shape
// nothing else in the valley makes: a 90-degree wedge, not a ring and not a rectangle.
// That asymmetry is why a ballpark can never be confused with the stadium district even
// though both are places people sat down to watch something.
//
// REAL REFERENCE (Las Vegas Ballpark and minor-league parks generally): the infield is
// a SKINNED DIRT diamond with a pitcher's mound at its centre and base paths joining
// four bases; the foul lines run out from home plate at ninety degrees to the outfield
// wall; the outfield is grass with a WARNING TRACK of dirt inside the wall so a fielder
// feels the wall before he hits it; the GRANDSTAND wraps behind home plate in a
// horseshoe and stops at the foul poles, because nobody seats the outfield in a small
// park; dugouts on the first- and third-base sides; bullpens beyond them; light towers;
// a concourse; and parking outside.
//
// LAWS: street-aware (canonical-south + K.rotateToStreet); ONE car entrance feeding the
// lot; WALKABLE-LAND (the field and the stands dominate, pavement connects); act-1 DEAD;
// every tile named, layered and dossiered; zero purple.
//
// LEGEND:
//  0 desert dead-ground   1 parking / drive      2 grandstand           3 dead brush
//  4 outfield (dead turf) 5 gate / entrance      6 infield dirt         7 base / chalk
//  8 dugout               9 concourse           10 stall markings      11 outfield wall
// 12 light tower         13 bullpen             14 pitcher's mound
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  /* THE COORDINATE SYSTEM IS THE WHOLE DESIGN. Everything on a ballpark site is placed
     relative to HOME PLATE, and the two useful measures are not x and y — they are:

       a = how far ALONG a foul line you are (home plate = 0, the foul pole = FOUL)
       q = how DEEP INTO FOUL TERRITORY you are (on the line = 0, and it keeps growing
           as you go back behind the plate)

     Both are just the 45-degree rotation of (dx, dy), and once you have them the bowl is
     three bands of q — dirt, seats, concourse — that automatically wrap behind the plate
     and run down both lines, which is exactly the shape a real grandstand is.

     THE FIRST VERSION USED RADIUS FROM HOME PLATE and it did not work: a ring behind the
     plate is a ring, so the seating came out as two disconnected side wings with a hole
     where the backstop belongs, and home plate was so low on the plot that the bowl ran
     off the bottom edge anyway. Radius is the wrong measure for a wedge. */
  function buildCanonical(seed) {
    var G = K.grid(seed), g = G.g, W = G.W, H = G.H, x, y, i;
    var set = G.set, get = G.get;
    var R2 = Math.SQRT2;

    G.rect(0, 0, W - 1, H - 1, 0);

    /* SCALE: a real park is ~120 m home to centre field and the cell is 96 m, so the park
       is compressed to about half, the same compression the stadium district takes. What
       must stay TRUE is the geometry — ninety-degree foul lines, the diamond, the bowl
       that stops down the lines — not the yardage. */
    var hx = 64, hy = 80, FOUL = 70, MARGIN = 7;
    var SEAT0 = 9, SEAT1 = 21, CONC1 = 27;   // foul dirt | seats | concourse, measured in q
    var STAND_END = 40;                      // how far down the line the seating runs

    function inMargin(px, py) {
      return px >= MARGIN && py >= MARGIN && px < W - MARGIN && py < H - MARGIN;
    }
    function A(px, py) { var dx = Math.abs(px - hx), dy = hy - py; return (dx + dy) / R2; }
    function Q(px, py) { var dx = Math.abs(px - hx), dy = hy - py; return (dx - dy) / R2; }
    function D(px, py) { var dx = px - hx, dy = hy - py; return Math.sqrt(dx * dx + dy * dy); }
    /* DEPTH is q down the lines and RADIUS behind the plate, and the two agree exactly
       where a = 0, so the boundary is straight along both baselines and CURVES round the
       backstop. Pure q gave a pointed chevron — a grey arrowhead, not a bowl. */
    function DEPTH(px, py) { var a = A(px, py); return a >= 0 ? Q(px, py) : D(px, py); }
    function inWedge(px, py) { var dy = hy - py; return dy >= 0 && Math.abs(px - hx) <= dy; }
    function inField(px, py) { return inMargin(px, py) && inWedge(px, py) && D(px, py) <= FOUL; }

    /* THE LOT wraps the park and stops: a real park does not pave its whole site, and
       paving to the fence is how the walkable-land law gets broken. Beyond the apron it
       is desert again. */
    for (y = 1; y < H - 1; y++) for (x = 1; x < W - 1; x++) if (D(x, y) <= FOUL + 17) set(x, y, 1);

    // THE FIELD, then the warning track and the wall on the same arc
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (inField(x, y)) set(x, y, 4);
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (!inMargin(x, y) || !inWedge(x, y)) continue;
      var d = D(x, y);
      if (d <= FOUL && d > FOUL - 5) set(x, y, 6);        // warning track: felt underfoot
      else if (d > FOUL && d <= FOUL + 3) set(x, y, 11);  // the outfield wall
    }

    /* FOUL TERRITORY: the dirt apron outside the lines, from behind the plate all the way
       down to the poles. This is also what stops the seating bowl from enclosing a pocket
       of parking behind home plate, which is what the first version did. */
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (!inMargin(x, y) || inWedge(x, y)) continue;
      var fd = DEPTH(x, y);
      if (fd > SEAT0 || A(x, y) > FOUL || D(x, y) > FOUL) continue;
      /* FOUL TERRITORY IS GRASS, not a dirt yard — only the circle round home plate and
         the warning strip along the front of the stands are skinned. The first pass laid
         the whole apron in dirt and the park read as one brown blob. */
      set(x, y, (fd > SEAT0 - 3 || D(x, y) < 15) ? 6 : 4);
    }

    /* THE BOWL: seats then concourse, as bands of DEPTH into foul territory. It wraps
       behind the plate on its own because q keeps growing back there, and it STOPS
       partway down each line (STAND_END) — a minor-league park does not seat the corners,
       and running the stands to the poles would have put them off the edge of the plot. */
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (!inMargin(x, y) || inWedge(x, y)) continue;
      var a = A(x, y), q = DEPTH(x, y);
      if (a > STAND_END) continue;
      /* AND IT TAPERS. A real bowl steps down toward the corners instead of ending in a
         cliff; the last stretch of each wing narrows to under half depth. */
      var t = a <= STAND_END - 16 ? 1 : 1 - 0.55 * (a - (STAND_END - 16)) / 16;
      if (q > SEAT0 && q <= SEAT0 + (SEAT1 - SEAT0) * t) set(x, y, 2);
      else if (q > SEAT1 * t && q <= SEAT0 + (CONC1 - SEAT0) * t) set(x, y, 9);
    }

    /* THE INFIELD: a skinned dirt diamond. Base paths join four bases at ninety degrees to
       each other and forty-five to the foul lines, which is why it reads as a diamond and
       never as a square. */
    var BASE = 18;
    var bases = [[hx, hy], [hx + BASE, hy - BASE], [hx, hy - BASE * 2], [hx - BASE, hy - BASE]];
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var ax = Math.abs(x - hx), ay = Math.abs((hy - BASE) - y);
      if (ax + ay <= BASE + 5 && inField(x, y)) set(x, y, 6);
    }
    G.disc(hx, hy - BASE, 4, 14);                                   // the pitcher's mound
    bases.forEach(function (b) {
      for (i = -2; i <= 2; i++) for (var j = -2; j <= 2; j++) set(b[0] + i, b[1] + j, 7);
    });
    // the foul lines, chalked from home out to the poles
    for (i = 0; i <= Math.round(FOUL / R2); i++) {
      if (!inMargin(hx + i, hy - i)) continue;
      set(hx + i, hy - i, 7); set(hx + i + 1, hy - i, 7);
      set(hx - i, hy - i, 7); set(hx - i - 1, hy - i, 7);
    }

    /* DUGOUTS and BULLPENS live in FOUL TERRITORY, in front of the seats, parallel to the
       baselines — which is only expressible in (a, q). Drawn as axis-aligned rectangles
       they came out crossing the lot ring and merging into the stands. */
    function band(a0, a1, q0, q1, code) {
      for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) {
        if (!inMargin(xx, yy) || inWedge(xx, yy)) continue;
        var aa = A(xx, yy), qq = Q(xx, yy);
        if (aa >= a0 && aa <= a1 && qq >= q0 && qq <= q1) set(xx, yy, code);
      }
    }
    band(16, 30, 3, 7.5, 8);      // dugouts, both lines (Q is symmetric in |dx|)
    band(46, 60, 3, 8, 13);       // bullpens, past the end of the seating

    /* SIX LIGHT TOWERS, out in the lot clear of the bowl so they never sever a drive lane —
       the speedway taught that one. */
    [[6, 6], [W - 7, 6], [6, 64], [W - 7, 64], [30, H - 8], [W - 31, H - 8]]
      .forEach(function (p) {
        for (i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) set(p[0] + i, p[1] + j, 12);
      });

    /* THE LOT IS BLOCKS, NOT A BARCODE. Striping every sixth row edge to edge made the
       whole plot read as corduroy. A real lot has a ring road round the outside, stall
       rows broken into blocks, and cross aisles between them. */
    for (y = 8; y < H - 8; y += 6) for (x = 8; x < W - 8; x++) {
      if (get(x, y) !== 1) continue;
      if (x % 24 >= 18) continue;                        // cross aisles between blocks
      if (Math.abs(x - 64) < 7 && y > hy) continue;      // the entrance drive stays clear
      set(x, y, 10);
    }

    // the one car entrance, canonical south, and the drive up to the concourse
    for (i = -5; i <= 5; i++) { set(64 + i, H - 1, 5); set(64 + i, H - 2, 1); }

    // act-1 DEAD: brush through the outfield, the skinned dirt gone to weed
    for (i = 0; i < 90; i++) {
      var bx = 4 + Math.floor(G.rnd() * (W - 8)), by = 4 + Math.floor(G.rnd() * (H - 8));
      var c = get(bx, by);
      if (c === 4 || c === 0 || c === 6) { set(bx, by, 3); set(bx + 1, by, 3); }
    }
    return g;
  }

  function generate(seed, opts) {
    opts = opts || {};
    var streets = opts.streets || ['S'];
    var soft = function (c) { return c === 0 || c === 1 || c === 3 || c === 10; };
    var res = K.rotateToStreet(buildCanonical(seed >>> 0), streets,
                               { gate: 5, pedWalk: 1, pedOver: soft, pedInset: 12 });
    var g = res.g;
    return { g: g, W: g[0].length, H: g.length, streets: streets, gates: res.gates,
             footprints: K.footprints(g, function (v) { return v === 2 || v === 8 || v === 13; }) };
  }
  function driveConnected(res) { return K.driveReachFromStreet(res.g, 1) > 0.85; }

  var PALETTE = {
    /* THE SEATING AND THE CONCOURSE WERE THE SAME GREY and the bowl read as one mass.
       Seats go dark and cool (folded plastic in shadow), the concourse goes pale
       concrete, so you can see where the stands stop and the walkway starts. */
    0: '#1c1a15', 1: '#3d3a33', 2: '#4d4b53', 3: '#4d4a38', 4: '#574f3b', 5: '#c79a3f',
    6: '#7a5f42', 7: '#c9c1aa', 8: '#5c5546', 9: '#847f73', 10: '#8f8676', 11: '#67676f',
    12: '#a09a88', 13: '#6d6455', 14: '#8a6a48'
  };

  var LEGEND = {
    0:  { name: 'desert dead-ground', kind: 'ground',    act1: 'bare Mojave dirt at the edge of the site' },
    1:  { name: 'parking / drive',    kind: 'drive',     act1: 'the ballpark lot, cracked, weeds down every joint' },
    2:  { name: 'grandstand',         kind: 'building',  act1: 'the horseshoe of seating behind home plate, every seat folded and grey',
          enter: 'grandstand interior: the concourse under the seating, shuttered stands either side' },
    3:  { name: 'dead brush',         kind: 'tree-dead', act1: 'brush and tumbleweed, thickest through the outfield nobody mows', solid: false },
    4:  { name: 'outfield (dead turf)',kind: 'ground',   act1: 'the outfield, brown to the root, the mow pattern still faintly in it' },
    5:  { name: 'gate / entrance',    kind: 'gate',      act1: 'the gate off the street, turnstiles standing open' },
    6:  { name: 'infield dirt',       kind: 'ground',    act1: 'the skinned dirt of the diamond and the warning track, weed coming through' },
    7:  { name: 'base / chalk',       kind: 'marking',   act1: 'the bases and the chalked foul lines, ghosted but still readable' },
    8:  { name: 'dugout',             kind: 'building',  act1: 'a sunken dugout on the baseline, bench still bolted down',
          enter: 'dugout interior: a low bench room, the tunnel to the clubhouse behind it' },
    9:  { name: 'concourse',          kind: 'ground',    act1: 'the concourse behind the seating, concessions shuttered' },
    10: { name: 'stall markings',     kind: 'marking',   act1: 'faded parking rows across the lot' },
    11: { name: 'outfield wall',      kind: 'structure', act1: 'the padded outfield wall, ad panels sun-bleached blank' },
    12: { name: 'light tower',        kind: 'prop',      act1: 'a field light tower, every head dark' },
    13: { name: 'bullpen',            kind: 'building',  act1: 'the bullpen beyond the baseline, mound and bench under a shade roof',
          enter: 'bullpen interior: a shaded bench run with a warm-up mound at one end' },
    14: { name: 'pitcher\'s mound',   kind: 'ground',    act1: 'the mound at the middle of the diamond, rubber still set in it' }
  };

  var NOTES = {
    summary: 'A dead minor-league ballpark laid out from home plate: the skinned dirt DIAMOND with its mound and bases, chalked foul lines running ninety degrees out to the wall, an outfield of dead turf inside a warning track, a raked grandstand bowl that wraps behind the plate and stops partway down each line, dugouts and bullpens in foul territory, six light towers and a lot outside.',
    reference: [
      'Las Vegas Ballpark and minor-league parks generally: a skinned dirt infield with a pitcher\'s mound at its centre and four bases at ninety degrees to each other; foul lines running out from home plate at ninety degrees; an outfield of grass with a WARNING TRACK of dirt inside the wall so a fielder feels the wall before he hits it; a grandstand bowl behind the plate; dugouts and bullpens down the lines in FOUL territory; and parking outside.',
      'THE DIAMOND IS A WEDGE, and that is what makes a ballpark impossible to confuse with the stadium district: a stadium is a closed ring around a rectangle, a ballpark is a quarter-circle opening away from one corner.',
      'SCALE: a real park is about 120 m home to centre field and a cell is 96 m, so the park is compressed to roughly half — the same compression the stadium district takes. What stays true is the GEOMETRY (ninety-degree foul lines, the diamond, a bowl that stops down the lines), never the yardage.'
    ],
    layout: [
      'Home plate at (64, 80) canonical, high enough on the plot that the whole bowl fits BEHIND it. Everything else is placed relative to it, which is how a real park is laid out.',
      'THE COORDINATE SYSTEM IS THE DESIGN: not x and y but `a` (how far ALONG a foul line you are, home = 0, the pole = 70) and `q` (how DEEP into foul territory, on the line = 0, growing behind the plate). Both are the 45-degree rotation of (dx, dy).',
      'The field is everything inside the two foul lines and inside the wall arc at 70 tiles; the warning track is the last five tiles of it and the wall follows the same arc.',
      'The infield diamond is a rotated square joining the four bases, so it reads as a diamond and never as a square; the mound is at its centre and the foul lines are chalked from home out to the poles.',
      'FOUL TERRITORY is grass out to depth 9, with only the circle round home plate and the strip in front of the stands skinned to dirt.',
      'THE BOWL is three bands of DEPTH — foul dirt, seats to 21, concourse to 27 — so it wraps behind the plate on its own and runs down both lines. It stops at a = 40 and TAPERS over its last stretch: no minor-league park seats the corners.',
      'Dugouts (a 16..30) and bullpens (a 46..60) sit in foul territory, parallel to the baselines, in front of the seats. Six light towers stand out in the lot clear of the bowl.',
      'The lot wraps the park to 17 tiles past the wall and then stops — a real park does not pave its whole site — striped in BLOCKS with cross aisles and a clear entrance drive, off ONE car entrance on the primary street.'
    ],
    circulation: 'Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto a lot that wraps the whole park and reaches the plot edge, so a car gets to every row from the curb (driveReachFromStreet 1.00 on all six orientations). On foot you cross the lot, enter the concourse (9) behind the seating, pass through the bowl into foul territory and out onto the field — the outfield wall is the only thing that stops you, which is exactly its job. A corner cell gains a pedestrian gate on the side street.',
    layering: 'GROUND (drive): the lot (1) and its stall markings (10). GROUND (walk): outfield (4), infield dirt and warning track (6), the mound (14), concourse (9), desert (0), and the chalk (7). STRUCTURE (solid, ENTERABLE): grandstand (2), dugouts (8), bullpens (13) — three different interiors. STRUCTURE (solid): the outfield wall (11). PROPS (solid): light towers (12). TREE-DEAD (pass): brush (3). PORTAL: the gate (5).',
    decisions: [
      'Paolo 7/26: build the world. 8 valley cells were flat.',
      'THE DIAMOND IS THE SIGNATURE and the geometry is built out from home plate, never drawn as a decorative shape. Foul lines at ninety degrees, bases at ninety degrees to each other, mound at the centre of the diamond.',
      'THE FIRST VERSION USED RADIUS FROM HOME PLATE and it could not work: a ring behind the plate is a ring, so the seating came out as two disconnected side wings with a hole where the backstop belongs, and home plate sat so low that the bowl ran off the plot. Depth is `q` down the lines and RADIUS behind the plate, and the two agree exactly at a = 0 — straight along the baselines, curved round the backstop.',
      'THE STANDS STOP DOWN THE LINES. Wrapping seating all the way round would have been easier and would have made this the stadium district again.',
      'DUGOUTS AND BULLPENS ARE IN FOUL TERRITORY, which is where they actually are. Drawn as axis-aligned rectangles they crossed the lot ring, severed the parking from the entrance and merged into the grandstand blob.',
      'No team name, no ad panels, no scoreboard text — Paolo\'s to author. The panels read sun-bleached blank.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('ballpark', { generate: generate, body: function (c) { return c === 2 || c === 8 || c === 13; },
    category: K.category('ballpark') || 'leisure', palette: PALETTE, legend: LEGEND, notes: NOTES });

  var API = { generate: generate, driveConnected: driveConnected,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaBallpark = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
