// BOHEMIA TOWN (7/27/26). RESIDENTIAL, on the DISTRICT KIT. 9 valley cells were flat.
//
// The old townsite — the thing the valley grew out of and then grew past. Las Vegas
// began as a railroad water stop with one street of storefronts, and the surviving
// Nevada towns around it (Goodsprings, Searchlight, Nelson) are all still that same
// object: ONE MAIN STREET with a solid wall of attached shopfronts on both sides, and
// everything else scattered behind it in the dirt.
//
// THE MAIN STREET IS THE WHOLE THING. A town is not a district of houses — a suburb is
// that. A town is a STREET WALL: buildings shoulder to shoulder, right up to the
// footway, with a continuous shade canopy over the boardwalk, because that is what you
// build when the sun is the enemy and the lot lines are narrow. Break that wall into
// detached buildings with gaps and you have a strip mall, which is a different and much
// later thing.
//
// REAL REFERENCE (the original Fremont Street townsite and the surviving Nevada
// townsites): a single wide main street with ANGLE PARKING down both sides — wide
// because it was laid out for a wagon team to turn around in; attached one- and
// two-storey masonry storefronts with tall false fronts hiding shallow roofs; a
// continuous covered boardwalk; a saloon and a general store as the anchors; a small
// hall or church; a WATER TOWER, which in a desert town is the tallest thing and the
// reason the town is where it is; back alleys, and a handful of detached houses on
// dirt lots behind the commercial row.
//
// LAWS: street-aware (canonical-south + K.rotateToStreet); the main street IS the car
// surface and it meets the arterial at the town's one entrance; WALKABLE-LAND (the
// street wall dominates); act-1 DEAD; every tile named, layered and dossiered.
//
// LEGEND:
//  0 desert dead-ground   1 main street (drive)  2 storefront          3 dead tree
//  4 dirt lot             5 gate / entrance      6 boardwalk           7 false front
//  8 saloon / hall        9 house               10 angle-park markings 11 water tower
// 12 pole light          13 back alley          14 fallen sign        15 shed
// 16 fuel canopy (overhead)
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  /* THE FIRST VERSION OF THIS DISTRICT WAS A BARCODE. Five full-height stripes — alley,
     shopfronts, street, shopfronts, alley — every one of them running unbroken from the
     top of the plot to the bottom, all in the same brown. It had the right PARTS and no
     town in it, because a town's structure is not the main street: it is the BLOCK, and a
     block is what you get when CROSS STREETS cut the row. Three cross streets, varied
     unit widths, and real anchors on the corners are what turn a stripe into a place. */
  function buildCanonical(seed) {
    var G = K.grid(seed), g = G.g, W = G.W, H = G.H, x, y, i, j;
    var set = G.set, get = G.get, rnd = G.rnd;

    G.rect(0, 0, W - 1, H - 1, 0);
    G.rect(2, 2, W - 3, H - 3, 4);                       // the town's dirt, out to the edges

    /* THE MAIN STREET. Wide on purpose: these were laid out for a wagon team to turn
       around in and they never narrowed. It runs the length of the plot because a
       highway town IS the highway for the length of the town. */
    var sx0 = 56, sx1 = 71;                              // curb to curb, roadway only
    var CROSS = [22, 60, 98], CW = 7;                    // the three cross streets
    G.rect(sx0, 4, sx1, H - 1, 1);

    /* THE CROSS STREETS. This is the thing the first version did not have. They stop
       short of the side edges so the town still has exactly ONE car entrance. */
    CROSS.forEach(function (cy) { G.rect(12, cy, W - 13, cy + CW, 1); });

    function onCross(yy) {
      for (var k = 0; k < CROSS.length; k++) if (yy >= CROSS[k] - 1 && yy <= CROSS[k] + CW + 1) return true;
      return false;
    }

    /* THE STREET WALL. Attached storefronts shoulder to shoulder — no gaps, because the
       gaps are what turn a town into a strip mall — but the wall is cut by the cross
       streets into four blocks per side, and the units inside a block vary in width. */
    function row(bx0, bx1, side) {
      for (y = 4; y < H - 4; y++) {
        if (onCross(y)) continue;
        for (x = bx0; x <= bx1; x++) set(x, y, 2);
        for (i = 1; i <= 5; i++) set(side < 0 ? bx1 + i : bx0 - i, y, 6);   // boardwalk, street face
      }
      // party walls + false fronts, at varied unit widths so no two neighbours match
      y = 6;
      var unit = 0;
      while (y < H - 8) {
        var wide = 7 + Math.floor(rnd() * 7);
        if (onCross(y) || onCross(y + wide)) { y += 4; continue; }
        unit++;
        for (x = bx0; x <= bx1; x++) { set(x, y, 7); set(x, y + 1, 7); }
        // the anchors: the saloon on one side, the hall on the other, bigger units
        if ((side < 0 && unit === 4) || (side > 0 && unit === 7)) {
          for (j = y + 2; j < y + wide && j < H - 4; j++)
            for (x = bx0; x <= bx1; x++) set(x, j, 8);
        }
        y += wide;
      }
    }
    row(32, 50, -1);          // west side of the street
    row(77, 95, 1);           // east side

    /* ANGLE PARKING down both curbs — the other thing that says main street — but only
       where a shopfront actually faces it, never across a junction. */
    for (y = 6; y < H - 6; y += 4) {
      if (onCross(y)) continue;
      for (i = 0; i < 4; i++) { set(sx0 + i, y, 10); set(sx1 - i, y, 10); }
    }

    /* THE BACK ALLEYS, cut by the cross streets the same way the row is. */
    for (y = 2; y < H - 2; y++) {
      if (onCross(y)) continue;
      for (i = 0; i < 5; i++) { set(25 + i, y, 13); set(98 + i, y, 13); }
    }

    /* BEHIND THE ALLEY: houses on dirt lots, and their sheds. Varied sizes on varied
       lots — a uniform grid back here is a suburb, and a suburb is a different district. */
    [[6, 21], [104, 119]].forEach(function (band) {
      for (y = 8; y < H - 16; y += 16) {
        for (var lot = 0; lot < 2; lot++) {
          var lx = band[0] + lot * 8;
          if (lx + 6 > band[1]) continue;
          var hw = 5 + Math.floor(rnd() * 3), hh = 8 + Math.floor(rnd() * 6);
          var oy = y + Math.floor(rnd() * 5);
          if (onCross(oy) || onCross(oy + hh)) continue;
          G.rect(lx, oy, Math.min(lx + hw, band[1]), oy + hh, 9);
          if (rnd() < 0.5) G.rect(lx + 1, oy + hh + 3, lx + 3, oy + hh + 5, 15);   // a shed out back
        }
      }
    });

    /* THE GAS STATION at the town's mouth: pumps under a CANOPY you walk under, which is
       the one overhead layer in the place. */
    G.rect(100, 108, 116, 118, 4);
    G.rect(102, 110, 114, 116, 16);
    G.rect(106, 118, 112, 124, 15);
    for (i = 0; i < 3; i++) { set(104 + i * 4, 113, 12); set(104 + i * 4, 114, 12); }

    /* THE WATER TOWER: in a desert town it is the tallest thing on the skyline and the
       reason the town is where it is at all. */
    G.disc(14, 108, 8, 11);
    for (i = -8; i <= 8; i += 5) { set(14 + i, 116, 11); set(14 + i, 117, 11); }   // legs

    // act-1 DEAD: the town sign down across the street, dead trees, dark pole lights
    /* THE SIGN CAME DOWN ACROSS THE STREET, but only one end of it — spanning the full
       carriageway sealed the town in half and stranded a third of the drive network north
       of it. It fell, it did not become a wall. You get past on the east side. */
    for (x = sx0 + 1; x <= sx1 - 5; x++) { set(x, 46, 14); set(x, 47, 14); }
    for (i = 0; i < 40; i++) {
      var tx = 4 + Math.floor(rnd() * (W - 8)), ty = 4 + Math.floor(rnd() * (H - 8));
      if (get(tx, ty) === 4) { set(tx, ty, 3); set(tx + 1, ty, 3); set(tx, ty + 1, 3); }
    }
    for (y = 12; y < H - 10; y += 14) {
      if (onCross(y)) continue;
      set(sx0 - 3, y, 12); set(sx1 + 3, y, 12);
    }

    // the town's one car entrance is the main street itself, at the canonical south edge
    for (i = sx0; i <= sx1; i++) set(i, H - 1, 5);
    return g;
  }

  function generate(seed, opts) {
    opts = opts || {};
    var streets = opts.streets || ['S'];
    var soft = function (c) { return c === 0 || c === 3 || c === 4 || c === 13; };
    var res = K.rotateToStreet(buildCanonical(seed >>> 0), streets,
                               { gate: 5, pedWalk: 6, pedOver: soft, pedInset: 14 });
    var g = res.g;
    return { g: g, W: g[0].length, H: g.length, streets: streets, gates: res.gates,
             footprints: K.footprints(g, function (v) { return v === 2 || v === 8 || v === 9 || v === 15; }) };
  }
  function driveConnected(res) { return K.driveReachFromStreet(res.g, 1) > 0.85; }

  var PALETTE = {
    /* EVERYTHING WAS THE SAME BROWN in the first version and the whole plot read as one
       material. The town now separates by MATERIAL, which is also the truth of the place:
       masonry shopfronts warm, timber houses grey and silvered, dirt pale, alley dark. */
    0: '#1c1a15', 1: '#33333b', 2: '#8a6f4e', 3: '#4d4a38', 4: '#6f6449', 5: '#c79a3f',
    6: '#b0a184', 7: '#a8895f', 8: '#96604a', 9: '#6e6f66', 10: '#a8a08c', 11: '#9a948a',
    12: '#b0863a', 13: '#403a33', 14: '#5c554a', 15: '#57544a', 16: '#8e8a7c'
  };

  var LEGEND = {
    0:  { name: 'desert dead-ground', kind: 'ground',    act1: 'bare Mojave dirt at the edge of the townsite' },
    1:  { name: 'main street',        kind: 'drive',     act1: 'the one wide street, laid out for a wagon team to turn in, sand drifted across it' },
    2:  { name: 'storefront',         kind: 'building',  act1: 'an attached shopfront in the street wall, glass gone or boarded, the goods long carried off',
          enter: 'storefront interior: one deep narrow room, a counter across the back, a stockroom behind it' },
    3:  { name: 'dead tree',          kind: 'tree-dead', act1: 'a dead street tree, the only one anybody ever watered', solid:true },
    4:  { name: 'dirt lot',           kind: 'ground',    act1: 'the graded dirt the town sits on — never paved, never needed to be' },
    5:  { name: 'gate / entrance',    kind: 'gate',      act1: 'where the main street meets the highway, amber curb' },
    6:  { name: 'boardwalk',          kind: 'ground',    act1: 'the covered boardwalk under the canopy, boards split, shade still working' },
    7:  { name: 'false front',        kind: 'structure', act1: 'the tall false front hiding a shallow roof, lettering weathered off it' },
    8:  { name: 'saloon / hall',      kind: 'building',  act1: 'the corner anchor — the bar, or the hall the town used for everything else',
          enter: 'hall interior: one big room with a bar or a stage at one end, chairs stacked' },
    9:  { name: 'house',              kind: 'building',  act1: 'a detached house on a dirt lot behind the row, porch sagging',
          enter: 'house interior: a few small rooms off a front parlour' },
    10: { name: 'angle-park marking', kind: 'marking',   act1: 'the angled parking bays either side of the street, paint nearly gone' },
    11: { name: 'water tower',        kind: 'structure', act1: 'the water tower on its legs, the tallest thing here and the reason the town is here' },
    12: { name: 'pole light',         kind: 'prop',      act1: 'a street pole light, head dark' },
    13: { name: 'back alley',         kind: 'drive',     act1: 'the service alley behind the row, where the deliveries came in' },
    14: { name: 'fallen sign',        kind: 'prop',      act1: 'the town sign that used to span the street, down across it now' },
    15: { name: 'shed / outbuilding', kind: 'building',  act1: 'a tin shed on the back lot, door hanging, whatever was in it gone',
          enter: 'shed interior: one room, a dirt floor, a bench along one wall' },
    16: { name: 'fuel canopy',        kind: 'overhead',  act1: 'the canopy over the pumps at the town\'s mouth, panels blown out of it' }
  };

  var NOTES = {
    summary: 'The old townsite: ONE wide main street with angle parking, walled on both sides by attached false-front storefronts under a continuous covered boardwalk, CUT INTO BLOCKS by three cross streets, with a saloon and a hall as the anchors, back alleys, houses and sheds on dirt lots behind, a gas station at the town\'s mouth, and the water tower that is the reason the town is where it is.',
    reference: [
      'The original Fremont Street townsite and the surviving Nevada towns around this valley (Goodsprings, Searchlight, Nelson): a single wide main street — wide because it was laid out for a wagon team to turn around in — with ANGLE PARKING down both sides.',
      'Attached one- and two-storey masonry storefronts with tall FALSE FRONTS hiding shallow roofs, and a continuous covered boardwalk, because in a desert town shade over the footway is not decoration.',
      'A WATER TOWER is the tallest thing in a desert town and usually the reason the town exists at all — Las Vegas itself began as a railroad water stop.',
      'AND THE THING THAT IS EASIEST TO MISS: a townsite is platted in BLOCKS. The cross streets are not decoration, they are the unit the whole place is measured in.'
    ],
    layout: [
      'The main street runs the full length of the plot, curb to curb at x 56..71, with angled parking bays either side.',
      'THREE CROSS STREETS at y 22, 60 and 98 cut everything — the row, the boardwalk and the alleys — into four blocks per side. They stop short of the side edges so the town keeps exactly ONE car entrance.',
      'THE STREET WALL: storefronts shoulder to shoulder on BOTH sides with no gaps, each unit divided by a party wall and topped by a false front, unit widths varying so no two neighbours match. That continuity is the difference between a town and a strip mall; the cross streets are the difference between a town and a corridor.',
      'A saloon on one side and a hall on the other are the bigger anchor units in the row.',
      'Service alleys run behind both rows; detached houses and their sheds sit on dirt lots behind those, at varied sizes on varied lots — a uniform grid back there would be a suburb.',
      'A gas station stands at the town\'s mouth, pumps under a CANOPY you walk under, which is the one overhead layer in the district.',
      'The water tower stands on the west lot on its legs. The town\'s single car entrance is the main street itself, meeting the highway at the primary street edge.'
    ],
    circulation: 'Street-aware via canonical-south + K.rotateToStreet: the MAIN STREET is the car surface and it IS the entrance — the town meets the highway by simply continuing. The three cross streets are real carriageway off it, so a car reaches every block (driveReachFromStreet 1.00 on all six orientations); the back alleys (13) are the second drivable surface, reaching the rear of every unit. On foot it is the boardwalk (6) the whole length of both rows, under cover, which is how the place was meant to be walked. A corner cell gains a pedestrian gate on the side street.',
    layering: 'GROUND (drive): the main street and cross streets (1), the back alleys (13), and the angle-park markings (10). GROUND (walk): boardwalk (6), dirt lot (4), desert (0). OVERHEAD (pass under): the fuel canopy (16). STRUCTURE (solid, ENTERABLE): storefronts (2), saloon/hall (8), houses (9), sheds (15) — four different interiors. STRUCTURE (solid): the false fronts (7) and the water tower (11). PROPS: pole lights (12), the fallen sign (14). TREE-DEAD (pass): dead trees (3). PORTAL: the gate (5).',
    decisions: [
      'Paolo 7/26: build the world. 9 valley cells were flat; the townsite is what the valley grew out of.',
      'THE STREET WALL IS THE POINT and it is deliberately unbroken WITHIN a block. Detached buildings with gaps between them is a strip mall, a different and much later object.',
      'THE BLOCK IS THE UNIT. The first version had every correct part and was a BARCODE — five full-height stripes running unbroken top to bottom. A town\'s structure is not its main street, it is its block, and a block is what you get when cross streets cut the row.',
      'MATERIALS SEPARATE. The first version was one brown end to end: masonry shopfronts are warm, timber houses grey and silvered, dirt pale, alley dark, boardwalk pale timber.',
      'THE FALLEN SIGN DOES NOT SPAN THE STREET. It did, and it sealed the town in half, stranding a third of the drive network. It fell; it did not become a wall.',
      'No town name, no shop names, no signage text — Paolo\'s to author. The lettering has weathered off.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('town', { generate: generate, body: function (c) { return c === 2 || c === 8 || c === 9 || c === 15; },
    category: K.category('town') || 'residential', palette: PALETTE, legend: LEGEND, notes: NOTES });

  var API = { generate: generate, driveConnected: driveConnected,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaTown = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
