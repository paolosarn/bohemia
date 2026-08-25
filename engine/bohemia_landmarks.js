// BOHEMIA LANDMARKS (8/19/26, WORLD lane). THE LAST FIVE DISTRICT TYPES IN THE VALLEY WITH
// NO MODULE AT ALL: convention (6 cells), prison (4), dam (4), minigp (1), fort (1).
// Sixteen cells that fell through to the generic placeholder -- one flat box on the tile --
// and the last buildable entries on gates/walked_surface_gate.js's named debt.
//
// EVERY ONE OF THEM IS A CLUSTER, WHICH IS WHY THEY ARE HERE TOGETHER AND NOT IN FIVE FILES.
// Measured in the seed valley: convention is one 3x2 blob, prison one 2x2, dam one 2x2. A
// convention centre is 288 m x 192 m and a cell is 96 m, so building each cell as its own
// little convention centre gives you SIX convention centres in a row -- the identical defect
// the airfield had before 7/26 and the Strip had before 8/18. So they are laid out in VALLEY
// COORDINATES against the bounds of the whole blob, and each cell copies its own window onto
// the plan. That is bohemia_airfield.js's pattern, verbatim, because it is the right one.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): COOKS ZERO PIXELS. It emits CODES. Every colour is a
// palette entry sitting inside the layer value bands the other districts already use, and the
// walked surface textures ground by the dossier's own `kind` (8/18) out of the harmonized
// street bank and the approved yard pool -- so `drive` here gets the same asphalt the
// arterial does with nothing hand-painted. Opened: engine/bohemia_airfield.js (the cluster
// pattern), engine/bohemia_jail.js (the secure-perimeter precedent), banks/BOHEMIA_STREET_
// POOLS_HARMONIZED_7_14_26.txt via records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md.
//
// THE PRISON HAS A PERIMETER, AND IT IS THE ONE EXCEPTION I AM DECLARING RATHER THAN HIDING.
// Paolo 8/16, LOCKED: "no perimeter walls until I tell you, bro no fencing no nothing bro."
// That ruling killed fences I had added to districts that never needed them, and it stands
// everywhere in this file except here: a prison's perimeter IS the building, and `jail`
// already ships a walled secure yard with four guard towers, approved and untouched since
// 7/19. Same class, same precedent, declared out loud in the reply so he can kill it in one
// word rather than discover it.
//
// ACT-1 DEAD throughout: the halls stripped, the yards empty, the turbines still, nothing lit.
(function (root) {
  var K = (typeof module !== 'undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);
  var T = 128;

  /* A CELL IS A WINDOW ONTO THE BLOB. Hands the builder valley-tile bounds plus a setter
     that silently drops anything outside this cell, so one plan paints every cell of the
     cluster and the seams line up by construction rather than by hoping. */
  function plan(seed, opts, build) {
    opts = opts || {};
    var G = K.grid(seed >>> 0), g = G.g, r = G.rnd;
    var cx = (opts.cellX || 0) * T, cy = (opts.cellY || 0) * T;
    var b = opts.bounds || { x0: opts.cellX || 0, x1: opts.cellX || 0,
                             y0: opts.cellY || 0, y1: opts.cellY || 0 };
    var X0 = b.x0 * T, X1 = (b.x1 + 1) * T - 1;
    var Y0 = b.y0 * T, Y1 = (b.y1 + 1) * T - 1;
    var api = {
      X0: X0, X1: X1, Y0: Y0, Y1: Y1, W: X1 - X0 + 1, H: Y1 - Y0 + 1, rnd: r,
      /* fractions of the whole blob, so a plan reads as proportions and not as pixels */
      fx: function (f) { return Math.round(X0 + (X1 - X0) * f); },
      fy: function (f) { return Math.round(Y0 + (Y1 - Y0) * f); },
      set: function (vx, vy, code) {
        var lx = vx - cx, ly = vy - cy;
        if (lx < 0 || ly < 0 || lx >= T || ly >= T) return;
        g[ly][lx] = code;
      },
      rect: function (x0, y0, x1, y1, code) {
        if (x1 < x0) { var t = x0; x0 = x1; x1 = t; }
        if (y1 < y0) { var t2 = y0; y0 = y1; y1 = t2; }
        var lo_x = Math.max(x0, cx), hi_x = Math.min(x1, cx + T - 1);
        var lo_y = Math.max(y0, cy), hi_y = Math.min(y1, cy + T - 1);
        for (var vy = lo_y; vy <= hi_y; vy++) for (var vx = lo_x; vx <= hi_x; vx++)
          g[vy - cy][vx - cx] = code;
      },
      /* GROUND IS NOT ONE THING, AND THAT IS WHY IT KEPT OWNING THE PLOT. Every one of
         these five is a small built thing on a big piece of open Mojave, so the background
         is honestly most of the cell -- and painted as ONE code it broke the monoblock law
         (nobody has ANSWERED FOR ground that big) five times over, and read as a flat field
         besides. Out there that ground is rock lag and hardpan in COHERENT PATCHES, never
         an even shuffle: banks/BOHEMIA_STREET_POOLS_HARMONIZED desert_dominance_law, Paolo
         7/14 -- "one dominant tile at 85%, accents in coherent clusters, per-cell random
         shuffle BANNED". So this lays patches, not noise: a few dozen blobs of a second
         ground code, sized in metres, only over the code it is told to replace. */
      scatter: function (over, code, blobs, r0, r1) {
        for (var b = 0; b < blobs; b++) {
          var cxv = X0 + Math.floor(r() * (X1 - X0)), cyv = Y0 + Math.floor(r() * (Y1 - Y0));
          var w = r0 + Math.floor(r() * (r1 - r0)), h = r0 + Math.floor(r() * (r1 - r0));
          for (var vy = cyv; vy < cyv + h; vy++) for (var vx = cxv; vx < cxv + w; vx++) {
            var lx2 = vx - cx, ly2 = vy - cy;
            if (lx2 < 0 || ly2 < 0 || lx2 >= T || ly2 >= T) continue;
            if (g[ly2][lx2] === over) g[ly2][lx2] = code;
          }
        }
      },
      ring: function (x0, y0, x1, y1, t, code) {
        api.rect(x0, y0, x1, y0 + t - 1, code); api.rect(x0, y1 - t + 1, x1, y1, code);
        api.rect(x0, y0, x0 + t - 1, y1, code); api.rect(x1 - t + 1, y0, x1, y1, code);
      }
    };
    build(api);
    return g;
  }

  function spec(name, category, body, palette, legend, notes, build, base) {
    K.register(name, {
      generate: function (seed, opts) {
        var g = plan(seed, opts, function (a) { a.rect(a.X0, a.Y0, a.X1, a.Y1, base || 0); build(a); });
        return { g: g, W: T, H: T, streets: (opts && opts.streets) || ['S'], gates: [],
                 footprints: K.footprints(g, body) };
      },
      body: body, category: category, palette: palette, legend: legend, notes: notes
    });
  }

  /* ============================ CONVENTION ============================
     The Las Vegas Convention Center: about 200 acres, and what it IS from above is
     ENORMOUS COLUMN-FREE BOXES. Exhibit halls are the whole building; the concourse is a
     thin glazed spine threading them; and the back of every hall is a WALL OF LOADING
     DOCKS onto a truck marshalling yard, because a hall's real job is swallowing a
     hundred semi-trailers of freight in two days. */
  var CONV_PAL = { 0: '#5c564a', 1: '#3f3d38', 2: '#726a5b', 3: '#4a4030', 4: '#8a8072',
                   5: '#c2a86a', 6: '#8e8a80', 7: '#5f5a52', 8: '#2e2a24', 9: '#8f8676',
                   10: '#55555f', 11: '#c9c1aa', 12: '#a49a86', 13: '#b8b4a4', 14: '#6d6552', 15: '#7e7566' };
  var CONV_LEG = {
    0: { name: 'apron', kind: 'ground', act1: 'the cracked concrete apron between the halls, weeds in every joint' },
    1: { name: 'service drive', kind: 'drive', act1: 'the truck marshalling drive along the dock wall (car-drivable)' },
    2: { name: 'exhibit hall', kind: 'building', act1: 'an exhibit hall: a column-free box the size of a city block, blind on three sides', enter: 'the hall floor: acres of sealed concrete under a dead ceiling grid, booth numbers still taped down' },
    3: { name: 'dry planter', kind: 'tree-dead', act1: 'a planter gone to dust', solid: false },
    4: { name: 'hall roof plant', kind: 'structure', act1: 'the roof plant field: air handlers and duct runs the length of the hall' },
    5: { name: 'drive entrance', kind: 'gate', act1: 'the curb cut off the street, no barrier', solid: false },
    6: { name: 'concourse', kind: 'building', act1: 'the glazed concourse spine threading the halls, most panes starred', enter: 'the concourse: a long glass corridor, registration counters shoved aside' },
    7: { name: 'dock apron', kind: 'ground', act1: 'the dock apron, oil-black where the trailers stood' },
    8: { name: 'dock door', kind: 'portal', act1: 'a roll-up dock door standing open onto the hall floor', solid: false },
    9: { name: 'pole light', kind: 'prop', act1: 'a yard light on its stem, head dark' },
    10: { name: 'abandoned trailer', kind: 'vehicle', act1: 'a semi-trailer left backed into its dock' },
    11: { name: 'lane marking', kind: 'marking', act1: 'faded dock lane numbers' },
    12: { name: 'entry plaza', kind: 'walk', act1: 'the entry plaza pavers, drifted with grit' },
    13: { name: 'hall skylight', kind: 'structure', act1: 'a skylight band punched through the hall roof, most panes starred and one gone through' },
    14: { name: 'rock lag', kind: 'ground', act1: 'rock lag and hardpan through the apron, the desert coming back where nothing is parked' },
    15: { name: 'west hall', kind: 'building', act1: 'the newer hall: the same column-free box, built decades later and taller, with a curved roof instead of a flat one', enter: 'the west hall floor: newer concrete, a higher ceiling, and the same acres of nothing' }
  };
  var CONV_NOTES = {
    summary: 'The convention centre: two ENORMOUS column-free exhibit halls filling the blob, a glazed concourse spine threading them, and a WALL OF LOADING DOCKS onto a truck marshalling yard along the back — which is what the building is actually for.',
    reference: ['Las Vegas Convention Center (~200 acres, ~4.6 million sq ft across North/Central/South/West halls). From above the building IS its exhibit halls: column-free boxes a city block across, blind on three sides, with the roof plant field the only texture on them. A thin glazed concourse threads the halls and carries registration. The back of every hall is a dock wall onto a marshalling yard, because a hall\'s real job is swallowing a hundred semi-trailers of freight in two days.'],
    layout: ['TWO HALLS fill most of the blob, side by side along its long axis, each one column-free and blind.',
      'The CONCOURSE is a thin glazed spine between them, running the long axis, and is the only glass on the building.',
      'The DOCK WALL runs the whole back edge: roll-up doors onto a dock apron and a marshalling drive with trailers still backed in.',
      'The ENTRY PLAZA is on the primary street frontage. No canopy over it (Paolo 8/2).'],
    circulation: 'The service DRIVE (code 1) enters at curb cuts off the street and runs the length of the dock wall, so a truck reaches every door. Pedestrians cross the entry plaza (12) into the concourse (6); the dock doors (8) are portals onto the hall floor.',
    layering: 'GROUND: apron (0), service drive (1) + markings (11), dock apron (7), entry plaza (12), curb cuts (5), dry planters (3). STRUCTURE (solid, ¾ face): the EXHIBIT HALLS (2, ENTERABLE), the CONCOURSE (6, ENTERABLE), the roof plant (4). PORTAL: dock doors (8). PROPS: pole lights (9), abandoned trailers (10). The halls are one low enormous plate; nothing else on the site has height.',
    decisions: ['CLUSTER-BUILT: 6 cells, one 3x2 blob, laid in valley coordinates so it is ONE convention centre and not six.',
      'No fence, no perimeter wall, no canopy (Paolo 8/16 and 8/2). The hall wall is the edge.',
      'NO NAME, NO OWNER, NO FACTION anywhere (MECHANISM-MINE / CONTENTS-PAOLO\'S).',
      'ACT TRIPTYCH: act-1 dead only. Act 2 and 3 are [PENDING Paolo].']
  };
  spec('convention', 'civic', function (c) { return c === 2 || c === 4 || c === 6 || c === 13 || c === 15; },
    CONV_PAL, CONV_LEG, CONV_NOTES, function (a) {
      var hallTop = a.fy(0.16), hallBot = a.fy(0.72), mid = a.fy(0.44);
      a.rect(a.fx(0.04), hallTop, a.fx(0.47), hallBot, 2);          // hall A
      /* TWO HALLS, NOT ONE MASS. The LVCC's halls were built decades apart and read as
         different buildings from the air -- the newer one taller with a curved roof. Drawn
         as one code they were 33% of the plot between them, which is the monoblock law's
         complaint and also just wrong about the building. */
      a.rect(a.fx(0.53), hallTop, a.fx(0.96), hallBot, 15);         // the west hall
      a.rect(a.fx(0.47) + 1, hallTop, a.fx(0.53) - 1, hallBot, 6);  // the concourse spine
      for (var f = 0.08; f < 0.95; f += 0.09) {                      // roof plant on both halls
        if (f > 0.44 && f < 0.56) continue;
        a.rect(a.fx(f), a.fy(0.20), a.fx(f + 0.045), a.fy(0.30), 4);
        a.rect(a.fx(f), a.fy(0.56), a.fx(f + 0.045), a.fy(0.66), 4);
        /* SKYLIGHT BANDS. A hall this size is daylit from above or it is a cave, and a roof
           drawn as one flat plate is the "they all look exactly the same" note again. */
        a.rect(a.fx(f), a.fy(0.34), a.fx(f + 0.055), a.fy(0.38), 13);
        a.rect(a.fx(f), a.fy(0.44), a.fx(f + 0.055), a.fy(0.48), 13);
      }
      a.rect(a.X0, a.fy(0.02), a.X1, a.fy(0.10), 1);                 // marshalling drive
      a.rect(a.X0, a.fy(0.10) + 1, a.X1, hallTop - 1, 7);            // dock apron
      for (var d = 0.06; d < 0.95; d += 0.055) {                     // the dock wall
        a.rect(a.fx(d), hallTop, a.fx(d + 0.028), hallTop + 1, 8);
        if (a.rnd() < 0.45) a.rect(a.fx(d), a.fy(0.04), a.fx(d + 0.028), a.fy(0.09), 10);
      }
      for (var m = 0.08; m < 0.95; m += 0.10) a.rect(a.fx(m), a.fy(0.06), a.fx(m + 0.01), a.fy(0.06), 11);
      a.rect(a.X0, hallBot + 1, a.X1, a.fy(0.90), 12);               // entry plaza
      for (var p = 0.06; p < 0.96; p += 0.08) a.set(a.fx(p), a.fy(0.88), 9);
      a.rect(a.X0, a.fy(0.90) + 1, a.X1, a.Y1, 0);
      a.rect(a.fx(0.10), a.Y1 - 1, a.fx(0.16), a.Y1, 5);
      a.rect(a.fx(0.84), a.Y1 - 1, a.fx(0.90), a.Y1, 5);
      a.rect(a.fx(0.10), a.fy(0.91), a.fx(0.16), a.Y1, 1);
      a.rect(a.fx(0.84), a.fy(0.91), a.fx(0.90), a.Y1, 1);
      for (var i = 0; i < 26; i++) {
        var px = a.X0 + Math.floor(a.rnd() * a.W), py = a.fy(0.90) + Math.floor(a.rnd() * (a.Y1 - a.fy(0.90)));
        if (a.rnd() < 0.4) a.set(px, py, 3);
      }
      a.scatter(0, 14, 70, 6, 22);
    }, 0);

  /* ============================== PRISON ==============================
     A Nevada desert correctional facility (High Desert / Southern Desert, Indian Springs):
     housing UNITS around a central services core, each with its own fenced exercise yard,
     the whole thing inside a DOUBLE PERIMETER with guard towers at the corners and a
     sally-port vehicle trap. Administration sits OUTSIDE the wire, which is the tell that
     separates a prison from any other institutional campus. */
  var PRIS_PAL = { 0: '#6b6355', 1: '#3f3d38', 2: '#7a7264', 3: '#4a4030', 4: '#8c8274',
                   5: '#c2a86a', 6: '#6a6558', 7: '#8a8a92', 8: '#2e2a24', 9: '#8f8676',
                   10: '#55555f', 11: '#5f5a52', 12: '#9a9184', 13: '#8a7f66', 14: '#75694f' };
  var PRIS_LEG = {
    0: { name: 'compound dirt', kind: 'ground', act1: 'the graded dirt of the compound, nothing growing on it' },
    1: { name: 'service road', kind: 'drive', act1: 'the perimeter service road and the sally-port lane (car-drivable)' },
    2: { name: 'housing unit', kind: 'building', act1: 'a housing unit: a long single-storey block with a slot window every cell', enter: 'a dayroom with two tiers of cell doors around it, every door standing open' },
    3: { name: 'dead scrub', kind: 'tree-dead', act1: 'dead scrub against the wire', solid: false },
    4: { name: 'unit roof', kind: 'structure', act1: 'the unit roof with its swamp coolers, every fan still' },
    5: { name: 'sally port', kind: 'gate', act1: 'the sally-port vehicle trap, both gates hanging open', solid: false },
    6: { name: 'exercise yard', kind: 'ground', act1: 'a yard of packed dirt with a bare backboard at one end' },
    7: { name: 'perimeter fence', kind: 'fence', act1: 'the double perimeter: two chain-link runs with razor coil between them, cut through in one place' },
    8: { name: 'unit door', kind: 'portal', act1: 'a unit door standing open onto the dayroom', solid: false },
    9: { name: 'guard tower', kind: 'structure', act1: 'a corner guard tower on its legs, glass gone, nobody in it', enter: 'the tower cab: a swivel chair, a dead phone, and the whole compound below you' },
    10: { name: 'abandoned vehicle', kind: 'vehicle', act1: 'a transport van left in the sally port' },
    11: { name: 'services core', kind: 'building', act1: 'the services core: kitchen, laundry and infirmary in one block at the middle', enter: 'the core: steam kettles cold, the infirmary cabinets emptied first' },
    12: { name: 'administration', kind: 'building', act1: 'the administration building, OUTSIDE the wire', enter: 'admin: a counter, a visitor bench, and files pulled out onto the floor' },
    13: { name: 'outside ground', kind: 'ground', act1: 'the desert outside the wire — never graded, never walked, creosote coming back into it' },
    14: { name: 'rock lag', kind: 'ground', act1: 'rock lag and creosote in patches outside the wire, the desert taking it back' }
  };
  var PRIS_NOTES = {
    summary: 'A Nevada desert prison: four housing units around a central services core, each with its own exercise yard, inside a double perimeter with corner guard towers and a sally-port vehicle trap — and the administration building sitting OUTSIDE the wire, which is the tell.',
    reference: ['High Desert State Prison / Southern Desert Correctional Center, Indian Springs NV. A modern desert facility is a campus, not a cellblock: long single-storey HOUSING UNITS arranged around a central SERVICES CORE (kitchen, laundry, infirmary), each unit with its own fenced exercise yard; a DOUBLE PERIMETER of chain-link with razor coil and electronic detection between the runs; GUARD TOWERS at the corners; a SALLY-PORT vehicle trap as the only way a vehicle enters; and ADMINISTRATION outside the wire so visitors never cross it.'],
    layout: ['FOUR HOUSING UNITS on the diagonals around a central SERVICES CORE, each with its own exercise yard.',
      'The DOUBLE PERIMETER rings the compound with a service road inside it and GUARD TOWERS at the four corners.',
      'The SALLY PORT is the only vehicle way in, on the primary street.',
      'ADMINISTRATION is outside the wire, between the sally port and the street.'],
    circulation: 'The service ROAD (code 1) runs the inside of the perimeter and out through the sally port to the street, so a vehicle reaches every unit. On foot the compound is deliberately hard: the yards are enclosed, and the one cut in the wire is the way out.',
    layering: 'GROUND: compound dirt (0), service road (1), exercise yards (6), dead scrub (3), sally port (5). STRUCTURE (solid): HOUSING UNITS (2, ENTERABLE -> a dayroom), the SERVICES CORE (11, ENTERABLE), ADMINISTRATION (12, ENTERABLE), GUARD TOWERS (9, ENTERABLE -> the cab), unit roofs (4), and the PERIMETER FENCE (7, two tiles tall per the 8/2 wall law). PORTAL: unit doors (8). PROPS: abandoned vehicle (10).',
    decisions: ['CLUSTER-BUILT: 4 cells, one 2x2 blob, laid in valley coordinates so it is ONE prison.',
      'THE PERIMETER IS THE DECLARED EXCEPTION to Paolo 8/16 ("no perimeter walls until I tell you"). A prison\'s perimeter IS the building, and `jail` already ships a walled secure yard with four guard towers, approved since 7/19. Same class, same precedent — declared out loud rather than hidden, and one word kills it.',
      'ONE CUT IN THE WIRE, because a district that cannot be left is a prison in the wrong sense (Paolo 8/1: "make sure I cant be locked in any certain district ever again").',
      'NO NAME, NO OWNER, NO FACTION, and nobody in it. Who is inside is Paolo\'s.',
      'ACT TRIPTYCH: act-1 dead only.']
  };
  spec('prison', 'civic', function (c) { return c === 2 || c === 4 || c === 9 || c === 11 || c === 12; },
    PRIS_PAL, PRIS_LEG, PRIS_NOTES, function (a) {
      var pw = 3;
      /* OUTSIDE THE WIRE IS NOT THE COMPOUND. The compound is graded and beaten flat; the
         desert beyond it never was, and that difference is the most legible thing about a
         prison from the air. */
      a.rect(a.X0, a.Y0, a.X1, a.Y1, 13);
      a.ring(a.fx(0.06), a.fy(0.06), a.fx(0.94), a.fy(0.80), pw, 7);        // outer run
      a.ring(a.fx(0.09), a.fy(0.10), a.fx(0.91), a.fy(0.76), pw, 7);        // inner run
      a.rect(a.fx(0.12), a.fy(0.13), a.fx(0.88), a.fy(0.73), 0);
      a.ring(a.fx(0.12), a.fy(0.13), a.fx(0.88), a.fy(0.73), 5, 1);         // service road inside
      var uy0 = a.fy(0.20), uy1 = a.fy(0.36), uy2 = a.fy(0.50), uy3 = a.fy(0.66);
      [[0.18, 0.46], [0.54, 0.82]].forEach(function (xs) {
        a.rect(a.fx(xs[0]), uy0, a.fx(xs[1]), uy1, 2);                      // housing units
        a.rect(a.fx(xs[0]), uy2, a.fx(xs[1]), uy3, 2);
        a.rect(a.fx(xs[0] + 0.03), uy0 + 3, a.fx(xs[1] - 0.03), uy0 + 7, 4);
        a.rect(a.fx(xs[0] + 0.03), uy2 + 3, a.fx(xs[1] - 0.03), uy2 + 7, 4);
        a.rect(a.fx((xs[0] + xs[1]) / 2 - 0.02), uy1, a.fx((xs[0] + xs[1]) / 2 + 0.02), uy1 + 1, 8);
        a.rect(a.fx((xs[0] + xs[1]) / 2 - 0.02), uy2 - 1, a.fx((xs[0] + xs[1]) / 2 + 0.02), uy2, 8);
        a.rect(a.fx(xs[0]), uy1 + 2, a.fx(xs[1]), uy2 - 2, 6);              // exercise yard
      });
      a.rect(a.fx(0.47), a.fy(0.30), a.fx(0.53), a.fy(0.58), 11);           // services core
      [[0.06, 0.06], [0.94, 0.06], [0.06, 0.80], [0.94, 0.80]].forEach(function (t) {  // towers
        a.rect(a.fx(t[0]) - 4, a.fy(t[1]) - 4, a.fx(t[0]) + 4, a.fy(t[1]) + 4, 9);
      });
      var sx = a.fx(0.50);
      /* A SALLY PORT PIERCES BOTH FENCES OR IT IS NOT A SALLY PORT (8/25). This ran from
         fy(0.80) to fy(0.88) -- which is entirely OUTSIDE the outer wire. It touched neither
         fence run and never reached the service road, so the prison's whole internal road
         network was sealed: 9.6% of 1,826 drive tiles reachable from the street, RULE NUMBER
         ONE (Paolo 7/31) broken outright. A vehicle could drive up to the prison and then had
         nowhere to go, and the approach road led to a box.
         What a sally port IS: a vehicle trap with a gate at EACH end, cut through the double
         perimeter so a transport enters, both gates never open at once, and it comes out on
         the compound road. So it now spans from just inside the road ring (fy 0.74) down to
         the approach road, cutting the inner run at 0.76 and the outer run at 0.80 on the way
         -- which is the only reason either of those runs has a gap in it. Drawn after the
         fences on purpose: the gap IS what is being cut. */
      a.rect(sx - 7, a.fy(0.74), sx + 7, a.fy(0.88), 5);                    // sally port
      a.rect(sx - 5, a.fy(0.88), sx + 5, a.Y1, 1);
      a.rect(sx - 4, a.fy(0.82), sx - 3, a.fy(0.86), 10);
      a.rect(a.fx(0.62), a.fy(0.84), a.fx(0.82), a.fy(0.94), 12);           // admin, OUTSIDE the wire
      /* ONE CUT IN THE WIRE: a district you cannot leave is the wrong kind of prison. */
      a.rect(a.fx(0.94) - pw, a.fy(0.40), a.fx(0.94), a.fy(0.46), 0);
      a.rect(a.fx(0.91) - pw, a.fy(0.40), a.fx(0.91), a.fy(0.46), 0);
      for (var i = 0; i < 30; i++) {
        var px = a.X0 + Math.floor(a.rnd() * a.W), py = a.fy(0.80) + Math.floor(a.rnd() * (a.Y1 - a.fy(0.80)));
        if (a.rnd() < 0.35) a.set(px, py, 3);
      }
      a.scatter(13, 14, 60, 8, 26);
    }, 0);

  /* =============================== DAM ================================
     Hoover Dam. An arch-gravity wall wedged across a canyon, four INTAKE TOWERS standing in
     the reservoir upstream, a spillway cut into each canyon wall, the POWERHOUSE in a U at
     the downstream toe, and the road across the crest. Act 1: the lake is far down the
     bathtub ring and the turbines are still. */
  var DAM_PAL = { 0: '#7a6f5c', 1: '#3f3d38', 2: '#9a948a', 3: '#3a5a72', 4: '#8e8880',
                  5: '#c2a86a', 6: '#6f6a60', 7: '#b6ae9c', 8: '#2e2a24', 9: '#8f8676',
                  10: '#55555f', 11: '#5a5346', 12: '#4a4a54', 13: '#655c4c', 14: '#8a8076' };
  var DAM_LEG = {
    0: { name: 'canyon rock', kind: 'ground', act1: 'bare canyon rock, blasted flat where the works needed it' },
    1: { name: 'crest road', kind: 'drive', act1: 'the two-lane road across the dam crest (car-drivable)' },
    2: { name: 'dam wall', kind: 'building', act1: 'the arch-gravity wall itself, a concrete curve wedged into the canyon', enter: 'a gallery inside the dam: wet concrete, a walkway, and the hum that is not there any more' },
    3: { name: 'reservoir', kind: 'water', act1: 'what is left of the reservoir, a long way below the white mineral ring it used to reach', solid: false },
    4: { name: 'intake tower', kind: 'building', act1: 'an intake tower standing out of the water on its own plinth', enter: 'the tower head: a gantry, a dead hoist, and the shaft going straight down' },
    5: { name: 'road entrance', kind: 'gate', act1: 'where the crest road meets the canyon road', solid: false },
    6: { name: 'spillway', kind: 'ground', act1: 'a spillway: a concrete funnel cut into the canyon wall, dry for twenty years', solid: false },
    7: { name: 'bathtub ring', kind: 'ground', act1: 'the bathtub ring — the white mineral band the water left on the rock as it dropped' },
    8: { name: 'gallery door', kind: 'portal', act1: 'a steel door into the dam gallery, standing open', solid: false },
    9: { name: 'transmission tower', kind: 'prop', act1: 'a transmission tower marching up the canyon wall, lines down' },
    10: { name: 'abandoned vehicle', kind: 'vehicle', act1: 'a car left on the crest where the road closed' },
    11: { name: 'powerhouse', kind: 'building', act1: 'the powerhouse in its U at the toe of the dam', enter: 'the generator hall: a row of housings the size of rooms, every one silent' },
    12: { name: 'tailrace', kind: 'water', act1: 'the tailrace below the powerhouse, a slow green channel', solid: false },
    13: { name: 'talus apron', kind: 'ground', act1: 'the talus apron below the works — broken rock the blasting left, tipped down the canyon side' },
    14: { name: 'pale rock band', kind: 'ground', act1: 'a pale band in the canyon rock where the strata change, running out of the wall' }
  };
  var DAM_NOTES = {
    summary: 'The dam: an arch-gravity wall wedged across the canyon with the road on its crest, four intake towers standing out of the reservoir upstream, a spillway cut into each canyon wall, and the powerhouse in a U at the downstream toe. Act 1: the lake is a long way below its own bathtub ring and the turbines are still.',
    reference: ['Hoover Dam: arch-gravity concrete, 726 ft high, 1,244 ft along the crest, wedged into Black Canyon. FOUR intake towers stand upstream, two on each side. TWO spillways are cut into the canyon walls as enormous open funnels. The POWERHOUSE is a U-shaped wing at the downstream toe. Transmission towers climb the canyon walls at angles no other structure is built at. US-93 ran across the crest until the bypass bridge opened in 2010.'],
    layout: ['The DAM WALL crosses the blob, curved upstream, with the CREST ROAD along its top.',
      'The RESERVOIR is upstream of the wall, drawn far below the BATHTUB RING it used to reach.',
      'FOUR INTAKE TOWERS stand out of the water, two per side.',
      'A SPILLWAY is cut into each canyon wall beside the dam; the POWERHOUSE is a U at the downstream toe with the TAILRACE below it.'],
    circulation: 'The CREST ROAD (code 1) crosses the wall and meets the canyon road at both ends, so a car drives across. On foot the gallery door (8) is the way INTO the dam; the powerhouse and the intake towers are the other three volumes.',
    layering: 'GROUND: canyon rock (0), crest road (1), spillways (6), the bathtub ring (7). WATER (not solid, not walkable): reservoir (3), tailrace (12). STRUCTURE (solid): the DAM WALL (2, ENTERABLE -> a gallery), INTAKE TOWERS (4, ENTERABLE), the POWERHOUSE (11, ENTERABLE). PORTAL: gallery door (8). PROPS: transmission towers (9), abandoned vehicle (10). The wall is the vertical event; everything else hangs off it.',
    decisions: ['CLUSTER-BUILT: 4 cells, one 2x2 blob, so it is ONE dam and not four.',
      'THE BATHTUB RING is drawn because it is the single most legible fact about this lake in the last twenty years, and the `water` district already carries it — same feature, same reading, one valley.',
      'NO NAME, NO OWNER, NO FACTION. Who holds the dam is the biggest unruled question on the map and it is Paolo\'s (MECHANISM-MINE / CONTENTS-PAOLO\'S). The boss ladder\'s own dam entry stays untouched by this file.',
      'ACT TRIPTYCH: act-1 dead only — the turbines are still and nothing is generating.']
  };
  spec('dam', 'infrastructure', function (c) { return c === 2 || c === 4 || c === 11; },
    DAM_PAL, DAM_LEG, DAM_NOTES, function (a) {
      var crest = a.fy(0.46), half = Math.max(6, Math.round(a.H * 0.05));
      a.rect(a.X0, a.Y0, a.X1, crest - half - 1, 3);                        // reservoir
      a.rect(a.X0, crest - half - Math.round(a.H * 0.05), a.X1, crest - half - 1, 7); // bathtub ring
      /* the wall, curved upstream: a shallow arc across the canyon */
      for (var vx = a.X0; vx <= a.X1; vx++) {
        var t = (vx - a.X0) / Math.max(1, a.W - 1);
        var bow = Math.round(Math.sin(t * Math.PI) * a.H * 0.06);
        a.rect(vx, crest - half - bow, vx, crest + half - bow, 2);
        /* THE ROAD ACROSS THE CREST WAS TWO TILES WIDE, WHICH IS 1.5 METRES (8/25). At
           TILE=0.75 m that is a footpath, not the highway that ran over Hoover Dam for
           seventy years, and it is exactly the defect Paolo circled on the mall: "he circled
           two of them and asked what they were supposed to be". The hairline check said 0% of
           this district's lanes were wide enough to drive and it was right.
           SEVEN TILES = 5.25 m: two lanes at a bit over 2.5 m each, which is what a crest road
           genuinely is -- narrow, with a parapet either side, no shoulder. The three tiles of
           wall left on each side are that parapet. Seen from above a dam crest IS mostly road;
           the mass you read as the dam is the downstream face, and this view foreshortens it. */
        a.rect(vx, crest - bow - 3, vx, crest - bow + 3, 1);
      }
      [0.18, 0.34, 0.66, 0.82].forEach(function (f) {                       // intake towers
        a.rect(a.fx(f) - 5, crest - half - Math.round(a.H * 0.16), a.fx(f) + 5, crest - half - Math.round(a.H * 0.07), 4);
      });
      a.rect(a.X0, crest + half, a.fx(0.10), a.fy(0.72), 6);                // spillways
      a.rect(a.fx(0.90), crest + half, a.X1, a.fy(0.72), 6);
      a.rect(a.fx(0.30), a.fy(0.62), a.fx(0.70), a.fy(0.78), 11);           // powerhouse U
      a.rect(a.fx(0.42), a.fy(0.62), a.fx(0.58), a.fy(0.71), 0);
      a.rect(a.fx(0.30), a.fy(0.80), a.fx(0.70), a.Y1, 12);                 // tailrace
      a.rect(a.fx(0.48), crest + half - 2, a.fx(0.52), crest + half, 8);    // gallery door
      a.rect(a.X0, a.fy(0.80), a.fx(0.28), a.Y1, 13);                       // talus apron
      a.rect(a.fx(0.72), a.fy(0.80), a.X1, a.Y1, 13);
      [0.06, 0.14, 0.86, 0.94].forEach(function (f) {                       // transmission towers
        a.rect(a.fx(f) - 2, a.fy(0.84), a.fx(f) + 2, a.fy(0.88), 9);
      });
      a.rect(a.fx(0.20), crest - 3, a.fx(0.21), crest + 1, 10);
      a.rect(a.X0, crest - 2, a.X0 + 3, crest + 3, 5);
      a.rect(a.X1 - 3, crest - 2, a.X1, crest + 3, 5);
      a.scatter(0, 14, 55, 8, 24);
      a.scatter(3, 7, 30, 6, 18);
    }, 0);

  /* ============================== MINIGP ==============================
     A kart circuit: a road course with real corners, a pit lane down one side with the
     paddock behind it, tyre-wall barriers on the outside of every turn, and a timing tower
     at the start line. One cell, so it is not a cluster — a kart track fits in 96 m. */
  var GP_PAL = { 0: '#6e6552', 1: '#3a3a42', 2: '#7a7264', 3: '#4a4030', 4: '#8a8072',
                 5: '#c2a86a', 6: '#8f8a80', 7: '#5f5a52', 8: '#2e2a24', 9: '#8f8676',
                 10: '#55555f', 11: '#c9c1aa', 12: '#7d4a3a', 13: '#7f7560', 14: '#6b6350' };
  var GP_LEG = {
    0: { name: 'infield dirt', kind: 'ground', act1: 'the infield: packed dirt and dead scrub inside the circuit' },
    1: { name: 'circuit', kind: 'drive', act1: 'the kart circuit itself, seal-coated asphalt gone grey and rubber-streaked' },
    2: { name: 'paddock building', kind: 'building', act1: 'the paddock building behind the pits', enter: 'the paddock: kart stands, a tyre rack and a bench with the tools gone' },
    3: { name: 'dead scrub', kind: 'tree-dead', act1: 'dead scrub through the infield', solid: false },
    4: { name: 'paddock roof', kind: 'structure', act1: 'the paddock roof, one sheet lifted and folded back' },
    5: { name: 'drive entrance', kind: 'gate', act1: 'the way in off the street, no barrier', solid: false },
    6: { name: 'pit lane', kind: 'drive', act1: 'the pit lane down the inside of the straight, boxes still numbered' },
    7: { name: 'run-off', kind: 'ground', act1: 'gravel run-off on the outside of the fast corners' },
    8: { name: 'paddock door', kind: 'portal', act1: 'the paddock roller door standing open', solid: false },
    9: { name: 'timing tower', kind: 'structure', act1: 'the timing tower over the start line, the board blank', enter: 'the tower: a desk, a dead PA amp and the whole circuit in front of you' },
    10: { name: 'abandoned kart', kind: 'vehicle', act1: 'a kart left where it stopped, bodywork cracked' },
    11: { name: 'start line', kind: 'marking', act1: 'the start line and grid boxes, worn to ghosts' },
    12: { name: 'tyre barrier', kind: 'fence', act1: 'a tyre wall on the outside of the turn, stacked and strapped, some burst' },
    13: { name: 'outfield', kind: 'ground', act1: 'the ground outside the circuit, never sealed — dirt, scrub and the odd tyre that got away' },
    14: { name: 'rock lag', kind: 'ground', act1: 'rock lag through the outfield where nothing was ever graded' }
  };
  var GP_NOTES = {
    summary: 'A kart circuit: a road course with real corners, a pit lane down the inside of the straight with the paddock behind it, tyre walls on the outside of every turn, gravel run-off at the fast ones, and a timing tower over the start line.',
    reference: ['A club-level kart circuit is a road course of roughly half a mile: a main straight with the PIT LANE down its inside and the PADDOCK behind that, a mix of hairpins and sweepers, TYRE WALLS strapped in stacks on the outside of every turn, gravel RUN-OFF where the entry speed is highest, and a TIMING TOWER over the start line.'],
    layout: ['The CIRCUIT is a closed loop filling the cell, with a long main straight and a hairpin at each end.',
      'The PIT LANE runs the inside of the main straight; the PADDOCK BUILDING is behind it.',
      'TYRE BARRIERS line the outside of every turn; gravel RUN-OFF sits at the two fastest corners.',
      'The TIMING TOWER stands over the start line.'],
    circulation: 'The circuit and the pit lane are one connected DRIVE surface (codes 1 and 6) entering off the street at the paddock gate, so a vehicle can get onto the track. On foot the infield is open and the paddock (8) is the way inside.',
    layering: 'GROUND: infield dirt (0), the circuit (1) and pit lane (6) as drive, run-off (7), start line (11), the entrance (5), dead scrub (3). STRUCTURE (solid): the PADDOCK (2, ENTERABLE), its roof (4), the TIMING TOWER (9, ENTERABLE), the TYRE BARRIERS (12, two tiles tall per the 8/2 wall law). PORTAL: the paddock door (8). PROPS: abandoned karts (10).',
    decisions: ['ONE CELL, so no cluster: a kart circuit genuinely fits in 96 m and does not need one.',
      'The tyre wall is a BARRIER, not a perimeter fence — it lines the turns, it does not ring the plot (Paolo 8/16).',
      'NO NAME, NO OWNER, NO FACTION.',
      'ACT TRIPTYCH: act-1 dead only.']
  };
  spec('minigp', 'leisure', function (c) { return c === 2 || c === 4 || c === 9; },
    GP_PAL, GP_LEG, GP_NOTES, function (a) {
      var W = 9;
      /* OUTSIDE THE CIRCUIT IS NOT THE INFIELD. The infield is inside the loop and mown
         flat; everything beyond the tyre walls is just desert with a fence line. */
      a.rect(a.X0, a.Y0, a.X1, a.Y1, 13);
      function band(x0, y0, x1, y1, code) { a.rect(x0, y0, x1, y1, code); }
      var L = a.fx(0.10), R = a.fx(0.90), Tp = a.fy(0.14), B = a.fy(0.80);
      /* THE INFIELD IS INSIDE THE LOOP and is a different surface from the outfield --
         mown flat, driven over, inside the barriers. Painting the whole cell `outfield`
         and then laying the circuit on it left BOTH sides of the track reading as the
         same ground, which is how one code came to own 54% of the plot. */
      a.rect(L, Tp, R, B, 0);
      band(L, Tp, R, Tp + W, 1);                                            // top straight
      band(L, B - W, R, B, 1);                                              // main straight
      band(L, Tp, L + W, B, 1);                                             // left hairpin side
      band(R - W, Tp, R, B, 1);                                             // right side
      band(a.fx(0.34), a.fy(0.34), a.fx(0.34) + W, B - W, 1);               // an infield kink
      band(a.fx(0.34), a.fy(0.34), a.fx(0.66), a.fy(0.34) + W, 1);
      band(a.fx(0.66), a.fy(0.34), a.fx(0.66) + W, a.fy(0.56), 1);
      band(L + W + 1, B - W - 7, R - W - 1, B - W - 1, 6);                  // pit lane
      a.rect(a.fx(0.30), B - W - 1, a.fx(0.34), B - W, 11);                 // start line
      a.rect(L + W + 1, a.fy(0.86), a.fx(0.62), a.fy(0.96), 2);             // paddock
      a.rect(L + W + 6, a.fy(0.88), a.fx(0.56), a.fy(0.90), 4);
      a.rect(a.fx(0.28), a.fy(0.86) - 1, a.fx(0.33), a.fy(0.86), 8);
      a.rect(a.fx(0.36), a.fy(0.82), a.fx(0.44), a.fy(0.86), 9);            // timing tower
      [[L - 4, Tp - 4, R + 4, Tp - 1], [L - 4, B + 1, R + 4, B + 4],
       [L - 4, Tp - 4, L - 1, B + 4], [R + 1, Tp - 4, R + 4, B + 4]].forEach(function (t) {
        a.rect(t[0], t[1], t[2], t[3], 12);                                 // tyre walls
      });
      a.rect(L - 12, Tp - 12, L - 5, Tp - 5, 7);                            // run-off
      a.rect(R + 5, B + 5, R + 12, B + 12, 7);
      /* THE PIT ENTRANCE (8/25). This district's own circulation note says "the circuit and
         the pit lane are one connected DRIVE surface entering off the street at the paddock
         gate, so a vehicle can get onto the track". IT DID NOT. The entrance ran five tiles
         in from the kerb and stopped in open outfield, and the tyre barrier was an unbroken
         ring around the whole circuit -- so the track and the pit lane were a sealed island
         and the karts would have had to be built inside it. Measured 0.0% of 4,929 drive
         tiles reachable from the street, which is RULE NUMBER ONE (Paolo 7/31) broken outright
         in a district whose notes claimed the opposite. A note is not a fact until a generator
         writes it.
         Every club circuit has this: an ACCESS GAP in the barrier at the paddock end, where
         the karts are wheeled out onto the circuit. The entrance now runs from the kerb, up
         the clear strip beside the paddock, and through that gap onto the main straight --
         which the pit lane already joins. Drawn AFTER the tyre walls on purpose, because the
         gap IS the thing being cut in them. */
      a.rect(a.fx(0.62), B + 1, a.fx(0.68), a.Y1, 1);
      a.rect(a.fx(0.62), a.Y1 - 1, a.fx(0.68), a.Y1, 5);
      for (var i = 0; i < 3; i++) a.rect(a.fx(0.44 + i * 0.09), B - W - 5, a.fx(0.46 + i * 0.09), B - W - 3, 10);
      for (var j = 0; j < 30; j++) {
        var px = a.fx(0.14) + Math.floor(a.rnd() * (a.fx(0.84) - a.fx(0.14)));
        var py = a.fy(0.20) + Math.floor(a.rnd() * (a.fy(0.74) - a.fy(0.20)));
        if (a.rnd() < 0.35) a.set(px, py, 3);
      }
      a.scatter(13, 14, 65, 7, 22);
    }, 0);

  /* =============================== FORT ================================
     The Old Las Vegas Mormon Fort, 1855: an adobe square about 150 ft on a side with a
     bastion at one corner, built beside Las Vegas Creek — the reason a city is here at all.
     One original adobe building survives. It is the oldest structure in the valley and the
     only thing on this map that predates everything else by a century. */
  var FORT_PAL = { 0: '#8a7a5e', 1: '#3f3d38', 2: '#a08a66', 3: '#4a4030', 4: '#b09a72',
                   5: '#c2a86a', 6: '#5f7a4a', 7: '#7a6a50', 8: '#2e2a24', 9: '#8f8676',
                   10: '#55555f', 11: '#c9c1aa', 12: '#3a6a72', 13: '#9a8a68', 14: '#84744f' };
  var FORT_LEG = {
    0: { name: 'dust yard', kind: 'ground', act1: 'the beaten dust of the fort yard, a century and a half of it' },
    1: { name: 'track', kind: 'drive', act1: 'the dirt track up to the gate (car-drivable)' },
    2: { name: 'adobe wall', kind: 'building', act1: 'the adobe curtain wall, mud brick under a century of weather, slumped in two places', enter: 'inside the wall thickness: a store room, cool, dark, smelling of earth' },
    3: { name: 'dead mesquite', kind: 'tree-dead', act1: 'dead mesquite along the creek line', solid: false },
    4: { name: 'adobe building', kind: 'building', act1: 'THE original adobe building — the oldest standing structure in the valley', enter: 'one room with a beamed ceiling, a hearth, and a floor of packed earth' },
    5: { name: 'fort gate', kind: 'gate', act1: 'the gap where the fort gate hung', solid: false },
    6: { name: 'creek grass', kind: 'ground', act1: 'the last grass in the valley, along the creek, because the spring never stopped', solid: false },
    7: { name: 'bastion', kind: 'building', act1: 'the corner bastion, higher than the wall, with a view down the creek', enter: 'the bastion: a ladder, a platform and loopholes onto three sides' },
    8: { name: 'doorway', kind: 'portal', act1: 'a doorway in the adobe, no door left in it', solid: false },
    9: { name: 'post', kind: 'prop', act1: 'a corral post standing on its own' },
    10: { name: 'abandoned vehicle', kind: 'vehicle', act1: 'a park truck left outside the wall' },
    11: { name: 'interpretive path', kind: 'walk', act1: 'the visitor path, its plaques prised off' },
    12: { name: 'creek', kind: 'water', act1: 'Las Vegas Creek: still running, which is the whole reason a city is here', solid: false },
    13: { name: 'open desert', kind: 'ground', act1: 'the desert outside the fort, untouched since before any of this' },
    14: { name: 'creosote flat', kind: 'ground', act1: 'creosote in its evenly spaced grid outside the walls — they poison each other roots, which is why the spacing is even' }
  };
  var FORT_NOTES = {
    summary: 'The Old Mormon Fort: an adobe square with a corner bastion beside Las Vegas Creek, one original adobe building still standing inside it — the oldest structure in the valley, and the reason a city is here at all.',
    reference: ['Old Las Vegas Mormon Fort State Historic Park. Built 1855 as an adobe square roughly 150 ft on a side with a bastion at one corner, sited on Las Vegas Creek — the spring that made the valley a stop on the Spanish Trail and the reason a city exists here. One original adobe building survives; the rest of the walls are reconstruction on the footprint.'],
    layout: ['The ADOBE SQUARE fills the middle of the cell with a BASTION at one corner and the GATE on the primary street side.',
      'THE ORIGINAL ADOBE BUILDING stands inside the square against one wall.',
      'LAS VEGAS CREEK runs down one side with the only living grass in the valley along it.',
      'An interpretive path loops the outside; a dirt track comes up to the gate.'],
    circulation: 'The dirt TRACK (code 1) comes off the street to the gate. On foot the gate (5) is the way into the square, the doorway (8) the way into the adobe building, and the interpretive path (11) loops the outside.',
    layering: 'GROUND: dust yard (0), the track (1), creek grass (6), interpretive path (11), dead mesquite (3). WATER: the creek (12). STRUCTURE (solid): the ADOBE WALL (2, ENTERABLE -> a store room in the wall thickness), THE ADOBE BUILDING (4, ENTERABLE), the BASTION (7, ENTERABLE). PORTAL: the gate (5) and the doorway (8). PROPS: corral posts (9), a park truck (10).',
    decisions: ['ONE CELL. The real fort is about 150 ft square and fits inside 96 m with room for the creek.',
      'THE ADOBE WALL IS THE BUILDING, not a perimeter fence — it is the fort (Paolo 8/16 stands everywhere else in this file).',
      'THE CREEK STILL RUNS and the grass beside it is the only living green in the valley. That is a real fact about the site, not a mood: the spring is why the city exists. Whether anyone is using it is Paolo\'s.',
      'NO NAME, NO OWNER, NO FACTION, nobody in it.']
  };
  spec('fort', 'civic', function (c) { return c === 2 || c === 4 || c === 7; },
    FORT_PAL, FORT_LEG, FORT_NOTES, function (a) {
      /* THE YARD IS INSIDE THE WALLS. A century and a half of boots beat that flat; the
         desert outside never was, and the fort reads as a fort because of the difference. */
      a.rect(a.X0, a.Y0, a.X1, a.Y1, 13);
      a.rect(a.fx(0.62), a.Y0, a.fx(0.72), a.Y1, 6);                        // creek grass
      a.rect(a.fx(0.65), a.Y0, a.fx(0.69), a.Y1, 12);                       // the creek
      /* THE FORT FILLS ITS PLOT. At 0.12-0.56 across it was a small square in a big field
         of desert -- 62% of the cell one code, and the WALKABLE-LAND law's own complaint:
         a thin feature stranded in empty ground. The real fort is about 150 ft square, and
         a 96 m cell is 315 ft, so it genuinely takes most of the plot with the creek beside
         it. */
      var L = a.fx(0.06), R = a.fx(0.60), Tp = a.fy(0.10), B = a.fy(0.86);
      a.ring(L, Tp, R, B, 4, 2);                                            // adobe curtain wall
      a.rect(L + 4, Tp + 4, R - 4, B - 4, 0);                               // the yard
      a.rect(L - 3, Tp - 3, L + 8, Tp + 8, 7);                              // corner bastion
      a.rect(a.fx(0.12), a.fy(0.62), a.fx(0.34), a.fy(0.80), 4);            // THE adobe building
      a.rect(a.fx(0.20), a.fy(0.62) - 1, a.fx(0.24), a.fy(0.62), 8);
      a.rect(a.fx(0.40), a.fy(0.16), a.fx(0.56), a.fy(0.34), 4);            // the second range
      a.rect(a.fx(0.28), B - 3, a.fx(0.38), B, 5);                          // the gate
      a.ring(L - 9, Tp - 9, R + 9, B + 9, 2, 11);                           // interpretive path
      /* THE TRACK IS DRAWN AFTER THE PATH, AND THAT IS THE WHOLE FIX (8/25). The interpretive
         path is a loop around the fort and its bottom run crosses the access track. It was
         drawn second, so it PAINTED OVER the track and cut it clean in two -- 52.9% of the
         fort's drive surface unreachable from the street, RULE NUMBER ONE (Paolo 7/31) broken
         by a footpath. Where a path meets a drive on a real site the path crosses AT GRADE and
         the drive runs through; you do not lift the road out and put gravel in the gap. So the
         track goes down last and the path crosses it, which is also what it looks like. */
      a.rect(a.fx(0.29), B, a.fx(0.37), a.Y1, 1);
      a.rect(a.fx(0.40), a.fy(0.78), a.fx(0.41), a.fy(0.82), 10);
      for (var i = 0; i < 8; i++) a.set(a.fx(0.16 + i * 0.05), a.fy(0.80), 9);
      for (var j = 0; j < 26; j++) {
        var px = a.fx(0.58) + Math.floor(a.rnd() * (a.fx(0.80) - a.fx(0.58)));
        var py = a.Y0 + Math.floor(a.rnd() * a.H);
        if (a.rnd() < 0.3) a.set(px, py, 3);
      }
      a.scatter(13, 14, 75, 6, 20);
    }, 0);

  var API = { plan: plan };
  if (typeof module !== 'undefined') module.exports = API;
  root.BohemiaLandmarks = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
