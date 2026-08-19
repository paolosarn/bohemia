// BOHEMIA CAMPUS (7/27/26). INSTITUTIONAL, on the DISTRICT KIT. 16 valley cells were flat.
//
// A dead community-college / state-university campus, and the thing that makes a campus a
// campus rather than a business park is THE QUAD: an open green heart with the academic
// buildings turned to face it and the walks cutting across it on the desire lines people
// actually walked. Everything here is arranged around that.
//
// REAL REFERENCE (UNLV and CSN, which are the two in this valley, plus standard American
// campus site planning): a central quad with diagonal walks; academic halls on three sides
// of it, entrances facing IN; a LIBRARY as the biggest single mass, usually with a
// colonnade or a raised entry; a LECTURE HALL whose fan-shaped plan is visible from
// outside; a residence-hall row set apart from the teaching core; rec courts; and the
// parking pushed to the RING, because a campus core is deliberately walkable and the cars
// are kept at the edge. In the Mojave the quad is irrigated turf, so act 1 kills it first.
//
// LAWS: street-aware (canonical-south + K.rotateToStreet); ONE car entrance on the primary
// street feeding a ring road and the lots, so a car reaches every stall from the curb;
// WALKABLE-LAND (the buildings and the quad dominate, pavement connects); act-1 DEAD
// throughout; every tile named, layered and dossiered; zero purple.
//
// LEGEND:
//  0 desert dead-ground   1 pavement / drive     2 academic hall        3 dead tree
//  4 quad (dead lawn)     5 gate / entrance      6 walkway / plaza      7 dry fountain
//  8 library              9 residence hall      10 white markings      11 bench / planter
// 12 pole light          13 lecture hall        14 rec court
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  function buildCanonical(seed) {
    var G = K.grid(seed), g = G.g, W = G.W, H = G.H, x, y, i;
    var set = G.set, get = G.get;
    function soft(c) { return c === 0 || c === 4 || c === 3 || c === 6; }

    // ---- the campus ground is dead LAWN, desert only at the setback margins ----
    G.rect(0, 0, W - 1, H - 1, 0);
    G.rect(3, 3, W - 4, H - 8, 4);

    /* THE QUAD. The heart, and deliberately the largest single open thing on the plot:
       a campus that reads as a campus has a middle you can stand in. */
    var qx0 = 30, qy0 = 30, qx1 = 96, qy1 = 84;
    G.rect(qx0, qy0, qx1, qy1, 4);

    // the walks that cross it: the two orthogonals plus the diagonals people really cut
    var qcx = (qx0 + qx1) >> 1, qcy = (qy0 + qy1) >> 1;
    G.hbar(qx0, qx1, qcy - 1, 6, 3);
    G.vbar(qy0, qy1, qcx - 1, 6, 3);
    for (i = 0; i <= (qx1 - qx0); i++) {
      var t = i / (qx1 - qx0);
      var dy = Math.round(qy0 + (qy1 - qy0) * t);
      for (var w2 = 0; w2 < 3; w2++) {
        set(qx0 + i, dy + w2, 6);
        set(qx1 - i, dy + w2, 6);
      }
    }
    // the dry fountain where the walks meet
    G.disc(qcx, qcy, 8, 6);
    G.disc(qcx, qcy, 6, 7);
    G.disc(qcx, qcy, 2, 6);

    /* THE ACADEMIC HALLS, turned to FACE the quad on three sides. Their doors are on the
       inside edge, which is the whole social geometry of a campus. */
    function hall(x0, y0, x1, y1, code) {
      G.rect(x0, y0, x1, y1, code);
    }
    hall(14, 22, 27, 62, 2);          // west hall
    hall(14, 68, 27, 92, 2);          // west hall, second block
    hall(99, 22, 112, 58, 2);         // east hall
    hall(34, 12, 74, 26, 2);          // north hall, across the head of the quad
    // the library: the biggest single mass, with a colonnade facing the quad
    hall(78, 10, 114, 18, 8);
    hall(84, 18, 112, 34, 8);
    for (x = 84; x <= 112; x += 4) { set(x, 35, 8); set(x + 1, 35, 8); }   // colonnade piers
    // the lecture hall, its fan plan legible from outside
    for (y = 0; y < 18; y++) {
      var half = Math.round(6 + y * 0.9);
      for (x = -half; x <= half; x++) set(46 + x, 92 + y, 13);
    }

    /* THE RESIDENCE ROW, set apart from the teaching core the way it always is. */
    for (i = 0; i < 3; i++) hall(16 + i * 26, 100, 16 + i * 26 + 18, 116, 9);

    // rec courts on the east lawn
    for (i = 0; i < 2; i++) {
      G.rect(96 + i * 16, 64, 96 + i * 16 + 13, 88, 14);
      G.hbar(96 + i * 16, 96 + i * 16 + 13, 76, 10, 1);
    }

    /* THE RING ROAD AND THE LOTS, pushed to the edge — a campus core is walkable on
       purpose and the cars stop at the ring. ONE car entrance, canonical south. */
    G.hbar(3, W - 4, H - 9, 1, 5);                   // the south ring
    G.vbar(10, H - 9, 3, 1, 4);                      // west leg, meeting the north leg
    G.vbar(10, H - 9, W - 7, 1, 4);                  // east leg, ditto
    G.hbar(3, W - 4, 10, 1, 4);                      // north leg
    var gx = 64;
    for (i = -4; i <= 4; i++) set(gx + i, H - 1, 5);
    for (y = H - 1; y >= H - 10; y--) for (x = -4; x <= 4; x++) {
      if (soft(get(gx + x, y))) set(gx + x, y, 1);
    }
    // two lots off the ring, striped
    function lot(x0, y0, x1, y1) {
      G.rect(x0, y0, x1, y1, 1);
      for (var sx = x0 + 3; sx <= x1 - 2; sx += 5) for (var sy = y0; sy <= y1; sy++) set(sx, sy, 10);
    }
    /* THE LOTS MUST TOUCH THE RING. The first pass left two rows of lawn between them
       and it read fine and was wrong: driveReachFromStreet came out 0.54, meaning a car
       could not get to half the pavement on the plot. A lot you cannot drive into is a
       painted rectangle. */
    lot(10, H - 26, 50, H - 9);
    lot(78, H - 26, 118, H - 9);

    // ---- act-1 dressing: dead trees along the walks, benches, dark pole lights ----
    for (i = 0; i < 90; i++) {
      var tx = 10 + Math.floor(G.rnd() * (W - 20)), ty = 10 + Math.floor(G.rnd() * (H - 26));
      if (get(tx, ty) === 4) { set(tx, ty, 3); set(tx + 1, ty, 3); set(tx, ty + 1, 3); set(tx + 1, ty + 1, 3); }
    }
    for (i = qx0 + 6; i < qx1 - 4; i += 14) {
      if (get(i, qcy - 3) === 4) set(i, qcy - 3, 11);
      if (get(i, qcy + 4) === 4) set(i, qcy + 4, 11);
    }
    for (i = 12; i < W - 12; i += 22) {
      if (get(i, H - 12) === 4 || get(i, H - 12) === 0) set(i, H - 12, 12);
      if (get(i, 18) === 4) set(i, 18, 12);
    }
    return g;
  }

  function generate(seed, opts) {
    opts = opts || {};
    var streets = opts.streets || ['S'];
    var soft = function (c) { return c === 0 || c === 3 || c === 4 || c === 6; };
    var res = K.rotateToStreet(buildCanonical(seed >>> 0), streets,
                               { gate: 5, pedWalk: 6, pedOver: soft, pedInset: 14 });
    var g = res.g;
    return { g: g, W: g[0].length, H: g.length, streets: streets, gates: res.gates,
             footprints: K.footprints(g, function (v) { return v === 2 || v === 8 || v === 9 || v === 13; }) };
  }
  function driveConnected(res) { return K.driveReachFromStreet(res.g, 1) > 0.85; }

  var PALETTE = {
    0: '#1c1a15', 1: '#33333c', 2: '#7a6f5c', 3: '#3a4526', 4: '#49512e', 5: '#c79a3f',
    6: '#6a675e', 7: '#4c5a5f', 8: '#857a64', 9: '#6e6553', 10: '#c9c1aa', 11: '#5a5344',
    12: '#b0863a', 13: '#807561', 14: '#4e5a5f'
  };

  var LEGEND = {
    0:  { name: 'desert dead-ground', kind: 'ground',    act1: 'bare Mojave dirt at the campus setback' },
    1:  { name: 'pavement / drive',   kind: 'drive',     act1: 'the ring road and the lots, cracked, weeds in the joints' },
    2:  { name: 'academic hall',      kind: 'building',  act1: 'a teaching hall facing the quad, glass out, doors chained, a noticeboard still full',
          enter: 'academic interior: a double-loaded corridor of classrooms and offices' },
    3:  { name: 'dead tree',          kind: 'tree-dead', act1: 'a campus tree gone to stick, the irrigation that kept it long dead', solid:true },
    4:  { name: 'quad (dead lawn)',   kind: 'ground',    act1: 'the quad, brown to the root — in the Mojave the lawn is the first thing to die' },
    5:  { name: 'gate / entrance',    kind: 'gate',      act1: 'the campus entrance off the street, amber curb, barrier arm up' },
    6:  { name: 'walkway / plaza',    kind: 'ground',    act1: 'the walks across the quad, on the diagonals people actually cut' },
    7:  { name: 'dry fountain',       kind: 'ground',    act1: 'the quad fountain, basin dry and silted, coins long gone' },
    8:  { name: 'library',            kind: 'building',  act1: 'the library, the biggest mass on the campus, colonnade facing the quad',
          enter: 'library interior: reading floor, stacks, study rooms off it' },
    9:  { name: 'residence hall',     kind: 'building',  act1: 'a residence hall set apart from the teaching core, every window dark',
          enter: 'residence interior: a corridor of rooms either side' },
    10: { name: 'white markings',     kind: 'marking',   act1: 'faded parking stall lines and court lines' },
    11: { name: 'bench / planter',    kind: 'prop',      act1: 'a quad bench or planter, slats split, the planting dead' },
    12: { name: 'pole light',         kind: 'prop',      act1: 'a campus pole light, head dark' },
    13: { name: 'lecture hall',       kind: 'building',  act1: 'the lecture hall, its fan plan legible from outside, doors open on tiered dark',
          enter: 'lecture interior: raked seating down to a single stage wall' },
    14: { name: 'rec court',          kind: 'ground',    act1: 'a dead outdoor court, slab cracked, lines ghosted, hoops bent' }
  };

  var NOTES = {
    summary: 'A dead community-college campus built around its QUAD: academic halls turned to face an open green heart with the walks cutting across it on the real desire lines, a library as the biggest mass, a fan-plan lecture hall, a residence row set apart, rec courts, and the parking pushed out to a ring road because a campus core is walkable on purpose.',
    reference: [
      'UNLV and CSN, the two campuses in this valley, plus standard American campus site planning: a central quad with diagonal walks; academic halls on three sides with their entrances facing IN; the library as the single biggest mass, usually colonnaded or raised; a lecture hall whose fan-shaped plan reads from outside; residence halls set apart from the teaching core; rec courts; parking at the ring.',
      'THE QUAD IS THE WHOLE DIFFERENCE between a campus and a business park. Buildings that face a shared middle are a campus; the same buildings facing a car park are an office estate.',
      'In the Mojave a quad is irrigated turf, so it is the first thing act 1 kills — the lawn is brown to the root and the fountain is dry.'
    ],
    layout: [
      'Dead lawn fills the plot inside a desert setback; the QUAD is a large open rectangle at the centre, crossed by two orthogonal walks and both diagonals, with the dry fountain where they meet.',
      'Academic halls stand on the west, east and north sides of the quad with their fronts turned in; the LIBRARY is the biggest single mass, on the north-east, with a colonnade of piers facing the quad.',
      'The LECTURE HALL is drawn as a real fan — it widens row by row — so its plan is legible from outside the way the reference ones are.',
      'A residence row of three halls sits along the south, apart from the teaching core; rec courts take the east lawn.',
      'The ring road runs the perimeter with ONE car entrance on the primary street (canonical south, rotated to the real street), feeding two striped lots. The core stays car-free.'
    ],
    circulation: 'Street-aware via canonical-south + K.rotateToStreet: one car entrance on the primary street opens onto a perimeter RING ROAD (code 1) that reaches both lots, so a car gets to every stall from the curb (K.driveReachFromStreet). Inside the ring the campus is deliberately pedestrian: the quad walks (6) knit every building entrance to every other, and the diagonals exist because that is the line people take. A corner cell gains a PEDESTRIAN gate on the side street, never a second car entrance.',
    layering: 'GROUND (walk): quad lawn (4), walkways and plaza (6), the dry fountain basin (7), rec courts (14), desert setback (0). GROUND (drive): the ring road and lots (1) with their stall markings (10). STRUCTURE (solid, ENTERABLE): academic halls (2), library (8), residence halls (9), lecture hall (13) — four different interiors, each named in this legend. PROPS (solid): pole lights (12), benches and planters (11). TREE-DEAD (pass): dead trees (3). PORTAL: the gate (5).',
    decisions: [
      'Paolo 7/26: build the world. 16 valley cells were flat; this is the largest single buildable landmark type left.',
      'THE QUAD IS THE HERO and it is sized to be the biggest open thing on the plot. A campus whose middle is a car park is not a campus, and that is the failure this layout is arranged to avoid.',
      'WALKABLE-LAND: buildings plus the quad dominate; pavement is the ring and two lots, connective tissue only.',
      'No university name, no mascot, no signage text — that is Paolo\'s to author if it ever matters. The signage reads dead.',
      'ACT TRIPTYCH: act-1 dead only. Act-2 and act-3 materials are [PENDING Paolo].'
    ]
  };

  K.register('campus', { generate: generate, body: function (c) { return c === 2 || c === 8 || c === 9 || c === 13; },
    category: K.category('campus') || 'institutional', palette: PALETTE, legend: LEGEND, notes: NOTES });

  var API = { generate: generate, driveConnected: driveConnected,
              footprints: function (r) { return r.footprints; },
              palette: PALETTE, legend: LEGEND, notes: NOTES };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaCampus = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
